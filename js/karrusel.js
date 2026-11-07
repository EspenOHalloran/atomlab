// Menuen som en karrusel (prototype: kun med ?karrusel i adressen, se docs/plan-menu.md).
// Kortene står efter størrelse og glider vandret. Kortet i midten er i fokus, og dets del står i #menu[data-midt].
// Under kortene står en række ikoner, så man kan hoppe direkte, og knappen "Din fremgang".

import { ROLIG } from './scene3d.js';

export const KARRUSEL = new URLSearchParams(location.search).has('karrusel');

// Fra det mindste til det største (C i plan-menu.md). Ordbogen er et opslagsværk og står sidst.
const RÆKKEFØLGE = ['fusion', 'reaktor', 'vaerksted', 'system', 'batteri', 'solsystem', 'kosmos', 'ordbog'];
const OPSLAG = new Set(['ordbog']); // står uden for skalaen "mindre … større"
const START = 'vaerksted';
const NØGLE = 'atomlabSidsteDel';

let menu = null;
let bane = null;
let kort = [];
let ikoner = [];
let pile = [];
let midt = -1;
let hentFremgang = () => ({});

// Husker den del, man sidst var i, så karrusellen starter dér (gemmes også uden ?karrusel)
export function gemSidsteDel(id) {
  try { localStorage.setItem(NØGLE, id); } catch { /* ingen lagring */ }
}

function sidsteDel() {
  try { return localStorage.getItem(NØGLE); } catch { return null; }
}

const delAf = (k) => k.getAttribute('href').slice(1);

// Et lille ikon (det samme som på kortet, skaleret ned)
function lilleIkon(k) {
  const ikon = k.querySelector('.kort-ikon').cloneNode(true);
  ikon.setAttribute('aria-hidden', 'true');
  return ikon;
}

export function lavKarrusel({ fremgang }) {
  if (!KARRUSEL) return;
  hentFremgang = fremgang;
  menu = document.getElementById('menu');
  menu.classList.add('karrusel-tilstand');
  bane = menu.querySelector('.menukort');
  for (const id of RÆKKEFØLGE) {
    const k = bane.querySelector(`a[href="#${id}"]`);
    if (k) bane.append(k);
  }
  kort = [...bane.querySelectorAll('a.kort')];

  // Rammen med pilene til højre og venstre
  const ramme = document.createElement('div');
  ramme.className = 'karrusel';
  bane.before(ramme);
  const lavPil = (tekst, navn, retning, klasse) => {
    const pil = document.createElement('button');
    pil.className = `knap karrusel-pil ${klasse}`;
    pil.textContent = tekst;
    pil.setAttribute('aria-label', navn);
    pil.addEventListener('click', () => gåTil(midt + retning));
    return pil;
  };
  pile = [lavPil('‹', 'Forrige del', -1, 'venstre'), lavPil('›', 'Næste del', 1, 'højre')];
  ramme.append(pile[0], bane, pile[1]);

  // Ikonrækken: "mindre … større" over delene efter størrelse, og Ordbogen for sig
  const under = document.createElement('div');
  under.className = 'menu-under';
  const række = document.createElement('div');
  række.className = 'menu-ikoner';
  const skala = document.createElement('div');
  skala.className = 'ikon-skala';
  skala.innerHTML = '<div class="skala-tekst"><span>‹ mindre</span><span>større ›</span></div><div class="skala-ikoner"></div>';
  række.append(skala);
  ikoner = kort.map((k, i) => {
    const knap = document.createElement('button');
    knap.className = 'menu-ikon';
    const navn = k.querySelector('.kort-tekst strong').textContent;
    knap.setAttribute('aria-label', navn);
    knap.title = navn;
    knap.dataset.del = delAf(k);
    knap.append(lilleIkon(k));
    knap.addEventListener('click', () => gåTil(i));
    (OPSLAG.has(delAf(k)) ? række : skala.querySelector('.skala-ikoner')).append(knap);
    return knap;
  });
  const fremgangKnap = document.createElement('button');
  fremgangKnap.className = 'knap lille svag menu-fremgang-knap';
  fremgangKnap.textContent = '★ Din fremgang';
  fremgangKnap.addEventListener('click', visDinFremgang);
  under.append(række, fremgangKnap);
  ramme.after(under);

  // Tryk på et kort ved siden af flytter det ind i midten. Kortet i midten åbner delen.
  bane.addEventListener('click', (h) => {
    const k = h.target.closest('a.kort');
    const i = kort.indexOf(k);
    if (i >= 0 && i !== midt) {
      h.preventDefault();
      gåTil(i);
    }
  });
  let venter = false;
  bane.addEventListener('scroll', () => {
    if (venter) return;
    venter = true;
    requestAnimationFrame(() => { venter = false; målMidt(); });
  }, { passive: true });
  // Kun når bredden ændres (fx tabletten drejes). Når menuen bare vises igen, har startKarrusel centreret,
  // og en ny centrering her ville afbryde et tryk på en pil, der allerede er i gang.
  let bredde = 0;
  new ResizeObserver(() => {
    const ny = bane.clientWidth;
    if (!ny) return;
    if (bredde && ny !== bredde && midt >= 0) gåTil(midt, false);
    bredde = ny;
    målMidt();
  }).observe(bane);

  // Musehjulet bladrer ét kort ad gangen. Vandret rul (touchpad) klarer browseren selv.
  let sum = 0;
  let låstTil = 0;
  bane.addEventListener('wheel', (h) => {
    if (Math.abs(h.deltaX) >= Math.abs(h.deltaY)) return;
    h.preventDefault();
    if (h.timeStamp < låstTil) return;
    sum += h.deltaY;
    if (Math.abs(sum) > 30) {
      gåTil(midt + Math.sign(sum));
      sum = 0;
      låstTil = h.timeStamp + 400;
    }
  }, { passive: false });

  // Piletasterne bladrer, når menuen er fremme, og ingen dialog er åben
  addEventListener('keydown', (h) => {
    if (menu.classList.contains('skjult') || document.querySelector('.overlag:not(.skjult)')) return;
    if (h.target.closest?.('input, textarea, select')) return;
    if (h.key !== 'ArrowLeft' && h.key !== 'ArrowRight') return;
    h.preventDefault();
    gåTil(midt + (h.key === 'ArrowRight' ? 1 : -1));
  });

  // Dialogen "Din fremgang" lukkes med Luk, et tryk udenfor eller Esc (Esc lukker alle dialoger, main.js)
  const dialog = document.getElementById('dinFremgang');
  dialog.addEventListener('click', (h) => {
    if (h.target === dialog || h.target.closest('[data-luk]')) dialog.classList.add('skjult');
  });
}

