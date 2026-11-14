// Molekyler (#molekyler): en egen del i verdenen Atomer. Indtil 14. november 2026 var det fanen "Byg et molekyle" i
// Atomværkstedet. To måder, valgt øverst i venstre panel: "Del elektroner" (js/molekyler-byg.js, med knaldgassen i
// js/knaldgas.js) og "Giv elektroner" (js/molekyler.js, det der hed Byttebørsen). Her står kun skiftet mellem dem,
// hjælpen, "Opgaver forfra" og forløbet "Når atomer mødes" (teksterne i js/data/forloeb/molekyler.js, drejebogen i
// docs/drejebog-molekyler.md): trin 1-2 i "Del elektroner" og trin 3-4 i "Giv elektroner".

import { lavByttebørs, startByttebørs, stopByttebørs, vælgPar, forløbGiv, opdaterFremgang as opdaterGiv, testAdgang as bytteTest } from './molekyler.js';
import { lavBygMolekyler, startBygMolekyler, stopBygMolekyler, forløbByg, åbnKnaldgas, opdaterFremgang as opdaterDel, testAdgang as bygTest } from './molekyler-byg.js';
import { OPGAVER_BYTTE } from './data/molekyler.js';
import { OPGAVER_BYG } from './data/molekyler-byg.js';
import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked, rydBeskeder } from './beskeder.js';
import { lukHvorfor } from './lag.js';
import { toTrinsKnap } from './forfra.js';
import { hentetSkærm } from './skaerme.js';
import { tagVentMolekyler, tagVentForløb } from './gaa.js';
import { centrerVindue, ROLIG } from './scene3d.js';
import { MØDES } from './data/forloeb/molekyler.js';
import { startForløb, stopForløb, starterSelv, forløbVink, forløbFase, forløbTest } from './forloeb.js';

const $ = (id) => document.getElementById(id);

// 'byg' (Del elektroner) eller 'bytte' (Giv elektroner)
const MÅDER = ['byg', 'bytte'];
const START = { byg: () => startBygMolekyler(), bytte: () => startByttebørs() };
const STOP = { byg: () => stopBygMolekyler(), bytte: () => stopByttebørs() };
let måde = 'byg';
let aktiv = false;
const HÅND_EFTER = 8000; // ms uden træk, før hånden viser trækket i trin 1
const TONING = 260; // ms for hver halvdel af toningen mellem "Del elektroner" og "Giv elektroner" i forløbet
let håndTimer = null;
let toningTimer = null;
let trinNr = 0; // så en forsinket opsætning (efter toningen) ikke rører et nyt trin

export function lav() {
  // "Giv elektroner" kender det atom, man har bygget i Atomværkstedet (står der et neutralt natrium, nævnes det)
  lavByttebørs({ værkstedAtom: () => hentetSkærm('vaerksted')?.værkstedTilstand() ?? null });
  lavBygMolekyler();
  for (const b of document.querySelectorAll('[data-molekyle-maade]')) {
    b.addEventListener('click', () => {
      lyd.klik();
      sætMåde(b.dataset.molekyleMaade);
    });
  }
  $('molekylerHjælp').addEventListener('click', () => {
    lyd.klik();
    $('hjælpMolekyler').classList.remove('skjult');
  });
  // Starter kun Molekylers opgaver forfra (Værkstedet og de andre dele har deres egen knap)
  toTrinsKnap($('molekylerOpgaverForfra'), () => {
    fremgang.nulstilDel([...OPGAVER_BYG, ...OPGAVER_BYTTE].map((o) => o.id));
    opdaterFremgang();
    $('hjælpMolekyler').classList.add('skjult');
    visBesked({ titel: 'Molekyler starter forfra', tekst: 'Stjernerne her er nulstillet. God fornøjelse!' });
  });
  $('hjælpMolekylerForløb').addEventListener('click', () => {
    lyd.klik();
    $('hjælpMolekyler').classList.add('skjult');
    startMødes();
  });
  // Hånden (trin 1) og toningen (mellem trin 2 og 3) ligger i 3D-billedet
  const hånd = document.createElement('div');
  hånd.className = 'fl-hånd';
  hånd.id = 'molekylerHånd';
  hånd.setAttribute('aria-hidden', 'true');
  hånd.textContent = '👆';
  hånd.hidden = true;
  const toning = document.createElement('div');
  toning.className = 'fl-toning';
  toning.id = 'molekylerToning';
  $('molekylerVindue').append(hånd, toning);
  visMåde();
}

