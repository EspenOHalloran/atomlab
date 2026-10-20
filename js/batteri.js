// Batteriet: et LiPo-batteri skåret igennem.
// Til venstre grafit (minus), til højre metaloxid (plus), og imellem en elektrolyt med en skillevæg.
// Lithium-ioner (Li⁺) svømmer gennem elektrolytten, og elektronerne må tage omvejen gennem ledningen.
// Ledningen er fuld af elektroner hele tiden. Når der løber strøm, skubbes hele rækken frem på én gang.

import * as THREE from 'three';
import { verden, sætVindue, passerTilBoks, begrænsDrejning, lavPrikTekstur } from './scene3d.js';
import { Effekter, FARVER } from './effekter.js';
import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked } from './beskeder.js';

const ANTAL_LI = 24; // så mange lithium-ioner viser vi (24 = 100 %)
const REJSETID = 1.8; // sekunder for en ion gennem elektrolytten
const KÆDE_AFSTAND = 0.5; // cirka så langt er der mellem elektronerne i ledningen
const HOP_TID = 0.45; // sekunder for en elektron mellem metalfolien og en plads i elektroden
const MAX_SPÆNDING = 4.2; // her skifter laderen fra konstant strøm til konstant spænding
const MODSTAND = 0.2; // volt pr. ampere: batteriets indre modstand (forenklet)
const IONER_PR_AMPERE = 1.2; // så mange ioner flytter sig pr. sekund ved 1 A (i animationen)
// Vi forestiller os en lille celle på 1.000 mAh. Ladestrømmen er "hastighed" ampere: 0,5 A, 1 A eller 2 A.

// Spænding (V) som funktion af opladning, cirka som en rigtig LiPo-celle
const SPÆNDING = [[0, 3.0], [0.05, 3.3], [0.1, 3.45], [0.2, 3.6], [0.4, 3.7], [0.6, 3.8], [0.8, 3.95], [0.9, 4.05], [1, 4.2]];
function spændingVed(andel) {
  for (let i = 1; i < SPÆNDING.length; i++) {
    const [a1, v1] = SPÆNDING[i];
    const [a0, v0] = SPÆNDING[i - 1];
    if (andel <= a1) return v0 + ((andel - a0) / (a1 - a0)) * (v1 - v0);
  }
  return 4.2;
}

export const OPGAVER_BATTERI = [
  {
    id: 'b-fuld', titel: 'Lad batteriet helt op', tip: 'Tryk "Oplad", og vent til 100 %.',
    fakta: 'Fuldt opladet er en LiPo-celle 4,2 V. Til sidst skifter laderen til konstant spænding, så strømmen falder, og cellen ikke bliver overladet.',
  },
  {
    id: 'b-lampe', titel: 'Få lampen til at lyse med batteriet', tip: 'Lad batteriet lidt op, og tryk så "Aflad".',
    fakta: 'Elektronerne laver arbejde, når de løber gennem lampen. Det er den energi, du gemte, da du ladede batteriet op.',
  },
  {
    id: 'b-tom', titel: 'Aflad batteriet, til beskyttelsen slår fra', tip: 'Aflad, til spændingen når 3,0 V.',
    fakta: 'Mange LiPo-batterier, fx i telefoner, har et lille beskyttelseskredsløb. I fx droner passer laderen og elektronikken på i stedet. Går en celle meget længere ned end 3 V, kan kobberet i den begynde at opløses, og cellen tager skade.',
  },
  {
    id: 'b-hurtig', titel: 'Lad hurtigt, og hold øje med varmen', tip: 'Vælg "Hurtig", og tryk "Oplad".',
    fakta: 'Jo hurtigere man lader, jo varmere bliver batteriet. Laderen når også 4,2 V tidligere, så den sidste del tager længere tid. Varme slider på batteriet, så det holder kortere.',
  },
  {
    id: 'b-overlad', titel: 'Se hvad der sker, hvis man overlader', tip: 'Slå "Snyd laderen" til, og lad videre efter 100 %.',
    fakta: 'Derfor må man aldrig lade en LiPo med en forkert lader. Gode ladere stopper ved 4,2 V og balancerer cellerne, så ingen bliver overladet.',
  },
];

