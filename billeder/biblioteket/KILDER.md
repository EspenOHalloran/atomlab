# Kilder til billederne i Biblioteket

Billederne bruges af Opdagelserne ([docs/plan-videnskabsfolk.md](../../docs/plan-videnskabsfolk.md)). Hvert billede står her med, hvor det kommer fra, og hvilken licens det har. Reglerne for gamle bogsider og portrætter står i [docs/fakta-bogsider-rettigheder.md](../../docs/fakta-bogsider-rettigheder.md).

`lav_portraet.py` laver portrætterne ud fra kilderne (adresserne står øverst i filen), og `lav_bogsider.py` henter bøgernes sider fra archive.org og gør dem mindre (højst fire sider pr. bog, ca. 150-200 KB hver). Kildebillederne ligger ikke i repoet (mappen `kilder/` er i `.gitignore`).

| Fil | Hvad | Kilde | Licens |
|---|---|---|---|
| `huygens.webp` | Christiaan Huygens som kobberstik (vores filter), 600 × 750 | Caspar Netscher, *Christiaan Huygens, the astronomer*, olie, 1671 (Museum Boerhaave, lån fra Haags Historisch Museum). Wikimedia Commons, `Caspar Netscher - Christiaan Huygens, the astronomer, 1671.jpg`, thumbnail 960 px | Public domain (PD-Art, PD-old-auto-expired, Netscher døde 1684). Et foto af et maleri, hvis beskyttelse er udløbet, har ingen egen ret i Danmark (ophavsretsloven § 70 stk. 4) |
| `huygens-tavle.webp` | Tavlen ved s. 35 i *Systema Saturnium* (13 tegninger af Saturn, nr. I er Galileis), 1000 × 1069 | Christiaan Huygens, *Systema Saturnium*, Haag 1659. Smithsonian Libraries' eksemplar på archive.org, id `CristianiHugeni00HuygA`, skanningens side `n51` (`page/n51_w1200.jpg`). Lavet med `lav_bogsider.py huygens` | Public domain. archive.org-metadata: "The Library considers that this work is no longer under copyright protection" |
| `huygens-s16.webp` | s. 16 (16. januar 1656: Saturn uden arme), 1000 × 1411 | Som ovenfor, skanningens side `n33` | Public domain (som ovenfor) |
| `huygens-s47.webp` | s. 47 (anagrammet og løsningen), 1000 × 1414 | Som ovenfor, skanningens side `n66` | Public domain (som ovenfor) |
| `huygens-s48.webp` | s. 48 ("denne ring, massiv og varig"), 1000 × 1411 | Som ovenfor, skanningens side `n67` | Public domain (som ovenfor) |
