// Genereer een VAPID-sleutelpaar voor Web Push.
// Gebruik:  node generate-vapid.mjs
//
// - VAPID_PUBLIC_KEY  -> in wrangler.jsonc (vars) zetten
// - VAPID_PRIVATE_JWK -> als secret zetten:  npx wrangler secret put VAPID_PRIVATE_JWK
//   (plak dan de hele JSON-regel). NOOIT de privésleutel committen.

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const rawPub = new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey));
const privJwk = await crypto.subtle.exportKey('jwk', kp.privateKey);

console.log('\nVAPID_PUBLIC_KEY (vars in wrangler.jsonc + applicationServerKey in de app):');
console.log(b64url(rawPub));
console.log('\nVAPID_PRIVATE_JWK (zet als secret, niet committen):');
console.log(JSON.stringify(privJwk));
console.log('');
