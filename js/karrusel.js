// Menuen som en karrusel (standard siden K3, 8. november 2026, se docs/plan-menu.md og docs/plan-verdener.md).
// Ringen har ét kort pr. verden (K4), og kortene kredser om menuens atom på en skrå elektronbane (en ellipse).
// Verdenen forrest står i #menu[data-midt]. Dens dele er knapper inde i kortet (de gamle menukort, flyttet ind),
// og en verden med kun én del åbner delen, når man trykker et sted på kortet.
// Ringen drejer med en fjeder: den følger fingeren, tager farten med og falder blødt på plads.
// Under ringen står en dok med verdenerne, så man kan hoppe direkte, og knappen "Din fremgang".
// ✓ på delene og verdenerne og "Start her" for en ny bruger sættes også her (startKarrusel).

import { ROLIG, LAV_KVALITET, centrerVindue, passerTil } from './scene3d.js';
import { lavMenuBaggrund, startMenuBaggrund, stopMenuBaggrund, baggrundTest } from './menubaggrund.js';
import { VERDENER } from './skaerme.js';
import { forløbTaget } from './fremgang.js';
import { forløbI } from './data/forloeb/liste.js';
import { åbnForløb } from './gaa.js';

// Verdenerne i ringens rækkefølge og deres dele står i skærmlisten (js/skaerme.js, 10a, og docs/plan-verdener.md).
// Biblioteket er et opslagsværk og står sidst.
export { VERDENER };
const OPSLAG = new Set(['biblioteket']); // står uden for skalaen "mindre … større"
const START = 'vaerksted';
const NØGLE = 'atomlabSidsteDel';
const SYNLIG = 1.6; // kort længere end dette (i kort) fra forreste plads er skjult (de to bagerste står bag atomet)
const FJEDER = 120; // fjederens stivhed, og dæmpningen giver et ganske lille sving
const DÆMPNING = 2 * Math.sqrt(FJEDER) * 0.9;
const ELEKTRONER = [0, 2.3, 4.1]; // startvinkler for lysprikkerne på banen
const HALE = 9; // prikker i halen bag hver lysprik

let menu = null;
let ramme = null;
let kort = []; // verdenernes kort i ringen
let ikoner = [];
let dele = []; // delenes knapper (de gamle menukort) i verdenernes rækkefølge
let midt = -1;
let hentFremgang = () => ({});
let atomRadius = () => 1;
let svg = null;
let gulv = null;
let elektroner = [];
let geo = null; // banens mål: { cx, cy, rx, ry, b } (i px inde i rammen)
let pos = 0; // ringens drejning (i kort), mål og fart
let mål = 0;
let fart = 0;
let træk = null; // et træk med finger eller mus i gang
let undertrykKlik = false;
let løkke = 0;
let sidstTid = 0;
let tid = 0;
const sidsteFilter = new Map();

// Husker den del, man sidst var i, så karrusellen starter dér
export function gemSidsteDel(id) {
  try { localStorage.setItem(NØGLE, id); } catch { /* ingen lagring */ }
}

function sidsteDel() {
  try { return localStorage.getItem(NØGLE); } catch { return null; }
}

const delAf = (k) => k.getAttribute('href').slice(1);
const verdenAf = (k) => k.dataset.verden;
const N = () => kort.length;
// Afstand i kort fra a til b den korteste vej rundt om ringen (-N/2 … N/2)
const rundt = (d) => ((((d + N() / 2) % N()) + N()) % N()) - N() / 2;
const forrest = () => ((Math.round(pos) % N()) + N()) % N();

// Et lille ikon (det samme som på kortet, skaleret ned)
function lilleIkon(k) {
  const ikon = k.querySelector('.kort-ikon').cloneNode(true);
  ikon.setAttribute('aria-hidden', 'true');
  return ikon;
}

