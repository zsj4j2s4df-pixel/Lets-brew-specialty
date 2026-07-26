#!/usr/bin/env python3
"""Bundle index.html into a self-contained preview for the Artifact tool.

An artifact may not load anything from an external host, so this script:
  1. strips the document shell (the artifact host supplies its own)
  2. removes the Google Fonts <link> and inlines Caveat + Patrick Hand
  3. inlines every PNG as a data: URI

Run from the repo root:
    python3 .claude/skills/lets-brew-house-style/scripts/build-preview.py
Then publish the file it prints with the Artifact tool.
"""
import base64
import os
import re
import sys
import urllib.request

OUT = "/tmp/lets-brew-preview.html"
FONT_CACHE = "/tmp/lets-brew-fonts.css"
FONT_CSS_URL = ("https://fonts.googleapis.com/css2"
                "?family=Caveat:wght@600;700&family=Patrick+Hand&display=swap")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15"

IMAGES = [
    "m-espresso.png", "m-espresso-2.png", "m-espresso-3.png", "m-aeropress.png",
    "m-v60.png", "m-chemex.png", "m-mokkapot.png", "m-senseo.png",
    "splash-1.png", "splash-2.png", "splash-3.png", "splash-4.png",
    "logo.png", "icon-192.png",
]


def fetch(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA})).read()


def build_font_css():
    """Download the latin woff2 subsets once and return @font-face rules."""
    if os.path.exists(FONT_CACHE):
        return open(FONT_CACHE, encoding="utf-8").read()

    css = fetch(FONT_CSS_URL).decode("utf-8")
    faces = {}
    for subset, body in re.findall(r"/\*\s*(\w+)\s*\*/\s*@font-face\s*{([^}]+)}", css):
        if subset != "latin":
            continue
        fam = re.search(r"font-family:\s*'([^']+)'", body).group(1)
        url = re.search(r"url\((https://[^)]+)\)", body).group(1)
        faces[fam] = url  # Caveat is variable: one file covers 600 and 700

    out = []
    for fam, url in faces.items():
        b64 = base64.b64encode(fetch(url)).decode()
        weight = "600 700" if fam == "Caveat" else "400"
        out.append(f"@font-face{{font-family:'{fam}';font-style:normal;"
                   f"font-weight:{weight};font-display:swap;"
                   f"src:url(data:font/woff2;base64,{b64}) format('woff2');}}")
    css_out = "\n".join(out)
    open(FONT_CACHE, "w", encoding="utf-8").write(css_out)
    return css_out


def main():
    if not os.path.exists("index.html"):
        sys.exit("run this from the repo root (index.html not found)")

    src = open("index.html", encoding="utf-8").read()

    # 1. strip the document shell
    src = re.sub(r"^\s*<!DOCTYPE html>\s*", "", src, flags=re.I)
    src = re.sub(r"<html[^>]*>", "", src, count=1).replace("</html>", "")
    for tag in ("<head>", "</head>", "<body>", "</body>"):
        src = src.replace(tag, "")

    # 2. swap the external font link for embedded faces
    src = re.sub(r"<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*", "", src)
    src = src.replace("<style>", "<style>\n" + build_font_css() + "\n", 1)

    # 3. inline the drawings
    inlined = 0
    for name in IMAGES:
        if os.path.exists(name) and name in src:
            data = base64.b64encode(open(name, "rb").read()).decode()
            src = src.replace(name, "data:image/png;base64," + data)
            inlined += 1

    open(OUT, "w", encoding="utf-8").write(src)
    print(f"{OUT}  ({len(src) / 1e6:.1f} MB, {inlined} drawings inlined)")
    print("publish this file with the Artifact tool "
          "(same file path = same URL on republish)")


if __name__ == "__main__":
    main()
