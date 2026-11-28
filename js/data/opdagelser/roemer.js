// Teksterne i bogen om Ole Rømer og lyset, der bruger tid (docs/drejebog-roemer.md, jeres svar 21. november 2026: "Ja
// til alle anbefalinger", altså kernesætning A). Kilderne står i docs/fakta-videnskabsfolk/roemer.md (faktatjekket af Opus
// i stedet for Fable). Uden DOM, så testene i Node kan læse dem.
//
// R1 (27. november 2026): forsiden. Kun de opslag, der er bygget, står i OPSLAG (E20 fund 6, stilguiden A9).
// R2 (28. november 2026): turen "Himlens ur" (forløbet i js/data/forloeb/roemer.js, tegningerne i js/bog/roemer.js) og
// tallene bag den: afstanden Jorden-Jupiter fra JPL Horizons, Io's omløb og skygge og aftenen den 9. november.
// R3 (28. november 2026): gåden "Tæl lysets minutter" (GÅDE og perlesnoren, tegningen i js/bog/roemer-gaade.js),
// "Tidsskriftet fra 1677" (BOGEN) og "Om Rømer" (OM), drejebogen afsnit 6-9.

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
  // Turen (R2): forløbet "Himlens ur" kører i dette opslag med tegningerne fra js/bog/roemer.js. Bagefter er opslaget et
  // lille laboratorium med de fire kapitler og "Fortæl det igen" (som Huygens og Tycho)
  { id: 'fortaelling', slags: 'scene', titel: 'Himlens ur' },
  // Gåden (R3): perlesnoren på Rømers tegning (js/bog/roemer-gaade.js, lavGåde)
  { id: 'gaaden', slags: 'scene', titel: 'Tæl lysets minutter' },
  // Kilden selv (R3): s. 893, Fig. 11, s. 894 og Rømers egen liste
  { id: 'tidsskriftet', slags: 'sider', titel: 'Tidsskriftet fra 1677' },
  { id: 'om', slags: 'om', titel: 'Om Rømer' },
];

// Vejene fra "Det så du" (drejebogen afsnit 5, trin 5). En vej til et opslag står kun, når opslaget er bygget (stilguiden
// A9). I R2 var der kun "Tag turen igen", fra R3 også gåden og tidsskriftet. sætning er den røde tråd videre til gåden
export const VEJE = {
  sætning: 'Men hvor mange minutter er lyset om vejen? Rømer tegnede det.',
  veje: [
    { tekst: 'Tæl lysets minutter', opslag: 'gaaden', primær: true },
    { tekst: 'Bladr i tidsskriftet fra 1677', opslag: 'tidsskriftet' },
    { tekst: 'Tag turen igen', igen: true },
  ],
};

// Laboratoriet efter turen: de fire kapitler som valg (E20, stilguiden B7). "For sent" er standard, for det er sporet,
// der ledte Rømer på vej
export const FRI = {
  linje: 'Træk Jorden rundt om Solen, og se, hvornår Io kommer ud af skyggen.',
  igen: 'Fortæl det igen',
  kapitler: [
    { id: 'skyggen', tekst: 'Io i skyggen', linje: 'Træk tiden frem, og se Io forsvinde i Jupiters skygge. Næste gang er 42½ time senere.' },
    { id: 'sent', tekst: 'For sent', linje: 'Træk Jorden rundt om Solen, og se, hvornår Io kommer ud af skyggen.' },
    { id: 'hvorfor', tekst: 'Lysglimtet', linje: 'Send lyset fra Io til Jorden i august og i november, og se, hvor længe det er om vejen.' },
    { id: 'november', tekst: '9. november', linje: 'Se uret og kikkerten den 9. november 1676, og tryk, når Io dukker op.' },
  ],
};

// ---------- Io og Jupiters skygge (turens trin 1 og 4) ----------
// Io går rundt om Jupiter på 1,769 døgn (NSSDC), og fra formørkelse til formørkelse går der 42 timer og 28½ minut,
// fordi Jupiter selv flytter sig lidt om Solen imens (fakta afsnit 2). Bladet siger "about 42½ hours" (s. 893)
export const IO_OMLØB = 42.475; // timer fra formørkelse til formørkelse
// De andre måners omløb i timer (NSSDC: 3,551, 7,155 og 16,689 døgn), kun til tegningen i kikkerten
export const OMLØB = { Io: IO_OMLØB, Europa: 85.23, Ganymedes: 171.7, Callisto: 400.5 };
// Vinklen Sol-Jupiter-Jorden i grader: så meget ser vi skyggen fra siden. Ca. 10° både før og efter oppositionen i 1676
// (Horizons: Jorden-Jupiter 5,5 AE og 62° fra Solen den 9. november). Før oppositionen ligger skyggen til den ene side af
// Jupiter, bagefter til den anden (det er derfor, man ser Io gå ind om foråret og komme ud om efteråret, fakta afsnit 2)
export const SKYGGE_VINKEL = 10;

