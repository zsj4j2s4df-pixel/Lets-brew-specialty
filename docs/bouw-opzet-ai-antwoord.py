# -*- coding: utf-8 -*-
"""Bouwt de mockup-body voor het bredere AI-antwoord in de coffee finder.

De kaart en de 119 streken komen uit index.html, niet overgetypt: dan is het
prototype gegarandeerd dezelfde wereld als de app. De AI-antwoorden zelf zijn
ingeblikt — een artifact mag niet naar buiten praten, dus wat je hier ziet is
precies wat de echte functie zou teruggeven, alleen van tevoren opgeschreven.
"""
import io, re

APP = '/home/user/Lets-brew-specialty/index.html'
UIT = '/home/user/Lets-brew-specialty/docs/opzet-ai-antwoord.html'
s = io.open(APP, encoding='utf-8').read()


def pak(start, eind):
    i = s.index(start); j = s.index(eind, i) + len(eind)
    return s[i:j]


DATA = '\n'.join([
    pak('const BP_LANDEN=', '\n];'),
    pak('const BP_ACHTER=', '\n];'),
    pak('const BP_INFO=', '\n};'),
    'const BP_REK=1.9;',
    'const bpX=lon=>lon, bpY=lat=>-lat*BP_REK;',
    'const BP_LAND=Object.fromEntries(BP_LANDEN.map(l=>[l.id,l]));',
])

