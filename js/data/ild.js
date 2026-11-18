// Ild (Kemi): teksterne til laboratoriet "Bordet" og reglerne for skeen, uden Three.js (kan testes i Node).
// Drejebogen er docs/drejebog-ild.md (afsnit 2 og 5) med rettelserne i docs/fable/E17-ild-noter.md, faktagrundlaget
// docs/fakta-ild.md, og faktatjekket står i docs/fakta-ild/faktatjek-bordet.md. Højre panel: titel, højst tre sætninger
// og højst to tal (Retningen). Temperaturerne er "ca." (kilderne er uenige, og en flamme skifter hundredvis af grader
// over få millimeter).

// Flammens form i flammens egne mål: x i halve bredder, y i højder (0 ved foden, 1 i spidsen). Samme form som i
// shaderen i js/flamme.js (uden flakken).
export function flammeBredde(y) {
  const a = Math.sqrt(Math.min(1, Math.max(0, (y + 0.1) / 0.42)));
  const b = Math.min(1, Math.max(0, (1 - y) / 0.68)) ** 0.75;
  return 0.95 * a * b;
}

// Hvor skeens skål er i forhold til flammen. px, py: skålens midte i flammens mål. sod: 1 gul flamme … 0 blå.
// tyngde: 1 Jorden … 0 rumstationen (halvkuglen har radius ca. 1,2 halve bredder). Målene er runde (stilguiden B5):
// Skålen er stor, så "i flammen" tæller lidt uden for kanten.
export function skeZone(px, py, { sod = 1, tyngde = 1, højdeForhold = 5.2 } = {}) {
  if (tyngde < 0.5) {
    const r = Math.hypot(px, py * højdeForhold);
    if (r < 1.9 && py > -0.15) return 'kuppel';
    if (Math.abs(px) < 1.6 && py > 0 && r < 5) return 'over';
    return 'ingen';
  }
  if (py > 1.02 && py < 2.6 && Math.abs(px) < 1.5) return 'over';
  if (py < -0.12 || py > 1.02) return 'ingen';
  const w = Math.max(flammeBredde(py), 0.12);
  const d = Math.abs(px) / w;
  if (d > 1.35) return 'ingen';
  if (sod < 0.5) return 'blå';
  if (py < 0.36 && d < 0.6) return 'kerne';
  if (d > 0.85 || py < 0.1) return 'kant';
  return 'gul';
}

// Skeen: varme (0-1), dug (0-1) og sod (0-1) ét skridt frem. Dugget kommer på den kolde ske over flammen og fordamper
// igen, når skeen bliver varm (efter et par sekunder, som i virkeligheden). Sod kommer kun i den gule del.
export function skeSkridt(ske, zone, dt, sod = 1) {
  const iFlammen = zone === 'gul' || zone === 'kerne' || zone === 'kant' || zone === 'blå' || zone === 'kuppel';
  const opvarm = iFlammen ? 0.45 : zone === 'over' ? 0.16 : -0.1;
  ske.varme = Math.min(1, Math.max(0, ske.varme + opvarm * dt));
  if (zone === 'over' && ske.varme < 0.5) ske.dug = Math.min(1, ske.dug + 1.4 * dt);
  else if (ske.varme > 0.5 || iFlammen) ske.dug = Math.max(0, ske.dug - 0.9 * dt);
  if (zone === 'gul') ske.sod = Math.min(1, ske.sod + 0.75 * dt * sod);
  return ske;
}

// Hvor skeen er, og temperaturen dér (Wikipedia "Candle", zonerne III-V, set 18. november 2026)
export const ZONER = {
  over: { navn: 'over flammen', temp: null },
  kerne: { navn: 'i den mørke kegle', temp: 'ca. 1.000 °C' },
  gul: { navn: 'i den gule del', temp: 'ca. 1.200 °C' },
  kant: { navn: 'i kanten', temp: 'ca. 1.400 °C' },
  blå: { navn: 'i den blå flamme', temp: null },
  kuppel: { navn: 'i halvkuglen', temp: null },
};

