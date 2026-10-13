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
const getAll=()=>[...BASE,...state.custom];const byId=id=>getAll().find(i=>i.id===id);const count=()=>Object.entries(state.qty).reduce((n,[id,q])=>n+(byId(id)?Math.min(100,Math.max(0,Number(q)||0)):0),0);
function persist(){try{localStorage.setItem(KEY,JSON.stringify({qty:state.qty,custom:state.custom,target:state.target,depth:state.depth,rotate:state.rotate,mergeBags:state.mergeBags,lang:state.lang,mode:state.mode,stashW:state.stashW,stashH:state.stashH}))}catch(e){}}
let toastTimer=0;function toast(msg){$('toast').textContent=msg;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,2600)}

const LANG_MAP={"等級 1 · 10 × 28":"Level 1 · 10 × 28","等級 2 · 10 × 38":"Level 2 · 10 × 38","等級 3 · 10 × 48":"Level 3 · 10 × 48","等級 4 · 10 × 68":"Level 4 · 10 × 68","倉庫規劃":"Stash planner","倉庫尺寸":"Stash size","依照白邊 PvE 的實際倉庫調整":"Match your Standard PvE stash","倉庫預設尺寸":"Stash preset","自訂尺寸":"Custom size","寬":"W","高":"H","收納工作台": "Workspace", "設定與資料": "Settings & data", "中文 / English": "中文 / English", "離線運作": "Offline mode", "資料僅存放在此瀏覽器": "Saved in this browser only", "不存取遊戲或帳號": "No game or account access", "自訂裝備": "Custom item", "清空數量": "Clear all", "收納設定": "Packing settings", "重新計算": "Recalculate", "匯入 JSON": "Import JSON", "下載 JSON": "Download JSON", "關閉": "Close", "你的裝備清單": "Your inventory", "點選 ＋ / －，建立目前持有的裝備數量": "Use + / − to set quantities", "全部裝備": "All items", "背包": "Backpacks", "彈掛": "Rigs", "只顯示已選": "Selected only", "已加入規劃": "Selected items", "只看已選裝備": "Show selected", "設定收納規則 →": "Packing rules →", "收納分析結果": "Packing analysis", "單一主包內已收納": "Packed into one bag", "節省倉庫格數": "Stash slots saved", "背包巢狀層數": "Nesting depth", "等待輸入": "Awaiting items", "預覽": "Preview", "收納步驟": "Packing steps", "選擇裝備後顯示預覽": "Select items to preview", "點擊圖中的背包可進入下一層": "Click a bag to enter · click empty space to go back", "使用率 —": "Usage —", "實際收納步驟": "Packing steps", "按照由內到外的順序操作；先填滿內袋，再將它放入上一層。": "Pack from the innermost bag outwards.", "完成規劃後產生逐步指引": "Steps appear after planning", "無法放入主背包": "Unable to fit in main backpack", "複製規劃清單": "Copy packing plan", "最外層主背包": "Outer backpack", "最大巢狀層數": "Maximum nesting depth", "允許將裝備旋轉 90° 尋找可行擺法": "Allow 90° rotation to find placements", "彈掛視為完整物品放入背包；其內部分隔口袋不會被誤算成可放其他整件裝備的連續空間。": "Rigs are treated as complete items. Separate rig pockets are not treated as one continuous bag.", "開始計算最佳收納方案": "Calculate packing plan", "選項會自動儲存並同步更新規劃結果": "Options are auto-saved and the plan updates automatically", "清單與備份": "Inventory & backup", "讀取範例，或匯入、匯出你的裝備清單與收納設定。": "Load example items or back up your inventory and settings.", "載入示範配置": "Load example", "規劃前需要知道的事": "How the planner works", "01. 計算的是幾何配置": "01. Geometric packing", "同時檢查內外尺寸、獨立收納分區、放入方向與套包層數。這是多輪啟發式搜尋，會盡量容納最多裝備，不保證數學上的全域最優解。": "The planner checks dimensions, separate compartments, rotation, and nesting depth. It uses a multi-pass heuristic and does not guarantee a global optimum.", "02. 遊戲規則優先": "02. In-game rules take priority", "針對官方 PvE 的倉庫套包。某些特殊背包可能另有物品白名單、禁止套包等限制；實際遊戲若拒絕放置，請依遊戲顯示並調整裝備資料。": "Designed for official PvE stash organization. Some bags may have special restrictions; always follow what the game allows.", "03. 資料留在你的電腦": "03. Your data stays local", "整個網頁可離線運作，不連接 EFT、不需要登入。清單存於本機瀏覽器，也可匯出 JSON 備份。格數資料可參照": "The page runs offline without accessing EFT or requiring sign-in. Your inventory stays in local storage and can be exported as JSON. Reference:", "背包資料": "Backpack data", "彈掛資料": "Rig data", "新增自訂裝備": "Add custom item", "遊戲更新後若有新背包或彈掛，可以手動新增尺寸。背包內部支援單一矩形區域；帶有分隔區域的特殊裝備請以內建資料為準。": "Add new bags or rigs manually. Custom bags support one rectangular inner compartment; use built-in data for compartmentalized items.", "裝備名稱": "Item name", "裝備類型": "Item type", "備註（可選）": "Alias (optional)", "外部寬度（格）": "Outer width (slots)", "外部高度（格）": "Outer height (slots)", "背包內部寬度（格）": "Inner width (slots)", "背包內部高度（格）": "Inner height (slots)", "允許其他背包放入此背包": "Allow other bags inside", "取消": "Cancel", "新增至裝備庫": "Add to inventory", "自動選擇最佳主背包": "Auto-select outer bag", "2 層": "2 levels", "3 層": "3 levels", "4 層": "4 levels", "5 層": "5 levels", "6 層": "6 levels", "7 層（預設）": "7 levels (default)","6 層（建議）": "6 levels (recommended)","遊戲規則：黑色與迷彩 Takedown 視為同款，禁止互相套包；Pillbox 與醫療專用背包不能裝其他背包。套包層數保守限制為 6 層。":"Game rules: Black and MultiCam Takedown count as the same family and cannot nest into each other. Pillbox and medical-only bags cannot hold backpacks. Nesting is conservatively limited to 6 levels.", "搜尋名稱、型號，例如：Scav、MPPV": "Search name or model (e.g. Scav, MPPV)", "例如：我的特殊背包": "e.g. My custom backpack", "英文名稱 / 型號": "English name / model", "區域": "Compartment", "格": "slots", "口袋": "pockets"};
Object.assign(LANG_MAP,{
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
const UNDO_KEY='stash-lab-clear-undo-v6',UNDO_WINDOW=180000;
let clearUndo=null,clearUndoInterval=null;
try{const savedUndo=JSON.parse(sessionStorage.getItem(UNDO_KEY)||'null');if(savedUndo&&savedUndo.expires>Date.now()&&savedUndo.qty&&typeof savedUndo.qty==='object')clearUndo=savedUndo}catch(e){}
function refreshClearUndo(){
 if(clearUndo&&Date.now()>=clearUndo.expires){clearUndo=null;try{sessionStorage.removeItem(UNDO_KEY)}catch(e){}}
 $('undoClearBtn').hidden=!clearUndo;
 if(!clearUndo){clearInterval(clearUndoInterval);clearUndoInterval=null;return}
 $('undoClearText').textContent=t('復原清除','Undo clear');
 const sec=Math.max(0,Math.ceil((clearUndo.expires-Date.now())/1000));
 $('undoCountdown').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
 $('undoClearBtn').title=t('在清空後 3 分鐘內還原裝備數量','Restore inventory quantities within 3 minutes');
 if(!clearUndoInterval)clearUndoInterval=setInterval(refreshClearUndo,1000);
}
$('clearBtn').addEventListener('click',()=>{
 stopQuantityHold();
 if(!count()&&state.target==='auto'){toast(t('清單已是空的','Inventory is already empty'));return}
 clearUndo={qty:{...state.qty},target:state.target,expires:Date.now()+UNDO_WINDOW};
 try{sessionStorage.setItem(UNDO_KEY,JSON.stringify(clearUndo))}catch(e){}
 state.qty={};state.target='auto';changed();refreshClearUndo();
 toast(t('已清空；3 分鐘內可復原','Cleared. Undo available for 3 minutes'));
});
$('undoClearBtn').addEventListener('click',()=>{
 if(!clearUndo||Date.now()>=clearUndo.expires){refreshClearUndo();return}
 state.qty={...clearUndo.qty};state.target=clearUndo.target||'auto';
 clearUndo=null;try{sessionStorage.removeItem(UNDO_KEY)}catch(e){}
 refreshClearUndo();changed();toast(t('已還原清空前的裝備數量','Previous quantities restored'));
});
$('demoBtn').addEventListener('click',()=>{state.qty={...SAMPLE};state.target='auto';changed();toast(t('已載入示範配置','Example loaded'))});$('quickSettingsBtn').addEventListener('click',()=>switchPage('settings'));$('backWorkspaceBtn').addEventListener('click',()=>switchPage(state.mode));$('settingsScrim').addEventListener('click',()=>switchPage(state.mode));function runAndShow(){plan();switchPage(state.mode);$('result').scrollTop=0;toast(t('收納方案已更新','Plan updated'))}$('runBtn').addEventListener('click',runAndShow);$('runQuickBtn').addEventListener('click',runAndShow);
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
 $('workspacePage').hidden=false;
 $('workspacePage').classList.toggle('stash-mode',state.mode==='stash');
 $('workspacePage').setAttribute('aria-label',state.mode==='stash'?t('倉庫規劃','Stash planner'):t('收納工作台','Workspace'));
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
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();if(!$('settingsPage').hidden)switchPage(state.mode);$('search').focus()}if(e.key==='Escape'){if(!$('customModal').hidden)closeModal();else if(!$('settingsPage').hidden)switchPage(state.mode);else if(smallScreen()&&!sidebarCollapsed)setSidebarCollapsed(true,false)}if(e.key==='Tab'&&!$('settingsPage').hidden){const focusable=[...$('settingsPage').querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')];const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||!$('settingsPage').contains(document.activeElement))){e.preventDefault();last?.focus()}else if(!e.shiftKey&&(document.activeElement===last||!$('settingsPage').contains(document.activeElement))){e.preventDefault();first?.focus()}}});
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
function makeNode(it,uid,depth,parent=null){return{...it,uid,depth,parent,children:[],spaces:it.comp.map(c=>({w:c.w,h:c.h,cells:Array(c.w*c.h).fill(null)})),location:null}}
function positions(space,w,h){const out=[];for(let y=0;y<=space.h-h;y++)for(let x=0;x<=space.w-w;x++){let good=true;for(let yy=y;yy<y+h&&good;yy++)for(let xx=x;xx<x+w;xx++)if(space.cells[yy*space.w+xx]){good=false;break}if(good)out.push({x,y})}return out}
function attempt(rootIt,instances,depthLimit,rotate,mode,seed){const isStash=rootIt.cat==='stash';const rootUid=isStash?'stash#1':instances.find(x=>x.it.id===rootIt.id)?.uid;if(!rootUid)return null;const root=makeNode(rootIt,rootUid,isStash?0:1);const containers=[root];const pool=isStash?instances:instances.filter(x=>x.uid!==rootUid);let rand=seed+1234567;const rnd=()=>{rand=(Math.imul(rand,1664525)+1013904223)|0;return (rand>>>0)/4294967296};
const schemes=[
 x=>x.it.cat==='bag'?10000+AREA(x.it)*11:AREA(x.it)*8,
 x=>x.it.cat==='bag'?10000+Math.max(x.it.ow,x.it.oh)*170+AREA(x.it):AREA(x.it)*5,
 x=>AREA(x.it)*11+(x.it.cat==='bag'?1200:0),
 x=>x.it.cat==='bag'?10000-AREA(x.it)*11:AREA(x.it)*8,
 x=>x.it.cat==='bag'?8000+AREA(x.it)*6+((x.it.comp?.[0]?.w||0)*(x.it.comp?.[0]?.h||0)):AREA(x.it)*12,
 x=>x.it.cat==='rig'?2000+AREA(x.it)*4:10000+AREA(x.it)*13
];
const scored=pool.map(i=>({...i,sortScore:schemes[mode%schemes.length](i)+(mode>=6?(rnd()-.5)*Math.max(3,AREA(i.it)*4):0)}));scored.sort((a,b)=>b.sortScore-a.sortScore||a.uid.localeCompare(b.uid));
const left=[];
function tryOne(item){const it=item.it, candidates=[];for(const parent of containers){if(parent.depth>=depthLimit)continue;if(!canPlaceItem(parent,it))continue;for(let ci=0;ci<parent.spaces.length;ci++){const c=parent.spaces[ci];const orientations=[{w:it.ow,h:it.oh,rot:false}];if(rotate&&it.ow!==it.oh)orientations.push({w:it.oh,h:it.ow,rot:true});for(const o of orientations){if(o.w>c.w||o.h>c.h)continue;const places=positions(c,o.w,o.h);for(const p of (isStash?places.slice(0,parent===root?14:8):places)){const free=c.cells.filter(v=>!v).length;let score=parent.depth*300+((c.w*c.h)-(it.ow*it.oh))*-.12+ (1/(1+free-it.ow*it.oh))*4 -(p.x+p.y)*.5 + (o.rot?-.4:0);if(mode%6===2)score=parent.depth*90-(free-AREA(it))*2-(p.x+p.y)*.1;if(mode%6===3)score=parent.depth*420-(p.x+p.y)*2;if(mode%6===4)score=parent.depth*200-(free-AREA(it))*3;if(mode%6===5)score=parent.depth*300+(p.x+p.y)*-.25;
score+=(rnd()-.5)*(mode>=6?24:2);candidates.push({parent,ci,o,...p,score})}}}}
if(!candidates.length)return false;candidates.sort((a,b)=>b.score-a.score);const pick=candidates[0];const sp=pick.parent.spaces[pick.ci];for(let yy=pick.y;yy<pick.y+pick.o.h;yy++)for(let xx=pick.x;xx<pick.x+pick.o.w;xx++)sp.cells[yy*sp.w+xx]=item.uid;const node=makeNode(it,item.uid,pick.parent.depth+1,pick.parent);node.location={ci:pick.ci,x:pick.x,y:pick.y,w:pick.o.w,h:pick.o.h,rot:pick.o.rot};pick.parent.children.push(node);if(it.cat==='bag')containers.push(node);return true}
for(const item of scored)if(!tryOne(item))left.push(item);let leftover=left.filter(x=>!tryOne(x)); // second pass for formerly blocked items
if(!validPacking(root,depthLimit))throw Error('Packing failed legal placement validation');const included=instances.length-(isStash?0:1)-leftover.length;const directArea=root.children.reduce((n,c)=>n+AREA(c),0);return{root,unplaced:leftover.map(x=>x.it),included,score:included*100000-(isStash?directArea:rootIt.ow*rootIt.oh)*6+containers.length*2};}
function compute(){const instances=[];for(const item of getAll()){const q=Math.min(100,Math.max(0,Number(state.qty[item.id]||0)));for(let n=1;n<=q;n++)instances.push({it:item,uid:`${item.id}#${n}`})}if(state.mode==='stash'){
 const stash={id:'stash',n:'倉庫',en:'Stash',cat:'stash',ow:state.stashW,oh:state.stashH,comp:[{w:state.stashW,h:state.stashH}],allowBags:true};
 let best=null; const nTries=instances.length>100?4:instances.length>40?6:10;
 for(let k=0;k<nTries;k++){const r=attempt(stash,instances,state.depth,state.rotate,k,1019+k*137);if(!best||r.score>best.score)best=r; if(best.included===instances.length&&k>=5)break}
 best.total=instances.length;best.before=instances.reduce((n,i)=>n+AREA(i.it),0);
 best.used=best.root.children.reduce((n,i)=>n+AREA(i),0);
 best.after=best.used+best.unplaced.reduce((n,i)=>n+AREA(i),0);
 best.saving=best.before-best.after;
 return best;
}
 const candidates=instances.filter(x=>x.it.cat==='bag').filter(x=>state.target==='auto'||x.it.id===state.target);if(!candidates.length)return null;let best=null;const limit=instances.length>65?12:instances.length>30?18:27;let roots=[...new Map(candidates.map(x=>[x.it.id,x.it])).values()].sort((a,b)=>AREA(b)-AREA(a));if(roots.length>18)roots=roots.slice(0,18);for(const it of roots){for(let k=0;k<limit;k++){const res=attempt(it,instances,state.depth,state.rotate,k,k*113+AREA(it)*17);if(!best||res.score>best.score)best=res;if(best.included===instances.length-1&&roots.length===1&&k>=7)break}}
best.total=instances.length;best.before=instances.reduce((sum,x)=>sum+AREA(x.it),0);best.after=AREA(best.root)+best.unplaced.reduce((sum,x)=>sum+AREA(x),0);best.saving=best.before-best.after;return best}
function allNodes(root){const out=[root];for(let i=0;i<out.length;i++)out.push(...out[i].children);return out}
function maxDepth(root){return Math.max(...allNodes(root).filter(n=>n.cat==='bag').map(n=>n.depth))}
function getSteps(root){const steps=[];function visit(parent){for(const child of parent.children)visit(child);for(const child of parent.children){const p=child.location;steps.push({from:child,to:parent,loc:p})}}visit(root);return steps}
function shortNode(n){return `${n.n} [${n.uid.split('#')[1]}]`}
function plan(){const res=compute();state.solution=res;state.viewId=res?.root?.uid||null;renderResult()}
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
function renderGrid(){const sol=state.solution,node=getCurrentNode();renderPreviewPath(node);
 const shell=$('gridShell');shell.classList.toggle('can-go-back',Boolean(node?.parent));
 if(!sol||!node){shell.innerHTML=`<div class="grid-workspace" style="flex:1;align-items:center;justify-content:center"><span class="muted-small">${t('選擇裝備後顯示預覽','Select items to preview')}</span></div>`;$('fillText').textContent=t('使用率 —','Usage —');$('fillPct').textContent='—';$('fillBar').style.width='0';return}
 const usable=Math.max(180,shell.clientWidth-42);
 const stashRoot=state.mode==='stash'&&node.cat==='stash';
 const maxW=Math.max(...node.spaces.map(x=>x.w),1);
 const maxH=Math.max(...node.spaces.map(x=>x.h),1);
 const availableH=$('previewPane').clientHeight-105;
 const fitHeight=Math.floor(Math.max(220,availableH)/maxH);
 const cell=stashRoot?Math.min(23,Math.max(13,Math.min(Math.floor(usable/maxW),fitHeight))):Math.min(37,Math.max(16,Math.floor(usable/maxW)));
 let filled=0,capacity=0;
 const region=node.spaces.map((sp,i)=>{capacity+=sp.w*sp.h;filled+=sp.cells.filter(Boolean).length;const children=node.children.filter(n=>n.location.ci===i);let placements=children.map(child=>{const p=child.location;return `<button class="node-cell ${child.cat==='rig'?'rig':''}" style="grid-column:${p.x+1}/span ${p.w};grid-row:${p.y+1}/span ${p.h}" data-view="${esc(child.uid)}" title="${esc(itemName(child))} (${p.w}×${p.h})"><span class="node-cell-inner"><span class="node-cell-title">${esc(itemName(child).split(' ')[0])} #${esc(child.uid.split('#')[1])}</span>${child.cat==='bag'?'<span class="node-cell-arrow">↗</span>':''}</span><span class="node-cell-dim">${p.w} × ${p.h}</span></button>`}).join('');return `<div class="compartment-holder"><div class="compartment" role="group" aria-label="${t('區域','Compartment')} ${i+1} ${sp.w}×${sp.h}" style="grid-template-columns:repeat(${sp.w},${cell}px);grid-template-rows:repeat(${sp.h},${cell}px)">${Array.from({length:sp.w*sp.h},()=>'<div class="grid-square" aria-hidden="true"></div>').join('')}${placements}</div><div class="compartment-label">${t('區域','COMPARTMENT')} ${String(i+1).padStart(2,'0')}　/　${sp.w} × ${sp.h}</div></div>`}).join('');const usage=capacity?Math.round(filled/capacity*100):0;shell.innerHTML=`<div class="grid-workspace">${region}</div>`;$('fillText').textContent=node.cat==='stash'?t(`倉庫已占用 ${filled} / ${capacity} 格`,`Stash: ${filled} / ${capacity} slots used`):t(`本層已占用 ${filled} / ${capacity} 格`,`This level: ${filled} / ${capacity} slots used`);$('fillPct').textContent=`${usage}%`;$('fillBar').style.width=usage+'%';}
$('gridShell').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b){const n=allNodes(state.solution?.root).find(n=>n.uid===b.dataset.view);if(n&&n.cat==='bag'){state.viewId=n.uid;renderGrid()}else if(n)toast(t('彈掛無法再容納整件背包','Rigs cannot nest full backpacks'));return}const node=getCurrentNode();if(node?.parent){state.viewId=node.parent.uid;renderGrid()}});
function setViewerPane(pane){const steps=pane==='steps';$('previewPane').hidden=steps;$('stepsPane').hidden=!steps;$('previewPath').hidden=steps;document.querySelectorAll('[data-pane]').forEach(b=>{const selected=b.dataset.pane===pane;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected))});if(!steps)requestAnimationFrame(renderGrid)}
document.querySelectorAll('[data-pane]').forEach(b=>b.addEventListener('click',()=>setViewerPane(b.dataset.pane)));

