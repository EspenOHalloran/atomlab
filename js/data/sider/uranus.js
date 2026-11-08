// Teksterne i højre panel ved Uranus (siden i lag, U3 i docs/plan-ux.md). UN1 i docs/plan-uranus-neptun.md: kun den
// korte tekst, billederne og "Ærligt talt". UN2: årene og ringene (faktatjekket i fakta-solsystemet/del6, "Faktatjek UN2").
// UN4: månerne (MÅNE_STOP, SMÅ_STOP og SIDER, faktatjekket i fakta-solsystemet/del6, "Faktatjek UN4"). Resten af
// emnerne kommer i UN5.
// Tallene er fra docs/fakta-solsystemet/del6-uranus-og-neptun.md (NSSDC og JPL Horizons). Uden Three.js.

import { kontakt, sted, tid } from '../../sideknap.js';

export const SIDE = {
  kort: 'Uranus er en isgigant langt ude i solsystemet. Den ligger på siden: Aksen hælder ca. 98 grader, så polerne skiftes til at pege mod Solen. Lige nu har nordpolen sol. Du ser Uranus i den rigtige form, og den drejer rundt én gang på 17 timer og 14 minutter.',
  emner: [
    {
      titel: 'Et år på Uranus varer 84 år',
      tekst: '<p>Uranus er 84 år om at komme én gang rundt om Solen. Fordi den ligger på siden, peger først den ene pol og så den anden mod Solen. Hver pol har sol i ca. 42 år og mørke i ca. 42 år.</p>'
        + '<p>Træk i skyderen <b>År</b>. Da Voyager 2 fløj forbi i januar 1986, pegede sydpolen næsten lige mod Solen. I 2007 stod Solen over ækvator, og omkring 2030 står den højest over nordpolen. Den pol, der har sommer, får en lys kappe af dis. Drej selv kameraet rundt, så du ser fra Solens side.</p>',
    },
    {
      titel: 'Har Uranus ringe?', kontakt: 'Infrarødt',
      tekst: '<p>Ja, 13. De blev opdaget i 1977, da Uranus gik foran en stjerne: Stjernen blinkede flere gange, før og efter planeten dækkede den. Ringene er smalle og mørke som kul. De kaster kun ca. 1,5 % af lyset tilbage, så forfra kan du næsten ikke se dem.</p>'
        + `<p>Slå ${kontakt('Infrarødt (som JWST)', 'Infrarødt')} til. Rumteleskopet James Webb har fotograferet Uranus i infrarødt lys. Dér er planeten mørk, fordi metan opsuger det lys, og ringene træder frem. Med ${kontakt('Modlys')} ses det fine støv mellem ringene.</p>`,
    },
    {
      titel: 'Hvad er en isgigant?',
      tekst: '<p>Uranus og Neptun kaldes isgiganter. Yderst er de luft af brint og helium med lidt metan, ligesom Jupiter og Saturn. Men inde i dem er der mest stoffer som vand, ammoniak og metan. Astronomer kalder dem "is", men inde i planeten er de varme, tætte væsker og slet ikke frosne.</p>',
    },
  ],
  nørd: '<p><b>"Baglæns" eller tippet?</b> NASA skriver, at aksen hælder 97,77°, og at Uranus drejer baglæns. Man kan også sige, at den drejer den almindelige vej, men er tippet 82° den anden vej. Det er to måder at sige det samme på.</p>'
    + '<p><b>Ringene</b> (NASA): Den største, epsilon-ringen, ligger ca. 51.000 km fra Uranus\' midte og er 20-96 km bred, fordi den ikke er helt rund. De andre er kun 1-11 km brede. De to yderste ringe, som Hubble fandt i 2003, er så tynde, at de ikke tegnes.</p>'
    + '<p><b>Solens retning</b> regnes ud fra Uranus\' bane og retningen af dens nordpol for dagens dato. Det passer med NASA\'s JPL Horizons inden for ca. 0,1°: Solen står ca. 74° over ækvator mod nord i november 2026.</p>',
  billeder: '<p>Kortet er lavet af Hubbles målinger fra 23.-24. oktober 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0). Den sydlige halvdel var i mørke, så den er lavet af Hubbles målinger fra 8.-9. november 2014.</p>',
  ærligt: '<p>Hubbles kort er grumsede (ca. 220 km pr. pixel), så kloden er bygget af lysstyrken og farven for hver breddegrad og et svagt lag med de største pletter. Farverne er regnet ud fra Hubbles målinger i tre farver og er tæt på det, øjet ville se. Uranus\' sydpol har ligget i mørke, siden Solen gik over ækvator i 2007, og Hubbles kort går ikke så langt mod syd. Derfor er nordpolens farver spejlet længst mod syd.</p>'
    + '<p>Herude får Uranus kun 1/369 af det sollys, vi får. Billedet er gjort lysere, som med en længere lukketid. Vindene blæser med den målte fart, men tæt på polerne er de ikke målt og står stille.</p>'
    + '<p>Hvornår kappen over polen kommer og går, er tegnet: Den er lys, når Solen står højt over polen. Ringene har den rigtige afstand, tæthed og mørke farve, men epsilon-ringen er tegnet rund. Støvet mellem ringene er tegnet og gjort lysere, så det kan ses i modlys. "Infrarødt" er falske farver, som på James Webbs billede.</p>',
};

