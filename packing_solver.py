"""CP-SAT geometric packing, with lexicographic backpack-only stash objectives."""
import copy
import time
import threading
from collections import deque
from ortools.sat.python import cp_model


def coordinate_patterns(entries, index, axis, limit, rotate):
    """Coordinates of a compact packing are sums of other item edges.

    Each item contributes at most one edge, even when it can rotate. This
    retains a compact representative of every feasible rectangle packing.
    """
    sums = {0}
    for j, (item, _) in enumerate(entries):
        if j == index:
            continue
        edges = {item['ow' if axis == 'x' else 'oh']}
        if rotate:
            edges.update((item['ow'], item['oh']))
        sums |= {s + edge for s in sums for edge in edges if s + edge <= limit}
    return sorted(sums)


def solve_packing(data, notify=lambda message: None, cancel=None):
    def cancelled_before_search():
        if cancel is not None and cancel.is_set():
            notify({'type': 'complete', 'result': None, 'visited': 0, 'reason': 'stopped'})
            return True
        return False
    if cancelled_before_search():
        return None
    entries = []
    for entry in data['items']:
        # Ignore legacy/non-backpack entries before quantities, limits or variables.
        if entry.get('it', {}).get('cat') != 'bag':
            continue
        for number in range(1, min(100, max(0, int(entry['qty']))) + 1):
            entries.append((entry['it'], f"{entry['it']['id']}#{number}"))
    if len(entries) > 150:
        raise ValueError('單次配置最多支援 150 個背包，請分批規劃。')
    n = len(entries)
    blocked_families = {it.get('nestFamily') for it, _ in entries
                        if it.get('nestFamily') and it.get('blockSameFamily')}
    def equivalence(it):
        # Names/colors do not affect packing. Preserve distinctions that affect
        # ancestry restrictions.
        return (it['ow'], it['oh'],
                tuple((sp['w'], sp['h']) for sp in it['comp']),
                it.get('allowBags', True), bool(it.get('onlyMeds')),
                it.get('nestFamily') if it.get('nestFamily') in blocked_families else '',
                bool(it.get('blockSameFamily')))
    entries.sort(key=lambda entry: repr(equivalence(entry[0])))
    groups = [equivalence(it) for it, _ in entries]
    cap = lambda it: sum(sp['w'] * sp['h'] for sp in it['comp'])
    area = lambda it: it['ow'] * it['oh']
    outer = {'id': 'stash', 'n': '倉庫', 'en': 'Stash', 'cat': 'stash', 'ow': data.get('stashW', 10), 'oh': data.get('stashH', 28), 'comp': [{'w': data.get('stashW', 10), 'h': data.get('stashH', 28)}], 'allowBags': True}
    if not n:
        root = {**outer, 'uid': 'stash#1', 'depth': 0, 'location': None,
                'children': [], 'spaces': [{**sp, 'cells': [None] * (sp['w'] * sp['h'])} for sp in outer['comp']]}
        output = dict(root=root, unplaced=[], included=0, total=0, packedBags=0,
                      allBagsPacked=True, free=cap(outer), used=0, before=0, after=0,
                      saving=0, optimal=True, visited=0, elapsedSeconds=0, resumeHint=[])
        notify(dict(type='complete', result=output, visited=0, reason='optimal'))
        return output
    model = cp_model.CpModel()
    containers = [(i, it) for i, (it, _) in enumerate(entries)
                  if it.get('allowBags', True) and not it.get('onlyMeds') and it['comp']]
    containers.append((-1, outer))
    # Build the geometric compatibility graph before allocating solver variables.
    candidates = [[] for _ in entries]
    descendants = {}
    for i, (it, _) in enumerate(entries):
        if cancelled_before_search():
            return None
        for parent, parent_it in containers:
            if parent == i:
                continue
            if it.get('nestFamily') and it.get('nestFamily') == parent_it.get('nestFamily') and (it.get('blockSameFamily') or parent_it.get('blockSameFamily')):
                continue
            if parent >= 0 and groups[parent] == groups[i] and parent > i:
                continue
            for ci, sp in enumerate(parent_it['comp']):
                fits = it['ow'] <= sp['w'] and it['oh'] <= sp['h']
                turned = data['rotate'] and it['oh'] <= sp['w'] and it['ow'] <= sp['h']
                if fits or turned:
                    candidates[i].append((parent, ci, sp))
                    descendants.setdefault(parent, set()).add(i)
    # A bag that cannot be reached from a stash cannot participate at all.
    minimum_depth = {-1: 0}
    queue = deque(minimum_depth)
    while queue:
        parent = queue.popleft()
        d = minimum_depth[parent] + 1
        if d > data['depth']:
            continue
        for child in descendants.get(parent, ()):
            if child not in minimum_depth:
                minimum_depth[child] = d
                queue.append(child)
    for i in range(n):
        candidates[i] = [(p, ci, sp) for p, ci, sp in candidates[i]
                         if p in minimum_depth and minimum_depth[p] < data['depth']
                         and i in minimum_depth]
    maximum = max([1] + [max(sp['w'], sp['h']) for _, it in containers for sp in it['comp']])
    present = [model.new_bool_var(f'present{i}') for i in range(n)]
    depth = [model.new_int_var(0, data['depth'], f'depth{i}') for i in range(n)]
    x, y = [], []
    for i, (it, _) in enumerate(entries):
        for axis, variables, edge in [('x', x, 'w'), ('y', y, 'h')]:
            minimum_edge = min(it['ow'], it['oh']) if data['rotate'] else it['ow' if axis == 'x' else 'oh']
            limit = max([0] + [sp[edge] - minimum_edge for _, _, sp in candidates[i]])
            patterns = coordinate_patterns(entries, i, axis, limit, data['rotate'])
            variables.append(model.new_int_var_from_domain(cp_model.Domain.from_values(patterns), f'{axis}{i}'))
    rotation, width, height, links, bins = [], [], [], [[] for _ in entries], {}
    link_count = 0
    for i, (it, _) in enumerate(entries):
        if cancelled_before_search():
            return None
        r = model.new_bool_var(f'rotate{i}')
        if not data['rotate'] or it['ow'] == it['oh']:
            model.add(r == 0)
        rotation.append(r)
        w = model.new_int_var(min(it['ow'], it['oh']), max(it['ow'], it['oh']), f'w{i}')
        h = model.new_int_var(min(it['ow'], it['oh']), max(it['ow'], it['oh']), f'h{i}')
        model.add(w == it['ow'] + (it['oh'] - it['ow']) * r)
        model.add(h == it['oh'] + (it['ow'] - it['oh']) * r)
        width.append(w); height.append(h)
        model.add(depth[i] == 0).only_enforce_if(present[i].Not())
        model.add(x[i] == 0).only_enforce_if(present[i].Not())
        model.add(y[i] == 0).only_enforce_if(present[i].Not())
        model.add(r == 0).only_enforce_if(present[i].Not())
        if i in minimum_depth:
            model.add(depth[i] >= minimum_depth[i]).only_enforce_if(present[i])
        # Endpoints belong to the item, not to each of its candidate containers.
        ex = model.new_int_var(0, maximum + max(it['ow'], it['oh']), f'ex{i}')
        ey = model.new_int_var(0, maximum + max(it['ow'], it['oh']), f'ey{i}')
        model.add(ex == x[i] + w); model.add(ey == y[i] + h)
        for parent, ci, sp in candidates[i]:
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
            ix = model.new_optional_interval_var(x[i], w, ex, p, f'ix{i}_{parent}_{ci}')
            iy = model.new_optional_interval_var(y[i], h, ey, p, f'iy{i}_{parent}_{ci}')
            intervals = bins.setdefault((parent, ci), ([], [], []))
            intervals[0].append(ix); intervals[1].append(iy)
            intervals[2].append((i, p))
        model.add(sum(p for _, _, p in links[i]) == present[i])
        if i and groups[i - 1] == groups[i]:
            model.add(present[i - 1] >= present[i])
            model.add(depth[i - 1] <= depth[i]).only_enforce_if(present[i])
    for (parent, ci), (ix, iy, members) in bins.items():
        model.add_no_overlap_2d(ix, iy)
        sp = outer['comp'][ci] if parent == -1 else entries[parent][0]['comp'][ci]
        # A cheap linear bound rejects impossible container structures before
        # spending effort on their coordinates.
        model.add(sum(area(entries[i][0]) * link for i, link in members)
                  <= sp['w'] * sp['h'] * (1 if parent == -1 else present[parent]))
        # Identical siblings have one canonical spatial order. Ancestors remain
        # unrestricted; their labels are already ordered by depth above.
        for pos, (i, link) in enumerate(members):
            for j, other in members[pos + 1:]:
                if groups[i] == groups[j]:
                    model.add(y[i] * (maximum + 1) + x[i]
                              < y[j] * (maximum + 1) + x[j]).only_enforce_if([link, other])
    # Propagate family ancestry through parent links, including indirect nesting.
    families = {it.get('nestFamily') for it, _ in entries if it.get('blockSameFamily') and it.get('nestFamily')}
    for family in sorted(families):
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
                    for parent, _, link in links[i]:
                        model.add(flag == (flags[blocked_only][parent] if parent >= 0 else 0)).only_enforce_if(link)
        for i, (it, _) in enumerate(entries):
            if it.get('nestFamily') == family:
                for parent, _, link in links[i]:
                    if parent >= 0:
                        model.add(flags[not bool(it.get('blockSameFamily'))][parent] == 0).only_enforce_if(link)
    top_area = [area(it) * link for i, (it, _) in enumerate(entries)
                for parent, _, link in links[i] if parent == -1]
    maximum_capacity = cap(outer)
    free = model.new_int_var(0, maximum_capacity, 'free')
    model.add(free == maximum_capacity - sum(top_area))
    # Unused space across the entire tree bounds free space in the stash.
    model.add(free <= maximum_capacity
              + sum((cap(it) - area(it)) * present[i] for i, (it, _) in enumerate(entries)))
    # One more packed bag outweighs every possible difference in stash free space.
    model.maximize(sum(present) * (maximum_capacity + 1) + free)
    # Resume from the last feasible assignment. CP-SAT starts a fresh search;
    # hints retain the incumbent, not the previous internal search tree.
    hint = data.get('resumeHint')
    if isinstance(hint, list) and len(hint) == len(model.proto.variables):
        valid_hint = all(isinstance(value, int) and any(var.domain[k] <= value <= var.domain[k + 1]
                         for k in range(0, len(var.domain), 2))
                         for var, value in zip(model.proto.variables, hint))
        if valid_hint:
            for index, value in enumerate(hint):
                model.add_hint(model.get_int_var_from_proto_index(index), value)
    solver = cp_model.CpSolver()
    solver.parameters.num_search_workers = 2
    if not data.get('unlimited', False):
        solver.parameters.max_time_in_seconds = 15
    solver.parameters.max_memory_in_mb = 256

    def result(values, optimal=False, branches=0):
        def make(it, uid, d):
            return {**copy.deepcopy(it), 'uid': uid, 'depth': d, 'location': None, 'children': [], 'spaces': [{**sp, 'cells': [None] * (sp['w'] * sp['h'])} for sp in it['comp']]}
        nodes = {i: make(it, uid, values(depth[i])) for i, (it, uid) in enumerate(entries) if values(present[i])}
        root_node = make(outer, 'stash#1', 0)
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
        bags = len(nodes)
        before = sum(area(it) for it, _ in entries)
        after = used + sum(area(it) for it in missing)
        return {'root': root_node, 'unplaced': missing, 'included': bags, 'total': n, 'packedBags': bags, 'allBagsPacked': bags == n, 'free': values(free), 'used': used, 'before': before, 'after': after, 'saving': before - after, 'optimal': optimal, 'visited': branches,
                'resumeHint': [values(model.get_int_var_from_proto_index(index))
                               for index in range(len(model.proto.variables))]}

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
        if cancelled_before_search():
            return None
        status = solver.solve(model, Updates())
    finally:
        done.set()
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        output = result(solver.value, status == cp_model.OPTIMAL, solver.num_branches)
        output['elapsedSeconds'] = solver.wall_time
        notify({'type': 'complete', 'result': output, 'visited': solver.num_branches,
                'reason': 'optimal' if status == cp_model.OPTIMAL else
                          'stopped' if cancel is not None and cancel.is_set() else 'limit'})
        return output
    if status == cp_model.MODEL_INVALID:
        raise ValueError(solver.solution_info())
    notify({'type': 'complete', 'result': None, 'visited': solver.num_branches,
            'reason': 'stopped' if cancel is not None and cancel.is_set() else
                      'limit' if status == cp_model.UNKNOWN else 'infeasible'})
    return None
