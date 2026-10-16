# Automatiske tests

Testene åbner AtomLab i en browser uden skærm (Chromium via Playwright), trykker på knapperne og tjekker, at det rigtige sker. De bruger testadgangen (`?test` i adressen, se CLAUDE.md), så de kan spole tiden frem i stedet for at vente.

Spillet selv bruger ikke testene. Der er stadig ingen npm og intet byggetrin i projektet.

## Sådan kører du dem
```
node tests/koer-alle.mjs              # alle (ca. 25 minutter)
node tests/koer-alle.mjs pause guide  # kun de nævnte
node tests/guide.mjs pc               # én test (nogle kan nøjes med "pc" eller "tlf")
```
`koer-alle.mjs` starter selv en lille server (`python -m http.server 8765`), hvis der ikke kører en. Kører du en enkelt test, skal serveren køre i forvejen.

Hver test skriver `OK` eller `FEJL` for hvert tjek og til sidst "x OK, y fejl". Konsolfejl i browseren tæller også som fejl. Skærmbilleder havner i `tests/billeder/`, som ikke gemmes i git.

## Det skal du bruge
- **Node.js** (version 18 eller nyere).
- **Playwright med Chromium.** I Claudes udviklingsmiljø er det installeret i forvejen. På din egen computer kan du fx installere det i en mappe uden for projektet (`npm install playwright` og `npx playwright install chromium`) og pege på det med `PLAYWRIGHT=/sti/til/node_modules/playwright/index.mjs`.
- **Python** til den lille server.

Andre adresser end `http://localhost:8765` kan vælges med `ADRESSE=...`.

## Testene
| Test | Hvad den tjekker |
|---|---|
| `henfaldsregler` | Henfaldsreglerne mod ca. 140 kendte kerner, de letteste kerners grænser, at alle kæder ender stabilt, og at de tre naturlige kæder (uran-238, uran-235 og thorium-232) følger den rigtige vej. Kører uden browser. |
| `vaerksted` | Atomværkstedet: menu, byg atomer, stabile og ustabile kerner, tællere, fanerne, og at "Ryd" og straks uran ikke løber tør for plads i grafikken |
| `henfald` | Tritium henfalder, ion lige efter henfaldet, stabilitetskortet og opgaverne |
| `system` | Det periodiske system på pc: væggen, grundstofkortet, filtre og opgaven "byg jern" |
| `system-mobil` | Det periodiske system på telefon, tablet og pc: tryk, træk, knib, søgning og filtre |
| `stjerneovn` | Stjerneovnen: fusion, for koldt, energi, tempoknapperne, opgaver kun ved egne skud, og at "Vis mig" lige efter et eget skud laver en reaktion 120 af 120 gange |
| `stjerneovn-mus` | Stjerneovnen med mus: ramme-procent, slowmotion, pause, kernelisten, grafen og rejsen ind i Solen |
| `reaktor` | Reaktoren: spaltning, uran-238, kædereaktion, nødstop, at "Vis mig" kommer i gang 200 af 200 gange, og at Kosmos' faneknapper ikke ændrer Reaktoren |
| `batteri` | Batteriet: opladning, afladning, elektron-kæden, afbryderen og kortslutning |
| `kosmos` | Alle Kosmos-fænomener kan vælges, alle knapper virker, og alt bliver ryddet væk |
| `beskeder`, `beskeder-2` | Beskedsystemet: undertekster, piller, loggen, etiketten i Stjerneovnen og nødstop |
| `guide` | Kom i gang-guiderne, "Næste skridt" og "Vis mig" i Stjerneovnen og Reaktoren |
| `pause` | Pause i Stjerneovnen, Reaktoren og Kosmos (også stjernernes overflade), og sammenligningerne (kul, mobil, elbil) |
| `fuldskaerm` | Knapperne til fuld skærm på pc og tablet |

## Værktøjer
- `vaerktoejer/skaermbilleder.mjs fusion` tager billeder af en skærm på pc, tablet og telefon (begge veje). Den venter 7 sekunder, så kameraet er færdigt med at zoome (`VENT=3500` for kortere).
- `vaerktoejer/kosmos-billeder.mjs supernova 0 v3 s` vælger et fænomen, trykker på knap 0, venter 3 sekunder og tager et billede.

## Gode råd
- Kør aldrig flere tests på én gang. Så bliver de ustabile.
- Testbrowseren tegner kun 3-6 billeder i sekundet. Spol frem med testadgangen, eller frys tiden, i stedet for at vente. Fejl, der kun sker ved mange billeder i sekundet, kræver spoling i små skridt (fx `atomlabTest.vaerksted.spol`).
- En test af en rettet fejl skal først fejle uden rettelsen.
- Skriv nye erfaringer ind i [docs/erfaringer.md](../docs/erfaringer.md).