// ---------- UN4: månerne ----------
// Underteksten ved et besøg (bjælkens linje, under ca. 160 tegn). Bredden er 2 gange NSSDC's radius.
export const MÅNE_STOP = {
  miranda: 'Den mindste af de fem store måner, kun ca. 470 km bred. Den har kæmpe kløfter og en af solsystemets højeste klipper.',
  ariel: 'Den lyseste af Uranus\' store måner. Den er fuld af lange kløfter, hvor skorpen af is er revnet.',
  umbriel: 'Den mørkeste af de store måner. Den lyse ring ved ækvator er krateret Wunda. Ingen ved, hvorfor det er så lyst.',
  // 2 · 788,9 = 1.578 km, Månen 3.475 km: 45 %
  titania: 'Den største måne om Uranus, ca. 1.580 km bred. Det er lidt under halvdelen af vores Månes bredde.',
  oberon: 'Den yderste af de fem store måner, ca. 583.500 km fra Uranus. Den er gammel og fuld af kratere.',
};
export const SMÅ_STOP = {
  titel: 'Små måner, der kan støde sammen',
  tekst: 'Cressida og Desdemona kredser kun ca. 900 km fra hinanden. Beregninger viser, at de nok støder sammen inden for 100 millioner år.',
};
export const MÅNE_NU = '<p><b>Lige nu:</b> Voyager 2 så kun den sydlige halvdel i 1986. Den glatte, grå del er aldrig fotograferet tæt på. Træk skyderen <b>År</b> til 1986, så har den fotograferede side sol.</p>';
// Overhalingen: 1 / (1/0,46357 − 1/0,47365) = 21,8 døgn
export const SMÅ_NU = `<p><b>Lige nu:</b> Cressida kredser lidt hurtigere end Desdemona og indhenter den ca. hver 22. døgn. ${tid('hurtig', 'Se det med ⏩')} De små måner er tegnet meget større og lysere, end de er.</p>`;

const VOYAGER_KORT = '<p>Kortet er lavet af Caltech/JPL/USGS af billeder fra Voyager 2 (januar 1986). Det er hentet fra Wikimedia Commons.</p>';
const MÅNE_ÆRLIGT = '<p>Den nordlige halvdel er en jævn, grå flade, for den er aldrig fotograferet tæt på. Månen står stille, mens du besøger den, og vender samme side mod Uranus. Pladserne i banerne er tegnet og ikke dem for i dag.</p>';
const måne = (bredde, omgang, afstand, opdaget, kort, ekstra = {}) => ({
  tal: [['Bredde', bredde], ['En omgang', omgang], ['Fra Uranus', afstand], ['Opdaget', opdaget]],
  kort, billeder: VOYAGER_KORT, ærligt: MÅNE_ÆRLIGT, ...ekstra,
});

