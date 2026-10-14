// Atomværkstedet: byg et atom af protoner, neutroner og elektroner, og se hvad det bliver.

import { verden, sætVindue, passerTil, kameraSving, flyInd } from './scene3d.js';
import { Atom } from './atom.js';
import { GRUNDSTOFFER, grundstof, KATEGORIER, TILSTANDE, faktaOm, skallerForIon, placering, konfigurationTekst } from './data/grundstoffer.js';
import { bindingsenergi, kerneRadiusFm } from './data/kerne.js';
import { stabilitet, isotopNavn, typiskeNeutroner, henfaldsmåde, stabileNeutroner } from './data/isotoper.js';
import { Stabilitetskort } from './stabilitetskort.js';
import * as fremgang from './fremgang.js';
import { lyd, lydErTændt, skiftLyd } from './lyd.js';
import { visBesked } from './beskeder.js';
import { citatHTML } from './data/citater.js';

const MAX_P = 118;
const MAX_N = 180;
const EKSTRA_ELEKTRONER = 2; // så mange ekstra elektroner kan et atom holde på (fx O²⁻)

// Opgaver. mål: det antal der skal bygges (null = lige meget).
// hændelse: opgaven løses af noget, der sker (fx et henfald), i stedet for et bestemt atom.
export const OPGAVER = [
  {
    id: 'hydrogen', titel: 'Byg et hydrogenatom', mål: { p: 1, n: 0, e: 1 },
    tip: 'Hydrogen er grundstof nr. 1. Det har ingen neutroner.',
    fakta: 'Hydrogen er det mest almindelige grundstof i universet. Det har kun én proton og én elektron.',
  },
  {
    id: 'uden-lim', titel: 'Prøv to protoner uden neutroner', mål: { p: 2, n: 0, e: null },
    tip: 'Læg to protoner i kernen og ingen neutroner. Hvad sker der?',
    fakta: 'To protoner alene kan ikke holde sammen, for de frastøder hinanden. Neutronerne er kernens lim.',
  },
  {
    id: 'helium', titel: 'Byg helium-4', mål: { p: 2, n: 2, e: 2 },
    tip: 'Helium er nr. 2. Massetallet 4 = protoner + neutroner.',
    fakta: 'Helium-4 er det, Solen laver af hydrogen. Det kan du selv prøve i Stjerneovnen.',
  },
  {
    id: 'deuterium', titel: 'Lav tung brint (deuterium)', mål: { p: 1, n: 1, e: 1 },
    tip: 'Deuterium er hydrogen med én neutron i kernen.',
    fakta: 'Deuterium er stabilt. Det er det første skridt, når Solen laver helium.',
  },
  {
    id: 'tritium', titel: 'Byg tritium: hydrogen med 2 neutroner', mål: { p: 1, n: 2, e: 1 },
    tip: '1 proton, 2 neutroner og 1 elektron.',
    fakta: 'Tritium er radioaktivt. Tryk på "Se den henfalde", og se den blive til helium-3!',
  },
  {
    id: 'henfald', titel: 'Se en kerne henfalde', hændelse: true,
    tip: 'Byg en ustabil kerne, fx tritium eller carbon-14, og tryk på "Se den henfalde".',
    fakta: 'Når en kerne henfalder, bliver den til et andet grundstof. Det var præcis det, alkymisterne drømte om!',
  },
  {
    id: 'carbon', titel: 'Byg carbon-12 (kulstof)', mål: { p: 6, n: 6, e: 6 },
    tip: 'Carbon er nr. 6. Massetal 12, og atomet skal være neutralt.',
    fakta: 'Alt liv på Jorden er bygget op omkring carbon. Du består af ca. 18 % carbon.',
  },
  {
    id: 'carbon-graense', titel: 'Find den tungeste stabile carbon', mål: { p: 6, n: 7, e: null },
    tip: 'Start med carbon-12, og læg én neutron på ad gangen. Hold øje med boksen om stabilitet.',
    fakta: 'Carbon-13 er den tungeste stabile carbon. Med én neutron mere (carbon-14) bliver kernen radioaktiv.',
  },
  {
    id: 'oxygen', titel: 'Byg oxygen-16 (ilt)', mål: { p: 8, n: 8, e: 8 },
    tip: 'Oxygen er nr. 8. Massetal 16.',
    fakta: 'Oxygen-16 er langt det mest almindelige oxygen. Det er dannet inde i store stjerner.',
  },
  {
    id: 'neon', titel: 'Byg neon-20 med fyldt yderste skal', mål: { p: 10, n: 10, e: 10 },
    tip: 'Neon er nr. 10. Massetal 20.',
    fakta: 'Neon har 2 + 8 elektroner, så den yderste skal er fyldt. Derfor reagerer neon næsten ikke med andre stoffer.',
  },
  {
    id: 'natrium-ion', titel: 'Lav en natrium-ion: Na⁺', mål: { p: 11, n: 12, e: 10 },
    tip: 'Byg natrium-23 (nr. 11), og tag så én elektron væk.',
    fakta: 'Natrium giver gerne sin yderste elektron væk. Så har den kun fyldte skaller tilbage, men bliver plusladet.',
  },
  {
    id: 'chlorid', titel: 'Lav en chlorid-ion: Cl⁻', mål: { p: 17, n: 18, e: 18 },
    tip: 'Byg chlor-35 (nr. 17), og giv den én ekstra elektron.',
    fakta: 'Na⁺ og Cl⁻ trækker i hinanden, fordi plus og minus tiltrækker hinanden. Sammen bliver de til køkkensalt!',
  },
  {
    id: 'carbon14', titel: 'Byg den radioaktive carbon-14', mål: { p: 6, n: 8, e: 6 },
    tip: 'Samme antal protoner som carbon-12, men to neutroner mere.',
    fakta: 'Carbon-14 bruges til at finde ud af, hvor gamle knogler og træ fra fortiden er.',
  },
  {
    id: 'jern', titel: 'Byg jern-56', mål: { p: 26, n: 30, e: 26 },
    tip: 'Jern er nr. 26. Knappen "Stabil kerne" kan hjælpe med neutronerne.',
    fakta: 'Jern-56 er en af de mest stabile kerner, der findes. Store stjerner ender med en kerne af jern, og så eksploderer de som en supernova.',
  },
  {
    id: 'uran', titel: 'Byg uran-235', mål: { p: 92, n: 143, e: 92 },
    tip: 'Uran er nr. 92. Massetal 235. Hold knapperne inde!',
    fakta: 'Uran-235 er det, man spalter i atomkraftværker. Det kan du prøve i Reaktoren.',
  },
  {
    id: 'uran-kaede', titel: 'Følg uran-238 hele vejen ned til bly', hændelse: true,
    tip: 'Byg uran-238 (hop til uran, og tryk "Stabil kerne"). Tryk så "Se den henfalde" igen og igen.',
    fakta: 'Uran-238 bliver til bly-206 efter 8 alfahenfald og 6 betahenfald. I naturen tager hele rejsen milliarder af år.',
  },
];

