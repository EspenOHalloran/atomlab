// Jupiter (docs/plan-jupiter.md). J1: kloden og skelettet. Jupiter står i Solsystemet mellem Mars og Saturn.
// Kortet er Hubbles OPAL-kort fra december 2025 med farverne stemt af efter Cassini (billeder/solsystem/lav_jupiter.py).
// Månerne, vindene, flybyen og effekterne kommer i J2-J5. Tal fra docs/fakta-solsystemet.md, "Del 5: Jupiter".
//
// Systemet er én gruppe (1 enhed = 10.000 km, som Saturn), som rejsen (js/solsystem/rejse.js) skalerer og flytter.
// Kortet: u = østlig længde / 360 (0° System III i venstre kant, øst til højre), rækkerne følger den parametriske
// bredde, så kortet passer på den fladtrykte kugle (scale.y).

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, passerTil } from '../scene3d.js';
import { glød } from './faelles.js';
import { lavGasplanet } from '../solsystem/planet.js';
import { lavRejse } from '../solsystem/rejse.js';
import { hent, hentedeBilleder } from '../solsystem/hent.js';
import { SIDE, SIDER } from '../data/sider/jupiter.js';

const JUPITER_R = 71492; // km ved ækvator (1 bar, NSSDC)
const JUPITER_POL = 66854; // km ved polerne: fladtrykt 6,5 %
const HÆLDNING = THREE.MathUtils.degToRad(3.13); // aksens hældning (NSSDC): næsten ingen årstider
const S = 10000; // km pr. enhed i systemet
const R = JUPITER_R / S;
// Programmets ur: Jupiter drejer én gang på DØGN_TID sekunder (i virkeligheden 9,925 timer, System III).
// Månerne (J3) følger det samme ur, så de passer sammen med Jupiters døgn.
export const DØGN_TID = 80;
const DREJ = (Math.PI * 2) / DØGN_TID; // radianer pr. sekund, mod uret set fra nord (mod øst)

// Billederne (billeder/solsystem/KILDER.md): pc 4k, tablet og telefon 2k, tests 1k.
const STØRRELSE = TEST_HURTIG ? '1k' : LAV_KVALITET ? '2k' : '4k';
const SEGMENTER = TEST_HURTIG ? 64 : LAV_KVALITET ? 128 : 192;

const TRÆ = { rod: 'jupiter', grupper: [] }; // stederne og månerne kommer i J3 og J4

