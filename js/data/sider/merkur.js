// Teksterne i højre panel ved Merkur (siden i lag, U3 i docs/plan-ux.md). MP1 i docs/drejebog-merkur-pluto.md: den
// korte tekst, "Vil du vide mere?", billederne og "Ærligt talt". MP2: kernesætning A (sol og skygge med isen til sidst), de
// fire spørgsmål, stederne (SIDER: Caloris, de lyse huller, isen ved Nordpolen, Solen, der vender om, og to navne på
// kloden) og flybyen (TUR). Tallene er fra docs/fakta-solsystemet/del8-merkur-og-pluto.md (NSSDC, NASA, USGS' navneliste
// og JPL Horizons) med Opus' rettelser i docs/fable/E16-merkur-pluto-noter.md. Faktatjekket MP2 står i del 8, afsnit 11.
// Uden Three.js.

import { kontakt, tid, sted } from '../../sideknap.js';

const BJERGE = kontakt('Bjergene 10 gange højere');
const IS = kontakt('Isen (set med radar)');
const HURTIG = tid('hurtig', '⏩ Hurtigere');
const SPIL = tid('spil', '▶');
// MESSENGERs foto af hullerne i Raditladi (PIA15366, billeder/solsystem/merkur-huller-foto.jpg)
const FOTO_HULLER = {
  src: 'billeder/solsystem/merkur-huller-foto.jpg',
  alt: 'MESSENGERs foto af bunden af Raditladi: mørk, glat jord med store pletter af lyse, flade huller',
  tekst: 'MESSENGERs foto af de lyse huller på bunden af Raditladi, taget 2. januar 2012. Billedet er ca. 73 km fra hjørne til hjørne (NASA/JHUAPL/Carnegie Institution of Washington).',
};
// Lyset ved et sted (merkur.js: timevinkel)
const LYSET = '<p><b>Lyset:</b> Datoen er spolet frem eller tilbage, så Solen står fra samme side som på MESSENGERs fotos her. Ellers ville skyggerne i kortet gå den forkerte vej. Tryk ' + SPIL + ', så går Solen videre over himlen.</p>';
const SKYGGER = '<p><b>Kortet</b> er sat sammen af mange fotos taget med Solen lavt på himlen. De små skygger i kortet er en del af fotoene og følger ikke Solen i programmet.</p>';

