(()=>{'use strict';
// Item orientation uses WIDTH × HEIGHT. Special backpacks use independent compartments.
const B=(id,n,en,ow,oh,comp,opts={})=>({id,n,en,cat:'bag',ow,oh,comp:comp.map(([w,h])=>({w,h})),allowBags:opts.allowBags!==false,onlyMeds:opts.onlyMeds===true,nestFamily:opts.nestFamily||id,blockSameFamily:opts.blockSameFamily===true,custom:false});
const BASE=[
 B('6sh118','6Sh118 突擊背包','6Sh118 raid backpack (EMR)',6,7,[[6,8]]),
 B('sfmp','LBT-2670 醫療背包','LBT-2670 Slim Field Med Pack (Black)',4,5,[[6,8]],{allowBags:false,onlyMeds:true}),
 B('rush100','RUSH 100 突擊背包','5.11 Tactical RUSH 100 backpack (Black)',6,7,[[5,7],[2,2],[2,2],[1,2]]),
 B('blackjack','Blackjack 50 背包','Mystery Ranch Blackjack 50 backpack (MultiCam)',5,7,[[6,7]]),
 B('modular45','Modular Pack 45 背包','Tasmanian Tiger Modular Pack 45 Plus (MultiCam Black)',5,8,[[5,8]]),
 B('f4','F4 Terminator 背包','Eberlestock F4 Terminator load bearing backpack (Tiger Stripe)',5,7,[[5,4],[5,2],[5,2]]),
 B('satl','SATL 突擊背包','Mystery Ranch SATL Bridger Assault Pack (Foliage)',5,7,[[6,2],[3,4],[3,4]]),
 B('attack2','Attack 2 突擊背包','SSO Attack 2 raid backpack (Khaki)',5,7,[[5,7]]),
 B('trooper','Trooper 35 背包','Tasmanian Tiger Trooper 35 backpack (Khaki)',5,7,[[5,7]]),
 B('pilgrim','Pilgrim 旅行背包','Pilgrim tourist backpack',5,7,[[5,7]]),
 B('santa','聖誕老人背包',"Santa's Bag",5,7,[[5,7]]),
 B('paratus','Paratus 3-Day 背包',"3V Gear Paratus 3-Day Operator's Tactical backpack (Foliage Grey)",5,7,[[5,5],[1,2],[1,2],[3,2]]),
 B('g2','G2 Gunslinger II 背包','Eberlestock G2 Gunslinger II backpack (Dry Earth)',5,7,[[3,5],[2,7],[3,2]]),
 B('niceload','NICE Frame Load Sling 背包','Mystery Ranch NICE Frame Load Sling',5,6,[[5,7]]),
 B('oakley','Mechanism 重型背包','Oakley Mechanism heavy duty backpack (Black)',5,5,[[4,4],[2,2],[2,2],[2,2],[2,2]]),
 B('2day','2 日突擊包','Mystery Ranch 2 Day Assault Pack (Black)',5,6,[[5,6]]),
 B('beta2','Beta 2 戰鬥背包','ANA Tactical Beta 2 Battle backpack (Olive Drab)',5,5,[[5,6]]),
 B('t30','T30 背包（黑）','Gruppa 99 T30 backpack (Black)',5,6,[[5,6]]),
 B('t30mc','T30 背包（迷彩）','Gruppa 99 T30 backpack (MultiCam)',5,6,[[5,6]]),
 B('switchblade','F5 Switchblade 背包','Eberlestock F5 Switchblade backpack (Dry Earth)',5,6,[[5,6]]),
 B('trizip','Tri-Zip 背包（綠）','Camelbak Tri-Zip assault backpack (Foliage)',5,6,[[5,6]]),
 B('trizipmc','Tri-Zip 背包（迷彩）','Camelbak Tri-Zip assault backpack (MultiCam)',5,6,[[5,6]]),
 B('terra','Terraframe 背包','Mystery Ranch Terraframe backpack (Olive Drab)',5,6,[[4,5],[2,5]]),
 B('terrace','Terraframe 背包（聖誕）','Mystery Ranch Terraframe backpack (Christmas Edition)',5,6,[[4,5],[2,5]]),
 B('rkpt25','RK-PT-25 巡邏背包','Tehinkom RK-PT-25 patrol backpack (EMR)',5,5,[[1,2],[1,2],[1,3],[1,3],[3,2],[3,3]]),
 B('dragonegg','Dragon Egg MKII 背包','Direct Action Dragon Egg Mark II backpack (Black)',5,5,[[5,3],[2,2],[3,2]]),
 B('lbt1476','LBT-1476A 三日背包（森林）','LBT-1476A 3Day Pack (Woodland)',4,5,[[5,5]]),
 B('lbt1476alpine','LBT-1476A 三日背包（雪地）','LBT-1476A 3Day Pack (MultiCam Alpine)',4,5,[[5,5]]),
 B('t20','T20 背包（棕）','Gruppa 99 T20 backpack (Umber Brown)',5,5,[[5,5]]),
 B('t20mc','T20 背包（迷彩）','Gruppa 99 T20 backpack (MultiCam)',5,5,[[5,5]]),
 B('drawbridge','Drawbridge 背包','Hazard 4 Drawbridge backpack (Coyote Tan)',5,5,[[5,5]]),
 B('takedown','Takedown 單肩背包（黑）','Hazard 4 Takedown sling backpack (Black)',3,7,[[3,8]],{nestFamily:'takedown',blockSameFamily:true}),
 B('takedownmc','Takedown 單肩背包（迷彩）','Hazard 4 Takedown sling backpack (MultiCam)',3,7,[[3,8]],{nestFamily:'takedown',blockSameFamily:true}),
 B('partisan','Partisan 背包',"Partisan's bag",4,3,[[5,4]]),
 B('pillbox','Pillbox 背包','Hazard 4 Pillbox backpack (Black)',4,4,[[4,5]],{allowBags:false}),
 B('scavbp','Scav 拾荒者背包','Scav backpack',4,5,[[4,5]]),
 B('berkut','Berkut 背包','WARTECH Berkut BB-102 backpack (A-TACS FG)',4,5,[[4,5]]),
 B('daypack','LBT-8005A 背包','LBT-8005A Day Pack backpack (MultiCam Black)',4,5,[[4,5]]),
 B('sanitar','Sanitar 醫療袋',"Sanitar's bag",4,4,[[4,4]],{allowBags:false}),
 B('mbss','MBSS 小型背包','Flyye MBSS backpack (UCP)',4,4,[[4,4]]),
 B('vertx','Vertx Ready Pack 背包（紅）','Vertx Ready Pack backpack (Red)',4,4,[[4,4]]),
 B('nicecomm','NICE COMM 3 背架','Mystery Ranch NICE COMM 3 BVS frame system (Coyote)',4,5,[[2,7]]),
 B('duffle','Duffle 旅行袋','Duffle bag',4,3,[[4,3]]),
 B('transfer','3F Transfer 旅行包','LolKek 3F Transfer tourist backpack',3,4,[[3,4]]),
 B('transformer','Transformer 小背包','Transformer Bag',3,3,[[3,3]]),
 B('vkbo','VKBO 軍用背包','VKBO army bag',3,4,[[4,2]]),
 B('sling','戰術單肩背包','Tactical sling bag (Khaki)',3,3,[[3,2]]),
];
const $=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(key)=>`<svg aria-hidden="true"><use href="#i-${key}"></use></svg>`;
const AREA=(i)=>i.ow*i.oh;
const SAMPLE={"6sh118":1,"trizip":1,"scavbp":2,"mbss":2};
const KEY='stash-lab-planner-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const state={liveAnalysis:saved.liveAnalysis!==false,stashW:Math.min(20,Math.max(4,Number(saved.stashW)||10)),stashH:Math.min(100,Math.max(8,Number(saved.stashH)||28)),lang:saved.lang==='en'?'en':'zh',qty:(saved.qty&&typeof saved.qty==='object')?saved.qty:{...SAMPLE},custom:Array.isArray(saved.custom)?saved.custom.filter(isCustomValid).slice(0,60):[],depth:Math.min(6,Math.max(2,Number(saved.depth)||6)),rotate:saved.rotate!==false,mergeBags:saved.mergeBags===true,query:'',onlyOwned:false,solution:null,viewId:null};
function isCustomValid(x){return x&&/^u-[\w-]{3,40}$/.test(x.id||'')&&typeof x.n==='string'&&x.n.length<=50&&x.cat==='bag'&&[x.ow,x.oh].every(v=>Number.isInteger(v)&&v>=1&&v<=15)&&Array.isArray(x.comp)&&x.comp.length>=1&&x.comp.length<=4&&x.comp.every(c=>Number.isInteger(c.w)&&Number.isInteger(c.h)&&c.w>=1&&c.h>=1&&c.w<=15&&c.h<=15)}
function backpackConfig(d,extraCustom=[]){
 const catalog=new Map(extraCustom.filter(isCustomValid).map(item=>[item.id,item]));
 (Array.isArray(d.custom)?d.custom:[]).filter(isCustomValid).forEach(item=>catalog.set(item.id,{...item,allowBags:item.allowBags!==false,custom:true}));
 const custom=[...catalog.values()].slice(0,60),ids=new Set([...BASE,...custom].map(item=>item.id)),qty={};
 for(const [id,value] of Object.entries(d.qty||{}))if(ids.has(id)&&Number.isFinite(Number(value)))qty[id]=Math.min(100,Math.max(0,Math.round(Number(value))));
 return {format:'stash-lab-v1',mode:'stash',qty,custom,depth:Math.min(6,Math.max(2,Number(d.depth)||6)),rotate:d.rotate!==false,mergeBags:d.mergeBags===true,stashW:Math.min(20,Math.max(4,Number(d.stashW)||10)),stashH:Math.min(100,Math.max(8,Number(d.stashH)||28)),lang:d.lang==='en'?'en':'zh'};
}
const initialConfig=backpackConfig({qty:state.qty,custom:state.custom});state.qty=initialConfig.qty;state.custom=initialConfig.custom;
const MEMORY_KEY='stash-lab-memories-v1';
function validConfig(d){return d&&d.format==='stash-lab-v1'&&d.qty&&typeof d.qty==='object'&&!Array.isArray(d.qty)&&Array.isArray(d.custom)}
let memories=[];try{const data=JSON.parse(localStorage.getItem(MEMORY_KEY)||'[]');if(Array.isArray(data))memories=data.filter(m=>m&&typeof m.id==='string'&&typeof m.name==='string'&&validConfig(m.config)).map(m=>({...m,config:backpackConfig(m.config,state.custom)}));localStorage.setItem(MEMORY_KEY,JSON.stringify(memories))}catch(e){}
let xray=false,previewCellSize=null,previewRenderedCell=24,previewMaxCell=24;
const getAll=()=>[...BASE,...state.custom];const byId=id=>getAll().find(i=>i.id===id);const count=()=>Object.entries(state.qty).reduce((n,[id,q])=>n+(byId(id)?Math.min(100,Math.max(0,Number(q)||0)):0),0);
function persist(){try{localStorage.setItem(KEY,JSON.stringify({liveAnalysis:state.liveAnalysis,qty:state.qty,custom:state.custom,depth:state.depth,rotate:state.rotate,mergeBags:state.mergeBags,lang:state.lang,mode:'stash',stashW:state.stashW,stashH:state.stashH}))}catch(e){}}
let toastTimer=0;function toast(msg){$('toast').textContent=msg;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,2600)}

const LANG_MAP={
 "等級 1 · 10 × 28": "Level 1 · 10 × 28",
 "等級 2 · 10 × 38": "Level 2 · 10 × 38",
 "等級 3 · 10 × 48": "Level 3 · 10 × 48",
 "等級 4 · 10 × 68": "Level 4 · 10 × 68",
 "倉庫規劃": "Stash planner",
 "倉庫尺寸": "Stash size",
 "依照白邊 PvE 的實際倉庫調整": "Match your Standard PvE stash",
 "倉庫預設尺寸": "Stash preset",
 "自訂尺寸": "Custom size",
 "寬": "W",
 "高": "H",
 "設定與資料": "Settings & data",
 "中文 / English": "中文 / English",
 "離線運作": "Offline mode",
 "資料僅存放在此瀏覽器": "Saved in this browser only",
 "不存取遊戲或帳號": "No game or account access",
 "自訂背包": "Custom backpack",
 "清空數量": "Clear all",
 "收納設定": "Packing settings",
 "重新計算": "Recalculate",
 "匯入 JSON": "Import JSON",
 "下載 JSON": "Download JSON",
 "關閉": "Close",
 "你的背包清單": "Your inventory",
 "點選 ＋ / －，建立目前持有的背包數量": "Use + / − to set quantities",
 "全部背包": "All items",
 "背包": "Backpacks",
 "只顯示已選": "Selected only",
 "已加入規劃": "Selected items",
 "只看已選背包": "Show selected",
 "設定收納規則 →": "Packing rules →",
 "收納分析結果": "Packing analysis",
 "節省倉庫格數": "Stash slots saved",
 "背包巢狀層數": "Nesting depth",
 "等待輸入": "Awaiting items",
 "預覽": "Preview",
 "收納步驟": "Packing steps",
 "選擇背包後顯示預覽": "Select items to preview",
 "點擊圖中的背包可進入下一層": "Click a bag to enter · click empty space to go back",
 "使用率 —": "Usage —",
 "實際收納步驟": "Packing steps",
 "按照由內到外的順序操作；先填滿內袋，再將它放入上一層。": "Pack from the innermost bag outwards.",
 "完成規劃後產生逐步指引": "Steps appear after planning",
 "複製規劃清單": "Copy packing plan",
 "最大巢狀層數": "Maximum nesting depth",
 "允許將背包旋轉 90° 尋找可行擺法": "Allow 90° rotation to find placements",
 "開始計算最佳收納方案": "Calculate packing plan",
 "選項會自動儲存並同步更新規劃結果": "Options are auto-saved and the plan updates automatically",
 "清單與備份": "Inventory & backup",
 "讀取範例，或匯入、匯出你的背包清單與收納設定。": "Load example items or back up your inventory and settings.",
 "載入示範配置": "Load example",
 "規劃前需要知道的事": "How the planner works",
 "01. 計算的是幾何配置": "01. Geometric packing",
 "02. 遊戲規則優先": "02. In-game rules take priority",
 "針對官方 PvE 的倉庫套包。某些特殊背包可能另有物品白名單、禁止套包等限制；實際遊戲若拒絕放置，請依遊戲顯示並調整背包資料。": "Designed for official PvE stash organization. Some bags may have special restrictions; always follow what the game allows.",
 "03. 資料留在你的電腦": "03. Your data stays local",
 "整個網頁可離線運作，不連接 EFT、不需要登入。清單存於本機瀏覽器，也可匯出 JSON 備份。格數資料可參照": "The page runs offline without accessing EFT or requiring sign-in. Your inventory stays in local storage and can be exported as JSON. Reference:",
 "背包資料": "Backpack data",
 "新增自訂背包": "Add custom backpack",
 "遊戲更新後若有新背包，可以手動新增尺寸。背包內部支援單一矩形區域；帶有分隔區域的特殊背包請以內建資料為準。": "Add new backpacks manually. Custom bags support one rectangular inner compartment; use built-in data for compartmentalized items.",
 "背包名稱": "Item name",
 "備註（可選）": "Alias (optional)",
 "外部寬度（格）": "Outer width (slots)",
 "外部高度（格）": "Outer height (slots)",
 "背包內部寬度（格）": "Inner width (slots)",
 "背包內部高度（格）": "Inner height (slots)",
 "允許其他背包放入此背包": "Allow other bags inside",
 "取消": "Cancel",
 "新增至背包庫": "Add to inventory",
 "2 層": "2 levels",
 "3 層": "3 levels",
 "4 層": "4 levels",
 "5 層": "5 levels",
 "6 層": "6 levels",
 "7 層（預設）": "7 levels (default)",
 "6 層（建議）": "6 levels (recommended)",
 "遊戲規則：黑色與迷彩 Takedown 視為同款，禁止互相套包；Pillbox 與醫療專用背包不能裝其他背包。套包層數保守限制為 6 層。": "Game rules: Black and MultiCam Takedown count as the same family and cannot nest into each other. Pillbox and medical-only bags cannot hold backpacks. Nesting is conservatively limited to 6 levels.",
 "搜尋名稱、型號，例如：Scav、MBSS": "Search name or model (e.g. Scav, MBSS)",
 "例如：我的特殊背包": "e.g. My custom backpack",
 "英文名稱 / 型號": "English name / model",
 "區域": "Compartment",
 "格": "slots",
 "口袋": "pockets",
 "整個網頁可離線運作，不連接 EFT、不需要登入。自訂背包與目前配置會保存在此瀏覽器，也可從左側管理與匯出。格數資料可參照": "The page runs offline without accessing EFT or requiring sign-in. Custom items and setups stay in this browser. Manage and export them from the left panel. Reference:",
 "停止搜尋": "Stop search",
 "開始分析": "Start analysis",
 "即時分析": "Live analysis",
 "停止分析": "Stop analysis",
 "繼續分析": "Continue analysis",
 "重新分析": "Restart analysis",
 "累計查找總數": "Total searched",
 "個約束分支": "constraint branches",
 "使用 CP-SAT 約束最佳化，同時決定父容器、位置與旋轉，並嚴格檢查尺寸、分區與不重疊。優先放入所有背包，再最大化倉庫剩餘空格；僅在求解器證明最佳時標示最佳解。": "CP-SAT optimizes containers, positions and rotations together, with strict geometry and non-overlap constraints. Pack all backpacks first, then maximize free stash slots. Optimality is shown only when proven.",
 "儲存目前配置": "Save current setup",
 "背包清單": "Inventory",
 "已儲存資料": "Saved setups",
 "瀏覽器記憶": "Browser storage",
 "自訂背包和配置保存在此瀏覽器": "Custom items and setups stay saved in this browser",
 "匯出目前配置": "Export current setup",
 "匯出所有記憶": "Export all saved data",
 "清除所有記憶": "Clear all saved data",
 "在左側儲存或管理本機配置。": "Save and manage setups in the left panel.",
 "透視所有層": "View all layers",
 "依外部長寬與內部容量合併相同背包": "Merge backpacks by footprint and capacity",
 "僅合併清單顯示；滑鼠停留可查看所有型號，實際計算仍使用各背包的原始收納格局。按 ＋ 時會增加群組內既有型號，否則使用首個型號。": "Visual grouping only. Hover to see models; packing retains each model's actual layout. The plus button adds an already-owned model, or the first model in the group.",
 "相同尺寸背包": "Bags with matching size",
 "容量": "Capacity",
 "個型號": "models",
 "倉庫內背包": "Backpacks in stash",
 "倉庫剩餘空格": "Free stash slots",
 "未放入倉庫": "Not placed in stash"
};
const t=(zh,en)=>state.lang==='en'?(en||LANG_MAP[zh]||zh):zh;
const itemName=i=>state.lang==='en'?(i.en||i.n):i.n;
function applyLanguage(){
 document.documentElement.lang=state.lang==='en'?'en':'zh-Hant';
 document.querySelectorAll('[data-i18n]').forEach(el=>{const zh=el.getAttribute('data-i18n');el.textContent=t(zh)});
 document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder)});
 renderMemories();
 $('langBadge').textContent=state.lang==='en'?'EN':'中';
 $('langToggle').title=state.lang==='en'?'Switch to Chinese':'切換為英文';
 $('langToggle').setAttribute('aria-label',$('langToggle').title);
 $('sidebarToggle').title=t('收合 / 展開側邊欄','Collapse / expand sidebar');
}
$('langToggle').addEventListener('click',()=>{state.lang=state.lang==='en'?'zh':'en';persist();applyLanguage();updateStashControls();renderCatalog();renderResult();refreshClearUndo();});

