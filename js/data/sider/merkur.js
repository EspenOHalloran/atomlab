// Teksterne i højre panel ved Merkur (siden i lag, U3 i docs/plan-ux.md). MP1 i docs/drejebog-merkur-pluto.md: kun den
// korte tekst, to emner, "For nørder", billederne og "Ærligt talt", for Merkur er halvfærdig (stederne, tegningen af
// Solen, der vender om, og flybyen kommer i MP2 og faktatjekkes dér). Tallene er fra
// docs/fakta-solsystemet/del8-merkur-og-pluto.md (NSSDC, NASA og JPL Horizons). Uden Three.js.

import { kontakt, tid } from '../../sideknap.js';

const BJERGE = kontakt('Bjergene 10 gange højere');
const HURTIG = tid('hurtig', '⏩ Hurtigere');

export const SIDE = {
  kort: 'Merkur er den mindste planet og den nærmeste ved Solen. Den har næsten ingen luft, så intet slider kraterne væk, og den ligner vores måne. Her ser du hele Merkur, sådan som rumsonden MESSENGER fotograferede den fra 2011 til 2015. Stederne og en flyby kommer snart.',
  emner: [
    {
      titel: 'Et døgn, der varer to år?',
      tekst: '<p>Merkur er 88 jorddøgn om at komme én gang rundt om Solen. Den drejer om sig selv på 59 jorddøgn, set mod stjernerne. Men den går jo samtidig rundt om Solen, så fra én solopgang til den næste går der 176 jorddøgn. Det er præcis to år på Merkur: Den drejer tre gange om sig selv, mens den går to gange rundt.</p>'
        + '<p>Tryk ' + HURTIG + ', og se dagsiden glide langsomt hen over kloden.</p>',
    },
    {
      titel: 'Hvorfor er der så varmt og så koldt?',
      tekst: '<p>Der er ingen luft, der kan holde på varmen eller flytte den rundt. Derfor bliver dagsiden over 400 °C varm, og natsiden falder til ca. −180 °C. Himlen er sort, også om dagen.</p>'
        + '<p>MESSENGER målte også højderne. Fra det laveste til det højeste sted er der næsten 10 km. Prøv ' + BJERGE + '.</p>',
    },
  ],
  nørd: '<p><b>To slags døgn:</b> Merkur drejer én gang på 58,65 jorddøgn (stjernedøgnet). Soldøgnet er 175,94 døgn: 1 / (1/58,65 − 1/87,97). Merkur drejer samme vej, som den går om Solen, så de to trækkes fra hinanden.</p>'
    + '<p><b>Aksen</b> hælder kun 0,034°, så Merkur har ingen årstider, og ved polerne står Solen altid helt nede ved horisonten.</p>'
    + '<p><b>Solens retning</b> og hvor langt Merkur har drejet, regnes for dagens dato ud fra banen og den internationale astronomiske unions (IAU) formel for drejningen. Det passer med NASA\'s JPL Horizons inden for ca. 0,01°.</p>'
    + '<p><b>Radius:</b> Kortene fra MESSENGER er lavet til en kugle med radius 2.439,4 km, og højderne er målt fra den. NASA skriver 2.439,7 km. Programmet bruger kortenes kugle.</p>',
  billeder: '<p>Kortet og højderne er fra MESSENGER (NASA/JHUAPL/Carnegie Institution of Washington), sat sammen af USGS (fotoene ca. 166 m pr. pixel og højderne ca. 665 m pr. pixel).</p>',
  ærligt: '<p>Kortet er sat sammen af tusindvis af fotos, taget med Solen lavt på himlen, så kraterne kaster skygger. Skyggerne i fotoene følger ikke Solen i programmet. Fotoene er taget med forskelligt lys, og de lyse og mørke striber, det gav, er gjort jævne (med et kort, der er taget med høj sol). Merkur er mørkt gråbrun, og kortet er gråt med et svagt brunt skær. Tiden går meget hurtigere end i virkeligheden.</p>',
};

export const SIDER = {};