export const SIDE = {
  // Kernesætning A (jeres svar 16. november 2026): "Merkur har næsten ingen luft. Derfor er der over 400 grader i solen
  // og iskoldt i skyggen, og i kraterne ved polerne ligger der is, selv om Merkur er planeten nærmest Solen."
  kort: 'Merkur er den mindste planet og den nærmeste ved Solen. Den har næsten ingen luft. Derfor er der over 400 °C i solen og iskoldt i skyggen, og i kraterne ved polerne ligger der is. Her ser du hele Merkur, sådan som rumsonden MESSENGER fotograferede den fra 2011 til 2015.',
  emner: [
    {
      // NSSDC: 590-725 K på solsiden, NASA: op til 430 °C og ned til −180 °C. Aksen 0,034° (NSSDC)
      titel: 'Over 400 grader og is?', hvorfor: ['venusMerkur'],
      tekst: '<p>Der er ingen luft, der kan holde på varmen eller flytte den rundt. I solen bliver jorden over 400 °C varm, og om natten falder den til ca. −180 °C. Himlen er sort, også om dagen.</p>'
        + '<p>Gæt: Hvor på planeten nærmest Solen ville du lede efter is?</p>'
        + '<p>Merkurs akse står næsten helt lodret. Den hælder kun 0,034°, så ved polerne står Solen altid helt nede ved horisonten. Bunden af de dybe kratere dér får aldrig sol. ' + sted('is', 'Is ved Nordpolen') + '</p>',
    },
    {
      // NSSDC: stjernedøgnet 58,65 døgn, soldøgnet 175,94 døgn, året 87,97 døgn. 3:2 (Wikipedia: holdt fast af Solens
      // tidevandskraft på Merkurs aflange bane)
      titel: 'En dag, der varer to år?',
      tekst: '<p>Merkur er 88 jorddøgn om at komme én gang rundt om Solen. Den drejer én gang om sig selv på 59 jorddøgn, set mod stjernerne. Men den går jo samtidig rundt om Solen, så fra én solopgang til den næste går der 176 jorddøgn. Det er præcis to år på Merkur: Den drejer tre gange om sig selv, mens den går to gange rundt. Solens tidevandskraft holder den fast i den takt.</p>'
        + '<p>Tryk ' + HURTIG + ', og se dagsiden glide hen over kloden. Nogle steder sker der noget mærkeligt, når Solen står op: ' + sted('solen', 'Solen vender om') + '</p>',
    },
    {
      // Radar 1991 (Goldstone og VLA, Arecibo 1992), MESSENGERs neutronmåler (Lawrence m.fl., NASA 29. november 2012),
      // fotos af bunden i lyset fra kratervæggene (NASA PIA19411, 2015: Prokofiev og Fuller). Det mørke lag (Paige m.fl.
      // og Neumann m.fl. 2012-2013)
      titel: 'Hvordan ved vi, at det er is?',
      tekst: '<p>I 1991 sendte forskere radarbølger fra Jorden mod Merkur. Fra bunden af nogle kratere ved polerne kom et stærkt ekko tilbage, sådan som is kaster radar tilbage. Prøv ' + IS + '.</p>'
        + '<p>Rumsonden MESSENGER målte i 2012 brint, som er en del af vand, over de samme steder. Den målte også, at de ligger dér, hvor Solen aldrig skinner. Til sidst fotograferede den bunden af nogle af kraterne i det svage lys fra kratervæggene.</p>'
        + '<p>I de fleste kratere ligger isen nok under et tyndt, mørkt lag. I Prokofiev ligger den måske fri.</p>',
    },
    {
      // Kernen 83-85 % af radius (NASA 85 %), radius 1-7 km mindre, klinter op til ca. 1.000 km lange og 3 km høje
      // (Wikipedia, del 8 afsnit 3)
      titel: 'Hvad er der inden i Merkur?',
      tekst: '<p>En kæmpe kerne af jern. Den når over fire femtedele af vejen ud mod overfladen. Hvorfor kernen er så stor, ved man ikke.</p>'
        + '<p>Kernen er blevet koldere, og så er hele Merkur skrumpet nogle km. Skorpen har slået folder, lidt som skindet på et æble, der tørrer ind: lange klinter, op til ca. 1.000 km lange og 3 km høje. Prøv ' + BJERGE + '.</p>',
    },
  ],
  nørd: '<p><b>To slags døgn:</b> Merkur drejer én gang på 58,65 jorddøgn (stjernedøgnet). Soldøgnet er 175,94 døgn: 1 / (1/58,65 − 1/87,97). Merkur drejer samme vej, som den går om Solen, så de to trækkes fra hinanden. Takten 3:2 er en resonans. Man opdagede den med radar i 1965. Før troede man, at Merkur altid vendte samme side mod Solen.</p>'
    + '<p><b>Aksen</b> hælder kun 0,034°, så Merkur har ingen årstider, og ved polerne står Solen altid helt nede ved horisonten.</p>'
    + '<p><b>De varme steder:</b> Hver gang Merkur er nærmest Solen, står Solen lige over ækvator ved længde 0° eller 180° (skiftevis). Dér bliver der varmest. Caloris ligger nær den ene. Herfra ser Solen 2,1 til 3,25 gange så bred ud som fra Jorden.</p>'
    + '<p><b>Højest og lavest:</b> Det højeste sted ligger ca. 4,5 km over middelhøjden lidt syd for ækvator, og det laveste ca. 5,4 km under, i bunden af bassinet Rachmaninoff.</p>'
    + '<p><b>Magnetfelt og luft:</b> Merkur har et svagt magnetfelt, ca. 1 % af Jordens, og midten af det ligger lidt nord for planetens midte. Luften er så tynd, at atomerne næsten aldrig støder sammen. Den kaldes en exosfære og er mest natrium, magnesium, ilt og brint.</p>'
    + '<p><b>Sonderne:</b> Mariner 10 fløj forbi tre gange i 1974-1975 og fotograferede under halvdelen af Merkur. MESSENGER gik i bane 18. marts 2011 som den første og styrtede ned 30. april 2015. BepiColombo fra ESA og Japan gik i bane 21. november 2026. En fejl i programmet stoppede motorerne for tidligt, så en tur rundt tager 75 timer i stedet for 58, men sonden er i sikkerhed. Efter planen deler den sig i to sonder 9.-10. december 2026, og målingerne begynder i april 2027.</p>'
    + '<p><b>Solens retning</b> og hvor langt Merkur har drejet, regnes for dagens dato ud fra banen og den internationale astronomiske unions (IAU) formel for drejningen. Det passer med NASA\'s JPL Horizons inden for ca. 0,01°.</p>'
    + '<p><b>Radius:</b> Kortene fra MESSENGER er lavet til en kugle med radius 2.439,4 km, og højderne er målt fra den. NASA skriver 2.439,7 km. Programmet bruger kortenes kugle.</p>',
  billeder: '<p>Kortet og højderne er fra MESSENGER (NASA/JHUAPL/Carnegie Institution of Washington), sat sammen af USGS (fotoene ca. 166 m pr. pixel og højderne ca. 665 m pr. pixel). Den gule is er Arecibo-observatoriets radarbillede (Harmon m.fl. 2011) fra NASA\'s billede PIA15530. Fotoet af de lyse huller er MESSENGERs (NASA PIA15366).</p>',
  ærligt: '<p>Kortet er sat sammen af tusindvis af fotos, taget med Solen lavt på himlen, så kraterne kaster skygger. Skyggerne i fotoene følger ikke Solen i programmet, og nogle steder kommer de fra forskellige sider. Fotoene er taget med forskelligt lys, og de lyse og mørke striber, det gav, er gjort jævne (med et kort, der er taget med høj sol).</p>'
    + '<p>Merkur er mørkere, end den ser ud her: Den kaster kun ca. en tiendedel af sollyset tilbage, lidt som asfalt. Kortet er gråt med et svagt brunt skær.</p>'
    + '<p><b>Isen</b> kan ikke ses. Den ligger i evigt mørke, og det gule er radarens pletter set fra Jorden, lagt på kortet. Radaren kunne ikke se alt, så der kan være is flere steder.</p>'
    + '<p>Tiden går meget hurtigere end i virkeligheden.</p>',
};

