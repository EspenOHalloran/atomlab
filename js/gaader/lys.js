// Lysene for gåderne (G4a, docs/plan-gaader-3d.md, tabellen "Gåderne"): enkle lys med en form, man kan kende, ikke små
// animationer. Indtil en gåde får sin egen scene, står dens lys stort bag kortet (js/gaader/scene.js), og i G4b står de
// langs skinnen. lavLys(id) giver { gruppe, opdater(dt, tid) } eller null for en ukendt gåde. Lysene er symboler, ikke i skala.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG, verden } from '../scene3d.js';
import { glød, prikTekstur } from '../kosmos/faelles.js';
import { fuld } from './streg.js';
import { lavLinse, LINSE_KVALITET } from '../kosmos/linse.js';

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
    g.add(fuld(profil, glas, { bredde: 2.5 }), fuld(venstre, glas, { bredde: 2.5 }), fuld(højre, glas, { bredde: 2.5 }));
    // Vandet: bunden af kuglen under en vandret overflade
    const form = new THREE.Shape();
    const v0 = Math.PI + 0.45;
    form.absarc(0, 0, 1.42, v0, Math.PI * 2 - 0.45, false);
    form.lineTo(Math.cos(v0) * 1.42, Math.sin(v0) * 1.42);
    const vand = new THREE.Mesh(new THREE.ShapeGeometry(form, 24), new THREE.MeshBasicMaterial({ color: 0x1d4a6a, transparent: true, opacity: 0.6 }));
    vand.position.y = -0.6;
    g.add(vand);
    const lyn = fuld([[-0.2, 1.6, 0], [0.25, 0.7, 0], [-0.15, 0.3, 0], [0.3, -0.5, 0]], new THREE.Color(1.6, 1.5, 0.9), { bredde: 3 });
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
};

// ---------- Det sorte hul med linsen ----------
// Linsen fra Kosmos tegner hullet, skiven og fotonringen i et lille lag (højst 512 px på pc og 320 px på tablet, efter
// lampens størrelse på skærmen) set fra den retning, kameraet ser lampen fra. Billedet ligger på en flade, der altid
// vender mod kameraet, så hullet ser rigtigt ud, når kameraet drejer om det bag kortet. Himlen i linsens billede er
// gennemsigtig (dybden 400 = himmel), så skinnens egen himmel ses bag hullet, undtagen fotonringen og lyse stjerner. Laget tegnes kun, når lampen kan ses,
// og højst 30 gange i sekundet på tablet. Er billederne for langsomme (under 40 i sekundet på tablet), står billedet
// stille og tegnes kun igen, når kameraet har flyttet sig. Snyd: Lampen er et symbol, ikke i skala, og den bøjede
// stjernehimmel om hullet er skåret væk.
const LINSE_AFSTAND = 45; // kameraet i linsens rum (M = 0,75, skiven går ud til 15)
const LINSE_HALV = 16.5; // så meget af linsens rum, billedet viser til hver side
const LAMPE_HALV = 3.2; // flade til hver side i lampens rum (lysene er bygget med radius ca. 3)
const LINSE_HØJST = LAV_KVALITET ? 320 : 512;
const LINSE_HYPPIGHED = LAV_KVALITET ? 1 / 30 : 0;
const LINSE_HÆLDNING = 0.16; // skiven vippes lidt mod kameraet, så buen over skyggen ses tydeligt fra skinnen
const INGEN_DYBDE = 400; // som i linse.js: der, hvor der kun er himmel

const LAMPE_VERTEX = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const LAMPE_FRAGMENT = /* glsl */ `
uniform sampler2D tLinse;
uniform float uNaer;
uniform float uOpacitet;
varying vec2 vUv;
void main() {
  vec4 l = texture2D(tLinse, vUv);
  // Dybden er afstanden til skiven eller hullet, og 400 hvor der kun er himmel. Langs kanten blandes de to af den
  // lineære filtrering, så alpha bliver en blød kant.
  float a = clamp((INGEN_DYBDE - l.a) / (INGEN_DYBDE - uNaer), 0.0, 1.0);
  // Fotonringen og de bøjede stjerner er lys, der slap væk til himlen. De bliver stående, når de er lyse nok, og toner
  // ud mod lampens kant, så den mørke himmel og tågerne stadig er gennemsigtige.
  float lys = dot(l.rgb, vec3(0.2126, 0.7152, 0.0722));
  float kant = 1.0 - smoothstep(0.55, 0.95, length(vUv - 0.5) * 2.0);
  a = max(a, smoothstep(0.03, 0.2, lys) * kant);
  gl_FragColor = vec4(l.rgb, a * uOpacitet);
}`;

