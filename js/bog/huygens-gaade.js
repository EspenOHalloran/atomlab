// Huygens' anagram i bogen (Opdagelserne, docs/drejebog-huygens.md, afsnit 3-4): de 17 bunker af bogstaver, som rækken
// blev trykt i 1656, og sætningen, der kommer frem. Bruges af fortællingens trin 4 (js/bog/huygens.js) og af opslaget
// "Hemmeligheden" (udfordringen med de otte brikker, H3 trin C). Teksterne står i js/data/opdagelser/huygens.js (ANAGRAM).
//
// lavAnagram(rod, anagram, { rolig, påRørt }) fylder rod og giver { tryk(bogstav), visMig(), færdig(), tilstand(), fjern() }.
//   Man finder nøgleordet (ANNULO) ved at trykke på bunkerne i rækkefølge. Et rigtigt bogstav flyver fra bunken til sin
//   plads, og bunkens tal tæller ned. Et forkert bogstav ryster bare lidt. Er ordet fundet, flyver resten af sætningen
//   på plads ord for ord med den danske betydning under, og bunkerne tæller ned til 0.
//   påRørt kaldes ved hvert tryk (Forløb-klodsen: et tryk, mens man gætter, lader gættet tone væk).
// Bunkerne er knapper på mindst 44 px (tre rækker på en telefon). Med ROLIG flyver og ryster intet.

import { bunker, bogstaver } from '../data/opdagelser/huygens.js';

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ORD_EFTER = 380; // ms mellem ordene, når resten af sætningen flyver på plads
const BOGSTAV_EFTER = 220; // ms mellem bogstaverne, når "Næste ›" viser ordet

// Bunkerne som HTML (fælles for trin 4 og udfordringen)
export function bunkerHTML(række) {
  return bunker(række).map(([b, n]) => `<button class="ag-bunke" data-b="${b}" aria-label="${b}, ${n} tilbage">`
    + `<span class="ag-b">${b}</span><span class="ag-tal">${n}</span></button>`).join('');
}

// Tæller bunkerne. tal: { a: 7, … }. Opdaterer knappernes tal og aria-label.
export function lavTæller(rod, række) {
  const tal = Object.fromEntries(bunker(række));
  const knap = (b) => rod.querySelector(`.ag-bunke[data-b="${b}"]`);
  const vis = (b) => {
    const k = knap(b);
    if (!k) return;
    k.querySelector('.ag-tal').textContent = String(tal[b]);
    k.setAttribute('aria-label', `${b}, ${tal[b]} tilbage`);
    k.classList.toggle('tom', tal[b] === 0);
  };
  return {
    tal,
    knap,
    har: (b) => (tal[b] ?? 0) > 0,
    tag(b) {
      if (!(tal[b] > 0)) return false;
      tal[b]--;
      vis(b);
      return true;
    },
    læg(b) {
      tal[b]++;
      vis(b);
    },
    sum: () => Object.values(tal).reduce((a, n) => a + n, 0),
  };
}

// Et kort ryk til siden (et forkert bogstav eller en forkert brik)
export function ryst(el, rolig) {
  if (!el) return;
  if (rolig || !el.animate) {
    el.classList.add('ryster');
    setTimeout(() => el.classList.remove('ryster'), 300);
    return;
  }
  el.animate([{ transform: 'none' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 280 });
}

// el flyver hen på sin plads fra et andet element (fra), fx et bogstav fra sin bunke
export function flyvFra(el, fra, rolig) {
  if (rolig || !el.animate || !fra) return;
  const a = fra.getBoundingClientRect(), b = el.getBoundingClientRect();
  const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(1.3)`, opacity: 0.5 }, { transform: 'none', opacity: 1 }], { duration: 340, easing: 'cubic-bezier(.2,.7,.3,1)' });
}

export function lavAnagram(rod, anagram, { rolig = false, påRørt = null } = {}) {
  const nøgle = anagram.ord.find((o) => o.latin === anagram.nøgle) ?? anagram.ord[0];
  const nøgleBogstaver = [...nøgle.latin];
  rod.innerHTML = '<div class="ag">'
    + `<p class="ag-række" title="Rækken, som Huygens trykte den i 1656">${esc(anagram.række)}</p>`
    + `<div class="ag-bunker" role="group" aria-label="Bunkerne af bogstaver">${bunkerHTML(anagram.række)}</div>`
    + '<div class="ag-sætning" aria-live="polite">'
    + `<span class="ag-ord nøgle"><span class="ag-latin">${nøgleBogstaver.map((b) => `<span class="ag-plads" data-b="${b.toLowerCase()}">${esc(b)}</span>`).join('')}</span>`
    + `<span class="ag-dansk">${esc(nøgle.dansk)}</span></span></div></div>`;
  const ag = rod.querySelector('.ag');
  const sætning = rod.querySelector('.ag-sætning');
  const pladser = [...rod.querySelectorAll('.ag-plads')];
  const tæller = lavTæller(rod, anagram.række);
  let fundet = 0; // så mange bogstaver i nøgleordet er lagt på plads
  let ord = 0; // så mange af de andre ord er fløjet på plads
  let resten = false; // resten af sætningen er på vej
  let viser = false; // "Næste ›" lægger bogstaverne
  let aktiv = true;
  let timere = [];
  const vent = (ms, f) => timere.push(setTimeout(() => { if (aktiv) f(); }, rolig ? 0 : ms));
  rod.querySelector('.ag-bunker').addEventListener('click', (h) => {
    const k = h.target.closest('.ag-bunke');
    if (k) tryk(k.dataset.b);
  });

  function tryk(b) {
    if (!aktiv) return false;
    påRørt?.();
    if (fundet >= pladser.length) return false;
    const plads = pladser[fundet];
    const knap = tæller.knap(b);
    if (plads.dataset.b !== b || !tæller.tag(b)) {
      ryst(knap, rolig);
      return false;
    }
    plads.classList.add('lagt');
    flyvFra(plads, knap, rolig);
    fundet++;
    if (fundet === pladser.length) {
      sætning.querySelector('.nøgle').classList.add('fundet');
      vent(450, flyvResten);
    }
    return true;
  }

  // Resten af sætningen flyver på plads ord for ord, og bunkerne tæller ned
  function flyvResten() {
    if (resten) return;
    resten = true;
    const andre = anagram.ord.filter((o) => o !== nøgle);
    andre.forEach((o, i) => vent(ORD_EFTER * (i + 1), () => {
      const el = document.createElement('span');
      el.className = 'ag-ord';
      el.innerHTML = `<span class="ag-latin">${esc(o.latin)}</span><span class="ag-dansk">${esc(o.dansk)}</span>`;
      sætning.append(el);
      let fra = null;
      for (const b of bogstaver(o.latin)) if (tæller.tag(b)) fra = tæller.knap(b);
      flyvFra(el, fra, rolig);
      ord++;
      if (ord === andre.length) ag.classList.add('hel');
    }));
  }

  return {
    tryk,
    // "Næste ›", før ordet er fundet: bogstaverne lægges selv et ad gangen
    visMig() {
      if (viser || fundet >= pladser.length) return;
      viser = true;
      const mangler = pladser.length - fundet;
      for (let i = 0; i < mangler; i++) vent(BOGSTAV_EFTER * (i + 1), () => tryk(pladser[fundet]?.dataset.b));
    },
    færdig: () => ag.classList.contains('hel'),
    tilstand: () => ({ fundet, ord, tal: tæller.sum(), hel: ag.classList.contains('hel') }),
    fjern() {
      aktiv = false;
      timere.forEach(clearTimeout);
      timere = [];
    },
  };
}
