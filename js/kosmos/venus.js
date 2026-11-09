// Venus (docs/plan-venus.md). V1: jorden og skelettet. Kloden er Magellans radarkort med højderne (klippeplanet.js
// som Mars), tonet orange, for radaren ser ikke farver. V2: skyerne udenpå (planet.js som Jupiter), der glider med
// vindene. Natsiden og stederne kommer i V3, turen ned til Venera 13 i V4 og flybyen i V5. Står i Solsystemet mellem
// Solen og Jorden (efter afstanden til Solen).
// Tallene står i docs/fakta-solsystemet/del7-venus.md og js/data/venus.js.
//
// - 1 enhed = 1.000 km. Kuglen har radius 6.051,0 km som Magellans kort (højderne er målt fra den, fælde 13).
// - Systemet ligger i ekliptikkens retninger (som Uranus og Neptun). Aksen peger mod IAU's nordpol, og kortets
//   længde 0° står W grader øst for knuden (IAU's formel for drejningen), så Venus står, som den gør på datoen.
// - Tiden: Programmets dato går SEK_PR_SEK gange hurtigere end i virkeligheden (⏩ HURTIG gange hurtigere endnu).
//   Venus drejer baglæns (W bliver mindre), og Solens retning følger banen, så Solen står op i vest, og der går 116,75
//   døgn fra én solopgang til den næste. Ved ▶ står Venus næsten stille (en omgang tager 243 døgn).
// - Skyerne (V2): en kugle 70 km over jorden med Akatsukis kort i ultraviolet lys (billeder/solsystem/lav_venus_skyer.py).
//   I synligt lys (standard) er de lyst gullig hvide og næsten uden mønster, så kortet vises med meget lille kontrast.
//   Kontakten "Ultraviolet (som Akatsuki)" viser mønstret (forstærket, som på Akatsukis billeder). Skyderen "Under
//   skyerne" gør skylaget gennemsigtigt. Skyerne kredser med vindene (js/data/vinde-venus.js, målt i Akatsukis
//   billeder): Kuglen drejer som et stift legeme med vinkelfarten ved ækvator (SKY_OMEGA), og kortet glider i to faser
//   med resten (forskellen mellem breddegraderne, planet.js). Over skyerne ligger en tynd dis, der lyser i modlys.
// - Styr-boksen: skyderen "Under skyerne", "Ultraviolet (som Akatsuki)", "Bjergene 10 gange højere" og "Modlys".

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG, passerTil } from '../scene3d.js';
import { glød } from './faelles.js';
import { lavKlippeplanet } from '../solsystem/klippeplanet.js';
import { lavGasplanet } from '../solsystem/planet.js';
import { lavLuft } from '../solsystem/atmosfaere.js';
import { lavRejse } from '../solsystem/rejse.js';
import { hent, glem, iLager } from '../solsystem/hent.js';
import { lavHentebjælke, tonInd } from '../hentning.js';
import { VENUS, pol, knude, solRetning, meridian, underSolen } from '../data/venus.js';
import { SIDE, SIDER } from '../data/sider/venus.js';
import { vindVed, SKY_HØJDE } from '../data/vinde-venus.js';

