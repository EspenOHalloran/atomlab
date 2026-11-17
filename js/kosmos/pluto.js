// Pluto og Charon (docs/drejebog-merkur-pluto.md). MP3: kortet, højderne, Charon, dansen om det fælles tyngdepunkt og
// disen. Kloden er New Horizons' kort over Pluto med farverne og højderne (klippeplanet.js som Mars, Venus og Merkur).
// Charon er en måne med et kort i gråtoner (maane.js) og en rødbrun nordpol. Står i Solsystemet efter Neptun (efter
// afstanden til Solen). Tallene står i docs/fakta-solsystemet/del8-merkur-og-pluto.md og js/data/pluto.js. Stederne
// (hjertet og bjergene), flybyen og resten af siden kommer i MP4.
//
// - 1 enhed = 1.000 km. Pluto, Charon og afstanden imellem dem er i samme skala: Her behøver vi ikke snyde.
// - Systemet ligger i ekliptikkens retninger. Aksen peger mod IAU's positive pol, og kortets længde 0° står W grader
//   øst for knuden, så Pluto står, som den gør på datoen. Charon står over længde 0° på Pluto og vender selv længde 0°
//   mod Pluto (bundet begge veje), så Pluto og Charon drejer som ét stift legeme om aksen gennem tyngdepunktet.
// - Systemets midte er Plutos midte (så kameraet kan holdes over bjergene), og tyngdepunktet ligger 2.126 km ude mod
//   Charon. Ser man hele Pluto, kigger kameraet på Plutos midte tæt på og glider over til tyngdepunktet længere ude. Så
//   står tyngdepunktet stille på skærmen, og man ser Pluto og Charon danse om det (med tiden ⏩).
// - Kortet har 180° i midten (som kilden, så hjertet ikke ligger på kortets kant): klippeplanet.js' midte.
// - Det sydligste (syd for ca. 30-40° S) lå i mørke, da New Horizons fløj forbi i 2015. Det er mørkt i kortet, og
//   højderne findes kun på den side, sonden så. Bagsiden er glat, fordi vi ikke ved bedre.
// - Disen (js/kosmos/pluto-dis.js) lyser blåt i modlys. "Modlys" flyver kameraet om bag Pluto.
// - Indstillinger: "Modlys" og "Navne" (Charon, tyngdepunktet og banerne).

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, passerTil } from '../scene3d.js';
import { glød, skilt } from './faelles.js';
import { lavKlippeplanet } from '../solsystem/klippeplanet.js';
import { lavIsmåne } from '../solsystem/maane.js';
import { lavRejse } from '../solsystem/rejse.js';
import { navneTil, navneKnap } from '../solsystem/navne.js';
import { hent, glem, iLager } from '../solsystem/hent.js';
import { startDato } from '../solsystem/dato.js';
import { lavHentebjælke, tonInd } from '../hentning.js';
import { lavDis } from './pluto-dis.js';
import { PLUTO, CHARON, TYNGDEPUNKT, pol, knude, solRetning, meridian, underSolen } from '../data/pluto.js';
import { SIDE, SIDER } from '../data/sider/pluto.js';

const S = 1000; // km pr. enhed
const R_KM = PLUTO.radius; // 1.188,3 km (kortenes kugle)
// Højderne i kortet (m over 1.188,3 km). Skal være de samme som i billeder/solsystem/lav_pluto.py.
export const HØJDE_MIN = -4200;
export const HØJDE_MAX = 6600;
const MIDTE = 180; // kortenes midte (længde)
const MARGEN = 1; // km: så tæt på jorden må kameraet komme
// Tiden: ▶ 2,4 timer i sekundet (Pluto og Charon er ca. 64 sekunder om en omgang), ⏩ et døgn i sekundet (ca. 6 s)
export const SEK_PR_SEK = 8640;
export const HURTIG = 10;
const GRAD = Math.PI / 180;
const MØRK = [0.03, 0.026, 0.024]; // Plutos farve, før kortet er hentet
const LYS = [0.55, 0.47, 0.42]; // farven, hvis kortet ikke kan hentes (fx uden net)
const ANISOTROPI = 16;
// Charon: et svagt skær på kortet, og hvor lyst kortet er i forhold til Plutos (Charon er lidt mørkere: geometrisk albedo
// ca. 0,4 mod Plutos 0,52 (NSSDC). Charons tal er ca. og fra hukommelsen, så forholdet er kun et skøn)
const CHARON_FARVE = [0.95, 0.94, 0.93];
const CHARON_LYS = 0.85;
const TONE_SKALA = 1.4; // charon-tone.jpg er gemt delt med 1,4 (lav_pluto.py)

