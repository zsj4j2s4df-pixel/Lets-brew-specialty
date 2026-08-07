#!/usr/bin/env python3
"""Wikkel een mockup-body in de huisstijl van Lets Brew.

Jij schrijft alleen de schermen. Dit script zet eromheen wat elke mockup nodig
heeft en wat je anders elke keer opnieuw zit te bedenken: de kleurvariabelen,
de twee handgeschreven lettertypes (ingebed, want een artifact mag niet naar
buiten praten), de potloodfilters, en het telefoonkader.

    python3 .claude/skills/nieuwe-feature/scripts/bouw-mockup.py body.html /tmp/mockup.html

Publiceer daarna het uitvoerbestand met de Artifact-tool.
"""
import os
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HIER, "fonts.css")

DEFS = '''<svg class="defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <filter id="wobble"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4"/></filter>
  <filter id="wobble-h"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter>
  <filter id="wobble-rough"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>
</svg>'''

# Precies de tokens uit index.html. Verander ze hier nooit "even mooier" --
# een mockup die andere kleuren gebruikt dan de app is geen mockup meer.
BASIS = '''
:root{
  --paper:#efe9dd;--card:#e7ded0;--card-2:#ded2c0;
  --ink:#3a302a;--ink-soft:#7a6c5e;--line:#b8a98f;--accent:#4a3b30;
  --cream:#f2ead9;--desk:#d4ccbe;--accent-soft:#7d6650;
  --espresso:#e3d3bf;--aeropress:#dfdcc9;--v60:#e6d9cf;--chemex:#dcd9cc;
  --radius:26px;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}
body{background:var(--desk);color:var(--ink);
  font-family:'Patrick Hand','Segoe Print',cursive;font-size:18px;line-height:1.45;
  padding:26px 16px 60px;}
.hand{font-family:'Caveat',cursive;font-weight:700;letter-spacing:.4px;}
svg.defs{position:absolute;width:0;height:0;}

/* ---- de pagina om de schermen heen ---- */
.mk-wrap{max-width:1100px;margin:0 auto;}
.mk-kop{max-width:620px;margin:0 auto 30px;}
.mk-kop h1{font-family:'Caveat',cursive;font-size:46px;line-height:1.05;margin-bottom:6px;}
.mk-kop .mk-onder{color:var(--ink-soft);font-size:20px;}
.mk-let{background:var(--card);border:2px solid var(--line);border-radius:18px;
  padding:13px 17px;margin:20px 0;filter:url(#wobble);}
.mk-sect{max-width:620px;margin:38px auto 18px;}
.mk-sect h2{font-family:'Caveat',cursive;font-size:31px;margin-bottom:4px;}
.mk-sect p{margin-bottom:11px;}
.mk-sect ul{margin:0 0 11px 20px;}
.mk-sect li{margin-bottom:6px;}

/* ---- de telefoonschermen ---- */
.mk-rij{display:flex;flex-wrap:wrap;gap:26px;justify-content:center;margin:22px 0 8px;}
.mk-fig{width:320px;max-width:100%;}
.mk-fig figcaption{color:var(--ink-soft);font-size:16px;margin-top:9px;text-align:center;}
.mk-fig figcaption b{color:var(--ink);}
.phone{width:320px;max-width:100%;height:620px;background:var(--paper);
  border:2px solid var(--ink);border-radius:30px;overflow:hidden;
  position:relative;display:flex;flex-direction:column;filter:url(#wobble);}
.screen{flex:1;min-height:0;overflow:hidden;padding:0 18px 14px;}
.statusbar{display:flex;justify-content:flex-end;padding:11px 18px 3px;
  font-size:13px;color:var(--ink-soft);}

/* ---- bouwstenen, dezelfde als in de app ---- */
.sketch{background:var(--card);border-radius:var(--radius);border:2px solid var(--ink);filter:url(#wobble);}
.sketch.soft{border-color:var(--line);}
.card{padding:13px 15px;margin-bottom:13px;}
.title{font-family:'Caveat',cursive;font-size:34px;line-height:1;margin:6px 0 2px;}
.subtitle{color:var(--ink-soft);font-size:16px;margin-bottom:14px;}
.eyebrow{color:var(--ink-soft);font-size:15px;margin:16px 2px 9px;
  display:flex;justify-content:space-between;align-items:center;}
.chips{display:flex;flex-wrap:wrap;gap:7px;}
.chip{background:var(--card);border:2px solid var(--line);border-radius:15px;
  padding:6px 12px;font-size:15px;filter:url(#wobble);}
.chip.sel{background:var(--accent-soft);border-color:var(--accent-soft);color:var(--cream);}
.knop{display:block;width:100%;text-align:center;background:var(--accent-soft);
  color:var(--cream);border:2px solid var(--accent-soft);border-radius:20px;
  padding:11px;font-size:17px;filter:url(#wobble);}
.knop.leeg{background:none;color:var(--ink);border-color:var(--line);}
.zacht{color:var(--ink-soft);font-size:14px;}
.nav{display:flex;justify-content:space-around;border-top:2px solid var(--line);
  padding:9px 0 11px;font-size:13px;color:var(--ink-soft);background:var(--paper);}
.nav .on{color:var(--ink);}
'''

HTML = '''<style>
%s
%s
%s
</style>
%s
<div class="mk-wrap">
%s
</div>
'''


def main():
    if len(sys.argv) < 2:
        sys.exit("gebruik: bouw-mockup.py <body.html> [uit.html]")
    body_pad = sys.argv[1]
    uit = sys.argv[2] if len(sys.argv) > 2 else "/tmp/mockup.html"
    if not os.path.exists(body_pad):
        sys.exit("body niet gevonden: " + body_pad)
    if not os.path.exists(FONTS):
        sys.exit("fonts.css niet gevonden naast dit script: " + FONTS)

    body = open(body_pad, encoding="utf-8").read()
    fonts = open(FONTS, encoding="utf-8").read()
    extra = ""
    # een eigen <style> boven in de body hoort bij de mockup, niet bij de wikkel
    open(uit, "w", encoding="utf-8").write(HTML % (fonts, BASIS, extra, DEFS, body))

    kb = os.path.getsize(uit) / 1024
    print("%s  (%.0f KB)" % (uit, kb))
    print("publiceer dit bestand met de Artifact-tool, op een NIEUWE url")


if __name__ == "__main__":
    main()
