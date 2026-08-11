#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bouwt de vijf startbeelden die je in Luma als eerste frame meegeeft.

    npm install playwright --no-save
    python3 docs/video/bouw-keyframes.py

Uitkomst: docs/video/keyframes/*.png, elk 1080x1920.

Twee dingen die dit script de moeite waard maken:

  * De machine en de V60 worden **niet nagetekend** maar uit `index.html` gehaald --
    de app heeft ze al als handgetekende SVG (`BREWER_ART.v60` en de E61 in het
    dial-in-scherm). Zo klopt de stijl per definitie in plaats van bij benadering.
  * De barista komt uit `barista.py` en staat in elk beeld op dezelfde plek en
    schaal. Dat is precies wat een referentiebeeld moet doen: hetzelfde formaat
    hoofd, dezelfde lijndikte, dezelfde man.

Getekend op 360x640 en gerenderd op 3x, zodat de lijnen op 1080 breed ongeveer even
dik zijn als in de app zelf.
"""
import io, os, re, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HIER)
import barista

APP = os.path.join(HIER, '..', '..', 'index.html')
UIT = os.path.join(HIER, 'keyframes')
DOEK = (360, 640)          # 9:16, gerenderd op 3x -> 1080x1920
BANKHOOGTE = 470           # waar de rand van de toonbank ligt, in elk keyframe hetzelfde


def uit_de_app():
    """Haalt de E61 en de V60 uit index.html, zodat ze niet twee keer bestaan."""
    bron = io.open(APP, encoding='utf-8').read()

    m = re.search(r"v60:\{[^{]*art:'(<svg.*?</svg>)'", bron, re.S)
    if not m:
        sys.exit('kan de V60-tekening niet vinden in index.html')
    v60 = m.group(1)

    i = bron.index('class="e61-box"')
    j = bron.index('</svg>', i) + len('</svg>')
    m = re.search(r'<svg.*', bron[i:j], re.S)
    if not m:
        sys.exit('kan de E61-tekening niet vinden in index.html')
    e61 = m.group(0)

    # de klokfuncties zijn in een stilstaand beeld alleen maar ruis
    v60 = re.sub(r'<g id="bw-stream".*?</g>', '', v60, flags=re.S)
    v60 = re.sub(r'<rect id="bw-fill"[^>]*/>', '', v60)
    e61 = re.sub(r'<defs>.*?</defs>', '', e61, flags=re.S)
    return e61, v60


def binnenwerk(svg):
    """Alleen de inhoud van een <svg>, zodat je hem in een <g> kunt zetten."""
    return re.sub(r'^<svg[^>]*>|</svg>$', '', svg.strip(), flags=re.S)


def viewbox(svg):
    m = re.search(r'viewBox="([^"]+)"', svg)
    return [float(x) for x in m.group(1).split()] if m else [0, 0, 240, 240]


def plaats(svg, x, y, schaal):
    """Zet een uit de app geleende tekening op zijn plek in het keyframe."""
    vb = viewbox(svg)
    return ('<g transform="translate(%g %g) scale(%g) translate(%g %g)">%s</g>'
            % (x, y, schaal, -vb[0], -vb[1], binnenwerk(svg)))


def figuur(houding, x, schaal=1.05, bank=True):
    """De vakman op zijn vaste plek: de toonbank altijd op y=470 van de 640, zodat
    hij in elk keyframe even groot is en op dezelfde hoogte staat."""
    y = BANKHOOGTE - 254 * schaal
    return ('<g transform="translate(%g %g) scale(%g)">%s</g>'
            % (x, y, schaal, barista.vakman(houding, bank)))


def los(paden, x, y, schaal=1.0):
    return '<g transform="translate(%g %g) scale(%g)">%s</g>' % (x, y, schaal, paden)


def opbank(paden, x, onderkant, schaal):
    """Een los voorwerp dat op de toonbank staat."""
    return los(paden, x, BANKHOOGTE - onderkant * schaal, schaal)