// ---------- Tilstand ----------
let rod = null;
let effekter = null;
let aktiv = false;
let tilstand = 'pause'; // 'oplad', 'aflad' eller 'pause'
let hastighed = 1; // 0.5 = langsom, 1 = normal, 2 = hurtig
let snyd = false;
let ioner = []; // { sted: 'anode' | 'katode' | 'rejser', plads, fra, til, t }
let anodePladser = [];
let katodePladser = [];
let timer = 0;
let strøm = 0; // udglattet: hvor mange overførsler pr. sekund (strømmen i ampere er strøm / IONER_PR_AMPERE)
let varme = 0; // 0..1
let nåle = []; // lithium-nåle (dendritter): { x, y, længde }
let død = false;
let afladet = 0; // overførsler i afladning (til lampe-opgaven)
let forklaringVist = null; // den tilstand, forklaringen i panelet er skrevet til
let liMesh = null;
let elektronPunkter = null; // elektron-kæden i ledningen
let kædeAntal = 0;
let kædeAfstand = KÆDE_AFSTAND;
let kædeLængde = 0;
let kædeVej = 0; // hvor langt kæden har flyttet sig i alt (minus = mod kobberet)
let kædeRetning = -1; // -1 = mod kobberet (opladning), 1 = mod aluminiummet (afladning)
let lampe = null;
let lampeLys = null;
let lader = null;
let afbryder = null;
let ledningMidte = null;
let skilte = {}; // skiltet over laderen, lampen og afbryderen
let nålMesh = null;
let ledning = null;
let røg = null;
let tid = 0;
const hjælpM = new THREE.Matrix4();
const hjælpV = new THREE.Vector3();

function $(id) {
  return document.getElementById(id);
}

function andel() {
  return ioner.filter((i) => i.sted === 'anode').length / ANTAL_LI;
}

