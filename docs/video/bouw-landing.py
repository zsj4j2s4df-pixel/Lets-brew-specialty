#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bouwt de landingspagina met de video erin gebakken.

    python3 docs/video/bouw-landing.py pad/naar/lets-brew.mp4

Waarom bakken en niet linken: een artifact mag niets van buiten laden — geen CDN, geen
losse videobestanden — en mag hoogstens 16 MB zijn. De video gaat er dus als data:-URI
in. Exporteer hem op 720x1280, H.264, ongeveer 8 Mbit/s; dan blijft een video van
ruim een minuut onder de 10 MB.

Geen bestand meegegeven? Dan pakt hij een van de app-opnames als proefbeeld, zodat je
de vormgeving kunt beoordelen voordat de montage klaar is.
"""
import base64, io, mimetypes, os, sys

HIER = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HIER, '..', '..', '.claude', 'skills', 'nieuwe-feature',
                     'scripts', 'fonts.css')
UIT = os.path.join(HIER, 'landing.html')
APP = 'https://letsbrewspecialty.jesseboontje.workers.dev/'
GRENS = 15 * 1024 * 1024        # ruim onder de 16 MB die een artifact aankan

def main():
    if len(sys.argv) > 1:
        video = sys.argv[1]
        proef = False
    else:
        video = os.path.join(HIER, 'opnames', '04-kaart-streek.webm')
        proef = True
        print('geen video meegegeven — ik pak een app-opname als proefbeeld')

    if not os.path.exists(video):
        sys.exit('kan %s niet vinden' % video)

    rauw = open(video, 'rb').read()
    soort = mimetypes.guess_type(video)[0] or 'video/mp4'
    b64 = base64.b64encode(rauw).decode('ascii')
    if len(b64) > GRENS:
        sys.exit('de video is %.1f MB als data:-URI — dat past niet in een artifact.\n'
                 'Exporteer hem kleiner: 720x1280, H.264, ~8 Mbit/s.'
                 % (len(b64) / 1048576))

    fonts = io.open(FONTS, encoding='utf-8').read()
    pagina = SJABLOON.replace('/*FONTS*/', fonts) \
                     .replace('DATA_URI', 'data:%s;base64,%s' % (soort, b64)) \
                     .replace('APP_URL', APP) \
                     .replace('<!--PROEF-->', PROEFREGEL if proef else '')
    io.open(UIT, 'w', encoding='utf-8').write(pagina)
    print('%s  (%.1f MB)' % (UIT, os.path.getsize(UIT) / 1048576))
    print('publiceer dit bestand met de Artifact-tool')


PROEFREGEL = ('<p class="proef">Dit is nog een losse app-opname als proefbeeld — '
              'draai dit script opnieuw met de gemonteerde video erachter.</p>')

SJABLOON = r"""<title>Lets Brew Specialty</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
/*FONTS*/
:root{
  --paper:#efe9dd; --card:#e7ded0; --card-2:#ded2c0; --desk:#d4ccbe;
  --ink:#3a302a; --ink-soft:#7a6c5e; --line:#b8a98f;
  --accent-soft:#7d6650; --cream:#f2ead9;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --paper:#241d18; --card:#2d251e; --card-2:#372d24; --desk:#1a1511;
    --ink:#efe4d5; --ink-soft:#a6947f; --line:#4c3d31;
    --accent-soft:#c79a6d; --cream:#241d18;
  }
}
:root[data-theme="dark"]{
  --paper:#241d18; --card:#2d251e; --card-2:#372d24; --desk:#1a1511;
  --ink:#efe4d5; --ink-soft:#a6947f; --line:#4c3d31;
  --accent-soft:#c79a6d; --cream:#241d18;
}
*{box-sizing:border-box;}
body{margin:0;padding:0 20px 60px;background:var(--desk);color:var(--ink);
  font-family:'Patrick Hand','Segoe Print',cursive;font-size:19px;line-height:1.5;}
.wrap{max-width:560px;margin:0 auto;}
header{padding:46px 0 4px;text-align:center;}
h1{font-family:'Caveat',cursive;font-weight:700;font-size:clamp(46px,12vw,74px);
  line-height:.95;margin:0 0 6px;text-wrap:balance;}