// Io's sted i kikkerten: x til højre på himlen og z væk fra Jorden, begge i Jupiter-radier. θ er vinklen i banen
// (0 er længst ude til højre, og Io går bag om Jupiter fra højre mod venstre). α er vinklen fra SKYGGE_VINKEL med fortegn
// (plus: skyggen til højre). Skyggen er en cylinder bag Jupiter (halvskyggen er udeladt)
export function ioSted(θ, α, r = BANE_RADIUS.Io) {
  const x = r * Math.cos(θ), z = r * Math.sin(θ);
  const a = α * Math.PI / 180;
  const langs = x * Math.sin(a) + z * Math.cos(a), tværs = x * Math.cos(a) - z * Math.sin(a);
  const iSkygge = langs > 0 && Math.abs(tværs) < 1;
  const bag = z > 0 && Math.abs(x) < 1;
  return { x, z, iSkygge, bag, synlig: !iSkygge && !bag };
}
// Vinklen i banen, hvor Io går ind i skyggen (inde: true) eller kommer ud af den. Regnet: tværs = ±1
export function skyggeKant(α, inde = true, r = BANE_RADIUS.Io) {
  const a = α * Math.PI / 180;
  // x cos a − z sin a = r cos(θ + a) = ±1. Io går bag om Jupiter med θ fra 0 til π, så den rammer +1 før −1
  return Math.acos((inde ? 1 : -1) / r) - a;
}

// ---------- Jorden og Jupiter i 1676 (turens trin 2 og 3) ----------
// Afstanden Jorden-Jupiter i AE hver 5. dag fra 1. juni 1676 (dag 0) til 26. februar 1677 (dag 270), og vinklen mellem
// Solen og Jupiter set fra Jorden i grader. JPL Horizons (COMMAND 599, CENTER 500@399, kl. 0 UT, hentet 28. november
// 2026), afrundet. 14. august: 4,307 AE, 9. november: 5,518 AE (fakta afsnit 4: 4,306 og 5,518 kl. 0 UT)
export const AFSTAND_SKRIDT = 5;
export const AFSTAND = [
  4.3539, 4.3040, 4.2599, 4.2220, 4.1908, 4.1664, 4.1490, 4.1390, 4.1363, 4.1410, 4.1531, 4.1724, 4.1986, 4.2314,
  4.2707, 4.3159, 4.3666, 4.4223, 4.4825, 4.5467, 4.6144, 4.6849, 4.7578, 4.8325, 4.9085, 4.9852, 5.0623, 5.1391,
  5.2152, 5.2901, 5.3635, 5.4350, 5.5042, 5.5706, 5.6339, 5.6939, 5.7502, 5.8027, 5.8510, 5.8949, 5.9342, 5.9688,
  5.9985, 6.0232, 6.0427, 6.0570, 6.0660, 6.0697, 6.0682, 6.0614, 6.0493, 6.0320, 6.0096, 5.9822, 5.9499,
];
export const FRA_SOLEN = [
  139, 145, 150, 155, 160, 166, 171, 176, 178, 173, 167, 162, 157, 151, 146, 141, 136, 131, 126, 121, 116, 111, 106, 101,
  97, 92, 88, 83, 79, 75, 70, 66, 62, 58, 53, 49, 45, 41, 37, 33, 29, 25, 21, 17, 13, 9, 5, 2, 2, 6, 10, 14, 18, 22, 26,
];
export const SIDSTE_DAG = (AFSTAND.length - 1) * AFSTAND_SKRIDT;
// Lyset er 499,005 sekunder om 1 AE (IAU: 1 AE = 149.597.870,7 km, lysets fart 299.792,458 km/s)
export const AE_SEKUNDER = 499.005;
// Dagene, turen bruger (dage efter 1. juni 1676): Jupiter stod modsat Solen 9. juli (Horizons: 179,6°, fakta afsnit 2),
// iagttagelserne i august (bladet s. 894, her 14. august som i faktafilen) og aftenen den 9. november
export const OPPOSITION = 38, AUGUST = 74, NOVEMBER = 161;
// Jupiter er for tæt på Solen til at ses i en kikkert (vores grænse: under 20° fra Solen, fra begyndelsen af januar til
// midten af februar 1677. Jupiter stod bag Solen omkring 23. januar)
export const SES_IKKE_UNDER = 20;

const MÅNEDSNAVNE = ['juni', 'juli', 'august', 'september', 'oktober', 'november', 'december', 'januar', 'februar'];
const MÅNEDSDAGE = [30, 31, 31, 30, 31, 30, 31, 31, 28];
// Dag 0 er 1. juni 1676. { dag, måned, år, nr } (nr er månedens plads fra juni)
export function dato(d) {
  let rest = Math.round(d);
  for (let i = 0; i < MÅNEDSDAGE.length; i++) {
    if (rest < MÅNEDSDAGE[i] || i === MÅNEDSDAGE.length - 1) return { dag: rest + 1, måned: MÅNEDSNAVNE[i], år: i < 7 ? 1676 : 1677, nr: i };
    rest -= MÅNEDSDAGE[i];
  }
  return null;
}
export const datoTekst = (d) => { const x = dato(d); return `${x.dag}. ${x.måned} ${x.år}`; };
// Den første dag i hver måned (til mærkerne på Jordens bane)
export const MÅNEDER = MÅNEDSNAVNE.map((navn, i) => ({ navn, dag: MÅNEDSDAGE.slice(0, i).reduce((a, b) => a + b, 0) }));

