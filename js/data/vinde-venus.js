// Vindene i toppen af Venus' skyer (docs/plan-venus.md, V2). Uden Three.js, så det kan testes i Node.
//
// - Målt i Akatsukis billeder i ultraviolet lys (365 nm, 13.-19. august 2017) af billeder/solsystem/lav_venus_skyer.py:
//   to billeder med 1,5-3,5 timers mellemrum sammenlignet række for række (krydskorrelation), medianen over op til 42
//   par for hver bredde og så glattet over ±3°. Skyerne er regnet 70 km over jorden som i Akatsukis kort.
// - Tallene er m/s mod øst. De er negative: Skyerne kører mod vest, samme vej som Venus drejer (baglæns), bare ca. 60
//   gange hurtigere (fælde 11 i docs/fakta-solsystemet/del7-venus.md).
// - Det passer med Venus Express: ca. −105 ± 12 m/s fra ækvator til 45° S (Hueso m.fl. 2015, arXiv:2401.17046).
// - Fra 42° og mod polerne kunne vinden ikke måles i billederne (skyerne ses skråt og er trukket ud i striber). Dér
//   aftager den lineært til 0 ved polen, som Venus Express målte det (samme artikel: "decreases linearly with latitude
//   to null values at the South Pole").

// [bredde (grader), vind mod øst (m/s)] hver 2. grad
export const MÅLT = [
  [-42, -95], [-40, -97], [-38, -101], [-36, -102], [-34, -100], [-32, -102], [-30, -101], [-28, -103], [-26, -102],
  [-24, -102], [-22, -103], [-20, -104], [-18, -105], [-16, -105], [-14, -105], [-12, -105], [-10, -104], [-8, -104],
  [-6, -104], [-4, -104], [-2, -104], [0, -103], [2, -103], [4, -102], [6, -101], [8, -101], [10, -101], [12, -100],
  [14, -99], [16, -99], [18, -99], [20, -98], [22, -98], [24, -96], [26, -95], [28, -92], [30, -92], [32, -92],
  [34, -92], [36, -92], [38, -88], [40, -85], [42, -85],
];
export const SKY_HØJDE = 70; // km over Venus' radius (6.051,8 km), som i Akatsukis kort
const SYD = MÅLT[0], NORD = MÅLT[MÅLT.length - 1];

// Vinden mod øst (m/s) ved bredden phi (grader)
export function vindVed(phi) {
  if (phi <= SYD[0]) return (SYD[1] * Math.max(0, 90 + phi)) / (90 + SYD[0]);
  if (phi >= NORD[0]) return (NORD[1] * Math.max(0, 90 - phi)) / (90 - NORD[0]);
  const i = Math.min(MÅLT.length - 2, Math.floor((phi - SYD[0]) / 2));
  const [b0, u0] = MÅLT[i], [b1, u1] = MÅLT[i + 1];
  return u0 + ((u1 - u0) * (phi - b0)) / (b1 - b0);
}

// Hvor lang tid skyerne er om én omgang ved bredden phi (døgn)
export function omgang(phi, radius = 6051.8 + SKY_HØJDE) {
  return (2 * Math.PI * radius * 1000 * Math.cos((phi * Math.PI) / 180)) / Math.abs(vindVed(phi)) / 86400;
}
