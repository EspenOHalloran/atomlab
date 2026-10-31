// Prototype til Solsystemet (trin 1b i docs/plan-solsystemet.md): Saturn med ringene og de seks store måner i den
// rigtige størrelse og afstand, med en guidet tur (flyby). Står i Solsystemet efter Mars (se js/solsystem.js).
// Tal fra docs/fakta-solsystemet.md. Grafikken ligger i js/solsystem/, så Solsystemet kan genbruge den.
//
// Hele systemet er én gruppe (1 enhed = 10.000 km), som rejsen (js/solsystem/rejse.js) skalerer og flytter, så det,
// vi kigger på, altid står i midten. Saturns akse peger lidt væk fra Solen, så ringene og månernes sydpoler er belyst
// (som omkring 2004, da Cassini kom frem).

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG, passerTil } from '../scene3d.js';
import { skilt, glød } from './faelles.js';
import { ringTekstur, lavRinge, RING_IND, RING_UD } from '../solsystem/ringe.js';
import { lavGasplanet } from '../solsystem/planet.js';
import { lavEnceladus } from '../solsystem/fontaener.js';
import { lavTitan } from '../solsystem/atmosfaere.js';
import { lavIsmåne } from '../solsystem/maane.js';
import { lavRejse } from '../solsystem/rejse.js';
import { lavFlyby } from '../solsystem/flyby.js';
import { navneTil, navneKnap } from '../solsystem/navne.js';
import { SIDE, SIDER } from '../data/sider/saturn.js';

const SATURN_R = 60268; // km ved ækvator
const SATURN_POL = 54364; // km ved polerne
const HÆLDNING = THREE.MathUtils.degToRad(26.73);
const S = 10000; // km pr. enhed i systemet
const GRAD = Math.PI / 180;

// Saturns seks store måner: afstand fra Saturns centrum og radius i km og omløbstid i døgn (NASA/JPL).
// lys: hvor lyst kortet tegnes, så månerne har den rigtige lysstyrke i forhold til hinanden (Enceladus er den lyseste).
// tur: hvor månen står på turen og hvorfra kameraet kigger (se stopVed). kort: underteksten (på turen og ved et besøg).
const MÅNER = [
  {
    id: 'mimas', navn: 'Mimas', afstand: 185539, r: 198, døgn: 0.942, farve: [0.97, 0.97, 0.97], lys: 1.11,
    kort: 'Kun 396 km bred. Krateret Herschel er ca. 140 km bredt, cirka en tredjedel af hele månen.',
    tur: { længde: -112, side: 45, højde: -8 }, // Herschel ligger ved 112° vest
  },
  {
    id: 'enceladus', navn: 'Enceladus', afstand: 238037, r: 252, døgn: 1.37, farve: [1, 1, 1],
    kort: 'Fra fire sprækker ved sydpolen sprøjter fontæner af vanddamp og iskorn ud i rummet. Under isen er der et hav.',
    tur: { bane: -15, retning: 0, højde: -22 },
    forskyd: -0.55, // kameraet kigger lidt under midten, så fontænerne er med
    pad: 1.9,
  },
  {
    id: 'tethys', navn: 'Tethys', afstand: 294619, r: 531, døgn: 1.888, farve: [0.96, 0.98, 1], lys: 1.36,
    kort: 'Næsten ren vandis. Krateret Odysseus er 445 km bredt, ca. to femtedele af hele månen.',
    tur: { længde: -129, side: 45, højde: 18 }, // Odysseus ligger ved 33° nord og 129° vest
  },
  {
    id: 'dione', navn: 'Dione', afstand: 377396, r: 561, døgn: 2.737, farve: [1, 1, 1], lys: 1.1,
    kort: 'De lyse striber er klipper af is, hvor skorpen er revnet. Nogle er flere hundrede meter høje.',
    tur: { længde: 75, side: -45, højde: -8 }, // klipperne ligger omkring 75° øst
  },
  {
    id: 'rhea', navn: 'Rhea', afstand: 527108, r: 764, døgn: 4.518, farve: [1, 0.98, 0.95], lys: 1.23,
    kort: 'Saturns næststørste måne, ca. 1.530 km bred. Den er mest is og fuld af gamle kratere.',
    tur: { længde: 64, side: -45, højde: -8 },
  },
  {
    id: 'titan', navn: 'Titan', afstand: 1221870, r: 2575, døgn: 15.945, farve: [0.9, 0.62, 0.3],
    kort: 'Saturns største måne, større end planeten Merkur. Den orange dis skjuler søer af flydende metan og ethan.',
    tur: { bane: 81, retning: 98, højde: -8 }, // lidt fra siden, så Saturn ses ved siden af Titan
    pad: 2,
  },
];

