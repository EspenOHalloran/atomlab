// Stjerneovnen: fusion i Solens kerne.
// Brintkerner suser rundt i et varmt plasma. Klik på én kerne og så på en anden for at skyde dem mod hinanden.
// Er de hurtige nok til at komme over frastødningen, smelter de sammen (pp-kæden), og en smule masse bliver til energi.

import * as THREE from 'three';
import { verden, sætVindue, passerTil, LAV_KVALITET, ROLIG, lavPrikTekstur } from './scene3d.js';
import { tilføjKantlys } from './atom.js';
import { Effekter, lavRingTekstur } from './effekter.js';
import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked, skjulUndertekst } from './beskeder.js';
import { startGuide, harSetGuide, markérSet } from './guide.js';
import { stjerne } from './kosmos/faelles.js';
import { lavPause } from './pause.js';
import { visLag, lavNæsteSkridt } from './lag.js';

const R_OVN = 12; // radius på det område, kernerne er i
const RN = 0.3; // radius på en proton eller neutron
const MAX_PARTIKLER = 140;
const FRASTØD = 5.6; // hvor kraftigt plusladede kerner skubber til hinanden
const START_PROTONER = 40;
const SIGTE_TEMPO = 0.15; // så langsomt går tiden, mens man sigter med en valgt kerne

// ---------- Kernetyper ----------
const T4 = 0.6 / (2 * Math.SQRT2);
const TETRA = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => v.map((x) => x * T4));
const tetra = (dx, dy, typer) => TETRA.map((v, i) => [v[0] + dx, v[1] + dy, v[2], typer[i]]);

export const TYPER = {
  p: { Z: 1, A: 1, navn: 'Proton', liste: 'Proton (hydrogen-1)', kort: 'p', farve: '#ff6b6b', form: [[0, 0, 0, 'p']] },
  d: { Z: 1, A: 2, navn: 'Deuterium', kort: 'D', farve: '#ffa94d', form: [[-0.3, 0, 0, 'p'], [0.3, 0, 0, 'n']] },
  he3: { Z: 2, A: 3, navn: 'Helium-3', kort: '³He', farve: '#ffd43b', form: [[0, 0.35, 0, 'p'], [-0.3, -0.17, 0, 'p'], [0.3, -0.17, 0, 'n']] },
  he4: { Z: 2, A: 4, navn: 'Helium-4', kort: '⁴He', farve: '#74c0fc', form: TETRA.map((v, i) => [...v, i < 2 ? 'p' : 'n']) },
  be8: { Z: 4, A: 8, navn: 'Beryllium-8', kort: '⁸Be', farve: '#e599f7', form: [...tetra(-0.5, 0, ['p', 'p', 'n', 'n']), ...tetra(0.5, 0, ['p', 'n', 'p', 'n'])] },
  c12: { Z: 6, A: 12, navn: 'Carbon-12', kort: 'C', farve: '#8ce99a', form: [...tetra(-0.55, -0.32, ['p', 'p', 'n', 'n']), ...tetra(0.55, -0.32, ['p', 'n', 'p', 'n']), ...tetra(0, 0.62, ['n', 'p', 'n', 'p'])] },
};
for (const t of Object.values(TYPER)) {
  t.radius = Math.max(...t.form.map(([x, y, z]) => Math.hypot(x, y, z))) + RN;
}

// Reaktionerne i pp-kæden (og tre-alfa-processen i røde kæmper). Q = frigjort energi i MeV.
const REAKTIONER = [
  {
    a: 'p', b: 'p', ud: ['d'], skyd: ['positron', 'neutrino'], Q: 1.44, chance: 0.35, kastChance: 0.6, trin: 0,
    tekst: 'To protoner (brintkerner) smeltede sammen. For at de kan blive sammen, blev den ene lavet om til en neutron, så nu er det deuterium ("tung brint"). Samtidig blev en positron (antistof) og en neutrino (en næsten usynlig partikel) skudt ud.',
  },
  {
    a: 'd', b: 'p', ud: ['he3'], skyd: ['gamma'], Q: 5.49, chance: 0.9, kastChance: 1, trin: 1,
    tekst: 'Deuterium fangede en proton mere og blev til helium-3 (2 protoner og 1 neutron). Energien kom ud som et glimt af gammastråling (meget kraftigt lys).',
  },
  {
    a: 'he3', b: 'he3', ud: ['he4', 'p', 'p'], skyd: [], Q: 12.86, chance: 0.9, kastChance: 1, trin: 2,
    tekst: 'To helium-3 stødte sammen. De beholdt 2 protoner og 2 neutroner, altså helium-4, og skød 2 protoner ud igen, som kan bruges forfra. Fire protoner er nu blevet til én heliumkerne!',
  },
  {
    a: 'he4', b: 'he4', ud: ['be8'], skyd: [], Q: -0.09, chance: 1, kastChance: 1, trin: 3, minT: 80,
    tekst: 'To heliumkerner blev til beryllium-8. Den falder fra hinanden igen på langt under en milliardtedel af et sekund, medmindre en tredje heliumkerne rammer den lige nu! (I spillet holder den lidt længere, så du kan nå det.)',
  },
  {
    a: 'be8', b: 'he4', ud: ['c12'], skyd: ['gamma'], Q: 7.37, chance: 1, kastChance: 1, trin: 3,
    tekst: 'Tre heliumkerner er blevet til carbon-12! At lave beryllium-8 kostede 0,09 MeV, så i alt giver tre heliumkerner 7,27 MeV. Sådan er alt carbon i universet lavet, også det i din krop.',
  },
];

export const OPGAVER_FUSION = [
  {
    id: 'f-koldt', titel: 'Prøv at skyde to protoner sammen, mens det er for koldt',
    tip: 'Skru temperaturen ned under 10 mio. °C, og skyd en proton mod en anden.',
    fakta: 'Protoner er plusladede og frastøder hinanden. Kun ved enorm varme, som i en stjernes kerne, kommer de så tæt på hinanden, at de en sjælden gang kan smelte sammen.',
  },
  {
    id: 'f-d', titel: 'Lav deuterium (p + p)', tip: 'Skyd en proton mod en anden proton ved Solens temperatur (15 mio. °C). Det kan kræve flere forsøg.',
    fakta: 'Det første skridt er det sværeste: En proton skal laves om til en neutron, mens de rører hinanden. I Solen venter en proton i gennemsnit milliarder af år på det!',
  },
  {
    id: 'f-he3', titel: 'Lav helium-3', tip: 'Skyd en proton mod en deuteriumkerne (de orange).',
    fakta: 'Deuterium og en proton bliver hurtigt til helium-3. Energien kommer ud som gammastråling.',
  },
  {
    id: 'f-he4', titel: 'Lav helium-4', tip: 'Skyd en helium-3 mod en anden helium-3 (de gule).',
    fakta: 'Fire protoner er blevet til én heliumkerne, og 0,7 % af massen er blevet til energi. Sådan lyser Solen.',
  },
  {
    id: 'f-fem', titel: 'Lav 5 heliumkerner', tip: 'Skru op for varmen og tempoet, eller skyd selv kernerne sammen.',
    fakta: 'Hvert sekund laver Solen ca. 600 millioner ton hydrogen om til helium.',
  },
  {
    id: 'f-energi', titel: 'Frigør 100 MeV energi', tip: 'Hver heliumkerne giver ca. 27 MeV i alt.',
    fakta: 'I Solen bliver ca. 4 millioner ton masse til energi hvert sekund. Det er derfor, den lyser og varmer.',
  },
  {
    id: 'f-carbon', titel: 'Bonus: Lav carbon som en rød kæmpe', tip: 'Skru op til mindst 80 mio. °C (i spillet; i rigtige stjerner ca. 100 mio. °C). To heliumkerner bliver til beryllium-8, som hurtigt skal rammes af en tredje heliumkerne.',
    fakta: 'Alt carbon i din krop er lavet sådan i gamle stjerner. Vi er lavet af stjernestof!',
  },
];

