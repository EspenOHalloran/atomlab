// Uranus' måner (UN4 i docs/plan-uranus-neptun.md). Tallene er fra NSSDC's faktaark over Uranus' måner (opdateret
// 11. marts 2023) og står i docs/fakta-solsystemet/del6-uranus-og-neptun.md, afsnit 7. Uden Three.js.
//
// afstand: middelafstand fra Uranus' midte (km). r: radius (km, Miranda og Ariel som middel af de tre akser). døgn:
// omløbstid (døgn). hældning: banens hældning mod Uranus' ækvator (grader, kun Miranda er over 0,2°). albedo: NSSDC's
// geometriske albedo. lys: kortets lysstyrke, så gennemsnittet er ca. 0,53 gange albedoen (som Saturns og Jupiters
// måner; kortets gennemsnit skriver lav_uranus_maaner.py ud). start: vinklen i banen fra Solens retning ved månernes
// ur 0 (grader i den retning, månen kredser). Pladserne er tegnet, ikke dem for i dag.

export const MÅNER = [
  { id: 'miranda', navn: 'Miranda', afstand: 129900, r: 235.8, døgn: 1.413479, hældning: 4.34, albedo: 0.32, lys: (0.53 * 0.32) / 0.505, start: 205, opdaget: 1948 },
  { id: 'ariel', navn: 'Ariel', afstand: 190900, r: 578.9, døgn: 2.520379, hældning: 0.04, albedo: 0.39, lys: (0.53 * 0.39) / 0.512, start: 40, opdaget: 1851 },
  { id: 'umbriel', navn: 'Umbriel', afstand: 266000, r: 584.7, døgn: 4.144176, hældning: 0.13, albedo: 0.21, lys: (0.53 * 0.21) / 0.582, start: 130, opdaget: 1851 },
  { id: 'titania', navn: 'Titania', afstand: 436300, r: 788.9, døgn: 8.705867, hældning: 0.08, albedo: 0.27, lys: (0.53 * 0.27) / 0.634, start: 290, opdaget: 1787 },
  { id: 'oberon', navn: 'Oberon', afstand: 583500, r: 761.4, døgn: 13.463234, hældning: 0.07, albedo: 0.23, lys: (0.53 * 0.23) / 0.49, start: 345, opdaget: 1787 },
];

// De små indre måner, der kan støde sammen (jeres spørgsmål 7. november 2026). Der findes ingen kort over dem, så de er
// små, grå klumper (formen er tegnet). Albedo 0,07-0,08 (NSSDC): mørke som ringene. Cressida starter lidt bag
// Desdemona, så man med ⏩ kan se den indhente Desdemona.
export const SMÅ = [
  { id: 'cressida', navn: 'Cressida', afstand: 61800, r: 41, døgn: 0.46357, albedo: 0.07, start: 70, frø: 1 },
  { id: 'desdemona', navn: 'Desdemona', afstand: 62700, r: 35, døgn: 0.47365, albedo: 0.08, start: 82, frø: 2 },
  { id: 'cupid', navn: 'Cupid', afstand: 74390, r: 9, døgn: 0.613, albedo: 0.07, start: 200, frø: 3 },
  { id: 'belinda', navn: 'Belinda', afstand: 75300, r: 45, døgn: 0.623527, albedo: 0.07, start: 186, frø: 4 },
];

// Antallet af kendte måner (NASA, "as of August 2026", og JPL SSD med S/2025 U1)
export const ANTAL = 29;
export const ANTAL_DATO = 'august 2026';

// Hvor ofte den inderste af to måner indhenter den yderste (døgn)
export const overhaling = (a, b) => 1 / Math.abs(1 / a.døgn - 1 / b.døgn);

// Vinkeldiameter (grader) af en kugle med radius r set fra afstanden d (samme enhed)
export const synsvinkel = (r, d) => (2 * Math.asin(r / d) * 180) / Math.PI;
