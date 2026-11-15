// "Rejs med lyset" på Solsystemets overblik (docs/drejebog-overblik.md, afsnit 3, og jeres svar 15. november 2026: en
// handling i bjælken, og kameraet følger skallen). Skalaen glider til "Rigtig størrelse og afstand", og en lysende skal
// vokser ud fra Solen med lysets fart. Uret viser, hvor længe lyset har rejst (den rigtige tid), og når skallen når en
// planet, står tiden ved den (dagens afstand, lysTid i planeter.js). Rejsen er spolet frem, og det står ved uret:
// Den går hurtigere og hurtigere (lysRejseTid i planeter.js), så lyset når Jorden efter ca. 8 s og Neptun efter ca. 30 s.
// Kameraet står over Solen og trækker sig ud, så skallen fylder ca. to tredjedele af billedet.
// Alt bevæger sig med dt fra opdater (står stille i pause).

import * as THREE from 'three';
import { ROLIG } from '../scene3d.js';
import { lysTid, lysTekst, lysRejseTid, LYS } from '../data/planeter.js';

const START_R = 0.55; // enheder, kameraet viser først (Venus' bane, 0,48 enheder i den rigtige skala)
const MAKS_R = 24; // enheder, kameraet viser højst (Pluto i dag ca. 23 enheder ude)
const EFTER_S = 10; // sekunder, uret og tiderne står, efter skallen er nået forbi den yderste
const UD_S = 2; // sekunder, skallen tones ud
const NUL = new THREE.Vector3();