// ---------- Tilstand ----------
let rod = null;
let partikler = [];
let pMesh = null;
let nMesh = null;
let glorier = null;
let gnister = null;
let plasma = null;
let ring = null;
let etiket = null; // HTML-etiket ved den valgte kerne
let sigteRing = null; // svag ring om kernen under musen
let sigteLinje = null; // stiplet linje fra den valgte kerne til kernen under musen
let sigteEtiket = null; // navnet på kernen under musen
let mus = null; // musens plads på skærmen (kun mus, ikke fingre)
let sigte = null; // kernen under musen
let pause = null; // pausen (pause.til er true, mens tiden står stille)
let sigteFaktor = 1; // går mod SIGTE_TEMPO, mens man sigter
let rejse = null; // "Rejsen ind i Solen", mens den kører: { start, fase, retning, slut, blink }
let sol = null; // Solen udefra (bruges kun på rejsen)
let effekter = null;
let aktiv = false;
let temperatur = 15; // millioner grader
let tempo = 0.6; // Langsom 0,3, Normal 0,6 og Hurtig 3 (ganges på tiden, så fysikken er den samme)
let valgt = null;
let energi = 0;
let tællere = [0, 0, 0, 0];
let heliumLavet = 0;
let sidstBesked = 0;
let selvForklaret = false; // har vi forklaret, at kun egne skud tæller?
let skudtSelv = false; // har man selv skudt en kerne (bruges af guiden)?
let demo = null; // "Vis mig": { a, b, t, skudt }
let tempoFørDemo = 1;
let tid = 0;
let næsteId = 1;
let trykStart = null;
const tidUniform = { value: 0 };
const hjælpM = new THREE.Matrix4();
const hjælpV = new THREE.Vector3();
const hjælpS = new THREE.Vector3();

function $(id) {
  return document.getElementById(id);
}

function sætTempo(t) {
  if (demo) tempoFørDemo = t; // "Vis mig" kører i slowmotion og skifter tilbage til det valgte tempo bagefter
  else tempo = t;
  for (const b of document.querySelectorAll('[data-fus-tempo]')) b.classList.toggle('valgt', Number(b.dataset.fusTempo) === t);
}

function termiskFart() {
  return 3 * Math.sqrt(temperatur / 15);
}

