'use strict';
// Shared domain model. Recipes are plans; brews and dial-in attempts are facts.
globalThis.BrewModel=(()=>{
 const copy=v=>structuredClone(v),short=(v,n=600)=>String(v??'').slice(0,n);
 const family=(s,mid)=>s.methods.find(m=>m.id===mid)?.family||(mid==='espresso'?'espresso':'filter');
 function migrate(source){
  const s=copy(source);for(const key of ['beans','brews','methods','recipes','gear'])if(!Array.isArray(s[key]))s[key]=[];
  for(const b of s.brews)if(!b.outputMeaning)b.outputMeaning=family(s,b.method)==='espresso'?'cup_yield':'water_used';
  for(const m of s.methods){if(!m.family)m.family=family(s,m.id);if((s.dataVersion||0)<2&&['perculator','senseo'].includes(m.id))m.family='filter';}
  for(const r of s.recipes){r.fam=family(s,r.mid);r.eigen=true;}
  for(const b of s.brews){b.kind=b.dialIn?'dial-in':'brew';const bean=s.beans.find(x=>x.id===b.beanId);if(bean&&!b.beanSnapshot)b.beanSnapshot=beanSnapshot(bean);}
  s.dataVersion=2;s.dialInCollapsed=true;return s;
 }
 function beanSnapshot(b){return Object.fromEntries(['id','name','roaster','origin','process','roastdate','fam'].map(k=>[k,b[k]??null]));}
 function attachBrew(s,b,recipe){
  if(recipe){b.recipeId=recipe.id;b.recipeSnapshot=copy(recipe);}else{b.recipeId=b.recipeId??null;}
  const bean=s.beans.find(x=>x.id===b.beanId);if(bean&&!b.beanSnapshot)b.beanSnapshot=beanSnapshot(bean);
  b.outputMeaning=b.outputMeaning||(family(s,b.method)==='espresso'?'cup_yield':'water_used');b.kind=b.dialIn?'dial-in':'brew';return b;
 }
 function canonicalRecipe(s,r){const mid=r.mid||r.voor?.find(id=>s.methods.some(m=>m.id===id))||s.methods.find(m=>m.family===(r.fam||'filter')&&m.on)?.id||null;return{id:r.id,name:r.naam,methodId:mid,beanId:r.beanId||null,family:r.fam||family(s,mid),own:!!r.eigen,dose:r.dose,output:Math.round(r.dose*r.ratio),temperature:r.temp,grind:r.maling||'',targetGrind:r.stand||'',time:r.tijd||'',steps:copy(r.stappen||[])};}
 function context(s,templates=[],selection={}){
  const selectedBean=s.beans.find(b=>b.id===selection.beanId),selectedMethod=s.methods.find(m=>m.id===selection.methodId);
  const recent=s.brews.filter(b=>(!selectedBean||b.beanId===selectedBean.id)&&(!selectedMethod||b.method===selectedMethod.id)).sort((a,b)=>b.ts-a.ts);
  const chosenRecipe=s.recipes.concat(templates).find(r=>r.id===selection.recipeId);
  const beans=selectedBean?[selectedBean]:s.beans.filter(b=>b.inStock!==false).slice(0,20);
  return{schema:2,selection:{beanId:selectedBean?.id||null,methodId:selectedMethod?.id||null,recipeId:chosenRecipe?.id||null},
   beans:beans.map(b=>({...beanSnapshot(b),inStock:b.inStock!==false,roast:b.roast||null,notes:short(b.roasternotes||b.notes)})),
   methods:s.methods.filter(m=>m.on||m.id===selectedMethod?.id).map(m=>({id:m.id,name:m.name,family:m.family,profile:m.id==='senseo'?'pads':m.id==='perculator'?'moka':m.family})),
   gear:s.gear.filter(g=>!selectedMethod||g.category==='algemeen'||g.category===selectedMethod.family||selectedMethod.gear?.includes(g.id)).slice(0,30).map(g=>({name:g.name,kind:g.kind||null,category:g.category,grindMin:g.grindMin,grindMax:g.grindMax})),
   recipes:s.recipes.concat(templates).slice().sort((a,b)=>(b.id===chosenRecipe?.id?1:0)-(a.id===chosenRecipe?.id?1:0)).filter(r=>!selectedMethod||(r.mid===selectedMethod.id||r.voor?.includes(selectedMethod.id)||(!r.mid&&r.fam===selectedMethod.family))).slice(0,20).map(r=>canonicalRecipe(s,r)),
   recentBrews:recent.slice(0,12).map(b=>({id:b.id,methodId:b.method,beanId:b.beanId||null,kind:b.kind||(b.dialIn?'dial-in':'brew'),outputMeaning:b.outputMeaning||'historical_value',dose:b.dose,output:b.yield,time:b.time,temperature:b.temp,grind:b.grind,score:b.score,notes:short(b.notes),recipeId:b.recipeId||null,at:Number.isFinite(new Date(b.ts||0).getTime())?new Date(b.ts||0).toISOString():null})),
   missing:!selectedBean?['Geen specifieke boon gekozen: doe niet alsof er een boon gekozen is.']:[]};
 }
 function validateRecipe(s,input){
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Het AI-antwoord bevat geen recept.');
  const method=s.methods.find(m=>m.id===input.methodId);if(!method)throw Error('Het recept gebruikt een onbekende zetmethode.');
  if(input.beanId&&!s.beans.some(b=>b.id===input.beanId))throw Error('Het recept verwijst naar een onbekende boon.');
  const number=(v,min,max,name)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error('Ongeldige '+name+' in het recept.');return v;};
  const dose=number(input.dose,1,100,'dose'),output=number(input.output,5,5000,'opbrengst'),ratio=output/dose;
  if(ratio<(method.family==='espresso'?.5:4)||ratio>(method.family==='espresso'?6:40))throw Error('De verhouding past niet bij deze zetmethode.');
  const temp=number(input.temperature,50,100,'temperatuur');
  if(typeof input.name!=='string'||!input.name.trim()||input.name.length>160)throw Error('Geef het recept een geldige naam.');
  if(!Array.isArray(input.steps)||!input.steps.length||input.steps.length>20)throw Error('Het recept heeft geen geldig stappenplan.');
  let previousTime=-1,previousGrams=0;
  const allowed=['bloom','giet','swirl','roer','wacht','keer','pers','doorloop','dose','shot','stop','melk'];
  const steps=input.steps.map(st=>{const t=number(st.seconds,0,1800,'staptijd');if(t<previousTime)throw Error('De stappen staan niet op tijdvolgorde.');previousTime=t;
   if(!allowed.includes(st.action)||typeof st.text!=='string'||!st.text.trim()||st.text.length>1000)throw Error('Een receptstap is ongeldig.');
   let p=0;if(st.grams!=null){const g=number(st.grams,0,output,'stapgewicht');if(g<previousGrams)throw Error('Het cumulatieve gewicht moet oplopen.');previousGrams=g;p=g/output;}
   return{t,p,k:st.action,d:st.text.trim(),klep:['open','dicht'].includes(st.valve)?st.valve:null};});
  return{id:'r_'+crypto.randomUUID(),eigen:true,mid:method.id,fam:method.family,beanId:input.beanId||null,naam:input.name.trim(),dose,ratio,temp,maling:short(input.grind||'',160),stand:short(input.targetGrind||'',80),over:short(input.explanation||'',2000),tijd:Math.floor(previousTime/60)+':'+String(previousTime%60).padStart(2,'0'),voor:[method.id],stappen:steps,source:'ai',createdAt:Date.now()};
 }
 return Object.freeze({migrate,attachBrew,context,canonicalRecipe,validateRecipe,beanSnapshot});
})();
