/* Neemt de app-shots op voor de rondleidingsvideo.
 *
 *   npm install playwright --no-save
 *   python3 -m http.server 8765          (vanuit de repo-root)
 *   node docs/video/opnemen.js
 *
 * Er komt één .webm per shot in docs/video/opnames/, 1080x1920.
 *
 * Waarom het zo omslachtig is opgebouwd — vier dingen die anders misgaan:
 *
 *  1. Playwright's eigen video-opname (recordVideo) levert hier wítte frames op:
 *     de screencast krijgt in deze omgeving geen beeld van de compositor. Losse
 *     screenshots werken wél. Daarom nemen we frames op als JPEG (~15 fps op
 *     1080x1920) en plakken we die daarna in de browser aan elkaar met canvas +
 *     MediaRecorder. Dat scheelt ffmpeg, die staat er niet.
 *  2. Playwright neemt op in CSS-pixels: een viewport van 432 breed geeft een klein
 *     plaatje in een grote grijze lijst, hoe groot je de video ook vraagt. Daarom
 *     een viewport van 1080x1920 met zoom 2,5 — de app rekent dan nog steeds met
 *     432 px breed (hij is max 430) maar tekent op 1080.
 *  3. de app haalt Caveat en Patrick Hand bij Google op. Dat hangt hier, en zonder
 *     die fonts is het de app niet meer. Ze worden onderschept en lokaal ingevuld.
 *  4. de splash duurt 3,75 s en springt daarna naar home. Die timer wordt uitgezet,
 *     anders klapt een opname halverwege terug naar het beginscherm.
 *
 * De demo-data komt hiervandaan, niet uit een echt logboek. Een lege app is geen
 * rondleiding, en echte bonen horen niet in een promo.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const URL = process.env.APP_URL || 'http://localhost:8765/index.html';
const BASIS = process.env.BASE_URL || 'http://localhost:8765';
const UIT = path.join(__dirname, 'opnames');
const TIJDELIJK = path.join(UIT, '_frames');
const CHROOM = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
const VIDEO = { width: 1080, height: 1920 };   // 9:16
const ZOOM = 2.5;                              // 1080 / 2,5 = 432 css-px, en de app is max 430
const FPS = 8;                                 // wat de encoder op 1080x1920 volhoudt
const FONTS = path.join(__dirname, '..', '..', '.claude', 'skills', 'nieuwe-feature',
                        'scripts', 'fonts.css');

/* ---- de demo-plank ---------------------------------------------------- */
const DEMO = `(() => {
  const dag = 86400000, nu = Date.now();
  const datum = d => new Date(nu - d*dag).toISOString().slice(0,10);

  state.beans = [
    {id:'b1', name:'Ethiopia Yirgacheffe', roaster:'Friedhats',
     origin:'Yirgacheffe, Ethiopia', process:'washed', variety:'heirloom',
     altitude:'1750-2200', regions:[{land:'ethiopie', i:0}],
     roastdate:datum(9), roasternotes:'jasmine, lemon, black tea',
     roast:'light', fam:'filter', method:'v60', methods:['v60'],
     inStock:true, notes:''},
    {id:'b2', name:'Colombia Huila', roaster:'Manhattan',
     origin:'Huila, Colombia', process:'natural', variety:'caturra',
     altitude:'1400-1800', regions:[{land:'colombia', i:0}],
     roastdate:datum(14), roasternotes:'red fruit, cocoa, caramel',
     roast:'medium', fam:'espresso', method:'espresso', methods:['espresso'],
     inStock:true, notes:''},
    {id:'b3', name:'House Blend', roaster:'Friedhats',
     origin:'Brazil / Ethiopia', process:'natural', variety:'',
     altitude:'1100-1900', regions:[{land:'brazilie', i:0},{land:'ethiopie', i:1}],
     roastdate:datum(21), roasternotes:'chocolate, hazelnut, orange',
     roast:'medium-dark', fam:'both', method:'espresso', methods:['espresso','v60'],
     inStock:true, notes:''}
  ];

  state.wishlist = [
    {id:'w1', naam:'Kirinyaga AA', name:'Kirinyaga AA', brander:'Friedhats',
     url:'', origin:'Kirinyaga, Kenya', regions:[{land:'kenia', i:0}],
     proces:'washed', variety:'SL28, SL34', altitude:'1600-1900', brand:'light',
     roasternotes:'tomato sweetness, red apple',
     smaak:['tomato sweetness','red apple'], notitie:'', at:nu}
  ];

  state.gear = [
    {id:'g1', name:'Niche Zero',     category:'espresso', kind:'grinder', grindMin:0, grindMax:50},
    {id:'g2', name:'Lelit Bianca',   category:'espresso', kind:'brewer'},
    {id:'g3', name:'Comandante C40', category:'filter',   kind:'grinder', grindMin:0, grindMax:50},
    {id:'g4', name:'Hario V60 02',   category:'filter',   kind:'brewer'}
  ];

  state.brews = [
    {id:'r1', method:'v60', beanId:'b1', beans:'Ethiopia Yirgacheffe', dose:18, yield:300,
     ratio:16.7, time:'3:05', temp:93, grind:'22', grinder:'Comandante C40',
     brewer:'Hario V60 02', score:8.6, tags:['citrus','floral'],
     notes:'clear and sweet', ts:nu - 2*dag},
    {id:'r2', method:'espresso', beanId:'b2', beans:'Colombia Huila', dose:18, yield:36,
     ratio:2, time:'0:28', temp:93, grind:'4.0', grinder:'Niche Zero',
     brewer:'Lelit Bianca', score:8.9, tags:['caramel','berry'],
     notes:'syrupy, right on the money', ts:nu - dag},
    {id:'r3', method:'v60', beanId:'b3', beans:'House Blend', dose:16, yield:260,
     ratio:16.2, time:'2:50', temp:92, grind:'24', score:7.8, tags:['choc','nutty'],
     notes:'easy morning cup', ts:nu - 4*dag}
  ];

  // de reis naar de doelband: vijf pogingen die naar 28 s toe lopen
  state.dialLog = {'b2|espresso':[
    {ts:nu-5*dag, g:'5.2', t:'0:19', y:36, d:18},
    {ts:nu-4*dag, g:'4.7', t:'0:22', y:36, d:18},
    {ts:nu-3*dag, g:'4.3', t:'0:25', y:36, d:18},
    {ts:nu-2*dag, g:'4.1', t:'0:27', y:36, d:18},
    {ts:nu-1*dag, g:'4.0', t:'0:28', y:36, d:18}
  ]};

  state.name = 'Jesse';
  state.methods.forEach(m => { if (['v60','espresso','aeropress'].includes(m.id)) m.on = true; });
  save();
})()`;

