# Prompt: Menuen, K3 (ringen bliver standard)

*Skrevet 8. november 2026, da K4 (verdenerne i ringen) var færdig. Jeres "go" til K3 blev givet 7. november 2026 (se "Jeres svar" i `docs/plan-menu.md`). Start K3 med en ny session: "Læs docs/prompt-menu-k3.md. Lav K3." **Model: Opus. Effort: medium** (det meste er at fjerne den gamle menu og rette tests, ikke ny grafik). Tag først jeres runde på tabletten med `?karrusel`, hvis I vil nå at rette noget i ringen, før den bliver standard.*

---

Gør ringen med verdenerne til den almindelige menu efter `docs/plan-menu.md` (K3) og `docs/plan-verdener.md`.

**Læs først (kun disse dele):**
- `docs/lige-nu/menuen.md` og DESIGN.md.
- I `docs/plan-menu.md` afsnittene "Jeres svar" og K3 under "Trin", og i `docs/plan-verdener.md` "Jeres svar".
- I `docs/kode/faelles.md` afsnittene om `js/main.js`, `js/karrusel.js` og `js/menubaggrund.js`, og i `docs/kode/testadgang.md` menuen.
- Tjekliste D og F og afsnittet "Menuen som en ring" i `docs/erfaringer/skaerme-og-ui.md`.
- I koden: `js/karrusel.js`, menuens dele af `js/main.js` (`startMenu`, `visFremgangIMenu`, `fremgangPrDel`), menuen i `index.html` og menuens blok i `style.css`. Find alle tests, der bruger menuen, med `grep -rln "menukort\|Næste eventyr\|næste-eventyr\|menuStatus\|menuCitat\|karrusel" tests/`.

**K3:**
- Ringen vises altid (også uden `?karrusel`). `KARRUSEL` og `?karrusel` fjernes, eller `?gammelmenu` beholdes kun, hvis I beder om det.
- Fjern det gamle: gitteret (`.menukort` som 4 + 4 kort og reglerne for det ved 1150, 820 og 560 px), de gule piller (`.kort-fremgang`), linjen med tallene (`#menuStatus`), citatet (`#menuCitat`, jeres svar: det må gerne forsvinde) og "Næste eventyr" (`næste-eventyr`). "Start her" for en ny bruger bliver (på Atomværkstedets knap).
- `fremgangPrDel()` bruges stadig af "Din fremgang" og ✓ på delene og verdenerne. ✓ på delene kan flyttes fra main.js til karrusel.js, så alt om menuen står ét sted.
- Ret testene, der tjekker det gamle (fx `system` tjekker "Næste eventyr", og `karrusel` tjekker, at menuen er uændret uden `?karrusel`). Kør `node tests/koer-alle.mjs --ændret` (den vælger alle, fordi `index.html`, `style.css` og `main.js` er ændret). Skærmbilleder af menuen på pc, tablet begge veje og telefon begge veje.
- Ret `docs/kode/faelles.md`, `docs/kode/testadgang.md`, `README.md` og hjælpen ("Om AtomLab" i `index.html`), hvis de nævner det gamle gitter.
- `/faerdig` til sidst.

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Menuen** (`docs/lige-nu/menuen.md`). Du ejer `js/karrusel.js`, `js/menubaggrund.js`, `tests/karrusel.mjs`, `docs/plan-menu.md`, `docs/plan-verdener.md` og menuens blok i `js/main.js`, `index.html` og `style.css`. Ret kun de linjer i andre tests, der handler om menuen. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves.