// Billederne (se billeder/solsystem/KILDER.md): pc, tablet og telefon henter -4k.jpg, tests -2k.jpg.
// Pc henter -8k.jpg af de måner, hvor originalen er skarp nok (MÅNER_8K), hvis grafikkortet kan klare det.
// De bliver i grafikkortet, så det går hurtigt at åbne prototypen igen.
const STØRRELSE = TEST_HURTIG ? '2k' : '4k';
const MÅNER_8K = new Set(['enceladus', 'tethys', 'dione', 'rhea']);
const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const henter = new THREE.TextureLoader();
const lager = new Map();
// farve: billedet er et farvefoto (sRGB). Månernes kort er målinger i gråtoner og bruges, som de er,
// med kun én kanal i grafikkortet (fylder en fjerdedel).
// Billedet afkodes, før det bruges (image.decode() sker uden for hovedtråden), så det ikke hakker, når det lægges i
// grafikkortet. fejl kaldes, hvis billedet ikke kan hentes.
function hent(navn, færdig, farve = true, fejl) {
  let b = lager.get(navn);
  if (!b) {
    b = { tekstur: null, fejlet: false, venter: [], fejlVenter: [] };
    lager.set(navn, b);
    henter.load(new URL(navn, MAPPE).href, (t) => {
      t.colorSpace = farve ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      if (!farve) t.format = THREE.RedFormat;
      (t.image.decode ? t.image.decode() : Promise.resolve()).catch(() => {}).then(() => {
        b.tekstur = t;
        for (const f of b.venter) f(t);
        b.venter.length = 0;
      });
    }, undefined, () => { // mangler billedet, bruges det tegnede
      b.fejlet = true;
      for (const f of b.fejlVenter) f();
      b.fejlVenter.length = 0;
    });
  }
  if (b.tekstur) færdig(b.tekstur);
  else if (!b.fejlet) b.venter.push(færdig);
  if (fejl) {
    if (b.fejlet) fejl();
    else if (!b.tekstur) b.fejlVenter.push(fejl);
  }
}
const FORHÅND_TID = 8000; // ms: så længe venter "Start flyby" højst på månernes kort

// Flybyen: et stop ved hvert sted. fokus 'saturn', 'ringe' eller en måne.
const TUR = [
  { fokus: 'saturn', titel: 'Saturn og de store måner', afstand: 380, retning: 20, højde: -38,
    tekst: 'Vi flyver ind til Saturn, hen over ringene og videre ud forbi de seks store måner.' },
  { fokus: 'saturn', titel: 'Saturn', passer: 15, retning: 35, højde: -20,
    tekst: 'En kæmpe kugle af gas, mest brint og helium. Ca. 9½ Jorder kan ligge på række hen over den.' },
  { fokus: 'ringe', titel: 'Hen over ringene', knap: 'ringene', afstand: 6, højde: -30, side: -35,
    tekst: 'Milliarder af isklumper, fra sandkorn til klumper på størrelse med et hus. Mange steder er ringene kun ca. 10 m tykke.' },
  ...MÅNER.map((m) => ({ fokus: m.id, titel: m.navn, tekst: m.kort })),
];
const RING_FRA = 100000; // km: kameraet glider ud over ringene fra B-ringen til uden for A-ringen
const RING_TIL = 136000;
const RING_TID = 24; // sekunder
const RING_VINKEL = 40; // hvor på ringene (grader fra Solens retning)

// Træet i listen til venstre (js/faenomenskaerm.js): ringene og de seks store måner. "Måner" er selv et sted
// (oversigten med banerne).
const TRÆ = {
  rod: 'saturn',
  grupper: [
    { navn: 'Steder', punkter: [{ id: 'ringe', navn: 'Ringene', undertitel: 'Milliarder af isklumper', ikon: '💫' }] },
    { navn: 'Måner', id: 'maaner', titel: 'Månerne', undertitel: 'De seks store måner i deres baner', punkter: MÅNER.map((m) => ({ id: m.id, navn: m.navn })) },
  ],
};

const VISNINGER = {
  saturn: {
    navn: 'Saturn', afstandFra: 15, retning: 35, højde: -20,
  },
  maaner: {
    navn: 'Månerne', afstand: 380, retning: 20, højde: -38,
  },
};

