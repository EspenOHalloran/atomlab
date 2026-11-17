// Venus (docs/plan-venus.md). V1: jorden og skelettet. Kloden er Magellans radarkort med højderne (klippeplanet.js
// som Mars), tonet orange, for radaren ser ikke farver. V2: skyerne udenpå (planet.js som Jupiter), der glider med
// vindene. V3: gløden på natsiden og fire steder under skyerne (træet, navnene på kloden og lokale net af Magellans
// 225 m-kort ved Maat Mons og pandekagekuplerne). Flybyen og en lille tur ned til Venera 13 kommer i V5 (jeres svar på
// E18). Står i Solsystemet mellem Solen og Jorden (efter afstanden til Solen).
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
// - Gløden på natsiden (V3): Jorden er så varm, at den gløder (Plancks lov ved 1,0 µm, js/data/venus.js GLØD). Højt
//   oppe er det køligere, så bjergene gløder mindre og ses som mørke pletter. Gennem skyerne ses et sløret kort
//   (billeder/solsystem/lav_venus_steder.py, skyerne spreder lyset), og uden skyer regner shaderen gløden skarpt ud fra
//   højderne (klippeplanet.js). Farven er valgt, og lyset er skruet meget op. Om dagen drukner gløden i sollyset.
// - Stederne (V3): Et sted i træet ("Under skyerne") flyver derhen og tager skyerne væk (skyderen glider til 100 %), og
//   datoen glider derhen, hvor klokken på stedet er tid (fx formiddag med lave skygger). Tilbage ved hele Venus kommer
//   skyerne igen, som de var.
// - Styr-boksen: skyderen "Under skyerne", "Ultraviolet (som Akatsuki)", "Gløden på natsiden", "Bjergene 10 gange
//   højere", "Modlys" og "Navne".

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG, passerTil } from '../scene3d.js';
import { glød, skilt } from './faelles.js';
import { lavKlippeplanet } from '../solsystem/klippeplanet.js';
import { lavGasplanet } from '../solsystem/planet.js';
import { lavLuft } from '../solsystem/atmosfaere.js';
import { lavRejse } from '../solsystem/rejse.js';
import { navneTil, navneKnap } from '../solsystem/navne.js';
import { hent, glem, iLager } from '../solsystem/hent.js';
import { startDato } from '../solsystem/dato.js';
import { lavHentebjælke, tonInd } from '../hentning.js';
import { VENUS, pol, knude, solRetning, meridian, underSolen, datoMedTid, lokalTid, GLØD } from '../data/venus.js';
import { SIDE, SIDER } from '../data/sider/venus.js';
import { vindVed, SKY_HØJDE } from '../data/vinde-venus.js';

const S = 1000; // km pr. enhed
const R_KM = VENUS.radius; // 6.051,0 km (kortenes kugle)
// Højderne i kortet (m over 6.051,0 km). Skal være de samme som i billeder/solsystem/lav_venus.py.
export const HØJDE_MIN = -3500;
export const HØJDE_MAX = 12500;
const OVERDRIV = 10; // "Bjergene 10 gange højere"
const MARGEN = 2; // km: så tæt på jorden må kameraet komme
// Tiden: ▶ en time i sekundet (skyerne kredser på knap 2 minutter), ⏩ seks timer i sekundet (ca. 17 sekunder, og Solen
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
// Gløden: farven, når L = 1 (jorden i middelhøjden). Farven er valgt: Næsten al gløden er infrarød.
const GLØD_FARVE = [0.13, 0.014, 0.0025];

