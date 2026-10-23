# Plan: Dybde i lag (UI-planen efter F1)

*Skrevet 23. oktober 2026 ud fra F1 (punkt 1, 2, 3 og 10), jeres princip om dybde i lag og jeres 14 tabletbilleder. I læser den, før der bygges. Spørgsmålene står til sidst.*

## Målet
Man skal kunne se 3D-billedet og forstå, hvad der sker, uden at læse en eneste boks. Den nysgerrige skal kunne komme dybere med ét tryk, og et tryk mere. Ingen tekst står to steder på samme tid.

I dag er det modsat. På tabletbilledet af Stjerneovnen (02) er der ca. ni tekstfelter fremme, og forklaringen af "Proton + Deuterium → Helium-3" står både i underteksten og i panelet. I Reaktoren (03) siger guidens boble og den øverste boks i panelet næsten det samme, mens "Næste skridt" også er fremme.

## De tre lag
| Lag | Hvad | Hvordan |
|---|---|---|
| **1. Altid fremme** | 3D, knapperne, nøgletallene, én kort linje om det, der sker nu (underteksten), og "Næste skridt" | Fylder så lidt som muligt |
| **2. Ét tryk: "Hvorfor?"** | Forklaringen, 3-5 sætninger | Bokse, der er foldet sammen til én linje, og "Hvorfor?"-kort |
| **3. Et tryk mere: "For nørder"** | Tal, formler, "Ærligt talt" og citater | Nederst i boksen eller kortet, eller i fanen "For nørder" |

**Fem regler:**
1. **En tekst står kun ét sted ad gangen.** Underteksten siger, hvad der skete, med højst ca. 90 tegn (fx "Proton + deuterium → helium-3 · +5,49 MeV"). Panelet forklarer hvorfor.
2. **Mens guiden er fremme, er "Næste skridt" skjult**, og panelet gentager ikke guidens tekst.
3. **Boksene i panelet er foldet sammen** til en overskrift og én linje. Kun den boks, der handler om det, der lige er sket, folder sig selv ud. De andre folder sig sammen igen.
4. **Tips til knapperne** (fx "Klik på en kerne og så på en anden …") står i guiden og hjælpen, ikke fast i panelet.
5. **Hjælpen (?) er opslagsbogen.** Det, man spørger om undervejs, skal kunne nås der, hvor man er, og ikke kun i hjælpen.

## Byggeklodserne (én gang, og brugt i alle dele)
Ny fil `js/lag.js`, så alle dele opfører sig ens (F1 punkt 10).

**a) Foldeboksen** `lagBoks`: en `<details class="lag-boks">` med overskrift og én linje, der altid står der. Et tryk folder resten ud. Nederst i boksen kan der være "For nørder ▸", som folder sig ud for sig selv. Delen kan selv folde en boks ud (`lagBoks.vis(id)`), fx "Seneste reaktion". Om en boks er åben, huskes for hver skærm (`atomlabLag`), men første gang er de foldet sammen.

**b) "Hvorfor?"-kortet** `visHvorfor(id)`: et kort, der åbner lige ved knappen, ligesom ordforklaringerne, men større (højst 360 px bredt). På telefon på højkant kommer det op nedefra (et "ark") og dækker kun den nederste del af skærmen.
- Teksterne står i `js/data/hvorfor.js`: `{ id, spørgsmål, svar, dybere, nørd, se }`. Svaret er 3-5 sætninger. `dybere` er id'et på det næste kort ("Og hvorfor det?"), og `se` er links til andre dele.
- "Og hvorfor det?" skifter kortet ud med det næste, og "‹ Tilbage" går et kort tilbage.
- Knapper i teksten: `<button class="hvorfor" data-hvorfor="farligt">Er det farligt?</button>`. Som med fagordene bliver de fundet af sig selv, også i nye tekster.
- Esc, et tryk udenfor og skærmskift lukker kortet. Pausen slår ikke til af sig selv.

**c) "Næste skridt"** `lavNæsteSkridt({ vindue, skridt, visMig, ekstra })`: kortet øverst til venstre i 3D-billedet med "Vis mig" og fold sammen (–/+). I dag findes det i to kopier (`fusion.js` og `reaktor.js`). Det samme kort bruges også i Batteriet og Værkstedet. Kortet skjules af sig selv, mens guiden kører (guide.js sætter klassen `guide-kører` på skærmen).

