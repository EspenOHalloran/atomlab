// Forløb-klodsen (Serie 1, skabelonen i docs/fable/E3-forloeb.md): fører brugeren gennem én idé i 3-6 trin.
// Imens er kun scenen og forløbets linje fremme (klassen i-forløb på skærmen skjuler panelerne, opgaverne og kontakterne,
// se style.css). Linjen står under scenen: prikker, Spørg eller Så, gættet, trinets knapper, "‹", "Næste ›" og "Spring over".
//
// Teksterne står som data i js/data/forloeb/ ({ id, del, titel, kernesætning, trin: [{ id, spørg, gæt, gør, så, ord }] }).
// Delen leverer det, der rører scenen, pr. trin-id:
//   start()       sætter scenen op til trinet (kaldes også, når man går tilbage, så den skal kunne gentages)
//   knapper       [{ id, tekst, kugle, gør(), aktiv(), tæller() }]: trinets handling (de eneste knapper, der er fremme)
//   færdig()      er handlingen gjort?
//   visMig()      gør handlingen for brugeren (tilbydes efter ca. 20 sekunder uden noget)
//   vis           CSS-vælgere for det, der skal være fremme i trinet ud over scenen (fx det lille periodiske system)
// og for hele forløbet: slutTekst() (en linje under kernesætningen), veje [{ tekst, primær, gør }] (højst tre veje videre,
// eller { tekst, hvorfor: id } for et "Hvorfor?"-kort), layout() (scenen har fået ny størrelse) og slut() (kaldes, når
// forløbet slutter, springes over eller stoppes).
// Klodsen husker i fremgang.js, om forløbet er taget (✓ i "Din fremgang") eller sprunget over. Uden noget af det starter
// delen forløbet af sig selv (starterSelv).

import { lyd } from './lyd.js';
import { centrerVindue } from './scene3d.js';
import { dæmpPiller, visBesked } from './beskeder.js';
import { lukHvorfor, visHvorfor } from './lag.js';
import * as fremgang from './fremgang.js';

const VIS_MIG_EFTER = 20000; // ms uden noget, før "Vis mig" tilbydes
const SÅ_EFTER = 700; // ms efter handlingen, før Så kommer (man skal nå at se det ske)
const SØG = new URLSearchParams(location.search);
// I de automatiske tests starter et forløb kun af sig selv med ?forloebstart (ellers ville alle Værkstedets tests ramme det)
const SELV_I_TEST = !SØG.has('test') || SØG.has('forloebstart');

let k = null; // det forløb, der kører: { data, del, skærm, linje, nr, fase, gæt, visMig, vist }
let token = 0; // så timere fra et gammelt trin ikke rører et nyt
let poll = null;
let visMigTimer = null;
let såTimer = null;

// Skal forløbet starte af sig selv? Første gang i delen, til man har taget det eller sprunget det over.
export function starterSelv(data) {
  return SELV_I_TEST && !fremgang.forløbTaget(data.id) && !fremgang.forløbSprunget(data.id);
}

export function kørerForløb() {
  return k ? k.data.id : null;
}

export function startForløb(data, del) {
  if (k) afslut({ stille: true });
  const skærm = document.getElementById(data.del);
  lukHvorfor();
  dæmpPiller(true);
  skærm.classList.add('i-forløb');
  const linje = document.createElement('div');
  linje.className = 'forløb-linje';
  linje.setAttribute('role', 'region');
  linje.setAttribute('aria-label', `Forløb: ${data.titel}`);
  linje.addEventListener('click', klik);
  skærm.append(linje);
  k = { data, del, skærm, linje, nr: 0, fase: 'gør', gæt: null, visMig: false, vist: [] };
  gåTil(0);
}

// Kaldes af delens stop (skærmskift): forløbet slutter uden at blive husket som taget eller sprunget over,
// så det starter igen næste gang
export function stopForløb() {
  if (k) afslut({ stille: true });
}

function ryd() {
  token++;
  clearInterval(poll);
  clearTimeout(visMigTimer);
  clearTimeout(såTimer);
  poll = visMigTimer = såTimer = null;
}