// Stederne under skyerne (V3, jeres svar på Fables tjek E18: fire steder). Bredde og længde (grader øst, fra −180° til
// 180°) fra USGS' navneliste (planetarynames.wr.usgs.gov). fokus: hvor kameraet kigger, hvis det ikke er navnets punkt
// (pandekagekuplerne ligger ca. 0,8° øst for Seoritsu Farras punkt: NASA PIA00215 og 225 m-kortet). tid: klokken på
// stedet, når man er der (datoen glider derhen). kompas: hvorfra kameraet kigger (180° = fra syd). vinkel: over
// horisonten. størrelse: radius af det, der skal være i billedet (1 = 1.000 km). lokalt: et lokalt net (LOKALE).
// Venera 13: NSSDC (7,5° S, 303° Ø). Man har ikke fundet landeren på Magellans billeder, så det er "her omkring".
export const STEDER = [
  { id: 'maxwell', navn: 'Maxwell Montes', bredde: 65.2, længde: 3.3, tid: 9, kompas: 180, vinkel: 28, størrelse: 0.45 },
  { id: 'maat', navn: 'Maat Mons', bredde: 0.5, længde: -165.4, tid: 9, kompas: 180, vinkel: 25, størrelse: 0.26, lokalt: 'maat' },
  { id: 'kupler', navn: 'Pandekagekuplerne', bredde: -30.0, længde: 11.0, fokus: [-29.8, 11.8], tid: 10, kompas: 180, vinkel: 70, størrelse: 0.085, lokalt: 'kupler' },
  { id: 'venera13', navn: 'Venera 13', bredde: -7.5, længde: -57, tid: 10, kompas: 180, vinkel: 50, størrelse: 0.2 },
];
// De lokale net af Magellans radar med 225 m pr. pixel (billeder/solsystem/lav_venus_steder.py, grænserne skal være de
// samme som STEDER dér). Højderne er stadig Magellans 4,6 km pr. pixel, så nettet giver en skarpere overflade, ikke
// skarpere bjerge. radar: kortets størrelse (pc, tablet, tests).
const LOKALE = [
  { id: 'maat', nord: 4.865, syd: -3.865, vest: -169.77, øst: -161.03, radar: ['4k', '2k', '1k'] }, // ca. 920 × 920 km
  { id: 'kupler', nord: -27.82, syd: -32.18, vest: 8.48, øst: 13.52, radar: ['2k', '1k', '1k'] }, // ca. 460 × 460 km
];
// Træet i listen til venstre: stederne under skyerne (undertitlen står i toplinjen)
const TRÆ = {
  rod: 'venus',
  grupper: [{ navn: 'Under skyerne', punkter: STEDER.map((st) => ({ id: st.id, navn: st.navn, undertitel: 'Under skyerne på Venus' })) }],
};

