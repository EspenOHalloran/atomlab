# Plan: Gåderne i 3D (G4)

*Skrevet 13. november 2026 af Opus efter jeres ønske samme dag. **Rettet 14. november 2026** efter Fables vurdering ([E8-gaader-3d.md](fable/E8-gaader-3d.md)) og Opus' noter ([E8-gaader-3d-noter.md](fable/E8-gaader-3d-noter.md), læses sammen med denne plan). Hører til sporet Småting ([lige-nu/smaating.md](lige-nu/smaating.md)). Den første plan står i [plan-gaader.md](plan-gaader.md) (G1-G3 er lavet), og faktagrundlaget står i [fakta-gaader.md](fakta-gaader.md). Hver delopgave får sit eget go og en ny session.*

## Jeres ønske (13. november 2026)
- "Gåderne skal inspirere og skabe en **sense of wonder** over de fantastiske hemmeligheder, der gemmer sig derude. Så det der med, at det skal holdes let, har nok ikke været min oprindelige intention. Jeg hælder egentlig til fuld 3D med wow-effekt."
- **Ét univers:** Oversigten er et rum, hvor gåderne svæver, og et tryk flyver kameraet ind.
- **Der skal kunne være 10 gåder i alt.**

**Det ændrer den første plan:** "En side uden 3D" og "Billeder og 3D på kortene: ingen i den tynde udgave" ([plan-gaader.md](plan-gaader.md)) gælder ikke længere. Kortenes tekster, de tre trin, "Målt eller gæt?", "Det så du", "Se det selv", ✓ i `atomlabGaader` og testene bliver. Det er scenen og layoutet, der er nyt.

**Det ændrede Fables vurdering (14. november 2026):** Ét kort bygges helt færdigt og prøves, før resten. Oversigten har én gåde i fokus ad gangen. Ingen slørede pladser. Tre slags streg i stedet for sløring og "?". Én stor scene pr. kort, ikke tre.

## Kernesætningen (uændret)
"Efter fem minutter kan brugeren sige: **Videnskaben er ikke færdig. Jeg kan nævne en gåde, ingen har løst, og sige, hvordan forskerne prøver at løse den.**"

3D'en skal tjene den. Undren kommer af at se noget stort og ægte og så opdage, hvor viden stopper. Pynt, der ikke gør det, kommer ikke med.

## De tre slags streg (gælder alle scener)
- **Fuld farve = målt.**
- **Stiplet hvid streg = ikke målt, men nogen har et bud** (regnet ud eller gættet). Flader (en galakse, en planet) tegnes som hvide prikker eller et omrids uden fyld.
- **Intet = ingen har et bud.** Hullet har en kant: Den stiplede streg løber hen til det og toner ud, så det ikke læses som "der er ingenting".
- Stemplet ved "Målt eller gæt?" har stadig to ord (MÅLT og GÆT). Bliver det "GÆT", skifter tingen i scenen fra farve til stiplet.
- **Første gang** står det i én linje under scenen og altid i "Ærligt talt": "Farve er målt. Hvid stiplet er et bud. Hvor intet er tegnet, ved ingen det."

## Oversigten: Frontlinjen
- **En skinne, ikke et frit rum.** Gåderne står langs en svag, glødende sti **fra det mindste til det største** (AtomLabs røde tråd). Man trækker eller trykker "‹ mindre · større ›" (som i menuen, piletasterne på tastaturet), og kameraet glider til næste gåde. **Gåden i fokus** har sit spørgsmål på én knap, "Flyv ind" (HTML, mindst 44 px). De andre er lys længere ude med korte navne. Ingen fri drejning her, kun inde i en scene. *(Jeres svar 14. november 2026: skinne, ikke Fables ring. Koden laves, så stien kan lukkes til en ring, når der er 8-10 gåder.)*
- **Kun de byggede gåder står på skinnen**, sorteret efter størrelse. En ny gåde rykker ind på sin plads. I begge ender står svage lys uden navn og linjen "Flere gåder er på vej". Koden bruger ingen pladsnumre.
- **Objekterne** er enkle lys med en form, man kan kende, ikke små animationer. Livets begyndelse er ikke havbunden, og mørkt stof er ikke en glorie. En færdig gåde (✓) har en rolig ring.
- **Første gang** flyver man ikke ind fra oversigten. Man står foran det første kort, stort, med én linje ("Videnskaben er ikke færdig. Det her er en af gåderne.") og én knap. Når man flyver ud igen, trækker kameraet sig tilbage, og lysene langs stien tændes ét efter ét: "Der er flere." Teksten `gaader-intro` flytter herned (træk fra).
- **Flyvningen** tager ca. 1,5 s (med `ROLIG` en hurtig toning), og et tryk springer den over. Tilbage-knappen og Esc går fra kort til sti. "Næste gåde ›" fører videre. Efter "Se det selv" lander man ved samme gåde.
- **Ærligt talt:** Gåderne står side om side her, men i virkeligheden er de spredt fra det mindste til det største. Objekterne er symboler, ikke i skala.