// Et verdenskort: ikon, navn og en linje, og delene (linkene i .menukort i index.html) som knapper. Har verdenen kun én del, dækker delens link hele kortet.
function lavVerden(v, bane) {
  const el = document.createElement('div');
  el.className = 'verden';
  el.dataset.verden = v.id;
  el.setAttribute('role', 'group');
  el.setAttribute('aria-label', v.navn);
  const links = v.dele.map((id) => bane.querySelector(`a[href="#${id}"]`)).filter(Boolean);
  const én = links.length === 1;
  el.classList.toggle('én-del', én);
  const ikon = document.createElement('span');
  ikon.className = `kort-ikon verden-ikon ikon-v-${v.id}`;
  ikon.setAttribute('aria-hidden', 'true');
  const tekst = document.createElement('span');
  tekst.className = 'verden-tekst';
  const navn = document.createElement('strong');
  navn.className = 'verden-navn';
  navn.textContent = v.navn;
  const linje = document.createElement('small');
  linje.textContent = én ? links[0].querySelector('.kort-tekst small').textContent : v.tekst;
  tekst.append(navn, linje);
  el.append(ikon, tekst);
  if (én) {
    // Hele kortet er et link til delen. Delens navn står nederst, så man kan se, hvad man åbner.
    const del = document.createElement('span');
    del.className = 'verden-del';
    del.setAttribute('aria-hidden', 'true');
    del.textContent = `${links[0].querySelector('.kort-tekst strong').textContent} ›`;
    el.append(del);
  }
  const knapper = document.createElement('div');
  knapper.className = 'verden-dele';
  for (const a of links) {
    a.classList.add('verden-knap');
    a.classList.toggle('verden-hel', én);
    a.draggable = false;
    const pil = document.createElement('span');
    pil.className = 'verden-pil';
    pil.setAttribute('aria-hidden', 'true');
    pil.textContent = '›';
    a.append(pil);
    knapper.append(a);
    dele.push(a);
  }
  el.append(knapper);
  return el;
}

