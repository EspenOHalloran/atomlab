// Byg et molekyle → "Del elektroner" → Knaldgas (Molekyler M3, docs/plan-molekyler.md afsnit 4).
// En lukket boks med 4 H₂ og 2 O₂, der flyver rundt. Uden gnist sker der ingenting (stødene er alt for svage).
// "Gnist" river et H₂ over, og en kæde af radikaler (H, O og OH) laver 4 H₂O. Måleren viser, hvad det har kostet at
// bryde bindingerne, og hvad man har fået for de nye. Forskellen bliver til fart (varme), og boksen gløder.
// Reglerne og energien står i js/data/knaldgas.js (uden Three.js). Tegningen er MolekyleTegning fra js/molekyle3d.js.

import * as THREE from 'three';
import { verden, sætVindue, passerTil, stopKamera, begrænsDrejning, ROLIG, lavPrikTekstur } from './scene3d.js';
import { MolekyleTegning } from './molekyle3d.js';
import * as K from './data/knaldgas.js';
import { OPGAVER_BYG, opgaveKlaret, KNALD_STØD } from './data/molekyler-byg.js';
import { lyd } from './lyd.js';
import { visBesked, bundIVindue } from './beskeder.js';
import { lavTidsknap } from './pause.js';
import { lavNæsteSkridt, lavNæsteSkridtKort } from './lag.js';
import * as fremgang from './fremgang.js';

const TEMPO = ROLIG ? 0.5 : 1; // "reducer bevægelse": alt flyver halvt så hurtigt
const LANGSOM = 0.25; // tidsknappens ▷: så man kan følge kæden
const GLIMT = 10; // så mange lysglimt på én gang (gnisten og reaktionerne)
const GLIMT_TID = 0.45; // sekunder
const MÅLER_MAKS = 40; // eV: så meget kan bjælkerne vise (de vokser, hvis der bliver brudt og dannet mere)
const fmt = (x, d = 1) => x.toFixed(d).replace('.', ',').replace('-', '−');

let aktiv = false;
let rod = null;
let tegning = null;
let boksLinjer = null;
let boksFlader = null;
let pause = null;
let næste = null;
let boks = null;
let tid = 0;
let panelTid = 1;
let panelTekst = '';
let målerTekst = '';
let frø = null; // kun i testene: samme tilfældighed hver gang
let tilbage = () => {};
let stjerner = () => {};
const glimt = [];
const tegneAtomer = [];
const tegneBånd = [];
const tegneRet = [];
const retVektorer = [];
const tQ = new THREE.Quaternion();
const tA = new THREE.Vector3();
const tV = new THREE.Vector3();
const KANT_KOLD = new THREE.Color(0.25, 0.45, 0.95);
const KANT_VARM = new THREE.Color(2.4, 1.0, 0.3);
const FLADE_KOLD = new THREE.Color(0.02, 0.04, 0.1);
const FLADE_VARM = new THREE.Color(0.42, 0.15, 0.04);

const $ = (id) => document.getElementById(id);

// tilbage: "Tilbage til byggeriet". stjerner: opdaterer ★ i begge paneler (fra js/molekyler-byg.js).
export function lavKnaldgas({ tilbage: t, stjerner: s }) {
  tilbage = t;
  stjerner = s;
  rod = new THREE.Group();
  rod.visible = false;
  verden.scene.add(rod);
  tegning = new MolekyleTegning();
  rod.add(tegning.gruppe);
  for (let i = 0; i < 12; i++) tegneAtomer.push({ symbol: 'H', p: new THREE.Vector3(), lys: 0, stor: false, q: 0 });
  for (let i = 0; i < 40; i++) retVektorer.push([0, 0, 0]);
  // Boksen: kanter og svage vægge, der gløder, når gassen bliver varm
  const B = K.BOKS;
  const geo = new THREE.BoxGeometry(2 * B, 2 * B, 2 * B);
  boksLinjer = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: KANT_KOLD.clone(), transparent: true, opacity: 0.85 }));
  boksFlader = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: FLADE_KOLD.clone(), transparent: true, opacity: 0.6, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  rod.add(boksFlader, boksLinjer);
  // Lysglimt (gnisten og hver reaktion)
  const tekstur = lavPrikTekstur(true);
  for (let i = 0; i < GLIMT; i++) {
    const s2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: tekstur, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s2.visible = false;
    s2.renderOrder = 9;
    rod.add(s2);
    glimt.push({ s: s2, tid: 0, liv: 0, stor: 1 });
  }
  lavPanel();
  nyBoks();
  stjerner();
}

