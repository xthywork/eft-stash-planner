"""CP-SAT geometric packing, with lexicographic bag/free-space/rig objectives."""
import copy
import time
import threading
from ortools.sat.python import cp_model


def solve_packing(data, notify=lambda message: None, cancel=None):
    entries = []
    for entry in data['items']:
        for number in range(1, min(100, max(0, int(entry['qty']))) + 1):
            entries.append((entry['it'], f"{entry['it']['id']}#{number}"))
    if len(entries) > 150:
        raise ValueError('單次配置最多支援 150 件裝備，請分批規劃。')
    n = len(entries)
    stash = data['mode'] == 'stash'
    bag_indices = [i for i, (it, _) in enumerate(entries) if it['cat'] == 'bag']
    rig_indices = [i for i in range(n) if i not in bag_indices]
    if not stash and not bag_indices:
        notify({'type': 'complete', 'result': None, 'visited': 0})
        return None
    model = cp_model.CpModel()
    cap = lambda it: sum(sp['w'] * sp['h'] for sp in it['comp'])
    area = lambda it: it['ow'] * it['oh']
    outer = {'id': 'stash', 'n': '倉庫', 'en': 'Stash', 'cat': 'stash', 'ow': data.get('stashW', 10), 'oh': data.get('stashH', 28), 'comp': [{'w': data.get('stashW', 10), 'h': data.get('stashH', 28)}], 'allowBags': True}
    containers = [(i, it) for i, (it, _) in enumerate(entries) if it['cat'] == 'bag']
    if stash:
        containers.append((-1, outer))
    maximum = max([100] + [max(sp['w'], sp['h']) for _, it in containers for sp in it['comp']])
    present = [model.new_bool_var(f'present{i}') for i in range(n)]
    roots = [model.new_bool_var(f'root{i}') for i in range(n)]
    depth = [model.new_int_var(0, data['depth'], f'depth{i}') for i in range(n)]
    x = [model.new_int_var(0, maximum, f'x{i}') for i in range(n)]
    y = [model.new_int_var(0, maximum, f'y{i}') for i in range(n)]
    rotation, width, height, links, bins = [], [], [], [[] for _ in entries], {}
    link_count = 0
    for i, (it, _) in enumerate(entries):
        r = model.new_bool_var(f'rotate{i}')
        if not data['rotate'] or it['ow'] == it['oh']:
            model.add(r == 0)
        rotation.append(r)
        w = model.new_int_var(min(it['ow'], it['oh']), max(it['ow'], it['oh']), f'w{i}')
        h = model.new_int_var(min(it['ow'], it['oh']), max(it['ow'], it['oh']), f'h{i}')
        model.add(w == it['ow'] + (it['oh'] - it['ow']) * r)
        model.add(h == it['oh'] + (it['ow'] - it['oh']) * r)
        width.append(w); height.append(h)
        allowed_root = not stash and i in bag_indices and (data['target'] == 'auto' or data['target'] == it['id'])
        # Identical copies are interchangeable: only their first copy can be the root.
        if not allowed_root or any(entries[j][0]['id'] == it['id'] for j in range(i)):
            model.add(roots[i] == 0)
        model.add(depth[i] == 1).only_enforce_if(roots[i])
        model.add(r == 0).only_enforce_if(roots[i])
        model.add(depth[i] == 0).only_enforce_if(present[i].Not())
        for parent, parent_it in containers:
            if parent == i or parent_it.get('onlyMeds') or (it['cat'] == 'bag' and not parent_it.get('allowBags', True)):
                continue
            if it['cat'] == 'bag' and it.get('nestFamily') and it.get('nestFamily') == parent_it.get('nestFamily') and (it.get('blockSameFamily') or parent_it.get('blockSameFamily')):
                continue
            if parent >= 0 and parent_it['id'] == it['id'] and parent > i:
                continue  # relabel identical nested copies parent-first
            for ci, sp in enumerate(parent_it['comp']):
                fits = it['ow'] <= sp['w'] and it['oh'] <= sp['h']
                fits_rotated = data['rotate'] and it['oh'] <= sp['w'] and it['ow'] <= sp['h']
                if not (fits or fits_rotated):
                    continue
                link_count += 1
                if link_count > 20_000:
                    raise ValueError('配置的候選容器關係過多，請分批規劃。')
                p = model.new_bool_var(f'link{i}_{parent}_{ci}')
                links[i].append((parent, ci, p))
                model.add(x[i] + w <= sp['w']).only_enforce_if(p)
                model.add(y[i] + h <= sp['h']).only_enforce_if(p)
                if parent >= 0:
                    model.add(p <= present[parent])
                    model.add(depth[i] == depth[parent] + 1).only_enforce_if(p)
                else:
                    model.add(depth[i] == 1).only_enforce_if(p)
                ex = model.new_int_var(0, maximum * 2, f'ex{i}_{parent}_{ci}')
                ey = model.new_int_var(0, maximum * 2, f'ey{i}_{parent}_{ci}')
                ix = model.new_optional_interval_var(x[i], w, ex, p, f'ix{i}_{parent}_{ci}')
                iy = model.new_optional_interval_var(y[i], h, ey, p, f'iy{i}_{parent}_{ci}')
                intervals = bins.setdefault((parent, ci), ([], []))
                intervals[0].append(ix); intervals[1].append(iy)
        model.add(sum(p for _, _, p in links[i]) + roots[i] == present[i])
        if i and entries[i - 1][0]['id'] == it['id']:
            model.add(present[i - 1] >= present[i])
            model.add(depth[i - 1] <= depth[i]).only_enforce_if(present[i])
    if not stash:
        model.add(sum(roots) == 1)
    for ix, iy in bins.values():
        model.add_no_overlap_2d(ix, iy)
    # Propagate family ancestry through parent links, including indirect nesting.
    families = {it.get('nestFamily') for it, _ in entries if it.get('blockSameFamily') and it.get('nestFamily')}
    for family in families:
        flags = {}
        for blocked_only in (False, True):
            flags[blocked_only] = [model.new_bool_var(f'family{family}_{blocked_only}_{i}') for i in range(n)]
            for i, (it, _) in enumerate(entries):
                flag = flags[blocked_only][i]
                own = it.get('nestFamily') == family and (not blocked_only or it.get('blockSameFamily'))
                if own:
                    model.add(flag == present[i])
                else:
                    model.add(flag == 0).only_enforce_if(present[i].Not())
                    model.add(flag == 0).only_enforce_if(roots[i])
                    for parent, _, link in links[i]:
                        model.add(flag == (flags[blocked_only][parent] if parent >= 0 else 0)).only_enforce_if(link)
        for i, (it, _) in enumerate(entries):
            if it['cat'] == 'bag' and it.get('nestFamily') == family:
                for parent, _, link in links[i]:
                    if parent >= 0:
                        model.add(flags[not bool(it.get('blockSameFamily'))][parent] == 0).only_enforce_if(link)
    top_area = []
    for i, (it, _) in enumerate(entries):
        for parent, _, link in links[i]:
            if parent == -1:
                top_area.append(area(it) * link)
            else:
                top = model.new_bool_var(f'top{i}_{parent}_{len(top_area)}')
                model.add(top <= link); model.add(top <= roots[parent]); model.add(top >= link + roots[parent] - 1)
                top_area.append(area(it) * top)
    maximum_capacity = cap(outer) if stash else max(cap(entries[i][0]) for i in bag_indices)
    free = model.new_int_var(0, maximum_capacity, 'free')
    model.add(free == (cap(outer) if stash else sum(cap(it) * roots[i] for i, (it, _) in enumerate(entries))) - sum(top_area))
    rig_weight = len(rig_indices) + 1
    bag_weight = maximum_capacity * rig_weight + len(rig_indices) + 1
    model.maximize(sum(present[i] for i in bag_indices) * bag_weight + free * rig_weight + sum(present[i] for i in rig_indices))
    solver = cp_model.CpSolver()
    solver.parameters.num_search_workers = 2
    solver.parameters.max_time_in_seconds = 15
    solver.parameters.max_memory_in_mb = 256

    def result(values, optimal=False, branches=0):
        def make(it, uid, d):
            return {**copy.deepcopy(it), 'uid': uid, 'depth': d, 'location': None, 'children': [], 'spaces': [{**sp, 'cells': [None] * (sp['w'] * sp['h'])} for sp in it['comp']]}
        nodes = {i: make(it, uid, values(depth[i])) for i, (it, uid) in enumerate(entries) if values(present[i])}
        root_node = make(outer, 'stash#1', 0) if stash else nodes[next(i for i in nodes if values(roots[i]))]
        used = 0
        for i, child in nodes.items():
            for parent, ci, link in links[i]:
                if not values(link):
                    continue
                target = root_node if parent == -1 else nodes[parent]
                loc = {'ci': ci, 'x': values(x[i]), 'y': values(y[i]), 'w': values(width[i]), 'h': values(height[i]), 'rot': bool(values(rotation[i]))}
                child['location'] = loc; target['children'].append(child)
                sp = target['spaces'][ci]
                for yy in range(loc['y'], loc['y'] + loc['h']):
                    for xx in range(loc['x'], loc['x'] + loc['w']):
                        sp['cells'][yy * sp['w'] + xx] = child['uid']
                if target is root_node:
                    used += area(child)
        missing = [it for i, (it, _) in enumerate(entries) if i not in nodes]
        bags = sum(i in nodes for i in bag_indices); rigs = sum(i in nodes for i in rig_indices)
        before = sum(area(it) for it, _ in entries)
        after = (used if stash else area(root_node)) + sum(area(it) for it in missing)
        return {'root': root_node, 'unplaced': missing, 'included': len(nodes) - (0 if stash else 1), 'total': n, 'packedBags': bags, 'packedRigs': rigs, 'allBagsPacked': bags == len(bag_indices), 'free': values(free), 'used': used, 'before': before, 'after': after, 'saving': before - after, 'optimal': optimal, 'visited': branches}

    class Updates(cp_model.CpSolverSolutionCallback):
        last = 0
        def on_solution_callback(self):
            if time.monotonic() - self.last < .25:
                return
            self.last = time.monotonic()
            notify({'type': 'solution', 'result': result(self.value, branches=self.num_branches), 'visited': self.num_branches})
    done = threading.Event()
    def watch_cancel():
        while not done.wait(.1):
            if cancel is not None and cancel.is_set():
                solver.stop_search()
                return
    if cancel is not None:
        threading.Thread(target=watch_cancel, daemon=True).start()
    try:
        status = solver.solve(model, Updates())
    finally:
        done.set()
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        output = result(solver.value, status == cp_model.OPTIMAL, solver.num_branches)
        output['elapsedSeconds'] = solver.wall_time
        notify({'type': 'complete', 'result': output, 'visited': solver.num_branches})
        return output
    if status == cp_model.MODEL_INVALID:
        raise ValueError(solver.solution_info())
    raise ValueError('尚未找到可行配置，請減少裝備數量或調整收納設定。' if status == cp_model.UNKNOWN else '目前設定無可行配置。')
