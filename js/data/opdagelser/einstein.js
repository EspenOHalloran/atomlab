// Teksterne i bogen om Albert Einstein og de tre ligninger (docs/drejebog-einstein.md, jeres svar 21. november 2026:
// "Ja til alle anbefalinger", kernesætning A, og ønsket om en stor bog: "Det skal være fedt"). Kilderne står i
// docs/fakta-einstein-bog.md (Opus xhigh i stedet for Fable). Uden DOM, så testene i Node kan læse dem.
//
// E1 (21. november 2026): forsiden med vignetten (lommeuret og lysglimtet, tegnet af lommeurTegning i js/bog.js). Kun de
// opslag, der er bygget, står i OPSLAG (E20 fund 6, stilguiden A9). E2 (samme dag): turen "Lige hurtigt for alle"
// (forløbet i js/data/forloeb/einstein.js, tegningerne i js/bog/einstein.js) og regnestykkerne bag den nedenfor. Ligningerne
// kommer i E3 og E4, og "Om Einstein" i E5.

export const FORSIDE = {
  // Bogens røde tråd (drejebogen afsnit 2): alle tre ligninger følger af, at lyset er lige hurtigt for alle
  spørgsmål: 'Hvad sker der, når lyset er lige hurtigt for alle?',
  // Vignetten under introduktionen (drejebogen afsnit 3 og 4): en stregtegning som figurerne i Annalen der Physik 1905.
  // Kun lysglimtet og urets visere er gule. Bogstaverne er Einsteins egne: t for tiden og V for lysets fart (han skrev V,
  // ikke c, i 1905, faktafilen afsnit 2). Uret viser 7: toget, der "kommer hertil klokken 7", er hans eksempel på
  // samtidighed (s. 893, l. 1-6). Glimtet farer forbi med samme fart hele vejen (lineært)
  vignet: {
    klokken: 7,
    tid: 't',
    lys: 'V',
    tekst: 'Et lommeur og et lysglimt, tegnet som en figur i et tidsskrift fra 1905.',
    alt: 'Et lommeur med visere, der viser klokken 7, og et gult lysglimt, der farer forbi langs en linje under uret. Ved uret står bogstavet t og ved lyset bogstavet V.',
  },
  navn: 'Albert Einstein',
  liv: '1879-1955',
  // Schmutzers foto er kun dateret "1921", og Einstein fyldte 42 i marts det år (fælden med alderen, drejebogen afsnit 15)
  portrætTekst: 'Foto af Ferdinand Schmutzer fra 1921. Einstein var omkring 42.',
  portrætAlt: 'Albert Einstein med krøllet hår, overskæg og høj, hvid flip, tegnet som et gammelt kobberstik.',
  begynd: 'Begynd',
  // Introduktionen (den røde tråd fra begyndelsen, drejebogen afsnit 4). Faktatjekket (faktafilen afsnit 2): Einstein var
  // 26 i juni 1905 (født 14. marts 1879) og arbejdede på patentkontoret i Bern (Wikipedia "Albert Einstein"). De to regler står på s. 891-892: "Prinzip der Relativität" og lysets fart V i
  // "im leeren Raume", som ikke afhænger af, hvordan det lysende legeme bevæger sig. Derfor "i det tomme rum".
  intro: {
    sted: 'Bern, 1905',
    tekst: 'Albert Einstein er 26 år og arbejder på patentkontoret. Han tager to regler for givet: Naturens love er de samme for alle, der bevæger sig jævnt, og lyset i det tomme rum er altid lige hurtigt, uanset hvordan lampen bevæger sig. Det lyder harmløst, men han regner sig frem til, at så kan tiden ikke være den samme for alle. Hvad sker der, hvis begge regler gælder?',
  },
};

