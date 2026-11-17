// Merkur (docs/drejebog-merkur-pluto.md). MP1: kortet, højderne og skelettet. Kloden er MESSENGERs kort over hele
// Merkur med højderne (klippeplanet.js som Mars og Venus), i gråtoner med et svagt brunt skær. MP2 bringer stederne
// (Caloris, de lyse huller og isen ved Nordpolen), tegningen af Solen, der vender om, flybyen og siderne. Står i
// Solsystemet før Venus (efter afstanden til Solen). Tallene står i docs/fakta-solsystemet/del8-merkur-og-pluto.md og
// js/data/merkur.js.
//
// - 1 enhed = 1.000 km. Kuglen har radius 2.439,4 km som MESSENGERs kort (højderne er målt fra den).
// - Systemet ligger i ekliptikkens retninger (som Venus). Aksen peger mod IAU's nordpol, og kortets længde 0° står W
//   grader øst for knuden (IAU's formel for drejningen), så Merkur står, som den gør på datoen.
// - Tiden: Programmets dato går SEK_PR_SEK gange hurtigere end i virkeligheden (▶ et døgn i sekundet, ⏩ HURTIG gange
//   hurtigere endnu: seks døgn i sekundet, så der går ca. et halvt minut fra én solopgang til den næste). Solens
//   retning følger banen, så der går 176 døgn mellem to solopgange.
// - Kortet er fotos med skygger fra en lav sol (lav_merkur.py). Ved polerne er bunden af kraterne sort, for den får
//   aldrig sol (evig skygge). Klippeplaneten kaster ingen skygger selv, så kortet bærer dem. Over 72° bruges polkortene
//   (set lige ovenfra), for i det almindelige kort bliver polerne slørede med stråler (målt i MP1).
// - Indstillinger: "Bjergene 10 gange højere".

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG, passerTil } from '../scene3d.js';
import { glød } from './faelles.js';
import { lavKlippeplanet } from '../solsystem/klippeplanet.js';
import { lavRejse } from '../solsystem/rejse.js';
import { hent, glem, iLager } from '../solsystem/hent.js';
import { startDato } from '../solsystem/dato.js';
import { lavHentebjælke, tonInd } from '../hentning.js';
import { MERKUR, pol, knude, solRetning, meridian, underSolen } from '../data/merkur.js';
import { SIDE, SIDER } from '../data/sider/merkur.js';

const S = 1000; // km pr. enhed
const R_KM = MERKUR.radius; // 2.439,4 km (kortenes kugle)
// Højderne i kortet (m over 2.439,4 km). Skal være de samme som i billeder/solsystem/lav_merkur.py.
export const HØJDE_MIN = -5500;
export const HØJDE_MAX = 4600;
const OVERDRIV = 10; // "Bjergene 10 gange højere"
const MARGEN = 1; // km: så tæt på jorden må kameraet komme
// Tiden: ▶ et døgn i sekundet (Merkur drejer ca. 6° i sekundet), ⏩ seks døgn i sekundet (fra solopgang til solopgang
// på ca. 29 sekunder)
export const SEK_PR_SEK = 86400;
export const HURTIG = 6;
const GRAD = Math.PI / 180;
// Kortets gråtoner ganges med denne farve: Merkur er mørkt gråbrun (NASA), kortet er gråt
const TONE = [0.62, 0.56, 0.49];
const MØRK = [0.022, 0.021, 0.02]; // Merkurs farve, før kortet er hentet
const GRÅ = [0.17, 0.15, 0.13]; // farven, hvis kortet ikke kan hentes (fx uden net): kortets middel, tonet
// Kortets anisotropi (hvor skarpt det står, når man ser skråt ned på det). Ved polerne ligger pixlerne meget tættere
// mod øst end mod nord, så skråt ned over polen kræver mere end 8 (målt i MP1, se docs/kode/merkur.md).
const ANISOTROPI = 16;
// Polkortene (lav_merkur.py): Merkur set lige ovenfra fra hver pol ned til 70° (stereografisk). Kuglens shader bruger
// dem fra 72° og helt over fra 75° (klippeplanet.js, POL_GLSL), for over polen giver kortet stråler (målt i MP1).
const POL = { rmax: Math.tan((10 * Math.PI) / 180), fra: 72, til: 75 };