.onder{color:var(--ink-soft);margin:0 auto;max-width:30ch;}
.doek{margin:26px auto 0;background:var(--paper);border:2px solid var(--ink);
  border-radius:26px;filter:url(#wobble);padding:8px;max-width:340px;}
video{display:block;width:100%;aspect-ratio:9/16;border-radius:20px;background:var(--card);}
.knop{display:flex;align-items:center;justify-content:center;gap:10px;
  width:100%;max-width:340px;margin:20px auto 0;background:var(--accent-soft);
  color:var(--cream);border:2px solid var(--ink);border-radius:18px;filter:url(#wobble);
  padding:17px 20px;font-family:'Caveat',cursive;font-weight:700;font-size:29px;
  text-decoration:none;cursor:pointer;}
.knop:active{filter:url(#wobble) brightness(.92);}
.knop:focus-visible{outline:3px solid var(--ink);outline-offset:3px;}
.tip{text-align:center;color:var(--ink-soft);font-size:16.5px;margin:9px auto 0;
  max-width:34ch;}
.proef{text-align:center;color:var(--ink-soft);font-size:16px;border:2px dashed var(--line);
  border-radius:16px;padding:9px 13px;margin:16px auto 0;max-width:340px;}
.drie{display:grid;gap:12px;margin:34px auto 0;max-width:400px;}
.kaart{background:var(--paper);border:2px solid var(--line);border-radius:20px;
  filter:url(#wobble);padding:13px 17px;display:flex;gap:13px;align-items:flex-start;}
.kaart svg{flex:none;width:34px;height:34px;fill:none;stroke:var(--ink);
  stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;filter:url(#wobble-rough);}
.kaart b{display:block;font-family:'Caveat',cursive;font-weight:700;font-size:25px;
  line-height:1.1;}
.kaart span{color:var(--ink-soft);font-size:17px;line-height:1.35;}
footer{text-align:center;color:var(--ink-soft);font-size:16px;margin-top:34px;}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
</style>

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="wobble"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4"/></filter>
  <filter id="wobble-rough"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2"/></filter>
</defs></svg>

<div class="wrap">
<header>
  <h1>Lets Brew</h1>
  <p class="onder">een koffieschrift dat onthoudt wat werkte — met de hand getekend</p>
</header>

<div class="doek">
  <video src="DATA_URI" controls playsinline preload="metadata"></video>
</div>
<!--PROEF-->

<a class="knop" href="APP_URL" target="_blank" rel="noopener">
  open Lets Brew <span aria-hidden="true">&rsaquo;</span></a>
<p class="tip">Werkt in je browser. Zet hem op je beginscherm en hij opent als een app —
  je koffie blijft op je eigen toestel staan.</p>

<div class="drie">
  <div class="kaart">
    <svg viewBox="0 0 24 24"><path d="M12.2 2.6 Q18.4 3.1 20.8 8.4 Q22.6 13.6 19.1 18.1 Q15.4 22 10.1 20.9 Q4.6 19.6 2.9 14.4 Q1.6 9.2 5.6 5.3 Q8.4 2.7 12.4 2.7"/><path d="M2.6 11.8 Q11.8 10.9 21.3 11.9" opacity="0.55"/><path d="M12.1 2.8 Q8.4 7.4 8.6 12.1 Q8.8 17.2 12.3 20.9" opacity="0.55"/></svg>
    <div><b>waar je boon vandaan komt</b>
      <span>een getekende wereldkaart: van werelddeel naar land naar streek, met wat er
        groeit en waar je op let bij de zak</span></div>
  </div>
  <div class="kaart">
    <svg viewBox="0 0 24 24"><path d="M6.7 4.2 Q12 3.9 17.3 4.3 M17.1 4.6 Q16.4 8.1 15.7 11.3 M15.9 11 Q12 11.6 8.1 11.2 M8.3 11.4 Q7.5 8 6.8 4.3 M8.8 11 Q8.6 15.6 8.9 19.9 M8.6 19.5 Q12 20.2 15.4 19.6 M15.2 19.9 Q15.4 15.4 15.1 11"/><path d="M16.6 4.8 Q19.7 4.3 20.8 6.6 Q21.2 8.2 19.6 8.8" opacity="0.8"/></svg>
    <div><b>dial in, met de klok mee</b>
      <span>trek de hendel over en de shot timer loopt met je mee — je pogingen wandelen
        vanzelf de doelband in</span></div>
  </div>
  <div class="kaart">
    <svg viewBox="0 0 24 24"><path d="M4.6 6.2 Q12 5.6 19.5 6.3 M19.2 6 Q16.4 12.8 13.4 18.4 M13.6 18 Q12 18.6 10.4 18.1 M10.6 18.4 Q7.6 12.7 4.8 5.9"/><path d="M10.6 18.3 Q10.4 20.4 10.7 21.6 M13.3 18.3 Q13.5 20.4 13.2 21.6" opacity="0.6"/><path d="M7.4 10.4 Q12 9.8 16.6 10.5" opacity="0.5"/></svg>
    <div><b>pour over die meeloopt</b>
      <span>je recept loopt op de klok. Zit je erlangs? Tik de stap aan wanneer je hem
        écht doet en de rest schuift mee</span></div>
  </div>
</div>

<footer>gemaakt voor thuisbarista's die willen weten waaróm het lekker was</footer>
</div>
"""

if __name__ == '__main__':
    main()