export function lavKarrusel({ fremgang, radius }) {
  hentFremgang = fremgang;
  atomRadius = radius;
  menu = document.getElementById('menu');
  menu.classList.add('karrusel-tilstand');
  if (!LAV_KVALITET) menu.classList.add('karrusel-glas');
  const bane = menu.querySelector('.menukort');
  // Verdenernes kort, med delenes links flyttet ind som knapper
  kort = VERDENER.map((v) => lavVerden(v, bane));
  bane.prepend(...kort);

  // Scenen: elektronbanen (SVG), et lys under kortet forrest og kortene
  ramme = document.createElement('div');
  ramme.className = 'karrusel';
  bane.before(ramme);
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('karrusel-bane');
  svg.setAttribute('aria-hidden', 'true');
  gulv = document.createElement('div');
  gulv.className = 'karrusel-gulv';
  ramme.append(svg, gulv, bane);

  // Docken: "mindre … større" over delene efter størrelse, og Ordbogen for sig
  const under = document.createElement('div');
  under.className = 'menu-under';
  const dok = document.createElement('div');
  dok.className = 'menu-dok';
  dok.innerHTML = '<div class="skala-tekst"><span>‹ mindre</span><span>større ›</span></div><div class="menu-ikoner"></div>';
  const række = dok.querySelector('.menu-ikoner');
  const skille = document.createElement('span');
  skille.className = 'dok-skille';
  ikoner = kort.map((k, i) => {
    const knap = document.createElement('button');
    knap.className = 'menu-ikon';
    const navn = VERDENER[i].navn;
    knap.setAttribute('aria-label', navn);
    knap.title = navn;
    knap.dataset.verden = verdenAf(k);
    knap.append(lilleIkon(k));
    knap.addEventListener('click', () => gåTil(i));
    if (OPSLAG.has(verdenAf(k))) række.append(skille);
    række.append(knap);
    return knap;
  });
  const fremgangKnap = document.createElement('button');
  fremgangKnap.className = 'menu-fremgang-knap';
  fremgangKnap.textContent = '★ Din fremgang';
  fremgangKnap.addEventListener('click', visDinFremgang);
  under.append(dok, fremgangKnap);
  ramme.after(under);

  lavTræk();
  lavMenuBaggrund(VERDENER.map((v) => v.motiv), () => pos); // baggrunden skifter med verdenen forrest (K2, K4)

  // Tryk på en verden til siden drejer den frem. I verdenen forrest åbner knapperne delene. Efter et træk tæller "klikket" ikke.
  ramme.addEventListener('click', (h) => {
    const k = h.target.closest('.verden');
    if (undertrykKlik) {
      undertrykKlik = false;
      h.preventDefault();
      return;
    }
    const i = kort.indexOf(k);
    if (i >= 0 && i !== forrest()) {
      h.preventDefault();
      gåTil(i);
    }
  }, true);

  // Musehjulet drejer ét kort ad gangen
  let sum = 0;
  let låstTil = 0;
  ramme.addEventListener('wheel', (h) => {
    h.preventDefault();
    if (h.timeStamp < låstTil) return;
    sum += Math.abs(h.deltaX) > Math.abs(h.deltaY) ? h.deltaX : h.deltaY;
    if (Math.abs(sum) > 30) {
      mål = Math.round(mål) + Math.sign(sum);
      sum = 0;
      låstTil = h.timeStamp + 380;
    }
  }, { passive: false });

  // Piletasterne drejer, når menuen er fremme, og ingen dialog er åben
  addEventListener('keydown', (h) => {
    if (menu.classList.contains('skjult') || document.querySelector('.overlag:not(.skjult)')) return;
    if (h.target.closest?.('input, textarea, select')) return;
    if (h.key !== 'ArrowLeft' && h.key !== 'ArrowRight') return;
    h.preventDefault();
    mål = Math.round(mål) + (h.key === 'ArrowRight' ? 1 : -1);
  });

  // Ny størrelse (fx tabletten drejes): banen og atomets plads regnes forfra
  new ResizeObserver(() => { if (!menu.classList.contains('skjult')) læg(); }).observe(ramme);

  // Dialogen "Din fremgang" lukkes med Luk, et tryk udenfor eller Esc (Esc lukker alle dialoger, main.js)
  const dialog = document.getElementById('dinFremgang');
  dialog.addEventListener('click', (h) => {
    if (h.target === dialog || h.target.closest('[data-luk]')) dialog.classList.add('skjult');
  });
}

// Træk med finger eller mus: ringen følger, og når man slipper, fortsætter den med farten og falder på plads
function lavTræk() {
  ramme.addEventListener('pointerdown', (h) => {
    undertrykKlik = false;
    if (h.button !== 0 || !geo) return;
    træk = { id: h.pointerId, x0: h.clientX, pos0: pos, flyttet: false, prøver: [{ t: h.timeStamp, pos }] };
  });
  ramme.addEventListener('pointermove', (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    const dx = h.clientX - træk.x0;
    if (!træk.flyttet && Math.abs(dx) < 8) return;
    if (!træk.flyttet) {
      træk.flyttet = true;
      try { ramme.setPointerCapture(h.pointerId); } catch { /* fx et kunstigt træk i testene */ }
      ramme.classList.add('trækkes');
    }
    pos = træk.pos0 - dx / (geo.rx * 0.75);
    mål = pos;
    fart = 0;
    træk.prøver.push({ t: h.timeStamp, pos });
    while (træk.prøver.length > 2 && h.timeStamp - træk.prøver[0].t > 100) træk.prøver.shift();
  });
  const slip = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    if (træk.flyttet) {
      // Farten fra de sidste 100 ms. Holdt man stille før man slap, er der ingen fart.
      const nye = træk.prøver.filter((p) => h.timeStamp - p.t <= 100);
      const [a, b] = [nye[0], nye[nye.length - 1]];
      const v = nye.length > 1 && b.t > a.t ? ((b.pos - a.pos) / (b.t - a.t)) * 1000 : 0; // kort pr. sekund
      fart = Math.max(-12, Math.min(12, v));
      const kast = Math.max(-3, Math.min(3, fart * 0.2));
      mål = Math.round(pos + kast);
      undertrykKlik = h.type === 'pointerup';
      ramme.classList.remove('trækkes');
    }
    træk = null;
  };
  ramme.addEventListener('pointerup', slip);
  ramme.addEventListener('pointercancel', slip);
}

