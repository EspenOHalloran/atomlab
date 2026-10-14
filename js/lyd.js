// Små lyde, der laves direkte i browseren (Web Audio). Ingen lydfiler.

const NØGLE = 'atomlabLyd';
let ctx = null;
let tændt = hent();

function hent() {
  try {
    return localStorage.getItem(NØGLE) !== 'fra';
  } catch {
    return true;
  }
}

export function lydErTændt() {
  return tændt;
}

export function skiftLyd() {
  tændt = !tændt;
  try {
    localStorage.setItem(NØGLE, tændt ? 'til' : 'fra');
  } catch {
    // ingen lagring, så husker vi det bare ikke
  }
  return tændt;
}

function lydkort() {
  if (!tændt) return null;
  if (!ctx) {
    const Klasse = window.AudioContext || window.webkitAudioContext;
    if (!Klasse) return null;
    ctx = new Klasse();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// En enkelt tone, der kan glide fra én frekvens til en anden
function tone({ fra, til = fra, varighed = 0.15, type = 'sine', styrke = 0.12, forsinkelse = 0 }) {
  const c = lydkort();
  if (!c) return;
  const start = c.currentTime + forsinkelse;
  const osc = c.createOscillator();
  const forstærker = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(fra, start);
  osc.frequency.exponentialRampToValueAtTime(til, start + varighed);
  forstærker.gain.setValueAtTime(0.0001, start);
  forstærker.gain.exponentialRampToValueAtTime(styrke, start + 0.01);
  forstærker.gain.exponentialRampToValueAtTime(0.0001, start + varighed);
  osc.connect(forstærker).connect(c.destination);
  osc.start(start);
  osc.stop(start + varighed + 0.02);
}

export const lyd = {
  proton: () => tone({ fra: 520, til: 780, varighed: 0.12, type: 'triangle' }),
  neutron: () => tone({ fra: 260, til: 330, varighed: 0.14, type: 'triangle' }),
  elektron: () => {
    tone({ fra: 1400, til: 2100, varighed: 0.09, styrke: 0.06 });
    tone({ fra: 2100, til: 2600, varighed: 0.08, styrke: 0.04, forsinkelse: 0.05 });
  },
  fjern: () => tone({ fra: 500, til: 200, varighed: 0.12, type: 'sine', styrke: 0.08 }),
  nej: () => tone({ fra: 160, til: 120, varighed: 0.2, type: 'sawtooth', styrke: 0.05 }),
  opdaget: () => {
    [660, 880, 1320].forEach((f, i) => tone({ fra: f, varighed: 0.18, type: 'triangle', styrke: 0.09, forsinkelse: i * 0.08 }));
  },
  klaret: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone({ fra: f, varighed: 0.28, type: 'triangle', styrke: 0.1, forsinkelse: i * 0.1 }));
    tone({ fra: 1568, til: 2093, varighed: 0.5, styrke: 0.05, forsinkelse: 0.4 });
  },
  klik: () => tone({ fra: 900, varighed: 0.04, type: 'square', styrke: 0.03 }),
  // Kernen ryster og summer, lige før den henfalder
  opbygning: () => {
    tone({ fra: 90, til: 260, varighed: 0.8, type: 'sawtooth', styrke: 0.05 });
    tone({ fra: 180, til: 520, varighed: 0.8, type: 'triangle', styrke: 0.04 });
  },
  // Selve henfaldet: et brag og et "pew", når partiklen skydes ud
  henfald: (måde) => {
    tone({ fra: 140, til: 40, varighed: 0.5, type: 'sawtooth', styrke: 0.12 });
    tone({ fra: 2400, til: 300, varighed: 0.35, type: 'square', styrke: 0.03 });
    if (måde === 'alfa') tone({ fra: 700, til: 160, varighed: 0.6, type: 'triangle', styrke: 0.08, forsinkelse: 0.05 });
    else tone({ fra: 3000, til: 900, varighed: 0.25, type: 'sine', styrke: 0.06, forsinkelse: 0.05 });
  },
};
