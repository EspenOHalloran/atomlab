# Prompt: Tid og rum, T5c (scene 4 og 5, "nu" og rumtidskortet)

*Skrevet 9. november 2026 af T5 Trin 0. Start en ny session med "Læs docs/prompt-tid-t5c.md", når T5b er færdig. **Model: Opus. Effort: høj** (samtidighed og egentid skal passe, fingrene på tablet og danske tekster).*

---

Byg scene 4, **"Nu" er ikke det samme for alle**, og scene 5, **Rumtidskortet**, i "Hvorfor går tiden langsommere?" (`js/kosmos/tidhvorfor.js`), og gør fænomenet færdigt.

**Læs først (kun disse dele):**
- `docs/lige-nu/tid.md` ("Senest lavet" fra T5b).
- `docs/plan-tid-t5.md`: "Rammen", scene 4 og 5 og "Tjek mod fælderne".
- `docs/fakta-tid/hvorfor-langsommere.md`: afsnit 15.7 og 15.8.
- `docs/skitser/tid-t5.html`: `s4` og `s5` (og trækket med fingeren nederst i scriptet).
- `js/kosmos/tidhvorfor.js` og afsnittet om det i `docs/kode/kosmos.md`.
- Tjekliste D, E og F og `/faktatjek` (kun for nye ord i Ordbogen).

**Opgaven:**
1. **Scene 4:** lampen midt i togvognen, to billeder over hinanden, kontakterne "Toget står stille" og "Toget kører 60 % af lysets fart" og knappen "💡 Blink igen". Ved 60 %: vognen er 80 % så lang set fra perronen, og lyset rammer bagenden efter 0,25 og forenden efter 1,0 (i enheden L/c), i toget begge efter 0,5. Mærker på perronen, hvor lyset ramte. "Om to ting sker 'samtidig' …" kommer som ny undertekst, når forenden er ramt.
2. **Scene 5:** rumtidskortet (tid 0-10 år op, rum −5 til 5 lysår), lysets streger (45°), den hjemmeblevnes streg og den rejsendes streg med en prik for hvert år på eget ur. Et tryk hvor som helst på kortet flytter vendepunktet, og man kan trække (`touch-action: none` kun på kortet). Grænsen er 98 % af lysets fart, og så står "Hurtigere end lyset kan man ikke!". "▶ Spil rejsen" og kontakten "Vis den rejsendes 'nu'" (stiplede linjer og springet derhjemme: 1,8 → 8,2 år ved vendepunktet 4 lysår ude ved 5 år). Vendepunktet 4 lysår ude giver 6 år, og 3 lysår ude giver 8 år.
3. **Siden:** emnerne og afsnittene for scene 4 og 5 (ordret fra drejebogen). Scene 5 slutter med `gå('kosmos:tid', '⏳ Rejsen i tid')`, og lysurets sidste trin i Rejsen i tid nævner det nye fænomen.
4. **Ordbogen:** Tjek, om "samtidighed" og "egentid" findes. Ellers tilføj dem (højst 260 tegn, faktatjek), og tilføj dem i Ordbogens liste, hvis den har en.
5. **Højkant:** Scene 4 har altid billederne over hinanden. Scene 5 er kvadratisk og fylder bredden. Vendepunktet er mindst 44 px at ramme. Skærmbilleder af scene 4 og 5 på tablet på højkant, telefon og pc.

**Tests** (5-10 tjek i `tests/tidhvorfor.mjs`): tiderne for lyset i scene 4 (0,25, 1,0 og 0,5), egentiden for vendepunktet (4, 5) er 6 år og for (3, 5) 8 år, vendepunktet kan ikke komme uden for lyset, springet i "nu" er 6,4 år, knappen til Rejsen i tid virker, og der er ingen konsolfejl. Kør til sidst hele samlingen (`node tests/koer-alle.mjs`), fordi serien T5 er færdig, og `js/kosmos.js` og et fælles lysur-modul er ændret.

**Andre sessioner kører samtidig.** Dit spor er **Tid og rum**. Du ejer `js/kosmos/tidhvorfor.js`, `js/kosmos/tid.js`, `tests/tidhvorfor.mjs`, `docs/plan-tid*.md`, `docs/fakta-tid*` og `docs/lige-nu/tid.md`. I `js/data/ordbog.js` skrives kun på ordets plads efter alfabetet. Merge `main` ind, når du starter, og igen før PR'en.

**Når T5c er færdig:** `/faerdig`, ret `docs/lige-nu/tid.md` (T5 er færdig), `docs/lige-nu.md` og `docs/koereplan.md` (sporets linje), `docs/kode/kosmos.md` og "Ikke afprøvet", og opdatér artefaktet "AtomLab Overblik" (serien er færdig).
