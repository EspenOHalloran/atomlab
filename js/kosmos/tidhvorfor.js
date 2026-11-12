// "Hvorfor går tiden langsommere?" (T5, drejebogen er docs/plan-tid-t5.md, faktagrundlaget
// docs/fakta-tid/hvorfor-langsommere.md, skitsen docs/skitser/tid-t5.html). Fem små scener, der går frem med "Næste" i
// bjælken (fænomenets trin()): 1 bolden og lyset, 2 lysuret med trekanten, 3 myonernes kapløb, 4 "nu" er ikke det
// samme for alle og 5 rumtidskortet. T5a lavede scene 1 og 2, T5b scene 3 og T5c scene 4 og 5.
//
// Hovedsagen er et 2D-lærred i overlaget (som lysuret i Rejsen i tid) over en rolig stjernehimmel. Lærredet får den
// højde, der er plads til mellem Styr-boksen og underteksten med bjælken (størrelse()), så det aldrig dækker dem.
// Teksten, der altid er fremme, står som fasens undertekst, og kontakterne og skyderne står i Styr-boksen og skifter
// med scenen. Siden bygges én gang (ét emne pr. scene). Lysurets tegning er delt med tid.js (lysur.js).
import { gå } from '../sideknap.js';
import { ROLIG } from '../scene3d.js';
import * as T from '../data/tid.js';
import * as Lys from './lysur.js';

const MAKS_BREDDE = 760; // lærredets største bredde i pixel
const BRED2 = 520; // scene 2: lysurene ved siden af hinanden fra denne bredde, ellers over hinanden (telefon på højkant)
const FARVE = { ...Lys.FARVE, tog: '#33456f', bold: '#ff9f43', myon: '#c9a2ff', grøn: '#8ce99a', nu: '#ff8fd0', rød: '#ff6b6b' };
const fmt = (x, d = 0) => x.toLocaleString('da-DK', { minimumFractionDigits: d, maximumFractionDigits: d });
const { læggesSammen } = T; // farter lægges sammen med Einsteins formel (js/data/tid.js)

// Den højeste scene, man har set (0-4). Huskes kun, mens AtomLab er åben (intet i localStorage): Første gang går man
// frem med "Næste", og bagefter kan man trykke sig til de scener, man har set (alle, når man har været igennem).
let højesteSet = 0;

// ---------- Scene 1: bolden og lyset ----------
const FARTER1 = [
  { navn: '100 km/t', b: 0 },
  { navn: '50 % af lysets fart', b: 0.5 },
  { navn: '90 % af lysets fart', b: 0.9 },
];
const BOLD_TEKST = 'Toget kører 100 km/t, og bolden kastes 50 km/t fremad. Set fra perronen flyver bolden 150 km/t. Farterne lægges sammen.';
const LYS_TEKST = 'Med lyset sker der noget mærkeligt: Det har lysets fart set fra toget og præcis den samme fart set fra perronen. Togets fart lægges ikke til.';
// Bolden ved store farter: 80 % ved 50 % og 96,6 % ved 90 %
const boldProcent = (fart) => fmt(læggesSammen(0.5, FARTER1[fart].b) * 100, fart === 2 ? 1 : 0);

// ---------- Scene 2: lysuret med trekanten ----------
const LIGE_TEKST = 'Set fra Jorden går lyset i uret en længere, skrå vej. Lyset kan ikke køre hurtigere, så hvert tik tager længere tid. Uret går langsommere.';
const erTo = (gam) => Math.abs(gam - 2) < 1e-9;
const gangeTekst = (gam) => fmt(gam, erTo(gam) ? 0 : 1);

// ---------- Scene 3: myonernes kapløb (tallene i afsnit 15.6 i docs/fakta-tid/hvorfor-langsommere.md) ----------
const TAU = 2.1969811; // µs, myonens middellevetid i hvile
const C_KM_US = 0.299792458; // lysets fart i km pr. µs
const HØJDE3 = 15; // km: her laves de fleste myoner
const N_MYON = 24; // myoner i en byge
const FARTER3 = [
  { navn: '99 %', b: 0.99 },
  { navn: '99,9 %', b: 0.999 },
  { navn: '99,97 % (typisk)', b: 0.99965 }, // ca. 4 GeV, γ ≈ 38
];
const TILSTANDE3 = ['Uden Einstein', 'Med Einstein', 'Set fra myonen'];
const SKÆRM_TUR = 6; // sekunder på skærmen for turen ned (i alle tre kontakter, så "Set fra myonen" er γ gange langsommere)
const HOLD3 = 3; // sekunder, bygen står færdig, før den starter forfra
const KLEM_TID = 1.4, ZOOM_TID = 1.1; // "Set fra myonen": først klemmes luften, så zoomer billedet ind
const BRED3 = 640; // søjlen til venstre og urene til højre fra denne bredde, ellers urene øverst
const FÆLLES3 = 'Myoner er små partikler, der laves ca. 15 km oppe og kun lever ca. 2 milliontedele sekund. Selv næsten med lysets fart burde de kun nå ca. 660 m.';
const nyLevetid = () => -TAU * Math.log(1 - Math.random()); // tilfældig, eksponentielt fordelt med middel TAU
// Turen ved farten b: γ, tiden på Jorden og på myonens ur (µs) og luftens længde set fra myonen (m)
function myonTur(b) {
  const gam = T.lysurGamma(b), jord = HØJDE3 / (b * C_KM_US);
  return { gam, jord, egen: jord / gam, luft: (HØJDE3 * 1000) / gam };
}
const luftTekst = (m) => (m >= 1000 ? `ca. ${fmt(m / 1000, 1)} km` : `ca. ${fmt(Math.round(m / 10) * 10)} m`);
// Underteksten for kontakten. Uden Einstein: andelen, der når ned, er e^(−15 km/(v·τ)) (ca. 1 ud af 8 milliarder
// ved 99,9 % og 99,97 %, ca. 1 ud af 10 milliarder ved 99 %).
// Med Einstein: e^(−15 km/(γ·v·τ)), altså ca. 4 % ved 99 %, 36 % ved 99,9 % og 55 % ved 99,965 % (Fable E4, F3: ikke "de fleste",
// for af 24 i tælleren når højst 12 ned i ca. 4 ud af 10 byger).
const andel3 = (b) => Math.exp(-HØJDE3 / (b * C_KM_US * TAU * T.lysurGamma(b)));
const andelTekst = (p) => (p >= 0.45 ? 'ca. halvdelen' : `ca. 1 ud af ${fmt(Math.round(1 / p))}`);
function linje3(tilstand, b) {
  const { gam, luft } = myonTur(b);
  if (tilstand === 0) {
    const milliarder = Math.round(Math.exp(HØJDE3 / (b * C_KM_US * TAU)) / 1e9);
    return `Uden tidsforlængelse går næsten alle i stykker højt oppe. Kun ca. 1 ud af ${fmt(milliarder)} milliarder ville nå ned.`;
  }
  if (tilstand === 1) return `Set fra Jorden går myonens ur ca. ${fmt(gam)} gange langsommere. Derfor når ${andelTekst(andel3(b))} ned i stedet for næsten ingen. At de lever længere i fart, er målt.`;
  return `Set fra myonen går dens ur helt normalt. Til gengæld er luften presset sammen til ${luftTekst(luft)}, og jorden suser op mod den. Samme svar!`;
}
// Linealen: et pænt skridt i meter, så mærkerne står mindst 44 px fra hinanden
const linealSkridt = (pxPrM) => [100, 200, 500, 1000, 5000].find((m) => m * pxPrM >= 44) ?? 5000;
const linealTekst = (m, skridt) => (m === 0 ? (skridt >= 1000 ? '0 km' : '0 m') : m >= 1000 ? `${fmt(m / 1000, m % 1000 ? 1 : 0)} km` : `${m} m`);

// ---------- Scene 4: lampen i togvognen (afsnit 15.7) ----------
// Tiden måles i L/c: den tid, lyset er om at gå vognens længde (L er vognens længde i toget). Ved 60 % er γ = 1,25,
// vognen er 0,8 L set fra perronen, og lyset når bagenden efter 0,5/(γ(1 + β)) = 0,25 og forenden efter
// 0,5/(γ(1 − β)) = 1,0. I toget når det begge efter 0,5.
const FARTER4 = [
  { navn: 'Toget står stille', b: 0 },
  { navn: 'Toget kører 60 % af lysets fart', b: 0.6 },
];
const SKÆRM_LC = 3.2; // sekunder på skærmen for 1 L/c (lyset når enderne efter 1,6 s i toget)
const HOLD4 = 1; // L/c, billedet står færdigt, før lampen blinker igen
const FØR4 = 'Lampen midt i vognen blinker. Set fra toget når lyset begge ender samtidig. Set fra perronen når det bagenden først, for bagenden kører lyset i møde.';
const EFTER4 = 'Begge har ret: Om to ting sker "samtidig", kommer an på, hvem der kigger.';
const STILLE4 = 'Står toget stille, er de to billeder ens: Lyset fra lampen når begge ender samtidig.';
// Hvornår lyset rammer enderne (i L/c) ved farten b
function lys4(b) {
  const gam = T.lysurGamma(b);
  const bag = 0.5 / (gam * (1 + b)), forende = 0.5 / (gam * (1 - b));
  return { gam, tog: 0.5, bag, for: forende, slut: Math.max(0.5, forende) };
}