// Skifter måde: 'byg' eller 'bytte'
export function sætMåde(ny) {
  if (!MÅDER.includes(ny) || ny === måde) return;
  if (aktiv) {
    STOP[måde]();
    rydBeskeder(); // underteksterne og "Hvorfor?"-kortet hører til den måde, de blev vist i
    lukHvorfor();
  }
  måde = ny;
  visMåde();
  if (aktiv) START[måde]();
}

function visMåde() {
  $('molekyler').classList.toggle('bytte', måde === 'bytte');
  $('molekyler').classList.toggle('del-elektroner', måde === 'byg'); // ikke 'byg': den klasse har byggepanelet
  for (const b of document.querySelectorAll('[data-molekyle-maade]')) {
    b.classList.toggle('valgt', b.dataset.molekyleMaade === måde);
    b.setAttribute('aria-pressed', String(b.dataset.molekyleMaade === måde));
  }
}

export function start() {
  aktiv = true;
  const vent = tagVentMolekyler();
  if (MÅDER.includes(vent) && vent !== måde) {
    måde = vent;
    visMåde();
  }
  START[måde]();
  // Forløbet starter af sig selv første gang, og når man kommer fra dets link eller "Din fremgang"
  if (tagVentForløb([MØDES.id]) || starterSelv(MØDES)) startMødes();
}

export function stop() {
  aktiv = false;
  stopForløb(); // (kalder MØDES_DEL.slut, der rydder timerne)
  STOP[måde]();
}

// ---------- Forløbet "Når atomer mødes" ----------
function startMødes() {
  startForløb(MØDES, MØDES_DEL);
}

// Skifter måde i forløbet. Mellem "Del elektroner" og "Giv elektroner" toner billedet kort ud og ind (drejebogen), og
// opsæt kaldes, når billedet er mørkt. Samme måde: opsæt kaldes med det samme.
function skiftTil(ny, opsæt) {
  const nr = ++trinNr;
  clearTimeout(toningTimer);
  const toning = $('molekylerToning');
  if (ny === måde || ROLIG) {
    toning.classList.remove('mørk');
    sætMåde(ny);
    opsæt();
    return;
  }
  toning.classList.add('mørk');
  toningTimer = setTimeout(() => {
    if (nr !== trinNr || !aktiv) return;
    sætMåde(ny);
    opsæt();
    toning.classList.remove('mørk');
  }, TONING);
}

// Hånden viser trækket fra atom a til atom b (trin 1), når man har været i fasen "gør" i 8 sekunder uden at trække.
// Den forsvinder, når man selv trækker, eller trinet er gjort.
function visHånd(a, b) {
  clearInterval(håndTimer);
  let gørTid = 0;
  håndTimer = setInterval(() => {
    const hånd = $('molekylerHånd');
    if (!aktiv || forløbByg.trukket() || forløbByg.færdig('h2')) return skjulHånd();
    if (forløbFase() !== 'gør' || !hånd.hidden) return;
    gørTid += 250;
    if (gørTid < HÅND_EFTER) return;
    const fra = forløbByg.atomPå(a);
    const til = forløbByg.atomPå(b);
    if (!fra || !til) return;
    const r = $('molekylerVindue').getBoundingClientRect();
    hånd.style.setProperty('--fra-x', `${fra.x - r.left}px`);
    hånd.style.setProperty('--fra-y', `${fra.y - r.top}px`);
    hånd.style.setProperty('--til-x', `${til.x - r.left}px`);
    hånd.style.setProperty('--til-y', `${til.y - r.top}px`);
    hånd.hidden = false;
  }, 250);
}

function skjulHånd() {
  clearInterval(håndTimer);
  håndTimer = null;
  $('molekylerHånd').hidden = true;
}

// Forløbets linje forklarer, hvorfor et atom blev skubbet væk (underteksterne er skjult under forløbet)
const vink = (tekst) => forløbVink(tekst);

// Efter en vej med gør: Klodsen centrerer ikke billedet (en vej til en anden skærm skal ikke zoome her), så det gør vi
function efterForløb(fn) {
  fn();
  requestAnimationFrame(() => {
    centrerVindue();
    (måde === 'byg' ? forløbByg : forløbGiv).zoom();
  });
}

