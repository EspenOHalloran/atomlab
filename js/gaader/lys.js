// Lysene for gåderne (G4a, docs/plan-gaader-3d.md, tabellen "Gåderne"): enkle lys med en form, man kan kende, ikke små
// animationer. Indtil en gåde får sin egen scene, står dens lys stort bag kortet (js/gaader/scene.js), og i G4b står de
// langs skinnen. lavLys(id) giver { gruppe, opdater(dt, tid) } eller null for en ukendt gåde. Lysene er symboler, ikke i skala.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG, verden, skærmLoft, nyeShadere } from '../scene3d.js';
import { glød, prikTekstur } from '../kosmos/faelles.js';
import { fuld, stiplet } from './streg.js';
import { lavLinse, LINSE_KVALITET, LINSE_PC } from '../kosmos/linse.js';
import { lavShadereFørst } from '../solsystem/shadere.js';

const prikker = (antal, størrelse) => {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(antal * 3);
  const farve = new Float32Array(antal * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(farve, 3));
  const p = new THREE.Points(geo, new THREE.PointsMaterial({
    size: størrelse, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  return { p, pos, farve };
};

// En glødende streg (20. november 2026, lamperne som én familie): den skarpe streg og under den en bred, svag udgave i
// samme farve, så stregerne lyser som kuglerne i de andre lamper og ikke ser tynde og tegnede ud på skinnen.
// Stadig fuld farve (målt), så betydningen af stregerne i streg.js er den samme.
function neon(punkter, farve, { bredde = 2.5, ...valg } = {}) {
  const g = new THREE.Group();
  const svag = farve.clone().multiplyScalar(0.16); // svag, for stykkerne lægges oven i hinanden i hjørnerne (additivt)
  g.add(fuld(punkter, svag, { ...valg, bredde: bredde * 3.4 }), fuld(punkter, farve, { ...valg, bredde }));
  return g;
}

const LYS = {
  // Et par, der bliver til et glimt: to partikler kredser om hinanden, mødes og lyser op, og så kommer et nyt par
  antistof() {
    const g = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.3, 20, 14);
    const a = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xffb340, emissive: 0xffb340, emissiveIntensity: 0.8 }));
    const b = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x52d9ff, emissive: 0x52d9ff, emissiveIntensity: 0.8 }));
    const glimt = glød(new THREE.Color(1.5, 1.4, 1.2), 2.4, 0);
    g.add(a, b, glimt);
    return {
      gruppe: g,
      opdater(dt, tid) {
        const f = (tid / 3) % 1; // ét par hvert 3. sekund
        const r = 1.6 * Math.max(0, 1 - f / 0.8);
        const v = tid * 2.4;
        a.position.set(Math.cos(v) * r, Math.sin(v) * r * 0.5, 0);
        b.position.set(-a.position.x, -a.position.y, 0);
        a.visible = b.visible = f < 0.8;
        glimt.material.opacity = f < 0.8 ? 0 : (ROLIG ? 0.5 : 0.8) * Math.sin(((f - 0.8) / 0.2) * Math.PI) ** 2; // et kort glimt
      },
    };
  },

  // En kolbe med et lyn (Millers forsøg)
  begyndelsen() {
    const g = new THREE.Group();
    const glas = new THREE.Color(0.55, 0.8, 0.95);
    const profil = [];
    for (let i = 0; i <= 48; i++) {
      const a = Math.PI / 2 + 0.38 + (i / 48) * (Math.PI * 2 - 0.76); // åben foroven, hvor halsen sidder
      profil.push([Math.cos(a) * 1.5, Math.sin(a) * 1.5 - 0.6, 0]);
    }
    const hals = Math.sin(0.38) * 1.5;
    const halsBund = Math.cos(0.38) * 1.5 - 0.6;
    const venstre = [[-hals, halsBund, 0], [-hals, 2.1, 0]];
    const højre = [[hals, halsBund, 0], [hals, 2.1, 0]];
    g.add(neon(profil, glas), neon(venstre, glas), neon(højre, glas));
    // Vandet: bunden af kuglen under en vandret overflade
    const form = new THREE.Shape();
    const v0 = Math.PI + 0.45;
    form.absarc(0, 0, 1.42, v0, Math.PI * 2 - 0.45, false);
    form.lineTo(Math.cos(v0) * 1.42, Math.sin(v0) * 1.42);
    const vand = new THREE.Mesh(new THREE.ShapeGeometry(form, 24), new THREE.MeshBasicMaterial({ color: 0x1d4a6a, transparent: true, opacity: 0.6 }));
    vand.position.y = -0.6;
    g.add(vand);
    const lyn = neon([[-0.2, 1.6, 0], [0.25, 0.7, 0], [-0.15, 0.3, 0], [0.3, -0.5, 0]], new THREE.Color(1.6, 1.5, 0.9), { bredde: 3 });
    g.add(lyn);
    return {
      gruppe: g,
      opdater(dt, tid) {
        // Med "Reducer bevægelse" lyser lynet roligt i stedet for at blinke
        const f = tid % 2.2;
        lyn.visible = ROLIG || f < 0.12 || (f > 0.2 && f < 0.28);
      },
    };
  },

  // Et blåt lys blandt mange hvide
  liv() {
    const g = new THREE.Group();
    const N = LAV_KVALITET ? 180 : 300;
    const { p, pos, farve } = prikker(N, 0.16);
    for (let i = 0; i < N; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(1.2 + Math.random() * 2);
      pos.set([v.x, v.y, v.z], i * 3);
      const l = 0.5 + Math.random() * 0.5;
      farve.set([l, l, l * 1.05], i * 3);
    }
    const blå = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), new THREE.MeshStandardMaterial({ color: 0x3d8bff, emissive: 0x3d8bff, emissiveIntensity: 0.9 }));
    g.add(p, blå, glød(new THREE.Color(0.25, 0.5, 1.4), 2, 0.6));
    return { gruppe: g, opdater(dt) { p.rotation.y += dt * 0.05; } };
  },

  // Det sorte hul: samme lysbøjning som i Kosmos (js/kosmos/linse.js), tegnet i et lille billede for sig (se lavSortHul)
  sorthul: () => lavSortHul(),

  // En spiralgalakse (uden glorie: Det mørke stof kan ikke ses)
  // En stiplet klode og aflange baner (Planet 9): fire lange baner i guld, der alle kommer tættest på Solen i samme side,
  // og et bud på planeten (stiplet klode og bane) den modsatte vej. Det hele drejer langsomt.
  planet9() {
    const g = new THREE.Group();
    const drej = new THREE.Group();
    g.add(drej);
    const sol = new THREE.Vector3(0.7, 0, 0);
    const guld = new THREE.Color(1.0, 0.76, 0.36);
    const ellipse = (a, e, vinkel, n = 72) => {
      const p = [];
      const b = a * Math.sqrt(1 - e * e);
      for (let k = 0; k <= n; k++) {
        const t = (k / n) * Math.PI * 2;
        const x = a * (Math.cos(t) - e), y = b * Math.sin(t);
        p.push([sol.x + x * Math.cos(vinkel) - y * Math.sin(vinkel), sol.y + x * Math.sin(vinkel) + y * Math.cos(vinkel), 0]);
      }
      return p;
    };
    // De små kloders baner: perihelium til højre (vinkel 0 ± lidt), resten af banen langt ude til venstre
    for (const [a, e, v] of [[1.55, 0.86, 0.25], [1.4, 0.82, -0.2], [1.75, 0.88, 0.05], [1.3, 0.8, 0.5]]) {
      drej.add(neon(ellipse(a, e, Math.PI + v), guld, { bredde: 2 }));
    }
    // Planet 9's bud: perihelium mod venstre, så det fjerneste punkt står til højre
    drej.add(stiplet(ellipse(0.95, 0.29, Math.PI), { bredde: 1.8, streg: 0.18, mellem: 0.12 }));
    const klode = [];
    const kx = sol.x + 0.95 * 1.29;
    for (let k = 0; k <= 32; k++) { const t = (k / 32) * Math.PI * 2; klode.push([kx + Math.cos(t) * 0.32, Math.sin(t) * 0.32, 0]); }
    drej.add(stiplet(klode, { bredde: 2.2, streg: 0.1, mellem: 0.08 }));
    const s = glød(new THREE.Color(1.5, 1.2, 0.7), 0.7, 0.9);
    s.position.copy(sol);
    drej.add(s);
    drej.position.x = -0.6;
    return { gruppe: g, opdater(dt) { if (!ROLIG) drej.rotation.z += dt * 0.08; } };
  },

  moerktstof() {
    const g = new THREE.Group();
    const N = LAV_KVALITET ? 900 : 1600;
    const { p, pos, farve } = prikker(N, 0.11);
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const arm = i % 2;
      const r = 0.15 + Math.pow(Math.random(), 0.8) * 2.6;
      const a = arm * Math.PI + Math.log(r + 0.3) * 2.4 + (Math.random() - 0.5) * 0.6;
      pos.set([Math.cos(a) * r, (Math.random() - 0.5) * 0.12, Math.sin(a) * r], i * 3);
      c.setHSL(r < 0.7 ? 0.11 : 0.6, 0.5, 0.75 - r * 0.1);
      farve.set([c.r, c.g, c.b], i * 3);
    }
    const vippet = new THREE.Group(); // vippet mod kameraet, så den drejer om sin egen akse
    vippet.rotation.x = 0.9;
    vippet.add(p);
    g.add(vippet, glød(new THREE.Color(1, 0.85, 0.6), 1.4, 0.5));
    return { gruppe: g, opdater(dt) { p.rotation.y += dt * 0.12; } };
  },

  // Hvor stopper kvanteverdenen? (Kvantefysik PR 3): en bagvæg, hvor prikker lander én ad gangen og bliver til striber,
  // som på bænken i Kvantefysik. Prikkerne trækkes efter cos²·sinc² (samme form som js/data/kvante.js) med et fast frø.
  // Hvert 12. sekund starter det forfra. Med "Reducer bevægelse" står alle prikkerne fremme.
  kvante() {
    const g = new THREE.Group();
    const N = LAV_KVALITET ? 700 : 1200;
    const { p, pos, farve } = prikker(N, 0.1);
    let frø = 7;
    const tal = () => (frø = (frø * 16807) % 2147483647) / 2147483647;
    const sinc2 = (b) => (Math.abs(b) < 1e-6 ? 1 : (Math.sin(b) / b) ** 2);
    for (let i = 0; i < N; i++) {
      let x = 0;
      for (let forsøg = 0; forsøg < 200; forsøg++) {
        x = (tal() * 2 - 1) * 2.4;
        if (tal() < Math.cos((Math.PI * x) / 0.7) ** 2 * sinc2((Math.PI * x) / 2.1)) break;
      }
      pos.set([x, (tal() - 0.5) * 3, 0], i * 3);
      farve.set([0.45, 0.9, 1.4], i * 3);
    }
    const kant = new THREE.Color(0.35, 0.6, 1.0);
    g.add(p, neon([[-2.7, -1.75, 0], [2.7, -1.75, 0], [2.7, 1.75, 0], [-2.7, 1.75, 0], [-2.7, -1.75, 0]], kant, { bredde: 2 }));
    g.add(glød(new THREE.Color(0.4, 0.8, 1.2), 1.6, 0.12));
    let vist = N;
    return {
      gruppe: g,
      opdater(dt, tid) {
        vist = ROLIG ? N : Math.floor(N * Math.min(1, (tid % 12) / 9));
        p.geometry.setDrawRange(0, vist);
      },
      test: () => ({ prikker: N, vist }),
    };
  },
};