// ---------- Opbygning ----------
export function lavFusion() {
  rod = new THREE.Group();
  rod.visible = false;
  verden.scene.add(rod);

  const [b, h] = LAV_KVALITET ? [12, 8] : [18, 12];
  const kugle = new THREE.SphereGeometry(RN, b, h);
  const pMat = new THREE.MeshStandardMaterial({ color: 0xd81414, roughness: 0.38, emissive: 0x4a0303 });
  const nMat = new THREE.MeshStandardMaterial({ color: 0x98a8c8, roughness: 0.42, emissive: 0x0c1424 });
  tilføjKantlys(pMat, new THREE.Color(1.1, 0.12, 0.08), new THREE.Color(0.28, 0.02, 0.01), tidUniform);
  tilføjKantlys(nMat, new THREE.Color(0.16, 0.3, 0.85), new THREE.Color(0, 0, 0), tidUniform);
  pMesh = new THREE.InstancedMesh(kugle, pMat, MAX_PARTIKLER * 7);
  nMesh = new THREE.InstancedMesh(kugle, nMat, MAX_PARTIKLER * 7);
  for (const m of [pMesh, nMesh]) {
    m.count = 0;
    m.frustumCulled = false;
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }

  // En farvet glorie om hver kerne, så man kan se, hvilken slags den er
  const gloGeo = new THREE.BufferGeometry();
  gloGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_PARTIKLER * 3), 3));
  gloGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_PARTIKLER * 3), 3));
  glorier = new THREE.Points(gloGeo, new THREE.PointsMaterial({
    size: 2.6, map: lavPrikTekstur(true), vertexColors: true, transparent: true, opacity: 0.55,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  glorier.frustumCulled = false;

  // Plasmaets glød og frie elektroner (små gnister)
  plasma = new THREE.Sprite(new THREE.SpriteMaterial({
    map: lavPrikTekstur(true), color: 0xff8a2b, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  plasma.scale.setScalar(R_OVN * 3.6);
  const antalGnister = LAV_KVALITET ? 160 : 360;
  const gPos = new Float32Array(antalGnister * 3);
  const gFart = new Float32Array(antalGnister * 3);
  for (let i = 0; i < antalGnister; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * R_OVN);
    gPos.set([v.x, v.y, v.z], i * 3);
    const f = new THREE.Vector3().randomDirection().multiplyScalar(6 + Math.random() * 6);
    gFart.set([f.x, f.y, f.z], i * 3);
  }
  const gGeo = new THREE.BufferGeometry();
  gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
  gnister = new THREE.Points(gGeo, new THREE.PointsMaterial({
    size: 0.18, map: lavPrikTekstur(), color: new THREE.Color(0.9, 2.4, 3.0), transparent: true, opacity: 0.7,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  gnister.userData.fart = gFart;
  gnister.frustumCulled = false;

  // Ring om den valgte kerne
  ring = new THREE.Sprite(new THREE.SpriteMaterial({
    map: lavRingTekstur(), color: new THREE.Color(2.5, 2.3, 1.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  ring.visible = false;
  // Svag ring om den kerne, musen peger på, og en stiplet sigtelinje
  sigteRing = new THREE.Sprite(new THREE.SpriteMaterial({
    map: lavRingTekstur(), color: new THREE.Color(0.9, 1.4, 1.8), transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  sigteRing.visible = false;
  const linjeGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  sigteLinje = new THREE.Line(linjeGeo, new THREE.LineDashedMaterial({
    color: new THREE.Color(1.6, 1.5, 0.8), dashSize: 0.5, gapSize: 0.35, transparent: true, opacity: 0.85, depthWrite: false,
  }));
  sigteLinje.frustumCulled = false;
  sigteLinje.visible = false;

  rod.add(plasma, pMesh, nMesh, glorier, gnister, ring, sigteRing, sigteLinje);
  etiket = $('fusEtiket');
  sigteEtiket = $('fusSigte');
  effekter = new Effekter(rod);

  startForfra();
  lavPanel();
  const lærred = verden.renderer.domElement;
  lærred.addEventListener('pointerdown', (h) => { trykStart = { x: h.clientX, y: h.clientY }; });
  lærred.addEventListener('pointerup', vedKlik);
  // Musen: kernen under musen får en ring. Mens man trækker (drejer kameraet), sigter man ikke.
  lærred.addEventListener('pointermove', (h) => {
    mus = h.pointerType === 'mouse' && !h.buttons ? { x: h.clientX, y: h.clientY } : null;
  });
  lærred.addEventListener('pointerleave', () => { mus = null; });
  addEventListener('keydown', vedTast);
}

// Esc: fortryd den valgte kerne (eller spring rejsen over). Mellemrum klares af pausen (lavPanel).
function vedTast(h) {
  if (!aktiv || h.key !== 'Escape') return;
  if (document.querySelector('.overlag:not(.skjult)')) return;
  if (rejse) slutRejse();
  else valgt = null;
}

// Kerner, der stadig er i ovnen (dem, der lige er smeltet sammen, er markeret væk, men står i listen til næste billede)
const antalIOvnen = () => partikler.reduce((sum, p) => sum + (p.væk ? 0 : 1), 0);

function nyPartikel(type, pos, fart) {
  if (antalIOvnen() >= MAX_PARTIKLER) return null;
  const p = {
    id: næsteId++, type, pos: pos.clone(), fart: fart ? fart.clone() : new THREE.Vector3().randomDirection().multiplyScalar(termiskFart()),
    q: new THREE.Quaternion().random(), akse: new THREE.Vector3().randomDirection(), spin: 0.5 + Math.random() * 1.5,
    varme: 0.5 + Math.random() * 1.3, kastet: 0, mål: null, tættest: Infinity, levetid: type === 'be8' ? 3 : Infinity, ny: 0.4,
  };
  partikler.push(p);
  return p;
}

function tilfældigSted() {
  return new THREE.Vector3().randomDirection().multiplyScalar(Math.cbrt(Math.random()) * (R_OVN - 1));
}

function startForfra() {
  partikler = [];
  valgt = null;
  energi = 0;
  tællere = [0, 0, 0, 0];
  for (let i = 0; i < START_PROTONER; i++) nyPartikel('p', tilfældigSted());
}

// ---------- Skærmen ----------
export function startFusion() {
  aktiv = true;
  rod.visible = true;
  lavOpgaveliste(); // opgaverne kan være startet forfra i værkstedet
  verden.opdateringer.add(opdater);
  sætVindue($('fusionVindue'));
  verden.styring.target.set(0, 0, 0);
  verden.styring.autoRotate = true;
  verden.styring.autoRotateSpeed = 0.25;
  const k = verden.kamera;
  k.position.setLength(Math.max(k.position.length(), 60));
  passerTil(R_OVN * 0.85);
  opdaterPanel();
  // Første gang: en kort rejse fra Solen udefra og ind i kernen. Bagefter (eller ellers) kommer guiden.
  if (!ROLIG && !harSetGuide('fusion-rejse')) startRejse();
  else ventPåGuide(1200);
}

// Guiden starter lidt efter. Kun én ventende start ad gangen, så den ikke starter to gange, hvis man skifter hurtigt frem og tilbage.
let guideTimer = null;
function ventPåGuide(ms) {
  clearTimeout(guideTimer);
  guideTimer = setTimeout(() => {
    guideTimer = null;
    if (aktiv && !rejse) startGuide('fusion', guideTrin());
  }, ms);
}

export function stopFusion() {
  aktiv = false;
  clearTimeout(guideTimer);
  rod.visible = false;
  etiket.classList.add('skjult');
  sigteEtiket.classList.add('skjult');
  mus = null;
  pause.sæt(false);
  verden.renderer.domElement.style.cursor = '';
  slutRejse({ husk: false, guide: false });
  slutDemo();
  verden.opdateringer.delete(opdater);
  verden.styring.autoRotateSpeed = 0.5;
}

// ---------- Panelerne ----------
function lavPanel() {
  const skyder = $('fusTempSkyder');
  skyder.addEventListener('input', () => {
    temperatur = Number(skyder.value);
    opdaterTemperatur();
  });
  $('fusTilføj').addEventListener('click', () => {
    if (antalIOvnen() > MAX_PARTIKLER - 10) {
      lyd.nej();
      besked('Ovnen er fuld', `Der kan højst være ${MAX_PARTIKLER} kerner i ovnen. Smelt nogle sammen, eller tryk "Start forfra".`);
      return;
    }
    lyd.proton();
    for (let i = 0; i < 10; i++) nyPartikel('p', tilfældigSted());
    opdaterPanel();
  });
  for (const b of document.querySelectorAll('[data-fus-tempo]')) {
    b.addEventListener('click', () => {
      lyd.klik();
      sætTempo(Number(b.dataset.fusTempo));
    });
  }
  $('fusRyd').addEventListener('click', () => {
    lyd.fjern();
    startForfra();
    $('fusSeneste').innerHTML = '';
    opdaterPanel();
  });
  $('fusHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpFusion').classList.remove('skjult'); });
  // Pause med knappen eller mellemrum. Under rejsen ind i Solen springer mellemrum rejsen over.
  pause = lavPause({ knap: $('fusPause'), vindue: $('fusionVindue'), aktiv: () => aktiv, mellemrum: () => (rejse ? slutRejse() : pause.skift()) });
  $('fusRejseSpring').addEventListener('click', () => slutRejse());
  $('fusRejseIgen').addEventListener('click', () => {
    $('hjælpFusion').classList.add('skjult');
    startRejse();
  });
  // Et klik i listen over kerner vælger en kerne af den slags (den nærmeste ved midten)
  $('fusKerner').addEventListener('click', (h) => {
    const li = h.target.closest('li[data-type]');
    if (li) vælgType(li.dataset.type);
  });
  // Et klik på en linje i opskriften vælger en kerne til den reaktion, og partnerne blinker
  for (const li of document.querySelectorAll('#fusOpskrift li')) {
    li.addEventListener('click', () => {
      const trin = Number(li.dataset.trin);
      vælgType(['p', 'd', 'he3', antalAf('be8') ? 'be8' : 'he4'][trin]);
    });
  }
  lavNæsteSkridt($('fusMission'), { visMig });
  $('fusGuideIgen').addEventListener('click', () => {
    $('hjælpFusion').classList.add('skjult');
    startGuide('fusion', guideTrin(), { igen: true });
  });
  opdaterTemperatur();
  lavOpgaveliste();
}

function opdaterTemperatur() {
  $('fusTemp').textContent = `${temperatur} mio. °C`;
  let zone;
  if (temperatur < 5) zone = 'Koldt: protonerne frastøder hinanden.';
  else if (temperatur <= 25) zone = 'Som i Solens kerne (ca. 15 mio. °C).';
  else if (temperatur < 80) zone = 'Varmere end Solens kerne.';
  else zone = 'Som i en rød kæmpe: helium kan blive til carbon.';
  $('fusZone').textContent = zone;
  // Plasmaet gløder mere og mere hvidt, jo varmere det er
  const t = Math.min(1, temperatur / 120);
  plasma.material.color.setRGB(1, 0.35 + 0.5 * t, 0.12 + 0.7 * t);
  plasma.material.opacity = 0.25 + 0.4 * t;
  tegnGraf();
}

// ---------- Hvorfor skal det være så varmt? ----------
// En graf over protonernes bevægelsesenergi (fart) ved den valgte temperatur og den energi, der skal til for at komme
// over frastødningen i spillet. Energien måles i forhold til kT ved 15 mio. °C. Fordelingen er Maxwell-Boltzmann:
// f(E) = 2·√(E/π) · kT^(−3/2) · e^(−E/kT). Arealet under kurven (antallet af protoner) er det samme ved alle temperaturer.
// BAKKE er målt i spillet: Med 2 giver formlen næsten samme andel som spillets egne protoner, når de rammer lige på
// (fx 26 % mod 30 % ved 15 mio. °C og 90 % mod 92 % ved 100 mio. °C).
const BAKKE = 2;

// Hvor stor en del af protonerne har mere energi end bakken?
export function andelOverBakken(T) {
  const x = (BAKKE * 15) / T;
  return erfc(Math.sqrt(x)) + 2 * Math.sqrt(x / Math.PI) * Math.exp(-x);
}

// Den komplementære fejlfunktion (tilnærmelse fra Abramowitz og Stegun, 7.1.26)
function erfc(x) {
  const t = 1 / (1 + 0.3275911 * x);
  const p = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return p * Math.exp(-x * x);
}

function tegnGraf() {
  const c = $('fusGraf');
  const g = c.getContext('2d');
  const B = c.width;
  const H = c.height;
  g.clearRect(0, 0, B, H);
  const XMAKS = 7;
  const top = 30;
  const bund = H - 30;
  const kT = temperatur / 15;
  const f = (E) => 2 * Math.sqrt(E / Math.PI) * kT ** -1.5 * Math.exp(-E / kT);
  const maks = 0.484 / 0.8; // toppen ved 15 mio. °C fylder 80 % af højden. Koldere toppe bliver klippet
  const xPx = (E) => 8 + (E / XMAKS) * (B - 16);
  const yPx = (v) => bund - (v / maks) * (bund - top);
  // Området til højre for bakken: her er man hurtig nok
  g.fillStyle = 'rgba(255, 107, 107, 0.1)';
  g.fillRect(xPx(BAKKE), top - 20, B - xPx(BAKKE), bund - top + 20);
  // Kurven: orange for de langsomme, gul for dem, der er hurtige nok
  g.save();
  g.beginPath();
  g.rect(0, top - 8, B, bund - top + 8);
  g.clip();
  const fyld = (fra, til, farve) => {
    g.beginPath();
    g.moveTo(xPx(fra), bund);
    for (let i = 0; i <= 120; i++) {
      const E = fra + ((til - fra) * i) / 120;
      g.lineTo(xPx(E), yPx(f(E)));
    }
    g.lineTo(xPx(til), bund);
    g.closePath();
    g.fillStyle = farve;
    g.fill();
  };
  fyld(0, BAKKE, 'rgba(255, 150, 60, 0.6)');
  fyld(BAKKE, XMAKS, 'rgba(255, 220, 90, 0.95)');
  g.restore();
  // Akse og bakkens grænse
  g.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(xPx(0), bund);
  g.lineTo(xPx(XMAKS), bund);
  g.stroke();
  g.strokeStyle = '#ff6b6b';
  g.setLineDash([8, 6]);
  g.beginPath();
  g.moveTo(xPx(BAKKE), top - 20);
  g.lineTo(xPx(BAKKE), bund);
  g.stroke();
  g.setLineDash([]);
  g.font = '600 22px system-ui, sans-serif';
  g.fillStyle = '#ff9b9b';
  g.fillText('Hurtige nok →', xPx(BAKKE) + 10, top - 2);
  g.fillStyle = '#93a0c4';
  g.fillText('Energi (fart) →', xPx(0), H - 6);
  const andel = andelOverBakken(temperatur);
  const procent = andel < 0.01 ? 'under 1 %' : `ca. ${Math.round(andel * 100)} %`;
  $('fusGrafTekst').innerHTML = `Ved ${temperatur} mio. °C er <b>${procent}</b> af protonerne hurtige nok (gule) til at komme over frastødningens bakke (stiplet).`;
}

// ---------- Rejsen ind i Solen ----------
// Første gang flyver kameraet fra Solen udefra og ind i kernen. Ikke målfast: Ovnen svarer til Solens kerne,
// som er ca. en femtedel af Solens radius.
const SOL_RADIUS = 60;
const REJSE = [
  ['Solen', 'En kæmpe kugle af glødende gas, 109 gange så bred som Jorden. Den består mest af brint.'],
  ['Ind mod midten', 'Jo længere ind, jo varmere og tættere bliver det. Inderst, i kernen, er der ca. 15 millioner grader.'],
  ['Solens kerne', 'Her farer brintkernerne så hurtigt rundt, at de en gang imellem smelter sammen til helium. Det er det, der får Solen til at lyse.'],
];

function startRejse() {
  if (!aktiv) return;
  slutDemo();
  valgt = null;
  if (!sol) {
    sol = stjerne(SOL_RADIUS, 0xfff1b8, 0xff6a10, 0xffa040, 3.2, { styrke: 1.5 });
    verden.scene.add(sol);
  }
  sol.visible = true;
  passerTil(R_OVN * 0.85);
  // På smalle skærme står kameraet længere væk for at se hele ovnen. Så starter rejsen også længere ude (dog inden for
  // stjernehimlen, som begynder ved 700), og den slutter inde i Solen. Det sidste stykke glider kameraet bagefter.
  const passer = verden.målAfstand ?? 42;
  const slut = Math.min(passer, SOL_RADIUS - 8);
  const fra = Math.min(440 * Math.max(1, passer / 43), 650);
  rejse = { start: performance.now(), fase: -1, retning: new THREE.Vector3(0.25, 0.18, 1).normalize(), slut, fra, blink: false };
  verden.målAfstand = null;
  verden.styring.enabled = false;
  verden.styring.autoRotate = false;
  rejse.maxAfstand = verden.styring.maxDistance;
  verden.styring.maxDistance = 1000; // ellers holder styringen kameraet tættere på
  $('fusion').classList.add('rejse');
}

// Langsom start og slutning (0 til 1)
const glat = (t) => t * t * (3 - 2 * t);

function opdaterRejse() {
  const t = rejse.fastTid ?? (performance.now() - rejse.start) / 1000;
  const fase = t < 3.2 ? 0 : t < 6.2 ? 1 : 2;
  if (fase !== rejse.fase) {
    rejse.fase = fase;
    visBesked({ titel: REJSE[fase][0], tekst: REJSE[fase][1], type: 'fase', varighed: 0, trin: [fase + 1, 3], log: false });
  }
  // Kameraet: langt ude, så ind gennem overfladen og videre ind til ovnen
  const { fra, slut } = rejse;
  const R = SOL_RADIUS;
  const midt = fra * 0.89;
  let d;
  if (t < 3.2) d = fra - (fra - midt) * glat(t / 3.2);
  else if (t < 6.2) d = midt - (midt - R + 6) * glat((t - 3.2) / 3);
  else d = R - 6 - (R - 6 - slut) * glat(Math.min(1, (t - 6.2) / 2.6));
  verden.målAfstand = null;
  verden.styring.target.set(0, 0, 0);
  verden.kamera.position.copy(rejse.retning).multiplyScalar(d);
  // Når kameraet kommer ind gennem overfladen, forsvinder den, og et glimt skjuler skiftet
  const inde = d < R + 2;
  sol.visible = !inde;
  if (inde && !rejse.blink) {
    rejse.blink = true;
    const blink = $('fusBlink');
    blink.classList.remove('vist');
    void blink.offsetWidth; // start animationen forfra
    blink.classList.add('vist');
  }
  if (t > 10.5) slutRejse();
}

// husk: gem, at rejsen er set. guide: start guiden bagefter (første gang).
function slutRejse({ husk = true, guide = true } = {}) {
  if (!rejse) return;
  verden.styring.maxDistance = rejse.maxAfstand;
  rejse = null;
  if (sol) sol.visible = false;
  verden.styring.enabled = true;
  $('fusion').classList.remove('rejse');
  skjulUndertekst('fase');
  if (husk) markérSet('fusion-rejse');
  if (!aktiv) return;
  // Kameraet glider på plads i ovnen
  const k = verden.kamera;
  if (k.position.length() > 70) k.position.setLength(70);
  passerTil(R_OVN * 0.85);
  if (guide) ventPåGuide(700);
}

function lavOpgaveliste() {
  const liste = $('fusOpgaver');
  liste.innerHTML = '';
  $('fusOpgaveTal').textContent = `${OPGAVER_FUSION.filter((o) => fremgang.erLøst(o.id)).length} af ${OPGAVER_FUSION.length} ★`;
  for (const o of OPGAVER_FUSION) {
    const li = document.createElement('li');
    const løst = fremgang.erLøst(o.id);
    li.className = løst ? 'løst' : '';
    li.innerHTML = `<span class="flueben">${løst ? '★' : '☆'}</span><span class="opgave-titel"></span>`;
    li.querySelector('.opgave-titel').textContent = o.titel;
    li.title = løst ? o.fakta : o.tip;
    li.addEventListener('click', () => visBesked({ titel: o.titel, tekst: løst ? o.fakta : `Tip: ${o.tip}`, varighed: 8000 }));
    liste.append(li);
  }
}

function løs(id) {
  const o = OPGAVER_FUSION.find((x) => x.id === id);
  if (!o || !fremgang.løs(id)) return;
  setTimeout(() => {
    if (!aktiv) return;
    lyd.klaret();
    visBesked({ titel: `Opgave klaret: ${o.titel} ★`, tekst: o.fakta, type: 'klaret', varighed: 8000 });
  }, 300);
  lavOpgaveliste();
  opdaterMission();
}

// ---------- Næste skridt og "Vis mig" ----------
// Det næste, man kan prøve. vis = hvilken slags kerne "Vis mig" skal arbejde hen imod.
function næsteSkridt() {
  const mangler = (id) => !fremgang.erLøst(id);
  if (mangler('f-d')) return { tekst: 'Skyd en proton mod en anden proton (p + p)', vis: 'd' };
  if (mangler('f-he3')) return { tekst: 'Skyd en proton mod deuterium, den orange (D + p)', vis: 'he3' };
  if (mangler('f-he4')) return { tekst: 'Skyd helium-3 mod helium-3, de gule (³He + ³He)', vis: 'he4' };
  if (mangler('f-fem')) return { tekst: `Lav 5 heliumkerner (${Math.min(5, tællere[2])} af 5)`, vis: 'he4' };
  if (mangler('f-energi')) return { tekst: `Frigør 100 MeV (${Math.floor(energi)} af 100)`, vis: 'he4' };
  if (mangler('f-koldt')) return { tekst: 'Skru ned under 10 mio. °C, og skyd to protoner mod hinanden', vis: null };
  if (mangler('f-carbon')) return { tekst: 'Bonus: Skru op til mindst 80 mio. °C, og lav carbon af helium', vis: null };
  return { tekst: 'Alle opgaver er klaret ★ Leg videre, eller prøv Reaktoren', vis: null };
}

function opdaterMission() {
  const { tekst, vis } = næsteSkridt();
  $('fusMissionTekst').textContent = demo ? 'Se godt efter (slowmotion) …' : tekst;
  $('fusVisMig').hidden = !vis;
  $('fusVisMig').disabled = Boolean(demo);
}

const antalAf = (type) => partikler.filter((p) => p.type === type && !p.væk).length;

// Det par kerner af de to slags, der er tættest på hinanden og på midten
function vælgPar(typeA, typeB) {
  let bedst = null;
  let bedstPoint = Infinity;
  // Kerner, der er skudt af sted, eller som et skud er på vej mod, er optaget.
  // (Ellers kunne "Vis mig" sigte på et skud, der stadig fløj, og stoppe uden en reaktion.)
  const optaget = new Set();
  for (const p of partikler) if (p.kastet > 0) { optaget.add(p); if (p.mål) optaget.add(p.mål); }
  for (const a of partikler) {
    if (a.type !== typeA || a.væk || optaget.has(a)) continue;
    for (const b of partikler) {
      if (b === a || b.type !== typeB || b.væk || optaget.has(b)) continue;
      const point = a.pos.distanceTo(b.pos) + 0.4 * (a.pos.length() + b.pos.length());
      if (point < bedstPoint) {
        bedstPoint = point;
        bedst = [a, b];
      }
    }
  }
  return bedst;
}

// "Vis mig": ovnen skyder selv det næste skridt i slowmotion. Det tæller ikke som en opgave.
function visMig() {
  const { vis } = næsteSkridt();
  if (demo || !vis) return;
  pause.sæt(false);
  // Hvilken reaktion kan vises med de kerner, der er lige nu?
  let par = ['p', 'p'];
  if (vis === 'he4' && antalAf('he3') >= 2) par = ['he3', 'he3'];
  else if (vis !== 'd' && antalAf('d') >= 1) par = ['p', 'd'];
  if (antalAf('p') < 2) for (let i = 0; i < 10; i++) nyPartikel('p', tilfældigSted());
  const valg = vælgPar(...par);
  if (!valg) return;
  if (temperatur < 15) {
    temperatur = 15;
    $('fusTempSkyder').value = 15;
    opdaterTemperatur();
  }
  const [a, b] = valg;
  tempoFørDemo = tempo;
  tempo = 0.25;
  demo = { a, b, t: 0, skudt: false };
  a.demo = true; // de to kerner mærker ikke de andre, så skuddet altid rammer (se fysik)
  b.demo = true;
  valgt = a;
  etiket.innerHTML = `<b>${TYPER[a.type].navn}</b> er valgt<small>Den skydes mod ${TYPER[b.type].navn.toLowerCase()}</small>`;
  etiket.style.setProperty('--farve', TYPER[a.type].farve);
  visBesked({
    titel: 'Sådan gør du',
    tekst: `${LAV_KVALITET ? 'Tryk' : 'Klik'} først på en ${TYPER[a.type].navn.toLowerCase()}. Den får en ring. ${LAV_KVALITET ? 'Tryk' : 'Klik'} så på den kerne, den skal skydes mod. Her går det i slowmotion.`,
    log: false,
  });
  opdaterMission();
}

function opdaterDemo(dt) {
  demo.t += dt;
  if (!demo.skudt) {
    if (!partikler.includes(demo.a) || !partikler.includes(demo.b)) {
      slutDemo();
      return;
    }
    // Først står ringen om den valgte kerne et øjeblik, så bliver den skudt af sted
    if (demo.t > 1.8) {
      demo.skudt = true;
      skyd(demo.a, demo.b, true);
      valgt = null;
    }
  } else if (!partikler.includes(demo.a)) {
    demo.slut ??= demo.t + 1.5; // lidt mere slowmotion efter reaktionen
  }
  if (demo.t > (demo.slut ?? 14)) slutDemo();
}

function slutDemo() {
  if (!demo) return;
  for (const p of [demo.a, demo.b]) {
    p.demo = false;
    p.sikker = false;
  }
  demo = null;
  tempo = tempoFørDemo;
  if (valgt && !partikler.includes(valgt)) valgt = null;
  opdaterMission();
}

// Guiden første gang. Ringen peger på det, man skal trykke på.
function guideTrin() {
  let første = null;
  const tryk = LAV_KVALITET ? 'Tryk' : 'Klik';
  return [
    {
      titel: 'Du er inde i Solens kerne',
      tekst: 'De røde kugler er protoner (brintkerner), og her er 15 millioner grader varmt. Dit mål er at smelte dem sammen til helium, ligesom Solen gør.',
      knap: 'Næste',
    },
    {
      titel: 'Vælg en proton',
      tekst: `${tryk} på en proton, fx den i den gule ring.`,
      start: () => {
        første = vælgPar('p', 'p')?.[0] ?? null;
      },
      mål: () => {
        // Er protonen i ringen smeltet sammen af sig selv, vælges en ny
        if (!første || !partikler.includes(første) || første.væk) første = vælgPar('p', 'p')?.[0] ?? null;
        return første ? kerneMål(første) : null;
      },
      vent: () => valgt !== null,
    },
    {
      titel: 'Skyd den mod en anden',
      tekst: `${tryk} nu på en anden proton. Så bliver den første skudt mod den. De kerner, den kan smelte sammen med, blinker.`,
      start: () => {
        skudtSelv = false;
      },
      // Er valget væk (man trykkede ved siden af, eller protonen smeltede sammen af sig selv), peger ringen på en
      // proton, man kan vælge igen. Ellers ville guiden stå fast uden en ring.
      mål: () => {
        if (!valgt) {
          if (!første || !partikler.includes(første) || første.væk) første = vælgPar('p', 'p')?.[0] ?? null;
          return første ? kerneMål(første) : null;
        }
        const p = nærmestePartner(valgt);
        return p ? kerneMål(p) : null;
      },
      vent: () => skudtSelv,
    },
    {
      mål: '#fusion .skyder-boks',
      titel: 'Varmen er vigtig',
      tekst: 'Protonerne er plusladede og skubber hinanden væk. Jo varmere, jo hurtigere farer de, og jo lettere smelter de sammen. Det kan kræve flere forsøg.',
      knap: 'Næste',
    },
    {
      mål: '#fusMission',
      titel: 'Dit næste skridt',
      tekst: 'Her står, hvad du kan prøve nu. Tryk "Vis mig", så viser ovnen det i slowmotion. Solens opskrift står i panelet.',
      knap: 'Færdig',
    },
  ];
}

// En ring om en kerne på skærmen (til guiden)
function kerneMål(p) {
  const s = skærmPos(p.pos);
  const afstand = verden.kamera.position.distanceTo(p.pos);
  const pxPrEnhed = innerHeight / (2 * afstand * Math.tan(THREE.MathUtils.degToRad(20)));
  return { x: s.x, y: s.y, r: Math.max(20, TYPER[p.type].radius * 1.8 * pxPrEnhed) };
}

// Hvilke slags kerner kan den her slags smelte sammen med (ved den temperatur, der er nu)?
function partnerTyper(type) {
  const typer = new Set();
  for (const r of REAKTIONER) {
    if (temperatur < (r.minT || 0)) continue;
    if (r.a === type) typer.add(r.b);
    if (r.b === type) typer.add(r.a);
  }
  return typer;
}

function nærmestePartner(p) {
  const typer = partnerTyper(p.type);
  let bedst = null;
  let bedstAfstand = Infinity;
  for (const q of partikler) {
    if (q === p || q.væk || !typer.has(q.type)) continue;
    const d = q.pos.distanceTo(p.pos);
    if (d < bedstAfstand) {
      bedstAfstand = d;
      bedst = q;
    }
  }
  return bedst;
}

function opdaterPanel() {
  opdaterMission();
  $('fusEnergi').textContent = `${energi.toLocaleString('da-DK', { maximumFractionDigits: 1 })} MeV`;
  for (const li of document.querySelectorAll('#fusOpskrift li')) li.querySelector('.antal').textContent = `${tællere[li.dataset.trin]}×`;
  const antal = {};
  for (const p of partikler) if (!p.væk) antal[p.type] = (antal[p.type] || 0) + 1;
  $('fusKerner').innerHTML = Object.entries(TYPER)
    .filter(([k]) => k !== 'be8' || antal.be8)
    .map(([k, t]) => `<li data-type="${k}" title="Klik for at vælge en ${t.navn.toLowerCase()}"><span class="farveprik" style="background:${t.farve}"></span>${t.liste || t.navn}<b>${antal[k] || 0}</b></li>`).join('');
}

// Seneste reaktion: overskriften og energien står fremme, og forklaringen folder sig ud (lag 2)
function visSeneste(titel, tekst, trin, kort) {
  $('fusSenesteBoks').hidden = false;
  $('fusSenesteTitel').textContent = titel;
  $('fusSenesteKort').textContent = kort;
  $('fusSeneste').textContent = tekst;
  visLag('fus-seneste');
  for (const li of document.querySelectorAll('#fusOpskrift li')) li.classList.toggle('blink', Number(li.dataset.trin) === trin);
}

// ---------- Klik: vælg og skyd ----------
// Hvor på skærmen et punkt i ovnen er
function skærmPos(v) {
  hjælpV.copy(v).project(verden.kamera);
  return { x: ((hjælpV.x + 1) / 2) * innerWidth, y: ((1 - hjælpV.y) / 2) * innerHeight, z: hjælpV.z };
}

// Den kerne, der er nærmest musen eller fingeren på skærmen. Kernerne flytter sig, så man behøver ikke ramme
// helt præcist. Er en kerne valgt, foretrækkes de kerner, den kan smelte sammen med.
function kerneVed(x, y, finger = false) {
  const partnere = valgt && partikler.includes(valgt) ? partnerTyper(valgt.type) : null;
  const grænse = finger ? 34 : 28;
  let bedst = null;
  let bedstPoint = Infinity;
  for (const p of partikler) {
    if (p.væk) continue;
    const s = skærmPos(p.pos);
    if (s.z >= 1) continue;
    const d = Math.hypot(s.x - x, s.y - y);
    const bonus = partnere?.has(p.type) && p !== valgt ? 16 : 0;
    if (d < grænse + bonus && d - bonus < bedstPoint) {
      bedstPoint = d - bonus;
      bedst = p;
    }
  }
  return bedst;
}

function vælg(p) {
  valgt = p;
  lyd.klik();
  const tryk = LAV_KVALITET ? 'Tryk' : 'Klik';
  etiket.innerHTML = `<b>${TYPER[p.type].navn}</b> er valgt<small>${tryk} på den kerne, den skal skydes mod</small><small>Tiden går langsomt, mens du sigter</small>`;
  etiket.style.setProperty('--farve', TYPER[p.type].farve);
}

const LAV_SÅDAN = {
  p: 'Tryk "+ 10 protoner".',
  d: 'Lav en ved at skyde en proton mod en anden proton.',
  he3: 'Lav en ved at skyde en proton mod deuterium.',
  he4: 'Lav en ved at skyde helium-3 mod helium-3.',
  be8: 'Den laves af to heliumkerner ved mindst 80 mio. °C (i spillet) og holder kun et øjeblik.',
  c12: 'Den laves af beryllium-8 og en heliumkerne.',
};

// Vælg en kerne af en bestemt slags (fra listen eller opskriften): den, der er nærmest midten
function vælgType(type) {
  if (demo || rejse) return;
  let bedst = null;
  for (const p of partikler) {
    if (p.type !== type || p.væk || p.kastet > 0) continue;
    if (!bedst || p.pos.lengthSq() < bedst.pos.lengthSq()) bedst = p;
  }
  if (!bedst) {
    lyd.nej();
    besked(`Der er ingen ${TYPER[type].navn.toLowerCase()} lige nu`, LAV_SÅDAN[type]);
    return;
  }
  vælg(bedst);
}

function vedKlik(h) {
  if (!aktiv || !trykStart || demo) return;
  const flyttet = Math.hypot(h.clientX - trykStart.x, h.clientY - trykStart.y);
  trykStart = null;
  if (flyttet > 8) return;
  if (rejse) {
    slutRejse();
    return;
  }
  const p = kerneVed(h.clientX, h.clientY, h.pointerType === 'touch');
  if (!p) {
    valgt = null;
    return;
  }
  if (!valgt || valgt === p || !partikler.includes(valgt)) {
    vælg(p);
    return;
  }
  skyd(valgt, p);
  valgt = null;
}

// visning = skudt af "Vis mig": rammer altid og tæller ikke som en opgave
function skyd(a, b, visning = false) {
  if (!visning) skudtSelv = true;
  a.demo = visning;
  b.demo = visning;
  a.sikker = visning;
  const t = TYPER[a.type];
  const fart = 2.6 * termiskFart() / Math.pow(t.A, 0.25);
  a.fart.copy(b.pos).sub(a.pos).normalize().multiplyScalar(fart);
  // Den får tid nok til at nå frem (og lidt til)
  a.kastet = Math.min(8, a.pos.distanceTo(b.pos) / fart + 1.2);
  a.mål = b;
  a.tættest = Infinity;
  lyd.neutron();
}

// ---------- Fysik ----------
function opdater(dt) {
  tid += dt;
  tidUniform.value = tid;
  if (demo) opdaterDemo(dt);
  if (rejse) opdaterRejse();
  // Mens man sigter, går tiden langsomt, så målene ikke smutter. Pause stopper den helt.
  const sigter = Boolean(valgt && !demo && partikler.includes(valgt));
  sigteFaktor += ((sigter ? SIGTE_TEMPO : 1) - sigteFaktor) * (1 - Math.exp(-dt * 6));
  if (aktiv && !rejse) verden.styring.autoRotate = !sigter && !pause.til;
  // Fysikken regnes i små delskridt, så hurtige kerner ikke springer forbi hinanden
  const ialt = pause.til ? 0 : dt * tempo * sigteFaktor;
  const skridt = Math.min(14, Math.ceil(ialt / 0.012));
  for (let i = 0; i < skridt; i++) fysik(ialt / skridt);
  partikler = partikler.filter((p) => !p.væk);
  opdaterGnister(ialt);
  tegn();
  effekter.opdater(dt);
}

function fysik(h) {
  const vth = termiskFart();
  for (const p of partikler) {
    if (p.væk) continue;
    const t = TYPER[p.type];
    if (p.kastet > 0) {
      p.kastet -= h;
      if (p.mål && partikler.includes(p.mål)) {
        const afstand = p.pos.distanceTo(p.mål.pos);
        p.tættest = Math.min(p.tættest, afstand);
        // Styr mod målet, indtil de er tæt på hinanden. Målet bremser imens, så det er lettere at ramme.
        // "Vis mig" (sikker) styrer hele vejen.
        if (afstand > 1.6 || p.sikker) {
          const ønsket = hjælpV.copy(p.mål.pos).sub(p.pos).normalize().multiplyScalar(p.fart.length());
          p.fart.lerp(ønsket, 1 - Math.exp(-h * 5));
          p.mål.fart.multiplyScalar(Math.exp(-h * 3));
          p.mål.holdt = 0.3;
        }
      }
      if (p.kastet <= 0) {
        mislykket(p);
        p.sikker = false;
        if (p.demo) slutDemo();
      }
    } else if (p.holdt > 0) {
      p.holdt -= h;
    } else {
      // Varmebevægelse: små tilfældige puf, og farten holdes omkring den, temperaturen giver
      p.fart.addScaledVector(hjælpV.randomDirection(), vth * 0.8 * h);
      if (Math.random() < h * 0.3) p.varme = 0.5 + Math.random() * 1.3;
      const mål = (vth / Math.sqrt(t.A)) * p.varme;
      const nu = p.fart.length() || 0.001;
      p.fart.multiplyScalar(1 + (mål / nu - 1) * Math.min(1, h * 1.5));
    }
    p.pos.addScaledVector(p.fart, h);
    // Kanten af ovnen: kernerne preller af
    const l = p.pos.length();
    const grænse = R_OVN - t.radius;
    if (l > grænse) {
      const n = hjælpS.copy(p.pos).divideScalar(l);
      const ind = p.fart.dot(n);
      if (ind > 0) p.fart.addScaledVector(n, -2 * ind);
      p.pos.copy(n).multiplyScalar(grænse);
    }
    if (p.levetid !== Infinity) {
      p.levetid -= h;
      if (p.levetid <= 0) berylliumFalderFraHinanden(p);
    }
    p.ny = Math.max(0, p.ny - h);
    p.q.multiply(new THREE.Quaternion().setFromAxisAngle(p.akse, p.spin * h));
  }

  // Par: frastødning og sammenstød
  for (let i = 0; i < partikler.length; i++) {
    const a = partikler[i];
    if (a.væk) continue;
    const ta = TYPER[a.type];
    for (let j = i + 1; j < partikler.length; j++) {
      const b = partikler[j];
      if (b.væk) continue;
      // "Vis mig": de to kerner går lige igennem de andre, så de ikke bliver skubbet af kurs eller smelter sammen med en anden
      if (Boolean(a.demo) !== Boolean(b.demo)) continue;
      const tb = TYPER[b.type];
      const dx = a.pos.x - b.pos.x, dy = a.pos.y - b.pos.y, dz = a.pos.z - b.pos.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      const kontakt = ta.radius + tb.radius;
      const rækkevidde = kontakt + 2.5;
      if (d2 > rækkevidde * rækkevidde) continue;
      const d = Math.sqrt(d2) || 0.001;
      hjælpV.set(dx / d, dy / d, dz / d);
      // Plus frastøder plus (Coulomb). Jo tættere, jo kraftigere. ("Vis mig" snyder og slår det fra for sit skud.)
      const snyd = (a.sikker && a.mål === b) || (b.sikker && b.mål === a);
      const kraft = snyd ? 0 : (FRASTØD * ta.Z * tb.Z) / Math.max(d, 0.3) ** 2;
      a.fart.addScaledVector(hjælpV, (kraft / ta.A) * h);
      b.fart.addScaledVector(hjælpV, (-kraft / tb.A) * h);
      if (d < kontakt * 0.92) {
        sammenstød(a, b, hjælpV.clone());
        if (a.væk) break;
      }
    }
  }
}

function sammenstød(a, b, n) {
  const r = REAKTIONER.find((x) => (x.a === a.type && x.b === b.type) || (x.a === b.type && x.b === a.type));
  const kastet = a.kastet > 0 || b.kastet > 0;
  const sikker = (a.sikker || b.sikker) && r && temperatur >= (r.minT || 0);
  if (sikker || (r && temperatur >= (r.minT || 0) && Math.random() < (kastet ? r.kastChance : r.chance))) {
    udfør(a, b, r);
    return;
  }
  // Ingen reaktion: de preller af hinanden
  const ma = TYPER[a.type].A, mb = TYPER[b.type].A;
  const vrel = hjælpS.copy(a.fart).sub(b.fart).dot(n);
  if (vrel < 0) {
    const j = (-2 * vrel) / (1 / ma + 1 / mb);
    a.fart.addScaledVector(n, j / ma);
    b.fart.addScaledVector(n, -j / mb);
  }
  if (kastet) {
    a.kastet = 0;
    b.kastet = 0;
    if (r && r.minT && temperatur < r.minT) {
      besked('De preller af hinanden', 'Heliumkerner har dobbelt så stor ladning som protoner og frastøder hinanden meget kraftigt. I spillet kræver det mindst 80 mio. °C. I rigtige stjerner sker det ved ca. 100 mio. °C, som i en rød kæmpe.');
    } else if (r && r.a === 'p') {
      besked('De ramte hinanden, men intet skete', 'For at blive til deuterium skal en proton laves om til en neutron, mens de rører hinanden. Det sker sjældent. Prøv igen!');
    } else if (!r) {
      besked('Ingen reaktion', `${TYPER[a.type].navn} og ${TYPER[b.type].navn} smelter ikke sammen i Solens opskrift. Kig på opskriften til højre.`);
    }
  }
}

function udfør(a, b, r) {
  const ma = TYPER[a.type].A, mb = TYPER[b.type].A;
  const sted = a.pos.clone().multiplyScalar(ma).add(b.pos.clone().multiplyScalar(mb)).divideScalar(ma + mb);
  const fart = a.fart.clone().multiplyScalar(ma).add(b.fart.clone().multiplyScalar(mb)).divideScalar(ma + mb);
  a.væk = true;
  b.væk = true;
  if (valgt === a || valgt === b) valgt = null;
  const [hoved, ...resten] = r.ud;
  nyPartikel(hoved, sted, fart);
  resten.forEach((type, i) => {
    const retning = new THREE.Vector3().randomDirection();
    if (i === 1) retning.copy(partikler[partikler.length - 1].fart).normalize().negate();
    nyPartikel(type, sted.clone().addScaledVector(retning, 1.2), retning.multiplyScalar(10));
  });
  for (const slags of r.skyd) effekter.skyd(sted, new THREE.Vector3().randomDirection(), slags, slags === 'gamma' ? 40 : 26);
  effekter.glimt(sted, 2 + Math.max(0, r.Q) * 0.35);
  effekter.bølge(sted, 3 + Math.max(0, r.Q) * 0.6);
  if (r.Q > 0) effekter.tekst(sted.clone().add(new THREE.Vector3(0, 1.4, 0)), `+${r.Q.toLocaleString('da-DK')} MeV`);
  energi += r.Q; // med fortegn: beryllium-8 koster 0,09 MeV
  tællere[r.trin] += r.ud[0] === 'be8' ? 0 : 1;
  lyd.fusion?.(r.trin);
  const titel = `${TYPER[a.type].navn} + ${TYPER[b.type].navn} → ${TYPER[hoved].navn}`;
  // Underteksten siger kort, hvad der skete. Forklaringen står i panelet og bag "Hvorfor?".
  const kort = r.Q > 0 ? `+${r.Q.toLocaleString('da-DK')} MeV` : `Det kostede ${(-r.Q).toLocaleString('da-DK')} MeV.`;
  visSeneste(titel, r.tekst, r.trin, kort);
  const visning = a.demo || b.demo; // skudt af "Vis mig"
  const egen = (a.kastet > 0 || b.kastet > 0) && !visning; // har man selv skudt en af kernerne?
  if (egen || visning || r.trin >= 2) besked(titel, kort, 'reaktion', { spørgsmål: titel, svar: r.tekst });

  // Opgaver. De første skridt tæller kun, når man selv har skudt kernerne sammen.
  const førsteSkridt = { d: 'f-d', he3: 'f-he3', he4: 'f-he4' }[hoved];
  if (førsteSkridt && egen) løs(førsteSkridt);
  else if (førsteSkridt && !visning && !fremgang.erLøst(førsteSkridt) && !selvForklaret && !rejse) {
    selvForklaret = true;
    besked('De smeltede selv sammen', 'Kernerne støder også sammen af sig selv i plasmaet. Opgaven tæller, når du selv skyder dem sammen.');
  }
  if (hoved === 'he4') {
    heliumLavet++;
    if (tællere[2] >= 5) løs('f-fem');
  }
  if (hoved === 'c12') løs('f-carbon');
  if (hoved === 'be8') besked('Hurtigt!', 'Beryllium-8 falder snart fra hinanden. Klik på en heliumkerne og så på beryllium-8 (den lilla).', 'reaktion');
  if (energi >= 100) løs('f-energi');
  opdaterPanel();
}

function berylliumFalderFraHinanden(p) {
  p.væk = true;
  energi += 0.09; // de 0,09 MeV, det kostede at lave den, kommer tilbage
  const retning = new THREE.Vector3().randomDirection();
  nyPartikel('he4', p.pos.clone().addScaledVector(retning, 0.6), p.fart.clone().addScaledVector(retning, 5));
  nyPartikel('he4', p.pos.clone().addScaledVector(retning, -0.6), p.fart.clone().addScaledVector(retning, -5));
  effekter.glimt(p.pos, 2, new THREE.Color(1.6, 1.2, 2.2));
  besked('Beryllium-8 faldt fra hinanden', 'Den holder kun et øjeblik. Den tredje heliumkerne skal ramme den med det samme.');
  opdaterPanel();
}

// En kastet kerne nåede ikke frem
function mislykket(p) {
  if (!p.mål) return;
  const mål = p.mål;
  p.mål = null;
  if (!partikler.includes(mål) || p.væk) return;
  const r = REAKTIONER.find((x) => (x.a === p.type && x.b === mål.type) || (x.a === mål.type && x.b === p.type));
  if (p.tættest < TYPER[p.type].radius + TYPER[mål.type].radius + 2.2) {
    if (temperatur < 10 && p.type === 'p' && mål.type === 'p') {
      besked('Frastødt!', 'Begge protoner er plusladede og skubber hinanden væk. Ved denne temperatur er de ikke hurtige nok. Skru op for varmen!');
      løs('f-koldt');
    } else if (r) {
      besked('Frastødt!', 'De nåede ikke helt sammen, fordi de frastøder hinanden. Prøv igen, eller skru op for temperaturen.');
    }
  }
}

function besked(titel, tekst, type = 'info', hvorfor = null) {
  if (rejse) return; // rejsen ind i Solen har sine egne undertekster
  // Ikke for mange beskeder på én gang
  if (performance.now() - sidstBesked < 1200 && type !== 'reaktion') return;
  sidstBesked = performance.now();
  visBesked({ titel, tekst, type, hvorfor });
}

// Kun til automatiske tests (bruges når adressen indeholder ?test)
export function testAdgang() {
  return {
    partikler: () => partikler.map((p) => ({ id: p.id, type: p.type, kastet: p.kastet, tættest: p.tættest, mål: p.mål?.id, fart: p.fart.length() })),
    skyd: (idA, idB) => skyd(partikler.find((p) => p.id === idA), partikler.find((p) => p.id === idB)),
    temperatur: (t) => { temperatur = t; $('fusTempSkyder').value = t; opdaterTemperatur(); },
    energi: () => energi,
    valgt: () => valgt?.id ?? null,
    sigteFaktor: () => sigteFaktor,
    rejse: () => (rejse ? rejse.fase : null),
    // Frys rejsen på et bestemt tidspunkt (sekunder), så en test kan tage et billede
    rejseTid: (t) => { if (rejse) rejse.fastTid = t; },
    rejseInfo: () => rejse && { slut: rejse.slut, fra: rejse.fra },
    andelOverBakken: (T) => andelOverBakken(T),
    pause: () => pause.til,
    sigte: () => sigte?.id ?? null,
    kerneVed: (x, y) => kerneVed(x, y)?.id ?? null,
    vælg: (id) => { const p = partikler.find((x) => x.id === id); if (p) vælg(p); else valgt = null; },
    visMig: () => visMig(),
    demo: () => Boolean(demo),
    // Spol hele ovnen frem med tegning og "Vis mig" (testbrowseren tegner kun få billeder i sekundet)
    spolAlt: (sek) => { for (let t = 0; t < sek; t += 0.05) opdater(0.05); },
    mission: () => $('fusMissionTekst').textContent,
    // Hvor på skærmen en kerne er (så en test kan klikke på den)
    skærmPos: (id) => {
      const v = partikler.find((p) => p.id === id).pos.clone().project(verden.kamera);
      return { x: ((v.x + 1) / 2) * innerWidth, y: ((1 - v.y) / 2) * innerHeight };
    },
    tilføj: (type, antal) => { for (let i = 0; i < antal; i++) nyPartikel(type, tilfældigSted()); },
    // Spol simuleringen frem uden at tegne (sekunder i ovnen)
    spol: (sek) => {
      for (let t = 0; t < sek; t += 0.012) {
        fysik(0.012);
        partikler = partikler.filter((p) => !p.væk);
      }
      return { energi, tællere: [...tællere] };
    },
  };
}

// ---------- Tegning ----------
function opdaterGnister(h) {
  const pos = gnister.geometry.attributes.position.array;
  const fart = gnister.userData.fart;
  const skala = Math.sqrt(temperatur / 15);
  for (let i = 0; i < pos.length; i += 3) {
    pos[i] += fart[i] * h * skala;
    pos[i + 1] += fart[i + 1] * h * skala;
    pos[i + 2] += fart[i + 2] * h * skala;
    const l2 = pos[i] ** 2 + pos[i + 1] ** 2 + pos[i + 2] ** 2;
    if (l2 > R_OVN * R_OVN) {
      const v = hjælpV.randomDirection().multiplyScalar(Math.random() * R_OVN * 0.8);
      pos[i] = v.x; pos[i + 1] = v.y; pos[i + 2] = v.z;
    }
  }
  gnister.geometry.attributes.position.needsUpdate = true;
}

function tegn() {
  let ip = 0, iN = 0;
  const gPos = glorier.geometry.attributes.position.array;
  const gFarve = glorier.geometry.attributes.color.array;
  const farve = new THREE.Color();
  // De kerner, den valgte kan smelte sammen med, blinker
  const partnere = valgt && partikler.includes(valgt) ? partnerTyper(valgt.type) : null;
  const blink = 1.7 + 0.9 * Math.sin(tid * 7);
  partikler.forEach((p, i) => {
    const t = TYPER[p.type];
    const skala = 1 - p.ny * 1.5;
    for (const [x, y, z, slags] of t.form) {
      hjælpV.set(x, y, z).applyQuaternion(p.q).multiplyScalar(skala).add(p.pos);
      hjælpM.compose(hjælpV, p.q, hjælpS.setScalar(Math.max(0.05, skala)));
      if (slags === 'p') pMesh.setMatrixAt(ip++, hjælpM);
      else nMesh.setMatrixAt(iN++, hjælpM);
    }
    gPos[i * 3] = p.pos.x; gPos[i * 3 + 1] = p.pos.y; gPos[i * 3 + 2] = p.pos.z;
    farve.set(t.farve).multiplyScalar(p.kastet > 0 ? 1.4 : partnere?.has(p.type) && p !== valgt ? blink : 0.55);
    gFarve[i * 3] = farve.r; gFarve[i * 3 + 1] = farve.g; gFarve[i * 3 + 2] = farve.b;
  });
  pMesh.count = ip;
  nMesh.count = iN;
  pMesh.instanceMatrix.needsUpdate = true;
  nMesh.instanceMatrix.needsUpdate = true;
  glorier.geometry.setDrawRange(0, partikler.length);
  glorier.geometry.attributes.position.needsUpdate = true;
  glorier.geometry.attributes.color.needsUpdate = true;

  ring.visible = Boolean(valgt && partikler.includes(valgt));
  if (ring.visible) {
    ring.position.copy(valgt.pos);
    ring.scale.setScalar(TYPER[valgt.type].radius * 3.2 + Math.sin(tid * 6) * 0.25);
    flytEtiket(etiket, valgt);
  }
  etiket.classList.toggle('skjult', !ring.visible);
  tegnSigte();
}

// Kernen under musen: en svag ring, navnet og en sigtelinje fra den valgte kerne
function tegnSigte() {
  sigte = mus && !demo && !rejse ? kerneVed(mus.x, mus.y) : null;
  const vis = Boolean(sigte && sigte !== valgt);
  sigteRing.visible = vis;
  verden.renderer.domElement.style.cursor = sigte ? 'pointer' : '';
  const linje = vis && ring.visible;
  sigteLinje.visible = linje;
  if (linje) {
    const pos = sigteLinje.geometry.attributes.position;
    pos.setXYZ(0, valgt.pos.x, valgt.pos.y, valgt.pos.z);
    pos.setXYZ(1, sigte.pos.x, sigte.pos.y, sigte.pos.z);
    pos.needsUpdate = true;
    sigteLinje.computeLineDistances();
  }
  if (!vis) {
    sigteEtiket.classList.add('skjult');
    return;
  }
  sigteRing.position.copy(sigte.pos);
  sigteRing.scale.setScalar(TYPER[sigte.type].radius * 2.8);
  // Er en kerne valgt, står der også, om de to kan smelte sammen
  let tekst = `<b>${TYPER[sigte.type].navn}</b>`;
  if (ring.visible) tekst += partnerTyper(valgt.type).has(sigte.type) ? '<small>Klik for at skyde hertil</small>' : '<small>Kan ikke smelte sammen med den valgte</small>';
  if (sigteEtiket.dataset.tekst !== tekst) {
    sigteEtiket.innerHTML = tekst;
    sigteEtiket.dataset.tekst = tekst;
  }
  sigteEtiket.style.setProperty('--farve', TYPER[sigte.type].farve);
  sigteEtiket.classList.remove('skjult');
  flytEtiket(sigteEtiket, sigte);
}

// En etiket står lige over en kerne (men inden for 3D-billedet)
function flytEtiket(el, p) {
  const afstand = verden.kamera.position.distanceTo(p.pos);
  const pxPrEnhed = innerHeight / (2 * afstand * Math.tan(THREE.MathUtils.degToRad(20)));
  hjælpV.copy(p.pos).project(verden.kamera);
  const { left, top, width, height } = verden.hul;
  const b = el.offsetWidth, h = el.offsetHeight;
  const x = THREE.MathUtils.clamp(((hjælpV.x + 1) / 2) * innerWidth - b / 2, left + 4, left + width - b - 4);
  const y = THREE.MathUtils.clamp(((1 - hjælpV.y) / 2) * innerHeight - TYPER[p.type].radius * 1.7 * pxPrEnhed - h - 6, top + 4, top + height - h - 4);
  el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}
