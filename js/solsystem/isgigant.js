// Isgiganterne Uranus og Neptun (docs/plan-uranus-neptun.md). De to planeter ligner hinanden, så de bygges af den samme
// kode: js/kosmos/uranus.js og neptun.js giver kun deres egne tal og tekster. UN1: kloden og skelettet.
//
// - Kloden er lavGasplanet (planet.js) med Hubbles kort (billeder/solsystem/lav_isgiganter.py: de målte bånd i de
//   ægte farver og et svagt lag med pletterne), fladtrykt efter NSSDC. Kortet: u = østlig længde / 360 (øst til højre),
//   rækkerne følger den parametriske bredde (scale.y), som Jupiter.
// - Aksen peger mod IAU's nordpol (rektascension og deklination fra NSSDC), og Solens retning regnes ud fra banen for
//   dagens dato (js/data/isgiganter.js), så hældningen og årstiden passer: Uranus' nordpol har sol nu.
// - Systemet er én gruppe i ekliptikkens retninger (1 enhed = 10.000 km, som Jupiter og Saturn), som rejsen
//   (rejse.js) skalerer og flytter.
// - Døgnet: Uranus drejer med uret set fra IAU's nordpol ("baglæns"), Neptun mod uret. Tiden går SEK_PR_SEK gange
//   hurtigere end i virkeligheden (som ved Jupiter), og ⏩ HURTIG gange hurtigere endnu.
// - Vindene (js/data/vinde-isgiganter.js) bliver til en tekstur med én række, og kortet glider med dem i to faser
//   (planet.js, som Jupiter J2). Fasen er kort (FASE), for vindene er hurtige i forhold til planeternes størrelse.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, passerTil } from '../scene3d.js';
import { glød } from '../kosmos/faelles.js';
import { lavGasplanet } from './planet.js';
import { lavRejse } from './rejse.js';
import { hent, hentedeBilleder } from './hent.js';
import { PLANETER, pol, knude, solRetning, baneNormal } from '../data/isgiganter.js';
import { vindVed } from '../data/vinde-isgiganter.js';

const S = 10000; // km pr. enhed i systemet
export const SEK_PR_SEK = 450; // sekunder i virkeligheden pr. sekund i programmet (som Jupiter, ca. 447)
export const HURTIG = 20; // ⏩
const FASE = 10; // sekunder: kortet glider i faser (planet.js). Neptuns ækvator flytter sig ca. 4° i én fase.
const VIND_SKALA = 1e-3; // tallene i vindens tekstur er uv pr. sekund delt med VIND_SKALA (passer til HalfFloat)
const VIND_RÆKKER = 512;
const MARGEN = 0.03; // kameraet holdes mindst 300 km over skyerne
const GRAD = Math.PI / 180;

// Billederne (billeder/solsystem/KILDER.md): pc 2k, tablet, telefon og tests 1k (Hubbles kort har ikke flere detaljer)
const STØRRELSE = TEST_HURTIG || LAV_KVALITET ? '1k' : '2k';
const SEGMENTER = TEST_HURTIG ? 64 : LAV_KVALITET ? 128 : 192;
const DETALJER = !LAV_KVALITET && !TEST_HURTIG; // fine skyer tæt på (kun pc)