const klem = (x, a, b) => Math.max(a, Math.min(b, x));
function slåOp(liste, d) {
  const t = klem(d, 0, SIDSTE_DAG) / AFSTAND_SKRIDT, i = Math.min(Math.floor(t), liste.length - 2);
  return liste[i] + (liste[i + 1] - liste[i]) * (t - i);
}
// Afstanden Jorden-Jupiter i AE og vinklen fra Solen i grader på dag d
export const afstand = (d) => slåOp(AFSTAND, d);
export const fraSolen = (d) => slåOp(FRA_SOLEN, d);
export const kanSes = (d) => fraSolen(d) >= SES_IKKE_UNDER;
// Minutter, lyset er om at komme fra Jupiter til Jorden (ca. 36 den 14. august og 46 den 9. november)
export const lysMinutter = (d) => afstand(d) * AE_SEKUNDER / 60;
// Minutter, Io ses senere end tabellen, der er regnet ud fra august (minus: før). Ca. 10 den 9. november (bladet s. 894:
// "10 minutes later than it was to be expected, by deducing it from those that had been observed in the Month of August")
export const forsinkelse = (d) => (afstand(d) - afstand(AUGUST)) * AE_SEKUNDER / 60;
// Jordens vinkel i tegningen ovenfra (grader mod uret fra retningen mod Jupiter): Jorden går 360° på 365,26 dage og
// Jupiter 360° på 4332,6 dage, så Jorden løber fra Jupiter med ca. 0,9° om dagen. Jupiter står stille i tegningen
export const jordVinkel = (d) => (360 / 365.256 - 360 / 4332.59) * (d - OPPOSITION);

// Minutter som tekst ("10 minutter", "1½ minut", "under et minut")
export function minutTekst(m) {
  const a = Math.abs(m);
  if (a < 0.75) return 'under et minut';
  const halve = Math.round(a * 2) / 2;
  const hel = Math.floor(halve), halv = halve - hel ? '½' : '';
  const tal = `${hel || ''}${halv}`;
  return `${tal} ${halve <= 1.5 ? 'minut' : 'minutter'}`;
}

// ---------- Aftenen den 9. november 1676 (turens trin 4) ----------
// Bladet s. 894: Io kom ud af skyggen kl. "5 a Clock, 35'. 45"." om aftenen, 10 minutter senere, end man ventede. Uret
// i scenen starter kl. 17.20 og viser tiderne i minutter efter midnat
export const NOV_START = 17 * 60 + 20;
export const NOV_TABEL = 17 * 60 + 25.75;
export const NOV_SET = 17 * 60 + 35.75;
// "17.35.45" (minutter efter midnat som klokkeslæt med sekunder)
export function klokken(m) {
  const s = Math.round(m * 60);
  const t = Math.floor(s / 3600), mi = Math.floor((s % 3600) / 60), se = s % 60;
  return `${t}.${String(mi).padStart(2, '0')}.${String(se).padStart(2, '0')}`;
}

// ---------- Gåden "Tæl lysets minutter" (R3, drejebogen afsnit 6) ----------
// Rømers Fig. 11 tegnet om af os (js/bog/roemer-gaade.js), men med Jupiter i rigtig afstand. Fra Jupiter til Jorden går
// lyset som en perlesnor: én perle for hvert minut, lyset farer. Antallet af perler i august og november er regnet ud fra
// JPL Horizons (lysMinutter ovenfor), og hele Jordens bane (fra H til E) er 2 AE.
// Lysets fart er 299.792,458 km/s, så lyset farer 17,99 millioner km på et minut ("18 millioner km")
export const MINUT_KM = 299792.458 * 60;
export const AE_KM = 149597870.7;
// Jupiters afstand fra Solen i tegningen (NSSDC: 5,20 AE i middel). Banerne er tegnet helt runde
export const JUPITER_AE = 5.2;
// Jordens steder på Rømers tegning: vinklen i grader mod uret fra retningen mod Jupiter (H er tættest på Jupiter og E på
// den anden side af Solen). Målt på tavlen i Phil. Trans. (Fig. 11): L og G ca. 55° fra H, K og F ca. 90°
export const BOGSTAVER = [
  { navn: 'H', vinkel: 0 }, { navn: 'L', vinkel: 55 }, { navn: 'K', vinkel: 90 },
  { navn: 'E', vinkel: 180 }, { navn: 'F', vinkel: 270 }, { navn: 'G', vinkel: 305 },
];
// Minutter, lyset er om vejen fra Jupiter til Jorden i tegningen, når Jorden står vinkel grader fra H (runde baner)
export function tegnetMinutter(vinkel, R = JUPITER_AE) {
  const v = vinkel * Math.PI / 180;
  return Math.sqrt(R * R + 1 - 2 * R * Math.cos(v)) * AE_SEKUNDER / 60;
}
// Perlerne: Én perle for hvert minut fra Jupiter. I august er snoren ca. 35,8 minutter lang, og den sidste perle ligger ved
// Jorden, så der er 36. De nye perler i november er forskellen rundet (10,07 minutter), så der er 46 i alt
const AUG_MIN = lysMinutter(AUGUST), NOV_MIN = lysMinutter(NOVEMBER);
export const PERLER = {
  august: Math.floor(AUG_MIN) + 1,
  nye: Math.round(NOV_MIN - AUG_MIN),
  get november() { return this.august + this.nye; },
};
// Hele vejen fra H til E: 2 AE er 16,63 minutter ("16½": 16 hele perler og en halv). Rømer sagde 22
export const HELE_BANEN = 2 * AE_SEKUNDER / 60;
export const RØMERS_MINUTTER = 22;
// Jorden var 181 millioner km længere væk fra Jupiter den 9. november end den 14. august (Horizons: 644 og 825 mio. km)
export const FORSKEL_MIO_KM = (afstand(NOVEMBER) - afstand(AUGUST)) * AE_KM / 1e6;