// Group only the UI. Each model keeps its original inventory count, compartments, and nesting restrictions.
const bagCapacity=i=>i.comp.reduce((sum,c)=>sum+c.w*c.h,0);
const bagGroupKey=i=>`${i.ow}x${i.oh}:${bagCapacity(i)}`;
function renderCatalog(){
 const filter=state.query.toLowerCase().trim();
 const all=getAll();
 const grouped=new Map();
 for(const item of all){
  const groupId=state.mergeBags?`bag:${bagGroupKey(item)}`:`single:${item.id}`;
  if(!grouped.has(groupId))grouped.set(groupId,{id:groupId,items:[],cat:item.cat});
  grouped.get(groupId).items.push(item);
 }
 const rows=[...grouped.values()].filter(g=>
  (!state.onlyOwned||g.items.some(i=>Number(state.qty[i.id]||0)>0))&&
  (!filter||g.items.some(i=>(i.n+' '+i.en+' '+i.id).toLowerCase().includes(filter))||
   (g.cat==='bag'&&`${bagCapacity(g.items[0])} ${g.items[0].ow}x${g.items[0].oh} ${g.items[0].ow}×${g.items[0].oh}`.includes(filter)))
 );
 $('itemList').innerHTML=rows.map(g=>{
  const i=g.items[0], q=g.items.reduce((n,item)=>n+Number(state.qty[item.id]||0),0);
  const capacity=bagCapacity(i);
  const collapsed=g.items.length>1;
  const name=collapsed?`${capacity} ${t('格','slots')} · ${i.ow}×${i.oh}`:itemName(i);
  const detail=collapsed?`${t('外','OUT')} ${i.ow}×${i.oh} <span>／</span> ${t('容量','Capacity')} ${capacity}`:
   t('外','OUT')+` ${i.ow}×${i.oh}`+(` <span>／</span> `+t('內','IN')+` ${i.comp.map(c=>`${c.w}×${c.h}`).join(' + ')} (${capacity} ${t('格','slots')})`);
  const names=g.items.map(item=>itemName(item));
  const tip=collapsed?`${t('相同尺寸背包','Bags with matching size')} (${g.items.length} ${t('個型號','models')}):\n${names.join('\n')}\n${t('外','OUT')} ${i.ow}×${i.oh} / ${t('容量','Capacity')} ${capacity}`:name;
  const actionAttr=collapsed?`data-group="${esc(bagGroupKey(i))}"`:`data-id="${esc(i.id)}"`;
  return `<div class="item-card ${q?'owned':''} ${collapsed?'bag-group':''}" data-item="${esc(i.id)}" title="${esc(tip)}"><div class="item-figure">${icon(i.cat)}</div><div class="item-meta"><div class="item-name" title="${esc(tip)}">${esc(name)}</div><div class="item-dim">${detail}</div>${collapsed?`<span class="group-marker" title="${esc(tip)}">${g.items.length} ${t('個型號','models')}</span>`:''}${i.custom&&!collapsed?`<button class="custom-delete" data-action="delete" data-id="${esc(i.id)}" aria-label="${esc(t('刪除','Delete'))} ${esc(name)}">${t('刪除','Delete')}</button>`:''}</div><div class="stepper"><button class="qty-btn" data-action="minus" ${actionAttr} aria-label="${esc(t('減少數量','Decrease quantity'))}: ${esc(name)}">−</button><div class="qty-count">${q}</div><button class="qty-btn" data-action="plus" ${actionAttr} aria-label="${esc(t('增加數量','Increase quantity'))}: ${esc(name)}">+</button></div></div>`;
 }).join('')||`<div class="empty-list">${t('找不到相符背包。可嘗試其他關鍵字或新增自訂背包。','No matching items. Try another keyword or add a custom item.')}</div>`;
 $('listMeta').textContent=`${rows.length} ${t('種背包','types')}`;
 $('ownedCount').textContent=`${count()} ${t('件','ITEMS')}`;

}

