// Teksterne i højre panel ved Venus (siden i lag, U3 i docs/plan-ux.md). V1 i docs/plan-venus.md: kun den korte tekst,
// to emner, "For nørder", billederne og "Ærligt talt", for Venus er halvfærdig (skyerne kommer i V2). Resten (stederne,
// flybyen og de andre emner) kommer i V5 og faktatjekkes dér. Tallene er fra docs/fakta-solsystemet/del7-venus.md
// (NSSDC og JPL Horizons). Uden Three.js.

import { kontakt, tid } from '../../sideknap.js';

const BJERGE = kontakt('Bjergene 10 gange højere');
const HURTIG = tid('hurtig', '⏩ Hurtigere');

export const SIDE = {
  kort: 'Venus er næsten lige så stor som Jorden, men den er dækket af tykke skyer. Her ser du jorden under skyerne, sådan som rumsonden Magellan kortlagde den med radar fra 1990 til 1994. Skyerne kommer snart. Venus drejer meget langsomt og baglæns: én omgang tager 243 jorddøgn.',
  emner: [
    {
      titel: 'Et døgn, der er længere end et år?',
      tekst: '<p>Venus er 225 jorddøgn om at komme én gang rundt om Solen. Men den er 243 jorddøgn om at dreje én gang om sig selv, set mod stjernerne. Så den omgang varer længere end et år.</p>'
        + '<p>Venus drejer baglæns, den modsatte vej af Jorden. Derfor står Solen op i vest og går ned i øst. Fra én solopgang til den næste går der ca. 117 jorddøgn, for mens Venus drejer den ene vej, går den den anden vej om Solen. Tryk ' + HURTIG + ', og se dagsiden glide hen over kloden.</p>',
    },
    {
      titel: 'Hvordan kan man se gennem skyerne?',
      tekst: '<p>Med radar. Magellan sendte radiobølger ned gennem skyerne og målte, hvad der kom tilbage. Ru eller skrå jord kaster meget tilbage og bliver lys på kortet. Glat jord, fx flade strømme af størknet lava, bliver mørk. Radaren ser altså ikke farver. Programmet har tonet kortet orange, for sådan er lyset nede under skyerne.</p>'
        + '<p>Magellan målte også højderne. Det højeste bjerg, Maxwell Montes, er ca. 11 km højt. Prøv ' + BJERGE + '.</p>',
    },
  ],
  nørd: '<p><b>To slags døgn:</b> NASA skriver drejningen som −5.832,6 timer (243,0 døgn, minus betyder baglæns). Soldøgnet er 116,75 døgn: 1 / (1/243,0 + 1/224,7). I NASA\'s tabel står der også ca. 243,7, men det er forholdet til Jordens døgn set mod stjernerne, ikke et antal døgn.</p>'
    + '<p><b>Aksen</b> hælder 177,36°. Man kan også sige, at den hælder 2,64° og drejer baglæns. Venus\' nordpol peger mod rektascension 272,76° og deklination 67,16°.</p>'
    + '<p><b>Solens retning</b> og hvor langt Venus har drejet, regnes for dagens dato ud fra banen og den internationale astronomiske unions (IAU) formel for drejningen. Det passer med NASA\'s JPL Horizons inden for ca. 0,01°.</p>'
    + '<p><b>Radius:</b> Kortene fra Magellan er lavet til en kugle med radius 6.051,0 km, og højderne er målt fra den. NASA skriver 6.051,8 km. Programmet bruger kortenes kugle.</p>',
  billeder: '<p>Radarkortet og højderne er fra Magellan (NASA/JPL), sat sammen af USGS (radaren ca. 2 km pr. pixel, højderne ca. 4,6 km pr. pixel).</p>',
  ærligt: '<p>Lige nu ser du Venus uden skyer og uden luft, som om radaren var et foto, tonet orange. Radaren ser ikke farver. Magellan nåede ikke hele Venus: Ca. 3 % mangler, mest omkring sydpolen, og hullerne er fyldt med et blødt gennemsnit af det, der er omkring. Højderne har kun ca. 4,6 km mellem punkterne. Tiden går meget hurtigere end i virkeligheden.</p>',
};

export const SIDER = {};
