---
name: faerdig
description: Gør et stykke arbejde i AtomLab færdigt med tests, skærmbilleder, dokumentation, commit og push. Brug den, før arbejdet kaldes færdigt, eller når brugeren skriver /faerdig.
---

# Færdig

Følg trinene i rækkefølge. Spring intet over uden at sige det til brugeren, og sig ærligt, hvad der ikke kunne lade sig gøre.

1. **Tjeklisten:** Gå tjekliste A i `docs/erfaringer.md` igennem, og også C, D, E eller F, hvis arbejdet passer til dem. Tjeklisterne står kun dér, så de ikke bliver kopieret og kommer ud af trit.
2. **Server:** Kører den ikke, så start `python3 -m http.server 8765` i projektmappen i baggrunden.
3. **De berørte tests:** Kør `node tests/koer-alle.mjs --ændret`, og ret fejlene. Lav nye tests eller nye tjek til nye funktioner.
4. **Se det med egne øjne:** Er layout eller grafik ændret, så tag billeder med `node tests/vaerktoejer/skaermbilleder.mjs <skærm>` (og `kloder.mjs` for Jorden og Månen). Billeder koster mange tokens, så kig kun på det, der er ændret, og i de størrelser, hvor det kan gå galt (se "Tests" under "Sådan arbejder vi" i DESIGN.md).
5. **Læs dit eget diff kritisk** (`git diff`): fejl, glemte rester, kode, der ikke bruges, danske navne og korte danske kommentarer som i resten af koden.
6. **Tests før merge:** Kør `node tests/koer-alle.mjs --ændret` i baggrunden (den vælger selv alle tests, hvis en fælles fil som `index.html`, `style.css`, `main.js` eller `scene3d.js` er ændret). Kør kun hele samlingen (`node tests/koer-alle.mjs`), når en ændring rører fælles moduler eller data, og `--ændret` ser ud til at vælge for lidt, som afslutning på en serie af opgaver og før et større mål. Se DESIGN.md, "Lige nu", og vent på resultatet i samme tur. Fejler en test kun sammen med andre, så find årsagen (tit en fast ventetid) i stedet for at kalde den ustabil.
7. **Dokumentation:** Opdater `CLAUDE.md` (filer og gemte data), sæt kryds i `DESIGN.md`, og opdater `README.md` og `tests/README.md`, hvis noget er nyt. Skriv nye erfaringer i `docs/erfaringer.md`. Får en fejl en ny rodårsag, skal den også ind i en tjekliste.
8. **"Lige nu" øverst i DESIGN.md:** Skriv, hvad der senest er lavet, hvad der venter på et go, hvilke spørgsmål der er åbne, og hvad der ikke er afprøvet. Skriv også beslutninger og svar fra samtalen ind, hvis de kun står i chatten. En ny session kan ikke se samtalen.
9. **Commit og push:** Skriv beskeden på dansk, og slut med de linjer, systemet beder om (Co-Authored-By og Claude-Session). Skriv aldrig modelnavne i beskeden eller i koden. Push til `main`.
10. **Fortæl kort:** hvad der er lavet, testresultatet med tal, hvad der ikke er afprøvet (fx en rigtig tablet), og hvad der venter på et go.
