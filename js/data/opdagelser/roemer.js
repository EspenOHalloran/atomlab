// Teksterne i bogen om Ole Rømer og lyset, der bruger tid (docs/drejebog-roemer.md, jeres svar 21. november 2026: "Ja
// til alle anbefalinger", altså kernesætning A). Kilderne står i docs/fakta-videnskabsfolk/roemer.md (faktatjekket af Opus
// i stedet for Fable). Uden DOM, så testene i Node kan læse dem.
//
// R1 (27. november 2026): forsiden. Kun de opslag, der er bygget, står i OPSLAG (E20 fund 6, stilguiden A9).
// R2 (28. november 2026): turen "Himlens ur" (forløbet i js/data/forloeb/roemer.js, tegningerne i js/bog/roemer.js) og
// tallene bag den: afstanden Jorden-Jupiter fra JPL Horizons, Io's omløb og skygge og aftenen den 9. november. Gåden,
// tidsskriftet fra 1677 og "Om Rømer" kommer i R3 (drejebogen afsnit 15).

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
];

// Vejene fra "Det så du" (drejebogen afsnit 5, trin 5). En vej til et opslag står kun, når opslaget er bygget (stilguiden
// A9), så i R2 er der kun "Tag turen igen". sætning er den røde tråd videre til gåden (R3)
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
