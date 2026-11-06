# Prompt: Det sorte hul bygges om

*Skrevet 6. november 2026. Kopiér teksten nedenfor ind i en ny session. Model: Opus. Sæt sessionens effort til **xhigh**, før I sender prompten (CLAUDE.md, "Effort": lysbøjning i en shader). Rører ikke de samme filer som rettelsespakken, så de kan køre samtidig.*

---

Byg det sorte hul i Kosmos om (`js/kosmos/sorthul.js`). Jeres go til at gå i gang er givet, men læs "Sådan gør du" nedenfor: Først en kort plan og et prøvebillede, og byg først det hele efter jeres næste go. Læs CLAUDE.md, "Lige nu" i DESIGN.md (punkt 1 under "Venter på et go"), tjeklisterne i docs/erfaringer.md (især "Gløden lyser sorte ting op" i afsnit 3) og afsnittene om Kosmos og Sort hul i docs/kode.md. Brug `/faktatjek` til teksterne og `/faerdig` til sidst.

**Jeres kritik** (DESIGN.md): Det sorte hul er ikke imponerende nok. Den hvide ring ligner ikke bøjet lys, skiven foran hullet ligner et beige låg, og den ene side er ikke lysere end den anden.

**Jeres skærmbillede (6. november 2026), tæt på hullet:** Skyggen er skåret over med en skarp, vandret kant midt i billedet. Over kanten er skyggen sort, og under den ligger skivens forreste halvdel som et beige låg med en sort ellipse (hullet i skiven). Årsagen (Opus, læst i koden, ikke målt): Skyggen er en flad sort skive midt i hullet (radius 3,9), og gas-skiven starter inden for den (inderst 2,5). Den flade skygge skærer derfor gas-skiven over: Den forreste halvdel tegnes oven på, og den bagerste skjules. Kameraet kan komme helt ned til 4 enheder fra midten (`minDistance` i `scene3d.js`), så det ses tydeligst tæt på. Den nye shader skal se rigtig ud på alle afstande, også tæt på. Overvej en mindste afstand for netop dette fænomen.

**Målet:** Rigtig lysbøjning i en shader, der regner lysets baner om hullet, som i filmen Interstellar. Det, der skal ses:
1. **Skiven bøjes:** Skivens bagside ses som en bue op over skyggen og ned under den. Det er det samme lys, ikke en ring, der er tegnet for sig.
2. **En tynd fotonring** lige uden for skyggen (lys, der er gået en eller flere gange rundt om hullet), og evt. de svage billeder af skiven inde ved ringen.
3. **Dopplerlys:** Den side af skiven, der kommer mod os, er tydeligt lysere og blåligere, og den anden side er mørkere og rødere. Tyngdekraftens rødforskydning gør skiven mørkere inderst. Bemærk: I Interstellar blev netop Doppler-forskellen taget ud med vilje, så billedet blev roligere. Her skal den med, for den er en del af jeres kritik, og den er rigtig. Skriv det i "Ærligt talt" eller nørd-teksten.
4. **Baggrunden bøjes også:** Stjernerne bag hullet forskydes og danner en ring (Einsteinring) ved kanten, når kameraet drejer.
5. **Skyggen** har den rigtige størrelse, √27 ≈ 5,2 gange massen (2,6 gange horisontens radius), som i dag.

**Fysikken (anbefaling, sig til, hvis du mener noget andet):**
- **Et sort hul, der ikke drejer (Schwarzschild).** Lysets bane ligger i et plan, og ligningen er enkel (fx d²u/dφ² = 3Mu² − u med u = 1/r, eller en kort integration i kartesiske koordinater med kraften −3/2·h²·r̂/r⁵). Et hul, der drejer (Kerr), giver en lidt skæv skygge, men koster meget mere og ses næsten ikke. Skriv i "Ærligt talt", at hullet her ikke drejer.
- **Skiven** er tynd og flad. Inderkanten sidder ved den inderste stabile bane (ISCO, 6M = 3 horisontradier for et hul, der ikke drejer). Farven fra temperaturen (varmest inderst). Lysstyrken ganges med Dopplerfaktoren (g³ eller g⁴, skriv hvilken og hvorfor i en kommentar) med g fra både skivens fart og tyngdekraften. Striber eller turbulens i skiven, der hvirvler med Keplers fart (hurtigst inderst), med `tid` fra `opdater(dt, tid)`, så den står stille under pause.
- **Kontrollér tallene i Node, før shaderen skrives:** skyggens radius (b = √27 M), fotonringen ved r = 3M og ISCO ved 6M. Læg en lille test af JS-udgaven af integrationen i `tests/` eller i `js/data/` (data uden Three.js kan testes i Node).

