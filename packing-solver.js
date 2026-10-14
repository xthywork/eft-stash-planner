/* Exact geometric search. Runs in a worker; no search/time budget truncation.
 * Lexicographic objective: pack the most backpacks (all if feasible), maximize
 * free cells in the outer container, then pack the most rigs without sacrificing
 * that space. Workspace counts its selected root as one of the backpacks.
 * Memoization removes identical states; bounds only remove states that cannot
 * improve the incumbent. A result is proven optimal only after traversal ends.
 */
(function(scope){
'use strict';
function solvePacking(input,notify=()=>{}){
 const items=input.items.map(entry=>({...entry,qty:Math.floor(Math.min(100,Math.max(0,Number(entry.qty)||0)))})).filter(entry=>entry.qty>0),bagTotal=items.reduce((sum,e)=>sum+(e.it.cat==='bag'?e.qty:0),0);
 const depthLimit=input.depth,rotate=input.rotate;
 const area=it=>it.ow*it.oh;
 let best=null,visited=0,lastReport=0,rootsDone=0;
 const roots=input.mode==='stash'?[{id:'stash',n:'倉庫',en:'Stash',cat:'stash',ow:input.stashW,oh:input.stashH,comp:[{w:input.stashW,h:input.stashH}],allowBags:true}]:items.filter(e=>e.it.cat==='bag'&&(input.target==='auto'||input.target===e.it.id)).map(e=>e.it);
 const bagEntries=items.filter(e=>e.it.cat==='bag'),rigEntries=items.filter(e=>e.it.cat!=='bag');
 function node(it,uid,depth,parent=null){return {...it,uid,depth,parent,location:null,children:[],spaces:it.comp.map(sp=>({w:sp.w,h:sp.h,cells:Array(sp.w*sp.h).fill(null)}))}}
 function legal(parent,it){
  if(parent.cat==='stash')return true;
  if(parent.onlyMeds||parent.cat==='rig'||(it.cat==='bag'&&!parent.allowBags))return false;
  if(it.cat==='bag')for(let ancestor=parent;ancestor;ancestor=ancestor.parent)if(ancestor.cat==='bag'&&ancestor.nestFamily&&ancestor.nestFamily===it.nestFamily&&(ancestor.blockSameFamily||it.blockSameFamily))return false;
  return true;
 }
 function serialize(n){const {parent,children,...rest}=n;return {...rest,spaces:n.spaces.map(sp=>({...sp,cells:[...sp.cells]})),children:children.map(serialize)}}
 function better(candidate){return !best||candidate.packedBags>best.packedBags||candidate.packedBags===best.packedBags&&(candidate.free>best.free||candidate.free===best.free&&candidate.packedRigs>best.packedRigs)}
 function report(force=false){if(force||Date.now()-lastReport>250){lastReport=Date.now();notify({type:'progress',visited,rootsDone,rootsTotal:roots.length,packedBags:best?.packedBags||0,bagTotal,free:best?.free??null})}}
 for(const rootIt of roots){
  const isStash=rootIt.cat==='stash',root=node(rootIt,isStash?'stash#1':rootIt.id+'#1',isStash?0:1),containers=[root];
  const bagLeft=bagEntries.map(e=>e.qty-(isStash||e.it.id!==rootIt.id?0:1)),rigLeft=rigEntries.map(e=>e.qty),rigOmitted=rigEntries.map(()=>0);
  const capacity=root.spaces.reduce((sum,sp)=>sum+sp.w*sp.h,0);
  let packedBags=isStash?0:1,packedRigs=0,rootUsed=0;
  const bagMemo=new Set(),rigMemo=new Set();
  function canonical(n){return n.id+'('+n.children.map(c=>{const p=c.location;return [p.ci,p.x,p.y,p.w,p.h,Number(p.rot),canonical(c)].join(',')}).sort().join(';')+')'}
  function bound(remainingBags,remainingRigs){
   const upperBags=packedBags+remainingBags,free=capacity-rootUsed;
   return best&&(upperBags<best.packedBags||upperBags===best.packedBags&&(free<best.free||free===best.free&&packedRigs+remainingRigs<=best.packedRigs));
  }
  function record(){
   const candidate={packedBags,packedRigs,free:capacity-rootUsed};if(!better(candidate))return;
   const unplaced=[];bagEntries.forEach((e,i)=>{for(let k=0;k<bagLeft[i];k++)unplaced.push(e.it)});rigEntries.forEach((e,i)=>{for(let k=0;k<rigLeft[i]+rigOmitted[i];k++)unplaced.push(e.it)});
   best={...candidate,root:serialize(root),unplaced,included:packedBags+packedRigs-(isStash?0:1),total:items.reduce((sum,e)=>sum+e.qty,0),used:rootUsed};
   best.before=items.reduce((sum,e)=>sum+area(e.it)*e.qty,0);best.after=(isStash?rootUsed:area(rootIt))+unplaced.reduce((sum,it)=>sum+area(it),0);best.saving=best.before-best.after;
   notify({type:'solution',result:best,visited,bagTotal});
  }
  function* placements(it){
   // Every parent, compartment, allowed orientation and integer coordinate.
   for(const parent of containers){
    if(parent.depth>=depthLimit||!legal(parent,it))continue;
    for(let ci=0;ci<parent.spaces.length;ci++){
     const sp=parent.spaces[ci],orientations=[{w:it.ow,h:it.oh,rot:false}];if(rotate&&it.ow!==it.oh)orientations.push({w:it.oh,h:it.ow,rot:true});
     for(const o of orientations)for(let y=0;y<=sp.h-o.h;y++)for(let x=0;x<=sp.w-o.w;x++){
      let fits=true;for(let yy=y;fits&&yy<y+o.h;yy++)for(let xx=x;xx<x+o.w;xx++)if(sp.cells[yy*sp.w+xx]!==null){fits=false;break}
      if(fits)yield {parent,sp,ci,x,y,...o};
     }
    }
   }
  }
  function place(it,uid,p){
   const child=node(it,uid,p.parent.depth+1,p.parent);child.location={ci:p.ci,x:p.x,y:p.y,w:p.w,h:p.h,rot:p.rot};
   for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)p.sp.cells[y*p.sp.w+x]=uid;
   p.parent.children.push(child);if(it.cat==='bag'){containers.push(child);packedBags++}else packedRigs++;
   if(p.parent===root)rootUsed+=area(it);return child;
  }
  function undo(child,p){
   if(child.cat==='bag'){containers.pop();packedBags--}else packedRigs--;
   p.parent.children.pop();if(p.parent===root)rootUsed-=area(child);
   for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)p.sp.cells[y*p.sp.w+x]=null;
  }
  function rigSearch(index=0){
   visited++;report();record();
   const remaining=rigLeft.reduce((sum,n)=>sum+n,0);
   if(bound(0,remaining))return;
   while(index<rigLeft.length&&!rigLeft[index])index++;if(index===rigLeft.length)return;
   const key=canonical(root)+'|'+rigLeft.join(',')+'|'+index;if(rigMemo.has(key))return;rigMemo.add(key);
   const entry=rigEntries[index],uid=entry.it.id+'#'+(entry.qty-rigLeft[index]+1);rigLeft[index]--;
   for(const p of placements(entry.it)){const child=place(entry.it,uid,p);rigSearch(index);undo(child,p)}
   // Leaving this rig outside is an explicit alternative, not a search cutoff.
   rigOmitted[index]++;rigSearch(index);rigOmitted[index]--;rigLeft[index]++;
  }
  function bagSearch(){
   visited++;report();
   const remaining=bagLeft.reduce((sum,n)=>sum+n,0),rigRemaining=rigLeft.reduce((sum,n)=>sum+n,0);
   if(bound(remaining,rigRemaining))return;
   const key=canonical(root)+'|'+bagLeft.join(',');if(bagMemo.has(key))return;bagMemo.add(key);
   let hasPlacement=false;
   // Vary the next bag type as well as its position: later bags can become containers.
   for(let index=0;index<bagLeft.length;index++){
    if(!bagLeft[index])continue;
    const entry=bagEntries[index],uid=entry.it.id+'#'+(entry.qty-bagLeft[index]+1);bagLeft[index]--;
    for(const p of placements(entry.it)){hasPlacement=true;const child=place(entry.it,uid,p);bagSearch();undo(child,p)}
    bagLeft[index]++;
   }
   // Rigs never create containers, so postponing them preserves every final layout.
   if(!hasPlacement)rigSearch();
  }
  bagSearch();rootsDone++;report(true);
 }
 const result=best?{...best,optimal:true,allBagsPacked:best.packedBags===bagTotal,visited}:null;
 notify({type:'complete',result,visited,bagTotal});return result;
}
if(typeof module!=='undefined'&&module.exports)module.exports={solvePacking};else scope.solvePacking=solvePacking;
})(typeof self!=='undefined'?self:globalThis);
