// Magnetfeltet ved Europa ("Under isen", trin 2, docs/drejebog-maaner.md afsnit 5).
// Jupiter står uden for billedet til venstre. Feltlinjerne er tegnet i planet gennem Europas midte, vendt mod kameraet,
// og vipper langsomt frem og tilbage (feltVed i js/data/maaner/underisen.js). Med havet slået til skubber havet den
// vippende del ud: Linjerne bøjer uden om Europa og står lige ned inde i den. Uden hav går de lige igennem.
// En lille Galileo flyver forbi, og måleren ("Galileos magnetometer") viser Jupiters vippende felt og det ekstra felt
// fra Europa. Linjerne er tegnet med Line2 (bredde i pixel), regnet 20 gange i sekundet, og står oven på månen.

import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { verden } from '../scene3d.js';
import { FELT, feltVed, ekstraFelt, vippen } from '../data/maaner/underisen.js';

const LINJER = 15; // feltlinjer
const BREDDE = 3.6; // så langt ud til hver side (i Europas radius)
const TOP = 2.7; // linjerne starter så højt over midten og slutter lige så langt under
const SKRIDT = 0.03;
const MAKS = 320; // skridt pr. linje
const REGN_S = 0.05; // sekunder mellem hver gang, linjerne regnes
const GALILEO_S = 14; // sekunder for én forbiflyvning
const GALILEO_X = 1.65; // Galileos bane: så langt til højre for Europas midte (radier)

