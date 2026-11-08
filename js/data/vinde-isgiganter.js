// Vindene på Uranus og Neptun (docs/plan-uranus-neptun.md, UN1). Formlerne er tilpasset målinger af skyernes fart
// (docs/fakta-solsystemet/del6-uranus-og-neptun.md, afsnit 4). Uden Three.js, så det kan testes i Node.
//
// Alle tal er m/s "med drejningen" (positiv: vinden blæser samme vej, som planeten drejer, negativ: mod drejningen),
// og bredden er planetografisk (grader).
// - Neptun (Voyager 2, Sromovsky m.fl. 1993, gengivet i Fitzpatrick m.fl. 2014, tabel 1, arXiv:1312.2676):
//   u = −398 + 0,188 φ² − 1,2 · 10⁻⁵ φ⁴. Neptun drejer mod øst, så "med drejningen" er mod øst.
// - Uranus (Sromovsky og Fry 2005, den symmetriske tilpasning, figur 6 i arXiv:1503.03714):
//   u = 27,46 + 36,568 cos φ − 175,486 cos 3φ. Fælden: Uranus drejer baglæns i IAU's retninger, så IAU's "vestlig"
//   vind er med drejningen. Her bruges kun "med drejningen", og koden vender den efter planetens retning.
// - Tæt på polerne er vindene ikke målt (og formlerne giver en vinkelfart, der vokser mod uendelig ved polen). Fra
//   POL_FRA til 90° tones de ned til 0, og det står i "Ærligt talt".

const RAD = Math.PI / 180;
export const POL_FRA = 75;
export const POL_TIL = 88;

const dæmp = (phi) => {
  const t = Math.min(1, Math.max(0, (Math.abs(phi) - POL_FRA) / (POL_TIL - POL_FRA)));
  return 1 - t * t * (3 - 2 * t);
};

export function neptunRå(phi) {
  return -398 + 0.188 * phi * phi - 1.2e-5 * phi ** 4;
}
export function uranusRå(phi) {
  return 27.46 + 36.568 * Math.cos(phi * RAD) - 175.486 * Math.cos(3 * phi * RAD);
}

// Vinden med drejningen (m/s) ved den planetografiske bredde phi, dæmpet mod polerne
export function vindVed(navn, phi) {
  return (navn === 'uranus' ? uranusRå(phi) : neptunRå(phi)) * dæmp(phi);
}
