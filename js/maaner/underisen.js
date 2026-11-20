// "Under isen" i Solsystemet (spor Måner, M2, docs/drejebog-maaner.md afsnit 2-5 og 10): Europa og Enceladus side om
// side i rigtig størrelse (1 enhed = 250 km), snittet gennem Europa med lagene og lupen (js/maaner/snit.js),
// magnetfeltet med kontakten "Hav" (js/maaner/magnetfelt.js) og forløbet "Under isen" (teksterne i
// js/data/forloeb/under-isen.js, tallene i js/data/maaner/underisen.js). M2 har forløbets trin 1-2. M3 bygger
// fontænerne og snittet gennem Enceladus (trin 3), tavlen (trin 4-5) og laboratoriets valg Europa / Enceladus / Begge.
//
// Trin 1 "snit": Træk på Europa (op og ned), knappen "Skær igennem" eller skyderen "Snit". Er snittet over halvvejs,
//   når man slipper, glider det selv resten (et rundt mål, stilguiden B5). Bagefter står lupen ved snittets kant.
// Trin 2 "felt": Kameraet trækker sig ud, Enceladus skjules, og feltlinjerne og Galileos måler vises. Kontakten "Hav"
//   står i linjen og i Indstillinger. Færdig, når man har set feltet både med og uden hav (mindst 2 s hver).
// Kameraet styres her (kameraTil): målet glider på 1,3 s, og afstanden sættes med verden.målAfstand (scene3d.js), så
//   boksen passer i hullet mellem panelerne. Kun ét træk ad gangen: Et træk på Europa slår kameraets styring fra.

import * as THREE from 'three';
import { verden, LAV_KVALITET, TEST_HURTIG, ROLIG, centrerVindue } from '../scene3d.js';
import { hent } from '../solsystem/hent.js';
import { lavEnceladus } from '../solsystem/fontaener.js';
import { navneTil, navneKnap } from '../solsystem/navne.js';
import { skilt } from '../kosmos/faelles.js';
import { startForløb, stopForløb, starterSelv, kørerForløb, forløbVenter, forløbRørt, forløbVink, forløbTest, forløbFase } from '../forloeb.js';
import { tagVentForløb } from '../gaa.js';
import { lavSnitMåne, lavLupe } from './snit.js';
import { lavMagnetfelt } from './magnetfelt.js';
import { UNDER_ISEN } from '../data/forloeb/under-isen.js';
import { KM_PR_ENHED, EUROPA, ENCELADUS, JORDENS_DYBESTE, LAG, lagGrænser, TAL, SIDE } from '../data/maaner/underisen.js';

const RE = EUROPA.r / KM_PR_ENHED; // ca. 6,24
const RN = ENCELADUS.r / KM_PR_ENHED; // ca. 1,01
const EUROPA_X = -2;
const ENCELADUS_X = EUROPA_X + RE + 2 + RN; // 2 enheder (500 km) mellem dem
const SOL = new THREE.Vector3(-0.72, 0.28, 0.64).normalize(); // Solen fra venstre og lidt forfra
const RETNING = new THREE.Vector3(0, 0.1, 1).normalize(); // kameraet ser forfra, lidt oppefra
// Kameraets bokse: midten (x) og den halve bredde og højde, der skal være i billedet (enheder)
const BEGGE = { x: (EUROPA_X - RE + ENCELADUS_X + RN) / 2, hb: 9.0, hh: 7.0 };
const EUROPA_BOKS = { x: EUROPA_X, hb: RE * 1.2, hh: RE * 1.12 };
const FELT_BOKS = { x: EUROPA_X, hb: RE * 2.5, hh: RE * 2.3 };
const SYNSVINKEL = 40; // grader lodret (samme som i scene3d.js)
const GLID_S = 1.6; // sekunder for et helt snit, når det glider selv
const VIS_MIG_S = 2.6; // "Vis mig" skærer igennem på så lang tid
const FELT_MIN_S = 2; // trin 2: så længe skal feltet være set med og uden hav
const KORT = TEST_HURTIG ? '2k' : '4k';
const FORM_NET = TEST_HURTIG ? [128, 64] : LAV_KVALITET ? [256, 128] : [512, 256];

