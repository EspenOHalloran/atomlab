# Prompt: Tid og rum, T5b (scene 3, myonernes kapløb)

*Skrevet 9. november 2026 af T5 Trin 0. Start en ny session med "Læs docs/prompt-tid-t5b.md", når T5a er færdig. **Model: Opus. Effort: høj** (fysik og animation, der skal passe med tallene).*

---

Byg scene 3, **myonernes kapløb**, i fænomenet "Hvorfor går tiden langsommere?" (`js/kosmos/tidhvorfor.js`, lavet i T5a).

**Læs først (kun disse dele):**
- `docs/lige-nu/tid.md` ("Senest lavet" fra T5a).
- `docs/plan-tid-t5.md`: "Rammen" og scene 3.
- `docs/fakta-tid/hvorfor-langsommere.md`: afsnit 15.6 (myonerne, Frisch og Smith, de tal, der må bruges).
- `docs/skitser/tid-t5.html`: `s3` (byge, levetider, de tre kontakter, klem og zoom i "Set fra myonen").
- `js/kosmos/tidhvorfor.js` (det, T5a byggede) og afsnittet om det i `docs/kode/kosmos.md`.
- Tjekliste E og F.

**Opgaven:**
1. **Scene 3** som i skitsen: en høj søjle med en byge på 24 myoner med hver sin tilfældige levetid (eksponentielt fordelt, middel 2,197 µs). De samme levetider bruges i alle tre kontakter ("Uden Einstein", "Med Einstein" og "Set fra myonen"), til man trykker "↻ Ny byge". Skyderen "Fart": 99 %, 99,9 % og 99,97 % (typisk, β = 0,99965, γ ≈ 38). "Jordens ur" og "Myonens ur" i µs, og tælleren "Nåede ned: k af 24".
2. **Set fra myonen:** Luften klemmes sammen til 15 km/γ, billedet zoomer γ gange ind, og jorden suser op. Myonens ur viser det samme ved ankomsten som "Med Einstein" (ca. 1,3 µs ved γ ≈ 38). Jordens ur vises ikke her (det er samtidigheden fra scene 4).
3. **Underteksterne:** Den fælles sætning ("Myoner er små partikler …") står, når man kommer til scenen, og bagefter kun linjen for kontakten (under ca. 160 tegn hver, teksterne står i drejebogen). γ og "ca. 400 m" følger skyderen.
4. **Siden:** emnet "Myonernes kapløb" og afsnittene i "For nørder" og "Ærligt talt" (ordret fra drejebogen).
5. **Højkant og på langs:** søjlen fylder højden på højkant. På langs står søjlen til venstre og urene til højre. Skærmbilleder af scene 3 i de tre kontakter på tablet på højkant og på pc.

**Tests** (5-10 tjek i `tests/tidhvorfor.mjs`): uden Einstein når ingen ned (med en fast byge via testadgangen), med Einstein og γ ≈ 38 er myonens ur ved ankomsten ca. 1,32 µs, "Set fra myonen" giver de samme overlevende som "Med Einstein" for den samme byge, luften er ca. 396 m ved 99,97 %, og der er ingen konsolfejl.

**Andre sessioner kører samtidig.** Dit spor er **Tid og rum**. Du ejer `js/kosmos/tidhvorfor.js`, `tests/tidhvorfor.mjs`, `docs/plan-tid*.md`, `docs/fakta-tid*` og `docs/lige-nu/tid.md`. Merge `main` ind, når du starter, og igen før PR'en.

**Når T5b er færdig:** `/faerdig`, ret `docs/lige-nu/tid.md`, `docs/kode/kosmos.md` og "Ikke afprøvet", og skriv, at T5c startes med "Læs docs/prompt-tid-t5c.md" (Opus, høj effort).
