// Teksterne i bogen om Huygens og Saturns ører (docs/drejebog-huygens.md, rettet efter Fable 16. november 2026).
// Kilderne står i docs/fakta-videnskabsfolk/huygens.md. Uden DOM, så testene i Node kan læse dem.
//
// opslag er bogens opslag i rækkefølge. slags 'forside' har sin egen opbygning i js/bog.js. slags 'scene' er et kapitel
// med en tegning, man gør noget i (js/bog/huygens.js). Kun de opslag, der er bygget, står her (E20 fund 6, stilguiden A9):
// Det sidste opslag er "Om Huygens" (H4).

export const FORSIDE = {
  spørgsmål: 'Hvorfor havde Saturn ører?',
  galilei: 'Sådan tegnede Galilei Saturn i 1610.',
  navn: 'Christiaan Huygens',
  liv: '1629-1695',
  portrætTekst: 'Malet af Caspar Netscher i 1671. Huygens var ca. 42.',
  portrætAlt: 'Christiaan Huygens med langt, krøllet hår, tegnet som et gammelt kobberstik efter et maleri fra 1671.',
  begynd: 'Begynd',
};

export const OPSLAG = [
  { id: 'forside', slags: 'forside' },
  // Fortællingen (H2): forløbet "Saturns ører" kører i dette opslag med tegningerne fra js/bog/huygens.js. Bagefter er
  // opslaget et lille laboratorium: ringen, man selv kan dreje, og "Fortæl det igen" (jeres svar 16. november 2026).
  { id: 'fortaelling', slags: 'scene', titel: 'Saturns ører' },
  // Gåden fra bogen (H3): hele anagrammet som udfordring og "Lav dit eget anagram" (js/bog/huygens-gaade.js)
  { id: 'gaaden', slags: 'scene', titel: 'Hemmeligheden' },
  // Bogen selv (H4): de fire sider fra 1659 med de glødende steder (BOGEN nedenfor, js/bog.js)
  { id: 'bogen', slags: 'sider', titel: 'Bogen fra 1659' },
  // Bogens sidste opslag (H4): navnet, to tal, tre sætninger, fire "Hvorfor?" og de lukkede lag (OM nedenfor)
  { id: 'om', slags: 'om', titel: 'Om Huygens' },
];

// Vejene fra "Det så du" efter fortællingen (drejebogen afsnit 3, trin 5, og afsnit 5). sætning står foran den danske
// sætning fra 1659 under kernesætningen.
export const VEJE = {
  sætning: 'I 1659 afslørede han, hvad der stod:',
  saturn: 'Se ringen forsvinde ved Saturn',
  anagram: 'Løs hele anagrammet',
  bog: 'Bladr i bogen fra 1659',
};

// Opslaget "Hemmeligheden" (drejebogen afsnit 4): udfordringen med de otte brikker og "Lav dit eget anagram"
export const GÅDE = {
  linje: 'Huygens\' hele hemmelighed: Læg de latinske ord på deres danske betydning. For hvert ord tæller bunkerne ned.',
  tilbage: 'bogstaver tilbage',
  løst: 'Alle 62 er brugt. Det passer.',
  løstFør: 'du har løst den før ✓',
  igen: 'Prøv igen',
  eget: 'Lav dit eget anagram',
  egetLinje: 'Skriv en hemmelighed. Så sorteres bogstaverne, som Huygens gjorde.',
  egetFelt: 'Din hemmelighed',
  egetTom: 'Her kommer dine bogstaver.',
  egetIntet: 'Intet bliver gemt.',
  tilbageTilGåden: 'Tilbage til Huygens\' gåde',
};

