// Kameraets rejse i et planetsystem, fra hele systemet og helt ind til en lille måne.
// I stedet for at flytte kameraet langt væk skaleres og flyttes hele systemet, så det, vi kigger på (fokus), står i
// midten, og kameraet altid er tæt på midten. Så holder dybden på skærmen, og planeten bliver inden for stjernehimlen
// (som begynder 700 enheder ude). Det ser ud præcis, som hvis kameraet fløj gennem systemet i den rigtige skala.
//
// Vejen mellem to steder er van Wijk og Nuijs "glatte zoom og panorering" (2003): Kameraet trækker sig tilbage,
// flytter sig og zoomer ind igen, så turen føles lige hurtig hele vejen, også når det, vi skal hen til, er bittelille.

import * as THREE from 'three';
import { ROLIG } from '../scene3d.js';

const RHO = 1.4; // hvor meget kameraet trækker sig tilbage undervejs (1,4 føles naturligt ifølge van Wijk og Nuij)

// Vejen fra (u0, w0) til (u1, w1): u er fokus, w er afstanden fra kameraet til fokus.
// Giver S (vejens længde) og u(s) (hvor langt fokus er nået, 0 til d) og w(s) for 0 ≤ s ≤ S.
export function glatVej(d, w0, w1) {
  if (d < 1e-6 * Math.min(w0, w1)) {
    // Kun zoom
    const S = Math.abs(Math.log(w1 / w0)) / RHO;
    const tegn = w1 > w0 ? 1 : -1;
    return { S, u: () => 0, w: (s) => w0 * Math.exp(tegn * RHO * s) };
  }
  const b0 = (w1 * w1 - w0 * w0 + RHO ** 4 * d * d) / (2 * w0 * RHO * RHO * d);
  const b1 = (w1 * w1 - w0 * w0 - RHO ** 4 * d * d) / (2 * w1 * RHO * RHO * d);
  const r0 = -Math.asinh(b0); // = ln(-b + √(b² + 1)), regnet uden at tabe cifre
  const r1 = -Math.asinh(b1);
  return {
    S: (r1 - r0) / RHO,
    // cosh(r0)·tanh(ρs + r0) − sinh(r0) skrevet om, så store tal ikke går ud med hinanden
    u: (s) => ((w0 / (RHO * RHO)) * Math.sinh(RHO * s)) / Math.cosh(RHO * s + r0),
    w: (s) => (w0 * Math.cosh(r0)) / Math.cosh(RHO * s + r0),
  };
}

// Blød start og slutning (0 til 1)
const glat = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// system: gruppen med hele planetsystemet (planeten i midten). verden: fra scene3d.js.
// nær: kameraets afstand til fokus (i scene-enheder), når vi er tæt på. maks: hvor langt væk planeten højst må komme.
export function lavRejse({ system, verden, nær = 1.9, maks = 550 }) {
  const kamera = verden.kamera;
  const styring = verden.styring;
  styring.target.set(0, 0, 0);
  const fokus = new THREE.Vector3(); // i systemets egne enheder (før det skaleres)
  const retning = kamera.position.clone().normalize(); // fra fokus mod kameraet
  let D = kamera.position.length(); // afstanden fra fokus til kameraet i systemets enheder
  let k = 1; // systemets skala
  let mål = { fokus: () => fokus, min: 0.01, max: Infinity }; // det, vi kigger på nu
  let tur = null;
  const hjælp = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const ingen = new THREE.Quaternion();

  function skalaFor(afstand, f) {
    return THREE.MathUtils.clamp(nær / afstand, 1, maks / Math.max(f.length(), 1));
  }

  return {
    get afstand() { return D; },
    get skala() { return k; },
    get flyver() { return !!tur; },
    fokus,
    // Flyv hen til et nyt mål: fokus() giver punktet (kan følge en måne), afstand og retning (fra fokus mod kameraet, i verden).
    // min og max: hvor tæt på og langt væk man selv må zoome bagefter. tid: sekunder (ellers efter vejens længde).
    flyv({ fokus: hvor, afstand, retning: ny, min = 0.01, max = Infinity, tid, færdig }) {
      const til = hvor();
      const vej = glatVej(fokus.distanceTo(til), D, afstand);
      tur = {
        t: 0,
        T: tid ?? THREE.MathUtils.clamp(vej.S * 0.9, 2, 8),
        vej,
        fra: fokus.clone(),
        d: fokus.distanceTo(til),
        fraRetning: retning.clone(),
        q: new THREE.Quaternion().setFromUnitVectors(retning, hjælp.copy(ny).normalize()),
        færdig,
      };
      mål = { fokus: hvor, min, max };
      styring.enabled = false;
      verden.målAfstand = null;
    },
    // Hvor tæt på og langt væk man selv må zoome (i systemets enheder)
    grænser(min, max) { mål = { ...mål, min, max }; },
    // Gør flyvningen færdig med det samme (til tests)
    hop() { if (tur) tur.t = tur.T; },
    stop() { tur = null; styring.enabled = true; },
    // Kaldes hvert billede, før planeter og måner får deres lys og skygger
    opdater(dt) {
      // Man kan selv have drejet og zoomet kameraet
      hjælp.copy(kamera.position).sub(styring.target);
      const d = hjælp.length();
      if (d > 1e-9) retning.copy(hjælp).divideScalar(d);
      if (tur) {
        tur.t = ROLIG ? tur.T : Math.min(tur.T, tur.t + dt);
        const e = glat(tur.t / tur.T);
        const s = tur.vej.S * e;
        const til = mål.fokus();
        fokus.lerpVectors(tur.fra, til, tur.d > 0 ? tur.vej.u(s) / tur.d : 1);
        D = tur.vej.w(s);
        retning.copy(tur.fraRetning).applyQuaternion(q.copy(ingen).slerp(tur.q, e));
        if (tur.t >= tur.T) {
          fokus.copy(til);
          const færdig = tur.færdig;
          tur = null;
          styring.enabled = true;
          færdig?.();
        }
      } else {
        D = THREE.MathUtils.clamp(d / k, mål.min, mål.max);
        fokus.copy(mål.fokus());
      }
      k = skalaFor(D, fokus);
      system.scale.setScalar(k);
      system.position.copy(fokus).multiplyScalar(-k);
      system.updateMatrixWorld(true);
      kamera.position.copy(styring.target).addScaledVector(retning, D * k);
    },
  };
}
