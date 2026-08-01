#!/usr/bin/env python3
"""Bouw een nakijk-versie van de app: de hele app plus de aanwijs-laag.

De gebruiker loopt hierin door de echte app en tikt aan wat er anders moet.
Omdat de laag ín de app zit weet elk punt op welke pagina het staat en op
welk element je wees -- dat levert een opdracht op waar direct mee te werken
valt, in plaats van losse schermafbeeldingen.

Draaien vanuit de repo-root:
    python3 .claude/skills/wijzigingen-aanwijzen/build-review.py
Publiceer daarna het bestand dat hij noemt met de Artifact-tool.
"""
import os
import re
import subprocess
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
PREVIEW_BOUWER = os.path.join(
    os.path.dirname(HIER), "lets-brew-house-style", "scripts", "build-preview.py")
PREVIEW = "/tmp/lets-brew-preview.html"
LAAG = os.path.join(HIER, "annotate.html")
UIT = "/tmp/lets-brew-review.html"


def main():
    if not os.path.exists(PREVIEW_BOUWER):
        sys.exit("preview-bouwer niet gevonden: " + PREVIEW_BOUWER)
    if not os.path.exists("index.html"):
        sys.exit("draai dit vanuit de repo-root (index.html niet gevonden)")

    # 1. de app zelfstandig maken (fonts en tekeningen ingebed)
    r = subprocess.run([sys.executable, PREVIEW_BOUWER], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit("preview bouwen mislukte:\n" + r.stdout + r.stderr)
    app = open(PREVIEW, encoding="utf-8").read()

    # 2. de titel: dit is de nakijkversie, niet de echte app
    app = app.replace("<title>Lets Brew Specialty</title>",
                      "<title>Lets Brew \u2014 nakijken</title>", 1)

    # 3. de splash overslaan: bij nakijken wil je meteen in de app zitten
    app, n = re.subn(r"\},\s*3000\);", "},300);", app, count=1)
    if n != 1:
        print("let op: splash-vertraging niet gevonden, hij blijft 3 s")

    # 4. de aanwijs-laag erachteraan; die wacht zelf op .phone
    laag = open(LAAG, encoding="utf-8").read()
    open(UIT, "w", encoding="utf-8").write(app + "\n" + laag)

    kb = os.path.getsize(UIT) / 1024
    print("%s  (%.1f MB)" % (UIT, kb / 1024))
    print("publiceer dit bestand met de Artifact-tool")


if __name__ == "__main__":
    main()
