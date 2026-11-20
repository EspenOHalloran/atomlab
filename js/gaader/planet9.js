// Gåden "Er der en planet mere i Solsystemet?" i 3D (Planet 9, docs/plan-gaader-3d.md). Teksterne står i
// js/data/gaader.js (scene), og banerne i js/data/planet9.js (JPL's Small-Body Database).
// Trin 1, før man har gættet: Solen, Neptuns bane (den lille ring), og de seks baner fra Batygin og Brown 2016 tegnes
// én ad gangen, set lige oppefra. Alle seks kommer tættest på Solen i samme side. Prikkerne er småkloderne, og tiden er
// spolet frem (ét sekund er ca. 200 år).
// Trin 1, efter gættet: Planet 9 som en stiplet klode og en stiplet bane (et bud), drejet modsat de seks.
// Trin 2: alle småkloder med en godt målt bane (i en anden farve), 2017 OF201 med navn. Efter gættet stemplet GÆT og to
// lige store stiplede forklaringer: "en planet trækker" og "det er der, man har ledt".
// Trin 3 og det sidste billede: Rubin-observatoriet og himlen, der fotograferes felt for felt, igen og igen.

import * as THREE from 'three';
import { verden } from '../scene3d.js';
import { glød, skilt } from '../kosmos/faelles.js';
import { lyd } from '../lyd.js';
import { gådeMed } from '../data/gaader.js';
import { SMÅKLODER, periheliumRetning } from '../data/planet9.js';
import { fuld, stiplet, stempel } from './streg.js';

const HB = 9; // den halve bredde og højde af det, kameraet skal se (planet z = 0)
const HH = 6;
const AU = 1 / 100; // enheder pr. AU: TG422 når 1.075 AU ud
const SOL = new THREE.Vector3(2.6, 0, 0); // Solen står til højre, så de lange baner kan nå ud til venstre
const ÅR_PR_SEK = 200;
const TEGN = 1.1; // sekunder om at tegne én af de seks baner
const MELLEM = 0.55; // sekunder mellem dem
const GRAD = Math.PI / 180;
const GULD = new THREE.Color(1.0, 0.62, 0.18);
const BLÅ = new THREE.Color(0.3, 0.55, 1.0);
const RØD = new THREE.Color(1.0, 0.3, 0.3);
// Planet 9 (et bud): Siraj, Chyba og Tremaine 2025
const P9_A = 290;
const P9_E = 0.29;

// De seks fra 2016 peger i snit i denne retning (set oppefra). Kortet drejes, så den peger mod højre.
const SEKS = SMÅKLODER.filter((s) => s[7]);
const middel = (() => {
  let x = 0, y = 0;
  for (const s of SEKS) { const r = periheliumRetning(s) * GRAD; x += Math.cos(r); y += Math.sin(r); }
  return Math.atan2(y, x);
})();
const DREJ = -middel;

