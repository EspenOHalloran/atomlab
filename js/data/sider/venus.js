// Teksterne i højre panel ved Venus (siden i lag, U3 i docs/plan-ux.md). V1 og V2 i docs/plan-venus.md: den korte
// tekst, tre emner, "For nørder", billederne og "Ærligt talt", for Venus er halvfærdig. V3: gløden på natsiden og de
// fire steder under skyerne (SIDER). Resten (flybyen og de andre emner) kommer i V5 og faktatjekkes dér. Tallene er fra
// docs/fakta-solsystemet/del7-venus.md (NSSDC og JPL Horizons), docs/fable/E18-venus.md (gløden og stederne, VIRA) og
// vindene fra Akatsukis billeder (js/data/vinde-venus.js). Faktatjekket V3 står i del7-venus.md. Uden Three.js.

import { kontakt, tid, sted } from '../../sideknap.js';

const BJERGE = kontakt('Bjergene 10 gange højere');
const UV = kontakt('Ultraviolet (som Akatsuki)', 'Ultraviolet');
const HURTIG = tid('hurtig', '⏩ Hurtigere');
const GLØD = kontakt('Gløden på natsiden');
const UNDER = 'Under skyerne';
// Datoen ved et sted (venus.js: datoMedTid)
const KLOKKEN = '<p><b>Tiden:</b> Datoen er spolet frem eller tilbage, så det er formiddag her, og Solens skrå lys viser formen. På Venus står Solen op i vest, så om formiddagen står den mod vest. Skyerne er taget væk, som om luften var væk.</p>';
const RADAR = '<p><b>Farven:</b> Det er radarens billede, tonet orange som lyset dernede. Lyst betyder ru eller skrå jord, ikke en lys farve.</p>';

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
    {
      titel: 'Hvorfor er bjergene mørke om natten?', kontakt: 'Gløden på natsiden',
      tekst: '<p>Prøv ' + GLØD + '. Jorden på Venus er ca. 464 °C, både dag og nat. Alt varmt sender lys ud, mest infrarødt lys, som øjet ikke kan se. Jo varmere, jo mere. En lille smule slipper ud gennem luften og skyerne, og rumsonder har fotograferet det på natsiden. Om dagen drukner det i sollyset fra skyerne.</p>'
        + '<p>Men hvorfor er de høje bjerge mørke? Gæt, før du læser videre.</p>'
        + '<p>Luften bliver ca. 7,7 °C koldere for hver kilometer opad. På toppen af Maxwell Montes er der "kun" ca. 380 °C. Lidt køligere jord gløder meget mindre: Toppen gløder over ti gange svagere end sletterne. Skub til "' + UNDER + '", så bliver gløden skarp. Skyerne spreder lyset, så gennem dem er den udvisket.</p>',
    },
  ],
  nørd: '<p><b>To slags døgn:</b> NASA skriver drejningen som −5.832,6 timer (243,0 døgn, minus betyder baglæns). Soldøgnet er 116,75 døgn: 1 / (1/243,0 + 1/224,7). I NASA\'s tabel står der også ca. 243,7, men det er forholdet til Jordens døgn set mod stjernerne, ikke et antal døgn.</p>'
    + '<p><b>Aksen</b> hælder 177,36°. Man kan også sige, at den hælder 2,64° og drejer baglæns. Venus\' nordpol peger mod rektascension 272,76° og deklination 67,16°.</p>'
    + '<p><b>Solens retning</b> og hvor langt Venus har drejet, regnes for dagens dato ud fra banen og den internationale astronomiske unions (IAU) formel for drejningen. Det passer med NASA\'s JPL Horizons inden for ca. 0,01°.</p>'
    + '<p><b>Vindene</b> er målt i Akatsukis billeder fra 13.-19. august 2017: To billeder med to-tre timers mellemrum er lagt oven på hinanden for hver breddegrad og flyttet, til skyerne passer. Ved ækvator gav det ca. 103 m/s mod vest. Rumsonden Venus Express målte ca. 105 m/s fra ækvator til 45° syd. Tættere på polerne aftager vinden til 0.</p>'
    + '<p><b>Gløden</b> er regnet med Plancks lov ved bølgelængden 1,0 µm, et af de smalle "vinduer", hvor luften lukker lidt lys ud. Jorden stråler mest ved ca. 3,9 µm, men dér er luften helt tæt. Temperaturen falder ca. 7,7 °C pr. km (målingerne fra sonderne, samlet i VIRA: 464 °C ved middelhøjden). Ved 1 µm er sletterne derfor ca. 6 gange så lyse som toppen af Maat Mons og over 10 gange så lyse som toppen af Maxwell Montes. Rumsonden Parker Solar Probe fotograferede gløden i 2020 og 2021 i det dybeste røde lys, på grænsen til infrarødt. Venus Express og Akatsuki så den i infrarødt. Steder, der gløder mere, end højden kan forklare, er måske frisk lava.</p>'
    + '<p><b>Radius:</b> Kortene fra Magellan er lavet til en kugle med radius 6.051,0 km, og højderne er målt fra den. NASA skriver 6.051,8 km. Programmet bruger kortenes kugle.</p>',
  billeder: '<p>Skyerne i ultraviolet lys er 48 billeder fra den japanske rumsonde Akatsuki (ISAS/JAXA) fra 13.-19. august 2017, lagt sammen til ét kort. Radarkortet og højderne er fra Magellan (NASA/JPL), sat sammen af USGS (radaren ca. 2 km pr. pixel, højderne ca. 4,6 km pr. pixel). Ved Maat Mons og pandekagekuplerne ligger ekstra radarkort med ca. 225 m pr. pixel. Gløden er regnet ud fra højderne.</p>',
  ærligt: '<p><b>Skyerne:</b> Akatsuki kunne kun se den side, Solen lyser på. Kortet er derfor sat sammen af billeder fra knap seks dage, flyttet med vindene hen til samme tidspunkt (16. august 2017). Skyerne skifter form hele tiden, så det er et billede af mønstret, ikke ét foto. Over ca. 70° bredde blev skyerne set meget skråt, og dér er kortet glattet. I programmet glider skyerne med vindene, men de skifter ikke form, og en gang i døgnet starter mønstret blødt forfra. Ultraviolet lys kan ikke ses, så farven er valgt, og mønstret er gjort tydeligere, som på Akatsukis billeder. I almindeligt lys er mønstret gjort næsten usynligt.</p>'
    + '<p><b>Under skyerne</b> ser du Venus uden luft, som om radaren var et foto, tonet orange. Radaren ser ikke farver. Magellan nåede ikke hele Venus: Ca. 3 % mangler, mest omkring sydpolen, og hullerne er fyldt med et blødt gennemsnit af det, der er omkring. Højderne har kun ca. 4,6 km mellem punkterne. Tiden går meget hurtigere end i virkeligheden.</p>'
    + '<p><b>Gløden:</b> Farven er valgt, for næsten al gløden er infrarød, og lyset er skruet mange tusind gange op. Øjet ville ikke kunne se den. Jorden gløder også på dagsiden, men dér drukner det i sollyset. Gennem skyerne er gløden sløret ca. 100 km, sådan som skyerne spreder lyset. På rigtige billeder giver tykke og tynde skyer også pletter, og kanten lyser af ilt højt oppe. Det er ikke med.</p>',
};

