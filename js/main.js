// Start: laver 3D-verdenen og skifter mellem menuen og de forskellige dele.
// Hvilken del der vises, står efter # i adressen (fx index.html#vaerksted).

import { lavVerden, verden, sætVindue, flyInd, stopKamera, centrerVindue, nulstilStyring } from './scene3d.js';
import { Atom } from './atom.js';
import { lyd, lydErTændt, skiftLyd } from './lyd.js';
import * as fremgang from './fremgang.js';
import { OPGAVER, OPGAVER_FUSION, OPGAVER_REAKTOR, OPGAVER_BATTERI } from './data/opgaver.js';
import { OPGAVER_LIV } from './data/liv/opskriften.js';
import { OPGAVER_BYTTE } from './data/molekyler.js'; // "Byg et molekyle" tæller med i Værkstedet
import { OPGAVER_BYG } from './data/molekyler-byg.js';
import { FÆNOMEN_IDER, setFænomener, flytGemt } from './data/faenomener.js';
import { SKÆRME, skærmMed, hentSkærm, hentetSkærm } from './skaerme.js';
import './gaa.js'; // knapperne med data-gaa virker, før Kosmos og Solsystemet er hentet
import { lavFuldSkærmKnapper } from './fuldskaerm.js';
import { lavBeskeder, rydBeskeder, visBesked, testAdgang as beskederTest } from './beskeder.js';
import { stopGuide } from './guide.js';
import { citatHTML } from './data/citater.js';
import { lavOrdforklaringer, testAdgang as ordTest } from './ordforklaring.js';
import { lavLag, lukHvorfor, vistHvorfor } from './lag.js';
import { lavPaneler, startPaneler, testAdgang as panelTest } from './paneler.js';
import { ORDNE, søgOrd } from './data/ordbogliste.js';
import { lavKarrusel, startKarrusel, stopKarrusel, gemSidsteDel, testAdgang as karrusselTest } from './karrusel.js';
import { lavHentebjælke } from './hentning.js';

// Skærmene står i js/skaerme.js og hentes først, når de åbnes (10a). Menuen er altid hentet.
const MENU = { start: startMenu, stop: stopMenu };
const SKÆRM_IDER = ['menu', ...SKÆRME.map((s) => s.id)];

let aktivSkærm = null;
let aktivModul = null;
let menuAtom = null;

function start() {
  const lærred = document.getElementById('lærred');
  if (!lavVerden(lærred)) {
    document.getElementById('ingen3d').classList.remove('skjult');
    document.getElementById('menu').classList.add('skjult');
    skjulHenter();
    return;
  }

  // Foldeboksene og "Hvorfor?"-kortene (først, så Esc lukker et åbent kort før alt andet)
  lavLag();

  // Et carbonatom, der svæver i menuen
  menuAtom = new Atom();
  menuAtom.sætStraks(6, 6, 6);
  menuAtom.sætStatus('stabil');
  menuAtom.gruppe.visible = false;
  verden.scene.add(menuAtom.gruppe);

  lavBeskeder();
  flytGemt(); // det gemte fra før 26. oktober 2026 flytter fra Kosmos til Solsystemet, før menuen tæller
  lavKarrusel({ fremgang: fremgangPrDel, radius: () => menuAtom.størrelse() }); // menuen som en ring af verdenerne (docs/plan-menu.md)
  lavPaneler();
  lavFuldSkærmKnapper();
  lavRulleTip();
  // Lydknapper på de andre skærme (værkstedet har sin egen)
  for (const knap of document.querySelectorAll('[data-lyd-knap]')) {
    knap.addEventListener('click', () => {
      skiftLyd();
      opdaterLydknapper();
      lyd.klik();
    });
  }
  // Faste citater i hjælpen
  for (const boks of document.querySelectorAll('[data-citat]')) boks.innerHTML = citatHTML(boks.dataset.citat);
  // Fagord, man kan trykke på for at få en kort forklaring
  lavOrdforklaringer();
  addEventListener('hashchange', visSkærm);
  // På små skærme kan man rulle i en skærm. Så skal 3D-billedet følge med hullet.
  for (const skærm of document.querySelectorAll('.skærm')) {
    let venter = false;
    skærm.addEventListener('scroll', () => {
      if (venter) return;
      venter = true;
      requestAnimationFrame(() => { venter = false; centrerVindue(); });
    }, { passive: true });
  }
  // Esc lukker hjælp og andre dialoger
  addEventListener('keydown', (h) => {
    if (h.key === 'Escape') document.querySelectorAll('.overlag').forEach((o) => o.classList.add('skjult'));
  });
  // Den første skærm (fx et link direkte til #solsystem) hentes, før bjælken "Henter AtomLab" forsvinder.
  // Adgangen for automatiske tests kommer først bagefter, så testene ved, at skærmen er klar.
  visSkærm().then(() => {
    if (new URLSearchParams(location.search).has('test')) lavTestAdgang();
    skjulHenter();
  });
}

