// Jupiter (docs/plan-jupiter.md). J1: kloden og skelettet. J2: vindene og Den Store Røde Plet. J3: de fire store måner.
// Kortet er Hubbles OPAL-kort fra december 2025 med farverne stemt af efter Cassini (billeder/solsystem/lav_jupiter.py).
// J4: flybyen med 3 stop (oversigten, båndene og pletten). Effekterne ved polerne, ringene og stoppene ved sydpolen og i
// Jupiters skygge kommer i J5. Tal fra docs/fakta-solsystemet.md, "Del 5: Jupiter".
//
// Systemet er én gruppe (1 enhed = 10.000 km, som Saturn), som rejsen (js/solsystem/rejse.js) skalerer og flytter.
// Kortet: u = østlig længde / 360 (0° System III i venstre kant, øst til højre), rækkerne følger den parametriske
// bredde, så kortet passer på den fladtrykte kugle (scale.y).
//
// Vindene (J2) er målt af os i Hubbles to omgange (js/data/vinde-jupiter.js). Båndene glider med den målte fart i
// forhold til Jupiters døgn (programmets ur), og pletten drejer én gang på ca. 4½ døgn. Kortet glider i to faser, der
// tones over i hinanden (planet.js), så skyerne ikke bliver trukket ud i striber.
//
// To ure: vindTid (vindene og pletten) og døgn (Jupiters drejning). Ved pletten står døgnet stille, så pletten bliver i
// sollys, mens vindene og pletten bevæger sig videre. ⏩ lader begge gå HURTIG gange hurtigere.
//
// Månerne (J3): Io, Europa, Ganymedes og Callisto med USGS' kort i deres baner i Jupiters ækvatorplan. De følger et
// tredje ur (måneTid) med samme fart som Jupiters døgn, så Io går rundt på ca. 4,3 Jupiter-døgn, og resonansen
// 1 : 2 : 4 kommer af omløbstiderne (NSSDC). Startpladserne opfylder Laplace-relationen (Io − 3·Europa + 2·Ganymedes =
// 180°), og Io står lige foran Jupiter, så dens skygge ses på skyerne. Under et besøg står månerne stille.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, passerTil } from '../scene3d.js';
import { glød, skilt } from './faelles.js';
import { lavGasplanet } from '../solsystem/planet.js';
import { lavRejse } from '../solsystem/rejse.js';
import { lavIsmåne } from '../solsystem/maane.js';
import { måneForstørrelse } from '../solsystem/maanestr.js';
import { navneTil, navneKnap } from '../solsystem/navne.js';
import { lavFlyby } from '../solsystem/flyby.js';
import { kontakt, tid } from '../sideknap.js';
import { hent, hentedeBilleder } from '../solsystem/hent.js';
import { SIDE, SIDER } from '../data/sider/jupiter.js';
import { PLET, vindVed } from '../data/vinde-jupiter.js';

const JUPITER_R = 71492; // km ved ækvator (1 bar, NSSDC)
const JUPITER_POL = 66854; // km ved polerne: fladtrykt 6,5 %
const HÆLDNING = THREE.MathUtils.degToRad(3.13); // aksens hældning (NSSDC): næsten ingen årstider
const S = 10000; // km pr. enhed i systemet
const R = JUPITER_R / S;
const FLAD = JUPITER_POL / JUPITER_R;
// Programmets ur: Jupiter drejer én gang på DØGN_TID sekunder (i virkeligheden 9,925 timer, System III).
// Månerne (J3) følger det samme ur, så de passer sammen med Jupiters døgn.
export const DØGN_TID = 80;
const DREJ = (Math.PI * 2) / DØGN_TID; // radianer pr. sekund, mod uret set fra nord (mod øst)
export const SEK_PR_SEK = (9.925 * 3600) / DØGN_TID; // sekunder i virkeligheden pr. sekund i programmet (ca. 447)
export const HURTIG = 20; // ⏩: så mange gange hurtigere går tiden
// Pletten drejer én omgang på ca. 4,5 døgn (Rogers 2008, se fakta-solsystemet.md), i programmets sekunder ca. 870
export const PLET_OMGANG = (4.5 * 86400) / SEK_PR_SEK;
// Kortet glider i faser på FASE sekunder (planet.js). Kortere faser: skyerne toner oftere ud. Længere faser: to
// udgaver af samme sky ligger længere fra hinanden, mens de tones over (højst ca. 1,2° i den hurtigste jetstrøm).
const FASE = 40;
const VIND_SKALA = 1e-3; // tallene i vindens tekstur er uv pr. sekund delt med VIND_SKALA (passer til HalfFloat)
const PILE = 24; // højst så mange rækker af pile (én ved hver jetstrøm)
const GRAD = Math.PI / 180;
const SOL_VINKEL = 0.00089; // Solens vinkelradius set fra Jupiter (0,051°, ca. 0,10° bred): halvskyggens bredde