function copyText(){const sol=state.solution;if(!sol){toast(t('請先加入至少一個背包','Add at least one backpack first'));return}const lines=[`STASH / LAB 套包收納規劃`,`主背包：${sol.root.n}`,`總數：${sol.total} 件｜收入主包：${sol.included} 件｜剩餘：${sol.unplaced.length} 件`,`節省倉庫格數：${sol.saving} 格（${sol.before} → ${sol.after}）`,`巢狀層數：${maxDepth(sol.root)} / ${state.depth}`,``,...getSteps(sol.root).map((s,i)=>`${i+1}. ${shortNode(s.from)} → ${shortNode(s.to)}｜第${s.loc.ci+1}區 (${s.loc.x+1},${s.loc.y+1}) ${s.loc.w}×${s.loc.h}${s.loc.rot?' [旋轉]':''}`),...sol.unplaced.length?['','未收納：',...sol.unplaced.map(i=>`- ${i.n}`)]:[],'','注意：已檢查內建同款套包禁令與層數限制；特殊物品規則仍以遊戲實際情況為準。'];return lines.join('\n')}
$('copyBtn').addEventListener('click',async()=>{const s=copyText();if(!s)return;try{await navigator.clipboard.writeText(s);toast(t('已複製完整收納順序','Packing plan copied'))}catch(e){const a=document.createElement('textarea');a.value=s;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast(t('已複製完整收納順序','Packing plan copied'))}catch(e){toast('瀏覽器未允許複製，請使用匯出功能')}a.remove()}});
function download(name,content){const blob=new Blob([content],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$('exportBtn').addEventListener('click',()=>{download('stash-lab-inventory.json',JSON.stringify({format:'stash-lab-v1',qty:state.qty,custom:state.custom,target:state.target,depth:state.depth,rotate:state.rotate,mergeBags:state.mergeBags,stashW:state.stashW,stashH:state.stashH,lang:state.lang},null,2));toast(t('已匯出裝備清單 JSON','Inventory downloaded'))});$('importBtn').addEventListener('click',()=>$('fileInput').click());$('fileInput').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>200000)throw Error('檔案過大');const d=JSON.parse(await file.text());if(!d||d.format!=='stash-lab-v1'||!d.qty||typeof d.qty!=='object'||!Array.isArray(d.custom))throw Error('不是正確的備份格式');state.custom=d.custom.filter(isCustomValid).slice(0,60);state.qty={};for(const [id,v] of Object.entries(d.qty)){if(byId(id)&&Number.isFinite(Number(v)))state.qty[id]=Math.min(100,Math.max(0,Math.round(Number(v))))}state.target=typeof d.target==='string'?d.target:'auto';state.depth=Math.min(6,Math.max(2,Number(d.depth)||6));state.rotate=d.rotate!==false;state.mergeBags=d.mergeBags===true;$('mergeBags').checked=state.mergeBags;state.stashW=Math.min(20,Math.max(4,Number(d.stashW)||10));state.stashH=Math.min(100,Math.max(8,Number(d.stashH)||28));updateStashControls();state.lang=d.lang==='en'?'en':state.lang;$('depth').value=String(state.depth);$('rotate').checked=state.rotate;applyLanguage();changed();toast(t('裝備與設定匯入成功','Inventory and settings imported'))}catch(err){toast('匯入失敗：'+err.message)}e.target.value=''});
function closeModal(){$('customModal').hidden=true;$('customForm').reset();$('modalError').textContent=''}$('customBtn').addEventListener('click',()=>{$('customModal').hidden=false;$('customName').focus()});$('closeModal').addEventListener('click',closeModal);$('cancelModal').addEventListener('click',closeModal);$('customModal').addEventListener('click',e=>{if(e.target===$('customModal'))closeModal()});function syncCustomType(){const rig=$('customType').value==='rig';$('innerCustomRow').classList.toggle('is-hidden',rig);$('allowCustomRow').classList.toggle('is-hidden',rig);$('customIw').required=!rig;$('customIh').required=!rig}$('customType').addEventListener('change',syncCustomType);
$('customForm').addEventListener('submit',e=>{e.preventDefault();const n=$('customName').value.trim(),en=$('customAlias').value.trim(),cat=$('customType').value,ow=Number($('customOw').value),oh=Number($('customOh').value),iw=Number($('customIw').value),ih=Number($('customIh').value);if(!n||![ow,oh,...cat==='bag'?[iw,ih]:[]].every(v=>Number.isInteger(v)&&v>=1&&v<=15)){$('modalError').textContent='請填寫有效名稱與格數（1 至 15）';return}if(state.custom.length>=60){$('modalError').textContent='最多新增 60 種自訂裝備';return}const id='u-'+Math.floor(Date.now()/1000).toString(36)+'-'+Math.floor(Math.random()*999999).toString(36);state.custom.push({id,n,en,cat,ow,oh,comp:cat==='bag'?[{w:iw,h:ih}]:[],slots:0,allowBags:cat==='bag'&&$('customAllow').checked,custom:true});state.qty[id]=1;closeModal();state.tab='all';state.query='';$('search').value='';syncTabs();changed();toast(t('自訂裝備已新增並選取','Custom item added'))});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderGrid,120)});
updateStashControls();applyLanguage();refreshClearUndo();renderCatalog();switchPage(state.mode);
})();
