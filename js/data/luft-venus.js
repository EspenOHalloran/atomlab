// Luften på Venus i hver højde (V5 i docs/plan-venus.md: måleren på turen ned til Venera 13). Uden Three.js, så den
// kan testes i Node. Tallene er VIRA, Venus' standardatmosfære (Seiff m.fl. 1985, samlet af målinger fra Pioneer Venus
// og Venera-sonderne), for breddegrader under 30°, som tabellen står på Wikipedia ("Atmosphere of Venus", åbnet 17.
// november 2026). Højden er over middelradius (ca. 6.052 km). Trykket er i bar (1 bar er ca. lufttrykket ved havet på
// Jorden, 1,013 bar). Se docs/fakta-solsystemet/del7-venus.md, afsnit 12.

// [højde i km, temperatur i °C, tryk i bar]
export const VIRA = [
  [0, 462, 92.1],
  [5, 424, 66.65],
  [10, 385, 47.39],
  [15, 348, 33.04],
  [20, 306, 22.52],
  [25, 264, 14.93],
  [30, 222, 9.851],
  [35, 180, 5.917],
  [40, 143, 3.501],
  [45, 110, 1.979],
  [50, 75, 1.066],
  [55, 27, 0.5314],
  [60, -10, 0.2357],
  [65, -30, 0.09765],
  [70, -43, 0.0369],
  [80, -76, 0.00476],
  [90, -104, 0.0003736],
  [100, -112, 0.0000266],
];

// Skylaget (Venus Express og Pioneer Venus): de tætte skyer ligger ca. 48-70 km oppe. Under dem er luften diset, men
// klar nok til at se flere km (Knollenberg og Hunten 1980).
export const SKYER = { bund: 48, top: 70 };

// Temperaturen (°C) og trykket (bar) i højden h (km over middelradius). Temperaturen lineært mellem punkterne, trykket
// lineært i logaritmen (trykket falder næsten eksponentielt opad). Under 0 km (lavlandet) og over 100 km forlænges
// de to nederste og øverste punkter.
export function luftVed(h) {
  let i = 0;
  while (i < VIRA.length - 2 && h > VIRA[i + 1][0]) i++;
  const [h0, t0, p0] = VIRA[i];
  const [h1, t1, p1] = VIRA[i + 1];
  const f = (h - h0) / (h1 - h0);
  return { temperatur: t0 + (t1 - t0) * f, tryk: Math.exp(Math.log(p0) + (Math.log(p1) - Math.log(p0)) * f) };
}

// Teksterne på måleren: højden over jorden (km), temperaturen (hele grader) og trykket (bar, med to betydende cifre
// under 10 og hele tal over)
export function målerTekst(hOverJorden, luft) {
  const h = Math.max(0, hOverJorden);
  const p = luft.tryk;
  return {
    højde: h < 0.05 ? '0 km' : h < 10 ? `${h.toFixed(1).replace('.', ',')} km` : `${Math.round(h)} km`,
    temperatur: `${Math.round(luft.temperatur)} °C`.replace('-', '−'),
    tryk: p >= 10 ? `${Math.round(p)} bar` : `${p.toPrecision(2).replace('.', ',')} bar`,
  };
}
