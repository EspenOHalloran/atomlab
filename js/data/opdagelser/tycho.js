// Teksterne i bogen om Tycho Brahe og den nye stjerne (docs/drejebog-tycho.md, jeres go 19. november 2026: kernesætning A).
// Kilderne står i docs/fakta-videnskabsfolk/tycho.md (faktatjekket af Opus i stedet for Fable). Uden DOM, så testene i
// Node kan læse dem.
//
// T1 (19. november 2026): forsiden. Kun de opslag, der er bygget, står i OPSLAG (E20 fund 6, stilguiden A9). Turen "Den
// nye stjerne" kommer i T2, gåden, bogen fra 1573 og "Om Tycho" i T3.

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
];
