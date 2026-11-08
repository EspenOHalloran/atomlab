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
// - UN3 (Neptun, cfg.vejr): høje skyer med skygge, pletterne fra 1989 (kontakten "Neptun i 1989"), Voyagers farver,
//   pilene "Vindene" og ringene med buerne (js/data/vejr-neptun.js og ringe-neptun.js).
// - UN4 (Uranus, cfg.måner): de fem store måner med Voyagers kort og fire små klumper i ækvatorplanet
//   (js/data/maaner-uranus.js). De kredser den samme vej, som Uranus drejer, og vender samme side mod Uranus.
// - UN5: stederne i træet (cfg.steder: Uranus' nordpol og ringe, Neptuns plet og ringbuer) og flybyen (cfg.tur,
//   js/solsystem/flyby.js). Uranus' flyby kører skyderen "År" tilbage til 1986, som Voyager 2 så det. Neptun får også
//   "Infrarødt (som JWST)".

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG, passerTil } from '../scene3d.js';
import { glød, skilt } from '../kosmos/faelles.js';
import { lavGasplanet } from './planet.js';
import { lavRejse } from './rejse.js';
import { lavFlyby } from './flyby.js';
import { lavRinge, ringTekstur } from './ringe.js';
import { hent, hentedeBilleder } from './hent.js';
import { lavIsmåne } from './maane.js';
import { måneForstørrelse } from './maanestr.js';
import { navneTil, navneKnap } from './navne.js';
import { PLANETER, pol, knude, solRetning, baneNormal, solAfstand } from '../data/isgiganter.js';
import * as MÅNER_URANUS from '../data/maaner-uranus.js';
import { vindVed } from '../data/vinde-isgiganter.js';
import * as RINGE_URANUS from '../data/ringe-uranus.js';
import * as RINGE_NEPTUN from '../data/ringe-neptun.js';
import { BÅND, PLETTER, VOYAGER, SKY_HØJDE, pletFart, pileBredder } from '../data/vejr-neptun.js';

const S = 10000; // km pr. enhed i systemet
export const SEK_PR_SEK = 450; // sekunder i virkeligheden pr. sekund i programmet (som Jupiter, ca. 447)
export const HURTIG = 20; // ⏩
const FASE = 10; // sekunder: kortet glider i faser (planet.js). Neptuns ækvator flytter sig ca. 4° i én fase.
const VIND_SKALA = 1e-3; // tallene i vindens tekstur er uv pr. sekund delt med VIND_SKALA (passer til HalfFloat)
const VIND_RÆKKER = 512;
const MARGEN = 0.03; // kameraet holdes mindst 300 km over skyerne
const GRAD = Math.PI / 180;
// Ringene (UN2): pc 8.192 punkter (ca. 1,7 km pr. punkt ved Uranus), tablet og telefon 4.096, tests 2.048
const RING_N = TEST_HURTIG ? 2048 : LAV_KVALITET ? 4096 : 8192;
const STØV_LYS = 8; // støvet mellem ringene er gjort så mange gange lysere, så det kan ses i modlys (tegnet)
// Kontakten "Infrarødt (som JWST)": metan opsuger infrarødt lys, så planeten bliver mørkere, og ringene træder frem
const IR_PLANET = 0.4; // planetens lysstyrke
const IR_RINGE = 40; // ringene så mange gange lysere
const IR_STØV = 3;
const IR_NEPTUN_RINGE = 5; // Neptuns ringe (og buerne) så mange gange lysere end uden kontakten
// Kappen over polen (UN2, tegnet): fuld, når Solen står mindst KAPPE_TIL over ækvator mod den pol, væk under KAPPE_FRA
const KAPPE_FRA = 15, KAPPE_TIL = 55;
const RINGDATA = { uranus: RINGE_URANUS, neptun: RINGE_NEPTUN };
// Neptuns ringe (UN3): så mange gange lysere end i virkeligheden, så de kan ses i modlys (tegnet). Buerne kredser med
// ringen, og ved kontakten "Neptun i 1989" toner buerne fra 1989 ind og de senest kendte ud (to sæt, 10 pladser).
const NEPTUN_RING_LYS = 6;
const TONING = 2; // kontakterne toner ind og ud på ca. et halvt sekund
// Månerne (UN4): kortene er Voyagers (JPL/USGS, 1440 × 720) på alle skærme. De små måner er mørke som ringene
// (albedo 0,07-0,08) og gjort LILLE_LYS gange lysere, så de kan ses (tegnet). Banerne ses kun langt ude.
const MÅNEDATA = { uranus: MÅNER_URANUS };
const MÅNE_SEG = TEST_HURTIG || LAV_KVALITET ? 64 : 96;
const LILLE_LYS = 5;
const BANE_FRA = 30, BANE_TIL = 60; // banerne toner frem, når kameraet er så langt ude (enheder af 10.000 km)
// Flybyen (UN5): "Start flyby" venter højst FORHÅND_TID på kortene (som ved Jupiter). ÅR_TID: så mange sekunder tager
// det, når skyderen "År" kører af sig selv (Uranus' stop 2). VOYAGER_DATO: Voyager 2 ved Uranus.
const FORHÅND_TID = 8000;
const ÅR_TID = 8;
const VOYAGER_DATO = { uranus: new Date(Date.UTC(1986, 0, 24)) };
const JÆVNDØGN = { uranus: new Date(Date.UTC(2007, 11, 8)) }; // Uranus' stop 2 ses fra Solens retning ved jævndøgn

// Årstal (med decimaler) og dato
export const årTilDato = (år) => new Date(Date.UTC(2000, 0, 1, 12) + (år - 2000) * 365.25 * 864e5);
export const datoTilÅr = (d) => 2000 + (d.getTime() - Date.UTC(2000, 0, 1, 12)) / (365.25 * 864e5);

// Billederne (billeder/solsystem/KILDER.md): pc 2k, tablet, telefon og tests 1k (Hubbles kort har ikke flere detaljer)
const STØRRELSE = TEST_HURTIG || LAV_KVALITET ? '1k' : '2k';
const SEGMENTER = TEST_HURTIG ? 64 : LAV_KVALITET ? 128 : 192;
const DETALJER = !LAV_KVALITET && !TEST_HURTIG; // fine skyer tæt på (kun pc)

