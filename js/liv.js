// Liv (verdenen "Ild og liv", docs/plan-liv.md), fanen Opskriften (L1):
// - Zoom-rejsen i fem trin: cellen, kernen, kromosomet, stigen og atomerne. Man hopper med knapperne eller zoomer:
//   Zoomer man langt nok ind, kommer næste trin, og zoomer man ud, kommer det forrige. Stigen og atomerne er den
//   samme tegning (js/liv/stige.js), der toner over i hinanden efter kameraets afstand.
// - "Byg stigen": streng I er givet, og man vælger partneren til hver base. Et forkert par vises rødt med grunden.
// - Opgaverne liv-rejse, liv-forkert og liv-byg (js/data/liv/opskriften.js).
// - L2, fra opskrift til protein (js/liv-protein.js): "Se genet blive læst", "Læs selv" og "Skift et bogstav".
//   Tegningen (js/liv/protein.js) er trinet 'protein', der ikke er en del af zoom-rejsen.

import * as THREE from 'three';
import { verden, sætVindue, stopKamera, centrerVindue, ROLIG } from './scene3d.js';
import { lavKontakt } from './kontakt.js';
import { lyd } from './lyd.js';
import { visBesked, rydBeskeder } from './beskeder.js';
import { lavNæsteSkridt, lavNæsteSkridtKort, lukHvorfor } from './lag.js';
import { forfraKnap } from './forfra.js';
import * as fremgang from './fremgang.js';
import { DnaStige, S } from './liv/stige.js';
import { lavCelle, lavKerne, lavKromosom } from './liv/celle.js';
import { ProteinTegning } from './liv/protein.js';
import { lavLivProtein } from './liv-protein.js';
import { HVORFOR } from './data/hvorfor.js';
import { SKRIDT } from './data/liv/stige.js';
import { NIVEAUER, NIVEAU_IDER, OPGAVER_LIV, HBB_START, BYG_TRIN, nyByggestreng, parGrund, PAR_TEKST } from './data/liv/opskriften.js';

export { OPGAVER_LIV };

const $ = (id) => document.getElementById(id);
const SYNSVINKEL = 40; // som i scene3d.js
const IND = 0.55; // zoomer man tættere end så mange gange trinets afstand, kommer næste trin
const UD = 1.9; // og længere væk end så mange gange, kommer det forrige
const OVERGANG = 0.6; // sekunder om at tone fra et trin til det næste
const FARVER = {
  atomer: [['C', '#5a6070'], ['H', '#b8bcc8'], ['N', '#3d63e0'], ['O', '#d8392b'], ['P', '#f59a23']],
  stige: [['A', '#3ddc84'], ['T', '#ff5a5f'], ['G', '#ffc93c'], ['C', '#4ea8ff']],
};

let aktiv = false;
let stige = null;
let tegninger = {}; // id → { gruppe, radius, sætSynlighed, opdater }
let niveau = 'celle';
let vist = null; // den tegning, der står fremme
let overgang = null; // { fra, til, t, retning }
let besøgt = new Set();
let byg = null; // { streng, bygget } mens man bygger stigen
let visH = null;
let mission = null;
let panelNøgle = '';
let protein = null; // tegningen til L2
let lp = null; // knapperne og panelet til L2 (js/liv-protein.js)

// Kameraets afstand, så en kasse (halv bredde og højde) passer i 3D-vinduet (som passerTilBoks, uden at zoome)
function afstandTilBoks(halvB, halvH) {
  const { hul } = verden;
  const t = Math.tan(THREE.MathUtils.degToRad(SYNSVINKEL / 2));
  const H = innerHeight;
  return Math.max(halvB / ((t * hul.width) / H), halvH / ((t * hul.height) / H)) * 1.06;
}
const afstandTilKugle = (r) => afstandTilBoks(r * 1.1, r * 1.1);

// Afstandene for hvert trin (de afhænger af vinduets størrelse og af stigens længde)
function afstand(id) {
  if (id === 'atomer') return afstandTilBoks(11 * S, 3 * SKRIDT * S);
  if (id === 'stige') return afstandTilBoks(14 * S, stige.halvHøjde() * 1.05);
  if (id === 'protein') return afstandTilBoks(...protein.halvMål());
  return afstandTilKugle(tegninger[id].radius);
}
// Hvor atomerne begynder at tone over i stigen, og hvor kun stigen er tilbage
function blandGrænser() {
  const d = afstand('stige');
  return [Math.min(2 * afstand('atomer'), 0.45 * d), 0.82 * d];
}