### Gåderne (fra det mindste til det største)
| Gåde | Status | Lyset på skinnen |
|---|---|---|
| Hvor stopper kvanteverdenen? | Senere, med Kvantefysik forløb 1 | Prikker, der danner striber |
| Hvor blev antistoffet af? (`antistof`) | Bygget | Et par, der bliver til et glimt |
| Gåde 6: Hvor stopper det periodiske system? (119 som krog, jeres svar) | Senere, efter prøven | En lille kerne af kugler |
| Hvordan begyndte livet? (`begyndelsen`) | Bygget | En kolbe med et lyn |
| Er der liv andre steder? (`liv`) | Bygget | Et blåt lys blandt mange hvide |
| Er der en planet mere i Solsystemet? (Planet 9) | Senere, med Solsystemets overblik | En stiplet klode og aflange baner |
| Hvad er der inde i et sort hul? (`sorthul`) | Bygget | En sort skive med en glødende ring |
| Hvad er mørkt stof? (`moerktstof`) | Bygget | En spiralgalakse (uden glorie) |
| Hvorfor udvider Universet sig hurtigere og hurtigere? (mørk energi) | Senere | Galakser, der glider fra hinanden |
| Hvad var der før Big Bang? | Senere | En glødende væg, der bliver stiplet |

**Ikke egne kort** (Fable, enig): Hubble-spændingen, neutrinoens masse (bruges i antistof trin 3: "milliarder gennem din tommelfinger hvert sekund") og tidens pil (et "Hvorfor?"-kort i Tid og rum). Reserve: Solens atmosfære, der er varmere end overfladen. Fakta og fælder for 6-10 står i Fables afsnit 4 og i [fakta-faelder.md](erfaringer/fakta-faelder.md), og tallene slås op igen, når kortet skrives.

## Et kort i 3D
- **Layout:** Scenen fylder skærmen. Kortet står i et panel: til højre på pc og tablet på langs (ca. 380 px) og forneden på tablet på højkant og telefon (højst ca. 45 % af højden, klassen `mere`). **Mens man gætter, viser panelet på højkant kun spørgsmålet og valgene.** Kameraet stilles, så scenen står i den frie del (`centrerVindue`, som i Kosmos).
- **Én stor scene pr. kort.** Trin 1: scenen med én ting til hånden (wow). Trin 2: samme scene, hvor kanten bliver synlig med de tre slags streg. Trin 3: et lille billede af redskabet med årstal.
- **Stemplet** ("MÅLT" eller "GÆT") lander med et lille bump og en lyd fra `lyd.js`. Alt virker uden lyd.
- **Slutningen:** Det sidste billede er redskabet med linjen "Sig det til en ven: …" (én sætning pr. kort, faktatjekkes). `slut` bliver stående.
- **"Se det selv"** flyver stadig ind til stedet i programmet. Scenen erstatter ikke stedet.
- **Data:** felterne `nyt` (tekst og dato) og `løst` (dato), så "Nyt siden sidst" og "Løst!" kan vises.