**d) Panelerne** `js/paneler.js` (planen fra "Idéer til senere", som I har sagt ja til):
- Hvert sidepanel kan foldes væk med en lille fane på kanten (‹ og ›). 3D-billedet glider ud og fylder pladsen (`centrerVindue`).
- Knappen "Kun grafik" i toplinjen (ved siden af fuld skærm) og tasten G folder begge paneler væk. Esc eller knappen igen henter dem tilbage.
- Tilbage bliver underteksten, pause-mærket, "Næste skridt" (lille) og det, der står i 3D-billedet (Årstidernes tabel, Formørkelsernes himmel og Reaktorens graf).
- Valget huskes for hver skærm (`atomlabPaneler`), men første gang er panelerne fremme.
- På tablet og telefon på højkant står panelerne under 3D-billedet. Der viser "Kun grafik" 3D-billedet på hele skærmen, og fanerne på kanten bruges ikke.
- Gælder Værkstedet, Stjerneovnen, Reaktoren, Batteriet og Kosmos. Det periodiske system har sit eget layout og kommer ikke med i første omgang.

## Skitse: Stjerneovnen på tablet på langs
```
I dag                                    Efter
┌────────┬──────────────────┬────────┐   ┌────────┬──────────────────┬────────┐
│Temp.   │[Næste skridt]    │Energi  │   │Temp.   │[Næste skridt]    │8,4 MeV │
│Graf+txt│                  │Opskrift│   │Tempo   │                  │Opskrift│
│Ærligt  │       3D         │Seneste │  ‹│Knapper │       3D         │▸Seneste│›
│Tempo   │                  │Trin 1-5│   │Kerner  │                  │▸Hvorfor│
│Knapper │                  │Energi? │   │▸Hvorfor│                  │ varmt? │
│Klik-tip│[Undertekst: samme│Solen   │   │ varmt? │[Proton + D → ³He │▸Trin   │
│Kerner  │ tekst som Seneste│Citat   │   │▸Opgaver│ · +5,49 MeV]     │▸Nørder │
│Opgaver │ i 3 linjer]      │        │   │  3/7 ★ │                  │        │
└────────┴──────────────────┴────────┘   └────────┴──────────────────┴────────┘
ca. 9 tekster på én gang                  2 korte tekster, resten ét tryk væk
```
`▸` er en boks, der er foldet sammen. ‹ og › på kanterne folder panelerne væk.

## Hver skærm
| Skærm | Lag 1 (altid fremme) | Lag 2 (ét tryk) | Lag 3 (For nørder) | Det, der står to steder i dag |
|---|---|---|---|---|
| **Værkstedet** | Byg-knapperne, grundstoffet, statuslinjen, opgavepillen | Fanerne Atom, Kerne og Fakta. "Hvorfor?" og "Er det farligt?" bliver kort i stedet for at åbne hjælpen | Nørd-fanen | Hold-tip og tastatur-tip står fast i panelet. De flyttes til hjælpen og en kort guide |
| **Det periodiske system** | Væggen, søgningen, filtrene | Grundstofkortet: "I din hverdag", "I din krop" og "I universet" (punkt 7) | "Mere": eksempler, "Vidste du?", links og elektronkonfigurationen | Intet stort |
| **Stjerneovnen** | Temperatur, tempo, knapper, kernelisten, energien, opskriften, "Næste skridt" | Seneste reaktion, "Hvorfor så varmt?" (grafen), "Fra brint til carbon", "Hvor kommer energien fra?", Opgaver | Tunneleffekten, "Hvorfor 1,44 MeV?", Solen i tal, citatet | Reaktionen står både i underteksten og i panelet (`fusion.js:1059` og `:1062`). Klik-tippet |
| **Reaktoren** | Valgene, knapperne, effektmåleren, "Næste skridt" | Hvad der lige skete (med regnskabet), "Hvorfor spalter den?", "Hvor meget er 200 MeV?", "Er det farligt?", "Kan den eksplodere?" | En rigtig reaktor, det blå lys, citatet | Guidens boble og panelets øverste boks (`reaktor.js:541` og `:631`). Den øverste boks bliver kun en linje ("Uran-235: 92 protoner og 143 neutroner") |
| **Batteriet** | Oplad/Aflad/Pause, hastighed, V, A og %, varmen, "Næste skridt" (nyt) | Hvad der sker nu, "Hvorfor flytter både ioner og elektroner?", "Hvor meget energi?", "Hvorfor bliver det varmt?" | Spændingskurven, CC/CV, LiPo og Li-ion, citatet | Farvelisten fylder i panelet. Den bliver en lille forklaring i 3D-billedet |
| **Kosmos** | Listen, "Prøv selv", nøgletallene, underteksten | "Kort fortalt": første afsnit fremme, resten under "Mere". "Hvorfor?"-kort, fx "Hvorfor er Jorden en magnet?" i Solstorm | "For nørder" (findes) | Fanen "For nørder" ligger nederst på højkant (punkt 1, rettes for sig) |

