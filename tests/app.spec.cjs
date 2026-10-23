const{test,expect}=require('@playwright/test');
async function start(page){await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));await page.route('https://fonts.gstatic.com/**',r=>r.abort());await page.route('https://api.openai.com/**',r=>r.abort());await page.route('https://api.anthropic.com/**',r=>r.abort());await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');}
test('local app opens without login and main sections remain usable',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page);
 for(const tab of ['home','brews','beans','learn','profile']){await page.locator(`#nav [data-p="${tab}"]`).tap();await expect(page.locator('#page-'+tab)).toBeVisible();}
 expect(errors).toEqual([]);await expect(page.locator('input[type=password]')).toHaveCount(1);
});
test('malicious backup and friend imports are rejected atomically; a valid backup survives reload',async({page})=>{
 await start(page);await page.evaluate(()=>go('profile'));const before=await page.evaluate(()=>JSON.stringify(state));
 for(const selector of ['#import-input','#friend-import']){
  const d=JSON.parse(before);d.beans.push({id:'auditbean',name:'Synthetic',photo:'x" onerror="window.__auditXss=true'});
  await page.locator(selector).setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(d))});await expect(page.locator('#toast')).toContainText("couldn't read");expect(await page.evaluate(()=>JSON.stringify(state))).toBe(before);expect(await page.evaluate(()=>window.__auditXss)).toBeUndefined();
 }
 const valid=JSON.parse(before);valid.beans.push({id:'auditbean',name:"Jesse's synthetic coffee",roaster:'Audit',inStock:true,methods:['espresso'],notes:'<text remains plain>'});page.once('dialog',d=>d.accept());await page.locator('#import-input').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(valid))});await expect(page.locator('#toast')).toContainText('data imported');await expect.poll(()=>page.evaluate(async()=>!!(await idbGet(IDB_KEY)).beans.find(x=>x.id==='auditbean'))).toBeTruthy();await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');await page.evaluate(()=>go('beans'));await expect(page.locator('#page-beans')).toContainText("Jesse's synthetic coffee");
});
test('data bridge denies other origins and inherited methods, preserves explicit same-origin API',async({page})=>{
 await start(page);const result=await page.evaluate(()=>{let reply=null;const original=window.postMessage;window.postMessage=x=>reply=x;const ask=(origin,method)=>{reply=null;window.dispatchEvent(new MessageEvent('message',{origin,source:window,data:{lb:'query',method,id:'synthetic'}}));return reply;};const cross=ask('https://untrusted.example','graph'),same=ask(location.origin,'graph'),inherited=ask(location.origin,'toString');window.postMessage=original;return{cross,same:!!same?.data?.beans,inherited:inherited?.error};});expect(result.cross).toBeNull();expect(result.same).toBeTruthy();expect(result.inherited).toContain('unknown method');
});
test('unsafe saved data are retained for recovery and cannot be overwritten by an empty state',async({page})=>{
 await start(page);for(const invalid of [{methods:[],brews:[],beans:[{id:'invalid',photo:'javascript:bad'}],gear:[]},{unsupported:'keep the original data'}]){await page.evaluate(x=>idbSet(IDB_KEY,x),invalid);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>storageBlocked);await page.evaluate(()=>save());expect(await page.evaluate(()=>idbGet(IDB_KEY))).toEqual(invalid);}
});
test('provider keys are only in tab memory; legacy plaintext keys are removed without an AI call',async({page})=>{
 await start(page);await page.evaluate(()=>localStorage.setItem('scc_ai_key','synthetic-legacy-test-key'));await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');expect(await page.evaluate(()=>getKey('anthropic'))).toBe('synthetic-legacy-test-key');expect(await page.evaluate(()=>localStorage.getItem('scc_ai_key'))).toBeNull();await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');expect(await page.evaluate(()=>getKey('anthropic'))).toBe('');
});
test('gear names containing quotes remain data when a gear chip is selected',async({page})=>{
 await start(page);const name="Jesse's brewer');window.__auditXss=true;//";
 await page.evaluate(name=>{state.gear=[{id:'auditgear',name,category:'espresso',kind:'brewer'}];openForm('espresso');},name);await page.locator('#f-gearchips button').click();await expect(page.locator('#f-brewer')).toHaveValue(name);expect(await page.evaluate(()=>window.__auditXss)).toBeUndefined();
});
