// Jorden og Månen som kugler i Kosmos (Årstiderne og Formørkelser).
// Jorden: rigtige billeder fra NASA (se billeder/solsystem/KILDER.md), når de findes, ellers et enkelt kort over land og hav.
// Der er dag og nat, rødligt lys ved solnedgang langs grænsen mellem dag og nat, Solens glimt i havet, et blåt skær af luft
// i kanten og en tynd atmosfære uden om. Med billederne kommer også årstider (sne om vinteren), skyer, byernes lys og bjerge.
// Månen: et rigtigt kort, når det findes, ellers grå med mørke "have". Den lyser næsten lige meget over hele skiven, som den rigtige.
// Begge kan få skygge: Månens skygge på Jorden (solformørkelse) og Jordens skygge på Månen (måneformørkelse).
// Skyggen regnes som i js/data/skygge.js: hvor stor en del af Solen der er dækket, set fra hvert punkt.

import * as THREE from 'three';
import { glød } from './faelles.js';
import { LANDKORT } from '../data/landkort.js';
import { dagIDag } from '../data/solbane.js';
import { verden, LAV_KVALITET, TEST_HURTIG } from '../scene3d.js';

const RAD = Math.PI / 180;

// ---------- Billederne ----------
// Kun de filer, der findes, står her, så der ikke bliver spurgt efter filer, der mangler.
// navn: fast filnavn. størrelse: true betyder, at filen findes som -4k.jpg (pc) og -2k.jpg (tablet og telefon).
const MAPPE = new URL('../../billeder/solsystem/', import.meta.url).href; // virker også fra andre sider (fx tests/vaerktoejer/kloder.html)
const STØRRELSE = LAV_KVALITET || TEST_HURTIG ? '2k' : '4k';
const BILLEDER = {
  dag: { navn: ['jorden-dag-01', 'jorden-dag-04', 'jorden-dag-07', 'jorden-dag-10'], størrelse: true, farve: true }, // Blue Marble 2004
  nat: { navn: 'jorden-nat', størrelse: true, farve: true }, // byernes lys (Black Marble 2016)
  skyer: { navn: 'jorden-skyer', størrelse: true, kanaler: 1 }, // kun én kanal i grafikkortet (sparer hukommelse)
  højde: { navn: 'jorden-hoejde-2k.png', kanaler: 2 }, // 16 bit i rød og grøn (se lav_billeder.py)
  hav: { navn: 'jorden-hav.png', kanaler: 1 }, // hvidt = hav (til Solens glimt)
  måne: { navn: 'maanen', størrelse: true, farve: true }, // LRO (CGI Moon Kit)
  måneHøjde: { navn: 'maanen-hoejde-1k.png', kanaler: 2 },
};
// Dagen i året midt i de fire måneder med dagbilleder (januar, april, juli og oktober)
const BILLEDDAGE = [15, 105, 196, 288];

const henter = new THREE.TextureLoader();
const hentede = new Map(); // filnavn → Promise med teksturen (eller null). De bliver i grafikkortet, så det går hurtigt at skifte fænomen.
function hentFil(fil, farve, kanaler) {
  if (!hentede.has(fil)) {
    hentede.set(fil, new Promise((klar) => {
      henter.load(MAPPE + fil, (t) => {
        t.colorSpace = farve ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        if (kanaler === 1) t.format = THREE.RedFormat;
        if (kanaler === 2) t.format = THREE.RGFormat;
        t.wrapS = THREE.RepeatWrapping; // kortet går hele vejen rundt
        t.anisotropy = verden.renderer ? Math.min(8, verden.renderer.capabilities.getMaxAnisotropy()) : 1;
        klar(t);
      }, undefined, () => klar(null));
    }));
  }
  return hentede.get(fil);
}
// Henter et billede (eller en liste af billeder). Giver null, hvis det ikke findes.
function hent(nøgle) {
  const b = BILLEDER[nøgle];
  if (!b) return Promise.resolve(null);
  const fil = (n) => (b.størrelse ? `${n}-${STØRRELSE}.jpg` : n);
  if (Array.isArray(b.navn)) {
    return Promise.all(b.navn.map((n) => hentFil(fil(n), b.farve, b.kanaler))).then((l) => (l.every(Boolean) ? l : null));
  }
  return hentFil(fil(b.navn), b.farve, b.kanaler);
}
// Til tests: venter, til alle billeder, der er spurgt efter, er hentet
export function billederHentet() {
  return Promise.all(hentede.values());
}

