// Tallene til Molekyler (Byttebørsen): ioniseringsenergi, elektronaffinitet, radier og energien for et ionpar.
// Uden Three.js, så det kan testes i Node (tests/molekyler.mjs). Kilderne står i docs/fakta-molekyler.md (afsnit 1 og 7).

// e²/(4πε₀) i eV·Å: to ladninger på ±1 i afstanden r Å trækker med energien KE / r eV
export const KE = 14.3996;
// 1 eV pr. atom eller par = 96,485 kJ/mol
export const KJ_PR_EV = 96.485;

// Grundstofferne i Byttebørsen.
// ie: ioniseringsenergi for 1., 2. … elektron (eV, NIST Handbook of Basic Atomic Spectroscopic Data).
// ea: elektronaffinitet for 1. og 2. elektron (eV, Wikipedia "Electron affinity (data page)"). Negativ = den koster.
// en: elektronegativitet (Pauling). radius: atomets radius (pm, Slater 1964). ion: ionens radius (pm, Shannon 1976, seks naboer).
// ladning: ionens ladning. skaller: elektronerne i skallerne for det neutrale atom.
export const STOFFER = {
  Li: { nr: 3, navn: 'Lithium', ie: [5.391719, 75.6400], ea: [0.618049], en: 0.98, radius: 145, ion: 76, ladning: 1, skaller: [2, 1] },
  Na: { nr: 11, navn: 'Natrium', ie: [5.139076, 47.2864], ea: [0.547926], en: 0.93, radius: 180, ion: 102, ladning: 1, skaller: [2, 8, 1] },
  Mg: { nr: 12, navn: 'Magnesium', ie: [7.646235, 15.03527], ea: [-0.4], en: 1.31, radius: 150, ion: 72, ladning: 2, skaller: [2, 8, 2] },
  Ca: { nr: 20, navn: 'Calcium', ie: [6.11316, 11.87172], ea: [0.02455], en: 1.00, radius: 180, ion: 100, ladning: 2, skaller: [2, 8, 8, 2] },
  O: { nr: 8, navn: 'Oxygen', ie: [13.61805], ea: [1.46111297, -7.71], en: 3.44, radius: 60, ion: 140, ladning: -2, skaller: [2, 6] },
  F: { nr: 9, navn: 'Fluor', ie: [17.4228], ea: [3.4011898], en: 3.98, radius: 50, ion: 133, ladning: -1, skaller: [2, 7] },
  Cl: { nr: 17, navn: 'Chlor', ie: [12.96763], ea: [3.612725], en: 3.16, radius: 100, ion: 181, ladning: -1, skaller: [2, 8, 7] },
};

// Det koster at tage n elektroner fra et atom (eV)
export function tagEnergi(symbol, n = 1) {
  return STOFFER[symbol].ie.slice(0, n).reduce((a, b) => a + b, 0);
}

// Det giver (positivt) eller koster (negativt) at give et atom n elektroner (eV)
export function giveEnergi(symbol, n = 1) {
  const ea = STOFFER[symbol].ea;
  if (n > ea.length) throw new Error(`Ingen elektronaffinitet for elektron nr. ${n} til ${symbol}`);
  return ea.slice(0, n).reduce((a, b) => a + b, 0);
}

// Parrene i Byttebørsen. M1a har kun natrium og chlor. Et par i gas: bindingslængde r0 (Å) og den energi, der skal til
// for at dele parret i to neutrale atomer (D, eV). NaCl: OpenStax University Physics 3, §9.1 (0,236 nm og 4,26 eV).
export const PAR = {
  nacl: { id: 'nacl', metal: 'Na', ikkemetal: 'Cl', navn: 'Natriumchlorid', formel: 'NaCl', hverdag: 'køkkensalt', r0: 2.36, D: 4.26 },
};

