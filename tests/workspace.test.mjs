import test from 'node:test';
import assert from 'node:assert/strict';
import '../brew-model.js';
import {realtimeSession} from '../site-worker.mjs';
const M=globalThis.BrewModel;
const data=()=>({methods:[{id:'espresso',family:'espresso',name:'Espresso',on:true},{id:'v60',family:'filter',name:'V60',on:true}],beans:[{id:'bean1',name:'Eigen boon',inStock:false,photo:'private-photo',roaster:'Roaster'}],gear:[{id:'g1',name:'Mijn molen',category:'espresso',kind:'grinder'}],recipes:[],brews:[{id:'b1',beanId:'bean1',method:'espresso',dialIn:true,ts:1,dose:18,yield:36},{id:'b2',beanId:'bean1',method:'espresso',dialIn:true,ts:2,dose:18,yield:37}],dialLog:{'bean1|espresso':[{ts:1},{ts:2}]}});
const proposal=(methodId='espresso')=>({name:'Zoete kop',methodId,beanId:'bean1',dose:18,output:methodId==='espresso'?36:300,temperature:93,grind:'fijn',steps:[{seconds:0,action:'shot',text:'Begin'},{seconds:28,grams:methodId==='espresso'?36:300,action:'stop',text:'Stop'}]});
test('migration is idempotent, preserves old attempts and does not couple history to stock',()=>{
 const before=data(),m=M.migrate(before);assert.equal(m.brews.length,2);assert.equal(m.beans[0].inStock,false);assert.deepEqual(M.migrate(m),m);assert.equal(before.dataVersion,undefined);assert.equal(m.brews[0].beanSnapshot.name,'Eigen boon');
});
test('brew snapshot cannot change when its recipe or bean changes later',()=>{
 const s=M.migrate(data()),r={id:'r1',naam:'Basis',dose:18,ratio:2};const b={id:'new',method:'espresso',beanId:'bean1'};M.attachBrew(s,b,r);r.naam='Veranderd';s.beans[0].name='Andere naam';assert.equal(b.recipeSnapshot.naam,'Basis');assert.equal(b.beanSnapshot.name,'Eigen boon');
});
test('AI context is scoped and excludes images, credentials and unbounded history',()=>{
 const s=M.migrate(data());s.openaiKey='secret-not-context';s.brews=Array.from({length:30},(_,i)=>({...s.brews[0],id:'b'+i,ts:i}));const c=M.context(s,[],{beanId:'bean1',methodId:'espresso'});const json=JSON.stringify(c);assert.equal(c.recentBrews.length,12);assert.ok(!json.includes('private-photo'));assert.ok(!json.includes('secret-not-context'));assert.equal(c.gear[0].name,'Mijn molen');
});
test('AI recipe proposals validate IDs, family ratio and cumulative step quantities',()=>{
 const s=M.migrate(data());for(const mid of ['espresso','v60'])assert.equal(M.validateRecipe(s,proposal(mid)).mid,mid);
 for(const mutate of [p=>p.methodId='unknown',p=>p.output=900,p=>p.temperature=150,p=>p.steps[1].seconds=-1,p=>p.steps[1].grams=1000,p=>p.beanId='other-user']){const p=proposal();mutate(p);assert.throws(()=>M.validateRecipe(s,p));}
});
const origin='https://coffee.test';
const request=(body={model:'gpt-realtime'},key='sk-'+('a'.repeat(40)),source=origin)=>new Request(origin+'/api/realtime/session',{method:'POST',headers:{Origin:source,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
test('voice relay rejects missing own keys, other origins, unknown models and oversized requests',async()=>{
 assert.equal((await realtimeSession(request({},''))).status,401);assert.equal((await realtimeSession(request({},undefined,'https://attacker.test'))).status,403);assert.equal((await realtimeSession(request({model:'anything'}))).status,400);assert.equal((await realtimeSession(request({text:'x'.repeat(5000)}))).status,413);
});
test('voice relay sends only the user key to OpenAI and returns a short-lived session, never raw provider errors',async()=>{
 const original=globalThis.fetch;let captured;globalThis.fetch=async(url,options)=>{captured={url,options};return Response.json({value:'ephemeral-synthetic',expires_at:1});};
 try{const r=await realtimeSession(request());const out=await r.json();assert.equal(out.value,'ephemeral-synthetic');assert.equal(captured.url,'https://api.openai.com/v1/realtime/client_secrets');assert.equal(JSON.parse(captured.options.body).expires_after.seconds,60);assert.equal(captured.options.redirect,'error');assert.equal(r.headers.get('cache-control'),'no-store');globalThis.fetch=async()=>Response.json({error:{message:'sk-do-not-echo-this'}},{status:401});const fail=await realtimeSession(request());assert.ok(!(await fail.text()).includes('sk-do-not-echo'));}finally{globalThis.fetch=original;}
});
test('moka and pad-machine migration corrects classification without altering measured values',()=>{
 const old={methods:[{id:'perculator',family:'espresso'},{id:'senseo',family:'espresso'}],brews:[{id:'m1',method:'perculator',dose:18,yield:120}],beans:[],gear:[],recipes:[]};const next=M.migrate(old);assert.equal(next.methods[0].family,'filter');assert.equal(next.methods[1].family,'filter');assert.equal(next.brews[0].yield,120);assert.equal(next.brews[0].outputMeaning,'cup_yield');
});
