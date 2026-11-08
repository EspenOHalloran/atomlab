// Neptuns vejr (UN3 i docs/plan-uranus-neptun.md): de høje skyer, pletterne fra 1989 og Voyagers farver. Uden Three.js.
// Kilder (docs/fakta-solsystemet/del6-uranus-og-neptun.md, afsnit 5): Voyager 2's billedtekster i NASA's Photojournal
// (PIA00045, PIA00046, PIA00051, PIA00052, PIA00058, PIA00064, PIA02245) og Wikipedias "Great Dark Spot" og "Neptune".
//
// Hvad der er målt, og hvad der er tegnet:
// - De høje skyer er metan-is ca. 50 km over skylaget, og de kaster skygger, der er blålige (PIA00058, 29° N). Bredden
//   er 50-200 km. Hvor båndene af skyer står, er valgt efter Voyagers billeder (25-29° N, ved pletten 22° S) og tegnet
//   ved 45° S og 70° S. Hver sky er tegnet af shaderen, og skyerne ændrer sig ikke (de rigtige skifter på få timer).
// - I 2025 var der få skyer på Neptun (de forsvandt næsten i 2019, Chavez m.fl. 2023, arXiv:2307.06462). Derfor er
//   båndene tyndere uden kontakten "Neptun i 1989".
// - Den Store Mørke Plet: 22° S, 13.000 × 6.600 km, kom rundt på 18,3 timer, drejede mod uret, med en lys sky ved den
//   sydlige kant på ca. 1.000 km (PIA00046, PIA02245, PIA00052). Dark Spot 2 (D2): 54° S, 16,1 timer, lys midte, drejede
//   med uret (PIA00046, PIA00064). Størrelsen af D2 og Scooter er tegnet. Scooter vandt ca. 30° mod øst for hver
//   omgang i forhold til pletten (PIA02245), så den kom rundt på ca. 17 timer. Bredden (ca. 42° S) er ret sikker.
// - Hvor hurtigt pletterne drejer om sig selv, er tegnet.

import { neptunRå } from './vinde-isgiganter.js';

export const NEPTUN_DØGN = 16.11; // timer (NSSDC)
export const SKY_HØJDE = 50; // km over skylaget (PIA00058: "of the order of 50 kilometers")

// Båndene: midten (planetografisk bredde), den halve bredde (grader) og hvor meget af båndet der er skyer i 2025 og 1989
export const BÅND = [
  { bredde: 27, halv: 3, nu: 0.2, år1989: 0.45 },
  { bredde: -22, halv: 4, nu: 0.1, år1989: 0.38 },
  { bredde: -45, halv: 3, nu: 0.08, år1989: 0.25 },
  { bredde: -70, halv: 3, nu: 0.25, år1989: 0.35 },
];

// Pletterne i 1989. længde: hvor de står ved start (østlig længde, valgt, så de står tæt, som på Voyagers berømte
// billede PIA00049). omgang: hvor lang tid de var om at komme rundt (timer). spin: omgange pr. døgn om sig selv (tegnet,
// + er mod uret set udefra). mørk, midt (lys midte) og syd (lys sky ved den sydlige kant): 0 til 1.
export const PLETTER = [
  { navn: 'Den Store Mørke Plet', bredde: -22, længde: 0, km: [13000, 6600], omgang: 18.3, spin: 0.15, mørk: 1, midt: 0, syd: 1 },
  { navn: 'Scooter', bredde: -42, længde: 18, km: [2400, 1300], omgang: 16.9, spin: 0, mørk: 0, midt: 1, syd: 0 },
  { navn: 'Dark Spot 2', bredde: -54, længde: 8, km: [4000, 2600], omgang: 16.1, spin: -0.3, mørk: 0.85, midt: 0.8, syd: 0 },
];

// Hvor hurtigt en plet flytter sig mod øst i forhold til Neptuns døgn (omgange pr. time i virkeligheden)
export const pletFart = (p) => 1 / p.omgang - 1 / NEPTUN_DØGN;

// Det samme regnet fra vindformlen ved pletternes bredde (til testen: pletterne følger nogenlunde vinden)
export function vindOmgang(p, radiusKm = 24764) {
  const omkreds = 2 * Math.PI * radiusKm * Math.cos((p.bredde * Math.PI) / 180);
  return 1 / (1 / NEPTUN_DØGN + (neptunRå(p.bredde) * 3.6) / omkreds);
}

// Voyagers farver: Solar System Scopes kort af Neptun (lavet af Voyagers forstærkede billeder) har middelfarven
// (0,046, 0,148, 0,565) i lineært lys mellem 54° N og 54° S, vores kort (0,223, 0,540, 0,751). Kontrasten er ca. 3 gange
// større (målt 8. november 2026). Omregningen: gain · (midt + (farve − midt) · kontrast).
export const VOYAGER = {
  gain: [0.046 / 0.223, 0.148 / 0.54, 0.565 / 0.751],
  midt: [0.223, 0.54, 0.751],
  kontrast: 3,
};

// Pilene (kontakten "Vindene"): én række for hver 10° fra 70° S til 70° N, undtagen hvor det næsten er stille (omkring
// ±50°). Længden efter farten: 0,05° pr. m/s (400 m/s giver 20°, ca. 8.600 km ved ækvator).
export function pileBredder() {
  const ud = [];
  for (let b = -70; b <= 70; b += 10) {
    const v = neptunRå(b);
    if (Math.abs(v) >= 40) ud.push({ bredde: b, vind: v, længde: Math.abs(v) * 0.05 });
  }
  return ud;
}
