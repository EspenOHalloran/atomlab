---
name: faerdig
description: Gør et stykke arbejde i AtomLab færdigt med tests, skærmbilleder, dokumentation, commit og push. Brug den, før arbejdet kaldes færdigt, eller når brugeren skriver /faerdig.
---

# Færdig

Følg trinene i rækkefølge. Spring intet over uden at sige det til brugeren, og sig ærligt, hvad der ikke kunne lade sig gøre.

1. **Tjeklisten:** Læs og gå [tjekliste A](../../../docs/tjeklister/a-foer-faerdig.md) igennem, og også C, D, E eller F i `docs/tjeklister/`, hvis arbejdet passer til dem (læs dem, også selvom de blev læst, da arbejdet startede). Tjeklisterne står kun dér, så de ikke bliver kopieret og kommer ud af trit.
2. **Server:** Kører den ikke, så start `python3 -m http.server 8765` i projektmappen i baggrunden.
3. **De berørte tests:** Kør `node tests/koer-alle.mjs --ændret`, og ret fejlene. Lav nye tests eller nye tjek til nye funktioner.
4. **Se det med egne øjne:** Er layout eller grafik ændret, så tag billeder med `node tests/vaerktoejer/skaermbilleder.mjs <skærm>` (og `kloder.mjs` for Jorden og Månen). Billeder koster mange tokens, så kig kun på det, der er ændret, og i de størrelser, hvor det kan gå galt (se "Tests" under "Sådan arbejder vi" i DESIGN.md).
5. **Læs dit eget diff kritisk** (`git diff`): fejl, glemte rester, kode, der ikke bruges, danske navne og korte danske kommentarer som i resten af koden.
6. **Tests før merge:** Kør `node tests/koer-alle.mjs --ændret` i baggrunden (den vælger selv alle tests, hvis en fælles fil som `index.html`, `style.css`, `main.js` eller `scene3d.js` er ændret). Kør kun hele samlingen (`node tests/koer-alle.mjs`), når en ændring rører fælles moduler eller data, og `--ændret` ser ud til at vælge for lidt, som afslutning på en serie af opgaver og før et større mål. Se `docs/lige-nu.md`, og vent på resultatet i samme tur. Fejler en test kun sammen med andre, så find årsagen (tit en fast ventetid) i stedet for at kalde den ustabil.
7. **Dokumentation:** Opdater den rigtige fil i `docs/kode/` (filer, `gemte-data.md` og `testadgang.md`). Kommer der en ny fil i koden, så sæt den også ind i oversigten `docs/kode.md`. `CLAUDE.md` ændres kun, hvis en regel eller den korte oversigt ændres (den skal blive under ca. 15 KB). Sæt kryds i `DESIGN.md`, og opdater `README.md` og `tests/README.md`, hvis noget er nyt. Skriv nye erfaringer i den fil i `docs/erfaringer/`, hvor emnet hører til (oversigten er `docs/erfaringer.md`). Får en fejl en ny rodårsag, skal den også ind i `docs/erfaringer/rodaarsager.md` og en tjekliste i `docs/tjeklister/`. Nye fælder i fakta skrives i `docs/erfaringer/fakta-faelder.md`. Bliver en fil større end ca. 20 KB, så del den op efter emne.
8. **"Lige nu" i `docs/lige-nu.md`:** Skriv, hvad der senest er lavet, hvad der venter på et go, og hvilke spørgsmål der er åbne. Flyt det forrige "Senest lavet" øverst i `docs/arkiv/historik.md`, så "Lige nu" bliver under ca. 10 KB. Skriv det, der ikke er afprøvet, ind i den samlede liste `docs/ikke-afproevet.md` under det rigtige emne, og fjern det, brugeren har afprøvet. Skriv også beslutninger og svar fra samtalen ind, hvis de kun står i chatten. En ny session kan ikke se samtalen. Status for en færdig delopgave og brugte prompter flyttes fra planen til `docs/arkiv/`, når delopgaven er færdig.
9. **Commit og push:** Skriv beskeden på dansk, og slut med de linjer, systemet beder om (Co-Authored-By og Claude-Session). Skriv aldrig modelnavne i beskeden eller i koden. Push til `main`.
10. **Fortæl kort:** hvad der er lavet, testresultatet med tal, hvad der ikke er afprøvet (fx en rigtig tablet), og hvad der venter på et go.