// cfg: { id, navn, ikon, undertitel, tal, side, sider, kort (filnavnets start), kantFarve }. Valgfrit (Uranus, UN2):
// år: { fra, til } (skyderen "År", som kun flytter Solen), ringe: 'uranus' (js/data/ringe-uranus.js) og kapper: true
// (kappen over polerne følger årstiden). Neptun (UN3): ringe: 'neptun' (med buerne) og vejr: true (høje skyer,
// pletterne fra 1989, Voyagers farver og pilene). UN5: steder ([{ id, navn, undertitel }] i træet), stedTekster ({ id:
// { titel, tekst, nu } }) og tur ({ stop, slut }, stop: [{ id, titel, knap, tekst, nu, visning?, kamera?, år? }], se
// js/data/sider/uranus.js og neptun.js).
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

  // Neptuns vejr: båndenes v og halve bredde, pletternes størrelse i kortets enheder og pilenes rækker
  const VEJR = cfg.vejr;
  const kmPrV = Math.PI * P.polRadius; // en ændring i v på 1 er en halv omgang fra pol til pol (ca., parametrisk)
  const vAf = (grader) => 0.5 + tilParametrisk(grader) / Math.PI;
  const bånd = VEJR ? BÅND.map((b) => ({ ...b, v: vAf(b.bredde), halv: (tilParametrisk(b.bredde + b.halv) - tilParametrisk(b.bredde - b.halv)) / (2 * Math.PI), fart: uvPrSek(tilParametrisk(b.bredde)) })) : [];
  const pletter = VEJR ? PLETTER.map((p) => ({ ...p, v: vAf(p.bredde), au: p.km[0] / 2 / (2 * Math.PI * P.radius * Math.cos(tilParametrisk(p.bredde))), av: p.km[1] / 2 / kmPrV, fart: (P.retning * pletFart(p) * SEK_PR_SEK) / 3600, spinFart: (p.spin * 2 * Math.PI * SEK_PR_SEK) / 86400 })) : [];
  const pile = VEJR ? pileBredder().map((r) => {
    const beta = tilParametrisk(r.bredde);
    return { ...r, v: vAf(r.bredde), fart: uvPrSek(beta), antal: Math.max(1, Math.floor((360 * Math.cos(beta)) / 36)) };
  }) : [];

  return {
    id: cfg.id,
    navn: cfg.navn,
    ikon: cfg.ikon,
    tåger: false, // vores eget solsystem: sort himmel med stjerner
    undertitel: cfg.undertitel,
    træ: { rod: cfg.id, grupper: [
      ...(cfg.steder ? [{ navn: 'Steder', punkter: cfg.steder }] : []),
      ...(cfg.måner ? [{
        navn: 'Måner', id: 'maaner', titel: 'Månerne', undertitel: 'De fem store måner i deres baner',
        punkter: [...MÅNEDATA[cfg.måner].MÅNER.map((m) => ({ id: m.id, navn: m.navn })), { id: 'smaa', navn: 'Små måner', undertitel: 'To par, der kan støde sammen' }],
      }] : []),
    ] },
    kamera: { retning: [0.2, 0.1, 1], radius: 21 },
    tal: cfg.tal,
    side: cfg.side,
    sider: cfg.sider ?? {},

    lav(gruppe, { opdaterKnapper, forklaring, fase, verden, sætKontakt }) {
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
      const årNu = datoTilÅr(nu);
      let år = årNu; // skyderen "År" (kun Uranus): Solens retning for dette år
      const sol = new THREE.Vector3(...solRetning(cfg.id, nu)); // Solens retning i systemets retninger
      let infrarødt = false; // kontakten "Infrarødt (som JWST)"
      let ir = 0; // toner ind og ud
      let år1989 = false, f1989 = 0; // kontakten "Neptun i 1989" (toner ind og ud)
      let voyager = false, fVoy = 0; // kontakten "Voyagers farver (1989)"
      let vinde = false, fPile = 0; // kontakten "Vindene" (pile)
      const solNu = new THREE.Vector3(); // i verden

      // ---------- Kloden: aksen mod IAU's nordpol, kortets længde 0° mod knuden ----------
      const system = new THREE.Group();
      const planetG = new THREE.Group();
      const ringData = cfg.ringe ? RINGDATA[cfg.ringe] : null;
      const URANUS_RINGE = cfg.ringe === 'uranus'; // tætte, mørke ringe med skygge og "Infrarødt"
      const ringBillede = ringData ? ringTekstur(RING_N, ringData.ringProfil) : null;
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
        ...(URANUS_RINGE ? { ringTekstur: ringBillede, ringInd: ringData.RING_IND, ringUd: ringData.RING_UD } : {}),
        // Neptuns vejr: høje skyer (ikke i tests, kun pc har de fine striber), pletterne, Voyagers farver og pilene
        ...(VEJR ? { højeSkyer: TEST_HURTIG ? null : { bånd: BÅND.length, højde: SKY_HØJDE / P.radius, fine: DETALJER }, pletter: PLETTER.length, voyager: true, pile: pile.length } : {}),
        // Kappen toner ud mod farven ved 25° på samme halvkugle, fra ca. 35° til 60° (sinus til den parametriske bredde)
        ...(cfg.måner ? { måner: MÅNEDATA[cfg.måner].MÅNER.length } : {}),
        kapper: cfg.kapper ? { fra: Math.sin(tilParametrisk(35)), til: Math.sin(tilParametrisk(60)), vNord: 0.5 + tilParametrisk(25) / Math.PI, vSyd: 0.5 - tilParametrisk(25) / Math.PI } : null,
      });
      planetG.add(planet.mesh);
      // Ringene i ækvatorplanet: de tætte, mørke ringe og støvet, der næsten kun ses i modlys
      let ringe = null, støv = null, støvBillede = null;
      if (ringData && !URANUS_RINGE) {
        // Neptun: alle ringene er støvede og tegnes som støv, og buerne lægges oven i Adams-ringen
        ringe = lavRinge({ skala: S, tekstur: ringBillede, planetRadius: P.radius, flad: FLAD, ind: ringData.RING_IND, ud: ringData.RING_UD, støv: true, tauEnhed: ringData.TAU_ENHED, lys: NEPTUN_RING_LYS, buer: 10 });
        planetG.add(ringe.mesh);
      } else if (ringData) {
        ringe = lavRinge({ skala: S, tekstur: ringBillede, planetRadius: P.radius, flad: FLAD, ind: ringData.RING_IND, ud: ringData.RING_UD, lys: ringData.ALBEDO });
        støvBillede = ringTekstur(1024, ringData.støvProfil);
        støv = lavRinge({ skala: S, tekstur: støvBillede, planetRadius: P.radius, flad: FLAD, ind: ringData.RING_IND, ud: ringData.RING_UD, støv: true, tauEnhed: ringData.STØV_ENHED, lys: STØV_LYS });
        planetG.add(ringe.mesh, støv.mesh);
      }
      let ringeSkjult = false; // kun til tests (billedet med og uden ringene)
      // Kappen over hver pol: fuld, når Solen står højt over den pol (tegnet, se KAPPE_FRA og KAPPE_TIL)
      const kapper = [1, 1];
      function sætKapper() {
        if (!cfg.kapper) return;
        const b = Math.asin(THREE.MathUtils.clamp(sol.dot(akse), -1, 1)) / GRAD;
        kapper[0] = THREE.MathUtils.smoothstep(b, KAPPE_FRA, KAPPE_TIL);
        kapper[1] = THREE.MathUtils.smoothstep(-b, KAPPE_FRA, KAPPE_TIL);
        planet.sætKapper(kapper[0], kapper[1]);
      }
      // Skyderen "År": kun Solens retning (og kappen) skifter, ikke planeten, månerne eller kameraet
      function sætÅr(v) {
        år = v;
        sol.set(...solRetning(cfg.id, årTilDato(v)));
        sætKapper();
        // Ved en måne følger kameraet Solen (ellers ser man kun en tynd skive, når Solen flytter sig)
        if (erMåne(visning)) { flyvTilMåne(måneMed(visning)); rejse.hop(); }
      }
      // Skyderen flyttes med (flybyen og tests)
      function sætÅrOgSkyder(v) {
        sætÅr(v);
        styring.find((x) => x.skyder)?.sæt?.(Math.round(v * 10) / 10);
      }
      sætKapper();
      // Buerne: de senest kendte (plads 0-4) og dem fra 1989 (plads 5-9), tonet efter kontakten "Neptun i 1989"
      const tilBue = (b, vægt) => ({ ind: ringData.ADAMS.r - ringData.ADAMS.bred / 2, ud: ringData.ADAMS.r + ringData.ADAMS.bred / 2, fra: b.fra * GRAD, til: b.til * GRAD, tau: b.tau * vægt });
      const sætBuer = () => ringe?.sætBuer?.([...ringData.BUER_NU.map((b) => tilBue(b, 1 - f1989)), ...ringData.BUER_1989.map((b) => tilBue(b, f1989))]);
      if (ringData && !URANUS_RINGE) sætBuer();
      if (VEJR) {
        planet.sætPile(pile.map((r) => ({ v: r.v, fart: r.fart, længde: r.længde, antal: r.antal })), 0);
        planet.sætVoyager(0, VOYAGER.gain, VOYAGER.midt, VOYAGER.kontrast);
      }
      // Skyerne og pletterne følger vinden som stive blokke (vindTid er programmets ur)
      const skyListe = bånd.map((b) => ({ v: b.v, halv: b.halv, u: 0, dækning: 0 }));
      const pletListe = pletter.map((p) => ({ u: 0, v: p.v, au: p.au, av: p.av, mørk: p.mørk, midt: p.midt, syd: p.syd, vinkel: 0 }));
      function sætVejr() {
        if (!VEJR) return;
        bånd.forEach((b, i) => {
          const s = skyListe[i];
          s.u = (((b.fart * vindTid) % 1) + 1) % 1;
          s.dækning = THREE.MathUtils.lerp(b.nu, b.år1989, f1989);
        });
        planet.sætSkyer(skyListe);
        pletter.forEach((p, i) => {
          const q = pletListe[i];
          q.u = ((((p.længde / 360 + p.fart * vindTid) % 1) + 1) % 1);
          q.vinkel = (p.spinFart * vindTid) % (Math.PI * 2);
        });
        planet.sætPletter(pletListe);
        planet.sætPletStyrke(f1989);
        planet.sætVoyager(fVoy);
        planet.sætPile(null, fPile);
      }
      system.add(planetG);
      gruppe.add(system);
      let hentet = false;
      let aktiv = true;
      hent(`${cfg.kort}-${STØRRELSE}.jpg`, (t) => { planet.sætKort(t); hentet = true; queueMicrotask(hentMåner); }, { anisotropi: LAV_KVALITET ? 2 : 4, fejl: () => queueMicrotask(hentMåner) });

      // ---------- UN4: månerne i ækvatorplanet (cfg.måner) ----------
      // De kredser den vej, planeten drejer (Uranus: med uret set fra IAU's nordpol), og vender samme side mod den
      // (længde 0° i kortets midte). Miranda hælder 4,34° (knuden er tegnet). Vinklen i banen måles fra Solens retning i
      // ækvatorplanet ved starten (solVinkel) og vokser mod uret set fra IAU's nordpol.
      const MD = cfg.måner ? MÅNEDATA[cfg.måner] : null;
      const solLokal = sol.clone().applyQuaternion(planetG.quaternion.clone().invert());
      const solVinkel = Math.atan2(-solLokal.z, solLokal.x) / GRAD;
      // Solens vinkelradius set fra planeten (radianer): halvskyggens bredde ved skyggerne
      const SOL_VINKEL = 695700 / (solAfstand(cfg.id, nu) * 1.496e8);
      if (MD) planet.mesh.material.uniforms.uSolVinkel.value = SOL_VINKEL;
      let måneTid = 0; // månernes ur (programmets sekunder). Står stille, mens man besøger en måne.
      let visning = cfg.id; // planeten, 'maaner' (oversigten), 'smaa' (de små måner) eller en måne
      const måner = MD ? [...MD.MÅNER.map((m) => ({ ...m, lille: false })), ...MD.SMÅ.map((m) => ({ ...m, lille: true }))].map((m) => {
        const r = m.r / S;
        const baneG = new THREE.Group(); // banens plan (Miranda hælder lidt)
        baneG.rotation.x = (m.hældning ?? 0) * GRAD;
        const bane = new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(Array.from({ length: 360 }, (_, j) => new THREE.Vector3(Math.cos((j / 360) * Math.PI * 2), 0, Math.sin((j / 360) * Math.PI * 2)).multiplyScalar(m.afstand / S))),
          new THREE.LineBasicMaterial({ color: 0xa9d6e6, transparent: true, opacity: 0, depthWrite: false }),
        );
        const g = (0.53 * m.albedo * LILLE_LYS) / 0.6; // uden kort tegnes månen i farven gange 0,6
        const klode = m.lille
          ? lavIsmåne(r, { farve: [g, g, g * 0.97], segmenter: 32, klump: { frø: m.frø, styrke: 0.22 } })
          : lavIsmåne(r, { lys: m.lys, segmenter: MÅNE_SEG });
        const plads = new THREE.Group(); // stedet i banen
        const krop = new THREE.Group(); // drejes, så samme side vender mod planeten, og gøres større langt væk
        krop.add(klode.gruppe);
        plads.add(krop);
        const etiket = skilt(m.navn, '#d8f2ff', 1);
        etiket.visible = false;
        baneG.add(bane, plads, etiket);
        planetG.add(baneG);
        return { ...m, r, klode, plads, krop, etiket, bane, baneG, forhold: etiket.scale.x / etiket.scale.y, vinkel: 0, hentet: false };
      }) : [];
      const store = måner.filter((m) => !m.lille);
      const erMåne = (id) => store.some((m) => m.id === id);
      const måneMed = (id) => måner.find((m) => m.id === id);
      // Vinklen i banen (grader, mod uret set fra IAU's nordpol) ved månernes ur t
      const vinkelVed = (m, t = måneTid) => solVinkel + P.retning * (m.start + (360 * t * SEK_PR_SEK) / (m.døgn * 86400));
      function placerMåner() {
        for (const m of måner) {
          m.vinkel = vinkelVed(m) * GRAD;
          m.plads.position.set(Math.cos(m.vinkel), 0, -Math.sin(m.vinkel)).multiplyScalar(m.afstand / S);
          m.krop.rotation.y = m.vinkel + Math.PI; // længde 0° vender mod planeten
        }
      }
      placerMåner();
      // Kortene hentes efter planetens, én ad gangen, og lægges i grafikkortet med det samme
      function hentKort(m, klar) {
        if (m.hentet) return klar?.();
        m.hentet = true;
        hent(`${m.id}-1440.jpg`, (t) => {
          m.klode.sætKort(t);
          if (aktiv) verden.renderer.initTexture(t);
          klar?.();
        }, { farve: false, kanaler: 1, fejl: klar });
      }
      // Indtil kortene er hentet og lagt i grafikkortet, er "Start flyby" grå (højst FORHÅND_TID, som ved Jupiter)
      let flybyKlar = false;
      const forhåndUr = setTimeout(() => flybyErKlar(), FORHÅND_TID);
      function flybyErKlar() {
        if (flybyKlar || !aktiv) return;
        flybyKlar = true;
        clearTimeout(forhåndUr);
        lavKnapper();
      }
      function hentMåner(i = 0) {
        if (!aktiv) return;
        if (i >= store.length) return flybyErKlar();
        hentKort(store[i], () => hentMåner(i + 1));
      }
      // Står en måne i planetens skygge, spoles månernes ur frem, til den er ude (ellers er den sort og ser ud, som om den
      // mangler). Det sker kun omkring jævndøgn (skyderen "År"), for ellers står Solen højt over ækvatorplanet.
      const skyggeH = new THREE.Vector3();
      function iSkygge(m) {
        skyggeH.copy(m.plads.position).applyEuler(m.baneG.rotation).applyQuaternion(planetG.quaternion);
        const t = -skyggeH.dot(sol);
        return t > 0 && skyggeH.addScaledVector(sol, t).length() < R * 1.15 + m.r;
      }
      function udAfSkygge(m) {
        for (let i = 0; i < 12 && iSkygge(m); i++) {
          måneTid += ((Math.asin(Math.min(1, (R * 0.5) / (m.afstand / S))) / (Math.PI * 2)) * m.døgn * 86400) / SEK_PR_SEK;
          placerMåner();
        }
      }

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
      // Hele ringsystemet i billedet (ud til lidt uden for epsilon-ringen)
      const helSystem = (retning) => rejse.flyv({ fokus: () => midtNul, afstand: passer((ringData ? ringData.RING_UD / S : R) * 1.1), retning, min: R * 1.15, max: 450 });
      const kamPos = new THREE.Vector3();
      function kameraRetning() {
        rejse.kameraPunkt(kamPos);
        if (kamPos.lengthSq() < 1e-9) return START.clone();
        return kamPos.normalize();
      }
      // ---------- Månerne: oversigten, de små måner og et besøg ----------
      const tekster = cfg.måneTekster ?? {};
      // En retning i systemet: vinklen om aksen fra Solens retning (grader, mod uret set fra IAU's nordpol) og højden over
      // ækvatorplanet mod den pol, der har sol (grader)
      const retningVed = (vinkel, højde) => {
        const polSol = akse.clone().multiplyScalar(Math.sign(sol.dot(akse)) || 1);
        const vandret = sol.clone().addScaledVector(akse, -sol.dot(akse)).normalize().applyAxisAngle(akse, vinkel * GRAD);
        return vandret.multiplyScalar(Math.cos(højde * GRAD)).addScaledVector(polSol, Math.sin(højde * GRAD)).normalize();
      };
      const fokusHjælp = new THREE.Vector3();
      const fokusPå = (m) => () => fokusHjælp.copy(m.plads.position).applyEuler(m.baneG.rotation).applyQuaternion(planetG.quaternion);
      // Oversigten: alle fem baner set fra den pol, der har sol, så de ligner en skydeskive
      function tilMåner() {
        flyvMåner();
        fase(null);
        forklaring('');
      }
      function flyvMåner() {
        visning = 'maaner';
        const afstand = passer((MD.MÅNER[MD.MÅNER.length - 1].afstand / S) * 1.06);
        rejse.flyv({ fokus: () => midtNul, afstand, retning: retningVed(-30, 55), min: R * 1.15, max: Math.max(450, afstand * 1.5) });
      }
      // De små måner: banerne set næsten fra polen, og månerne kredser videre (med ⏩ ses Cressida indhente Desdemona)
      function tilSmå() {
        visning = 'smaa';
        const ud = Math.max(...MD.SMÅ.map((m) => m.afstand)) / S;
        rejse.flyv({ fokus: () => midtNul, afstand: passer(ud * 1.15), retning: retningVed(-20, 70), min: R * 1.15, max: 450 });
        fase(tekster.små?.titel ?? null, tekster.små?.tekst);
        forklaring(tekster.småNu ?? '');
      }
      // Et kort besøg (som ved Jupiter): kameraet flyver hen til månen, og Solen lyser skråt fra siden
      // Kameraet ved en måne: 60° fra Solen om aksen og på 0,65 gange Solens bredde, så der er lidt skygge at se. Det
      // følger skyderen "År" uden spring ved jævndøgn: I 2026 ses den nordlige halvdel (aldrig fotograferet), i 1986 den
      // sydlige (Voyagers billeder).
      function måneRetning() {
        const b = Math.asin(THREE.MathUtils.clamp(sol.dot(akse), -1, 1));
        const vandret = sol.clone().addScaledVector(akse, -sol.dot(akse)).normalize().applyAxisAngle(akse, 60 * GRAD);
        return vandret.multiplyScalar(Math.cos(b * 0.65)).addScaledVector(akse, Math.sin(b * 0.65)).normalize();
      }
      const flyvTilMåne = (m) => rejse.flyv({ fokus: fokusPå(m), afstand: passer(m.r * 1.08), retning: måneRetning(), min: m.r * 1.15, max: 450 });
      function flyvBesøg(m) {
        visning = m.id;
        udAfSkygge(m);
        hentKort(m);
        flyvTilMåne(m);
      }
      function besøg(m) {
        flyvBesøg(m);
        fase(m.navn, tekster.stop?.[m.id]);
        forklaring(tekster.nu ?? '');
      }

      // ---------- UN5: stederne (cfg.steder) ----------
      // Nordpolen (Uranus): kameraet over polen på Solens side, så kappen ses i sollys
      const polOp = new THREE.Vector3(), polPunkt = new THREE.Vector3();
      const vandretSol = (drej = 0) => {
        const v = sol.clone().addScaledVector(akse, -sol.dot(akse));
        if (v.lengthSq() < 1e-8) v.set(akse.y, -akse.x, 0); // Solen lige over polen (sker ikke, men for en sikkerheds skyld)
        return v.normalize().applyAxisAngle(akse, drej * GRAD);
      };
      function flyvPol() {
        visning = 'nordpol';
        polOp.copy(akse);
        polPunkt.copy(akse).multiplyScalar(R * FLAD);
        const v = 65 * GRAD;
        const retning = vandretSol().multiplyScalar(Math.cos(v)).addScaledVector(polOp, Math.sin(v));
        const afstand = passer(R * 0.75); // kappen fra ca. 60° bredde og op
        rejse.flyv({ fokus: () => polPunkt, op: () => polOp, afstand, retning, min: 0.3, max: Math.max(8, afstand * 1.3) });
      }
      // De mørke ringe (Uranus): tæt på fra den side, Solen lyser på, med epsilon-ringen foran og planeten bagved
      const ringPunkt = new THREE.Vector3(), ringOp = new THREE.Vector3();
      const EPSILON = URANUS_RINGE ? ringData.RINGE.find((g) => g.navn === 'Epsilon').r / S : 0;
      function flyvRinge() {
        visning = 'ringe';
        ringOp.copy(akse).multiplyScalar(Math.sign(sol.dot(akse)) || 1);
        // Fokus halvvejs ude mod epsilon-ringen og kameraet 50° over ringenes plan: Ringene står foran planeten, og
        // planetens side med sol ses bagved (prøvet med billeder i 1986 og 2026)
        const ud = vandretSol(40);
        ringPunkt.copy(ud).multiplyScalar(EPSILON * 0.45);
        const e = 50 * GRAD;
        const retning = ud.multiplyScalar(Math.cos(e)).addScaledVector(ringOp, Math.sin(e)).normalize();
        rejse.flyv({ fokus: () => ringPunkt, op: () => ringOp, afstand: passer(3.6), retning, min: 0.2, max: 450 });
      }
      // I skyggen (Uranus' stop 5 og Neptuns ringbuer): kameraet bag planeten, så Solen er skjult, og ringene ses i
      // modlys. Vinklen mellem planetens midte og Solen set fra kameraet er mindre end planetens vinkelradius.
      function flyvSkygge(id) {
        visning = id;
        const afstand = passer((ringData.RING_UD / S) * 1.1);
        const skjul = Math.asin((R * FLAD) / afstand) * 0.55;
        const retning = sol.clone().negate().addScaledVector(akse, Math.tan(skjul)).normalize();
        rejse.flyv({ fokus: () => midtNul, afstand, retning, min: R * 1.15, max: 450 });
      }
      // Den Store Mørke Plet (Neptun): kontakten "Neptun i 1989" slås til, og Neptun drejer, mens kameraet flyver, hen
      // til en formiddag ved pletten (Solen PLET_SOL over horisonten). Ved pletten står døgnet stille, så den bliver i
      // sollys, men den driver langsomt med vinden (som Jupiters plet).
      let drejTur = null;
      const døgnStår = () => visning === 'plet';
      const PLET_SOL = 45 * GRAD;
      const pletRamme = { punkt: new THREE.Vector3(), op: new THREE.Vector3(), nord: new THREE.Vector3(), øst: new THREE.Vector3() };
      const pletPrøve = { punkt: new THREE.Vector3(), op: new THREE.Vector3(), nord: new THREE.Vector3(), øst: new THREE.Vector3() };
      const qPlet = new THREE.Quaternion();
      // Pletten i systemets retninger, når planeten er drejet d: punktet, lodret, nord og øst
      function pletVed(d = døgn, ud = pletRamme) {
        const u = pletListe[0].u * Math.PI * 2, b = tilParametrisk(pletter[0].bredde);
        qPlet.setFromAxisAngle(Y, d).premultiply(planetG.quaternion);
        ud.punkt.set(-Math.cos(u) * Math.cos(b) * R, Math.sin(b) * R * FLAD, Math.sin(u) * Math.cos(b) * R).applyQuaternion(qPlet);
        ud.op.set(-Math.cos(u) * Math.cos(b), Math.sin(b) / FLAD, Math.sin(u) * Math.cos(b)).normalize().applyQuaternion(qPlet);
        ud.nord.set(Math.cos(u) * Math.sin(b), FLAD * Math.cos(b), -Math.sin(u) * Math.sin(b)).normalize().applyQuaternion(qPlet);
        ud.øst.set(Math.sin(u), 0, Math.cos(u)).applyQuaternion(qPlet);
        return ud;
      }
      function døgnVedPlet() {
        let bedst = døgn, fejl = Infinity;
        for (let i = -360; i <= 360; i++) {
          const d = døgn + (i / 360) * Math.PI;
          pletVed(d, pletPrøve);
          if (pletPrøve.øst.dot(sol) <= 0) continue;
          const f = Math.abs(Math.asin(THREE.MathUtils.clamp(pletPrøve.op.dot(sol), -1, 1)) - PLET_SOL) + Math.abs(i) * 1e-4;
          if (f < fejl) { fejl = f; bedst = d; }
        }
        return bedst;
      }
      function flyvPlet() {
        visning = 'plet';
        if (!år1989) { år1989 = true; sætKontakt?.('Neptun i 1989', true); }
        sætVejr(); // pletternes plads lige nu
        const til = døgnVedPlet();
        drejTur = { fra: døgn, til };
        // Kameraet kigger skråt ned fra syd, 55° over horisonten
        const p = pletVed(til, pletPrøve);
        const a = 180 * GRAD, v = 55 * GRAD;
        const retning = new THREE.Vector3().addScaledVector(p.nord, Math.cos(v) * Math.cos(a)).addScaledVector(p.øst, Math.cos(v) * Math.sin(a)).addScaledVector(p.op, Math.sin(v));
        const afstand = passer(1.6); // ca. 32.000 km bredt billede, pletten er 13.000 km lang
        rejse.flyv({ fokus: () => pletVed().punkt, op: () => pletRamme.op, afstand, retning, min: 0.12, max: Math.max(6, afstand * 1.25) });
      }
      // Et sted i træet: flyv derhen (flybyen sætter selv sin undertekst)
      function flyvSted(id) {
        if (id === 'maaner') flyvMåner();
        else if (erMåne(id)) flyvBesøg(måneMed(id));
        else if (id === 'nordpol') flyvPol();
        else if (id === 'ringe') flyvRinge();
        else if (id === 'skygge' || id === 'buer') flyvSkygge(id);
        else if (id === 'plet') flyvPlet();
      }
      const stedTekster = cfg.stedTekster ?? {};
      function gåTil(id) {
        if (id === visning && id !== cfg.id) return;
        flyby?.afslut();
        årTur = null;
        drejTur = null;
        if (id === cfg.id) {
          visning = cfg.id;
          fase(null);
          forklaring('');
          helPlanet(kameraRetning());
        } else if (MD && id === 'maaner') tilMåner();
        else if (MD && id === 'smaa') tilSmå();
        else if (erMåne(id)) besøg(måneMed(id));
        else if (stedTekster[id]) {
          flyvSted(id);
          fase(stedTekster[id].titel, stedTekster[id].tekst);
          forklaring(stedTekster[id].nu ?? '');
        }
      }

      // ---------- UN5: flybyen (cfg.tur, js/solsystem/flyby.js) ----------
      // Skyderen "År" kan køre af sig selv (Uranus' stop 2: fra i dag tilbage til 1986). Den stopper, når man selv
      // trækker i skyderen eller går et andet sted hen.
      let årTur = null; // { fra, til, t } (t fra 0 til 1)
      const voyagerÅr = VOYAGER_DATO[cfg.id] ? datoTilÅr(VOYAGER_DATO[cfg.id]) : årNu;
      const sideRetning = JÆVNDØGN[cfg.id] ? new THREE.Vector3(...solRetning(cfg.id, JÆVNDØGN[cfg.id])).addScaledVector(Y, 0.1).normalize() : START;
      const BÅND_RETNING = sol.clone().lerp(START, 0.4).normalize(); // hele kloden med Solen næsten bag kameraet
      const TUR = cfg.tur?.stop ?? [];
      function flyvTilStop(stop, nr) {
        årTur = null;
        drejTur = null;
        visning = cfg.id; // så skyderen ikke flytter kameraet, hvis man kommer fra en måne
        if (cfg.år && stop.år) {
          sætÅrOgSkyder(stop.år === 'voyager' ? voyagerÅr : årNu);
          if (stop.år === 'tilbage') {
            if (ROLIG) sætÅrOgSkyder(voyagerÅr);
            else årTur = { fra: årNu, til: voyagerÅr, t: 0 };
          }
        }
        const v = stop.visning ?? stop.id;
        if (v === cfg.id) {
          if (stop.kamera === 'system') helSystem(START);
          else if (stop.kamera === 'sol') helPlanet(BÅND_RETNING);
          else if (stop.kamera === 'side') helPlanet(sideRetning);
          else helPlanet(START);
        } else flyvSted(v);
        forklaring(stop.nu + (nr === TUR.length - 1 ? cfg.tur.slut : ''));
      }
      const flyby = TUR.length ? lavFlyby({ stop: TUR, fase, forklaring, flyvTil: flyvTilStop, skift: () => lavKnapper(), slut: cfg.tur.slut }) : null;
      function startTur() {
        for (const m of store) hentKort(m);
        flyby.start();
      }
      let første = true; // i første billede står kameraet der med det samme (når panelerne har fået deres plads)

      const styring = [];
      function lavKnapper() {
        styring.length = 0;
        if (cfg.år) {
          styring.push({
            skyder: true, navn: 'År', min: cfg.år.fra, max: cfg.år.til, trin: 0.1, værdi: Math.round(år * 10) / 10,
            vis: (v) => String(Math.floor(v)), ændring: (v) => { årTur = null; sætÅr(v); },
          });
        }
        if (VEJR) styring.push({ tekst: 'Vindene', til: vinde, skift: (til) => { vinde = til; } });
        styring.push({ tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } });
        if (VEJR) {
          styring.push({ tekst: 'Neptun i 1989', til: år1989, skift: (til) => { år1989 = til; } });
          styring.push({ tekst: 'Voyagers farver (1989)', til: voyager, skift: (til) => { voyager = til; } });
        }
        if (ringData) styring.push({ tekst: 'Infrarødt (som JWST)', til: infrarødt, skift: (til) => { infrarødt = til; } });
        // Uden navne kan man stadig trykke på selve månerne
        if (MD) styring.push(navneKnap((til) => { if (!til) for (const m of måner) m.etiket.visible = false; }));
        opdaterKnapper();
      }
      lavKnapper();

      // ---------- Tryk på en af de store måner for at besøge den (som ved Jupiter) ----------
      const lærred = verden.renderer.domElement;
      const stråle = new THREE.Raycaster();
      const peg = new THREE.Vector2();
      const skalaH = new THREE.Vector3(), trykH = new THREE.Vector3(), trykH2 = new THREE.Vector3();
      let ned = null;
      const vedNed = (h) => { ned = { x: h.clientX, y: h.clientY }; };
      const vedOp = (h) => {
        if (!ned || rejse.flyver || flyby?.kører || Math.hypot(h.clientX - ned.x, h.clientY - ned.y) > 8) return;
        const r = lærred.getBoundingClientRect();
        peg.set(((h.clientX - r.left) / r.width) * 2 - 1, -((h.clientY - r.top) / r.height) * 2 + 1);
        stråle.setFromCamera(peg, kamera);
        // Den måne, der er tættest på strålen (inden for et lille stykke, så de er lette at ramme med en finger)
        let bedst = null;
        for (const m of store) {
          if (m.id === visning) continue;
          m.krop.getWorldPosition(trykH2);
          const afstand = stråle.ray.distanceToPoint(trykH2);
          const grænse = Math.max(m.r * m.krop.getWorldScale(skalaH).x * 2.2, trykH2.distanceTo(kamera.position) * 0.03);
          if (afstand < grænse && stråle.ray.direction.dot(trykH.copy(trykH2).sub(kamera.position)) > 0 && (!bedst || afstand < bedst.afstand)) bedst = { m, afstand };
        }
        if (bedst) besøg(bedst.m);
      };
      if (MD) {
        lærred.addEventListener('pointerdown', vedNed);
        lærred.addEventListener('pointerup', vedOp);
      }

      // Månerne hvert billede: størrelsen (større langt væk), banerne, navnene, lyset og skyggerne
      let nær = 0; // 0: ude i rummet (månerne større), 1: ved en måne (den rigtige størrelse)
      let fSmå = 0; // de små måner: 1 ved "Små måner" (tegnet større og med baner og navne), ellers 0 (rigtig størrelse)
      const månePos = new THREE.Vector3(), kamOp = new THREE.Vector3();
      const skygger = store.map(() => ({ midt: new THREE.Vector3(), r: 0 }));
      function opdaterMåner(dt, pMidt, pAkse) {
        const k = rejse.skala;
        const skridt = Math.min(dt, 0.1) * 1.2;
        nær = THREE.MathUtils.clamp(nær + Math.sign((erMåne(visning) ? 1 : 0) - nær) * skridt, 0, 1);
        fSmå = THREE.MathUtils.clamp(fSmå + Math.sign((visning === 'smaa' ? 1 : 0) - fSmå) * skridt, 0, 1);
        const baneLys = 0.22 * THREE.MathUtils.smoothstep(rejse.afstand, BANE_FRA, BANE_TIL) * (1 - nær);
        kamOp.set(0, 1, 0).applyQuaternion(kamera.quaternion);
        let i = 0;
        for (const m of måner) {
          const lys = m.lille ? 0.22 * fSmå : baneLys;
          m.bane.material.opacity = lys;
          m.bane.visible = lys > 0.005;
          m.plads.getWorldPosition(månePos);
          const afstand = månePos.distanceTo(kamera.position);
          const rVerden = m.r * k;
          const større = måneForstørrelse({ afstand, rVerden, nær: m.lille ? 1 - fSmå : nær, kamera, højde: lærred.clientHeight });
          m.krop.scale.setScalar(større);
          const str = afstand * 0.02; // navnets højde i verden
          m.etiket.visible = navneTil() && !rejse.flyver && m.id !== visning && (m.lille ? fSmå > 0.5 : nær < 0.5) && (rVerden * større) / afstand < 0.03;
          if (m.etiket.visible) {
            // Navnet over månen på skærmen (aksen peger ofte mod kameraet, så "op" i banen duer ikke)
            månePos.addScaledVector(kamOp, rVerden * større + str * 0.8);
            m.baneG.worldToLocal(m.etiket.position.copy(månePos));
            m.etiket.scale.set((m.forhold * str) / k, str / k, 1);
          }
          m.klode.sæt(solNu);
          m.klode.skygge(pMidt, R * k, pAkse, FLAD, SOL_VINKEL);
          if (!m.lille) {
            m.plads.getWorldPosition(skygger[i].midt);
            skygger[i].r = rVerden; // skyggen har den rigtige størrelse, også når månen er tegnet større
            i++;
          }
        }
        planet.sætMåner(skygger);
      }

      // ---------- Hvert billede ----------
      const op = new THREE.Vector3(0, 1, 0);
      // I skyggen og ved ringbuerne skal Solen blive bag planeten, så kameraet drejer ikke af sig selv dér (og ved
      // pletten, så den bliver midt i billedet). Det sættes tilbage bagefter (tjekliste E).
      let drejFør = false;
      const stårStille = () => visning === 'skygge' || visning === 'buer' || visning === 'plet';
      const midt = new THREE.Vector3();
      function hvertBillede(dt) {
        if (første) {
          første = false;
          helPlanet(START);
          rejse.hop();
        }
        if (stårStille()) {
          if (orbit.autoRotate) { drejFør = true; orbit.autoRotate = false; }
        } else if (drejFør) { orbit.autoRotate = true; drejFør = false; }
        // Ved pletten drejer Neptun hen til formiddag, mens kameraet flyver
        if (drejTur) {
          døgn = THREE.MathUtils.lerp(drejTur.fra, drejTur.til, rejse.fremdrift);
          if (!rejse.flyver) drejTur = null;
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
        const { midt: pMidt, akse: pAkse } = planet.sæt(solNu, vindTid);
        if (MD) opdaterMåner(dt, pMidt, pAkse);
        // Infrarødt: toner ind og ud (planeten mørkere, ringene lysere)
        ir = THREE.MathUtils.clamp(ir + (infrarødt ? 1 : -1) * Math.min(dt, 0.1) * 2.5, 0, 1);
        planet.sætEksponering(THREE.MathUtils.lerp(1, IR_PLANET, ir));
        // Neptun: kontakterne toner ind og ud, og vejret og buerne følger urene
        const tone = (f, til) => THREE.MathUtils.clamp(f + (til ? 1 : -1) * Math.min(dt, 0.1) * TONING, 0, 1);
        if (VEJR) {
          const før = f1989;
          f1989 = tone(f1989, år1989);
          fVoy = tone(fVoy, voyager);
          fPile = tone(fPile, vinde);
          sætVejr();
          if (f1989 !== før) sætBuer();
        }
        if (ringe && !URANUS_RINGE) {
          ringe.sæt(solNu, pMidt, pAkse);
          ringe.mesh.material.uniforms.uLys.value = NEPTUN_RING_LYS * THREE.MathUtils.lerp(1, IR_NEPTUN_RINGE, ir);
          ringe.sætBueVinkel(bueVinkel());
          ringe.mesh.visible = !ringeSkjult;
        } else if (ringe) {
          ringe.sæt(solNu, pMidt, pAkse);
          støv.sæt(solNu, pMidt, pAkse);
          ringe.mesh.material.uniforms.uLys.value = ringData.ALBEDO * THREE.MathUtils.lerp(1, IR_RINGE, ir);
          støv.mesh.material.uniforms.uLys.value = STØV_LYS * THREE.MathUtils.lerp(1, IR_STØV, ir);
          ringe.mesh.visible = støv.mesh.visible = !ringeSkjult;
        }
      }
      verden.opdateringer.add(hvertBillede);
      // Hvor langt buerne er kredset (radianer, mod uret set fra nordpolen): én omgang på ca. 10,5 timer
      function bueVinkel() {
        if (!ringData?.ADAMS_OMLØB) return 0;
        return (((vindTid * SEK_PR_SEK) / ringData.ADAMS_OMLØB) % 1) * Math.PI * 2;
      }

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
        sted: () => visning,
        // Flybyen: øverst i træet og i bjælken i 3D-billedet
        ...(flyby ? {
          tur: { navn: 'Flyby', stop: TUR.length, klar: () => flybyKlar, kører: () => flyby.kører, start: startTur },
          trin: () => flyby.bjælke(),
        } : {}),
        hurtig: `tiden går ${HURTIG} gange hurtigere`,
        tempo: (t) => { hurtig = t === 'hurtig'; },
        opdater(dt) {
          const d = dt * (hurtig ? HURTIG : 1);
          vindTid += d;
          if (!drejTur && !døgnStår()) døgn += d * DREJ;
          // Skyderen "År" kører af sig selv på flybyen, når kameraet er fremme
          if (årTur && !rejse.flyver) {
            årTur.t = Math.min(1, årTur.t + dt / ÅR_TID);
            const t = årTur.t;
            sætÅrOgSkyder(THREE.MathUtils.lerp(årTur.fra, årTur.til, t * t * (3 - 2 * t)));
            if (t >= 1) årTur = null;
          }
          // Månerne følger deres eget ur, men står stille, mens man besøger en af dem
          if (MD && !erMåne(visning)) { måneTid += d; placerMåner(); }
        },
        stop() {
          aktiv = false;
          clearTimeout(forhåndUr);
          flyby?.afslut();
          lærred.removeEventListener('pointerdown', vedNed);
          lærred.removeEventListener('pointerup', vedOp);
          for (const m of måner) {
            m.etiket.material.map?.dispose();
            m.etiket.material.dispose();
            m.bane.geometry.dispose();
            m.bane.material.dispose();
          }
          verden.opdateringer.delete(hvertBillede);
          rejse.stop();
          if (drejFør) orbit.autoRotate = true;
          vindTekstur.dispose();
          ringBillede?.dispose();
          støvBillede?.dispose();
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
          tur: () => ({ trin: flyby?.trin ?? null, flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand, årTur: !!årTur, klar: flybyKlar }),
          flybyStop: () => TUR.map((t) => ({ id: t.id, visning: t.visning ?? t.id, titel: t.titel, tekst: t.tekst, egenSide: !!cfg.sider?.[t.visning ?? t.id] })),
          // Er Solen skjult bag planeten set fra kameraet (I skyggen og ved ringbuerne)?
          solSkjult: () => {
            planet.mesh.getWorldPosition(midt);
            const til = midt.clone().sub(kamera.position);
            const vinkel = til.clone().normalize().angleTo(solNu);
            return { skjult: vinkel < Math.asin(Math.min(1, (R * FLAD * rejse.skala) / til.length())), vinkel: vinkel / GRAD };
          },
          // Solens højde over pletten (grader), og om Neptuns døgn står stille
          pletSol: () => (VEJR ? { højde: Math.asin(THREE.MathUtils.clamp(pletVed().op.dot(sol), -1, 1)) / GRAD, døgn } : null),
          // UN2: skyderen "År", kappen over polerne, ringene og "Infrarødt"
          år: () => år,
          sætÅr: (v) => { sætÅr(v); const s = styring.find((x) => x.skyder); s?.sæt?.(v); },
          kapper: () => [...kapper],
          ringeSynlige: (til) => { ringeSkjult = !til; },
          ringe: () => (ringe ? { synlige: ringe.mesh.visible, ind: ringData.RING_IND, ud: ringData.RING_UD, lys: ringe.mesh.material.uniforms.uLys.value, støvLys: støv?.mesh.material.uniforms.uLys.value, punkter: ringBillede.image.width } : null),
          infrarødt: () => ir,
          eksponering: () => planet.mesh.material.uniforms.uEks.value,
          drejSelv: (til) => { orbit.autoRotate = til; },
          visRinge: () => { helSystem(kameraRetning()); rejse.hop(); },
          hop: () => rejse.hop(),
          // UN3: Neptuns vejr. Kontakterne (0 til 1), båndenes og pletternes forskydning i u (østlig længde / 360), og
          // buerne (vinkel i radianer og τ for hver af de 10 pladser)
          vejr: () => (VEJR ? {
            år1989: f1989, voyager: fVoy, pile: fPile,
            bånd: skyListe.map((b, i) => ({ bredde: bånd[i].bredde, u: b.u, dækning: b.dækning, fart: bånd[i].fart })),
            pletter: pletListe.map((q, i) => ({ navn: pletter[i].navn, u: q.u, v: q.v, vinkel: q.vinkel, fart: pletter[i].fart })),
            pileRækker: pile.map((r) => ({ bredde: r.bredde, vind: Math.round(r.vind) })),
          } : null),
          buer: () => (ringe && !URANUS_RINGE ? { vinkel: bueVinkel(), tau: [...ringe.mesh.material.uniforms.uBueTau.value], fra: ringe.mesh.material.uniforms.uBue.value.map((v) => v.z / GRAD), omløb: ringData.ADAMS_OMLØB } : null),
          sætUr: (t) => { vindTid = t; },
          // UN4: månerne. Vinklen i banen målt i geometrien (grader, atan2(−z, x) i banens plan, vokser mod uret set fra
          // IAU's nordpol), omløbstiden, hvor stor månen er tegnet, og hvor stor den er (vinkelradius i grader set fra
          // kameraet), om navnet ses, om kortet er hentet, banens hældning, og om skyggerne er sat
          måner: () => måner.map((m) => {
            m.plads.getWorldPosition(månePos);
            const afstand = månePos.distanceTo(kamera.position);
            const rVerden = m.r * rejse.skala;
            const u = planet.mesh.material.uniforms;
            return {
              id: m.id, lille: m.lille, vinkel: Math.atan2(-m.plads.position.z, m.plads.position.x) / GRAD, døgn: m.døgn,
              tegnet: Math.atan((rVerden * m.krop.scale.x) / afstand) / GRAD, rigtig: Math.atan(rVerden / afstand) / GRAD,
              navn: m.etiket.visible, hentet: m.hentet, kort: !!m.klode.gruppe.children[0].material.uniforms.tKort.value,
              hældning: m.baneG.rotation.x / GRAD, bane: m.bane.visible,
              planetSkygge: m.klode.gruppe.children[0].material.uniforms.uPlanetR.value > 0,
              skyggeSat: !m.lille && u.uMaane.value.some((v) => Math.abs(v.w - rVerden) < 1e-9 && v.w > 0),
            };
          }),
          // Månernes ur (programmets sekunder)
          måneUr: () => måneTid,
          sætMåneUr: (t) => { måneTid = t; placerMåner(); },
          nær: () => nær,
          visning: () => visning,
          // Hvor en måne står på skærmen (i pixels), så testen kan trykke på den
          månePlads(navn) {
            const m = måner.find((x) => x.navn === navn);
            m.krop.getWorldPosition(månePos).project(kamera);
            const r = verden.renderer.domElement.getBoundingClientRect();
            return { x: r.left + ((månePos.x + 1) / 2) * r.width, y: r.top + ((1 - månePos.y) / 2) * r.height, foran: månePos.z < 1 };
          },
          // Månen i planetens skygge (til testen af skyggerne): spol månernes ur, til månen står bag planeten
          iSkygge: (id) => iSkygge(måneMed(id)),
          // Tæt på et sted på breddegraden `bredde` ved grænsen mellem dag og nat (Solen 78° fra lodret, om eftermiddagen),
          // hvor skyernes skygger er længst (til billeder). afstand i planetradier.
          tætPå: (bredde = 27, afstand = 0.15) => {
            const beta = tilParametrisk(bredde);
            const punkt = (u, ud) => ud.set(-Math.cos(u) * Math.cos(beta) * R, Math.sin(beta) * R * FLAD, Math.sin(u) * Math.cos(beta) * R).applyAxisAngle(Y, døgn).applyQuaternion(planetG.quaternion);
            const n = new THREE.Vector3(), m = new THREE.Vector3();
            let bedst = 9, u0 = 0;
            for (let i = 0; i < 1440; i++) {
              const u = (i / 1440) * Math.PI * 2;
              const c = punkt(u, n).normalize().dot(sol);
              const senere = punkt(u, m).applyAxisAngle(planetG.up.clone().applyQuaternion(planetG.quaternion), 0.01).normalize().dot(sol);
              if (senere < c && Math.abs(c - Math.cos(78 * GRAD)) < bedst) { bedst = Math.abs(c - Math.cos(78 * GRAD)); u0 = u; }
            }
            const op = punkt(u0, n).clone().normalize();
            const hjælp = new THREE.Vector3();
            rejse.flyv({ fokus: () => punkt(u0, hjælp), afstand: R * afstand, retning: op, min: 0.05, max: 450 });
            rejse.hop();
          },
          // Drej Neptun, så Den Store Mørke Plet vender mod kameraet (til billeder)
          visPlet: () => {
            if (!VEJR) return;
            const cam = new THREE.Vector3().copy(kamera.position).sub(planet.mesh.getWorldPosition(new THREE.Vector3())).normalize();
            const p = pletListe[0], beta = tilParametrisk(pletter[0].bredde), u = p.u * Math.PI * 2;
            const lok = new THREE.Vector3(-Math.cos(u) * Math.cos(beta), Math.sin(beta), Math.sin(u) * Math.cos(beta));
            let bedst = -2, d0 = døgn;
            for (let i = 0; i < 720; i++) {
              const d = (i / 720) * Math.PI * 2;
              planet.mesh.rotation.y = d;
              planet.mesh.updateWorldMatrix(true, false);
              const w = lok.clone().applyMatrix4(planet.mesh.matrixWorld).sub(planet.mesh.getWorldPosition(new THREE.Vector3())).normalize();
              if (w.dot(cam) > bedst) { bedst = w.dot(cam); d0 = d; }
            }
            døgn = d0;
            planet.mesh.rotation.y = døgn;
          },
        },
      };
    },
  };
}
