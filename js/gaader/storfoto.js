// Et foto i stor størrelse oven på scenen i Gåderne, som man kan zoome i (fund fra jeres telefon 19. november 2026: fotoet
// af Cheyava Falls). Knib med to fingre eller rul med musen for at zoome om det sted, fingrene eller musen er. Træk for at
// flytte. Dobbelttryk zoomer ind og ud igen. Det lille billede (det, scenen allerede har) vises med det samme, og det store
// hentes med hentBillede fra js/hentning.js og lægges oven på, når det er klar. "Luk" og Esc lukker.
// vis({ lille, stor, tekst, hjælp, henter, luk }) åbner, lukStorFoto() lukker (også når scenen ryddes).

import { hentBillede } from '../hentning.js';

const MAKS = 3; // højst 3 skærmpunkter pr. punkt i det store foto (ellers bliver det bare grynet)
let åben = null; // { boks, tilbage, påTast, ro, test }, mens fotoet er åbent

export function lukStorFoto() {
  if (!åben) return;
  const { boks, tilbage, påTast, ro } = åben;
  åben = null;
  removeEventListener('keydown', påTast, true);
  ro.disconnect();
  boks.remove();
  tilbage?.focus?.({ preventScroll: true });
}

export const storFotoÅben = () => Boolean(åben);

