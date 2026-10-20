// Skygger i rummet: Hvor stor en del af Solen er dækket af en kugle (Månen eller Jorden), set fra et punkt?
// Bruges af Formørkelser i Kosmos (panelet og himlen set fra Jorden). Den samme udregning står i GLSL i
// js/kosmos/jorden.js, så skyggerne på kuglerne passer med tallene. Punkter er [x, y, z].

const minus = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const længde = (a) => Math.hypot(a[0], a[1], a[2]);
const prik = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const kryds = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

// Arealet, hvor to cirkler overlapper (radier a og b, afstand c mellem centrene)
export function overlap(a, b, c) {
  if (c >= a + b) return 0;
  if (c <= Math.abs(a - b)) return Math.PI * Math.min(a, b) ** 2;
  const x = Math.acos(Math.min(1, Math.max(-1, (c * c + a * a - b * b) / (2 * c * a))));
  const y = Math.acos(Math.min(1, Math.max(-1, (c * c + b * b - a * a) / (2 * c * b))));
  return a * a * x + b * b * y - 0.5 * Math.sqrt(Math.max(0, (-c + a + b) * (c + a - b) * (c - a + b) * (c + a + b)));
}

// Hvordan Solen og en kugle ser ud fra punktet p: deres vinkelradier og vinklen mellem dem (radianer)
export function påHimlen(p, solPos, solR, pos, r) {
  const ds = minus(solPos, p), dm = minus(pos, p);
  const ls = længde(ds), lm = længde(dm);
  return {
    sol: Math.asin(Math.min(1, solR / ls)),
    kugle: Math.asin(Math.min(1, r / lm)),
    afstand: Math.atan2(længde(kryds(ds, dm)), prik(ds, dm)),
    foran: lm < ls, // kuglen er mellem punktet og Solen (ellers kan den ikke dække)
  };
}

// Andelen af Solens skive, der er dækket af kuglen (0 = intet, 1 = helt dækket), set fra punktet p
export function dækket(p, solPos, solR, pos, r) {
  if (r <= 0) return 0;
  const h = påHimlen(p, solPos, solR, pos, r);
  if (!h.foran) return 0;
  return overlap(h.sol, h.kugle, h.afstand) / (Math.PI * h.sol * h.sol);
}
