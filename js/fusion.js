// Stjerneovnen: fusion i Solens kerne.
// Brintkerner suser rundt i et varmt plasma. Klik på én kerne og så på en anden for at skyde dem mod hinanden.
// Er de hurtige nok til at komme over frastødningen, smelter de sammen (pp-kæden), og en smule masse bliver til energi.

import * as THREE from 'three';
import { verden, sætVindue, passerTil, LAV_KVALITET, lavPrikTekstur } from './scene3d.js';
import { tilføjKantlys } from './atom.js';
import { Effekter, lavRingTekstur } from './effekter.js';
import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked } from './beskeder.js';

const R_OVN = 12; // radius på det område, kernerne er i
const RN = 0.3; // radius på en proton eller neutron
const MAX_PARTIKLER = 140;
const FRASTØD = 5.6; // hvor kraftigt plusladede kerner skubber til hinanden
const START_PROTONER = 40;

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
    tekst: 'To protoner smeltede sammen. Den ene blev lavet om til en neutron, så nu er det deuterium. En positron (antistof) og en neutrino blev skudt ud.',
  },
  {
    a: 'd', b: 'p', ud: ['he3'], skyd: ['gamma'], Q: 5.49, chance: 0.9, kastChance: 1, trin: 1,
    tekst: 'Deuterium fangede en proton og blev til helium-3. Energien kom ud som et glimt af gammastråling.',
  },
  {
    a: 'he3', b: 'he3', ud: ['he4', 'p', 'p'], skyd: [], Q: 12.86, chance: 0.9, kastChance: 1, trin: 2,
    tekst: 'To helium-3 blev til helium-4, og to protoner blev skudt ud igen. Fire protoner er nu blevet til én heliumkerne!',
  },
  {
    a: 'he4', b: 'he4', ud: ['be8'], skyd: [], Q: -0.09, chance: 1, kastChance: 1, trin: 3, minT: 80,
    tekst: 'To heliumkerner blev til beryllium-8. Den falder fra hinanden igen på et øjeblik, medmindre en tredje heliumkerne rammer lige nu!',
  },
  {
    a: 'be8', b: 'he4', ud: ['c12'], skyd: ['gamma'], Q: 7.37, chance: 1, kastChance: 1, trin: 3,
    tekst: 'Tre heliumkerner er blevet til carbon-12! Sådan er alt carbon i universet lavet, også det i din krop.',
  },
];

export const OPGAVER_FUSION = [
  {
    id: 'f-koldt', titel: 'Prøv at skyde to protoner sammen, mens det er for koldt',
    tip: 'Skru temperaturen ned under 10 mio. °C, og skyd en proton mod en anden.',
    fakta: 'Protoner er plusladede og frastøder hinanden. Kun i den enorme varme i en stjernes kerne går de hurtigt nok til at komme helt tæt på hinanden.',
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
    id: 'f-carbon', titel: 'Bonus: Lav carbon som en rød kæmpe', tip: 'Skru op til mindst 80 mio. °C. To heliumkerner bliver til beryllium-8, som hurtigt skal rammes af en tredje heliumkerne.',
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
let effekter = null;
let aktiv = false;
let temperatur = 15; // millioner grader
let tempo = 1;
let valgt = null;
let energi = 0;
let tællere = [0, 0, 0, 0];
let heliumLavet = 0;
let sidstBesked = 0;
let selvForklaret = false; // har vi forklaret, at kun egne skud tæller?
let tid = 0;
let næsteId = 1;
let trykStart = null;
const tidUniform = { value: 0 };
const stråle = new THREE.Raycaster();
const hjælpM = new THREE.Matrix4();
const hjælpV = new THREE.Vector3();
const hjælpS = new THREE.Vector3();

function $(id) {
  return document.getElementById(id);
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

  rod.add(plasma, pMesh, nMesh, glorier, gnister, ring);
  etiket = $('fusEtiket');
  effekter = new Effekter(rod);

  startForfra();
  lavPanel();
  const lærred = verden.renderer.domElement;
  lærred.addEventListener('pointerdown', (h) => { trykStart = { x: h.clientX, y: h.clientY }; });
  lærred.addEventListener('pointerup', vedKlik);
}

function nyPartikel(type, pos, fart) {
  if (partikler.length >= MAX_PARTIKLER) return null;
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
  verden.opdateringer.add(opdater);
  sætVindue($('fusionVindue'));
  verden.styring.target.set(0, 0, 0);
  verden.styring.autoRotate = true;
  verden.styring.autoRotateSpeed = 0.25;
  const k = verden.kamera;
  k.position.setLength(Math.max(k.position.length(), 60));
  passerTil(R_OVN * 0.85);
  opdaterPanel();
}

export function stopFusion() {
  aktiv = false;
  rod.visible = false;
  etiket.classList.add('skjult');
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
    lyd.proton();
    for (let i = 0; i < 10; i++) nyPartikel('p', tilfældigSted());
    opdaterPanel();
  });
  $('fusTempo').addEventListener('click', () => {
    tempo = tempo === 1 ? 3 : 1;
    $('fusTempo').textContent = tempo === 1 ? 'Tempo: normal' : 'Tempo: hurtigt';
    lyd.klik();
  });
  $('fusRyd').addEventListener('click', () => {
    lyd.fjern();
    startForfra();
    $('fusSeneste').innerHTML = '';
    opdaterPanel();
  });
  $('fusHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpFusion').classList.remove('skjult'); });
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
}

