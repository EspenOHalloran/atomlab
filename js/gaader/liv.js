// Gåden "Er der liv andre steder?" i 3D (G4d, docs/plan-gaader-3d.md). Teksterne står i js/data/gaader.js (scene), og
// planeterne i js/data/exoplaneter.js.
// Trin 1, før man har gættet: Lysene tændes år for år fra 1992 til 2026 (et tal tæller op), ét for hver kendt planet om
// en anden stjerne (6.464), og ét blåt i midten: Jorden. Afstanden er rigtig (trykket sammen), retningen tilfældig.
// Trin 1, efter gættet: De andre lys dæmpes, og Jorden, Mars og Enceladus står ved siden af hinanden i rigtig skala.
// Trin 2: stenen Cheyava Falls som foto (målt, i farve). Efter gættet stemplet GÆT og to lige store stiplede forklaringer:
// "kemi uden liv" og "liv". Ingen etiket "liv?".
// Trin 3 og det sidste billede: Tianwen-3, Europa Clipper og Dragonfly med stiplede baner (planer) og årstal fra kortet.

import * as THREE from 'three';
import { verden, LAV_KVALITET } from '../scene3d.js';
import { glød, skilt, prikTekstur } from '../kosmos/faelles.js';
import { lyd } from '../lyd.js';
import { gådeMed } from '../data/gaader.js';
import { PLANETER_PR_ÅR, afstandeFor } from '../data/exoplaneter.js';
import { fuld, stiplet, stempel } from './streg.js';

const HB = 9; // den halve bredde og højde af det, kameraet skal se (planet z = 0)
const HH = 6;
const PR_ÅR = 0.36; // sekunder pr. år, mens lysene tændes (1992-2026: ca. 12,6 s)
const BILLEDER = new URL('../../billeder/', import.meta.url);
// Billederne hentes én gang pr. scene og deles mellem trinene (Jorden og Mars bruges to gange). ryd frigiver dem.
let hentede = new Map();
const tekstur = (sti) => {
  if (!hentede.has(sti)) {
    const t = new THREE.TextureLoader().load(new URL(sti, BILLEDER).href);
    t.colorSpace = THREE.SRGBColorSpace;
    hentede.set(sti, t);
  }
  return hentede.get(sti);
};
// Afstanden i lysår til en radius i scenen: Logaritmisk, så både Proxima b (4 lysår) og planeterne mange tusind lysår
// væk kan være med
const radius = (ly) => 1.6 + 1.85 * Math.log10(Math.max(4, ly) / 4);

export function lavNær(ctx) {
  const { gruppe, linje, knapper, passer, ROLIG } = ctx;
  const T = gådeMed('liv').scene;
  hentede = new Map();
  const lys = lavLys(gruppe, ROLIG);
  const skala = lavSkala(gruppe, T);
  let sten = null;
  let sonder = null;
  let tilstand = null; // 'lys' | 'skala' | 'sten' | 'sonder'
  let tid0 = 0;

  function stilKamera() {
    verden.styring.enabled = false;
    verden.styring.autoRotate = false;
    passer(HB, HH);
  }

  function trin(n, valgt) {
    if (n === 0) {
      sten?.skjul();
      sonder?.skjul();
      lys.g.visible = true;
      stilKamera();
      if (valgt === null) {
        if (tilstand !== 'lys') { tilstand = 'lys'; lys.start(linje, T); skala.skjul(); }
      } else if (tilstand !== 'skala') {
        tilstand = 'skala';
        lys.dæmp(true);
        skala.vis();
        linje(T.efter);
      }
      knapper([]);
      return;
    }
    lys.g.visible = false;
    skala.skjul();
    if (n === 1) {
      sonder?.skjul();
      if (tilstand !== 'sten') { tilstand = 'sten'; stilKamera(); }
      sten ??= lavSten(gruppe, T, ROLIG);
      sten.vis(valgt, linje);
      knapper([]);
      return;
    }
    sten?.skjul();
    if (tilstand !== 'sonder') { tilstand = 'sonder'; stilKamera(); }
    sonder ??= lavSonder(gruppe, T, ROLIG);
    sonder.vis(linje, n >= 3 ? `Sig det til en ven: ${gådeMed('liv').ven}` : null);
    knapper([]);
  }

  function opdater(dt, tid) {
    tid0 = tid;
    if (tilstand === 'lys' || tilstand === 'skala') { lys.opdater(dt, linje, T); skala.opdater(dt); }
    else if (tilstand === 'sten') sten.opdater(dt, linje);
    else if (tilstand === 'sonder') sonder.opdater(dt);
  }

  return {
    drejer: false,
    egetKamera: false,
    trin,
    opdater,
    // Et tryk, mens lysene tændes, springer til 2026 (for den, der ikke vil vente)
    tryk: () => { if (tilstand === 'lys') lys.spring(linje, T); },
    spol: (s) => { for (let i = 0; i < s * 30; i++) opdater(1 / 30, tid0 + i / 30); },
    test: () => ({ tilstand, lys: lys.test(), skala: skala.test(), sten: sten?.test() ?? null, sonder: sonder?.test() ?? null }),
    fjern: () => {
      verden.styring.enabled = true;
      verden.styring.autoRotate = false;
    },
  };
}

