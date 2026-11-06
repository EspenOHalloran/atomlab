# Prompt: Planen for Jupiter

*Skrevet 6. november 2026. Kopiér teksten nedenfor ind i en ny session. Model: Opus, høj effort (CLAUDE.md: fysik, fakta og planer). Rører ikke koden. Kan laves, mens I tester på tabletten, men Jupiter bygges først efter jeres runde på tabletten.*

---

Lav planen for Jupiter (punkt 1 under "Næste" i DESIGN.md). Jeres go er givet til planen, ikke til at bygge. Læs først CLAUDE.md, "Lige nu" i DESIGN.md og tjeklisterne i docs/erfaringer.md (afsnit 1 B og E og emnerne "Planeter og måner" og "Kameraet, rejsen og flybyen" i afsnit 3). Læs også:
- `docs/plan-solsystemet.md`, afsnit 9 (jeres beslutninger 5. november 2026: en fast pakke pr. planet, filmisk overgang og ingen fælles verden, de store måner som små kugler med rigtige kort fra start) og afsnit 4 (grafik).
- `docs/plan-ux.md` ("Fire slags indhold, fire faste pladser") og `docs/plan-grafik.md` (alt nyt får en billig udgave til tabletten).
- `docs/kode.md` om Saturn, `js/solsystem/` (især `planet.js`, `ringe.js`, `maane.js`, `rejse.js`, `flyby.js` og `navne.js`) og `js/kosmos/saturn.js`. Jupiter skal genbruge så meget som muligt.
- Jeres krav om himlen ("Himlen i Solsystemet" i DESIGN.md): Baggrunden skal se realistisk ud. Ingen prikker, der ikke findes, og en måne er en prik eller en lille skive i den rigtige størrelse, når man er tæt på planeten.

**Trin 0: domæner og data, før der søges (tjekliste B).** Lav en liste over de kilder, planen skal bruge, og tjek hver med `curl -sI`. Kandidater (ikke tjekket, intet er lovet endnu):
- **Kort over Jupiter:** Cassinis kort fra 2000 (NASA/JPL, PIA-numre), Hubbles OPAL-kort (Simon m.fl., et kort hvert år), Junos JunoCam-mosaikker af polerne og Solar System Scope (CC BY 4.0). Tjek opløsning, licens, og om kortet er i ægte farver eller forstærket.
- **Månerne Io, Europa, Ganymedes og Callisto:** USGS' globale mosaikker fra Voyager og Galileo (Astrogeology, `asc-pds-services` er åbent) og evt. Junos nyere billeder af Io.
- **Tal:** NSSDC's faktaark (nssdc.gsfc.nasa.gov) og JPL SSD (radier, masse, omløb, månernes baner og hældning).
- **Vindene:** profilen over vindene for hver breddegrad (fx Porco m.fl. 2003 fra Cassini eller Tollefson m.fl. 2017 fra Hubble), så båndene glider med den rigtige fart og retning.
Er et domæne blokeret, så stop, og bed om adgang med domænets navn, før arbejdet fortsætter (jeres svar 24. og 29. oktober 2026). Listen over domæner står i docs/plan-mars.md under "Domæner, der skal på listen". Skriv de nye ind dér.

**Det, planen skal indeholde** (skriv den i `docs/plan-jupiter.md`, kort og i lag som de andre planer):
1. **Kloden:** fladtrykt (ca. 6,5 %), kortet og dets opløsning på pc og tablet, båndene, der glider mod hver sin side efter den målte vindprofil, Den Store Røde Plet, der drejer (og hvor stor den er nu), og hvad der kan laves i en shader og hvad med et kort. Hvor meget af `planet.js` kan genbruges?
2. **Signatur-effekter (1-2 eller 3, med pris for hver):** fx skybåndene og pletten tæt på, Junos cykloner ved polerne, nordlyset (i ultraviolet lys, så ærligt om farven), de svage ringe i modlys og Io's vulkaner. Sig, hvad der er ægte data, og hvad der er tegnet.
3. **Månerne som små kugler med rigtige kort:** baner, størrelser, farten (resonansen 1 : 2 : 4 mellem Io, Europa og Ganymedes), og om de skal kunne trykkes på. Samme regel for størrelsen som ved Mars: større langt væk, så de kan ses, men den rigtige størrelse tæt på.
4. **Flybyen med 4-6 stop og stederne i træet** (sted, forsøg, tur og styring efter plan-ux.md), hvert stop med et kort forslag til teksten og "Ærligt talt". Hvad sker der med "Stå på" (Jupiter har ingen overflade)? Forslag til lag ("Hvorfor?" og "For nørder").
5. **Himlen:** hvad man ser fra hvert stop (Solen ca. 1/5 så stor som fra Jorden, månerne, stjernerne), så intet ligner noget, der ikke findes.
6. **Tablet og ydelse:** kortenes størrelse, hvad `LAV_KVALITET` skruer ned for, og hvad der skal måles (billeder i sekundet).
7. **Delopgaver** (J1, J2, …) med størrelse, model og effort, hvad hver af dem genbruger, og hvilke tests der skal laves. Hver får sit eget go.
8. **Spørgsmål til jer** (højst 5, hver med Opus' anbefaling først), fx hvilke signatur-effekter der skal med, og om månerne skal kunne besøges allerede nu.

**Faktagrundlaget:** Skriv tallene og påstandene med kilder i `docs/fakta-solsystemet.md` i et nyt afsnit "Jupiter" (samme form som Saturn: værdi, kilde, sikkerhed S, RS eller U, og om kilden blev åbnet eller kun set som søgeresultat). Brug hjælpeagenter, som `/faktatjek` beskriver. Kendte fælder, der skal tjekkes: "Jupiter er en mislykket stjerne" (den skulle have ca. 80 gange så stor masse), "Den Store Røde Plet er en storm, der har raset i 350 år" (Cassinis plet fra 1665 er måske ikke den samme), hvor meget pletten er skrumpet, og om "Jupiter beskytter Jorden mod kometer" holder. Skriv nye fælder ind i docs/erfaringer.md. Er du i tvivl om et tal, så skriv det forsigtigt eller lad det være.

**Tokens:** Sig det med det samme, hvis noget koster unødigt mange tokens (fx sider, der ikke kan åbnes). Download ikke store kort for at se på dem. Tjek størrelse og licens med `curl -sI` og små udgaver.

**Til sidst:** Opdater "Lige nu" i DESIGN.md (flyt det forrige "Senest lavet" til docs/arkiv/historik.md), og læg spørgsmålene til jer under "Venter på et go". Opdater artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe, læs det først, og behold linket): Planen for Jupiter flyttes til "Lavet for nylig", og "Jupiter bygges" kommer under "Venter på et go". Commit, push, lav en PR, og merge den (kun dokumenter, så ingen tests skal køres, men tjek med `node tests/koer-alle.mjs --ændret`, at den vælger ingen).
