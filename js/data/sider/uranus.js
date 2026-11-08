// Teksterne i højre panel ved Uranus (siden i lag, U3 i docs/plan-ux.md). UN1 i docs/plan-uranus-neptun.md: kun den
// korte tekst, billederne og "Ærligt talt". UN2: årene og ringene (faktatjekket i fakta-solsystemet/del6, "Faktatjek UN2").
// UN4: månerne (MÅNE_STOP, SMÅ_STOP og SIDER, faktatjekket i fakta-solsystemet/del6, "Faktatjek UN4"). UN5: stederne
// (Nordpolen og Ringene), flybyen (TUR) og resten af emnerne (faktatjekket i fakta-solsystemet/del6, "Faktatjek UN5").
// Tallene er fra docs/fakta-solsystemet/del6-uranus-og-neptun.md (NSSDC og JPL Horizons). Uden Three.js.

import { kontakt, sted, tid } from '../../sideknap.js';

const IR = kontakt('Infrarødt (som JWST)', 'Infrarødt');

export const SIDE = {
  kort: 'Uranus er en isgigant langt ude i solsystemet. Den ligger på siden: Aksen hælder ca. 98 grader, så polerne skiftes til at pege mod Solen. Lige nu har nordpolen sol. Du ser Uranus i den rigtige form, og den drejer rundt én gang på 17 timer og 14 minutter.',
  emner: [
    {
      titel: 'Et år på Uranus varer 84 år',
      tekst: '<p>Uranus er 84 år om at komme én gang rundt om Solen. Fordi den ligger på siden, peger først den ene pol og så den anden mod Solen. Hver pol har sol i ca. 42 år og mørke i ca. 42 år.</p>'
        + '<p>Træk i skyderen <b>År</b>. Da Voyager 2 fløj forbi i januar 1986, pegede sydpolen næsten lige mod Solen. I 2007 stod Solen over ækvator, og omkring 2030 står den højest over nordpolen. Den pol, der har sommer, får en lys kappe af dis. Drej selv kameraet rundt, så du ser fra Solens side.</p>',
      hvorfor: ['uranusSol'],
    },
    {
      titel: 'Hvorfor ligger Uranus på siden?',
      tekst: '<p>Det ved ingen sikkert. Den mest udbredte forklaring er, at Uranus for længe siden blev ramt af noget meget stort, måske på størrelse med Jorden, så den væltede. Det er ikke bevist. Ringene og månerne kredser om Uranus\' ækvator, så de ligger også på siden.</p>',
    },
    {
      titel: 'Hvad er en isgigant?',
      tekst: '<p>Uranus og Neptun kaldes isgiganter. Yderst er de luft af brint og helium med lidt metan, ligesom Jupiter og Saturn. Men inde i dem er der mest stoffer som vand, ammoniak og metan. Astronomer kalder dem "is", men inde i planeten er de varme, tætte væsker og slet ikke frosne.</p>',
    },
    {
      titel: 'Hvorfor er Uranus blå?',
      tekst: '<p>Luften har lidt metan, og metan opsuger rødt lys. Det sollys, Uranus kaster tilbage, mangler derfor noget af det røde, så planeten ser lyst grønlig blå ud. Neptun har næsten samme farve. Uranus er lidt blegere, fordi der er et tykkere lag dis i dens rolige luft.</p>',
    },
    {
      titel: 'Hvordan blev Uranus opdaget?',
      tekst: '<p>William Herschel så den med en kikkert, han selv havde bygget, den 13. marts 1781. Først troede han, at det var en komet. Uranus var den første planet, man fandt med en kikkert. Merkur, Venus, Mars, Jupiter og Saturn har man kendt siden oldtiden.</p>'
        + '<p>Herschel ville kalde den "Georgs stjerne" efter den engelske konge, Georg 3. Men navnet Uranus, efter himlens gud i de gamle græske sagn, blev det, alle brugte.</p>',
    },
  ],
  videre: [sted('nordpol', 'Nordpolen'), sted('ringe', 'Ringene'), sted('maaner', 'Månerne')],
  nørd: '<p><b>"Baglæns" eller tippet?</b> NASA skriver, at aksen hælder 97,77°, og at Uranus drejer baglæns. Man kan også sige, at den drejer den almindelige vej, men er tippet 82° den anden vej. Det er to måder at sige det samme på.</p>'
    + '<p><b>Solens retning</b> regnes ud fra Uranus\' bane og retningen af dens nordpol for dagens dato. Det passer med NASA\'s JPL Horizons inden for ca. 0,1°: Solen står ca. 74° over ækvator mod nord i november 2026. Bredden er planetografisk: vinklen mellem lodret og ækvators plan. På en fladtrykt planet er den lidt større end vinklen fra midten.</p>'
    + '<p><b>Vindene</b> er Sromovsky og Frys formel fra 2005: u = 27,46 + 36,57 cos φ − 175,49 cos 3φ m/s med drejningen. Ved ækvator blæser det ca. 110 m/s mod drejningen, og omkring 60° bredde ca. 220 m/s med den.</p>'
    + '<p><b>Magnetfeltet</b> (NASA) hælder ca. 59° i forhold til aksen, og dets midte ligger ca. en tredjedel af radius væk fra planetens midte. Neptuns er også skævt.</p>',
  billeder: '<p>Kortet er lavet af Hubbles målinger fra 23.-24. oktober 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0). Den sydlige halvdel var i mørke, så den er lavet af Hubbles målinger fra 8.-9. november 2014.</p>',
  ærligt: '<p>Hubbles kort er grumsede (ca. 220 km pr. pixel), så kloden er bygget af lysstyrken og farven for hver breddegrad og et svagt lag med de største pletter. Farverne er regnet ud fra Hubbles målinger i tre farver og er tæt på det, øjet ville se. Uranus\' sydpol har ligget i mørke, siden Solen gik over ækvator i 2007, og Hubbles kort går ikke så langt mod syd. Derfor er nordpolens farver spejlet længst mod syd.</p>'
    + '<p>Herude får Uranus kun 1/369 af det sollys, vi får. Billedet er gjort lysere, som med en længere lukketid. Vindene blæser med den målte fart, men tæt på polerne er de ikke målt og står stille.</p>'
    + '<p>Hvornår kappen over polen kommer og går, er tegnet: Den er lys, når Solen står højt over polen.</p>',
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

const VOYAGER_KORT = '<p>Kortet er lavet af Caltech/JPL/USGS af billeder fra Voyager 2 (januar 1986). Det er hentet fra NASA\'s samling af 3D-modeller og kort (NASA 3D Resources).</p>';
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

// ---------- UN5: stederne og flybyen ----------
// Stederne i træet (gruppen "Steder") og underteksten, når man besøger dem (bjælkens linje, under ca. 160 tegn)
export const STEDER = [
  { id: 'nordpol', navn: 'Nordpolen', undertitel: 'Kappen af dis' },
  { id: 'ringe', navn: 'Ringene', undertitel: 'Mørke som kul' },
];
const RINGE_NU = `<p><b>Lige nu:</b> Forfra kan ringene næsten ikke ses. Slå ${IR} til, så træder de frem.</p>`;
export const STED_STOP = {
  nordpol: {
    titel: 'Nordpolen',
    tekst: 'Over nordpolen ligger en lys kappe af dis. Den kommer frem, når polen har sommer, og Solen står højt over den.',
    nu: '<p><b>Lige nu:</b> Træk skyderen <b>År</b>, og se kappen komme og gå med årstiden. I 1986 havde nordpolen mørke.</p>',
  },
  ringe: {
    titel: 'De mørke ringe',
    // Opdaget 10. marts 1977 (Elliot m.fl.), da stjernen blinkede før og efter Uranus (fakta-solsystemet/del6, afsnit 6)
    tekst: 'Ringene er mørke som kul. De blev opdaget i 1977, da Uranus gik foran en stjerne, som blinkede før og efter planeten.',
    nu: RINGE_NU,
  },
};
// Flybyen (jeres svar før UN5, plan-uranus-neptun.md): 5 stop. Stop 2 kører skyderen "År" tilbage til januar 1986, og
// resten af turen er i 1986, som Voyager 2 så det. id: stedet (dets side står i panelet). nu: "Lige nu" ved stoppet.
// år: skyderen "År" ('nu', 'tilbage' fra i dag til 1986 eller 'voyager' i januar 1986). kamera: 'side' er set fra Solens
// retning ved jævndøgn i 2007, så begge poler ses, og man ser Solen vandre fra nordpolen til sydpolen.
export const TUR = [
  {
    id: 'maaner', titel: 'Uranus og månerne', knap: 'månerne', år: 'nu',
    tekst: 'Uranus ligger på siden. Ringene og månerne kredser om den på tværs af banen, så de ligner en skydeskive.',
    nu: '<p><b>Lige nu:</b> Langt væk er månerne tegnet større, ellers kunne de ikke ses. Banerne har den rigtige størrelse.</p>',
  },
  {
    id: 'uranus', titel: 'Et år er 84 år', knap: 'året', år: 'tilbage', kamera: 'side',
    tekst: 'Hver pol har sol i ca. 42 år og mørke i ca. 42 år. Se årene gå tilbage til 1986, da Voyager 2 kom, og sydpolen pegede mod Solen.',
    nu: '<p><b>Lige nu:</b> Skyderen <b>År</b> kører tilbage til 1986. Uranus\' akse peger hele tiden samme vej i rummet, men Solen står et nyt sted, efterhånden som Uranus kommer rundt i sin bane.</p>',
  },
  {
    id: 'miranda', titel: 'Miranda i 1986', knap: 'Miranda', år: 'voyager',
    tekst: 'Sådan så Voyager 2 Miranda i januar 1986: kæmpe kløfter og en af solsystemets højeste klipper. Den nordlige halvdel lå i mørke.',
    nu: '<p><b>Lige nu:</b> Det er januar 1986, og Solen står næsten over Mirandas sydpol, som da Voyager 2 kom. Den glatte, grå del er aldrig fotograferet tæt på.</p>',
  },
  { id: 'ringe', ...STED_STOP.ringe, knap: 'ringene', år: 'voyager' },
  {
    id: 'skygge', titel: 'I Uranus\' skygge', knap: 'skyggen', år: 'voyager',
    tekst: 'Bag Uranus lyser det fine støv mellem ringene op i modlys. Forfra kan det næsten ikke ses. Voyager 2 så det sådan i 1986.',
    nu: '<p><b>Lige nu:</b> Solen står bag Uranus. Støvet er tegnet lysere, end det er.</p>',
  },
];
export const TUR_SLUT = '<p><b>Turen er slut.</b> Skyderen <b>År</b> står på 1986. Træk den for at se Uranus i et andet år, tryk på en måne, eller vælg et sted i listen.</p>';

const RINGE_SIDE = { // stop 5 på flybyen (I Uranus' skygge) viser Uranus' egen side, for den står ikke i træet
  tal: [['Ringe', '13'], ['Opdaget', '1977'], ['Den største', 'epsilon, 20-96 km bred'], ['Fra midten', 'ca. 38.000-51.000 km']],
  kort: 'Uranus har 13 smalle ringe, som kredser om ækvator. De er mørke som kul, så forfra kan du næsten ikke se dem.',
  emner: [
    {
      titel: 'Hvordan blev ringene fundet?', kontakt: 'Infrarødt',
      // Bond-albedoen er højst ca. 2 % (Wikipedia "Rings of Uranus"). Den geometriske albedo (NSSDC 0,015) er ikke
      // andelen af lyset (fælden fra UN4).
      tekst: '<p>De blev opdaget i 1977, da Uranus gik foran en stjerne: Stjernen blinkede flere gange, før og efter planeten dækkede den. Ringene er smalle og mørke som kul. De kaster højst ca. 2 % af lyset tilbage, så forfra kan du næsten ikke se dem.</p>'
        + `<p>Slå ${IR} til. Rumteleskopet James Webb har fotograferet Uranus i infrarødt lys. Dér er planeten mørk, fordi metan opsuger det lys, og ringene træder frem. Med ${kontakt('Modlys')} ses det fine støv mellem ringene.</p>`,
    },
  ],
  videre: [sted('nordpol', 'Nordpolen'), sted('maaner', 'Månerne')],
  nørd: '<p><b>Ringene</b> (NASA): Den største, epsilon-ringen, ligger ca. 51.000 km fra Uranus\' midte og er 20-96 km bred, fordi den ikke er helt rund. De andre er kun 1-11 km brede. De to yderste ringe, som Hubble fandt i 2003, er så tynde, at de ikke tegnes.</p>',
  billeder: '<p>Ringene er tegnet efter NASA\'s tal for afstand, bredde og tæthed. "Infrarødt" er lavet efter Webbs billeder (NASA, ESA, CSA, STScI).</p>',
  ærligt: '<p>Ringene har den rigtige afstand, tæthed og mørke farve, men epsilon-ringen er tegnet rund. Støvet mellem ringene er tegnet og gjort lysere, så det kan ses i modlys. "Infrarødt" er falske farver, som på James Webbs billede.</p>',
};
SIDER.nordpol = {
  tal: [['Sol ved polen', 'ca. 42 år ad gangen'], ['Mørke ved polen', 'ca. 42 år ad gangen'], ['Solen højest', 'omkring 2030'], ['Voyager 2', 'så sydpolen i 1986']],
  kort: 'Over Uranus\' nordpol ligger en lys kappe af dis. Den kommer frem, når polen har sommer, og Solen står højt over den. Lige nu har nordpolen sol.',
  emner: [
    {
      titel: 'Kommer kappen og går?',
      tekst: '<p>Ja. Da Voyager 2 kom i 1986, havde sydpolen sommer, og den havde en lys kappe. I 1990\'erne, da Solen flyttede sig væk fra sydpolen, blev kappen mørkere. Nu har nordpolen sommer, og Hubbles og Webbs billeder viser en lys kappe dér.</p>',
    },
  ],
  videre: [sted('ringe', 'Ringene'), sted('maaner', 'Månerne')],
  billeder: '<p>Kappen er lavet af Hubbles kort fra 23.-24. oktober 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0).</p>',
  ærligt: '<p>Hvornår kappen kommer og går, er tegnet: Den er lys, når Solen står højt over polen, og væk, når Solen står lavt. Tæt på polen er vindene ikke målt og står stille.</p>',
};
SIDER.ringe = RINGE_SIDE;