// ---------- Trin 1: lysene ----------
// Ét punkt pr. planet. Punkterne står i rækkefølgen efter fundår, så "tændt til og med år x" er de første n punkter.
// Et nyt lys blusser kort op og falder til ro. Hele skyen drejer langsomt (ikke med ROLIG).
function lavLys(gruppe, ROLIG) {
  const g = new THREE.Group();
  gruppe.add(g);
  const sky = new THREE.Group();
  sky.rotation.x = 0.35;
  g.add(sky);
  const år = [];
  const fra = []; // det første punkt for hvert år
  const liste = [];
  for (const række of PLANETER_PR_ÅR) {
    const a = afstandeFor(række);
    const kendte = a.filter((x) => x > 0);
    fra.push(liste.length);
    år.push(række[0]);
    // Ukendt afstand (0): en afstand fra samme år, ellers 300 lysår
    for (const d of a) liste.push(d > 0 ? d : kendte.length ? kendte[Math.floor(Math.random() * kendte.length)] : 300);
  }
  const N = liste.length;
  const pos = new Float32Array(N * 3);
  const farve = new Float32Array(N * 3);
  const basis = new Float32Array(N * 3);
  const født = new Float32Array(N).fill(-1); // tiden, lyset blev tændt
  const v = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    v.randomDirection().multiplyScalar(radius(liste[i]));
    pos.set([v.x, v.y, v.z], i * 3);
    c.setHSL(0.1 + Math.random() * 0.5, 0.25, 0.75 + Math.random() * 0.2);
    basis.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(farve, 3));
  const punkter = new THREE.Points(geo, new THREE.PointsMaterial({
    size: LAV_KVALITET ? 0.16 : 0.13, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  punkter.frustumCulled = false;
  sky.add(punkter);
  // Jorden: det blå lys i midten
  const jorden = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), new THREE.MeshBasicMaterial({ color: 0x4a90ff }));
  const jordGlød = glød(new THREE.Color(0.25, 0.5, 1.4), 1.6, 0.7);
  g.add(jorden, jordGlød);
  // Tallet, der tæller op: et lærred, der kun tegnes om, når året skifter
  const cv = document.createElement('canvas');
  cv.width = 768;
  cv.height = 128;
  const tæller = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, depthTest: false }));
  tæller.material.map.colorSpace = THREE.SRGBColorSpace;
  tæller.scale.set(6, 1, 1);
  tæller.position.set(0, HH - 1.2, 2);
  tæller.renderOrder = 5;
  g.add(tæller);
  function tegnTæller(år, antal) {
    const k = cv.getContext('2d');
    k.clearRect(0, 0, cv.width, cv.height);
    k.textAlign = 'center';
    k.textBaseline = 'middle';
    k.font = '800 64px system-ui, sans-serif';
    k.fillStyle = '#c9d4ee'; // lidt gråt, så gløden ikke slører tallet
    k.shadowColor = 'rgba(0,0,0,0.9)';
    k.shadowBlur = 8;
    k.fillText(`${år}   ·   ${antal.toLocaleString('da-DK')} ${antal === 1 ? 'planet' : 'planeter'}`, cv.width / 2, 66);
    tæller.material.map.needsUpdate = true;
  }

  let t = 0; // tiden, siden lysene begyndte
  let tændt = 0; // antal tændte lys
  let årNr = -1;
  let dæmpet = 0; // 0 fuld, 1 dæmpet (efter gættet)
  let mål = 0;
  let sagt = false;
  let færdig = false;

  function sætÅr(nr, linje, T) {
    if (nr === årNr) return;
    årNr = nr;
    const til = nr + 1 < fra.length ? fra[nr + 1] : N;
    for (let i = tændt; i < til; i++) født[i] = t;
    tændt = til;
    tegnTæller(år[nr], tændt);
    if (år[nr] >= 1996 && !sagt) { sagt = true; linje(T.første); }
    if (nr === år.length - 1 && !færdig) { færdig = true; linje(T.alle); lyd.opdaget(); }
    else if (tændt - fra[nr] > 400) lyd.tændes(); // de store år (Kepler 2014 og 2016)
  }

  return {
    g,
    start(linje, T) {
      t = 0; tændt = 0; årNr = -1; sagt = false; færdig = false; dæmpet = mål = 0;
      født.fill(-1);
      linje(T.start);
      tegnTæller(år[0], 0);
    },
    spring(linje, T) { t = år.length * PR_ÅR; sætÅr(år.length - 1, linje, T); },
    dæmp(til) {
      mål = til ? 1 : 0;
      // Kommer man direkte til svaret (fx efter "‹"), står alle lys tændt
      if (til && tændt < N) { t = år.length * PR_ÅR; årNr = år.length - 2; færdig = true; sagt = true; sætÅr(år.length - 1, () => {}, {}); }
    },
    opdater(dt, linje, T) {
      t += dt;
      dæmpet += (mål - dæmpet) * Math.min(1, dt * 3);
      if (!færdig) sætÅr(Math.min(år.length - 1, Math.floor(t / PR_ÅR)), linje, T);
      if (!ROLIG) sky.rotation.y += dt * 0.04;
      const l0 = 1 - 0.75 * dæmpet;
      for (let i = 0; i < N; i++) {
        const j = i * 3;
        if (født[i] < 0) { farve[j] = farve[j + 1] = farve[j + 2] = 0; continue; }
        // Et nyt lys blusser op (med ROLIG toner det bare ind)
        const a = t - født[i];
        const l = (ROLIG ? Math.min(1, a / 0.6) : 1 + 2.2 * Math.exp(-a * 4)) * l0;
        farve[j] = basis[j] * l; farve[j + 1] = basis[j + 1] * l; farve[j + 2] = basis[j + 2] * l;
      }
      geo.attributes.color.needsUpdate = true;
      tæller.material.opacity = 1 - dæmpet;
      jordGlød.material.opacity = 0.7 * (1 - dæmpet);
    },
    test: () => ({ tændt, i_alt: N, år: år[Math.max(0, årNr)], færdig, dæmpet: mål === 1 }),
  };
}