/* ---- de shots ----------------------------------------------------------
   Elke shot is een tijdlijn: op welke milliseconde er iets gebeurt, en hoe lang
   het geheel duurt. Zo loopt het opnemen los van het uitvoeren, en hoeft er niets
   parallel aan het screenshotten te gebeuren.                                */
const SHOTS = [
  { naam: '02-home', duur: 5000, uitleg: 'home, dan rustig naar beneden',
    stappen: [
      [0,    "go('home')"],
      [1800, "document.querySelector('#page-home .screen').scrollTo({top:280,behavior:'smooth'})"]
    ]},

  { naam: '03-kaart-wereld', duur: 7500, uitleg: 'beans → plankkaart → wereldkaart → werelddeel',
    stappen: [
      [0,    "go('beans')"],
      [1800, "document.querySelector('.plank-kaart').click()"],
      [4300, "bpKies('deel', BP_LAND['ethiopie'].deel)"]
    ]},

  { naam: '04-kaart-streek', duur: 8500, uitleg: 'werelddeel → Ethiopië → Yirgacheffe klapt open',
    stappen: [
      [0,    "bpOpen('beans'); bpKies('deel', BP_LAND['ethiopie'].deel)"],
      [1800, "bpKies('land','ethiopie')"],
      [4400, "bpKies('streek',0)"],
      [5300, "document.querySelector('.bp-streek.op').scrollIntoView({behavior:'smooth',block:'start'})"]
    ]},

  { naam: '06-nieuwe-boon', duur: 9000, uitleg: 'New Bean: de velden vullen zich, herkomst komt op de kaart',
    stappen: [
      [0,    "openBeanForm()"],
      [900,  "document.getElementById('b-url').value='https://friedhats.com/products/ethiopia-guji-natural'"],
      [1500, "document.getElementById('b-name').value='Ethiopia Guji'"],
      [1900, "document.getElementById('b-roaster').value='Friedhats'"],
      [2300, "document.getElementById('b-origin').value='Guji, Ethiopia'"],
      [2700, "document.getElementById('b-process').value='natural'"],
      [3100, "document.getElementById('b-variety').value='heirloom'"],
      [3500, "document.getElementById('b-altitude').value='1900-2100'"],
      [3900, "document.getElementById('b-roasternotes').value='strawberry, peach, cocoa nib'"],
      [4400, "pickBeanRoast('light')"],
      [5000, "beanFormRegions=[{land:'ethiopie',i:1}]; renderBeanHerkomst()"],
      [5600, "document.getElementById('b-herkomst-veld').scrollIntoView({behavior:'smooth',block:'center'})"]
    ]},

  { naam: '07-recept', duur: 8500, uitleg: 'new brew: boon gekozen, gear en recept vullen zich mee',
    stappen: [
      [0,    "openForm('v60')"],
      [1400, "pickBean('b1')"],
      [3200, "cardToggle('recipe')"],
      [4000, "document.getElementById('pcard-recipe').scrollIntoView({behavior:'smooth',block:'center'})"],
      [5200, "pourPickRecipe('hoffmann')"]
    ]},

  { naam: '10-dial-in', duur: 13000, uitleg: 'Dial in: hendel om, timer loopt, kopje vult',
    stappen: [
      [0,    "beginBrew('espresso'); pickDiBean('b2'); renderDiJourney()"],
      [1500, "document.getElementById('di-clock-card').scrollIntoView({block:'center'})"],
      [2600, "e61Toggle()"]
    ]},

  { naam: '11-journey', duur: 6500, uitleg: 'de dial-in journey: de lijn wandelt de doelband in',
    stappen: [
      [0,    "beginBrew('espresso'); pickDiBean('b2'); renderDiJourney()"],
      [1400, "document.getElementById('di-journey-card').scrollIntoView({behavior:'smooth',block:'center'})"]
    ]},

  { naam: '13-the-pour', duur: 15000, uitleg: 'the pour: bloom, de klok loopt, stappen vinken af',
    stappen: [
      [0,    "openForm('v60'); pickBean('b1'); pourPickRecipe('hoffmann')"],
      [1200, "cardToggle('pour')"],
      [2400, "document.getElementById('pc-clock').scrollIntoView({block:'center'})"],
      [3300, "pourToggle()"]
    ]}
];

