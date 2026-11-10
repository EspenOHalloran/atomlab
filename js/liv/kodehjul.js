// Liv L2: kodehjulet, den genetiske kode som et hjul (SVG, ingen Three.js). Det første bogstav står i midten, det
// andet i næste ring og det tredje yderst, og helt yderst står aminosyren (eller stop). Et tryk på et ord viser,
// hvad det betyder. fremhæv(kodon) lyser vejen gennem hjulet op (når ribosomet læser, og som hjælp i "Læs selv").

import { BASER_RNA, KODE, STOP, AMINOSYRER, SLAGS, STOP_FARVE, tilRNA } from '../data/liv/kode.js';
import { BASE_FARVE } from './stige.js';

const NS = 'http://www.w3.org/2000/svg';
export const U_FARVE = '#ff8fc8'; // U i RNA (står i stedet for T, der er rød)
const FARVE = { ...BASE_FARVE, U: U_FARVE };
const R = [21, 37, 53, 66, 97]; // ringenes radier: midten, 1., 2. og 3. bogstav, aminosyrerne

function el(navn, attr = {}, tekst) {
  const e = document.createElementNS(NS, navn);
  for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v);
  if (tekst != null) e.textContent = tekst;
  return e;
}

// Et punkt på hjulet: vinkel i grader fra toppen med uret
function punkt(r, v) {
  const a = ((v - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
}

function sektor(r0, r1, v0, v1) {
  const [x0, y0] = punkt(r1, v0);
  const [x1, y1] = punkt(r1, v1);
  const [x2, y2] = punkt(r0, v1);
  const [x3, y3] = punkt(r0, v0);
  const stor = v1 - v0 > 180 ? 1 : 0;
  const f = (n) => n.toFixed(2);
  return `M${f(x0)} ${f(y0)}A${r1} ${r1} 0 ${stor} 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r0} ${r0} 0 ${stor} 0 ${f(x3)} ${f(y3)}Z`;
}

// Tekst midt i en sektor. radial: drejet langs radius (aminosyrerne), ellers lige (bogstaverne)
function tekstI(g, r, v, tekst, str, radial = false, klasse = '') {
  const [x, y] = punkt(r, v);
  const t = el('text', { x: x.toFixed(2), y: y.toFixed(2), 'font-size': str, class: klasse }, tekst);
  if (radial) {
    let d = v - 90;
    if (v > 180) d += 180; // så teksten ikke står på hovedet i venstre side
    t.setAttribute('transform', `rotate(${d.toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})`);
  }
  g.append(t);
}

export function lavKodehjul(holder, { påValg } = {}) {
  const kort = document.createElement('div');
  kort.className = 'liv-hjul';
  kort.hidden = true;
  const svg = el('svg', { viewBox: '-100 -100 200 200', role: 'img', 'aria-label': 'Kodehjulet' });
  const segmenter = { 1: {}, 2: {}, 3: {}, aa: [] }; // nøgle: bogstaverne (fx 'G', 'GU', 'GUG')
  const g = el('g');
  svg.append(g);
  const trin = [360 / 4, 360 / 16, 360 / 64];
  // De tre ringe med bogstaverne
  for (let ring = 0; ring < 3; ring++) {
    const n = 4 ** (ring + 1);
    for (let i = 0; i < n; i++) {
      let nøgle = '';
      for (let r = 0; r <= ring; r++) nøgle += BASER_RNA[Math.floor(i / 4 ** (ring - r)) % 4];
      const b = nøgle.at(-1);
      const v0 = i * trin[ring];
      const sti = el('path', { d: sektor(R[ring], R[ring + 1], v0, v0 + trin[ring]), class: 'hjul-felt', style: `--farve:${FARVE[b]}` });
      sti.dataset.ord = nøgle;
      g.append(sti);
      segmenter[ring + 1][nøgle] = sti;
      tekstI(g, (R[ring] + R[ring + 1]) / 2, v0 + trin[ring] / 2, b, [10, 7, 5.6][ring], false, 'hjul-bogstav');
    }
  }
  // Aminosyrerne: ord ved siden af hinanden med samme aminosyre er ét felt
  const ord = Object.keys(KODE).sort((a, b) => indeks(a) - indeks(b));
  for (let i = 0; i < 64;) {
    const aa = KODE[ord[i]];
    let j = i;
    while (j < 64 && KODE[ord[j]] === aa && ord[j].slice(0, 2) === ord[i].slice(0, 2)) j++;
    const farve = aa === STOP ? STOP_FARVE : SLAGS[AMINOSYRER[aa].slags].farve;
    const sti = el('path', { d: sektor(R[3], R[4], i * trin[2], j * trin[2]), class: 'hjul-felt hjul-aa', style: `--farve:${farve}` });
    sti.dataset.ord = ord[i];
    g.append(sti);
    segmenter.aa.push({ sti, ord: ord.slice(i, j) });
    const midt = ((i + j) / 2) * trin[2];
    const navn = aa === STOP ? 'Stop' : `${AMINOSYRER[aa].kort} ${aa}`;
    tekstI(g, (R[3] + R[4]) / 2 + 1, midt, navn, j - i > 1 ? 6.4 : 5, true, 'hjul-aa-navn');
    i = j;
  }
  // Midten: det valgte ord og aminosyren
  g.append(el('circle', { r: R[0], class: 'hjul-midte' }));
  const midtOrd = el('text', { y: -3, 'font-size': 9, class: 'hjul-midt-ord' }, '');
  const midtAa = el('text', { y: 9, 'font-size': 8, class: 'hjul-midt-aa' }, '');
  g.append(midtOrd, midtAa);
  const tekst = document.createElement('p');
  tekst.className = 'liv-hjul-tekst';
  kort.append(svg, tekst);
  holder.append(kort);

  let fremhævet = null;
  function visOrd(kodon) {
    const k = kodon ? tilRNA(kodon) : null;
    for (const s of svg.querySelectorAll('.lyser')) s.classList.remove('lyser');
    fremhævet = k;
    if (!k) {
      midtOrd.textContent = '';
      midtAa.textContent = '';
      tekst.textContent = 'Tryk på et ord yderst for at se, hvad det betyder.';
      return;
    }
    segmenter[1][k[0]].classList.add('lyser');
    segmenter[2][k.slice(0, 2)].classList.add('lyser');
    segmenter[3][k].classList.add('lyser');
    segmenter.aa.find((s) => s.ord.includes(k))?.sti.classList.add('lyser');
    const aa = KODE[k];
    midtOrd.textContent = k;
    midtAa.textContent = aa === STOP ? 'stop' : aa;
    tekst.textContent = aa === STOP ? `${k} betyder stop` : `${k} giver ${AMINOSYRER[aa].navn} (${aa})`;
  }
  svg.addEventListener('click', (h) => {
    const sti = h.target.closest('[data-ord]');
    if (!sti || sti.dataset.ord.length < 3) return;
    visOrd(sti.dataset.ord);
    påValg?.(sti.dataset.ord, KODE[sti.dataset.ord]);
  });
  visOrd(null);

  return {
    kort,
    get vist() { return !kort.hidden; },
    vis(til) { kort.hidden = !til; },
    fremhæv: visOrd,
    get fremhævet() { return fremhævet; },
  };
}

function indeks(k) {
  return BASER_RNA.indexOf(k[0]) * 16 + BASER_RNA.indexOf(k[1]) * 4 + BASER_RNA.indexOf(k[2]);
}