export function lavMagnetfelt(radius, overlag) {
  const gruppe = new THREE.Group();
  gruppe.visible = false;

  // ---------- Feltlinjerne ----------
  const pos = new Float32Array(LINJER * MAKS * 6);
  const geo = new LineSegmentsGeometry();
  geo.setPositions(pos);
  const mat = new LineMaterial({ color: 0x7cc4ff, linewidth: 1.8, transparent: true, opacity: 0.6, depthTest: false, depthWrite: false });
  const linjer = new LineSegments2(geo, mat);
  linjer.frustumCulled = false;
  linjer.renderOrder = 5;
  gruppe.add(linjer);
  const start = geo.attributes.instanceStart.data; // (begyndelse og slutning af hvert stykke deler én buffer)

  const B = [0, 0];
  function regnLinjer(bx, hav) {
    let i = 0;
    for (let l = 0; l < LINJER; l++) {
      let x = -BREDDE + (2 * BREDDE * l) / (LINJER - 1);
      let y = TOP;
      // (linjerne starter lidt skråt, så de går ind i billedet ved toppen, også når feltet vipper)
      x -= (bx / FELT.fast) * TOP;
      let n = 0;
      for (; n < MAKS; n++) {
        feltVed(x, y, bx, hav, B);
        const l1 = Math.hypot(B[0], B[1]) || 1;
        // Et halvt skridt frem og retningen der (midtpunktsmetoden)
        const mx = x + (B[0] / l1) * SKRIDT * 0.5, my = y + (B[1] / l1) * SKRIDT * 0.5;
        feltVed(mx, my, bx, hav, B);
        const l2 = Math.hypot(B[0], B[1]) || 1;
        const nx = x + (B[0] / l2) * SKRIDT, ny = y + (B[1] / l2) * SKRIDT;
        pos[i++] = x * radius; pos[i++] = y * radius; pos[i++] = 0;
        pos[i++] = nx * radius; pos[i++] = ny * radius; pos[i++] = 0;
        x = nx; y = ny;
        if (y < -TOP || Math.abs(x) > BREDDE + 2) { n++; break; }
      }
      // De skridt, linjen ikke brugte, bliver til punkter uden længde
      for (; n < MAKS; n++) {
        pos[i++] = x * radius; pos[i++] = y * radius; pos[i++] = 0;
        pos[i++] = x * radius; pos[i++] = y * radius; pos[i++] = 0;
      }
    }
    start.array.set(pos);
    start.needsUpdate = true;
  }

  // ---------- Galileo: en lille sonde med en parabol og magnetometerets lange stang (tegnet meget større end i virkeligheden) ----------
  const galileo = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.5, roughness: 0.45 });
  const guld = new THREE.MeshStandardMaterial({ color: 0xc89a3a, metalness: 0.6, roughness: 0.4 });
  const s = radius * 0.05;
  const krop = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.6, s * 0.6, s * 1.2, 12), guld);
  const skål = new THREE.Mesh(new THREE.SphereGeometry(s * 1.4, 18, 8, 0, Math.PI * 2, 0, 0.9), metal);
  skål.position.y = s * 1.5;
  const stang = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.06, s * 0.06, s * 5, 6), metal);
  stang.rotation.z = Math.PI / 2;
  stang.position.x = s * 2.5;
  galileo.add(krop, skål, stang);
  galileo.rotation.x = 0.35;
  gruppe.add(galileo);
  const lys = new THREE.DirectionalLight(0xffffff, 1.6);
  lys.position.set(-1, 0.6, 1);
  gruppe.add(lys);

  // ---------- Måleren ("Galileos magnetometer") ----------
  const måler = document.createElement('div');
  måler.className = 'ui-maaler';
  måler.hidden = true;
  måler.innerHTML = `<div class="ui-maaler-titel">Galileos magnetometer</div>
    <div class="ui-maaler-raekke"><span>Jupiters felt vipper</span><span class="ui-bar"><i data-bar="jupiter"></i></span></div>
    <div class="ui-maaler-raekke"><span>Ekstra felt fra Europa</span><span class="ui-bar"><i data-bar="europa"></i></span></div>`;
  overlag.append(måler);
  const barJupiter = måler.querySelector('[data-bar="jupiter"]');
  const barEuropa = måler.querySelector('[data-bar="europa"]');
  const sætBar = (el, v) => {
    const t = THREE.MathUtils.clamp(v, -1, 1);
    el.style.left = `${50 + Math.min(0, t) * 50}%`;
    el.style.width = `${Math.abs(t) * 50}%`;
  };

  let regnOm = 0;
  let sidst = { bx: null, hav: null };
  const ekstra = [0, 0];
  let galileoT = 0.35;
  let målt = { jupiter: 0, europa: 0 };
  return {
    gruppe,
    måler,
    vis(til) {
      gruppe.visible = til;
      måler.hidden = !til;
      if (til) sidst = { bx: null, hav: null };
    },
    get vist() { return gruppe.visible; },
    // tid: fænomenets ur (står stille under pause). hav: er havet slået til?
    opdater(dt, tid, hav) {
      if (!gruppe.visible) return;
      const bx = FELT.vip * vippen(tid);
      regnOm -= dt;
      if ((regnOm <= 0 && bx !== sidst.bx) || hav !== sidst.hav) {
        regnOm = REGN_S;
        sidst = { bx, hav };
        regnLinjer(bx, hav);
      }
      const r = verden.renderer;
      if (r) r.getDrawingBufferSize(mat.resolution);
      // Galileo flyver ned langs højre side af Europa
      galileoT = (galileoT + dt / GALILEO_S) % 1;
      const gy = TOP * 0.85 * (1 - 2 * galileoT);
      galileo.position.set(GALILEO_X * radius, gy * radius, radius * 0.45);
      galileo.rotation.y += dt * 0.3;
      // Måleren: Jupiters vippende felt og det ekstra felt fra Europa der, hvor Galileo er (gjort 3 gange større, så det ses)
      ekstraFelt(GALILEO_X, gy, bx, hav, ekstra);
      målt = { jupiter: bx / FELT.vip, europa: (ekstra[0] / FELT.vip) * 3 };
      sætBar(barJupiter, målt.jupiter);
      sætBar(barEuropa, målt.europa);
    },
    // Til tests: det, måleren viser (-1 til 1), og Galileos plads (radier)
    målt: () => ({ ...målt }),
    linjePunkt(linje, skridt) {
      const i = (linje * MAKS + skridt) * 6;
      return [pos[i] / radius, pos[i + 1] / radius];
    },
    stop() {
      geo.dispose();
      mat.dispose();
      metal.dispose();
      guld.dispose();
      for (const m of [krop, skål, stang]) m.geometry.dispose();
      måler.remove();
    },
  };
}