export default {
  id: 'saturn',
  navn: 'Saturn',
  ikon: '🪐',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Ringene og de store måner',
  træ: TRÆ,
  citat: 'huygensSaturn',
  kamera: { retning: [0.2, -0.32, 1], radius: 15 },
  tal: [
    ['Saturns bredde', 'ca. 120.500 km'],
    ['Tæthed', 'lettere end vand (i snit)'],
    ['Ringenes tykkelse', 'mange steder ca. 10 m'],
    ['Kendte måner', 'over 280 (2026)'],
  ],
  side: SIDE, // teksten i højre panel (js/data/sider/saturn.js)
  sider: SIDER,

  lav(gruppe, { opdaterKnapper, forklaring, fase, verden }) {
    const ring = ringTekstur();
    const { kamera } = verden;
    const orbit = verden.styring; // kameraets styring med mus og fingre
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, fjern: kamera.far };
    orbit.minDistance = 0.001; // rejsen holder selv afstanden (i systemets enheder)
    orbit.maxDistance = 1e5;
    kamera.near = 0.02; // tæt på en lille måne
    kamera.far = 20000; // månerne langt væk forsvinder ikke
    kamera.updateProjectionMatrix();
    let modlys = false;
    let ir = false;
    const sol = new THREE.Vector3(1, 0.05, 0.55).normalize(); // Solens retning (lyset kommer herfra)
    const solNu = new THREE.Vector3();

    // ---------- Saturn med ringene ----------
    const system = new THREE.Group();
    const saturnG = new THREE.Group();
    saturnG.rotation.z = HÆLDNING; // nordpolen hælder 26,7° væk fra Solen: sommer på den sydlige halvkugle
    saturnG.updateMatrix();
    const planet = lavGasplanet({ skala: S, radius: SATURN_R, polRadius: SATURN_POL, ringTekstur: ring, ringInd: RING_IND, ringUd: RING_UD });
    const ringe = lavRinge({ skala: S, tekstur: ring, planetRadius: SATURN_R, flad: SATURN_POL / SATURN_R });
    saturnG.add(planet.mesh, ringe.mesh);
    system.add(saturnG);
    gruppe.add(system);
    // Solens retning i ringenes plan (vinklen i banen, hvor månerne står med Solen lige bag sig)
    const solLokal = sol.clone().applyQuaternion(saturnG.quaternion.clone().invert());
    const solVinkel = Math.atan2(-solLokal.z, solLokal.x) / GRAD;

    // ---------- Månerne: en bane, kloden og et navn. De kredser i ringenes plan. ----------
    const måner = MÅNER.map((m, i) => {
      const bane = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(Array.from({ length: 360 }, (_, j) => new THREE.Vector3(Math.cos(j / 360 * Math.PI * 2), 0, Math.sin(j / 360 * Math.PI * 2)).multiplyScalar(m.afstand / S))),
        new THREE.LineBasicMaterial({ color: 0x8aa6d8, transparent: true, opacity: 0.22, depthWrite: false }),
      );
      const r = m.r / S;
      let klode;
      if (m.id === 'enceladus') klode = lavEnceladus(r);
      else if (m.id === 'titan') klode = lavTitan(r, S);
      else klode = lavIsmåne(r, { farve: m.farve, lys: m.lys });
      const plads = new THREE.Group(); // stedet i banen
      const krop = new THREE.Group(); // drejes, så samme side vender mod Saturn, og gøres større langt væk
      krop.add(klode.gruppe);
      plads.add(krop);
      const etiket = skilt(m.navn, '#cfe0ff', 1);
      saturnG.add(bane, plads, etiket);
      return { ...m, r, klode, plads, krop, etiket, bane, vinkel: i * 1.7, hentet: false };
    });
    const måneMed = (id) => måner.find((m) => m.id === id);
    function sætVinkel(m, grader) {
      m.vinkel = grader * GRAD;
      m.plads.position.set(Math.cos(m.vinkel), 0, -Math.sin(m.vinkel)).multiplyScalar(m.afstand / S);
      m.krop.rotation.y = m.vinkel + Math.PI; // længdegrad 0° vender mod Saturn
    }
    for (const m of måner) sætVinkel(m, m.vinkel / GRAD);
    const kan8k = verden.renderer.capabilities.maxTextureSize >= 8192;
    const måneStørrelse = (id) => (!LAV_KVALITET && !TEST_HURTIG && kan8k && MÅNER_8K.has(id) ? '8k' : STØRRELSE);
    // klar kaldes, når kortet er sat på månen (eller ikke kunne hentes). forhånd: kortet lægges i grafikkortet med det
    // samme, så det ikke sker midt i en flyvning.
    function hentKort(m, { forhånd = false, klar } = {}) {
      const navn = `${m.id}-${måneStørrelse(m.id)}.jpg`;
      if (m.hentet && !klar) return;
      m.hentet = true;
      hent(navn, (t) => {
        m.klode.sætKort(t);
        if (forhånd && aktiv) verden.renderer.initTexture(t);
        klar?.();
      }, false, klar);
    }

    // Solen: en lille, skarp prik langt væk i den retning, lyset kommer fra (fra Saturn ser den ca. 9½ gange mindre ud end fra Jorden)
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.012 : 0.009);
    const solGlød = glød(0xffe2b0, 0.09, 0.55);
    for (const s of [solKerne, solGlød]) {
      s.material.sizeAttenuation = false;
      s.renderOrder = -1;
      gruppe.add(s);
    }

    // De rigtige billeder (kommer lidt efter, indtil da ses det tegnede)
    // Når de er hentet, hentes månernes kort på forhånd, én ad gangen, til flybyen. Første stop viser alle seks måner.
    // Før gav det et hak, når flybyen startede: Alle kortene (ca. 23 MB på pc) blev hentet og lagt i grafikkortet
    // midt i den første flyvning. Indtil kortene er klar, er "Start flyby" grå (højst FORHÅND_TID).
    let aktiv = true;
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
    let egneMangler = 2;
    // (queueMicrotask: Er kortene allerede i lager, kommer svaret med det samme, før resten af lav() er kørt)
    const egetKort = () => { if (--egneMangler === 0) queueMicrotask(hentMåner); };
    hent(`saturn-${STØRRELSE}.jpg`, (t) => { planet.sætKort(t); egetKort(); }, true, egetKort);
    hent('saturn-ringe.png', (t) => { ringe.sætFarve(t); egetKort(); }, true, egetKort);

    // ---------- Kameraets rejse ----------
    const rejse = lavRejse({ system, verden });
    rejse.grænser(SATURN_R / S * 1.25, 450);
    const nul = new THREE.Vector3();
    const hjælp = new THREE.Vector3();
    const hjælp2 = new THREE.Vector3();
    // Et punkt i ringenes plan (km fra centrum, vinkel i grader) i systemets enheder
    const iRingplan = (km, grader, ud = new THREE.Vector3()) => ud.set(Math.cos(grader * GRAD), 0, -Math.sin(grader * GRAD)).multiplyScalar(km / S).applyMatrix4(saturnG.matrix);
    // En retning ud fra vinkel i ringenes plan og højde over planet (grader), i verden
    const retningFra = (vinkel, højde) => new THREE.Vector3(Math.cos(højde * GRAD) * Math.cos(vinkel * GRAD), Math.sin(højde * GRAD), -Math.cos(højde * GRAD) * Math.sin(vinkel * GRAD)).applyQuaternion(saturnG.quaternion);
    const fokusPå = (m) => () => hjælp.set(0, (m.forskyd ?? 0) * m.r, 0).add(m.plads.position).applyMatrix4(saturnG.matrix);
    // Afstanden, så en kugle med denne radius passer i 3D-billedet (mellem panelerne)
    function passer(radius) {
      passerTil(10);
      const f = (verden.målAfstand ?? 40) / 10;
      verden.målAfstand = null;
      return radius * f;
    }
    let ringKm = RING_FRA; // hvor kameraet er over ringene (flyttes under stoppet)
    const ringPunkt = new THREE.Vector3();
    const fokusRinge = () => iRingplan(ringKm, solVinkel + RING_VINKEL, ringPunkt);

    let visning = 'saturn';
    let baner = true; // månerne kredser (kun i oversigten)

    function flyvTilSaturn(v, færdig) {
      rejse.flyv({
        fokus: () => nul,
        afstand: v.afstand ?? passer(v.afstandFra ?? v.passer),
        retning: retningFra(solVinkel + v.retning, v.højde),
        min: SATURN_R / S * 1.25,
        max: 450,
        færdig,
      });
    }
    function flyvTilMåne(m, { retning, færdig } = {}) {
      hentKort(m);
      rejse.flyv({
        fokus: fokusPå(m),
        afstand: passer(m.r * (m.pad ?? 1.08)),
        retning: retning ?? retningFra(solVinkel + 40, m.id === 'enceladus' ? -22 : -12),
        min: m.r * 1.15,
        max: 450,
        færdig,
      });
    }

    // ---------- Frit: vælg Saturn, oversigten eller en måne ----------
    function vælg(v) {
      afslutTur();
      fase(null);
      visning = v;
      baner = false;
      flyvTilSaturn(VISNINGER[v], () => { baner = true; });
      forklaring('');
      lavKnapper();
    }
    function besøg(m) {
      afslutTur();
      fase(m.navn, m.kort);
      visning = m.id;
      baner = false;
      flyvTilMåne(m);
      forklaring('');
      lavKnapper();
    }

    // Gå til et sted fra træet i listen: Saturn, oversigten med månerne, ringene (som på flybyen) eller en måne
    function gåTil(id) {
      if (id === visning) return;
      if (VISNINGER[id]) return vælg(id);
      const m = måneMed(id);
      if (m) return besøg(m);
      if (id !== 'ringe') return;
      afslutTur();
      baner = false;
      const stop = TUR.find((t) => t.fokus === 'ringe');
      flyvTilStop(stop, TUR.indexOf(stop));
      fase(stop.titel, stop.tekst);
      forklaring('');
      lavKnapper();
    }

    // ---------- Flybyen (js/solsystem/flyby.js) ----------
    function startTur() {
      for (const m of måner) hentKort(m);
      // Månerne stilles op, så de kan besøges efter hinanden med Solen fra siden
      for (const m of måner) {
        const t = m.tur;
        sætVinkel(m, t.bane != null ? solVinkel + t.bane : solVinkel + t.side - 180 - t.længde);
      }
      baner = false;
      flyby.start();
    }
    function flyvTilStop(stop, trin) {
      visning = stop.fokus === 'saturn' ? (trin === 0 ? 'maaner' : 'saturn') : stop.fokus;
      if (stop.fokus === 'saturn') flyvTilSaturn(stop);
      else if (stop.fokus === 'ringe') {
        ringKm = RING_FRA;
        rejse.flyv({
          fokus: fokusRinge,
          afstand: stop.afstand,
          retning: retningFra(solVinkel + RING_VINKEL + stop.side, stop.højde),
          min: 0.05,
          max: 450,
        });
      } else {
        const m = måneMed(stop.fokus);
        const t = m.tur;
        const vinkel = t.retning != null ? solVinkel + t.retning : solVinkel + t.side;
        flyvTilMåne(m, { retning: retningFra(vinkel, t.højde) });
      }
    }
    const flyby = lavFlyby({
      stop: TUR, fase, forklaring, flyvTil: flyvTilStop, skift: () => lavKnapper(),
      slut: '<p><b>Turen er slut.</b> Drej selv rundt, tryk på en måne for at besøge den, eller vælg Saturn i listen.</p>',
    });
    const afslutTur = () => flyby.afslut();

    // ---------- Tryk på en måne (eller dens navn) for at besøge den ----------
    const lærred = verden.renderer.domElement;
    const stråle = new THREE.Raycaster();
    const peg = new THREE.Vector2();
    const skala = new THREE.Vector3();
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
        m.krop.getWorldPosition(hjælp2);
        const afstand = stråle.ray.distanceToPoint(hjælp2);
        const grænse = Math.max(m.r * m.krop.getWorldScale(skala).x * 2.2, hjælp2.distanceTo(kamera.position) * 0.03);
        if (afstand < grænse && stråle.ray.direction.dot(hjælp.copy(hjælp2).sub(kamera.position)) > 0 && (!bedst || afstand < bedst.afstand)) bedst = { m, afstand };
      }
      if (bedst) besøg(bedst.m);
    };
    lærred.addEventListener('pointerdown', vedNed);
    lærred.addEventListener('pointerup', vedOp);

    const styring = [];
    function lavKnapper() {
      styring.length = 0; // flybyen står i træet og bjælken (tur og trin nedenfor)
      styring.push({ tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } });
      // Uden navne kan man stadig trykke på selve månerne
      styring.push(navneKnap((til) => { if (!til) for (const m of måner) m.etiket.visible = false; }));
      if (visning === 'titan') styring.push({ tekst: 'Under disen (infrarødt)', til: ir, skift: (til) => { ir = til; måneMed('titan').klode.sætIR(til); } });
      opdaterKnapper();
    }
    lavKnapper();

    // ---------- Hvert billede: kameraet, systemets skala, lys og skygger ----------
    let tid = 0;
    const op = new THREE.Vector3(0, 1, 0);
    const kamPos = new THREE.Vector3();
    function hvertBillede(dt) {
      rejse.opdater(dt);
      const k = rejse.skala;
      // I modlys står Solen næsten lige bag det, vi kigger på, set fra kameraet
      if (modlys) {
        kamPos.copy(kamera.position).normalize();
        solNu.copy(kamPos).multiplyScalar(-1).addScaledVector(op, 0.22).normalize();
      } else solNu.copy(sol);
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solNu, 600);
      // Banerne ses kun, når kameraet er et stykke væk (tæt på en måne ville de skære tværs gennem billedet)
      const baneLys = 0.22 * THREE.MathUtils.smoothstep(rejse.afstand, 5, 15);
      for (const m of måner) {
        m.bane.material.opacity = baneLys;
        m.bane.visible = baneLys > 0.005;
        // Langt væk tegnes månen større, så den kan ses, og navnet står over den
        m.plads.getWorldPosition(hjælp);
        const afstand = hjælp.distanceTo(kamera.position);
        const rVerden = m.r * k;
        const større = Math.max(1, (afstand * 0.0045) / rVerden);
        m.krop.scale.setScalar(større);
        const str = (afstand * 0.018) / k;
        const vinkel = rVerden / afstand; // hvor stor månen ser ud
        m.etiket.visible = navneTil() && vinkel < 0.03;
        m.etiket.scale.set((m.etiket.scale.x / m.etiket.scale.y) * str, str, 1);
        m.etiket.position.copy(m.plads.position).add(hjælp.set(0, m.r * større + str * 0.8, 0));
        m.klode.sæt(solNu, m.id === 'titan' ? dt : tid);
      }
      const { midt, akse } = planet.sæt(solNu, tid);
      ringe.sæt(solNu, midt, akse);
    }
    verden.opdateringer.add(hvertBillede);

    return {
      styring,
      gåTil, // træet i listen (js/faenomenskaerm.js)
      sted: () => visning,
      // Flybyen: øverst i træet og i bjælken i 3D-billedet
      tur: { navn: 'Flyby', stop: TUR.length, klar: () => flybyKlar, kører: () => flyby.kører, start: startTur },
      trin: () => flyby.bjælke(),
      opdater(dt, t) {
        tid = t;
        planet.mesh.rotation.y = t * 0.08;
        // Ringpunktet glider udad, mens man læser om ringene (ikke med "reducer bevægelse")
        if (visning === 'ringe' && !rejse.flyver && !ROLIG) ringKm = Math.min(RING_TIL, ringKm + ((RING_TIL - RING_FRA) / RING_TID) * dt);
        // Månerne kredser kun i oversigten (meget hurtigere end i virkeligheden, men i det rigtige forhold)
        if (baner && !rejse.flyver) for (const m of måner) sætVinkel(m, (m.vinkel + (dt * 0.069) / m.døgn) / GRAD);
      },
      stop() {
        aktiv = false;
        clearTimeout(forhåndUr);
        ring.dispose();
        verden.opdateringer.delete(hvertBillede);
        rejse.stop();
        orbit.minDistance = gammelt.min;
        orbit.maxDistance = gammelt.max;
        kamera.near = gammelt.nær;
        kamera.far = gammelt.fjern;
        kamera.updateProjectionMatrix();
        lærred.removeEventListener('pointerdown', vedNed);
        lærred.removeEventListener('pointerup', vedOp);
        fase(null);
      },
      // Kun til tests: hvor en måne står på skærmen (i pixels), så testen kan trykke på den, og flybyen
      test: {
        månePlads(navn) {
          const m = måner.find((x) => x.navn === navn);
          m.krop.getWorldPosition(hjælp).project(kamera);
          const r = lærred.getBoundingClientRect();
          return { x: r.left + ((hjælp.x + 1) / 2) * r.width, y: r.top + ((1 - hjælp.y) / 2) * r.height };
        },
        visning: () => visning,
        navne: () => måner.filter((m) => m.etiket.visible).map((m) => m.id),
        tur: () => ({ trin: flyby.trin, flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand }),
        hop: () => rejse.hop(), // gør den igangværende flyvning færdig
        // de hentede billeder, og om de ligger med én kanal i grafikkortet
        billeder: () => Object.fromEntries([...lager].filter(([, b]) => b.tekstur).map(([n, b]) => [n, b.tekstur.format === THREE.RedFormat ? 'én kanal' : 'farver'])),
      },
    };
  },
};