const HENFALD_TEKST = {
  'beta-': 'Betahenfald: En neutron blev til en proton. I samme øjeblik blev der skabt en helt ny elektron, som skød ud af kernen (sammen med en næsten usynlig antineutrino). Elektronen fandtes ikke i kernen før!',
  'beta+': 'Beta-plus-henfald: En proton blev til en neutron, og der blev skabt en positron (elektronens antistof-tvilling), som skød ud. Den møder hurtigt en elektron, og så forsvinder de begge i et glimt af gammastråling.',
  alfa: 'Alfahenfald: Kernen skød en alfapartikel ud: 2 protoner og 2 neutroner, der allerede sad i kernen. Den bliver bremset efter få centimeter i luft, fanger 2 elektroner og bliver til almindelig heliumgas.',
  'dobbeltbeta-': 'Dobbelt betahenfald: To neutroner blev til protoner på én gang og skød to elektroner ud.',
  'dobbeltbeta+': 'To protoner blev til neutroner på én gang og skød to positroner ud.',
  n: 'Kernen havde alt for mange neutroner og skød en neutron ud med det samme.',
  p: 'Kernen kunne ikke holde på alle protonerne og skød en proton ud med det samme.',
};

// Hvilken stråling kernen sender ud, og hvad der stopper den
// Korte udgaver til beskeden øverst (hele forklaringen står i Kerne-fanen)
const HENFALD_KORT = {
  'beta-': 'En neutron blev til en proton og skød en nyskabt elektron ud.',
  'beta+': 'En proton blev til en neutron og skød en positron (antistof) ud.',
  alfa: 'Kernen skød en alfapartikel ud (2 protoner + 2 neutroner).',
  'dobbeltbeta-': 'To neutroner blev til protoner på én gang.',
  'dobbeltbeta+': 'To protoner blev til neutroner på én gang.',
  n: 'Kernen skød en neutron ud.',
  p: 'Kernen skød en proton ud.',
};

const STRÅLING = {
  'beta-': 'Betastråling (elektroner). Bliver stoppet af nogle millimeter aluminium.',
  'dobbeltbeta-': 'Betastråling (elektroner). Bliver stoppet af nogle millimeter aluminium.',
  'beta+': 'Positroner. De møder hurtigt en elektron, og så forsvinder begge og bliver til gammastråling.',
  'dobbeltbeta+': 'Positroner. De møder hurtigt en elektron, og så forsvinder begge og bliver til gammastråling.',
  alfa: 'Alfastråling (heliumkerner). Bliver stoppet af et stykke papir, men er farlig, hvis stoffet kommer ind i kroppen.',
  n: 'Neutroner. De går let gennem mange ting og bliver bedst stoppet af vand eller beton.',
  p: 'Protoner.',
};

// Grundstoffer, som Carl Sagans citat om stjernestof handler om
const STJERNESTOF = [6, 7, 20, 26];

const HÆVET = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function hævet(tal) {
  return String(tal).split('').map((c) => HÆVET[c] ?? c).join('');
}
function ladningstegn(q) {
  if (q === 0) return '';
  return (Math.abs(q) > 1 ? hævet(Math.abs(q)) : '') + (q > 0 ? '⁺' : '⁻');
}
function tal(x, decimaler) {
  return x.toLocaleString('da-DK', decimaler == null ? undefined : { maximumFractionDigits: decimaler });
}
// "1 neutron" eller "2 neutroner"
function stk(antal, ental, flertal) {
  return `${antal} ${antal === 1 ? ental : flertal}`;
}
function kerneNavn(p, n) {
  if (p === 0) return n === 1 ? 'En fri neutron' : `${n} neutroner`;
  return isotopNavn(p, n);
}

const FYLDTE = [2, 10, 18, 36, 54, 86, 118]; // elektrontal med fyldt yderste skal (som ædelgasserne)

let atom = null;
let kort = null;
let tilstand = { p: 0, n: 0, e: 0 };
let aktivOpgave = null;
let visTip = false;
let elementer = {};
let aktiv = false;
let travl = false; // mens en kerne henfalder, kan man ikke bygge
let neutralTimer = null; // efter et henfald bliver atomet neutralt igen lidt efter
let kæde = null; // { alfa, beta } når man følger uran-238 ned til bly

function $(id) {
  return document.getElementById(id);
}

