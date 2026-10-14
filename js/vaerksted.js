// Atomværkstedet: byg et atom af protoner, neutroner og elektroner, og se hvad det bliver.

import { verden, sætVindue, passerTil } from './scene3d.js';
import { Atom } from './atom.js';
import { GRUNDSTOFFER, grundstof, KATEGORIER, TILSTANDE, faktaOm, skallerForIon, placering } from './data/grundstoffer.js';
import { stabilitet, isotopNavn, typiskeNeutroner } from './data/isotoper.js';
import * as fremgang from './fremgang.js';
import { lyd, lydErTændt, skiftLyd } from './lyd.js';
import { visBesked } from './beskeder.js';

const MAX_P = 118;
const MAX_N = 180;
const EKSTRA_ELEKTRONER = 2; // så mange ekstra elektroner kan et atom holde på (fx O²⁻)

export const OPGAVER = [
  {
    id: 'hydrogen', titel: 'Byg et hydrogenatom', mål: { p: 1, n: 0, e: 1 },
    tip: 'Hydrogen er grundstof nr. 1. Det har ingen neutroner.',
    fakta: 'Hydrogen er det mest almindelige grundstof i universet. Det har kun én proton og én elektron.',
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
    id: 'carbon', titel: 'Byg carbon-12 (kulstof)', mål: { p: 6, n: 6, e: 6 },
    tip: 'Carbon er nr. 6. Massetal 12, og atomet skal være neutralt.',
    fakta: 'Alt liv på Jorden er bygget op omkring carbon. Du består af ca. 18 % carbon.',
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
];

const HÆVET = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function hævet(tal) {
  return String(tal).split('').map((c) => HÆVET[c] ?? c).join('');
}
function ladningstegn(q) {
  if (q === 0) return '';
  return (Math.abs(q) > 1 ? hævet(Math.abs(q)) : '') + (q > 0 ? '⁺' : '⁻');
}
function tal(x) {
  return x.toLocaleString('da-DK');
}

const FYLDTE = [2, 10, 18, 36, 54, 86, 118]; // elektrontal med fyldt yderste skal (som ædelgasserne)

let atom = null;
let tilstand = { p: 0, n: 0, e: 0 };
let aktivOpgave = null;
let visTip = false;
let elementer = {};
let aktiv = false;

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
    opdagetTæller: $('opdagetTæller'),
  };

  lavKnapper();
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
  passerTil(atom.størrelse());
  opdaterLydknap();
  opdaterAlt();
}

export function stopVærksted() {
  aktiv = false;
  atom.gruppe.visible = false;
  verden.opdateringer.delete(opdater3D);
}

function opdater3D(dt) {
  atom.opdater(dt);
}

// ---------- Ændringer ----------
function ændr(type, retning) {
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
  // Fjernes protoner, kan atomet ikke længere holde på alle elektronerne
  if (ny.e > ny.p + EKSTRA_ELEKTRONER) ny.e = ny.p + EKSTRA_ELEKTRONER;
  if (ny.p === 0) ny.e = 0;

  if (retning > 0) lyd[type === 'p' ? 'proton' : type === 'n' ? 'neutron' : 'elektron']();
  else lyd.fjern();
  sæt(ny);
  return true;
}