function lavPanel() {
  const vindue = $('vaerkstedVindue');
  const kort = lavNæsteSkridtKort(vindue, 'knaldMission');
  kort.classList.add('knald-kun');
  næste = lavNæsteSkridt(kort, { visMig: () => tænd() });
  // Måleren og tidsknappen nederst i 3D-billedet
  const række = document.createElement('div');
  række.className = 'bjælke-række knald-kun';
  række.id = 'knaldBund';
  række.innerHTML = `<div class="knald-måler" id="knaldMåler" role="group" aria-label="Energien i eV">
      <div class="km-top"><span class="km-navn">Energien</span><span class="km-sum">Forskel: <strong id="knaldForskel">0,0 eV</strong></span></div>
      <div class="km-række"><span class="km-navn">Brudt (koster)</span><span class="km-spor"><span class="km-fyld brudt" id="knaldBrudtFyld"></span></span><strong id="knaldBrudt">0,0</strong></div>
      <div class="km-række"><span class="km-navn">Dannet (får)</span><span class="km-spor"><span class="km-fyld dannet" id="knaldDannetFyld"></span></span><strong id="knaldDannet">0,0</strong></div>
    </div>`;
  bundIVindue(vindue).append(række);
  pause = lavTidsknap({ holder: række, aktiv: () => aktiv });
  pause.langsom('4 gange langsommere, så du kan følge kæden');
  række.querySelector('.tidsknap').id = 'knaldTid';

  $('knaldGnist').addEventListener('click', () => tænd());
  $('knaldForfra').addEventListener('click', () => {
    lyd.klik();
    nyBoks();
  });
  $('knaldTilbage').addEventListener('click', () => {
    lyd.klik();
    tilbage();
  });
  // Opgaverne (de samme ★ som i "Del elektroner", js/molekyler-byg.js opdaterer dem)
  const liste = $('knaldOpgaver');
  for (const o of OPGAVER_BYG.filter((x) => x.knaldgas)) {
    const b = document.createElement('button');
    b.className = 'chip byg-opgave';
    b.dataset.bygOpgave = o.id;
    b.innerHTML = '<span class="bo-stjerne" aria-hidden="true"></span> <span class="bo-navn"></span>';
    b.querySelector('.bo-navn').textContent = o.kort;
    b.addEventListener('click', () => {
      lyd.klik();
      const løst = fremgang.erLøst(o.id);
      visBesked({ titel: `${løst ? '★ ' : ''}${o.titel.replace('Del elektroner: ', '')}`, tekst: løst ? o.fakta : `Tip: ${o.tip}`, type: 'info', varighed: 9000 });
    });
    liste.append(b);
  }
}

function nyBoks() {
  boks = K.lavBoks(frø == null ? Math.random : K.lavTilfældig(frø));
  for (const g of glimt) {
    g.liv = 0;
    g.s.visible = false;
  }
  panelTekst = '';
  målerTekst = '';
  if (aktiv) {
    opdaterPanel();
    tegn();
  }
}

// Gnisten (knappen og "Vis mig")
function tænd() {
  if (!aktiv || boks.tændt || boks.færdig) return;
  lyd.klik();
  const e = K.gnist(boks);
  if (!e) return;
  lyd.spaltning();
  visBesked({ titel: 'Gnist!', tekst: `Gnisten rev et H₂ over i to frie H-atomer (radikaler) og gav dem fart: ${fmt(e)} eV i alt. Se, hvad de gør.`, type: 'info', varighed: 6000 });
  panelTekst = '';
  opdaterPanel();
}

