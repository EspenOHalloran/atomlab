// Teksterne i højre panel ved Jupiter (siden i lag, U3 i docs/plan-ux.md). J1 og J2 i docs/plan-jupiter.md: Jupiters
// egen side og pletten. J3: månerne (faktatjekket i fakta-solsystemet.md, "Faktatjek J3"). J4: emnerne på Jupiters side
// (faktatjekket i "Faktatjek J4"). Polerne og ringene får deres sider i J5. Underteksterne ved en måne og på flybyen står
// i MÅNER og TUR i js/kosmos/jupiter.js.
// Tallene er fra docs/fakta-solsystemet.md, "Del 5: Jupiter" (NSSDC). Uden Three.js, så teksterne kan testes i Node.

import { kontakt, sted, tid } from '../../sideknap.js';

const USGS = '<p>Kortet er lavet af USGS (NASA/JPL/USGS) af billeder fra rumsonderne Galileo og Voyager.</p>';

export const SIDE = {
  kort: 'Jupiter er den største planet i solsystemet. Den er en kæmpe kugle af gas, mest brint og helium, og har ingen fast overflade at stå på. Du ser Jupiter i den rigtige form, og den drejer rundt én gang på knap 10 timer.',
  emner: [
    {
      titel: 'Hvorfor er Jupiter fladtrykt?',
      tekst: '<p>Jupiter drejer om sig selv på 9 timer og 56 minutter. Det er det korteste døgn af alle planeterne. Fordi Jupiter er af gas og drejer så hurtigt, buler den ud ved ækvator. Fra pol til pol er den ca. 6,5 % kortere end hen over ækvator, og det kan man se.</p>',
    },
    {
      titel: 'Hvorfor har Jupiter bånd?', kontakt: 'Vindene',
      tekst: '<p>Båndene er skyer af ammoniak og vand. De lyse bånd kaldes zoner, og de mørke, orange bånd kaldes bælter. Mellem båndene blæser jetstrømme skiftevis mod øst og mod vest og holder dem adskilt. Vindene går ca. 3.000 km ned i planeten.</p>'
        + `<p>Slå ${kontakt('Vindene')} til, så viser pilene vinden: jo længere pil, jo hurtigere. Gule pile blæser mod øst, blå mod vest. Den hurtigste vind blæser ca. 150 meter i sekundet (ca. 540 km/t) mod øst, 24 grader nord for ækvator.</p>`
        + `<p>Vindene måles i forhold til Jupiters døgn. Selvom de er hurtige, flytter skyerne sig højst ca. 5 grader, mens Jupiter drejer én gang. ${tid('hurtig', 'Prøv ⏩')}</p>`,
    },
    {
      titel: 'Hvad er den røde plet?',
      tekst: `<p>Den Store Røde Plet er en kæmpe storm, omtrent lige så bred som Jorden. Den ligger syd for ækvator og har været set sikkert siden 1831. Den er blevet mindre i de sidste 150 år. ${sted('plet', 'Flyv derhen')}</p>`,
    },
    {
      titel: 'Hvad er inden i?',
      tekst: '<p>Jupiter er mest brint og helium, ligesom Solen. Under skyerne bliver trykket større og større, og brinten bliver til en væske. Måske halvvejs inde mod midten er trykket så stort, at brinten leder strøm som et metal. Forskerne mener, at det flydende metal laver Jupiters kæmpe magnetfelt, når planeten drejer.</p>'
        + '<p>Inderst er der en kerne af tungere stoffer. Rumsonden Juno har målt, at den er større end ventet og delvis opløst, så den har ingen skarp kant.</p>',
    },
    {
      titel: 'Er Jupiter en mislykket stjerne?',
      tekst: '<p>Nej, ikke rigtigt. Jupiter er lavet af det samme som Solen, men den er alt for let til at blive en stjerne. Den skulle veje ca. 80 gange så meget, før brint kunne smelte sammen inde i den. Selv en brun dværg vejer mindst ca. 13 gange så meget som Jupiter.</p>'
        + '<p>Alligevel sender Jupiter ca. dobbelt så meget varme ud, som den suger til sig af sollyset. Varmen er rester fra dengang, Jupiter blev dannet, og den slipper langsomt ud.</p>',
    },
    {
      titel: 'Beskytter Jupiter Jorden?',
      tekst: '<p>Mange har sagt, at Jupiter er et skjold, der holder kometer væk fra Jorden. Computerberegninger viser, at det er mere blandet: Jupiter skubber nogle kometer væk, men sender også asteroider og kometer ind mod os. Alt i alt er den ikke det store skjold, man troede.</p>',
    },
    {
      titel: 'Hvordan ser Jupiter ud bagfra?', kontakt: 'Modlys',
      tekst: `<p>Slå ${kontakt('Modlys')} til, så står Solen bag Jupiter. Så lyser de øverste lag af luften som en tynd ring i kanten.</p>`,
    },
  ],
  nørd: '<p><b>Døgnet</b> er svært at måle på en planet uden fast overflade, for skyerne blæser hver sin vej. Derfor måles det efter radiobølgerne fra Jupiters magnetfelt, som drejer med planetens indre: 9 t 55,5 min. Det kaldes System III.</p>'
    + '<p><b>Vindene er målt af os.</b> Hubble fotograferede Jupiter to omgange i træk den 11.-12. december 2025, med 9 timer og 25 minutter imellem. For hver stribe af skyer har vi fundet, hvor langt den har flyttet sig mellem de to billeder (krydskorrelation). Det giver ca. 149 m/s ved 24° N. Forskerne bag Hubbles kort målte 153 m/s samme sted i 2015, Cassini 138 m/s i 2000 og Voyager 184 m/s i 1979. Vindene ændrer sig lidt fra år til år.</p>'
    + '<p><b>Varmen indefra:</b> Det gamle tal er, at Jupiter sender ca. 1,7 gange så meget varme ud, som den optager fra Solen. Nyere målinger fra Cassini (Li m.fl. 2018) tyder på, at Jupiter optager mindre sollys og har mere varme indefra end antaget, så tallet bliver nærmere 2.</p>'
    + '<p><b>Grænserne:</b> Brint smelter sammen ved ca. 75-80 gange Jupiters masse (en stjerne), deuterium ved ca. 13 gange (en brun dværg). Beregningerne om kometerne er fra Horner og Jones (2008-2012).</p>'
    + '<p><b>Kortet ligger på en fladtrykt kugle.</b> Hubbles kort bruger "planetografisk" bredde (vinklen mellem lodret og ækvator), Cassinis "planetocentrisk" (vinklen fra Jupiters midte). Ved 45° er forskellen næsten 4°, så begge kort er regnet om, før de lægges på kloden.</p>',
  billeder: '<p>Kortet er Hubbles foto fra 11.-12. december 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0). Farverne er justeret efter Cassinis kort fra december 2000 (NASA/JPL/Space Science Institute), som har farver tæt på dem, øjet ville se. Nær polerne, hvor Hubble ikke kan se, er kortet fra Cassini.</p>',
  videre: [sted('plet', 'Den Store Røde Plet'), sted('maaner', 'Månerne'), sted('io', 'Io'), sted('europa', 'Europa')],
  ærligt: '<p>Jupiter bliver bygget lige nu. Polerne, nordlyset og ringene kommer senere. Båndene glider med den fart, vi har målt, men skyerne i dem ændrer sig ikke, som de gør i virkeligheden: De toner langsomt ud og kommer igen, hvor de stod på Hubbles foto. Nær polerne er vindene ikke målt, så der står skyerne stille. Hubbles farver er justeret efter Cassinis, og skyerne ved polerne er fra år 2000.</p>',
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
  maaner: {
    tal: [['Kendte måner', '115 (april 2026)'], ['De fire store', 'fundet i 1610'], ['Io : Europa : Ganymedes', 'ca. 4 : 2 : 1 omgange'], ['Callisto', 'ca. 1,9 mio. km ude']],
    kort: 'Her er Jupiters fire store måner i deres baner, i den rigtige afstand. De over 100 små måner er ikke med.',
    emner: [
      {
        titel: 'Hvorfor går de i takt?',
        tekst: `<p>Hver gang Ganymedes går én tur om Jupiter, går Europa næsten præcis to og Io fire. De giver hinanden små ryk med tyngdekraften igen og igen på de samme steder, og derfor kan banerne ikke blive helt runde. Det kaldes en resonans. ${tid('hurtig', 'Se det med ⏩')}</p>`,
      },
      {
        titel: 'Hvem fandt dem?',
        tekst: '<p>Den 7. januar 1610 så Galileo Galilei tre små prikker ved Jupiter gennem sin kikkert. Nætterne efter flyttede de sig, og den 13. januar så han fire. Det var de første måner, man fandt om en anden planet end Jorden.</p>',
      },
    ],
    videre: [sted('io', 'Io'), sted('europa', 'Europa'), sted('ganymedes', 'Ganymedes'), sted('callisto', 'Callisto')],
    nørd: '<p><b>Laplace-resonansen:</b> Månernes vinkler i banen (λ) opfylder λ<sub>Io</sub> − 3·λ<sub>Europa</sub> + 2·λ<sub>Ganymedes</sub> = 180°. Derfor står de tre aldrig på linje på samme side af Jupiter. Når Io og Europa står på linje, er Ganymedes 90° væk.</p>'
      + '<p>Omløbstiderne er 1,769, 3,551 og 7,155 døgn (NSSDC). Forholdene er 2,007 og 2,015, altså næsten præcis 2. Callisto (16,689 døgn) er ikke med i resonansen.</p>',
    billeder: USGS,
    ærligt: '<p>Månerne følger samme ur som Jupiters døgn, så Io går rundt på ca. 4¼ Jupiter-døgn, som i virkeligheden. Hele uret går meget hurtigere end i virkeligheden. Ved starten står Io lige foran Jupiter, så dens skygge kan ses på skyerne. Langt væk er månerne tegnet større, ellers kunne de ikke ses.</p>',
  },
  io: {
    tal: [['Bredde', 'ca. 3.640 km'], ['En omgang', 'ca. 42½ timer'], ['Fra Jupiter', 'ca. 421.800 km'], ['Vulkaner', 'ca. 400 (skøn)']],
    kort: 'Io er lidt større end vores Måne og den inderste af de fire store måner.',
    emner: [
      {
        titel: 'Hvorfor er Io så vulkansk?',
        tekst: '<p>Europa og Ganymedes giver Io et lille ryk igen og igen, så dens bane ikke er helt rund. Derfor skifter Jupiters træk i Io hele tiden, og Io bliver æltet som en dej. Overfladen hæver og sænker sig op til ca. 100 m. Det gør Io varm indeni.</p>',
      },
      {
        titel: 'Er lavaen af svovl?',
        tekst: '<p>Nej, lavaen er mest smeltet sten. Svovl og frost af svovldioxid ligger på overfladen og giver de gule, røde og hvide farver.</p>',
      },
    ],
    videre: [sted('europa', 'Europa'), sted('maaner', 'Alle månerne')],
    nørd: '<p>Man kender ca. 150 vulkaner, der har været i udbrud, og forskerne regner med ca. 400 i alt (NASA). Lavaen er 1.300-1.600 K varm. Den første sky fra en vulkan blev set på et billede fra Voyager 1 i 1979. Skyen over vulkanen Pele er ca. 300 km høj.</p>',
    billeder: '<p>Kortet er lavet af USGS (NASA/JPL/USGS) af billeder fra Galileo og Voyager. USGS\' farvekort er forstærket ("de ægte farver er meget mere dæmpede"), så programmet bruger det grå kort med en svag tone fra farvekortet.</p>',
    ærligt: '<p>Farverne er et skøn: Det grå kort har fået en dæmpet tone fra USGS\' forstærkede farvekort. Skyerne fra vulkanerne er ikke med endnu. Månen står stille, mens du besøger den, og vender samme side mod Jupiter.</p>',
  },
  europa: {
    tal: [['Bredde', 'ca. 3.120 km'], ['En omgang', 'ca. 3½ døgn'], ['Fra Jupiter', 'ca. 671.100 km'], ['Havets dybde', 'ca. 60-150 km']],
    kort: 'Europa er lidt mindre end vores Måne og har en af de glatteste overflader i solsystemet.',
    emner: [
      {
        titel: 'Hvor tyk er isen?',
        tekst: '<p>NASA regner med 15-25 km. I 2022 fløj rumsonden Juno forbi og målte ca. 29 km i det område, den kunne se. De mørke striber er revner i isen. Nogle er over 1.000 km lange.</p>',
      },
      {
        titel: 'Kan der være liv?',
        tekst: '<p>Det ved ingen endnu. Der er ikke fundet liv, men NASA kalder Europa et af de mest lovende steder at lede. Rumsonden Europa Clipper skal efter planen nå frem til Jupiter i april 2030 og flyve forbi Europa ca. 50 gange.</p>',
      },
    ],
    videre: [sted('io', 'Io'), sted('ganymedes', 'Ganymedes')],
    nørd: '<p>Det bedste bevis for havet kom fra Galileo: Jupiters magnetfelt skaber et svagt magnetfelt i Europa, og det kan kun forklares med et lag, der leder strøm, som saltvand. Junos 29 km gælder det kolde, stive yderlag af isen. Med et varmere lag under kan skorpen være tykkere.</p>',
    billeder: USGS,
    ærligt: '<p>Galileo og Voyager så ikke det hele skarpt, så nogle egne er slørede. Syd for ca. 77° S mangler der billeder. Hullet er fyldt med det spejlede billede af egnen lige nord for. Månen står stille, mens du besøger den, og vender samme side mod Jupiter.</p>',
  },
  ganymedes: {
    tal: [['Bredde', 'ca. 5.260 km'], ['En omgang', 'ca. 7 døgn'], ['Fra Jupiter', 'ca. 1,07 mio. km'], ['I forhold til Merkur', 'ca. 8 % bredere']],
    kort: 'Ganymedes er bredere end Merkur, men vejer under halvt så meget, fordi den for en stor del er is.',
    emner: [
      {
        titel: 'Hvad er de mørke og lyse egne?',
        tekst: '<p>De mørke egne er gammelt land med mange kratere. De lyse egne er yngre og fulde af riller og rygge. Omkring en tredjedel af overfladen er mørk.</p>',
      },
      {
        titel: 'Har den også et hav?',
        tekst: '<p>Ja, efter alt at dømme. Ganymedes har sit eget magnetfelt og derfor nordlys. Hubble så nordlyset vugge på en måde, der passer med et hav af saltvand under isen. Forskerne regner med, at der er mere vand i det end i alle Jordens have.</p>',
      },
    ],
    videre: [sted('europa', 'Europa'), sted('callisto', 'Callisto')],
    nørd: '<p>Galileo opdagede magnetfeltet i 1996. Havet blev fundet med Hubble i 2015: ca. 100 km dybt under ca. 150 km is. Rumsonden JUICE fra ESA blev sendt op i 2023 og skal nå frem til Jupiter i 2031 og senere gå i bane om Ganymedes.</p>',
    billeder: USGS,
    ærligt: '<p>Billederne har forskellig skarphed og lysstyrke, så man kan se kanterne mellem dem nogle steder. Nær polerne mangler der billeder. Hullerne er fyldt med det spejlede billede af egnen ved siden af. Månen står stille, mens du besøger den, og vender samme side mod Jupiter.</p>',
  },
  callisto: {
    tal: [['Bredde', 'ca. 4.820 km'], ['En omgang', 'ca. 16,7 døgn'], ['Fra Jupiter', 'ca. 1,88 mio. km'], ['Valhalla', 'ca. 3.800 km bred']],
    kort: 'Callisto har den ældste overflade med flest kratere i solsystemet.',
    emner: [
      {
        titel: 'Hvorfor er der så mange kratere?',
        tekst: '<p>Overfladen har næsten ikke ændret sig i ca. 4 milliarder år. Der er ingen vulkaner, der dækker kraterne til. Nogle steder ligger kraterne så tæt, at et nyt krater sletter et gammelt. Det største, Valhalla, er med sine ringe ca. 3.800 km bredt.</p>',
      },
      {
        titel: 'Kunne mennesker bo der?',
        tekst: '<p>Måske en dag. Callisto ligger uden for Jupiters stærkeste strålingsbælte, så strålingen er meget svagere end ved de andre store måner. NASA har derfor undersøgt Callisto som et muligt sted for en base.</p>',
      },
    ],
    videre: [sted('ganymedes', 'Ganymedes'), sted('maaner', 'Alle månerne')],
    nørd: '<p>Callisto er ikke med i resonansen mellem Io, Europa og Ganymedes. Måske er der også et hav ca. 250 km under overfladen, men det er ikke sikkert. NASA skriver, at det måske slet ikke findes.</p>',
    billeder: USGS,
    ærligt: '<p>Nogle egne er kun fotograferet groft (op til 60 km pr. pixel), så de er slørede. Nær polerne mangler der billeder. Hullerne er fyldt med det spejlede billede af egnen ved siden af. Månen står stille, mens du besøger den, og vender samme side mod Jupiter.</p>',
  },
};
