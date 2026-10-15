import unittest
import threading
from unittest.mock import patch
from ortools.sat.python import cp_model
from packing_solver import solve_packing


def bag(name, w, h, comp=(), **extra):
    return dict(id=name, n=name, en=name, cat='bag', ow=w, oh=h, comp=[dict(w=a, h=b) for a, b in comp], allowBags=True, **extra)

def solve(items, **options):
    return solve_packing(dict(stashW=10, stashH=10, depth=6, rotate=False, items=[dict(it=it, qty=q) for it, q in items]) | options)

def oracle(w, h, shapes):
    best = (0, 0)
    board = set()
    def walk(i, count, used):
        nonlocal best
        if i == len(shapes):
            best = max(best, (count, -used))
            return
        walk(i+1, count, used)
        rw, rh = shapes[i]
        for y in range(h-rh+1):
            for x in range(w-rw+1):
                cells = {(yy*w+xx) for yy in range(y, y+rh) for xx in range(x, x+rw)}
                if cells & board:
                    continue
                board.update(cells); walk(i+1, count+1, used+rw*rh); board.difference_update(cells)
    walk(0, 0, 0)
    return best[0], w*h+best[1]

class Packing(unittest.TestCase):
    def check_geometry(self, node):
        occupied = [set() for _ in node['spaces']]
        for child in node['children']:
            p = child['location']; sp = node['spaces'][p['ci']]
            self.assertEqual(p['w'], child['oh'] if p['rot'] else child['ow'])
            self.assertEqual(p['h'], child['ow'] if p['rot'] else child['oh'])
            self.assertLessEqual(p['x']+p['w'], sp['w']); self.assertLessEqual(p['y']+p['h'], sp['h'])
            cells = {y*sp['w']+x for y in range(p['y'], p['y']+p['h']) for x in range(p['x'], p['x']+p['w'])}
            self.assertFalse(cells & occupied[p['ci']]); occupied[p['ci']].update(cells)
            self.check_geometry(child)

    def test_takedown(self):
        td = bag('td',3,7,[(3,8)],nestFamily='td',blockSameFamily=True)
        for quantity in (2,3):
            r = solve([(td,quantity)],stashW=6,stashH=7)
            self.assertTrue(r['optimal']); self.assertEqual(r['packedBags'],2)
            self.assertEqual(r['free'],0); self.assertEqual(len(r['unplaced']),quantity-2)
            self.check_geometry(r['root'])
        self.assertEqual(solve([(td,2)],stashW=7,stashH=6)['packedBags'],0)
        self.assertEqual(solve([(td,2)],stashW=7,stashH=6,rotate=True)['packedBags'],2)
        # Only the carrier fits in the stash. Separate pockets cannot be combined.
        for comp, expected in [([(6,3),(6,4)],1), ([(6,7)],3)]:
            r = solve([(bag('carrier',1,1,comp),1),(td,2)],stashW=1,stashH=1,rotate=True)
            self.assertEqual(r['packedBags'],expected); self.check_geometry(r['root'])

    def test_nested_space_and_ancestry(self):
        r = solve([(bag('a',2,2,[(3,3)]),1),(bag('b',3,3,[(2,2)]),1)],stashW=4,stashH=4)
        self.assertEqual(r['free'],12); self.assertTrue(r['allBagsPacked']); self.check_geometry(r['root'])
        td = bag('td',1,1,[(2,2)],nestFamily='td',blockSameFamily=True)
        r = solve([(td,2),(bag('bridge',2,2,[(2,2)]),1)],stashW=1,stashH=1)
        self.assertEqual(r['packedBags'],2)  # same family cannot nest indirectly

    def test_item_order(self):
        items=[(bag('large',2,1),1),(bag('small',1,1,[(2,1)]),1)]
        for order in [items,list(reversed(items))]:
            r=solve(order,stashW=1,stashH=1)
            self.assertTrue(r['allBagsPacked']); self.check_geometry(r['root'])

    def test_non_backpacks_are_excluded_before_model_and_limits(self):
        items=[(bag('a',1,1,[(2,2)]),1),(bag('b',2,2,[(1,1)]),1)]
        clean=solve(items,stashW=3,stashH=3)
        # Unknown categories and malformed non-backpack dimensions/quantities
        # must never enter the packing model or count against the 150-bag limit.
        extras=[(dict(id='other'+str(i),cat='rig' if i%2 else 'ammo'), 'unused') for i in range(200)]
        mixed=solve(items+extras,stashW=3,stashH=3,mode='workspace',target='ignored')
        for key in ['total','included','packedBags','free','before','after','saving']:
            self.assertEqual(clean[key],mixed[key])
        self.assertEqual(len(clean['resumeHint']),len(mixed['resumeHint']))
        self.assertNotIn('packedRigs',mixed)
        self.assertEqual(mixed['root']['cat'],'stash')
        self.assertEqual(mixed['total'],2); self.check_geometry(mixed['root'])

    def test_empty_inventory_does_not_start_solver(self):
        with patch('packing_solver.cp_model.CpModel',side_effect=AssertionError('unneeded model')):
            for items in [[],[(dict(cat='rig'),1000)]]:
                r=solve(items,stashW=4,stashH=8)
                self.assertEqual((r['total'],r['free'],r['visited']),(0,32,0))
                self.assertTrue(r['optimal']); self.check_geometry(r['root'])

    def test_independent_oracle(self):
        for k in range(32):
            shapes=[(1+((k>>(2*i))&1),1+((k>>(2*i+1))&1)) for i in range(3)]
            expected=oracle(2,3,shapes)
            r=solve([(bag('item'+str(i),w,h),1) for i,(w,h) in enumerate(shapes)],stashW=2,stashH=3)
            self.assertTrue(r['optimal']); self.assertEqual((r['packedBags'],r['free']),expected)
            self.check_geometry(r['root'])

    def test_repeated_items_efficiency(self):
        r=solve([(bag('same',3,3),8)],stashW=10,stashH=10)
        self.assertTrue(r['optimal']); self.assertTrue(r['allBagsPacked']); self.assertEqual(r['free'],28)
        self.assertLess(r['elapsedSeconds'],5); self.assertLess(r['visited'],10000)

    def test_equivalent_variants_and_depth(self):
        items=[(bag('variant'+str(i),4,5,[(4,5)]),1) for i in range(8)]
        r=solve(items,stashW=4,stashH=5,rotate=True)
        self.assertTrue(r['optimal']); self.assertEqual(r['packedBags'],6)
        self.assertEqual(r['free'],0); self.check_geometry(r['root'])
        self.assertLess(r['visited'],1000); self.assertLess(r['elapsedSeconds'],2)
        def ids(node):
            return ([node['id']] if node['cat']=='bag' else [])+[name for child in node['children'] for name in ids(child)]
        self.assertCountEqual(ids(r['root'])+[it['id'] for it in r['unplaced']],[it['id'] for it,_ in items])
        shallow=solve(items,stashW=4,stashH=5,depth=2)
        self.assertEqual(shallow['packedBags'],2)

    def test_unreachable_containers(self):
        r=solve([(bag('unreachable',5,5,[(8,8)]),1),(bag('small',1,1),2)],stashW=2,stashH=2)
        self.assertTrue(r['optimal']); self.assertEqual(r['packedBags'],2)
        self.assertEqual(r['free'],2); self.check_geometry(r['root'])
        self.assertEqual([it['id'] for it in r['unplaced']],['unreachable'])

    def test_containers_that_disallow_backpacks(self):
        for options in [dict(allowBags=False),dict(onlyMeds=True)]:
            carrier=bag('carrier',1,1,[(4,4)]) | options
            r=solve([(carrier,1),(bag('large',2,2),1)],stashW=1,stashH=1)
            self.assertEqual(r['packedBags'],1); self.assertFalse(r['root']['children'][0]['children'])

    def test_resume_hint_and_unlimited(self):
        data = dict(stashW=4,stashH=4,depth=6,rotate=True,
                    items=[dict(it=bag('a',2,2,[(3,3)]),qty=1),
                           dict(it=bag('b',3,3,[(2,2)]),qty=1)])
        original_factory = cp_model.CpSolver
        solvers = []
        def factory():
            solver = original_factory(); solvers.append(solver); return solver
        with patch('packing_solver.cp_model.CpSolver',side_effect=factory):
            first = solve_packing(data)
            resumed = solve_packing(data | dict(unlimited=True,resumeHint=first['resumeHint']))
        self.assertEqual(solvers[0].parameters.max_time_in_seconds,15)
        self.assertEqual(solvers[1].parameters.max_time_in_seconds,float('inf'))
        self.assertTrue(resumed['optimal'])
        self.assertEqual((first['packedBags'],first['free']),
                         (resumed['packedBags'],resumed['free']))
        self.check_geometry(resumed['root'])

    def test_cancel_before_search_retains_total_message(self):
        event = threading.Event(); event.set(); messages = []
        output = solve_packing({},messages.append,event)
        self.assertIsNone(output)
        self.assertEqual(messages[-1],dict(type='complete',result=None,visited=0,reason='stopped'))

if __name__=='__main__': unittest.main()
