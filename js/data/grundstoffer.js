// Alle 118 grundstoffer.
// Hver række: [symbol, navn, kaldenavn, atommasse, kategori, tilstand ved stuetemperatur]
// Tilstand: 'g' = gas, 'v' = væske (flydende), 'f' = fast, 'u' = ukendt (der er aldrig lavet nok til at se det)
// For radioaktive grundstoffer uden stabile isotoper er massen massetallet for den mest stabile isotop.

const RÆKKER = [
  ['H', 'Hydrogen', 'brint', 1.008, 'ikkemetal', 'g'],
  ['He', 'Helium', '', 4.0026, 'aedelgas', 'g'],
  ['Li', 'Lithium', '', 6.94, 'alkali', 'f'],
  ['Be', 'Beryllium', '', 9.0122, 'jordalkali', 'f'],
  ['B', 'Bor', '', 10.81, 'halvmetal', 'f'],
  ['C', 'Carbon', 'kulstof', 12.011, 'ikkemetal', 'f'],
  ['N', 'Nitrogen', 'kvælstof', 14.007, 'ikkemetal', 'g'],
  ['O', 'Oxygen', 'ilt', 15.999, 'ikkemetal', 'g'],
  ['F', 'Fluor', '', 18.998, 'halogen', 'g'],
  ['Ne', 'Neon', '', 20.18, 'aedelgas', 'g'],
  ['Na', 'Natrium', '', 22.99, 'alkali', 'f'],
  ['Mg', 'Magnesium', '', 24.305, 'jordalkali', 'f'],
  ['Al', 'Aluminium', '', 26.982, 'andetmetal', 'f'],
  ['Si', 'Silicium', '', 28.085, 'halvmetal', 'f'],
  ['P', 'Fosfor', '', 30.974, 'ikkemetal', 'f'],
  ['S', 'Svovl', '', 32.06, 'ikkemetal', 'f'],
  ['Cl', 'Chlor', 'klor', 35.45, 'halogen', 'g'],
  ['Ar', 'Argon', '', 39.95, 'aedelgas', 'g'],
  ['K', 'Kalium', '', 39.098, 'alkali', 'f'],
  ['Ca', 'Calcium', '', 40.078, 'jordalkali', 'f'],
  ['Sc', 'Scandium', '', 44.956, 'overgang', 'f'],
  ['Ti', 'Titan', '', 47.867, 'overgang', 'f'],
  ['V', 'Vanadium', '', 50.942, 'overgang', 'f'],
  ['Cr', 'Chrom', 'krom', 51.996, 'overgang', 'f'],
  ['Mn', 'Mangan', '', 54.938, 'overgang', 'f'],
  ['Fe', 'Jern', '', 55.845, 'overgang', 'f'],
  ['Co', 'Cobalt', 'kobolt', 58.933, 'overgang', 'f'],
  ['Ni', 'Nikkel', '', 58.693, 'overgang', 'f'],
  ['Cu', 'Kobber', '', 63.546, 'overgang', 'f'],
  ['Zn', 'Zink', '', 65.38, 'overgang', 'f'],
  ['Ga', 'Gallium', '', 69.723, 'andetmetal', 'f'],
  ['Ge', 'Germanium', '', 72.63, 'halvmetal', 'f'],
  ['As', 'Arsen', '', 74.922, 'halvmetal', 'f'],
  ['Se', 'Selen', '', 78.971, 'ikkemetal', 'f'],
  ['Br', 'Brom', '', 79.904, 'halogen', 'v'],
  ['Kr', 'Krypton', '', 83.798, 'aedelgas', 'g'],
  ['Rb', 'Rubidium', '', 85.468, 'alkali', 'f'],
  ['Sr', 'Strontium', '', 87.62, 'jordalkali', 'f'],
  ['Y', 'Yttrium', '', 88.906, 'overgang', 'f'],
  ['Zr', 'Zirconium', '', 91.224, 'overgang', 'f'],
  ['Nb', 'Niobium', '', 92.906, 'overgang', 'f'],
  ['Mo', 'Molybdæn', '', 95.95, 'overgang', 'f'],
  ['Tc', 'Technetium', '', 98, 'overgang', 'f'],
  ['Ru', 'Ruthenium', '', 101.07, 'overgang', 'f'],
  ['Rh', 'Rhodium', '', 102.91, 'overgang', 'f'],
  ['Pd', 'Palladium', '', 106.42, 'overgang', 'f'],
  ['Ag', 'Sølv', '', 107.87, 'overgang', 'f'],
  ['Cd', 'Cadmium', '', 112.41, 'overgang', 'f'],
  ['In', 'Indium', '', 114.82, 'andetmetal', 'f'],
  ['Sn', 'Tin', '', 118.71, 'andetmetal', 'f'],
  ['Sb', 'Antimon', '', 121.76, 'halvmetal', 'f'],
  ['Te', 'Tellur', '', 127.6, 'halvmetal', 'f'],
  ['I', 'Iod', 'jod', 126.9, 'halogen', 'f'],
  ['Xe', 'Xenon', '', 131.29, 'aedelgas', 'g'],
  ['Cs', 'Cæsium', '', 132.91, 'alkali', 'f'],
  ['Ba', 'Barium', '', 137.33, 'jordalkali', 'f'],
  ['La', 'Lanthan', '', 138.91, 'lanthanid', 'f'],
  ['Ce', 'Cerium', '', 140.12, 'lanthanid', 'f'],
  ['Pr', 'Praseodym', '', 140.91, 'lanthanid', 'f'],
  ['Nd', 'Neodym', '', 144.24, 'lanthanid', 'f'],
  ['Pm', 'Promethium', '', 145, 'lanthanid', 'f'],
  ['Sm', 'Samarium', '', 150.36, 'lanthanid', 'f'],
  ['Eu', 'Europium', '', 151.96, 'lanthanid', 'f'],
  ['Gd', 'Gadolinium', '', 157.25, 'lanthanid', 'f'],
  ['Tb', 'Terbium', '', 158.93, 'lanthanid', 'f'],
  ['Dy', 'Dysprosium', '', 162.5, 'lanthanid', 'f'],
  ['Ho', 'Holmium', '', 164.93, 'lanthanid', 'f'],
  ['Er', 'Erbium', '', 167.26, 'lanthanid', 'f'],
  ['Tm', 'Thulium', '', 168.93, 'lanthanid', 'f'],
  ['Yb', 'Ytterbium', '', 173.05, 'lanthanid', 'f'],
  ['Lu', 'Lutetium', '', 174.97, 'lanthanid', 'f'],
  ['Hf', 'Hafnium', '', 178.49, 'overgang', 'f'],
  ['Ta', 'Tantal', '', 180.95, 'overgang', 'f'],
  ['W', 'Wolfram', '', 183.84, 'overgang', 'f'],
  ['Re', 'Rhenium', '', 186.21, 'overgang', 'f'],
  ['Os', 'Osmium', '', 190.23, 'overgang', 'f'],
  ['Ir', 'Iridium', '', 192.22, 'overgang', 'f'],
  ['Pt', 'Platin', '', 195.08, 'overgang', 'f'],
  ['Au', 'Guld', '', 196.97, 'overgang', 'f'],
  ['Hg', 'Kviksølv', '', 200.59, 'overgang', 'v'],
  ['Tl', 'Thallium', '', 204.38, 'andetmetal', 'f'],
  ['Pb', 'Bly', '', 207.2, 'andetmetal', 'f'],
  ['Bi', 'Bismuth', '', 208.98, 'andetmetal', 'f'],
  ['Po', 'Polonium', '', 209, 'andetmetal', 'f'],
  ['At', 'Astat', '', 210, 'halogen', 'f'],
  ['Rn', 'Radon', '', 222, 'aedelgas', 'g'],
  ['Fr', 'Francium', '', 223, 'alkali', 'f'],
  ['Ra', 'Radium', '', 226, 'jordalkali', 'f'],
  ['Ac', 'Actinium', '', 227, 'actinid', 'f'],
  ['Th', 'Thorium', '', 232.04, 'actinid', 'f'],
  ['Pa', 'Protactinium', '', 231.04, 'actinid', 'f'],
  ['U', 'Uran', '', 238.03, 'actinid', 'f'],
  ['Np', 'Neptunium', '', 237, 'actinid', 'f'],
  ['Pu', 'Plutonium', '', 244, 'actinid', 'f'],
  ['Am', 'Americium', '', 243, 'actinid', 'f'],
  ['Cm', 'Curium', '', 247, 'actinid', 'f'],
  ['Bk', 'Berkelium', '', 247, 'actinid', 'f'],
  ['Cf', 'Californium', '', 251, 'actinid', 'f'],
  ['Es', 'Einsteinium', '', 252, 'actinid', 'f'],
  ['Fm', 'Fermium', '', 257, 'actinid', 'u'],
  ['Md', 'Mendelevium', '', 258, 'actinid', 'u'],
  ['No', 'Nobelium', '', 259, 'actinid', 'u'],
  ['Lr', 'Lawrencium', '', 266, 'actinid', 'u'],
  ['Rf', 'Rutherfordium', '', 267, 'overgang', 'u'],
  ['Db', 'Dubnium', '', 268, 'overgang', 'u'],
  ['Sg', 'Seaborgium', '', 269, 'overgang', 'u'],
  ['Bh', 'Bohrium', '', 270, 'overgang', 'u'],
  ['Hs', 'Hassium', '', 270, 'overgang', 'u'],
  ['Mt', 'Meitnerium', '', 278, 'ukendt', 'u'],
  ['Ds', 'Darmstadtium', '', 281, 'ukendt', 'u'],
  ['Rg', 'Røntgenium', '', 282, 'ukendt', 'u'],
  ['Cn', 'Copernicium', '', 285, 'ukendt', 'u'],
  ['Nh', 'Nihonium', '', 286, 'ukendt', 'u'],
  ['Fl', 'Flerovium', '', 289, 'ukendt', 'u'],
  ['Mc', 'Moscovium', '', 290, 'ukendt', 'u'],
  ['Lv', 'Livermorium', '', 293, 'ukendt', 'u'],
  ['Ts', 'Tennessin', '', 294, 'ukendt', 'u'],
  ['Og', 'Oganesson', '', 294, 'ukendt', 'u'],
];