// Adgang for automatiske tests (?test, docs/kode/testadgang.md). En skærms adgang (fx atomlabTest.fusion) findes først,
// når skærmen er hentet (ellers undefined). atomlabTest.hent(id) henter en skærm uden at åbne den.
function lavTestAdgang() {
  const t = { ord: ordTest(), paneler: panelTest(), beskeder: beskederTest(), hvorfor: { vist: vistHvorfor }, ordbog: { rækkefølge: () => ORDNE.map((o) => o.ord), søg: (t) => søgOrd(t).map((o) => o.ord) }, karrusel: karrusselTest() };
  const adgang = new Map();
  for (const { id } of SKÆRME) {
    if (id in t) continue; // atomlabTest.ordbog er Ordbogens data
    Object.defineProperty(t, id, {
      enumerable: true,
      get() {
        const m = hentetSkærm(id);
        if (!m?.testAdgang) return undefined;
        if (!adgang.has(id)) adgang.set(id, m.testAdgang());
        return adgang.get(id);
      },
    });
  }
  t.hentet = (id) => !!hentetSkærm(id);
  t.hent = (id) => hentSkærm(id).then(() => true);
  t.aktiv = () => aktivSkærm;
  // Sand, når den skærm, # peger på, er hentet og vist (tests/hjaelp.mjs venter på den efter et skift)
  t.klar = () => aktivSkærm === (skærmMed(location.hash.slice(1)) ? location.hash.slice(1) : 'menu');
  window.atomlabTest = t;
}

let skift = 0; // tæller skærmskift, så en langsom hentning ikke viser en skærm, man allerede har forladt
let bjælke = null; // "Henter …", mens en skærm hentes
let bjælkeNr = 0; // det skærmskift, bjælken venter for

async function visSkærm() {
  const navn = location.hash.slice(1);
  const ny = skærmMed(navn) ? navn : 'menu';
  const nr = ++skift;
  if (ny === aktivSkærm) return;
  let modul = ny === 'menu' ? MENU : hentetSkærm(ny);
  if (!modul) {
    // Den gamle skærm står, mens den nye hentes. "Henter …" ses først efter 1 sekund (js/hentning.js).
    bjælke ??= lavHentebjælke();
    bjælkeNr = nr;
    bjælke.vent(`Henter ${skærmMed(ny).titel} …`, () => nr === skift);
    try {
      modul = await hentSkærm(ny);
    } catch (fejl) {
      console.error(fejl);
      if (bjælkeNr === nr) bjælke.færdig();
      if (nr === skift) {
        // Bliv på den skærm, man var på (eller menuen ved start), og sig det. Browseren husker en mislykket import(),
        // så et nyt forsøg på samme side ville fejle igen. Derfor skal siden genindlæses.
        history.replaceState(null, '', aktivSkærm && aktivSkærm !== 'menu' ? `#${aktivSkærm}` : location.pathname + location.search);
        if (!aktivSkærm) await visSkærm();
        visBesked({ titel: `${skærmMed(ny).titel} kunne ikke hentes`, tekst: 'Tjek forbindelsen til nettet, og genindlæs siden.', type: 'advarsel', log: false });
      }
      return;
    }
    if (bjælkeNr === nr) bjælke.færdig();
    if (nr !== skift) return; // man er gået videre, mens skærmen blev hentet
  }
  if (ny !== 'menu') følgRulning(document.getElementById(ny)); // panelerne, skærmen lavede, da den blev bygget
  if (aktivSkærm) aktivModul.stop();
  rydBeskeder(); // beskeder, guiden og "Hvorfor?"-kortet hører til den skærm, de blev vist på
  stopGuide();
  lukHvorfor();
  // Dialoger (fx hjælpen med linket til Ordbogen) hører til den skærm, de blev åbnet på
  document.querySelectorAll('.overlag').forEach((o) => o.classList.add('skjult'));
  for (const id of SKÆRM_IDER) {
    document.getElementById(id).classList.toggle('skjult', id !== ny);
  }
  aktivSkærm = ny;
  aktivModul = modul;
  if (ny !== 'menu') gemSidsteDel(ny);
  stopKamera();
  nulstilStyring();
  opdaterLydknapper();
  startPaneler(ny);
  modul.start();
}

