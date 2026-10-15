// Start: laver 3D-verdenen og skifter mellem menuen og de forskellige dele.
// Hvilken del der vises, står efter # i adressen (fx index.html#vaerksted).

import { lavVerden, verden, sætVindue, flyInd, stopKamera, centrerVindue } from './scene3d.js';
import { Atom } from './atom.js';
import { lavVærksted, startVærksted, stopVærksted, OPGAVER, åbnGrundstof } from './vaerksted.js';
import { lavSystem, startSystem, stopSystem } from './system.js';
import { lavFusion, startFusion, stopFusion, OPGAVER_FUSION, testAdgang as fusionTest } from './fusion.js';
import { lavReaktor, startReaktor, stopReaktor, OPGAVER_REAKTOR, testAdgang as reaktorTest } from './reaktor.js';
import { lavBatteri, startBatteri, stopBatteri, OPGAVER_BATTERI, testAdgang as batteriTest } from './batteri.js';
import { lavKosmos, startKosmos, stopKosmos, testAdgang as kosmosTest } from './kosmos.js';
import { lyd, lydErTændt, skiftLyd } from './lyd.js';
import * as fremgang from './fremgang.js';
import { lavFuldSkærmKnapper } from './fuldskaerm.js';
import { lavBeskeder, rydBeskeder } from './beskeder.js';
import { citatHTML, MENU_CITATER } from './data/citater.js';

const skærme = {
  menu: { start: startMenu, stop: stopMenu },
  vaerksted: { start: startVærksted, stop: stopVærksted },
  system: { start: startSystem, stop: stopSystem },
  fusion: { start: startFusion, stop: stopFusion },
  reaktor: { start: startReaktor, stop: stopReaktor },
  batteri: { start: startBatteri, stop: stopBatteri },
  kosmos: { start: startKosmos, stop: stopKosmos },
};

let aktivSkærm = null;
let menuAtom = null;

function start() {
  const lærred = document.getElementById('lærred');
  if (!lavVerden(lærred)) {
    document.getElementById('ingen3d').classList.remove('skjult');
    document.getElementById('menu').classList.add('skjult');
    return;
  }

  // Et carbonatom, der svæver i menuen
  menuAtom = new Atom();
  menuAtom.sætStraks(6, 6, 6);
  menuAtom.sætStatus('stabil');
  menuAtom.gruppe.visible = false;
  verden.scene.add(menuAtom.gruppe);

  lavBeskeder();
  lavVærksted();
  lavSystem({
    åbnIVærksted: (nr) => {
      åbnGrundstof(nr);
      location.hash = '#vaerksted';
    },
  });
  lavFusion();
  lavReaktor();
  lavBatteri();
  lavKosmos();
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
  // Adgang for automatiske tests
  if (new URLSearchParams(location.search).has('test')) window.atomlabTest = { fusion: fusionTest(), reaktor: reaktorTest(), batteri: batteriTest(), kosmos: kosmosTest() };
  visSkærm();
}

function visSkærm() {
  const navn = location.hash.slice(1);
  const ny = skærme[navn] ? navn : 'menu';
  if (ny === aktivSkærm) return;
  if (aktivSkærm) skærme[aktivSkærm].stop();
  rydBeskeder(); // beskeder hører til den skærm, de blev vist på
  for (const id of Object.keys(skærme)) {
    document.getElementById(id).classList.toggle('skjult', id !== ny);
  }
  aktivSkærm = ny;
  stopKamera();
  opdaterLydknapper();
  skærme[ny].start();
}

// Paneler, der kan rulles, toner ud forneden, så man kan se, at der er mere (rullebjælkerne er skjult)
function lavRulleTip() {
  const paneler = [...document.querySelectorAll('.side-panel, .byg, .fane, .system-kort, .dialog, #menu, #fusion, #reaktor, #batteri, #kosmos')];
  const tjek = (el) => el.classList.toggle('mere', el.scrollHeight - el.scrollTop - el.clientHeight > 8);
  let venter = false;
  const tjekAlle = () => {
    if (venter) return;
    venter = true;
    requestAnimationFrame(() => { venter = false; paneler.forEach(tjek); });
  };
  const størrelse = new ResizeObserver(tjekAlle);
  for (const el of paneler) {
    el.addEventListener('scroll', () => tjek(el), { passive: true });
    størrelse.observe(el);
  }
  new MutationObserver(tjekAlle).observe(document.body, { childList: true, subtree: true, characterData: true });
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
  sætVindue(document.getElementById('menuVindue'));
  verden.styring.autoRotate = true;
  flyInd(menuAtom.størrelse());
  // Et nyt citat hver gang man kommer til menuen
  const nøgle = MENU_CITATER[Math.floor(Math.random() * MENU_CITATER.length)];
  document.getElementById('menuCitat').innerHTML = citatHTML(nøgle);
  const alle = [...OPGAVER, ...OPGAVER_FUSION, ...OPGAVER_REAKTOR, ...OPGAVER_BATTERI].map((o) => o.id);
  document.getElementById('menuStatus').textContent =
    `Opdagede grundstoffer: ${fremgang.antalOpdaget()} af 118 · Opgaver klaret: ${fremgang.antalLøste(alle)} af ${alle.length}`;
  // Er man helt ny, viser et lille mærke, hvor man kan starte
  const ny = fremgang.antalOpdaget() === 0 && fremgang.antalLøste(alle) === 0;
  document.querySelector('.menukort a[href="#vaerksted"]').classList.toggle('start-her', ny);
}

function stopMenu() {
  menuAtom.gruppe.visible = false;
  verden.opdateringer.delete(opdaterMenuAtom);
}

start();