function sæt(ny) {
  tilstand = ny;
  atom.sætMål(ny.p, ny.n, ny.e);
  passerTil(atom.størrelse()); // kameraet zoomer, så hele atomet kan ses
  opdaterAlt();
  tjekFremskridt();
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
    if (tilstand.p === 0) return visBesked({ titel: 'Ingen protoner endnu', tekst: 'Et neutralt atom har lige så mange elektroner som protoner.', type: 'advarsel' });
    lyd.elektron();
    sæt({ ...tilstand, e: tilstand.p });
  });
  $('knapStabil').addEventListener('click', () => {
    if (tilstand.p === 0) return visBesked({ titel: 'Ingen protoner endnu', tekst: 'Vælg først et grundstof ved at lægge protoner i kernen.', type: 'advarsel' });
    lyd.neutron();
    sæt({ ...tilstand, n: Math.min(MAX_N, typiskeNeutroner(tilstand.p)) });
  });
  $('knapRyd').addEventListener('click', () => {
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
  $('knapMinitabel').addEventListener('click', () => {
    const panel = $('minitabelPanel');
    panel.classList.toggle('lukket');
    $('knapMinitabel').textContent = panel.classList.contains('lukket') ? 'Vis' : 'Skjul';
    setTimeout(() => dispatchEvent(new Event('resize')), 50);
  });
  $('knapNulstil').addEventListener('click', () => {
    if (!confirm('Vil du slette alle løste opgaver og opdagede grundstoffer?')) return;
    fremgang.nulstilFremgang();
    lavMinitabel();
    lavOpgaveliste();
    vælgNæsteOpgave();
    opdaterAlt();
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
    const type = { p: 'p', n: 'n', e: 'e' }[h.key.toLowerCase()];
    if (type) {
      h.preventDefault();
      ændr(type, h.shiftKey ? -1 : 1);
    }
  });
}

function åbn(id) {
  lyd.klik();
  if (id === 'opgaveliste') lavOpgaveliste();
  $(id).classList.remove('skjult');
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
  sæt({ p: nr, n: Math.min(MAX_N, typiskeNeutroner(nr)), e: nr });
}

// ---------- Opgaver ----------
function vælgNæsteOpgave() {
  aktivOpgave = OPGAVER.find((o) => !fremgang.erLøst(o.id)) || null;
  visTip = false;
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
  for (const type of ['p', 'n', 'e']) {
    const ok = tilstand[type] === o.mål[type];
    const chip = document.createElement('span');
    chip.className = 'chip ' + (ok ? 'ok' : '');
    chip.textContent = `${navne[type]} ${visTip ? o.mål[type] : ok ? '✓' : '?'}`;
    krav.append(chip);
  }
  const tip = document.createElement('button');
  tip.className = 'chip tip';
  tip.textContent = visTip ? o.tip : 'Tip';
  tip.addEventListener('click', () => {
    visTip = !visTip;
    lyd.klik();
    opdaterOpgave();
  });
  krav.append(tip);
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
    if (o.mål.p === p && o.mål.n === n && o.mål.e === e && fremgang.løs(o.id)) {
      setTimeout(() => {
        lyd.klaret();
        atom.fejr(0xffd43b);
        visBesked({ titel: `Opgave klaret: ${o.titel} ★`, tekst: o.fakta, type: 'klaret', varighed: 7000 });
      }, 250);
      if (!aktivOpgave || aktivOpgave.id === o.id) vælgNæsteOpgave();
    }
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

  if (p === 0) {
    el.kort.style.setProperty('--farve', '#5c6b8a');
    el.nr.textContent = '';
    el.symbol.textContent = '?';
    el.navn.textContent = 'Intet grundstof endnu';
    el.masse.textContent = '';
    el.kategori.textContent = '';
    el.tal.innerHTML = '';
    el.fakta.textContent = 'Læg en proton i kernen for at begynde. Antallet af protoner bestemmer, hvilket grundstof atomet er.';
    visStabilitet(st);
    el.model.textContent = '';
    return;
  }

  const g = grundstof(p);
  const kat = KATEGORIER[g.kategori];
  el.kort.style.setProperty('--farve', kat.farve);
  el.nr.textContent = g.nr;
  el.symbol.textContent = g.symbol;
  el.navn.textContent = g.navn + (g.kaldenavn ? ` (${g.kaldenavn})` : '');
  // Hele tal i [ ] er massetallet for den mest stabile isotop (grundstoffet har ingen stabile)
  el.masse.textContent = Number.isInteger(g.masse) ? `[${g.masse}]` : tal(g.masse);
  const pl = placering(p);
  el.kategori.textContent = `${kat.navn} · ${TILSTANDE[g.tilstand]} ved stuetemperatur · Periode ${pl.periode}` + (pl.gruppe ? `, gruppe ${pl.gruppe}` : '');

  const q = p - e;
  let ladning;
  if (e === 0) {
    ladning = `+${p}: en nøgen kerne uden elektroner`;
    if (p === 1 && n === 0) ladning = '+1: bare en enkelt proton (H⁺)';
    if (p === 2 && n === 2) ladning = '+2: en alfapartikel (heliumkerne)';
  } else if (q === 0) ladning = '0: et neutralt atom';
  else if (q > 0) ladning = `+${q}: en positiv ion (${g.symbol}${ladningstegn(q)}), der mangler elektroner`;
  else ladning = `${q}: en negativ ion (${g.symbol}${ladningstegn(q)}) med ekstra elektroner`;

  const skaller = skallerForIon(p, e);
  let skalTekst = skaller.length ? skaller.join(' · ') : 'ingen';
  if (FYLDTE.includes(e)) skalTekst += ' (fyldt yderste skal)';

  const rækker = [
    ['Isotop', `${isotopNavn(p, n)} <span class="notation">${hævet(p + n)}${g.symbol}</span>`],
    ['Massetal', `${p + n} <small>= ${p} protoner + ${n} neutroner</small>`],
    ['Ladning', ladning],
    ['Elektronskaller', skalTekst],
  ];
  el.tal.innerHTML = rækker.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');

  visStabilitet(st);
  el.fakta.textContent = faktaOm(p);
  el.model.textContent = atom.visning === 'sky'
    ? 'Elektronsky: I virkeligheden kredser elektroner ikke i baner som planeter. Man kan kun sige, hvor de sandsynligvis er, og det ligner en sky.'
    : 'Ringene er en forenklet tegning, der gør det let at tælle elektronerne. Prøv "Elektronsky".';
}

function visStabilitet(st) {
  const boks = elementer.stabilitet;
  boks.className = 'stabilitet ' + (st.status || 'tom');
  if (!st.status || st.status === 'tom') {
    boks.innerHTML = '';
    return;
  }
  const ikon = { stabil: '✓', næsten: '≈', ustabil: '☢', meget: '☢', straks: '✸' }[st.status];
  boks.innerHTML = `<strong>${ikon} ${st.overskrift}</strong>`
    + (st.halveringstid ? `<span class="halv" title="Den tid, det tager, før halvdelen af kernerne er henfaldet">Halveringstid: ${st.halveringstid}</span>` : '')
    + `<span>${st.tekst}</span>`;
}