function lavSortHul() {
  const g = new THREE.Group();
  const linse = lavLinse({ lysstyrke: 0.26 }); // lidt lysere end i Kosmos, for lampen er lille og får mindre glød
  linse.dynamisk(false); // lampen styrer selv opløsningen og hvor tit den tegnes
  const linseScene = new THREE.Scene();
  const linseKamera = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(2 * Math.atan(LINSE_HALV / LINSE_AFSTAND)), 1, 1, 1000);
  linseScene.add(linse.flade);
  // Laget i linse.js får størrelsen af det, der tegnes i, gange kvaliteten (tablet 0,5). Derfor er målet større.
  const mål = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: true });
  const mat = new THREE.ShaderMaterial({
    defines: { INGEN_DYBDE: INGEN_DYBDE.toFixed(1) },
    uniforms: { tLinse: { value: linse.tekstur }, uNaer: { value: LINSE_AFSTAND - 15 }, uOpacitet: { value: 1 } },
    vertexShader: LAMPE_VERTEX,
    fragmentShader: LAMPE_FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
  const flade = new THREE.Mesh(new THREE.PlaneGeometry(2 * LAMPE_HALV, 2 * LAMPE_HALV), mat);
  g.add(flade);
  // Lidt varmt skær om hullet, så lampen også lyser, før billedet er tegnet første gang
  const skær = glød(new THREE.Color(1, 0.55, 0.25), 7, 0.12);
  g.add(skær);
  flade.renderOrder = 1;

  const tilstand = { størrelse: 0, sidst: -1, tegnet: 0, frys: false, billeder: 0, målTid: 0, retning: new THREE.Vector3() };
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const hæld = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), LINSE_HÆLDNING);
  const ret = new THREE.Vector3();
  const op = new THREE.Vector3();
  const buf = new THREE.Vector2();

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
    const ønsket = THREE.MathUtils.clamp(Math.ceil(px / 32) * 32, 96, LINSE_HØJST);
    if (!tilstand.størrelse || Math.abs(ønsket - tilstand.størrelse) / tilstand.størrelse > 0.25) {
      tilstand.størrelse = ønsket;
      const n = Math.round(ønsket / LINSE_KVALITET.skala);
      mål.setSize(n, n);
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
      // Er billederne for langsomme på tabletten, står billedet stille (det måles kun, mens lampen ses)
      if (LAV_KVALITET && !tilstand.frys && dt > 0) {
        tilstand.billeder++;
        tilstand.målTid += dt;
        if (tilstand.målTid > 3) {
          if (tilstand.billeder / tilstand.målTid < 40) tilstand.frys = true;
          tilstand.billeder = 0;
          tilstand.målTid = 0;
        }
      }
      if (tilstand.tegnet && tid - tilstand.sidst < LINSE_HYPPIGHED) return;
      if (tilstand.frys && tilstand.tegnet) {
        g.getWorldQuaternion(q).multiply(hæld).invert();
        ret.copy(kamera.position).sub(p).applyQuaternion(q).normalize();
        if (ret.angleTo(tilstand.retning) < 0.05) return;
      }
      tilstand.sidst = tid;
      tegn(renderer, kamera, tid, px);
    },
    fjern() {
      linse.fjern();
      mål.dispose();
    },
    test: () => ({ linse: true, størrelse: tilstand.størrelse, tegnet: tilstand.tegnet, frys: tilstand.frys }),
  };
}

export function lavLys(id) {
  return LYS[id]?.() ?? null;
}
