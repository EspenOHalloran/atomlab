// Forløbet "Rundt om Solen" på Solsystemets overblik (docs/drejebog-overblik.md, afsnit 2). Teksterne står i
// js/data/forloeb/overblik.js, klodsen i js/forloeb.js. Her står det, der rører scenen. Overblikket (js/kosmos/overblik.js)
// giver et api med kameraet, kloderne, datoen, skalaen og flaget vis (navnene, ringene, Pluto, bælterne og
// tidsknapperne er skjult imens forløbet kører).
//
// Trin 1 "jorden": kameraet tæt på de fire inderste. Et tryk på Jorden trækker kameraet ud, til alle otte ses. Et tryk
//   på en anden klode giver en linje ("Det er Venus …"), og Jordens ring blinker.
// Trin 2 "rundt": tidsskyderen nederst går fra 0 til ét år frem (Jordens omløbstid) og falder ikke tilbage. Hver planet
//   trækker en hale efter sig, og en tæller ved Merkur og Jorden viser omgangene.
// Hvert trins start stiller scenen forfra (dato i dag, skalaen "Pustet op"), så "‹" kan gå tilbage.

import * as THREE from 'three';
import { ROLIG } from '../scene3d.js';
import { startForløb, stopForløb, starterSelv, kørerForløb, forløbFase, forløbVink, forløbTest } from '../forloeb.js';
import { tagVentForløb } from '../gaa.js';
import { OVERBLIK } from '../data/forloeb/overblik.js';

// Det, kameraet skal have i billedet (halv bredde og halv højde i enheder, set skråt oppefra som overblikkets hjem):
// trin 1 Mars' bane (aphel ca. 4,7 enheder ude i "Pustet op"), ellers Neptuns bane (20 enheder) med plads til
// tidsskyderen nederst
const INDERST = [5.0, 3.1];
const HELE = [20.6, 12.4];
const HALE_N = 160; // punkter i hver hale (Merkur når over fire omgange på et år)
const FREMHÆV_S = 3; // sekunder, Jordens ring blinker efter et forkert tryk
const VIS_MIG_S = 4; // "Vis mig" i trin 2 spoler året på ca. 4 sekunder
const NUL = new THREE.Vector3();

