# Tjekliste A. Før et stykke arbejde er færdigt (commit og push)

- [ ] `main` er merget ind i grenen, og `node tests/koer-alle.mjs --ændret` er kørt bagefter og bestået (hele samlingen kun, når DESIGN.md siger det). En fejl, der også sker alene, er undersøgt. En fejl, der kun sker sammen med andre, står i `docs/lige-nu/aabne-punkter.md` (tjekliste F).
- [ ] Nye funktioner har fået nye tjek i en test.
- [ ] Ved ændringer i layout eller kamera: skærmbilleder på pc, tablet og telefon (`node tests/vaerktoejer/skaermbilleder.mjs <skærm>`), og de er set igennem.
- [ ] Egen ændring er læst kritisk igennem: ubrugt kode, ting der sker to gange, lyde, timere.
- [ ] Er en fil rettet efter testene (også bare én tekst), så kør den nye test og en import af datafilen igen før push (Uranus UN1: en apostrof stoppede hele programmet).
- [ ] Er et tal eller en tekst ændret, så søg efter alle andre steder, hvor det samme står (`grep`). Det samme tal må ikke stå forskelligt to steder.
- [ ] Sporets fil i `docs/lige-nu/`, den rigtige fil i `docs/kode/` og nye erfaringer i `docs/erfaringer/` er opdateret, og CLAUDE.md og DESIGN.md, hvis en regel er ændret (se `/faerdig`). De fælles dokumenter er rettet lige efter, at `main` er merget ind.