### Scenerne (rettet efter kortenes tekster)
| Kort | Trin 1: én ting til hånden | Trin 2: kanten | Trin 3: redskabet | Pas på |
|---|---|---|---|---|
| Antistof | **"Du kan kun lave par."** Han trykker i mørket, og lys bliver til to partikler, altid én af hver. Trukket sammen bliver de til lys igen. "Prøv at lave kun stof." Så den store udslettelse: alt bliver lys, ét korn er tilbage, og kameraet trækker ud til stjernerne: "Alt, du kan se, er resten." | To søjler: "målt forskel" i farve (lille) og "det, der skal til" stiplet (går ud over skærmen) | Neutrinoer skudt ca. 1.300 km gennem jorden til DUNE, og Hyper-Kamiokandes tank (2028 og begyndelsen af 2030'erne, fra kortet) | Antistof tegnes som stof, ikke mørkt eller farligt. Udslettelsen fylder hele skærmen. Ca. tusind par, "i virkeligheden ca. én ud af en milliard" (fælde 10). "Ærligt talt": Lys bliver kun til et par med energi nok og tæt på en kerne |
| Sort hul | Lysbøjningen fra `linse.js` (findes i Kosmos), og ved svaret **tonen** fra 2015: 35-250 Hz (arXiv:1602.03837), flyttet op, så en tablet kan spille den, og vist som en kurve, der stiger | Horisonten (hvor målingen stopper): skærmen tones sort, ingen flyvning gennem horisonten. Derinde kun stiplet tekst: "højst ca. 67 sekunder til midten (i Mælkevejens sorte hul)" og "uendelig: her virker teorien ikke". **Intet punkt i midten** | LISA: tre satellitter i en trekant (2035, fra kortet) | Kosmos har allerede astronauten, der bliver langsommere og rødere. Gentag den ikke. Ikke "alt er sort derinde", men "herinde kan ingen måle, så vi tegner ikke noget". Intet net med en spids |
| Mørkt stof | Kontakten "Uden mørkt stof": galaksen flyver fra hinanden. Så en usynlig klump, han trækker rundt foran små galakser, der bøjes i buer: "Du kan ikke se det. Du kan se, hvad det gør." | LZ dybt nede: mørke, ventetid, ét glimt (2026) og "ikke nok" | Euclids kort, stiplet ud fra buerne (2027, fra kortet) | Det mørke stof tegnes ikke som et skær |
| Liv andre steder | **6.000 lys tændes** om ham, ét for hver kendt planet om en anden stjerne. Ét er blåt: Jorden, det eneste sted, vi ved, der er liv | Stenen Cheyava Falls som foto i farve og to stiplede forklaringer, lige store: "kemi uden liv" og "liv". Ingen etiket "liv?" | Tianwen-3, Europa Clipper og Dragonfly (årstal fra kortet) | Mars og Enceladus i samme skala (ca. 6.800 og 500 km, slås op). Om de 6.000 står på deres rigtige pladser, afgøres i G4d (noterne, punkt 9) |
| Livets begyndelse | **Lyn i en flaske:** "Lyn" i Millers kolbe, vandet farves, og zoomet viser aminosyrer. Så sker der ikke mere: "Byggesten er ikke liv." | Byggesten til venstre og en celle til højre i farve. Imellem kun en stiplet RNA-streng | QT45: "Kopiér" bygger en kopi langsomt med røde fejl og en hjælpende hånd (2026) | **Havbunden er ikke kortets billede** (ingen ved, om det var dér eller på land) |

Teksterne i `js/data/gaader.js` ændres ikke for scenernes skyld. Nye påstande i en scene (fx "Ærligt talt" om tonen eller antallet af par) faktatjekkes.

## Kode (forslag)
- **`js/gaader.js`** beholder kortet og trinene og får en lille brokobling til scenen: `scene.visTrin(id, trin, valgt)`.
- **`js/gaader/skinne.js`:** oversigten med de byggede gåder, stien (en kurve, der kan lukkes), "‹ mindre · større ›", knappen "Flyv ind", flyvningen ind og ud og første gang.
- **`js/gaader/streg.js`:** de tre slags streg (farve, stiplet og toning ud ved kanten) som fælles funktioner. Bruger `Line2` og `LineMaterial`, der kopieres fra `three@0.186.1` (`examples/jsm/lines/`) til `lib/three/addons/lines/` sammen med de filer, de importerer.
- **`js/gaader/<id>.js`:** én fil pr. gåde med `lavFjern()` (lyset på skinnen), `lavNær()` (scenen), `trin(n, valgt)`, `opdater(dt, tid)` og `fjern()`. Scenen hentes med `import()` første gang, så starten ikke vokser.
- **Data** (id, størrelsesorden til sorteringen, farve, `nyt`, `løst` og "Sig det til en ven") i `js/data/gaader.js`, så det kan testes i Node.
- **Genbrug:** `lavLinse` fra `js/kosmos/linse.js` (kun i Sort hul), `glød`, `prikSky`, `ringPulje` og `ryd` fra `js/kosmos/faelles.js` og stjernehimlen fra `scene3d.js`. Ingen nye biblioteker.

## Ydelse
- **Hentning:** højst ca. 1 MB ekstra (Retningen). Scenerne tegnes med kode, og de få billeder er små (fx stenen, højst 1k).
- **Kun én scene ad gangen.** Når man flyver ud, frigives den (`ryd`, `dispose`). Lysene på skinnen er billige (ingen `discard` på store flader, ingen nye `Vector3` i løkkerne).
- **Tablet (`LAV_KVALITET`):** færre prikker og linsen i lavere opløsning (den har sin egen dynamiske opløsning). Mål med `?maal` på tabletten.
- **`ROLIG`:** ingen kameraflyvninger (toning), og ingen blinkende glimt i antistof (de toner).
- **Pause:** Alt bevæger sig med `dt` og `tid` fra `verden.opdateringer`.

## Delopgaverne (hver med et go og en ny session)
- [ ] **G4a: Layoutet og det første kort helt færdigt** (Opus, høj). Panelet (til højre eller forneden, kun spørgsmål og valg på højkant, mens man gætter), `streg.js` med `Line2`, stemplet med lyd, hele scenen for **Antistof** (jeres svar) med alle tre trin, "Sig det til en ven" og felterne `nyt` og `løst`. Oversigten er midlertidigt den gamle liste, og de fire andre kort står i det nye panel med deres lys som scene. Skærmbilleder på pc og tablet på højkant. Testen `gaader` plus 3-5 nye tjek. Mål på pc med `?maal`.
- [ ] **G4b: Skinnen og første gang** (Opus, høj). Oversigten som skinne med én gåde i fokus, "Flyv ind" og ud, første gang foran det første kort, lysene, der tændes ("Der er flere"), "Næste gåde ›", Tilbage og Esc, "Se det selv" lander ved samme gåde og `ROLIG`. Mål på tabletten.
- [ ] **Prøven med jeres søn** (efter G4b): Kan han sige kernesætningen om det første kort, og vil han flyve ind i de andre? Scenerne til resten venter på prøven (jeres svar).
- [ ] **G4c: Sort hul** (Opus, høj). Sort hul bygger på linsen og lægger kun det nye til (tonen, de to kanter og LISA). Mål på pc og tablet.
- [ ] **G4d: Mørkt stof og liv andre steder** (Opus, høj).
- [ ] **G4e: Livets begyndelse og det sidste** (Opus, høj). Måling på tabletten, "Ikke afprøvet" og dokumenterne ([kode/](kode/), gemte data og erfaringer).
- [ ] **Senere, én ad gangen, efter prøven:** gåde 6 (det periodiske system), mørk energi og "før Big Bang". Planet 9 kommer med Solsystemets overblik, og kvanteverdenen med Kvantefysik forløb 1 (køreplanen). Tallene slås op igen, og hvert kort får `/faktatjek`.

## Fable
- **Lavet 13. november 2026:** [E8-gaader-3d.md](fable/E8-gaader-3d.md) (konceptet og gåderne 6-10). Opus' noter: [E8-gaader-3d-noter.md](fable/E8-gaader-3d-noter.md).
- **Ikke til at bygge G4a-G4e:** Det er grafik og kode, og stoffet er tjekket.

## Spørgsmål til jer (14. november 2026, før G4a)
1. Hvilket kort bygges helt færdigt først? Anbefalet: Antistof. Fable: Sort hul.
2. Oversigten: skinne fra det mindste til det største (anbefalet) eller Fables ring?
3. Venter scenerne til de andre kort på prøven efter G4b? Anbefalet: ja.
4. Gåde 6: "Hvor stopper det periodiske system?" med 119 som krog (anbefalet) eller "Findes der et grundstof nr. 119?"?

**Jeres svar (14. november 2026): alle fire anbefalinger.** Antistof først, en skinne, scenerne til de andre kort venter på prøven efter G4b, og gåde 6 hedder "Hvor stopper det periodiske system?".

## Prompt til G4a (start en ny session, Opus, høj effort, efter jeres go)
> Læs docs/plan-gaader-3d.md (hele) og docs/fable/E8-gaader-3d-noter.md (afsnit 3), og byg G4a (Antistof). Du hører til sporet Småting og ejer js/gaader.js, js/gaader/ (ny), js/data/gaader.js, lib/three/addons/lines/ (ny), Gådernes sektion i index.html, blokken `#gaader` i style.css og tests/gaader.mjs. Rør ikke de andre skærme. Læs først docs/retning.md (afsnittene Skærmen og Ydelse), tjeklisterne D og E, docs/kode/kosmos.md om js/kosmos/faelles.js og docs/erfaringer/kamera-og-layout.md. Vis mig et skærmbillede af det første kort på pc og tablet på højkant, efter trin 1 virker og før trin 2 og 3 bygges.