// Fortællingens laboratorium (opslaget, når forløbet er taget eller sprunget over): de tre kapitler som tre valg
// (E20, stilguiden B7). Ringen er standard.
export const FRI = {
  linje: 'Træk op og ned, og se Saturn fra andre vinkler.',
  igen: 'Fortæl det igen',
  kapitler: [
    { id: 'linse', tekst: 'Linsen', linje: 'Gnid på glasset, og se kuglerne blive til arme.' },
    { id: 'naetter', tekst: 'Den lille prik', linje: 'Træk nætterne frem, og følg prikken rundt om Saturn.' },
    { id: 'ringen', tekst: 'Ringen', linje: 'Træk op og ned, og se Saturn fra andre vinkler.' },
  ],
};

// Anagrammet (drejebogen afsnit 3-4, faktagrundlaget afsnit 3): rækken, som den er trykt i 1656 og på s. 47 i Systema
// Saturnium (17 bunker, 62 bogstaver), og sætningen, Huygens afslørede i 1659. Ordene står med deres danske betydning
// (brikkerne i udfordringen). "cohaerente" med ae (bogen skriver æ). dansk er oversættelsen fra citatet huygensSaturn
// (js/data/citater.js), så den står ens begge steder. Testen i Node tjekker, at bogstaverne passer præcist.
export const ANAGRAM = {
  række: 'aaaaaaa ccccc d eeeee g h iiiiiii llll mm nnnnnnnnn oooo pp q rr s ttttt uuuuu',
  sætning: 'Annulo cingitur, tenui, plano, nusquam cohaerente, ad eclipticam inclinato.',
  dansk: 'Den er omgivet af en tynd, flad ring, der ingen steder hænger fast i den og hælder i forhold til Jordens baneplan.',
  // Ordet, man finder i forløbets trin 4 (det første ord i sætningen)
  nøgle: 'Annulo',
  ord: [
    { latin: 'Annulo', dansk: 'med en ring' },
    { latin: 'cingitur', dansk: 'er omgivet' },
    { latin: 'tenui', dansk: 'tynd' },
    { latin: 'plano', dansk: 'flad' },
    { latin: 'nusquam', dansk: 'ingen steder' },
    { latin: 'cohaerente', dansk: 'hængende fast' },
    { latin: 'ad eclipticam', dansk: 'mod Jordens baneplan' },
    { latin: 'inclinato', dansk: 'hældende' },
  ],
};

// De 17 bunker: [bogstav, antal] i rækkens orden
export const bunker = (række = ANAGRAM.række) => række.split(' ').map((b) => [b[0], b.length]);
// Bogstaverne i et ord eller en sætning (kun a-z, små), fx til at tælle bunkerne ned
export const bogstaver = (tekst) => [...tekst.toLowerCase().replace(/æ/g, 'ae').replace(/[^a-z]/g, '')];


