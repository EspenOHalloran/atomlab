// Det sorte hul (js/data/sorthul.js): lysets bane, skyggens størrelse, fotonkuglen, ISCO, rødforskydningen og
// farverne. Kører uden browser. Shaderen i js/kosmos/linse.js regner med de samme skridt.
import * as S from '../js/data/sorthul.js';

let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const M = S.M;
const nær = (a, b, tol) => Math.abs(a - b) <= tol;

// Tallene
tjek('horisonten er 2M = 1,5 enheder (som før)', nær(S.HORISONT, 1.5, 1e-12));
tjek('skyggen er √27 M ≈ 2,6 horisonter', nær(S.SKYGGE / S.HORISONT, Math.sqrt(27) / 2, 1e-12) && nær(S.SKYGGE / S.HORISONT, 2.6, 0.01));
tjek('inderkanten er ISCO = 6M', nær(S.ISCO, 6 * M, 1e-12));

// En stråle med stødparameteren b fra et kamera langt væk: fanget eller ej
const stråle = (b, valg) => {
  const r0 = 1e4 * M;
  return S.følgStråle(r0, Math.PI - Math.asin((b / r0) * Math.sqrt(1 - (2 * M) / r0)), valg);
};
const kant = (valg) => {
  let lo = 4 * M, hi = 6 * M;
  for (let i = 0; i < 45; i++) { const m = (lo + hi) / 2; if (stråle(m, valg).fanget) lo = m; else hi = m; }
  return lo;
};
const fin = kant({ maks: 20000, kort: 0.001, langt: 0.01 });
tjek(`skyggens kant (fine skridt) er √27 M: ${(fin / M).toFixed(5)} M`, nær(fin / M, Math.sqrt(27), 2e-4));
const grov = kant({ maks: 170 });
tjek(`skyggens kant med shaderens skridt (pc) inden for 0,1 %: ${(grov / M).toFixed(5)} M`, nær(grov / M, Math.sqrt(27), 0.0052));
const tablet = kant({ maks: 110, kort: 0.085, langt: 0.3 });
tjek(`skyggens kant med tablettens skridt inden for 0,5 %: ${(tablet / M).toFixed(5)} M`, nær(tablet / M, Math.sqrt(27), 0.026));

// Fotonkuglen: en stråle lige uden for kanten kommer ned til 3M
const næsten = stråle(Math.sqrt(27) * M * (1 + 1e-6), { maks: 40000, kort: 0.001, langt: 0.01 });
tjek(`lys lige uden for kanten kommer ned til 3M: ${(næsten.rMin / M).toFixed(4)} M`, !næsten.fanget && nær(næsten.rMin / M, 3, 0.01));

// ISCO: drejeimpulsen for cirkelbaner (L² = M r² / (r − 3M)) er mindst ved 6M
let bedst = null;
for (let r = 3.1 * M; r < 20 * M; r += 0.001 * M) { const L2 = (M * r * r) / (r - 3 * M); if (!bedst || L2 < bedst[1]) bedst = [r, L2]; }
tjek(`ISCO fra cirkelbanerne: ${(bedst[0] / M).toFixed(3)} M`, nær(bedst[0] / M, 6, 0.002));

// Afbøjningen langt fra hullet: 4M/b + 15π/4 (M/b)² + 128/3 (M/b)³ + 3465π/64 (M/b)⁴ (Einstein og de næste led,
// Keeton og Petters 2005)
for (const b of [30, 100]) {
  const a = S.afbøjning(b * M);
  const t = 4 / b + (15 * Math.PI) / 4 / b ** 2 + 128 / 3 / b ** 3 + (3465 * Math.PI) / 64 / b ** 4;
  tjek(`afbøjningen ved b = ${b} M: ${a.toFixed(5)} ≈ ${t.toFixed(5)} rad`, nær(a, t, 5e-4 * t));
}

// Skyggens vinkel fra kameraet: lang afstand ≈ √27 M / r, og tæt på større end uden tyngdekraft
tjek('skyggens vinkel langt væk ≈ √27 M / r', nær(S.skyggeVinkel(1000 * M), (Math.sqrt(27) * M) / (1000 * M), 1e-5));
tjek(`skyggens vinkel ved 15 enheder (mindste afstand, 20 M) er ${((S.skyggeVinkel(15) * 180) / Math.PI).toFixed(2)}° (asin(√27/20 · √0,9) = 14,27°)`, nær((S.skyggeVinkel(15) * 180) / Math.PI, 14.27, 0.01));

// Skivens krydsninger med shaderens skridt passer med en fin regning (kameraet 31 enheder væk, 11° over skiven)
let størst = 0;
for (const grader of [1, 2, 4, 8, 12, -6]) {
  const a = (grader * Math.PI) / 180, eps = (11.3 * Math.PI) / 180;
  const e1y = Math.sin(eps), e2y = a > 0 ? -Math.cos(eps) : Math.cos(eps);
  let k = Math.atan2(-e1y, e2y); if (k < 0) k += Math.PI;
  const g = S.følgStråle(31, Math.PI - Math.abs(a), { kryds: k, maks: 170 });
  const f = S.følgStråle(31, Math.PI - Math.abs(a), { kryds: k, maks: 100000, kort: 0.0005, langt: 0.0005 });
  for (let i = 0; i < Math.min(g.kryds.length, f.kryds.length); i++) størst = Math.max(størst, Math.abs(g.kryds[i].r - f.kryds[i].r) / f.kryds[i].r);
  if (g.kryds.length !== f.kryds.length || g.fanget !== f.fanget) størst = Infinity;
}
tjek(`skivens krydsninger med shaderens skridt (største fejl ${(størst * 100).toFixed(4)} %)`, størst < 1e-3);

// Rødforskydningen
tjek('g lige ovenfra ved ISCO = √(1 − 3M/r) = √0,5', nær(S.rødforskydning(S.ISCO, 0), Math.sqrt(0.5), 1e-12));
const ud = S.rødforskydning(S.ISCO, 7 * M), ind = S.rødforskydning(S.ISCO, -7 * M);
tjek(`gas, der kommer mod os, er blåforskudt (g = ${ud.toFixed(2)}), og gas, der kører væk, rødforskudt (g = ${ind.toFixed(2)})`, ud > 1.2 && ind < 0.55);
tjek('farten ved ISCO er halvdelen af lysets (lokalt målt v = √(M/(r − 2M)))', nær(Math.sqrt(M / (S.ISCO - 2 * M)), 0.5, 1e-12));

// Temperaturen og farverne
tjek('skiven er varmest ved 49/36 af inderkanten og 0 ved inderkanten', nær(S.temperatur((S.ISCO * 49) / 36), 1, 1e-9) && S.temperatur(S.ISCO) === 0 && S.temperatur(S.ISCO * 1.5) < 1);
const [r2, g2, b2] = S.sortlegeme(2000), [r6, g6, b6] = S.sortlegeme(6500), [r15, , b15] = S.sortlegeme(15000);
tjek('sortlegeme: 2.000 K er orange, 6.500 K næsten hvid, 15.000 K blålig', r2 > 2 * g2 && g2 > 5 * b2 && nær(r6, b6, 0.15) && nær(g6, 1, 0.1) && b15 > 1.5 * r15);
tjek(`farvetabellen har ${S.FARVER} punkter med lysstyrken 1`, S.farvetabel().length === S.FARVER && S.farvetabel().every(([r, g, b]) => nær(0.2126 * r + 0.7152 * g + 0.0722 * b, 1, 1e-9)));

console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