def scenes():
    """Vijf startbeelden met dezelfde man in dezelfde houding.

    Bewust één houding voor alle vijf. Een startbeeld hoeft de handeling niet te
    tonen -- die staat in de prompt en doet Luma. Wat het beeld wél moet vastleggen
    is wie hij is, hoe de lijn loopt en hoe het kader eruitziet, en dat is het
    sterkst als er precies één tekening van hem bestaat. Reikende armen erbij
    tekenen leverde alleen maar vage vormen op die Luma overneemt.
    """
    e61, v60 = uit_de_app()
    VAKMAN = figuur('rust', x=85, schaal=1.0)
    return [
        # 1 · het begin: de boon ligt er al, de vakman staat erbij
        ('s01-begin', los(barista.BOON, 12, 96, 0.46) + VAKMAN),

        # 5 · de zak: op de bank naast hem; in de video pakt hij hem op
        ('s05-zak', opbank(barista.ZAK, 26, 192, 0.50) + VAKMAN),

        # 9 · de machine: de E61 uit de app, naast hem op de bank
        ('s09-machine', plaats(e61, -6, BANKHOOGTE - 215 * 0.48, 0.48) + VAKMAN),

        # 12 · filter: de V60 uit de app. De ketel zit in de prompt, niet in beeld --
        # er is geen ruimte voor zonder dat het rommelig wordt
        ('s12-v60', plaats(v60, -12, BANKHOOGTE - 215 * 0.42, 0.42) + VAKMAN),

        # 14 · het slot: het kopje staat klaar; hij heft het in de video
        ('s14-slot', opbank(barista.KOPJE, 24, 74, 0.58) + VAKMAN),
    ]


PAGINA = """<meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:#efe9dd;}
  svg.doek{display:block;width:%dpx;height:%dpx;background:#efe9dd;}
  svg.doek g,svg.doek path{fill:none;stroke:#3a302a;stroke-width:1.7;
    stroke-linecap:round;stroke-linejoin:round;filter:url(#wobble-rough);}
  svg.doek .b{opacity:.58;stroke-width:1.3;}
  svg.doek .d{opacity:.4;stroke-width:1.2;}
  svg.doek .soft2{opacity:.34;}
  svg.doek .bed{stroke:#7d6650;stroke-width:2;opacity:.7;}
</style>
<svg width="0" height="0" style="position:absolute"><defs>
  <filter id="wobble-rough"><feTurbulence type="fractalNoise" baseFrequency="0.04"
    numOctaves="3" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n"
    scale="2"/></filter>
</defs></svg>
<svg class="doek" viewBox="0 0 %d %d">%%s</svg>
""" % (DOEK[0], DOEK[1], DOEK[0], DOEK[1])

SCHIETER = r"""
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
(async()=>{
  const werk=process.argv[2], uit=process.argv[3];
  const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium'});
  for(const naam of fs.readdirSync(werk).filter(f=>f.endsWith('.html'))){
    const p=await b.newPage({viewport:{width:%d,height:%d},deviceScaleFactor:3});
    const fouten=[];p.on('pageerror',e=>fouten.push(e.message));
    await p.goto('file://'+path.join(werk,naam));
    await p.waitForTimeout(350);
    const doel=path.join(uit,naam.replace('.html','.png'));
    await p.screenshot({path:doel});
    console.log(naam.replace('.html','').padEnd(14),
      Math.round(fs.statSync(doel).size/1024)+' kB',
      fouten.length?('FOUT '+fouten.join(' | ')):'');
    await p.close();
  }
  await b.close();
})();
""" % DOEK


def main():
    os.makedirs(UIT, exist_ok=True)
    werk = os.path.join(UIT, '_html')
    os.makedirs(werk, exist_ok=True)

    for naam, inhoud in scenes():
        io.open(os.path.join(werk, naam + '.html'), 'w',
                encoding='utf-8').write(PAGINA % inhoud)

    schieter = os.path.join(werk, 'schiet.js')
    io.open(schieter, 'w', encoding='utf-8').write(SCHIETER)
    subprocess.run(['node', schieter, werk, UIT], check=True,
                   cwd=os.path.join(HIER, '..', '..'))

    for f in os.listdir(werk):
        os.remove(os.path.join(werk, f))
    os.rmdir(werk)
    print('\nklaar — de startbeelden staan in docs/video/keyframes/')


if __name__ == '__main__':
    main()
