# AtomLab

Lær om atomer og grundstoffer i 3D:

- **Atomværkstedet:** byg atomer af protoner, neutroner og elektroner, og se kerner henfalde
- **Det periodiske system:** alle 118 grundstoffer på en buet 3D-væg med fakta, og et kort for hver kategori med et lille atom, der viser hvorfor, og et animeret forsøg (fx alkalimetal i vand)
- **Stjerneovnen:** fusion som i Solens kerne (pp-kæden) og carbon i røde kæmper
- **Reaktoren:** spalt uran og styr en kædereaktion
- **Batteriet:** se ioner og elektroner, når et lithium-ion-batteri (her et LiPo-batteri) lades op og aflades
- **Kosmos:** 16 fænomener, der fortæller en historie: Big Bang, en ny stjerne, Jorden og årstiderne, sol- og måneformørkelser, solstorme, Saturn og dens måner (med en flyby), Solens fremtid, en hvid dværg, der eksploderer, supernovaer, pulsarer, kilonovaer, rumtid, tyngdebølger, sorte huller, kvasarer og ormehuller

Fagord (neutrino, isotop, plasma …) har prikker under og kan trykkes på for en kort forklaring.

**Prøv det:** https://espenohalloran.github.io/atomlab/

## Kør det på din egen computer
Programmet bruger JavaScript-moduler, så det virker ikke, hvis man bare dobbeltklikker på `index.html`. Start i stedet en lille webserver i mappen:

```
python -m http.server 8000
```

Åbn så http://localhost:8000 i browseren.

## Automatiske tests
Der er automatiske tests i [tests/](tests/README.md). De kører med `node tests/koer-alle.mjs` (ca. 10 minutter) og kræver Node.js, Playwright og Python.

## Lavet med
- Ren HTML, CSS og JavaScript uden byggetrin
- [Three.js](https://threejs.org) 0.186.1 (MIT-licens, ligger i `lib/three/`)
- Billeder af Jorden og Månen fra NASA (Blue Marble, Black Marble og Lunar Reconnaissance Orbiter, public domain). Se [billeder/solsystem/KILDER.md](billeder/solsystem/KILDER.md)
- Kortet over land og hav er lavet med [global-land-mask](https://github.com/toddkarin/global-land-mask) (MIT-licens) ud fra data fra NOAA

## Ophavsret
© 2026 Espen O'Halloran. Alle rettigheder forbeholdes.

Du må gerne bruge AtomLab i undervisningen og dele linket. Three.js, landkortet og NASA's billeder har deres egne licenser. Se [LICENSE](LICENSE).