**Teknik:**
- Én fuldskærmsshader (eller en stor kugle om hullet), der sender en stråle pr. pixel fra kameraet og følger den i et fast antal skridt. Hold skridtene korte tæt på hullet og lange langt væk.
- **Tabletten** (`LAV_KVALITET` fra `scene3d.js`): færre skridt og tegnet i lavere opløsning (fx halv) og skaleret op. Det skal køre glat på jeres tablet. Mål billeder pr. sekund med testadgangen eller et lille script, og skriv tallene i docs/kode.md.
- **Gløden:** Den nuværende løsning med `GemPass` og `SkyggePass` (`holdSkyggenSort`) holder skyggen sort. Tjek, om den stadig er nødvendig, når skiven tegnes i shaderen. Er den ikke, så fjern den (og ret docs/kode.md og erfaringen).
- **"Reducer bevægelse"** (`ROLIG`): skiven hvirvler langsommere eller står stille.
- **Navne i shaderkode kun med ASCII-tegn.**
- **Astronauten og stjernen**, der bliver revet over: De er 3D-ting med deres egen fysik og skal blive. Forslag: Tegn dem som nu oven på shaderen, så de ikke bøjes, og lad dem forsvinde i skyggen, ligesom nu. Skriv det i "Ærligt talt". Har du en billig måde at bøje dem på, så nævn den i planen, men byg den ikke uden et go.
- **Navnene** ("Vis navne": Skygge, Varm gas, Bøjet lys og Begivenhedshorisont) skal stadig passe til det, der ses. Tilføj evt. "Fotonring".

**Teksterne:** Ret siden (`side` i sorthul.js), så den passer til det nye billede: "Hvad er den lysende ring?" (nu rigtig bøjning og fotonringen), en kort forklaring på, hvorfor den ene side er lysere (forklar dopplereffekten første gang), og "Ærligt talt" (hvad der er rigtigt, og hvad animationen snyder med: fx skivens størrelse i forhold til hullet, at hullet ikke drejer, at astronauten ikke bøjes, og farverne). Hold dem korte og på en 13-årigs dansk. Faktatjek med `/faktatjek`. Billedet af M87* fra 2019 kan nævnes som sammenligning (den lyse side er den nederste, fordi gassen dér kommer mod os). Tjek påstanden, før den skrives.

**Sådan gør du:**
1. **Plan og prøvebillede først:** Skriv en kort plan i `docs/plan-sorthul.md` (trin, hvad der kontrolleres, hvad tabletten får, og dine spørgsmål). Lav et første prøvebillede af shaderen alene (pc og tablet-opløsning, med fuld grafik som i testen `grafik`). Vis det, og vent på et go.
2. **Byg resten** efter go'et. Hold det, der virker i dag (astronauten, stjernen, kontakterne, siden og "Videre"-linkene).

**Tests:** Testene `kosmos` og `grafik` bruger sorthul. Tilføj tjek for skyggens størrelse på skærmen (fx at midten er sort, og at kanten sidder ved √27 M ± lidt), og at den side, der kommer mod os, er lysere end den anden. Kør `node tests/koer-alle.mjs --ændret`. Skærmbilleder: `node tests/vaerktoejer/skaermbilleder.mjs kosmos` (eller det, der passer), både med navne og uden, og med fuld grafik.

**Til sidst:** Opdater "Lige nu" i DESIGN.md (flyt det forrige "Senest lavet" til docs/arkiv/historik.md), fjern punkt 1 (Det sorte hul) fra "Venter på et go", og skriv "Det sorte hul (bygget om)" i "Ikke afprøvet" til næste runde på tabletten. Skriv erfaringerne med lysbøjningen i docs/erfaringer.md. Opdater artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe, læs det først, og behold linket).
