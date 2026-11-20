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
  // T3: gåden "Tychos tal" (js/bog/tycho-gaade.js), de fire sider fra 1573 (BOGEN, js/bog.js) og "Om Tycho" (OM)
  { id: 'gaaden', slags: 'scene', titel: 'Tychos tal' },
  { id: 'bogen', slags: 'sider', titel: 'Bogen fra 1573' },
  { id: 'om', slags: 'om', titel: 'Om Tycho' },
];

// Vejene fra "Det så du" (drejebogen afsnit 5, trin 5). En vej til et opslag står kun, når opslaget er bygget (stilguiden
// A9). sætning er den røde tråd videre til gåden (T3).
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

// ---------- Gåden: Tychos tal (T3, drejebogen afsnit 6) ----------
// Kortet i gåden er tegnet som Tychos kort (s. B1b, n45) med bogstaverne A-H og uden I (den nye stjerne skal man selv
// finde). De tre stjerner, han ikke målte til, står kun på kortet: A hovedet (ζ Cas), C bæltet (η Cas) og H midten af
// stolen (κ Cas). Pladserne er J2000 (afrundet, ra i timer, dek i grader, tjekket mod Wikipedia/Gaia DR3 19. november
// 2026), og bogstaverne er Tychos (fakta afsnit 3). A, C og H er vores bud efter kortet og Ptolemæus' navne (hoved,
// bælte og stolens midte).
export const KORT_EKSTRA = [
  { id: 'zeta', navn: 'ζ Cassiopeiae', tycho: 'A', ra: 0.6162, dek: 53.897, mag: 3.66 },
  { id: 'eta', navn: 'η Cassiopeiae', tycho: 'C', ra: 0.8184, dek: 57.815, mag: 3.44 },
  { id: 'kappa', navn: 'κ Cassiopeiae', tycho: 'H', ra: 0.5500, dek: 62.932, mag: 4.16 },
];
// Kortet drejes som Tychos (ca. 46°, målt på n45): F og E nede til venstre, D i midten, C, B og A til højre, G øverst
// til højre og den nye stjerne øverst over H
export const KORT_DREJ = 46;
export const påKortet = (stjerner) => projicer(stjerner, { drej: KORT_DREJ });

// Tychos tre tal (s. B1b og B2, n45-n46): afstanden fra den nye stjerne til Schedir (B), stolens top (G) og bøjningen ved
// hoften (D). iDag er vores udregning med stjernernes pladser og midten af resten af supernovaen (fakta afsnit 3):
// 7° 50,0′, 5° 20,7′ og 4° 59,4′-5° 0′ (midten af resten er ikke præcis stjernens sted).
export const TYCHOS_TAL = [
  { tycho: 'B', id: 'schedar', navn: 'Schedir', hvor: 'brystet', grader: 7, minutter: 55, iDag: '7° 50′' },
  { tycho: 'G', id: 'kaph', navn: 'Stolens top', hvor: 'stolens top', grader: 5, minutter: 21, iDag: '5° 21′' },
  { tycho: 'D', id: 'gamma', navn: 'Hoften', hvor: 'bøjningen ved hoften', grader: 5, minutter: 1, iDag: '5° 0′' },
];
export const talGrader = (t) => t.grader + t.minutter / 60;

const enhed = (s) => [Math.cos(s.dek * GR) * Math.cos(s.ra * 15 * GR), Math.cos(s.dek * GR) * Math.sin(s.ra * 15 * GR), Math.sin(s.dek * GR)];
const tilStjerne = (v) => ({ ra: ((Math.atan2(v[1], v[0]) / GR / 15) + 24) % 24, dek: Math.asin(Math.max(-1, Math.min(1, v[2]))) / GR });
const kryds = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const prik = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// Vinklen mellem to stjerner på himlen i grader (en kugletrekant, som Tycho regnede med)
export const afstand = (a, b) => vinkel(enhed(a), enhed(b));