// ---------- Kort, der tegnes, hvis billederne mangler ----------
// Kortet over land og hav som tekstur (hav blåt, land grønt og brunt, is ved polerne). Laves kun én gang.
let jordKort = null;
function jordTekstur() {
  if (jordKort) return jordKort;
  const { bredde: B, højde: H, data } = LANDKORT;
  const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const c = document.createElement('canvas');
  c.width = B;
  c.height = H;
  const g = c.getContext('2d');
  const billede = g.createImageData(B, H);
  for (let y = 0; y < H; y++) {
    const breddegrad = 90 - (y + 0.5) * (180 / H);
    for (let x = 0; x < B; x++) {
      const i = y * B + x;
      const land = (bytes[i >> 3] >> (7 - (i & 7))) & 1;
      let farve;
      if (land) farve = Math.abs(breddegrad) > 64 ? [228, 236, 242] : Math.abs(breddegrad) < 35 ? [118, 132, 70] : [70, 126, 62];
      else farve = Math.abs(breddegrad) > 78 ? [210, 225, 238] : [22, 66, 140];
      billede.data.set([...farve, 255], i * 4);
    }
  }
  g.putImageData(billede, 0, 0);
  // Tegnet fire gange større med udglatning, så kysterne ikke bliver kantede
  const stor = document.createElement('canvas');
  stor.width = B * 4;
  stor.height = H * 4;
  const sg = stor.getContext('2d');
  sg.imageSmoothingEnabled = true;
  sg.imageSmoothingQuality = 'high';
  sg.drawImage(c, 0, 0, stor.width, stor.height);
  jordKort = new THREE.CanvasTexture(stor);
  jordKort.colorSpace = THREE.SRGBColorSpace;
  jordKort.wrapS = THREE.RepeatWrapping;
  return jordKort;
}

// Månens overflade: grå med mørke "have" (store sletter af størknet lava) på den side, der vender mod Jorden
let måneKort = null;
function måneTekstur() {
  if (måneKort) return måneKort;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#b8b8b4';
  g.fillRect(0, 0, 256, 128);
  // Havene (omtrent som på Månens forside, som vender mod Jorden: midten af kortet ved u = 0,25)
  g.fillStyle = 'rgba(70, 72, 78, 0.75)';
  for (const [x, y, r] of [[52, 46, 15], [70, 50, 9], [80, 60, 11], [92, 52, 7], [44, 64, 12], [36, 54, 10], [62, 70, 8], [86, 76, 6]]) {
    g.beginPath();
    g.ellipse(x, y, r * 1.3, r, 0, 0, Math.PI * 2);
    g.fill();
  }
  // Små kratere (faste, så Månen ser ens ud hver gang)
  let s = 7;
  const tilfældig = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 140; i++) {
    g.fillStyle = `rgba(90, 90, 92, ${0.15 + tilfældig() * 0.2})`;
    g.beginPath();
    g.arc(tilfældig() * 256, 10 + tilfældig() * 108, 1 + tilfældig() * 3, 0, Math.PI * 2);
    g.fill();
  }
  måneKort = new THREE.CanvasTexture(c);
  måneKort.colorSpace = THREE.SRGBColorSpace;
  måneKort.wrapS = THREE.RepeatWrapping;
  return måneKort;
}

// En sort 1 x 1-tekstur til de pladser i shaderen, hvor der endnu ikke er et billede
const tom = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
tom.needsUpdate = true;

