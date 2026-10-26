# Automatiske tests

Testene åbner AtomLab i en browser uden skærm (Chromium via Playwright), trykker på knapperne og tjekker, at det rigtige sker. De bruger testadgangen (`?test` i adressen, se CLAUDE.md), så de kan spole tiden frem i stedet for at vente.

Spillet selv bruger ikke testene. Der er stadig ingen npm og intet byggetrin i projektet.

## Sådan kører du dem
```
node tests/koer-alle.mjs              # alle, to ad gangen (ca. 10 minutter)
node tests/koer-alle.mjs --samtidig=1  # alle, én ad gangen (ca. 15 minutter)
node tests/koer-alle.mjs pause guide  # kun de nævnte
node tests/koer-alle.mjs --ændret     # kun dem, de ændrede filer kan påvirke
node tests/koer-alle.mjs --ændret --vis js/atom.js  # vis kun, hvilke tests en ændring ville køre
node tests/guide.mjs pc               # én test (nogle kan nøjes med "pc" eller "tlf")
```
**Mens man arbejder:** brug `--ændret`. Den sammenligner med GitHub (og tager nye filer med) og følger import-linjerne fra de ændrede filer op til skærmene. Så kører den de tests, der besøger skærmen, og tests med samme navn som et fælles modul (fx `beskeder`). Ændres `index.html`, `style.css`, `main.js`, `scene3d.js` eller testhjælperen, køres alle. **Før push** køres hele samlingen.

