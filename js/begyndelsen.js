// Begyndelsen (#begyndelsen, L5): en egen del i verdenen Liv. Turen "Begyndelsen" (forløb 5, drejebogen i
// docs/drejebog-liv.md, afsnit 4) og laboratoriet "Leg frit: kolben og trappen". Teksterne står i
// js/data/forloeb/begyndelsen.js og js/data/liv/begyndelsen.js, tegningerne i js/liv/begyndelsen.js.
// Fire scener: Millers kolbe (lyn i tre gasser over vand, og den nye luft med kalk), boblerne af fedtstof (hinden), et RNA,
// der næsten kopierer sig selv, og trappen med fem trin, hvor det øverste ikke kan nås.
// Efter turen er laboratoriet altid fremme: Venstre panel vælger scenen og styrer den, højre panel viser forsøget bag.
// Et kort tryk i scenen gør scenens handling (et lyn, et dryp, kopiér) eller vælger et trin på trappen.

import * as THREE from 'three';
import { verden, sætVindue, passerTilBoks, begrænsDrejning, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { rydBeskeder } from './beskeder.js';
import { lukHvorfor } from './lag.js';
import { lavKontakt } from './kontakt.js';
import { tagVentForløb } from './gaa.js';
import { startForløb, stopForløb, starterSelv, kørerForløb, forløbVenter, forløbRørt, forløbVink, forløbTest, lavTurKnap } from './forloeb.js';
import { HVORFOR } from './data/hvorfor.js';
import { BEGYNDELSEN } from './data/forloeb/begyndelsen.js';
import { LYN_FULD, kolbeFarve, aminosyrer, RNA_START, RNA_FEJL_TUR, RNA_PAR, lavRnaKopi, TRAPPEN, KOLBE_PANEL, BOBLE_PANEL, RNA_PANEL, TRAPPE_PANEL, BEG_KORT } from './data/liv/begyndelsen.js';
import { lavBegyndelsenTegning } from './liv/begyndelsen.js';

const $ = (id) => document.getElementById(id);
const SCENER = ['kolbe', 'hinde', 'rna', 'trappe'];
const TONING = 260; // ms for hver halvdel af toningen mellem to scener (stilguiden A10)
const VIS_LYN = ROLIG ? 120 : 380; // ms mellem lynene, når "Næste ›" viser handlingen
// Nøglen nederst i scenen: hvad prikkerne og kuglerne er
const NØGLE = {
  miller: 'Metan (CH₄) · ammoniak (NH₃) · hydrogen (H₂) · og damp fra vandet',
  co2: 'Kuldioxid (CO₂) · nitrogen (N₂) · og damp fra vandet',
  hinde: 'Blå hoveder kan lide vand · gule haler skyr det',
  rna: 'Øverst RNA\'et · nederst kopien · orange ring: en fejl',
  trappe: '✓ nået · ½ halvvejs · ? ingen har nået det',
};

let tegning = null;
let aktiv = false;
let scene = 'kolbe';
let trin = null; // turens trin, mens den kører
let timere = [];
let toningTimer = null;
let skiftNr = 0;
const kolbe = { luft: 'miller', kalk: false, lyn: 0, skiftet: false };
let kalkKontakt = null;
const stråle = new THREE.Raycaster();

const vent = (ms, f) => timere.push(setTimeout(f, ms));
function rydTimere() {
  for (const t of timere) clearTimeout(t);
  timere = [];
}

export function lav() {
  lavTurKnap($('begyndelsen'), [BEGYNDELSEN], () => startTur());
  tegning = lavBegyndelsenTegning();
  tegning.gruppe.visible = false;
  verden.scene.add(tegning.gruppe);
  const toning = document.createElement('div');
  toning.className = 'fl-toning';
  toning.id = 'begToning';
  $('begyndelsenVindue').append(toning);

  for (const b of document.querySelectorAll('[data-beg-scene]')) {
    b.addEventListener('click', () => { lyd.klik(); vælgScene(b.dataset.begScene); });
  }
  $('begLyn').addEventListener('click', () => lyn());
  for (const b of document.querySelectorAll('[data-beg-luft]')) {
    b.addEventListener('click', () => { lyd.klik(); nyKolbe(b.dataset.begLuft, kolbe.kalk); });
  }
  kalkKontakt = lavKontakt($('begKalk'));
  kalkKontakt.knap.addEventListener('click', () => {
    if (kolbe.luft !== 'co2') return;
    lyd.klik();
    nyKolbe('co2', !kolbe.kalk);
  });
  $('begKolbeForfra').addEventListener('click', () => { lyd.klik(); nyKolbe(kolbe.luft, kolbe.kalk); });
  $('begDryp').addEventListener('click', () => dryp());
  $('begHindeForfra').addEventListener('click', () => { lyd.klik(); tegning.hinde.nulstil(); visStyring(); });
  $('begKopier').addEventListener('click', () => kopiér());
  $('begRnaForfra').addEventListener('click', () => { lyd.klik(); tegning.rna.nulstil(); visStyring(); panel(); });
  $('begyndelsenHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpBegyndelsen').classList.remove('skjult'); });
  $('begHjælpTur').addEventListener('click', () => {
    lyd.klik();
    $('hjælpBegyndelsen').classList.add('skjult');
    startTur();
  });
  lavTryk();
}

