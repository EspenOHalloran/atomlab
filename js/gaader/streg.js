// De tre slags streg i Gåderne (G4a, docs/plan-gaader-3d.md), fælles for alle scener, så de ser ens ud:
// fuld farve = målt (fuld), hvid stiplet = ikke målt, men nogen har et bud (stiplet), og intet = ingen har et bud.
// Hullet har en kant: En stiplet streg kan tone ud (lys pr. punkt fra 1 til 0), så den ikke læses som "der er ingenting".
// Stregerne er Line2 og LineMaterial fra three@0.186.1 (lib/three/addons/lines/), fordi WebGL kun tegner tynde streger.
// Stemplet (MÅLT eller GÆT) lander med et lille bump og en lyd fra lyd.js.

import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { lyd } from '../lyd.js';

const HVID = new THREE.Color(0.92, 0.95, 1);
const c = new THREE.Color();

// punkter: [[x, y, z], ...]. lys: et tal pr. punkt (1 = fuld, 0 = væk). Stregerne lægges oven i (additivt), så en streg,
// der toner mod 0, forsvinder blødt mod den mørke himmel.
function streg(punkter, farve, { bredde = 3, lys = null, stiplet = false, streg: s = 0.45, mellem = 0.3 } = {}) {
  const geo = new LineGeometry();
  geo.setPositions(punkter.flat());
  const farver = [];
  punkter.forEach((_, i) => {
    c.copy(farve).multiplyScalar(lys ? lys[i] : 1);
    farver.push(c.r, c.g, c.b);
  });
  geo.setColors(farver);
  const mat = new LineMaterial({
    color: 0xffffff, vertexColors: true, linewidth: bredde, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, dashed: stiplet, dashSize: s, gapSize: mellem,
  });
  const linje = new Line2(geo, mat);
  if (stiplet) linje.computeLineDistances();
  return linje;
}

// Målt: fuld farve
export function fuld(punkter, farve, valg = {}) {
  return streg(punkter, farve instanceof THREE.Color ? farve : new THREE.Color(farve), valg);
}

// Et bud: hvid og stiplet
export function stiplet(punkter, valg = {}) {
  return streg(punkter, HVID, { stiplet: true, ...valg });
}

// En lodret streg fra y0 til y1, der toner ud over de sidste stykker (til en kant, der går ud over skærmen)
export function tonUd(x, y0, y1, z = 0, { dele = 24, fra = 0.55 } = {}) {
  const punkter = [];
  const lys = [];
  for (let i = 0; i <= dele; i++) {
    const f = i / dele;
    punkter.push([x, y0 + (y1 - y0) * f, z]);
    lys.push(f < fra ? 1 : Math.max(0, 1 - (f - fra) / (1 - fra)));
  }
  return { punkter, lys };
}

// Stemplet: et ord i en ramme, som lander med et bump (stor, så lidt for lille, så rigtig)
const stempelFarve = { MÅLT: '#5fe3ff', GÆT: '#ffffff' };
export function stempel(ord, størrelse = 1.6) {
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 112;
  const g = cv.getContext('2d');
  const farve = stempelFarve[ord] ?? '#ffffff';
  g.strokeStyle = farve;
  g.fillStyle = farve;
  g.lineWidth = 9;
  if (ord === 'GÆT') g.setLineDash([16, 10]); // et gæt har en stiplet ramme, som stregerne
  g.strokeRect(10, 10, 236, 92);
  g.font = '900 62px system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(ord, 128, 60);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false, opacity: 0 }));
  sprite.renderOrder = 10;
  const B = størrelse * (256 / 112);
  sprite.scale.set(B, størrelse, 1);
  let tid = -1;
  let rolig = false;
  return {
    sprite,
    slå(udenBevægelse = false) {
      tid = 0;
      rolig = udenBevægelse;
      sprite.visible = true;
      lyd.fjern();
    },
    skjul() { tid = -1; sprite.visible = false; sprite.material.opacity = 0; },
    landet: () => tid >= 0.35,
    opdater(dt) {
      if (tid < 0) return;
      tid += dt;
      // Med "Reducer bevægelse" toner stemplet bare ind
      const f = Math.min(1, tid / 0.35);
      const skala = rolig ? 1 : f < 1 ? 2.2 - 1.3 * f * f : 1 - 0.1 * Math.exp(-(tid - 0.35) * 9) * Math.cos((tid - 0.35) * 30);
      sprite.scale.set(B * skala, størrelse * skala, 1);
      sprite.material.rotation = -0.14;
      sprite.material.opacity = rolig ? f : Math.min(1, f * 1.6);
    },
  };
}