const tegningFor = (id) => (id === 'stige' || id === 'atomer' ? stige : tegninger[id]);

export function lavLiv() {
  stige = new DnaStige();
  stige.sætSekvens(HBB_START);
  protein = new ProteinTegning();
  tegninger = { celle: lavCelle(), kerne: lavKerne(), kromosom: lavKromosom(), stige, protein };
  for (const t of Object.values(tegninger)) {
    t.gruppe.visible = false;
    t.sætSynlighed(0);
    verden.scene.add(t.gruppe);
  }
  // Knapperne til trinene
  const liste = $('livNiveauer');
  for (const n of NIVEAUER) {
    const b = document.createElement('button');
    b.className = 'chip filter liv-niveau';
    b.dataset.livNiveau = n.id;
    b.textContent = n.knap;
    b.addEventListener('click', () => {
      lyd.klik();
      if (byg) stopByg();
      lp.stop(false);
      gåTil(n.id);
    });
    liste.append(b);
  }
  visH = lavKontakt($('livVisH'));
  visH.sæt(true);
  visH.knap.addEventListener('click', () => {
    visH.sæt(!visH.til);
    stige.sætVisH(visH.til);
    lyd.klik();
  });
  // Byg stigen
  $('livBygStart').addEventListener('click', () => { lyd.klik(); startByg(); });
  $('livBygNy').addEventListener('click', () => { lyd.klik(); startByg(); });
  $('livBygStop').addEventListener('click', () => { lyd.klik(); stopByg(); });
  for (const b of document.querySelectorAll('[data-liv-base]')) {
    b.addEventListener('click', () => vælgBase(b.dataset.livBase));
  }
  // Hjælpen
  $('livHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpLiv').classList.remove('skjult'); });
  $('hjælpLiv').addEventListener('click', (h) => {
    if (h.target.id === 'hjælpLiv' || h.target.closest('[data-luk]')) $('hjælpLiv').classList.add('skjult');
  });
  mission = lavNæsteSkridt(lavNæsteSkridtKort($('livVindue'), 'livMission'), { visMig });
  lp = lavLivProtein({
    tegning: protein,
    vindue: $('livVindue'),
    aktiv: () => aktiv,
    vis: () => {
      if (byg) stopByg();
      gåTil('protein');
      opdaterByg();
    },
    forlad: () => gåTil('stige'),
    stoppet: () => opdaterByg(),
    løs,
    panel: (kunTal) => opdaterPanel(kunTal),
    mission: () => opdaterMission(),
    kamera: () => {
      if (niveau !== 'protein') return;
      sætGrænser('protein');
      verden.målAfstand = afstand('protein');
    },
  });
}

// ---------- Trinene ----------
// Skifter til et trin. retning: 'ind' eller 'ud' (fra en zoom) giver en blød overgang, hvor kameraet fortsætter
// samme vej. Uden retning (en knap) flyver kameraet til trinets afstand.
function gåTil(id, retning = null) {
  if (!NIVEAU_IDER.includes(id) && id !== 'protein') id = 'celle';
  const ny = tegningFor(id);
  const fraIndeks = NIVEAU_IDER.indexOf(niveau);
  niveau = id;
  if (id !== 'protein') besøg(id);
  opdaterPanel(); // først, så 3D-vinduet har sin endelige størrelse (panelerne under det på højkant), før afstanden regnes
  const d = afstand(id);
  sætGrænser(id);
  if (ny !== vist) {
    overgang = { fra: vist, til: ny, t: 0, retning: retning ?? (id === 'protein' || NIVEAU_IDER.indexOf(id) > fraIndeks ? 'ind' : 'ud') };
    vist = ny;
    // Kameraet starter lidt længere væk (ind) eller tættere på (ud) og glider til trinets afstand
    if (!ROLIG) {
      const k = verden.kamera;
      const r = k.position.clone().sub(verden.styring.target);
      k.position.copy(verden.styring.target).add(r.setLength(d * (overgang.retning === 'ind' ? 1.7 : 0.6)));
    }
  }
  verden.målAfstand = d;
}

function sætGrænser(id) {
  const s = verden.styring;
  if (id === 'stige' || id === 'atomer') {
    s.minDistance = 4;
    s.maxDistance = afstand('stige') * (UD + 0.15);
  } else if (id === 'protein') {
    const d = afstand('protein');
    s.minDistance = d * 0.3;
    s.maxDistance = d * 2.2;
  } else {
    const d = afstand(id);
    s.minDistance = d * (IND - 0.07);
    s.maxDistance = id === 'celle' ? d * 1.6 : d * (UD + 0.15);
  }
}

