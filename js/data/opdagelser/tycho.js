// Teksterne i bogen om Tycho Brahe og den nye stjerne (docs/drejebog-tycho.md, jeres go 19. november 2026: kernesætning A).
// Kilderne står i docs/fakta-videnskabsfolk/tycho.md (faktatjekket af Opus i stedet for Fable). Uden DOM, så testene i
// Node kan læse dem.
//
// T1 (19. november 2026): forsiden. Kun de opslag, der er bygget, står i OPSLAG (E20 fund 6, stilguiden A9). T2 (samme
// dag): turen "Den nye stjerne" (forløbet i js/data/forloeb/tycho.js, tegningerne i js/bog/tycho.js) og himlen over
// Herrevad nedenfor. Gåden, bogen fra 1573 og "Om Tycho" kommer i T3.

// Cassiopeia og den nye stjerne (drejebogen afsnit 3 og 4). De rigtige pladser (J2000 efter SIMBAD, afrundet: ra i timer,
// dek i grader) og lysstyrken (størrelsesklasse). Bogstavet er det, Tycho satte ved stjernen på sit kort (s. B1b, n45):
// A hovedet, B brystet (Schedir), D bøjningen ved hoften, E knæet, F foden, G stolens top og I den nye stjerne.
// Stjernen i 1572 havde ingen fast lysstyrke: I november 1572 var den klarere end Jupiter og Venus (fakta afsnit 4). Her tegnes den bare størst,
// som Tycho gjorde.
export const CASSIOPEIA = [
  { id: 'kaph', navn: 'Kaph (β)', tycho: 'G', ra: 0.1530, dek: 59.150, mag: 2.28 },
  { id: 'schedar', navn: 'Schedar (α)', tycho: 'B', ra: 0.6751, dek: 56.537, mag: 2.24 },
  { id: 'gamma', navn: 'γ Cassiopeiae', tycho: 'D', ra: 0.9451, dek: 60.717, mag: 2.47 },
  { id: 'ruchbah', navn: 'Ruchbah (δ)', tycho: 'E', ra: 1.4303, dek: 60.235, mag: 2.68 },
  { id: 'segin', navn: 'Segin (ε)', tycho: 'F', ra: 1.9066, dek: 63.670, mag: 3.37 },
];
// Resten af supernovaen fra 1572 (SN 1572, "Tychos supernova-rest"), midten af skyen
export const NY_STJERNE = { id: 'ny', navn: 'Den nye stjerne (1572)', tycho: 'I', ra: 0.4214, dek: 64.144, mag: -4 };

// Stjernerne som punkter på et lille kort i grader (x mod højre, y op). Gnomonisk projektion om midten (som et foto af
// himlen), øst til venstre som på himlen, og drejet `drej` grader mod uret. Med drej 22° ligger Kaph og Segin lige højt,
// så W'et står vandret, og den nye stjerne står over det (himlen drejer i løbet af natten, så det er én af de rigtige
// stillinger). Tychos eget kort er drejet ca. 46° (målt på n45 i faksimilen), og hans stjerner ligger ca. 1° fra de rigtige.
export function projicer(stjerner, { ra0 = 0.85, dek0 = 60.5, drej = 22 } = {}) {
  const r = Math.PI / 180;
  const a0 = ra0 * 15 * r, d0 = dek0 * r, v = drej * r;
  return stjerner.map((s) => {
    const a = s.ra * 15 * r, d = s.dek * r;
    const c = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(a - a0);
    const x = -(Math.cos(d) * Math.sin(a - a0) / c) / r; // øst til venstre
    const y = ((Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(a - a0)) / c) / r;
    return { ...s, x: x * Math.cos(v) - y * Math.sin(v), y: x * Math.sin(v) + y * Math.cos(v) };
  });
}