export function lavVærksted() {
  atom = new Atom();
  atom.gruppe.visible = false;
  verden.scene.add(atom.gruppe);

  elementer = {
    antalP: $('antalP'), antalN: $('antalN'), antalE: $('antalE'),
    kort: $('grundstofkort'), nr: $('infoNr'), symbol: $('infoSymbol'), navn: $('infoNavn'), masse: $('infoMasse'),
    kategori: $('infoKategori'), tal: $('infoTal'), stabilitet: $('infoStabilitet'), fakta: $('infoFakta'), model: $('infoModel'),
    opgaveTekst: $('opgaveTekst'), opgaveKrav: $('opgaveKrav'), opgaveTæller: $('opgaveTæller'),
    opdagetTæller: $('opdagetTæller'), kortTekst: $('stabkortTekst'),
    statusLinje: $('statusLinje'), sidsteHenfald: $('sidsteHenfald'), om: $('infoOm'),
  };
  kort = new Stabilitetskort($('stabilitetskort'), document.querySelectorAll('.stabkort-valg .chip'));

  lavKnapper();
  lavFaner();
  lavMinitabel();
  // På smalle skærme starter det periodiske system foldet sammen
  if (matchMedia('(max-width: 820px)').matches) {
    $('minitabelPanel').classList.add('lukket');
    $('knapMinitabel').textContent = 'Vis';
  }
  lavOpgaveliste();
  vælgNæsteOpgave();
  opdaterAlt();
}

export function startVærksted() {
  aktiv = true;
  atom.gruppe.visible = true;
  verden.opdateringer.add(opdater3D);
  sætVindue($('vaerkstedVindue'));
  verden.styring.autoRotate = true;
  flyInd(atom.størrelse());
  opdaterLydknap();
  opdaterAlt();
}

export function stopVærksted() {
  aktiv = false;
  atom.gruppe.visible = false;
  verden.opdateringer.delete(opdater3D);
}

// Åbner et grundstof fra Det periodiske system. Er det ikke opdaget endnu, får man en opgave om at bygge det.
export function åbnGrundstof(nr) {
  const g = grundstof(nr);
  const n = Math.min(MAX_N, typiskeNeutroner(nr));
  if (fremgang.erOpdaget(nr)) {
    sæt({ p: nr, n, e: nr });
    return;
  }
  sæt({ p: 0, n: 0, e: 0 });
  aktivOpgave = {
    id: `byg-${nr}`, midlertidig: true, titel: `Byg ${g.navn}-${nr + n}`, mål: { p: nr, n, e: nr },
    tip: `${g.navn} har ${nr} protoner. Den mest almindelige udgave har ${n} neutroner, og et neutralt atom har lige så mange elektroner som protoner.`,
    fakta: `Flot! Nu har du selv bygget ${g.navn.toLowerCase()}.`,
  };
  visTip = false;
  sætOpgaveFoldet(false);
  opdaterOpgave();
}

function opdater3D(dt) {
  atom.opdater(dt);
}

// ---------- Ændringer ----------
function ændr(type, retning) {
  if (travl) return false;
  const ny = { ...tilstand };
  ny[type] += retning;
  if (ny[type] < 0) return false;
  if (type === 'p' && ny.p > MAX_P) {
    visBesked({ titel: 'Ikke flere protoner', tekst: '118 er det højeste grundstof, man kender (oganesson).', type: 'advarsel' });
    lyd.nej();
    return false;
  }
  if (type === 'n' && ny.n > MAX_N) {
    visBesked({ titel: 'Ikke flere neutroner', tekst: `Værkstedet kan højst have ${MAX_N} neutroner.`, type: 'advarsel' });
    lyd.nej();
    return false;
  }
  if (type === 'e' && retning > 0) {
    if (ny.p === 0) {
      visBesked({ titel: 'Elektronen har intet at kredse om', tekst: 'Læg først en proton i kernen. Den plusladede kerne holder på de minusladede elektroner.', type: 'advarsel' });
      lyd.nej();
      return false;
    }
    if (ny.e > ny.p + EKSTRA_ELEKTRONER) {
      visBesked({ titel: 'Den bliver skubbet væk', tekst: 'Atomet kan ikke holde på flere ekstra elektroner. De frastøder hinanden, fordi de alle er minusladede.', type: 'advarsel' });
      lyd.nej();
      return false;
    }
  }
  if (retning > 0) lyd[type === 'p' ? 'proton' : type === 'n' ? 'neutron' : 'elektron']();
  else lyd.fjern();
  sæt(ny);
  return true;
}

// Sætter et nyt atom. intern = ændringen kommer fra et henfald, ikke fra knapperne.
function sæt(ny, intern = false) {
  if (travl && !intern) return;
  if (!intern) {
    clearTimeout(neutralTimer);
    neutralTimer = null;
    kæde = null; // man har selv ændret atomet, så kæden er brudt
    elementer.sidsteHenfald.classList.add('skjult');
  }
  // Atomet kan ikke holde på alle elektronerne, hvis der er for få protoner
  if (ny.e > ny.p + EKSTRA_ELEKTRONER) ny.e = ny.p + EKSTRA_ELEKTRONER;
  if (ny.p === 0) ny.e = 0;
  tilstand = ny;
  atom.sætMål(ny.p, ny.n, ny.e);
  passerTil(atom.størrelse()); // kameraet zoomer, så hele atomet kan ses
  opdaterAlt();
  tjekFremskridt();
}

