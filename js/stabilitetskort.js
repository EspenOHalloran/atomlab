// Stabilitetskortet: et lille diagram med neutroner hen ad og protoner op ad.
// Hver prik er en stabil kerne. Tilsammen danner de et bånd, som bøjer mod flere neutroner,
// jo tungere kernerne bliver. Din egen kerne er den lysende prik.

import { stabileKerner } from './data/isotoper.js';

const KERNER = stabileKerner();
const OMRÅDER = {
  lette: { nMax: 32, zMax: 26, navn: 'Lette kerner' },
  alle: { nMax: 180, zMax: 118, navn: 'Alle kerner' },
};
const FARVER = { stabil: '#8ce99a', næsten: '#c0eb75', ustabil: '#ffd43b', meget: '#ffd43b', straks: '#ff6b6b', tom: '#93a0c4' };

export class Stabilitetskort {
  constructor(lærred, valgKnapper) {
    this.lærred = lærred;
    this.valg = 'auto'; // 'auto', 'lette' eller 'alle'
    this.kerne = { z: 0, n: 0, status: 'tom' };
    this.valgKnapper = valgKnapper;
    for (const knap of valgKnapper) {
      knap.addEventListener('click', () => {
        this.valg = knap.dataset.område;
        this.tegn();
      });
    }
    new ResizeObserver(() => this.tegn()).observe(lærred);
  }

  vis(z, n, status) {
    this.kerne = { z, n, status };
    this.tegn();
  }

  område() {
    if (this.valg !== 'auto') return this.valg;
    const { z, n } = this.kerne;
    return z <= OMRÅDER.lette.zMax - 2 && n <= OMRÅDER.lette.nMax - 2 ? 'lette' : 'alle';
  }

  tegn() {
    const lærred = this.lærred;
    const b = lærred.clientWidth;
    const h = lærred.clientHeight;
    if (!b || !h) return;
    const dpr = Math.min(devicePixelRatio, 2);
    if (lærred.width !== Math.round(b * dpr)) lærred.width = Math.round(b * dpr);
    if (lærred.height !== Math.round(h * dpr)) lærred.height = Math.round(h * dpr);
    const g = lærred.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, b, h);

    const valgt = this.område();
    for (const knap of this.valgKnapper) knap.classList.toggle('valgt', knap.dataset.område === valgt);
    const { nMax, zMax } = OMRÅDER[valgt];
    const venstre = 26, højre = 8, top = 10, bund = 22;
    const x = (n) => venstre + (n / nMax) * (b - venstre - højre);
    const y = (z) => h - bund - (z / zMax) * (h - top - bund);

    // Akser og tal
    g.strokeStyle = 'rgba(147,160,196,0.35)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x(0), y(zMax));
    g.lineTo(x(0), y(0));
    g.lineTo(x(nMax), y(0));
    g.stroke();
    g.fillStyle = 'rgba(147,160,196,0.9)';
    g.font = '10px system-ui, sans-serif';
    g.textAlign = 'center';
    const nSkridt = valgt === 'lette' ? 10 : 50;
    for (let v = nSkridt; v <= nMax; v += nSkridt) g.fillText(v, x(v), h - bund + 12);
    g.textAlign = 'right';
    const zSkridt = valgt === 'lette' ? 10 : 50;
    for (let v = zSkridt; v <= zMax; v += zSkridt) g.fillText(v, venstre - 4, y(v) + 3);
    g.textAlign = 'right';
    g.fillText('Neutroner →', b - højre, h - bund - 4);
    g.textAlign = 'left';
    g.fillText('↑ Protoner', venstre + 4, top + 4);

    // Linjen hvor der er lige mange protoner og neutroner
    g.setLineDash([4, 4]);
    g.strokeStyle = 'rgba(255,255,255,0.3)';
    g.beginPath();
    g.moveTo(x(0), y(0));
    const m = Math.min(nMax, zMax);
    g.lineTo(x(m), y(m));
    g.stroke();
    g.setLineDash([]);

    // De stabile kerner
    const s = valgt === 'lette' ? Math.max(3, (b - venstre - højre) / nMax * 0.75) : 2;
    for (const k of KERNER) {
      if (k.n > nMax || k.z > zMax) continue;
      g.fillStyle = k.næsten ? 'rgba(192,235,117,0.55)' : 'rgba(140,233,154,0.85)';
      g.fillRect(x(k.n) - s / 2, y(k.z) - s / 2, s, s);
    }

    // Din kerne
    const { z, n, status } = this.kerne;
    if (z + n === 0) return;
    const px = x(Math.min(n, nMax)), py = y(Math.min(z, zMax));
    const farve = FARVER[status] || '#fff';
    g.strokeStyle = 'rgba(255,255,255,0.18)';
    g.beginPath();
    g.moveTo(px, py); g.lineTo(px, y(0));
    g.moveTo(px, py); g.lineTo(x(0), py);
    g.stroke();
    const glød = g.createRadialGradient(px, py, 0, px, py, 14);
    glød.addColorStop(0, farve);
    glød.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = glød;
    g.beginPath(); g.arc(px, py, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(px, py, 3.5, 0, Math.PI * 2); g.fill();
  }
}
