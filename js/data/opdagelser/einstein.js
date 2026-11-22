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
  // Ligningerne på Einsteins egne sider (E3, drejebogen afsnit 6 og 7): et opslag af slags 'ligning' (js/bog-ligning.js),
  // teksterne i LIGNINGER nedenfor. Energien (s. 641) og tyngden (s. 845) kommer i E4
  { id: 'tiden', slags: 'ligning', titel: '1905: Tiden', ligning: 'tiden' },
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
      idag: 'I dag skriver man c for lysets fart: τ = t√(1 − v²/c²).',
      led: [
        { id: 't', navn: 't', linje: 'Tiden på urene, der står stille (perronen, Jorden).' },
        { id: 'tau', navn: 'τ', linje: 'Tiden på uret, der farer af sted. τ er det græske t og hedder "tau".' },
        { id: 'v', navn: 'v', linje: 'Urets fart.' },
        { id: 'V', navn: 'V', linje: 'Lysets fart. Einstein skrev V.', idag: 'I dag skriver man c.' },
        { id: 'brok', navn: 'v/V', linje: 'Hvor stor en del af lysets fart uret har: 0,5 er halvdelen.' },
        { id: 'kvadrat', navn: '(v/V)²', linje: 'Det tal ganget med sig selv: 0,5 · 0,5 = 0,25.' },
        { id: 'enminus', navn: '1 − (v/V)²', linje: 'Altid mindre end 1, når uret bevæger sig.' },
        { id: 'rod', navn: '√', linje: 'Kvadratroden. Den er også mindre end 1, så τ bliver mindre end t: Uret viser mindre tid.' },
      ],
      // Efter det sidste led: uret fra turen regnet med ligningen (0,87² = 0,7569, 1 − 0,7569 = 0,2431, √0,2431 = 0,493, og
      // 20 · 0,493 = 9,86 s), og man kan selv vælge en af turens farter (det ekstra lag, jeres ønske 21. november 2026).
      // Tallene laves af ledForLedEksempel(), så de passer
      eksempel: 'Med {fart} af lysets fart:',
      vælgFart: 'Sæt en anden fart ind:',
    },
    // "Regn selv" (gåden, drejebogen afsnit 7): ½(v/V)² ved 1 % af lysets fart i et døgn (86.400 s) giver 4,32 s
    regn: {
      titel: 'Regn selv: Hvor meget bagud?',
      intro: 'Et ur flyver med 1 % af lysets fart (ca. 10,8 millioner km/t) i et døgn. Hvor meget kommer det bagud? Brug Einsteins lette udgave fra siden: ½(v/V)².',
      β: 0.01,
      trin: [
        { tekst: 'v/V er 0,01. Gang det med sig selv.', knap: '× sig selv' },
        { tekst: 'Tag halvdelen.', knap: '½ ·' },
        { tekst: 'Et døgn har 86.400 sekunder. Hvor meget er uret bagud efter et døgn?' },
      ],
      valg: [{ tekst: '0,4 sekund', for: 'lidt' }, { tekst: '4,3 sekunder', rigtig: true }, { tekst: '43 sekunder', for: 'meget' }],
      vink: { lidt: 'For lidt.', meget: 'For meget.', fælles: 'Gang 0,00005 med 86.400. Det er det samme som 86.400 delt med 20.000.' },
      igen: 'Regn igen',
      // Tallene i nørd-tabellen og svaret regnes i bagudLet/bagudRigtig (testet i Node)
      nørd: {
        titel: 'For nørder: Passer den lette udgave altid?',
        tekst: 'Nej. Ved 87 % giver den lette udgave 0,38, men den rigtige formel giver 0,51 sekund bagud pr. sekund, altså at uret går halvt så hurtigt. Den lette udgave passer kun ved små farter. Det skriver Einstein selv: "bis auf Größen vierter und höherer Ordnung" (når man ser bort fra størrelser af fjerde og højere orden).',
        farter: [0.01, 0.1, 0.5, 0.87],
        kolonner: ['Fart', 'Let: ½(v/V)²', 'Rigtig: 1 − √(1 − (v/V)²)'],
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
};
// Kontakten over siden (jeres tilføjelse 20. november 2026): skanningen eller den samme side sat af os
export const SIDE_VISNING = { skanning: 'Skanning', sat: 'Sat tekst', navn: 'Vis siden som' };

// "Regn selv" og nørd-tabellen: hvor meget et ur med farten β (en del af lysets fart) kommer bagud pr. sekund.
// bagudLet er Einsteins lette udgave ½β², bagudRigtig er 1 − √(1 − β²) regnet uden at miste cifrene ved små farter
// (β²/(1 + √(1 − β²)) er det samme tal, fælden med kommatal i faktafilen afsnit 8)
export const bagudLet = (β) => (β * β) / 2;
export const bagudRigtig = (β) => (β * β) / (1 + Math.sqrt(1 - β * β));
export const bagudPrDøgn = (β, let_ = true) => (let_ ? bagudLet(β) : bagudRigtig(β)) * DØGN;
// Led for led: tallene for uret fra turen (87 %, 20 sekunder hjemme)
export function ledForLedEksempel(β = 0.87, t = HJEMME) {
  const k = β * β, rest = 1 - k, rod = Math.sqrt(rest);
  const b = dansk(β, Math.round(β * 100) % 10 ? 2 : 1); // 0,1 og 0,87
  return `${b} · ${b} = ${dansk(k, 2)}. 1 − ${dansk(k, 2)} = ${dansk(rest, 2)}, og √${dansk(rest, 2)} = ${dansk(rod, 2)}. Når uret hjemme viser ${t} sekunder, viser det ${dansk(t * rod, 1)}.`;
}
