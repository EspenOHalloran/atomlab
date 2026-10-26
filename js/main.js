// Start: laver 3D-verdenen og skifter mellem menuen og de forskellige dele.
// Hvilken del der vises, står efter # i adressen (fx index.html#vaerksted).

import { lavVerden, verden, sætVindue, flyInd, stopKamera, centrerVindue, nulstilStyring } from './scene3d.js';
import { Atom } from './atom.js';
import { lavVærksted, startVærksted, stopVærksted, OPGAVER, åbnGrundstof, testAdgang as værkstedTest } from './vaerksted.js';
import { lavSystem, startSystem, stopSystem, testAdgang as systemTest } from './system.js';
import { lavFusion, startFusion, stopFusion, OPGAVER_FUSION, testAdgang as fusionTest } from './fusion.js';
import { lavReaktor, startReaktor, stopReaktor, OPGAVER_REAKTOR, testAdgang as reaktorTest } from './reaktor.js';
import { lavBatteri, startBatteri, stopBatteri, OPGAVER_BATTERI, testAdgang as batteriTest } from './batteri.js';
import { lavKosmos, startKosmos, stopKosmos, FÆNOMENER, testAdgang as kosmosTest } from './kosmos.js';
import { lavSolsystem, startSolsystem, stopSolsystem, FÆNOMENER as SOL_FÆNOMENER, testAdgang as solsystemTest } from './solsystem.js';
import { NØGLER } from './faenomenskaerm.js';
import { lyd, lydErTændt, skiftLyd } from './lyd.js';
import * as fremgang from './fremgang.js';
import { lavFuldSkærmKnapper } from './fuldskaerm.js';
import { lavBeskeder, rydBeskeder } from './beskeder.js';
import { stopGuide } from './guide.js';
import { citatHTML, MENU_CITATER } from './data/citater.js';
import { lavOrdforklaringer, testAdgang as ordTest } from './ordforklaring.js';
import { lavLag, lukHvorfor, vistHvorfor } from './lag.js';
import { lavPaneler, startPaneler, testAdgang as panelTest } from './paneler.js';

const skærme = {
  menu: { start: startMenu, stop: stopMenu },
  vaerksted: { start: startVærksted, stop: stopVærksted },
  system: { start: startSystem, stop: stopSystem },
  fusion: { start: startFusion, stop: stopFusion },
  reaktor: { start: startReaktor, stop: stopReaktor },
  batteri: { start: startBatteri, stop: stopBatteri },
  solsystem: { start: startSolsystem, stop: stopSolsystem },
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

  // Foldeboksene og "Hvorfor?"-kortene (først, så Esc lukker et åbent kort før alt andet)
  lavLag();

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
  lavSolsystem(); // før Kosmos, så det gemte flytter med først
  lavKosmos();
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
  // Adgang for automatiske tests
  if (new URLSearchParams(location.search).has('test')) window.atomlabTest = { ord: ordTest(), vaerksted: værkstedTest(), system: systemTest(), fusion: fusionTest(), reaktor: reaktorTest(), batteri: batteriTest(), kosmos: kosmosTest(), solsystem: solsystemTest(), paneler: panelTest(), hvorfor: { vist: vistHvorfor } };
  visSkærm();
}

function visSkærm() {
  const navn = location.hash.slice(1);
  const ny = skærme[navn] ? navn : 'menu';
  if (ny === aktivSkærm) return;
  if (aktivSkærm) skærme[aktivSkærm].stop();
  rydBeskeder(); // beskeder, guiden og "Hvorfor?"-kortet hører til den skærm, de blev vist på
  stopGuide();
  lukHvorfor();
  for (const id of Object.keys(skærme)) {
    document.getElementById(id).classList.toggle('skjult', id !== ny);
  }
  aktivSkærm = ny;
  stopKamera();
  nulstilStyring();
  opdaterLydknapper();
  startPaneler(ny);
  skærme[ny].start();
}

// Paneler, der kan rulles, toner ud forneden, så man kan se, at der er mere (rullebjælkerne er skjult)
function lavRulleTip() {
  const paneler = [...document.querySelectorAll('.side-panel, .byg, .fane, .system-kort, .dialog, #menu, #fusion, #reaktor, #batteri, #solsystem, #kosmos')];
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
  visFremgangIMenu(ny);
}

// Fremgang på hvert kort i menuen ("3/7 ★"). Når en del er klaret, foreslås næste eventyr:
// den første del i rækkefølgen, der ikke er klaret endnu.
function visFremgangIMenu(ny) {
  const mærke = (id, tekst, færdig) => {
    const kort = document.querySelector(`.menukort a[href="#${id}"]`);
    let m = kort.querySelector('.kort-fremgang');
    if (!m) {
      m = document.createElement('span');
      m.className = 'kort-fremgang';
      kort.querySelector('.kort-tekst strong').after(m);
    }
    m.textContent = tekst;
    m.classList.toggle('færdig', færdig);
    return kort;
  };
  let næste = null;
  let klaret = 0;
  for (const [id, liste] of [['vaerksted', OPGAVER], ['fusion', OPGAVER_FUSION], ['reaktor', OPGAVER_REAKTOR], ['batteri', OPGAVER_BATTERI]]) {
    const løst = fremgang.antalLøste(liste.map((o) => o.id));
    const kort = mærke(id, løst === liste.length ? `✓ ${løst}/${liste.length} ★` : `${løst}/${liste.length} ★`, løst === liste.length);
    if (løst === liste.length) klaret++;
    else if (!næste) næste = kort;
  }
  const opdaget = fremgang.antalOpdaget();
  mærke('system', `${opdaget}/118 opdaget`, opdaget === 118);
  for (const [id, liste] of [['solsystem', SOL_FÆNOMENER], ['kosmos', FÆNOMENER]]) {
    let set = [];
    try { set = JSON.parse(localStorage.getItem(NØGLER[id].set)) || []; } catch { /* ingen lagring */ }
    const antalSet = liste.filter((f) => set.includes(f.id)).length;
    mærke(id, `${antalSet}/${liste.length} set`, antalSet === liste.length);
  }
  for (const k of document.querySelectorAll('.menukort .kort')) k.classList.toggle('næste-eventyr', !ny && klaret > 0 && k === næste);
}

function stopMenu() {
  menuAtom.gruppe.visible = false;
  verden.opdateringer.delete(opdaterMenuAtom);
}

start();
