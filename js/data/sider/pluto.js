// Teksterne i højre panel ved Pluto (siden i lag, U3 i docs/plan-ux.md). MP3 i docs/drejebog-merkur-pluto.md: den korte
// tekst med kernesætning A, to emner (dansen og disen), Charons side, "For nørder", billederne og "Ærligt talt". Stederne
// (hjertet og bjergene), flybyen og resten af spørgsmålene kommer i MP4. Tallene er fra
// docs/fakta-solsystemet/del8-merkur-og-pluto.md (NSSDC, NASA, USGS' navneliste og JPL Horizons). Faktatjekket MP3 står
// i del 8, afsnit 12. Uden Three.js.

import { kontakt, tid, sted } from '../../sideknap.js';

const MODLYS = kontakt('Modlys');
const NAVNE = kontakt('Navne');
const HURTIG = tid('hurtig', '⏩ Hurtigere');

export const SIDE = {
  // Kernesætning A (jeres svar 16. november 2026): "På Pluto er der så koldt, at vandis er hård som sten og danner
  // bjerge, og kvælstof, som vi indånder, ligger som en gletsjer, der stadig bevæger sig. Pluto er lille, men ikke død."
  kort: 'Pluto er mindre end vores måne og ligger så langt ude, at der er ca. −230 °C. Så koldt er der, at vandis er hård som sten og danner bjerge, og kvælstof, som vi indånder, ligger som en gletsjer, der stadig bevæger sig. Her ser du Pluto og månen Charon, sådan som rumsonden New Horizons så dem i juli 2015. Stederne og en flyby kommer snart.',
  emner: [
    {
      // NSSDC: Charon 19.596 km fra Pluto, omløb og drejning 6,387 døgn. Tyngdepunktet regnet: 2.126 km fra midten
      titel: 'To, der danser',
      tekst: '<p>Charon er halvt så bred som Pluto og kun ca. otte Pluto-bredder væk. Pluto og Charon vender altid samme side mod hinanden, som to dansere, der holder i hånd. De drejer rundt på 6,4 jorddøgn.</p>'
        + '<p>Charon kredser ikke om Plutos midte. Begge kredser om et punkt imellem dem, deres <b>fælles tyngdepunkt</b>. Det ligger ca. 940 km over Plutos overflade, ude i rummet. Slå ' + NAVNE + ' til, zoom ud, og tryk ' + HURTIG + '. ' + sted('charon', 'Charon') + '</p>',
    },
    {
      // Trykket ca. 10 mikrobar (NSSDC 10-13), ca. 20 lag op til mindst 150 km (Wikipedia, Photojournal PIA19948)
      titel: 'En blå ring',
      tekst: '<p>Pluto har en luft af mest kvælstof, men den er ca. 100.000 gange tyndere end Jordens. Højt oppe svæver små støvkorn af dis i mange tynde lag.</p>'
        + '<p>Da New Horizons var fløjet forbi og så sig tilbage mod Solen, lyste disen som en blå ring om Pluto. Prøv ' + MODLYS + '.</p>',
    },
  ],
  nørd: '<p><b>Døgnet:</b> Pluto drejer én gang på 6,387 jorddøgn, og Charon går rundt på præcis samme tid. Pluto og Charon er bundet til hinanden begge veje. Plutos akse hælder ca. 120°, så den ligger næsten ned og drejer baglæns.</p>'
    + '<p><b>Tyngdepunktet:</b> Charon vejer ca. 12 % af Pluto. Tyngdepunktet ligger derfor 19.596 km · 1,586 / 14,62 ≈ 2.126 km fra Plutos midte. Pluto er 1.188 km i radius, så punktet ligger ca. 940 km over overfladen. Fra Pluto ser Charon ca. 3,8° bred ud, ca. syv gange så bred som vores måne fra Jorden.</p>'
    + '<p><b>Solens retning</b> og hvor langt Pluto har drejet, regnes for dagens dato ud fra banen fra NASA\'s JPL Horizons og den internationale astronomiske unions (IAU) formel for drejningen. Punktet under Solen passer med Horizons inden for ca. 0,1°. Længde 0° er den side, der vender mod Charon.</p>',
  billeder: '<p>Kortene og højderne er fra New Horizons (NASA/JHUAPL/SwRI), sat sammen af USGS (ca. 300 m pr. pixel, mest langt grovere). Farverne er fra New Horizons\' farvekort (2017).</p>',
  ærligt: '<p>New Horizons fløj forbi på få timer og så kun den ene side tæt på. Den anden side er set langt væk og er uskarp. Det sydligste lå i mørke og er aldrig set: Det er mørkt på kloden. Højderne findes kun på den side, sonden så, så bagsiden er glat, fordi vi ikke ved bedre.</p>'
    + '<p>Farverne er lagt på fra et groft farvekort og gjort lidt svagere, for det er uvist, om kortet er forstærket. Disens lag er tegnet efter New Horizons\' billeder, ikke målt lag for lag. Størrelserne og afstanden mellem Pluto og Charon er ægte. Tiden går meget hurtigere end i virkeligheden.</p>',
};

export const SIDER = {
  charon: {
    tal: [
      ['Charons bredde', 'ca. 1.210 km'],
      ['Afstand til Pluto', 'ca. 19.600 km'],
      ['En omgang om Pluto', '6,4 jorddøgn'],
    ],
    // Neverland Regio (navnelisten, 2. februar 2026), tidligere kaldt "Mordor Macula" uofficielt. Den røde farve: nok
    // gas fra Pluto, der fryser fast og bliver til tholiner (Wikipedia, del 8 afsnit 4). Charon opdaget 22. juni 1978
    kort: 'Charon er Plutos største måne, halvt så bred som Pluto. Den er grå med en mørkerød nordpol. Ved siden af Charon ser du Pluto, som altid står samme sted på Charons himmel.',
    emner: [
      {
        titel: 'Hvorfor er nordpolen rød?',
        // Grundy m.fl. 2016 (Nature, refereret af Washington University og Scientific American): metan fra Pluto fryser
        // fast i polarnatten, og ultraviolet lys laver den om til tholiner. Navnet: USGS' navneliste, 2. februar 2026
        tekst: '<p>Farven kommer nok fra Pluto. Lidt af Plutos luft slipper ud i rummet, og noget af den når Charon. I den lange, mørke vinter ved polen er der så koldt, at gassen fryser fast. Ultraviolet lys laver den langsomt om til et rødbrunt stof. Området ved nordpolen fik i 2026 navnet Neverland Regio.</p>',
      },
    ],
  },
};
