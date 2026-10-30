// Kameraets rejse i et planetsystem, fra hele systemet og helt ind til en lille måne.
// I stedet for at flytte kameraet langt væk skaleres og flyttes hele systemet, så det, vi kigger på (fokus), står i
// midten, og kameraet altid er tæt på midten. Så holder dybden på skærmen, og planeten bliver inden for stjernehimlen
// (som begynder 700 enheder ude). Det ser ud præcis, som hvis kameraet fløj gennem systemet i den rigtige skala.
//
// Vejen mellem to steder er van Wijk og Nuijs "glatte zoom og panorering" (2003): Kameraet trækker sig tilbage,
// flytter sig og zoomer ind igen, så turen føles lige hurtig hele vejen, også når det, vi skal hen til, er bittelille.
//
// Et sted på en planet (fx Olympus Mons): Systemet drejes også, så den lodrette retning på stedet (op) peger lige op i
// verden. Så følger kameraets "op" stedet, og man drejer rundt om stedet om den lodrette akse (kameraets styring kan
// kun have én fast op-retning). Stjernehimlen drejer med, så stjernerne står fast i forhold til planeten. Uden et sted
// er drejningen nul. bund(p) siger, hvor tæt på planetens midte kameraet må komme (så det ikke kommer under bjergene).
// Ned til et sted flyver kameraet i en bue hen over planeten (rundt om systemets midte), så det aldrig går gennem den:
// Afstanden til midten falder jævnt, og jo længere vejen er rundt om planeten, jo højere går buen.
// Fra et sted til et andet (Mars M5): Fokus glider langs overfladen, og kameraet stiger så højt, at man på toppen af
// buen kan se begge steder (horisonten når halvvejs). Flyvningen tager længere tid, jo længere der er.

