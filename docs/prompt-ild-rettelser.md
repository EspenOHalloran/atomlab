# Prompt: Ild 1, rettelser efter prøven (28. november 2026)

*Ny session, spor Molekyler, Opus, høj effort. Kopiér teksten under.*

> Spor: Molekyler. Navngiv chatten "Molekyler · Ild 1: rettelser efter prøven". Tjek først i origin/main (`git fetch origin`, `git log origin/main --oneline -30`, `git grep` på emnet), at det ikke er lavet. Læs `docs/lige-nu/molekyler.md`, `docs/proeven-svar-2026-11.md` (afsnit 2, med jeres svar ordret), `docs/drejebog-ild.md` (afsnit 9) og `docs/kode/` for Ild (`js/ild.js`, `js/ild/bord.js`, `js/ild/atomer.js`, `js/data/ild.js`). Byg fire rettelser i turen "Hvad brænder egentlig?", ét ad gangen, og vis mig hver, før næste:
> 1. **Duggen på skeen** (trin 2) kunne ikke ses, og skaftet reflekterede for meget lys. Gør duggen tydeligere (lysere belægning og dråber, en tydelig tilvækst over få sekunder) og skaftet mat.
> 2. **Navne i trin 3:** Sønnen vidste ikke, hvad oxygen og stearin var. Sæt labels på molekylerne (oxygen/O₂ og stearin), mens man trækker, ikke først bagefter. Kort og på dansk, fagord forklares første gang.
> 3. **Partnerbyttet i trin 3** (når atomerne bytter partnere og bliver til vand og CO₂) skal gå langsommere, så man kan følge det. Tjek, at `dt` og `tid` bruges, så det står stille under pause.
> 4. **Forklaringen i trin 4** ("Du pustede flammen væk …"): Gør den lettere at forstå, gerne med én sætning mere. Faktatjek teksten (`/faktatjek`).
> Test med `node tests/koer-alle.mjs --ændret`, tag skærmbilleder af trin 2-4 i pc og tablet, og følg `/faerdig`. Rør ikke Ild 2. Dokumenterne rettes til sidst (sporets fil, `docs/kode/ild.md`), så PR og merge.
