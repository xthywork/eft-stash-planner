(()=>{'use strict';
// Item orientation uses WIDTH × HEIGHT. Special backpacks use independent compartments.
// Rigs are treated as terminal items, not one giant rectangular inner pocket.
const B=(id,n,en,ow,oh,comp,opts={})=>({id,n,en,cat:'bag',ow,oh,comp:comp.map(([w,h])=>({w,h})),allowBags:opts.allowBags!==false,onlyMeds:opts.onlyMeds===true,nestFamily:opts.nestFamily||id,blockSameFamily:opts.blockSameFamily===true,custom:false});
const R=(id,n,en,ow,oh,slots)=>({id,n,en,cat:'rig',ow,oh,slots,comp:[],allowBags:false,custom:false});
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
 R('mppv','MPPV 多用途彈掛','Velocity Systems MPPV',4,3,24),
 R('lbcr','LBT-1961A 彈掛','LBT-1961A LBCR',3,3,18),
 R('tv110','TV-110 防彈彈掛','WARTECH TV-110',4,3,23),
 R('a18','A18 防彈彈掛','Ars Arma A18',4,3,25),
 R('avs','AVS 防彈彈掛','Crye Precision AVS',3,4,23),
 R('m1','ANA M1 防彈彈掛','ANA Tactical M1',4,4,20),
 R('m2','ANA M2 防彈彈掛','ANA Tactical M2',4,4,18),
 R('blackrock','BlackRock 彈掛','BlackRock Chest Rig',3,4,20),
 R('zhuk','Azimut Zhuk 彈掛','Azimut SS Zhuk',4,3,20),
 R('poyas','Poyas-A + B 彈掛','Poyas Combo',4,4,25),
 R('thunderbolt','Thunderbolt 彈掛','Direct Action Thunderbolt',3,3,16),
 R('scavvest','Scav 簡易彈掛','Scav Vest',2,3,6),
 R('bankrobber','Bank Robber 彈掛','Spiritus Bank Robber',3,2,8),
 R('micro','Micro Rig 微型彈掛','SOE Micro Rig',2,3,8),
 R('idea','IDEA 簡易彈掛','DIY IDEA Chest Rig',3,2,8),
 R('security','保全彈掛','Security Vest',2,3,6),
 R('ss112','6Sh112 偵察彈掛','UMTBS Scout-Sniper',3,4,12),
 R('commando','Commando 彈掛','BlackHawk Commando',4,3,16),
 R('mkm2','MK2 Assault 彈掛','Stich Profi MK2',3,4,18)
];
const $=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(key)=>`<svg aria-hidden="true"><use href="#i-${key}"></use></svg>`;
const AREA=(i)=>i.ow*i.oh;
const SAMPLE={"6sh118":1,"trizip":1,"scavbp":2,"mbss":2,"mppv":1,"lbcr":1,"scavvest":1};
const KEY='stash-lab-planner-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const state={mode:saved.mode==='stash'?'stash':'workspace',stashW:Math.min(20,Math.max(4,Number(saved.stashW)||10)),stashH:Math.min(100,Math.max(8,Number(saved.stashH)||28)),lang:saved.lang==='en'?'en':'zh',qty:(saved.qty&&typeof saved.qty==='object')?saved.qty:{...SAMPLE},custom:Array.isArray(saved.custom)?saved.custom.filter(isCustomValid).slice(0,60):[],target:typeof saved.target==='string'?saved.target:'auto',depth:Math.min(6,Math.max(2,Number(saved.depth)||6)),rotate:saved.rotate!==false,mergeBags:saved.mergeBags===true,tab:'all',query:'',onlyOwned:false,solution:null,viewId:null};
function isCustomValid(x){return x&&/^u-[\w-]{3,40}$/.test(x.id||'')&&typeof x.n==='string'&&x.n.length<=50&&['bag','rig'].includes(x.cat)&&[x.ow,x.oh].every(v=>Number.isInteger(v)&&v>=1&&v<=15)&&Array.isArray(x.comp)&&x.comp.length<=4&&x.comp.every(c=>Number.isInteger(c.w)&&Number.isInteger(c.h)&&c.w>=1&&c.h>=1&&c.w<=15&&c.h<=15)}
const MEMORY_KEY='stash-lab-memories-v1';
function validConfig(d){return d&&d.format==='stash-lab-v1'&&d.qty&&typeof d.qty==='object'&&!Array.isArray(d.qty)&&Array.isArray(d.custom)}
let memories=[];try{const data=JSON.parse(localStorage.getItem(MEMORY_KEY)||'[]');if(Array.isArray(data))memories=data.filter(m=>m&&typeof m.id==='string'&&typeof m.name==='string'&&validConfig(m.config))}catch(e){}
let xray=false,previewCellSize=null,previewRenderedCell=24,previewMaxCell=24;
const getAll=()=>[...BASE,...state.custom];const byId=id=>getAll().find(i=>i.id===id);const count=()=>Object.entries(state.qty).reduce((n,[id,q])=>n+(byId(id)?Math.min(100,Math.max(0,Number(q)||0)):0),0);
function persist(){try{localStorage.setItem(KEY,JSON.stringify({qty:state.qty,custom:state.custom,target:state.target,depth:state.depth,rotate:state.rotate,mergeBags:state.mergeBags,lang:state.lang,mode:state.mode,stashW:state.stashW,stashH:state.stashH}))}catch(e){}}
let toastTimer=0;function toast(msg){$('toast').textContent=msg;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,2600)}