function afslut({ sprunget = false, stille = false } = {}) {
  ryd();
  const { data, del, skærm, linje } = k;
  for (const el of k.vist) el.classList.remove('fl-vis');
  k = null;
  linje.remove();
  skærm.classList.remove('i-forløb');
  dæmpPiller(false);
  lukHvorfor();
  if (sprunget) fremgang.markérForløb(data.id, 'sprunget');
  del.slut?.();
  // Scenen får panelerne igen. Ikke ved et skærmskift eller et skift i delen (stille): Så har den nye skærm sit eget kamera.
  if (!stille) {
    requestAnimationFrame(() => {
      centrerVindue();
      del.layout?.();
    });
  }
  if (sprunget && !stille) {
    visBesked({ titel: 'Forløbet er sprunget over', tekst: `Du kan tage "${data.titel}" igen fra listen med opgaver (★) eller fra hjælpen (?).`, varighed: 7000 });
  }
}

const trin = () => k.data.trin[k.nr];
const delTrin = () => k.del.trin[trin().id] ?? {};
const sidste = () => k.nr === k.data.trin.length - 1;

function gåTil(nr) {
  ryd();
  k.nr = Math.max(0, Math.min(nr, k.data.trin.length - 1));
  k.gæt = null;
  k.visMig = false;
  for (const el of k.vist) el.classList.remove('fl-vis');
  const d = delTrin();
  d.start?.();
  k.vist = (d.vis ?? []).flatMap((v) => [...k.skærm.querySelectorAll(v)]);
  for (const el of k.vist) el.classList.add('fl-vis');
  if (trin().gæt) k.fase = 'gæt';
  else startGør();
  tegn();
  nytLayout();
}

// Scenen har fået en ny størrelse (panelerne er skjult, eller noget er kommet frem): centrér den, og lad delen
// zoome igen (layout), når browseren har lagt siden om
function nytLayout() {
  requestAnimationFrame(() => {
    centrerVindue();
    k?.del.layout?.();
  });
}

// Venter på, at handlingen er gjort, og tilbyder "Vis mig" efter et stykke tid
function startGør() {
  k.fase = 'gør';
  const mit = token;
  const d = delTrin();
  poll = setInterval(() => {
    if (mit !== token || !d.færdig?.()) return;
    clearInterval(poll);
    poll = null;
    clearTimeout(visMigTimer);
    såTimer = setTimeout(() => {
      if (mit !== token) return;
      if (sidste()) {
        k.fase = 'slut';
        fremgang.markérForløb(k.data.id, 'taget');
        lyd.klaret();
      } else k.fase = 'så';
      tegn();
    }, SÅ_EFTER);
  }, 150);
  venteVisMig();
}

function venteVisMig() {
  clearTimeout(visMigTimer);
  const mit = token;
  visMigTimer = setTimeout(() => {
    if (mit !== token || k.fase !== 'gør') return;
    k.visMig = true;
    tegn();
  }, VIS_MIG_EFTER);
}

