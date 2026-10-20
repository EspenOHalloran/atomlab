// Kategorikortet i Det periodiske system: Når man vælger en kategori i filtrene, kommer et kort med hvad de har
// til fælles, et lille atom, der viser hvorfor (de yderste elektroner), et animeret "signaturforsøg", en tendens,
// kendte medlemmer og links. Teksterne står i js/data/kategorier.js. Animationerne tegnes på to 2D-lærreder.

import { KATEGORIER, grundstof, skaller } from './data/grundstoffer.js';
import { KATEGORI_INFO } from './data/kategorier.js';
import { ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';

const TAU = Math.PI * 2;

function $(id) {
  return document.getElementById(id);
}

// ---------- Små tegnehjælpere ----------
function cirkel(g, x, y, r, farve) {
  g.fillStyle = farve;
  g.beginPath();
  g.arc(x, y, Math.max(0, r), 0, TAU);
  g.fill();
}

// Et blødt lysende skær
function skær(g, x, y, r, farve, styrke = 1) {
  const grad = g.createRadialGradient(x, y, 0, x, y, Math.max(1, r));
  grad.addColorStop(0, farve.replace('ALFA', String(styrke)));
  grad.addColorStop(1, farve.replace('ALFA', '0'));
  g.fillStyle = grad;
  g.beginPath();
  g.arc(x, y, Math.max(1, r), 0, TAU);
  g.fill();
}

function tekst(g, t, x, y, str = 24, farve = '#e8eeff', just = 'center') {
  g.font = `700 ${str}px system-ui, sans-serif`;
  g.textAlign = just;
  g.textBaseline = 'middle';
  g.fillStyle = farve;
  g.fillText(t, x, y);
}

const glat = (t) => t * t * (3 - 2 * t); // blød overgang 0-1
const klem = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const fase = (t, start, slut) => glat(klem((t - start) / (slut - start)));

// En lille atomkerne af protoner og neutroner (fast mønster, så den ikke blinker)
function kerne(g, x, y, r, antal = 14) {
  for (let i = 0; i < antal; i++) {
    const v = i * 2.4, a = r * 0.62 * Math.sqrt(i / antal);
    cirkel(g, x + Math.cos(v) * a, y + Math.sin(v) * a, r * 0.32, i % 2 ? '#ff6b6b' : '#5ea8ff');
  }
}

// ---------- Det lille atom: skallerne, og hvorfor kategorien opfører sig, som den gør ----------
function tegnAtom(g, B, H, info, farve, t) {
  const nr = info.eksempel;
  const sk = skaller(nr);
  const n = sk.length;
  const mx = B / 2, my = H / 2;
  g.clearRect(0, 0, B, H);
  const rInd = 28, rUd = B / 2 - 20;
  const radius = (i) => (n === 1 ? (rInd + rUd) / 2 : rInd + ((rUd - rInd) * i) / (n - 1));
  const ydre = n - 1;
  const inde = info.vis === 'inde' ? info.skal - 1 : -1;
  for (let i = 0; i < n; i++) {
    const r = radius(i);
    const fremhæv = (i === ydre && info.vis !== 'inde') || i === inde;
    g.strokeStyle = fremhæv ? farve : 'rgba(200,210,240,0.25)';
    g.lineWidth = fremhæv ? 3 : 1.5;
    if (info.vis === 'fuld' && i === ydre) {
      skær(g, mx, my, r + 10, 'rgba(180,140,255,ALFA)', 0.12 + 0.05 * Math.sin(t * 2));
    }
    g.beginPath();
    g.arc(mx, my, r, 0, TAU);
    g.stroke();
    const e = sk[i];
    const fart = 0.5 / (i + 1);
    for (let k = 0; k < e; k++) {
      let v = (k / e) * TAU + t * fart;
      let rr = r;
      // Alkalimetallets eneste yderste elektron vil gerne af sted: den vipper udad
      if (info.vis === 'yderst' && i === ydre && e === 1) {
        rr = r + 6 + 7 * Math.sin(t * 3);
        v = -Math.PI / 2 + t * 0.4;
      }
      const x = mx + Math.cos(v) * rr, y = my + Math.sin(v) * rr;
      if (fremhæv) {
        skær(g, x, y, 14, 'rgba(255,255,255,ALFA)', 0.35);
        cirkel(g, x, y, 7, farve);
      } else {
        cirkel(g, x, y, 3.6, 'rgba(220,230,255,0.85)');
      }
    }
    // Tomme pladser i den yderste skal (halogener og ikkemetaller mangler elektroner)
    if (info.vis === 'mangler' && i === ydre) {
      const plads = 8;
      for (let k = e; k < plads; k++) {
        const v = (k / plads) * TAU + t * fart;
        g.strokeStyle = `rgba(255,255,255,${0.45 + 0.4 * Math.sin(t * 4 + k)})`;
        g.lineWidth = 2;
        g.setLineDash([3, 3]);
        g.beginPath();
        g.arc(mx + Math.cos(v) * r, my + Math.sin(v) * r, 7, 0, TAU);
        g.stroke();
        g.setLineDash([]);
      }
    }
  }
  kerne(g, mx, my, 18);
  tekst(g, grundstof(nr).symbol, mx, my, 22, '#ffffff');
}

// ---------- Signaturforsøgene (B x H er lærredets størrelse, t sekunder siden start, valg fx 'Na') ----------
const FORSØG = {
  // Alkalimetal i vand: Li bobler, Na farer rundt, K brænder lilla, Cs eksploderer
  alkali(g, B, H, t, valg) {
    const tt = t % 5.5;
    const vand = H * 0.5;
    g.fillStyle = 'rgba(60,140,255,0.28)';
    g.fillRect(40, vand, B - 80, H - vand - 20);
    g.strokeStyle = 'rgba(160,210,255,0.6)';
    g.lineWidth = 2;
    g.strokeRect(40, 30, B - 80, H - 50);
    const navne = { Li: 'Lithium', Na: 'Natrium', K: 'Kalium', Cs: 'Cæsium' };
    tekst(g, navne[valg], 60, 52, 22, '#e8eeff', 'left');
    const fald = fase(tt, 0, 0.6);
    let x = B / 2, y = 40 + (vand - 50) * fald;
    const efter = Math.max(0, tt - 0.6);
    if (tt < 0.6) {
      cirkel(g, x, y, 12, '#cfd3da');
      return;
    }
    if (valg === 'Cs') {
      // Et brag, så snart det rammer vandet
      const r = 40 + efter * 260;
      skær(g, x, vand, r, 'rgba(255,240,200,ALFA)', Math.max(0, 1 - efter / 1.2));
      for (let k = 0; k < 18; k++) {
        const v = -Math.PI * (0.1 + 0.8 * (k / 17));
        const s = efter * (180 + (k % 4) * 40);
        cirkel(g, x + Math.cos(v) * s, vand + Math.sin(v) * s + 120 * efter * efter, 5, 'rgba(160,210,255,0.8)');
      }
      if (efter < 1.5) tekst(g, 'BANG!', x, 90, 40, '#fff1c4');
      return;
    }
    const fart = { Li: 0.25, Na: 1.3, K: 2.2 }[valg];
    const krymp = Math.max(0.15, 1 - efter / (valg === 'Li' ? 9 : 4.5));
    x = B / 2 + Math.sin(efter * fart * 1.7) * (B * 0.33) * Math.min(1, efter * fart);
    y = vand - 6;
    // Bobler af hydrogen
    for (let k = 0; k < (valg === 'Li' ? 4 : 10); k++) {
      const p = (efter * 1.6 + k / 7) % 1;
      cirkel(g, x + Math.sin(k * 7.3 + efter * 5) * 14, y - p * 40, 3 + (k % 3), `rgba(230,240,255,${0.7 * (1 - p)})`);
    }
    if (valg === 'K') {
      skær(g, x, y - 26, 34, 'rgba(200,130,255,ALFA)', 0.85 + 0.15 * Math.sin(t * 20));
      skær(g, x, y - 18, 16, 'rgba(255,230,255,ALFA)', 0.9);
    } else if (valg === 'Na' && efter > 2 && efter < 2.8) { // natrium bryder kun nu og da i brand
      skær(g, x, y - 16, 20, 'rgba(255,200,80,ALFA)', 0.55 + 0.25 * Math.sin(t * 17));
    }
    cirkel(g, x, y, 11 * krymp, '#dfe3ea');
  },

  // Magnesium brænder med et blændende hvidt lys
  jordalkali(g, B, H, t) {
    const tt = t % 6;
    const venstre = 90, højre = B - 90, y = H * 0.55;
    const front = højre - (højre - venstre) * fase(tt, 0.5, 5);
    g.fillStyle = '#8f949c';
    g.fillRect(venstre, y - 5, front - venstre, 10);
    // Det brændte er blevet til hvid aske (magnesiumoxid)
    g.fillStyle = 'rgba(245,245,240,0.8)';
    g.fillRect(front, y - 4, højre - front, 8);
    if (tt > 0.5 && tt < 5.2) {
      skær(g, front, y, 150, 'rgba(255,255,255,ALFA)', 0.95);
      skær(g, front, y, 60, 'rgba(255,255,255,ALFA)', 1);
      for (let k = 0; k < 16; k++) {
        const p = (t * 1.8 + k / 16) % 1;
        const v = k * 2.2;
        cirkel(g, front + Math.cos(v) * p * 120, y + Math.sin(v) * p * 90 + p * p * 40, 2.5, `rgba(255,250,220,${1 - p})`);
      }
    }
    tekst(g, 'Magnesium', 30, 34, 22, '#e8eeff', 'left');
  },

  // Jern, cobalt og nikkel hopper op til magneten, kobber og guld bliver liggende
  overgang(g, B, H, t) {
    const tt = t % 7;
    const ned = fase(tt, 0.6, 1.8) * (1 - fase(tt, 6, 6.8));
    const my = 40 + 50 * ned;
    // Hesteskomagneten
    g.lineWidth = 22;
    g.lineCap = 'butt';
    g.strokeStyle = '#d64545';
    g.beginPath();
    g.arc(B / 2, my, 46, Math.PI, TAU);
    g.stroke();
    g.fillStyle = '#d64545';
    g.fillRect(B / 2 - 57, my, 22, 30);
    g.fillStyle = '#c7ccd6';
    g.fillRect(B / 2 + 35, my, 22, 30);
    const kugler = [['Fe', '#9aa1ab', true], ['Co', '#8da2c0', true], ['Ni', '#c9cdd3', true], ['Cu', '#c8773a', false], ['Au', '#ffd24a', false]];
    const bund = H - 50;
    kugler.forEach(([sym, farve, magnetisk], i) => {
      const sx = B / 2 + (i - 2) * 100;
      let x = sx, y = bund;
      if (magnetisk) {
        const op = fase(tt, 1.8 + i * 0.25, 2.6 + i * 0.25) * (1 - fase(tt, 6, 6.8));
        x = sx + (B / 2 + (i - 1) * 32 - sx) * op;
        y = bund + (my + 50 - bund) * op;
      }
      cirkel(g, x, y, 20, farve);
      tekst(g, sym, x, y, 17, '#0b1024');
    });
    tekst(g, 'Magnetisk: Fe, Co, Ni', 24, H - 14, 18, '#cfd6ea', 'left');
  },

  // En ske af gallium smelter i en kop varm te (gallium smelter ved ca. 30 °C)
  andetmetal(g, B, H, t) {
    const tt = t % 7;
    const smelt = fase(tt, 1, 5) * (1 - fase(tt, 6.3, 6.9));
    const kx = B / 2, top = 80, bund = H - 24, halv = 105;
    const teY = top + 28;
    // Teen og koppen
    g.fillStyle = 'rgba(176,110,50,0.8)';
    g.beginPath();
    g.moveTo(kx - halv + 3, teY);
    g.lineTo(kx - halv + 13, bund - 3);
    g.lineTo(kx + halv - 13, bund - 3);
    g.lineTo(kx + halv - 3, teY);
    g.fill();
    g.strokeStyle = 'rgba(230,236,248,0.75)';
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(kx - halv, top);
    g.lineTo(kx - halv + 10, bund);
    g.lineTo(kx + halv - 10, bund);
    g.lineTo(kx + halv, top);
    g.stroke();
    g.beginPath();
    g.arc(kx + halv + 6, (top + bund) / 2, 26, -1.2, 1.2);
    g.stroke();
    // Damp
    g.strokeStyle = 'rgba(255,255,255,0.25)';
    g.lineWidth = 3;
    for (let k = 0; k < 3; k++) {
      g.beginPath();
      for (let i = 0; i <= 20; i++) {
        const y = top - 10 - i * 2.5;
        const x = kx - 50 + k * 50 + Math.sin(i * 0.5 + t * 2 + k) * 6;
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.stroke();
    }
    // Skeen: Den del, der er nede i teen, bliver kortere, og en sølvblank pøl samler sig i bunden
    const A = [kx + 75, top - 55], Bp = [kx - 25, bund - 18];
    const s0 = (teY - A[1]) / (Bp[1] - A[1]);
    const slut = s0 + (1 - s0) * (1 - smelt);
    const P = (s) => [A[0] + (Bp[0] - A[0]) * s, A[1] + (Bp[1] - A[1]) * s];
    g.strokeStyle = '#dfe3ea';
    g.lineWidth = 9;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(...A);
    g.lineTo(...P(slut));
    g.stroke();
    if (smelt < 0.15) {
      const [bx, by] = P(1);
      g.fillStyle = '#dfe3ea';
      g.beginPath();
      g.ellipse(bx, by, 16, 10, -0.6, 0, TAU);
      g.fill();
    }
    if (smelt > 0) {
      g.fillStyle = 'rgba(225,230,238,0.95)';
      g.beginPath();
      g.ellipse(kx - 30, bund - 9, 12 + 50 * smelt, 3 + 4 * smelt, 0, 0, TAU);
      g.fill();
    }
    tekst(g, smelt > 0.4 ? 'Skeen smelter!' : 'Gallium-ske i varm te', 24, 30, 20, '#e8eeff', 'left');
  },

  // Silicium i en computerchip: en transistor tænder og slukker strømmen
  halvmetal(g, B, H, t) {
    const cx = B / 2, cy = H / 2;
    g.fillStyle = '#1b2233';
    g.fillRect(cx - 120, cy - 80, 240, 160);
    g.strokeStyle = '#ffd43b';
    g.lineWidth = 4;
    for (let k = 0; k < 6; k++) {
      const y = cy - 70 + k * 28;
      g.beginPath(); g.moveTo(cx - 140, y); g.lineTo(cx - 120, y); g.stroke();
      g.beginPath(); g.moveTo(cx + 120, y); g.lineTo(cx + 140, y); g.stroke();
    }
    const tændt = Math.floor(t * 1.2) % 2 === 0;
    // Ledningen gennem transistoren
    g.strokeStyle = 'rgba(95,227,255,0.5)';
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(cx - 110, cy); g.lineTo(cx + 110, cy); g.stroke();
    g.fillStyle = tændt ? '#5fe3ff' : '#3a4560';
    g.fillRect(cx - 14, cy - 26, 28, 52);
    for (let k = 0; k < 12; k++) {
      const p = (t * 0.6 + k / 12) % 1;
      const x = cx - 110 + p * 220;
      if (!tændt && x > cx - 18) continue; // stoppet ved transistoren
      cirkel(g, x, cy, 5, '#9ff0ff');
    }
    tekst(g, tændt ? 'TÆNDT' : 'SLUKKET', cx, cy + 56, 20, tændt ? '#9ff0ff' : '#8a93a8');
  },

  // Diamant og grafit: begge rent carbon, men atomerne sidder forskelligt
  ikkemetal(g, B, H, t, valg) {
    const cx = B / 2, cy = H / 2;
    const v = t * 0.5;
    const proj = ([x, y, z]) => {
      const xr = x * Math.cos(v) - z * Math.sin(v), zr = x * Math.sin(v) + z * Math.cos(v);
      const s = 300 / (300 + zr * 40);
      return [cx + xr * 82 * s, cy + y * 82 * s, s];
    };
    let atomer = [], bånd = [];
    if (valg === 'Diamant') {
      // Diamantens enhedscelle: hvert atom holder fast i fire andre
      const pos = [];
      for (let x = 0; x <= 2; x++) for (let y = 0; y <= 2; y++) for (let z = 0; z <= 2; z++) if ((x + y + z) % 2 === 0) pos.push([x, y, z]);
      for (const [x, y, z] of [...pos]) if (x < 2 && y < 2 && z < 2) pos.push([x + 0.5, y + 0.5, z + 0.5]);
      atomer = pos.map((p) => p.map((v) => (v - 1) * 0.8));
      for (let i = 0; i < atomer.length; i++) for (let j = i + 1; j < atomer.length; j++) {
        const d = Math.hypot(atomer[i][0] - atomer[j][0], atomer[i][1] - atomer[j][1], atomer[i][2] - atomer[j][2]);
        if (d < 0.75) bånd.push([i, j, true]);
      }
    } else {
      // Grafit: lag af sekskanter, der glider lidt frem og tilbage
      for (let lag = 0; lag < 3; lag++) {
        const forskyd = Math.sin(t * 1.5 + lag) * 0.15 * (lag - 1);
        const start = atomer.length;
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * TAU;
          atomer.push([Math.cos(a) * 0.9 + forskyd, (lag - 1) * 0.9, Math.sin(a) * 0.9]);
        }
        for (let k = 0; k < 6; k++) bånd.push([start + k, start + ((k + 1) % 6), true]);
        if (lag > 0) bånd.push([start, start - 6, false]);
      }
    }
    const p = atomer.map(proj);
    for (const [i, j, fast] of bånd) {
      g.strokeStyle = fast ? 'rgba(200,220,255,0.7)' : 'rgba(200,220,255,0.25)';
      g.setLineDash(fast ? [] : [4, 5]);
      g.lineWidth = 3;
      g.beginPath(); g.moveTo(p[i][0], p[i][1]); g.lineTo(p[j][0], p[j][1]); g.stroke();
    }
    g.setLineDash([]);
    p.forEach(([x, y, s]) => cirkel(g, x, y, 9 * s, valg === 'Diamant' ? '#bfe9ff' : '#5c6270'));
    tekst(g, valg === 'Diamant' ? 'Diamant: det hårdeste naturlige stof' : 'Grafit: lag, der glider', 24, 30, 20, '#e8eeff', 'left');
  },

  // Natrium giver sin yderste elektron til chlor, og de bliver til salt
  halogen(g, B, H, t) {
    const tt = t % 9;
    const krystal = fase(tt, 5, 6);
    if (krystal < 1) {
      g.globalAlpha = 1 - krystal;
      const møde = fase(tt, 0, 1.6);
      const naX = B * 0.22 + 40 * møde, clX = B * 0.78 - 40 * møde, y = H / 2;
      const hop = fase(tt, 2, 3.4);
      const tegn = (x, sk, sym, farve) => {
        sk.forEach((_, i) => {
          g.strokeStyle = 'rgba(200,210,240,0.35)';
          g.lineWidth = 1.5;
          g.beginPath(); g.arc(x, y, 22 + i * 18, 0, TAU); g.stroke();
        });
        cirkel(g, x, y, 15, farve);
        tekst(g, sym, x, y, 15, '#0b1024');
      };
      tegn(naX, [2, 8, 1], 'Na', '#b197fc');
      tegn(clX, [2, 8, 7], 'Cl', '#63e6be');
      // Elektronen flyver fra natriums yderste skal til chlors tomme plads
      const fra = [naX + 58, y], til = [clX - 58, y];
      const ex = fra[0] + (til[0] - fra[0]) * hop, ey = y - Math.sin(hop * Math.PI) * 60;
      skær(g, ex, ey, 16, 'rgba(255,212,59,ALFA)', 0.6);
      cirkel(g, ex, ey, 6, '#ffd43b');
      if (hop >= 1) {
        tekst(g, 'Na⁺', naX, y - 82, 22, '#d0bfff');
        tekst(g, 'Cl⁻', clX, y - 82, 22, '#96f2d7');
      }
      g.globalAlpha = 1;
    }
    if (krystal > 0) {
      // Saltkrystallen: natrium (lilla, lille) og chlor (grøn, stor) skiftevis i en terning
      g.globalAlpha = krystal;
      const v = t * 0.25;
      const pts = [];
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) pts.push([a - 1, b - 1, c - 1, (a + b + c) % 2]);
      pts.map(([x, y, z, na]) => {
        const xr = x * Math.cos(v) - z * Math.sin(v), zr = x * Math.sin(v) + z * Math.cos(v);
        const yr = y * Math.cos(0.5) - zr * Math.sin(0.5), z2 = y * Math.sin(0.5) + zr * Math.cos(0.5);
        return [B / 2 + xr * 50, H / 2 + yr * 50, z2, na];
      }).sort((a, b) => a[2] - b[2]).forEach(([x, y, z, na]) => cirkel(g, x, y, na ? 10 : 16, na ? '#b197fc' : '#63e6be'));
      tekst(g, 'Bordsalt (NaCl)', 24, 30, 20, '#e8eeff', 'left');
      g.globalAlpha = 1;
    }
  },

  // Ædelgasser lyser i hver sin farve i et rør med strøm
  aedelgas(g, B, H, t) {
    const gasser = [['He', '255,180,140'], ['Ne', '255,90,40'], ['Ar', '185,140,255'], ['Kr', '235,226,255'], ['Xe', '140,175,255']];
    gasser.forEach(([sym, rgb], i) => {
      const x = B / 2 + (i - 2) * 105;
      const tændt = fase(t % 8, 0.3 + i * 0.4, 0.6 + i * 0.4) * (1 - fase(t % 8, 7.3, 7.9));
      const flimmer = 0.85 + 0.15 * Math.sin(t * 13 + i * 2);
      g.fillStyle = 'rgba(255,255,255,0.08)';
      g.fillRect(x - 14, 40, 28, H - 100);
      if (tændt > 0) {
        g.fillStyle = `rgba(${rgb},${0.9 * tændt * flimmer})`;
        g.fillRect(x - 9, 46, 18, H - 112);
        skær(g, x, H / 2 - 20, 70, `rgba(${rgb},ALFA)`, 0.35 * tændt);
      }
      tekst(g, sym, x, H - 34, 22, `rgb(${rgb})`);
    });
  },

  // En neodym-magnet trækker en stålplade med en tung vægt til sig
  lanthanid(g, B, H, t) {
    const tt = t % 6;
    const hop = fase(tt, 1.2, 1.5) * (1 - fase(tt, 5.2, 5.8));
    const magnetY = 60;
    const pladeY = 140 - (140 - magnetY - 28) * hop;
    // Feltlinjer
    g.strokeStyle = 'rgba(127,240,216,0.3)';
    g.lineWidth = 2;
    for (let k = 1; k <= 3; k++) {
      g.beginPath();
      g.ellipse(B / 2, magnetY + 12, 40 + k * 26, 16 + k * 22, 0, 0, Math.PI);
      g.stroke();
    }
    // Magneten (lille og sølvblank)
    g.fillStyle = '#d9dee6';
    g.fillRect(B / 2 - 32, magnetY, 64, 24);
    tekst(g, 'Nd', B / 2, magnetY + 12, 16, '#0b1024');
    // Stålpladen og vægten under den
    g.fillStyle = '#7d8590';
    g.fillRect(B / 2 - 70, pladeY, 140, 10);
    g.strokeStyle = '#aab2bd';
    g.beginPath(); g.moveTo(B / 2, pladeY + 10); g.lineTo(B / 2, pladeY + 36); g.stroke();
    g.fillStyle = '#4b5263';
    g.fillRect(B / 2 - 44, pladeY + 36, 88, 48);
    tekst(g, 'Tung', B / 2, pladeY + 60, 20, '#e8eeff');
    if (hop > 0.95 && tt < 1.8) tekst(g, 'Klik!', B / 2 + 110, magnetY + 30, 24, '#7ff0d8');
  },

  // En neutron rammer en urankerne, der deler sig i to og sender nye neutroner af sted
  actinid(g, B, H, t) {
    const tt = t % 6;
    const cx = B / 2, cy = H / 2;
    const ind = fase(tt, 0, 1.2);
    const del = fase(tt, 1.6, 3.2);
    if (tt < 1.2) cirkel(g, 40 + (cx - 70 - 40) * ind, cy, 8, '#c9cdd6');
    if (del <= 0) {
      const strakt = fase(tt, 1.2, 1.6);
      g.save();
      g.translate(cx, cy);
      g.scale(1 + 0.3 * strakt, 1 - 0.15 * strakt);
      kerne(g, 0, 0, 52, 30);
      g.restore();
      tekst(g, 'Uran', cx, cy + 78, 20, '#e8eeff');
    } else {
      skær(g, cx, cy, 120 * (1 - del) + 20, 'rgba(255,240,200,ALFA)', 0.9 * (1 - del));
      kerne(g, cx - 120 * del, cy - 20 * del, 38, 16);
      kerne(g, cx + 120 * del, cy + 20 * del, 38, 16);
      for (let k = 0; k < 3; k++) {
        const v = -0.9 + k * 0.9;
        cirkel(g, cx + Math.cos(v) * 230 * del, cy + Math.sin(v) * 230 * del * 0.5 - 60 * del, 8, '#c9cdd6');
      }
    }
  },

  // Supertunge grundstoffer: En kerne skydes mod en tynd plade. Et nyt atom lever et øjeblik og henfalder
  ukendt(g, B, H, t) {
    const tt = t % 6;
    const cy = H / 2, pladeX = B * 0.62;
    g.fillStyle = 'rgba(200,210,240,0.5)';
    g.fillRect(pladeX - 3, cy - 70, 6, 140);
    tekst(g, 'Partikelaccelerator', 24, 30, 18, '#cfd6ea', 'left');
    const skud = fase(tt, 0, 1.4);
    if (tt < 1.4) {
      g.strokeStyle = 'rgba(95,227,255,0.4)';
      g.beginPath(); g.moveTo(20, cy); g.lineTo(pladeX, cy); g.stroke();
      kerne(g, 30 + (pladeX - 30) * skud, cy, 16, 8);
    } else if (tt < 3.6) {
      const ny = fase(tt, 1.4, 1.8);
      skær(g, pladeX + 50, cy, 90, 'rgba(255,255,255,ALFA)', 0.8 * (1 - ny));
      kerne(g, pladeX + 50, cy, 34, 24);
      tekst(g, 'Og', pladeX + 50, cy + 56, 20, '#e8eeff');
      tekst(g, 'lever ca. 0,001 sekund', pladeX + 50, cy + 84, 16, '#ffd43b');
    } else {
      const væk = fase(tt, 3.6, 4.6);
      kerne(g, pladeX + 50, cy, 30, 20);
      kerne(g, pladeX + 50 + væk * 200, cy - væk * 90, 10, 4);
      tekst(g, 'Henfaldet', pladeX + 50, cy + 56, 18, '#8a93a8');
    }
  },
};

