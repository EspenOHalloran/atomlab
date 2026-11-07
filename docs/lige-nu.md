# Lige nu (status til næste session)

*Opdateres, hver gang et stykke arbejde slutter (se `/faerdig`). Læs det først i en ny session (sammen med CLAUDE.md og DESIGN.md). Stod før øverst i DESIGN.md (flyttet 6. november 2026). Højst ca. 10 KB: Det forrige "Senest lavet" flyttes til [docs/arkiv/historik.md](arkiv/historik.md), når noget nyt er lavet. Sidst opdateret: 7. november 2026 (M1a).*

**Senest lavet (7. november 2026): Rettelser i Det periodiske system, gruppernes navne og plasma (PR A).** Jeres go: "go" (efter jeres opsamling på brugen).
- **"‹ Tilbage"** i stedet for "✕ Luk" på grundstofkortet, så man ikke trykker på "Menu" for at komme tilbage til tabellen.
- **Fejl rettet:** Tekster fra et tidligere grundstof (fx plutonium) stod på kort uden linjerne "I din hverdag" osv. CSS vandt over `hidden`. En test fanger det nu.
- **Større navne på felterne** (18-23 i stedet for 12-14 af 128), symbolet en smule mindre. På tablet på højkant er felterne stadig små.
- **Gruppernes navne** (`navnet`): Hvorfor de hedder alkali, jordalkali, overgang osv. Det står på kategorikortet og i "Hvorfor?"-kortet. Faktatjekket mod Wikipedia (kilderne står i [fakta-grundstofkort.md](fakta-grundstofkort.md)). Overgangsmetal kommer af elektronerne (Bury 1921), ikke kun af pladsen.
- **Plasma i Ordbogen:** Fem afsnit med "Hvorfor?" og "Hvordan?" (ioner, hvordan en gas bliver til plasma, hvorfor det lyser, plasmaskærme, hvor det findes) og en tegning af gas mod plasma. Det nye felt `mere` står kun i Ordbogen, ikke i boblerne.

