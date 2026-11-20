// "Flyv gennem fontænen" (spor Måner, M4, docs/drejebog-maaner.md afsnit 6a): Kameraet sidder bag Cassini, der selv
// flyver gennem sprøjtet under Enceladus' sydpol med Solen forude (modlys, så strålerne lyser). Man styrer højden ved at
// trække op og ned (eller ↑ og ↓), og to målere ("Iskorn" og "Gas") fyldes hurtigere, jo tættere Cassini er på
// sydpolen. Ved hvert mærke falder et fund ud (fund). Er målerne ikke fulde, når Cassini er igennem, flyver den igennem
// igen (et rundt mål). Tallene, tætheden og teksterne står i js/data/maaner/flyvetur.js.
// Fontænerne selv er js/solsystem/fontaener.js (bruges af underisen.js, ændres ikke). Kornene, der suser forbi tæt på
// Cassini, er små streger, som tegnes her. Med ROLIG (reducer bevægelse) bliver kameraet stående, og Cassini ses udefra.

import * as THREE from 'three';
import { verden, LAV_KVALITET, ROLIG } from '../scene3d.js';
import { FLYVETUR, FUND, TEKST, fyld, tæthed } from '../data/maaner/flyvetur.js';

const OP = new THREE.Vector3(0, 1, 0);
const KORN_FART = 3.2; // radier i sekundet, som kornene suser forbi med (tegnet hurtigere end turen selv)
const UI_HZ = 4; // målerne skrives højst 4 gange i sekundet (tjekliste D)
const CASSINI_SKALA = 0.6; // Cassini er mindre under turen, så den ikke dækker sprøjtet (stadig meget større end den var)
const BAG = 1.3, OVER = 0.12; // kameraet: så mange radier bag og over Cassini
const STREG_FRA = -1.4, STREG_LÆNGDE = 5; // kornenes rum langs banen (radier fra Cassini)

