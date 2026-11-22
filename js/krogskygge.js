// Skygge i krogene (ambient occlusion, G4, 22. november 2026, docs/plan-grafik.md). Hvor ting står tæt (nukleonerne i
// kernen, ionerne i saltkrystallen), når mindre lys ind udefra, så krogene bliver mørkere. Det giver dybde og tyngde.
// Three.js' GTAOPass tegner scenens retninger og dybde én gang til (i fuld opløsning) og regner skyggen ud fra dem i halv
// opløsning. Den lægges oven i billedet lige efter tegningen af scenen, før gløden og kantudglatningen.
//
// Kun på de skærme, der vælger det: brugKrogskygge({ radius }) i skærmens start og brugKrogskygge(null) i dens stop.
// Ikke på planeter set udefra og rummet (der er næsten intet tæt på hinanden, så den ses ikke, men koster det samme).
// Pc: altid (værn: under 40 billeder/s i 4 s → slukket resten af besøget på skærmen). Touch: kun i kvalitetstrinnet Høj,
// aldrig i Basis. Testene, der tegner hurtigt (TEST_HURTIG), tegner uden komponist, så der sker intet.
import * as THREE from 'three';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { verden, LAV_KVALITET, TEST_HURTIG, kvalitetstrin } from './scene3d.js';

// Skyggen regnes i halv bredde og højde (en fjerdedel af punkterne). atomlabAOSkala: kun til at prøve andre i et værktøj.
const SKALA = globalThis.atomlabAOSkala ?? 0.5;
const PRØVER = LAV_KVALITET ? 8 : 16; // retninger pr. punkt (GTAO) og punkter i udglatningen bagefter
const VÆRN = !LAV_KVALITET && !new URLSearchParams(location.search).has('test');
const VÆRN_FPS = 40;

// Kun uigennemsigtige net giver skygge. Glød, prikker, linjer, sprites og gennemsigtige skaller (fx elektronskyen) skjules,
// mens retningerne og dybden tegnes (GTAOPass skjuler selv kun prikker og linjer). Et objekt med userData.udenKrogskygge
// skjules også.
function giverSkygge(o) {
  if (o.isPoints || o.isLine || o.isLine2 || o.isSprite || o.userData.udenKrogskygge) return false;
  if (!o.isMesh) return true;
  const m = o.material;
  return !Array.isArray(m) && !m.transparent && m.depthWrite !== false && m.visible !== false;
}

// Skyggen lægges oven i billedet (gange) med en blanding, der ser på dybden: For hvert punkt i fuld opløsning tælles kun
// de fire nærmeste punkter i skyggen (halv opløsning) med, som ligger i samme dybde. Med Three.js' egen blanding (en
// almindelig udtværing) smittede skyggen fra kuglerne bagved ud over kanten på kuglerne foran, så kanterne blev "pelsede".
const BLANDING = /* glsl */`
  #include <packing>
  uniform sampler2D tDiffuse; // skyggen (halv opløsning)
  uniform sampler2D tDepth;   // dybden (fuld opløsning)
  uniform vec2 aoStr;         // skyggens størrelse i punkter
  uniform float intensity;
  uniform float cameraNear;
  uniform float cameraFar;
  varying vec2 vUv;
  float afstand(vec2 uv) { return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, cameraNear, cameraFar); }
  void main() {
    float d0 = afstand(vUv);
    vec2 p = vUv * aoStr - 0.5;
    vec2 b = floor(p);
    vec2 f = p - b;
    vec3 sum = vec3(0.0);
    float vaegt = 0.0;
    for (int j = 0; j < 2; j++) {
      for (int i = 0; i < 2; i++) {
        vec2 uv = (b + vec2(float(i), float(j)) + 0.5) / aoStr;
        float w = (i == 0 ? 1.0 - f.x : f.x) * (j == 0 ? 1.0 - f.y : f.y);
        w *= exp(-abs(afstand(uv) - d0) / (0.02 * d0)) + 1e-4;
        sum += texture2D(tDiffuse, uv).rgb * w;
        vaegt += w;
      }
    }
    gl_FragColor = vec4(mix(vec3(1.0), sum / vaegt, intensity), 1.0);
  }`;

class Krogskygge extends GTAOPass {
  constructor(...a) {
    super(...a);
    const m = this.blendMaterial;
    m.fragmentShader = BLANDING;
    Object.assign(m.uniforms, { tDepth: { value: this.depthTexture }, aoStr: { value: new THREE.Vector2(1, 1) }, cameraNear: { value: 0.1 }, cameraFar: { value: 1000 } });
  }
  // Dybden og retningerne tegnes i fuld opløsning (til blandingen), skyggen og udglatningen i halv
  setSize(b, h) {
    const lb = Math.max(1, Math.round(b * SKALA)), lh = Math.max(1, Math.round(h * SKALA));
    super.setSize(lb, lh);
    this.normalRenderTarget.setSize(b, h);
    this.blendMaterial.uniforms.aoStr.value.set(lb, lh);
  }
  render(renderer, skriv, læs) {
    const u = this.blendMaterial.uniforms;
    u.cameraNear.value = this.camera.near;
    u.cameraFar.value = this.camera.far;
    super.render(renderer, skriv, læs);
  }
  _overrideVisibility() {
    const skjulte = this._visibilityCache;
    this.scene.traverse((o) => {
      if (o.visible && !giverSkygge(o)) { o.visible = false; skjulte.push(o); }
    });
  }
}