const SKAL_V = /* glsl */ `
varying vec3 vN; varying vec3 vP;
void main() {
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vP = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const SKAL_F = /* glsl */ `
uniform float uAlfa;
varying vec3 vN; varying vec3 vP;
void main() {
  float kant = 1.0 - abs(dot(normalize(vN), normalize(-vP)));
  float a = (0.03 + 0.55 * pow(kant, 3.0)) * uAlfa;
  gl_FragColor = vec4(vec3(1.0, 0.88, 0.6) * a, 1.0);
}`;

export function lavLysRejse(api) {
  const { gruppe, kamera, orbit, kloder, tidLag, HJEM } = api;
  const KM = 1 / (kloder[0].p.radius / api.radiusVed(kloder[0].p, 1)); // enheder pr. km i den rigtige skala
  const retning = new THREE.Vector3(...HJEM.retning).normalize();

  // Skallen (en kugle med lysende kant) og ringen, hvor den skærer banernes plan
  const skal = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 32),
    new THREE.ShaderMaterial({
      uniforms: { uAlfa: { value: 1 } }, vertexShader: SKAL_V, fragmentShader: SKAL_F,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    }),
  );
  const N = 256;
  const ringPkt = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const v = (i / N) * Math.PI * 2;
    ringPkt[i * 3] = Math.cos(v);
    ringPkt[i * 3 + 2] = Math.sin(v);
  }
  const ringGeo = new THREE.BufferGeometry();
  ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPkt, 3));
  const ring = new THREE.LineLoop(ringGeo, new THREE.LineBasicMaterial({ color: 0xffe7a0, transparent: true, opacity: 0.95, depthWrite: false }));
  const lys = new THREE.Group();
  lys.add(skal, ring);
  lys.visible = false;
  gruppe.add(lys);

  // Uret (over datoen nederst) og tiderne ved planeterne
  const ur = document.createElement('div');
  ur.className = 'ob-lysur';
  ur.hidden = true;
  tidLag.prepend(ur);
  const mærker = new Map(); // planetens id → { k, e }

  let rejse = null; // { fase: 'skala' | 'lys' | 'efter', w, efter, R }
  let urVist = '';

  function start() {
    stop();
    api.stopTempo();
    rejse = { fase: 'skala', w: 0, efter: 0, R: 0 };
    ur.hidden = false;
    visUr();
    api.stopFlyvning();
    if (api.t() < 1) api.sætSkala(1, !ROLIG, 1.2);
    // Kameraet til start (over Solen, så Venus' bane fylder billedet)
    const afstand = api.afstandFor(START_R);
    if (ROLIG) {
      orbit.target.set(0, 0, 0);
      kamera.position.copy(retning).multiplyScalar(afstand);
    } else api.flyvTil({ mål: () => NUL, afstand, retning, slags: 'lys', varighed: 1.4 });
  }

  function stop() {
    if (!rejse) return;
    rejse = null;
    lys.visible = false;
    ur.hidden = true;
    urVist = '';
    for (const m of mærker.values()) m.e.remove();
    mærker.clear();
  }

  function visUr() {
    const T = lysRejseTid(rejse.w);
    const tekst = `Lyset har rejst i ${lysTekst(T)} · spolet frem`;
    if (tekst !== urVist) ur.textContent = urVist = tekst;
  }

  // Tiden går (kaldes fra overblikkets opdater, så den står stille i pause)
  function opdater(dt) {
    if (!rejse) return;
    if (rejse.fase === 'skala') {
      if (api.t() >= 0.999 && !api.flyver()) {
        rejse.fase = 'lys';
        lys.visible = true;
      }
      return;
    }
    rejse.w += dt;
    if (rejse.fase === 'efter' && (rejse.efter += dt) > EFTER_S) { stop(); return; }
    const T = lysRejseTid(rejse.w);
    rejse.R = T * LYS * KM;
    // Skallen når en planet: tiden står ved den
    const nu = new Date(api.dato());
    let yderst = null;
    for (const k of kloder) {
      if (!k.holder.visible) continue;
      const r = k.pos.length();
      if (!yderst || r > yderst.pos.length()) yderst = k;
      if (r > rejse.R || mærker.has(k.p.id)) continue;
      const e = document.createElement('div');
      e.className = 'ob-tæller ob-lystid';
      e.textContent = `${k.p.navn}: ${lysTekst(lysTid(k.p.id, nu))}`;
      api.vindue.append(e);
      mærker.set(k.p.id, { k, e });
    }
    if (rejse.fase === 'lys' && rejse.R > yderst.pos.length() * 1.15) {
      rejse.fase = 'efter';
      ur.textContent = urVist = `Lyset nåede ${yderst.p.navn} efter ${lysTekst(lysTid(yderst.p.id, nu))} · spolet frem`;
    }
    if (rejse.fase === 'lys') visUr();
  }

  // Hvert billede: skallen, kameraet og tiderne ved planeterne
  const v = new THREE.Vector3();
  function hvertBillede(dt) {
    if (!rejse || rejse.fase === 'skala') return;
    lys.scale.setScalar(Math.max(rejse.R, 1e-6));
    const alfa = rejse.fase === 'efter' ? Math.max(0, 1 - rejse.efter / UD_S) : 1;
    skal.material.uniforms.uAlfa.value = alfa;
    ring.material.opacity = 0.95 * alfa;
    if (alfa <= 0) lys.visible = false;
    // Kameraet trækker sig ud med skallen (ikke længere end MAKS_R)
    if (!api.flyver()) {
      const ønsket = api.afstandFor(THREE.MathUtils.clamp(rejse.R * 1.5, START_R, MAKS_R));
      const nu = kamera.position.distanceTo(orbit.target);
      if (nu < ønsket) {
        v.copy(kamera.position).sub(orbit.target).normalize();
        kamera.position.copy(orbit.target).addScaledVector(v, nu + (ønsket - nu) * Math.min(1, dt * 4));
      }
    }
    // Tiderne under planeterne. Ligger to oven i hinanden (de inderste, når kameraet er trukket ud), vises den nyeste.
    const r = api.vindue.getBoundingClientRect();
    const pladser = [];
    for (const { k, e } of [...mærker.values()].reverse()) {
      const x = k.skærm.x - r.left - 30, y = k.skærm.y - r.top + 12, b = e.textContent.length * 7 + 16;
      const fri = k.skærm.synlig && !pladser.some((q) => x < q.x + q.b && q.x < x + b && Math.abs(q.y - y) < 22);
      e.hidden = !fri;
      if (!fri) continue;
      pladser.push({ x, y, b });
      e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  }

  return {
    start,
    stop,
    opdater,
    hvertBillede,
    kører: () => Boolean(rejse),
    fjern() {
      stop();
      ur.remove();
      skal.geometry.dispose();
      skal.material.dispose();
      ringGeo.dispose();
      ring.material.dispose();
    },
    test: {
      fase: () => rejse?.fase ?? null,
      R: () => rejse?.R ?? 0,
      ur: () => (ur.hidden ? null : ur.textContent),
      tider: () => Object.fromEntries([...mærker].map(([id, m]) => [id, m.e.textContent])),
      spol: (s) => { if (rejse) opdater(s); },
      kamera: () => kamera.position.distanceTo(orbit.target),
    },
  };
}
