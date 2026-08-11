# De rondleidingsvideo

Een video van ongeveer 1:13 in 9:16 waarin een getekende barista nieuwe gebruikers door
Lets Brew leidt: waar je boon vandaan komt, je bonenplank, het recept, dial in en pour
over — met aan het eind een knop om de app te openen.

## Wat waar staat

| bestand | |
|---|---|
| `barista-schetsen.html` | drie ontwerpen voor de gastheer; kies er één |
| `opnemen.js` | neemt de acht app-shots op uit `index.html` |
| `opnames/*.webm` | die acht shots, 1080×1920 |
| `prompts.md` | de vijf Luma-prompts, met stijlblok en negatives |
| `script.md` | het voice-overscript met tijdcodes, voor ElevenLabs |
| `montage.md` | volgorde, in- en uitpunten, wat er overheen komt |
| `bouw-landing.py` | bakt de gemonteerde video in de landingspagina |
| `landing.html` | die pagina — publiceer hem als artifact |

## De volgorde van werken

1. Kies een barista uit `barista-schetsen.html`. Daar komt een karakterblad van, en dát
   blad gaat als beeldreferentie mee bij élke Luma-prompt — zonder dat ziet hij er in
   elke clip anders uit.
2. Genereer de vijf shots uit `prompts.md` in Luma. Twee tot drie pogingen per shot.
3. Spreek `script.md` in bij ElevenLabs, in één keer.
4. Monteer volgens `montage.md`. Exporteer twee versies: een master op 1080×1920 en een
   kleine op 720×1280 voor de landingspagina.
5. `python3 docs/video/bouw-landing.py pad/naar/klein.mp4` en publiceer `landing.html`.

## De app-shots opnieuw maken

```sh
npm install playwright --no-save
python3 -m http.server 8765     # vanuit de repo-root
node docs/video/opnemen.js
```

De shots staan bovenin `opnemen.js` als tijdlijnen, met de demo-plank eronder. In dat
bestand staat ook waarom het zo omslachtig is opgezet — Playwright's eigen video-opname
geeft in deze omgeving witte frames, dus het loopt via screenshots plus canvas.