// Opslaget "Bogen fra 1659" (H4, drejebogen afsnit 6): de fire sider fra Smithsonians skanning (billeder/biblioteket/
// KILDER.md, lavet med lav_bogsider.py) og højst seks glødende steder. felter er stedets firkanter i % af billedet
// [venstre, top, bredde, højde] (målt på billederne fra lav_bogsider.py, som ikke klipper siden). Latinen står som i
// bogen, men med s for det lange s (ſ). Oversættelsen er vores egen (faktatjekket 17. november 2026 mod skanningen og
// Oeuvres complètes XV, se docs/fakta-videnskabsfolk/huygens.md).
export const BOGEN = {
  titel: 'Bogen fra 1659',
  linje: 'Systema Saturnium, trykt i Haag i 1659. Tryk på et sted, der lyser.',
  vælg: 'Tryk på et sted, der lyser. Så kommer latinen og vores oversættelse.',
  stedLatin: 'Latin',
  stedDansk: 'På dansk',
  sider: [
    {
      id: 'tavle', fane: 'Tavlen', fil: 'billeder/biblioteket/huygens-tavle.webp', b: 1000, h: 1069,
      alt: 'En sort tavle med 13 hvide tegninger af Saturn, nummereret I til XIII: kugler, ører og ringe.',
      om: 'Tavlen ved s. 35: 13 tegninger af Saturn fra andre astronomer, samlet af Huygens.',
      steder: [{
        id: 'nr1', navn: 'Nr. I', felter: [[11, 9.5, 25, 12]],
        latin: 'credibile est omnium emendatissimè nativam Saturni faciem nobis descripsisse (s. 37, om nr. X)',
        dansk: 'Nr. I er Galileis tre kugler fra 1610. Om nr. X (Divini, 1646-1648) skrev Huygens: Det er troligt, at han har tegnet Saturns rigtige udseende mest nøjagtigt af alle. Kun skyggerne havde han nok selv lagt til.',
      }],
    },
    {
      id: 's16', fane: 's. 16', fil: 'billeder/biblioteket/huygens-s16.webp', b: 1000, h: 1411,
      alt: 'Side 16 med latinsk tekst og en tegning af Saturn som en rund kugle med en mørk stribe, uden arme.',
      om: 's. 16: Saturn uden arme i januar 1656.',
      steder: [{
        id: 'jan16', navn: '16. januar 1656', felter: [[18, 12.6, 29, 2.8], [70.7, 15.3, 25.2, 2.6], [18, 17.9, 36.3, 2.6]],
        latin: 'Anno 1656. Jan. 16, hora 12 … Inveni autem brachiis suis spoliatum penitus',
        dansk: 'Den 16. januar 1656 kl. 12 så han Saturn igen efter en rejse. Han fandt den helt uden sine arme. Tegningen viser, hvad han så.',
      }],
    },
    {
      id: 's47', fane: 's. 47', fil: 'billeder/biblioteket/huygens-s47.webp', b: 1000, h: 1414,
      alt: 'Side 47 med latinsk tekst, en lang række sorterede bogstaver og en tegning af Saturn med en flad ring.',
      om: 's. 47: Her afslører Huygens anagrammet fra 1656.',
      steder: [
        {
          id: 'dato', navn: '25. marts 1656', felter: [[52, 15, 31.8, 2.6], [5.5, 17.6, 3.5, 2.2]],
          latin: 'quam anno 1656 die 25 Martij permixtis literis … edidimus',
          dansk: 'som vi udgav med blandede bogstaver den 25. marts 1656. Her husker han forkert: Skriftet med anagrammet er dateret 5. marts 1656 (s. 2).',
        },
        {
          id: 'raekken', navn: 'Bogstavrækken', felter: [[39.5, 22.6, 44.5, 2.5], [5.5, 25.4, 78.5, 2.4], [5.5, 27.8, 13.5, 2.6]],
          latin: 'Erant enim Literæ aaaaaaa ccccc d eeeee g h iiiiiii llll mm nnnnnnnnn oooo pp q rr s ttttt uuuuu',
          dansk: 'Bogstaverne var nemlig … Det er de 62 bogstaver fra 1656. Tæl selv a\'erne: Der er 7.',
        },
        {
          id: 'saetningen', navn: 'Sætningen i kursiv', felter: [[73.5, 27.8, 10.5, 2.6], [5.5, 30.3, 79, 2.9], [5.5, 33.1, 10, 2.1]],
          latin: 'Annulo cingitur, tenui, plano, nusquam cohærente, ad eclipticam inclinato.',
          dansk: 'Den er omgivet af en tynd, flad ring, der ingen steder hænger fast, og som hælder mod ekliptika (det plan, Jorden går rundt om Solen i). Det er løsningen på anagrammet.',
        },
      ],
    },
    {
      id: 's48', fane: 's. 48', fil: 'billeder/biblioteket/huygens-s48.webp', b: 1000, h: 1411,
      alt: 'Side 48 med tæt latinsk tekst.',
      om: 's. 48: Huygens svarer dem, der ikke tror på ringen.',
      steder: [{
        id: 'fast', navn: 'Fast og varig', felter: [[35.5, 10.4, 34.8, 2.3], [43.5, 28.4, 28.5, 2.6]],
        latin: 'annulum hunc solidum ac permanentem (talem enim arbitror) … sed oculorum sensu … hunc quoque annulum satis evidenter me percipere',
        dansk: 'denne ring, massiv og varig (for det tror jeg, den er) … Jeg ser også denne ring ret tydeligt med øjnene. Her tog han fejl: Ringen er ikke ét fast stykke, men utallige små stykker, mest is. Men han så den selv og fandt den ikke bare på.',
      }],
    },
  ],
  // Linje for linje (drejebogen afsnit 6): Latin har en anden ordstilling end dansk, så oversættelsen står pr.
  // sætning ved de linjer, den hører til. Vises under s. 47 og s. 48.
  linjer: {
    titel: 'Linje for linje',
    linje: 'Hele teksten på latin og dansk, sætning for sætning.',
    note: 'Oversættelsen fra latin er vores egen. Det lange s (ſ) er skrevet som s.',
    rækker: [
      { side: 's47', linjer: 's. 46, sidste linje, og linje 1-2', latin: 'Quibus proinde sic ordinatis, ac præterea adsumta ea quam dixi annuli inclinatione, omnes mirabiles Saturni facies sicut mox demonstrabitur, eo referri posse inveni.', dansk: 'Da det var ordnet sådan, og når jeg også regnede med den hældning af ringen, som jeg nævnte, fandt jeg, at alle Saturns forunderlige skikkelser kan føres tilbage til dette, som det snart skal vises.' },
      { side: 's47', linjer: 'Linje 3-5', latin: 'Et hæc ea ipsa hypothesis est quam anno 1656 die 25 Martij permixtis literis una cum observatione Saturniæ Lunæ edidimus.', dansk: 'Og det er netop den hypotese, som vi udgav med blandede bogstaver den 25. marts 1656 sammen med iagttagelsen af Saturns måne. (Her husker han forkert: Det var 5. marts.)' },
      { side: 's47', linjer: 'Linje 6-10', latin: 'Erant enim Literæ aaaaaaacccccdeeeeegh iiiiiiillllmmnnnnnnnnnooooppqrrsttttt uuuuu; quæ suis locis repositæ hoc significant, Annulo cingitur, tenui, plano, nusquam cohærente, ad eclipticam inclinato.', dansk: 'Bogstaverne var nemlig aaaaaaa ccccc …, og sat tilbage på deres pladser betyder de: Den er omgivet af en tynd, flad ring, der ingen steder hænger fast, og som hælder mod ekliptika. (Ordret: "Med en ring omgives den, tynd, flad, ingen steder hængende fast, mod ekliptika hældende." Ekliptika er det plan, Jorden går rundt om Solen i.)' },
      { side: 's47', linjer: 'Linje 10-13', latin: 'Latitudinem vero spatij inter annulum globumque Saturni interjecti, æquare ipsius annuli latitudinem vel excedere etiam, figura Saturni ab aliis observata, certiusque deinde quæ mihi ipsi conspecta fuit, edocuit:', dansk: 'At mellemrummet mellem ringen og Saturns kugle er lige så bredt som selve ringen eller endnu bredere, lærte jeg af Saturns skikkelse, som andre havde set, og siden mere sikkert af den, jeg selv så:' },
      { side: 's47', linjer: 'Linje 13-15', latin: 'maximamque item annuli diametrum eam circiter rationem habere ad diametrum Saturni quæ est 9 ad 4.', dansk: 'og også, at ringens største diameter forholder sig til Saturns omtrent som 9 til 4 (godt dobbelt så bred).' },
      { side: 's47', linjer: 'Linje 15-17', latin: 'Ut vera proinde forma sit ejusmodi qualem apposito schemate adumbravimus.', dansk: 'Den sande form er altså sådan, som vi har tegnet den på figuren her.' },
      { side: 's47', linjer: 'I margenen', latin: 'Occurritur iis quæ de annulo objici possent.', dansk: 'Svar på det, man kunne indvende mod ringen.' },
      { side: 's47', linjer: 'Linje 18-23', latin: 'Cæterum obiter hic iis respondendum censeo, quibus novum nimis ac fortasse absonum videbitur, quod non tantum alicui cælestium corporum figuram ejusmodi tribuam, cui similis in nullo hactenus eorum deprehensa est, cum contra pro certo creditum fuerit, ac veluti naturali ratione constitutum, solam iis sphæricam convenire, sed & quod', dansk: 'I øvrigt må jeg her i forbifarten svare dem, der vil synes, at det er for nyt og måske urimeligt, at jeg ikke alene giver et himmellegeme en form, som man indtil nu ikke har fundet hos nogen af dem (for man har tværtimod troet for sikkert, som om naturen selv havde bestemt det, at kun kugleformen passer til dem), men også at jeg lægger …' },
      { side: 's48', linjer: 'Linje 1-5', latin: 'annulum hunc solidum ac permanentem (talem enim arbitror) Saturno ita circumponam, ut nullis compagibus retinaculisve ei cohæreat, ac nihilominus æqualem ab omni parte distantiam servet, unàque cum Saturno motu velocissimo transferatur.', dansk: '… denne ring, massiv og varig (for det tror jeg, den er), sådan om Saturn, at den ikke hænger fast i den med nogen samlinger eller bånd, men alligevel holder samme afstand hele vejen rundt og føres af sted sammen med Saturn i meget hurtig fart.' },
      { side: 's48', linjer: 'Linje 5-10', latin: 'Hos autem reputare illud oportet, non ex mera inventione atque arbitrio meo hanc me fingere hypothesin, sicut Astronomi suos epicyclos, nusquam in cælo apparentes; sed oculorum sensu, quo nempe reliquarum rerum omnium figuras dignoscimus, hunc quoque annulum satis evidenter me percipere.', dansk: 'Men de bør tænke på, at jeg ikke bare har fundet på denne hypotese efter mit eget hoved, sådan som astronomerne har fundet på deres epicykler, der ingen steder ses på himlen. Jeg ser også denne ring ret tydeligt med øjnene, som vi jo kender formen på alle andre ting med. (Epicykler: små cirkler, som astronomerne lagde oven i planeternes baner, så regnestykket passede med det, de så.)' },
    ],
  },
};