// ---------- Shaderne (små programmer, der regner farven ud for hvert punkt på kuglen) ----------
// Fælles GLSL: hvor stor en del af Solen er dækket af en kugle, set fra punktet p (samme som dækket() i skygge.js)
const SKYGGE_GLSL = `
  uniform vec3 solPos;
  uniform float solR;
  float overlapAreal(float a, float b, float c) {
    if (c >= a + b) return 0.0;
    if (c <= abs(a - b)) return 3.14159265 * min(a, b) * min(a, b);
    float x = acos(clamp((c * c + a * a - b * b) / (2.0 * c * a), -1.0, 1.0));
    float y = acos(clamp((c * c + b * b - a * a) / (2.0 * c * b), -1.0, 1.0));
    return a * a * x + b * b * y - 0.5 * sqrt(max(0.0, (-c + a + b) * (c + a - b) * (c - a + b) * (c + a + b)));
  }
  float daekket(vec3 p, vec3 pos, float r) {
    if (r <= 0.0) return 0.0;
    vec3 ds = solPos - p;
    vec3 dm = pos - p;
    float ls = length(ds), lm = length(dm);
    if (lm >= ls) return 0.0;
    float a = asin(min(1.0, solR / ls));
    float b = asin(min(1.0, r / lm));
    float c = atan(length(cross(ds, dm)), dot(ds, dm));
    return overlapAreal(a, b, c) / (3.14159265 * a * a);
  }`;

// Fælles GLSL: retningerne øst og nord på kuglen og bjergenes skrå sider ud fra et højdekort.
// Kortet ligger på kuglen, så u går mod øst (1 i u = en hel omgang) og v mod nord (1 i v = en halv omgang).
const RELIEF_GLSL = `
  const float OMGANG = 6.2831853; // en hel omgang i radianer
  // n er retningen ud fra kuglens midte (i kuglens egne retninger, hvor +y er nord)
  void retninger(vec3 n, out vec3 oest, out vec3 nord, out float cosB) {
    oest = vec3(n.z, 0.0, -n.x);
    cosB = length(oest);
    oest = cosB > 1e-4 ? oest / cosB : vec3(0.0, 0.0, -1.0);
    nord = cross(n, oest);
  }
  // Retningen ud fra overfladen med bjergene (styrke gør dem højere end i virkeligheden, ellers kunne man ikke se dem)
  // Højden er gemt med 16 bit: den store del i rød og den lille del i grøn
  float hoejdeVed(sampler2D h, vec2 uv) {
    vec2 v = texture2D(h, uv).rg;
    return v.x * (65280.0 / 65535.0) + v.y * (255.0 / 65535.0);
  }
  vec3 relief(sampler2D h, vec2 uv, vec2 texel, float styrke, vec3 n, vec3 oest, vec3 nord, float cosB) {
    float dO = hoejdeVed(h, uv + vec2(texel.x, 0.0)) - hoejdeVed(h, uv - vec2(texel.x, 0.0));
    float dN = hoejdeVed(h, uv + vec2(0.0, texel.y)) - hoejdeVed(h, uv - vec2(0.0, texel.y));
    dO /= 2.0 * texel.x * OMGANG * max(cosB, 0.15);
    dN /= texel.y * OMGANG;
    return normalize(n - styrke * (dO * oest + dN * nord));
  }`;

const VERTEX = `
  varying vec2 vUv;
  varying vec3 vObjN;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vObjN = normalize(position);
    vec4 p = modelMatrix * vec4(position, 1.0);
    vPos = p.xyz;
    gl_Position = projectionMatrix * viewMatrix * p;
  }`;

