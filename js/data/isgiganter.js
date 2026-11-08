// Uranus og Neptun som tal (docs/plan-uranus-neptun.md, UN1): formen, døgnet, polens retning og banen, så Solens
// retning set fra planeten kan regnes for enhver dato. Uden Three.js, så det kan testes i Node (tests/isgiganter.mjs).
// Tallene står i docs/fakta-solsystemet/del6-uranus-og-neptun.md.
//
// - Form og døgn: NSSDC (radius ved 1 bar). Uranus drejer "baglæns": om IAU's nordpol drejer den med uret (NSSDC
//   skriver døgnet som −17,24 t). retning = +1 er mod uret set fra IAU's nordpol, −1 med uret.
// - Nordpolen (IAU, NSSDC): rektascension og deklination i ækvatorets retninger (J2000). Neptuns pol svinger lidt (N).
// - Banen: JPL's korte formler ("Approximate Positions of the Planets", tabel 1, 1800-2050, ssd.jpl.nasa.gov).
//   Skyderen "År" (UN2) går til 2070, lidt uden for tabellen (fejlen er stadig under ca. 0,1°).
// - Retningerne i programmet er ekliptikkens (som Jorden i jordkloden.js): y mod ekliptikkens nordpol, z mod
//   forårspunktet og x mod ekliptisk længde 90°.

const RAD = Math.PI / 180;
const ε = 23.4392911 * RAD; // ekliptikkens hældning (J2000)

export const PLANETER = {
  uranus: {
    radius: 25559, polRadius: 24973, døgnTimer: 17.24, retning: -1, hældning: 97.77,
    pol: () => ({ ra: 257.311, dec: -15.175 }),
    // a (AU), e, I, L, ϖ (længde af perihel), Ω (knude), og ændringen pr. århundrede (JPL, tabel 1)
    bane: [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503],
    rate: [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589],
  },
  neptun: {
    radius: 24764, polRadius: 24341, døgnTimer: 16.11, retning: 1, hældning: 28.32,
    pol: (T) => {
      const N = (357.85 + 52.316 * T) * RAD;
      return { ra: 299.36 + 0.7 * Math.sin(N), dec: 43.46 - 0.51 * Math.cos(N) };
    },
    bane: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574],
    rate: [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664],
  },
};

// Julianske århundreder siden J2000 (1. januar 2000 kl. 12 TT, regnet som UT: forskellen er under et minut)
export function århundreder(dato) {
  return (dato.getTime() - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525;
}

// Fra ekliptikkens retninger (X mod forårspunktet, Z mod nordpolen) til programmets (x, y, z) = (Y, Z, X)
const tilProgram = ([X, Y, Z]) => [Y, Z, X];

// Planetens plads om Solen (AU) i ekliptikkens retninger (X, Y, Z)
export function plads(navn, dato) {
  const p = PLANETER[navn];
  const T = århundreder(dato);
  const [a, e, I, L, ϖ, Ω] = p.bane.map((v, i) => v + p.rate[i] * T);
  const ω = (ϖ - Ω) * RAD;
  let M = ((L - ϖ) % 360) * RAD;
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 8; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cO = Math.cos(Ω * RAD), sO = Math.sin(Ω * RAD), cw = Math.cos(ω), sw = Math.sin(ω), cI = Math.cos(I * RAD), sI = Math.sin(I * RAD);
  return [
    (cw * cO - sw * sO * cI) * x + (-sw * cO - cw * sO * cI) * y,
    (cw * sO + sw * cO * cI) * x + (-sw * sO + cw * cO * cI) * y,
    sw * sI * x + cw * sI * y,
  ];
}

// En retning givet ved rektascension og deklination (grader) i ekliptikkens retninger
function fraÆkvator(ra, dec) {
  const x = Math.cos(dec * RAD) * Math.cos(ra * RAD), y = Math.cos(dec * RAD) * Math.sin(ra * RAD), z = Math.sin(dec * RAD);
  return [x, Math.cos(ε) * y + Math.sin(ε) * z, -Math.sin(ε) * y + Math.cos(ε) * z];
}

// IAU's nordpol i programmets retninger (enhedsvektor)
export function pol(navn, dato) {
  const { ra, dec } = PLANETER[navn].pol(århundreder(dato));
  return tilProgram(fraÆkvator(ra, dec));
}

// Knuden Q mellem planetens ækvator og Jordens ækvator (IAU), i programmets retninger. Kortets længde 0° lægges her ved
// start (den rigtige primærmeridian står W grader øst for Q, men programmets døgn følger ikke datoen).
export function knude(navn, dato) {
  const { ra } = PLANETER[navn].pol(århundreder(dato));
  return tilProgram(fraÆkvator(ra + 90, 0));
}

// Solens retning set fra planeten i programmets retninger (enhedsvektor)
export function solRetning(navn, dato) {
  const [X, Y, Z] = plads(navn, dato);
  const l = Math.hypot(X, Y, Z);
  return tilProgram([-X / l, -Y / l, -Z / l]);
}

// Solens bredde på planeten (grader, positiv: IAU's nordpol har sol). planetografisk = true giver bredden på den
// fladtrykte planet (som JPL Horizons), ellers retningen fra midten (planetocentrisk).
export function solBredde(navn, dato, planetografisk = true) {
  const s = solRetning(navn, dato), p = pol(navn, dato);
  const c = Math.asin(Math.max(-1, Math.min(1, s[0] * p[0] + s[1] * p[1] + s[2] * p[2])));
  if (!planetografisk) return c / RAD;
  const { radius, polRadius } = PLANETER[navn];
  return Math.atan(((radius / polRadius) ** 2) * Math.tan(c)) / RAD;
}

// Normalen til banens plan (enhedsvektor i programmets retninger, mod uret set herfra: planeten går mod uret om Solen)
export function baneNormal(navn, dato) {
  const a = plads(navn, dato), b = plads(navn, new Date(dato.getTime() + 864e5 * 30));
  const n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const l = Math.hypot(...n);
  return tilProgram(n.map((v) => v / l));
}

// Afstanden til Solen (AU)
export function solAfstand(navn, dato) {
  return Math.hypot(...plads(navn, dato));
}