**Før det:** Molekyler M1a, Byttebørsen (7. november 2026), Jupiter J4 (#90), Jupiter J3 (#89), Det sorte hul (#86), Jupiter J2 (#85) og flere i begyndelsen af november. Detaljerne står i [historikken](arkiv/historik.md).

**Næste (venter på jeres go):**
0. **Ordbogen, PR B (jeres svar 7. november 2026):** "Hvorfor?" og "Hvordan?" (`mere`) til de ca. 15-20 ord, hvor det giver mest mening (fx tøris, ion, isotop, fusion, halveringstid). Forklaringerne må gerne være ca. dobbelt så lange, men kun i Ordbogen. Boblerne forbliver korte. Opus høj. Mit forslag: et lille link "Mere i Ordbogen ›" i boblen (ikke besluttet).
1. **Tabletrunden er lavet (6. november 2026),** og rettelsespakken (fund 1, 5, 6 og 7) er færdig (se ovenfor). Fund 2-4 hører til andre opgaver (G1 i [docs/plan-grafik.md](plan-grafik.md), M8c del 3 og L2 i [docs/plan-mars.md](plan-mars.md)). Jeres ønske: Det sorte hul bygges om, før det testes på tabletten (✅ lavet 6. november 2026, se ovenfor).
2. **Molekyler M1b (krystallen, Li + F, Mg + O, Ca + 2 Cl, Na + Na og fremgangen) venter på jeres go.** M1a er færdig. Kører sideløbende med Jupiter (jeres valg 7. november 2026). Venus kan bygges efter Jupiter J5. Prompten: [docs/prompt-molekyler-m1.md](prompt-molekyler-m1.md) (Opus høj). Domænerne NIST, OpenStax, LibreTexts og Wikipedia er åbne.
3. **Jupiter bygges (J1-J5).** J1-J4 er færdige (6.-7. november 2026). **J5 (polerne, nordlyset, ringene og stoppene ved sydpolen og i skyggen) venter på jeres go.** Venus kan bygges efter J5. Prompten: [docs/prompt-jupiter.md](prompt-jupiter.md) (Opus høj). Hver delopgave får sit eget go.

**Kursen (jeres svar 5. november 2026):** M8c del 1, Småtingspakken, tabletrunden ([docs/tjekliste-tablet.md](tjekliste-tablet.md)), Formørkelser, Det sorte hul og Molekyler M1a er lavet. Molekyler kører sideløbende med planeterne (den ligger i Værkstedet).

**Menuen som en karrusel (7. november 2026, [plan-menu.md](plan-menu.md)):** Jeres svar er skrevet ind. K1 (prototypen bag `?karrusel`) er bygget på grenen `ccr-b08a749d-v9v3q3`. Åbent: jeres besked "Ellipseformet skulle der stå".

**Venter på et go** (ikke startet, størrelsen står i parentes):
0. **Jupiter bygges videre** (J1-J4 ✅, J5 venter, Opus høj, [docs/plan-jupiter.md](plan-jupiter.md)). Jeres svar på de fem spørgsmål er givet (6. november 2026, står i planen under "Jeres svar"): OPAL-kortet, vulkanerne venter, månerne som kugler (tryk og besøg kun, hvis det er lille og i Saturns kvalitet), 5 stop uden Io, den rigtige fart. Prompten: [docs/prompt-jupiter.md](prompt-jupiter.md). Kan køre samtidig med rettelsespakken og Det sorte hul.
1. **Orbitalerne i store atomer** (fx jern) er svære at læse. **Jeres svar:** behold som nu, men tag det op igen. Forslaget er én underskal ad gangen (fx "4s" og "3d") med en kort tekst (mellem).
2. **Molekyler M1b og M2-M4:** se "Næste" punkt 2 og [docs/plan-molekyler.md](plan-molekyler.md) (stor). Faktagrundlaget til M2 laves med xhigh.
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
- **`ordforklaring`** fejlede på `main` efter #84, men bestod i begge kørsler 7. november 2026 (M1a). I PR A (samme dag) fejlede "klik viser forklaringen null" og "klik igen lukker den" igen sammen med de andre tests og bestod alene. Ikke undersøgt. **`guide`** fejler nu og da under belastning i Reaktorens del: "måleren i 3D-billedet" (fast ventetid på 1,5 s efter `reaktor.spol(4)`) og "forklaring bagefter" (7. november 2026: kædereaktionen døde tilfældigt ud efter "Vis mig", så underteksten sagde "Den døde ud" i stedet for "vokser"). Begge bestod alene. Ikke undersøgt nærmere: Testen bør vente på måleren (`waitForFunction`) og tåle, at reaktoren dør ud efter "Vis mig" (eller "Vis mig" bør altid ende i en reaktor, der kører).
- **Grene, der kan slettes (tjekket 5. november 2026):** `claude/relaxed-cori-h0yxvd`, `ccr-3efa96d6-kxmhu1`, `ccr-5c420c09-zzdxp0`, `claude/pensive-edison-41cgwd` og `claude/eloquent-bohr-ka3lia`. Indholdet er på `main` (#68). PR #45 er lukket. Sletningen fra sessionen blev afvist af miljøets sikkerhedstjek, så I skal slette dem på GitHub (Branches). De gamle grene fra 23.-24. oktober (`ccr-447e405b`, `ccr-848a5828`, `exciting-meitner`, `jolly-rubin` og `electron-exchange-molecules`) er efter commit-navnene merget dengang, men ikke tjekket fil for fil.
- **Testen `stjerneovn-mus`** fejlede én gang sammen med en anden test ("klik i listen vælger en deuterium", 5. november 2026) og bestod alene. Ikke undersøgt.
- **Kendt fejl i kilden:** Højdekortet over Jezero-krateret har to tynde, lige streger fra sømmene mellem striberne (se plan-mars.md).
- **Domæner:** Listen over domæner til Network access står i [docs/plan-mars.md](plan-mars.md) under "Domæner, der skal på listen".
- **Faktatjek, der mangler:** Hjælpeagenterne kunne ikke åbne alle kildesider. Det, der skal tjekkes, står i `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md` (især del 2 om Voyager og afsnit 4b om flybyen). Jupiter: se "Mindst sikre påstande" i del 5.

**Ikke afprøvet:** Listen til jeres runde på tabletten står i [ikke-afproevet.md](ikke-afproevet.md).