// Paneler, der kan rulles, toner ud forneden, så man kan se, at der er mere (rullebjælkerne er skjult).
// følgRulning(rod) holder øje med panelerne i rod. Kaldes ved start og, når en skærm er hentet og bygget (10a).
const RULLEPANELER = '.side-panel, .byg, .fane, .system-kort, .dialog, .ordbog-liste, #menu, #fusion, #reaktor, #batteri, #liv, #solsystem, #kosmos';
const rullepaneler = new Set();
const tjekRulning = (el) => el.classList.toggle('mere', el.scrollHeight - el.scrollTop - el.clientHeight > 8);
let rulleVenter = false;
function tjekAlleRulning() {
  if (rulleVenter) return;
  rulleVenter = true;
  requestAnimationFrame(() => { rulleVenter = false; rullepaneler.forEach(tjekRulning); });
}
const rulleStørrelse = new ResizeObserver(tjekAlleRulning);

function følgRulning(rod) {
  const nye = [...rod.querySelectorAll(RULLEPANELER)];
  if (rod.matches?.(RULLEPANELER)) nye.push(rod);
  for (const el of nye) {
    if (rullepaneler.has(el)) continue;
    rullepaneler.add(el);
    el.addEventListener('scroll', () => tjekRulning(el), { passive: true });
    rulleStørrelse.observe(el);
  }
  tjekAlleRulning();
}

function lavRulleTip() {
  følgRulning(document.body);
  new MutationObserver(tjekAlleRulning).observe(document.body, { childList: true, subtree: true, characterData: true });
}

function opdaterLydknapper() {
  for (const knap of document.querySelectorAll('[data-lyd-knap], #knapLyd')) knap.textContent = lydErTændt() ? '🔊' : '🔇';
}

function opdaterMenuAtom(dt) {
  menuAtom.opdater(dt);
}

function startMenu() {
  menuAtom.gruppe.visible = true;
  verden.opdateringer.add(opdaterMenuAtom);
  startKarrusel(); // lægger ringen og flytter atomets vindue, før kameraet zoomer ind (✓ og "Start her" står i karrusel.js)
  sætVindue(document.getElementById('menuVindue'));
  verden.styring.autoRotate = true;
  flyInd(menuAtom.størrelse());
}

// Fremgangen i hver del: { id: { løst, ialt, slags } }. Bruges af menuen (✓, "Start her" og "Din fremgang" i karrusel.js).
// Tallene kommer fra js/data/, så skærmene ikke skal hentes for at tælle (10a).
function fremgangPrDel() {
  const ud = {};
  for (const [id, liste] of [['vaerksted', [...OPGAVER, ...OPGAVER_BYG, ...OPGAVER_BYTTE]], ['fusion', OPGAVER_FUSION], ['reaktor', OPGAVER_REAKTOR], ['liv', OPGAVER_LIV], ['batteri', OPGAVER_BATTERI]]) {
    ud[id] = { løst: fremgang.antalLøste(liste.map((o) => o.id)), ialt: liste.length, slags: 'opgaver' };
  }
  ud.system = { løst: fremgang.antalOpdaget(), ialt: 118, slags: 'opdaget' };
  for (const id of ['solsystem', 'kosmos']) {
    const set = setFænomener(id);
    const liste = FÆNOMEN_IDER[id];
    ud[id] = { løst: liste.filter((f) => set.includes(f)).length, ialt: liste.length, slags: 'set' };
  }
  return ud;
}

// Bjælken "Henter AtomLab" (index.html): fyldes helt og tones væk, når det første 3D-billede er tegnet
function skjulHenter() {
  const henter = document.getElementById('henter');
  if (!henter) return;
  document.getElementById('henterFyld').style.width = '100%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    henter.classList.add('færdig');
    setTimeout(() => henter.remove(), 600);
  }));
}

function stopMenu() {
  stopKarrusel();
  menuAtom.gruppe.visible = false;
  verden.opdateringer.delete(opdaterMenuAtom);
}

start();
