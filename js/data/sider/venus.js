// Teksterne i højre panel ved Venus (siden i lag, U3 i docs/plan-ux.md). V1 og V2 i docs/plan-venus.md: den korte
// tekst, emnerne, "Vil du vide mere?", billederne og "Ærligt talt". V3: gløden på natsiden og de fire steder under skyerne
// (SIDER). V5: flybyen (TUR), turen ned til Venera 13 (SIDER.ned), "Hvilken planet er varmest?" og de nye "Hvorfor?"-kort
// (js/data/hvorfor.js). Tallene er fra docs/fakta-solsystemet/del7-venus.md (NSSDC og JPL Horizons),
// docs/fable/E18-venus.md (gløden, stederne og VIRA) og vindene fra Akatsukis billeder (js/data/vinde-venus.js).
// Faktatjekket V3 og V5 står i del7-venus.md, afsnit 11 og 12. Uden Three.js.

import { kontakt, tid, sted } from '../../sideknap.js';

const BJERGE = kontakt('Bjergene 10 gange højere');
const UV = kontakt('Ultraviolet (som Akatsuki)', 'Ultraviolet');
const HURTIG = tid('hurtig', '⏩ Hurtigere');
const GLØD = kontakt('Gløden på natsiden');
const UNDER = 'Under skyerne';
// Venera 13's farvefoto (billeder/solsystem/lav_venera.py), vist fladt på siden (faenomenskaerm.js: foto)
const FOTO_SIDE = {
  src: 'billeder/solsystem/venera13-foto.jpg',
  alt: 'Venera 13\'s farvefoto af jorden på Venus: flade, lyse sten og mørk jord, og forneden en del af landeren',
  tekst: 'Venera 13 tog fotoet på jorden 1. marts 1982. Forneden ses en del af landeren, og den lyse, buede ting på jorden er et af kameraets dæksler (USSR/NASA).',
};
// Datoen ved et sted (venus.js: datoMedTid)
const KLOKKEN = '<p><b>Tiden:</b> Datoen er spolet frem eller tilbage, så det er formiddag her, og Solens skrå lys viser formen. På Venus står Solen op i vest, så om formiddagen står den mod vest. Skyerne er taget væk, som om luften var væk.</p>';
const RADAR = '<p><b>Farven:</b> Det er radarens billede, tonet orange som lyset dernede. Lyst betyder ru eller skrå jord, ikke en lys farve.</p>';

