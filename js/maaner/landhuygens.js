// "Land med Huygens" i Solsystemet (spor Måner, M5a og M5b, docs/drejebog-maaner.md afsnit 7-8 og 10): Titan med den
// orange dis (lavTitan fra js/solsystem/atmosfaere.js, læst og brugt, ikke ændret), Cassini med Huygens på siden, slippet,
// turen ind i luften, turen ned i faldskærm og landingen (js/maaner/nedtur.js), billedet fra jorden med de to sten
// (js/maaner/jordbillede.js) og Cassinis modtagere A og B (js/maaner/kanaler.js). Forløbet "Land med Huygens" har fire
// trin (teksterne i js/data/forloeb/land-med-huygens.js, tallene i js/data/maaner/landhuygens.js).
//
// Faserne: 'cassini' (25. december 2004, Huygens sidder på Cassini) → 'slip' (Huygens glider fri og drejer langsomt)
// → 'rejse' ("Tre uger senere …") → 'ind' (14. januar 2005: Huygens suser ind i luften fra 1.270 km med et skær foran
// varmeskjoldet, og kameraet følger med) → 'toning' (en orange toning) → 'ned' (i faldskærm, nedtur.js).
// Trin 1 "slip": Tryk på "Slip Huygens". Færdig, når faldskærmen er ude.
// Trin 2 "disen": Turen ned spoles (⏩ slås til), og Huygens' kamera viser billederne fra luften. Færdig under 1 km, og
// turen holder ved VENT_KM (800 m), så trin 3 kan spørge om lampen, før den tændes.
// Trin 3 "landet": "🪂 Land" (▶, 30 gange hurtigere): Lampen tændes 700 m oppe, Huygens lander (hul, hop, glid og vip), og
// ESA's billede fra jorden fylder scenen. Færdig, når begge sten er målt.
// Trin 4 "tabt": Cassinis modtagere A og B over billedet. Færdig, når begge er prøvet (B: 350 billeder, A: ingen lyttede).
// Laboratoriet: bladring mellem etaperne (Cassini, Faldskærmen, Jorden, Sletten, Landet) som Venus' tur ned, handlingen
// "Slip Huygens", kontakten "Huygens' kamera" og tidsknappen (▶ 30 gange, ⏩ 150 gange hurtigere end virkeligheden).
// Rummet: 1 enhed = 100 km. Cassini og Huygens er tegnet meget større end de var, og Cassini står meget tættere på Titan.

import * as THREE from 'three';
import { verden, ROLIG, centrerVindue } from '../scene3d.js';
import { hent } from '../solsystem/hent.js';
import { lavTitan } from '../solsystem/atmosfaere.js';
import { startForløb, stopForløb, starterSelv, kørerForløb, forløbVenter, forløbRørt, forløbVink, forløbTest } from '../forloeb.js';
import { tagVentForløb } from '../gaa.js';
import * as fremgang from '../fremgang.js';
import { lavHuygens, lavNedtur } from './nedtur.js';
import { lavJordbillede } from './jordbillede.js';
import { lavKanaler } from './kanaler.js';
import { LAND_MED_HUYGENS } from '../data/forloeb/land-med-huygens.js';
import { UNDER_ISEN } from '../data/forloeb/under-isen.js';
import { KM_PR_ENHED, TITAN, START_KM, FALDSKÆRM_KM, VENT_KM, NED_S, SPOL, ETAPER, DATO, TEKST, TAL, SIDE, tidVed } from '../data/maaner/landhuygens.js';