// Cirklen på himlen med radius r grader om stjernen s som n punkter { ra, dek } (en lille cirkel på himmelkuglen. På
// kortet er den næsten, men ikke helt rund)
export function cirkel(s, r, n = 120) {
  const c = enhed(s);
  const u0 = Math.abs(c[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = kryds(c, u0), ul = Math.hypot(...u);
  const e1 = u.map((x) => x / ul), e2 = kryds(c, e1);
  const cr = Math.cos(r * GR), sr = Math.sin(r * GR);
  return Array.from({ length: n + 1 }, (_, i) => {
    const v = (i / n) * 2 * Math.PI;
    return tilStjerne(c.map((x, k) => cr * x + sr * (Math.cos(v) * e1[k] + Math.sin(v) * e2[k])));
  });
}

// De to steder, hvor cirklerne om a (radius ra grader) og b (radius rb) mødes, eller [] hvis de ikke rører hinanden
export function mødes(a, ra, b, rb) {
  const p = enhed(a), q = enhed(b);
  const c = prik(p, q), x = Math.cos(ra * GR), y = Math.cos(rb * GR);
  const n = 1 - c * c;
  const α = (x - c * y) / n, β = (y - c * x) / n;
  const m = p.map((v, i) => α * v + β * q[i]);
  const rest = 1 - prik(m, m);
  if (rest < 0) return [];
  const k = kryds(p, q), kl = Math.hypot(...k), t = Math.sqrt(rest) / kl;
  return [1, -1].map((f) => tilStjerne(m.map((v, i) => v + f * t * k[i])));
}

// Opslaget "Tychos tal" (drejebogen afsnit 6). Forordet er broen fra turen. Faktatjekket 19. november 2026: Brevet til
// Pratensis foran i bogen er skrevet på Knudstrup 5. maj 1573 ("Datæ Knusdorp die 5. Maj, Anno 1573", n35), de tyske
// skrifter (n31, n33: "in chartis illis è Germania ad vos allatis") kaldte den en komet 12 eller højst 15 jordradier væk,
// så den ville flytte sig 3⅓-4¼° nær horisonten, og det kunne ses med øjnene alene (n32). Instrumentet kunne vise alle
// minutter (n45). Tallene: n45-n46. Han regnede mest med de to sidste (D og G) og vidste, hvilken side den stod på.
export const GÅDE = {
  forord: {
    sted: 'Knudstrup, foråret 1573',
    tekst: 'Tycho får nogle skrifter fra Tyskland. De kalder stjernen en komet og siger, at den kun er 12-15 gange Jordens radius væk, langt tættere på end Månen. Tycho bliver vred: Så ville den hoppe over tre grader, og det kunne enhver se med øjnene! Han har målt afstanden fra den nye stjerne til tre stjerner i Cassiopeia med et fint instrument, der kan vise ned til et minut (en tresindstyvendedel af en grad).',
    lille: 'Kan du finde stjernen ud fra hans tal?',
    knap: 'Prøv gåden',
  },
  titel: 'Tychos kort',
  alt: 'Tychos kort over Cassiopeia med stjernerne A til H som sorte træsnitsstjerner i en dobbelt ramme. Den nye stjerne mangler.',
  linjer: {
    start: 'Tryk på en stjerne med et tal. Så slår passeren en cirkel: Den nye stjerne står et sted på den.',
    én: 'Den nye stjerne står et sted på cirklen. Tag et tal mere.',
    to: 'To steder passer. Hvilket af dem? Tag det tredje tal.',
    tre: 'Tryk der, hvor alle tre cirkler mødes.',
    begge: 'Det kan være begge steder. Tag det tredje tal.',
    kunTo: 'Her mødes kun to af cirklerne.',
    løst: 'Alle tre passer.',
  },
  // Knapperne med tallene: "B Schedir 7° 55′" (et hårdt mellemrum i tallet)
  talTekst: 'Tychos tal',
  ny: 'I · Den nye stjerne',
  iDag: {
    titel: 'Og i dag?',
    tekst: 'Tycho ramte inden for 5 minutter, en sjettedel af Månens bredde, uden kikkert.',
    note: 'Tallene i dag er vores udregning ud fra stjernernes pladser.',
  },
  videre: 'Se tallene i bogen fra 1573',
  løstFør: 'du har løst den før ✓',
  igen: 'Prøv igen',
};

// ---------- Bogen fra 1573 (T3, drejebogen afsnit 7) ----------
// Faksimilen fra 1901 (Toronto-eksemplaret på archive.org, operumprimitiasd00brahuoft, KILDER.md, lavet med
// lav_bogsider.py tycho): fire sider som en sti fra den første aften til stjernen, der falmer. felter er stedets firkanter i
// % af billedet [venstre, top, bredde, højde], målt med blækket i rækker og søjler og tegnet oven på siden. Latinen er læst
// på siderne (fakta afsnit 2-4), med s for det lange s og u for v. Oversættelsen er vores egen (Opus' i stedet for
// Fable, kan tjekkes af Fable senere, plan-fable.md).
export const BOGEN = {
  titel: 'Bogen fra 1573',
  intro: 'De nova stella (Om den nye stjerne) blev trykt i København i 1573. Tycho skrev den på latin og ville først ikke udgive den. Følg stjernen fra den første aften, til den falmer.',
  næste: 'Næste side',
  sidst: 'Havde han ret?',
  vælg: 'Tryk på et sted, der lyser. Så kommer latinen og vores oversættelse.',
  stedLatin: 'Latin',
  stedDansk: 'På dansk',
  sider: [
    {
      id: 'a', fane: 'Aftenen', fil: 'billeder/biblioteket/tycho-a.webp', b: 1000, h: 1558,
      alt: 'Side A med overskriften DE NOVA ET NVLLIVS ÆVI MEMORIA og latinsk tekst i kursiv, der begynder med et stort, pyntet A.',
      om: 'Først aftenen: Den 11. november 1572 ser Tycho en ny stjerne næsten lige over sit hoved. Han tror ikke på sine egne øjne, før andre også kan se den.',
      steder: [
        {
          id: 'aften', navn: 'Den 11. november', felter: [[43.8, 33.0, 36.2, 2.6], [28.5, 35.4, 22, 2.4]],
          latin: 'die eiusdem undecimo, vesperi post Solis occasum',
          dansk: 'den 11. i samme måned (november) om aftenen efter solnedgang. I vores kalender var det den 21. november.',
        },
        {
          id: 'hoved', navn: 'Lige over hovedet', felter: [[69.4, 40.2, 10.4, 2.7], [15.2, 42.5, 17.7, 2.7]],
          latin: 'iuxta capitis verticem',
          dansk: 'næsten lige over mit hoved (ordret: ved toppen af hovedet). Den nye stjerne stod højt på himlen den aften.',
        },
        {
          id: 'tvivl', navn: 'Han tvivlede på sine øjne', felter: [[44.3, 56.8, 35.3, 2.8], [15.5, 59.4, 34, 2.6]],
          latin: 'ut de fide, propriis oculis adhibenda, dubitare non puduerit',
          dansk: 'så jeg ikke skammede mig over at tvivle på, om jeg kunne stole på mine egne øjne. Først da andre også kunne se den, var han sikker.',
        },
      ],
    },
    {
      id: 'b1b', fane: 'Kortet', fil: 'billeder/biblioteket/tycho-b1b.webp', b: 1000, h: 1558,
      alt: 'Side B1b med Tychos kort over Cassiopeia: sorte stjerner med bogstaverne A til I i en dobbelt ramme og latinsk tekst under.',
      om: 'Så målingen: Hans kort over Cassiopeia med den nye stjerne I. Under kortet står det første af hans tal, 7° 55′ til Schedir.',
      steder: [{
        id: 'kortet', navn: 'Stjernen I og Schedir', felter: [[45.5, 21.3, 12.5, 7], [48.3, 73.0, 37.4, 2.6], [20.7, 75.3, 49.6, 2.8]],
        latin: 'I Noua stella … ab ea, quæ est in pectore, Schedir appellata B, 7. partibus & 55. minutis',
        dansk: 'I er den nye stjerne. Han fandt, at den er 7 grader og 55 minutter fra stjernen i brystet, der hedder Schedir (B). Det er det tal, du brugte i gåden.',
      }],
    },
    {
      id: 'brevet', fane: 'Brevet', fil: 'billeder/biblioteket/tycho-brevet.webp', b: 1000, h: 1558,
      alt: 'En side med tæt latinsk tekst i kursiv fra Tychos brev til Pratensis.',
      om: 'Så beviset: I brevet til vennen Pratensis foran i bogen regner han ud, hvor meget stjernen ville flytte sig, hvis de tyske skrifter havde ret. Og så skælder han ud.',
      steder: [{
        id: 'tykhoveder', navn: 'O tykke hoveder!', felter: [[14.5, 17.2, 25.5, 1.7], [29.2, 18.9, 17, 1.7], [68.8, 22.5, 11.2, 1.7], [14.7, 24.2, 30.3, 1.8]],
        latin: 'paralaxin 3 Grad. plus ⅓ … 4. partium cum ¼ … O crassa ingenia. O cæcos cœli spectatores.',
        dansk: 'Var den kun 15 jordradier væk, ville den nær horisonten flytte sig 3⅓ grad, og var den 12 væk, 4¼ grad. Det kunne enhver se med øjnene. "O tykke hoveder! O blinde iagttagere af himlen!"',
      }],
    },
    {
      id: 'd2', fane: 'Farven', fil: 'billeder/biblioteket/tycho-d2.webp', b: 1000, h: 1558,
      alt: 'Side D2 med latinsk tekst i kursiv om stjernens farve.',
      om: 'Til sidst falmer stjernen: Den var hvid som Jupiter, blev rødlig og var i maj 1573 bleg som Saturn. I begyndelsen af 1574 var den væk.',
      steder: [{
        id: 'farven', navn: 'Rød som Aldebaran', felter: [[69.4, 42.8, 10.8, 1.8], [15.8, 45.1, 64.3, 1.9], [15.8, 47.5, 7.4, 1.9]],
        latin: 'qualis est Aldeboræ, aut illius, quæ in dextro humero Orionis rubescit',
        dansk: 'som Aldebaran eller stjernen, der lyser rødt i Orions højre skulder. Den stjerne er Betelgeuse, en kæmpestjerne, der selv bliver en supernova en dag.',
      }],
    },
  ],
  // Linje for linje (drejebogen afsnit 7): sætning for sætning ved de linjer, den hører til
  linjer: {
    titel: 'Linje for linje',
    linje: 'Hele teksten på latin og dansk, sætning for sætning.',
    note: 'Oversættelsen fra latin er vores egen. Det lange s (ſ) er skrevet som s og v som u.',
    rækker: [
      { side: 'a', linjer: 'Overskriften', latin: 'DE NOVA ET NULLIUS ÆVI MEMORIA, A MUNDI EXORDIO PRIUS CONSPECTA STELLA, quæ in fine Anni superioris omnium primò apparuit.', dansk: 'Om den nye stjerne, som aldrig før er set i nogen tids erindring siden verdens begyndelse, og som viste sig første gang sidst på året, der gik.' },
      { side: 'a', linjer: 'Linje 1-7', latin: 'Anno præcedente, mense Novembri, die eiusdem undecimo, vesperi post Solis occasum, cùm meo more sidera cœlo sereno contemplarer, novam quandam & inusitatam, præq; aliis admodum conspicuam, iuxta capitis verticem, animadverti fulgere Stellam:', dansk: 'Sidste år, den 11. november om aftenen efter solnedgang, mens jeg efter min vane så på stjernerne på den klare himmel, opdagede jeg en ny og usædvanlig stjerne, der lyste meget tydeligere end de andre, næsten lige over mit hoved.' },
      { side: 'a', linjer: 'Linje 7-14', latin: 'cumq; mihi, qui inde ferè à pueritia, omnia cœli sidera perfectè (non enim magna huic scientiæ inest difficultas) cognita haberem, satis evidenter constaret, nullam in eo cœli loco unquam antea extitisse, vel minimam, nedum tam conspicuæ claritatis stellam: in tantam rei istius admirationem sum adductus, ut de fide, propriis oculis adhibenda, dubitare non puduerit.', dansk: 'Jeg har kendt alle himlens stjerner helt nøjagtigt, næsten fra jeg var dreng (det er ikke svært), og jeg var helt sikker på, at der aldrig før havde stået nogen stjerne på det sted, ikke engang den mindste, slet ikke en så klar. Derfor blev jeg så forbløffet, at jeg ikke skammede mig over at tvivle på mine egne øjne.' },
      { side: 'a', linjer: 'Linje 14-17', latin: 'Cùm verò & ab aliis loco monstrato conspici posse animadvertissem, stellam reverà illic apparere, nullum mihi amplius movebatur dubium.', dansk: 'Men da jeg så, at også andre kunne se den, når jeg viste dem stedet, var jeg ikke længere i tvivl om, at stjernen virkelig var der.' },
      { side: 'a', linjer: 'Linje 17-21', latin: 'Miraculum sanè inter omnia, quæ à mundi exordio, in tota rerum natura extiterunt, aut maximum, aut illi certè æquiparandum, quod in Solaris cursus retentione, Iosuæ precibus impetrata …', dansk: 'Sandelig et mirakel. Enten det største af alle, der har vist sig i hele naturen siden verdens begyndelse, eller i hvert fald lige så stort som dengang, Solen standsede i sit løb, fordi Josva bad om det …' },
      { side: 'b1b', linjer: 'Kortet', latin: 'A caput Cassiopeæ, B pectus Schedir, C Cingulum, D flexura ad Ilia, E Genu, F Pes, G suprema Cathedræ, H media Cathedræ, I Noua stella.', dansk: 'A Cassiopeias hoved, B brystet (Schedir), C bæltet, D bøjningen ved hoften, E knæet, F foden, G toppen af stolen, H midten af stolen, I den nye stjerne.' },
      { side: 'b1b', linjer: 'Under kortet', latin: 'Distantiam verò huius stellæ à fixis aliquibus in hac Cassiopeiæ constellatione, exquisito instrumento, & omnium minutorum capaci, aliquoties observavi. Inveni autem eam distare ab ea, quæ est in pectore, Schedir appellata B, 7. partibus & 55. minutis:', dansk: 'Afstanden fra denne stjerne til nogle af stjernerne i Cassiopeia har jeg målt flere gange med et fint instrument, der kan vise alle minutter. Jeg fandt, at den er 7 grader og 55 minutter fra stjernen i brystet, der hedder Schedir (B).' },
      { side: 'brevet', linjer: 'Linje 1-4', latin: '… carere, visus diversitate: cùm tamen, si 15 saltem removeretur terræ semidiametris, ut illi sentiunt, in circulo Verticali, Horizonti vicina, paralaxin 3 Grad. plus ⅓ induxisset: sin verò 12. saltem (ut alii volunt) eandem, 4. partium cum ¼ effecisset.', dansk: '… (at stjernen er) uden parallakse. Var den kun 15 jordradier væk, som de mener, ville den nær horisonten flytte sig 3⅓ grad, og var den kun 12 væk (som andre vil have det), 4¼ grad.' },
      { side: 'brevet', linjer: 'Linje 4-7', latin: 'Hæ verò tantæ differentiæ loci illius, à maxima altitudine in minimam, etiam sine instrumento, solis oculis, diligenter consideranti animadverti poterant. O crassa ingenia. O cæcos cœli spectatores.', dansk: 'Så store forskelle i dens plads, fra den står højest til lavest, kunne enhver, der så godt efter, se uden instrument, med øjnene alene. O tykke hoveder! O blinde iagttagere af himlen!' },
      { side: 'd2', linjer: 'Linje 9-16', latin: 'Quantùm verò ad colorem huius stellæ attinet, non semper eundem retinuit, sed ab initio albicans videbatur, & propius Ioviali splendori accessit: progressu autem temporis, lumine coarctato & inspissato, in rutilantem & Martium fulgorem degeneravit: qualis est Aldeboræ, aut illius, quæ in dextro humero Orionis rubescit.', dansk: 'Farven har ikke altid været den samme. I begyndelsen så den hvidlig ud og lignede mest Jupiters glans. Men efterhånden som lyset blev mindre og tættere, blev den til en rødlig glød som Mars, som Aldebaran eller stjernen, der lyser rødt i Orions højre skulder.' },
      { side: 'd2', linjer: 'Linje 16-21', latin: 'Non tamen usq; adeo rutilans fuit, quemadmodum hæc in humero, sed propius ad colorem Aldeboræ accessit. Nunc autem relicto isto Martio rubore, in lividam transiit albedinem, ita ut hoc mense Maio, quiddam Saturnium & Veneri simile præ se ferat.', dansk: 'Den var dog ikke så rød som stjernen i skulderen, men nærmere Aldebarans farve. Nu har den forladt den røde farve og er blevet bleg og hvidlig, så den her i maj ligner Saturn og Venus lidt.' },
    ],
  },
};

// ---------- Om Tycho (bogens sidste opslag, T3, drejebogen afsnit 8) ----------
// Budgettet: titel, højst to tal, højst tre sætninger, højst fire spørgsmål. Derefter "Vil du vide mere?" og "Ærligt
// talt", lukkede. Kilderne står i docs/fakta-videnskabsfolk/tycho.md (afsnittene står ved hvert punkt). Ærligt talt har
// også det, turen snyder med (listen øverst i js/bog/tycho.js og drejebogen afsnit 15 under T2).
export const OM = {
  titel: 'Om Tycho',
  navn: 'Tycho Brahe (1546-1601)',
  tal: [
    { tal: '25 år', tekst: 'da han så den nye stjerne' },
    { tal: '7° 55′', tekst: 'til Schedir, både når den stod højt og lavt' },
  ],
  // Fakta afsnit 1 (stjerneparallaksen og 1838) og 3 (langt over Månen)
  sætninger: 'Tycho havde ret: Stjernen var langt bag Månen, og himlen kan forandre sig. Men han troede, at Jorden stod stille, blandt andet fordi han ikke kunne se stjernerne flytte sig, mens Jorden går rundt om Solen. Det gør de, men så lidt, at det først blev målt i 1838.',
  // Gør det selv (drejebogen afsnit 9): Hvid dværg i Kosmos. Knappen hedder "▶ Lad den suge gas" dér
  knap: {
    tekst: 'Se en stjerne eksplodere', gaa: 'kosmos:hviddvaerg',
    linje: 'Tryk på "Lad den suge gas". Når den hvide dværg eksploderer, viser grafen, hvordan lyset falder bagefter, ligesom Tychos stjerne blev svagere måned for måned.',
  },
  // Et stille link under Gør det selv (jeres idé og go 20. november 2026): Betelgeuse som sit eget fænomen i Kosmos.
  // 1572 var type Ia (lysekkoet 2008, fakta afsnit 6). Betelgeuse er en rød kæmpe og ender med et kernekollaps
  // (type II). Hvornår, ved ingen (Supernova i Kosmos: "måske først om 100.000 år")
  ekstra: {
    tekst: 'Sådan ville en ny stjerne se ud i dag: Betelgeuse', gaa: 'kosmos:betelgeuse',
    linje: 'Tychos stjerne var en hvid dværg, der eksploderede (type Ia), mens Betelgeuse bliver en anden slags supernova: en kæmpestjerne, hvis kerne falder sammen, og ingen ved, hvornår det sker.',
  },
  hvorfor: [
    {
      // Fakta afsnit 2 (Aristoteles og himlen bag Månen)
      spørgsmål: 'Hvorfor troede man, at himlen aldrig forandrer sig?',
      svar: 'Siden den græske filosof Aristoteles havde man lært, at alt bag Månen er evigt og fuldkomment. Det, der kom og gik, som kometer, troede man var i luften tæt på Jorden. Den nye stjerne passede ikke ind.',
    },
    {
      // Fakta afsnit 5 (brevet n29-n35 og indledningen 1901)
      spørgsmål: 'Hvorfor ville han ikke udgive bogen?',
      svar: 'Det blev set som upassende for en adelsmand at skrive bøger. Hans venner, lægen Johannes Pratensis og slægtningen Peder Oxe, blev ved med at spørge. Da han læste de tyske skrifter, der kaldte stjernen en komet, gav han efter, og bogen udkom i 1573.',
    },
    {
      // Fakta afsnit 6 (type Ia, lysekkoet 2008). Hvordan den hvide dværg fik gassen, er ikke helt sikkert (hviddvaerg.js)
      spørgsmål: 'Hvad var stjernen egentlig?',
      svar: 'En hvid dværg, resten af en stjerne som Solen, der eksploderede: en supernova. Den fik nok gas fra en nabostjerne, til den blev for tung (forskerne er ikke helt enige). I 2008 fandt man lys fra eksplosionen, der var blevet kastet tilbage af støvskyer (et lysekko), og det viste, hvilken slags den var.',
    },
    {
      // Fakta afsnit 1 (Hven 1576, 21 år, Kepler)
      spørgsmål: 'Hvad skete der bagefter?',
      svar: 'Bogen gjorde ham kendt. I 1576 gav kong Frederik 2. ham øen Hven, hvor han byggede Uranienborg og målte stjernerne og planeterne nat efter nat i 21 år. Senere brugte Johannes Kepler hans målinger til at finde ud af, hvordan planeterne går rundt om Solen.',
    },
  ],
  nørd: {
    titel: 'Vil du vide mere?',
    linje: 'Tallene, Månen, lyset og afstanden.',
    punkter: [
      'Tychos tal mod i dag: Schedir 7° 55′ (7° 50′), stolens top 5° 21′ (5° 21′) og hoften 5° 1′ (5° 0′). Nutidens tal er vores udregning ud fra stjernernes pladser og midten af resten af supernovaen.',
      'Var stjernen lige under Månen (52 jordradier, som Kopernikus regnede), ville den flytte sig 58½ minutter fra højt til lavt (side C3b). Månen er i dag ca. 60 jordradier væk.',
      'Den var klarere end Venus i november, og nogle kunne se den om dagen. I maj 1573 var den som en stjerne af anden størrelse, og i begyndelsen af 1574 var den væk.',
      'Afstanden i dag: ca. 8.000-12.000 lysår (skønnene er uenige). Resten blev fundet med radio i 1952 og kan ses i røntgen.',
      'Bogens titel, De nova stella, gav navnet: I dag hedder sådan en "nova" eller "supernova".',
      'Stjerneparallaksen, Tycho ledte efter, blev målt af Friedrich Bessel i 1838: 0,3 buesekunder for stjernen 61 Cygni.',
    ],
  },
  ærligt: {
    titel: 'Ærligt talt',
    linje: 'Det, vi har gjort enklere eller selv har fundet på.',
    punkter: [
      'Tycho var ikke den første, der så stjernen. Den dukkede op i begyndelsen af november, og mange så den, også i Kina. Men han målte den meget nøjagtigt og skrev bogen om den.',
      'Han målte den høj og lav over flere måneder, ikke på én nat. I bogen drejer du himlen med et træk.',
      'Tommelfingeren og Jorden med Månen i turen er ikke i rigtig størrelse: Månen er ca. 60 jordradier væk, men tegnet kun ca. 2½. Månens hop fra toppen til siden af Jorden er ca. 1 grad.',
      'Instrumentet er tegnet som en passer med en bue. Hvordan hans så ud i 1572, ved vi ikke præcist.',
      'Klostertaget i turen står højere end et rigtigt tag, så man kan se, når stjernen står lavt.',
      'Lysstyrken måned for måned er omtrentlig. Tycho skriver, i hvilken rækkefølge farverne kom, men hvilke måneder før maj, er vores bud.',
      'Han regnede stedet ud med to af tallene og vidste i forvejen, hvilken side af de to stjerner den stod på. I gåden bruger du det tredje tal til at vælge.',
      'Datoerne er i den gamle kalender. I vores kalender var aftenen den 21. november 1572.',
      'Han havde en kunstig næse efter en duel. Den var af messing, ikke af guld og sølv, som historien siger (en analyse i 2012).',
      'Billederne i turen er vores egne tegninger. Kortet i gåden er tegnet efter hans kort, men med stjernernes rigtige pladser. Fortælleren er vores, og oversættelsen fra latin er vores egen.',
      'Portrættet er et kobberstik fra 1586. Vi har lagt det samme filter over som de andre, så alle personerne i bogreolen ligner hinanden.',
    ],
  },
};
