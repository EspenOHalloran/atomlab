// Teksterne i bogen om Albert Einstein og de tre ligninger (docs/drejebog-einstein.md, jeres svar 21. november 2026:
// "Ja til alle anbefalinger", kernesætning A, og ønsket om en stor bog: "Det skal være fedt"). Kilderne står i
// docs/fakta-einstein-bog.md (Opus xhigh i stedet for Fable). Uden DOM, så testene i Node kan læse dem.
//
// E1 (21. november 2026): forsiden med vignetten (lommeuret og lysglimtet, tegnet af lommeurTegning i js/bog.js). Kun de
// opslag, der er bygget, står i OPSLAG (E20 fund 6, stilguiden A9). E2 (samme dag): turen "Lige hurtigt for alle"
// (forløbet i js/data/forloeb/einstein.js, tegningerne i js/bog/einstein.js) og regnestykkerne bag den nedenfor. Ligningerne
// om tiden (E3), energien og tyngden (E4, 22. november 2026) står i LIGNINGER, og "Om Einstein" kommer i E5.

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
  // Ligningerne på Einsteins egne sider (E3, drejebogen afsnit 6 og 7): et opslag af slags 'ligning' (js/bog-ligning.js),
  // teksterne i LIGNINGER nedenfor. Energien (s. 641) og tyngden (s. 845) i E4 (drejebogen afsnit 8 og 9)
  { id: 'tiden', slags: 'ligning', titel: '1905: Tiden', ligning: 'tiden' },
  { id: 'energien', slags: 'ligning', titel: '1905: Energien', ligning: 'energien' },
  { id: 'tyngden', slags: 'ligning', titel: '1915: Tyngden', ligning: 'tyngden' },
  // Bogens sidste opslag (E5, drejebogen afsnit 10): "Havde han ret?" med Gør det selv (Rejsen i tid), teksterne i OM
  { id: 'om', slags: 'om', titel: 'Om Einstein' },
];