// Stederne (MP2). Tallene: USGS' navneliste (bredde, længde og størrelse), NASA og Wikipedia (del 8, afsnit 3).
export const SIDER = {
  caloris: {
    // Navnelisten: 1.500 km, "hot plains". Mariner 10 1974 (kun den østlige halvdel). Kanten ca. 2 km høj (Wikipedia)
    tal: [['Bredde', 'ca. 1.500 km'], ['Fundet', '1974 (Mariner 10)']],
    kort: 'Caloris er et af de største nedslagsbassiner i Solsystemet, ca. 1.500 km bredt. Kanten er en ring af bjerge, og bunden er fyldt med størknet lava. I midten går lange revner ud til alle sider. De kaldes "Edderkoppen".',
    emner: [
      {
        titel: 'Hvorfor "den varme slette"?',
        tekst: '<p>Caloris betyder "varme". Hver anden gang Merkur er nærmest Solen, står Solen lige over ækvator ved længde 180°, ikke langt fra bassinet. Dér bliver der varmest på hele Merkur. Over bassinets midte står Solen så ca. 54° oppe.</p>',
      },
      {
        // Wikipedia ("Caloris Planitia"): "weird terrain" modsat bassinet, måske fra rystelserne (hypotese)
        titel: 'Hvad skete der på den anden side?',
        tekst: '<p>Lige på den modsatte side af Merkur er jorden mærkeligt bakket og furet. Man tror, at rystelserne fra nedslaget løb rundt om hele planeten og mødtes dér. Det er en idé, ikke noget, man ved.</p>',
      },
    ],
    videre: [sted('merkur', 'Hele Merkur'), sted('huller', 'De lyse huller')],
    ærligt: LYSET + SKYGGER + '<p><b>Edderkoppen</b> ses kun som tynde streger, for revnerne er smallere end højderne i kortet (ca. 665 m mellem punkterne).</p>',
  },
  huller: {
    // Navnelisten: Raditladi 258 km. NASA "Hollows on Mercury": 18 m til over 1,6 km brede, 18-37 m dybe, opdaget 2011
    tal: [['Raditladi', 'ca. 260 km bred'], ['Hullerne', '18 m til 1,6 km brede']],
    kort: 'Raditladi er et ungt bassin med en indre ring af bjerge. På bunden og ringen ligger lyse, flade huller, som rumsonden MESSENGER opdagede i 2011. De er for små til at ses på kloden, så her er MESSENGERs nærbillede.',
    foto: FOTO_HULLER,
    emner: [
      {
        titel: 'Hvad er de lyse huller?',
        tekst: '<p>Flade fordybninger uden kant, kun 18-37 m dybe og med lyse rande. Man tror, at et stof i klippen forsvinder direkte ud i rummet i solheden. Det kaldes sublimation. Så synker jorden. Hvilket stof det er, ved man ikke.</p>'
          + '<p>Hullerne er noget af det yngste på Merkur. Måske bliver der stadig lavet nye.</p>',
      },
      {
        titel: 'Er der et sted, Solen aldrig når?',
        tekst: '<p>Gæt, før du trykker: Hvor på Merkur kan noget ligge i meget lang tid uden at få sol? ' + sted('is', 'Is ved Nordpolen') + '</p>',
      },
    ],
    videre: [sted('merkur', 'Hele Merkur'), sted('is', 'Is ved Nordpolen')],
    billeder: '<p>Fotoet er taget med MESSENGERs smalle kamera med ca. 47 m pr. pixel (NASA PIA15366). Kortet på kloden har ca. 166 m pr. pixel, og hullerne ses ikke.</p>',
    ærligt: LYSET + SKYGGER,
  },
  is: {
    // Navnelisten: Prokofiev 112 km, 85,77° N. Solen højst ca. 4,2° oppe (90° − 85,77°, regnet). Radar 1991
    tal: [['Prokofiev', 'ca. 112 km bred'], ['Solen', 'højst ca. 4° oppe']],
    kort: 'Prokofiev er det største krater med is ved Merkurs nordpol. Her står Solen altid helt nede ved horisonten, så bunden af mange kratere ligger i evig skygge. Slå ' + IS + ' til: Det gule er de steder, hvor radar fra Jorden fik et stærkt ekko, som fra is.',
    emner: [
      {
        titel: 'Hvorfor smelter isen ikke?',
        tekst: '<p>Solen står højst ca. 4° over horisonten, så kratervæggene skygger for bunden hele tiden. Der er ingen luft, der kan føre varmen derned. Derfor er bunden så kold, at isen aldrig når at fordampe, selv om Merkur er planeten nærmest Solen.</p>',
      },
      {
        titel: 'Hvor kommer isen fra?',
        tekst: '<p>Det ved man ikke sikkert. Måske kom vandet med kometer og asteroider, der ramte Merkur. Lidt af vandet endte i de kolde kratere og blev der.</p>',
      },
    ],
    videre: [sted('merkur', 'Hele Merkur'), sted('caloris', 'Caloris')],
    billeder: '<p>Over 72° bruges et kort over polen set lige ovenfra, så kraterne ikke bliver slørede. Det gule er Arecibo-observatoriets radarbillede af nordpolen (Harmon m.fl. 2011), lagt præcis oven på kortet.</p>',
    ærligt: '<p><b>Isen</b> kan ikke ses: Den ligger i evigt mørke, og det gule er radarens pletter. Programmet lader dem lyse, så de kan ses i skyggen. Radaren så polen fra Jorden og kunne ikke se ned i alle kratere.</p>'
      + '<p><b>Lyset:</b> Datoen er spolet hen til middag her, så Solen står så højt, den kan. De sorte kraterbunde er fra MESSENGERs fotos: De får aldrig sol, så skyggen i kortet passer altid.</p>',
  },
  solen: {
    // Regnet med banen og drejningen (js/data/merkur-sol.js): baglæns i ca. 8,1 døgn og ca. 1,1°, skiven 1,73° ved
    // perihel. Ved perihel løber Merkur ca. 6,35° pr. døgn om Solen, og den drejer 6,14° pr. døgn (del 8, afsnit 2)
    tal: [['Solen bakker', 'ca. 8 jorddøgn'], ['Solens skive', '3,25 gange så bred som fra Jorden']],
    kort: 'Tegningen viser horisonten på Merkurs ækvator, dér hvor Solen står op, lige før Merkur er nærmest Solen. Tiden går et døgn i sekundet. Se: Solen kommer et stykke op, synker ned igen og står så op for alvor.',
    emner: [
      {
        titel: 'Hvorfor bakker Solen?',
        tekst: '<p>Merkur drejer ca. 6,1° om sig selv hvert jorddøgn. Det får Solen til at gå hen over himlen. Men Merkurs bane er aflang, og tæt på Solen løber Merkur hurtigere, ca. 6,4° rundt om Solen hvert jorddøgn.</p>'
          + '<p>I de dage løber Merkur altså hurtigere rundt om Solen, end den drejer om sig selv. Så går Solen baglæns på himlen, ca. 1,1° på ca. 8 jorddøgn. Bagefter går den frem igen.</p>',
      },
      {
        titel: 'Kan man se det fra rummet?',
        tekst: '<p>Næsten ikke. Grænsen mellem dag og nat flytter sig kun ca. 47 km tilbage på en klode, der er 4.879 km bred. Derfor viser tegningen det, som man ville se det fra jorden.</p>',
      },
    ],
    videre: [sted('merkur', 'Hele Merkur')],
    nørd: '<p><b>Hvor og hvornår:</b> Det sker hver gang, Merkur er nærmest Solen (hver 88. dag), på ækvator ca. 90° fra det sted, Solen står lige over. Det er skiftevis ved ca. 90° øst og ca. 90° vest. Kun i en smal stribe kommer en del af Solen op og forsvinder igen. Højst ca. to tredjedele af skiven når op, for skiven er 1,73° bred, og Solen går kun 1,1° tilbage.</p>'
      + '<p><b>Tallene</b> regnes med den samme bane og drejning som kloden, så tegningen og 3D-billedet passer sammen.</p>',
    ærligt: '<p><b>Tegningen</b> gælder ét sted, og himlen er forstørret, så du kan se Solens skive. Horisonten er tegnet flad, for bakker ville gøre det hele sværere at se. Der er ingen luft, så himlen er sort, også når Solen står op.</p>',
  },
  rachmaninoff: {
    // Navnelisten: 305 km. NASA (2016): det laveste punkt 5,38 km under middel i bunden
    tal: [['Bredde', 'ca. 305 km'], ['Bunden', 'ca. 5,4 km under middel']],
    kort: 'Rachmaninoff er et nedslagsbassin med en indre ring af bjerge. I bunden ligger det laveste sted på Merkur, ca. 5,4 km under middelhøjden.',
    videre: [sted('merkur', 'Hele Merkur')],
    ærligt: LYSET + SKYGGER,
  },
  hokusai: {
    // Navnelisten: 114 km. Strålerne (RS, del 8)
    tal: [['Bredde', 'ca. 114 km']],
    kort: 'Hokusai er et ungt krater. Ved nedslaget blev lyst materiale kastet langt ud i stråler hen over kloden.',
    videre: [sted('merkur', 'Hele Merkur')],
    ærligt: LYSET + '<p><b>Strålerne</b> ses bedst med Solen højt på himlen. Kortet er fotos med lav sol, så her er de svære at se.</p>',
  },
};