// ---------- Henfald ----------
function startHenfald() {
  if (travl) return;
  // Venter atomet stadig på at blive neutralt efter sidste henfald, så gør det med det samme
  if (neutralTimer) {
    clearTimeout(neutralTimer);
    neutralTimer = null;
    sæt({ ...tilstand, e: tilstand.p }, true);
  }
  const måde = henfaldsmåde(tilstand.p, tilstand.n);
  if (!måde) return;
  const før = { ...tilstand };
  const førStabilitet = stabilitet(før.p, før.n);
  const varNeutral = før.e === før.p;
  if (før.p === 92 && før.n === 146) kæde = { alfa: 0, beta: 0 };
  travl = true;
  opdaterInfo();
  lyd.opbygning();

  atom.henfald(måde, (ny) => {
    travl = false;
    lyd.henfald(måde);
    kameraSving(0.45, 1.2);
    sæt({ p: ny.p, n: ny.n, e: før.e }, true);
    const efter = stabilitet(ny.p, ny.n);

    let tekst = HENFALD_TEKST[måde];
    if (førStabilitet.halveringstid) tekst += ` I virkeligheden tager det ${førStabilitet.halveringstid} (halveringstid), men vi har spolet frem.`;
    if (efter.status === 'stabil') tekst += ' Den nye kerne er stabil.';
    else if (efter.status !== 'tom') tekst += ' Den nye kerne er også ustabil. Tryk igen!';
    const q = tilstand.p - tilstand.e;
    if (varNeutral && q !== 0 && tilstand.p > 0) {
      tekst += q > 0
        ? ' Atomet mangler nu elektroner (det er en ion), men det fanger snart nogle fra omgivelserne.'
        : ' Atomet har nu for mange elektroner (det er en ion), men de forsvinder snart igen.';
    }
    const titel = `${kerneNavn(før.p, før.n)} → ${kerneNavn(ny.p, ny.n)}`;
    visBesked({ titel, tekst: HENFALD_KORT[måde] + ' Læs mere under Kerne.', type: 'henfald', varighed: 9000 });
    sætFane('kerne');
    // Teksten bliver også stående i Kerne-fanen, så man kan nå at læse den
    elementer.sidsteHenfald.innerHTML = `<strong>Seneste henfald: ${titel}</strong>${tekst}`;
    elementer.sidsteHenfald.classList.remove('skjult');

    løsHændelse('henfald');
    if (kæde) {
      if (måde === 'alfa') kæde.alfa++;
      else kæde.beta++;
      if (ny.p === 82 && ny.n === 124) {
        løsHændelse('uran-kaede', `Uran-238 blev til bly-206 efter ${kæde.alfa} alfahenfald og ${kæde.beta} betahenfald. I naturen tager hele rejsen milliarder af år.`);
        kæde = null;
      }
    }

    // Efter lidt tid bliver atomet neutralt igen
    if (varNeutral && tilstand.e !== tilstand.p) {
      neutralTimer = setTimeout(() => {
        neutralTimer = null;
        lyd.elektron();
        sæt({ ...tilstand, e: tilstand.p }, true);
      }, 1600);
    }
  });
}

// ---------- Faner i infopanelet ----------
function hentGemt(nøgle, standard) {
  try {
    return localStorage.getItem(nøgle) ?? standard;
  } catch {
    return standard;
  }
}
function gem(nøgle, værdi) {
  try {
    localStorage.setItem(nøgle, værdi);
  } catch {
    // ingen lagring: valget huskes bare ikke
  }
}

function lavFaner() {
  for (const knap of document.querySelectorAll('.fane-knap')) {
    knap.addEventListener('click', () => {
      lyd.klik();
      sætFane(knap.dataset.fane);
    });
  }
  sætFane(hentGemt('atomlabFane', 'atom'));
}

function sætFane(navn) {
  if (!['atom', 'kerne', 'fakta', 'nørd'].includes(navn)) navn = 'atom';
  for (const knap of document.querySelectorAll('.fane-knap')) knap.classList.toggle('valgt', knap.dataset.fane === navn);
  for (const fane of document.querySelectorAll('.fane')) fane.classList.toggle('vist', fane.dataset.fane === navn);
  gem('atomlabFane', navn);
  if (navn === 'kerne') kort?.tegn(); // kortet kan først tegnes, når det kan ses
}

function sætOpgaveFoldet(foldet) {
  $('opgavePille').classList.toggle('foldet', foldet);
  const knap = $('knapOpgaveFold');
  knap.textContent = foldet ? '+' : '–';
  knap.title = foldet ? 'Vis opgaven' : 'Skjul opgaven';
  gem('atomlabOpgaveFoldet', foldet ? 'ja' : 'nej');
}