// Forordet er broen fra turen (drejebogen afsnit 6). Faktatjekket: Journal des sçavans 7. december 1676 med tegningen og
// "22 pour tout l'intervalle HE" (Phil. Trans. s. 894: "twenty two for the whole interval of H E")
export const GÅDE = {
  forord: {
    sted: 'Paris, december 1676',
    tekst: 'Et blad fortæller om Rømers opdagelse og viser hans tegning: Solen er A, Jupiter er B, og E, F, G, H, K og L er Jorden på sin vej rundt om Solen. Rømer har regnet ud, at lyset er ca. 22 minutter om at krydse hele Jordens bane, fra H til E. I dag ved vi præcis, hvor langt lyset farer på et minut: 18 millioner km.',
    lille: 'Kan du tælle dig frem til hans 10 minutter?',
    knap: 'Prøv gåden',
  },
  alt: 'Rømers tegning tegnet om: Solen A i midten af Jordens bane med bogstaverne E, F, G, H, K og L, og Jupiter B langt ude. Fra Jupiter til Jorden går en snor af perler, én for hvert minut, lyset er om vejen.',
  perle: 'Én perle er ét minut for lyset (18 millioner km)',
  jorden: 'Jorden. Træk den langs banen, eller tryk',
  linjer: {
    aug: `I august er lyset ${PERLER.august} minutter om at komme fra Jupiter. Træk Jorden til den 9. november.`,
    tæl: 'Hvor mange minutter længere er lyset om vejen nu? Tæl de nye perler.',
    tælHjælp: 'Tryk på snoren for hver gylden perle, eller vælg tallet med − og +.',
    forkert: 'Tæl igen: Det er kun de gyldne perler, der er nye.',
    løst1: '10 minutter, som Rømer sagde.',
    løst1Under: `Jorden var ${Math.round(FORSKEL_MIO_KM)} millioner km længere væk fra Jupiter i november end i august.`,
    he: 'Rømer sagde 22 minutter for hele vejen fra H til E. Træk Jorden fra H, tættest på Jupiter, over på den anden side af Solen til E, og se, hvor mange perler der kommer til.',
    løst: '16½ minut. Rømers 22 var for mange, men han var den første, der viste, at lyset bruger tid.',
    vedE: 'Herfra kan man ikke se Jupiter. Solen er i vejen.',
  },
  datoer: { aug: '14. aug.', nov: '9. nov.' },
  svar: 'Svar',
  færre: 'Én færre',
  flere: 'Én mere',
  delTo: 'Hele vejen fra H til E',
  // "Og i dag?" (drejebogen afsnit 6): 10,07 minutter (Horizons), 2 AE = 998 s og 1 AE = 499 s
  iDag: {
    titel: 'Og i dag?',
    hoved: ['', 'Rømer', 'I dag'],
    rækker: [
      ['Io for sent i november', '10 minutter', '10,1 minut'],
      ['Hele Jordens bane', '22 minutter', '16 min 38 s'],
      ['Fra Solen til Jorden', 'ca. 11 minutter', '8 min 19 s'],
    ],
    note: 'Tallene i dag er regnet ud fra lysets fart og afstandene fra JPL Horizons.',
  },
  videre: 'Se det hele i tidsskriftet fra 1677',
  løstFør: 'du har løst den før ✓',
  igen: 'Prøv igen',
};

