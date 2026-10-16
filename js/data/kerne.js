// Kernefysik til nørderne: bindingsenergi og størrelse.

// Målte bindingsenergier (MeV) for nogle vigtige kerner. Nøgle: "Z-A".
const MÅLT = {
  '1-2': 2.2246, '1-3': 8.4818, '2-3': 7.718, '2-4': 28.2957, '3-6': 31.994, '3-7': 39.245, '4-9': 58.165,
  '6-12': 92.1617, '6-13': 97.108, '6-14': 105.285, '7-14': 104.659, '8-16': 127.619, '26-56': 492.26,
  '28-62': 545.259, '82-208': 1636.43, '92-235': 1783.87, '92-238': 1801.69,
  // Stabile kerner fra calcium til krypton (her giver dråbemodellen for høje tal). Pr. nukleon fra AME2020, afrundet.
  '20-40': 342.04, '20-42': 361.91, '20-44': 380.95, '20-48': 415.97, '21-45': 387.86, '22-46': 398.18, '22-47':
  407.07, '22-48': 418.70, '22-49': 426.84, '22-50': 437.80, '23-51': 445.84, '24-50': 435.05, '24-52': 456.35,
  '24-53': 464.28, '24-54': 474.01, '25-55': 482.08, '26-54': 471.74, '26-57': 499.89, '26-58': 509.94, '27-59':
  517.31, '28-58': 506.46, '28-60': 526.86, '28-61': 534.67, '28-64': 561.73, '29-63': 551.38, '29-65': 569.20,
  '30-64': 559.10, '30-66': 578.16, '30-67': 585.18, '30-68': 595.41, '30-70': 611.10, '31-69': 602.02, '31-71':
  618.98, '32-70': 610.54, '32-72': 628.70, '32-73': 635.47, '32-74': 645.65, '34-80': 696.88, '35-79': 686.35,
  '36-84': 732.23,
};
const NIKKEL_62 = 545.259 / 62; // den højeste bindingsenergi pr. nukleon, der findes (ca. 8,79 MeV)

// Dråbemodellen (Weizsäckers formel): et godt gæt for mellemstore og tunge kerner.
// Konstanterne (Rohlf) er tilpasset med Z² i frastødningen. Med Z(Z−1) gav den ca. 0,08 MeV pr. nukleon for meget nær jern.
// Målt mod tabellen ovenfor: typisk inden for 0,07 MeV pr. nukleon fra calcium og op.
function dråbemodel(z, n) {
  const a = z + n;
  const aV = 15.75, aS = 17.8, aC = 0.711, aA = 23.7, aP = 11.18;
  let b = aV * a - aS * a ** (2 / 3) - (aC * z * z) / Math.cbrt(a) - (aA * (n - z) ** 2) / a;
  if (z % 2 === 0 && n % 2 === 0) b += aP / Math.sqrt(a);
  else if (z % 2 === 1 && n % 2 === 1) b -= aP / Math.sqrt(a);
  return b;
}

// { ialt, prNukleon, målt } eller null, hvis kernen er for lille eller ikke hænger sammen
export function bindingsenergi(z, n) {
  const a = z + n;
  if (a < 2 || z < 1) return null;
  const målt = MÅLT[`${z}-${a}`];
  if (målt) return { ialt: målt, prNukleon: målt / a, målt: true };
  if (a < 12) return null; // dråbemodellen passer dårligt til de helt lette kerner
  // Dråbemodellen kan give lidt for meget nær jern. Ingen kerne binder stærkere end nikkel-62.
  const b = Math.min(dråbemodel(z, n), NIKKEL_62 * a);
  if (b <= 0) return null;
  return { ialt: b, prNukleon: b / a, målt: false };
}

// Kernens radius i femtometer (1 fm = 10⁻¹⁵ m)
export function kerneRadiusFm(a) {
  if (a === 1) return 0.84; // protonens målte radius (formlen passer ikke for en enkelt proton)
  return 1.2 * Math.cbrt(a);
}
