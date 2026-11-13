// Betelgeuse set fra Jorden (Supernova, kontakten "🌃 Betelgeuse set fra Jorden"): stjernerne omkring Orion,
// omregningen til himlen over Danmark og et skøn over, hvor klar supernovaen bliver med tiden (lyskurven).
// Uden Three.js, så det kan testes i Node.
// Koordinaterne er rektascension (timer) og deklination (grader) for år 2000. Afrundet til ca. 0,1°, det er nok her.

const RAD = Math.PI / 180;

export const BREDDE = 56; // Danmarks breddegrad (grader nord)
// Lokal stjernetid i timer. Orion står så lidt øst for syd (en vinternat ca. kl. 1 i november eller kl. 21 i januar).
// Med den samme himmel står Solen lavt i vest en eftermiddag i marts (kontakten "Om dagen").
export const STJERNETID = 4.3;

// Navn, rektascension (timer), deklination (grader), lysstyrke (størrelsesklasse) og farve
export const STJERNER = [
  ['Betelgeuse', 5.919, 7.407, 0.5, '#ffa25c'],
  ['Rigel', 5.242, -8.202, 0.13, '#b9d0ff'],
  ['Bellatrix', 5.419, 6.35, 1.64, '#c4d6ff'],
  ['Saiph', 5.796, -9.67, 2.06, '#c4d6ff'],
  ['Alnitak', 5.679, -1.943, 1.77, '#c4d6ff'],
  ['Alnilam', 5.604, -1.202, 1.69, '#c4d6ff'],
  ['Mintaka', 5.533, -0.299, 2.23, '#c4d6ff'],
  ['Meissa', 5.585, 9.934, 3.39, '#c4d6ff'],
  ['ι Ori', 5.59, -5.91, 2.77, '#c4d6ff'],
  ['Orion-tågen', 5.588, -5.39, 4.0, '#e8c8ff'],
  ['η Ori', 5.408, -2.397, 3.36, '#c4d6ff'],
  ['τ Ori', 5.293, -6.845, 3.6, '#c4d6ff'],
  ['π1 Ori', 4.909, 10.151, 4.65, '#ffffff'],
  ['π2 Ori', 4.844, 8.9, 4.35, '#ffffff'],
  ['π3 Ori', 4.83, 6.961, 3.19, '#fff6e8'],
  ['π4 Ori', 4.853, 5.605, 3.68, '#c4d6ff'],
  ['π5 Ori', 4.904, 2.441, 3.71, '#c4d6ff'],
  ['π6 Ori', 4.976, 1.714, 4.47, '#ffd9a8'],
  ['μ Ori', 6.039, 9.648, 4.12, '#ffffff'],
  ['ν Ori', 6.13, 14.768, 4.42, '#c4d6ff'],
  ['ξ Ori', 6.198, 14.209, 4.48, '#c4d6ff'],
  ['χ1 Ori', 5.906, 20.276, 4.39, '#fff4d8'],
  ['Sirius', 6.752, -16.716, -1.46, '#dbe6ff'],
  ['Mirzam', 6.378, -17.956, 1.98, '#c4d6ff'],
  ['Adhara', 6.977, -28.972, 1.5, '#c4d6ff'],
  ['Wezen', 7.14, -26.393, 1.83, '#fff2d0'],
  ['Procyon', 7.655, 5.225, 0.34, '#fff8ec'],
  ['Gomeisa', 7.453, 8.289, 2.89, '#d6e2ff'],
  ['Aldebaran', 4.599, 16.509, 0.86, '#ffb070'],
  ['γ Tau', 4.33, 15.628, 3.65, '#ffd9a8'],
  ['δ Tau', 4.382, 17.543, 3.76, '#ffd9a8'],
  ['ε Tau', 4.477, 19.18, 3.53, '#ffd9a8'],
  ['θ2 Tau', 4.478, 15.871, 3.4, '#ffffff'],
  ['Elnath', 5.438, 28.608, 1.65, '#d6e2ff'],
  ['ζ Tau', 5.627, 21.142, 3.0, '#d6e2ff'],
  ['Alcyone', 3.791, 24.105, 2.87, '#c4d6ff'],
  ['Atlas', 3.819, 24.053, 3.62, '#c4d6ff'],
  ['Electra', 3.748, 24.113, 3.7, '#c4d6ff'],
  ['Maia', 3.763, 24.368, 3.87, '#c4d6ff'],
  ['Merope', 3.772, 23.948, 4.18, '#c4d6ff'],
  ['Taygeta', 3.754, 24.467, 4.3, '#c4d6ff'],
  ['Capella', 5.278, 45.998, 0.08, '#fff0c8'],
  ['Menkalinan', 5.992, 44.947, 1.9, '#ffffff'],
  ['Castor', 7.577, 31.888, 1.58, '#ffffff'],
  ['Pollux', 7.755, 28.026, 1.14, '#ffd09a'],
  ['Alhena', 6.629, 16.399, 1.93, '#ffffff'],
  ['Arneb', 5.546, -17.822, 2.58, '#fff4d8'],
  ['Nihal', 5.471, -20.759, 2.84, '#fff0c8'],
  ['Cursa', 5.131, -5.086, 2.79, '#ffffff'],
];

