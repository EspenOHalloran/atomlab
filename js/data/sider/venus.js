// Teksterne i højre panel ved Venus (siden i lag, U3 i docs/plan-ux.md). V1 og V2 i docs/plan-venus.md: den korte
// tekst, tre emner, "For nørder", billederne og "Ærligt talt", for Venus er halvfærdig. Resten (stederne, flybyen og de
// andre emner) kommer i V5 og faktatjekkes dér. Tallene er fra docs/fakta-solsystemet/del7-venus.md (NSSDC og JPL
// Horizons) og vindene fra Akatsukis billeder (js/data/vinde-venus.js). Uden Three.js.

import { kontakt, tid } from '../../sideknap.js';

const BJERGE = kontakt('Bjergene 10 gange højere');
const UV = kontakt('Ultraviolet (som Akatsuki)', 'Ultraviolet');
const HURTIG = tid('hurtig', '⏩ Hurtigere');

export const SIDE = {
  kort: 'Venus er næsten lige så stor som Jorden, men den er dækket af tykke skyer af svovlsyre. I almindeligt lys er de lyst gullig hvide og næsten uden mønster. Skyerne suser rundt om Venus på ca. 4 jorddøgn, mens Venus selv er 243 jorddøgn om at dreje én gang. Skub til "Under skyerne" for at se jorden, sådan som rumsonden Magellan kortlagde den med radar.',
  emner: [
    {
      titel: 'Skyer, der løber om kap',
      tekst: '<p>Toppen af skyerne, ca. 70 km over jorden, blæser rundt om Venus med ca. 100 meter i sekundet (ca. 360 km/t). Det er hurtigere end vinden i de fleste orkaner. De kører samme vej, som Venus drejer, altså baglæns, men ca. 55 gange hurtigere. Man kalder det superrotation (luften drejer hurtigere end planeten). Hvorfor luften kan blive ved med det, er ikke helt forstået.</p>'
        + '<p>I almindeligt lys kan man næsten ikke se mønstret. Men i ultraviolet lys (lys med kortere bølgelængde, end øjet kan se) ses mørke striber og et stort "Y". Et stof i skyerne, som man ikke kender, opsuger ultraviolet lys. Prøv ' + UV + ' og ' + HURTIG + '.</p>',
    },
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
    + '<p><b>Vindene</b> er målt i Akatsukis billeder fra 13.-19. august 2017: To billeder med to-tre timers mellemrum er lagt oven på hinanden for hver breddegrad og flyttet, til skyerne passer. Ved ækvator gav det ca. 103 m/s mod vest. Rumsonden Venus Express målte ca. 105 m/s fra ækvator til 45° syd. Tættere på polerne aftager vinden til 0.</p>'
    + '<p><b>Radius:</b> Kortene fra Magellan er lavet til en kugle med radius 6.051,0 km, og højderne er målt fra den. NASA skriver 6.051,8 km. Programmet bruger kortenes kugle.</p>',
  billeder: '<p>Skyerne i ultraviolet lys er 48 billeder fra den japanske rumsonde Akatsuki (ISAS/JAXA) fra 13.-19. august 2017, lagt sammen til ét kort. Radarkortet og højderne er fra Magellan (NASA/JPL), sat sammen af USGS (radaren ca. 2 km pr. pixel, højderne ca. 4,6 km pr. pixel).</p>',
  ærligt: '<p><b>Skyerne:</b> Akatsuki kunne kun se den side, Solen lyser på. Kortet er derfor sat sammen af billeder fra knap seks dage, flyttet med vindene hen til samme tidspunkt (16. august 2017). Skyerne skifter form hele tiden, så det er et billede af mønstret, ikke ét foto. Over ca. 70° bredde blev skyerne set meget skråt, og dér er kortet glattet. I programmet glider skyerne med vindene, men de skifter ikke form, og en gang i døgnet starter mønstret blødt forfra. Ultraviolet lys kan ikke ses, så farven er valgt, og mønstret er gjort tydeligere, som på Akatsukis billeder. I almindeligt lys er mønstret gjort næsten usynligt.</p>'
    + '<p><b>Under skyerne</b> ser du Venus uden luft, som om radaren var et foto, tonet orange. Radaren ser ikke farver. Magellan nåede ikke hele Venus: Ca. 3 % mangler, mest omkring sydpolen, og hullerne er fyldt med et blødt gennemsnit af det, der er omkring. Højderne har kun ca. 4,6 km mellem punkterne. Tiden går meget hurtigere end i virkeligheden.</p>',
};

export const SIDER = {};
