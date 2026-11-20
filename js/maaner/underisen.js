// "Under isen" i Solsystemet (spor Måner, M2-M3, docs/drejebog-maaner.md afsnit 2-6 og 9-11): Europa og Enceladus side
// om side i rigtig størrelse (1 enhed = 250 km), snittet gennem begge måner med lagene (js/maaner/snit.js), lupen ved
// Europa, magnetfeltet med kontakten "Hav" (js/maaner/magnetfelt.js), fontænerne på Enceladus i modlys
// (js/solsystem/fontaener.js, læst og brugt, ikke ændret), Cassini i en bue gennem sprøjtet og tavlen med de tre ting
// (js/maaner/tavle.js). Forløbet "Under isen" har fem trin (teksterne i js/data/forloeb/under-isen.js, tallene i
// js/data/maaner/underisen.js og tavlens kort i js/data/maaner/tavle.js).
//
// Trin 1 "snit": Træk på Europa (op og ned), knappen "Skær igennem" eller skyderen "Snit". Er snittet over halvvejs,
//   når man slipper, glider det selv resten (et rundt mål, stilguiden B5). Bagefter står lupen ved snittets kant.
// Trin 2 "felt": Kameraet trækker sig ud, Enceladus skjules, og feltlinjerne og Galileos måler vises. Kontakten "Hav"
//   står i linjen og i Indstillinger. Færdig, når man har set feltet både med og uden hav (mindst 2 s hver).
// Trin 3 "fontæner": Kameraet glider hen til Enceladus (Europa skjules). Man drejer kameraet rundt om månen, og når
//   Solen står bag den (inden for 30°, MODLYS_GRÆNSE), lyser fontænerne. Bagefter glider kameraet helt ind i modlyset,
//   og snittet åbner sig selv gennem Enceladus (isen er tyndere ved sydpolen). Enceladus er drejet DREJ_ENCELADUS om
//   sin akse, så snittet vender mod kameraet i modlyset.
// Trin 4 "tavle": Tavlen kommer frem (under scenen, til højre på brede skærme). "🛰️ Flyv med Cassini" (M4): Kameraet
//   sidder bag Cassini, der flyver gennem sprøjtet, og man styrer højden (js/maaner/flyvetur.js). Fire kort falder ud,
//   når målerne fyldes. Med ROLIG flyver Cassini i en bue set udefra. Man lægger kortene på tavlen, og så fylder Europas
//   søjle sig selv.
// Trin 5 "liv": Begge måner. Man trykker på rækken Liv på tavlen: "Ikke fundet. Ingen har endnu kunnet se efter."
// Laboratoriet: skyderen "Snit" (begge måner), kontakterne "Magnetfelt", "Hav", "Modlys" (Solen står bag Enceladus,
//   som ved Saturn) og "Navne", handlingerne "Europa", "Enceladus" og "Begge" i bjælken (jeres valg 20. november 2026),
//   et tryk på en måne flyver hen til den, tavlen kan foldes ind, og "🛰️ Flyv gennem fontænen" i bjælken (M4).
// Kameraet styres her (kameraTil): målet glider på 1,3 s, og afstanden regnes, så boksen passer i hullet mellem panelerne.

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
import { lavTavle } from './tavle.js';
import { lavFlyvetur } from './flyvetur.js';
import { UNDER_ISEN } from '../data/forloeb/under-isen.js';
import { KM_PR_ENHED, EUROPA, ENCELADUS, JORDENS_DYBESTE, LAG, LAG_ENCELADUS, lagGrænser, isBundSyd, TAL, SIDE } from '../data/maaner/underisen.js';
import { KORT, SELV, kortEfter } from '../data/maaner/tavle.js';
import { TEKST as FLYV } from '../data/maaner/flyvetur.js';