export function start() {
  aktiv = true;
  sætVindue($('begyndelsenVindue'));
  verden.styring.autoRotate = false;
  begrænsDrejning({ vandret: 0.55, lodret: 0.3 });
  verden.opdateringer.add(opdater);
  tegning.gruppe.visible = true;
  nyKolbe('miller', false, true);
  tegning.hinde.nulstil();
  tegning.rna.nulstil();
  tegning.trappe.nulstil();
  vælgScene('kolbe', { straks: true });
  // Turen starter af sig selv første gang, og når man kommer fra dens link, "Din fremgang" eller tur 4 i Liv
  if (tagVentForløb([BEGYNDELSEN.id]) || starterSelv(BEGYNDELSEN)) startTur();
}

export function stop() {
  stopForløb(); // kalder DEL.slut
  aktiv = false;
  rydTimere();
  clearTimeout(toningTimer);
  $('begToning').classList.remove('mørk');
  verden.opdateringer.delete(opdater);
  tegning.gruppe.visible = false;
  begrænsDrejning(null);
  $('hjælpBegyndelsen').classList.add('skjult');
}

function opdater(dt, tid) {
  tegning.opdater(dt, tid);
  // Kopien er færdig, eller boblerne har samlet sig: knapperne til venstre skifter
  const nu = `${scene}${tegning.hinde.fase()}${tegning.rna.kopierer()}${tegning.rna.færdig()}`;
  if (nu !== styret) visStyring();
}
let styret = ''; // det, venstre panel sidst blev tegnet efter

// ---------- Scenerne ----------
// Skifter scene. Billedet toner kort ud og ind, og scenen sættes op, når det er mørkt (straks: uden toning).
function vælgScene(id, { straks = false, opsæt = null } = {}) {
  if (!SCENER.includes(id)) return;
  const nr = ++skiftNr;
  clearTimeout(toningTimer);
  const toning = $('begToning');
  const gør = () => {
    scene = id;
    tegning.vis(id);
    if (id === 'trappe' && !trin) tegning.trappe.vælg(-1);
    opsæt?.();
    kamera();
    visStyring();
    panel();
    toning.classList.remove('mørk');
  };
  if (straks || ROLIG || id === scene) return gør();
  toning.classList.add('mørk');
  toningTimer = setTimeout(() => { if (nr === skiftNr && aktiv) gør(); }, TONING);
}

// Kameraet står forfra og lidt over, og scenens kasse passer i billedet
function kamera() {
  const { kamera: k, styring } = verden;
  const [b, h] = tegning.kasse(scene);
  const d = Math.max(k.position.distanceTo(styring.target), 10);
  styring.target.set(0, 0, 0);
  k.position.set(0, d * 0.16, d);
  passerTilBoks(b, h);
}

// ---------- Kolben ----------
function nyKolbe(luft, kalk, straks = false) {
  kolbe.luft = luft;
  kolbe.kalk = luft === 'co2' && kalk;
  kolbe.lyn = 0;
  tegning.kolbe.sætLuft(luft);
  tegning.kolbe.sætKalk(kolbe.kalk);
  tegning.kolbe.sætFarve(0, true);
  visStyring();
  panel();
  if (!straks) nøgle();
}

function lyn() {
  if (scene !== 'kolbe') return;
  kolbe.lyn++;
  lyd.elektron();
  tegning.kolbe.lyn();
  tegning.kolbe.sætFarve(kolbeFarve(kolbe.luft, kolbe.kalk, kolbe.lyn));
  panel();
}