// ---------- Tidsskriftet fra 1677 (R3, drejebogen afsnit 7) ----------
// Philosophical Transactions bd. 12, nr. 136, s. 893-894 og tavlen med Fig. 11 (Royal Society og JSTOR's skanning på
// archive.org, Public Domain Mark) og Rømers egen liste fra Commons (KILDER.md, lavet med lav_bogsider.py roemer). felter er
// stedets firkanter i % af billedet [venstre, top, bredde, højde], målt med blækket i rækker og søjler. Den engelske tekst
// er læst på siderne, rækkerne i listen på billedet af håndskriften (fakta afsnit 3-4). Oversættelsen er vores egen (Opus'
// i stedet for Fable, kan tjekkes af Fable senere, plan-fable.md). Det lange s er skrevet som s.
export const BOGEN = {
  titel: 'Tidsskriftet fra 1677',
  intro: 'Rømer skrev ikke selv artiklen om sin opdagelse. En reporter fortalte om den i det franske blad Journal des sçavans den 7. december 1676, og året efter kom den på engelsk i Philosophical Transactions i London. Det er de sider, du ser her, og til sidst Rømers egen liste.',
  næste: 'Næste side',
  sidst: 'Men troede de ham?',
  vælg: 'Tryk på et sted, der lyser. Så kommer teksten fra 1677 og vores oversættelse.',
  stedLatin: 'Engelsk',
  stedDansk: 'På dansk',
  sprog: 'en',
  sider: [
    {
      id: 's893', fane: 'Spørgsmålet', fil: 'billeder/biblioteket/roemer-s893.webp', b: 1000, h: 1603,
      alt: 'Side 893 med overskriften "A Demonstration concerning the Motion of Light" og engelsk tekst med det lange s, der begynder med et stort P.',
      om: 'Først spørgsmålet: Kommer lyset frem på et øjeblik, eller bruger det tid? På én omgang af Io kan man ikke mærke forskel, skriver bladet.',
      steder: [
        {
          id: 'oejeblik', navn: 'Øjeblik eller tid?', felter: [[38, 16.4, 50, 2.1], [4.3, 18.7, 83.5, 2.1], [4.4, 20.9, 8, 1.7]],
          latin: 'whether the action of Light be conveyed in an instance to distant places, or whether it requireth time',
          dansk: 'om lyset når fjerne steder på et øjeblik, eller om det bruger tid. Det havde de lærde prøvet at afgøre i mange år.',
        },
        {
          id: 'sekund', navn: 'Ikke ét sekund', felter: [[33.8, 29.8, 45, 2.1]],
          latin: 'Light needs not one second of time',
          dansk: 'Lyset bruger ikke engang ét sekund på ca. 3.000 mil, omtrent Jordens diameter. I dag ved vi, at det tager under en tyvendedel sekund.',
        },
      ],
    },
    {
      id: 'fig11', fane: 'Tegningen', fil: 'billeder/biblioteket/roemer-fig11.webp', b: 870, h: 1580,
      alt: 'Fig. 11: en stor cirkel med Solen A i midten og bogstaverne E, F, G, H, K og L på kanten og over den en lille cirkel om Jupiter B med C og D øverst. Lige streger går fra C og D ned til Jordens bane.',
      om: 'Så tegningen: Solen A, Jupiter B og Jorden på seks steder. Ved C går Io ind i Jupiters skygge, og ved D kommer den ud.',
      steder: [{
        id: 'figuren', navn: 'Hele tegningen', felter: [[3, 3, 94, 94]],
        latin: 'Let (in Fig. 11.) A be the Sun, B Jupiter, C the first Satellit of Jupiter, which enters into the shadow of Jupiter, to come out of it at D; and let EFGHKL be the Earth placed at divers distances from Jupiter.',
        dansk: 'A er Solen, B Jupiter, og C og D er stederne, hvor Io går ind i og kommer ud af skyggen. E, F, G, H, K og L er Jorden på forskellige afstande fra Jupiter. Tegningen er ikke i rigtig størrelse.',
      }],
    },
    {
      id: 's894', fane: 'Beviset', fil: 'billeder/biblioteket/roemer-s894.webp', b: 1000, h: 1622,
      alt: 'Side 894 med engelsk tekst med det lange s i tre afsnit.',
      om: 'Så beviset: Lægger man 40 omgange sammen, kan man se forskellen, og det giver 22 minutter for hele Jordens bane. Og den 9. november kom Io 10 minutter for sent, som Rømer havde sagt.',
      steder: [
        {
          id: 'omgange', navn: '40 omgange', felter: [[15.8, 14.9, 71.5, 2.1], [4.2, 17.1, 22.6, 2.1], [60.8, 19.2, 26.4, 2.2], [4.6, 21.5, 66, 1.8]],
          latin: 'forty revolutions observed on the side F, might be sensibly shorter … and that in proportion of twenty two for the whole interval of H E',
          dansk: '40 omgange set ved F er tydeligt kortere end 40 andre, og det svarer til 22 (minutter) for hele vejen fra H til E. I dag ved vi, at det er 16 minutter og 38 sekunder.',
        },
        {
          id: 'november', navn: 'Den 9. november', felter: [[49.6, 34.4, 38.9, 1.8], [5.5, 36.7, 82.5, 2], [5.2, 38.8, 12, 2.1], [14.3, 43.1, 74, 2], [5.6, 45.4, 35.5, 2]],
          latin: 'the 9th of November last at 5 a Clock, 35\'. 45". at Night, 10 minutes later than it was to be expected … Which M. Romer had predicted to the said Academy from the beginning of September.',
          dansk: 'Den 9. november kl. 5, 35 minutter og 45 sekunder om aftenen kom Io ud af skyggen, 10 minutter senere, end man ventede. Det havde Rømer sagt til Akademiet fra begyndelsen af september.',
        },
      ],
    },
    {
      id: 'liste', fane: 'Listen', fil: 'billeder/biblioteket/roemer-liste.webp', b: 1000, h: 1472,
      alt: 'En håndskrevet side med to søjler af datoer, klokkeslæt og ordene Imm. og Emers. Øverst står "Obser. primi Jovialium Parisiis".',
      om: 'Til sidst hans egen hånd: Rømers liste over Io\'s formørkelser set i Paris. Han skrev den tidligst i 1678, og den overlevede Københavns brand i 1728.',
      steder: [{
        id: 'nov9', navn: 'Nov. 9 … Em.', felter: [[51.8, 57.6, 37.5, 2.5]], mærke: 'Latin', sprog: 'la',
        latin: 'Nov. 9 … 5 45 35 … Em.',
        dansk: 'Em. er forkortet latin for emersio: Io kom ud af skyggen. Her ser tiden ud til at stå som 5 45 35, mens bladet skriver 5.35.45. Vi ved ikke, hvorfor de er forskellige.',
      }],
    },
  ],
  // Linje for linje (drejebogen afsnit 7): sætning for sætning ved de linjer, den hører til
  linjer: {
    titel: 'Linje for linje',
    linje: 'Hele teksten på engelsk og dansk, sætning for sætning.',
    note: 'Oversættelsen fra engelsk er vores egen. Det lange s (ſ) er skrevet som s.',
    rækker: [
      { side: 's893', linjer: 'Overskriften', latin: 'A Demonstration concerning the Motion of Light, communicated from Paris, in the Journal des Scavans, and here made English.', dansk: 'Et bevis for lysets bevægelse, sendt fra Paris i Journal des Sçavans og her oversat til engelsk.' },
      { side: 's893', linjer: 'Linje 1-4', latin: 'Philosophers have been labouring for many years to decide by some Experience, whether the action of Light be conveyed in an instance to distant places, or whether it requireth time.', dansk: 'I mange år har de lærde prøvet at afgøre med et forsøg, om lyset når fjerne steder på et øjeblik, eller om det bruger tid.' },
      { side: 's893', linjer: 'Linje 4-9', latin: 'M. Romer of the R. Academy of the Sciences hath devised a way, taken from the Observations of the first Satellit of Jupiter, by which he demonstrates, that for the distance of about 3000 leagues, such as is very near the bigness of the Diameter of the Earth, Light needs not one second of time.', dansk: 'Hr. Rømer fra Det Kongelige Videnskabsakademi har fundet en måde ud fra iagttagelserne af Jupiters første måne. Med den viser han, at lyset ikke engang bruger ét sekund på ca. 3.000 mil, omtrent Jordens diameter.' },
      { side: 's893', linjer: 'Linje 10-13', latin: 'Let (in Fig. 11.) A be the Sun, B Jupiter, C the first Satellit of Jupiter, which enters into the shadow of Jupiter, to come out of it at D; and let EFGHKL be the Earth placed at divers distances from Jupiter.', dansk: 'Lad (i Fig. 11) A være Solen, B Jupiter og C Jupiters første måne, som går ind i Jupiters skygge og kommer ud af den ved D. Og lad E, F, G, H, K og L være Jorden på forskellige afstande fra Jupiter.' },
      { side: 's893', linjer: 'Linje 14-19', latin: 'Now, suppose the Earth, being in L towards the second Quadrature of Jupiter, hath seen the first Satellit at the time of its emersion or issuing out of the shadow in D; and that about 42½ hours after, (vid. after one revolution of this Satellit,) the Earth being in K, do see it returned in D;', dansk: 'Forestil dig, at man fra Jorden i L har set månen komme ud af skyggen ved D, og at man ca. 42½ time senere (altså efter én omgang) ser den komme tilbage til D, mens Jorden er i K.' },
      { side: 's893', linjer: 'Linje 19-26', latin: 'it is manifest, that if the Light require time to traverse the interval LK, the Satellit will be seen returned later in D, than it would have been if the Earth had remained in L, … and that, on the contrary, in the other Quadrature FG, where the Earth by approaching goes to meet the Light, the revolutions of the Immersions will appear to be shortned by so much, as those of the Emersions had appeared to be lengthned.', dansk: 'Så er det tydeligt: Bruger lyset tid på vejen fra L til K, ses månen komme senere tilbage til D, end hvis Jorden var blevet i L. Og omvendt ved F og G, hvor Jorden kommer lyset i møde: Dér ser omgangene lige så meget kortere ud.' },
      { side: 's893', linjer: 'Linje 26-35', latin: 'And because in 42½ hours, which this Satellit very near takes to make one revolution, the distance between the Earth and Jupiter in both the Quadratures varies at least 210 Diameters of the Earth, it follows, that if for the account of every Diameter of the Earth there were required a second of time, the Light would take 3½ minutes for each of the intervals GF, KL; which would cause near half a quarter of an hour between two revolutions of the first Satellit, one observed in FG, and the other in KL, whereas there is not observed any sensible difference.', dansk: 'På de 42½ time, en omgang tager, ændrer afstanden mellem Jorden og Jupiter sig mindst 210 jorddiametre. Brugte lyset et sekund for hver jorddiameter, ville det tage 3½ minut fra G til F og fra K til L, og så ville der være næsten et halvt kvarter mellem en omgang set ved F og G og en set ved K og L. Men man ser ingen forskel, der kan mærkes.' },
      { side: 's894', linjer: 'Linje 1-9', latin: 'Yet doth it not follow hence, that Light demands no time. For, after M. Romer had examin\'d the thing more nearly, he found, that what was not sensible in two revolutions, became very considerable in many being taken together, and that, for example, forty revolutions observed on the side F, might be sensibly shorter, than forty others observed in any place of the Zodiack where Jupiter may be met with; and that in proportion of twenty two for the whole interval of H E, which is the double of the interval that is from hence to the Sun.', dansk: 'Men det betyder ikke, at lyset ikke bruger tid. Da hr. Rømer så nærmere efter, fandt han, at det, man ikke kunne mærke på to omgange, blev meget stort, når mange blev lagt sammen. Fx kan 40 omgange set ved F være tydeligt kortere end 40 andre, og det svarer til 22 (minutter) for hele vejen fra H til E, som er dobbelt så lang som vejen herfra til Solen.' },
      { side: 's894', linjer: 'Linje 10-12', latin: 'The necessity of this new Equation of the retardment of Light, is established by all the observations that have been made in the R. Academy, and in the Observatory, for the space of eight years,', dansk: 'At man må regne lysets forsinkelse med, viser alle iagttagelserne i Akademiet og på observatoriet gennem otte år,' },
      { side: 's894', linjer: 'Linje 13-20', latin: 'and it hath been lately confirmed by the Emersion of the first Satellit observed at Paris the 9th of November last at 5 a Clock, 35\'. 45". at Night, 10 minutes later than it was to be expected, by deducing it from those that had been observed in the Month of August, when the Earth was much nearer to Jupiter: Which M. Romer had predicted to the said Academy from the beginning of September.', dansk: 'og det er for nylig blevet bekræftet: Den første måne blev set komme ud af skyggen i Paris den 9. november kl. 5, 35 minutter og 45 sekunder om aftenen, 10 minutter senere, end man ventede ud fra dem, der var set i august, da Jorden var meget nærmere Jupiter. Det havde hr. Rømer sagt til Akademiet fra begyndelsen af september.' },
      { side: 's894', linjer: 'Linje 21-24', latin: 'But to remove all doubt, that this inequality is caused by the retardment of the Light, he demonstrates, that it cannot come from any excentricity, or any other cause of those that are commonly alledged …', dansk: 'Og for at fjerne al tvivl om, at forskellen skyldes lysets forsinkelse, viser han, at den ikke kan komme af en skæv bane eller af nogen af de andre grunde, man plejer at nævne …' },
      { side: 'liste', linjer: 'Øverst', sprog: 'la', latin: 'Obser. primi Jovialium Parisiis', dansk: 'Iagttagelser af den første Jupiter-måne i Paris' },
      { side: 'liste', linjer: '1676', sprog: 'la', latin: 'Aug. 7 … Emers. · Aug. 14 … Emers. · Aug. 23 … Emers. · Nov. 9 … Em.', dansk: '7., 14. og 23. august: kom ud. 9. november: kom ud. Tiderne er talt fra middag, så "9 49 50" den 7. august er kl. 21.49.50.' },
    ],
  },
};

