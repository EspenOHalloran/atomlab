// Det sorte hul: lysets baner om et sort hul, der ikke drejer (Schwarzschild), skivens rødforskydning og farverne.
// Uden Three.js, så det kan testes i Node (tests/sorthul.mjs). Shaderen i js/kosmos/sorthul.js regner det samme.
// Enheder: G = c = 1, og længder i animationens enheder. M er hullets masse målt som en længde (GM/c²).

export const M = 0.75; // horisonten (2M) er 1,5 enheder som før
export const HORISONT = 2 * M; // begivenhedshorisonten (Schwarzschild-radius)
export const FOTONKUGLE = 3 * M; // her kan lys gå i cirkel om hullet (ustabilt)
export const SKYGGE = Math.sqrt(27) * M; // skyggens kant (stødparameteren b), ≈ 5,196 M ≈ 2,6 horisonter
export const ISCO = 6 * M; // den inderste stabile bane: skivens inderkant (3 horisonter)
export const SKIVE_YDERST = 20 * M; // skivens yderkant i animationen (en rigtig skive er meget større)

// Lysets bane ligger i et plan. Med u = 1/r og vinklen φ i planet er banen givet ved d²u/dφ² = 3Mu² − u.
// (Uden tyngdekraft er det u'' = −u, en ret linje. Leddet 3Mu² er Einsteins bøjning.)
const kraft = (u, m) => 3 * m * u * u - u;

// Skridtet i φ: kort tæt på hullet (stor u), langt langt væk. Shaderen bruger samme regel.
export function skridt(u, m = M, kort = 0.06, langt = 0.24) {
  const t = Math.min(1, Math.max(0, (u * m - 0.03) / (0.2 - 0.03)));
  return langt + (kort - langt) * t * t * (3 - 2 * t);
}

// Et skridt med Runge-Kutta (RK4) for u'' = 3Mu² − u. Giver [u, u'].
export function rk4(u, v, h, m = M) {
  const k1u = v, k1v = kraft(u, m);
  const k2u = v + 0.5 * h * k1v, k2v = kraft(u + 0.5 * h * k1u, m);
  const k3u = v + 0.5 * h * k2v, k3v = kraft(u + 0.5 * h * k2u, m);
  const k4u = v + h * k3v, k4v = kraft(u + h * k3u, m);
  return [u + (h / 6) * (k1u + 2 * k2u + 2 * k3u + k4u), v + (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v)];
}

// Stødparameteren b (hvor tæt strålen ville komme forbi uden tyngdekraft) for en stråle fra et kamera, der står stille
// i afstanden r og sender lyset i vinklen psi fra retningen væk fra hullet: b = r sin(psi) / √(1 − 2M/r).
export const stødparameter = (r, psi, m = M) => (r * Math.sin(psi)) / Math.sqrt(1 - (2 * m) / r);

// Skyggens vinkelradius set fra et kamera, der står stille i afstanden r: sin(psi) = √27 M / r · √(1 − 2M/r)
export const skyggeVinkel = (r, m = M) => Math.asin(Math.min(1, ((Math.sqrt(27) * m) / r) * Math.sqrt(1 - (2 * m) / r)));

// Følger en stråle baglæns fra kameraet (afstand r0, vinkel psi fra retningen væk fra hullet) med samme skridt som
// shaderen. kryds = vinklen, hvor banen første gang krydser skivens plan (eller null). Krydsningerne kommer så for
// hver halve omgang (kryds + kπ).
// Giver { fanget, slut (vinklen φ, hvor strålen er uendelig langt væk), kryds: [{ φ, r }], skridt, rMin }.
export function følgStråle(r0, psi, { m = M, kryds = null, maks = 400, kort, langt } = {}) {
  let u = 1 / r0;
  let v = -u * Math.sqrt(1 - 2 * m * u) * (Math.cos(psi) / Math.sin(psi));
  let phi = 0;
  let næste = kryds;
  const krydsninger = [];
  let rMin = r0;
  for (let n = 0; n < maks; n++) {
    let h = skridt(u, m, kort, langt);
    // Skridtet slutter præcis ved skivens plan, så r dér bliver regnet nøjagtigt
    const ramtPlan = næste !== null && phi + h >= næste;
    if (ramtPlan) h = næste - phi;
    const [u2, v2] = rk4(u, v, h, m);
    if (u2 >= 1 / (2 * m)) return { fanget: true, slut: null, kryds: krydsninger, skridt: n + 1, rMin: 2 * m };
    if (u2 <= 0) {
      // Strålen er sluppet væk: vinklen, hvor u = 0 (lineært mellem de to sidste punkter)
      const slut = phi + (h * u) / (u - u2);
      return { fanget: false, slut, kryds: krydsninger, skridt: n + 1, rMin };
    }
    u = u2;
    v = v2;
    phi += h;
    rMin = Math.min(rMin, 1 / u);
    if (ramtPlan) {
      krydsninger.push({ phi, r: 1 / u });
      næste += Math.PI;
    }
  }
  return { fanget: true, slut: null, kryds: krydsninger, skridt: maks, rMin }; // gik i ring for længe: regnes som fanget
}