// Et punkt på banen ud fra den excentriske anomali E, i Jordens baneplan (x, y), drejet og skaleret til kortet
function punkt([, a, e, i, om, w], E, v) {
  const xb = a * (Math.cos(E) - e);
  const yb = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const [O, W, I] = [om * GRAD, w * GRAD, i * GRAD];
  const x1 = xb * Math.cos(W) - yb * Math.sin(W);
  const y1 = (xb * Math.sin(W) + yb * Math.cos(W)) * Math.cos(I);
  const x = x1 * Math.cos(O) - y1 * Math.sin(O);
  const y = x1 * Math.sin(O) + y1 * Math.cos(O);
  return v.set((x * Math.cos(DREJ) - y * Math.sin(DREJ)) * AU + SOL.x, (x * Math.sin(DREJ) + y * Math.cos(DREJ)) * AU + SOL.y, 0);
}
// Keplers ligning M = E - e sin E, løst med Newtons metode (M lægges først mellem 0 og 2π, og fra E = π går det altid godt)
function kepler(M0, e) {
  const M = ((M0 % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  let E = Math.PI;
  for (let k = 0; k < 30; k++) {
    const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= d;
    if (Math.abs(d) < 1e-9) break;
  }
  return E;
}
const v0 = new THREE.Vector3();
function banePunkter(s, n = 160) {
  const p = [];
  for (let k = 0; k <= n; k++) { punkt(s, (k / n) * Math.PI * 2, v0); p.push([v0.x, v0.y, 0]); }
  return p;
}

export function lavNær(ctx) {
  const { gruppe, linje, knapper, passer, ROLIG } = ctx;
  const T = gådeMed('planet9').scene;
  const kort = lavKort(gruppe, T, ROLIG);
  let rubin = null;
  let tilstand = null; // 'seks' | 'planet' | 'flere' | 'svar' | 'rubin'
  let tid0 = 0;

  function stilKamera() {
    verden.styring.enabled = false;
    verden.styring.autoRotate = false;
    passer(HB, HH);
  }

  function trin(n, valgt) {
    if (n <= 1) {
      rubin?.skjul();
      kort.g.visible = true;
      if (!tilstand || tilstand === 'rubin') stilKamera();
      const ny = n === 0 ? (valgt === null ? 'seks' : 'planet') : (valgt === null ? 'flere' : 'svar');
      if (ny !== tilstand) {
        tilstand = ny;
        kort.vis(ny, linje);
      }
      knapper([]);
      return;
    }
    kort.g.visible = false;
    if (tilstand !== 'rubin') { tilstand = 'rubin'; stilKamera(); }
    rubin ??= lavRubin(gruppe, T, ROLIG);
    rubin.vis(linje, n >= 3 ? `Sig det til en ven: ${gådeMed('planet9').ven}` : null);
    knapper([]);
  }

  function opdater(dt, tid) {
    tid0 = tid;
    if (tilstand === 'rubin') rubin.opdater(dt);
    else if (tilstand) kort.opdater(dt, linje);
  }

  return {
    drejer: false,
    egetKamera: false,
    trin,
    opdater,
    // Et tryk, mens de seks baner tegnes, tegner dem færdige med det samme
    tryk: () => { if (tilstand === 'seks') kort.spring(); },
    spol: (s) => { for (let i = 0; i < s * 30; i++) opdater(1 / 30, tid0 + i / 30); },
    test: () => ({ tilstand, kort: kort.test(), rubin: rubin?.test() ?? null }),
    fjern: () => {
      verden.styring.enabled = true;
      verden.styring.autoRotate = false;
    },
  };
}

// ---------- Kortet over Solsystemet langt ude (trin 1 og 2) ----------
function lavKort(gruppe, T, ROLIG) {
  const N = T.navne;
  const g = new THREE.Group();
  gruppe.add(g);
  // Solen og Neptuns bane (30 AU)
  const sol = glød(new THREE.Color(1.5, 1.2, 0.7), 0.9, 1);
  sol.position.copy(SOL);
  const neptun = [];
  for (let k = 0; k <= 64; k++) { const a = (k / 64) * Math.PI * 2; neptun.push([SOL.x + Math.cos(a) * 30 * AU, SOL.y + Math.sin(a) * 30 * AU, 0]); }
  g.add(sol, fuld(neptun, new THREE.Color(0.35, 0.55, 1.0), { bredde: 2 }));
  const solNavn = skilt(N.solen, '#ffe2a8', 0.5);
  solNavn.position.set(SOL.x + 0.2, SOL.y - 0.7, 0.2);
  const neptunNavn = skilt(N.neptun, '#9fbaff', 0.48);
  neptunNavn.position.set(SOL.x + 1.4, SOL.y + 0.6, 0.2);
  g.add(solNavn, neptunNavn);

  // Banerne. De seks fra 2016 i guld, de andre i blå og 2017 OF201 i rød (alle er målt, så alle er i farve)
  const baner = SMÅKLODER.map((s) => {
    const of = s[0] === '2017 OF201';
    const l = fuld(banePunkter(s), s[7] ? GULD : of ? RØD : BLÅ, { bredde: s[7] || of ? 2.4 : 1.4 });
    if (!s[7] && !of) l.material.opacity = 0.6; // de andre lidt svagere, så de seks og 2017 OF201 kan ses
    l.visible = false;
    g.add(l);
    // Prikken er småkloden (den starter, hvor den er nu)
    const prik = glød(s[7] ? new THREE.Color(1.4, 1.1, 0.6) : of ? new THREE.Color(1.4, 0.7, 0.6) : new THREE.Color(0.8, 1.0, 1.4), s[7] ? 0.42 : 0.3, 0.95);
    prik.visible = false;
    g.add(prik);
    const P = Math.pow(s[1], 1.5); // omløbstiden i år (Keplers 3. lov)
    return { s, l, prik, P, seks: s[7], of, M: s[6] * GRAD };
  });
  const seks = baner.filter((b) => b.seks);
  const andre = baner.filter((b) => !b.seks);
  const seksNavn = skilt(N.seks, '#ffd58a', 0.56);
  seksNavn.position.set(-5.6, 3.6, 0.2);
  seksNavn.visible = false;
  g.add(seksNavn);
  // 2017 OF201: navnet står til venstre for banen, der hvor den er kommet ca. 3 enheder op over Solen på vej ud
  const of = baner.find((b) => b.of);
  const ofNavn = skilt(N.of201, '#ffaaa0', 0.52);
  {
    const p = banePunkter(of.s, 400);
    const k = p.findIndex(([, y], j) => j > 0 && j < 200 && Math.abs(y - SOL.y) > 3);
    const [x, y] = p[Math.max(0, k)];
    ofNavn.position.set(x - 1.5, y, 0.2);
  }
  ofNavn.visible = false;
  g.add(ofNavn);

  // Planet 9: et bud, stiplet. Banens perihelium peger den modsatte vej af de seks (mod venstre), så det fjerneste
  // punkt står til højre for Solen
  const p9 = new THREE.Group();
  const b9 = P9_A * Math.sqrt(1 - P9_E * P9_E);
  const c9 = P9_A * P9_E; // midten af ellipsen ligger c9 til højre for Solen
  const bane9 = [];
  for (let k = 0; k <= 120; k++) { const a = (k / 120) * Math.PI * 2; bane9.push([SOL.x + (c9 + P9_A * Math.cos(a)) * AU, SOL.y + b9 * Math.sin(a) * AU, 0]); }
  const fjernest = new THREE.Vector3(SOL.x + (c9 + P9_A) * AU, SOL.y, 0);
  const klode = [];
  for (let k = 0; k <= 40; k++) { const a = (k / 40) * Math.PI * 2; klode.push([fjernest.x + Math.cos(a) * 0.36, fjernest.y + Math.sin(a) * 0.36, 0]); }
  p9.add(stiplet(bane9, { bredde: 1.8, streg: 0.3, mellem: 0.22 }), stiplet(klode, { bredde: 2.4, streg: 0.12, mellem: 0.09 }));
  const p9Navn = skilt(N.planet, '#e8eeff', 0.48);
  p9Navn.position.set(fjernest.x - 0.3, fjernest.y - 0.75, 0.2);
  p9.add(p9Navn);
  p9.visible = false;
  g.add(p9);
  const st = stempel('GÆT', 0.9);
  st.sprite.position.set(fjernest.x - 0.4, fjernest.y + 1.15, 1);
  g.add(st.sprite);

  // De to forklaringer: lige store kasser og lige lange streger fra de seks perihelier (lige til højre for Solen)
  const forklaring = new THREE.Group();
  const fra = [SOL.x + 0.7, SOL.y, 0];
  const kasse = (y, tekst) => {
    const x0 = 3.9, x1 = 8.7, h = 0.62;
    forklaring.add(stiplet([[x0, y - h, 0], [x1, y - h, 0], [x1, y + h, 0], [x0, y + h, 0], [x0, y - h, 0]], { bredde: 2 }));
    const s = skilt(tekst, '#d6deef', 0.5);
    s.position.set((x0 + x1) / 2, y, 0.2);
    forklaring.add(s, stiplet([fra, [x0, y, 0]], { bredde: 1.5 }));
  };
  kasse(4.4, N.trækker);
  kasse(-4.4, N.ledt);
  forklaring.visible = false;
  g.add(forklaring);

  let t = 0; // tiden siden de seks begyndte at blive tegnet
  let tegnet = false;
  let sagt = false;
  let tilstand = null;
  let tSvar = -1;
  let år = 0; // år siden nu (prikkerne)
  const vis = (l, f) => {
    l.visible = f > 0;
    const n = l.geometry.attributes.instanceStart?.count ?? 160;
    l.geometry.instanceCount = Math.max(1, Math.round(n * Math.min(1, f)));
  };
  function stilPrikker() {
    for (const b of baner) {
      if (!b.l.visible) { b.prik.visible = false; continue; }
      const M = b.M + (år / b.P) * Math.PI * 2;
      punkt(b.s, kepler(M, b.s[2]), b.prik.position);
      b.prik.visible = Math.abs(b.prik.position.x) < HB + 1 && Math.abs(b.prik.position.y) < HH + 1;
    }
  }

  return {
    g,
    vis(ny, linje) {
      tilstand = ny;
      const tidligt = ny === 'seks';
      if (tidligt) { t = 0; tegnet = false; sagt = false; år = 0; linje(T.start); }
      else { t = 99; tegnet = true; sagt = true; }
      for (const b of seks) vis(b.l, tidligt ? 0 : 1);
      seksNavn.visible = !tidligt;
      const flere = ny === 'flere' || ny === 'svar';
      for (const b of andre) vis(b.l, flere ? 1 : 0);
      ofNavn.visible = flere;
      p9.visible = ny !== 'seks';
      forklaring.visible = false;
      if (ny === 'svar') { tSvar = 0; st.slå(ROLIG); linje(T.flereSvar); } else { tSvar = -1; st.skjul(); }
      if (ny === 'planet') { linje(T.efter); lyd.opdaget(); }
      if (ny === 'flere') linje(T.flere);
      stilPrikker();
    },
    spring() {
      if (tegnet) return;
      t = (seks.length - 1) * MELLEM + TEGN;
    },
    opdater(dt, linje) {
      if (!g.visible) return;
      if (tilstand === 'seks' && !tegnet) {
        t += dt;
        seks.forEach((b, i) => vis(b.l, ROLIG ? (t > i * MELLEM ? 1 : 0) : (t - i * MELLEM) / TEGN));
        if (t >= (seks.length - 1) * MELLEM + TEGN) { tegnet = true; seksNavn.visible = true; }
      }
      if (tegnet && !sagt) { sagt = true; linje(T.samme); }
      if (!ROLIG) år += dt * ÅR_PR_SEK;
      stilPrikker();
      if (tSvar >= 0) {
        tSvar += dt;
        st.opdater(dt);
        forklaring.visible = st.landet() || ROLIG;
        const f = ROLIG ? 1 : Math.max(0, Math.min(1, (tSvar - 0.35) / 0.6));
        for (const l of forklaring.children) if (l.material) l.material.opacity = f;
      }
    },
    test() {
      // Går prikkerne mod uret set oppefra (som planeterne)? Regnet for alle synlige baner over et lille skridt
      let mod = 0, med = 0;
      const a = new THREE.Vector3(), b2 = new THREE.Vector3();
      for (const b of baner) {
        if (!b.l.visible) continue;
        const M = b.M + (år / b.P) * Math.PI * 2;
        punkt(b.s, kepler(M, b.s[2]), a);
        punkt(b.s, kepler(M + 0.001, b.s[2]), b2);
        const kryds = (a.x - SOL.x) * (b2.y - SOL.y) - (a.y - SOL.y) * (b2.x - SOL.x);
        if (kryds > 0) mod++; else med++;
      }
      // Retningen til perihelium på kortet for de seks (grader fra højre)
      const retning = seks.map((b) => { punkt(b.s, 0, a); return Math.round(Math.atan2(a.y - SOL.y, a.x - SOL.x) / GRAD); });
      return {
        tilstand, tegnet, seks: seks.filter((b) => b.l.visible && b.l.geometry.instanceCount >= 150).length,
        andre: andre.filter((b) => b.l.visible).length, planet: p9.visible, of201: ofNavn.visible,
        stempel: st.landet(), forklaringer: forklaring.visible, kasser: 2, mod, med, retning, år: Math.round(år),
        fjernest: [Math.round((c9 + P9_A)), fjernest.x <= HB],
      };
    },
  };
}

// ---------- Trin 3: Rubin-observatoriet ----------
// Bygningen med kuplen (målt, i farve) og himlen som en bue af felter, der fotograferes ét ad gangen og igen og igen.
// Felterne er en tegning, ikke Rubins rigtige felter.
function lavRubin(gruppe, T, ROLIG) {
  const N = T.navne;
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const GRÅ = new THREE.Color(0.62, 0.72, 0.85);
  const y0 = -4.0;
  g.add(fuld([[-8.6, y0, 0], [8.6, y0, 0]], new THREE.Color(0.4, 0.45, 0.55), { bredde: 2 }));
  // Bygningen og kuplen med en åbning, hvor teleskopet kigger ud
  const bund = 1.0;
  g.add(fuld([[-1.3, y0, 0], [-1.3, y0 + bund, 0], [1.3, y0 + bund, 0], [1.3, y0, 0]], GRÅ, { bredde: 2.2 }));
  const kuppel = [];
  for (let k = 0; k <= 40; k++) { const a = Math.PI - (k / 40) * Math.PI; if (a > 1.25 && a < 1.65) continue; kuppel.push([Math.cos(a) * 1.25, y0 + bund + Math.sin(a) * 1.25, 0]); }
  const venstre = kuppel.filter(([x]) => x < 0);
  const højre = kuppel.filter(([x]) => x > 0);
  g.add(fuld(venstre, GRÅ, { bredde: 2.2 }), fuld(højre, GRÅ, { bredde: 2.2 }));
  const navn = skilt(N.rubin, '#d6deef', 0.5);
  navn.position.set(0, y0 - 0.6, 0.2);
  g.add(navn);
  // Himlen: felter i buer over observatoriet
  const felter = [];
  const midt = [0, y0 + bund + 1.2];
  for (const [r, antal] of [[4.6, 9], [5.8, 11], [7.0, 13], [8.2, 15]]) {
    for (let k = 0; k < antal; k++) {
      const a = 0.22 + (k / (antal - 1)) * (Math.PI - 0.44);
      const cx = midt[0] + Math.cos(a) * r * 1.05, cy = midt[1] + Math.sin(a) * r * 0.62;
      if (cy > HH - 0.4) continue;
      const h = 0.34;
      const l = fuld([[cx - h, cy - h, 0], [cx + h, cy - h, 0], [cx + h, cy + h, 0], [cx - h, cy + h, 0], [cx - h, cy - h, 0]], new THREE.Color(0.55, 0.85, 1.0), { bredde: 1.6 });
      l.material.opacity = 0;
      g.add(l);
      felter.push(l);
    }
  }
  // Kameraets kig: en svag kegle fra kuplen mod feltet, der fotograferes
  const kig = fuld([[0, y0 + bund + 1.25, 0], [0, 0, 0]], new THREE.Color(0.35, 0.5, 0.7), { bredde: 1.2 });
  g.add(kig);
  kig.frustumCulled = false;
  const kigPos = kig.geometry.attributes.instanceStart;
  const FELT_TID = 0.12; // sekunder pr. felt
  let t = 0;
  let slut = null;
  let nu = -1;
  function stil() {
    const n = felter.length;
    const runde = Math.floor(t / (n * FELT_TID));
    const i = Math.floor(t / FELT_TID) % n;
    felter.forEach((l, k) => {
      // Fotograferet i denne runde: svagt. Det, der fotograferes nu: lyst. Med ROLIG intet blink.
      const sket = k < i || runde > 0;
      const alder = (i - k + n) % n;
      l.material.opacity = ROLIG ? (sket || k === i ? 0.55 : 0.12) : k === i ? 1 : sket ? Math.max(0.28, 0.9 - alder * 0.04) : 0.12;
    });
    if (i !== nu) {
      nu = i;
      const p = felter[i].geometry.attributes.instanceStart;
      // Midten af feltet (første hjørne plus en halv side). Kun tallene i stregens buffer skiftes, ingen ny geometri
      kigPos.data.array[3] = p.getX(0) + 0.34;
      kigPos.data.array[4] = p.getY(0) + 0.34;
      kigPos.data.needsUpdate = true;
    }
  }
  return {
    vis(linje, ven) { g.visible = true; slut = ven; linje(ven ?? T.rubin); stil(); },
    skjul() { g.visible = false; },
    opdater(dt) {
      if (!g.visible) return;
      t += dt;
      stil();
    },
    test: () => ({ felter: felter.length, fotograferet: felter.filter((l) => l.material.opacity >= 0.28).length, slut: Boolean(slut), kig: Boolean(kigPos) }),
  };
}