export const FORSIDE = {
  spørgsmål: 'Hvor kom den nye stjerne fra?',
  // Tegningen under introduktionen (js/bog.js tegner den som træsnitsstjerner i en dobbelt ramme, som Tychos kort)
  kort: {
    stjerner: projicer([...CASSIOPEIA, NY_STJERNE]),
    tekst: 'Den nye stjerne over Cassiopeias W, tegnet som stjernerne på Tychos kort.',
    alt: 'Fem stjerner, der danner et W, og over dem en stor, ny stjerne.',
  },
  navn: 'Tycho Brahe',
  liv: '1546-1601',
  portrætTekst: 'Kobberstik af Jacob de Gheyn fra 1586. Tycho var omkring 40.',
  portrætAlt: 'Tycho Brahe med fuldskæg og en høj, kruset krave, tegnet som et gammelt kobberstik.',
  begynd: 'Begynd',
  // Introduktionen (den røde tråd fra begyndelsen, drejebogen afsnit 4). Faktatjekket (fakta afsnit 1-2): 11. november
  // 1572 om aftenen på Herrevad Kloster i Skåne, "næsten lige over sit hoved" (iuxta capitis verticem), han havde kendt
  // alle himlens stjerner "næsten fra barndommen" (ferè à pueritia), og han var 25 (født 14. december 1546). Himlen bag
  // Månen var uforanderlig efter Aristoteles (afsnit 2). Alderen står kun her.
  intro: {
    sted: 'Herrevad, november 1572',
    tekst: 'Siden oldtiden havde man lært, at himlen bag Månen aldrig forandrer sig. Stjernerne havde stået de samme steder, så længe nogen kunne huske. Men en aften står der en ny og strålende stjerne næsten lige over hovedet på Tycho Brahe, en ung dansk adelsmand på 25, der har kendt hver eneste stjerne, siden han var dreng. Hvad er den, og hvor langt væk er den?',
  },
};

export const OPSLAG = [
  { id: 'forside', slags: 'forside' },
  // Turen (T2): forløbet "Den nye stjerne" kører i dette opslag med tegningerne fra js/bog/tycho.js. Bagefter er opslaget
  // et lille laboratorium med de fire kapitler og "Fortæl det igen" (som Huygens)
  { id: 'fortaelling', slags: 'scene', titel: 'Den nye stjerne' },
];

// Vejene fra "Det så du" (drejebogen afsnit 5, trin 5). En vej til et opslag står kun, når opslaget er bygget (stilguiden
// A9), så i T2 er der kun "Tag turen igen". sætning er den røde tråd videre til gåden (T3).
export const VEJE = {
  sætning: 'Men hvordan kunne han være så sikker? Han havde målt afstanden til tre stjerner.',
  veje: [
    { tekst: 'Find stjernen med Tychos tal', opslag: 'gaaden', primær: true },
    { tekst: 'Bladr i bogen fra 1573', opslag: 'bogen' },
    { tekst: 'Tag turen igen', igen: true },
  ],
};

// Laboratoriet efter turen: de fire kapitler som valg (E20, stilguiden B7). "Højt og lavt" er standard, for det er beviset.
export const FRI = {
  linje: 'Træk Cassiopeia rundt, og se, at afstanden til Schedir ikke ændrer sig.',
  igen: 'Fortæl det igen',
  kapitler: [
    { id: 'stjernen', tekst: 'Den nye stjerne', linje: 'Sådan stod den nye stjerne ved Cassiopeia i november 1572.' },
    { id: 'parallakse', tekst: 'Tommelfingeren', linje: 'Skift øje, og flyt Tycho rundt på Jorden. Det, der er tæt på, hopper mest.' },
    { id: 'hoejt', tekst: 'Højt og lavt', linje: 'Træk Cassiopeia rundt, og se, at afstanden til Schedir ikke ændrer sig.' },
    { id: 'falmer', tekst: 'Stjernen falmer', linje: 'Træk månederne frem, og se stjernen blive svagere og skifte farve.' },
  ],
};

