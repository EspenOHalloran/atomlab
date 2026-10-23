// Beskeder. Hver slags har sin faste plads, så de ikke dækker det, man skal se på:
// - Undertekster nederst i 3D-billedet fortæller, hvad der sker lige nu. Der er kun én ad gangen,
//   og en ny afløser den gamle. Lange tekster bliver skåret af, og så kan man trykke "Mere".
// - Belønninger (opgave klaret, nyt grundstof) er små piller øverst til højre i 3D-billedet.
//   Tryk på en pille for at læse mere.
// - Store advarsler (fast: true) bliver stående, til man lukker dem.
// - Næsten alt gemmes i loggen (🔔), så man kan læse det igen.
//
// visBesked({ titel, tekst, type, varighed, forsinkelse, fast, trin, log, hvorfor })
//   type: 'info', 'reaktion', 'henfald', 'advarsel', 'fase' (undertekster) eller 'klaret', 'opdaget' (piller)
//   varighed: mindste tid i ms (ellers regnes den ud fra tekstens længde). 0 = bliv stående, til noget nyt kommer.
//   forsinkelse: vent så mange ms, før beskeden vises (så man når at se det, der sker).
//   trin: [nr, ialt] viser små prikker, fx ved faserne i Kosmos.
//   log: false = gem ikke beskeden i loggen.
//   hvorfor: et id i data/hvorfor.js eller { spørgsmål, svar }. Så slutter underteksten med "Hvorfor?",
//   som åbner forklaringen (underteksten selv er kort, se docs/plan-lag.md).

import { lyd } from './lyd.js';
import { visHvorfor, lukHvorfor, vistHvorfor } from './lag.js';

const LOG_NØGLE = 'atomlabLog';
const LOG_MAKS = 40;
const MAKS_PILLER = 2;
const PILLE_TID = 4500;
const IKONER = { info: '💬', reaktion: '✨', henfald: '☢', advarsel: '⚠', fase: '🌌', klaret: '★', opdaget: '🔬' };

let log = { sidstSet: 0, beskeder: [] };
let undertekst = null; // den undertekst, der vises nu: { el, b, timer }
let venter = null; // en undertekst, der venter på, at en stor advarsel bliver lukket
let fuldTekst = false; // har man trykket "Mere", vises hele teksten også i de næste undertekster
const piller = []; // { el, timer }
const kø = []; // piller, der venter på plads
const forsinkede = new Set();
let holdPillerne = false; // mens guiden kører, venter belønningerne

function $(id) {
  return document.getElementById(id);
}

export function lavBeskeder() {
  try {
    const gemt = JSON.parse(localStorage.getItem(LOG_NØGLE));
    if (gemt && Array.isArray(gemt.beskeder)) log = gemt;
  } catch {
    // ingen lagring
  }
  for (const v of document.querySelectorAll('.vindue[data-log]')) lag(v);
  opdaterKlokker();
  const dialog = $('beskedLog');
  dialog.addEventListener('click', (h) => {
    if (h.target === dialog || h.target.closest('[data-luk]')) dialog.classList.add('skjult');
  });
  $('logRyd').addEventListener('click', () => {
    lyd.klik();
    log.beskeder = [];
    gemLog();
    visLog();
    opdaterKlokker();
  });
}

export function visBesked(besked) {
  const b = { titel: '', tekst: '', type: 'info', ...besked };
  if (b.forsinkelse > 0) {
    const id = setTimeout(() => {
      forsinkede.delete(id);
      visBesked({ ...b, forsinkelse: 0 });
    }, b.forsinkelse);
    forsinkede.add(id);
    return;
  }
  // Loggen får hele forklaringen med
  if (b.hvorfor && typeof b.hvorfor === 'object') b.logTekst ??= `${b.tekst} ${b.hvorfor.svar}`;
  if (b.log !== false) gemILog(b);
  if (b.type === 'klaret' || b.type === 'opdaget') visPille(b);
  else visUndertekst(b);
}

// Skjuler underteksten (fx når en fase i Kosmos er slut). Med en type skjules den kun, hvis den er af den type.
export function skjulUndertekst(type = null) {
  if (undertekst && (!type || undertekst.b.type === type)) fjernUndertekst();
}

