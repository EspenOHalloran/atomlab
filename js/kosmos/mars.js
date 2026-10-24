// Mars (M2 i docs/plan-mars.md): kloden med rigtige højder fra MOLA og farverne fra Viking. Står i Kosmos efter
// Solstorm og før Saturn (Mars er tættere på Solen). Tal fra docs/fakta-solsystemet.md (del 3) og NSSDC's faktaark.
// Grafikken ligger i js/solsystem/klippeplanet.js, så Solsystemet kan genbruge den.
//
// 1 enhed = 1.000 km. Mars drejer om sin akse, som hælder 25,19°. Solen står, som ved jævndøgn (forår eller
// efterår), så begge halvkugler får lige meget lys.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG } from '../scene3d.js';
import { glød } from './faelles.js';
import { lavKlippeplanet } from '../solsystem/klippeplanet.js';

const S = 1000; // km pr. enhed
const MARS_R = 3396.19; // km ved ækvator (den kugle, kortene er lavet til)
const MARS_POL = 3376.2; // km ved polerne (NSSDC)
const HÆLDNING = THREE.MathUtils.degToRad(25.19); // aksens hældning (NSSDC)
// Højdekortets grænser i meter. Skal være de samme som i billeder/solsystem/lav_mars.py.
export const HØJDE_MIN = -8500;
export const HØJDE_MAX = 21500;
const OVERDRIV = 10; // "Bjergene 10 gange højere"
const DREJ = 0.06; // radianer i sekundet (en omgang på ca. 1¾ minut i stedet for 24 t 37 min)

// Billederne (se billeder/solsystem/KILDER.md). Farvekortet er 8k på pc og (indtil videre, som en prøve) på tablet,
// hvis grafikkortet kan klare så store billeder. Tests henter 2k. Højdekortet er 4k (2k i tests).
const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const henter = new THREE.TextureLoader();
const lager = new Map(); // filnavn → tekstur. De bliver i grafikkortet, så det går hurtigt at åbne Mars igen.
function hent(navn, færdig, { farve = true, kanaler = 4, anisotropi = 1 } = {}) {
  let b = lager.get(navn);
  if (!b) {
    b = { tekstur: null, venter: [] };
    lager.set(navn, b);
    henter.load(new URL(navn, MAPPE).href, (t) => {
      t.colorSpace = farve ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      if (kanaler === 2) t.format = THREE.RGFormat; // højden ligger i rød og grøn (sparer hukommelse)
      t.wrapS = THREE.RepeatWrapping; // kortet går hele vejen rundt
      t.anisotropy = anisotropi;
      b.tekstur = t;
      for (const f of b.venter) f(t);
      b.venter.length = 0;
    }, undefined, () => { /* mangler billedet, bruges den jævne farve */ });
  }
  if (b.tekstur) færdig(b.tekstur);
  else b.venter.push(færdig);
}

