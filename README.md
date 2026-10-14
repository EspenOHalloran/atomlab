# AtomLab

Lær om atomer og grundstoffer i 3D:

- **Atomværkstedet:** byg atomer af protoner, neutroner og elektroner, og se kerner henfalde
- **Det periodiske system:** alle 118 grundstoffer på en buet 3D-væg med fakta
- **Stjerneovnen:** fusion som i Solens kerne (pp-kæden) og carbon i røde kæmper
- **Reaktoren:** spalt uran og styr en kædereaktion
- **Batteriet:** se ioner og elektroner, når et LiPo-batteri lades op og aflades

**Prøv det:** https://espenohalloran.github.io/atomlab/

## Kør det på din egen computer
Programmet bruger JavaScript-moduler, så det virker ikke, hvis man bare dobbeltklikker på `index.html`. Start i stedet en lille webserver i mappen:

```
python -m http.server 8000
```

Åbn så http://localhost:8000 i browseren.

## Lavet med
- Ren HTML, CSS og JavaScript uden byggetrin
- [Three.js](https://threejs.org) 0.186.1 (MIT-licens, ligger i `lib/three/`)
