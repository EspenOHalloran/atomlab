// Ordbogen (#ordbog): alle fagord fra js/data/ordbog.js i alfabetisk rækkefølge (dansk: æ, ø og å til sidst) med en søgning.
// Teksterne er de samme som i ordforklaringerne. Nogle ord har et link til et sted, hvor de bruges (LINKS).

import { ORDNE, LINKS, søgOrd, forbogstav } from './data/ordbogliste.js';
import { HVORFOR } from './data/hvorfor.js';
import { sætVindue, verden, LAV_KVALITET, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';

const $ = (id) => document.getElementById(id);
let lavet = false;

function linkHTML(id) {
  const l = LINKS[id];
  if (!l) return '';
  const dele = [];
  if (l.hvorfor && HVORFOR[l.hvorfor]) dele.push(`<button class="hvorfor" data-hvorfor="${l.hvorfor}">${HVORFOR[l.hvorfor].spørgsmål}</button>`);
  if (l.skærm) dele.push(`<a class="knap lille" href="#${l.skærm[0]}">${l.skærm[1]} ›</a>`);
  if (l.gaa) dele.push(`<button class="knap lille" data-gaa="${l.gaa[0]}">${l.gaa[1]} ›</button>`);
  return `<p class="ordbog-links">${dele.join('')}</p>`;
}

function vis(liste) {
  const ul = $('ordbogListe');
  ul.innerHTML = liste.map((o) => `<li class="ordbog-ord" id="ord-${o.id}" data-bogstav="${forbogstav(o)}"><h3>${o.ord}</h3><p>${o.tekst}</p>${linkHTML(o.id)}</li>`).join('');
  $('ordbogIngen').hidden = liste.length > 0;
  const søger = $('ordbogSøg').value.trim() !== '';
  $('ordbogAntal').textContent = søger ? `${liste.length} af ${ORDNE.length} fagord` : `${ORDNE.length} fagord`;
  // Bogstaverne virker kun, når der ikke søges
  for (const b of document.querySelectorAll('#ordbogBogstaver button')) b.disabled = søger;
}

export function lavOrdbog() {
  if (lavet) return;
  lavet = true;
  const bogstaver = [...new Set(ORDNE.map(forbogstav))];
  $('ordbogBogstaver').innerHTML = bogstaver.map((b) => `<button class="chip" data-bogstav="${b}">${b}</button>`).join('');
  $('ordbogBogstaver').addEventListener('click', (h) => {
    const b = h.target.closest('button[data-bogstav]');
    if (!b) return;
    lyd.klik();
    document.querySelector(`#ordbogListe li[data-bogstav="${b.dataset.bogstav}"]`)?.scrollIntoView({ block: 'start', behavior: ROLIG ? 'auto' : 'smooth' });
  });
  const søg = $('ordbogSøg');
  søg.addEventListener('input', () => vis(søgOrd(søg.value)));
  søg.addEventListener('keydown', (h) => {
    // Esc tømmer søgningen (og går ikke videre til andre lyttere)
    if (h.key === 'Escape' && søg.value) {
      h.stopPropagation();
      søg.value = '';
      vis(ORDNE);
    }
  });
  vis(ORDNE);
}

export function startOrdbog() {
  sætVindue($('ordbog'));
  verden.styring.autoRotate = true;
  // Med mus og tastatur kan man skrive med det samme (på en tablet ville tastaturet dække skærmen)
  if (!LAV_KVALITET) $('ordbogSøg').focus({ preventScroll: true });
}

export function stopOrdbog() {
  verden.styring.autoRotate = false;
  $('ordbogSøg').blur();
}
