'use strict';
// Public, local app: protect import and rendering boundaries without adding login.
globalThis.BrewSecurity=(()=>{
 const MAX_FILE=32*1024*1024;
 const fail=()=>{throw new Error('Invalid or unsafe import. Your saved data were not replaced.');};
 const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&[Object.prototype,null].includes(Object.getPrototypeOf(x));
 const identifier=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(x)&&!['__proto__','constructor','prototype'].includes(x);
 function imageUrl(value){
  if(typeof value!=='string'||value.length>5*1024*1024)return '';
  if(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]*={0,2}$/.test(value))return value;
  return /^(?:\.\/)?[a-zA-Z0-9_/-]+\.(?:png|jpe?g|webp)$/i.test(value)?value:'';
 }
 function safeLink(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:'';}catch{return '';}}
 function validateImport(data,{backup=false}={}){
  if(!plain(data))fail();let nodes=0,total=0;
  function visit(value,key='',depth=0){
   if(++nodes>100000||depth>24)fail();
   if(['__proto__','prototype','constructor'].includes(key))fail();
   if(value===null||value===undefined)return;
   if(typeof value==='string'){
    total+=value.length;if(total>MAX_FILE||value.length>(value.startsWith('data:image/')?5*1024*1024:100000))fail();
    if((key==='id'||key==='method'||key==='mid'||key.endsWith('Id'))&&value&&!identifier(value))fail();
    if(['img','customImg','photo'].includes(key)&&value&&!imageUrl(value))fail();
    if(key==='tint'&&value&&!/^--[a-zA-Z0-9_-]+$/.test(value))fail();
    return;
   }
   if(typeof value==='number'){if(!Number.isFinite(value))fail();return;}
   if(typeof value==='boolean')return;
   if(Array.isArray(value)){if(value.length>10000)fail();for(const item of value)visit(item,'',depth+1);return;}
   if(!plain(value))fail();for(const[k,v]of Object.entries(value)){if(['dialed','prep'].includes(key)&&!identifier(k))fail();visit(v,k,depth+1);}
  }
  visit(data);
  for(const key of ['methods','brews','beans','gear','recipes','latteShots','prepItems']){
   if(data[key]!==undefined&&(!Array.isArray(data[key])||data[key].some(x=>!plain(x))))fail();
  }
  if(backup&&(!Array.isArray(data.methods)||!Array.isArray(data.brews)))fail();
  // These are strings in the app's editable fields, never markup or objects.
  for(const row of [...(data.methods||[]),...(data.brews||[]),...(data.beans||[]),...(data.gear||[])]){
   for(const field of ['name','title','roaster','origin','process','notes','roasternotes','glyph','grind','time'])if(row[field]!=null&&typeof row[field]!=='string')fail();
   if(row.id!==undefined&&!identifier(row.id))fail();
   if(row.family!==undefined&&!['espresso','filter'].includes(row.family))fail();
  }
  return data;
 }
 function checkFile(file){if(!file||!Number.isFinite(file.size)||file.size>MAX_FILE)fail();}
 return Object.freeze({imageUrl,safeLink,validateImport,checkFile,identifier,MAX_FILE});
})();