// Guiden beder pillerne vente, så der ikke sker for meget på én gang. Bagefter kommer de.
export function holdPiller(til) {
  holdPillerne = til;
  if (!til && kø.length && !piller.length) visPille(kø.shift()); // resten kommer én ad gangen, når pillerne forsvinder
}

// Fjerner alle beskeder med det samme (når man skifter skærm)
export function rydBeskeder() {
  for (const id of forsinkede) clearTimeout(id);
  forsinkede.clear();
  venter = null;
  kø.length = 0;
  if (undertekst) {
    clearTimeout(undertekst.timer);
    undertekst.el.remove();
    undertekst = null;
  }
  for (const p of piller) {
    clearTimeout(p.timer);
    p.el.remove();
  }
  piller.length = 0;
}

// ---------- Hvor skal beskeden stå? ----------
// I 3D-billedet på den skærm, der vises. Er det rullet væk (på telefoner), står beskeden nederst på skærmen i stedet.
function aktivtVindue() {
  const v = document.querySelector('.skærm:not(.skjult) > .vindue');
  if (!v) return null;
  const r = v.getBoundingClientRect();
  const synlig = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
  return r.width > 150 && synlig > Math.min(r.height, 240) * 0.6 ? v : null;
}

// Et lag oven på 3D-billedet med plads til piller (øverst) og undertekster (nederst)
function lag(v) {
  let l = v.querySelector(':scope > .vindue-lag');
  if (!l) {
    l = document.createElement('div');
    l.className = 'vindue-lag';
    l.innerHTML = '<div class="vindue-top"></div><div class="vindue-bund"></div>';
    v.prepend(l);
  }
  const top = l.querySelector('.vindue-top');
  if (!top.querySelector('.piller')) {
    if (v.hasAttribute('data-log')) {
      top.innerHTML = '<button class="logknap" title="Beskeder" aria-label="Se beskederne igen" hidden>🔔<b></b></button>';
      top.querySelector('.logknap').addEventListener('click', åbnLog);
    }
    top.insertAdjacentHTML('beforeend', '<div class="piller"></div>');
  }
  return l;
}

// Et fast sted nederst i et 3D-vindue, lige over underteksterne (fx Stjerneovnens pausemærke)
export function bundIVindue(v) {
  return lag(v).querySelector('.vindue-bund');
}

function bundHolder() {
  const v = aktivtVindue();
  return v ? lag(v).querySelector('.vindue-bund') : $('beskeder');
}

function pilleHolder() {
  const v = aktivtVindue();
  return v ? lag(v).querySelector('.piller') : $('beskeder');
}

// ---------- Undertekster ----------
// Tid til at læse teksten: ca. 15 tegn i sekundet plus lidt ekstra
function læsetid({ titel, tekst }) {
  return Math.min(20000, Math.max(6000, 3000 + 65 * (titel.length + tekst.length)));
}