// ---------- Opbygning ----------
export function lavBatteri() {
  rod = new THREE.Group();
  rod.visible = false;
  verden.scene.add(rod);
  effekter = new Effekter(rod);

  // Strømsamlere: kobber på minussiden, aluminium på plussiden
  const kobber = new THREE.Mesh(new THREE.BoxGeometry(0.4, 10, 5), new THREE.MeshStandardMaterial({ color: 0xc8743a, metalness: 0.8, roughness: 0.35 }));
  kobber.position.x = -11;
  const aluminium = new THREE.Mesh(new THREE.BoxGeometry(0.4, 10, 5), new THREE.MeshStandardMaterial({ color: 0xb8c0cc, metalness: 0.8, roughness: 0.3 }));
  aluminium.position.x = 11;
  kobber.name = 'kobber';
  rod.add(kobber, aluminium);

  // Grafit: lag af carbon (minus)
  const lagGeo = new THREE.BoxGeometry(6, 0.22, 4.4);
  const lagMat = new THREE.MeshStandardMaterial({ color: 0x3a3f4a, roughness: 0.6, metalness: 0.3 });
  for (let i = 0; i < 7; i++) {
    const lag = new THREE.Mesh(lagGeo, lagMat);
    lag.position.set(-7.4, -4 + i * 1.33, 0);
    rod.add(lag);
  }
  // Pladser til lithium mellem grafitlagene
  for (let i = 0; i < 6; i++) {
    for (let k = 0; k < 4; k++) anodePladser.push(new THREE.Vector3(-9.6 + k * 1.45, -3.33 + i * 1.33, 0));
  }

  // Metaloxid: lag af kobolt (blå) og oxygen (røde) (plus)
  const coGeo = new THREE.SphereGeometry(0.3, 12, 10);
  const oGeo = new THREE.SphereGeometry(0.22, 10, 8);
  const coMesh = new THREE.InstancedMesh(coGeo, new THREE.MeshStandardMaterial({ color: 0x3a6fd8, roughness: 0.35 }), 7 * 5);
  const oMesh = new THREE.InstancedMesh(oGeo, new THREE.MeshStandardMaterial({ color: 0xd84a3a, roughness: 0.4 }), 7 * 10);
  let ic = 0, io = 0;
  for (let i = 0; i < 7; i++) {
    const y = -4 + i * 1.33;
    for (let k = 0; k < 5; k++) {
      coMesh.setMatrixAt(ic++, hjælpM.makeTranslation(5.0 + k * 1.3, y, 0));
      oMesh.setMatrixAt(io++, hjælpM.makeTranslation(5.0 + k * 1.3 - 0.35, y + 0.25, 0.3));
      oMesh.setMatrixAt(io++, hjælpM.makeTranslation(5.0 + k * 1.3 + 0.35, y - 0.25, -0.3));
    }
  }
  rod.add(coMesh, oMesh);
  for (let i = 0; i < 6; i++) {
    for (let k = 0; k < 4; k++) katodePladser.push(new THREE.Vector3(5.6 + k * 1.3, -3.33 + i * 1.33, 0));
  }

  // Elektrolyt og skillevæg
  const elektrolyt = new THREE.Mesh(new THREE.BoxGeometry(22, 10, 5), new THREE.MeshStandardMaterial({
    color: 0x5fb4ff, transparent: true, opacity: 0.08, depthWrite: false, roughness: 0.1,
  }));
  // Skillevæggen: en tynd, porøs plade med huller, som kun ionerne kan komme igennem
  const skillevæg = new THREE.Mesh(new THREE.BoxGeometry(0.35, 10, 5), new THREE.MeshBasicMaterial({
    map: lavSkillevægTekstur(), transparent: true, opacity: 0.55, depthWrite: false,
  }));
  const kant = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(22.6, 10.4, 5.2)), new THREE.LineBasicMaterial({ color: 0x5fe3ff, transparent: true, opacity: 0.35 }));
  rod.add(elektrolyt, skillevæg, kant);

  // Ledningen: fra kobberet op over og ned til aluminiummet.
  // Røret er delt i tre, så midterstykket kan fjernes, når afbryderen er slukket.
  const punkter = [new THREE.Vector3(-11, 5, 0), new THREE.Vector3(-11, 9, 0), new THREE.Vector3(-1.4, 9, 0), new THREE.Vector3(1.4, 9, 0), new THREE.Vector3(11, 9, 0), new THREE.Vector3(11, 5, 0)];
  ledning = new THREE.CurvePath();
  for (let i = 1; i < punkter.length; i++) ledning.add(new THREE.LineCurve3(punkter[i - 1], punkter[i]));
  // Ledningen er halvgennemsigtig (ligesom batteriet er skåret igennem), så man kan se elektronerne inde i den
  const ledningMat = new THREE.MeshStandardMaterial({ color: 0xc8743a, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 0.4, depthWrite: false });
  const kobberMat = new THREE.MeshStandardMaterial({ color: 0xc8743a, metalness: 0.6, roughness: 0.4 });
  const rør = (fra, til, stykker) => {
    const vej = new THREE.CurvePath();
    for (let i = fra + 1; i <= til; i++) vej.add(new THREE.LineCurve3(punkter[i - 1], punkter[i]));
    return new THREE.Mesh(new THREE.TubeGeometry(vej, stykker, 0.2, 12, false), ledningMat);
  };
  ledningMidte = rør(2, 3, 8);
  rod.add(rør(0, 2, 60), ledningMidte, rør(3, 5, 60));

  // Lader (en mørk kasse med en gul kant), lampe (en glødende kugle) og afbryder (en arm, der kan vippes op)
  lader = new THREE.Group();
  const kasseGeo = new THREE.BoxGeometry(2.6, 1.6, 1.4);
  const kasse = new THREE.Mesh(kasseGeo, new THREE.MeshStandardMaterial({ color: 0x1d2333, roughness: 0.5 }));
  const kasseKant = new THREE.LineSegments(new THREE.EdgesGeometry(kasseGeo), new THREE.LineBasicMaterial({ color: 0xffd43b }));
  lader.add(kasse, kasseKant);
  lader.position.set(0, 9, 0);
  lampe = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 16), new THREE.MeshStandardMaterial({ color: 0xfff3c4, emissive: 0xffd27a, emissiveIntensity: 0 }));
  lampe.position.set(0, 9.6, 0);
  lampeLys = new THREE.Sprite(new THREE.SpriteMaterial({ map: lavPrikTekstur(true), color: new THREE.Color(3, 2.4, 1.2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  lampeLys.position.copy(lampe.position);
  lampeLys.scale.setScalar(3.4);
  afbryder = new THREE.Group();
  const kontaktGeo = new THREE.SphereGeometry(0.24, 16, 12);
  const kontaktMat = new THREE.MeshStandardMaterial({ color: 0xd8dde8, metalness: 0.8, roughness: 0.3 });
  for (const x of [-1.4, 1.4]) {
    const kontakt = new THREE.Mesh(kontaktGeo, kontaktMat);
    kontakt.position.set(x, 9, 0);
    afbryder.add(kontakt);
  }
  const arm = new THREE.Group(); // drejer om den venstre kontakt
  arm.position.set(-1.4, 9, 0);
  arm.rotation.z = 0.6; // vippet op: afbryderen er slukket
  arm.add(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.16, 0.16).translate(1.4, 0, 0), kobberMat));
  afbryder.add(arm);
  rod.add(lader, lampe, lampeLys, afbryder);
  skilte = {
    lader: lavSkilt('Lader', '#ffd43b'),
    lampe: lavSkilt('Lampe', '#ffe3a3'),
    afbryder: lavSkilt('Afbryder: slukket', '#c9d3f5'),
  };
  for (const s of Object.values(skilte)) {
    s.position.set(0, 10.9, 0);
    rod.add(s);
  }
  skilte.lampe.position.y = 11.5; // over lampens skær

  // Skilte. De nederste står foran og under kassens forkant, så kantlinjen ikke går gennem teksten.
  for (const [tekst, x, y, z, farve] of [['− Grafit', -7.4, -6.3, 2.7, '#c5cad6'], ['Elektrolyt', 0, -6.3, 2.7, '#8fd3ff'], ['Metaloxid +', 7.4, -6.3, 2.7, '#ff9f8f'], ['Skillevæg', 0, 5.8, 0, '#e8eeff']]) {
    const s = lavSkilt(tekst, farve);
    s.position.set(x, y, z);
    s.material.depthTest = false; // skiltene tegnes altid oven på kassen
    s.renderOrder = 3;
    rod.add(s);
  }

  // Lithium-ioner
  const liGeo = new THREE.SphereGeometry(0.34, 14, 10);
  liMesh = new THREE.InstancedMesh(liGeo, new THREE.MeshStandardMaterial({ color: 0xa98bff, emissive: 0x5a2dd8, emissiveIntensity: 0.45, roughness: 0.35 }), ANTAL_LI);
  liMesh.frustumCulled = false;
  rod.add(liMesh);

  // Elektron-kæden: ledningen er fuld af elektroner med samme afstand hele vejen rundt
  kædeLængde = ledning.getLength();
  kædeAntal = Math.round(kædeLængde / KÆDE_AFSTAND);
  kædeAfstand = kædeLængde / kædeAntal;
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(kædeAntal * 3), 3));
  elektronPunkter = new THREE.Points(eGeo, new THREE.PointsMaterial({
    size: 0.7, map: lavPrikTekstur(), color: FARVER.elektron.clone(), transparent: true, depthWrite: false,
  }));
  elektronPunkter.frustumCulled = false;
  elektronPunkter.renderOrder = 2; // tegnes efter den halvgennemsigtige ledning
  rod.add(elektronPunkter);

  // Lithium-nåle (dendritter) og røg ved kortslutning
  nålMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.16, 8, 6), new THREE.MeshStandardMaterial({ color: 0xeef2ff, metalness: 0.9, roughness: 0.2 }), 200);
  nålMesh.count = 0;
  nålMesh.frustumCulled = false;
  const røgGeo = new THREE.BufferGeometry();
  røgGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(120 * 3), 3));
  røg = new THREE.Points(røgGeo, new THREE.PointsMaterial({ size: 2.2, map: lavPrikTekstur(true), color: 0x6c6c78, transparent: true, opacity: 0, depthWrite: false }));
  røg.frustumCulled = false;
  røg.userData.partikler = Array.from({ length: 120 }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3() }));
  rod.add(nålMesh, røg);

  nulstil();
  lavPanel();
}