const RT = TITAN.r / KM_PR_ENHED; // ca. 25,7
const SOL = new THREE.Vector3(-0.62, 0.3, 0.72).normalize(); // Solen fra venstre og lidt forfra
const CASSINI = new THREE.Vector3(14, 9, 112); // Cassinis plads i tegningen (Titan i midten)
const TIL_TITAN = CASSINI.clone().negate().normalize();
const SIDE_UD = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), TIL_TITAN).normalize().negate(); // Huygens' side af Cassini
const HUYGENS_RUM = 0.22; // Huygens' størrelse ved Cassini (ca. 2,7 m mod Cassinis 6,8 m)
const VED_SIDEN = 0.36; // Huygens sidder på siden af Cassini (kroppens radius plus varmeskjoldets)
const SLIP_S = 3.2, REJSE_S = 1.6, IND_S = 4.6, TONING_S = 0.7; // sekunder på skærmen
// Turen ind: Huygens kommer skråt ind over den side af Titan, Cassini ser, og kameraet følger ved siden af
const N = CASSINI.clone().normalize(); // op ved stedet, hvor Huygens kommer ind
const T1 = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), N).normalize(); // vandret, på tværs
const T2 = new THREE.Vector3().crossVectors(N, T1).normalize();
const SKRÅ = 0.7; // så meget kommer Huygens fra siden pr. km, den falder
const SYNSVINKEL = 40; // grader lodret (samme som i scene3d.js)
// Under faldskærmen: kameraet ser skråt ned på Huygens, så jorden kan ses bag den (og faldskærmen er med)
const JORDEN_STEN_ID = ['stor', 'lille'];
const JORDEN_STEN = JORDEN_STEN_ID.length;
const NED_BOKS = { hb: 2.1, hh: 2.6, mål: new THREE.Vector3(0, 1.4, 0), retning: new THREE.Vector3(0.75, 0.72, 1).normalize() };

// Cassini: kroppen, parabolen og magnetometerets stang (tegnet af os, som i js/maaner/underisen.js)
function lavCassini(s) {
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0xe6e8ec, metalness: 0.3, roughness: 0.5 });
  const guld = new THREE.MeshStandardMaterial({ color: 0xc89a3a, metalness: 0.6, roughness: 0.4 });
  const krop = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.55, s * 0.55, s * 2.2, 16), guld);
  const skål = new THREE.Mesh(new THREE.CylinderGeometry(s * 1.3, s * 0.45, s * 0.38, 28, 1, true), metal); // parabolen øverst
  skål.material.side = THREE.DoubleSide;
  skål.position.y = s * 1.28;
  const stang = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.05, s * 0.05, s * 4.5, 6), metal);
  stang.rotation.z = Math.PI / 2;
  stang.position.set(-s * 2.4, s * 0.9, 0);
  g.add(krop, skål, stang);
  return g;
}

// Et blødt, orange skær foran varmeskjoldet på vej ind
function lavSkær() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,240,210,1)');
  grad.addColorStop(0.35, 'rgba(255,170,80,0.7)');
  grad.addColorStop(1, 'rgba(255,120,40,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
}