// ---------- Det sorte hul med linsen ----------
// Linsen fra Kosmos tegner hullet, skiven og fotonringen i et lille lag (højst 512 px på pc og 320 px på tablet, efter
// lampens størrelse på skærmen) set fra den retning, kameraet ser lampen fra. Billedet ligger på en flade, der altid
// vender mod kameraet, så hullet ser rigtigt ud, når kameraet drejer om det. Himlen i linsens billede er gennemsigtig
// (dybden 400 = himmel), så skinnens egen himmel ses bag hullet, undtagen fotonringen og lyse stjerner og en blød cirkel
// om hullet, hvor linsens egen mørke, bøjede himmel ses (22. november 2026: før skinnede lampens farveskær igennem dér, så
// det så brunt og kantet ud). Kanten regnes af 5 opslag, så den er blød. Scenen Sort hul bruger ikke lampen, men linsen
// over hele billedet (js/gaader/sorthul.js).
// Laget tegnes kun, når lampen kan ses, og højst 30 gange i sekundet på tablet. Er billederne for langsomme (under 40 i sekundet på tablet), står billedet
// stille og tegnes kun igen, når kameraet har flyttet sig. Snyd: Lampen er et symbol, ikke i skala, og den bøjede
// stjernehimmel om hullet er skåret væk.
// Skarp på touch (22. november 2026, målt på Samsung A56: 120 billeder/s med loftet 320 px, så hullet var et lille
// billede trukket op): Har telefonen eller tabletten mindst 90 % af skærmens loft i 3 s, mens lampen ses, tegnes hullet
// som på pc (højst 512 px) og 60 gange i sekundet. Falder den bagefter under 75 % af loftet, går den tilbage og bliver
// dér resten af besøget. De første sekunder og tiden lige efter nye shadere tæller ikke (nyeShadere).
// Et gear mere (samme dag, efter målingen med 120 billeder/s og værst 12 ms): Op til 768 px (hullet fylder ca. 700 px på
// A56), og har enheden klaret skarp før (atomlabLinseSkarp), får linsen pc'ens shader (4 oktaver, 3 stjernelag, 170
// skridt) fra start. Går den tilbage, laves linsen om med touch-shaderen, og det huskes. Shaderne laves på forhånd.
const LINSE_AFSTAND = 45; // kameraet i linsens rum (M = 0,75, skiven går ud til 15)
const LINSE_HALV = 16.5; // så meget af linsens rum, billedet viser til hver side
const LAMPE_HALV = 3.2; // flade til hver side i lampens rum (lysene er bygget med radius ca. 3)
const LINSE_HØJST = LAV_KVALITET ? 320 : 512;
const LINSE_HYPPIGHED = LAV_KVALITET ? 1 / 30 : 0;
const SKARP = { højst: 768, hyppighed: 1 / 60, op: 0.9, ned: 0.75, frys: 40, måleTid: 3 };
const SKARP_GEMT = 'atomlabLinseSkarp'; // '1': enheden klarede skarp sidst, '0': den måtte gå tilbage
function læsSkarp() { try { return localStorage.getItem(SKARP_GEMT) === '1'; } catch { return false; } }
function gemSkarp(til) { try { localStorage.setItem(SKARP_GEMT, til ? '1' : '0'); } catch { /* (privat vindue) */ } }
// Fælles for alle lamper med hullet (skinnen og scenen Sort hul), så målingen huskes, når man går fra den ene til den
// anden. pc: linsen bruger pc'ens shader (kun touch, der har klaret skarp før).
const touchPc = LAV_KVALITET && læsSkarp();
const touchLinse = { skarp: touchPc, låst: false, pc: touchPc };
const linseKvalitet = () => (touchLinse.pc ? LINSE_PC : LINSE_KVALITET);
// Næste tilstand ud fra billeder/s i en måling og skærmens loft. Giver 'skarp', 'tilbage', 'frys' eller null (ingen ændring).
export function linseSkift({ skarp, låst }, fps, loft) {
  if (skarp) return fps < SKARP.ned * loft ? 'tilbage' : null;
  if (!låst && fps >= SKARP.op * loft) return 'skarp';
  return fps < SKARP.frys ? 'frys' : null;
}
const LINSE_HÆLDNING = 0.16; // skiven vippes lidt mod kameraet, så buen over skyggen ses tydeligt fra skinnen
const INGEN_DYBDE = 400; // som i linse.js: der, hvor der kun er himmel