export default {
  id: 'venus',
  navn: 'Venus',
  ikon: '🟡',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Planeten under skyerne',
  træ: TRÆ,
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
    let underMål = null; // skyderen glider selv hertil (ved et sted og tilbage)
    let underFør = 0; // skyderen, før man fløj til et sted
    let glødTil = false; // "Gløden på natsiden"
    let fGlød = 0; // glider mod 0 eller 1
    let visning = 'venus'; // 'venus' (hele kloden) eller et sted

    // ---------- Datoen og Solen ----------
    const nu = new Date(startDato()); // overblikkets dato (js/solsystem/dato.js)
    let dato = nu.getTime(); // programmets dato (ms), går, når tiden går
    const sol = new THREE.Vector3(...solRetning(nu)); // Solens retning i systemet (ekliptikkens retninger)

    // ---------- Kloden ----------
    const net = TEST_HURTIG ? [256, 128] : LAV_KVALITET ? [768, 384] : [1024, 512]; // felter omkring og fra pol til pol
    const venus = lavKlippeplanet({ skala: S, radius: R_KM, højdeMin: HØJDE_MIN, højdeMax: HØJDE_MAX, net, farve: MØRK, tone: TONE, glød: GLØD });
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
      vind: { tekstur: vindTekstur, skala: VIND_SKALA, fase: FASE }, toner: true, gennemsigtig: true, glød: true, kantFarve: [1.0, 0.92, 0.75],
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
    const hentet = { skyer: false, kort: false, højde: false, glød: false };
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
    // Gløden gennem skyerne: et sløret kort (ca. 40 KB, 1k), i gråtoner gemt som sqrt(L / GLØD.maks)
    hent('venus-gloed-1k.jpg', (t) => { skyer.sætGlød({ kort: t }); hentet.glød = true; }, { farve: false, kanaler: 1 });

    // ---------- De lokale net (V3) ----------
    // Kortene hentes først, når man skal derhen. Kun nettet ved stedet (og det, man flyver hen til) tegnes.
    const lokalNet = TEST_HURTIG ? [128, 128] : LAV_KVALITET ? [384, 384] : [512, 512];
    const lokale = new Map(LOKALE.map((l) => [l.id, {
      net: venus.lokalt({ ...l, net: lokalNet }),
      radar: l.radar[TEST_HURTIG ? 2 : LAV_KVALITET ? 1 : 0],
      henter: false, hentet: { kort: false, højde: false },
    }]));
    function hentLokalt(id) {
      const l = lokale.get(id);
      if (!l || l.henter) return;
      l.henter = true;
      hent(`venus-${id}-radar-${l.radar}.jpg`, (t) => { l.net.sætKort(t); l.hentet.kort = true; }, { farve: false, kanaler: 1, anisotropi, rundt: false });
      hent(`venus-${id}-hoejde.png`, (t) => { l.net.sætHøjde(t); l.hentet.højde = true; }, { farve: false, kanaler: 2, rundt: false });
    }
    function aktivér(ids) {
      for (const [id, l] of lokale) l.net.aktiv = ids.includes(id);
    }
    aktivér([]); // ved hele Venus tegnes ingen lokale net

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
    const helPlanet = (retning, færdig) => rejse.flyv({ fokus: () => nulPunkt, afstand: passer(R), retning, min: minOverblik(), max: R * 15, færdig });
    const kamPos = new THREE.Vector3();
    function kameraRetning() {
      rejse.kameraPunkt(kamPos);
      return kamPos.lengthSq() < 1e-9 ? START.clone() : kamPos.normalize();
    }

    // ---------- Stederne under skyerne (V3) ----------
    const steder = STEDER.map((st) => ({ ...st, ramme: venus.sted(...(st.fokus ?? [st.bredde, st.længde])) }));
    const stedMed = (id) => steder.find((st) => st.id === id);
    const stedPunkt = new THREE.Vector3();
    const stedOp = new THREE.Vector3();
    const fokusVed = (st) => () => venus.punkt(st.ramme.retning, stedPunkt).multiplyScalar(R).applyQuaternion(planetDrejning());
    const opVed = (st) => () => stedOp.copy(st.ramme.op).applyQuaternion(planetDrejning());
    // Retningen fra stedet mod kameraet (i systemets retninger), når Venus står, som den gør på datoen ms
    function fraSted(st, ms) {
      const { op, nord, øst } = st.ramme;
      const a = st.kompas * GRAD, v = st.vinkel * GRAD;
      const q = new THREE.Quaternion().setFromAxisAngle(Y, (meridian(new Date(ms)) % 360) * GRAD).premultiply(hæld.quaternion);
      return new THREE.Vector3()
        .addScaledVector(nord, Math.cos(v) * Math.cos(a))
        .addScaledVector(øst, Math.cos(v) * Math.sin(a))
        .addScaledVector(op, Math.sin(v))
        .applyQuaternion(q);
    }
    let datoTur = null; // datoen glider hen til klokken ved stedet, mens kameraet flyver
    const nuværendeNet = () => stedMed(visning)?.lokalt;
    function besøg(st) {
      if (visning === 'venus') underFør = underMål ?? under;
      hentLokalt(st.lokalt);
      underTil(100); // skyerne væk
      const til = datoMedTid(dato, st.længde, st.tid);
      datoTur = { fra: dato, til };
      aktivér([nuværendeNet(), st.lokalt]);
      visning = st.id;
      // Man kan selv zoome ud til 3.000 km, og mindst en fjerdedel længere ud end stedet
      const afstand = passer(st.størrelse);
      rejse.flyv({ fokus: fokusVed(st), op: opVed(st), afstand, retning: fraSted(st, til), min: 0.003, max: Math.max(3, afstand * 1.25), færdig: () => aktivér([st.lokalt]) });
    }
    // Træet: "Venus" flyver tilbage til hele kloden (og skyerne kommer igen, som de var), og et sted flyver derhen
    function gåTil(id) {
      if (id === visning) return;
      if (id === 'venus') {
        aktivér([nuværendeNet()]);
        visning = 'venus';
        datoTur = null;
        underTil(underFør);
        helPlanet(kameraRetning(), () => aktivér([]));
        return;
      }
      const st = stedMed(id);
      if (st) besøg(st);
      opdaterNavne();
    }
    // Skyderen "Under skyerne" glider selv (med "reducer bevægelse" med det samme)
    function underTil(v) {
      if (ROLIG) {
        sætUnder(v);
        underSkyder.sæt?.(v);
        underMål = null;
      } else underMål = v;
    }

    // ---------- Styr-boksen ----------
    const styring = [];
    // Skyderen "Under skyerne": 0 er skyerne, som de er, 100 er helt væk (jorden, som om luften var væk)
    const underSkyder = { skyder: true, navn: 'Under skyerne', min: 0, max: 100, trin: 1, værdi: under, vis: (v) => (v ? `${v} % væk` : 'skyerne er der'), ændring: (v) => { underMål = null; sætUnder(v); } };
    function lavKnapper() {
      underSkyder.værdi = Math.round(under);
      styring.splice(0, styring.length,
        underSkyder,
        { tekst: 'Ultraviolet (som Akatsuki)', til: uv, skift: (til) => { uv = til; } },
        { tekst: 'Gløden på natsiden', til: glødTil, skift: (til) => { glødTil = til; } },
        { tekst: 'Bjergene 10 gange højere', til: høj, skift: (til) => { høj = til; } },
        { tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } },
        navneKnap(() => opdaterNavne()),
      );
      opdaterKnapper();
    }
    lavKnapper();

    // ---------- Navnene på kloden (V3, som Mars) ----------
    // Når man ser hele Venus, står stederne med navn på kloden (også oven på skyerne), og et tryk på et navn flyver
    // derhen. Navnene skjules på bagsiden, tæt på, under flyvninger og med knappen "Navne" slået fra.
    const navne = steder.map((st) => {
      const r = venus.sted(st.bredde, st.længde).retning;
      const tekst = skilt(st.navn, '#ffe3c2', 1);
      tekst.center.set(0.5, -0.3); // teksten står lige over stedet
      const prik = glød(0xffd9a8, 1, 0.9);
      for (const o of [tekst, prik]) {
        o.material.depthTest = false;
        o.renderOrder = 5;
        o.position.copy(r).multiplyScalar(R * 1.003);
        o.visible = false;
        omdrejning.add(o);
      }
      return { st, tekst, prik, forhold: tekst.scale.x / tekst.scale.y, str: 0 };
    });
    let navneVist = false;
    const navnPos = new THREE.Vector3();
    const navnNormal = new THREE.Vector3();
    const tilKamera = new THREE.Vector3();
    const navnOp = new THREE.Vector3();
    function opdaterNavne() {
      navneVist = navneTil() && visning === 'venus' && !rejse.flyver;
      const langtVæk = THREE.MathUtils.smoothstep(rejse.afstand / R, 1.25, 1.6); // tæt på fylder navnene for meget
      for (const n of navne) {
        n.prik.getWorldPosition(navnPos);
        navnNormal.copy(navnPos).sub(system.position).normalize();
        const afstand = tilKamera.copy(kamera.position).sub(navnPos).length();
        const forside = THREE.MathUtils.smoothstep(navnNormal.dot(tilKamera.divideScalar(afstand)), 0.05, 0.25);
        const a = navneVist ? forside * langtVæk : 0;
        n.tekst.visible = n.prik.visible = a > 0.01;
        n.tekst.material.opacity = a;
        n.prik.material.opacity = 0.9 * a;
        n.str = afstand * 0.022; // samme størrelse på skærmen uanset afstanden
        const k = rejse.skala;
        n.tekst.scale.set((n.forhold * n.str) / k, n.str / k, 1);
        n.prik.scale.setScalar((afstand * 0.012) / k);
      }
    }
    const lærred = verden.renderer.domElement;
    // Hvor et navn står på skærmen (pixels): stedet (x, y), tekstens højde h og bredde b
    function påSkærm(n) {
      const r = lærred.getBoundingClientRect();
      n.prik.getWorldPosition(navnPos);
      navnOp.set(0, 1, 0).applyQuaternion(kamera.quaternion).multiplyScalar(n.str).add(navnPos);
      navnPos.project(kamera);
      navnOp.project(kamera);
      const x = r.left + ((navnPos.x + 1) / 2) * r.width, y = r.top + ((1 - navnPos.y) / 2) * r.height;
      const h = (Math.abs(navnOp.y - navnPos.y) / 2) * r.height;
      return { x, y, h, b: h * n.forhold };
    }
    // Navnet, et tryk ved (x, y) rammer: teksten (lige over stedet) eller prikken, med lidt luft til fingre
    function navnVed(x, y) {
      let bedst = null;
      for (const n of navne) {
        if (!n.tekst.visible || n.tekst.material.opacity < 0.5) continue;
        const p = påSkærm(n);
        const dx = Math.abs(x - p.x) - p.b / 2, dy = Math.abs(y - (p.y - 0.8 * p.h)) - 0.8 * p.h;
        const afstand = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
        if (afstand < 12 && (!bedst || afstand < bedst.afstand)) bedst = { n, afstand };
      }
      return bedst?.n ?? null;
    }
    let ned = null;
    const vedNed = (h) => { ned = { x: h.clientX, y: h.clientY }; };
    const vedOp = (h) => {
      if (!ned || Math.hypot(h.clientX - ned.x, h.clientY - ned.y) > 8) return;
      ned = null;
      if (rejse.flyver || !navneVist) return;
      const n = navnVed(h.clientX, h.clientY);
      if (n) gåTil(n.st.id);
    };
    lærred.addEventListener('pointerdown', vedNed);
    lærred.addEventListener('pointerup', vedOp);

    // ---------- Hvert billede ----------
    let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)
    const solNu = new THREE.Vector3(); // i verden
    const grundRot = new THREE.Matrix3(); // fra verden til jordens egne retninger (gløden gennem skyerne)
    const grundM = new THREE.Matrix4();
    const grundQ = new THREE.Quaternion();
    const op = new THREE.Vector3(0, 1, 0);
    const opVinkelret = new THREE.Vector3();
    function hvertBillede(dt) {
      if (første) {
        første = false;
        helPlanet(START);
        rejse.hop();
      }
      // Datoen glider hen til klokken ved stedet i takt med flyvningen
      if (datoTur) {
        dato = THREE.MathUtils.lerp(datoTur.fra, datoTur.til, rejse.fremdrift);
        drejTil(dato);
        drejSkyer();
        sol.set(...solRetning(new Date(dato)));
        if (!rejse.flyver) datoTur = null;
      }
      // Skyderen "Under skyerne" glider selv (ved et sted og tilbage)
      if (underMål !== null) {
        let v = under + (underMål - under) * (1 - Math.exp(-dt * 2.5));
        if (Math.abs(v - underMål) < 0.5) {
          v = underMål;
          underMål = null;
        }
        sætUnder(v);
        underSkyder.sæt?.(Math.round(v));
      }
      // Gløden toner ind og ud (med "reducer bevægelse" med det samme)
      const glødMål = glødTil ? 1 : 0;
      fGlød = ROLIG ? glødMål : glødMål + (fGlød - glødMål) * Math.exp(-dt * 4);
      if (Math.abs(fGlød - glødMål) < 0.002) fGlød = glødMål;
      venus.sætGlød(fGlød, GLØD_FARVE);
      if (fGlød > 0) {
        venus.mesh.updateWorldMatrix(true, false);
        grundRot.setFromMatrix4(grundM.makeRotationFromQuaternion(venus.mesh.getWorldQuaternion(grundQ).invert()));
      }
      skyer.sætGlød({ styrke: fGlød, farve: GLØD_FARVE, grund: grundRot });
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
      if (visning === 'venus' && minOverblik() !== minNu) {
        minNu = minOverblik();
        rejse.grænser(minNu, R * 15);
      }
      rejse.opdater(dt);
      opdaterNavne();
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
      // Tæt på drejer og zoomer man langsommere, så landskabet ikke suser forbi. Ved et sted drejer man rundt om stedet,
      // og helt nede ved jorden (under ca. 20 km) går det lidt langsommere.
      if (visning === 'venus') {
        const højde = Math.max(rejse.afstand - R, 0) / rejse.afstand;
        orbit.zoomSpeed = THREE.MathUtils.clamp(højde * 2, 0.06, 1);
        orbit.rotateSpeed = THREE.MathUtils.clamp(højde * 2, 0.04, 1);
      } else {
        kamPos.copy(kamera.position).sub(system.position).applyQuaternion(grundQ.copy(rejse.drejning).invert()).divideScalar(k);
        const nede = THREE.MathUtils.clamp(((kamPos.length() - bund(kamPos)) * S + MARGEN) / 20, 0.3, 1);
        orbit.zoomSpeed = nede;
        orbit.rotateSpeed = 0.6 * nede;
      }
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
      sted: () => visning,
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
        lærred.removeEventListener('pointerdown', vedNed);
        lærred.removeEventListener('pointerup', vedOp);
        for (const n of navne) { n.tekst.material.map?.dispose(); n.tekst.material.dispose(); n.prik.material.dispose(); }
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
        // Hele Venus set fra natsiden, lidt til siden (kun til billeder og tests af gløden)
        natside() {
          const r = sol.clone().negate().applyAxisAngle(Y, 25 * GRAD).addScaledVector(Y, 0.25).normalize();
          visning = 'venus';
          helPlanet(r);
          rejse.hop();
        },
        // Kameraet lavt over skyerne ved grænsen mellem dag og nat (kun til billeder)
        tætPå() {
          const r = sol.clone().applyAxisAngle(Y, 75 * GRAD).addScaledVector(Y, 0.15).normalize();
          rejse.flyv({ fokus: () => nulPunkt, afstand: R * 2.4, retning: r, min: minOverblik(), max: R * 15 });
          rejse.hop();
        },
        // V3: gløden, stederne, de lokale net og navnene
        glød: () => ({ styrke: fGlød, til: glødTil, kort: hentet.glød, jord: venus.mesh.material[0].uniforms.gloedStyrke.value, skyer: skyer.mesh.material.uniforms.uGloed.value }),
        visning: () => visning,
        // Bredde og længde (grader øst, −180 til 180) af et punkt i verden (i kuglens egne retninger)
        bl(p) {
          venus.mesh.worldToLocal(lokal.copy(p)).normalize();
          return { bredde: Math.asin(THREE.MathUtils.clamp(lokal.y, -1, 1)) / GRAD, længde: Math.atan2(-lokal.z, lokal.x) / GRAD };
        },
        // Det punkt, kameraet kigger på (midten af 3D-billedet), og kameraets højde over jorden (km)
        midte() {
          const p = this.bl(orbit.target);
          kamPos.copy(kamera.position).sub(system.position).applyQuaternion(grundQ.copy(rejse.drejning).invert()).divideScalar(rejse.skala);
          return { ...p, højde: (kamPos.length() - bund(kamPos)) * S + MARGEN };
        },
        navne: () => navne.filter((n) => n.tekst.visible).map((n) => n.st.id),
        navnSted(id) { const n = navne.find((x) => x.st.id === id); n.prik.getWorldPosition(stedPunkt); return this.bl(stedPunkt); },
        navnPlads: (id) => påSkærm(navne.find((x) => x.st.id === id)),
        lokalt: () => Object.fromEntries([...lokale].map(([id, l]) => [id, { aktiv: l.net.aktiv, klar: l.net.klar, ...l.hentet, radar: l.radar }])),
        // Klokken og Solens højde ved et sted (eller bredde, længde)
        klokken(id) {
          const st = stedMed(id);
          return { tid: lokalTid(new Date(dato), st.længde), sol: solVed(st.bredde, st.længde) };
        },
        sætDato(ms) { dato = ms; drejTil(dato); drejSkyer(); sol.set(...solRetning(new Date(dato))); },
        // Kameraet lige over et sted (bredde, længde) i afstand km, med det samme (kun til tests og billeder)
        kigPå(bredde, længde, km) {
          const st = { ramme: venus.sted(bredde, længde) };
          visning = 'test';
          rejse.flyv({ fokus: fokusVed(st), op: opVed(st), afstand: km / S, retning: st.ramme.op.clone().applyQuaternion(planetDrejning()), min: 0.003, max: R * 15 });
          rejse.hop();
        },
        skærm(bredde, længde) {
          const r = lærred.getBoundingClientRect();
          venus.mesh.localToWorld(venus.punkt(venus.sted(bredde, længde).retning, stedPunkt));
          stedPunkt.project(kamera);
          return { x: r.left + ((stedPunkt.x + 1) / 2) * r.width, y: r.top + ((1 - stedPunkt.y) / 2) * r.height };
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