## "Hvorfor?"-kortene (punkt 3)
Teksterne skrives og faktatjekkes (`/faktatjek`), mens I læser planen. Faktagrundlaget står i `docs/fakta-hvorfor.md`. Første 12 kort:

| Kort | Hvor | "Og hvorfor det?" |
|---|---|---|
| Er det farligt? (radioaktivitet) | Kerne-fanen efter et henfald, Reaktoren | Hvad gør strålingen ved cellerne og DNA? → Hvor meget skal der til? |
| Hvorfor holder kernen sammen? | Kerne-fanen | Hvorfor er nogle kerner ustabile? |
| Hvorfor har atomet skaller? | Atom-fanen | Er elektronerne virkelig små kugler? |
| Hvorfor skal det være så varmt? | Stjerneovnen | Tunneleffekten |
| Hvor kommer energien fra? (E = mc²) | Stjerneovnen og Reaktoren | Hvorfor vejer heliumkernen mindre? |
| Hvorfor spalter uran-235, men ikke uran-238? | Reaktoren | |
| Kan en reaktor eksplodere som en bombe? | Reaktoren | |
| Hvad er et magnetfelt? | Solstorm, Pulsar og Kvasar | Hvorfor er Jorden en magnet? → Hvorfor er nogle ting magnetiske? |
| Hvorfor går strømmen gennem ledningen? | Batteriet | |
| Hvorfor bliver batteriet varmt? | Batteriet | |
| Hvorfor er et sort hul sort? | Sort hul | |
| Hvorfor lyser stjernerne? | Kosmos (Ny stjerne) og Stjerneovnen | |

Svarene skal være korte og ærlige. Ved magnetisme fx: Elektronerne opfører sig selv som bittesmå magneter, og i jern peger mange af dem samme vej. Hvorfor elektronen er en magnet, kan man ikke forklare uden kvantemekanik, og det skal stå ærligt.

## Rækkefølgen, når I har sagt god for planen
1. **Byggeklodserne** (`js/lag.js` og `js/paneler.js`) og en ny test (`tests/lag.mjs`).
2. **Stjerneovnen og Reaktoren** får lagene først, for dér er der mest tekst på én gang.
3. **Batteriet** sammen med punkt 6 (grafik, "Næste skridt", "Vis mig" og en guide).
4. **Værkstedet og Kosmos.** Det periodiske system kommer med punkt 7.
5. **"Hvorfor?"-kortene** sættes ind, når teksterne er faktatjekket.

Hvert skridt bliver testet på pc, tablet begge veje og telefon begge veje og kommer på GitHub Pages med det samme, så I kan prøve det på tabletten.

**Testen `lag`** skal tjekke, at underteksten og panelet ikke viser den samme tekst, at "Næste skridt" er skjult under guiden, at panelerne kan foldes væk og hentes igen (også med G og Esc), at 3D-billedet så fylder pladsen, at valget huskes, og at et "Hvorfor?"-kort åbner, går et lag dybere og lukker med Esc.

## Jeres svar (23. oktober 2026)
Planen er godkendt med disse svar:
1. "Hvorfor?"-kortet åbner ved knappen (som ordforklaringerne) og nedefra på telefon.
2. Opgaverne foldes sammen til én linje ("Opgaver 3/7 ★ ▸").
3. Citaterne bliver nederst i panelerne.
4. Underteksten er kort (højst ca. 90 tegn) med et "Hvorfor?" til sidst.

## Det skulle I tage stilling til
1. **Hvor skal "Hvorfor?"-kortet åbne?** Mit forslag: lige ved knappen (som ordforklaringerne) og nedefra på telefon. Alternativet er, at det altid folder sig ud i panelet. Så ser man det ikke, når panelerne er skjult.
2. **Opgaverne:** Skal de foldes sammen til én linje ("Opgaver 3/7 ★ ▸"), nu hvor "Næste skridt" viser den næste? Mit forslag: ja.
3. **Citaterne:** De bliver nederst i panelerne, hvor de står i dag. De er en del af charmen og taler ikke oven i noget andet. Er I enige?
4. **Underteksten:** Skal den være helt kort (højst ca. 90 tegn) med et "Hvorfor?" i slutningen, som åbner forklaringen? Mit forslag: ja.
