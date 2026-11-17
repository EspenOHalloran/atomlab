# Prompt: Merkur og Pluto bygges (MP1-MP4)

*Skrevet 17. november 2026, da Venus var færdig (V5). Kopiér teksten nedenfor ind i en **ny session** i sporet Solsystemet. Model: Opus, høj effort. Én delopgave pr. session: Den bygger én del og venter på jeres go til den næste. Brugerens go gælder kun den del, der står i beskeden.*

---

Byg Merkur og Pluto i en lille udgave efter drejebogen i `docs/drejebog-merkur-pluto.md`. Du hører til sporet **Solsystemet og Kosmos** og skriver kun status i `docs/lige-nu/solsystemet.md`. Start med den del, jeres besked nævner (MP1, hvis intet andet står). Efter hver del stopper du, fortæller kort, hvad der er lavet, og venter på jeres go til den næste.

**Læs først** (kun det, opgaven bruger, se "Tokens" i CLAUDE.md):
- `docs/lige-nu.md` og `docs/lige-nu/solsystemet.md`.
- `docs/drejebog-merkur-pluto.md`, især afsnit 2, 3 og 6 ("Til Opus"), og `docs/fable/E16-merkur-pluto-noter.md` (Opus' noter om polen, skyggerne i kortet og kortenes 0° og 180°, og "Jeres svar"). **Svarene gælder over resten.**
- `docs/fakta-solsystemet/del8-merkur-og-pluto.md` (tallene og fælderne).
- Tjekliste E (og C, D eller F, når delen passer) og erfaringerne `docs/erfaringer/venus.md` (den nyeste planet: en ny klode ændrer andre tests, flybyen, turen i to flyvninger) og `docs/erfaringer/planeter-og-maaner.md`.
- `docs/kode/venus.md` og `docs/kode/solsystem.md`. Genbrug Venus og Mars: `klippeplanet.js`, `rejse.js`, `flyby.js`, `navne.js`, `hent.js` og datoen fra `js/data/venus.js`/`js/data/isgiganter.js`.

**Andre sessioner kører samtidig.** Ret kun i de filer, delen skal bruge. Ændringer i fælles moduler skal være valgfrie, så de andre planeter ikke ændres, og kør deres tests (`mars`, `venus`, `jupiter`, `saturn`, `isgiganter`, `solsystem`) bagefter. Merge `main` ind, når delen starter, og igen før PR'en. Ret de fælles dokumenter til sidst.

**Tests:** `node tests/koer-alle.mjs --ændret` i baggrunden. Skærmbilleder kun af det, der er ændret. Brug `/faktatjek` til alle tekster og `/faerdig` ved slutningen af hver del.
