# Plan: Videnskabsfolkene (Opdagelserne i Biblioteket)

*Opus' plan 15. november 2026 efter [prompt-videnskabsfolk.md](prompt-videnskabsfolk.md) og jeres svar 14. november 2026 (står i prompten og i [koereplan.md](koereplan.md), nr. 3 under "Nyt indhold"). Sporet er **Videnskabsfolkene** ([lige-nu/videnskabsfolkene.md](lige-nu/videnskabsfolkene.md)). Drejebogen til den første bog er [drejebog-huygens.md](drejebog-huygens.md), og Fable tjekker den senest 16. november ([prompt-fable-huygens.md](prompt-fable-huygens.md)). Intet er bygget. Et go pr. trin (H1, H2 …).*

## 1. Hvad og hvorfor
**Kernesætningen for hele delen** (fra [fakta-videnskabsfolk.md](fakta-videnskabsfolk.md)): *"Efter fem minutter kan brugeren sige: De gættede ikke bare. De så efter og målte, og jeg kan selv se det samme her i AtomLab."* (Fables forslag i [E12](fable/E12-huygens.md), jeres valg 16. november 2026. Den gamle sagde "ikke ved at gætte", men Huygens kaldte selv ringen en hypotese, og forløbene beder barnet gætte.)

Ti bøger, én pr. person. Hver person har **én** opdagelse og **ét** sted i programmet, hvor man selv kan se den (Retningens punkt 9). Man læser ikke om personen først: Man gør noget i hvert opslag, løser en gåde fra personens egen bog, springer ud i programmet og ser det selv, og til sidst kan nørderne bladre i den rigtige bog fra dengang.

**Jeres ønske (14. november 2026):** flot visuelt med et tegnet portræt af hver, en indpakning i stil med personens egen tid, uddrag af værkerne og nøglesteder vist i de originale bøger. Engagerende for 12-13-årige og indholdsrigt nok til nørderne.

## 2. De ti og rækkefølgen
**Huygens først som prøve**, så de syv andre fra faktagrundlaget (i tidens rækkefølge), så **Galilei** og til sidst **Newton** (jeres svar 14. november 2026).