function besøg(id) {
  if (besøgt.has(id)) return;
  besøgt.add(id);
  if (NIVEAU_IDER.every((n) => besøgt.has(n))) løs('liv-rejse');
}

function næsteNiveau(retning) {
  const i = NIVEAU_IDER.indexOf(niveau) + (retning === 'ind' ? 1 : -1);
  return NIVEAU_IDER[i] ?? null;
}

// Tjekker kameraets afstand: zoomet langt nok ind eller ud giver næste eller forrige trin
function tjekZoom() {
  if (overgang || verden.målAfstand != null || niveau === 'protein') return; // kun når man selv zoomer, og ikke i L2
  const d = verden.kamera.position.distanceTo(verden.styring.target);
  if (vist === stige) {
    const nu = stige.blanding > 0.5 ? 'stige' : 'atomer';
    if (nu !== niveau && !byg) {
      niveau = nu;
      besøg(nu);
      opdaterPanel();
    }
    if (d > afstand('stige') * UD && !byg) gåTil('kromosom', 'ud');
    return;
  }
  const D = afstand(niveau);
  if (d < D * IND && næsteNiveau('ind')) gåTil(næsteNiveau('ind'), 'ind');
  else if (d > D * UD && næsteNiveau('ud')) gåTil(næsteNiveau('ud'), 'ud');
}

function opdater(dt, tid) {
  // Overgangen mellem to tegninger: den gamle toner ud (og vokser, når man zoomer ind), den nye toner ind
  if (overgang) {
    overgang.t = ROLIG ? 1 : Math.min(1, overgang.t + dt / OVERGANG);
    const t = overgang.t;
    const blød = t * t * (3 - 2 * t);
    if (overgang.fra) {
      overgang.fra.sætSynlighed(1 - blød);
      overgang.fra.gruppe.scale.setScalar(overgang.retning === 'ind' ? 1 + blød * 1.5 : 1 - blød * 0.6);
    }
    overgang.til.sætSynlighed(blød);
    overgang.til.gruppe.scale.setScalar(1);
    if (t >= 1) {
      if (overgang.fra) {
        overgang.fra.sætSynlighed(0);
        overgang.fra.gruppe.scale.setScalar(1);
      }
      overgang = null;
    }
  }
  // Stigen: atomerne tæt på, båndene længere væk
  const d = verden.kamera.position.distanceTo(verden.styring.target);
  const [fra, til] = blandGrænser();
  const b = THREE.MathUtils.clamp((d - fra) / (til - fra), 0, 1);
  stige.sætBlanding(b * b * (3 - 2 * b));
  stige.opdater(dt, tid);
  for (const t of Object.values(tegninger)) if (t !== stige && t.gruppe.visible) t.opdater(dt);
  lp.opdater(dt);
  tjekZoom();
}

// ---------- Byg stigen ----------
function startByg() {
  lp.stop(false);
  rydBeskeder();
  lukHvorfor();
  byg = { streng: nyByggestreng(), bygget: 0 };
  stige.sætSekvens(byg.streng, 0);
  $('livByg').classList.add('i-gang');
  gåTil('stige');
  verden.styring.autoRotateSpeed = 0.2;
  opdaterByg();
}

function stopByg() {
  if (!byg) return;
  byg = null;
  stige.sætSekvens(HBB_START);
  $('livByg').classList.remove('i-gang');
  verden.styring.autoRotateSpeed = 0.35;
  if (vist === stige) gåTil(niveau === 'atomer' ? 'atomer' : 'stige');
  opdaterByg();
}

function vælgBase(b) {
  if (!byg || byg.bygget >= BYG_TRIN) return;
  const a = byg.streng[byg.bygget];
  const grund = parGrund(a, b);
  const { titel, tekst } = PAR_TEKST[grund](a, b);
  if (grund === 'passer') {
    lyd.proton();
    byg.bygget++;
    stige.sætBygget(byg.bygget);
    if (byg.bygget >= BYG_TRIN) {
      løs('liv-byg');
      visBesked({ titel: 'Stigen er færdig', tekst: 'Zoom ind, og se atomerne og de gule hydrogenbindinger mellem baserne.', varighed: 7000 });
    }
  } else {
    lyd.nej();
    stige.visForkert(b);
    visBesked({ titel, tekst, type: 'advarsel', varighed: 9000 });
    løs('liv-forkert');
  }
  opdaterByg();
}