// De fire store måner (docs/fakta-solsystemet.md, del 5): afstand fra Jupiters midte (JPL), radius (NSSDC og JPL) og
// omløbstid i døgn (NSSDC, ikke kolonnen "P" i JPL's tabel). lys: kortets lysstyrke, så gennemsnittet er ca. 0,53 gange
// albedoen (NSSDC: Io 0,62, Europa 0,68, Ganymedes 0,44, Callisto 0,19), som ved Saturns måner (Io lidt mørkere, så
// den gule tone kan ses). Gennemsnittet af kortene skriver lav_jupiter.py maaner ud. start: vinklen i banen fra Solens retning ved måneTid 0 (grader, mod uret
// set fra nord). kort: underteksten ved et besøg (under ca. 160 tegn).
const MÅNER = [
  {
    id: 'io', navn: 'Io', afstand: 421800, r: 1821.5, døgn: 1.769138, lys: 0.7, farve: [1, 1, 1], start: -7, tone: true,
    kort: 'Det mest vulkanske sted i solsystemet. Over 150 vulkaner er set i udbrud, og de gule farver kommer fra svovl.',
  },
  {
    id: 'europa', navn: 'Europa', afstand: 671100, r: 1560.8, døgn: 3.551181, lys: 0.61, farve: [1, 0.98, 0.94], start: -40,
    kort: 'Under en skal af is er der et hav af saltvand. Der er nok dobbelt så meget vand i det som i alle Jordens have.',
  },
  {
    id: 'ganymedes', navn: 'Ganymedes', afstand: 1070400, r: 2631.2, døgn: 7.154553, lys: 0.76, farve: [1, 0.97, 0.92], start: 33.5,
    kort: 'Den største måne i solsystemet, større end planeten Merkur. Som den eneste måne har den sit eget magnetfelt.',
  },
  {
    id: 'callisto', navn: 'Callisto', afstand: 1882700, r: 2410.3, døgn: 16.689017, lys: 0.43, farve: [1, 0.96, 0.9], start: 140,
    kort: 'Fuld af kratere. Overfladen har næsten ikke ændret sig i ca. 4 milliarder år.',
  },
];
const erMåne = (id) => MÅNER.some((m) => m.id === id);
// Månernes kort (billeder/solsystem/KILDER.md): pc 8k (hvis grafikkortet kan), tablet og telefon 4k (som Saturns
// måner), tests 2k. Io har også en svag tone (io-tone.jpg, gemt delt med TONE_SKALA).
const MÅNE_STR = TEST_HURTIG ? '2k' : '4k';
const TONE_SKALA = 1.5;
const MÅNE_SEG = TEST_HURTIG || LAV_KVALITET ? 64 : 96;

// Billederne (billeder/solsystem/KILDER.md): pc 4k, tablet og telefon 2k, tests 1k.
const STØRRELSE = TEST_HURTIG ? '1k' : LAV_KVALITET ? '2k' : '4k';
const SEGMENTER = TEST_HURTIG ? 64 : LAV_KVALITET ? 128 : 192;
const DETALJER = !LAV_KVALITET && !TEST_HURTIG; // de fine skyer tæt på kun på pc

// Planetografisk bredde (Hubbles kort, vindene) og parametrisk bredde (rækkerne i kortet på den fladtrykte kugle)
const tilParametrisk = (grader) => Math.atan(FLAD * Math.tan(THREE.MathUtils.degToRad(grader)));
const tilPlanetografisk = (beta) => THREE.MathUtils.radToDeg(Math.atan(Math.tan(beta) / FLAD));
// Vinden ved den parametriske bredde beta i kortets enheder: uv pr. sekund i programmets ur (mod øst)
function uvPrSek(beta) {
  const cb = Math.cos(beta);
  if (cb < 1e-4) return 0;
  return ((vindVed(tilPlanetografisk(beta)) / 1000 / (JUPITER_R * cb)) * SEK_PR_SEK) / (Math.PI * 2);
}

// Vindens fart for hver række i kortet (fra sydpolen, v = 0, til nordpolen, v = 1) som en tekstur med én række
const VIND_RÆKKER = 1024;
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

// Pilene (kontakten "Vindene"): én række ved hver jetstrøm (hvor vinden er størst mod øst eller vest), længden efter
// farten (150 m/s giver 15° langs breddekredsen, ca. 18.000 km), og pile med ca. 24° imellem.
function pileRækker() {
  const rækker = [];
  for (let phi = -64; phi <= 64; phi += 0.25) {
    const v = vindVed(phi), før = vindVed(phi - 0.25), efter = vindVed(phi + 0.25);
    if (Math.abs(v) < 12 || !((v >= før && v >= efter) || (v <= før && v <= efter))) continue;
    const sidste = rækker[rækker.length - 1];
    if (sidste && phi - sidste.phi < 2.5) {
      if (Math.abs(v) > Math.abs(sidste.vind)) rækker.pop();
      else continue;
    }
    rækker.push({ phi, vind: v });
  }
  return rækker
    .sort((a, b) => Math.abs(b.vind) - Math.abs(a.vind))
    .slice(0, PILE)
    .map(({ phi, vind }) => {
      const beta = tilParametrisk(phi);
      return { phi, vind, v: 0.5 + beta / Math.PI, fart: uvPrSek(beta), længde: Math.abs(vind) * 0.1, antal: Math.max(1, Math.floor((360 * Math.cos(beta)) / 24)) };
    });
}