export const OPSLAG = [
  { id: 'forside', slags: 'forside' },
  // Turen (E2): forløbet "Lige hurtigt for alle" kører i dette opslag med tegningerne fra js/bog/einstein.js. Bagefter er
  // opslaget et lille laboratorium med de fire kapitler og "Fortæl det igen" (som Tycho)
  { id: 'fortaelling', slags: 'scene', titel: 'Lige hurtigt for alle' },
];

// "Det så du" (drejebogen afsnit 5, trin 5). Den vigtige vej er ligningerne på Einsteins egne sider (opslaget 'tiden'), men
// den står først, når E3 har bygget opslaget (js/opdagelser.js viser kun veje til byggede opslag, stilguiden A9). Til da er
// Rejsen i tid den første vej: Einsteins egen rundtur fra s. 904 (drejebogen afsnit 12).
// Sætningen siger det, delens kernesætning kun passer halvt med (drejebogen afsnit 1): Einstein regnede, og andre målte.
// Valgt af sessionen (E2), kan ændres af jer. E3 skifter den til drejebogens "Men hvordan skrev han det?"
export const VEJE = {
  sætning: 'Alt det regnede Einstein sig frem til med de to regler. Målingerne, der viste, at han havde ret, kom bagefter.',
  veje: [
    { tekst: 'Læs ligningerne på Einsteins egne sider', opslag: 'tiden', primær: true },
    { tekst: 'Send et ur på rejse', fænomen: ['kosmos', 'tid'] },
    { tekst: 'Tag turen igen', igen: true },
  ],
};

// Laboratoriet efter turen: de fire kapitler som valg (E20, stilguiden B7). "Uret flyver en tur" er standard, for det er
// kernen: Når lyset er lige hurtigt for alle, kan tiden ikke være det.
export const FRI = {
  linje: 'Vælg en fart, og send uret en tur rundt. Sammenlign urene, når det er hjemme igen.',
  igen: 'Fortæl det igen',
  kapitler: [
    { id: 'toget', tekst: 'Toget og lyset', linje: 'Vælg togets fart, og tænd begge lygter. Lysglimtene følges ad, uanset hvor hurtigt toget kører.' },
    { id: 'rundtur', tekst: 'Uret flyver en tur', linje: 'Vælg en fart, og send uret en tur rundt. Sammenlign urene, når det er hjemme igen.' },
    { id: 'vaegten', tekst: 'Batteriet på vægten', linje: 'Spol en time frem, og se, hvor meget lettere batteriet og lampen bliver.' },
    { id: 'gps', tekst: 'Uret højt oppe', linje: 'Træk satellitten op og ned. Lavt nede vinder farten, højt oppe vinder højden.' },
  ],
};

// ---------- Regnestykkerne bag turen (testes i Node, tallene står i drejebogen afsnit 15 og faktafilen afsnit 2-3) ----------
// Lysets fart (præcis, fordi metren siden 1983 er defineret ud fra den)
export const LYSETS_FART = 299792458; // m/s
export const LYSETS_FART_KMT = LYSETS_FART * 3.6; // km/t: ca. 1.079 millioner km/t

// Trin 1: togets fart. tegnet er farten i tegningen som en del af lysets fart i tegningen (lyset går alt for langsomt i
// tegningen, så 100 km/t ses som en langsom kørsel, ærligt talt i E5). Halvdelen af lysets fart er det højeste (drejebogen)
export const TOG_FARTER = [
  { id: 'tog', tekst: '100 km/t', kmt: 100, tegnet: 0.12 },
  { id: 'halv', tekst: 'Halvdelen af lysets fart', kmt: 0.5 * LYSETS_FART_KMT, tegnet: 0.5 },
];

// Trin 2: rundturen. Uret, der farer af sted med farten v, viser τ = t·√(1 − (v/V)²) (Einstein, Annalen der Physik 17,
// s. 904), når uret hjemme viser t. Turen varer HJEMME sekunder på uret hjemme ved alle farter (banen i tegningen er længere
// ved en højere fart). Ved 87 % viser uret, der fløj, ca. halvt så meget (9,9 mod 20 sekunder)
export const URETS_FARTER = [0.1, 0.5, 0.87, 0.99];
export const HJEMME = 20; // sekunder på uret hjemme
export const egentid = (t, β) => t * Math.sqrt(1 - β * β);

