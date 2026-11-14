# Plan: Gåderne i 3D (G4)

*Skrevet 13. november 2026 af Opus efter jeres ønske samme dag. Hører til sporet Småting ([lige-nu/smaating.md](lige-nu/smaating.md)). Den første plan står i [plan-gaader.md](plan-gaader.md) (G1-G3 er lavet), og faktagrundlaget står i [fakta-gaader.md](fakta-gaader.md). Hver delopgave får sit eget go og en ny session.*

## Jeres ønske (13. november 2026)
- "Gåderne skal inspirere og skabe en **sense of wonder** over de fantastiske hemmeligheder, der gemmer sig derude. Så det der med, at det skal holdes let, har nok ikke været min oprindelige intention. Jeg hælder egentlig til fuld 3D med wow-effekt."
- **Ét univers** (Opus' anbefaling, jeres go): Oversigten er et rum, hvor gåderne svæver, og et tryk flyver kameraet ind.
- **Der skal kunne være 10 gåder i alt.**

**Det ændrer den første plan:** "En side uden 3D" og "Billeder og 3D på kortene: ingen i den tynde udgave" ([plan-gaader.md](plan-gaader.md)) gælder ikke længere. Kortenes tekster, de tre trin, "Målt eller gæt?", "Det så du", "Se det selv", ✓ i `atomlabGaader` og testene bliver, som de er. Det er scenen og layoutet, der er nyt.

## Kernesætningen (uændret)
"Efter fem minutter kan brugeren sige: **Videnskaben er ikke færdig. Jeg kan nævne en gåde, ingen har løst, og sige, hvordan forskerne prøver at løse den.**"

3D'en skal tjene den: Hver scene viser det, der er *målt*, tydeligt og det, *ingen ved*, som noget, der mangler, er sløret eller er et spørgsmålstegn. Undren kommer af at se noget stort og ægte og så opdage, at ingen kan forklare det. Pynt, der ikke gør det, kommer ikke med.

## Oversigten: Frontlinjen (ét univers)
- **Scenen:** Et mørkt rum med stjernehimlen (fra `scene3d.js`). Gåderne svæver langs en svag, glødende sti, **fra det mindste til det største** (AtomLabs røde tråd: ind mod det mindste og ud mod det største). Kameraet driver langsomt, og man kan dreje og zoome som i Kosmos.
- **10 pladser:** Hver plads har et lille, levende objekt (se tabellen). En gåde, der ikke er bygget endnu, er en sløret, mørk form med et svagt "?"-lys, der pulserer langsomt. Det gør det tydeligt, at der er mere at opdage. En færdig gåde får en rolig, lysere glorie (✓).
- **Navnene** står som knapper over objekterne (HTML, så de kan trykkes og bruges med tastatur, mindst 44 px). Spørgsmålet står på knappen. "Start her" som i dag.
- **Et tryk** på et objekt eller en knap flyver kameraet ind (ca. 1,5 s, med `ROLIG` en hurtig toning i stedet). Imens tones de andre objekter ned, og kortets panel glider ind. "‹ Alle gåder" flyver ud igen.
- **Et intro-trin første gang** (en linje under scenen, ingen dialog): "Videnskaben er ikke færdig. Tryk på en gåde." Teksten `gaader-intro` flytter herned (træk fra).
- **Ærligt talt** (en linje i oversigtens "Ærligt talt"): Gåderne svæver side om side her, men i virkeligheden er de spredt fra det mindste til det største. Objekterne er tegnet som symboler, ikke i skala.

### De 10 pladser (fra det mindste til det største)
| Plads | Gåde | Status | Objektet i oversigten |
|---|---|---|---|
| 1 | Hvor stopper kvanteverdenen? (fra [drejebog-kvantefysik.md](drejebog-kvantefysik.md)) | Senere | En sitrende sky af prikker med striber som fra en dobbeltspalte |
| 2 | Hvor blev antistoffet af? (`antistof`) | Bygget | Små par, der dukker op og forsvinder i glimt. Ét lys bliver tilbage |
| 3 | Hvordan begyndte livet? (`begyndelsen`) | Bygget | En varm kilde på havbunden med bobler og en lille, snoet streng |
| 4 | Er der liv andre steder? (`liv`) | Bygget | En lille, rød planet og en ismåne med en fontæne |
| 5 | Planet 9 (reserven, nr. 7 sammen med Solsystemets overblik) | Senere | En mørk klode, der næsten ikke kan ses, og nogle aflange baner, der peger samme vej |
| 6 | Hvad er der inde i et sort hul? (`sorthul`) | Bygget | En glødende ring om et sort hul (en billig udgave, se nedenfor) |
| 7 | Hvad er mørkt stof? (`moerktstof`) | Bygget | En spiralgalakse, der drejer, med en svag glorie omkring |
| 8 | Hvad får Universet til at udvide sig hurtigere? (mørk energi, nr. 6 i den første plan) | Senere | Galakser, der glider fra hinanden på et net, der vokser |
| 9-10 | To pladser, der ikke er valgt | Senere | Sløret "?" |

**Pladserne 9-10 og listen over de 10:** Fakta-gaader.md vurderede, at Hubble-spændingen, neutrinoens masse og kvantetyngdekraft er svære som egne kort for en 13-årig. Kandidater til 9-10 er fx "Hvorfor går tiden kun fremad?" (kobler til Tid og rum), neutrinoens masse (milliarder går gennem din hånd hvert sekund), Hubble-spændingen og "Hvad var der før Big Bang?". **Listen skal tjekkes af Fable** (eftersynet sagde: "det er nemt at skrive for sikkert"), før kort 6-10 skrives. Se "Fable" nedenfor. Rækkefølgen langs stien kan ændre sig, når listen er valgt. Koden må ikke afhænge af, at der er præcis 10.

## Et kort i 3D
- **Layout:** Scenen fylder skærmen. Kortet (de tre trin) står i et panel: til højre på pc og tablet på langs (ca. 380 px), og forneden på tablet på højkant og telefon (højst ca. 45 % af højden, kan rulles, klassen `mere`). Kameraet stilles, så objektet står i den frie del af skærmen (`centrerVindue`, som i Kosmos). Intet dækker scenen, man ikke selv har åbnet (Retningen).
- **Hvert trin ændrer scenen.** Når man gætter, viser scenen svaret (fx at kanten af galaksen flyver af). Trin 2 ("Målt eller gæt?") viser altid grænsen for det, man ved: noget sløret, mørkt eller et spørgsmålstegn. Trin 3 viser redskabet, forskerne bruger (en sonde, et teleskop, en detektor).
- **"Målt eller gæt?":** Svaret lander som et stempel ("MÅLT" eller "GÆT") med et lille bump og en lyd fra `lyd.js`. Det er det eneste nye i panelet.
- **"Se det selv"** flyver stadig ind til stedet i programmet. Scenen her må gerne være flottere end en knap, men den erstatter ikke stedet.

### Scenerne for de fem kort, der er bygget (udkast, ret til, når teksten læses igen)
| Kort | Trin 1 "Hvad ved vi?" | Trin 2 "Hvad ved vi ikke?" | Trin 3 "Hvordan finder vi ud af det?" |
|---|---|---|---|
| Sort hul | Lysbøjningen fra `js/kosmos/linse.js` (genbrugt, fylder skærmen, når man er fløjet ind). Ved svaret løber en tyngdebølge ud over et net (2015) | Kameraet glider mod horisonten, stjernerne bøjer, og midten er sort med et svagt "?". **Der tegnes ikke et punkt i midten** (fælde 5) | LISA: tre satellitter i en trekant med laserlinjer, og et nyt sort hul, der "ringer" |
| Antistof | Big Bang-glimtet: par af stof og antistof dukker op og udsletter hinanden med glimt (lyspartikler) | Glimtene tager til, til der kun er ét lys tilbage ud af mange ("én ud af en milliard" er en størrelsesorden, fælde 10, og siges sådan) | En fælde med antiprotoner, der svæver i et magnetfelt (BASE og lastbilen fra marts 2026 i "For nørder") |
| Livets begyndelse | En varm kilde på havbunden med bobler og små hinder, der lukker sig om sig selv | En RNA-streng, der prøver at kopiere sig selv, men kæden mellem det, man har lavet i laboratoriet, og den første celle er sløret | Et laboratorieforsøg med gnister i en kolbe og et rør med ingredienser, der blandes |
| Liv andre steder | Mars, Europa og Enceladus side om side, med fontænen fra Enceladus | Klippen med "leopardpletterne" tæt på. Pletterne toner frem, men "liv?" står åbent | Sonderne på vej: prøverne fra Mars, Europa Clipper og Dragonfly til Titan (årstal fra kilden, aldrig "snart") |
| Mørkt stof | En spiralgalakse, der drejer. Kontakten "Uden mørkt stof" får kanten til at flyve af. Det er det målte (galakserne drejer for hurtigt i kanten) | Glorien af mørkt stof bliver synlig som et svagt skær, men den er gennemsigtig, ikke sort (fælde 3) | En tank dybt under jorden med ét lille glimt (LZ, 2,6 sigma, fælde 4), og Euclids kort over lysbøjningen |

Teksterne i `js/data/gaader.js` ændres ikke for scenernes skyld. Kræver en scene en ny påstand (fx en sætning i "Ærligt talt" om, at objektet er tegnet), så faktatjekkes den.

## Kode (forslag)
- **`js/gaader.js`** beholder kortet og trinene og får en lille brokobling til scenen: `scene.visTrin(id, trin, valgt)`.
- **`js/gaader/univers.js`:** oversigten med de 10 pladser, stien, navneknapperne, flyvningen ind og ud, og hvilke objekter der er tonet ned.
- **`js/gaader/<id>.js`:** én fil pr. gåde med `lavFjern()` (den billige udgave til oversigten), `lavNær()` (scenen, når man er fløjet ind), `trin(n, valgt)` og `opdater(dt, tid)` og `fjern()`. Nær-scenen hentes med `import()` første gang, man flyver ind, så starten ikke vokser.
- **Pladsernes data** (id, plads, farve, objektets navn) i `js/data/gaader.js` sammen med teksterne, så de kan testes i Node. En gåde uden `trin` er "Kommer senere".
- **Genbrug:** `lavLinse` fra `js/kosmos/linse.js` til sort hul (kun nær), `glød`, `prikSky`, `ringPulje` og `ryd` fra `js/kosmos/faelles.js`, fontænen fra `js/solsystem/fontaener.js`, hvis den passer, og stjernehimlen fra `scene3d.js`. Ingen nye biblioteker.
- **Det sorte hul i oversigten** er en billig udgave (en sort skive med en glødende ring og en lille forvrængning på en lille flade), ikke lysbøjningen. Den dyre shader kører kun, når man er fløjet ind, og ellers ingen af de andre nær-scener.

## Ydelse og de tre trin
- **Hentning:** En skærm uden kloder må hente højst ca. 1 MB ekstra (Retningen). Scenerne tegnes med kode (prikker, glød og simple shadere), og de få billeder er små (fx klippen med pletterne, højst 1k). Nær-scenerne hentes, når man flyver ind.
- **Kun én nær-scene ad gangen.** Når man flyver ud, frigives den (`ryd`, `dispose`). Oversigtens 10 fjern-objekter tegnes altid, så de skal være billige (ingen `discard` på store flader, ingen nye `Vector3` i løkkerne).
- **Tablet (`LAV_KVALITET`):** færre prikker, linsen i lavere opløsning (den har sin egen dynamiske opløsning), og ingen glød efter billedet, hvis det hakker. Mål med `?maal` på tabletten, før G4 kaldes færdig.
- **`ROLIG`:** Ingen kameraflyvninger (toning i stedet), langsommere drift, og ingen blinkende glimt i antistof (de toner).
- **Pause:** Alt bevæger sig med `dt` og `tid` fra `verden.opdateringer`. Tidsknappen kommer kun med, hvis prøven viser, at den mangler.

## Delopgaverne (hver med et go og en ny session)
- [ ] **G4a: Universet og layoutet** (Opus, høj). Oversigten i 3D med de 10 pladser (5 bygget og 5 sløret), stien, navneknapperne, flyvningen ind og ud og panelet til højre eller forneden. Kortene virker som i dag, men står i det nye panel. Ingen trin-scener endnu: Man flyver ind til fjern-objektet. Skærmbilleder på pc, tablet på langs og højkant og telefon. Testen `gaader` rettes (oversigten er ikke længere en liste), plus 3-5 nye tjek.
- [ ] **G4b: Sort hul og antistof** (Opus, høj). Nær-scenerne med trinene og stemplet ved "Målt eller gæt?". Sort hul genbruger linsen. Mål på pc med `?maal`.
- [ ] **G4c: Mørkt stof og liv andre steder** (Opus, høj). Galaksen med kontakten "Uden mørkt stof" og planeterne, klippen og sonderne.
- [ ] **G4d: Livets begyndelse og det sidste** (Opus, høj). Den varme kilde og RNA-strengen, måling på tabletten, `ROLIG`, "Ikke afprøvet" og dokumenterne ([kode/](kode/), gemte data og erfaringer).
- [ ] **Prøven med jeres søn:** Kan han sige kernesætningen, og hvilken gåde vil han vise til en ven? Der må gerne bygges videre imens, men nye gåder (6-10) venter på prøven.
- [ ] **Senere, én ad gangen:** gåderne 6-10, når Fable har tjekket listen. Planet 9 kommer sammen med Solsystemets overblik, og "Hvor stopper kvanteverdenen?" sammen med Kvantefysik forløb 1 (køreplanen).

## Fable
- **Ikke til at bygge G4a-G4d:** Det er grafik og kode, og stoffet er tjekket.
- **Før G4a (jeres go 13. november 2026, "Koncept + liste før G4a"):** Fable 5.2 (high) vurderer konceptet (wow-øjeblikket og kernesætningen i hver scene, universet og de slørede pladser) og vælger gåderne 6-10 med fælder. Prompten er [prompt-fable-gaader-3d.md](prompt-fable-gaader-3d.md), og svaret kommer i `docs/fable/E8-gaader-3d.md`. Fable kan kun bruges til og med 16. november 2026. Bagefter skriver Opus noterne, retter denne plan, og I giver go til G4a.

## Prompt til G4a (start en ny session, Opus, høj effort, efter Fables vurdering og jeres go)
> Læs docs/plan-gaader-3d.md og byg G4a. Du hører til sporet Småting og ejer js/gaader.js, js/gaader/ (ny), js/data/gaader.js, Gådernes sektion i index.html, blokken `#gaader` i style.css og tests/gaader.mjs. Rør ikke de andre skærme. Læs først docs/retning.md (afsnittene Skærmen og Ydelse), tjeklisterne D og E, docs/kode/kosmos.md om js/kosmos/faelles.js og docs/erfaringer/kamera-og-layout.md. Vis mig et skærmbillede af oversigten på pc og tablet på højkant, før kortene flyttes ind i det nye panel.
