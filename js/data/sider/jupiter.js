// Teksterne i højre panel ved Jupiter (siden i lag, U3 i docs/plan-ux.md). J1 i docs/plan-jupiter.md: kun Jupiters
// egen side, kort. Stederne, månerne og flybyen får deres sider i J4 (og faktatjekkes igen dér).
// Tallene er fra docs/fakta-solsystemet.md, "Del 5: Jupiter" (NSSDC). Uden Three.js, så teksterne kan testes i Node.

import { kontakt } from '../../sideknap.js';

export const SIDE = {
  kort: 'Jupiter er den største planet i solsystemet. Den er en kæmpe kugle af gas, mest brint og helium, og har ingen fast overflade at stå på. Du ser Jupiter i den rigtige form, og den drejer rundt én gang på knap 10 timer.',
  emner: [
    {
      titel: 'Hvorfor er Jupiter fladtrykt?',
      tekst: '<p>Jupiter drejer om sig selv på 9 timer og 56 minutter. Det er det korteste døgn af alle planeterne. Fordi Jupiter er af gas og drejer så hurtigt, buler den ud ved ækvator. Fra pol til pol er den ca. 6,5 % kortere end hen over ækvator, og det kan man se.</p>',
    },
    {
      titel: 'Hvad er den røde plet?',
      tekst: '<p>Den Store Røde Plet er en kæmpe storm, omtrent lige så bred som Jorden. Den ligger syd for ækvator og har været set sikkert siden 1831. Den er blevet mindre i de sidste 150 år.</p>',
    },
    {
      titel: 'Hvordan ser Jupiter ud bagfra?', kontakt: 'Modlys',
      tekst: `<p>Slå ${kontakt('Modlys')} til, så står Solen bag Jupiter. Så lyser de øverste lag af luften som en tynd ring i kanten.</p>`,
    },
  ],
  nørd: '<p><b>Døgnet</b> er svært at måle på en planet uden fast overflade, for skyerne blæser hver sin vej. Derfor måles det efter radiobølgerne fra Jupiters magnetfelt, som drejer med planetens indre: 9 t 55,5 min. Det kaldes System III.</p>'
    + '<p><b>Kortet ligger på en fladtrykt kugle.</b> Hubbles kort bruger "planetografisk" bredde (vinklen mellem lodret og ækvator), Cassinis "planetocentrisk" (vinklen fra Jupiters midte). Ved 45° er forskellen næsten 4°, så begge kort er regnet om, før de lægges på kloden.</p>',
  billeder: '<p>Kortet er Hubbles foto fra 11.-12. december 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0). Farverne er justeret efter Cassinis kort fra december 2000 (NASA/JPL/Space Science Institute), som har farver tæt på dem, øjet ville se. Nær polerne, hvor Hubble ikke kan se, er kortet fra Cassini.</p>',
  ærligt: '<p>Jupiter bliver bygget lige nu. Månerne, vindene, ringene og flybyen kommer senere. Skyerne står stille på kortet, selvom de i virkeligheden blæser hver sin vej. Hubbles farver er justeret efter Cassinis, og skyerne ved polerne er fra år 2000.</p>',
};

export const SIDER = {};