// De fire steder under skyerne (V3, jeres svar på E18). Tallene: USGS' navneliste (bredden), Wikipedia (Maxwell
// Montes, Maat Mons, Venera 13), NASA PIA00215 (pandekagekuplerne), NSSDC (Venera 13) og VIRA (temperaturen).
export const SIDER = {
  maxwell: {
    tal: [['Højde', 'ca. 11 km'], ['Bredde', 'ca. 800 km'], ['På toppen', 'ca. 380 °C']],
    kort: 'Maxwell Montes er de højeste bjerge på Venus, ca. 11 km over middelhøjden. Bjergkæden ligger på højlandet Ishtar Terra langt mod nord. Det runde krater på østsiden hedder Cleopatra.',
    emner: [
      {
        titel: 'Hvorfor er toppen så lys på radaren?',
        tekst: '<p>Højt oppe på bjergene på Venus kaster jorden radarbølgerne usædvanligt stærkt tilbage, og på Maxwell Montes er næsten hele toppen lys. Måske ligger der et tyndt lag af metalforbindelser, som er fordampet nede i varmen og har sat sig deroppe, hvor det er lidt køligere. Man kalder det "metalsne". Hvad det er, ved man ikke sikkert.</p>',
      },
      {
        titel: 'Et køligere sted?', kontakt: 'Gløden på natsiden',
        tekst: '<p>Luften bliver ca. 7,7 °C koldere for hver kilometer opad. På toppen er der ca. 380 °C og ca. 45 gange Jordens lufttryk, omkring halvdelen af trykket nede på sletterne. Det er stadig varmt nok til at smelte bly. Fordi toppen er lidt køligere, gløder den mindre om natten. Prøv ' + GLØD + ' fra hele Venus.</p>',
      },
      {
        titel: 'Opkaldt efter en mand',
        tekst: '<p>Næsten alle navne på Venus er efter kvinder og gudinder. Maxwell Montes er en af tre undtagelser (de andre er Alpha Regio og Beta Regio). Bjergene er opkaldt efter fysikeren James Clerk Maxwell. Han forklarede, at lys er elektriske og magnetiske bølger, og det er den slags bølger, radaren bruger.</p>',
      },
    ],
    videre: [sted('venus', 'Hele Venus'), sted('maat', 'Maat Mons')],
    ærligt: KLOKKEN + RADAR + '<p><b>Højderne</b> har kun ca. 4,6 km mellem punkterne, så små toppe og kløfter er glattet ud. Prøv ' + BJERGE + ', så ser du formen tydeligere.</p>',
  },
  maat: {
    tal: [['Højde', 'ca. 8 km over middelhøjden'], ['Bredde', 'ca. 400 km']],
    kort: 'Maat Mons er den højeste vulkan på Venus. Den er en skjoldvulkan: bred og flad, bygget af mange lag lava. De lyse og mørke strømme omkring den er størknet lava, set med radar.',
    emner: [
      {
        titel: 'Er der stadig udbrud?',
        tekst: '<p>Måske. I 2023 sammenlignede to forskere Magellans billeder fra 1991. En åbning i vulkanens side havde skiftet form og var blevet ca. dobbelt så stor på kun otte måneder. Det ligner et udbrud, mens Magellan kiggede. Andre steder på Venus har man også fundet tegn på nye lavastrømme. Derfor tror mange, at Venus stadig har aktive vulkaner.</p>',
      },
      {
        titel: 'Hvorfor ser den så flad ud?', kontakt: 'Bjergene 10 gange højere',
        tekst: '<p>Vulkanen er mange gange bredere, end den er høj, så siderne skråner kun lidt. Prøv ' + BJERGE + '. NASA\'s kendte billede af Maat Mons er gjort 22,5 gange højere, så den ligner et spidst bjerg. Det er den ikke.</p>',
      },
    ],
    videre: [sted('venus', 'Hele Venus'), sted('kupler', 'Pandekagekuplerne')],
    billeder: '<p>Over Maat Mons ligger et ekstra radarkort fra Magellan med ca. 225 m pr. pixel (resten af Venus har ca. 2 km). Det dækker ca. 920 × 920 km. Højderne er stadig kun målt for hver 4,6 km, så du ser skarpere lavastrømme, men ikke skarpere bjerge.</p>',
    ærligt: KLOKKEN + RADAR,
  },
  kupler: {
    tal: [['Hver kuppel', 'ca. 25 km bred'], ['Højde', 'op til ca. 750 m'], ['Her', '7 kupler']],
    kort: 'Syv runde, flade bakker ligger på en række ved kanten af højlandet Alpha Regio. De ligner pandekager og kaldes pandekagekupler. Området hedder Seoritsu Farra.',
    emner: [
      {
        titel: 'Hvorfor løb lavaen ikke ud?',
        tekst: '<p>Gæt først: Almindelig lava løber ud og bliver til flade strømme. Hvorfor blev denne lava til høje, runde kager?</p>'
          + '<p>Man tror, at lavaen var meget tyk og sej. Den kom op af en åbning i den flade jord og bredte sig langsomt lige meget til alle sider, til den størknede. Hvilken slags lava det var, ved man ikke.</p>'
          + '<p>Revnerne på toppen opstod måske, fordi overfladen størknede først, og ny lava indefra så strakte den, til den revnede. Det er man ikke helt enige om.</p>',
      },
      {
        titel: 'Kan man se dem i højderne?',
        tekst: '<p>Nej. En kuppel er kun ca. 5 punkter bred i højdekortet, og 750 m er for lidt til at ses dér. Derfor kigger kameraet næsten lige ned på radarkortet, som her har ca. 225 m pr. pixel.</p>',
      },
    ],
    videre: [sted('venus', 'Hele Venus'), sted('maat', 'Maat Mons')],
    billeder: '<p>Over kuplerne ligger et ekstra radarkort fra Magellan med ca. 225 m pr. pixel. Det dækker ca. 460 × 460 km.</p>',
    ærligt: KLOKKEN + RADAR,
  },
  venera13: {
    tal: [['Landede', '1. marts 1982'], ['Holdt i', '127 minutter'], ['Temperatur', '457 °C'], ['Tryk', '89 gange Jordens']],
    kort: 'Her omkring landede den sovjetiske rumsonde Venera 13 i 1982 og tog farvebilleder af jorden omkring sig. Man har ikke fundet selve landeren på Magellans radarbilleder, så det præcise sted kendes ikke.',
    emner: [
      {
        titel: 'Hvordan kunne den holde?',
        tekst: '<p>Landeren var en tyk beholder med isolering inden i. Den var bygget til at holde i 32 minutter, men den holdt i mindst 127 minutter, før varmen og trykket stoppede den.</p>',
      },
      {
        titel: 'Hvilken farve har Venus dernede?',
        tekst: '<p>Venera 13\'s fotos er orange, fordi de tykke skyer og luften tager det meste af det blå lys. Selve stenene er nok mørkegrå som basalt, en slags størknet lava. Derfor er radarkortet i programmet tonet orange: Sådan er lyset dernede.</p>',
      },
    ],
    videre: [sted('venus', 'Hele Venus'), sted('maat', 'Maat Mons')],
    ærligt: KLOKKEN + RADAR + '<p><b>Landeren</b> er alt for lille til at ses på et kort med ca. 2 km pr. pixel.</p>',
  },
};