function opdaterByg() {
  $('livBygStart').hidden = Boolean(byg);
  $('livBygIGang').hidden = !byg;
  $('livByg').hidden = Boolean(lp.tilstand); // mens L2 kører, står kun dens knapper fremme
  $('livProtein').hidden = Boolean(byg);
  if (!byg) return;
  const færdig = byg.bygget >= BYG_TRIN;
  $('livBygTekst').innerHTML = færdig
    ? `Færdig: ${BYG_TRIN} trin ★`
    : `Trin ${byg.bygget + 1} af ${BYG_TRIN}. Hvem passer til <strong class="liv-bogstav" style="--farve:var(--base-${byg.streng[byg.bygget]})">${byg.streng[byg.bygget]}</strong>?`;
  for (const k of document.querySelectorAll('[data-liv-base]')) k.disabled = færdig;
  opdaterMission();
}

// ---------- Panelet ----------
// kunTal: kun tallene har ændret sig (L2 opdaterer dem undervejs)
function opdaterPanel(kunTal = false) {
  const iProtein = niveau === 'protein' && lp?.tilstand;
  const n = iProtein ? lp.tekster() : NIVEAUER.find((x) => x.id === niveau) ?? NIVEAUER[0];
  const nøgle = iProtein ? `protein|${lp.tilstand}|${lp.trin()}` : `${niveau}|${Boolean(byg)}`;
  const tal = () => n.tal.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  if (nøgle === panelNøgle && iProtein) {
    const html = tal();
    if ($('livTal').innerHTML !== html) $('livTal').innerHTML = html;
    if (kunTal) return;
  }
  for (const b of document.querySelectorAll('[data-liv-niveau]')) b.classList.toggle('valgt', b.dataset.livNiveau === niveau);
  $('livVisH').hidden = niveau !== 'atomer' && niveau !== 'stige';
  if (nøgle !== panelNøgle) {
    panelNøgle = nøgle;
    $('livTitel').textContent = n.titel;
    $('livTekst').textContent = n.tekst;
    $('livTal').innerHTML = tal();
    $('livEkstra').textContent = n.ekstra ?? '';
    $('livHvorfor').hidden = !n.hvorfor;
    if (n.hvorfor) {
      $('livHvorfor').dataset.hvorfor = n.hvorfor;
      $('livHvorfor').textContent = `Hvorfor? ${HVORFOR[n.hvorfor].spørgsmål}`;
    }
    const farver = iProtein ? lp.farver() : FARVER[niveau === 'atomer' ? 'atomer' : niveau === 'stige' ? 'stige' : ''] ?? [];
    $('livFarver').innerHTML = farver.map(([t, f]) => `<li><span class="farveprik" style="background:${f}"></span>${t}</li>`).join('');
    $('livFarver').hidden = !farver.length;
    centrerVindue(); // på højkant ændrer panelernes tekst 3D-vinduets højde
  }
  opdaterMission();
}

const MISSION = {
  celle: 'Zoom ind mod kernen (den violette kugle).',
  kerne: 'Zoom ind på de farvede tråde: kromosomerne.',
  kromosom: 'Zoom ind på tråden, der er viklet om perlerne.',
  stige: 'Zoom helt ind til atomerne.',
  atomer: 'Find de gule hydrogenbindinger: to i A–T og tre i G–C.',
};

function opdaterMission() {
  if (!mission) return;
  let tekst;
  let kanVise = false;
  if (lp?.tilstand) tekst = lp.mission();
  else if (byg) tekst = byg.bygget >= BYG_TRIN ? 'Zoom ind og se atomerne, eller byg en ny stige.' : 'Vælg den base, der passer til den, der lyser.';
  else if (!fremgang.erLøst('liv-rejse')) {
    tekst = MISSION[niveau];
    kanVise = niveau !== 'atomer';
  } else if (!fremgang.erLøst('liv-byg') || !fremgang.erLøst('liv-forkert')) tekst = 'Tryk "Byg stigen", og byg den anden halvdel.';
  else if (!fremgang.erLøst('liv-protein')) tekst = 'Tryk "Se genet blive læst", og se et gen blive til et protein.';
  else if (!fremgang.erLøst('liv-læs')) tekst = 'Tryk "Læs selv", og læs genet som et ribosom.';
  else if (OPGAVER_LIV.some((o) => !fremgang.erLøst(o.id))) tekst = 'Tryk "Skift et bogstav", og lav en mutation.';
  else tekst = 'Du har klaret opgaverne her ★. Zoom rundt, og se det hele igen.';
  mission.sæt({ tekst, kanVise });
}

