# Prompt: Tid og rum, T4 (udsigten fra cockpittet)

*Skrevet 8. november 2026, da T3 var færdig. Start en ny session med "Læs docs/prompt-tid-t4.md". **Model: Opus. Effort: høj** (en shader og nyt faktagrundlag, se "Model og effort" i plan-tid.md). T4 har brug for sit eget go (se "Trinene" i plan-tid.md). Spørg kun, hvis noget er uklart.*

---

Byg T4 i "Rejsen i tid" efter planen i `docs/plan-tid.md`: udsigten fra cockpittet, hvor stjernerne samler sig i en lys plet foran, blå foran og røde bagude.

**Læs først (kun disse dele):**
- `docs/lige-nu/tid.md` og DESIGN.md.
- I `docs/plan-tid.md`: "Hovedidéen" punkt 6, "Trinene" (Rammen og T4) og "Model og effort".
- I `docs/fakta-tid.md`: afsnit 2 (γ), 7 (længdeforkortelsen, "Ærligt") og "Kilderne".
- `docs/kode/kosmos.md` (afsnittene om Rejsen i tid og Sort hul), `docs/kode/testadgang.md` (Kosmos), tjekliste B, E og F og `docs/erfaringer/fakta-faelder.md`.
- I koden: `side` og `lav` i `js/kosmos/tid.js` (især "Set fra skibet" og `stilScene`), og i `js/kosmos/linse.js` kun, hvordan billedet tegnes i et lag for sig og lægges ind som en flade (shaderen, `WebGLRenderTarget`, `LINSE_KVALITET` og den dynamiske opløsning). `js/data/sorthul.js` viser, hvordan dopplerfaktoren regnes uden Three.js.

**T4 (forslag, ret det i planen, hvis du finder noget bedre):**
1. **Faktagrundlaget først** (tilføj et afsnit 14 i `docs/fakta-tid.md`, og regn efter i `docs/fakta-tid/regn.py`): aberrationen (cos θ' = (cos θ + β)/(1 + β cos θ)), dopplerfaktoren D = 1/(γ(1 − β cos θ)), lysstyrken (ca. D³ til D⁴ for en stjerne, med kilde), hvor stor pletten foran er ved 90 %, 99 %, 99,99 % og 14 ni-taller, og hvad der sker med farverne (stjernerne forude bliver blåforskudt ud af det synlige lys, og baggrundsstrålingen bliver til farlig stråling ved ekstreme farter). Kilder: Wikipedia ("Relativistic aberration", "Relativistic Doppler effect", "Relativistic beaming") og arxiv.org. Ingen nye domæner burde være nødvendige.
2. **Regningen uden Three.js** i `js/data/tid.js` (vinklen og D som funktion af γ), så den kan testes i Node.
3. **Udsigten:** fx en handling "🔭 Udsigt fra skibet" (eller en kontakt), der viser himlen set fra skibet i en shader. Stjernerne laves i shaderen (som i linse.js), så de kan flyttes med aberrationen og få farve og lysstyrke med D. Skyderen "Fart" og 1 g styrer den. Navne i shaderkode må kun have ASCII-tegn. Skru ned med `LAV_KVALITET`.
4. **Teksterne:** et emne (fx "Hvad ville du se?") med `kontakt` eller en handling-knap, linjer i "For nørder" (formlerne) og "Ærligt talt" (hvad animationen snyder med, fx farverne uden for det synlige lys). Fjern sætningen "Man ville heller ikke se det sådan …" i "Ærligt talt" under "Set fra skibet", eller lad den henvise til udsigten. `/faktatjek` og "Hvorfor?"-kort kun, hvis det giver mening.
5. **Tests:** tallene mod fakta-tid.md i Node, at udsigten åbner og lukker uden konsolfejl, og at pletten foran bliver mindre, når farten stiger (fx med en testadgang i `test` i tid.js). Mål billeder i sekundet før og efter (tjekliste F). Kør `node tests/koer-alle.mjs --ændret`. Skærmbilleder kun af udsigten på pc og tablet på højkant.

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Tid og rum** (`docs/lige-nu/tid.md`). Du ejer `js/kosmos/tid.js`, `js/data/tid.js`, `tests/tid.mjs`, `tests/vaerktoejer/tid-tekster.mjs`, `docs/plan-tid.md`, `docs/fakta-tid.md`, `docs/fakta-tid/regn.py` og `docs/lige-nu/tid.md`. Du deler `js/data/hvorfor.js`, `js/data/ordbog.js`, `style.css` (kun blokken "Rejsen i tid"), `docs/kode/kosmos.md`, `docs/kode/testadgang.md` og `tests/README.md`: Rør kun dine egne linjer. Rør ikke `js/kosmos/linse.js` (Sort hul) og `js/faenomenskaerm.js` uden at spørge først. Laver du en fælles byggeklods ud af noget fra linse.js, så spørg først. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves.

**Når T4 er færdig:** Serien "Rejsen i tid" er slut. Opdater artefaktet "AtomLab Overblik", og skriv, hvordan næste session startes (DESIGN.md, "Når et punkt er færdigt").
