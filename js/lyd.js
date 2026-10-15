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

let udgang = null; // alle lyde går gennem en kompressor, så kraftige lyde ikke skratter
let støjBuffer = null;

function lydkort() {
  if (!tændt) return null;
  // Browseren tillader først lyd, når man har trykket eller klikket på siden. Indtil da er der stille.
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
  if (!ctx) {
    const Klasse = window.AudioContext || window.webkitAudioContext;
    if (!Klasse) return null;
    ctx = new Klasse();
    udgang = ctx.createDynamicsCompressor();
    udgang.threshold.value = -14;
    udgang.ratio.value = 6;
    udgang.connect(ctx.destination);
    // Et sekunds hvid støj, som bruges til brag og klik
    støjBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = støjBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Støj gennem et filter, der glider (fx et brag, der bliver dybere)
function støj({ varighed = 0.5, fra = 3000, til = 200, filter = 'lowpass', styrke = 0.3, forsinkelse = 0, angreb = 0.005 }) {
  const c = lydkort();
  if (!c) return;
  const start = c.currentTime + forsinkelse;
  const kilde = c.createBufferSource();
  kilde.buffer = støjBuffer;
  kilde.loop = true;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.frequency.setValueAtTime(fra, start);
  f.frequency.exponentialRampToValueAtTime(til, start + varighed);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(styrke, start + angreb);
  g.gain.exponentialRampToValueAtTime(0.0001, start + varighed);
  kilde.connect(f).connect(g).connect(udgang);
  kilde.start(start, Math.random() * 0.5);
  kilde.stop(start + varighed + 0.05);
}

// Klik som fra en geigertæller (måler radioaktiv stråling)
function geigerklik(forsinkelse) {
  støj({ varighed: 0.012, fra: 5000, til: 3000, filter: 'highpass', styrke: 0.35, forsinkelse, angreb: 0.001 });
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
  osc.connect(forstærker).connect(udgang);
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
  // Et enkelt geigerklik (fx for hver spaltning i reaktoren)
  tik: () => geigerklik(0),
  // Alarm ved nødstop: to toner, der skifter
  alarm: () => {
    for (let i = 0; i < 4; i++) {
      tone({ fra: 880, varighed: 0.22, type: 'square', styrke: 0.06, forsinkelse: i * 0.5 });
      tone({ fra: 660, varighed: 0.22, type: 'square', styrke: 0.06, forsinkelse: i * 0.5 + 0.25 });
    }
  },
  // Spaltning: et kraftigt brag
  spaltning: () => {
    tone({ fra: 120, til: 28, varighed: 1.1, type: 'sine', styrke: 0.7 });
    støj({ varighed: 1.0, fra: 6000, til: 100, filter: 'lowpass', styrke: 0.5 });
    tone({ fra: 2600, til: 200, varighed: 0.5, type: 'sawtooth', styrke: 0.06, forsinkelse: 0.05 });
  },
  // Fusion: et dybt "vuup" og en klokkeklang (flere toner jo længere i kæden)
  fusion: (trin = 0) => {
    const stor = trin >= 2;
    tone({ fra: 190, til: 55, varighed: 0.55, type: 'sine', styrke: stor ? 0.5 : 0.3 });
    støj({ varighed: 0.5, fra: 4200, til: 260, filter: 'lowpass', styrke: stor ? 0.3 : 0.16 });
    [660, 990, 1320].slice(0, 1 + Math.min(2, trin)).forEach((f, i) => tone({ fra: f, varighed: 0.45, type: 'triangle', styrke: 0.07, forsinkelse: 0.05 + i * 0.08 }));
  },
  // Kernen ryster: en rumlen, der vokser, og geigerklik, der kommer hurtigere og hurtigere
  opbygning: () => {
    støj({ varighed: 0.85, fra: 150, til: 900, filter: 'lowpass', styrke: 0.18, angreb: 0.7 });
    tone({ fra: 55, til: 110, varighed: 0.85, type: 'sine', styrke: 0.12 });
    let t = 0;
    let pause = 0.16;
    while (t < 0.8) {
      geigerklik(t + Math.random() * 0.02);
      t += pause;
      pause = Math.max(0.025, pause * 0.8);
    }
  },
  // Selve henfaldet: et dybt brag, et sus og så lidt geigerklik bagefter
  henfald: (måde) => {
    tone({ fra: 130, til: 32, varighed: 0.9, type: 'sine', styrke: 0.6 });
    støj({ varighed: 0.9, fra: 5000, til: 120, filter: 'lowpass', styrke: 0.45 });
    if (måde === 'alfa') {
      tone({ fra: 80, til: 28, varighed: 1.2, type: 'sine', styrke: 0.5, forsinkelse: 0.04 });
      støj({ varighed: 1.1, fra: 900, til: 80, filter: 'bandpass', styrke: 0.3, forsinkelse: 0.05 });
    } else {
      // Den lette partikel suser af sted
      tone({ fra: 3200, til: 180, varighed: 0.35, type: 'sawtooth', styrke: 0.07, forsinkelse: 0.03 });
      støj({ varighed: 0.4, fra: 8000, til: 1500, filter: 'bandpass', styrke: 0.2, forsinkelse: 0.03 });
    }
    for (let i = 0; i < 9; i++) geigerklik(0.25 + i * 0.07 + Math.random() * 0.12);
  },
  // Et kæmpe brag, der ruller ud (supernova og kilonova)
  eksplosion: () => {
    tone({ fra: 95, til: 18, varighed: 2.6, type: 'sine', styrke: 0.75 });
    støj({ varighed: 2.8, fra: 4000, til: 50, filter: 'lowpass', styrke: 0.55, angreb: 0.02 });
    støj({ varighed: 1.6, fra: 9000, til: 400, filter: 'bandpass', styrke: 0.18, forsinkelse: 0.05 });
  },
  // En pulsar lavet om til lyd: et klik for hvert blink. Over 100 blink i sekundet bliver det til en tone.
  pulsar: (frekvens, varighed = 2) => {
    if (frekvens > 100) {
      tone({ fra: frekvens, varighed, type: 'square', styrke: 0.05 });
      return;
    }
    for (let t = 0; t < varighed; t += 1 / frekvens) geigerklik(t);
  },
  // Et sus (fx en solstorm)
  sus: (varighed = 1.6) => {
    støj({ varighed, fra: 400, til: 2600, filter: 'bandpass', styrke: 0.22, angreb: varighed * 0.5 });
  },
  // Tyngdebølgernes "chirp": en tone, der stiger hurtigere og hurtigere og stopper brat,
  // ligesom da LIGO lavede den første måling om til lyd
  chirp: (varighed = 1.4) => {
    const c = lydkort();
    if (!c) return;
    const start = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, start);
    for (let i = 1; i <= 20; i++) {
      const t = i / 20;
      osc.frequency.linearRampToValueAtTime(40 + 360 * Math.pow(t, 4), start + t * varighed);
    }
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.08, start + varighed * 0.5);
    g.gain.exponentialRampToValueAtTime(0.35, start + varighed);
    g.gain.exponentialRampToValueAtTime(0.0001, start + varighed + 0.25);
    osc.connect(g).connect(udgang);
    osc.start(start);
    osc.stop(start + varighed + 0.3);
  },
};