const TRÆ = {
  rod: 'jupiter',
  grupper: [
    { navn: 'Steder', punkter: [{ id: 'plet', navn: 'Den Store Røde Plet', undertitel: 'En storm, lige så bred som Jorden', ikon: '🔴' }] },
    { navn: 'Måner', id: 'maaner', titel: 'Månerne', undertitel: 'De fire store måner i deres baner', punkter: MÅNER.map((m) => ({ id: m.id, navn: m.navn })) },
  ], // polerne og ringene kommer i J5
};
// Underteksten ved pletten (bjælkens linje, under ca. 160 tegn). Faktatjekket i fakta-solsystemet.md, del 5.
const PLET_STOP = {
  titel: 'Den Store Røde Plet',
  tekst: 'En storm, der er omtrent lige så bred som Jorden. Den drejer rundt mod uret på ca. 4½ døgn og er set sikkert siden 1831.',
};
const PLET_NU = `<p><b>Lige nu:</b> Her står Jupiters døgn stille, så pletten bliver i sollys. Vindene og pletten bevæger sig videre. Med ⏩ går det ${HURTIG} gange hurtigere.</p>`;

// Flybyen (jeres svar 7. november 2026, plan-jupiter.md): 3 stop nu. Sydpolen og "I Jupiters skygge" kommer i J5 med
// cyklonerne, nordlyset og ringene. id: stedet i træet (dets side står i panelet). tekst: underteksten (under ca. 160
// tegn, faktatjekket i fakta-solsystemet.md, "Faktatjek J4"). nu: "Lige nu" i panelet ved stoppet.
const TUR = [
  {
    id: 'maaner', titel: 'Jupiter og de fire store måner', knap: 'månerne',
    // 317,83 Jordmasser mod ca. 128,8 for de andre planeter tilsammen (NSSDC): 2,47 gange
    tekst: 'Jupiter vejer næsten 2½ gange så meget som alle de andre planeter tilsammen. De fire store måner fandt Galileo Galilei i januar 1610.',
    nu: '<p><b>Lige nu:</b> Langt væk er månerne tegnet større, ellers kunne de ikke ses. Banerne har den rigtige størrelse.</p>',
  },
  {
    id: 'jupiter', titel: 'Båndene og vindene', knap: 'båndene',
    // Vores måling: ca. 149 m/s ved 24° N (js/data/vinde-jupiter.js), 149 · 3,6 = 536 km/t
    tekst: 'De lyse og mørke bånd er skyer, som vindene trækker hver sin vej, mod øst og mod vest. Den hurtigste vind blæser ca. 540 km/t.',
    nu: `<p><b>Lige nu:</b> Slå ${kontakt('Vindene')} til, så viser pilene vindene. ${tid('hurtig', 'Prøv ⏩')}</p>`,
  },
  { id: 'plet', ...PLET_STOP, knap: 'pletten', nu: PLET_NU },
];
const TUR_SLUT = '<p><b>Turen er slut.</b> Drej selv rundt, tryk på en måne for at besøge den, eller vælg et sted i listen.</p>';
const FORHÅND_TID = 8000; // ms: så længe venter "Start flyby" højst på månernes kort (som ved Saturn)

