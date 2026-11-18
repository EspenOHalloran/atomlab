// Teksterne i højre panel ved Pluto (siden i lag, U3 i docs/plan-ux.md). MP3 i docs/drejebog-merkur-pluto.md: den korte
// tekst med kernesætning A, Charons side, "For nørder", billederne og "Ærligt talt". MP4: de fire spørgsmål, stederne
// (SIDER: hjertet, bjergene af vandis og fire navne på kloden) og flybyen (TUR). Tallene er fra
// docs/fakta-solsystemet/del8-merkur-og-pluto.md (NSSDC, NASA, USGS' navneliste og JPL Horizons) med Opus' rettelser i
// docs/fable/E16-merkur-pluto-noter.md. Faktatjekket MP3 står i del 8, afsnit 12, og MP4 i afsnit 13. Uden Three.js.

import { kontakt, tid, sted, gå } from '../../sideknap.js';

const MODLYS = kontakt('Modlys');
const NAVNE = kontakt('Navne');
const HURTIG = tid('hurtig', '⏩ Hurtigere');
// Lyset ved et sted (pluto.js: STEDER, sol)
const LYSET = '<p><b>Lyset:</b> Tiden er spolet frem eller tilbage, så Solen står mod nordvest, som på New Horizons\' fotos her. Ellers ville skyggerne i kortet gå den forkerte vej.</p>';
const SKARPT = '<p>Over hjertet og bjergene ligger et skarpere kort (ca. 400 m pr. pixel på en pc), lavet af New Horizons\' kort med 300 m pr. pixel.</p>';

