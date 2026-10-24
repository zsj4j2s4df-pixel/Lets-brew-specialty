import {VOICE_TOOLS,VOICE_INSTRUCTIONS} from './voice-contract.mjs';
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Strict-Transport-Security':'max-age=15552000'}});
export async function realtimeSession(request,env={}){
 if(request.method!=='POST')return json({error:'Alleen POST is toegestaan.'},405);
 if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'Deze aanvraag hoort niet bij de app.'},403);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON vereist.'},415);
 const key=request.headers.get('Authorization')||'';
 if(!/^Bearer sk-[A-Za-z0-9_-]{20,}$/.test(key))return json({error:'Voer je eigen OpenAI API-sleutel in bij Instellingen → AI.'},401);
 if(env.RATE_LIMITER){const limit=await env.RATE_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});if(!limit.success)return json({error:'Wacht even voordat je opnieuw een gesprek start.'},429);}
 let config;try{const reader=request.body.getReader();let text='',size=0;const dec=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return json({error:'Aanvraag te groot.'},413);}text+=dec.decode(value,{stream:true});}config=JSON.parse(text);}catch{return json({error:'Ongeldige aanvraag.'},400);}
 const models=['gpt-realtime','gpt-realtime-2.1','gpt-realtime-mini','gpt-realtime-2.1-mini'];
 if(!models.includes(config?.model))return json({error:'Onbekend spraakmodel.'},400);
 try{
  const response=await fetch('https://api.openai.com/v1/realtime/client_secrets',{method:'POST',redirect:'error',headers:{Authorization:key,'Content-Type':'application/json'},body:JSON.stringify({expires_after:{anchor:'created_at',seconds:60},session:{type:'realtime',model:config.model,instructions:VOICE_INSTRUCTIONS,tools:VOICE_TOOLS,max_output_tokens:1000,audio:{input:{turn_detection:{type:'server_vad'}},output:{voice:'marin'}}}}),signal:AbortSignal.timeout(20000)});
  if(!response.ok)return json({error:'OpenAI kon geen spraaksessie starten. Controleer je eigen API-sleutel, modeltoegang en tegoed.',providerStatus:response.status},response.status===429?429:502);
  const data=await response.json();if(typeof data.value!=='string'||data.value.length>2000)return json({error:'OpenAI gaf geen bruikbare spraaksessie terug.'},502);
  return json({value:data.value,expires_at:data.expires_at});
 }catch{return json({error:'De spraakdienst is tijdelijk niet bereikbaar.'},502);}
}
export default{async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(path==='/api/realtime/session')return realtimeSession(request,env);
 if(path.startsWith('/api/'))return json({error:'Niet gevonden.'},404);
 const response=await env.ASSETS.fetch(request),headers=new Headers(response.headers);
 headers.set('X-Content-Type-Options','nosniff');headers.set('X-Frame-Options','DENY');headers.set('Referrer-Policy','strict-origin-when-cross-origin');
 headers.set('Permissions-Policy','microphone=(self), camera=(self), geolocation=(self), payment=(), usb=()');
 headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; script-src-attr 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; frame-src 'none'; manifest-src 'self'; worker-src 'self'");
 return new Response(response.body,{status:response.status,headers});
}};