let autoTimer=0;function changed(){persist();renderCatalog();clearTimeout(autoTimer);plan({prepareOnly:true});if(state.liveAnalysis)autoTimer=setTimeout(plan,110)}
// Continuous quantity controls: press and hold to repeat with progressive acceleration.
let quantityHold=null;
let lastPointerHandled=null;
function adjustQuantity(btn,quick=false){
 const action=btn.dataset.action;
 if(action!=='plus'&&action!=='minus')return false;
 const delta=action==='plus'?1:-1;
 const pool=btn.dataset.group?getAll().filter(i=>i.cat==='bag'&&bagGroupKey(i)===btn.dataset.group):[];
 const item=pool.length?(delta>0?(pool.find(i=>Number(state.qty[i.id]||0)>0&&Number(state.qty[i.id]||0)<100)||pool.find(i=>Number(state.qty[i.id]||0)<100)):(pool.find(i=>Number(state.qty[i.id]||0)>0))):byId(btn.dataset.id);
 if(!item)return false;
 const before=Math.min(100,Math.max(0,Number(state.qty[item.id]||0)));
 const after=Math.min(100,Math.max(0,before+delta));
 if(after===before)return false;
 state.qty[item.id]=after;
 if(quick){
  persist();
  const card=btn.closest('.item-card');
  if(card){
   const quantity=pool.length?pool.reduce((sum,i)=>sum+Number(state.qty[i.id]||0),0):after;
   const value=card.querySelector('.qty-count');if(value)value.textContent=quantity;
   card.classList.toggle('owned',quantity>0);
  }
  $('ownedCount').textContent=`${count()} ${t('件','ITEMS')}`;
  plan({prepareOnly:true});
 }else changed();
 return true;
}
function stopQuantityHold(){
 const h=quantityHold;if(!h)return;
 clearTimeout(h.timer);h.btn.classList.remove('is-holding');quantityHold=null;
 if(h.dirty)changed();
}
$('itemList').addEventListener('pointerdown',e=>{
 const btn=e.target.closest('.qty-btn[data-action]');
 if(!btn||e.button!==0||!e.isPrimary)return;
 e.preventDefault();stopQuantityHold();
 lastPointerHandled={btn,time:Date.now()};
 const h={btn,started:performance.now(),timer:null,dirty:adjustQuantity(btn,true)};
 quantityHold=h;btn.classList.add('is-holding');
 const repeat=()=>{
  if(quantityHold!==h)return;
  h.dirty=adjustQuantity(btn,true)||h.dirty;
  const elapsed=performance.now()-h.started;
  const interval=Math.max(28,165*Math.exp(-Math.max(0,elapsed-360)/1800));
  h.timer=setTimeout(repeat,interval);
 };
 h.timer=setTimeout(repeat,360);
});
window.addEventListener('pointerup',stopQuantityHold);
window.addEventListener('pointercancel',stopQuantityHold);
window.addEventListener('blur',stopQuantityHold);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopQuantityHold()});
$('itemList').addEventListener('click',e=>{
 const btn=e.target.closest('button[data-action]');if(!btn)return;
 if(btn.dataset.action==='delete'){
  const item=byId(btn.dataset.id);
  if(item?.custom&&confirm(t('要刪除這件自訂背包嗎？','Delete this custom item?'))){state.custom=state.custom.filter(i=>i.id!==item.id);delete state.qty[item.id];changed();toast(t('自訂背包已刪除','Custom item deleted'))}
  return;
 }
 // pointerdown already performs the first increment; keyboard-generated clicks do not.
 if(e.detail>0&&lastPointerHandled&&lastPointerHandled.btn===btn&&Date.now()-lastPointerHandled.time<1300)return;
 adjustQuantity(btn);
});
$('search').addEventListener('input',e=>{state.query=e.target.value;renderCatalog()});$('onlyOwned').addEventListener('change',e=>{state.onlyOwned=e.target.checked;renderCatalog()});
$('depth').value=String(state.depth);$('depth').addEventListener('change',e=>{state.depth=Number(e.target.value);changed()});$('rotate').checked=state.rotate;$('rotate').addEventListener('change',e=>{state.rotate=e.target.checked;changed()});$('mergeBags').checked=state.mergeBags;$('mergeBags').addEventListener('change',e=>{state.mergeBags=e.target.checked;persist();renderCatalog();$('itemList').scrollTop=0});
// Undo for Clear all. Session storage keeps the option after an accidental refresh.
const UNDO_KEY='stash-lab-clear-undo-v6';
let clearUndo=null;
try{const savedUndo=JSON.parse(sessionStorage.getItem(UNDO_KEY)||'null');if(savedUndo&&savedUndo.qty&&typeof savedUndo.qty==='object'){clearUndo={qty:backpackConfig({...savedUndo,custom:state.custom}).qty};sessionStorage.setItem(UNDO_KEY,JSON.stringify(clearUndo))}}catch(e){}
function refreshClearUndo(){
 $('undoClearBtn').hidden=!clearUndo;
 const label=t('復原清空數量','Undo cleared quantities');$('undoClearBtn').title=label;$('undoClearBtn').setAttribute('aria-label',label);
}
$('clearBtn').addEventListener('click',()=>{
 stopQuantityHold();
 if(!count()){toast(t('清單已是空的','Inventory is already empty'));return}
 clearUndo={qty:{...state.qty}};
 try{sessionStorage.setItem(UNDO_KEY,JSON.stringify(clearUndo))}catch(e){}
 state.qty={};changed();refreshClearUndo();
 toast(t('已清空數量','Quantities cleared'));
});
$('undoClearBtn').addEventListener('click',()=>{
 if(!clearUndo){refreshClearUndo();return}
 state.qty=backpackConfig({...clearUndo,custom:state.custom}).qty;
 clearUndo=null;try{sessionStorage.removeItem(UNDO_KEY)}catch(e){}
 refreshClearUndo();changed();toast(t('已還原清空前的背包數量','Previous quantities restored'));
});
$('demoBtn').addEventListener('click',()=>{state.qty={...SAMPLE};changed();toast(t('已載入示範配置','Example loaded'))});$('closeSettingsBtn').addEventListener('click',()=>switchPage('stash'));$('settingsScrim').addEventListener('click',()=>switchPage('stash'));
const appShell=$('appShell');const smallScreen=()=>false;
let savedCollapse=null;try{savedCollapse=localStorage.getItem('stash-lab-sidebar-collapsed')}catch(e){}let sidebarCollapsed=smallScreen()?true:savedCollapse==='true';
function setSidebarCollapsed(collapsed,save=true){sidebarCollapsed=Boolean(collapsed);appShell.classList.toggle('sidebar-collapsed',sidebarCollapsed);$('sidebarToggle').setAttribute('aria-expanded',String(!sidebarCollapsed));$('sidebarToggle').setAttribute('aria-label',sidebarCollapsed?'展開側邊欄':'收合側邊欄');$('sideScrim').hidden=sidebarCollapsed||!smallScreen();if(save){try{localStorage.setItem('stash-lab-sidebar-collapsed',String(sidebarCollapsed))}catch(e){}}requestAnimationFrame(renderGrid)}
let settingsOpener=null;
function switchPage(page){
 const settings=page==='settings';
 if(settings){
  if($('settingsPage').hidden)settingsOpener=document.activeElement;
  $('settingsPage').hidden=false;$('settingsScrim').hidden=false;
  document.querySelectorAll('[data-page]').forEach(b=>{const current=b.dataset.page==='settings';b.classList.toggle('active',current);if(current)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  $('closeSettingsBtn').focus();return;
 }
 persist();
 $('settingsPage').hidden=true;$('settingsScrim').hidden=true;
 if(settingsOpener?.isConnected)settingsOpener.focus();settingsOpener=null;
 $('plannerPage').hidden=false;setLeftView('inventory');

 $('plannerPage').setAttribute('aria-label',t('倉庫規劃','Stash planner'));
 document.querySelectorAll('[data-page]').forEach(b=>{const current=b.dataset.page===page;b.classList.toggle('active',current);if(current)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 if(smallScreen())setSidebarCollapsed(true,false);
 if(!settings){plan();requestAnimationFrame(renderGrid)}
}
// Keep intrinsic text widths in sync with results, language, fonts and dragging.
function initAnalysisSizing(){
 const layout=$('plannerLayout'),panel=$('result'),metrics=panel.querySelector('.metrics'),actions=panel.querySelector('.analysis-actions');
 const horizontalChrome=element=>{const css=getComputedStyle(element);return ['paddingLeft','paddingRight','borderLeftWidth','borderRightWidth'].reduce((total,key)=>total+(parseFloat(css[key])||0),0)};
 const textWidth=element=>{const range=document.createRange();range.selectNodeContents(element);return range.getBoundingClientRect().width};
 let frame=0;
 const update=()=>{
  frame=0;
  const cellWidth=Math.max(...[...metrics.children].map(cell=>Math.max(...[...cell.children].map(textWidth))+horizontalChrome(cell)));
  const buttonWidth=Math.max(...[...actions.children].map(button=>textWidth(button)+horizontalChrome(button)));
  const gap=parseFloat(getComputedStyle(actions).columnGap)||0;
  const minimum=Math.ceil(Math.max(cellWidth*3+horizontalChrome(metrics),buttonWidth*2+gap)+horizontalChrome(panel));
  const value=`${Math.max(220,minimum)}px`;
  if(layout.style.getPropertyValue('--analysis-min-width')!==value)layout.style.setProperty('--analysis-min-width',value);
  actions.classList.toggle('is-wide',actions.clientWidth>=Math.ceil(buttonWidth*4+gap*3));
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
 new ResizeObserver(schedule).observe(panel);
 new MutationObserver(schedule).observe(panel,{childList:true,characterData:true,subtree:true});
 document.fonts?.ready.then(schedule);
 schedule();
}
initAnalysisSizing();
function initLayoutResizers(){
 const layout=$('plannerLayout');if(!layout)return;
 const panels=[$('inventory'),$('result'),document.querySelector('.visual')];
 const bars=[...layout.querySelectorAll('[data-resizer]')];
 const minWidths=()=>[250,Math.max(220,parseFloat(getComputedStyle(layout).getPropertyValue('--analysis-min-width'))||220),260];
 const storageKey='stash-lab-layout-columns';
 const readWidths=()=>panels.map(panel=>panel.getBoundingClientRect().width);
 const setWidths=widths=>{
  const total=widths.reduce((sum,width)=>sum+width,0);if(!total)return;
  ['--inventory-fr','--analysis-fr','--preview-fr'].forEach((name,index)=>layout.style.setProperty(name,`${widths[index]/total}fr`));
  bars.forEach((bar,index)=>{
   const pair=widths[index]+widths[index+1];
   bar.setAttribute('aria-valuemin',String(minWidths()[index]));
   bar.setAttribute('aria-valuemax',String(Math.max(minWidths()[index],Math.round(pair-minWidths()[index+1]))));
   bar.setAttribute('aria-valuenow',String(Math.round(widths[index])));
  });
 };
 const saveWidths=()=>{
  const widths=readWidths(),total=widths.reduce((sum,width)=>sum+width,0);
  if(!total)return;
  try{localStorage.setItem(storageKey,JSON.stringify(widths.map(width=>width/total)))}catch(e){}
 };
 try{
  const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
  if(Array.isArray(saved)&&saved.length===3&&saved.every(value=>Number.isFinite(value)&&value>0))setWidths(saved);
 }catch(e){}
 const updatePair=(index,leftWidth,pairWidth)=>{
  const widths=readWidths();
  const minLeft=minWidths()[index],minRight=minWidths()[index+1];
  const nextLeft=Math.max(minLeft,Math.min(pairWidth-minRight,leftWidth));
  widths[index]=nextLeft;widths[index+1]=pairWidth-nextLeft;setWidths(widths);
 };
 bars.forEach((bar,index)=>{
  let drag=null;
  bar.addEventListener('pointerdown',event=>{
   if(event.button!==0&&event.pointerType==='mouse')return;
   const widths=readWidths();drag={pointerId:event.pointerId,startX:event.clientX,left:widths[index],pair:widths[index]+widths[index+1]};
   bar.classList.add('is-resizing');bar.setPointerCapture(event.pointerId);event.preventDefault();
  });
  bar.addEventListener('pointermove',event=>{
   if(!drag||drag.pointerId!==event.pointerId)return;
   updatePair(index,drag.left+event.clientX-drag.startX,drag.pair);
  });
  const endDrag=event=>{
   if(!drag||drag.pointerId!==event.pointerId)return;
   drag=null;bar.classList.remove('is-resizing');saveWidths();
  };
  bar.addEventListener('pointerup',endDrag);bar.addEventListener('pointercancel',endDrag);
  bar.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
   event.preventDefault();const widths=readWidths(),pair=widths[index]+widths[index+1];
   const step=event.shiftKey?32:12,delta=event.key==='ArrowRight'?step:-step;
   updatePair(index,widths[index]+delta,pair);saveWidths();
  });
 });
 requestAnimationFrame(()=>setWidths(readWidths()));
}
initLayoutResizers();
function updateStashControls(){
 const w=state.stashW,h=state.stashH;
 $('stashWidth').value=w;$('stashHeight').value=h;
 $('stashPreset').value=['10x28','10x38','10x48','10x68'].includes(`${w}x${h}`)?`${w}x${h}`:'custom';
 $('stashCapacity').textContent=`${w*h} ${t('格','slots')}`;
}
$('stashPreset').addEventListener('change',e=>{if(e.target.value==='custom'){$('stashWidth').focus();return}const [w,h]=e.target.value.split('x').map(Number);state.stashW=w;state.stashH=h;updateStashControls();persist();plan()});
for(const [input,prop,lo,hi] of [['stashWidth','stashW',4,20],['stashHeight','stashH',8,100]]){
 $(input).addEventListener('change',e=>{state[prop]=Math.max(lo,Math.min(hi,Number(e.target.value)||lo));updateStashControls();persist();plan()});
}
$('sidebarToggle').addEventListener('click',()=>setSidebarCollapsed(!sidebarCollapsed));$('sideScrim').addEventListener('click',()=>setSidebarCollapsed(true,false));document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>switchPage(b.dataset.page)));setSidebarCollapsed(sidebarCollapsed,false);
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();if(!$('settingsPage').hidden)switchPage('stash');setLeftView('inventory');$('search').focus()}if(e.key==='Escape'){if(!$('customModal').hidden)closeModal();else if(!$('settingsPage').hidden)switchPage('stash');else if(smallScreen()&&!sidebarCollapsed)setSidebarCollapsed(true,false)}if(e.key==='Tab'&&!$('settingsPage').hidden){const focusable=[...$('settingsPage').querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')];const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||!$('settingsPage').contains(document.activeElement))){e.preventDefault();last?.focus()}else if(!e.shiftKey&&(document.activeElement===last||!$('settingsPage').contains(document.activeElement))){e.preventDefault();first?.focus()}}});
// Validate rectangular geometry and backpack nesting rules independently.
// Same-family bans include different colors and indirect nesting through an intermediate backpack.
function placementViolation(parent,item){
 if(parent.cat==='stash')return null;
 if(parent.onlyMeds)return 'med-only';
 if(!parent.allowBags)return 'no-backpack';
 {
  for(let ancestor=parent;ancestor;ancestor=ancestor.parent){
   if(ancestor.cat!=='bag')continue;
   if(ancestor.nestFamily&&item.nestFamily&&ancestor.nestFamily===item.nestFamily&&
      (ancestor.blockSameFamily||item.blockSameFamily))return 'same-family';
  }
 }
 return null;
}
function canPlaceItem(parent,item){return placementViolation(parent,item)===null}
// Defensive assertion: do not expose a layout if any geometric/stacking constraint is violated.
function validPacking(root,depthLimit){
 const seen=new Set();
 function walk(parent){
  if(seen.has(parent.uid)||parent.depth>depthLimit)return false;
  seen.add(parent.uid);
  const grids=parent.spaces.map(sp=>Array(sp.w*sp.h).fill(false));
  for(const child of parent.children){
   const loc=child.location,region=parent.spaces[loc?.ci];
   if(child.cat!=='bag'||!region||child.parent!==parent||child.depth!==parent.depth+1||!canPlaceItem(parent,child))return false;
   const sw=loc.rot?child.oh:child.ow, sh=loc.rot?child.ow:child.oh;
   if(loc.w!==sw||loc.h!==sh||loc.x<0||loc.y<0||loc.x+sw>region.w||loc.y+sh>region.h)return false;
   for(let y=loc.y;y<loc.y+sh;y++)for(let x=loc.x;x<loc.x+sw;x++){
    const index=y*region.w+x;if(grids[loc.ci][index])return false;grids[loc.ci][index]=true;
   }
   if(!walk(child))return false;
  }
  return true;
 }
 return walk(root);
}
function unplacedReason(root,item,depthLimit,rotate){
 if(!root)return '';
 let blockedSame=false, blockedDepth=false, legalSpace=false;
 for(const parent of allNodes(root)){
  const fits=parent.spaces.some(sp=>
    (item.ow<=sp.w&&item.oh<=sp.h)||(rotate&&item.oh<=sp.w&&item.ow<=sp.h));
  if(!fits)continue;
  if(parent.depth>=depthLimit){blockedDepth=true;continue}
  const reason=placementViolation(parent,item);
  if(reason==='same-family')blockedSame=true;
  else if(!reason)legalSpace=true;
 }
 if(!legalSpace&&blockedSame)return 'same-family';
 if(!legalSpace&&blockedDepth)return 'depth';
 return 'space';
}
function explainUnplaced(sol,item){
 const reason=unplacedReason(sol.root,item,state.depth,state.rotate);
 if(reason==='same-family')return t('同款 Takedown 禁止互相套包','Same-family Takedown nesting prohibited');
 if(reason==='depth')return t('達到巢狀層數上限','Nesting depth limit');
 return t('格子不足或其他收納限制','Insufficient space or other restriction');
}
function allNodes(root){const out=[root];for(let i=0;i<out.length;i++)out.push(...out[i].children);return out}
function getSteps(root){const steps=[];function visit(parent){for(const child of parent.children)visit(child);for(const child of parent.children){const p=child.location;steps.push({from:child,to:parent,loc:p})}}visit(root);return steps}
function shortNode(n){return `${n.n} [${n.uid.split('#')[1]}]`}
let packingWorker=null,searchGeneration=0,packingInputKey=null,packingVisited=0,packingStopping=false,packingHasRun=false,packingPhase='idle',packingStopTimer=0;
function restorePackingParents(node,parent=null){node.parent=parent;node.children=node.children.map(child=>restorePackingParents(child,node));return node}
function updateAnalysisButtons(){
 const running=packingPhase!=='idle',hasItems=count()>0;
 const configure=(id,disabled,reason)=>{const button=$(id);button.disabled=disabled;button.title=disabled?reason:''};
 configure('startSearchBtn',running||!hasItems,running?t('分析進行中，可停止或重新分析','Analysis is running; stop or restart it'):t('請先加入背包','Add a backpack first'));
 configure('cancelSearchBtn',!running||packingStopping,packingStopping?t('正在等待停止確認，可按重新分析','Waiting for stop confirmation; you can restart'):t('目前沒有進行中的分析','No analysis is running'));
 configure('continueSearchBtn',running||!packingHasRun||state.solution?.optimal===true||!hasItems,
  running?t('請先停止目前分析','Stop the current analysis first'):state.solution?.optimal?t('已證明最佳解，可按重新分析','Optimality is proven; you can restart'):t('請先開始分析','Start an analysis first'));
 configure('restartSearchBtn',!hasItems,t('請先加入背包','Add a backpack first'));
}
function showSearchStatus(message){
 $('searchStatus').hidden=false;$('searchStatusText').textContent=message;
 $('searchTotalCount').textContent=packingVisited.toLocaleString();
 updateAnalysisButtons();
}
function betterPacking(a,b){
 if(!b)return true;
 for(const key of ['packedBags','free']){if(a[key]!==b[key])return a[key]>b[key]}
 return true;
}
function plan(options={}){
 clearTimeout(autoTimer);
 const input={mode:'stash',depth:state.depth,rotate:state.rotate,stashW:state.stashW,stashH:state.stashH,items:getAll().map(it=>({it,qty:Math.min(100,Math.max(0,Number(state.qty[it.id])||0))})).filter(entry=>entry.qty>0)};
 const inputKey=JSON.stringify(input),sameInput=inputKey===packingInputKey;
 if(options.prepareOnly||(!state.liveAnalysis&&!options.restart&&!options.unlimited)){
  if(!sameInput){
   clearTimeout(packingStopTimer);packingWorker?.terminate();packingWorker=null;++searchGeneration;packingStopping=false;packingHasRun=false;packingPhase='idle';
   packingInputKey=inputKey;packingVisited=0;state.solution=null;state.viewId=null;
   showSearchStatus(!count()?t('請先加入背包','Add a backpack first'):state.liveAnalysis?t('配置已變更，等待分析','Configuration changed; waiting to analyze'):t('配置待分析；請按開始分析','Configuration ready; press Start analysis'));
  }
  renderResult();return;
 }
 if(sameInput&&packingHasRun&&!options.restart&&!options.unlimited){renderResult();return}
 const continuing=sameInput&&options.unlimited;
 if(!continuing){packingVisited=0;state.solution=null;state.viewId=null}
 const baseVisited=packingVisited;
 if(continuing&&state.solution?.resumeHint)input.resumeHint=state.solution.resumeHint;
 input.unlimited=!!options.unlimited;input.requestId=globalThis.crypto?.randomUUID?.()||`analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`;
 packingHasRun=true;packingInputKey=inputKey;packingWorker?.terminate();const generation=++searchGeneration;packingStopping=false;packingPhase='running';clearTimeout(packingStopTimer);
 renderResult();showSearchStatus(options.unlimited?t('持續分析中 · 無時間上限；尚未證明最佳','Analyzing without a time limit; optimality not yet proven'):t('正在分析收納配置…','Analyzing packing constraints…'),true);
 let worker;
 try{worker=new Worker('packing-worker.js');packingWorker=worker}catch(error){packingWorker=null;packingPhase='idle';showSearchStatus(t('分析失敗：','Analysis failed: ')+error.message);return}
 function finish(message){clearTimeout(packingStopTimer);packingWorker=null;packingStopping=false;packingPhase='idle';worker.terminate();showSearchStatus(message)}
 worker.onmessage=event=>{
  if(generation!==searchGeneration||packingWorker!==worker)return;const message=event.data;
  if(Number.isFinite(message.visited))packingVisited=Math.max(packingVisited,baseVisited+message.visited);
  $('searchTotalCount').textContent=packingVisited.toLocaleString();
  if(message.type==='solution'||message.type==='complete'){
   const result=message.result;
   if(result){
    result.root=restorePackingParents(result.root);
    if(!validPacking(result.root,state.depth)){finish(t('分析結果未通過幾何驗證','Analysis result failed geometric validation'));return}
    if(betterPacking(result,state.solution)){state.solution=result;state.viewId=result.root.uid;renderResult()}
   }
  }
  if(message.type==='progress'||message.type==='solution'){
   if(!packingStopping)showSearchStatus(input.unlimited?t('持續分析中 · 無時間上限；尚未證明最佳','Analyzing without a time limit; optimality not yet proven'):t('分析中 · 尚未證明最佳','Analyzing; optimality not yet proven'),true);
  }else if(message.type==='complete'){
   const result=state.solution;
   finish(result?.optimal?(result.allBagsPacked?t(`最佳解已證明 · 所有背包已放入，倉庫剩餘 ${result.free} 格`,`Optimal solution proven · all backpacks packed; ${result.free} stash slots free`):t('已證明無法放入所有背包；顯示可放入最多背包的最佳方案','Not all backpacks can fit; showing the proven optimal partial plan')):message.reason==='stopped'?t('分析已停止；保留目前方案與累計查找數，可繼續分析','Analysis stopped; the current plan and total are retained. You can continue.'):message.reason==='infeasible'?t('目前設定無可行配置','No feasible packing with the current settings'):message.reason==='limit'?(input.unlimited?t('本次分析已結束，尚未證明最佳；可繼續分析','Analysis ended without an optimality proof; you can continue'):t('已達分析上限；可按繼續分析解除時間上限','Analysis limit reached; continue to remove the time limit')):t('請先加入背包','Add a backpack to begin'));
  }else if(message.type==='control-error'){
   packingStopping=false;packingPhase='running';clearTimeout(packingStopTimer);showSearchStatus(t('停止分析失敗：','Unable to stop analysis: ')+message.message,true);
  }else if(message.type==='error')finish(t('分析失敗：','Analysis failed: ')+message.message);
 };
 worker.onerror=event=>{if(generation===searchGeneration&&packingWorker===worker)finish(t('分析失敗：','Analysis failed: ')+event.message)};
 worker.onmessageerror=()=>{if(generation===searchGeneration&&packingWorker===worker)finish(t('分析資料讀取失敗，可重新分析','Unable to read analysis data; you can restart'))};
 try{worker.postMessage(input)}catch(error){finish(t('分析失敗：','Analysis failed: ')+error.message)}
}
$('cancelSearchBtn').addEventListener('click',()=>{
 if(!packingWorker||packingStopping)return;
 packingStopping=true;packingPhase='stopping';showSearchStatus(t('正在停止分析並取得最後查找總數…','Stopping analysis and collecting the final search total…'),true);
 const worker=packingWorker,generation=searchGeneration;
 worker.postMessage({command:'stop'});
 clearTimeout(packingStopTimer);packingStopTimer=setTimeout(()=>{
  if(generation!==searchGeneration||packingWorker!==worker||!packingStopping)return;
  worker.terminate();packingWorker=null;packingStopping=false;packingPhase='idle';
  showSearchStatus(t('停止確認逾時；已中斷連線並保留目前方案與已收到的查找數，可繼續或重新分析','Stop confirmation timed out; disconnected and retained the current plan and received search count. You can continue or restart.'));
 },5000);
});
$('startSearchBtn').addEventListener('click',()=>plan({restart:true}));
$('liveAnalysisToggle').checked=state.liveAnalysis;
$('liveAnalysisToggle').addEventListener('change',e=>{
 state.liveAnalysis=e.target.checked;persist();
 if(state.liveAnalysis)plan({restart:true});
 else if(packingWorker&&!packingStopping)$('cancelSearchBtn').click();
});
$('continueSearchBtn').addEventListener('click',()=>plan({unlimited:true}));
$('restartSearchBtn').addEventListener('click',()=>plan({restart:true}));
function getCurrentNode(){const res=state.solution;if(!res)return null;return allNodes(res.root).find(n=>n.uid===state.viewId)||res.root}
function renderStashLeftovers(sol){
 const panel=$('stashLeftovers');panel.hidden=false;
 const list=sol?.unplaced||[];
 $('stashLeftoversTitle').textContent=t('未放入倉庫','Not placed in stash');
 $('stashLeftoversCount').textContent=String(list.length);
 if(!list.length){
  $('stashLeftoversList').innerHTML=`<div class="stash-leftover-empty">${sol?.total?t('所有已選背包都已成功放入倉庫','All selected items are inside the stash'):t('尚未選擇背包','No items selected')}</div>`;
  return;
 }
 const grouped=new Map();
 for(const it of list){if(!grouped.has(it.id))grouped.set(it.id,{item:it,qty:0});grouped.get(it.id).qty++}
 const rows=[...grouped.values()].sort((a,b)=>b.qty-a.qty||AREA(b.item)-AREA(a.item));
 $('stashLeftoversList').innerHTML=rows.map(({item,qty})=>`<div class="stash-leftover-row" title="${esc(explainUnplaced(sol,item))}"><span class="stash-leftover-icon">${icon(item.cat)}</span><span class="stash-leftover-name">${esc(itemName(item))}</span><span class="stash-leftover-size">${item.ow}×${item.oh}</span><span class="stash-leftover-qty">×${qty}</span></div>`).join('');
}
function renderResult(){const sol=state.solution;const badge=$('resultBadge');renderStashLeftovers(sol);
  badge.className='result-badge '+(!sol?'nope':sol.included===sol.total?'':'partial');
  badge.textContent=!sol?t('等待輸入','Awaiting items'):sol.included===sol.total?t('全部可收納','Everything fits'):t('部分可收納','Partial fit');
  $('mCount').textContent=sol?`${sol.included}/${sol.total}`:'—';
  $('mCountSub').textContent=t('已放入倉庫','Placed in stash');
  $('mSave').textContent=sol?String(sol.saving):'—';
  $('mSaveSub').textContent=sol?`${sol.before} → ${sol.after} ${t('格','slots')}`:'—';
  $('mDepth').textContent=sol?`${state.stashW*state.stashH-sol.used}`:'—';
  $('mDepthSub').textContent=sol?`${t('總容量','Capacity')} ${state.stashW*state.stashH} ${t('格','slots')}`:'—';
  document.querySelector('#mCount').nextElementSibling.textContent=t('倉庫內背包','Items inside stash');
  document.querySelector('#mDepth').nextElementSibling.textContent=t('倉庫剩餘空格','Free stash slots');
  $('resultMessage').textContent=!sol?t('選擇背包後開始配置','Select backpacks to plan the stash'):sol.unplaced.length?t(`已放入 ${sol.included} 件，另有 ${sol.unplaced.length} 件無法放入。請調整倉庫尺寸或套包規則。`,`Placed ${sol.included} items; ${sol.unplaced.length} items remain outside. Adjust stash dimensions or nesting rules.`):t(`已將 ${sol.included} 件背包配置到 ${state.stashW} × ${state.stashH} 倉庫，含背包巢狀收納。`,`Placed ${sol.included} items in the ${state.stashW} × ${state.stashH} stash, including nested backpacks.`);
 renderGrid();renderStepsForSolution(sol);}
function renderStepsForSolution(sol){const steps=sol?getSteps(sol.root):[];$('stepCount').textContent=`${steps.length} ${t('步驟','STEPS')}`;$('stepList').innerHTML=steps.length?steps.map((s,i)=>`<li class="step"><div class="step-n">${String(i+1).padStart(2,'0')}</div><div class="step-main"><b>${esc(itemName(s.from))} [${s.from.uid.split('#')[1]}]</b> <span style="color:#8d9c8a">${t('放入','into')}</span> <b>${esc(itemName(s.to))} [${s.to.uid.split('#')[1]}]</b><div class="step-detail">${t(`第 ${s.loc.ci+1} 區 · 第 ${s.loc.x+1} 欄 / 第 ${s.loc.y+1} 列`,`Compartment ${s.loc.ci+1} · Column ${s.loc.x+1}, row ${s.loc.y+1}`)} · ${s.loc.w}×${s.loc.h}${s.loc.rot?t(' · 旋轉 90°',' · rotated 90°'):''}</div></div><div class="step-kind">${t('背包','Backpack')}</div></li>`).join(''):`<li class="empty-list">${sol?t('無需移動背包','No moves required'):t('完成規劃後產生逐步指引','Steps appear after planning')}</li>`;
 $('unplaced').classList.toggle('is-hidden',!sol||!sol.unplaced.length);$('unplacedTags').innerHTML=sol?.unplaced.map(i=>`<span title="${esc(explainUnplaced(sol,i))}">${esc(itemName(i))} (${i.ow}×${i.oh}) · ${esc(explainUnplaced(sol,i))}</span>`).join('')||''}

function renderPreviewPath(node){
 const nav=$('previewPath');
 if(!node){nav.innerHTML=`<span class="path-empty">${t('尚無收納路徑','No packing path yet')}</span>`;return}
 const nodes=[];for(let it=node;it;it=it.parent)nodes.unshift(it);
 nav.innerHTML=nodes.map((it,index)=>`${index?'<span class="path-chevron" aria-hidden="true">/</span>':''}<button type="button" class="path-seg" data-path="${esc(it.uid)}" ${index===nodes.length-1?'aria-current="location"':''} title="${esc(itemName(it))}">${esc(itemName(it))}${it.cat==='stash'?'':` #${esc(it.uid.split('#')[1])}`}</button>`).join('');
 // Current nested level stays visible when a long path overflows.
 nav.scrollLeft=nav.scrollWidth;
}
$('previewPath').addEventListener('click',e=>{
 const btn=e.target.closest('[data-path]');if(!btn||btn.dataset.path===state.viewId)return;
 if(allNodes(state.solution?.root||{children:[]}).some(n=>n.uid===btn.dataset.path)){
  state.viewId=btn.dataset.path;renderGrid();
 }
});
$('previewPath').addEventListener('wheel',e=>{
 const nav=$('previewPath');if(nav.scrollWidth<=nav.clientWidth)return;
 const amount=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;
 if(!amount)return;
 e.preventDefault();nav.scrollLeft+=amount;
},{passive:false});
function xrayGeometry(node){const spaces=node.spaces||[];return {width:Math.max(1,spaces.reduce((sum,sp)=>sum+sp.w+.35,0)-.35),height:Math.max(1,...spaces.map(sp=>sp.h))}}
function renderXrayNode(node,depth=0,frame='',angle=0){
 const g=xrayGeometry(node),quarter=angle%180!==0;
 const width=quarter?g.height:g.width,height=quarter?g.width:g.height;
 const transform=angle===90?`translate(${g.height},0) rotate(90)`:angle===180?`translate(${g.width},${g.height}) rotate(180)`:angle===270?`translate(0,${g.width}) rotate(270)`:'';
 const mapRect=(x,y,w,h)=>angle===90?{x:g.height-y-h,y:x,w:h,h:w}:angle===180?{x:g.width-x-w,y:g.height-y-h,w,h}:angle===270?{x:y,y:g.width-x-w,w:h,h:w}:{x,y,w,h};
 let offset=0,grid='',items='';
 (node.spaces||[]).forEach((sp,ci)=>{
  const x=offset;offset+=sp.w+.35;
  grid+=`<rect x="${x}" y="0" width="${sp.w}" height="${sp.h}" fill="#18231b" stroke="#718469" stroke-width=".045"/>`;
  for(let col=1;col<sp.w;col++)grid+=`<path d="M${x+col} 0V${sp.h}" stroke="#53634d" stroke-width=".025"/>`;
  for(let row=1;row<sp.h;row++)grid+=`<path d="M${x} ${row}H${x+sp.w}" stroke="#53634d" stroke-width=".025"/>`;
  items+=(node.children||[]).filter(child=>child.location?.ci===ci).map(child=>{
   const p=child.location,r=mapRect(x+p.x,p.y,p.w,p.h);let inside='';
   if(child.spaces?.length&&depth<8)inside=renderXrayNode(child,depth+1,`x="${r.x+.08}" y="${r.y+.3}" width="${Math.max(.05,r.w-.16)}" height="${Math.max(.05,r.h-.38)}"`,(angle+(p.rot?90:0))%360);
   return `<g data-view="${esc(child.uid)}" class="xray-item xray-bag"><title>${esc(itemName(child))} · ${p.w}×${p.h}</title><rect x="${r.x+.025}" y="${r.y+.025}" width="${Math.max(.05,r.w-.05)}" height="${Math.max(.05,r.h-.05)}" fill="#574a2e" stroke="#d9b47a" stroke-width=".055"/><svg class="xray-label" x="${r.x+.06}" y="${r.y+.04}" width="${Math.max(.05,r.w-.12)}" height=".23" data-label-height="${Math.max(.05,r.h-.08)}" overflow="hidden"><text x="0" y=".19" font-size=".2" fill="#fff0cd">${esc(itemName(child))}</text></svg>${inside}</g>`;
  }).join('');
 });
 // Rotate geometry only; labels are drawn at the top in the final display coordinates.
 return `<svg ${frame||'class="xray-root" width="100%"'} viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" overflow="hidden" xmlns="http://www.w3.org/2000/svg" style="overflow:hidden">${transform?`<g transform="${transform}">${grid}</g>`:grid}${items}</svg>`;
}
function updatePreviewZoom(maximum){
 previewMaxCell=Math.max(.5,maximum);previewRenderedCell=previewCellSize===null?previewMaxCell:Math.min(previewCellSize,previewMaxCell);
 $('previewZoomIn').disabled=previewRenderedCell>=previewMaxCell-.05;
 $('previewZoomOut').disabled=previewRenderedCell<=Math.min(4,previewMaxCell)+.05;
 return previewRenderedCell;
}
function sizeXrayLabels(){
 document.querySelectorAll('.xray-label').forEach(label=>{
  const text=label.querySelector('text'),matrix=text.getScreenCTM();if(!matrix)return;
  const scale=Math.hypot(matrix.a,matrix.b);if(!Number.isFinite(scale)||scale<=0)return;
  text.setAttribute('font-size',String(12/scale));text.setAttribute('y',String(12/scale));
  const labelHeight=Math.min(Number(label.dataset.labelHeight),16/scale);label.setAttribute('height',String(labelHeight));
  const inner=label.nextElementSibling,rect=label.previousElementSibling;
  if(inner?.tagName.toLowerCase()==='svg'&&rect?.tagName.toLowerCase()==='rect'){
   const bottom=Number(rect.getAttribute('y'))+Number(rect.getAttribute('height'))-.04;
   const top=Math.min(bottom-.005,Number(label.getAttribute('y'))+labelHeight+.04);
   inner.setAttribute('y',String(top));inner.setAttribute('height',String(Math.max(.005,bottom-top)));
  }
 });
}
$('previewZoomIn').addEventListener('click',()=>{previewCellSize=Math.min(previewMaxCell,previewRenderedCell+4);renderGrid()});
$('previewZoomOut').addEventListener('click',()=>{previewCellSize=Math.max(Math.min(4,previewMaxCell),previewRenderedCell-4);renderGrid()});
let previewResizeWidth=0,previewResizeFrame=0;
new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-previewResizeWidth)<.5)return;previewResizeWidth=width;cancelAnimationFrame(previewResizeFrame);previewResizeFrame=requestAnimationFrame(renderGrid)}).observe(document.querySelector('#previewPane .visual-content'));
$('xrayToggle').addEventListener('click',()=>{xray=!xray;$('xrayToggle').setAttribute('aria-pressed',String(xray));if(xray&&state.solution)state.viewId=state.solution.root.uid;setViewerPane('preview');renderGrid()});
function renderGrid(){const sol=state.solution,node=getCurrentNode();renderPreviewPath(node);
 $('previewLegendHint').textContent=xray?t('點擊任一層背包直接進入；點擊空白返回上一層','Click any backpack layer to enter; click empty space to go back'):t('點擊圖中的背包可進入下一層');
 const shell=$('gridShell');shell.classList.toggle('can-go-back',Boolean(node?.parent));
 if(!sol||!node){shell.innerHTML=`<div class="grid-workspace" style="flex:1;align-items:center;justify-content:center"><span class="muted-small">${t('選擇背包後顯示預覽','Select items to preview')}</span></div>`;$('fillText').textContent=t('使用率 —','Usage —');$('fillPct').textContent='—';$('fillBar').style.width='0';return}
 const shellStyle=getComputedStyle(shell),usable=Math.max(1,shell.clientWidth-parseFloat(shellStyle.paddingLeft)-parseFloat(shellStyle.paddingRight));
 if(xray){
  shell.classList.add('xray-mode');const geometry=xrayGeometry(node),cell=updatePreviewZoom(usable/geometry.width);shell.innerHTML=renderXrayNode(node);const svg=shell.querySelector('.xray-root');svg.style.width=geometry.width*cell+'px';svg.style.height=geometry.height*cell+'px';sizeXrayLabels();
  const capacity=node.spaces.reduce((n,sp)=>n+sp.w*sp.h,0),filled=node.spaces.reduce((n,sp)=>n+sp.cells.filter(Boolean).length,0),usage=capacity?Math.round(filled/capacity*100):0;
  $('fillText').textContent=t('全層透視 · 滑鼠停留查看名稱','All layers · hover for item names');$('fillPct').textContent=usage+'%';$('fillBar').style.width=usage+'%';return;
 }
 shell.classList.remove('xray-mode');

 const maxW=Math.max(...node.spaces.map(x=>x.w),1);
 const cell=updatePreviewZoom(Math.max(1,usable-2)/maxW);
 let filled=0,capacity=0;
 const region=node.spaces.map((sp,i)=>{capacity+=sp.w*sp.h;filled+=sp.cells.filter(Boolean).length;const children=node.children.filter(n=>n.location.ci===i);let placements=children.map(child=>{const p=child.location;return `<button class="node-cell" style="grid-column:${p.x+1}/span ${p.w};grid-row:${p.y+1}/span ${p.h}" data-view="${esc(child.uid)}" title="${esc(itemName(child))} (${p.w}×${p.h})"><span class="node-cell-inner"><span class="node-cell-title">${esc(itemName(child).split(' ')[0])} #${esc(child.uid.split('#')[1])}</span><span class="node-cell-arrow">↗</span></span><span class="node-cell-dim">${p.w} × ${p.h}</span></button>`}).join('');return `<div class="compartment-holder"><div class="compartment" role="group" aria-label="${t('區域','Compartment')} ${i+1} ${sp.w}×${sp.h}" style="grid-template-columns:repeat(${sp.w},${cell}px);grid-template-rows:repeat(${sp.h},${cell}px)">${Array.from({length:sp.w*sp.h},()=>'<div class="grid-square" aria-hidden="true"></div>').join('')}${placements}</div><div class="compartment-label">${t('區域','COMPARTMENT')} ${String(i+1).padStart(2,'0')}　/　${sp.w} × ${sp.h}</div></div>`}).join('');const usage=capacity?Math.round(filled/capacity*100):0;shell.innerHTML=`<div class="grid-workspace">${region}</div>`;$('fillText').textContent=node.cat==='stash'?t(`倉庫已占用 ${filled} / ${capacity} 格`,`Stash: ${filled} / ${capacity} slots used`):t(`本層已占用 ${filled} / ${capacity} 格`,`This level: ${filled} / ${capacity} slots used`);$('fillPct').textContent=`${usage}%`;$('fillBar').style.width=usage+'%';}
