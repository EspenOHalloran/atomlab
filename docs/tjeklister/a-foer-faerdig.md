# Tjekliste A. Før et stykke arbejde er færdigt (commit og push)

- [ ] Hele testsamlingen er kørt (`node tests/koer-alle.mjs`) og bestået. En fejl er undersøgt, før den kaldes "ustabil".
- [ ] Nye funktioner har fået nye tjek i en test.
- [ ] Ved ændringer i layout eller kamera: skærmbilleder på pc, tablet og telefon (`node tests/vaerktoejer/skaermbilleder.mjs <skærm>`), og de er set igennem.
- [ ] Egen ændring er læst kritisk igennem: ubrugt kode, ting der sker to gange, lyde, timere.
- [ ] Er et tal eller en tekst ændret, så søg efter alle andre steder, hvor det samme står (`grep`). Det samme tal må ikke stå forskelligt to steder.
- [ ] CLAUDE.md, DESIGN.md, `docs/lige-nu.md`, den rigtige fil i `docs/kode/` og nye erfaringer i `docs/erfaringer/` er opdateret (se `/faerdig`).
