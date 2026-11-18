// Liv L3: turen "Kopien" (forløb 3, drejebogen i docs/drejebog-liv.md, afsnit 2) og "Leg frit: Kopien".
// Teksterne står i js/data/forloeb/kopien.js og js/data/liv/kopien.js. Her står det, der rører scenen (Forløb-klodsen,
// js/forloeb.js) og laboratoriet. Scenen er tegningen fra L2 (js/liv/protein.js) i tilstanden 'kopi': stigen med 12 trin
// lige ud, lynlåsen og de to halvdele, der hver får en ny side.
// Fire trin: træk lynlåsen, sæt det første bogstav på hver halvdel (cellen bygger resten), find et forkert bogstav (cellen
// retter det), og kopiér igen, til en fejl bliver siddende (altid tredje gang, så testen er stabil).
// "Det er cellen, der gør det": Ordene helikase, DNA-polymerase og kopigaffel står kun i "For nørder".
// liv.js giver tegningen, kameraet (vis, kamera) og panelet og sender tryk i 3D hertil (tryk). Træk i lynlåsen fanges her.

import * as THREE from 'three';
import { verden, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { visBesked, rydBeskeder } from './beskeder.js';
import { forløbVink } from './forloeb.js';
import { visLag } from './lag.js';
import { BASE_FARVE } from './liv/stige.js';
import { KOPI_LUK } from './liv/protein.js';
import { PARTNER } from './data/liv/stige.js';
import {
  KOPI_TRIN, KOPI_START, nyBase, gammelBase, FEJL_FIND, FEJL_KOPIER, labFejl, nyKopistige, KOPI_PANEL,
} from './data/liv/kopien.js';

const $ = (id) => document.getElementById(id);
const BASER = ['A', 'T', 'G', 'C'];
const TEMPO = ROLIG ? 12 : 1; // "Reducer bevægelse": alt går næsten med det samme
const Z_FART = 7 * TEMPO; // trin i sekundet, når lynlåsen kører selv
const BYG_FART = 9 * TEMPO; // nye bogstaver i sekundet på hver halvdel
const VOKS = 0.2 / TEMPO; // sekunder om at sætte ét bogstav på
const RET_VENT = 0.6 / TEMPO; // så længe står en fejl, før cellen retter den (af sig selv)
const RET_TID = 0.55 / TEMPO; // klip af og sæt det rigtige på
const SLIP_GRÆNSE = 0.55; // slipper man lynlåsen efter så stor en del, kører den selv resten (målene er runde)
// Farverne i vinduet: rygraden som i js/liv/protein.js (GAMMEL_RYG og NY_RYG) og baserne
const FARVER = [['Gammel side', '#3a4a9e'], ['Ny side', '#8fb4e6'], ...BASER.map((b) => [b, BASE_FARVE[b]])];

const plan = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const tP = new THREE.Vector3();

// stråleVed(x, y): en THREE.Ray fra kameraet gennem et punkt på skærmen. løs(id): en opgave er klaret.
// lab: { start, stop }: kaldes, når laboratoriet åbner og lukker (liv.js viser knapperne og panelet).
export function lavKopienDel({ tegning, vis, kamera, stråleVed, løs, panel, mission, stoppet, næste, slut }) {
  let trin = null; // trinets id, mens turen kører
  let lab = false; // "Leg frit: Kopien"
  let s = null; // scenen: se ny()
  let træk = null; // { id }, mens man trækker i lynlåsen
  let sidstKlik = 0;
  let uden = 0; // laboratoriet: kopier i træk uden en fejl, der blev (så ★-opgaven kan klares inden længe)

  // En ny scene: stigen lukket (eller åben), uden nye sider. fejl: [{ h, k, forkert, bliver, auto }]
  function ny(felter = {}) {
    s = {
      dna: KOPI_START, z: 0, mål: null, ny: [Array(KOPI_TRIN).fill(null), Array(KOPI_TRIN).fill(null)],
      hul: null, fejl: null, lynlås: false, skilt: false,
      bygger: false, // bygger cellen bag lynlåsen?
      næste: [0, 0], // det næste bogstav, cellen bygger på hver halvdel
      tid: [1, 1], // hvor langt cellen er med det næste bogstav (1 = klar)
      venter: [false, false], // venter halvdelen på det første bogstav fra brugeren (trin 2)?
      liste: [], // fejlene i denne kopi
      ret: null, // { h, k, t }: cellen klipper et forkert bogstav af og sætter det rigtige på
      vent: [], // [{ h, k, t }]: fejl, der står lidt, før cellen retter dem
      kopier: 0, rettet: 0, mutation: null, fundet: false, færdig: false,
      ...felter,
    };
    tegning.visKopi(s);
  }

  const fuldt = () => s.ny.every((side) => side.every((b) => b && b.v >= 1 && !b.forkert));
  const kopiFærdig = () => s.ny.every((side) => side.every((b) => b && b.v >= 1)) && !s.ret && !s.vent.length;

  // ---------- Hvert billede ----------
  function opdater(dt) {
    if (!s || (!trin && !lab)) return;
    // Lynlåsen kører selv mod målet (efter "Lyn op", et slip efter mere end halvdelen eller en kopi)
    if (s.mål != null && !træk) {
      s.z = Math.min(s.mål, s.z + Z_FART * dt);
      if (s.z >= s.mål) s.mål = null;
    }
    // Cellen bygger bag lynlåsen: et bogstav ad gangen på hver halvdel, når trinet er helt åbent
    if (s.bygger) {
      for (let h = 0; h < 2; h++) {
        if (s.venter[h]) continue;
        const side = s.ny[h];
        for (const b of side) if (b && b.v < 1 && !b.klip) b.v = Math.min(1, b.v + dt / VOKS);
        const k = s.næste[h];
        if (k >= KOPI_TRIN || s.z < k + 1.5) continue;
        const forrige = k > 0 ? side[k - 1] : null;
        if (forrige && forrige.v < 0.6) continue;
        s.tid[h] = Math.min(1, s.tid[h] + dt * BYG_FART);
        if (s.tid[h] < 1) continue;
        s.tid[h] = 0;
        if (!side[k]) {
          const f = s.liste.find((x) => x.h === h && x.k === k);
          side[k] = { base: f ? f.forkert : nyBase(s.dna, h, k), v: 0, forkert: Boolean(f) };
          if (f && (f.auto || s.visMig)) s.vent.push({ h, k, t: 0, bliver: f.bliver });
        }
        s.næste[h] = k + 1;
      }
    }
    // Fejl, cellen selv retter (trin 4 og laboratoriet), eller som bliver siddende
    for (const v of [...s.vent]) {
      if (s.ny[v.h][v.k].v < 1) continue;
      v.t += dt;
      if (v.t < RET_VENT) continue;
      s.vent.splice(s.vent.indexOf(v), 1);
      if (v.bliver) s.mutation = { h: v.h, k: v.k };
      else {
        if (s.visMig) s.fejl = { h: v.h, k: v.k };
        klip(v.h, v.k);
      }
    }
    // Klip det forkerte bogstav af, og sæt det rigtige på
    if (s.ret) {
      const r = s.ret;
      const b = s.ny[r.h][r.k];
      r.t += dt / RET_TID;
      if (r.t < 0.5) b.v = 1 - 2 * r.t;
      else {
        if (b.forkert) {
          b.base = nyBase(s.dna, r.h, r.k);
          b.forkert = false;
          lyd.proton();
        }
        b.v = Math.min(1, 2 * r.t - 1);
      }
      if (r.t >= 1) {
        b.v = 1;
        b.klip = false;
        s.ret = null;
        s.rettet++;
        if (s.fejl && s.fejl.h === r.h && s.fejl.k === r.k && !s.mutation) s.fejl = null;
      }
    }
    if (!s.færdig && s.bygger && kopiFærdig()) {
      s.færdig = true;
      kopiSlut();
    }
  }

  function klip(h, k) {
    s.ret = { h, k, t: 0 };
    s.ny[h][k].klip = true;
    lyd.klik();
  }

  // En kopi er bygget færdig
  function kopiSlut() {
    if (trin === 'bliver') {
      if (s.mutation) {
        s.fejl = s.mutation;
        lyd.nej();
        forløbVink(`Kopi ${s.kopier}: Et forkert bogstav blev siddende. Det er en mutation.`);
      } else forløbVink(`Kopi ${s.kopier}: Cellen fandt et forkert bogstav og rettede det.`);
    }
    if (lab) {
      if (s.mutation) {
        visBesked({ titel: 'En fejl blev siddende', tekst: 'Et af parrene passer ikke. Kan du finde det? Tryk på det.', type: 'advarsel', varighed: 8000 });
        skriv('En fejl blev siddende. Find parret, der ikke passer, og tryk på det.');
      } else if (s.rettet) skriv(`Cellen fandt ${s.rettet === 1 ? 'et forkert bogstav' : `${s.rettet} forkerte bogstaver`} og rettede ${s.rettet === 1 ? 'det' : 'dem'}. Kopiér igen.`);
      else skriv('Ingen fejl denne gang. To ens stiger. Kopiér igen.');
      uden = s.mutation ? 0 : uden + 1;
      mission();
    }
  }

  // ---------- Lynlåsen ----------
  function lynOp() {
    if (!s || s.z >= KOPI_LUK) return;
    lyd.klik();
    s.mål = KOPI_LUK;
  }

  // Et træk i 3D-billedet: Er det nær lynlåsen (eller den lukkede del af stigen lige foran den), trækker man den
  function lavTræk() {
    const lærred = verden.renderer.domElement;
    lærred.addEventListener('pointerdown', (h) => {
      if (træk || !kanTrække()) return;
      const p = punkt(h);
      if (!p) return;
      const lokal = tegning.indhold.worldToLocal(tP.copy(p));
      const x = tegning.lynlåsX(s.z);
      if (Math.abs(lokal.y) > 2.6 || lokal.x < x - 1.8 || lokal.x > x + 3.5) return;
      træk = { id: h.pointerId };
      verden.styring.enabled = false;
      lærred.setPointerCapture?.(h.pointerId);
      h.stopPropagation();
    }, { capture: true });
    lærred.addEventListener('pointermove', (h) => {
      if (!træk || h.pointerId !== træk.id) return;
      const p = punkt(h);
      if (!p) return;
      const z = Math.min(KOPI_LUK, Math.max(s.z, tegning.zVed(p)));
      if (Math.floor(z) > Math.floor(s.z) && performance.now() - sidstKlik > 70) {
        sidstKlik = performance.now();
        lyd.klik();
      }
      s.z = z;
      s.mål = null;
    });
    const slip = (h) => {
      if (!træk || h.pointerId !== træk.id) return;
      slipTræk();
    };
    lærred.addEventListener('pointerup', slip);
    lærred.addEventListener('pointercancel', slip);
  }

  function slipTræk() {
    træk = null;
    verden.styring.enabled = true;
    if (!s) return;
    if (s.z >= SLIP_GRÆNSE * KOPI_LUK) s.mål = KOPI_LUK; // det sidste stykke kører den selv
    else if (s.z > 1 && trin) forløbVink('Træk lynlåsen hele vejen hen ad stigen.');
  }

  const kanTrække = () => Boolean(s && s.lynlås && s.z < KOPI_LUK && s.mål == null && (trin === 'lyn' || lab));
  const punkt = (h) => stråleVed(h.clientX, h.clientY)?.intersectPlane(plan, new THREE.Vector3()) ?? null;

  // ---------- Bogstaverne i trin 2 ----------
  function sæt(base) {
    if (!s.hul) return;
    const { h, k } = s.hul;
    const gammel = gammelBase(s.dna, h, k);
    if (PARTNER[gammel] !== base) {
      lyd.nej();
      forløbVink(`${base} passer ikke til ${gammel}. A hører sammen med T, og G med C.`);
      return;
    }
    lyd.proton();
    forløbVink('');
    s.ny[h][k] = { base, v: 0 };
    s.næste[h] = k + 1;
    s.venter[h] = false;
    s.hul = h === 0 ? { h: 1, k: 0 } : null;
  }

  // ---------- Tryk i 3D ----------
  function tryk(stråle) {
    if (!s || (!trin && !lab)) return false;
    const par = tegning.kopiVed(stråle);
    if (!par) return false;
    const b = s.ny[par.h][par.k];
    if (trin === 'fejl') {
      if (b.forkert && !s.ret) {
        s.fejl = par;
        klip(par.h, par.k);
        forløbVink('');
      } else if (!b.forkert && !b.klip) {
        lyd.klik();
        forløbVink(`${gammelBase(s.dna, par.h, par.k)}–${b.base} passer. Find et par, hvor bogstaverne ikke passer sammen.`);
      }
      return true;
    }
    if (lab) {
      if (s.mutation && par.h === s.mutation.h && par.k === s.mutation.k) {
        s.fejl = par;
        s.fundet = true;
        skriv(`Du fandt mutationen: ${gammelBase(s.dna, par.h, par.k)}–${b.base} passer ikke. Den bliver givet videre, næste gang stigen kopieres.`);
        løs('liv-mutation'); // (lyden kommer med opgaven, eller fra lyd.proton, hvis den er klaret før)
        lyd.proton();
        mission();
      } else {
        lyd.klik();
        visBesked({ titel: `${gammelBase(s.dna, par.h, par.k)}–${b.base}`, tekst: b.forkert ? 'Det par passer ikke. Cellen er ved at rette det.' : 'Det par passer.', varighed: 3000 });
      }
      return true;
    }
    return false;
  }

  // ---------- Turen ----------
  function start(id, felter) {
    rydBeskeder();
    trin = id;
    ny(felter);
    vis();
  }

  // En kopi fra en lukket stige: lynlåsen kører selv, og cellen bygger bag den
  function kopiér(fejl) {
    const kopier = s.kopier + 1;
    ny({ dna: s.dna, skilt: s.skilt, lynlås: true, bygger: true, liste: fejl, kopier });
    s.mål = KOPI_LUK;
    lyd.klik();
  }

  const del = {
    trin: {
      lyn: {
        start: () => start('lyn', { lynlås: true }),
        knapper: [{ id: 'lyn', tekst: 'Lyn op ›', gør: lynOp, aktiv: () => Boolean(s) && s.z < KOPI_LUK && s.mål == null }],
        færdig: () => s.z >= KOPI_LUK,
        visMig: lynOp,
      },
      byg: {
        start: () => start('byg', { z: KOPI_LUK, bygger: true, venter: [true, true], hul: { h: 0, k: 0 } }),
        knapper: BASER.map((b) => ({
          id: b, tekst: b, kugle: `liv-base-kugle base-${b}`,
          gør: () => sæt(b),
          aktiv: () => Boolean(s?.hul),
        })),
        færdig: () => fuldt(),
        visMig: () => { while (s.hul) sæt(PARTNER[gammelBase(s.dna, s.hul.h, s.hul.k)]); },
      },
      fejl: {
        start: () => {
          start('fejl', { skilt: true, lynlås: true, bygger: true, liste: [{ ...FEJL_FIND, auto: false }] });
          s.mål = KOPI_LUK;
        },
        færdig: () => s.rettet > 0 && !s.ret,
        visMig: () => {
          const { h, k } = FEJL_FIND;
          s.mål = KOPI_LUK;
          if (s.ny[h][k]?.forkert && s.ny[h][k].v >= 1 && !s.ret) {
            s.fejl = { h, k };
            klip(h, k);
          } else if (!s.rettet) s.visMig = true; // fejlen er ikke kommet på endnu: cellen retter den, så snart den er der
        },
      },
      bliver: {
        start: () => start('bliver', { skilt: true }),
        get knapper() {
          return [{
            id: 'kopier', tekst: s?.kopier ? 'Kopiér igen ›' : 'Kopiér stigen ›',
            gør: () => kopiérITur(),
            aktiv: () => Boolean(s) && !s.mutation && (s.kopier === 0 || s.færdig),
          }];
        },
        færdig: () => Boolean(s.mutation) && s.færdig,
        visMig: () => {
          if (s.mutation || (s.kopier > 0 && !s.færdig)) return;
          s.kopier = FEJL_KOPIER.length - 1; // direkte til den kopi, hvor fejlen bliver siddende
          kopiér([{ ...FEJL_KOPIER.at(-1), auto: true }]);
        },
      },
    },
    layout: () => kamera(),
    slutTekst: () => 'De fleste af dine ca. 70 gør ingenting.',
    // Kortet "Hvorfor ligner jeg mine forældre?" står ved Cellekernen (L4: højst tre veje, og tur 4 kom først)
    veje: [
      { tekst: 'Næste tur: Fejlen, der hjalp ›', primær: true, gør: () => requestAnimationFrame(næste) },
      { tekst: 'Leg frit: Kopien', her: true, gør: () => requestAnimationFrame(() => startLab()) },
      { tekst: 'Hvordan ved vi det?', hvorfor: 'livKopi' },
    ],
    slut: () => {
      trin = null;
      if (træk) slipTræk();
      if (!lab) {
        s = null;
        tegning.tøm();
      }
      slut();
    },
  };

  function kopiérITur() {
    if (s.mutation || (s.kopier > 0 && !s.færdig)) return;
    const f = FEJL_KOPIER[Math.min(s.kopier, FEJL_KOPIER.length - 1)];
    kopiér([{ ...f, auto: true }]);
  }

  // ---------- Leg frit: Kopien ----------
  function skriv(tekst) {
    $('livKopiTekst').textContent = tekst;
  }

  function startLab() {
    if (lab) stopLab(false);
    lab = true;
    rydBeskeder();
    ny({ lynlås: true, bygger: true, skilt: true });
    s.liste = labFejl(s.dna, Math.random, uden).map((f) => ({ ...f, auto: true }));
    visLag('liv-kopi'); // foldeboksen "Kopien" (også når man kommer fra turen)
    $('livKopiValg').hidden = true;
    $('livKopiIGang').hidden = false;
    skriv('Træk lynlåsen hen ad stigen. Cellen bygger en ny side på hver halvdel.');
    vis();
    panel();
  }

  function labIgen() {
    if (!lab) return;
    lyd.klik();
    const dna = nyKopistige();
    ny({ dna, lynlås: true, bygger: true, skilt: true });
    s.liste = labFejl(dna, Math.random, uden).map((f) => ({ ...f, auto: true }));
    skriv('En ny stige. Træk lynlåsen, eller tryk "Lyn op".');
    mission();
  }

  // tilbage: gå tilbage til stigen (falsk, når liv.js selv skifter til noget andet)
  function stopLab(tilbage = true) {
    if (!lab) return;
    lab = false;
    if (træk) slipTræk();
    if (!trin) {
      s = null;
      tegning.tøm();
    }
    $('livKopiValg').hidden = false;
    $('livKopiIGang').hidden = true;
    stoppet(tilbage);
  }

  $('livKopiStart').addEventListener('click', () => { lyd.klik(); startLab(); });
  $('livKopiLyn').addEventListener('click', () => lynOp());
  $('livKopiIgen').addEventListener('click', () => labIgen());
  $('livKopiStop').addEventListener('click', () => { lyd.klik(); stopLab(); });
  lavTræk();

  function missionTekst() {
    if (s?.fundet) return 'Du fandt en mutation ★. Kopiér igen, og se, om der kommer flere.';
    if (s?.mutation && s.færdig) return 'Find parret, der ikke passer, og tryk på det.';
    if (s && s.z < KOPI_LUK) return 'Træk lynlåsen hen ad stigen.';
    return 'Kopiér igen, til en fejl bliver siddende.';
  }

  return {
    del,
    kører: () => trin !== null,
    trin: () => trin,
    lab: () => lab,
    startLab,
    stopLab,
    labIgen,
    lynOp,
    tryk,
    opdater,
    vilTryk: () => Boolean(s) && (trin === 'fejl' || lab) && !træk,
    trækker: () => Boolean(træk),
    tekster: () => KOPI_PANEL,
    mission: missionTekst,
    // Farverne i vinduet: de to slags sider og baserne
    farver: () => FARVER,
    test: () => (s ? {
      trin, lab, z: s.z, luk: KOPI_LUK, dna: s.dna, kopier: s.kopier, rettet: s.rettet, færdig: s.færdig,
      mutation: s.mutation, fundet: s.fundet, hul: s.hul, fejl: s.fejl, skilt: s.skilt, lynlås: s.lynlås,
      // De nye sider som tekst ('.' er tom), og de gamle over for dem
      ny: s.ny.map((side) => side.map((b) => (b && b.v >= 1 ? b.base : '.')).join('')),
      gammel: [0, 1].map((h) => [...s.dna].map((_, k) => gammelBase(s.dna, h, k)).join('')),
      forkert: s.ny.flatMap((side, h) => side.map((b, k) => (b?.forkert ? `${h}:${k}` : null)).filter(Boolean)),
    } : null),
    // Spoler tiden frem i små skridt (til tests)
    spol(sek) {
      for (let t = 0; t < sek; t += 0.05) opdater(0.05);
      tegning.tegn();
    },
  };
}