// ---------- Himlen over Herrevad (turens trin 1, 3 og 4) ----------
// Herrevad Kloster i Skåne ligger på ca. 56,1° nordlig bredde. Cassiopeia går aldrig ned dér (dek over 34°): Den nye
// stjerne står højest ca. 82° over horisonten (næsten lige over hovedet, som Tycho skrev) og lavest ca. 30°.
export const HERREVAD = 56.1;
// Månen er i gennemsnit ca. 60 jordradier væk (Tycho regnede med 52 til Månens inderste kant, fakta afsnit 3)
export const MÅNE_JORDRADIER = 60;
// Tychos eget tal for afstanden fra den nye stjerne til Schedir (s. B1b, n45): 7° 55′. Med nutidens tal er det ca. 7° 50′
export const TYCHOS_AFSTAND = 7 + 55 / 60;
// Stjernerne omkring Nordstjernen til baggrunden (J2000, afrundet: ra i timer, dek i grader). Kun til tegningen
export const NORDSTJERNEN = { id: 'polaris', navn: 'Nordstjernen', ra: 2.530, dek: 89.264, mag: 1.98 };
export const BAGGRUND = [
  NORDSTJERNEN,
  // Lille Bjørn: Kochab, Pherkad, Yildun, ε, ζ og η
  { ra: 14.845, dek: 74.155, mag: 2.07 }, { ra: 15.345, dek: 71.834, mag: 3.00 }, { ra: 17.537, dek: 86.586, mag: 4.35 },
  { ra: 16.766, dek: 82.037, mag: 4.21 }, { ra: 15.734, dek: 77.795, mag: 4.29 }, { ra: 16.292, dek: 75.755, mag: 4.95 },
  // Kefeus: Alderamin, Alfirk, Errai, ζ og ι
  { ra: 21.310, dek: 62.585, mag: 2.45 }, { ra: 21.478, dek: 70.561, mag: 3.23 }, { ra: 23.656, dek: 77.632, mag: 3.21 },
  { ra: 22.181, dek: 58.201, mag: 3.35 }, { ra: 22.828, dek: 66.200, mag: 3.52 },
  // Perseus (Mirfak) og η Cassiopeiae
  { ra: 3.405, dek: 49.861, mag: 1.79 }, { ra: 0.818, dek: 57.815, mag: 3.44 },
];

const GR = Math.PI / 180;
// Stjernen som enhedsvektor i et fast system for stedet: x mod meridianen på himlens ækvator (mod syd), y mod vest og z
// mod himlens nordpol. θ er stjernetiden i grader (den drejer med himlen), så timevinklen er θ - ra.
function vektor(s, θ) {
  const H = (θ - s.ra * 15) * GR, d = s.dek * GR;
  return [Math.cos(d) * Math.cos(H), Math.cos(d) * Math.sin(H), Math.sin(d)];
}
const ZENIT = [Math.cos(HERREVAD * GR), 0, Math.sin(HERREVAD * GR)];
const vinkel = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) / GR;

// Højden over horisonten i grader
export const højde = (s, θ) => 90 - vinkel(vektor(s, θ), ZENIT);
// Stjernetiden, hvor stjernen står højest (timevinkel 0) eller lavest (timevinkel 180°)
export const højestVed = (s) => s.ra * 15;

// Stjernen på et kort om himlens nordpol med zenit opad (som når man ser mod nord): x mod højre (øst), y op, i grader fra
// polen. Himlen drejer mod uret om Nordstjernen. Afstanden fra polen er rigtig, og vinklen er timevinklen.
export function iPolkort(s, θ) {
  const v = vektor(s, θ);
  const p = vinkel(v, [0, 0, 1]);
  const H = Math.atan2(v[1], v[0]);
  return { x: -p * Math.sin(H), y: p * Math.cos(H) };
}
// Zenit på samme kort (står fast): 90° - bredden over polen
export const ZENIT_PÅ_KORTET = { x: 0, y: 90 - HERREVAD };

// Målingen i trin 3: den nye stjernes højde, afstanden til Schedir (Tychos tal) og "spøgelset", som viser, hvor den ville
// stå, hvis den var lige så tæt på som Månen (set fra Herrevad i stedet for Jordens midte skubbes den mod horisonten,
// mest når den står lavt). Spøgelsets afstand er Tychos tal plus forskellen, så de to tal kan sammenlignes.
export function måling(θ, jordradier = MÅNE_JORDRADIER) {
  const schedir = CASSIOPEIA.find((s) => s.id === 'schedar');
  const e = vektor(NY_STJERNE, θ), es = vektor(schedir, θ);
  const t = e.map((x, i) => jordradier * x - ZENIT[i]);
  const L = Math.hypot(...t);
  const g = t.map((x) => x / L);
  // Spøgelset på polkortet
  const p = vinkel(g, [0, 0, 1]), H = Math.atan2(g[1], g[0]);
  return {
    højde: 90 - vinkel(e, ZENIT),
    afstand: TYCHOS_AFSTAND,
    spøgelse: TYCHOS_AFSTAND + vinkel(g, es) - vinkel(e, es),
    skub: vinkel(g, e),
    spøgelsePå: { x: -p * Math.sin(H), y: p * Math.cos(H) },
  };
}