function lavSkillevægTekstur() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(230,236,255,0.55)';
  g.fillRect(0, 0, 128, 128);
  g.globalCompositeOperation = 'destination-out';
  for (let y = 8; y < 128; y += 16) {
    for (let x = (y / 16) % 2 ? 8 : 16; x < 128; x += 16) {
      g.beginPath();
      g.arc(x, y, 4.5, 0, Math.PI * 2);
      g.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
  return t;
}

// Et skilt med tekst. Lærredet bliver så bredt, som teksten kræver (mindst 256 punkter).
function lavSkilt(tekst, farve, højde = 1.2) {
  const c = document.createElement('canvas');
  const font = '700 30px system-ui, sans-serif';
  let g = c.getContext('2d');
  g.font = font;
  c.width = Math.max(256, Math.ceil(g.measureText(tekst).width + 24));
  c.height = 64;
  g = c.getContext('2d');
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = farve;
  g.fillText(tekst, c.width / 2, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
  s.scale.set((c.width / 64) * højde, højde, 1);
  return s;
}

function nulstil() {
  ioner = [];
  // Et nyt batteri er næsten tomt: det meste lithium sidder i metaloxidet
  for (let i = 0; i < ANTAL_LI; i++) {
    const iAnode = i < 3;
    ioner.push({ sted: iAnode ? 'anode' : 'katode', plads: i, t: 0 });
  }
  nåle = [];
  død = false;
  varme = 0;
  strøm = 0;
  timer = 0;
  tilstand = 'pause';
  rod.getObjectByName('kobber').material.color.setHex(0xc8743a);
  røg.material.opacity = 0;
}

// ---------- Skærmen ----------
export function startBatteri() {
  aktiv = true;
  rod.visible = true;
  // Opgaverne kan være startet forfra i værkstedet
  if (!fremgang.erLøst('b-lampe')) afladet = 0;
  lavOpgaveliste();
  verden.opdateringer.add(opdater);
  sætVindue($('batteriVindue'));
  verden.styring.target.set(0, 2.5, 0);
  verden.styring.autoRotate = false;
  begrænsDrejning({ vandret: 0.7, lodret: 0.5 });
  const k = verden.kamera;
  k.position.set(0, 4.5, Math.max(k.position.length(), 45));
  passerTilBoks(12.5, 9.6); // plads til skiltet over laderen øverst og skiltene forneden
  opdaterPanel();
}

export function stopBatteri() {
  aktiv = false;
  rod.visible = false;
  verden.opdateringer.delete(opdater);
  begrænsDrejning(null);
  verden.styring.target.set(0, 0, 0);
  verden.styring.autoRotate = true;
}

// ---------- Panel ----------
function lavPanel() {
  for (const b of document.querySelectorAll('[data-batteri-tilstand]')) {
    b.addEventListener('click', () => {
      if (død) {
        visBesked({ titel: 'Batteriet er ødelagt', tekst: 'Tryk "Nyt batteri" for at starte forfra.', type: 'advarsel' });
        return;
      }
      tilstand = b.dataset.batteriTilstand;
      lyd.klik();
      if (tilstand === 'aflad' && andel() === 0) visBesked({ titel: 'Batteriet er tomt', tekst: 'Lad det op først.', type: 'advarsel' });
      opdaterPanel();
    });
  }
  for (const b of document.querySelectorAll('[data-batteri-fart]')) {
    b.addEventListener('click', () => {
      hastighed = Number(b.dataset.batteriFart);
      lyd.klik();
      opdaterPanel();
    });
  }
  $('batteriSnyd').addEventListener('click', () => {
    snyd = !snyd;
    lyd.klik();
    if (snyd) visBesked({ titel: 'Laderen er snydt', tekst: 'Nu stopper laderen ikke ved 4,2 V. Det må man ALDRIG gøre med et rigtigt batteri.', type: 'advarsel', varighed: 7000 });
    opdaterPanel();
  });
  $('batteriNyt').addEventListener('click', () => {
    lyd.klik();
    nulstil();
    opdaterPanel();
  });
  $('batteriHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpBatteri').classList.remove('skjult'); });
  lavOpgaveliste();
}