export default {
  id: 'landhuygens',
  navn: 'Land med Huygens',
  ikon: '🪂',
  tåger: false,
  undertitel: 'Huygens\' tur ned gennem Titans dis',
  kamera: { retning: [0.5, 0.2, 1], radius: 2, mål: CASSINI.toArray(), drej: false },
  tal: TAL,
  side: SIDE,
  hurtig: `ca. ${SPOL.hurtig} gange hurtigere end i virkeligheden`,

  lav(gruppe, ctx) {
    const { sætKontakt, fase: visFase } = ctx;
    const vindue = document.getElementById('solsystemVindue');
    const skærm = document.getElementById('solsystem');
    let aktiv = true;

    // ---------- Rummet: Titan, Cassini og Huygens ----------
    const rum = new THREE.Group();
    gruppe.add(rum);
    const titan = lavTitan(RT, KM_PR_ENHED);
    rum.add(titan.gruppe);
    const cassini = lavCassini(0.35);
    cassini.position.copy(CASSINI);
    cassini.rotation.y = Math.atan2(-SIDE_UD.z, SIDE_UD.x); // (kroppens +x mod Huygens, så stangen peger væk fra den)
    rum.add(cassini);
    const huygens = lavHuygens();
    huygens.medSkjold(true);
    rum.add(huygens.gruppe);
    const skær = lavSkær();
    skær.visible = false;
    rum.add(skær);
    const lys = new THREE.DirectionalLight(0xffffff, 2.0);
    lys.position.copy(SOL);
    rum.add(lys, new THREE.AmbientLight(0x404858, 0.6));

    // ---------- Turen ned (kuplen, faldskærmen, måleren og kameraet) ----------
    const nedtur = lavNedtur({ vindue, kamera: verden.kamera });
    gruppe.add(nedtur.gruppe);
    hent('titan-2k.jpg', (t) => { if (aktiv) nedtur.sætKort(t); }, { farve: false, kanaler: 1, rundt: false, vendt: true });
    // Billedet fra jorden (trin 3) og Cassinis modtagere (trin 4)
    const jordbillede = lavJordbillede({
      vindue,
      påMålt: () => { if (kører() && forløbVenter()) forløbRørt(); },
      påLuk: () => visFoto(false),
    });
    const kanaler = lavKanaler({ vindue, påSkift: () => { if (kører() && forløbVenter()) forløbRørt(); } });
    const skilt = document.createElement('div'); // "Tre uger senere …"
    skilt.className = 'lh-skilt';
    skilt.hidden = true;
    vindue.append(skilt);
    const toning = document.createElement('div'); // den orange toning ind i disen
    toning.className = 'lh-toning';
    vindue.append(toning);
    // Mens Huygens falder (også i laboratoriet efter turen), er sidefanerne, Indstillinger og 🔔 skjult, og på telefonen
    // også panelerne, så faldskærmen og jorden kan ses (style.css, .huygens-falder). De kommer igen, når den er landet.
    let falderVist = false;
    const visFalder = (til) => { if (til !== falderVist) { falderVist = til; skærm?.classList.toggle('huygens-falder', til); } };

    // ---------- Tilstanden ----------
    let fase = 'cassini';
    let t = 0; // sekunder i fasen
    let rask = 1; // "Vis mig": faserne går dobbelt så hurtigt
    let hurtig = false; // tidsknappen står på ⏩
    let turbo = 1; // "Vis mig" i trin 2: spoler ekstra hurtigt ned til 1 km
    let hIndgang = START_KM; // højden på vej ind (km)
    let etapeVist = -1;
    let autoSten = 0; // "Vis mig" i trin 3: sekunder, til næste sten måles (0: slået fra)
    const fri = new THREE.Vector3(); // hvor Huygens glider hen ved slippet
    const p = new THREE.Vector3(), v = new THREE.Vector3();
    const NED = new THREE.Vector3(0, -1, 0);

    function huygensVedCassini() {
      huygens.gruppe.scale.setScalar(HUYGENS_RUM);
      huygens.gruppe.position.copy(CASSINI).addScaledVector(SIDE_UD, VED_SIDEN);
      huygens.gruppe.quaternion.setFromUnitVectors(NED, TIL_TITAN); // varmeskjoldet mod Titan
      huygens.medSkjold(true);
      huygens.gruppe.visible = true;
    }
    function tilCassini() {
      fase = 'cassini';
      t = 0;
      rask = 1;
      turbo = 1;
      rum.visible = true;
      cassini.visible = true;
      skær.visible = false;
      skilt.hidden = true;
      toning.classList.remove('vis');
      huygensVedCassini();
      nedtur.skjul();
      nedtur.sætDato(DATO.slip);
      nedtur.sætGrænse(0);
      visFoto(false);
      kanaler.vis(false);
      kameraVedCassini();
    }
    // Billedet fra jorden fylder scenen (og skjuler Huygens' kamera). I laboratoriet kan det lukkes med ✕
    function visFoto(til) {
      jordbillede.vis(til, { luk: !kører() });
      nedtur.foto(til);
    }
    // Huygens er landet og står stille: Billedet fra jorden kommer frem
    nedtur.påLandet = () => {
      if (!aktiv) return;
      visFoto(true);
      if (kører() && trinNu === 'landet') forløbVink(LAND_MED_HUYGENS.vink.sten);
      if (autoSten) autoSten = 0.5;
    };
    // Lad Huygens dale det sidste stykke og lande (trin 3: ▶, så lampen og landingen kan ses)
    let landTrykket = false; // ("Land" er trykket i trin 3)
    function land() {
      if (!aktiv || fase !== 'ned' || nedtur.landet) return;
      landTrykket = true;
      nedtur.sætGrænse(0);
      ctx.tiden('spil');
    }
    const landStartet = () => fase === 'ned' && (landTrykket || nedtur.landet || nedtur.h < VENT_KM - 1e-3);
    function slip() {
      if (fase !== 'cassini' || !aktiv) return;
      fase = 'slip';
      t = 0;
      fri.copy(SIDE_UD).multiplyScalar(0.75).addScaledVector(TIL_TITAN, 0.6);
      if (kørerForløb() && forløbVenter()) forløbRørt();
    }
    // Huygens i højden h (km) på vej ind: skråt ned mod stedet over N
    function indPunkt(h, ud) {
      return ud.copy(N).multiplyScalar(RT + h / KM_PR_ENHED).addScaledVector(T1, ((h - FALDSKÆRM_KM) / KM_PR_ENHED) * SKRÅ);
    }
    function tilInd() {
      fase = 'ind';
      t = 0;
      hIndgang = START_KM;
      cassini.visible = false;
      skilt.hidden = true;
      nedtur.sætDato(DATO.ned);
      huygens.gruppe.scale.setScalar(1);
      huygens.medSkjold(true);
      // Varmeskjoldet fremad
      v.copy(N).multiplyScalar(-1).addScaledVector(T1, -SKRÅ).normalize();
      huygens.gruppe.quaternion.setFromUnitVectors(NED, v);
      placerInd();
      const s = verden.styring;
      s.target.copy(huygens.gruppe.position);
      verden.kamera.position.copy(s.target).addScaledVector(T2, -5.2).addScaledVector(N, 1.3).addScaledVector(T1, 1.8);
      s.minDistance = 0.8;
      s.maxDistance = 12;
    }
    function placerInd() {
      indPunkt(hIndgang, p);
      huygens.gruppe.position.copy(p);
    }
    // Til turen i faldskærm, sekunder efter hovedskærmen kom ud (åbn: faldskærmen folder sig ud)
    function tilNed(sek = 0, åbn = true) {
      fase = 'ned';
      t = 0;
      rum.visible = false;
      skilt.hidden = true;
      toning.classList.remove('vis');
      visFoto(false);
      kanaler.vis(false);
      nedtur.start({ åbn, til: sek });
      kameraNed();
    }
    // Direkte til Huygens på jorden med billedet (etapen "Landet", og når man går tilbage til trin 3-4)
    function tilLandet() {
      if (fase !== 'ned') tilNed(NED_S, false);
      kanaler.vis(false);
      nedtur.tilLandet();
      visFoto(true);
    }

    // ---------- Kameraet ----------
    function afstandFor(hb, hh) {
      const { hul } = verden;
      const tt = Math.tan(THREE.MathUtils.degToRad(SYNSVINKEL / 2));
      return Math.max(hb / ((tt * hul.width) / innerHeight), hh / ((tt * hul.height) / innerHeight)) * 1.06;
    }
    function kameraVedCassini() {
      const s = verden.styring, k = verden.kamera;
      // Bag Cassini og lidt til siden: Huygens på siden af Cassini og Titan stor bagved
      // (på en smal skærm længere væk, så Cassini ikke fylder det hele)
      const { hul } = verden;
      const langt = Math.max(1, (1.6 * hul.height) / Math.max(1, hul.width));
      s.target.copy(CASSINI).addScaledVector(TIL_TITAN, 3);
      k.position.copy(CASSINI).addScaledVector(TIL_TITAN, 3 - 7.6 * langt).addScaledVector(SIDE_UD, 1.7 * langt).add(new THREE.Vector3(0, 1.1 * langt, 0));
      s.minDistance = 0.8;
      s.maxDistance = 16;
      verden.målAfstand = null;
    }
    function kameraNed() {
      const s = verden.styring, k = verden.kamera;
      s.target.copy(NED_BOKS.mål);
      k.position.copy(s.target).addScaledVector(NED_BOKS.retning, afstandFor(NED_BOKS.hb, NED_BOKS.hh));
      s.minDistance = 2.5;
      s.maxDistance = 14;
      s.maxPolarAngle = 1.4; // (kameraet kan ikke komme under jorden, når Huygens er landet)
      verden.målAfstand = null;
    }
    const styringFør = { min: verden.styring.minDistance, max: verden.styring.maxDistance, polar: verden.styring.maxPolarAngle };

    // ---------- Etaperne i laboratoriet (bladring) ----------
    function etape() {
      if (fase !== 'ned') return 0;
      if (nedtur.landet) return ETAPER.length - 1;
      const h = nedtur.h;
      for (let i = ETAPER.length - 1; i >= 1; i--) if (h <= ETAPER[i].km + 0.01) return i;
      return 1;
    }
    function gåEtape(nr) {
      if (!aktiv || kørerForløb()) return;
      nr = THREE.MathUtils.clamp(nr, 0, ETAPER.length - 1);
      if (nr === 0) tilCassini();
      else if (ETAPER[nr].id === 'landet') { tilNed(NED_S, false); jordbillede.nulstil(); tilLandet(); }
      else tilNed(tidVed(ETAPER[nr].km), nr === 1);
      etapeVist = -1;
    }

    // ---------- Styringen ----------
    const styring = [
      { tekst: TEKST.kamera, til: true, skift: (til) => nedtur.kontakt(til) },
      { handling: () => slip(), tekst: TEKST.slip, skjul: () => Boolean(kørerForløb()) || fase !== 'cassini' },
      { handling: () => visFoto(true), tekst: TEKST.foto, skjul: () => Boolean(kørerForløb()) || !nedtur.stille || jordbillede.vist },
    ];

    // ---------- Forløbet "Land med Huygens" (M5a: trin 1-2) ----------
    const kører = () => kørerForløb() === LAND_MED_HUYGENS.id;
    let tilLab = false;
    let ventVink = 0;
    let trinNu = null; // forløbets trin, mens det kører
    // En knap med data-gaa (fx Christiaan Huygens' bog i Opdagelserne): gaa.js' lytter på hele siden tager den
    function gåTil(mål) {
      const b = document.createElement('button');
      b.dataset.gaa = mål;
      b.hidden = true;
      skærm.append(b);
      b.click();
      b.remove();
    }
    const FL_DEL = {
      trin: {
        slip: {
          start: () => { trinNu = 'slip'; tilCassini(); ventVink = 10; },
          get knapper() { return [{ id: 'slip', tekst: TEKST.slip, gør: slip, aktiv: () => fase === 'cassini' }]; },
          færdig: () => fase === 'ned',
          visMig: () => { slip(); rask = 2.5; },
        },
        disen: {
          start: () => {
            trinNu = 'disen';
            if (fase !== 'ned') tilNed(0);
            else if (nedtur.landet || nedtur.h < VENT_KM) tilNed(tidVed(5), false); // (tilbage fra trin 3)
            nedtur.sætGrænse(VENT_KM);
            nedtur.kontakt(true);
            sætKontakt(TEKST.kamera, true);
            turbo = 1;
            ventVink = 14;
            ctx.tiden('hurtig');
          },
          knapper: [],
          færdig: () => fase === 'ned' && nedtur.h <= 1.0,
          // "Vis mig": spoler ekstra hurtigt, så turen ned til 1 km tager ca. 4 sekunder
          visMig: () => {
            if (fase !== 'ned') tilNed(0, false);
            ctx.tiden('hurtig');
            turbo = Math.max(1, (tidVed(0.95) - nedtur.s) / (4 * SPOL.hurtig));
          },
        },
        landet: {
          start: () => {
            trinNu = 'landet';
            kanaler.vis(false);
            autoSten = 0;
            landTrykket = false;
            nedtur.landFart = 1;
            if (fase === 'ned' && nedtur.landet) {
              // (tilbage fra trin 4: Huygens står på jorden, og stenene kan måles igen)
              jordbillede.nulstil();
              tilLandet();
              ventVink = 0;
            } else {
              if (fase !== 'ned' || nedtur.h < VENT_KM - 1e-3) tilNed(tidVed(VENT_KM), false);
              nedtur.sætGrænse(VENT_KM);
              jordbillede.nulstil();
              ctx.tiden('spil');
              ventVink = 10;
            }
          },
          get knapper() { return [{ id: 'land', tekst: TEKST.land, gør: land, aktiv: () => !landStartet() }]; },
          færdig: () => jordbillede.målt.size === JORDEN_STEN,
          // "Vis mig": Huygens lander hurtigt, og bagefter måles stenene én ad gangen
          visMig: () => {
            if (!nedtur.landet) {
              land();
              turbo = Math.max(1, (NED_S - nedtur.s) / (1.6 * SPOL.spil));
              nedtur.landFart = 2;
              autoSten = -1; // (venter på landingen)
            } else autoSten = 0.3;
          },
        },
        tabt: {
          start: () => {
            trinNu = 'tabt';
            autoSten = 0;
            if (!(fase === 'ned' && nedtur.stille)) tilLandet();
            jordbillede.vis(true, { luk: false });
            kanaler.nulstil();
            kanaler.vis(true);
            ventVink = 10;
          },
          knapper: [],
          færdig: () => kanaler.færdig,
          visMig: () => { kanaler.tænd('B'); kanaler.tænd('A'); },
        },
      },
      slutTekst: () => LAND_MED_HUYGENS.slut,
      // Vejene videre (drejebogens afsnit 8 og 11): bogen om Christiaan Huygens, Titan ved Saturn, Leg frit og "Tag turen
      // igen", eller "Under isen", hvis den tur ikke er taget
      get veje() {
        return [
          { tekst: 'Læs om ham, der fandt Titan', primær: true, gør: () => gåTil('opdagelser:huygens') },
          // (den samme knap som under "Gå videre" i panelet, så skallen flyver til stedet i Saturns træ)
          { tekst: 'Se Titan ved Saturn', gør: () => {
            const knap = skærm.querySelector('.højre-panel [data-gaa="solsystem:saturn:titan"]');
            if (knap) knap.click(); else ctx.vælgFænomen('saturn');
          } },
          { tekst: 'Leg frit', her: true, gør: () => requestAnimationFrame(() => { if (aktiv) { centrerVindue(); tilLab = false; visFoto(nedtur.stille); } }) },
          fremgang.forløbTaget(UNDER_ISEN.id)
            ? { tekst: 'Tag turen igen', her: true, gør: () => requestAnimationFrame(() => { if (aktiv) { tilLab = false; startTur(); } }) }
            : { tekst: 'Under isen', gør: () => gåTil('solsystem:underisen') },
        ];
      },
      layout: () => { if (!kører() && !tilLab) return; if (fase === 'ned') kameraNed(); else if (fase === 'cassini') kameraVedCassini(); },
      slut: () => {
        tilLab = true; turbo = 1; ventVink = 0; trinNu = null; autoSten = 0;
        nedtur.landFart = 1;
        nedtur.sætGrænse(0);
        kanaler.vis(false);
        // (billedet fra jorden får sit ✕, når forløbet er væk)
        if (jordbillede.vist) requestAnimationFrame(() => { if (aktiv && jordbillede.vist) visFoto(true); });
      },
    };
    function startTur() {
      if (!aktiv) return;
      startForløb(LAND_MED_HUYGENS, FL_DEL);
    }
    if (tagVentForløb([LAND_MED_HUYGENS.id]) || starterSelv(LAND_MED_HUYGENS)) requestAnimationFrame(() => requestAnimationFrame(startTur));

    // Startbilledet (skallen stiller sit eget kamera efter lav, så det sættes i næste billede)
    tilCassini();
    requestAnimationFrame(() => { if (aktiv && fase === 'cassini') kameraVedCassini(); });

    const før = new THREE.Vector3();
    return {
      styring,
      hurtig: `ca. ${SPOL.hurtig} gange hurtigere end i virkeligheden`,
      tempo: (tilstand) => { hurtig = tilstand === 'hurtig'; },
      // Bladring mellem etaperne i laboratoriet (ikke i forløbet)
      trin: () => {
        if (kørerForløb()) return null;
        const nr = etape();
        return { nr, ialt: ETAPER.length, næste: ETAPER[nr + 1]?.knap ?? '', gå: gåEtape, forfra: () => gåEtape(0) };
      },
      opdater(dt) {
        visFalder(fase !== 'cassini' && !nedtur.landet);
        titan.sæt(SOL, dt);
        t += dt * rask;
        if (fase === 'slip') {
          // Huygens glider fri af Cassini (et lille skub) og drejer langsomt om sig selv
          const u = Math.min(1, t / SLIP_S);
          const e = 1 - (1 - u) ** 2;
          huygens.gruppe.position.copy(CASSINI).addScaledVector(SIDE_UD, VED_SIDEN).addScaledVector(fri, e);
          huygens.gruppe.rotateY(dt * rask * 1.4);
          if (u >= 1) { fase = 'rejse'; t = 0; skilt.textContent = TEKST.rejse; skilt.hidden = false; }
        } else if (fase === 'rejse') {
          if (t >= REJSE_S || ROLIG) tilInd();
        } else if (fase === 'ind') {
          // Fra 1.270 km til faldskærmen: hurtigt først, så bremser luften. Kameraet følger med.
          const u = Math.min(1, t / IND_S);
          const e = 1 - (1 - u) ** 2.2;
          før.copy(huygens.gruppe.position);
          hIndgang = START_KM - (START_KM - FALDSKÆRM_KM) * e;
          placerInd();
          const d = huygens.gruppe.position.clone().sub(før);
          verden.styring.target.add(d);
          verden.kamera.position.add(d);
          huygens.gruppe.rotateY(dt * 0.8);
          // Skæret foran varmeskjoldet: stærkest, mens Huygens bremser hårdest
          const g = Math.sin(Math.PI * THREE.MathUtils.clamp((u - 0.05) / 0.75, 0, 1));
          skær.visible = g > 0.02 && !ROLIG;
          skær.position.copy(huygens.gruppe.position).addScaledVector(v, 0.75);
          skær.scale.setScalar(0.4 + 2.2 * g);
          skær.material.opacity = g;
          if (u >= 1) { fase = 'toning'; t = 0; toning.classList.add('vis'); }
        } else if (fase === 'toning') {
          if (t >= TONING_S * 0.5 || ROLIG) tilNed(0);
        }
        // I faldskærm: tiden spoles (▶ 30 gange, ⏩ 150 gange hurtigere, "Vis mig" endnu hurtigere)
        const spol = fase === 'ned' ? dt * (hurtig ? SPOL.hurtig : SPOL.spil) * turbo : 0;
        nedtur.opdater(dt, spol);
        if (turbo > 1 && nedtur.h <= 0.95 && trinNu !== 'landet') turbo = 1;
        if (nedtur.landet && turbo > 1) turbo = 1;
        kanaler.opdater(dt);
        // "Vis mig" i trin 3: stenene måles én ad gangen, når billedet er fremme
        if (autoSten > 0 && jordbillede.vist && (autoSten -= dt) <= 0) {
          const næste = JORDEN_STEN_ID.find((id) => !jordbillede.målt.has(id));
          if (næste) { jordbillede.mål(næste); autoSten = 0.6; } else autoSten = 0;
        }

        // Underteksterne i laboratoriet (etaperne), og et vink i forløbet, hvis man venter
        if (!kørerForløb()) {
          const nr = etape();
          if (nr !== etapeVist) {
            etapeVist = nr;
            const e = ETAPER[nr];
            visFase(e.titel, e.tekst, [nr + 1, ETAPER.length]);
          }
        } else if (kører() && forløbVenter() && ventVink > 0 && (ventVink -= dt) <= 0) {
          const v = LAND_MED_HUYGENS.vink;
          if (trinNu === 'slip' && fase === 'cassini') forløbVink(v.slip);
          else if (trinNu === 'disen') forløbVink(v.kamera);
          else if (trinNu === 'landet' && !landStartet()) forløbVink(v.land);
          else if (trinNu === 'tabt') forløbVink(v.kanaler);
        }
      },
      stop() {
        aktiv = false;
        visFalder(false);
        if (kører()) stopForløb();
        verden.styring.minDistance = styringFør.min;
        verden.styring.maxDistance = styringFør.max;
        verden.styring.maxPolarAngle = styringFør.polar;
        jordbillede.stop();
        kanaler.stop();
        skilt.remove();
        toning.remove();
        nedtur.stop();
        rum.traverse((o) => { o.geometry?.dispose(); o.material?.map?.dispose(); o.material?.dispose?.(); });
      },
      test: {
        ...forløbTest(),
        start: startTur,
        falder: () => falderVist, // (sidefanerne, Indstillinger og 🔔 er skjult)
        scenen: () => fase, // ('cassini', 'slip', 'rejse', 'ind', 'toning' eller 'ned'. fase er forløbets)
        slip,
        tilNed: (km = FALDSKÆRM_KM) => tilNed(tidVed(km), false),
        tilCassini,
        etape,
        gåEtape,
        ned: () => nedtur.test(),
        skiftUr: () => nedtur.skiftUr(),
        hurtig: () => hurtig,
        turbo: () => turbo,
        rumVist: () => rum.visible,
        land,
        tilLandet,
        jorden: () => ({ vist: jordbillede.vist, målt: [...jordbillede.målt], luk: jordbillede.el.classList.contains('med-luk') }),
        målSten: (id) => jordbillede.mål(id),
        kanaler: () => kanaler.test(),
        tænd: (k) => kanaler.tænd(k),
        veje: () => FL_DEL.veje.map((v) => v.tekst),
        huygens: () => ({ vist: huygens.gruppe.visible && rum.visible, pos: huygens.gruppe.position.toArray(), hIndgang }),
        skær: () => skær.visible,
      },
    };
  },
};