// Jorden
const JORD_FRAGMENT = `
  uniform sampler2D dagA;
  uniform sampler2D dagB;
  uniform float dagMix;
  uniform sampler2D nat;
  uniform float harNat;
  uniform float natStyrke;
  uniform sampler2D skyer;
  uniform float harSkyer;
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform vec2 hoejdeTexel;
  uniform float reliefStyrke;
  uniform sampler2D hav;
  uniform float harHav;
  uniform mat3 rot;       // kuglens drejning (fra dens egne retninger til verdens)
  uniform vec3 solObj;    // retningen mod Solen i kuglens egne retninger
  uniform vec3 maanePos;
  uniform float maaneR;
  varying vec2 vUv;
  varying vec3 vObjN;
  varying vec3 vPos;
  ${SKYGGE_GLSL}
  ${RELIEF_GLSL}
  void main() {
    vec3 n0 = normalize(vObjN);
    vec3 oest, nord;
    float cosB;
    retninger(n0, oest, nord, cosB);
    vec3 N = normalize(rot * n0);
    vec3 S = normalize(solPos - vPos);
    vec3 V = normalize(cameraPosition - vPos);
    vec3 Nr = harHoejde > 0.5 ? normalize(rot * relief(hoejde, vUv, hoejdeTexel, reliefStyrke, n0, oest, nord, cosB)) : N;

    float l = dot(N, S);
    float dag = smoothstep(-0.06, 0.1, l) * (1.0 - daekket(vPos, maanePos, maaneR));
    // Lyset bliver rødligt tæt på grænsen mellem dag og nat, fordi det går en lang vej gennem luften (solnedgang)
    vec3 solFarve = mix(vec3(1.0, 0.62, 0.4), vec3(1.0), smoothstep(-0.04, 0.22, l));

    vec3 c = mix(texture2D(dagA, vUv).rgb, texture2D(dagB, vUv).rgb, dagMix);
    // Skyerne og deres skygge på jorden (skyen, der skygger, ligger lidt nærmere Solen)
    float sky = 0.0, skySkygge = 0.0;
    if (harSkyer > 0.5) {
      sky = smoothstep(0.12, 0.95, texture2D(skyer, vUv).r) * 0.85;
      vec2 motSol = vec2(dot(solObj, oest) / (OMGANG * max(cosB, 0.15)), 2.0 * dot(solObj, nord) / OMGANG);
      skySkygge = smoothstep(0.12, 0.95, texture2D(skyer, vUv + motSol * 0.004).r) * 0.85;
    }
    vec3 jord = c * (0.14 + 0.86 * max(dot(Nr, S), 0.0)) * (1.0 - 0.4 * skySkygge);
    vec3 skyLys = vec3(0.78) * (0.14 + 0.86 * max(l, 0.0));
    vec3 lys = mix(jord, skyLys, sky) * solFarve;

    // Solens glimt i havet: en bred, svag glans og en lille, skarp plet
    float havet = harHav > 0.5 ? texture2D(hav, vUv).r : 0.0;
    float nh = max(dot(N, normalize(S + V)), 0.0);
    float glimt = (pow(nh, 120.0) * 0.22 + pow(nh, 1500.0) * 0.9) * havet * (1.0 - sky) * smoothstep(0.0, 0.2, l);
    lys += solFarve * vec3(1.0, 0.93, 0.8) * glimt;

    // Luften: et blåt skær, der bliver stærkere ude mod kanten
    float kant = pow(1.0 - max(dot(N, V), 0.0), 2.5);
    lys = mix(lys, vec3(0.3, 0.52, 1.0) * mix(vec3(1.0), solFarve, 0.5), kant * 0.6);

    // Natten: svagt lys fra stjerner og Måne, og byernes lys, som tændes i tusmørket (og ses gennem tynde skyer)
    vec3 natFarve = c * 0.03 + vec3(0.003, 0.006, 0.016) + sky * 0.02;
    vec3 byer = harNat > 0.5 ? texture2D(nat, vUv).rgb * natStyrke * (1.0 - 0.7 * sky) : vec3(0.0);
    float byLys = 1.0 - smoothstep(-0.12, 0.04, l);
    gl_FragColor = vec4(mix(natFarve, lys, dag) + byer * byLys, 1.0);
  }`;