// ---------- Opgaverne ----------
function tjekOpgaver() {
  const knald = { stød: boks.tændt ? 0 : boks.stød, vand: K.tæl(boks).H2O };
  let besked = false;
  for (const o of OPGAVER_BYG) {
    if (!o.knaldgas || fremgang.erLøst(o.id) || !opgaveKlaret(o, { knald })) continue;
    fremgang.løs(o.id);
    if (!besked) {
      lyd.klaret();
      visBesked({ titel: `Opgave klaret: ${o.kort} ★`, tekst: o.fakta, type: 'klaret', varighed: 9000 });
      besked = true;
    }
  }
  if (besked) stjerner();
}

// ---------- Hvert billede ----------
function opdater(dt) {
  if (!aktiv) return;
  const tiden = pause.til ? 0 : Math.min(dt, 0.05) * (pause.tilstand === 'langsom' ? LANGSOM : 1) * TEMPO;
  if (tiden > 0) {
    tid += tiden;
    const varFærdig = boks.færdig;
    K.skridt(boks, tiden);
    for (const h of boks.hændelser) nytGlimt(h);
    if (boks.hændelser.length) {
      panelTid = 1; // panelet skal følge med med det samme
      if (!varFærdig && boks.færdig) færdig();
    }
    boks.hændelser.length = 0;
    for (const g of glimt) {
      if (g.liv <= 0) continue;
      g.liv -= tiden;
      const t = Math.max(0, g.liv / GLIMT_TID);
      g.s.visible = g.liv > 0;
      g.s.material.opacity = (ROLIG ? 0.4 : 1) * t;
      g.s.scale.setScalar(g.stor * (ROLIG ? 1 : 0.6 + 0.8 * (1 - t)));
    }
  }
  tegn();
  panelTid += dt;
  if (panelTid > 0.25) {
    panelTid = 0;
    tjekOpgaver();
    opdaterPanel();
  }
}

function nytGlimt(h) {
  const g = glimt.find((x) => x.liv <= 0) ?? glimt[0];
  g.liv = GLIMT_TID * (h.slags === 'gnist' ? 2 : 1);
  g.stor = h.slags === 'gnist' ? 9 : 3 + Math.min(4, Math.abs(h.energi ?? 0));
  g.s.position.set(h.p[0], h.p[1], h.p[2]);
  g.s.material.color.setRGB(...(h.slags === 'gnist' ? [2.2, 2.0, 1.4] : (h.energi ?? 0) > 0 ? [0.6, 0.9, 2.0] : [2.2, 1.2, 0.4]));
  g.s.visible = true;
}

function færdig() {
  lyd.opdaget();
  visBesked({ titel: '4 vandmolekyler', tekst: `Alt er blevet til vand, og intet er tilbage. Forskellen, ${fmt(K.regnskab(boks).varme)} eV, blev til varme.`, type: 'info', varighed: 7000 });
}