const wacht = ms => new Promise(r => setTimeout(r, ms));

/* ---- 1. frames opnemen ------------------------------------------------- */
async function neemFramesOp(page, shot, map) {
  fs.rmSync(map, { recursive: true, force: true });
  fs.mkdirSync(map, { recursive: true });
  const tijden = [];
  const stappen = shot.stappen.slice();
  const start = Date.now();
  let n = 0;

  while (Date.now() - start < shot.duur) {
    const t = Date.now() - start;
    while (stappen.length && stappen[0][0] <= t) {
      await page.evaluate(stappen.shift()[1]);
    }
    await page.screenshot({
      path: path.join(map, 'f' + String(n).padStart(4, '0') + '.jpg'),
      type: 'jpeg', quality: 88
    });
    tijden.push(Date.now() - start);
    n++;
  }
  return tijden;
}

/* ---- 2. de frames aan elkaar plakken tot webm --------------------------
   Canvas + MediaRecorder in een lege pagina. Welk frame wanneer getoond wordt
   volgt uit de opgenomen tijden, zodat de video op ware snelheid loopt ook al
   liep het screenshotten niet precies gelijkmatig.                          */
async function maakWebm(browser, shot, tijden, mapUrl, doel) {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 240 } });
  const page = await ctx.newPage();
  await page.goto(BASIS + '/docs/video/');

  const uit = await page.evaluate(async ({ tijden, mapUrl, fps, w, h, duur }) => {
    const laad = src => new Promise((res, rej) => {
      const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error(src)); i.src = src;
    });
    const beelden = [];
    for (let i = 0; i < tijden.length; i++) {
      beelden.push(await laad(mapUrl + '/f' + String(i).padStart(4, '0') + '.jpg'));
    }
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');

    const type = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
      .find(t => MediaRecorder.isTypeSupported(t));
    const stream = c.captureStream(0);
    const track = stream.getVideoTracks()[0];
    const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 6000000 });
    const stukken = [];
    rec.ondataavailable = e => { if (e.data.size) stukken.push(e.data); };
    rec.start();

    // MediaRecorder tijdstempelt op de wandklok: loopt deze lus achter, dan wordt
    // de video langzamer dan de opname. Daarom een deadline per frame in plaats van
    // een vaste pauze -- en achteraf meten of het gelukt is.
    const totaal = Math.round(duur / 1000 * fps);
    const t0 = performance.now();
    let k = 0, achter = 0;
    for (let f = 0; f < totaal; f++) {
      const doelT = f * 1000 / fps;
      while (k < tijden.length - 1 && tijden[k + 1] <= doelT) k++;
      x.drawImage(beelden[k], 0, 0, w, h);
      track.requestFrame();
      const rest = (t0 + (f + 1) * 1000 / fps) - performance.now();
      if (rest > 0) await new Promise(r => setTimeout(r, rest));
      else achter++;
    }
    const gemeten = performance.now() - t0;
    await new Promise(r => { rec.onstop = r; rec.stop(); });

    const buf = await new Blob(stukken, { type }).arrayBuffer();
    const bytes = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < bytes.length; i += 8192) {
      s += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    }
    return { b64: btoa(s), gemeten, achter, frames: totaal };
  }, { tijden, mapUrl, fps: FPS, w: VIDEO.width, h: VIDEO.height, duur: shot.duur });

  fs.writeFileSync(doel, Buffer.from(uit.b64, 'base64'));
  await ctx.close();
  return uit;
}

