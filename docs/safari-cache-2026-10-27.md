# Safari: Response served by service worker has redirections

De fout is op 26 oktober 2026 gereproduceerd op de echte host in WebKit:
`page.goto: Response served by service worker has redirections`.
Cloudflare verwijst `/index.html` met HTTP 307 door naar `/`.
De oude manifest-startlink was `./index.html`. Service worker v96 gebruikte
`cache.addAll`, dat het gevolgde antwoord onder de oorspronkelijke URL bewaarde
met `redirected: true`. Bij een volgende navigatie naar die URL weigert WebKit
dat antwoord. De eerdere tests gebruikten een lokale server zonder deze
Cloudflare-doorverwijzing en misten daardoor het probleem.

## Herstel

- Service worker v97 bouwt gevolgde antwoorden opnieuw op voordat hij ze bewaart
  of teruggeeft. De inhoud, status en headers blijven behouden; de
  doorverwijzingsmetadata verdwijnt. Ook een bestaand gecachet antwoord en een
  antwoord uit een netwerkfallback worden zo behandeld.
- Installatie haalt alle assets met cache reload op en controleert succes en
  same-origin voordat de nieuwe worker geactiveerd wordt.
- Het manifest start nu via `./`; ook de notificatie-openlink gebruikt de root.
  Oude geïnstalleerde apps die nog via `/index.html` starten blijven ondersteund.
- Alleen app-caches worden vernieuwd. IndexedDB en localStorage worden niet gewist.

## Controles

De lokale testserver simuleert nu dezelfde 307 als productie. De nieuwe
browserregressietest faalde vóór de fix met exact dezelfde WebKit-fout. Na de fix
slagen 14 Node-controles en 30 browsercontroles, inclusief openen van het oude
startadres, offline herladen en behoud van een opgeslagen testboon, in Chromium
en WebKit. Een fysieke iPhone blijft een afzonderlijke hardwaretest.

Voor een vastgelopen bestaande installatie: open de root
https://letsbrewspecialty.jesseboontje.workers.dev/ in Safari met internet, laat de
update laden en open de app opnieuw. Wis de websitegegevens niet: daarin staan
de lokale koffiegegevens.