const S = 1000; // km pr. enhed
const R_KM = VENUS.radius; // 6.051,0 km (kortenes kugle)
// Højderne i kortet (m over 6.051,0 km). Skal være de samme som i billeder/solsystem/lav_venus.py.
export const HØJDE_MIN = -3500;
export const HØJDE_MAX = 12500;
const OVERDRIV = 10; // "Bjergene 10 gange højere"
const MARGEN = 2; // km: så tæt på jorden må kameraet komme
// Tiden: ▶ en time i sekundet (skyerne kredser på ca. 1½ minut), ⏩ seks timer i sekundet (ca. 16 sekunder, og Solen
// står op i vest: 116,75 døgn er ca. 8 minutter)
export const SEK_PR_SEK = 3600;
export const HURTIG = 6;
const GRAD = Math.PI / 180;
// Radarens gråtoner ganges med denne farve: orange som lyset under skyerne (Veneras fotos). Radaren ser ikke farver.
const TONE = [0.92, 0.5, 0.24];
const MØRK = [0.03, 0.024, 0.018]; // Venus' farve, før kortet er hentet
const BRUN = [0.46, 0.25, 0.12]; // farven, hvis kortet ikke kan hentes (fx uden net): radarens middel, tonet
// Skyerne: kuglen i skyernes top (Akatsukis kort er regnet 70 km over NSSDC's radius)
const SKY_KM = VENUS.middelRadius + SKY_HØJDE;
// Farven og kontrasten i kortet (planet.js med toner): I synligt lys er Venus lyst gullig hvid og næsten glat. I
// ultraviolet lys ses striberne og det store "Y". Kortets gråtoner fylder ±4 gange spredningen (lav_venus_skyer.py),
// så kontrasten SKY_ÆGTE giver lysstyrken, som Akatsuki målte den.
const SKY_ÆGTE = 0.94; // 8 · spredning / middel (lav_venus_skyer.py: spredningen er 11,8 % af middel)
const SYNLIG = { tone: [0.97, 0.92, 0.8], kontrast: SKY_ÆGTE * 0.1 };
const UV = { tone: [0.5, 0.53, 0.66], kontrast: SKY_ÆGTE * 2.4 }; // lysest ca. 1, så gløden ikke breder sig
const VIND_RÆKKER = 256;
const VIND_SKALA = 1e-3; // tallene i vindens tekstur er uv pr. sekund delt med VIND_SKALA (passer til HalfFloat)
const FASE = 24; // sekunder: kortet glider i faser med resten af vinden (en fase er et døgn ved ▶)
// Vinkelfarten (radianer pr. sekund, + er mod øst) ved bredden phi (grader) og den, kuglen drejer med (ved ækvator)
const vinkelfart = (phi) => vindVed(phi) / 1000 / (SKY_KM * Math.max(Math.cos(phi * GRAD), 1e-4));
export const SKY_OMEGA = vinkelfart(0);