// Atmosfæren: en tynd skal uden om Jorden. For hvert punkt regnes, hvor tæt strålen fra kameraet kommer på Jorden.
// Luften bliver tyndere opad (skalahøjden H), så kanten er tydelig og forsvinder blødt ud i rummet.
const LUFT_FRAGMENT = `
  uniform vec3 midt;
  uniform float R;
  uniform float H;
  uniform float styrke;
  uniform vec3 solPos;
  varying vec3 vPos;
  void main() {
    vec3 d = normalize(vPos - cameraPosition);
    vec3 q = cameraPosition + d * dot(midt - cameraPosition, d); // stedet, hvor strålen er tættest på Jorden
    vec3 ud = q - midt;
    float p = length(ud);
    float taethed = exp(-max(p - R, 0.0) / H);
    float vinkel = dot(ud / p, normalize(solPos - q));
    float belyst = smoothstep(-0.3, 0.2, vinkel);
    // Luften spreder mest lys fremad, så den lyser kraftigt, når Solen står bag Jorden (modlys)
    float fremad = 1.0 + 3.0 * pow(max(dot(d, normalize(solPos - q)), 0.0), 6.0);
    vec3 farve = mix(vec3(1.0, 0.42, 0.18), vec3(0.32, 0.56, 1.0), smoothstep(-0.12, 0.3, vinkel));
    gl_FragColor = vec4(farve * taethed * belyst * fremad * styrke, 1.0);
  }`;
const LUFT_VERTEX = `
  varying vec3 vPos;
  void main() {
    vec4 p = modelMatrix * vec4(position, 1.0);
    vPos = p.xyz;
    gl_Position = projectionMatrix * viewMatrix * p;
  }`;

// Månen: lyset fra Solen og Jordens skygge. Helt inde i skyggen bliver den mørk kobberrød (lys bøjet gennem Jordens luft).
// Månens støv sender lyset mest tilbage, hvor det kom fra. Derfor er fuldmånen næsten lige lys over hele skiven
// (Lommel-Seeliger), og ikke mørkere ude mod kanten som en kugle af gips.
const MÅNE_FRAGMENT = `
  uniform sampler2D kort;
  uniform float forskydU;
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform vec2 hoejdeTexel;
  uniform float reliefStyrke;
  uniform mat3 rot;
  uniform vec3 jordPos;
  uniform float jordR;
  varying vec2 vUv;
  varying vec3 vObjN;
  varying vec3 vPos;
  ${SKYGGE_GLSL}
  ${RELIEF_GLSL}
  void main() {
    vec2 uv = vec2(vUv.x + forskydU, vUv.y);
    vec3 c = texture2D(kort, uv).rgb;
    vec3 n0 = normalize(vObjN);
    vec3 oest, nord;
    float cosB;
    retninger(n0, oest, nord, cosB);
    vec3 N = normalize(rot * n0);
    vec3 Nr = harHoejde > 0.5 ? normalize(rot * relief(hoejde, uv, hoejdeTexel, reliefStyrke, n0, oest, nord, cosB)) : N;
    vec3 S = normalize(solPos - vPos);
    vec3 V = normalize(cameraPosition - vPos);
    float i = max(dot(Nr, S), 0.0);
    float e = max(dot(N, V), 0.0);
    float ls = 2.0 * i / (i + e + 0.05);
    float l = dot(N, S);
    float skygge = daekket(vPos, jordPos, jordR);
    float dag = smoothstep(-0.03, 0.06, l);
    vec3 lys = c * (0.08 + mix(ls, i, 0.35)) * dag * (1.0 - skygge);
    vec3 roed = vec3(0.42, 0.11, 0.04) * dot(c, vec3(0.33)) * smoothstep(0.8, 1.0, skygge) * (0.3 + 0.7 * dag);
    gl_FragColor = vec4(lys + roed + c * 0.015, 1.0);
  }`;

