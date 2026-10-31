// Teksterne i højre panel ved Saturn (siden i lag, U3 i docs/plan-ux.md): Saturns egen side (SIDE) og en side for
// ringene, oversigten over månerne og hver af de seks store måner (SIDER). Underteksten på stedet (bjælkens linje) står i
// TUR og MÅNER i js/kosmos/saturn.js og må ikke stå igen her. Faktatjekket i docs/fakta-solsystemet.md (del 1, afsnit
// 1-4b, og "Faktatjek U3"). Uden Three.js, så teksterne kan testes i Node.

import { sted, kontakt, tur } from '../../sideknap.js';

// Det samme ved alle månerne
const MÅNE_ÆRLIGT = '<p>Månen står stille, mens du besøger den, og vender samme side mod Saturn, ligesom Månen mod Jorden. På flybyen er månerne stillet op, så de er nemme at besøge efter hinanden med Solen fra siden. Langt væk er de tegnet større, så man kan se dem.</p>';
const CASSINI = '<p>Kortet er lavet af billeder fra rumsonden Cassini (NASA/JPL/Space Science Institute) via USGS.</p>';

export const SIDE = {
  kort: 'Saturn er den næststørste planet i solsystemet og har de mest kendte ringe. Her står Saturn, ringene og seks af de største måner i den rigtige størrelse og afstand.',
  emner: [
    {
      titel: 'Hvorfor er Saturn fladtrykt?',
      tekst: '<p>Saturn drejer om sig selv på ca. 10½ time, og den er ikke fast. Derfor buler den ud ved ækvator og er ca. 10 % fladere fra pol til pol.</p>',
    },
    {
      titel: 'Kan Saturn virkelig være lettere end vand?',
      tekst: '<p>Ja, i snit. Saturn er mest brint og helium, de to letteste grundstoffer. I snit vejer en kubikcentimeter Saturn ca. 0,7 g, mens en kubikcentimeter vand vejer 1 g. Inde i midten er Saturn meget tættere, men den ydre gas trækker gennemsnittet ned.</p>',
    },
    {
      titel: 'Hvad er de mørke bånd og skygger?',
      tekst: '<p>Ringene kaster en skygge på Saturn, og Saturn kaster en skygge på ringene. Vinklen afhænger af årstiden på Saturn. Ved jævndøgn står Solen lige i ringenes plan, så ringenes skygge bliver en tynd streg.</p>',
    },
    {
      titel: 'Hvordan ser ringene ud bagfra?', kontakt: 'Modlys',
      tekst: `<p>Slå ${kontakt('Modlys')} til, så står Solen bag Saturn. Set fra den side, Solen ikke skinner på, bliver de tætte ringe mørke, og de tynde lyser, fordi lyset kun kommer igennem dem.</p>`,
    },
  ],
  videre: [sted('ringe', 'Ringene'), sted('enceladus', 'Enceladus'), sted('titan', 'Titan'), sted('maaner', 'Månerne'), tur('▶ Start flybyen')],
  nørd: '<p><b>Flybyen</b> foregår i den rigtige skala. For at kunne flyve fra hele systemet og helt ind til en lille måne gør programmet hele Saturn-systemet større og mindre i stedet for at flytte kameraet langt væk. Det ser ud præcis, som hvis kameraet fløj.</p>'
    + '<p><b>Døgnet</b> er svært at måle, for Saturn har ingen fast overflade. Det bedste tal kommer fra bølger i ringene, som planetens indre sætter i gang: ca. 10 t 33-35 min.</p>',
  billeder: '<p>Saturns kort og ringenes farver er fra Solar System Scope (CC BY 4.0), som bygger på NASA\'s billeder. Månernes kort er fra Cassini (se Billederne ved hver måne).</p>',
  ærligt: '<p>Saturn, ringene og månerne har den rigtige størrelse og afstand. Solen står omtrent som da Cassini kom frem i 2004: Det var sommer på Saturns sydlige halvkugle, så ringene og månernes sydpoler var belyst. "Modlys" flytter Solen om bag Saturn eller månen. Månerne er tegnet større, når de er langt væk, ellers kunne de ikke ses.</p>',
};

