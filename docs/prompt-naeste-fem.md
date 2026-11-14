# Prompt: De næste fem sessioner (runde 4)

*Skrevet 14. november 2026 af sessionen "Småting · Overblik og de næste fem sessioner" efter jeres svar (nederst). Prompterne står også i artefaktet "AtomLab Overblik" med en kopiknap. Når en runde er færdig, skrives den næste her, og den gamle flyttes til `docs/arkiv/`.*

## Rækkefølgen
1 og 2 kan starte nu, samtidig (hvert sit spor). 3 venter på 1, 4 venter på 2, og 5 venter på 3. Fable kan kun bruges til og med **16. november 2026**, så 1 og 3 skal nå det inden da.

### 1. Videnskabsfolkene · Plan og drejebog til Huygens (Opus, høj, nu)
> Læs `docs/prompt-videnskabsfolk.md`, og gør det, der står under "Prompten". To ting mere (vores svar 14. november 2026, står i `docs/koereplan.md`): (1) Huygens bygges også nu, ved siden af Gåderne 3D, så planens trin H1 skal kunne startes lige efter Fables tjek. (2) Fable skal tjekke drejebogen før 16. november: Skriv til sidst `docs/prompt-fable-huygens.md` (Fable 5.2, effort high, svaret i `docs/fable/E12-huygens.md`) efter mønstret i `docs/prompt-fable-overblik.md`, og merge den med det samme, så Fable-sessionen kan starte i aften eller i morgen.

### 2. Solsystemet · G1 trin 3 del 3: kortene og skyggerne (Opus, høj, nu)
> Læs `docs/prompt-maaler.md`, og gør det, der står under "Prompt til trin 3, del 3". Den nye måling fra tabletten efter H står allerede i `docs/maalinger/mars-g1.md` ("Tabletten efter H", 14. november 2026). Kort fortalt: Mens man står, er der 60 billeder i sekundet, så forslag c (dynamisk opløsning) er ikke nødvendigt. Tilbage er (1) et ryk på 1,2 s, når kortene ved Jezero lægges i grafikkortet (det, A og F skal løse), og (2) 50-90 ms pr. billede, mens Solen flytter sig (de grove skygger; opdater og tegn bruger kun ca. 2 ms, så det er grafikkortet). Skriv pris og gevinst for to-tre måder at løse (2) på, ud over A og F, og spørg om go, før noget, der ændrer udseendet, bygges. Vores fund på tabletten (14. november 2026): Der er stadig et hak, når man trykker "Stå på Mars", lige før satellitkortet toner over i det 3D-tegnede landskab. Det er nok rykket på 1,2 s i målingen. Målet er en glidende overgang, fx at kortene lægges i grafikkortet lidt ad gangen, før toningen starter.

### 3. Fable · Tjek af drejebogen til Huygens (Fable 5.2, high, efter 1 og før 16. november)
> Læs `docs/prompt-fable-huygens.md`, og gør det, der står under "Prompten".

### 4. Solsystemet · Overblikket (Opus, høj, når 2 er merget)
> Spor: Solsystemet og Kosmos. Tjek først i `origin/main`, at G1 trin 3 del 3 er merget, og at overblikket ikke er i gang. Læs `docs/drejebog-overblik.md` (med vores svar 14. november 2026), `docs/fable/E9-overblik-noter.md`, `docs/retning.md` og `docs/kode/solsystem.md`, og byg overblikket som Solsystemets forside. Merkur og Pluto står som en lille kugle med et kort panel, til de bygges. Lav først en kort plan med trin, og få et go pr. trin. Brug tjeklisterne D og E, `/faktatjek` på nye tekster, og afslut med `/faerdig`.

### 5. Videnskabsfolkene · Fables noter og H1 (Opus, høj, når 3 er færdig)
> Spor: Videnskabsfolkene. Læs `docs/fable/E12-huygens.md`, `docs/plan-videnskabsfolk.md` og `docs/drejebog-huygens.md`. Skriv Opus' noter i `docs/fable/E12-huygens-noter.md` (hvad er nyt, og hvor er du uenig, som i `docs/fable/E9-overblik-noter.md`), ret drejebogen, og stil mig spørgsmålene som en dialog med din anbefaling først. Byg derefter H1 efter planen, når jeg har givet go.

