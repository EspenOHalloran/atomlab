// Saturns ringe som tal: hvor tætte de er (optisk dybde τ) og deres farve i hver afstand fra Saturn.
// Grænserne er fra docs/fakta-solsystemet.md (PDS Ring-Moon Systems Node). τ er omtrentlig: under 0,01 i D-ringen,
// ca. 0,1 i C-ringen og Cassini-delingen, 1-5 i B-ringen og ca. 0,5 i A-ringen. Tegnes af js/solsystem/ringe.js og testes i tests/saturn.mjs.

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

const glat = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// Fast "tilfældig" bølge, så ringene får mange tynde ringe i sig (de samme hver gang)
const ringlets = (r, styrke) => 1 + styrke * (0.5 * Math.sin(r * 0.0041 + 1.3) + 0.3 * Math.sin(r * 0.0127 + 0.4) + 0.2 * Math.sin(r * 0.0391 + 2.1));

// Optisk dybde og farve i afstanden r (km). Testes i tests/saturn.mjs.
export function ringVed(r) {
  for (const m of MELLEMRUM) if (r >= m.ind && r <= m.ud) return { tau: 0, farve: [0, 0, 0] };
  if (r < 66900 || r > 140270 || (r > 136775 && r < 140130)) return { tau: 0, farve: [0, 0, 0] };
  if (r < 74490) return { tau: 0.004 * ringlets(r, 0.6), farve: [0.5, 0.47, 0.45] }; // D
  if (r < 91975) { // C: tynd, med lysere "plateauer" yderst
    const plateau = 0.25 * glat(84000, 85000, r) * (1 - glat(86500, 87500, r)) + 0.2 * glat(88500, 89000, r) * (1 - glat(90200, 90700, r));
    return { tau: (0.08 + plateau) * ringlets(r, 0.35), farve: [0.6, 0.53, 0.46] };
  }
  if (r < 117570) { // B: den tætteste, næsten uigennemsigtig midt i
    const tau = 0.9 + 2.6 * glat(92500, 100000, r) - 1.2 * glat(114500, 117570, r);
    return { tau: tau * ringlets(r, 0.3), farve: [0.88, 0.79, 0.64] };
  }
  if (r < 122170) return { tau: (0.08 + 0.1 * glat(120500, 122170, r)) * ringlets(r, 0.5), farve: [0.56, 0.51, 0.46] }; // Cassini-delingen
  if (r < 136775) { // A: tættest inderst
    const tau = 0.75 - 0.3 * glat(124000, 136000, r);
    return { tau: tau * ringlets(r, 0.25), farve: [0.8, 0.75, 0.68] };
  }
  return { tau: 0.4, farve: [0.78, 0.76, 0.74] }; // F
}
