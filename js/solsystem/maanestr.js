// Hvor stor en måne tegnes (fælles for Mars og Jupiter, docs/plan-jupiter.md afsnit 3).
// Ude i rummet ses en måne mindst SYNLIG (0,26°, 0,0045 rad) i radius, så den kan ses og trykkes på. Tæt på planeten
// eller ved en anden måne (nær = 1) tegnes den i sin rigtige størrelse, dog mindst `prik` pixel i radius, så en lille
// måne ikke forsvinder. Mellem 0 og 1 glider den fra den ene til den anden, så månen ikke hopper i størrelse.
// Giver det tal, månens krop skal skaleres med (mindst 1). Uden Three.js.

export const SYNLIG = 0.0045;

// afstand: fra kameraet til månen, rVerden: månens rigtige radius (begge i verdens enheder). kamera: fov (grader) og
// zoom. højde: 3D-billedets højde i pixel.
export function måneForstørrelse({ afstand, rVerden, nær, kamera, højde, prik = 0.8 }) {
  const pixel = (2 * Math.tan((kamera.fov * Math.PI) / 360)) / Math.max(1, højde) / (kamera.zoom ?? 1);
  const mindst = SYNLIG + (prik * pixel - SYNLIG) * nær;
  return Math.max(1, (afstand * mindst) / rVerden);
}
