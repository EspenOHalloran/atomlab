// Saturns ringe som tal: hvor tætte de er (optisk dybde τ) og deres farve i hver afstand fra Saturn.
// Grænserne er fra docs/fakta-solsystemet.md (PDS Ring-Moon Systems Node). τ er målt af Cassini (UVIS), da stjernen
// β Centauri skinnede gennem ringene (Rev 78, 2008, se js/data/ringe-tau.js og billeder/solsystem/lav_ringe.py).
// D-ringen er for tynd til målingen og er tegnet. Tegnes af js/solsystem/ringe.js og testes i tests/saturn.mjs.
import { TAU_N, TAU_B64 } from './ringe-tau.js';

export const RING_IND = 66900; // km fra Saturns centrum (D-ringens inderkant)
export const RING_UD = 141000; // lidt uden for F-ringen

// Ringene og mellemrummene (km fra Saturns centrum)
export const RINGE = [
  { navn: 'D-ringen', ind: 66900, ud: 74490 },
  { navn: 'C-ringen', ind: 74490, ud: 91975 },
  { navn: 'B-ringen', ind: 91975, ud: 117570 },
  { navn: 'Cassini-delingen', ind: 117570, ud: 122170 },
  { navn: 'A-ringen', ind: 122170, ud: 136775 },
  { navn: 'F-ringen', ind: 140130, ud: 140270 },
];
export const MELLEMRUM = [
  { navn: 'Encke-mellemrummet', ind: 133423, ud: 133745 }, // månen Pan kredser i det
  { navn: 'Keeler-mellemrummet', ind: 136485, ud: 136527 },
];

// Fast "tilfældig" bølge, så den tegnede D-ring får nogle tynde ringe i sig (de samme hver gang)
const ringlets = (r, styrke) => 1 + styrke * (0.5 * Math.sin(r * 0.0041 + 1.3) + 0.3 * Math.sin(r * 0.0127 + 0.4) + 0.2 * Math.sin(r * 0.0391 + 2.1));

// Den målte τ, pakket ud første gang den bruges (atob findes både i browseren og i Node)
let målt = null;
function måltTau() {
  if (målt) return målt;
  const bytes = Uint8Array.from(atob(TAU_B64), (c) => c.charCodeAt(0));
  const dv = new DataView(bytes.buffer);
  målt = new Float32Array(TAU_N);
  for (let i = 0; i < TAU_N; i++) målt[i] = dv.getUint16(i * 2, true) / 10000;
  return målt;
}
// τ i afstanden r (km) fra målingen, lineært mellem punkterne
function tauMålt(r) {
  const t = måltTau();
  const x = ((r - RING_IND) / (RING_UD - RING_IND)) * TAU_N - 0.5;
  const i = Math.max(0, Math.min(TAU_N - 2, Math.floor(x)));
  const f = Math.max(0, Math.min(1, x - i));
  return t[i] * (1 - f) + t[i + 1] * f;
}

// Farven i hver ring (bruges kun, hvis ringbilledets farver ikke er hentet)
const FARVE = { D: [0.5, 0.47, 0.45], C: [0.6, 0.53, 0.46], B: [0.88, 0.79, 0.64], CD: [0.56, 0.51, 0.46], A: [0.8, 0.75, 0.68], F: [0.78, 0.76, 0.74] };

// Optisk dybde og farve i afstanden r (km). Testes i tests/saturn.mjs.
export function ringVed(r) {
  for (const m of MELLEMRUM) if (r >= m.ind && r <= m.ud) return { tau: 0, farve: [0, 0, 0] };
  if (r < RING_IND || r > RING_UD) return { tau: 0, farve: [0, 0, 0] };
  if (r < 74490) return { tau: 0.004 * ringlets(r, 0.6), farve: FARVE.D }; // D: tegnet (under det, målingen kan se)
  const farve = r < 91975 ? FARVE.C : r < 117570 ? FARVE.B : r < 122170 ? FARVE.CD : r < 136775 ? FARVE.A : FARVE.F;
  return { tau: tauMålt(r), farve };
}

// Alle punkterne (til teksturen): τ og farve i n punkter fra RING_IND til RING_UD
export function ringProfil(n = TAU_N) {
  const ud = [];
  for (let i = 0; i < n; i++) ud.push(ringVed(RING_IND + ((i + 0.5) / n) * (RING_UD - RING_IND)));
  return ud;
}
export { TAU_N };