export function lavOverblikForløb(api) {
  const { kamera, orbit, vindue, gruppe, kloder, klode, vis, HJEM, tidLag, skyder } = api;
  const jorden = klode('jorden');
  const ÅR_J = jorden.p.omløb * 864e5; // ét år: Jorden én gang rundt
  let stoppet = false;
  let trin = null; // trinets id, mens forløbet kører
  let kameraBoks = null; // det, trinets kamera skal have i billedet (layout zoomer igen)
  let fremhævTid = 0;
  let fundet = false; // trin 1: Jorden er fundet
  let årStart = 0; // trin 2: datoen, året starter
  let rundt = false; // trin 2: Jorden er nået rundt
  let autoSpol = false; // trin 2: "Vis mig" spoler selv
  let haleDato = null; // datoen, halerne sidst blev tegnet til

  const kører = () => kørerForløb() === OVERBLIK.id;

  // ---------- Halerne og tællerne (trin 2) ----------
  const v = new THREE.Vector3();
  const haler = kloder.filter((k) => !k.p.dværg).map((k) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(HALE_N * 3), 3));
    geo.setDrawRange(0, 0);
    const farve = new THREE.Color(k.p.farve).lerp(new THREE.Color(0xffffff), 0.35);
    const linje = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: farve, transparent: true, opacity: 0.95, depthWrite: false }));
    linje.visible = false;
    linje.frustumCulled = false;
    gruppe.add(linje);
    return { k, geo, linje };
  });
  function tegnHaler() {
    const nu = api.dato();
    if (nu === haleDato) return;
    haleDato = nu;
    const e = Math.max(0, nu - årStart);
    for (const h of haler) {
      const a = h.geo.attributes.position.array;
      for (let i = 0; i < HALE_N; i++) {
        api.punkt(h.k.p, årStart + (e * i) / (HALE_N - 1), v);
        a[i * 3] = v.x; a[i * 3 + 1] = v.y; a[i * 3 + 2] = v.z;
      }
      h.geo.attributes.position.needsUpdate = true;
      h.geo.setDrawRange(0, e > 0 ? HALE_N : 0);
    }
  }
  const visHaler = (til) => {
    for (const h of haler) h.linje.visible = til;
    haleDato = null;
  };
  const tællere = ['merkur', 'jorden'].map((id) => {
    const e = document.createElement('div');
    e.className = 'ob-tæller';
    e.hidden = true;
    vindue.append(e);
    return { k: klode(id), e, tekst: '' };
  });
  const omgange = (k) => Math.floor((api.dato() - årStart) / (k.p.omløb * 864e5) + 1e-9);
  function tegnTællere(til) {
    const r = vindue.getBoundingClientRect();
    for (const t of tællere) {
      t.e.hidden = !til || !t.k.skærm.synlig;
      if (t.e.hidden) continue;
      const n = Math.max(0, omgange(t.k));
      const tekst = `${t.k.p.navn}: ${n} ${n === 1 ? 'omgang' : 'omgange'}`;
      if (tekst !== t.tekst) t.e.textContent = t.tekst = tekst;
      t.e.style.transform = `translate(${(t.k.skærm.x - r.left + 9).toFixed(1)}px, ${(t.k.skærm.y - r.top + 7).toFixed(1)}px)`;
    }
  }

  // ---------- Kameraet ----------
  // Kameraet skråt oppefra (som overblikkets hjem), så boksen [halv bredde, halv højde] om Solen fylder billedet.
  // bagJorden: kameraet står på den anden side af Solen end Jorden, så man ser Jordens dagside (står kameraet på Jordens
  // side, er Jorden mellem kameraet og Solen, og man ser dens nat)
  let kameraBagJorden = false;
  function passer(boks, varighed = 2.2, bagJorden = false) {
    kameraBoks = boks;
    kameraBagJorden = bagJorden;
    api.vælgKamera();
    const retning = new THREE.Vector3(...HJEM.retning).normalize();
    if (bagJorden) {
      api.punkt(jorden.p, api.dato(), v);
      retning.set(-v.x, 0, -v.z).normalize();
      retning.y = HJEM.retning[1] / Math.hypot(HJEM.retning[0], HJEM.retning[2]); // samme højde over banerne som hjem
      retning.normalize();
    }
    const afstand = api.afstandForBoks(...boks);
    if (ROLIG) {
      orbit.target.set(0, 0, 0);
      kamera.position.copy(retning).multiplyScalar(afstand);
      return;
    }
    api.flyvTil({ mål: () => NUL, afstand, retning, slags: 'forløb', varighed });
  }

  // ---------- Fælles for trinene ----------
  // Stiller scenen forfra: i dag, "Pustet op", intet fremhævet, halerne og skyderens år væk
  function forfra(id) {
    trin = id;
    vis.forløb = true;
    vis.fremhæv = vis.ringKun = null;
    fremhævTid = 0;
    autoSpol = false;
    api.iDag();
    api.sætSkala(0, false);
    api.skyderÅr(null);
    visHaler(false);
  }
  function fremhævJorden() {
    vis.fremhæv = 'jorden';
    fremhævTid = FREMHÆV_S;
  }

  // Et tryk i scenen (id: den nærmeste klode inden for 44 px eller null)
  function tryk(id) {
    if (!kører() || forløbFase() !== 'gør') return;
    if (trin === 'jorden') {
      if (!id) return;
      if (id === 'jorden') {
        if (fundet) return;
        fundet = true;
        vis.fremhæv = null;
        passer(HELE, 3); // kameraet trækker sig ud, til alle otte ses
        return;
      }
      const f = OVERBLIK.forkert;
      forløbVink(f[id] ?? f.ude(klode(id).p.navn));
      fremhævJorden();
    }
  }

  const FL_DEL = {
    igen: 'fra hjælpen (?) i Solsystemet eller fra "Din fremgang" i menuen',
    trin: {
      jorden: {
        start: () => { forfra('jorden'); fundet = false; passer(INDERST, 2.2, true); },
        færdig: () => fundet,
        visMig: () => tryk('jorden'),
      },
      rundt: {
        start: () => {
          forfra('rundt');
          årStart = api.dato();
          api.skyderÅr(årStart, ÅR_J);
          rundt = false;
          visHaler(true);
          passer(HELE);
        },
        færdig: () => rundt,
        visMig: () => { autoSpol = true; },
      },
    },
    layout: () => {
      // Panelerne er væk (eller kommet igen): Kameraet zoomer, så trinets billede passer i det nye hul
      if (kører() && kameraBoks) passer(kameraBoks, api.flyver() ? 1.6 : 0.8, kameraBagJorden);
    },
    slut: () => {
      trin = null;
      kameraBoks = null;
      vis.forløb = false;
      vis.fremhæv = vis.ringKun = null;
      autoSpol = false;
      api.skyderÅr(null);
      visHaler(false);
      tegnTællere(false);
      tidLag.classList.remove('fl-skjult', 'ob-kun-skyder');
    },
  };

  function start() {
    if (!stoppet) startForløb(OVERBLIK, FL_DEL);
  }
  // Første gang man åbner Solsystemet, fra "Din fremgang", linket ?forloeb=overblik#solsystem eller hjælpen.
  // Startes, når overblikket er bygget færdigt (skallen viser siden og Styr-boksen lige efter lav()).
  if (tagVentForløb([OVERBLIK.id]) || starterSelv(OVERBLIK)) requestAnimationFrame(start);

  return {
    kører,
    tryk,
    hvertBillede(dt) {
      if (!kører()) return;
      if (fremhævTid > 0 && (fremhævTid -= dt) <= 0) vis.fremhæv = null;
      // Tidsskyderen er kun fremme i trin 2 (uden ⏪, ⏩ og "I dag"), når man har gættet
      const fase = forløbFase();
      tidLag.classList.add('ob-kun-skyder');
      tidLag.classList.toggle('fl-skjult', !(trin === 'rundt' && (fase === 'gør' || fase === 'så')));
      if (trin === 'rundt') {
        if (autoSpol && fase === 'gør') {
          skyder.value = Math.min(1, Number(skyder.value) + dt / VIS_MIG_S);
          skyder.dispatchEvent(new Event('input'));
        }
        if (api.dato() >= årStart + ÅR_J - 1) rundt = true;
        tegnHaler();
      }
      tegnTællere(trin === 'rundt' && fase !== 'gæt');
    },
    stop() {
      stoppet = true;
      if (kører()) stopForløb();
      for (const t of tællere) t.e.remove();
      for (const h of haler) { h.geo.dispose(); h.linje.material.dispose(); }
    },
    test: {
      ...forløbTest(),
      start,
      haler: () => haler.filter((h) => h.linje.visible && h.geo.drawRange.count > 0).length,
      tæller: (id) => tællere.find((t) => t.k.p.id === id)?.e.textContent ?? null,
      omgange: (id) => omgange(klode(id)),
      tidVist: () => !tidLag.classList.contains('fl-skjult'),
      fremhævet: () => vis.fremhæv,
      tryk: (id) => tryk(id),
    },
  };
}