const LAMPE_VERTEX = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const LAMPE_FRAGMENT = /* glsl */ `
uniform sampler2D tLinse;
uniform float uNaer;
uniform vec2 uTexel;
varying vec2 vUv;
// Dybden er afstanden til skiven eller hullet, og 400 hvor der kun er himmel
float daekker(vec2 uv) {
  return clamp((INGEN_DYBDE - texture2D(tLinse, uv).a) / (INGEN_DYBDE - uNaer), 0.0, 1.0);
}
void main() {
  vec4 l = texture2D(tLinse, vUv);
  // Kanten mellem skiven og himlen: gennemsnittet af 5 opslag (midten og 1,5 pixel til hver side), så den er blød
  // og uden trappetrin
  vec2 d = uTexel * 1.5;
  float a = (2.0 * daekker(vUv) + daekker(vUv + vec2(d.x, 0.0)) + daekker(vUv - vec2(d.x, 0.0))
    + daekker(vUv + vec2(0.0, d.y)) + daekker(vUv - vec2(0.0, d.y))) / 6.0;
  float r = length(vUv - 0.5) * 2.0;
  // Om hullet ses linsens egen mørke, bøjede himmel (skyggen er 0,24 fra midten, skivens inderkant ca. 0,27)
  a = max(a, 1.0 - smoothstep(0.4, 0.62, r));
  // Fotonringen og de bøjede stjerner er lys, der slap væk til himlen. De bliver stående, når de er lyse nok, og toner
  // ud mod lampens kant, så den mørke himmel og tågerne stadig er gennemsigtige.
  float lys = dot(l.rgb, vec3(0.2126, 0.7152, 0.0722));
  float kant = 1.0 - smoothstep(0.55, 0.95, r);
  a = max(a, smoothstep(0.03, 0.2, lys) * kant);
  gl_FragColor = vec4(l.rgb, a);
}`;