// ---------- Scene 5: rumtidskortet (afsnit 15.8) ----------
// Op er tid (0-10 år på Jorden), til siden rum (−5 til 5 lysår). Den rejsende flyver lige ud til vendepunktet (x, t)
// og lige hjem. Egentiden for hvert lige stykke er τ = √(t² − x²) (år og lysår, c = 1).
const TSLUT = 10;
const MAKS5 = 0.98; // højst 98 % af lysets fart
const START5 = { x: 4, t: 5 };
const SPIL_TID = 7; // sekunder på skærmen for de 10 år
const HOLD5 = 2.5; // sekunder, urene står ved målet, før "Spil rejsen" stopper
const FREMME5 = 'Op er tid, til siden er rum. Lyset går skråt (de gule streger). Træk i vendepunktet: Den lige streg (at blive hjemme) får altid flest tik.';
// Vendepunktet holdes inden for lyset: t mellem 0,4 og 9,6 år og |x| højst 98 % af den mindste af t og 10 − t
function grænse5(x, t) {
  const tt = Math.max(0.4, Math.min(TSLUT - 0.4, t));
  const g = MAKS5 * Math.min(tt, TSLUT - tt);
  return { x: Math.max(-g, Math.min(g, x)), t: tt, for: Math.abs(x) > g + 1e-9 };
}
// Rejsen: farterne (v/c), γ, egentiden ud og hjem og "nu derhjemme" lige før og lige efter vendingen
function rejse5({ x, t }) {
  const v1 = x / t, v2 = -x / (TSLUT - t);
  const g1 = 1 / Math.sqrt(1 - v1 * v1), g2 = 1 / Math.sqrt(1 - v2 * v2);
  const ud = Math.sqrt(t * t - x * x), hjem = Math.sqrt((TSLUT - t) ** 2 - x * x);
  const før = t - v1 * x, efter = t - v2 * x; // den rejsendes "nu" rammer Jordens streg her (år)
  return { v1, v2, g1, g2, ud, hjem, egen: ud + hjem, før, efter, spring: efter - før };
}

// Scenerne: navn (bjælken og prikkerne), titel (underteksten) og spørgsmålet (Lige nu).
const SCENER = [
  { navn: 'Bolden og lyset', titel: 'Den mærkelige regel', spm: 'Hvorfor skulle tiden overhovedet kunne gå forskelligt?',
    overgang: 'Når lyset ikke kan køre hurtigere, må noget andet give efter. Hvad? Næste: Lysuret.' },
  { navn: 'Lysuret', titel: 'Lysuret: tiden giver efter', spm: 'Hvad giver efter, når lysets fart ikke gør?',
    overgang: 'Er det bare en tanke, eller kan man måle det? Næste: Myonernes kapløb.' },
  { navn: 'Myonerne', titel: 'Myonernes kapløb', spm: 'Er det målt, eller er det bare en tanke?',
    overgang: 'Men vent: Set fra myonen er det Jordens ure, der farer forbi. Så må de gå langsomt set fra myonen. Hvordan kan begge have ret? Næste: "Nu" er ikke det samme for alle.' },
  { navn: '"Nu"', titel: '"Nu" er ikke det samme for alle', spm: 'Hvordan kan begge se den andens ur gå langsomt?',
    overgang: 'Hvem bliver så yngst, når den ene tvilling rejser ud og kommer hjem igen? Næste: Rumtidskortet.' },
  { navn: 'Rumtidskortet', titel: 'Rumtidskortet: Hvem bliver yngst?', spm: 'Hvorfor er det den rejsende, der bliver yngst, og ikke den, der bliver hjemme?',
    overgang: `Prøv det på en rigtig rejse: ${gå('kosmos:tid', '⏳ Rejsen i tid')}` },
];

