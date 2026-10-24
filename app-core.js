/* ---------------- data + opslag ---------------- */
const BREW_GUIDES={
  espresso:{ratio:'1:2',recept:'18 g in · ~36 g uit · 25–30 sec · ~93°C',grind:'fijn (als poedersuiker)',
    steps:['Weeg 18 g vers gemalen koffie in een schone, droge portafilter.',
      'Verdeel het maalsel gelijkmatig (WDT/naaldje) zodat het overal even dicht zit.',
      'Tamp recht en gelijkmatig, oppervlak waterpas.',
      'Spoel kort de groepskop en plaats de portafilter.',
      'Start de shot en de timer; mik op ~36 g uit in 25–30 sec.',
      'Te snel & zuur → maal fijner. Te traag & bitter → maal grover.'],
    tip:'Verander één ding tegelijk (maling, dose of yield), anders weet je niet wat werkte.'},
  aeropress:{ratio:'1:14',recept:'15–17 g · 230–250 g water · ~85–90°C · ~1:30 totaal',grind:'medium-fijn',
    steps:['Kook water en laat het even afkoelen tot ~85–90°C.',
      'Plaats een filter in de dop, spoel het met heet water (tegen papiersmaak).',
      'Doe 15–17 g koffie in de AeroPress en zet op je kop/kan.',
      'Start de timer, giet ~50 g water op, roer 10 sec en laat 30 sec bloeien.',
      'Vul aan tot 230–250 g, deksel erop, laat tot ~1:00 staan.',
      'Druk rustig in 30–45 sec; stop zodra je een sis hoort (laatste laag niet doorpersen).'],
    tip:'Inverted methode (omgekeerd) geeft meer controle en een vollere kop — populair op het WK.'},
  v60:{ratio:'1:16',recept:'15 g · 250 g water · 92–94°C · 2:30–3:00',grind:'medium (als fijn zand)',
    steps:['Kook water en laat afkoelen tot 92–94°C; verwarm server en mok voor.',
      'Vouw het filter, plaats in de V60 en spoel goed met heet water.',
      'Doe 15 g koffie erin, schud vlak, zet op 0 (tarra).',
      'Bloom: giet ~45–50 g water in cirkels, laat 30–45 sec bloeien.',
      'Giet in rustige cirkels bij tot 250 g, in 2–3 gietbeurten; vermijd de filterrand.',
      'Totale tijd 2:30–3:00. Sneller? Maal fijner. Trager dan 3:30? Maal grover.'],
    tip:'Geeft een heldere, frisse kop — ideaal voor lichtgebrande single origins.'},
  chemex:{ratio:'1:16',recept:'30 g · 500 g water · ~95°C · 3:30–4:30',grind:'medium-grof',
    steps:['Kook water (~95°C). Vouw het dikke Chemex-filter (3 lagen naar de tuit).',
      'Spoel het filter royaal met heet water en giet dat weg.',
      'Doe 30 g koffie erin, schud vlak, zet op 0 (tarra).',
      'Bloom: giet ~60 g water op, laat 30–45 sec bloeien.',
      'Giet in rustige cirkels bij tot 500 g; vul telkens aan als het niveau zakt.',
      'Totale tijd 3:30–4:30. Het dikke filter geeft een heel schone, heldere kop.'],
    tip:'Het dikkere filter houdt meer oliën tegen — schoner en met nadruk op zuren.'},
  perculator:{ratio:'1:12',recept:'grof gemalen · vol mondgevoel · let op overextractie',grind:'grof',
    steps:['Vul het onderste reservoir met water tot net onder het ventiel.',
      'Doe grof gemalen koffie in de filterbak (ca. 1:12 koffie:water).',
      'Zet op middelhoog vuur; laat het water opstijgen en circuleren.',
      'Laat 5–7 minuten percoleren zodra het pruttelt — niet langer.',
      'Haal direct van het vuur; lange hitte = bitter (overextractie).',
      'Schenk uit en proef; korter percoleren of grover malen tegen bitterheid.'],
    tip:'Intens en vol, bijna espresso-achtig van textuur — maar hou de tijd kort.'},
  coldbrew:{ratio:'1:8 concentraat',recept:'grof gemalen · 12–24 u koud trekken',grind:'grof',
    steps:['Maal grof (als die voor French press).',
      'Meng koffie en koud, gefilterd water (ca. 1:8 voor concentraat).',
      'Roer goed door zodat alles nat is.',
      'Laat 12–24 uur trekken op kamertemperatuur of in de koelkast.',
      'Zeef door een filter; bewaar het concentraat in de koelkast.',
      'Verdun naar smaak met water of melk, en ijs.'],
    tip:'Laag in zuren, zacht en zoet. Concentraat blijft enkele dagen goed.'}
};
function guideFor(methodId){
  if(BREW_GUIDES[methodId])return BREW_GUIDES[methodId];
  const n=(methodById(methodId).name||'').toLowerCase();
  for(const k in BREW_GUIDES){if(n.includes(k))return BREW_GUIDES[k];}
  return null;
}
const DEFAULT_METHODS=[
  {id:'espresso',name:'espresso',glyph:'☕',img:'m-espresso.png',tint:'--espresso',on:true,family:'espresso'},
  {id:'aeropress',name:'aeropress',glyph:'⬗',img:'m-aeropress.png',tint:'--aeropress',on:true,family:'filter'},
  {id:'v60',name:'v60',glyph:'◭',img:'m-v60.png',tint:'--v60',on:true,family:'filter'},
  {id:'chemex',name:'chemex',glyph:'⧖',img:'m-chemex.png',tint:'--chemex',on:true,family:'filter'},
  {id:'perculator',name:'moka pot',glyph:'🫖',img:'m-mokkapot.png',tint:'--perculator',on:true,family:'filter'},
  {id:'senseo',name:'senseo',glyph:'⬗',img:'m-senseo.png',tint:'--espresso',on:true,family:'filter'},
];
// bekende familie per standaard-methode (voor migratie van bestaande gebruikers)
const METHOD_FAMILY_DEFAULTS={espresso:'espresso',perculator:'filter',senseo:'filter',aeropress:'filter',v60:'filter',chemex:'filter',coldbrew:'filter'};
// standaard puck-prep-lijst voor espresso (persoonlijk, zelf te beheren). unit -> waarde-veld
const DEFAULT_PREP=[{id:'wdt',name:'WDT'},{id:'puckscreen',name:'puckscreen'},{id:'preinf',name:'pre-infusion',unit:'s'},{id:'temp',name:'water temp',unit:'°C'}];
// vaste dial-in-regels die de AI overal meekrijgt bij espresso-maling (voorkomt omgekeerde adviezen)
const ESPRESSO_RULES=
  'ESPRESSO DIAL-IN REGELS (niet omkeren):\n'+
  '- FIJNER malen = meer weerstand = LANGZAMER doorloop = MINDER opbrengst per seconde.\n'+
  '- GROVER malen = minder weerstand = SNELLER doorloop = MEER opbrengst per seconde.\n'+
  '- Beoordeel met de doorloopsnelheid = opbrengst(g) ÷ tijd(s), vergeleken met het doel (doelopbrengst ÷ doeltijd) — niet met de tijd alleen.\n'+
  '- Te weinig opbrengst voor de tijd / choking / te traag → GROVER malen.\n'+
  '- Te veel of te snelle opbrengst / waterig / te snel → FIJNER malen.\n'+
  '- Verander één ding tegelijk (de maling); houd dose, temperatuur en puck-prep gelijk.\n'+
  '- Versheid telt mee. Vers gebrande bonen (0-6 dagen) zitten vol CO2; dat gas remt het water, de shot loopt trager en schuimt -> iets GROVER en laat ze eerst rusten.\n'+
  '- Tussen ongeveer 7 en 21 dagen is de boon stabiel; dan hoef je niet voor versheid te corrigeren.\n'+
  '- Vanaf ongeveer 25 dagen is het CO2 grotendeels weg en is de boon brozer; de puck geeft minder weerstand en de shot loopt sneller -> iets FIJNER.\n'+
  '- Corrigeer nooit voor versheid tegen de gemeten doorloopsnelheid in: wat je werkelijk meet gaat voor.';
/* ---------------- waar je maalstand begint ----------------
   Drie dingen op de zak zeggen samen al veel over hoe snel een boon oplost, en
   dus of je fijner of grover moet beginnen dan bij je vorige zak:

   - BRANDING weegt het zwaarst. Donkerder branden maakt de boon brozer en beter
     oplosbaar: hij loopt sneller door, dus grover. Licht gebrand is dichter en
     trager: fijner, en warmer zetten.
   - PROCES verandert de celstructuur. Een natural droogt met vrucht en al en
     houdt een zwakkere structuur over: die extraheert het snelst, dus grover.
     Washed houdt de stevigste structuur en loopt het traagst: fijner. Honey en
     pulped natural zitten ertussenin.
   - HOOGTE staat voor dichtheid. Boven ongeveer 1800 m groeit de boon langzamer
     en wordt hij harder: trager, dus fijner. Onder de 1100 m juist zachter.

   Decaf is een geval apart: het ontcafeïneren tast de celstructuur aan, de boon
   is brozer en geeft meer fijn stof. De praktijk is verdeeld over de richting,
   dus daar zeggen we: opnieuw afstellen in plaats van doorrekenen.

   Alles wordt uitgedrukt in "stappen fijner" (positief) of grover (negatief).
   Het is een startpunt, geen voorspelling — wat je meet gaat altijd voor.     */
function altitudeOf(b){
  const m=(''+(b&&b.altitude||'')).match(/\d{3,4}/g);
  if(!m||!m.length)return null;
  const g=m.map(Number).filter(x=>x>=300&&x<=3000);
  if(!g.length)return null;
  return Math.round(g.reduce((a,c)=>a+c,0)/g.length);
}
function isDecaf(b){
  return /decaf|deca|cafe.?nevrij|caffeine.?free|zonder cafe/i.test(
    [b&&b.name,b&&b.roasternotes,b&&b.notes,b&&b.process].filter(Boolean).join(' '));
}
// hoe traag lost deze boon op? hoger = dichter = fijner malen
function beanDensity(b){
  if(!b)return {score:0,redenen:[]};
  const redenen=[];let score=0;
  const ri=ROAST_LEVELS.indexOf(b.roast||'');
  if(ri>=0){
    const bij=(2-ri)*0.9;                       // light +1.8 ... dark -1.8
    score+=bij;
    if(ri<=1)redenen.push('licht gebrand: dichter en trager oplosbaar');
    else if(ri>=3)redenen.push('donker gebrand: brozer en beter oplosbaar');
  }
  const proc=(b.process||'').toLowerCase();
  if(/natural|dry|anaerob|carbonic/.test(proc)){score-=0.7;redenen.push('natural: zwakkere celstructuur, loopt sneller door');}
  else if(/honey|pulped|semi/.test(proc)){score-=0.3;redenen.push('honey: zit tussen natural en washed in');}
  else if(/washed|wet/.test(proc)){score+=0.4;redenen.push('washed: stevigste structuur, loopt het traagst');}
  const alt=altitudeOf(b);
  if(alt!=null){
    if(alt>=1800){score+=0.6;redenen.push(alt+' m: harde, dichte boon');}
    else if(alt>=1400){score+=0.3;}
    else if(alt<1100){score-=0.4;redenen.push(alt+' m: zachtere boon');}
  }
  return {score,redenen,decaf:isDecaf(b)};
}
// wat is er voor deze boon vastgelegd? per methode, of alles op een rij
function beanDial(bean,methodId){
  const d=bean&&bean.dialed;
  if(!d||typeof d!=='object')return null;
  if(methodId)return (d[methodId]&&d[methodId].grind)?Object.assign({method:methodId},d[methodId]):null;
  const alle=Object.keys(d).filter(k=>d[k]&&d[k].grind)
    .map(k=>Object.assign({method:k},d[k])).sort((a,b)=>(b.ts||0)-(a.ts||0));
  return alle.length?alle:null;
}
// hoe verhoudt de ene methode zich tot de andere? binnen dezelfde familie zit je
// in dezelfde orde van grootte; espresso is en blijft de fijnste kant
function dialOverstap(van,naar){
  const fv=methodFamily(van), fn=methodFamily(naar);
  if(fv===fn)return null;
  return fn==='espresso'?'duidelijk fijner':'duidelijk grover';
}
// "18 g -> 36 g in 0:28", voor de kaart en voor de prompt
function dialCijfers(d){
  const stuk=[];
  if(d.dose&&d.yield)stuk.push(d.dose+' g \u2192 '+d.yield+' g');
  else if(d.dose)stuk.push(d.dose+' g');
  if(d.time)stuk.push(d.time);
  return stuk.join(' in ');
}
/* Het startpunt. Eerst kijken of je zoiets al eens gezet hebt op deze methode;
   dat is jouw molen op jouw machine en verslaat elke vuistregel. Anders reken
   we het verschil met je laatste zak om in stappen.                          */
function grindStart(bean,methodId){
  if(!bean||!methodId)return null;
  const eerder=state.brews.filter(x=>x.method===methodId&&x.grind&&x.beanId)
    .sort((a,b)=>b.ts-a.ts);
  const bonenVan=id=>state.beans.find(y=>y.id===id);
  const zelfde=eerder.find(x=>{
    const o=bonenVan(x.beanId);if(!o||o.id===bean.id)return false;
    return (o.process||'').toLowerCase().slice(0,4)===(bean.process||'').toLowerCase().slice(0,4)
      && (o.roast||'')===(bean.roast||'') && (o.roast||bean.roast);
  });
  const eigen=eerder.find(x=>x.beanId===bean.id);
  const laatste=eerder[0];
  const d=beanDensity(bean);
  // een dial die je zelf hebt afgetekend gaat voor alles
  const vast=beanDial(bean,methodId);
  if(vast)return {stand:vast.grind,bron:'vastgelegd',cijfers:dialCijfers(vast),decaf:d.decaf,
    waarom:['hier stond hij goed op '+vast.grind]};
  // op een andere methode wel afgetekend? dan is dat je ankerpunt
  const anders=beanDial(bean,null);
  if(anders&&anders.length){
    const a=anders[0];
    return {stand:a.grind,bron:'andere methode',vanaf:(methodById(a.method)||{}).name||a.method,
      stap:dialOverstap(a.method,methodId),cijfers:dialCijfers(a),decaf:d.decaf,waarom:[]};
  }
  if(eigen)return {stand:eigen.grind,bron:'deze boon',
    waarom:['je zette hem eerder op '+eigen.grind],decaf:d.decaf};
  if(zelfde){
    const o=bonenVan(zelfde.beanId);
    return {stand:zelfde.grind,bron:'zelfde soort',
      waarom:['je '+[o.roast,o.process].filter(Boolean).join(' ')+' liep goed op '+zelfde.grind],
      decaf:d.decaf};
  }
  if(!laatste)return {stand:null,bron:'niets',score:d.score,waarom:d.redenen.slice(0,2),decaf:d.decaf};
  const o=bonenVan(laatste.beanId);
  const verschil=d.score-beanDensity(o).score;
  return {stand:laatste.grind,bron:'vorige zak',verschil,
    tegenover:(o?o.name:'je vorige zak'),waarom:d.redenen.slice(0,2),decaf:d.decaf};
}
/* Hoe groot is het verschil? Bewust in woorden en niet in klikken: de ene molen
   heeft dertig standen over hetzelfde bereik waar de andere er honderd heeft,
   dus een getal zou een precisie suggereren die we niet hebben. */
function grindStap(v){
  const a=Math.abs(v);
  if(a<0.5)return null;
  const richting=v>0?'fijner':'grover';
  if(a<1.5)return 'iets '+richting;
  if(a<3)return 'merkbaar '+richting;
  return 'duidelijk '+richting;
}
// heel korte vorm, voor op een dichtgeklapte kaart
function grindStartShort(bean,methodId){
  const g=grindStart(bean,methodId);if(!g)return '';
  if(g.bron==='vastgelegd')return 'staat op '+g.stand;
  if(g.bron==='andere methode')return g.stap?(g.stand+', '+g.stap):('start '+g.stand);
  if(g.decaf)return 'decaf \u2014 opnieuw afstellen';
  if(g.bron==='deze boon'||g.bron==='zelfde soort')return 'start ' + g.stand;
  if(g.bron==='niets')return g.score>=0.8?'begin eerder fijn':g.score<=-0.8?'begin eerder grof':'';
  const stap=grindStap(g.verschil);
  return stap?(g.stand+', '+stap):('start '+g.stand);
}
// één regel om te tonen en om in een prompt te zetten
function grindStartText(bean,methodId){
  const g=grindStart(bean,methodId);if(!g)return '';
  // afgetekend op deze methode: geen gok meer nodig
  if(g.bron==='vastgelegd')
    return 'je tekende deze boon hier af op '+g.stand+
      (g.cijfers?(' ('+g.cijfers+')'):'')+' \u2014 begin daar.';
  if(g.bron==='andere methode')
    return 'je tekende hem af op '+g.vanaf+': '+g.stand+(g.cijfers?(' ('+g.cijfers+')'):'')+
      (g.stap?(' \u2014 hier ga je daar '+g.stap+' dan.')
             :' \u2014 begin daar en stel bij.');
  // decaf: een oude stand doorrekenen heeft geen zin, dus dat zeggen we ook zo
  if(g.decaf){
    return (g.stand?('je vorige stand was '+g.stand+', maar '):'')+
      'decaf lost anders op en geeft meer fijn stof \u2014 stel opnieuw af en ga bij verstopping eerst grover.';
  }
  if(g.bron==='deze boon'||g.bron==='zelfde soort')
    return 'begin op '+g.stand+' \u2014 '+g.waarom[0]+'.';
  if(g.bron==='niets'){
    const kant=g.score>=0.8?'aan de trage kant, dus eerder fijn beginnen'
             :g.score<=-0.8?'aan de snelle kant, dus eerder grof beginnen'
             :'redelijk neutraal';
    return 'nog niets van gezet. Deze zak is '+kant+
      (g.waarom.length?(' \u2014 '+g.waarom.join('; ')):'')+'.';
  }
  const stap=grindStap(g.verschil);
  return 'begin bij je '+g.stand+' van '+g.tegenover+
    (stap?(' en ga '+stap):' \u2014 ongeveer gelijk')+
    (g.waarom.length?(' \u2014 '+g.waarom.join('; ')):'')+'.';
}
/* Vangrails die in élke brouw-prompt meegaan. ESPRESSO_RULES en FILTER_RULES
   gaan over de richting van je maling; dit gaat over de taal van de app: welke
   velden er zijn, in welke eenheden, en wat er nooit verzonnen mag worden. */
const APP_RULES=
  'HUISREGELS (gelden altijd):\n'+
  '- Antwoord in het Nederlands, kort en concreet. Geen slagzinnen, geen voorbehoud, geen herhaling van de vraag.\n'+
  '- Een maalstand is ALTIJD kort: alleen een getal, klikken of \u00e9\u00e9n woord. Nooit een merknaam, nooit uitleg in dat veld.\n'+
  '- Tijden als m:ss. Gewichten in hele grammen. Temperatuur in graden Celsius.\n'+
  '- Ratio betekent bij FILTER water gedeeld door dose (1:14 tot 1:18) en bij ESPRESSO yield gedeeld door dose (1:1,5 tot 1:3). Verwissel die twee nooit.\n'+
  '- Verzin geen gegevens. Weet je iets niet, laat het veld leeg in plaats van te gokken.\n'+
  '- De app kent deze begrippen; gebruik ze zoals ze bedoeld zijn: bloom (gram \u00e9n seconden), doorlooptijd (vanaf de laatste giet tot het bed droogvalt), de bedvorm (vlak, krater of droge rand), TDS met een extractievenster van 18 tot 22 procent, de maalstand per molen, en brewer, filterpapier en water als losse gegevens.\n'+
  '- Een krater of een droge rand is een gietfout, geen maalfout: noem dan eerst het gieten.\n'+
  '- Weeg de versheid mee: 0 tot 4 dagen na branden zit vol CO2, na ongeveer vier weken is dat gas eruit.\n'+
  '- Staat er een brandingsvoorkeur bij de boon (espresso of filter), respecteer die en stel geen methode uit de andere familie voor.\n'+
  '- Geef \u00e9\u00e9n verandering tegelijk, niet drie tegelijk.';
/* Wat de zak zegt over waar je maalstand begint. Deze richtingen mogen nooit
   omgedraaid worden; ze volgen uit hoe snel een boon oplost.               */
const BEAN_GRIND_RULES=
  'ZAK LEZEN \u2192 MAALSTAND (niet omkeren):\n'+
  '- BRANDING weegt het zwaarst. Donkerder gebrand = brozer en beter oplosbaar = loopt sneller = GROVER malen (en koeler zetten). Lichter gebrand = dichter en trager = FIJNER malen en warmer zetten, richting 95-96 graden.\n'+
  '- PROCES: natural (en anaerobic/carbonic) heeft de zwakste celstructuur en extraheert het snelst -> GROVER. Washed heeft de stevigste structuur en loopt het traagst -> FIJNER. Honey en pulped natural zitten ertussenin.\n'+
  '- HOOGTE staat voor dichtheid: boven ongeveer 1800 m is de boon hard en traag -> FIJNER. Onder ongeveer 1100 m zachter en sneller -> GROVER.\n'+
  '- Decaf: het ontcafe\u00efneren tast de celstructuur aan, de boon is brozer en geeft meer fijn stof. Reken een oude stand niet door maar stel opnieuw af, en ga bij verstopping eerst grover.\n'+
  '- Deze drie zijn een STARTPUNT, geen voorspelling. Heeft de gebruiker een gemeten stand van dezelfde boon of van een vergelijkbare zak, dan gaat die altijd voor.\n'+
  '- Noem hooguit twee redenen, en zeg er altijd bij dat het een startpunt is.';
/* Extra regels voor het gietschema, want daar gaat een model het snelst de mist
   in: gewichten die niet oplopen of een schema zonder doorloop. */
const SCHEMA_RULES=
  'SCHEMA-REGELS:\n'+
  '- De eerste stap staat op 0:00 en is de bloom: 2 tot 3 keer de dose aan water, en 30 tot 45 seconden voordat de volgende giet komt.\n'+
  '- t loopt altijd op.\n'+
  '- g is het TOTAAL aan water dat er n\u00e1 die stap in zit, dus cumulatief en altijd hoger dan de vorige; de laatste gietstap is exact het eindgewicht.\n'+
  '- Laat g weg bij een stap waarbij je niet giet (swirl, roer, wacht, pers, doorloop).\n'+
  '- Sluit altijd af met een doorloop-stap zonder g.\n'+
  '- Vier tot zeven stappen. Elke instructie is \u00e9\u00e9n zin van hoogstens twaalf woorden.';
/* En voor het uitlezen van een zak: overschrijven wat er staat, niet aanvullen
   met wat je hoopt dat er staat. */
const BEAN_RULES=
  'ETIKET-REGELS:\n'+
  '- Neem alleen over wat er letterlijk staat. Verzin geen herkomst, hoogte, vari\u00eb'+'teit of smaaknotities.\n'+
  '- roasternotes exact overnemen zoals ze op de zak staan, komma-gescheiden, niet vertalen en niet aanvullen.\n'+
  '- process en variety in de gangbare term (washed, natural, honey, anaerobic).\n'+
  '- roast alleen invullen als de zak een brandingsniveau noemt; gebruik dan exact een van: light, medium-light, medium, medium-dark, dark.\n'+
  '- fam alleen invullen als de zak het zelf zegt: staat er espresso -> "espresso", staat er filter of pour over -> "filter", staat er omni of espresso & filter -> "both". Staat er niets over, laat fam leeg.';
// korte regel over de boon zelf, voor in elke prompt waar een boon bij hoort
function beanPromptBlock(bean){
  if(!bean)return '';
  const f=beanFreshness(bean);
  const stukken=[];
  if(f)stukken.push(f.days+' dagen na branden');
  if(bean.fam)stukken.push('op de zak staat: '+(bean.fam==='both'?'omni (espresso \u00e9n filter)':bean.fam+'branding'));
  if(bean.roast)stukken.push('branding '+bean.roast);
  if(bean.process)stukken.push('proces '+bean.process);
  if(altitudeOf(bean))stukken.push(altitudeOf(bean)+' m');
  if(bean.dialIn&&bean.dialIn.grind)stukken.push('eerder gebruikte maalstand '+bean.dialIn.grind+' bij '+(methodById(bean.dialIn.method)||{}).name);
  // wat je zelf hebt afgetekend weegt zwaarder dan elke vuistregel
  const vast=beanDial(bean,null);
  if(vast)stukken.push('door jou afgetekend: '+vast.map(d=>
    ((methodById(d.method)||{}).name||d.method)+' op maalstand '+d.grind+
    (dialCijfers(d)?(' ('+dialCijfers(d)+')'):'')).join(', '));
  let uit=stukken.length?('\nOver deze boon: '+stukken.join('; ')+'.'):'';
  const start=grindStartText(bean,formMethod);
  if(start)uit+='\nStartpunt maalstand volgens de app: '+start.replace(/\.$/,'')+'.';
  return uit;
}
// vaste filterregels die de AI overal meekrijgt (spiegelbeeld van ESPRESSO_RULES)
const FILTER_RULES=
  'FILTER-REGELS (niet omkeren):\n'+
  '- FIJNER malen = meer weerstand = TRAGER doorlopen = MEER extractie (minder zuur, meer body; te ver = bitter en droog).\n'+
  '- GROVER malen = minder weerstand = SNELLER doorlopen = MINDER extractie (zuur, dun, zoutig).\n'+
  '- De RATIO bepaalt de STERKTE, de MALING bepaalt de EXTRACTIE. Slap maar niet bitter -> minder water of meer koffie. Zuur of bitter -> aan de maling draaien, niet aan de ratio.\n'+
  '- Beoordeel met de totale tijd en met de doorlooptijd (vanaf de laatste giet tot het bed droogvalt), niet met de tijd alleen.\n'+
  '- Te snel doorgelopen en zuur/dun -> FIJNER. Te traag of verstopt en bitter/droog -> GROVER, en minder roeren of van lager gieten.\n'+
  '- Een krater of een droge rand in het bed is een GIETfout, geen maalfout: corrigeer eerst het gieten.\n'+
  '- Bloom hoort ongeveer 2 tot 3 keer de dose te zijn en 30 tot 45 seconden te duren. Hoe verser de boon, hoe meer CO2, hoe ruimer en langer de bloom.\n'+
  '- Temperatuur is de fijnafstelling: koeler = minder extractie, warmer = meer.\n'+
  '- Verander één ding tegelijk.';
// welke familie hoort bij een methode? espresso of filter (val terug op filter)
function methodFamily(idOrMethod){
  const m=(typeof idOrMethod==='object'&&idOrMethod)?idOrMethod:methodById(idOrMethod);
  if(m&&m.family)return m.family;
  const id=(m&&m.id)||(typeof idOrMethod==='string'?idOrMethod:null);
  if(id&&METHOD_FAMILY_DEFAULTS[id])return METHOD_FAMILY_DEFAULTS[id];
  return 'filter';
}
/* ---------------- filterrecepten met een stappenschema ----------------
   Elke stap: t = seconden vanaf start, p = deel van het totale water (0-1),
   k = soort stap, d = wat je doet (inhoud, dus Nederlands).
   Het water schaalt mee met je eigen dose: water = dose * ratio.        */
const FILTER_RECIPES=[
  {id:'hoffmann', naam:'Hoffmann V60', voor:['v60'], dose:15, ratio:16.7, temp:95, maling:'medium-fijn',
   over:'Twee gietbeurten en twee keer swirlen. Weinig stappen, maar je pols bepaalt het resultaat.',
   stappen:[
     {t:0,   p:0.12, k:'bloom', d:'giet 2× je dose in cirkels tot alles nat is'},
     {t:10,  p:0,    k:'swirl', d:'swirl de dripper rustig rond — het bed moet vlak liggen'},
     {t:45,  p:0.60, k:'giet',  d:'giet in rustige cirkels tot 60 % van je water'},
     {t:75,  p:1.00, k:'giet',  d:'vul in cirkels aan tot je eindgewicht'},
     {t:105, p:0,    k:'swirl', d:'nog één zachte swirl om het bed vlak te leggen'},
     {t:120, p:0,    k:'doorloop', d:'laten zakken — droog rond 3:00 tot 3:30'}]},

  {id:'kasuya', naam:'Kasuya 4:6', voor:['v60'], dose:20, ratio:15, temp:92, maling:'grof',
   over:'Vijf kleine gietbeurten. De eerste 40 % stuurt zuur tegenover zoet, de laatste 60 % de sterkte. Werkt ook zonder zwanenhals.',
   hendels:true,
   stappen:[
     {t:0,   p:0.20, k:'bloom', d:'eerste giet — recht in het midden'},
     {t:45,  p:0.40, k:'giet',  d:'tweede giet — hiermee is de smaakbalans klaar'},
     {t:90,  p:0.60, k:'giet',  d:'derde giet — vanaf hier bouw je de sterkte'},
     {t:130, p:0.80, k:'giet',  d:'vierde giet'},
     {t:170, p:1.00, k:'giet',  d:'vijfde giet'},
     {t:200, p:0,    k:'doorloop', d:'laten zakken — droog rond 3:30'}]},

  {id:'rao', naam:'Rao spin', voor:['v60'], dose:20, ratio:16, temp:96, maling:'medium',
   over:'Eén doorlopende giet en een swirl aan het eind. Vlak bed, weinig kans om te knoeien.',
   stappen:[
     {t:0,   p:0.15, k:'bloom', d:'giet 3× je dose op, alles moet nat zijn'},
     {t:10,  p:0,    k:'swirl', d:'swirl tot het bed vlak ligt'},
     {t:45,  p:1.00, k:'giet',  d:'giet in één rustige doorlopende stroom tot je eindgewicht'},
     {t:100, p:0,    k:'swirl', d:'één zachte swirl — de rand spoelt terug het bed in'},
     {t:110, p:0,    k:'doorloop', d:'laten zakken — droog rond 3:00'}]},

  {id:'chemex', naam:'Chemex klassiek', voor:['chemex'], dose:30, ratio:16.7, temp:95, maling:'medium-grof',
   over:'Het dikke filter houdt oliën tegen: heel schoon in de kop, maar het duurt langer.',
   stappen:[
     {t:0,   p:0.12, k:'bloom', d:'giet ~2× je dose op en laat het gas eruit'},
     {t:45,  p:0.50, k:'giet',  d:'giet in cirkels tot de helft — blijf van de filterrand af'},
     {t:105, p:0.80, k:'giet',  d:'vul aan zodra het niveau zakt'},
     {t:165, p:1.00, k:'giet',  d:'laatste giet tot je eindgewicht'},
     {t:210, p:0,    k:'doorloop', d:'laten zakken — droog rond 4:00 tot 4:30'}]},

  {id:'kalita', naam:'Kalita pulse', voor:['kalita','v60'], dose:20, ratio:16, temp:93, maling:'medium',
   over:'Vlakke bodem, ondiep bed. Kleine gietjes om het niveau gelijk te houden.',
   stappen:[
     {t:0,   p:0.16, k:'bloom', d:'giet 2,5× je dose op'},
     {t:45,  p:0.40, k:'giet',  d:'klein gietje in het midden'},
     {t:75,  p:0.60, k:'giet',  d:'weer een klein gietje'},
     {t:105, p:0.80, k:'giet',  d:'en nog een'},
     {t:135, p:1.00, k:'giet',  d:'laatste gietje tot je eindgewicht'},
     {t:170, p:0,    k:'doorloop', d:'laten zakken — droog rond 3:30'}]},

  {id:'switch', naam:'Switch hybride', voor:['switch','v60'], dose:15, ratio:16.7, temp:94, maling:'medium',
   over:'Eerst dicht laten weken voor zoet en body, daarna open laten lopen voor helderheid.',
   stappen:[
     {t:0,   p:0.20, k:'bloom', klep:'dicht', d:'giet 3× je dose op en laat bloeien'},
     {t:45,  p:0.60, k:'giet',  klep:'dicht', d:'giet in cirkels bij, alles blijft staan'},
     {t:80,  p:1.00, k:'giet',  klep:'dicht', d:'vul aan tot je eindgewicht'},
     {t:100, p:0,    k:'wacht', klep:'dicht', d:'laat het staan en trekken'},
     {t:150, p:0,    k:'doorloop', klep:'open', d:'laten leeglopen tot het bed droogvalt'}]},

  {id:'aeropress', naam:'AeroPress standaard', voor:['aeropress'], dose:16, ratio:15, temp:88, maling:'medium-fijn',
   houding:'normaal',
   over:'Kort en vergevingsgezind. Deels immersie, deels doorloop: schoon in de kop.',
   stappen:[
     {t:0,   p:0.22, k:'bloom', d:'giet op tot alles nat is en roer 10 seconden'},
     {t:30,  p:1.00, k:'giet',  d:'vul aan tot je eindgewicht en zet de deksel erop'},
     {t:60,  p:0,    k:'wacht', d:'laten staan'},
     {t:75,  p:0,    k:'pers',  d:'rustig indrukken in 30 tot 45 seconden — stop bij het sissen'}]},
];
/* Espressorecepten hebben dezelfde vorm als de filterrecepten, zodat dezelfde
   kaart ze kan tonen. Het verschil: ratio betekent hier yield-uit-dose, en de
   stappen zijn je routine in plaats van een gietschema. tijd = de doeltijd
   waar het dial-in-scherm naartoe werkt.                                    */
const ESPRESSO_RECIPES=[
  {id:'e-classic', fam:'espresso', naam:'classic 1:2', voor:['espresso'], dose:18, ratio:2, temp:93,
   tijd:'0:28', maling:'fijn',
   over:'Het moderne uitgangspunt. Werkt op vrijwel elke boon en is het eerlijkste vertrekpunt om vanaf te dial-innen.',
   stappen:[
     {t:0,p:0,k:'dose',  d:'weeg 18 g en verdeel het maalsel met een naaldje (WDT)'},
     {t:0,p:0,k:'tamp',  d:'tamp recht en waterpas, kracht maakt minder uit dan gelijkheid'},
     {t:0,p:0,k:'spoel', d:'spoel de groepskop en zet de portafilter erin'},
     {t:0,p:0,k:'shot',  d:'start de shot en de klok'},
     {t:28,p:0,k:'stop', d:'stop op 36 g uit en proef meteen'}]},

  {id:'e-ristretto', fam:'espresso', naam:'ristretto 1:1.5', voor:['espresso'], dose:18, ratio:1.5, temp:94,
   tijd:'0:28', maling:'fijner dan classic',
   over:'Korter getrokken: dikker, zoeter en minder zuur. Mooi op donkerdere brandingen en in kleine melkdranken.',
   stappen:[
     {t:0,p:0,k:'dose', d:'zelfde dose, maar maal een stap fijner'},
     {t:0,p:0,k:'shot', d:'start en let op: hij loopt trager op gang'},
     {t:28,p:0,k:'stop',d:'stop al op 27 g uit — daarna wordt het snel bitter'}]},

  {id:'e-lungo', fam:'espresso', naam:'lungo 1:3', voor:['espresso'], dose:18, ratio:3, temp:92,
   tijd:'0:33', maling:'grover dan classic',
   over:'Langer doorgetrokken voor meer aroma en een lichtere kop. Maal grover, anders haal je de bittere staart mee.',
   stappen:[
     {t:0,p:0,k:'dose', d:'maal een stap grover dan je classic'},
     {t:0,p:0,k:'shot', d:'start; hij hoort vlot maar niet snel te lopen'},
     {t:33,p:0,k:'stop',d:'stop op 54 g uit'}]},

  {id:'e-light', fam:'espresso', naam:'light roast 1:2.5', voor:['espresso'], dose:18, ratio:2.5, temp:95,
   tijd:'0:31', maling:'fijn',
   over:'Lichte brandingen zijn dichter en lossen trager op. Een langere ratio en hetere zet halen de zoetheid eruit in plaats van alleen het zuur.',
   stappen:[
     {t:0,p:0,k:'temp', d:'zet zo warm als je machine toelaat, richting 95–96 °C'},
     {t:0,p:0,k:'dose', d:'18 g, fijn gemalen en goed verdeeld'},
     {t:0,p:0,k:'shot', d:'start; de eerste druppels mogen best laat komen'},
     {t:31,p:0,k:'stop',d:'stop op 45 g uit'}]},

  {id:'e-turbo', fam:'espresso', naam:'turbo shot', voor:['espresso'], dose:20, ratio:2.5, temp:93,
   tijd:'0:18', maling:'grof voor espresso',
   over:'Grover malen en snel doorlopen. Weinig weerstand, dus vergevingsgezind — en verrassend zoet op lichte brandingen.',
   stappen:[
     {t:0,p:0,k:'dose', d:'20 g, duidelijk grover dan je normale espresso'},
     {t:0,p:0,k:'shot', d:'start; hij komt vrijwel meteen op gang'},
     {t:18,p:0,k:'stop',d:'stop op 50 g uit, ergens tussen 15 en 22 seconden'}]},

  {id:'e-milk', fam:'espresso', naam:'melkbasis', voor:['espresso'], dose:20, ratio:1.8, temp:94,
   tijd:'0:29', maling:'fijn',
   over:'Iets korter en met een hogere dose, zodat de koffie door de melk heen komt in een flat white of cappuccino.',
   stappen:[
     {t:0,p:0,k:'dose', d:'20 g in je mand — meer koffie, kortere ratio'},
     {t:0,p:0,k:'shot', d:'start en mik op 36 g uit'},
     {t:29,p:0,k:'melk', d:'schuim ondertussen je melk op tot 55–65 °C'}]},
];
/* Alleen jouw eigen recepten kun je kiezen. De ingebouwde schema's hieronder
   zijn geen keuze meer maar een startpunt: ze vullen de recepteditor voor als
   je er zelf een schrijft. Een kant-en-klaar recept in de coach maakte het
   scherm druk en het was niet van jou.                                     */
function eigenRecepten(methodId){
  return (state.recipes||[]).filter(r=>r.mid===methodId);
}
// welke recepten passen bij deze methode? eerst je eigen, dan de ingebouwde
function recipesFor(methodId){
  const m=methodById(methodId); const naam=((m&&m.name)||'').toLowerCase();
  const eigen=(state.recipes||[]).filter(r=>r.mid===methodId);
  if(methodFamily(methodId)==='espresso')return eigen.concat(ESPRESSO_RECIPES);
  let hit=FILTER_RECIPES.filter(r=>r.voor.some(v=>v===methodId||naam.includes(v)));
  // een methode die we niet kennen (je eigen brewer) krijgt toch een startpunt
  if(!hit.length)hit=FILTER_RECIPES.filter(r=>r.id==='rao'||r.id==='hoffmann');
  return eigen.concat(hit);
}
function recipeById(id){
  return (state.recipes||[]).find(r=>r.id===id)
    ||FILTER_RECIPES.find(r=>r.id===id)||ESPRESSO_RECIPES.find(r=>r.id===id)||null;
}
function recipeFam(r){return (r&&r.fam)||'filter';}
const ALLE_RECEPTEN=()=>FILTER_RECIPES.concat(ESPRESSO_RECIPES);
// gewichten uitrekenen voor jouw dose; hendels verschuiven de 4:6-verdeling
/* Staat er een gramgetal in de omschrijving van een stap, dan is dat geschreven
   voor de dosis waarmee het recept gemaakt is. Zet je met een andere dosis, dan
   schuift de kolom mee maar de zin niet -- en dan zegt "giet 33 g" iets anders
   dan de 54 g ernaast. Dus schalen we de getallen in de tekst met dezelfde
   factor als de kolom. */
function schaalGrammen(t,s){
  if(!t||!(s>0)||Math.abs(s-1)<0.01)return t;
  return String(t).replace(/(\d+(?:[.,]\d+)?)\s*(gram\b|g\b)/gi,(m,n,e)=>
    Math.round(parseFloat(String(n).replace(',','.'))*s)+' '+e);
}
function recipeSteps(r,dose,hendels){
  if(!r)return [];
  const water=Math.round((dose||r.dose)*r.ratio);
  const basis=Math.round((r.dose||dose||1)*r.ratio);   // waar de tekst voor geschreven is
  const schaal=basis?water/basis:1;
  let st=r.stappen.map(x=>Object.assign({},x,{d:schaalGrammen(x.d,schaal)}));
  if(r.hendels&&hendels){
    // eerste 40 %: zoeter = een kleiner eerste gietje, zuurder = een groter
    const zoet=Math.max(0,Math.min(1,hendels.zoet==null?0.5:hendels.zoet));
    const eerste=0.40*(0.35+zoet*0.30);        // tussen 14 % en 26 % van het totaal
    st[0].p=eerste; st[1].p=0.40;
    // laatste 60 %: meer gietjes = steviger
    const sterk=Math.max(0,Math.min(1,hendels.sterk==null?0.5:hendels.sterk));
    if(sterk<0.5){ st=st.filter(x=>x!==st[3]); st[2].p=0.70; st[3].p=1.00; }
  }
  return st.map(x=>Object.assign({},x,{g:x.p?Math.round(water*x.p):0, water}));
}
const TINTS=['--espresso','--aeropress','--v60','--chemex','--perculator'];
// ingebouwde tekeningen om uit te kiezen per methode-soort
const IMG_LIBRARY={
  espresso:[
    {src:'m-espresso.png',label:'ECM'},
    {src:'m-espresso-2.png',label:'classic'},
    {src:'m-espresso-3.png',label:'with grinder'},
  ],
  senseo:[{src:'m-senseo.png',label:'senseo'}],
  aeropress:[{src:'m-aeropress.png',label:'aeropress'}],
  v60:[{src:'m-v60.png',label:'v60'}],
  chemex:[{src:'m-chemex.png',label:'chemex'}],
  perculator:[{src:'m-mokkapot.png',label:'moka pot'}],
};
function libraryFor(m){
  // match op id, anders op naam
  if(IMG_LIBRARY[m.id])return IMG_LIBRARY[m.id];
  const n=(m.name||'').toLowerCase();
  for(const k in IMG_LIBRARY){if(n.includes(k))return IMG_LIBRARY[k];}
  return [];
}
// geeft de bron voor een methode-afbeelding: custom upload > standaard img > leeg
function methodImg(m){ return (m&&(m.customImg||m.img))||''; }
// render een methode-icoon (afbeelding met glyph-fallback), grootte px
function iconHTML(m,size){
  const src=BrewSecurity.imageUrl(methodImg(m)),glyph=esc((m&&m.glyph)||'☕');
  if(src)return `<img src="${esc(src)}" style="max-height:${size}px;max-width:100%;mix-blend-mode:multiply" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="glyph" hidden>${glyph}</span>`;
  return `<span class="glyph">${glyph}</span>`;
}
// handgetekende huisstijl-actie-icoontjes (inline SVG, losse schetsstijl)
const ICO={
  // versturen: pijl omhoog uit een doosje — met dubbele, kromme streken
  send:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.1 3 Q12.5 9 11.9 14.4 M8 7.2 Q10.1 4.5 12.1 2.9 Q14.1 4.9 16 7.2 M3.8 12.6 Q3.6 16.6 4.2 20.3 M4 20 Q12 20.8 20 20.1 M19.8 20.4 Q20.4 16.5 20.1 12.6"/><path d="M4.3 19.5 Q11.5 20.1 19.7 19.4" opacity="0.5"/></svg>',
  // toevoegen: pijl omlaag in een doosje
  add:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.1 14 Q12.4 8 11.9 2.8 M7.8 9.8 Q10 12.5 12.1 14.4 Q14.1 12.1 16.2 9.3 M3.8 12.6 Q3.6 16.6 4.2 20.3 M4 20 Q12 20.8 20 20.1 M19.8 20.4 Q20.4 16.5 20.1 12.6"/><path d="M4.3 19.5 Q11.5 20.1 19.7 19.4" opacity="0.5"/></svg>',
  // bewerken: potlood met losse lijnen
  edit:'<svg viewBox="0 0 24 24" class="acic"><path d="M3.8 20.5 Q3.6 17.9 4.1 15.7 M4 16 Q9.5 10.4 15.2 4.9 M14.8 5.1 Q17.3 6.9 19.3 9.3 M19 9 Q13.5 14.6 7.8 20.3 M8.1 20 Q5.8 20.6 3.7 20.3"/><path d="M12.6 7 Q15 9 17.4 11.3" opacity="0.6"/><path d="M4.8 19.2 Q5.4 17.4 6.4 16.2" opacity="0.5"/></svg>',
  // verwijderen: prullenbak met losse strepen
  del:'<svg viewBox="0 0 24 24" class="acic"><path d="M4.2 6.9 Q11.5 6.5 19.8 7.2 M8.9 7 Q8.8 5.1 9.1 3.7 Q12 3.4 15.1 3.8 Q15.3 5.3 15.1 7.1 M6 7 Q6.7 13.6 7.3 20.4 M7.1 20 Q12 20.8 17 20.1 M16.8 20.4 Q17.5 13.5 18.2 6.9"/><path d="M9.9 10.3 Q10.3 13.6 10.1 17.1 M14.1 10.3 Q13.7 13.6 13.9 17.1" opacity="0.6"/></svg>',
  // berichtje: tekstballon met een klein staartje en twee regeltjes
  chat:'<svg viewBox="0 0 24 24" class="acic"><path d="M3.8 6.3 Q3.4 4.3 5.3 4.1 Q12 3.6 18.7 4.1 Q20.6 4.3 20.1 6.2 M20.2 5.7 Q20.4 10 20.1 14.2 Q20.3 15.8 18.4 16 Q13 16.3 8.9 16.1 Q6.8 18.2 4.6 20 Q5.3 17.6 5.3 15.9 Q3.5 15.7 3.9 14.1 Q3.5 9.8 4.1 5.5"/><path d="M7.3 8.3 Q11.5 7.9 16.2 8.5 M7.3 11.6 Q10.6 11.2 13.8 11.8" opacity="0.6"/></svg>',
  // koffiemolen: trechter + slinger (voor barista skills)
  grinder:'<svg viewBox="0 0 24 24" class="acic"><path d="M6.7 4.2 Q12 3.9 17.3 4.3 M17.1 4.6 Q16.4 8.1 15.7 11.3 M15.9 11 Q12 11.6 8.1 11.2 M8.3 11.4 Q7.5 8 6.8 4.3 M8.8 11 Q8.6 15.6 8.9 19.9 M8.6 19.5 Q12 20.2 15.4 19.6 M15.2 19.9 Q15.4 15.4 15.1 11"/><path d="M16.6 4.8 Q19.7 4.3 20.8 6.6 Q21.2 8.2 19.6 8.8" opacity="0.8"/><path d="M10.3 13.4 Q12 13.1 13.8 13.6" opacity="0.5"/></svg>',
  // open boek (voor coffee academy)
  book:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.1 5.4 Q8.4 3.4 4.2 4.5 M4.5 4.2 Q3.8 11.5 4.3 18.7 M4.2 18.2 Q8.6 17.3 12.2 19.7 M11.9 19.4 Q15.4 17.3 19.8 18.5 M19.5 18.8 Q20.2 11.5 19.7 4.3 M19.9 4.7 Q15.5 3.4 11.8 5.7 M12.1 5.1 Q12.3 12.6 11.9 19.9"/><path d="M6.4 8.1 Q9 7.4 10.7 8.3 M6.4 11.1 Q9 10.4 10.7 11.3 M13.4 8.3 Q15.6 7.4 17.7 8.1 M13.4 11.3 Q15.6 10.4 17.7 11.1" opacity="0.5"/></svg>',
  // melkkannetje (voor latte art)
  pitcher:'<svg viewBox="0 0 24 24" class="acic"><path d="M6.8 5.7 Q11.5 5.3 16.2 5.9 M16.1 5.6 Q16.7 12.6 16.1 19.3 M16.3 19 Q11.6 19.8 7.3 19.1 M7.5 19.4 Q6.5 12.6 6.9 5.4 M7.1 7.3 Q4.8 8.4 4.4 11 Q4.2 13.2 6.1 13.7 M16.1 6.8 Q17.7 5.8 18.9 7.1 Q19.8 8.5 18.3 9.4"/><path d="M9.3 8.9 Q11.5 8.5 14 9.1" opacity="0.5"/></svg>',
  // sparkle/AI: schetsmatige vonk
  spark:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.6 4.2 Q12.7 8.2 13.4 9.9 Q15.2 10.7 19.8 11.3 Q15 12.6 13.1 13.4 Q12.4 15.4 11.8 20.8 Q11.2 15 10.6 13.1 Q8.6 12.4 4.2 11.6 Q9.1 10.3 10.9 9.6 Q11.6 7.6 12.3 3.4"/><path d="M18.4 4.4 Q18.9 5.5 19.1 6.1 Q19.9 6.4 21.2 6.5 Q19.6 7.1 18.9 7.4 Q18.6 8.2 18.4 9.4 Q18.1 8 17.9 7.2 Q17 6.9 15.8 6.5 Q17.4 6.1 18.1 5.9 Q18.4 5 18.7 3.8" opacity="0.7"/></svg>',
  // download-pijl (exporteren)
  down:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.9 3.1 Q12.4 8.6 12 13.5 M8.2 9.4 Q10.2 11.7 12.1 13.8 Q13.9 11.4 15.8 9 M4.6 17.1 Q12 17.8 19.4 16.9 M5.2 20 Q12 20.7 18.9 19.9" /></svg>',
  // upload-pijl (importeren)
  up:'<svg viewBox="0 0 24 24" class="acic"><path d="M12.1 13.4 Q12.5 7.9 11.9 3.1 M8.2 7.6 Q10.2 5.3 12.1 3 Q13.9 5.6 15.8 8 M4.6 17.1 Q12 17.8 19.4 16.9 M5.2 20 Q12 20.7 18.9 19.9"/></svg>',
  // diskette (opslaan)
  disk:'<svg viewBox="0 0 24 24" class="acic"><path d="M4.8 4.2 Q11 3.8 16.6 4.4 Q18.3 6.2 19.8 8.1 M19.6 7.7 Q20.1 13.5 19.7 19.7 M19.9 19.3 Q12 20.1 4.4 19.5 M4.7 19.8 Q4 12 4.9 4 M7.9 4.4 Q7.8 7 7.9 8.7 Q11.8 9.2 15.5 8.6 Q15.7 6.6 15.6 4.5"/><path d="M7.9 19.5 Q7.8 15 8.1 12.8 Q12 12.4 16.1 12.9 M16 12.6 Q16.3 16.1 16.2 19.5" opacity="0.7"/></svg>',
  // afbeelding/tekening (galerij, tekeningen herstellen)
  img:'<svg viewBox="0 0 24 24" class="acic"><path d="M4.4 5.8 Q12 5.2 19.8 5.6 M19.5 5.1 Q20.1 12 19.6 18.9 M19.9 18.5 Q12 19.1 4.2 18.6 M4.6 19 Q4 12 4.4 5.2"/><path d="M5.2 15.8 Q8 12 10.1 13.7 Q13 9.4 15.6 12.1 Q17.6 14.1 19.1 16.7" opacity="0.8"/><path d="M9.9 8.7 Q10.3 10.4 8.6 10.5 Q7.1 10.4 7.3 8.9 Q7.6 7.5 9.2 7.7 Q9.9 7.9 10.2 8.4" opacity="0.7"/></svg>',
  // camera (foto maken)
  cam:'<svg viewBox="0 0 24 24" class="acic"><path d="M4.3 8.2 Q6.9 7.6 8.5 7.7 Q9.3 6.3 10.1 5.4 Q12 5.1 13.9 5.4 Q14.7 6.5 15.5 7.9 Q17.4 7.6 19.7 8.1 M19.4 7.6 Q20.1 13 19.6 18.3 M19.9 17.9 Q12 18.6 4.2 18.1 M4.6 18.5 Q3.9 13 4.4 7.7"/><path d="M15.2 11.8 Q16 14.4 13.4 15.8 Q10.6 16.7 9 14.6 Q8.1 12.2 10.3 10.2 Q12.8 8.9 14.8 10.7 Q15.4 11.4 15.5 12.4"/><path d="M13.1 12.2 Q13.5 13.7 12 13.9 Q10.6 13.9 10.7 12.5 Q10.9 11.3 12.3 11.4" opacity="0.5"/></svg>',
  // loep (zoeken)
  search:'<svg viewBox="0 0 24 24" class="acic"><path d="M14.4 8.1 Q17 11.6 14.2 14.6 Q11.1 16.9 7.6 14.9 Q4.8 12.3 6.5 8.5 Q9 5.3 12.6 6.3 Q14.2 7 15 8.7"/><path d="M14.6 14.9 Q17.4 17.6 20.4 20.5"/><path d="M7.6 8.9 Q8.6 7.1 10.7 7" opacity="0.5"/></svg>',
  // sleutel (API-sleutel)
  key:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.4 7.4 Q13.1 10.4 10.4 12.7 Q7.4 14 5 11.6 Q3.3 8.7 5.7 6.1 Q8.7 4.2 11.1 6.4 Q11.7 7 11.9 8.1"/><path d="M10.9 11.6 Q14.6 15.6 20 20.8 M15.8 16.9 Q17.2 15.6 18.6 14.4 M18.1 19.2 Q19.2 17.9 20.3 16.9"/><path d="M8 8.6 Q8.3 9.8 7.1 9.7 Q6.1 9.4 6.5 8.3 Q7.3 7.8 8.1 8.5" opacity="0.5"/></svg>',
  // link/ketting
  link:'<svg viewBox="0 0 24 24" class="acic"><path d="M9.7 7.7 Q11.7 5.2 14.1 5.2 Q17.2 4.9 18.8 7.6 Q20.1 10.1 18.1 12.3 Q16.5 14.1 14.1 14.4 M14.2 16.3 Q12.1 18.8 9.8 18.8 Q6.7 19.1 5.2 16.4 Q3.9 13.9 5.9 11.7 Q7.5 9.9 9.8 9.6"/><path d="M9.2 14.9 Q12 12 15 9.1" opacity="0.6"/></svg>',
  // waarschuwing (driehoek met !)
  warn:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.8 3.6 Q13 5.6 17.1 12.6 Q19.6 17.1 20.8 19.3 M20.4 19 Q12 19.8 3.3 19.1 M3.7 19.4 Q4.5 17 7 12.4 Q11 5.4 12.2 3.5"/><path d="M11.9 9.3 Q12.3 12 11.9 14.8 M12 16.5 L12 17.2" opacity="0.8"/></svg>',
  // gloeilamp (tip)
  bulb:'<svg viewBox="0 0 24 24" class="acic"><path d="M11.5 3.4 Q17.2 3.2 17.8 8.4 Q18.2 11.6 15.7 13.8 Q15 14.4 14.9 16.3 M15 16 Q12 16.6 9.1 16.1 M9.3 16.3 Q9 14.2 8.3 13.6 Q5.8 11.4 6.2 8.2 Q6.8 3.3 12.5 3.6"/><path d="M9.7 18.4 Q12 18.9 14.3 18.4 M10.3 20.5 Q12 21 13.8 20.5" opacity="0.7"/></svg>',
};
let state={methods:[],brews:[],beans:[],gear:[]};
const PRESET_TAGS=['fruity','chocolate','floral','nutty','caramel','citrus','berry','sweet','clean','juicy','balanced'];

/* ---------------- opslag: IndexedDB (grote quota) i.p.v. localStorage (~5MB) ---------------- */
const IDB_DB='scc_db', IDB_STORE='kv', IDB_KEY='scc_state';
let idbConn=null;
function idbOpen(){
  if(idbConn)return Promise.resolve(idbConn);   // verbinding hergebruiken i.p.v. telkens heropenen
  return new Promise((res,rej)=>{
    let rq;
    try{rq=indexedDB.open(IDB_DB,1);}catch(e){return rej(e);}
    rq.onupgradeneeded=()=>{const db=rq.result;if(!db.objectStoreNames.contains(IDB_STORE))db.createObjectStore(IDB_STORE);};
    rq.onsuccess=()=>{idbConn=rq.result;
      idbConn.onclose=()=>{idbConn=null;};
      idbConn.onversionchange=()=>{try{idbConn.close();}catch(e){}idbConn=null;};
      res(idbConn);};
    rq.onerror=()=>rej(rq.error);
  });
}
function idbGet(key){
  return idbOpen().then(db=>new Promise((res,rej)=>{
    const rq=db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).get(key);
    rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error);
  }));
}
function idbSet(key,val){
  return idbOpen().then(db=>new Promise((res,rej)=>{
    const tx=db.transaction(IDB_STORE,'readwrite');
    tx.objectStore(IDB_STORE).put(val,key);
    tx.oncomplete=()=>res();tx.onerror=tx.onabort=()=>rej(tx.error||new Error('idb-set'));
  }));
}
let storageBlocked=false;
let hadOpgeslagenData=false;   // draaide deze telefoon de app al eerder?
async function load(){
  let s=null;
  try{s=await idbGet(IDB_KEY);}catch(e){storageBlocked=true;throw e;}
  if(s!=null&&!(s&&s.methods&&s.brews)){storageBlocked=true;throw new Error('Unsupported stored data; export a backup before changing anything.');}
  // eenmalige migratie vanuit oude localStorage-opslag; daarna localStorage
  // leegmaken zodat de ~5MB-limiet daar geen schrijfacties meer blokkeert
  if(!(s&&s.methods&&s.brews)){
    try{
      const ls=JSON.parse(localStorage.getItem('scc_state'));
      if(ls&&ls.methods&&ls.brews){
        s=ls;
        try{await idbSet(IDB_KEY,s);localStorage.removeItem('scc_state');}catch(e){}
      }
    }catch(e){}
  }
  if(s&&s.methods&&s.brews){try{BrewSecurity.validateImport(s,{backup:true});}catch(e){storageBlocked=true;throw e;}hadOpgeslagenData=true;state=s;if(!state.beans)state.beans=[];if(!state.gear)state.gear=[];state=BrewModel.migrate(state);mergeMethodImages();try{bpMigreerWensen();}catch(e){}if((s.dataVersion||0)<2)await save();return;}
  state=BrewModel.migrate({methods:JSON.parse(JSON.stringify(DEFAULT_METHODS)),brews:demoBrews(),beans:demoBeans(),gear:[],prepItems:JSON.parse(JSON.stringify(DEFAULT_PREP))});
  save();
}
// vul standaard-afbeeldingen aan voor methodes die al opgeslagen waren zonder img
function mergeMethodImages(){
  let changed=false;
  state.methods.forEach(m=>{
    if(!m.img&&!m.customImg){
      // match op id, anders op naam (espresso/v60/aeropress/chemex/perculator/senseo)
      let def=DEFAULT_METHODS.find(d=>d.id===m.id);
      if(!def){const n=(m.name||'').toLowerCase();def=DEFAULT_METHODS.find(d=>n.includes(d.name)||d.name.includes(n));}
      if(def&&def.img){m.img=def.img;changed=true;}
    }
  });
  // perculator -> mokka pot: naam + tekening bijwerken bij bestaande gebruikers
  const perc=state.methods.find(m=>m.id==='perculator');
  if(perc){
    if(perc.name==='perculator'){perc.name='mokka pot';changed=true;}
    if(perc.img==='m-perculator.png'){perc.img='m-mokkapot.png';changed=true;}
  }
  if(!state.methods.find(m=>m.id==='senseo')){
    const sd=DEFAULT_METHODS.find(d=>d.id==='senseo');
    if(sd){state.methods.push(JSON.parse(JSON.stringify(sd)));changed=true;}
  }
  // senseo eenmalig aanzetten voor bestaande gebruikers (respecteert latere eigen keuze)
  if(!state.senseoDefaulted){
    const se=state.methods.find(m=>m.id==='senseo');
    if(se&&!se.on){se.on=true;}
    state.senseoDefaulted=true;changed=true;
  }
  // familie (espresso/filter) invullen waar die nog ontbreekt
  state.methods.forEach(m=>{
    if(!m.family){m.family=METHOD_FAMILY_DEFAULTS[m.id]||'filter';changed=true;}
  });
  if(!state.features){state.features={};changed=true;}
  normaliseerData(state);
  if(!Array.isArray(state.latteShots)){state.latteShots=[];changed=true;}
  // persoonlijke puck-prep-lijst aanmaken als die er nog niet is
  if(!Array.isArray(state.prepItems)){state.prepItems=JSON.parse(JSON.stringify(DEFAULT_PREP));changed=true;}
  // Historical attempts are facts: never collapse or remove them.
  state.dialInCollapsed=true;
  if(changed)save();
}
// een dial-in-recept: precies één per boon+methode+drank (pogingen overschrijven, geen kopieën)
/* Lijstvelden uit een back-up of een bestand van een vriend kunnen van alles zijn.
   Een tekenreeks komt door een `x && x.length`-controle heen en klapt daarna om op
   .map(). Alles wat binnenkomt gaat daarom eerst hierlangs. */
function asArr(v){return Array.isArray(v)?v:(v==null||v==='')?[]:[v];}
function normaliseerData(st){
  if(!st||typeof st!=='object')return st;
  ['brews','beans','methods','gear','prepItems','latteShots','recipes'].forEach(k=>{
    if(k in st && !Array.isArray(st[k]))st[k]=[];
  });
  (st.brews||[]).forEach(b=>{
    if(!b||typeof b!=='object')return;
    b.tags=asArr(b.tags).filter(t=>t!=null).map(t=>(''+t));
    b.custom=asArr(b.custom).filter(c=>c&&typeof c==='object');
    if(b.prep&&typeof b.prep!=='object')b.prep={};
  });
  (st.beans||[]).forEach(b=>{
    if(!b||typeof b!=='object')return;
    b.methods=asArr(b.methods).filter(m=>typeof m==='string');
    if(b.dialIn&&typeof b.dialIn!=='object')b.dialIn=null;
  });
  return st;
}
function isDialInBrew(x){
  if(!x)return false;
  if(typeof x.dialIn==='boolean')return x.dialIn;
  // oudere pogingen (van vóór de dialIn-vlag): espresso-familie, geen score, geen eigen titel
  return methodFamily(x.method)==='espresso' && !x.score && (!x.title || x.title===(x.drink||''));
}
let saveQueue=Promise.resolve(),pendingSaves=0,lastSaveError=null;
function save(){
  if(storageBlocked){toast('Stored data need checking. Export a backup before changing anything.');return Promise.resolve(false);}
  const snapshot=structuredClone(state);pendingSaves++;
  const task=saveQueue.catch(()=>{}).then(()=>idbSet(IDB_KEY,snapshot)).then(()=>{lastSaveError=null;document.getElementById('ws-save-error')?.remove();return true;}).catch(()=>{
    lastSaveError=true;let el=document.getElementById('ws-save-error');if(!el){el=document.createElement('div');el.id='ws-save-error';el.setAttribute('role','alert');el.style.cssText='position:fixed;z-index:9999;top:0;left:0;right:0;background:#fff3d6;color:#6d321d;padding:12px;font:14px system-ui,sans-serif';document.body.append(el);}el.textContent='Opslaan is mislukt. Houd deze app open en maak een back-up via Instellingen → Gegevens en delen.';return false;
  }).finally(()=>pendingSaves--);saveQueue=task;return task;
}
window.addEventListener('beforeunload',e=>{if(pendingSaves||lastSaveError){e.preventDefault();e.returnValue='';}});
// "✓ opgeslagen" label bewust uitgezet: op verzoek niet meer tonen op het
// startscherm/splash noch op andere pagina's. Opslaan gebeurt nog steeds
// automatisch (zie save()), alleen zonder zichtbaar label.
let savedT;
function showSaved(){
  return;
}
function demoBrews(){
  return [
    {id:uid(),method:'v60',beans:'Ethiopia',dose:18,yield:300,ratio:16.7,time:'3:42',temp:92,score:8.6,notes:'balanced & smooth. great clarity.',ts:Date.now()-3600e3},
    {id:uid(),method:'aeropress',beans:'Guatemala',dose:17,yield:270,ratio:15.9,time:'2:15',temp:85,score:8.2,notes:'clean & sweet. soft finish.',ts:Date.now()-9e7},
    {id:uid(),method:'senseo',beans:'Classic Red',dose:15,yield:180,ratio:12,time:'0:30',temp:90,score:5.5,notes:'quick cup. does the job.',guide:'1. place pad in holder\n2. fill reservoir with water\n3. press the button\n4. done',ts:Date.now()-18e7},
  ];
}
function demoBeans(){return [
  {id:uid(),name:'Ethiopia Guji',roaster:'Friedhats',origin:'Guji, Ethiopia',process:'washed',variety:'heirloom',altitude:'1900-2100',roastdate:'',roasternotes:'jasmine, peach, black tea',method:'v60',methods:['v60'],inStock:true,notes:''},
  {id:uid(),name:'Classic Red',roaster:'Senseo',origin:'Brazil',process:'ground',variety:'',altitude:'',roastdate:'',roasternotes:'chocolate, nuts, full-bodied',method:'senseo',methods:['senseo'],inStock:true,notes:'everyday coffee. always in stock.'},
];}
function uid(){return Math.random().toString(36).slice(2,9);}
function beanById(id){return state.beans.find(b=>b.id===id);}
function methodById(id){return state.methods.find(m=>m.id===id)||{name:id,glyph:'☕',tint:'--card'};}

/* ---------------- navigatie ---------------- */
const pages=['welcome','home','choosebean','form','dialin','recipe','detail','brews','methods','beans','beanform','learn','learn-barista','learn-filter','learn-academy','learn-latte','profile','cupping','gallery','beanpick','finder'];
const navMap={home:'home',choosebean:'brews',form:'home',dialin:'home',recipe:'brews',detail:'home',
  cupping:'beans',gallery:'learn',brews:'brews',methods:'home',beans:'beans',beanform:'beans',learn:'learn','learn-barista':'learn','learn-filter':'learn','learn-academy':'learn','learn-latte':'learn',beanpick:'beans',finder:'beans',profile:'profile'};
let navHistory=[];
let currentPage='welcome';
function go(p,isBack){
  // de getekende boon hoort bij de app, niet bij het beginscherm
  const bgb=document.getElementById('bg-bean');
  if(bgb)bgb.classList.toggle('on',p!=='welcome');
  // geschiedenis bijhouden (niet voor splash/naam, en niet bij terug-navigatie)
  if(!isBack && currentPage && currentPage!==p && currentPage!=='welcome'){
    navHistory.push(currentPage);
    if(navHistory.length>30)navHistory.shift();
  }
  currentPage=p;
  // detail hoort bij de lijst waar je vandaan kwam, niet altijd bij home
  if(p==='detail'&&navHistory.length)navMap.detail=(navHistory[navHistory.length-1]==='brews')?'brews':'home';
  pages.forEach(x=>document.getElementById('page-'+x).classList.add('hidden'));
  document.getElementById('page-'+p).classList.remove('hidden');
  const nav=document.getElementById('nav');
  if(p==='welcome'){nav.classList.add('hidden');}
  else{nav.classList.remove('hidden');
    document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.p===navMap[p]));}
  if(p==='home')renderHome();
  if(p==='brews')renderAll();
  if(p==='methods')renderMethods();
  if(p==='beans')renderBeans();
  if(p==='choosebean')renderChooseBean();
  if(p==='cupping')renderCupping();
  if(p==='gallery'){renderGaHelp();renderGaShapePick();renderGallery();}
  if(p==='learn'){
    const w=document.getElementById('water-card');if(w)w.style.display=featOn('water')?'flex':'none';
    if(featOn('water')){waterPresets();waterCalc();}
    const wb=document.getElementById('water-body');if(wb&&!featOn('water'))wb.classList.add('hidden');
    const bpc=document.getElementById('beanpick-card');
    if(bpc){bpc.style.display=featOn('beanpick')?'flex':'none';if(featOn('beanpick'))bpPaspoortRegel();}
    const cc=document.getElementById('cupping-card');if(cc)cc.style.display=featOn('cupping')?'flex':'none';
    const gc=document.getElementById('gallery-card');if(gc)gc.style.display=featOn('latteart')?'flex':'none';
    const ds=document.getElementById('learn-do-sect');
    if(ds)ds.style.display=(featOn('cupping')||featOn('latteart'))?'flex':'none';
  }
  if(p==='learn-barista')renderLesson('barista-content',LESSONS.barista);
  if(p==='learn-filter')renderLesson('filter-content',LESSONS.filter);
  if(p==='learn-academy')renderLesson('academy-content',LESSONS.academy);
  if(p==='learn-latte')renderLatte();
  if(p==='beanpick')bpTeken();
  if(p==='finder')fdTeken();
  if(p==='profile')renderProfile();
  applyAIVisibility();
  try{fdPil();}catch(e){}
  document.querySelector('.phone').scrollTop=0;
}
function goBack(){
  if(navHistory.length){
    const prev=navHistory.pop();
    go(prev,true);
  }
}

/* ---------------- home ---------------- */
function timeAgo(ts){const d=(Date.now()-ts)/86400e3;
  if(d<1)return'today';if(d<2)return'yesterday';return Math.floor(d)+' days ago';}
function brewCard(b){
  const m=methodById(b.method);
  const heading=(b.title&&b.title.trim())?b.title:m.name;
  return `<div class="card sketch row" style="background:var(${m.tint});cursor:pointer" onclick="openDetail('${b.id}')">
    <div class="brew-thumb">${iconHTML(m,44)}</div>
    <div class="brew-main"><div class="name hand">${esc(heading)}</div>
      <div class="meta">${b.title&&b.title.trim()?esc(m.name)+' · ':''}${esc(b.beans||'—')} · ${b.dose||'?'}g<br>${esc(b.time||'')} · ${b.temp?b.temp+'°C':''}</div></div>
    <div class="brew-side"><div class="when">${timeAgo(b.ts)}</div>
      <div class="score hand">${(+b.score).toFixed(1)}<span>/10</span></div></div></div>`;
}
function renderHome(){
  const g=document.getElementById('home-greeting');
  if(g)g.textContent=state.userName?('hi '+state.userName):'hi there';
  // recente brews: bonen-die-op-zijn niet prominent tonen (tenzij er niets anders is)
  const pool=state.brews.filter(b=>!brewBeanGone(b));
  const recent=[...(pool.length?pool:state.brews)].sort((a,b)=>b.ts-a.ts).slice(0,3);
  document.getElementById('recent-list').innerHTML =
    recent.length?recent.map(brewCard).join(''):'<div class="empty-note">no brews yet.<br>tap ＋ new brew to get started.</div>';
  try{refreshWeather();}catch(e){}
  const bn=document.getElementById('brew-now-btn');
  if(bn)bn.style.display=(featOn('brewnow')&&state.brews.length)?'block':'none';
  const ms=document.getElementById('methods-scroll');
  ms.innerHTML=state.methods.filter(m=>m.on).map(m=>
    `<button class="method" onclick="showMethodBrews('${m.id}')"><div class="ic">${iconHTML(m,46)}</div><div class="nm">${esc(m.name)}</div></button>`
  ).join('');
}
// beveel een zetmethode (die aanstaat) + boon uit voorraad aan, op basis van
// je eigen brews: de methode met het hoogste gemiddelde cijfer wint
function recommendBrew(){
  const onMethods=state.methods.filter(m=>m.on);
  if(!onMethods.length)return null;
  const stats={};
  state.brews.forEach(b=>{
    if(!b.method||b.score==null)return;
    const s=stats[b.method]||(stats[b.method]={sum:0,n:0});
    s.sum+=(+b.score||0);s.n++;
  });
  let method=onMethods[0],best=-1;
  onMethods.forEach(m=>{
    const s=stats[m.id];
    const avg=s&&s.n?s.sum/s.n:-1;   // methodes zonder brews belanden achteraan
    if(avg>best){best=avg;method=m;}
  });
  const inStock=state.beans.filter(b=>b.inStock);
  const bean=inStock.find(b=>Array.isArray(b.methods)&&b.methods.includes(method.id))
          || inStock.find(b=>b.method===method.id)
          || inStock[0] || null;
  return {method,bean};
}
async function quickBrew(){
  const r=recommendBrew();
  if(!r){toast('turn on a method first under methods');return;}
  const method=r.method; const esp=methodFamily(method)==='espresso';
  beginBrew(method.id);   // espresso -> dial-in-scherm, filter -> formulier (beide leeg)
  // zonder AI: eenvoudige voorvulling (methode + boon uit voorraad)
  if(!aiReady()){
    if(r.bean){formBean=r.bean.id;esp?renderDiBeans():renderFormBeans();}
    toast(r.bean?('recommended: '+method.name+' with '+r.bean.name+' — turn on AI for an invented recipe')
                :('recommended: '+method.name+' — turn on AI for an invented recipe'));
    return;
  }
  toast('AI is inventing a brew for '+method.name+'…');
  const inStock=state.beans.filter(b=>b.inStock);
  try{
    const beansList=inStock.length
      ? inStock.map(b=>{
          const f=beanFreshness(b);
          const extra=[f?f.days+' dagen na branden':'',b.fam?('zak zegt: '+(b.fam==='both'?'omni':b.fam)):''].filter(Boolean);
          return `- ${b.name}${b.origin?' — '+b.origin:''}${b.process?' ('+b.process+')':''}`+
                 `${b.roasternotes?'; smaak: '+b.roasternotes:''}${extra.length?'; '+extra.join(', '):''}`;
        }).join('\n')
      : '(geen bonen in voorraad)';
    const milk=esp?` Je mag (als espresso) een melkdrank kiezen: espresso, flat white, cappuccino, latte, cortado, macchiato of americano. Kies je een melkdrank, zet dan de melkstappen (opschuimen, hoeveelheid, textuur, temperatuur) in "steps" en de dranknaam in "drink".`:'';
    const wx=featOn('weather')?JSON.parse(localStorage.getItem('scc_weather')||'null'):null;
    const wxLine=wx?` Het is nu ${Math.round(wx.t)}°C${wx.rain?' en het regent':''}; weeg dat mee (warm→verfrissend/iced, koud/regen→troostend).`:'';
    const prompt=`Je bent een specialty-barista. Bedenk één concrete, nieuwe brew voor de methode "${method.name}".`+wxLine+milk+
      (inStock.length?` Kies uit deze bonen in voorraad de best passende bij deze methode en dit recept. Sla een boon over waarvan de zak een andere familie noemt dan deze methode:\n${beansList}\n`
                     :` Er zijn geen bonen in voorraad; kies een passend boontype.\n`)+
      gearPromptBlock(method.id)+
      ('\n'+APP_RULES+'\n'+BEAN_GRIND_RULES+'\n'+(esp?ESPRESSO_RULES:FILTER_RULES)+'\n')+
      `Geef ALLEEN JSON terug zonder markdown: {"bean":"","title":"","drink":"","dose":"","yield":"","ratio":"","grind":"","grindNote":"","temp":"","time":"","tags":["",""],"steps":["",""],"tip":""}. `+
      `bean = exacte naam van de gekozen boon uit de lijst (of korte omschrijving als er geen voorraad is). title = korte pakkende naam. drink = melkdranknaam of "espresso" (laat leeg bij filter). grind = KORTE maalstand voor het invulveld (alleen getal/klikken of één woord — GEEN uitleg of merknaam). grindNote = korte uitleg over de maling (mag molen noemen). dose/yield in gram, temp in °C, ratio als 1:x, time als mm:ss. Kort en praktisch, in het Nederlands.`;
    const txt=await askAI([{role:"user",content:prompt}],900,'brew');
    const d=extractJSON(txt);
    let bean=null;
    if(d.bean){const bn=(''+d.bean).toLowerCase().trim();
      bean=inStock.find(b=>b.name.toLowerCase()===bn)||inStock.find(b=>bn.includes(b.name.toLowerCase())||b.name.toLowerCase().includes(bn));}
    if(!bean)bean=r.bean||inStock[0]||null;
    if(bean)formBean=bean.id;
    const gShort=conciseGrind(d.grind);
    const gNote=(d.grindNote||'').trim()||((''+(d.grind||'')).trim()!==gShort?(''+d.grind).trim():'');
    let guide='';
    if(Array.isArray(d.steps)&&d.steps.length)guide=d.steps.map((st,i)=>(i+1)+'. '+st).join('\n');
    if(gNote)guide=(guide?guide+'\n\n':'')+'maling: '+gNote;
    if(d.tip)guide=(guide?guide+'\n':'')+'💡 tip: '+d.tip;
    pendingTarget={dose:numOf(d.dose),grind:gShort,time:cleanTime(d.time),yield:numOf(d.yield)};
    const drink=(d.drink||'').trim();
    pendingRecipe={guide,drink,title:(d.title||'').trim()};
    if(esp){
      setVal('di-dose',numOf(d.dose));setVal('di-yield',numOf(d.yield));
      renderDialIn();
      toast('✓ '+(drink||'espresso')+(bean?' · '+bean.name:'')+' — measure your shot & save');
    }else{
      setText('f-title',d.title||'');renderFormBeans();
      setText('f-dose',numOf(d.dose));setText('f-yield',numOf(d.yield));
      if(d.ratio)setText('f-ratio',numOf((''+d.ratio).split(':').pop()));
      setText('f-time',cleanTime(d.time));setText('f-temp',numOf(d.temp));
      if(gShort)setText('f-grind',gShort);
      if(Array.isArray(d.tags)){formTags=d.tags.filter(Boolean).map(t=>(''+t).toLowerCase());renderFormTags();}
      renderDialInHint();
      toast('✓ '+method.name+(bean?' with '+bean.name:'')+' — check & save');
    }
  }catch(e){
    if(r.bean){formBean=r.bean.id;esp?renderDiBeans():renderFormBeans();}
    toast('couldn\'t make an AI brew — fill in the rest yourself');
  }
}
let brewSort='date', filterMethod='all';
/* Sorteren van je brews. De volgorde waarin je ze zette is de standaard; op
   methode groepeert per zetter, op score zet je beste bovenaan.            */
const BREW_SORTS=[['date','brew order'],['method','method'],['score','score']];
function setSort(s){brewSort=s;renderAll();}
function renderSortChips(){
  const el=document.getElementById('sort-chips');if(!el)return;
  el.innerHTML=BREW_SORTS.map(([v,label])=>
    '<button class="sortc '+(brewSort===v?'on':'')+'" onclick="setSort(\''+v+'\')">'+esc(label)+'</button>').join('');
}
// de vergelijker die bij de gekozen volgorde hoort
function brewSorter(){
  if(brewSort==='score')return (a,b)=>(b.score||0)-(a.score||0)||b.ts-a.ts;
  if(brewSort==='method')return (a,b)=>{
    const na=(methodById(a.method)||{}).name||'', nb=(methodById(b.method)||{}).name||'';
    return na.localeCompare(nb)||b.ts-a.ts;
  };
  return (a,b)=>b.ts-a.ts;
}
function setFilter(m){filterMethod=m;renderAll();}
function renderFilterChips(){
  // alleen de zetters waarmee je echt gezet hebt; anders staat de balk vol met
  // knoppen die niets filteren
  const used=[...new Set(state.brews.map(b=>b.method))];
  const methodChips=state.methods.filter(m=>used.includes(m.id));
  let html=`<button class="fc ${filterMethod==='all'?'sel':''}" onclick="setFilter('all')">all</button>`;
  html+=methodChips.map(m=>
    `<button class="fc ${m.id===filterMethod?'sel':''}" onclick="setFilter('${m.id}')"><span class="fc-ic">${iconHTML(m,22)}</span>${esc(m.name)}</button>`).join('');
  document.getElementById('filter-methods').innerHTML=html;
  // een balk met alleen "all" erin valt niets te kiezen; die laten we weg
  const fb=document.querySelector('#page-brews .filter-bar');
  if(fb)fb.style.display=methodChips.length?'':'none';
}
// een brew hoort in de "reservekast" als zijn boon niet meer in de kast staat
function brewBeanGone(b){
  if(!b.beanId)return false;
  const bean=beanById(b.beanId);
  if(!bean)return true;              // boon is verwijderd
  return bean.inStock===false;       // boon is op
}
let reserveOpen=false;
function toggleReserve(){reserveOpen=!reserveOpen;renderAll();}
/* ---------------- je brews, in dezelfde kaartstijl ----------------
   Zelfde jasje als de receptkaarten: tekening, titel, inklapbaar, prullenbakje
   rechtsboven. Open zie je de cijfers van die kop en kun je door naar het
   volledige detail.                                                        */
let brewOpen={};
function brewToggle(id){brewOpen[id]=!brewOpen[id];renderAll();}
function brewDelete(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  if(!confirm('delete this brew?'))return;
  state.brews=state.brews.filter(x=>x.id!==id);save();toast('\ud83d\uddd1 brew deleted');renderAll();
}
function brewCardNew(b){
  const m=methodById(b.method);
  const fam=methodFamily(b.method);
  const titel=(b.title&&b.title.trim())?b.title:m.name;
  const open=!!brewOpen[b.id];
  const meta=[(b.title&&b.title.trim())?m.name:'',b.beans||'\u2014',
    b.dose?b.dose+' g':'',b.time||''].filter(Boolean).join(' \u00b7 ');
  const cel=(k,v)=>v?('<div class="bc-cel"><div class="k">'+esc(k)+'</div><div class="v hand">'+esc(v)+'</div></div>'):'';
  const cijfers=cel('dose',b.dose?b.dose+' g':'')+
    cel(fam==='filter'?'water':'yield',b.yield?b.yield+' g':'')+
    cel('ratio',b.ratio?('1:'+(+b.ratio).toFixed(1)):'')+
    cel(fam==='filter'?'time':'shot time',b.time)+
    cel('drawdown',b.draw)+cel('grind',b.grind)+
    cel('temp',b.temp?b.temp+'\u00b0C':'')+cel('bed',b.bed?bedName(b.bed):'')+
    cel('tasted',b.cup?(cupById(b.cup)||{}).n:'');
  return `<div class="card sketch rcard bcard ${open?'op':''}" style="background:var(${m.tint})">
    <button type="button" class="rc-del" title="delete" aria-label="delete brew"
      onclick="event.stopPropagation();brewDelete('${b.id}')">${ICO.del}</button>
    <div class="row rc-head" onclick="brewToggle('${b.id}')">
      <div class="brew-thumb">${iconHTML(m,44)}</div>
      <div class="brew-main">
        <div class="name hand">${esc(titel)}</div>
        <div class="meta">${esc(meta)}</div>
      </div>
      <div class="bc-side"><div class="when">${timeAgo(b.ts)}</div>
        <div class="sc hand">${(+b.score).toFixed(1)}<span>/10</span></div></div>
      <div class="rc-arr">${open?'\u25be':'\u25b8'}</div>
    </div>
    <div class="rc-body">
      <div class="bc-grid">${cijfers}</div>
      ${asArr(b.tags).length?'<div class="note-tags">'+asArr(b.tags).map(t=>'<span class="nt">'+esc(t)+'</span>').join('')+'</div>':''}
      ${b.notes?'<div class="rc-over" style="margin-top:8px">'+esc(b.notes)+'</div>':''}
      <button class="rb-go" onclick="openDetail('${b.id}')">open this brew \u2192</button>
      <button class="rb-edit" onclick="brewAgain('${b.id}')">brew it again</button>
    </div>
  </div>`;
}
function renderAll(){
  renderFilterChips();renderSortChips();
  const sb=document.getElementById('sort-bar');
  if(sb)sb.style.display=(state.brews.length>=2)?'flex':'none';
  const sw=document.getElementById('brew-search-wrap');
  const zoekbaar=state.brews.length>=6;
  if(sw)sw.style.display=zoekbaar?'flex':'none';
  const q=(zoekbaar?(document.getElementById('brew-search')?.value||''):'').toLowerCase().trim();
  let uit='';

  // --- je geschiedenis, met de zoekterm en de methodefilters erboven ---
  const brews=state.brews.filter(b=>{
    if(filterMethod!=='all'&&b.method!==filterMethod)return false;
    if(!q)return true;
    const m=methodById(b.method);
    return [m.name,b.beans,b.notes,b.title,asArr(b.tags).join(' ')].join(' ').toLowerCase().includes(q);
  });
  const sorter=brewSorter();
  const actief=brews.filter(b=>!brewBeanGone(b)).sort(sorter);
  const kast=brews.filter(brewBeanGone).sort(sorter);
  // de titel boven de pagina zegt al "brews", dus hier alleen een regel als je zoekt
  if(q)uit+='<div class="list-note">what matches "'+esc(q)+'"</div>';
  uit+=actief.length?actief.map(brewCardNew).join('')
      :(kast.length?''
        :(state.brews.length?'<div class="empty-note">no brews found.</div>'
          :'<div class="empty-note">no brews yet.<br>tap ＋ new brew to start.</div>'));
  if(kast.length){
    uit+='<button class="extra-kast" onclick="toggleReserve()"><svg viewBox="0 0 24 24" class="acic"><path d="M5.8 9.3 Q5.4 7.2 7.3 7 Q12 6.6 16.7 7 Q18.6 7.2 18.2 9.2 M18.1 8.7 Q18.4 13 18.1 17.1 Q18.3 18.8 16.4 19 Q12 19.4 7.4 19 Q5.5 18.8 5.9 17 Q5.4 12.9 6.1 8.5"/><path d="M9.4 7.1 Q9.2 5.3 9.5 3.8 Q12 3.5 14.5 3.9 Q14.8 5.5 14.6 7.2" opacity="0.6"/><path d="M8.8 12.4 Q12 12 15.3 12.6" opacity="0.5"/></svg> the vault \u00b7 '+
      kast.length+' brew'+(kast.length===1?'':'s')+' with a bean that\u2019s gone '+(reserveOpen?'\u25be':'\u25b8')+'</button>';
    if(reserveOpen){
      uit+='<div class="kast-head">the bean is no longer in stock \u2014 your recipe stays saved</div>';
      uit+=kast.map(brewCardNew).join('');
    }
  }
  document.getElementById('all-list').innerHTML=uit;
}
function renderStats_DISABLED(){
}



/* ---------------- formulier + calculator ---------------- */
let editingId=null,formMethod=null,formBean=null,formTags=[],formCustom=[],pendingTarget=null,formPrep={},pendingRecipe=null,formRecipeSnapshot=null;
let formBed=null;   // vlak / krater / muur, zoals het bed erbij lag
let formCup=null;   // hoe de kop smaakte, voor het kompas
let formMolen=null; // de molen waarop je deze maalstand draaide
let molenZelf=false;// zelf gekozen? dan blijft de app eraf
let formOud={};     // velden van een oudere brew die geen invoerveld meer hebben
function setVal(id,v){const el=document.getElementById(id);if(el)el.value=(v==null?'':v);}
// laat een tekstvak meegroeien met de inhoud (geen klein scroll-vakje meer)
function autoGrow(el){if(!el)return;el.style.height='auto';el.style.height=Math.max(el.scrollHeight+4,190)+'px';}
function numOf(v){const m=(''+(v==null?'':v)).match(/[\d.]+/);return m?m[0]:'';}
function cleanTime(v){return (''+(v==null?'':v)).replace(/[^\d:]/g,'');}
// tijd "mm:ss" of "ss" -> seconden
function parseTimeSec(t){if(t==null)return null;const s=(''+t).trim();if(!s)return null;
  if(s.includes(':')){const[m,ss]=s.split(':');return (+m||0)*60+(+ss||0);}const n=+s;return isNaN(n)?null:n;}
// korte maalstand voor het maling-veld (knip lange uitleg eraf)
function conciseGrind(v){v=(''+(v==null?'':v)).trim();if(!v)return v;
  let s=v.split(/\s+op\s+|\s*[(,;]/)[0].trim();return s.length<=28?s:s.slice(0,28).trim();}
// tijd altijd als m:ss — je typt alleen cijfers, de dubbelepunt komt vanzelf
function formatTime(el){
  let d=el.value.replace(/\D/g,'').slice(0,4);
  el.value = !d ? '' : (d.length<=2 ? d : d.slice(0,d.length-2)+':'+d.slice(-2));
  try{renderDialInHint();}catch(e){}
}
function normalizeTime(el){
  let d=el.value.replace(/\D/g,'').slice(0,4);
  if(!d){el.value='';return;}
  const ss=d.length<=2?d.padStart(2,'0'):d.slice(-2);
  const mm=d.length<=2?'0':d.slice(0,-2);
  el.value=mm+':'+ss;
  try{renderDialInHint();}catch(e){}
}
// korte weergave van een doel-shot, bv. "18g in · maling 1.3 · 27s · 36g uit"
function fmtShot(t){
  if(!t)return '';
  const parts=[];
  if(t.dose)parts.push(t.dose+'g in');
  if(t.grind)parts.push('grind '+t.grind);
  if(t.time)parts.push(t.time);
  if(t.yield)parts.push(t.yield+'g out');
  return parts.join(' · ');
}
/* ---------------- dial-in: doel, nieuwe poging & AI-maaladvies ---------------- */
// open een nieuwe poging op basis van een eerdere brew (methode, boon, dose,
// maling, doel) — je meet alleen je nieuwe tijd en slaat op
function brewAgain(id){
  const src=state.brews.find(x=>x.id===id);
  if(!src){beginBrew();return;}
  // espresso -> dial-in-scherm met het vorige als doel
  if(methodFamily(src.method)==='espresso'){
    formMethod=src.method;formBean=src.beanId||null;
    pendingTarget=src.target||{dose:src.dose?String(src.dose):'',yield:src.yield?String(src.yield):'',time:src.time||'',grind:src.grind||''};
    formPrep=src.prep?JSON.parse(JSON.stringify(src.prep)):{};
    openDialIn(src.method);
    toast('new attempt — measure your shot time');
    return;
  }
  openForm(src.method);
  setVal('f-dose',src.dose);setVal('f-yield',src.yield);setVal('f-ratio',src.ratio);
  setVal('f-grind',src.grind||'');setVal('f-temp',src.temp);
  formBean=src.beanId||null;renderFormBeans();
  formTags=Array.isArray(src.tags)?[...src.tags]:[];renderFormTags();
  // doel meenemen: de vorige target, anders de vorige brew zelf als richtlijn
  pendingTarget=src.target||{dose:src.dose,grind:src.grind||'',time:src.time||'',yield:src.yield};
  formPrep=src.prep?JSON.parse(JSON.stringify(src.prep)):{};renderPrep();
  renderDialInHint();
  toast('new attempt — measure your time, adjust and save');
}
// toon het doel + een LIVE maaltip (tijd vs doel) + het laatste AI-advies
function renderDialInHint(){
  const el=document.getElementById('dialin-hint');if(!el)return;
  let html='';
  if(pendingTarget && fmtShot(pendingTarget)){
    html+='<div class="di-t">target</div>'+esc(fmtShot(pendingTarget));
  }
  // live: vergelijk je ingevulde tijd met de doel-tijd terwijl je typt
  if(pendingTarget && pendingTarget.time){
    const actual=parseTimeSec(document.getElementById('f-time')?.value);
    const target=parseTimeSec(pendingTarget.time);
    if(actual&&target){
      const diff=actual-target, tol=target<=60?3:Math.max(8,Math.round(target*0.1));
      let tip;
      if(diff>tol)tip='slower than target → grind a bit coarser';
      else if(diff<-tol)tip='faster than target → grind a bit finer';
      else tip='right on target ✓';
      html+='<div class="di-tip">⏱ '+esc(document.getElementById('f-time').value)+' vs target '+esc(pendingTarget.time)+' → '+tip+'</div>';
    }
  }
  // opgeslagen AI-advies van de vorige poging(en)
  const bean=beanById(formBean);
  if(bean&&bean.dialIn&&bean.dialIn.method===formMethod&&bean.dialIn.grind){
    html+='<div class="di-tip">✦ AI tip: try grind '+esc(bean.dialIn.grind)+(bean.dialIn.reason?' — '+esc(bean.dialIn.reason):'')+'</div>';
  }
  el.innerHTML=html;el.style.display=html?'block':'none';
}
// leer op de achtergrond van alle pogingen van deze boon en bereken de volgende maalstand
async function updateDialIn(beanId,method){
  const bean=beanById(beanId);if(!bean)return;
  const attempts=state.brews.filter(b=>b.beanId===beanId&&b.method===method&&(b.time||b.grind))
    .sort((a,b)=>a.ts-b.ts);
  if(!attempts.length||!aiReady())return;   // zonder AI: gewoon opgeslagen, geen berekening
  try{
    const grinder=(state.gear||[]).filter(g=>g.kind==='grinder'&&g.name).map(gearLabel).join(', ');
    // doel afleiden uit de laatste poging (yield/tijd) en de doorloopsnelheid vergelijken
    const last=attempts[attempts.length-1];
    const esp=methodFamily(method)==='espresso';
    const tgt=last.target||{};
    const tY=parseFloat(tgt.yield)||36, tT=parseTimeSec(tgt.time)||28;
    // bij filter is het doel de tijd van het recept, niet een opbrengst per seconde
    const rcp=esp?null:recipeById((state.lastRecipe||{})[method]);
    const fDoel=rcp?(rcp.stappen[rcp.stappen.length-1].t+40):190;
    const fTijd=Math.floor(fDoel/60)+':'+String(fDoel%60).padStart(2,'0');
    const lines=attempts.map((a,i)=>{
      const aY=parseFloat(a.yield)||null, aT=parseTimeSec(a.time)||null;
      if(esp){
        const flow=(aY&&aT)?(aY/aT).toFixed(2):'?';
        return `${i+1}) maling ${a.grind||'?'}: ${a.dose||'?'}g in → ${aY||'?'}g uit in ${a.time||'?'} (doorloop ${flow} g/s)`;
      }
      const smaak=a.cup?(cupById(a.cup)||{}).nl:'';
      return `${i+1}) maling ${a.grind||'?'}: ${a.dose||'?'}g op ${aY||'?'}g water, totaal ${a.time||'?'}`+
        (a.draw?`, doorlooptijd ${a.draw}`:'')+(a.bed?`, bed ${bedNL(a.bed)}`:'')+(smaak?`, geproefd: ${smaak}`:'');
    }).join('\n');
    let richting='onbekend — te weinig data';
    if(esp){
      const laY=parseFloat(last.yield)||null, laT=parseTimeSec(last.time)||null;
      if(laY&&laT){const f=laY/laT, ft=tY/tT;
        richting = f<ft*0.85 ? 'TE LANGZAAM (te weinig opbrengst voor de tijd / choking) → GROVER malen'
                : f>ft*1.15 ? 'TE SNEL (te veel/te snel opbrengst, waterig) → FIJNER malen'
                            : 'op doel — maling ongeveer aanhouden';}
    }else{
      const c=last.cup?cupById(last.cup):null;
      const dw=parseTimeSec(last.draw);
      if(c&&c.id!=='goed')richting=c.nl+' → '+c.fixnl;
      else if(dw&&dw>75)richting='doorlooptijd boven de 75 s: het bed loopt vast → GROVER malen en minder roeren';
      else if(c&&c.id==='goed')richting='op doel — maling aanhouden';
    }
    const prompt=`Je bent een ${esp?'espresso dial-in':'filter'}-expert. Boon "${bean.name}", methode "${methodById(method).name}".`+
      (grinder?` Molen(s) van de gebruiker: ${grinder}. Als je de molen kent, gebruik de juiste getalsrichting (welk getal grover/fijner is); staat er een grind range bij, laat de grootte van je voorgestelde stap in verhouding staan tot die schaal (op een schaal van 1-100 is +1 piepklein, op een schaal van 1-10 is dat al een flinke sprong).`:'')+
      (esp?`\nDOEL: ${tY} g uit in ~${tT} s (ratio ~1:2), doelsnelheid ${(tY/tT).toFixed(2)} g/s.\n`
          :`\nDOEL: een schone kop met een totale tijd rond ${fTijd} en een doorlooptijd onder de minuut.\n`)+
      APP_RULES+`\n`+BEAN_GRIND_RULES+`\n`+(esp?ESPRESSO_RULES:FILTER_RULES)+`\n`+beanPromptBlock(bean)+`\n`+
      `Pogingen (oud→nieuw):\n${lines}\n`+
      `Oordeel over de laatste ${esp?'shot':'kop'}: ${richting}.\n`+
      (esp?'':`De doorlooptijd (van de laatste giet tot het bed droogvalt) weegt zwaarder dan de totale tijd.\n`)+
      `Geef de beste maalstand voor de VOLGENDE poging, in exact die richting. Geef ALLEEN JSON zonder markdown: {"grind":"","reason":""}. grind = KORTE maalstand (getal/klikken of relatief zoals "+1" of "-0.5", passend bij de schaal die de gebruiker gebruikt; GEEN uitleg). reason = één korte zin met de juiste richting (bv. "te weinig opbrengst → grover"). Nederlands.`;
    const txt=await askAI([{role:"user",content:prompt}],250,'brew');
    const d=extractJSON(txt);
    if(d&&d.grind){
      bean.dialIn={method,grind:conciseGrind(d.grind),reason:(d.reason||'').trim(),ts:Date.now()};
      save();
      toast('✦ AI grind tip: next time grind '+bean.dialIn.grind+(bean.dialIn.reason?' — '+bean.dialIn.reason:''));
    }
  }catch(e){/* stil: volgende keer weer proberen */}
}
function openForm(methodId){
  editingId=null;formRecipeSnapshot=null;const valid=methodId&&state.methods.find(m=>m.id===methodId&&m.on);formMethod=valid?methodId:(state.methods.filter(m=>m.on)[0]?.id||'espresso');
  document.getElementById('form-title').textContent='new brew';
  ['f-title','f-dose','f-yield','f-ratio','f-time','f-temp','f-grind','f-notes','f-tagnew','f-bloom-g','f-bloom-s','f-draw','f-brewer'].forEach(i=>setVal(i,''));
  formBed=null;formCup=null;formMolen=null;molenZelf=false;bloomZelf={g:false,s:false};formOud={};
  setVal('f-score',8);document.getElementById('score-big').textContent='8.0';
  formBean=null;formTags=[];formCustom=[];pendingTarget=null;formPrep={};wheelOpen=null;
  if(featOn('smartdefaults')){
    const last=state.brews.filter(x=>x.method===formMethod).sort((a,b)=>b.ts-a.ts)[0];
    if(last){setVal('f-dose',last.dose||'');setVal('f-yield',last.yield||'');setVal('f-ratio',last.ratio||'');
      setVal('f-temp',last.temp||'');setVal('f-grind',last.grind||'');
      // brewer en molen veranderen zelden: die mogen blijven staan
      setVal('f-brewer',last.brewer||'');formMolen=last.grinder||null;}
  }
  renderFormMethods();renderFormBeans();renderFormTags();renderCustomFields();renderDialInHint();renderFormMolens();applyAIVisibility();go('form');
}
function openEdit(b){
  if(!b)return;
  editingId=b.id;formMethod=b.method;
  document.getElementById('form-title').textContent='edit brew';
  setVal('f-title',b.title||'');
  setVal('f-dose',b.dose);setVal('f-yield',b.yield);setVal('f-ratio',b.ratio);
  setVal('f-time',b.time);setVal('f-temp',b.temp);setVal('f-notes',b.notes);
  setVal('f-grind',b.grind||'');
  setVal('f-bloom-g',(b.bloom&&b.bloom.g)||'');setVal('f-bloom-s',(b.bloom&&b.bloom.s)||'');
  setVal('f-draw',b.draw||'');setVal('f-brewer',b.brewer||'');
  formMolen=b.grinder||null;molenZelf=!!b.grinder;bloomZelf={g:!!(b.bloom&&b.bloom.g),s:!!(b.bloom&&b.bloom.s)};
  // papier en water hebben geen veld meer; van oudere brews gooien we ze niet weg
  formOud={paper:b.paper||'',water:b.water||''};
  formBed=b.bed||null;formCup=b.cup||null;
  setVal('f-score',b.score||8);
  document.getElementById('score-big').textContent=(+(b.score||8)).toFixed(1);
  formBean=b.beanId||null;formTags=Array.isArray(b.tags)?[...b.tags]:[];wheelOpen=null;
  formCustom=Array.isArray(b.custom)?JSON.parse(JSON.stringify(b.custom)):[];
  pendingTarget=b.target||null;
  formPrep=b.prep?JSON.parse(JSON.stringify(b.prep)):{};
  renderFormMethods();renderFormBeans();renderFormTags();renderCustomFields();renderDialInHint();renderFormMolens();applyAIVisibility();go('form');
}
function renderCustomFields(){
  const el=document.getElementById('custom-fields');if(!el)return;
  el.innerHTML=formCustom.map((c,i)=>
    `<div class="field-row" style="margin-bottom:8px">
      <input value="${esc(c.k)}" placeholder="name" oninput="formCustom[${i}].k=this.value" style="flex:1">
      <input value="${esc(c.v)}" placeholder="value" oninput="formCustom[${i}].v=this.value" style="flex:1">
      <button class="tag-add-btn" onclick="formCustom.splice(${i},1);renderCustomFields()">×</button>
    </div>`).join('');
}
function addCustomField(){formCustom.push({k:'',v:''});renderCustomFields();}
function renderFormMethods(){
  document.getElementById('form-methods').innerHTML=state.methods.filter(m=>m.on).map(m=>
    `<button class="mp ${m.id===formMethod?'sel':''}" onclick="pickMethod('${m.id}')"><span class="mp-ic">${iconHTML(m,30)}</span> ${esc(m.name)}</button>`
  ).join('');
  applyFamilyToForm();
}
// pas het formulier aan de familie (espresso/filter) aan
function applyFamilyToForm(){
  const fam=methodFamily(formMethod);
  const yl=document.getElementById('f-yield-label');
  if(yl)yl.textContent=(fam==='filter')?'water (g)':'yield (g)';
  const rh=document.getElementById('f-ratio-hint');
  if(rh)rh.textContent=(fam==='filter')?'auto-calculates from dose + water':'auto-calculates from dose + yield';
  // puck-prep alleen bij espresso tonen
  const pf=document.getElementById('prep-field');
  if(pf){pf.style.display=(fam==='espresso')?'block':'none';if(fam==='espresso')renderPrep();}
  // bloom alleen bij filter tonen
  const bf=document.getElementById('bloom-field');
  if(bf)bf.style.display=(fam==='filter')?'flex':'none';
  // doorlooptijd, bedvorm, brewer en papier: alleen bij filter
  const kaarten=(fam==='filter')&&!['perculator','senseo'].includes(formMethod)&&featOn('pourcoach')&&recipesFor(formMethod).length>0;
  if(kaarten)kaartenAan(); else kaartenUit();
  // drawdown en bedvorm horen bij een zichtbaar bed (v60, chemex, kalita...):
  // bij AeroPress pers je het weg, dus is er geen bed dat "droogloopt"
  const fx=document.getElementById('filter-extra');
  if(fx)fx.style.display=(fam==='filter'&&featOn('drawdown')&&formMethod!=='aeropress')?'block':'none';
  // brewer en molen horen bij élke brew: een espressomachine met zijn molen
  // net zo goed als een v60 met de zijne
  const fg=document.getElementById('filter-gear');
  if(fg)fg.style.display='block';
  const gl=document.getElementById('f-gear-lbl');
  if(gl)gl.textContent=(fam==='espresso')?'machine & grinder':'brewer & grinder';
  const brv=document.getElementById('f-brewer');
  if(brv)brv.placeholder=(fam==='espresso')?'machine, e.g. Rocket Appartamento':'brewer, e.g. Hario V60 02';
  const ft=document.getElementById('filter-taste');
  if(ft)ft.style.display=(fam==='filter'&&featOn('filtercompass'))?'block':'none';
  if(fam==='filter'){renderBedPick();renderCupPick();}
  renderGearChips();renderFormMolens();vulGearAuto();vulBloomAuto();
  pourInit();
}
/* ---------------- de waterkaart ----------------
   Twee zouten, twee knoppen. 1 g epsomzout in een liter geeft ~406 ppm hardheid
   (als CaCO3), 1 g baksoda ~596 ppm alkaliniteit. Daar reken je gewoon mee
   terug naar het doel dat je intikt.                                      */
const WATER_PER_G_GH=406, WATER_PER_G_KH=596;
const WATER_PRESETS=[
  {id:'filter', n:'filter', gh:70, kh:40, t:'helder en zoet, laat fruitzuren staan'},
  {id:'espresso', n:'espresso', gh:110, kh:60, t:'iets meer buffer tegen scherpe zuren en ketelsteen'},
  {id:'sca', n:'SCA-midden', gh:68, kh:40, t:'het midden van de SCA-band'},
  {id:'zacht', n:'heel zacht', gh:45, kh:20, t:'maximale helderheid, kan dun worden'},
];
function waterPresets(){
  const el=document.getElementById('wt-presets');if(!el)return;
  el.innerHTML=WATER_PRESETS.map(p=>
    `<button type="button" class="lp" onclick="waterPreset('${p.id}')">${esc(p.n)}</button>`).join('');
}
function waterPreset(id){
  const p=WATER_PRESETS.find(x=>x.id===id);if(!p)return;
  setVal('wt-gh',p.gh);setVal('wt-kh',p.kh);waterCalc();
}
function waterCalc(){
  const el=document.getElementById('wt-out');if(!el)return;
  const gh=parseFloat(document.getElementById('wt-gh').value)||0;
  const kh=parseFloat(document.getElementById('wt-kh').value)||0;
  const l=parseFloat(document.getElementById('wt-l').value)||1;
  const eps=(gh/WATER_PER_G_GH)*l, bic=(kh/WATER_PER_G_KH)*l;
  const g=v=>v<0.1?(Math.round(v*1000)+' mg'):(v.toFixed(2).replace('.',',')+' g');
  let waarschuwing='';
  if(kh>gh)waarschuwing='Meer alkaliniteit dan hardheid dempt je zuren sterker dan dat je aroma lostrekt — bij lichte brandingen wil je dat meestal niet.';
  else if(gh>150)waarschuwing='Boven de 150 ppm gaat hardheid maskeren en kalkt je apparaat sneller aan.';
  else if(gh<40)waarschuwing='Onder de 40 ppm valt de body weg: helder, maar vaak ook dun.';
  el.innerHTML=`<div class="wo-l"><span>epsomzout (magnesiumsulfaat)</span><b>${g(eps)}</b></div>
    <div class="wo-l"><span>baksoda (natriumbicarbonaat)</span><b>${g(bic)}</b></div>
    <div class="wo-l"><span>op</span><b>${(l+'').replace('.',',')} liter demiwater</b></div>
    <div class="wt-note">Los ze apart op, roer tot alles weg is, en gebruik dezelfde basis voor elke brew.
      ${waarschuwing?('<br>'+esc(waarschuwing)):''}</div>`;
}
/* ---------------- het filterkompas ----------------
   Twee assen, geen refractometer nodig. Links-rechts is de extractie (die stel
   je bij met de maling), boven-onder de sterkte (die stel je bij met de ratio).
   Wie wel een refractometer heeft mag zijn TDS invullen voor het echte cijfer. */
const FILTER_CUPS=[
  {id:'goed',   n:'just right', nl:'precies goed', fixnl:'niets veranderen', x:0,    y:0,    fix:'keep everything the same',
   why:'nothing to change. Write down your grind so you can find your way back here.'},
  {id:'zuur',   n:'sour & thin', nl:'zuur en dun', fixnl:'een stap FIJNER malen', x:-0.85, y:-0.45, fix:'grind one step finer',
   why:'sour and thin is the signature of under-extraction: the water was through before it had taken enough with it.'},
  {id:'scherp', n:'sharp but strong', nl:'scherp maar stevig', fixnl:'een stap FIJNER malen', x:-0.7, y:0.55, fix:'grind one step finer',
   why:'enough coffee in the cup, but not enough of it dissolved. Finer, and leave the ratio alone.'},
  {id:'vlak',   n:'flat & watery', nl:'vlak en waterig', fixnl:'minder water of meer koffie (ratio), niet de maling', x:0,   y:-0.85, fix:'use less water, or more coffee',
   why:'this is a strength problem, not an extraction one. Move the ratio toward 1:15 before you touch the grind.'},
  {id:'bitter', n:'bitter & dry', nl:'bitter en droog', fixnl:'een stap GROVER malen', x:0.85, y:0.3,  fix:'grind one step coarser',
   why:'you pulled too much out of it. Coarser is the first move; only then look at temperature.'},
  {id:'droog',  n:'astringent', nl:'droog en samentrekkend', fixnl:'GROVER malen, minder roeren, lager gieten', x:0.9,  y:-0.2, fix:'grind coarser and pour gentler',
   why:'that dry, mouth-puckering edge usually comes from fines clogging the bed. Grind coarser, stir less, pour from lower.'},
];
function cupById(id){return FILTER_CUPS.find(c=>c.id===id)||null;}
function renderCupPick(){
  const el=document.getElementById('f-cup');if(!el)return;
  el.innerHTML=FILTER_CUPS.map(c=>
    `<button type="button" class="cup-opt ${formCup===c.id?'sel':''}" onclick="pickCup('${c.id}')">${esc(c.n)}</button>`).join('');
}
function pickCup(id){formCup=(formCup===id)?null:id;renderCupPick();cardSummaries();}
// echte extractie als je een refractometer hebt: het water dat eruit komt is
// het water dat erin ging min wat het koffiebed vasthoudt (~2 g per gram koffie)
function extractionYield(b){
  const tds=parseFloat(b&&b.tds), dose=parseFloat(b&&b.dose), water=parseFloat(b&&b.yield);
  if(!(tds>0&&dose>0&&water>0))return null;
  const uit=water-dose*2;
  if(uit<=0)return null;
  const ey=(tds*uit)/dose;
  return Math.round(ey*10)/10;
}
function setBrewTds(id,v){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  const n=parseFloat((v||'').replace(',','.'));
  b.tds=(n>0?n:null);save();openDetail(id);
}
function filterCompassHTML(b){
  if(!featOn('filtercompass'))return '';
  const c=cupById(b.cup);
  const ey=extractionYield(b);
  if(!c&&ey==null&&!b.tds)return '';
  // positie: de smaak is leidend, het meetcijfer mag hem verschuiven
  let x=c?c.x:0, y=c?c.y:0;
  if(ey!=null)x=Math.max(-1,Math.min(1,(ey-20)/3));
  if(b.ratio)y=Math.max(-1,Math.min(1,(16-parseFloat(b.ratio))/2.5));
  const px=170+x*100, py=100-y*60;
  let fix=c?c.fix:'', why=c?c.why:'';
  // een trage doorloop bij bitter wijst eerder op een verstopt bed dan op te fijn
  if(c&&(c.id==='bitter'||c.id==='droog')&&parseTimeSec(b.draw)>60)
    why+=' Your drawdown was over a minute, so the bed was choking — that is the part to fix first.';
  if(c&&c.id==='vlak'&&b.ratio&&parseFloat(b.ratio)>16.5)
    why+=' You brewed at 1:'+(+b.ratio).toFixed(1)+'; try 1:15.5 with the same grind.';
  if(ey!=null)why+=' Measured extraction '+ey+' % (the window is 18 to 22 %).';
  return `<div class="notes-card sketch soft fc-card">
    <div class="k">filter compass</div>
    <svg class="fc-svg" viewBox="0 0 300 200" role="img" aria-label="Kompas: extractie horizontaal, sterkte verticaal">
      <path d="M52 22 Q54 100 52 176"/><path d="M44 170 Q150 172 288 169"/>
      <path d="M48 30 L52 20 L57 31"/><path d="M280 163 L290 169 L280 175"/>
      <path d="M130 68 Q170 65 211 69"/><path d="M212 67 Q214 100 211 133"/>
      <path d="M211 132 Q170 136 130 132"/><path d="M129 134 Q126 100 131 66"/>
      <path class="dot" d="M${(px+6).toFixed(1)} ${(py-6).toFixed(1)} Q${(px+9).toFixed(1)} ${py} ${(px+6).toFixed(1)} ${(py+6).toFixed(1)} Q${px} ${(py+9).toFixed(1)} ${(px-6).toFixed(1)} ${(py+6).toFixed(1)} Q${(px-9).toFixed(1)} ${py} ${(px-6).toFixed(1)} ${(py-6).toFixed(1)} Q${px} ${(py-9).toFixed(1)} ${(px+7).toFixed(1)} ${(py-5).toFixed(1)}"/>
      ${(Math.abs(x)>0.25||Math.abs(y)>0.25)?`<path class="arr" d="M${px.toFixed(1)} ${py.toFixed(1)} L${(170-x*22).toFixed(1)} ${(100+y*14).toFixed(1)}"/>`:''}
      <text x="64" y="42">sour &amp; strong</text><text x="215" y="42">bitter &amp; strong</text>
      <text x="64" y="162">sour &amp; thin</text><text x="215" y="162">bitter &amp; dry</text>
      <text x="140" y="104">on target</text>
      <text x="96" y="190">&#8592; under</text><text x="196" y="190">over &#8594;</text>
      <text x="8" y="56">strong</text><text x="16" y="160">thin</text>
    </svg>
    ${fix?'<div class="fc-fix">next time: '+esc(fix)+'</div>':''}
    ${why?'<div class="fc-why">'+esc(why)+'</div>':''}
    <div class="fc-tds">
      <label>got a refractometer? enter TDS %</label>
      <input value="${b.tds!=null?esc(String(b.tds)):''}" placeholder="1.35" inputmode="decimal"
        onchange="setBrewTds('${b.id}',this.value)">
    </div>
  </div>`;
}
/* ---------------- doorlooptijd & het koffiebed ----------------
   Het bed vertelt je iets wat je in geen enkel getal terugziet: een krater
   betekent te hard gegoten, een droge rand betekent dat een deel van je koffie
   niet heeft meegedaan. Allebei gietfouten, geen maalfouten.            */
const BED_SHAPES=[
  {id:'vlak', n:'flat', nl:'vlak', d:'as it should be',
   svg:'<path d="M6 8 Q22 5 38 8"/><path d="M7 8 Q15 23 20 31"/><path d="M37 8 Q29 23 24 31"/><path d="M20 31 Q22 33 24 31"/><path d="M11 18 Q22 15 33 18"/>'},
  {id:'krater', n:'crater', nl:'krater (te hard gegoten)', d:'poured too hard',
   svg:'<path d="M6 8 Q22 5 38 8"/><path d="M7 8 Q15 23 20 31"/><path d="M37 8 Q29 23 24 31"/><path d="M20 31 Q22 33 24 31"/><path d="M11 15 Q17 23 22 24 Q27 23 33 15"/>'},
  {id:'muur', n:'wall', nl:'droge rand blijven staan', d:'dry rim left standing',
   svg:'<path d="M6 8 Q22 5 38 8"/><path d="M7 8 Q15 23 20 31"/><path d="M37 8 Q29 23 24 31"/><path d="M20 31 Q22 33 24 31"/><path d="M10 12 Q16 21 22 21 Q28 21 34 12"/><path d="M11 11 Q12 15 13 17"/><path d="M33 11 Q32 15 31 17"/>'},
];
function renderBedPick(){
  const el=document.getElementById('f-bed');if(!el)return;
  el.innerHTML=BED_SHAPES.map(b=>
    `<button type="button" class="bed-opt ${formBed===b.id?'sel':''}" onclick="pickBed('${b.id}')">
      <svg viewBox="0 0 44 34">${b.svg}</svg>
      <span class="bo-n">${esc(b.n)}</span><span class="bo-d">${esc(b.d)}</span>
    </button>`).join('');
}
function pickBed(id){formBed=(formBed===id)?null:id;renderBedPick();}
function bedName(id){const b=BED_SHAPES.find(x=>x.id===id);return b?b.n:'';}
function bedNL(id){const b=BED_SHAPES.find(x=>x.id===id);return b?(b.nl||b.n):'';}
// snelkiezers uit je gear-lijst, zodat je een merk niet elke keer overtypt.
// molens staan hier niet tussen: die hebben hun eigen rij, want zij horen bij
// de maalstand en niet bij de brewer.
function renderGearChips(){
  const el=document.getElementById('f-gearchips');if(!el)return;
  el.innerHTML=gearVoor(formMethod).filter(g=>g.kind!=='grinder').map(g=>
    `<button type="button" class="lp" onclick="fillGear(${jsArg(g.name)})">${esc(g.name)}</button>`).join('');
}
function fillGear(naam){
  const br=document.getElementById('f-brewer');
  if(br)br.value=naam;
  cardSummaries();
}
/* De molen bij deze brew. Een maalstand zonder molen zegt niets -- 1.3 op de
   ene molen is grof en op de andere fijn -- dus kies je hem hier aan, en het
   maalbereik uit gear komt onder het maalstandveld te staan.               */
function molensVoor(mid){
  const bij=gearVoor(mid).filter(g=>g.kind==='grinder');
  return bij.length?bij:(state.gear||[]).filter(g=>g.kind==='grinder');
}
function renderFormMolens(){
  const el=document.getElementById('f-molens');if(!el)return;
  const lijst=molensVoor(formMethod), note=document.getElementById('f-molen-note');
  if(formMolen&&!lijst.some(g=>g.name===formMolen))formMolen=null;
  if(!formMolen&&!molenZelf&&lijst.length===1)formMolen=lijst[0].name;
  el.innerHTML=lijst.map(g=>
    `<button type="button" class="lp ${g.name===formMolen?'sel':''}" onclick="pickFormMolen(${jsArg(g.name)})">${esc(g.name)}</button>`).join('');
  if(note)note.textContent=lijst.length?'':
    'no grinder in your gear yet — add one under profile → gear with its grind range';
  renderGrindNote();
}
function pickFormMolen(naam){
  formMolen=(formMolen===naam)?null:naam;molenZelf=true;
  renderFormMolens();cardSummaries();
}
/* ---- de opzet die je al kent ----
   Je kiest een boon en een methode; daarmee ligt de rest grotendeels vast.
   Welke brewer? Die staat er al: v60 is de v60. Welke molen? De enige die
   je aan deze methode hebt gehangen, of die van je vorige brew ermee.
   Alleen lege velden worden gevuld, en zodra je zelf iets kiest houdt de app
   zijn mond -- automatisch invullen mag nooit je eigen keuze overschrijven. */
function laatsteBrewVoor(mid){
  return state.brews.filter(x=>x.method===mid).sort((a,b)=>b.ts-a.ts)[0]||null;
}
function vulGearAuto(){
  const mid=formMethod, m=methodById(mid);
  const laatste=laatsteBrewVoor(mid);
  const br=document.getElementById('f-brewer');
  if(br&&!br.value.trim()){
    const brewers=gearVoor(mid).filter(g=>g.kind==='brewer');
    const eerder=laatste&&laatste.brewer;
    // bij filter is de methode het apparaat: een v60 brouw je in een v60. Bij
    // espresso niet -- "espresso" is geen machine, dus daar blijft het leeg
    const uitMethode=(methodFamily(mid)==='filter'&&m&&m.name)||'';
    br.value=(eerder&&(!brewers.length||brewers.some(g=>g.name===eerder))?eerder:'')
      ||(brewers.length===1?brewers[0].name:'')
      ||uitMethode;
  }
  if(!formMolen&&!molenZelf){
    const molens=molensVoor(mid);
    const eerder=laatste&&laatste.grinder;
    if(eerder&&molens.some(g=>g.name===eerder))formMolen=eerder;
    else if(molens.length===1)formMolen=molens[0].name;
  }
  renderFormMolens();
}
/* De versheid van de boon zegt hoeveel gas erin zit, en dus hoe groot en hoe
   lang je bloom moet zijn. Die stond al als tekst in de bean-kaart; nu staat
   hij ook gewoon in de velden, zodat je hem niet hoeft over te typen.      */
let bloomZelf={g:false,s:false};
function bloomHandmatig(veld){bloomZelf[veld]=true;}
function vulBloomAuto(){
  if(methodFamily(formMethod)!=='filter')return;
  const bean=beanById(formBean);
  const f=bean?beanFreshness(bean):null;
  const h=f?freshBloomHint(f.days):null;
  if(!h)return;
  const dose=parseFloat(document.getElementById('f-dose').value)||0;
  const g=document.getElementById('f-bloom-g'), s=document.getElementById('f-bloom-s');
  if(g&&dose&&!bloomZelf.g)g.value=Math.round(dose*h.mult);
  if(s&&!bloomZelf.s)s.value=h.sec;
}
// het bereik van de gekozen molen, pal onder het maalstandveld
function renderGrindNote(){
  const el=document.getElementById('f-grind-note');if(!el)return;
  const g=(state.gear||[]).find(x=>x.kind==='grinder'&&x.name===formMolen);
  if(!g){el.style.display='none';el.textContent='';return;}
  el.style.display='';
  el.textContent=(g.grindMin!=null&&g.grindMax!=null)
    ? ('on your '+g.name+' — '+g.grindMin+' to '+g.grindMax)
    : ('on your '+g.name);
}
/* ---------------- het receptenboek ----------------
   De klassiekers staan hier, niet in de coach: kiezen doe je vooraf, gieten
   doe je daarna. Aantikken zet het recept klaar en opent New brew.       */
// bij welke van jouw methodes hoort dit recept?
function methodForRecipe(r){
  if(!r)return null;
  const aan=state.methods.filter(m=>m.on&&methodFamily(m)===recipeFam(r));
  if(r.mid&&aan.find(m=>m.id===r.mid))return r.mid;
  for(const v of (r.voor||[])){
    const m=aan.find(x=>x.id===v||(x.name||'').toLowerCase().includes(v));
    if(m)return m.id;
  }
  return (aan[0]||{}).id||null;
}
/* ---------------- eigen recepten ----------------
   Een recept is een lijstje stappen. Je vult ze zelf in of laat de AI een
   voorstel doen; in beide gevallen sta jij erin met de hand. Intern bewaren we
   elk gietdoel als deel van het totaal, zodat het meeschaalt als je een andere
   dose gebruikt dan waarmee je het opschreef.                              */
const STAP_SOORTEN=['bloom','giet','swirl','roer','wacht','keer','pers','doorloop','dose','shot','stop','melk'];
/* Zet je omgekeerd, dan is er precies één moment dat er echt iets gebeurt: het
   omkeren. Dat moet je niet hoeven lezen -- je moet het zien. */
const HOUDINGEN=[
  {v:'normaal', n:'regular',
   u:'kopje eronder, het water werkt meteen door het filter \u2014 deels percolatie: '+
     'schoner en dunner, maar je hebt de weektijd niet in de hand'},
  {v:'omgekeerd', n:'inverted',
   u:'op de zuiger, er loopt niets door tot jij omkeert \u2014 volle immersie: '+
     'meer zoet, body en herhaalbaarheid, iets minder definitie'},
];
function isAeropress(mid){return brewerArtKey(mid)==='aeropress';}
/* Een Hario Switch is een V60 met een klep onderin. Dicht = het water blijft
   staan (immersie: zoet en body), open = het loopt door (percolatie: helderheid).
   De klep is dus geen aparte stap maar een stand die pér stap geldt. */
function isSwitch(mid){return brewerArtKey(mid)==='switch';}
const KLEP_STANDEN=[
  {v:'',      n:'klep —'},
  {v:'dicht', n:'klep dicht'},
  {v:'open',  n:'klep open'},
];
/* dicht = een gesloten poortje met het water erbovenop, open = het poortje
   staat uit elkaar en de druppel valt erdoor. Geen plusje, geen minnetje. */
const KLEP_ICOON={
  dicht:'<svg viewBox="0 0 24 24" aria-hidden="true">'+
    '<path d="M12 3.4 Q16 8.6 12.2 12 Q8.2 8.8 11.9 3.6"/>'+
    '<path d="M3.6 15.4 Q12 14.4 20.4 15.5"/></svg>',
  open:'<svg viewBox="0 0 24 24" aria-hidden="true">'+
    '<path d="M3.6 8.4 Q6.4 7.9 8.8 8.3"/><path d="M15.2 8.3 Q17.8 7.9 20.4 8.4"/>'+
    '<path d="M12 12.4 Q16 17.6 12.2 21 Q8.2 17.8 11.9 12.6"/></svg>',
};
/* een omdraaiend pijltje, met de hand getekend zoals de rest */
const PIJL_OM='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 9.4 Q6.4 4.6 11.6 4.1 Q17 3.9 18.7 8.6"/>'+
  '<path d="M18.9 4.6 Q19 7.6 18.8 8.9 Q16.6 9 14.4 8.7"/>'+
  '<path d="M18.8 14.6 Q17.6 19.4 12.4 19.9 Q7 20.1 5.3 15.4"/>'+
  '<path d="M5.1 19.4 Q5 16.4 5.2 15.1 Q7.4 15 9.6 15.3"/></svg>';
let recBewerk=null;      // {id, mid, stappen:[{t,g,k,d}]}
let recTerug=null;       // waar je vandaan kwam: daar hoor je na het opslaan weer
let recVers=null;        // net geschreven recept; dat mag het formulier overschrijven
function openRecipe(id,mid){
  recTerug=currentPage;
  const best=id?recipeById(id):null;
  const methode=mid||(best&&best.mid)||formMethod||
    (state.methods.filter(m=>m.on&&methodFamily(m)==='filter')[0]||{}).id;
  if(best&&best.eigen){
    const water=Math.round(best.dose*best.ratio);
    recBewerk={id:best.id,mid:best.mid,beanId:best.beanId||null,
      stappen:best.stappen.map(x=>({t:x.t,g:x.p?Math.round(water*x.p):'',k:x.k,klep:x.klep||'',d:x.d}))};
    setVal('rec-naam',best.naam);setVal('rec-dose',best.dose);setVal('rec-water',water);
    setVal('rec-temp',best.temp);setVal('rec-maling',best.maling);setVal('rec-over',best.over||'');
    setVal('rec-stand',best.stand||'');setVal('rec-tijd',best.tijd||'');recBewerk.molen=best.molen||null;
    recBewerk.houding=best.houding||'normaal';
  }else{
    // beginnen vanaf het recept dat nu geselecteerd staat, scheelt overtypen
    const basis=best||recipeById((state.lastRecipe||{})[methode])||recipesFor(methode)[0];
    const water=basis?Math.round(basis.dose*basis.ratio):250;
    recBewerk={id:null,mid:methode,
      stappen:basis?basis.stappen.map(x=>({t:x.t,g:x.p?Math.round(water*x.p):'',k:x.k,klep:x.klep||'',d:x.d})):[]};
    setVal('rec-naam',basis?('my '+basis.naam.toLowerCase()):'my recipe');
    setVal('rec-dose',basis?basis.dose:15);setVal('rec-water',water);
    setVal('rec-temp',basis?basis.temp:94);setVal('rec-maling',basis?basis.maling:'medium');
    setVal('rec-over','');
    // maalstand overnemen: eerst uit het basisrecept, anders uit je laatste brew
    const vorige=state.brews.filter(x=>x.method===methode&&x.grind).sort((a,b)=>b.ts-a.ts)[0];
    setVal('rec-stand',(basis&&basis.stand)||(vorige?vorige.grind:''));
    setVal('rec-tijd',(basis&&basis.tijd)||'');
    recBewerk.molen=(basis&&basis.molen)||(filterMolens()[0]||{}).name||null;
    recBewerk.houding=(basis&&basis.houding)||'normaal';
  }
  document.getElementById('rec-title').textContent=(best&&best.eigen)?'edit recipe':'own recipe';
  document.getElementById('rec-del').style.display=(best&&best.eigen)?'block':'none';
  recMethods();recMolens();recHouding();recSteps();applyAIVisibility();
  const ai=document.getElementById('rec-ai');
  if(ai)ai.style.display='';
  go('recipe');
}
// je filtermolens uit de gear-lijst, zodat de maalstand bij een molen hoort
function filterMolens(){
  const mid=(recBewerk&&recBewerk.mid)||formMethod;
  const bij=gearVoor(mid).filter(g=>g.name);
  return bij.length?bij:(state.gear||[]).filter(g=>g.name&&(g.category==='filter'||g.category==='algemeen'));
}
function recMolens(){
  const el=document.getElementById('rec-molens');if(!el)return;
  const lijst=filterMolens();
  const note=document.getElementById('rec-stand-note');
  if(!lijst.length){
    el.innerHTML='';
    if(note)note.textContent='the number you actually dial \u2014 add your grinder under profile \u2192 gear and the AI can name it';
    return;
  }
  el.innerHTML=lijst.map(g=>
    `<button class="lp ${recBewerk&&recBewerk.molen===g.name?'sel':''}" onclick="recPickMolen(${jsArg(g.name)})">${esc(g.name)}</button>`).join('');
  if(note)note.textContent='the number you actually dial \u2014 tap which grinder it belongs to';
}
function recPickMolen(naam){
  recBewerk.molen=(recBewerk.molen===naam)?null:naam;recMolens();
}
/* Normaal of omgekeerd -- alleen bij een aeropress, want alleen daar bestaat de
   keuze. Kies je omgekeerd, dan hoort er een keer-stap in het schema; die zetten
   we erin als hij er nog niet staat, vlak voor het persen. */
function recHouding(){
  const veld=document.getElementById('rec-houding-veld');if(!veld)return;
  const aan=isAeropress(recBewerk.mid);
  veld.style.display=aan?'block':'none';
  if(!aan)return;
  if(!recBewerk.houding)recBewerk.houding='normaal';
  document.getElementById('rec-houding').innerHTML=HOUDINGEN.map(h=>
    '<button class="lp '+(recBewerk.houding===h.v?'sel':'')+'" onclick="recPickHouding(\''+h.v+'\')">'+
    h.n+'</button>').join('');
  const h=HOUDINGEN.find(x=>x.v===recBewerk.houding)||HOUDINGEN[0];
  document.getElementById('rec-houding-note').textContent=h.u;
}
function recPickHouding(v){
  recBewerk.houding=v;
  const heeft=recBewerk.stappen.some(x=>x.k==='keer');
  if(v==='omgekeerd'&&!heeft){
    // vlak voor de eerste pers, of anders achteraan
    const i=recBewerk.stappen.findIndex(x=>x.k==='pers');
    const t=(i>0)?recBewerk.stappen[i-1].t+10:(recBewerk.stappen.length?
      recBewerk.stappen[recBewerk.stappen.length-1].t+10:60);
    recBewerk.stappen.push({t,g:'',k:'keer',d:'Zet je kopje erop en keer hem in één beweging om.'});
    recBewerk.stappen.sort((a,b)=>a.t-b.t);
  }
  if(v==='normaal')recBewerk.stappen=recBewerk.stappen.filter(x=>x.k!=='keer');
  recHouding();recSteps();
}
function recMethods(){
  const el=document.getElementById('rec-methods');if(!el)return;
  el.innerHTML=state.methods.filter(m=>m.on).map(m=>
    `<button class="lp ${m.id===recBewerk.mid?'sel':''}" onclick="recPickMethod('${m.id}')">${esc(m.name)}</button>`).join('')
    ||'<span class="rec-empty">turn on a method under methods first</span>';
  recFamilie();
}
function recPickMethod(id){
  recBewerk.mid=id;recMethods();recMolens();recHouding();recSteps();
  const ai=document.getElementById('rec-ai');
  if(ai)ai.style.display='';
}
// bij espresso heet het water een yield, en hoort er een doeltijd bij
function recFamilie(){
  const esp=methodFamily(recBewerk.mid)==='espresso';
  const l=document.getElementById('rec-water-lbl');
  if(l)l.textContent=esp?'yield (g)':'water (g)';
  const t=document.getElementById('rec-tijd-veld');
  if(t)t.style.display=esp?'block':'none';
  const note=document.getElementById('rec-stand-note');
  if(note&&esp)note.textContent='the number you actually dial on your espresso grinder';
}
function recWater(){
  // dose gewijzigd: water mee laten lopen met de ratio die er stond
  const d=parseFloat(document.getElementById('rec-dose').value);
  const w=parseFloat(document.getElementById('rec-water').value);
  if(d>0&&w>0&&recBewerk)recBewerk.ratio=w/d;
}
function recRatio(){recWater();}
function recSteps(){
  const el=document.getElementById('rec-steps');if(!el)return;
  const klep=isSwitch(recBewerk.mid);   // alleen een Switch heeft een klep
  if(!recBewerk.stappen.length){el.innerHTML='<div class="rec-empty">no steps yet &mdash; add one, or let AI draft it</div>';return;}
  el.innerHTML=recBewerk.stappen.map((st,i)=>`<div class="rec-row">
    <div class="r-t"><input value="${esc(pourFmt(st.t||0))}" inputmode="numeric" placeholder="0:00"
      oninput="formatTime(this)" onblur="recSet(${i},'t',this.value)"></div>
    <div class="r-mid">
      <div class="r-rij">
        <select onchange="recSet(${i},'k',this.value)">
          ${STAP_SOORTEN.map(k=>`<option value="${k}" ${st.k===k?'selected':''}>${k}</option>`).join('')}
        </select>
        ${klep?`<select class="r-klep" onchange="recSet(${i},'klep',this.value)">
          ${KLEP_STANDEN.map(o=>`<option value="${o.v}" ${(st.klep||'')===o.v?'selected':''}>${o.n}</option>`).join('')}
        </select>`:''}
      </div>
      <input value="${esc(st.d||'')}" placeholder="what do you do?" oninput="recSet(${i},'d',this.value)">
    </div>
    <div class="r-g"><input value="${st.g===''||st.g==null?'':st.g}" type="number" inputmode="numeric"
      placeholder="&mdash;" oninput="recSet(${i},'g',this.value)"></div>
    <button class="r-x" onclick="recDel(${i})" title="remove" aria-label="remove step">&times;</button>
  </div>`).join('');
}
function recSet(i,veld,v){
  const st=recBewerk.stappen[i];if(!st)return;
  if(veld==='t')st.t=parseTimeSec(v)||0;
  else if(veld==='g')st.g=(v===''?'':(parseFloat(v)||0));
  else st[veld]=v;
  if(veld==='t')recSteps();   // opnieuw tekenen zodat de tijd netjes staat
}
function recAdd(){
  const laatste=recBewerk.stappen[recBewerk.stappen.length-1];
  recBewerk.stappen.push({t:(laatste?laatste.t+30:0),g:'',k:'giet',d:''});
  recSteps();
}
function recDel(i){recBewerk.stappen.splice(i,1);recSteps();}
function cancelRecipe(){const t=recTerug;recBewerk=null;recTerug=null;goBack(t||'recipes');}
/* Terug naar het formulier met dit recept in de hand: pc.mid leegmaken laat
   pourInit opnieuw opbouwen, en recVers zorgt dat de getallen die je net
   opschreef het formulier ook echt vullen. Dat is het hele punt -- wat in de
   receptkaart staat, staat daarna in the pour.                            */
function terugNaarBrew(rid){
  pc.mid=null;recVers=rid||null;
  go('form');renderFormMethods();
  pcOpen={recipe:false,bean:false,gear:false,pour:true,log:false};renderCards();
}
function saveRecipe(){
  const naam=(document.getElementById('rec-naam').value||'').trim();
  const dose=parseFloat(document.getElementById('rec-dose').value);
  const water=parseFloat(document.getElementById('rec-water').value);
  if(!naam){toast('give it a name');return;}
  if(!(dose>0&&water>0)){toast('fill in dose and water');return;}
  if(!recBewerk.stappen.length){toast('add at least one step');return;}
  const stappen=recBewerk.stappen.slice().sort((a,b)=>a.t-b.t).map(st=>({
    t:st.t||0, p:(st.g===''||st.g==null)?0:Math.max(0,Math.min(1.5,st.g/water)),
    k:st.k||'giet', klep:(isSwitch(recBewerk.mid)&&st.klep)||null,
    d:(st.d||'').trim()||st.k||'giet'}));
  const r={id:recBewerk.id||('r_'+uid().slice(0,6)),eigen:true,mid:recBewerk.mid,
    fam:methodFamily(recBewerk.mid),
    tijd:(document.getElementById('rec-tijd').value||'').trim(),
    beanId:recBewerk.beanId||null,naam,dose,ratio:water/dose,temp:parseFloat(document.getElementById('rec-temp').value)||94,
    maling:(document.getElementById('rec-maling').value||'').trim()||'medium',
    stand:(document.getElementById('rec-stand').value||'').trim(),
    molen:recBewerk.molen||null,
    houding:isAeropress(recBewerk.mid)?(recBewerk.houding||'normaal'):null,
    over:(document.getElementById('rec-over').value||'').trim()||'your own schedule',
    voor:[recBewerk.mid],stappen};
  if(!Array.isArray(state.recipes))state.recipes=[];
  const i=state.recipes.findIndex(x=>x.id===r.id);
  if(i>=0)state.recipes[i]=r;else state.recipes.push(r);
  if(!state.lastRecipe)state.lastRecipe={};
  state.lastRecipe[r.mid]=r.id;
  save();toast('\u2713 recipe saved');
  const terug=recTerug;recBewerk=null;recTerug=null;
  if(terug==='form')terugNaarBrew(r.id);
  else if(terug==='dialin'){pendingTarget={dose:String(r.dose),yield:String(Math.round(r.dose*r.ratio)),time:r.tijd||'',grind:r.stand||''};go('dialin');renderDiGoal();}
  else{pc.mid=null;go('recipes');}
}
function delRecipe(){
  if(!recBewerk||!recBewerk.id)return;
  if(!confirm('delete this recipe?'))return;
  state.recipes=(state.recipes||[]).filter(x=>x.id!==recBewerk.id);
  const mid=recBewerk.mid;
  if(state.lastRecipe&&state.lastRecipe[mid]===recBewerk.id)delete state.lastRecipe[mid];
  const terug=recTerug;
  save();toast('recipe deleted');recBewerk=null;recTerug=null;pc.mid=null;
  if(terug==='form')terugNaarBrew(null);else go('recipes');
}
/* De AI schrijft het schema, jij houdt de pen. Alles komt in dezelfde lijst
   terecht, dus elke regel blijft daarna aan te passen.                     */
async function aiRecipeSchema(){
  const btn=document.getElementById('rec-ai');
  const m=methodById(recBewerk.mid);
  const bean=beanById(formBean);
  const dose=parseFloat(document.getElementById('rec-dose').value)||15;
  const water=parseFloat(document.getElementById('rec-water').value)||Math.round(dose*16);
  const molen=recBewerk.molen||((filterMolens()[0]||{}).name)||'';
  const oud=btn.textContent;
  btn.textContent='AI is thinking\u2026';btn.disabled=true;
  try{
    const prompt='Je bent een specialty-barista. Maak een giet-schema voor de filtermethode "'+
      (m?m.name:'v60')+'" met '+dose+' g koffie en '+water+' g water'+
      (bean?(' voor de boon '+bean.name+' ('+[bean.origin,bean.process,bean.roasternotes].filter(Boolean).join(', ')+')'):'')+
      '.'+gearPromptBlock(recBewerk.mid)+beanPromptBlock(bean)+'\n'+APP_RULES+'\n'+FILTER_RULES+'\n'+SCHEMA_RULES+'\n'+
      (molen?('De gebruiker maalt met: '+molen+'. Geef de maalstand in de schaal van die molen (klikken of getal) en noem geen andere molen.\n'):'')+
      'Geef ALLEEN JSON zonder markdown: {"temp":93,"maling":"medium","stand":"","over":"","stappen":[{"t":"0:00","k":"bloom","g":45,"d":""}]}. '+
      (isSwitch(recBewerk.mid)?'Zet bij ELKE stap ook "klep":"dicht" of "klep":"open". ':'')+
      'maling = omschrijving in woorden (bijvoorbeeld medium-grof). stand = KORTE maalstand voor het invulveld'+
      (molen?(' op de '+molen):'')+' (alleen een getal of klikken, GEEN uitleg en GEEN merknaam). '+
      't = tijd vanaf start als mm:ss. k = een van: '+STAP_SOORTEN.join(', ')+'. '+
      'g = het TOTAAL aan water dat er na die stap in zit (dus oplopend, laatste giet = '+water+'); '+
      'laat g weg bij een stap waarbij je niet giet. d = korte instructie in het Nederlands, max 12 woorden, '+
      'ZONDER gramgetallen -- het aantal gram staat al in g en wordt ernaast getoond. '+
      'Vier tot zeven stappen, eindig met een doorloop-stap. over = \u00e9\u00e9n korte zin over dit recept.'+
      (isSwitch(recBewerk.mid)?('\nDeze zetter is een Hario Switch: een V60 met een klep onderin. '+
        'Klep DICHT = het water blijft staan (immersie: meer zoet, meer body, vergevingsgezinder). '+
        'Klep OPEN = het loopt door (percolatie: meer helderheid en definitie). De klep is een stand, '+
        'geen aparte stap: geef bij elke stap de stand die er tijdens die stap geldt. Het gangbare '+
        'recept houdt hem dicht voor de bloom en een weekfase en opent hem daarna om leeg te laten '+
        'lopen; open beginnen en aan het eind sluiten mag ook, dat wordt romiger maar minder scherp. '+
        'Zorg dat hij aan het eind OPEN staat, anders loopt de koffie nooit in de kop.'):'')+
      (isAeropress(recBewerk.mid)?('\nDeze zetter staat '+
        (recBewerk.houding==='omgekeerd'?'OMGEKEERD':'NORMAAL')+'. '+
        (recBewerk.houding==='omgekeerd'
          ? 'Bij omgekeerd staat hij op de zuiger en loopt er niets door tot jij hem omdraait: dat is '+
            'volle IMMERSIE. Alle koffie krijgt precies dezelfde contacttijd, wat meer zoet, meer body '+
            'en een herhaalbaarder kop geeft, maar iets minder definitie \u2014 het fijne onderscheid '+
            'vlakt af. Speel dus met de weektijd in plaats van met het gietschema, en houd de maling '+
            'aan de grovere kant om bitterheid te voorkomen. Zet \u00e9\u00e9n stap met k="keer" op '+
            'het moment dat het filterdopje erop gaat en hij op het kopje wordt omgekeerd, en laat het '+
            'persen daarna volgen. Geef die stap geen g.'
          : 'Bij normaal staat hij op het kopje en werkt het water vanaf de eerste seconde door het '+
            'filter: deels PERCOLATIE. De kop wordt schoner en dunner, met meer nadruk op de lichte, '+
            'vluchtige smaken, maar je hebt de weektijd minder in de hand en onderextractie ligt op de '+
            'loer. Houd het daarom kort en werk liever met een iets fijnere maling dan met lang wachten. '+
            'Gebruik GEEN keer-stap.')):'');
    const d=extractJSON(await askAI([{role:'user',content:prompt}],900,'brew'));
    if(d.temp)setVal('rec-temp',d.temp);
    if(d.maling)setVal('rec-maling',d.maling);
    if(d.stand)setVal('rec-stand',conciseGrind(d.stand));
    if(d.over)setVal('rec-over',d.over);
    const rijen=(Array.isArray(d.stappen)?d.stappen:[]).map(x=>({
      t:parseTimeSec(String(x.t||'0:00'))||0,
      g:(x.g==null||x.g==='')?'':Math.round(parseFloat(x.g)||0),
      k:STAP_SOORTEN.includes(x.k)?x.k:'giet',
      klep:(isSwitch(recBewerk.mid)&&['open','dicht'].includes(x.klep))?x.klep:'',
      d:(x.d||'').trim()}));
    if(!rijen.length)throw new Error('geen stappen');
    recBewerk.stappen=rijen.sort((a,b)=>a.t-b.t);
    recSteps();toast('\u2713 draft filled in \u2014 change what you want');
  }catch(e){
    toast('AI not available \u2014 enter your key under profile');
  }
  btn.textContent=oud;btn.disabled=false;
}
/* ---------------- getekende zetters ----------------
   Wat de E61 voor espresso doet, doet dit voor filter: je ziet het water
   stijgen terwijl de klok loopt. De vulling zit in een eigen groep buiten het
   dubbel getrokken lijnwerk, zodat animatie en tekening elkaar niet raken. */
const BREWER_ART={
  v60:{h:58,l:150,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M54 58 L186 58 L131 150 L109 150 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 6 Q122 26 120 44"/><path class="b" d="M123 10 Q121 28 123 42"/></g><rect id="bw-fill" x="50" y="150" width="140" height="0" clip-path="url(#bw-clip)"/><path d="M44 52 Q120 43 196 53"/><path class="b" d="M48 56 Q120 48 192 57"/><path d="M50 55 Q82 106 112 156"/><path class="b" d="M54 57 Q85 107 114 158"/><path d="M190 56 Q158 106 128 156"/><path class="b" d="M186 58 Q155 107 126 158"/><path d="M110 152 Q120 157 130 152"/><path class="soft2" d="M56 62 Q120 55 184 63"/><path class="soft2" d="M96 66 Q104 106 112 148"/><path class="soft2" d="M144 66 Q136 106 128 148"/><path class="soft2" d="M120 64 Q120 106 120 150"/><path class="bed" d="M74 96 Q120 89 166 97"/><path d="M188 66 Q214 74 210 96 Q206 114 184 116"/><path class="b" d="M186 72 Q206 79 203 95 Q200 108 183 110"/><path d="M72 168 Q120 161 168 169"/><path class="b" d="M76 172 Q120 166 164 172"/><path d="M74 170 Q78 198 88 210"/><path class="b" d="M78 172 Q82 197 90 207"/><path d="M166 170 Q162 198 152 210"/><path class="b" d="M162 172 Q158 197 150 207"/><path d="M86 209 Q120 217 154 209"/><path class="b" d="M92 212 Q120 217 148 212"/><path d="M166 176 Q188 180 186 194 Q184 205 166 206" opacity="0.8"/></svg>'},
  chemex:{h:44,l:124,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M56 44 L184 44 L138 124 L102 124 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 6 Q122 26 120 44"/><path class="b" d="M123 10 Q121 28 123 42"/></g><rect id="bw-fill" x="50" y="124" width="140" height="0" clip-path="url(#bw-clip)"/><path d="M46 38 Q120 29 194 39"/><path class="b" d="M50 42 Q120 34 190 43"/><path d="M52 41 Q78 84 100 128"/><path class="b" d="M56 43 Q81 85 102 130"/><path d="M188 42 Q162 84 140 128"/><path class="b" d="M184 44 Q159 85 138 130"/><path class="soft2" d="M58 48 Q120 41 182 49"/><path class="bed" d="M76 78 Q120 71 164 79"/><path d="M92 122 Q120 117 148 123"/><path d="M90 138 Q120 133 150 139"/><path class="b" d="M94 126 Q120 122 146 127"/><path class="b" d="M93 134 Q120 130 147 135"/><path class="soft2" d="M118 128 Q126 124 134 131 Q128 136 120 132 Q112 137 106 131 Q113 124 120 129"/><path d="M100 136 Q74 170 76 194"/><path class="b" d="M104 138 Q80 170 81 192"/><path d="M140 136 Q166 170 164 194"/><path class="b" d="M136 138 Q160 170 159 192"/><path d="M78 196 Q120 214 162 196"/><path class="b" d="M86 200 Q120 210 154 200"/><path class="soft2" d="M84 178 Q120 172 156 179"/><path d="M186 44 Q202 52 198 66" opacity="0.75"/></svg>'},
  kalita:{h:58,l:142,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M56 58 L184 58 L150 142 L90 142 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 6 Q122 26 120 44"/><path class="b" d="M123 10 Q121 28 123 42"/></g><rect id="bw-fill" x="50" y="142" width="140" height="0" clip-path="url(#bw-clip)"/><path d="M46 52 Q120 43 194 53"/><path class="b" d="M50 56 Q120 48 190 57"/><path d="M52 55 Q68 102 86 146"/><path class="b" d="M56 57 Q71 103 88 148"/><path d="M188 56 Q172 102 154 146"/><path class="b" d="M184 58 Q169 103 152 148"/><path d="M84 146 Q120 152 156 146"/><path class="b" d="M88 149 Q120 154 152 149"/><path class="soft2" d="M62 68 Q70 104 82 140"/><path class="soft2" d="M92 64 Q94 102 98 140"/><path class="soft2" d="M148 64 Q146 102 142 140"/><path class="soft2" d="M178 68 Q170 104 158 140"/><path class="bed" d="M74 94 Q120 87 166 95"/><path d="M72 164 Q120 157 168 165"/><path class="b" d="M76 168 Q120 162 164 168"/><path d="M74 166 Q78 194 88 206"/><path d="M166 166 Q162 194 152 206"/><path d="M86 205 Q120 213 154 205"/><path class="b" d="M92 208 Q120 213 148 208"/></svg>'},
  aeropress:{h:62,l:168,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M84 62 L156 62 L156 168 L84 168 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 6 Q122 26 120 44"/><path class="b" d="M123 10 Q121 28 123 42"/></g><rect id="bw-fill" x="80" y="168" width="80" height="0" clip-path="url(#bw-clip)"/><path d="M78 56 Q120 49 162 57"/><path class="b" d="M82 60 Q120 54 158 61"/><path d="M80 58 Q78 114 82 170"/><path class="b" d="M84 62 Q82 114 85 167"/><path d="M160 58 Q162 114 158 170"/><path class="b" d="M156 62 Q158 114 155 167"/><path d="M80 170 Q120 176 160 170"/><path d="M104 54 Q106 32 104 14"/><path class="b" d="M108 52 Q110 32 108 16"/><path d="M136 54 Q134 32 136 14"/><path class="b" d="M132 52 Q130 32 132 16"/><path d="M94 16 Q120 8 146 17"/><path class="b" d="M98 20 Q120 13 142 20"/><path class="soft2" d="M84 84 Q94 82 104 84"/><path class="soft2" d="M84 106 Q94 104 104 106"/><path class="soft2" d="M84 128 Q94 126 104 128"/><path class="bed" d="M88 150 Q120 145 152 151"/><path d="M76 174 Q120 181 164 174"/><path class="b" d="M82 178 Q120 184 158 178"/><path d="M84 184 Q120 190 156 184"/><path d="M86 188 Q90 206 100 214"/><path d="M154 188 Q150 206 140 214"/><path d="M98 213 Q120 219 142 213"/></svg>'},
  /* de omgekeerde aeropress: de zuiger staat op het aanrecht, de kamer erboven,
     de open kant naar boven. Het water zit dus op de rubber, niet op het filter. */
  aeropress_om:{h:56,l:156,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M84 56 L156 56 L156 156 L84 156 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 4 Q122 24 120 42"/><path class="b" d="M123 8 Q121 26 123 40"/></g><rect id="bw-fill" x="80" y="156" width="80" height="0" clip-path="url(#bw-clip)"/><path d="M78 50 Q120 43 162 51"/><path class="b" d="M82 54 Q120 48 158 55"/><path d="M80 52 Q78 106 82 160"/><path class="b" d="M84 56 Q82 106 85 157"/><path d="M160 52 Q162 106 158 160"/><path class="b" d="M156 56 Q158 106 155 157"/><path class="soft2" d="M84 74 Q94 72 104 74"/><path class="soft2" d="M84 98 Q94 96 104 98"/><path class="soft2" d="M84 122 Q94 120 104 122"/><path class="bed" d="M88 146 Q120 141 152 147"/><path d="M80 160 Q120 167 160 160"/><path class="b" d="M84 164 Q120 170 156 164"/><path d="M84 172 Q120 178 156 172"/><path class="b" d="M88 176 Q120 181 152 176"/><path d="M104 176 Q102 188 104 198"/><path class="b" d="M108 178 Q106 188 108 197"/><path d="M136 176 Q138 188 136 198"/><path class="b" d="M132 178 Q134 188 132 197"/><path d="M92 198 Q120 205 148 198"/><path d="M86 207 Q120 214 154 207"/><path class="b" d="M92 210 Q120 215 148 210"/><path class="soft2" d="M50 216 Q120 221 190 216"/></svg>'},
  switch:{h:58,l:150,art:'<svg viewBox="0 0 240 224"><defs><clipPath id="bw-clip"><path d="M54 58 L186 58 L131 150 L109 150 Z"/></clipPath></defs><g id="bw-stream" class="bw-stream"><path d="M120 6 Q122 26 120 44"/><path class="b" d="M123 10 Q121 28 123 42"/></g><rect id="bw-fill" x="50" y="150" width="140" height="0" clip-path="url(#bw-clip)"/><path d="M44 52 Q120 43 196 53"/><path class="b" d="M48 56 Q120 48 192 57"/><path d="M50 55 Q82 106 112 156"/><path class="b" d="M54 57 Q85 107 114 158"/><path d="M190 56 Q158 106 128 156"/><path class="b" d="M186 58 Q155 107 126 158"/><path d="M110 152 Q120 157 130 152"/><path class="soft2" d="M56 62 Q120 55 184 63"/><path class="soft2" d="M120 64 Q120 106 120 150"/><path class="bed" d="M74 96 Q120 89 166 97"/><g id="bw-valve"><path d="M132 148 Q152 142 158 130"/><path class="b" d="M134 152 Q154 146 160 134"/><path d="M160 122 Q168 128 162 136 Q153 133 157 124"/></g><path d="M188 66 Q214 74 210 96 Q206 114 184 116"/><path d="M72 168 Q120 161 168 169"/><path class="b" d="M76 172 Q120 166 164 172"/><path d="M74 170 Q78 198 88 210"/><path d="M166 170 Q162 198 152 210"/><path d="M86 209 Q120 217 154 209"/><path class="b" d="M92 212 Q120 217 148 212"/></svg>'},
};
// welke tekening hoort bij deze methode?
function brewerArtKey(methodId){
  const m=methodById(methodId); const naam=((m&&m.name)||'').toLowerCase();
  for(const k of ['chemex','kalita','aeropress','switch'])
    if(methodId===k||naam.includes(k))return k;
  if(naam.includes('press'))return 'aeropress';
  return 'v60';
}
/* Staat hij omgekeerd, dan blijft dat zo tot de keer-stap geweest is. Daarna
   staat hij gewoon rechtop -- en dat verschil zie je gebeuren. */
/* Op welke stappen draai jij de klep om? Alleen daar hoort hij in beeld -- een
   badge op elke stap zou alleen maar ruis zijn. */
function pourKlepDraait(){
  let vorige=null;
  return pc.steps.map(st=>{
    const k=st.klep||'';
    if(!k)return '';
    const wissel=(k!==vorige); vorige=k;
    return wissel?k:'';
  });
}
/* De stand op stap i: de laatst vastgelegde klep vanaf hier terugkijkend. */
function pourKlepStand(i){
  for(let j=Math.min(i,pc.steps.length-1);j>=0;j--)
    if(pc.steps[j].klep)return pc.steps[j].klep;
  return '';
}
function pourOmgekeerd(){
  const r=recipeById(pc.rid);
  if(!r||r.houding!=='omgekeerd')return false;
  const i=pc.steps.findIndex(x=>x.k==='keer');
  if(i<0)return true;
  return pourCur()<=i;      // vanaf de keer-stap zelf staat hij weer rechtop
}
function renderBrewerArt(){
  const el=document.getElementById('pc-art');if(!el)return;
  let k=brewerArtKey(pc.mid);
  if(k==='aeropress'&&pourOmgekeerd())k='aeropress_om';
  if(el.dataset.k!==k){
    const draai=(el.dataset.k==='aeropress'||el.dataset.k==='aeropress_om')&&
                (k==='aeropress'||k==='aeropress_om');
    el.innerHTML=BREWER_ART[k].art;el.dataset.k=k;
    if(draai){                       // de omslag: je ziet hem kantelen
      el.classList.remove('kantelt');void el.offsetWidth;el.classList.add('kantelt');
    }
  }
  paintBrewer();
}
// waterstand + straal bijwerken
function paintBrewer(){
  const el=document.getElementById('pc-art');if(!el)return;
  const k=el.dataset.k;if(!k||!BREWER_ART[k])return;
  const {h,l}=BREWER_ART[k];
  const fill=el.querySelector('#bw-fill');
  const stream=el.querySelector('#bw-stream');
  const totaal=pc.steps.length?pc.steps[pc.steps.length-1].water:0;
  const gedaan=pourPouredAt(pc.el);
  const deel=totaal?Math.max(0,Math.min(1,gedaan/totaal)):0;
  if(fill){
    const hoogte=deel*(l-h), y=l-hoogte;
    fill.setAttribute('y',y);fill.setAttribute('height',hoogte);
  }
  // de straal loopt precies zolang de giet zelf duurt
  if(stream)stream.classList.toggle('on',!!(pc.run&&pourGieten(pc.el)));
  const st=pc.steps[pourCur()];
  const v=el.querySelector('#bw-valve');
  if(v){
    // staat de klep in het recept, dan is dat leidend; anders de oude gok
    const stand=pourKlepStand(pourCur());
    v.classList.toggle('dicht',stand?(stand==='dicht'):!!(st&&st.k==='wacht'));
  }
}
/* ---------------- de kaartenstapel ----------------
   Bij filter wordt het formulier een stapel kaarten: dicht is elke kaart één
   regel met de kern erop, open is het hele blok. De velden zelf blijven precies
   dezelfde elementen -- ze verhuizen alleen naar de kaart waar ze horen, en bij
   espresso weer terug naar hun oorspronkelijke plek.                       */
const KAART_INHOUD={
  recipe:['fb-doserow','fb-ratio','fb-temp','fb-grind','bloom-field'],
  bean:['fb-beans'],
  gear:['filter-gear'],
  pour:[],
  log:['fb-time','filter-extra','filter-taste','fb-score','fb-tastenotes','fb-custom'],
};
const ALLE_BLOKKEN=[].concat(...Object.values(KAART_INHOUD));
let pcOpen={recipe:false,bean:false,gear:false,pour:true,log:false};
let formHerkomst=null;
// waar stond elk blok oorspronkelijk? één keer onthouden, voor de weg terug
function bewaarHerkomst(){
  if(formHerkomst)return;
  formHerkomst={};
  ALLE_BLOKKEN.forEach(id=>{
    const el=document.getElementById(id);if(!el||!el.parentNode)return;
    formHerkomst[id]={p:el.parentNode,i:[...el.parentNode.children].indexOf(el)};
  });
}
function kaartenAan(){
  bewaarHerkomst();
  Object.keys(KAART_INHOUD).forEach(k=>{
    const doel=document.getElementById('pcb-'+k);if(!doel)return;
    KAART_INHOUD[k].forEach(id=>{const el=document.getElementById(id);if(el)doel.appendChild(el);});
  });
  // de tijd-rij is leeg zolang zijn twee velden in de kaarten hangen
  const tr=document.getElementById('fb-timerow');if(tr)tr.style.display='none';
  const st=document.getElementById('pc-stack');if(st)st.style.display='block';
}
function kaartenUit(){
  if(!formHerkomst)return;
  // in oorspronkelijke volgorde terugzetten, anders schuift de index onder je weg
  ALLE_BLOKKEN.slice().sort((a,b)=>(formHerkomst[a]?.i||0)-(formHerkomst[b]?.i||0)).forEach(id=>{
    const el=document.getElementById(id),h=formHerkomst[id];
    if(!el||!h)return;
    h.p.insertBefore(el,[...h.p.children][h.i]||null);
  });
  const tr=document.getElementById('fb-timerow');if(tr)tr.style.display='';
  const st=document.getElementById('pc-stack');if(st)st.style.display='none';
}
function cardToggle(k){pcOpen[k]=!pcOpen[k];renderCards();}
function renderCards(){
  Object.keys(pcOpen).forEach(k=>{
    const c=document.getElementById('pcard-'+k);if(!c)return;
    c.classList.toggle('op',!!pcOpen[k]);
  });
  cardSummaries();
}
// de regel die je ziet als een kaart dicht is
function cardSummaries(){
  const zet=(k,t)=>{const el=document.getElementById('sum-'+k);if(el)el.textContent=t;};
  const r=recipeById(pc.rid);
  const dose=document.getElementById('f-dose').value;
  const water=document.getElementById('f-yield').value;
  const stand=document.getElementById('f-grind').value;
  zet('recipe',r?([r.naam,(dose&&water)?(dose+' g \u2192 '+water+' g'):'',stand]
    .filter(Boolean).join('  \u00b7  ')):'write how you brew this');

  const bean=beanById(formBean);
  const f=bean?beanFreshness(bean):null;
  const h=f?freshBloomHint(f.days):null;
  const dz=parseFloat(dose)||0;
  const start=bean?grindStartShort(bean,pc.mid):'';
  zet('bean',bean?([bean.name,f?f.label:'',(h&&dz)?('bloom '+Math.round(dz*h.mult)+' g, '+h.sec+' s'):'',start]
    .filter(Boolean).join('  \u00b7  ')):'no bean picked');

  const g=[document.getElementById('f-brewer').value.trim(),formMolen].filter(Boolean);
  zet('gear',g.length?g.join('  \u00b7  '):'brewer & grinder \u2014 nothing set');

  if(pc.total!=null)zet('pour','total '+pourFmt(pc.total)+(pc.draw!=null?(' \u00b7 drawdown '+pourFmt(pc.draw)):''));
  else if(pc.run)zet('pour',pourFmt(pc.el)+' \u00b7 '+((pc.steps[pourCur()]||{}).k||''));
  else zet('pour',r?('not started \u2014 '+r.stappen.length+' steps'):'no recipe');

  const score=document.getElementById('f-score').value;
  const cup=formCup?(cupById(formCup)||{}).n:'';
  const tijd=document.getElementById('f-time').value;
  zet('log',(pc.total!=null||tijd)?[tijd?('time '+tijd):'',cup,'score '+(+score).toFixed(1)].filter(Boolean).join('  \u00b7  ')
    :'opens by itself when you stop the clock');
}
/* ---------------- pour coach (filter) ----------------
   Een recept is een tijdlijn. De klok loopt, de stap die aan de beurt is licht
   op, en tik je hem later aan dan gepland dan schuift al het volgende mee -- zo
   val je niet uit het recept als je een keer te laat bent.                */
let pc={mid:null,rid:null,steps:[],hendels:{zoet:0.5,sterk:0.5},
        run:false,t0:0,el:0,timer:null,done:0,shift:0,marks:[],total:null,draw:null,live:-1};
/* Welke stap is volgens de klok aan de beurt? De laatste waarvan de tijd
   verstreken is. Tik je er zelf een aan, dan loop je voor op het schema en
   telt die (pc.done) zwaarder.                                            */
function pourAuto(){
  let i=0;
  for(let k=0;k<pc.steps.length;k++)if(pc.el>=pc.steps[k].t+pc.shift)i=k;
  return i;
}
function pourCur(){return Math.min(pc.steps.length-1,Math.max(pourAuto(),pc.done||0));}
/* Hoeveel water zit er op tijdstip el in de brewer? Een giet gaat niet in
   één klap: reken met ongeveer 8 gram per seconde, dan stijgt het niveau
   terwijl je giet en staat het stil terwijl je wacht.                     */
function pourPouredAt(el){
  let g=0;
  for(const st of pc.steps){
    if(!st.g)continue;
    const start=st.t+pc.shift;
    const duur=Math.max(3,Math.min(25,(st.g-g)/8));
    if(el<=start)break;
    if(el>=start+duur){g=st.g;continue;}
    g=g+(st.g-g)*((el-start)/duur);
    break;
  }
  return g;
}
function pourGieten(el){
  let g=0;
  for(const st of pc.steps){
    if(!st.g)continue;
    const start=st.t+pc.shift;
    const duur=Math.max(3,Math.min(25,(st.g-g)/8));
    if(el>=start&&el<start+duur)return true;
    if(el<start)return false;
    g=st.g;
  }
  return false;
}
function pourFmt(sec){const m=Math.floor(sec/60),ss=Math.floor(sec%60);return m+':'+String(ss).padStart(2,'0');}
// de coach klaarzetten voor de methode die nu in het formulier staat
function pourInit(){
  const stack=document.getElementById('pc-stack');if(!stack)return;
  const aan=(methodFamily(formMethod)==='filter')&&!['perculator','senseo'].includes(formMethod)&&featOn('pourcoach')&&recipesFor(formMethod).length>0;
  if(!aan){pourStop(true);return;}
  if(pc.mid===formMethod&&pc.steps.length){renderPour();renderCards();return;}   // niet resetten bij hertekenen
  pourStop(true);
  const lijst=recipesFor(formMethod);
  const bewaard=(state.lastRecipe||{})[formMethod];
  pc={mid:formMethod,rid:(lijst.find(r=>r.id===bewaard)||lijst[0]||{}).id||null,steps:[],
      hendels:{zoet:0.5,sterk:0.5},run:false,t0:0,el:0,timer:null,idx:0,shift:0,
      marks:[],total:null,draw:null,live:-1};
  // de eerste kaart die nog iets van je wil staat open: geen boon? boon.
  // geen recept? recept. Verder ben je klaar om te gieten.
  const eerst=!formBean?'bean':(!pc.rid?'recipe':'pour');
  pcOpen={bean:eerst==='bean',recipe:eerst==='recipe',gear:false,pour:eerst==='pour',log:false};
  if(pc.rid)pourVulUitRecept(pc.rid,pc.rid===recVers);
  recVers=null;
  pourBuild();renderCards();
}
/* ---- van de receptkaart naar the pour ----
   Alles wat in het recept staat is meteen de opzet van deze brew: de dose, het
   water, de temperatuur en de maalstand. Zo hoef je niets over te typen en
   loopt de gietklok op precies de getallen die je hebt opgeschreven.       */
function pourVulUitRecept(id,overschrijf){
  const r=recipeById(id);if(!r)return;
  const leeg=i=>!String(document.getElementById(i).value||'').trim();
  if(overschrijf||leeg('f-dose'))setVal('f-dose',r.dose);
  if(overschrijf||leeg('f-temp'))setVal('f-temp',r.temp);
  // wat de app voor deze boon heeft geleerd gaat voor de maalstand uit het
  // recept: die is op jouw molen gemeten
  const bean=beanById(formBean);
  const geleerd=(bean&&bean.dialIn&&bean.dialIn.method===pc.mid&&bean.dialIn.grind)?bean.dialIn.grind:null;
  const stand=geleerd||r.stand;
  if(stand&&(overschrijf||leeg('f-grind')))setVal('f-grind',stand);
  // de molen waarop het recept geschreven is, als je er nog geen koos
  if(r.molen&&(overschrijf||!formMolen)){formMolen=r.molen;renderFormMolens();}
}
// het schema opnieuw uitrekenen voor de huidige dose en hendelstand
function pourBuild(){
  const r=recipeById(pc.rid);
  const dose=parseFloat(document.getElementById('f-dose').value)||(r?r.dose:15);
  pc.steps=recipeSteps(r,dose,pc.hendels);
  // het water uit het recept is meteen je doelgewicht in het formulier
  const w=pc.steps.length?pc.steps[pc.steps.length-1].water:'';
  if(w){setVal('f-yield',w);if(dose)setVal('f-ratio',(w/dose).toFixed(1));}
  renderPour();
}
function pourRecalc(){
  const stack=document.getElementById('pc-stack');
  if(!stack||stack.style.display==='none')return;
  cardSummaries();
  if(pc.run)return;
  pourBuild();
}
function renderPour(){
  pourRecipes();pourLevers();renderBrewerArt();pourBloom();pourSteps();pourSchema();
  const t=document.getElementById('pc-time');if(t)t.textContent=pourFmt(pc.el);
  cardSummaries();
}
// het gietschema zoals het in het receptenboek staat, in de receptkaart
function pourSchema(){
  const el=document.getElementById('pc-schema');if(!el)return;
  if(!pc.steps.length){el.innerHTML='';return;}
  const draait=pourKlepDraait();
  el.innerHTML='<div class="pcs-h"></div>'+pc.steps.map((st,i)=>
    '<div class="pcs'+(st.k==='keer'?' keer':'')+(draait[i]?' klept':'')+'"><span class="t">'+
    pourFmt(st.t)+'</span><span class="k">'+
    (draait[i]?('<b>klep '+draait[i]+'</b> \u00b7 '):'')+esc(st.k)+
    ' \u2014 '+esc(st.d)+'</span><span class="g">'+(st.g?st.g+' g':'')+'</span></div>').join('');
}
// welk recept staat er geladen -- en de rij om een ander te kiezen
function pourRecipes(){
  const r=recipeById(pc.rid);
  const eigen=eigenRecepten(pc.mid);
  const pick=document.getElementById('pc-pick');
  if(pick)pick.innerHTML=(eigen.length>1)?eigen.map(x=>
    '<button type="button" class="lp '+(x.id===pc.rid?'sel':'')+
    '" onclick="pourPickRecipe(\''+x.id+'\')">'+esc(x.naam)+'</button>').join(''):'';
  const naam=document.getElementById('pc-naam');
  if(naam)naam.textContent=r?r.naam:'no recipe yet';
  const o=document.getElementById('pc-over');
  if(o){
    const stand=r&&r.stand?('  \u00b7  '+esc(r.stand)+(r.molen?(' on your '+esc(r.molen)):'')):'';
    o.innerHTML=r?(esc(r.over)+'  \u00b7  '+esc(r.maling)+', '+esc(String(r.temp))+'\u00b0C'+stand)
                 :'write down how you brew this and the pour runs it with you';
  }
  const l=document.getElementById('pc-links');
  if(l){
    l.innerHTML=(r?('<a onclick="openRecipe(\''+r.id+'\')">edit this one</a>'+
                    '<a onclick="openRecipe(null,pc.mid)">write another</a>')
                  :('<a onclick="openRecipe(null,pc.mid)">write your recipe</a>'));
  }
}
function pourPickRecipe(id){
  if(pc.run){toast('the clock is running \u2014 stop it first');return;}
  pc.rid=id;
  if(!state.lastRecipe)state.lastRecipe={};
  state.lastRecipe[pc.mid]=id;save();
  pourVulUitRecept(id,true);
  pourBuild();
}
// de twee hendels van de 4:6 (alleen bij recepten die ze hebben)
function pourLevers(){
  const el=document.getElementById('pc-levers');if(!el)return;
  const r=recipeById(pc.rid);
  if(!r||!r.hendels){el.innerHTML='';return;}
  el.innerHTML=`<div class="pc-lever">
      <div class="pl-t"><span>sharper</span><span>first 40 % \u2192 taste</span><span>sweeter</span></div>
      <input type="range" min="0" max="1" step="0.05" value="${pc.hendels.zoet}" oninput="pourLever('zoet',this.value)">
    </div>
    <div class="pc-lever">
      <div class="pl-t"><span>lighter</span><span>last 60 % \u2192 strength</span><span>stronger</span></div>
      <input type="range" min="0" max="1" step="0.05" value="${pc.hendels.sterk}" oninput="pourLever('sterk',this.value)">
    </div>`;
}
function pourLever(k,v){
  if(pc.run)return;
  pc.hendels[k]=parseFloat(v);
  const r=recipeById(pc.rid);
  const dose=parseFloat(document.getElementById('f-dose').value)||(r?r.dose:15);
  pc.steps=recipeSteps(r,dose,pc.hendels);
  pourSteps();
}
// versheid -> bloom (de filterkant van de versheidsmeter)
function pourBloom(){
  renderStartHint('pc-start');
  const el=document.getElementById('pc-bloom');if(!el)return;
  const bean=beanById(formBean);
  const f=bean?beanFreshness(bean):null;
  const h=f?freshBloomHint(f.days):null;
  if(!h){el.innerHTML='';return;}
  const dose=parseFloat(document.getElementById('f-dose').value)||0;
  const g=dose?Math.round(dose*h.mult):null;
  el.innerHTML='<b>'+esc(h.s)+'</b> \u2014 '+esc(h.t)+(g?(' <b>'+g+' g bloom, '+h.sec+' s</b>'):'');
}
function pourSteps(){
  const el=document.getElementById('pc-steps');if(!el)return;
  const of0=document.getElementById('pc-of');
  if(!pc.steps.length){
    el.innerHTML='<div class="rec-empty">no schedule yet — open <b>recipe</b> above and write '+
      'how you brew this. Every step you put there lands here, and the clock runs it with you.</div>';
    if(of0)of0.textContent='';
    return;
  }
  const cur=pourCur();
  const draait=pourKlepDraait();
  el.innerHTML=pc.steps.map((st,i)=>{
    const at=st.t+pc.shift;
    const klaar=i<cur;
    // alles wat verder terug ligt dan de vorige stap wordt een streepje,
    // zodat de tekening in beeld blijft terwijl je giet
    if(i<cur-1&&st.k!=='keer'&&!draait[i])
      return '<div class="pc-mini" title="'+esc(st.k)+' \u2014 done"></div>';
    const nu=(i===cur)&&pc.run;
    const cls=klaar?'klaar':(nu?'nu':'straks');
    const tijd=(klaar&&pc.marks[i]!=null)?pourFmt(pc.marks[i]):pourFmt(Math.max(0,at));
    const g=st.g?('<div class="ps-g">'+st.g+' g</div>'):'';
    const tik=nu?(' onclick="pourTick('+i+')"'):'';
    const keer=st.k==='keer';
    const kl=draait[i];
    const klepBadge=kl?('<div class="ps-klep '+kl+'">'+KLEP_ICOON[kl]+
      (kl==='dicht'?'klep dicht':'klep open')+'</div>'):'';
    return '<div class="pc-step '+cls+(keer?' keer':'')+(kl?' klept':'')+'"'+tik+
      '><div class="ps-t">'+tijd+'</div>'+
      '<div class="ps-b">'+klepBadge+'<div class="ps-k">'+(keer?(PIJL_OM+'turn it over'):esc(st.k))+'</div>'+
      '<div class="ps-d">'+esc(st.d)+'</div></div>'+g+'</div>';
  }).join('');
  const of=document.getElementById('pc-of');
  if(!of)return;
  if(pc.total!=null){
    of.textContent='total '+pourFmt(pc.total)+(pc.draw!=null?(' \u00b7 drawdown '+pourFmt(pc.draw)):'');
  }else if(!pc.run){
    const eerste=pc.steps[0];
    of.textContent=eerste?('starts with '+eerste.k+(eerste.g?(', '+eerste.g+' g'):'')):'';
  }else{
    const volgende=pc.steps[cur+1];
    of.textContent=volgende
      ? ('next: '+volgende.k+' at '+pourFmt(Math.max(0,volgende.t+pc.shift)))
      : 'stop the clock when the bed runs dry';
  }
}
function pourToggle(){pc.run?pourStop():pourStart();}
function pourStart(){
  if(!pc.steps.length)pourBuild();
  pc.run=true;pc.t0=performance.now();pc.el=0;pc.done=0;pc.shift=0;pc.marks=[];pc.total=null;pc.draw=null;pc.live=-1;
  document.getElementById('pc-btn').textContent='stop';
  pc.timer=setInterval(pourTickClock,200);
  pcOpen.pour=true;pcOpen.log=false;renderCards();
  pourSteps();paintBrewer();toast('\u23f1 running \u2014 tap a step if you drift');
}
function pourTickClock(){
  pc.el=(performance.now()-pc.t0)/1000;
  const t=document.getElementById('pc-time');if(t)t.textContent=pourFmt(pc.el);
  const cur=pourCur();
  // een stap die voorbijgaat zonder dat je hem aantikte krijgt zijn geplande tijd
  for(let k=0;k<cur;k++)if(pc.marks[k]==null)pc.marks[k]=pc.steps[k].t+pc.shift;
  // de lijst alleen hertekenen als er iets verschuift; het water elke tik
  if(cur!==pc.live){pc.live=cur;pourSteps();}
  paintBrewer();cardSummaries();
}
function pourStop(stil){
  if(pc.timer){clearInterval(pc.timer);pc.timer=null;}
  if(!pc.run){if(!stil)pourSteps();return;}
  pc.run=false;pc.total=Math.round(pc.el);
  // doorlooptijd = vanaf de laatste giet tot nu; niet aangetikt = geplande tijd
  let laatste=null;
  pc.steps.forEach((st,i)=>{if(st.g)laatste=(pc.marks[i]!=null)?pc.marks[i]:(st.t+pc.shift);});
  if(laatste!=null&&pc.el>laatste)pc.draw=Math.max(0,Math.round(pc.el-laatste));
  const b=document.getElementById('pc-btn');if(b)b.textContent='start again';
  pourFill();
  // klaar met gieten: het oordeel-deel gaat vanzelf open, de coach vouwt dicht
  pcOpen.log=true;pcOpen.pour=false;
  if(!stil){pourSteps();paintBrewer();renderCards();}
}
// wat de klok zag landt meteen in de velden eronder
function pourFill(){
  if(pc.total!=null){const t=document.getElementById('f-time');if(t){t.value=pourFmt(pc.total);normalizeTime(t);}}
  if(pc.draw!=null)setVal('f-draw',pourFmt(pc.draw));
  if(pc.steps.length&&pc.steps[0].g)setVal('f-bloom-g',pc.steps[0].g);
  const bs=(pc.marks[0]!=null&&pc.marks[1]!=null)?Math.round(pc.marks[1]-pc.marks[0])
          :(pc.steps.length>1?(pc.steps[1].t-pc.steps[0].t):null);
  if(bs)setVal('f-bloom-s',bs);
}
// "ik doe hem nu" -- het schema schuift mee met het moment waarop je tikt
function pourTick(i){
  if(!pc.run||i!==pourCur())return;
  pc.marks[i]=pc.el;
  pc.shift=pc.el-pc.steps[i].t;
  pc.done=i+1;pc.live=-1;
  if(i>=pc.steps.length-1){pourStop();toast('\u2713 that is the brew \u2014 the times are filled in below');}
  else {pourSteps();paintBrewer();}
}
/* ---------------- puck-prep (espresso) ---------------- */
function renderPrep(){
  const items=state.prepItems||[];
  const html=items.map(it=>{
    const st=formPrep[it.id]||{};
    return `<div class="prep-row">
      <span class="prep-cb ${st.on?'on':''}" onclick="togglePrep('${it.id}')">✓</span>
      <span class="prep-name">${esc(it.name)}</span>
      ${it.unit?`<input class="prep-val" value="${esc(st.val||'')}" placeholder="${esc(it.unit)}" oninput="setPrepVal('${it.id}',this.value)">`:''}
      <button class="prep-x" title="delete" onclick="removePrepItem('${it.id}')">×</button>
    </div>`;
  }).join('');
  ['prep-list','di-prep-list'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=html;});
}
function togglePrep(id){const st=formPrep[id]||(formPrep[id]={});st.on=!st.on;renderPrep();}
function setPrepVal(id,v){const st=formPrep[id]||(formPrep[id]={});st.val=v;if(v&&!('on'in st))st.on=true;}
function addPrepItem(){
  const name=(prompt('name of the step (e.g. "distribution tool")')||'').trim();
  if(!name)return;
  if(!Array.isArray(state.prepItems))state.prepItems=[];
  state.prepItems.push({id:'p_'+uid().slice(0,5),name});
  save();renderPrep();
}
function removePrepItem(id){
  state.prepItems=(state.prepItems||[]).filter(x=>x.id!==id);
  delete formPrep[id];save();renderPrep();
}
/* ---------------- espresso dial-in (apart scherm) ---------------- */
// kies waar een nieuwe brew begint: espresso -> dial-in-scherm, anders formulier
function beginBrew(methodId){
  formRecipeSnapshot=null;
  const mid=methodId||(state.methods.filter(m=>m.on)[0]?.id);
  if(methodFamily(mid)==='espresso'){pendingTarget=null;formBean=null;formPrep={};pendingRecipe=null;openDialIn(mid);}
  else openForm(mid);
}
function openDialIn(methodId){
  editingId=null;
  const valid=methodId&&state.methods.find(m=>m.id===methodId&&methodFamily(m)==='espresso');
  formMethod=valid?methodId:(state.methods.filter(m=>m.on&&methodFamily(m)==='espresso')[0]?.id||'espresso');
  // geen doel meegekregen? val terug op het recept dat je hier het laatst koos
  const bewaard=(state.lastRecipe||{})[formMethod];
  const rec=recipeById(bewaard);
  if(!pendingTarget&&rec&&recipeFam(rec)==='espresso'){
    pendingTarget={dose:String(rec.dose),yield:String(Math.round(rec.dose*rec.ratio)),
      time:rec.tijd||'',grind:rec.stand||''};
  }
  const t=pendingTarget||{};
  setVal('di-dose',t.dose||'');setVal('di-yield',t.yield||'');setVal('di-time','');
  setVal('di-grind',t.grind||'');   // startpunt: de doel-maalstand, aan te passen
  if(featOn('smartdefaults')&&!pendingTarget){
    const last=state.brews.filter(x=>x.method===formMethod).sort((a,b)=>b.ts-a.ts)[0];
    if(last){setVal('di-dose',last.dose||'');setVal('di-yield',last.yield||'');if(last.grind)setVal('di-grind',last.grind);}
  }
  e61Reset();renderDialIn();go('dialin');
}
function renderDialIn(){renderDiBeans();renderDiGoal();renderPrep();diAdvice();renderDiClock();renderDiJourney();renderStartHint('di-start');
  const laLink=document.getElementById('di-latteart-link');
  if(laLink)laLink.style.display=featOn('latteart')?'flex':'none';
}
/* Wat de zak zegt over waar je maalstand begint. Alleen tonen als er iets te
   zeggen valt -- een lege boon levert geen zinnige gok op.                  */
function renderStartHint(elId){
  const el=document.getElementById(elId);if(!el)return;
  const bean=beanById(formBean);
  const t=bean?grindStartText(bean,formMethod):'';
  if(!t){el.innerHTML='';el.style.display='none';return;}
  el.style.display='block';
  el.innerHTML='<span class="sh-k">starting point</span> '+esc(t);
}
/* --- E61 shot clock: stopwatch, geen simulator — jouw waarden blijven leidend --- */
let e61Run=false,e61T0=0,e61Raf=null;
function e61Fmt(sec){const m=Math.floor(sec/60),ss=Math.floor(sec%60);return m+':'+String(ss).padStart(2,'0');}
function renderDiClock(){
  const card=document.getElementById('di-clock-card');if(!card)return;
  card.style.display=featOn('shotclock')?'block':'none';
  const t=pendingTarget||{};
  const tgt=document.getElementById('e61-tgt');
  if(tgt)tgt.textContent='target '+(t.time||'0:28');
  const vr=document.getElementById('voice-row');
  if(vr)vr.style.display=featOn('voice')?'block':'none';
}
function e61Reset(){
  e61Run=false;cancelAnimationFrame(e61Raf);
  e61SetFill(0);
  const e=document.getElementById('e61');if(e)e.classList.remove('e61-run');
  const b=document.getElementById('e61-btn');if(b)b.textContent='pull the lever';
  const tm=document.getElementById('e61-time');if(tm)tm.textContent='0:00';
}
// het kopje loopt mee met de klok: vol op je doeltijd (blijft daarna vol)
const CUP_TOP=181, CUP_BOTTOM=213;   // binnenkant van de demitasse
function e61SetFill(p){
  const fill=document.getElementById('e61-fill'), crema=document.getElementById('e61-crema');
  if(!fill||!crema)return;
  const h=Math.max(0,Math.min(1,p))*(CUP_BOTTOM-CUP_TOP);
  const y=CUP_BOTTOM-h;
  fill.setAttribute('y',y);fill.setAttribute('height',h);
  const ch=Math.min(h,5);                       // laagje crema op het oppervlak
  crema.setAttribute('y',y);crema.setAttribute('height',ch);
}
function e61Tick(){
  const s=(performance.now()-e61T0)/1000;
  const tm=document.getElementById('e61-time');if(tm)tm.textContent=e61Fmt(s);
  const tgt=parseTimeSec((pendingTarget||{}).time)||28;
  e61SetFill(s/tgt);
  if(e61Run)e61Raf=requestAnimationFrame(e61Tick);
}
function e61Toggle(){
  if(!featOn('shotclock'))return;
  const e=document.getElementById('e61'),b=document.getElementById('e61-btn');
  if(!e61Run){
    e61Run=true;e61T0=performance.now();
    e61SetFill(0);
    e.classList.add('e61-run');b.textContent='stop';
    e61Tick();
  }else{
    e61Run=false;cancelAnimationFrame(e61Raf);
    e.classList.remove('e61-run');b.textContent='pull the lever';
    const s=Math.round((performance.now()-e61T0)/1000);
    const inp=document.getElementById('di-time');
    if(inp){inp.value=e61Fmt(s);normalizeTime(inp);diAdvice();}
    toast('⏱ '+e61Fmt(s)+' filled in — correct it if your machine says otherwise');
  }
}
/* --- dial-in journey: elke poging getekend, de lijn wandelt de doelzone in --- */
function renderDiJourney(){
  const card=document.getElementById('di-journey-card');if(!card)return;
  card.style.display=featOn('journey')?'block':'none';
  if(!featOn('journey'))return;
  const key=(formBean||'')+'|'+formMethod;
  const fullLog=(state.dialLog||{})[key]||[];
  const log=fullLog.slice(-6);
  const svg=document.getElementById('di-journey'),note=document.getElementById('di-journey-note');
  const info=document.getElementById('di-journey-info');
  if(log.length<1){svg.innerHTML='';note.textContent='your attempts will be drawn here — every lever pull adds a dot.';if(info)info.innerHTML='';return;}
  note.textContent=log.length===1?'first attempt on paper — pull another to draw the line.':'';
  svg.innerHTML=journeySVG(log,parseTimeSec((pendingTarget||{}).time)||28,key);
  if(info)info.innerHTML=journeyInfoHTML(key,fullLog);
}
/* De tekening zelf: pogingen op volgorde, de doelzone als band. Staat los van
   het dial-in-scherm, zodat de boonkaart hem ook kan laten zien. Met een key
   erbij wordt elke stip klikbaar: aantikken selecteert 'm (zie journeyInfoHTML),
   nog een keer tikken heft de selectie weer op.                              */
function journeySVG(log,doelSec,key){
  const tT=doelSec||28, lo=Math.max(1,tT-2), hi=tT+2;
  const times=log.map(a=>parseTimeSec(a.t)||0);
  const ymin=Math.min(lo-4,...times)-2, ymax=Math.max(hi+4,...times)+2;
  const W=360,H=185,L=40,R=14,T=14,B=36;
  const X=i=>log.length===1?(L+(W-L-R)/2):(L+(W-L-R)*(i/(log.length-1)));
  const Y=v=>T+(H-T-B)*(1-(v-ymin)/(ymax-ymin));
  const selTs=key?journeySel[key]:null;
  let out='';
  out+=`<rect class="band" x="${L-6}" y="${Y(hi)}" width="${W-L-R+12}" height="${Y(lo)-Y(hi)}" rx="6"/>`;
  out+=`<text x="${L-8}" y="${Y(tT)+4}" text-anchor="end">${lo}–${hi}s</text>`;
  out+=`<path class="axis" d="M${L} ${T} L${L} ${H-B} L${W-R} ${H-B}"/>`;
  /* de verwachte volgende maalstand: tussen je laatste twee pogingen zoeken we
     waar de trend de doeltijd zou raken, en zetten daar een stippellijn met
     het cijfer erbij. Alleen zolang je nog niet in de zone zit -- ben je er
     al, dan heeft een volgende gok niets meer te voorspellen.              */
  if(log.length>=2){
    const a1=log[log.length-2], a2=log[log.length-1];
    const y1=parseTimeSec(a1.t)||0, y2=parseTimeSec(a2.t)||0;
    const g1=parseFloat(a1.g), g2=parseFloat(a2.g);
    const laatsteHit=y2>=lo&&y2<=hi;
    if(!laatsteHit&&y1!==y2&&isFinite(g1)&&isFinite(g2)){
      const f=(tT-y1)/(y2-y1);
      if(f>0&&f<1){
        const xf=X(log.length-2)+f*(X(log.length-1)-X(log.length-2));
        const gf=g1+f*(g2-g1), gr=Math.round(gf*10)/10;
        const gTxt=Number.isInteger(gr)?String(gr):gr.toFixed(1);
        out+=`<line class="exp" x1="${xf-0.6}" y1="${T}" x2="${xf+0.6}" y2="${H-B}"/>`;
        out+=`<text class="exp-lbl" x="${xf}" y="${T+15}" text-anchor="middle">try ${gTxt}</text>`;
      }
    }
  }
  if(log.length>1)out+=`<polyline class="ln" points="${log.map((a,i)=>X(i)+','+Y(parseTimeSec(a.t)||0)).join(' ')}"/>`;
  log.forEach((a,i)=>{
    const tv=parseTimeSec(a.t)||0,hit=tv>=lo&&tv<=hi;
    const sel=key&&a.ts&&a.ts===selTs;
    const klik=key?` onclick="journeyPick('${key}',${a.ts||0})"`:'';
    out+=`<circle class="dot${hit?' hit':''}${sel?' sel':''}" cx="${X(i)}" cy="${Y(tv)}" r="6.5"${klik}/>`;
    out+=`<text class="val" x="${X(i)}" y="${Y(tv)-12}" text-anchor="middle">${tv}s</text>`;
    out+=`<text x="${X(i)}" y="${H-B+16}" text-anchor="middle">${esc(a.g||'?')}</text>`;
  });
  out+=`<text x="${W-R}" y="${H-B+30}" text-anchor="end">grind per attempt →</text>`;
  return out;
}
// welke poging staat er aangetikt? key -> ts. Weg = niets geselecteerd.
let journeySel={};
// "18 g → 36 g in 0:28 · grind 4.2", voor onder de tekening
function journeyAttemptLine(a){
  const stuk=[];
  if(a.d&&a.y)stuk.push(a.d+' g \u2192 '+a.y+' g');
  else if(a.d)stuk.push(a.d+' g');
  if(a.t)stuk.push('in '+a.t);
  const cijfers=stuk.join(' ');
  return (cijfers?cijfers+' \u00b7 ':'')+'grind '+(a.g||'?');
}
function journeyInfoHTML(key,log){
  const ts=journeySel[key];if(!ts)return '';
  const a=(log||[]).find(x=>x.ts===ts);if(!a)return '';
  return '<div class="journey-info"><span>'+esc(journeyAttemptLine(a))+'</span>'+
    '<button type="button" class="ji-del" title="remove this attempt" aria-label="remove this attempt" '+
    'onclick="journeyRemove(\''+key+'\','+ts+')">'+ICO.del+'</button></div>';
}
// aantikken selecteert of heft de selectie op; nooit twee tegelijk voor dezelfde key
function journeyPick(key,ts){
  journeySel[key]=(journeySel[key]===ts)?null:ts;
  journeyRefresh();
}
function journeyRemove(key,ts){
  if(!confirm('remove this attempt from the journey?'))return;
  const log=state.dialLog||{};
  if(Array.isArray(log[key]))log[key]=log[key].filter(a=>a.ts!==ts);
  journeySel[key]=null;
  save();toast('attempt removed');
  journeyRefresh();
}
// dezelfde tekening staat mogelijk op het dial-in-scherm én op een boonkaart
function journeyRefresh(){
  try{if(currentPage==='dialin')renderDiJourney();}catch(e){}
  try{if(currentPage==='beans')renderBeans();}catch(e){}
}

function renderDiBeans(){
  const el=document.getElementById('di-beans');if(!el)return;
  let html='<button class="lp '+(!formBean?'sel':'')+'" onclick="pickDiBean(null)">none</button>';
  html+=state.beans.filter(b=>b.inStock!==false||b.id===formBean)
    .map(b=>'<button class="lp '+(b.id===formBean?'sel':'')+'" onclick="pickDiBean(\''+b.id+'\')">'+esc(b.name)+'</button>').join('');
  el.innerHTML=html;
}
function pickDiBean(id){formBean=id;renderDiBeans();renderDiGoal();diAdvice();renderStartHint('di-start');}
function renderDiGoal(){
  const el=document.getElementById('di-goal');if(!el)return;
  const t=pendingTarget||{};
  const bean=beanById(formBean);
  const aiGrind=(bean&&bean.dialIn&&bean.dialIn.method===formMethod)?bean.dialIn.grind:'';
  const shownGrind=t.grind||aiGrind||'';
  const isAI=aiGrind&&shownGrind===aiGrind;
  el.innerHTML=`<div class="di-t"><span><svg class="acic" viewBox="0 0 24 24" style="width:19px;height:19px;vertical-align:-3px"><path d="M18.4 9.4 Q21.4 14.4 17.2 18.5 Q12.5 21.3 7.5 18.6 Q3.3 15.3 4.6 10.1 Q6.6 4.9 12.1 3.8 Q16.5 3.9 19 8.3"/><path d="M15 9.3 Q17.2 12.4 14.6 15.2 Q11.5 17 8.8 14.8 Q6.9 12.1 9 9.5 Q11.5 7.2 14.5 8.6"/><path d="M12.9 11.2 Q13.7 12.6 12.2 13.3 Q10.8 13.1 10.9 11.6 Q11.4 10.8 12.6 11.1"/></svg> target</span><span>ratio 1:${(t.dose&&t.yield)?(parseFloat(t.yield)/parseFloat(t.dose)).toFixed(1).replace('.0',''):'2'}</span></div>
    <div class="di-grid">
      <div><div class="k">dose in</div><div class="v hand">${t.dose?esc(t.dose)+' <small>g</small>':'18 <small>g</small>'}</div></div>
      <div><div class="k">yield out</div><div class="v hand">${t.yield?esc(t.yield)+' <small>g</small>':'36 <small>g</small>'}</div></div>
      <div><div class="k">shot time</div><div class="v hand">${t.time?esc(t.time):'26–30 <small>s</small>'}</div></div>
      <div><div class="k">grind</div><input class="v-edit hand" id="di-target-grind" value="${esc(shownGrind)}" placeholder="—" inputmode="text" onchange="setTargetGrind(this.value)">${isAI?'<div class="di-ai">✦ AI tip</div>':''}</div>
    </div>`;
}
// pas de doel-maalstand aan voor een realistischer startpunt
function setTargetGrind(v){if(!pendingTarget)pendingTarget={};pendingTarget.grind=(v||'').trim();renderDiGoal();}
function diAdvice(){
  const el=document.getElementById('di-advice');if(!el)return;
  const t=pendingTarget||{};
  const aT=parseTimeSec(document.getElementById('di-time')?.value);
  const aY=parseFloat(document.getElementById('di-yield')?.value)||null;
  const tT=parseTimeSec(t.time)||28;
  const tY=parseFloat(t.yield)||36;
  const grinder=(state.gear||[]).filter(g=>g.kind==='grinder'&&g.name).map(gearLabel)[0];
  const bean=beanById(formBean);
  const clock='<svg class="acic" viewBox="0 0 24 24" style="width:18px;height:18px;vertical-align:-3px"><path d="M18.3 9.6 Q21 14.3 17 18.3 Q12.4 21 7.6 18.4 Q3.6 15.2 4.8 10.2 Q6.8 5.2 12 4.1 Q16.3 4.2 18.8 8.5"/><path d="M12 6.9 Q12.2 9.6 12.1 12.3 Q13.8 13.2 15.7 14.3"/></svg> ';
  const shot=document.getElementById('di-time')?.value||'';
  let html='';
  if(aT&&aY){
    // vergelijk de doorloopsnelheid (g/s), niet alleen de tijd — zo weet je of hij te snel of te traag liep
    const f=aY/aT, ft=tY/tT;
    let dir;
    if(f<ft*0.85)dir='slow — only '+aY+'g out in '+shot+' (target '+tY+'g) → grind coarser';
    else if(f>ft*1.15)dir='fast — '+aY+'g out in '+shot+' (target '+tY+'g) → grind finer';
    else dir='on target ✓';
    html+=clock+dir+((grinder&&!/on target/.test(dir))?' on your '+esc(grinder):'');
  }else if(aT){
    const diff=aT-tT, tol=3;
    let dir=diff>tol?'slower than target → grind coarser':diff<-tol?'faster than target → grind finer':'on target so far ✓';
    html+=clock+esc(shot)+' vs target '+esc(t.time||('0:'+String(tT).padStart(2,'0')))+' → '+dir+' (also enter yield for a better read)';
  }
  const fr=beanFreshness(bean),hint=fr?freshGrindHint(fr.days):null;
  if(hint&&hint.dir!=='stable'){
    html+=(html?'<br>':'')+'day '+fr.days+' — '+esc(hint.s)+': '+
      (hint.dir==='coarser'?'expect it to run slow, lean coarser':'expect it to run fast, lean finer');
  }
  if(bean&&bean.dialIn&&bean.dialIn.method===formMethod&&bean.dialIn.grind){
    html+=(html?'<br>':'')+'✦ AI tip: try grind '+esc(bean.dialIn.grind)+(bean.dialIn.reason?' — '+esc(bean.dialIn.reason):'');
  }
  el.innerHTML=html;el.style.display=html?'block':'none';
}
async function saveDialInBrew(next){
  const dose=parseFloat(document.getElementById('di-dose').value)||null;
  const yld=parseFloat(document.getElementById('di-yield').value)||null;
  const usedGrind=(document.getElementById('di-grind').value||'').trim();
  const t=pendingTarget||{};
  const prep={};Object.keys(formPrep).forEach(k=>{const s=formPrep[k];if(s&&(s.on||s.val))prep[k]={on:!!s.on,val:s.val||''};});
  const rec=pendingRecipe||{};
  const b={id:uid(),method:formMethod,dialIn:!!next,title:(rec.title||rec.drink||''),drink:(rec.drink||''),
    dose,yield:yld,ratio:(dose&&yld)?+(yld/dose).toFixed(1):null,
    time:document.getElementById('di-time').value.trim(),
    temp:(formPrep.temp&&formPrep.temp.val)?(parseFloat(formPrep.temp.val)||null):null,
    score:0,notes:'',grind:usedGrind||t.grind||'',
    beanId:formBean,beans:(beanById(formBean)?.name)||'',
    tags:[],custom:[],guide:(rec.guide||''),target:pendingTarget||null,
    prep:Object.keys(prep).length?prep:null,ts:Date.now()};
  BrewModel.attachBrew(state,b,formRecipeSnapshot||recipeById((state.lastRecipe||{})[formMethod]));
  state.brews.push(b);
  // journey-log: elke poging apart bewaren (het brew-record blijft er één)
  if(!state.dialLog)state.dialLog={};
  const lk=(b.beanId||'')+'|'+b.method;
  (state.dialLog[lk]=state.dialLog[lk]||[]).push({ts:b.ts,g:b.grind||'',t:b.time||'',y:b.yield||null,d:b.dose||null});
  // Keep all measured attempts; the chart can limit its visible points.
  // "nailed" is een feit, geen suggestie: dat leggen we vast op de bóón, per
  // methode. Een andere drank met dezelfde boon begint daar dan vanaf.
  if(!next&&b.beanId&&(b.grind||b.time)){
    const bn=beanById(b.beanId);
    if(bn){
      if(!bn.dialed||typeof bn.dialed!=='object')bn.dialed={};
      bn.dialed[b.method]={grind:b.grind||'',dose:b.dose||null,yield:b.yield||null,
        time:b.time||'',drink:b.drink||'',ts:b.ts};
    }
  }
  save();
  // Paid AI advice is requested explicitly through the coffee coach.
  if(next){
    const bean=beanById(b.beanId);
    const newGrind=(bean&&bean.dialIn&&bean.dialIn.method===b.method)?bean.dialIn.grind:(b.grind||'');
    // het DOEL blijft het doel (yield/tijd niet overschrijven met je gemeten waarden); alleen de maalstand wordt bijgesteld
    pendingTarget={dose:t.dose||(dose?String(dose):''),yield:t.yield||'',time:t.time||'',grind:newGrind};
    openDialIn(b.method);
    // als de AI net een maaltip gaf, laat die toast staan (met reden); anders eigen bericht
    const gotAiTip=bean&&bean.dialIn&&bean.dialIn.method===b.method&&aiReady();
    if(!gotAiTip)toast('attempt saved — adjust the grind and try again');
  }else{toast('✓ dial-in saved');go('home');}
}
function pickMethod(id){formMethod=id;renderFormMethods();renderDialInHint();}
function renderFormBeans(){
  const el=document.getElementById('form-beans');
  // alleen wat er nog in de kast staat. Een boon die op is blijft staan zolang
  // hij bij deze brew hoort, anders raak je hem kwijt zodra je iets bewerkt.
  const kiesbaar=state.beans.filter(b=>b.inStock!==false||b.id===formBean);
  let html='<button class="lp '+(!formBean?'sel':'')+'" onclick="pickBean(null)">none</button>';
  html+=kiesbaar.map(b=>'<button class="lp '+(b.id===formBean?'sel':'')+'" onclick="pickBean(\''+b.id+'\')">'+esc(b.name)+'</button>').join('');
  html+='<button class="lp" onclick="openBeanForm()">＋ nieuw</button>';
  el.innerHTML=html;
}
function pickBean(id){formBean=id;renderFormBeans();cardSummaries();
  // de boon is het beginpunt: hij kiest de methode, en daarmee liggen de
  // brewer, de molen en de bloom die bij zijn versheid past ook al vast
  const b=beanById(id);
  if(b&&b.method&&state.methods.find(m=>m.id===b.method&&m.on)){
    formMethod=b.method;renderFormMethods();   // roept applyFamilyToForm en dus het invullen aan
  }else{vulGearAuto();vulBloomAuto();}
  renderDialInHint();pourBloom();
}
function renderFormTags(){
  const el=document.getElementById('form-tags');
  const all=[...new Set([...PRESET_TAGS,...formTags])];
  el.innerHTML=all.map(t=>'<button class="tag-pick '+(formTags.includes(t)?'sel':'')+'" onclick="toggleTag(\''+esc(t).replace(/'/g,"")+'\')">'+esc(t)+'</button>').join('');
}
function toggleTag(t){const i=formTags.indexOf(t);if(i>=0)formTags.splice(i,1);else formTags.push(t);renderFormTags();}
function addTag(){const v=document.getElementById('f-tagnew').value.trim().toLowerCase();
  if(!v)return;if(!formTags.includes(v))formTags.push(v);document.getElementById('f-tagnew').value='';renderFormTags();}
function calc(changed){
  const dose=parseFloat(document.getElementById('f-dose').value);
  const yld=parseFloat(document.getElementById('f-yield').value);
  const ratio=parseFloat(document.getElementById('f-ratio').value);
  if(changed==='ratio'&&dose>0&&ratio>0){document.getElementById('f-yield').value=(dose*ratio).toFixed(1);}
  else if(changed==='dose'&&dose>0&&yld>0){document.getElementById('f-ratio').value=(yld/dose).toFixed(1);}
  else if(changed==='yield'&&dose>0&&yld>0){document.getElementById('f-ratio').value=(yld/dose).toFixed(1);}
  else if(changed==='dose'&&dose>0&&ratio>0&&!yld){document.getElementById('f-yield').value=(dose*ratio).toFixed(1);}
}
function saveBrew(){
  const b={
    id:editingId||uid(),method:formMethod,
    title:document.getElementById('f-title').value.trim(),
    drink:editingId?(state.brews.find(x=>x.id===editingId)?.drink||''):'',
    dose:parseFloat(document.getElementById('f-dose').value)||null,
    yield:parseFloat(document.getElementById('f-yield').value)||null,
    ratio:parseFloat(document.getElementById('f-ratio').value)||null,
    time:document.getElementById('f-time').value.trim(),
    temp:parseFloat(document.getElementById('f-temp').value)||null,
    score:parseFloat(document.getElementById('f-score').value)||0,
    notes:document.getElementById('f-notes').value.trim(),
    grind:document.getElementById('f-grind').value.trim(),
    bloom:(function(){const g=document.getElementById('f-bloom-g').value.trim();const s=document.getElementById('f-bloom-s').value.trim();return (g||s)?{g,s}:null;})(),
    draw:document.getElementById('f-draw').value.trim(),
    bed:formBed||null,
    cup:formCup||null,
    tds:editingId?(state.brews.find(x=>x.id===editingId)?.tds??null):null,
    brewer:document.getElementById('f-brewer').value.trim(),
    grinder:formMolen||'',
    paper:formOud.paper||'',
    water:formOud.water||'',
    beanId:formBean,beans:(beanById(formBean)?.name)||'',
    tags:[...formTags],
    custom:formCustom.filter(c=>c.k.trim()||c.v.trim()),
    guide:editingId?(state.brews.find(x=>x.id===editingId)?.guide||''):'',
    target:editingId?(state.brews.find(x=>x.id===editingId)?.target||null):(pendingTarget||null),
    prep:(function(){const p={};Object.keys(formPrep).forEach(k=>{const s=formPrep[k];if(s&&(s.on||s.val))p[k]={on:!!s.on,val:s.val||''};});return Object.keys(p).length?p:null;})(),
    ts:editingId?(state.brews.find(x=>x.id===editingId)?.ts||Date.now()):Date.now()
  };
  const previous=editingId?state.brews.find(x=>x.id===editingId):null;
  if(previous){b.recipeId=previous.recipeId||null;b.recipeSnapshot=previous.recipeSnapshot||null;b.beanSnapshot=previous.beanId===b.beanId?(previous.beanSnapshot||null):null;}
  BrewModel.attachBrew(state,b,previous?null:(formRecipeSnapshot||recipeById(pc.mid===formMethod?pc.rid:(state.lastRecipe||{})[formMethod])));
  if(editingId){const i=state.brews.findIndex(x=>x.id===editingId);state.brews[i]=b;}
  else state.brews.push(b);
  save();toast(editingId?'✓ brew updated':'✓ brew saved');
  pendingTarget=null;
  // op de achtergrond: leer van deze poging en bereken de volgende maalstand
  // AI advice is requested explicitly in the coffee coach, never billed by saving.
  go('brews');
}
function cancelForm(){goBack(editingId?'detail':'home');}

/* ---------------- detail ---------------- */
let currentDetail=null;
function prepSummaryHTML(b){
  if(!b.prep)return '';
  const items=(state.prepItems||[]);
  const rows=[];
  Object.keys(b.prep).forEach(k=>{
    const st=b.prep[k];if(!st||(!st.on&&!st.val))return;
    const it=items.find(x=>x.id===k);
    const name=it?it.name:k;
    const val=st.val?(' <span class="pd-val">'+esc(st.val)+(it&&it.unit?' '+esc(it.unit):'')+'</span>'):'';
    rows.push('<div class="prep-done">'+esc(name)+val+'</div>');
  });
  return rows.join('');
}
function openDetail(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;currentDetail=id;
  const m=methodById(b.method);
  const fam=methodFamily(b.method);
  const ratioTxt=b.ratio?('1:'+(+b.ratio).toFixed(1)):'—';
  const bean=b.beanId?beanById(b.beanId):null;
  const advice=(bean&&bean.dialIn&&bean.dialIn.method===b.method&&bean.dialIn.grind)?bean.dialIn:null;
  const prepHtml=prepSummaryHTML(b);
  // maling: eigen invoer, anders (bij filter) de door AI+gear berekende maalstand
  const malingVal=b.grind?esc(b.grind):(advice?esc(advice.grind)+' <small style="color:var(--ink-soft);font-size:15px">✦</small>':'—');
  const beanName=(b.beans&&b.beans.trim())?b.beans.trim():(bean?bean.name:'');
  const scoreTxt=(+b.score).toFixed(1);
  // ondertitel: bij eigen titel de methode + boon, anders (methode staat al als titel) alleen de boon
  const subParts=[];if(b.title&&b.title.trim())subParts.push(esc(m.name));if(beanName)subParts.push(esc(beanName));
  const bloomTxt=b.bloom?[b.bloom.g?b.bloom.g+' g':'',b.bloom.s?b.bloom.s+' s':''].filter(Boolean).join(' · '):'';
  // filter-raster bevat bloom en zet score+ratio klein bovenaan; espresso houdt score in het raster
  const grid = fam==='filter' ? `
      <div class="stat-ratio">ratio ${ratioTxt} · score ${scoreTxt}/10</div>
      <div class="stat-grid">
        <div class="stat"><div class="k">dose in</div><div class="v hand">${b.dose?esc(b.dose)+' g':'—'}</div></div>
        <div class="stat"><div class="k">yield out</div><div class="v hand">${b.yield?esc(b.yield)+' g':'—'}</div></div>
        <div class="stat"><div class="k">bloom</div><div class="v hand">${esc(bloomTxt||'—')}</div></div>
        <div class="stat"><div class="k">time</div><div class="v hand">${esc(b.time||'—')}</div></div>
        ${b.draw?'<div class="stat"><div class="k">drawdown</div><div class="v hand">'+esc(b.draw)+'</div></div>':''}
        ${b.bed?'<div class="stat"><div class="k">bed</div><div class="v hand">'+esc(bedName(b.bed))+'</div></div>':''}
        <div class="stat"><div class="k">grind</div><div class="v hand">${malingVal}</div></div>
        <div class="stat"><div class="k">temp</div><div class="v hand">${b.temp?esc(b.temp)+'°C':'—'}</div></div>
      </div>` : `
      <div class="stat-ratio">ratio ${ratioTxt} · score ${scoreTxt}/10</div>
      <div class="stat-grid">
        <div class="stat"><div class="k">dose in</div><div class="v hand">${b.dose?esc(b.dose)+' g':'—'}</div></div>
        <div class="stat"><div class="k">yield out</div><div class="v hand">${b.yield?esc(b.yield)+' g':'—'}</div></div>
        <div class="stat"><div class="k">shot time</div><div class="v hand">${esc(b.time||'—')}</div></div>
        <div class="stat"><div class="k">grind</div><div class="v hand">${malingVal}</div></div>
        <div class="stat"><div class="k">temp</div><div class="v hand">${b.temp?esc(b.temp)+'°C':'—'}</div></div>
      </div>`;
  document.getElementById('detail-body').innerHTML=`
    <div class="detail-top"><button onclick="goBack('brews')">‹</button>
      <div class="h hand">${esc((b.title&&b.title.trim())?b.title:m.name)}</div><div class="edit hand" onclick="openEdit(state.brews.find(x=>x.id==='${id}'))">edit</div></div>
    ${subParts.length?'<div class="subtitle" style="text-align:center;margin:-8px 0 4px">'+subParts.join(' · ')+'</div>':''}
    <div class="hero-img"><span class="doodle steam" style="top:0;left:50%;">∿ ∿ ∿</span>${iconHTML(m,210)}</div>
    <div class="stat-card sketch" style="background:var(${m.tint});">${grid}</div>
    ${(fam==='espresso'&&b.target&&fmtShot(b.target))?'<div class="notes-card sketch soft"><div class="k">target (dial-in)</div><div class="v">'+esc(fmtShot(b.target))+'</div></div>':''}
    ${advice?'<div class="notes-card sketch soft"><div class="k">grind tip'+(fam==='espresso'?'':' — gear-aware')+'</div><div class="v">next time: grind '+esc(advice.grind)+(advice.reason?' <span style="color:var(--ink-soft)">— '+esc(advice.reason)+'</span>':'')+'</div></div>':''}
    ${prepHtml?'<div class="notes-card sketch soft"><div class="k">'+(fam==='espresso'?'puck-prep & machine':'prep')+'</div>'+prepHtml+'</div>':''}
    ${(b.brewer||b.grinder||b.paper||b.water)?'<div class="notes-card sketch soft"><div class="k">gear</div><div class="v">'+[b.brewer,b.grinder,b.paper,b.water].filter(Boolean).map(esc).join(' · ')+'</div></div>':''}
    <div class="notes-card sketch soft"><div class="k">notes</div><div class="v">${esc(b.notes||(b.tags&&b.tags.length?'':'no notes'))}</div>
      ${asArr(b.tags).length?'<div class="note-tags">'+asArr(b.tags).map(t=>'<span class="nt">'+esc(t)+'</span>').join('')+'</div>':''}
      ${asArr(b.custom).length?'<div style="margin-top:10px">'+asArr(b.custom).map(c=>'<div class="rstep"><span style="color:var(--ink-soft)">'+esc(c.k)+':</span> '+esc(c.v)+'</div>').join('')+'</div>':''}</div>
    ${fam==='filter'?filterCompassHTML(b):''}
    ${tasteWheelStatic(b.tags,'taste')}
    ${freshGaugeHTML(bean,b.ts,'the bean on brew day')}
    ${typeof BrewWorkspace!=='undefined'?BrewWorkspace.historyRecipeHTML(b):(b.guide?customGuideHTML(b.guide):'')}
    <div class="detail-actions sketch soft">
      <button class="act" onclick="delBrew('${id}')"><span class="ic">${ICO.del}</span>delete</button>
      <button class="act primary hand" onclick="brewAgain('${id}')">brew again</button>
      <button class="act" onclick="shareOneBrew('${id}')"><span class="ic">${ICO.send}</span>send</button>
      <button class="act" onclick="shareBrew('${id}')"><span class="ic">${ICO.chat}</span>text</button>
      <button class="act" onclick="printBrew('${id}')"><span class="ic"><svg viewBox="0 0 24 24" class="acic"><path d="M6.9 9.4 Q6.8 4.9 7.2 4.2 Q12 3.8 16.8 4.3 Q17.2 8.2 17.1 9.4 M5.4 9.5 Q4.1 9.1 4.3 11 Q4.1 14.6 4.5 16.6 Q6.1 16.8 8.2 16.6 M18.6 9.5 Q19.9 9.1 19.7 11 Q19.9 14.6 19.5 16.6 Q17.9 16.8 15.8 16.6 M7.3 13.3 Q12 12.8 16.9 13.4 M16.6 13.1 Q16.9 17 16.8 20.3 M17 19.9 Q12 20.6 7.1 20.1 M7.4 20.4 Q7 16.9 7.2 13"/></svg></span>PDF</button>
      ${featOn('sharecards')?`<button class="act" onclick="shareCard('${id}')"><span class="ic"><svg viewBox="0 0 24 24" class="acic"><path d="M4.3 6.2 Q12 5.8 19.8 6.5 M19.5 6.1 Q20.1 12 19.6 17.9 M19.8 17.6 Q12 18.2 4.2 17.6 M4.5 17.9 Q3.8 12 4.4 6"/><path d="M6.8 10 Q9.5 9.6 12.2 10.2 M6.8 13.5 Q10 13.1 13.2 13.7" opacity="0.6"/><path d="M18 11 Q18.5 12.4 17 13 Q15.5 12.8 15.6 11.3 Q16.1 10.2 17.5 10.5" opacity="0.7"/></svg></span>card</button>`:''}
    </div>`;
  go('detail');
}
function customGuideHTML(guide){
  return `<div class="guide-card sketch soft open">
    <button class="guide-toggle" onclick="this.parentElement.classList.toggle('open')">
      <span class="hand">how to brew this?</span><span class="g-arr">▸</span></button>
    <div class="guide-body"><div class="rstep" style="white-space:pre-wrap">${esc(guide)}</div></div></div>`;
}
function guideHTML(methodId){
  const g=guideFor(methodId);if(!g)return'';
  const steps=g.steps.map((st,i)=>`<div class="rstep">${i+1}. ${esc(st)}</div>`).join('');
  return `<div class="guide-card sketch soft">
    <button class="guide-toggle" onclick="this.parentElement.classList.toggle('open')">
      <span class="hand">how to brew this?</span><span class="g-arr">▸</span></button>
    <div class="guide-body">
      <div class="rk">recept</div><div class="rstep">${esc(g.recept)}</div>
      <div class="rk">maling</div><div class="rstep">${esc(g.grind)}</div>
      <div class="rk">stappen</div>${steps}
      ${g.tip?'<div class="rk">tip</div><div class="rstep">💡 '+esc(g.tip)+'</div>':''}
    </div></div>`;
}
function delBrew(id){
  if(!confirm('delete this brew?'))return;
  state.brews=state.brews.filter(x=>x.id!==id);save();toast('🗑 brew deleted');go('home');
}
// één brew als importeerbaar bestand delen
async function shareOneBrew(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  // neem de gekoppelde boon mee, zodat de ontvanger 'm er automatisch bij krijgt
  const brewCopy=Object.assign({},b);
  const bean=b.beanId?beanById(b.beanId):null;
  if(bean)brewCopy.bean=Object.assign({},bean);
  const pakket={type:'lbs-brews',v:1,brews:[brewCopy]};
  const json=JSON.stringify(pakket,null,2);
  const m=methodById(b.method);
  const fname=((m.name||'brew')+'-'+(b.beans||'')).replace(/[^a-z0-9]+/gi,'-').toLowerCase().replace(/^-|-$/g,'')+'.lbsbrew.json';
  const file=new File([json],fname,{type:'application/json'});
  const tekst='A brew from Lets Brew Specialty — open it in the app via profile → add from a friend.';
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'Brew',text:tekst});return;}
    catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=fname;a.click();
  URL.revokeObjectURL(url);
  toast('file saved — send it on');
}
// brew-bestand van iemand anders importeren (samenvoegen, niet vervangen)
function importBrewsFile(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{BrewSecurity.checkFile(file);}catch(e){toast(e.message);ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=BrewSecurity.validateImport(JSON.parse(r.result));
      const inkomend = d.type==='lbs-brews'&&Array.isArray(d.brews) ? d.brews
                     : Array.isArray(d.brews) ? d.brews : null;
      if(!inkomend)throw new Error('geen brews');
      if(!inkomend.length){toast('no brews in file');ev.target.value='';return;}
      let toegevoegd=0;
      inkomend.forEach(nb=>{
        if(!nb||!nb.method)return;
        const kopie=Object.assign({},nb);
        kopie.id=uid();                       // nieuw id
        kopie.ts=Date.now();                  // als 'net toegevoegd'
        kopie.beanId=null;                    // koppeling geldt niet bij de ander
        state.brews.push(kopie);toegevoegd++;
      });
      save();
      toast('✓ '+toegevoegd+' brew'+(toegevoegd===1?'':'s')+' added');
      go('brews');
    }catch(e){toast('couldn\'t read the file');}
    ev.target.value='';
  };
  r.readAsText(file);
}
function shareBrew(id){
  const b=state.brews.find(x=>x.id===id);const m=methodById(b.method);
  const txt=`${m.name} · ${b.beans||''}\n`+
    `ratio ${b.ratio?'1:'+(+b.ratio).toFixed(1):'-'} · dose ${b.dose||'-'}g · yield ${b.yield||'-'}g\n`+
    `time ${b.time||'-'} · ${b.temp||'-'}°C · score ${(+b.score).toFixed(1)}/10\n`+
    `${b.notes||''}\n\nMade with Lets Brew Specialty — try it yourself:`;
  const appUrl=location.origin+location.pathname;
  // native deelvenster (deelt tekst + link naar de web-app)
  if(navigator.share){
    navigator.share({title:'Lets Brew Specialty',text:txt,url:appUrl}).catch(()=>{});
  }else{
    const url='https://wa.me/?text='+encodeURIComponent(txt+'\n'+appUrl);
    window.open(url,'_blank');
  }
}
// hele app / bonenlijst delen
function shareApp(){
  const appUrl=location.origin+location.pathname;
  const txt='Check out my coffee app Lets Brew Specialty ☕ — track brews, beans, score flavours:';
  if(navigator.share){
    navigator.share({title:'Lets Brew Specialty',text:txt,url:appUrl}).catch(()=>{});
  }else{
    window.open('https://wa.me/?text='+encodeURIComponent(txt+'\n'+appUrl),'_blank');
  }
}
function shareBeans(){
  const inHuis=state.beans.filter(b=>b.inStock!==false);
  let lijst=inHuis.map(b=>'• '+b.name+(b.roaster?' ('+b.roaster+')':'')).join('\n')||'(no beans in stock yet)';
  const appUrl=location.origin+location.pathname;
  const txt='My bean shelf in Lets Brew Specialty ☕\n\n'+lijst+'\n\nTry the app yourself:';
  if(navigator.share){
    navigator.share({title:'My bean shelf',text:txt,url:appUrl}).catch(()=>{});
  }else{
    window.open('https://wa.me/?text='+encodeURIComponent(txt+'\n'+appUrl),'_blank');
  }
}
// bonen als importeerbaar bestand delen (generiek: 1 of meer bonen)
async function shareBeansList(beans,titel){
  if(!beans.length){toast('nothing to share');return;}
  const pakket={type:'lbs-beans',v:1,from:'',beans:beans};
  const json=JSON.stringify(pakket,null,2);
  const naam=beans.length===1?beans[0].name:'beans';
  const fname=naam.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.lbsbeans.json';
  const file=new File([json],fname,{type:'application/json'});
  const tekst=(beans.length===1?'A coffee bean':'Coffee beans')+' from Lets Brew Specialty — open in the app via profile → add from a friend.';
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:titel||'Bonen',text:tekst});return;}
    catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=fname;a.click();
  URL.revokeObjectURL(url);
  toast('file saved — send it on');
}
function shareOneBean(id){
  const b=state.beans.find(x=>x.id===id);if(!b)return;
  shareBeansList([b],b.name);
}
// bonen-bestand van iemand anders importeren (samenvoegen, niet vervangen)
function importBeansFile(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{BrewSecurity.checkFile(file);}catch(e){toast(e.message);ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=BrewSecurity.validateImport(JSON.parse(r.result));
      // accepteer zowel het bonen-pakket als een volledige back-up
      const inkomend = d.type==='lbs-beans'&&Array.isArray(d.beans) ? d.beans
                     : Array.isArray(d.beans) ? d.beans : null;
      if(!inkomend)throw new Error('geen bonen');
      if(!inkomend.length){toast('no beans in file');ev.target.value='';return;}
      let toegevoegd=0, overgeslagen=0;
      inkomend.forEach(nb=>{
        if(!nb||!nb.name)return;
        // duplicaat = zelfde naam + brander (hoofdletterongevoelig)
        const dup=state.beans.some(b=>
          (b.name||'').toLowerCase().trim()===(nb.name||'').toLowerCase().trim() &&
          (b.roaster||'').toLowerCase().trim()===(nb.roaster||'').toLowerCase().trim());
        if(dup){overgeslagen++;return;}
        const kopie=Object.assign({},nb);
        kopie.id=uid();                 // nieuw id, anders botst het
        if(kopie.inStock===undefined)kopie.inStock=true;
        state.beans.push(kopie);toegevoegd++;
      });
      save();renderBeans();
      let msg='✓ '+toegevoegd+' bean'+(toegevoegd===1?'':'s')+' added';
      if(overgeslagen)msg+=' · '+overgeslagen+' already present';
      toast(msg);
      go('beans');
    }catch(e){toast('couldn\'t read the file');}
    ev.target.value='';
  };
  r.readAsText(file);
}
// unieke importer: brews én/of bonen van een vriend (voegt toe, vervangt niet).
// een bij een brew meegestuurde boon komt automatisch mee en blijft gekoppeld.
function importFriend(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{BrewSecurity.checkFile(file);}catch(e){toast(e.message);ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=normaliseerData(BrewSecurity.validateImport(JSON.parse(r.result)));
      let addedBrews=0,addedBeans=0,skippedBeans=0;
      const idMap={};                         // oud boon-id -> nieuw boon-id
      const addBean=(nb)=>{
        if(!nb||!nb.name)return null;
        const bestaand=state.beans.find(b=>
          (b.name||'').toLowerCase().trim()===(nb.name||'').toLowerCase().trim() &&
          (b.roaster||'').toLowerCase().trim()===(nb.roaster||'').toLowerCase().trim());
        if(bestaand){skippedBeans++;if(nb.id)idMap[nb.id]=bestaand.id;return bestaand.id;}
        const kopie=Object.assign({},nb);
        const oud=kopie.id;kopie.id=uid();
        if(kopie.inStock===undefined)kopie.inStock=true;
        state.beans.push(kopie);addedBeans++;
        if(oud)idMap[oud]=kopie.id;
        return kopie.id;
      };
      // 1) losse bonen in het pakket
      (Array.isArray(d.beans)?d.beans:[]).forEach(addBean);
      // 2) brews (+ eventueel meegestuurde boon)
      (Array.isArray(d.brews)?d.brews:[]).forEach(nb=>{
        if(!nb||!nb.method)return;
        const kopie=Object.assign({},nb);
        kopie.id=uid();kopie.ts=Date.now();
        if(kopie.bean&&kopie.bean.name){kopie.beanId=addBean(kopie.bean);}
        else if(kopie.beanId&&idMap[kopie.beanId]){kopie.beanId=idMap[kopie.beanId];}
        else{kopie.beanId=null;}
        delete kopie.bean;
        state.brews.push(kopie);addedBrews++;
      });
      if(!addedBrews&&!addedBeans&&!skippedBeans){toast('no brews or beans in this file');ev.target.value='';return;}
      save();
      const parts=[];
      if(addedBrews)parts.push(addedBrews+' brew'+(addedBrews===1?'':'s'));
      if(addedBeans)parts.push(addedBeans+' bean'+(addedBeans===1?'':'s'));
      let msg='✓ '+(parts.join(' + ')||'nothing new')+' added';
      if(skippedBeans)msg+=' · '+skippedBeans+' bean'+(skippedBeans===1?'':'s')+' already present';
      toast(msg);
      go(addedBrews?'brews':'beans');
    }catch(e){toast('couldn\'t read the file');}
    ev.target.value='';
  };
  r.readAsText(file);
}

/* ---------------- PDF / print (om te lezen, bibliotheekvrij) ---------------- */
function pesc(s){return esc(s);} // korte alias voor de printvellen
function brewSheetHTML(b){
  const m=methodById(b.method);
  const bean=b.beanId?beanById(b.beanId):null;
  const titel=(b.title&&b.title.trim())?b.title:(m?m.name:'brew');
  const datum=b.ts?new Date(b.ts).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'';
  const metaBits=[m?m.name:'',bean?bean.name:'',datum].filter(Boolean).map(pesc).join(' · ');
  const rows=[
    ['ratio',b.ratio?'1:'+(+b.ratio).toFixed(1):null],
    ['dose',b.dose?b.dose+' g':null],
    ['yield',b.yield?b.yield+' g':null],
    ['bloom',b.bloom?[b.bloom.g?b.bloom.g+' g':'',b.bloom.s?b.bloom.s+' s':''].filter(Boolean).join(' · '):null],
    ['time',b.time||null],
    ['temp',b.temp?b.temp+' °C':null],
    ['grind',b.grind||null],
    ['target',(b.target&&fmtShot(b.target))?fmtShot(b.target):null],
    ['score',(b.score!=null&&b.score!=='')?(+b.score).toFixed(1)+'/10':null]
  ].filter(r=>r[1]).map(r=>'<b>'+pesc(r[0])+':</b> '+pesc(r[1])).join(' &nbsp; ');
  let guideTxt='';
  if(b.guide){guideTxt=b.guide;}
  else{const g=guideFor(b.method);if(g){guideTxt='recept: '+g.recept+'\nmaling: '+g.grind+'\n'+g.steps.map((s,i)=>(i+1)+'. '+s).join('\n');}}
  const tags=asArr(b.tags).length?('taste: '+asArr(b.tags).join(', ')):'';
  return `<div class="p-brew">
    <div class="p-bt"><span class="p-ic">${iconHTML(m,34)}</span>${pesc(titel)}</div>
    <div class="p-meta">${metaBits||''}</div>
    <div class="p-grid">${rows||'—'}</div>
    ${b.notes?'<div class="p-notes">'+pesc(b.notes)+'</div>':''}
    ${tags?'<div class="p-notes">'+pesc(tags)+'</div>':''}
    ${guideTxt?'<div class="p-steps">'+pesc(guideTxt).replace(/\n/g,'<br>')+'</div>':''}
  </div>`;
}
function runPrint(html){
  const area=document.getElementById('print-area');
  area.innerHTML=html;
  const after=()=>{area.innerHTML='';window.removeEventListener('afterprint',after);};
  window.addEventListener('afterprint',after);
  setTimeout(()=>window.print(),60);
}
function printBrew(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  const html='<div class="p-h1">'+pesc((b.title&&b.title.trim())?b.title:(methodById(b.method)?.name||'brew'))+'</div>'+
    '<div class="p-sub">lets brew specialty — brew recipe</div>'+brewSheetHTML(b);
  runPrint(html);
}
function printLogbook(){
  if(!state.brews.length){toast('no brews to save yet');return;}
  const brews=[...state.brews].sort((a,b)=>(b.ts||0)-(a.ts||0));
  const html='<div class="p-h1">mijn brew-logboek</div>'+
    '<div class="p-sub">lets brew specialty · '+brews.length+' brews · '+state.beans.length+' beans · '+
    new Date().toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'})+'</div>'+
    brews.map(brewSheetHTML).join('');
  runPrint(html);
}

/* ---------------- methodes beheren ---------------- */
let mmNewImg=null;
function renderMethods(){
  document.getElementById('mm-list').innerHTML=state.methods.map(m=>{
    const cnt=state.brews.filter(b=>b.method===m.id).length;
    return `<div class="mm-item sketch soft" style="background:var(${m.tint});">
      <span class="mm-glyph">${iconHTML(m,40)}</span>
      <div style="flex:1">
        <div class="mm-name hand">${esc(m.name)}</div>
        <div style="font-size:14px;color:var(--ink-soft)">
          ${cnt>0?`<a class="bean-link" onclick="showMethodBrews('${m.id}')">${cnt} brew${cnt===1?'':'s'} →</a>`:'no brews yet'}
          · <a class="bean-link" onclick="openImgPicker('${m.id}')">drawing</a>
        </div>
        <div style="font-size:14px;color:var(--ink-soft);margin-top:2px">family: <a class="bean-link" onclick="toggleMethodFamily('${m.id}')">${esc(methodFamily(m))} ⇄</a></div>
        ${gearRowHTML(m)}
        <input type="file" id="mm-edit-img-${m.id}" accept="image/*" style="display:none" onchange="replaceMethodImg('${m.id}',event)">
      </div>
      <div class="toggle ${m.on?'on':''}" onclick="toggleMethod('${m.id}')"><div class="knob"></div></div>
    </div>`;}).join('');
}
/* ---------------- methodes en gear aan elkaar ----------------
   Twee losse lijsten die niets van elkaar wisten. Hang je gear aan een methode
   en de coach vult zich vanzelf, en de AI krijgt alleen wat er bij die methode
   hoort in plaats van je hele kast.                                        */
function methodGear(mid){
  const m=methodById(mid);
  const ids=(m&&Array.isArray(m.gear))?m.gear:[];
  return (state.gear||[]).filter(g=>ids.includes(g.id));
}
function gearMethods(gid){
  return (state.methods||[]).filter(m=>Array.isArray(m.gear)&&m.gear.includes(gid));
}
function toggleMethodGear(mid,gid){
  const m=state.methods.find(x=>x.id===mid);if(!m)return;
  if(!Array.isArray(m.gear))m.gear=[];
  const i=m.gear.indexOf(gid);
  if(i>=0)m.gear.splice(i,1);else m.gear.push(gid);
  save();renderMethods();renderGear();
}
// welke gear stel je voor bij deze methode? gekoppeld eerst, anders op categorie
function gearVoor(mid){
  const gekoppeld=methodGear(mid);
  if(gekoppeld.length)return gekoppeld;
  const fam=methodFamily(mid);
  return (state.gear||[]).filter(g=>g.category===fam||g.category==='algemeen');
}
function toggleMethod(id){const m=state.methods.find(x=>x.id===id);m.on=!m.on;save();renderMethods();toast(m.on?'✓ '+m.name+' on':'○ '+m.name+' off');}
// de gear-knopjes onder een methode: aan = gekoppeld
function gearRowHTML(m){
  const alles=state.gear||[];
  if(!alles.length)return '<div class="mm-gear-leeg">no gear yet \u2014 add it under profile</div>';
  const gekoppeld=(Array.isArray(m.gear)?m.gear:[]);
  return '<div class="mm-gear">'+alles.map(g=>
    '<button type="button" class="mg '+(gekoppeld.includes(g.id)?'sel':'')+
    '" onclick="toggleMethodGear(\''+m.id+'\',\''+g.id+'\')">'+esc(g.name)+'</button>').join('')+'</div>';
}
function toggleMethodFamily(id){
  const m=state.methods.find(x=>x.id===id);if(!m)return;
  m.family=(methodFamily(m)==='espresso')?'filter':'espresso';
  save();renderMethods();toast(m.name+' → '+m.family);
}

let imgPickerMethod=null;
function openImgPicker(id){
  imgPickerMethod=id;
  const m=state.methods.find(x=>x.id===id);if(!m)return;
  const lib=libraryFor(m);
  const cur=methodImg(m);
  const grid=document.getElementById('img-picker-grid');
  grid.innerHTML=lib.map(o=>
    `<div class="img-opt ${cur===o.src?'sel':''}" onclick="chooseLibImg('${o.src}')">
      <img src="${o.src}"><span class="lbl">${esc(o.label)}</span></div>`
  ).join('')||'<div style="grid-column:1/3;color:var(--ink-soft);font-size:16px">no built-in drawings — upload your own.</div>';
  document.getElementById('img-picker').classList.remove('hidden');
}
function closeImgPicker(){document.getElementById('img-picker').classList.add('hidden');imgPickerMethod=null;}
function chooseLibImg(src){
  const m=state.methods.find(x=>x.id===imgPickerMethod);if(!m)return;
  m.img=src;delete m.customImg;  // ingebouwde tekening, eigen upload weg
  save();renderMethods();closeImgPicker();toast('✓ drawing chosen');
}
async function pickerUpload(ev){
  const f=ev.target.files&&ev.target.files[0];if(!f||!imgPickerMethod)return;
  try{const d=await fileToDataURL(f,500);
    const m=state.methods.find(x=>x.id===imgPickerMethod);m.customImg=d;
    save();renderMethods();closeImgPicker();toast('✓ your drawing set');
  }catch(e){toast('couldn\'t load image');}
  ev.target.value='';
}
function showMethodBrews(id){ filterMethod=id; go('brews'); }
function fileToDataURL(file,maxW,removeBg){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const scale=Math.min(1,(maxW||500)/img.width);
        const c=document.createElement('canvas');
        c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
        const ctx=c.getContext('2d');
        ctx.drawImage(img,0,0,c.width,c.height);
        if(removeBg!==false){
          try{
            const d=ctx.getImageData(0,0,c.width,c.height);
            const p=d.data;
            for(let i=0;i<p.length;i+=4){
              const a=p[i+3];
              const lum=(p[i]+p[i+1]+p[i+2])/3;
              if(a<10){continue;}
              if(lum>150){ p[i+3]=0; }            // lichte achtergrond weg
              else { p[i]=58;p[i+1]=48;p[i+2]=42; // inkt -> huisstijl bruin
                     p[i+3]=lum<110?255:Math.round((175-lum)/175*255); }
            }
            ctx.putImageData(d,0,0);
            // bijsnijden op zichtbare inhoud
            const cropped=cropTransparent(c);
            res(cropped.toDataURL('image/png'));
            return;
          }catch(e){/* val terug op ruwe afbeelding */}
        }
        // foto's zonder transparantie als JPEG bewaren: ~10x kleiner dan PNG
        res(c.toDataURL('image/jpeg',0.72));
      };
      img.onerror=rej;img.src=r.result;
    };
    r.onerror=rej;r.readAsDataURL(file);
  });
}
function cropTransparent(canvas){
  const ctx=canvas.getContext('2d');
  const {width:w,height:h}=canvas;
  const d=ctx.getImageData(0,0,w,h).data;
  let minX=w,minY=h,maxX=0,maxY=0,found=false;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(d[(y*w+x)*4+3]>10){found=true;
      if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
  }
  if(!found)return canvas;
  const m=8;
  minX=Math.max(0,minX-m);minY=Math.max(0,minY-m);maxX=Math.min(w-1,maxX+m);maxY=Math.min(h-1,maxY+m);
  const cw=maxX-minX+1,ch=maxY-minY+1;
  const out=document.createElement('canvas');out.width=cw;out.height=ch;
  out.getContext('2d').drawImage(canvas,minX,minY,cw,ch,0,0,cw,ch);
  return out;
}
async function pickMethodImg(ev){
  const f=ev.target.files&&ev.target.files[0];if(!f)return;
  try{mmNewImg=await fileToDataURL(f,500);
    document.getElementById('mm-img-preview').innerHTML='<img src="'+mmNewImg+'" style="max-height:80px;mix-blend-mode:multiply">';
    document.getElementById('mm-img-label').textContent='drawing chosen ✓';
  }catch(e){toast('couldn\'t load image');}
  ev.target.value='';
}
async function replaceMethodImg(id,ev){
  const f=ev.target.files&&ev.target.files[0];if(!f)return;
  try{const d=await fileToDataURL(f,500);
    const m=state.methods.find(x=>x.id===id);m.customImg=d;save();renderMethods();toast('✓ drawing updated');
  }catch(e){toast('couldn\'t load image');}
  ev.target.value='';
}
let mmFamily='filter';
function pickFamily(f){
  mmFamily=(f==='espresso')?'espresso':'filter';
  const e=document.getElementById('mm-fam-espresso'),fi=document.getElementById('mm-fam-filter');
  if(e)e.classList.toggle('sel',mmFamily==='espresso');
  if(fi)fi.classList.toggle('sel',mmFamily==='filter');
}
function addMethod(){
  const name=document.getElementById('mm-new').value.trim();
  if(!name){toast('enter a name');return;}
  const id=name.toLowerCase().replace(/[^a-z0-9]/g,'')+'_'+uid().slice(0,3);
  const tint=TINTS[state.methods.length%TINTS.length];
  const m={id,name:name.toLowerCase(),glyph:'☕',tint,on:true,family:mmFamily};
  if(mmNewImg)m.customImg=mmNewImg;
  state.methods.push(m);
  document.getElementById('mm-new').value='';mmNewImg=null;mmFamily='filter';pickFamily('filter');
  document.getElementById('mm-img-preview').innerHTML='';
  document.getElementById('mm-img-label').textContent='add a drawing (optional)';
  save();renderMethods();toast('✓ method added');
}

/* ---------------- beans ---------------- */
let expandedBeans=new Set();
let extraKastOpen=false;
function toggleBeanCard(id){ if(expandedBeans.has(id))expandedBeans.delete(id); else expandedBeans.add(id); renderBeans(); }
function toggleExtraKast(){ extraKastOpen=!extraKastOpen; renderBeans(); }
// subtiele versheid op basis van roastdate (YYYY-MM-DD)
function beanFreshness(b,atTs){
  if(!b||!b.roastdate)return null;
  const d=new Date(b.roastdate+'T00:00:00');if(isNaN(d.getTime()))return null;
  const days=Math.floor(((atTs||Date.now())-d.getTime())/86400000);
  if(days<0)return null;
  let label;
  if(days===0)label='roasted today — let it rest';
  else if(days<=3)label=days+' days — still resting';
  else if(days<=21)label=days+' days fresh';
  else if(days<=35)label=days+' days — past peak';
  else label=days+' days — over the hill';
  return {days,label};
}
/* Wat versheid met je maling doet.
   Vers gebrande bonen zitten vol CO2. Dat gas komt in de puck vrij en houdt het
   water tegen: de shot loopt traag en schuimt. Na een week of drie is dat gas weg
   en zijn de bonen brozer, dus de puck geeft nauwelijks weerstand meer en loopt de
   shot juist door. Vandaar: jong = grover, oud = fijner. */
function freshGrindHint(days){
  if(days==null)return null;
  if(days<=2)  return {dir:'coarser', s:'too fresh',
    t:'still full of CO₂. The gas holds the water back, so expect a slow, foamy shot. Go a notch coarser — or give the bag a few more days.'};
  if(days<=6)  return {dir:'coarser', s:'still degassing',
    t:'still letting go of gas. If it runs slower than yesterday, go half a step coarser; tomorrow it will be a little quicker again.'};
  if(days<=21) return {dir:'stable', s:'in the window',
    t:'the settled stretch. Yesterday\'s grind should still hold today.'};
  if(days<=32) return {dir:'finer', s:'past peak',
    t:'most of the CO₂ has gone, so the puck offers less resistance and the shot runs faster. A notch finer.'};
  return {dir:'finer', s:'old',
    t:'little gas left, brittle beans, plenty of fines. Grinding finer catches some of it, but there is not much left to save.'};
}
/* Wat versheid met je bloom doet.
   Bij espresso corrigeer je vers gas met de maling, want daar meet je de
   doorloopsnelheid. Bij filter zit de knop eerder bij de bloom: daar laat je
   het gas juist bewust ontsnappen voordat de extractie begint. */
function freshBloomHint(days){
  if(days==null)return null;
  if(days<=4) return {mult:3, sec:45, s:'very fresh',
    t:'full of CO\u2082 — the bed will dome and crackle. Give it a bigger bloom and wait longer, or the gas keeps pushing your water away.'};
  if(days<=21)return {mult:2.5, sec:40, s:'in the window',
    t:'the settled stretch. A normal bloom is all it needs.'};
  if(days<=32)return {mult:2, sec:30, s:'past peak',
    t:'less gas left, so the bloom falls flat sooner. Shorten it and grind a touch finer to keep the sweetness.'};
  return {mult:2, sec:30, s:'old',
    t:'barely any gas. A long bloom only cools the bed now — keep it short and grind finer.'};
}
// start een brew met deze boon (respecteert espresso -> dial-in, filter -> formulier)
// eerst een boon, dan pas de methode: elke rij hergebruikt brewBean() om
// zelf uit te zoeken welk scherm daarbij hoort (dial-in of het formulier)
function renderChooseBean(){
  const el=document.getElementById('choosebean-list');if(!el)return;
  const inBeans=state.beans.filter(b=>b.inStock!==false);
  if(!inBeans.length){
    el.innerHTML='<div class="empty-note">no beans in stock.<br>add one under beans, or start without one below.</div>';
    return;
  }
  el.innerHTML=inBeans.map(b=>{
    const mList=(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[])).map(id=>methodById(id)).filter(Boolean);
    const m=mList[0]||null;
    const tint=m?('var('+m.tint+')'):'var(--card)';
    const fresh=beanFreshness(b);
    const bits=[];
    if(m)bits.push('<span class="bean-mic">'+iconHTML(m,18)+'</span> '+esc(m.name));
    if(beanFamLabel(b))bits.push('<span class="bean-fam">'+esc(beanFamLabel(b))+'</span>');
    if(fresh)bits.push('<span class="fresh">'+fresh.label+'</span>');
    return '<div class="bean-card sketch soft collapsed" style="background:'+tint+'" onclick="brewBean(\''+b.id+'\')">'+
      '<div class="brow"><div class="bn hand">'+esc(b.name)+'</div><span class="bchev">›</span></div>'+
      '<div class="bean-meta">'+bits.join(' <span class="dot">·</span> ')+'</div></div>';
  }).join('');
}
function brewBean(beanId){
  const b=beanById(beanId);if(!b)return;
  const mList=(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[]));
  const voorkeur=beanFam(b);
  // heb je zelf methodes gekozen? die gaan voor. Anders beslist de branding.
  let mid=mList.find(id=>state.methods.find(m=>m.id===id&&m.on))||mList[0]||null;
  if(!mid&&voorkeur){
    mid=(state.methods.filter(m=>m.on&&methodFamily(m)===voorkeur)[0]||{}).id||null;
  }
  if(!mid)mid=(state.methods.filter(m=>m.on)[0]||{}).id||null;
  if(methodFamily(mid)==='espresso'){pendingTarget=null;formPrep={};pendingRecipe=null;openDialIn(mid);setTimeout(()=>pickDiBean(beanId),0);}
  else{openForm(mid);setTimeout(()=>pickBean(beanId),0);}
}
/* De dial-in journey van deze boon, per espressomethode. Dezelfde tekening als
   in het dial-in-scherm; de doelzone leggen we om de tijd die je aftekende, of
   anders om het doel van je laatste poging.                                  */
function beanJourneyHTML(b){
  if(!featOn('journey'))return '';
  const log=state.dialLog||{};
  const delen=Object.keys(log).filter(k=>{
    const [bid,mid]=k.split('|');
    return bid===b.id && methodFamily(mid)==='espresso' && (log[k]||[]).length;
  }).map(k=>{
    const mid=k.split('|')[1], m=methodById(mid);
    const rij=log[k].slice(-6);
    const vast=(b.dialed||{})[mid];
    const laatste=state.brews.filter(x=>x.beanId===b.id&&x.method===mid&&x.target)
      .sort((a,c)=>c.ts-a.ts)[0];
    const doel=parseTimeSec(vast&&vast.time)||parseTimeSec(laatste&&laatste.target.time)||28;
    const kop=((m&&m.name)||mid)+' \u00b7 '+rij.length+' attempt'+(rij.length===1?'':'s');
    return '<div class="bean-journey"><div class="bj-h">'+esc(kop)+'</div>'+
      '<svg class="journey" viewBox="0 0 360 185">'+journeySVG(rij,doel,k)+'</svg>'+
      journeyInfoHTML(k,log[k])+'</div>';
  });
  return delen.join('');
}
// wat je op deze boon hebt afgetekend, per methode
function dialLineHTML(b){
  const vast=beanDial(b,null);
  if(!vast)return '';
  return '<br>your dial: '+vast.map(d=>{
    const m=methodById(d.method);
    const c=dialCijfers(d);
    return '<b>'+esc((m&&m.name)||d.method)+'</b> '+esc(d.grind)+(c?(' \u00b7 '+esc(c)):'')+
      (d.drink?(' \u00b7 '+esc(d.drink)):'');
  }).join('<br>\u2003');
}
function beanCardHTML(b){
  const expanded=expandedBeans.has(b.id);
  const mList=(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[])).map(id=>methodById(id)).filter(Boolean);
  const m=mList[0]||null;
  const cnt=state.brews.filter(x=>x.beanId===b.id).length;
  const tint=m?('var('+m.tint+')'):'var(--card)';
  const inStock=b.inStock!==false; // standaard: in huis
  const fresh=beanFreshness(b);
  if(!expanded){
    const bits=[];
    if(m)bits.push('<span class="bean-mic">'+iconHTML(m,18)+'</span> '+esc(m.name));
    bits.push(inStock?'✓ in stock':'○ empty');
    if(beanFamLabel(b))bits.push('<span class="bean-fam">'+esc(beanFamLabel(b))+'</span>');
    if(fresh)bits.push('<span class="fresh">'+fresh.label+'</span>');
    const vast=beanDial(b,null);
    if(vast)bits.push('dial '+esc(vast[0].grind));
    return `<div class="bean-card sketch soft collapsed" data-bean="${b.id}" style="background:${tint};${inStock?'':'opacity:.7'}" onclick="toggleBeanCard('${b.id}')">
      <div class="brow"><div class="bn hand">${esc(b.name)}</div><span class="bchev">▸</span></div>
      <div class="bean-meta">${bits.join(' <span class="dot">·</span> ')}</div>
    </div>`;
  }
  const methodLine=mList.length?('<br>method'+(mList.length>1?'s':'')+': '+mList.map(x=>'<span class="bean-method"><span class="bean-method-ic">'+iconHTML(x,18)+'</span>'+esc(x.name)+'</span>').join(' ')):'';
  return `<div class="bean-card sketch soft" data-bean="${b.id}" style="background:${tint};${inStock?'':'opacity:.7'}">
    <div class="brow">
      <div class="bean-head" onclick="toggleBeanCard('${b.id}')"><div class="bn hand">${esc(b.name)}</div><span class="bchev">▾</span></div>
      <div class="brow-btns">
        <button class="icon-btn" title="send this bean" onclick="shareOneBean('${b.id}')">${ICO.send}</button>
        <button class="icon-btn" title="edit" onclick="editBean('${b.id}')">${ICO.edit}</button>
        <button class="icon-btn" title="delete" onclick="delBean('${b.id}')">${ICO.del}</button>
      </div></div>
    ${b.photo?'<img src="'+esc(BrewSecurity.imageUrl(b.photo))+'" style="width:100%;max-height:160px;object-fit:cover;border-radius:14px;border:2px solid var(--line);margin:6px 0">':''}
    <div class="bm">${[b.roaster,b.origin,b.process,b.variety].filter(Boolean).map(esc).join(' · ')||'—'}
      ${b.altitude?'<br>altitude: '+esc(b.altitude)+' m':''}
      ${b.roastdate?'<br>roast: '+esc(b.roastdate)+(fresh?' · '+esc(fresh.label):''):''}
      ${b.roasternotes?'<br>roaster: '+esc(b.roasternotes):''}
      ${methodLine}
      ${dialLineHTML(b)}
      ${b.notes?'<br>'+esc(b.notes):''}
      ${BrewSecurity.safeLink(b.url)?'<br>🔗 <a class="bean-link" href="'+esc(BrewSecurity.safeLink(b.url))+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">view online</a>':''}
      ${(featOn('cost')&&b.price&&b.bagsize)?'<br>≈ €'+((b.price/b.bagsize)*18).toFixed(2)+' per cup (18 g) · €'+(+b.price).toFixed(2)+' / '+b.bagsize+' g':''}
      <br>${cnt} brew${cnt===1?'':'s'} linked</div>
    ${freshGaugeHTML(b)}
    ${beanJourneyHTML(b)}
    ${tasteWheelStatic([].concat(...state.brews.filter(x=>x.beanId===b.id).map(x=>x.tags||[])),
      'what you tasted in this bean')}
    <button class="stock-btn ${inStock?'in':'out'}" onclick="toggleStock('${b.id}')">
      ${inStock?'✓ in stock':'○ empty — no longer in stock'}</button>
    ${bpHerkomstBlok(b)}
    <div style="margin-top:10px"><button class="lp sel" onclick="brewBean('${b.id}')">brew this bean →</button></div>
    <button class="recipe-btn ai-only ${aiReady()?'':'hidden'}" onclick="aiRecipe('${b.id}')"><svg viewBox="0 0 24 24" class="acic btn-svg"><path d="M11.6 4.2 Q12.7 8.2 13.4 9.9 Q15.2 10.7 19.8 11.3 Q15 12.6 13.1 13.4 Q12.4 15.4 11.8 20.8 Q11.2 15 10.6 13.1 Q8.6 12.4 4.2 11.6 Q9.1 10.3 10.9 9.6 Q11.6 7.6 12.3 3.4"/><path d="M18.4 4.4 Q18.9 5.5 19.1 6.1 Q19.9 6.4 21.2 6.5 Q19.6 7.1 18.9 7.4 Q18.6 8.2 18.4 9.4 Q18.1 8 17.9 7.2 Q17 6.9 15.8 6.5 Q17.4 6.1 18.1 5.9 Q18.4 5 18.7 3.8" opacity="0.7"/></svg> ask AI for a brew recipe</button>
    <div id="recipe-${b.id}"></div>
  </div>`;
}
function renderBeans(){
  const el=document.getElementById('beans-list');
  const inBeans=state.beans.filter(b=>b.inStock!==false);
  const outBeans=state.beans.filter(b=>b.inStock===false);
  const sub=document.getElementById('beans-sub');
  if(sub)sub.textContent=state.beans.length?('your bean shelf · in stock ('+inBeans.length+')'):'your bean shelf — linked to your brews.';
  if(!state.beans.length){el.innerHTML='<div class="empty-note">no beans yet.<br>tap New Bean to add your first bean.</div>';return;}
  let html=bpPlankKaartHTML()+bpWensHTML();
  html+=inBeans.length?inBeans.map(beanCardHTML).join(''):'<div class="empty-note">no beans in stock.<br>tap New Bean or check your empty bags.</div>';
  // cupping hoort bij je bonen, niet alleen achterin learn
  if(featOn('cupping')&&inBeans.length>=2){
    html+=`<button class="shelf-do" onclick="go('cupping')"><svg viewBox="0 0 24 24" class="acic"><path d="M3.8 8.6 Q3.6 15.2 7 16.9 Q9.6 18.4 12.1 16.7 Q14.6 18.4 17.2 16.8 Q20.5 15 20.2 8.4 M3.6 9.2 Q8 7.7 12.2 9.1 Q16.2 7.7 20.5 9.2"/><path d="M6.8 12.3 Q9.5 13.6 12.2 12.4 Q14.7 13.6 17.3 12.3" opacity="0.5"/></svg><span>proef er twee blind — cuppingsessie</span><span class="ll-arr">›</span></button>`;
  }
  if(outBeans.length){
    html+=`<button class="extra-kast" onclick="toggleExtraKast()"><svg viewBox="0 0 24 24" class="acic"><path d="M6.4 8.7 Q6.1 6.8 7.8 6.6 Q12 6.2 16.2 6.6 Q17.9 6.8 17.6 8.6 M17.5 8.2 Q17.1 13.7 16.6 19.3 M16.8 19 Q12 19.7 7.2 19.1 M7.4 19.4 Q6.9 13.7 6.5 8.1"/><path d="M7.8 6.8 Q7.1 5.3 7.5 4.2 Q12 3.9 16.5 4.3 Q16.9 5.4 16.2 6.9" opacity="0.85"/><path d="M8.5 11.9 Q12 11.5 15.6 12.1" opacity="0.4"/></svg> empty bags · ${outBeans.length} bean${outBeans.length===1?'':'s'} finished ${extraKastOpen?'▾':'▸'}</button>`;
    if(extraKastOpen){
      html+='<div class="kast-head">no longer in stock — tap ✓ in stock to put it back</div>';
      html+=outBeans.map(beanCardHTML).join('');
    }
  }
  el.innerHTML=html;
}
function toggleStock(id){
  const b=state.beans.find(x=>x.id===id);if(!b)return;
  const nowIn=(b.inStock!==false);      // huidige status (undefined = in huis)
  b.inStock=!nowIn;                       // omdraaien
  save();renderBeans();
  toast(b.inStock?'✓ back in stock':'○ marked as empty');
}
let editingBean=null;
/* Eén formulier voor allebei: een zak die op je plank staat, en een zak die je
   nog wilt hebben. De keuze bovenin bepaalt waar hij heen gaat -- en welke
   velden er iets toe doen. Van gedachten veranderen mag: sla je een wens op
   als "op mijn plank", dan verhuist hij gewoon mee.                        */
let beanFormWens=false, editingWens=null;
const BEAN_MODES=[{w:false,n:'Bean shelf',u:'een zak die je in huis hebt — hij komt bij je bonen te staan en je kunt erop brouwen.'},
                  {w:true, n:'Bean wishlist',u:'een zak die je nog wilt kopen — hij komt op je lijstje en op de wereldkaart.'}];
function renderBeanMode(){
  const el=document.getElementById('b-mode'); if(!el)return;
  // staat de keuzehulp uit, dan is er geen lijstje om iets op te zetten
  if(!featOn('beanpick'))beanFormWens=false;
  const veld=el.closest('.field'); if(veld)veld.style.display=featOn('beanpick')?'':'none';
  el.innerHTML=BEAN_MODES.map(m=>'<button type="button" class="bp-chip'+(m.w===beanFormWens?' sel':'')+
    '" onclick="beanZetMode('+m.w+')">'+m.n+'</button>').join('');
  const u=document.getElementById('b-mode-uitleg');
  if(u)u.textContent=(BEAN_MODES.find(m=>m.w===beanFormWens)||BEAN_MODES[0]).u;
  const t=document.getElementById('beanform-title');
  if(t)t.textContent=(editingBean||editingWens)?'Edit Bean':'New Bean';
  const sv=document.getElementById('b-save');
  if(sv)sv.textContent=beanFormWens?'Save on wishlist':'Save on shelf';
  // wat je pas weet als de zak er echt is, vraagt de app pas als hij er is
  [['b-foto-rij',!beanFormWens],['label-preview',!beanFormWens],['b-roastdate-veld',!beanFormWens],
   ['b-cost-row',!beanFormWens&&featOn('cost')],['b-fam-veld',!beanFormWens],
   ['b-methods-veld',!beanFormWens]].forEach(([id,aan])=>{
    const e=document.getElementById(id); if(e)e.style.display=aan?'':'none';
  });
}
function beanZetMode(w){beanFormWens=!!w;renderBeanMode();}
function beanFormWeg(){editingBean=null;editingWens=null;go('beans');}
function openBeanForm(wens){
  editingBean=null; editingWens=null; beanFormWens=!!wens;
  ['b-name','b-roaster','b-origin','b-process','b-variety','b-altitude','b-roastdate','b-roasternotes','b-url','b-notes','b-price','b-bagsize'].forEach(i=>{const el=document.getElementById(i);if(el)el.value='';});
  document.getElementById('scan-status').textContent='';
  const er=document.getElementById('enrich-row');if(er)er.style.display='none';
  beanPhoto=null;const lp=document.getElementById('label-preview');if(lp)lp.innerHTML='';
  beanFormMethods=[];beanFormFam=null;beanFormRoast=null;beanFormRegions=[];
  renderBeanFormMethods();renderBeanFam();renderBeanRoast();renderBeanHerkomst();
  renderBeanMode();go('beanform');applyAIVisibility();
}
function editBean(id){
  const b=state.beans.find(x=>x.id===id);if(!b)return;
  editingBean=id; editingWens=null; beanFormWens=false;
  const set=(f,v)=>{const el=document.getElementById(f);if(el)el.value=v||'';};
  set('b-name',b.name);set('b-roaster',b.roaster);set('b-origin',b.origin);
  set('b-process',b.process);set('b-variety',b.variety);set('b-altitude',b.altitude);
  beanFormRegions=bpRegios(b).filter(r=>r.zelf).map(r=>({land:r.land,i:r.i}));
  renderBeanHerkomst();
  set('b-roastdate',b.roastdate);set('b-roasternotes',b.roasternotes);
  set('b-url',b.url);set('b-notes',b.notes);set('b-price',b.price);set('b-bagsize',b.bagsize);
  document.getElementById('scan-status').textContent='';
  const er=document.getElementById('enrich-row');if(er)er.style.display='none';
  beanPhoto=null; // alleen nieuwe foto vervangt de bestaande
  const lp=document.getElementById('label-preview');
  if(lp)lp.innerHTML=b.photo?'<img src="'+esc(BrewSecurity.imageUrl(b.photo))+'" style="max-height:140px;border-radius:14px;border:2px solid var(--line)">':'';
  beanFormMethods=(Array.isArray(b.methods)&&b.methods.length?[...b.methods]:(b.method?[b.method]:[]));
  beanFormFam=b.fam||null;renderBeanFam();
  beanFormRoast=b.roast||null;renderBeanRoast();
  renderBeanFormMethods();renderBeanMode();go('beanform');applyAIVisibility();
}
let beanFormMethods=[];
/* Sommige branders branden een zak bewust voor espresso of juist voor filter,
   en zetten dat op de zak. Dat is geen smaakje maar een branding: espresso mag
   iets donkerder en oplosbaarder, filter blijft lichter en dichter. */
let beanFormFam=null;
const BEAN_FAMS=[['espresso','espresso'],['filter','filter'],['both','omni \u2014 both']];
const ROAST_LEVELS=['light','medium-light','medium','medium-dark','dark'];
let beanFormRoast=null;
function renderBeanRoast(){
  const el=document.getElementById('b-roast');if(!el)return;
  el.innerHTML=ROAST_LEVELS.map(v=>
    '<button class="lp '+(beanFormRoast===v?'sel':'')+'" onclick="pickBeanRoast(\''+v+'\')">'+esc(v)+'</button>').join('');
}
function pickBeanRoast(v){beanFormRoast=(beanFormRoast===v)?null:v;renderBeanRoast();}
function renderBeanFam(){
  const el=document.getElementById('b-fam');if(!el)return;
  el.innerHTML=BEAN_FAMS.map(([v,label])=>
    '<button class="lp '+(beanFormFam===v?'sel':'')+'" onclick="pickBeanFam(\''+v+'\')">'+esc(label)+'</button>').join('');
}
function pickBeanFam(v){beanFormFam=(beanFormFam===v)?null:v;renderBeanFam();}
// welke familie past bij deze boon? (both en leeg leggen niets vast)
function beanFam(b){
  const f=b&&b.fam;
  return (f==='espresso'||f==='filter')?f:null;
}
function beanFamLabel(b){
  const f=b&&b.fam;
  if(f==='espresso')return 'espresso roast';
  if(f==='filter')return 'filter roast';
  if(f==='both')return 'omni roast';
  return '';
}
function renderBeanFormMethods(){
  document.getElementById('beanform-methods').innerHTML=
    state.methods.filter(m=>m.on).map(m=>'<button class="lp '+(beanFormMethods.includes(m.id)?'sel':'')+'" onclick="toggleBeanMethod(\''+m.id+'\')"><span class="mp-ic">'+iconHTML(m,26)+'</span> '+esc(m.name)+'</button>').join('')
    || '<span class="subtitle">no methods on — turn them on under methods.</span>';
}
function toggleBeanMethod(id){
  if(beanFormMethods.includes(id))beanFormMethods=beanFormMethods.filter(x=>x!==id);
  else beanFormMethods.push(id);
  renderBeanFormMethods();
}
function saveBean(){
  const name=document.getElementById('b-name').value.trim();
  if(!name){toast(beanFormWens?'geef hem een naam':'give the bean a name');return;}
  if(beanFormWens)return saveBeanAlsWens(name);
  const data={name,
    roaster:document.getElementById('b-roaster').value.trim(),
    origin:document.getElementById('b-origin').value.trim(),
    process:document.getElementById('b-process').value.trim(),
    variety:document.getElementById('b-variety').value.trim(),
    altitude:document.getElementById('b-altitude').value.trim(),
    regions:beanFormRegions.slice(),
    region:beanFormRegions[0]||null,
    roastdate:document.getElementById('b-roastdate').value,
    roasternotes:document.getElementById('b-roasternotes').value.trim(),
    url:document.getElementById('b-url').value.trim(),
    price:parseFloat(document.getElementById('b-price').value)||null,
    bagsize:parseFloat(document.getElementById('b-bagsize').value)||null,
    methods:[...beanFormMethods],
    method:beanFormMethods[0]||null,
    fam:beanFormFam||null,
    roast:beanFormRoast||null,
    notes:document.getElementById('b-notes').value.trim()};
  if(editingBean){
    const ex=state.beans.find(b=>b.id===editingBean);
    if(ex){Object.assign(ex,data);if(beanPhoto)ex.photo=beanPhoto;}
    toast('✓ bean updated');
  }else{
    data.id=uid();data.photo=beanPhoto||null;data.inStock=true;
    state.beans.push(data);
    // stond hij nog op je lijstje, dan is hij daar nu vanaf
    if(editingWens){state.wishlist=(state.wishlist||[]).filter(w=>w.id!==editingWens);
      toast('✓ van je lijstje naar je plank');}
    else toast('✓ bean saved');
  }
  editingWens=null;save();beanPhoto=null;go('beans');
}
/* Dezelfde velden, maar dan als wens. Wat een zak pas heeft als hij er is --
   branddatum, prijs, waar je hem op zet -- slaan we niet op.               */
function saveBeanAlsWens(naam){
  const g=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  if(!Array.isArray(state.wishlist))state.wishlist=[];
  const noten=g('b-roasternotes');
  const w={id:editingWens||uid(),naam,name:naam,brander:g('b-roaster'),
    origin:g('b-origin'),url:g('b-url'),
    regions:beanFormRegions.slice(),proces:g('b-process'),variety:g('b-variety'),
    altitude:g('b-altitude'),brand:beanFormRoast||'light',
    roasternotes:noten,smaak:noten?noten.split(',').map(x=>x.trim()).filter(Boolean):[],
    notitie:g('b-notes'),at:Date.now()};
  const i=state.wishlist.findIndex(x=>x.id===w.id);
  if(i>=0)state.wishlist[i]=Object.assign({},state.wishlist[i],w);
  else state.wishlist.push(w);
  // van je plank terug naar je lijstje: dan hoort hij niet meer bij je bonen
  if(editingBean){
    state.beans=state.beans.filter(b=>b.id!==editingBean);
    state.brews.forEach(b=>{if(b.beanId===editingBean)b.beanId=null;});
    toast('✓ terug op je lijstje');
  }else toast('✓ op je lijstje');
  editingBean=null;editingWens=null;save();beanPhoto=null;go('beans');
}
function delBean(id){
  if(!confirm('delete this bean?'))return;
  state.beans=state.beans.filter(b=>b.id!==id);
  state.brews.forEach(b=>{if(b.beanId===id){b.beanId=null;}});
  save();renderBeans();toast('🗑 bean deleted');
}

/* ---------------- welke AI antwoordt --------------------------------------
   De app praat vanuit de browser rechtstreeks met de aanbieder die JIJ kiest.
   Elke aanbieder wil zijn eigen vorm: Anthropic wil `messages` met `max_tokens`
   en geeft `content[]` terug, OpenAI wil chat/completions met een Bearer-token
   en geeft `choices[0].message.content` terug. Binnenin houdt de app één vorm
   aan -- die van Anthropic -- en vertaalt per aanbieder. Wil je er een derde
   bij, dan is dat één regel in deze lijst.                                    */
function naarOpenAI(messages){
  return messages.map(m=>{
    if(typeof m.content==='string')return {role:m.role,content:m.content};
    const delen=(m.content||[]).map(c=>{
      if(!c)return null;
      if(c.type==='text')return {type:'text',text:c.text};
      if(c.type==='image'&&c.source&&c.source.type==='base64')
        return {type:'image_url',image_url:{url:'data:'+c.source.media_type+';base64,'+c.source.data}};
      return null;
    }).filter(Boolean);
    return {role:m.role,content:delen};
  });
}
const AI_AANBIEDERS=[
  {id:'anthropic',naam:'Anthropic',merk:'Claude',hint:'sk-ant-...',
   model:'claude-sonnet-4-6',prijs:{in:3,uit:15},waar:'console.anthropic.com',
   url:()=>'https://api.anthropic.com/v1/messages',
   kop:k=>({'Content-Type':'application/json','anthropic-dangerous-direct-browser-access':'true',
            'x-api-key':k,'anthropic-version':'2023-06-01'}),
   lijf:(m,mx,model,stream)=>{
     const b={model:model,max_tokens:mx,messages:m};
     if(stream)b.stream=true;
     return b;},
   lees:d=>Array.isArray(d.content)
     ?d.content.filter(i=>i&&i.type==='text').map(i=>i.text).join('\n')
     :(typeof d.content==='string'?d.content:''),
   verbruik:d=>d.usage,
   // bij een stream komt het verbruik in twee stukken: de invoer meteen, de uitvoer aan het eind
   stroom:(ev,v)=>{
     if(ev.type==='message_start'&&ev.message&&ev.message.usage)Object.assign(v,ev.message.usage);
     if(ev.type==='message_delta'&&ev.usage&&ev.usage.output_tokens!=null)v.output_tokens=ev.usage.output_tokens;
     return (ev.type==='content_block_delta'&&ev.delta&&ev.delta.text)?ev.delta.text:'';}},

  {id:'openai',naam:'OpenAI',merk:'GPT',hint:'sk-...',
   model:'gpt-4o-mini',prijs:{in:0.15,uit:0.6},waar:'platform.openai.com',
   url:()=>'https://api.openai.com/v1/chat/completions',
   kop:k=>({'Content-Type':'application/json','Authorization':'Bearer '+k}),
   lijf:(m,mx,model,stream,oud)=>{
     const b={model:model,messages:naarOpenAI(m)};
     b[oud?'max_tokens':'max_completion_tokens']=mx;
     if(stream){b.stream=true;b.stream_options={include_usage:true};}
     return b;},
   lees:d=>(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||'',
   verbruik:d=>d.usage&&{input_tokens:d.usage.prompt_tokens,output_tokens:d.usage.completion_tokens},
   stroom:(ev,v)=>{
     if(ev.usage)Object.assign(v,{input_tokens:ev.usage.prompt_tokens,output_tokens:ev.usage.completion_tokens});
     const c=ev.choices&&ev.choices[0];
     return (c&&c.delta&&c.delta.content)||'';}},
];
function aiProv(){return localStorage.getItem('scc_ai_prov')||'anthropic';}
function aiAanbieder(id){return AI_AANBIEDERS.find(x=>x.id===(id||aiProv()))||AI_AANBIEDERS[0];}
// de sleutel van Anthropic stond er al onder de oude naam -- die laten we staan
function aiSleutelNaam(id){id=id||aiProv();return id==='anthropic'?'scc_ai_key':'scc_ai_key_'+id;}
function aiModel(id){id=id||aiProv();return (localStorage.getItem('scc_ai_model_'+id)||'').trim()||aiAanbieder(id).model;}
// dollar per token; wat jij in de app zet wint van wat de app dacht te weten
function aiTarief(id){
  id=id||aiProv();
  try{const t=JSON.parse(localStorage.getItem('scc_ai_prijs_'+id)||'null');
    if(t&&t.in>=0&&t.uit>=0)return {in:t.in/1e6,uit:t.uit/1e6};}catch(e){}
  const p=aiAanbieder(id).prijs;
  return {in:p.in/1e6,uit:p.uit/1e6};
}

/* ---------------- AI: één aanroep, welke aanbieder er ook staat ---------- */
async function askAI(messages, maxTokens, bron){
  if(!aiEnabled()||!getKey())throw new Error('AI uit of geen sleutel');
  const a=aiAanbieder(),mx=maxTokens||1000;
  if(typeof BrewWorkspace!=='undefined')messages=BrewWorkspace.withContext(messages,undefined,bron);
  let res=await fetch(a.url(),{method:"POST",headers:a.kop(getKey()),signal:AbortSignal.timeout(60000),
    body:JSON.stringify(a.lijf(messages,mx,aiModel(),false,false))});
  if(!res.ok){
    const m=await apiFout(res);
    // sommige modellen willen max_tokens, andere max_completion_tokens -- één keer omdraaien
    if(res.status===400&&/max_(completion_)?tokens/.test(m)){
      res=await fetch(a.url(),{method:"POST",headers:a.kop(getKey()),signal:AbortSignal.timeout(60000),
        body:JSON.stringify(a.lijf(messages,mx,aiModel(),false,true))});
      if(!res.ok)throw new Error(await apiFout(res));
    }else throw new Error(m);
  }
  const data=await res.json();
  try{aiTel(a.verbruik(data),bron);setTimeout(aiMeldNa,900);}catch(e){}
  const out=a.lees(data);
  if(!out)throw new Error('leeg antwoord');
  return out;
}
// streamende variant: roept onDelta(volledigeTekst) aan terwijl het antwoord binnenkomt
async function askAIStream(messages, maxTokens, onDelta, bron){
  if(!aiEnabled()||!getKey())throw new Error('AI uit of geen sleutel');
  const a=aiAanbieder();
  if(typeof BrewWorkspace!=='undefined')messages=BrewWorkspace.withContext(messages,undefined,bron);
  const res=await fetch(a.url(),{method:"POST",headers:a.kop(getKey()),signal:AbortSignal.timeout(60000),
    body:JSON.stringify(a.lijf(messages,maxTokens||600,aiModel(),true,false))});
  if(!res.ok||!res.body)throw new Error(res.body?await apiFout(res):('api '+res.status));
  const reader=res.body.getReader();const dec=new TextDecoder();let buf='',full='';
  const verbruik={input_tokens:0,output_tokens:0};
  while(true){
    const {done,value}=await reader.read();if(done)break;
    buf+=dec.decode(value,{stream:true});
    let nl;
    while((nl=buf.indexOf('\n'))>=0){
      const line=buf.slice(0,nl).trim();buf=buf.slice(nl+1);
      if(!line.startsWith('data:'))continue;
      const payload=line.slice(5).trim();if(!payload||payload==='[DONE]')continue;
      try{const stuk=a.stroom(JSON.parse(payload),verbruik);
        if(stuk){full+=stuk;if(onDelta)onDelta(full);}
      }catch(e){}
    }
  }
  try{aiTel(verbruik,bron);setTimeout(aiMeldNa,900);}catch(e){}
  if(!full)throw new Error('leeg antwoord');
  return full;
}
/* Een aanbieder stuurt bij een fout een gewone zin mee die uitlegt wat er mis
   is -- "Your credit balance is too low", bijvoorbeeld. Die is meer waard dan
   het nummer dat de app tot nu toe liet zien.                                */
async function apiFout(res){
  let m='';
  try{const e=await res.json();
    m=(e&&e.error&&(e.error.message||e.error))||'';
    if(typeof m!=='string')m='';
  }catch(_){}
  return m?(m+' (api '+res.status+')'):('api '+res.status);
}
function extractJSON(txt){
  let t=txt.replace(/```json|```/g,'').trim();
  const a=t.indexOf('{'), b=t.lastIndexOf('}');
  if(a>=0&&b>a)t=t.slice(a,b+1);
  return JSON.parse(t);
}
function setText(id,v){const el=document.getElementById(id);if(el&&v)el.value=v;}
// haal het domein uit een url (bv. https://friedhats.com/... -> friedhats.com)
function domainOf(url){
  if(!url)return '';
  try{
    let u=url.trim();
    if(!/^https?:\/\//i.test(u))u='https://'+u;
    return new URL(u).hostname.replace(/^www\./,'');
  }catch(e){return '';}
}
// maak een gerichte zoeklink: als de brander-website bekend is, zoek binnen die site
// zodat je vrijwel direct op de productpagina van die brander uitkomt
function fillSearchLink(){
  const g=id=>{const el=document.getElementById(id);return el?el.value.trim():'';};
  const naam=g('b-name'),roaster=g('b-roaster'),huidigeUrl=g('b-url');
  if(!naam&&!roaster){toast('enter a name or roaster first');return;}
  // domein uit een al ingevulde (brander-)link halen, mits geen zoeklink
  let domein='';
  if(huidigeUrl && !/google\.[a-z.]+\/search/i.test(huidigeUrl)){
    domein=domainOf(huidigeUrl);
  }
  let q;
  if(domein){
    // gericht binnen de brander-site zoeken -> eerste resultaat is meestal de boon
    q='site:'+domein+' '+naam;
  }else{
    q=(roaster+' '+naam+' coffee').trim();
  }
  document.getElementById('b-url').value='https://www.google.com/search?q='+encodeURIComponent(q);
  toast(domein?'✓ link to '+domein:'✓ search link filled in');
}
let beanPhoto=null;
async function scanLabel(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  const status=document.getElementById('scan-status');
  // 1) altijd: foto verkleinen, tonen en onthouden (ook zonder AI)
  try{
    beanPhoto=await fileToDataURL(file,700,false); // false = achtergrond NIET weghalen
    document.getElementById('label-preview').innerHTML='<img src="'+beanPhoto+'" style="max-height:140px;border-radius:14px;border:2px solid var(--line)">';
  }catch(e){}
  // 2) als AI uit staat of geen sleutel: stop hier, foto is bewaard
  if(!aiEnabled()||!getKey()){
    status.textContent='photo saved. turn on AI in profile to read the label automatically.';
    ev.target.value='';return;
  }
  // 3) AI aan: etiket uitlezen
  status.innerHTML='<span class="spin"></span>reading label…';
  try{
    const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(',')[1]);r.onerror=rej;r.readAsDataURL(file);});
    const media=file.type||'image/jpeg';
    const prompt='Dit is een foto van een etiket van een zak specialty koffie. Lees alle informatie en geef ALLEEN een JSON-object terug, zonder uitleg, zonder markdown. Velden (laat leeg als onbekend): {"name":"","roaster":"","origin":"","process":"","variety":"","altitude":"","roasternotes":"","roast":"","fam":"","url":""}. roasternotes = de smaakomschrijving van de brander, komma-gescheiden. url = de officiele website van de brander: als die letterlijk op de zak staat gebruik die, anders geef de meest waarschijnlijke officiele website-URL van deze brander op basis van wat je weet (bv. https://merknaam.com). Laat url alleen leeg als je echt geen idee hebt welke brander het is.\n'+BEAN_RULES;
    const txt=await askAI([{role:"user",content:[
      {type:"image",source:{type:"base64",media_type:media,data:b64}},
      {type:"text",text:prompt}
    ]}],700,'bean');
    const d=extractJSON(txt);
    setText('b-name',d.name);setText('b-roaster',d.roaster);setText('b-origin',d.origin);
    setText('b-process',d.process);setText('b-variety',d.variety);setText('b-altitude',d.altitude);
    setText('b-roasternotes',d.roasternotes);
    // brandingsvoorkeur alleen overnemen als de zak er iets over zegt
    const fam=(d.fam||'').toLowerCase().trim();
    if(fam==='espresso'||fam==='filter'||fam==='both'){beanFormFam=fam;renderBeanFam();}
    const roast=(d.roast||'').toLowerCase().trim();
    if(ROAST_LEVELS.includes(roast)){beanFormRoast=roast;renderBeanRoast();}
    // url: als AI de brander-website vond -> gerichte zoeklink naar de specifieke boon
    // binnen die site. Anders een zoeklink op merknaam + boon.
    if(d.url && d.name){
      const dom=domainOf(d.url);
      if(dom){
        setText('b-url','https://www.google.com/search?q='+encodeURIComponent('site:'+dom+' '+d.name));
      }else{
        setText('b-url',d.url);
      }
    }else if(d.url){
      setText('b-url',d.url);
    }else if(d.roaster){
      const q=encodeURIComponent((d.roaster+' '+(d.name||'')+' coffee').trim());
      setText('b-url','https://www.google.com/search?q='+q);
    }
    status.innerHTML='✓ filled in — check and adjust where needed';
    document.getElementById('enrich-row').style.display='block';
  }catch(e){
    status.textContent='couldn\'t read the label automatically — fill in manually (the photo is saved)';
  }
  ev.target.value='';
}
// extra info aanvullen op basis van roaster + boon (modelkennis)
/* ---- de link doet het werk ----
   Plak je de pagina van de brander en staat AI aan, dan haalt de app eruit wat
   erop staat: naam, brander, proces, variëteit, hoogte, smaaknoten -- en de
   plek op de kaart, zodat de zak meteen bij zijn streek hoort. Alleen lege
   velden worden gevuld; wat jij zelf typte blijft staan.                    */
let beanLinkBezig='';
/* De etiketregels gelden voor een foto: daar staat de tekst voor je neus, en
   dan is aanvullen liegen. Bij een link is er juist geen tekst -- dan moet de
   AI wél putten uit wat hij over deze brander en deze boon weet, anders komt
   hij met lege handen terug. Vandaar een eigen set regels.               */
const LINK_RULES=
  'LINK-REGELS:\n'+
  '- Je kunt de pagina niet openen. Werk met twee bronnen: (a) wat er in de URL zelf staat '+
  '(domein = de brander, het pad/de slug = meestal de naam van de boon, soms ook herkomst, proces of variëteit), '+
  'en (b) wat je uit je kennis weet over deze brander en over deze boon.\n'+
  '- Zet slugs om naar leesbare tekst: "ethiopia-guji-natural-250g" -> naam "Ethiopia Guji", origin "Ethiopië, Guji", process "natural".\n'+
  '- Ken je de brander maar niet deze specifieke zak, vul dan in wat voor die brander en die herkomst gebruikelijk is, '+
  'en houd het bij wat je met redelijke zekerheid kunt zeggen.\n'+
  '- Ken je de boon of de streek wel, vul dan ook variety, altitude en roasternotes in: dit is een schatting die de '+
  'gebruiker naloopt, geen etiket dat je overtypt.\n'+
  '- Laat een veld alleen leeg als je er echt niets zinnigs over kunt zeggen. Liever een goede gok die klopt met de '+
  'herkomst dan een leeg veld.\n'+
  '- process en variety in de gangbare term (washed, natural, honey, anaerobic). roasternotes komma-gescheiden.\n'+
  '- roastlevel en fam alleen als de brander of het soort zak daar duidelijk over is.';
/* ---- de link doet het werk ----
   Plak je de pagina van de brander en staat AI aan, dan leidt de app eruit af
   wat er op die zak zit: naam, brander, proces, variëteit, hoogte, smaaknoten
   -- en de plek op de kaart, zodat de zak meteen bij zijn streek hoort. Alleen
   lege velden worden gevuld; wat jij zelf typte blijft staan.             */
async function beanUitLink(){
  const el=document.getElementById('b-url'); if(!el)return;
  const url=el.value.trim();
  if(!url||!/^https?:\/\//i.test(url))return;
  if(/google\.[a-z.]+\/search/i.test(url))return;   // dat is een zoeklink, geen zak
  if(!aiReady()||url===beanLinkBezig)return;
  beanLinkBezig=url;
  const status=document.getElementById('scan-status');
  const get=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  const zetLeeg=(id,v)=>{if(v&&!get(id))setText(id,v);};
  if(status)status.innerHTML='<span class="spin"></span>de link uitlezen…';
  try{
    const landen=BP_LANDEN.filter(l=>BP_INFO[l.id]).map(l=>l.naam).join(', ');
    const alIn=['name','roaster','origin','process','variety','altitude']
      .map(k=>k+': '+(get('b-'+k)||'?')).join('; ');
    const prompt='Dit is de webpagina van een zak specialty koffie: '+url+'\n'+
      'Wat de gebruiker al invulde: '+alIn+'.\n'+
      'Vul de zak zo volledig mogelijk in. Geef ALLEEN een JSON-object terug, zonder uitleg, zonder markdown:\n'+
      '{"name":"","roaster":"","origin":"","process":"","variety":"","altitude":"","roastlevel":"","fam":"","roasternotes":"","notes":"","land":"","streek":""}\n'+
      'roastlevel is één van: '+ROAST_LEVELS.join(', ')+'. '+
      'fam is "espresso", "filter" of "both" — alleen als duidelijk is waar de zak voor gebrand is.\n'+
      'notes = twee zinnen over wat deze boon of deze streek bijzonder maakt.\n'+
      'land = het herkomstland; kies het uit deze lijst als het erbij staat: '+landen+'. '+
      'streek = de streek binnen dat land.\n'+LINK_RULES;
    const d=extractJSON(await askAI([{role:"user",content:prompt}],900,'bean'));
    ['name','roaster','origin','process','variety','altitude'].forEach(k=>zetLeeg('b-'+k,d[k]));
    zetLeeg('b-roasternotes',d.roasternotes); zetLeeg('b-notes',d.notes);
    const roast=(d.roastlevel||'').toLowerCase().trim();
    if(!beanFormRoast&&ROAST_LEVELS.includes(roast)){beanFormRoast=roast;renderBeanRoast();}
    const fam=(d.fam||'').toLowerCase().trim();
    if(!beanFormWens&&!beanFormFam&&['espresso','filter','both'].includes(fam)){
      beanFormFam=fam;renderBeanFam();
    }
    // en zet hem op de kaart, als die er nog niet staat
    let plek='';
    if(!beanFormRegions.length&&(d.land||d.origin)){
      const landId=bpLandVanBoon({origin:(d.land||'')+' '+(d.origin||'')});
      if(landId&&BP_INFO[landId]){
        const i=bpStreekVanBoon({origin:(d.streek||'')+' '+(d.origin||'')},landId);
        beanFormRegions=[{land:landId,i:(i!=null?i:null)}];
        renderBeanHerkomst();
        plek=' · '+bpRegioTekst(beanFormRegions[0])+' op de kaart';
      }
    }
    if(status)status.textContent='✓ ingevuld vanaf de link'+plek+' — kijk het even na';
    const er=document.getElementById('enrich-row'); if(er)er.style.display='block';
  }catch(e){
    beanLinkBezig='';
    if(status)status.textContent='de link uitlezen lukte niet (werkt alleen met AI aan)';
  }
}
async function enrichBean(){
  const status=document.getElementById('scan-status');
  const get=id=>{const el=document.getElementById(id);return el?el.value.trim():'';};
  const name=get('b-name'),roaster=get('b-roaster'),origin=get('b-origin'),url=get('b-url');
  if(!name&&!roaster){toast('enter at least a name or roaster first');return;}
  status.innerHTML='<span class="spin"></span>finding extra info…';
  try{
    const known=`naam: ${name||'?'}; roaster: ${roaster||'?'}; origin: ${origin||'?'}; website: ${url||'?'}; proces: ${get('b-process')||'?'}; variëteit: ${get('b-variety')||'?'}; hoogte: ${get('b-altitude')||'?'}`;
    const prompt=`Je bent een specialty-koffie expert. Voor deze specifieke boon van deze roaster, vul de ontbrekende informatie zo volledig mogelijk aan op basis van wat algemeen bekend is over deze boon, roaster en herkomst. Verzin niets: laat een veld leeg als je het echt niet weet. Bekend:\n${known}\nGeef ALLEEN JSON terug zonder markdown: {"origin":"","process":"","variety":"","altitude":"","roasternotes":"","notes":""}. roasternotes = smaakprofiel (komma-gescheiden). notes = korte extra omschrijving (max 2 zinnen) over deze boon/herkomst. Vul alleen velden in waar je iets aan toevoegt.\n${BEAN_RULES}`;
    const txt=await askAI([{role:"user",content:prompt}],700,'bean');
    const d=extractJSON(txt);
    // alleen invullen waar nu nog leeg, behalve notes/roasternotes die mogen aanvullen
    if(d.origin&&!get('b-origin'))setText('b-origin',d.origin);
    if(d.process&&!get('b-process'))setText('b-process',d.process);
    if(d.variety&&!get('b-variety'))setText('b-variety',d.variety);
    if(d.altitude&&!get('b-altitude'))setText('b-altitude',d.altitude);
    if(d.roasternotes)setText('b-roasternotes',d.roasternotes);
    if(d.notes)setText('b-notes',d.notes);
    status.textContent='✓ enriched — please check everything';
  }catch(e){
    status.textContent='couldn\'t fetch extra info — check your AI key in settings';
  }
}

/* ---------------- AI: brew-recept ---------------- */
async function aiRecipe(beanId,methodId){
  const bean=beanById(beanId);if(!bean)return;
  const m=methodById(methodId||bean.method||'v60');
  const box=document.getElementById('recipe-'+beanId);
  if(box)box.innerHTML='<div class="recipe-card sketch soft"><span class="spin"></span>thinking up a recipe for '+esc(m.name)+'…</div>';
  try{
    const info=`boon: ${bean.name}; roaster: ${bean.roaster||'?'}; origin: ${bean.origin||'?'}; proces: ${bean.process||'?'}; variëteit: ${bean.variety||'?'}; hoogte: ${bean.altitude||'?'}; smaaknotities brander: ${bean.roasternotes||'?'}`;
    const espM=methodFamily(m)==='espresso';
    const milk=espM?` Je mag een melkdrank kiezen (espresso, flat white, cappuccino, latte, cortado, macchiato, americano); zet dan de melkstappen in "steps" en de dranknaam in "drink".`:'';
    const prompt=`Je bent een specialty-barista. Geef een concreet zetrecept voor de methode "${m.name}" voor deze boon.\n${info}${beanPromptBlock(bean)}\n${gearPromptBlock(m.id)}${milk}${'\n'+APP_RULES+'\n'+BEAN_GRIND_RULES+'\n'+(espM?ESPRESSO_RULES:FILTER_RULES)+'\n'}Geef ALLEEN JSON terug zonder markdown: {"drink":"","dose":"","yield":"","ratio":"","grind":"","grindNote":"","temp":"","time":"","steps":["",""],"tip":""}. drink = melkdranknaam of "espresso" (leeg bij filter). grind = KORTE maalstand voor het invulveld (alleen getal/klikken of één woord, GEEN uitleg/merknaam). grindNote = korte uitleg over de maling. Houd het kort en praktisch, Nederlands. dose/yield in gram, temp in °C, ratio als 1:x.`;
    const txt=await askAI([{role:"user",content:prompt}],900,'brew');
    const d=extractJSON(txt);
    let html='<div class="recipe-card sketch" style="background:var('+m.tint+')">';
    html+='<div class="hand" style="font-size:26px">recept · '+esc(m.name)+'</div>';
    html+='<div class="rk">parameters</div>';
    html+='<div class="rstep">dose '+esc(d.dose)+' · yield '+esc(d.yield)+' · ratio '+esc(d.ratio)+'</div>';
    html+='<div class="rstep">maling '+esc(conciseGrind(d.grind))+' · '+esc(d.temp)+'° · '+esc(d.time)+'</div>';
    if(d.grindNote)html+='<div class="rstep" style="color:var(--ink-soft)">'+esc(d.grindNote)+'</div>';
    if(d.steps&&d.steps.length){html+='<div class="rk">stappen</div>';d.steps.forEach((st,i)=>html+='<div class="rstep">'+(i+1)+'. '+esc(st)+'</div>');}
    if(d.tip)html+='<div class="rk">tip</div><div class="rstep">'+esc(d.tip)+'</div>';
    window._lastRecipe=window._lastRecipe||{};window._lastRecipe[beanId]={d,methodId:m.id};
    html+='<button class="recipe-btn" onclick="useRecipe(\''+beanId+'\')">＋ use as new brew</button>';
    html+='</div>';
    if(box)box.innerHTML=html;
  }catch(e){
    if(box)box.innerHTML='<div class="recipe-card sketch soft">couldn\'t make a recipe — check your AI key in settings.</div>';
  }
}
function useRecipe(beanId){
  const r=(window._lastRecipe||{})[beanId];if(!r)return;const d=r.d;
  const esp=methodFamily(r.methodId)==='espresso';
  const gShort=conciseGrind(d.grind);
  const gNote=(d.grindNote||'').trim()||((''+(d.grind||'')).trim()!==gShort?(''+d.grind).trim():'');
  let guide='';
  if(d.steps&&d.steps.length)guide=d.steps.map((st,i)=>(i+1)+'. '+st).join('\n');
  if(gNote)guide=(guide?guide+'\n\n':'')+'maling: '+gNote;
  if(d.tip)guide=(guide?guide+'\n':'')+'💡 tip: '+d.tip;
  pendingTarget={dose:numOf(d.dose),grind:gShort,time:cleanTime(d.time),yield:numOf(d.yield)};
  const drink=(d.drink||'').trim();
  pendingRecipe={guide,drink,title:(d.title||'').trim()};
  formBean=beanId;
  if(esp){
    beginBrew(r.methodId);pendingTarget={dose:numOf(d.dose),grind:gShort,time:cleanTime(d.time),yield:numOf(d.yield)};
    formBean=beanId;pendingRecipe={guide,drink,title:(d.title||'').trim()};
    setTimeout(()=>{setVal('di-dose',numOf(d.dose));setVal('di-yield',numOf(d.yield));renderDialIn();toast('✓ '+(drink||'espresso')+' — measure your shot & save');},30);
    return;
  }
  openForm(r.methodId);setTimeout(()=>{
    pickBean(beanId);
    setText('f-dose',numOf(d.dose));setText('f-yield',numOf(d.yield));
    if(d.ratio){const r2=(''+d.ratio).split(':').pop();setText('f-ratio',numOf(r2));}
    setText('f-time',cleanTime(d.time));setText('f-temp',numOf(d.temp));
    if(gShort)setText('f-grind',gShort);
    pendingTarget={dose:numOf(d.dose),grind:gShort,time:cleanTime(d.time),yield:numOf(d.yield)};
    renderDialInHint();
    toast('✓ recipe applied');
  },30);
}

/* ---------------- learn content ---------------- */
const LESSONS={
  filter:[
    {type:'draw',h:'percolatie of immersie',svg:'<svg viewBox="0 0 300 158"><path d="M18 34 Q60 28 104 34"/><path class="b" d="M21 37 Q60 31 101 37"/><path d="M20 36 Q40 84 54 116"/><path class="b" d="M23 38 Q42 85 56 118"/><path d="M102 36 Q82 84 68 116"/><path class="b" d="M99 38 Q80 85 66 118"/><path d="M54 116 Q61 120 68 116"/><path class="hi" d="M31 54 Q61 49 91 54"/><path class="hi dash" d="M48 60 Q50 88 56 114"/><path class="hi dash" d="M76 60 Q74 88 68 114"/><path class="hi" d="M59 122 Q62 130 60 138"/><path class="hi" d="M55 132 L60 140 L65 131"/><text x="14" y="154">percolatie</text><path d="M198 34 Q240 28 284 34"/><path class="b" d="M201 37 Q240 31 281 37"/><path d="M200 36 Q220 84 234 116"/><path class="b" d="M203 38 Q222 85 236 118"/><path d="M282 36 Q262 84 248 116"/><path class="b" d="M279 38 Q260 85 246 118"/><path d="M234 116 Q241 120 248 116"/><path class="hi" d="M210 50 Q241 45 272 50"/><path class="hi b" d="M220 76 Q241 72 262 76"/><path class="hi b" d="M228 94 Q241 91 254 94"/><path d="M232 122 Q241 118 250 122"/><path class="hi" d="M240 126 Q248 130 240 136"/><text x="214" y="154">immersie</text></svg>',
     c:'de twee families waar elk filterrecept tussenin zit',
     t:'Bij percolatie (V60, Chemex, Kalita) stroomt het water door het bed heen: elke druppel maakt \u00e9\u00e9n reis, en de contacttijd bepaal je met je maling. Bij immersie (French press, cold brew, en een omgekeerde AeroPress) staat alles even lang onder water. Dat is vergevingsgezinder, want een paar seconden meer of minder verandert weinig \u2014 bij percolatie wel.'},
    {type:'p',h:'wat dat met je smaak doet',t:'Bij percolatie is het water dat langs de koffie stroomt steeds vers, dus blijft het gretig oplossen. Je haalt er de vluchtige, lichte dingen het beste uit: bloemig, citrus, thee \u2014 en de kop is helder, met een dunner mondgevoel, want het papier ziet elke druppel \u00e9\u00e9n keer. Bij immersie raakt het water rond de koffie langzaam verzadigd en stopt de extractie zichzelf af. Dat levert minder scherpe randen op en meer zoet, body en rondheid, maar ook minder definitie: het fijne onderscheid tussen twee bloemige bonen vlakt af. Vandaar de vuistregel \u2014 wil je een boon lezen, percoleer; wil je hem lekker en vergevingsgezind, dompel onder.'},
    {type:'p',h:'de Hario Switch: allebei, in \u00e9\u00e9n brouwsel',t:'De Switch is een V60 met een klep onderin, en dat maakt het geen derde methode maar een schuifknop tussen de twee. Klep dicht = immersie: het water blijft staan en je bouwt zoet en body op. Klep open = percolatie: het loopt door en je wint helderheid. Het gangbare recept sluit de klep voor de bloom en een weekfase, en opent hem daarna om leeg te laten lopen \u2014 zo krijg je de zoetheid van een immersie met de helderheid van een dripper. Draai je de volgorde om (eerst open, aan het eind dicht), dan hou je juist de laatste, zwakkere loop vast en wordt het romiger maar minder scherp. Op je Switch is de klep dus een smaakknop, en hij staat in de pour coach bij elke stap.'},
    {type:'p',h:'en je AeroPress heeft dezelfde knop',t:'Wat de klep bij de Switch is, is de stand bij een AeroPress. <b>Normaal</b>, met het filterdopje op je kopje, werkt het water vanaf de eerste seconde door het papier: deels percolatie, dus schoner en dunner, met de lichte smaken voorop \u2014 maar je hebt de weektijd niet in de hand en je zit sneller tegen onderextractie aan. <b>Omgekeerd</b>, op de zuiger, loopt er niets door tot jij hem omdraait: volle immersie, dus meer zoet, meer body en veel beter te herhalen, met wat minder definitie. Zelfde boon, zelfde maling, andere kop. In een aeropress-recept kies je die stand, en de app zet de omkeerstap er dan zelf tussen.'},
    {type:'p',h:'de vier knoppen',t:'Je stuurt een filterkop met vier dingen: maling, ratio, temperatuur en gietschema. De maling is verreweg de sterkste \u2014 begin daar, en verander \u00e9\u00e9n ding tegelijk. Anders weet je achteraf niet wat het deed.'},
    {type:'p',h:'ratio en maling doen niet hetzelfde',t:'De ratio bepaalt hoe sterk je kop is; de maling bepaalt hoe ver je extraheert. Slap maar niet bitter? Dat is de ratio: minder water of meer koffie, richting 1:15. Zuur of juist bitter? Dat is de maling. Het standaardvertrekpunt is 1:16, met 1:15 voor steviger en 1:17 voor helderder.'},
    {type:'draw',h:'waarom je bloomt',svg:'<svg viewBox="0 0 300 160"><path d="M18 40 Q56 34 94 40"/><path class="b" d="M21 43 Q56 37 91 43"/><path d="M20 42 Q36 84 46 112"/><path d="M92 42 Q76 84 66 112"/><path class="hi" d="M28 36 Q38 6 56 4 Q74 5 84 36"/><path class="hi b" d="M32 34 Q42 12 56 10 Q70 11 80 34"/><path class="hi" d="M46 14 Q52 20 48 26"/><text x="16" y="134">vers: bolt op</text><text x="16" y="149">3× dose, 45 s</text><path class="dash" d="M112 66 Q136 62 160 66"/><path d="M153 60 L162 66 L153 72"/><path d="M182 40 Q220 34 258 40"/><path class="b" d="M185 43 Q220 37 255 43"/><path d="M184 42 Q200 84 210 112"/><path d="M256 42 Q240 84 230 112"/><path class="hi" d="M194 34 Q220 26 246 34"/><text x="180" y="134">oud: blijft vlak</text><text x="180" y="149">2× dose, 30 s</text></svg>',
     c:'hetzelfde gas, een ander advies dan bij espresso',
     t:'Vers gebrande bonen zitten vol CO\u2082. Dat gas duwt het water weg, dus laat je het eerst ontsnappen: ongeveer 2 tot 3 keer je dose aan water, 30 tot 45 seconden. Hoe verser de boon, hoe ruimer en langer. Na een week of vier is er nauwelijks gas over en koelt een lange bloom je bed alleen maar af.'},
    {type:'p',h:'gieten: hoogte, cirkels en de rand',t:'Giet van laag en rustig; van hoog slaat de straal het bed open en spoelt fijn stof naar beneden. Blijf van de filterrand af \u2014 water dat langs het papier loopt heeft geen koffie gezien. Swirlen mag, maar roer niet met een lepel \u00ed\u00f1 het bed: dat drijft fijn stof de poriën van het papier in en verstopt je filter.'},
    {type:'draw',h:'het bed lezen',svg:'<svg viewBox="0 0 300 150"><path d="M12 26 Q46 21 80 26"/><path d="M14 28 Q30 66 40 92"/><path d="M78 28 Q62 66 52 92"/><path d="M40 92 Q46 95 52 92"/><path class="hi" d="M24 56 Q46 52 68 56"/><text x="16" y="116">vlak</text><text x="8" y="132">zoals het hoort</text><path d="M112 26 Q146 21 180 26"/><path d="M114 28 Q130 66 140 92"/><path d="M178 28 Q162 66 152 92"/><path d="M140 92 Q146 95 152 92"/><path class="hi" d="M124 52 Q135 68 146 69 Q157 68 168 52"/><text x="116" y="116">krater</text><text x="106" y="132">te hard gegoten</text><path d="M212 26 Q246 21 280 26"/><path d="M214 28 Q230 66 240 92"/><path d="M278 28 Q262 66 252 92"/><path d="M240 92 Q246 95 252 92"/><path class="hi" d="M224 46 Q235 64 246 64 Q257 64 268 46"/><path class="hi b" d="M226 42 Q228 52 231 58"/><path class="hi b" d="M266 42 Q264 52 261 58"/><text x="216" y="116">muurtje</text><text x="216" y="132">droge rand</text></svg>',
     c:'kijk even in je dripper als het water weg is',
     t:'Een vlak bed betekent dat het water overal even hard heeft gewerkt. Een krater betekent dat je te hard of te hoog hebt gegoten. Een droge rand die blijft staan betekent dat een deel van je koffie nooit heeft meegedaan. Allebei gietfouten, geen maalfouten \u2014 corrigeer dus eerst je gieten voordat je aan je molen draait.'},
    {type:'p',h:'de doorlooptijd',t:'Bij espresso lees je de shot af aan de tijd; bij filter is de doorlooptijd het equivalent: vanaf je laatste giet tot het bed droogvalt. Loopt het steeds trager, dan zit je filter verstopt door fijn stof \u2014 grover malen, minder roeren, lager gieten. Loopt het opeens snel, dan is je maling te grof of je bed opengeslagen.'},
    {type:'p',h:'papier en brewer tellen mee',t:'Hetzelfde recept op ander papier verschuift je doorlooptijd makkelijk een halve minuut: de Japanse Hario loopt sneller dan de tabbed versie, Sibarist sneller dan allebei, Cafec Abaca zit ertussenin met wat meer zoetheid. Een conische brewer houdt een dieper bed dan een vlakke, en die twee vragen niet dezelfde maling. Noteer het, anders schrijf je het verschil toe aan je molen.'},
    {type:'p',h:'water',t:'Een kop filter is bijna helemaal water en er staat geen crema of melk overheen, dus je proeft het. Magnesium trekt vooral aroma\u2019s los, calcium meer body en zuren, en bicarbonaat dempt zuren \u2014 te veel daarvan haalt precies het frisse weg waar je een lichte branding om koopt. Zet je waterbasis \u00e9\u00e9n keer vast en vergeet hem daarna.'},
    {type:'tip',t:'Proef je kop nog een keer als hij handwarm is. Bij specialty komen er dan juist m\u00e9\u00e9r smaken naar boven \u2014 en een kop die koud nog lekker is, was goed gezet.'},
    {type:'check',h:'filter check-routine',items:[
      'boon vers (3 dagen tot 4 weken)','water op \u00e9\u00e9n vaste basis','filter gespoeld','dose gewogen','bed vlak geschud',
      'bloom 2\u20133\u00d7 dose, 30\u201345 s','laag en binnen de rand gegoten','doorlooptijd gekeken','bed bekeken','geproefd \u00e9n genoteerd']},
    {type:'link',h:'meteen zetten?',t:'',label:'open de pour coach',action:'learnToPour',feat:'pourcoach'},
  ],
  barista:[
    {type:'p',h:'dose & verdeling',t:'Weeg altijd je dose op 0,1 g nauwkeurig. Verdeel het maalsel gelijkmatig (WDT met een naaldje) zodat water overal even snel doorloopt — ongelijke verdeling = kanaalvorming en een scheve extractie.'},
    {type:'p',h:'tampen',t:'Tamp recht en consistent, niet keihard. Belangrijker dan de kracht is dat je elke keer hetzelfde doet en dat het oppervlak waterpas is.'},
    {type:'p',h:'maling afstellen',t:'De maling is je krachtigste knop. Loopt de shot te snel (waterig, zuur)? Maal fijner. Te traag (bitter, droog)? Maal grover. Stel bij in kleine stapjes.'},
    {type:'tip',t:'Verandert je smaak zonder dat je iets veranderde? Check eerst je maalgraad en versheid van de boon — die schuiven het snelst.'},
    {type:'check',h:'espresso check-routine',items:[
      'boon vers (1–4 weken na branden)','dose gewogen','maalsel verdeeld (WDT)','recht getampt','shot getimed','yield gewogen','geproefd & genoteerd']},
  ],
  academy:[
    {type:'p',h:'wat is specialty coffee?',t:'Specialty coffee scoort 80+ van de 100 punten bij een professionele cupping volgens de Specialty Coffee Association. Geen defecten, een herkenbaar smaakprofiel en traceerbaar tot de producent. Het is een kwaliteitsklasse, geen marketingterm.'},
    {type:'p',h:'arabica vs robusta',t:'Bijna alle specialty is Arabica: complexer en fijner van smaak, maar gevoeliger en lastiger te telen. Robusta is robuuster, bitterder en cafeïnerijker, en wordt zelden als specialty geclassificeerd.'},
    {type:'p',h:'de coffee belt',t:'Koffie groeit rond de evenaar — Midden- en Zuid-Amerika, Afrika en Azië. Hoogtes tussen ~1200 en 2200 m geven langzame rijping en zo complexere smaken. Bodem, zon, regen en nachtkou bepalen mee de aroma\'s.'},
    {type:'p',h:'de koffiekers',t:'Een koffieboon is eigenlijk de pit van een rode koffiekers. Meestal zitten er twee pitten in een kers. Bij specialty wordt met de hand alleen de rijpe kers geplukt.'},
    {type:'p',h:'washed proces',t:'Het vruchtvlees wordt verwijderd (depulpen), daarna fermenteert de boon zodat de slijmlaag loslaat, en wordt hij gewassen en gedroogd. Resultaat: een heldere, schone, vaak fruitig-zure kop. Komt veel uit Afrika.'},
    {type:'p',h:'natural proces',t:'De hele kers droogt in de zon met vruchtvlees en al. Geeft een zoetere, fruitigere, wijnachtige kop met voller mondgevoel en lagere zuren. Ongeveer 70% van de wereldproductie is natural.'},
    {type:'p',h:'honey proces',t:'Een tussenvorm: ontpulpen zoals washed, maar drogen met de zoete slijmlaag er nog omheen (zoals natural). Geeft balans tussen zoetheid en helderheid. Complex en gevoelig om goed te krijgen.'},
    {type:'p',h:'experimentele fermentatie',t:'Anaerobe fermentatie (in afgesloten tanks zonder zuurstof) en carbonic maceration geven heel uitgesproken, soms wilde smaken. Hoger risico en duurder — vandaar de prijs.'},
    {type:'p',h:'branden (roasting)',t:'Bij het branden verandert de groene boon in een aromatische boon. Tijdens het proces hoor je twee "cracks". Licht en medium branden behouden de natuurlijke smaken (citrus, bloem, fruit); donker branden maskeert nuance en wordt bitterder.'},
    {type:'p',h:'ontgassen (degassen)',t:'Net gebrande bonen geven CO₂ af. Daarom is koffie op zijn best tussen ~3 dagen en 6 weken na branden. Te verse koffie geeft belletjes en een onrustige extractie; te oude koffie smaakt vlak.'},
    {type:'p',h:'versheid → maalgraad',t:'Hoe verser de boon, hoe meer CO₂: de extractie remt en de shot loopt trager. Vuistregel: net na de rustperiode iets fijner malen, en naarmate de boon ouder wordt (minder gas) stap voor stap grover. In je bonenkast zie je per boon "X dagen vers" — gebruik dat als hint bij het afstellen.'},
    {type:'link',h:'meteen afstellen?',t:'Open het dial-in scherm en werk met doel vs. jouw shot naar de juiste maalstand toe.',label:'espresso afstellen (dial-in)',action:'learnToDialIn'},
    {type:'p',h:'roast-niveau → maling & temp',t:'Donker gebrande bonen zijn brozer en lossen sneller op: maal iets grover en zet iets koeler om bitterheid te vermijden. Lichte roasts zijn dichter en trager: maal fijner en zet warmer om genoeg zoetheid en body los te maken.'},
    {type:'p',h:'de zak lezen voor je maalt',t:'Drie dingen op de zak vertellen samen al waar je ongeveer moet beginnen. De branding weegt het zwaarst: donkerder is brozer en beter oplosbaar, dus grover. Het proces bepaalt de celstructuur: een natural droogt met vrucht en al, houdt een zwakkere structuur over en extraheert het snelst — grover dus; washed is het stevigst en loopt het traagst, dus fijner; honey zit ertussenin. En de hoogte staat voor dichtheid: boven ongeveer 1800 meter groeit de boon langzaam en hard, wat weer fijner vraagt. Decaf is een geval apart: het ontcafeïneren tast de celstructuur aan, dus stel opnieuw af in plaats van je oude stand door te rekenen.'},
    {type:'tip',t:'Vul branding, proces en hoogte in bij een nieuwe zak. De app rekent dan het verschil met je vorige zak om in stappen fijner of grover — en zodra je iets vergelijkbaars eerder zette, gebruikt hij die stand in plaats van de vuistregel.'},
    {type:'p',h:'extractie',t:'Koffie zetten is oplossen. Te weinig/te grof = onderextractie (zuur, dun, zout). Te veel/te fijn = overextractie (bitter, droog). De zoete balans zit ertussenin.'},
    {type:'p',h:'de vier knoppen',t:'Je stuurt smaak met vier dingen: maalgraad, dose/ratio, watertemperatuur en tijd. Verander er één tegelijk, anders weet je niet wat werkte.'},
    {type:'p',h:'water',t:'Koffie is ~98% water. Te zacht smaakt vlak, te hard maskeert en verkalkt je apparaat. Mineraalgehalte rond 75–150 ppm en gefilterd water werken het best.'},
    {type:'p',h:'cold brew',t:'Grof gemalen koffie 12–24 uur koud laten trekken geeft een zacht, zoet concentraat met heel lage zuren. Verdun met water of melk. Iets anders dan iced coffee, dat warm gezet en daarna gekoeld wordt.'},
    {type:'p',h:'single origin vs blend',t:'Single origin komt van één regio, farm of coöperatie met een uitgesproken karakter. Een blend mengt herkomsten voor een consistente, gebalanceerde smaak — vaak fijn voor espresso met melk.'},
    {type:'p',h:'cupping & smaak',t:'Bij cupping wordt blind geproefd op aroma, zuren, zoetheid, body en nasmaak. Thuis kun je hetzelfde doen: laat je koffie afkoelen — bij specialty komen dan juist méér smaken naar boven.'},
    {type:'tip',t:'Zuur en dun? Maal fijner of zet warmer. Bitter en droog? Maal grover of zet koeler. Eén stap tegelijk.'},
  ],
};
const LESSON_MAP={'barista-content':'barista','filter-content':'filter','academy-content':'academy'};
function lessonBlock(elId,bi){return (LESSONS[LESSON_MAP[elId]]||[])[bi];}
function learnMoreKey(elId,bi){return 'scc_learn_more_'+elId+'_'+bi;}
function renderLearnMore(elId,bi){
  const arr=JSON.parse(localStorage.getItem(learnMoreKey(elId,bi))||'[]');
  return arr.map((item,i)=>`<div class="lm-item"><button class="lm-del" title="delete" onclick="learnMoreDel('${elId}',${bi},${i})">×</button><div class="lm-q hand">${esc(item.q)}</div><div class="lm-a">${esc(item.a).replace(/\n/g,'<br>')}</div></div>`).join('');
}
const AISPARK='<svg viewBox="0 0 24 24" class="acic"><path d="M11.6 4.2 Q12.7 8.2 13.4 9.9 Q15.2 10.7 19.8 11.3 Q15 12.6 13.1 13.4 Q12.4 15.4 11.8 20.8 Q11.2 15 10.6 13.1 Q8.6 12.4 4.2 11.6 Q9.1 10.3 10.9 9.6 Q11.6 7.6 12.3 3.4"/></svg>';
function renderLesson(elId,blocks){
  const el=document.getElementById(elId);
  el.innerHTML=blocks.map((b,bi)=>{
    if(b.type==='p'){
      const key=elId+'_'+bi;
      return `<div class="lesson sketch soft"><h3>${esc(b.h)}</h3><p>${esc(b.t)}</p>
        <div class="lm-saved" id="lm-saved-${key}">${renderLearnMore(elId,bi)}</div>
        <div class="lm-wrap ai-only ${aiReady()?'':'hidden'}">
          <button class="lm-btn" onclick="learnMoreToggle('${key}')">${AISPARK} leer meer</button>
          <div class="lm-panel hidden" id="lm-panel-${key}">
            <input id="lm-input-${key}" placeholder="ask your own question about this…" onkeydown="if(event.key==='Enter')learnMoreAsk('${elId}',${bi},false)">
            <div class="lm-actions">
              <button class="lm-go primary" onclick="learnMoreAsk('${elId}',${bi},true)">verdiep dit</button>
              <button class="lm-go" onclick="learnMoreAsk('${elId}',${bi},false)">vraag</button>
            </div>
          </div>
        </div></div>`;
    }
    if(b.type==='draw')return `<div class="lesson sketch soft"><h3>${esc(b.h)}</h3>
      <div class="ls-draw">${b.svg}</div><div class="ls-cap">${esc(b.c||'')}</div>
      ${b.t?('<p style="margin-top:8px">'+esc(b.t)+'</p>'):''}</div>`;
    if(b.type==='tip')return `<div class="lesson sketch soft" style="background:var(--v60)"><div class="tipbox">💡 ${esc(b.t)}</div></div>`;
    if(b.type==='link'){
      if(b.feat&&!featOn(b.feat))return '';
      return `<button class="lesson-link sketch" onclick="${esc(b.action)}()"><svg viewBox="0 0 24 24" class="acic"><path d="M18.4 9.4 Q21.4 14.4 17.2 18.5 Q12.5 21.3 7.5 18.6 Q3.3 15.3 4.6 10.1 Q6.6 4.9 12.1 3.8 Q16.5 3.9 19 8.3"/><path d="M15 9.3 Q17.2 12.4 14.6 15.2 Q11.5 17 8.8 14.8 Q6.9 12.1 9 9.5 Q11.5 7.2 14.5 8.6"/><path d="M12.9 11.2 Q13.7 12.6 12.2 13.3 Q10.8 13.1 10.9 11.6 Q11.4 10.8 12.6 11.1"/></svg><span>${esc(b.label)}</span><span class="ll-arr">›</span></button>`;
    }
    if(b.type==='check'){
      const key=elId+'_'+bi;
      const done=JSON.parse(localStorage.getItem('scc_check_'+key)||'[]');
      const rows=b.items.map((it,i)=>`<div class="check ${done.includes(i)?'done':''}" onclick="toggleCheck('${key}',${i},this)">
        <div class="box">${done.includes(i)?'✓':''}</div><div class="ctxt">${esc(it)}</div></div>`).join('');
      return `<div class="lesson sketch"><h3>${esc(b.h)}</h3>${rows}</div>`;
    }
    return '';
  }).join('');
}
function learnToGallery(){go('gallery');}
function learnToPour(){
  const f=state.methods.filter(m=>m.on&&methodFamily(m)==='filter')[0];
  if(f){beginBrew(f.id);setTimeout(()=>{const c=document.getElementById('pc-stack');
    if(c&&c.style.display!=='none')c.scrollIntoView({behavior:'smooth',block:'start'});},250);}
  else toast('turn on a filter method first under methods');
}
function learnToDialIn(){
  const esp=state.methods.filter(m=>m.on&&methodFamily(m)==='espresso')[0];
  if(esp)beginBrew(esp.id); else toast('turn on an espresso method first under methods');
}
function learnMoreToggle(key){
  const p=document.getElementById('lm-panel-'+key);if(!p)return;
  p.classList.toggle('hidden');
  if(!p.classList.contains('hidden')){const i=document.getElementById('lm-input-'+key);if(i)i.focus();}
}
async function learnMoreAsk(elId,bi,deepen){
  const block=lessonBlock(elId,bi);if(!block)return;
  const key=elId+'_'+bi;
  const inputEl=document.getElementById('lm-input-'+key);
  const vraag=deepen?'':((inputEl&&inputEl.value.trim())||'');
  if(!deepen&&!vraag){toast('type a question first');return;}
  const savedEl=document.getElementById('lm-saved-'+key);
  const loadId='lm-load-'+Date.now();
  savedEl.insertAdjacentHTML('beforeend','<div class="lm-item" id="'+loadId+'"><span class="spin"></span>the coach is thinking…</div>');
  try{
    const sys="Je bent een specialty-koffiedocent. Onderwerp uit de academy — \""+block.h+"\": "+block.t+"\n\n"+
      (deepen?"Verdiep dit onderwerp met 3–5 concrete, extra inzichten die verder gaan dan de tekst hierboven.":
              ("Beantwoord deze vraag van de lerende: \""+vraag+"\"."))+
      " Schrijf in het Nederlands, kort en praktisch, max 6 zinnen. Geen inleiding — direct de kennis.";
    const txt=await askAI([{role:"user",content:sys}],600,'learn');
    const skey=learnMoreKey(elId,bi);
    const arr=JSON.parse(localStorage.getItem(skey)||'[]');
    arr.push({q:(deepen?'verdieping ✦':vraag),a:(txt||'').trim(),ts:Date.now()});
    localStorage.setItem(skey,JSON.stringify(arr));
    savedEl.innerHTML=renderLearnMore(elId,bi);
    if(inputEl)inputEl.value='';
    toast('✓ added to your academy');
  }catch(e){
    const l=document.getElementById(loadId);if(l)l.remove();
    toast('couldn\'t reach the coach');
  }
}
function learnMoreDel(elId,bi,i){
  const skey=learnMoreKey(elId,bi);
  const arr=JSON.parse(localStorage.getItem(skey)||'[]');
  arr.splice(i,1);localStorage.setItem(skey,JSON.stringify(arr));
  const el=document.getElementById('lm-saved-'+elId+'_'+bi);if(el)el.innerHTML=renderLearnMore(elId,bi);
}
function toggleCheck(key,i,row){
  const k='scc_check_'+key;
  let done=JSON.parse(localStorage.getItem(k)||'[]');
  if(done.includes(i)){done=done.filter(x=>x!==i);row.classList.remove('done');row.querySelector('.box').textContent='';}
  else{done.push(i);row.classList.add('done');row.querySelector('.box').textContent='✓';}
  localStorage.setItem(k,JSON.stringify(done));
}
// maakt een compacte samenvatting van je bonen + recente brews voor de AI
/* Alles wat de app over jou weet, als leesbare tekst voor de coach. Vraag je
   iets over "die boon die ik gisteren dialde", dan moet hij die boon kunnen
   vinden en er de echte cijfers bij hebben -- niet alleen de naam.          */
function beanRegel(b){
  const p=[b.name];
  if(b.roaster)p.push('van '+b.roaster);
  if(b.origin)p.push(b.origin);
  if(b.process)p.push(b.process);
  if(b.variety)p.push('variëteit '+b.variety);
  if(b.roast)p.push('branding '+b.roast);
  if(altitudeOf(b))p.push(altitudeOf(b)+' m');
  const f=beanFreshness(b);
  if(f)p.push(f.days+' dagen na branden');
  if(b.fam)p.push('zak zegt: '+(b.fam==='both'?'omni':b.fam));
  if(isDecaf(b))p.push('DECAF');
  if(b.roasternotes)p.push('smaaknotities: '+b.roasternotes);
  const ms=(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[]))
    .map(id=>(methodById(id)||{}).name).filter(Boolean);
  if(ms.length)p.push('methodes: '+ms.join('/'));
  // wat er echt is afgetekend weegt het zwaarst -- dat zijn gemeten waarden
  const vast=beanDial(b,null);
  if(vast)p.push('AFGETEKEND: '+vast.map(d=>
    ((methodById(d.method)||{}).name||d.method)+' op maalstand '+d.grind+
    (dialCijfers(d)?(' ('+dialCijfers(d)+')'):'')).join(' | '));
  if(b.dialIn&&b.dialIn.grind)p.push('laatste AI-maaltip: '+b.dialIn.grind+
    (b.dialIn.reason?(' — '+b.dialIn.reason):''));
  if(b.notes)p.push('jouw notitie: '+b.notes);
  return '- '+p.join(', ');
}
function brewRegel(b){
  const m=methodById(b.method);
  const bits=[(m&&m.name)||b.method];
  bits.push(timeAgo(b.ts));
  if(b.drink)bits.push(b.drink);
  if(b.beans)bits.push('boon: '+b.beans);
  if(b.dose)bits.push(b.dose+'g in');
  if(b.yield)bits.push(b.yield+'g uit');
  if(b.ratio)bits.push('ratio 1:'+(+b.ratio).toFixed(1));
  if(b.time)bits.push('tijd '+b.time);
  if(b.grind)bits.push('maalstand '+b.grind+(b.grinder?(' op '+b.grinder):''));
  if(b.temp)bits.push(b.temp+'°C');
  if(b.draw)bits.push('doorlooptijd '+b.draw);
  if(b.bed)bits.push('bed '+bedNL(b.bed));
  if(b.cup)bits.push('geproefd: '+((cupById(b.cup)||{}).nl||b.cup));
  if(b.score!=null&&b.score!=='')bits.push('score '+(+b.score).toFixed(1)+'/10');
  if(asArr(b.tags).length)bits.push('smaak: '+asArr(b.tags).join('/'));
  if(b.notes)bits.push('notitie: '+b.notes);
  if(isDialInBrew(b))bits.push('(dial-in)');
  return '- '+bits.join(', ');
}
function myCoffeeContext(){
  let ctx='';
  const inHuis=state.beans.filter(b=>b.inStock!==false);
  const op=state.beans.filter(b=>b.inStock===false);
  if(inHuis.length){
    ctx+='=== BONEN IN KAST (nu in huis — gebruik dit als eerste) ===\n';
    inHuis.slice(0,20).forEach(b=>{ctx+=beanRegel(b)+'\n';});
  }else{
    ctx+='=== BONEN IN KAST ===\n(geen bonen als "in huis" gemarkeerd)\n';
  }
  if(op.length){
    ctx+='\n=== ZAKKEN DIE OP ZIJN (niet meer te zetten, wel om naar te verwijzen) ===\n';
    op.slice(0,10).forEach(b=>{ctx+=beanRegel(b)+'\n';});
  }
  const recent=[...state.brews].sort((a,b)=>b.ts-a.ts).slice(0,16);
  if(recent.length){
    ctx+='\n=== BREW-GESCHIEDENIS, nieuwste eerst (gebruik dit als tweede) ===\n';
    recent.forEach(b=>{ctx+=brewRegel(b)+'\n';});
  }
  // de dial-in-reeksen: hoe hij naar een stand toe werkte, niet alleen het eindpunt
  const log=state.dialLog||{};
  const keys=Object.keys(log).filter(k=>(log[k]||[]).length>1);
  if(keys.length){
    ctx+='\n=== DIAL-IN POGINGEN (oud → nieuw, per boon en methode) ===\n';
    keys.slice(0,6).forEach(k=>{
      const i=k.indexOf('|'), bean=beanById(k.slice(0,i)), mid=k.slice(i+1);
      const naam=(bean&&bean.name)||'onbekende boon';
      ctx+='- '+naam+' op '+((methodById(mid)||{}).name||mid)+': '+
        log[k].slice(-8).map(a=>'maling '+(a.g||'?')+' → '+(a.t||'?')+
          (a.y?(' / '+a.y+'g'):'')).join(' ; ')+'\n';
    });
  }
  const gear=state.gear||[];
  if(gear.length){
    ctx+='\n=== UITRUSTING ===\n';
    gear.forEach(g=>{
      const soort=g.kind==='grinder'?'molen':(g.kind==='brewer'?'brewer/machine':'tool');
      ctx+='- '+gearLabel(g)+' ('+soort+', voor '+
        (g.category==='algemeen'?'espresso én filter':g.category)+')\n';
    });
  }
  const aan=state.methods.filter(m=>m.on);
  if(aan.length)ctx+='\n=== METHODES DIE AANSTAAN ===\n'+
    aan.map(m=>'- '+m.name+' ('+methodFamily(m)+')').join('\n')+'\n';
  const eigen=(state.recipes||[]).filter(r=>r.eigen);
  if(eigen.length)ctx+='\n=== EIGEN RECEPTEN ===\n'+
    eigen.map(r=>'- '+r.naam+' ('+((methodById(methodForRecipe(r))||{}).name||recipeFam(r))+
      ', '+r.dose+'g, 1:'+r.ratio+', '+r.temp+'°C'+(r.stand?', maalstand '+r.stand:'')+')').join('\n')+'\n';
  const shots=(state.latteShots||[]).filter(x=>x.shape||x.fb);
  if(shots.length)ctx+='\n=== LATTE ART, laatste gieten ===\n'+
    shots.slice(0,5).map(x=>'- '+timeAgo(x.ts)+(x.shape?', doel: '+x.shape:'')+
      (x.fb?', feedback: '+x.fb:'')).join('\n')+'\n';
  // waar hij al geweest is op de kaart, en wat er nog op zijn lijstje staat:
  // daarmee kan de coach een volgende zak voorstellen die hij nog niet kent
  if(typeof bpGehad==='function'&&featOn('beanpick')){
    const gehad=[...bpGehad()].map(id=>(BP_LAND[id]||{}).naam).filter(Boolean);
    if(gehad.length)ctx+='\n=== LANDEN DIE HIJ AL HAD ===\n'+gehad.join(', ')+'\n';
    const wens=state.wishlist||[];
    if(wens.length)ctx+='\n=== OP ZIJN LIJSTJE, NOG NIET GEKOCHT ===\n'+
      wens.map(w=>'- '+w.streek+', '+w.land+' ('+w.proces+', '+w.brand+')').join('\n')+'\n';
  }
  return ctx;
}
async function askCoach(){
  const q=document.getElementById('coach-q').value.trim();
  if(!q){toast('type a question first');return;}
  const a=document.getElementById('coach-a');
  a.innerHTML='<div class="recipe-card sketch soft"><span class="spin"></span>the coach is thinking…</div>';
  try{
    const ctx=myCoffeeContext();
    const sys=APP_RULES+"\n\nJe bent een ervaren, vriendelijke specialty-barista en koffiecoach. "+
      "Beantwoord de vraag kort en praktisch in het Nederlands, max 5 zinnen, concreet en bruikbaar. "+
      "Gaat het over espresso-maling of dial-in, houd je strikt aan deze regels:\n"+ESPRESSO_RULES+"\n"+
      "Gaat het over filter, dan gelden deze:\n"+FILTER_RULES+"\n"+
      (ctx?("Hieronder staat alles wat de app van deze gebruiker weet: hun bonen (in kast én op), "+
        "brew-geschiedenis, dial-in-pogingen, uitrusting, methodes, eigen recepten en latte art.\n"+
        "Noemt de vraag een boon, een methode of een moment ('gisteren', 'die zak van vorige week'), "+
        "zoek die dan op in de gegevens hieronder en antwoord met de ECHTE cijfers die erbij staan — "+
        "maalstand, dose, opbrengst, tijd, score. Dat is de kern van je nut.\n"+
        "Verder deze volgorde:\n"+
        "1) Kijk EERST naar de bonen die IN KAST staan — dat is wat ze nu echt kunnen zetten.\n"+
        "2) Kijk DAARNA naar de brew-geschiedenis en de dial-in-pogingen: wat deden ze, wat scoorde goed.\n"+
        "3) Noem pas als LAATSTE andere opties als kast en geschiedenis geen antwoord geven.\n"+
        "Een AFGETEKENDE maalstand is gemeten op hun eigen molen en gaat vóór elke vuistregel. "+
        "Ken je hun molen mét bereik, houd een voorgestelde stap dan in verhouding tot die schaal.\n"+
        "Verzin nooit gegevens die er niet staan; staat iets er niet, zeg dat dan.\n\n"+ctx+"\n"):"")+
      "\nVraag: "+q;
    const txt=await askAI([{role:"user",content:sys}],600,'brew');
    a.innerHTML='<div class="recipe-card sketch" style="background:var(--v60)">'+esc(txt).replace(/\n/g,'<br>')+'</div>';
  }catch(e){
    a.innerHTML='<div class="recipe-card sketch soft">couldn’t reach the coach — check your AI key in settings.</div>';
  }
}

function restoreImages(){
  state.methods.forEach(m=>{
    const n=(m.name||'').toLowerCase();
    let def=DEFAULT_METHODS.find(d=>d.id===m.id)||DEFAULT_METHODS.find(d=>n.includes(d.name)||d.name.includes(n));
    if(def&&def.img&&!m.customImg){m.img=def.img;}
  });
  save();toast('✓ drawings restored');go('home');
}

/* ---------------- weekly brewsletter (canvas-kaart) ---------------- */
async function brewsletter(){
  const week=state.brews.filter(b=>Date.now()-b.ts<7*864e5);
  if(!week.length){toast('no brews this week yet — go make one ☕');return;}
  const scored=week.filter(b=>+b.score>0);
  const avg=scored.length?(scored.reduce((a,b)=>a+(+b.score),0)/scored.length):0;
  const perM={};week.forEach(b=>perM[b.method]=(perM[b.method]||0)+1);
  const topM=methodById(Object.entries(perM).sort((a,b)=>b[1]-a[1])[0][0]);
  const best=scored.slice().sort((a,b)=>b.score-a.score)[0];
  const beansUsed=[...new Set(week.map(b=>b.beans).filter(Boolean))];
  let line='';
  if(aiReady()){try{line=(await askAI([{role:"user",content:
    `Schrijf één warme, korte zin (Nederlands, max 14 woorden) als afsluiter van iemands koffieweek: ${week.length} brews, favoriete methode ${topM?topM.name:'?'}, gemiddeld ${avg.toFixed(1)}/10.`}],80,'recap')).trim();}catch(e){}}
  try{await document.fonts.load('700 60px Caveat');await document.fonts.load('30px "Patrick Hand"');}catch(e){}
  const W=900,H=1100,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const paper='#efe9dd',ink='#3a302a',soft='#7a6c5e',accent='#4a3b30';
  x.fillStyle=paper;x.fillRect(0,0,W,H);
  x.strokeStyle=ink;x.lineWidth=5;x.lineCap='round';x.beginPath();
  const jig=(x0,y0,x1,y1)=>{const n=14;for(let i=0;i<=n;i++){const t=i/n;const px=x0+(x1-x0)*t+(Math.random()-.5)*5,py=y0+(y1-y0)*t+(Math.random()-.5)*5;i?x.lineTo(px,py):x.moveTo(px,py);}};
  jig(46,46,W-46,46);jig(W-46,46,W-46,H-46);jig(W-46,H-46,46,H-46);jig(46,H-46,46,46);x.stroke();
  x.textAlign='center';x.fillStyle=ink;x.font='700 84px Caveat';x.fillText('my week in coffee',W/2,170);
  x.fillStyle=soft;x.font='34px "Patrick Hand"';
  x.fillText(new Date(Date.now()-6*864e5).toLocaleDateString('en-GB',{day:'numeric',month:'short'})+' — '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'}),W/2,224);
  const stats=[[String(week.length),'brews'],[avg?avg.toFixed(1)+'/10':'—','avg score'],[topM?topM.name:'—','top method'],[String(beansUsed.length),'beans']];
  stats.forEach((st,i)=>{
    const cx0=i%2?W*0.72:W*0.28,cy0=380+Math.floor(i/2)*190;
    x.fillStyle=ink;x.font='700 96px Caveat';x.fillText(st[0],cx0,cy0);
    x.fillStyle=soft;x.font='30px "Patrick Hand"';x.fillText(st[1],cx0,cy0+44);
  });
  if(best){x.fillStyle=soft;x.font='30px "Patrick Hand"';x.fillText('best cup',W/2,830);
    x.fillStyle=accent;x.font='700 56px Caveat';x.fillText(((best.title&&best.title.trim())||methodById(best.method).name)+' · '+(+best.score).toFixed(1),W/2,886,W-160);}
  if(line){x.fillStyle=ink;x.font='36px "Patrick Hand"';x.fillText(line,W/2,H-140,W-160);}
  x.fillStyle=accent;x.font='700 40px Caveat';x.fillText('lets brew specialty ☕',W/2,H-70);
  const blob=await new Promise(res=>c.toBlob(res,'image/png'));
  const file=new File([blob],'brewsletter.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'my week in coffee'});return;}catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='brewsletter.png';a.click();
  URL.revokeObjectURL(url);toast('brewsletter saved');
}
/* ---------------- taste memory: wat je scores verraden ---------------- */
async function tasteMemory(){
  const el=document.getElementById('tm-body');if(!el)return;
  const rows=state.brews.filter(b=>+b.score>0);
  if(rows.length<3){el.textContent='score a few more brews first — your palate needs at least 3 data points.';return;}
  const group=key=>{const g={};rows.forEach(b=>{const bean=b.beanId?beanById(b.beanId):null;const k=key(b,bean);if(!k)return;(g[k]=g[k]||[]).push(+b.score);});
    return Object.entries(g).filter(([,v])=>v.length>=2).map(([k,v])=>[k,v.reduce((a,c)=>a+c,0)/v.length,v.length]).sort((a,b)=>b[1]-a[1]);};
  const byM=group(b=>methodById(b.method)?.name);
  const byP=group((b,bean)=>bean&&bean.process?bean.process.toLowerCase():null);
  const byO=group((b,bean)=>bean&&bean.origin?bean.origin.split(',')[0].trim():null);
  let html='';
  if(byM.length)html+='methods: '+byM.map(([k,a,n])=>esc(k)+' '+a.toFixed(1)).join(' · ')+'<br>';
  if(byP.length)html+='process: '+byP.map(([k,a])=>esc(k)+' '+a.toFixed(1)).join(' · ')+'<br>';
  if(byO.length)html+='origins: '+byO.map(([k,a])=>esc(k)+' '+a.toFixed(1)).join(' · ')+'<br>';
  el.innerHTML=html||'not enough linked bean data yet.';
  if(aiReady()&&html){
    try{const txt=await askAI([{role:"user",content:
      'Dit zijn iemands gemiddelde koffiescores. Trek er in het Nederlands één vriendelijk, concreet inzicht uit (max 2 zinnen) en één aanrader:\n'+el.innerText}],250,'recap');
      el.innerHTML=html+'<br>✦ '+esc((txt||'').trim()).replace(/\n/g,'<br>');
    }catch(e){}
  }
}
/* ---------------- voice logging ---------------- */
function voiceParse(){
  const t=(document.getElementById('voice-text').value||'').toLowerCase();
  const getal=m=>m?parseFloat(m[1].replace(',','.')):null;
  // eerst op woorden, zodat de volgorde niet uitmaakt
  let dose=getal(t.match(/(\d+[.,]?\d*)\s*(?:gram\s*)?(?:erin|in)\b/));
  let yld =getal(t.match(/(\d+[.,]?\d*)\s*(?:gram\s*)?(?:eruit|uit)\b/));
  let sec =getal(t.match(/(\d+[.,]?\d*)\s*(?:seconden|seconde|sec|s)\b/));
  // wat niet benoemd is, in de gewone volgorde uit de overgebleven getallen halen
  const rest=(t.match(/\d+[.,]?\d*/g)||[]).map(v=>parseFloat(v.replace(',','.')))
    .filter(v=>v!==dose&&v!==yld&&v!==sec);
  if(dose==null)dose=rest.shift()??null;
  if(yld==null) yld =rest.shift()??null;
  if(sec==null) sec =rest.shift()??null;
  if(dose==null&&yld==null&&sec==null){toast('zeg het zo: 18 in, 36 uit, 27 seconden');return;}
  if(dose)setVal('di-dose',dose);
  if(yld)setVal('di-yield',yld);
  if(sec){const inp=document.getElementById('di-time');if(inp){inp.value=String(Math.round(sec));normalizeTime(inp);}}
  diAdvice();toast('✓ ingevuld — kijk de getallen even na');
}
let luisteraar=null;
function micStand(aan){
  const b=document.getElementById('voice-mic');
  if(b)b.setAttribute('aria-pressed',aan?'true':'false');
}
function voiceListen(){
  // tweede keer indrukken zet hem weer uit
  if(luisteraar){try{luisteraar.stop();}catch(e){}luisteraar=null;micStand(false);return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('geen spraakherkenning hier — gebruik de microfoon op je toetsenbord');
    document.getElementById('voice-text').focus();return;}
  try{
    const r=new SR();r.lang='nl-NL';r.interimResults=false;
    r.onresult=e=>{document.getElementById('voice-text').value=e.results[0][0].transcript;voiceParse();};
    r.onerror=()=>toast('niet verstaan — probeer het nog eens');
    // hoe het ook eindigt, de knop gaat altijd terug naar zijn rustkleur
    r.onend=()=>{luisteraar=null;micStand(false);};
    r.start();luisteraar=r;micStand(true);toast('ik luister…');
  }catch(e){luisteraar=null;micStand(false);toast('microfoon niet beschikbaar');}
}
/* ---------------- weer-bewuste suggestie ---------------- */
async function refreshWeather(){
  const el=document.getElementById('weather-line');if(!el)return;
  if(!featOn('weather')){el.style.display='none';return;}
  const cached=JSON.parse(localStorage.getItem('scc_weather')||'null');
  if(cached&&Date.now()-cached.ts<36e5){weatherLine(cached);return;}
  if(!navigator.geolocation){el.style.display='none';return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const{latitude:la,longitude:lo}=pos.coords;
      const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m,precipitation`);
      const d=await res.json();
      const w={ts:Date.now(),t:d.current.temperature_2m,rain:d.current.precipitation>0};
      localStorage.setItem('scc_weather',JSON.stringify(w));weatherLine(w);
    }catch(e){}
  },()=>{el.style.display='none';},{timeout:6000,maximumAge:36e5});
}
function weatherLine(w){
  const el=document.getElementById('weather-line');if(!el)return;
  let tip='';
  if(w.t>=25)tip='iced coffee weather — cold brew or flash-chilled V60?';
  else if(w.rain)tip='rain outside — a slow, cozy moka kind of day.';
  else if(w.t<=8)tip='crisp out there — something warm and syrupy?';
  else tip='fine brewing weather.';
  el.textContent=Math.round(w.t)+'° — '+tip;
  el.style.display='block';
}
/* ---------------- pairing: smart scale via Web Bluetooth ---------------- */
let scaleDevice=null;
function renderPairing(){
  const card=document.getElementById('pair-card');if(!card)return;
  card.style.display=featOn('pairing')?'block':'none';
  const st=document.getElementById('pair-status'),btn=document.getElementById('pair-btn');
  if(!st)return;
  if(!navigator.bluetooth){
    st.textContent='this browser (iPhone Safari included) doesn\'t allow Web Bluetooth — pairing works on Android/Chrome. your gear profiles below still power every AI tip.';
    if(btn)btn.style.opacity=.55;
  }else{
    st.textContent=scaleDevice?('paired: '+(scaleDevice.name||'scale')+' — live weight shows in the shot timer.'):'pair an Acaia/Felicita/generic BLE scale for live weight in the shot timer.';
  }
}
async function pairScale(){
  if(!featOn('pairing'))return;
  if(!navigator.bluetooth){toast('Web Bluetooth isn\'t available on this device');return;}
  try{
    const dev=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:[0x181d,'0000ffe0-0000-1000-8000-00805f9b34fb','0000fff0-0000-1000-8000-00805f9b34fb']});
    scaleDevice=dev;renderPairing();
    const server=await dev.gatt.connect();
    let ch=null;
    for(const sid of [0x181d,'0000ffe0-0000-1000-8000-00805f9b34fb','0000fff0-0000-1000-8000-00805f9b34fb']){
      try{const sv=await server.getPrimaryService(sid);const chars=await sv.getCharacteristics();
        ch=chars.find(c=>c.properties.notify);if(ch)break;}catch(e){}
    }
    if(!ch){toast('connected, but no readable weight channel found');return;}
    await ch.startNotifications();
    ch.addEventListener('characteristicvaluechanged',e=>{
      const dv=e.target.value;let g=null;
      try{
        if(dv.byteLength>=3&&dv.getUint8(0)!==undefined){
          const ascii=new TextDecoder().decode(dv);const m=ascii.match(/-?\d+\.?\d*/);
          if(m)g=parseFloat(m[0]);
          if(g===null||isNaN(g))g=dv.getInt16(1,true)/10;
        }
      }catch(e2){}
      if(g!=null&&!isNaN(g)){
        const el=document.getElementById('e61-live');
        if(el)el.textContent='⚖ live: '+g.toFixed(1)+' g';
        const y=document.getElementById('di-yield');
        if(y&&e61Run)y.value=g.toFixed(1);
      }
    });
    toast('⚖ scale connected');
  }catch(e){if(e.name!=='NotFoundError')toast('pairing failed — try again');}
}

/* ---------------- latte art ---------------- */
/* Melk: volle melk schuimt het best door de verhouding vet/eiwit (±3,5% / 3,4%);
   eiwitten vangen de luchtbellen en houden het schuim overeind. Luchtfase 2-5 s,
   daarna rollen; stoppen tussen 55 en 65 °C. Gieten in drie hoogtes.
   De patronen staan op moeilijkheid, van hartje tot feniks. */

/* Beweeglijnen: elke beweging krijgt een eigen nummer en een pijl.
   Stippellijn = gieten of wiebelen, doorgetrokken lijn = optillen en doortrekken. */
function laRing(x,y,r){
  const n=(a,b)=>(x+r*a).toFixed(1)+' '+(y+r*b).toFixed(1);
  return 'M'+n(0.9,-0.5)+' C'+n(1.3,0.4)+' '+n(0.5,1.25)+' '+n(-0.35,1.05)+
         ' C'+n(-1.25,0.6)+' '+n(-1.3,-0.5)+' '+n(-0.3,-1.1)+
         ' C'+n(0.65,-1.3)+' '+n(1.2,-0.85)+' '+n(1.05,-0.15);
}
function laMv(m){
  let h='<path class="la-mo-bg" d="'+m.d+'"/><path class="'+(m.solid?'la-mo2':'la-mo')+'" d="'+m.d+'"/>';
  if(m.h)h+='<path class="la-mo-bg" d="'+m.h+'"/><path class="la-mo-h" d="'+m.h+'"/>';
  if(m.n){
    const r=laRing(m.x,m.y,6.4);
    h+='<path class="la-num-bg" d="'+r+'"/><path class="la-num" d="'+r+'"/>'+
       '<text class="la-numt" x="'+m.x+'" y="'+(m.y+3.6)+'">'+m.n+'</text>';
  }
  return h;
}
function laMoves(list){return (list||[]).map(laMv).join('');}

const LA_CUP='<path class="la-cup" d="M50 6 C75 6 94 25 94 50 C94 75 75 94 50 94 C25 94 6 75 6 50 C6 25 25 6 50 6"/>';

/* rozet: zeven bladparen, groot bij je toe en kleiner naar de punt */
const LA_LEAF=[
  'M48 86 C32 85 18 77 11 65 C24 72 38 76 48 77',
  'M48 75 C33 74 20 67 14 56 C26 62 39 66 48 67',
  'M48 65 C34 64 22 58 17 48 C28 53 40 57 48 58',
  'M48 56 C36 55 25 50 20 41 C30 46 41 49 48 50',
  'M48 47 C37 46 28 42 24 35 C33 39 42 42 48 43',
  'M48 39 C39 38 31 35 28 29 C35 32 43 35 48 36',
  'M48 32 C41 31 35 29 32 24 C38 26 44 29 48 30',
];
function laRosetta(){
  return LA_LEAF.map(d=>'<path class="la-milk" d="'+d+'"/>').join('')+
    LA_LEAF.map(d=>'<path class="la-milk" d="'+d+'" transform="translate(100,0) scale(-1,1)"/>').join('')+
    '<path class="la-milk" d="M46 16 C47 44 47 70 45 92 C49 94 52 94 55 92 C57 70 57 44 55 16"/>'+
    '<path class="la-milk" d="M50 8 C58 8 63 13 62 19 C61 25 55 30 50 34 C45 30 39 25 38 19 C37 13 42 8 50 8"/>';
}

const LA_PATTERNS=[
  {lvl:0,n:'de plas',en:'monk’s head',
   d:'Nog geen vorm — alleen leren wanneer je zakt. Giet hoog tot de kop halfvol is, zak dan tot de tuit het oppervlak bijna raakt en laat één ronde witte vlek opkomen.',
   tip:'Komt er geen wit boven? Je zit te hoog of je giet te snel.',
   svg:'<path class="la-milk" d="M50 30 C67 30 78 41 78 54 C78 67 65 76 50 76 C35 76 22 67 22 54 C22 41 33 30 50 30"/>'},

  {lvl:0,n:'hartje',en:'heart',
   d:'Dezelfde plas, maar afgemaakt. Als het wit staat, til je de kan iets op en trek je in één beweging door het midden naar je toe — dwars door de vlek tot over de rand.',
   tip:'De punt ontstaat waar je de streep beëindigt. Stoppen vóór het doortrekken maakt er een rondje van.',
   svg:'<path class="la-milk" d="M50 23 C69 23 81 35 80 49 C79 63 66 74 50 91 C34 74 21 63 20 49 C19 35 31 23 50 23"/>'+
       '<path class="la-line" d="M28 41 C37 35 63 35 72 41 M31 52 C39 47 61 47 69 52 M36 62 C42 58 58 58 64 62"/>'},

  {lvl:1,n:'tulp',en:'tulip',
   d:'Drie hartjes op een rij. Giet een vlek, stop, schuif iets naar achter en duw een tweede vlek ín de eerste, dan een derde. Trek er aan het eind in één keer doorheen.',
   tip:'Elke stop moet écht een stop zijn. Blijf je doorgieten, dan lopen de lagen in elkaar.',
   svg:'<path class="la-milk" d="M20 70 C22 62 34 56 50 56 C66 56 78 62 80 70 C76 80 62 90 50 96 C38 90 24 80 20 70"/>'+
       '<path class="la-milk" d="M26 50 C28 44 37 39 50 39 C63 39 72 44 74 50 C70 58 60 65 50 69 C40 65 30 58 26 50"/>'+
       '<path class="la-milk" d="M33 31 C35 25 42 21 50 21 C58 21 65 25 67 31 C64 38 56 43 50 47 C44 43 36 38 33 31"/>'},

  {lvl:1,n:'rozet',en:'rosetta',
   d:'De varen. Zak dicht op het oppervlak en wiebel met je pols heen en weer terwijl je langzaam naar je toe komt. De blaadjes worden vanzelf kleiner. Til op en trek door.',
   tip:'Wiebel klein en snel, en beweeg tegelijk mee — de meeste mensen wiebelen te groot en te traag.',
   svg:laRosetta()},

  {lvl:2,n:'gevleugelde tulp',en:'wing tulip',
   d:'Een tulp waarvan elke laag ook wiebelt. Duw een laag, wiebel hem breed uit, stop, en zet de volgende erin. Zo krijgt elke laag vleugels.',
   tip:'Werkt alleen met echt strakke microfoam — losse melk zakt tussen de lagen weg.',
   svg:'<path class="la-milk" d="M22 72 C24 64 36 58 50 58 C64 58 76 64 78 72 C74 82 62 92 50 97 C38 92 26 82 22 72"/>'+
       '<path class="la-milk" d="M24 68 C14 66 7 60 3 52 C12 58 20 62 26 64 M76 68 C86 66 93 60 97 52 C88 58 80 62 74 64"/>'+
       '<path class="la-milk" d="M29 50 C31 44 39 39 50 39 C61 39 69 44 71 50 C67 58 58 65 50 69 C42 65 33 58 29 50"/>'+
       '<path class="la-milk" d="M30 46 C21 44 15 39 11 32 C19 37 26 41 32 43 M70 46 C79 44 85 39 89 32 C81 37 74 41 68 43"/>'+
       '<path class="la-milk" d="M36 28 C38 22 43 18 50 18 C57 18 62 22 64 28 C61 35 55 40 50 44 C45 40 39 35 36 28"/>'},

  {lvl:2,n:'omgekeerde rozet',en:'reverse rosetta',
   d:'Dezelfde varen, maar je giet van je af in plaats van naar je toe. Je pols moet het spiegelbeeld doen en je ziet minder van wat je maakt.',
   tip:'Begin dicht bij je eigen rand en wiebel weg. De punt komt nu aan jouw kant te liggen.',
   svg:'<g transform="rotate(180 50 50)">'+laRosetta()+'</g>'},

  {lvl:3,n:'zwaan',en:'swan',
   d:'Een rozet als lichaam, dan een dunne hoge sliert als hals, en een klein duwtje voor de kop. De hals giet je hoog en heel langzaam.',
   tip:'De hals is een haarlijn: bijna dichtknijpen en zonder haperen doorgieten.',
   svg:'<path class="la-milk" d="M42 88 C28 86 16 78 10 67 C22 74 34 78 42 79"/>'+
       '<path class="la-milk" d="M43 78 C30 76 19 69 14 59 C25 65 36 69 43 70"/>'+
       '<path class="la-milk" d="M44 68 C32 66 22 60 17 51 C27 56 37 60 44 61"/>'+
       '<path class="la-milk" d="M45 59 C34 57 25 52 21 44 C30 49 39 52 45 53"/>'+
       '<path class="la-milk" d="M46 50 C37 48 30 44 26 37 C34 41 41 44 46 45"/>'+
       '<path class="la-milk" d="M40 92 C44 70 50 50 58 34 C62 36 65 39 66 43 C58 58 50 74 47 93"/>'+
       '<path class="la-milk" d="M64 40 C71 29 77 20 76 14 C75 9 69 9 66 14 C62 22 59 30 57 37 C59 39 62 40 64 40"/>'+
       '<path class="la-milk" d="M74 8 C80 7 84 12 82 17 C79 22 72 21 70 15 C69 10 71 8 74 8"/>'+
       '<path class="la-milk" d="M83 13 C88 12 92 14 94 17 C90 18 86 17 83 16"/>'},

  {lvl:3,n:'feniks',en:'phoenix',
   d:'De zwaan met gespreide vleugels en een staart. Twee rozetten links en rechts van het lichaam, dan pas de hals. Meerdere kanten op wiebelen in één kop.',
   tip:'De lastigste vrije giet die er is. Reken op honderden koppen — en zet je espresso extra strak, want je hebt alle crema nodig.',
   svg:'<path class="la-milk" d="M46 92 C32 90 20 83 14 73 C26 79 38 83 46 84"/>'+
       '<path class="la-milk" d="M47 82 C34 80 23 73 18 64 C29 70 40 74 47 75"/>'+
       '<path class="la-milk" d="M48 72 C36 70 26 64 22 56 C32 61 42 65 48 66"/>'+
       '<path class="la-milk" d="M54 92 C68 90 80 83 86 73 C74 79 62 83 54 84"/>'+
       '<path class="la-milk" d="M53 82 C66 80 77 73 82 64 C71 70 60 74 53 75"/>'+
       '<path class="la-milk" d="M52 72 C64 70 74 64 78 56 C68 61 58 65 52 66"/>'+
       '<path class="la-milk" d="M48 62 C38 60 30 55 26 48 C35 53 43 56 48 57"/>'+
       '<path class="la-milk" d="M52 62 C62 60 70 55 74 48 C65 53 57 56 52 57"/>'+
       '<path class="la-milk" d="M47 95 C48 72 50 54 54 40 C58 42 61 45 62 49 C56 64 51 79 51 96"/>'+
       '<path class="la-milk" d="M56 42 C50 30 42 20 34 15 C29 12 23 14 24 20 C25 25 31 27 36 30 C44 35 51 42 55 48"/>'+
       '<path class="la-milk" d="M26 12 C31 11 35 14 34 19 C32 24 25 24 22 19 C21 14 23 12 26 12"/>'},
];

const LA_MOVES={
  'de plas':[
    {n:1,x:22,y:16,d:'M16 18 C27 30 38 41 46 50',
     h:'M40 40 C44 44 46 47 48 52 C44 51 41 51 37 51'},
  ],
  'hartje':[
    {n:1,x:16,y:14,d:'M16 18 C27 30 38 41 46 50',
     h:'M40 40 C44 44 46 47 48 52 C44 51 41 51 37 51'},
    {n:2,x:72,y:34,solid:true,d:'M50 32 C51 56 49 74 50 92',
     h:'M44 86 C47 90 49 92 50 95 C51 92 53 90 56 86'},
  ],
  'tulp':[
    {n:1,x:16,y:88,d:'M30 84 C30 80 30 78 30 74 M30 62 C30 58 30 56 30 52 M30 42 C30 38 30 36 30 32',
     h:'M26 78 C28 76 29 75 30 72 C31 75 32 76 34 78 M26 56 C28 54 29 53 30 50 C31 53 32 54 34 56 M26 36 C28 34 29 33 30 30 C31 33 32 34 34 36'},
    {n:2,x:74,y:90,solid:true,d:'M50 92 C51 62 49 38 50 14',
     h:'M44 22 C47 18 49 15 50 11 C51 15 53 18 56 22'},
  ],
  'rozet':[
    {n:1,x:17,y:22,d:'M50 34 C40 38 60 43 50 48 C38 52 62 58 50 63 C36 67 64 74 50 79 C38 83 62 88 50 92',
     h:'M44 85 C47 89 49 91 50 94 C51 91 53 89 56 85'},
    {n:2,x:74,y:90,solid:true,d:'M50 94 C51 64 49 38 50 12',
     h:'M44 20 C47 16 49 13 50 9 C51 13 53 16 56 20'},
  ],
  'gevleugelde tulp':[
    {n:1,x:16,y:90,d:'M50 86 C26 82 74 76 50 72 M50 64 C29 60 71 54 50 50 M50 42 C33 38 67 33 50 29',
     h:'M54 68 C52 70 51 71 49 73 C50 70 50 68 49 66 M54 46 C52 48 51 49 49 51 C50 48 50 46 49 44 M54 25 C52 27 51 28 49 30 C50 27 50 25 49 23'},
    {n:2,x:76,y:92,solid:true,d:'M50 93 C51 64 49 38 50 12',
     h:'M44 20 C47 16 49 13 50 9 C51 13 53 16 56 20'},
  ],
  'omgekeerde rozet':[
    {n:1,x:24,y:70,d:'M50 66 C40 62 60 57 50 52 C38 48 62 42 50 37 C36 33 64 26 50 21 C38 17 62 12 50 8',
     h:'M44 15 C47 11 49 9 50 6 C51 9 53 11 56 15'},
    {n:2,x:74,y:12,solid:true,d:'M50 6 C49 36 51 62 50 88',
     h:'M44 81 C47 85 49 88 50 91 C51 88 53 85 56 81'},
  ],
  'zwaan':[
    {n:1,x:20,y:92,d:'M42 86 C24 82 52 76 38 72 C24 68 50 61 38 57 C28 53 46 48 40 44',
     h:'M45 49 C43 47 41 46 39 42 C39 46 38 48 36 50'},
    {n:2,x:44,y:54,d:'M56 48 C63 35 71 23 76 14',
     h:'M70 20 C73 16 75 14 77 11 C77 15 78 18 80 21'},
  ],
  'feniks':[
    {n:1,x:22,y:94,d:'M46 90 C28 86 54 79 42 75 C30 71 52 65 44 61',
     h:'M49 66 C47 64 45 63 43 59 C43 63 42 65 40 67'},
    {n:2,x:78,y:94,d:'M54 90 C72 86 46 79 58 75 C70 71 48 65 56 61',
     h:'M51 66 C53 64 55 63 57 59 C57 63 58 65 60 67'},
    {n:3,x:62,y:52,d:'M52 48 C45 35 36 24 27 16',
     h:'M33 21 C30 19 27 17 25 14 C25 18 24 21 22 23'},
  ],
};

const LA_LEVELS=[
  {n:'beginner',d:'eerst de hoogte leren voelen'},
  {n:'gevorderd',d:'stoppen, stapelen en wiebelen'},
  {n:'ervaren',d:'meerdere bewegingen in één kop'},
  {n:'advanced',d:'jaren, geen weken'},
];
const LA_FIX=[
  {p:'grote bellen in het schuim',c:'te lang lucht getrokken, of de tuit zat te diep tijdens het rollen',f:'kort lucht (2–5 s), daarna de pijp net onder het oppervlak houden zodat de melk blijft draaien'},
  {p:'de melk zakt weg, geen wit',c:'te hoog gegoten, of te snel',f:'zak tot de tuit het oppervlak bijna raakt en giet rustiger'},
  {p:'wit komt te vroeg boven',c:'te laag begonnen — het schuim ligt op de crema in plaats van erdoorheen',f:'begin hoog tot de kop halfvol is, zak dan pas'},
  {p:'het hartje wordt een rondje',c:'gestopt met wiebelen vóór het doortrekken',f:'trek zonder pauze door: de beweging naar voren volgt direct op de wiebel'},
  {p:'schuim en melk scheiden in de kan',c:'te lang gewacht tussen opschuimen en gieten',f:'giet binnen ±20 seconden; anders opnieuw swirlen tot het weer glanst'},
  {p:'niets te zien op de espresso',c:'te weinig of te lichte crema',f:'verse bonen en een strakke shot — zonder crema is er geen doek om op te tekenen'},
];

function renderLatte(){
  const el=document.getElementById('latte-content');if(!el)return;
  let h=`
  <div class="la-intro">Latte art is voor tachtig procent melk en voor twintig procent hand.
    Krijg je de microfoam goed, dan tekent hij bijna vanzelf. Zit er lucht in, dan helpt geen enkele beweging.</div>

  <div class="sect"><span class="hand">The milk</span><span class="sd">waar het mee staat of valt</span></div>
  <div class="lesson sketch soft">
    <p>Volle melk schuimt het best: ongeveer 3,5% vet en 3,4% eiwit. De eiwitten vangen de
      luchtbellen en houden ze overeind, het vet maakt het glanzend en romig. Halfvol werkt
      ook, maar zakt sneller in.</p>
    <p>Plantaardig is lastiger — minder eiwit, minder vet, en per merk anders. Neem een
      barista-versie: daar zitten extra eiwitten en plantaardige olie in die precies dat
      samenspel nabootsen. Haver schuimt traag en heeft langer nodig; amandel is het
      moeilijkst.</p>
    <p>Start koud, met een schone kan. Schenk zoveel in dat de tuit-onderkant net onder staat
      — te vol en je kunt niet meer draaien.</p>
  </div>

  <div class="sect"><span class="hand">Steaming</span><span class="sd">lucht erin, dan glad draaien</span></div>
  ${laSteamBenchHTML()}

  <div class="sect"><span class="hand">Pouring</span><span class="sd">drie hoogtes, één beweging</span></div>
  ${laPourBenchHTML()}

  <div class="sect"><span class="hand">The shapes</span><span class="sd">van makkelijk naar levenswerk</span></div>
  <div class="la-key">
    <span><svg viewBox="0 0 34 12"><path class="la-mo" d="M2 6 C10 4 24 8 32 6"/></svg> gieten of wiebelen</span>
    <span><svg viewBox="0 0 34 12"><path class="la-mo2" d="M2 6 C10 4 24 8 32 6"/></svg> optillen en doortrekken</span>
    <span><svg viewBox="0 0 16 16"><path class="la-num" d="M14.2 3.3 C15.6 7.4 12.6 12 8 11.7 C2.9 11.1 1.4 6.2 4.1 2.5 C7.2 -0.5 12 0.6 13.7 4.6"/></svg> volgorde · de pijl wijst waarheen</span>
  </div>`;

  LA_LEVELS.forEach((lv,i)=>{
    h+=`<div class="la-lvl"><span class="hand">${lv.n}</span><span class="lv-d">${lv.d}</span>
      <span class="lv-dots">${'●'.repeat(i+1)}${'○'.repeat(3-i)}</span></div>`;
    LA_PATTERNS.filter(p=>p.lvl===i).forEach(p=>{
      h+=`<div class="la-pat sketch">
        <div class="lp-draw"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(p.n)}">${LA_CUP}${p.svg}${laMoves(LA_MOVES[p.n])}</svg></div>
        <div class="lp-body">
          <div class="lp-t hand">${esc(p.n)} <span class="lp-en">${esc(p.en)}</span></div>
          <div class="lp-d">${esc(p.d)}</div>
          <div class="lp-tip">${esc(p.tip)}</div>
        </div></div>`;
    });
  });

  h+=`<div class="sect"><span class="hand">When it goes wrong</span><span class="sd">wat je ziet, en wat je eraan doet</span></div>`;
  LA_FIX.forEach(f=>{
    h+=`<div class="la-fix sketch soft">
      <div class="lf-p hand">${esc(f.p)}</div>
      <div class="lf-c">komt door: ${esc(f.c)}</div>
      <div class="lf-f">→ ${esc(f.f)}</div></div>`;
  });

  if(featOn('latteart')){
    h+=`<button class="lesson-link sketch" onclick="learnToGallery()">
      <svg viewBox="0 0 24 24" class="acic"><path d="M4.4 5.8 Q12 5.2 19.8 5.6 M19.5 5.1 Q20.1 12 19.6 18.9 M19.9 18.5 Q12 19.1 4.2 18.6 M4.6 19 Q4 12 4.4 5.2"/><path d="M7.7 14.2 Q10 10.4 12.1 12.6 Q14.5 8.9 16.8 13.2" opacity="0.8"/><path d="M10.3 8.7 Q10.7 10.4 9 10.5 Q7.5 10.4 7.7 8.9 Q8 7.5 9.6 7.7 Q10.3 7.9 10.6 8.4" opacity="0.6"/></svg>
      <span>leg je giet vast bij pouring shapes</span><span class="ll-arr">›</span></button>`;
  }
  el.innerHTML=h;
  laInit();
}

/* kan met stoompijp: de luchtfase en de draaikolk */
function laSteamBenchHTML(){
  return `<div class="la-steam sketch">
    ${laPitcherSVG()}
    <div class="la-scrub">
      <span class="la-clock">0 s</span>
      <input type="range" class="la-sc" min="0" max="40" step="1" value="0"
             aria-label="Seconden opschuimen" oninput="laSteam(this)">
    </div>
    <div class="la-phases">${laPhasesHTML()}</div>
  </div>`;
}
function laPourBenchHTML(){
  return `<div class="la-pour sketch">
    ${laPourSVG()}
    <div class="la-heights" role="group" aria-label="Giethoogte">
      ${LA_HEIGHTS.map((h,i)=>'<button type="button" aria-pressed="'+(i===0?'true':'false')+
        '" onclick="laSetHeight(this,'+i+')">'+esc(h.lab)+'</button>').join('')}
    </div>
    <div class="la-hexpl"></div>
  </div>`;
}
function laPitcherSVG(){
  return `<div class="la-draw"><svg viewBox="0 0 260 175" role="img" aria-label="Melkkan met stoompijp in de melk">
    <path d="M83 42 C107 31 163 31 181 37 C194 33 208 36 217 41"/>
    <path d="M217 41 C207 45 195 46 184 44 C163 52 107 52 83 42" opacity="0.8"/>
    <path d="M87 38 C110 30 158 30 178 34" opacity="0.5"/>
    <path d="M186 46 C189 57 190 67 190 77" opacity="0.5"/>
    <path d="M195 45 C197 56 198 65 198 73" opacity="0.35"/>
    <path d="M83 44 C78 74 75 110 77 138"/>
    <path d="M187 44 C192 74 195 110 193 138"/>
    <path d="M77 138 C82 152 105 159 135 159 C165 159 188 152 193 138"/>
    <path d="M88 148 C106 155 164 155 182 148" opacity="0.45"/>
    <path d="M83 53 C73 52 64 52 58 54"/>
    <path d="M58 54 C50 58 45 65 43 73"/>
    <path d="M43 73 C42 82 45 90 51 96"/>
    <path d="M51 96 C58 102 66 105 74 107"/>
    <path d="M74 107 C78 105 80 101 80 96"/>
    <path d="M66 60 C57 65 53 73 55 82 C57 90 65 97 74 100" opacity="0.5"/>
    <g class="la-wand"><path d="M215 2 C200 22 176 48 152 74"/>
      <path d="M164 60 C170 66 171 72 166 77"/></g>
    <g class="la-swirl la-foam"></g>
    <g class="la-swirl la-vortex" style="display:none">
      <path d="M96 90 C118 98 152 98 174 88" opacity="0.5"/>
      <path d="M108 80 C122 74 148 74 162 79" opacity="0.35"/>
    </g>
    <path class="la-jet la-hiss" d="M152 84 C150 91 154 96 152 103 M166 86 C164 92 168 97 166 104"/>
  </svg></div>`;
}
/* De vier fasen van opschuimen. De schuifbalk loopt van 0 tot 40 seconden en
   zet de tekening in de stand die bij dat moment hoort -- lucht erin zie je de
   schuimlaag groeien, daarna alleen nog draaien.                            */
const LA_PHASES=[
  {t:0, n:'lucht', d:'Tuit n\u00e9t onder het oppervlak. Je hoort een rustige «tsss». Elke tel is ongeveer een centimeter schuim — voor een flat white heb je er weinig nodig.'},
  {t:5, n:'rollen', d:'Zak een centimeter dieper en zet de kan schuin. De draaikolk slaat de grote bellen kapot tot microfoam. Geen geluid meer, alleen draaiing.'},
  {t:28,n:'stop', d:'De kan is te heet om vast te houden: dat is je thermometer, ergens tussen 55 en 65 \u00b0C. Warmer en de melk verliest zijn zoetheid.'},
  {t:34,n:'tik & swirl', d:'Tik de kan op tafel, draai tot de melk glanst als natte verf. Vanaf nu heb je ongeveer twintig seconden voordat schuim en melk scheiden.'},
];
function laPhasesHTML(){
  return LA_PHASES.map((p,i)=>{
    const eind=LA_PHASES[i+1];
    const label=eind?(p.t+'\u2013'+eind.t+' s'):(p.t+' s +');
    return '<div class="la-phase" data-on="0"><div class="pt">'+label+'</div>'+
      '<div><div class="pn">'+esc(p.n)+'</div><div class="pd">'+esc(p.d)+'</div></div></div>';
  }).join('');
}
/* De schuifbalk uitlezen en alles wat meebeweegt op die stand zetten. Alles
   binnen de eigen kaart opzoeken: dezelfde tekening staat ook op de
   gieterij-pagina, en die twee mogen elkaar niet besturen.                  */
function laSteam(sc){
  const box=sc&&sc.closest?sc.closest('.la-steam'):null;if(!box)return;
  const t=+sc.value;
  const q=c=>box.querySelector('.'+c);
  const clk=q('la-clock');if(clk)clk.textContent=t+' s';
  let cur=0;LA_PHASES.forEach((p,i)=>{if(t>=p.t)cur=i;});
  box.querySelectorAll('.la-phase').forEach((el,i)=>el.dataset.on=(i===cur?'1':'0'));
  // de schuimlaag groeit alleen tijdens de luchtfase
  const lucht=Math.min(t,5)/5, y=73-lucht*13;
  const foam=q('la-foam');
  if(foam)foam.innerHTML='<path d="M88 '+y+' C114 '+(y-10)+' 156 '+(y-10)+' 182 '+(y+1)+
    ' C156 '+(y+12)+' 112 '+(y+12)+' 86 '+(y+1)+'"/>';
  const hiss=q('la-hiss');
  if(hiss)hiss.style.display=(t>0&&t<5)?'':'none';
  const vort=q('la-vortex');
  if(vort)vort.style.display=(t>=5&&t<28)?'':'none';
  // de pijp zakt na de luchtfase dieper, en gaat er aan het eind uit
  const wand=q('la-wand');
  if(wand){
    wand.style.transition='transform .35s ease';
    wand.style.transform=(t>=5&&t<28)?'translateY(8px)':(t>=28?'translate(34px,-34px)':'');
  }
}
/* kop met de drie giethoogtes */
function laPourSVG(){
  return `<div class="la-draw"><svg viewBox="0 0 200 150" role="img" aria-label="De kan boven de kop, op de gekozen giethoogte">
    <path d="M30 88 C54 78 102 80 108 90"/>
    <path d="M108 89 C86 97 54 97 30 89" opacity="0.7"/>
    <path d="M31 90 C34 114 46 130 68 133 C92 135 105 124 108 104 C109 97 109 93 108 89"/>
    <path d="M108 98 C126 94 135 105 129 116 C123 123 112 122 106 117"/>
    <path d="M38 143 C68 150 104 149 122 142" opacity="0.45"/>
    <g class="la-pool"><path d="M40 91 C64 83 96 83 106 91 C92 98 56 98 38 91" opacity="0.5"/></g>
    <path class="la-milkline la-stream" d="M68 18 C70 38 67 62 68 86"/>
    <g class="la-jug">
      <path d="M50 4 C68 -1 88 2 92 8"/>
      <path d="M92 8 C89 16 85 23 79 27"/>
      <path d="M50 4 C49 13 53 21 58 26"/>
      <path d="M57 25 C65 29 74 29 80 26"/>
      <path d="M78 24 C83 25 85 28 82 30 C79 31 77 29 77 27"/>
      <path d="M49 8 C39 9 35 18 43 22"/>
      <path d="M52 2 C70 -2 88 1 91 6" opacity="0.5"/>
    </g>
    <g class="la-mark la-ticks"><path d="M84 20 C94 21 102 21 112 20"/></g>
  </svg></div>`;
}
/* De drie giethoogtes. Aantikken verplaatst de kan, verlengt de straal en zet
   de streep op die hoogte -- zo zie je het verschil in plaats van te lezen. */
const LA_HEIGHTS=[
  {lab:'hoog', y:20, jug:0,
   d:'Ongeveer een handbreedte boven de kop, in het diepste punt van de espresso. De melk duikt eronder en mengt zich met de crema in plaats van erop te blijven liggen. Blijf hier tot de kop halfvol is.'},
  {lab:'laag', y:64, jug:46,
   d:'Zak tot de tuit het oppervlak bijna raakt. Nu blijft het schuim bovenop drijven en verschijnt het wit. Alles wat je van je patroon ziet, ontstaat in deze stand.'},
  {lab:'doortrekken', y:46, jug:28,
   d:'Til de kan iets op zodat de straal dun wordt, en trek in \u00e9\u00e9n doorlopende beweging door je vorm heen naar je toe. Geen pauze tussen de wiebel en de streep — daar sneuvelen de meeste hartjes.'},
];
function laSetHeight(btn,i){
  const box=btn&&btn.closest?btn.closest('.la-pour'):null;if(!box)return;
  const h=LA_HEIGHTS[i];if(!h)return;
  const q=c=>box.querySelector('.'+c);
  box.querySelectorAll('.la-heights button').forEach((b,j)=>
    b.setAttribute('aria-pressed',j===i?'true':'false'));
  const ex=q('la-hexpl');if(ex)ex.textContent=h.d;
  const jug=q('la-jug');
  if(jug){jug.style.transition='transform .4s ease';jug.style.transform='translateY('+h.jug+'px)';}
  const st=q('la-stream');
  if(st)st.setAttribute('d','M68 '+(h.y+4)+' C70 '+(h.y+22)+' 67 62 68 86');
  const tk=q('la-ticks');
  if(tk)tk.innerHTML='<path d="M84 '+h.y+' C94 '+(h.y+1)+' 102 '+(h.y+1)+' 112 '+h.y+'"/>';
  const pool=q('la-pool');
  if(pool)pool.style.opacity=(i===0?'0.35':'0.75');
}
// elke tekening op de pagina in zijn beginstand zetten, nadat hij in de DOM staat
function laInit(){
  document.querySelectorAll('.la-steam .la-sc').forEach(sc=>{try{laSteam(sc);}catch(e){}});
  document.querySelectorAll('.la-pour .la-heights button:first-child')
    .forEach(b=>{try{laSetHeight(b,0);}catch(e){}});
}

/* ---------------- cupping session ---------------- */
/* Mechanica volgt SCA-102 (sample preparation & cupping mechanics):
   8,25 g per 150 ml, medium-grof gemalen, water van 93 °C, vier minuten
   staan, korst breken met drie roerbewegingen, afschuimen, slurpen vanaf
   ~71 °C en nog eens terwijl het afkoelt.
   De acht scoresecties volgen de CVA affective assessment (SCA-104, 2024),
   die sinds november 2024 de 100-puntsvorm uit 2004 vervangt. */
const CUP_SECTIONS=[
  {k:'fragrance', n:'geur',          e:'fragrance', d:'de droge maling, vóór het water'},
  {k:'aroma',     n:'aroma',         e:'aroma',     d:'de natte geur, precies bij het breken'},
  {k:'flavour',   n:'smaak',         e:'flavour',   d:'wat je proeft als je slurpt'},
  {k:'aftertaste',n:'nasmaak',       e:'aftertaste',d:'wat achterblijft, en hoe lang'},
  {k:'acidity',   n:'zuur',          e:'acidity',   d:'de helderheid — de kwaliteit, niet de hoeveelheid'},
  {k:'sweetness', n:'zoet',          e:'sweetness', d:'rijpheid, de volheid van de suiker'},
  {k:'mouthfeel', n:'mondgevoel',    e:'mouthfeel', d:'gewicht en textuur op je tong'},
  {k:'overall',   n:'totaalindruk',  e:'overall',   d:'je eigen indruk, als geheel'},
];
const CUP_STEPS=[
  {t:null,n:'ruik de droge maling',   d:'neus in de kom vóór het water. dit is fragrance — scoor het nu, het komt niet meer terug.'},
  {t:0,   n:'giet alle kommen tegelijk vol', d:'93 °C, recht op de maling, tot de rand. start de klok.'},
  {t:240, n:'breek de korst',         d:'neus vlak boven de kom, drie keer roeren, diep inademen. dit is aroma.'},
  {t:270, n:'schuim af',              d:'twee lepels, van weerszijden over het oppervlak. schuim en drijvende maling eraf.'},
  {t:480, n:'eerste slurp · ~71 °C',  d:'slurp hard, zodat het verneveld over je hele tong slaat. smaak, zuur en mondgevoel lezen hier het best.'},
  {t:720, n:'proef opnieuw, lauwer',  d:'zoet en eventuele fouten komen pas nu boven. nasmaak en totaalindruk horen bij deze ronde.'},
];
const CUP_LABELS=['A','B','C','D'];
let cup={picks:[],order:[],stage:0,scores:{},notes:{},size:200,t0:0,timer:null,el:0,open:false};

function cupReset(){
  cupStopClock();
  cup={picks:[],order:[],stage:0,scores:{},notes:{},size:cup.size||200,t0:0,timer:null,el:0,open:false};
}
function cupDose(){return Math.round(cup.size*8.25/150*10)/10;}
function cupFmt(s){s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}

/* --- de tekening: kom met korst, lepel en stoom --- */
function cupBowlSVG(){
  return `<div class="cup-draw"><svg viewBox="0 0 240 150">
    <g class="cup-steam">
      <path d="M92 34 C86 26 96 21 90 11"/>
      <path d="M120 30 C114 21 124 16 118 6"/>
      <path d="M148 34 C142 26 152 21 146 11"/>
    </g>
    <g id="cup-crust">
      <path d="M62 60 C73 44 95 37 120 37 C147 37 169 45 180 59"/>
      <path d="M180 58 C161 72 78 72 61 58" opacity="0.8"/>
      <path d="M74 53 C79 49 84 52 89 47 M97 45 C102 41 107 44 112 40 M122 42 C127 38 132 41 137 38 M147 44 C152 40 157 44 162 41 M84 62 C89 58 94 61 99 57 M110 60 C115 56 120 59 125 56 M136 61 C141 57 146 60 151 57 M162 55 C167 51 171 54 175 51" opacity="0.5"/>
    </g>
    <g id="cup-liquid" style="display:none">
      <path d="M64 62 C84 55 156 55 177 61 C156 70 82 70 63 61"/>
      <path d="M80 64 C100 68 140 68 160 63" opacity="0.4"/>
    </g>
    <g class="cup-rim">
      <path d="M60 54 C78 44 162 44 180 54 C188 62 176 74 120 78 C64 79 52 70 57 59 C59 55 64 52 71 49"/>
      <path d="M66 51 C88 42 156 43 178 52 C186 61 170 73 118 77 C66 77 50 68 56 57" opacity="0.6"/>
      <path d="M55 63 C60 92 74 112 96 120 M185 63 C180 92 166 112 144 120 M93 118 C112 125 131 125 148 117"/>
      <path d="M72 128 C110 135 153 134 174 126" opacity="0.5"/>
      <path d="M78 131 C112 137 150 136 168 130" opacity="0.3"/>
    </g>
    <g id="cup-spoon">
      <path d="M199 20 C188 33 173 48 159 61"/>
      <path d="M159 58 C167 55 172 62 166 69 C158 73 149 69 152 62 C154 58 156 57 160 59"/>
    </g>
  </svg></div>`;
}

/* --- uitleg: wat cupping is en waarom het zo gaat --- */
function cupExplainHTML(){
  return `<button class="cup-ex-t" onclick="cup.open=!cup.open;renderCupping()">
      <svg viewBox="0 0 24 24" class="acic"><path d="M11.5 3.4 Q17.2 3.2 17.8 8.4 Q18.2 11.6 15.7 13.8 Q15 14.4 14.9 16.3 M15 16 Q12 16.6 9.1 16.1 M9.3 16.3 Q9 14.2 8.3 13.6 Q5.8 11.4 6.2 8.2 Q6.8 3.3 12.5 3.6"/><path d="M9.7 18.4 Q12 18.9 14.3 18.4 M10.3 20.5 Q12 21 13.8 20.5" opacity="0.7"/></svg>
      <span>How cupping works</span><span class="ll-arr">${cup.open?'▾':'▸'}</span></button>
    <div class="cup-ex ${cup.open?'':'hidden'}">
      <div class="lesson sketch soft"><h3>Why cup?</h3>
        <p>Bij cupping zet je koffie zonder techniek. Geen filter, geen druk, geen giettechniek — alleen maling, water en tijd, voor elke kom exact hetzelfde. Daardoor is het enige verschil dat je proeft de boon zelf. Dat is precies waarom de hele keten het zo doet: de boer, de brander en de inkoper vergelijken langs dezelfde lat.</p>
        <p>Thuis is de winst dubbel. Je leert je bonen kennen, én je leert je eigen tong kennen. Blind proeven haalt het etiket weg: geen prijs, geen herkomst, geen verwachting. Wat overblijft is wat je werkelijk lekker vindt.</p></div>
      <div class="lesson sketch"><h3>The recipe (SCA-102)</h3>
        <p>De verhouding is <b>8,25 g per 150 ml</b> — ongeveer 1:18. Maal <b>medium-grof</b>, iets grover dan filter, en voor alle kommen op precies dezelfde stand. Water van <b>93 °C</b>, vers en zacht. Weeg alles, ook het water: de hele oefening staat of valt met gelijke omstandigheden.</p>
        <p>Professioneel zet men vijf kommen per koffie, om te zien of de partij overal hetzelfde smaakt. Thuis is één kom per boon genoeg; twee als je wilt controleren of je eigen werk consistent is.</p></div>
      <div class="lesson sketch soft"><h3>How it runs</h3>
        <p><b>Voor het water</b> ruik je de droge maling. Dat is <i>fragrance</i>, en die is daarna weg.</p>
        <p><b>0:00</b> giet je alle kommen tegelijk vol en start je de klok. De koffie drijft boven en vormt een korst.</p>
        <p><b>4:00</b> breek je de korst: neus vlak boven de kom, drie keer roeren, diep inademen. Die stoot geur is <i>aroma</i>, het mooiste moment van de sessie.</p>
        <p><b>Daarna</b> schuim je af met twee lepels, van weerszijden over het oppervlak.</p>
        <p><b>Vanaf ±8 minuten</b>, rond 71 °C, slurp je. Hard, zodat de koffie verneveld over je hele tong slaat. Proef opnieuw terwijl het afkoelt: zuur en zoet laten zich op verschillende temperaturen zien, en fouten komen pas lauw boven.</p></div>
      <div class="lesson sketch"><h3>Scoring</h3>
        <p>De SCA verving in november 2024 het oude 100-puntsformulier uit 2004 door de <b>Coffee Value Assessment</b>. Die splitst beschrijven (wát je proeft) van waarderen (hoe goed je het vindt). Dit scherm volgt het waarderende deel: acht secties, elk van 1 tot 9, waarbij 5 neutraal is — niet lekker, niet vies.</p>
        <p>De officiële omrekening naar honderd punten doet de SCA met een eigen rekenhulp; <b>80 punten of meer</b> heet specialty, 85+ excellent, 90+ outstanding. Het cijfer dat je hier ziet is je eigen voorkeursscore, geen SCA-keuring. Voor thuis is dat ook het enige dat telt: welke boon wil jij morgen weer.</p></div>
    </div>`;
}

function renderCupping(){
  const el=document.getElementById('cupping-body');if(!el)return;
  const beans=state.beans.filter(b=>b.inStock!==false);

  /* --- 0. opzet --- */
  if(cup.stage===0){
    let h=cupExplainHTML();
    if(beans.length<2){
      h+='<div class="empty-note">je hebt twee bonen in huis nodig om te cuppen.<br>voeg nog een zak toe en kom terug.</div>';
      el.innerHTML=h;return;
    }
    h+=`<div class="k" style="margin:18px 2px 6px">kies twee tot vier bonen</div><div class="link-pick">`+
      beans.map(b=>`<button class="lp ${cup.picks.includes(b.id)?'sel':''}" onclick="cupPick('${b.id}')">${esc(b.name)}</button>`).join('')+'</div>';
    h+=`<div class="cup-recipe sketch">
        <div class="cr-h hand">Your recipe</div>
        <div class="cr-row"><span>komformaat</span><span class="cr-in"><input type="number" min="100" max="400" step="10" value="${cup.size}" oninput="cupSize(this.value)"> ml</span></div>
        <div class="cr-row"><span>koffie per kom</span><b>${String(cupDose()).replace('.',',')} g</b></div>
        <div class="cr-row"><span>water</span><b>${cup.size} ml · 93 °C</b></div>
        <div class="cr-row"><span>maling</span><b>medium-grof</b></div>
        <div class="cr-row"><span>kommen te vullen</span><b>${cup.picks.length||'—'}</b></div>
        <div class="cr-note">8,25 g per 150 ml — de SCA-verhouding, omgerekend naar jouw kom. dezelfde maling, hetzelfde water en dezelfde tijd voor elke kom.</div>
      </div>`;
    h+=cup.picks.length>=2
      ? '<button class="save-btn" style="margin-top:14px" onclick="cupStart()">start de sessie →</button>'
      : '<div class="cup-hint">kies er minstens twee.</div>';
    el.innerHTML=h;return;
  }

  /* --- 1. het verloop, met klok --- */
  if(cup.stage===1){
    const t=cup.el;
    let h=`<div class="cup-clock sketch">
        ${cupBowlSVG()}
        <div class="cc-row">
          <div class="cc-t hand" id="cup-t">${cupFmt(t)}</div>
          <button class="save-btn cc-btn" onclick="cupToggleClock()">${cup.timer?'pauze':(t?'verder':'giet &amp; start')}</button>
        </div>
      </div><div class="cup-proto">`;
    CUP_STEPS.forEach((s,i)=>{
      const started=s.t===null?true:(cup.timer||t>0)&&t>=s.t;
      const next=CUP_STEPS[i+1];
      const now=started&&(!next||next.t===null||t<next.t);
      h+=`<div class="cup-step ${now?'now':''} ${started&&!now?'past':''}">
        <div class="cs-t hand">${s.t===null?'vooraf':cupFmt(s.t)}</div>
        <div class="cs-b"><div class="cs-n hand">${s.n}</div><div class="cs-d">${s.d}</div></div></div>`;
    });
    h+=`</div><button class="save-btn" onclick="cupToScore()">scoor de kommen →</button>
        <button class="profile-btn" onclick="cupReset();renderCupping()">opnieuw beginnen</button>`;
    el.innerHTML=h;cupPaint();return;
  }

  /* --- 2. scoren, blind --- */
  if(cup.stage===2){
    let h='<div class="cup-hint" style="text-align:left;margin:0 0 12px">scoor elke kom vóór je onthult. 5 is neutraal — niet lekker, niet vies.</div>';
    cup.order.forEach((id,i)=>{
      const L=CUP_LABELS[i], sc=cup.scores[L]||{};
      const tot=CUP_SECTIONS.reduce((a,s)=>a+(sc[s.k]||5),0);
      h+=`<div class="cup-card sketch">
        <div class="cc-h"><span class="cc-l hand">kom ${L}</span><span class="cc-tot hand" id="cup-tot-${L}">${tot}<span class="cc-of">/72</span></span></div>`;
      CUP_SECTIONS.forEach(s=>{
        const v=sc[s.k]||5;
        h+=`<div class="cup-sec">
          <div class="cs-lab"><span class="hand">${s.n}</span><span class="cs-en">${s.e}</span><span class="cs-hint">${s.d}</span></div>
          <div class="cs-in"><input type="range" min="1" max="9" step="1" value="${v}" oninput="cupScore('${L}','${s.k}',this.value)">
            <span class="cs-v hand" id="cup-v-${L}-${s.k}">${v}</span></div></div>`;
      });
      h+=`<textarea class="cup-note" placeholder="wat proef je? schrijf het op zoals het bij je opkomt…" oninput="cup.notes['${L}']=this.value">${esc(cup.notes[L]||'')}</textarea>
        </div>`;
    });
    h+='<button class="save-btn" onclick="cupReveal()">onthul wat wat was →</button>';
    el.innerHTML=h;return;
  }

  /* --- 3. onthulling --- */
  const rows=cup.order.map((id,i)=>{
    const L=CUP_LABELS[i], b=beanById(id), sc=cup.scores[L]||{};
    const tot=CUP_SECTIONS.reduce((a,s)=>a+(sc[s.k]||5),0);
    return {L,b,sc,tot,ten:Math.round(tot/72*100)/10};
  }).sort((a,b)=>b.tot-a.tot);
  const top=rows[0], tie=rows.length>1&&rows[1].tot===top.tot;
  let h=`<div class="settings-card sketch" style="background:var(--v60)">
      <div class="set-t hand">The reveal</div>
      <div class="cup-rev">`;
  rows.forEach(r=>{
    h+=`<div class="cr-line"><span class="cr-l hand">${r.L}</span>
      <span class="cr-n">${esc(r.b?r.b.name:'?')}</span>
      <span class="cr-s hand">${r.tot}<span class="cc-of">/72</span></span></div>`;
    if(cup.notes[r.L])h+=`<div class="cr-note-b">${esc(cup.notes[r.L])}</div>`;
  });
  h+=`</div><div class="set-d" style="margin-top:8px">${tie
      ? 'gelijkspel — je tong kon ze niet uit elkaar houden.'
      : 'je tong kiest <b style="font-weight:400;color:var(--ink)">'+esc(top.b?top.b.name:'?')+'</b>'}</div></div>`;
  /* per sectie waar het verschil zat */
  if(rows.length>1){
    h+='<div class="cup-card sketch"><div class="cc-h"><span class="cc-l hand">Where they differed</span></div>';
    const byLabel=cup.order.map((id,i)=>({L:CUP_LABELS[i],b:beanById(id),sc:cup.scores[CUP_LABELS[i]]||{}}));
    CUP_SECTIONS.forEach(s=>{
      const vals=byLabel.map(r=>(r.sc[s.k]||5));
      const hi=Math.max(...vals), lo=Math.min(...vals);
      const win=byLabel[vals.indexOf(hi)];
      h+=`<div class="cup-diff ${hi-lo>=2?'big':''}"><span class="hand">${s.n}</span>
        <span class="cd-v">${byLabel.map((r,i)=>r.L+' '+vals[i]).join(' · ')}</span>
        <span class="cd-w">${hi===lo?'gelijk':esc((win.b&&win.b.name)||'?')}</span></div>`;
    });
    h+='</div>';
  }
  h+=`<button class="profile-btn" onclick="cupSaveNotes()"><svg viewBox="0 0 24 24" class="acic btn-svg"><path d="M4.8 4.2 Q11 3.8 16.6 4.4 Q18.3 6.2 19.8 8.1 M19.6 7.7 Q20.1 13.5 19.7 19.7 M19.9 19.3 Q12 20.1 4.4 19.5 M4.7 19.8 Q4 12 4.9 4 M7.9 4.4 Q7.8 7 7.9 8.7 Q11.8 9.2 15.5 8.6 Q15.7 6.6 15.6 4.5"/><path d="M7.9 19.5 Q7.8 15 8.1 12.8 Q12 12.4 16.1 12.9 M16 12.6 Q16.3 16.1 16.2 19.5" opacity="0.7"/></svg> bewaar het resultaat bij elke boon</button>
    <button class="profile-btn" onclick="cupReset();renderCupping()">nieuwe sessie</button>`;
  el.innerHTML=h;
}

function cupPick(id){
  const i=cup.picks.indexOf(id);
  if(i>=0)cup.picks.splice(i,1);
  else if(cup.picks.length<4)cup.picks.push(id);
  else toast('vier kommen is het meeste dat je tong aankan');
  renderCupping();
}
function cupSize(v){const n=parseInt(v,10);if(n>=100&&n<=400){cup.size=n;const d=document.querySelector('.cup-recipe');if(d)renderCupping();}}
function cupStart(){
  cup.order=cup.picks.slice().sort(()=>Math.random()-0.5);   // blind: volgorde door elkaar
  cup.scores={};cup.notes={};cup.el=0;cup.stage=1;renderCupping();
}
function cupToggleClock(){cup.timer?cupStopClock():cupStartClock();renderCupping();}
function cupStartClock(){
  cup.t0=Date.now()-cup.el*1000;
  cup.timer=setInterval(()=>{
    cup.el=(Date.now()-cup.t0)/1000;
    const t=document.getElementById('cup-t');if(t)t.textContent=cupFmt(cup.el);
    cupPaint();
    const cur=CUP_STEPS.filter(s=>s.t!==null&&Math.abs(cup.el-s.t)<0.5)[0];
    if(cur&&cur.t>0)toast(cur.n);
  },250);
}
function cupStopClock(){if(cup.timer){clearInterval(cup.timer);cup.timer=null;}}
/* korst tot 4:00, daarna vloeistof; de lepel duikt in bij het breken */
function cupPaint(){
  const cr=document.getElementById('cup-crust'), lq=document.getElementById('cup-liquid'), sp=document.getElementById('cup-spoon');
  if(!cr||!lq)return;
  const broken=cup.el>=240;
  cr.style.display=broken?'none':'';
  lq.style.display=broken?'':'none';
  if(sp)sp.style.transform=(cup.el>=240&&cup.el<270)?'rotate(-14deg)':'';
  document.querySelectorAll('.cup-step').forEach((n,i)=>{
    const s=CUP_STEPS[i],next=CUP_STEPS[i+1];
    const started=s.t===null?true:cup.el>=s.t;
    const now=started&&(!next||next.t===null||cup.el<next.t);
    n.classList.toggle('now',now);n.classList.toggle('past',started&&!now);
  });
}
function cupToScore(){cupStopClock();cup.stage=2;renderCupping();}
function cupScore(L,k,v){
  if(!cup.scores[L])cup.scores[L]={};
  cup.scores[L][k]=+v;
  const el=document.getElementById('cup-v-'+L+'-'+k);if(el)el.textContent=v;
  const tot=CUP_SECTIONS.reduce((a,s)=>a+(cup.scores[L][s.k]||5),0);
  const t=document.getElementById('cup-tot-'+L);if(t)t.innerHTML=tot+'<span class="cc-of">/72</span>';
}
function cupReveal(){cupStopClock();cup.stage=3;renderCupping();}
function cupSaveNotes(){
  const d=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'});
  const rows=cup.order.map((id,i)=>({b:beanById(id),L:CUP_LABELS[i],
    tot:CUP_SECTIONS.reduce((a,s)=>a+((cup.scores[CUP_LABELS[i]]||{})[s.k]||5),0),n:cup.notes[CUP_LABELS[i]]||''}));
  const field=rows.map(r=>(r.b?r.b.name:'?')+' '+r.tot).join(' · ');
  rows.forEach(r=>{
    if(!r.b)return;
    r.b.notes=((r.b.notes||'')+`\ncupping ${d}: ${r.tot}/72 (blind ${r.L}) — ${field}${r.n?'\n  '+r.n:''}`).trim();
  });
  save();toast('✓ bewaard bij elke boon');
}
/* ---------------- latte-art gallery + AI coach ---------------- */
async function addLatteShot(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{
    const img=await fileToDataURL(file,520,false);
    if(!Array.isArray(state.latteShots))state.latteShots=[];
    const nieuw={id:uid(),ts:Date.now(),img,fb:'',shape:gaShape||''};
    state.latteShots.unshift(nieuw);
    latteOpen[nieuw.id]=true;   // je eigen nieuwe giet zie je meteen, niet dichtgeklapt
    save();renderGallery();toast('✓ giet toegevoegd');
  }catch(e){toast('kon de foto niet laden');}
  ev.target.value='';
}
/* Welke vorm was je van plan? Dat is de helft van bruikbare feedback: zonder
   het doel kan de coach alleen zeggen wat hij ziet, niet of het gelukt is.  */
let gaShape=null;
function gaPickShape(naam){
  gaShape=(gaShape===naam)?null:naam;
  renderGaShapePick();
}
function renderGaShapePick(){
  const el=document.getElementById('ga-shapepick');if(!el)return;
  el.innerHTML=LA_PATTERNS.map(p=>
    '<button type="button" aria-pressed="'+(gaShape===p.n?'true':'false')+
    '" onclick="gaPickShape(\''+p.n.replace(/'/g,"\\'")+'\')">'+
    '<svg viewBox="0 0 100 100" role="img" aria-label="'+esc(p.n)+'">'+LA_CUP+p.svg+'</svg>'+
    '<span class="sp-n">'+esc(p.n)+'</span></button>').join('');
}
// de uitleg boven de galerij: dezelfde twee bewegende tekeningen als bij learn
function renderGaHelp(){
  const el=document.getElementById('ga-help-body');if(!el)return;
  if(el.dataset.vol==='1')return;          // maar één keer opbouwen
  el.innerHTML='<div class="set-d" style="margin:8px 0 10px">de melk bepaalt of het lukt; '+
    'de hoogte bepaalt wat je ziet. Schuif door het opschuimen en tik de drie giethoogtes aan.</div>'+
    laSteamBenchHTML()+laPourBenchHTML();
  el.dataset.vol='1';
  laInit();
}
// welke gieten staan open? dichtgeklapt is de standaard -- zo blijft een lange
// reeks pogingen overzichtelijk in plaats van een eindeloze scroll van foto's
let latteOpen={};
function latteToggle(id){latteOpen[id]=!latteOpen[id];renderGallery();}
function renderGallery(){
  const el=document.getElementById('gallery-list');if(!el)return;
  const shots=state.latteShots||[];
  if(!shots.length){el.innerHTML='<div class="empty-note">nog geen gieten.<br>fotografeer je volgende flat white en zie jezelf vooruitgaan.</div>';return;}
  el.innerHTML=shots.map(sh=>{
    const open=!!latteOpen[sh.id];
    const kop=timeAgo(sh.ts);
    if(!open)return `<div class="settings-card sketch soft">
      <div class="lshot-row" onclick="latteToggle('${sh.id}')">
        <img class="lshot-thumb" src="${esc(BrewSecurity.imageUrl(sh.img))}">
        <div class="lshot-main">
          <div class="lshot-when">${esc(kop)}${sh.shape?' <span class="lshot-shape">· '+esc(sh.shape)+'</span>':''}</div>
          <div class="lshot-fb">${sh.fb?'✦ '+esc(sh.fb):'no feedback yet'}</div>
        </div>
        <span class="bchev">▸</span>
      </div>
    </div>`;
    return `<div class="settings-card sketch soft">
      <div class="lshot-row" onclick="latteToggle('${sh.id}')">
        <div class="lshot-main"><div class="lshot-when">${esc(kop)}${sh.shape?' <span class="lshot-shape">· '+esc(sh.shape)+'</span>':''}</div></div>
        <span class="bchev">▾</span>
      </div>
      <img src="${esc(BrewSecurity.imageUrl(sh.img))}" style="width:100%;border-radius:14px;border:2px solid var(--line);margin-top:8px">
      ${sh.fb?'<div class="set-d" style="margin-top:6px;color:var(--ink)">✦ '+esc(sh.fb).replace(/\n/g,'<br>')+'</div>':''}
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="recipe-btn ai-only ${aiReady()?'':'hidden'}" style="margin-top:0;flex:1" onclick="latteCoach('${sh.id}')">✦ laat de coach kijken</button>
        <button class="icon-btn" title="delete" onclick="delLatteShot('${sh.id}')">${ICO.del}</button>
      </div>
    </div>`;
  }).join('');
}
function delLatteShot(id){
  if(!confirm('deze giet verwijderen?'))return;
  state.latteShots=(state.latteShots||[]).filter(x=>x.id!==id);save();renderGallery();
}
async function latteCoach(id){
  const sh=(state.latteShots||[]).find(x=>x.id===id);if(!sh)return;
  if(!aiReady()){toast('turn on AI in profile first');return;}
  toast('✦ de coach kijkt mee…');
  try{
    const b64=sh.img.split(',')[1];
    const media=(sh.img.match(/^data:([^;]+)/)||[])[1]||'image/jpeg';
    // wist je wat je wilde gieten? dan gaat het over dat doel, niet over "een vorm"
    const pat=sh.shape?LA_PATTERNS.find(p=>p.n===sh.shape):null;
    const doel=sh.shape
      ? ' De barista probeerde bewust een "'+sh.shape+'"'+(pat?' ('+pat.en+')':'')+' te gieten.'+
        (pat?' Zo hoort die te ontstaan: '+pat.d+(pat.tip?' Bekend struikelblok: '+pat.tip:''):'')+
        ' Beoordeel het resultaat tegen dat doel: is de vorm herkenbaar geworden, en zo niet, waar ging het mis?'
      : ' De barista gaf niet op welke vorm het moest worden; beschrijf dan wat je ziet.';
    const prompt='Dit is een foto van latte art van een thuisbarista.'+doel+
      ' Geef vriendelijke, concrete feedback in het Nederlands (max 4 zinnen): wat gaat goed, en \u00e9\u00e9n duidelijk verbeterpunt over melktextuur, giethoogte of trekbeweging.';
    const txt=await askAI([{role:"user",content:[{type:"image",source:{type:"base64",media_type:media,data:b64}},{type:"text",text:prompt}]}],400,'pour');
    sh.fb=(txt||'').trim();latteOpen[sh.id]=true;save();renderGallery();
  }catch(e){toast("couldn't reach the coach");}
}

/* ---------------- shortcuts: start vanaf je beginscherm ---------------- */
function renderShortcuts(){
  const card=document.getElementById('shortcut-card');if(!card)return;
  card.style.display=featOn('shortcuts')?'block':'none';
  if(!featOn('shortcuts'))return;
  const base=location.origin+location.pathname;
  document.getElementById('shortcut-list').innerHTML=
    state.methods.filter(m=>m.on).map(m=>`<button class="profile-btn ic-btn" onclick="copyShortcut('${m.id}')">${iconHTML(m,22)} copy link: start ${esc(m.name)}</button>`).join('')+
    `<button class="profile-btn ic-btn" onclick="copyShortcut('surprise')"><svg viewBox="0 0 24 24" class="acic"><path d="M4.7 9.7 Q4.6 16.2 8 18.3 Q12 20.6 16.2 18.1 Q19.4 16.1 19.3 9.6 M4.3 10.2 Q12 8.3 19.7 10.1 M19.1 10.9 Q22.4 10.7 22.3 13.5 Q22.2 16.4 18.8 16.1 M3 21.4 Q12 22.1 21.1 21.3"/><path d="M8.9 5.9 Q8.1 7.6 9.5 8.8 M12.4 5.1 Q11.4 6.9 12.8 8.1 M15.7 5.9 Q14.8 7.6 16.2 8.8" opacity="0.7"/></svg> copy link: surprise me</button>`;
}
function copyShortcut(id){
  const base=location.origin+location.pathname;
  const url=id==='surprise'?(base+'?quickbrew=1'):(base+'?brew='+encodeURIComponent(id));
  (navigator.clipboard&&navigator.clipboard.writeText)?
    navigator.clipboard.writeText(url).then(()=>toast('link copied — paste it in an iOS Shortcut'),()=>prompt('copy this link:',url))
    :prompt('copy this link:',url);
}
/* ---------------- share card: brew als tekenkaart-afbeelding ---------------- */
async function shareCard(id){
  const b=state.brews.find(x=>x.id===id);if(!b)return;
  const m=methodById(b.method);const fam=methodFamily(b.method);
  try{await document.fonts.load('700 60px Caveat');await document.fonts.load('30px "Patrick Hand"');}catch(e){}
  const W=900,H=1100,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d');
  const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#3a302a';
  const paper='#efe9dd',ink='#3a302a',soft='#7a6c5e',accent='#4a3b30';
  x.fillStyle=paper;x.fillRect(0,0,W,H);
  // wiebelige kaderlijn
  x.strokeStyle=ink;x.lineWidth=5;x.lineCap='round';x.beginPath();
  const jig=(x0,y0,x1,y1)=>{const n=14;for(let i=0;i<=n;i++){const t=i/n,px=x0+(x1-x0)*t+(Math.random()-.5)*5,py=y0+(y1-y0)*t+(Math.random()-.5)*5;i?x.lineTo(px,py):x.moveTo(px,py);}};
  jig(46,46,W-46,46);jig(W-46,46,W-46,H-46);jig(W-46,H-46,46,H-46);jig(46,H-46,46,46);x.stroke();
  x.fillStyle=ink;x.font='700 84px Caveat';x.textAlign='center';
  x.fillText((b.title&&b.title.trim())?b.title:m.name,W/2,180,W-160);
  x.fillStyle=soft;x.font='36px "Patrick Hand"';
  x.fillText([m.name,b.beans].filter(Boolean).join(' · '),W/2,236,W-160);
  // grote koffieboon-tekening
  x.save();x.translate(W/2,430);x.rotate(.32);x.strokeStyle=accent;x.lineWidth=6;
  x.beginPath();x.ellipse(0,0,105,150,0,0,Math.PI*2);x.stroke();
  x.beginPath();x.moveTo(-52,-120);x.quadraticCurveTo(40,-20,52,124);x.stroke();x.restore();
  const rows=[['dose in',b.dose?b.dose+' g':'—'],[fam==='espresso'?'yield out':'yield out',b.yield?b.yield+' g':'—'],
    [fam==='espresso'?'shot time':'time',b.time||'—'],['grind',b.grind||'—'],['temp',b.temp?b.temp+'°C':'—'],
    ['ratio',b.ratio?'1:'+(+b.ratio).toFixed(1):'—']];
  x.textAlign='left';
  rows.forEach((r2,i)=>{
    const cx0=i%2?W/2+40:120,cy0=680+Math.floor(i/2)*110;
    x.fillStyle=soft;x.font='30px "Patrick Hand"';x.fillText(r2[0],cx0,cy0);
    x.fillStyle=ink;x.font='700 58px Caveat';x.fillText(String(r2[1]),cx0,cy0+56);
  });
  x.textAlign='center';x.fillStyle=soft;x.font='30px "Patrick Hand"';
  const tags=asArr(b.tags).length?asArr(b.tags).join(' · '):'';
  if(tags)x.fillText(tags,W/2,H-120,W-200);
  x.font='700 40px Caveat';x.fillStyle=accent;
  x.fillText('lets brew specialty ☕',W/2,H-70);
  const blob=await new Promise(res=>c.toBlob(res,'image/png'));
  const file=new File([blob],'brew-card.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'my brew'});return;}catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='brew-card.png';a.click();
  URL.revokeObjectURL(url);toast('card saved — share it on');
}
function savePushUrl(){
  const v=document.getElementById('push-url').value.trim();
  localStorage.setItem('scc_push_url',v);
  toast(v?'✓ push server saved':'push server cleared');
}

/* ---------------- bonenkeuzehulp: van het land tot in je kop ----------------
   Een getekende wereldkaart die drie niveaus diep gaat: werelddeel, land,
   streek. Op elk niveau staat waar het bekend om staat en welke processen er
   gebruikt worden -- je kiest niet alleen een zak, je snapt achteraf ook
   waarom hij smaakt zoals hij smaakt.

   De landvormen zijn ruwe omtrekken op echte lengte- en breedtegraden. Geen
   atlas, wel herkenbaar. De hoogte is 1,9 keer uitgerekt, anders wordt de
   koffiegordel een streepje op een telefoon.                              */
const BP_REK=1.9;
const bpX=lon=>lon, bpY=lat=>-lat*BP_REK;

const BP_LANDEN=[
 {id:'elsalvador',deel:'amerika',naam:'El Salvador',pts:[[-90.1,14.1],[-87.7,14],[-87.7,13.15],[-89.7,13.15],[-90.1,13.8]]},
 {id:'jamaica',deel:'amerika',naam:'Jamaica',pts:[[-78.4,18.5],[-76.2,18.2],[-76.2,17.7],[-78.4,18]]},
 {id:'dominicaans',deel:'amerika',naam:'Dominicaanse Rep.',pts:[[-72,19.9],[-68.3,19],[-68.5,18.2],[-71.7,17.6],[-72,18.6]]},
 {id:'hawai',deel:'amerika',naam:'Hawaï',pts:[[-156.1,20],[-155,20.3],[-154.8,19.5],[-155.6,18.9],[-156.05,19.5]]},
 {id:'malawi',deel:'afrika',naam:'Malawi',pts:[[33.2,-9.6],[33,-12],[32.7,-13.6],[34.5,-16.2],[35.4,-16],[35.9,-14.3],[34.6,-11.6],[34,-9.5]]},
 {id:'zambia',deel:'afrika',naam:'Zambia',pts:[[22,-16.2],[25.3,-17.8],[28.9,-16],[30.4,-15.6],[33.7,-12.5],[33,-9.6],[30.5,-8.3],[29,-13.4],[24.5,-13],[22,-13]]},
 {id:'zimbabwe',deel:'afrika',naam:'Zimbabwe',pts:[[25.2,-17.8],[26,-19],[27.7,-20.1],[29.4,-22.2],[31.3,-22.4],[32.5,-21.3],[32.9,-19.7],[33,-16.6],[30.4,-15.6],[28.9,-16]]},
 {id:'kameroen',deel:'afrika',naam:'Kameroen',pts:[[8.5,4.6],[9.9,2.2],[16.1,2.3],[15,7.6],[15.7,9.9],[14.1,13.1],[13.2,12.4],[12.8,8.7],[10.7,6.9],[8.8,5.8]]},
 {id:'ivoorkust',deel:'afrika',naam:'Ivoorkust',pts:[[-8.6,10.5],[-6.2,10.7],[-2.5,9.5],[-2.8,5.1],[-4.6,5.1],[-7.5,4.4],[-8,6.4],[-8.6,7.7]]},
 {id:'yunnan',deel:'azie',naam:'Yunnan (China)',pts:[[97.5,25.5],[99,28.2],[100.2,29.2],[103,28.5],[106,27.5],[105.9,24.5],[104,22.5],[101.6,21.2],[99,22.5],[97.6,23.5]]},
 {id:'thailand',deel:'azie',naam:'Thailand',pts:[[97.4,18.6],[99.1,20.4],[100.5,20.3],[101.2,18.2],[103,18.4],[105.6,16],[103.6,14],[102.4,13.6],[100,13.4],[99.2,11],[98.3,8.2],[100.3,6.6],[101.9,6],[100.8,9.5],[99,14.5],[98.2,16.6]]},
 {id:'laos',deel:'azie',naam:'Laos',pts:[[100.1,20.3],[101.2,21.4],[102.1,22.5],[104,22.5],[104.8,20.4],[105.2,19],[106.5,17],[107.6,15.9],[107.4,14.5],[105.5,14],[105,15],[104,15.9],[102.1,18.1],[101.1,18.3],[100.6,19.5]]},
 {id:'myanmar',deel:'azie',naam:'Myanmar',pts:[[92.2,21.3],[93,23.7],[95,26.6],[97.4,28.5],[98.8,27.5],[98.7,24.1],[99.6,22.1],[100.2,21.5],[101.2,21.4],[100.2,20.4],[99,19.7],[98.5,16.8],[98.2,14.9],[99,13],[98.6,10],[97.6,16],[95.4,15.8],[94.2,16],[94,18],[93,19.5]]},
 {id:'filipijnen',deel:'azie',naam:'Filipijnen',pts:[[120,18.5],[121.9,18.3],[122.3,16.5],[121.5,14.2],[123,13],[124.2,11.5],[125.5,9.8],[126.5,7.2],[125.4,5.6],[123,6.5],[121.9,7],[122,9.5],[120.3,11.5],[119.9,14],[119.8,16.5]]},
 {id:'timor',deel:'azie',naam:'Oost-Timor',pts:[[124,-9.2],[125.1,-8.1],[126.6,-8.4],[127.3,-8.4],[126.9,-8.9],[125,-9.5]]},
 {id:'bali',deel:'azie',naam:'Bali',pts:[[114.45,-8.15],[115.7,-8.1],[115.6,-8.75],[114.55,-8.8]]},
 {id:'flores',deel:'azie',naam:'Flores',pts:[[119.9,-8.5],[121,-8.25],[122.4,-8.35],[123,-8.5],[122.3,-8.85],[120.8,-8.75],[119.9,-8.8]]},
 {id:'mexico',deel:'amerika',naam:'Mexico',pts:[[-117,32],[-109,31],[-97,26],[-97,18],[-91,18.5],[-88,21],[-87,17],[-94,16],[-96,15.5],[-104,19],[-106,23],[-112,29]]},
 {id:'guatemala',deel:'amerika',naam:'Guatemala',pts:[[-92.2,17.8],[-89,17.8],[-88.2,15.9],[-89.2,14],[-92.2,14.5]]},
 {id:'honduras',deel:'amerika',naam:'Honduras',pts:[[-89.3,16],[-83.2,15],[-83.4,13],[-87.8,13.2],[-89.2,14.4]]},
 {id:'nicaragua',deel:'amerika',naam:'Nicaragua',pts:[[-87.7,13.2],[-83.1,15],[-83.5,11],[-85.7,11],[-87.7,12.9]]},
 {id:'costarica',deel:'amerika',naam:'Costa Rica',pts:[[-85.9,11],[-82.6,9.6],[-82.9,8.1],[-85.6,9.8]]},
 {id:'panama',deel:'amerika',naam:'Panama',pts:[[-83,8.9],[-81.5,9.2],[-79,9.6],[-77.3,8.7],[-78.5,7.3],[-81,8],[-83,8.2]]},
 {id:'colombia',deel:'amerika',naam:'Colombia',pts:[[-77.4,8.5],[-71.5,12],[-67,6],[-67.3,1.2],[-69.5,-4],[-74,-2],[-78,0.5],[-79,2]]},
 {id:'ecuador',deel:'amerika',naam:'Ecuador',pts:[[-80.9,1.4],[-75.2,0.5],[-75.2,-4.5],[-80.2,-4.4]]},
 {id:'peru',deel:'amerika',naam:'Peru',pts:[[-81.3,-4.2],[-75,-4],[-70,-9.5],[-69,-13],[-68.9,-17],[-71.4,-17.7],[-76,-14],[-79,-8]]},
 {id:'bolivia',deel:'amerika',naam:'Bolivia',pts:[[-69.5,-10.5],[-65.3,-9.7],[-58.2,-19.9],[-62.3,-22],[-67.2,-22],[-69.6,-18]]},
 {id:'brazilie',deel:'amerika',naam:'Brazilië',pts:[[-73.9,-7.3],[-69.5,-1],[-64,1.9],[-60,4.5],[-51,4.2],[-49.9,-1],[-44,-2.5],[-38,-5],[-35,-9],[-39,-17],[-40,-21],[-48,-25],[-53,-33],[-57,-30],[-57.6,-25],[-54.6,-24],[-58,-20],[-58,-16],[-60,-15],[-65,-11],[-70,-11]]},
 {id:'ethiopie',deel:'afrika',naam:'Ethiopië',pts:[[34,8],[33,10],[36,14.5],[39,14.9],[43,12],[48,8],[44.5,4.9],[41,3.9],[36,4.5],[35,7]]},
 {id:'kenia',deel:'afrika',naam:'Kenia',pts:[[33.9,-1],[35,4.6],[41,3.9],[41.9,-1],[40.1,-2.5],[39,-4.7],[37.6,-3]]},
 {id:'tanzania',deel:'afrika',naam:'Tanzania',pts:[[29.6,-4.5],[30.8,-1],[34,-1],[37.6,-3],[39.5,-6.8],[40.4,-10.4],[37.5,-11.7],[33,-9.5],[30.7,-8.2],[29.4,-6.5]]},
 {id:'oeganda',deel:'afrika',naam:'Oeganda',pts:[[29.6,-1],[34,-1],[34.4,3.5],[31,3.8],[29.7,1.4]]},
 {id:'rwanda',deel:'afrika',naam:'Rwanda',pts:[[28.9,-1.1],[30.5,-1.1],[30.8,-2.4],[29,-2.8]]},
 {id:'burundi',deel:'afrika',naam:'Burundi',pts:[[29,-2.8],[30.8,-2.4],[30.6,-4.4],[29.2,-4.4]]},
 {id:'congo',deel:'afrika',naam:'DR Congo',pts:[[13,-5],[17,-8],[22,-11],[27,-11.5],[28.4,-13],[28.7,-4.6],[28.9,1.2],[27,5],[18,5],[16,-2]]},
 {id:'jemen',deel:'afrika',naam:'Jemen',pts:[[42.6,12.6],[52.2,15.5],[52.2,17.8],[44.5,17.5],[42.8,13.8]]},
 {id:'india',deel:'azie',naam:'India',pts:[[68.5,23.5],[72.8,19],[73.5,15],[77,8.1],[80.3,13],[84,18],[89,22],[88,26],[80,28],[74,31],[70,27]]},
 {id:'vietnam',deel:'azie',naam:'Vietnam',pts:[[102.2,22.3],[105.8,23.3],[108,21],[109.5,15],[109.3,11],[106.5,9.5],[104.9,10.5],[107,16],[105,20]]},
 {id:'sumatra',deel:'azie',naam:'Sumatra',pts:[[95.2,5.5],[97.5,5.2],[106,-5.5],[105,-6.2],[100.5,-2.5],[95.9,2.5]]},
 {id:'java',deel:'azie',naam:'Java',pts:[[105.5,-5.9],[114.5,-8],[114.4,-8.8],[106,-7.4]]},
 {id:'sulawesi',deel:'azie',naam:'Sulawesi',pts:[[119,1.5],[120.5,1],[121,-2],[124.5,-1.8],[125,-5.5],[120.5,-5.6],[119.5,-3],[118.8,-1]]},
 {id:'papoea',deel:'azie',naam:'Papoea-Nieuw-Guinea',pts:[[141,-2.7],[147,-6],[150,-10.5],[143,-9],[141,-6]]},
];
const BP_LAND=Object.fromEntries(BP_LANDEN.map(l=>[l.id,l]));
/* Groot eerst, klein daarna: anders verdwijnen Rwanda en Burundi onder de
   buurman die om ze heen ligt. */
function bpVlak(l){
  const xs=l.pts.map(p=>p[0]), ys=l.pts.map(p=>p[1]);
  return (Math.max(...xs)-Math.min(...xs))*(Math.max(...ys)-Math.min(...ys));
}
const BP_VOLGORDE=BP_LANDEN.slice().sort((a,b)=>bpVlak(b)-bpVlak(a));

/* De rest van de wereld, ruw en lichtgrijs. Puur om de kaart herkenbaar te
   maken: zonder Noord-Amerika en Euraziƫ eromheen zweven de koffielanden los
   in het niets en zie je niet waar je bent. */
const BP_ACHTER=[
 [[-168,66],[-140,70],[-95,70],[-80,62],[-64,47],[-70,42],[-75,35],[-81,25],[-97,26],[-104,19],[-106,23],[-117,32],[-125,40],[-125,49],[-135,58],[-160,60]],
 [[-17,15],[0,16],[15,32],[32,31],[35,23],[43,12],[51,12],[42,-2],[40,-16],[35,-24],[25,-34],[18,-34],[12,-18],[9,4],[-8,4]],
 [[-10,36],[3,52],[12,55],[30,60],[60,70],[100,75],[140,70],[135,55],[125,45],[122,31],[110,20],[100,10],[95,16],[92,22],[80,30],[70,35],[60,25],[52,30],[45,40],[36,36],[20,38],[10,37]],
 [[113,-22],[122,-18],[130,-12],[142,-11],[147,-20],[153,-28],[150,-38],[140,-38],[130,-32],[115,-34]],
];
/* Een paar landen zijn zo klein dat hun naam over de buren valt. Die duwen we
   een stukje weg; de maat staat in kaart-eenheden, dus hij schaalt mee. */
const BP_LBLPLEK={rwanda:[-5,-2.5],burundi:[-5,3],oeganda:[-1,-4],congo:[-5,3],
  tanzania:[2,3],kenia:[2.5,0],jemen:[2,-2],
  guatemala:[-4,-2.5],honduras:[4,-3.5],nicaragua:[5,1.5],costarica:[-6,3.5],
  panama:[6,4.5],ecuador:[-5,0.5],peru:[-2,2.5],colombia:[1,-1],
  java:[-6,3],sulawesi:[6,0.5],vietnam:[3,2],papoea:[0,3],
  elsalvador:[-6,2.5],jamaica:[0,4],dominicaans:[4,6],hawai:[0,3.5],mexico:[-9,4],
  malawi:[3,0],zambia:[-2,2],zimbabwe:[0,3],kameroen:[-4,0],ivoorkust:[0,3],
  laos:[3.5,-1],thailand:[-3.5,1],myanmar:[-3.5,0],yunnan:[0,-3.5],
  timor:[0,3],bali:[-3,-2.5],flores:[0,3],filipijnen:[4,-1]};

const BP_DELEN={
 amerika:{naam:'Midden- & Zuid-Amerika',kort:'Amerika',
  bekend:'De vertrouwde kant van de kaart. Nootachtig, chocolade, karamel, en een zuur dat zacht blijft — dit is waar de meeste mensen koffie leren drinken.',
  waarom:'Bijna alles wordt hier <b>washed</b> verwerkt: er is water genoeg, en de vruchtlaag gaat er meteen af. Dat geeft een schone, voorspelbare kop waarin je de streek proeft en niet het proces.',
  proc:'washed overheerst · honey vooral in Costa Rica en El Salvador · natural in opkomst in Brazilië',
  hoogte:'900–2200 m'},
 afrika:{naam:'Oost-Afrika & het Arabisch schiereiland',kort:'Afrika',
  bekend:'Hier komt koffie vandaan, en dat proef je. Bloemen, thee, citrus, rode bessen — een levendig zuur dat je op filter meteen herkent.',
  waarom:'Veel kleine boeren leveren aan een gezamenlijk wasstation, en die stations bepalen het proces. Ethiopië en Kenia zijn daardoor bekend om hun strakke <b>washed</b> lots, terwijl <b>natural</b> juist het fruit naar voren haalt.',
  proc:'washed en natural naast elkaar · honey zeldzaam · Jemen bijna altijd natural',
  hoogte:'1400–2300 m'},
 azie:{naam:'Zuidoost-Azië & Oceanië',kort:'Azië',
  bekend:'De aardse kant. Kruiden, tabak, cederhout, donkere chocolade — weinig zuur, veel <b>body</b>. Een kop die vult in plaats van prikkelt.',
  waarom:'Het klimaat is te vochtig om koffie in één keer droog te krijgen. Daarom bedachten ze hier <b>wet hulling</b> (giling basah): de bonen gaan half droog uit hun vlies. Dat geeft die typische aardse, zware smaak die je nergens anders vindt.',
  proc:'wet hulling in Indonesië · washed in India en Papoea · natural veel in Vietnam',
  hoogte:'800–1800 m'},
};

const BP_INFO={
 elsalvador:{hoogte:'1100–1800 m',var:'Bourbon, Pacas, Pacamara',
  bekend:'Het kleinste koffieland van Midden-Amerika, en het meest eigenzinnige. Waar de rest overstapte op nieuwe variëteiten hielden zij vast aan oude Bourbon, en hier werd Pacamara gekweekt — een reuzenboon die op cuppingtafels alles overstemt.',
  smaak:['karamel','rode appel','cacao','sinaasappel'],proc:['washed','honey','natural'],
  streken:[
   {n:'Apaneca-Ilamatepec',h:'1200–1800 m',ll:[-89.85,13.83],v:'Bourbon, Pacamara',t:'De vulkaanketen in het westen, het hoogste en bekendste gebied. Zoet en rond, met karamel en rode appel.',s:['karamel','rode appel','amandel']},
   {n:'Chalatenango',h:'1200–1600 m',ll:[-89,13.95],v:'Bourbon, Pacas',t:'Het noorden, tegen Honduras aan. Iets helderder en fruitiger, met citrus en steenfruit.',s:['sinaasappel','perzik','honing']},
   {n:'Tecapa-Chinameca',h:'1100–1500 m',ll:[-88.5,13.5],v:'Bourbon, Pacamara',t:'De oostelijke vulkanen, warm en vruchtbaar. Voller en chocoladiger, met een zachte afdronk.',s:['cacao','pruim','noot']}]},
 jamaica:{hoogte:'900–1700 m',var:'Typica (Jamaica Blue Mountain)',
  bekend:'Blue Mountain: een van de duurste en meest vervalste namen in koffie. Echt gecertificeerd komt in houten vaten en heeft een zeldzaam zachte, gebalanceerde kop — weinig zuur, veel zoet, geen scherpe randen.',
  smaak:['melkchocolade','noot','honing','zachte citrus'],proc:['washed'],
  streken:[
   {n:'Blue Mountain',h:'900–1700 m',ll:[-76.6,18.05],v:'Typica',t:'De oostelijke bergen boven Kingston, waar de mist bijna elke dag hangt. Traag rijpen, en daardoor die beroemde zachtheid: chocolade, noot en een heel milde zuurgraad.',s:['melkchocolade','hazelnoot','honing']},
   {n:'High Mountain',h:'500–900 m',ll:[-77.3,18.15],v:'Typica',t:'Lager en westelijker, buiten het beschermde gebied. Dezelfde stijl maar steviger van body, en een stuk betaalbaarder.',s:['cacao','karamel','noot']}]},
 dominicaans:{hoogte:'800–1600 m',var:'Typica, Caturra, Catuai',
  bekend:'Koffie sinds de achttiende eeuw, maar bijna alles wordt op het eiland zelf opgedronken — daardoor kom je het buiten de Cariben weinig tegen. Zacht, zoet en nootachtig, met een lage zuurgraad.',
  smaak:['cacao','noot','karamel','rijp fruit'],proc:['washed','natural'],
  streken:[
   {n:'Barahona',h:'800–1400 m',ll:[-71.1,18.25],v:'Typica',t:'Het zuidwesten, het hoogst en het bekendst. Voller en complexer dan de rest van het eiland, met cacao en rood fruit.',s:['cacao','rood fruit','karamel']},
   {n:'Jarabacoa',h:'900–1600 m',ll:[-70.63,19.12],v:'Caturra, Typica',t:'In de Cordillera Central, koel en groen. Zoet en zacht, met noot en een lichte citrus.',s:['hazelnoot','honing','citrus']},
   {n:'Ocoa',h:'800–1300 m',ll:[-70.5,18.55],v:'Typica, Catuai',t:'Kleine boeren in de bergen boven de zuidkust. Rond en mild, een makkelijke alledaagse kop.',s:['melkchocolade','amandel','appel']}]},
 hawai:{hoogte:'150–900 m',var:'Kona Typica, Caturra, Geisha',
  bekend:'Het enige koffiegebied van de Verenigde Staten, en een uitzondering op alle regels: hier groeit koffie láág, op jonge vulkanische grond met een wolkendek dat elke middag als vanzelf opkomt. Duur, want alles wordt met de hand geplukt tegen Amerikaans loon.',
  smaak:['macadamia','melkchocolade','bruine suiker','zachte citrus'],proc:['washed','natural'],
  streken:[
   {n:'Kona',h:'150–800 m',ll:[-155.9,19.6],v:'Kona Typica',t:'De westhelling van de Hualalai en Mauna Loa, een strook van dertig kilometer. Zacht en zoet, met macadamia en melkchocolade — bijna geen scherpte.',s:['macadamia','melkchocolade','bruine suiker']},
   {n:'Ka\'u',h:'500–900 m',ll:[-155.6,19.1],v:'Typica, Caturra',t:'Het zuiden, ooit suikerriet en nu koffie. Iets levendiger dan Kona, met meer fruit en citrus.',s:['sinaasappel','honing','cacao']}]},
 malawi:{hoogte:'1200–2000 m',var:'Geisha, Catimor, Agaro, Mundo Novo',
  bekend:'Klein en zacht, met een verrassing: Malawi was een van de eerste landen buiten Panama waar Geisha commercieel geplant werd. De rest is mild en thee-achtig, met een fijne body.',
  smaak:['zwarte thee','citroen','honing','amandel'],proc:['washed','natural'],
  streken:[
   {n:'Misuku Hills',h:'1700–2000 m',ll:[33.6,-9.9],v:'Geisha, Agaro',t:'Het uiterste noorden, tegen Tanzania aan en het hoogst van het land. Helder en bloemig, met citroen en zwarte thee.',s:['citroen','zwarte thee','jasmijn']},
   {n:'Viphya-noord',h:'1200–1700 m',ll:[33.8,-11.8],v:'Catimor, Geisha',t:'Het beboste plateau in het midden. Zachter en zoeter, met honing en steenfruit.',s:['honing','perzik','amandel']},
   {n:'Thyolo-Mulanje',h:'900–1300 m',ll:[35,-15.9],v:'Mundo Novo, Catimor',t:'Het zuiden, rond de Mulanje-berg, waar ook de thee groeit. Voller en nootachtiger.',s:['noot','cacao','zwarte thee']}]},
 zambia:{hoogte:'1200–1700 m',var:'Bourbon, Catimor, Java',
  bekend:'Grote landgoederen in het afgelegen noorden, dicht bij het Tanganyikameer. Lang nauwelijks te krijgen door de afstand tot een haven, maar wat eruit komt is schoon, zoet en verrassend fruitig.',
  smaak:['rood fruit','bruine suiker','citrus','cacao'],proc:['washed','natural'],
  streken:[
   {n:'Kasama',h:'1300–1700 m',ll:[31.2,-10.2],v:'Bourbon, Java',t:'Het hart van de Zambiaanse koffie, op het noordelijke plateau. Zoet en helder, met rood fruit en bruine suiker.',s:['rood fruit','bruine suiker','sinaasappel']},
   {n:'Isoka',h:'1400–1700 m',ll:[32.6,-10.1],v:'Bourbon, Catimor',t:'Tegen de Tanzaniaanse grens, iets hoger en koeler. Steviger van zuur, met citrus en cacao.',s:['citrus','cacao','pruim']}]},
 zimbabwe:{hoogte:'1000–1700 m',var:'Catimor, SL28, Caturra',
  bekend:'De koffie kwam bijna helemaal tot stilstand na de landhervormingen, en wordt sinds een paar jaar met kleine boeren weer opgebouwd. Wie hem vindt, krijgt een kop met stevig zuur en veel karakter.',
  smaak:['zwarte bes','sinaasappel','cacao','bruine suiker'],proc:['washed'],
  streken:[
   {n:'Chipinge',h:'1100–1700 m',ll:[32.6,-20.2],v:'SL28, Catimor',t:'De oostelijke hooglanden tegen Mozambique aan, met veel regen. Het bekendste van Zimbabwe: fel zuur, zwarte bes en een volle body.',s:['zwarte bes','sinaasappel','bruine suiker']},
   {n:'Honde Valley',h:'1000–1500 m',ll:[32.8,-18.6],v:'Catimor, Caturra',t:'Noordelijker, in de schaduw van de Nyanga-bergen. Zachter en zoeter, met cacao en steenfruit.',s:['cacao','perzik','honing']}]},
 kameroen:{hoogte:'1000–2000 m',var:'Java, Typica, Bourbon, robusta',
  bekend:'Arabica op de vulkanische hooglanden in het westen, robusta in het zuiden. Lang alleen bulk, maar de laatste jaren komen er coöperaties op die hun lots apart houden — en die zijn de moeite waard.',
  smaak:['cacao','specerij','rood fruit','noot'],proc:['washed','natural'],
  streken:[
   {n:'Bamboutos',h:'1400–2000 m',ll:[10.2,5.6],v:'Java, Typica',t:'Het westelijke hoogland, op oude vulkaangrond. Vol en zoet, met cacao en rood fruit.',s:['cacao','rood fruit','karamel']},
   {n:'Mount Cameroon',h:'1000–1500 m',ll:[9.3,4.3],v:'Typica, Bourbon',t:'Aan de voet van de actieve vulkaan, waar het het natst is van heel Afrika. Kruidig en vol, met een zachte zuurgraad.',s:['specerij','noot','pruim']},
   {n:'Boyo (Noordwest)',h:'1500–2000 m',ll:[10.3,6.2],v:'Java, Bourbon',t:'De hoogste percelen van het land, bij Belo en Fundong. Helderder en fruitiger dan de rest van Kameroen.',s:['citrus','rood fruit','honing']}]},
 ivoorkust:{hoogte:'300–700 m',var:'robusta (Kouilou), Arabusta',
  bekend:'Ooit de grootste robusta-producent ter wereld en nog altijd een zwaargewicht. Niet het land voor een heldere filterkop, maar zonder Ivoorkust zou de helft van de espressoblends anders smaken.',
  smaak:['donkere chocolade','hout','tabak','noot'],proc:['natural','washed'],
  streken:[
   {n:'Man',h:'400–700 m',ll:[-7.55,7.4],v:'robusta',t:'De westelijke bergen, het hoogste stukje van het land. Hier zit de meeste smaak: minder hout, meer cacao.',s:['cacao','noot','specerij']},
   {n:'Daloa',h:'250–450 m',ll:[-6.45,6.87],v:'robusta',t:'Het centrale bosgebied, de grootste productiestreek. Zwaar en vol, met tabak en donkere chocolade.',s:['tabak','donkere chocolade','hout']},
   {n:'Abengourou',h:'200–400 m',ll:[-3.5,6.7],v:'robusta, Arabusta',t:'Het oosten, tegen Ghana aan. Iets zachter, en waar geëxperimenteerd wordt met betere verwerking.',s:['noot','cacao','gedroogd fruit']}]},
 yunnan:{hoogte:'1000–1900 m',var:'Catimor, Typica, Bourbon, Geisha',
  bekend:'In dertig jaar van niets naar het grootste koffiegebied van Azië na Vietnam. Lang alleen volume voor de grote ketens, maar sinds kort komen er echt goede washed en natural lots uit — vaak nog een koopje, omdat de naam nog moet landen.',
  smaak:['bruine suiker','zwarte thee','pruim','noot'],proc:['washed','natural','honey'],
  streken:[
   {n:'Pu\'er',h:'1000–1600 m',ll:[100.97,22.82],v:'Catimor, Typica',t:'De grootste streek, ook bekend van de thee. Zoet en rond, met bruine suiker en gedroogd fruit.',s:['bruine suiker','pruim','noot']},
   {n:'Baoshan',h:'1200–1900 m',ll:[99.17,25.11],v:'Bourbon, Typica',t:'Het noorden, hoger en koeler, met de oudste aanplant van China. De helderste kop van Yunnan: zwarte thee en citrus.',s:['zwarte thee','citrus','honing']},
   {n:'Dehong',h:'1000–1500 m',ll:[98.58,24.44],v:'Catimor, Geisha',t:'Tegen Myanmar aan, warm en nat. Voller en fruitiger, en waar de meeste experimenten gebeuren.',s:['rood fruit','cacao','karamel']},
   {n:'Lincang',h:'1100–1700 m',ll:[100.09,23.88],v:'Catimor',t:'Tussen Pu\'er en Baoshan in, met steile percelen. Nootachtig en zacht, met een lange zoete afdronk.',s:['amandel','melkchocolade','honing']}]},
 thailand:{hoogte:'800–1600 m',var:'Catimor, Typica, Bourbon, Geisha',
  bekend:'Koffie kwam hier als vervanging voor papaver, in een koninklijk project om de opiumteelt te stoppen. Dat is gelukt: de noordelijke bergen leveren nu heldere, zoete arabica, en Doi Chaang is een naam op zich geworden.',
  smaak:['honing','sinaasappel','cacao','jasmijn'],proc:['washed','honey','natural'],
  streken:[
   {n:'Doi Chaang',h:'1200–1600 m',ll:[99.6,19.6],v:'Catimor, Typica',t:'Een dorp in Chiang Rai dat zijn eigen merk werd, met de boeren als mede-eigenaar. Zoet en gebalanceerd, met honing en sinaasappel.',s:['honing','sinaasappel','cacao']},
   {n:'Chiang Mai',h:'1000–1600 m',ll:[98.99,18.79],v:'Typica, Bourbon',t:'De bergen rond Doi Inthanon, het hoogste punt van Thailand. Helderder en bloemiger, met jasmijn en citrus.',s:['jasmijn','citroen','honing']},
   {n:'Nan',h:'900–1400 m',ll:[100.77,18.78],v:'Catimor, Geisha',t:'Het oosten, tegen Laos aan en pas net in beeld. Fruitig en zacht, met veel natural en honey.',s:['perzik','rood fruit','karamel']}]},
 laos:{hoogte:'1000–1350 m',var:'Typica, Bourbon, Catimor, robusta',
  bekend:'Bijna alles komt van één plek: het Bolaven-plateau, een oude vulkaankrater in het zuiden waar de Fransen de koffie brachten. Rijke rode grond, koele nachten, en een zoete kop met een volle body.',
  smaak:['cacao','karamel','gedroogd fruit','noot'],proc:['washed','natural','honey'],
  streken:[
   {n:'Bolaven-plateau',h:'1000–1350 m',ll:[106.3,15.1],v:'Typica, Bourbon, Catimor',t:'De krater zelf, rond Paksong. Diepe vulkanische grond en veel regen. Zoet en vol, met cacao en gedroogd fruit — en steeds meer mooie naturals.',s:['cacao','gedroogd fruit','karamel']},
   {n:'Xieng Khouang',h:'1000–1300 m',ll:[103.4,19.4],v:'Typica, Catimor',t:'Het noordelijke hoogland, klein en jong. Helderder en lichter van body dan het zuiden.',s:['citrus','honing','amandel']}]},
 myanmar:{hoogte:'1000–1600 m',var:'S795, Catuai, Caturra, Java',
  bekend:'Pas sinds een jaar of tien op de specialty-kaart, en het ging hard: kleine boeren in de Shan-heuvels leerden in korte tijd washed en natural verwerken. Bloemig, zoet en helder — verrassend dicht bij Ethiopië.',
  smaak:['jasmijn','sinaasappel','honing','zwarte thee'],proc:['washed','natural','honey'],
  streken:[
   {n:'Ywangan (Shan)',h:'1200–1600 m',ll:[96.5,21.2],v:'S795, Catuai',t:'Kalksteenheuvels op grote hoogte, met koele nachten. Het bloemigste van Myanmar: jasmijn, sinaasappel en een lange zoete afdronk.',s:['jasmijn','sinaasappel','honing']},
   {n:'Pyin Oo Lwin',h:'1000–1300 m',ll:[96.5,22.03],v:'Caturra, Catuai',t:'Een oude Britse bergplaats bij Mandalay, waar de eerste plantages stonden. Ronder en nootachtiger.',s:['amandel','cacao','karamel']},
   {n:'Chin Hills',h:'1200–1600 m',ll:[93.6,22.6],v:'Java, S795',t:'Het afgelegen westen, tegen India aan. Klein, hoog en kruidig, met donker fruit.',s:['specerij','pruim','zwarte thee']}]},
 filipijnen:{hoogte:'900–1800 m',var:'Typica, Bourbon, Excelsa, Liberica',
  bekend:'Het enige land waar alle vier de commerciële koffiesoorten groeien — arabica, robusta, excelsa én liberica, hier barako genoemd. De arabica uit de Cordillera is zacht en zoet; barako is een smaak die je nergens anders vindt.',
  smaak:['cacao','noot','specerij','gedroogd fruit'],proc:['washed','natural'],
  streken:[
   {n:'Benguet',h:'1000–1800 m',ll:[120.75,16.4],v:'Typica, Bourbon',t:'De Cordillera boven Baguio, het hoogste van het land. Zacht en zoet, met cacao en amandel.',s:['cacao','amandel','honing']},
   {n:'Sagada',h:'1200–1600 m',ll:[120.9,17.08],v:'Typica',t:'Kleine terrassen in de bergen, in de schaduw van pijnbomen. Helderder en fruitiger, met citrus en steenfruit.',s:['citrus','perzik','bloemig']},
   {n:'Mount Apo',h:'900–1400 m',ll:[125.27,6.99],v:'Typica, Bourbon',t:'Op Mindanao, aan de hoogste vulkaan van het land. Vol en kruidig, met gedroogd fruit.',s:['specerij','rozijn','cacao']}]},
 timor:{hoogte:'1000–1800 m',var:'Hibrido de Timor, Typica, Bourbon',
  bekend:'Een half eiland met een grote naam in de koffiewereld: hier ontstond spontaan de Hibrido de Timor, een kruising van arabica en robusta die tegen koffieroest kan. Bijna elke moderne variëteit heeft er iets van in zich. De koffie zelf groeit half wild in het bos.',
  smaak:['cacao','specerij','gedroogd fruit','noot'],proc:['washed','natural'],
  streken:[
   {n:'Ermera',h:'1200–1700 m',ll:[125.4,-8.72],v:'Hibrido de Timor, Typica',t:'De grootste koffiestreek, in de bergen boven Dili. Half wild onder schaduwbomen, bijna altijd biologisch omdat er nooit iets bijgekomen is. Vol en kruidig.',s:['cacao','specerij','noot']},
   {n:'Ainaro',h:'1300–1800 m',ll:[125.5,-8.99],v:'Typica, Bourbon',t:'Hoger en zuidelijker, tegen de bergrug aan. Helderder en zoeter, met gedroogd fruit en citrus.',s:['gedroogd fruit','citrus','honing']}]},
 bali:{hoogte:'1200–1600 m',var:'Typica, Kartika, S795',
  bekend:'Anders dan de rest van Indonesië: op Bali wordt vooral washed verwerkt, en de boeren werken in een subak abian — een traditioneel coöperatief systeem waarin ook koffie, sinaasappel en groente door elkaar staan. Dat proef je: schoon en zoet, met citrus.',
  smaak:['sinaasappel','cacao','honing','noot'],proc:['washed','natural','honey'],
  streken:[
   {n:'Kintamani',h:'1200–1600 m',ll:[115.36,-8.24],v:'Typica, Kartika',t:'Op de helling van de Batur-vulkaan, tussen de sinaasappelbomen. Die staan er niet toevallig: de citrus zit ook in de kop. Schoon, zoet en licht van body.',s:['sinaasappel','honing','cacao']}]},
 flores:{hoogte:'1200–1750 m',var:'Typica, S795, Juria',
  bekend:'Een vulkanisch eiland ten oosten van Bali, met koffie die in kleine tuinen tussen de dorpen groeit. Voller dan Bali, schoner dan Sumatra — voor veel mensen de fijnste Indonesische koffie om mee te beginnen.',
  smaak:['cacao','tabak','bruine suiker','specerij'],proc:['washed','wet hulling','natural'],
  streken:[
   {n:'Bajawa',h:'1200–1750 m',ll:[120.98,-8.7],v:'Typica, S795',t:'Het hoogland in het midden, op de flank van de Inerie-vulkaan. Zoet en vol, met cacao en bruine suiker, en net genoeg zuur om levendig te blijven.',s:['cacao','bruine suiker','sinaasappel']},
   {n:'Manggarai',h:'1100–1500 m',ll:[120.4,-8.6],v:'Juria, Typica',t:'Het westen, rond Ruteng. Kruidiger en aardser, dichter bij de Sumatra-stijl.',s:['specerij','tabak','pruim']}]},
 mexico:{hoogte:'900–1700 m',var:'Typica, Bourbon, Mundo Novo, Garnica',
  bekend:'De grootste producent van biologische koffie ter wereld, bijna allemaal kleine boeren in coöperaties. Zacht en nootachtig, met een lichte body — vaak onderschat, en daardoor vriendelijk geprijsd.',
  smaak:['amandel','melkchocolade','bruine suiker','appel'],proc:['washed','natural'],
  streken:[
   {n:'Chiapas',h:'1000–1700 m',ll:[-92.6,16.5],v:'Typica, Bourbon',t:'Tegen Guatemala aan, en dat proef je: het hoogste en helderste van Mexico, met citrus en cacao.',s:['citrus','cacao','amandel']},
   {n:'Oaxaca',h:'900–1650 m',ll:[-96.7,16.9],v:'Typica, Garnica',t:'Droge bergen, veel schaduwteelt. Zacht en zoet, met noot en een lichte bloemigheid.',s:['hazelnoot','honing','bloemig']},
   {n:'Veracruz',h:'800–1400 m',ll:[-97.6,18.9],v:'Bourbon, Mundo Novo',t:'De laagste en natste streek, dicht bij de Golf. Rond en mild, met chocolade en appel.',s:['melkchocolade','appel','karamel']}]},
 nicaragua:{hoogte:'1000–1700 m',var:'Caturra, Bourbon, Maragogype, Pacamara',
  bekend:'Het land van de reuzenbonen: Maragogype en Pacamara komen hiervandaan, met korrels twee keer zo groot als normaal. Zacht en zoet, met veel cacao.',
  smaak:['cacao','sinaasappel','karamel','noot'],proc:['washed','honey','natural'],
  streken:[
   {n:'Jinotega',h:'1100–1700 m',ll:[-86,13.1],v:'Caturra, Bourbon',t:'De grootste en hoogste streek, koel en bewolkt. Zoet en gebalanceerd, met cacao en citrus.',s:['cacao','sinaasappel','karamel']},
   {n:'Matagalpa',h:'1000–1500 m',ll:[-85.9,12.9],v:'Caturra, Maragogype',t:'Naast Jinotega, iets warmer. Voller en nootachtiger, met een zachte zuurgraad.',s:['noot','chocolade','honing']},
   {n:'Nueva Segovia',h:'1100–1650 m',ll:[-86.4,13.4],v:'Pacamara, Caturra',t:'Tegen Honduras aan, waar de wedstrijdkoffies vandaan komen. Fruitiger en helderder dan de rest van het land.',s:['perzik','citrus','bloemig']}]},
 panama:{hoogte:'1200–1900 m',var:'Geisha, Caturra, Typica, Catuai',
  bekend:'Klein land, grote naam. Hier werd Geisha ontdekt: een variëteit die naar jasmijn en bergamot smaakt en op veilingen de hoogste prijzen ter wereld haalt. De rest van Panama is ook goed, en een stuk betaalbaarder.',
  smaak:['jasmijn','bergamot','perzik','honing'],proc:['washed','natural','honey'],
  streken:[
   {n:'Boquete',h:'1200–1800 m',ll:[-82.44,8.78],v:'Geisha, Caturra',t:'Aan de voet van de Barú-vulkaan, met een mist die de kers langzaam laat rijpen. Hier komt de beroemdste Geisha vandaan: jasmijn, bergamot, bijna thee.',s:['jasmijn','bergamot','zwarte thee']},
   {n:'Volcán–Candela',h:'1200–1700 m',ll:[-82.63,8.83],v:'Geisha, Typica',t:'De andere kant van dezelfde vulkaan, droger en zonniger. Steviger van body, met steenfruit.',s:['perzik','honing','karamel']},
   {n:'Renacimiento',h:'1100–1500 m',ll:[-82.88,8.86],v:'Caturra, Catuai',t:'Het minst bekend en het meest betaalbaar. Zoet en rond, een goede kennismaking met Panama.',s:['cacao','sinaasappel','noot']}]},
 ecuador:{hoogte:'1200–2000 m',var:'Typica, Bourbon, Sidra, Caturra',
  bekend:'Klein maar eigenzinnig. Het enige land waar koffie op de evenaar én op grote hoogte groeit, en de bakermat van Sidra — een variëteit die je bijna nergens anders vindt.',
  smaak:['bloemig','tropisch fruit','honing','citrus'],proc:['washed','natural','honey'],
  streken:[
   {n:'Loja',h:'1400–2000 m',ll:[-79.2,-4],v:'Typica, Bourbon',t:'Het zuiden, tegen Peru aan. Hoog en koel, met een helder zuur en veel bloemen.',s:['bloemig','citroen','honing']},
   {n:'Pichincha',h:'1200–1900 m',ll:[-78.6,-0.2],v:'Sidra, Typica',t:'Pal op de evenaar, in de schaduw van de vulkanen. Hier komen de Sidra-lots vandaan: zoet, tropisch en heel aromatisch.',s:['tropisch fruit','jasmijn','perzik']},
   {n:'Zamora-Chinchipe',h:'1200–1800 m',ll:[-78.9,-4.1],v:'Typica, Caturra',t:'Aan de rand van het Amazonegebied, nat en groen. Voller en fruitiger, met een zachte afdronk.',s:['rood fruit','cacao','honing']}]},
 peru:{hoogte:'1200–1900 m',var:'Typica, Bourbon, Caturra, Catimor',
  bekend:'Veel kleine boeren, veel biologisch en fairtrade. Lang vooral bulk, maar de laatste jaren komen er steeds meer heldere, zoete lots uit die je zo naast een Colombiaan kunt zetten.',
  smaak:['noot','melkchocolade','sinaasappel','karamel'],proc:['washed','natural'],
  streken:[
   {n:'Cajamarca',h:'1500–1900 m',ll:[-78.5,-6.2],v:'Bourbon, Typica',t:'Het noorden, hoog en droog. De schoonste kop van Peru: citrus, bruine suiker en een nette body.',s:['sinaasappel','bruine suiker','amandel']},
   {n:'Amazonas',h:'1400–1900 m',ll:[-77.9,-5.9],v:'Typica, Caturra',t:'Naast Cajamarca, natter en groener. Zachter zuur, meer cacao en gedroogd fruit.',s:['cacao','rozijn','noot']},
   {n:'Cusco',h:'1200–1800 m',ll:[-72.5,-13],v:'Typica, Bourbon',t:'Diep in het zuiden, in de valleien onder Machu Picchu. Kruidig en vol, met een lange zoete afdronk.',s:['specerij','honing','walnoot']}]},
 bolivia:{hoogte:'1400–1900 m',var:'Typica, Caturra, Java, Geisha',
  bekend:'Klein en kwetsbaar: veel koffieland verdween naar andere gewassen. Wat er over is, is vaak bijzonder — delicaat, bloemig en zoet, met een fijne body.',
  smaak:['bloemig','honing','rood fruit','amandel'],proc:['washed','natural'],
  streken:[
   {n:'Caranavi',h:'1400–1750 m',ll:[-67.57,-15.84],v:'Typica, Java',t:'De bekendste streek, in de Yungas-vallei. Steile hellingen, kleine percelen. Bloemig en zoet, met een heldere zuurgraad.',s:['bloemig','honing','perzik']},
   {n:'Yungas',h:'1200–1700 m',ll:[-67.8,-16.3],v:'Typica, Caturra',t:'Het bredere gebied waar Caranavi in ligt, tussen de Andes en het Amazonegebied. Ronder en nootachtiger.',s:['amandel','cacao','sinaasappel']}]},
 oeganda:{hoogte:'1200–2200 m',var:'SL14, SL28, Nyasaland, robusta',
  bekend:'Na Ethiopië de grootste van Afrika, en het enige land waar robusta nog echt wild in het bos groeit. De arabica komt van de vulkanen: Mount Elgon en de Rwenzori.',
  smaak:['zwarte bes','cacao','sinaasappel','gedroogd fruit'],proc:['washed','natural'],
  streken:[
   {n:'Mount Elgon (Sipi)',h:'1600–2200 m',ll:[34.05,1.33],v:'SL14, SL28, Nyasaland',t:'Op de vulkaanhelling bij de Sipi-watervallen. Het bekendste van Oeganda: zwarte bes en cacao, met een stevige body.',s:['zwarte bes','cacao','sinaasappel']},
   {n:'Rwenzori',h:'1400–2000 m',ll:[30,0.4],v:'SL14, Bourbon',t:'De Maanbergen, aan de grens met Congo. Koeler en natter, met een zachtere zuurgraad en meer bloemen.',s:['bloemig','pruim','honing']},
   {n:'West Nile',h:'1200–1600 m',ll:[31.2,3],v:'Nyasaland, robusta',t:'Het droge noordwesten. Vol en kruidig, en hier vind je de wilde robusta die nergens anders zo groeit.',s:['specerij','tabak','donkere chocolade']}]},
 burundi:{hoogte:'1400–2000 m',var:'Red Bourbon, Jackson, Mibirizi',
  bekend:'De kleine broer van Rwanda, met hetzelfde systeem van gezamenlijke wasstations en dezelfde heldere, bloemige stijl. Vaak nog een tikje zoeter en fruitiger.',
  smaak:['rode bes','bloemig','zwarte thee','citroen'],proc:['washed','natural'],
  streken:[
   {n:'Kayanza',h:'1600–2000 m',ll:[29.63,-2.92],v:'Red Bourbon',t:'Het noorden, hoog en dichtbevolkt. De bekendste wasstations van het land staan hier. Helder, bloemig en zoet.',s:['rode bes','jasmijn','citroen']},
   {n:'Ngozi',h:'1500–1900 m',ll:[29.83,-2.9],v:'Red Bourbon, Jackson',t:'Naast Kayanza, iets lager. Ronder en zoeter, met steenfruit en karamel.',s:['perzik','karamel','sinaasappel']},
   {n:'Kirimiro',h:'1400–1800 m',ll:[29.9,-3.4],v:'Mibirizi, Bourbon',t:'Het centrale hoogland. Vol en kruidig, met een lange, zoete afdronk.',s:['specerij','honing','cacao']}]},
 congo:{hoogte:'1400–2000 m',var:'Bourbon, Rumangabo, Blue Mountain',
  bekend:'Aan het Kivumeer, tussen de vulkanen — op papier een van de beste plekken voor koffie ter wereld. Jarenlang onbereikbaar door conflict; nu bouwen coöperaties het weer op, en wat eruit komt is vol, zoet en verrassend fruitig.',
  smaak:['rood fruit','cacao','sinaasappel','bruine suiker'],proc:['washed','natural'],
  streken:[
   {n:'Zuid-Kivu',h:'1500–2000 m',ll:[28.5,-2.8],v:'Bourbon, Rumangabo',t:'Aan de westoever van het Kivumeer, waar het water de temperatuur dempt. Zoet en vol, met rood fruit en cacao.',s:['rood fruit','cacao','bruine suiker']},
   {n:'Noord-Kivu',h:'1400–1900 m',ll:[28.6,-1],v:'Bourbon, Blue Mountain',t:'In de schaduw van de Nyiragongo-vulkaan. Steviger van body, met citrus en een kruidige afdronk.',s:['sinaasappel','specerij','chocolade']},
   {n:'Ituri',h:'1300–1800 m',ll:[28.7,1],v:'Bourbon, robusta',t:'Het noorden, tegen Oeganda aan. Jonger en minder bekend, met een zachte, nootachtige kop.',s:['noot','honing','cacao']}]},
 jemen:{hoogte:'1500–2400 m',var:'Udaini, Dawairi, Tuffahi (oude landrassen)',
  bekend:'Waar koffie voor het eerst verhandeld werd — de haven Mokha gaf de mokka zijn naam. Op terrassen in de bergen, met bijna geen water, dus altijd natural en gedroogd op het dak. Wild, kruidig en onvergelijkbaar.',
  smaak:['gedroogd fruit','donkere chocolade','specerij','tabak'],proc:['natural'],
  streken:[
   {n:'Haraaz',h:'1800–2400 m',ll:[43.9,14.9],v:'Udaini, Dawairi',t:'Steile terrassen ten westen van Sanaa, tot boven de 2200 meter. Het meest verfijnde van Jemen: gedroogde vijg, kaneel en donkere chocolade.',s:['vijg','kaneel','donkere chocolade']},
   {n:'Bura\'a',h:'1500–2100 m',ll:[44.6,15.6],v:'Tuffahi, Udaini',t:'Een groen bergmassief in een droog land, met eigen mist. Zoeter en fruitiger, richting rode wijn.',s:['rode wijn','rozijn','specerij']},
   {n:'Yafa\'',h:'1600–2200 m',ll:[45.8,14.6],v:'Dawairi',t:'Het zuiden, afgelegen en klein. Aards en kruidig, met tabak en donker fruit.',s:['tabak','pruim','specerij']}]},
 vietnam:{hoogte:'500–1600 m',var:'robusta, Catimor, Typica, Bourbon',
  bekend:'De tweede grootste koffieproducent ter wereld, en veruit de grootste in robusta — die zit in bijna elke supermarktblend. Maar in de hooglanden rond Da Lat groeit inmiddels arabica die de moeite waard is, en boeren experimenteren volop met honey en natural.',
  smaak:['donkere chocolade','noot','specerij','karamel'],proc:['natural','washed','honey'],
  streken:[
   {n:'Da Lat (Lam Dong)',h:'1300–1600 m',ll:[108.45,11.94],v:'Catimor, Bourbon, Typica',t:'Het hoogste van Vietnam, koel en fris. Hier komt de arabica vandaan die het land op de kaart zet: zoet, met cacao en steenfruit.',s:['cacao','perzik','karamel']},
   {n:'Buon Ma Thuot',h:'500–800 m',ll:[108.05,12.67],v:'robusta',t:'De robusta-hoofdstad. Zwaar, bitterzoet en vol — de basis van het glas Vietnamese ijskoffie met gecondenseerde melk.',s:['donkere chocolade','noot','tabak']},
   {n:'Son La',h:'1000–1400 m',ll:[104,21.3],v:'Catimor, Typica',t:'Het verre noorden, tegen Laos aan. Jong, klein en verrassend helder voor Vietnam.',s:['citrus','honing','amandel']}]},
 java:{hoogte:'900–1600 m',var:'Typica, Ateng, S795',
  bekend:'Waar "a cup of java" vandaan komt. De oude plantages op de Ijen liggen er nog, en anders dan op Sumatra wordt hier meestal gewoon washed verwerkt — dus schoner en rustiger, met dezelfde kruidige ondergrond.',
  smaak:['specerij','cederhout','donkere chocolade','noot'],proc:['washed','wet hulling'],
  streken:[
   {n:'Ijen Plateau',h:'1000–1600 m',ll:[114.2,-8.06],v:'Typica, Ateng',t:'Oost-Java, op het vulkanische plateau met de zwavelmijn. De klassieke Java: kruidig, vol en laag in zuur, met cederhout.',s:['cederhout','specerij','chocolade']},
   {n:'Preanger (West-Java)',h:'900–1400 m',ll:[107.6,-7],v:'Typica, S795',t:'De oudste koffiestreek van Indonesië, aangelegd in de koloniale tijd. Zoeter en ronder dan Oost-Java.',s:['bruine suiker','noot','pruim']}]},
 papoea:{hoogte:'1300–1900 m',var:'Typica (Blue Mountain), Arusha, Bourbon',
  bekend:'Bijna alles komt van kleine "garden"-boeren met een paar honderd struiken achter het huis. Weinig techniek, veel karakter: een wilde, tropische kop die je nergens anders zo tegenkomt.',
  smaak:['tropisch fruit','cacao','specerij','gedroogd fruit'],proc:['washed','natural'],
  streken:[
   {n:'Eastern Highlands',h:'1400–1900 m',ll:[145.4,-6.08],v:'Typica, Arusha',t:'Rond Goroka, het hart van de Papoease koffie. Vol en fruitig, met cacao en een zachte zuurgraad.',s:['tropisch fruit','cacao','karamel']},
   {n:'Western Highlands',h:'1500–1900 m',ll:[144.3,-5.85],v:'Typica (Blue Mountain)',t:'Rond Mount Hagen, iets hoger en koeler. Helderder en zoeter, met citrus en bloemen.',s:['citrus','bloemig','honing']},
   {n:'Simbu',h:'1300–1900 m',ll:[145,-6.4],v:'Arusha, Bourbon',t:'De steilste valleien van het land, moeilijk bereikbaar. Kruidig en aards, met gedroogd fruit.',s:['specerij','rozijn','tabak']}]},
 guatemala:{hoogte:'1300–2000 m',var:'Bourbon, Caturra, Catuai, Pache',
  bekend:'Acht heel verschillende streken op een klein oppervlak. Van rokerig en vol tot bloemig en helder — Guatemala is eigenlijk acht landen in één.',
  smaak:['cacao','sinaasappel','karamel','rook'],proc:['washed','honey'],
  streken:[
   {n:'Antigua',h:'1500–1700 m',ll:[-90.73,14.56],v:'Bourbon, Caturra',t:'Tussen drie vulkanen, in een dal dat de warmte vasthoudt. Vol en rond, met cacao en een lichte rokerigheid.',s:['cacao','toffee','rook']},
   {n:'Huehuetenango',h:'1500–2000 m',ll:[-91.5,15.32],v:'Bourbon, Caturra',t:'Het hoogste van Guatemala, tegen Mexico aan. Droge wind uit Tehuantepec houdt de vorst weg, waardoor ze hier hoger kunnen planten dan waar dan ook. Fel en fruitig.',s:['sinaasappel','rode appel','honing']},
   {n:'Atitlán',h:'1500–1700 m',ll:[-91.2,14.7],v:'Bourbon, Typica',t:'Aan het meer, op vulkanische grond die veel voedsel vasthoudt. Voller en zoeter, met een duidelijke bloemige neus.',s:['bloemig','citrus','chocolade']},
   {n:'Cobán',h:'1300–1500 m',ll:[-90.37,15.47],v:'Caturra, Catuai',t:'Nat en bewolkt bijna het hele jaar. Drogen duurt lang, wat een zachtere zuurgraad geeft en een fruitig karakter.',s:['pruim','specerij','cacao']}]},
 costarica:{hoogte:'1000–1900 m',var:'Caturra, Catuai, Villa Sarchi, Geisha',
  bekend:'Het enige land dat bij wet alleen arabica toestaat. Veel boeren verwerken hun eigen oogst op een kleine micromill, en experimenteren daardoor volop met honey.',
  smaak:['honing','sinaasappel','amandel','rode appel'],proc:['washed','honey'],
  streken:[
   {n:'Tarrazú',h:'1200–1900 m',ll:[-84,9.65],v:'Caturra, Catuai',t:'De bekendste streek, hoog en koel. Helder zuur met een duidelijke zoetheid — netjes en betrouwbaar.',s:['sinaasappel','honing','amandel']},
   {n:'West Valley',h:'1000–1600 m',ll:[-84.4,10.05],v:'Villa Sarchi, Caturra',t:'Waar de meeste micromills staan, en waar honey het verst is doorgevoerd. Vaak zoeter en ronder dan Tarrazú.',s:['rode appel','karamel','abrikoos']},
   {n:'Brunca',h:'800–1300 m',ll:[-83,8.8],v:'Caturra, Catuai',t:'Zuidelijk en lager, tegen Panama aan. Zachter zuur, meer chocolade — een makkelijke kop.',s:['cacao','noot','honing']}]},
 honduras:{hoogte:'1100–1700 m',var:'Bourbon, Caturra, Catuai, Pacas',
  bekend:'Lang alleen bekend als bulkland, inmiddels een van de spannendste van Midden-Amerika. Goede prijs-kwaliteit, en steeds meer boeren die hun eigen lot apart houden.',
  smaak:['karamel','citrus','cacao','gedroogd fruit'],proc:['washed','honey','natural'],
  streken:[
   {n:'Marcala',h:'1300–1700 m',ll:[-88,14.15],v:'Bourbon, Pacas',t:'Hoog en droog, met een beschermde herkomstnaam. Zoet en helder, met citrus en karamel.',s:['citrus','karamel','honing']},
   {n:'Santa Bárbara',h:'1200–1700 m',ll:[-88.24,14.92],v:'Bourbon, Parainema, Pacas',t:'De streek waar de wedstrijdkoffies vandaan komen. Uitgesproken fruitig — perzik, abrikoos, soms tropisch.',s:['perzik','abrikoos','bloemig']},
   {n:'Copán',h:'1000–1500 m',ll:[-89.15,14.85],v:'Bourbon, Caturra',t:'Tegen Guatemala aan, op vulkanische grond. Voller en chocoladiger, met een zachte zuurgraad.',s:['cacao','pruim','noot']}]},
 colombia:{hoogte:'1200–2000 m',var:'Caturra, Castillo, Colombia, Typica',
  bekend:'Twee oogsten per jaar, dus vrijwel altijd verse koffie te krijgen. Evenwichtig: genoeg zuur om levendig te zijn, genoeg zoet om makkelijk weg te drinken.',
  smaak:['karamel','rode appel','citrus','noot'],proc:['washed','honey','natural'],
  streken:[
   {n:'Huila',h:'1300–2000 m',ll:[-75.5,2.5],v:'Caturra, Castillo',t:'De bekendste, en niet voor niets. Hoog, zuidelijk, met een fruitig zuur dat naar rode appel en tropisch fruit trekt.',s:['rode appel','karamel','tropisch fruit']},
   {n:'Nariño',h:'1600–2300 m',ll:[-77.3,1.2],v:'Caturra, Typica',t:'Vlak bij de evenaar maar heel hoog, dus koude nachten. De boon rijpt langzaam en wordt daardoor zoeter en complexer.',s:['limoen','bruine suiker','bloemig']},
   {n:'Tolima',h:'1300–1900 m',ll:[-75.2,4],v:'Caturra, Castillo',t:'Lang moeilijk bereikbaar, nu een van de spannendste streken. Zoet en zacht, met een romige body.',s:['honing','sinaasappel','cacao']},
   {n:'Antioquia',h:'1300–1800 m',ll:[-75.6,6.6],v:'Castillo, Colombia',t:'Rond Medellín, het hart van de oude koffiestreek. Klassiek en nootachtig — dit is de smaak die veel mensen "Colombiaans" noemen.',s:['noot','chocolade','karamel']}]},
 brazilie:{hoogte:'800–1350 m',var:'Yellow Bourbon, Mundo Novo, Catuai, Icatú',
  bekend:'Het grootste koffieland ter wereld, en de ruggengraat van bijna elke espressoblend. Laag zuur, veel zoet, veel body.',
  smaak:['pinda','chocolade','karamel'],proc:['natural','pulped natural','washed'],
  streken:[
   {n:'Cerrado Mineiro',h:'900–1250 m',ll:[-46.5,-18.5],v:'Mundo Novo, Catuai',t:'Vlak en droog, met een scherp gescheiden regen- en droogseizoen. Daardoor rijpt alles tegelijk en kan er machinaal geplukt worden. Heel constant.',s:['chocolade','noot','karamel']},
   {n:'Sul de Minas',h:'800–1350 m',ll:[-45.5,-21.5],v:'Yellow Bourbon, Catuai',t:'Heuvelachtig en iets koeler. Zoeter en ronder dan Cerrado, met meer fruit erin.',s:['karamel','sinaasappel','hazelnoot']},
   {n:'Mogiana',h:'900–1300 m',ll:[-47,-21],v:'Mundo Novo, Yellow Bourbon',t:'Rode, ijzerrijke grond langs de rivier. Geeft een volle kop met een zachte zuurgraad — geliefd als basis voor espresso.',s:['cacao','rode vruchten','noot']},
   {n:'Bahia',h:'700–1300 m',ll:[-41,-13],v:'Catuai, Icatú',t:'De nieuwkomer, met irrigatie en veel techniek. Schoner en helderder dan je van Brazilië verwacht.',s:['citrus','honing','amandel']}]},
 ethiopie:{hoogte:'1500–2200 m',var:'heirloom (landrassen), 74110, 74112',
  bekend:'De geboortegrond van arabica. Duizenden wilde variëteiten die nergens anders groeien — daarom smaakt Ethiopische koffie naar dingen die je bij andere landen niet tegenkomt.',
  smaak:['jasmijn','bergamot','blauwe bes','zwarte thee'],proc:['washed','natural'],
  streken:[
   {n:'Yirgacheffe',h:'1750–2200 m',ll:[38.2,6.16],v:'heirloom, 74110',t:'De klassieker onder de lichte filterkoffies. Washed is hier jasmijn, citroen en thee; natural gaat richting blauwe bes.',s:['jasmijn','citroen','zwarte thee']},
   {n:'Guji',h:'1800–2300 m',ll:[38.8,5.6],v:'heirloom, 74158',t:'Naast Sidamo, pas de laatste jaren apart verkocht. Vaak natural, en dan uitgesproken fruitig — aardbei, perzik, soms bijna wijnachtig.',s:['aardbei','perzik','cacaonib']},
   {n:'Sidamo',h:'1500–2200 m',ll:[38.5,6.7],v:'heirloom',t:'Groot gebied met veel kleine boeren. Zoet en gebalanceerd, met bloemen en citrus. Een goed startpunt als Ethiopië nieuw voor je is.',s:['bloemig','citroen','honing']},
   {n:'Harrar',h:'1400–2100 m',ll:[42.1,9.3],v:'heirloom (longberry)',t:'Droog oosten, waar altijd natural verwerkt wordt omdat er weinig water is. Zwaar fruit, bijna bosbes en rode wijn.',s:['bosbes','rode wijn','specerij']},
   {n:'Jimma',h:'1400–2000 m',ll:[36.8,7.7],v:'heirloom',t:'Westelijk en groen, met veel bos. Vroeger vooral bulk, nu ook mooie lots met een zachte, kruidige zoetheid.',s:['kruidig','honing','citrus']}]},
 kenia:{hoogte:'1400–2100 m',var:'SL28, SL34, Ruiru 11, Batian',
  bekend:'Het scherpste zuur op de kaart. Vulkanische grond en een veilingsysteem dat kwaliteit beloont — daardoor is de lat hier hoog.',
  smaak:['zwarte bes','grapefruit','tomaat','bruine suiker'],proc:['washed'],
  streken:[
   {n:'Nyeri',h:'1600–1900 m',ll:[36.95,-0.42],v:'SL28, SL34',t:'Aan de voet van Mount Kenya, op diepe rode grond. Het meest uitgesproken: zwarte bes, stevig zuur en veel body.',s:['zwarte bes','grapefruit','bruine suiker']},
   {n:'Kirinyaga',h:'1500–1900 m',ll:[37.3,-0.5],v:'SL28, SL34, Ruiru 11',t:'Dezelfde hooglanden, maar ronder en zoeter. Als Nyeri je te fel is, begin je hier.',s:['tomaat-zoet','rode appel','karamel']},
   {n:'Kiambu',h:'1400–1800 m',ll:[36.8,-1.1],v:'SL28, Batian',t:'Dicht bij Nairobi, met grotere landgoederen. Zachter en klassieker van smaak.',s:['pruim','cacao','citrus']},
   {n:'Embu',h:'1300–1800 m',ll:[37.45,-0.53],v:'SL28, Ruiru 11',t:'Kleiner en minder bekend. Steeds vaker experimenteert men hier met natural — ongewoon voor Kenia, en verrassend goed.',s:['aardbei','rum','bruine suiker']}]},
 tanzania:{hoogte:'1400–2000 m',var:'Bourbon, Kent, N39, Blue Mountain',
  bekend:'Twee gezichten: het noorden bij de Kilimanjaro lijkt op Kenia, het zuiden is zachter en zoeter. Ook het land van de peaberry — één ronde boon in plaats van twee platte.',
  smaak:['zwarte bes','citroen','cacao','gedroogde vijg'],proc:['washed','natural'],
  streken:[
   {n:'Kilimanjaro',h:'1400–1900 m',ll:[37.35,-3.07],v:'Bourbon, Kent',t:'Op de hellingen van de berg, op vulkanische grond. Fel en helder, het dichtst bij het Keniaanse profiel.',s:['zwarte bes','citroen','bruine suiker']},
   {n:'Mbeya',h:'1400–2000 m',ll:[33,-8.9],v:'Bourbon, N39',t:'Het zuidelijke hoogland. Zachter en zoeter, met steenfruit en cacao — een toegankelijke kop.',s:['perzik','cacao','honing']},
   {n:'Kigoma',h:'1200–1700 m',ll:[30,-4.9],v:'Bourbon',t:'Bij het Tanganyikameer, afgelegen en klein. Kruidig en vol, met gedroogd fruit.',s:['vijg','specerij','chocolade']}]},
 rwanda:{hoogte:'1500–2000 m',var:'Red Bourbon, Jackson',
  bekend:'Het land van de duizend heuvels, en van de wasstations: kleine boeren brengen hun kersen naar een gezamenlijk station, en dáár wordt de kwaliteit gemaakt.',
  smaak:['rode bes','bloemig','sinaasappel','zwarte thee'],proc:['washed','natural'],
  streken:[
   {n:'Nyamasheke',h:'1500–2000 m',ll:[29.15,-2.35],v:'Red Bourbon',t:'Aan het Kivumeer, waar het water de temperatuur dempt. Bloemig en delicaat, met rode bessen.',s:['rode bes','bloemig','zwarte thee']},
   {n:'Huye',h:'1600–2000 m',ll:[29.74,-2.6],v:'Red Bourbon, Jackson',t:'In het zuiden, op grote hoogte. Steviger en zoeter, met sinaasappel en karamel.',s:['sinaasappel','karamel','pruim']},
   {n:'Rulindo',h:'1500–1900 m',ll:[30,-1.75],v:'Red Bourbon',t:'Noordelijk en heuvelachtig. Schoon en helder, met een lange zoete afdronk.',s:['citroen','honing','bloemig']}]},
 sumatra:{hoogte:'1100–1600 m',var:'Ateng, Tim Tim, Gayo 1 & 2',
  bekend:'Aards, zwaar en laag in zuur. Dat komt niet van de boon maar van het proces: wet hulling geeft Sumatra zijn eigen handtekening.',
  smaak:['cederhout','tabak','donkere chocolade','specerij'],proc:['wet hulling','washed'],
  streken:[
   {n:'Gayo (Aceh)',h:'1100–1600 m',ll:[96.8,4.6],v:'Gayo 1 & 2, Ateng',t:'Het noordelijkste puntje, rond het Tawarmeer. Iets schoner dan de rest van Sumatra, met kruiden en donker fruit.',s:['specerij','pruim','cacao']},
   {n:'Lintong',h:'1100–1500 m',ll:[98.9,2.3],v:'Ateng, Tim Tim',t:'Bij het Tobameer. De klassieke Sumatra: dik, aards, cederhout en tabak. Weinig zuur, veel body.',s:['cederhout','tabak','aarde']}]},
 sulawesi:{hoogte:'1400–1900 m',var:'S795, Typica',
  bekend:'Schoner en helderder dan Sumatra, terwijl het dezelfde eilandenrij is. Een goede eerste stap in Indonesische koffie.',
  smaak:['specerij','donkere chocolade','noot'],proc:['wet hulling','washed'],
  streken:[
   {n:'Toraja',h:'1400–1900 m',ll:[119.9,-3],v:'S795, Typica',t:'Hoog in de bergen van het binnenland. Vol en zacht, met kaneel en donkere chocolade, en net iets meer zuur dan Sumatra.',s:['kaneel','chocolade','walnoot']}]},
 india:{hoogte:'900–1600 m',var:'S795, Kent, Selection 9, Cauvery',
  bekend:'Koffie die in de schaduw van peper- en kardemomstruiken groeit — en dat proef je. Weinig zuur, veel kruiden en body. Ook de thuisbasis van monsooned malabar, waar de bonen expres vochtig worden van de moesson.',
  smaak:['zwarte peper','cacao','kardemom','noot'],proc:['washed','natural'],
  streken:[
   {n:'Chikmagalur',h:'1000–1500 m',ll:[75.77,13.32],v:'S795, Kent',t:'Waar de Indiase koffie begon. Vol en kruidig, met cacao en een zachte zuurgraad.',s:['cacao','specerij','noot']},
   {n:'Coorg (Kodagu)',h:'900–1300 m',ll:[75.8,12.4],v:'S795, Selection 9',t:'De grootste streek, tussen peper en sinaasappelbomen. Zwaar en zoet, met een lange afdronk.',s:['zwarte peper','karamel','sinaasappel']},
   {n:'Araku',h:'900–1300 m',ll:[82.87,18.33],v:'S795, Cauvery',t:'Ver naar het noordoosten, een jong project met kleine boeren. Verrassend helder en bloemig voor India.',s:['bloemig','honing','citrus']}]},
};

/* Waar een boon vandaan komt herkennen we aan de tekst op de zak. Ruw, maar
   goed genoeg: het gaat erom dat de kaart weet waar je al geweest bent. */
const BP_ALIAS={
 elsalvador:['el salvador','pacamara','apaneca'],jamaica:['jamaica','blue mountain'],
 dominicaans:['dominican','dominicaan','barahona','jarabacoa'],hawai:['hawaii','hawaï','kona'],
 malawi:['malawi','misuku'],zambia:['zambia','kasama'],zimbabwe:['zimbabwe','chipinge'],
 kameroen:['cameroon','kameroen','bamboutos'],ivoorkust:['ivory coast','ivoorkust','ivoire'],
 yunnan:['yunnan','baoshan','lincang','dehong'],thailand:['thailand','doi chaang','chiang'],
 laos:['laos','bolaven'],myanmar:['myanmar','burma','ywangan','shan'],
 filipijnen:['philippin','filipijn','benguet','sagada'],timor:['timor'],
 bali:['bali','kintamani'],flores:['flores','bajawa'],
 mexico:['mexico','chiapas','oaxaca','veracruz'],guatemala:['guatemala'],honduras:['honduras'],
 nicaragua:['nicaragua','jinotega','matagalpa'],costarica:['costa rica'],panama:['panama','boquete'],
 colombia:['colombia','colombie','colombië'],ecuador:['ecuador','loja'],peru:['peru','cajamarca'],
 bolivia:['bolivia','caranavi','yungas'],brazilie:['brazil','brazilie','brazilië'],
 ethiopie:['ethiopia','ethiopie','ethiopië','yirgacheffe','guji','sidamo','harrar','jimma'],
 kenia:['kenya','kenia','nyeri','kirinyaga','kiambu'],
 tanzania:['tanzania','kilimanjaro'],oeganda:['uganda','oeganda','elgon','sipi','rwenzori'],
 rwanda:['rwanda'],burundi:['burundi','kayanza','ngozi'],congo:['congo','kivu'],jemen:['yemen','jemen','mokha','haraaz','bura'],
 india:['india','chikmagalur','coorg','araku'],vietnam:['vietnam','da lat'],
 sumatra:['sumatra','aceh','gayo','lintong','mandheling'],java:['java','ijen','preanger'],
 sulawesi:['sulawesi','toraja'],papoea:['papua','papoea','goroka','hagen']};
function bpLandVanBoon(b){
  if(!b)return null;
  const t=((b.origin||'')+' '+(b.name||'')+' '+(b.roasternotes||'')).toLowerCase();
  for(const id in BP_ALIAS)if(BP_ALIAS[id].some(a=>t.includes(a)))return id;
  return null;
}
function bpStreekVanBoon(b,landId){
  const inf=BP_INFO[landId]; if(!inf||!inf.streken)return null;
  const t=((b.origin||'')+' '+(b.name||'')).toLowerCase();
  const i=inf.streken.findIndex(st=>t.includes(st.n.toLowerCase().split(' ')[0]));
  return i>=0?i:null;
}
/* Je paspoort: elk land waar een boon vandaan kwam die op je plank stond of
   staat. Zo kleurt de kaart in naarmate je de wereld afgaat, en zie je in één
   oogopslag waar je nog nooit geweest bent. */
function bpGehad(){
  const uit=new Set();
  (state.beans||[]).forEach(b=>bpRegios(b).forEach(r=>uit.add(r.land)));
  return uit;
}
// landen waar alleen nog een wens ligt
function bpGewenst(){
  const uit=new Set();
  (state.wishlist||[]).forEach(w=>bpRegios(w).forEach(r=>uit.add(r.land)));
  return uit;
}
// en hetzelfde een niveau dieper: welke streken van dit land had je al?
function bpGehadStreken(landId){
  const uit=new Set();
  (state.beans||[]).forEach(b=>bpRegios(b).forEach(r=>{
    if(r.land===landId&&r.i!=null)uit.add(r.i);
  }));
  return uit;
}
function bpPaspoortRegel(){
  const el=document.getElementById('beanpick-sub'); if(!el)return;
  const n=bpGehad().size, totaal=Object.keys(BP_INFO).length;
  el.textContent=n
    ? (n+' van de '+totaal+' landen gehad — kijk waar je nog niet geweest bent')
    : 'de wereldkaart van de koffiegordel — land, streek, proces en variëteit';
}

const BP_PROCES={
 'washed':{u:'De vruchtlaag gaat er meteen af, vóór het drogen.',
   sm:'helder en rechtlijnig — je proeft de streek, niet het proces',
   mo:'lichter en schoner, vaak wat theeachtig'},
 'natural':{u:'De hele kers droogt om de boon heen.',
   sm:'veel meer fruit, zoeter, soms bijna wijnachtig',mo:'dikker en siroopachtig'},
 'honey':{u:'Het vruchtvlees blijft deels zitten tijdens het drogen.',
   sm:'tussen washed en natural in: zoeter, maar nog steeds helder',
   mo:'romiger, met een ronde afdronk'},
 'pulped natural':{u:'Braziliaanse variant van honey: schil eraf, plakkerig laagje eromheen.',
   sm:'zoet en nootachtig, weinig zuur',mo:'vol en zacht'},
 'wet hulling':{u:'Indonesisch (giling basah): het vlies gaat er half droog al af.',
   sm:'aards, kruidig, cederhout — heel weinig zuur',mo:'zwaar en dik, blijft lang hangen'},
};
const BP_BRAND={
 light:{t:'Houdt het zuur en het karakter van de streek overeind. Voor filter de gebruikelijke keuze.'},
 medium:{t:'Meer zoet en karamel, minder scherpte. Werkt op filter en espresso allebei.'},
 dark:{t:'Chocolade, noot en rook nemen het over. Van de herkomst blijft weinig over.'},
};

/* ---- variëteiten ----
   Wat er op de zak staat achter "variety". Je hoeft er niets mee te kiezen;
   tik er een aan en je leest in één regel wat het is. De sleutels worden in
   de naam gezocht, langste eerst, zodat "Red Bourbon" bij Bourbon uitkomt
   en "Yellow Bourbon" ook.                                                */
const BP_VAR={
 'Hibrido de Timor':'Spontane kruising van arabica en robusta op Oost-Timor. De basis van bijna elke variëteit die tegen koffieroest kan.',
 'Blue Mountain':'Typica-lijn uit Jamaica. Zacht en gebalanceerd, met weinig zuur.',
 'Kona Typica':'De Typica die sinds 1892 op Hawaï staat, aangepast aan lage hoogte.',
 'Yellow Bourbon':'Braziliaanse Bourbon met gele kersen. Zoeter en zachter van zuur.',
 'Red Bourbon':'De rode Bourbon, standaard in Rwanda en Burundi. Zoet en bloemig.',
 'Villa Sarchi':'Costaricaanse dwergmutatie van Bourbon. Zoet, met veel structuur.',
 'Mundo Novo':'Kruising van Typica en Bourbon uit Brazilië. Veel opbrengst, volle en zoete kop.',
 'Maragogype':'De olifantsboon: enorme korrels, milde en zachte kop.',
 'Pacamara':'Pacas × Maragogype. Reuzenbonen en een uitgesproken kop — kruidig, fruitig, soms wild.',
 'Parainema':'Hondurese Sarchimor-lijn die wedstrijden wint. Fruitig en schoon.',
 'Selection 9':'Indiase kruising van een Ethiopische lijn met Tafarikela. Vol en aromatisch.',
 'Ruiru 11':'Keniaanse kruising die tegen ziekte kan. Meer opbrengst, iets minder diepte dan SL28.',
 'Rumangabo':'Congolese Bourbon-selectie uit de Kivu-streek.',
 'Nyasaland':'Oost-Afrikaanse selectie uit de koloniale tijd. Taai en betrouwbaar.',
 'heirloom':'Verzamelnaam voor de duizenden wilde Ethiopische landrassen. Elke tuin is anders — daar komt die eigen smaak vandaan.',
 'Catimor':'Kruising met robusta erin, voor weerstand tegen roest. Veel opbrengst; op hoogte kan hij verrassend goed zijn.',
 'Castillo':'Colombiaanse kruising die tegen koffieroest kan. Betrouwbaar, en beter dan zijn reputatie.',
 'Colombia':'De kruising uit de jaren tachtig waar Castillo op voortbouwt. Roestbestendig en veel geplant.',
 'Bourbon':'Mutatie van Typica op Réunion. Zoeter en voller dan Typica, met meer body.',
 'Caturra':'Braziliaanse dwergmutatie van Bourbon. Compact, dus meer struiken per hectare; helder zuur, iets minder body.',
 'Catuai':'Kruising van Mundo Novo en Caturra. Houdt zich goed in wind en regen, zoet en gebalanceerd.',
 'Typica':'De oervorm waar bijna alles van afstamt. Weinig opbrengst, veel finesse: helder, zoet en schoon.',
 'Geisha':'Uit Ethiopië via Costa Rica beroemd geworden in Panama. Jasmijn, bergamot, thee — en de hoogste veilingprijzen.',
 'Pacas':'Salvadoraanse dwergmutatie van Bourbon, wat Caturra is voor Brazilië.',
 'SL28':'In de jaren dertig geselecteerd in Kenia. Diep zuur, zwarte bes, veel body — en weinig opbrengst.',
 'SL34':'Broer van SL28, iets voller en beter bestand tegen regen.',
 'SL14':'Oost-Afrikaanse selectie, gekozen op droogtebestendigheid.',
 'Batian':'Keniaanse kruising die qua smaak dicht bij SL28 komt, maar sneller draagt.',
 'Sidra':'Ecuadoraanse selectie uit Bourbon en Typica. Heel aromatisch en tropisch.',
 'Java':'Oude Ethiopische lijn die via Java in Latijns-Amerika belandde. Elegant en bloemig.',
 'S795':'Indiase kruising van Kent met een Liberica-hybride. Kruidig en vol, met weinig zuur.',
 'Kent':'Oude Indiase selectie, gekozen op weerstand tegen roest.',
 'Cauvery':'De Indiase Catimor. Veel geplant, netjes van smaak.',
 'Ateng':'Indonesische Catimor-lijn, aangepast aan het natte klimaat van Sumatra.',
 'Tim Tim':'Indonesische naam voor de Hibrido de Timor. Aards en vol.',
 'Gayo':'Selecties uit Aceh, gekweekt voor het natte hoogland.',
 'Kartika':'Indonesische Catimor-selectie, veel geplant op Bali.',
 'Juria':'Oude Typica-lijn die op Flores nog te vinden is.',
 'Arusha':'Typica-lijn uit Tanzania, ook veel geplant in Papoea.',
 'Jackson':'Bourbon-lijn die in Rwanda en Burundi naast Red Bourbon staat.',
 'Mibirizi':'Bourbon-selectie uit Rwanda, genoemd naar de missiepost waar hij ontstond.',
 'Udaini':'Jemenitisch landras, eeuwenoud en nergens anders te vinden.',
 'Dawairi':'Jemenitisch landras met kleine, dichte bonen.',
 'Tuffahi':'Jemenitisch landras; de naam betekent appel, naar de vorm van de kers.',
 'Agaro':'Ethiopische selectie die ook buiten Ethiopië geplant wordt.',
 'Icatú':'Braziliaanse kruising met robusta erin, gekweekt voor opbrengst.',
 'Garnica':'Mexicaanse kruising van Mundo Novo en Caturra.',
 'Pache':'Guatemalteekse Typica-mutatie, zacht en zoet.',
 'N39':'Tanzaniaanse selectie voor het zuidelijke hoogland.',
 'Arabusta':'Kruising van arabica en robusta, bedoeld voor lager gelegen gebieden.',
 'Liberica':'Een eigen soort naast arabica en robusta. Grote bonen, houtig en jackfruit-achtig.',
 'Excelsa':'Familie van Liberica. Zurig en fruitig, vaak in blends voor complexiteit.',
 'robusta':'Geen arabica maar canephora. Meer cafeïne, minder zuur, veel body en crema.',
 '74110':'Genummerde Ethiopische selectie uit Jimma, gekozen op weerstand tegen wortelziekte.',
 '74112':'Genummerde Ethiopische selectie uit Jimma, zusje van 74110.',
 '74158':'Genummerde Ethiopische selectie, veel geplant in Guji en Sidamo.',
};
const BP_VAR_SLEUTELS=Object.keys(BP_VAR).sort((a,b)=>b.length-a.length);
function bpVarUitleg(naam){
  const t=(naam||'').toLowerCase();
  const k=BP_VAR_SLEUTELS.find(x=>t.includes(x.toLowerCase()));
  return k?BP_VAR[k]:'';
}
let bpVarOpen=null;
function bpVarBlok(lijst){
  const namen=(lijst||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(!namen.length)return '';
  const uitleg=bpVarOpen!=null?bpVarUitleg(namen[bpVarOpen]):'';
  return '<div class="bp-et">Variety</div><div class="bp-chips">'+
    namen.map((n,i)=>'<button class="bp-chip'+(bpVarOpen===i?' sel':'')+
      '" onclick="bpVarTik('+i+')">'+esc(n)+'</button>').join('')+'</div>'+
    (bpVarOpen!=null
      ? '<p class="bp-zacht" style="margin-top:7px">'+esc(uitleg||
          'Een lokale selectie; over deze naam heb ik nog geen uitleg.')+'</p>'
      : '<p class="bp-zacht" style="margin-top:7px">tik een naam aan voor wat het is</p>');
}
function bpVarTik(i){bpVarOpen=(bpVarOpen===i)?null:i;bpTeken(true);}
let bpNiv='wereld', bpDeel=null, bpLandId=null, bpStreek=null;
let bpProc=null, bpBrand=null, bpMeth=null;

function bpPad(l){return 'M'+l.pts.map(p=>bpX(p[0]).toFixed(1)+' '+bpY(p[1]).toFixed(1)).join('L')+'Z';}
function bpDoos(lijst,marge){
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  lijst.forEach(l=>l.pts.forEach(p=>{
    const x=bpX(p[0]),y=bpY(p[1]);
    if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y;
  }));
  const m=marge||0;
  return [x0-m,y0-m,(x1-x0)+m*2,(y1-y0)+m*2];
}
/* Het kijkvenster oprekken tot de verhouding van het kader, anders staat er
   links en rechts (of boven en onder) een brede lege rand. */
const BP_VERH=1.4;
function bpVerhouding(b){
  let [x,y,w,h]=b;
  if(w/h<BP_VERH){const nw=h*BP_VERH;x-=(nw-w)/2;w=nw;}
  else{const nh=w/BP_VERH;y-=(nh-h)/2;h=nh;}
  return [x,y,w,h];
}
const BP_VIEWS={
 wereld:bpVerhouding(bpDoos(BP_LANDEN,8)),
 amerika:bpVerhouding(bpDoos(BP_LANDEN.filter(l=>l.deel==='amerika'),5)),
 afrika:bpVerhouding(bpDoos(BP_LANDEN.filter(l=>l.deel==='afrika'),5)),
 azie:bpVerhouding(bpDoos(BP_LANDEN.filter(l=>l.deel==='azie'),5)),
};
/* Op landniveau zie je het hele land plus zijn streken. Niet strakker
   inzoomen op alleen het teeltgebied: de streken van Panama liggen binnen een
   halve graad van elkaar, en dan vult de landsvorm het hele kader en zie je
   niet meer wélk land je voor je hebt. Dat de stippen dicht op elkaar staan
   lost bpSpreid op. */
function bpLandView(id){
  let [x,y,w,h]=bpDoos([BP_LAND[id]],2.5);
  const st=(BP_INFO[id]&&BP_INFO[id].streken)||[];
  st.forEach(a=>{
    const px=bpX(a.ll[0]), py=bpY(a.ll[1]);
    if(px<x){w+=x-px;x=px;} if(px>x+w)w=px-x;
    if(py<y){h+=y-py;y=py;} if(py>y+h)h=py-y;
  });
  return bpVerhouding([x-1.5,y-1.5,w+3,h+3]);
}

let bpView=BP_VIEWS.wereld.slice(), bpTween=null;
function bpVenster(){
  // let op: het vijf-stappenscherm heeft óók een .bp-kaart, en die staat eerder
  // in het document. Zonder #bp-screen ervoor maat je de verkeerde kaart op
  const svg=document.querySelector('#bp-screen .bp-kaart'); if(!svg)return;
  svg.setAttribute('viewBox',bpView.map(n=>n.toFixed(2)).join(' '));
  bpMaten(svg);
}
/* Tekst en stippen staan in kaart-eenheden, maar moeten op het scherm altijd
   even groot zijn. Hoeveel schermpixels één eenheid is hangt van de zoom af,
   dus rekenen we dat na elke stap terug. */
function bpMaten(svg){
  const r=svg.getBoundingClientRect();
  // Staat de kaart nog niet in beeld, dan meet je nul. Daar stapte hij vroeger
  // uit -- en bleef de tekst op de standaardmaat staan. Die telt in kaart-
  // eenheden, dus op een ingezoomd land werd één streeknaam schermvullend.
  // Nu rekenen we door met een aanname, en meten we opnieuw zodra het wél kan.
  const breed=r.width||svg.clientWidth||(svg.parentElement&&svg.parentElement.clientWidth)||358;
  const hoog=r.height||svg.clientHeight||breed*0.62;
  const v=bpView, s=Math.min(breed/v[2], hoog/v[3]);
  if(!(s>0))return;
  if(!r.width){
    const n=(+svg.dataset.meet||0)+1;
    if(n<=20){svg.dataset.meet=n;requestAnimationFrame(()=>{if(svg.isConnected)bpMaten(svg);});}
  }else if(svg.dataset.meet)delete svg.dataset.meet;
  svg.querySelectorAll('.lbl').forEach(t=>{
    t.style.fontSize=((t.classList.contains('groot')?15.5:11.5)/s)+'px';
    t.style.strokeWidth=(2.8/s)+'px';
  });
  svg.querySelectorAll('.stip').forEach(c=>c.setAttribute('r',(9/s).toFixed(2)));
  svg.querySelectorAll('.nr').forEach(t=>{
    t.style.fontSize=(11/s)+'px'; t.setAttribute('dy',(3.8/s));
  });
  bpSpreid(svg,s);
  bpSpreidLabels(svg);
}
/* Midden-Amerika is zes kleine landen op een handbreedte. Hun namen vallen dan
   over elkaar, dus laten we ze elkaar verticaal wegduwen -- net als de
   streekstippen. De maten haalt hij uit de tekst zelf, dus dit klopt bij elke
   zoomstand en in elke taal. */
function bpSpreidLabels(svg){
  const l=[...svg.querySelectorAll('.lbl[data-y0]')];
  if(l.length<2)return;
  const items=l.map(t=>{
    let bb; try{bb=t.getBBox();}catch(e){bb={width:0,height:0};}
    return {t,x:+t.dataset.x0,y:+t.dataset.y0,w:bb.width,h:bb.height};
  });
  for(let ronde=0;ronde<30;ronde++){
    let bewogen=false;
    for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
      const a=items[i], c=items[j];
      const dx=Math.abs(a.x-c.x), dy=Math.abs(a.y-c.y);
      const nodigX=(a.w+c.w)/2*0.9, nodigY=(a.h+c.h)/2*1.1;
      if(dx<nodigX&&dy<nodigY){
        const duw=(nodigY-dy)/2+0.05;
        if(a.y<=c.y){a.y-=duw;c.y+=duw;}else{a.y+=duw;c.y-=duw;}
        bewogen=true;
      }
    }
    if(!bewogen)break;
  }
  items.forEach(it=>it.t.setAttribute('y',it.y));
}
/* Twee streken kunnen vijftien kilometer uit elkaar liggen. Op een telefoon
   vallen hun stippen dan over elkaar en kun je de achterste niet aantikken.
   Daarom duwen we ze net zo ver uit elkaar dat je ze allebei raakt. */
function bpSpreid(svg,s){
  const st=[...svg.querySelectorAll('.stip')]; if(st.length<2)return;
  const min=27/s, pos=st.map(c=>({x:+c.dataset.x0,y:+c.dataset.y0}));
  for(let ronde=0;ronde<40;ronde++){
    let bewogen=false;
    for(let i=0;i<pos.length;i++)for(let j=i+1;j<pos.length;j++){
      let dx=pos[j].x-pos[i].x, dy=pos[j].y-pos[i].y, d=Math.hypot(dx,dy);
      if(d<1e-6){dx=min/2;dy=0;d=min/2;}
      if(d<min){
        const duw=(min-d)/(2*d);
        pos[i].x-=dx*duw; pos[i].y-=dy*duw;
        pos[j].x+=dx*duw; pos[j].y+=dy*duw;
        bewogen=true;
      }
    }
    if(!bewogen)break;
  }
  st.forEach((c,i)=>{c.setAttribute('cx',pos[i].x);c.setAttribute('cy',pos[i].y);});
  svg.querySelectorAll('.nr').forEach(t=>{
    const p=pos[+t.dataset.i]; if(p){t.setAttribute('x',p.x);t.setAttribute('y',p.y);}
  });
  const naam=svg.querySelector('.lbl.groot[data-i]');
  if(naam){const p=pos[+naam.dataset.i];
    if(p){naam.setAttribute('x',p.x);naam.setAttribute('y',p.y-(15/s));}}
}
function bpZoom(doel){
  if(bpTween)cancelAnimationFrame(bpTween);
  const van=bpView.slice(), naar=doel.slice(), t0=performance.now(), duur=520;
  (function stap(nu){
    const f=Math.min(1,(nu-t0)/duur);
    const e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
    bpView=van.map((v,i)=>v+(naar[i]-v)*e);
    bpVenster();
    if(f<1)bpTween=requestAnimationFrame(stap); else bpTween=null;
  })(t0);
}

function bpKaartHTML(){
  const v=bpView, gehad=bpGehad(), gewenst=bpGewenst();
  let s='<svg class="bp-kaart" viewBox="'+v.join(' ')+'" preserveAspectRatio="xMidYMid meet">';
  s+='<rect class="zee" x="-200" y="-200" width="500" height="400"/>';
  s+='<rect class="band" x="-200" y="'+bpY(23.5)+'" width="500" height="'+(bpY(-23.5)-bpY(23.5))+'"/>';
  s+='<line class="lijn" x1="-200" y1="'+bpY(23.5)+'" x2="300" y2="'+bpY(23.5)+'"/>';
  s+='<line class="lijn eq" x1="-200" y1="0" x2="300" y2="0"/>';
  s+='<line class="lijn" x1="-200" y1="'+bpY(-23.5)+'" x2="300" y2="'+bpY(-23.5)+'"/>';
  BP_ACHTER.forEach(pl=>{
    s+='<path class="achter" d="M'+pl.map(p=>bpX(p[0]).toFixed(1)+' '+bpY(p[1]).toFixed(1)).join('L')+'Z"/>';
  });
  BP_VOLGORDE.forEach(l=>{
    let kl='land';
    if(bpNiv==='wereld'){ if(gehad.has(l.id))kl+=' had'; else if(gewenst.has(l.id))kl+=' wens'; }
    else if(l.deel!==bpDeel)kl+=' uit';
    else if(l.id===bpLandId)kl+=' sel';
    else if(gehad.has(l.id))kl+=' had';
    else if(gewenst.has(l.id))kl+=' wens';
    const klik=(bpNiv==='wereld')?("bpKies('deel','"+l.deel+"')")
              :(l.deel===bpDeel&&BP_INFO[l.id]?("bpKies('land','"+l.id+"')"):'');
    s+='<path class="'+kl+'" data-land="'+l.id+'" d="'+bpPad(l)+'"'+
       (klik?(' onclick="'+klik+'"'):'')+'></path>';
  });
  if(bpNiv==='wereld'){
    [['amerika',-62,27],['afrika',22,27],['azie',112,27]].forEach(function(a){
      s+='<text class="lbl groot" x="'+bpX(a[1])+'" y="'+bpY(a[2])+'">'+BP_DELEN[a[0]].kort+'</text>';
    });
  }else if(bpNiv==='deel'){
    BP_LANDEN.filter(l=>l.deel===bpDeel).forEach(l=>{
      const c=bpMidden(l), o=BP_LBLPLEK[l.id]||[0,0];
      const x=(+c[0]+o[0]), y=(+c[1]+o[1]);
      s+='<text class="lbl" x="'+x+'" y="'+y+'" data-x0="'+x+'" data-y0="'+y+'">'+
        esc(l.naam)+'</text>';
    });
  }else{
    const inf=BP_INFO[bpLandId], gehadSt=bpGehadStreken(bpLandId);
    (inf.streken||[]).forEach((st,i)=>{
      const x=bpX(st.ll[0]), y=bpY(st.ll[1]), aan=bpStreek===i;
      const wensSt=bpWensenVoor(bpLandId,i).length>0;
      s+='<circle class="stip'+(aan?' sel':(gehadSt.has(i)?' had':(wensSt?' wens':'')))+'" cx="'+x+'" cy="'+y+'" r="1" data-x0="'+x+
        '" data-y0="'+y+'" onclick="bpKies(\'streek\','+i+')"></circle>';
      s+='<text class="nr'+(aan?' aan':'')+'" x="'+x+'" y="'+y+'" data-i="'+i+
        '" onclick="bpKies(\'streek\','+i+')">'+(i+1)+'</text>';
      if(aan)s+='<text class="lbl groot" x="'+x+'" y="'+y+'" data-i="'+i+'">'+esc(st.n)+'</text>';
    });
  }
  return s+'</svg>';
}
/* Waar zit je? Dat moet je in één blik zien, ook als je even weg bent
   geweest. Vandaar dit bordje linksboven ín de kaart, naast de kop erboven. */
function bpPlek(){
  if(bpNiv==='wereld')return '<div class="bp-pad"><b>de wereld</b>'+
    '<span>'+Object.keys(BP_INFO).length+' landen met een verhaal</span></div>';
  if(bpNiv==='deel')return '<div class="bp-pad"><b>'+esc(BP_DELEN[bpDeel].kort)+'</b>'+
    '<span>kies een land</span></div>';
  const inf=BP_INFO[bpLandId];
  return '<div class="bp-pad"><b>'+esc(BP_LAND[bpLandId].naam)+'</b>'+
    '<span>'+esc(BP_DELEN[bpDeel].kort)+' · '+((inf.streken||[]).length)+' streken</span></div>';
}
function bpMidden(l){
  let sx=0,sy=0;
  l.pts.forEach(p=>{sx+=bpX(p[0]);sy+=bpY(p[1]);});
  return [(sx/l.pts.length).toFixed(1),(sy/l.pts.length).toFixed(1)];
}
function bpProcBlok(namen){
  return namen.map(n=>{
    const p=BP_PROCES[n]; if(!p)return '';
    return '<div class="bp-proc"><div class="n">'+esc(n)+'</div>'+
      '<div class="u">'+esc(p.u)+'<br><b>smaak</b> '+esc(p.sm)+' · <b>mondgevoel</b> '+esc(p.mo)+'</div></div>';
  }).join('');
}
function bpSmaken(a){return '<div class="bp-smaken">'+a.map(x=>'<span class="bp-smaak">'+esc(x)+'</span>').join('')+'</div>';}

/* Welke uitklappers openstaan. Uitleg hoort niet altijd in beeld te staan: wie hem
   één keer leest wil hem daarna niet meer zien, en wie hem nodig heeft weet nu waar
   hij zit. Eén sleutel per uitklapper, en hij blijft open tot je hem dichtdoet. */
const UIT={};
function uitklapHTML(id,kop,tekst,teken){
  const op=!!UIT[id];
  return '<button class="uitklapper" onclick="UIT[\''+id+'\']=!UIT[\''+id+'\'];'+teken+'">'+
    esc(kop)+'<span class="ll-arr">'+(op?'▾':'▸')+'</span></button>'+
    (op?('<div class="uitklap">'+tekst+'</div>'):'');
}

/* Kom je hier vanaf je bonenplank, dan wil je eerst zien waar je zelf al
   geweest bent — en pas daarna de rest van de wereld. */
function bpPlankBlok(){
  const totaal=Object.keys(BP_INFO).length, gehad=bpGehad();
  const bonen=(state.beans||[]).filter(b=>bpRegios(b).length);
  const wensen=(state.wishlist||[]).filter(w=>bpRegios(w).length);
  if(!bonen.length&&!wensen.length)return '';
  const chip=(o,fn)=>{
    const r=bpRegios(o)[0];
    return '<button class="bp-chip" onclick="'+fn+'(\''+o.id+'\')">'+
      esc(o.name||o.naam||bpRegioTekst(r))+
      '<em>'+esc(bpIsBlend(o)?'blend':bpRegioTekst(r))+'</em></button>';
  };
  /* Dichtgeklapt is dit één regel; wie zijn eigen plank zoekt vindt hem meteen, en
     wie de wereld af wil zoeken heeft er geen last van. */
  const op=!!UIT.plank;
  const tel=[bonen.length?(bonen.length+(bonen.length===1?' bean':' beans')):'',
             wensen.length?(wensen.length+' on your list'):''].filter(Boolean).join(' · ');
  let h='<div class="bp-blok vol"><button class="bp-klap" onclick="UIT.plank=!UIT.plank;bpTeken(true)">'+
    '<h3>Your shelf</h3><span class="tel">'+esc(tel)+'</span>'+
    '<span class="ll-arr">'+(op?'▾':'▸')+'</span></button>';
  if(!op)return h+'</div>';
  h+='<p class="bp-zacht">Tik een naam aan en de kaart zoomt naar zijn streek, met het '+
    'verhaal erbij.</p>';
  if(bonen.length)h+='<div class="bp-et">Beans you have</div><div class="bp-chips">'+
    bonen.map(b=>chip(b,'bpVanBoon')).join('')+'</div>';
  if(wensen.length)h+='<div class="bp-et">On your wishlist</div><div class="bp-chips">'+
    wensen.map(w=>chip(w,'bpVanWens')).join('')+'</div>';
  h+='<p class="bp-zacht" style="margin-top:9px">Nog nooit gehad: '+
    (totaal-gehad.size)+' van de '+totaal+' landen met een verhaal.</p></div>';
  return h;
}
function bpWereld(){
  const gehad=bpGehad();
  return '<div class="bp-kop"><div class="t">Coffee finder</div>'+
    '<button class="bp-terug" onclick="bpTerug()">‹ '+(bpVanaf==='beans'?'beans':'learn')+'</button></div>'+
    uitklapHTML('wereld','why coffee grows only there',
      'Koffie groeit alleen in de band rond de evenaar: warm genoeg, en nooit vorst. Elk stuk '+
      'van die gordel smaakt anders. Kies waar je nieuwsgierig naar bent, zoom door naar een land '+
      'en een streek, en je eindigt met een lijstje waarmee je de goede zak herkent.','bpTeken(true)')+
    fdBalkHTML()+
    '<div class="bp-doos">'+bpKaartHTML()+bpPlek()+
    '<div class="bp-tip">tik op een werelddeel om in te zoomen</div></div>'+
    '<div class="bp-legenda"><span><i></i> nog niet gehad</span>'+
    '<span><i class="had"></i> al eens gehad'+(gehad.size?(' ('+gehad.size+')'):'')+'</span>'+
    ((state.wishlist||[]).length?'<span><i class="wenskleur"></i> op je lijstje</span>':'')+'</div>'+
    fdUitBlokHTML()+
    bpPlankBlok()+
    Object.keys(BP_DELEN).map(d=>
      '<button class="bp-kies" onclick="bpKies(\'deel\',\''+d+'\')">'+
      '<span class="k1">'+esc(BP_DELEN[d].naam)+'</span>'+
      '<span class="k2">'+BP_DELEN[d].bekend+'</span></button>').join('');
}
function bpDeelScherm(){
  const D=BP_DELEN[bpDeel], gehad=bpGehad();
  const landen=BP_LANDEN.filter(l=>l.deel===bpDeel&&BP_INFO[l.id]);
  return '<div class="bp-kop"><div class="t">'+esc(D.naam)+'</div>'+
    '<button class="bp-terug" onclick="bpTerug()">‹ wereld</button></div>'+
    '<div class="bp-kruimel"><button onclick="bpTerug()">de wereld</button> › <b>'+
    esc(D.kort)+'</b></div>'+
    '<div class="bp-doos">'+bpKaartHTML()+bpPlek()+
    '<div class="bp-tip">tik op een land</div></div>'+
    '<div class="bp-blok vol"><h3>What this part is known for</h3>'+
    '<p>'+D.bekend+'</p><p>'+D.waarom+'</p>'+
    '<div class="bp-et">What you\'ll find here</div>'+
    '<p class="bp-zacht">'+D.proc+'<br>hoogte meestal '+D.hoogte+'</p></div>'+
    '<div class="bp-et">Countries with a story</div>'+
    landen.map(l=>{
      const inf=BP_INFO[l.id];
      return '<button class="bp-kies" onclick="bpKies(\'land\',\''+l.id+'\')">'+
        '<span class="k1">'+esc(l.naam)+(gehad.has(l.id)?' ✓':'')+'<em>'+esc(inf.hoogte)+'</em></span>'+
        '<span class="k2">'+esc(inf.smaak.slice(0,3).join(' · '))+'</span></button>';
    }).join('')+
    '<div class="bp-zacht" style="margin-top:9px">De lichtere landen op de kaart telen ook koffie. '+
    'Die krijgen hun eigen verhaal zodra we ze uitschrijven.</div>';
}
function bpLandScherm(){
  const L=BP_LAND[bpLandId], inf=BP_INFO[bpLandId], D=BP_DELEN[bpDeel];
  return '<div class="bp-kop"><div class="t">'+esc(L.naam)+'</div>'+
    '<button class="bp-terug" onclick="bpTerug()">‹ '+esc(D.kort)+'</button></div>'+
    '<div class="bp-kruimel"><button onclick="bpNaarWereld()">de wereld</button> › '+
    '<button onclick="bpKies(\'deel\',\''+bpDeel+'\')">'+esc(D.kort)+
    '</button> › <b>'+esc(L.naam)+'</b></div>'+
    '<div class="bp-doos">'+bpKaartHTML()+bpPlek()+
    '<div class="bp-tip">tik op een genummerde stip, of kies hieronder</div></div>'+
    '<div class="bp-blok vol"><h3>What this country is known for</h3>'+
    '<p>'+inf.bekend+'</p>'+
    '<div class="bp-et">The notes the roaster puts on the bag</div>'+bpSmaken(inf.smaak)+
    '<div class="bp-et">Variety</div><p class="bp-zacht">'+esc(inf.var)+'</p>'+
    '<div class="bp-et">Altitude</div><p class="bp-zacht">'+esc(inf.hoogte)+
    ' — hoe hoger, hoe langzamer de kers rijpt. Dat maakt de boon dichter, zoeter en '+
    'levendiger van zuur.</p></div>'+
    '<div class="bp-blok"><h3>How the farmer dries it</h3>'+bpProcBlok(inf.proc)+'</div>'+
    (bpVoor?('<div class="bp-blok vol"><h3>Which region?</h3>'+
      '<p class="bp-zacht">Zegt de zak alleen het land, dan is dat ook goed.</p>'+
      '<div class="bp-knoppen"><button class="bp-knop leeg" onclick="bpNeemHerkomst(null)">'+
      'alleen '+esc(L.naam)+', geen streek</button></div></div>'):'')+
    '<div class="bp-et">The regions</div>'+
    (function(){const g=bpGehadStreken(bpLandId);
      return (inf.streken||[]).map((st,i)=>{
        const op=bpStreek===i;
        return '<div class="bp-streek'+(op?' op':'')+'">'+
          '<button class="bp-kies'+(op?' sel':'')+'" onclick="bpKies(\'streek\','+i+')">'+
          '<span class="k1"><span class="bp-bol">'+(i+1)+'</span>'+esc(st.n)+(g.has(i)?' ✓':'')+
          '<em>'+esc(st.h||inf.hoogte)+'</em></span>'+
          '<span class="k2">'+esc(st.s.join(' · '))+'</span></button>'+
          (op?bpStreekBlok():'')+'</div>';
      }).join('');})();
}
/* Wat er onder een aangetikte streek uitklapt. Bewust zonder eigen kaders:
   het zit al ín de streekkaart, en een kaart in een kaart leest niet. */
function bpStreekBlok(){
  const inf=BP_INFO[bpLandId], st=inf.streken[bpStreek], L=BP_LAND[bpLandId];
  const proc=(bpProc&&inf.proc.includes(bpProc))?bpProc:inf.proc[0];
  const br=bpBrand||'light', me=bpMeth||bpEersteMethode();
  return '<div class="bp-open">'+
    '<p>'+esc(st.t)+'</p>'+bpSmaken(st.s)+
    '<div class="bp-et">Altitude</div><p class="bp-zacht">'+esc(st.h||inf.hoogte)+
    ' — hoe hoger, hoe langzamer de kers rijpt. Dat maakt de boon dichter, zoeter en '+
    'levendiger van zuur.</p>'+
    bpVarBlok(st.v||inf.var)+

    '<div class="bp-deel"><h4>How do you want it?</h4>'+
    '<div class="bp-et">Process</div><div class="bp-chips">'+
    inf.proc.map(p=>'<button class="bp-chip'+(p===proc?' sel':'')+'" onclick="bpZet(\'proc\',\''+p+'\')">'+esc(p)+'</button>').join('')+
    '</div><p class="bp-zacht" style="margin-top:7px">'+esc(BP_PROCES[proc].u)+' Dat geeft een smaak die '+
    esc(BP_PROCES[proc].sm)+', en een mondgevoel dat '+esc(BP_PROCES[proc].mo)+' is.</p>'+
    '<div class="bp-et">Roast</div><div class="bp-chips">'+
    Object.keys(BP_BRAND).map(b=>'<button class="bp-chip'+(b===br?' sel':'')+'" onclick="bpZet(\'brand\',\''+b+'\')">'+b+'</button>').join('')+
    '</div><p class="bp-zacht" style="margin-top:7px">'+BP_BRAND[br].t+'</p>'+
    '<div class="bp-et">What you\'ll brew it on</div><div class="bp-chips">'+
    bpMethodes().map(m=>'<button class="bp-chip'+(m.id===me?' sel':'')+'" onclick="bpZet(\'meth\',\''+m.id+'\')">'+esc(m.name)+'</button>').join('')+
    '</div><p class="bp-zacht" style="margin-top:7px">'+bpMethodeTip(me,br)+'</p></div>'+

    '<div class="bp-deel"><h4>What to look for on the bag</h4>'+
    '<div class="bp-zak">'+
    '<em>land</em> '+esc(L.naam)+'<br>'+
    '<em>streek</em> '+esc(st.n)+'<br>'+
    '<em>proces</em> '+esc(proc)+'<br>'+
    '<em>variëteit</em> '+esc(st.v||inf.var)+'<br>'+
    '<em>branding</em> '+esc(br)+'<br>'+
    '<em>smaak</em> '+esc(st.s.join(', '))+'<br>'+
    '<em>gebrand</em> korter dan 3 weken geleden</div>'+
    '<div class="bp-zoek">🔍 '+esc(bpZoekregel())+'</div>'+
    '<div class="bp-knoppen">'+
    '<button class="bp-knop leeg" onclick="bpKopieer()">kopieer</button>'+
    '<button class="bp-knop leeg" onclick="bpZoekOpen()">zoek via Google</button></div>'+
    '<p class="bp-zacht" style="margin-top:9px">Wat er vandaag bij een brander op de plank '+
    'ligt weet de app niet — dat laatste klikje blijft van jou.</p>'+
    '<div class="bp-knoppen">'+(bpVoor
      ? '<button class="bp-knop" onclick="bpNeemHerkomst('+bpStreek+')">✓ deze is het</button>'
      : '<button class="bp-knop" onclick="bpOpLijst()">Add to wishlist</button>')+'</div>'+
    '</div>'+bpUitJeKast(bpLandId,bpStreek)+'</div>';
}
function bpMethodes(){
  const aan=(state.methods||[]).filter(m=>m.on);
  return aan.length?aan:[{id:'v60',name:'v60'}];
}
function bpEersteMethode(){
  const m=bpMethodes().find(x=>methodFamily(x)==='filter')||bpMethodes()[0];
  return m.id;
}
function bpZoekregel(){
  const inf=BP_INFO[bpLandId], st=inf.streken[bpStreek], L=BP_LAND[bpLandId];
  const proc=(bpProc&&inf.proc.includes(bpProc))?bpProc:inf.proc[0];
  const br=bpBrand||'light';
  return [L.naam,st.n,proc,(br==='dark'?'espresso':'filter'),'specialty koffie kopen'].join(' ');
}
function bpMethodeTip(id,br){
  const fam=methodFamily(id);
  const molen=(state.gear||[]).find(g=>g.kind==='grinder'&&(g.category===fam||g.category==='algemeen'));
  const opMolen=molen?(' op je '+esc(molen.name)):'';
  if(fam==='espresso')return br==='light'
    ? ('Een light gebrande boon op espresso vraagt fijner malen dan je gewend bent'+opMolen+
       ', en het zuur wordt scherper. Mooi als het lukt, maar reken op een paar shots afstellen.')
    : 'Op espresso komt hier vooral het zoete en de body naar voren. Makkelijk af te stellen.';
  if(id==='aeropress')return 'De AeroPress vergeeft veel: kortere contacttijd, dus het zuur blijft zacht. Een fijne manier om een nieuwe boon te leren kennen.';
  if(id==='chemex')return 'Het dikke filter houdt olie tegen. Dat geeft een heldere, bijna theeachtige kop — mooi bij bloemige koffie.';
  return 'Filter laat het meest van de herkomst horen. Voor een boon waar je nieuwsgierig naar bent is dit de eerlijkste keuze.';
}

/* ---- klikken ---- */
function bpKies(wat,waarde){
  if(wat==='deel'){bpDeel=waarde;bpLandId=null;bpStreek=null;bpNiv='deel';bpZoom(BP_VIEWS[bpDeel]);}
  else if(wat==='land'){
    if(!BP_INFO[waarde])return;
    bpLandId=waarde;bpStreek=null;bpProc=null;bpVarOpen=null;bpNiv='land';bpZoom(bpLandView(waarde));
  }else if(wat==='streek'){
    bpStreek=(bpStreek===waarde)?null:waarde;bpVarOpen=null;
  }
  bpTeken(wat==='streek');
}
function bpOpen(vanaf){bpVoor=null;bpVanaf=vanaf||'learn';go('beanpick');}
function bpNaarWereld(){
  bpNiv='wereld';bpDeel=null;bpLandId=null;bpStreek=null;bpZoom(BP_VIEWS.wereld);bpTeken();
}
function bpTerug(){
  if(bpNiv==='land'){bpNiv='deel';bpLandId=null;bpStreek=null;bpZoom(BP_VIEWS[bpDeel]);}
  else if(bpNiv==='deel'){bpNiv='wereld';bpDeel=null;bpZoom(BP_VIEWS.wereld);}
  else{go(bpVoor?'beanform':(bpVanaf==='beans'?'beans':'learn'));bpVoor=null;return;}
  bpTeken();
}
function bpZet(k,v){
  if(k==='proc')bpProc=v; else if(k==='brand')bpBrand=v; else bpMeth=v;
  bpTeken(true);
}
async function bpKopieer(){
  const t=bpZoekregel();
  try{await navigator.clipboard.writeText(t);toast('✓ zoekregel gekopieerd');}
  catch(e){toast(t);}
}
function bpZoekOpen(){
  const u='https://www.google.com/search?q='+encodeURIComponent(bpZoekregel());
  window.open(u,'_blank','noopener');
}
/* De uitkomst gaat op je plank te staan als wens. Koop je hem echt, dan staat
   alles al ingevuld en hoef je alleen de branddatum nog toe te voegen. */
/* ---------------- je lijstje ----------------
   Een wens is een zak die je nog niet hebt. Hij ontstaat aan het eind van de
   keuzehulp, of je vult hem zelf in als je er ergens een tegenkwam. In
   allebei de gevallen kun je hem toekennen aan een plek op de kaart, en dan
   staat hij daar tussen je eigen bonen.                                    */
function bpNieuweWens(){openBeanForm(true);}
function bpWijzigWens(id){
  const w=(state.wishlist||[]).find(x=>x.id===id); if(!w)return;
  openBeanForm(true);
  editingWens=id;
  const zet=(veld,val)=>{const el=document.getElementById(veld);if(el)el.value=val||'';};
  zet('b-name',w.naam||w.name||''); zet('b-roaster',w.brander);
  zet('b-url',w.url); zet('b-process',w.proces); zet('b-variety',w.variety);
  zet('b-altitude',w.altitude); zet('b-notes',w.notitie);
  zet('b-roasternotes',w.roasternotes||(w.smaak||[]).join(', '));
  const regs=bpRegios(w).map(r=>({land:r.land,i:r.i}));
  zet('b-origin',w.origin||regs.map(bpRegioTekst).join(' · '));
  beanFormRegions=regs; renderBeanHerkomst();
  beanFormRoast=w.brand||null; renderBeanRoast();
  renderBeanMode();
}
/* vanuit de kaart: de streek die je bekeek als wens wegschrijven */
function bpOpLijst(){
  const inf=BP_INFO[bpLandId], st=inf.streken[bpStreek], L=BP_LAND[bpLandId];
  const proc=(bpProc&&inf.proc.includes(bpProc))?bpProc:inf.proc[0];
  if(!Array.isArray(state.wishlist))state.wishlist=[];
  if(state.wishlist.some(w=>bpHoortBij(w,bpLandId,bpStreek))){
    toast('staat al op je lijstje');return;
  }
  state.wishlist.push({id:uid(),naam:st.n+' · '+L.naam,brander:'',url:'',
    regions:[{land:bpLandId,i:bpStreek}],proces:proc,variety:st.v||inf.var,
    brand:bpBrand||'light',smaak:st.s.slice(),notitie:'',
    zoek:bpZoekregel(),at:Date.now()});
  save();toast('✓ op je lijstje gezet');bpTeken(true);
}
function bpVanLijst(id){
  const w=(state.wishlist||[]).find(x=>x.id===id);
  if(w&&!confirm('“'+(w.naam||'deze wens')+'” van je lijstje halen?'))return;
  state.wishlist=(state.wishlist||[]).filter(x=>x.id!==id);
  save();renderBeans();toast('van het lijstje af');
}
/* "gekocht" is hetzelfde formulier, maar dan omgezet naar je plank. De wens
   blijft staan tot je opslaat, dus annuleren kost je niets. */
function bpGekocht(id){
  bpWijzigWens(id);
  if(editingWens!==id)return;
  beanZetMode(false);
  toast('van je lijstje — vul de branddatum aan');
}
function bpWensDicht(){
  state.wensDicht=!state.wensDicht;save();renderBeans();
}
function bpWensHTML(){
  if(!featOn('beanpick'))return '';
  const lijst=state.wishlist||[];
  const kop='<button class="wens-kop" onclick="bpWensDicht()">'+
    '<span class="hand">Bean wishlist</span>'+
    '<span class="sd">'+(lijst.length?(lijst.length+' nog niet gekocht'):'nog leeg')+'</span>'+
    '<span class="wens-arr">'+(state.wensDicht?'›':'⌄')+'</span></button>';
  if(state.wensDicht)return '<div class="sect wens-sect">'+kop+'</div>';
  if(!lijst.length)return '<div class="sect wens-sect">'+kop+'</div>'+
    '<div class="empty-note">nog niets op je lijstje. Kom je ergens een mooie zak tegen, '+
    'zet hem hier neer via New Bean — met de link erbij.</div>';
  return '<div class="sect wens-sect">'+kop+'</div>'+
    lijst.map(w=>{
      const regs=bpRegios(w);
      const blend=regs.length>1;
      return '<div class="bean-card sketch soft wens-card">'+
      '<div class="bn hand">'+esc(w.naam||'zonder naam')+
        (blend?' <span class="wens-tag">blend</span>':'')+'</div>'+
      '<div class="bm">'+
        (w.brander?('van '+esc(w.brander)+'<br>'):'')+
        (regs.length?(regs.map(bpRegioTekst).map(esc).join(' · ')+'<br>'):'')+
        [w.proces,w.brand].filter(Boolean).map(esc).join(', ')+
        ((w.smaak||[]).length?(' · '+esc(w.smaak.join(', '))):'')+
        (w.variety?('<br>'+esc(w.variety)):'')+
        (w.notitie?('<br>'+esc(w.notitie)):'')+'</div>'+
      '<div class="wens-rij">'+
      '<button class="lp sel" onclick="bpGekocht(\''+w.id+'\')">gekocht ✓</button>'+
      (BrewSecurity.safeLink(w.url)?('<a class="lp" href="'+esc(BrewSecurity.safeLink(w.url))+'" target="_blank" rel="noopener">bekijk de zak ↗</a>'):'')+
      '<button class="lp" onclick="bpWijzigWens(\''+w.id+'\')">wijzig</button>'+
      '<button class="lp" onclick="bpVanLijst(\''+w.id+'\')">×</button>'+
      '</div></div>';
    }).join('');
}

/* ---------------- de boon en de kaart aan elkaar ----------------
   Een zak heeft niet altijd één herkomst. Een single origin komt van één
   streek, een blend van meer, en allebei moeten ze op de kaart terug te
   vinden zijn. Vandaar een lijstje herkomsten in plaats van één veld.

   Heb je nooit iets aangewezen, dan blijft de oude tekstherkenning het
   vangnet: dan leest de app de landnaam uit wat er op de zak staat.      */
function bpRegios(o){
  if(!o)return [];
  let ruw=Array.isArray(o.regions)?o.regions:(o.region?[o.region]:[]);
  const uit=[];
  ruw.forEach(r=>{
    if(!r||!BP_INFO[r.land])return;
    const inf=BP_INFO[r.land];
    const i=(r.i!=null&&inf.streken&&inf.streken[r.i])?r.i:null;
    if(!uit.some(x=>x.land===r.land&&x.i===i))uit.push({land:r.land,i,zelf:true});
  });
  if(uit.length)return uit;
  const land=bpLandVanBoon(o);
  if(!land||!BP_INFO[land])return [];
  return [{land,i:bpStreekVanBoon(o,land),zelf:false}];
}
function bpIsBlend(o){return bpRegios(o).length>1;}
function bpRegioTekst(r){
  const inf=BP_INFO[r.land]; if(!inf)return '';
  const st=(r.i!=null)?inf.streken[r.i]:null;
  return st?(st.n+' · '+BP_LAND[r.land].naam):BP_LAND[r.land].naam;
}
function bpRegioHoogte(r){
  const inf=BP_INFO[r.land]; if(!inf)return '';
  const st=(r.i!=null)?inf.streken[r.i]:null;
  return (st&&st.h)?st.h:inf.hoogte;
}
function bpRegioVar(r){
  const inf=BP_INFO[r.land]; if(!inf)return '';
  const st=(r.i!=null)?inf.streken[r.i]:null;
  return (st&&st.v)?st.v:inf.var;
}
function bpRegioSmaak(r){
  const inf=BP_INFO[r.land]; if(!inf)return [];
  const st=(r.i!=null)?inf.streken[r.i]:null;
  return st?st.s:inf.smaak;
}
// hoort deze boon of wens bij die plek? (i weglaten = ergens in dat land)
function bpHoortBij(o,landId,i){
  return bpRegios(o).some(r=>r.land===landId&&(i==null||r.i===i));
}
function bpBonenVoor(landId,i){
  return (state.beans||[]).filter(b=>bpHoortBij(b,landId,i));
}
function bpWensenVoor(landId,i){
  return (state.wishlist||[]).filter(w=>bpHoortBij(w,landId,i));
}
function bpScoreVan(b){
  const sc=(state.brews||[]).filter(x=>x.beanId===b.id&&x.score!=null&&x.score!=='')
    .map(x=>+x.score);
  if(!sc.length)return null;
  return (sc.reduce((a,c)=>a+c,0)/sc.length).toFixed(1).replace('.',',');
}
function bpSmaakVan(b){
  return [...new Set([].concat(...(state.brews||[]).filter(x=>x.beanId===b.id)
    .map(x=>x.tags||[])))];
}
/* Oude wensen bewaarden hun herkomst als losse namen. Die zoeken we één keer
   terug op, zodat ze ook op de kaart verschijnen. */
function bpMigreerWensen(){
  let veranderd=false;
  (state.wishlist||[]).forEach(w=>{
    if(Array.isArray(w.regions)||!w.land)return;
    const land=BP_LANDEN.find(l=>l.naam===w.land);
    if(land&&BP_INFO[land.id]){
      const st=(BP_INFO[land.id].streken||[]).findIndex(x=>x.n===w.streek);
      w.regions=[{land:land.id,i:st>=0?st:null}];
      if(!w.naam)w.naam=w.streek||land.naam;
      veranderd=true;
    }
  });
  if(veranderd)save();
}

/* ---- de kaart als invoermethode ----
   Vanuit het bonenformulier of het wensformulier open je de kaart om een
   streek aan te wijzen. bpVoor onthoudt waar je vandaan kwam.            */
let bpVoor=null;              // null als je gewoon rondkijkt, 'bean' als een formulier wacht
let bpVanaf='learn';          // waar je de kaart binnenkwam: 'beans' of 'learn'
let beanFormRegions=[];
function bpKiesHerkomstVoor(wat){
  bpVoor=wat||'bean'; bpVarOpen=null;
  const lijst=beanFormRegions;
  const r=lijst[lijst.length-1];
  if(r&&BP_INFO[r.land]){
    bpDeel=BP_LAND[r.land].deel; bpLandId=r.land; bpNiv='land';
    bpStreek=(r.i!=null)?r.i:null; bpView=bpLandView(r.land).slice();
  }else{
    bpNiv='wereld'; bpDeel=null; bpLandId=null; bpStreek=null;
    bpView=BP_VIEWS.wereld.slice();
  }
  go('beanpick');
}
function bpKiesHerkomst(){bpKiesHerkomstVoor('bean');}
function bpNeemHerkomst(i){
  const landId=bpLandId, inf=BP_INFO[landId];
  const nieuw={land:landId,i:(i!=null?i:null)};
  if(!beanFormRegions.some(r=>r.land===nieuw.land&&r.i===nieuw.i))beanFormRegions.push(nieuw);
  const eerste=(beanFormRegions.length===1);
  const el=id=>document.getElementById(id);
  const leegVul=(id,v)=>{const e=el(id);if(e&&!e.value.trim()&&v)e.value=v;};
  const o=el('b-origin');
  if(o)o.value=beanFormRegions.map(bpRegioTekst).join(' · ');
  if(eerste){
    leegVul('b-variety',bpRegioVar(nieuw));
    leegVul('b-altitude',String(bpRegioHoogte(nieuw)).replace(/\s*m$/,'').trim());
    if(inf.proc.length===1)leegVul('b-process',inf.proc[0]);
    leegVul('b-name',bpRegioTekst(nieuw));
  }
  bpVoor=null; go('beanform'); renderBeanHerkomst();
  toast('✓ herkomst erbij');
}
function bpHerkomstWeg(i){beanFormRegions.splice(i,1);renderBeanHerkomst();}
function renderBeanHerkomst(){
  const el=document.getElementById('b-herkomst');
  const veld=document.getElementById('b-herkomst-veld');
  if(!el||!veld)return;
  if(!featOn('beanpick')){veld.style.display='none';return;}
  veld.style.display='';
  el.innerHTML=bpHerkomstKiezer(beanFormRegions,'bpHerkomstWeg','bpKiesHerkomst');
}
/* Dezelfde kiezer voor een boon en voor een wens: een rijtje herkomsten met
   een kruisje, en een knop om er een bij te zoeken op de kaart. */
function bpHerkomstKiezer(lijst,wegFn,kiesFn){
  let h='';
  if(!lijst.length){
    h+='<div class="bh-rij"><div class="bh-uit"><span>weet je waar hij vandaan komt? '+
      'Wijs het aan op de kaart, dan vult de app de rest voor je in.</span></div></div>';
  }else{
    if(lijst.length>1)h+='<div class="bh-blend">blend — '+lijst.length+' herkomsten</div>';
    h+=lijst.map((r,i)=>'<div class="bh-rij"><div class="bh-uit"><b>'+esc(bpRegioTekst(r))+
      '</b><span>'+esc(bpRegioHoogte(r))+' · '+esc(bpRegioSmaak(r).join(', '))+'</span></div>'+
      '<button type="button" class="bh-knop" onclick="'+wegFn+'('+i+')">×</button></div>').join('');
  }
  h+='<div class="bh-rij" style="margin-top:6px"><button type="button" class="bh-knop aan" '+
    'onclick="'+kiesFn+'()">'+(lijst.length?'＋ nog een herkomst':'kies op de kaart')+'</button></div>';
  return h;
}


/* ---- wat de kaart over jouw zak vertelt, op de bonenplank ---- */
function bpHerkomstBlok(b){
  if(!featOn('beanpick'))return '';
  const regs=bpRegios(b); if(!regs.length)return '';
  const geproefd=bpSmaakVan(b);
  const belooft=[...new Set([].concat(...regs.map(bpRegioSmaak)))];
  const gok=regs.some(r=>!r.zelf);
  return '<div class="bk-herkomst">'+
    '<div class="n hand">'+(regs.length>1?'blend — ':'')+
    regs.map(r=>esc(bpRegioTekst(r))).join(' · ')+
    (gok?' <span class="bp-zacht">(uit de tekst op de zak)</span>':'')+'</div>'+
    '<div class="r">'+regs.map(r=>esc(bpRegioHoogte(r))).join(' · ')+'<br>'+
    '<b>de streek belooft</b> '+esc(belooft.join(', '))+
    (geproefd.length?('<br><b>jij proefde</b> '+esc(geproefd.join(', '))):'')+'</div>'+
    '<div class="wens-rij" style="margin-top:8px">'+
    regs.map((r,i)=>'<button class="lp" onclick="event.stopPropagation();bpVanBoon(\''+
      b.id+'\','+i+')">'+(regs.length>1?esc(bpRegioTekst(r)):'bekijk op de kaart')+
      ' →</button>').join('')+'</div></div>';
}

/* ---- je plank als kaartje boven de bonenlijst, en de deur naar de kaart ---- */
function bpPlankKaartHTML(){
  if(!featOn('beanpick'))return '';
  const punten=[];
  const zet=(o,soort)=>{
    bpRegios(o).forEach(r=>{
      const st=(r.i!=null)?BP_INFO[r.land].streken[r.i]:null;
      const x=st?bpX(st.ll[0]):+bpMidden(BP_LAND[r.land])[0];
      const y=st?bpY(st.ll[1]):+bpMidden(BP_LAND[r.land])[1];
      punten.push({x,y,id:o.id,soort});
    });
  };
  (state.beans||[]).forEach(b=>zet(b,'mijn'));
  (state.wishlist||[]).forEach(w=>zet(w,'wens'));
  const landen=new Set();
  (state.beans||[]).forEach(b=>bpRegios(b).forEach(r=>landen.add(r.land)));
  const v=bpDoos(BP_LANDEN,6);
  let sv='<svg viewBox="'+v.join(' ')+'" preserveAspectRatio="xMidYMid meet">';
  sv+='<rect class="band" x="-200" y="'+bpY(23.5)+'" width="500" height="'+(bpY(-23.5)-bpY(23.5))+'"/>';
  BP_ACHTER.forEach(pl=>{
    sv+='<path class="achter" d="M'+pl.map(q=>bpX(q[0]).toFixed(1)+' '+bpY(q[1]).toFixed(1)).join('L')+'Z"/>';
  });
  BP_LANDEN.forEach(l=>{sv+='<path class="achter" d="'+bpPad(l)+'"/>';});
  punten.forEach(p=>{
    sv+='<circle class="'+p.soort+'" cx="'+p.x+'" cy="'+p.y+'" r="4.5" onclick="event.stopPropagation();'+
      (p.soort==='mijn'?('bpVanBoon(\''+p.id+'\')'):('bpVanWens(\''+p.id+'\')'))+'"/>';
  });
  sv+='</svg>';
  return '<button class="plank-kaart" onclick="bpOpen(\'beans\')">'+sv+'</button>';
}

/* ---- uit je eigen kast ----
   Onderaan een streek: wat jij van hier al hebt staan, en wat er nog op je
   lijstje wacht. Een blend duikt hier bij elk van zijn herkomsten op, met
   erbij waar hij verder nog vandaan komt.                                  */
function bpUitJeKast(landId,i){
  if(i==null)return '';
  const bonen=bpBonenVoor(landId,i), wensen=bpWensenVoor(landId,i);
  const elders=bpBonenVoor(landId,null).length-bonen.length;
  if(!bonen.length&&!wensen.length){
    return '<div class="bp-mijn"><div class="bp-et">From your shelf</div>'+
      '<p class="bp-zacht">Hier heb je nog niets van staan.'+
      (elders?(' Wel '+elders+' zak'+(elders===1?'':'ken')+' van elders uit '+
        esc(BP_LAND[landId].naam)+'.'):'')+'</p></div>';
  }
  const ander=(o)=>{
    const rest=bpRegios(o).filter(r=>!(r.land===landId&&r.i===i));
    return rest.length?('ook uit '+rest.map(bpRegioTekst).join(' · ')):'';
  };
  let h='<div class="bp-mijn"><div class="bp-et">From your shelf</div>';
  h+=bonen.map(b=>{
    const sc=bpScoreVan(b), n=(state.brews||[]).filter(x=>x.beanId===b.id).length;
    const regel=[b.roaster,b.process,b.variety].filter(Boolean).join(' · ');
    const staat=(b.inStock===false)?'op is op':(sc?('jij gaf hem '+sc):
      (n?(n+' brew'+(n===1?'':'s')):'nog niet gezet'));
    return '<button class="bp-mijnkaart" onclick="bpNaarBoon(\''+b.id+'\')">'+
      '<span class="mn hand">'+esc(b.name)+
      (bpIsBlend(b)?' <span class="wens-tag">blend</span>':'')+'</span>'+
      '<span class="mr">'+[regel,ander(b),staat].filter(Boolean).map(esc).join(' — ')+
      '</span></button>';
  }).join('');
  h+=wensen.map(w=>{
    const regel=[w.brander,w.proces,w.brand].filter(Boolean).join(' · ');
    return '<button class="bp-mijnkaart wens" onclick="bpWijzigWens(\''+w.id+'\')">'+
      '<span class="mn hand">'+esc(w.naam||'zonder naam')+
      ' <span class="wens-tag">op je lijstje</span>'+
      (bpIsBlend(w)?' <span class="wens-tag">blend</span>':'')+'</span>'+
      '<span class="mr">'+[regel,ander(w)].filter(Boolean).map(esc).join(' — ')+
      '</span></button>';
  }).join('');
  if(elders>0)h+='<p class="bp-zacht">En '+elders+' zak'+(elders===1?'':'ken')+
    ' van elders uit '+esc(BP_LAND[landId].naam)+'.</p>';
  return h+'</div>';
}
/* De weg terug: van de kaart naar de kaart van die boon op je plank. */
function bpNaarBoon(id){
  const b=beanById(id); if(!b)return;
  if(!expandedBeans.has(id))expandedBeans.add(id);
  if(b.inStock===false)extraKastOpen=true;
  go('beans');
  setTimeout(()=>{
    const el=document.querySelector('.bean-card[data-bean="'+id+'"]');
    if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
  },60);
}

/* ---- de terugweg: van een boon op je plank naar zijn plek op de kaart ---- */
function bpVanBoon(beanId,idx){
  const b=beanById(beanId); if(!b)return;
  bpNaarPlek(bpRegios(b)[idx||0],'van deze boon weet ik het land nog niet');
}
function bpVanWens(wensId,idx){
  const w=(state.wishlist||[]).find(x=>x.id===wensId); if(!w)return;
  bpNaarPlek(bpRegios(w)[idx||0],'van deze wens weet ik het land nog niet');
}
/* Eén plek op de kaart openen, gebruikt door beide terugwegen hierboven. */
function bpNaarPlek(r,klacht){
  if(!r||!BP_INFO[r.land]){toast(klacht);return;}
  bpVoor=null; bpVanaf='beans'; bpDeel=BP_LAND[r.land].deel; bpLandId=r.land; bpNiv='land';
  bpStreek=(r.i!=null)?r.i:null; bpProc=null; bpVarOpen=null;
  bpView=bpLandView(r.land).slice();
  bpNaarStreek=(bpStreek!=null);
  go('beanpick');
}
/* ================= coffee finder: zoeken en filteren =================
   Twee manieren om bij een streek te komen zonder eerst de kaart af te struinen:
   je typt wat je zoekt, of je laat vijf vragen de 119 streken uitdunnen.

   De hele kern is dat de 57 losse smaakwoorden uit BP_INFO op zeven families
   gelegd worden. Zonder die ordening kun je niet filteren -- 'cacao',
   'chocolade' en 'donkere chocolade' zijn voor een zoeker hetzelfde woord.  */
const FD_FAM={
  fris:  {n:'fresh fruit',   u:'citrus en rood fruit',
          w:['sinaasappel','citroen','citrus','limoen','grapefruit','bergamot','zachte citrus',
             'rood fruit','rode bes','zwarte bes','aardbei','bosbes','blauwe bes','rode vruchten',
             'rode appel','appel','tomaat','tomaat-zoet']},
  steen: {n:'stone fruit',   u:'perzik, pruim, tropisch',
          w:['perzik','abrikoos','pruim','tropisch fruit','rijp fruit','vijg','gedroogd fruit',
             'gedroogde vijg','rozijn','rode wijn','rum']},
  bloem: {n:'floral & tea',  u:'jasmijn, zwarte thee',
          w:['bloemig','jasmijn','zwarte thee']},
  zoet:  {n:'sweet & caramel',u:'honing, bruine suiker',
          w:['honing','bruine suiker','karamel','toffee']},
  choc:  {n:'chocolate',     u:'cacao tot donkere chocolade',
          w:['cacao','chocolade','donkere chocolade','melkchocolade','cacaonib']},
  noot:  {n:'nutty',         u:'amandel, hazelnoot',
          w:['noot','amandel','hazelnoot','macadamia','walnoot','pinda']},
  kruid: {n:'spice & wood',  u:'specerij, tabak, rook',
          w:['specerij','kaneel','kardemom','zwarte peper','kruidig','tabak','cederhout',
             'hout','rook','aarde']},
};
const FD_FAMS=Object.keys(FD_FAM);
const FD_WOORD={};
FD_FAMS.forEach(f=>FD_FAM[f].w.forEach(w=>{FD_WOORD[w]=f;}));
/* het smaakwiel waarmee je je brews tagt, in dezelfde zeven families */
const FD_WIEL={berry:'fris',citrus:'fris',floral:'bloem',honey:'zoet',caramel:'zoet',
  choc:'choc',nutty:'noot',spice:'kruid'};
/* hoe levendig smaakt een familie? 0 = rond en zacht, 1 = fel en helder */
const FD_ZUUR={fris:1,bloem:.9,steen:.6,zoet:.35,noot:.2,choc:.15,kruid:.3};

/* de 119 streken één keer plat, met hun families en een schatting van hoe
   levendig ze smaken (uit de smaakwoorden en de teelthoogte) */
let FD_STREKEN=null;
function fdStreken(){
  if(FD_STREKEN)return FD_STREKEN;
  FD_STREKEN=[];
  Object.keys(BP_INFO).forEach(land=>{
    const inf=BP_INFO[land], L=BP_LAND[land]; if(!L)return;
    (inf.streken||[]).forEach((st,i)=>{
      const fams=[...new Set((st.s||[]).map(w=>FD_WOORD[w]).filter(Boolean))];
      const h=(String(st.h||inf.hoogte).match(/\d+/g)||['1500']).map(Number);
      const hoog=h.reduce((a,b)=>a+b,0)/h.length;
      let zuur=fams.length?fams.reduce((a,f)=>a+FD_ZUUR[f],0)/fams.length:.5;
      zuur=Math.max(0,Math.min(1,zuur*.7+((hoog-900)/1400)*.3));
      FD_STREKEN.push({land,i,naam:st.n,landnaam:L.naam,deel:L.deel,h:st.h||inf.hoogte,
        hoog,t:st.t,s:st.s||[],v:st.v||inf.var,proc:inf.proc,fams,zuur});
    });
  });
  return FD_STREKEN;
}

/* ---- wat de app al van je weet, zodat de eerste twee vragen ingevuld staan ---- */
function fdMijnMethode(){
  const aan=(state.methods||[]).filter(m=>m.on);
  const esp=aan.some(m=>methodFamily(m)==='espresso');
  const fil=aan.some(m=>methodFamily(m)==='filter');
  return (esp&&fil)?'allebei':esp?'espresso':'filter';
}
function fdMijnSmaken(){
  const tel={};
  (state.brews||[]).forEach(b=>{
    if(b.score!=null&&+b.score<7.5)return;
    (b.tags||[]).forEach(t=>{
      let f=FD_WIEL[t];
      if(!f)for(const k in WHEEL_SUB)if((WHEEL_SUB[k]||[]).includes(t))f=FD_WIEL[k];
      if(f)tel[f]=(tel[f]||0)+1;
    });
  });
  const uit=Object.keys(tel).sort((a,b)=>tel[b]-tel[a]).slice(0,2);
  return uit.length?uit:['fris','zoet'];
}

/* ---- de stand van de zoeker ---- */
let fdQ='', fdAI=false, fdStap=0, fdBezig=false;
/* het laatste AI-antwoord blijft staan zolang je niets nieuws typt -- ook als je
   ondertussen ergens anders in de app kijkt en terugkomt */
let fdAntw=null, fdTerug=null;
let fdA={meth:null,fams:null,zuur:null,proc:'egaal',avontuur:null};
function fdReset(){
  fdStap=0;
  fdA={meth:fdMijnMethode(),fams:fdMijnSmaken(),zuur:null,proc:'egaal',avontuur:null};
}

const FD_STAPPEN=[
  {k:'meth',v:'Where will you brew it?',
   w:'Dit bepaalt welke branding en welke streken passen — daar begint elke goede koffiezoeker mee.',
   o:[{v:'filter',n:'filter',u:'V60, Chemex, Aeropress — helderheid en zuur mogen er zijn'},
      {v:'espresso',n:'espresso',u:'onder druk: je wilt body, zoet en weinig scherpte'},
      {v:'allebei',n:'both',u:'een zak die op allebei werkt'}]},
  {k:'fams',v:'Which way, taste-wise?',
   w:'Kies er één tot drie. Dit is de grofste zeef: hij haalt er meteen driekwart uit.',
   soort:'fam'},
  {k:'zuur',v:'How bright may it be?',
   w:'Niet hoe donker de branding is, maar wat je in de kop proeft. Hoogte en proces bepalen dit het meest.',
   o:[{v:'zacht',n:'soft and round',u:'laag zuur, veel body — chocolade en noot'},
      {v:'balans',n:'balanced',u:'zoet met een randje, het veilige midden'},
      {v:'fel',n:'lively and bright',u:'citrus die prikt, thee-achtig, hoog gegroeid'}]},
  {k:'proc',v:'What sounds interesting?',
   w:'Het proces op de boerderij verandert de smaak meer dan welk land ook.',
   o:[{v:'washed',n:'washed',u:'schoon en rechtlijnig — je proeft de streek zelf'},
      {v:'natural',n:'natural',u:'de kers droogt om de boon: fruit, wijn, meer body'},
      {v:'honey',n:'honey',u:'ertussenin — zoeter, zachter zuur'},
      {v:'egaal',n:'no preference',u:'laat de smaak beslissen'}]},
  {k:'avontuur',v:'Familiar, or something new?',
   w:'Vertrouwd blijft bij landen die al eens op je plank stonden, nieuw zoekt er juist '+
     'buiten, en verras springt naar een werelddeel waar je nog nooit zat. De app kijkt '+
     'daarvoor naar je eigen bonen en brews — heb je er nog geen, dan telt deze vraag niet mee.',
   o:[{v:'vertrouwd',n:'keep it familiar',u:'een streek in een land dat je al kent'},
      {v:'nieuw',n:'something new',u:'een land dat je nog niet had'},
      {v:'verras',n:'surprise me',u:'een werelddeel waar je nog nooit zat'}]},
];

/* ---- de score. Elke regel is uit te leggen; wat dat niet is, telt niet mee ---- */
function fdScore(st){
  const r=[]; let p=0;
  const raak=st.fams.filter(f=>(fdA.fams||[]).includes(f));
  if((fdA.fams||[]).length){
    p+=raak.length*3;
    if(raak.length)r.push(raak.map(f=>FD_FAM[f].n).join(' en ')+' zit erin');
  }
  if(fdA.zuur){
    const doel=fdA.zuur==='zacht'?.15:fdA.zuur==='balans'?.5:.85;
    const af=Math.abs(st.zuur-doel); p+=(1-af)*3;
    if(af<.18)r.push(fdA.zuur==='fel'?'hoog gegroeid en levendig'
      :fdA.zuur==='zacht'?'rond, weinig zuur':'mooi in balans');
  }
  if(fdA.proc!=='egaal'){
    if(st.proc.includes(fdA.proc)){p+=2;r.push(fdA.proc+' komt hier vandaan');}
    else p-=2;
  }
  if(fdA.meth==='espresso')p+=(1-st.zuur)*2;
  else if(fdA.meth==='filter')p+=st.zuur*2;
  const had=bpGehad().has(st.land);
  if(fdA.avontuur==='vertrouwd'){p+=had?2:-1;if(had)r.push('een land dat je al kent');}
  if(fdA.avontuur==='nieuw'){p+=had?-2:2;if(!had)r.push('nog nooit op je plank gehad');}
  if(fdA.avontuur==='verras'){
    const delen=new Set([...bpGehad()].map(l=>(BP_LAND[l]||{}).deel));
    p+=delen.has(st.deel)?-2:3;
    if(!delen.has(st.deel))r.push('een werelddeel waar je nog nooit zat');
  }
  return {p,r};
}
function fdRang(){return fdStreken().map(st=>Object.assign({st},fdScore(st))).sort((a,b)=>b.p-a.p);}
function fdOver(){
  const f=fdA.fams||[];
  if(!f.length)return fdStreken().length;
  return fdStreken().filter(st=>st.fams.some(x=>f.includes(x))).length;
}

/* ---- zoeken zonder AI: alles wat de app al heeft staan ---- */
function fdZoek(q){
  const t=(q||'').toLowerCase().trim();
  const hoogte=(t.match(/boven\s*(\d{3,4})|(\d{3,4})\s*m\+/)||[]).filter(Boolean)[1];
  // woorden van één of twee letters slaan we over: een losse "m" zit in bijna elke
  // beschrijving en maakt de uitslag waardeloos
  const woorden=t.split(/[\s,]+/).filter(w=>w.length>2&&!/^\d+$/.test(w)&&w!=='boven');
  if(!woorden.length&&!hoogte)return [];
  return fdStreken().map(st=>{
    let p=0; const r=[]; let alles=true;
    woorden.forEach(w=>{
      let q2=0;
      if(st.landnaam.toLowerCase().includes(w)){q2+=5;r.push('land');}
      if(st.naam.toLowerCase().includes(w)){q2+=6;r.push('streek');}
      if(st.s.some(x=>x.toLowerCase().includes(w))){q2+=4;r.push('smaak');}
      const fam=FD_FAMS.find(f=>FD_FAM[f].n.toLowerCase().includes(w)||FD_FAM[f].u.includes(w));
      if(fam&&st.fams.includes(fam)){q2+=4;r.push('smaakfamilie');}
      if(st.proc.some(x=>x.includes(w))){q2+=3;r.push('proces');}
      if((st.v||'').toLowerCase().includes(w)){q2+=3;r.push('variëteit');}
      if(!q2&&st.t.toLowerCase().includes(w)){q2+=1;r.push('beschrijving');}
      if(!q2)alles=false;
      p+=q2;
    });
    // elk woord moet ergens raken: "natural ethiopië" is een eis, geen wens
    if(!alles)return {st,p:0,r:[]};
    if(hoogte){ if(st.hoog>=+hoogte){p+=3;r.push('hoogte');} else return {st,p:0,r:[]}; }
    return {st,p,r:[...new Set(r)]};
  }).filter(x=>x.p>0).sort((a,b)=>b.p-a.p);
}

/* ---- met AI: hij vult alleen de filters in. Het antwoord komt nog steeds uit
   diezelfde 119 streken, niet uit het model. ---- */
/* ---- waar een antwoord naartoe mag verwijzen ----
   Alleen deze plekken. Verzint de AI een andere bestemming, dan valt de link eruit
   en blijft de tekst gewoon staan. */
const FD_DOELEN={
  dialin:'dial in', form:'log a brew', brews:'your brews', beans:'your beans',
  methods:'brew methods', recipe:'recipes', gallery:'pouring shapes', cupping:'cupping',
  learn:'learn', 'learn-filter':'filter lesson', 'learn-barista':'barista lesson',
  'learn-academy':'academy', 'learn-latte':'latte art', profile:'profile',
  choosebean:'which bean', finder:'the five steps',
};

/* De 119 streken als menukaart voor de AI. Hij mag alleen kiezen wat hier staat,
   en wat hij noemt controleren we daarna nog een keer tegen BP_INFO. */
function fdMenu(){
  return fdStreken().map(st=>st.land+':'+st.i+' | '+st.naam+' ('+st.landnaam+') | '+st.h+
    ' | '+st.s.join(', ')+' | '+st.proc.join('/')).join('\n');
}
/* Wat de app al van je weet. Zonder dit kan hij "als mijn oude El Salvador" niet lezen. */
function fdIk(){
  const r=[];
  const bonen=(state.beans||[]).slice(0,12).map(b=>{
    const st=bpRegios(b).map(bpRegioTekst).join(' · ');
    return (b.name||'?')+(st?(' — '+st):'')+(b.process?(' — '+b.process):'')+
      (b.roastLevel?(' — '+b.roastLevel):'');
  });
  if(bonen.length)r.push('Op je plank: '+bonen.join(' | '));
  const wens=(state.wishlist||[]).slice(0,8).map(w=>w.naam||w.name).filter(Boolean);
  if(wens.length)r.push('Op je wenslijstje: '+wens.join(', '));
  const brews=(state.brews||[]).slice(0,10).map(b=>{
    const m=methodById(b.method);
    return (m?m.name:'?')+' · '+(b.beans||'?')+' · '+(b.dose||'?')+' g · '+(b.time||'?')+
      (b.temp?(' · '+b.temp+'°C'):'')+(b.score?(' · '+b.score+'/10'):'');
  });
  if(brews.length)r.push('Je laatste brews (nieuwste eerst): '+brews.join(' | '));
  const had=[...bpGehad()].map(id=>BP_LAND[id]?BP_LAND[id].naam:id);
  if(had.length)r.push('Landen die al eens op je plank stonden: '+had.join(', '));
  return r.length?r.join('\n'):'De app is nog leeg: geen bonen, geen brews.';
}

/* Wat er terugkomt is niet te vertrouwen tot het gecontroleerd is: elke streek moet
   bestaan, elke link moet naar een bestaande pagina wijzen. */
function fdKeur(d){
  const soort=['kaart','uitleg','tekst'].includes(d.soort)?d.soort:'tekst';
  const streken=(Array.isArray(d.streken)?d.streken:[]).map(x=>{
    const [land,i]=String(x&&x.streek||'').split(':');
    const inf=BP_INFO[land];
    if(!inf||!inf.streken||!inf.streken[+i])return null;
    return {land, i:+i, waarom:String(x.waarom||'').slice(0,160)};
  }).filter(Boolean).slice(0,5);
  return {
    soort: streken.length?soort:(soort==='kaart'?'tekst':soort),
    zin: String(d.zin||'').slice(0,400),
    uitleg: (Array.isArray(d.uitleg)?d.uitleg:[]).map(p=>String(p||'').slice(0,600)).slice(0,4),
    streken,
    vervolg: (Array.isArray(d.vervolg)?d.vervolg:[]).map(v=>String(v||'').slice(0,80))
      .filter(Boolean).slice(0,3),
    links: (Array.isArray(d.links)?d.links:[]).map(l=>({
      tekst:String(l&&l.tekst||''), naar:String(l&&l.naar||'')
    })).filter(l=>l.tekst&&FD_DOELEN[l.naar]).slice(0,3),
  };
}

async function fdAIZoek(){
  const t=fdQ.trim();
  if(!t||!aiReady())return;
  fdBezig=true; fdAntw=null; fdSchilder();
  try{
    const prompt=
      'Je bent de koffiegids in een app met een getekende wereldkaart. Iemand vraagt:\n"'+t+'"\n\n'+
      'DIT WEET DE APP VAN HEM:\n'+fdIk()+'\n\n'+
      'DE STREKEN DIE DE APP KENT (id | streek (land) | hoogte | smaakwoorden | processen):\n'+
      fdMenu()+'\n\n'+
      'Antwoord in het Nederlands, in de toon van een rustige vakman: kort, concreet, geen '+
      'verkooppraat. Geef ALLEEN JSON terug, zonder tekst eromheen:\n'+
      '{"soort":"kaart|uitleg|tekst","zin":"","uitleg":[],"streken":[{"streek":"land:0","waarom":""}],'+
      '"vervolg":[],"links":[{"tekst":"","naar":""}]}\n\n'+
      'soort = "kaart" als streken het antwoord zijn, "uitleg" als hij iets wil begrijpen '+
      '(geef dan ook streken als voorbeeld), "tekst" als er geen streek bij hoort.\n'+
      'zin = één of twee zinnen, het antwoord zelf. Mag <b>…</b> bevatten voor nadruk.\n'+
      'uitleg = nul tot vier alinea\'s, alleen bij soort "uitleg" of "tekst".\n'+
      'streken = nul tot drie ids LETTERLIJK uit de lijst hierboven, elk met een eigen reden '+
      'waarom juist die past bij zijn vraag. Verzin geen ids.\n'+
      'vervolg = nul tot drie korte vervolgvragen die hij zou kunnen stellen.\n'+
      'links = verwijs je in je tekst naar een plek in de app, zet die hier neer. tekst = de '+
      'letterlijke woorden zoals ze in zin of uitleg staan; naar = een van: '+
      Object.keys(FD_DOELEN).join(', ')+'.\n'+
      'Weet je iets niet (prijzen, winkels, voorraad — de app kent geen webshops), zeg dat '+
      'ronduit en beantwoord de helft die je wel kunt.';
    fdAntw=fdKeur(extractJSON(await askAI([{role:'user',content:prompt}],1600,'finder')));
    if(!fdAntw.zin&&!fdAntw.uitleg.length&&!fdAntw.streken.length)fdAntw=null;
  }catch(e){ fdAntw={soort:'tekst',zin:'Daar kwam ik niet uit. Probeer het anders te vragen, '+
    'of zoek gewoon op een woord.',uitleg:[],streken:[],vervolg:[],links:[]}; }
  fdBezig=false; fdSchilder();
}

/* ---- de zoekbalk op het wereldscherm ---- */
function fdBalkHTML(){
  if(!featOn('finder'))return '';
  const vraagbaar=featOn('finderai');
  return '<div class="fd-zoek"><input id="fd-veld" value="'+esc(fdQ)+'" '+
    'placeholder="'+(fdAI?'ask me anything about coffee…':'country, region, taste, process…')+'" '+
    'oninput="fdTik(this.value)"'+(fdAI?' onkeydown="if(event.key===\'Enter\')fdAIZoek()"':'')+'>'+
    (fdQ?'<button class="wis" onclick="fdTik(\'\')">×</button>':'')+'</div>'+
    (vraagbaar?('<div class="fd-ai"><button class="'+(fdAI?'aan':'')+'" onclick="fdAIAan()">'+
      (fdAI?'AI on':'AI off')+'</button>'+
      (fdAI?'stel een hele vraag en druk op enter':'zoekt in 119 streken, ook zonder internet')+
      '</div>'):'');
}
/* Het antwoord staat ónder de kaart, niet erboven: eerst zie je waar het over gaat,
   daarna waarom. Anders duwt een lang antwoord de kaart van het scherm af. */
function fdUitBlokHTML(){
  if(!featOn('finder'))return '';
  return '<div class="fd-uit" id="fd-uit">'+fdUitHTML()+'</div>'+
    '<button class="bp-knop" style="width:100%;margin-bottom:14px" onclick="fdOpen()">'+
    'find my bag — 5 steps ›</button>';
}
/* De onderstreepte woorden in een antwoord aantikbaar maken. Alleen de eerste keer
   dat ze voorkomen, en alleen buiten een tag -- anders sloopt hij zijn eigen <b>. */
function fdLinks(html,links){
  (links||[]).forEach((l,n)=>{
    const naald=l.tekst.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const re=new RegExp('(?![^<]*>)'+naald,'i');
    if(!re.test(html))return;
    html=html.replace(re,m=>'<button class="fd-link" onclick="fdGaNaar(\''+l.naar+'\')">'+m+'</button>');
  });
  return html;
}
function fdAntwHTML(){
  const a=fdAntw;
  const label={kaart:'de kaart als antwoord',uitleg:'uitleg, met de kaart erbij',
               tekst:'gewoon antwoord'}[a.soort];
  let h='<span class="fd-soort">'+esc(label)+'</span>';
  if(a.zin)h+='<div class="fd-zin">'+fdLinks(a.zin,a.links)+'</div>';
  if(a.uitleg.length)h+='<div class="fd-lap">'+
    a.uitleg.map(p=>'<p>'+fdLinks(p,a.links)+'</p>').join('')+'</div>';
  h+=a.streken.map(x=>{
    const inf=BP_INFO[x.land], st=inf.streken[x.i];
    return '<button class="fd-res" onclick="fdNaar(\''+x.land+'\','+x.i+')">'+
      '<span class="n">'+esc(st.n)+'</span>'+
      '<span class="l">'+esc(BP_LAND[x.land].naam)+' · '+esc(st.h||inf.hoogte)+'</span>'+
      '<span class="s">'+esc((st.s||[]).join(' · '))+'</span>'+
      (x.waarom?('<span class="m">'+esc(x.waarom)+'</span>'):'')+'</button>';
  }).join('');
  if(a.vervolg.length)h+='<div class="fd-verder">'+a.vervolg.map(v=>
    '<button onclick="fdVraag('+JSON.stringify(v).replace(/"/g,'&quot;')+')">'+
    esc(v)+'</button>').join('')+'</div>';
  return h;
}
function fdUitHTML(){
  if(fdBezig)return '<div class="fd-niks"><span class="spin"></span> de AI leest je vraag…</div>';
  if(fdAntw)return fdAntwHTML();
  if(!fdQ.trim())return '';
  const rij=fdZoek(fdQ);
  if(!rij.length)return '<div class="fd-niks">Niets gevonden. Probeer een smaakwoord '+
    'zoals <b>jasmijn</b> of <b>cacao</b>.</div>';
  return '<div class="fd-niks" style="padding:2px 0 8px">'+rij.length+' streken gevonden</div>'+
    rij.slice(0,12).map(x=>
      '<button class="fd-res" onclick="fdNaar(\''+x.st.land+'\','+x.st.i+')">'+
      '<span class="n">'+esc(x.st.naam)+'</span>'+
      '<span class="l">'+esc(x.st.landnaam)+' · '+esc(x.st.h)+'</span>'+
      '<span class="s">'+esc(x.st.s.join(' · '))+'</span>'+
      '<span class="m">raak op '+x.r.join(', ')+'</span></button>').join('');
}
/* alleen het resultaatvak en de kaartkleuren bijwerken -- het hele scherm
   opnieuw tekenen zou de cursor uit het zoekveld gooien */
function fdSchilder(){
  const uit=document.getElementById('fd-uit');
  if(uit)uit.innerHTML=fdUitHTML();
  // een AI-antwoord wijst zijn eigen landen aan; anders doet het gewone zoeken dat
  const raak=new Set(fdAntw?fdAntw.streken.map(x=>x.land)
    :(fdQ.trim()?fdZoek(fdQ).slice(0,14).map(x=>x.st.land):[]));
  document.querySelectorAll('#bp-screen .bp-kaart path[data-land]').forEach(el=>{
    el.classList.toggle('raak',raak.has(el.getAttribute('data-land')));
  });
}
function fdTik(v){
  fdQ=v; fdAntw=null;
  const veld=document.getElementById('fd-veld');
  if(veld&&veld.value!==v)veld.value=v;
  fdSchilder();
  // het kruisje verschijnt pas bij de volgende hele tekening
  if(!v&&veld)bpTeken(true);
}
/* Een vervolgvraag aantikken stelt hem meteen. */
function fdVraag(v){
  fdQ=v; fdAntw=null; bpTeken(true); fdAIZoek();
}
/* Een verwijzing in het antwoord: open die plek, en onthoud waar je vandaan kwam.
   Zonder de terugweg ben je je antwoord kwijt zodra je ergens gaat kijken. */
function fdGaNaar(naar){
  if(!FD_DOELEN[naar])return;
  fdTerug={van:'beanpick'};
  go(naar);
  fdPil();
}
function fdTerugNaarAntwoord(){
  fdTerug=null;
  bpNiv='wereld'; bpDeel=null; bpLandId=null; bpStreek=null;
  bpView=BP_VIEWS.wereld.slice();
  go('beanpick');
  fdPil();
}
function fdPilWeg(){ fdTerug=null; fdPil(); }
/* Het balkje boven de tabbalk. Eén element, dat komt en gaat. */
function fdPil(){
  let el=document.getElementById('fd-pil');
  const toon=!!fdTerug&&currentPage!=='beanpick'&&currentPage!=='finder';
  if(!toon){ if(el)el.remove(); return; }
  if(!el){
    el=document.createElement('div');
    el.id='fd-pil'; el.className='fd-pil';
    el.innerHTML='<span onclick="fdTerugNaarAntwoord()">‹ back to your answer</span>'+
      '<button class="weg" onclick="fdPilWeg()" aria-label="sluiten">×</button>';
    document.querySelector('.phone').appendChild(el);
  }
}
function fdAIAan(){
  if(!fdAI&&!aiReady()){toast('zet AI aan onder profile');return;}
  fdAI=!fdAI; bpTeken(true);
}
function fdNaar(land,i){
  bpVoor=null; bpVanaf=bpVanaf||'beans';
  bpDeel=BP_LAND[land].deel; bpLandId=land; bpNiv='land'; bpStreek=i; bpVarOpen=null;
  bpView=bpLandView(land).slice(); bpNaarStreek=true;
  bpTeken();
}

/* ---- het scherm met de vijf stappen ---- */
function fdOpen(){fdReset();go('finder');}
function fdTeken(behoudScroll){
  const el=document.getElementById('fd-screen'); if(!el)return;
  const y=el.scrollTop;
  el.innerHTML=(fdStap<5)?fdStapHTML():fdTopHTML();
  el.scrollTop=behoudScroll?y:0;
}
function fdKaartje(landen,top){
  const set=new Set(landen||[]), t=new Set(top||[]);
  const v=BP_VIEWS.wereld;
  let s='<svg class="bp-kaart" viewBox="'+v.join(' ')+'" preserveAspectRatio="xMidYMid meet">';
  s+='<rect class="band" x="-200" y="'+bpY(23.5)+'" width="500" height="'+(bpY(-23.5)-bpY(23.5))+'"/>';
  BP_ACHTER.forEach(pl=>{
    s+='<path class="achter" d="M'+pl.map(q=>bpX(q[0]).toFixed(1)+' '+bpY(q[1]).toFixed(1)).join('L')+'Z"/>';
  });
  BP_VOLGORDE.forEach(l=>{
    const kl='land'+(t.has(l.id)?' sel':set.has(l.id)?' raak':'');
    s+='<path class="'+kl+'" d="'+bpPad(l)+'"></path>';
  });
  return '<div class="bp-doos">'+s+'</svg></div>';
}
function fdStapHTML(){
  const S=FD_STAPPEN[fdStap];
  const rij=fdRang(), raak=[...new Set(rij.slice(0,18).map(x=>x.st.land))];
  let keuze='';
  if(S.soort==='fam'){
    keuze='<div class="fd-fam">'+FD_FAMS.map(f=>
      '<button class="'+((fdA.fams||[]).includes(f)?'sel':'')+'" onclick="fdFam(\''+f+'\')">'+
      FD_FAM[f].n+'<em>'+FD_FAM[f].u+'</em></button>').join('')+'</div>';
  }else{
    keuze=S.o.map(o=>'<button class="fd-keus'+(fdA[S.k]===o.v?' sel':'')+'" onclick="fdKies(\''+
      S.k+'\',\''+o.v+'\')"><span class="vk">'+(fdA[S.k]===o.v?'✓':'○')+'</span>'+
      '<span><b>'+o.n+'</b><em>'+o.u+'</em></span></button>').join('');
  }
  return '<div class="bp-kop"><div class="t">Step '+(fdStap+1)+' of 5</div>'+
    '<button class="bp-terug" onclick="'+(fdStap?'fdStap--;fdTeken()':'go(\'beanpick\')')+
    '">‹ '+(fdStap?'back':'map')+'</button></div>'+
    '<div class="fd-balk">'+FD_STAPPEN.map((_,i)=>
      '<i class="'+(i<=fdStap?'op':'')+'"></i>').join('')+'</div>'+
    fdKaartje(raak,[])+
    '<div class="fd-teller">'+fdOver()+' of the 119 regions still fit</div>'+
    '<div class="fd-vraag">'+S.v+'</div>'+
    uitklapHTML('waarom','why we ask this',S.w,'fdTeken(true)')+
    keuze+
    '<button class="bp-knop" style="width:100%;margin-top:6px" onclick="fdVerder()">'+
    (fdStap===4?'show my top 3 ›':'next ›')+'</button>';
}
function fdTopHTML(){
  const rij=fdRang().slice(0,3), landen=rij.map(x=>x.st.land);
  return '<div class="bp-kop"><div class="t">Your top 3</div>'+
    '<button class="bp-terug" onclick="fdStap=4;fdTeken()">‹ steps</button></div>'+
    '<div class="bp-let">Uit 119 streken, op wat je net koos.</div>'+
    fdKaartje(landen,landen)+
    rij.map((x,i)=>'<div class="fd-res'+(i?'':' top1')+'"><span class="nr">'+(i+1)+'</span>'+
      '<span class="n">'+esc(x.st.naam)+'</span>'+
      '<span class="l">'+esc(x.st.landnaam)+' · '+esc(x.st.h)+'</span>'+
      '<span class="s">'+esc(x.st.s.join(' · '))+'</span>'+
      '<span class="m">'+esc(x.r.slice(0,3).join(' · ')||'past het dichtst bij je antwoorden')+
      '</span><div class="wens-rij">'+
      '<button class="lp sel" onclick="fdNaarStreek(\''+x.st.land+'\','+x.st.i+')">'+
      'bekijk op de kaart →</button></div></div>').join('')+
    '<button class="bp-knop leeg" style="width:100%;margin-top:6px" onclick="fdStap=1;fdTeken()">'+
    'try something else</button>';
}
function fdNaarStreek(land,i){
  if(fdA.proc!=='egaal'&&BP_INFO[land].proc.includes(fdA.proc))bpProc=fdA.proc;
  fdNaar(land,i); go('beanpick');
}
function fdKies(k,v){fdA[k]=v;fdTeken(true);}
function fdFam(f){
  const l=fdA.fams||(fdA.fams=[]), i=l.indexOf(f);
  if(i>=0)l.splice(i,1); else if(l.length<3)l.push(f);
  fdTeken(true);
}
function fdVerder(){ if(fdStap<4)fdStap++; else fdStap=5; fdTeken(); }

let bpNaarStreek=false;   // net binnengekomen bij een streek: schuif hem in beeld
function bpTeken(behoudScroll){
  const el=document.getElementById('bp-screen'); if(!el)return;
  const y=behoudScroll?el.scrollTop:0;
  el.innerHTML=(bpNiv==='wereld')?bpWereld():(bpNiv==='deel'?bpDeelScherm():bpLandScherm());
  el.scrollTop=y;
  bpVenster();
  if(bpNiv==='wereld'&&(fdAntw||fdQ.trim()))fdSchilder();
  if(bpNaarStreek){
    bpNaarStreek=false;
    const op=el.querySelector('.bp-streek.op');
    if(op)setTimeout(()=>op.scrollIntoView({behavior:'smooth',block:'start'}),120);
  }
}

/* ---------------- taste wheel ----------------
   Acht smaakfamilies in een ring. Staat het grote wiel aan, dan is elke familie
   een deurtje: je tikt hem open en de ring toont wat eronder zit -- de familie
   zelf voorop, zodat "gewoon berry" een keuze blijft. Eén ring tegelijk, want
   twee ringen op een telefoon lees je niet meer.                            */
const WHEEL_NOTES=['berry','citrus','floral','honey','caramel','choc','nutty','spice'];
const WHEEL_SUB={
  berry:  ['blueberry','raspberry','strawberry','currant','cherry'],
  citrus: ['lemon','orange','grapefruit','lime','bergamot'],
  floral: ['jasmine','rose','chamomile','black tea','hibiscus'],
  honey:  ['brown sugar','maple','malt','syrup'],
  caramel:['toffee','vanilla','praline','cane sugar','burnt sugar'],
  choc:   ['milk choc','dark choc','cocoa','fudge','roasted'],
  nutty:  ['almond','hazelnut','peanut','walnut','biscuit'],
  spice:  ['cinnamon','clove','cardamom','pepper','liquorice'],
};
// de familie zelf staat vooraan: "gewoon berry" moet een keuze blijven
function wheelSubs(fam){return [fam].concat((WHEEL_SUB[fam]||[]).filter(x=>x!==fam));}
// hoort deze smaak bij die familie? (de familie zelf telt mee)
function wheelHoortBij(fam,tag){
  const t=(''+tag).toLowerCase();
  return t===fam||(WHEEL_SUB[fam]||[]).includes(t);
}
let wheelOpen=null;   // welke familie staat open in het grote wiel
/* Één ring tekenen. namen = de segmenten, aan = welke gekleurd zijn,
   klik = de functienaam die een segment aanroept.                          */
function wheelRing(namen,aan,klik,binnen){
  const cx=100,cy=100,r1=binnen?46:40,r2=94,N=namen.length;
  const breedte=r2-r1-6;         // ruimte voor tekst binnen de ring
  let out='';
  namen.forEach((n,i)=>{
    const a0=(i/N)*Math.PI*2-Math.PI/2,a1=((i+1)/N)*Math.PI*2-Math.PI/2,am=(a0+a1)/2;
    const P=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
    const[x0,y0]=P(r2,a0),[x1,y1]=P(r2,a1),[x2,y2]=P(r1,a1),[x3,y3]=P(r1,a0);
    const kl=klik?` onclick="${klik}('${n.replace(/'/g,"\\'")}')"`:'';
    out+=`<path data-n="${esc(n)}" class="${aan(n)?'sel':''}"${kl} d="M${x0} ${y0} A${r2} ${r2} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r1} ${r1} 0 0 0 ${x3} ${y3} Z"/>`;
    // "brown sugar" op twee regels, en een lang woord krimpt tot het past --
    // anders steekt "blackcurrant" dwars door zijn eigen taartpunt heen
    const woorden=n.split(' ');
    const regels=(woorden.length===2&&n.length>8)?woorden:[n];
    const langst=Math.max(...regels.map(r=>r.length));
    const fs=Math.max(6.4,Math.min(N>6?9:10,breedte/(0.5*langst)));
    const[tx,ty]=P((r1+r2)/2,am);
    const y0t=ty+3-(regels.length-1)*fs*0.5;
    out+=`<text x="${tx}" y="${y0t}" text-anchor="middle" style="font-size:${fs.toFixed(1)}px">`+
      regels.map((r,j)=>`<tspan x="${tx}" dy="${j?fs:0}">${esc(r)}</tspan>`).join('')+`</text>`;
  });
  return out;
}
function renderTasteWheel(){
  const wrap=document.getElementById('wheel-wrap');if(!wrap)return;
  wrap.style.display=featOn('wheel')?'block':'none';
  if(!featOn('wheel'))return;
  const svg=document.getElementById('taste-wheel');if(!svg)return;
  const groot=featOn('wheelbig');
  if(!groot)wheelOpen=null;
  let out;
  if(groot&&wheelOpen){
    out=wheelRing(wheelSubs(wheelOpen),n=>formTags.includes(n),'wheelTap',true);
    // het hart is de weg terug naar de families
    out+=`<circle class="wheel-hart" cx="100" cy="100" r="40" onclick="wheelDicht()"/>`;
    out+=`<text class="wheel-hart-t" x="100" y="97" text-anchor="middle">${esc(wheelOpen)}</text>`;
    out+=`<text class="wheel-hart-t" x="100" y="110" text-anchor="middle" style="font-size:8.5px">&#8592; terug</text>`;
  }else{
    // een familie kleurt zodra er iets uit die familie gekozen is
    const aan=n=>formTags.some(t=>wheelHoortBij(n,t));
    out=wheelRing(WHEEL_NOTES,aan,groot?'wheelOpenen':'wheelTap',false);
    out+=`<circle cx="100" cy="100" r="34" fill="none" stroke="var(--line)" stroke-width="1.5" filter="url(#wobble-rough)"/>`;
    if(groot)out+=`<text class="wheel-hart-t" x="100" y="103" text-anchor="middle" style="font-size:8.5px">tik een smaak</text>`;
  }
  svg.innerHTML=out;
}
function wheelOpenen(fam){wheelOpen=fam;renderTasteWheel();}
function wheelDicht(){wheelOpen=null;renderTasteWheel();}
function wheelTap(n){
  if(formTags.includes(n))formTags=formTags.filter(x=>x!==n);else formTags.push(n);
  renderFormTags();
}
/* Smaakwiel als plaatje: altijd de acht families, ook als je een subsmaak koos
   -- "blueberry" kleurt gewoon het vak berry. De subsmaak zelf staat er als
   tekstlabel onder, bij de andere smaaknotities.                           */
function tasteWheelStatic(tags,label){
  if(!featOn('wheel'))return '';
  const on=asArr(tags).map(t=>(''+t).toLowerCase());
  const geraakt=nt=>on.some(t=>wheelHoortBij(nt,t));
  if(!WHEEL_NOTES.some(geraakt))return '';
  const cx=100,cy=100,r1=40,r2=94;let out='';
  WHEEL_NOTES.forEach((nt,i)=>{
    const a0=(i/8)*Math.PI*2-Math.PI/2,a1=((i+1)/8)*Math.PI*2-Math.PI/2,am=(a0+a1)/2;
    const P=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
    const[x0,y0]=P(r2,a0),[x1,y1]=P(r2,a1),[x2,y2]=P(r1,a1),[x3,y3]=P(r1,a0);
    out+=`<path class="${geraakt(nt)?'sel':''}" d="M${x0} ${y0} A${r2} ${r2} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r1} ${r1} 0 0 0 ${x3} ${y3} Z"/>`;
    const[tx,ty]=P((r1+r2)/2,am);
    out+=`<text x="${tx}" y="${ty+3}" text-anchor="middle">${nt}</text>`;
  });
  return `<div class="notes-card sketch soft"><div class="k">${esc(label||'taste')}</div>
    <svg class="wheel-ro" viewBox="0 0 200 200">${out}</svg></div>`;
}
/* ---------------- versheidsmeter per boon ---------------- */
function freshGaugeHTML(b,atTs,label){
  if(!featOn('freshgauge'))return '';
  const fr=beanFreshness(b,atTs);if(!fr)return '';
  const hint=freshGrindHint(fr.days);
  const days=Math.min(fr.days,42);
  const cx=150,cy=104,R=78;
  const P=fr2=>[cx+R*Math.cos(Math.PI+fr2*Math.PI),cy+R*Math.sin(Math.PI+fr2*Math.PI)];
  const arc=(d0,d1,col)=>{const[x0,y0]=P(d0/42),[x1,y1]=P(d1/42);
    return `<path class="zone" stroke="${col}" d="M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}"/>`;};
  const[nx,ny]=P(days/42);
  return `<svg class="fgauge" viewBox="0 0 300 118">
    ${arc(0,3,'#a5673a')}${arc(3,21,'#5c7a4f')}${arc(21,42,'var(--line)')}
    <text x="${P(0.6/42)[0]-7}" y="${P(0.6/42)[1]-9}" text-anchor="end">rest</text>
    <text x="${P(12/42)[0]}" y="${P(12/42)[1]-12}" text-anchor="middle">peak</text>
    <text x="${P(31/42)[0]}" y="${P(31/42)[1]-12}" text-anchor="middle">fading</text>
    <line class="needle" x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="var(--ink)"/>
    <text class="fd" x="${cx}" y="${cy-22}" text-anchor="middle">day ${fr.days}</text>
  </svg>${label?'<div class="fg-lab">'+esc(label)+'</div>':''}
  ${hint?'<div class="fg-hint">'+esc(hint.s)+' — '+esc(hint.t)+'</div>':''}`;
}
/* ---------------- brew now: jouw vaste bak, voor-ingevuld ---------------- */
function brewNow(){
  const r=recommendBrew();
  if(!r){toast('turn on a method first under methods');return;}
  const mid=r.method.id;
  if(methodFamily(mid)==='espresso'){
    formBean=r.bean?r.bean.id:null;pendingRecipe=null;
    const last=state.brews.filter(x=>x.method===mid).sort((a,b)=>b.ts-a.ts)[0];
    pendingTarget=last?(last.target||{dose:last.dose?String(last.dose):'',yield:last.yield?String(last.yield):'',time:last.time||'',grind:last.grind||''}):null;
    formPrep=(last&&last.prep)?JSON.parse(JSON.stringify(last.prep)):{};
    openDialIn(mid);
    if(r.bean)setTimeout(()=>pickDiBean(r.bean.id),0);
  }else{
    openForm(mid);
    if(r.bean)setTimeout(()=>pickBean(r.bean.id),0);
  }
  toast('☕ your usual: '+r.method.name+(r.bean?' · '+r.bean.name:'')+' — check & go');
}

/* ---------------- features: het schakelbord ---------------- */
// alles wat nieuw bijgebouwd wordt staat hier, met eigen aan/uit-knop in profiel.
const FEATURES=[
  {id:'night', n:'espresso night mode',    d:'the whole app becomes a chalkboard', def:false, cat:'app'},
  {id:'shotclock', n:'E61 shot clock', d:'pull the lever on the dial-in screen — time fills in, stays editable', def:true, cat:'app'},
  {id:'journey', n:'dial-in journey', d:'your attempts drawn as a line walking into the target band', def:true, cat:'app'},
  {id:'pourcoach', n:'pour coach', d:'filter recipes that run with a clock while you pour', def:true, cat:'app'},
  {id:'drawdown', n:'drawdown & bed', d:'log how long it drained and what the bed looked like', def:true, cat:'app'},
  {id:'filtercompass', n:'filter compass', d:'what you tasted, plotted — with one next change', def:true, cat:'app'},
  {id:'wheel', n:'taste wheel', d:'tap flavours on a wheel instead of typing tags', def:true, cat:'app'},
  {id:'finder', n:'taste finder', d:'search the world map by taste, or let five questions narrow it to three regions', def:true, cat:'people'},
  {id:'finderai', n:'ask the finder', d:'ask a real question and get a real answer — on the map, as an explanation, or just in words', def:true, cat:'people'},
  {id:'beanpick', n:'bean chooser', d:'a drawn world map: from a coffee country down to a region, and what to look for on the bag', def:true, cat:'people'},
  {id:'wheelbig', n:'big flavour wheel', d:'tap a family and the wheel opens up — berry becomes blueberry, raspberry, cherry', def:false, cat:'app'},
  {id:'freshgauge', n:'freshness gauge', d:'rest → peak → fading as a dial on each bean', def:true, cat:'app'},
  {id:'smartdefaults', n:'smart defaults', d:'last dose, grind & temp prefilled — never retype', def:true, cat:'app'},
  {id:'brewnow', n:'brew now button', d:'one tap on home: your usual, prefilled — confirm & go', def:true, cat:'app'},
  {id:'cost', n:'cost per cup', d:'price & bag size on a bean → what a cup costs you', def:true, cat:'app'},
  {id:'aibudget', n:'AI budget', d:'what the AI cost you this month, and one heads-up at 20% and 10%', def:true, cat:'smart'},
  {id:'sharecards', n:'share cards', d:'any brew as a hand-drawn image card to send to friends', def:true, cat:'app'},
  {id:'shortcuts', n:'home-screen shortcuts', d:'links that start a brew straight from an iOS Shortcut', def:true, cat:'smart'},
  {id:'water', n:'water helper', d:'ppm targets & simple mineral recipes on the learn page', def:true, cat:'people'},
  {id:'cupping', n:'cupping session', d:'blind-taste two beans, score & reveal', def:true, cat:'people'},
  {id:'latteart', n:'pouring shapes & coach', d:'photos of your pours, in order — with AI feedback', def:true, cat:'people'},
  {id:'brewsletter', n:'weekly brewsletter', d:'a hand-drawn recap card of your week, shareable', def:true, cat:'smart'},
  {id:'tastememory', n:'taste memory', d:'what your scores say about your palate', def:true, cat:'smart'},
  {id:'voice', n:'voice logging', d:'say "18 in, 36 out, 27 seconds" — hands stay on the machine', def:false, cat:'smart'},
  {id:'weather', n:'weather-aware suggestions', d:'iced on hot days, cozy moka when it rains (uses location)', def:false, cat:'smart'},
  {id:'pairing', n:'scale & machine pairing', d:'live weight via Bluetooth where the browser allows it', def:false, cat:'smart'},
];
function featOn(id){
  const f=FEATURES.find(x=>x.id===id);if(!f)return false;
  const v=state.features&&state.features[id];
  return v===undefined?f.def:!!v;
}
function toggleFeature(id){
  if(!state.features)state.features={};
  state.features[id]=!featOn(id);
  save();applyFeatures();
  if(currentPage==='profile')renderProfile();else renderFeatures();
  const f=FEATURES.find(x=>x.id===id);
  toast((featOn(id)?'✓ ':'○ ')+f.n+(featOn(id)?' on':' off'));
}
function applyFeatures(){
  const h=document.documentElement;
  h.classList.toggle('night',featOn('night'));
}
function renderFeatures(){
  const el=document.getElementById('feat-list');if(!el)return;
  const GROUPS=[['app','in the app'],['people','people & learning'],['smart','smart & connected']];
  el.innerHTML=GROUPS.map(([c,label])=>{
    const rows=FEATURES.filter(f=>(f.cat||'app')===c);
    if(!rows.length)return '';
    return `<div class="feat-group">${esc(label)}</div>`+rows.map(f=>`<div class="feat-row">
      <div class="ft"><div class="n">${esc(f.n)}</div><div class="d">${esc(f.d)}</div></div>
      <div class="toggle ${featOn(f.id)?'on':''}" onclick="toggleFeature('${f.id}')"><div class="knob"></div></div>
    </div>`).join('');
  }).join('');
}

/* ---------------- AI-instellingen ---------------- */
function aiEnabled(){return localStorage.getItem('scc_ai_on')==='1';}
// Keep provider secrets in memory; migrate an old stored key for this tab only.
const sessionAiKeys=Object.create(null);
for(const provider of ['anthropic','openai']){
  try{sessionAiKeys[provider]=localStorage.getItem(aiSleutelNaam(provider))||'';localStorage.removeItem(aiSleutelNaam(provider));}catch{sessionAiKeys[provider]='';}
}
function getKey(id){return sessionAiKeys[id||aiProv()]||'';}
function aiReady(){return aiEnabled()&&!!getKey();}
function renderProfile(){
  const on=aiEnabled();
  document.getElementById('ai-toggle').classList.toggle('on',on);
  document.getElementById('ai-key-wrap').classList.toggle('hidden',!on);
  document.getElementById('ai-off-note').classList.toggle('hidden',on);
  try{renderAiProv();}catch(e){}
  const ss=document.getElementById('save-status');
  if(ss)ss.textContent='saved now: '+state.brews.length+' brews · '+state.beans.length+' beans · '+state.methods.length+' methods';
  renderReminder();
  renderGear();
  renderFeatures();
  renderShortcuts();
  try{apiStat();}catch(e){}
  try{renderAiBudget();}catch(e){}
  const bl=document.getElementById('bl-card');if(bl)bl.style.display=featOn('brewsletter')?'block':'none';
  const tm=document.getElementById('tm-card');if(tm)tm.style.display=featOn('tastememory')?'block':'none';
  const wk=document.getElementById('week-card');
  if(wk)wk.style.display=(featOn('brewsletter')||featOn('tastememory'))?'block':'none';
  renderPairing();
  const pu=document.getElementById('push-url');if(pu)pu.value=localStorage.getItem('scc_push_url')||'';
  const cr=document.getElementById('b-cost-row');if(cr)cr.style.display=featOn('cost')?'flex':'none';
  applyAIVisibility();
}
/* ---------------- mijn uitrusting (gear) ----------------
   Een naam alleen zegt niet wat iets IS: "Eureka Libra" kan voor een mens
   duidelijk een molen zijn, voor de app niet. Daarom een kind erbij (grinder/
   brewer/los) en bij een molen meteen het bereik -- daarmee kan een AI-tip
   straks "+1" vertalen naar wat dat betekent op JOUW schaal.               */
const GEAR_CATS=[['espresso','espresso'],['filter','filter'],['algemeen','espresso + filter']];
const GEAR_KIND_LABEL={grinder:'grinder',brewer:'brewer'};
// welke families staan aan in het toevoegformulier -- een weegschaal gebruik je
// voor allebei, dus beide staan aan totdat je er zelf een uitzet
let gearCatSel={espresso:true,filter:true};
function renderGearCatPick(){
  const el=document.getElementById('gear-cat-pick');if(!el)return;
  el.innerHTML=['espresso','filter'].map(f=>
    '<button type="button" class="lp '+(gearCatSel[f]?'sel':'')+'" onclick="toggleGearCat(\''+f+'\')">'+f+'</button>').join('');
}
// minstens één blijft aan staan -- anders is er niets om op te slaan
function toggleGearCat(f){
  const ander=f==='espresso'?'filter':'espresso';
  if(gearCatSel[f]&&!gearCatSel[ander])return;   // laatste over: mag niet uit
  gearCatSel[f]=!gearCatSel[f];
  renderGearCatPick();
}
function renderGearRangeField(){
  const kind=document.getElementById('gear-kind').value;
  const rij=document.getElementById('gear-range-row'),note=document.getElementById('gear-range-note');
  const aan=kind==='grinder';
  if(rij)rij.style.display=aan?'flex':'none';
  if(note)note.style.display=aan?'block':'none';
}
function addGear(){
  const inp=document.getElementById('gear-name');
  const name=(inp.value||'').trim();if(!name){toast('enter a name');return;}
  // beide aan = voor allebei (algemeen), anders de ene die aanstaat
  const category=(gearCatSel.espresso&&gearCatSel.filter)?'algemeen':(gearCatSel.espresso?'espresso':'filter');
  const kind=document.getElementById('gear-kind').value||'';
  const item={id:uid(),name,category};
  if(kind)item.kind=kind;
  if(kind==='grinder'){
    const lo=parseFloat(document.getElementById('gear-range-min').value);
    const hi=parseFloat(document.getElementById('gear-range-max').value);
    if(isFinite(lo))item.grindMin=lo;
    if(isFinite(hi))item.grindMax=hi;
  }
  if(!Array.isArray(state.gear))state.gear=[];
  state.gear.push(item);
  inp.value='';document.getElementById('gear-kind').value='';
  document.getElementById('gear-range-min').value='';document.getElementById('gear-range-max').value='';
  gearCatSel={espresso:true,filter:true};renderGearCatPick();
  renderGearRangeField();
  save();renderGear();
}
function delGear(id){state.gear=(state.gear||[]).filter(g=>g.id!==id);save();renderGear();}
// naam plus, bij een molen met een ingevuld bereik, dat bereik erachter --
// gebruikt in de gearlijst en in elke AI-prompt die uitrusting noemt
function gearLabel(g){
  if(g.kind==='grinder'&&g.grindMin!=null&&g.grindMax!=null)
    return g.name+' (grind range '+g.grindMin+'–'+g.grindMax+')';
  return g.name;
}
function renderGear(){
  renderGearCatPick();
  const el=document.getElementById('gear-list');if(!el)return;
  const g=state.gear||[];
  if(!g.length){el.innerHTML='<div class="set-d" style="margin-bottom:4px">nothing added yet.</div>';return;}
  let html='';
  GEAR_CATS.forEach(([cat,label])=>{
    const items=g.filter(x=>x.category===cat);
    if(!items.length)return;
    html+='<div class="gear-cat-lbl">'+esc(label)+'</div><div class="gear-items">'+
      items.map(it=>{
        const bij=gearMethods(it.id).map(m=>m.name);
        const kindLbl=GEAR_KIND_LABEL[it.kind];
        return '<span class="gear-chip">'+esc(gearLabel(it))+
          (kindLbl?'<span class="gc-kind">'+esc(kindLbl)+'</span>':'')+
          (bij.length?'<span class="gc-bij">'+esc(bij.join(', '))+'</span>':'')+
          '<button onclick="delGear(\''+it.id+'\')" aria-label="delete">×</button></span>';
      }).join('')+'</div>';
  });
  // items met onbekende categorie tonen onder 'algemeen'
  const known=GEAR_CATS.map(c=>c[0]);
  const rest=g.filter(x=>!known.includes(x.category));
  if(rest.length){html+='<div class="gear-cat-lbl">overig</div><div class="gear-items">'+
    rest.map(it=>'<span class="gear-chip">'+esc(gearLabel(it))+'<button onclick="delGear(\''+it.id+'\')">×</button></span>').join('')+'</div>';}
  el.innerHTML=html;
}
// beschrijvend blokje van de uitrusting voor in AI-prompts (leeg als er niets is)
function gearPromptBlock(mid){
  // bij een methode met gekoppelde gear alleen die noemen; scheelt ruis in de prompt
  if(mid){
    const bij=methodGear(mid);
    if(bij.length)return '\nUitrusting voor deze methode: '+bij.map(gearLabel).join(', ')+'.';
  }
  const g=state.gear||[];if(!g.length)return '';
  const cats={espresso:[],filter:[],algemeen:[]};
  g.forEach(it=>{(cats[it.category]||cats.algemeen).push(gearLabel(it));});
  const parts=[];
  if(cats.espresso.length)parts.push('espresso: '+cats.espresso.join(', '));
  if(cats.filter.length)parts.push('filter: '+cats.filter.join(', '));
  if(cats.algemeen.length)parts.push('general: '+cats.algemeen.join(', '));
  if(!parts.length)return '';
  return '\nDe gebruiker heeft deze uitrusting; stem het recept en de tips hierop af (bv. concreet maalgraad-advies voor deze molen, techniek passend bij deze tools/machine):\n- '+parts.join('\n- ')+'\n';
}
/* ---------------- dagelijkse brew-suggestie (melding) ---------------- */
function getReminder(){try{return JSON.parse(localStorage.getItem('scc_reminder'))||{};}catch(e){return{};}}
function setReminder(r){localStorage.setItem('scc_reminder',JSON.stringify(r));}
function renderReminder(){
  const r=getReminder(),on=!!r.on;
  const tg=document.getElementById('reminder-toggle');if(!tg)return;
  tg.classList.toggle('on',on);
  document.getElementById('reminder-wrap').classList.toggle('hidden',!on);
  document.getElementById('reminder-time').value=r.time||'08:00';
  const st=document.getElementById('reminder-status');
  if(st){
    if(!('Notification'in window))st.textContent='notifications aren\'t supported on this device.';
    else if(Notification.permission==='denied')st.textContent='notifications are off in your system settings — turn them on for Lets Brew.';
    else if(on&&Notification.permission==='granted')st.textContent='on — every day around '+(r.time||'08:00')+' we\'ll suggest a brew.';
    else if(on)st.textContent='please allow notifications (tap the button below or turn it on again).';
    else st.textContent='';
  }
}
async function toggleReminder(){
  const r=getReminder();
  if(!r.on){
    if(!('Notification'in window)){toast('notifications not supported on this device');return;}
    let perm=Notification.permission;
    if(perm==='default'){try{perm=await Notification.requestPermission();}catch(e){}}
    if(perm==='denied'){toast('allow notifications in your settings');}
    r.on=true;if(!r.time)r.time='08:00';setReminder(r);
    if(Notification.permission==='granted')syncPushSubscription();   // achtergrond-push (indien server ingesteld)
  }else{r.on=false;setReminder(r);disablePushSubscription();}
  renderReminder();scheduleReminder();
}
function saveReminderTime(){
  const r=getReminder();r.time=document.getElementById('reminder-time').value||'08:00';r.lastShown='';setReminder(r);
  renderReminder();scheduleReminder();
  if(r.on&&('Notification'in window)&&Notification.permission==='granted')syncPushSubscription();
  toast('time saved: '+r.time);
}
function testReminder(){
  if(('Notification'in window)&&Notification.permission!=='granted'){toast('turn on notifications first');return;}
  showBrewSuggestion(true);
}
function todayKey(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
let reminderTimer=null;
function scheduleReminder(){
  if(reminderTimer){clearTimeout(reminderTimer);reminderTimer=null;}
  const r=getReminder();if(!r.on)return;
  const [h,m]=(r.time||'08:00').split(':').map(Number);
  const now=new Date(),t=new Date();t.setHours(h||0,m||0,0,0);
  if(t<=now)t.setTime(t.getTime()+86400000);
  reminderTimer=setTimeout(()=>{showBrewSuggestion();scheduleReminder();},t-now);
}
async function showBrewSuggestion(force){
  const r=getReminder();
  if(!force){if(!r.on)return;if(r.lastShown===todayKey())return;}
  const reco=recommendBrew();
  const body=reco?('today: '+reco.method.name+(reco.bean?' with '+reco.bean.name:'')+' — tap to start')
                 :'time for a fresh cup — tap to start';
  r.lastShown=todayKey();setReminder(r);
  try{
    if('serviceWorker'in navigator&&('Notification'in window)&&Notification.permission==='granted'){
      // niet oneindig wachten als de service worker (nog) niet klaar is
      const reg=await Promise.race([navigator.serviceWorker.ready,new Promise(r=>setTimeout(()=>r(null),1500))]);
      if(reg){await reg.showNotification('time for coffee ☕',{body,icon:'icon-192.png',badge:'icon-192.png',tag:'daily-brew',data:{action:'quickbrew'}});return;}
    }
  }catch(e){}
  if(document.visibilityState==='visible')toast('☕ '+body);
}
// suggestie tonen als het tijdstip vandaag al voorbij is en nog niet getoond
function checkReminderOnOpen(){
  const r=getReminder();if(!r.on)return;
  const [h,m]=(r.time||'08:00').split(':').map(Number);
  const now=new Date(),t=new Date();t.setHours(h||0,m||0,0,0);
  if(now>=t&&r.lastShown!==todayKey())showBrewSuggestion();
  scheduleReminder();
}
/* echte achtergrond-push via de Cloudflare Worker (optioneel).
   laat PUSH_ENDPOINT leeg -> alleen lokale meldingen (app open / bij openen).
   vul de Worker-URL in -> ook een push op je tijd als de app dicht is. */
function PUSH_ENDPOINT_GET(){return (localStorage.getItem('scc_push_url')||'').trim();}
function urlBase64ToUint8Array(base64){
  const pad='='.repeat((4-base64.length%4)%4);
  const b=(base64+pad).replace(/-/g,'+').replace(/_/g,'/');
  const raw=atob(b);const out=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);
  return out;
}
function currentTz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';}catch(e){return 'UTC';}}
async function syncPushSubscription(){
  const PUSH_ENDPOINT=PUSH_ENDPOINT_GET();
  if(!PUSH_ENDPOINT)return;                       // geen server ingesteld
  if(!('serviceWorker'in navigator)||!('PushManager'in window))return;
  try{
    const reg=await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub){
      const res=await fetch(PUSH_ENDPOINT.replace(/\/$/,'')+'/vapidPublicKey');
      const {key}=await res.json();
      if(!key)return;
      sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(key)});
    }
    const r=getReminder();
    await fetch(PUSH_ENDPOINT.replace(/\/$/,'')+'/subscribe',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({subscription:sub,time:r.time||'08:00',tz:currentTz()})
    });
  }catch(e){/* stil: lokale meldingen blijven werken */}
}
async function disablePushSubscription(){
  const PUSH_ENDPOINT=PUSH_ENDPOINT_GET();
  if(!PUSH_ENDPOINT)return;
  if(!('serviceWorker'in navigator)||!('PushManager'in window))return;
  try{
    const reg=await navigator.serviceWorker.ready;
    const sub=await reg.pushManager.getSubscription();
    if(!sub)return;
    await fetch(PUSH_ENDPOINT.replace(/\/$/,'')+'/unsubscribe',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({endpoint:sub.endpoint})
    }).catch(()=>{});
    await sub.unsubscribe().catch(()=>{});
  }catch(e){}
}
function toggleAI(){
  localStorage.setItem('scc_ai_on',aiEnabled()?'0':'1');
  renderProfile();
  toast(aiEnabled()?'AI on':'AI off');
}
function saveKey(){
  const v=document.getElementById('ai-key').value.trim();
  sessionAiKeys[aiProv()]=v;
  localStorage.removeItem(aiSleutelNaam());
  applyAIVisibility();
  try{renderAiProv();renderAiBudget();}catch(e){}
  toast(v?'✓ key available in this tab':'key cleared');
}
/* ---------------- AI-budget: wat de AI deze maand kostte -------------------
   Anthropic geeft met een gewone sleutel nergens terug hoeveel tegoed er nog op
   je account staat -- dat kan alleen met een aparte beheerderssleutel, en die
   heeft de app niet. Wat wel bij elk antwoord meekomt, is een `usage`-blok met
   het aantal tekens erin en eruit. Daarmee telt de app precies wat ZIJ uitgeeft,
   en zet dat af tegen een plafond dat jij zelf kiest. De lijn loopt dus naar jouw
   plafond, niet naar je echte saldo -- dat laatste zou verzonnen zijn.        */
const AI_BRONNEN=[['finder','ask the finder'],['bean','beans & labels'],
  ['brew','brew tips & recipes'],['learn','learn: tell me more'],
  ['pour','pour photos'],['recap','weekly recap'],['other','other answers']];
const AI_KORT={finder:'finder<br>questions',bean:'label<br>scans',brew:'brew<br>tips',
  learn:'learn<br>answers',pour:'pour<br>photos',recap:'recaps',other:'other<br>answers'};
// hoe groot zo'n vraag ongeveer is, zolang je er zelf nog te weinig van gedaan
// hebt om een gemiddelde te vertrouwen. In tekens, niet in geld -- wat het kost
// hangt af van de aanbieder die je koos
const AI_SCHAT={finder:[4000,700],bean:[1600,280],brew:[600,280],learn:[900,350],
  pour:[1800,570],recap:[700,320],other:[900,350]};
const AI_PLAFONDS=[2,5,10];

const aiGeld=v=>'$'+(Math.round(v*100)/100).toFixed(2);
function aiMaand(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');}
// haalt de teller op, en rolt hem om zodra er een nieuwe maand begonnen is
function aiBud(){
  if(!state.ai)state.ai={budget:5,maand:aiMaand(),dagen:{},bron:{},gemeld:{}};
  if(state.ai.maand!==aiMaand()){
    state.ai.maand=aiMaand();state.ai.dagen={};state.ai.bron={};state.ai.gemeld={};
  }
  // toen er nog maar één aanbieder was stond de bron er zonder naam voor
  for(const k in state.ai.bron)if(k.indexOf(':')<0){
    state.ai.bron['anthropic:'+k]=state.ai.bron[k];delete state.ai.bron[k];
  }
  return state.ai;
}
function aiBesteed(){const d=aiBud().dagen;let t=0;for(const k in d)t+=d[k];return t;}
function aiOver(){const a=aiBud();return a.budget==null?null:Math.max(0,a.budget-aiBesteed());}
// de prijs van zo'n vraag: eerst je eigen cijfers, en pas een schatting zolang
// je er nog te weinig gedaan hebt om een gemiddelde te vertrouwen
function aiPerVraag(bron){
  const b=aiBud().bron[aiProv()+':'+bron];
  if(b&&b.n>=3&&b.d>0)return b.d/b.n;
  const t=aiTarief(),g=AI_SCHAT[bron]||AI_SCHAT.other;
  return g[0]*t.in+g[1]*t.uit;
}
function aiTel(usage,bron){
  if(!usage)return;
  const a=aiBud();
  // de app gebruikt geen prompt-caching, dus die twee velden zijn nul -- ze staan
  // erbij zodat een gecachete aanroep later niet per ongeluk gratis lijkt
  const inTok=(usage.input_tokens||0)+(usage.cache_creation_input_tokens||0)+
              (usage.cache_read_input_tokens||0);
  const t=aiTarief();
  const d=inTok*t.in+(usage.output_tokens||0)*t.uit;
  if(!(d>0))return;
  const dag=new Date().getDate();
  a.dagen[dag]=(a.dagen[dag]||0)+d;
  // per aanbieder apart bijhouden: een vraag aan de een kost iets heel anders
  // dan dezelfde vraag aan de ander
  const k=aiProv()+':'+(AI_BRONNEN.some(x=>x[0]===bron)?bron:'other');
  if(!a.bron[k])a.bron[k]={n:0,d:0};
  a.bron[k].n++;a.bron[k].d+=d;
  save();
  if(currentPage==='profile'){try{renderAiBudget();}catch(e){}}
}
/* de melding: precies twee keer per maand, bij 20% en bij 10%. Daarna zwijgt de
   app tot de 1e -- ook als je doorgaat tot nul. De kaart in instellingen staat
   er altijd voor wie wil kijken.                                              */
function aiMeldNa(){
  if(!featOn('aibudget'))return;
  const a=aiBud();
  if(a.budget==null||!(a.budget>0))return;
  const deel=aiOver()/a.budget;
  let n=0;
  if(deel<=.10&&!a.gemeld.p10)n=10;
  else if(deel<=.20&&!a.gemeld.p20)n=20;
  if(!n)return;
  a.gemeld.p20=true;                     // 20 is altijd voorbij als 10 dat is
  if(n===10)a.gemeld.p10=true;
  save();aiPop(n);
}
function aiPop(n){
  const el=document.getElementById('aibud-pop');if(!el)return;
  const a=aiBud(),over=aiOver(),deel=a.budget?over/a.budget:0;
  const v=Math.max(0,Math.round(over/aiPerVraag('finder')));
  const e=new Date();e.setDate(1);e.setMonth(e.getMonth()+1);
  const nieuw=e.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
  el.innerHTML='<div class="aib-pop">'+
    '<div class="k">'+(n===20?'a fifth of your AI budget left':'a tenth left — last word on it')+'</div>'+
    '<div class="m"><b>'+aiGeld(over)+'</b> of your '+aiGeld(a.budget)+
      ' is left this month — about <b>'+v+' question'+(v===1?'':'s')+'</b> like that one.</div>'+
    '<div class="aib-meter"><i'+(n===10?' class="op"':'')+' style="right:'+
      Math.max(0,Math.min(100,Math.round((1-deel)*100)))+'%"></i></div>'+
    '<div class="aib-schaal"><span>$0</span><span>'+aiGeld(a.budget)+' · resets '+nieuw+'</span></div>'+
    '<div class="m zacht">'+(n===20
      ?'You’ll hear this once more at 10%, then not again this month.'
      :'From here the app stays quiet, whether you stop or spend the rest. Settings → AI has the full picture.')+'</div>'+
    '<div class="aib-knoppen">'+
      '<button class="naar" onclick="aiPopWeg();go(\'profile\')">settings</button>'+
      '<button class="ok" onclick="aiPopWeg()">ok</button></div></div>';
  el.classList.remove('hidden');
}
function aiPopWeg(){const el=document.getElementById('aibud-pop');if(el)el.classList.add('hidden');}
function renderAiProv(){
  const c=document.getElementById('ai-prov-chips');if(!c)return;
  const nu=aiProv(),a=aiAanbieder();
  c.innerHTML=AI_AANBIEDERS.map(x=>'<button class="lp'+(x.id===nu?' sel':'')+
    '" onclick="setAiProv(\''+x.id+'\')">'+esc(x.naam)+'</button>').join('');
  const k=document.getElementById('ai-key');
  if(k){k.placeholder=a.hint;k.value=getKey();}
  const st=document.getElementById('ai-key-status');
  if(st)st.textContent=getKey()?('✓ '+a.naam+' key in this tab only'):('no '+a.naam+' key yet');
  const m=document.getElementById('ai-model-wrap');
  if(!m)return;
  if(!getKey()){m.innerHTML='';return;}
  const t=aiTarief();
  m.innerHTML='<div class="set-d" style="margin:13px 0 4px">which model answers</div>'+
    '<input class="ai-veld" id="ai-model" value="'+esc(aiModel())+'" placeholder="'+
      esc(a.model)+'" onchange="setAiModel(this.value)">'+
    '<div class="set-d" style="margin:13px 0 4px">what that model costs per million tokens. '+
      'the app counts your spending with these two numbers — check them at '+esc(a.waar)+
      ' and correct them here.</div>'+
    '<div class="aib-prijs">'+
      '<label>in <input class="ai-veld" id="ai-prijs-in" type="number" inputmode="decimal" '+
        'step="0.01" min="0" value="'+(t.in*1e6)+'" onchange="setAiPrijs()"></label>'+
      '<label>out <input class="ai-veld" id="ai-prijs-uit" type="number" inputmode="decimal" '+
        'step="0.01" min="0" value="'+(t.uit*1e6)+'" onchange="setAiPrijs()"></label></div>';
}
function setAiProv(id){
  if(!AI_AANBIEDERS.some(x=>x.id===id))return;
  localStorage.setItem('scc_ai_prov',id);
  renderAiProv();renderAiBudget();applyAIVisibility();
  toast(aiAanbieder().naam+(getKey()?' — key in this tab':' — paste a key'));
}
function setAiModel(v){
  localStorage.setItem('scc_ai_model_'+aiProv(),(v||'').trim());
  renderAiProv();renderAiBudget();toast('✓ model: '+aiModel());
}
function setAiPrijs(){
  const i=document.getElementById('ai-prijs-in'),u=document.getElementById('ai-prijs-uit');
  if(!i||!u)return;
  const a=parseFloat(i.value),b=parseFloat(u.value);
  if(!(a>=0)||!(b>=0)){toast('those need to be numbers');return;}
  localStorage.setItem('scc_ai_prijs_'+aiProv(),JSON.stringify({in:a,uit:b}));
  renderAiBudget();toast('✓ rate saved');
}
function setAiBudget(v){
  const a=aiBud();
  a.budget=(v==null?null:+v);
  a.gemeld={};                            // een nieuw plafond, dus opnieuw waarschuwen
  save();renderAiBudget();
  toast(v==null?'no ceiling — just counting':'ceiling set to '+aiGeld(+v));
}
/* de aflopende lijn. Elke dag van de maand een punt; vanaf vandaag een
   stippellijn die doortrekt in het tempo waarin je tot nu toe uitgaf.         */
function aiLijnSVG(){
  const a=aiBud(),nu=new Date();
  const inMaand=new Date(nu.getFullYear(),nu.getMonth()+1,0).getDate();
  const vandaag=nu.getDate(),bud=a.budget,besteed=aiBesteed();
  const X=d=>6+(d-1)*(268/Math.max(1,inMaand-1));
  const top=bud!=null?bud:Math.max(besteed*1.3,.5);
  const Y=v=>88-(Math.max(0,Math.min(top,v))/top)*80;
  let loop=0,pad='';
  for(let d=1;d<=vandaag;d++){
    loop+=a.dagen[d]||0;
    pad+=(d===1?'M':' L')+X(d).toFixed(1)+','+Y(bud!=null?bud-loop:loop).toFixed(1);
  }
  const lx=X(vandaag).toFixed(1), ly=Y(bud!=null?bud-besteed:besteed).toFixed(1);
  const op=bud!=null&&besteed>=bud*.8;
  let svg='<svg viewBox="0 0 280 108" aria-hidden="true">';
  if(bud!=null)svg+='<rect class="band" x="6" y="'+Y(bud*.2).toFixed(1)+'" width="268" height="'+
    (88-Y(bud*.2)).toFixed(1)+'"/>';
  svg+='<line class="as" x1="6" y1="8" x2="6" y2="88"/>'+
       '<line class="nul" x1="6" y1="88" x2="274" y2="88"/>'+
       '<path class="weg'+(op?' op':'')+'" d="'+(pad||('M6,'+Y(bud!=null?bud:0)))+'"/>';
  // vooruitblik: alleen als er iets te voorspellen valt
  let bij='';
  if(vandaag>=2&&besteed>0){
    const tempo=besteed/vandaag, eind=besteed+tempo*(inMaand-vandaag);
    svg+='<path class="straks" d="M'+lx+','+ly+' L'+X(inMaand).toFixed(1)+','+
      Y(bud!=null?Math.max(0,bud-eind):eind).toFixed(1)+'"/>';
    if(bud!=null){
      if(eind<bud){
        bij='<text class="eind" x="272" y="'+Math.min(84,(+Y(bud-eind)+16)).toFixed(1)+
          '">≈ '+aiGeld(bud-eind)+' left</text>';
      }else{
        const dOp=Math.ceil(bud/tempo);
        if(dOp<=inMaand)bij='<text class="eind" x="272" y="80">empty around '+dOp+' '+
          nu.toLocaleDateString('en-GB',{month:'short'})+'</text>';
      }
    }
  }
  svg+='<circle class="nu'+(op?' op':'')+'" cx="'+lx+'" cy="'+ly+'" r="4.4"/>'+
       '<text x="6" y="102">1 '+nu.toLocaleDateString('en-GB',{month:'short'})+'</text>'+
       '<text x="'+lx+'" y="102" text-anchor="middle">today</text>'+
       (vandaag<inMaand-2?'<text class="eind" x="274" y="102">'+inMaand+'</text>':'')+
       bij+'</svg>';
  return svg;
}
function renderAiBudget(){
  const el=document.getElementById('ai-bud-wrap');if(!el)return;
  if(!featOn('aibudget')||!aiReady()){el.innerHTML='';return;}
  const a=aiBud(),bud=a.budget,besteed=aiBesteed(),over=aiOver(),nu=new Date();
  const dag=nu.getDate();
  const op=bud!=null&&besteed>=bud*.8;
  let h='<div class="set-d" style="margin-bottom:2px">this month, so far · '+
    esc(aiModel())+'</div>';
  h+='<div class="aib-groot'+(op?' op':'')+'">'+(bud!=null
      ?aiGeld(over)+' <span class="van">of '+aiGeld(bud)+'</span>'
      :aiGeld(besteed)+' <span class="van">spent</span>')+'</div>';
  h+='<div class="set-d">'+nu.toLocaleDateString('en-GB',{day:'numeric',month:'long'})+
     ' · '+aiGeld(besteed)+' spent in '+dag+' day'+(dag===1?'':'s')+'</div>';
  h+='<div class="aib-lijn">'+aiLijnSVG()+'</div>';
  // hoeveel is dat nog in vragen? Eerst de knoppen die je zelf het meest gebruikt
  if(bud!=null){
    const gebruikt=AI_BRONNEN.filter(b=>a.bron[aiProv()+':'+b[0]])
      .sort((x,y)=>a.bron[aiProv()+':'+y[0]].n-a.bron[aiProv()+':'+x[0]].n).map(b=>b[0]);
    const toon=(gebruikt.concat(['finder','bean','brew']).filter((v,i,z)=>z.indexOf(v)===i)).slice(0,3);
    h+='<div class="aib-vert">'+toon.map(k=>'<div><div class="n">'+
      Math.round(over/aiPerVraag(k))+'</div><div class="l">'+AI_KORT[k]+'</div></div>').join('')+'</div>';
  }
  // waar het heen ging
  // over alle aanbieders bij elkaar: het gaat om waar JIJ het aan uitgaf
  const tel={};
  for(const k in a.bron){const n=k.split(':')[1];
    if(!tel[n])tel[n]={n:0,d:0};tel[n].n+=a.bron[k].n;tel[n].d+=a.bron[k].d;}
  const rijen=AI_BRONNEN.filter(b=>tel[b[0]]&&tel[b[0]].d>0)
    .sort((x,y)=>tel[y[0]].d-tel[x[0]].d);
  if(rijen.length){
    const max=tel[rijen[0][0]].d;
    h+='<div class="eyebrow" style="margin-top:14px"><span>where it went</span></div>'+
       '<div class="aib-bron">'+rijen.map(b=>{
      const r=tel[b[0]];
      return '<div class="r"><div class="w">'+esc(b[1])+' <span class="set-d" style="display:inline">'+
        r.n+'×</span><div class="b" style="width:'+Math.max(6,Math.round(r.d/max*100))+
        '%"></div></div><div class="g">'+aiGeld(r.d)+'</div></div>';
    }).join('')+'</div>';
  }
  // het plafond zelf
  h+='<div class="eyebrow" style="margin-top:14px"><span>what may it cost you per month?</span></div>'+
     '<div class="aib-chips">'+AI_PLAFONDS.map(v=>'<button class="lp'+(bud===v?' sel':'')+
       '" onclick="setAiBudget('+v+')">$'+v+'</button>').join('')+
     '<button class="lp'+(bud==null?' sel':'')+'" onclick="setAiBudget(null)">no ceiling</button></div>';
  h+='<div class="set-d" style="margin-top:8px">Resets on the 1st. Counted on this device only, '+
     'from what Anthropic sends back with each answer — your real credit at Anthropic '+
     'can’t be read with an ordinary key.</div>';
  el.innerHTML=h;
}

/* toont/verbergt alle AI-knoppen door .ai-only klassen */
function applyAIVisibility(){
  document.querySelectorAll('.ai-only').forEach(el=>el.classList.toggle('hidden',!aiReady()));
}

/* ---------------- export / import ---------------- */
const APP_VERSION='2026.10-workspace2';
/* ================= de datalaag =================================================
   Binnen in de app is `state` gegroeid zoals het uitkwam. Dat is prima om mee te
   werken, maar niets om andere software aan vast te knopen: verandert er iets aan
   de binnenkant, dan breekt alles wat meekijkt.

   Daarom ligt hier een tweede, vaste vorm eroverheen. Beans, brews en methods met
   hun koppelingen expliciet als ids, één versienummer, en alles alleen te lezen.
   De binnenkant mag daaronder blijven schuiven.                                */
const LB_SCHEMA=2;
// kopie zonder verbinding met state: wat je hier krijgt kun je niet stukmaken
const lbKopie=v=>JSON.parse(JSON.stringify(v==null?null:v));
const lbIso=ts=>{const d=new Date(ts||0);return isNaN(d.getTime())?null:d.toISOString();};

function lbMethod(m){
  return {id:m.id,name:m.name||'',family:methodFamily(m),enabled:m.on!==false,
    gearIds:Array.isArray(m.gear)?m.gear.slice():[]};
}
function lbBean(b){
  const f=beanFreshness(b);
  const dials={};
  Object.keys((b.dialed&&typeof b.dialed==='object')?b.dialed:{}).forEach(mid=>{
    const d=b.dialed[mid];if(!d||!d.grind)return;
    dials[mid]={grind:d.grind,dose:d.dose==null?null:d.dose,yield:d.yield==null?null:d.yield,
      time:d.time||null,timeSec:parseTimeSec(d.time),drink:d.drink||null,at:lbIso(d.ts)};
  });
  return {id:b.id,name:b.name||'',roaster:b.roaster||null,origin:b.origin||null,
    process:b.process||null,variety:b.variety||null,altitudeM:altitudeOf(b),
    roastLevel:b.roast||null,roastDate:b.roastdate||null,daysSinceRoast:f?f.days:null,
    roasterNotes:b.roasternotes||null,notes:b.notes||null,inStock:b.inStock!==false,
    decaf:isDecaf(b),bagLabel:b.fam||null,
    regions:(Array.isArray(b.regions)?b.regions:(b.region?[b.region]:[]))
      .map(r=>({land:r.land,i:r.i==null?null:r.i})),
    region:(Array.isArray(b.regions)&&b.regions[0])||b.region||null,
    methodIds:(Array.isArray(b.methods)&&b.methods.length?b.methods:(b.method?[b.method]:[])).slice(),
    dials,
    brewIds:state.brews.filter(x=>x.beanId===b.id).map(x=>x.id)};
}
function lbBrew(x){
  return {id:x.id,at:lbIso(x.ts),methodId:x.method||null,beanId:x.beanId||null,
    beanName:x.beans||null,title:x.title||null,drink:x.drink||null,
    dose:x.dose==null?null:x.dose,yield:x.yield==null?null:x.yield,
    ratio:x.ratio==null?null:x.ratio,time:x.time||null,timeSec:parseTimeSec(x.time),
    grind:x.grind||null,temp:x.temp==null?null:x.temp,
    score:x.score==null?null:x.score,tags:asArr(x.tags).slice(),notes:x.notes||null,
    kind:x.kind||(x.dialIn?'dial-in':'brew'),recipeId:x.recipeId||null,recipeSnapshot:x.recipeSnapshot?lbKopie(x.recipeSnapshot):null,beanSnapshot:x.beanSnapshot?lbKopie(x.beanSnapshot):null,isDialIn:isDialInBrew(x),target:x.target?lbKopie(x.target):null};
}
function lbRecipe(r){
  return {id:r.id,name:r.naam||'',family:recipeFam(r),methodId:methodForRecipe(r),
    dose:r.dose==null?null:r.dose,ratio:r.ratio==null?null:r.ratio,
    temp:r.temp==null?null:r.temp,grind:r.maling||null,targetGrind:r.stand||null,
    own:!!r.eigen};
}
// alle pogingen per boon+methode, in de volgorde waarin je ze deed
function lbDialLog(){
  const log=state.dialLog||{};
  return Object.keys(log).map(k=>{
    const i=k.indexOf('|');
    return {beanId:k.slice(0,i)||null,methodId:k.slice(i+1),
      attempts:(log[k]||[]).map(a=>({at:lbIso(a.ts),grind:a.g||null,time:a.t||null,
        timeSec:parseTimeSec(a.t),yield:a.y==null?null:a.y,dose:a.d==null?null:a.d}))};
  }).filter(x=>x.attempts.length);
}
// het hele model in één keer, koppelingen als ids
function lbGraph(){
  return {
    app:'lets-brew-specialty', schema:LB_SCHEMA, appVersion:APP_VERSION,
    generatedAt:new Date().toISOString(),
    methods:(state.methods||[]).map(lbMethod),
    beans:(state.beans||[]).map(lbBean),
    brews:(state.brews||[]).slice().sort((a,b)=>b.ts-a.ts).map(lbBrew),
    recipes:(state.recipes||[]).concat(ALLE_RECEPTEN()).map(lbRecipe),
    dialLog:lbDialLog(),
    gear:(state.gear||[]).map(g=>({id:g.id,name:g.name||'',category:g.category||null,kind:g.kind||null,
      grindMin:g.grindMin==null?null:g.grindMin,grindMax:g.grindMax==null?null:g.grindMax}))
  };
}
/* De leeskant voor andere software op dit toestel. Alleen lezen, en alles komt er
   als kopie uit -- een koppeling mag nooit je logboek kunnen wijzigen. Schrijven
   loopt via de schermen zelf en via "add from a friend".                       */
window.LetsBrew=Object.freeze({
  schema:LB_SCHEMA,
  appVersion:APP_VERSION,
  methods:()=>lbGraph().methods,
  beans:()=>lbGraph().beans,
  recipes:()=>lbGraph().recipes,
  gear:()=>lbGraph().gear,
  method:id=>{const m=methodById(id);return m?lbMethod(m):null;},
  bean:id=>{const b=beanById(id);return b?lbBean(b):null;},
  brew:id=>{const x=(state.brews||[]).find(y=>y.id===id);return x?lbBrew(x):null;},
  // filter: {beanId, methodId, since (ISO of ms), dialInOnly, limit}
  brews:(f)=>{
    f=f||{};
    const sinds=f.since?(typeof f.since==='number'?f.since:Date.parse(f.since)):null;
    let uit=(state.brews||[]).filter(x=>
      (!f.beanId||x.beanId===f.beanId)&&
      (!f.methodId||x.method===f.methodId)&&
      (!sinds||(x.ts||0)>=sinds)&&
      (!f.dialInOnly||isDialInBrew(x)));
    uit=uit.sort((a,b)=>b.ts-a.ts);
    if(f.limit>0)uit=uit.slice(0,f.limit);
    return uit.map(lbBrew);
  },
  // alles wat aan één boon hangt, in één keer
  beanGraph:id=>{
    const b=beanById(id);if(!b)return null;
    const bean=lbBean(b);
    return {bean,
      brews:(state.brews||[]).filter(x=>x.beanId===id).sort((a,c)=>c.ts-a.ts).map(lbBrew),
      methods:bean.methodIds.map(m=>methodById(m)).filter(Boolean).map(lbMethod),
      dialLog:lbDialLog().filter(d=>d.beanId===id)};
  },
  graph:()=>lbGraph()
});
/* Meekijken van buiten het venster: wie de app in een iframe zet of met
   window.open opent, kan hem hetzelfde vragen. Vraag erin, antwoord eruit. */
window.addEventListener('message',ev=>{
  const q=ev.data;
  if(ev.origin!==location.origin||!q||q.lb!=='query'||!ev.source)return;
  let data=null,fout=null;
  try{
    const api=window.LetsBrew;
    const fn=Object.hasOwn(api,q.method)?api[q.method]:undefined;
    data=(typeof fn==='function')?fn(q.arg):(fn===undefined?null:fn);
    if(fn===undefined)fout='unknown method: '+q.method;
  }catch(e){fout=e.message;}
  ev.source.postMessage({lb:'result',id:q.id||null,schema:LB_SCHEMA,
    data:fout?null:data,error:fout},ev.origin);
});
function apiStat(){
  const el=document.getElementById('api-stat');if(!el)return;
  const g=lbGraph();
  el.textContent='schema v'+g.schema+' \u00b7 '+g.beans.length+' bean'+(g.beans.length===1?'':'s')+
    ', '+g.brews.length+' brew'+(g.brews.length===1?'':'s')+', '+
    g.methods.filter(m=>m.enabled).length+' method'+(g.methods.filter(m=>m.enabled).length===1?'':'s')+'.';
}
function apiCopy(){
  const t=JSON.stringify(lbGraph(),null,2);
  (navigator.clipboard&&navigator.clipboard.writeText)
    ? navigator.clipboard.writeText(t).then(()=>toast('\u2713 data copied as JSON'),()=>toast('couldn\u2019t copy \u2014 use the download instead'))
    : toast('couldn\u2019t copy \u2014 use the download instead');
}
function apiDownload(){
  const blob=new Blob([JSON.stringify(lbGraph(),null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='lets-brew-data.json';a.click();
  URL.revokeObjectURL(url);toast('data file downloaded');
}
function apiCopyLink(){
  const url=location.origin+location.pathname+'?api=graph';
  (navigator.clipboard&&navigator.clipboard.writeText)
    ? navigator.clipboard.writeText(url).then(()=>toast('read link copied'),()=>prompt('copy this link:',url))
    : prompt('copy this link:',url);
}
/* ?api=graph -- de data als kale JSON, zodat een Shortcut of een ander programma
   hem kan ophalen zonder de app te hoeven kennen.                            */
let lbApiMode=false;
function apiPagina(){
  const q=/[?&]api=([a-z]+)/.exec(location.search);
  if(!q)return false;
  lbApiMode=true;
  const data=(q[1]==='graph')?lbGraph():{error:'unknown api: '+q[1],schema:LB_SCHEMA};
  document.open();
  document.write('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>lets brew \u00b7 data</title><pre style="white-space:pre-wrap;word-break:break-word;'+
    'font:13px ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px;margin:0">'+
    JSON.stringify(data,null,2).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</pre>');
  document.close();
  return true;
}
async function exportData(){
  await saveQueue;
  const original=storageBlocked?await idbGet(IDB_KEY):state;
  const blob=new Blob([JSON.stringify(original,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='lets-brew-specialty-backup.json';a.click();
  URL.revokeObjectURL(url);toast('back-up downloaded');
}
function importData(ev){
  const file=ev.target.files&&ev.target.files[0];if(!file)return;
  try{BrewSecurity.checkFile(file);}catch(e){toast(e.message);ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{const d=BrewSecurity.validateImport(JSON.parse(r.result),{backup:true});
      if(!d.methods||!d.brews)throw new Error('ongeldig');
      if(!d.beans)d.beans=[];
      if(!confirm('this replaces your current data. continue?')){ev.target.value='';return;}
      state=BrewModel.migrate(normaliseerData(d));storageBlocked=false;
      mergeMethodImages();          // dezelfde opschoning als bij het opstarten
      save();toast('✓ data imported');renderAll();go('home');
    }catch(e){toast('couldn\'t read the file');}
    ev.target.value='';
  };
  r.readAsText(file);
}

/* ---------------- wat is er nieuw ---------------- */
const NIEUWS=[
  ['pour coach','filterrecepten lopen mee met de klok'],
  ['zeven recepten','Hoffmann, 4:6, Rao en meer, op jouw dose'],
  ['filterkompas','wat je proefde \u2192 \u00e9\u00e9n vervolgstap'],
  ['doorlooptijd','plus hoe het bed erbij lag'],
  ['waterkaart','reken je eigen recept uit'],
  ['filter skills','een eigen leerspoor bij learn'],
];
function toonNieuws(){
  const el=document.getElementById('wn-list');if(!el)return;
  const bolletje='<svg viewBox="0 0 16 16"><path d="M12.6 5.2 C14 8.6 11.4 12.6 7.6 12 C3.6 11 3 6 6 3.6 C8.6 1.8 12 3.4 12.8 6.4"/></svg>';
  el.innerHTML=NIEUWS.map(([k,t])=>
    `<div class="wn-i">${bolletje}<span><b>${esc(k)}</b> — ${esc(t)}</span></div>`).join('');
  const p=document.getElementById('whatsnew');
  p.classList.add('on');p.setAttribute('aria-hidden','false');
}
function sluitNieuws(){
  const p=document.getElementById('whatsnew');if(!p)return;
  p.classList.remove('on');p.setAttribute('aria-hidden','true');
  try{localStorage.setItem('scc_seen_version',APP_VERSION);}catch(e){}
}
/* Alleen tonen aan wie de vorige versie al draaide. Een verse installatie
   krijgt niets te zien — die heeft immers niets gemist. */
function nieuwsMisschien(){
  let seen=null;
  try{seen=localStorage.getItem('scc_seen_version');}catch(e){}
  if(seen===APP_VERSION)return;
  if(!seen && !hadOpgeslagenData){
    try{localStorage.setItem('scc_seen_version',APP_VERSION);}catch(e){}
    return;
  }
  setTimeout(toonNieuws,900);
}
/* ---------------- util ---------------- */
function jsArg(value){return esc(JSON.stringify(String(value??'')));}
function esc(s){return(s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
let toastT;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1600);}

const _renderFormTags=renderFormTags;
renderFormTags=function(){_renderFormTags();try{renderTasteWheel();}catch(e){}};
const loadPromise=load();
// vraag de browser om de opslag permanent te maken (beschermt tegen
// automatisch opruimen van lokale data door iOS/Safari bij weinig gebruik)
if(navigator.storage&&navigator.storage.persist){
  navigator.storage.persist().catch(()=>{});
}
loadPromise.then(()=>{if(apiPagina())return;try{applyFeatures();}catch(e){}try{applyAIVisibility();}catch(e){}try{checkReminderOnOpen();}catch(e){}}).catch(()=>toast('Stored data need checking. Export a backup via profile.'));

// app geopend vanuit een melding? -> pas na het laden/splash een nieuwe brew voorstellen
let pendingQuickBrew=/[?&]quickbrew=1/.test(location.search);
let pendingBrewParam=(location.search.match(/[?&]brew=([^&]+)/)||[])[1]||null;
if('serviceWorker'in navigator){
  navigator.serviceWorker.addEventListener('message',e=>{
    if(e&&e.data&&e.data.type==='quick-brew'){
      if(currentPage==='welcome')pendingQuickBrew=true; else quickBrew();
    }
  });
}
// suggestie opnieuw checken wanneer de app naar de voorgrond komt
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){try{checkReminderOnOpen();}catch(e){}}});

// swipe van links naar rechts = terug (iOS-stijl)
(function(){
  let sx=0,sy=0,tracking=false;
  const ph=document.querySelector('.phone');
  if(!ph)return;
  ph.addEventListener('touchstart',e=>{
    if(e.touches.length!==1){tracking=false;return;}
    const t=e.touches[0];
    // alleen starten als de veeg dicht bij de linkerrand begint
    tracking = t.clientX < 45;
    sx=t.clientX;sy=t.clientY;
  },{passive:true});
  ph.addEventListener('touchend',e=>{
    if(!tracking)return;tracking=false;
    const t=e.changedTouches[0];
    const dx=t.clientX-sx, dy=t.clientY-sy;
    // duidelijke horizontale veeg naar rechts, weinig verticaal
    if(dx>70 && Math.abs(dy)<60){
      // niet terug vanaf splash/naam
      if(currentPage!=='welcome')goBack();
    }
  },{passive:true});
})();

// Start after all controllers are loaded; stored data is never replaced on read failure.
window.addEventListener('DOMContentLoaded',()=>Promise.resolve(loadPromise).catch(()=>{}).then(()=>{
  if(lbApiMode)return;
  go(typeof BrewWorkspace!=='undefined'?BrewWorkspace.initialPage():'home');
  if(pendingQuickBrew){pendingQuickBrew=false;try{quickBrew();}catch{}}
  if(pendingBrewParam){const mid=decodeURIComponent(pendingBrewParam);pendingBrewParam=null;try{beginBrew(mid);}catch{}}
}),{once:true});