// cfg: { id, navn, ikon, undertitel, tal, side, sider, kort (filnavnets start), kantFarve }
export function lavIsgigant(cfg) {
  const P = PLANETER[cfg.id];
  const R = P.radius / S;
  const FLAD = P.polRadius / P.radius;
  const DØGN_TID = (P.døgnTimer * 3600) / SEK_PR_SEK; // programmets sekunder pr. omgang
  const DREJ = (P.retning * Math.PI * 2) / DØGN_TID; // radianer pr. sekund om IAU's nordpol (+ er mod uret)
  const tilParametrisk = (grader) => Math.atan(FLAD * Math.tan(grader * GRAD));
  const tilPlanetografisk = (beta) => Math.atan(Math.tan(beta) / FLAD) / GRAD;

  // Vinden ved den parametriske bredde beta i kortets enheder: uv pr. sekund i programmets ur (+ er mod øst)
  function uvPrSek(beta) {
    const cb = Math.cos(beta);
    if (cb < 1e-4) return 0;
    return (P.retning * (vindVed(cfg.id, tilPlanetografisk(beta)) / 1000 / (P.radius * cb)) * SEK_PR_SEK) / (Math.PI * 2);
  }
  function lavVindTekstur() {
    const data = new Uint16Array(VIND_RÆKKER);
    for (let j = 0; j < VIND_RÆKKER; j++) {
      const beta = ((j + 0.5) / VIND_RÆKKER - 0.5) * Math.PI;
      data[j] = THREE.DataUtils.toHalfFloat(uvPrSek(beta) / VIND_SKALA);
    }
    const t = new THREE.DataTexture(data, VIND_RÆKKER, 1, THREE.RedFormat, THREE.HalfFloatType);
    t.minFilter = t.magFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
  }

  return {
    id: cfg.id,
    navn: cfg.navn,
    ikon: cfg.ikon,
    tåger: false, // vores eget solsystem: sort himmel med stjerner
    undertitel: cfg.undertitel,
    træ: { rod: cfg.id, grupper: [] },
    kamera: { retning: [0.2, 0.1, 1], radius: 21 },
    tal: cfg.tal,
    side: cfg.side,
    sider: cfg.sider ?? {},

    lav(gruppe, { opdaterKnapper, forklaring, fase, verden }) {
      const { kamera } = verden;
      const orbit = verden.styring;
      const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, fjern: kamera.far };
      orbit.minDistance = 0.001; // rejsen holder selv afstanden (i systemets enheder)
      orbit.maxDistance = 1e5;
      kamera.near = 0.02;
      kamera.far = 20000;
      kamera.updateProjectionMatrix();
      let modlys = false;
      let hurtig = false;
      const nu = new Date();
      const sol = new THREE.Vector3(...solRetning(cfg.id, nu)); // Solens retning i systemets retninger
      const solNu = new THREE.Vector3(); // i verden

      // ---------- Kloden: aksen mod IAU's nordpol, kortets længde 0° mod knuden ----------
      const system = new THREE.Group();
      const planetG = new THREE.Group();
      const akse = new THREE.Vector3(...pol(cfg.id, nu));
      const nul = new THREE.Vector3(...knude(cfg.id, nu)); // længde 0°
      const øst = new THREE.Vector3().crossVectors(akse, nul); // længde 90° Ø (mod uret set fra nordpolen)
      // Kuglens egne retninger: længde 0° mod −x, nordpolen mod +y og 90° Ø mod +z (SphereGeometry)
      planetG.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(nul.clone().negate(), akse, øst));
      const vindTekstur = lavVindTekstur();
      const planet = lavGasplanet({
        skala: S, radius: P.radius, polRadius: P.polRadius, segmenter: SEGMENTER,
        vind: { tekstur: vindTekstur, skala: VIND_SKALA, fase: FASE },
        detaljer: DETALJER,
        kantFarve: cfg.kantFarve,
      });
      planetG.add(planet.mesh);
      system.add(planetG);
      gruppe.add(system);
      let hentet = false;
      hent(`${cfg.kort}-${STØRRELSE}.jpg`, (t) => { planet.sætKort(t); hentet = true; }, { anisotropi: LAV_KVALITET ? 2 : 4 });

      // Solen: en lille, skarp prik (fra Uranus ca. 1,7 bueminutter, fra Neptun ca. 1,1)
      const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.009 : 0.007);
      const solGlød = glød(0xffe2b0, 0.07, 0.45);
      for (const s of [solKerne, solGlød]) {
        s.material.sizeAttenuation = false;
        s.renderOrder = -1;
        gruppe.add(s);
      }

      // ---------- Urene ----------
      let vindTid = 0; // vindene (programmets sekunder)
      let døgn = 0; // planetens drejning om aksen (radianer, + er mod uret set fra IAU's nordpol)

      // ---------- Kameraets rejse ----------
      const qHæld = new THREE.Quaternion();
      const bundHjælp = new THREE.Vector3();
      function bund(p) {
        bundHjælp.copy(p).applyQuaternion(qHæld.copy(planetG.quaternion).invert());
        const l = bundHjælp.length();
        if (l < 1e-9) return R;
        const x = bundHjælp.x / l, y = bundHjælp.y / l, z = bundHjælp.z / l;
        return 1 / Math.sqrt((x * x + z * z) / (R * R) + (y * y) / (R * R * FLAD * FLAD)) + MARGEN;
      }
      const rejse = lavRejse({ system, verden, bund });
      rejse.grænser(R * 1.15, 450);
      const midtNul = new THREE.Vector3();
      function passer(radius) {
        passerTil(10);
        const f = (verden.målAfstand ?? 40) / 10;
        verden.målAfstand = null;
        return radius * f;
      }
      // Startbilledet: set næsten fra Solen (som fra Jorden), lidt fra siden og oven over ekliptikken, så man ser
      // dagsiden og polen, der har sol
      const Y = new THREE.Vector3(0, 1, 0);
      const START = sol.clone().applyAxisAngle(Y, 28 * GRAD).addScaledVector(Y, 0.15).normalize();
      const helPlanet = (retning) => rejse.flyv({ fokus: () => midtNul, afstand: passer(R * 1.08), retning, min: R * 1.15, max: 450 });
      const kamPos = new THREE.Vector3();
      function kameraRetning() {
        rejse.kameraPunkt(kamPos);
        if (kamPos.lengthSq() < 1e-9) return START.clone();
        return kamPos.normalize();
      }
      function gåTil(id) {
        if (id === cfg.id) {
          fase(null);
          forklaring('');
          helPlanet(kameraRetning());
        }
      }
      let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)

      const styring = [];
      function lavKnapper() {
        styring.length = 0;
        styring.push({ tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } });
        opdaterKnapper();
      }
      lavKnapper();

      // ---------- Hvert billede ----------
      const op = new THREE.Vector3(0, 1, 0);
      const midt = new THREE.Vector3();
      function hvertBillede(dt) {
        if (første) {
          første = false;
          helPlanet(START);
          rejse.hop();
        }
        planet.mesh.rotation.y = døgn;
        rejse.opdater(dt);
        planet.mesh.getWorldPosition(midt);
        if (modlys) {
          // Solen næsten lige bag planeten, set fra kameraet
          kamPos.copy(kamera.position).sub(midt).normalize();
          solNu.copy(kamPos).multiplyScalar(-1).addScaledVector(op, 0.22).normalize();
        } else solNu.copy(sol).applyQuaternion(rejse.drejning);
        for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solNu, 600);
        // Står Solen bag planeten, skjules gløden også (ellers stikker den frem ved kanten)
        kamPos.copy(midt).sub(kamera.position);
        const afstand = kamPos.length();
        const solFri = kamPos.normalize().angleTo(solNu) - Math.asin(Math.min(1, (R * FLAD * rejse.skala) / afstand));
        const solSes = THREE.MathUtils.smoothstep(solFri, 0, 0.02);
        solKerne.material.opacity = solSes;
        solGlød.material.opacity = 0.45 * solSes;
        planet.sæt(solNu, vindTid);
      }
      verden.opdateringer.add(hvertBillede);

      // Vindens fart i teksturen ved den planetografiske bredde (til tests): uv pr. sekund, som shaderen læser den
      function teksturFart(bredde) {
        const x = (0.5 + tilParametrisk(bredde) / Math.PI) * VIND_RÆKKER - 0.5;
        const i = THREE.MathUtils.clamp(Math.floor(x), 0, VIND_RÆKKER - 2);
        const f = THREE.MathUtils.clamp(x - i, 0, 1);
        const a = THREE.DataUtils.fromHalfFloat(vindTekstur.image.data[i]), b = THREE.DataUtils.fromHalfFloat(vindTekstur.image.data[i + 1]);
        return (a + (b - a) * f) * VIND_SKALA;
      }
      const iVerden = (v) => v.clone().applyQuaternion(rejse.drejning).toArray();

      return {
        styring,
        gåTil,
        sted: () => cfg.id,
        hurtig: `tiden går ${HURTIG} gange hurtigere`,
        tempo: (t) => { hurtig = t === 'hurtig'; },
        opdater(dt) {
          const d = dt * (hurtig ? HURTIG : 1);
          vindTid += d;
          døgn += d * DREJ;
        },
        stop() {
          verden.opdateringer.delete(hvertBillede);
          rejse.stop();
          vindTekstur.dispose();
          orbit.minDistance = gammelt.min;
          orbit.maxDistance = gammelt.max;
          kamera.near = gammelt.nær;
          kamera.far = gammelt.fjern;
          kamera.updateProjectionMatrix();
          fase(null);
        },
        test: {
          drejning: () => planet.mesh.rotation.y,
          døgnTid: DØGN_TID,
          // Formen og aksen: fladtrykningen, radius, og aksens hældning: vinklen mellem banens normal og den akse, som
          // planeten drejer mod uret om (for Uranus den modsatte af IAU's nordpol)
          form: () => {
            const a = new THREE.Vector3(0, 1, 0).applyQuaternion(planetG.quaternion).multiplyScalar(P.retning);
            const n = new THREE.Vector3(...baneNormal(cfg.id, nu));
            return { flad: planet.mesh.scale.y, radius: R, hældning: a.angleTo(n) / GRAD, segmenter: SEGMENTER };
          },
          hentet: () => hentet,
          billeder: () => hentedeBilleder([cfg.kort]),
          // IAU's nordpol og Solens retning i verden
          pol: () => iVerden(new THREE.Vector3(0, 1, 0).applyQuaternion(planetG.quaternion)),
          sol: () => solNu.toArray(),
          solSystem: () => sol.toArray(),
          // Hvor et punkt på ækvator ved østlig længde `længde` står i verden
          punkt(længde) {
            const u = længde / 360;
            const p = new THREE.Vector3(-Math.cos(u * Math.PI * 2), 0, Math.sin(u * Math.PI * 2)).multiplyScalar(R);
            planet.mesh.localToWorld(p);
            return [p.x, p.y, p.z];
          },
          midt: () => planet.mesh.getWorldPosition(new THREE.Vector3()).toArray(),
          ur: () => ({ vind: vindTid, døgn, hurtig }),
          // Vindene i shaderen ved den planetografiske bredde: farten med drejningen (m/s, regnet tilbage fra teksturen)
          strøm(bredde) {
            const fart = teksturFart(bredde);
            return { ms: (P.retning * fart * 2 * Math.PI * P.radius * 1000 * Math.cos(tilParametrisk(bredde))) / SEK_PR_SEK, uv: fart };
          },
          tur: () => ({ flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand }),
          hop: () => rejse.hop(),
        },
      };
    },
  };
}