const LANG_MAP={"等級 1 · 10 × 28":"Level 1 · 10 × 28","等級 2 · 10 × 38":"Level 2 · 10 × 38","等級 3 · 10 × 48":"Level 3 · 10 × 48","等級 4 · 10 × 68":"Level 4 · 10 × 68","倉庫規劃":"Stash planner","倉庫尺寸":"Stash size","依照白邊 PvE 的實際倉庫調整":"Match your Standard PvE stash","倉庫預設尺寸":"Stash preset","自訂尺寸":"Custom size","寬":"W","高":"H","出征背包規劃": "Raid backpack planner", "設定與資料": "Settings & data", "中文 / English": "中文 / English", "離線運作": "Offline mode", "資料僅存放在此瀏覽器": "Saved in this browser only", "不存取遊戲或帳號": "No game or account access", "自訂裝備": "Custom item", "清空數量": "Clear all", "收納設定": "Packing settings", "重新計算": "Recalculate", "匯入 JSON": "Import JSON", "下載 JSON": "Download JSON", "關閉": "Close", "你的裝備清單": "Your inventory", "點選 ＋ / －，建立目前持有的裝備數量": "Use + / − to set quantities", "全部裝備": "All items", "背包": "Backpacks", "彈掛": "Rigs", "只顯示已選": "Selected only", "已加入規劃": "Selected items", "只看已選裝備": "Show selected", "設定收納規則 →": "Packing rules →", "收納分析結果": "Packing analysis", "單一主包內已收納": "Packed into one bag", "節省倉庫格數": "Stash slots saved", "背包巢狀層數": "Nesting depth", "等待輸入": "Awaiting items", "預覽": "Preview", "收納步驟": "Packing steps", "選擇裝備後顯示預覽": "Select items to preview", "點擊圖中的背包可進入下一層": "Click a bag to enter · click empty space to go back", "使用率 —": "Usage —", "實際收納步驟": "Packing steps", "按照由內到外的順序操作；先填滿內袋，再將它放入上一層。": "Pack from the innermost bag outwards.", "完成規劃後產生逐步指引": "Steps appear after planning", "無法放入主背包": "Unable to fit in main backpack", "複製規劃清單": "Copy packing plan", "最外層主背包": "Outer backpack", "最大巢狀層數": "Maximum nesting depth", "允許將裝備旋轉 90° 尋找可行擺法": "Allow 90° rotation to find placements", "彈掛視為完整物品放入背包；其內部分隔口袋不會被誤算成可放其他整件裝備的連續空間。": "Rigs are treated as complete items. Separate rig pockets are not treated as one continuous bag.", "開始計算最佳收納方案": "Calculate packing plan", "選項會自動儲存並同步更新規劃結果": "Options are auto-saved and the plan updates automatically", "清單與備份": "Inventory & backup", "讀取範例，或匯入、匯出你的裝備清單與收納設定。": "Load example items or back up your inventory and settings.", "載入示範配置": "Load example", "規劃前需要知道的事": "How the planner works", "01. 計算的是幾何配置": "01. Geometric packing", "同時檢查內外尺寸、獨立收納分區、放入方向與套包層數。這是多輪啟發式搜尋，會盡量容納最多裝備，不保證數學上的全域最優解。": "The planner checks dimensions, separate compartments, rotation, and nesting depth. It uses a multi-pass heuristic and does not guarantee a global optimum.", "02. 遊戲規則優先": "02. In-game rules take priority", "針對官方 PvE 的倉庫套包。某些特殊背包可能另有物品白名單、禁止套包等限制；實際遊戲若拒絕放置，請依遊戲顯示並調整裝備資料。": "Designed for official PvE stash organization. Some bags may have special restrictions; always follow what the game allows.", "03. 資料留在你的電腦": "03. Your data stays local", "整個網頁可離線運作，不連接 EFT、不需要登入。清單存於本機瀏覽器，也可匯出 JSON 備份。格數資料可參照": "The page runs offline without accessing EFT or requiring sign-in. Your inventory stays in local storage and can be exported as JSON. Reference:", "背包資料": "Backpack data", "彈掛資料": "Rig data", "新增自訂裝備": "Add custom item", "遊戲更新後若有新背包或彈掛，可以手動新增尺寸。背包內部支援單一矩形區域；帶有分隔區域的特殊裝備請以內建資料為準。": "Add new bags or rigs manually. Custom bags support one rectangular inner compartment; use built-in data for compartmentalized items.", "裝備名稱": "Item name", "裝備類型": "Item type", "備註（可選）": "Alias (optional)", "外部寬度（格）": "Outer width (slots)", "外部高度（格）": "Outer height (slots)", "背包內部寬度（格）": "Inner width (slots)", "背包內部高度（格）": "Inner height (slots)", "允許其他背包放入此背包": "Allow other bags inside", "取消": "Cancel", "新增至裝備庫": "Add to inventory", "自動選擇最佳主背包": "Auto-select outer bag", "2 層": "2 levels", "3 層": "3 levels", "4 層": "4 levels", "5 層": "5 levels", "6 層": "6 levels", "7 層（預設）": "7 levels (default)","6 層（建議）": "6 levels (recommended)","遊戲規則：黑色與迷彩 Takedown 視為同款，禁止互相套包；Pillbox 與醫療專用背包不能裝其他背包。套包層數保守限制為 6 層。":"Game rules: Black and MultiCam Takedown count as the same family and cannot nest into each other. Pillbox and medical-only bags cannot hold backpacks. Nesting is conservatively limited to 6 levels.", "搜尋名稱、型號，例如：Scav、MPPV": "Search name or model (e.g. Scav, MPPV)", "例如：我的特殊背包": "e.g. My custom backpack", "英文名稱 / 型號": "English name / model", "區域": "Compartment", "格": "slots", "口袋": "pockets"};
Object.assign(LANG_MAP,{
 "整個網頁可離線運作，不連接 EFT、不需要登入。自訂裝備與目前配置會保存在此瀏覽器，也可從左側管理與匯出。格數資料可參照":"The page runs offline without accessing EFT or requiring sign-in. Custom items and setups stay in this browser. Manage and export them from the left panel. Reference:",
 "停止搜尋":"Stop search","停止分析":"Stop analysis","繼續分析（無視上限）":"Continue analysis (no time limit)","重新分析":"Restart analysis","累計查找總數":"Total searched","個約束分支":"constraint branches","使用 CP-SAT 約束最佳化，同時決定父容器、位置與旋轉，並嚴格檢查尺寸、分區與不重疊。優先放入所有背包，再最大化最外層空格；僅在求解器證明最佳時標示最佳解。":"CP-SAT optimizes containers, positions and rotations together, with strict geometry and non-overlap constraints. Pack all backpacks first, then maximize outer free slots. Optimality is shown only when proven.",
 "儲存目前配置":"Save current setup","裝備清單":"Inventory","已儲存資料":"Saved setups","瀏覽器記憶":"Browser storage","自訂裝備和配置保存在此瀏覽器":"Custom items and setups stay saved in this browser","匯出目前配置":"Export current setup","匯出所有記憶":"Export all saved data","清除所有記憶":"Clear all saved data","在左側儲存或管理本機配置。":"Save and manage setups in the left panel.","透視所有層":"View all layers",

 "依外部長寬與內部容量合併相同背包":"Merge backpacks by footprint and capacity",
 "僅合併清單顯示；滑鼠停留可查看所有型號，實際計算仍使用各背包的原始收納格局。按 ＋ 時會增加群組內既有型號，否則使用首個型號。":"Visual grouping only. Hover to see models; packing retains each model's actual layout. The plus button adds an already-owned model, or the first model in the group.",
 "相同尺寸背包":"Bags with matching size",
 "容量":"Capacity",
 "格":"slots",
 "個型號":"models"
});
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
  const groupId=(state.mergeBags&&item.cat==='bag')?`bag:${bagGroupKey(item)}`:`single:${item.id}`;
  if(!grouped.has(groupId))grouped.set(groupId,{id:groupId,items:[],cat:item.cat});
  grouped.get(groupId).items.push(item);
 }
 const rows=[...grouped.values()].filter(g=>
  (state.tab==='all'||g.cat===state.tab)&&
  (!state.onlyOwned||g.items.some(i=>Number(state.qty[i.id]||0)>0))&&
  (!filter||g.items.some(i=>(i.n+' '+i.en+' '+i.id).toLowerCase().includes(filter))||
   (g.cat==='bag'&&`${bagCapacity(g.items[0])} ${g.items[0].ow}x${g.items[0].oh} ${g.items[0].ow}×${g.items[0].oh}`.includes(filter)))
 );
 $('itemList').innerHTML=rows.map(g=>{
  const i=g.items[0], q=g.items.reduce((n,item)=>n+Number(state.qty[item.id]||0),0);
  const capacity=i.cat==='bag'?bagCapacity(i):i.slots||0;
  const collapsed=g.items.length>1;
  const name=collapsed?`${capacity} ${t('格','slots')} · ${i.ow}×${i.oh}`:itemName(i);
  const detail=collapsed?`${t('外','OUT')} ${i.ow}×${i.oh} <span>／</span> ${t('容量','Capacity')} ${capacity}`:
   t('外','OUT')+` ${i.ow}×${i.oh}`+(i.cat==='bag'?` <span>／</span> `+t('內','IN')+` ${i.comp.map(c=>`${c.w}×${c.h}`).join(' + ')} (${capacity} ${t('格','slots')})`:` <span>／</span> `+t('口袋','POCKETS')+` ${i.slots||'—'}`);
  const names=g.items.map(item=>itemName(item));
  const tip=collapsed?`${t('相同尺寸背包','Bags with matching size')} (${g.items.length} ${t('個型號','models')}):\n${names.join('\n')}\n${t('外','OUT')} ${i.ow}×${i.oh} / ${t('容量','Capacity')} ${capacity}`:name;
  const actionAttr=collapsed?`data-group="${esc(bagGroupKey(i))}"`:`data-id="${esc(i.id)}"`;
  return `<div class="item-card ${q?'owned':''} ${collapsed?'bag-group':''}" data-item="${esc(i.id)}" title="${esc(tip)}"><div class="item-figure">${icon(i.cat)}</div><div class="item-meta"><div class="item-name" title="${esc(tip)}">${esc(name)}</div><div class="item-dim">${detail}</div>${collapsed?`<span class="group-marker" title="${esc(tip)}">${g.items.length} ${t('個型號','models')}</span>`:''}${i.custom&&!collapsed?`<button class="custom-delete" data-action="delete" data-id="${esc(i.id)}" aria-label="${esc(t('刪除','Delete'))} ${esc(name)}">${t('刪除','Delete')}</button>`:''}</div><div class="stepper"><button class="qty-btn" data-action="minus" ${actionAttr} aria-label="${esc(t('減少數量','Decrease quantity'))}: ${esc(name)}">−</button><div class="qty-count">${q}</div><button class="qty-btn" data-action="plus" ${actionAttr} aria-label="${esc(t('增加數量','Increase quantity'))}: ${esc(name)}">+</button></div></div>`;
 }).join('')||`<div class="empty-list">${t('找不到相符裝備。可嘗試其他關鍵字或新增自訂裝備。','No matching items. Try another keyword or add a custom item.')}</div>`;
 $('listMeta').textContent=`${rows.length} ${t('種裝備','types')}`;
 $('ownedCount').textContent=`${count()} ${t('件','ITEMS')}`;
 const choices=all.filter(i=>i.cat==='bag'&&(state.qty[i.id]||0)>0),available=new Set(choices.map(x=>x.id));
 if(state.target!=='auto'&&!available.has(state.target))state.target='auto';
 $('target').innerHTML=`<option value="auto">${t('自動選擇最佳主背包','Auto-select outer bag')}</option>`+choices.map(i=>`<option value="${esc(i.id)}" ${state.target===i.id?'selected':''}>${esc(itemName(i))} (${i.ow}×${i.oh})</option>`).join('');
}

