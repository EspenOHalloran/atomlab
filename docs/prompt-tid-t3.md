# Prompt: Tid og rum, T3 (lagene og teksterne)

*Skrevet 7. november 2026, da T2 var færdig. Start en ny session med "Læs docs/prompt-tid-t3.md". **Model: Opus. Effort: høj** (teksterne skal være korrekte, se "Model og effort" i plan-tid.md). T3 har brug for sit eget go (se "Trinene" i plan-tid.md). Spørg kun, hvis noget er uklart.*

---

Byg T3 i "Rejsen i tid" efter planen i `docs/plan-tid.md`.

**Læs først (kun disse dele):**
- `docs/lige-nu/tid.md` og DESIGN.md.
- I `docs/plan-tid.md`: "Trinene" (Rammen og T3) og "Fælder, vi skal undgå".
- I `docs/fakta-tid.md`: afsnit 3 (lysuret), 7 (længdeforkortelsen), 8 (energien og støvkornet), 9 (tvillingeparadokset), 10 (det er målt), 12 (cæsiumuret) og "Kilderne". Brug **kun** tal fra fakta-tid.md, og regn efter med `docs/fakta-tid/regn.py` (kør den med `python -I -X utf8`, ellers går den ned på γ i Windows' konsol).
- `docs/kode/kosmos.md` (afsnittet om Rejsen i tid), `docs/kode/testadgang.md` (Kosmos), tjekliste B og F, `docs/erfaringer/fakta-faelder.md` og "Dybde i lag" (`docs/plan-lag.md`, kun reglerne).
- I koden: `side` øverst i `js/kosmos/tid.js` (Kort, emner, nørd og ærligt), `js/data/hvorfor.js` (formen på et "Hvorfor?"-kort), `js/data/ordbog.js` (formen på et ord) og `tests/tid.mjs` og `tests/lag.mjs` (hvordan siderne testes).

**Det, T2 har lavet (7. november 2026):**
- Tre mål (skyderen "Mål": Alpha Centauri, Mælkevejens centrum og Andromeda), skyderen "Fart" op til 14 ni-taller ("99,9…9 % (12 ni-taller)"), kontakten "1 g hele vejen" (skyderen "Fart" forsvinder) og kontakten "Set fra skibet" (scenen trykkes sammen med γ^(−1/3), tallet i "Lige nu" er det rigtige d/γ). Hver vej tager 12,5 sekunder på skærmen uanset målet.
- Hjemkomsten sammenligner med fortiden (`FORTIDEN` i `js/data/tid.js`), og over ca. 100 år for dig står "Så længe kan ingen leve". `tests/vaerktoejer/tid-tekster.mjs` skriver alle hjemkomster ud.
- Siden har i dag to emner ("Hvorfor går Jordens ur så hurtigt?" og "Hvad gør farten?"). T2 har allerede skrevet noget i "For nørder" (1 g og længdeforkortelsen kort) og "Ærligt talt" (brændstoffet, "Set fra skibet" og at skibet flytter sig jævnt med 1 g). Læs dem, og skriv dem om, så de passer med de nye emner (intet må stå to steder).

**Lavet efter T2 (8. november 2026, se `docs/lige-nu/tid.md`):** emnerne "Hurtigere end lyset? Nej!" (længdeforkortelsen, folder sig ud med "Set fra skibet") og "Fast fart eller 1 g?" (folder sig ud med 1 g), lysuret trin for trin med sin egen fart, målet som tre kontakter og skyderen "Fast fart". Emnet "Set fra skibet" i punkt 1 skal derfor ikke skrives: Byg videre på "Hurtigere end lyset? Nej!", og flyt ikke det samme ind et andet sted.

**T3 (se tjeklisten i planen):**
1. **Emnerne:** "Hvorfor ikke omvendt?" (tvillingeparadokset), "Set fra skibet" (længdeforkortelsen, med `kontakt: 'Set fra skibet'`, så emnet folder sig ud, når kontakten slås til), "Er det målt?" (myonerne, urene i flyene, GPS med et link til Rumtid, astronauterne og urene, der løftes 33 cm) og "Kunne man?" (energien, støvkornet, gassen i rummet og de ca. 11.500 g). Hold de to emner fra T1. Overvej et emne om 1 g ("Hvorfor tager det år med 1 g?"), eller læg det i "Kunne man?".
2. **"Hvorfor?"-kortet** i `js/data/hvorfor.js`, fx "Hvorfor kan intet nå lysets fart?" (fælden "man bliver tungere": sig "det kræver mere og mere energi").
3. **"For nørder":** formlen for γ og reglen om √10 for hvert 9-tal, formlerne for 1 g, tvillingeparadokset (omvejen giver *mindre* tid, rumtidens minus) og et par linjer om samtidighed.
4. **"Ærligt talt":** fælderne fra planen (de flyttes til `docs/erfaringer/fakta-faelder.md`, når teksterne er skrevet).
5. **Cæsiumuret:** "Hvad er et sekund?" i "Er det målt?" eller "For nørder" med en knap til cæsium i Det periodiske system (`gå('system:55', …)` eller det, `js/sideknap.js` bruger).
6. **Ordbogen:** *tidsforlængelse*, *længdeforkortelse* og *myon* er nye (højst 260 tegn hver). *Lysår* og *kosmisk stråling* findes allerede. Ordbogen deles med sporet Ordbogen og Det periodiske system: Skriv kun dine egne linjer på deres plads efter alfabetet.
7. `/faktatjek` af alle teksterne mod fakta-tid.md (over ca. 15 påstande: en Sonnet-hjælpeagent finder kilderne, Opus vurderer), og `/faerdig` til sidst.
8. **Tests:** teksterne og knapperne i lagene (som i `lag.mjs`), at emnet "Set fra skibet" folder sig ud med kontakten, og at knappen til cæsium virker. Kør `node tests/koer-alle.mjs --ændret`.

**Testene på Windows-pc'en:** Node.js og Playwright er installeret (7. november 2026). Kør med `$env:PLAYWRIGHT = "$env:USERPROFILE\atomlab-testvaerktoej\node_modules\playwright\index.mjs"` i PowerShell (se `docs/erfaringer/tests-og-vaerktoejer.md`).

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Tid og rum** (`docs/lige-nu/tid.md`). Du ejer `js/kosmos/tid.js`, `js/data/tid.js`, `tests/tid.mjs`, `tests/vaerktoejer/tid-tekster.mjs`, `docs/plan-tid.md`, `docs/fakta-tid.md` og `docs/lige-nu/tid.md`. Du deler `js/data/hvorfor.js`, `js/data/ordbog.js`, `style.css` (kun blokken "Rejsen i tid"), `docs/kode/kosmos.md`, `docs/kode/testadgang.md` og `tests/README.md`: Rør kun dine egne linjer. Rør ikke `js/faenomenskaerm.js` uden at spørge først. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves.

**Når T3 er færdig:** Skriv, hvordan næste session startes (DESIGN.md, "Når et punkt er færdigt"). Efter T3 venter T4 (udsigten fra cockpittet) på sit eget go, og artefaktet "AtomLab Overblik" opdateres, når serien er færdig.
