# Prompt: Tid og rum, T5a (fænomenet "Hvorfor går tiden langsommere?", scene 1 og 2)

*Skrevet 9. november 2026 af T5 Trin 0. Start en ny session med "Læs docs/prompt-tid-t5a.md". **Model: Opus. Effort: høj** (kode, der kommer med i programmet, fysik og danske tekster). Drejebogen og skitsen er godkendt 9. november 2026 ("Skitsen er afprøvet. Den er god.").*

---

Byg det nye fænomen i Kosmos, "Hvorfor går tiden langsommere?", med rammen til alle fem scener og de to første scener: 1 bolden og lyset og 2 lysuret med trekanten. Scene 3-5 står som pladser, der siger "kommer snart" (eller er skjult i bjælken), til T5b og T5c bygger dem.

**Læs først (kun disse dele):**
- `docs/lige-nu/tid.md` og DESIGN.md.
- `docs/plan-tid-t5.md`: "Jeres svar", "Rammen", scene 1 og 2 og "Tjek mod fælderne". Teksterne derfra bruges ordret (de er faktatjekket i `docs/fakta-tid/hvorfor-langsommere.md`).
- `docs/skitser/tid-t5.html`: de fælles hjælpere (`tilpas`, `tekst`, `panel`, `glimt`, `pil`, `streg`), `s1` og `s2`. Tegnekoden genbruges.
- `docs/kode/kosmos.md` (afsnittet om Rejsen i tid) og `docs/kode/faelles.md` (fænomenskærmen: `trin()`, `fase`, Styr-boksen, siden).
- I `js/kosmos/tid.js`: lysuret (`LYS_TRIN`, `lysGeo`, `tegnLysur`, `opdaterLysur`, hvordan lærredet sættes ind i overlaget, `trin()` og `styring`). I `js/faenomenskaerm.js` kun det, du skal bruge (grep efter `trin`, `styring`, `side`).
- Tjeklisterne C, D og E og `tests/README.md`, tjekliste F, når testene skrives.

**Opgaven:**
1. **Fænomenet** `js/kosmos/tidhvorfor.js` (id `tidhvorfor`, navn "Hvorfor går tiden langsommere?", ikon 🔦, undertitel "Lysets mærkelige regel"), sat ind lige efter `tid` i listen i `js/kosmos.js`. 3D-scenen er en rolig stjernehimmel. Hovedsagen er et 2D-lærred i overlaget, som lysuret i Rejsen i tid.
2. **Scenerne som trin** i bjælken (`trin()`: fem prikker, ‹ og "Næste"). Jeres svar: Første gang går man 1 → 5 med "Næste", og man kan trykke sig til en scene, man har set (alle, når man har været igennem én gang). Gem ikke noget i localStorage, medmindre det er nødvendigt (så skal det i `docs/kode/gemte-data.md`).
3. **Teksten, der altid er fremme,** står som fasens undertekst (under ca. 160 tegn). Kontakterne og skyderne står i Styr-boksen og skifter med scenen: scene 1 ⚾ Bold / 🔦 Lygte og "Togets fart" (100 km/t, 50 % og 90 %), scene 2 "Fart" (0, 50, 87, 95 og 99 %) og "△ Vis trekanten".
4. **Siden** (se "Siden" under "Rammen" i drejebogen): kort, fem emner (ét pr. scene), "For nørder" og "Ærligt talt" med ét afsnit pr. scene. Skriv kun scene 1 og 2 ind nu. T5b og T5c tilføjer resten.
5. **Lysuret deles:** Flyt lysurets tegning til et fælles modul (fx `js/kosmos/lysur.js`), som både `tid.js` og `tidhvorfor.js` bruger, så de to ikke glider fra hinanden. Rejsen i tid skal se ud og opføre sig som før (`tests/tid.mjs` skal være grøn). Trekanten (fra skitsens `s2`) kommer ind i det fælles modul.
6. **Henvisningen fra Rejsen i tid:** I emnet "Hvorfor går Jordens ur så hurtigt?" en knap `gå('kosmos:tidhvorfor', '🔦 Hvorfor? Se det trin for trin')`. Tjek, at `gå('kosmos:…')` virker inde i Kosmos.
7. **Telefon og tablet:** Scene 1 har altid de to billeder over hinanden, og scene 2 har lysurene over hinanden under ca. 560 px. Lærredet må ikke dække bjælken eller Styr-boksen. Tag skærmbilleder af scene 1 og 2 på pc og på tablet og telefon på højkant.

**Fysikken skal passe** (som i skitsen): Lysets fart på skærmen er den samme i begge billeder. Toget er γ gange kortere set fra perronen, og pælene er γ gange tættere set fra toget. Bolden ved store farter følger w = (u + v)/(1 + u·v/c²). I lysuret er "87 %" √3/2 (γ = 2), som `LYSUR_FARTER` i `js/data/tid.js`. Fænomenet bruger `dt` fra `opdater(dt, tid)`, ikke `performance.now()`.

**Tests** (tjekliste F, 5-10 tjek i en ny `tests/tidhvorfor.mjs`, og ret `tests/kosmos.mjs` fra 12 til 13 fænomener): fænomenet åbner uden konsolfejl, bjælken har fem trin, og "Næste" går fra scene 1 til 2, kontakten Lygte skifter underteksten, farten i scene 1 giver 80 % ved 50 % + 50 %, trekanten stopper på toppen og viser γ = 2 ved 87 %, Rejsen i tids lysur virker stadig, og knappen fra Rejsen i tid åbner det nye fænomen. Tilføj `js/kosmos/tidhvorfor.js` (og det fælles lysur-modul) i `tests/koer-alle.mjs`, så `--ændret` finder testene. Testadgang i `docs/kode/testadgang.md`.

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Tid og rum** (`docs/lige-nu/tid.md`). Du ejer `js/kosmos/tidhvorfor.js`, det nye lysur-modul, `js/kosmos/tid.js`, `js/data/tid.js`, `tests/tidhvorfor.mjs`, `tests/tid.mjs`, `docs/plan-tid*.md`, `docs/fakta-tid*` og `docs/lige-nu/tid.md`. I `js/kosmos.js`, `tests/kosmos.mjs`, `tests/koer-alle.mjs` og `style.css` skrives kun på jeres egen linje eller i jeres egen blok. Merge `main` ind, når du starter, og igen før dokumenterne rettes og PR'en laves.

**Når T5a er færdig:** `/faerdig`, ret `docs/lige-nu/tid.md` ("Senest lavet" og "Næste"), `docs/kode/kosmos.md` og "Ikke afprøvet" (det, I skal kigge efter på tabletten), og skriv, at T5b startes med "Læs docs/prompt-tid-t5b.md" (Opus, høj effort).