## Turbo: luk spor, der er tæt på færdige (jeres ønske 14. november 2026: "giv den gas")
Hver ligger i sit eget spor og kan køre samtidig med de fem.
- **Tid og rum · Kosmos i fire grupper** (Opus, medium): "Spor: Tid og rum. Del listen i Kosmos i fire grupper (køreplanen, Serie 1 nr. 4). Tjek først i origin/main, at det ikke er lavet. Læs docs/lige-nu/tid.md, docs/koereplan.md (Serie 1 nr. 4), docs/plan-verdener.md og docs/kode/kosmos.md. Se, hvordan Solsystemets liste er delt i grupper, og genbrug det. Foreslå de fire grupper og deres navne med din anbefaling først, og vent på mit go, før du bygger. Gruppen "Universet" skal have plads til Mørkt stof senere. Kør tests med --ændret, tag skærmbilleder i telefon- og tabletstørrelse, og afslut med /faerdig."
- **Ordbogen · "Orbital", Stjerneovnens graf, og sporet lukkes** (Opus, medium, nu): "Spor: Ordbogen og Det periodiske system. Tjek først i origin/main, at det ikke er lavet. Læs docs/lige-nu/ordbog-og-system.md og afsnit 3 og 5 i docs/fable/E7-kvantefysik-noter.md, og lav de to små rettelser derfra: (1) "Orbital" i js/data/ordbog.js, skrevet ud fra fælden "orbitalen er ikke en bane" (afsnit 7 i docs/fakta-kvantefysik.md), og (2) "i spillet" ind i grafens tekst i js/fusion.js (ca. linje 445), så den ikke siger det modsatte af HVORFOR.tunnel. Brug /faktatjek og tests med --ændret. Skriv derefter i docs/lige-nu/ordbog-og-system.md og i tabellen i docs/lige-nu.md, at sporet er lukket (nye ord tages i det spor, der bruger dem), og afslut med /faerdig."
- **Menuen · Jeres runde, og sporet lukkes** (Opus, medium, efter jeres runde på tabletten): "Spor: Menuen. Læs docs/lige-nu/menuen.md og docs/kode/ (filen om js/karrusel.js). Ret menuen efter min runde på tabletten: [fundene]. Rækkefølgen af verdenerne: [Kernerne først / som nu]. Kør tests med --ændret, tag skærmbilleder i telefon- og tabletstørrelse, skriv i docs/lige-nu/menuen.md og i tabellen i docs/lige-nu.md, at sporet er lukket, og afslut med /faerdig."
- **Molekyler · Liv-planen efter Fables drejebog (E10)** (Opus, høj, når Molekyler-forløbet er merget): "Læs `docs/prompt-fable-liv-l3-l6.md`, og gør punkt 1 under 'Efter Fables svar'."
- **Småting · Gåderne G4b, skinnen** (Opus, høj, når G4a er merget): prompten står nederst i `docs/plan-gaader-3d.md` (skrevet af G4a-sessionen).

## Bagefter
Venus V3 → V4 → V5, så Merkur og Pluto i en lille udgave. Så er Solsystemet færdigt, og nye spor kan starte (Lys og farver først). **Uden for sessionerne:** prøven med jeres søn ([guide-proeven.md](guide-proeven.md)). Der ligger nu 6-7 ting med status "prøve".

## Jeres svar (14. november 2026)
- **Fable:** Ja, Fable tjekker drejebogen til Huygens før 16. november.
- **Huygens:** Kom i gang med Huygens nu, også med bygningen. Solsystemet prioriteres også (det gør det allerede).
- **Lys og farver:** Vigtig, men vent. Solsystemet skal være færdigt, før nye spor starter.
- **Solsystemet færdigt:** Som udgangspunkt det hele (Mars del 3, overblikket, Venus V3-V5, Merkur og Pluto), men Mars del 3 og overblikket i første omgang.
- **Målingen på tabletten efter H:** står i [maalinger/mars-g1.md](maalinger/mars-g1.md).
- **Artefaktet:** Den slanke udgave.
- **Prioritering:** Luk spor, der er tæt på færdige, før nye åbnes, og kør gerne mange sessioner samtidig ("jeg har en del usage, så bare giv den gas").
- **Mars:** Det ser fint ud på tabletten, men der er et hak, når man trykker "Stå på Mars", lige før satellitkortet toner over i landskabet. Overgangen skal være glidende (skrevet ind i nr. 2).