// Sætter kuglens drejning (rot) og retningen mod Solen i kuglens egne retninger (solObj), lige før den tegnes
const midlertidig = new THREE.Vector3();
const verdensRot = new THREE.Matrix3();
function følgDrejning(kugle, materiale) {
  kugle.onBeforeRender = () => {
    const u = materiale.uniforms;
    verdensRot.setFromMatrix4(kugle.matrixWorld);
    u.rot.value.copy(verdensRot);
    if (u.solObj) {
      kugle.getWorldPosition(midlertidig);
      u.solObj.value.copy(u.solPos.value).sub(midlertidig).applyMatrix3(verdensRot.transpose()).normalize();
    }
  };
}

// Højdekort: en pixel i u og v
function texel(t) {
  return new THREE.Vector2(1 / t.image.width, 1 / t.image.height);
}

// Jorden. hældning i grader (aksen hælder mod +x). Giver grupper tilbage, så man kan flytte, dreje og sætte ting på kloden.
export function lavJorden(radius, { hældning = 23.44 } = {}) {
  const klode = new THREE.Group(); // flyttes rundt
  const hæld = new THREE.Group(); // aksen hælder og peger samme vej hele tiden
  hæld.rotation.z = -hældning * RAD;
  const omdrejning = new THREE.Group(); // drejer om aksen
  klode.add(hæld);
  hæld.add(omdrejning);
  const reserve = jordTekstur();
  const materiale = new THREE.ShaderMaterial({
    uniforms: {
      dagA: { value: reserve },
      dagB: { value: reserve },
      dagMix: { value: 0 },
      nat: { value: tom },
      harNat: { value: 0 },
      natStyrke: { value: 1.5 },
      skyer: { value: tom },
      harSkyer: { value: 0 },
      hoejde: { value: tom },
      harHoejde: { value: 0 },
      hoejdeTexel: { value: new THREE.Vector2(1, 1) },
      reliefStyrke: { value: 0.06 },
      hav: { value: tom },
      harHav: { value: 0 },
      rot: { value: new THREE.Matrix3() },
      solObj: { value: new THREE.Vector3(1, 0, 0) },
      solPos: { value: new THREE.Vector3() },
      solR: { value: 1 },
      maanePos: { value: new THREE.Vector3() },
      maaneR: { value: 0 },
    },
    vertexShader: VERTEX,
    fragmentShader: JORD_FRAGMENT,
  });
  const u = materiale.uniforms;
  const kugle = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 64), materiale);
  følgDrejning(kugle, materiale);
  omdrejning.add(kugle);

  // Atmosfæren (en tynd skal) og et svagt skær, så Jorden også lyser lidt, når den er lille på skærmen
  const H = radius * 0.012;
  const luftMat = new THREE.ShaderMaterial({
    uniforms: { midt: { value: new THREE.Vector3() }, R: { value: radius }, H: { value: H }, styrke: { value: 0.9 }, solPos: u.solPos },
    vertexShader: LUFT_VERTEX,
    fragmentShader: LUFT_FRAGMENT,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const luft = new THREE.Mesh(new THREE.SphereGeometry(radius + 7 * H, 96, 64), luftMat);
  luft.onBeforeRender = () => luft.getWorldPosition(luftMat.uniforms.midt.value);
  klode.add(luft);
  klode.add(glød(new THREE.Color(0.35, 0.6, 1.2), radius * 2.7, 0.14));

  // Billederne skiftes ind, når de er hentet
  let dagKort = null;
  let dato = dagIDag();
  hent('hav').then((t) => { if (t) { u.hav.value = t; u.harHav.value = 1; } });
  hent('dag').then((l) => { if (l) { dagKort = l; sætDato(dato); } });
  hent('nat').then((t) => { if (t) { u.nat.value = t; u.harNat.value = 1; } });
  hent('skyer').then((t) => { if (t) { u.skyer.value = t; u.harSkyer.value = 1; } });
  hent('højde').then((t) => { if (t) { u.hoejde.value = t; u.hoejdeTexel.value.copy(texel(t)); u.harHoejde.value = 1; } });

  // Årstiderne: dagbilledet glider fra måned til måned (fx sne om vinteren). dag er dagen i året (1-365).
  function sætDato(dag) {
    dato = dag;
    if (!dagKort) return;
    const d = ((dag - BILLEDDAGE[0]) % 365 + 365) % 365 + BILLEDDAGE[0];
    let a = BILLEDDAGE.length - 1;
    while (a > 0 && d < BILLEDDAGE[a]) a--;
    const b = (a + 1) % BILLEDDAGE.length;
    const fra = BILLEDDAGE[a], til = b === 0 ? BILLEDDAGE[0] + 365 : BILLEDDAGE[b];
    u.dagA.value = dagKort[a];
    u.dagB.value = dagKort[b];
    u.dagMix.value = (d - fra) / (til - fra);
  }

  // En cirkel på Jorden ved en bestemt breddegrad (fx ækvator og polarcirklerne)
  function breddeCirkel(bredde, farve, opacitet) {
    const punkter = [];
    const r = radius * 1.004 * Math.cos(bredde * RAD);
    const y = radius * 1.004 * Math.sin(bredde * RAD);
    for (let i = 0; i <= 96; i++) punkter.push(new THREE.Vector3(Math.cos((i / 96) * Math.PI * 2) * r, y, Math.sin((i / 96) * Math.PI * 2) * r));
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(punkter), new THREE.LineBasicMaterial({ color: farve, transparent: true, opacity: opacitet, depthWrite: false }));
  }
  // Solen og (hvis der er en) Månen, som kaster skygge
  function sætLys(solPos, solR, maanePos = null, maaneR = 0) {
    u.solPos.value.copy(solPos);
    u.solR.value = solR;
    if (maanePos) u.maanePos.value.copy(maanePos);
    u.maaneR.value = maaneR;
  }
  return { klode, hældning: hæld, omdrejning, materiale, breddeCirkel, sætLys, sætDato };
}