function tegn() {
  let ai = 0;
  tegneBånd.length = 0;
  tegneRet.length = 0;
  let ri = 0;
  for (const p of boks.partikler) {
    const st = K.STOFFER[p.art];
    tQ.setFromAxisAngle(tA.set(p.akse[0], p.akse[1], p.akse[2]), p.vinkel);
    const start = ai;
    // Et nyt molekyle med indre rysten (fra en ny binding) ryster og lyser lidt
    const ryst = p.indre > 0 && !ROLIG ? 1 + 0.12 * Math.sin(tid * 55 + p.id) : 1;
    for (const [symbol, x, y, z] of st.atomer) {
      if (ai >= tegneAtomer.length) break;
      const a = tegneAtomer[ai++];
      a.symbol = symbol;
      a.p.set(x * ryst, y * ryst, z * ryst).applyQuaternion(tQ).add(tV.set(p.p[0], p.p[1], p.p[2]));
      a.lys = Math.min(1, p.indre / 3);
      a.q = 0;
    }
    for (const [x, y, orden] of st.bånd) tegneBånd.push({ a: start + x, b: start + y, orden, strakt: false, skæv: st.atomer[y][0] === 'O' && st.atomer[x][0] === 'H' ? 1 : 0 });
    for (const [atom, x, y, z, slags] of st.retninger) {
      if (ri >= retVektorer.length) break;
      tV.set(x, y, z).normalize().applyQuaternion(tQ);
      const v = retVektorer[ri++];
      v[0] = tV.x;
      v[1] = tV.y;
      v[2] = tV.z;
      tegneRet.push({ atom: start + atom, v, slags });
    }
  }
  tegning.tegn({ atomer: tegneAtomer.slice(0, ai), bånd: tegneBånd, retninger: tegneRet, kamera: verden.kamera, tid });
  // Boksen gløder, når gassen bliver varm (1 = stuetemperatur, ca. 100 når alt er vand)
  const v = Math.min(1, Math.log(Math.max(1, K.varme(boks))) / Math.log(110));
  boksLinjer.material.color.copy(KANT_KOLD).lerp(KANT_VARM, v);
  boksFlader.material.color.copy(FLADE_KOLD).lerp(FLADE_VARM, v);
}

// ---------- Panelet ----------
function iBoksen(t) {
  const dele = [];
  for (const art of ['H2', 'O2', 'H2O', 'H', 'O', 'OH']) if (t[art]) dele.push(`${t[art]} ${K.STOFFER[art].navn}`);
  return dele.join(', ');
}

function panelIndhold() {
  const t = K.tæl(boks);
  const r = K.regnskab(boks);
  if (boks.færdig) {
    return {
      titel: '4 vandmolekyler!',
      tekst: `Alt er blevet til vand, og intet er tilbage. Bindingerne i vand er stærkere end dem i H₂ og O₂, så man fik ${fmt(r.varme)} eV mere, end det kostede. Det blev til fart (varme). Sådan virker en raketmotor med hydrogen.`,
      næste: 'Se måleren: Brudt er det, det kostede, og dannet er det, man fik. Tryk "Forfra" for at prøve igen.',
      kanVise: false,
    };
  }
  if (boks.tændt) {
    return {
      titel: 'Kæden er i gang',
      tekst: `Gnisten rev et H₂ over. De frie atomer og OH er radikaler (de har en blinkende elektron uden partner). De river nye molekyler over, og der bliver dannet vand.${boks.sidste ? ` Sidst: ${boks.sidste}.` : ''}`,
      næste: `Se kæden: ${t.H2O} af 4 vandmolekyler er dannet. Hvert lysglimt er en reaktion.`,
      kanVise: false,
    };
  }
  if (boks.stød < KNALD_STØD) {
    return {
      titel: 'Knaldgas: 4 H₂ + 2 O₂',
      tekst: 'Hydrogen og oxygen flyver rundt i en lukket boks og støder ind i hinanden. Se efter: Går der nogen bindinger i stykker?',
      næste: `Se molekylerne støde sammen (${boks.stød} af ${KNALD_STØD} stød). Sker der noget?`,
      kanVise: false,
    };
  }
  return {
    titel: 'Der sker ingenting',
    tekst: `Ingen binding gik i stykker. Det hårdeste stød havde kun ${fmt(boks.hårdeste, 2)} eV, men det koster ${fmt(K.BINDING.HH, 2)} eV at bryde et H₂. Stødene er alt for svage. Giv blandingen en gnist.`,
    næste: 'Ingen bindinger går i stykker af sig selv. Tryk "Gnist".',
    kanVise: true,
  };
}