export default {
  id: 'mars',
  navn: 'Mars',
  ikon: '🔴',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Den røde planet',
  kamera: { retning: [0.12, 0.2, 1], radius: MARS_R / S, drej: false },
  tal: [
    ['Mars\' bredde', 'ca. 6.790 km'],
    ['Et døgn', '24 t 40 min'],
    ['Et år', '687 jorddøgn'],
    ['Tyngden', '38 % af Jordens'],
  ],
  kort: `
    <p><b>Mars</b> er den fjerde planet fra Solen og ca. halvt så bred som Jorden. Den er rød, fordi støvet indeholder jernoxid, et stof der ligner rust. Drej kloden med fingeren, musen eller piletasterne, og zoom helt ind.</p>
    <p><b>Bjergene har den rigtige højde.</b> Olympus Mons er den største vulkan, vi kender i solsystemet. Den rejser sig ca. 22 km over landet omkring den, næsten 2½ gange så højt som Mount Everest. Ved siden af ligger tre andre store vulkaner på en række, og mod øst skærer kløften Valles Marineris sig ca. 4.000 km gennem landet, lige så langt som fra Lissabon til Moskva. Den er op til ca. 10 km dyb. Fra toppen af Olympus Mons til bunden af Hellas, det store krater i syd, er der ca. 30 km.</p>
    <p><b>Et døgn</b> på Mars varer 24 timer og ca. 40 minutter, næsten som hos os. Aksen hælder 25,2° (Jordens 23,4°), så Mars har årstider ligesom Jorden. Men et år varer 687 jorddøgn, så hver årstid er i snit næsten dobbelt så lang.</p>
    <p><b>Luften</b> er meget tynd, under 1 % af trykket på Jorden, og mest kuldioxid (CO₂). Det er koldt: i snit ca. −60 °C. Tyngden er 38 % af Jordens, så vejer du 45 kg, ville du føle dig som ca. 17 kg.</p>`,
  nørd: `
    <p><b>Højderne</b> er målt med laser fra rumsonden Mars Global Surveyor (instrumentet MOLA, 1997-2001). Kuglen er et net, hvor hvert punkt er løftet eller sænket efter højdekortet, så bjergene rager op over kanten, når de står ude ved horisonten. Fra kredsløb ser Mars alligevel næsten glat ud, for selv Olympus Mons er kun ca. 0,6 % af Mars' radius. Tryk "Bjergene 10 gange højere" for at se landskabet tydeligere.</p>
    <p><b>Nulpunktet:</b> Mars har intet hav, så højderne er regnet fra en flade, hvor tyngden er lige stærk overalt (areoiden). Den er lidt fladere ved polerne, ligesom Mars selv: ca. 20 km fra pol til pol i forhold til ækvator.</p>
    <p><b>Farverne</b> er en mosaik af billeder fra de to Viking-sonder (1976-1980), lavet af USGS. Kortet har ca. 2,6 km pr. pixel på en pc. Stederne helt tæt på bliver skarpere senere.</p>
    <p><b>Ærligt talt:</b> Mars drejer meget hurtigere end i virkeligheden (en omgang på under 2 minutter i stedet for 24 t 37 min), og den står stille, når du er helt tæt på. Solen er tegnet større, og den står, som ved jævndøgn. Den tynde, støvede luft og polkapperne er ikke med på tegningen endnu.</p>`,

  lav(gruppe, { opdaterKnapper, forklaring, verden }) {
    const { kamera } = verden;
    const orbit = verden.styring; // kameraets styring med mus og fingre
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, zoom: orbit.zoomSpeed, drej: orbit.rotateSpeed };
    kamera.near = 0.005; // helt tæt på overfladen (5 km)
    kamera.updateProjectionMatrix();
    const maks = verden.renderer.capabilities.maxTextureSize;
    const anisotropi = Math.min(8, verden.renderer.capabilities.getMaxAnisotropy());

    // ---------- Mars ----------
    const net = TEST_HURTIG ? [256, 128] : LAV_KVALITET ? [768, 384] : [1024, 512]; // felter omkring og fra pol til pol
    const mars = lavKlippeplanet({ skala: S, radius: MARS_R, polRadius: MARS_POL, højdeMin: HØJDE_MIN, højdeMax: HØJDE_MAX, net, farve: [0.55, 0.3, 0.17] });
    const R = mars.radius;
    const sol = new THREE.Vector3(1, 0.06, 0.62).normalize(); // Solens retning (lyset kommer herfra)
    const hæld = new THREE.Group(); // aksen hælder 25,19° på tværs af Solens retning (jævndøgn): nordpolen lidt mod kameraet
    hæld.quaternion.setFromAxisAngle(new THREE.Vector3(sol.x, 0, sol.z).normalize(), HÆLDNING);
    const omdrejning = new THREE.Group(); // drejer om aksen mod øst (mod uret set fra nord)
    omdrejning.rotation.y = THREE.MathUtils.degToRad(25); // Tharsis og Valles Marineris vender mod kameraet ved start
    omdrejning.add(mars.mesh);
    hæld.add(omdrejning);
    gruppe.add(hæld);

    const kortStr = TEST_HURTIG ? '2k' : maks >= 8192 ? '8k' : '4k';
    const højdeStr = TEST_HURTIG ? '2k' : '4k';
    const hentet = { kort: false, højde: false };
    hent(`mars-${kortStr}.jpg`, (t) => { mars.sætKort(t); hentet.kort = true; }, { anisotropi });
    hent(`mars-hoejde-${højdeStr}.png`, (t) => { mars.sætHøjde(t); hentet.højde = true; }, { farve: false, kanaler: 2 });

    // Solen: en lille, skarp prik langt væk i lysets retning (fra Mars ser den ca. ⅔ så stor ud som fra Jorden)
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.02 : 0.016);
    const solGlød = glød(0xffe2b0, 0.16, 0.55);
    for (const s of [solKerne, solGlød]) {
      s.material.sizeAttenuation = false;
      s.renderOrder = -1;
      gruppe.add(s);
    }

    // ---------- Knapperne ----------
    let drejer = true;
    let høj = false;
    let overdriv = 1; // glider mod 1 eller OVERDRIV
    const styring = [
      { tekst: 'Drej Mars', til: drejer, skift: (til) => { drejer = til; } },
      { tekst: 'Bjergene 10 gange højere', til: høj, skift: (til) => { høj = til; vis(); } },
    ];
    function vis() {
      forklaring(høj
        ? '<p><b>10 gange højere:</b> Nu kan du tydeligt se Olympus Mons og de tre vulkaner ved siden af, kløften Valles Marineris og det store krater Hellas. Det meste af den sydlige halvkugle er højland med mange kratere, flere km højere end det glatte lavland i nord.</p>'
        : '<p><b>Mars:</b> Bjergene har den rigtige højde. Selv Olympus Mons er kun ca. 0,6 % af Mars\' radius, så set fra rummet er Mars næsten glat. Se skyggerne ved grænsen mellem dag og nat, eller tryk "Bjergene 10 gange højere".</p>');
    }
    vis();
    opdaterKnapper();

    // ---------- Hvert billede: lys, Solen og kameraets styring ----------
    const kamPos = new THREE.Vector3();
    function hvertBillede(dt) {
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(sol, 600);
      mars.sæt(sol);
      // Bjergene vokser og krymper blødt (med "reducer bevægelse" med det samme)
      const mål = høj ? OVERDRIV : 1;
      overdriv = ROLIG ? mål : mål + (overdriv - mål) * Math.exp(-dt * 3);
      if (Math.abs(overdriv - mål) < 0.01) overdriv = mål;
      mars.overdriv = overdriv;
      // Tæt på overfladen drejer og zoomer man langsommere, så man ikke suser hen over landskabet
      const d = kamPos.copy(kamera.position).sub(orbit.target).length();
      const højde = Math.max(d - R, 0) / d;
      orbit.zoomSpeed = THREE.MathUtils.clamp(højde * 2, 0.06, 1);
      orbit.rotateSpeed = THREE.MathUtils.clamp(højde * 2, 0.04, 1);
      orbit.minDistance = R * (1.012 + 0.0065 * overdriv); // over toppen af Olympus Mons
      orbit.maxDistance = R * 15;
    }
    verden.opdateringer.add(hvertBillede);

    return {
      styring,
      opdater(dt) {
        if (!drejer) return;
        // Helt tæt på står Mars stille (ellers suser landskabet forbi)
        const d = kamera.position.distanceTo(orbit.target);
        omdrejning.rotation.y += dt * DREJ * THREE.MathUtils.smoothstep(d / R, 1.05, 1.8);
      },
      stop() {
        verden.opdateringer.delete(hvertBillede);
        mars.stop();
        orbit.minDistance = gammelt.min;
        orbit.maxDistance = gammelt.max;
        orbit.zoomSpeed = gammelt.zoom;
        orbit.rotateSpeed = gammelt.drej;
        kamera.near = gammelt.nær;
        kamera.updateProjectionMatrix();
      },
      // Kun til tests: omdrejningen, højderne og billedernes størrelse
      test: {
        drejning: () => omdrejning.rotation.y,
        overdriv: () => overdriv,
        billeder: () => ({ kort: kortStr, højde: højdeStr, net, hentet: { ...hentet } }),
        // Drej Mars, så længdegraden (i grader øst) vender mod kameraet
        vend(længde) {
          drejer = false;
          styring[0].til = false;
          opdaterKnapper();
          kamPos.copy(kamera.position).sub(orbit.target).applyQuaternion(hæld.quaternion.clone().invert());
          const vinkel = Math.atan2(-kamPos.z, kamPos.x); // kameraets retning som længdegrad i hældningens retninger
          omdrejning.rotation.y = vinkel - THREE.MathUtils.degToRad(længde);
        },
      },
    };
  },
};