$('gridShell').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b){const n=allNodes(state.solution?.root||{children:[]}).find(n=>n.uid===b.dataset.view);if(n&&n.cat==='bag'){state.viewId=n.uid;renderGrid()}return}const node=getCurrentNode();if(node?.parent){state.viewId=node.parent.uid;renderGrid()}});
function setViewerPane(pane){const steps=pane==='steps';$('previewPane').hidden=steps;$('stepsPane').hidden=!steps;$('previewPath').hidden=steps;document.querySelectorAll('[data-pane]').forEach(b=>{const selected=b.dataset.pane===pane;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected))});if(!steps)requestAnimationFrame(renderGrid)}
document.querySelectorAll('[data-pane]').forEach(b=>b.addEventListener('click',()=>setViewerPane(b.dataset.pane)));

function copyText(){const sol=state.solution;if(!sol){toast(t('請先加入至少一個背包','Add at least one backpack first'));return}const lines=[`STASH / LAB 套包收納規劃`,`倉庫：${state.stashW} × ${state.stashH}`,`總數：${sol.total} 件｜放入倉庫：${sol.included} 件｜剩餘：${sol.unplaced.length} 件`,`節省倉庫格數：${sol.saving} 格（${sol.before} → ${sol.after}）`,`巢狀層數：${Math.max(0,...allNodes(sol.root).map(node=>node.depth))} / ${state.depth}`,``,...getSteps(sol.root).map((s,i)=>`${i+1}. ${shortNode(s.from)} → ${shortNode(s.to)}｜第${s.loc.ci+1}區 (${s.loc.x+1},${s.loc.y+1}) ${s.loc.w}×${s.loc.h}${s.loc.rot?' [旋轉]':''}`),...sol.unplaced.length?['','未收納：',...sol.unplaced.map(i=>`- ${i.n}`)]:[],'','注意：已檢查內建同款套包禁令與層數限制；特殊物品規則仍以遊戲實際情況為準。'];return lines.join('\n')}
$('copyBtn').addEventListener('click',async()=>{const s=copyText();if(!s)return;try{await navigator.clipboard.writeText(s);toast(t('已複製完整收納順序','Packing plan copied'))}catch(e){const a=document.createElement('textarea');a.value=s;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast(t('已複製完整收納順序','Packing plan copied'))}catch(e){toast('瀏覽器未允許複製，請使用匯出功能')}a.remove()}});
function download(name,content){const blob=new Blob([content],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function currentConfig(){return JSON.parse(JSON.stringify({format:'stash-lab-v1',qty:state.qty,custom:state.custom,depth:state.depth,rotate:state.rotate,mergeBags:state.mergeBags,stashW:state.stashW,stashH:state.stashH,lang:state.lang,mode:'stash'}))}
function writeMemories(next){localStorage.setItem(MEMORY_KEY,JSON.stringify(next));memories=next;renderMemories()}
function setLeftView(view){
 const show=view==='memories';$('inventoryView').hidden=show;$('savedMemoryView').hidden=!show;
 const nav=$('savedMemoryNav');nav.classList.toggle('active',show);if(show)nav.setAttribute('aria-current','page');else nav.removeAttribute('aria-current');
 document.querySelectorAll('[data-page]').forEach(b=>{const active=!show&&b.dataset.page==='stash';b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
}
function renderMemories(){
 if(!$('savedConfigList'))return;
 $('savedMemoryBadge').textContent=String(memories.length);$('savedMemoryCount').textContent=String(memories.length);
 $('savedConfigList').innerHTML=memories.length?memories.map(m=>`<article class="saved-config-row"><strong title="${esc(m.name)}">${esc(m.name)}</strong><time>${esc(new Date(m.savedAt).toLocaleString(state.lang==='en'?'en-US':'zh-TW'))}</time><div class="saved-config-actions"><button class="btn" data-memory="${esc(m.id)}" data-action="load">${t('載入','Load')}</button><button class="btn btn-ghost" data-memory="${esc(m.id)}" data-action="export">${t('匯出','Export')}</button><button class="btn btn-ghost" data-memory="${esc(m.id)}" data-action="delete">${t('刪除','Delete')}</button></div></article>`).join(''):`<p class="memory-empty">${t('尚未儲存配置。按上方「儲存目前配置」建立記憶。','No saved setups. Choose “Save current setup” to add one.')}</p>`;
}
function remember(config,name){const now=new Date();const entry={id:'m-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),name:name||t('配置','Setup')+' '+now.toLocaleString(state.lang==='en'?'en-US':'zh-TW'),savedAt:now.toISOString(),config};writeMemories([entry,...memories]);return entry}
function applyConfig(d){
 if(!validConfig(d))throw Error(t('不是正確的備份格式','Invalid backup format'));
 const config=backpackConfig({...d,lang:d.lang||state.lang},state.custom);
 for(const key of ['custom','qty','depth','rotate','mergeBags','stashW','stashH','lang'])state[key]=config[key];
 $('mergeBags').checked=state.mergeBags;$('depth').value=String(state.depth);$('rotate').checked=state.rotate;updateStashControls();applyLanguage();changed();switchPage('stash');
}
function exportMemories(){download('stash-lab-memories.json',JSON.stringify({format:'stash-lab-memory-v1',current:currentConfig(),memories},null,2));toast(t('所有記憶已匯出','Saved data exported'))}
function clearMemories(){
 if(!confirm(t('清除所有已儲存配置、自訂背包與目前背包數量？此操作無法復原。','Clear all saved setups, custom items and current quantities? This cannot be undone.')))return;
 writeMemories([]);Object.assign(state,{custom:[],qty:{},depth:6,rotate:true,mergeBags:false,stashW:10,stashH:28});$('depth').value='6';$('rotate').checked=true;$('mergeBags').checked=false;updateStashControls();clearUndo=null;try{sessionStorage.removeItem(UNDO_KEY)}catch(e){}refreshClearUndo();changed();renderMemories();toast(t('已清除所有記憶','All saved data cleared'));
}
$('savedMemoryNav').addEventListener('click',()=>{switchPage('stash');setLeftView('memories')});
$('saveConfigBtn').addEventListener('click',()=>{try{persist();remember(currentConfig());setLeftView('memories');toast(t('配置已儲存在此瀏覽器','Setup saved in this browser'))}catch(e){toast(t('儲存失敗：瀏覽器儲存空間不足或無法使用','Unable to save: browser storage is full or unavailable'))}});
$('savedConfigList').addEventListener('click',e=>{const b=e.target.closest('[data-memory]');if(!b)return;const m=memories.find(m=>m.id===b.dataset.memory);if(!m)return;try{if(b.dataset.action==='load'){applyConfig(m.config);toast(t('已載入儲存配置','Saved setup loaded'))}else if(b.dataset.action==='export')download('stash-lab-setup.json',JSON.stringify(m.config,null,2));else if(b.dataset.action==='delete')writeMemories(memories.filter(item=>item.id!==m.id))}catch(err){toast(t('操作失敗：','Operation failed: ')+err.message)}});
$('exportBtn').addEventListener('click',()=>download('stash-lab-inventory.json',JSON.stringify(currentConfig(),null,2)));
['exportLibraryBtn','exportLibrarySettingsBtn'].forEach(id=>$(id).addEventListener('click',exportMemories));
['clearLibraryBtn','clearLibrarySettingsBtn'].forEach(id=>$(id).addEventListener('click',clearMemories));
$('importBtn').addEventListener('click',()=>$('fileInput').click());
$('fileInput').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{
 if(file.size>5000000)throw Error(t('檔案過大','File is too large'));const d=JSON.parse(await file.text());
 if(d.format==='stash-lab-memory-v1'){
  if(!Array.isArray(d.memories)||!validConfig(d.current)||d.memories.some(m=>!m||typeof m.id!=='string'||typeof m.name!=='string'||!validConfig(m.config)))throw Error(t('不是正確的備份格式','Invalid backup format'));
  const merged=new Map(memories.map(m=>[m.id,m]));d.memories.forEach(m=>merged.set(m.id,{...m,config:backpackConfig(m.config,state.custom)}));writeMemories([...merged.values()]);applyConfig(d.current);
 }else{applyConfig(d);remember(currentConfig(),file.name.replace(/\.json$/i,''))}
 setLeftView('memories');toast(t('資料已匯入並儲存','Data imported and saved'));
 }catch(err){toast(t('匯入失敗：','Import failed: ')+err.message)}finally{e.target.value=''}});
function closeModal(){$('customModal').hidden=true;$('customForm').reset();$('modalError').textContent=''}$('customBtn').addEventListener('click',()=>{$('customModal').hidden=false;$('customName').focus()});$('closeModal').addEventListener('click',closeModal);$('cancelModal').addEventListener('click',closeModal);$('customModal').addEventListener('click',e=>{if(e.target===$('customModal'))closeModal()});
$('customForm').addEventListener('submit',e=>{e.preventDefault();const n=$('customName').value.trim(),en=$('customAlias').value.trim(),ow=Number($('customOw').value),oh=Number($('customOh').value),iw=Number($('customIw').value),ih=Number($('customIh').value);if(!n||![ow,oh,iw,ih].every(v=>Number.isInteger(v)&&v>=1&&v<=15)){$('modalError').textContent='請填寫有效名稱與格數（1 至 15）';return}if(state.custom.length>=60){$('modalError').textContent='最多新增 60 種自訂背包';return}const id='u-'+Math.floor(Date.now()/1000).toString(36)+'-'+Math.floor(Math.random()*999999).toString(36);state.custom.push({id,n,en,cat:'bag',ow,oh,comp:[{w:iw,h:ih}],allowBags:$('customAllow').checked,custom:true});state.qty[id]=1;closeModal();state.query='';$('search').value='';setLeftView('inventory');changed();toast(t('自訂背包已新增並選取','Custom backpack added'))});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderGrid,120)});
updateStashControls();applyLanguage();refreshClearUndo();renderCatalog();renderMemories();switchPage('stash');
})();
