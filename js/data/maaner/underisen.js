// "Under isen" (docs/drejebog-maaner.md, afsnit 4-6): tallene for Europa og Enceladus, lagene i snittet og den enkle
// model af magnetfeltet ved Europa. Ren data uden Three.js, så det kan testes i Node (tests/maaner-data.mjs).
// Kilderne står i docs/fakta-maaner-liv.md (afsnit 1-2) og drejebogens afsnit 16.

export const KM_PR_ENHED = 250; // 1 enhed i scenen = 250 km (Europa bliver ca. 6,2 enheder i radius)

// Europa: radius 1.560,8 km (NSSDC, "ca. 3.100 km" i teksterne). Isen 15-25 km og havet 60-150 km er skøn fra modeller
// (NASA "Europa Facts"). Snittet tegner midten af spændet. Jernkernen er noget, forskerne tror (NASA: "is thought to
// have an iron core"). Dens størrelse er ikke målt: Modellerne giver ca. 0,3-0,45 af radius, og vi tegner 600 km
// (står som "regnet" ved laget og i Ærligt talt).
export const EUROPA = {
  r: 1560.8,
  is: 20, isSpænd: [15, 25],
  hav: 100, havSpænd: [60, 150],
  kerne: 600,
};

// Enceladus: middelradius 252,1 km (Cassini, ca. 504 km bred). Lagene tegnes først i M3 (trin 3).
export const ENCELADUS = { r: 252.1 };

// Jordens dybeste sted: Challengerdybet i Marianergraven, ca. 10,9 km (lupen, drejebogens afsnit 1)
export const JORDENS_DYBESTE = 11;

// Laget i en given afstand fra Europas midte (km)
export function lagVed(rKm, m = EUROPA) {
  if (rKm > m.r) return 'rum';
  if (rKm > m.r - m.is) return 'is';
  if (rKm > m.r - m.is - m.hav) return 'hav';
  if (rKm > m.kerne) return 'sten';
  return 'jern';
}

// Grænserne som brøkdel af radius (til shaderen): [isens bund, havets bund, kernens kant]
export function lagGrænser(m = EUROPA) {
  return [(m.r - m.is) / m.r, (m.r - m.is - m.hav) / m.r, m.kerne / m.r];
}

// Lagene med farve og mærke (snittets forklaring). Farverne er de samme som i shaderen (js/maaner/snit.js).
export const LAG = [
  { id: 'is', navn: 'Is', farve: '#eef4ff', mærke: 'ca. 15-25 km (regnet)' },
  { id: 'hav', navn: 'Hav', farve: '#2f86e8', mærke: '60-150 km (målt, dybden regnet)' },
  { id: 'sten', navn: 'Sten', farve: '#8a6a4c', mærke: 'regnet' },
  { id: 'jern', navn: 'Jern', farve: '#9aa0a8', mærke: 'regnet' },
];

// ---------- Magnetfeltet ved Europa (trin 2) ----------
// Set fra Europa er Jupiters felt mest rettet mod syd (B_s, ca. 420 nT), men fordi Jupiters magnetfelt hælder 9,4° og
// drejer med planeten, vipper en del af det (B_v, ca. 200 nT) frem og tilbage hver ca. 11 timer (Kivelson m.fl. 2000).
// Et lag, der leder strøm (det salte hav), laver sit eget felt, der skubber den skiftende del ud: uden for havet er
// det en dipol, der vender modsat, og inde i havet er kun den faste del tilbage. Det er det, Galileo målte.
// Enheder: Europas radius og den faste del af feltet (B_s = 1). x mod Jupiter (venstre er mod Jupiter, -x), y mod nord.
export const FELT = {
  fast: 1, // B_s, mod syd
  vip: 0.48, // B_v / B_s (ca. 200 / 420 nT)
  periode: 8, // sekunder i programmets ur for en hel vippen (i virkeligheden ca. 11,2 timer)
  havR: (EUROPA.r - EUROPA.is) / EUROPA.r, // havets top (ca. 0,987 radius): her starter laget, der leder strøm
  hældning: 9.4, // grader, Jupiters magnetfelt i forhold til aksen (NSSDC)
};

// Den vippende del af Jupiters felt til tiden t (sekunder): fra -1 til 1 (ganges med FELT.vip)
export const vippen = (t) => Math.sin((2 * Math.PI * t) / FELT.periode);

// Feltet i punktet (x, y) i Europa-radier, når den vippende del er bx (= FELT.vip · vippen(t)), med eller uden hav.
// Giver [Bx, By] i ud (et array, så der ikke laves nye objekter hvert billede).
export function feltVed(x, y, bx, hav, ud = [0, 0]) {
  let fx = bx, fy = -FELT.fast;
  if (hav) {
    const a = FELT.havR;
    const r2 = x * x + y * y;
    if (r2 < a * a) {
      fx = 0; // inde i havet er den vippende del skubbet ud
    } else {
      // Dipolen fra havet: m = -(a³/2) · bx langs x. B = (3 (m·r̂) r̂ - m) / r³
      const r = Math.sqrt(r2);
      const m = (-(a ** 3) / 2) * bx;
      const rx = x / r, ry = y / r;
      const mr = m * rx;
      const r3 = r2 * r;
      fx += (3 * mr * rx - m) / r3;
      fy += (3 * mr * ry) / r3;
    }
  }
  ud[0] = fx;
  ud[1] = fy;
  return ud;
}

// Det ekstra felt fra Europa, som Galileos magnetometer måler (den del, der ikke kommer fra Jupiter), i punktet (x, y).
// Uden hav er det 0. Til måleren og testene.
export function ekstraFelt(x, y, bx, hav, ud = [0, 0]) {
  feltVed(x, y, bx, hav, ud);
  ud[0] -= bx;
  ud[1] += FELT.fast;
  return ud;
}

// Tallene i højre panel (højst to, drejebogens afsnit 10)
export const TAL = [
  ['Isen på Europa', 'ca. 15-25 km'],
  ['Havet under isen', '60-150 km dybt'],
];