// ---------- Trin 1 efter gættet: Jorden, Mars og Enceladus i samme skala ----------
// Diametrene 12.742, 6.779 og 504 km (Wikipedia). Jorden har radius 1,7 her.
function lavSkala(gruppe, T) {
  const N = T.navne;
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const R = 1.7;
  const kloder = [
    { r: R, x: -3.4, kort: 'solsystem/jorden-1k.jpg', navn: N.jorden },
    { r: R * 6779 / 12742, x: 0.6, kort: 'solsystem/mars-1k.jpg', navn: N.mars },
    { r: R * 504 / 12742, x: 3.6, farve: 0xf2f4f8, navn: N.enceladus },
  ];
  const kugler = kloder.map((k) => {
    const mat = k.kort ? new THREE.MeshBasicMaterial({ map: tekstur(k.kort) }) : new THREE.MeshBasicMaterial({ color: k.farve });
    const m = new THREE.Mesh(new THREE.SphereGeometry(k.r, 48, 32), mat);
    m.position.set(k.x, 0.3, 2.5);
    m.rotation.x = 0.35;
    const s = skilt(k.navn, '#e8eeff', 0.55);
    s.position.set(k.x, 0.3 - R - 0.55, 2.6);
    g.add(m, s);
    return m;
  });
  // En lille glorie, så Enceladus kan findes
  const prik = glød(new THREE.Color(0.9, 0.95, 1.1), 0.5, 0.6);
  prik.position.copy(kugler[2].position);
  g.add(prik);
  let f = 0;
  return {
    vis() { g.visible = true; f = 0; },
    skjul() { g.visible = false; },
    opdater(dt) {
      if (!g.visible) return;
      f = Math.min(1, f + dt * 1.5);
      g.scale.setScalar(0.9 + 0.1 * THREE.MathUtils.smoothstep(f, 0, 1));
      for (const m of kugler) m.rotation.y += dt * 0.1;
    },
    test: () => ({ vist: g.visible, forhold: [kloder[1].r / kloder[0].r, kloder[2].r / kloder[0].r] }),
  };
}

