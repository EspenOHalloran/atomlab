# Orkestratoren: status

*Opdateret 27. november 2026 kl. ca. 19.35 UTC af orkestratoren "mens I venter på prøven" (session_01YQoBWMNYQt2TGvRm9SqHWs). Den gamle status fra 20.-22. november står i [arkiv/orkestrator-status-nov-2026.md](arkiv/orkestrator-status-nov-2026.md). Hold denne fil under ca. 5 KB.*

## 27. november (jeres go: "start en orkestrator der starter sessioner i din anbefalede rækkefølge og modelvalg og effort")
Højst to tunge sessioner ad gangen. Intet, der venter på prøven med sønnen, er startet.
- **Plads B, lavet og merget:** B1 BepiColombo ved Merkur (#451: i bane 21. november kl. 18.24 UTC, en brænding stoppede for tidligt, så omløbet er 75 timer i stedet for 58, sonden er i sikkerhed; **tjek adskillelsen efter 10. december**). B2 faktagrundlaget i [fakta-moerkt-anti-ukendt.md](fakta-moerkt-anti-ukendt.md) (#452). B3 testen `mars` var allerede delt i tre 16. november, kun forældede linjer rettet (#453). B4 resten af faktatjekket fra E13 (#454: fakta-grundstofkort, fakta-molekyler og fakta-solsystemet; intet forkert i programmet, Voyager nr. 2, 4 og 7 bekræftet, nr. 5 Sagans sidetal ikke fundet).
- **Plads A, kører:** R1 Rømers forside (session_01YQoBWJ2CiF9cqinViMTSpF). Domænet `thumb.wikimedia.org` er godkendt 28. november. Derefter R2 og R3 (prompterne skrives under "Næste" i [lige-nu/videnskabsfolkene.md](lige-nu/videnskabsfolkene.md)), og når R3 er bygget, linket fra Einsteins "1905: Tiden".

## Jeres svar 28. november
- Domænet `thumb.wikimedia.org` er godkendt, og R1 kører videre.
- De fire valg om Mørkt, anti og ukendt: **A til alle fire** (står i fakta-moerkt-anti-ukendt.md og koereplan.md nr. 8). Næste: en plan, så et go.
- Skemaet er oprettet (trig_01WccMrAVnzwHsSyYkKuk1T3, hver time ved :54). Det gamle skema "skift 9" er slukket.

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
