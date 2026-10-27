const{test,expect}=require('@playwright/test');
test('installed app opens legacy index URL after a redirect, reloads offline and keeps local coffee data',async({page,context})=>{
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');
 await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await page.evaluate(async()=>{state.beans.push({id:'redirect-survivor',name:'Bewaar deze boon',inStock:true});await save();});
 await page.goto('/index.html',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');
 expect(await page.evaluate(()=>state.beans.some(b=>b.id==='redirect-survivor'))).toBe(true);
 const cached=await page.evaluate(async()=>{const keys=(await caches.keys()).filter(k=>/^scc-v\d+$/.test(k));const c=await caches.open(keys[0]);const r=await c.match(new URL('index.html',location.href));return{redirected:r.redirected,status:r.status};});
 expect(cached).toEqual({redirected:false,status:200});
 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');
 expect(await page.evaluate(()=>state.beans.some(b=>b.id==='redirect-survivor'))).toBe(true);
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>currentPage==='home');
});