const RE = EUROPA.r / KM_PR_ENHED; // ca. 6,24
const RN = ENCELADUS.r / KM_PR_ENHED; // ca. 1,01
const EUROPA_X = -2;
const ENCELADUS_X = EUROPA_X + RE + 2 + RN; // 2 enheder (500 km) mellem dem
const SOL = new THREE.Vector3(-0.72, 0.28, 0.64).normalize(); // Solen fra venstre og lidt forfra
const RETNING = new THREE.Vector3(0, 0.1, 1).normalize(); // kameraet ser forfra, lidt oppefra
// Modlys: kameraet står på den anden side af Enceladus end Solen, lidt under ækvator, så sydpolen står ved kanten
const MODLYS = new THREE.Vector3(-SOL.x, -0.05, -SOL.z).normalize();
const MODLYS_GRÆNSE = Math.cos(THREE.MathUtils.degToRad(30)); // et rundt mål: inden for 30° af Solen
const DREJ_ENCELADUS = Math.atan2(MODLYS.x, MODLYS.z) + 0.55; // snittets forside (+z) vender skråt mod kameraet i modlyset (så lagene ses i 3D)
// Kameraets bokse: midten (x, y), den halve bredde og højde, der skal være i billedet (enheder), kameraets retning og
// den mindste afstand bagefter (minDistance)
const BEGGE = { x: (EUROPA_X - RE + ENCELADUS_X + RN) / 2, hb: 9.0, hh: 7.0 };
const EUROPA_BOKS = { x: EUROPA_X, hb: RE * 1.2, hh: RE * 1.12 };
const FELT_BOKS = { x: EUROPA_X, hb: RE * 2.5, hh: RE * 2.3 };
const ENC_BOKS = { x: ENCELADUS_X, y: -RN * 0.75, hb: RN * 2.4, hh: RN * 2.3, min: RN * 1.6 }; // med fontænerne
const ENC_MODLYS = { ...ENC_BOKS, retning: MODLYS };
const SYNSVINKEL = 40; // grader lodret (samme som i scene3d.js)
const GLID_S = 1.6; // sekunder for et helt snit, når det glider selv
const VIS_MIG_S = 2.6; // "Vis mig" skærer igennem på så lang tid
const FELT_MIN_S = 2; // trin 2: så længe skal feltet være set med og uden hav
const MODLYS_HOLD_S = 0.6; // trin 3: så længe skal modlyset holdes, før trinet er færdigt
const ÅBN_EFTER_S = 2.0; // trin 3: så længe efter modlyset åbner snittet sig selv gennem Enceladus
const CASSINI_S = 4.5; // trin 4: Cassinis bue
const SLIP_VED = [0.36, 0.44, 0.52, 0.6]; // trin 4: her på buen falder kortene ud (midt i sprøjtet)
const PUNKT_I_TUREN = 0.3; // fontænernes punkter er mindre under flyveturen (tæt på ville de fylde hele skærmen)
const KORT_STR = TEST_HURTIG ? '2k' : '4k';
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
    const { sætKontakt, forklaring, overlag } = ctx;
    const vindue = document.getElementById('solsystemVindue');
    const skærm = document.getElementById('solsystem');
    let aktiv = true;
    const segmenter = TEST_HURTIG ? 64 : LAV_KVALITET ? 96 : 128;

    // ---------- Europa med snittet og Enceladus (med fontænerne og sit eget snit) ----------
    const europa = lavSnitMåne(RE, { grænser: lagGrænser(), lys: 0.8, segmenter });
    europa.gruppe.position.x = EUROPA_X;
    europa.sætSynlig(0); // mørk, til kortet er hentet (tjekliste E: ingen nødløsning imens)
    gruppe.add(europa.gruppe);
    const enceladus = lavEnceladus(RN);
    enceladus.gruppe.position.x = ENCELADUS_X;
    enceladus.gruppe.rotation.y = DREJ_ENCELADUS;
    enceladus.gruppe.visible = false; // (til kortet er hentet)
    gruppe.add(enceladus.gruppe);
    // Snittet gennem Enceladus: sporets egen kugle (fontaener.js' shader har ingen klippeplaner). Den vises i stedet for
    // Enceladus' egen kugle, når snittet er åbent. Fontænerne bliver.
    const snitN = lavSnitMåne(RN, { grænser: lagGrænser(ENCELADUS), sydIs: isBundSyd(ENCELADUS), lys: 1.35, segmenter: TEST_HURTIG ? 48 : 96 });
    snitN.gruppe.position.x = ENCELADUS_X;
    snitN.gruppe.rotation.y = DREJ_ENCELADUS;
    snitN.gruppe.visible = false;
    gruppe.add(snitN.gruppe);

    const navne = [
      { s: skilt('Europa', '#cfe0ff', 0.9), y: RE + 0.8, x: EUROPA_X, måne: 'europa' }, // (over månerne: forklaringen står nederst)
      { s: skilt('Enceladus', '#cfe0ff', 0.9), y: RN + 0.8, x: ENCELADUS_X, måne: 'enceladus' },
    ];
    for (const n of navne) { n.s.position.set(n.x, n.y, 0); n.skala = n.s.scale.clone(); gruppe.add(n.s); }
    let navneTæt = null; // navnene er mindre, når kameraet er tæt på Enceladus

    const hentet = { europa: false, enceladus: false };
    let synlig = 0;
    hent(`europa-${KORT_STR}.jpg`, (t) => { if (!aktiv) return; europa.sætKort(t); hentet.europa = true; }, {
      farve: false, kanaler: 1, rundt: false, vendt: true, fejl: () => { hentet.europa = true; },
    });
    hent(`enceladus-${KORT_STR}.jpg`, (t) => { if (!aktiv) return; enceladus.sætKort(t); snitN.sætKort(t); hentet.enceladus = true; }, {
      farve: false, kanaler: 1, rundt: false, vendt: true, fejl: () => { hentet.enceladus = true; },
    });
    hent('enceladus-form.png', (t) => { if (aktiv && !enceladus.harForm) enceladus.sætForm(t.image, FORM_NET); }, { farve: false, rundt: false });

    // ---------- Cassini (trin 4): en lille sonde med parabol og magnetometerets stang, tegnet meget større end den var ----------
    const cassini = new THREE.Group();
    {
      const metal = new THREE.MeshStandardMaterial({ color: 0xe6e8ec, metalness: 0.3, roughness: 0.5 });
      const guld = new THREE.MeshStandardMaterial({ color: 0xc89a3a, metalness: 0.6, roughness: 0.4 });
      const s = RN * 0.12;
      const krop = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.55, s * 0.55, s * 2.2, 12), guld);
      const skål = new THREE.Mesh(new THREE.SphereGeometry(s * 1.3, 18, 8, 0, Math.PI * 2, 0, 0.75), metal);
      skål.position.y = s * 1.2;
      const stang = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.05, s * 0.05, s * 4.5, 6), metal);
      stang.rotation.z = Math.PI / 2;
      stang.position.set(s * 2.4, s * 0.9, 0);
      cassini.add(krop, skål, stang);
      const lys = new THREE.DirectionalLight(0xffffff, 1.8);
      lys.position.copy(SOL);
      cassini.add(lys);
    }
    cassini.visible = false;
    gruppe.add(cassini);
    let cassiniT = null; // 0-1 på buen, mens Cassini flyver, ellers null
    let cassiniSendt = false;
    const buePunkt = new THREE.Vector3(), højre = new THREE.Vector3(), forrige = new THREE.Vector3();
    // Buen går fra højre mod venstre, set i modlyset, gennem sprøjtet under sydpolen og lidt foran månen
    function bue(t, ud) {
      højre.crossVectors(new THREE.Vector3(0, 1, 0), MODLYS).normalize();
      const x = 2.7 * RN * (1 - 2 * t);
      const y = -RN * (1.25 + 0.9 * (1 - (2 * t - 1) ** 2));
      return ud.set(ENCELADUS_X, 0, 0).addScaledVector(højre, x).addScaledVector(MODLYS, RN * 0.35).setY(y);
    }

    // ---------- Lupen, forklaringen af lagene, magnetfeltet og tavlen ----------
    const lupe = lavLupe(vindue, europa, { ...EUROPA, dybeste: JORDENS_DYBESTE });
    const lagBoks = document.createElement('div');
    lagBoks.className = 'ui-lag';
    lagBoks.hidden = true;
    let lagVist = null; // hvilken måne forklaringen står for
    overlag().append(lagBoks);
    const felt = lavMagnetfelt(RE, overlag());
    felt.gruppe.position.x = EUROPA_X;
    gruppe.add(felt.gruppe);

    const tavle = lavTavle({
      vink: (t) => { if (kørerForløb()) forløbVink(t); },
      lagt: () => { if (SELV.every((k) => tavle.lagte.includes(k.id)) && !europaFyldt()) tavle.fyldEuropa(); },
      // "↺" i laboratoriet: de fire kort fra Cassini ligger i bunken igen, og Europas søjle er tom igen
      forfra: () => { nulstilTavle(); for (const k of SELV) tavle.slip(k.id); },
    });
    const europaFyldt = () => KORT.every((k) => k.måne !== 'europa' || tavle.lagte.includes(k.id));
    // Tavlen står under scenen i forløbet (et barn af skærmen, så den kan få sin plads i gitteret, style.css) og i
    // 3D-vinduet i laboratoriet, hvor den kan foldes ind
    function tavleTil(sted) {
      if (sted === 'forløb') { if (tavle.el.parentElement !== skærm) skærm.append(tavle.el); }
      else if (tavle.el.parentElement !== vindue) vindue.append(tavle.el);
    }
    tavle.el.hidden = true;

    // Flyveturen gennem fontænen (M4): kameraet bag Cassini, og fundene falder ud på tavlen
    const tur = lavFlyvetur({
      gruppe, cassini, midte: new THREE.Vector3(ENCELADUS_X, 0, 0), radius: RN, kmPrEnhed: KM_PR_ENHED, sol: SOL,
      vindue, lærred: verden.renderer.domElement,
      fund: (id) => {
        if (tavle.lagte.includes(id)) return; // (i laboratoriet ligger kortet der måske allerede)
        tavle.slip(id);
        if (autoLæg) tavle.læg(id);
      },
      færdig: () => { if (aktiv) kameraTil(ENC_MODLYS); ventVink = 15; },
      vink: (t) => { if (kørerForløb()) forløbVink(t); },
    });
    let fraTur = false; // turen er lige slut: tavlen kommer i laboratoriet, som man lagde den

    // ---------- Tilstanden ----------
    let snit = 0, snitE = 0; // snittet gennem Europa og gennem Enceladus (0-1)
    let glid = null, glidE = null; // { mål, fart } mens et snit glider selv
    let hav = true;
    let modlysKontakt = false; // laboratoriets kontakt "Modlys": Solen står bag Enceladus
    let fokus = 'begge'; // 'begge', 'europa' eller 'enceladus'
    let tidMed = 0, tidUden = 0; // trin 2: sekunder, feltet er set med og uden hav
    let trin = null; // forløbets trin-id, mens det kører
    let skyderVist = 0;
    let førsteGang = true; // trin 1 vises første gang med begge måner
    let ventEuropa = 0; // sekunder, til kameraet glider ind til Europa
    let modlysHold = 0, modlysNået = false, åbnOm = 0; // trin 3
    let ventVink = 0; // sekunder i trin 3 og 4, før et vink kommer
    let visMigTil = 0;
    const solE = new THREE.Vector3().copy(SOL); // Solen set fra Enceladus (flyttes af kontakten "Modlys")

    function sætSnit(s) {
      snit = THREE.MathUtils.clamp(s, 0, 1);
      europa.sætSnit(snit);
      const v = Math.round(snit * 100);
      if (v !== skyderVist && fokus !== 'enceladus') { skyderVist = v; snitSkyder.sæt?.(v); } // (kun når tallet ændrer sig)
    }
    function sætSnitE(s) {
      snitE = THREE.MathUtils.clamp(s, 0, 1);
      snitN.sætSnit(snitE);
      const v = Math.round(snitE * 100);
      if (v !== skyderVist && fokus === 'enceladus') { skyderVist = v; snitSkyder.sæt?.(v); }
    }
    function glidTil(mål, varighed = GLID_S) {
      if (ROLIG) { sætSnit(mål); glid = null; return; }
      glid = { mål, fart: 1 / varighed };
    }
    function glidETil(mål, varighed = GLID_S) {
      if (ROLIG) { sætSnitE(mål); glidE = null; return; }
      glidE = { mål, fart: 1 / varighed };
    }
    function sætHav(til) {
      hav = til;
      sætKontakt('Hav', til);
    }
    function visFelt(til) {
      felt.vis(til);
      sætKontakt('Magnetfelt', til);
    }
    function sætModlys(til) {
      modlysKontakt = til;
      sætKontakt('Modlys', til);
    }
    // Hvilken måne kameraet ser på. Europa skjules ved Enceladus (den ville ellers stå bag Enceladus i modlyset).
    function sætFokus(f) {
      tur.afbryd(); // (et nyt trin eller en anden måne stopper flyveturen)
      fokus = f;
      skyderVist = -1;
      sætSnit(snit);
      sætSnitE(snitE);
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
    const minFor = (b) => b.min ?? RE * 1.4;
    function kameraTil(b, straks = false) {
      boks = b;
      const k = verden.kamera, s = verden.styring;
      const d = afstandFor(b);
      const tilRetning = b.retning ?? RETNING;
      s.minDistance = Math.min(s.minDistance, minFor(b)); // (sættes helt, når flyvningen er færdig)
      if (straks || ROLIG) {
        flyvning = null;
        s.target.set(b.x, b.y ?? 0, 0);
        k.position.copy(s.target).addScaledVector(tilRetning, d);
        s.minDistance = minFor(b);
        verden.målAfstand = null;
        lupe.genplacer();
        return;
      }
      flyvning = {
        t: 0,
        fraMål: s.target.clone(), tilMål: new THREE.Vector3(b.x, b.y ?? 0, 0),
        fraRetning: k.position.clone().sub(s.target).normalize(), tilRetning,
        fraAfstand: k.position.distanceTo(s.target), tilAfstand: d,
      };
      verden.målAfstand = null;
    }
    const brugerDrejer = () => { flyvning = null; verden.styring.minDistance = minFor(boks); };
    verden.styring.addEventListener('start', brugerDrejer);
    const styringFør = { min: verden.styring.minDistance, max: verden.styring.maxDistance };
    verden.styring.minDistance = RE * 1.4;
    verden.styring.maxDistance = 120;

    // Vinklen mellem kameraets blik og Solen (cos): 1 er lige mod Solen (modlys)
    const blik = new THREE.Vector3();
    const modlysNu = () => blik.copy(verden.styring.target).sub(verden.kamera.position).normalize().dot(SOL);

    // Laboratoriets valg: Europa, Enceladus eller begge (handlingerne i bjælken og et tryk på en måne)
    function vælgMåne(f) {
      if (kørerForløb()) return;
      sætFokus(f);
      if (f !== 'europa' && felt.vist) visFelt(false);
      if (f === 'enceladus') kameraTil(ENC_MODLYS);
      else if (f === 'europa') kameraTil(felt.vist ? FELT_BOKS : EUROPA_BOKS);
      else kameraTil(BEGGE);
    }

    // ---------- Træk i Europa (snittet) og tryk på en måne ----------
    const lærred = verden.renderer.domElement;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const kugle = new THREE.Sphere(new THREE.Vector3(), RE);
    const kugleN = new THREE.Sphere(new THREE.Vector3(), RN * 1.3);
    const midt = new THREE.Vector3(), top = new THREE.Vector3();
    let træk = null;
    function stråle(h) {
      const c = lærred.getBoundingClientRect();
      ndc.set(((h.clientX - c.left) / c.width) * 2 - 1, -((h.clientY - c.top) / c.height) * 2 + 1);
      ray.setFromCamera(ndc, verden.kamera);
      return ray.ray;
    }
    function rammerEuropa(h) {
      if (fokus === 'enceladus') return false;
      europa.gruppe.getWorldPosition(kugle.center);
      return stråle(h).intersectsSphere(kugle);
    }
    function rammerEnceladus(h) {
      if (!enceladus.gruppe.visible && !snitN.gruppe.visible) return false;
      enceladus.gruppe.getWorldPosition(kugleN.center);
      return stråle(h).intersectsSphere(kugleN);
    }
    // Europas radius i skærmpixel (så et træk over hele månen er et helt snit)
    function radiusPx() {
      const c = lærred.getBoundingClientRect();
      europa.gruppe.getWorldPosition(midt).project(verden.kamera);
      top.copy(verden.kamera.up).multiplyScalar(RE).add(europa.gruppe.getWorldPosition(new THREE.Vector3())).project(verden.kamera);
      return Math.max(20, Math.abs(top.y - midt.y) * 0.5 * c.height);
    }
    const kanTrække = () => !felt.vist && (!kørerForløb() || trin === 'snit');
    let tryk = null; // hvor et tryk på lærredet startede (et tryk på en måne flyver hen til den)
    function ned(h) {
      tryk = { x: h.clientX, y: h.clientY };
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
    // Et tryk (uden træk) på en måne i laboratoriet flyver hen til den
    function klik(h) {
      if (!aktiv || kørerForløb() || !tryk || Math.hypot(h.clientX - tryk.x, h.clientY - tryk.y) > 6) return;
      if (fokus !== 'enceladus' && rammerEnceladus(h)) vælgMåne('enceladus');
      else if (fokus === 'begge' && rammerEuropa(h)) vælgMåne('europa');
    }
    lærred.addEventListener('pointerdown', ned, { capture: true });
    lærred.addEventListener('click', klik);
    addEventListener('pointermove', flyt);
    addEventListener('pointerup', op);
    addEventListener('pointercancel', op);

    // ---------- Styringen (Indstillinger og bjælken) ----------
    const snitSkyder = {
      skyder: true, navn: 'Snit', min: 0, max: 100, værdi: 0,
      vis: (v) => `${Math.round(v)} %`,
      // Skyderen skærer i den måne, man ser på (ved begge: i begge)
      ændring: (v) => {
        glid = glidE = null;
        if (fokus !== 'enceladus') sætSnit(v / 100);
        if (fokus !== 'europa') sætSnitE(v / 100);
      },
    };
    const iTur = () => Boolean(kørerForløb()); // (handlingerne er skjult under turen)
    const styring = [
      snitSkyder,
      { tekst: 'Magnetfelt', til: false, skift: (til) => { visFelt(til); if (til && fokus !== 'europa' && !kørerForløb()) { sætFokus('europa'); kameraTil(FELT_BOKS); } } },
      { tekst: 'Hav', til: true, skift: (til) => { hav = til; if (til && !felt.vist) styring[1].skift(true); } },
      { tekst: 'Modlys', til: false, skift: (til) => { modlysKontakt = til; if (til && fokus !== 'enceladus') vælgMåne('enceladus'); } },
      navneKnap((til) => { if (!til) for (const n of navne) n.s.visible = false; }),
      { handling: () => vælgMåne('europa'), tekst: 'Europa', skjul: iTur, deaktiv: () => fokus === 'europa' },
      { handling: () => vælgMåne('enceladus'), tekst: 'Enceladus', skjul: iTur, deaktiv: () => fokus === 'enceladus' },
      { handling: () => vælgMåne('begge'), tekst: 'Begge', skjul: iTur, deaktiv: () => fokus === 'begge' },
      { handling: () => flyvLab(), tekst: FLYV.lab, skjul: iTur, deaktiv: () => tur.aktiv },
    ];

    // ---------- Cassini og kortene (trin 4) ----------
    let autoLæg = false; // "Næste ›" før handlingen: kortene lægges selv, når de falder ud
    // Flyveturen (M4). Med ROLIG flyver Cassini i buen, set udefra (sendCassini).
    let tavleVæk = false; // tavlen er skjult under turen (på en lav scene, hvor den står under scenen, fx telefonen)
    function flyvMedCassini() {
      if (ROLIG) { sendCassini(); return; }
      if (cassiniSendt) return;
      cassiniSendt = true;
      flyvning = null;
      const t = tavle.el.getBoundingClientRect(), v = vindue.getBoundingClientRect();
      tavleVæk = t.top >= v.bottom - 2 && v.height < 420;
      tur.start();
      if (kørerForløb() && forløbVenter()) forløbRørt();
    }
    // Laboratoriet og vejen i "Det så du": turen igen, uden forløbet
    function flyvLab() {
      if (kørerForløb() || !aktiv) return;
      visFelt(false);
      sætFokus('enceladus');
      cassiniT = null;
      if (ROLIG) { kameraTil(ENC_MODLYS); cassiniSendt = false; sendCassini(); return; }
      flyvning = null;
      tur.start({ lab: true });
    }
    function sendCassini() {
      if (cassiniSendt) return;
      cassiniSendt = true;
      cassiniT = 0;
      if (ROLIG) { cassiniT = null; for (const k of SELV) tavle.slip(k.id); }
      if (kørerForløb() && forløbVenter()) forløbRørt();
    }
    function nulstilTavle() {
      tur.afbryd();
      tavle.sæt(kortEfter('fontæner'));
      cassiniSendt = false;
      cassiniT = null;
      cassini.visible = false;
      autoLæg = false;
    }

    // ---------- Forløbet "Under isen" (trin 1-5) ----------
    const kører = () => kørerForløb() === UNDER_ISEN.id;
    let tilLab = false;
    const FL_DEL = {
      trin: {
        snit: {
          start: () => {
            trin = 'snit';
            sætFokus('europa');
            visFelt(false);
            tavle.sæt(kortEfter('felt'));
            sætSnit(0);
            sætSnitE(0);
            glid = glidE = null;
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
            sætFokus('europa');
            sætSnit(1);
            sætSnitE(0);
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
        fontæner: {
          start: () => {
            trin = 'fontæner';
            visFelt(false);
            sætModlys(false);
            sætFokus('enceladus');
            sætSnit(1);
            sætSnitE(0);
            glidE = null;
            modlysHold = 0;
            modlysNået = false;
            åbnOm = 0;
            ventVink = 9;
            tavle.sæt(kortEfter('felt'));
            kameraTil(ENC_BOKS); // forfra: Solen står bag kameraet, og fontænerne er svage
          },
          knapper: [],
          færdig: () => modlysNået,
          visMig: () => kameraTil(ENC_MODLYS),
        },
        tavle: {
          start: () => {
            trin = 'tavle';
            visFelt(false);
            sætModlys(false);
            sætFokus('enceladus');
            sætSnitE(1);
            glidE = null;
            nulstilTavle();
            ventVink = 12;
            tavleTil('forløb');
            tavle.el.hidden = false;
            tavle.foldInd(false);
            kameraTil(ENC_MODLYS);
          },
          get knapper() {
            return [{ id: 'cassini', tekst: FLYV.knap, gør: flyvMedCassini, aktiv: () => !cassiniSendt }];
          },
          vis: ['.ui-tavle'],
          færdig: () => SELV.every((k) => tavle.lagte.includes(k.id)) && europaFyldt() && !tavle.fylder,
          // "Vis mig": Cassini flyver selv helt ned, og kortene lægges, når de falder ud
          visMig: () => { autoLæg = true; flyvMedCassini(); if (tur.aktiv) tur.autopilot(); for (const id of tavle.bunke) tavle.læg(id); },
        },
        liv: {
          start: () => {
            trin = 'liv';
            visFelt(false);
            sætModlys(false);
            sætFokus('begge');
            sætSnit(1);
            sætSnitE(1);
            cassini.visible = false;
            cassiniT = null;
            tavle.sæt(KORT.map((k) => k.id));
            tavleTil('forløb');
            tavle.el.hidden = false;
            tavle.foldInd(false);
            kameraTil(BEGGE);
          },
          knapper: [],
          vis: ['.ui-tavle'],
          færdig: () => tavle.livVist,
          visMig: () => tavle.visLiv(),
        },
      },
      veje: [
        { tekst: 'Flyv gennem fontænen ›', her: true, gør: () => requestAnimationFrame(() => { if (aktiv) { centrerVindue(); tilLab = false; flyvLab(); } }) },
        // (den samme knap som under "Gå videre" i panelet, så skallen flyver til stedet i Saturns træ)
        { tekst: 'Se fontænerne ved Saturn', gør: () => {
          const knap = skærm.querySelector('.højre-panel [data-gaa="solsystem:saturn:enceladus"]');
          if (knap) knap.click(); else ctx.vælgFænomen('saturn');
        } },
        { tekst: 'Leg frit', her: true, gør: () => efterForløb() },
        { tekst: 'Tag turen igen', her: true, gør: () => requestAnimationFrame(() => { if (aktiv) { tilLab = false; startTur(); } }) },
      ],
      // Scenen har fået en ny størrelse: Flyver kameraet, rettes kun afstanden, ellers springer det på plads
      layout: () => {
        if ((!kører() && !tilLab) || tur.aktiv) return; // (under flyveturen styrer turen kameraet)
        if (flyvning) flyvning.tilAfstand = afstandFor(boks);
        else kameraTil(boks, true);
      },
      slut: () => { trin = null; tilLab = true; ventVink = 0; fraTur = true; },
    };
    function efterForløb() {
      requestAnimationFrame(() => {
        if (!aktiv) return;
        centrerVindue();
        visFelt(false);
        sætFokus('begge');
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

    // Startbilledet: begge måner (skallen stiller sit eget kamera efter lav, så det sættes i næste billede).
    // I laboratoriet ligger alle kortene på tavlen, og den er foldet ind.
    requestAnimationFrame(() => {
      if (!aktiv || kører()) return;
      kameraTil(BEGGE, true);
    });

    // Kameraets flyvning og modlyset (trin 3) kører også under pause (som skallens egne flyvninger)
    function altid(dt) {
      const f = flyvning;
      if (f) {
        f.t = ROLIG ? 1 : Math.min(1, f.t + dt / 1.3);
        const e = f.t * f.t * (3 - 2 * f.t);
        const s = verden.styring;
        mål.lerpVectors(f.fraMål, f.tilMål, e);
        s.target.copy(mål);
        retning.copy(f.fraRetning).lerp(f.tilRetning, e).normalize();
        verden.kamera.position.copy(mål).addScaledVector(retning, f.fraAfstand + (f.tilAfstand - f.fraAfstand) * e);
        if (f.t >= 1) { flyvning = null; s.minDistance = minFor(boks); lupe.genplacer(); }
      }
      // Trin 3: Står Solen bag Enceladus (inden for 30°), lyser fontænerne. Holdes det et øjeblik, er trinet færdigt.
      if (trin === 'fontæner' && !modlysNået) {
        if (modlysNu() > MODLYS_GRÆNSE) modlysHold += dt; else modlysHold = 0;
        if (modlysHold >= MODLYS_HOLD_S || (ROLIG && modlysHold > 0)) {
          modlysNået = true;
          åbnOm = ÅBN_EFTER_S;
        }
      }
    }

    let sidsteForklaring = '';
    const lagHTML = (lag) => lag.map((l) => `<span class="ui-lag-r"><i style="background:${l.farve}"></i><b>${l.navn}</b> ${l.mærke}</span>`).join('');
    return {
      styring,
      opdater(dt, tid) {
        // Solen for Enceladus: med kontakten "Modlys" står den næsten lige bag månen, set fra kameraet (som ved Saturn)
        if (modlysKontakt && !kørerForløb()) {
          enceladus.gruppe.getWorldPosition(midt);
          solE.copy(midt).sub(verden.kamera.position).normalize().addScaledVector(verden.kamera.up, 0.22).normalize();
        } else solE.copy(SOL);
        tur.opdater(dt); // (flyver Cassini, står Solen forude som uden "Modlys", og fontænernes punkter gøres mindre)
        if (tur.aktiv) solE.copy(SOL);
        europa.sæt(SOL, tid);
        enceladus.sæt(solE, tid);
        if (tur.aktiv && !ROLIG) enceladus.fontæner.material.uniforms.uStr.value *= PUNKT_I_TUREN;
        snitN.sæt(solE, tid);
        // Kortet toner ind, når det er hentet
        if (hentet.europa && synlig < 1) { synlig = Math.min(1, synlig + dt / 0.6); europa.sætSynlig(ROLIG ? 1 : synlig); }
        if (ventEuropa > 0 && (ventEuropa -= dt) <= 0 && trin === 'snit') kameraTil(EUROPA_BOKS);
        for (const [g, sæt, hent] of [[glid, sætSnit, () => snit], [glidE, sætSnitE, () => snitE]]) {
          if (!g) continue;
          const d = g.mål - hent(), skridt = g.fart * dt;
          if (Math.abs(d) <= skridt) { sæt(g.mål); if (g === glid) glid = null; else glidE = null; } else sæt(hent() + Math.sign(d) * skridt);
        }
        // Hvad der er fremme
        const europaVist = fokus !== 'enceladus';
        europa.gruppe.visible = europaVist;
        const encVist = hentet.enceladus && !felt.vist;
        enceladus.gruppe.visible = encVist;
        enceladus.måne.visible = snitE <= 0 || tur.aktiv; // (under flyveturen er månen hel)
        snitN.gruppe.visible = encVist && snitE > 0 && !tur.aktiv;
        felt.opdater(dt, tid, hav);
        if (trin === 'felt' && forløbFase() !== 'så') {
          if (hav) tidMed += dt; else tidUden += dt;
          if (visMigTil > 0 && (visMigTil -= dt) <= 0) sætHav(true);
          if (hav && tidMed > 7 && tidUden === 0) forløbVink(UNDER_ISEN.vink.hav);
        }
        // Trin 3: efter modlyset glider kameraet helt ind i det, og snittet åbner sig selv gennem Enceladus
        if (trin === 'fontæner') {
          if (åbnOm > 0 && (åbnOm -= dt) <= 0) { kameraTil(ENC_MODLYS); glidETil(1, 2.2); }
          if (!modlysNået && forløbVenter() && (ventVink -= dt) <= 0) { ventVink = 1e9; forløbVink(UNDER_ISEN.vink.modlys); }
        }
        // Trin 4: Cassini i buen, og kortene falder ud midt i sprøjtet
        if (cassiniT !== null) {
          const før = cassiniT;
          cassiniT = Math.min(1, cassiniT + dt / CASSINI_S);
          cassini.visible = true;
          bue(før, forrige);
          bue(cassiniT, buePunkt);
          cassini.position.copy(buePunkt);
          cassini.lookAt(forrige.lerp(buePunkt, 2)); // (næsen fremad)
          SELV.forEach((k, i) => {
            if (før < SLIP_VED[i] && cassiniT >= SLIP_VED[i]) { tavle.slip(k.id); if (autoLæg) tavle.læg(k.id); }
          });
          if (cassiniT >= 1) { cassiniT = null; cassini.visible = false; }
        }
        // Trin 4: et vink, hvis Cassini ikke er sendt, eller hvis kortene ligger i bunken efter turen
        if (trin === 'tavle' && forløbVenter() && !tur.aktiv && cassiniT === null && (!cassiniSendt || tavle.bunke.length) && (ventVink -= dt) <= 0) {
          ventVink = 1e9;
          forløbVink(cassiniSendt ? UNDER_ISEN.vink.tavle : UNDER_ISEN.vink.flyv);
        }
        tavle.opdater(dt);
        // Tavlen: i turen kun i trin 4-5 (under scenen), i laboratoriet foldet ind øverst til venstre i 3D-vinduet med
        // alle kortene (efter turen, som man lagde dem)
        if (!kørerForløb() && tavle.el.parentElement !== vindue) {
          tavleTil('lab');
          if (!fraTur || tavle.lagte.length < KORT.length) tavle.sæt(KORT.map((k) => k.id), { liv: fraTur && tavle.livVist });
          tavle.foldInd(true);
          fraTur = false;
        }
        if (tavleVæk && !tur.aktiv) tavleVæk = false;
        tavle.el.hidden = kørerForløb() ? !(trin === 'tavle' || trin === 'liv') || tavleVæk : false;

        // Lupen ved Europa, forklaringen af lagene for den måne, man ser på
        lupe.vis(snit >= 0.999 && !felt.vist && fokus === 'europa'); // (ved begge måner ville den stå i vejen)
        lupe.opdater();
        const lagMåne = fokus === 'enceladus' ? 'enceladus' : 'europa';
        if (lagMåne !== lagVist) { lagVist = lagMåne; lagBoks.innerHTML = lagHTML(lagMåne === 'enceladus' ? LAG_ENCELADUS : LAG); }
        lagBoks.hidden = (lagMåne === 'enceladus' ? snitE : snit) < 0.3 || felt.vist || trin === 'tavle' || trin === 'liv' || tur.aktiv;
        for (const n of navne) n.s.visible = navneTil() && !felt.vist && !tur.aktiv && (n.måne === 'europa' ? europaVist : encVist);
        if (navneTæt !== (fokus === 'enceladus')) {
          navneTæt = fokus === 'enceladus';
          const k = navneTæt ? 0.4 : 1;
          for (const n of navne) { n.s.scale.copy(n.skala).multiplyScalar(k); n.s.position.y = n.måne === 'enceladus' && navneTæt ? RN + 0.35 : n.y; }
        }
        let tekst = '';
        if (tur.forklaring) tekst = `<p>${tur.forklaring}</p>`;
        else if (felt.vist) tekst = `<p>Jupiters magnetfelt vipper. ${hav ? 'Med havet bøjer feltlinjerne uden om Europa, og Galileo måler et ekstra felt.' : 'Uden hav går feltlinjerne lige igennem, og Galileo måler intet ekstra felt.'}</p>`;
        else if (fokus === 'enceladus') tekst = modlysNu() > MODLYS_GRÆNSE || modlysKontakt ? '<p>Solen står bag Enceladus. De små iskorn i fontænerne spreder lyset fremad, så de lyser.</p>' : '<p>Drej rundt om Enceladus, til Solen står bag sydpolen. Så lyser fontænerne.</p>';
        else if (snit >= 1) tekst = '<p>Snittet er helt igennem. Træk lupen hen over havet.</p>';
        if (tekst !== sidsteForklaring) { sidsteForklaring = tekst; forklaring(tekst); }
      },
      altid,
      stop() {
        aktiv = false;
        if (kører()) stopForløb();
        tur.stop(); // (før kameraets grænser sættes tilbage)
        lærred.removeEventListener('pointerdown', ned, { capture: true });
        lærred.removeEventListener('click', klik);
        removeEventListener('pointermove', flyt);
        removeEventListener('pointerup', op);
        removeEventListener('pointercancel', op);
        verden.styring.removeEventListener('start', brugerDrejer);
        verden.styring.enabled = true;
        verden.styring.minDistance = styringFør.min;
        verden.styring.maxDistance = styringFør.max;
        lupe.stop();
        lagBoks.remove();
        tavle.stop();
        felt.stop();
        europa.stop();
        snitN.stop();
        cassini.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
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
        lagTekst: () => lagBoks.textContent,
        hentet: () => ({ ...hentet }),
        enceladusVist: () => enceladus.gruppe.visible,
        europaVist: () => europa.gruppe.visible,
        // Europas midte og radius på skærmen (CSS-pixel), til et træk i testen
        europaSkærm: () => {
          const c = lærred.getBoundingClientRect();
          const p = europa.gruppe.getWorldPosition(new THREE.Vector3()).project(verden.kamera);
          return { x: c.left + (p.x * 0.5 + 0.5) * c.width, y: c.top + (-p.y * 0.5 + 0.5) * c.height, r: radiusPx() };
        },
        enceladusSkærm: () => {
          const c = lærred.getBoundingClientRect();
          const p = enceladus.gruppe.getWorldPosition(new THREE.Vector3()).project(verden.kamera);
          return { x: c.left + (p.x * 0.5 + 0.5) * c.width, y: c.top + (-p.y * 0.5 + 0.5) * c.height };
        },
        kameraFrem: () => altid(10),
        flyver: () => Boolean(flyvning),
        boks: () => (boks === BEGGE ? 'begge' : boks === EUROPA_BOKS ? 'europa' : boks === FELT_BOKS ? 'felt' : boks === ENC_MODLYS ? 'modlys' : 'enceladus'),
        fokus: () => fokus,
        vælgMåne,
        // cos til vinklen mellem kameraets blik og Solen (1 = modlys), og om trin 3 har nået modlyset
        modlys: () => ({ cos: modlysNu(), nået: modlysNået, grænse: MODLYS_GRÆNSE }),
        // Kameraet drejes rundt om målet, så det ser i retningen [x, y, z] (et "træk" i testen)
        drejKamera: (r) => { flyvning = null; const s = verden.styring; const d = verden.kamera.position.distanceTo(s.target); verden.kamera.position.copy(s.target).addScaledVector(new THREE.Vector3(...r).normalize(), -d); s.update(); },
        snitE: () => snitE,
        snitNVist: () => snitN.gruppe.visible,
        cassini: () => ({ sendt: cassiniSendt, t: cassiniT, vist: cassini.visible }),
        sendCassini,
        flyvMedCassini,
        flyvLab,
        flyvetur: tur.test,
        sætHøjde: tur.sætHøjde,
        tavle: () => ({ lagte: tavle.lagte, bunke: tavle.bunke, farver: tavle.farver(), liv: tavle.livVist, fylder: tavle.fylder, vist: !tavle.el.hidden && tavle.el.isConnected, foldet: tavle.foldet, iForløb: tavle.el.parentElement === skærm }),
        læg: (id) => tavle.læg(id),
        lægForkert: (id, række) => tavle.lægForkert(id, række),
        solE: () => solE.toArray(),
      },
    };
  },
};
