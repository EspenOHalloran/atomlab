// Solen og Månen set fra Jorden på et bestemt tidspunkt, og hvor langt Jorden har drejet (til Jorden i Solsystemet).
// Uden Three.js, så det kan testes i Node (tests/jorden.mjs).
// - Solen: de samme formler som Årstiderne (js/data/solbane.js).
// - Månen: "Astronomical Almanac"s korte formler (længde inden for ca. 0,3°, bredde ca. 0,2°, afstand ca. 0,2 %).
// - Jordens drejning: stjernetiden i Greenwich (GMST), som i almanakkerne.
// Retningerne er i ekliptikkens retninger: længde λ (0° mod forårspunktet) og bredde β (nord for Jordens bane).

import { solensLængdeVed, afstandVed } from './solbane.js';

const RAD = Math.PI / 180;
const J2000 = Date.UTC(2000, 0, 1, 12); // 1. januar 2000 kl. 12 verdenstid
const mod360 = (v) => ((v % 360) + 360) % 360;
const sin = (g) => Math.sin(g * RAD);
const cos = (g) => Math.cos(g * RAD);

// Dage siden 1. januar 2000 kl. 12 (verdenstid), med brøkdele
export function dageSidenJ2000(dato) {
  return (dato.getTime() - J2000) / 86400000;
}

// Jordaksens hældning mod banen (grader) på dag d
export function hældningVed(d) {
  return 23.439 - 0.0000004 * d;
}

// Solen: længde (grader) og afstand (km)
export function solen(d) {
  return { længde: solensLængdeVed(d), bredde: 0, afstand: afstandVed(d) * 1e6 };
}

// Månen: længde, bredde (grader) og afstand fra Jordens midte (km)
export function månen(d) {
  const T = d / 36525; // århundreder siden 2000
  const længde = 218.32 + 481267.881 * T
    + 6.29 * sin(135.0 + 477198.87 * T) - 1.27 * sin(259.3 - 413335.36 * T)
    + 0.66 * sin(235.7 + 890534.22 * T) + 0.21 * sin(269.9 + 954397.74 * T)
    - 0.19 * sin(357.5 + 35999.05 * T) - 0.11 * sin(186.5 + 966404.03 * T);
  const bredde = 5.13 * sin(93.3 + 483202.02 * T) + 0.28 * sin(228.2 + 960400.89 * T)
    - 0.28 * sin(318.3 + 6003.15 * T) - 0.17 * sin(217.6 - 407332.21 * T);
  // Parallaksen: hvor stor Jordens radius ser ud fra Månen. Afstanden følger af den.
  const parallakse = 0.9508 + 0.0518 * cos(135.0 + 477198.87 * T) + 0.0095 * cos(259.3 - 413335.36 * T)
    + 0.0078 * cos(235.7 + 890534.22 * T) + 0.0028 * cos(269.9 + 954397.74 * T);
  return { længde: mod360(længde), bredde, afstand: 6378.14 / sin(parallakse) };
}

// Stjernetiden i Greenwich (grader): hvor langt Jorden har drejet i forhold til forårspunktet
export function stjernetid(d) {
  return mod360(280.46061837 + 360.98564736629 * d);
}

// Punktet på Jorden, hvor Solen står lige over hovedet (bredde og længde i grader, øst positiv)
export function solUnder(d) {
  const { længde: λ } = solen(d);
  const ε = hældningVed(d);
  const rektascension = Math.atan2(cos(ε) * sin(λ), cos(λ)) / RAD;
  const deklination = Math.asin(sin(ε) * sin(λ)) / RAD;
  let længde = mod360(rektascension - stjernetid(d));
  if (længde > 180) længde -= 360;
  return { bredde: deklination, længde };
}

// Månefasen: hvor stor en del af skiven der er belyst (0-1), og om den vokser (tiltagende)
export function månefase(d) {
  const s = solen(d), m = månen(d);
  const forskel = mod360(m.længde - s.længde);
  const vinkel = Math.acos(cos(m.bredde) * cos(forskel)) / RAD; // vinklen mellem Solen og Månen set fra Jorden
  return { belyst: (1 - cos(vinkel)) / 2, tiltagende: forskel < 180, vinkel };
}

// Månefasens navn på dansk
export function faseNavn({ belyst, tiltagende }) {
  if (belyst < 0.03) return 'nymåne';
  if (belyst > 0.97) return 'fuldmåne';
  if (Math.abs(belyst - 0.5) < 0.06) return tiltagende ? 'halvmåne (tiltagende)' : 'halvmåne (aftagende)';
  return tiltagende ? 'tiltagende måne' : 'aftagende måne';
}

// Hvor højt Solen står over horisonten et sted på Jorden (grader). bredde og længde i grader (nord og øst positive).
export function solHøjde(d, bredde, længde) {
  const s = solUnder(d);
  return Math.asin(sin(bredde) * sin(s.bredde) + cos(bredde) * cos(s.bredde) * cos(længde - s.længde)) / RAD;
}
