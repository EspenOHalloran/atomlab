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

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, passerTil } from '../scene3d.js';
import { glød } from '../kosmos/faelles.js';
import { lavGasplanet } from './planet.js';
import { lavRejse } from './rejse.js';
import { lavRinge, ringTekstur } from './ringe.js';
import { hent, hentedeBilleder } from './hent.js';
import { PLANETER, pol, knude, solRetning, baneNormal } from '../data/isgiganter.js';
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
// Kappen over polen (UN2, tegnet): fuld, når Solen står mindst KAPPE_TIL over ækvator mod den pol, væk under KAPPE_FRA
const KAPPE_FRA = 15, KAPPE_TIL = 55;
const RINGDATA = { uranus: RINGE_URANUS, neptun: RINGE_NEPTUN };
// Neptuns ringe (UN3): så mange gange lysere end i virkeligheden, så de kan ses i modlys (tegnet). Buerne kredser med
// ringen, og ved kontakten "Neptun i 1989" toner buerne fra 1989 ind og de senest kendte ud (to sæt, 10 pladser).
const NEPTUN_RING_LYS = 6;
const TONING = 2; // kontakterne toner ind og ud på ca. et halvt sekund

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
// pletterne fra 1989, Voyagers farver og pilene).
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
      let år = datoTilÅr(nu); // skyderen "År" (kun Uranus): Solens retning for dette år
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
      // Hele ringsystemet i billedet (ud til lidt uden for epsilon-ringen)
      const helSystem = (retning) => rejse.flyv({ fokus: () => midtNul, afstand: passer((ringData ? ringData.RING_UD / S : R) * 1.1), retning, min: R * 1.15, max: 450 });
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
        if (cfg.år) {
          styring.push({
            skyder: true, navn: 'År', min: cfg.år.fra, max: cfg.år.til, trin: 0.1, værdi: Math.round(år * 10) / 10,
            vis: (v) => String(Math.floor(v)), ændring: sætÅr,
          });
        }
        if (VEJR) styring.push({ tekst: 'Vindene', til: vinde, skift: (til) => { vinde = til; } });
        styring.push({ tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } });
        if (VEJR) {
          styring.push({ tekst: 'Neptun i 1989', til: år1989, skift: (til) => { år1989 = til; } });
          styring.push({ tekst: 'Voyagers farver (1989)', til: voyager, skift: (til) => { voyager = til; } });
        }
        if (URANUS_RINGE) styring.push({ tekst: 'Infrarødt (som JWST)', til: infrarødt, skift: (til) => { infrarødt = til; } });
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
        const { midt: pMidt, akse: pAkse } = planet.sæt(solNu, vindTid);
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
          tur: () => ({ flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand }),
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