export default {
  id: 'underisen',
  navn: 'Under isen',
  ikon: '🧊',
  tåger: false,
  undertitel: 'Havene under isen på Europa og Enceladus',
  kamera: { retning: [0, 0.1, 1], radius: 9, mål: [BEGGE.x, 0, 0], drej: false },
  tal: TAL,
  side: SIDE,

  lav(gruppe, ctx) {
    const { fase, opdaterKnapper, sætKontakt, forklaring, overlag } = ctx;
    const vindue = document.getElementById('solsystemVindue');
    let aktiv = true;

    // ---------- Europa med snittet og Enceladus ----------
    const europa = lavSnitMåne(RE, { grænser: lagGrænser(), lys: 0.8, segmenter: TEST_HURTIG ? 64 : LAV_KVALITET ? 96 : 128 });
    europa.gruppe.position.x = EUROPA_X;
    europa.sætSynlig(0); // mørk, til kortet er hentet (tjekliste E: ingen nødløsning imens)
    gruppe.add(europa.gruppe);
    const enceladus = lavEnceladus(RN);
    enceladus.gruppe.position.x = ENCELADUS_X;
    enceladus.gruppe.visible = false; // (til kortet er hentet)
    gruppe.add(enceladus.gruppe);

    const navne = [
      { s: skilt('Europa', '#cfe0ff', 0.9), y: RE + 0.8, x: EUROPA_X }, // (over månerne: forklaringen af lagene står nederst)
      { s: skilt('Enceladus', '#cfe0ff', 0.9), y: RN + 0.8, x: ENCELADUS_X },
    ];
    for (const n of navne) { n.s.position.set(n.x, n.y, 0); gruppe.add(n.s); }

    const hentet = { europa: false, enceladus: false };
    let synlig = 0;
    hent(`europa-${KORT}.jpg`, (t) => { if (!aktiv) return; europa.sætKort(t); hentet.europa = true; }, {
      farve: false, kanaler: 1, rundt: false, vendt: true, fejl: () => { hentet.europa = true; },
    });
    hent(`enceladus-${KORT}.jpg`, (t) => { if (!aktiv) return; enceladus.sætKort(t); hentet.enceladus = true; }, {
      farve: false, kanaler: 1, rundt: false, vendt: true, fejl: () => { hentet.enceladus = true; },
    });
    hent('enceladus-form.png', (t) => { if (aktiv && !enceladus.harForm) enceladus.sætForm(t.image, FORM_NET); }, { farve: false, rundt: false });

    // ---------- Lupen, forklaringen af lagene og magnetfeltet ----------
    const lupe = lavLupe(vindue, europa, { ...EUROPA, dybeste: JORDENS_DYBESTE });
    const lagBoks = document.createElement('div');
    lagBoks.className = 'ui-lag';
    lagBoks.hidden = true;
    lagBoks.innerHTML = LAG.map((l) => `<span class="ui-lag-r"><i style="background:${l.farve}"></i><b>${l.navn}</b> ${l.mærke}</span>`).join('');
    overlag().append(lagBoks);
    const felt = lavMagnetfelt(RE, overlag());
    felt.gruppe.position.x = EUROPA_X;
    gruppe.add(felt.gruppe);

    // ---------- Tilstanden ----------
    let snit = 0;
    let glid = null; // { mål, fart } mens snittet glider selv
    let hav = true;
    let tidMed = 0, tidUden = 0; // trin 2: sekunder, feltet er set med og uden hav
    let trin = null; // forløbets trin-id, mens det kører
    let skyderVist = 0;
    let førsteGang = true; // trin 1 vises første gang med begge måner
    let ventEuropa = 0; // sekunder, til kameraet glider ind til Europa

    function sætSnit(s) {
      snit = THREE.MathUtils.clamp(s, 0, 1);
      europa.sætSnit(snit);
      const v = Math.round(snit * 100);
      if (v !== skyderVist) { skyderVist = v; snitSkyder.sæt?.(v); } // (skyderen skrives kun om, når tallet ændrer sig)
    }
    function glidTil(mål, varighed = GLID_S) {
      if (ROLIG) { sætSnit(mål); glid = null; return; }
      glid = { mål, fart: 1 / varighed };
    }
    function sætHav(til) {
      hav = til;
      sætKontakt('Hav', til);
    }
    function visFelt(til) {
      felt.vis(til);
      enceladus.gruppe.visible = !til && hentet.enceladus;
      sætKontakt('Magnetfelt', til);
    }

    // ---------- Kameraet ----------
    let boks = BEGGE;
    let flyvning = null;
    const mål = new THREE.Vector3(), retning = new THREE.Vector3();
    function afstandFor(b) {
      const { hul } = verden;
      const t = Math.tan(THREE.MathUtils.degToRad(SYNSVINKEL / 2));
      const H = innerHeight;
      return Math.max(b.hb / ((t * hul.width) / H), b.hh / ((t * hul.height) / H)) * 1.06;
    }
    function kameraTil(b, straks = false) {
      boks = b;
      const k = verden.kamera, s = verden.styring;
      const d = afstandFor(b);
      if (straks || ROLIG) {
        flyvning = null;
        s.target.set(b.x, 0, 0);
        k.position.copy(s.target).addScaledVector(RETNING, d);
        verden.målAfstand = null;
        lupe.genplacer();
        return;
      }
      flyvning = {
        t: 0,
        fraMål: s.target.clone(), tilMål: new THREE.Vector3(b.x, 0, 0),
        fraRetning: k.position.clone().sub(s.target).normalize(),
        fraAfstand: k.position.distanceTo(s.target), tilAfstand: d,
      };
      verden.målAfstand = null;
    }
    const brugerDrejer = () => { flyvning = null; };
    verden.styring.addEventListener('start', brugerDrejer);
    const styringFør = { min: verden.styring.minDistance, max: verden.styring.maxDistance };
    verden.styring.minDistance = RE * 1.4;
    verden.styring.maxDistance = 120;

    // ---------- Træk i Europa (snittet) ----------
    const lærred = verden.renderer.domElement;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const kugle = new THREE.Sphere(new THREE.Vector3(), RE);
    const midt = new THREE.Vector3(), top = new THREE.Vector3();
    let træk = null;
    function rammerEuropa(h) {
      const c = lærred.getBoundingClientRect();
      ndc.set(((h.clientX - c.left) / c.width) * 2 - 1, -((h.clientY - c.top) / c.height) * 2 + 1);
      ray.setFromCamera(ndc, verden.kamera);
      europa.gruppe.getWorldPosition(kugle.center);
      return ray.ray.intersectsSphere(kugle);
    }
    // Europas radius i skærmpixel (så et træk over hele månen er et helt snit)
    function radiusPx() {
      const c = lærred.getBoundingClientRect();
      europa.gruppe.getWorldPosition(midt).project(verden.kamera);
      top.copy(verden.kamera.up).multiplyScalar(RE).add(europa.gruppe.getWorldPosition(new THREE.Vector3())).project(verden.kamera);
      return Math.max(20, Math.abs(top.y - midt.y) * 0.5 * c.height);
    }
    const kanTrække = () => !felt.vist && (!kørerForløb() || trin === 'snit');
    function ned(h) {
      if (!aktiv || træk || !kanTrække() || h.button > 0 || !rammerEuropa(h)) return;
      h.stopPropagation();
      træk = { id: h.pointerId, y: h.clientY, snit, px: radiusPx() };
      glid = null;
      verden.styring.enabled = false;
      if (kørerForløb() && forløbVenter()) forløbRørt();
      ventEuropa = 0;
    }
    function flyt(h) {
      if (!træk || h.pointerId !== træk.id) return;
      sætSnit(træk.snit + (h.clientY - træk.y) / (2 * træk.px));
    }
    function op(h) {
      if (!træk || h.pointerId !== træk.id) return;
      træk = null;
      verden.styring.enabled = true;
      // Et rundt mål: over halvvejs glider snittet selv resten
      if (snit > 0.5 && snit < 1) glidTil(1);
      else if (snit > 0.03 && snit <= 0.5 && trin === 'snit') forløbVink(UNDER_ISEN.vink.snit);
    }
    lærred.addEventListener('pointerdown', ned, { capture: true });
    addEventListener('pointermove', flyt);
    addEventListener('pointerup', op);
    addEventListener('pointercancel', op);

    // ---------- Styringen (Indstillinger og bjælken) ----------
    const snitSkyder = {
      skyder: true, navn: 'Snit', min: 0, max: 100, værdi: 0,
      vis: (v) => `${Math.round(v)} %`,
      ændring: (v) => { glid = null; sætSnit(v / 100); },
    };
    const styring = [
      snitSkyder,
      { tekst: 'Magnetfelt', til: false, skift: (til) => visFelt(til) },
      { tekst: 'Hav', til: true, skift: (til) => { hav = til; if (til && !felt.vist) visFelt(true); } },
      navneKnap((til) => { if (!til) for (const n of navne) n.s.visible = false; }),
    ];

    // ---------- Forløbet "Under isen" (trin 1-2) ----------
    const kører = () => kørerForløb() === UNDER_ISEN.id;
    let tilLab = false;
    const FL_DEL = {
      trin: {
        snit: {
          start: () => {
            trin = 'snit';
            visFelt(false);
            sætSnit(0);
            glid = null;
            // Billedet først (A6): Første gang ses begge måner ca. 2 s, før kameraet glider ind til Europa
            if (førsteGang && !ROLIG) { ventEuropa = 2.2; kameraTil(BEGGE); } else kameraTil(EUROPA_BOKS);
            førsteGang = false;
          },
          knapper: [{ id: 'skær', tekst: '✂️ Skær igennem', gør: () => glidTil(1, VIS_MIG_S), aktiv: () => snit < 1 && !glid }],
          færdig: () => snit >= 1,
          visMig: () => glidTil(1, VIS_MIG_S),
        },
        felt: {
          start: () => {
            trin = 'felt';
            sætSnit(1);
            sætHav(true);
            tidMed = tidUden = 0;
            visFelt(true);
            kameraTil(FELT_BOKS);
          },
          get knapper() {
            return [{ id: 'hav', tekst: '🌊 Hav', gør: () => sætHav(!hav), valgt: () => hav }];
          },
          færdig: () => tidMed >= FELT_MIN_S && tidUden >= FELT_MIN_S,
          // "Vis mig": havet slås fra, og efter et stykke tid til igen
          visMig: () => { sætHav(false); visMigTil = FELT_MIN_S + 0.4; },
        },
      },
      veje: [{ tekst: 'Leg frit', her: true, gør: () => efterForløb() }],
      layout: () => { if (kører() || tilLab) kameraTil(boks, true); },
      slut: () => { trin = null; tilLab = true; },
    };
    let visMigTil = 0;
    function efterForløb() {
      requestAnimationFrame(() => {
        if (!aktiv) return;
        centrerVindue();
        visFelt(false);
        kameraTil(BEGGE);
        tilLab = false;
      });
    }
    function startTur() {
      if (!aktiv) return;
      startForløb(UNDER_ISEN, FL_DEL);
    }
    // Første gang man åbner fænomenet, fra "Din fremgang", turen i listen eller ?forloeb=under-isen
    if (tagVentForløb([UNDER_ISEN.id]) || starterSelv(UNDER_ISEN)) requestAnimationFrame(() => requestAnimationFrame(startTur));

    // Startbilledet: begge måner (skallen stiller sit eget kamera efter lav, så det sættes i næste billede)
    requestAnimationFrame(() => { if (aktiv && !kører()) kameraTil(BEGGE, true); });

    // Kameraets flyvning kører også under pause (som skallens egne flyvninger)
    function kørFlyvning(dt) {
      const f = flyvning;
      if (!f) return;
      f.t = ROLIG ? 1 : Math.min(1, f.t + dt / 1.3);
      const e = f.t * f.t * (3 - 2 * f.t);
      const s = verden.styring;
      mål.lerpVectors(f.fraMål, f.tilMål, e);
      s.target.copy(mål);
      retning.copy(f.fraRetning).lerp(RETNING, e).normalize();
      verden.kamera.position.copy(mål).addScaledVector(retning, f.fraAfstand + (f.tilAfstand - f.fraAfstand) * e);
      if (f.t >= 1) { flyvning = null; lupe.genplacer(); }
    }

    let sidsteForklaring = '';
    return {
      styring,
      opdater(dt, tid) {
        europa.sæt(SOL, tid);
        enceladus.sæt(SOL, tid);
        // Kortet toner ind, når det er hentet
        if (hentet.europa && synlig < 1) { synlig = Math.min(1, synlig + dt / 0.6); europa.sætSynlig(ROLIG ? 1 : synlig); }
        if (hentet.enceladus && !felt.vist && !enceladus.gruppe.visible) enceladus.gruppe.visible = true;
        if (ventEuropa > 0 && (ventEuropa -= dt) <= 0 && trin === 'snit') kameraTil(EUROPA_BOKS);
        if (glid) {
          const d = glid.mål - snit, skridt = glid.fart * dt;
          if (Math.abs(d) <= skridt) { sætSnit(glid.mål); glid = null; } else sætSnit(snit + Math.sign(d) * skridt);
        }
        felt.opdater(dt, tid, hav);
        if (trin === 'felt' && forløbFase() !== 'så') {
          if (hav) tidMed += dt; else tidUden += dt;
          if (visMigTil > 0 && (visMigTil -= dt) <= 0) sætHav(true);
          if (hav && tidMed > 7 && tidUden === 0) forløbVink(UNDER_ISEN.vink.hav);
        }
        lupe.vis(snit >= 0.999 && !felt.vist);
        lupe.opdater();
        lagBoks.hidden = snit < 0.3 || felt.vist;
        for (const n of navne) n.s.visible = navneTil() && !felt.vist && (n.x === EUROPA_X || enceladus.gruppe.visible);
        const tekst = felt.vist
          ? `<p>Jupiters magnetfelt vipper. ${hav ? 'Med havet bøjer feltlinjerne uden om Europa, og Galileo måler et ekstra felt.' : 'Uden hav går feltlinjerne lige igennem, og Galileo måler intet ekstra felt.'}</p>`
          : snit >= 1 ? '<p>Snittet er helt igennem. Træk lupen hen over havet.</p>' : '';
        if (tekst !== sidsteForklaring) { sidsteForklaring = tekst; forklaring(tekst); }
      },
      // Kameraets flyvning kører også under pause (som skallens egne flyvninger)
      altid: kørFlyvning,
      stop() {
        aktiv = false;
        if (kører()) stopForløb();
        lærred.removeEventListener('pointerdown', ned, { capture: true });
        removeEventListener('pointermove', flyt);
        removeEventListener('pointerup', op);
        removeEventListener('pointercancel', op);
        verden.styring.removeEventListener('start', brugerDrejer);
        verden.styring.enabled = true;
        verden.styring.minDistance = styringFør.min;
        verden.styring.maxDistance = styringFør.max;
        lupe.stop();
        lagBoks.remove();
        felt.stop();
        europa.stop();
      },
      test: {
        ...forløbTest(),
        start: startTur,
        snit: () => snit,
        sætSnit: (s) => { glid = null; sætSnit(s); },
        glider: () => Boolean(glid),
        hav: () => hav,
        sætHav,
        felt: () => ({ vist: felt.vist, ...felt.målt() }),
        visFelt,
        linjePunkt: felt.linjePunkt,
        lupe: () => ({ vist: lupe.vist, dybde: lupe.dybde, ...lupe.plads() }),
        flytLupe: lupe.flytTil,
        lagVist: () => !lagBoks.hidden,
        hentet: () => ({ ...hentet }),
        enceladusVist: () => enceladus.gruppe.visible,
        // Europas midte og radius på skærmen (CSS-pixel), til et træk i testen
        europaSkærm: () => {
          const c = lærred.getBoundingClientRect();
          const p = europa.gruppe.getWorldPosition(new THREE.Vector3()).project(verden.kamera);
          return { x: c.left + (p.x * 0.5 + 0.5) * c.width, y: c.top + (-p.y * 0.5 + 0.5) * c.height, r: radiusPx() };
        },
        kameraFrem: () => kørFlyvning(10),
        flyver: () => Boolean(flyvning),
        boks: () => (boks === BEGGE ? 'begge' : boks === EUROPA_BOKS ? 'europa' : 'felt'),
      },
    };
  },
};