// Flybyen (MP2, js/solsystem/flyby.js): 6 stop. id: stoppet i js/kosmos/merkur.js. tekst: underteksten (under ca. 160
// tegn, fra drejebogens afsnit 3 med Opus' rettelser i E16: stop 5 "Man tror", stop 6 uden "−170 °C", som ikke er slået
// op). nu: "Lige nu" i panelet ved stoppet.
export const TUR = [
  {
    id: 'merkur', titel: 'Merkur', knap: 'Merkur',
    tekst: 'Merkur er den mindste planet og den nærmeste ved Solen. Den har næsten ingen luft, så intet slider kraterne væk. Derfor ligner den Månen.',
    nu: '<p><b>Lige nu:</b> Hele Merkur, sådan som MESSENGER fotograferede den. Alle pletterne er kratere fra sten, der ramte den.</p>',
  },
  {
    id: 'caloris', titel: 'Caloris', knap: 'Caloris',
    tekst: 'Caloris er et af de største nedslagskratere i Solsystemet, ca. 1.500 km bredt. Navnet betyder "den varme slette". Her er et af de varmeste steder.',
    nu: '<p><b>Lige nu:</b> Morgensolen står lavt i øst, så ringen af bjerge og revnerne i midten kaster skygger.</p>',
  },
  {
    // NSSDC: soldøgnet 175,94 døgn = 2 år. NASA: op til 430 °C, ned til −180 °C
    id: 'dagen', titel: 'Den lange dag', knap: 'den lange dag',
    tekst: 'Fra solopgang til solopgang går der 176 jorddøgn. Det er to hele år på Merkur. I solen er der over 400 °C, om natten ca. −180 °C.',
    nu: '<p><b>Lige nu:</b> Tiden går seks døgn i sekundet. Se grænsen mellem dag og nat glide hen over kloden.</p>',
  },
  {
    // Regnet: baglæns i ca. 8,1 døgn (js/data/merkur-sol.js)
    id: 'solen', titel: 'Solen vender om', knap: 'Solen vender om',
    tekst: 'Tæt på Solen løber Merkur så stærkt, at Solen går i stå på himlen, bakker i otte døgn og går frem igen. Nogle få steder står den op to gange.',
    nu: '<p><b>Lige nu:</b> Tegningen viser horisonten, dér hvor Solen står op. Tiden går et døgn i sekundet. Hold øje med Solen.</p>',
  },
  {
    // NASA "Hollows on Mercury". Opus' rettelse (E16): "Man tror"
    id: 'huller', titel: 'De lyse huller', knap: 'de lyse huller',
    tekst: 'De lyse pletter er flade huller. Man tror, at noget i klippen forsvinder ud i rummet i solheden, så jorden synker. Hvor ville du lede efter is?',
    nu: '<p><b>Lige nu:</b> Bassinet Raditladi. Hullerne er for små til kloden, så MESSENGERs nærbillede står i panelet.</p>',
  },
  {
    // NSSDC: aksen 0,034°. NASA PIA19411: radar og MESSENGER. Opus' rettelse (E16): ikke "−170 °C"
    id: 'is', titel: 'Is ved Nordpolen', knap: 'isen',
    tekst: 'Ved polerne står Solen altid helt nede ved horisonten. Bunden af nogle kratere får aldrig sol og er så kold, at isen ikke fordamper. Dér ligger der is.',
    nu: '<p><b>Lige nu:</b> Prokofiev og kraterne ved nordpolen. Det gule er radarens ekko fra isen, set fra Jorden.</p>',
  },
];
export const TUR_SLUT = '<p><b>Turen er slut.</b> Merkur har næsten ingen luft, så der er over 400 °C i solen og iskoldt i skyggen, og ved polerne ligger der is. Drej selv rundt, eller vælg et sted i listen.</p>';