// "Vis mig" zoomer ind til næste trin
function visMig() {
  const næste = næsteNiveau('ind');
  if (næste) gåTil(næste, 'ind');
}

// ---------- Opgaverne ----------
function lavOpgaveliste() {
  const liste = $('livOpgaver');
  liste.innerHTML = '';
  $('livOpgaveTal').textContent = `${fremgang.antalLøste(OPGAVER_LIV.map((o) => o.id))} af ${OPGAVER_LIV.length} ★`;
  for (const o of OPGAVER_LIV) {
    const li = document.createElement('li');
    const løst = fremgang.erLøst(o.id);
    li.className = løst ? 'løst' : '';
    li.innerHTML = `<span class="flueben">${løst ? '★' : '☆'}</span><span class="opgave-titel"></span>`;
    li.querySelector('.opgave-titel').textContent = o.titel;
    li.title = løst ? o.fakta : o.tip;
    li.addEventListener('click', () => visBesked({ titel: o.titel, tekst: løst ? o.fakta : `Tip: ${o.tip}`, varighed: 8000 }));
    liste.append(li);
  }
  forfraKnap(liste, { ider: OPGAVER_LIV.map((o) => o.id), del: 'Liv', efter: () => { besøgt = new Set(NIVEAU_IDER.includes(niveau) ? [niveau] : []); lavOpgaveliste(); opdaterMission(); } });
}

function løs(id) {
  const o = OPGAVER_LIV.find((x) => x.id === id);
  if (!o || !fremgang.løs(id)) return;
  lyd.klaret();
  visBesked({ titel: `Opgave klaret: ${o.titel} ★`, tekst: o.fakta, type: 'klaret', varighed: 8000 });
  lavOpgaveliste();
  opdaterMission();
}

// ---------- Start og stop ----------
export function startLiv() {
  aktiv = true;
  sætVindue($('livVindue'));
  verden.styring.autoRotate = true;
  verden.styring.autoRotateSpeed = 0.35;
  verden.opdateringer.add(opdater);
  besøgt = new Set();
  lavOpgaveliste();
  vist = null;
  niveau = 'celle';
  panelNøgle = '';
  gåTil('celle', 'ind');
  opdaterByg();
}

export function stopLiv() {
  aktiv = false;
  if (byg) stopByg();
  lp.stop(false);
  verden.opdateringer.delete(opdater);
  overgang = null;
  for (const t of Object.values(tegninger)) {
    t.sætSynlighed(0);
    t.gruppe.scale.setScalar(1);
  }
  vist = null;
  stopKamera();
  $('hjælpLiv').classList.add('skjult');
}

// Til tests (med ?test i adressen)
export function testAdgang() {
  return {
    aktiv: () => aktiv,
    niveau: () => niveau,
    overgang: () => Boolean(overgang),
    blanding: () => stige.blanding,
    gåTil: (id) => gåTil(id),
    zoomTil: (faktor) => {
      // Sætter kameraet til faktor gange trinets afstand (som når man selv zoomer)
      verden.målAfstand = null;
      const k = verden.kamera;
      const r = k.position.clone().sub(verden.styring.target);
      k.position.copy(verden.styring.target).add(r.setLength(afstand(niveau === 'atomer' ? 'stige' : niveau) * faktor));
    },
    afstand: (id) => afstand(id),
    antal: () => ({ kugler: stige.kugler.count, pinde: stige.pinde.count, streger: stige.streger.count, trin: stige.trinene.count }),
    sekvens: () => stige.sekvens,
    byg: () => (byg ? { ...byg } : null),
    startByg,
    stopByg,
    vælgBase,
    markører: () => stige.markører.count,
    synlige: () => Object.entries(tegninger).filter(([, t]) => t.gruppe.visible).map(([id]) => id),
    mission: () => document.querySelector('#livMission .mission-tekst').textContent,
    protein: () => lp.test(),
    proteinStart: (t) => lp.start(t),
    proteinStop: () => lp.stop(),
    proteinSpol: (sek) => lp.spol(sek),
    proteinSvar: (aa) => lp.svar(aa),
    proteinSkift: (i, pos, base) => lp.skiftBogstav(i, pos, base),
    proteinKodon: (i) => lp.vælgKodon(i),
  };
}
