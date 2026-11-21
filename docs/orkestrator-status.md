# Orkestratoren: status

*Opdateret 20. november 2026 kl. ca. 22 dansk tid af orkestratoren for natten (session_01VDmQuADE7YByetGZE3Sd2Q, "Orkestrator · AtomLab (natten 20.-21. nov)"). Skemaet er trig_012gpYEzMFKG9WussGFBe8xh (hver time ved :55, fyrer ind i den session). Hold denne fil under ca. 5 KB.*

## Natten 20.-21. november (jeres svar kl. ca. 21:55: "masser af forbrug", "gerne land på månerne", orkestratoren vælger)
- **Merget i nat (alle status prøve):** Måner M3 (#399), G1 del 2 kvalitetstrin på touch (#400), Gåderne løftet A-D (#401), Rømers drejebog V2 (#402), M4 Flyv gennem fontænen (#403, #405), Einsteins drejebog (#404), M5a Land med Huygens, nedstigningen (#406). M5b Land med Huygens, landingen (#408). **Sporet Måner er bygget færdigt** (venter på prøven). Orkestratorens skema er slettet 21. november kl. ca. 06, da køen var tom.
- **Valgt af orkestratoren, kan ændres af jer:** M4 styring A (man trækker højden, man kan ikke fejle). M5a: nedturen i sporets egen `js/maaner/nedtur.js`. Einsteins drejebog startet efter Rømer (jeres "du vurderer").
- **Venter på jer:** Seks spørgsmål til Rømers bog og syv til Einsteins (sporets fil `docs/lige-nu/videnskabsfolkene.md`), rettighedslinjen for 1915-skanningen (før E4), Gåderne E (skinnen i skala med farvetone og højere på telefon, go?), målingen med `?maal` på Tab A11 og A56 efter G1 del 2, og prøven af hele "Under isen" og "Land med Huygens" med jeres søn.
- Erfaringerne fra natten står i `docs/erfaringer/arbejdsmaade.md` (sidste punkt).

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