export default {
  id: 'merkur',
  navn: 'Merkur',
  ikon: '🌑',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Planeten nærmest Solen',
  træ: { rod: 'merkur', grupper: [] }, // stederne kommer i MP2
  kamera: { retning: [0.2, 0.15, 1], radius: R_KM / S },
  tal: [
    ['Merkurs bredde', 'ca. 4.900 km'],
    ['Én omgang om sig selv', 'ca. 59 jorddøgn'],
    ['Fra solopgang til solopgang', 'ca. 176 jorddøgn'],
    ['Et år', 'ca. 88 jorddøgn'],
  ],
  side: SIDE, // teksten i højre panel (js/data/sider/merkur.js)
  sider: SIDER,

  lav(gruppe, { opdaterKnapper, verden }) {
    const { kamera } = verden;
    const orbit = verden.styring;
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, zoom: orbit.zoomSpeed, drej: orbit.rotateSpeed };
    orbit.minDistance = 0.001; // rejsen holder selv afstanden (i systemets enheder)
    orbit.maxDistance = 1e5;
    kamera.near = 0.003;
    kamera.updateProjectionMatrix();
    const maks = verden.renderer.capabilities.maxTextureSize;
    let anisotropi = Math.min(ANISOTROPI, verden.renderer.capabilities.getMaxAnisotropy());
    let hurtig = false;
    let høj = false;
    let aktiv = true;

    // ---------- Datoen og Solen ----------
    const nu = new Date(startDato()); // overblikkets dato (js/solsystem/dato.js)
    let dato = nu.getTime(); // programmets dato (ms), går, når tiden går
    const sol = new THREE.Vector3(...solRetning(nu)); // Solens retning i systemet (ekliptikkens retninger)

    // ---------- Kloden ----------
    const net = TEST_HURTIG ? [256, 128] : LAV_KVALITET ? [768, 384] : [1024, 512]; // felter omkring og fra pol til pol
    const merkur = lavKlippeplanet({ skala: S, radius: R_KM, højdeMin: HØJDE_MIN, højdeMax: HØJDE_MAX, net, farve: MØRK, tone: TONE, pol: POL });
    const R = merkur.radius;
    // Aksen mod IAU's nordpol og kortets længde 0° mod knuden (kuglens egne retninger: længde 0° mod +x, nord mod +y
    // og 90° Ø mod −z). Omdrejningen drejer derefter kortet W grader mod øst om polen.
    const akse = new THREE.Vector3(...pol(nu));
    const nul = new THREE.Vector3(...knude(nu));
    const øst = new THREE.Vector3().crossVectors(akse, nul); // 90° øst for knuden
    const hæld = new THREE.Group();
    hæld.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(nul, akse, øst.clone().negate()));
    const omdrejning = new THREE.Group();
    omdrejning.add(merkur.mesh);
    hæld.add(omdrejning);
    const system = new THREE.Group(); // hele Merkur, som kameraets rejse skalerer og flytter
    system.add(hæld);
    gruppe.add(system);
    // Kortet står W grader øst for knuden
    const drejTil = (ms) => {
      const w = meridian(new Date(ms)) % 360;
      omdrejning.rotation.y = w * GRAD;
    };
    drejTil(dato);

    // ---------- Kortene ----------
    // Kortet i to trin: først 2k (ca. 0,6 MB), som toner ind fra den mørke kugle, og så det store kort (8k er ca. 7,9 MB
    // på pc, 4k ca. 2,4 MB på tablet), som skiftes ind uden tone. Højderne 4k på pc (ca. 9 MB) og 2k på tablet og i tests.
    const kortStr = TEST_HURTIG ? '2k' : maks >= 8192 && !LAV_KVALITET ? '8k' : '4k';
    const højdeStr = TEST_HURTIG || LAV_KVALITET ? '2k' : '4k';
    const hentet = { kort: false, højde: false, pol: {} };
    const bjælke = lavHentebjælke();
    const nyHentning = !iLager(`merkur-kort-${kortStr}.jpg`);
    let kortVist = false, kortTone = 1;
    const visKort = (t) => {
      merkur.sætKort(t);
      merkur.toneKort(kortTone);
      if (kortVist) return;
      kortVist = true;
      bjælke.færdig();
      if (nyHentning) tonInd((v) => { kortTone = v; if (aktiv) merkur.toneKort(v); });
    };
    const toTrin = kortStr !== '2k' && nyHentning;
    if (nyHentning) bjælke.vent('Henter Merkur …');
    const gråt = () => ({ farve: false, kanaler: 1, anisotropi }); // gråtoner med én kanal
    if (toTrin) hent('merkur-kort-2k.jpg', (t) => { if (!hentet.kort) visKort(t); }, gråt());
    hent(`merkur-kort-${kortStr}.jpg`, (t) => {
      visKort(t);
      hentet.kort = true;
      if (toTrin) glem('merkur-kort-2k.jpg');
    }, { ...gråt(), fejl: () => { if (!kortVist) { merkur.sætFarve(GRÅ); bjælke.færdig(); } } });
    hent(`merkur-hoejde-${højdeStr}.png`, (t) => { merkur.sætHøjde(t); hentet.højde = true; }, { farve: false, kanaler: 2 });
    // Polkortene (2k, ca. 1,1 MB hver) og polhøjderne (1k, ca. 1 MB hver)
    for (const [nord, navn] of [[true, 'nord'], [false, 'syd']]) {
      hent(`merkur-pol-${navn}-2k.jpg`, (t) => { merkur.sætPolKort(nord, t); hentet.pol[navn + 'Kort'] = true; }, { farve: false, kanaler: 1, anisotropi: 4, rundt: false });
      hent(`merkur-pol-${navn}-hoejde-1k.png`, (t) => { merkur.sætPolHøjde(nord, t); hentet.pol[navn + 'Højde'] = true; }, { farve: false, kanaler: 2, rundt: false });
    }

    // Solen: en lille, skarp prik langt væk i lysets retning (fra Merkur ser den ca. 2,6 gange så stor ud som fra Jorden)
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.05 : 0.04);
    const solGlød = glød(0xffe2b0, 0.3, 0.6);
    for (const s of [solKerne, solGlød]) {
      s.material.sizeAttenuation = false;
      s.renderOrder = -1;
      gruppe.add(s);
    }

    // ---------- Kameraets rejse (js/solsystem/rejse.js) ----------
    const qPlanet = new THREE.Quaternion();
    const planetDrejning = () => qPlanet.copy(hæld.quaternion).multiply(omdrejning.quaternion); // kuglen → systemet
    const lokal = new THREE.Vector3();
    function bund(p) {
      lokal.copy(p).applyQuaternion(planetDrejning().invert()).divideScalar(R);
      return (merkur.overflade(lokal) + MARGEN / R_KM) * R;
    }
    const rejse = lavRejse({ system, verden, bund });
    let overdriv = 1; // glider mod 1 eller OVERDRIV
    // Over det højeste sted (ca. 4,5 km over kuglen, også når bjergene er 10 gange højere)
    const minOverblik = () => R * (1.003 + 0.0019 * overdriv);
    let minNu = minOverblik();
    rejse.grænser(minNu, R * 15);
    const nulPunkt = new THREE.Vector3();
    function passer(radius) {
      passerTil(10);
      const f = (verden.målAfstand ?? 40) / 10;
      verden.målAfstand = null;
      return radius * f;
    }
    // Startbilledet: set fra Solens side, lidt fra siden og oven over ekliptikken, så grænsen mellem dag og nat ses
    const Y = new THREE.Vector3(0, 1, 0);
    const START = sol.clone().applyAxisAngle(Y, 60 * GRAD).addScaledVector(Y, 0.2).normalize();
    const helPlanet = (retning) => rejse.flyv({ fokus: () => nulPunkt, afstand: passer(R), retning, min: minOverblik(), max: R * 15 });
    const kamPos = new THREE.Vector3();
    function kameraRetning() {
      rejse.kameraPunkt(kamPos);
      return kamPos.lengthSq() < 1e-9 ? START.clone() : kamPos.normalize();
    }
    let visning = 'merkur'; // 'merkur' (hele kloden) eller 'test' (kigPå)
    // Træet: "Merkur" flyver tilbage til hele kloden (stederne kommer i MP2)
    function gåTil() {
      visning = 'merkur';
      helPlanet(kameraRetning());
    }

    // ---------- Styr-boksen ----------
    const styring = [];
    function lavKnapper() {
      styring.splice(0, styring.length,
        { tekst: 'Bjergene 10 gange højere', til: høj, skift: (til) => { høj = til; } },
      );
      opdaterKnapper();
    }
    lavKnapper();

    // ---------- Hvert billede ----------
    let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)
    const solNu = new THREE.Vector3(); // i verden
    const grundQ = new THREE.Quaternion();
    function hvertBillede(dt) {
      if (første) {
        første = false;
        helPlanet(START);
        rejse.hop();
      }
      // Bjergene vokser og krymper blødt (med "reducer bevægelse" med det samme)
      const mål = høj ? OVERDRIV : 1;
      overdriv = ROLIG ? mål : mål + (overdriv - mål) * Math.exp(-dt * 3);
      if (Math.abs(overdriv - mål) < 0.01) overdriv = mål;
      merkur.overdriv = overdriv;
      if (visning === 'merkur' && minOverblik() !== minNu) {
        minNu = minOverblik();
        rejse.grænser(minNu, R * 15);
      }
      rejse.opdater(dt);
      solNu.copy(sol).applyQuaternion(rejse.drejning);
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solNu, 600);
      merkur.sæt(solNu);
      // Tæt på drejer og zoomer man langsommere, så landskabet ikke suser forbi
      if (visning === 'merkur') {
        const højde = Math.max(rejse.afstand - R, 0) / rejse.afstand;
        orbit.zoomSpeed = THREE.MathUtils.clamp(højde * 2, 0.06, 1);
        orbit.rotateSpeed = THREE.MathUtils.clamp(højde * 2, 0.04, 1);
      } else {
        kamPos.copy(kamera.position).sub(system.position).applyQuaternion(grundQ.copy(rejse.drejning).invert()).divideScalar(rejse.skala);
        const nede = THREE.MathUtils.clamp(((kamPos.length() - bund(kamPos)) * S + MARGEN) / 20, 0.3, 1);
        orbit.zoomSpeed = nede;
        orbit.rotateSpeed = 0.6 * nede;
      }
    }
    verden.opdateringer.add(hvertBillede);

    // Kun til tests: Solens højde og retning set fra et sted (bredde, længde i grader øst), i kuglens egne retninger
    const solLokal = new THREE.Vector3();
    function solVed(bredde, længde) {
      const st = merkur.sted(bredde, længde);
      solLokal.copy(sol).applyQuaternion(planetDrejning().invert());
      return {
        højde: Math.asin(THREE.MathUtils.clamp(solLokal.dot(st.op), -1, 1)) / GRAD,
        øst: solLokal.dot(st.øst), // > 0: Solen står mod øst
        nord: solLokal.dot(st.nord),
      };
    }
    const stedPunkt = new THREE.Vector3();
    const stedOp = new THREE.Vector3();

    return {
      styring,
      gåTil,
      sted: () => 'merkur',
      hurtig: 'seks døgn i sekundet',
      tempo: (t) => { hurtig = t === 'hurtig'; },
      // Kaldes kun, når tiden går (tidsknappen): datoen går frem, Merkur drejer, og Solen følger banen
      opdater(dt) {
        dato += dt * (hurtig ? HURTIG : 1) * SEK_PR_SEK * 1000;
        drejTil(dato);
        sol.set(...solRetning(new Date(dato)));
      },
      stop() {
        aktiv = false;
        bjælke.fjern();
        verden.opdateringer.delete(hvertBillede);
        for (const s of [solKerne, solGlød]) s.material.dispose();
        rejse.stop();
        merkur.stop();
        orbit.minDistance = gammelt.min;
        orbit.maxDistance = gammelt.max;
        orbit.zoomSpeed = gammelt.zoom;
        orbit.rotateSpeed = gammelt.drej;
        kamera.near = gammelt.nær;
        kamera.updateProjectionMatrix();
      },
      test: {
        drejning: () => omdrejning.rotation.y,
        dato: () => dato,
        sekPrSek: SEK_PR_SEK,
        hurtigGange: HURTIG,
        // Punktet under Solen: regnet i 3D-billedet (Solens retning i kuglens egne retninger) og i js/data/merkur.js
        underSolen() {
          solLokal.copy(sol).applyQuaternion(planetDrejning().invert());
          const længde = ((Math.atan2(-solLokal.z, solLokal.x) / GRAD) + 360) % 360;
          return { bredde: Math.asin(THREE.MathUtils.clamp(solLokal.y, -1, 1)) / GRAD, længde, data: underSolen(new Date(dato)) };
        },
        solVed,
        // Aksen: vinklen mellem kuglens nordpol og IAU's nordpol (grader)
        akse() {
          const n = new THREE.Vector3(0, 1, 0).applyQuaternion(hæld.quaternion);
          return { modIAU: n.angleTo(akse) / GRAD, radius: R * S };
        },
        overdriv: () => overdriv,
        billeder: () => ({ kort: kortStr, højde: højdeStr, net, hentet: { ...hentet, pol: { ...hentet.pol } }, tabel: merkur.harTabel, tone: kortTone, anisotropi, bjælke: { venter: bjælke.venter, vist: bjælke.vist } }),
        // Polkortene til og fra (kun til målingen af polen i MP1)
        udenPol(uden) {
          const h = merkur.mesh.material[0].uniforms.harPol.value;
          if (uden) h.set(0, 0, 0, 0);
          else h.set(+!!hentet.pol.nordKort, +!!hentet.pol.sydKort, +!!hentet.pol.nordHøjde, +!!hentet.pol.sydHøjde);
        },
        // Kortets anisotropi (kun til målingen af polen i MP1): lægges i grafikkortet igen
        sætAnisotropi(n) {
          anisotropi = Math.min(n, verden.renderer.capabilities.getMaxAnisotropy());
          const t = merkur.mesh.material[0].uniforms.kort.value;
          if (t) { t.anisotropy = anisotropi; t.needsUpdate = true; }
          return anisotropi;
        },
        tur: () => ({ flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand }),
        hop: () => rejse.hop(),
        sætDato(ms) { dato = ms; drejTil(dato); sol.set(...solRetning(new Date(dato))); },
        // Kameraet over et sted (bredde, længde i grader øst) i afstand km, med det samme. vinkel: over horisonten
        // (90 = lige ned), kompas: hvorfra kameraet kigger (180 = fra syd). Kun til tests og billeder.
        kigPå(bredde, længde, km, vinkel = 90, kompas = 180) {
          const st = merkur.sted(bredde, længde);
          const a = kompas * GRAD, v = vinkel * GRAD;
          const retning = new THREE.Vector3()
            .addScaledVector(st.nord, Math.cos(v) * Math.cos(a))
            .addScaledVector(st.øst, Math.cos(v) * Math.sin(a))
            .addScaledVector(st.op, Math.sin(v))
            .applyQuaternion(planetDrejning());
          visning = 'test';
          rejse.flyv({
            fokus: () => merkur.punkt(st.retning, stedPunkt).multiplyScalar(R).applyQuaternion(planetDrejning()),
            op: () => stedOp.copy(st.op).applyQuaternion(planetDrejning()),
            afstand: km / S, retning, min: 0.002, max: R * 15,
          });
          rejse.hop();
        },
        // Solen lige over et sted (kun til billeder): datoen bliver, men Solens retning sættes
        solOver(bredde, længde, højde = 30, kompas = 90) {
          const st = merkur.sted(bredde, længde);
          const a = kompas * GRAD, v = højde * GRAD;
          sol.set(0, 0, 0)
            .addScaledVector(st.nord, Math.cos(v) * Math.cos(a))
            .addScaledVector(st.øst, Math.cos(v) * Math.sin(a))
            .addScaledVector(st.op, Math.sin(v))
            .applyQuaternion(planetDrejning());
        },
        // Højden over kuglen (km, glat) et sted (bredde, længde i grader øst)
        højde(bredde, længde) {
          const r = merkur.sted(bredde, længde).retning;
          return (merkur.punkt(r, lokal).length() - 1) * R_KM;
        },
      },
    };
  },
};