**Hurtig tegning:** Testbrowseren tegner uden grafikkort og nåede kun 3-6 billeder i sekundet. Spillet regner højst 0,05 sekund frem pr. billede, så alle animationer kørte i slowmotion. Derfor tegner testene som standard uden glød og i lav opløsning (`TEST_HURTIG` i `js/scene3d.js`, slået til af `tests/hjaelp.mjs`). Det giver 3-8 gange flere billeder i sekundet. Testen `grafik` og billedværktøjerne tegner med fuld grafik (`chromium.launch({ args: ARGS, fuldGrafik: true })` eller `FULD_GRAFIK=1`).
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
| `orbitaler` | Orbitalerne (`js/data/orbitaler.js`): antallet af knuder, middelafstanden, formerne (p langs aksen, d med fire blade), at neutrale atomer følger konfigurationen, og at ioner har de rigtige orbitaler (fx Fe²⁺ mister 4s før 3d). Kører uden browser. |
| `vaerksted` | Atomværkstedet: menu, byg atomer, stabile og ustabile kerner, tællere, fanerne, at "Ryd" og straks uran ikke løber tør for plads i grafikken, ophavsretten i hjælpen og udgaverne af atomet (`?udgaver`) |
| `henfald` | Tritium henfalder, ion lige efter henfaldet, stabilitetskortet og opgaverne |
| `system` | Det periodiske system på pc: væggen, grundstofkortet (også lagene: tre linjer, "Mere" og links), filtre og opgaven "byg jern", og fremgangen og "Næste eventyr" i menuen |
| `system-mobil` | Det periodiske system på telefon, tablet og pc: tryk, træk, knib, søgning og filtre |
| `stjerneovn` | Stjerneovnen: fusion, for koldt, energi, tempoknapperne, opgaver kun ved egne skud, og at "Vis mig" lige efter et eget skud laver en reaktion 120 af 120 gange |
| `stjerneovn-mus` | Stjerneovnen med mus: ramme-procent, slowmotion, pause, kernelisten, grafen og rejsen ind i Solen |
| `reaktor` | Reaktoren: spaltning, uran-238, kædereaktion, nødstop, at "Vis mig" kommer i gang 200 af 200 gange, ikke dør ud, og at reaktoren som regel kører videre bagefter (100 forsøg), og at Kosmos' faneknapper ikke ændrer Reaktoren |
| `batteri` | Batteriet: opladning, afladning, elektron-kæden, afbryderen og kortslutning, guiden første gang, "Næste skridt", "Vis mig" (slowmotion, to ioner, klarer ingen opgaver), gitrene, navnet og "Start forfra" (to tryk) |
| `kosmos` | De 11 Kosmos-fænomener kan vælges (vores eget solsystem er flyttet), 7 kort i menuen, alle knapper virker, og alt bliver ryddet væk. På tablet og telefon på højkant står "Kort fortalt / For nørder" over teksten |
| `kosmos-nye` | Big Bang (64/64 → 112/16 → 25 % helium), Ny stjerne (brun dværg, som Solen, kæmpestjerne), Solens fremtid og den hvide dværg (eksplosion og nikkel → cobalt → jern efter 100 dage) |
| `solsystem` | Solsystemet (M4a og M4b): kortet i menuen lige før Kosmos med 8 fænomener, listen (Solen med Solstorm og Solens fremtid, Jorden med Årstiderne og Formørkelser, Mars og Saturn, hvor Solen og Jorden åbner deres egen visning), at de sete og det sidst valgte flytter med fra Kosmos, linkene fra Kosmos, Hvid dværg og grundstofkortet, hjælpen og pausen, og menuen og listen på pc, tablet og telefon (begge veje) |
| `aarstider` | Årstiderne: formlerne for dagens længde, Solens højde og Jordens afstand mod kendte værdier (København, Sydney, Singapore og Ilulissat), og fænomenet i browseren: trinene, tabellen (også årstiden), at Jorden kører rundt i første trin, og at skyderen følger med, og telefon |
| `formoerkelser` | Formørkelser: skyggens geometri med rigtige afstande (total ved 363.300 km, ring ved 405.500 km, Månen i Jordens skygge), og fænomenet i browseren: trinene, himlen set fra Jorden (koronaen, den røde Måne, Månen ude ved kanten og en delvis måneformørkelse), at Månen kredser den rigtige vej, at kameraet ikke hopper, skyderne, "formørkelsesperiode" og "Uden hældning" i "Prøv selv", og telefon |
| `kategorier` | Kategorierne i Det periodiske system: dataene (medlemmer og eksempler hører til kategorien), at hvert kategorikort vises med atom og forsøg, at væggen bliver smallere, valg i forsøget, at et medlem åbner grundstoffet, søgning og ✕, fagord i kortet, links til Reaktoren og Kosmos, og telefon |
| `ordforklaring` | Ordbogen (hvert ord bruges, kort tekst, ingen dobbelte former) og ordforklaringerne med klik, Esc, mus, tastatur og fingre, ét mærke pr. tekst, aldrig i knapper og overskrifter, og nye tekster bliver markeret |
| `beskeder`, `beskeder-2` | Beskedsystemet: undertekster, piller, loggen, etiketten i Stjerneovnen og nødstop |
| `guide` | Kom i gang-guiderne, "Næste skridt" og "Vis mig" i Stjerneovnen og Reaktoren |
| `lag` | Dybde i lag: panelerne kan skjules (fanerne, "Kun grafik", G og Esc) og huskes, "Kun grafik" på højkant, opgaverne foldet sammen, den korte undertekst med "Hvorfor?", "Hvorfor?"-kortene (lag for lag, Esc, tryk udenfor, nedefra på telefon), foldebokse, der huskes, og at "Næste skridt" er skjult under guiden |
| `pause` | Pause i Stjerneovnen, Reaktoren og Kosmos (også stjernernes overflade), og sammenligningerne (kul, mobil, elbil) |
| `fuldskaerm` | Knapperne til fuld skærm på pc og tablet |
| `jorden` | Jorden og Solen (M4b). Uden browser: Månens plads mod Meeus' eksempel og formørkelserne i 2026, Månens afstand og månefaserne, punktet under Solen (også tidsjævningen) og solopgangen i København. I browseren: at lyset i 3D-billedet passer med formlerne på flere tidspunkter, uret, Månens afstand og størrelse, at Jorden drejer mod øst, pausen, "Månen" frem og tilbage, Solens tekst, linket til Stjerneovnen og "Jorden ved siden af" (109 gange mindre), og uret på telefon |
| `saturn` | Prototypen til Solsystemet: Saturns ringe (grænser, mellemrum og tæthed), at Saturn, Månerne, Enceladus og Titan kan vises i Solsystemet (Saturn står efter Mars), at piletasterne drejer kameraet, at et tryk på en måne besøger den, at systemet skaleres tæt på en måne, flybyens ni stop med undertekst og "Næste", og at himlen er sort (uden tågeskyer) i vores solsystem |
| `mars` | Mars (M2): at højdekortet vender rigtigt (Olympus Mons, Arsia Mons, Elysium Mons og bunden af Hellas på de rigtige steder), at Mars står før Saturn i Solsystemet, at billederne bliver hentet, knapperne og teksterne, at Mars drejer mod øst og kan stoppes, at bjergene kan gøres 10 gange højere og tilbage igen, og at kameraets near, zoom og drejning bliver sat tilbage bagefter |
| `grafik` | Fuld grafik med glød på pc og tablet, en ny skærmstørrelse og ingen fejl i konsollen. Det sorte hul er sort i midten, også med glød, og dets ekstra trin i efterbehandlingen fjernes igen |

