// Uranus' ringe som tal (UN2 i docs/plan-uranus-neptun.md). Fra NSSDC's "Uranus Rings Fact Sheet" (opdateret
// 14. oktober 2015, docs/fakta-solsystemet/del6-uranus-og-neptun.md, afsnit 6): radius, bredde og optisk dybde τ.
// Ringene er smalle (1,5-96 km) og mørke som kul (de kaster ca. 1,5 % af lyset tilbage). Uden Three.js.
//
// - De 10 tætte ringe tegnes som Saturns (js/solsystem/ringe.js uden støv), men med en mørk farve.
// - Hvert punkt i teksturen får gennemsnittet af τ over sin bredde, så en ring, der er smallere end et punkt, stadig
//   har den rigtige samlede tæthed (τ gange bredde).
// - Epsilon-ringen er ikke helt rund (excentricitet 0,0079, 20-96 km bred): Her er den rund og 58 km bred (midten).
// - De to svage ydre ringe (ν og μ, τ langt under 0,01) kan ikke ses og tegnes ikke.
// - Støvet mellem ringene, som Voyager 2 så i modlys, er tegnet af os (NSSDC giver ingen tal): et tyndt lag med τ
//   STØV_TAU, lidt tættere inden for ring 6. Det tegnes som Jupiters ringe (støv, der spreder lyset fremad).

export const RING_IND = 38000; // km: tekstur og flade begynder (støvet inden for ring 6)
export const RING_UD = 52000; // km: lidt uden for epsilon-ringen
export const ALBEDO = 0.015; // NSSDC: ca. 15 · 10⁻³
export const STØV_TAU = 1e-3; // tegnet
export const STØV_ENHED = 1e-4; // støvets τ gemmes i tiendetusindedele i teksturen

// Radius (km, midten), bredde (km) og τ (NSSDC). Hvor NSSDC giver et interval, bruges midten.
export const RINGE = [
  { navn: '6', r: 41837, bred: 1.5, tau: 0.3 },
  { navn: '5', r: 42234, bred: 2, tau: 0.5 },
  { navn: '4', r: 42571, bred: 2, tau: 0.3 },
  { navn: 'Alfa', r: 44718, bred: 7, tau: 0.4 },
  { navn: 'Beta', r: 45661, bred: 8, tau: 0.3 },
  { navn: 'Eta', r: 47176, bred: 1.6, tau: 0.4 },
  { navn: 'Gamma', r: 47627, bred: 2.5, tau: 0.3 },
  { navn: 'Delta', r: 48300, bred: 5, tau: 0.5 },
  { navn: 'Lambda', r: 50024, bred: 2, tau: 0.1 },
  { navn: 'Epsilon', r: 51149, bred: 58, tau: 1.4 },
];
// De to svage ydre ringe (NSSDC: τ ≪ 0,01), kun til siden og testen
export const YDRE = [
  { navn: 'ν (R/2003 U 2)', r: 67300, bred: 3800 },
  { navn: 'μ (R/2003 U 1)', r: 97700, bred: 17000 },
];
// Uranus har 13 kendte ringe: de 12 i NSSDC's tabel og ζ-ringen (støvet inden for ring 6, opdaget af Voyager 2)
export const ANTAL = RINGE.length + YDRE.length + 1;

const glat = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// τ i gennemsnit fra a til b (km)
export function tauMellem(a, b) {
  let sum = 0;
  for (const g of RINGE) {
    const ind = g.r - g.bred / 2, ud = g.r + g.bred / 2;
    sum += g.tau * Math.max(0, Math.min(b, ud) - Math.max(a, ind));
  }
  return sum / (b - a);
}

// Støvets τ i afstanden r (km): tegnet, lidt tættere inden for ring 6 (ζ) og ud til lige uden for epsilon
export function støvVed(r) {
  if (r < RING_IND || r > RING_UD) return 0;
  return STØV_TAU * (0.6 + 0.8 * (1 - glat(39500, 41500, r))) * glat(RING_IND, 38800, r) * (1 - glat(51000, 51600, r));
}

const FARVE = [1, 1, 1.04]; // næsten gråt, ganges med ALBEDO (lys i ringe.js)
const STØV_FARVE = [1, 0.97, 0.94];

// De tætte ringe (til ringTekstur): n punkter fra RING_IND til RING_UD med τ i gennemsnit over hvert punkt
export function ringProfil(n = 8192) {
  const d = (RING_UD - RING_IND) / n;
  const ud = [];
  for (let i = 0; i < n; i++) ud.push({ tau: tauMellem(RING_IND + i * d, RING_IND + (i + 1) * d), farve: FARVE });
  return ud;
}

// Støvet (til ringTekstur): τ i STØV_ENHED
export function støvProfil(n = 1024) {
  const ud = [];
  for (let i = 0; i < n; i++) ud.push({ tau: støvVed(RING_IND + ((i + 0.5) / n) * (RING_UD - RING_IND)) / STØV_ENHED, farve: STØV_FARVE });
  return ud;
}
