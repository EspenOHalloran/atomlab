// Tallene bag Solens tegning i Solsystemet (js/kosmos/solen.js). Uden Three.js, så de kan testes i Node.

// Den mørke rand (limb darkening): I(μ) = 1 − u · (1 − μ), hvor μ er cosinus til vinklen mellem synslinjen og overfladens
// lodlinje (1 midt på skiven, 0 helt ude ved kanten). Blåt lys bliver mørkere mod kanten end rødt, så kanten bliver orange.
// I synligt lys (grønt, ca. 550 nm) giver u = 0,6 en kant, der er 40 % så lys som midten. Modellen med to led (Wikipedia
// "Limb darkening", 550 nm) giver ca. 30 %, så siden skriver "ca. 30-40 %". Rødt og blåt er sat lidt under og over.
export const RAND_U = [0.5, 0.6, 0.75]; // rød, grøn, blå
export const randLys = (mu, u) => 1 - u * (1 - mu);

// Solen drejer hurtigst ved ækvator. Formen ω(φ) = A + B sin²φ + C sin⁴φ er fra Snodgrass og Ulrich (1990). A og A + B + C
// er sat, så det passer med siden: ca. 25 døgn ved ækvator og ca. 36 ved polerne. Deres egne tal (14,71 − 2,39 sin²φ
// − 1,78 sin⁴φ grader pr. døgn set fra stjernerne, ApJ 351, 309) giver ca. 24,5 og 34 døgn.
export const DØGN_ÆKVATOR = 25;
export const DØGN_POL = 36;
const A = 360 / DØGN_ÆKVATOR; // grader pr. døgn
const REST = 360 / DØGN_POL - A;
const B = (REST * 2.396) / (2.396 + 1.787);
const C = REST - B;
export function drejetid(breddeGrader) {
  const s2 = Math.sin((breddeGrader * Math.PI) / 180) ** 2;
  return 360 / (A + B * s2 + C * s2 * s2);
}
// Hvor hurtigt en plet ved breddegraden drejer i forhold til ækvator (1 ved ækvator, mindre mod polerne)
export const drejFart = (breddeGrader) => DØGN_ÆKVATOR / drejetid(breddeGrader);

// Solpletterne kommer i grupper ved ca. 5-35° nord og syd for ækvator. Den forreste plet (i drejningens retning) er den
// største og ligger lidt tættere på ækvator. En gruppe vokser, lever et stykke tid og forsvinder, og så kommer den igen et
// andet sted (liv i sekunder i animationen, hvor én omgang ved ækvator er ca. 209 sekunder).
// Hver plet: [længde i forhold til gruppen (°), bredde i forhold til gruppen (°), radius (°)]. 1° på Solen er ca. 12.000 km,
// så de største her er ca. 90.000 km brede (med lys kant). Det er store pletter. De fleste rigtige pletter er mindre.
export const GRUPPER = [
  { bredde: 14, længde: 20, liv: 620, fase: 0.35, pletter: [[0, -1, 3.7], [-9, 1, 2.5], [-5, 0.5, 1.3]] },
  { bredde: -18, længde: 115, liv: 760, fase: 0.6, pletter: [[0, 1, 3.0], [-7.5, -1, 2.0]] },
  { bredde: 26, længde: 205, liv: 540, fase: 0.1, pletter: [[0, 0, 2.3]] },
  { bredde: -9, længde: 290, liv: 880, fase: 0.8, pletter: [[0, 0.5, 2.6], [-8, -0.5, 1.8], [-4, 0, 1.1]] },
];
export const ANTAL_PLETTER = GRUPPER.reduce((s, g) => s + g.pletter.length, 0);

// Hvor stor en gruppe er i sit liv (0-1): vokser hurtigt, lever og svinder langsomt
export function livKurve(x) {
  const op = Math.min(1, x / 0.15);
  const ned = x < 0.6 ? 1 : Math.max(0, 1 - (x - 0.6) / 0.4);
  return op * op * (3 - 2 * op) * ned * ned * (3 - 2 * ned);
}
// Gruppens tilstand ved tiden t (sekunder i animationen): hvor stor den er, og hvor den ligger lige nu.
// Hver gang den kommer igen, ligger den et nyt sted (gyldne vinkel, så de ikke klumper sig).
export function gruppeNu(g, t) {
  const x = t / g.liv + g.fase;
  const gang = Math.floor(x);
  return { størrelse: livKurve(x - gang), længde: g.længde + gang * 137.5, bredde: g.bredde };
}