// ---------- Trin 2: Cheyava Falls ----------
// Fotoet i farve (det er målt). En stiplet ring om pletterne, og efter gættet stemplet GÆT og to lige store stiplede
// kasser med de to forklaringer. Begge streger fra pletterne er lige lange og lige lyse.
function lavSten(gruppe, T, ROLIG) {
  const N = T.navne;
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const B = 8.2, H = B * 761 / 1024;
  const foto = new THREE.Mesh(new THREE.PlaneGeometry(B, H), new THREE.MeshBasicMaterial({ map: tekstur('gaader/cheyava-falls.jpg') }));
  foto.position.set(-3.2, 0.6, 0);
  g.add(foto);
  const kilde = skilt(N.foto, '#c8ccd6', 0.42);
  kilde.position.set(-3.2, 0.6 - H / 2 - 0.4, 0.2);
  g.add(kilde);
  // Ringen om pletterne (midt i det rødlige bånd)
  const plet = new THREE.Vector3(-3.6, 1.1, 0.1);
  const ring = [];
  for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; ring.push([plet.x + Math.cos(a) * 1.25, plet.y + Math.sin(a) * 0.95, 0.1]); }
  g.add(stiplet(ring, { bredde: 2 }));
  // De to forklaringer: lige store kasser og lige lange streger
  const forklaring = new THREE.Group();
  const kasse = (y, tekst) => {
    const x0 = 3.0, x1 = 7.8, h = 1.0;
    forklaring.add(stiplet([[x0, y - h, 0], [x1, y - h, 0], [x1, y + h, 0], [x0, y + h, 0], [x0, y - h, 0]], { bredde: 2 }));
    const s = skilt(tekst, '#d6deef', 0.62);
    s.position.set((x0 + x1) / 2, y, 0.2);
    forklaring.add(s, stiplet([[plet.x + 1.25, plet.y, 0.1], [x0, y, 0]], { bredde: 1.5 }));
  };
  kasse(2.6, N.kemi);
  kasse(-0.6, N.liv);
  forklaring.visible = false;
  g.add(forklaring);
  const st = stempel('GÆT', 1.0);
  st.sprite.position.set(5.4, -2.9, 1);
  g.add(st.sprite);
  let t = -1;
  return {
    vis(valgt, linje) {
      g.visible = true;
      if (valgt === null) { t = -1; forklaring.visible = false; st.skjul(); linje(T.sten); return; }
      if (t < 0) { t = 0; st.slå(ROLIG); linje(T.stenSvar); }
    },
    skjul() { g.visible = false; },
    opdater(dt) {
      if (!g.visible || t < 0) return;
      t += dt;
      st.opdater(dt);
      forklaring.visible = st.landet() || ROLIG;
      const f = ROLIG ? 1 : Math.min(1, (t - 0.35) / 0.6);
      for (const l of forklaring.children) if (l.material) l.material.opacity = Math.max(0, f);
    },
    test: () => ({ stempel: st.landet(), forklaringer: forklaring.visible, kasser: 2 }),
  };
}