function lavOpgaveliste() {
  const liste = $('fusOpgaver');
  liste.innerHTML = '';
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
    lyd.klaret();
    visBesked({ titel: `Opgave klaret: ${o.titel} ★`, tekst: o.fakta, type: 'klaret', varighed: 8000 });
  }, 300);
  lavOpgaveliste();
}

function opdaterPanel() {
  $('fusEnergi').textContent = `${energi.toLocaleString('da-DK', { maximumFractionDigits: 1 })} MeV`;
  for (const li of document.querySelectorAll('#fusOpskrift li')) li.querySelector('.antal').textContent = `${tællere[li.dataset.trin]}×`;
  const antal = {};
  for (const p of partikler) antal[p.type] = (antal[p.type] || 0) + 1;
  $('fusKerner').innerHTML = Object.entries(TYPER)
    .filter(([k]) => k !== 'be8' || antal.be8)
    .map(([k, t]) => `<li><span class="farveprik" style="background:${t.farve}"></span>${t.liste || t.navn}<b>${antal[k] || 0}</b></li>`).join('');
}

function visSeneste(titel, tekst, trin) {
  $('fusSeneste').innerHTML = `<strong>${titel}</strong>${tekst}`;
  for (const li of document.querySelectorAll('#fusOpskrift li')) li.classList.toggle('blink', Number(li.dataset.trin) === trin);
}

// ---------- Klik: vælg og skyd ----------
function partikelUnderMusen(h) {
  const mus = new THREE.Vector2((h.clientX / innerWidth) * 2 - 1, -(h.clientY / innerHeight) * 2 + 1);
  stråle.setFromCamera(mus, verden.kamera);
  let bedst = null;
  let bedstAfstand = Infinity;
  for (const p of partikler) {
    const r = TYPER[p.type].radius + 0.45;
    const t = hjælpV.copy(p.pos).sub(stråle.ray.origin).dot(stråle.ray.direction);
    if (t < 0) continue;
    const afstand = stråle.ray.distanceSqToPoint(p.pos);
    if (afstand < r * r && t < bedstAfstand) {
      bedst = p;
      bedstAfstand = t;
    }
  }
  return bedst;
}

function vedKlik(h) {
  if (!aktiv || !trykStart) return;
  const flyttet = Math.hypot(h.clientX - trykStart.x, h.clientY - trykStart.y);
  trykStart = null;
  if (flyttet > 8) return;
  const p = partikelUnderMusen(h);
  if (!p) {
    valgt = null;
    return;
  }
  if (!valgt || valgt === p || !partikler.includes(valgt)) {
    valgt = p;
    lyd.klik();
    etiket.innerHTML = `<b>${TYPER[p.type].navn}</b> er valgt<small>${LAV_KVALITET ? 'Tryk' : 'Klik'} på den kerne, den skal skydes mod</small>`;
    etiket.style.setProperty('--farve', TYPER[p.type].farve);
    return;
  }
  skyd(valgt, p);
  valgt = null;
}