export const SIDE = {
  // Kernesætning A (jeres svar 16. november 2026): "På Pluto er der så koldt, at vandis er hård som sten og danner
  // bjerge, og kvælstof, som vi indånder, ligger som en gletsjer, der stadig bevæger sig. Pluto er lille, men ikke død."
  kort: 'Pluto er mindre end vores måne og ligger så langt ude, at der er ca. −230 °C. Så koldt er der, at vandis er hård som sten og danner bjerge, og kvælstof, som vi indånder, ligger som en gletsjer, der stadig bevæger sig. Her ser du Pluto og månen Charon, sådan som rumsonden New Horizons så dem i juli 2015.',
  emner: [
    {
      // Wikipedia ("Sputnik Planitia", hentet 17. november 2026): kvælstof-is med lidt kulilte, celler ca. 33 km (del 8),
      // varme indefra (den første forklaring, andre foreslår sublimation), højst ca. 7 cm om året, overfladen under 10
      // millioner år. Modsat Charon (178,7° mod 180°), måske har den tunge is drejet Pluto
      titel: 'Hvorfor er der ingen kratere i hjertet?',
      tekst: '<p>Hjertets venstre halvdel er en slette af kvælstof-is. Ved Plutos kulde er den is blød. Man tror, at varme inde fra Pluto får isen til at stige langsomt op i midten af store celler og synke ned ved kanten, højst nogle cm om året. Derfor er sletten et mønster af mangekanter, og overfladen bliver hele tiden ny. Kratere når ikke at blive.</p>'
        + '<p>Sletten ligger næsten præcis på den side, der vender væk fra Charon. Måske er det ikke tilfældigt: Den tunge is kan have drejet hele Pluto, så den endte dér. ' + sted('hjertet', 'Hjertet') + '</p>',
    },
    {
      // NASA: vandis er hård som klippe ved ca. −230 °C, kvælstof-is for blød. Bjergene: "flere km" (fælde 12, op til
      // ca. 6,2 km). Bakkerne, der flyder: Wikipedia ("Sputnik Planitia", NASA "Pluto's Mysterious, Floating Hills")
      titel: 'Hvordan kan is være et bjerg?',
      tekst: '<p>Jo koldere is er, jo hårdere bliver den. Ved ca. −230 °C er vandis hård som klippe, og den kan danne bjerge, der er flere km høje. Kvælstof-isen er for blød til at bære et bjerg. Den ville flyde ud som en gletsjer.</p>'
        + '<p>Ude på sletten ligger der også små bakker af vandis. Vandis er lettere end kvælstof-is, så de flyder som isbjerge. ' + sted('bjerge', 'Bjergene af vandis') + '</p>',
    },
    {
      // NSSDC: Charon 19.596 km fra Pluto, omløb og drejning 6,387 døgn. Tyngdepunktet regnet: 2.126 km fra midten.
      // Opus' rettelse (E16): Charon står kun stille på himlen fra den ene side
      titel: 'Hvorfor står Charon stille på himlen?',
      tekst: '<p>Charon er halvt så bred som Pluto og kun ca. otte Pluto-bredder væk. Pluto og Charon vender altid samme side mod hinanden, som to dansere, der holder i hånd. De drejer rundt på 6,4 jorddøgn. Fra den ene side af Pluto hænger Charon derfor stille på himlen og går aldrig ned. Fra den anden side, hvor hjertet ligger, ser man den aldrig.</p>'
        + '<p>Charon kredser ikke om Plutos midte. Begge kredser om et punkt imellem dem, deres <b>fælles tyngdepunkt</b>. Det ligger ca. 940 km over Plutos overflade, ude i rummet. Slå ' + NAVNE + ' til, zoom ud, og tryk ' + HURTIG + '. ' + sted('charon', 'Charon') + '</p>',
    },
    {
      // NASA: opsendt 19. januar 2006, forbi 14. juli 2015 12.500 km over overfladen med ca. 49.600 km/t, data hjemme 25.
      // oktober 2016 (over 15 måneder). Disen: trykket ca. 10 mikrobar (NSSDC 10-13), ca. 20 lag op til mindst 150 km
      // (Wikipedia, Photojournal PIA19948)
      titel: 'Hvordan ved vi det?',
      tekst: '<p>Kun én rumsonde har været her: New Horizons. Den var over ni år undervejs og fløj forbi 14. juli 2015 med ca. 50.000 km/t, 12.500 km over overfladen. Selve forbiflyvningen tog kun få timer. Sonden kunne kun sende langsomt, så det tog over 15 måneder at få alle billederne hjem.</p>'
        + '<p>Da sonden var fløjet forbi og så sig tilbage mod Solen, lyste en blå ring om Pluto. Det var dis i mange tynde lag i en luft af mest kvælstof, der er ca. 100.000 gange tyndere end Jordens. Prøv ' + MODLYS + '.</p>',
    },
  ],
  videre: [gå('solsystem:overblik', 'Hvorfor er Pluto ikke en planet?'), gå('solsystem:neptun', 'Neptun og Triton'), gå('system:7', 'Kvælstof')],
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
  // Stederne (MP4). Tallene: USGS' navneliste (bredde, længde og størrelse), NASA og Wikipedia (del 8, afsnit 4 og 13).
  hjertet: {
    // Fælde 19: "ca. 1.000 km bred" (NASA). Cellerne i snit ca. 33 km (Wikipedia). Tombaugh Regio efter Clyde Tombaugh,
    // der fandt Pluto i 1930 (NASA). Gletsjerne fra højlandet mod øst (Wikipedia). Fælde 18: kun den venstre halvdel
    tal: [['Bredde', 'ca. 1.000 km'], ['Cellerne', 'ca. 33 km brede']],
    kort: 'Hjertets venstre halvdel hedder Sputnik Planitia. Det er en slette af frossent kvælstof i et stort bassin, uden et eneste krater. Mangekanterne er celler, hvor den bløde is langsomt vælter rundt.',
    emner: [
      {
        titel: 'Hvorfor hedder det hjertet?',
        tekst: '<p>Hele det lyse område ligner et hjerte. Det hedder Tombaugh Regio efter Clyde Tombaugh, der fandt Pluto i 1930. Lidt af hans aske er med om bord på New Horizons.</p>'
          + '<p>Kun den venstre halvdel er en slette af is. Den højre halvdel er højland med et tyndt lag is. Derfra flyder gletsjere af kvælstof-is ned på sletten. Isen bevæger sig stadig.</p>',
      },
      {
        // Wikipedia: "less than 10 million years old" (Trilling 2016), ingen kratere set af New Horizons
        titel: 'Hvor gammel er sletten?',
        tekst: '<p>Overfladen er meget ung. New Horizons fandt ikke et eneste krater på sletten, så den er nok under ti millioner år gammel. Det meste af resten af Pluto er fuld af kratere og meget ældre. Pluto er lille, men ikke død.</p>',
      },
    ],
    videre: [sted('pluto', 'Hele Pluto'), sted('bjerge', 'Bjergene af vandis')],
    billeder: SKARPT,
    ærligt: LYSET,
  },
  bjerge: {
    // Wikipedia ("Tenzing Montes", Schenk m.fl. 2018): op til ca. 6,2 km, de højeste på Pluto, ved hjertets sydvestlige
    // kant. Opkaldt efter Tenzing Norgay (Everest 1953 med Edmund Hillary). Hillary Montes: 3,26° N, 169,58° Ø
    tal: [['Højde', 'op til ca. 6 km'], ['På jorden', 'ca. −230 °C']],
    kort: 'Tenzing Montes er de højeste bjerge på Pluto, op til ca. 6 km høje. De ligger ved hjertets sydvestlige kant og er lavet af vandis, der er hård som klippe i kulden. Bagved ligger den flade slette af kvælstof-is.',
    emner: [
      {
        titel: 'Hvem er bjergene opkaldt efter?',
        tekst: '<p>Efter Tenzing Norgay, der i 1953 sammen med Edmund Hillary som de første stod på toppen af Mount Everest. Bjergene Hillary Montes ligger lidt længere mod nordvest, også langs kanten af hjertet.</p>',
      },
      {
        // Wikipedia ("Wright Mons", Singer m.fl. 2022): ca. 150 km bred, 4,7 ± 1 km høj, hul i midten, få kratere,
        // sandsynligvis en isvulkan. Sydvest for Tenzing Montes
        titel: 'Er der vulkaner af is?',
        tekst: '<p>Måske. Lige sydvest for bjergene ligger Wright Mons, en bred, lav kuppel, ca. 150 km bred og 4-5 km høj, med et dybt hul i midten. Der er næsten ingen kratere på den, så den er ung. Man tror, at den er en <b>isvulkan</b>, hvor blød is er trængt op nedefra. Ingen har set et udbrud. ' + sted('wright', 'Wright Mons') + '</p>',
      },
    ],
    videre: [sted('pluto', 'Hele Pluto'), sted('hjertet', 'Hjertet')],
    billeder: SKARPT,
    ærligt: LYSET + '<p><b>Højderne</b> er målt ud fra billeder taget fra forskellige vinkler. De er grovere end fotoet, så små toppe er glattet ud. Bjergene er ikke gjort højere.</p>',
  },
  wright: {
    // Navnelisten: 21,36° S, 173,24° Ø. Wikipedia: ca. 150 km, 4,7 ± 1 km, opkaldt efter brødrene Wright
    tal: [['Bredde', 'ca. 150 km'], ['Højde', 'ca. 4-5 km']],
    kort: 'Wright Mons er en bred, lav kuppel med et dybt hul i midten. Måske er den en isvulkan. Den er opkaldt efter brødrene Wright, der byggede det første fly.',
    videre: [sted('pluto', 'Hele Pluto'), sted('bjerge', 'Bjergene af vandis')],
    ærligt: LYSET,
  },
  burney: {
    // Navnelisten: 296 km. Wikipedia ("Burney (crater)"): det eneste bassin med flere ringe, der er fundet på Pluto,
    // stærkt slidt. Venetia Burney, 11 år, foreslog navnet 14. marts 1930 (NASA)
    tal: [['Bredde', 'ca. 300 km']],
    kort: 'Burney er et gammelt nedslagsbassin med flere ringe, der er slidt så meget, at de næsten ikke kan ses. Det er opkaldt efter Venetia Burney, der som 11-årig i 1930 foreslog navnet Pluto efter underverdenens gud.',
    videre: [sted('pluto', 'Hele Pluto')],
    ærligt: LYSET,
  },
  belton: {
    // Navnelisten: 3.255 km (Wikipedia ca. 3.000 km), officielt navn 2023 (før uofficielt "Cthulhu"). Tholiner af metan
    // og kvælstof med ultraviolet lys og kosmisk stråling (Wikipedia "Belton Regio")
    tal: [['Længde', 'ca. 3.000 km']],
    kort: 'Belton Regio er det lange, mørkerøde område langs ækvator, som en hval. Den mørke farve kommer nok fra et rødbrunt stof, der bliver til, når ultraviolet sollys rammer metan og kvælstof i luften.',
    videre: [sted('pluto', 'Hele Pluto')],
    ærligt: '<p><b>Lyset:</b> Tiden er spolet, så Solen står højt over området.</p>',
  },
  tartarus: {
    // Navnelisten: 850 km. Kamme af metan-is, flere hundrede meter høje (del 8, RS). Ses kun groft (længere væk)
    tal: [['Længde', 'ca. 850 km']],
    kort: 'Tartarus Dorsa er et område med lange, skarpe kamme af is, flere hundrede meter høje. De kaldes knivene. De er for smalle til at ses på kloden her.',
    videre: [sted('pluto', 'Hele Pluto')],
    ærligt: '<p><b>Lyset:</b> Tiden er spolet, så Solen står over området. Her så New Horizons længere væk fra, så kortet er grovere.</p>',
  },
};