export default {
  id: 'jupiter',
  navn: 'Jupiter',
  ikon: '🟠',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Den største planet',
  træ: TRÆ,
  kamera: { retning: [0.2, 0.1, 1], radius: 21 },
  tal: [
    ['Jupiters bredde', 'ca. 143.000 km'],
    ['Døgn', '9 t 56 min'],
    ['Vægt', 'ca. 318 Jorder'],
    ['Afstand til Solen', 'ca. 778 mio. km'],
  ],
  side: SIDE, // teksten i højre panel (js/data/sider/jupiter.js)
  sider: SIDER,

  lav(gruppe, { opdaterKnapper, forklaring, fase, verden }) {
    const { kamera } = verden;
    const orbit = verden.styring; // kameraets styring med mus og fingre
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, fjern: kamera.far };
    orbit.minDistance = 0.001; // rejsen holder selv afstanden (i systemets enheder)
    orbit.maxDistance = 1e5;
    kamera.near = 0.02;
    kamera.far = 20000;
    kamera.updateProjectionMatrix();
    let modlys = false;
    const sol = new THREE.Vector3(1, 0.03, 0.6).normalize(); // Solens retning (lyset kommer herfra)
    const solNu = new THREE.Vector3();

    // ---------- Jupiter ----------
    const system = new THREE.Group();
    const jupiterG = new THREE.Group();
    jupiterG.rotation.z = HÆLDNING;
    const planet = lavGasplanet({ skala: S, radius: JUPITER_R, polRadius: JUPITER_POL, segmenter: SEGMENTER });
    jupiterG.add(planet.mesh);
    system.add(jupiterG);
    gruppe.add(system);
    let hentet = false;
    hent(`jupiter-${STØRRELSE}.jpg`, (t) => { planet.sætKort(t); hentet = true; }, { anisotropi: LAV_KVALITET ? 2 : 4 });

    // Solen: en lille, skarp prik. Fra Jupiter er den ca. 0,10° bred (ca. 1/5 af det, vi ser fra Jorden).
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.014 : 0.011);
    const solGlød = glød(0xffe2b0, 0.12, 0.55);
    for (const s of [solKerne, solGlød]) {
      s.material.sizeAttenuation = false;
      s.renderOrder = -1;
      gruppe.add(s);
    }

    // ---------- Kameraets rejse ----------
    const rejse = lavRejse({ system, verden });
    rejse.grænser(R * 1.15, 450);
    const nul = new THREE.Vector3();
    // Afstanden, så en kugle med denne radius passer i 3D-billedet (mellem panelerne)
    function passer(radius) {
      passerTil(10);
      const f = (verden.målAfstand ?? 40) / 10;
      verden.målAfstand = null;
      return radius * f;
    }
    let visning = 'jupiter';
    // Hele Jupiter, så kloden passer mellem panelerne
    const START = new THREE.Vector3(0.2, 0.1, 1).normalize(); // lidt fra oven og fra den side, Solen lyser på
    const helJupiter = (retning = kamera.position.clone().normalize()) => rejse.flyv({ fokus: () => nul, afstand: passer(R * 1.08), retning, min: R * 1.15, max: 450 });
    function gåTil(id) {
      if (id !== 'jupiter') return;
      visning = id;
      fase(null);
      forklaring('');
      helJupiter();
    }
    let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)

    const styring = [];
    function lavKnapper() {
      styring.length = 0;
      styring.push({ tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } });
      opdaterKnapper();
    }
    lavKnapper();

    // ---------- Hvert billede: kameraet, systemets skala og lyset ----------
    let tid = 0;
    const op = new THREE.Vector3(0, 1, 0);
    const kamPos = new THREE.Vector3();
    function hvertBillede(dt) {
      if (første) {
        første = false;
        helJupiter(START);
        rejse.hop();
      }
      rejse.opdater(dt);
      // I modlys står Solen næsten lige bag Jupiter, set fra kameraet
      if (modlys) {
        kamPos.copy(kamera.position).normalize();
        solNu.copy(kamPos).multiplyScalar(-1).addScaledVector(op, 0.22).normalize();
      } else solNu.copy(sol);
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solNu, 600);
      planet.sæt(solNu, tid);
    }
    verden.opdateringer.add(hvertBillede);

    return {
      styring,
      gåTil,
      sted: () => visning,
      opdater(dt, t) {
        tid = t;
        planet.mesh.rotation.y = t * DREJ; // mod uret set fra nord: skyerne flytter sig mod øst
      },
      stop() {
        verden.opdateringer.delete(hvertBillede);
        rejse.stop();
        orbit.minDistance = gammelt.min;
        orbit.maxDistance = gammelt.max;
        kamera.near = gammelt.nær;
        kamera.far = gammelt.fjern;
        kamera.updateProjectionMatrix();
        fase(null);
      },
      test: {
        // Jupiters drejning (radianer om aksen), fladtrykningen og om kortet er hentet
        drejning: () => planet.mesh.rotation.y,
        form: () => ({ flad: planet.mesh.scale.y, radius: R, hældning: jupiterG.rotation.z, segmenter: SEGMENTER }),
        hentet: () => hentet,
        billeder: () => hentedeBilleder(['jupiter']),
        // Hvor et punkt på Jupiters ækvator ved østlig længde `længde` står i verden (x, z), set fra nord
        punkt(længde) {
          // u = længde/360 i SphereGeometry: x = -cos(2πu), z = sin(2πu)
          const u = længde / 360;
          const p = new THREE.Vector3(-Math.cos(u * Math.PI * 2), 0, Math.sin(u * Math.PI * 2)).multiplyScalar(R);
          planet.mesh.localToWorld(p);
          return [p.x, p.y, p.z];
        },
        tur: () => ({ flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand }),
        hop: () => rejse.hop(),
        sol: () => solNu.toArray(),
      },
    };
  },
};