// ---------- Kortet ----------
export function lavKategorikort({ åbnGrundstof, åbnIVærksted, luk }) {
  const atomLærred = $('katAtom'), forsøgLærred = $('katForsøg');
  const ga = atomLærred.getContext('2d'), gf = forsøgLærred.getContext('2d');
  let kat = null;
  let valg = null;
  let tid = 0;
  let forsøgTid = 0;

  $('katLuk').addEventListener('click', () => { lyd.klik(); luk(); });

  function vis(nyKat) {
    kat = nyKat;
    const info = KATEGORI_INFO[kat];
    const k = KATEGORIER[kat];
    $('systemKategori').style.setProperty('--farve', k.farve);
    $('katNavn').textContent = info.flertal;
    $('katFælles').textContent = info.fælles;
    $('katHvorfor').textContent = info.hvorfor;
    const g = grundstof(info.eksempel);
    $('katAtomTekst').textContent = `${g.navn}: ${skaller(info.eksempel).join(' · ')}`;
    $('katForsøgTitel').textContent = info.forsøg.titel;
    $('katForsøgTekst').textContent = info.forsøg.tekst;
    $('katTendens').textContent = info.tendens ?? '';
    $('katTendens').hidden = !info.tendens;
    $('katÆrligt').innerHTML = info.ærligt ? `<strong>Ærligt talt:</strong> ${info.ærligt}` : '';
    $('katÆrligt').hidden = !info.ærligt;
    // Valg i forsøget (fx Li, Na, K, Cs)
    const valgBoks = $('katForsøgValg');
    valgBoks.innerHTML = '';
    valg = info.forsøg.valg?.[info.forsøg.valg.length > 2 ? 1 : 0] ?? null;
    for (const v of info.forsøg.valg ?? []) {
      const b = document.createElement('button');
      b.className = 'chip filter';
      b.textContent = v;
      b.classList.toggle('valgt', v === valg);
      b.addEventListener('click', () => {
        lyd.klik();
        valg = v;
        forsøgTid = 0;
        for (const x of valgBoks.children) x.classList.toggle('valgt', x === b);
        tegn();
      });
      valgBoks.append(b);
    }
    valgBoks.hidden = !info.forsøg.valg;
    // Kendte medlemmer, man kan åbne
    const medlemmer = $('katMedlemmer');
    medlemmer.innerHTML = '';
    for (const nr of info.medlemmer) {
      const m = grundstof(nr);
      if (m.kategori !== kat) continue;
      const b = document.createElement('button');
      b.className = 'kat-medlem';
      b.innerHTML = `<span>${m.symbol}</span><small>${m.navn}</small>`;
      b.title = `Åbn ${m.navn}`;
      b.addEventListener('click', () => åbnGrundstof(nr));
      medlemmer.append(b);
    }
    // Links til resten af AtomLab
    const links = $('katLinks');
    links.innerHTML = '';
    for (const l of info.links ?? []) {
      const b = document.createElement('button');
      b.className = 'knap lille';
      b.textContent = `${l.tekst} ›`;
      b.addEventListener('click', () => {
        lyd.klik();
        if (l.værksted) åbnIVærksted(l.værksted);
        else if (l.kosmos) {
          try { localStorage.setItem('atomlabKosmos', l.kosmos); } catch { /* ingen lagring */ }
          location.hash = '#kosmos';
        } else location.hash = `#${l.skærm}`;
      });
      links.append(b);
    }
    tid = 0;
    forsøgTid = 0;
    tegn();
    $('systemKategori').scrollTop = 0;
  }

  function tegn() {
    if (!kat) return;
    const info = KATEGORI_INFO[kat];
    // Med "reducer bevægelse" står animationerne stille på et tidspunkt, hvor man kan se det vigtige
    const t = ROLIG ? 3 : tid, tf = ROLIG ? 3.5 : forsøgTid;
    tegnAtom(ga, atomLærred.width, atomLærred.height, info, KATEGORIER[kat].farve, t);
    gf.clearRect(0, 0, forsøgLærred.width, forsøgLærred.height);
    FORSØG[kat](gf, forsøgLærred.width, forsøgLærred.height, tf, valg);
  }

  return {
    vis,
    skjul: () => { kat = null; },
    vist: () => kat,
    // Kun til tests og billeder: spol animationerne frem
    spol: (sek) => {
      tid += sek;
      forsøgTid += sek;
      tegn();
    },
    opdater(dt) {
      if (!kat || ROLIG) return; // med "reducer bevægelse" er billedet tegnet én gang
      tid += dt;
      forsøgTid += dt;
      tegn();
    },
  };
}