// Det koster at flytte én elektron fra metallet til ikkemetallet, når de er langt fra hinanden (eV).
// Na → Cl: 5,14 − 3,61 = 1,53 eV
export function flytEnergi(metal, ikkemetal) {
  return tagEnergi(metal) - giveEnergi(ikkemetal);
}

// Så tæt skal to atomer være, før tiltrækningen mellem +1 og −1 betaler for at flytte elektronen (Å): "harpunen"
export function harpunAfstand(metal, ikkemetal) {
  return KE / flytEnergi(metal, ikkemetal);
}

// Frastødningen, når ionernes elektronskyer rører hinanden: A·e^(−r/ρ) (Born-Mayer).
// A og ρ vælges, så parret ligger stille ved r0, og bindingen er D (fra neutrale atomer). Giver { A, rho }.
export function frastødning(par) {
  const bund = par.D + flytEnergi(par.metal, par.ikkemetal); // energien fra frie ioner ned til parret
  const træk = KE / par.r0; // tiltrækningen ved r0
  // I bunden er kræfterne lige store: KE/r0² = (A/ρ)·e^(−r0/ρ), og energien er −KE/r0 + A·e^(−r0/ρ) = −bund
  const frastødVedR0 = træk - bund; // A·e^(−r0/ρ)
  const rho = frastødVedR0 * par.r0 * par.r0 / KE;
  return { A: frastødVedR0 * Math.exp(par.r0 / rho), rho };
}

// Energien for Na⁺ og Cl⁻ i afstanden r (Å) i forhold til de samme ioner langt fra hinanden (eV, negativ = bundet)
export function ionparEnergi(par, r) {
  const { A, rho } = frastødning(par);
  return -KE / r + A * Math.exp(-r / rho);
}

// Kraften mellem ionerne (eV/Å, positiv = de trækker i hinanden)
export function ionparKraft(par, r) {
  const { A, rho } = frastødning(par);
  return KE / (r * r) - (A / rho) * Math.exp(-r / rho);
}

// Regnskabet i Byttebørsen (eV, positivt = gevinst). elektron: 'hjemme' (hos metallet), 'fri' (trukket væk) eller
// 'flyttet' (hos ikkemetallet). r: afstanden mellem atomerne (Å).
// Giver { tage, give, træk, iAlt }: tage ≤ 0 (det koster at tage elektronen), give > 0 (ikkemetallet giver noget tilbage)
// og træk (plus og minus trækker i hinanden, og skyerne skubber helt tæt på).
export function regnskab(par, elektron, r) {
  const tage = elektron === 'hjemme' ? 0 : -tagEnergi(par.metal);
  const give = elektron === 'flyttet' ? giveEnergi(par.ikkemetal) : 0;
  const træk = elektron === 'flyttet' ? -ionparEnergi(par, r) : 0;
  return { tage, give, træk, iAlt: tage + give + træk };
}

// Ionens radius i forhold til atomets (Na⁺ bliver ca. halvt så stor, Cl⁻ ca. dobbelt så stor)
export function størrelsesForhold(symbol) {
  const s = STOFFER[symbol];
  return s.ion / s.radius;
}

// Skallerne for ionen: metallet mister den yderste skal, ikkemetallet fylder den op
export function ionSkaller(symbol) {
  const s = STOFFER[symbol];
  const skaller = [...s.skaller];
  if (s.ladning > 0) {
    skaller[skaller.length - 1] -= s.ladning;
    if (skaller[skaller.length - 1] === 0) skaller.pop();
  } else {
    skaller[skaller.length - 1] -= s.ladning;
  }
  return skaller;
}

// Bytter to atomer elektroner? Kun når det ene trækker meget hårdere i elektronerne (forskellen i elektronegativitet).
// Grænsen ca. 1,7 er en tommelfingerregel (fakta-molekyler.md, afsnit 2). Na + Na: forskellen er 0, så de bytter ikke.
export function bytter(a, b) {
  return Math.abs(STOFFER[a].en - STOFFER[b].en) >= 1.7;
}
