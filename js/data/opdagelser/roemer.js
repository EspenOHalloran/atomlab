// Teksterne i bogen om Ole Rømer og lyset, der bruger tid (docs/drejebog-roemer.md, jeres svar 21. november 2026: "Ja
// til alle anbefalinger", altså kernesætning A). Kilderne står i docs/fakta-videnskabsfolk/roemer.md (faktatjekket af Opus
// i stedet for Fable). Uden DOM, så testene i Node kan læse dem.
//
// R1 (27. november 2026): forsiden. Kun de opslag, der er bygget, står i OPSLAG (E20 fund 6, stilguiden A9). Turen
// "Himlens ur" kommer i R2, og gåden, tidsskriftet fra 1677 og "Om Rømer" i R3 (drejebogen afsnit 15).

// Jupiter og de fire store måner, som man så dem i en kikkert i 1676: prikker på en linje, fordi vi ser deres baner næsten
// fra kanten. x er afstanden fra Jupiters midte i Jupiter-radier, set fra Jorden (minus er til venstre), og y en lille
// hældning. Stillingen er opdigtet, men kan godt ske: Hver måne står tættere på end sin bane (Io 5,9, Europa 9,4,
// Ganymedes 15,0 og Callisto 26,3 Jupiter-radier, NSSDC). Banerne er i rigtig rækkefølge, Io er den inderste
export const BANE_RADIUS = { Io: 5.9, Europa: 9.4, Ganymedes: 15.0, Callisto: 26.3 };
export const KIKKERT_MÅNER = [
  { navn: 'Callisto', x: -7.4, y: 0.25 },
  { navn: 'Europa', x: -4.2, y: 0.12 },
  { navn: 'Io', x: 3.1, y: -0.08 },
  { navn: 'Ganymedes', x: 6.7, y: -0.18 },
];

export const FORSIDE = {
  // Bogens røde tråd (drejebogen afsnit 2): alle fem opslag svarer på dette spørgsmål
  spørgsmål: 'Hvorfor kom Io for sent?',
  // Vignetten under introduktionen (drejebogen afsnit 4): Jupiter med de fire måner på en linje i kikkertens
  // mørke synsfelt (js/bog.js tegner den). Kun Io har navn, for det er den, bogen handler om
  kikkert: {
    måner: KIKKERT_MÅNER,
    navn: 'Io',
    tekst: 'Jupiter og de fire store måner på en linje, som man så dem i en kikkert i 1676.',
    alt: 'En mørk stribe af nattehimmel med Jupiter som en lille, stribet skive i midten og fire små måner på en linje, to på hver side. Den nærmeste til højre er Io.',
  },
  navn: 'Ole Rømer',
  liv: '1644-1710',
  // Conings maleri er kun dateret "omkring 1700", og Rømer fyldte 56 i september 1700 (født 25. september 1644, fakta
  // afsnit 1). Derfor "omkring 56"
  portrætTekst: 'Maleri af Jacob Coning fra omkring 1700. Rømer var omkring 56.',
  portrætAlt: 'Ole Rømer med en stor, krøllet paryk og et hvidt halsklæde, tegnet som et gammelt kobberstik.',
  begynd: 'Begynd',
  // Introduktionen (den røde tråd fra begyndelsen, drejebogen afsnit 4). Faktatjekket (fakta afsnit 1-3): Io er den
  // inderste af de fire, formørkelserne blev brugt som et ur (Cassinis tabeller), Rømer arbejdede på observatoriet i Paris
  // fra 1672, og han havde sagt til Akademiet "fra begyndelsen af september", at Io den 9. november ville komme 10
  // minutter senere, end iagttagelserne fra august gav (Phil. Trans. s. 894). "For tidligt" og "for sent" er i forhold til
  // tabellerne (tidligere, når Jorden er tæt på Jupiter, senere, når den er langt væk). Skriv ikke 16. november (fælden i
  // faktafilen afsnit 3). Alderen (32) venter til turen
  intro: {
    sted: 'Paris, 1676',
    tekst: 'Jupiters måner går rundt om Jupiter så regelmæssigt, at astronomerne bruger dem som et ur på himlen. Men den inderste, Io, går ikke til tiden: Nogle gange dukker den op for tidligt, andre gange for sent. En ung dansker på observatoriet, Ole Rømer, tror, han ved hvorfor, og han siger til de lærde i Akademiet, at Io i november kommer 10 minutter for sent. Hvordan kan han vide det?',
  },
};

export const OPSLAG = [
  { id: 'forside', slags: 'forside' },
];
