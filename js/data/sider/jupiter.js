// Teksterne i højre panel ved Jupiter (siden i lag, U3 i docs/plan-ux.md). J1 og J2 i docs/plan-jupiter.md: Jupiters
// egen side og pletten, kort. De andre steder, månerne og flybyen får deres sider i J4 (og faktatjekkes igen dér).
// Tallene er fra docs/fakta-solsystemet.md, "Del 5: Jupiter" (NSSDC). Uden Three.js, så teksterne kan testes i Node.

import { kontakt, sted, tid } from '../../sideknap.js';

export const SIDE = {
  kort: 'Jupiter er den største planet i solsystemet. Den er en kæmpe kugle af gas, mest brint og helium, og har ingen fast overflade at stå på. Du ser Jupiter i den rigtige form, og den drejer rundt én gang på knap 10 timer.',
  emner: [
    {
      titel: 'Hvorfor er Jupiter fladtrykt?',
      tekst: '<p>Jupiter drejer om sig selv på 9 timer og 56 minutter. Det er det korteste døgn af alle planeterne. Fordi Jupiter er af gas og drejer så hurtigt, buler den ud ved ækvator. Fra pol til pol er den ca. 6,5 % kortere end hen over ækvator, og det kan man se.</p>',
    },
    {
      titel: 'Hvad er den røde plet?',
      tekst: `<p>Den Store Røde Plet er en kæmpe storm, omtrent lige så bred som Jorden. Den ligger syd for ækvator og har været set sikkert siden 1831. Den er blevet mindre i de sidste 150 år. ${sted('plet', 'Flyv derhen')}</p>`,
    },
    {
      titel: 'Hvor hurtigt blæser det?', kontakt: 'Vindene',
      tekst: `<p>Skybåndene blæser skiftevis mod øst og mod vest. Slå ${kontakt('Vindene')} til, så viser pilene vinden: jo længere pil, jo hurtigere. Gule pile blæser mod øst, blå mod vest. Den hurtigste vind blæser ca. 150 meter i sekundet (ca. 540 km/t) mod øst, 24 grader nord for ækvator.</p>`
        + `<p>Vindene måles i forhold til Jupiters døgn. Selvom de er hurtige, flytter skyerne sig højst ca. 5 grader, mens Jupiter drejer én gang. ${tid('hurtig', 'Prøv ⏩')}</p>`,
    },
    {
      titel: 'Hvordan ser Jupiter ud bagfra?', kontakt: 'Modlys',
      tekst: `<p>Slå ${kontakt('Modlys')} til, så står Solen bag Jupiter. Så lyser de øverste lag af luften som en tynd ring i kanten.</p>`,
    },
  ],
  nørd: '<p><b>Døgnet</b> er svært at måle på en planet uden fast overflade, for skyerne blæser hver sin vej. Derfor måles det efter radiobølgerne fra Jupiters magnetfelt, som drejer med planetens indre: 9 t 55,5 min. Det kaldes System III.</p>'
    + '<p><b>Vindene er målt af os.</b> Hubble fotograferede Jupiter to omgange i træk den 11.-12. december 2025, med 9 timer og 25 minutter imellem. For hver stribe af skyer har vi fundet, hvor langt den har flyttet sig mellem de to billeder (krydskorrelation). Det giver ca. 149 m/s ved 24° N. Forskerne bag Hubbles kort målte 153 m/s samme sted i 2015, Cassini 138 m/s i 2000 og Voyager 184 m/s i 1979. Vindene ændrer sig lidt fra år til år.</p>'
    + '<p><b>Kortet ligger på en fladtrykt kugle.</b> Hubbles kort bruger "planetografisk" bredde (vinklen mellem lodret og ækvator), Cassinis "planetocentrisk" (vinklen fra Jupiters midte). Ved 45° er forskellen næsten 4°, så begge kort er regnet om, før de lægges på kloden.</p>',
  billeder: '<p>Kortet er Hubbles foto fra 11.-12. december 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0). Farverne er justeret efter Cassinis kort fra december 2000 (NASA/JPL/Space Science Institute), som har farver tæt på dem, øjet ville se. Nær polerne, hvor Hubble ikke kan se, er kortet fra Cassini.</p>',
  ærligt: '<p>Jupiter bliver bygget lige nu. Månerne, ringene og flybyen kommer senere. Båndene glider med den fart, vi har målt, men skyerne i dem ændrer sig ikke, som de gør i virkeligheden: De toner langsomt ud og kommer igen, hvor de stod på Hubbles foto. Nær polerne er vindene ikke målt, så der står skyerne stille. Hubbles farver er justeret efter Cassinis, og skyerne ved polerne er fra år 2000.</p>',
};

export const SIDER = {
  plet: {
    tal: [['Bredde', 'ca. 13.000-14.000 km'], ['Én omgang', 'ca. 4½ døgn'], ['Set sikkert siden', '1831'], ['Ligger ved', 'ca. 23° syd']],
    kort: 'Pletten ligger mellem to vinde, der blæser hver sin vej: mod vest på nordsiden og mod øst på sydsiden. Den drejer samme vej, som en bold mellem to hænder, der gnider mod hinanden.',
    emner: [
      {
        titel: 'Hvor gammel er pletten?',
        tekst: '<p>Den plet, vi ser i dag, er set sikkert siden 1831, altså i mindst 190 år. I 1600-tallet så astronomer også en plet, men den forsvandt nok, og den nuværende opstod senere.</p>',
      },
      {
        titel: 'Bliver den mindre?',
        tekst: '<p>Ja. I slutningen af 1800-tallet var den ca. 41.000 km lang, mere end tre gange så bred som Jorden. Nu er den omtrent lige så bred som Jorden, og den bliver rundere.</p>',
      },
    ],
    nørd: '<p>Pletten er et højtryk (en antikyklon). På den sydlige halvkugle drejer et højtryk mod uret. Vinden i kanten blæser over 640 km/t (Hubble 2021), og Juno har målt, at pletten går ca. 350-500 km ned under skyerne.</p>'
      + '<p>Bredden er målt i Hubbles kort fra december 2025, der hvor pletten er tydeligt rød.</p>',
    billeder: '<p>Pletten er fra Hubbles kort fra 11.-12. december 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0).</p>',
    ærligt: '<p>Pletten drejer som en hel skive. I virkeligheden drejer kanten hurtigst, og midten er roligere. Her står Jupiters døgn stille, så pletten bliver i sollys. Hubbles kort har ca. 125 km pr. pixel, så tæt på tegner programmet fine skyer oven i kortet (på pc).</p>',
  },
};
