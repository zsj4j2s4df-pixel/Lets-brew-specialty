#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Maakt van STAPPEN.md een werkblad om naast Luma open te hebben.

    python3 docs/video/bouw-werkblad.py

Uitkomst: docs/video/werkblad.html — dezelfde inhoud als STAPPEN.md, in de huisstijl,
met een kopieerknop op elk promptblok en de startbeelden erbij. STAPPEN.md blijft de
bron; dit bestand wordt eruit gegenereerd, zodat er niet twee versies van de waarheid
ontstaan.
"""
import base64, html, io, os, re, sys

HIER = os.path.dirname(os.path.abspath(__file__))
BRON = os.path.join(HIER, 'STAPPEN.md')
UIT = os.path.join(HIER, 'werkblad.html')
FONTS = os.path.join(HIER, '..', '..', '.claude', 'skills', 'nieuwe-feature',
                     'scripts', 'fonts.css')


def beeld(naam):
    pad = os.path.join(HIER, 'keyframes', naam)
    if not os.path.exists(pad):
        return ''
    b64 = base64.b64encode(open(pad, 'rb').read()).decode('ascii')
    return ('<img class="kf" alt="startbeeld %s" src="data:image/png;base64,%s">'
            % (html.escape(naam), b64))


def inline(t):
    """De weinige opmaak die binnen een regel voorkomt."""
    t = html.escape(t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank" rel="noopener">\1</a>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'(?<![\w*])\*([^*]+)\*(?![\w*])', r'<em>\1</em>', t)
    return t


def naar_html(md):
    uit, i, n = [], 0, 0          # n = teller voor de kopieerknoppen
    regels = md.split('\n')
    r = 0
    while r < len(regels):
        lijn = regels[r]

        if lijn.startswith('```'):
            blok = []
            r += 1
            while r < len(regels) and not regels[r].startswith('```'):
                blok.append(regels[r]); r += 1
            r += 1
            n += 1
            uit.append(
                '<div class="prompt"><button class="kopieer" data-doel="p%d">kopieer'
                '</button><pre id="p%d">%s</pre></div>'
                % (n, n, html.escape('\n'.join(blok))))
            continue

        if lijn.startswith('|'):
            rijen = []
            while r < len(regels) and regels[r].startswith('|'):
                rijen.append(regels[r]); r += 1
            cellen = [[c.strip() for c in x.strip('|').split('|')] for x in rijen]
            kop = cellen[0] if len(cellen) > 1 and set(''.join(cellen[1])) <= set('-: ') else None
            lijf = cellen[2:] if kop else cellen
            t = '<div class="tabelbak"><table>'
            if kop and any(kop):
                t += '<thead><tr>' + ''.join('<th>%s</th>' % inline(c) for c in kop) + '</tr></thead>'
            t += '<tbody>' + ''.join(
                '<tr>' + ''.join('<td>%s</td>' % inline(c) for c in rij) + '</tr>'
                for rij in lijf) + '</tbody></table></div>'
            uit.append(t)
            continue

        m = re.match(r'^(#{1,4}) (.*)$', lijn)
        if m:
            niveau = len(m.group(1))
            tekst = m.group(2)
            extra = ''
            k = re.search(r'keyframes/([\w.-]+\.png)', tekst)
            if k:
                extra = beeld(k.group(1))
            uit.append('<h%d>%s</h%d>%s' % (niveau, inline(tekst), niveau, extra))
            r += 1
            continue

        if lijn.startswith('> '):
            blok = []
            while r < len(regels) and regels[r].startswith('>'):
                blok.append(regels[r].lstrip('> ').rstrip()); r += 1
            uit.append('<blockquote>%s</blockquote>' % inline(' '.join(blok)))
            continue

        if re.match(r'^[-*] |^\d+\. ', lijn):
            genummerd = bool(re.match(r'^\d+\. ', lijn))
            items = []
            while r < len(regels) and (re.match(r'^[-*] |^\d+\. ', regels[r]) or
                                       (regels[r].startswith('  ') and items)):
                if re.match(r'^[-*] |^\d+\. ', regels[r]):
                    items.append(re.sub(r'^([-*]|\d+\.) ', '', regels[r]))
                else:
                    items[-1] += ' ' + regels[r].strip()
                r += 1
            tag = 'ol' if genummerd else 'ul'
            uit.append('<%s>%s</%s>' % (tag, ''.join('<li>%s</li>' % inline(x) for x in items), tag))
            continue

        if lijn.strip() == '---':
            uit.append('<hr>'); r += 1; continue

        if lijn.strip() == '':
            r += 1; continue

        blok = []
        while r < len(regels) and regels[r].strip() and not re.match(
                r'^(#|\||```|> |[-*] |\d+\. |---$)', regels[r]):
            blok.append(regels[r]); r += 1
        uit.append('<p>%s</p>' % inline(' '.join(blok)))

    return '\n'.join(uit)


SJABLOON = """<title>Lets Brew — de video, stap voor stap</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
%(fonts)s
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
body{margin:0;padding:0 20px 80px;background:var(--desk);color:var(--ink);
  font-family:'Patrick Hand','Segoe Print',cursive;font-size:19px;line-height:1.55;}