export const SIDE = {
  // Kernesætningen (Fables tjek E18, afsnit 6): "Venus er lige så stor som Jorden, men den tykke luft holder så godt på
  // varmen, at jorden er 464 °C dag og nat. Den er så varm, at den gløder i mørket."
  kort: 'Venus er næsten lige så stor som Jorden, men den tykke luft holder så godt på varmen, at jorden er ca. 464 °C, både dag og nat. Tykke skyer af svovlsyre skjuler den. Skub til "Under skyerne" for at se jorden, sådan som rumsonden Magellan kortlagde den med radar.',
  emner: [
    {
      // NSSDC: 464 °C, 92 bar, 96,5 % CO₂, sort legeme 226,6 K (uden drivhuseffekt). Wikipedia ("Atmosphere of
      // Venus"): 92 bar svarer til ca. 900 m under havet, bly smelter ved 327 °C. Solvarmen: (1 − 0,77) · 2.601 ≈ 600 W/m²
      // mod (1 − 0,306) · 1.361 ≈ 945 W/m² for Jorden (NSSDC, regnet)
      titel: 'Hvilken planet er varmest?', hvorfor: ['venusMerkur'],
      tekst: '<p>Gæt først: Merkur er tættest på Solen. Er den varmere end Venus?</p>'
        + '<p>Nej. Venus er den varmeste planet. Jorden er ca. 464 °C, både dag og nat, varmt nok til at smelte bly. Luften er næsten kun kuldioxid (CO₂), og den er så tyk, at trykket ved jorden er ca. 92 gange Jordens. Det er som ca. 900 m under havet.</p>'
        + '<p>Kuldioxid lukker sollyset ind, men holder på varmen, som jorden stråler ud. Det kaldes drivhuseffekten. Skyerne kaster faktisk så meget sollys tilbage, at Venus optager mindre solvarme end Jorden. Uden den tykke luft ville Venus være ca. −47 °C. Hele varmen skyldes luften.</p>',
    },
    {
      titel: 'Skyer, der løber om kap', hvorfor: ['venusLiv'],
      tekst: '<p>Toppen af skyerne, ca. 70 km over jorden, blæser rundt om Venus med ca. 100 meter i sekundet (ca. 360 km/t). Det er hurtigere end vinden i de fleste orkaner. De kører samme vej, som Venus drejer, altså baglæns, men ca. 60 gange hurtigere. Man kalder det superrotation (luften drejer hurtigere end planeten). Hvorfor luften kan blive ved med det, er ikke helt forstået.</p>'
        + '<p>I almindeligt lys kan man næsten ikke se mønstret. Men i ultraviolet lys (lys med kortere bølgelængde, end øjet kan se) ses mørke striber og et stort "Y". Et stof i skyerne, som man ikke kender, opsuger ultraviolet lys. Prøv ' + UV + ' og ' + HURTIG + '.</p>'
        + '<p>Skyerne er bittesmå dråber af svovlsyre. Dråber, der falder, fordamper i varmen længere nede, før de når jorden.</p>',
    },
    {
      titel: 'Et døgn, der er længere end et år?', hvorfor: ['venusBaglaens'],
      tekst: '<p>Venus er 225 jorddøgn om at komme én gang rundt om Solen. Men den er 243 jorddøgn om at dreje én gang om sig selv, set mod stjernerne. Så den omgang varer længere end et år.</p>'
        + '<p>Venus drejer baglæns, den modsatte vej af Jorden. Derfor står Solen op i vest og går ned i øst. Fra én solopgang til den næste går der ca. 117 jorddøgn, for mens Venus drejer den ene vej, går den den anden vej om Solen. Tryk ' + HURTIG + ', og se dagsiden glide hen over kloden.</p>',
    },
    {
      titel: 'Hvordan kan man se gennem skyerne?',
      tekst: '<p>Med radar. Magellan sendte radiobølger ned gennem skyerne og målte, hvad der kom tilbage. Ru eller skrå jord kaster meget tilbage og bliver lys på kortet. Glat jord, fx flade strømme af størknet lava, bliver mørk. Radaren ser altså ikke farver. Programmet har tonet kortet orange, for sådan er lyset nede under skyerne.</p>'
        + '<p>Magellan målte også højderne. Det højeste bjerg, Maxwell Montes, er ca. 11 km højt. Prøv ' + BJERGE + '.</p>',
    },
    {
      // Står først, når "Gløden på natsiden" bruges (højst fire spørgsmål fremme, Retningen)
      titel: 'Hvorfor er bjergene mørke om natten?', kontakt: 'Gløden på natsiden', gemt: true,
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
    + '<p><b>Ingen måner:</b> Venus har ingen måner. Asteroiden Zoozve følger Venus på vejen om Solen og kaldes en kvasimåne (en "næsten-måne"), men den kredser om Solen, ikke om Venus.</p>'
    + '<p><b>De næste sonder:</b> NASA og ESA planlægger tre nye sonder til Venus i 2030\'erne: DAVINCI skal dale ned gennem luften og måle den, og VERITAS og EnVision skal kortlægge jorden med bedre radar end Magellans.</p>'
    + '<p><b>Radius:</b> Kortene fra Magellan er lavet til en kugle med radius 6.051,0 km, og højderne er målt fra den. NASA skriver 6.051,8 km. Programmet bruger kortenes kugle.</p>',
  billeder: '<p>Skyerne i ultraviolet lys er 48 billeder fra den japanske rumsonde Akatsuki (ISAS/JAXA) fra 13.-19. august 2017, lagt sammen til ét kort. Radarkortet og højderne er fra Magellan (NASA/JPL), sat sammen af USGS (radaren ca. 2 km pr. pixel, højderne ca. 4,6 km pr. pixel). Ved Maat Mons og pandekagekuplerne ligger ekstra radarkort med ca. 225 m pr. pixel. Gløden er regnet ud fra højderne. Fotoet fra jorden er taget af den sovjetiske landingssonde Venera 13 i 1982 (USSR/NASA).</p>',
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
    // NSSDC's billedkatalog (VG00261/262): 170°, mørkeblåt, grønt og rødt filter, "On the ground in foreground is a
    // camera lens cover", "Part of the spacecraft is at the bottom of the image"
    foto: FOTO_SIDE,
    videre: [sted('ned', 'Ned gennem skyerne'), sted('venus', 'Hele Venus')],
    billeder: '<p>Farvefotoet er sat sammen af billeder taget med mørkeblåt, grønt og rødt filter. Det dækker 170° fra side til side. Kameraet kiggede skråt ned og svingede fra side til side, så horisonten står i billedets øverste hjørner (USSR/NASA, NSSDC).</p>',
    ærligt: KLOKKEN + RADAR + '<p><b>Landeren</b> er alt for lille til at ses på et kort med ca. 2 km pr. pixel.</p>',
  },
};

// Turen ned gennem skyerne (V5, js/kosmos/venus-ned.js): en knap ved Venera 13 i træet og flybyens sidste stop. Tallene
// på måleren er VIRA (js/data/luft-venus.js, Wikipedia "Atmosphere of Venus"). Venera 9's lys: ca. 14.000 lux
// (Wikipedia efter Science News 1976, Fables tjek E18).
SIDER.ned = {
  tal: [['Venera 13 målte', '457 °C'], ['Lufttryk', '89 gange Jordens']],
  kort: 'Kameraet daler fra ca. 320 km over Venus ned gennem skyerne til stedet, hvor Venera 13 landede i 1982. Måleren viser højden, temperaturen og lufttrykket på vejen ned.',
  emner: [
    {
      titel: 'Hvor er luften som på Jorden?',
      tekst: '<p>Gæt først: Hvor højt oppe er der stuetemperatur?</p>'
        + '<p>Ca. 55 km oppe er der ca. 27 °C og halvt så højt tryk som ved havet på Jorden. Ca. 50 km oppe er trykket som ved havet, men der er ca. 75 °C. Over skyerne, 70 km oppe, er der −43 °C og næsten ingen luft. Men luften er kuldioxid overalt, og skyerne er svovlsyre.</p>',
    },
    {
      titel: 'Hvor lyst er der dernede?',
      tekst: '<p>Skyerne og luften tager det meste af lyset, især det blå. Derfor er lyset orange. Landingssonden Venera 9 målte i 1975 ca. 14.000 lux ved jorden. Det er som en overskyet dag på Jorden.</p>',
    },
    SIDER.venera13.emner[0],
  ],
  // (fotoet står oven på 3D-billedet, når man er landet, så det står ikke også her: én ting ét sted)
  videre: [sted('venera13', 'Venera 13'), sted('venus', 'Hele Venus')],
  nørd: '<p><b>Måleren</b> viser VIRA (Venus International Reference Atmosphere), et gennemsnit af målingerne fra rumsonderne Pioneer Venus og Venera, samlet i 1985. Højden er regnet fra Venus\' middelradius. Nær jorden falder temperaturen ca. 7,7 °C pr. km opad, og trykket bliver halvt så stort for hver ca. 10 km, man stiger. Oppe ved skyerne halveres det for hver ca. 5 km. Venera 13 målte selv 457 °C og 89 gange Jordens lufttryk, hvor den landede. Det passer nogenlunde med VIRA, for stedet ligger lidt over middelhøjden.</p>',
  ærligt: '<p><b>Kameraet</b> stopper ca. 3 km over jorden, for radarkortet har kun ca. 2 km pr. pixel. Måleren tager det sidste stykke ned alene. Turen tager ca. et halvt minut, i virkeligheden tog den meget længere.</p>'
    + '<p><b>Disen</b> i skyerne og den orange himmel under dem er tegnet efter Veneras fotos, ikke regnet. Jorden er radarens billede, tonet orange.</p>'
    + '<p><b>Fotoet</b> er Venera 13\'s eget, vist fladt, som det er. Det dækker 170° og er ikke lagt rundt om kameraet, for kameraet kiggede skråt ned, og uden for fotoet ved man ikke, hvordan der ser ud.</p>',
};

// Flybyen (V5, js/solsystem/flyby.js): 6 stop. id: stoppet i js/kosmos/venus.js (Maxwell Montes, Maat Mons og turen
// ned er steder i træet med deres egen side). tekst: underteksten (under ca. 160 tegn, faktatjekket i del7-venus.md,
// afsnit 12, med Fables rettelser fra E18, afsnit 3). nu: "Lige nu" i panelet ved stoppet.
export const TUR = [
  {
    id: 'venus', titel: 'Venus', knap: 'Venus',
    tekst: 'Venus er næsten lige så stor som Jorden. Men det, vi ser, er ikke overfladen. Det er et tykt lag af skyer af svovlsyre.',
    nu: '<p><b>Lige nu:</b> Sådan ser Venus ud i almindeligt lys: lyst gullig hvid og næsten uden mønster. Skyerne skjuler alt nedenunder.</p>',
  },
  {
    // 243 / 4 ≈ 60 gange hurtigere. Vores måling: en omgang på ca. 4,3 døgn ved ækvator (js/data/vinde-venus.js)
    id: 'skyer', titel: 'Skyerne løber om kap', knap: 'skyerne',
    tekst: 'Skyerne suser rundt om Venus på ca. 4 jorddøgn. Selve planeten er 243 jorddøgn om at dreje én gang, og den drejer baglæns.',
    nu: '<p><b>Lige nu:</b> Skyerne vises i ultraviolet lys, som rumsonden Akatsuki så dem, og tiden går seks timer i sekundet. Øjet kan ikke se ultraviolet lys, så farven er valgt.</p>',
  },
  {
    // NASA: Magellan kortlagde 98 % fra 1990 til 1992 og blev ved til 1994 (E18). Maxwell Montes ca. 11 km (del 7)
    id: 'maxwell', titel: 'Under skyerne', knap: 'under skyerne',
    tekst: 'Radar kan se gennem skyerne. Magellan kortlagde næsten hele Venus fra 1990 til 1992. Maxwell Montes er ca. 11 km højt.',
    nu: '<p><b>Lige nu:</b> Skyerne er taget væk, og du ser Magellans radarkort af Maxwell Montes, tonet orange som lyset dernede. Lyst betyder ru eller skrå jord. Prøv ' + BJERGE + '.</p>',
  },
  {
    // Herrick og Hensley 2023: en åbning i vulkanens side blev ca. dobbelt så stor på 8 måneder i 1991 (E18, NASA)
    id: 'maat', titel: 'Maat Mons', knap: 'Maat Mons',
    tekst: 'Maat Mons er en vulkan på ca. 8 km. En åbning i dens side blev dobbelt så stor på otte måneder i 1991, så der er nok stadig udbrud.',
    nu: '<p><b>Lige nu:</b> Vulkanen er bred og flad. Prøv ' + BJERGE + '. NASA\'s kendte billede af Maat Mons er gjort 22,5 gange højere.</p>',
  },
  {
    // Parker Solar Probe (WISPR, 2020-2021) så Aphrodite Terra som en mørk plet (NASA). Jorden gløder dag og nat (E18)
    id: 'gloed', titel: 'Natsiden gløder', knap: 'gløden',
    tekst: 'Jorden på Venus er 464 °C, så den gløder. Om natten kan kameraer se det gennem skyerne. Højlandet Aphrodite Terra er køligere og mørkere.',
    nu: '<p><b>Lige nu:</b> Det er midnat over Ovda Regio, den vestlige del af Aphrodite Terra. Gløden er mest infrarød og skruet mange tusind gange op, så du kan se den. Gæt: Hvorfor er højlandet mørkt?</p>',
  },
  {
    // NSSDC: 1. marts 1982, mindst 127 minutter, 457 °C og 89 atmosfærer. VIRA: 1,07 bar og 75 °C ved 50 km, 0,53 bar og
    // 27 °C ved 55 km. Wikipedia: 92 bar er som ca. 900 m under havet
    id: 'ned', titel: 'Ned til Venera 13', knap: 'ned til Venera 13',
    tekst: 'I 1982 landede Venera 13 her og tog farvebilleder. Den holdt i 127 minutter i 457 °C og 89 gange Jordens lufttryk.',
    nu: '<p><b>Lige nu:</b> Kameraet daler ned gennem luften på Venus. Søjlen ved måleren viser, hvor du er: over, inde i eller under skyerne. Underteksten fortæller, hvad du kommer forbi.</p>',
  },
];

// Underteksterne på turen ned (js/kosmos/venus-ned.js, TRIN): de skifter, når kameraet kommer forbi hvert sted.
// Tallene er VIRA (js/data/luft-venus.js) og faktatjekket i del7-venus.md, afsnit 12 og 13: skyerne ca. 48-70 km og ca.
// 20 km tykke, −43 °C ved 70 km, 27 °C og 0,53 bar ved 55 km, 306 °C ved 20 km, bly smelter ved 327 °C, 92 bar er som
// ca. 900 m under havet, og Venera 13 holdt i 127 minutter (NSSDC).
export const NED_TRIN = [
  { id: 'over', titel: 'Over skyerne', tekst: 'Heroppe er luften tynd og under −40 °C. Lige under os ligger skyerne, et lag på ca. 20 km.' },
  { id: 'skyer', titel: 'Inde i skyerne', tekst: 'Skyerne er bittesmå dråber af svovlsyre. Herinde kan man ikke se jorden.' },
  { id: 'stue', titel: 'Stuetemperatur', tekst: 'Ca. 55 km oppe er der ca. 27 °C og halvt så højt lufttryk som ved havet på Jorden. Men luften er kuldioxid.' },
  { id: 'under', titel: 'Under skyerne', tekst: 'Lyset er orange, for skyerne og luften tager det meste af det blå. Herfra bliver luften tykkere og varmere hele vejen ned.' },
  { id: 'ovn', titel: 'Varmere end en ovn', tekst: 'Nu er der over 300 °C, langt varmere end i en ovn, når man bager. Nede ved jorden er der varmt nok til at smelte bly.' },
  { id: 'landet', titel: 'Landet ved Venera 13', tekst: '457 °C og 89 gange Jordens lufttryk, som ca. 900 m under havet. Her holdt Venera 13 i 127 minutter.' },
];
export const TUR_SLUT = '<p><b>Turen er slut.</b> Venus er lige så stor som Jorden, men den tykke luft holder så godt på varmen, at jorden er ca. 464 °C, dag og nat. Drej selv rundt, eller vælg et sted i listen.</p>';