// Højre panel for hver tilstand. tal: [navn, værdi], højst to.
export const PANEL = {
  lys: {
    titel: 'Et stearinlys',
    tekst: 'Flammen smelter stearinen, og vægen suger den op. Ved flammen bliver stearinen til damp, og det er dampen, der brænder sammen med oxygen (ilt) fra luften.',
    tal: [['Varmest', 'ca. 1.400 °C'], ['Varme', 'ca. 80 watt']],
  },
  slukket: {
    titel: 'Lyset er slukket',
    tekst: 'Uden flammens varme bliver der ikke lavet ny damp. Den hvide røg er stearindamp, der er blevet til en tåge af bittesmå dråber. Den kan brænde.',
    tal: [],
  },
  gennemRøgen: {
    titel: 'Gennem røgen',
    tekst: 'Flammen løb ned gennem røgen og tændte vægen, uden at tændstikken rørte den. Røgen er fordampet stearin, og det er dampen, der brænder.',
    tal: [['Varmest', 'ca. 1.400 °C'], ['Varme', 'ca. 80 watt']],
  },
  tændstik: {
    titel: 'Tændstikken',
    tekst: 'Den lille flamme varmer vægen, så stearinen bliver til damp. Dampen brænder, og så holder flammen sig selv i gang.',
    tal: [['Varmest', 'ca. 1.400 °C'], ['Varme', 'ca. 80 watt']],
  },
  dug: {
    titel: 'Skeen dugger',
    tekst: 'Dugget er vand. Det er blevet til i flammen af hydrogen fra stearinen og oxygen fra luften. Når skeen bliver varm, fordamper det igen.',
  },
  sod: {
    titel: 'Sod',
    tekst: 'Skeen bliver sort af sod: bittesmå korn af kulstof. Inde i flammen gløder de gult, som tråden i en gammel glødepære. Det gule lys er glødende sod.',
  },
  kerne: {
    titel: 'Den mørke kegle',
    tekst: 'Inderst om vægen er der for lidt oxygen. Her er stearinen damp, der ikke brænder endnu.',
  },
  kant: {
    titel: 'Kanten',
    tekst: 'Her møder dampen oxygen nok og brænder helt. Kanten er den varmeste del af flammen, selv om den lyser mindst.',
  },
  gul: {
    titel: 'Den gule del',
    tekst: 'Den gule del lyser mest, men den er ikke den varmeste. Her er der for lidt oxygen til, at alt kan brænde helt.',
  },
  blåSke: {
    titel: 'Ingen sod',
    tekst: 'I den blå flamme er gassen blandet med luft, før den brænder. Der bliver ikke dannet sod, og derfor bliver skeen ikke sort.',
  },
  brænderLidt: {
    titel: 'Lidt luft',
    tekst: 'Gassen møder først luften, når den kommer ud af røret. Den brænder ikke helt, og der bliver dannet sod, der gløder gult. Flammen lyser mest, men den er ikke den varmeste.',
    tal: [['Luft i gassen', 'lidt'], ['Sod', 'ja']],
  },
  brænderNoget: {
    titel: 'Mere luft',
    tekst: 'Jo mere luft der blandes i gassen, før den brænder, jo mindre sod. Det gule forsvinder, og flammen bliver varmere.',
    tal: [['Luft i gassen', 'noget'], ['Sod', 'lidt']],
  },
  brænderMeget: {
    titel: 'Luft nok',
    tekst: 'Gassen er blandet med luft nok, før den brænder, så der bliver ikke dannet sod. Flammen er blå og varmere. Det blå lys kommer fra molekyler, der lige er dannet i reaktionen.',
    tal: [['Luft i gassen', 'meget'], ['Sod', 'nej']],
  },
  brænderLukket: {
    titel: 'Gassen er lukket',
    tekst: 'Uden brændstof går flammen ud med det samme. Åbn for gassen, så tænder brænderen igen.',
    tal: [],
  },
  rum: {
    titel: 'På en rumstation',
    tekst: 'I vægtløshed stiger varm gas ikke op, så frisk luft kommer kun langsomt ind fra alle sider. Flammen bliver en lille, blå halvkugle med næsten ingen sod. På rumstationen Mir brændte stearinlys i op til 45 minutter.',
    tal: [['Formen', 'halvkugle'], ['Forsøget', 'Mir, 1996']],
  },
  pust: {
    titel: 'Pust',
    tekst: 'Du blæste flammen væk fra vægen og kølede den. Uden flammens varme kom der ingen ny damp, og lyset gik ud. Man puster altså ikke oxygenet væk.',
    tal: [],
  },
  glas: {
    titel: 'Under et glas',
    tekst: 'Flammen bliver mindre og går ud. Den mangler oxygen, selv om en god del af oxygenet stadig er tilbage i glasset.',
    tal: [],
  },
  slukker: {
    titel: 'Lysslukkeren',
    tekst: 'Den lille hætte lukker for luften, så flammen ikke får oxygen. Så puster man heller ikke varm stearin ud over bordet.',
    tal: [],
  },
  co2: {
    titel: 'CO₂',
    tekst: 'CO₂ er tungere end luft og skubber luften væk fra flammen. Uden oxygen går den ud. Derfor er der CO₂ i nogle ildslukkere.',
    tal: [],
  },
  vandLys: {
    titel: 'Vand på lyset?',
    tekst: 'Nej. Vand kan få den varme stearin til at sprøjte. Brug en lysslukker.',
    tal: [],
  },
  vandTændstik: {
    titel: 'Vand på tændstikken',
    tekst: 'Vandet tog varmen fra træet, så det holdt op med at lave gas. Uden gas er der intet, der kan brænde.',
    tal: [],
  },
  atomer: {
    titel: 'Se atomerne',
    tekst: 'Her i flammens kant er et lille stykke af stearinen: to kulstof og fire hydrogen. Rundt om svæver oxygen fra luften, to og to.',
    tal: [['Kulstof · hydrogen · oxygen', '2 · 4 · 6']],
  },
  atomerFærdig: {
    titel: 'Nye partnere',
    tekst: 'Atomerne har byttet partnere og er blevet til to CO₂ og to H₂O. Ingen atomer er forsvundet, og de nye bindinger gav varme. Det er en kemisk reaktion, og den hedder forbrænding.',
    tal: [['Før', '2 C · 4 H · 6 O'], ['Efter', '2 C · 4 H · 6 O']],
  },
};

// "Hvorfor?"-kortene i laboratoriet (teksterne i js/data/hvorfor.js)
export const ILD_KORT = ['ildPlasma', 'ildSolen', 'ildVarmer'];

// Instruksen til venstre i luppen (laboratoriet har ingen linje under scenen)
export const ATOM_GØR = {
  klar: 'Træk de tre oxygenmolekyler hen til stykket af stearinen, ét ad gangen.',
  færdig: 'Færdig. Tryk "Igen" for at se det en gang til.',
};
