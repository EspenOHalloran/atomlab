// Solens bane på himlen og Jordens bane om Solen. Bruges af Årstiderne i Kosmos (og testes i tests/aarstider.mjs).
// - Solens deklination (hvor langt nord eller syd for ækvator Solen står): ud fra Solens længde på himlen.
// - Dagens længde: fra solopgang til solnedgang, regnet fra Solens øverste kant og med luftens lysbrydning (-0,833°),
//   som i almanakker og på timeanddate.com.
// - Jordens afstand og Solens længde på himlen: "Astronomical Almanac"s korte formler (præcise til ca. 0,01°)
//   for årene omkring 2000-2050.
// Dag i året er 1-365 i 2026 (ikke et skudår). Tallene passer med kilderne inden for få minutter (se testen).

export const HÆLDNING = 23.44; // Jordaksens hældning i grader
const RAD = Math.PI / 180;
const DAGE_I_MÅNED = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const MÅNEDER = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];

// Dag i året (1. januar = 1) ud fra måned (1-12) og dag
export function dagIÅret(måned, dag) {
  let n = dag;
  for (let m = 0; m < måned - 1; m++) n += DAGE_I_MÅNED[m];
  return n;
}

// Dagens nummer i året (29. februar tæller som 28.)
export function dagIDag(nu = new Date()) {
  return dagIÅret(nu.getMonth() + 1, Math.min(nu.getDate(), nu.getMonth() === 1 ? 28 : 31));
}

// Dag i året som tekst, fx 172 → "21. juni"
export function datoTekst(n) {
  let m = 0;
  while (m < 11 && n > DAGE_I_MÅNED[m]) n -= DAGE_I_MÅNED[m++];
  return `${n}. ${MÅNEDER[m]}`;
}

// Måned (0-11) for en dag i året
export function måned(n) {
  let m = 0;
  while (m < 11 && n > DAGE_I_MÅNED[m]) n -= DAGE_I_MÅNED[m++];
  return m;
}

// Solens deklination i grader ved middag (positiv: Solen står nord for ækvator).
// Regnet ud fra Solens længde i netop 2026. (NOAA's korte formel for et "gennemsnitsår" ramte jævndøgn ca. et døgn
// forkert i 2026, og det gav op til 5 minutters fejl i dagens længde i København.)
export function deklination(n) {
  const ε = (23.439 - 0.0000004 * dageSiden2000(n)) * RAD;
  return Math.asin(Math.sin(ε) * Math.sin(solensLængde(n) * RAD)) / RAD;
}

// Dagens længde i timer (0 = mørketid, 24 = midnatssol). bredde i grader (nord positiv, syd negativ).
export function dagslængde(bredde, n) {
  const d = deklination(n) * RAD;
  const b = bredde * RAD;
  const cosH = (Math.sin(-0.833 * RAD) - Math.sin(b) * Math.sin(d)) / (Math.cos(b) * Math.cos(d));
  if (cosH <= -1) return 24;
  if (cosH >= 1) return 0;
  return (2 * Math.acos(cosH)) / RAD / 15;
}

// Hvor højt Solen står over horisonten ved middag (grader). Negativ: Solen står ikke op.
export function middagshøjde(bredde, n) {
  return 90 - Math.abs(bredde - deklination(n));
}

// Dage siden 1. januar 2000 kl. 12 (verdenstid) ved middag på dag n i 2026
function dageSiden2000(n) {
  return 9496 + n;
}

// Jordens afstand til Solen i millioner km
export function afstand(n) {
  const g = (357.529 + 0.98560028 * dageSiden2000(n)) * RAD;
  return 149.598 * (1.00014 - 0.01671 * Math.cos(g) - 0.00014 * Math.cos(2 * g));
}

// Solens længde på himlen (grader, 0 ved forårsjævndøgn, 90 ved sommersolhverv). Bruges til Jordens plads i banen.
export function solensLængde(n) {
  const d = dageSiden2000(n);
  const g = (357.529 + 0.98560028 * d) * RAD;
  const L = 280.459 + 0.98564736 * d;
  return (((L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360) + 360) % 360;
}

// Dagens længde som tekst, fx 17,53 → "17 t 32 min"
export function timerTekst(timer) {
  const min = Math.round(timer * 60);
  return `${Math.floor(min / 60)} t ${String(min % 60).padStart(2, '0')} min`;
}