export const SIDER = {
  maaner: {
    tal: [['Kendte måner', '29 (august 2026)'], ['De fem store', 'fundet 1787-1948'], ['Oberon', 'ca. 583.500 km ude'], ['Miranda', 'en omgang på ca. 34 timer']],
    kort: 'Her er Uranus\' fem store måner i deres baner, i den rigtige afstand. De kredser i Uranus\' ækvatorplan, altså på tværs af Uranus\' bane. Set fra Solen ligner de en skydeskive. De 24 små måner er ikke med, kun fire af dem.',
    emner: [
      {
        titel: 'Hvor kommer navnene fra?',
        tekst: '<p>Uranus\' måner er opkaldt efter figurer fra William Shakespeares skuespil og Alexander Popes digt "The Rape of the Lock". Oberon og Titania er kongen og dronningen af elverne i "En skærsommernatsdrøm". Miranda er en pige i "Stormen", og Ariel og Umbriel er ånder i Popes digt.</p>',
      },
      {
        titel: 'Hvorfor er halvdelen grå?',
        tekst: '<p>Voyager 2 er den eneste rumsonde, der har været ved Uranus. Da den fløj forbi i januar 1986, stod Solen over månernes sydpoler, så den nordlige halvdel lå i mørke. Derfor er kun den sydlige halvdel fotograferet tæt på. Den anden halvdel er her en jævn, grå flade.</p>',
      },
    ],
    videre: [sted('miranda', 'Miranda'), sted('ariel', 'Ariel'), sted('umbriel', 'Umbriel'), sted('titania', 'Titania'), sted('oberon', 'Oberon'), sted('smaa', 'Små måner')],
    nørd: '<p>Omløbstiderne er 1,41, 2,52, 4,14, 8,71 og 13,46 døgn (NASA). Mirandas bane hælder 4,3° i forhold til Uranus\' ækvator, de andres under 0,2°. Alle fem vender samme side mod Uranus.</p>',
    billeder: VOYAGER_KORT,
    ærligt: '<p>Langt væk er månerne tegnet større, ellers kunne de ikke ses. Banerne har den rigtige størrelse. Pladserne i banerne er tegnet og ikke dem for i dag. Uret går meget hurtigere end i virkeligheden.</p>',
  },
  miranda: måne('ca. 470 km', 'ca. 34 timer', 'ca. 129.900 km', '1948 (Gerard Kuiper)', 'Miranda er den inderste og mindste af de fem store måner. Overfladen ligner et lappetæppe af kløfter, rygge og glatte sletter.', {
    nørd: '<p>Skrænten Verona Rupes er en af de højeste klipper i solsystemet. De første beregninger gav 5-10 km, senere skøn ca. 20 km. Fra Miranda fylder Uranus ca. 22° af himlen, over 40 gange så bredt som Månen set fra Jorden.</p>',
  }),
  ariel: måne('ca. 1.160 km', 'ca. 2½ døgn', 'ca. 190.900 km', '1851 (William Lassell)', 'Ariel er den lyseste af Uranus\' store måner. Den har lange kløfter og færre store kratere end de andre store måner.'),
  umbriel: måne('ca. 1.170 km', 'ca. 4 døgn', 'ca. 266.000 km', '1851 (William Lassell)', 'Umbriel er den mørkeste af de store måner og har næsten de samme mørke farver over det hele.', {
    nørd: '<p>Krateret Wunda er 131 km bredt og ligger tæt på Umbriels ækvator. På bunden er der en ring af lyst stof, mindst 10 km bred. Ingen ved, hvorfor den er så lys.</p>',
  }),
  titania: måne('ca. 1.580 km', 'ca. 8,7 døgn', 'ca. 436.300 km', '1787 (William Herschel)', 'Titania er den største af Uranus\' måner.'),
  oberon: måne('ca. 1.520 km', 'ca. 13½ døgn', 'ca. 583.500 km', '1787 (William Herschel)', 'Oberon er den yderste af de fem store måner og den næststørste.'),
  smaa: {
    tal: [['Cressida', 'ca. 80 km bred'], ['Desdemona', 'ca. 70 km bred'], ['Mellem banerne', 'ca. 900 km'], ['Indhenter', 'ca. hver 22. døgn']],
    kort: 'Tæt på ringene kredser 14 små måner. To par af dem kredser så tæt på hinanden, at de en dag nok støder sammen: Cressida og Desdemona, og Cupid og Belinda.',
    emner: [
      {
        titel: 'Støder Cupid og Belinda sammen?',
        tekst: '<p>Det er ikke sikkert. En beregning fra 2012 gav et sammenstød inden for ca. 100.000 år. En ny beregning fra 2022 fandt, at Belinda og den lille måne Perdita holder takt, så de kan holde i 50-100 millioner år.</p>',
      },
      {
        titel: 'Er det sket før?',
        tekst: '<p>Måske. Forskerne foreslår, at de små måner er samlet igen af stumperne fra tidligere sammenstød. Det er en idé, ikke bevist.</p>',
      },
    ],
    videre: [sted('maaner', 'De store måner')],
    nørd: '<p>Takten mellem Belinda og Perdita kaldes en resonans 44 : 43: Belinda går 44 omgange, mens Perdita går 43. Kilde: Ćuk m.fl. 2022, "Cupid Is Not Doomed Yet".</p>',
    billeder: '<p>Der findes ingen kort over de små måner. Voyager 2 så dem kun som små prikker.</p>',
    ærligt: '<p>Formen er tegnet. Månerne er tegnet meget større og fem gange lysere, end de er, ellers kunne de ikke ses. I virkeligheden er de mørke som ringene. Pladserne i banerne er tegnet.</p>',
  },
};
