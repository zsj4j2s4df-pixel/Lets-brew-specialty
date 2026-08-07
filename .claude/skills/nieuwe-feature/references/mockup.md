# Een mockup tekenen

Lees dit als je in deel A het artifact gaat bouwen.

## Wat een mockup wél en niet is

Een mockup laat **zien hoe het eruitziet en hoe je erdoorheen loopt**. Hij hoeft
niet te werken. Geen opslag, geen echte berekeningen, geen AI. Verzonnen
voorbeeldgegevens zijn goed, zolang ze geloofwaardig zijn — dus geen "Boon 1" en
"Boon 2" maar echte namen en echte smaaknotities.

Bouw hem uit **losse telefoonschermen naast elkaar**, met onder elk scherm één
regel die zegt wat er gebeurt. Dat leest op een telefoon beter dan één
klikbaar prototype, en de gebruiker kan er zo een punt bij aanwijzen.

## Zo bouw je hem

1. Schrijf alleen de body: de koptekst, je uitleg-secties en de schermen.
2. Draai de bouwer; die zet de huisstijl eromheen:

   ```sh
   python3 .claude/skills/nieuwe-feature/scripts/bouw-mockup.py body.html /tmp/mockup.html
   ```

3. Publiceer `/tmp/mockup.html` met de `Artifact`-tool, op een **nieuwe** URL.
4. Zet de body neer als `docs/opzet-<naam>.html` en commit hem.

## De bouwstenen die de wikkel je geeft

```html
<div class="mk-kop"><h1>…</h1><div class="mk-onder">…</div></div>
<div class="mk-let">een kadertje voor iets waar je op wilt wijzen</div>
<div class="mk-sect"><h2>…</h2><p>…</p></div>

<div class="mk-rij">
  <figure class="mk-fig">
    <div class="phone">
      <div class="statusbar">9:41</div>
      <div class="screen"> … het scherm … </div>
      <div class="nav"><span class="on">home</span><span>brews</span>…</div>
    </div>
    <figcaption><b>stap 1</b> — wat hier gebeurt</figcaption>
  </figure>
  … meer schermen …
</div>
```

Binnen een scherm: `.sketch.soft.card` voor een kaart, `.title` en `.subtitle`
voor de kop, `.eyebrow` voor een tussenkopje, `.chips` met `.chip` (en
`.chip.sel` voor aangetikt), `.knop` voor de grote knop, `.knop.leeg` voor de
zachte variant, `.zacht` voor kleine grijze tekst.

## Waar het misgaat

- **Nooit een lettertype of plaatje van buiten laden.** Een artifact mag niet
  naar buiten praten: de fonts zitten al ingebed in de wikkel, en elk `<img>`
  naar een URL blijft leeg. Teken iets liever als SVG.
- **Gebruik de variabelen, niet de hexcodes.** `var(--card)`, niet `#e7ded0`.
  Iemand die later de kleuren aanpast, moet dat op één plek kunnen doen.
- **Het scherm is 320 × 620 en scrollt niet.** Past je scherm er niet in, dan is
  het scherm te vol — knip het op in twee stappen. Dat is precies de fout die je
  in het ontwerp wilt vangen, niet wegscrollen.
- **Geen `<html>`, `<head>` of `<body>`** in je body-bestand. De artifact-host
  zet die er zelf omheen, en de bouwer rekent daarop.
- **Eigen CSS** zet je in een `<style>` bovenaan je body. Dat werkt gewoon; de
  wikkel plakt zijn eigen stijl ervóór, dus jij wint.

## Testen voor je publiceert

Draai hem in Chromium op 390 × 844 (zo kijkt de gebruiker) en op 1100 breed (zo
kijk jij). Loop na:

1. geen `pageerror` in de console
2. elk telefoonscherm past binnen zijn kader — niets valt onder de navigatiebalk
3. de handgeschreven letters staan er echt (niet teruggevallen op Arial); zo
   niet, dan is `fonts.css` niet meegekomen
4. de potloodrandjes wiebelen — anders mist `svg.defs` in de uitvoer
