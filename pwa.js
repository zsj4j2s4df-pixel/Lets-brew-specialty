if('serviceWorker' in navigator){
 const controlled=!!navigator.serviceWorker.controller;let reloading=false;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(controlled&&!reloading){reloading=true;location.reload();}});
 window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js',{updateViaCache:'none'}).then(reg=>reg.update().catch(()=>{})).catch(()=>{}));
}
