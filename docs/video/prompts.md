# De Luma-prompts

Vijf shots komen uit Luma; de andere acht zijn opnames van de app zelf en staan in
`opnames/`. De verdeling is niet willekeurig: **Luma kan geen leesbare interface
tekenen.** Vraag je hem een telefoon met de app te animeren, dan wordt elke letter een
krabbel die per frame verandert. Voor een uitlegvideo is dat dodelijk. Dus doet Luma
wat hij goed kan — de barista, handen, stoom, koffie — en komt het scherm uit de app.

## Instellingen die overal gelden

| | |
|---|---|
| beeldverhouding | **9:16** |
| duur | 5 s per generatie |
| loop | uit |
| referentiebeeld | `barista-blad.png` bij élk shot waarin hij voorkomt |
| aantal pogingen | 2–3 per shot, dan de beste kiezen |

## Het stijlblok

Plak dit **boven élke prompt**. Dit is wat de vijf shots aan elkaar bindt; laat je het
bij één shot weg, dan valt die er meteen uit.

```
hand-drawn pen sketch on warm cream paper, dark brown ink only, no fill and no
shading, every contour drawn twice with a slight offset, lines overshoot at the
corners, wobbling uneven contours, flat 2D illustration, calm and unhurried
```

En hieronder, aan het eind van élke prompt:

```
Negative: photograph, 3D render, glossy highlights, gradients, colour, readable text,
letters, numbers, watermark, extra fingers, warped hands.
```

Waarom `readable text` in de negatives staat terwijl de video juist over een app gaat:
alle tekst komt uit de app-opnames. Wat Luma aan letters verzint, is altijd fout.

---

## Shot 1 — het begin · 5 s

Komt vóór alles. Leeg papier, dan een boon, dan de gastheer.

```
[stijlblok]
A hand-drawn coffee bean appears on empty cream paper as if being drawn by an unseen
pen: first the outline, then the crease down the middle. A barista in an apron steps
into frame from the right and looks at it.
Camera: locked off, straight on, no movement.
Only the drawing lines and the barista move; the paper stays completely still.
[negatives]
```

*Eindigt op:* de barista staat stil in beeld → snijdt naar `opnames/02-home.webm`.

---

## Shot 5 — de zak · 5 s

Zit tussen de wereldkaart en het bonenformulier.

```
[stijlblok]
A barista holds up a bag of coffee beans in one hand and photographs the label with a
phone in the other. The bag has no readable text, only a drawn logo shape. He lowers
the phone and nods.
Camera: slow push in from waist height to chest height.
Keep the bag outline steady; only the arms and the phone move.
[negatives]
```

*Eindigt op:* de telefoon zakt → snijdt naar `opnames/06-nieuwe-boon.webm`.

---

## Shot 9 — aan de machine · 5 s

Zit vóór het dial-in-scherm. Dit is het shot waar de video het meest naar een
koffiebar ruikt — geef hem twee pogingen extra.

```
[stijlblok]
A barista turns from the counter to a lever espresso machine, lifts the portafilter,
knocks it level and locks it into the group head. Two loose curls of steam drift up
from the machine.
Camera: slow push in, chest height, no shake.
Keep the machine outline steady; only the hands and the steam move.
[negatives]
```

*Eindigt op:* de portafilter zit vast → snijdt naar `opnames/10-dial-in.webm`.

---

## Shot 12 — omschakelen naar filter · 5 s

Zit tussen de journey en de pour coach. Hier draait de video van espresso naar filter,
dus de handeling moet zichtbaar een *wissel* zijn.

```
[stijlblok]
A barista sets the espresso cup aside, places a V60 dripper on a glass carafe, drops
in a paper filter and rinses it with a gooseneck kettle. Steam rises from the kettle
spout in one thin curl.
Camera: slow pan right to left, following his hands.
Keep the dripper and carafe outlines steady; only the hands, the water and the steam
move.
[negatives]
```

*Eindigt op:* de ketel komt omhoog → snijdt naar `opnames/13-the-pour.webm`.

---

## Shot 14 — de afsluiter · 5 s

Het laatste shot, en het enige waar tekst in beeld komt. Die tekst maakt Luma **niet**:
de knop en de titel leg je er in de montage overheen (zie `montage.md`).

```
[stijlblok]
A barista lifts a finished cup of coffee toward the camera, holds it still, and with
his other hand turns a phone to face the viewer. The phone screen stays blank cream —
no drawing on it.
Camera: locked off, chest height, slight settle at the end.
The final second should be completely still.
[negatives]
```

*De laatste seconde moet stilstaan*, want daar tekent de knop **Open Lets Brew ›**
zichzelf overheen. Vraag Luma expliciet om die rust, anders blijft hij bewegen en
danst je knop mee.

---

## Wat je terugkrijgt en waar je op let

Loop na elke generatie deze vier langs, in deze volgorde — de eerste die faalt maakt de
rest onbelangrijk:

1. **Kleur.** Alleen creme en bruin? Luma sluipt er graag een blauwe of groene zweem
   in. Eén blik is genoeg.
2. **Handen.** Vijf vingers, geen zesde, geen versmolten duim. Dit is waar de meeste
   generaties op sneuvelen.
3. **De lijn.** Zie je de dubbele contour en de doorschietende hoeken nog, of is het
   glad geworden? Glad = opnieuw, met het stijlblok er nadrukkelijker bij.
4. **Het gezicht.** Leg het naast `barista-blad.png`. Andere neus, ander haar, andere
   leeftijd → opnieuw met het referentiebeeld.

Lukt een shot na drie pogingen niet, verander dan de **handeling**, niet het stijlblok.
Een barista die *iets vasthoudt* lukt bijna altijd; een barista die *iets ingewikkelds
doet met twee handen* vaak niet.
