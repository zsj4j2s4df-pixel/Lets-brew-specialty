import http from 'node:http';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),raw=await readFile(new URL('_headers',root),'utf8');
const headers=Object.fromEntries(raw.split('\n').slice(1).filter(x=>/^  [A-Z]/.test(x)).map(x=>{const i=x.indexOf(':');return[x.slice(0,i).trim(),x.slice(i+1).trim()];}));
// Test on local HTTP only. Production retains upgrade-insecure-requests.
headers['Content-Security-Policy']=headers['Content-Security-Policy'].replace('; upgrade-insecure-requests','');
http.createServer(async(req,res)=>{try{let name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(!/^[a-zA-Z0-9_-]+\.(html|js|mjs|css|json|png)$/.test(name))throw Error('path');const content=await readFile(new URL(name,root));const ext=name.split('.').pop();res.writeHead(200,{...headers,'Content-Type':{html:'text/html; charset=utf-8',js:'text/javascript',mjs:'text/javascript',css:'text/css',json:'application/json',png:'image/png'}[ext]});res.end(content);}catch{res.writeHead(404);res.end();}}).listen(4175,'127.0.0.1');
