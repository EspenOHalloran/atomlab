// Jupiter (docs/plan-jupiter.md). J1: kloden og skelettet. J2: vindene og Den Store Røde Plet.
// Kortet er Hubbles OPAL-kort fra december 2025 med farverne stemt af efter Cassini (billeder/solsystem/lav_jupiter.py).
// Månerne, flybyen og effekterne ved polerne kommer i J3-J5. Tal fra docs/fakta-solsystemet.md, "Del 5: Jupiter".
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

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, passerTil } from '../scene3d.js';
import { glød } from './faelles.js';
import { lavGasplanet } from '../solsystem/planet.js';
import { lavRejse } from '../solsystem/rejse.js';
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
  ], // månerne kommer i J3, flybyen og de andre steder i J4 og J5
};
// Underteksten ved pletten (bjælkens linje, under ca. 160 tegn). Faktatjekket i fakta-solsystemet.md, del 5.
const PLET_STOP = {
  titel: 'Den Store Røde Plet',
  tekst: 'En storm, der er omtrent lige så bred som Jorden. Den drejer rundt mod uret på ca. 4½ døgn og er set sikkert siden 1831.',
};

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
    let vinde = false; // kontakten "Vindene": pile over båndene
    let pileStyrke = 0; // pilene toner ind og ud
    let hurtig = false; // ⏩
    const sol = new THREE.Vector3(1, 0.03, 0.6).normalize(); // Solens retning i systemets retninger (lyset kommer herfra)
    const solNu = new THREE.Vector3(); // Solens retning i verden (systemet kan være drejet ved pletten)

    // ---------- Jupiter ----------
    const system = new THREE.Group();
    const jupiterG = new THREE.Group();
    jupiterG.rotation.z = HÆLDNING;
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
    });
    const pile = pileRækker();
    planet.sætPile(pile, 0);
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

    function tilPlet() {
      visning = 'plet';
      const til = døgnVedPlet();
      drejTur = { fra: døgn, til };
      const afstand = passer(1.45); // ca. 29.000 km bredt billede
      rejse.flyv({
        fokus: () => pletVed().punkt, op: () => pletNu.op,
        afstand, retning: fraPlet(til, 180, 55), min: 0.12, max: Math.max(6, afstand * 1.25),
      });
      fase(PLET_STOP.titel, PLET_STOP.tekst);
      forklaring(`<p><b>Lige nu:</b> Her står Jupiters døgn stille, så pletten bliver i sollys. Vindene og pletten bevæger sig videre. Med ⏩ går det ${HURTIG} gange hurtigere.</p>`);
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
      if (id === 'plet') tilPlet();
      else if (id === 'jupiter') tilJupiter();
    }
    let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)

    const styring = [];
    function lavKnapper() {
      styring.length = 0;
      styring.push({ tekst: 'Vindene', til: vinde, skift: (til) => { vinde = til; } });
      styring.push({ tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } });
      opdaterKnapper();
    }
    lavKnapper();

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
      planet.sæt(solNu, vindTid);
      planet.sætHvirvel(((vindTid / PLET_OMGANG) % 1) * Math.PI * 2);
      pileStyrke = THREE.MathUtils.clamp(pileStyrke + (vinde ? 1 : -1) * Math.min(dt, 0.1) * 3, 0, 1);
      planet.sætPile(null, pileStyrke);
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

    return {
      styring,
      gåTil,
      sted: () => visning,
      hurtig: `tiden går ${HURTIG} gange hurtigere`,
      tempo: (t) => { hurtig = t === 'hurtig'; },
      opdater(dt) {
        const d = dt * (hurtig ? HURTIG : 1);
        vindTid += d;
        if (!drejTur && visning !== 'plet') døgn += d * DREJ; // mod uret set fra nord: skyerne flytter sig mod øst
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
        pile: () => ({ styrke: pileStyrke, rækker: pile.map((p) => ({ bredde: p.phi, vind: Math.round(p.vind), længde: p.længde })) }),
      },
    };
  },
};
