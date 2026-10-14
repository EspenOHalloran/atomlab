# AtomLab

Lær om atomer og grundstoffer i 3D: byg atomer af protoner, neutroner og elektroner, udforsk det periodiske system, og (snart) lav fusion og fission.

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