| Nr. | Person | Opdagelsen | Gør det selv (stedet i AtomLab) | Bogsiden | Tiden (stil) | Portræt (kandidat efter hukommelsen, licens ikke tjekket undtagen Huygens) |
|---|---|---|---|---|---|---|
| 1 | **Christiaan Huygens** | Saturns ring (1656/1659) og Titan (1655) | Saturns ringe fra kanten | *Systema Saturnium* s. 46-48 og tavlen (Smithsonian, frigivet) | Haag, 1650'erne | Caspar Netscher 1671 (**PD, tjekket**) |
| 2 | Tycho Brahe | Den nye stjerne 1572 | Kosmos, hvid dværg og supernova | *De nova stella* (faksimilen fra 1901) | Danmark, 1570'erne | Kobberstik af Jacob de Gheyn 1586 |
| 3 | Ole Rømer | Lyset bruger tid (1676) | Jupiter → Io i skyggen | *Phil. Trans.* 1677 (Royal Society, PDM) | Paris, 1670'erne | Maleri af Jacob Coning (ca. 1700) |
| 4 | H.C. Ørsted | Strøm laver magnetisme (1820) | Strøm og magneter (når den findes, ellers Batteriet) | Den latinske meddelelse 1820 | København, 1820 | Maleri af C.W. Eckersberg (1820'erne) |
| 5 | Marie Curie | Stoffer, der stråler (1898) | Henfaldet (Reaktoren eller Værkstedet) | *Comptes rendus* 1898 | Paris, 1890'erne | Foto fra ca. 1903-1920 (fotografens rettigheder, se afsnit 6) |
| 6 | Albert Einstein | E = mc² og tiden (1905) | Stjerneovnen og Tid | *Annalen der Physik* 1905 (fri fra 2026) | Bern, 1905 | Foto af Ferdinand Schmutzer 1921 |
| 7 | Niels Bohr | Elektronerne i skaller (1913) | Atomværkstedet | Vores tegning og et kort citat (beskyttet til 2032) | København, 1913 | Foto fra 1922 (fotografens rettigheder, se afsnit 6) |
| 8 | Inge Lehmann | Jorden har en indre kerne (1936) | Kortet ved Jordens magnetfelt | Vores tegning og et kort citat (beskyttet til 2063) | København, 1936 | Usikkert. Måske vores egen tegning |
| 9 | Galileo Galilei | Jupiters fire store måner (1610) | Jupiter → Månerne | *Sidereus Nuncius* 1610 med hans egne tegninger | Padova og Venedig, 1610 | Justus Sustermans 1636 |
| 10 | Isaac Newton | Tyngdeloven og banerne (*Principia* 1687) | Solsystemets overblik (banerne) | *Principia* 1687 | Cambridge og London, 1680'erne | Godfrey Kneller 1689 |

**Galilei og Newton har intet faktagrundlag endnu.** Det laves i en senere session (Opus, høj) i en ny fil i `docs/fakta-videnskabsfolk/`. Det skal slås op:
- **Galilei:** De fire store måner fundet 7.-13. januar 1610 og trykt i *Sidereus Nuncius* (Venedig, marts 1610) med hans egne tegninger af Jupiter og "stjernerne" nat for nat. Hvilken skanning der er frigivet (bibliotek og licens, side for side). At han kaldte dem "de mediceiske stjerner". Hans kikkert (forstørrelse, hvad han selv skriver). Myterne: tårnet i Pisa (står allerede i "Myterne" i fakta-videnskabsfolk.md), "Og dog bevæger den sig", og at han opfandt kikkerten. Gør det selv: **Jupiter → Månerne** i Solsystemet findes. En gåde fra bogen kunne være at finde månerne i hans tegninger nat for nat.
- **Newton:** Tyngdeloven og banerne i *Principia* (London 1687), især bog III og "månetesten" (Månen falder mod Jorden lige så meget, som tyngden siger). Keplers love, som han forklarede. Hvilken skanning af førsteudgaven der er frigivet. Myten om æblet (står i "Myterne"). Gør det selv: **Solsystemets overblik** (banerne om Solen), som er bygget (trin 1-3, 15. november 2026), så Newton får sit sted dér.
- **da Vinci** bliver i [idéerne](ideer.md) (jeres svar 14. november 2026).

## 3. Formen: en bog i 2D i fem lag
Hver person er **en bog**, man bladrer i (2D, ikke 3D, jeres svar). Bøgerne står på **en hylde**, der også er en tidslinje (1572 → 1936, Galilei og Newton på deres pladser i tiden). **Alle ti står på hylden** (jeres svar 15. november 2026): De kommende er en grå ryg med navnet og året. Et tryk på en grå bog viser kun én linje ("Tycho Brahes bog om den nye stjerne kommer senere") og ingen tom bog.

**De fem lag (fra hylden og ind):**
1. **Forsiden:** portrættet, navnet, årene, en titel og én linje. Knappen "Åbn bogen".
2. **Fortællingen:** 3-4 opslag fortalt af en fortæller (ingen opdigtede citater). Hvert opslag har et billede og én handling. Det *er* forløbet (Retningen: forløbet kommer først, 3-6 trin, højst fem minutter, gæt i mindst to trin).
3. **Gåden fra bogen:** et lille stykke af personens eget arbejde, man selv løser (Huygens' anagram, Rømers 10 minutter, Tychos stjerne, der ikke flytter sig …). I forløbet en lille udgave (ét trin), og bagefter den hele som en udfordring.
4. **Gør det selv:** en knap, der springer til stedet i programmet (`data-gaa`) med én linje om, hvad man skal se efter.
5. **Bogen selv (for nørderne):** de rigtige sider fra dengang med **glødende nøglesteder**. Et tryk viser originalsproget og vores danske oversættelse linje for linje. Derudover "Hvorfor?", "For nørder" og "Ærligt talt".

**Sådan passer det i Retningens budget:**
- *Under forløbet:* kun opslaget (billedet og fortællerens linje med gættet og handlingen). Intet andet fremme.
- *Efter forløbet* (laboratoriet): Bogen kan åbnes på ethvert kapitel (forsiden, fortællingen igen, gåden, Gør det selv og bogen selv). Ved siden af står den faste side: titel, højst to tal, højst tre sætninger, højst fire "Hvorfor?" og så de lukkede "For nørder" og "Ærligt talt" (de fælles klodser fra `js/lag.js`).
- *Telefon og højkant:* én side ad gangen. Billedet øverst, teksten under. Bladring med swipe og med knapperne "‹" og "›" (mindst 44 px).

**Hver bog har sin drejebog** efter skemaet i [skabelonen](fable/E3-forloeb.md) (kernesætning, trin, valgt fra, ord, prøven, fakta) plus forsiden, gåden, Gør det selv og bogens glødende steder. Huygens' er [drejebog-huygens.md](drejebog-huygens.md).

## 4. Stilen: én fælles ramme, tidens udseende indeni
**Fælles for alle ti (rammen):** bogens størrelse og opslag, bladringen, knapperne, sidetallene, siden med "Hvorfor?", brødteksten (programmets egen skrift, mindst 15 px, så den er let at læse), farven på de glødende steder og portrættets filter. Man skal kunne se, at det er samme bogreol.

**Tidens udseende (pr. bog, et `stil`-objekt i bogens data):** papirets farve og struktur, blækkets farve, en skrift til overskrifter og det store forbogstav, en ramme eller et ornament og tegningernes stil (hentet fra personens egen bog, fx tavlen i *Systema Saturnium*).

**Skrifterne** (kun frie skrifter under **SIL Open Font License (OFL)**, kopieret ind i repoet som `woff2`, så det virker uden net, og kun til overskrifter). Forslag til tre skrifter for alle ti:
| Tiden | Bøgerne | Skrift (OFL) | Hvorfor |
|---|---|---|---|
| 1500- og 1600-tallet | Tycho, Galilei, Huygens, Rømer, Newton | **IM Fell English** (Igino Marini) | Lavet efter Fell-typerne fra Oxford i 1670'erne, altså samtidig med Huygens og Rømer |
| 1800-tallet | Ørsted, Curie | **Bodoni Moda** | Bodonis typer var moderne omkring 1800 |
| 1900-tallet | Einstein, Bohr, Lehmann | **Old Standard TT** | Efter bøger og tidsskrifter fra ca. 1900 |

Hver skrift og hvert nyt domæne (fx `raw.githubusercontent.com` for Google Fonts' arkiv på GitHub) spørges der om, før den tages i brug (en anmodning til miljøet). Licensen (`OFL.txt`) lægges ved siden af filen. Skal filen gøres mindre (kun de tegn, vi bruger), skal værktøjet `fonttools` installeres (spørg først).

## 5. Portrætterne
**Jeres svar:** rigtige portrætter fra deres egen tid (malerier, kobberstik og gamle fotos) med et **ens kobberstik-filter** lavet i Python.
- **Værktøjet:** `billeder/biblioteket/lav_portraet.py` (PIL og numpy, som `billeder/solsystem/lav_*.py`). Linjer, der bliver tykkere, hvor billedet er mørkt, en krydsskravering i skyggerne, korte streger langs kanterne og en oval ramme på papirfarve. Lokal kontrast, så mørke malerier ikke bliver en mørk flade. Pr. person: kilden, udsnittet og tre tal (`gamma`, `baggrund` og `detalje`). Kilden hentes fra Commons og lægges ikke i repoet.
- **Udkastet af Huygens** (15. november 2026) er vist for jer, og I sagde ja til stilen. Det færdige billede (600 × 750, WebP, ca. 180 KB) kommer først med i H1, når I har sagt ja til stilen.
- **Licensen tjekkes pr. portræt** og skrives i `billeder/biblioteket/KILDER.md`: Et foto af et **maleri eller stik** fra før ca. 1900 har ingen egen ret i Danmark (§ 70 stk. 4, se [fakta-bogsider-rettigheder.md](fakta-bogsider-rettigheder.md)). **Gamle fotos er sværere:** Et "fotografisk værk" er beskyttet i 70 år efter fotografens død, og et almindeligt "fotografisk billede" i 50 år efter det blev taget. Curie, Einstein, Bohr og Lehmann skal derfor tjekkes for sig. Kan et foto ikke bruges, laver vi en tegning efter et frit foto eller bruger et maleri.

## 6. Plads i menuen og koden
- **Menuen:** en ny del **Opdagelserne** i verdenen **Biblioteket** (ved siden af Ordbogen og Gåderne, så Biblioteket har tre dele, inden for 2-4). Navnet fra [plan-verdener.md](plan-verdener.md).
- **Skærmlisten** (`js/skaerme.js`): `{ id: 'opdagelser', verden: 'biblioteket', titel: 'Opdagelserne', modul: './opdagelser.js', status: 'prøve' }` efter `gaader`. En sektion `#opdagelser` og et link i `.menukort` i `index.html`. Hentes først, når den åbnes (10a).
- **Filerne (nye):**
  - `js/opdagelser.js`: skærmen (hylden og den åbne bog), `lav`, `start`, `stop` og `testAdgang`.
  - `js/bog.js`: bogen som klods (opslag, bladring, de fem lag, stilen og de glødende steder). Den samme for alle ti.
  - `js/bog/huygens.js`: Huygens' tegninger og handlinger i trin 1-4 (et 2D-lærred i bogens stil). Én fil pr. bog.
  - `js/data/opdagelser.js`: listen over bøgerne (id, navn, år, status, stil, portræt) uden DOM, så menuen og "Din fremgang" kan bruge den, og den kan testes i Node.
  - `js/data/opdagelser/huygens.js`: teksterne (forsiden, gåden, Gør det selv, siderne med de glødende steder i % af siden, latin og dansk) og `js/data/forloeb/huygens.js` (forløbets trin i det fælles format).
  - `billeder/biblioteket/`: `huygens.webp` (portrættet), `huygens-s46.webp`, `-s47.webp`, `-s48.webp` og `huygens-tavle.webp` (siderne), `lav_portraet.py`, `lav_bogsider.py` (henter siderne fra archive.org og gør dem mindre) og `KILDER.md`.
  - `fonts/` (ny mappe): skrifterne med `OFL.txt`.
  - CSS: en blok i `style.css` med `#opdagelser` foran alt og `@media` på én linje (som Gåderne), så `--ændret` kun kører delens test.
- **Genbrug:** trinene vises som i Gåderne med forløbets klasser (`fl-gæt`, `fl-næste`, `fl-vej`, `fl-prikker`) og forløbets data (`js/data/forloeb/`). "Hvorfor?", "For nørder" og "Ærligt talt" fra `js/lag.js`, fagordene fra `js/ordforklaring.js` og fremgangen fra `js/fremgang.js` (et ✓ pr. bog). Hvis Forløb-klodsen (`js/forloeb.js`) kan køre med en 2D-scene i bogen, bruges den direkte. Det afgøres i H1, når koden er læst. Der bygges ikke en ny variant af en klods.
- **Links begge veje:** Gør det selv peger ud, og stederne peger ind: et "Hvordan ved vi det?"-kort ved Saturns ringe (`js/data/hvorfor.js`) og citatet `huygensSaturn` får en knap "Læs Huygens' bog".
- **Ydelse:** en bog højst ca. 1 MB (portræt ca. 180 KB, tre sider og tavlen ca. 150-200 KB hver som WebP, en skrift ca. 50-100 KB). Skærmen uden bøger (hylden) under ca. 300 KB. Billederne hentes først, når bogen åbnes, med `js/hentning.js`.
- **Gemte data:** hvilke bøger man har læst, og om gåden er løst (skrives i `docs/kode/gemte-data.md`).

## 7. Tests (5-10 tjek)
`tests/opdagelser.mjs`, og en del i Node:
1. (Node) Hver bog i `js/data/opdagelser.js` har de felter, bogen skal bruge, og de glødende steder ligger inden for siden.
2. (Node) Anagrammet: de 62 bogstaver passer præcist med sætningen.
3. Skærmen åbner fra menuen og som første skærm (`?test#opdagelser`), uden fejl i konsollen.
4. Forløbet starter første gang og ikke anden gang, og "Spring over" virker.
5. Hvert trins handling kan gøres gennem testadgangen (linsen, nætterne, ringen, ANNULO).
6. Gør det selv åbner Solsystemet ved Saturns ringe.
7. Et glødende sted på s. 47 viser latin og dansk.
8. Telefon og højkant: intet ligger oven i andet (skærmbilleder i de størrelser, hvor det kan gå galt).

## 8. Trinene (et go pr. trin)
*Model: Opus, høj effort. Hvert trin er én session med prompten i [lige-nu/videnskabsfolkene.md](lige-nu/videnskabsfolkene.md).*
- [x] **H0: Plan, drejebog, faktagrundlag og filteret** (15. november 2026, kun dokumenter og værktøjet). Fable tjekker drejebogen senest 16. november.
- [ ] **H1: Delen og forsiden** (mellem). Opus' noter til Fables svar (`docs/fable/E12-huygens-noter.md`) og rettelserne i drejebogen først. Så: `opdagelser` i skærmlisten og menuen, hylden, `js/bog.js` med forsiden og bladringen (tomme opslag), stilen for Huygens med IM Fell English (spørg om domænet), portrættet og `KILDER.md`. Test 1, 3 og 8.
- [ ] **H2: Fortællingen** (mellem til stor). Trin 1-3 i 2D (linsen, nætterne med Titan og ringen, der drejes, med de små tegninger fra tavlen) som forløb. Test 4 og 5.
- [ ] **H3: Gåden og Gør det selv** (mellem). Trin 4 (ANNULO), "Det så du", hele anagrammet som udfordring, knappen til Saturns ringe, "Hvordan ved vi det?"-kortet ved Saturn og knappen ved citatet. Ordene `linse` og `anagram` i Ordbogen. Test 2 og 6.
- [ ] **H4: Bogen selv** (mellem). `lav_bogsider.py`, s. 46-48 og tavlen med de glødende steder, latin og dansk, "Hvorfor?", "For nørder" og "Ærligt talt". Test 7. `/faktatjek` på alle teksterne og `/faerdig`. Så har Huygens status "prøve" og venter på **prøven med jeres søn** ([guide-proeven.md](guide-proeven.md)).
- [ ] **De syv andre** (V1-V7), én bog pr. session: Opus skriver drejebogen, I giver go, og bogen bygges med `js/bog.js` (lille til mellem, når klodsen findes). Fable kan ikke bruges efter 16. november, så Opus tjekker selv faktagrundlaget med `/faktatjek` (høj effort).
- [ ] **Galilei:** faktagrundlaget (en session, Opus høj), så drejebogen og bogen.
- [ ] **Newton:** faktagrundlaget, så drejebogen og bogen ved Solsystemets overblik.

**Hvad der kan ske samtidig:** H1-H4 bygges ved siden af Gåderne 3D (jeres svar 14. november 2026). Sporet ejer de nye filer ovenfor. I fælles filer (`index.html`, `style.css`, `js/skaerme.js`, `js/data/ordbog.js`, `js/data/hvorfor.js`) skrives kun i delens egen blok eller på linjens plads. Rører H3 Saturns filer (mulighed B i drejebogen), skal sporet Solsystemet vide det.

## 9. Spørgsmål til jer
*Stilles i chatten som en dialog med anbefalingen først. Svarene skrives nedenfor.*
1. **Portrættets stil** (udkastet af Huygens): ja, justér eller en anden stil.
2. **Skrifterne:** IM Fell English til overskrifterne i 1600-tallets bøger, hentet fra Google Fonts' arkiv på GitHub (et nyt domæne i H1), og brødteksten i programmets egen skrift.
3. **Hylden:** kun de bøger, der er bygget, eller alle ti med de kommende som grå ryg (besvaret).
4. **Gør det selv** og **kernesætningen** til Huygens: står i [drejebogen](drejebog-huygens.md), afsnit 12, og tages efter Fables tjek.

## Jeres svar (15. november 2026)
1. **Portrættets stil:** Ja, sådan (udkastet af Huygens). Filteret bruges til alle ti, og udsnittet kan justeres i H1.
2. **Skrifterne:** Ja: IM Fell English til overskrifterne i 1600-tallets bøger, hentet fra Google Fonts' arkiv på GitHub (domænet spørges der om i H1), og brødteksten i programmets egen skrift. 1800- og 1900-tallets skrifter spørges der om, når de bøger bygges.
3. **Hylden:** alle ti, de kommende som en grå ryg (ikke Opus' anbefaling, som var kun de byggede). Rettet i afsnit 3.
4. Kernesætningen og Gør det selv til Huygens tages efter Fables tjek (drejebogen, afsnit 12).