export default {
  id: 'venus',
  navn: 'Venus',
  ikon: '🟡',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Planeten under skyerne',
  træ: { rod: 'venus', grupper: [] }, // stederne under skyerne kommer i V3
  kamera: { retning: [0.2, 0.15, 1], radius: R_KM / S },
  tal: [
    ['Venus\' bredde', 'ca. 12.100 km'],
    ['Én omgang om sig selv', '243 jorddøgn'],
    ['Fra solopgang til solopgang', 'ca. 117 jorddøgn'],
    ['Et år', 'ca. 225 jorddøgn'],
  ],
  side: SIDE, // teksten i højre panel (js/data/sider/venus.js)
  sider: SIDER,

  lav(gruppe, { opdaterKnapper, verden }) {
    const { kamera } = verden;
    const orbit = verden.styring;
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, zoom: orbit.zoomSpeed, drej: orbit.rotateSpeed };
    orbit.minDistance = 0.001; // rejsen holder selv afstanden (i systemets enheder)
    orbit.maxDistance = 1e5;
    kamera.near = 0.005;
    kamera.updateProjectionMatrix();
    const maks = verden.renderer.capabilities.maxTextureSize;
    const anisotropi = Math.min(8, verden.renderer.capabilities.getMaxAnisotropy());
    let hurtig = false;
    let modlys = false;
    let høj = false;
    let aktiv = true;
    let uv = false; // "Ultraviolet (som Akatsuki)"
    let under = 0; // skyderen "Under skyerne" (0-100 %)

    // ---------- Datoen og Solen ----------
    const nu = new Date();
    let dato = nu.getTime(); // programmets dato (ms), går, når tiden går
    const sol = new THREE.Vector3(...solRetning(nu)); // Solens retning i systemet (ekliptikkens retninger)

    // ---------- Kloden ----------
    const net = TEST_HURTIG ? [256, 128] : LAV_KVALITET ? [768, 384] : [1024, 512]; // felter omkring og fra pol til pol
    const venus = lavKlippeplanet({ skala: S, radius: R_KM, højdeMin: HØJDE_MIN, højdeMax: HØJDE_MAX, net, farve: MØRK, tone: TONE });
    const R = venus.radius;
    // Aksen mod IAU's nordpol og kortets længde 0° mod knuden (kuglens egne retninger: længde 0° mod +x, nord mod +y
    // og 90° Ø mod −z). Omdrejningen drejer derefter kortet W grader mod øst om polen.
    const akse = new THREE.Vector3(...pol(nu));
    const nul = new THREE.Vector3(...knude(nu));
    const øst = new THREE.Vector3().crossVectors(akse, nul); // 90° øst for knuden
    const hæld = new THREE.Group();
    hæld.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(nul, akse, øst.clone().negate()));
    const omdrejning = new THREE.Group();
    omdrejning.add(venus.mesh);
    hæld.add(omdrejning);
    const system = new THREE.Group(); // hele Venus, som kameraets rejse skalerer og flytter
    system.add(hæld);
    gruppe.add(system);
    // Kortet står W grader øst for knuden (W bliver mindre med tiden: Venus drejer baglæns)
    const drejTil = (ms) => {
      const w = meridian(new Date(ms)) % 360;
      omdrejning.rotation.y = w * GRAD;
    };
    drejTil(dato);

    // ---------- Skyerne ----------
    // Vinden, der er tilbage, når kuglen drejer med SKY_OMEGA: uv pr. sekund ved ▶ (+ er mod øst)
    const restUv = (phi) => ((vinkelfart(phi) - SKY_OMEGA) * SEK_PR_SEK) / (Math.PI * 2);
    const vindData = new Uint16Array(VIND_RÆKKER);
    for (let j = 0; j < VIND_RÆKKER; j++) vindData[j] = THREE.DataUtils.toHalfFloat(restUv(((j + 0.5) / VIND_RÆKKER - 0.5) * 180) / VIND_SKALA);
    const vindTekstur = new THREE.DataTexture(vindData, VIND_RÆKKER, 1, THREE.RedFormat, THREE.HalfFloatType);
    vindTekstur.minFilter = vindTekstur.magFilter = THREE.LinearFilter;
    vindTekstur.needsUpdate = true;
    const skyer = lavGasplanet({
      skala: S, radius: SKY_KM, polRadius: SKY_KM, segmenter: TEST_HURTIG ? 64 : LAV_KVALITET ? 128 : 192,
      vind: { tekstur: vindTekstur, skala: VIND_SKALA, fase: FASE }, toner: true, gennemsigtig: true, kantFarve: [1.0, 0.92, 0.75],
    });
    const skyDrej = new THREE.Group(); // skyerne drejer med vinden ved ækvator (de andre bredder glider i kortet)
    skyDrej.add(skyer.mesh);
    hæld.add(skyDrej);
    let skySek = 0; // sekunder i virkeligheden, siden Venus blev åbnet (skyerne har kørt med vinden)
    const drejSkyer = () => { skyDrej.rotation.y = omdrejning.rotation.y + ((SKY_OMEGA * skySek) % (Math.PI * 2)); };
    drejSkyer();
    // Disen over skyerne (ca. 70-90 km): tynd og lys, og den lyser som en ring, når Solen står bag Venus
    const dis = lavLuft({ skala: S, radius: SKY_KM, H: 4, top: 30, tusmørke: 4, styrke: 0.35, farve: [0.95, 0.88, 0.72], blaa: [0.95, 0.88, 0.72] });
    hæld.add(dis.mesh);
    let skyTone = 0; // skyerne toner ind fra mørk, når kortet er hentet
    let fUv = 0; // glider mod 0 (synligt lys) eller 1 (ultraviolet)
    const tone = [0, 0, 0];
    function sætSkyFarve() {
      for (let i = 0; i < 3; i++) tone[i] = THREE.MathUtils.lerp(MØRK[i], THREE.MathUtils.lerp(SYNLIG.tone[i], UV.tone[i], fUv), skyTone);
      skyer.sætToner(tone, THREE.MathUtils.lerp(SYNLIG.kontrast, UV.kontrast, fUv));
    }
    sætSkyFarve();
    // Hvor dækkende skylaget er (skyderen "Under skyerne"). Helt væk tegnes det ikke.
    function sætUnder(v) {
      under = v;
      const a = 1 - v / 100;
      skyer.sætAlfa(a);
      skyer.mesh.visible = a > 0.005;
      dis.mesh.material.uniforms.styrke.value = 0.35 * a;
      dis.mesh.visible = a > 0.005;
      venus.mesh.visible = a < 0.999; // under helt dækkende skyer kan jorden ikke ses, så den tegnes ikke
    }
    sætUnder(under);

    // ---------- Kortene ----------
    // Skyerne først (det, man ser): 1k (ca. 0,1 MB), som toner ind fra den mørke kugle, og så 4k (pc) eller 2k. Så
    // radarkortet i to trin: først 2k (ca. 0,4 MB), som toner ind, og så det store kort (8k er ca. 5,8 MB), som skiftes
    // ind uden tone. Højderne 4k (tests 2k).
    const skyStr = TEST_HURTIG ? '1k' : LAV_KVALITET ? '2k' : '4k';
    const kortStr = TEST_HURTIG ? '2k' : maks >= 8192 && !LAV_KVALITET ? '8k' : '4k';
    const højdeStr = TEST_HURTIG ? '2k' : '4k';
    const hentet = { skyer: false, kort: false, højde: false };
    const bjælke = lavHentebjælke();
    const nyeSkyer = !iLager(`venus-skyer-${skyStr}.jpg`);
    let skyVist = false;
    const visSkyer = (t) => {
      skyer.sætKort(t);
      if (skyVist) return;
      skyVist = true;
      bjælke.færdig();
      if (nyeSkyer) tonInd((v) => { skyTone = v; if (aktiv) sætSkyFarve(); });
      else { skyTone = 1; sætSkyFarve(); }
    };
    const skyTrin = skyStr !== '1k' && nyeSkyer;
    if (nyeSkyer) bjælke.vent('Henter Venus …');
    const gråSky = { farve: false, kanaler: 1, anisotropi };
    if (skyTrin) hent('venus-skyer-1k.jpg', (t) => { if (!hentet.skyer) visSkyer(t); }, gråSky);
    hent(`venus-skyer-${skyStr}.jpg`, (t) => {
      visSkyer(t);
      hentet.skyer = true;
      if (skyTrin) glem('venus-skyer-1k.jpg');
    }, { ...gråSky, fejl: () => { if (!skyVist) { skyTone = 1; sætSkyFarve(); bjælke.færdig(); } } });
    const nyHentning = !iLager(`venus-radar-${kortStr}.jpg`);
    let kortVist = false, kortTone = 1;
    const visKort = (t) => {
      venus.sætKort(t);
      venus.toneKort(kortTone);
      if (kortVist) return;
      kortVist = true;
      if (nyHentning) tonInd((v) => { kortTone = v; if (aktiv) venus.toneKort(v); });
    };
    const toTrin = kortStr !== '2k' && nyHentning;
    const gråt = { farve: false, kanaler: 1, anisotropi }; // radaren er målinger i gråtoner (én kanal)
    if (toTrin) hent('venus-radar-2k.jpg', (t) => { if (!hentet.kort) visKort(t); }, gråt);
    hent(`venus-radar-${kortStr}.jpg`, (t) => {
      visKort(t);
      hentet.kort = true;
      if (toTrin) glem('venus-radar-2k.jpg');
    }, { ...gråt, fejl: () => { if (!kortVist) venus.sætFarve(BRUN); } });
    hent(`venus-hoejde-${højdeStr}.png`, (t) => { venus.sætHøjde(t); hentet.højde = true; }, { farve: false, kanaler: 2 });

    // Solen: en lille, skarp prik langt væk i lysets retning (fra Venus ser den ca. 1,4 gange så stor ud som fra Jorden)
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.028 : 0.022);
    const solGlød = glød(0xffe2b0, 0.2, 0.6);
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
      return (venus.overflade(lokal) + MARGEN / R_KM) * R;
    }
    const rejse = lavRejse({ system, verden, bund });
    let overdriv = 1; // glider mod 1 eller OVERDRIV
    // Over skyerne (og over toppen af Maxwell Montes, ca. 11,7 km over kuglen). Med "Bjergene 10 gange højere" ligger
    // skyerne også 10 gange højere, så bjergene ikke stikker op gennem dem.
    const skyFaktor = () => (R_KM + (SKY_KM - R_KM) * overdriv) / SKY_KM;
    const minOverblik = () => Math.max(R * (1.006 + 0.002 * overdriv), (SKY_KM / S) * skyFaktor() * 1.004);
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
    // Træet: "Venus" flyver tilbage til hele kloden (stederne kommer i V3)
    function gåTil() {
      helPlanet(kameraRetning());
    }

    // ---------- Styr-boksen ----------
    const styring = [];
    // Skyderen "Under skyerne": 0 er skyerne, som de er, 100 er helt væk (jorden, som om luften var væk)
    const underSkyder = { skyder: true, navn: 'Under skyerne', min: 0, max: 100, trin: 1, værdi: under, vis: (v) => (v ? `${v} % væk` : 'skyerne er der'), ændring: sætUnder };
    function lavKnapper() {
      styring.splice(0, styring.length,
        underSkyder,
        { tekst: 'Ultraviolet (som Akatsuki)', til: uv, skift: (til) => { uv = til; } },
        { tekst: 'Bjergene 10 gange højere', til: høj, skift: (til) => { høj = til; } },
        { tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } },
      );
      opdaterKnapper();
    }
    lavKnapper();

    // ---------- Hvert billede ----------
    let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)
    const solNu = new THREE.Vector3(); // i verden
    const op = new THREE.Vector3(0, 1, 0);
    const opVinkelret = new THREE.Vector3();
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
      venus.overdriv = overdriv;
      const sk = skyFaktor();
      skyDrej.scale.setScalar(sk);
      dis.mesh.scale.setScalar((SKY_KM / S) * (1 + 30 / SKY_KM) * sk); // som lavLuft laver den (top 30 km)
      // Synligt lys eller ultraviolet glider blødt (med "reducer bevægelse" med det samme)
      const uvMål = uv ? 1 : 0;
      fUv = ROLIG ? uvMål : uvMål + (fUv - uvMål) * Math.exp(-dt * 4);
      if (Math.abs(fUv - uvMål) < 0.002) fUv = uvMål;
      sætSkyFarve();
      if (minOverblik() !== minNu) {
        minNu = minOverblik();
        rejse.grænser(minNu, R * 15);
      }
      rejse.opdater(dt);
      const k = rejse.skala;
      // I modlys står Solen lige bag den øverste kant af Venus, set fra kameraet (som ved Mars)
      if (modlys) {
        kamPos.copy(kamera.position).sub(system.position);
        const afstand = kamPos.length();
        kamPos.divideScalar(afstand);
        const kantVinkel = Math.asin(Math.min(1, (R * k) / afstand));
        const bag = Math.max(kantVinkel - 0.05, kantVinkel * 0.5);
        opVinkelret.copy(op).addScaledVector(kamPos, -op.dot(kamPos));
        if (opVinkelret.lengthSq() < 1e-6) opVinkelret.set(1, 0, 0);
        opVinkelret.normalize();
        solNu.copy(kamPos).multiplyScalar(-Math.cos(bag)).addScaledVector(opVinkelret, Math.sin(bag));
      } else solNu.copy(sol).applyQuaternion(rejse.drejning);
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solNu, 600);
      venus.sæt(solNu);
      skyer.sæt(solNu, skySek / SEK_PR_SEK);
      dis.sæt(solNu);
      // Tæt på drejer og zoomer man langsommere, så landskabet ikke suser forbi
      const højde = Math.max(rejse.afstand - R, 0) / rejse.afstand;
      orbit.zoomSpeed = THREE.MathUtils.clamp(højde * 2, 0.06, 1);
      orbit.rotateSpeed = THREE.MathUtils.clamp(højde * 2, 0.04, 1);
    }
    verden.opdateringer.add(hvertBillede);

    // Kun til tests: Solens højde og retning set fra et sted (bredde, længde i grader øst), i kuglens egne retninger
    const solLokal = new THREE.Vector3();
    function solVed(bredde, længde) {
      const st = venus.sted(bredde, længde);
      solLokal.copy(sol).applyQuaternion(planetDrejning().invert());
      return {
        højde: Math.asin(THREE.MathUtils.clamp(solLokal.dot(st.op), -1, 1)) / GRAD,
        øst: solLokal.dot(st.øst), // > 0: Solen står mod øst
        nord: solLokal.dot(st.nord),
      };
    }

    return {
      styring,
      gåTil,
      sted: () => 'venus',
      hurtig: 'seks timer i sekundet',
      tempo: (t) => { hurtig = t === 'hurtig'; },
      // Kaldes kun, når tiden går (tidsknappen): datoen går frem, Venus drejer baglæns, og Solen følger banen
      opdater(dt) {
        const sek = dt * (hurtig ? HURTIG : 1) * SEK_PR_SEK;
        dato += sek * 1000;
        skySek += sek;
        drejTil(dato);
        drejSkyer();
        sol.set(...solRetning(new Date(dato)));
      },
      stop() {
        aktiv = false;
        bjælke.fjern();
        verden.opdateringer.delete(hvertBillede);
        for (const s of [solKerne, solGlød]) s.material.dispose();
        rejse.stop();
        venus.stop();
        skyer.mesh.geometry.dispose();
        skyer.mesh.material.dispose();
        vindTekstur.dispose();
        dis.stop();
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
        // Punktet under Solen: regnet i 3D-billedet (Solens retning i kuglens egne retninger) og i js/data/venus.js
        underSolen() {
          solLokal.copy(sol).applyQuaternion(planetDrejning().invert());
          const længde = ((Math.atan2(-solLokal.z, solLokal.x) / GRAD) + 360) % 360;
          return { bredde: Math.asin(THREE.MathUtils.clamp(solLokal.y, -1, 1)) / GRAD, længde, data: underSolen(new Date(dato)) };
        },
        solVed,
        // Aksen: vinklen mellem kuglens nordpol og IAU's nordpol (grader) og mellem nordpolen og banens normal
        akse() {
          const n = new THREE.Vector3(0, 1, 0).applyQuaternion(hæld.quaternion);
          return { modIAU: n.angleTo(akse) / GRAD, radius: R * S };
        },
        overdriv: () => overdriv,
        hurtigGange: HURTIG,
        // Skyerne: hvor langt de er kørt (grader mod øst) siden start ved bredden phi, som shaderen flytter dem (kuglens
        // drejning ud over planetens og kortets glidning i faser, uden faserne), og farven, kontrasten og dækningen
        skyVinkel(phi) {
          const drej = ((skyDrej.rotation.y - omdrejning.rotation.y) % (Math.PI * 2)) / GRAD;
          return { drej, glid: restUv(phi) * (skySek / SEK_PR_SEK) * 360, sek: skySek };
        },
        vind: (phi) => vinkelfart(phi) * SKY_KM * 1000 * Math.cos(phi * GRAD),
        vindTekstur(phi) {
          const i = Math.min(VIND_RÆKKER - 1, Math.max(0, Math.floor((phi / 180 + 0.5) * VIND_RÆKKER)));
          return THREE.DataUtils.fromHalfFloat(vindData[i]) * VIND_SKALA;
        },
        skyer: () => ({ alfa: skyer.mesh.material.uniforms.uAlfa.value, synlig: skyer.mesh.visible, under, uv: fUv, tone: [...tone], kontrast: skyer.mesh.material.uniforms.uKontrast.value, radius: SKY_KM * skyDrej.scale.x, harKort: skyer.mesh.material.uniforms.uHarKort.value, tid: skyer.mesh.material.uniforms.uTid.value }),
        sætUnder: (v) => { sætUnder(v); underSkyder.sæt?.(v); },
        // Kameraet lavt over skyerne ved grænsen mellem dag og nat (kun til billeder)
        tætPå() {
          const r = sol.clone().applyAxisAngle(Y, 75 * GRAD).addScaledVector(Y, 0.15).normalize();
          rejse.flyv({ fokus: () => nulPunkt, afstand: R * 2.4, retning: r, min: minOverblik(), max: R * 15 });
          rejse.hop();
        },
        billeder: () => ({ kort: kortStr, højde: højdeStr, net, hentet: { ...hentet }, tabel: venus.harTabel, tone: kortTone, skyer: skyStr, bjælke: { venter: bjælke.venter, vist: bjælke.vist } }),
        tur: () => ({ flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand }),
        hop: () => rejse.hop(),
        // Højden over kuglen (km, glat) et sted (bredde, længde i grader øst)
        højde(bredde, længde) {
          const r = venus.sted(bredde, længde).retning;
          return (venus.punkt(r, lokal).length() - 1) * R_KM;
        },
        // Sol: −1 = Solen står lige bag Venus set fra kameraet
        sol: () => solNu.dot(kamPos.copy(kamera.position).sub(orbit.target).normalize()),
      },
    };
  },
};