const MØDES_DEL = {
  trin: {
    h2: {
      // To H et stykke fra hinanden (4,4 Å, bindingen er 0,74 Å). Deres enlige elektron blinker (tegningen).
      start: () => skiftTil('byg', () => {
        forløbByg.sæt([{ symbol: 'H', x: -2.2, y: 0 }, { symbol: 'H', x: 2.2, y: 0 }], { vink });
        visHånd(0, 1);
      }),
      færdig: () => måde === 'byg' && forløbByg.færdig('h2'),
      visMig: () => forløbByg.visMig('h2'),
    },
    vand: {
      // O i midten med tre H rundt om. H kan kun binde til O, og det tredje H bliver stående, så man kan prøve det.
      start: () => skiftTil('byg', () => {
        skjulHånd();
        vandDrejet = false;
        forløbByg.sæt([
          { symbol: 'O', x: 0, y: 0.6 },
          { symbol: 'H', x: -3.4, y: -0.8 },
          { symbol: 'H', x: 3.4, y: -0.8 },
          { symbol: 'H', x: 0, y: -3.6 },
        ], { kunTil: 'O', vink });
      }),
      færdig: () => {
        const ok = måde === 'byg' && forløbByg.færdig('vand');
        if (ok && !vandDrejet) {
          vandDrejet = true;
          forløbByg.drejForfra('vand');
        }
        return ok;
      },
      visMig: () => forløbByg.visMig('vand'),
    },
    salt: {
      // Na og Cl langt fra hinanden med kun den yderste skal tydelig. Man trækker natrium hen mod chlor.
      start: () => {
        skjulHånd();
        forløbByg.slut();
        skiftTil('bytte', () => forløbGiv.start());
      },
      færdig: () => måde === 'bytte' && forløbGiv.samlet(),
      visMig: () => forløbGiv.visMig(),
    },
    krystal: {
      start: () => skiftTil('bytte', () => forløbGiv.parSamlet()),
      knapper: [{ id: 'krystal', tekst: 'Byg krystallen', gør: () => forløbGiv.bygKrystal(), aktiv: () => måde === 'bytte' && forløbGiv.kanBygge() }],
      færdig: () => måde === 'bytte' && forløbGiv.krystal(),
      visMig: () => forløbGiv.bygKrystal(),
    },
  },
  layout: () => (måde === 'byg' ? forløbByg : forløbGiv).zoom(),
  veje: [
    // Laboratoriet: paletten og panelerne åbner (det byggede vand står der stadig)
    { tekst: 'Byg selv', primær: true, gør: () => efterForløb(() => sætMåde('byg')) },
    { tekst: 'Se vand blive til af en gnist', gør: () => efterForløb(() => { sætMåde('byg'); åbnKnaldgas(); }) },
    // Laboratoriets omvendte rækkefølge bliver forsøget, der svarer: Flyt elektronen langt ude, og se, at det koster
    {
      tekst: 'Hvorfor hopper elektronen først, når de er tæt på?',
      gør: () => efterForløb(() => {
        sætMåde('bytte');
        vælgPar('nacl');
        visBesked({ titel: 'Prøv selv', tekst: 'Træk elektronen over til chlor, mens atomerne er langt fra hinanden, og hold øje med regnskabet nederst.', varighed: 9000 });
      }),
    },
  ],
  igen: 'fra hjælpen (?)',
  slut: () => {
    trinNr++;
    clearTimeout(toningTimer);
    $('molekylerToning').classList.remove('mørk');
    skjulHånd();
    vandDrejet = false;
    forløbByg.slut();
    forløbGiv.slut();
    rydBeskeder(); // laboratoriets undertekster fra forløbet (de var skjult)
  },
};
let vandDrejet = false;

// Stjernerne igen (fx efter "Nulstil al fremgang" i Værkstedets hjælp)
export function opdaterFremgang() {
  opdaterGiv();
  opdaterDel();
}

export function testAdgang() {
  return {
    måde: () => måde,
    sætMåde,
    forløb: forløbTest(),
    startForløb: () => startMødes(),
    hånd: () => !$('molekylerHånd').hidden,
    bytte: bytteTest(),
    byg: bygTest(),
  };
}
