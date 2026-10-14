// Kernefysik til nørderne: bindingsenergi og størrelse.

// Målte bindingsenergier (MeV) for nogle vigtige kerner. Nøgle: "Z-A".
const MÅLT = {
  '1-2': 2.2246, '1-3': 8.4818, '2-3': 7.718, '2-4': 28.2957, '3-6': 31.994, '3-7': 39.245, '4-9': 58.165,
  '6-12': 92.1617, '6-13': 97.108, '6-14': 105.285, '7-14': 104.659, '8-16': 127.619, '26-56': 492.254,
  '28-62': 545.259, '82-208': 1636.43, '92-235': 1783.87, '92-238': 1801.69,
};

// Dråbemodellen (Weizsäckers formel): et godt gæt for mellemstore og tunge kerner
function dråbemodel(z, n) {
  const a = z + n;
  const aV = 15.75, aS = 17.8, aC = 0.711, aA = 23.7, aP = 11.18;
  let b = aV * a - aS * a ** (2 / 3) - (aC * z * (z - 1)) / Math.cbrt(a) - (aA * (n - z) ** 2) / a;
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
  const b = dråbemodel(z, n);
  if (b <= 0) return null;
  return { ialt: b, prNukleon: b / a, målt: false };
}

// Kernens radius i femtometer (1 fm = 10⁻¹⁵ m)
export function kerneRadiusFm(a) {
  return 1.2 * Math.cbrt(a);
}