// ---------- Om Rømer (bogens sidste opslag, R3, drejebogen afsnit 8) ----------
// Budgettet: titel, højst to tal, højst tre sætninger, højst fire spørgsmål. Derefter "Vil du vide mere?" og "Ærligt
// talt", lukkede. Kilderne står i docs/fakta-videnskabsfolk/roemer.md (faktatjekket i drejebogen afsnit 14). Ærligt talt
// har også det, turen og gåden snyder med (listen øverst i js/bog/roemer.js og js/bog/roemer-gaade.js).
export const OM = {
  titel: 'Om Rømer',
  navn: 'Ole Rømer (1644-1710)',
  tal: [
    { tal: '10 minutter', tekst: 'for sent kom Io den 9. november 1676' },
    { tal: '22 minutter', tekst: 'for lyset over hele Jordens bane efter Rømer (i dag 16½)' },
  ],
  // Fakta afsnit 5-6: Cassini, Huygens, Newton (Opticks 1704), Bradley (aberrationen 1729). 1 AE: 499 s = 8 min 19 s
  sætninger: 'Rømer havde ret: Lyset bruger tid. Chefen for observatoriet, Cassini, troede aldrig helt på det, men Huygens og Newton gjorde, og i 1729 viste englænderen James Bradley det på en helt anden måde. I dag ved vi, at lyset er 8 minutter og 19 sekunder om at komme fra Solen.',
  // Gør det selv (drejebogen afsnit 9): Jupiter → Månerne i Solsystemet. Tjekket på skærmen 28. november 2026: Med ⏩
  // bliver Io sort et øjeblik på den side af Jupiter, der vender væk fra Solen (månerne får skyggen i js/kosmos/jupiter.js).
  // Set fra kameraet er det ved siden af Jupiter, ikke bag den, så linjen siger "væk fra Solen"
  knap: {
    tekst: 'Se Io forsvinde i Jupiters skygge', gaa: 'solsystem:jupiter:maaner',
    linje: 'Tryk ⏩, og følg Io, den inderste måne. På den side af Jupiter, der vender væk fra Solen, glider den ind i skyggen og bliver sort et øjeblik. Det sker hver 42½ time. Det var Rømers ur.',
  },
  hvorfor: [
    {
      // Fakta afsnit 1 (Picard på Hven 1671, længdegraden ud fra Jupiters måner)
      spørgsmål: 'Hvorfor kiggede de på Jupiters måner?',
      svar: 'Formørkelserne sker på samme øjeblik for alle, der kan se Jupiter. Ser man en formørkelse i Paris og på Hven, kan man ud fra forskellen i klokkeslæt regne ud, hvor langt mod øst Hven ligger. Det gjorde Rømer i 1671 på Hven sammen med franskmanden Jean Picard, dér hvor Tycho Brahes Uranienborg havde stået. Picard tog ham med til Paris.',
    },
    {
      // Fakta afsnit 5 (Huygens, Traité de la lumière 1690: 16⅔ jorddiametre i sekundet, ca. 212.000 km/s). Lyden ca. 343 m/s
      spørgsmål: 'Hvor hurtigt er lyset så?',
      svar: 'Rømer gav aldrig en fart, kun tiden. Christiaan Huygens regnede den ud fra Rømers 22 minutter: godt 210.000 km i sekundet, over 600.000 gange hurtigere end lyden. I dag ved vi, at det er 299.792 km i sekundet.',
    },
    {
      // Fakta afsnit 5 (Cassinis indvendinger, Bobis og Lequeux 2008)
      spørgsmål: 'Hvorfor troede Cassini ikke på det?',
      svar: 'Io går ikke helt jævnt rundt, fordi de andre måner trækker i den, og de andre måner viste ikke forsinkelsen tydeligt. Rømer svarede, at de var sværere at måle. Først i 1700-tallet kunne man regne månernes træk ud.',
    },
    {
      // Fakta afsnit 1 (København 1681, Rundetårn, kalenderen 1700, politimester 1705, gadelygterne, branden 1728)
      spørgsmål: 'Hvad lavede Rømer bagefter?',
      svar: 'Han kom hjem til København i 1681 og blev professor og målte stjerner fra Rundetårn. Han fik kongen til at indføre den nye kalender i 1700 og blev politimester i 1705, hvor han satte gadelygter op. De fleste af hans papirer brændte ved Københavns brand i 1728.',
    },
  ],
  nørd: {
    titel: 'Vil du vide mere?',
    linje: 'Regnestykket, afstandene, Huygens og Fahrenheit.',
    punkter: [
      'Bladets første regnestykke: På én omgang (42½ time) ændrer afstanden sig mindst 210 jorddiametre. Brugte lyset 1 sekund pr. jorddiameter, ville Io komme 3½ minut for sent pr. omgang. Det så man ikke, så lyset er meget hurtigere. I dag ved vi, at Jorden højst fjerner sig ca. 4 mio. km på en omgang, og det giver ca. 14 sekunder. Over 40 omgange bliver det minutter.',
      'Afstanden Jorden-Jupiter (JPL Horizons): 14. august 1676 644 mio. km, 9. november 1676 825 mio. km. Forskellen, 181 mio. km, er lyset 10,1 minut om.',
      'Huygens\' tal (Traité de la lumière, trykt 1690): 22.000 jorddiametre på 22 minutter, altså 16⅔ jorddiametre i sekundet eller over 110 millioner toiser (en gammel fransk længde på knap 2 m).',
      'Newton skrev i 1704 "syv eller otte minutter" fra Solen. Bradley fik 8 minutter og 13 sekunder i 1729. I 1849 målte Fizeau lysets fart på Jorden for første gang.',
      'På dansk kaldte man det "lysets tøven" (fysikeren Kirstine Meyer, 1915).',
      'Rømers temperaturskala: Fahrenheit besøgte ham i 1708 og byggede sin skala på den.',
    ],
  },
  ærligt: {
    titel: 'Ærligt talt',
    linje: 'Det, vi har gjort enklere eller selv har fundet på.',
    punkter: [
      'Rømer målte ikke lysets fart, men den tid, lyset er om at krydse Jordens bane. Farten regnede Huygens ud.',
      'Hans 22 minutter var for mange. I dag: 16 minutter og 38 sekunder.',
      'Måske var det Cassini, der først fik idéen om, at lyset bruger tid (forskerne er uenige). Men Cassini opgav den, og det var Rømer, der holdt fast og viste den.',
      'Siderne er ikke skrevet af Rømer selv, men af en reporter, og den engelske tekst er oversat fra fransk. Kun listen er Rømers egen hånd.',
      'Vi ved ikke, hvem der stod ved kikkerten den 9. november. Bladet siger bare, at man så det i Paris.',
      'I turen er lysglimtet en tegning: Lys kan man ikke se flyve gennem rummet. Glimtet farer lige hurtigt i august og november, men stopuret tæller nutidens minutter (36 og 46). Rømer kendte ikke afstandene i km.',
      'Banerne i turen er ikke i rigtig størrelse: Jupiter er 5,2 gange så langt fra Solen som Jorden, men tegnet ca. 2,4 gange, og den står stille. I virkeligheden flyttede den sig ca. 10° fra juli til november. I gåden er afstanden rigtig, men banerne er tegnet helt runde, og Jupiter og Io\'s bane er tegnet alt for store.',
      'Skyggen er tegnet skarp, så Io slukker på et øjeblik. I virkeligheden tager det et par minutter. Urene i turen går hurtigere end rigtige ure, og kikkerten viser Jupiter, som den ses i en lille kikkert, ikke præcis som i Rømers.',
      'Tabellen i turen er regnet ud fra iagttagelserne i august, som bladet skriver, ikke ud fra Cassinis tabel.',
      'Io går ikke helt jævnt rundt, og urene i 1676 gik efter Solen. Derfor kan man ikke regne de 10 minutter direkte ud fra Rømers liste. I gåden bruger du nutidens afstande, og perlerne er rundet til hele minutter.',
      'Ved Jupiter i Solsystemet når lyset frem med det samme, så dér kommer Io aldrig for sent.',
      'Billederne i turen og gåden er vores egne tegninger, og Fig. 11 er tegnet om af os. Fortælleren er vores, og oversættelsen fra engelsk er vores egen.',
      'Portrættet er Jacob Conings maleri. Vi har lagt det samme filter over som de andre, så alle personerne i bogreolen ligner hinanden.',
    ],
  },
};