function skyd(a, b) {
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
  // Fysikken regnes i små delskridt, så hurtige kerner ikke springer forbi hinanden
  const ialt = dt * tempo;
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
        if (afstand > 1.6) {
          const ønsket = hjælpV.copy(p.mål.pos).sub(p.pos).normalize().multiplyScalar(p.fart.length());
          p.fart.lerp(ønsket, 1 - Math.exp(-h * 5));
          p.mål.fart.multiplyScalar(Math.exp(-h * 3));
          p.mål.holdt = 0.3;
        }
      }
      if (p.kastet <= 0) mislykket(p);
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
      const tb = TYPER[b.type];
      const dx = a.pos.x - b.pos.x, dy = a.pos.y - b.pos.y, dz = a.pos.z - b.pos.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      const kontakt = ta.radius + tb.radius;
      const rækkevidde = kontakt + 2.5;
      if (d2 > rækkevidde * rækkevidde) continue;
      const d = Math.sqrt(d2) || 0.001;
      hjælpV.set(dx / d, dy / d, dz / d);
      // Plus frastøder plus (Coulomb). Jo tættere, jo kraftigere.
      const kraft = (FRASTØD * ta.Z * tb.Z) / Math.max(d, 0.3) ** 2;
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
  if (r && temperatur >= (r.minT || 0) && Math.random() < (kastet ? r.kastChance : r.chance)) {
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
      besked('De preller af hinanden', 'Heliumkerner har dobbelt så stor ladning som protoner og frastøder hinanden meget kraftigt. Det kræver mindst 80 mio. °C, som i en rød kæmpe.');
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
  energi += Math.max(0, r.Q);
  tællere[r.trin] += r.ud[0] === 'be8' ? 0 : 1;
  lyd.fusion?.(r.trin);
  const titel = `${TYPER[a.type].navn} + ${TYPER[b.type].navn} → ${TYPER[hoved].navn}`;
  visSeneste(titel, r.tekst, r.trin);
  const egen = a.kastet > 0 || b.kastet > 0; // har man selv skudt en af kernerne?
  if (egen || r.trin >= 2) besked(titel, r.tekst, 'reaktion');

  // Opgaver. De første skridt tæller kun, når man selv har skudt kernerne sammen.
  const førsteSkridt = { d: 'f-d', he3: 'f-he3', he4: 'f-he4' }[hoved];
  if (førsteSkridt && egen) løs(førsteSkridt);
  else if (førsteSkridt && !fremgang.erLøst(førsteSkridt) && !selvForklaret) {
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

function besked(titel, tekst, type = 'info') {
  // Ikke for mange beskeder på én gang
  if (performance.now() - sidstBesked < 1200 && type !== 'reaktion') return;
  sidstBesked = performance.now();
  visBesked({ titel, tekst, type });
}

// Kun til automatiske tests (bruges når adressen indeholder ?test)
export function testAdgang() {
  return {
    partikler: () => partikler.map((p) => ({ id: p.id, type: p.type, kastet: p.kastet, tættest: p.tættest, mål: p.mål?.id, fart: p.fart.length() })),
    skyd: (idA, idB) => skyd(partikler.find((p) => p.id === idA), partikler.find((p) => p.id === idB)),
    temperatur: (t) => { temperatur = t; $('fusTempSkyder').value = t; opdaterTemperatur(); },
    energi: () => energi,
    valgt: () => valgt?.id ?? null,
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
    farve.set(t.farve).multiplyScalar(p.kastet > 0 ? 1.4 : 0.55);
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
    flytEtiket();
  }
  etiket.classList.toggle('skjult', !ring.visible);
}

// Etiketten står lige over den valgte kerne (men inden for 3D-billedet)
function flytEtiket() {
  const afstand = verden.kamera.position.distanceTo(valgt.pos);
  const pxPrEnhed = innerHeight / (2 * afstand * Math.tan(THREE.MathUtils.degToRad(20)));
  hjælpV.copy(valgt.pos).project(verden.kamera);
  const { left, top, width, height } = verden.hul;
  const b = etiket.offsetWidth, h = etiket.offsetHeight;
  const x = THREE.MathUtils.clamp(((hjælpV.x + 1) / 2) * innerWidth - b / 2, left + 4, left + width - b - 4);
  const y = THREE.MathUtils.clamp(((1 - hjælpV.y) / 2) * innerHeight - TYPER[valgt.type].radius * 1.7 * pxPrEnhed - h - 6, top + 4, top + height - h - 4);
  etiket.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}