// ---------- Hinden og RNA'et ----------
function dryp() {
  if (scene !== 'hinde' || !tegning.hinde.dryp()) return;
  lyd.proton();
  visStyring();
}

// I turen bliver bogstav 8 forkert (fast), i laboratoriet tilfældigt med QT45's 94,1 % rigtige
function kopiér(hurtig = 1) {
  if (scene !== 'rna' || tegning.rna.kopierer() || tegning.rna.færdig()) return;
  lyd.proton();
  tegning.rna.kopiér(lavRnaKopi(RNA_START, trin ? { fejl: RNA_FEJL_TUR } : {}), hurtig);
  visStyring();
}

// ---------- Trappen ----------
function prøvTop() {
  if (!tegning.trappe.prøvTop()) return;
  lyd.nej();
  tegning.trappe.vælg(TRAPPEN.length - 1);
  panel();
}

function vælgTrin(i) {
  if (i < 0) return;
  if (TRAPPEN[i].top) return prøvTop();
  lyd.klik();
  tegning.trappe.vælg(i);
  panel();
  if (trin === 'trappen') forløbVink(`${TRAPPEN[i].navn}: ${TRAPPEN[i].nået >= 1 ? 'nået' : 'halvvejs'}. Prøv det øverste trin.`);
}

// ---------- Tryk i 3D ----------
function lavTryk() {
  const lærred = verden.renderer.domElement;
  let ned = null;
  lærred.addEventListener('pointerdown', (h) => {
    ned = aktiv ? { id: h.pointerId, x: h.clientX, y: h.clientY, t: performance.now() } : null;
  });
  lærred.addEventListener('pointerup', (h) => {
    if (!ned || h.pointerId !== ned.id) return;
    const kort = performance.now() - ned.t < 600 && Math.hypot(h.clientX - ned.x, h.clientY - ned.y) < 12;
    ned = null;
    if (kort) tryk(h.clientX, h.clientY);
  });
}

function tryk(x, y) {
  if (!aktiv || (kørerForløb() && !forløbVenter())) return;
  const r = verden.renderer.domElement.getBoundingClientRect();
  stråle.setFromCamera({ x: ((x - r.left) / r.width) * 2 - 1, y: -((y - r.top) / r.height) * 2 + 1 }, verden.kamera);
  if (kørerForløb()) forløbRørt(); // et tryk i scenen, mens man gætter, lader gættet tone væk
  if (scene === 'trappe') vælgTrin(tegning.trappe.trinVed(stråle.ray));
  else if (scene === 'kolbe') {
    if (trin === 'luften' && !kolbe.skiftet) forløbVink('Skift først luften.');
    else lyn();
  } else if (scene === 'hinde') dryp();
  else if (scene === 'rna') kopiér();
}

// ---------- Panelerne ----------
// Venstre panel: scenens knapper (kun dem, der hører til scenen)
function visStyring() {
  styret = `${scene}${tegning.hinde.fase()}${tegning.rna.kopierer()}${tegning.rna.færdig()}`;
  for (const b of document.querySelectorAll('[data-beg-scene]')) {
    b.classList.toggle('valgt', b.dataset.begScene === scene);
    b.setAttribute('aria-pressed', String(b.dataset.begScene === scene));
  }
  for (const id of SCENER) $(`beg-${id}`).hidden = id !== scene;
  for (const b of document.querySelectorAll('[data-beg-luft]')) {
    b.classList.toggle('valgt', b.dataset.begLuft === kolbe.luft);
    b.setAttribute('aria-pressed', String(b.dataset.begLuft === kolbe.luft));
  }
  kalkKontakt.sæt(kolbe.kalk);
  kalkKontakt.knap.disabled = kolbe.luft !== 'co2';
  const h = tegning.hinde.fase();
  $('begDryp').disabled = h !== 'tom';
  $('begHindeForfra').hidden = h === 'tom';
  const kopierer = tegning.rna.kopierer();
  const færdig = tegning.rna.færdig();
  $('begKopier').disabled = kopierer || færdig;
  $('begRnaForfra').hidden = !færdig;
  if (scene === 'rna') {
    const f = tegning.rna.fejl();
    $('begRnaTekst').textContent = !kopierer && !færdig ? 'Tryk "Kopiér", og se RNA\'et bygge en kopi af sig selv.'
      : kopierer ? 'RNA\'et bygger kopien et bogstav ad gangen …'
        : f ? `Færdig, med ${f} fejl. Ved QT45 var ca. 94 af 100 bogstaver rigtige.` : 'Færdig, helt uden fejl. Det skete kun for ca. hver femtende kopi.';
  }
}