// Kaldes fra startMenu (før atomet zoomes ind): banen lægges, og ringen starter på verdenen for den del,
// man sidst var i. Den dels knap har en svag glød og en lille prik.
export function startKarrusel() {
  const sidst = sidsteDel();
  let i = VERDENER.findIndex((v) => v.dele.includes(sidst));
  if (i < 0) i = VERDENER.findIndex((v) => v.dele.includes(START));
  // ✓ (klassen "klaret") på en del, der er klaret, og på en verden, når alle dens dele er klaret.
  // En helt ny bruger (ingen opgaver og intet grundstof) får "Start her" på Atomværkstedet.
  const data = hentFremgang();
  const klaret = (id) => Boolean(data[id]) && data[id].løst === data[id].ialt;
  const ny = Object.values(data).every((f) => f.slags === 'set' || f.løst === 0);
  for (const a of dele) {
    a.classList.toggle('sidst', delAf(a) === sidst);
    a.classList.toggle('klaret', klaret(delAf(a)));
    a.classList.toggle('start-her', ny && delAf(a) === START);
  }
  VERDENER.forEach((v, j) => {
    const færdig = v.dele.every(klaret);
    kort[j].classList.toggle('klaret', færdig);
    ikoner[j].classList.toggle('klaret', færdig);
  });
  pos = mål = i;
  fart = 0;
  træk = null;
  midt = -1;
  læg();
  tegn(0);
  cancelAnimationFrame(løkke);
  sidstTid = 0;
  løkke = requestAnimationFrame(trin);
  startMenuBaggrund();
}

export function stopKarrusel() {
  cancelAnimationFrame(løkke);
  stopMenuBaggrund();
}

function gåTil(i) {
  mål = Math.round(pos) + rundt(i - Math.round(pos));
}