function klik(h) {
  const b = h.target.closest('button');
  if (!b || !k || b.disabled) return;
  if (b.classList.contains('fagord')) return; // ordforklaringen klarer sig selv
  const d = delTrin();
  if (b.dataset.gaet != null) {
    lyd.klik();
    k.gæt = Number(b.dataset.gaet);
    startGør();
    tegn();
  } else if (b.dataset.knap) {
    const knap = d.knapper?.find((x) => x.id === b.dataset.knap);
    if (!knap) return;
    knap.gør();
    k.visMig = false;
    venteVisMig();
    tegn();
  } else if (b.dataset.nav === 'vismig') {
    lyd.klik();
    k.visMig = false;
    d.visMig?.();
    venteVisMig();
    tegn();
  } else if (b.dataset.nav === 'næste') {
    lyd.klik();
    gåTil(k.nr + 1);
  } else if (b.dataset.nav === 'tilbage') {
    lyd.klik();
    gåTil(k.fase === 'slut' ? k.nr : k.nr - 1);
  } else if (b.dataset.nav === 'spring') {
    lyd.klik();
    afslut({ sprunget: true });
  } else if (b.dataset.vej != null) {
    const vej = k.del.veje?.[Number(b.dataset.vej)];
    if (!vej) return;
    lyd.klik();
    if (vej.hvorfor) return visHvorfor(vej.hvorfor, b);
    afslut({ stille: Boolean(vej.gør) }); // en vej til en anden skærm skal ikke zoome Værkstedet bagefter
    vej.gør?.();
  }
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Bygger linjen ud fra fasen: 'gæt' (Spørg og gættets knapper), 'gør' (Spørg og trinets knapper), 'så' (Så og "Næste ›")
// og 'slut' ("Det så du": kernesætningen og vejene videre)
function tegn() {
  const { data, del, linje } = k;
  const t = trin();
  const d = delTrin();
  const antal = data.trin.length;
  const slut = k.fase === 'slut';
  const prikker = data.trin.map((_, i) => `<i class="${i < k.nr || (i === k.nr && (k.fase === 'så' || slut)) ? 'ja' : ''}${i === k.nr && !slut ? ' nu' : ''}"></i>`).join('');
  let html = `<div class="fl-hoved"><b class="fl-titel">${esc(data.titel)}</b><span class="fl-prikker" aria-hidden="true">${prikker}</span>`
    + `<span class="fl-nr">${slut ? 'Det så du' : `Trin ${k.nr + 1} af ${antal}`}</span>`
    + (slut ? '' : '<button class="fl-spring" data-nav="spring">Spring over</button>') + '</div>';
  const ord = (t.ord ?? []).join(' ');
  let række = '';
  if (k.fase === 'gæt') {
    html += `<p class="fl-tekst" data-ord-kun="${ord}">${esc(t.spørg)} <span class="fl-svag">Gæt først:</span></p>`;
    række = t.gæt.valg.map((v, i) => `<button class="fl-gæt" data-gaet="${i}">${esc(v.tekst)}</button>`).join('');
  } else if (k.fase === 'gør') {
    const efter = k.gæt != null ? ` <span class="fl-svag">${esc(t.gæt.valg[k.gæt].efter)}</span>` : '';
    html += `<p class="fl-tekst" data-ord-kun="${ord}">${esc(t.spørg)}${efter}</p>`;
    række = (d.knapper ?? []).map((b) => {
      const tæller = b.tæller ? ` <small>${esc(b.tæller())}</small>` : '';
      return `<button class="fl-handling ${b.kugle ?? ''}" data-knap="${b.id}"${b.aktiv && !b.aktiv() ? ' disabled' : ''}>`
        + `${b.kugle ? `<span class="kugle ${b.kugle}"></span>` : ''}${esc(b.tekst)}${tæller}</button>`;
    }).join('');
    if (k.visMig && d.visMig) række += '<button class="fl-vismig" data-nav="vismig">Vis mig</button>';
  } else if (k.fase === 'så') {
    html += `<p class="fl-tekst fl-så" data-ord-kun="${ord}">${esc(t.så)}</p>`;
  } else {
    html += `<p class="fl-tekst fl-så" data-ord-kun="">${esc(data.kernesætning)}</p>`;
    if (del.slutTekst) html += `<p class="fl-lille">${esc(del.slutTekst())}</p>`;
    række = (del.veje ?? []).map((v, i) => `<button class="fl-vej${v.primær ? ' primær' : ''}" data-vej="${i}">${esc(v.tekst)}</button>`).join('');
  }
  const nav = (k.nr > 0 || slut ? '<button class="fl-tilbage" data-nav="tilbage" title="Et trin tilbage" aria-label="Et trin tilbage">‹</button>' : '')
    + (k.fase === 'så' ? '<button class="fl-næste" data-nav="næste">Næste ›</button>' : '');
  html += `<div class="fl-række">${række}<span class="fl-nav">${nav}</span></div>`;
  linje.innerHTML = html;
  linje.dataset.fase = k.fase;
}

// Kun til automatiske tests (via delens testAdgang)
export function forløbTest() {
  return {
    kører: () => kørerForløb(),
    trin: () => (k ? k.data.trin[k.nr].id : null),
    nr: () => (k ? k.nr : null),
    fase: () => (k ? k.fase : null),
    visMigNu: () => { if (k && k.fase === 'gør') { k.visMig = true; tegn(); } },
  };
}
