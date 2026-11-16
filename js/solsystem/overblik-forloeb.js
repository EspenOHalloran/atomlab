// Forløbet "Rundt om Solen" på Solsystemets overblik (docs/drejebog-overblik.md, afsnit 2). Teksterne står i
// js/data/forloeb/overblik.js, klodsen i js/forloeb.js. Her står det, der rører scenen. Overblikket (js/kosmos/overblik.js)
// giver et api med kameraet, kloderne, datoen, skalaen og flaget vis (navnene, ringene, Pluto, bælterne og
// tidsknapperne er skjult imens forløbet kører).
//
// Trin 1 "jorden": kameraet tæt på de fire inderste. De er mindst ca. 14 px og har en ring, de ydre er dæmpet
//   (vis.inderst). Et tryk på Jorden trækker kameraet ud, til alle otte ses. Et tryk
//   på en anden klode giver en linje ("Det er Venus …"), og Jordens ring blinker.
// Trin 2 "rundt": tidsskyderen nederst går fra 0 til ét år frem (Jordens omløbstid) og falder ikke tilbage. Hver planet
//   trækker en hale efter sig, og en tæller ved Merkur og Jorden viser omgangene.
// Trin 3 "skala": knappen "Rigtig størrelse og afstand" i linjen. Skalaen glider langsomt (SKALA_S), og planeterne
//   skrumper til prikker. Solen bliver en lysprik.
// Trin 4 "dyk": den rigtige skala, kun Jordens ring vises. Et tryk inden for 44 px af Jorden starter dykket (DYK_S): Kameraet
//   flyver fra hele Solsystemet ned til Jorden, til den fylder billedet, med en tæller for afstanden. Ringen følger Jorden,
//   til den er stor nok at se. Jordens bane går gennem Jorden (banerOm) og tones ud tæt på den (overblik.js).
// "Det så du" (drejebogens trin 5): kernesætningen, mens kameraet trækker sig ud, og skalaen glider tilbage til
//   "Pustet op". Vejene: "Besøg en planet" (navnene tændt, Merkur mat), "Leg frit" (laboratoriet) og "Rejs med lyset"
//   (js/solsystem/overblik-lys.js).
// Hvert trins start stiller scenen forfra (dato i dag, skalaen "Pustet op", i trin 4 den rigtige), så "‹" kan gå tilbage.

import * as THREE from 'three';
import { ROLIG, centrerVindue } from '../scene3d.js';
import { startForløb, stopForløb, starterSelv, kørerForløb, forløbFase, forløbVink, forløbTest } from '../forloeb.js';
import { tagVentForløb } from '../gaa.js';
import { OVERBLIK } from '../data/forloeb/overblik.js';
import { kmTekst } from '../data/planeter.js';

// Det, kameraet skal have i billedet (halv bredde og halv højde i enheder, set skråt oppefra som overblikkets hjem):
// trin 1 Mars' bane (aphel ca. 4,7 enheder ude i "Pustet op"), ellers Neptuns bane (20 enheder) med plads til
// tidsskyderen nederst
const INDERST = [5.0, 3.1];
const HELE = [20.6, 12.4];
const HALE_N = 160; // punkter i hver hale (Merkur når over fire omgange på et år)
const FREMHÆV_S = 3; // sekunder, Jordens ring blinker efter et forkert tryk
const VIS_MIG_S = 4; // "Vis mig" i trin 2 spoler året på ca. 4 sekunder
const SKALA_S = 3; // sekunder, skalaen glider i trin 3 og tilbage til sidst
const DYK_S = 8; // sekunder, dykket ned til Jorden i trin 4 (wow-øjeblikket)
const UD_S = 4.5; // sekunder, kameraet trækker sig ud fra Jorden ved "Det så du"
const TRYK_PX = 44;
const RING_PX = 7; // Jordens ring slukkes, når Jorden er så mange pixel i radius (så kan man se den selv)
const AFSTAND_S = 3; // sekunder, tælleren for afstanden står, efter kameraet er nede ved Jorden
const NUL = new THREE.Vector3();