// Hvor meget lyset bliver bøjet (afbøjningsvinklen) for en stråle, der kommer uendeligt langt fra med stødparameteren b
// og forsvinder uendeligt langt væk igen. Regnet med samme metode (startet langt væk).
export function afbøjning(b, m = M) {
  const r0 = 1e5 * b;
  const psi = Math.PI - Math.asin(Math.min(1, (b / r0) * Math.sqrt(1 - (2 * m) / r0)));
  const s = følgStråle(r0, psi, { m, maks: 4000, kort: 0.002, langt: 0.002 });
  return s.fanget ? null : s.slut - Math.PI;
}

// Skivens gas kredser med Keplers fart. Vinkelfarten set langt fra: Ω = √(M/r³) (gælder præcist for et hul, der ikke drejer).
export const vinkelfart = (r, m = M) => Math.sqrt(m / (r * r * r));

// Rødforskydningen g = (frekvensen, kameraet ser) / (frekvensen, gassen sender).
// lambda er fotonens drejeimpuls om skivens akse delt med energien (positiv, når fotonen kører samme vej som gassen).
// √(1 − 3M/r) er tyngdekraftens rødforskydning og tidsforlængelsen ved gassens fart. 1 / (1 − Ω·lambda) er
// dopplereffekten: gas, der kommer mod os, giver g > 1. Kameraet står stille i afstanden rKamera, så det ser lyset
// lidt blåforskudt (1 / √(1 − 2M/rKamera)).
export function rødforskydning(r, lambda, rKamera = Infinity, m = M) {
  return Math.sqrt(1 - (3 * m) / r) / (1 - vinkelfart(r, m) * lambda) / Math.sqrt(1 - (2 * m) / rKamera);
}

// Skivens temperatur i forhold til den højeste: T ∝ r^(−3/4) · (1 − √(rInd/r))^(1/4) (en tynd skive, Shakura og
// Sunyaev 1973, med Newtons tyngdekraft). Varmest ved r = 49/36 · rInd. Ved inderkanten er den 0, for dér falder
// gassen ind uden at gnide mod gassen indenfor.
export function temperatur(r, rInd = ISCO) {
  if (r <= rInd) return 0;
  const T = (x) => x ** -0.75 * (1 - Math.sqrt(1 / x)) ** 0.25;
  return T(r / rInd) / T(49 / 36);
}

// Farven på et sortlegeme (glødende ting) ved temperaturen T (kelvin) som lineær sRGB med lysstyrken Y = 1.
// Plancks lov ganget med CIE 1931-farvekurverne (tilnærmet med Wyman, Sloan og Shirley 2013) fra 380 til 780 nm.
export function sortlegeme(T) {
  const g = (x, mu, s1, s2) => Math.exp(-0.5 * ((x - mu) / (x < mu ? s1 : s2)) ** 2);
  let X = 0, Y = 0, Z = 0;
  for (let nm = 380; nm <= 780; nm += 5) {
    const l = nm * 1e-9;
    const B = 1 / (l ** 5 * (Math.exp(1.4387769e-2 / (l * T)) - 1)); // Planck (uden konstanter foran)
    X += B * (1.056 * g(nm, 599.8, 37.9, 31.0) + 0.362 * g(nm, 442.0, 16.0, 26.7) - 0.065 * g(nm, 501.1, 20.4, 26.2));
    Y += B * (0.821 * g(nm, 568.8, 46.9, 40.5) + 0.286 * g(nm, 530.9, 16.3, 31.1));
    Z += B * (1.217 * g(nm, 437.0, 11.8, 36.0) + 0.681 * g(nm, 459.0, 26.0, 13.8));
  }
  // XYZ → lineær sRGB (D65)
  let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  let gr = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  let b = 0.0557 * X - 0.204 * Y + 1.057 * Z;
  r = Math.max(0, r); gr = Math.max(0, gr); b = Math.max(0, b);
  const lys = 0.2126 * r + 0.7152 * gr + 0.0722 * b;
  return [r / lys, gr / lys, b / lys];
}

// Farvetabellen til shaderen: FARVER punkter fra 10^3 til 10^4,6 kelvin (1.000-40.000 K), jævnt i log(T)
export const FARVER = 33;
export const LOG_T = [3, 4.6];
export function farvetabel() {
  const ud = [];
  for (let i = 0; i < FARVER; i++) ud.push(sortlegeme(10 ** (LOG_T[0] + ((LOG_T[1] - LOG_T[0]) * i) / (FARVER - 1))));
  return ud;
}