// Flybyen (MP4, js/solsystem/flyby.js): 5 stop i New Horizons' rækkefølge. id: stoppet i js/kosmos/pluto.js. tekst:
// underteksten (under 160 tegn), nu: "Lige nu" i panelet. Faktatjekket i del 8, afsnit 13.
export const TUR = [
  {
    // NSSDC: Pluto 2.376 km bred (Månen 3.475), Charon 1.212 km. Lyset ca. 4,9 timer i 2026 (regnet, tests/pluto.mjs)
    id: 'pluto', titel: 'Pluto og Charon', knap: 'Pluto og Charon',
    tekst: 'Pluto er mindre end vores måne og så langt ude, at sollyset er ca. fem timer om at nå herud. Månen Charon er halvt så bred som Pluto selv.',
    nu: '<p><b>Lige nu:</b> Pluto og Charon i den rigtige størrelse og afstand. Her er intet gjort større eller flyttet tættere på.</p>',
  },
  {
    // Fælde 18 og 19. Wikipedia: ingen kratere, cellerne vender sig
    id: 'hjertet', titel: 'Hjertet', knap: 'hjertet',
    tekst: 'Hjertets venstre halvdel er en slette af frossent kvælstof, ca. 1.000 km bred. Der er ingen kratere, for isen rører langsomt rundt og glatter sig selv.',
    nu: '<p><b>Lige nu:</b> Sputnik Planitia set fra syd. Mangekanterne er celler, ca. 33 km brede, hvor isen stiger op i midten og synker ned ved kanten.</p>',
  },
  {
    // NASA: vandis hård som klippe ved ca. −230 °C. Fælde 12: "flere km"
    id: 'bjerge', titel: 'Bjerge af vandis', knap: 'bjergene',
    tekst: 'Bjergene er flere km høje og lavet af vandis. Her er ca. −230 °C, og så kold er is hård som klippe. Kvælstof-isen er for blød til at bære et bjerg.',
    nu: '<p><b>Lige nu:</b> Tenzing Montes ved hjertets sydvestlige kant. Bagved ligger den flade slette af kvælstof-is.</p>',
  },
  {
    // Opus' rettelse (E16): kun fra den ene side
    id: 'charon', titel: 'Charon', knap: 'Charon',
    tekst: 'Pluto og Charon vender altid samme side mod hinanden. Fra den ene side af Pluto hænger Charon stille på himlen. Fra den anden ser man den aldrig.',
    nu: '<p><b>Lige nu:</b> Charon med den mørkerøde nordpol. Bagved står Pluto, som altid står samme sted på Charons himmel.</p>',
  },
  {
    // Photojournal PIA19948 (15 minutter efter passagen). Trykket ca. 10 mikrobar, 1/100.000 af Jordens
    id: 'modlys', titel: 'Farvel i modlys', knap: 'modlys',
    tekst: 'Da New Horizons fløj forbi i 2015 og så sig tilbage, lyste en blå ring om Pluto: dis i en luft, der er 100.000 gange tyndere end Jordens.',
    nu: '<p><b>Lige nu:</b> Solen står lige bag Pluto, og disen lyser som en tynd blå ring.</p>',
  },
];
export const TUR_SLUT = '<p><b>Turen er slut.</b> På Pluto er vandis hård som sten og danner bjerge, og kvælstof-isen i hjertet bevæger sig stadig. Pluto er lille, men ikke død. Drej selv rundt, eller vælg et sted i listen.</p>';