// Træet i listen til venstre: Charon (stederne og flybyen kommer i MP4)
const TRÆ = {
  rod: 'pluto',
  grupper: [
    { navn: 'Måner', punkter: [{ id: 'charon', navn: 'Charon', undertitel: 'Plutos store måne' }] },
  ],
};

export default {
  id: 'pluto',
  navn: 'Pluto',
  ikon: '🤍',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Dværgplaneten med hjertet',
  træ: TRÆ,
  kamera: { retning: [0.2, 0.15, 1], radius: R_KM / S },
  tal: [
    ['Plutos bredde', 'ca. 2.380 km'],
    ['Én omgang om sig selv', 'ca. 6,4 jorddøgn'],
    ['Et år', 'ca. 248 jordår'],
    ['På jorden', 'ca. −230 °C'],
  ],
  side: SIDE, // teksten i højre panel (js/data/sider/pluto.js)
  sider: SIDER,

  lav(gruppe, { opdaterKnapper, verden, fase, forklaring, tiden }) {
    const { kamera } = verden;
    const orbit = verden.styring;
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, zoom: orbit.zoomSpeed, drej: orbit.rotateSpeed };
    orbit.minDistance = 0.001; // rejsen holder selv afstanden (i systemets enheder)
    orbit.maxDistance = 1e5;
    kamera.near = 0.003;
    kamera.updateProjectionMatrix();
    const maks = verden.renderer.capabilities.maxTextureSize;
    const anisotropi = Math.min(ANISOTROPI, verden.renderer.capabilities.getMaxAnisotropy());
    let hurtig = false;
    let modlys = false;
    let aktiv = true;

    // ---------- Datoen og Solen ----------
    const nu = new Date(startDato()); // overblikkets dato (js/solsystem/dato.js)
    let dato = nu.getTime(); // programmets dato (ms), går, når tiden går
    const sol = new THREE.Vector3(...solRetning(nu)); // Solens retning i systemet (ekliptikkens retninger)

    // ---------- Pluto ----------
    const net = TEST_HURTIG ? [256, 128] : LAV_KVALITET ? [768, 384] : [1024, 512];
    const pluto = lavKlippeplanet({ skala: S, radius: R_KM, højdeMin: HØJDE_MIN, højdeMax: HØJDE_MAX, net, farve: MØRK, midte: MIDTE });
    const R = pluto.radius;
    // Aksen mod IAU's positive pol og længde 0° mod knuden (kuglens forælder: længde 0° mod +x, nord mod +y og 90° Ø
    // mod −z). Omdrejningen drejer derefter W grader mod øst om polen, og Charon drejer med.
    const akse = new THREE.Vector3(...pol());
    const nul = new THREE.Vector3(...knude());
    const øst = new THREE.Vector3().crossVectors(akse, nul);
    const hæld = new THREE.Group();
    hæld.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(nul, akse, øst.clone().negate()));
    const omdrejning = new THREE.Group();
    omdrejning.add(pluto.mesh);
    hæld.add(omdrejning);
    const system = new THREE.Group(); // Pluto og Charon, som kameraets rejse skalerer og flytter
    system.add(hæld);
    gruppe.add(system);
    const drejTil = (ms) => { omdrejning.rotation.y = (meridian(new Date(ms)) % 360) * GRAD; };
    drejTil(dato);

    // ---------- Charon: over længde 0° på Pluto, og Charons længde 0° vender mod Pluto ----------
    const RC = CHARON.radius / S;
    const D_C = CHARON.afstand / S;
    const charon = lavIsmåne(RC, { farve: CHARON_FARVE, lys: CHARON_LYS, segmenter: TEST_HURTIG ? 64 : 160 });
    charon.gruppe.position.set(D_C, 0, 0);
    charon.gruppe.rotation.y = Math.PI;
    omdrejning.add(charon.gruppe);
    const B = TYNGDEPUNKT / S; // tyngdepunktet ligger B ude mod Charon

    // ---------- Disen ----------
    const dis = lavDis({ radius: R_KM, km: S });
    system.add(dis.mesh);

    // ---------- Kortene ----------
    // Plutos kort i to trin: først 2k (ca. 0,3 MB), som toner ind fra den mørke kugle, så det store (8k ca. 3,5 MB på pc,
    // 4k ca. 1,1 MB på tablet). Højderne 4k på pc (ca. 4,9 MB), 2k på tablet og i tests (ca. 1,4 MB). Charon 2k (0,3 MB).
    const kortStr = TEST_HURTIG ? '2k' : maks >= 8192 && !LAV_KVALITET ? '8k' : '4k';
    const højdeStr = TEST_HURTIG || LAV_KVALITET ? '2k' : '4k';
    const hentet = { kort: false, højde: false, charon: false, tone: false };
    const bjælke = lavHentebjælke();
    const nyHentning = !iLager(`pluto-kort-${kortStr}.jpg`);
    let kortVist = false, kortTone = 1;
    const visKort = (t) => {
      pluto.sætKort(t);
      pluto.toneKort(kortTone);
      if (kortVist) return;
      kortVist = true;
      bjælke.færdig();
      if (nyHentning) tonInd((v) => { kortTone = v; if (aktiv) pluto.toneKort(v); });
    };
    const toTrin = kortStr !== '2k' && nyHentning;
    if (nyHentning) bjælke.vent('Henter Pluto …');
    if (toTrin) hent('pluto-kort-2k.jpg', (t) => { if (!hentet.kort) visKort(t); }, { anisotropi });
    hent(`pluto-kort-${kortStr}.jpg`, (t) => {
      visKort(t);
      hentet.kort = true;
      if (toTrin) glem('pluto-kort-2k.jpg');
    }, { anisotropi, fejl: () => { if (!kortVist) { pluto.sætFarve(LYS); bjælke.færdig(); } } });
    hent(`pluto-hoejde-${højdeStr}.png`, (t) => { pluto.sætHøjde(t); hentet.højde = true; }, { farve: false, kanaler: 2 });
    hent('charon-2k.jpg', (t) => { charon.sætKort(t); hentet.charon = true; }, { farve: false, kanaler: 1, anisotropi: 4 });
    hent('charon-tone.jpg', (t) => { charon.sætTone(t, TONE_SKALA); hentet.tone = true; }, { farve: false });

    // Solen: en lille, blændende prik (fra Pluto er den kun ca. 1/39 så bred som fra Jorden)
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.03 : 0.022);
    const solGlød = glød(0xffe2b0, 0.16, 0.55);
    for (const s of [solKerne, solGlød]) {
      s.material.sizeAttenuation = false;
      s.renderOrder = -1;
      gruppe.add(s);
    }

    // ---------- Kameraets rejse (js/solsystem/rejse.js) ----------
    const qPlanet = new THREE.Quaternion();
    const planetDrejning = () => qPlanet.copy(hæld.quaternion).multiply(omdrejning.quaternion); // omdrejningen → systemet
    const lokal = new THREE.Vector3();
    function bund(p) {
      lokal.copy(p).applyQuaternion(planetDrejning().invert()).divideScalar(R);
      return (pluto.overflade(lokal) + MARGEN / R_KM) * R;
    }
    // Charons midte og tyngdepunktet i systemets retninger
    const charonPunkt = (ud = new THREE.Vector3()) => ud.set(D_C, 0, 0).applyQuaternion(planetDrejning());
    const tyngdePunkt = (ud = new THREE.Vector3()) => ud.set(B, 0, 0).applyQuaternion(planetDrejning());
    // Kameraet må ikke komme ind i Charon
    const cMidt = new THREE.Vector3();
    function udenom(p) {
      charonPunkt(cMidt);
      const r = RC * 1.004 + MARGEN / S;
      if (p.distanceToSquared(cMidt) >= r * r) return false;
      p.sub(cMidt).setLength(r).add(cMidt);
      return true;
    }
    const rejse = lavRejse({ system, verden, bund, udenom });
    const minOverblik = () => R * 1.008; // over det højeste sted (ca. 6,3 km)
    rejse.grænser(minOverblik(), R * 60);
    function passer(radius) {
      passerTil(10);
      const f = (verden.målAfstand ?? 40) / 10;
      verden.målAfstand = null;
      return radius * f;
    }
    // Hele Pluto: Tæt på kigger kameraet på Plutos midte, længere ude (fra ca. 3 til 8 radier) glider det over til
    // tyngdepunktet, så man ser dansen. I modlys altid Plutos midte (så Solen bliver bag Pluto).
    const fokusPunkt = new THREE.Vector3();
    const fokusHel = () => {
      const f = modlys ? 0 : THREE.MathUtils.smoothstep(rejse.afstand / R, 3, 8);
      return tyngdePunkt(fokusPunkt).multiplyScalar(f);
    };
    // Startbilledet: set fra Solens side, så det oplyste ses, ca. 25° over ækvator ved længden under Solen
    const Y = new THREE.Vector3(0, 1, 0);
    function startRetning() {
      const u = underSolen(new Date(dato));
      const st = pluto.sted(25, u.længde);
      return st.retning.clone().applyQuaternion(planetDrejning()).normalize();
    }
    const helPlanet = (retning, færdig, afstand = R) => rejse.flyv({ fokus: fokusHel, afstand: passer(afstand), retning, min: minOverblik(), max: R * 60, færdig });
    const kamPos = new THREE.Vector3();
    function kameraRetning() {
      rejse.kameraPunkt(kamPos);
      return kamPos.lengthSq() < 1e-9 ? startRetning() : kamPos.normalize();
    }
    // 'pluto' (hele kloden), 'charon' eller 'test' (kigPå)
    let visning = 'pluto';

    // Charon tæt på: kameraet ude bag Charon (set fra Pluto) og mod nord, så den røde nordpol ses og Pluto står bagved
    function tilCharon(færdig) {
      tiden?.('pause');
      visning = 'charon';
      modlys = false;
      // Kameraet ca. 16° fra linjen gennem Pluto og Charon, så Pluto står lige ved siden af Charon
      const ud = charonPunkt(new THREE.Vector3()).normalize();
      const nord = akse.clone();
      const side = new THREE.Vector3().crossVectors(nord, ud).normalize();
      const skråt = nord.multiplyScalar(0.55).addScaledVector(side, 0.85).normalize();
      const retning = ud.multiplyScalar(Math.cos(16 * GRAD)).addScaledVector(skråt, Math.sin(16 * GRAD)).normalize();
      const afstand = passer(RC * 1.7);
      rejse.flyv({ fokus: () => charonPunkt(fokusPunkt), afstand, retning, min: RC * 1.02, max: Math.max(R * 40, afstand * 1.25), færdig });
    }
    // Modlys: kameraet bag Pluto, så Solen står lige bag kanten, og disen lyser som en ring
    function tilModlys() {
      visning = 'pluto';
      const bag = sol.clone().negate();
      const side = new THREE.Vector3().crossVectors(bag, Y).normalize();
      const afstand = R * 4;
      // Lidt til siden: Solen står lige inden for kanten (Pluto ser ca. 14,5° bred ud på 4 radier)
      const retning = bag.addScaledVector(side, Math.tan(5 * GRAD)).normalize();
      rejse.flyv({ fokus: fokusHel, afstand, retning, min: minOverblik(), max: R * 60 });
    }

    // Træet: "Pluto" flyver tilbage til hele kloden, og Charon flyver ud til Charon
    function gåTil(id) {
      if (id === visning) return;
      vis(id);
      fase(null);
      forklaring('');
    }
    function vis(id, færdig) {
      if (id === 'charon') tilCharon(færdig);
      else {
        visning = 'pluto';
        tiden?.('spil');
        if (modlys) tilModlys();
        else helPlanet(kameraRetning(), færdig);
      }
      lavKnapper();
    }
    function sætDato(ms) {
      dato = ms;
      drejTil(dato);
      sol.set(...solRetning(new Date(dato)));
    }

    // ---------- Styr-boksen ----------
    const styring = [];
    function lavKnapper() {
      styring.splice(0, styring.length,
        {
          tekst: 'Modlys', til: modlys, skift: (til) => {
            modlys = til;
            if (til) tilModlys();
            else helPlanet(startRetning());
          },
        },
        navneKnap(() => opdaterNavne()),
      );
      opdaterKnapper();
    }

    // ---------- Navnene: Charon, tyngdepunktet og banerne ----------
    const charonNavn = skilt('Charon', '#e6e2dc', 1);
    const tyngdeNavn = skilt('Fælles tyngdepunkt', '#ffe08a', 1);
    for (const s of [charonNavn, tyngdeNavn]) {
      s.material.depthTest = false;
      s.renderOrder = 6;
      s.visible = false;
      gruppe.add(s);
    }
    charonNavn.center.set(0.5, -0.6);
    tyngdeNavn.center.set(0.5, 1.5); // under krydset (over det står Pluto ofte)
    // Krydset ved tyngdepunktet (to små streger, der altid vender mod kameraet)
    const kryds = lavKryds();
    gruppe.add(kryds);
    // Banerne om tyngdepunktet: Charons midte og Plutos midte går i hver sin cirkel (i Plutos ækvator)
    const baner = new THREE.Group();
    const charonBane = cirkel(D_C - B, 0xbfc8d8, 0.35);
    const plutoBane = cirkel(B, 0xffe08a, 0.6);
    baner.add(charonBane, plutoBane);
    hæld.add(baner);
    let navneVist = false;
    const hjælp = new THREE.Vector3();
    const hjælp2 = new THREE.Vector3();
    const plutoMidt = new THREE.Vector3();
    // Er punktet p (i verden) skjult bag Pluto set fra kameraet?
    function bagPluto(p) {
      plutoMidt.setFromMatrixPosition(system.matrixWorld);
      const rv = R * rejse.skala;
      const d = hjælp3.copy(p).sub(kamera.position);
      const l = d.length();
      d.divideScalar(l);
      const t = plutoMidt.sub(kamera.position).dot(d);
      if (t <= 0 || t >= l) return false;
      return plutoMidt.addScaledVector(d, -t).lengthSq() < rv * rv;
    }
    const hjælp3 = new THREE.Vector3();
    function opdaterNavne() {
      navneVist = navneTil() && !rejse.flyver;
      const k = rejse.skala;
      // Banerne og tyngdepunktet ses, når kameraet er et stykke ude (ved hele Pluto), Charons navn, når den er lille
      const ude = visning === 'pluto' && !modlys ? THREE.MathUtils.smoothstep(rejse.afstand / R, 4, 7) : 0;
      // Banerne ligger om tyngdepunktet (i Plutos ækvator, så de drejer ikke med)
      baner.position.set(B, 0, 0).applyQuaternion(omdrejning.quaternion);
      const aBaner = navneVist ? ude : 0;
      for (const [b, o] of [[charonBane, 0.35], [plutoBane, 0.6]]) { b.material.opacity = o * aBaner; b.visible = aBaner > 0.01; }
      // Krydset og navnet ved tyngdepunktet (ikke, når det er bag Pluto)
      tyngdePunkt(hjælp).applyMatrix4(system.matrixWorld);
      const a = bagPluto(hjælp) ? 0 : aBaner;
      const afstand = hjælp.distanceTo(kamera.position);
      kryds.position.copy(hjælp);
      kryds.quaternion.copy(kamera.quaternion);
      kryds.scale.setScalar(afstand * 0.018);
      kryds.material.opacity = a;
      kryds.visible = a > 0.01;
      const str = afstand * 0.022;
      tyngdeNavn.position.copy(hjælp);
      tyngdeNavn.scale.set((tyngdeNavn.scale.x / tyngdeNavn.scale.y) * str, str, 1);
      tyngdeNavn.material.opacity = a;
      tyngdeNavn.visible = a > 0.01;
      // Charons navn (ikke tæt på Charon)
      charonPunkt(hjælp2).applyMatrix4(system.matrixWorld);
      const afstandC = hjælp2.distanceTo(kamera.position);
      const lille = THREE.MathUtils.smoothstep(afstandC / (RC * k), 12, 20);
      const aC = navneVist && !bagPluto(hjælp2) ? lille : 0;
      const strC = afstandC * 0.024;
      charonNavn.position.copy(hjælp2).addScaledVector(Y.clone().applyQuaternion(kamera.quaternion), RC * k);
      charonNavn.scale.set((charonNavn.scale.x / charonNavn.scale.y) * strC, strC, 1);
      charonNavn.material.opacity = aC;
      charonNavn.visible = aC > 0.01;
    }
    lavKnapper();

    // ---------- Hvert billede ----------
    let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)
    const solNu = new THREE.Vector3(); // i verden
    const grundQ = new THREE.Quaternion();
    function hvertBillede(dt) {
      if (første) {
        første = false;
        helPlanet(startRetning());
        rejse.hop();
      }
      rejse.opdater(dt);
      solNu.copy(sol).applyQuaternion(rejse.drejning);
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solNu, 600);
      pluto.sæt(solNu);
      charon.sæt(solNu);
      dis.sæt(solNu);
      opdaterNavne();
      // Tæt på drejer og zoomer man langsommere, så landskabet ikke suser forbi
      if (visning === 'pluto') {
        const højde = Math.max(rejse.afstand - R, 0) / rejse.afstand;
        orbit.zoomSpeed = THREE.MathUtils.clamp(højde * 2, 0.06, 1);
        orbit.rotateSpeed = THREE.MathUtils.clamp(højde * 2, 0.04, 1);
      } else if (visning === 'test') {
        kamPos.copy(kamera.position).sub(system.position).applyQuaternion(grundQ.copy(rejse.drejning).invert()).divideScalar(rejse.skala);
        const nede = THREE.MathUtils.clamp(((kamPos.length() - bund(kamPos)) * S + MARGEN) / 20, 0.3, 1);
        orbit.zoomSpeed = nede;
        orbit.rotateSpeed = 0.6 * nede;
      } else {
        orbit.zoomSpeed = 1;
        orbit.rotateSpeed = 0.7;
      }
    }
    verden.opdateringer.add(hvertBillede);

    // Bredde og længde (grader øst, −180 til 180) af en retning i omdrejningens retninger (Plutos kort)
    const bl = (r) => ({ bredde: Math.asin(THREE.MathUtils.clamp(r.y, -1, 1)) / GRAD, længde: Math.atan2(-r.z, r.x) / GRAD });

    return {
      styring,
      gåTil,
      sted: () => visning,
      hurtig: 'et døgn i sekundet',
      tempo: (t) => { hurtig = t === 'hurtig'; },
      // Kaldes kun, når tiden går (tidsknappen): datoen går frem, Pluto og Charon drejer, og Solen følger banen
      opdater(dt) {
        dato += dt * (hurtig ? HURTIG : 1) * SEK_PR_SEK * 1000;
        drejTil(dato);
        sol.set(...solRetning(new Date(dato)));
      },
      stop() {
        aktiv = false;
        bjælke.fjern();
        verden.opdateringer.delete(hvertBillede);
        for (const s of [charonNavn, tyngdeNavn]) { s.material.map?.dispose(); s.material.dispose(); }
        for (const o of [kryds, charonBane, plutoBane]) { o.geometry.dispose(); o.material.dispose(); }
        for (const s of [solKerne, solGlød]) s.material.dispose();
        charon.gruppe.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
        dis.stop();
        rejse.stop();
        pluto.stop();
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
        sætDato,
        // Punktet under Solen: regnet i 3D-billedet (Solens retning i Plutos egne retninger) og i js/data/pluto.js
        underSolen() {
          const s = sol.clone().applyQuaternion(planetDrejning().invert());
          return { ...bl(s), data: underSolen(new Date(dato)) };
        },
        // Aksen: vinklen mellem kuglens nordpol og IAU's pol (grader), og kortets midte (længden ved kuglens +x)
        akse() {
          const n = new THREE.Vector3(0, 1, 0).applyQuaternion(hæld.quaternion);
          const midt = new THREE.Vector3(1, 0, 0).applyQuaternion(pluto.mesh.quaternion);
          return { modIAU: n.angleTo(akse) / GRAD, radius: R * S, kortetsMidte: bl(midt).længde };
        },
        // Charon og tyngdepunktet (km og grader): længden på Pluto under Charon, Charons længde mod Pluto, afstanden og
        // tyngdepunktets afstand fra Plutos midte og over overfladen. I systemets retninger (fra 3D-billedet).
        charon() {
          const c = charonPunkt(new THREE.Vector3());
          const iPluto = c.clone().applyQuaternion(planetDrejning().invert()).normalize();
          // Retningen fra Charon mod Pluto i Charons egne retninger
          charon.gruppe.updateWorldMatrix(true, false);
          const mod = new THREE.Vector3(0, 0, 0).applyMatrix4(system.matrixWorld);
          charon.gruppe.worldToLocal(mod).normalize();
          const t = tyngdePunkt(new THREE.Vector3());
          return {
            underCharon: bl(iPluto), charonModPluto: bl(mod), afstand: c.length() * S,
            tyngdepunkt: t.length() * S, overOverfladen: t.length() * S - R_KM,
          };
        },
        fokus: () => ({ x: rejse.fokus.x * S, y: rejse.fokus.y * S, z: rejse.fokus.z * S, fraMidte: rejse.fokus.length() * S }),
        dis: () => ({ styrke: dis.styrke, synlig: dis.mesh.visible }),
        modlys: () => modlys,
        // Vinklen mellem Solen og Plutos midte set fra kameraet (grader), og Plutos vinkelradius
        solBag() {
          const tilP = new THREE.Vector3().setFromMatrixPosition(system.matrixWorld).sub(kamera.position);
          return { vinkel: tilP.angleTo(solNu) / GRAD, plutoRadius: Math.asin(Math.min(1, (R * rejse.skala) / tilP.length())) / GRAD };
        },
        navne: () => ({ charon: charonNavn.visible, tyngdepunkt: tyngdeNavn.visible, kryds: kryds.visible, baner: charonBane.visible }),
        billeder: () => ({ kort: kortStr, højde: højdeStr, net, hentet: { ...hentet }, tabel: pluto.harTabel, tone: kortTone, anisotropi, bjælke: { venter: bjælke.venter, vist: bjælke.vist } }),
        tur: () => ({ flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand }),
        hop: () => rejse.hop(),
        visning: () => visning,
        // Højden over kuglen (km, glat) et sted (bredde, længde i grader øst)
        højde(bredde, længde) {
          const r = pluto.sted(bredde, længde).retning;
          return (pluto.punkt(r, lokal).length() - 1) * R_KM;
        },
        // Kameraet over et sted (bredde, længde i grader øst) i afstand km, med det samme. vinkel: over horisonten
        // (90 = lige ned), kompas: hvorfra kameraet kigger (180 = fra syd). Kun til tests og billeder.
        kigPå(bredde, længde, km, vinkel = 90, kompas = 180) {
          const st = pluto.sted(bredde, længde);
          const a = kompas * GRAD, v = vinkel * GRAD;
          const retning = new THREE.Vector3()
            .addScaledVector(st.nord, Math.cos(v) * Math.cos(a))
            .addScaledVector(st.øst, Math.cos(v) * Math.sin(a))
            .addScaledVector(st.op, Math.sin(v))
            .applyQuaternion(planetDrejning());
          const punkt = new THREE.Vector3();
          visning = 'test';
          rejse.flyv({
            fokus: () => pluto.punkt(st.retning, punkt).multiplyScalar(R).applyQuaternion(planetDrejning()),
            op: () => hjælp.copy(st.op).applyQuaternion(planetDrejning()),
            afstand: km / S, retning, min: 0.002, max: R * 60,
          });
          rejse.hop();
        },
        // Hele Pluto set fra en retning (bredde, længde på Pluto) i afstand (radier), med det samme. Kun til billeder.
        helFra(bredde, længde, radier = 3) {
          visning = 'pluto';
          const r = pluto.sted(bredde, længde).retning.applyQuaternion(planetDrejning());
          rejse.flyv({ fokus: fokusHel, afstand: R * radier, retning: r, min: minOverblik(), max: R * 60 });
          rejse.hop();
        },
      },
    };
  },
};

// Et lille kryds (to streger) i planet z = 0, som vendes mod kameraet
function lavKryds() {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0, 0, 1, 0, 0, 0, -1, 0, 0, 1, 0], 3));
  const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xffe08a, transparent: true, depthTest: false, depthWrite: false }));
  m.renderOrder = 6;
  m.visible = false;
  return m;
}

// En cirkel med radius r i planet y = 0 (Plutos ækvator)
function cirkel(r, farve, opacitet) {
  const punkter = [];
  for (let i = 0; i <= 256; i++) {
    const a = (i / 256) * Math.PI * 2;
    punkter.push(Math.cos(a) * r, 0, Math.sin(a) * r);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(punkter, 3));
  const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: farve, transparent: true, opacity: opacitet, depthWrite: false }));
  l.visible = false;
  return l;
}