// Bogens sidste opslag "Om Huygens" (H4, drejebogen afsnit 7). Budgettet: titel, højst to tal, højst tre sætninger,
// højst fire spørgsmål. Derefter "Vil du vide mere?" og "Ærligt talt", lukkede (foldebokse fra js/lag.js). Kilderne står i
// docs/fakta-videnskabsfolk/huygens.md (OC XV = Oeuvres complètes, bind 15, slået op 17. november 2026).
export const OM = {
  titel: 'Om Huygens',
  navn: 'Christiaan Huygens (1629-1695)',
  tal: [
    { tal: '25 år', tekst: 'da han fandt Saturns måne Titan' },
    { tal: '62 bogstaver', tekst: 'i hans anagram' },
  ],
  sætninger: 'Huygens og hans storebror sleb deres egne linser. Med en bedre kikkert fandt han ud af, at Saturns "ører" er en tynd, flad ring. Han gemte svaret i et anagram i 1656, og i 1659 stod løsningen i hans bog.',
  hvorfor: [
    {
      spørgsmål: 'Hvorfor så Galilei tre kugler?',
      svar: 'Hans kikkert forstørrede højst ca. 30 gange (Huygens\' tal). Huygens\' forklaring var, at armene er tykkest og klarest ude i spidserne. Så forsvinder resten, og spidserne ligner kugler. Han så selv to kugler, når han brugte en kort kikkert.',
    },
    {
      spørgsmål: 'Hvorfor et anagram?',
      svar: 'For at vise, at han kendte svaret, uden at røbe det. Så kunne andre nå at melde sig, uden at nogen kunne sige, at den ene havde taget det fra den anden. Han kaldte det en bogstavgåde. Galilei havde gjort det samme med Saturn i 1610.',
    },
    {
      spørgsmål: 'Hvorfor lige en ring?',
      svar: 'Månen går rundt om Saturn på 16 dage. Derfor regnede Huygens med, at Saturn selv snurrer meget hurtigere. Men armene så ens ud nat efter nat. Så måtte der være det samme hele vejen rundt: en ring.',
    },
    {
      spørgsmål: 'Hvordan ved vi, at ringen ikke er fast?',
      svar: 'Huygens troede, den var ét fast stykke. I 1859 viste Maxwell, at en fast ring ville gå i stykker. Den må bestå af utallige små stykker, der hver går i sin egen bane. I 1895 målte Keeler, at de inderste dele går hurtigere end de yderste.',
    },
  ],
  nørd: {
    titel: 'Vil du vide mere?',
    linje: 'Kikkerten, Titan, ringens mål og lysets fart.',
    punkter: [
      'Kikkerten var 12 fod (over 3 m) med to linser og forstørrede ca. 50 gange efter hans egne tal (andre siger ca. 43). Senere byggede han kikkerter på 23 fod, der forstørrede næsten 100 gange. Galileis forstørrede højst ca. 30 gange (Huygens\' tal).',
      'Titan går rundt om Saturn på ca. 16 døgn (Huygens), 15,95 døgn (i dag). ESA\'s sonde Huygens landede på Titan 14. januar 2005.',
      'Ringen mod Saturn: 9 mod 4 (Huygens), 2,27 gange (yderkanten af A-ringen i dag). Hældningen: over 20° (han målte armenes linje mod ekliptika). Senere satte han ringen parallelt med Jordens ækvator, altså 23½°. I dag: ca. 28° mod ekliptika og 27° mod Saturns egen bane.',
      'Han regnede med, at himmelstoffet om Saturn drejede med (en idé fra hans tid, som er forkert). Men Saturn drejer faktisk rundt på under 11 timer.',
      'Ringen står på kant set fra Jorden hver 13-15 år, senest 23. marts 2025 og næste gang i oktober 2038.',
      'Lysets fart: Ud fra Rømers tal regnede Huygens den til ca. 214.000 km i sekundet (i dag 299.792). Rømer selv gav aldrig farten i km/s.',
    ],
  },
  ærligt: {
    titel: 'Ærligt talt',
    linje: 'Det, vi har gjort enklere eller selv har fundet på.',
    punkter: [
      'I bogen vender man Saturn med et træk. I virkeligheden tager det år: Ringen peger hele tiden samme vej i rummet, og Saturn bruger 29½ år om Solen. To gange på den tur ser vi ringen fra kanten.',
      'Billederne i fortællingen er vores egne tegninger efter tegningerne i bogen. En rigtig kikkert fra 1655 gav et lille, rystende og farvet billede.',
      'Galileis kugler kom nok af et uskarpt billede, hvor ringens ender flød ud til klatter. Ringen stod desuden mere åben i 1610 end i 1655 (vores udregning, usikker), så forskellen i fortællingens første kapitel er ikke kun linsen.',
      'Huygens ventede, at armene kom igen sidst i april 1656. Han så dem først igen 13. oktober (s. 17).',
      'Fortælleren er vores. Det, Huygens selv skrev, står i "Bogen fra 1659", og oversættelsen fra latin er vores egen.',
      'Huygens kaldte den bare "Saturns måne". Navnet Titan fik den først i 1847 (af John Herschel).',
      'Portrættet er et maleri i farver. Vi har lavet det om til et kobberstik, så alle personerne i bogreolen ligner hinanden.',
    ],
  },
};
