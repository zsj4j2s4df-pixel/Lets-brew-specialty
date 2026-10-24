'use strict';
globalThis.BrewVoice=(()=>{
 let peer=null,channel=null,stream=null,audio=null,timer=null,starting=false,turn=0,seen=new Set(),pendingCalls=Promise.resolve();
 const status=text=>{document.getElementById('ws-voice-status').textContent=text;};
 function send(event){if(channel?.readyState==='open')channel.send(JSON.stringify(event));}
 function stop(message='Gesprek gestopt. Microfoon uit.'){
  turn++;clearTimeout(timer);timer=null;channel?.close();channel=null;
  if(peer){peer.onconnectionstatechange=null;peer.close();peer=null;}
  stream?.getTracks().forEach(t=>t.stop());stream=null;
  if(audio){audio.pause();audio.srcObject=null;audio.remove();audio=null;}
  starting=false;seen.clear();document.getElementById('ws-voice-start').disabled=false;document.getElementById('ws-voice-stop').disabled=true;status(message);
 }
 async function tool(event,ownTurn){if(ownTurn!==turn)return;
  if(seen.has(event.call_id))return false;seen.add(event.call_id);if(seen.size>100){stop('Gesprek afgerond. Start een nieuw gesprek voor meer vragen.');return;}
  let output;try{if(typeof event.arguments!=='string'||event.arguments.length>20000)throw Error('Ongeldige functieaanvraag.');const args=JSON.parse(event.arguments);output=await BrewWorkspace.voiceTool(event.name,args);}catch{output={error:'Dit voorstel of deze contextaanvraag is ongeldig. Vraag de gebruiker om de juiste gegevens.'};}
  if(ownTurn!==turn)return;send({type:'conversation.item.create',item:{type:'function_call_output',call_id:event.call_id,output:JSON.stringify(output)}});return true;
 }
 function eventMessage(event){let e;try{if(event.data.length>100000)return;e=JSON.parse(event.data);}catch{return;}
  // Wait for the completed response before returning tools. Batch multiple
  // results into one continuation to avoid overlapping paid responses.
  if(e.type==='response.done'&&e.response?.status!=='cancelled'){
   const calls=(e.response?.output||[]).filter(item=>item.type==='function_call');
   if(calls.length){const ownTurn=turn;pendingCalls=pendingCalls.catch(()=>{}).then(async()=>{let returned=false;for(const call of calls)if(await tool(call,ownTurn))returned=true;if(returned&&ownTurn===turn)send({type:'response.create'});});}
  }
  if(['response.output_audio_transcript.delta','response.audio_transcript.delta'].includes(e.type)){const out=document.getElementById('ws-voice-output');out.textContent=(out.textContent+(e.delta||'')).slice(-16000);}
  if(['response.output_audio_transcript.done','response.audio_transcript.done'].includes(e.type))document.getElementById('ws-voice-output').textContent+='\n';
  if(e.type==='error')status('Het spraakmodel kon deze stap niet uitvoeren. Controleer je verbinding en modeltoegang.');
 }
 async function start(){
  if(starting||peer)return;const key=getKey('openai');
  if(!aiEnabled()||!key){setAiProv('openai');go('profile');renderProfile();document.getElementById('ai-card').classList.add('open');document.getElementById('ai-card').closest('details')?.setAttribute('open','');toast('Live spraak gebruikt je eigen OpenAI API-sleutel.');return;}
  if(!isSecureContext||!navigator.mediaDevices?.getUserMedia||!globalThis.RTCPeerConnection){status('Live spraak vraagt HTTPS, microfoontoegang en een browser met WebRTC. Je kunt hieronder gewoon typen.');return;}
  if(!confirm('Live spraak gebruikt je eigen OpenAI API-tegoed. Je stem en de gekozen koffiecontext gaan naar OpenAI. Het gesprek stopt uiterlijk na 10 minuten. Starten?'))return;
  starting=true;const ownTurn=++turn;document.getElementById('ws-voice-start').disabled=true;document.getElementById('ws-voice-stop').disabled=false;status('Microfoon en beveiligde spraaksessie starten…');
  try{
   const mic=await navigator.mediaDevices.getUserMedia({audio:true});if(ownTurn!==turn){mic.getTracks().forEach(t=>t.stop());return;}stream=mic;
   const response=await fetch('/api/realtime/session',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({model:localStorage.getItem('scc_voice_model')||'gpt-realtime'}),signal:AbortSignal.timeout(25000)});
   if(!response.ok){if(response.status===404)throw Error('De spraakroute is nog niet geïnstalleerd op deze host. Tekstadvies blijft beschikbaar.');const body=await response.json().catch(()=>null);throw Error(body?.error||'De spraaksessie kon niet worden gestart.');}
   const token=await response.json();if(ownTurn!==turn)return;if(typeof token.value!=='string')throw Error('Geen geldige tijdelijke spraaksleutel ontvangen.');
   peer=new RTCPeerConnection();audio=document.createElement('audio');audio.autoplay=true;audio.setAttribute('playsinline','');document.querySelector('#page-assistant .screen').append(audio);peer.ontrack=e=>{if(audio){audio.srcObject=e.streams[0];audio.play().catch(()=>{if(audio){audio.controls=true;status('Tik op afspelen om de stem te horen.');}});}};
   peer.onconnectionstatechange=()=>{if(peer?.connectionState==='connected')status('Gesprek actief. Vraag naar je bonen, recepten of laatste resultaat.');if(['failed','disconnected','closed'].includes(peer?.connectionState))stop('Verbinding verbroken. Microfoon uit.');};
   for(const track of stream.getTracks())peer.addTrack(track,stream);
   channel=peer.createDataChannel('oai-events');channel.addEventListener('message',eventMessage);channel.addEventListener('open',()=>{send({type:'conversation.item.create',item:{type:'message',role:'user',content:[{type:'input_text',text:'Begin met get_coffee_context. Vraag daarna kort waarmee je kunt helpen.'}]}});send({type:'response.create'});});
   const offer=await peer.createOffer();await peer.setLocalDescription(offer);
   const answer=await fetch('https://api.openai.com/v1/realtime/calls',{method:'POST',headers:{Authorization:'Bearer '+token.value,'Content-Type':'application/sdp'},body:offer.sdp,signal:AbortSignal.timeout(20000)});
   if(!answer.ok)throw Error('OpenAI kon de audioverbinding niet openen. Controleer modeltoegang en API-tegoed.');if(ownTurn!==turn)return;
   await peer.setRemoteDescription({type:'answer',sdp:await answer.text()});timer=setTimeout(()=>stop('De 10 minuten zijn voorbij. Microfoon uit.'),10*60*1000);
   status('Audioverbinding gemaakt. Spreek gerust; gebruik Stop gesprek om af te ronden.');
  }catch(e){if(ownTurn===turn)stop(e.message||'Live spraak is niet beschikbaar.');}finally{if(ownTurn===turn)starting=false;}
 }
 window.addEventListener('pagehide',()=>stop());document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&(peer||starting))stop('App op de achtergrond. Microfoon uit.');});
 return{start,stop};
})();