function visUndertekst(b) {
  // En stor advarsel bliver stående. Almindelige beskeder venter, til den er lukket (kun den nyeste huskes).
  if (undertekst?.b.fast && !b.fast) {
    venter = b;
    return;
  }
  fjernUndertekst(true);
  const el = document.createElement('div');
  el.className = `undertekst ${b.type}${b.fast ? ' fast' : ''}`;
  el.setAttribute('role', b.type === 'advarsel' ? 'alert' : 'status');
  const tekst = document.createElement('p');
  tekst.className = 'ut-tekst';
  if (b.trin) {
    const prikker = document.createElement('span');
    prikker.className = 'ut-trin';
    prikker.title = `Trin ${b.trin[0]} af ${b.trin[1]}`;
    for (let i = 1; i <= b.trin[1]; i++) prikker.append(Object.assign(document.createElement('i'), { className: i <= b.trin[0] ? 'ja' : '' }));
    tekst.append(prikker);
  }
  if (b.titel) {
    const t = document.createElement('strong');
    t.textContent = (b.type === 'advarsel' ? '⚠ ' : '') + b.titel;
    tekst.append(t, ' ');
  }
  tekst.append(b.tekst);
  if (b.hvorfor) {
    const knap = document.createElement('button');
    knap.className = 'hvorfor';
    knap.textContent = 'Hvorfor?';
    if (typeof b.hvorfor === 'string') knap.dataset.hvorfor = b.hvorfor;
    else {
      knap.addEventListener('click', () => {
        lyd.klik();
        if (vistHvorfor() === b.hvorfor.spørgsmål) lukHvorfor();
        else visHvorfor(b.hvorfor, knap);
      });
    }
    tekst.append(' ', knap);
  }
  const knapper = document.createElement('div');
  knapper.className = 'ut-knapper';
  knapper.innerHTML = '<button class="ut-luk" title="Luk" aria-label="Luk">×</button><button class="ut-mere" hidden>Mere</button>';
  el.append(tekst, knapper);
  bundHolder().prepend(el);

  const u = { el, b, timer: null };
  undertekst = u;
  knapper.querySelector('.ut-luk').addEventListener('click', () => fjernUndertekst());
  const mere = knapper.querySelector('.ut-mere');
  mere.addEventListener('click', () => {
    fuldTekst = !el.classList.contains('fuld');
    el.classList.toggle('fuld', fuldTekst);
    mere.textContent = fuldTekst ? 'Mindre' : 'Mere';
    tidtager(u);
  });
  // "Mere" vises kun, hvis teksten er for lang til den forkortede udgave
  const afskåret = tekst.scrollHeight > tekst.clientHeight + 2;
  mere.hidden = !afskåret;
  if (afskåret && fuldTekst) {
    el.classList.add('fuld');
    mere.textContent = 'Mindre';
  }
  // Mens musen er over teksten, bliver den stående
  el.addEventListener('mouseenter', () => clearTimeout(u.timer));
  el.addEventListener('mouseleave', () => tidtager(u, 0.5));
  requestAnimationFrame(() => el.classList.add('vist'));
  tidtager(u);
}

function tidtager(u, faktor = 1) {
  clearTimeout(u.timer);
  if (u.b.fast || u.b.varighed === 0) return; // bliver stående, til den lukkes, eller noget nyt kommer
  const ms = Math.max(u.b.varighed ?? 0, læsetid(u.b) * (u.el.classList.contains('fuld') ? 1.3 : 1)) * faktor;
  u.timer = setTimeout(() => {
    if (undertekst === u) fjernUndertekst();
  }, ms);
}

// straks: fjern uden at tone ud (fordi en ny undertekst tager pladsen)
function fjernUndertekst(straks = false) {
  const u = undertekst;
  if (!u) return;
  undertekst = null;
  clearTimeout(u.timer);
  if (straks) {
    u.el.remove();
    return;
  }
  u.el.classList.remove('vist');
  setTimeout(() => u.el.remove(), 260);
  if (venter) {
    const b = venter;
    venter = null;
    setTimeout(() => {
      if (!undertekst) visUndertekst(b);
    }, 300);
  }
}

// ---------- Piller (belønninger) ----------
function kortTitel(b) {
  return b.kort ?? b.titel.replace(/^Opgave klaret: /, '').replace(/\s*★$/, '');
}

function visPille(b) {
  const holder = pilleHolder();
  // I et lille 3D-billede (fx værkstedet på en telefon) er der kun plads til én ad gangen
  const maks = (holder.closest('.vindue')?.clientHeight ?? 999) < 260 ? 1 : MAKS_PILLER;
  if (piller.length >= maks || holdPillerne) {
    kø.push(b);
    return;
  }
  undgåKort(holder);
  const el = document.createElement('div');
  el.className = `pille ${b.type}`;
  el.setAttribute('role', 'status');
  const knap = document.createElement('button');
  knap.className = 'pille-knap';
  knap.innerHTML = '<span class="pille-ikon"></span><span class="pille-titel"></span><span class="pille-pil" aria-hidden="true">›</span>';
  knap.querySelector('.pille-ikon').textContent = IKONER[b.type];
  knap.querySelector('.pille-titel').textContent = kortTitel(b);
  knap.title = 'Tryk for at læse mere';
  const mere = document.createElement('p');
  mere.className = 'pille-mere';
  mere.textContent = b.tekst;
  el.append(knap, mere);
  holder.append(el);
  const p = { el, timer: null };
  piller.push(p);
  knap.addEventListener('click', () => {
    lyd.klik();
    const åben = el.classList.toggle('åben');
    knap.querySelector('.pille-pil').textContent = åben ? '×' : '›';
    knap.querySelector('.pille-titel').textContent = åben ? b.titel.replace(/\s*★$/, '') : kortTitel(b);
    clearTimeout(p.timer);
    if (åben) p.timer = setTimeout(() => fjernPille(p), 30000);
    else fjernPille(p);
  });
  requestAnimationFrame(() => el.classList.add('vist'));
  p.timer = setTimeout(() => fjernPille(p), PILLE_TID);
  for (const k of document.querySelectorAll('.logknap')) {
    k.classList.remove('ring');
    void k.offsetWidth; // start animationen forfra
    k.classList.add('ring');
  }
}

