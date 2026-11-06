# Lige nu (status til næste session)

*Opdateres, hver gang et stykke arbejde slutter (se `/faerdig`). Læs det først i en ny session (sammen med CLAUDE.md og DESIGN.md). Stod før øverst i DESIGN.md (flyttet 6. november 2026). Højst ca. 10 KB: Det forrige "Senest lavet" flyttes til [docs/arkiv/historik.md](arkiv/historik.md), når noget nyt er lavet. Sidst opdateret: 6. november 2026.*

**Senest lavet (6. november 2026): Det sorte hul er bygget om med rigtig lysbøjning.** Jeres go: "vi går med dine anbefalinger. go." (efter planen og prøvebilledet, [docs/arkiv/plan-sorthul.md](arkiv/plan-sorthul.md), [oversigt](arkiv/sorthul-proeve.jpg)).
- **En shader** (`js/kosmos/linse.js`) følger lyset baglæns for hver pixel om et hul, der ikke drejer: Skivens bagside ses som en bue over og under skyggen, der er en tynd fotonring, den side, der kommer mod os, er lysere og hvidere (g⁴), og stjernerne bag hullet bøjes. Fysikken står i `js/data/sorthul.js` og testes i Node (ny test `sorthul`: skyggen ved √27 M, fotonkuglen 3M, ISCO 6M).
- **Jeres svar:** g⁴, 6.000 K, mindste afstand 15 (ca. 20 M), astronauten og stjernen bøjes ikke, og dynamisk opløsning på pc og tablet.
- **Gløden:** Masken (`GemPass`/`SkyggePass`) blev, for skyggen blev grå uden den, når skiven lyser op.
- **Teksterne** (faktatjekket): ringen og fotonringen, et nyt emne om dopplereffekten (Interstellar tog alle frekvensskift ud, M87* er lysest nederst), "Ærligt talt", ca. 27.000 lysår (før 26.000), og to nye ord i ordbogen (Fotonring, Dopplereffekt). `grafik` måler skyggens kant, den lyse side og den dynamiske opløsning.
- **Tests:** Ny Node-test `sorthul` (19 OK). Hele samlingen efter mergen af `main` (#81-#84, i bidder, for containeren genstartede to gange): 32 af 33 bestod. **`ordforklaring` fejler 2 tjek ("klik viser forklaringen" ved supernovaens "neutrino"), også på `main` alene efter #84** (se Åbne punkter). `grafik` fejlede én gang under belastning på "lærredet følger med en ny størrelse" (fast ventetid på 1,5 s): rettet, så den venter på størrelsen, og den bestod derefter under samme belastning.

**Før det:** Jupiter J2, vindene og Den Store Røde Plet (6. november 2026, #85, se historikken). Hentebjælken og de mørke kloder (6. november 2026, #84, se historikken). Dokumenterne delt op (6. november 2026, #83, se historikken). Jupiter J1, kloden og skelettet (6. november 2026, #82, se historikken). Skrænten ved Olympus Mons set længere fra (6. november 2026, #81, se historikken). Rettelsespakken efter tabletrunden (6. november 2026, #80, se historikken). Bjælken "Henter AtomLab" på forsiden (6. november 2026, #79, se historikken). Formørkelser med et grafisk løft (6. november 2026, se historikken). Planen for Jupiter (6. november 2026, [docs/plan-jupiter.md](plan-jupiter.md), se historikken). Småtingspakken (5. november 2026, #69, #71 og prikkerne på himlen ved Olympus Mons). M8c del 1 (roverens foto i Stå på Mars, #69) og nitrogens "Vidste du?" (#71). Oprydningen i dokumenterne og planen efter Mars (5. november 2026, CLAUDE.md er kort, og detaljerne om koden står i [docs/kode.md](kode.md)). 31. oktober 2026: M8b (Stå på Mars ved Jezero, [plan-mars.md](plan-mars.md) under "Status efter M8b"), U4 (den samme tidsknap og de samme kontakter i hele AtomLab, [plan-ux.md](plan-ux.md)), S2 (Saturns ringe fra Cassinis måling), L1 (lyset i Stå på Mars), U3 (siden i lag) og U2 (styringen på billedet). Detaljerne står i historikken.

**Næste (venter på jeres go):**
1. **Tabletrunden er lavet (6. november 2026),** og rettelsespakken (fund 1, 5, 6 og 7) er færdig (se ovenfor). Fund 2-4 hører til andre opgaver (G1 i [docs/plan-grafik.md](plan-grafik.md), M8c del 3 og L2 i [docs/plan-mars.md](plan-mars.md)). Jeres ønske: Det sorte hul bygges om, før det testes på tabletten (✅ lavet 6. november 2026, se ovenfor).
2. **Jupiter bygges (J1-J5).** J1 og J2 er færdige (6. november 2026). **J3 (månerne) venter på jeres go.** Prompten: [docs/prompt-jupiter.md](prompt-jupiter.md) (Opus høj). Hver delopgave får sit eget go.

**Kursen (jeres svar 5. november 2026, planlægningen efter oprydningen):**
- **M8c del 1** er færdig og merget (#69).
- **Småtingspakken** er færdig (#69, #71 og prikkerne på himlen ved Olympus Mons).
- **Tabletten før Jupiter bygges.** Tjeklisten (15 punkter) står i [docs/tjekliste-tablet.md](tjekliste-tablet.md). Fejl rettes, før planeterne genbruger den fælles kode. Planen for Jupiter kan laves imens.
- **Indskydes mellem planeterne** (jeres valg, alle tre): Formørkelser med et grafisk løft (✅ lavet 6. november 2026, før tabletrunden), Molekyler M1 (stor, kan køre samtidig med planeterne, for den ligger i Værkstedet) og Det sorte hul (stor, Opus xhigh). Hver får sit eget go. Opus' forslag til rækkefølgen: Formørkelser mellem Jupiter og Venus, Molekyler M1 sideløbende, og Det sorte hul, når en planet er færdig, og der er plads til en dyr opgave.

**Venter på et go** (ikke startet, størrelsen står i parentes):
0. **Jupiter bygges videre** (J1 og J2 ✅, J3-J5 venter, Opus høj, [docs/plan-jupiter.md](plan-jupiter.md)). Jeres svar på de fem spørgsmål er givet (6. november 2026, står i planen under "Jeres svar"): OPAL-kortet, vulkanerne venter, månerne som kugler (tryk og besøg kun, hvis det er lille og i Saturns kvalitet), 5 stop uden Io, den rigtige fart. Prompten: [docs/prompt-jupiter.md](prompt-jupiter.md). Kan køre samtidig med rettelsespakken og Det sorte hul.
1. **Orbitalerne i store atomer** (fx jern) er svære at læse. **Jeres svar:** behold som nu, men tag det op igen. Forslaget er én underskal ad gangen (fx "4s" og "3d") med en kort tekst (mellem).
2. **Molekyler, M1 (Byttebørsen):** Planen og jeres svar ligger klar i [docs/plan-molekyler.md](plan-molekyler.md) (stor). Faktagrundlaget til M2 laves med xhigh.
3. **Liv, lige efter Molekyler (opprioriteret, jeres go 5. november 2026):** Liv bygger på molekylerne (byggesten, hinder, RNA og DNA), så den kommer efter M1/M2. Opus laver faktagrundlaget med xhigh og planen, og Fable 5.5 tjekker det, hvis den kommer. Venter ikke længere på Fable. DNA (før punkt 8.6) er en del af Liv. Se "Ny del: Liv" i [ideer.md](ideer.md) (stor).
4. **Fotos af grundstofferne** fra Wikimedia Commons med navn og licens (mellem).
5. **Mars ekstra** (efter planeterne eller når I vil): Curiosity som 3D-model (M8c del 2), Nordpolen tæt på (M7b-pol), stenene og terrænet i Stå på Mars (M8c del 3, jeres fund 3. november 2026: stenene ser ens ud) og lyset, den dyre del (L2, kræver en session på jeres pc). Se [docs/plan-mars.md](plan-mars.md).
6. **Saturn S3** (højder på månerne, [docs/plan-saturn-kvalitet.md](plan-saturn-kvalitet.md)), **Jorden og Månen flottere** (se [ideer.md](ideer.md)). **Mere grafik i hele AtomLab** ([docs/plan-grafik.md](plan-grafik.md), 3. november 2026): tablet og pc er lige vigtige, så alt nyt får en billig udgave til tabletten. Start med G1 (måling og kvalitetstrin) og G2 (kantudglatning og glød). Fire beslutninger til jer står i planen.
7. **Planeterne efter Mars (besluttet 5. november 2026):** Jupiter → Venus → Merkur → Uranus og Neptun → Pluto → overblikket (trin 2 i Solsystemet, med planeterne på himlen og "Find Jorden"). Se [docs/plan-solsystemet.md](plan-solsystemet.md), afsnit 9.
8. **Planen efter planeterne (jeres svar 5. november 2026, rækkefølgen er Opus' forslag og kan ændres):** Hver får sin egen plan og sit eget go. Vurderingerne står i [ideer.md](ideer.md).
    1. **Ild** sammen med Molekyler: forbrænding, kædereaktionen med radikaler og flammefarverne.
    2. **Kvantefysik** med kvantecomputeren som sidste kapitel.
    3. **Antistof** og **Mørkt stof** som fænomener i Kosmos.
    4. **Gåderne:** 5-10 uløste gåder med links ud i programmet (også Planet X). Fable tjekker listen.
    5. **Månerne og "Land på måner"** i Solsystemet (Titan med Huygens, Europa, Enceladus og evt. Månen ved Apollo 11).
    6. **Tjernobyl** i Reaktoren (rykket ned, jeres go 5. november 2026). Venter stadig på Fable 5.5 (se [docs/plan-fable.md](plan-fable.md)). Laver Opus den før, så med xhigh til faktagrundlaget.
    - DNA er flyttet op i Liv (punkt 3 ovenfor).
    - Hjernen og AI venter (jeres svar). Nye dele kræver en beslutning om menuen (i dag 8 kort).

**Åbne punkter:**
- **Testen `henter`** (fra #79) fejlede én gang sammen med en anden test ("pc: bjælken er fyldt et stykke (100 %)", 6. november 2026, Det sorte hul) og bestod alene. Under belastning nåede bjælken nok 100 %, før testen målte. Ikke undersøgt nærmere.
- **`ordforklaring` fejler på `main` efter #84** ("klik viser forklaringen null" og "klik igen lukker den", tjekket på `main` alene 6. november 2026). Ikke undersøgt. **`guide`** fejlede én gang under belastning ("pc: måleren i 3D-billedet", fast ventetid på 1,5 s efter `reaktor.spol(4)`) og bestod alene.
- **Grene, der kan slettes (tjekket 5. november 2026):** `claude/relaxed-cori-h0yxvd`, `ccr-3efa96d6-kxmhu1`, `ccr-5c420c09-zzdxp0`, `claude/pensive-edison-41cgwd` og `claude/eloquent-bohr-ka3lia`. Indholdet er på `main` (#68). PR #45 er lukket. Sletningen fra sessionen blev afvist af miljøets sikkerhedstjek, så I skal slette dem på GitHub (Branches). De gamle grene fra 23.-24. oktober (`ccr-447e405b`, `ccr-848a5828`, `exciting-meitner`, `jolly-rubin` og `electron-exchange-molecules`) er efter commit-navnene merget dengang, men ikke tjekket fil for fil.
- **Testen `guide`** fejlede én gang under belastning (timeout, "tlf: trin 4 varmen", 5. november 2026, småtingspakken) og bestod alene. Ikke undersøgt.
- **Testen `stjerneovn-mus`** fejlede én gang sammen med en anden test ("klik i listen vælger en deuterium", 5. november 2026) og bestod alene. Ikke undersøgt.
- **Kendt fejl i kilden:** Højdekortet over Jezero-krateret har to tynde, lige streger fra sømmene mellem striberne (se plan-mars.md).
- **Domæner:** Listen over domæner til Network access står i [docs/plan-mars.md](plan-mars.md) under "Domæner, der skal på listen".
- **Faktatjek, der mangler:** Hjælpeagenterne kunne ikke åbne alle kildesider. Det, der skal tjekkes, står i `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md` (især del 2 om Voyager og afsnit 4b om flybyen). Jupiter: se "Mindst sikre påstande" i del 5.

**Ikke afprøvet:** Listen til jeres runde på tabletten står i [ikke-afproevet.md](ikke-afproevet.md).