function lavOpgaveliste() {
  const liste = $('batteriOpgaver');
  liste.innerHTML = '';
  for (const o of OPGAVER_BATTERI) {
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
  const o = OPGAVER_BATTERI.find((x) => x.id === id);
  if (!o || !fremgang.løs(id)) return;
  setTimeout(() => {
    if (!aktiv) return;
    lyd.klaret();
    visBesked({ titel: `Opgave klaret: ${o.titel} ★`, tekst: o.fakta, type: 'klaret', varighed: 8000 });
  }, 400);
  lavOpgaveliste();
}

const FORKLARING = {
  oplad: ['Opladning', 'Laderen er en pumpe. Den trækker elektroner (de lyseblå prikker) ud af metaloxidet og skubber dem gennem ledningen over i grafitten. Så bliver grafitten minusladet og trækker i de plusladede lithium-ioner (Li⁺). De svømmer den korte vej gennem elektrolytten og møder elektronerne i grafitten: én ion for hver elektron. Lithium vil helst sidde i metaloxidet, så det kræver energi at tvinge det over i grafitten, ligesom at pumpe vand op i et højt bassin. Den energi er nu gemt.'],
  aflad: ['Afladning', 'Nu vil lithium tilbage til metaloxidet, ligesom vand, der løber ned ad bakken. Men lithium må dele sig på turen: Ionen (Li⁺) svømmer den korte vej gennem elektrolytten. Elektronen kan ikke komme gennem elektrolytten, så den må tage den lange vej gennem ledningen og lampen. Det er den tur, der får lampen til at lyse. I metaloxidet mødes de igen. Når alt lithium er tilbage, er batteriet tomt.'],
  pause: ['Batteriet hviler', 'Afbryderen er slukket, så elektronerne i ledningen kan ikke komme rundt. Og elektrolytten lukker kun ioner igennem, ikke elektroner. Når elektronerne ikke kan komme over, kan ionerne heller ikke. Derfor kan et batteri holde på energien i lang tid.'],
};

// Hvor stor strøm (i ampere) skal der løbe nu, og er laderen nået til konstant spænding (cv)?
// Laderen lader med konstant strøm, til spændingen når 4,2 V. Så holder den spændingen,
// og strømmen falder af sig selv, mens batteriet bliver fyldt.
function beregnStrøm(a) {
  if (død) return { ampere: 0, cv: false };
  if (tilstand === 'oplad') {
    if (snyd) return { ampere: hastighed, cv: false }; // en snydt lader stopper ikke ved 4,2 V
    if (a >= 1) return { ampere: 0, cv: true };
    const hvile = spændingVed(a);
    if (hvile + MODSTAND * hastighed >= MAX_SPÆNDING) return { ampere: Math.max(0, (MAX_SPÆNDING - hvile) / MODSTAND), cv: true };
    return { ampere: hastighed, cv: false };
  }
  if (tilstand === 'aflad' && a > 0) return { ampere: hastighed, cv: false };
  return { ampere: 0, cv: false };
}

// Spændingen mellem polerne: hvilespændingen plus (opladning) eller minus (afladning) et lille fald over den indre modstand
function klemSpænding() {
  const hvile = spændingVed(andel());
  const ampere = strøm / IONER_PR_AMPERE;
  if (tilstand === 'oplad' && !død) return Math.min(snyd ? 4.6 : MAX_SPÆNDING, hvile + MODSTAND * ampere);
  if (tilstand === 'aflad') return Math.max(3.0, hvile - MODSTAND * ampere);
  return hvile;
}

const tal = (x, decimaler) => x.toLocaleString('da-DK', { minimumFractionDigits: decimaler, maximumFractionDigits: decimaler });

function opdaterPanel() {
  const a = andel();
  const { cv } = beregnStrøm(a);
  const ampere = strøm / IONER_PR_AMPERE;
  $('batteriSpænding').textContent = `${tal(klemSpænding(), 2)} V`;
  $('batteriStrøm').textContent = `${tal(ampere < 0.05 ? 0 : ampere, 1)} A`;
  $('batteriProcent').textContent = `${Math.round(a * 100)} %`;
  $('batteriLadning').style.setProperty('--niveau', `${a * 100}%`);
  $('batteriVarme').style.setProperty('--niveau', `${varme * 100}%`);
  $('batteriVarmeTekst').textContent = varme > 0.8 ? 'Meget varm!' : varme > 0.5 ? 'Varm' : varme > 0.2 ? 'Lun' : 'Kølig';
  let fase = 'Hviler: afbryderen er slukket';
  if (død) fase = 'Ødelagt (kortslutning)';
  else if (tilstand === 'oplad') {
    if (snyd) fase = a >= 1 ? 'Overladning: over 4,2 V!' : `Konstant strøm (${tal(hastighed, 1)} A) uden grænse ved 4,2 V`;
    else if (a >= 1) fase = 'Fuldt opladet';
    else if (cv) fase = 'Konstant spænding (4,20 V): strømmen falder';
    else fase = `Konstant strøm (${tal(hastighed, 1)} A)`;
  } else if (tilstand === 'aflad') fase = a <= 0 ? 'Beskyttelsen har slukket (3,0 V)' : 'Aflader gennem lampen';
  $('batteriFase').textContent = fase;
  // Kun når teksten skifter (ellers bliver ordforklaringerne i den lavet om fire gange i sekundet)
  if (forklaringVist !== tilstand) {
    forklaringVist = tilstand;
    const [titel, tekst] = FORKLARING[tilstand];
    $('batteriForklaring').innerHTML = `<strong>${titel}</strong>${tekst}`;
  }
  for (const b of document.querySelectorAll('[data-batteri-tilstand]')) b.classList.toggle('valgt', b.dataset.batteriTilstand === tilstand);
  for (const b of document.querySelectorAll('[data-batteri-fart]')) b.classList.toggle('valgt', Number(b.dataset.batteriFart) === hastighed);
  $('batteriSnyd').classList.toggle('valgt', snyd);
  $('batteriSnyd').textContent = snyd ? 'Snyd laderen: TIL (farligt!)' : 'Snyd laderen: fra';
  // Midt på ledningen sidder laderen, lampen eller en slukket afbryder
  lader.visible = tilstand === 'oplad' && !død;
  lampe.visible = tilstand === 'aflad'; // også her, så den er rigtig fra start, før første billede er tegnet
  afbryder.visible = tilstand === 'pause' || død;
  ledningMidte.visible = !afbryder.visible;
  skilte.lader.visible = lader.visible;
  skilte.lampe.visible = tilstand === 'aflad' && !død;
  skilte.afbryder.visible = afbryder.visible;
}

// ---------- Overførsler ----------
// Flytter én lithium-ion fra den ene side til den anden.
// Opladning: elektronerne går fra plus (aluminium) til minus (kobber). Afladning: den anden vej.
function overfør(fraSted, tilSted) {
  const ion = ioner.find((i) => i.sted === fraSted);
  if (!ion) return false;
  const pladser = tilSted === 'anode' ? anodePladser : katodePladser;
  const ledige = pladser.map((_, i) => i).filter((i) => !ioner.some((x) => (x.sted === tilSted && x.plads === i) || (x.sted === 'rejser' && x.mål === tilSted && x.tilPlads === i)));
  if (!ledige.length) return false;
  const tilPlads = ledige[Math.floor(Math.random() * ledige.length)];
  const fraPos = (fraSted === 'anode' ? anodePladser : katodePladser)[ion.plads].clone();
  ion.sted = 'rejser';
  ion.mål = tilSted;
  ion.tilPlads = tilPlads;
  ion.fra = fraPos;
  ion.til = pladser[tilPlads].clone();
  ion.hul = new THREE.Vector3(0, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 3);
  ion.t = 0;
  ion.hoppet = false;
  // Når ionen går, bliver dens elektron tilbage og hopper ud i metalfolien (og videre ind i ledningen)
  elektronHop(fraPos, fraSted, 'ud');
  return true;
}

// En elektron hopper mellem metalfolien og en plads i elektroden.
// 'ud': fra pladsen ud i folien. 'ind': fra folien ind til pladsen, hvor den møder en Li⁺.
function elektronHop(plads, sted, retning) {
  const folie = new THREE.Vector3(sted === 'anode' ? -10.75 : 10.75, plads.y, plads.z);
  const fra = retning === 'ud' ? plads : folie;
  const til = retning === 'ud' ? folie : plads;
  const vej = til.clone().sub(fra);
  effekter.skyd(fra, vej, 'elektronSvag', vej.length() / HOP_TID, HOP_TID);
}

function vokseNål() {
  // Overskydende lithium sætter sig som metal-nåle på grafitten og vokser mod skillevæggen
  if (!nåle.length) {
    for (let i = 0; i < 3; i++) nåle.push({ y: -3 + i * 2.6 + Math.random(), z: (Math.random() - 0.5) * 2, længde: 0 });
  }
  const nål = nåle[Math.floor(Math.random() * nåle.length)];
  nål.længde += 0.5;
  if (nål.længde >= 5.6 && !død) kortslutning(nål);
}

function kortslutning(nål) {
  død = true;
  tilstand = 'pause';
  const sted = new THREE.Vector3(-0.2, nål.y, nål.z);
  effekter.glimt(sted, 14, new THREE.Color(3.5, 2.4, 1.2), 1.2);
  effekter.bølge(sted, 20, new THREE.Color(3, 1.6, 0.8), 1.4);
  lyd.spaltning();
  lyd.alarm();
  varme = 1;
  for (const r of røg.userData.partikler) {
    r.p.set((Math.random() - 0.5) * 8, nål.y + Math.random() * 2, (Math.random() - 0.5) * 3);
    r.v.set((Math.random() - 0.5) * 0.8, 1.2 + Math.random() * 1.5, (Math.random() - 0.5) * 0.6);
  }
  røg.material.opacity = 0.6;
  visBesked({
    titel: 'Kortslutning!', type: 'advarsel', fast: true, forsinkelse: 1200,
    tekst: 'En lithium-nål stak hul i skillevæggen, så plus og minus rørte hinanden. I et rigtigt batteri giver det så meget varme, at cellen kan svulme op, gå i brand eller eksplodere. Derfor er overladede eller beskadigede LiPo-batterier farlige.',
  });
  løs('b-overlad');
  opdaterPanel();
}

// ---------- Hvert billede ----------
function opdater(dt) {
  tid += dt;
  const a = andel();
  // Hvor ofte flyttes en ion? Det følger strømmen: én ion pr. elektron, der løber gennem ledningen.
  const pr = beregnStrøm(a).ampere * IONER_PR_AMPERE;
  timer += dt * pr;
  let flyttet = 0;
  while (timer >= 1) {
    timer -= 1;
    if (tilstand === 'oplad') {
      if (!overfør('katode', 'anode') && snyd && a >= 1) vokseNål();
    } else if (tilstand === 'aflad') {
      if (overfør('anode', 'katode')) afladet++;
    }
    flyttet++;
  }
  strøm += (pr - strøm) * Math.min(1, dt * 2);

  // Varme: hurtig strøm giver varme, og batteriet køler langsomt af
  if (!død) varme = Math.max(0, Math.min(1, varme + (strøm * strøm * 0.008 - 0.03 * varme) * dt * 4));
  if (tilstand === 'oplad' && hastighed >= 2 && varme > 0.45) løs('b-hurtig');

  // Opgaver og automatiske stop
  if (tilstand === 'oplad' && !snyd && a >= 1 && !ioner.some((i) => i.sted === 'rejser')) {
    løs('b-fuld');
  }
  if (tilstand === 'aflad' && afladet >= 6) løs('b-lampe');
  if (tilstand === 'aflad' && a <= 0 && !ioner.some((i) => i.sted === 'rejser')) {
    løs('b-tom');
    tilstand = 'pause';
    visBesked({ titel: 'Beskyttelsen slår fra ved 3,0 V', tekst: 'Batteriet er tomt. Beskyttelseskredsløbet afbryder, så cellen ikke tager skade.', varighed: 7000 });
  }

  // Ioner på vej gennem elektrolytten (via et hul i skillevæggen)
  for (const ion of ioner) {
    if (ion.sted !== 'rejser') continue;
    ion.t += dt / REJSETID;
    // Lige før ionen lander, hopper en elektron ind fra metalfolien, så de mødes på pladsen
    if (!ion.hoppet && ion.t >= 1 - HOP_TID / REJSETID) {
      ion.hoppet = true;
      elektronHop(ion.til, ion.mål, 'ind');
    }
    if (ion.t >= 1) {
      ion.sted = ion.mål;
      ion.plads = ion.tilPlads;
      effekter.glimt(ion.til, 1.5, new THREE.Color(1.5, 1.6, 3.2), 0.5);
    }
  }

  // Elektron-kæden: hele rækken flytter sig sammen. Der kommer lige så mange elektroner
  // ud af ledningen i den ene ende, som der går ind i den anden, og én pr. ion, der flytter sig.
  if (tilstand === 'oplad') kædeRetning = -1;
  else if (tilstand === 'aflad') kædeRetning = 1;
  kædeVej += kædeRetning * strøm * kædeAfstand * dt;

  tegn(dt);
  effekter.opdater(dt);
  if (flyttet || Math.floor(tid * 4) !== Math.floor((tid - dt) * 4)) opdaterPanel();
}

function tegn(dt) {
  // Lithium-ioner
  ioner.forEach((ion, i) => {
    if (ion.sted === 'rejser') {
      const t = ion.t;
      // Først hen til hullet i skillevæggen, så videre til den nye plads
      if (t < 0.5) hjælpV.lerpVectors(ion.fra, ion.hul, t * 2);
      else hjælpV.lerpVectors(ion.hul, ion.til, (t - 0.5) * 2);
      hjælpV.y += Math.sin(t * Math.PI * 6) * 0.15;
    } else {
      hjælpV.copy((ion.sted === 'anode' ? anodePladser : katodePladser)[ion.plads]);
      hjælpV.y += Math.sin(tid * 2 + i) * 0.05;
    }
    liMesh.setMatrixAt(i, hjælpM.makeTranslation(hjælpV.x, hjælpV.y, hjælpV.z));
  });
  liMesh.instanceMatrix.needsUpdate = true;

  // Elektron-kæden i ledningen (de, der står i hullet ved en slukket afbryder, skjules)
  const pos = elektronPunkter.geometry.attributes.position.array;
  const forskud = ((kædeVej % kædeAfstand) + kædeAfstand) % kædeAfstand;
  for (let i = 0; i < kædeAntal; i++) {
    ledning.getPointAt(Math.min(1, (i * kædeAfstand + forskud) / kædeLængde), hjælpV);
    if (afbryder.visible && Math.abs(hjælpV.x) < 1.4 && hjælpV.y > 8.5) hjælpV.set(0, -9999, 0);
    pos[i * 3] = hjælpV.x; pos[i * 3 + 1] = hjælpV.y; pos[i * 3 + 2] = hjælpV.z;
  }
  elektronPunkter.geometry.attributes.position.needsUpdate = true;
  // Svagere, når de står stille, og klarere, når der løber strøm
  const aktivitet = Math.min(1, strøm / IONER_PR_AMPERE);
  elektronPunkter.material.color.copy(FARVER.elektron).multiplyScalar(0.3 + 0.18 * aktivitet);

  // Lampen lyser, når elektronerne løber gennem den
  const lys = tilstand === 'aflad' ? Math.min(1, strøm / 1.5) : 0;
  lampe.visible = tilstand === 'aflad';
  lampe.material.emissiveIntensity = 0.2 + 2.5 * lys;
  lampeLys.material.opacity = lys * 0.6;

  // Lithium-nåle
  let n = 0;
  for (const nål of nåle) {
    const skridt = Math.floor(nål.længde / 0.3);
    for (let k = 0; k < skridt && n < 200; k++) {
      nålMesh.setMatrixAt(n++, hjælpM.makeTranslation(-4.3 + k * 0.3, nål.y + Math.sin(k * 1.7) * 0.12, nål.z + Math.cos(k * 1.3) * 0.1));
    }
  }
  nålMesh.count = n;
  nålMesh.instanceMatrix.needsUpdate = true;

  // Røg efter kortslutning
  if (røg.material.opacity > 0) {
    const rp = røg.geometry.attributes.position.array;
    røg.userData.partikler.forEach((r, i) => {
      r.p.addScaledVector(r.v, dt);
      rp[i * 3] = r.p.x; rp[i * 3 + 1] = r.p.y; rp[i * 3 + 2] = r.p.z;
    });
    røg.geometry.attributes.position.needsUpdate = true;
    røg.material.opacity = Math.max(0, røg.material.opacity - dt * 0.05);
  }
  if (død) rod.getObjectByName('kobber').material.color.setHex(0x5a3a2a);
}

// Kun til automatiske tests
export function testAdgang() {
  return {
    kør: (sek) => { for (let t = 0; t < sek; t += 0.05) opdater(0.05); return { andel: andel(), varme, død }; },
    info: () => ({
      andel: andel(), ampere: strøm / IONER_PR_AMPERE, cv: beregnStrøm(andel()).cv, spænding: klemSpænding(), kædeVej,
      lader: lader.visible, lampe: lampe.visible, afbryder: afbryder.visible,
    }),
    tilstand: (t) => { tilstand = t; },
    hastighed: (h) => { hastighed = h; },
    snyd: (s) => { snyd = s; },
  };
}