let autoTimer=0;function changed(){persist();renderCatalog();clearTimeout(autoTimer);autoTimer=setTimeout(plan,110)}
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
  if(item?.custom&&confirm(t('要刪除這件自訂裝備嗎？','Delete this custom item?'))){state.custom=state.custom.filter(i=>i.id!==item.id);delete state.qty[item.id];changed();toast(t('自訂裝備已刪除','Custom item deleted'))}
  return;
 }
 // pointerdown already performs the first increment; keyboard-generated clicks do not.
 if(e.detail>0&&lastPointerHandled&&lastPointerHandled.btn===btn&&Date.now()-lastPointerHandled.time<1300)return;
 adjustQuantity(btn);
});
function syncTabs(){document.querySelectorAll('.tab').forEach(b=>{const on=b.dataset.tab===state.tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))})}
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{state.tab=t.dataset.tab;syncTabs();renderCatalog()}));
$('search').addEventListener('input',e=>{state.query=e.target.value;renderCatalog()});$('onlyOwned').addEventListener('change',e=>{state.onlyOwned=e.target.checked;renderCatalog()});
$('target').addEventListener('change',e=>{state.target=e.target.value;changed()});$('depth').value=String(state.depth);$('depth').addEventListener('change',e=>{state.depth=Number(e.target.value);changed()});$('rotate').checked=state.rotate;$('rotate').addEventListener('change',e=>{state.rotate=e.target.checked;changed()});$('mergeBags').checked=state.mergeBags;$('mergeBags').addEventListener('change',e=>{state.mergeBags=e.target.checked;persist();renderCatalog();$('itemList').scrollTop=0});
// Three-minute undo for Clear all. Session storage keeps the option after an accidental refresh.
const UNDO_KEY='stash-lab-clear-undo-v6';
let clearUndo=null;
try{const savedUndo=JSON.parse(sessionStorage.getItem(UNDO_KEY)||'null');if(savedUndo&&savedUndo.qty&&typeof savedUndo.qty==='object')clearUndo=savedUndo}catch(e){}
function refreshClearUndo(){
 $('undoClearBtn').hidden=!clearUndo;
 const label=t('復原清空數量','Undo cleared quantities');$('undoClearBtn').title=label;$('undoClearBtn').setAttribute('aria-label',label);
}
$('clearBtn').addEventListener('click',()=>{
 stopQuantityHold();
 if(!count()&&state.target==='auto'){toast(t('清單已是空的','Inventory is already empty'));return}
 clearUndo={qty:{...state.qty},target:state.target};
 try{sessionStorage.setItem(UNDO_KEY,JSON.stringify(clearUndo))}catch(e){}
 state.qty={};state.target='auto';changed();refreshClearUndo();
 toast(t('已清空數量','Quantities cleared'));
});
$('undoClearBtn').addEventListener('click',()=>{
 if(!clearUndo){refreshClearUndo();return}
 state.qty={...clearUndo.qty};state.target=clearUndo.target||'auto';
 clearUndo=null;try{sessionStorage.removeItem(UNDO_KEY)}catch(e){}
 refreshClearUndo();changed();toast(t('已還原清空前的裝備數量','Previous quantities restored'));
});
$('demoBtn').addEventListener('click',()=>{state.qty={...SAMPLE};state.target='auto';changed();toast(t('已載入示範配置','Example loaded'))});$('backWorkspaceBtn').addEventListener('click',()=>switchPage(state.mode));$('settingsScrim').addEventListener('click',()=>switchPage(state.mode));
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
  $('backWorkspaceBtn').focus();return;
 }
 state.mode=page==='stash'?'stash':'workspace';persist();
 $('settingsPage').hidden=true;$('settingsScrim').hidden=true;
 if(settingsOpener?.isConnected)settingsOpener.focus();settingsOpener=null;
 $('workspacePage').hidden=false;setLeftView('inventory');
 $('workspacePage').classList.toggle('stash-mode',state.mode==='stash');
 $('workspacePage').setAttribute('aria-label',state.mode==='stash'?t('倉庫規劃','Stash planner'):t('出征背包規劃','Raid backpack planner'));
 document.querySelectorAll('[data-page]').forEach(b=>{const current=b.dataset.page===page;b.classList.toggle('active',current);if(current)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 if(smallScreen())setSidebarCollapsed(true,false);
 if(!settings){plan();requestAnimationFrame(renderGrid)}
}
function initLayoutResizers(){
 const layout=$('workspaceLayout');if(!layout)return;
 const panels=[$('inventory'),$('result'),document.querySelector('.visual')];
 const bars=[...layout.querySelectorAll('[data-resizer]')];
 const minWidths=[250,220,260];
 const storageKey='stash-lab-layout-columns';
 const readWidths=()=>panels.map(panel=>panel.getBoundingClientRect().width);
 const setWidths=widths=>{
  const total=widths.reduce((sum,width)=>sum+width,0);if(!total)return;
  ['--inventory-fr','--analysis-fr','--preview-fr'].forEach((name,index)=>layout.style.setProperty(name,`${widths[index]/total}fr`));
  bars.forEach((bar,index)=>{
   const pair=widths[index]+widths[index+1];
   bar.setAttribute('aria-valuemin',String(minWidths[index]));
   bar.setAttribute('aria-valuemax',String(Math.max(minWidths[index],Math.round(pair-minWidths[index+1]))));
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
  const minLeft=minWidths[index],minRight=minWidths[index+1];
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
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();if(!$('settingsPage').hidden)switchPage(state.mode);setLeftView('inventory');$('search').focus()}if(e.key==='Escape'){if(!$('customModal').hidden)closeModal();else if(!$('settingsPage').hidden)switchPage(state.mode);else if(smallScreen()&&!sidebarCollapsed)setSidebarCollapsed(true,false)}if(e.key==='Tab'&&!$('settingsPage').hidden){const focusable=[...$('settingsPage').querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')];const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||!$('settingsPage').contains(document.activeElement))){e.preventDefault();last?.focus()}else if(!e.shiftKey&&(document.activeElement===last||!$('settingsPage').contains(document.activeElement))){e.preventDefault();first?.focus()}}});
// Legal placement is separate from rectangular free space. Constraints apply in both planning modes.
// Same-family bans include different colors and indirect nesting through an intermediate backpack.
function placementViolation(parent,item){
 if(parent.cat==='stash')return null;
 if(parent.onlyMeds)return 'med-only';
 if(item.cat==='bag'&&!parent.allowBags)return 'no-backpack';
 if(item.cat==='bag'){
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
   if(!region||child.parent!==parent||child.depth!==parent.depth+1||!canPlaceItem(parent,child))return false;
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
  if(parent.cat==='rig')continue;
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
function maxDepth(root){return Math.max(...allNodes(root).filter(n=>n.cat==='bag').map(n=>n.depth))}
function getSteps(root){const steps=[];function visit(parent){for(const child of parent.children)visit(child);for(const child of parent.children){const p=child.location;steps.push({from:child,to:parent,loc:p})}}visit(root);return steps}
function shortNode(n){return `${n.n} [${n.uid.split('#')[1]}]`}
let packingWorker=null,searchGeneration=0,packingInputKey=null,packingVisited=0,packingStopping=false;
function restorePackingParents(node,parent=null){node.parent=parent;node.children=node.children.map(child=>restorePackingParents(child,node));return node}
function showSearchStatus(message,running){
 $('searchStatus').hidden=false;$('searchStatusText').textContent=message;
 $('searchTotalCount').textContent=packingVisited.toLocaleString();
 $('cancelSearchBtn').disabled=!running||packingStopping;
 $('continueSearchBtn').disabled=running||state.solution?.optimal===true||!count();
 $('restartSearchBtn').disabled=packingStopping;
}
function betterPacking(a,b){
 if(!b)return true;
 for(const key of ['packedBags','free','packedRigs']){if(a[key]!==b[key])return a[key]>b[key]}
 return true;
}
function plan(options={}){
 const input={mode:state.mode,target:state.target,depth:state.depth,rotate:state.rotate,stashW:state.stashW,stashH:state.stashH,items:getAll().map(it=>({it,qty:Math.min(100,Math.max(0,Number(state.qty[it.id])||0))})).filter(entry=>entry.qty>0)};
 const inputKey=JSON.stringify(input),sameInput=inputKey===packingInputKey;
 if(sameInput&&!options.restart&&!options.unlimited){renderResult();return}
 const continuing=sameInput&&options.unlimited;
 if(!continuing){packingVisited=0;state.solution=null;state.viewId=null}
 const baseVisited=packingVisited;
 if(continuing&&state.solution?.resumeHint)input.resumeHint=state.solution.resumeHint;
 input.unlimited=!!options.unlimited;input.requestId=globalThis.crypto?.randomUUID?.()||`analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`;
 packingInputKey=inputKey;packingWorker?.terminate();const generation=++searchGeneration;packingStopping=false;
 renderResult();showSearchStatus(options.unlimited?t('持續分析中 · 無時間上限；尚未證明最佳','Analyzing without a time limit; optimality not yet proven'):t('正在分析收納配置…','Analyzing packing constraints…'),true);
 const worker=new Worker('packing-worker.js');packingWorker=worker;
 function finish(message){packingWorker=null;packingStopping=false;worker.terminate();showSearchStatus(message,false)}
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
   finish(result?.optimal?(result.allBagsPacked?t(`最佳解已證明 · 所有背包已放入，最外層剩餘 ${result.free} 格`,`Optimal solution proven · all backpacks packed; ${result.free} outer slots free`):t('已證明無法放入所有背包；顯示可放入最多背包的最佳方案','Not all backpacks can fit; showing the proven optimal partial plan')):message.reason==='stopped'?t('分析已停止；保留目前方案與累計查找數，可繼續分析','Analysis stopped; the current plan and total are retained. You can continue.'):message.reason==='infeasible'?t('目前設定無可行配置','No feasible packing with the current settings'):message.reason==='limit'?(input.unlimited?t('本次分析已結束，尚未證明最佳；可繼續分析','Analysis ended without an optimality proof; you can continue'):t('已達分析上限；可按繼續分析解除時間上限','Analysis limit reached; continue to remove the time limit')):t('請先選擇至少一個可用的主背包','Select at least one available outer backpack'));
  }else if(message.type==='control-error'){
   packingStopping=false;showSearchStatus(t('停止分析失敗：','Unable to stop analysis: ')+message.message,true);
  }else if(message.type==='error')finish(t('分析失敗：','Analysis failed: ')+message.message);
 };
 worker.onerror=event=>{if(generation===searchGeneration&&packingWorker===worker)finish(t('分析失敗：','Analysis failed: ')+event.message)};
 worker.postMessage(input);
}
$('cancelSearchBtn').addEventListener('click',()=>{
 if(!packingWorker||packingStopping)return;
 packingStopping=true;showSearchStatus(t('正在停止分析並取得最後查找總數…','Stopping analysis and collecting the final search total…'),true);
 packingWorker.postMessage({command:'stop'});
});
$('continueSearchBtn').addEventListener('click',()=>plan({unlimited:true}));
$('restartSearchBtn').addEventListener('click',()=>plan({restart:true}));
function getCurrentNode(){const res=state.solution;if(!res)return null;return allNodes(res.root).find(n=>n.uid===state.viewId)||res.root}
function renderStashLeftovers(sol){
 const panel=$('stashLeftovers');panel.hidden=state.mode!=='stash';
 if(panel.hidden)return;
 const list=sol?.unplaced||[];
 $('stashLeftoversTitle').textContent=t('未放入倉庫','Not placed in stash');
 $('stashLeftoversCount').textContent=String(list.length);
 if(!list.length){
  $('stashLeftoversList').innerHTML=`<div class="stash-leftover-empty">${sol?.total?t('所有已選裝備都已成功放入倉庫','All selected items are inside the stash'):t('尚未選擇裝備','No items selected')}</div>`;
  return;
 }
 const grouped=new Map();
 for(const it of list){if(!grouped.has(it.id))grouped.set(it.id,{item:it,qty:0});grouped.get(it.id).qty++}
 const rows=[...grouped.values()].sort((a,b)=>b.qty-a.qty||AREA(b.item)-AREA(a.item));
 $('stashLeftoversList').innerHTML=rows.map(({item,qty})=>`<div class="stash-leftover-row" title="${esc(explainUnplaced(sol,item))}"><span class="stash-leftover-icon">${icon(item.cat)}</span><span class="stash-leftover-name">${esc(itemName(item))}</span><span class="stash-leftover-size">${item.ow}×${item.oh}</span><span class="stash-leftover-qty">×${qty}</span></div>`).join('');
}
function renderResult(){const sol=state.solution;const total=count();const badge=$('resultBadge');renderStashLeftovers(sol);
 if(state.mode==='stash'){
  badge.className='result-badge '+(!sol?'nope':sol.included===sol.total?'':'partial');
  badge.textContent=!sol?t('等待輸入','Awaiting items'):sol.included===sol.total?t('全部可收納','Everything fits'):t('部分可收納','Partial fit');
  $('mCount').textContent=sol?`${sol.included}/${sol.total}`:'—';
  $('mCountSub').textContent=t('已放入倉庫','Placed in stash');
  $('mSave').textContent=sol?String(sol.saving):'—';
  $('mSaveSub').textContent=sol?`${sol.before} → ${sol.after} ${t('格','slots')}`:'—';
  $('mDepth').textContent=sol?`${state.stashW*state.stashH-sol.used}`:'—';
  $('mDepthSub').textContent=sol?`${t('總容量','Capacity')} ${state.stashW*state.stashH} ${t('格','slots')}`:'—';
  document.querySelector('#mCount').nextElementSibling.textContent=t('倉庫內裝備','Items inside stash');
  document.querySelector('#mDepth').nextElementSibling.textContent=t('倉庫剩餘空格','Free stash slots');
  $('resultMessage').textContent=!sol?t('選擇背包或彈掛後開始配置','Select bags or rigs to plan the stash'):sol.unplaced.length?t(`已放入 ${sol.included} 件，另有 ${sol.unplaced.length} 件無法放入。請調整倉庫尺寸或套包規則。`,`Placed ${sol.included} items; ${sol.unplaced.length} items remain outside. Adjust stash dimensions or nesting rules.`):t(`已將 ${sol.included} 件裝備配置到 ${state.stashW} × ${state.stashH} 倉庫，含背包巢狀收納。`,`Placed ${sol.included} items in the ${state.stashW} × ${state.stashH} stash, including nested backpacks.`);
  renderGrid();renderStepsForSolution(sol);return;
 }
 document.querySelector('#mCount').nextElementSibling.textContent=t('單一主包內已收納','Packed into one bag');
 document.querySelector('#mDepth').nextElementSibling.textContent=t('背包巢狀層數','Nesting depth');badge.className='result-badge '+(!sol?'nope':sol.included===sol.total-1?'':'partial');badge.textContent=!sol?t('等待輸入','Awaiting items'):sol.included===sol.total-1?t('全部可收納','Everything fits'):t('部分可收納','Partial fit');$('mCount').textContent=sol?`${sol.included}/${sol.total-1}`:'—';$('mCountSub').textContent=sol?t('+ 主背包 1 件','+ 1 outer bag'):t('尚未分析','No analysis yet');$('mSave').textContent=sol?String(sol.saving):'—';$('mSaveSub').textContent=sol?`${sol.before} → ${sol.after} ${t('格','slots')}`:t('節省格數','Saved slots');$('mDepth').textContent=sol?String(maxDepth(sol.root)):'—';$('mDepthSub').textContent=sol?t(`上限 ${state.depth} 層`,`Limit ${state.depth} levels`):t('背包深度','Nesting depth');
 $('resultMessage').textContent=!sol?(total?t('清單內沒有可作為主容器的背包。請先加入至少一個背包。','No valid outer backpack was selected. Add at least one backpack.'):t('加入至少一個背包，開始規劃。右側將顯示格子配置與實際套包順序。','Select at least one backpack to calculate a packing plan.')):sol.included===sol.total-1?t(`已找到單包配置：以「${itemName(sol.root)}」為主包，將其餘 ${sol.included} 件裝備收入內部。格數節省依裝備分開存放計算。`,`Packed: ${itemName(sol.root)} holds ${sol.included} additional items. Slot savings are measured against storing items separately.`):t(`以「${itemName(sol.root)}」為主包，可收納 ${sol.included} 件；尚有 ${sol.unplaced.length} 件未收納。遊戲禁止的套包組合不會強行放入。`,`Outer bag: ${itemName(sol.root)}. ${sol.included} items fit; ${sol.unplaced.length} remain unpacked. Illegal game nesting is excluded.`);
 renderGrid();renderStepsForSolution(sol);}
function renderStepsForSolution(sol){const steps=sol?getSteps(sol.root):[];$('stepCount').textContent=`${steps.length} ${t('步驟','STEPS')}`;$('stepList').innerHTML=steps.length?steps.map((s,i)=>`<li class="step"><div class="step-n">${String(i+1).padStart(2,'0')}</div><div class="step-main"><b>${esc(itemName(s.from))} [${s.from.uid.split('#')[1]}]</b> <span style="color:#8d9c8a">${t('放入','into')}</span> <b>${esc(itemName(s.to))} [${s.to.uid.split('#')[1]}]</b><div class="step-detail">${t(`第 ${s.loc.ci+1} 區 · 第 ${s.loc.x+1} 欄 / 第 ${s.loc.y+1} 列`,`Compartment ${s.loc.ci+1} · Column ${s.loc.x+1}, row ${s.loc.y+1}`)} · ${s.loc.w}×${s.loc.h}${s.loc.rot?t(' · 旋轉 90°',' · rotated 90°'):''}</div></div><div class="step-kind">${s.from.cat==='bag'?t('背包','Bag'):t('彈掛','Rig')}</div></li>`).join(''):`<li class="empty-list">${sol?t('無需移動裝備','No moves required'):t('完成規劃後產生逐步指引','Steps appear after planning')}</li>`;
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
   const p=child.location,r=mapRect(x+p.x,p.y,p.w,p.h),bag=child.cat==='bag';let inside='';
   if(bag&&child.spaces?.length&&depth<8)inside=renderXrayNode(child,depth+1,`x="${r.x+.08}" y="${r.y+.3}" width="${Math.max(.05,r.w-.16)}" height="${Math.max(.05,r.h-.38)}"`,(angle+(p.rot?90:0))%360);
   return `<g><title>${esc(itemName(child))} · ${p.w}×${p.h}</title><rect x="${r.x+.025}" y="${r.y+.025}" width="${Math.max(.05,r.w-.05)}" height="${Math.max(.05,r.h-.05)}" fill="${bag?'#574a2e':'#36554a'}" stroke="${bag?'#d9b47a':'#92b5a3'}" stroke-width=".055"/><svg class="xray-label" x="${r.x+.06}" y="${r.y+.04}" width="${Math.max(.05,r.w-.12)}" height=".23" data-label-height="${Math.max(.05,r.h-.08)}" overflow="hidden"><text x="0" y=".19" font-size=".2" fill="#fff0cd">${esc(itemName(child))}</text></svg>${inside}</g>`;
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
 $('previewLegendHint').textContent=xray?t('已展開所有背包層級','All backpack layers are expanded'):t('點擊圖中的背包可進入下一層');
 const shell=$('gridShell');shell.classList.toggle('can-go-back',Boolean(node?.parent));
 if(!sol||!node){shell.innerHTML=`<div class="grid-workspace" style="flex:1;align-items:center;justify-content:center"><span class="muted-small">${t('選擇裝備後顯示預覽','Select items to preview')}</span></div>`;$('fillText').textContent=t('使用率 —','Usage —');$('fillPct').textContent='—';$('fillBar').style.width='0';return}
 const shellStyle=getComputedStyle(shell),usable=Math.max(1,shell.clientWidth-parseFloat(shellStyle.paddingLeft)-parseFloat(shellStyle.paddingRight));
 if(xray){
  shell.classList.add('xray-mode');shell.classList.remove('can-go-back');const geometry=xrayGeometry(node),cell=updatePreviewZoom(usable/geometry.width);shell.innerHTML=renderXrayNode(node);const svg=shell.querySelector('.xray-root');svg.style.width=geometry.width*cell+'px';svg.style.height=geometry.height*cell+'px';sizeXrayLabels();
  const capacity=node.spaces.reduce((n,sp)=>n+sp.w*sp.h,0),filled=node.spaces.reduce((n,sp)=>n+sp.cells.filter(Boolean).length,0),usage=capacity?Math.round(filled/capacity*100):0;
  $('fillText').textContent=t('全層透視 · 滑鼠停留查看名稱','All layers · hover for item names');$('fillPct').textContent=usage+'%';$('fillBar').style.width=usage+'%';return;
 }
 shell.classList.remove('xray-mode');

 const maxW=Math.max(...node.spaces.map(x=>x.w),1);
 const cell=updatePreviewZoom(Math.max(1,usable-2)/maxW);
 let filled=0,capacity=0;
 const region=node.spaces.map((sp,i)=>{capacity+=sp.w*sp.h;filled+=sp.cells.filter(Boolean).length;const children=node.children.filter(n=>n.location.ci===i);let placements=children.map(child=>{const p=child.location;return `<button class="node-cell ${child.cat==='rig'?'rig':''}" style="grid-column:${p.x+1}/span ${p.w};grid-row:${p.y+1}/span ${p.h}" data-view="${esc(child.uid)}" title="${esc(itemName(child))} (${p.w}×${p.h})"><span class="node-cell-inner"><span class="node-cell-title">${esc(itemName(child).split(' ')[0])} #${esc(child.uid.split('#')[1])}</span>${child.cat==='bag'?'<span class="node-cell-arrow">↗</span>':''}</span><span class="node-cell-dim">${p.w} × ${p.h}</span></button>`}).join('');return `<div class="compartment-holder"><div class="compartment" role="group" aria-label="${t('區域','Compartment')} ${i+1} ${sp.w}×${sp.h}" style="grid-template-columns:repeat(${sp.w},${cell}px);grid-template-rows:repeat(${sp.h},${cell}px)">${Array.from({length:sp.w*sp.h},()=>'<div class="grid-square" aria-hidden="true"></div>').join('')}${placements}</div><div class="compartment-label">${t('區域','COMPARTMENT')} ${String(i+1).padStart(2,'0')}　/　${sp.w} × ${sp.h}</div></div>`}).join('');const usage=capacity?Math.round(filled/capacity*100):0;shell.innerHTML=`<div class="grid-workspace">${region}</div>`;$('fillText').textContent=node.cat==='stash'?t(`倉庫已占用 ${filled} / ${capacity} 格`,`Stash: ${filled} / ${capacity} slots used`):t(`本層已占用 ${filled} / ${capacity} 格`,`This level: ${filled} / ${capacity} slots used`);$('fillPct').textContent=`${usage}%`;$('fillBar').style.width=usage+'%';}
$('gridShell').addEventListener('click',e=>{if(xray)return;const b=e.target.closest('[data-view]');if(b){const n=allNodes(state.solution?.root).find(n=>n.uid===b.dataset.view);if(n&&n.cat==='bag'){state.viewId=n.uid;renderGrid()}else if(n)toast(t('彈掛無法再容納整件背包','Rigs cannot nest full backpacks'));return}const node=getCurrentNode();if(node?.parent){state.viewId=node.parent.uid;renderGrid()}});
function setViewerPane(pane){const steps=pane==='steps';$('previewPane').hidden=steps;$('stepsPane').hidden=!steps;$('previewPath').hidden=steps;document.querySelectorAll('[data-pane]').forEach(b=>{const selected=b.dataset.pane===pane;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected))});if(!steps)requestAnimationFrame(renderGrid)}
document.querySelectorAll('[data-pane]').forEach(b=>b.addEventListener('click',()=>setViewerPane(b.dataset.pane)));

function copyText(){const sol=state.solution;if(!sol){toast(t('請先加入至少一個背包','Add at least one backpack first'));return}const lines=[`STASH / LAB 套包收納規劃`,`主背包：${sol.root.n}`,`總數：${sol.total} 件｜收入主包：${sol.included} 件｜剩餘：${sol.unplaced.length} 件`,`節省倉庫格數：${sol.saving} 格（${sol.before} → ${sol.after}）`,`巢狀層數：${maxDepth(sol.root)} / ${state.depth}`,``,...getSteps(sol.root).map((s,i)=>`${i+1}. ${shortNode(s.from)} → ${shortNode(s.to)}｜第${s.loc.ci+1}區 (${s.loc.x+1},${s.loc.y+1}) ${s.loc.w}×${s.loc.h}${s.loc.rot?' [旋轉]':''}`),...sol.unplaced.length?['','未收納：',...sol.unplaced.map(i=>`- ${i.n}`)]:[],'','注意：已檢查內建同款套包禁令與層數限制；特殊物品規則仍以遊戲實際情況為準。'];return lines.join('\n')}
$('copyBtn').addEventListener('click',async()=>{const s=copyText();if(!s)return;try{await navigator.clipboard.writeText(s);toast(t('已複製完整收納順序','Packing plan copied'))}catch(e){const a=document.createElement('textarea');a.value=s;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast(t('已複製完整收納順序','Packing plan copied'))}catch(e){toast('瀏覽器未允許複製，請使用匯出功能')}a.remove()}});
function download(name,content){const blob=new Blob([content],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function currentConfig(){return JSON.parse(JSON.stringify({format:'stash-lab-v1',qty:state.qty,custom:state.custom,target:state.target,depth:state.depth,rotate:state.rotate,mergeBags:state.mergeBags,stashW:state.stashW,stashH:state.stashH,lang:state.lang,mode:state.mode}))}
function writeMemories(next){localStorage.setItem(MEMORY_KEY,JSON.stringify(next));memories=next;renderMemories()}
function setLeftView(view){
 const show=view==='memories';$('inventoryView').hidden=show;$('savedMemoryView').hidden=!show;
 const nav=$('savedMemoryNav');nav.classList.toggle('active',show);if(show)nav.setAttribute('aria-current','page');else nav.removeAttribute('aria-current');
 document.querySelectorAll('[data-page]').forEach(b=>{const active=!show&&b.dataset.page===state.mode;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
}
function renderMemories(){
 if(!$('savedConfigList'))return;
 $('savedMemoryBadge').textContent=String(memories.length);$('savedMemoryCount').textContent=String(memories.length);
 $('savedConfigList').innerHTML=memories.length?memories.map(m=>`<article class="saved-config-row"><strong title="${esc(m.name)}">${esc(m.name)}</strong><time>${esc(new Date(m.savedAt).toLocaleString(state.lang==='en'?'en-US':'zh-TW'))}</time><div class="saved-config-actions"><button class="btn" data-memory="${esc(m.id)}" data-action="load">${t('載入','Load')}</button><button class="btn btn-ghost" data-memory="${esc(m.id)}" data-action="export">${t('匯出','Export')}</button><button class="btn btn-ghost" data-memory="${esc(m.id)}" data-action="delete">${t('刪除','Delete')}</button></div></article>`).join(''):`<p class="memory-empty">${t('尚未儲存配置。按上方「儲存目前配置」建立記憶。','No saved setups. Choose “Save current setup” to add one.')}</p>`;
}
function remember(config,name){const now=new Date();const entry={id:'m-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),name:name||t('配置','Setup')+' '+now.toLocaleString(state.lang==='en'?'en-US':'zh-TW'),savedAt:now.toISOString(),config};writeMemories([entry,...memories]);return entry}
function applyConfig(d){
 if(!validConfig(d))throw Error(t('不是正確的備份格式','Invalid backup format'));
 // Keep custom definitions already saved in this browser when loading another setup.
 const catalog=new Map(state.custom.map(item=>[item.id,item]));d.custom.filter(isCustomValid).forEach(item=>catalog.set(item.id,{...item,custom:true}));state.custom=[...catalog.values()].slice(0,60);
 state.qty={};for(const [id,v] of Object.entries(d.qty)){if(byId(id)&&Number.isFinite(Number(v)))state.qty[id]=Math.min(100,Math.max(0,Math.round(Number(v))))}
 state.target=typeof d.target==='string'?d.target:'auto';state.depth=Math.min(6,Math.max(2,Number(d.depth)||6));state.rotate=d.rotate!==false;state.mergeBags=d.mergeBags===true;state.stashW=Math.min(20,Math.max(4,Number(d.stashW)||10));state.stashH=Math.min(100,Math.max(8,Number(d.stashH)||28));state.lang=d.lang==='en'?'en':state.lang;state.mode=d.mode==='stash'?'stash':'workspace';
 $('mergeBags').checked=state.mergeBags;$('depth').value=String(state.depth);$('rotate').checked=state.rotate;updateStashControls();applyLanguage();changed();switchPage(state.mode);
}
function exportMemories(){download('stash-lab-memories.json',JSON.stringify({format:'stash-lab-memory-v1',current:currentConfig(),memories},null,2));toast(t('所有記憶已匯出','Saved data exported'))}
function clearMemories(){
 if(!confirm(t('清除所有已儲存配置、自訂裝備與目前裝備數量？此操作無法復原。','Clear all saved setups, custom items and current quantities? This cannot be undone.')))return;
 writeMemories([]);Object.assign(state,{custom:[],qty:{},target:'auto',depth:6,rotate:true,mergeBags:false,stashW:10,stashH:28});$('depth').value='6';$('rotate').checked=true;$('mergeBags').checked=false;updateStashControls();clearUndo=null;try{sessionStorage.removeItem(UNDO_KEY)}catch(e){}refreshClearUndo();changed();renderMemories();toast(t('已清除所有記憶','All saved data cleared'));
}
$('savedMemoryNav').addEventListener('click',()=>{switchPage(state.mode);setLeftView('memories')});
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
  const merged=new Map(memories.map(m=>[m.id,m]));d.memories.forEach(m=>merged.set(m.id,m));writeMemories([...merged.values()]);applyConfig(d.current);
 }else{applyConfig(d);remember(currentConfig(),file.name.replace(/\.json$/i,''))}
 setLeftView('memories');toast(t('資料已匯入並儲存','Data imported and saved'));
 }catch(err){toast(t('匯入失敗：','Import failed: ')+err.message)}finally{e.target.value=''}});
function closeModal(){$('customModal').hidden=true;$('customForm').reset();$('modalError').textContent=''}$('customBtn').addEventListener('click',()=>{$('customModal').hidden=false;$('customName').focus()});$('closeModal').addEventListener('click',closeModal);$('cancelModal').addEventListener('click',closeModal);$('customModal').addEventListener('click',e=>{if(e.target===$('customModal'))closeModal()});function syncCustomType(){const rig=$('customType').value==='rig';$('innerCustomRow').classList.toggle('is-hidden',rig);$('allowCustomRow').classList.toggle('is-hidden',rig);$('customIw').required=!rig;$('customIh').required=!rig}$('customType').addEventListener('change',syncCustomType);
$('customForm').addEventListener('submit',e=>{e.preventDefault();const n=$('customName').value.trim(),en=$('customAlias').value.trim(),cat=$('customType').value,ow=Number($('customOw').value),oh=Number($('customOh').value),iw=Number($('customIw').value),ih=Number($('customIh').value);if(!n||![ow,oh,...cat==='bag'?[iw,ih]:[]].every(v=>Number.isInteger(v)&&v>=1&&v<=15)){$('modalError').textContent='請填寫有效名稱與格數（1 至 15）';return}if(state.custom.length>=60){$('modalError').textContent='最多新增 60 種自訂裝備';return}const id='u-'+Math.floor(Date.now()/1000).toString(36)+'-'+Math.floor(Math.random()*999999).toString(36);state.custom.push({id,n,en,cat,ow,oh,comp:cat==='bag'?[{w:iw,h:ih}]:[],slots:0,allowBags:cat==='bag'&&$('customAllow').checked,custom:true});state.qty[id]=1;closeModal();state.tab='all';state.query='';$('search').value='';syncTabs();setLeftView('inventory');changed();toast(t('自訂裝備已新增並選取','Custom item added'))});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderGrid,120)});
updateStashControls();applyLanguage();refreshClearUndo();renderCatalog();renderMemories();switchPage(state.mode);
})();