export function visStorFoto({ lille, stor, tekst = '', hjælp = '', henter = '', luk = 'Luk' }) {
  lukStorFoto();
  const skærm = document.getElementById('gaader') ?? document.body;
  const boks = document.createElement('div');
  boks.className = 'gaade-storfoto';
  boks.setAttribute('role', 'dialog');
  boks.setAttribute('aria-modal', 'true');
  boks.setAttribute('aria-label', tekst || 'Foto');
  boks.innerHTML = `<div class="gaade-storfoto-flade"><img alt="" draggable="false"></div>
    <div class="gaade-storfoto-top"><p class="gaade-storfoto-hjælp"></p><button class="knap lille gaade-storfoto-luk" type="button"></button></div>
    <p class="gaade-storfoto-tekst"></p><p class="gaade-storfoto-henter" hidden></p>`;
  const flade = boks.querySelector('.gaade-storfoto-flade');
  let img = boks.querySelector('img');
  img.src = lille;
  img.alt = tekst;
  boks.querySelector('.gaade-storfoto-hjælp').textContent = hjælp;
  boks.querySelector('.gaade-storfoto-tekst').textContent = tekst;
  const lukKnap = boks.querySelector('.gaade-storfoto-luk');
  lukKnap.textContent = `✕ ${luk}`;
  lukKnap.addEventListener('click', lukStorFoto);
  skærm.appendChild(boks);

  // Zoom og flyt: fotoet passer i fladen ved skala 1 (contain), og s og (x, y) flytter det med en CSS-transform
  let s = 1, x = 0, y = 0;
  let natur = [1648, 1200]; // fotoets egne punkter (det store), til den største zoom
  const grænse = () => {
    const r = flade.getBoundingClientRect();
    const passer = Math.min(r.width / natur[0], r.height / natur[1]);
    return { r, maks: Math.max(2, MAKS / passer / (devicePixelRatio || 1)), b: natur[0] * passer, h: natur[1] * passer };
  };
  const stil = () => {
    const { r, maks, b, h } = grænse();
    s = Math.min(maks, Math.max(1, s));
    // Fotoet må ikke flyttes længere, end at det stadig dækker fladen (eller står i midten, hvis det er mindre)
    const fx = Math.max(0, (b * s - r.width) / 2), fy = Math.max(0, (h * s - r.height) / 2);
    x = Math.min(fx, Math.max(-fx, x));
    y = Math.min(fy, Math.max(-fy, y));
    img.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    boks.classList.toggle('zoomet', s > 1.01);
  };
  // Zoom med faktoren f om punktet (px, py) på skærmen, så det samme sted på fotoet bliver under fingeren
  const zoom = (f, px, py) => {
    const { r, maks } = grænse();
    const ny = Math.min(maks, Math.max(1, s * f));
    const cx = px - (r.left + r.width / 2), cy = py - (r.top + r.height / 2);
    x = cx - (cx - x) * (ny / s);
    y = cy - (cy - y) * (ny / s);
    s = ny;
    stil();
  };

  const fingre = new Map();
  let knib = null; // { d, s, mx, my }
  let sidsteTryk = 0;
  const midt = () => { const [a, b] = [...fingre.values()]; return { mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) || 1 }; };
  flade.addEventListener('pointerdown', (h) => {
    flade.setPointerCapture?.(h.pointerId);
    fingre.set(h.pointerId, { x: h.clientX, y: h.clientY, x0: h.clientX, y0: h.clientY });
    if (fingre.size === 2) knib = { ...midt(), s };
  });
  flade.addEventListener('pointermove', (h) => {
    const f = fingre.get(h.pointerId);
    if (!f) return;
    const dx = h.clientX - f.x, dy = h.clientY - f.y;
    f.x = h.clientX;
    f.y = h.clientY;
    if (fingre.size >= 2 && knib) {
      const m = midt();
      x += m.mx - knib.mx;
      y += m.my - knib.my;
      knib.mx = m.mx;
      knib.my = m.my;
      zoom((knib.s * m.d / knib.d) / s, m.mx, m.my);
    } else if (fingre.size === 1) {
      x += dx;
      y += dy;
      stil();
    }
  });
  const op = (h) => {
    const f = fingre.get(h.pointerId);
    if (!f) return;
    fingre.delete(h.pointerId);
    if (fingre.size < 2) knib = null;
    // Et dobbelttryk (to korte tryk inden for 0,35 s) zoomer ind om stedet, eller ud igen, hvis det allerede er zoomet
    if (h.type === 'pointerup' && fingre.size === 0 && Math.hypot(h.clientX - f.x0, h.clientY - f.y0) < 10) {
      const nu = performance.now();
      if (nu - sidsteTryk < 350) {
        sidsteTryk = 0;
        if (s > 1.01) { s = 1; x = 0; y = 0; stil(); } else zoom(2.5, h.clientX, h.clientY);
      } else sidsteTryk = nu;
    }
  };
  flade.addEventListener('pointerup', op);
  flade.addEventListener('pointercancel', op);
  flade.addEventListener('wheel', (h) => {
    h.preventDefault();
    zoom(Math.exp(-h.deltaY * (h.deltaMode === 1 ? 0.05 : 0.0018)), h.clientX, h.clientY);
  }, { passive: false });

  // Esc lukker fotoet og ikke kortet (lytteren i capture-fasen kommer før Gådernes og main.js' lyttere)
  const påTast = (h) => {
    if (h.key !== 'Escape') return;
    h.stopImmediatePropagation();
    h.preventDefault();
    lukStorFoto();
  };
  addEventListener('keydown', påTast, true);
  const ro = new ResizeObserver(() => stil());
  ro.observe(flade);
  åben = { boks, tilbage: document.activeElement, påTast, ro, test: () => ({ skala: s, stor: img.dataset.fil === stor.split('/').pop(), bredde: img.naturalWidth }) };
  const mit = åben;
  lukKnap.focus({ preventScroll: true });

  // Det store foto: "Henter …" vises kun, hvis det tager mere end ca. et halvt sekund
  const henterEl = boks.querySelector('.gaade-storfoto-henter');
  henterEl.textContent = henter;
  const vent = setTimeout(() => { if (åben === mit) henterEl.hidden = false; }, 500);
  hentBillede(stor).then((nyt) => {
    if (åben !== mit) return;
    nyt.alt = tekst;
    nyt.draggable = false;
    nyt.style.transform = img.style.transform;
    img.replaceWith(nyt);
    img = nyt;
    natur = [nyt.naturalWidth || natur[0], nyt.naturalHeight || natur[1]];
    stil();
  }).catch(() => { /* det lille foto bliver stående */ }).finally(() => {
    clearTimeout(vent);
    henterEl.hidden = true;
  });
  stil();
}

// Til tests: skala, om det store foto er lagt ind, og dets bredde
export const storFotoTest = () => åben?.test() ?? null;