// Banens mål og atomets plads. Kortet forrest står nederst i scenen, banen går op rundt om atomet,
// og atomet får et kvadratisk "vindue" (menuVindue), så det står midt i ringen i passende størrelse.
function læg() {
  const S = ramme.getBoundingClientRect();
  if (S.width < 10 || S.height < 10) return;
  const højkant = innerHeight > innerWidth * 1.05;
  const lav = innerHeight < 500;
  const b = kort[0].offsetWidth;
  // Alle verdenerne er lige høje (dem med knapper er højest), og en verden med én del står i midten af sit kort
  for (const k of kort) k.style.minHeight = '';
  const h = Math.max(...kort.map((k) => k.offsetHeight));
  for (const k of kort) k.style.minHeight = `${h}px`;
  const rx = højkant ? Math.max(S.width * 0.45, b * 1.05) : Math.min(S.width * 0.34, 520);
  const anker = Math.min(40, h * 0.3); // kortet hænger i banen så langt under sin overkant
  const forTop = S.height - 14 - h; // kortets overkant forrest
  const yF = forTop + anker;
  // På højkant går banen højere op, så der ikke er tom plads mellem titlen og ringen (jeres runde på tabletten)
  const ry = Math.max(24, Math.min(rx * (højkant ? 0.88 : lav ? 0.22 : 0.3), (yF - S.height * 0.03) / 2));
  const cx = S.width / 2;
  const cy = yF - ry;
  geo = { cx, cy, rx, ry, b, anker };
  for (const k of kort) k.style.transformOrigin = `50% ${anker}px`;

  // Atomet: lidt over banens midte på højkant, ellers i midten
  const ay = cy - (højkant ? 0.2 * ry : 0);
  let D = 2 * ry * (højkant ? 1.0 : 1.2);
  D = Math.min(D, 2 * (ay - 4), 1.8 * rx);
  D = Math.max(D, 60);
  const M = menu.getBoundingClientRect();
  const v = document.getElementById('menuVindue');
  Object.assign(v.style, { left: `${S.left - M.left + cx - D / 2}px`, top: `${S.top - M.top + ay - D / 2}px`, width: `${D}px`, height: `${D}px` });
  centrerVindue();
  passerTil(atomRadius());

  // Elektronbanen: en glødende ellipse, der er klar fortil og svag bagtil, og en svag stiplet ring udenom
  const W = S.width, H = S.height;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<defs>
    <linearGradient id="kbDybde" gradientUnits="userSpaceOnUse" x1="0" y1="${cy - ry}" x2="0" y2="${cy + ry}">
      <stop offset="0" stop-color="#7ff7ff" stop-opacity="0.06"/><stop offset="0.55" stop-color="#8fd8ff" stop-opacity="0.32"/><stop offset="1" stop-color="#c4f9ff" stop-opacity="0.95"/></linearGradient>
    <radialGradient id="kbGlimt"><stop offset="0" stop-color="#e6fdff" stop-opacity="0.95"/><stop offset="0.35" stop-color="#5fe3ff" stop-opacity="0.35"/><stop offset="1" stop-color="#5fe3ff" stop-opacity="0"/></radialGradient>
    <filter id="kbSlør" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="5"/></filter></defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#kbDybde)" stroke-width="7" filter="url(#kbSlør)" opacity="0.55"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#kbDybde)" stroke-width="1.3"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx * 1.04}" ry="${ry * 1.04}" fill="none" stroke="url(#kbDybde)" stroke-width="0.6" opacity="0.35" stroke-dasharray="1 7"/>
    <g class="kb-elektroner"></g>`;
  const g = svg.querySelector('.kb-elektroner');
  const ns = 'http://www.w3.org/2000/svg';
  elektroner = ELEKTRONER.map((v0) => {
    const hale = [];
    for (let j = HALE; j >= 1; j--) {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('r', (1.6 * (1 - j / (HALE + 1)) + 0.4).toFixed(2));
      c.setAttribute('fill', '#bff8ff');
      g.append(c);
      hale.push({ c, j });
    }
    const glimt = document.createElementNS(ns, 'circle');
    glimt.setAttribute('r', '10');
    glimt.setAttribute('fill', 'url(#kbGlimt)');
    const kerne = document.createElementNS(ns, 'circle');
    kerne.setAttribute('r', '2.4');
    kerne.setAttribute('fill', '#fff');
    g.append(glimt, kerne);
    return { v: v0, hale, glimt, kerne };
  });
  Object.assign(gulv.style, { left: `${cx}px`, top: `${forTop + h + 4}px`, width: `${b * 1.3}px` });
  sidsteFilter.clear();
  tegn(0);
}

// Hvert billede: fjederen, kortenes plads og lysprikkerne
function trin(t) {
  løkke = requestAnimationFrame(trin);
  const dt = sidstTid ? Math.min(0.05, (t - sidstTid) / 1000) : 0;
  sidstTid = t;
  tid += dt;
  if (!træk && ROLIG) {
    // "Reducer bevægelse": ringen står straks på plads uden fjeder
    pos = mål;
    fart = 0;
  } else if (!træk) {
    // Fjederen i små skridt, så den er stabil, også når et billede tager lang tid
    for (let s = 0; s < 4; s++) {
      const a = FJEDER * (mål - pos) - DÆMPNING * fart;
      fart += a * (dt / 4);
      pos += fart * (dt / 4);
    }
    if (Math.abs(mål - pos) < 1e-4 && Math.abs(fart) < 1e-3) { pos = mål; fart = 0; }
  }
  tegn(dt);
}

function tegn(dt) {
  if (!geo) return;
  const { cx, cy, rx, ry, b, anker } = geo;
  const skridt = (2 * Math.PI) / N();
  const svæv = !ROLIG;
  kort.forEach((k, i) => {
    const d = rundt(i - pos);
    const ad = Math.abs(d);
    if (ad > SYNLIG) {
      if (k.style.visibility !== 'hidden') k.style.visibility = 'hidden';
      return;
    }
    if (k.style.visibility === 'hidden') k.style.visibility = '';
    const a = d * skridt;
    const dybde = (1 + Math.cos(a)) / 2; // 1 forrest, 0 bagest
    const skala = 0.5 + 0.5 * Math.pow(dybde, 1.3);
    const x = cx + rx * Math.sin(a);
    const y = cy + ry * Math.cos(a) + (svæv ? Math.sin(tid * 0.9 + i * 1.7) * 3.5 : 0);
    k.style.transform = `translate3d(${(x - b / 2).toFixed(1)}px, ${(y - anker).toFixed(1)}px, 0) scale(${skala.toFixed(4)})`;
    k.style.zIndex = String(Math.round(dybde * 100));
    k.style.opacity = ad > SYNLIG - 0.6 ? ((SYNLIG - ad) / 0.6).toFixed(3) : '';
    // Kortene til siden er mørkere (og slørede på pc). Filteret skiftes kun, når det ændrer sig synligt.
    const lys = Math.round((0.35 + 0.65 * Math.pow(dybde, 1.4)) * 50) / 50;
    const slør = !LAV_KVALITET && dybde < 0.8 ? Math.round((0.8 - dybde) * 1.6 * 10) / 10 : 0;
    const filter = lys >= 1 ? '' : `brightness(${lys})${slør ? ` blur(${slør}px)` : ''}`;
    if (sidsteFilter.get(k) !== filter) {
      sidsteFilter.set(k, filter);
      k.style.filter = filter;
    }
  });
  const f = forrest();
  if (f !== midt) sætMidt(f);
  // Lysprikkerne glider langsomt rundt på banen (står stille ved "reducer bevægelse")
  for (const e of elektroner) {
    if (svæv) e.v += dt * 0.32;
    const sted = (v) => [cx + rx * Math.sin(v), cy + ry * Math.cos(v)];
    const [x, y] = sted(e.v);
    const dybde = (1 + Math.cos(e.v)) / 2;
    const lys = (0.3 + 0.7 * dybde).toFixed(3);
    for (const p of [e.glimt, e.kerne]) { p.setAttribute('cx', x.toFixed(1)); p.setAttribute('cy', y.toFixed(1)); p.setAttribute('opacity', lys); }
    for (const { c, j } of e.hale) {
      const [hx, hy] = sted(e.v - j * 0.035);
      c.setAttribute('cx', hx.toFixed(1));
      c.setAttribute('cy', hy.toFixed(1));
      c.setAttribute('opacity', (lys * 0.55 * (1 - j / (HALE + 1))).toFixed(3));
    }
  }
}

function sætMidt(i) {
  midt = i;
  kort.forEach((k, j) => {
    k.classList.toggle('midt', j === i);
    // Kun delene i verdenen forrest kan nås med tabulatortasten
    for (const a of k.querySelectorAll('.verden-knap')) {
      if (j === i) a.removeAttribute('tabindex');
      else a.tabIndex = -1;
    }
  });
  ikoner.forEach((b, j) => b.classList.toggle('valgt', j === i));
  menu.dataset.midt = verdenAf(kort[i]);
}

// Adgang for testene (?test, docs/kode/testadgang.md)
export function testAdgang() {
  return { geo: () => geo, pos: () => pos, stille: () => pos === mål && fart === 0 && !træk, baggrund: baggrundTest, verdener: () => VERDENER.map((v) => ({ id: v.id, dele: [...v.dele] })) };
}

// "Din fremgang": tallene for hver del, som man selv åbner (i stedet for gule piller på alle kort)
const ENHED = { opgaver: 'opgaver', opdaget: 'opdaget', set: 'besøgt' };

function visDinFremgang() {
  const data = hentFremgang();
  const liste = document.getElementById('fremgangListe');
  liste.replaceChildren();
  let løste = 0;
  let opgaver = 0;
  VERDENER.forEach((v, i) => {
    const mine = v.dele.filter((id) => data[id]);
    if (!mine.length) return; // Biblioteket har ingen fremgang
    const hoved = document.createElement('li');
    hoved.className = 'fremgang-verden';
    hoved.dataset.verden = v.id;
    hoved.classList.toggle('færdig', kort[i].classList.contains('klaret'));
    const vIkon = document.createElement('span');
    vIkon.className = 'fremgang-ikon';
    vIkon.append(lilleIkon(kort[i]));
    const vNavn = document.createElement('span');
    vNavn.textContent = v.navn;
    hoved.append(vIkon, vNavn);
    liste.append(hoved);
    for (const id of mine) {
      const f = data[id];
      const k = dele.find((a) => delAf(a) === id);
      if (f.slags === 'opgaver') { løste += f.løst; opgaver += f.ialt; }
      const færdig = f.løst === f.ialt;
      const linje = document.createElement('li');
      linje.className = 'fremgang-linje';
      linje.classList.toggle('færdig', færdig);
      linje.dataset.del = id;
      const ikon = document.createElement('span');
      ikon.className = 'fremgang-ikon';
      ikon.append(lilleIkon(k));
      const navn = document.createElement('span');
      navn.className = 'fremgang-navn';
      navn.textContent = k.querySelector('.kort-tekst strong').textContent;
      const spor = document.createElement('span');
      spor.className = 'fremgang-spor';
      const fyld = document.createElement('span');
      fyld.className = 'fremgang-fyld';
      fyld.style.width = `${Math.round((100 * f.løst) / f.ialt)}%`;
      spor.append(fyld);
      const tal = document.createElement('span');
      tal.className = 'fremgang-tal';
      tal.textContent = `${færdig ? '✓ ' : ''}${f.løst} af ${f.ialt} ${ENHED[f.slags]}`;
      linje.append(ikon, navn, spor, tal);
      liste.append(linje);
      // Delens forløb (js/forloeb.js) med ✓, når det er taget. Et tryk starter det.
      for (const f of forløbI(id)) {
        const taget = forløbTaget(f.id);
        const fl = document.createElement('li');
        fl.className = 'fremgang-forløb';
        fl.classList.toggle('færdig', taget);
        fl.dataset.forloeb = f.id;
        const knap = document.createElement('button');
        knap.innerHTML = '<span class="ff-mærke"></span><span class="ff-navn"></span><span class="ff-tal"></span>';
        knap.querySelector('.ff-mærke').textContent = taget ? '✓' : '▶';
        knap.querySelector('.ff-navn').textContent = `Forløb: ${f.titel}`;
        knap.querySelector('.ff-tal').textContent = taget ? 'taget' : 'ikke taget endnu';
        knap.addEventListener('click', () => {
          document.getElementById('dinFremgang').classList.add('skjult');
          åbnForløb(f.del, f.id);
        });
        fl.append(knap);
        liste.append(fl);
      }
    }
  });
  document.getElementById('fremgangIalt').textContent = `I alt ${løste} af ${opgaver} opgaver klaret ★`;
  document.getElementById('dinFremgang').classList.remove('skjult');
}