// Står der et "Næste skridt"-kort øverst til venstre, og er der ikke plads ved siden af det, kommer pillerne under kortet
function undgåKort(holder) {
  const v = holder.closest('.vindue');
  const kort = v?.querySelector('.mission');
  holder.style.marginTop = '';
  if (!kort || !kort.offsetWidth) return;
  const k = kort.getBoundingClientRect();
  const r = v.getBoundingClientRect();
  if (r.right - k.right - 50 < 230) holder.style.marginTop = `${Math.round(k.bottom - holder.parentElement.getBoundingClientRect().top + 6)}px`;
}

function fjernPille(p) {
  const i = piller.indexOf(p);
  if (i < 0) return;
  piller.splice(i, 1);
  clearTimeout(p.timer);
  p.el.classList.remove('vist');
  setTimeout(() => p.el.remove(), 260);
  setTimeout(() => {
    if (kø.length && !holdPillerne) visPille(kø.shift());
  }, 300);
}

// ---------- Loggen (🔔) ----------
function gemLog() {
  try {
    localStorage.setItem(LOG_NØGLE, JSON.stringify(log));
  } catch {
    // ingen lagring
  }
}

function gemILog(b) {
  const vigtig = b.type === 'klaret' || b.type === 'opdaget' || Boolean(b.fast);
  const sidste = log.beskeder[0];
  const tekst = b.logTekst ?? b.tekst;
  if (sidste && sidste.titel === b.titel && sidste.tekst === tekst) {
    // Den samme besked igen: tæl den bare op
    sidste.t = Date.now();
    sidste.gange = (sidste.gange || 1) + 1;
  } else {
    const skærm = document.querySelector('.skærm:not(.skjult) .topbjælke h2')?.textContent ?? '';
    log.beskeder.unshift({ t: Date.now(), titel: b.titel, tekst, type: b.type, skærm, vigtig });
    log.beskeder.length = Math.min(log.beskeder.length, LOG_MAKS);
  }
  gemLog();
  opdaterKlokker();
}

function antalNye() {
  return log.beskeder.filter((b) => b.vigtig && b.t > log.sidstSet).length;
}

function opdaterKlokker() {
  const nye = antalNye();
  for (const k of document.querySelectorAll('.logknap')) {
    k.hidden = log.beskeder.length === 0;
    k.querySelector('b').textContent = nye || '';
    k.title = nye ? `Beskeder (${nye} nye)` : 'Beskeder';
  }
}

function åbnLog() {
  lyd.klik();
  visLog();
  $('beskedLog').classList.remove('skjult');
  log.sidstSet = Date.now();
  gemLog();
  opdaterKlokker();
}

function tidTekst(t) {
  const d = new Date(t);
  const klokken = d.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
  return d.toDateString() === new Date().toDateString() ? klokken : `${d.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' })} ${klokken}`;
}

function visLog() {
  const liste = $('logListe');
  liste.innerHTML = '';
  if (!log.beskeder.length) {
    liste.innerHTML = '<li class="log-tom">Ingen beskeder endnu.</li>';
    return;
  }
  for (const b of log.beskeder) {
    const li = document.createElement('li');
    li.className = b.type + (b.vigtig && b.t > log.sidstSet ? ' ny' : '');
    li.innerHTML = '<span class="log-ikon"></span><strong></strong><p></p><small></small>';
    li.querySelector('.log-ikon').textContent = IKONER[b.type] ?? '💬';
    li.querySelector('strong').textContent = b.titel.replace(/\s*★$/, '');
    li.querySelector('p').textContent = b.tekst;
    li.querySelector('small').textContent = [b.skærm, tidTekst(b.t), b.gange > 1 ? `${b.gange} gange` : ''].filter(Boolean).join(' · ');
    liste.append(li);
  }
}