// Grundstoffer, hvor alle isotoper er radioaktive (ingen stabile udgaver)
function erRadioaktivt(nr) {
  return nr === 43 || nr === 61 || nr >= 84;
}

export const GRUNDSTOFFER = RÆKKER.map(([symbol, navn, kaldenavn, masse, kategori, tilstand], i) => ({
  nr: i + 1,
  symbol,
  navn,
  kaldenavn,
  masse,
  kategori,
  tilstand,
  radioaktivt: erRadioaktivt(i + 1),
}));

export function grundstof(nr) {
  return GRUNDSTOFFER[nr - 1] || null;
}

// Kategorierne med farver og en kort forklaring
export const KATEGORIER = {
  alkali: { navn: 'Alkalimetal', farve: '#ff6b6b', tekst: 'Et alkalimetal: blødt, skinnende og meget reaktivt. Reagerer kraftigt med vand.' },
  jordalkali: { navn: 'Jordalkalimetal', farve: '#ffa94d', tekst: 'Et jordalkalimetal: et reaktivt metal, der ofte findes i mineraler og sten.' },
  overgang: { navn: 'Overgangsmetal', farve: '#ffd43b', tekst: 'Et overgangsmetal: hårdt, skinnende og leder strøm godt.' },
  andetmetal: { navn: 'Andet metal', farve: '#8ce99a', tekst: 'Et metal, der er blødere end overgangsmetallerne og ofte smelter ved lavere temperatur.' },
  halvmetal: { navn: 'Halvmetal', farve: '#20c997', tekst: 'Et halvmetal: har træk fra både metaller og ikkemetaller. Mange bruges i elektronik.' },
  ikkemetal: { navn: 'Ikkemetal', farve: '#4dabf7', tekst: 'Et ikkemetal: leder ikke strøm godt og er ofte en gas eller et skørt stof.' },
  halogen: { navn: 'Halogen', farve: '#22b8cf', tekst: 'Et halogen: meget reaktivt og danner salte sammen med metaller.' },
  aedelgas: { navn: 'Ædelgas', farve: '#9775fa', tekst: 'En ædelgas: den yderste elektronskal er fyldt, så den reagerer næsten ikke med noget.' },
  lanthanid: { navn: 'Lanthanid', farve: '#f783ac', tekst: 'Et lanthanid (sjældent jordartsmetal): bruges i magneter, lasere og skærme.' },
  actinid: { navn: 'Actinid', farve: '#e599f7', tekst: 'Et actinid: alle actiniderne er radioaktive.' },
  ukendt: { navn: 'Ukendte egenskaber', farve: '#adb5bd', tekst: 'Et supertungt grundstof, der kun er lavet i laboratorier, få atomer ad gangen. De henfalder næsten med det samme.' },
};