export default {
  id: 'jupiter',
  navn: 'Jupiter',
  ikon: '🟠',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Den største planet',
  træ: TRÆ,
  citat: 'galileiJupiter',
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
    let vinde = false; // kontakten "Vindene": pile over båndene
    let pileStyrke = 0; // pilene toner ind og ud
    let hurtig = false; // ⏩
    const sol = new THREE.Vector3(1, 0.03, 0.6).normalize(); // Solens retning i systemets retninger (lyset kommer herfra)
    const solNu = new THREE.Vector3(); // Solens retning i verden (systemet kan være drejet ved pletten)

    // ---------- Jupiter ----------
    const system = new THREE.Group();
    const jupiterG = new THREE.Group();
    jupiterG.rotation.z = HÆLDNING;
    jupiterG.updateMatrix();
    const vindTekstur = lavVindTekstur();
    const pletV = 0.5 + tilParametrisk(PLET.bredde) / Math.PI;
    const planet = lavGasplanet({
      skala: S, radius: JUPITER_R, polRadius: JUPITER_POL, segmenter: SEGMENTER,
      vind: { tekstur: vindTekstur, skala: VIND_SKALA, fase: FASE },
      // Pletten drejer som en skive ud til 1,3 gange de målte halvakser (den røde kant og kraven om den) og toner
      // over i vindene ud til 1,65
      hvirvel: {
        u: PLET.længde / 360, v: pletV, au: PLET.halvLængde / 360,
        av: (tilParametrisk(PLET.bredde + PLET.halvBredde) - tilParametrisk(PLET.bredde - PLET.halvBredde)) / (2 * Math.PI),
        ind: 1.3, ud: 1.65,
      },
      detaljer: DETALJER,
      pile: PILE,
      måner: MÅNER.length,
    });
    const pile = pileRækker();
    planet.sætPile(pile, 0);
    jupiterG.add(planet.mesh);
    system.add(jupiterG);
    gruppe.add(system);
    let hentet = false;
    let aktiv = true;
    hent(`jupiter-${STØRRELSE}.jpg`, (t) => { planet.sætKort(t); hentet = true; queueMicrotask(hentMåner); }, { anisotropi: LAV_KVALITET ? 2 : 4, fejl: () => queueMicrotask(hentMåner) });

    // ---------- Månerne: en bane, kloden og et navn i Jupiters ækvatorplan ----------
    // Solens retning i ækvatorplanet (vinklen i banen, hvor en måne står mellem Solen og Jupiter)
    const solLokal = sol.clone().applyQuaternion(jupiterG.quaternion.clone().invert());
    const solVinkel = Math.atan2(-solLokal.z, solLokal.x) / GRAD;
    let måneTid = 0; // månernes ur (sekunder i programmets ur)
    const måner = MÅNER.map((m) => {
      const bane = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(Array.from({ length: 360 }, (_, j) => new THREE.Vector3(Math.cos((j / 360) * Math.PI * 2), 0, Math.sin((j / 360) * Math.PI * 2)).multiplyScalar(m.afstand / S))),
        new THREE.LineBasicMaterial({ color: 0xd8b48a, transparent: true, opacity: 0.22, depthWrite: false }),
      );
      const r = m.r / S;
      const klode = lavIsmåne(r, { farve: m.farve, lys: m.lys, segmenter: MÅNE_SEG });
      const plads = new THREE.Group(); // stedet i banen
      const krop = new THREE.Group(); // drejes, så samme side vender mod Jupiter, og gøres større langt væk
      krop.add(klode.gruppe);
      plads.add(krop);
      const etiket = skilt(m.navn, '#ffe3c2', 1);
      jupiterG.add(bane, plads, etiket);
      return { ...m, r, klode, plads, krop, etiket, bane, forhold: etiket.scale.x / etiket.scale.y, vinkel: 0, hentet: false };
    });
    const måneMed = (id) => måner.find((m) => m.id === id);
    // Vinklen i banen (grader, mod uret set fra nord) ved månernes ur t
    const vinkelVed = (m, t = måneTid) => solVinkel + m.start + (360 * t * SEK_PR_SEK) / (m.døgn * 86400);
    function placerMåner() {
      for (const m of måner) {
        m.vinkel = vinkelVed(m) * GRAD;
        m.plads.position.set(Math.cos(m.vinkel), 0, -Math.sin(m.vinkel)).multiplyScalar(m.afstand / S);
        m.krop.rotation.y = m.vinkel + Math.PI; // længdegrad 0° vender mod Jupiter
      }
    }
    placerMåner();
    const kan8k = verden.renderer.capabilities.maxTextureSize >= 8192;
    const måneStørrelse = () => (!LAV_KVALITET && !TEST_HURTIG && kan8k ? '8k' : MÅNE_STR);
    // Kortet hentes og lægges i grafikkortet med det samme (forhånd), så det ikke sker midt i en flyvning
    function hentKort(m, { forhånd = false, klar } = {}) {
      if (m.hentet && !klar) return;
      m.hentet = true;
      if (m.tone) hent('io-tone.jpg', (t) => m.klode.sætTone(t, TONE_SKALA), { farve: false });
      hent(`${m.id}-${måneStørrelse()}.jpg`, (t) => {
        m.klode.sætKort(t);
        if (forhånd && aktiv) verden.renderer.initTexture(t);
        klar?.();
      }, { farve: false, kanaler: 1, rundt: false, fejl: klar });
    }
    // Efter Jupiters kort hentes månernes, én ad gangen, og lægges i grafikkortet (som ved Saturn). Indtil de er klar,
    // er "Start flyby" grå (højst FORHÅND_TID), så det ikke hakker under den første flyvning.
    let flybyKlar = false;
    let forhåndUr = null;
    function flybyErKlar() {
      if (flybyKlar || !aktiv) return;
      flybyKlar = true;
      clearTimeout(forhåndUr);
      lavKnapper();
    }
    function hentMåner(i = 0) {
      if (!aktiv) return;
      if (i === 0) forhåndUr = setTimeout(flybyErKlar, FORHÅND_TID);
      if (i >= måner.length) flybyErKlar();
      else hentKort(måner[i], { forhånd: true, klar: () => hentMåner(i + 1) });
    }

    // Solen: en lille, skarp prik. Fra Jupiter er den ca. 0,10° bred (ca. 1/5 af det, vi ser fra Jorden).
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.014 : 0.011);
    const solGlød = glød(0xffe2b0, 0.12, 0.55);
    for (const s of [solKerne, solGlød]) {
      s.material.sizeAttenuation = false;
      s.renderOrder = -1;
      gruppe.add(s);
    }

    // ---------- Urene ----------
    let vindTid = 0; // vindene og pletten (sekunder i programmets ur)
    let døgn = 0; // Jupiters drejning (radianer)
    let drejTur = null; // Jupiter drejer hen til det rigtige tidspunkt på dagen ved pletten, mens kameraet flyver
    let visning = 'jupiter'; // 'jupiter' (hele planeten) eller 'plet'

    // ---------- Pletten: punktet, lodret, nord og øst i systemets retninger ----------
    const qDøgn = new THREE.Quaternion();
    const Y = new THREE.Vector3(0, 1, 0);
    const pletU = PLET.længde / 360;
    const pletBeta = tilParametrisk(PLET.bredde);
    const lokalt = {
      punkt: new THREE.Vector3(-Math.cos(2 * Math.PI * pletU) * Math.cos(pletBeta), Math.sin(pletBeta) * FLAD, Math.sin(2 * Math.PI * pletU) * Math.cos(pletBeta)).multiplyScalar(R),
      op: new THREE.Vector3(-Math.cos(2 * Math.PI * pletU) * Math.cos(pletBeta), Math.sin(pletBeta) / FLAD, Math.sin(2 * Math.PI * pletU) * Math.cos(pletBeta)).normalize(),
      nord: new THREE.Vector3(Math.cos(2 * Math.PI * pletU) * Math.sin(pletBeta), FLAD * Math.cos(pletBeta), -Math.sin(2 * Math.PI * pletU) * Math.sin(pletBeta)).normalize(),
      øst: new THREE.Vector3(Math.sin(2 * Math.PI * pletU), 0, Math.cos(2 * Math.PI * pletU)),
    };
    const pletNu = { punkt: new THREE.Vector3(), op: new THREE.Vector3(), nord: new THREE.Vector3(), øst: new THREE.Vector3() };
    const RAMME = ['punkt', 'op', 'nord', 'øst'];
    // Pletten, når Jupiter er drejet vinklen d (i systemets retninger)
    function pletVed(d = døgn, ud = pletNu) {
      qDøgn.setFromAxisAngle(Y, d).premultiply(jupiterG.quaternion);
      for (const k of RAMME) ud[k].copy(lokalt[k]).applyQuaternion(qDøgn);
      return ud;
    }
    // Den vinkel, hvor Solen står SOL_HØJDE over horisonten ved pletten om formiddagen (Solen i øst), så tæt på den
    // nuværende vinkel som muligt
    const SOL_HØJDE = THREE.MathUtils.degToRad(45);
    const prøve = { punkt: new THREE.Vector3(), op: new THREE.Vector3(), nord: new THREE.Vector3(), øst: new THREE.Vector3() };
    function døgnVedPlet() {
      let bedst = døgn, fejl = Infinity;
      for (let i = -360; i <= 360; i++) {
        const d = døgn + (i / 360) * Math.PI;
        pletVed(d, prøve);
        if (prøve.øst.dot(sol) <= 0) continue;
        const f = Math.abs(Math.asin(THREE.MathUtils.clamp(prøve.op.dot(sol), -1, 1)) - SOL_HØJDE) + Math.abs(i) * 1e-4;
        if (f < fejl) { fejl = f; bedst = d; }
      }
      return bedst;
    }
    // Retningen fra pletten mod kameraet (i systemets retninger), når Jupiter er drejet d.
    // kompas: hvorfra kameraet kigger (0° = fra nord, 180° = fra syd). vinkel: over horisonten.
    function fraPlet(d, kompas, vinkel) {
      const p = pletVed(d, prøve);
      const a = THREE.MathUtils.degToRad(kompas), v = THREE.MathUtils.degToRad(vinkel);
      return new THREE.Vector3()
        .addScaledVector(p.nord, Math.cos(v) * Math.cos(a))
        .addScaledVector(p.øst, Math.cos(v) * Math.sin(a))
        .addScaledVector(p.op, Math.sin(v));
    }

    // ---------- Kameraets rejse ----------
    // Kameraet må ikke komme ned i skyerne: mindst MARGEN over den fladtrykte kugle
    const MARGEN = 0.03; // 300 km
    const qHæld = new THREE.Quaternion();
    const bundHjælp = new THREE.Vector3();
    function bund(p) {
      bundHjælp.copy(p).applyQuaternion(qHæld.copy(jupiterG.quaternion).invert());
      const l = bundHjælp.length();
      if (l < 1e-9) return R;
      const x = bundHjælp.x / l, y = bundHjælp.y / l, z = bundHjælp.z / l;
      return 1 / Math.sqrt((x * x + z * z) / (R * R) + (y * y) / (R * R * FLAD * FLAD)) + MARGEN;
    }
    const rejse = lavRejse({ system, verden, bund });
    rejse.grænser(R * 1.15, 450);
    const nul = new THREE.Vector3();
    // Afstanden, så en kugle med denne radius passer i 3D-billedet (mellem panelerne)
    function passer(radius) {
      passerTil(10);
      const f = (verden.målAfstand ?? 40) / 10;
      verden.målAfstand = null;
      return radius * f;
    }
    // Hele Jupiter, så kloden passer mellem panelerne
    const START = new THREE.Vector3(0.2, 0.1, 1).normalize(); // lidt fra oven og fra den side, Solen lyser på
    const helJupiter = (retning) => rejse.flyv({ fokus: () => nul, afstand: passer(R * 1.08), retning, min: R * 1.15, max: 450 });
    const kamPos = new THREE.Vector3();
    // Retningen fra Jupiters midte mod kameraet i systemets retninger (så kameraet flyver tilbage fra den side, hvor det
    // er), men lidt over ækvator som ved start
    function kameraRetning() {
      rejse.kameraPunkt(kamPos);
      kamPos.y = 0;
      if (kamPos.lengthSq() < 1e-9) return START.clone();
      return kamPos.normalize().addScaledVector(Y, START.y).normalize();
    }

    function flyvTilPlet() {
      visning = 'plet';
      const til = døgnVedPlet();
      drejTur = { fra: døgn, til };
      const afstand = passer(1.45); // ca. 29.000 km bredt billede
      rejse.flyv({
        fokus: () => pletVed().punkt, op: () => pletNu.op,
        afstand, retning: fraPlet(til, 180, 55), min: 0.12, max: Math.max(6, afstand * 1.25),
      });
    }
    function tilPlet() {
      flyvTilPlet();
      fase(PLET_STOP.titel, PLET_STOP.tekst);
      forklaring(PLET_NU);
    }
    // En retning ud fra en vinkel i ækvatorplanet og en højde over planet (grader), i systemets retninger
    const retningFra = (vinkel, højde) => new THREE.Vector3(Math.cos(højde * GRAD) * Math.cos(vinkel * GRAD), Math.sin(højde * GRAD), -Math.cos(højde * GRAD) * Math.sin(vinkel * GRAD)).applyQuaternion(jupiterG.quaternion);
    const fokusHjælp = new THREE.Vector3();
    const fokusPå = (m) => () => fokusHjælp.copy(m.plads.position).applyMatrix4(jupiterG.matrix);
    // Oversigten: alle fire baner, lidt fra oven
    function flyvTilMåner() {
      visning = 'maaner';
      drejTur = null;
      const afstand = passer((MÅNER[3].afstand / S) * 1.06);
      rejse.flyv({ fokus: () => nul, afstand, retning: retningFra(solVinkel - 60, 30), min: R * 1.15, max: Math.max(1500, afstand * 1.5) });
    }
    function tilMåner() {
      flyvTilMåner();
      fase(null);
      forklaring('');
      lavKnapper();
    }
    // Står månen i Jupiters skygge, spoles månernes ur frem, til den er ude (ellers er den helt sort og ser ud, som om
    // den mangler). Alle månerne flyttes, så resonansen passer stadig.
    function udAfSkygge(m) {
      const fra = ((((vinkelVed(m) - solVinkel - 180) % 360) + 540) % 360) - 180; // grader fra midten af skyggen
      const fri = 14;
      if (Math.abs(fra) >= fri) return;
      måneTid += (((fri - fra) / 360) * m.døgn * 86400) / SEK_PR_SEK;
      placerMåner();
    }
    // Et kort besøg (som ved Saturn): kameraet flyver hen til månen, og Solen lyser skråt fra siden
    function besøg(m) {
      visning = m.id;
      drejTur = null;
      udAfSkygge(m);
      hentKort(m);
      rejse.flyv({ fokus: fokusPå(m), afstand: passer(m.r * 1.08), retning: retningFra(solVinkel + 40, 12), min: m.r * 1.15, max: 1500 });
      fase(m.navn, m.kort);
      forklaring('');
      lavKnapper();
    }
    function tilJupiter() {
      visning = 'jupiter';
      drejTur = null;
      fase(null);
      forklaring('');
      helJupiter(kameraRetning());
    }
    function gåTil(id) {
      if (id === visning) return;
      flyby.afslut();
      if (id === 'plet') tilPlet();
      else if (id === 'jupiter') tilJupiter();
      else if (id === 'maaner') tilMåner();
      else if (erMåne(id)) besøg(måneMed(id));
    }
    let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)

    // ---------- Flybyen (js/solsystem/flyby.js): oversigten, båndene og pletten ----------
    // Båndene: hele Jupiter med Solen næsten bag kameraet (ca. 20° fra), så hele skiven er lys
    const BÅND = sol.clone().lerp(START, 0.4).setY(0.12).normalize();
    function flyvTilStop(stop, nr) {
      if (stop.id === 'maaner') flyvTilMåner();
      else if (stop.id === 'plet') flyvTilPlet();
      else {
        visning = 'jupiter';
        drejTur = null;
        helJupiter(BÅND);
      }
      forklaring(stop.nu + (nr === TUR.length - 1 ? TUR_SLUT : ''));
    }
    const flyby = lavFlyby({ stop: TUR, fase, forklaring, flyvTil: flyvTilStop, skift: () => lavKnapper(), slut: TUR_SLUT });
    function startTur() {
      for (const m of måner) hentKort(m);
      flyby.start();
    }

    const styring = [];
    function lavKnapper() {
      styring.length = 0;
      styring.push({ tekst: 'Vindene', til: vinde, skift: (til) => { vinde = til; } });
      styring.push({ tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } });
      // Uden navne kan man stadig trykke på selve månerne
      styring.push(navneKnap((til) => { if (!til) for (const m of måner) m.etiket.visible = false; }));
      opdaterKnapper();
    }
    lavKnapper();

    // ---------- Tryk på en måne (eller dens navn) for at besøge den (som ved Saturn) ----------
    const lærred = verden.renderer.domElement;
    const stråle = new THREE.Raycaster();
    const peg = new THREE.Vector2();
    const skalaH = new THREE.Vector3();
    const trykH = new THREE.Vector3();
    const trykH2 = new THREE.Vector3();
    let ned = null;
    const vedNed = (h) => { ned = { x: h.clientX, y: h.clientY }; };
    const vedOp = (h) => {
      if (!ned || rejse.flyver || flyby.kører || Math.hypot(h.clientX - ned.x, h.clientY - ned.y) > 8) return;
      const r = lærred.getBoundingClientRect();
      peg.set(((h.clientX - r.left) / r.width) * 2 - 1, -((h.clientY - r.top) / r.height) * 2 + 1);
      stråle.setFromCamera(peg, kamera);
      // Den måne, der er tættest på strålen (inden for et lille stykke, så de er lette at ramme med en finger)
      let bedst = null;
      for (const m of måner) {
        if (m.id === visning) continue;
        m.krop.getWorldPosition(trykH2);
        const afstand = stråle.ray.distanceToPoint(trykH2);
        const grænse = Math.max(m.r * m.krop.getWorldScale(skalaH).x * 2.2, trykH2.distanceTo(kamera.position) * 0.03);
        if (afstand < grænse && stråle.ray.direction.dot(trykH.copy(trykH2).sub(kamera.position)) > 0 && (!bedst || afstand < bedst.afstand)) bedst = { m, afstand };
      }
      if (bedst) besøg(bedst.m);
    };
    lærred.addEventListener('pointerdown', vedNed);
    lærred.addEventListener('pointerup', vedOp);

    // ---------- Hvert billede: kameraet, systemets skala og lyset ----------
    const op = new THREE.Vector3(0, 1, 0);
    const midt = new THREE.Vector3();
    function hvertBillede(dt) {
      if (første) {
        første = false;
        helJupiter(START);
        rejse.hop();
      }
      // Jupiter drejer hen til formiddag ved pletten, mens kameraet flyver (også under pause)
      if (drejTur) {
        døgn = THREE.MathUtils.lerp(drejTur.fra, drejTur.til, rejse.fremdrift);
        if (!rejse.flyver) drejTur = null;
      }
      planet.mesh.rotation.y = døgn;
      rejse.opdater(dt);
      // I modlys står Solen næsten lige bag Jupiter, set fra kameraet
      if (modlys) {
        planet.mesh.getWorldPosition(midt);
        kamPos.copy(kamera.position).sub(midt).normalize();
        solNu.copy(kamPos).multiplyScalar(-1).addScaledVector(op, 0.22).normalize();
      } else solNu.copy(sol).applyQuaternion(rejse.drejning);
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solNu, 600);
      const { midt: jMidt, akse: jAkse } = planet.sæt(solNu, vindTid);
      opdaterMåner(dt, jMidt, jAkse);
      planet.sætHvirvel(((vindTid / PLET_OMGANG) % 1) * Math.PI * 2);
      pileStyrke = THREE.MathUtils.clamp(pileStyrke + (vinde ? 1 : -1) * Math.min(dt, 0.1) * 3, 0, 1);
      planet.sætPile(null, pileStyrke);
    }
    verden.opdateringer.add(hvertBillede);

    // Månerne hvert billede: størrelsen (større langt væk), banerne, navnene, lyset og skyggerne
    let nær = 0; // 0: ude i rummet (månerne større), 1: tæt på Jupiter eller ved en måne (den rigtige størrelse)
    const månePos = new THREE.Vector3();
    const skygger = måner.map(() => ({ midt: new THREE.Vector3(), r: 0 }));
    function opdaterMåner(dt, jMidt, jAkse) {
      const k = rejse.skala;
      const mål = visning === 'plet' || erMåne(visning) ? 1 : 0;
      nær = THREE.MathUtils.clamp(nær + Math.sign(mål - nær) * Math.min(dt, 0.1) * 1.2, 0, 1);
      // Banerne ses kun langt ude (tæt på ville de skære tværs gennem billedet). Hele Jupiter står ca. 33 enheder væk på
      // pc og over 80 på tablet på højkant og telefon, oversigten over 500.
      const baneLys = 0.22 * THREE.MathUtils.smoothstep(rejse.afstand, 130, 260) * (1 - nær);
      måner.forEach((m, i) => {
        m.bane.material.opacity = baneLys;
        m.bane.visible = baneLys > 0.005;
        m.plads.getWorldPosition(månePos);
        const afstand = månePos.distanceTo(kamera.position);
        const rVerden = m.r * k;
        const større = måneForstørrelse({ afstand, rVerden, nær, kamera, højde: lærred.clientHeight });
        m.krop.scale.setScalar(større);
        const str = (afstand * 0.02) / k;
        m.etiket.visible = navneTil() && !rejse.flyver && m.id !== visning && nær < 0.5 && (rVerden * større) / afstand < 0.03;
        m.etiket.scale.set(m.forhold * str, str, 1);
        m.etiket.position.copy(m.plads.position).add(månePos.set(0, m.r * større + str * 0.8, 0));
        m.klode.sæt(solNu);
        m.klode.skygge(jMidt, R * k, jAkse, FLAD, SOL_VINKEL);
        m.plads.getWorldPosition(skygger[i].midt);
        skygger[i].r = rVerden; // skyggen har den rigtige størrelse, også når månen er tegnet større
      });
      planet.sætMåner(skygger);
    }

    // Vindens fart i teksturen ved den planetografiske bredde (til tests): uv pr. sekund, som shaderen læser den
    function teksturFart(bredde) {
      const x = (0.5 + tilParametrisk(bredde) / Math.PI) * VIND_RÆKKER - 0.5;
      const i = THREE.MathUtils.clamp(Math.floor(x), 0, VIND_RÆKKER - 2);
      const f = THREE.MathUtils.clamp(x - i, 0, 1);
      const a = THREE.DataUtils.fromHalfFloat(vindTekstur.image.data[i]), b = THREE.DataUtils.fromHalfFloat(vindTekstur.image.data[i + 1]);
      return (a + (b - a) * f) * VIND_SKALA;
    }

    return {
      styring,
      gåTil,
      sted: () => visning,
      // Flybyen: øverst i træet og i bjælken i 3D-billedet
      tur: { navn: 'Flyby', stop: TUR.length, klar: () => flybyKlar, kører: () => flyby.kører, start: startTur },
      trin: () => flyby.bjælke(),
      hurtig: `tiden går ${HURTIG} gange hurtigere`,
      tempo: (t) => { hurtig = t === 'hurtig'; },
      opdater(dt) {
        const d = dt * (hurtig ? HURTIG : 1);
        vindTid += d;
        if (!drejTur && visning !== 'plet') døgn += d * DREJ; // mod uret set fra nord: skyerne flytter sig mod øst
        // Månerne følger det samme ur, men står stille, mens man besøger en af dem
        if (!erMåne(visning)) { måneTid += d; placerMåner(); }
      },
      stop() {
        aktiv = false;
        clearTimeout(forhåndUr);
        flyby.afslut();
        lærred.removeEventListener('pointerdown', vedNed);
        lærred.removeEventListener('pointerup', vedOp);
        for (const m of måner) {
          m.etiket.material.map?.dispose();
          m.etiket.material.dispose();
        }
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
        // Jupiters drejning (radianer om aksen), fladtrykningen og om kortet er hentet
        drejning: () => planet.mesh.rotation.y,
        form: () => ({ flad: planet.mesh.scale.y, radius: R, hældning: jupiterG.rotation.z, segmenter: SEGMENTER }),
        hentet: () => hentet,
        billeder: () => hentedeBilleder(['jupiter', 'io', 'europa', 'ganymedes', 'callisto']),
        // Hvor et punkt på Jupiters ækvator ved østlig længde `længde` står i verden (x, z), set fra nord
        punkt(længde) {
          // u = længde/360 i SphereGeometry: x = -cos(2πu), z = sin(2πu)
          const u = længde / 360;
          const p = new THREE.Vector3(-Math.cos(u * Math.PI * 2), 0, Math.sin(u * Math.PI * 2)).multiplyScalar(R);
          planet.mesh.localToWorld(p);
          return [p.x, p.y, p.z];
        },
        tur: () => ({ trin: flyby.trin, flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand }),
        flybyStop: () => TUR.map((t) => ({ id: t.id, titel: t.titel, tekst: t.tekst })),
        hop: () => rejse.hop(),
        sol: () => solNu.toArray(),
        sætUr: (t) => { vindTid = t; }, // til billeder: vindene og pletten på et bestemt tidspunkt
        ur: () => ({ vind: vindTid, døgn, hurtig }),
        // Vindene i shaderen ved den planetografiske bredde: farten (m/s mod øst, regnet tilbage fra teksturen) og hvor
        // langt kortet er forskudt mod øst i hver fase lige nu (grader), med fasernes vægte (som i planet.js)
        strøm(bredde) {
          const fart = teksturFart(bredde); // uv pr. sekund
          const beta = tilParametrisk(bredde);
          const f = (((vindTid / FASE) % 1) + 1) % 1;
          return {
            ms: (fart * 2 * Math.PI * JUPITER_R * 1000 * Math.cos(beta)) / SEK_PR_SEK,
            a: fart * f * FASE * 360, b: fart * ((f + 0.5) % 1) * FASE * 360, vægtA: 1 - Math.abs(2 * f - 1),
          };
        },
        // Pletten: hvor langt den er drejet (radianer, mod uret), om Jupiter står stille, Solens højde over pletten
        // (grader), og hvor lodret pletten står i verden (1 = lige op)
        plet() {
          const p = pletVed();
          const opVerden = p.op.clone().applyQuaternion(rejse.drejning);
          return {
            vinkel: ((vindTid / PLET_OMGANG) % 1) * Math.PI * 2, ved: visning === 'plet',
            solHøjde: THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(opVerden.dot(solNu), -1, 1))),
            lodret: opVerden.y, øst: p.øst.clone().applyQuaternion(rejse.drejning).dot(solNu) > 0,
          };
        },
        // Månerne: vinklen i banen målt i geometrien (grader, atan2(−z, x) i ækvatorplanet, vokser mod uret set fra
        // nord), omløbstiden, hvor stor månen er tegnet og hvor stor den er (vinkelradius i grader set fra kameraet),
        // om navnet ses, om kortet er hentet, og om dens skygge rammer Jupiter
        måner: () => måner.map((m) => {
          m.plads.getWorldPosition(månePos);
          const afstand = månePos.distanceTo(kamera.position);
          const rVerden = m.r * rejse.skala;
          // Skyggen rammer Jupiter, hvis månen står på Solens side, og linjen fra månen væk fra Solen går gennem Jupiter
          const j = planet.mesh.getWorldPosition(new THREE.Vector3());
          const d = månePos.clone().sub(j);
          const t = d.dot(solNu);
          const tværs = d.clone().addScaledVector(solNu, -t).length();
          return {
            id: m.id, vinkel: Math.atan2(-m.plads.position.z, m.plads.position.x) / GRAD, døgn: m.døgn,
            tegnet: Math.atan((rVerden * m.krop.scale.x) / afstand) / GRAD, rigtig: Math.atan(rVerden / afstand) / GRAD,
            navn: m.etiket.visible, hentet: m.hentet, skyggePåJupiter: t > 0 && tværs < R * rejse.skala * FLAD,
            skyggeSat: planet.mesh.material.uniforms.uMaane.value.some((v) => Math.abs(v.w - rVerden) < 1e-9 && v.w > 0),
          };
        }),
        måneUr: () => måneTid,
        sætMåneUr: (t) => { måneTid = t; placerMåner(); },
        nær: () => nær,
        // Hvor en måne står på skærmen (i pixels), så testen kan trykke på den
        månePlads(navn) {
          const m = måner.find((x) => x.navn === navn);
          m.krop.getWorldPosition(månePos).project(kamera);
          const r = lærred.getBoundingClientRect();
          return { x: r.left + ((månePos.x + 1) / 2) * r.width, y: r.top + ((1 - månePos.y) / 2) * r.height, foran: månePos.z < 1 };
        },
        visning: () => visning,
        pile: () => ({ styrke: pileStyrke, rækker: pile.map((p) => ({ bredde: p.phi, vind: Math.round(p.vind), længde: p.længde })) }),
      },
    };
  },
};
