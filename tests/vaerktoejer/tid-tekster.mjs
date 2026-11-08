// Skriver alle teksterne ved hjemkomsten i "Rejsen i tid" ud (alle mål, alle farter og 1 g), så de kan læses igennem
// (tjekliste B). Kun regningen i js/data/tid.js, ingen browser:  node tests/vaerktoejer/tid-tekster.mjs
import * as T from '../../js/data/tid.js';

const START = 2026;
for (const id of T.MÅL_RÆKKE) {
  const m = T.MÅL[id];
  console.log(`\n== ${m.navn} (${m.afstand}) ==`);
  const ture = Array.from({ length: T.FLEST_NI }, (_, i) => [T.fartTekst(i + 1), T.rejse(m.lysår, i + 1)]);
  const g = T.enG(m.lysår);
  ture.push([`1 g (størst ${T.fartFraGamma(g.gamma)})`, { skibÅr: 2 * g.skibÅr, jordÅr: 2 * g.jordÅr, gamma: g.gamma }]);
  for (const [navn, r] of ture) {
    const tekst = T.hjemkomst(r.skibÅr, r.jordÅr, START);
    console.log(`${navn.padEnd(30)} skib ${T.varighed(r.skibÅr).padEnd(13)} Jorden ${T.varighed(r.jordÅr).padEnd(13)} set fra skibet ${T.lysårTekst(m.lysår / r.gamma)}`);
    console.log(`  [${tekst.length}] ${tekst}`);
  }
}