.wrap{max-width:760px;margin:0 auto;}
h1{font-family:'Caveat',cursive;font-weight:700;font-size:clamp(40px,8vw,60px);
  line-height:1;margin:48px 0 10px;text-wrap:balance;}
h2{font-family:'Caveat',cursive;font-weight:700;font-size:34px;line-height:1.05;
  margin:34px 0 6px;border-bottom:2px solid var(--line);padding-bottom:5px;}
h3{font-family:'Caveat',cursive;font-weight:700;font-size:27px;margin:26px 0 4px;}
h4{font-family:'Caveat',cursive;font-weight:700;font-size:23px;margin:20px 0 4px;}
p{margin:0 0 12px;}
a{color:var(--ink);text-decoration-color:var(--line);}
code{font-family:ui-monospace,'SFMono-Regular',Menlo,monospace;font-size:15.5px;
  background:var(--card-2);border-radius:6px;padding:1px 5px;
  overflow-wrap:anywhere;word-break:break-word;}
b{font-weight:400;border-bottom:2px solid var(--line);}
em{font-style:italic;}
ul,ol{margin:0 0 14px;padding-left:24px;}
li{margin-bottom:5px;}
hr{border:none;border-top:2px dashed var(--line);margin:30px 0;}
blockquote{margin:0 0 16px;background:var(--card);border:2px dashed var(--line);
  border-radius:18px;padding:12px 17px;color:var(--ink-soft);}
.tabelbak{overflow-x:auto;margin:0 0 16px;}
table{border-collapse:collapse;width:100%%;font-size:17.5px;}
th{text-align:left;font-family:ui-monospace,Menlo,monospace;font-size:12px;
  letter-spacing:.08em;text-transform:uppercase;color:var(--accent-soft);
  padding:0 10px 5px 0;font-weight:400;}
td{padding:7px 10px 7px 0;border-top:1.5px dashed var(--line);vertical-align:top;}
.prompt{position:relative;margin:0 0 18px;}
pre{background:var(--paper);border:2px solid var(--line);border-radius:18px;
  filter:url(#wobble);padding:46px 17px 15px;margin:0;overflow-x:auto;
  font-family:ui-monospace,'SFMono-Regular',Menlo,monospace;font-size:14.5px;
  line-height:1.6;white-space:pre-wrap;word-break:break-word;}
.kopieer{position:absolute;z-index:1;top:10px;right:12px;background:var(--accent-soft);
  color:var(--cream);border:2px solid var(--ink);border-radius:13px;
  filter:url(#wobble);padding:4px 13px;font-family:'Caveat',cursive;font-weight:700;
  font-size:20px;cursor:pointer;}
.kopieer:focus-visible{outline:3px solid var(--ink);outline-offset:2px;}
.kopieer.ok{background:var(--card);color:var(--ink);}
.kf{display:block;width:150px;max-width:42%%;margin:8px 0 4px;border:2px solid var(--line);
  border-radius:14px;filter:url(#wobble);background:var(--paper);}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
</style>

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="wobble"><feTurbulence type="fractalNoise" baseFrequency="0.018"
    numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n"
    scale="4"/></filter>
</defs></svg>

<div class="wrap">
%(inhoud)s
</div>

<script>
document.querySelectorAll('.kopieer').forEach(k => {
  k.addEventListener('click', async () => {
    const tekst = document.getElementById(k.dataset.doel).textContent;
    try { await navigator.clipboard.writeText(tekst); }
    catch (e) {
      const s = document.createRange();
      s.selectNodeContents(document.getElementById(k.dataset.doel));
      getSelection().removeAllRanges(); getSelection().addRange(s);
    }
    const oud = k.textContent;
    k.textContent = '\\u2713 gekopieerd'; k.classList.add('ok');
    setTimeout(() => { k.textContent = oud; k.classList.remove('ok'); }, 1600);
  });
});
</script>
"""


def main():
    md = io.open(BRON, encoding='utf-8').read()
    pagina = SJABLOON % {
        'fonts': io.open(FONTS, encoding='utf-8').read(),
        'inhoud': naar_html(md),
    }
    io.open(UIT, 'w', encoding='utf-8').write(pagina)
    print('%s  (%.1f MB)' % (UIT, os.path.getsize(UIT) / 1048576))


if __name__ == '__main__':
    main()