// ---------- Knapper ----------
function lavKnapper() {
  // Hold knappen inde for at gentage (hurtigere og hurtigere)
  for (const knap of document.querySelectorAll('#byggepanel .rund')) {
    const type = knap.dataset.type;
    const retning = Number(knap.dataset.retning);
    let timer = null;
    let pause = 300;
    const stop = () => {
      clearTimeout(timer);
      timer = null;
      knap.classList.remove('trykket');
    };
    const gentag = () => {
      if (!ændr(type, retning)) return stop();
      pause = Math.max(35, pause * 0.82);
      timer = setTimeout(gentag, pause);
    };
    knap.addEventListener('pointerdown', (h) => {
      h.preventDefault();
      knap.setPointerCapture?.(h.pointerId);
      knap.classList.add('trykket');
      pause = 300;
      if (ændr(type, retning)) timer = setTimeout(gentag, 380);
    });
    for (const navn of ['pointerup', 'pointercancel', 'lostpointercapture']) knap.addEventListener(navn, stop);
    knap.addEventListener('contextmenu', (h) => h.preventDefault());
  }

  $('knapNeutral').addEventListener('click', () => {
    if (travl) return;
    if (tilstand.p === 0) return visBesked({ titel: 'Ingen protoner endnu', tekst: 'Et neutralt atom har lige så mange elektroner som protoner.', type: 'advarsel' });
    lyd.elektron();
    sæt({ ...tilstand, e: tilstand.p });
  });
  $('knapStabil').addEventListener('click', () => {
    if (travl) return;
    if (tilstand.p === 0) return visBesked({ titel: 'Ingen protoner endnu', tekst: 'Vælg først et grundstof ved at lægge protoner i kernen.', type: 'advarsel' });
    lyd.neutron();
    sæt({ ...tilstand, n: Math.min(MAX_N, typiskeNeutroner(tilstand.p)) });
  });
  $('knapRyd').addEventListener('click', () => {
    if (travl) return;
    lyd.fjern();
    sæt({ p: 0, n: 0, e: 0 });
  });

  $('knapVisning').addEventListener('click', () => {
    const sky = atom.visning !== 'sky';
    atom.sætVisning(sky ? 'sky' : 'ringe');
    $('knapVisning').textContent = sky ? 'Ringe' : 'Elektronsky';
    lyd.klik();
    opdaterInfo();
  });
  $('knapLyd').addEventListener('click', () => {
    skiftLyd();
    opdaterLydknap();
    lyd.klik();
  });
  $('knapHjælp').addEventListener('click', () => åbn('hjælp'));
  $('knapOpgaver').addEventListener('click', () => åbn('opgaveliste'));
  $('knapOpgaveFold').addEventListener('click', () => {
    lyd.klik();
    sætOpgaveFoldet(!$('opgavePille').classList.contains('foldet'));
  });
  sætOpgaveFoldet(hentGemt('atomlabOpgaveFoldet', 'nej') === 'ja');
  $('knapMinitabel').addEventListener('click', () => {
    const panel = $('minitabelPanel');
    panel.classList.toggle('lukket');
    $('knapMinitabel').textContent = panel.classList.contains('lukket') ? 'Vis' : 'Skjul';
    setTimeout(() => dispatchEvent(new Event('resize')), 50);
  });
  $('knapOpgaverForfra').addEventListener('click', () => {
    if (!confirm('Vil du starte forfra med opgaverne? De grundstoffer, du har opdaget, beholder du.')) return;
    fremgang.nulstilOpgaver();
    vælgNæsteOpgave();
    lavOpgaveliste();
    opdaterAlt();
    lyd.klik();
    $('opgaveliste').classList.add('skjult');
    visBesked({ titel: 'Opgaverne starter forfra', tekst: 'Alle stjerner er nulstillet. God fornøjelse!' });
  });
  $('knapNulstil').addEventListener('click', () => {
    if (!confirm('Vil du slette alle løste opgaver og opdagede grundstoffer?')) return;
    fremgang.nulstilFremgang();
    lavMinitabel();
    lavOpgaveliste();
    vælgNæsteOpgave();
    opdaterAlt();
  });

  // Knapper inde i infopanelet (de tegnes forfra hele tiden, så vi lytter på panelet)
  $('infopanel').addEventListener('click', (h) => {
    if (h.target.closest('.henfald-knap')) startHenfald();
    const link = h.target.closest('[data-hjælp]');
    if (link) åbnHjælp(link.dataset.hjælp);
    const fane = h.target.closest('[data-til-fane]');
    if (fane) {
      lyd.klik();
      sætFane(fane.dataset.tilFane);
    }
  });

  // Luk dialoger
  for (const overlag of document.querySelectorAll('.overlag')) {
    overlag.addEventListener('click', (h) => {
      if (h.target === overlag || h.target.closest('[data-luk]')) overlag.classList.add('skjult');
    });
  }

  addEventListener('keydown', (h) => {
    if (!aktiv || h.ctrlKey || h.metaKey || h.altKey) return;
    if (document.querySelector('.overlag:not(.skjult)')) {
      if (h.key === 'Escape') document.querySelectorAll('.overlag').forEach((o) => o.classList.add('skjult'));
      return;
    }
    const tast = h.key.toLowerCase();
    const type = { p: 'p', n: 'n', e: 'e' }[tast];
    if (type) {
      h.preventDefault();
      ændr(type, h.shiftKey ? -1 : 1);
    } else if (tast === 'h') {
      h.preventDefault();
      startHenfald();
    }
  });
}

function åbn(id) {
  lyd.klik();
  if (id === 'opgaveliste') lavOpgaveliste();
  $(id).classList.remove('skjult');
}