// Trin 3: batteriet og lampen. Energien L = P·t forsvinder som lys og varme, og massen bliver L/V² mindre (s. 641)
export const LAMPE_W = 100;
export const TIME = 3600; // sekunder
export const massetab = (watt = LAMPE_W, sekunder = TIME) => (watt * sekunder) / LYSETS_FART ** 2; // kg: ca. 4,0 · 10⁻¹² kg
export const SOLEN_W = 3.828e26; // Solens udstråling (IAU 2015)
export const solensTabTon = () => SOLEN_W / LYSETS_FART ** 2 / 1000; // ton pr. sekund: ca. 4,3 millioner

// Trin 4: GPS-uret (som Rumtid i Kosmos, js/kosmos/rumtid.js). For et ur i en cirkelbane i højden h over Jordens overflade
// og et ur på jorden (svag tyngde, Jordens drejning er ikke regnet med, den giver ca. 0,1 milliontedel sekund pr. døgn):
//   højden  GM/V² · (1/R − 1/r) pr. sekund (uret højt oppe går hurtigere)
//   farten  v²/(2V²) med v² = GM/r (uret, der farer af sted, går langsommere, s. 904 for små farter)
// Ved GPS-højden (ca. 20.200 km) giver det +45,7 og −7,2, i alt ca. 38 milliontedele sekund foran pr. døgn, og fejlen er ca. 10 km
// om dagen uden rettelse (38,5 µs gange lysets fart er 11,5 km). Lavt nede (fx rumstationen, ca. 400 km) vinder farten, og
// uret er bagud. De to er lige store ved ca. 3.200 km (r = 1,5 R).
export const GM_JORDEN = 3.986004418e14; // m³/s²
export const JORDENS_RADIUS = 6371; // km (middelradius)
export const GPS_HØJDE = 20200; // km
export const RUMSTATIONEN = 400; // km
export const DØGN = 86400; // sekunder
export function gpsUr(højdeKm) {
  const R = JORDENS_RADIUS * 1000, r = R + højdeKm * 1000, c2 = LYSETS_FART ** 2;
  const højde = (GM_JORDEN / c2) * (1 / R - 1 / r) * DØGN * 1e6;
  const fart = (GM_JORDEN / r / (2 * c2)) * DØGN * 1e6;
  return { højde, fart, iAlt: højde - fart }; // milliontedele sekund pr. døgn
}
// De hele tal, der står på skærmen: hver del skåret ned til et helt tal, og summen af dem, så tallene passer sammen
// (+45 og −7 giver 38 ved GPS-højden, som i Rumtid)
export function gpsTal(højdeKm) {
  const u = gpsUr(højdeKm);
  const højde = Math.trunc(u.højde), fart = Math.trunc(u.fart);
  return { højde, fart, iAlt: højde - fart };
}
// Hvor langt GPS'en tager fejl efter et døgn uden rettelse (km): uret går forkert, og signalet farer med lysets fart
export const gpsFejlKm = (µs = gpsUr(GPS_HØJDE).iAlt) => (µs * 1e-6 * LYSETS_FART) / 1000;

// Tal på dansk: 1.079 og 0,5 (n decimaler)
export function dansk(x, n = 0) {
  const [hel, dec] = Math.abs(x).toFixed(n).split('.');
  return `${x < 0 ? '−' : ''}${hel.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${dec ? `,${dec}` : ''}`;
}
// Et lillebitte antal gram med mellemrum for hver tredje decimal: 4,0 · 10⁻⁹ g giver "0,000 000 004"
export function småGram(gram, decimaler = 9) {
  const [hel, dec] = gram.toFixed(decimaler).split('.');
  return `${hel},${dec.match(/.{1,3}/g).join(' ')}`;
}
