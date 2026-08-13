# -*- coding: utf-8 -*-
"""Bouwt de mockup-body voor de coffee finder-uitbreiding.

De kaartgegevens en de 119 streken worden uit index.html gehaald, niet
overgetypt: dan is het prototype gegarandeerd dezelfde wereld als de app.
"""
import io, re

APP = '/home/user/Lets-brew-specialty/index.html'
UIT = '/home/user/Lets-brew-specialty/docs/opzet-coffee-finder.html'
s = io.open(APP, encoding='utf-8').read()

def pak(start, eind):
    i = s.index(start); j = s.index(eind, i) + len(eind)
    return s[i:j]

BP_LANDEN = pak('const BP_LANDEN=', '\n];')
BP_ACHTER = pak('const BP_ACHTER=', '\n];')
BP_INFO   = pak('const BP_INFO=', '\n};')
BP_PROCES = pak('const BP_PROCES=', '\n};')

DATA = '\n'.join([BP_LANDEN, BP_ACHTER, BP_INFO, BP_PROCES,
                  'const BP_REK=1.9;',
                  'const bpX=lon=>lon, bpY=lat=>-lat*BP_REK;',
                  'const BP_LAND=Object.fromEntries(BP_LANDEN.map(l=>[l.id,l]));'])

BODY = r'''<style>
/* het prototype vult het scherm, zoals de app zelf */
body{padding:0;height:100dvh;overflow:hidden;}
.mk-wrap{max-width:430px;width:100%;margin:0;}
.phone{width:100%;max-width:430px;height:100dvh;border:none;border-radius:0;filter:none;}

.scherm{height:100%;display:flex;flex-direction:column;overflow-y:auto;padding:0 20px 90px;}
.kop{display:flex;align-items:baseline;justify-content:space-between;padding:16px 0 2px;}
.kop .t{font-family:'Caveat',cursive;font-weight:700;font-size:33px;line-height:1;}
.terug{background:none;border:none;color:var(--ink-soft);font:inherit;font-size:16px;
  cursor:pointer;padding:4px 0;}
.onder{color:var(--ink-soft);font-size:16.5px;margin-bottom:12px;}

/* ---- de zoekbalk ---- */
.zoekbak{position:relative;margin-bottom:9px;}
.zoekbak input{width:100%;background:var(--card);border:2px solid var(--line);
  border-radius:17px;filter:url(#wobble);padding:12px 44px 12px 14px;
  font:inherit;font-size:17px;color:var(--ink);}
.zoekbak input::placeholder{color:var(--ink-soft);opacity:.75;}
.zoekbak .wis{position:absolute;right:9px;top:8px;background:none;border:none;
  font:inherit;font-size:20px;color:var(--ink-soft);cursor:pointer;padding:2px 6px;}
.aivlag{display:flex;align-items:center;gap:8px;margin:0 2px 10px;font-size:15.5px;
  color:var(--ink-soft);}
.aivlag button{background:var(--card);border:2px solid var(--line);border-radius:20px;
  filter:url(#wobble);padding:3px 12px;font:inherit;font-size:15px;color:var(--ink);
  cursor:pointer;}
.aivlag button.aan{background:var(--accent-soft);color:var(--cream);border-color:var(--accent-soft);}
.tips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:12px;}
.tips button{background:none;border:1.5px solid var(--line);border-radius:14px;
  padding:4px 10px;font:inherit;font-size:15px;color:var(--ink-soft);cursor:pointer;}

/* ---- de kaart ---- */
.kaartbak{background:var(--card-2);border:2px solid var(--line);border-radius:20px;
  filter:url(#wobble);padding:5px;margin-bottom:11px;position:relative;}
.kaartbak svg{display:block;width:100%;height:150px;}
.kaartbak .band{fill:var(--v60);opacity:.45;}
.kaartbak .achter{fill:var(--desk);stroke:var(--line);stroke-width:.7;opacity:.45;
  vector-effect:non-scaling-stroke;}
.kaartbak .land{fill:var(--desk);stroke:var(--line);stroke-width:.8;opacity:.4;
  vector-effect:non-scaling-stroke;transition:opacity .35s,fill .35s;}
.kaartbak .land.raak{fill:var(--accent-soft);stroke:var(--ink);opacity:.9;}
.kaartbak .land.top{fill:var(--accent-soft);stroke:var(--ink);stroke-width:1.6;opacity:1;}
.kaartbak .bij{position:absolute;left:0;right:0;bottom:2px;text-align:center;
  font-size:13px;color:var(--ink-soft);pointer-events:none;}

/* ---- stappen ---- */
.balk{display:flex;gap:5px;margin:2px 0 14px;}
.balk i{flex:1;height:5px;border-radius:3px;background:var(--line);opacity:.5;}
.balk i.op{background:var(--accent-soft);opacity:1;}
.vraag{font-family:'Caveat',cursive;font-weight:700;font-size:29px;line-height:1.1;
  margin-bottom:3px;}
.waarom{color:var(--ink-soft);font-size:16px;margin-bottom:13px;}
.keuzes{display:flex;flex-direction:column;gap:9px;margin-bottom:14px;}
.keus{display:flex;align-items:flex-start;gap:11px;width:100%;text-align:left;
  background:var(--card);border:2px solid var(--line);border-radius:18px;
  filter:url(#wobble);padding:11px 14px;font:inherit;color:var(--ink);cursor:pointer;}
.keus.sel{background:var(--card-2);border-color:var(--ink);}
.keus .vink{flex:none;width:20px;font-size:18px;color:var(--accent-soft);}
.keus b{display:block;font-family:'Caveat',cursive;font-weight:700;font-size:22px;
  line-height:1.15;}
.keus span{color:var(--ink-soft);font-size:15.5px;line-height:1.32;}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
.chip{background:var(--card);border:2px solid var(--line);border-radius:16px;
  filter:url(#wobble);padding:7px 13px;font:inherit;font-size:16px;color:var(--ink);
  cursor:pointer;}
.chip.sel{background:var(--accent-soft);border-color:var(--accent-soft);color:var(--cream);}
.chip em{display:block;font-style:normal;font-size:13px;opacity:.75;}
.vooraf{background:var(--card);border:2px dashed var(--line);border-radius:16px;
  padding:9px 13px;margin-bottom:12px;color:var(--ink-soft);font-size:15.5px;}
.vooraf b{color:var(--ink);}

/* ---- knoppen ---- */
.doe{width:100%;background:var(--accent-soft);color:var(--cream);border:2px solid var(--ink);
  border-radius:18px;filter:url(#wobble);padding:14px;font-family:'Caveat',cursive;
  font-weight:700;font-size:25px;cursor:pointer;margin-top:2px;}
.doe.leeg{background:none;color:var(--ink);border-color:var(--line);}
.rij{display:flex;gap:9px;margin-top:10px;}
.rij .doe{margin-top:0;font-size:21px;padding:11px 8px;}

/* ---- resultaten ---- */
.res{background:var(--card);border:2px solid var(--line);border-radius:20px;
  filter:url(#wobble);padding:12px 15px;margin-bottom:10px;width:100%;text-align:left;
  font:inherit;color:var(--ink);cursor:pointer;display:block;}
.res .nr{float:right;font-family:'Caveat',cursive;font-weight:700;font-size:24px;
  color:var(--accent-soft);}
.res .n{display:block;font-family:'Caveat',cursive;font-weight:700;font-size:23px;
  line-height:1.1;}
.res .l{display:block;color:var(--ink-soft);font-size:15.5px;}
.res .s{font-size:15.5px;margin-top:4px;}
.res .m{margin-top:6px;font-size:15px;color:var(--ink-soft);border-top:1.5px dashed var(--line);
  padding-top:5px;}
.res.top1{border-width:3px;border-color:var(--ink);background:var(--card-2);}
.leeg-note{text-align:center;color:var(--ink-soft);font-size:16px;padding:18px 10px;}
.zak{border:2px dashed var(--line);border-radius:16px;padding:10px 13px;font-size:16px;
  line-height:1.6;margin:10px 0;}
.zak em{font-style:normal;color:var(--ink-soft);display:inline-block;width:84px;}
</style>

<div class="phone"><div class="scherm" id="scherm"></div></div>

<script>
/*DATA*/

/* ---------- de smaakwoorden uit de app op zeven families ----------
   De 119 streken gebruiken 57 losse woorden. Zonder ordening kun je er niet op
   filteren: 'chocolade', 'donkere chocolade' en 'cacao' zijn voor een zoeker
   hetzelfde. Deze tabel is de enige nieuwe gegevens die de functie nodig heeft. */
const FAM = {
  fris:   {n:'fris fruit',    u:'citrus en rood fruit',
           w:['sinaasappel','citroen','citrus','limoen','grapefruit','bergamot','zachte citrus',
              'rood fruit','rode bes','zwarte bes','aardbei','bosbes','blauwe bes','rode vruchten',
              'rode appel','appel','tomaat','tomaat-zoet']},
  steen:  {n:'steenfruit',    u:'perzik, pruim, tropisch',
           w:['perzik','abrikoos','pruim','tropisch fruit','rijp fruit','vijg','gedroogd fruit',
              'gedroogde vijg','rozijn','rode wijn','rum']},
  bloem:  {n:'bloemig & thee',u:'jasmijn, zwarte thee',
           w:['bloemig','jasmijn','zwarte thee']},
  zoet:   {n:'zoet & karamel',u:'honing, bruine suiker',
           w:['honing','bruine suiker','karamel','toffee']},
  choc:   {n:'chocolade',     u:'cacao tot donkere chocolade',
           w:['cacao','chocolade','donkere chocolade','melkchocolade','cacaonib']},
  noot:   {n:'nootachtig',    u:'amandel, hazelnoot',
           w:['noot','amandel','hazelnoot','macadamia','walnoot','pinda']},
  kruid:  {n:'kruidig & hout',u:'specerij, tabak, rook',
           w:['specerij','kaneel','kardemom','zwarte peper','kruidig','tabak','cederhout',
              'hout','rook','aarde']},
};
const FAMS = Object.keys(FAM);
const WOORD_FAM = {};
FAMS.forEach(f => FAM[f].w.forEach(w => { WOORD_FAM[w] = f; }));

/* hoe levendig smaakt een familie? 0 = rond en zacht, 1 = fel en helder */
const FAM_ZUUR = {fris:1, bloem:.9, steen:.6, zoet:.35, noot:.2, choc:.15, kruid:.3};

/* ---------- de 119 streken als één lijst ---------- */
const STREKEN = [];
Object.keys(BP_INFO).forEach(land => {
  const inf = BP_INFO[land], L = BP_LAND[land];
  if (!L) return;
  (inf.streken || []).forEach((st, i) => {
    const fams = [...new Set((st.s || []).map(w => WOORD_FAM[w]).filter(Boolean))];
    const h = (String(st.h || inf.hoogte).match(/\d+/g) || ['1500']).map(Number);
    const hoog = h.reduce((a, b) => a + b, 0) / h.length;
    let zuur = fams.length ? fams.reduce((a, f) => a + FAM_ZUUR[f], 0) / fams.length : .5;
    zuur = Math.max(0, Math.min(1, zuur * .7 + ((hoog - 900) / 1400) * .3));
    STREKEN.push({land, i, naam: st.n, landnaam: L.naam, deel: L.deel, h: st.h || inf.hoogte,
                  hoog, t: st.t, s: st.s || [], v: st.v || inf.var, proc: inf.proc,
                  fams, zuur});
  });
});

/* ---------- wat de app al van je weet (in het echt uit je logboek) ---------- */
const IK = {
  gehad: ['ethiopie', 'brazilie', 'colombia'],
  smaakIkScoorde: ['fris', 'bloem'],
  methode: 'filter',
};

/* ---------- de stand van de zoeker ---------- */
let scherm = 'home', stap = 0, zoek = '', ai = false;
const A = {meth: IK.methode, fams: [...IK.smaakIkScoorde], zuur: null, proc: 'egaal', avontuur: null};

const STAPPEN = [
  {sleutel: 'meth', vraag: 'Waar zet je hem op?',
   waarom: 'Dit bepaalt welke branding en welke streken passen — precies waar goede koffiezoekers mee beginnen.',
   soort: 'een', opties: [
     {v: 'filter', n: 'filter', u: 'V60, Chemex, Aeropress — helderheid en zuur mogen er zijn'},
     {v: 'espresso', n: 'espresso', u: 'onder druk: je wilt body, zoet en weinig scherpte'},
     {v: 'allebei', n: 'allebei', u: 'een zak die op allebei werkt'}]},
  {sleutel: 'fams', vraag: 'Welke kant op qua smaak?',
   waarom: 'Kies er één tot drie. Dit is de grofste zeef: hij haalt er meteen driekwart uit.',
   soort: 'chips'},
  {sleutel: 'zuur', vraag: 'Hoe fel mag het zuur?',
   waarom: 'Niet hoe donker de branding is, maar wat je in de kop proeft. Hoogte en proces bepalen dit het meest.',
   soort: 'een', opties: [
     {v: 'zacht', n: 'zacht en rond', u: 'laag zuur, veel body — chocolade en noot'},
     {v: 'balans', n: 'in balans', u: 'zoet met een randje, het veilige midden'},
     {v: 'fel', n: 'levendig en fel', u: 'citrus die prikt, thee-achtig, hoog gegroeid'}]},
  {sleutel: 'proc', vraag: 'Wat vind je spannend?',
   waarom: 'Het proces op de boerderij verandert de smaak meer dan welk land ook.',
   soort: 'een', opties: [
     {v: 'washed', n: 'washed', u: 'schoon en rechtlijnig — je proeft de streek zelf'},
     {v: 'natural', n: 'natural', u: 'de kers droogt om de boon: fruit, wijn, meer body'},
     {v: 'honey', n: 'honey', u: 'ertussenin — zoeter, zachter zuur'},
     {v: 'egaal', n: 'maakt niet uit', u: 'laat de smaak beslissen'}]},
  {sleutel: 'avontuur', vraag: 'Hoe ver van huis?',
   waarom: 'De app weet welke landen al op je plank stonden.',
   soort: 'een', opties: [
     {v: 'vertrouwd', n: 'houd het vertrouwd', u: 'een streek in een land dat je al kent'},
     {v: 'nieuw', n: 'iets nieuws', u: 'een land dat je nog niet had'},
     {v: 'verras', n: 'verras me', u: 'een werelddeel waar je nog nooit zat'}]},
];

/* ---------- de score ----------
   Elke regel hieronder is uit te leggen aan de gebruiker; daar staat of valt
   een keuzehulp mee. Wat niet uit te leggen is, telt niet mee. */
function scoreVan(st) {
  const r = [];
  let p = 0;
  const raak = st.fams.filter(f => A.fams.includes(f));
  if (A.fams.length) {
    p += raak.length * 3;
    if (raak.length) r.push(raak.map(f => FAM[f].n).join(' en ') + ' zit erin');
  }
  if (A.zuur) {
    const doel = A.zuur === 'zacht' ? .15 : A.zuur === 'balans' ? .5 : .85;
    const af = Math.abs(st.zuur - doel);
    p += (1 - af) * 3;
    if (af < .18) r.push(A.zuur === 'fel' ? 'hoog gegroeid en levendig'
                       : A.zuur === 'zacht' ? 'rond, weinig zuur' : 'mooi in balans');
  }
  if (A.proc !== 'egaal') {
    if (st.proc.includes(A.proc)) { p += 2; r.push(A.proc + ' komt hier vandaan'); }
    else p -= 2;
  }
  if (A.meth === 'espresso') { p += (1 - st.zuur) * 2; }
  else if (A.meth === 'filter') { p += st.zuur * 2; }
  const had = IK.gehad.includes(st.land);
  if (A.avontuur === 'vertrouwd') { p += had ? 2 : -1; if (had) r.push('een land dat je al kent'); }
  if (A.avontuur === 'nieuw') { p += had ? -2 : 2; if (!had) r.push('nog nooit op je plank gehad'); }
  if (A.avontuur === 'verras') {
    const delen = new Set(IK.gehad.map(l => (BP_LAND[l] || {}).deel));
    p += delen.has(st.deel) ? -2 : 3;
    if (!delen.has(st.deel)) r.push('een werelddeel waar je nog nooit zat');
  }
  return {p, r};
}

function ranglijst() {
  return STREKEN.map(st => ({st, ...scoreVan(st)}))
                .sort((a, b) => b.p - a.p);
}
function overGebleven() {
  if (!A.fams.length) return STREKEN.length;
  return STREKEN.filter(st => st.fams.some(f => A.fams.includes(f))).length;
}

/* ---------- de zoekbalk zonder AI ----------
   Kijkt in alles wat de app al heeft staan: landnamen, streeknamen, smaakwoorden
   (met de familie als synoniem), processen, variëteiten en hoogtes. */
function zoekLokaal(q) {
  const t = q.toLowerCase().trim();
  if (!t) return [];
  const hoogte = (t.match(/boven\s*(\d{3,4})|(\d{3,4})\s*m\+/) || []).filter(Boolean)[1];
  // woorden van één of twee letters slaan we over: een losse "m" zit in bijna
  // elke beschrijving en maakt de uitslag waardeloos
  const woorden = t.split(/[\s,]+/).filter(w => w.length > 2 && !/^\d+$/.test(w) && w !== 'boven');
  if (!woorden.length && !hoogte) return [];
  return STREKEN.map(st => {
    let p = 0; const r = []; let allemaal = true;
    woorden.forEach(w => {
      let q = 0;
      if (st.landnaam.toLowerCase().includes(w)) { q += 5; r.push('land'); }
      if (st.naam.toLowerCase().includes(w)) { q += 6; r.push('streek'); }
      if (st.s.some(x => x.toLowerCase().includes(w))) { q += 4; r.push('smaak'); }
      const fam = FAMS.find(f => FAM[f].n.toLowerCase().includes(w));
      if (fam && st.fams.includes(fam)) { q += 4; r.push('smaakfamilie'); }
      if (st.proc.some(x => x.includes(w))) { q += 3; r.push('proces'); }
      if ((st.v || '').toLowerCase().includes(w)) { q += 3; r.push('variëteit'); }
      if (!q && st.t.toLowerCase().includes(w)) { q += 1; r.push('beschrijving'); }
      if (!q) allemaal = false;
      p += q;
    });
    // elk woord moet ergens raken: "natural ethiopië" is een eis, geen wens
    if (!allemaal) return {st, p: 0, r: []};
    if (hoogte) {
      if (st.hoog >= +hoogte) { p += 3; r.push('hoogte'); }
      else return {st, p: 0, r: []};
    }
    return {st, p, r: [...new Set(r)]};
  }).filter(x => x.p > 0).sort((a, b) => b.p - a.p);
}

/* wat de AI eruit haalt: hij vult alleen de filters in, het antwoord komt uit
   dezelfde 119 streken. In dit prototype is dat nagebootst met een paar zinnen. */
const AI_VOORBEELD = {
  'iets fruitigs voor filter dat niet te zuur is': {fams: ['steen', 'fris'], zuur: 'balans', meth: 'filter'},
  'zoiets als de kirinyaga die ik lekker vond':    {fams: ['fris', 'bloem'], zuur: 'fel', meth: 'filter'},
  'een zoete espresso zonder scherpte':            {fams: ['choc', 'zoet', 'noot'], zuur: 'zacht', meth: 'espresso'},
};

/* ---------- de kaart ---------- */
function kaart(raken, toppen) {
  const set = new Set(raken || []), top = new Set(toppen || []);
  const alle = BP_LANDEN.concat();
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  alle.forEach(l => l.pts.forEach(p => {
    const x = bpX(p[0]), y = bpY(p[1]);
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }));
  const m = 8, vb = [x0 - m, y0 - m, (x1 - x0) + m * 2, (y1 - y0) + m * 2];
  let sv = '<svg viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid meet">';
  sv += '<rect class="band" x="-200" y="' + bpY(23.5) + '" width="500" height="' +
        (bpY(-23.5) - bpY(23.5)) + '"/>';
  BP_ACHTER.forEach(pl => {
    sv += '<path class="achter" d="M' + pl.map(q => bpX(q[0]).toFixed(1) + ' ' +
          bpY(q[1]).toFixed(1)).join('L') + 'Z"/>';
  });
  BP_LANDEN.forEach(l => {
    const k = top.has(l.id) ? ' top' : set.has(l.id) ? ' raak' : '';
    sv += '<path class="land' + k + '" d="M' + l.pts.map(p => bpX(p[0]).toFixed(1) + ' ' +
          bpY(p[1]).toFixed(1)).join('L') + 'Z"/>';
  });
  return sv + '</svg>';
}
function kaartbak(raken, toppen, bij) {
  return '<div class="kaartbak">' + kaart(raken, toppen) +
         (bij ? '<div class="bij">' + bij + '</div>' : '') + '</div>';
}

/* ---------- de schermen ---------- */
function teken() {
  const el = document.getElementById('scherm');
  el.innerHTML = scherm === 'home' ? homeHTML()
               : scherm === 'zoek' ? zoekHTML()
               : scherm === 'stap' ? stapHTML()
               : topHTML();
  el.scrollTop = 0;
  const inp = document.getElementById('zoekveld');
  if (inp && scherm === 'zoek') { inp.focus(); inp.setSelectionRange(zoek.length, zoek.length); }
}

function zoekbalkHTML() {
  return '<div class="zoekbak"><input id="zoekveld" value="' + esc(zoek) +
    '" placeholder="' + (ai ? 'beschrijf wat je zoekt…' : 'land, streek, smaak, proces…') +
    '" oninput="zoek=this.value;if(scherm!==\'zoek\'){scherm=\'zoek\';teken();}else{lijstBij();}">' +
    (zoek ? '<button class="wis" onclick="zoek=\'\';teken()">×</button>' : '') + '</div>' +
    '<div class="aivlag"><button class="' + (ai ? 'aan' : '') + '" onclick="ai=!ai;teken()">' +
    (ai ? 'AI aan' : 'AI uit') + '</button>' +
    (ai ? 'typ een hele zin — de AI zet hem om in filters'
        : 'zoekt in de 119 streken, ook zonder internet') + '</div>';
}

function homeHTML() {
  const gehad = IK.gehad;
  return '<div class="kop"><span class="t">coffee finder</span>' +
    '<button class="terug">‹ beans</button></div>' +
    '<div class="onder">42 landen, 119 streken. Zoek gericht, of laat je in vijf stappen naar drie zakken leiden.</div>' +
    zoekbalkHTML() +
    '<div class="tips">' + ['bloemig', 'natural ethiopië', 'SL28', 'boven 1800 m']
      .map(t => '<button onclick="zoek=\'' + t + '\';scherm=\'zoek\';teken()">' + t + '</button>').join('') +
    '</div>' +
    kaartbak(gehad, [], 'de landen die je al had') +
    '<button class="doe" onclick="scherm=\'stap\';stap=0;teken()">vind mijn zak — 5 stappen ›</button>' +
    '<div class="vooraf" style="margin-top:12px">De vijf stappen beginnen niet leeg: de app vult ze ' +
    'vooraf in met <b>wat je zelf al zette</b> — je methodes, en de smaken waar jij de hoogste ' +
    'cijfers aan gaf. Je hoeft alleen te corrigeren.</div>';
}

function zoekHTML() {
  const uit = ai ? aiUit() : null;
  const rij = zoekLokaal(uit ? uit.q : zoek);
  const raken = [...new Set(rij.slice(0, 12).map(x => x.st.land))];
  return '<div class="kop"><span class="t">zoeken</span>' +
    '<button class="terug" onclick="scherm=\'home\';teken()">‹ terug</button></div>' +
    zoekbalkHTML() +
    (uit ? '<div class="vooraf">De AI las: <b>' + uit.tekst + '</b>. Meer doet hij niet — ' +
      'de streken hieronder komen uit de app zelf, niet uit het model.</div>' : '') +
    kaartbak(raken, [], rij.length ? rij.length + ' streken gevonden' : '') +
    '<div id="lijst">' + lijstHTML(rij) + '</div>';
}
function lijstBij() {
  const el = document.getElementById('lijst');
  if (el) el.innerHTML = lijstHTML(zoekLokaal(zoek));
}
function lijstHTML(rij) {
  if (!zoek.trim()) return '<div class="leeg-note">Typ een land, een streek, een smaak, ' +
    'een proces of een variëteit. Ook "boven 1800 m" werkt.</div>';
  if (!rij.length) return '<div class="leeg-note">Niets gevonden. Probeer een smaakwoord ' +
    'zoals <b>jasmijn</b> of <b>cacao</b>.</div>';
  return rij.slice(0, 14).map(x =>
    '<button class="res"><span class="n">' + esc(x.st.naam) + '</span>' +
    '<span class="l">' + esc(x.st.landnaam) + ' · ' + esc(x.st.h) + '</span>' +
    '<div class="s">' + esc(x.st.s.join(' · ')) + '</div>' +
    '<div class="m">raak op ' + x.r.join(', ') + '</div></button>').join('');
}
function aiUit() {
  const t = zoek.toLowerCase().trim();
  const sleutel = Object.keys(AI_VOORBEELD).find(k => k.startsWith(t.slice(0, 12)) && t.length > 8);
  if (!sleutel) return null;
  const v = AI_VOORBEELD[sleutel];
  return {q: v.fams.map(f => FAM[f].w[0]).join(' '),
          tekst: v.fams.map(f => FAM[f].n).join(' + ') + ', ' + v.zuur + ' zuur, ' + v.meth};
}

function stapHTML() {
  const S = STAPPEN[stap];
  const over = overGebleven();
  const rij = ranglijst();
  const raken = [...new Set(rij.slice(0, 18).map(x => x.st.land))];
  let keuze = '';
  if (S.soort === 'chips') {
    keuze = '<div class="chips">' + FAMS.map(f =>
      '<button class="chip' + (A.fams.includes(f) ? ' sel' : '') + '" onclick="kiesFam(\'' + f + '\')">' +
      FAM[f].n + '<em>' + FAM[f].u + '</em></button>').join('') + '</div>';
  } else {
    keuze = '<div class="keuzes">' + S.opties.map(o =>
      '<button class="keus' + (A[S.sleutel] === o.v ? ' sel' : '') + '" onclick="kies(\'' +
      S.sleutel + '\',\'' + o.v + '\')"><span class="vink">' +
      (A[S.sleutel] === o.v ? '✓' : '○') + '</span><span><b>' + o.n + '</b><span>' + o.u +
      '</span></span></button>').join('') + '</div>';
  }
  const voor = (stap === 0 && A.meth === IK.methode) ? 'je zet meestal filter'
             : (stap === 1 && A.fams.join() === IK.smaakIkScoorde.join()) ?
               'hier scoorde jij het hoogst in je eigen brews' : '';
  return '<div class="kop"><span class="t">stap ' + (stap + 1) + ' van 5</span>' +
    '<button class="terug" onclick="' + (stap ? 'stap--;teken()' : 'scherm=\'home\';teken()') +
    '">‹ terug</button></div>' +
    '<div class="balk">' + STAPPEN.map((_, i) =>
      '<i class="' + (i <= stap ? 'op' : '') + '"></i>').join('') + '</div>' +
    kaartbak(raken, [], over + ' van de 119 streken passen nog') +
    '<div class="vraag">' + S.vraag + '</div>' +
    '<div class="waarom">' + S.waarom + '</div>' +
    (voor ? '<div class="vooraf">alvast ingevuld: <b>' + voor + '</b> — verander gerust</div>' : '') +
    keuze +
    '<button class="doe" onclick="verder()">' +
    (stap === 4 ? 'toon mijn top 3 ›' : 'volgende ›') + '</button>';
}

function topHTML() {
  const rij = ranglijst().slice(0, 3);
  const landen = rij.map(x => x.st.land);
  return '<div class="kop"><span class="t">jouw top 3</span>' +
    '<button class="terug" onclick="scherm=\'stap\';stap=4;teken()">‹ stappen</button></div>' +
    '<div class="onder">Uit 119 streken, op wat je net koos.</div>' +
    kaartbak(landen, landen, 'daar komen ze vandaan') +
    rij.map((x, i) =>
      '<div class="res' + (i ? '' : ' top1') + '"><span class="nr">' + (i + 1) + '</span>' +
      '<span class="n">' + esc(x.st.naam) + '</span>' +
      '<span class="l">' + esc(x.st.landnaam) + ' · ' + esc(x.st.h) + '</span>' +
      '<div class="s">' + esc(x.st.s.join(' · ')) + '</div>' +
      '<div class="m">' + (x.r.slice(0, 3).join(' · ') || 'past het dichtst bij je antwoorden') +
      '</div>' + (i ? '' :
        '<div class="zak"><em>land</em>' + esc(x.st.landnaam) + '<br>' +
        '<em>streek</em>' + esc(x.st.naam) + '<br>' +
        '<em>proces</em>' + esc(A.proc === 'egaal' ? x.st.proc[0] : A.proc) + '<br>' +
        '<em>variëteit</em>' + esc(x.st.v) + '<br>' +
        '<em>gebrand</em>korter dan 3 weken geleden</div>' +
        '<div class="rij"><button class="doe">zet op mijn lijstje</button>' +
        '<button class="doe leeg">zoek via Google</button></div>') +
      '</div>').join('') +
    '<button class="doe leeg" style="margin-top:6px" onclick="scherm=\'stap\';stap=1;teken()">' +
    'iets anders proberen</button>';
}

function kies(s, v) { A[s] = v; teken(); }
function kiesFam(f) {
  const i = A.fams.indexOf(f);
  if (i >= 0) A.fams.splice(i, 1);
  else if (A.fams.length < 3) A.fams.push(f);
  teken();
}
function verder() { if (stap < 4) { stap++; teken(); } else { scherm = 'top'; teken(); } }
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g,
  c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c])); }

teken();
</script>
'''

io.open(UIT, 'w', encoding='utf-8').write(BODY.replace('/*DATA*/', DATA))
print('geschreven', UIT, len(BODY) + len(DATA), 'tekens')