export const TILSTANDE = { g: 'Gas', v: 'Væske', f: 'Fast stof', u: 'Ukendt' };

// Korte fakta. Grundstoffer uden en linje her får kategoriens tekst.
// Flere og længere fakta kommer med "Det periodiske system".
export const KORT_FAKTA = {
  H: 'Det letteste grundstof og det mest almindelige i universet. Stjerner som Solen består mest af hydrogen.',
  He: 'Dannes af hydrogen inde i stjerner. Det er lettere end luft, derfor svæver heliumballoner.',
  Li: 'Det letteste af alle metaller. Bruges i batterier i telefoner og elbiler.',
  Be: 'Et let, men meget stift metal. Spejlene i James Webb-rumteleskopet er lavet af beryllium.',
  B: 'Bruges i ildfast glas, fx målebægre. Planter har brug for en lille smule bor.',
  C: 'Grundlaget for alt liv. Diamant og grafit (i blyanter) er begge rent carbon, bare sat sammen på hver sin måde.',
  N: 'Luften består af ca. 78 % nitrogen. Det findes i alle proteiner i din krop.',
  O: 'Ca. 21 % af luften. Du trækker vejret for at få oxygen, og det er det grundstof, der vejer mest i din krop.',
  F: 'Det mest reaktive grundstof af alle. Fluorid i tandpasta beskytter tænderne.',
  Ne: 'En ædelgas, der lyser rød-orange i neonskilte.',
  Na: 'Et blødt metal, der reagerer voldsomt med vand. Sammen med chlor bliver det til køkkensalt (NaCl).',
  Mg: 'Brænder med et kraftigt hvidt lys og bruges i fyrværkeri. Findes i klorofyl, det grønne i planter.',
  Al: 'Det mest almindelige metal i jordskorpen. Bruges i sodavandsdåser og fly, fordi det er let.',
  Si: 'Sand er lavet af silicium og oxygen. Computerchips er lavet af silicium.',
  P: 'Findes i dine knogler og i dit DNA. Bruges på tændstikæsker.',
  S: 'Et gult stof, der findes ved vulkaner. Rådne æg lugter af en svovlforbindelse.',
  Cl: 'En giftig gulgrøn gas, men sammen med natrium bliver det til almindeligt salt. Bruges til at rense vand i svømmehaller.',
  Ar: 'Knap 1 % af luften er argon. En ædelgas, der bruges i glødepærer og ved svejsning.',
  K: 'Et blødt metal, der reagerer så voldsomt med vand, at det brænder med lilla flamme. Bananer indeholder meget kalium.',
  Ca: 'Gør knogler og tænder hårde. Findes i mælk, kridt og kalksten.',
  Sc: 'Et sjældent, let metal. Bruges i stærke aluminiumsblandinger til fx cykelstel.',
  Ti: 'Lige så stærkt som stål, men næsten halvt så tungt. Bruges i fly, rumfartøjer og kunstige hofteled.',
  V: 'Gør stål ekstra stærkt og sejt, fx i skruetrækkere og skruenøgler.',
  Cr: 'Gør rustfrit stål rustfrit og giver blanke kromdele på biler og cykler.',
  Mn: 'Bruges til at gøre stål hårdere og findes i almindelige batterier.',
  Fe: 'Det mest brugte metal. Jordens kerne består mest af jern, og jernet i dit blod bærer oxygen rundt i kroppen.',
  Co: 'Giver en dyb blå farve (koboltblå) og bruges i magneter og batterier.',
  Ni: 'Findes i mønter og rustfrit stål. Jordens kerne indeholder også nikkel.',
  Cu: 'Leder strøm rigtig godt og bruges i elkabler. Frihedsgudinden er lavet af kobber, og den grønne farve er irret.',
  Zn: 'Bruges til at beskytte jern mod rust. Din krop har brug for lidt zink.',
  Ga: 'Smelter ved ca. 30 °C, så det kan smelte i din hånd! Bruges i LED-lys.',
  Ge: 'Et halvmetal, der blev brugt i de første transistorer. Bruges i dag i lyslederkabler.',
  As: 'Berømt som gift i gamle kriminalhistorier. Bruges i små mængder i elektronik.',
  Se: 'Kroppen har brug for en lille smule selen. Det leder strøm bedre, når der falder lys på det.',
  Br: 'Et af kun to grundstoffer, der er flydende ved stuetemperatur. Det er rødbrunt og lugter skarpt.',
  Kr: 'En ædelgas, der bruges i nogle lamper. Navnet betyder "den skjulte" på græsk.',
  Sr: 'Giver den røde farve i fyrværkeri.',
  Tc: 'Det letteste grundstof, hvor alle isotoper er radioaktive. Det var det første grundstof, der blev lavet kunstigt.',
  Ag: 'Det metal, der leder strøm og varme allerbedst. Bruges i smykker, mønter og elektronik.',
  Sn: 'Et blødt metal. Dåser hed "blikdåser", fordi stålet blev belagt med tin, så det ikke rustede.',
  I: 'Kroppen bruger iod i skjoldbruskkirtlen. Iod bruges også til at rense sår.',
  Xe: 'En tung ædelgas, der lyser blåt. Bruges i stærke billygter og i ionmotorer på rumsonder.',
  Cs: 'Reagerer eksplosivt med vand. Atomure, der måler tiden helt præcist, bruger cæsium.',
  Ba: 'Giver den grønne farve i fyrværkeri. Barium er en af de kerner, der kan dannes, når uran spaltes.',
  Nd: 'Bruges i verdens stærkeste magneter, fx i høretelefoner og vindmøller.',
  W: 'Det metal, der har det højeste smeltepunkt: ca. 3400 °C. Bruges i glødetråde.',
  Pt: 'Et sjældent og dyrt metal, der bruges i bilers katalysatorer og i smykker.',
  Au: 'Ruster aldrig og bliver ved med at skinne. Så blødt, at det kan hamres ud til blade, der er tyndere end et hår.',
  Hg: 'Det eneste metal, der er flydende ved stuetemperatur. Det er giftigt og blev før brugt i termometre.',
  Pb: 'Et tungt, blødt og giftigt metal. Bruges som skjold mod røntgenstråler.',
  Rn: 'En radioaktiv ædelgas, der kan sive op fra undergrunden og samle sig i kældre.',
  Fr: 'Så radioaktivt og sjældent, at der højst findes omkring 30 gram i hele jordskorpen på én gang.',
  Ra: 'Radioaktivt og lyser svagt i mørke. Marie og Pierre Curie opdagede det i 1898.',
  U: 'Det tungeste grundstof, der findes i naturen i større mængder. Uran-235 kan spaltes og bruges i atomkraftværker.',
  Pu: 'Et kunstigt grundstof, der laves i atomreaktorer. Varmen fra plutonium har givet strøm til rumsonder som Voyager.',
  Og: 'Det tungeste grundstof, man kender. Der er kun lavet en håndfuld atomer, og de lever under et tusindedel sekund.',
};

