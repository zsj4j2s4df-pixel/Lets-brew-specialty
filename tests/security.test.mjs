import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import '../security.js';
import push,{safePushEndpoint} from '../worker/src/index.js';
const S=globalThis.BrewSecurity;
const valid=()=>({methods:[{id:'espresso',name:"Jesse's espresso",on:true,glyph:'☕'}],beans:[{id:'bean1',name:'Test',photo:'data:image/png;base64,AAAA'}],brews:[],gear:[]});
test('imports preserve valid strings and reject executable image/identifier/prototype fields before use',()=>{
 assert.deepEqual(S.validateImport(valid(),{backup:true}),valid());
 for(const make of [d=>d.beans[0].photo='x" onerror="alert(1)',d=>d.methods[0].id="x');alert(1);//",d=>d.methods={},d=>d.beans[0].name={},d=>d.beans.push(null)]){const d=valid();make(d);assert.throws(()=>S.validateImport(d,{backup:true}));}
 assert.throws(()=>S.validateImport(JSON.parse('{"__proto__":{"polluted":true}}')));assert.equal({}.polluted,undefined);
 assert.throws(()=>S.checkFile({size:33*1024*1024}));assert.equal(S.imageUrl('data:image/svg+xml;base64,AAAA'),'');assert.equal(S.safeLink('javascript:alert(1)'),'');assert.equal(S.safeLink('https://example.com/coffee'),'https://example.com/coffee');
});
test('import size, object depth and collection counts are bounded',()=>{
 let d={};for(let i=0;i<30;i++)d={next:d};assert.throws(()=>S.validateImport(d));assert.throws(()=>S.validateImport({beans:Array(10001).fill({})}));
});
const origin='https://letsbrewspecialty.jesseboontje.workers.dev';
const endpoint='https://fcm.googleapis.com/fcm/send/synthetic-token';
function env(){const rows=new Map();return{rows,SUBS:{put:async(k,v)=>rows.set(k,v),get:async k=>rows.get(k)||null,delete:async k=>rows.delete(k)}};}
const req=(body,headers={Origin:origin,'Content-Type':'application/json'})=>new Request('https://push.example/subscribe',{method:'POST',headers,body:JSON.stringify(body)});
test('push rejects arbitrary destinations, origin abuse, invalid time and oversized bodies without storing',async()=>{
 for(const bad of ['http://fcm.googleapis.com/x','https://localhost/x','https://169.254.169.254/x','https://fcm.googleapis.com.attacker.test/x','https://fcm.googleapis.com:444/x','https://user@fcm.googleapis.com/x']){assert.equal(safePushEndpoint(bad),false);const e=env();assert.equal((await push.fetch(req({subscription:{endpoint:bad}}),e)).status,400);assert.equal(e.rows.size,0);}
 const e=env();assert.equal((await push.fetch(req({subscription:{endpoint}},{Origin:'https://untrusted.example','Content-Type':'application/json'}),e)).status,403);
 assert.equal((await push.fetch(req({subscription:{endpoint},time:'29:99'}),e)).status,400);assert.equal((await push.fetch(req({padding:'x'.repeat(17000)}),e)).status,413);assert.equal(e.rows.size,0);
});
test('valid subscriptions retain daily delivery marker and minimize stored subscription data',async()=>{
 const e=env(),body={subscription:{endpoint,keys:{auth:'not-needed'}},time:'08:00',tz:'Europe/Amsterdam'};assert.equal((await push.fetch(req(body),e)).status,200);const key=[...e.rows.keys()][0];const record=JSON.parse(e.rows.get(key));assert.deepEqual(record.subscription,{endpoint});record.lastSent='2026-10-23';e.rows.set(key,JSON.stringify(record));assert.equal((await push.fetch(req(body),e)).status,200);assert.equal(JSON.parse(e.rows.get(key)).lastSent,'2026-10-23');
 const blocked={...e,RATE_LIMITER:{limit:async()=>({success:false})}};assert.equal((await push.fetch(req(body),blocked)).status,429);
});
async function sw(){const handlers={},deleted=[],writes=[];const context={URL,Response,self:{location:{href:'https://app.test/service-worker.js'},clients:{claim:async()=>{}},addEventListener:(name,fn)=>handlers[name]=fn},caches:{keys:async()=>['another-app','scc-v93','scc-v94'],delete:async k=>deleted.push(k),open:async()=>({put:async(...args)=>writes.push(args),match:async()=>undefined})},fetch:async()=>new Response('ok')};vm.runInNewContext(await readFile(new URL('../service-worker.js',import.meta.url),'utf8'),context);return{handlers,deleted,writes};}
test('service worker ignores API traffic, writes, unknown resources and preserves unrelated caches',async()=>{
 const {handlers,deleted}=await sw();for(const [url,method]of[['https://api.openai.com/v1/chat/completions','POST'],['https://api.anthropic.com/v1/messages','POST'],['https://app.test/private.json','GET'],['https://push.test/subscribe','POST']]){let intercepted=false;handlers.fetch({request:new Request(url,{method}),respondWith:()=>intercepted=true});assert.equal(intercepted,false);}
 let done;handlers.activate({waitUntil:p=>done=p});await done;assert.deepEqual(deleted,['scc-v93']);
});
test('cron skips old unsafe endpoints, never follows redirects and retries failed delivery',async()=>{
 const e=env(),now=new Date(),time=String(now.getUTCHours()).padStart(2,'0')+':'+String(now.getUTCMinutes()).padStart(2,'0');
 const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);e.VAPID_PRIVATE_JWK=JSON.stringify(await crypto.subtle.exportKey('jwk',pair.privateKey));e.VAPID_PUBLIC_KEY='synthetic-public-key';e.VAPID_SUBJECT='mailto:synthetic@example.test';
 e.rows.set('sub:safe',JSON.stringify({subscription:{endpoint},time,tz:'UTC',lastSent:''}));e.rows.set('sub:unsafe',JSON.stringify({subscription:{endpoint:'https://internal.example/private'},time,tz:'UTC',lastSent:''}));e.SUBS.list=async()=>({keys:[...e.rows.keys()].map(name=>({name})),list_complete:true});
 const original=globalThis.fetch,calls=[];let status=503;globalThis.fetch=async(url,options)=>{calls.push({url,redirect:options.redirect});return new Response('',{status});};
 try{for(const code of [503,200]){status=code;let done;push.scheduled({},e,{waitUntil:p=>done=p});await done;if(code===503)assert.equal(JSON.parse(e.rows.get('sub:safe')).lastSent,'');else assert.match(JSON.parse(e.rows.get('sub:safe')).lastSent,/^\d{4}-\d{2}-\d{2}$/);}assert.equal(calls.length,2);for(const call of calls){assert.equal(call.url,endpoint);assert.equal(call.redirect,'manual');}}finally{globalThis.fetch=original;}
});