// Kaldes, hver gang menuen vises: start på den del, man sidst var i (ny bruger: Atomværkstedet)
export function startKarrusel() {
  if (!KARRUSEL) return;
  const sidst = sidsteDel();
  let i = kort.findIndex((k) => delAf(k) === sidst);
  if (i < 0) i = kort.findIndex((k) => delAf(k) === START);
  midt = -1;
  gåTil(i, false);
  målMidt();
}

function gåTil(i, glat = true) {
  i = Math.max(0, Math.min(kort.length - 1, i));
  const k = kort[i];
  bane.scrollTo({ left: k.offsetLeft + k.offsetWidth / 2 - bane.clientWidth / 2, behavior: glat && !ROLIG ? 'smooth' : 'auto' });
  if (!glat) sætMidt(i);
}

// Hvor langt hvert kort er fra midten (i kort): styrer størrelse og lysstyrke (--n i style.css)
function målMidt() {
  if (!kort.length || !bane.clientWidth) return;
  const centrum = bane.scrollLeft + bane.clientWidth / 2;
  const mellem = parseFloat(getComputedStyle(bane).columnGap) || 0;
  let bedst = 0;
  let mindst = Infinity;
  kort.forEach((k, i) => {
    const skridt = k.offsetWidth + mellem;
    const afstand = Math.abs(k.offsetLeft + k.offsetWidth / 2 - centrum) / skridt;
    k.style.setProperty('--n', Math.min(afstand, 1).toFixed(3));
    if (afstand < mindst) { mindst = afstand; bedst = i; }
  });
  if (bedst !== midt) sætMidt(bedst);
}

function sætMidt(i) {
  midt = i;
  kort.forEach((k, j) => k.classList.toggle('midt', j === i));
  ikoner.forEach((b, j) => b.classList.toggle('valgt', j === i));
  menu.dataset.midt = delAf(kort[i]);
  pile[0].disabled = i === 0;
  pile[1].disabled = i === kort.length - 1;
}

// "Din fremgang": tallene for hver del, som man selv åbner (i stedet for gule piller på alle kort)
const ENHED = { opgaver: 'opgaver', opdaget: 'opdaget', set: 'besøgt' };

function visDinFremgang() {
  const data = hentFremgang();
  const liste = document.getElementById('fremgangListe');
  liste.replaceChildren();
  let løste = 0;
  let opgaver = 0;
  for (const k of kort) {
    const f = data[delAf(k)];
    if (!f) continue;
    if (f.slags === 'opgaver') { løste += f.løst; opgaver += f.ialt; }
    const færdig = f.løst === f.ialt;
    const linje = document.createElement('li');
    linje.className = 'fremgang-linje';
    linje.classList.toggle('færdig', færdig);
    linje.dataset.del = delAf(k);
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
  }
  document.getElementById('fremgangIalt').textContent = `I alt ${løste} af ${opgaver} opgaver klaret ★`;
  document.getElementById('dinFremgang').classList.remove('skjult');
}
