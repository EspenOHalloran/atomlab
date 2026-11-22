# Orkestratoren: status

*Opdateret 20. november 2026 kl. ca. 22 dansk tid af orkestratoren for natten (session_01VDmQuADE7YByetGZE3Sd2Q, "Orkestrator · AtomLab (natten 20.-21. nov)"). Skemaet er trig_012gpYEzMFKG9WussGFBe8xh (hver time ved :55, fyrer ind i den session). Hold denne fil under ca. 5 KB.*

## Natten 21.-22. november (jeres ord kl. ca. 21: "Einstein skal bare køre hele natten. Og evt andre spor der giver mening. Start en ny orkestrator når relevant. Du træffer beslutninger og orienterer mig i morgen.")
- **Orkestratoren beslutter selv i nat** og skriver valgene her med "valgt af orkestratoren, kan ændres af jer". Retningsvalg (et helt nyt spor som Lys og farver, noget, der slettes) tages stadig ikke. De sættes på listen til jer.
- **Einstein først (jeres go):** E1 (forsiden) kører i session_01VDmQu9Pn62UTaD83qW3Vxm, så E2 (turen) og E3 (klodsen `ligning` og opslag 3), én ad gangen. Hver session skriver prompten til det næste trin under "Næste" i `docs/lige-nu/videnskabsfolkene.md`. **Jeres ønske skal stå øverst i hver prompt:** "Gør dig virkelig umage med Einstein. Det skal være fedt … Hellere en side mere end en for lidt" (drejebogen afsnit 17). E4 venter på rettighedslinjen for 1915-skanningen (I læser den i en browser). Byg så Rømer R1-R3 (jeres svar: ja til alle anbefalinger), og til sidst E4-E5.
- **Den anden plads (Småting, én ad gangen):** (1) ~~Artefaktet~~ opdateres ikke mere (jeres ønske 22. november), (2) Gåderne E (skinnen viser rejsen i skala med en farvetone og sidder højere på telefon, foreslået i #401). Ikke flere end to tunge sessioner ad gangen (5-timers grænsen, se erfaringerne).
- **Lavet i nat (22. november, orkestrator session_01VDmQu88YXsAaa71CDnUFJT):** G2 "Høj" på tunge skærme (#421), Kvantefysik "Er elektronen to steder på én gang?" (#422 bølgen og prikken, tælleren, trin 6 og kortet, #423 skyderen "Målerens lys"), G4 skygge i krogene (#424), E2 Einsteins tur (#425). Alle sessioner er arkiveret. Alle tre stoppede ved 5-timers-grænsen ca. kl. 01-02 UTC (tre tunge kørte kort samtidig, fordi grafikken byggede G4, før beskeden om at vente nåede frem) og fortsatte kl. 05 UTC.
- **Køen er sat på pause (valgt af orkestratoren, kan ændres af jer):** Kontoen fik advarslen om ugegrænsen ("seven_day: allowed_warning", nulstilles 26. november). Derfor er der ikke startet flere sessioner, og orkestratorens skema er slået fra (trig_01STknyuf4oEoKTVMEpz7gR9). Med jeres go startes i rækkefølge: Huygens/Forløb (prompten nedenfor), Gåderne E, E3 (prompten under "Næste" i `docs/lige-nu/videnskabsfolkene.md`).
- **I køen (jeres go kl. ca. 22, Forløb, Opus høj), startes, når grafikken eller E2 er færdig:** Prompt: "Spor Forløb: Forløbets linje fylder for meget på lave skærme på langs (jeres svar 21. november 2026 med skærmbilleder fra 'Land med Huygens' på telefonen: linjen dækker den nederste halvdel, hvor faldskærmen og jorden skal ses). Læs docs/lige-nu/forloeb.md, docs/kode/ om js/forloeb.js, docs/stilguide.md og tjekliste D. Tjek i origin/main, at det ikke er lavet. (1) Under @media (max-height: 500px) and (orientation: landscape) flytter forløbets linje ud i en smal kolonne i højre side med lidt mindre skrift i Solsystemet og Kosmos, efter mønstret i Opdagelserne (style.css, #opdagelser.i-forløb). Scenen får resten. (2) Mens Huygens falder (Saturn → Land med Huygens, også efter turen), skjules sidefanerne og Indstillinger med klokken, som panelerne skjules under en tur, og de kommer igen, når den er landet. Tjek, at Næste og Udforsk selv kan nås uden at rulle i de fleste trin. Skærmbilleder på telefon på langs (892×412) og højkant og tablet, --ændret i baggrunden, /faerdig, PR og merge."
- **Rettet 21. november:** De røde tests `venus` og `batteri` (#411, de målte på det forkerte tidspunkt). Jeres svar til Rømer og Einstein (#410).

## Natten 20.-21. november (lavet)
Måner M3-M5b (#399-#408, sporet er bygget færdigt), G1 del 2 (#400), Gåderne A-D (#401), Rømers og Einsteins drejebøger (#402, #404). Erfaringerne står i `docs/erfaringer/arbejdsmaade.md` (sidste punkt). **Venter stadig på jer:** prøven med sønnen (Under isen, Land med Huygens og mere), målingen med `?maal` på Tab A11 og A56, stenen på 4 cm i landingsbilledet (Ikke afprøvet) og rettighedslinjen for 1915-skanningen.

## Jeres beslutninger (gælder stadig)
- Højst **to tunge sessioner** (Opus) ad gangen. Skift orkestrator ved ca. 250.000 tokens (`get_session` uden id, `context_usage`).
- Når en session stopper ved grænsen, får den "Fortsæt, hvor du slap." ved første tjek efter nulstillingen.
- Nye spor (Lys og farver, Strøm og magneter, Kvantefysik) startes ikke uden jer.
- **Start altid sessioner med `source_url: https://github.com/EspenOHalloran/atomlab`.**
- Orkestratoren må selv oprette og slette sit skema og sine påmindelser (PR #350).
- **De tre forslag til optimering** (røgtest på GitHub Actions, `/proeveliste`, `/ny-session`): Orkestratoren anbefalede at lade dem ligge, fordi gevinsten er lille. I har ikke sagt go. Byg dem ikke.
- **Rækkefølgen (jeres go 19. november 2026):** T3 og Einsteins faktagrundlag, så overblikket, så Planet 9, så Kvantefysik forløb 1 før Lys og farver (står i `docs/koereplan.md`).
- **S3b:** I henter selv de fire formmodeller (Mimas, Tethys, Dione, Rhea) fra sbn.psi.edu i en browser 20. november. Spejlene er tjekket: SBN-UMD og NAIF har dem ikke (NAIF har kun Enceladus).

## Jeres go (20. november 2026, gennemgangen i Småting)
Orkestratoren må fortsætte automatisk (hver time, højst to tunge ad gangen, én pr. spor). Punkt 1-6 fra gennemgangen er lavet (#370-#406, se historikken i sporenes filer). Tilbage: Stjerneovnen (G3) venter på go efter prøven, så Mars ekstra 4 (L2, en session på jeres pc).

## Venter på jer
- **Prøven med sønnen** i weekenden 22.-23. november ([guide-proeven.md](guide-proeven.md)). Blokerer Ild 2 og Kvantefysik forløb 2-3.
- **Prøver på enhederne:** pc og mobil i Gåderne (navne, swipe, knib og zoom), Enceladus' skyggegrænse, stenene ved Naukluft, Curiosity og Planet 9 på tabletten, 4k-højdekortet på pc'en. Hvilken gåde gav lange stop (180-610 ms) på pc?
- **Rettighedslinjen** for Smithsonians skanning fra 1915 (biodiversitylibrary.org har robottjek, læses i en browser).
- **Hvad der sidst blev afgjort:** Grafik: G2 først, så Værkstedet (G3). L2 efter G2.

## Andet
- **Tycho trin 2 og Betelgeuse (jeres go 20. november, "ret"):** Betelgeuse er ikke en indstilling (jeres ord), men en tur for sig, som Tychos bog linker til.
- Kendte røde tests: `venus` (også alene), `batteri` (også alene på main), `frigiv` og `overblik` (kun under belastning).

## Skift af orkestrator (20. november 2026)
Den gamle orkestrator (session_01YQoBWJHjboVRT37tHFPvrZ) stod på 573.000 tokens, så **jeres ønske er: kontekst holdes kort.** Regler for orkestratoren:
- Hver time: Læs kun denne fil og `list_sessions`. Er der ikke noget nyt, så svar med én linje og stop.
- **Skift ved ca. 250.000 tokens** (`get_session` uden id, `context_usage`): Opret en ny orkestrator med `create_session` (`source_url: https://github.com/EspenOHalloran/atomlab`, Opus, medium), giv den prompten "Du er orkestratoren for AtomLab. Læs docs/orkestrator-status.md og følg den.", opret et nyt skema (cron `0 * * * *`, `persistent_session_id` = den nye session), slå dit eget fra, og skriv til brugeren. Opdatér denne fil, før du skifter.
- Hver gang en session er færdig og merget: Arkivér den, og flyt det færdige ud af denne fil.
