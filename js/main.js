// Start: laver 3D-verdenen og skifter mellem menuen og de forskellige dele.
// Hvilken del der vises, står efter # i adressen (fx index.html#vaerksted).

import { lavVerden, verden, sætVindue, passerTil } from './scene3d.js';
import { Atom } from './atom.js';
import { lavVærksted, startVærksted, stopVærksted, OPGAVER } from './vaerksted.js';
import * as fremgang from './fremgang.js';
import { lavFuldSkærmKnapper } from './fuldskaerm.js';

const skærme = {
  menu: { start: startMenu, stop: stopMenu },
  vaerksted: { start: startVærksted, stop: stopVærksted },
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

  lavVærksted();
  lavFuldSkærmKnapper();
  addEventListener('hashchange', visSkærm);
  visSkærm();
}

function visSkærm() {
  const navn = location.hash.slice(1);
  const ny = skærme[navn] ? navn : 'menu';
  if (ny === aktivSkærm) return;
  if (aktivSkærm) skærme[aktivSkærm].stop();
  for (const id of Object.keys(skærme)) {
    document.getElementById(id).classList.toggle('skjult', id !== ny);
  }
  aktivSkærm = ny;
  skærme[ny].start();
}

function opdaterMenuAtom(dt) {
  menuAtom.opdater(dt);
}

function startMenu() {
  menuAtom.gruppe.visible = true;
  verden.opdateringer.add(opdaterMenuAtom);
  sætVindue(document.getElementById('menuVindue'));
  verden.styring.autoRotate = true;
  passerTil(menuAtom.størrelse());
  const løste = fremgang.antalLøste(OPGAVER.map((o) => o.id));
  document.getElementById('menuStatus').textContent =
    `Opdagede grundstoffer: ${fremgang.antalOpdaget()} af 118 · Opgaver klaret: ${løste} af ${OPGAVER.length}`;
}

function stopMenu() {
  menuAtom.gruppe.visible = false;
  verden.opdateringer.delete(opdaterMenuAtom);
}

start();