function lavSortHul() {
  const g = new THREE.Group();
  const linseScene = new THREE.Scene();
  const linseKamera = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(2 * Math.atan(LINSE_HALV / LINSE_AFSTAND)), 1, 1, 1000);
  // Laget i linse.js får størrelsen af det, der tegnes i, gange kvaliteten (tablet 0,5). Derfor er målet større.
  const mål = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: true });
  const mat = new THREE.ShaderMaterial({
    defines: { INGEN_DYBDE: INGEN_DYBDE.toFixed(1) },
    uniforms: { tLinse: { value: null }, uNaer: { value: LINSE_AFSTAND - 15 }, uTexel: { value: new THREE.Vector2(1 / 256, 1 / 256) } },
    vertexShader: LAMPE_VERTEX,
    fragmentShader: LAMPE_FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
  const flade = new THREE.Mesh(new THREE.PlaneGeometry(2 * LAMPE_HALV, 2 * LAMPE_HALV), mat);
  g.add(flade);
  flade.renderOrder = 1;

  // Linsen (laves om, hvis touch skifter mellem pc'ens og touch' shader)
  let linse = null;
  let fjernet = false;
  const varmGeo = new THREE.PlaneGeometry(1, 1);
  function nyLinse() {
    if (linse) { linseScene.remove(linse.flade); linse.fjern(); }
    linse = lavLinse({ lysstyrke: 0.26, kvalitet: linseKvalitet() }); // lidt lysere end i Kosmos (lampen er lille)
    linse.dynamisk(false); // lampen styrer selv opløsningen og hvor tit den tegnes
    linseScene.add(linse.flade);
    mat.uniforms.tLinse.value = linse.tekstur;
    tilstand.størrelse = 0; // (laget får sin størrelse igen ved næste tegning)
    // Shaderne på forhånd (målt på A56: 149 ms første gang hullet blev tegnet): linsens to i et lag, lampens i scenen
    if (!verden.renderer) return;
    const iLaget = new THREE.Group();
    for (const m of linse.materialer) iLaget.add(new THREE.Mesh(varmGeo, m));
    lavShadereFørst(iLaget, () => !fjernet, { mål });
    lavShadereFørst(flade, () => !fjernet);
  }

  const tilstand = { størrelse: 0, sidst: -1, tegnet: 0, frys: false, billeder: 0, målTid: 0, retning: new THREE.Vector3() };
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const hæld = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), LINSE_HÆLDNING);
  const ret = new THREE.Vector3();
  const op = new THREE.Vector3();
  const buf = new THREE.Vector2();
  nyLinse();

  // Lampens størrelse på skærmen (pixel i grafikkortet) eller 0, hvis den ikke kan ses
  function påSkærmen(kamera, renderer) {
    if (!g.visible) return 0;
    let o = g;
    while (o) { if (!o.visible) return 0; o = o.parent; }
    g.getWorldPosition(p);
    const skala = g.getWorldScale(op).x;
    const afst = p.distanceTo(kamera.position);
    if (afst < 0.01) return 0;
    const ndc = p.clone().project(kamera);
    const halv = (LAMPE_HALV * skala) / (afst * Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2)));
    if (ndc.z > 1 || Math.abs(ndc.x) > 1 + halv * 1.2 || Math.abs(ndc.y) > 1 + halv) return 0;
    renderer.getDrawingBufferSize(buf);
    return halv * buf.y;
  }

  function tegn(renderer, kamera, tid, px) {
    // Opløsningen følger lampen på skærmen (skiftes kun ved en tydelig forskel, så den ikke laves om under en flyvning)
    const højst = LAV_KVALITET && touchLinse.skarp ? SKARP.højst : LINSE_HØJST;
    const ønsket = THREE.MathUtils.clamp(Math.ceil(px / 32) * 32, 96, højst);
    if (!tilstand.størrelse || Math.abs(ønsket - tilstand.størrelse) / tilstand.størrelse > 0.25) {
      tilstand.størrelse = ønsket;
      const n = Math.round(ønsket / linse.kvalitet.skala);
      mål.setSize(n, n);
      mat.uniforms.uTexel.value.setScalar(1 / ønsket); // (linsens lag er n · skala = ønsket stort)
    }
    // Linsens kamera ser hullet fra samme retning som det rigtige kamera ser lampen (i lampens eget rum)
    g.getWorldQuaternion(q).multiply(hæld).invert();
    ret.copy(kamera.position).sub(p).applyQuaternion(q).normalize();
    op.copy(kamera.up).applyQuaternion(kamera.quaternion).applyQuaternion(q);
    linseKamera.position.copy(ret).multiplyScalar(LINSE_AFSTAND);
    linseKamera.up.copy(op);
    linseKamera.lookAt(0, 0, 0);
    linseKamera.updateMatrixWorld();
    linse.opdater(tid, 0);
    const før = renderer.getRenderTarget();
    renderer.setRenderTarget(mål);
    renderer.render(linseScene, linseKamera);
    renderer.setRenderTarget(før);
    tilstand.tegnet++;
    tilstand.retning.copy(ret);
  }

  return {
    gruppe: g,
    opdater(dt, tid) {
      const { renderer, kamera } = verden;
      if (!renderer) return;
      // Fladen vender altid mod kameraet
      g.getWorldQuaternion(q).invert();
      flade.quaternion.copy(q).multiply(kamera.quaternion);
      const px = påSkærmen(kamera, renderer);
      if (!px) return;
      // Touch: skarp, almindelig eller stillbillede efter billeder/s (det måles kun, mens lampen ses, og ikke lige
      // efter nye shadere, hvor det hakker et par sekunder)
      if (LAV_KVALITET && !tilstand.frys && dt > 0) {
        if (nyeShadere()) {
          tilstand.billeder = 0;
          tilstand.målTid = 0;
        } else {
          tilstand.billeder++;
          tilstand.målTid += dt;
        }
        if (tilstand.målTid > SKARP.måleTid) {
          const skift = linseSkift(touchLinse, tilstand.billeder / tilstand.målTid, skærmLoft());
          if (skift === 'skarp') { touchLinse.skarp = true; gemSkarp(true); } // (pc'ens shader fra næste besøg)
          else if (skift === 'tilbage') { Object.assign(touchLinse, { skarp: false, låst: true, pc: false }); gemSkarp(false); }
          else if (skift === 'frys') tilstand.frys = true;
          tilstand.billeder = 0;
          tilstand.målTid = 0;
        }
      }
      if (linse.kvalitet !== linseKvalitet()) nyLinse(); // (gik tilbage: touch-shaderen igen, også i den anden lampe)
      const hyppighed = LAV_KVALITET && touchLinse.skarp ? SKARP.hyppighed : LINSE_HYPPIGHED;
      if (tilstand.tegnet && tid - tilstand.sidst < hyppighed) return;
      if (tilstand.frys && tilstand.tegnet) {
        g.getWorldQuaternion(q).multiply(hæld).invert();
        ret.copy(kamera.position).sub(p).applyQuaternion(q).normalize();
        if (ret.angleTo(tilstand.retning) < 0.05) return;
      }
      tilstand.sidst = tid;
      tegn(renderer, kamera, tid, px);
    },
    fjern() {
      fjernet = true;
      linse.fjern();
      mål.dispose();
      varmGeo.dispose();
    },
    test: () => ({ linse: true, størrelse: tilstand.størrelse, tegnet: tilstand.tegnet, frys: tilstand.frys, skarp: touchLinse.skarp, låst: touchLinse.låst, pc: linse.kvalitet === LINSE_PC }),
  };
}

// Hver lampes farve (skæret bag lampen og lyset på skinnen under den, js/gaader/skinne.js)
export const LAMPEFARVE = {
  antistof: [1.0, 0.75, 0.5], begyndelsen: [0.5, 0.8, 1.0], liv: [0.3, 0.55, 1.2], sorthul: [1.0, 0.55, 0.3],
  planet9: [1.0, 0.76, 0.4], moerktstof: [0.85, 0.7, 1.0], kvante: [0.4, 0.8, 1.2],
};
export const lampeFarve = (id) => new THREE.Color(...(LAMPEFARVE[id] ?? [0.6, 0.75, 1]));

export function lavLys(id) {
  return LYS[id]?.() ?? null;
}