export function lavOverblikForløb(api) {
  const { kamera, orbit, vindue, gruppe, kloder, klode, vis, HJEM, tidLag, skyder } = api;
  const jorden = klode('jorden');
  const KM = jorden.p.radius / api.radiusVed(jorden.p, 1); // km pr. enhed i den rigtige skala
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
  let skalaTrykket = false; // trin 3: knappen er trykket
  let dyk = null; // trin 4: null, 'flyver' eller 'nede'
  let udTrukket = false; // "Det så du": kameraet er sendt ud
  let nedeTid = 0; // sekunder, kameraet har været nede ved Jorden
  let tilHjem = false; // forløbet er slut: kameraet skal hjem til laboratoriet, når panelerne er tilbage

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

  // ---------- Tælleren for afstanden under dykket (trin 4) ----------
  const afstandLag = document.createElement('div');
  afstandLag.className = 'ob-afstand';
  afstandLag.hidden = true;
  afstandLag.setAttribute('aria-live', 'off');
  api.overlag.append(afstandLag);
  let afstandVist = '';
  function visAfstand() {
    const km = Math.max(0, kamera.position.distanceTo(jorden.pos) - jorden.r) * KM;
    const tekst = `Til Jorden: ${kmTekst(km)}`;
    if (tekst !== afstandVist) afstandLag.textContent = afstandVist = tekst;
  }

  // ---------- Vejen "Besøg en planet" (efter forløbet) ----------
  // En linje over datoen nederst. Navnene er tændt, Pluto skjult og Merkur mat (overblik.js, vis.besøg), til man flyver
  // ind til en planet eller lukker linjen.
  const besøgLinje = document.createElement('div');
  besøgLinje.className = 'ob-besøg';
  besøgLinje.hidden = true;
  besøgLinje.innerHTML = '<span></span><button class="knap lille" aria-label="Luk">✕</button>';
  tidLag.prepend(besøgLinje);
  const besøgTekst = besøgLinje.firstChild;
  besøgLinje.lastChild.addEventListener('click', () => visBesøg(false));
  function visBesøg(til) {
    vis.besøg = til;
    besøgLinje.hidden = !til;
    besøgTekst.textContent = OVERBLIK.besøgTekst;
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
  function forfra(id, skala = 0) {
    trin = id;
    vis.forløb = true;
    vis.fremhæv = vis.ringKun = null;
    vis.inderst = false;
    fremhævTid = 0;
    autoSpol = false;
    dyk = null;
    udTrukket = false;
    afstandLag.hidden = true;
    api.sætFokus(null);
    // Var kameraet helt nede ved Jorden ("‹" fra trin 4 eller "Det så du"), står det med den nye skala måske inde i en
    // kugle. Så springer det ud, før det flyver på plads.
    const nede = kamera.position.distanceTo(orbit.target) < 0.01;
    if (nede) api.stopFlyvning();
    api.iDag();
    api.sætSkala(skala, false);
    api.skyderÅr(null);
    visHaler(false);
    if (nede) {
      orbit.target.set(0, 0, 0);
      kamera.position.set(...HJEM.retning).normalize().multiplyScalar(api.afstandForBoks(...HELE));
    }
  }
  // ROLIG: skalaskiftet og dykket som en toning gennem mørke (i stedet for bevægelsen)
  function ton(skift) {
    const mørke = document.createElement('div');
    mørke.className = 'ob-mørke';
    mørke.style.opacity = '1';
    vindue.append(mørke);
    skift();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      mørke.style.transition = 'opacity 0.6s';
      mørke.style.opacity = '0';
      setTimeout(() => mørke.remove(), 700);
    }));
  }
  function rigtigSkala() {
    if (skalaTrykket) return;
    skalaTrykket = true;
    if (ROLIG) ton(() => api.sætSkala(1, false));
    else api.sætSkala(1, true, SKALA_S);
  }
  // Dykket: fra hele Solsystemet ned til Jorden, til den fylder billedet (Jorden fra den belyste side)
  function dykNed() {
    if (dyk) return;
    dyk = 'flyver';
    kameraBoks = null;
    afstandLag.hidden = false;
    const mål = { mål: () => jorden.pos, afstand: api.afstandFor(jorden.r), retning: api.indRetning(jorden), slags: 'dyk' };
    const nede = () => { dyk = 'nede'; nedeTid = 0; api.sætFokus(jorden); visAfstand(); };
    if (ROLIG) ton(() => { api.flyvTil({ ...mål, færdig: nede }); });
    else api.flyvTil({ ...mål, varighed: DYK_S, færdig: nede });
  }
  // "Det så du": kameraet trækker sig ud fra Jorden, og bagefter glider skalaen tilbage til "Pustet op"
  function trækUd() {
    udTrukket = true;
    vis.ringKun = null;
    afstandLag.hidden = true;
    api.sætFokus(null);
    const tilbage = () => {
      kameraBoks = HELE;
      if (ROLIG) ton(() => api.sætSkala(0, false));
      else api.sætSkala(0, true, SKALA_S);
    };
    if (ROLIG) ton(() => { passer(HELE); tilbage(); });
    else api.flyvTil({ mål: () => NUL, afstand: api.afstandForBoks(...HELE), retning: new THREE.Vector3(...HJEM.retning), slags: 'forløb', varighed: UD_S, færdig: tilbage });
  }
  // Efter forløbet: hjem til laboratoriets kamera (panelerne er tilbage) og skalaen "Pustet op"
  function hjem() {
    const skala = () => { if (api.t() > 0) api.sætSkala(0, !ROLIG, 1.2); };
    if (ROLIG) {
      orbit.target.set(0, 0, 0);
      kamera.position.set(...HJEM.retning).normalize().multiplyScalar(api.afstandFor(HJEM.radius));
      skala();
      return;
    }
    api.flyvTil({ mål: () => NUL, afstand: api.afstandFor(HJEM.radius), retning: new THREE.Vector3(...HJEM.retning), slags: 'hjem', varighed: 2.2, færdig: skala });
  }
  function fremhævJorden() {
    vis.fremhæv = 'jorden';
    fremhævTid = FREMHÆV_S;
  }

  // Et tryk i scenen (id: den nærmeste klode inden for 44 px eller null, x og y: hvor på skærmen)
  function tryk(id, x, y) {
    if (!kører() || forløbFase() !== 'gør') return;
    if (trin === 'dyk') {
      // Jordens ring ligger tæt ved Solen (17 px på pc): Et tryk tæt på Jorden tæller, selv om Solen er nærmere
      const j = jorden.skærm;
      if (x == null || Math.hypot(x - j.x, y - j.y) < TRYK_PX) dykNed();
      else forløbVink(OVERBLIK.forkert.dyk);
      return;
    }
    if (trin === 'jorden') {
      if (!id) return;
      if (id === 'jorden') {
        if (fundet) return;
        fundet = true;
        vis.fremhæv = null;
        vis.inderst = false;
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
        start: () => { forfra('jorden'); fundet = false; vis.inderst = true; passer(INDERST, 2.2, true); },
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
      skala: {
        start: () => { forfra('skala'); skalaTrykket = false; passer(HELE); },
        knapper: [{ id: 'rigtig', tekst: 'Rigtig størrelse og afstand', gør: rigtigSkala, aktiv: () => !skalaTrykket }],
        færdig: () => api.t() >= 0.999,
        visMig: rigtigSkala,
      },
      dyk: {
        start: () => {
          forfra('dyk', 1);
          api.banerOm(api.dato()); // Jordens bane går gennem Jorden i dag
          vis.ringKun = 'jorden';
          passer(HELE);
        },
        færdig: () => dyk === 'nede',
        visMig: () => tryk('jorden'),
      },
    },
    veje: [
      { tekst: 'Besøg en planet', primær: true, gør: () => efterVej(true) },
      { tekst: 'Leg frit', gør: () => efterVej(false) },
      { tekst: 'Rejs med lyset', gør: () => efterVej(false, true) },
    ],
    layout: () => {
      // Panelerne er væk (eller kommet igen): Kameraet zoomer, så trinets billede passer i det nye hul
      if (kører() && kameraBoks) passer(kameraBoks, api.flyver() ? 1.6 : 0.8, kameraBagJorden);
    },
    slut: () => {
      trin = null;
      kameraBoks = null;
      vis.forløb = false;
      vis.fremhæv = vis.ringKun = null;
      vis.inderst = false;
      autoSpol = false;
      dyk = null;
      afstandLag.hidden = true;
      api.sætFokus(null);
      api.skyderÅr(null);
      visHaler(false);
      tegnTællere(false);
      tidLag.classList.remove('fl-skjult', 'ob-kun-skyder');
      tilHjem = true; // (layout kalder hjem, når panelerne er tilbage)
    },
  };
  const layout = FL_DEL.layout;
  FL_DEL.layout = () => {
    if (!kører() && tilHjem && !stoppet) {
      tilHjem = false;
      hjem();
      return;
    }
    layout();
  };
  // En vej videre (klodsen afslutter forløbet uden at lægge siden om, når vejen har gør): panelerne kommer tilbage,
  // kameraet flyver hjem, og på vejen "Besøg en planet" tændes navnene
  function efterVej(besøgVej, lys = false) {
    visBesøg(besøgVej);
    if (lys) tilHjem = false; // (rejsen stiller selv kameraet og skalaen)
    requestAnimationFrame(() => {
      centrerVindue();
      if (lys) api.lys.start();
      else FL_DEL.layout();
    });
  }

  function start() {
    if (stoppet) return;
    api.lys.stop();
    startForløb(OVERBLIK, FL_DEL);
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
      if (trin === 'dyk') {
        if (dyk) visAfstand();
        if (dyk === 'nede' && (nedeTid += dt) > AFSTAND_S) afstandLag.hidden = true; // (den dækker Jordens underkant)
        // Ringen følger Jorden, til Jorden selv er stor nok at se
        if (dyk && !udTrukket) vis.ringKun = jorden.r / api.pxPr(kamera.position.distanceTo(jorden.pos)) > RING_PX ? null : 'jorden';
        if (fase === 'slut' && !udTrukket) trækUd();
      }
    },
    visBesøg, // (lukkes, når "Rejs med lyset" starter)
    // Et tryk på vejen "Besøg en planet": Merkur er ikke bygget endnu (true: trykket er taget)
    besøgTryk(id) {
      if (id !== 'merkur') return false;
      besøgTekst.textContent = OVERBLIK.merkurSenere;
      return true;
    },
    stop() {
      stoppet = true;
      if (kører()) stopForløb();
      for (const t of tællere) t.e.remove();
      afstandLag.remove();
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
      inderst: () => vis.inderst,
      tryk: (id, x, y) => tryk(id, x, y),
      dyk: () => dyk,
      ringKun: () => vis.ringKun,
      afstand: () => (afstandLag.hidden ? null : afstandLag.textContent),
      besøg: () => (vis.besøg ? besøgTekst.textContent : null),
      udTrukket: () => udTrukket,
    },
  };
}