// Til kernerne (Værkstedet og Reaktorens del 1): radius lidt over en nukleons (0,5), så revnerne mellem kuglerne bliver mørkere
export const KERNE_SKYGGE = { radius: 0.7, styrke: 1 };

let pas = null;
let valg = null; // det, skærmen har valgt (null = slukket)
const værn = { tid: 0, billeder: 0, sidst: 0, slukket: false };

function lavPas() {
  const { scene, kamera } = verden;
  pas = new Krogskygge(scene, kamera, 4, 4, undefined, { samples: PRØVER }, { samples: PRØVER, rings: 2 });
  return pas;
}

// valg: { radius, styrke, når } (radius i scenens enheder: hvor langt væk noget kan skygge, styrke 0-1, når(): kun når
// den giver sand) eller null = slukket.
export function brugKrogskygge(nyt) {
  const { komponist } = verden;
  if (!komponist || TEST_HURTIG) return;
  valg = nyt;
  værn.tid = værn.billeder = værn.sidst = 0;
  værn.slukket = false;
  if (!valg) {
    if (pas && komponist.passes.includes(pas)) {
      komponist.removePass(pas);
      pas.setSize(1, 1); // lagene frigives i grafikkortet (shaderne beholdes til næste gang)
    }
    verden.opdateringer.delete(vogt);
    return;
  }
  pas ??= lavPas();
  pas.updateGtaoMaterial({ radius: valg.radius ?? 0.6, thickness: valg.tykkelse ?? 1, distanceExponent: 1, scale: 1 });
  pas.blendIntensity = valg.styrke ?? 1;
  if (!komponist.passes.includes(pas)) komponist.insertPass(pas, 1); // lige efter tegningen af scenen (RenderPass)
  pas.enabled = må() && (valg.når?.() ?? true);
  if (!pas.enabled && !forvarmet) forvarm();
  verden.opdateringer.add(vogt);
}

const må = () => !værn.slukket && (!LAV_KVALITET || kvalitetstrin() === 'høj');

// Hvert billede: Slår skyggen til og fra med kvalitetstrinnet (touch), værnet (pc) og skærmens når() (fx kun, mens
// saltkrystallen vises)
function vogt() {
  const til = må() && (valg.når?.() ?? true);
  if (pas.enabled !== til) pas.enabled = til;
  if (!VÆRN || !til) return;
  const nu = performance.now();
  const dt = (nu - værn.sidst) / 1000;
  værn.sidst = nu;
  if (dt > 0.5) { værn.tid = værn.billeder = 0; return; } // et ryk eller en skjult fane tæller ikke
  værn.tid += dt;
  værn.billeder++;
  if (værn.tid < 4) return;
  const fps = værn.billeder / værn.tid;
  værn.tid = værn.billeder = 0;
  if (fps < VÆRN_FPS) {
    værn.slukket = true;
    pas.enabled = false;
    globalThis.atomlabMåler?.(`Skygge i krogene slået fra (${fps.toFixed(0)} billeder/s)`);
  }
}

// På touch i Basis tegnes skyggen ikke, så dens shadere ville først blive lavet ved skiftet til Høj (et ryk). Derfor
// tegnes den én gang i et lille billede (4 × 4), lige før komponisten tegner (som SMAA i scene3d.js).
let forvarmet = false;
function forvarm() {
  const varm = () => {
    verden.opdateringer.delete(varm);
    if (!pas || forvarmet) return;
    forvarmet = true;
    const { renderer } = verden;
    const før = renderer.getRenderTarget();
    const læs = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
    const skriv = læs.clone();
    const { _width: b, _height: h, _pixelRatio: pr } = verden.komponist;
    pas.setSize(4, 4);
    try { pas.render(renderer, skriv, læs); } finally {
      pas.setSize(b * pr, h * pr); // (lagene laves igen i den rigtige størrelse ved brug)
      renderer.setRenderTarget(før);
      læs.dispose();
      skriv.dispose();
    }
  };
  verden.opdateringer.add(varm);
}

// Til testene og måleren
export const valgtNu = () => valg;
export const krogskygge = () => ({
  til: !!pas?.enabled && !!verden.komponist?.passes.includes(pas),
  valgt: !!valg,
  plads: pas ? verden.komponist.passes.indexOf(pas) : -1,
  bredde: pas?.width ?? 0,
});