export function faktaOm(nr) {
  const g = grundstof(nr);
  if (!g) return '';
  let tekst = KORT_FAKTA[g.symbol] || KATEGORIER[g.kategori].tekst;
  if (g.radioaktivt && !KORT_FAKTA[g.symbol]) tekst += ' Alle dets isotoper er radioaktive.';
  return tekst;
}

// ---------- Elektronskaller ----------
// Skallerne fyldes i den rækkefølge, naturen gør det (Madelungs regel).
// Hver underskal har [skalnummer, l], og der er plads til 2·(2l+1) elektroner.
const FYLDE_RÆKKEFØLGE = [
  [1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [3, 2], [4, 1], [5, 0], [4, 2],
  [5, 1], [6, 0], [4, 3], [5, 2], [6, 1], [7, 0], [5, 3], [6, 2], [7, 1],
];

// Grundstoffer, hvor naturen ikke følger reglen helt (målt i virkeligheden)
const UNDTAGELSER = {
  24: [2, 8, 13, 1], 29: [2, 8, 18, 1],
  41: [2, 8, 18, 12, 1], 42: [2, 8, 18, 13, 1], 44: [2, 8, 18, 15, 1], 45: [2, 8, 18, 16, 1],
  46: [2, 8, 18, 18], 47: [2, 8, 18, 18, 1],
  57: [2, 8, 18, 18, 9, 2], 58: [2, 8, 18, 19, 9, 2], 64: [2, 8, 18, 25, 9, 2],
  78: [2, 8, 18, 32, 17, 1], 79: [2, 8, 18, 32, 18, 1],
  89: [2, 8, 18, 32, 18, 9, 2], 90: [2, 8, 18, 32, 18, 10, 2], 91: [2, 8, 18, 32, 20, 9, 2],
  92: [2, 8, 18, 32, 21, 9, 2], 93: [2, 8, 18, 32, 22, 9, 2], 96: [2, 8, 18, 32, 25, 9, 2],
  103: [2, 8, 18, 32, 32, 8, 3],
};

// Elektroner i hver skal for et neutralt atom med nr protoner
export function skaller(nr) {
  if (nr <= 0) return [];
  if (UNDTAGELSER[nr]) return [...UNDTAGELSER[nr]];
  const ud = [];
  let tilbage = nr;
  for (const [n, l] of FYLDE_RÆKKEFØLGE) {
    if (tilbage <= 0) break;
    const plads = 2 * (2 * l + 1);
    const antal = Math.min(plads, tilbage);
    while (ud.length < n) ud.push(0);
    ud[n - 1] += antal;
    tilbage -= antal;
  }
  return ud;
}

// Skaller for et atom, der måske er en ion (flere eller færre elektroner end protoner)
export function skallerForIon(protoner, elektroner) {
  if (elektroner <= 0) return [];
  if (protoner <= 0) return skaller(elektroner);
  if (elektroner === protoner) return skaller(protoner);
  if (elektroner > protoner) return skaller(Math.min(elektroner, 118));
  // Færre elektroner: de yderste fjernes først
  const s = skaller(protoner);
  let fjern = protoner - elektroner;
  for (let i = s.length - 1; i >= 0 && fjern > 0; i--) {
    const tag = Math.min(s[i], fjern);
    s[i] -= tag;
    fjern -= tag;
  }
  while (s.length && s[s.length - 1] === 0) s.pop();
  return s;
}

// ---------- Placering i det periodiske system ----------
const PERIODE_SLUT = [2, 10, 18, 36, 54, 86, 118];

// Giver periode, gruppe (null for lanthanider og actinider) og felt (række/kolonne) i tabellen.
// Lanthaniderne og actiniderne står i række 9 og 10 under selve tabellen.
export function placering(nr) {
  let periode = 0;
  while (nr > PERIODE_SLUT[periode]) periode++;
  periode += 1;
  const start = periode === 1 ? 1 : PERIODE_SLUT[periode - 2] + 1;
  const o = nr - start + 1;
  let gruppe;
  if (periode === 1) gruppe = nr === 1 ? 1 : 18;
  else if (periode <= 3) gruppe = o <= 2 ? o : o + 10;
  else if (periode <= 5) gruppe = o;
  else if (o <= 2) gruppe = o;
  else if (o <= 17) {
    // f-blokken
    return { periode, gruppe: null, række: periode + 3, kolonne: o };
  } else gruppe = o - 14;
  return { periode, gruppe, række: periode, kolonne: gruppe };
}
