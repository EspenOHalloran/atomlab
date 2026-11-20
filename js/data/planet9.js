// Banerne for de fjerneste småkloder (gåden om Planet 9, js/gaader/planet9.js). Lavet af tests/vaerktoejer/lav_planet9.py
// ud fra JPL's Small-Body Database (sbdb_query.api) 20. november 2026: alle med a > 250 AU og q > 30 AU og en godt målt bane
// (målt over mindst et år, condition code højst 5). Uden Three.js, så det kan testes i Node.
// En bane: [navn, a (AU), e, i (°), Ω (°), ω (°), M (°, middelanomalien nu), en af de seks fra Batygin og Brown 2016].

export const SMÅKLODER = [
  ['2016 SA59', 252.6, 0.8450, 21.5, 174.8, 200.6, 2.0, false],
  ['2024 FX26', 253.7, 0.8387, 15.7, 158.3, 34.5, 357.9, false],
  ['2012 VP113', 267.5, 0.6986, 24.0, 90.9, 294.3, 3.8, true],
  ['2015 DM319', 278.7, 0.8585, 6.8, 165.9, 43.2, 2.0, false],
  ['2014 WB556', 284.5, 0.8497, 24.1, 115.0, 235.5, 2.0, false],
  ['2013 FT28', 288.3, 0.8489, 17.4, 217.7, 40.5, 357.5, false],
  ['2014 SR349', 304.1, 0.8442, 18.0, 34.9, 341.7, 358.1, false],
  ['2018 VM35', 307.0, 0.8547, 8.5, 192.4, 303.4, 357.9, false],
  ['2015 GT50', 314.4, 0.8780, 8.8, 46.1, 128.8, 1.7, false],
  ['2013 SL102', 321.8, 0.8814, 6.5, 94.8, 265.7, 1.0, false],
  ['2015 DY248', 324.8, 0.8955, 12.9, 272.9, 244.6, 0.5, false],
  ['Alicanto', 342.1, 0.8615, 25.5, 66.0, 327.3, 0.9, true],
  ['2016 SD106', 357.5, 0.8806, 4.8, 219.5, 163.1, 359.5, false],
  ['2010 GB174', 360.2, 0.8653, 21.5, 130.6, 347.4, 3.9, true],
  ['2014 TU115', 360.2, 0.9028, 23.5, 192.3, 225.5, 360.0, false],
  ['2013 FL28', 374.2, 0.9141, 15.8, 294.3, 225.1, 0.7, false],
  ['2013 RF98', 375.8, 0.9038, 29.5, 67.7, 312.3, 0.8, true],
  ['2014 SX403', 376.9, 0.9056, 43.0, 149.3, 174.9, 1.6, false],
  ['2015 RX245', 446.1, 0.8980, 12.1, 8.6, 65.1, 358.5, false],
  ['2013 RA109', 480.1, 0.9041, 12.4, 104.9, 263.1, 0.6, false],
  ['Geyagugv', 486.2, 0.9274, 54.1, 135.3, 347.8, 358.9, false],
  ['Sedna', 543.7, 0.8599, 11.9, 144.5, 311.1, 358.6, true],
  ['2007 TG422', 555.3, 0.9358, 18.6, 113.0, 285.9, 0.6, true],
  ['2015 KG163', 640.2, 0.9368, 14.0, 219.1, 31.9, 0.1, false],
  ['2013 SY99', 812.9, 0.9386, 4.2, 29.5, 32.3, 359.6, false],
  ['2017 OF201', 823.6, 0.9452, 16.2, 328.8, 337.8, 1.5, false],
  ['2021 DK18', 859.3, 0.9481, 15.4, 322.3, 234.3, 359.2, false],
  ['2021 RR205', 949.0, 0.9414, 7.7, 108.5, 208.6, 0.4, false],
  ['2019 EU5', 1341.0, 0.9650, 18.2, 109.1, 108.9, 359.4, false],
  ['Leleākūhonua', 1345.0, 0.9519, 11.7, 301.1, 118.2, 359.6, false],
  ['2014 FE72', 2687.0, 0.9866, 20.6, 336.7, 134.0, 0.2, false],
];
export const SMÅKLODER_DATO = '20. november 2026';

// Retningen mod perihelium (det sted, banen kommer tættest på Solen), set lige oppefra Jordens baneplan, i grader.
// ϖ = Ω + ω gælder kun for baner, der ikke hælder. Her regnes punktet ud og lægges ned i planet.
export function periheliumRetning([, , , i, om, w]) {
  const g = Math.PI / 180;
  const x = Math.cos(om * g) * Math.cos(w * g) - Math.sin(om * g) * Math.sin(w * g) * Math.cos(i * g);
  const y = Math.sin(om * g) * Math.cos(w * g) + Math.cos(om * g) * Math.sin(w * g) * Math.cos(i * g);
  return ((Math.atan2(y, x) / g) + 360) % 360;
}