// "Det så du" (drejebogen afsnit 2 og 5, trin 5). Den vigtige vej er ligningerne på Einsteins egne sider (opslaget 'tiden',
// bygget i E3), så linjen er drejebogens bro dertil: "Men hvordan skrev han det?" (E2 havde en anden linje, til opslaget fandtes)
export const VEJE = {
  sætning: 'Men hvordan skrev han det?',
  veje: [
    { tekst: 'Læs ligningerne på hans egne sider', opslag: 'tiden', primær: true },
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

// ---------- Regnestykkerne bag ligningerne (testes i Node, drejebogen afsnit 7-9 og 15) ----------
// Tiden: hvor meget et ur med farten β (en del af lysets fart) kommer bagud pr. sekund. bagudLet er Einsteins lette udgave
// ½β², bagudRigtig er 1 − √(1 − β²) regnet uden at miste cifrene ved små farter (β²/(1 + √(1 − β²)) er det samme tal,
// fælden med kommatal i faktafilen afsnit 8)
export const bagudLet = (β) => (β * β) / 2;
export const bagudRigtig = (β) => (β * β) / (1 + Math.sqrt(1 - β * β));
export const bagudPrDøgn = (β, let_ = true) => (let_ ? bagudLet(β) : bagudRigtig(β)) * DØGN;
// Led for led: tallene for uret fra turen (87 %, 20 sekunder hjemme)
export function ledForLedEksempel(β = 0.87, t = HJEMME) {
  const k = β * β, rest = 1 - k, rod = Math.sqrt(rest);
  const b = dansk(β, Math.round(β * 100) % 10 ? 2 : 1); // 0,1 og 0,87
  return `${b} · ${b} = ${dansk(k, 2)}. 1 − ${dansk(k, 2)} = ${dansk(rest, 2)}, og √${dansk(rest, 2)} = ${dansk(rod, 2)}. Når uret hjemme viser ${t} sekunder, viser det ${dansk(t * rod, 1)}.`;
}
const procent = (β) => `${dansk(β * 100)} %`;
// Tre betydende cifre på dansk (0,00501 og 0,134). Tallene her er alle over 0,00001, så ingen e-notation
export const treCifre = (x) => Number(x.toPrecision(3)).toString().replace('.', ',');

// Energien (s. 641): Einstein målte energien i erg og massen i gram og delte med 9 · 10²⁰ (lysets fart 3 · 10¹⁰ cm/s i anden).
// En joule er 10 millioner erg. 360.000 J er 3,6 · 10¹² erg, og 3,6 · 10¹² / 9 · 10²⁰ = 4 · 10⁻⁹ g, det samme som 4 · 10⁻¹² kg
export const ERG_PR_JOULE = 1e7;
export const EINSTEINS_V2 = 9e20; // cm²/s², s. 641, l. 20
export const einsteinsGram = (erg) => erg / EINSTEINS_V2;
export const energiAfMasse = (kg) => kg * LYSETS_FART ** 2; // joule (E = mc²)
// Hvor længe lampen på 100 W kunne lyse for energien i massen m (sekunder)
export const lampeTid = (kg, watt = LAMPE_W) => energiAfMasse(kg) / watt;
const ÅR = 365.25 * DØGN;
// Led for led i energien: massen vendt om til energi (E = mc²) og lampens tid. Tallene afrundes, så de kan læses: c² som
// 90.000.000.000.000.000 og årene til tre cifre (1 g: ca. 28.500 år, 1 kg: ca. 28 millioner år, regnet i Node)
export function energiEksempel(kg) {
  const E = energiAfMasse(kg), s = lampeTid(kg), år = s / ÅR;
  const masse = kg >= 1 ? `${dansk(kg)} kg` : kg >= 1e-3 ? `${småGram(kg, 3)} kg` : `${småGram(kg, 12)} kg`;
  const tid = s < 2 * 3600 ? 'i en time' : år < 1e6 ? `i ca. ${dansk(Math.round(år / 100) * 100)} år` : `i ca. ${dansk(Math.round(år / 1e6))} millioner år`;
  return `E = ${masse} · 90.000.000.000.000.000 = ca. ${dansk(Number(E.toPrecision(2)))} joule. Det kunne holde lampen på 100 watt tændt ${tid}.`;
}

// Tyngden (s. 845): i og m går fra 1 til n (n = 4: tre retninger i rummet og tiden). Skemaet har n · n felter, men G_im er
// det samme som G_mi, så de n(n − 1)/2 over den skrå linje er dobbelte, og n(n + 1)/2 er forskellige ("zehn Gleichungen")
export const felterIAlt = (n = 4) => n * n;
export const dobbelte = (n = 4) => (n * (n - 1)) / 2;
export const forskellige = (n = 4) => (n * (n + 1)) / 2;

// ---------- Ligningerne (E3, drejebogen afsnit 6 og 7): opslag af slags 'ligning' i js/bog-ligning.js ----------
// Hvert opslag: forordet (broen fra opslaget før), siden fra 1905 (skanningen og den samme side sat af os, kontakten
// "Skanning / Sat tekst"), højst to glødende steder med tysk og dansk, ligningen stor med "Led for led", "Regn selv" og de
// lukkede lag. Det tyske er skrevet af efter sidebilledet, og den danske oversættelse er vores egen
// (docs/fakta-einstein-bog-tekster.md, afsnit 1). Kan tjekkes af Fable senere.
//
// Den lille opmærkning i den sætte tekst og formlerne (js/bog-ligning.js, matte()): *x* er kursiv, \r{…} en kvadratrod med
// streg over, \b{a}{b} en brøk med a over b, \p{…} en høj parentes og ^{…} et lille tal foroven. En linje, der begynder med
// '>', er rykket ind (et nyt afsnit). { f } er en formel på sin egen linje (tælles ikke med som en linje, faktafilen afsnit 1).
const TAU_ROD = '\\r{1 − \\p{\\b{*v*}{*V*}}^{2}}';

export const LIGNINGER = {
  tiden: {
    // Forordet (drejebogen afsnit 7): s. 891-921 er 31 sider, "Bern, Juni 1905" står på s. 921, og artiklen begynder med en
    // magnet og en leder (s. 891, l. 1-21, faktafilen afsnit 2)
    forord: {
      sted: 'Bern, juni 1905',
      tekst: 'Einstein skriver 31 sider til tidsskriftet Annalen der Physik. Han begynder ikke med lys, men med en magnet og en ledning, og først på side 904 står det, han har regnet sig frem til: Et ur, der farer af sted, går langsommere, set fra dem, der står stille.',
    },
    side: {
      id: 's904', navn: 's. 904',
      fil: 'billeder/biblioteket/einstein-s904.webp', b: 1000, h: 1686,
      hvor: 'Annalen der Physik, bind 17 (1905), side 904',
      alt: 'Side 904 fra Annalen der Physik 1905 med tysk tekst og tre formler. Den nederste formel er τ = t gange kvadratroden af 1 minus v over V i anden.',
      hoved: ['904', 'A. Einstein.'],
      // Siden linje for linje som på billedet (læst på sidebilledet n127, 22. november 2026). sted: linjen hører til et
      // glødende sted
      linjer: [
        'System ruhend die Zeit *τ* anzugeben befähigt sind, im Koordi-',
        'natenursprung von *k* gelegen und so gerichtet, daß sie die',
        'Zeit *τ* angibt.  Wie schnell geht diese Uhr, vom ruhenden',
        'System aus betrachtet?',
        '>Zwischen die Größen *x*, *t* und *τ*, welche sich auf den Ort',
        'dieser Uhr beziehen, gelten offenbar die Gleichungen:',
        { f: `*τ* = \\b{1}{${TAU_ROD}}\\p{*t* − \\b{*v*}{*V*^{2}} *x*}` },
        'und',
        { f: '*x* = *v t*.' },
        'Es ist also',
        { f: `*τ* = *t*${TAU_ROD} = *t* − \\p{1 − ${TAU_ROD}}*t*,`, sted: 'formlen' },
        { t: 'woraus folgt, daß die Angabe der Uhr (im ruhenden System', sted: 'formlen' },
        { t: 'betrachtet) pro Sekunde um (1 − \\r{1 − (*v*/*V*)^{2}}) Sek. oder — bis', sted: 'formlen' },
        { t: 'auf Größen vierter und höherer Ordnung um ½(*v*/*V*)^{2} Sek.', sted: 'formlen' },
        { t: 'zurückbleibt.', sted: 'formlen' },
        '>Hieraus ergibt sich folgende eigentümliche Konsequenz.',
        'Sind in den Punkten *A* und *B* von *K* ruhende, im ruhenden',
        'System betrachtet, synchron gehende Uhren vorhanden, und',
        'bewegt man die Uhr in *A* mit der Geschwindigkeit *v* auf der',
        'Verbindungslinie nach *B*, so gehen nach Ankunft dieser Uhr',
        'in *B* die beiden Uhren nicht mehr synchron, sondern die von *A*',
        'nach *B* bewegte Uhr geht gegenüber der von Anfang an in *B*',
        'befindlichen um ½ *t v*^{2}/*V*^{2} Sek. (bis auf Größen vierter und',
        'höherer Ordnung) nach, wenn *t* die Zeit ist, welche die Uhr',
        'von *A* nach *B* braucht.',
        '>Man sieht sofort, daß dies Resultat auch dann noch gilt,',
        'wenn die Uhr in einer beliebigen polygonalen Linie sich von *A*',
        'nach *B* bewegt, und zwar auch dann, wenn die Punkte *A*',
        'und *B* zusammenfallen.',
        { t: '>Nimmt man an, daß das für eine polygonale Linie be-', sted: 'rundturen' },
        { t: 'wiesene Resultat auch für eine stetig gekrümmte Kurve gelte,', sted: 'rundturen' },
        { t: 'so erhält man den Satz: Befinden sich in *A* zwei synchron', sted: 'rundturen' },
        { t: 'gehende Uhren und bewegt man die eine derselben auf einer', sted: 'rundturen' },
        { t: 'geschlossenen Kurve mit konstanter Geschwindigkeit, bis sie', sted: 'rundturen' },
        { t: 'wieder nach *A* zurückkommt, was *t* Sek. dauern möge, so geht', sted: 'rundturen' },
        { t: 'die letztere Uhr bei ihrer Ankunft in *A* gegenüber der un-', sted: 'rundturen' },
      ],
    },
    vælg: 'Tryk på et sted, der lyser. Så kommer det tyske og vores oversættelse.',
    // De glødende steder (drejebogen afsnit 7). felter er firkanter i % af det klippede billede (målt med blækket i hver
    // række, lav_bogsider.py einstein). kort er den lette forklaring, der står først
    steder: [
      {
        id: 'formlen', navn: 'Uret kommer bagud', linjer: 'Formlen og linje 9-12',
        felter: [[20.5, 33.2, 65.5, 4.3], [9.2, 37.8, 88.3, 6.9], [9.2, 44.8, 18.5, 2]],
        kort: 'Uret, der bevæger sig, kommer bagud. Ved små farter er det ½(v/V)² sekund for hvert sekund.',
        tysk: 'τ = t√(1 − (v/V)²) … woraus folgt, daß die Angabe der Uhr (im ruhenden System betrachtet) pro Sekunde um (1 − √(1 − (v/V)²)) Sek. oder — bis auf Größen vierter und höherer Ordnung um ½(v/V)² Sek. zurückbleibt.',
        dansk: '… og deraf følger, at det, uret viser (set fra det hvilende system), kommer (1 − √(1 − (v/V)²)) sekund bagud pr. sekund, eller ½(v/V)² sekund, når man ser bort fra størrelser af fjerde og højere orden.',
      },
      {
        id: 'rundturen', navn: 'Uret, der flyver en tur', linjer: 'Linje 27-33 (og øverst på s. 905)',
        felter: [[16.2, 79.1, 81.4, 2.5], [9.4, 81.5, 88.2, 13.8]],
        kort: 'Det er uret fra turen: Er der to ure i takt, og flyver det ene en tur rundt og hjem igen, så er det bagud, når det kommer tilbage.',
        tysk: 'Befinden sich in A zwei synchron gehende Uhren und bewegt man die eine derselben auf einer geschlossenen Kurve mit konstanter Geschwindigkeit, bis sie wieder nach A zurückkommt, was t Sek. dauern möge, so geht die letztere Uhr bei ihrer Ankunft in A gegenüber der unbewegt gebliebenen um ½ t (v/V)² Sek. nach.',
        dansk: 'Er der i A to ure, der går i takt, og flytter man det ene rundt ad en lukket kurve med konstant fart, til det er tilbage i A, hvad der tager t sekunder, så er det ur, når det kommer tilbage til A, ½ t (v/V)² sekund bagud i forhold til det, der blev stående. (Sætningen slutter øverst på s. 905.)',
      },
    ],
    // Ligningen stor, som på siden (med V og ikke c). Led for led i drejebogens rækkefølge (afsnit 7): den lette linje
    // først og "I dag skriver man …" under den. Bogstaverne står som spændvidder i js/bog-ligning.js (ligningTiden)
    ligning: {
      navn: 'τ = t√(1 − (v/V)²)',
      alt: 'tau er lig med t gange kvadratroden af 1 minus v over V i anden',
      start: 'Led for led',
      næste: 'Næste led',
      forfra: 'Forfra',
      hjælp: 'Tryk på et bogstav i ligningen, eller gå led for led.',
      // Navnene står med den lille opmærkning (matte i js/bog-ligning.js)
      led: [
        { id: 't', navn: '*t*', linje: 'Tiden på urene, der står stille (perronen, Jorden).' },
        { id: 'tau', navn: '*τ*', linje: 'Tiden på uret, der farer af sted. τ er det græske t og hedder "tau".' },
        { id: 'v', navn: '*v*', linje: 'Urets fart.' },
        { id: 'V', navn: '*V*', linje: 'Lysets fart. Einstein skrev V.', idag: 'I dag skriver man c.' },
        { id: 'brok', navn: '*v*/*V*', linje: 'Hvor stor en del af lysets fart uret har: 0,5 er halvdelen.' },
        { id: 'kvadrat', navn: '(*v*/*V*)^{2}', linje: 'Det tal ganget med sig selv: 0,5 · 0,5 = 0,25.' },
        { id: 'enminus', navn: '1 − (*v*/*V*)^{2}', linje: 'Altid mindre end 1, når uret bevæger sig.' },
        { id: 'rod', navn: '√', linje: 'Kvadratroden. Den er også mindre end 1, så τ bliver mindre end t: Uret viser mindre tid.' },
      ],
      // Efter det sidste led (slut): uret fra turen regnet med ligningen (0,87² = 0,7569, 1 − 0,7569 = 0,2431, √0,2431 =
      // 0,493, og 20 · 0,493 = 9,86 s), og man kan selv vælge en af turens farter (det ekstra lag, jeres ønske 21. november
      // 2026). Tallene laves af ledForLedEksempel(), så de passer. titel og tekst får det valgte (v)
      slut: {
        titel: (β) => `Med ${procent(β)} af lysets fart:`,
        tekst: (β) => ledForLedEksempel(β),
        vælg: 'Sæt en anden fart ind:',
        valg: URETS_FARTER.map((β) => ({ v: β, knap: procent(β) })),
        standard: 0.87,
        idag: 'I dag skriver man c for lysets fart: *τ* = *t*\\r{1 − *v*^{2}/*c*^{2}}.',
      },
    },
    // "Regn selv" (gåden, drejebogen afsnit 7): ½(v/V)² ved 1 % af lysets fart i et døgn (86.400 s) giver 4,32 s
    regn: {
      titel: 'Regn selv: Hvor meget bagud?',
      intro: 'Et ur flyver med 1 % af lysets fart (ca. 10,8 millioner km/t) i et døgn. Hvor meget kommer det bagud? Brug Einsteins lette udgave fra siden: ½(v/V)².',
      β: 0.01,
      // Trinene (res er det, der står, når knappen er trykket), svaret og nørd-tabellen regnes i bagudLet/bagudRigtig
      // (testet i Node). Ved 100 km/t er det kun 0,000 000 000 37 sekund om dagen
      trin: [
        { tekst: 'v/V er 0,01. Gang det med sig selv.', knap: '× sig selv', res: `0,01 · 0,01 = ${dansk(0.01 * 0.01, 4)}` },
        { tekst: 'Tag halvdelen.', knap: '½ ·', res: `½ · ${dansk(0.01 * 0.01, 4)} = ${dansk(bagudLet(0.01), 5)}. Uret kommer ${dansk(bagudLet(0.01), 5)} sekund bagud for hvert sekund.` },
        { tekst: 'Et døgn har 86.400 sekunder. Hvor meget er uret bagud efter et døgn?' },
      ],
      valg: [{ tekst: '0,4 sekund', for: 'lidt' }, { tekst: '4,3 sekunder', rigtig: true }, { tekst: '43 sekunder', for: 'meget' }],
      vink: { lidt: 'For lidt.', meget: 'For meget.', fælles: 'Gang 0,00005 med 86.400. Det er det samme som 86.400 delt med 20.000.' },
      svar: `${dansk(bagudPrDøgn(0.01), 1)} sekunder om dagen.`,
      svarMere: `Ved 100 km/t er det kun ${småGram(bagudPrDøgn(100 / 3.6 / LYSETS_FART), 11)} sekund. Så lidt kan ingen mærke.`,
      igen: 'Regn igen',
      nørd: {
        titel: 'For nørder: Passer den lette udgave altid?',
        tekst: 'Nej. Ved 87 % giver den lette udgave 0,38, men den rigtige formel giver 0,51 sekund bagud pr. sekund, altså at uret går halvt så hurtigt. Den lette udgave passer kun ved små farter. Det skriver Einstein selv: "bis auf Größen vierter und höherer Ordnung" (når man ser bort fra størrelser af fjerde og højere orden).',
        tabel: {
          kolonner: ['Fart', 'Let: ½(v/V)²', 'Rigtig: 1 − √(1 − (v/V)²)'],
          rækker: [0.01, 0.1, 0.5, 0.87].map((β) => [procent(β), treCifre(bagudLet(β)), treCifre(bagudRigtig(β))]),
        },
      },
    },
    // Linje for linje (drejebogen afsnit 7, faktafilen med teksterne afsnit 1): s. 904 og de andre sider fra artiklen
    linjer: {
      titel: 'Linje for linje',
      linje: 'Fire steder fra artiklen på tysk og dansk',
      note: 'Det tyske er skrevet af efter siderne. Den danske oversættelse er vores egen.',
      rækker: [
        { hvor: 's. 891-892: De to regler', tysk: 'Beispiele ähnlicher Art, sowie die mißlungenen Versuche, eine Bewegung der Erde relativ zum „Lichtmedium" zu konstatieren, führen zu der Vermutung, daß dem Begriffe der absoluten Ruhe nicht nur in der Mechanik, sondern auch in der Elektrodynamik keine Eigenschaften der Erscheinungen entsprechen, sondern daß vielmehr für alle Koordinatensysteme, für welche die mechanischen Gleichungen gelten, auch die gleichen elektrodynamischen und optischen Gesetze gelten, wie dies für die Größen erster Ordnung bereits erwiesen ist. Wir wollen diese Vermutung (deren Inhalt im folgenden „Prinzip der Relativität" genannt werden wird) zur Voraussetzung erheben und außerdem die mit ihm nur scheinbar unverträgliche Voraussetzung einführen, daß sich das Licht im leeren Raume stets mit einer bestimmten, vom Bewegungszustande des emittierenden Körpers unabhängigen Geschwindigkeit V fortpflanze.', dansk: 'Eksempler af samme slags og de mislykkede forsøg på at påvise, at Jorden bevæger sig i forhold til "lysmediet", fører til den formodning, at intet ved fænomenerne svarer til begrebet absolut hvile, hverken i mekanikken eller i elektrodynamikken, men at de samme elektrodynamiske og optiske love tværtimod gælder i alle koordinatsystemer, hvor mekanikkens ligninger gælder, sådan som det allerede er vist for størrelserne af første orden. Vi vil gøre denne formodning (hvis indhold i det følgende kaldes "relativitetsprincippet") til en forudsætning og desuden indføre en forudsætning, som kun tilsyneladende ikke kan forenes med den: at lyset i det tomme rum altid breder sig med en bestemt fart V, som ikke afhænger af, hvordan det legeme, der sender lyset ud, bevæger sig.' },
        { hvor: 's. 893: Toget klokken 7', tysk: 'Wir haben zu berücksichtigen, daß alle unsere Urteile, in welchen die Zeit eine Rolle spielt, immer Urteile über gleichzeitige Ereignisse sind. Wenn ich z. B. sage: „Jener Zug kommt hier um 7 Uhr an," so heißt dies etwa: „Das Zeigen des kleinen Zeigers meiner Uhr auf 7 und das Ankommen des Zuges sind gleichzeitige Ereignisse."', dansk: 'Vi må huske, at alle vores udsagn, hvor tiden spiller en rolle, altid er udsagn om samtidige begivenheder. Når jeg fx siger: "Toget kommer hertil klokken 7", så betyder det omtrent: "At den lille viser på mit ur peger på 7, og at toget kommer, er samtidige begivenheder."' },
        { hvor: 's. 903-904: Hvor hurtigt går uret?', tysk: 'Wir denken uns ferner eine der Uhren, welche relativ zum ruhenden System ruhend die Zeit t, relativ zum bewegten System ruhend die Zeit τ anzugeben befähigt sind, im Koordinatenursprung von k gelegen und so gerichtet, daß sie die Zeit τ angibt. Wie schnell geht diese Uhr, vom ruhenden System aus betrachtet?', dansk: 'Vi forestiller os desuden et af de ure, der kan vise tiden t, når de står stille i det hvilende system, og tiden τ, når de står stille i det bevægede system. Det ligger i begyndelsespunktet for k og er stillet, så det viser tiden τ. Hvor hurtigt går dette ur, set fra det hvilende system?' },
        { hvor: 's. 905: Uret ved ækvator', tysk: 'Man schließt daraus, daß eine am Erdäquator befindliche Unruhuhr um einen sehr kleinen Betrag langsamer laufen muß als eine genau gleich beschaffene, sonst gleichen Bedingungen unterworfene, an einem Erdpole befindliche Uhr.', dansk: 'Deraf slutter man, at et ur med uro ved Jordens ækvator må gå en meget lille smule langsommere end et helt ens ur ved en af Jordens poler, når alt andet er det samme. (Det passer ikke, se "Ærligt talt".)' },
      ],
    },
    // For nørder (drejebogen afsnit 7 og faktafilen afsnit 2 og 5)
    nørd: {
      titel: 'For nørder',
      punkter: [
        'Artiklen hedder "Zur Elektrodynamik bewegter Körper" (Om elektrodynamikken i legemer, der bevæger sig). Ordet relativitetsteori kom først året efter, fra Planck og Bucherer.',
        'Einstein skrev V for lysets fart. Det lille c brugte han først i 1907.',
        'Artiklen har ingen henvisninger til andres arbejde, og den eneste, der takkes, er vennen og kollegaen M. Besso (s. 921).',
        'Han nævner kun "die mißlungenen Versuche" (de mislykkede forsøg) på at måle, hvordan Jorden bevæger sig gennem "lysmediet". Michelson og Morley står ikke ved navn.',
        'Lysuret, du kan se i Rejsen i tid, er ikke Einsteins. Det kom i 1909 (Lewis og Tolman).',
        'Ole Rømer viste i 1676, at lyset bruger tid. Einstein gjorde lysets fart til en regel for alle.',
      ],
    },
    // Ærligt talt (faktafilen afsnit 2 og 6): skanningen er en mikrofilm uden licens (jeres svar 1), og ækvatoruret var forkert
    ærligt: {
      titel: 'Ærligt talt',
      linje: 'Hvad siden ikke siger, og hvor Einstein tog fejl',
      punkter: [
        '"Set fra dem, der står stille" er regnet, ikke noget, man ser med øjnene. Den, der rejser med uret, mærker intet: For den rejsende går uret helt normalt.',
        'Lige efter rundturen (s. 905) skriver Einstein, at et ur ved ækvator må gå langsommere end et ved polen. Det passer ikke: Tyngden, som han først tog med i sin teori senere, ophæver forskellen, så alle ure ved havets overflade går lige hurtigt.',
        'Den lette udgave ½(v/V)² passer kun ved små farter (se "Regn selv").',
        'Siden er fotograferet fra en mikrofilm, så den er grå og lidt uskarp. "Sat tekst" er de samme linjer sat af os.',
      ],
    },
    seSelv: { tekst: 'Se det selv i Rejsen i tid', gaa: 'kosmos:tid' },
    // Knappen videre (den røde tråd) står kun, når der er et opslag efter (energien kommer i E4)
    videre: 'Tre måneder senere fandt han noget mere. Hvad med massen?',
  },
  // ---------- Opslag 4: 1905, energien (E4, drejebogen afsnit 8, faktafilen afsnit 3 og teksterne afsnit 2) ----------
  energien: {
    ord: ['masse'], // fagordet i forordet (Ordbogen, E4)
    // Forordet: "Bern, September 1905" står på s. 641, og artiklen er tre sider (s. 639-641). Den første sætning henviser med
    // fodnoten "A. Einstein, Ann. d. Phys. 17. p. 891. 1905" til artiklen om tiden (s. 639, læst på sidebilledet n232)
    forord: {
      sted: 'Bern, september 1905',
      tekst: 'Einstein sender tre sider mere til Annalen der Physik. Den første sætning siger, at de bygger på artiklen om tiden. Han forestiller sig et legeme, der sender lige meget lys ud til begge sider, og regner ud, hvad det betyder for dets masse. Han skriver ikke E = mc², men noget, der betyder det samme.',
    },
    side: {
      id: 's641', navn: 's. 641',
      fil: 'billeder/biblioteket/einstein-s641.webp', b: 1000, h: 1525,
      hvor: 'Annalen der Physik, bind 18 (1905), side 641',
      alt: 'Side 641 fra Annalen der Physik 1905, artiklens sidste side, med tysk tekst og fire formler. Midt på siden står, at massen bliver L over V i anden mindre, og nederst Bern, September 1905.',
      hoved: ['', 'Trägheit eines Körpers von seinem Energieinhalt abhängig?', '641'],
      // Siden linje for linje som på billedet (læst på sidebilledet n234, 22. november 2026). 29 linjer og fire formler.
      // Den første linje er slutningen af "addi-tiven" fra s. 640
      linjer: [
        'tiven Konstanten der Energien *H* und *E* abhängt.  Wir können',
        'also setzen:',
        { f: '*H*_{0} − *E*_{0} = *K*_{0} + *C*,' },
        { f: '*H*_{1} − *E*_{1} = *K*_{1} + *C*,' },
        'da *C* sich während der Lichtaussendung nicht ändert.  Wir',
        'erhalten also:',
        { f: '*K*_{0} − *K*_{1} = *L*\\h{\\b{1}{\\r{1 − \\p{\\b{*v*}{*V*}}^{2}}} − 1}.' },
        'Die kinetische Energie des Körpers in bezug auf (*ξ*, *η*, *ζ*) nimmt',
        'infolge der Lichtaussendung ab, und zwar um einen von den',
        'Qualitäten des Körpers unabhängigen Betrag.  Die Differenz',
        '*K*_{0} − *K*_{1} hängt ferner von der Geschwindigkeit ebenso ab wie',
        'die kinetische Energie des Elektrons (l. c. § 10).',
        '>Unter Vernachlässigung von Größen vierter und höherer',
        'Ordnung können wir setzen:',
        { f: '*K*_{0} − *K*_{1} = \\b{*L*}{*V*^{2}} \\b{*v*^{2}}{2}.' },
        { t: 'Aus dieser Gleichung folgt unmittelbar:', sted: 'massen' },
        { t: '>Gibt ein Körper die Energie *L* in Form von Strahlung', sted: 'massen' },
        { t: 'ab, so verkleinert sich seine Masse um *L*/*V*^{2}.  Hierbei ist es', sted: 'massen' },
        { t: 'offenbar unwesentlich, daß die dem Körper entzogene Energie', sted: 'massen' },
        { t: 'gerade in Energie der Strahlung übergeht, so daß wir zu der', sted: 'massen' },
        { t: 'allgemeineren Folgerung geführt werden:', sted: 'massen' },
        { t: '>Die Masse eines Körpers ist ein Maß für dessen Energie-', sted: 'massen' },
        { t: 'inhalt; ändert sich die Energie um *L*, so ändert sich die Masse', sted: 'massen' },
        { t: 'in demselben Sinne um *L*/9.10^{20}, wenn die Energie in Erg', sted: 'massen' },
        { t: 'und die Masse in Grammen gemessen wird.', sted: 'massen' },
        { t: '>Es ist nicht ausgeschlossen, daß bei Körpern, deren', sted: 'radium' },
        { t: 'Energieinhalt in hohem Maße veränderlich ist (z. B. bei den', sted: 'radium' },
        { t: 'Radiumsalzen), eine Prüfung der Theorie gelingen wird.', sted: 'radium' },
        '>Wenn die Theorie den Tatsachen entspricht, so überträgt',
        'die Strahlung Trägheit zwischen den emittierenden und absor-',
        'bierenden Körpern.',
        '>Bern, September 1905.',
        { t: '(Eingegangen 27. September 1905.)', midt: true },
      ],
    },
    vælg: 'Tryk på et sted, der lyser. Så kommer det tyske og vores oversættelse.',
    // De glødende steder (drejebogen afsnit 8). felter målt med blækket i hver række på einstein-s641.webp (linje 12-21 er
    // y 48,5-68,7 %, linje 22-24 er y 69,4-75,3 %, teksten går fra x 6,5 til 79,1 %)
    steder: [
      {
        id: 'massen', navn: 'Massen bliver mindre', linjer: 'Linje 12-21',
        felter: [[5.8, 48, 74.2, 20.9]],
        kort: 'Sender noget energien L ud som lys, bliver massen L/V² mindre. Og det gælder al energi: Massen er et mål for, hvor meget energi der er i noget. I dag skriver man E = mc².',
        tysk: 'Gibt ein Körper die Energie L in Form von Strahlung ab, so verkleinert sich seine Masse um L/V². … Die Masse eines Körpers ist ein Maß für dessen Energieinhalt; ändert sich die Energie um L, so ändert sich die Masse in demselben Sinne um L/9.10²⁰, wenn die Energie in Erg und die Masse in Grammen gemessen wird.',
        dansk: 'Afgiver et legeme energien L som stråling, så bliver dets masse L/V² mindre. … Et legemes masse er et mål for dets energiindhold. Ændres energien med L, så ændres massen samme vej med L/9 · 10²⁰, når energien måles i erg og massen i gram.',
      },
      {
        id: 'radium', navn: 'Prøv det med radium', linjer: 'Linje 22-24',
        felter: [[5.8, 69.2, 74.2, 6.4]],
        kort: 'Han foreslår, hvordan man kan prøve det: med radiumsalte, hvis energi ændrer sig meget. Den første måling, der passede, kom først i 1933.',
        tysk: 'Es ist nicht ausgeschlossen, daß bei Körpern, deren Energieinhalt in hohem Maße veränderlich ist (z. B. bei den Radiumsalzen), eine Prüfung der Theorie gelingen wird.',
        dansk: 'Det er ikke udelukket, at det vil lykkes at prøve teorien med legemer, hvis energiindhold ændrer sig meget (fx radiumsalte).',
      },
    ],
    // Ligningen stor: "seine Masse" bliver L/V² mindre (Einstein skrev ikke Δm og ikke E = mc², fælden). Under den står
    // hans eget tal for V² i erg og gram (l. 20). Led for led i drejebogens orden (afsnit 8)
    ligning: {
      navn: 'Masse − L/V²',
      alt: 'Massen bliver L over V i anden mindre. V i anden er 9 gange 10 i tyvende',
      start: 'Led for led',
      næste: 'Næste led',
      forfra: 'Forfra',
      hjælp: 'Tryk på et bogstav i ligningen, eller gå led for led.',
      led: [
        { id: 'L', navn: '*L*', linje: 'Energien, der forsvinder ud som lys (Einstein skriver "Strahlung", stråling). Han målte den i erg, i dag i joule.', idag: 'I dag skriver man E.' },
        { id: 'V2', navn: '*V*^{2}', linje: 'Lysets fart ganget med sig selv: et kæmpe tal (90 millioner milliarder, når farten er i meter i sekundet).', idag: 'I dag skriver man c².' },
        { id: 'brok', navn: '*L*/*V*^{2}', linje: 'Energien delt med det kæmpe tal. Derfor bliver massen kun en lillebitte smule mindre.' },
        { id: 'masse', navn: 'Masse', linje: 'Hvor svært noget er at sætte i gang eller standse. Einstein spørger i titlen, om "Trägheit" (træghed) afhænger af energien.' },
        { id: 'tal', navn: '9 · 10^{20}', linje: 'Einsteins eget tal for V²: lysets fart, 30 milliarder centimeter i sekundet, ganget med sig selv.' },
      ],
      // Efter det sidste led: ligningen vendt om (m = L/V² er det samme som L = mV², i dag E = mc²) med tre masser. Tallene
      // laves af energiEksempel() (1 g: ca. 90.000.000.000.000 J og ca. 28.500 år for lampen, testet i Node)
      slut: {
        titel: (kg) => `${kg >= 1 ? '1 kg' : kg >= 1e-3 ? '1 gram' : '4 milliardtedele gram'} bliver til energi:`,
        tekst: (kg) => energiEksempel(kg),
        vælg: 'Prøv en anden masse:',
        valg: [{ v: massetab(), knap: '4 milliardtedele g' }, { v: 0.001, knap: '1 gram' }, { v: 1, knap: '1 kg' }],
        standard: 0.001,
        // intro står før eksemplet (det, eksemplet regner med)
        intro: 'Vend den om: Massen *m* = *L*/*V*^{2} er det samme som *L* = *m* · *V*^{2}. I dag skriver man *E* = *mc*^{2}: Energien er massen gange lysets fart i anden.',
      },
    },
    // "Regn selv: Hvor meget lettere?" (drejebogen afsnit 8): batteriet fra trin 3 i turen. 100 W · 3.600 s = 360.000 J, og
    // 360.000 / c² = 4,0 · 10⁻¹² kg = 4 milliardtedele gram. Del to: Solen, 3,828 · 10²⁶ W / c² = 4,26 · 10⁹ kg/s (testet i Node).
    // Ikke en lampe i stikkontakten (fælden): Det er batteriet, der sender energien ud, og det er al energien, lys og varme
    regn: {
      titel: 'Regn selv: Hvor meget lettere?',
      intro: 'Et batteri får en lampe på 100 watt til at lyse i en time. Al energien forsvinder ud som lys og varme. Hvor meget lettere bliver batteriet og lampen? Brug Einsteins L/V².',
      trin: [
        { tekst: '100 watt er 100 joule hvert sekund, og en time har 3.600 sekunder.', knap: '100 · 3.600', res: `${dansk(LAMPE_W * TIME)} joule. Det er L.` },
        { tekst: 'Lysets fart er ca. 300.000.000 meter i sekundet. Ganget med sig selv er det ca. 90.000.000.000.000.000. Del L med det.', knap: '÷ V²', res: `${dansk(LAMPE_W * TIME)} ÷ 90.000.000.000.000.000 = ${småGram(massetab(), 12)} kg` },
        { tekst: 'Et kilogram er 1.000 gram. Hvor meget lettere bliver de?' },
      ],
      valg: [{ tekst: '4 gram', for: 'meget' }, { tekst: '4 milligram', for: 'meget' }, { tekst: '4 milliardtedele gram', rigtig: true }],
      vink: { meget: 'For meget.', fælles: `Gang ${småGram(massetab(), 12)} kg med 1.000, og tæl nullerne: Et milligram er 0,001 gram, og en milliardtedel gram er 0,000 000 001 gram.` },
      svar: '4 milliardtedele gram.',
      svarMere: 'Det kunne ingen vægt i 1905 mærke. Derfor foreslog Einstein radium.',
      // Del to (efter det rigtige svar): Solen
      efter: {
        tekst: 'Gør det samme med Solen. Den sender ca. 380 millioner milliarder milliarder joule ud hvert sekund.',
        knap: '÷ V²',
        res: `Ca. ${dansk(SOLEN_W / LYSETS_FART ** 2 / 1e9, 1)} milliarder kg hvert sekund: Solen bliver over ${dansk(Math.floor(solensTabTon() / 1e6))} millioner ton lettere i sekundet. Solen er så tung, at den på 4,6 milliarder år alligevel kun har mistet under en tusindedel af sin masse på den måde.`,
      },
      igen: 'Regn igen',
      nørd: {
        titel: 'For nørder: Med Einsteins egne tal',
        tekst: 'Einstein målte energien i erg og massen i gram. En joule er 10 millioner erg. Hans tal giver præcis det samme:',
        tabel: {
          kolonner: ['', 'I dag', 'Einstein 1905'],
          rækker: [
            ['Energien', `${dansk(LAMPE_W * TIME)} joule`, '3,6 · 10¹² erg'],
            ['Del med', 'c² = 9 · 10¹⁶ (m/s)²', 'V² = 9 · 10²⁰ (cm/s)²'],
            ['Massen', '4 · 10⁻¹² kg', '4 · 10⁻⁹ g'],
          ],
        },
      },
    },
    // Linje for linje (drejebogen afsnit 8, teksterne afsnit 2): fodnoten (s. 639), tankeforsøget (s. 640) og s. 641 fra
    // formlen til radiumsaltene
    linjer: {
      titel: 'Linje for linje',
      linje: 'Fem steder fra artiklen på tysk og dansk',
      note: 'Det tyske er skrevet af efter siderne. Den danske oversættelse er vores egen.',
      rækker: [
        { hvor: 's. 639: Den første sætning', tysk: 'Die Resultate einer jüngst in diesen Annalen von mir publizierten elektrodynamischen Untersuchung¹) führen zu einer sehr interessanten Folgerung, die hier abgeleitet werden soll. — ¹) A. Einstein, Ann. d. Phys. 17. p. 891. 1905.', dansk: 'Resultaterne af en elektrodynamisk undersøgelse, som jeg for nylig har offentliggjort i disse Annalen¹), fører til en meget interessant følge, som skal udledes her. — ¹) Det er artiklen om tiden: bind 17, side 891.' },
        { hvor: 's. 640: Lys til begge sider', tysk: 'Dieser Körper sende in einer mit der x-Achse den Winkel φ bildenden Richtung ebene Lichtwellen von der Energie L/2 (relativ zu (x, y, z) gemessen) und gleichzeitig eine gleich große Lichtmenge nach der entgegengesetzten Richtung. Hierbei bleibt der Körper in Ruhe in bezug auf das System (x, y, z).', dansk: 'Lad dette legeme sende plane lysbølger med energien L/2 (målt i forhold til (x, y, z)) ud i en retning, der danner vinklen φ med x-aksen, og samtidig en lige så stor mængde lys i den modsatte retning. Derved bliver legemet i hvile i forhold til systemet (x, y, z). (Det er et tankeforsøg: Einstein skriver "sende", lad det sende.)' },
        { hvor: 's. 641, linje 10-11: Kun små farter', tysk: 'Unter Vernachlässigung von Größen vierter und höherer Ordnung können wir setzen: K₀ − K₁ = (L/V²)·(v²/2).', dansk: 'Når vi ser bort fra størrelser af fjerde og højere orden, kan vi sætte: K₀ − K₁ = (L/V²)·(v²/2). (Det er Newtons bevægelsesenergi ½mv² med massen L/V².)' },
        { hvor: 's. 641, linje 12-21: Massen', tysk: 'Aus dieser Gleichung folgt unmittelbar: Gibt ein Körper die Energie L in Form von Strahlung ab, so verkleinert sich seine Masse um L/V². Hierbei ist es offenbar unwesentlich, daß die dem Körper entzogene Energie gerade in Energie der Strahlung übergeht, so daß wir zu der allgemeineren Folgerung geführt werden: Die Masse eines Körpers ist ein Maß für dessen Energieinhalt; ändert sich die Energie um L, so ändert sich die Masse in demselben Sinne um L/9.10²⁰, wenn die Energie in Erg und die Masse in Grammen gemessen wird.', dansk: 'Af denne ligning følger umiddelbart: Afgiver et legeme energien L som stråling, så bliver dets masse L/V² mindre. Det er åbenbart ligegyldigt, at den energi, legemet mister, netop bliver til stråling, og vi føres derfor til den mere almene følge: Et legemes masse er et mål for dets energiindhold. Ændres energien med L, så ændres massen samme vej med L/9 · 10²⁰, når energien måles i erg og massen i gram.' },
        { hvor: 's. 641, linje 22-27: Radium og træghed', tysk: 'Es ist nicht ausgeschlossen, daß bei Körpern, deren Energieinhalt in hohem Maße veränderlich ist (z. B. bei den Radiumsalzen), eine Prüfung der Theorie gelingen wird. Wenn die Theorie den Tatsachen entspricht, so überträgt die Strahlung Trägheit zwischen den emittierenden und absorbierenden Körpern.', dansk: 'Det er ikke udelukket, at det vil lykkes at prøve teorien med legemer, hvis energiindhold ændrer sig meget (fx radiumsalte). Passer teorien med virkeligheden, så fører strålingen træghed over fra de legemer, der sender den ud, til dem, der opsuger den.' },
      ],
    },
    // For nørder (drejebogen afsnit 8, faktafilen afsnit 3 og 5)
    nørd: {
      titel: 'For nørder',
      punkter: [
        'Han skrev c for lysets fart fra 1907. E = mc² står i hans håndskrift fra 1912, og i 1946 stod den i titlen på en artikel.',
        'Andre var tæt på før ham: Poincaré gav i 1900 lysets energi en "tænkt" masse E/c², og Hasenöhrl fandt i 1904-1905 et tal for lys i en kasse, der var for stort. Einstein var den første, der sagde, at det gælder al energi.',
        'I 1933 passede energien, når lithium og protoner blev til to heliumkerner, med formlen inden for en halv procent.',
        'I Stjerneovnen forsvinder 0,7 % af massen, når brint bliver til helium. Det er den energi, Solen lyser med.',
        'Artiklens titel er et spørgsmål: "Ist die Trägheit eines Körpers von seinem Energieinhalt abhängig?" (Afhænger et legemes træghed af dets energiindhold?). Svaret på side 641 er ja.',
      ],
    },
    // Ærligt talt (faktafilen afsnit 3, 5 og 6, fælden med lampen i stikkontakten)
    ærligt: {
      titel: 'Ærligt talt',
      linje: 'Hvad siden ikke siger',
      punkter: [
        'Einsteins bevis gjaldt kun små farter ("Unter Vernachlässigung von Größen vierter und höherer Ordnung", linje 10-11). Planck påpegede det i 1907, og historikere har diskuteret beviset siden. Einstein beviste det igen på andre måder i 1906 og 1907, og det er målt mange gange siden.',
        'En lampe i stikkontakten bliver ikke lettere: Den får energien ind ad ledningen. Det er det, der sender energien ud, som bliver lettere: batteriet og lampen, eller Solen.',
        '4 milliardtedele gram er alt for lidt til, at en vægt kan mærke det på et helt batteri. Vægten i turen viser kun, hvad der sker, ikke hvor meget.',
        'Siden er fotograferet fra en mikrofilm, så den er grå og lidt uskarp. "Sat tekst" er de samme linjer sat af os.',
      ],
    },
    seSelv: { tekst: 'Se det selv i Stjerneovnen', gaa: 'fusion' },
    videre: 'Hvis masse er energi, hvad gør energien så ved tyngden?',
  },

  // ---------- Opslag 5: 1915, tyngden (E4, drejebogen afsnit 9, faktafilen afsnit 4 og teksterne afsnit 3) ----------
  tyngden: {
    ord: ['feltligning'],
    // Forordet: 4., 11., 18. og 25. november 1915 var torsdage (regnet med datetime, drejebogen afsnit 9). "Energi og masse er
    // det samme": 1916, s. 807, "daß die träge Masse nichts anderes ist als Energie"
    forord: {
      sted: 'Berlin, 25. november 1915',
      tekst: 'Længe har Einstein prøvet at få tyngdekraften med i sin teori. I november lægger han fire meddelelser frem på akademiet i Berlin, en hver torsdag, og i den sidste står feltligningen færdig. Masse og energi er det samme, skriver han senere, og derfor er det energien, der står i den.',
    },
    side: {
      id: 's845', navn: 's. 845',
      fil: 'billeder/biblioteket/einstein-s845.webp', b: 1000, h: 1695,
      hvor: 'Sitzungsberichte der Preußischen Akademie der Wissenschaften 1915, side 845',
      alt: 'Side 845 fra Sitzungsberichte 1915 med tysk tekst og ti nummererede formler. Øverst står G i m er lig med nul, og midt på siden G i m er lig med minus kappa gange parentesen T i m minus en halv g i m T.',
      hoved: ['', '\\k{Einstein}: Die Feldgleichungen der Gravitation', '845'],
      // Siden linje for linje som på billedet (læst på Google-skanningen n372, 22. november 2026). 21 linjer og ti formler
      // med Einsteins numre. Skanningen har gammeldags tal (o og ı for 0 og 1), her sat som almindelige tal
      linjer: [
        { t: '>Die allgemein kovarianten zehn Gleichungen des Gravitationsfeldes', sted: 'ti' },
        { t: 'in Räumen, in denen »Materie« fehlt, erhalten wir, indem wir ansetzen', sted: 'ti' },
        { f: '*G*_{*im*} = 0.', nr: '(2)', sted: 'ti' },
        '>Diese Gleichungen lassen sich einfacher gestalten, wenn man das',
        'Bezugssystem so wählt, daß \\r{−*g*} = 1 ist.  Dann verschwindet *S*_{*im*}',
        'wegen (1b), so daß man statt (2) erhält',
        { f: '*R*_{*im*} = \\s{*l*}\\b{∂Γ\\i{*l*}{*im*}}{∂*x*_{*l*}} + \\s{*ρl*}Γ\\i{*l*}{*iρ*}Γ\\i{*ρ*}{*ml*} = 0', nr: '(3)' },
        { f: '\\r{−*g*} = 1.', nr: '(3a)' },
        '>Dabei ist',
        { f: 'Γ\\i{*l*}{*im*} = −\\c{*im*}{*l*}', nr: '(4)' },
        'gesetzt, welche Größen wir als die »Komponenten« des Gravitations-',
        'feldes bezeichnen.',
        { t: '>Ist in dem betrachteten Raume »Materie« vorhanden, so tritt deren', sted: 'stof' },
        { t: 'Energietensor auf der rechten Seite von (2) bzw. (3) auf.  Wir setzen', sted: 'stof' },
        { f: '*G*_{*im*} = −κ\\p{*T*_{*im*} − \\b{1}{2} *g*_{*im*}*T*},', nr: '(2a)', sted: 'stof' },
        'wobei',
        { f: '\\s{*ρσ*}*g*^{*ρσ*}*T*_{*ρσ*} = \\s{*σ*}*T*\\i{*σ*}{*σ*} = *T*', nr: '(5)' },
        'gesetzt ist; *T* ist der Skalar des Energietensors der »Materie«, die rechte',
        'Seite von (2a) ein Tensor.  Spezialisieren wir wieder das Koordinaten-',
        'system in der gewohnten Weise, so erhalten wir an Stelle von (2a)',
        'die äquivalenten Gleichungen',
        { f: '*R*_{*im*} = \\s{*l*}\\b{∂Γ\\i{*l*}{*im*}}{∂*x*_{*l*}} + \\s{*ρl*}Γ\\i{*l*}{*iρ*}Γ\\i{*ρ*}{*ml*} = −κ\\p{*T*_{*im*} − \\b{1}{2} *g*_{*im*}*T*}', nr: '(6)', lille: true },
        { f: '\\r{−*g*} = 1.', nr: '(3a)' },
        '>Wie stets nehmen wir an, daß die Divergenz des Energietensors',
        'der Materie im Sinne des allgemeinen Differentialkalkuls verschwinde',
        '(Impulsenergiesatz).  Bei der Spezialisierung der Koordinatenwahl ge-',
        'mäß (3a) kommt dies darauf hinaus, daß die *T*_{*im*} die Bedingungen',
        { f: '\\s{*λ*}\\b{∂*T*\\i{*λ*}{*σ*}}{∂*x*_{*λ*}} = −\\b{1}{2}\\s{*μν*}\\b{∂*g*^{*μν*}}{∂*x*_{*σ*}}*T*_{*μν*}', nr: '(7)' },
        'oder',
        { f: '\\s{*λ*}\\b{∂*T*\\i{*λ*}{*σ*}}{∂*x*_{*λ*}} = −\\s{*μν*}Γ\\i{*μ*}{*σν*}*T*\\i{*ν*}{*μ*}', nr: '(7a)' },
        'erfüllen sollen.',
      ],
    },
    vælg: 'Tryk på et sted, der lyser. Så kommer det tyske og vores oversættelse.',
    // De glødende steder (drejebogen afsnit 9). felter målt med blækket i hver række på einstein-s845.webp (linje 1-2 og
    // (2) er y 4,2-10,2 %, linje 9-10 og (2a) er y 35,5-42,8 %, teksten går fra x 3,9 til 90,4 %)
    steder: [
      {
        id: 'ti', navn: 'Ti ligninger', linjer: 'Linje 1-2 og formel (2)',
        felter: [[3.2, 3.8, 87.8, 6.8]],
        kort: 'Ti ligninger for tyngdefeltet, hvor der ikke er noget stof. Med dem regnede han Merkurs bane en uge før.',
        tysk: 'Die allgemein kovarianten zehn Gleichungen des Gravitationsfeldes in Räumen, in denen »Materie« fehlt, erhalten wir, indem wir ansetzen G_im = 0.',
        dansk: 'De ti ligninger for tyngdefeltet i rum, hvor der ikke er "stof", får vi ved at sætte G_im = 0. (Einstein skriver "allgemein kovarianten": De ser ens ud, uanset hvordan man lægger sine koordinater.)',
      },
      {
        id: 'stof', navn: 'Ligningen med stof', linjer: 'Linje 9-10 og formel (2a)',
        felter: [[3.2, 35.1, 87.8, 8.1]],
        kort: 'Ligningen med stof: Energien og stoffet til højre fortæller rumtiden til venstre, hvordan den skal krumme.',
        tysk: 'Ist in dem betrachteten Raume »Materie« vorhanden, so tritt deren Energietensor auf der rechten Seite von (2) bzw. (3) auf. Wir setzen G_im = −κ(T_im − ½ g_im T).',
        dansk: 'Er der "stof" i det rum, vi ser på, så kommer dets energitensor ind på højre side af (2) eller (3). Vi sætter G_im = −κ(T_im − ½ g_im T).',
      },
    ],
    // Ligningen stor som på siden: G_im = −κ(T_im − ½ g_im T) (2a). Led for led i drejebogens orden (afsnit 9), forenklet, og
    // det siges i "Ærligt talt". i og m er de små bogstaver under G, T og g (et tryk lyser dem alle op)
    ligning: {
      navn: 'G_im = −κ(T_im − ½ g_im T)',
      alt: 'G i m er lig med minus kappa gange parentesen T i m minus en halv g i m T',
      start: 'Led for led',
      næste: 'Næste led',
      forfra: 'Forfra',
      hjælp: 'Tryk på et bogstav i ligningen, eller gå led for led.',
      led: [
        { id: 'g', navn: '*g*_{*im*}', linje: 'Rumtidens målestokke og ure i hvert punkt: hvordan man måler afstand og tid lige dér. Det er det, man leder efter.' },
        { id: 'G', navn: '*G*_{*im*}', linje: 'Et mål for, hvor krum rumtiden er. Det regnes ud af g_im, og af hvordan den ændrer sig fra sted til sted.', idag: 'I dag hedder Einsteins G_im Ricci-tensoren og skrives R_μν.' },
        { id: 'im', navn: '*i*, *m*', linje: 'Tal fra 1 til 4: tre retninger i rummet og tiden. Derfor er det ikke én ligning, men mange (se "Regn selv").' },
        { id: 'kappa', navn: 'κ', linje: 'Et lillebitte tal, hvor Newtons tyngdekonstant gemmer sig. Derfor skal der meget masse til, før rumtiden krummer mærkbart.', idag: 'κ hedder "kappa". I dag skriver man 8πG/c⁴ i stedet.' },
        { id: 'T', navn: '*T*_{*im*}', linje: 'Hvor meget energi der er (og dermed masse, se opslaget før), hvordan den strømmer, og hvor hårdt den trykker. Einstein kalder det stoffets energitensor.' },
        { id: 'halv', navn: '½ *g*_{*im*}*T*', linje: 'Det nye stykke fra 25. november, der fik det hele til at passe. T uden små bogstaver er én samlet sum af alle T_im.' },
        { id: 'lig', navn: '=', linje: 'Ikke en udregning, men en regel, der skal gælde i hvert punkt, hele tiden.' },
      ],
      // Efter det sidste led: John Wheelers korte udgave (uden anførselstegn, ordlyden varierer, faktafilen afsnit 4) og
      // ligningen, som man skriver den i dag (fælden: G_im er Ricci-tensoren, ½-leddet står på den anden side, Λ fra 1917)
      slut: {
        titel: 'Kort sagt:',
        tekst: 'Stoffet fortæller rumtiden, hvordan den skal krumme, og rumtiden fortæller stoffet, hvordan det skal bevæge sig. Sådan sagde fysikeren John Wheeler det senere.',
        idag: 'I dag skriver man den *R*_{μν} − ½*R* *g*_{μν} + Λ*g*_{μν} = (8π*G*/*c*^{4}) *T*_{μν}. Uden Λ, der kom til i 1917, er det den samme ligning, bare med ½-leddet på den anden side.',
      },
    },
    // "Regn selv: Hvor mange ligninger gemmer der sig i én?" (drejebogen afsnit 9): skemaet med 4 · 4 = 16 felter, de 6 over
    // den skrå linje er dobbelte (G₁₂ = G₂₁), og 10 er tilbage, som Einstein skriver: "zehn Gleichungen" (testet i Node)
    regn: {
      titel: 'Regn selv: Hvor mange ligninger gemmer der sig i én?',
      intro: 'Einstein skriver G_im med to små bogstaver, i og m. Hver af dem kan være 1, 2, 3 eller 4: tre retninger i rummet og tiden.',
      // Skemaet står fremme fra trin fra, og i trin fold trykker man på de dobbelte felter
      skema: { n: 4, fra: 0, fold: 1 },
      trin: [
        { tekst: 'Hvert felt i skemaet er én ligning. Hvor mange felter er der?', knap: '4 · 4', res: `${felterIAlt()} felter.` },
        { tekst: 'Men G₁₂ er det samme som G₂₁. Tryk på de felter, der er dobbelte.', res: `${dobbelte()} felter var dobbelte. De lægger sig oven på deres makker.` },
        { tekst: 'Hvor mange forskellige ligninger er der så?' },
      ],
      valg: [{ tekst: String(felterIAlt()), for: 'meget' }, { tekst: String(forskellige()), rigtig: true }, { tekst: '4', for: 'lidt' }],
      vink: {
        meget: 'For mange. Tæl felterne, der er tilbage i skemaet.',
        lidt: 'For få. Felterne på den skrå linje (G₁₁, G₂₂, G₃₃ og G₄₄) har ingen makker, så de bliver.',
        fælles: '',
        diagonal: 'Det felt ligger på den skrå linje og har ingen makker. Tryk på et felt over den.',
      },
      svar: `${forskellige()}, som Einstein selv skriver: "zehn Gleichungen".`,
      svarMere: 'Ti ligninger, der hænger sammen, og de skal løses alle på én gang.',
      // Står fremme under "Regn selv" (jeres ønske om at sige det ærligt, drejebogen afsnit 9)
      ikke: 'Med Newtons lov kan man sætte tal ind og få et svar. Det kan man ikke her: De ti ligninger skal løses, og det kræver matematik fra universitetet. Selv Einstein fik hjælp af matematikeren Grossmann.',
      igen: 'Regn igen',
      nørd: {
        titel: 'For nørder: Hvorfor er G₁₂ det samme som G₂₁?',
        tekst: 'Fordi det ikke betyder noget, hvilken af de to retninger man nævner først (på fagsprog: den er symmetrisk). Det samme gælder g_im og T_im. Med flere eller færre retninger bliver tallet et andet:',
        tabel: {
          kolonner: ['Retninger og tid', 'Felter', 'Forskellige'],
          rækker: [2, 3, 4, 5].map((n) => [String(n), String(felterIAlt(n)), String(forskellige(n))]),
        },
      },
    },
    // Linje for linje (drejebogen afsnit 9, teksterne afsnit 3, alt læst på Google-skanningen n371-n374 og i 1916 på
    // mikrofilmen): s. 844, s. 845 (begge steder), s. 847, og 1916, s. 822 (lyset og Merkur)
    linjer: {
      titel: 'Linje for linje',
      linje: 'Seks steder fra 1915 og 1916 på tysk og dansk',
      note: 'Det tyske er skrevet af efter siderne. Den danske oversættelse er vores egen.',
      rækker: [
        { hvor: '1915, s. 844: På en lidt anden måde', tysk: 'Neuerdings finde ich nun, daß man ohne Hypothese über den Energietensor der Materie auskommen kann, wenn man den Energietensor der Materie in etwas anderer Weise in die Feldgleichungen einsetzt, als dies in meinen beiden früheren Mitteilungen geschehen ist. Die Feldgleichungen für das Vakuum, auf welche ich die Erklärung der Perihelbewegung des Merkur gegründet habe, bleiben von dieser Modifikation unberührt.', dansk: 'Nu finder jeg, at man kan klare sig uden en hypotese om stoffets energitensor, hvis man sætter stoffets energitensor ind i feltligningerne på en lidt anden måde, end jeg gjorde i mine to tidligere meddelelser. Feltligningerne for det tomme rum, som jeg byggede forklaringen af Merkurs periheldrejning på, bliver ikke berørt af denne ændring.' },
        { hvor: '1915, s. 845, linje 1-2: Ti ligninger', tysk: 'Die allgemein kovarianten zehn Gleichungen des Gravitationsfeldes in Räumen, in denen »Materie« fehlt, erhalten wir, indem wir ansetzen G_im = 0.', dansk: 'De ti generelt kovariante ligninger (de ser ens ud, uanset hvilke koordinater man bruger) for tyngdefeltet i rum, hvor der ikke er "stof", får vi ved at sætte G_im = 0.' },
        { hvor: '1915, s. 845, linje 9-10: Med stof', tysk: 'Ist in dem betrachteten Raume »Materie« vorhanden, so tritt deren Energietensor auf der rechten Seite von (2) bzw. (3) auf. Wir setzen G_im = −κ(T_im − ½ g_im T).', dansk: 'Er der "stof" i det rum, vi ser på, så kommer dets energitensor ind på højre side af (2) eller (3). Vi sætter G_im = −κ(T_im − ½ g_im T).' },
        { hvor: '1915, s. 847: Endelig færdig', tysk: 'Damit ist endlich die allgemeine Relativitätstheorie als logisches Gebäude abgeschlossen. Das Relativitätspostulat in seiner allgemeinsten Fassung, welches die Raumzeitkoordinaten zu physikalisch bedeutungslosen Parametern macht, führt mit zwingender Notwendigkeit zu einer ganz bestimmten Theorie der Gravitation, welche die Perihelbewegung des Merkur erklärt.', dansk: 'Dermed er den almene relativitetsteori endelig færdig som en logisk bygning. Relativitetspostulatet i sin mest almene form, der gør rumtidens koordinater til tal uden fysisk betydning, fører med tvingende nødvendighed til en helt bestemt teori om tyngdekraften, og den forklarer Merkurs periheldrejning.' },
        { hvor: '1916, s. 822: Lyset bøjes', tysk: 'Ein an der Sonne vorbeigehender Lichtstrahl erfährt demnach eine Biegung von 1,7″, ein am Planeten Jupiter vorbeigehender eine solche von etwa 0,02″.', dansk: 'En lysstråle, der går tæt forbi Solen, bøjes altså 1,7″, og en, der går forbi planeten Jupiter, ca. 0,02″. (″ er et buesekund, en 3.600-del af en grad.)' },
        { hvor: '1916, s. 822: Merkurs bane', tysk: 'Die Rechnung ergibt für den Planeten Merkur eine Drehung der Bahn um 43″ pro Jahrhundert, genau entsprechend der Konstatierung der Astronomen (Leverrier); diese fanden nämlich einen durch Störungen der übrigen Planeten nicht erklärbaren Rest der Perihelbewegung dieses Planeten von der angegebenen Größe.', dansk: 'Regningen giver for planeten Merkur en drejning af banen på 43″ pr. århundrede, præcis som astronomerne (Leverrier) har fastslået. De fandt nemlig en rest af denne planets periheldrejning af netop den størrelse, som de andre planeters træk ikke kan forklare.' },
      ],
    },
    // For nørder (drejebogen afsnit 9, jeres svar 3: 1916 her, faktafilen afsnit 4 og 5)
    nørd: {
      titel: 'For nørder',
      punkter: [
        'I 1916 skrev han den lange udgave på 54 sider (Annalen der Physik, bind 49). Ligningen er nr. (53) på side 808, og på side 807 skriver han, at energien står i den, fordi "die träge Masse nichts anderes ist als Energie" (den træge masse er intet andet end energi). Det er opslaget før.',
        'På side 822 regner han to ting, man kan måle: Lys, der går tæt forbi Solen, bøjes 1,7″ (i dag regnet til 1,75″), og Merkurs bane drejer 43″ pr. århundrede mere, end Newton giver. Han skriver "(Leverrier)", men Le Verrier fandt 38″ i 1859. De 43″ er Newcombs tal fra 1882.',
        'På side 820 skriver han, at ure går langsommere tæt på tunge ting, og at lys fra store stjerner derfor må være rødforskudt. Det blev målt på Jorden i 1959-1960 (Pound og Rebka). Det er urene i GPS\'en fra turen.',
        'Med en lommeregner: Hans formel (75) giver Merkurs 43″ (a = 5,79 · 10¹⁰ m, T = 88,0 døgn, e = 0,206 og 415 omløb pr. århundrede).',
        'I 1916 indførte han også reglen om at droppe summetegnene Σ, når et bogstav står to gange (Einsteins summeregel, side 781). Se, hvor mange Σ der står på side 845.',
        'Matematikeren David Hilbert lagde sit arbejde frem den 20. november 1915. Hvem der var først med hvad, har historikere diskuteret, men de fleste mener, at Einstein fandt ligningen selv, og Hilbert regnede selv teorien for Einsteins.',
      ],
    },
    // Ærligt talt (faktafilen afsnit 4-6, fælderne om feltligningen)
    ærligt: {
      titel: 'Ærligt talt',
      linje: 'Hvad siden ikke siger, og hvad vi har gjort lettere',
      punkter: [
        'Ligningen ser anderledes ud i dag: Einsteins G_im er det, man nu kalder Ricci-tensoren, ½-leddet står på den anden side, og Λ kom til i 1917. Det er den samme ligning skrevet på en anden måde.',
        '"Led for led" er gjort meget lettere: g_im, G_im og T_im er hver ti tal, der hænger sammen, og at regne med dem kræver tensorregning fra universitetet.',
        'Man kan ikke regne Merkur eller lyset ud med ligningen alene. Einstein regnede med tilnærmelser, der passer, når tyngden er svag, og dér bliver ligningen til Newtons lov.',
        'Siden er Googles skanning af et eksemplar fra University of Minnesota (i 1915 hed akademiet "Königlich Preußische Akademie der Wissenschaften"). "Sat tekst" er de samme linjer sat af os.',
      ],
    },
    seSelv: { tekst: 'Se det selv i Rumtid', gaa: 'kosmos:rumtid' },
    // Knappen videre til "Om Einstein" (E5), der svarer på spørgsmålet
    videre: 'Havde han ret?',
  },
};
// Kontakten over siden (jeres tilføjelse 20. november 2026): skanningen eller den samme side sat af os
export const SIDE_VISNING = { skanning: 'Skanning', sat: 'Sat tekst', navn: 'Vis siden som' };

// ---------- Om Einstein (bogens sidste opslag, E5, drejebogen afsnit 10) ----------
// Budgettet: titel, højst to tal, højst tre sætninger, højst fire spørgsmål. Derefter "Vil du vide mere?" og "Ærligt
// talt", lukkede. Kilderne står i docs/fakta-einstein-bog.md (afsnit 3-5) og docs/fakta-videnskabsfolk.md (afsnit 8).
// Hver oplysning står ét sted: Det, der allerede står i de tre ligningers lag (ækvatoruret, beviset for L/V², Λ og
// universitetsmatematikken, mikrofilmen, ordet relativitetsteori, c fra 1907 og lysuret fra 1909), står ikke her igen.
// Ærligt talt har Mileva Marić-linjen og det, turen snyder med (listen øverst i js/bog/einstein.js, drejebogen afsnit 16
// under E2), som ikke allerede står i et opslag.
export const OM = {
  titel: 'Om Einstein',
  navn: 'Albert Einstein (1879-1955)',
  tal: [
    // Født 14. marts 1879, artiklerne kom i juni og september 1905 (faktafilen afsnit 2)
    { tal: '26 år', tekst: 'da han skrev de to første ligninger i 1905' },
    // +45 − 7 = 38 milliontedele sekund pr. døgn (gpsTal, turens trin 4 og Rumtid)
    { tal: '38 milliontedele sekund', tekst: 'så meget går urene i GPS-satellitterne hurtigere end på jorden hvert døgn' },
  ],
  // Delens kernesætning passer kun halvt (drejebogen afsnit 1): Han regnede, og andre målte. Nobelprisen: fakta-videnskabsfolk.md afsnit 8
  sætninger: 'Einstein regnede, og andre målte efter: Urene i fly og satellitter, lyset, der bøjes ved Solen, og Merkurs bane passer alle med hans ligninger. Han fik nobelprisen i fysik, men ikke for relativitetsteorien. Ligningerne bruges hver dag, når din telefon finder vej med GPS.',
  // Gør det selv (drejebogen afsnit 12, tjekket på skærmen i E5): I Rejsen i tid er det "du", der flyver, og "Tvillingen"
  // bliver hjemme (ikke en tvilling, der sendes ud). Knappen hedder "🚀 Flyv til …" (i forløbet "Flyv til TRAPPIST-1")
  knap: {
    tekst: 'Send et ur på rejse', gaa: 'kosmos:tid',
    linje: 'I Rejsen i tid er det dig, der flyver næsten med lysets fart, mens din tvilling bliver hjemme. Tryk på "Flyv", og se, hvor meget yngre du er, når du kommer hjem. Det er Einsteins rundtur fra side 904 med dig som uret.',
  },
  // Et stille link (stilguiden A3): lyset, der bøjes. 4GM/(c²R) = 1,75″ ved Solen (faktafilen afsnit 8) er ca. 0,0005°
  // som i Rumtid. Sort hul i Kosmos bøjer lyset med en shader efter Einsteins teori (js/kosmos/linse.js)
  ekstra: {
    tekst: 'Se lyset bøje om et sort hul', gaa: 'kosmos:sorthul',
    linje: 'Stjernelys, der går tæt forbi Solen, bøjes kun ca. 0,0005 grader, så det kan kun måles. Tæt på et sort hul bøjes det så meget, at hele himlen bag det ser forvrænget ud.',
  },
  hvorfor: [
    {
      // Faktafilen afsnit 3 (1933), 4 og 5 (Merkur 43″, Newcomb, 1919 usikker), hvorfor.js og Rejsen i tid (Hafele og
      // Keating 1971: "næsten som regnet ud"). Pound og Rebka står i tyngdens "For nørder"
      spørgsmål: 'Hvordan ved man, at han havde ret?',
      svar: 'Andre målte efter. I 1933 passede energien, når lithium blev ramt af protoner, med E = mc² inden for en halv procent. Merkurs bane drejer 43 buesekunder (en lillebitte vinkel) pr. århundrede mere, end Newtons lov giver, præcis som Einstein regnede ud. Lyset bøjes ved Solen: Målingerne ved solformørkelsen i 1919 var usikre, men senere målinger har vist det meget præcist.\n\nOg i 1971 fløj man atomure jorden rundt i passagerfly. Da de kom hjem, gik de forkert i forhold til urene på jorden, næsten præcis som ligningerne siger.',
    },
    {
      // fakta-videnskabsfolk.md afsnit 8 (nobelprize.org "The Nobel Prize in Physics 1921")
      spørgsmål: 'Fik han nobelprisen for relativitetsteorien?',
      svar: 'Nej. Han fik prisen for 1921 for sit arbejde i teoretisk fysik og især for loven om den fotoelektriske effekt: Lys kan slå elektroner løs fra et metal, og det forklarede han med, at lys kommer i små portioner. Den artikel skrev han også i 1905.\n\nKomitéen syntes ikke, at nogen af dem, der var foreslået i 1921, var gode nok, så prisen blev gemt og givet året efter, i 1922.',
    },
    {
      // Fælden i fakta-faelder.md (relativistisk masse: "det kræver mere og mere energi og uendelig meget at nå lysets
      // fart") og fakta-faelder-videnskabsfolk.md (at intet kan nå lysets fart, er ikke en af reglerne, men følger af dem).
      // LHC: CERN giver 99,9999991 % af lysets fart ved 7 TeV. Ved 6,8 TeV (fra 2022) er γ ca. 7.250 og farten ca.
      // 99,999999 % (regnet), derfor "over 99,9999 %"
      spørgsmål: 'Kan noget fare hurtigere end lyset?',
      svar: 'Ikke ifølge Einsteins ligninger. Jo tættere noget kommer på lysets fart, jo mere energi skal der til for at komme bare lidt hurtigere, og for at nå helt op skal der uendelig meget. Det var ikke en af hans to regler, men noget, han regnede sig frem til.\n\nI partikelacceleratoren LHC ved CERN farer protonerne med over 99,9999 % af lysets fart. Men aldrig helt op.',
    },
    {
      // Faktafilen afsnit 5 (Poincaré og Hasenöhrl, Besso s. 921), Wikipedia "History of special relativity" (Lorentz 1904)
      // og "Marcel Grossmann" (tensorregningen til tyngden 1912-1913)
      spørgsmål: 'Fandt han på det hele alene?',
      svar: 'Nej. Han byggede på andre: Lorentz og Poincaré havde allerede regnet meget med lys og bevægelse før 1905, han talte med vennen Michele Besso (den eneste, han takker i artiklen om tiden), og hans gamle studiekammerat, matematikeren Marcel Grossmann, hjalp ham med den matematik, han skulle bruge til tyngdekraften.\n\nMen at bygge det hele på de to regler og regne sig frem til, at tiden ikke er den samme for alle, var hans idé.',
    },
  ],
  nørd: {
    titel: 'Vil du vide mere?',
    linje: 'Det store år, myterne og lambda.',
    punkter: [
      // Faktafilen afsnit 1 og drejebogen afsnit 10
      'I 1905 skrev han fire store artikler i Annalen der Physik, mens han arbejdede på patentkontoret: om lys i små portioner, om bittesmå korn, der danser rundt i en væske, fordi molekylerne støder til dem (Brownske bevægelser), om tiden og om energien. Han var 26.',
      // Faktafilen afsnit 5
      '"Alt er relativt" er en misforståelse. Teorien bygger på to ting, der er ens for alle: naturens love og lysets fart.',
      // fakta-videnskabsfolk.md afsnit 8
      '"Einstein dumpede i matematik" er en myte. Som 16-årig, et år før man plejede, dumpede han den almene del af optagelsesprøven til den tekniske højskole i Zürich, men i fysik og matematik klarede han sig med udmærkelse.',
      // Faktafilen afsnit 5 (Gamow, men Alpher og Wheeler sagde også, at de havde hørt det: derfor "kun fra andre, især
      // Gamow") og Wikipedia "Cosmological constant" / "Static universe" (1917 for et univers, der står stille; droppet
      // efter Hubbles målinger, 1931; mørk energi 1998)
      'I 1917 satte han et ekstra led, Λ (lambda), ind i ligningen, så universet kunne stå stille. Da man fandt ud af, at universet udvider sig, droppede han det igen. At han kaldte det "min største brøler", kender vi kun fra andre, især fysikeren George Gamow. Det står ikke i hans egne tekster. I dag er Λ med igen, fordi universet udvider sig hurtigere og hurtigere.',
      // Faktafilen afsnit 5 (Hilbert) og afsnit 4 (25. november 1915)
      'Han lagde feltligningen frem for akademiet i Berlin den 25. november 1915, ti år efter artiklen om tiden.',
    ],
  },
  ærligt: {
    titel: 'Ærligt talt',
    linje: 'Det, han ikke gjorde selv, og det, turen snyder med.',
    punkter: [
      // Drejebogen afsnit 1: delens kernesætning ("De så efter og målte") passer kun halvt
      'Einstein målte ikke selv. Han regnede ud fra to regler og sagde, hvad andre skulle måle. Målingerne kom bagefter, nogle først mange år senere.',
      // Faktafilen afsnit 5 (Joffe 1955, Stachel, Esterson og Cassidy 2019) og fælden "Mileva Marić, fysikeren"
      'Nogle har ment, at hans første kone, Mileva Marić, der læste fysik og matematik sammen med ham i Zürich, var med til at skrive artiklerne fra 1905. De er kun underskrevet af ham, og der findes ingen tekster om fysik fra hendes hånd. Derfor mener de fleste historikere det ikke, men nogle mener, at hun var en, han kunne tale fysik med.',
      // Fælden "Man bliver tungere ved høj fart" (fakta-faelder.md)
      'Artiklen fra 1905 regner med en masse, der vokser med farten. Det gør man ikke mere: Man bliver ikke tungere af at flyve hurtigt, men det kræver mere og mere energi at komme op i fart.',
      // Listen øverst i js/bog/einstein.js (E2). 299.792 km/s · 3,6 / 100 km/t = 10,8 millioner
      'I turen farer lyset alt for langsomt. I virkeligheden er det ca. 10 millioner gange hurtigere end et tog på 100 km/t, så toget ville se ud til at stå helt stille.',
      // 0,99 · 299.792 km/s · 20 s = 5,9 millioner km
      'Under rundturen viser urene tiden, som man regner den på perronen, ikke det, øjet ville se. Kun ved afgang og hjemkomst, når urene står side om side, er alle enige. Banen er heller ikke i rigtig størrelse: Ved 99 % af lysets fart ville turen på 20 sekunder være næsten 6 millioner km lang.',
      'Satellitten, Jorden og højden er ikke i rigtig størrelse, og Jordens drejning er ikke regnet med i GPS-uret.',
      // E1: lav_portraet.py med samme filter som de andre
      'Portrættet er et foto fra 1921. Vi har lagt det samme filter over som de andre, så alle personerne i bogreolen ligner hinanden. Tegningerne, fortælleren og oversættelserne fra tysk er vores egne.',
    ],
  },
};