function opdaterPanel() {
  if (!aktiv) return;
  const p = panelIndhold();
  const t = K.tæl(boks);
  const tal = [
    ['I boksen', iBoksen(t)],
    ['Radikaler', String(K.radikaler(boks))],
    boks.tændt ? ['Gnisten gav', `${fmt(boks.gnist)} eV`] : ['Stød', String(boks.stød)],
    boks.tændt ? ['Reaktioner', String(boks.reaktioner)] : ['Hårdeste stød', `${fmt(boks.hårdeste, 2)} eV`],
  ];
  const nøgle = JSON.stringify([p, tal]);
  if (nøgle !== panelTekst) {
    panelTekst = nøgle;
    $('knaldTitel').textContent = p.titel;
    $('knaldTekst').textContent = p.tekst;
    $('knaldTal').innerHTML = tal.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
    næste.sæt({ tekst: p.næste, kanVise: p.kanVise });
    $('knaldGnist').disabled = boks.tændt || boks.færdig;
    // M4: når alt er vand, kommer "Hvor kom Jordens vand fra?" i stedet for "Hvorfor sker der ingenting?"
    $('knaldJordensVand').hidden = !boks.færdig;
    document.querySelector('#knaldInfo [data-hvorfor="knaldBakke"]').hidden = boks.færdig;
  }
  // Måleren
  const r = K.regnskab(boks);
  const m = `${fmt(r.brudt)}|${fmt(r.dannet)}|${fmt(r.varme)}`;
  if (m === målerTekst) return;
  målerTekst = m;
  const maks = Math.max(MÅLER_MAKS, r.brudt, r.dannet);
  $('knaldBrudt').textContent = fmt(r.brudt);
  $('knaldDannet').textContent = fmt(r.dannet);
  $('knaldBrudtFyld').style.width = `${(100 * r.brudt) / maks}%`;
  $('knaldDannetFyld').style.width = `${(100 * r.dannet) / maks}%`;
  $('knaldForskel').textContent = `${r.varme > 0.05 ? '+' : ''}${fmt(r.varme)} eV`;
  $('knaldMåler').classList.toggle('varm', r.varme > 0.05);
}

// ---------- Start og stop (fra js/molekyler-byg.js) ----------
export function startKnaldgas() {
  aktiv = true;
  rod.visible = true;
  verden.opdateringer.add(opdater);
  $('vaerksted').classList.add('knaldgas');
  stopKamera();
  sætVindue($('vaerkstedVindue'));
  verden.styring.autoRotate = false;
  begrænsDrejning(null);
  verden.styring.target.set(0, 0, 0);
  verden.kamera.position.set(13, 9, 40);
  passerTil(K.BOKS * 2);
  panelTekst = '';
  målerTekst = '';
  opdaterPanel();
  tegn();
}

export function stopKnaldgas() {
  if (!aktiv) return;
  aktiv = false;
  rod.visible = false;
  verden.opdateringer.delete(opdater);
  $('vaerksted').classList.remove('knaldgas');
  pause.sæt('spil');
}

export const knaldgasAktiv = () => aktiv;

// ---------- Kun til automatiske tests ----------
export function testAdgang() {
  return {
    aktiv: () => aktiv,
    boks: () => {
      const r = K.regnskab(boks);
      return {
        tæl: K.tæl(boks), atomer: K.atomTal(boks), radikaler: K.radikaler(boks), stød: boks.stød, hårdeste: boks.hårdeste,
        tændt: boks.tændt, færdig: boks.færdig, reaktioner: boks.reaktioner, brudt: r.brudt, dannet: r.dannet, forskel: r.varme,
        energi: K.energi(boks), forventet: boks.energiStart + boks.gnist, varme: K.varme(boks),
      };
    },
    gnist: () => tænd(),
    forfra: (n = null) => { frø = n; nyBoks(); },
    tidsknap: () => pause.tilstand,
    // Spol frem i små skridt (som på en skærm med 60 billeder i sekundet)
    spol: (sek) => { for (let t = 0; t < sek; t += 1 / 60) opdater(1 / 60); },
    tid: () => tid,
  };
}