export const SIDER = {
  ringe: {
    tal: [['Bredde', 'ca. 70.000 km'], ['Tykkelse', 'mange steder ca. 10 m'], ['Is', 'over 95 %'], ['Cassini-delingen', 'ca. 4.600 km']],
    kort: 'Hver klump i ringene kredser om Saturn for sig, som en lille måne. Fra kant til kant er ringene ca. 270.000 km.',
    emner: [
      {
        titel: 'Hvor tynde er ringene?',
        tekst: '<p>Hovedringene er ca. 70.000 km brede, men mange steder kun ca. 10 m tykke. I forhold til bredden er de tyndere end et ark papir.</p>',
      },
      {
        titel: 'Hvad er den mørke stribe?',
        tekst: '<p>Det er Cassini-delingen. Den er ca. 4.600 km bred og ikke helt tom, der er bare langt færre klumper.</p>',
      },
      {
        titel: 'Hvorfor lyser nogle ringe bagfra?', kontakt: 'Modlys',
        tekst: `<p>Slå ${kontakt('Modlys')} til. Set fra den side, Solen ikke skinner på, bliver de tætte ringe mørke, og de tynde lyser, fordi lyset kun kommer igennem dem.</p>`,
      },
    ],
    videre: [sted('maaner', 'Månerne'), sted('saturn', 'Saturn')],
    nørd: '<p><b>Tætheden i ringene er målt af Cassini.</b> Den 28. juli 2008 så rumsonden stjernen β Centauri skinne gennem ringene. Dens instrument UVIS målte i ultraviolet lys (kortere bølger, end øjet kan se), hvor meget af stjernens lys der kom igennem. Målingerne er lagt sammen i stykker på 10 km. Det giver ringenes optiske dybde τ: Ved τ = 1 slipper ca. 37 % af lyset lige igennem, og ved τ = 5 under 1 %. Programmet bruger 8.192 punkter fra D-ringen til F-ringen, ca. 9 km pr. punkt.</p>'
      + '<p>C-ringen og Cassini-delingen er tynde (τ ca. 0,1), og A-ringen har τ ca. 0,5-1. Midt i B-ringen er τ mange steder over 5, så næsten intet lys slipper igennem. Cassini så stjernen fra ca. 67° over ringene, så lyset gik den korte vej. Derfor kunne den måle gennem B-ringen.</p>',
    billeder: '<p>Tætheden er målt af Cassini (NASA/JPL/University of Colorado) og hentet fra NASA\'s PDS Ring-Moon Systems Node. Ringenes farver er fra Solar System Scope (CC BY 4.0), som bygger på NASA\'s billeder.</p>',
    ærligt: '<p>Tætheden er målt langs én linje hen over ringene, og programmet tegner den ens hele vejen rundt. I virkeligheden bølger nogle kanter frem og tilbage. F-ringen er skæv og klumpet, så den står i sin gennemsnitlige afstand. D-ringen er for tynd til målingen, så den er tegnet. Ringenes farver er lagt på de rigtige grænser. Kameraet glider langsomt udad hen over ringene, fra B-ringen til uden for A-ringen.</p>',
  },
  maaner: {
    tal: [['Kendte måner', 'over 280 (2026)'], ['Nærmest af de store (Mimas)', 'ca. 185.500 km'], ['Længst ude (Titan)', 'ca. 1,22 mio. km']],
    kort: 'Her står seks af Saturns største måner i den rigtige afstand. Tryk på en måne for at besøge den.',
    emner: [
      {
        titel: 'Hvorfor vender de altid samme side mod Saturn?',
        tekst: '<p>Hver måne drejer én gang om sig selv, mens den runder Saturn én gang. Det kaldes bundet rotation, og det er det samme som Månen hos os.</p>',
      },
      {
        titel: 'Hvor mange måner har Saturn?',
        tekst: '<p>Over 280 kendte måner (marts 2026), og der bliver stadig fundet nye. Titan er den største, større end planeten Merkur.</p>',
      },
    ],
    videre: [sted('mimas', 'Mimas'), sted('titan', 'Titan')],
    ærligt: '<p>Månerne kredser meget hurtigere end i virkeligheden, men i det rigtige forhold: Mimas kommer rundt på under et døgn, Titan på ca. 16 døgn. Langt væk er de tegnet større, så man kan se dem. Den tredjestørste måne, Iapetus (ca. 1.470 km bred), er ikke med endnu. Den kredser ca. 3,6 mio. km fra Saturn.</p>',
  },
  mimas: {
    tal: [['Bredde', '396 km'], ['Herschel', 'ca. 140 km'], ['En omgang', 'ca. 22½ timer'], ['Fra Saturn', 'ca. 185.500 km']],
    kort: 'Mimas er den mindste og inderste af de seks måner her.',
    emner: [
      {
        titel: 'Ligner den ikke Dødsstjernen?',
        tekst: '<p>Mimas ligner Dødsstjernen fra Star Wars, men det er et tilfælde: Filmen kom i 1977, og krateret blev først set af Voyager 1 i november 1980. Slaget, der lavede krateret, var måske tæt på at slå Mimas i stykker.</p>',
      },
      {
        titel: 'Er der et hav under isen?',
        tekst: '<p>Målinger af Mimas\' bane tyder på, at der kan være et hav 20-30 km under isen. Hvis det passer, er det yngre end 25 millioner år. Forskerne er ikke helt enige endnu.</p>',
      },
    ],
    videre: [sted('enceladus', 'Enceladus'), sted('maaner', 'Alle månerne')],
    billeder: '<p>Mimas-kortet er lavet af DLR ud fra billeder fra rumsonden Cassini.</p>',
    ærligt: MÅNE_ÆRLIGT,
  },
  enceladus: {
    tal: [['Bredde', '504 km'], ['Kaster lyset tilbage', 'ca. 80 %'], ['Tigerstriberne', '4, hver ca. 130 km lang'], ['Fra Saturn', 'ca. 238.000 km']],
    kort: 'Enceladus er den mest hvide klode i solsystemet. Den kaster ca. 80 % af sollyset tilbage.',
    emner: [
      {
        titel: 'Hvor kommer fontænerne fra?', kontakt: 'Modlys',
        tekst: `<p>Fontænerne sprøjter op fra fire lange sprækker ved sydpolen, "tigerstriberne". Iskornene bliver til Saturns tynde E-ring. Slå ${kontakt('Modlys')} til, og se fontænerne lyse.</p>`,
      },
      {
        titel: 'Hvad fandt Cassini i fontænerne?',
        tekst: '<p>Rumsonden Cassini fløj gennem fontænerne og fandt salt, organiske stoffer og fosfat. Det tyder på, at havet under isen har noget af det, liv har brug for. Liv har man ikke fundet.</p>',
      },
    ],
    videre: [sted('mimas', 'Mimas'), sted('tethys', 'Tethys')],
    billeder: CASSINI,
    ærligt: '<p>Fontænernes partikler er tegnet meget større end de rigtige iskorn. "Modlys" flytter Solen om bag månen.</p>' + MÅNE_ÆRLIGT,
  },
  tethys: {
    tal: [['Bredde', '1.062 km'], ['Odysseus', '445 km'], ['Ithaca Chasma', 'over 1.000 km lang'], ['Tæthed', 'næsten som vand']],
    kort: 'Tethys er næsten lige så tæt som vand, så den må være næsten ren is med lidt sten.',
    emner: [
      {
        titel: 'Hvad er den lange kløft?',
        tekst: '<p>Kløften Ithaca Chasma er over 1.000 km lang og op til ca. 100 km bred.</p>',
      },
    ],
    videre: [sted('dione', 'Dione'), sted('maaner', 'Alle månerne')],
    billeder: CASSINI,
    ærligt: MÅNE_ÆRLIGT,
  },
  dione: {
    tal: [['Bredde', '1.123 km'], ['Isklipperne', 'flere hundrede m høje'], ['En omgang', 'ca. 2¾ døgn'], ['Fra Saturn', 'ca. 377.400 km']],
    kort: 'Isklipperne ligger på den side af Dione, der vender bagud i banen.',
    emner: [
      {
        titel: 'Har Dione et hav?',
        tekst: '<p>Måske. Målinger af Diones tyngde tyder på et hav ca. 100 km under isen, men det er ikke sikkert.</p>',
      },
    ],
    videre: [sted('rhea', 'Rhea'), sted('maaner', 'Alle månerne')],
    billeder: '<p>Kortet er lavet af billeder fra rumsonden Cassini (NASA/JPL/Space Science Institute) via USGS, med lidt fra Voyager.</p>',
    ærligt: MÅNE_ÆRLIGT,
  },
  rhea: {
    tal: [['Bredde', 'ca. 1.530 km'], ['Is', 'måske ca. ¾'], ['En omgang', 'ca. 4½ døgn'], ['Fra Saturn', 'ca. 527.000 km']],
    kort: 'Rhea er måske ca. tre fjerdedele is og resten sten.',
    videre: [sted('titan', 'Titan'), sted('maaner', 'Alle månerne')],
    billeder: '<p>Kortet er lavet af billeder fra rumsonden Cassini (NASA/JPL/Space Science Institute) via USGS, med lidt fra Voyager.</p>',
    ærligt: MÅNE_ÆRLIGT,
  },
  titan: {
    tal: [['Bredde', 'ca. 5.150 km'], ['Lufttryk', 'ca. 1,5 × Jordens'], ['Ved jorden', 'ca. −179 °C'], ['En omgang', 'ca. 16 døgn']],
    kort: 'Titan er den eneste måne med en tyk atmosfære: mest nitrogen og lidt metan.',
    emner: [
      {
        titel: 'Hvad er der under disen?', kontakt: 'Under disen',
        tekst: `<p>Nede under disen er der ca. −179 °C og søer og have af flydende metan og ethan. De ligger mest ved nordpolen. Slå ${kontakt('Under disen', 'Under disen (infrarødt)')} til, så ser du overfladen, som et kamera med infrarødt lys ser den.</p>`,
      },
      {
        titel: 'Hvorfor lyser disen i modlys?', kontakt: 'Modlys',
        tekst: `<p>Slå ${kontakt('Modlys')} til, så står Solen bag Titan, og disen lyser som en ring rundt om månen.</p>`,
      },
      {
        titel: 'Har nogen været der?',
        tekst: '<p>Ja. Sonden Huygens landede på Titan 14. januar 2005. Den havde fløjet med Cassini hele vejen til Saturn.</p>',
      },
    ],
    videre: [sted('rhea', 'Rhea'), sted('maaner', 'Alle månerne')],
    billeder: '<p>Titans overflade er Cassinis kort i nær-infrarødt lys, hvor man kan se gennem disen (PIA19658).</p>',
    ærligt: '<p>"Under disen" viser Titan, som et kamera med infrarødt lys ser den. Med øjnene ser man kun den orange dis.</p>' + MÅNE_ÆRLIGT,
  },
};