/* ---- opnemen ----------------------------------------------------------- */
async function main() {
  fs.mkdirSync(UIT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROOM });

  for (const shot of SHOTS) {
    const ctx = await browser.newContext({ viewport: VIDEO, deviceScaleFactor: 1 });
    // de handschrift-fonts lokaal serveren in plaats van bij Google
    await ctx.route('https://fonts.googleapis.com/**', r =>
      r.fulfill({ contentType: 'text/css', body: fs.readFileSync(FONTS, 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', r => r.abort());
    // .bind(window) is hier geen detail: zonder dat gooit de native setTimeout
    // "Illegal invocation" bij de eerste aanroep en blijft het scherm wit
    await ctx.addInitScript(() => {
      const echt = window.setTimeout.bind(window);
      window.setTimeout = (fn, ms, ...rest) =>
        (ms === 3000 ? echt(() => {}, 0) : echt(fn, ms, ...rest));
    });

    const page = await ctx.newPage();
    const fouten = [];
    page.on('pageerror', e => fouten.push(e.message));

    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForFunction(
      "typeof go === 'function' && typeof state === 'object' && state && state.methods",
      null, { timeout: 20000 });
    await page.evaluate(DEMO);
    await page.evaluate("try{applyFeatures()}catch(e){}");
    await page.evaluate(z => { document.documentElement.style.zoom = z; }, ZOOM);
    await wacht(500);

    const map = path.join(TIJDELIJK, shot.naam);
    const tijden = await neemFramesOp(page, shot, map);

    // controle achteraf: een wit scherm opnemen merk je anders pas in de montage
    const zicht = await page.evaluate(() => ({
      pagina: typeof currentPage === 'string' ? currentPage : '?',
      tekens: (document.querySelector('.phone')?.innerText || '').trim().length
    }));
    if (zicht.tekens < 60) fouten.push(`scherm lijkt leeg (${zicht.tekens} tekens)`);
    if (zicht.pagina === 'welcome') fouten.push('bleef op de splash hangen');
    await ctx.close();

    const doel = path.join(UIT, shot.naam + '.webm');
    const enc = await maakWebm(browser, shot, tijden,
                   BASIS + '/docs/video/opnames/_frames/' + shot.naam, doel);
    fs.rmSync(map, { recursive: true, force: true });

    const rek = enc.gemeten / shot.duur;
    if (rek > 1.12) fouten.push(`video ${rek.toFixed(2)}x te traag — verlaag FPS`);

    const kb = Math.round(fs.statSync(doel).size / 1024);
    const fps = (tijden.length / (shot.duur / 1000)).toFixed(1);
    console.log(`${shot.naam.padEnd(16)} ${String(kb).padStart(5)} kB  ` +
                `${(shot.duur/1000).toFixed(1)}s → ${(enc.gemeten/1000).toFixed(1)}s  ` +
                `${tijden.length} frames @ ${fps} fps  [${zicht.pagina}]  ${shot.uitleg}` +
                (fouten.length ? `\n   ⚠ ${fouten.join(' | ')}` : ''));
  }

  fs.rmSync(TIJDELIJK, { recursive: true, force: true });
  await browser.close();
  console.log('\nklaar — de opnames staan in docs/video/opnames/');
}

main().catch(e => { console.error(e); process.exit(1); });
