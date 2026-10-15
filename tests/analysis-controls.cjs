const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true}); const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  localStorage.setItem('stash-lab-planner-v1',JSON.stringify({liveAnalysis:false,qty:{scavbp:2},depth:6,rotate:true,stashW:10,stashH:28}));
  window.fakeWorkers=[];
  window.Worker=class{constructor(){window.fakeWorkers.push(this)}postMessage(data){this.input=data}terminate(){this.terminated=true}emit(data){this.onmessage({data})}};
 });
 await page.goto(process.env.PLANNER_URL || 'http://127.0.0.1:49237/');
 assert(await page.locator('#startSearchBtn').isEnabled());
 await page.locator('#startSearchBtn').click();await page.locator('#cancelSearchBtn').click();
 assert(await page.locator('#restartSearchBtn').isEnabled(),'Restart must remain usable while a stop acknowledgement is pending');

 // Restart is a recovery action even when a previous stop never replies.
 await page.locator('#restartSearchBtn').click();
 assert.equal(await page.evaluate(()=>fakeWorkers.length),2);
 assert(await page.evaluate(()=>fakeWorkers[0].terminated));
 await page.evaluate(()=>fakeWorkers[0].emit({type:'complete',visited:999,result:null,reason:'stopped'}));
 assert(await page.locator('#cancelSearchBtn').isEnabled());
 await page.evaluate(()=>fakeWorkers[1].emit({type:'complete',visited:41,result:null,reason:'limit'}));
 assert(await page.locator('#startSearchBtn').isEnabled());assert(await page.locator('#continueSearchBtn').isEnabled());
 await page.locator('#continueSearchBtn').click();
 assert(await page.evaluate(()=>fakeWorkers[2].input.unlimited));
 await page.evaluate(()=>fakeWorkers[2].emit({type:'complete',visited:9,result:null,reason:'stopped'}));
 assert.equal(await page.locator('#searchTotalCount').innerText(),'50');
 await page.locator('#quickSettingsBtn').click();await page.locator('#demoBtn').click();await page.locator('#closeSettingsBtn').click();
 assert(await page.locator('#startSearchBtn').isEnabled());assert(await page.locator('#continueSearchBtn').isDisabled());
 assert.equal(await page.locator('#searchTotalCount').innerText(),'0');
 assert.equal(await page.evaluate(()=>fakeWorkers.length),3);
 await page.locator('#liveAnalysisToggle').check();
 assert.equal(await page.evaluate(()=>fakeWorkers.length),4);
 await page.clock.install();await page.locator('#liveAnalysisToggle').uncheck();
 assert(await page.locator('#restartSearchBtn').isEnabled());
 await page.clock.fastForward(5100);
 assert(await page.locator('#startSearchBtn').isEnabled());assert(await page.locator('#continueSearchBtn').isEnabled());
 assert((await page.locator('#searchStatusText').innerText()).includes('逾時'));
 await page.locator('#startSearchBtn').click();
 await page.evaluate(()=>fakeWorkers.at(-1).onerror({message:'simulated connection error'}));
 assert(await page.locator('#startSearchBtn').isEnabled());assert(await page.locator('#restartSearchBtn').isEnabled());
 assert.deepEqual(errors,[]);
 await browser.close();console.log('Manual/live, stop/restart race, stale responses, branch accumulation, config invalidation, stop timeout, worker errors: OK');
})().catch(e=>{console.error(e);process.exit(1)});