function tegnTal(tal) {
  $('begTal').innerHTML = '';
  for (const t of tal) {
    const d = document.createElement('div');
    d.innerHTML = '<dt></dt><dd></dd>';
    d.querySelector('dt').textContent = t.navn;
    d.querySelector('dd').textContent = t.værdi;
    $('begTal').append(d);
  }
}

// Højre panel: titel, højst tre sætninger, højst to tal og de fire kort
function panel() {
  let p;
  if (scene === 'kolbe') {
    const k = KOLBE_PANEL[kolbe.luft === 'co2' ? (kolbe.kalk ? 'kalk' : 'co2') : 'miller'];
    p = { titel: k.titel, tekst: k.tekst, tal: [{ navn: 'Forsøget', værdi: k.forsøg }, { navn: 'Aminosyrer', værdi: aminosyrer(kolbe.luft, kolbe.kalk, kolbe.lyn) }] };
  } else if (scene === 'hinde') p = BOBLE_PANEL;
  else if (scene === 'rna') p = RNA_PANEL;
  else {
    const i = tegning.trappe.valgt();
    p = i >= 0 ? { titel: TRAPPEN[i].navn, tekst: TRAPPEN[i].tekst, tal: TRAPPEN[i].tal } : TRAPPE_PANEL;
  }
  $('begTitel').textContent = p.titel;
  $('begTekst').textContent = p.tekst;
  tegnTal(p.tal);
  $('begHvorfor').innerHTML = BEG_KORT.map((id) => `<button class="hvorfor" data-hvorfor="${id}">${HVORFOR[id].spørgsmål}</button>`).join('');
  nøgle();
}

function nøgle() {
  $('begNøgle').textContent = scene === 'kolbe' ? NØGLE[kolbe.luft] : NØGLE[scene];
}

// ---------- Turen ----------
function startTur() {
  if (!aktiv) return;
  lukHvorfor();
  startForløb(BEGYNDELSEN, DEL);
}

// Et trin starter: rydder vink og timere fra det forrige og stiller scenen op
function trinStart(id, sceneId, opsæt) {
  rydTimere();
  rydBeskeder();
  trin = id;
  vælgScene(sceneId, { opsæt });
}

// Åbner en knap med data-gaa et andet sted (js/gaa.js lytter på klik i hele dokumentet)
function gåTil(gaa) {
  const b = document.createElement('button');
  b.dataset.gaa = gaa;
  b.hidden = true;
  document.body.append(b);
  b.click();
  b.remove();
}

const lynKnap = { id: 'lyn', tekst: 'Lyn', kugle: 'beg-lyn', gør: () => lyn(), tæller: () => `${Math.min(kolbe.lyn, LYN_FULD)}/${LYN_FULD}` };
// "Næste ›" før handlingen: lynene en ad gangen, så man ser vandet skifte farve
function visLyn() {
  for (let i = kolbe.lyn; i < LYN_FULD; i++) vent((i - kolbe.lyn) * VIS_LYN, () => lyn());
}

