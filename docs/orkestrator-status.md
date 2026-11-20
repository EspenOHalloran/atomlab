# Orkestratoren: status

*Opdateret 20. november 2026 kl. ca. 10 dansk tid af sessionen "Småting · Gennemgang af det, der venter" efter gennemgangen med jer. **Ny orkestrator fra samme tid:** se "Skift af orkestrator" nederst. Hold denne fil under ca. 5 KB.*

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
Orkestratoren må **fortsætte automatisk igen** (hver time, efter egen vurdering) og starte disse, når der er plads (højst to tunge ad gangen, én session pr. spor):
1. ~~Kvantefysik forløb 1, PR 2 og PR 3~~: færdig (#376, #378).
2. ~~Venus "Ned gennem skyerne"~~ (færdig, #374): (længere tid, ca. 3 s ekstra pr. tekst efter ordtal, og bladring ‹ ›): prompt i `docs/lige-nu/aabne-punkter.md` (punktet om Venus).
3. ~~G4c Sort hul~~ (færdig, #380): go givet, målingen er fin (74 billeder/s på Tab A11, 57 på pc). Prompt i `docs/lige-nu/smaating.md` ("Næste i Gåderne").
4. ~~Grafik G2~~ (færdig, #387, status prøve: mål med `?maal` på Tab A11 og pc). **G3 Værkstedet kører**, så Mars ekstra 4 (L2, en session på jeres pc).
5. ~~Måner · drejebogen~~ (færdig, #383, jeres svar i #384). **M2 "Under isen" del 1 (tung, Opus høj) venter på jeres go**, prompt i `docs/lige-nu/maaner.md` ("Næste").
6. **Videnskabsfolkene V2 (Rømers drejebog, kun dokumenter):** **ikke spurgt i gennemgangen**, vent på jeres go. Einsteins drejebog: fire spørgsmål besvaret (se `docs/fakta-einstein-bog.md` afsnit 11), men vent på jeres go og rettighedslinjen for 1915-skanningen.
- **Kører nu (20. november kl. ca. 19:15):** G3 Værkstedet (session_01YQoBWMpYqnm5Zr2cWPEDGG, Opus høj, Småting). Orkestrator skift 9 er session_01YQoBWJVex4Y286oe7MnLii. G2 ramte 5-timersgrænsen og fik "Fortsæt" kl. 19:14.
- **Færdig 20. november:** Saturn S3b (PR #370), Kvantefysik forløb 1 PR 1-3 (PR #372, #376, #378), Venus "Ned gennem skyerne" (PR #374) og G4c Sort hul (PR #380), alle merget, status prøve og arkiveret. Mulig senere forbedring: Rhea i ca. 2,2 km (større fil hos PSI, I henter den i en browser).

## Venter på jer
- **Prøven med sønnen** i weekenden 22.-23. november ([guide-proeven.md](guide-proeven.md)). Blokerer Ild 2 og Kvantefysik forløb 2-3.
- **Prøver på enhederne:** pc og mobil i Gåderne (navne, swipe, knib og zoom), Enceladus' skyggegrænse, stenene ved Naukluft, Curiosity og Planet 9 på tabletten, 4k-højdekortet på pc'en. Hvilken gåde gav lange stop (180-610 ms) på pc?
- **Tychos trin 2** ("Tæt på eller langt væk?") er uforståeligt: åbent punkt med forslag (#386), venter på jeres go (Videnskabsfolkene).
- **Rettighedslinjen** for Smithsonians skanning fra 1915 (biodiversitylibrary.org har robottjek, læses i en browser).
- **Hvad der sidst blev afgjort:** Grafik: G2 først, så Værkstedet (G3). L2 efter G2.

## Andet
- Kendte røde tests: `venus` (også alene), `batteri` (også alene på main), `frigiv` og `overblik` (kun under belastning).
- Ugegrænsen er tæt på (advarsel). Den nulstilles 25. november kl. 01:00 dansk tid.

## Skift af orkestrator (20. november 2026)
Den gamle orkestrator (session_01YQoBWJHjboVRT37tHFPvrZ) stod på 573.000 tokens, så **jeres ønske er: kontekst holdes kort.** Regler for orkestratoren:
- Hver time: Læs kun denne fil og `list_sessions`. Er der ikke noget nyt, så svar med én linje og stop.
- **Skift ved ca. 250.000 tokens** (`get_session` uden id, `context_usage`): Opret en ny orkestrator med `create_session` (`source_url: https://github.com/EspenOHalloran/atomlab`, Opus, medium), giv den prompten "Du er orkestratoren for AtomLab. Læs docs/orkestrator-status.md og følg den.", opret et nyt skema (cron `0 * * * *`, `persistent_session_id` = den nye session), slå dit eget fra, og skriv til brugeren. Opdatér denne fil, før du skifter.
- Hver gang en session er færdig og merget: Arkivér den, og flyt det færdige ud af denne fil.