// Grader som "7° 55′" (et minut er en tresindstyvendedel af en grad)
export function grader(v) {
  let g = Math.floor(v), m = Math.round((v - g) * 60);
  if (m === 60) { g++; m = 0; }
  return `${g}° ${String(m).padStart(2, '0')}′`;
}

// ---------- Stjernen falmer (trin 4) ----------
// Måned for måned efter Tychos egne sammenligninger (fakta afsnit 4, side D-D2): november klarere end Jupiter og Venus,
// december næsten som Jupiter, januar lidt mindre, februar og marts som de klareste stjerner, i begyndelsen af maj 1573
// som stjerner af anden størrelse. Farven: først hvidlig som Jupiter, så rødlig som Aldebaran og i maj bleg som Saturn.
// Den kunne ses til begyndelsen af 1574. mag er en omtrentlig lysstyrke til tegningen (lysest ca. -4 i november), og
// farvernes måneder før maj er vores bud (Tycho giver kun rækkefølgen, så teksterne nævner kun rødt i april, mellem den
// hvide vinter og den blege maj). sammen: de sammenligninger, der lyser op.
export const MÅNEDER = [
  { navn: 'november 1572', mag: -4.0, farve: [255, 251, 238], tekst: 'Klarere end Venus og Jupiter', sammen: ['venus', 'jupiter'] },
  { navn: 'december 1572', mag: -2.4, farve: [255, 248, 230], tekst: 'Næsten som Jupiter', sammen: ['jupiter'] },
  { navn: 'januar 1573', mag: -1.8, farve: [255, 244, 222], tekst: 'Lidt svagere end Jupiter', sammen: ['jupiter'] },
  { navn: 'februar 1573', mag: -0.8, farve: [255, 226, 190], tekst: 'Som de klareste stjerner', sammen: ['klareste'] },
  { navn: 'marts 1573', mag: 0.0, farve: [255, 200, 150], tekst: 'Stadig som de klareste stjerner', sammen: ['klareste'] },
  { navn: 'april 1573', mag: 0.9, farve: [255, 182, 128], tekst: 'Rødlig som Aldebaran', sammen: ['aldebaran'] },
  { navn: 'maj 1573', mag: 2.0, farve: [232, 222, 190], tekst: 'Som stjerner af anden størrelse, og bleg som Saturn', sammen: ['anden', 'saturn'] },
  { navn: 'juni 1573', mag: 2.4, farve: [228, 220, 192], tekst: 'Svagere og svagere', sammen: ['saturn'] },
  { navn: 'juli 1573', mag: 2.8, farve: [226, 220, 196], tekst: 'Svagere og svagere', sammen: ['saturn'] },
  { navn: 'august 1573', mag: 3.1, farve: [224, 220, 198], tekst: 'Svagere og svagere', sammen: ['saturn'] },
  { navn: 'september 1573', mag: 3.4, farve: [222, 220, 200], tekst: 'Svagere og svagere', sammen: [] },
  { navn: 'oktober 1573', mag: 3.8, farve: [220, 220, 202], tekst: 'Svagere og svagere', sammen: [] },
  { navn: 'november 1573', mag: 4.2, farve: [220, 220, 204], tekst: 'Nu er den svær at se', sammen: [] },
  { navn: 'december 1573', mag: 4.7, farve: [220, 220, 206], tekst: 'Næsten for svag til at se', sammen: [] },
  { navn: 'januar 1574', mag: 5.6, farve: [220, 220, 208], tekst: 'Snart væk', sammen: [] },
  { navn: 'februar 1574', mag: 7, farve: [220, 220, 208], tekst: 'Væk. Ingen kan se den mere', sammen: [] },
];
export const MÅNED_MÅL = 14; // begyndelsen af 1574
// Det, Tycho sammenlignede med (de små prikker under skyderen). mag og farve kun til tegningen
export const SAMMENLIGN = [
  { id: 'venus', navn: 'Venus', mag: -4.2, farve: [255, 252, 240] },
  { id: 'jupiter', navn: 'Jupiter', mag: -2.4, farve: [255, 246, 226] },
  { id: 'klareste', navn: 'De klareste stjerner', mag: -0.5, farve: [236, 242, 255] },
  { id: 'aldebaran', navn: 'Aldebaran', mag: 0.9, farve: [255, 178, 122] },
  { id: 'anden', navn: 'Anden størrelse', mag: 2.0, farve: [240, 240, 240] },
  { id: 'saturn', navn: 'Saturn', mag: 0.7, farve: [232, 220, 180] },
];