## Værktøjer
- `vaerktoejer/skaermbilleder.mjs fusion` tager billeder af en skærm på pc, tablet og telefon (begge veje). Den venter 7 sekunder, så kameraet er færdigt med at zoome (`VENT=3500` for kortere).
- `vaerktoejer/kosmos-billeder.mjs supernova 0 v3 s` vælger et fænomen (i Kosmos eller Solsystemet), trykker på knap 0, venter 3 sekunder og tager et billede.
- `vaerktoejer/fable-billeder.mjs` tager de ca. 50 billeder til Fables eftersyn (`docs/plan-fable.md`): alle skærme på pc, tablet og telefon, fænomenerne i Kosmos og Solsystemet og fem forløb i træk. De gemmes som JPG i `docs/fable/billeder/` med en liste (`LISTE.md`). Tager ca. 7 minutter.
- `vaerktoejer/saturn.mjs` tager billeder af prototypen med Saturn og månerne med fuld grafik (forfra, bagfra, i modlys og hvert stop på flybyen). Siden `vaerktoejer/saturn.html` viser den alene (`?f=mars` viser Mars).
- `vaerktoejer/mars.mjs` tager billeder af Mars med fuld grafik og 8k-kortet: hele kloden, Olympus Mons ved kanten, lav sol og bjergene 10 gange højere.
- `FAENOMEN=mars node tests/vaerktoejer/skaermbilleder.mjs solsystem` tager skærmbilleder af ét fænomen i alle størrelser (`… kosmos` for et fænomen i Kosmos).
- `vaerktoejer/kloder.mjs` tager billeder af Jorden og Månen tæt på i forskelligt lys (dag, glimt i havet, tusmørke, nat, modlys, kanten, fuldmåne og halvmåne). Siden `vaerktoejer/kloder.html` viser dem alene, og man kan selv dreje og zoome.

## Gode råd
- `koer-alle.mjs` kører to tests ad gangen (målt stabilt i to hele kørsler). Kør ikke flere end to, og start ikke to `koer-alle.mjs` på samme tid. Fejler en test, mens to kører, køres den igen alene, og det bliver skrevet med "OBS". Undersøg det, før det kaldes ustabilt.
- Testbrowseren tegner 10-35 billeder i sekundet med hurtig tegning (3-6 med fuld grafik). Spol frem med testadgangen, eller frys tiden, i stedet for at vente. Vent på en tilstand (`waitForFunction`) i stedet for en fast tid. Fejl, der kun sker ved mange billeder i sekundet, kræver spoling i små skridt (fx `atomlabTest.vaerksted.spol`).
- En test af en rettet fejl skal først fejle uden rettelsen.
- Skriv nye erfaringer ind i [docs/erfaringer.md](../docs/erfaringer.md).