// Stregerne i Orion (to navne pr. streg)
export const STREGER = [
  ['Betelgeuse', 'Meissa'], ['Meissa', 'Bellatrix'], ['Betelgeuse', 'Alnitak'], ['Bellatrix', 'Mintaka'],
  ['Alnitak', 'Alnilam'], ['Alnilam', 'Mintaka'], ['Alnitak', 'Saiph'], ['Mintaka', 'Rigel'],
  ['Betelgeuse', 'μ Ori'], ['μ Ori', 'ξ Ori'], ['ξ Ori', 'χ1 Ori'],
  ['Bellatrix', 'π3 Ori'], ['π1 Ori', 'π2 Ori'], ['π2 Ori', 'π3 Ori'], ['π3 Ori', 'π4 Ori'], ['π4 Ori', 'π5 Ori'], ['π5 Ori', 'π6 Ori'],
];

export const SOLEN_I_MARTS = [23.6, -2]; // Solens rektascension og deklination midt i marts
export const GALAKSENS_POL = [12.857, 27.13]; // Mælkevejens nordpol (til det svage bånd på himlen)

// Retningen til et punkt på himlen i 3D-billedets akser: x mod vest, y op og z mod nord (man kigger mod syd = -z).
export function retning(ra, dec, stjernetid = STJERNETID, bredde = BREDDE) {
  const H = (stjernetid - ra) * 15 * RAD; // timevinklen (positiv mod vest)
  const d = dec * RAD, φ = bredde * RAD;
  const øst = -Math.cos(d) * Math.sin(H);
  const nord = Math.sin(d) * Math.cos(φ) - Math.cos(d) * Math.cos(H) * Math.sin(φ);
  const op = Math.sin(d) * Math.sin(φ) + Math.cos(d) * Math.cos(H) * Math.cos(φ);
  return [-øst, op, nord];
}

// Højden over horisonten og kompasretningen (0° = nord, 90° = øst, 180° = syd) i grader
export function højdeOgKompas([x, y, z]) {
  return { højde: Math.asin(y) / RAD, kompas: (Math.atan2(-x, z) / RAD + 360) % 360 };
}

// Lyskurven: hvor klar Betelgeuse ser ud (størrelsesklasse, mindre tal = klarere) d dage efter neutrinoerne.
// Et skøn ud fra almindelige supernovaer af type II-P (en rød kæmpe, der eksploderer) flyttet til ca. 550 lysår:
// lyset bryder ud ca. et døgn efter neutrinoerne, toppen er omtrent som en halvmåne (skønnene går fra en kvart til en
// fuld måne), plateauet varer ca. tre måneder, og bagefter falmer den ca. 1 størrelsesklasse pr. 100 dage
// (radioaktivt cobalt-56, der henfalder).
export const NORMAL = 0.5; // Betelgeuse i dag (den svinger mellem ca. 0 og 1,6)
export const DAG_GRÆNSE = -5; // klarere end det kan den let ses om dagen
export const ØJE_GRÆNSE = 6; // svagere end det kan den ikke ses uden kikkert
export function størrelsesklasse(d) {
  if (d < 1) return NORMAL; // lyset er ikke nået ud gennem stjernen endnu
  if (d < 10) {
    const f = 1 - (1 - (d - 1) / 9) ** 3;
    return NORMAL + (-11 - NORMAL) * f;
  }
  if (d < 110) return -11 + 0.6 * ((d - 10) / 100);
  if (d < 140) {
    const f = (d - 110) / 30;
    return -10.4 + 3.4 * f * f * (3 - 2 * f);
  }
  return -7 + 0.0098 * (d - 140);
}

// Farven (r, g, b mellem 0 og 1): blåhvid lige efter udbruddet, hvid på plateauet og rødlig, når den falmer
export function farve(d) {
  if (d < 1) return [1, 0.64, 0.36]; // den røde kæmpe
  const blå = [0.78, 0.88, 1], hvid = [1, 0.96, 0.88], rød = [1, 0.62, 0.45];
  const bland = (a, b, f) => a.map((v, i) => v + (b[i] - v) * Math.min(1, Math.max(0, f)));
  if (d < 30) return bland(blå, hvid, (d - 3) / 27);
  return bland(hvid, rød, (d - 100) / 150);
}

// Skyderen "Tid" (0-1000): under 40 er før eksplosionen, 40-140 er de første 48 timer, og resten går til ca. 5 år
export const SKYDER = { før: 40, døgn: 140, max: 1000, slutDage: 1800 };
export function dageFraSkyder(v) {
  if (v < SKYDER.før) return -1;
  if (v < SKYDER.døgn) return (2 * (v - SKYDER.før)) / (SKYDER.døgn - SKYDER.før);
  return 2 * (SKYDER.slutDage / 2) ** ((v - SKYDER.døgn) / (SKYDER.max - SKYDER.døgn));
}

export function tidTekst(d) {
  if (d < 0) return 'Før';
  if (d < 2) return `${Math.round(d * 24)} timer`;
  if (d < 61) return `${Math.round(d)} dage`;
  if (d < 700) return `${Math.round(d / 30.44)} måneder`;
  return `${(d / 365.25).toFixed(1).replace('.', ',')} år`;
}

// Hvad den kan sammenlignes med
export function sammenlign(m) {
  if (m <= -9.5) return 'omtrent som en halvmåne';
  if (m <= -6) return 'meget klarere end Venus';
  if (m <= -3.5) return 'som Venus, den klareste planet';
  if (m <= -1) return 'som Sirius, den klareste stjerne';
  if (m <= 2) return 'som en klar stjerne';
  if (m <= ØJE_GRÆNSE) return 'som en svag stjerne';
  return 'så svagt, at den ikke kan ses uden kikkert';
}