// ---------- Trin 3: sonderne ----------
// Jorden, Mars, Jupiter med Europa og Saturn med Titan (ikke i skala) og tre stiplede baner (planer) med årstal.
// Tianwen-3 har også en bane hjem igen med prøverne. Små prikker (sonderne) glider langs banerne (ikke med ROLIG).
function lavSonder(gruppe, T, ROLIG) {
  const N = T.navne;
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const klode = (x, y, r, valg) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), new THREE.MeshBasicMaterial(valg));
    m.position.set(x, y, 0);
    g.add(m);
    return m.position;
  };
  const jord = klode(-6.6, -2.2, 0.55, { map: tekstur('solsystem/jorden-1k.jpg') });
  const mars = klode(-2.6, 2.6, 0.4, { map: tekstur('solsystem/mars-1k.jpg') });
  const jupiter = klode(2.4, -1.6, 1.0, { color: 0xc9a27a });
  const saturn = klode(6.4, 2.4, 0.85, { color: 0xdcc28e });
  const europa = klode(3.7, -0.8, 0.12, { color: 0xe8e0d0 });
  const titan = klode(7.6, 1.5, 0.14, { color: 0xe0a050 });
  const ring = [];
  for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; ring.push([saturn.x + Math.cos(a) * 1.5, saturn.y + Math.sin(a) * 0.35, 0]); }
  g.add(fuld(ring, new THREE.Color(0.75, 0.68, 0.5), { bredde: 2 }));
  const navn = (tekst, x, y, farve = '#c2cde6', størrelse = 0.5) => { const s = skilt(tekst, farve, størrelse); s.position.set(x, y, 0.3); g.add(s); };
  navn(N.jordenKort, jord.x, jord.y - 0.95);
  navn(N.marsKort, mars.x, mars.y - 0.8);
  navn(N.jupiter, jupiter.x, jupiter.y - 1.4);
  navn(N.saturn, saturn.x, saturn.y - 1.0);
  // Banerne som buer (kvadratiske Bézier-kurver)
  const bue = (a, b, løft) => {
    const m = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const n = new THREE.Vector3(-(b.y - a.y), b.x - a.x, 0).normalize().multiplyScalar(løft);
    const k = new THREE.QuadraticBezierCurve3(a.clone(), m.add(n), b.clone());
    return k;
  };
  const baner = [bue(jord, mars, 1.0), bue(mars, jord, 1.0), bue(jord, europa, -1.6), bue(jord, titan, 2.4)];
  for (const b of baner) g.add(stiplet(b.getPoints(48).map((p) => [p.x, p.y, p.z]), { bredde: 2 }));
  navn(N.tianwen, -4.6, 4.3, '#d6deef', 0.55);
  navn(N.clipper, -0.6, -4.3, '#d6deef', 0.55);
  navn(N.dragonfly, 1.6, 4.9, '#d6deef', 0.55);
  // Sonderne: én prik pr. bane
  const prikker = baner.map(() => { const s = glød(new THREE.Color(1.3, 1.3, 1.4), 0.45, 0.9); g.add(s); return s; });
  const p = new THREE.Vector3();
  let t = 0;
  let slut = null;
  return {
    vis(linje, ven) { g.visible = true; slut = ven; linje(ven ?? T.sonder); },
    skjul() { g.visible = false; },
    opdater(dt) {
      if (!g.visible) return;
      t += dt;
      baner.forEach((b, i) => {
        // Tianwen-3: ud til Mars og hjem igen efter hinanden. De andre: ud og forfra.
        const f = ROLIG ? 0.5 : i < 2 ? ((t / 5) % 2) - i : (t / (6 + i)) % 1;
        prikker[i].visible = f >= 0 && f <= 1;
        if (prikker[i].visible) prikker[i].position.copy(b.getPoint(f, p));
      });
    },
    test: () => ({ baner: baner.length, slut: Boolean(slut) }),
  };
}