import * as THREE from 'three';
import { ROLIG, drejHimmel } from '../scene3d.js';

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
// bund(p): den mindste afstand fra systemets midte, kameraet må have i retningen mod p (p i systemets retninger).
export function lavRejse({ system, verden, nær = 1.9, maks = 550, bund = null }) {
  const kamera = verden.kamera;
  const styring = verden.styring;
  styring.target.set(0, 0, 0);
  const fokus = new THREE.Vector3(); // i systemets egne enheder (før det skaleres)
  const retning = kamera.position.clone().normalize(); // fra fokus mod kameraet (i verden)
  let D = kamera.position.length(); // afstanden fra fokus til kameraet i systemets enheder
  let k = 1; // systemets skala
  const drejning = new THREE.Quaternion(); // systemets drejning (fra systemets retninger til verdens)
  let mål = { fokus: () => fokus, op: null, min: 0.01, max: Infinity }; // det, vi kigger på nu
  let tur = null;
  const hjælp = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const ingen = new THREE.Quaternion();
  const Y = new THREE.Vector3(0, 1, 0);
  const qHjælp = new THREE.Quaternion();
  const omvendt = new THREE.Quaternion();
  const punkt = new THREE.Vector3();
  const punkt2 = new THREE.Vector3();
  const qFokus = new THREE.Quaternion();
  let skubbet = 0; // hvor meget kameraet blev skubbet op i sidste billede (til tests)

  // Den drejning, der får stedets op (fra mål.op) til at pege lige op i verden, med så lille et sving som muligt fra
  // drejningen fra. Uden et sted er den nul. ud må ikke være fra.
  function drejningMod(fra, ud) {
    if (!mål.op) return ud.identity();
    hjælp.copy(mål.op()).applyQuaternion(fra);
    return ud.setFromUnitVectors(hjælp.normalize(), Y).multiply(fra);
  }

  function skalaFor(afstand, f) {
    return THREE.MathUtils.clamp(nær / afstand, 1, maks / Math.max(f.length(), 1));
  }

  return {
    get afstand() { return D; },
    get skala() { return k; },
    get flyver() { return !!tur; },
    // Hvor langt flyvningen er nået (0 til 1, blødt). 1, når kameraet står stille.
    get fremdrift() { return tur ? glat(tur.t / tur.T) : 1; },
    get skubbet() { return skubbet; },
    drejning,
    fokus,
    // Flyv hen til et nyt mål: fokus() giver punktet (kan følge en måne), afstand og retning (fra fokus mod kameraet,
    // i systemets retninger). op() giver den lodrette retning på et sted (i systemets retninger). Så drejes systemet,
    // så op peger lige op. Uden op drejes det tilbage. min og max: hvor tæt på og langt væk man selv må zoome bagefter.
    // tid: sekunder (ellers efter vejens længde).
    flyv({ fokus: hvor, afstand, retning: ny, op = null, min = 0.01, max = Infinity, tid, færdig }) {
      const til = hvor();
      const vej = glatVej(fokus.distanceTo(til), D, afstand);
      const fraRetning = retning.clone().applyQuaternion(omvendt.copy(drejning).invert()); // i systemets retninger
      // Ned til et sted: kameraets plads fra systemets midte (start) og retningen fra stedet mod kameraet (slut)
      let kugle = null, S = vej.S, T = null;
      if (op) {
        const fra = fraRetning.clone().multiplyScalar(D).add(fokus);
        const slut = hjælp.copy(ny).normalize().multiplyScalar(afstand).add(til);
        kugle = { fra, ny: ny.clone().normalize(), afstand, vinkel: fra.angleTo(slut), top: 0 };
        S = (Math.abs(Math.log(afstand / D)) / RHO + kugle.vinkel) * 1.2;
        // Fra et sted til et andet langt væk (begge på overfladen, mere end ca. 10° imellem): langs overfladen og højt
        // nok til at se begge steder (radius / cos(halvdelen af vinklen), højst 2,2 gange radius)
        const r0 = fokus.length(), r1 = til.length();
        const v = r0 > 0.5 * r1 ? fokus.angleTo(til) : 0;
        if (v > 0.17) {
          kugle.overflade = { v, fra: fokus.clone(), r0, r1 };
          kugle.top = Math.max(r0, r1) / Math.cos(Math.min(v / 2, 1.1));
          T = THREE.MathUtils.clamp(3 + 3 * v, 4, 10);
        }
      }
      tur = {
        t: 0,
        T: tid ?? T ?? THREE.MathUtils.clamp(S * 0.9, kugle ? 3 : 2, 8),
        kugle,
        vej,
        fra: fokus.clone(),
        d: fokus.distanceTo(til),
        fraRetning,
        q: new THREE.Quaternion().setFromUnitVectors(fraRetning, hjælp.copy(ny).normalize()),
        fraDrejning: drejning.clone(),
        færdig,
      };
      mål = { fokus: hvor, op, min, max };
      styring.enabled = false;
      verden.målAfstand = null;
    },
    // Hvor tæt på og langt væk man selv må zoome (i systemets enheder)
    grænser(min, max) { mål = { ...mål, min, max }; },
    // Gør flyvningen færdig med det samme (til tests)
    hop() { if (tur) tur.t = tur.T; },
    stop() {
      tur = null;
      styring.enabled = true;
      drejHimmel(null);
    },
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
        // Systemet drejer hen mod stedets op
        drejning.slerpQuaternions(tur.fraDrejning, drejningMod(tur.fraDrejning, qHjælp), e);
        if (tur.kugle) {
          // I en bue rundt om midten: retningen glider langs en storcirkel, og afstanden til midten falder jævnt
          const { fra, ny: slutRetning, afstand, vinkel, top, overflade } = tur.kugle;
          const slut = punkt.copy(slutRetning).multiplyScalar(afstand).add(til); // kameraets plads ved stedet
          let r = Math.exp(THREE.MathUtils.lerp(Math.log(fra.length()), Math.log(slut.length()), e)) * (1 + 0.3 * (vinkel / Math.PI) * Math.sin(Math.PI * e));
          // Højt op mellem to steder: buen når top midtvejs (og aldrig lavere end den almindelige bue)
          if (top) r = Math.max(r, r + (top - Math.exp(0.5 * (Math.log(fra.length()) + Math.log(slut.length())))) * Math.sin(Math.PI * e));
          q.setFromUnitVectors(hjælp.copy(fra).normalize(), slut.normalize());
          const plads = slut.copy(fra).normalize().applyQuaternion(q.slerp(ingen, 1 - e)).multiplyScalar(r);
          if (overflade) {
            // Fokus glider langs overfladen (en storcirkel), ikke gennem planeten
            q.setFromUnitVectors(hjælp.copy(overflade.fra).normalize(), punkt2.copy(til).normalize());
            fokus.copy(hjælp).applyQuaternion(qFokus.copy(ingen).slerp(q, e)).multiplyScalar(THREE.MathUtils.lerp(overflade.r0, overflade.r1, e));
          } else fokus.lerpVectors(tur.fra, til, e);
          plads.sub(fokus);
          D = plads.length();
          retning.copy(plads).divideScalar(D).applyQuaternion(drejning);
        } else {
          fokus.lerpVectors(tur.fra, til, tur.d > 0 ? tur.vej.u(s) / tur.d : 1);
          D = tur.vej.w(s);
          // Retningen til kameraet glider i systemets retninger
          retning.copy(tur.fraRetning).applyQuaternion(q.copy(ingen).slerp(tur.q, e)).applyQuaternion(drejning);
        }
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
        if (mål.op) drejning.copy(drejningMod(drejning, qHjælp)); // følger stedet, hvis planeten drejer
      }
      // Kameraet må ikke komme ind under bjergene: skub det op, hvis det er under bunden
      if (bund) {
        omvendt.copy(drejning).invert();
        punkt.copy(retning).applyQuaternion(omvendt).multiplyScalar(D).add(fokus);
        const r = bund(punkt);
        skubbet = Math.max(0, r - punkt.length());
        if (skubbet > 0) {
          punkt.setLength(r).sub(fokus);
          D = punkt.length();
          retning.copy(punkt).divideScalar(D).applyQuaternion(drejning);
        }
      }
      k = skalaFor(D, fokus);
      system.scale.setScalar(k);
      system.quaternion.copy(drejning);
      system.position.copy(fokus).applyQuaternion(drejning).multiplyScalar(-k);
      system.updateMatrixWorld(true);
      drejHimmel(drejning);
      kamera.position.copy(styring.target).addScaledVector(retning, D * k);
    },
  };
}