// Åbner hjælpen ved et bestemt afsnit
function åbnHjælp(afsnit) {
  åbn('hjælp');
  requestAnimationFrame(() => $(afsnit)?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
}

function opdaterLydknap() {
  $('knapLyd').textContent = lydErTændt() ? '🔊' : '🔇';
}

// ---------- Det lille periodiske system ----------
function lavMinitabel() {
  const tabel = $('minitabel');
  tabel.innerHTML = '';
  for (const g of GRUNDSTOFFER) {
    const { række, kolonne } = placering(g.nr);
    const felt = document.createElement('button');
    felt.className = 'felt';
    felt.style.gridRow = række;
    felt.style.gridColumn = kolonne;
    felt.style.setProperty('--farve', KATEGORIER[g.kategori].farve);
    felt.dataset.nr = g.nr;
    felt.textContent = g.symbol;
    felt.addEventListener('click', () => vælgFraTabel(g.nr));
    tabel.append(felt);
  }
  // Pladsholdere, der viser hvor lanthaniderne og actiniderne hører til
  for (const [række, tekst] of [[6, '57–71'], [7, '89–103']]) {
    const mærke = document.createElement('span');
    mærke.className = 'felt pladsholder';
    mærke.style.gridRow = række;
    mærke.style.gridColumn = 3;
    mærke.textContent = '•';
    mærke.title = `Nr. ${tekst} står nederst`;
    tabel.append(mærke);
  }
  opdaterMinitabel();
}

function opdaterMinitabel() {
  for (const felt of document.querySelectorAll('#minitabel .felt[data-nr]')) {
    const nr = Number(felt.dataset.nr);
    const opdaget = fremgang.erOpdaget(nr);
    felt.classList.toggle('opdaget', opdaget);
    felt.classList.toggle('valgt', nr === tilstand.p);
    const g = grundstof(nr);
    felt.title = opdaget ? `${g.nr}. ${g.navn}` : `Nr. ${nr}: ikke opdaget endnu`;
  }
  elementer.opdagetTæller.textContent = `Opdaget: ${fremgang.antalOpdaget()} af 118`;
}

function vælgFraTabel(nr) {
  if (travl) return;
  if (!fremgang.erOpdaget(nr)) {
    lyd.nej();
    visBesked({
      titel: `Grundstof nr. ${nr} er ikke opdaget endnu`,
      tekst: `Byg det selv først: læg ${nr} protoner i kernen og gør atomet neutralt. Så kan du hoppe direkte til det bagefter.`,
      type: 'advarsel', varighed: 6000,
    });
    return;
  }
  lyd.klik();
  kameraSving();
  sæt({ p: nr, n: Math.min(MAX_N, typiskeNeutroner(nr)), e: nr });
}

// ---------- Opgaver ----------
function vælgNæsteOpgave() {
  aktivOpgave = OPGAVER.find((o) => !fremgang.erLøst(o.id)) || null;
  visTip = false;
}

function passer(o, t) {
  if (!o.mål) return false;
  return ['p', 'n', 'e'].every((k) => o.mål[k] == null || o.mål[k] === t[k]);
}

function lavOpgaveliste() {
  const liste = $('opgaver');
  liste.innerHTML = '';
  for (const o of OPGAVER) {
    const li = document.createElement('li');
    const løst = fremgang.erLøst(o.id);
    li.className = løst ? 'løst' : '';
    if (aktivOpgave && o.id === aktivOpgave.id) li.classList.add('aktiv');
    li.innerHTML = `<span class="flueben">${løst ? '★' : '☆'}</span><span class="opgave-titel"></span><small></small>`;
    li.querySelector('.opgave-titel').textContent = o.titel;
    li.querySelector('small').textContent = løst ? o.fakta : o.tip;
    li.addEventListener('click', () => {
      aktivOpgave = o;
      visTip = false;
      lyd.klik();
      $('opgaveliste').classList.add('skjult');
      opdaterOpgave();
    });
    liste.append(li);
  }
}

function opdaterOpgave() {
  const ider = OPGAVER.map((o) => o.id);
  elementer.opgaveTæller.textContent = `${fremgang.antalLøste(ider)}/${OPGAVER.length}`;
  const krav = elementer.opgaveKrav;
  krav.innerHTML = '';
  if (!aktivOpgave) {
    elementer.opgaveTekst.textContent = 'Alle opgaver er klaret! Byg frit, og opdag flere grundstoffer.';
    return;
  }
  const o = aktivOpgave;
  elementer.opgaveTekst.textContent = (fremgang.erLøst(o.id) ? '★ ' : '') + o.titel;
  const navne = { p: 'Protoner', n: 'Neutroner', e: 'Elektroner' };
  if (o.mål) {
    for (const type of ['p', 'n', 'e']) {
      if (o.mål[type] == null) continue;
      const ok = tilstand[type] === o.mål[type];
      const chip = document.createElement('span');
      chip.className = 'chip ' + (ok ? 'ok' : '');
      chip.innerHTML = `<span class="navn-lang">${navne[type]}</span><span class="navn-kort">${type.toUpperCase()}</span> ${visTip ? o.mål[type] : ok ? '✓' : '?'}`;
      chip.title = navne[type];
      krav.append(chip);
    }
  }
  const tip = document.createElement('button');
  tip.className = 'chip tip';
  tip.textContent = 'Tip';
  tip.addEventListener('click', () => {
    visTip = true;
    lyd.klik();
    visBesked({ titel: `Tip: ${o.titel}`, tekst: o.tip, varighed: 9000 });
    opdaterOpgave();
  });
  krav.append(tip);
}

function fejrOpgave(o, fakta) {
  setTimeout(() => {
    lyd.klaret();
    atom.fejr(0xffd43b);
    visBesked({ titel: `Opgave klaret: ${o.titel} ★`, tekst: fakta || o.fakta, type: 'klaret', varighed: 8000 });
  }, 250);
  if (!aktivOpgave || aktivOpgave.id === o.id) vælgNæsteOpgave();
}

function løsHændelse(id, fakta) {
  const o = OPGAVER.find((x) => x.id === id);
  if (o && fremgang.løs(id)) fejrOpgave(o, fakta);
  opdaterOpgave();
}

function tjekFremskridt() {
  const { p, n, e } = tilstand;
  // Nyt grundstof? Det tæller, når atomet er neutralt og kernen kan hænge sammen.
  if (p > 0 && e === p && stabilitet(p, n).status !== 'straks' && fremgang.opdag(p)) {
    const g = grundstof(p);
    lyd.opdaget();
    visBesked({ titel: `Nyt grundstof opdaget: ${g.navn} (${g.symbol})`, tekst: `Grundstof nr. ${p}. Nu kan du hoppe direkte til det i det periodiske system.`, type: 'opdaget' });
    atom.fejr(0x8ce99a);
    opdaterMinitabel();
  }
  for (const o of OPGAVER) {
    if (passer(o, tilstand) && fremgang.løs(o.id)) fejrOpgave(o);
  }
  // En opgave fra Det periodiske system (gemmes ikke i listen)
  if (aktivOpgave?.midlertidig && passer(aktivOpgave, tilstand)) {
    const o = aktivOpgave;
    vælgNæsteOpgave();
    setTimeout(() => {
      lyd.klaret();
      atom.fejr(0xffd43b);
      visBesked({ titel: `${o.titel} ★`, tekst: o.fakta, type: 'klaret', varighed: 7000 });
    }, 250);
  }
  opdaterOpgave();
}

// ---------- Infopanelet ----------
function opdaterAlt() {
  elementer.antalP.textContent = tilstand.p;
  elementer.antalN.textContent = tilstand.n;
  elementer.antalE.textContent = tilstand.e;
  atom.sætStatus(stabilitet(tilstand.p, tilstand.n).status || 'tom');
  opdaterInfo();
  opdaterMinitabel();
  opdaterOpgave();
}

function opdaterInfo() {
  const { p, n, e } = tilstand;
  const el = elementer;
  const st = stabilitet(p, n);
  const måde = henfaldsmåde(p, n);
  opdaterKort(st);
  opdaterCitat(st);
  visStabilitet(st, måde);
  opdaterStatus(st, måde);
  opdaterNørd();

  // Prik på Kerne-fanen, når kernen er ustabil
  const kerneFane = document.querySelector('.fane-knap[data-fane="kerne"]');
  kerneFane.classList.toggle('advarsel', ['ustabil', 'meget'].includes(st.status));
  kerneFane.classList.toggle('fare', st.status === 'straks');

  if (p === 0) {
    el.kort.style.setProperty('--farve', '#5c6b8a');
    el.nr.textContent = '';
    el.symbol.textContent = '?';
    el.navn.textContent = 'Intet grundstof endnu';
    el.masse.textContent = '';
    el.kategori.textContent = n ? 'Kun neutroner' : 'Læg en proton i kernen for at begynde';
    el.tal.innerHTML = '';
    el.model.textContent = 'Antallet af protoner bestemmer, hvilket grundstof atomet er. 1 proton er hydrogen, 6 er carbon, 79 er guld.';
    el.fakta.textContent = 'Læg en proton i kernen for at begynde. Antallet af protoner bestemmer, hvilket grundstof atomet er.';
    el.om.innerHTML = '';
    return;
  }

  const g = grundstof(p);
  const kat = KATEGORIER[g.kategori];
  const pl = placering(p);
  el.kort.style.setProperty('--farve', kat.farve);
  el.nr.textContent = g.nr;
  el.symbol.textContent = g.symbol;
  el.navn.innerHTML = g.navn + (g.kaldenavn ? ` <small>(${g.kaldenavn})</small>` : '');
  // Hele tal i [ ] er massetallet for den mest stabile isotop (grundstoffet har ingen stabile)
  el.masse.textContent = Number.isInteger(g.masse) ? `[${g.masse}]` : tal(g.masse);
  el.kategori.textContent = `${kat.navn} · ${TILSTANDE[g.tilstand]}`;

  // Fanen "Atom"
  const q = p - e;
  let ladning;
  if (e === 0) {
    ladning = `+${p}: en nøgen kerne uden elektroner (${g.symbol}${ladningstegn(p)}). Det findes fx inde i Solen, hvor der er så varmt, at alle elektronerne bliver revet af.`;
    if (p === 1 && n === 0) ladning = '+1: bare en enkelt proton (H⁺)';
    if (p === 2 && n === 2) ladning = '+2: en alfapartikel (heliumkerne)';
  } else if (q === 0) ladning = '0: et neutralt atom';
  else if (q > 0) ladning = `+${q}: en positiv ion (${g.symbol}${ladningstegn(q)}), der mangler elektroner`;
  else ladning = `${q}: en negativ ion (${g.symbol}${ladningstegn(q)}) med ekstra elektroner`;
  if (q !== 0) ladning += ' <button class="link-knap" data-hjælp="hjælpIoner">Hvad er en ion?</button>';

  const skaller = skallerForIon(p, e);
  let skalTekst = skaller.length ? skaller.join(' · ') : 'ingen';
  if (FYLDTE.includes(e)) skalTekst += ' <small>(fyldt yderste skal)</small>';

  const rækker = [
    ['Isotop', `${isotopNavn(p, n)} <span class="notation">${hævet(p + n)}${g.symbol}</span>`],
    ['Massetal', `${p + n} <small>= ${stk(p, 'proton', 'protoner')} + ${stk(n, 'neutron', 'neutroner')}</small>`],
    ['Ladning', ladning],
    ['Elektronskaller', skalTekst],
  ];
  el.tal.innerHTML = rækker.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  el.model.textContent = atom.visning === 'sky'
    ? 'Elektronsky: I virkeligheden kredser elektroner ikke i baner som planeter. Man kan kun sige, hvor de sandsynligvis er, og det ligner en sky.'
    : 'Ringene er en forenklet tegning, der gør det let at tælle elektronerne. Prøv "Elektronsky".';
  if (p + n > 1) el.model.textContent += ' De gyldne lyspunkter i kernen viser, hvor kernekraften "limer" partiklerne sammen. Kraften selv kan man ikke se.';

  // Fanen "Fakta"
  el.fakta.textContent = faktaOm(p);
  const om = [
    ['Gruppe', `${kat.navn}. <small>${kat.tekst}</small>`],
    ['Ved stuetemperatur', TILSTANDE[g.tilstand]],
    ['Placering', `Periode ${pl.periode}` + (pl.gruppe ? `, gruppe ${pl.gruppe}` : ', i de to rækker nederst')],
    ['Atommasse', Number.isInteger(g.masse)
      ? `[${g.masse}] <small>Massetallet for den mest stabile isotop.</small>`
      : `${tal(g.masse)} <small>Gennemsnittet af grundstoffets isotoper i naturen.</small>`],
  ];
  el.om.innerHTML = om.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
}

// Fanen "Nørd": flere detaljer til de nysgerrige
function opdaterNørd() {
  const { p, n } = tilstand;
  const dl = document.getElementById('infoNørd');
  const note = document.getElementById('infoNørdNote');
  if (p === 0) {
    dl.innerHTML = '';
    note.textContent = 'Byg et atom for at se elektronkonfiguration, kernens størrelse og bindingsenergi.';
    return;
  }
  const g = grundstof(p);
  const a = p + n;
  const k = konfigurationTekst(p);
  const b = bindingsenergi(p, n);
  const tal2 = (x) => x.toLocaleString('da-DK', { maximumFractionDigits: 2 });
  const rækker = [
    ['Elektron&shy;konfiguration', `<span class="formel">${k.kort}</span><br><small>for et neutralt ${g.navn.toLowerCase()}-atom</small>`],
    ['Kernens radius', `ca. ${tal2(kerneRadiusFm(a))} fm <small>(1 femtometer = en milliontedel af en milliardtedel meter). Hele atomet er ca. 100.000 gange større.</small>`],
  ];
  if (b) {
    const andel = Math.min(1, b.prNukleon / 9);
    rækker.push(['Bindings&shy;energi', `${tal2(b.ialt)} MeV i alt, <b>${tal2(b.prNukleon)} MeV pr. nukleon</b> <small>(${b.målt ? 'målt' : 'beregnet med dråbemodellen'})</small>
      <div class="bindingsbjælke" title="Gul streg: jern og nikkel (ca. 8,8 MeV)"><div style="width:${andel * 100}%"></div><span style="left:${(8.8 / 9) * 100}%"></span></div>`]);
  } else {
    rækker.push(['Bindings&shy;energi', '<small>Kan ikke vises for denne kerne (den er for lille til dråbemodellen, eller den hænger ikke sammen).</small>']);
  }
  rækker.push(['Tæthed', '<small>Kernestof er så tæt, at en teskefuld ville veje omkring en milliard ton.</small>']);
  dl.innerHTML = rækker.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  note.textContent = 'Bindingsenergien er den energi, der skal til for at skille kernen helt ad. Jern og nikkel har den højeste pr. nukleon (ca. 8,8 MeV, den gule streg). Derfor giver fusion energi for lette kerner og fission energi for tunge kerner: Begge dele flytter kernerne tættere på jern.';
}

// Statuslinjen: det vigtigste i ét blik (isotop, ladning, stabilitet og henfaldsknap)
function opdaterStatus(st, måde) {
  const { p, n, e } = tilstand;
  const linje = elementer.statusLinje;
  if (p + n === 0) {
    linje.innerHTML = '<span class="status-tip">Byg et atom med knapperne til venstre.</span>';
    return;
  }
  const chips = [];
  if (p > 0) {
    const g = grundstof(p);
    chips.push(`<span class="status-chip isotop">${isotopNavn(p, n).replace(' (', ' <small>(').replace(')', ')</small>')}</span>`);
    const q = p - e;
    if (e === 0) chips.push(`<span class="status-chip ion">Nøgen kerne ${g.symbol}${ladningstegn(p)}</span>`);
    else if (q === 0) chips.push('<span class="status-chip">Neutralt</span>');
    else chips.push(`<span class="status-chip ion">Ion ${g.symbol}${ladningstegn(q)}</span>`);
  }
  const ord = { stabil: '✓ Stabil', næsten: '≈ Næsten stabil', ustabil: '☢ Ustabil', meget: '☢ Meget ustabil', straks: '✸ Falder fra hinanden' }[st.status];
  if (ord) chips.push(`<button class="status-chip knap ${st.status}" data-til-fane="kerne" title="Se mere om kernen">${ord}</button>`);
  if (måde) chips.push(`<button class="status-chip henfald-knap"${travl ? ' disabled' : ''} title="Se kernen henfalde (tast H)">${travl ? '…' : '▶ Henfald'}</button>`);
  linje.innerHTML = chips.join('');
}

// Et citat, der passer til det, man har bygget
function opdaterCitat(st) {
  const { p } = tilstand;
  let nøgle;
  if (p === 0) nøgle = 'feynman';
  else if (atom.visning === 'sky') nøgle = p % 2 ? 'bohr' : 'feynmanKvante';
  else if (['ustabil', 'meget', 'næsten'].includes(st.status)) nøgle = 'einsteinTerninger';
  else if (STJERNESTOF.includes(p)) nøgle = 'saganStjernestof';
  else nøgle = ['rutherford', 'einsteinNysgerrighed', 'saganÆbletærte', 'feynman'][p % 4];
  const boks = document.getElementById('infoCitat');
  if (boks.dataset.nøgle !== nøgle) {
    boks.dataset.nøgle = nøgle;
    boks.innerHTML = citatHTML(nøgle);
  }
}

function visStabilitet(st, måde = henfaldsmåde(tilstand.p, tilstand.n)) {
  const boks = elementer.stabilitet;
  boks.className = 'stabilitet ' + (st.status || 'tom');
  if (!st.status || st.status === 'tom') {
    boks.innerHTML = '';
    return;
  }
  const ikon = { stabil: '✓', næsten: '≈', ustabil: '☢', meget: '☢', straks: '✸' }[st.status];
  let knapper = '';
  if (måde) {
    const tekst = st.status === 'straks' ? '▶ Se den falde fra hinanden' : '▶ Se den henfalde';
    knapper += `<button class="knap lille henfald-knap"${travl ? ' disabled' : ''}>${travl ? 'Henfalder …' : tekst}</button>`;
  }
  knapper += '<button class="link-knap" data-hjælp="hjælpNeutroner">Hvorfor?</button>';
  if (måde && st.status !== 'straks') knapper += '<button class="link-knap" data-hjælp="hjælpRadioaktivitet">Er det farligt?</button>';
  const stråling = måde && st.status !== 'straks' && tilstand.p > 0 ? `<span class="straaling">Stråling: ${STRÅLING[måde]}</span>` : '';
  boks.innerHTML = `<strong>${ikon} ${st.overskrift}</strong>`
    + (st.halveringstid ? `<span class="halv" title="Den tid, det tager, før halvdelen af kernerne er henfaldet">Halveringstid: ${st.halveringstid}</span>` : '')
    + `<span>${st.tekst}</span>`
    + stråling
    + `<span class="knapper">${knapper}</span>`;
}

// Stabilitetskortet og teksten under det
function opdaterKort(st) {
  const { p, n } = tilstand;
  kort.vis(p, n, st.status || 'tom');
  const t = elementer.kortTekst;
  if (p + n === 0) {
    t.textContent = 'Byg en kerne, så kan du se, hvor den ligger i forhold til de stabile kerner.';
    return;
  }
  if (p === 0) {
    t.textContent = 'Kun neutroner: prikken ligger helt nede ved bunden, langt fra de stabile kerner.';
    return;
  }
  let tekst = `Din kerne: ${stk(p, 'proton', 'protoner')} og ${stk(n, 'neutron', 'neutroner')} (${tal(n / p, 2)} neutroner pr. proton). `;
  const interval = stabileNeutroner(p);
  const g = grundstof(p);
  if (interval) {
    const [min, maks] = interval;
    tekst += min === maks
      ? `Den eneste stabile ${g.navn.toLowerCase()} har ${stk(min, 'neutron', 'neutroner')}.`
      : `Stabile ${g.navn.toLowerCase()}-kerner har ${min}–${maks} neutroner.`;
  } else if (p >= 84) {
    tekst += 'Fra grundstof nr. 84 og opefter er ingen kerner stabile, uanset hvor mange neutroner de har.';
  } else {
    tekst += `${g.navn} har slet ingen stabile kerner.`;
  }
  t.textContent = tekst;
}