// Månen. Den samme side vender altid mod Jorden (kald vend(jordPos) hvert billede).
export function lavMånen(radius) {
  const gruppe = new THREE.Group();
  const materiale = new THREE.ShaderMaterial({
    uniforms: {
      kort: { value: måneTekstur() },
      forskydU: { value: 0 },
      hoejde: { value: tom },
      harHoejde: { value: 0 },
      hoejdeTexel: { value: new THREE.Vector2(1, 1) },
      reliefStyrke: { value: 0.035 },
      rot: { value: new THREE.Matrix3() },
      solPos: { value: new THREE.Vector3() },
      solR: { value: 1 },
      jordPos: { value: new THREE.Vector3() },
      jordR: { value: 1 },
    },
    vertexShader: VERTEX,
    fragmentShader: MÅNE_FRAGMENT,
  });
  const u = materiale.uniforms;
  const kugle = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 40), materiale);
  følgDrejning(kugle, materiale);
  gruppe.add(kugle);
  // Et rigtigt kort har Månens forside midt i billedet (u = 0,5). Det tegnede har den ved u = 0,25 (retningen +z i kuglen).
  hent('måne').then((t) => { if (t) { u.kort.value = t; u.forskydU.value = 0.25; } });
  hent('måneHøjde').then((t) => { if (t) { u.hoejde.value = t; u.hoejdeTexel.value.copy(texel(t)); u.harHoejde.value = 1; } });

  function sætLys(solPos, solR, jordPos, jordR) {
    u.solPos.value.copy(solPos);
    u.solR.value = solR;
    u.jordPos.value.copy(jordPos);
    u.jordR.value = jordR;
  }
  // Forsiden (retningen +z i kuglen) vender mod Jorden
  function vend(jordPos) {
    gruppe.lookAt(jordPos);
  }
  return { måne: gruppe, materiale, sætLys, vend };
}

// Et punkt på Jordens overflade (samme retninger som kortet på kuglen: længde 0 peger mod +x, 90° øst mod -z)
export function overflade(bredde, længde, r) {
  const b = bredde * RAD, l = længde * RAD;
  return new THREE.Vector3(Math.cos(b) * Math.cos(l) * r, Math.sin(b) * r, -Math.cos(b) * Math.sin(l) * r);
}