// midte: Enceladus' midte, radius: dens radius og kmPrEnhed i scenen, sol: Solens retning. fund(id, tekst) kaldes for
// hvert fund, færdig() når Cassini er ude af sprøjtet med alle fundene, vink(tekst) hvis man ikke styrer.
export function lavFlyvetur({ gruppe, cassini, midte, radius, kmPrEnhed, sol, vindue, lærred, fund, færdig, vink }) {
  const KM = 1 / kmPrEnhed;
  const R = radius;
  const frem = new THREE.Vector3(sol.x, 0, sol.z).normalize(); // Cassini flyver mod Solen
  const side = new THREE.Vector3().crossVectors(OP, frem).normalize();
  const { min: H_MIN, max: H_MAX, start: H_START } = FLYVETUR.højde;
  const fart = (FLYVETUR.til - FLYVETUR.fra) / FLYVETUR.varighed; // km pr. sekund i turen

  // ---------- Målerne (øverst i 3D-vinduet, så de ikke dækker Cassini. Indstillinger og den foldede tavle er skjult
  // imens: klassen "flyver" på vinduet, style.css) ----------
  const ui = document.createElement('div');
  ui.className = 'ui-flyvetur';
  ui.hidden = true;
  const mærker = (m) => FUND.filter((f) => f.måler === m && f.ved < 1).map((f) => `<s style="left:${f.ved * 100}%"></s>`).join('');
  ui.innerHTML = `<div class="uf-række"><span>${TEKST.højde}</span><b class="uf-h"></b></div>`
    + `<div class="uf-række"><span>${TEKST.korn}</span><span class="uf-bar" data-m="korn"><i></i>${mærker('korn')}</span></div>`
    + `<div class="uf-række"><span>${TEKST.gas}</span><span class="uf-bar" data-m="gas"><i></i>${mærker('gas')}</span></div>`
    + '<div class="uf-linje"></div>';
  vindue.append(ui);
  const højdeEl = ui.querySelector('.uf-h');
  const linjeEl = ui.querySelector('.uf-linje');
  const barer = { korn: ui.querySelector('[data-m="korn"] i'), gas: ui.querySelector('[data-m="gas"] i') };

  // ---------- Kornene, der suser forbi (små streger omkring Cassini, i radier: frem, side, op) ----------
  const N = LAV_KVALITET ? 120 : 260;
  const lok = new Float32Array(N * 3);
  let frø = 11;
  const tilf = () => { frø = (frø * 16807) % 2147483647; return frø / 2147483647; };
  const nyt = (i, a) => { lok[i * 3] = a; lok[i * 3 + 1] = (tilf() * 2 - 1) * 0.9; lok[i * 3 + 2] = -0.45 + tilf() * 1.1; };
  for (let i = 0; i < N; i++) nyt(i, STREG_FRA + tilf() * STREG_LÆNGDE);
  const pos = new Float32Array(N * 6);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xd8ecff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const streger = new THREE.LineSegments(geo, mat);
  streger.frustumCulled = false;
  streger.visible = false;
  gruppe.add(streger);

  // ---------- Tilstanden ----------
  let aktiv = false, lab = false;
  let u = FLYVETUR.fra; // km langs banen (0 = lige under sydpolen)
  let h = H_START, hMål = H_START; // km over sydpolen
  let tur = 1;
  const målere = { korn: 0, gas: 0 };
  const fundet = new Set();
  let tekst = '', efter = 0; // linjen under scenen (og hvor længe den står efter turen)
  let styret = false, auto = false, udenStyr = 0, bundSagt = false;
  let uiTid = 0;
  const minFør = { v: null };
  const cas = new THREE.Vector3(), p = new THREE.Vector3();

  function placer() {
    cas.copy(midte).addScaledVector(frem, u * KM);
    cas.y = midte.y - R - h * KM;
    cassini.position.copy(cas);
    cassini.rotation.set(0, Math.atan2(frem.x, frem.z), 0);
    if (ROLIG) return;
    const k = verden.kamera, s = verden.styring;
    // Lidt bag og over Cassini, og blikket lidt opad mod sydpolen og fontænerne
    k.position.copy(cas).addScaledVector(frem, -BAG * R).addScaledVector(OP, OVER * R);
    s.target.copy(cas).addScaledVector(frem, 2.5 * R).addScaledVector(OP, 0.3 * R);
    k.lookAt(s.target);
  }
  function tegnStreger(dt) {
    const tæt = tæthed(u, h, 'korn');
    mat.opacity = Math.min(0.9, tæt * 1.1);
    for (let i = 0; i < N; i++) {
      let a = lok[i * 3] - KORN_FART * dt;
      if (a < STREG_FRA) { nyt(i, a + STREG_LÆNGDE); a = lok[i * 3]; } else lok[i * 3] = a;
      const b = lok[i * 3 + 1], c = lok[i * 3 + 2];
      for (let j = 0; j < 2; j++) {
        p.copy(cas).addScaledVector(frem, (a + j * 0.12) * R).addScaledVector(side, b * R).addScaledVector(OP, c * R);
        const o = i * 6 + j * 3;
        pos[o] = p.x; pos[o + 1] = p.y; pos[o + 2] = p.z;
      }
    }
    geo.attributes.position.needsUpdate = true;
  }
  function tegnUI() {
    højdeEl.textContent = `${Math.round(h)} km`;
    for (const m of ['korn', 'gas']) barer[m].style.width = `${Math.round(målere[m] * 100)}%`;
    const l = fundet.size || tekst !== TEKST.start ? tekst : TEKST.styr; // (først hvordan man styrer, så fundene)
    if (linjeEl.textContent !== l) linjeEl.textContent = l;
  }

  // ---------- Styringen: træk op og ned i scenen, eller ↑ og ↓ ----------
  let træk = null;
  const sætMål = (v) => {
    const før = hMål;
    hMål = THREE.MathUtils.clamp(v, H_MIN, H_MAX);
    if (v < H_MIN && før <= H_MIN + 1 && !bundSagt) { bundSagt = true; tekst = TEKST.bund; }
  };
  function ned(e) {
    if (!aktiv || e.button > 0) return;
    e.stopPropagation();
    træk = { id: e.pointerId, y: e.clientY, h0: hMål };
    styret = true;
    auto = false;
  }
  function flyt(e) {
    if (!træk || e.pointerId !== træk.id) return;
    sætMål(træk.h0 + ((e.clientY - træk.y) * (H_MAX - H_MIN)) / (0.45 * Math.max(200, lærred.clientHeight)));
  }
  function op(e) { if (træk && e.pointerId === træk.id) træk = null; }
  function tast(e) {
    if (!aktiv || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') || e.target.closest?.('input, textarea, select')) return;
    e.preventDefault();
    styret = true;
    auto = false;
    sætMål(hMål + (e.key === 'ArrowUp' ? -30 : 30));
  }
  lærred.addEventListener('pointerdown', ned, { capture: true });
  addEventListener('pointermove', flyt);
  addEventListener('pointerup', op);
  addEventListener('pointercancel', op);
  addEventListener('keydown', tast);

  function slip() {
    aktiv = false;
    træk = null;
    streger.visible = false;
    cassini.visible = false;
    cassini.scale.setScalar(1);
    ui.hidden = true;
    vindue.classList.remove('flyver');
    if (!ROLIG) {
      verden.styring.enabled = true;
      if (minFør.v !== null) verden.styring.minDistance = minFør.v;
    }
    minFør.v = null;
  }

  return {
    // lab: turen uden forløbet (fundene er allerede på tavlen)
    start({ lab: l = false } = {}) {
      aktiv = true;
      lab = l;
      u = FLYVETUR.fra;
      h = hMål = H_START;
      tur = 1;
      målere.korn = målere.gas = 0;
      fundet.clear();
      tekst = TEKST.start;
      efter = 0;
      styret = auto = bundSagt = false;
      udenStyr = 0;
      uiTid = 0;
      cassini.visible = true;
      if (!ROLIG) cassini.scale.setScalar(CASSINI_SKALA);
      streger.visible = !ROLIG;
      ui.hidden = false;
      vindue.classList.add('flyver');
      if (!ROLIG) {
        verden.styring.enabled = false;
        minFør.v = verden.styring.minDistance;
        verden.styring.minDistance = 0.001; // (kameraet sidder tæt bag Cassini)
        verden.målAfstand = null;
      }
      placer();
      tegnUI();
    },
    // "Vis mig" og "Næste ›": Cassini flyver selv helt ned
    autopilot() { auto = true; hMål = H_MIN; },
    afbryd() { if (aktiv) slip(); efter = 0; tekst = ''; },
    opdater(dt) {
      if (!aktiv) { if (efter > 0) efter -= dt; return; }
      h += (hMål - h) * Math.min(1, dt * 4);
      u += fart * dt;
      fyld(målere, u, h, dt);
      for (const f of FUND) {
        if (fundet.has(f.kort) || målere[f.måler] < f.ved) continue;
        fundet.add(f.kort);
        tekst = f.tekst;
        fund(f.kort, f.tekst);
      }
      if (!styret && !auto && (udenStyr += dt) > 3.5) { udenStyr = -1e9; vink(TEKST.vink); }
      if (u >= FLYVETUR.til) {
        if (fundet.size < FUND.length) { u = FLYVETUR.fra; tur++; tekst = TEKST.igen; }
        else {
          slip();
          tekst = lab ? TEKST.færdigLab : TEKST.færdig;
          efter = 5;
          færdig();
          return;
        }
      }
      placer();
      if (!ROLIG) tegnStreger(dt);
      if ((uiTid -= dt) <= 0) { uiTid = 1 / UI_HZ; tegnUI(); }
    },
    get aktiv() { return aktiv; },
    // Linjen under scenen: under turen og et øjeblik efter
    get forklaring() { return aktiv || efter > 0 ? tekst : ''; },
    stop() {
      if (aktiv) slip();
      lærred.removeEventListener('pointerdown', ned, { capture: true });
      removeEventListener('pointermove', flyt);
      removeEventListener('pointerup', op);
      removeEventListener('pointercancel', op);
      removeEventListener('keydown', tast);
      ui.remove();
      geo.dispose();
      mat.dispose();
    },
    test: () => ({ aktiv, u, h: Math.round(h), hMål, tur, målere: { ...målere }, fundet: [...fundet], vist: !ui.hidden, cassini: cassini.position.toArray(), kamera: verden.kamera.position.toArray() }),
    sætHøjde: (v) => { styret = true; sætMål(v); h = hMål; },
  };
}