export default {
  id: 'tidhvorfor',
  navn: 'Hvorfor går tiden langsommere?',
  ikon: '🔦',
  undertitel: 'Lysets mærkelige regel',
  kamera: { retning: [0, 0.15, 1], radius: 30, drej: false },
  tal: [
    ['Lysets fart', 'ca. 300.000 km i sekundet'],
    ['Lysets fart er', 'den samme for alle'],
    ['Et ur ved 87 % af lysets fart', 'går halvt så hurtigt set fra Jorden'],
    ['Teorien', 'Einstein, 1905'],
  ],
  // Siden bygges én gang og skifter ikke med scenen: ét emne pr. scene (scenens titel og dens "Hvorfor?"), og For
  // nørder og Ærligt talt med ét afsnit pr. scene. Teksterne er fra drejebogen (faktatjekket i T5 Trin 0, afsnit 15
  // i docs/fakta-tid/hvorfor-langsommere.md).
  side: {
    kort: 'Hvorfor går et ur langsommere, når det farer af sted? Fem små scener viser det trin for trin, fra lysets mærkelige regel til tvillingen, der kommer yngst hjem.',
    emner: [
      {
        titel: 'Den mærkelige regel',
        tekst: `<p>Lysets fart er ca. 300.000 km i sekundet (ca. 1 milliard km/t). Den er den samme for alle, uanset hvor hurtigt de selv bevæger sig. Det er målt igen og igen. I 1887 ledte Michelson og Morley efter en forskel: Jorden farer om Solen med 30 km i sekundet, så lyset burde gå en anelse hurtigere den ene vej end den anden. De fandt ingen forskel.</p>
          <p>Men hvordan kan det passe? Hvis toget og perronen måler den samme fart for det samme lys, selv om toget kører efter lyset, så må noget andet være anderledes for dem. Fart er jo vej delt med tid. Det, der giver efter, er tiden (og afstanden).</p>`,
      },
      {
        titel: 'Lysuret: tiden giver efter',
        tekst: `<p>Tegn et halvt tik som en trekant: den lige vej op (1), det stykke, spejlene flytter sig, mens lyset er undervejs (1,73), og den skrå vej, lyset går (2). Pythagoras siger 1² + 1,73² = 2², altså 1 + 3 = 4. Den skrå vej er 2 gange så lang, og lyset har den samme fart, så det tager 2 gange så lang tid.</p>
          <p>Om bord mærker du intet. Dit eget ur, dit hjerte og dine tanker går helt normalt for dig. Først når man sammenligner med urene på Jorden, viser forskellen sig.</p>`,
      },
      {
        titel: 'Myonernes kapløb',
        tekst: `<p>${FÆLLES3}</p>
          <p>Myonen er elektronens tunge fætter (ca. 200 gange tungere). Den laves, når den kosmiske stråling (partikler fra rummet) rammer luften. En myon i hvile lever i gennemsnit 2,2 milliontedele sekund. Ved havets overflade suser omkring 100 myoner gennem hver kvadratmeter hvert sekund, også gennem dig.</p>
          <p>Set fra Jorden er turen 15 km lang og tager ca. 50 milliontedele sekund. Men myonens ur går så langsomt, at det kun når ca. 1,3 milliontedele sekund. Set fra myonen er turen kun ca. 400 m, og den tager ca. 1,3 milliontedele sekund. Samme ur, samme svar, to forklaringer: Hvad der er tid for den ene, er afstand for den anden.</p>`,
      },
      {
        titel: '"Nu" er ikke det samme for alle',
        tekst: `<p>Set fra perronen har lyset den samme fart begge veje (den mærkelige regel!). Men bagenden kører lyset i møde, og forenden kører fra det. Derfor når lyset bagenden først. I toget er begge ender lige langt fra lampen, så lyset når dem samtidig. Begge har ret.</p>
          <p>Det løser gåden fra myonerne: For at sammenligne to ure, der er langt fra hinanden, skal man vide, hvad de viser "på samme tid". Og det er de to ikke enige om. Derfor kan begge se den andens ur gå langsomt, uden at nogen tager fejl. Først når de mødes igen, kan de lægge urene ved siden af hinanden. Det er det, rumtidskortet viser.</p>`,
      },
      {
        titel: 'Rumtidskortet: Hvem bliver yngst?',
        tekst: `<p>Hver prik er ét år på den rejsendes eller den hjemmeblevnes eget ur. På et landkort er den lige vej den korteste. I rumtiden er det omvendt: Den lige vej giver mest tid, og en omvej giver mindre. Det skyldes, at rumtidens Pythagoras har et minus: Vejen ud til 4 lysår på 5 år giver 5² − 4² = 3², altså 3 år. Ud og hjem giver 6 år, mens der går 10 år derhjemme.</p>
          <p>De to tvillinger er ikke ligestillede: Kun den rejsendes streg har et knæk. Den rejsende vender om og mærker det. Den hjemmeblevne gør ikke.</p>
          <p>Prøv det på en rigtig rejse: ${gå('kosmos:tid', '⏳ Rejsen i tid')}</p>`,
      },
    ],
    videre: [gå('kosmos:tid', '⏳ Rejsen i tid'), gå('kosmos:rumtid', 'Rumtid')],
    nørd: `
      <p><b>Den mærkelige regel:</b> Einstein fortalte selv mange år senere, at han som 16-årig forestillede sig at løbe efter en lysstråle med lysets fart. Så burde lyset se ud, som om det stod stille. Men sådan noget lys findes ikke. I 1905 byggede han relativitetsteorien på to regler: Fysikkens love er de samme for alle, der bevæger sig jævnt, og lysets fart er den samme, uanset hvor hurtigt lampen bevæger sig.</p>
      <p>Farter lægges i virkeligheden sammen med w = (u + v)/(1 + u·v/c²). Bolden flyver derfor ikke præcis 150 km/t. Den mangler ca. 6 · 10⁻¹³ km/t, under en milliontedel millimeter i timen. Ved store farter kan man se det: Kører toget 50 % af lysets fart og kaster bolden 50 % fremad, flyver bolden 80 %, ikke 100 %. Og med lyset (u = c) giver formlen altid c.</p>
      <p><b>Lysuret:</b> Kald tiden for et tik set fra Jorden for t. På et halvt tik går lyset c·t/2 på skrå, mens spejlene flytter sig v·t/2. Højden er L. Pythagoras: (c·t/2)² = L² + (v·t/2)². Løs for t: t = (2L/c) · 1/√(1 − v²/c²). Det sidste stykke er γ (gamma), tidsforlængelsen. Ved 50 % er γ = 1,15, ved 87 % 2, ved 95 % 3,2 og ved 99 % 7,1.</p>
      <p>Hvorfor skal alt følge med? Hvis dit hjerte fulgte lysuret, men dit armbåndsur ikke gjorde, kunne du se på urene, at skibet bevæger sig. Men fysikken er den samme for alle, der bevæger sig jævnt (den første af Einsteins to regler). Så alt følger med.</p>
      <p><b>Myonernes kapløb:</b> Rossi og Hall målte i 1940 myonerne højt oppe på et bjerg i Colorado og længere nede i Denver. Myonerne fór over 99 % af lysets fart, og der kom flere ned, end der burde uden tidsforlængelse. Frisch og Smith gjorde det mere præcist i 1962 og filmede det: På toppen af Mount Washington (1.917 m) talte de ca. 563 myoner i timen. Uden tidsforlængelse skulle der kun være kommet ca. 27 i timen ned til havet, men de talte ca. 412. Det tydeligste forsøg er fra CERN i 1977: Myoner, der kørte rundt i en ring med γ = 29,3, levede 64,4 milliontedele sekund i stedet for 2,2, altså ca. 29 gange længere.</p>
      <p>Typiske myoner ved jorden har en energi på ca. 4 GeV (γ ≈ 38). Deres gennemsnitlige vej bliver ca. 25 km i stedet for 660 m.</p>
      <p><b>"Nu" er ikke det samme for alle:</b> I animationen kører toget 60 % af lysets fart. Set fra perronen er vognen også kortere (80 % af sin længde), og lyset når bagenden efter 0,25 og forenden efter 1,0 (målt i den tid, lyset er om at gå vognens længde). I toget når det begge efter 0,5.</p>
      <p>For en rigtig togvogn på 20 m ved 100 km/t er forskellen ca. 6 femtosekunder (6 milliontedele af en milliardtedel sekund). Derfor har ingen nogensinde mærket det i hverdagen. Einstein forklarede det selv i en bog fra 1917 med to lyn, der rammer hver sin ende af et tog.</p>
      <p><b>Rumtidskortet:</b> Tænd "Vis den rejsendes 'nu'". Hver stiplede linje viser, hvad der sker derhjemme "lige nu" set fra den rejsende (scene 4). Med vendepunktet 4 lysår ude regner den rejsende på vejen ud med, at Jordens ur går langsomt: Efter 3 år i skibet er der kun gået 1,8 år derhjemme. Det samme på vejen hjem. Men i vendingen springer "nu derhjemme" fra 1,8 til 8,2 år. Dér ligger de manglende år.</p>
      <p>Det er ikke accelerationen, der gør det: Man kan tænke sig en rejse, hvor begge ure speeder op og bremser lige meget og alligevel kommer forskelligt hjem. Og i CERN's ring fulgte myonernes ure kun farten, selv om de blev slynget rundt med ca. en milliard milliarder g. Det er vejens længde, der tæller.</p>
      <p>Formlen for et lige stykke er <span class="formel">τ² = t² − (x/c)²</span>. Tiden på ens eget ur kaldes egentiden, og den lige streg giver mest. Tæt på lysets streger bliver der næsten ingen tid, men lyset selv har ikke noget ur.</p>`,
    ærligt: `<p><b>Den mærkelige regel:</b> Et tog kan ikke køre med en mærkbar del af lysets fart, og lyset er tegnet meget langsommere, end det er. Men det har den samme fart i begge billeder. Billederne viser, hvad man ville måle, ikke hvad øjet ser (lyset skal også nå frem til øjet).</p>
      <p><b>Lysuret:</b> Lysuret er et tankeeksperiment, som står i de fleste lærebøger. Man kan ikke se lysglimtet undervejs. Animationen viser, hvad man ville regne sig frem til. "87 %" er 86,6 %, hvor γ er præcis 2. Lysuret trin for trin står også i Rejsen i tid.</p>
      <p><b>Myonernes kapløb:</b> Myonerne taber fart på vejen ned, luften er tyndere foroven, og ikke alle laves præcis 15 km oppe. Tallene i animationen er en enkel udregning. Levetiden er et gennemsnit: Nogle myoner går i stykker før, andre efter, helt tilfældigt (som atomkerner, der henfalder). Man kan ikke se myonerne. Man måler dem med en detektor. Animationen er sat meget ned i fart, og "Set fra myonen" endnu mere (urene viser de rigtige tider).</p>
      <p><b>"Nu" er ikke det samme for alle:</b> "Set fra perronen" er ikke det, øjet ser: Lyset skal også nå frem til den, der kigger. Det er det, man får, når man har trukket lysets rejsetid fra (eller har ure i takt langs hele perronen). Et tog kan heller ikke køre 60 % af lysets fart.</p>
      <p><b>Rumtidskortet:</b> Springet fra 1,8 til 8,2 år sker ikke derhjemme. Det er den rejsendes måde at regne "nu" på, der skifter, når skibet vender. Med en kikkert ville den rejsende se Jordens ur vise 1 år ved vendingen og derefter gå 3 gange så hurtigt. Vendingen er tegnet som et knæk. I virkeligheden tager det tid at vende, og det koster masser af energi. Rejsen går lige ud og hjem med fast fart.</p>`,
  },

  lav(gruppe, { fase, forklaring, overlag, opdaterKnapper, sætKontakt }) {
    // ---------- Lærredet i overlaget ----------
    const holder = document.createElement('div');
    holder.className = 'tidh';
    const lærred = document.createElement('canvas');
    lærred.setAttribute('role', 'img');
    holder.append(lærred);
    const lag = overlag();
    lag.append(holder);
    const vindue = lag.closest('.vindue');
    const bund = lag.parentElement; // .vindue-bund: overlaget, underteksten og bjælken
    let W = 600, H = 300; // lærredets størrelse i CSS-pixel

    let aktiv = 0; // scenen (0-4)
    const sc1 = { bold: true, fart: 0, t: 0 }; // scene 1: bolden eller lygten, togets fart og tiden i kastet
    const sc2 = { fart: T.LYSUR_START, trekant: false, ur: Lys.nytUr(), sidst: null }; // scene 2 (sidst: trekanten)
    // Scene 3: kontakten (0-2), farten, bygens levetider (µs på myonens eget ur) og pladser, tiden i turen (µs på
    // Jorden, i "Set fra myonen" på myonens ur), fasen ('klem', 'zoom' eller 'løb'), og om den fælles sætning står
    const sc3 = { tilstand: 1, fart: FARTER3.length - 1, liv: [], xs: [], t: 0, fase: 'løb', faseT: 0, hold: 0, fælles: true };
    // Scene 4: farten (0 eller 1 i FARTER4), tiden siden blinket (L/c), og om forenden er ramt (så skifter underteksten)
    const sc4 = { fart: 1, t: 0, efter: false };
    // Scene 5: vendepunktet (lysår, år), om man trækker, "nu"-linjerne, "Spil rejsen" (T: år på Jorden) og advarslen
    const sc5 = { p: { ...START5 }, træk: false, nu: false, spil: false, T: 0, advar: 0 };

    const lille = () => W < 520;
    const skrift = () => (lille() ? 12 : 14);
    let g = null;
    const tekst = (s, x, y, o = {}) => Lys.tekst(g, s, x, y, { farve: FARVE.tekst, str: skrift(), ...o });
    function panel(x, y, w, h, titel, aktivt = false) {
      Lys.boks(g, x, y, w, h, { aktiv: aktivt, klip: false, r: 12 });
      if (titel) tekst(titel, x + 12, y + skrift() + 7, { side: 'left', farve: FARVE.svag });
    }
    function pil(x1, y, x2, farve, label) {
      const ret = Math.sign(x2 - x1) || 1;
      g.strokeStyle = farve;
      g.fillStyle = farve;
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x1, y);
      g.lineTo(x2 - ret * 6, y);
      g.stroke();
      g.beginPath();
      g.moveTo(x2, y);
      g.lineTo(x2 - ret * 8, y - 5);
      g.lineTo(x2 - ret * 8, y + 5);
      g.closePath();
      g.fill();
      if (label) tekst(label, (x1 + x2) / 2, y - 7, { farve, str: skrift() - 1 });
    }

    // ---------- Scene 1: bolden og lyset (to billeder over hinanden) ----------
    const hoejde1 = () => 2 * Math.max(132, Math.min(170, W * 0.26)) + 10;
    function tegn1() {
      const ph = (H - 10) / 2, t = sc1.t, lys = !sc1.bold;
      const b = FARTER1[sc1.fart].b, hverdag = sc1.fart === 0;
      // Skærmens skala: ved 100 km/t med bolden i km/t, ellers med lysets fart (den samme i begge billeder)
      const C = 0.22 * W; // lysets fart på skærmen (pixel pr. sekund)
      const gam = hverdag ? 1 : T.lysurGamma(b);
      let vS, uS, wS; // togets, boldens (set fra toget) og boldens fart set fra perronen
      if (hverdag && !lys) { const k = 0.0012 * W; vS = 100 * k; uS = 50 * k; wS = 150 * k; }
      else if (hverdag) { vS = 0; uS = C; wS = C; }
      else { vS = b * C; uS = lys ? C : 0.5 * C; wS = lys ? C : læggesSammen(0.5, b) * C; }
      const Ltog = 0.3 * W, P = 0.12 * W; // togets længde og afstanden mellem pælene, når de står stille
      const h1 = Math.min(40, ph * 0.3);
      const tegnTog = (x0, y, L) => {
        g.fillStyle = FARVE.tog;
        g.strokeStyle = 'rgba(160,190,255,0.5)';
        g.lineWidth = 1;
        g.beginPath();
        g.roundRect(x0, y - h1, L, h1, [4, Math.min(16, L * 0.25), 4, 4]);
        g.fill();
        g.stroke();
        const n = Math.max(2, Math.round(L / 34));
        g.fillStyle = 'rgba(190,220,255,0.35)';
        for (let i = 0; i < n; i++) g.fillRect(x0 + 6 + i * ((L - 18) / n), y - h1 + 6, Math.max(4, (L - 18) / n - 6), h1 * 0.38);
        g.fillStyle = '#ffd9a8'; // kasteren i det forreste vindue
        g.beginPath();
        g.arc(x0 + L - 12, y - h1 + 12, 4, 0, Math.PI * 2);
        g.fill();
      };
      const ting = (x, y) => {
        if (lys) Lys.glimt(g, x, y, 5);
        else {
          g.fillStyle = FARVE.bold;
          g.beginPath();
          g.arc(x, y, 5.5, 0, Math.PI * 2);
          g.fill();
        }
      };
      const pælene = (y0, forskydning, afstand) => {
        g.strokeStyle = 'rgba(150,170,220,0.35)';
        g.lineWidth = 2;
        const start = ((forskydning % afstand) + afstand) % afstand;
        for (let x = start - afstand; x < W + afstand; x += afstand) {
          g.beginPath();
          g.moveTo(x, y0);
          g.lineTo(x, y0 - 22);
          g.stroke();
        }
        g.strokeStyle = 'rgba(150,170,220,0.5)';
        g.beginPath();
        g.moveTo(0, y0 + 0.5);
        g.lineTo(W, y0 + 0.5);
        g.stroke();
      };
      const boldTog = hverdag ? '50 km/t' : '50 % af lysets fart';
      const boldPerron = hverdag ? '150 km/t' : `${boldProcent(sc1.fart)} % af lysets fart`;
      const togNavn = hverdag ? '100 km/t' : FARTER1[sc1.fart].navn;
      // Hjørneteksten skjules, når billedet er lavt (telefon på langs), så den ikke rammer pilens tekst
      const hjørne = (s) => { if (ph >= 120) tekst(s, W - 12, skrift() + 7, { side: 'right', farve: FARVE.svag, str: skrift() - 1, vægt: 500 }); };
      const pilFarve = lys ? FARVE.skrå : FARVE.bold;

      // Øverst: set fra toget (toget står stille, og perronen glider baglæns med pælene γ gange tættere)
      g.save();
      panel(0, 0, W, ph, 'Set fra toget');
      const y1 = ph - 26, xa = 0.04 * W;
      pælene(y1 + 4, -vS * t, P / gam);
      tegnTog(xa, y1, Ltog);
      const xo1 = xa + Ltog + uS * t;
      if (xo1 < W + 10) ting(xo1, y1 - h1 * 0.55);
      pil(xa + Ltog + 4, y1 - h1 - 16, xa + Ltog + 4 + Math.max(36, Math.min(0.25 * W, uS * 0.9)), pilFarve, lys ? 'lyset: lysets fart' : `bolden: ${boldTog}`);
      if (vS > 0) hjørne(`← perronen: ${togNavn}`);
      else if (lys) hjørne('100 km/t er næsten ingenting mod lysets fart');
      g.restore();

      // Nederst: set fra perronen (toget kører, og det er γ gange kortere ved høj fart)
      g.save();
      g.translate(0, ph + 10);
      panel(0, 0, W, ph, 'Set fra perronen');
      const y2 = ph - 26;
      pælene(y2 + 4, 0, P);
      const L2 = Ltog / gam, xr = 0.04 * W + vS * t;
      tegnTog(xr, y2, L2);
      const xo2 = 0.04 * W + L2 + wS * t; // tingen starter ved forenden (ved t = 0)
      if (xo2 < W + 10) ting(xo2, y2 - h1 * 0.55);
      pil(xr + L2 + 4, y2 - h1 - 16, xr + L2 + 4 + Math.max(36, Math.min(0.3 * W, wS * 0.9)), pilFarve, lys ? (b > 0 ? 'lyset: lysets fart (ikke mere!)' : 'lyset: lysets fart') : `bolden: ${boldPerron}`);
      if (vS > 0) hjørne(`toget: ${togNavn} →`);
      g.restore();
    }

    // ---------- Scene 2: lysuret (ved siden af hinanden på brede skærme, over hinanden under 560 px) ----------
    const hoejde2 = () => (W >= BRED2 ? Math.max(250, Math.min(330, W * 0.4)) : 2 * (Math.min(130, W * 0.32) + 62) + 10);
    function geo2() {
      const bred = W >= BRED2, sk = skrift(), top = sk + 22;
      const sw = Math.min(40, (bred ? (W - 10) * 0.32 : W) * 0.18);
      if (bred) {
        const ws = (W - 10) * 0.32, we = W - 10 - ws;
        const L = Math.max(40, Math.min(H - top - sk - 22, we * 0.42));
        return { bred, ws, we, hs: H, hE: H, L, top, sw, xE: ws + 10, yE: 0, xs0: sw / 2 + 14, c: (2 * L) / Lys.LYS_TIK };
      }
      const L = Math.max(40, Math.min(130, W * 0.32, (H - 10) / 2 - 62));
      const hs = (H - 10) / 2;
      return { bred, ws: W, we: W, hs, hE: hs, L, top: top + Math.max(0, (hs - L - 62) / 2), sw, xE: 0, yE: hs + 10, xs0: sw / 2 + 14, c: (2 * L) / Lys.LYS_TIK };
    }
    function tegn2() {
      const G = geo2(), v = T.LYSUR_FARTER[sc2.fart], gam = T.lysurGamma(v), ur = sc2.ur;
      const tri = ur.stille && v > 0;
      const tikTekst = (n) => `Tik: ${T.tal(Math.floor(n + 1e-9))}`;
      // I skibet
      g.save();
      panel(0, 0, G.ws, G.hs, lille() ? 'I skibet' : 'Set i skibet');
      g.beginPath();
      g.roundRect(0, 0, G.ws, G.hs, 12);
      g.clip();
      Lys.tegnSkibUr(g, ur, { x: G.ws / 2, top: G.top, L: G.L, sw: G.sw, lige: tri });
      tekst(tri ? 'lige vej: 1' : tikTekst(ur.skib), G.ws / 2, G.hs - 10, { farve: tri ? FARVE.lige : FARVE.tik, vægt: 700 });
      g.restore();
      // Set fra Jorden
      g.save();
      g.translate(G.xE, G.yE);
      panel(0, 0, G.we, G.hE, v > 0 ? 'Set fra Jorden: skibet farer forbi →' : 'Set fra Jorden: skibet står stille');
      g.beginPath();
      g.roundRect(0, 0, G.we, G.hE, 12);
      g.clip();
      if (tri) {
        sc2.sidst = Lys.tegnTrekant(g, { v, top: G.top, L: G.L, sw: G.sw, we: G.we, hE: G.hE, skrift: skrift() });
      } else {
        sc2.sidst = null;
        Lys.tegnJordUr(g, ur, { v, top: G.top, L: G.L, sw: G.sw, xs0: G.xs0, we: G.we, kant: 10 });
        tekst(tikTekst(ur.jord), G.we / 2, G.hE - 10, { farve: FARVE.tik, vægt: 700 });
        if (v > 0) tekst(`γ = ${fmt(gam, erTo(gam) ? 0 : 2)}`, G.we - 10, G.hE - 10, { side: 'right', farve: FARVE.svag, vægt: 500 });
      }
      g.restore();
    }

    // ---------- Scene 3: myonernes kapløb (en høj søjle af luft) ----------
    // De samme levetider bruges i alle tre kontakter, til man trykker "↻ Ny byge". En myon går i stykker, når dens
    // eget ur når dens levetid. Uden Einstein går dens ur som Jordens, med Einstein γ gange langsommere, og set fra
    // myonen går det normalt, men luften er γ gange kortere og suser op mod den.
    function nyByge3(liv) {
      sc3.liv = liv ? [...liv] : Array.from({ length: N_MYON }, nyLevetid);
      sc3.xs = sc3.liv.map((_, i) => (i + 0.5 + (Math.random() - 0.5) * 0.6) / sc3.liv.length);
      forfra3();
    }
    function forfra3() {
      sc3.t = 0;
      sc3.hold = 0;
      sc3.faseT = 0;
      sc3.fase = sc3.tilstand === 2 && !ROLIG ? 'klem' : 'løb'; // Reducer bevægelse: luften står straks klemt
    }
    nyByge3();
    const tur3 = () => myonTur(FARTER3[sc3.fart].b);
    const varighed3 = () => (sc3.tilstand === 2 ? tur3().egen : tur3().jord);
    const færdig3 = () => sc3.fase === 'løb' && sc3.t >= varighed3();
    // Myonens ur (µs): Uden Einstein som Jordens, med Einstein γ gange langsommere, set fra myonen turens tid (0, mens
    // luften klemmes og billedet zoomer)
    const myonUr3 = () => (sc3.tilstand === 0 ? sc3.t : sc3.tilstand === 1 ? sc3.t / tur3().gam : sc3.fase === 'løb' ? sc3.t : 0);
    const lever3 = (i) => myonUr3() < sc3.liv[i];
    // Hvor meget luften er klemt (1 = 15 km) og billedet zoomet ind (blødt fra 1 til γ)
    function klemZoom3() {
      if (sc3.tilstand !== 2) return { klem: 1, zoom: 1 };
      const gam = tur3().gam, blød = (u) => u * u * (3 - 2 * u);
      if (sc3.fase === 'klem') return { klem: 1 + (gam - 1) * blød(Math.min(1, sc3.faseT / (KLEM_TID - 0.2))), zoom: 1 };
      if (sc3.fase === 'zoom') return { klem: gam, zoom: 1 + (gam - 1) * blød(Math.min(1, sc3.faseT / (ZOOM_TID - 0.1))) };
      return { klem: gam, zoom: gam };
    }
    // Et skridt: Giver true, når den første byge er færdig (så skifter underteksten fra den fælles sætning)
    function skridt3(dt) {
      if (sc3.fase !== 'løb') {
        sc3.faseT += dt;
        if (sc3.fase === 'klem' && sc3.faseT >= KLEM_TID) { sc3.fase = 'zoom'; sc3.faseT = 0; }
        else if (sc3.fase === 'zoom' && sc3.faseT >= ZOOM_TID) { sc3.fase = 'løb'; sc3.faseT = 0; }
        return false;
      }
      const varighed = varighed3();
      if (sc3.t < varighed) { sc3.t = Math.min(varighed, sc3.t + (dt * varighed) / SKÆRM_TUR); return false; }
      sc3.hold += dt;
      if (sc3.hold < HOLD3) return false;
      forfra3();
      if (!sc3.fælles) return false;
      sc3.fælles = false;
      return true;
    }
    const titel3 = () => (sc3.tilstand === 0 ? 'Uden Einstein' : sc3.tilstand === 1 ? 'Med Einstein (set fra Jorden)' : 'Set fra myonen');
    // Søjlen til venstre og urene til højre på langs og på brede lærreder, ellers urene øverst
    const side3 = () => W >= BRED3 || window.innerWidth > window.innerHeight;
    const hoejde3 = () => (side3() ? 640 : 1000); // så høj, som der er plads til (søjlen fylder højden på højkant)
    // Kan teksten stå i bredden? (samme skrift som Lys.tekst)
    const passer = (s, str, bredde) => {
      g.font = `500 ${str}px system-ui, -apple-system, "Segoe UI", sans-serif`;
      return g.measureText(s).width <= bredde;
    };
    function tegn3() {
      const { gam, jord: tur, egen } = tur3(), sk = skrift(), bred = side3(), myon = sc3.tilstand === 2;
      const smal = bred && W < 420; // telefon på langs: søjlen får lidt mindre af bredden
      const kx1 = bred ? Math.round(W * (smal ? 0.52 : 0.6)) : W, infoX = kx1 + 10;
      const top = bred ? 50 : 120, bund = H - 52, Hc = Math.max(40, bund - top);
      const mx0 = 46, mx1 = kx1 - 16;
      panel(0, 0, kx1, H, '');
      const tMyon = myonUr3(), { klem, zoom } = klemZoom3();
      const løber = !myon || sc3.fase === 'løb', færdig = færdig3();
      const skala = (Hc / HØJDE3) * (zoom / klem); // px pr. km af luftens egne kilometer
      // Set fra myonen flytter luften sig op, mens turen er i gang (jorden suser op mod myonerne)
      const løft = myon && sc3.fase === 'løb' ? (sc3.t / egen) * Hc : 0;
      const luftBund = top + HØJDE3 * skala - løft, luftTop = luftBund - HØJDE3 * skala;
      g.save();
      g.beginPath();
      g.rect(mx0, top - 4, mx1 - mx0, Hc + 18);
      g.clip();
      const himmel = g.createLinearGradient(0, luftTop, 0, luftBund);
      himmel.addColorStop(0, 'rgba(30,50,120,0.25)');
      himmel.addColorStop(1, 'rgba(70,120,200,0.45)');
      g.fillStyle = himmel;
      g.fillRect(mx0, luftTop, mx1 - mx0, luftBund - luftTop);
      // Luftens 15 kilometermærker (de står tæt, når luften er klemt)
      g.strokeStyle = 'rgba(160,190,255,0.3)';
      g.lineWidth = 1;
      for (let km = 0; km <= HØJDE3; km++) {
        const y = Math.round(luftBund - km * skala) + 0.5;
        g.beginPath();
        g.moveTo(mx0, y);
        g.lineTo(mx0 + 10, y);
        g.stroke();
      }
      // Jorden og detektoren
      g.fillStyle = '#1d3a2a';
      g.fillRect(mx0, luftBund, mx1 - mx0, Hc + 40);
      g.fillStyle = 'rgba(140,233,154,0.8)';
      g.fillRect(mx0 + (mx1 - mx0) * 0.1, luftBund - 4, (mx1 - mx0) * 0.8, 4);
      g.restore();
      // Linealen til venstre: højden over jorden, målt af den, der kigger (km, og m, når luften er klemt)
      const pxPrM = (Hc / (HØJDE3 * 1000)) * zoom, luftM = (HØJDE3 * 1000) / klem, skridt = linealSkridt(pxPrM);
      for (let m = 0; m <= luftM + 1e-6; m += skridt) {
        const y = luftBund - m * pxPrM;
        if (y > top - 6 && y < bund + 6) tekst(linealTekst(m, skridt), mx0 - 6, y + 4, { side: 'right', farve: FARVE.svag, str: sk - 2, vægt: 500 });
      }
      const stråling = passer('Den kosmiske stråling rammer luften', sk - 1, mx1 - mx0 + 30) ? 'Den kosmiske stråling rammer luften' : 'Kosmisk stråling';
      tekst(stråling, (mx0 + mx1) / 2, top - 22, { farve: FARVE.svag, str: sk - 1, vægt: 500 }); // over myonernes små ure
      // Myonerne: Set fra Jorden falder de, set fra myonen står de stille øverst
      let nede = 0;
      const n = sc3.liv.length;
      for (let i = 0; i < n; i++) {
        const x = mx0 + 18 + sc3.xs[i] * (mx1 - mx0 - 30), liv = sc3.liv[i];
        if (løber && !lever3(i)) {
          // Hvor den gik i stykker (Jordens tid for det er liv, eller γ·liv med Einstein), og et kort glimt
          const jordLiv = sc3.tilstand === 0 ? liv : liv * gam;
          const y = myon ? top : top + Math.min(1, jordLiv / tur) * Hc;
          const siden = myon ? (tMyon - liv) / (egen / SKÆRM_TUR) : (sc3.t - jordLiv) / (tur / SKÆRM_TUR); // sekunder på skærmen
          if (!ROLIG && siden < 0.5) {
            g.globalAlpha = 1 - siden * 2;
            Lys.glimt(g, x, y, 4);
            g.globalAlpha = 1;
          }
          g.strokeStyle = 'rgba(201,162,255,0.35)';
          g.lineWidth = 1.5;
          g.beginPath();
          g.moveTo(x - 3, y - 3);
          g.lineTo(x + 3, y + 3);
          g.moveTo(x + 3, y - 3);
          g.lineTo(x - 3, y + 3);
          g.stroke();
          continue;
        }
        const y = myon ? top : top + Math.min(1, sc3.t / tur) * Hc;
        if (færdig) nede++;
        g.fillStyle = FARVE.myon;
        g.shadowColor = FARVE.myon;
        g.shadowBlur = 8;
        g.beginPath();
        g.arc(x, y, 4, 0, Math.PI * 2);
        g.fill();
        g.shadowBlur = 0;
        // Det lille ur: én omgang pr. 2,2 µs på myonens eget ur
        const a = (tMyon / TAU) * Math.PI * 2 - Math.PI / 2;
        g.strokeStyle = 'rgba(230,220,255,0.7)';
        g.lineWidth = 1;
        g.beginPath();
        g.arc(x, y - 12, 5, 0, Math.PI * 2);
        g.stroke();
        g.beginPath();
        g.moveTo(x, y - 12);
        g.lineTo(x + 4 * Math.cos(a), y - 12 + 4 * Math.sin(a));
        g.stroke();
      }
      tekst(færdig ? `Nåede ned: ${nede} af ${n}` : `Myoner i luften: ${n}`, (mx0 + mx1) / 2, H - 18, { farve: færdig ? FARVE.grøn : FARVE.tekst, vægt: 700, str: sk + 1 });
      // Urene, farten og luftens længde (Jordens ur vises ikke set fra myonen: det er samtidigheden fra scene 4)
      // Hver linje er [navn, værdi, farve]
      const klemt = myon && klem > 1.01, infoW = W - infoX;
      const linjer = [];
      if (!myon) linjer.push(['Jordens ur', `${fmt(sc3.t, 1)} µs`, FARVE.lige]);
      linjer.push(['Myonens ur', `${fmt(tMyon, 2)} µs`, FARVE.myon]);
      linjer.push(['Fart', `${FARTER3[sc3.fart].navn.replace(' (typisk)', '')} · γ = ${fmt(gam, gam > 30 ? 0 : 1)}`, FARVE.svag]);
      linjer.push([klemt ? (bred && infoW < 200 ? 'Luften (presset)' : 'Luften (presset sammen)') : 'Luften', klemt ? luftTekst(luftM) : '15 km', FARVE.svag]);
      if (myon && !løber) linjer.push(['', sc3.fase === 'klem' ? 'Luften klemmes …' : `Zoom ind ${fmt(gam, 0)} gange …`, FARVE.skrå]);
      if (bred) {
        // På langs: urene til højre, navnet over værdien
        const titel = passer(titel3(), sk, infoW - 24) ? titel3() : TILSTANDE3[sc3.tilstand];
        panel(infoX, 0, infoW, H, titel);
        const rh = H < 300 ? 30 : 42;
        let y = sk + 7 + (H < 300 ? 22 : 34);
        for (const [navn, værdi, f] of linjer) {
          if (navn) tekst(navn, infoX + 12, y, { side: 'left', farve: FARVE.svag, str: sk - 2, vægt: 500 });
          tekst(værdi, infoX + 12, y + sk + 2, { side: 'left', farve: f, str: smal ? sk - 1 : sk + 1, vægt: 700 });
          y += rh;
        }
        if (H - 40 > y + 10 && passer('1 omgang på det lille ur = 2,2 µs', sk - 2, infoW - 24)) {
          tekst('1 omgang på det lille ur = 2,2 µs', infoX + 12, H - 40, { side: 'left', farve: FARVE.svag, str: sk - 2, vægt: 500 });
          tekst('(myonens gennemsnitlige liv)', infoX + 12, H - 22, { side: 'left', farve: FARVE.svag, str: sk - 2, vægt: 500 });
        }
      } else {
        // På højkant: urene øverst
        const linje = ([navn, værdi]) => (navn ? `${navn}: ${værdi}` : værdi);
        tekst(titel3(), 12, 22, { side: 'left', farve: FARVE.svag });
        linjer.slice(0, 2).forEach((l, i) => tekst(linje(l), 12, 44 + i * 20, { side: 'left', farve: l[2], str: sk }));
        linjer.slice(2).forEach((l, i) => tekst(linje(l), W - 12, 44 + i * 20, { side: 'right', farve: l[2], str: sk - 1, vægt: 500 }));
      }
    }

    function streg(x1, y1, x2, y2, farve, bredde = 2, stiplet = null) {
      g.strokeStyle = farve;
      g.lineWidth = bredde;
      g.setLineDash(stiplet || []);
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.stroke();
      g.setLineDash([]);
    }
    function prik(x, y, r, farve) {
      g.fillStyle = farve;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }

    // ---------- Scene 4: lampen i togvognen (altid to billeder over hinanden) ----------
    // Lyset har den samme fart på skærmen i begge billeder: én vognlængde (i toget) pr. L/c.
    const hoejde4 = () => 2 * Math.max(140, Math.min(170, W * 0.3)) + 10; // plads over vognen til numrene og forklaringen
    const ramt4 = () => {
      const L = lys4(FARTER4[sc4.fart].b), t = sc4.t;
      return { tog: t >= L.tog, bag: t >= L.bag, for: t >= L.for };
    };
    // Et skridt (dt i sekunder på skærmen). Giver true, når underteksten skal skifte (forenden er ramt første gang).
    function skridt4(dt) {
      const L = lys4(FARTER4[sc4.fart].b);
      sc4.t += dt / SKÆRM_LC;
      let skift = false;
      if (!sc4.efter && FARTER4[sc4.fart].b > 0 && sc4.t >= L.for) { sc4.efter = true; skift = true; }
      if (sc4.t > L.slut + HOLD4) sc4.t = 0; // lampen blinker igen
      return skift;
    }
    function tegn4() {
      const ph = (H - 10) / 2, b = FARTER4[sc4.fart].b, L = lys4(b), t = sc4.t, sk = skrift(), ramt = ramt4();
      const vh = Math.min(46, ph * 0.34);
      const Lw = 0.46 * W, c = Lw; // vognens længde i toget (pixel), og lyset går den på 1 L/c
      const stille = b === 0;
      const vogn = (x0, y, l, lampe) => {
        g.fillStyle = FARVE.tog;
        g.strokeStyle = 'rgba(160,190,255,0.5)';
        g.lineWidth = 1;
        g.beginPath();
        g.roundRect(x0, y - vh, l, vh, 5);
        g.fill();
        g.stroke();
        g.fillStyle = 'rgba(190,220,255,0.18)';
        g.fillRect(x0 + 4, y - vh + 6, l - 8, vh * 0.45);
        prik(lampe, y - vh + 6, 4, '#ffe9a8');
      };
      const ende = (x, y, nr) => {
        g.fillStyle = FARVE.skrå;
        g.shadowColor = FARVE.skrå;
        g.shadowBlur = 12;
        g.fillRect(x - 2, y - vh, 4, vh);
        g.shadowBlur = 0;
        if (nr) tekst(nr, x, y - vh - 8, { farve: FARVE.skrå, vægt: 800, str: sk + 1 });
      };
      const pæle = (y0, forskydning, afstand) => {
        const start = ((forskydning % afstand) + afstand) % afstand;
        for (let x = start - afstand; x < W + afstand; x += afstand) streg(x, y0, x, y0 - 16, 'rgba(150,170,220,0.3)', 2);
        streg(0, y0 + 0.5, W, y0 + 0.5, 'rgba(150,170,220,0.5)', 1);
      };
      const blink = (x, y) => {
        if (t >= 0.08 || ROLIG) return;
        g.globalAlpha = 1 - t / 0.08;
        Lys.glimt(g, x, y, 9);
        g.globalAlpha = 1;
      };
      const hjørne = (s) => { if (ph >= 120) tekst(s, W - 12, sk + 7, { side: 'right', farve: FARVE.svag, str: sk - 1, vægt: 500 }); };

      // Øverst: set fra toget (vognen står stille, og perronen glider baglæns med pælene γ gange tættere)
      g.save();
      panel(0, 0, W, ph, 'Set fra toget');
      const y1 = ph - 30, x0 = (W - Lw) / 2, xm = W / 2, ly1 = y1 - vh * 0.45;
      pæle(y1 + 3, -b * c * t, (0.1 * W) / L.gam);
      vogn(x0, y1, Lw, xm);
      blink(xm, y1 - vh + 6);
      if (!ramt.tog) {
        const r = c * t;
        streg(xm - r, ly1, xm + r, ly1, 'rgba(255,210,74,0.25)', 2);
        Lys.glimt(g, xm - r, ly1, 4);
        Lys.glimt(g, xm + r, ly1, 4);
      } else {
        ende(x0, y1, '');
        ende(x0 + Lw, y1, '');
        tekst('samtidig!', xm, y1 - vh - 10, { farve: FARVE.skrå, vægt: 800, str: sk + 2 });
      }
      if (!stille) hjørne('← perronen: 60 % af lysets fart');
      g.restore();

      // Nederst: set fra perronen (vognen kører og er γ gange kortere, og lyset har den samme fart begge veje)
      g.save();
      g.translate(0, ph + 10);
      panel(0, 0, W, ph, 'Set fra perronen');
      const y2 = ph - 30, L2 = Lw / L.gam, xc0 = stille ? W / 2 : 0.3 * W, xc = xc0 + b * c * t, ly2 = y2 - vh * 0.45;
      pæle(y2 + 3, 0, 0.1 * W);
      vogn(xc - L2 / 2, y2, L2, xc);
      blink(xc0, y2 - vh + 6);
      const bagX = xc0 - c * Math.min(t, L.bag), forX = xc0 + c * Math.min(t, L.for);
      if (!ramt.for) {
        streg(ramt.bag ? xc - L2 / 2 : bagX, ly2, forX, ly2, 'rgba(255,210,74,0.25)', 2); // lyset bagud er stoppet af bagenden
        if (!ramt.bag) Lys.glimt(g, bagX, ly2, 4);
        Lys.glimt(g, forX, ly2, 4);
      }
      // Mærker på perronen, hvor lyset ramte
      const mærke = (x, nr) => {
        streg(x, y2 + 3, x, y2 + 12, FARVE.skrå, 2);
        if (nr) tekst(nr, x + 4, y2 + 14 + sk * 0.6, { farve: FARVE.skrå, str: sk - 1, vægt: 700, side: 'left' });
      };
      if (ramt.bag) { ende(xc - L2 / 2, y2, stille ? '' : '1.'); mærke(xc0 - c * L.bag, stille ? '' : '1.'); }
      if (ramt.for) { ende(xc + L2 / 2, y2, stille ? '' : '2.'); mærke(xc0 + c * L.for, stille ? '' : '2.'); }
      if (stille && ramt.for) tekst('samtidig!', xc, y2 - vh - 10, { farve: FARVE.skrå, vægt: 800, str: sk + 2 });
      else if (ramt.bag) tekst(ramt.for ? 'bagenden først!' : 'bagenden …', xc, y2 - vh - 10, { farve: FARVE.skrå, vægt: 800, str: sk + 2 });
      if (!stille) hjørne('toget: 60 % af lysets fart →');
      if (ramt.bag && !stille && ph >= 120) tekst(lille() ? 'stregerne: hvor lyset ramte' : 'stregerne på perronen: hvor lyset ramte', 12, 2 * sk + 14, { side: 'left', farve: FARVE.svag, str: sk - 2, vægt: 500 });
      g.restore();
    }

    // ---------- Scene 5: rumtidskortet (kvadratisk, fylder bredden på højkant) ----------
    const hoejde5 = () => Math.min(W, 620) + 84;
    function geo5() {
      const S = Math.max(120, Math.min(W - 24, H - 118)), ox = W / 2, oy = H - 58, k = S / 10.6; // pixel pr. år (og lysår)
      return { ox, oy, k, X: (x) => ox + x * k, Y: (t) => oy - t * k };
    }
    // Et tryk eller træk på lærredet (CSS-pixel i lærredet): vendepunktet flytter derhen, men ikke uden for lyset
    function sæt5(px, py) {
      const G = geo5();
      const p = grænse5((px - G.ox) / G.k, (G.oy - py) / G.k);
      if (p.for) sc5.advar = 1.6;
      sc5.p = { x: p.x, t: p.t };
      sc5.T = 0;
      if (sc5.spil) { sc5.spil = false; opdaterKnapper(); }
    }
    function skridt5(dt) {
      if (sc5.advar > 0) sc5.advar = Math.max(0, sc5.advar - dt);
      if (!sc5.spil) return;
      sc5.T += (dt * TSLUT) / SPIL_TID;
      if (sc5.T > TSLUT + (HOLD5 * TSLUT) / SPIL_TID) { sc5.spil = false; sc5.T = 0; opdaterKnapper(); }
    }
    function tegn5() {
      const G = geo5(), { X, Y } = G, sk = skrift(), P = sc5.p, R = rejse5(P);
      panel(0, 0, W, H, '');
      // Gitteret
      for (let x = -5; x <= 5; x++) streg(X(x), Y(0), X(x), Y(TSLUT), 'rgba(120,150,210,0.12)', 1);
      for (let t = 0; t <= TSLUT; t++) streg(X(-5), Y(t), X(5), Y(t), 'rgba(120,150,210,0.12)', 1);
      tekst('rum (lysår) →', X(0), Y(0) + 2 * sk + 18, { farve: FARVE.svag, str: sk - 1, vægt: 500 });
      for (let x = -4; x <= 4; x += 2) tekst(fmt(x), X(x), Y(0) + sk + 10, { farve: FARVE.svag, str: sk - 2, vægt: 500 });
      tekst('↑ tid (år)', X(-5), Y(TSLUT) - 8, { side: 'left', farve: FARVE.svag, str: sk - 1, vægt: 500 });
      for (let t = 2; t <= TSLUT; t += 2) tekst(fmt(t), X(-5) - 4, Y(t) + 4, { side: 'right', farve: FARVE.svag, str: sk - 2, vægt: 500 });
      // Lyset: sendt ud ved start og hjem ved slut (45°). Vendepunktet kan kun være inden for de gule streger.
      g.fillStyle = 'rgba(255,210,74,0.05)';
      g.beginPath();
      g.moveTo(X(0), Y(0));
      g.lineTo(X(5), Y(5));
      g.lineTo(X(0), Y(TSLUT));
      g.lineTo(X(-5), Y(5));
      g.closePath();
      g.fill();
      for (const [a, b2, c2, d] of [[0, 0, 5, 5], [0, 0, -5, 5], [5, 5, 0, TSLUT], [-5, 5, 0, TSLUT]]) streg(X(a), Y(b2), X(c2), Y(d), 'rgba(255,210,74,0.55)', 1.5, [5, 5]);
      tekst('lys', X(3.4) + 8, Y(3.4) + 4, { side: 'left', farve: 'rgba(255,210,74,0.8)', str: sk - 2 });
      // Hvor den rejsende er, når der er gået tau år på hendes eller hans eget ur
      const punkt = (tau) => (tau <= R.ud ? { x: R.v1 * tau * R.g1, t: tau * R.g1 } : { x: P.x + R.v2 * (tau - R.ud) * R.g2, t: P.t + (tau - R.ud) * R.g2 });
      // Den rejsendes "nu": en skrå linje med hældningen v/c, der rammer Jordens streg ved t − v·x
      if (sc5.nu) {
        const linje = (q, v) => {
          const th = q.t - v * q.x;
          streg(X(q.x), Y(q.t), X(0), Y(th), 'rgba(255,143,208,0.6)', 1.2, [4, 4]);
          prik(X(0), Y(th), 2.5, FARVE.nu);
        };
        for (let tau = 1; tau < R.ud - 0.05; tau++) linje(punkt(tau), R.v1);
        for (let tau = Math.ceil(R.ud + 0.05); tau < R.egen - 0.05; tau++) linje(punkt(tau), R.v2);
        linje(P, R.v1);
        linje(P, R.v2);
        // Springet derhjemme i vendingen
        const bx = X(0) - 12 * Math.sign(P.x || 1);
        streg(bx, Y(R.før), bx, Y(R.efter), FARVE.nu, 3);
        const sy = (Y(R.før) + Y(R.efter)) / 2, sx = P.x >= 0 ? X(-5) + 4 : X(5) - 4, sd = P.x >= 0 ? 'left' : 'right';
        tekst('springet i "nu"', sx, sy - 4, { side: sd, farve: FARVE.nu, str: sk - 1, vægt: 700 });
        tekst(`derhjemme: ${fmt(R.spring, 1)} år`, sx, sy + sk, { side: sd, farve: FARVE.nu, str: sk - 1, vægt: 700 });
      }
      // Den hjemmeblevne (blå) med en prik for hvert år
      streg(X(0), Y(0), X(0), Y(TSLUT), FARVE.lige, 3);
      for (let t = 1; t <= TSLUT; t++) prik(X(0), Y(t), 3.5, FARVE.lige);
      // Den rejsende (gul) med en prik for hvert år på eget ur
      streg(X(0), Y(0), X(P.x), Y(P.t), FARVE.skrå, 3);
      streg(X(P.x), Y(P.t), X(0), Y(TSLUT), FARVE.skrå, 3);
      for (let tau = 1; tau <= R.egen + 1e-9; tau++) { const q = punkt(tau); prik(X(q.x), Y(q.t), 3.5, FARVE.skrå); }
      // Vendepunktet: en stor prik (44 px), så den er let at ramme. Et tryk hvor som helst på kortet flytter den også.
      g.fillStyle = 'rgba(255,210,74,0.18)';
      g.beginPath();
      g.arc(X(P.x), Y(P.t), 22, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = FARVE.skrå;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(X(P.x), Y(P.t), 11, 0, Math.PI * 2);
      g.stroke();
      const højre = P.x >= 0 ? X(P.x) + 66 < W : X(P.x) - 66 < 0; // "træk" står på den side, hvor der er plads
      tekst('træk', X(P.x) + (højre ? 26 : -26), Y(P.t) + 4, { side: højre ? 'left' : 'right', farve: FARVE.skrå, str: sk - 1 });
      // "Spil rejsen": to små ure kører langs stregerne (Jordens tid T)
      if (sc5.spil) {
        const T5 = Math.min(TSLUT, sc5.T);
        const rx = T5 <= P.t ? R.v1 * T5 : P.x + R.v2 * (T5 - P.t);
        const rTau = T5 <= P.t ? T5 / R.g1 : R.ud + (T5 - P.t) / R.g2;
        prik(X(0), Y(T5), 6, '#fff');
        prik(X(rx), Y(T5), 6, '#fff');
        tekst(`${fmt(T5, 1)} år`, X(0) - 10, Y(T5) - 8, { side: 'right', farve: FARVE.lige, vægt: 700 });
        tekst(`${fmt(rTau, 1)} år`, X(rx) + (P.x >= 0 ? 10 : -10), Y(T5) - 8, { side: P.x >= 0 ? 'left' : 'right', farve: FARVE.skrå, vægt: 700 });
      }
      // Tallene øverst
      const fart = (v) => `${fmt(Math.abs(v) * 100)} %`;
      tekst(`Hjemme: ${fmt(TSLUT)} år`, 14, 24, { side: 'left', farve: FARVE.lige, vægt: 700, str: sk + 1 });
      tekst(`Rejsende: ${fmt(R.egen, 1)} år`, 14, 46, { side: 'left', farve: FARVE.skrå, vægt: 700, str: sk + 1 });
      const ens = Math.abs(Math.abs(R.v1) - Math.abs(R.v2)) < 0.005;
      tekst(ens ? `${fart(R.v1)} af lysets fart` : `ud: ${fart(R.v1)} · hjem: ${fart(R.v2)}`, W - 14, 24, { side: 'right', farve: FARVE.svag, str: sk - 1, vægt: 500 });
      if (sc5.advar > 0) tekst('Hurtigere end lyset kan man ikke!', W / 2, Y(TSLUT) + 18, { farve: FARVE.rød, vægt: 800, str: sk + 1 });
    }
    // Træk i vendepunktet (kun i scene 5: her tager lærredet imod fingeren, og siden ruller ikke, mens man trækker)
    const iLærred = (e) => {
      const r = lærred.getBoundingClientRect();
      return [((e.clientX - r.left) * W) / (r.width || W), ((e.clientY - r.top) * H) / (r.height || H)];
    };
    lærred.addEventListener('pointerdown', (e) => {
      if (aktiv !== 4) return;
      sc5.træk = true;
      try { lærred.setPointerCapture(e.pointerId); } catch { /* ikke vigtigt */ }
      sæt5(...iLærred(e));
      e.preventDefault();
    });
    lærred.addEventListener('pointermove', (e) => { if (aktiv === 4 && sc5.træk) sæt5(...iLærred(e)); });
    const slip = () => { sc5.træk = false; };
    lærred.addEventListener('pointerup', slip);
    lærred.addEventListener('pointercancel', slip);

    const scene = () => [
      { hoejde: hoejde1, tegn: tegn1 },
      { hoejde: hoejde2, tegn: tegn2 },
      { hoejde: hoejde3, tegn: tegn3 },
      { hoejde: hoejde4, tegn: tegn4 },
      { hoejde: hoejde5, tegn: tegn5 },
    ][aktiv];

    // ---------- Lærredets størrelse ----------
    // Bredden følger 3D-billedet (højst MAKS_BREDDE). Højden er scenens egen, men højst det, der er plads til mellem
    // Styr-boksen (eller toppen af billedet) og underteksten med bjælken.
    function størrelse() {
      if (!vindue || !bund) return;
      // Fanerne, der skjuler panelerne (‹ og › midt på kanterne), skal ikke dække lærredet
      const faner = [...vindue.querySelectorAll(':scope > .panel-fane')].some((f) => f.offsetWidth > 0) ? 36 : 0;
      const nyW = Math.max(240, Math.min(MAKS_BREDDE, bund.clientWidth - faner));
      const vR = vindue.getBoundingClientRect();
      // Underteksten, bjælken og mellemrummene (målt hver for sig: .vindue-bund har en største højde og bliver ikke højere)
      const mellemrum = parseFloat(getComputedStyle(bund).rowGap) || 6;
      const andre = [...bund.children].filter((e) => e !== lag && e.offsetHeight > 0).reduce((sum, e) => sum + e.offsetHeight + mellemrum, 0);
      // Underteksten og bjælken holdes også øje med: Når lærredet fylder pladsen, har .vindue-bund sin største højde og
      // skifter ikke størrelse, når de bliver højere. Så ville lærredet blive skubbet op under Styr-boksen (T5c).
      for (const e of bund.children) if (e !== lag && iagt && !iagttaget.has(e)) { iagttaget.add(e); iagt.observe(e); }
      const styr = vindue.querySelector('.styr');
      const sR = styr && styr.offsetHeight > 0 ? styr.getBoundingClientRect() : null;
      const øverst = Math.max(vR.top + 44, sR ? sR.bottom + 8 : 0);
      const plads = vR.bottom - 8 - andre - øverst;
      W = nyW;
      const nyH = Math.round(Math.max(150, Math.min(scene().hoejde(), plads)));
      if (Math.abs(nyH - H) < 1 && holder.style.width === `${W}px`) return;
      H = nyH;
      holder.style.width = `${W}px`;
      lærred.style.height = `${H}px`;
    }
    const iagt = typeof ResizeObserver === 'function' ? new ResizeObserver(() => størrelse()) : null;
    const iagttaget = new WeakSet(); // underteksten og bjælken, når de er iagttaget (størrelse())
    if (iagt && vindue) {
      iagt.observe(vindue);
      iagt.observe(bund);
      const styr = vindue.querySelector('.styr');
      if (styr) iagt.observe(styr);
    }

    function tegn() {
      g = Lys.klarLærred(lærred, W, H);
      scene().tegn();
    }

    // ---------- Teksterne: underteksten (altid fremme) og Lige nu ----------
    function fremme() {
      if (aktiv === 0) {
        if (!sc1.bold) return LYS_TEKST;
        if (sc1.fart === 0) return BOLD_TEKST;
        return `Ved så store farter lægges farterne ikke helt sammen: Bolden flyver ${boldProcent(sc1.fart)} % af lysets fart, ikke ${fmt((0.5 + FARTER1[sc1.fart].b) * 100)} %. Se For nørder.`;
      }
      if (aktiv === 1) {
        const v = T.LYSUR_FARTER[sc2.fart], gam = T.lysurGamma(v);
        if (sc2.ur.stille && v > 0) return `Ved ${T.lysurFartTekst(v)} er den skrå vej ${gangeTekst(gam)} gange så lang som den lige. Derfor tager hvert tik ${gangeTekst(gam)} gange så lang tid set fra Jorden.`;
        if (sc2.ur.stille) return 'Står skibet stille, er der ingen skrå vej. Lyset går lige op og ned i begge billeder.';
        return LIGE_TEKST;
      }
      if (aktiv === 2) return sc3.fælles ? FÆLLES3 : linje3(sc3.tilstand, FARTER3[sc3.fart].b);
      if (aktiv === 3) return FARTER4[sc4.fart].b === 0 ? STILLE4 : sc4.efter ? EFTER4 : FØR4;
      return FREMME5;
    }
    function visTekst() {
      const s = SCENER[aktiv];
      fase(s.titel, fremme(), [aktiv + 1, SCENER.length]);
      lærred.setAttribute('aria-label', `Scene ${aktiv + 1}: ${s.titel}. ${fremme()}`);
      forklaring(`<p><b>Scene ${aktiv + 1} af ${SCENER.length}:</b> ${s.spm}</p>${s.overgang ? `<p>${s.overgang}</p>` : ''}`);
    }

    // ---------- Styringen (skifter med scenen) ----------
    const boldKontakter = [
      { tekst: '⚾ Bold', bold: true },
      { tekst: '🔦 Lygte', bold: false },
    ].map((k) => ({
      tekst: k.tekst, til: sc1.bold === k.bold,
      skift: () => {
        // Præcis én er tændt: Et tryk på den, der allerede er valgt, slukker den ikke
        for (const bk of boldKontakter) { bk.til = bk.tekst === k.tekst; sætKontakt(bk.tekst, bk.til); }
        if (sc1.bold === k.bold) return;
        sc1.bold = k.bold;
        sc1.t = 0;
        visTekst();
      },
    }));
    const fart1 = {
      skyder: true, navn: 'Togets fart', min: 0, max: FARTER1.length - 1, værdi: sc1.fart, vis: (i) => FARTER1[i].navn,
      ændring: (i) => { sc1.fart = i; sc1.t = 0; visTekst(); },
    };
    const fart2 = {
      skyder: true, navn: 'Fart', min: 0, max: T.LYSUR_FARTER.length - 1, værdi: sc2.fart, vis: (i) => T.lysurFartTekst(T.LYSUR_FARTER[i]),
      ændring: (i) => { sc2.fart = i; Lys.nulstilUr(sc2.ur); visTekst(); },
    };
    const trekantKontakt = {
      tekst: '△ Vis trekanten', til: false,
      // Tændt: uret stopper, næste gang lyset set fra Jorden er oppe, og trekanten tegnes. Slukket: uret går videre.
      skift: (til) => { sc2.trekant = til; if (!til) sc2.ur.stille = false; visTekst(); },
    };
    // Scene 3: tre kontakter (præcis én tændt), skyderen "Fart" og "↻ Ny byge" i bjælken. Hver ændring starter turen
    // forfra, og bagefter står kun kontaktens linje i underteksten.
    const myonKontakter = TILSTANDE3.map((tekst, i) => ({
      tekst, til: sc3.tilstand === i,
      skift: () => {
        for (const k of myonKontakter) { k.til = k.tekst === tekst; sætKontakt(k.tekst, k.til); }
        if (sc3.tilstand === i) return;
        sc3.tilstand = i;
        sc3.fælles = false;
        forfra3();
        visTekst();
      },
    }));
    const fart3 = {
      skyder: true, navn: 'Fart', min: 0, max: FARTER3.length - 1, værdi: sc3.fart, vis: (i) => FARTER3[i].navn,
      ændring: (i) => { sc3.fart = i; sc3.fælles = false; forfra3(); visTekst(); },
    };
    const nyByge = { tekst: '↻ Ny byge', handling: () => { nyByge3(); sc3.fælles = false; visTekst(); } };
    // Scene 4: to kontakter (præcis én tændt, starter ved 60 %) og "💡 Blink igen" i bjælken
    const togKontakter = FARTER4.map((f, i) => ({
      tekst: f.navn, til: sc4.fart === i,
      skift: () => {
        for (const k of togKontakter) { k.til = k.tekst === f.navn; sætKontakt(k.tekst, k.til); }
        if (sc4.fart === i) return;
        sc4.fart = i;
        sc4.t = 0;
        sc4.efter = false;
        visTekst();
      },
    }));
    const blinkIgen = { tekst: '💡 Blink igen', handling: () => { sc4.t = 0; } };
    // Scene 5: "▶ Spil rejsen" (og "■ Stop") og "↺ Vendepunkt 4 lysår ude" i bjælken, og for nørder kontakten med "nu"
    const spilRejsen = {
      get tekst() { return sc5.spil ? '■ Stop' : '▶ Spil rejsen'; },
      handling: () => { sc5.spil = !sc5.spil; sc5.T = 0; opdaterKnapper(); },
    };
    const vendTilbage = {
      tekst: '↺ Vendepunkt 4 lysår ude',
      handling: () => { sc5.p = { ...START5 }; sc5.spil = false; sc5.T = 0; opdaterKnapper(); },
      // Grå (ikke skjult), når vendepunktet allerede er der: Ellers ændrer bjælken højde, og kortet flytter sig under fingeren
      deaktiv: () => Math.abs(sc5.p.x - START5.x) < 1e-9 && Math.abs(sc5.p.t - START5.t) < 1e-9,
    };
    const nuKontakt = { tekst: "Vis den rejsendes 'nu'", til: sc5.nu, skift: (til) => { sc5.nu = til; } };
    const styring = [];
    function byg() {
      const liste = [
        [...boldKontakter, fart1],
        [fart2, trekantKontakt],
        [...myonKontakter, fart3, nyByge],
        [...togKontakter, blinkIgen],
        [spilRejsen, vendTilbage, nuKontakt],
      ][aktiv];
      styring.splice(0, styring.length, ...liste);
    }

    // ---------- Scenerne som trin i bjælken ----------
    function gåTil(nr) {
      // Man kan kun springe til en scene, man har set, eller den næste (et tryk længere frem går til den næste)
      const ny = Math.max(0, Math.min(SCENER.length - 1, Math.min(nr, Math.max(højesteSet, aktiv) + 1)));
      aktiv = ny;
      højesteSet = Math.max(højesteSet, aktiv);
      sc1.t = 0;
      Lys.nulstilUr(sc2.ur);
      sc3.fælles = true; // den fælles sætning står, når man kommer til scene 3
      forfra3();
      sc4.t = 0;
      sc4.efter = false;
      sc5.spil = false;
      sc5.træk = false;
      sc5.T = 0;
      // Kun rumtidskortet tager imod fingeren: Ellers går tryk igennem til 3D-billedet, og siden kan rulles
      lærred.style.pointerEvents = aktiv === 4 ? 'auto' : '';
      lærred.style.touchAction = aktiv === 4 ? 'none' : '';
      lærred.style.cursor = aktiv === 4 ? 'pointer' : '';
      byg();
      opdaterKnapper();
      visTekst();
      størrelse();
      tegn();
    }

    byg();
    visTekst();
    størrelse();
    tegn();

    return {
      styring,
      opdater(dt) {
        if (aktiv === 0) {
          sc1.t += dt;
          if (sc1.t > 4.6) sc1.t = 0;
        } else if (aktiv === 1) {
          const G = geo2();
          const stoppet = Lys.skridtUr(sc2.ur, dt, { v: T.LYSUR_FARTER[sc2.fart], c: G.c, bredde: G.we, stopOppe: sc2.trekant });
          if (stoppet) visTekst();
        } else if (aktiv === 2) {
          if (skridt3(dt)) visTekst();
        } else if (aktiv === 3) {
          if (skridt4(dt)) visTekst();
        } else skridt5(dt);
      },
      // Lærredet tegnes hvert billede, også under pause (fx når trekanten slås til, eller skærmen skifter størrelse)
      altid: () => tegn(),
      trin: () => ({
        nr: aktiv, ialt: SCENER.length, næste: SCENER[aktiv + 1]?.navn ?? '',
        gå: gåTil, forfra: () => gåTil(0),
      }),
      stop() {
        iagt?.disconnect();
        holder.remove();
      },
      test: {
        scene: () => aktiv,
        højesteSet: () => højesteSet,
        lærred: () => {
          const r = lærred.getBoundingClientRect();
          return { bredde: W, højde: H, top: r.top, bund: r.bottom, venstre: r.left, højre: r.right };
        },
        scene1: () => ({ bold: sc1.bold, fart: FARTER1[sc1.fart].b, boldFart: sc1.fart === 0 ? 150 : læggesSammen(0.5, FARTER1[sc1.fart].b), t: sc1.t }),
        scene2: () => ({ fart: T.LYSUR_FARTER[sc2.fart], trekant: sc2.trekant, stille: sc2.ur.stille, skib: sc2.ur.skib, jord: sc2.ur.jord, tegnet: sc2.sidst }),
        scene3: () => ({
          tilstand: TILSTANDE3[sc3.tilstand], fart: FARTER3[sc3.fart].b, gamma: tur3().gam, fase: sc3.fase, færdig: færdig3(),
          jordUr: sc3.tilstand === 2 ? null : sc3.t, myonUr: myonUr3(), luft: (HØJDE3 * 1000) / klemZoom3().klem, fælles: sc3.fælles,
          liv: [...sc3.liv], levende: sc3.liv.map((_, i) => i).filter((i) => lever3(i)),
        }),
        // En fast byge (levetider i µs på myonens ur), så testen ved, hvad der skal ske
        sætByge: (liv) => nyByge3(liv),
        // Scene 4: tiderne i L/c, hvor langt lyset er (t), hvad det har ramt, og vognens længde set fra perronen
        scene4: () => {
          const L = lys4(FARTER4[sc4.fart].b);
          return { fart: FARTER4[sc4.fart].b, t: sc4.t, tog: L.tog, bag: L.bag, for: L.for, ramt: ramt4(), efter: sc4.efter, vogn: 1 / L.gam };
        },
        // Scene 5: vendepunktet, egentiden, farterne, "nu" derhjemme før og efter vendingen og "Spil rejsen"
        scene5: () => {
          const R = rejse5(sc5.p);
          return { ...sc5.p, egen: R.egen, ud: R.ud, hjem: R.hjem, v1: R.v1, v2: R.v2, før: R.før, efter: R.efter, spring: R.spring, nu: sc5.nu, spil: sc5.spil, T: sc5.T, advar: sc5.advar > 0, træk: sc5.træk };
        },
        // Hvor punktet (x lysår, t år) står på skærmen (CSS-pixel i vinduet), så testen kan trykke og trække med musen
        kortPunkt: (x, t) => {
          const G = geo5(), r = lærred.getBoundingClientRect();
          return { x: r.left + (G.X(x) * r.width) / W, y: r.top + (G.Y(t) * r.height) / H };
        },
      },
    };
  },
};