const DEL = {
  trin: {
    kolbe: {
      start: () => trinStart('kolbe', 'kolbe', () => nyKolbe('miller', false)),
      knapper: [lynKnap],
      færdig: () => scene === 'kolbe' && kolbe.luft === 'miller' && kolbe.lyn >= LYN_FULD,
      visMig: () => visLyn(),
    },
    luften: {
      // Kolben fra trin 1 står der, til man skifter luften. Den nye luft får kalk i vandet (Cleaves m.fl. 2008).
      start: () => trinStart('luften', 'kolbe', () => {
        kolbe.skiftet = false;
        nyKolbe('miller', false);
        kolbe.lyn = LYN_FULD;
        tegning.kolbe.sætFarve(kolbeFarve('miller', false, LYN_FULD), true);
        panel();
      }),
      get knapper() {
        return [
          { id: 'luft', tekst: 'Skift luften', gør: () => skiftLuften(), aktiv: () => !kolbe.skiftet },
          { ...lynKnap, aktiv: () => kolbe.skiftet },
        ];
      },
      færdig: () => kolbe.skiftet && kolbe.luft === 'co2' && kolbe.lyn >= LYN_FULD,
      visMig: () => {
        if (!kolbe.skiftet) skiftLuften();
        vent(VIS_LYN, () => visLyn());
      },
    },
    hinde: {
      start: () => trinStart('hinde', 'hinde', () => tegning.hinde.nulstil()),
      get knapper() {
        return [{ id: 'dryp', tekst: 'Dryp fedtstof', gør: () => dryp(), aktiv: () => tegning.hinde.fase() === 'tom' }];
      },
      færdig: () => tegning.hinde.fase() === 'samlet',
      visMig: () => dryp(),
    },
    rna: {
      start: () => trinStart('rna', 'rna', () => tegning.rna.nulstil()),
      get knapper() {
        return [{ id: 'kopier', tekst: 'Kopiér', gør: () => kopiér(), aktiv: () => !tegning.rna.kopierer() && !tegning.rna.færdig() }];
      },
      færdig: () => {
        // Når fejlen kommer på, siger linjen det
        const f = tegning.rna.fejlNr();
        if (f >= 0 && trin === 'rna') forløbVink(`Bogstav ${f + 1} er forkert: Over for ${RNA_START[f]} skulle der stå ${RNA_PAR[RNA_START[f]]}.`);
        return tegning.rna.færdig();
      },
      visMig: () => {
        if (!tegning.rna.kopierer()) kopiér(2);
        else tegning.rna.sætFart(2);
      },
    },
    trappen: {
      start: () => trinStart('trappen', 'trappe', () => {
        tegning.trappe.nulstil();
        tegning.trappe.lysOp();
      }),
      knapper: [{ id: 'top', tekst: 'Prøv det øverste trin', gør: () => prøvTop(), aktiv: () => !tegning.trappe.prøver() }],
      // Gjort, når man har prøvet, og trinet er løbet tomt igen (det bliver aldrig nået)
      færdig: () => tegning.trappe.forsøg() > 0 && !tegning.trappe.prøver(),
      visMig: () => prøvTop(),
    },
  },
  layout: () => kamera(),
  slutTekst: () => 'Det er en af de største gåder, forskerne arbejder på i dag.',
  veje: [
    { tekst: 'Leg frit: kolben og trappen', primær: true, her: true, gør: () => requestAnimationFrame(() => kamera()) },
    { tekst: 'Hvornår skete det?', hvorfor: 'begHvornaar' },
    { tekst: 'Er der liv andre steder?', gør: () => gåTil('gaader:liv') },
  ],
  slut: () => {
    trin = null;
    rydTimere();
    kolbe.skiftet = false;
    visStyring();
    panel();
  },
};

function skiftLuften() {
  if (kolbe.skiftet) return;
  lyd.klik();
  kolbe.skiftet = true;
  nyKolbe('co2', true);
  forløbVink('');
}

// ---------- Til tests (?test) ----------
export function testAdgang() {
  return {
    forløb: forløbTest(),
    startTur: () => startTur(),
    scene: () => scene,
    trin: () => trin,
    vælgScene: (id) => vælgScene(id, { straks: true }),
    kolbe: () => ({ ...kolbe, farve: tegning.kolbe.farve(), mål: tegning.kolbe.mål(), kalkVist: tegning.kolbe.kalk(), lyser: tegning.kolbe.lyser() }),
    hinde: () => ({ fase: tegning.hinde.fase(), antal: tegning.hinde.antal }),
    rna: () => ({ bygget: tegning.rna.bygget(), fejl: tegning.rna.fejl(), færdig: tegning.rna.færdig(), kopierer: tegning.rna.kopierer() }),
    trappe: () => ({ valgt: tegning.trappe.valgt(), forsøg: tegning.trappe.forsøg(), prøver: tegning.trappe.prøver(), topNået: tegning.trappe.topNået() }),
    synlig: () => tegning.gruppe.visible,
    vist: () => tegning.vist(),
    lyn: () => lyn(),
    vælgTrin: (i) => vælgTrin(i),
    opdateres: () => verden.opdateringer.has(opdater),
    // Spoler tiden frem i små skridt
    spol(sek) {
      for (let t = 0; t < sek; t += 0.05) tegning.opdater(0.05, t);
      visStyring();
    },
  };
}