BODY = r'''<style>
/* het prototype vult het scherm, zoals de app zelf */
body{padding:0;height:100dvh;overflow:hidden;}
.mk-wrap{max-width:430px;width:100%;margin:0;}
.phone{width:100%;max-width:430px;height:100dvh;border:none;border-radius:0;filter:none;}

.scherm{height:100%;overflow-y:auto;padding:0 20px 40px;}
.kop{display:flex;align-items:baseline;justify-content:space-between;padding:16px 0 4px;}
.kop .t{font-family:'Caveat',cursive;font-weight:700;font-size:33px;line-height:1;}
.terug{background:none;border:none;color:var(--ink-soft);font:inherit;font-size:16px;
  cursor:pointer;padding:4px 0;}
.uitklapper{display:flex;align-items:center;gap:8px;width:100%;text-align:left;
  background:none;border:none;padding:1px 2px 10px;font:inherit;font-size:16px;
  color:var(--ink-soft);cursor:pointer;}

/* ---- de zoekbalk ---- */
.zoekbak{position:relative;margin-bottom:9px;}
.zoekbak input{width:100%;background:var(--card);border:2px solid var(--line);
  border-radius:17px;filter:url(#wobble);padding:12px 44px 12px 14px;
  font:inherit;font-size:17px;color:var(--ink);}
.zoekbak input::placeholder{color:var(--ink-soft);opacity:.75;}
.zoekbak .wis{position:absolute;right:9px;top:8px;background:none;border:none;
  font:inherit;font-size:20px;color:var(--ink-soft);cursor:pointer;padding:2px 6px;}
.aivlag{display:flex;align-items:center;gap:8px;margin:0 2px 11px;font-size:15.5px;
  color:var(--ink-soft);}
.aivlag button{background:var(--card);border:2px solid var(--line);border-radius:20px;
  filter:url(#wobble);padding:3px 12px;font:inherit;font-size:15px;color:var(--ink);
  cursor:pointer;}
.aivlag button.aan{background:var(--accent-soft);color:var(--cream);border-color:var(--accent-soft);}

/* ---- de vragen die je kunt stellen ---- */
.vragenkop{font-size:12.5px;letter-spacing:.7px;text-transform:uppercase;
  color:var(--ink-soft);margin:4px 0 6px;}
.vraagknop{display:block;width:100%;text-align:left;background:none;
  border:1.5px dashed var(--line);border-radius:15px;padding:8px 13px;margin-bottom:7px;
  font:inherit;font-size:16px;color:var(--ink);cursor:pointer;}
.vraagknop em{font-style:normal;color:var(--ink-soft);font-size:14px;display:block;}

/* ---- de kaart ---- */
.kaartbak{background:var(--card-2);border:2px solid var(--line);border-radius:20px;
  filter:url(#wobble);padding:5px;margin-bottom:11px;position:relative;}
.kaartbak svg{display:block;width:100%;height:150px;}
.kaartbak .band{fill:var(--v60);opacity:.45;}
.kaartbak .achter{fill:var(--desk);stroke:var(--line);stroke-width:.7;opacity:.45;
  vector-effect:non-scaling-stroke;}
.kaartbak .land{fill:var(--desk);stroke:var(--line);stroke-width:.8;opacity:.4;
  vector-effect:non-scaling-stroke;transition:opacity .45s,fill .45s;}
.kaartbak .land.raak{fill:var(--accent-soft);stroke:var(--ink);stroke-width:1.6;opacity:1;}
.kaartbak .bij{position:absolute;left:0;right:0;bottom:2px;text-align:center;
  font-size:13px;color:var(--ink-soft);pointer-events:none;}
.kaartbak.stil .land{opacity:.28;}

/* ---- het antwoord ---- */
.soort{display:inline-block;background:var(--card-2);border:1.5px solid var(--line);
  border-radius:12px;padding:2px 9px;font-size:13px;color:var(--ink-soft);
  margin-bottom:7px;}
.zin{font-size:17.5px;line-height:1.45;margin-bottom:10px;}
.zin b{border-bottom:2px solid var(--line);font-weight:400;}
.uitleg{background:var(--card);border:2px dashed var(--line);border-radius:18px;
  padding:11px 14px;margin-bottom:11px;font-size:16px;line-height:1.5;}
.uitleg p{margin:0 0 8px;}
.uitleg p:last-child{margin:0;}
.res{display:block;width:100%;text-align:left;background:var(--card);
  border:2px solid var(--line);border-radius:19px;filter:url(#wobble);
  padding:11px 14px;margin-bottom:9px;font:inherit;color:var(--ink);cursor:pointer;}
.res .n{display:block;font-family:'Caveat',cursive;font-weight:700;font-size:23px;
  line-height:1.1;}
.res .l{display:block;color:var(--ink-soft);font-size:15px;}
.res .s{display:block;font-size:15px;margin-top:3px;}
.res .m{display:block;margin-top:5px;font-size:15px;color:var(--ink-soft);
  border-top:1.5px dashed var(--line);padding-top:5px;}
.vervolg{display:flex;flex-wrap:wrap;gap:7px;margin:2px 0 12px;}
.vervolg button{background:none;border:1.5px solid var(--line);border-radius:15px;
  padding:5px 11px;font:inherit;font-size:15px;color:var(--ink-soft);cursor:pointer;}
.doe{width:100%;background:var(--accent-soft);color:var(--cream);border:2px solid var(--ink);
  border-radius:18px;filter:url(#wobble);padding:12px;font-family:'Caveat',cursive;
  font-weight:700;font-size:23px;cursor:pointer;margin-bottom:10px;}
.doe.leeg{background:none;color:var(--ink);border-color:var(--line);}
.bezig{text-align:center;color:var(--ink-soft);font-size:16px;padding:16px 8px;}
.json{background:var(--paper);border:2px solid var(--line);border-radius:16px;
  padding:10px 12px;margin-bottom:12px;font-family:ui-monospace,Menlo,monospace;
  font-size:12.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word;
  color:var(--ink-soft);}
.voet{border-top:2px dashed var(--line);margin-top:6px;padding-top:10px;
  color:var(--ink-soft);font-size:15px;line-height:1.45;}
</style>

<div class="phone"><div class="scherm" id="scherm"></div></div>

<script>
/*DATA*/

/* ---------- de 119 streken, plat ---------- */
const STREEK = {};
Object.keys(BP_INFO).forEach(land => {
  const inf = BP_INFO[land], L = BP_LAND[land];
  if (!L) return;
  (inf.streken || []).forEach((st, i) => {
    STREEK[land + ':' + i] = {land, i, naam: st.n, landnaam: L.naam,
      h: st.h || inf.hoogte, s: st.s || []};
  });
});

/* ---------- wat de app al van je weet (in het echt uit je logboek) ---------- */
const IK = {
  plank: ['Apaneca-Ilamatepec (El Salvador)', 'Yirgacheffe (Ethiopië)'],
  gehad: ['elsalvador', 'ethiopie', 'brazilie', 'colombia'],
  hoogst: ['bloemig', 'fris fruit'],
  methode: 'filter',
};

/* ---------- de ingeblikte antwoorden ----------
   Precies de vorm die de echte functie teruggeeft: soort, zin, streken met een
   eigen reden, eventueel uitleg, en een paar vervolgvragen. */
const ANTWOORDEN = [
  {v: 'Welke boon is gelijkwaardig aan mijn oude El Salvador?',
   bij: 'vergelijken — hij kijkt op je eigen plank',
   a: {soort: 'kaart',
       zin: 'Je <b>Apaneca-Ilamatepec</b> was zoet en rond: karamel, rode appel, amandel, ' +
            'gewassen, rond 1500 m. Dit zijn de drie die daar het dichtst bij liggen — en ' +
            'bewust geen El Salvador.',
       streken: [
         ['honduras:0', 'zelfde hoogte, zelfde gewassen zoetheid: citrus, karamel, honing'],
         ['costarica:1', 'rode appel en karamel als in je oude zak; honey maakt hem iets ronder'],
         ['colombia:0', 'dezelfde kant op, met wat meer fruit erbij als je een stap wilt zetten']],
       vervolg: ['en welke daarvan is het minst zuur?', 'zet dit om in vijf stappen']}},

  {v: 'Wat is natural eigenlijk, en proef ik dat?',
   bij: 'een vraag — uitleg met de kaart erbij',
   a: {soort: 'uitleg',
       zin: 'Natural betekent dat de kers met vrucht en al om de boon heen droogt.',
       uitleg: ['Bij <b>washed</b> spoelt het vruchtvlees er meteen af: je proeft de streek zelf, ' +
                'schoon en rechtlijnig. Bij <b>natural</b> ligt de hele kers wekenlang te drogen ' +
                'en trekken die suikers de boon in.',
                'In de kop merk je dat als meer body, meer zoet, en fruit dat richting wijn of ' +
                'bessen gaat. Het zuur wordt er niet minder van, maar wel minder scherp omlijnd. ' +
                'Het is ook het risicovolste proces: gaat het drogen mis, dan smaakt het gegist.',
                'Op de zak staat het bij het proces. Staat er niets, dan is het meestal washed.'],
       streken: [
         ['ethiopie:3', 'het schoolvoorbeeld: bosbes en rode wijn, allemaal droog gedroogd'],
         ['brazilie:0', 'hier is bijna alles natural, maar dan chocolade en noot in plaats van fruit']],
       vervolg: ['laat me alleen washed zien', 'en wat is honey dan?']}},

  {v: 'Mijn Kenia smaakt zuur en dun. Wat doe ik fout?',
   bij: 'geen streekvraag — hij zoekt in je eigen brews',
   a: {soort: 'tekst',
       zin: 'Waarschijnlijk niets aan de boon — Kenia hóórt fel te zijn. <b>Dun</b> erbij wijst ' +
            'op onderextractie, niet op de zak.',
       uitleg: ['Je laatste drie V60’s met deze zak liepen in 2:35 tot 2:45 op 18 g. Dat is ' +
                'snel voor Kenia; je haalt het zoet er niet uit en dan blijft het zuur alleen over.',
                'Maal een stap fijner tot je rond 3:00 tot 3:15 uitkomt, en giet de bloom met wat ' +
                'meer water zodat het bed echt nat is. Blijft het dun, ga dan van 1:16 naar 1:15.'],
       streken: [],
       vervolg: ['zet dit om in een dial in', 'laat Kenia zien op de kaart']}},

  {v: 'Iets fruitigs onder de 15 euro, voor filter',
   bij: 'half te beantwoorden — en dat zegt hij ook',
   a: {soort: 'kaart',
       zin: 'De prijs weet ik niet: de app kent geen winkels of voorraad. Wat ik wél kan is ' +
            'fruitig én goed op filter, uit gebieden die breed geteeld worden — daar zit je ' +
            'zelden in de dure hoek.',
       streken: [
         ['ethiopie:2', 'bloemig en citroen, en veel breder te krijgen dan Yirgacheffe'],
         ['colombia:1', 'limoen en bloemig op grote hoogte, het hele jaar door te vinden'],
         ['honduras:1', 'perzik en abrikoos; Honduras is zelden een prijzige zak']],
       vervolg: ['alleen wat ik nog nooit had', 'zet dit om in vijf stappen']}},

  {v: 'Wat kan ik proberen dat ik nog nooit had?',
   bij: 'de kaart als antwoord — hij weet waar je al zat',
   a: {soort: 'kaart',
       zin: 'Op je plank stonden El Salvador, Ethiopië, Brazilië en Colombia. Deze drie liggen ' +
            'in een hoek waar je nog nooit was, en sluiten toch aan bij waar jij het hoogst ' +
            'scoorde: <b>bloemig</b> en <b>fris fruit</b>.',
       streken: [
         ['burundi:0', 'rode bes en jasmijn op 1600 m — dichtbij je Ethiopië, ander werelddeelhoekje'],
         ['malawi:0', 'citroen en zwarte thee; bijna niemand heeft dit ooit gehad'],
         ['panama:0', 'jasmijn en bergamot, de bloemigste kant van Midden-Amerika']],
       vervolg: ['welke is het makkelijkst te vinden?', 'zet dit om in vijf stappen']}},
];

/* ---------- stand ---------- */
let vraag = '', antwoord = null, bezig = false, jsonOpen = false;

function esc(t) { return String(t == null ? '' : t)
  .replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function kaartHTML(landen, stil, bij) {
  const set = new Set(landen || []);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  BP_LANDEN.forEach(l => l.pts.forEach(p => {
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
    sv += '<path class="land' + (set.has(l.id) ? ' raak' : '') + '" d="M' +
          l.pts.map(p => bpX(p[0]).toFixed(1) + ' ' + bpY(p[1]).toFixed(1)).join('L') + 'Z"/>';
  });
  return '<div class="kaartbak' + (stil ? ' stil' : '') + '">' + sv + '</svg>' +
         (bij ? '<div class="bij">' + esc(bij) + '</div>' : '') + '</div>';
}

function balkHTML() {
  return '<div class="zoekbak"><input id="veld" value="' + esc(vraag) + '" ' +
    'placeholder="vraag maar iets — of typ een smaakwoord" oninput="tik(this.value)">' +
    (vraag ? '<button class="wis" onclick="wis()">×</button>' : '') + '</div>' +
    '<div class="aivlag"><button class="aan">AI on</button>' +
    'typ een hele vraag en druk op enter</div>';
}

function jsonHTML(a) {
  const d = {soort: a.soort, zin: '…', streken: a.streken.map(x => ({streek: x[0], waarom: '…'})),
             vervolg: a.vervolg};
  return '<button class="uitklapper" onclick="jsonOpen=!jsonOpen;teken()">' +
    'wat de AI teruggaf<span>' + (jsonOpen ? '▾' : '▸') + '</span></button>' +
    (jsonOpen ? '<div class="json">' + esc(JSON.stringify(d, null, 1)) + '</div>' : '');
}

function antwoordHTML(a) {
  const landen = [...new Set(a.streken.map(x => x[0].split(':')[0]))];
  const label = {kaart: 'de kaart als antwoord', uitleg: 'uitleg, met de kaart erbij',
                 tekst: 'gewoon antwoord'}[a.soort];
  /* geen streken? dan ook geen kaart -- een leeg wereldbeeld van 150 px zegt niets */
  let h = landen.length
    ? kaartHTML(landen, false,
        landen.length === 1 ? '1 land aangewezen' : landen.length + ' landen aangewezen')
    : '';
  h += '<span class="soort">' + esc(label) + '</span>';
  h += '<div class="zin">' + a.zin + '</div>';
  if (a.uitleg) h += '<div class="uitleg">' + a.uitleg.map(p => '<p>' + p + '</p>').join('') + '</div>';
  a.streken.forEach(([sleutel, waarom]) => {
    const st = STREEK[sleutel];
    if (!st) return;
    h += '<button class="res" onclick="naar()"><span class="n">' + esc(st.naam) + '</span>' +
      '<span class="l">' + esc(st.landnaam) + ' · ' + esc(st.h) + '</span>' +
      '<span class="s">' + esc(st.s.join(' · ')) + '</span>' +
      '<span class="m">' + esc(waarom) + '</span></button>';
  });
  h += '<div class="vervolg">' + a.vervolg.map(v =>
    '<button onclick="stel(' + JSON.stringify(v).replace(/"/g, '&quot;') + ')">' +
    esc(v) + '</button>').join('') + '</div>';
  h += jsonHTML(a);
  h += '<button class="doe leeg" onclick="wis()">iets anders vragen</button>';
  return h;
}

function teken() {
  const el = document.getElementById('scherm');
  let h = '<div class="kop"><div class="t">Coffee finder</div>' +
          '<button class="terug" onclick="wis()">‹ beans</button></div>' + balkHTML();

  if (bezig) {
    h += '<div class="bezig">de AI leest je vraag…</div>';
  } else if (antwoord) {
    h += antwoordHTML(antwoord);
  } else {
    h += kaartHTML([], true, 'tik op een werelddeel om in te zoomen');
    h += '<div class="vragenkop">probeer eens</div>';
    ANTWOORDEN.forEach((x, i) => {
      h += '<button class="vraagknop" onclick="stel(null,' + i + ')">' + esc(x.v) +
           '<em>' + esc(x.bij) + '</em></button>';
    });
    h += '<div class="voet">Dit is een opzet, geen werkende AI: een artifact mag niet naar ' +
         'buiten praten, dus deze vijf antwoorden staan van tevoren klaar. In de app schrijft ' +
         'Claude ze zelf, met de 119 streken en jouw eigen plank als menu.</div>';
  }
  el.innerHTML = h;
}

function stel(tekst, i) {
  if (i == null) { i = ANTWOORDEN.findIndex(x => x.v === tekst); }
  vraag = ANTWOORDEN[i > -1 ? i : 0].v;
  bezig = true; antwoord = null; jsonOpen = false; teken();
  setTimeout(() => {
    bezig = false; antwoord = ANTWOORDEN[i > -1 ? i : 0].a; teken();
    document.getElementById('scherm').scrollTop = 0;
  }, 850);
}
function tik(v) { vraag = v; }
function wis() { vraag = ''; antwoord = null; bezig = false; teken(); }
function naar() { /* in de app zoomt dit de kaart naar die streek */ }

teken();
</script>
'''

io.open(UIT, 'w', encoding='utf-8').write(BODY.replace('/*DATA*/', DATA))
print(UIT)
