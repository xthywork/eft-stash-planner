"""Exact type-pattern model for chains ending in copies of one terminal type.

Return None when applicability cannot be proved, (result,) after solving.
"""

import copy
import threading
import time

from ortools.sat.python import cp_model


def solve_chain_patterns(data, entries, groups, notify, cancel, make_node):
    unique = list(dict.fromkeys(groups))
    if len(unique) < 2 or len(unique) > 8:
        return None
    pools = [
        [entry for entry, group in zip(entries, groups) if group == key]
        for key in unique
    ]
    items = [pool[0][0] for pool in pools]
    quantities = [len(pool) for pool in pools]
    if any(it.get("blockSameFamily") for it in items):
        return None

    def orientations(it):
        return [(it["ow"], it["oh"], False)] + (
            [(it["oh"], it["ow"], True)]
            if data["rotate"] and it["ow"] != it["oh"]
            else []
        )

    def fitting(it, sp):
        return [
            (w, h, r) for w, h, r in orientations(it) if w <= sp["w"] and h <= sp["h"]
        ]

    areas = [it["ow"] * it["oh"] for it in items]
    active = []
    for it in items:
        spaces = (
            [
                (ci, sp)
                for ci, sp in enumerate(it["comp"])
                if any(fitting(child, sp) for child in items)
            ]
            if it.get("allowBags", True) and not it.get("onlyMeds")
            else []
        )
        if len(spaces) > 1:
            return None
        active.append(spaces[0] if spaces else None)
    terminals = [i for i, sp in enumerate(active) if sp is None]
    if len(terminals) != 1:
        return None
    terminal = terminals[0]
    edges = [[] for _ in items]
    leaves = [None for _ in items]
    for i, region in enumerate(active):
        if region is None:
            continue
        ci, sp = region
        feasible = [j for j, it in enumerate(items) if fitting(it, sp)]
        # A container child must occupy the compartment alone. Area is a
        # conservative sufficient proof; unsupported geometries fall back.
        for j in feasible:
            if j != terminal:
                if any(areas[j] + areas[k] <= sp["w"] * sp["h"] for k in feasible):
                    return None
                w, h, r = fitting(items[j], sp)[0]
                edges[i].append(
                    (j, {"ci": ci, "x": 0, "y": 0, "w": w, "h": h, "rot": r})
                )
        fits = fitting(items[terminal], sp)
        if fits:
            upper = min(quantities[terminal], sp["w"] * sp["h"] // areas[terminal])
            w, h, r = max(
                fits, key=lambda whr: (sp["w"] // whr[0]) * (sp["h"] // whr[1])
            )
            if (sp["w"] // w) * (sp["h"] // h) < upper:
                if upper == 2 and not any(
                    aw + bw <= sp["w"] or ah + bh <= sp["h"]
                    for aw, ah, _ in fits
                    for bw, bh, _ in fits
                ):
                    upper = 1
                else:
                    return None  # Mixed-orientation packing needs the full model.
            leaves[i] = [
                {
                    "ci": ci,
                    "x": (k % (sp["w"] // w)) * w,
                    "y": (k // (sp["w"] // w)) * h,
                    "w": w,
                    "h": h,
                    "rot": r,
                }
                for k in range(upper)
            ]
    # Canonical patterns collapse different orders with identical stock usage
    # and outer dimensions. Keep one actual layout to reconstruct every bag.
    patterns = {}
    visited = set()

    def enumerate_chain(seq, locs, counts):
        if cancel is not None and cancel.is_set():
            raise InterruptedError
        state = (seq[0], seq[-1], tuple(counts))
        if state in visited:
            return
        visited.add(state)
        key = (seq[0], tuple(counts))
        patterns.setdefault(key, (tuple(seq), tuple(locs), ()))
        if len(patterns) > 5000:
            raise OverflowError
        if len(seq) >= data["depth"]:
            return
        last = seq[-1]
        for k in range(1, len(leaves[last] or []) + 1):
            if counts[terminal] + k <= quantities[terminal]:
                counts[terminal] += k
                patterns.setdefault(
                    (seq[0], tuple(counts)),
                    (tuple(seq), tuple(locs), tuple(leaves[last][:k])),
                )
                counts[terminal] -= k
        for child, loc in edges[last]:
            if counts[child] < quantities[child]:
                counts[child] += 1
                enumerate_chain(seq + [child], locs + [loc], counts)
                counts[child] -= 1

    try:
        for i in range(len(items)):
            counts = [0] * len(items)
            counts[i] = 1
            enumerate_chain([i], [], counts)
    except OverflowError:
        return None
    except InterruptedError:
        notify({"type": "complete", "result": None, "visited": 0, "reason": "stopped"})
        return (None,)
    model = cp_model.CpModel()
    stock = [[] for _ in items]
    roots = [[] for _ in items]
    choices = []
    for (root, counts), layout in patterns.items():
        count = model.new_int_var(
            0, min(quantities[i] // v for i, v in enumerate(counts) if v), "pattern"
        )
        choices.append((count, root, counts, layout))
        roots[root].append(count)
        for i, v in enumerate(counts):
            if v:
                stock[i].append(v * count)
    for i in range(len(items)):
        model.add(sum(stock[i]) <= quantities[i])
    sw, sh = data.get("stashW", 10), data.get("stashH", 28)
    ix, iy, slots = [], [], []
    for i, it in enumerate(items):
        previous = None
        presences = []
        for k in range(min(quantities[i], sw * sh // areas[i])):
            p = model.new_bool_var("present")
            r = model.new_bool_var("rotate")
            if not data["rotate"] or it["ow"] == it["oh"]:
                model.add(r == 0)
            w = model.new_int_var(min(it["ow"], it["oh"]), max(it["ow"], it["oh"]), "w")
            h = model.new_int_var(min(it["ow"], it["oh"]), max(it["ow"], it["oh"]), "h")
            model.add(w == it["ow"] + (it["oh"] - it["ow"]) * r)
            model.add(h == it["oh"] + (it["ow"] - it["oh"]) * r)
            x = model.new_int_var(0, sw, "x")
            y = model.new_int_var(0, sh, "y")
            ex = model.new_int_var(0, sw + max(it["ow"], it["oh"]), "ex")
            ey = model.new_int_var(0, sh + max(it["ow"], it["oh"]), "ey")
            model.add(ex == x + w)
            model.add(ey == y + h)
            model.add(ex <= sw).only_enforce_if(p)
            model.add(ey <= sh).only_enforce_if(p)
            for v in (x, y, r):
                model.add(v == 0).only_enforce_if(p.Not())
            if previous is not None:
                pp, px, py = previous
                model.add(pp >= p)
                model.add(py * (sw + 1) + px < y * (sw + 1) + x).only_enforce_if(p)
            previous = (p, x, y)
            ix.append(model.new_optional_interval_var(x, w, ex, p, "ix"))
            iy.append(model.new_optional_interval_var(y, h, ey, p, "iy"))
            presences.append(p)
            slots.append((i, p, x, y, w, h, r))
        model.add(sum(presences) == sum(roots[i]))
    model.add_no_overlap_2d(ix, iy)
    used = sum(areas[root] * v for v, root, _, _ in choices)
    model.add(used <= sw * sh)
    model.maximize(sum(sum(s) for s in stock) * (sw * sh + 1) + sw * sh - used)
    hint = data.get("resumeHint")
    if (
        isinstance(hint, list)
        and len(hint) == len(model.proto.variables)
        and all(
            isinstance(v, int)
            and any(
                var.domain[k] <= v <= var.domain[k + 1]
                for k in range(0, len(var.domain), 2)
            )
            for var, v in zip(model.proto.variables, hint)
        )
    ):
        for i, v in enumerate(hint):
            model.add_hint(model.get_int_var_from_proto_index(i), v)
    solver = cp_model.CpSolver()
    solver.parameters.num_search_workers = 2
    solver.parameters.max_memory_in_mb = 256
    if not data.get("unlimited"):
        solver.parameters.max_time_in_seconds = 15

    def result(value, optimal=False, branches=0):
        outer = {
            "id": "stash",
            "n": "倉庫",
            "en": "Stash",
            "cat": "stash",
            "ow": sw,
            "oh": sh,
            "comp": [{"w": sw, "h": sh}],
            "allowBags": True,
        }
        root = make_node(outer, "stash#1", 0)
        available = [list(pool) for pool in pools]
        layouts = [[] for _ in items]
        for v, i, _, layout in choices:
            layouts[i].extend([layout] * value(v))

        def attach(parent, i, loc, depth):
            it, uid = available[i].pop(0)
            node = make_node(it, uid, depth)
            node["location"] = copy.deepcopy(loc)
            parent["children"].append(node)
            sp = parent["spaces"][loc["ci"]]
            for y in range(loc["y"], loc["y"] + loc["h"]):
                for x in range(loc["x"], loc["x"] + loc["w"]):
                    sp["cells"][y * sp["w"] + x] = uid
            return node

        for i, p, x, y, w, h, r in slots:
            if not value(p):
                continue
            seq, locs, leaf_locs = layouts[i].pop()
            parent = attach(
                root,
                i,
                {
                    "ci": 0,
                    "x": value(x),
                    "y": value(y),
                    "w": value(w),
                    "h": value(h),
                    "rot": bool(value(r)),
                },
                1,
            )
            for depth, (child, loc) in enumerate(zip(seq[1:], locs), 2):
                parent = attach(parent, child, loc, depth)
            for loc in leaf_locs:
                attach(parent, terminal, loc, len(seq) + 1)
        missing = [copy.deepcopy(it) for pool in available for it, _ in pool]
        packed = len(entries) - len(missing)
        used_area = value(used)
        before = sum(it["ow"] * it["oh"] for it, _ in entries)
        after = used_area + sum(it["ow"] * it["oh"] for it in missing)
        return {
            "root": root,
            "unplaced": missing,
            "included": packed,
            "total": len(entries),
            "packedBags": packed,
            "allBagsPacked": not missing,
            "free": sw * sh - used_area,
            "used": used_area,
            "before": before,
            "after": after,
            "saving": before - after,
            "optimal": optimal,
            "visited": branches,
            "resumeHint": [
                value(model.get_int_var_from_proto_index(i))
                for i in range(len(model.proto.variables))
            ],
        }

    class Updates(cp_model.CpSolverSolutionCallback):
        last = 0

        def on_solution_callback(self):
            if time.monotonic() - self.last >= 0.25:
                self.last = time.monotonic()
                notify(
                    {
                        "type": "solution",
                        "result": result(self.value, branches=self.num_branches),
                        "visited": self.num_branches,
                    }
                )

    done = threading.Event()

    def watch():
        while not done.wait(0.1):
            if cancel is not None and cancel.is_set():
                solver.stop_search()
                return

    if cancel is not None:
        threading.Thread(target=watch, daemon=True).start()
    try:
        if cancel is not None and cancel.is_set():
            notify(
                {"type": "complete", "result": None, "visited": 0, "reason": "stopped"}
            )
            return (None,)
        status = solver.solve(model, Updates())
    finally:
        done.set()
    if status == cp_model.MODEL_INVALID:
        raise ValueError(solver.solution_info())
    output = (
        result(solver.value, status == cp_model.OPTIMAL, solver.num_branches)
        if status in (cp_model.OPTIMAL, cp_model.FEASIBLE)
        else None
    )
    if output is not None:
        output["elapsedSeconds"] = solver.wall_time
    notify(
        {
            "type": "complete",
            "result": output,
            "visited": solver.num_branches,
            "reason": "optimal"
            if status == cp_model.OPTIMAL
            else "stopped"
            if cancel is not None and cancel.is_set()
            else "limit"
            if status in (cp_model.UNKNOWN, cp_model.FEASIBLE)
            else "infeasible",
        }
    )
    return (output,)
