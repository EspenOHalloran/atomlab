// Ordbogen (#ordbog): alle fagord fra js/data/ordbog.js i alfabetisk rækkefølge (dansk: æ, ø og å til sidst) med en søgning.
// Teksterne er de samme som i ordforklaringerne. Nogle ord har et link til et sted, hvor de bruges (LINKS),
// et par "Hvorfor?" og "Hvordan?" (mere, kun her) og en lille tegning (TEGNINGER).

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

// Plasma: til venstre en gas af hele atomer (elektronerne om kernen), til højre plasma (ioner og løse elektroner).
// Pladserne er faste tal, så tegningen er den samme hver gang.
function plasmaTegning() {
  const atom = (x, y) => `<circle cx="${x}" cy="${y}" r="5" class="t-kerne"/><circle cx="${x}" cy="${y}" r="12" class="t-bane"/>`
    + `<circle cx="${x + 12}" cy="${y}" r="2.6" class="t-elektron"/><circle cx="${x - 8}" cy="${y - 9}" r="2.6" class="t-elektron"/>`;
  const ion = (x, y) => `<circle cx="${x}" cy="${y}" r="6" class="t-kerne"/><text x="${x}" y="${y + 3.5}" class="t-plus">+</text>`;
  const el = (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" class="t-elektron"/>`;
  const fart = (x, y, dx, dy) => `<line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}" class="t-fart"/>`;
  const gas = [[40, 45], [95, 38], [70, 88], [125, 92], [30, 105]].map(([x, y]) => atom(x, y)).join('');
  const ioner = [[215, 45], [270, 40], [245, 92], [300, 95], [205, 108]].map(([x, y]) => ion(x, y)).join('');
  const frie = [[235, 30, -10, -4], [290, 62, 9, 5], [228, 70, -8, 7], [262, 115, 10, -3], [312, 40, 4, 9], [200, 80, -9, -6], [280, 82, -6, -9], [222, 120, 9, 3], [255, 60, 7, -8], [318, 112, -3, 8]]
    .map(([x, y, dx, dy]) => fart(x, y, dx, dy) + el(x, y)).join('');
  return `<figure class="ordbog-tegning"><svg viewBox="0 0 340 150" role="img" aria-label="Til venstre en gas af hele atomer med elektronerne om kernen. Til højre plasma, hvor elektronerne er revet løs og farer rundt for sig selv mellem de plusladede ioner.">`
    + `<rect x="4" y="16" width="155" height="112" rx="10" class="t-boks"/><rect x="181" y="16" width="155" height="112" rx="10" class="t-boks"/>`
    + `<text x="81" y="11" class="t-titel">Gas</text><text x="258" y="11" class="t-titel">Plasma</text>`
    + gas + ioner + frie
    + `<text x="81" y="143" class="t-lille">hele atomer</text><text x="258" y="143" class="t-lille">ioner (+) og løse elektroner</text>`
    + `</svg><figcaption>Forenklet: I rigtigt plasma er der langt flere partikler, og de farer meget hurtigere rundt.</figcaption></figure>`;
}
const TEGNINGER = { plasma: plasmaTegning };

function mereHTML(o) {
  // Tegningen står lige under forklaringen, så den viser det, man lige har læst
  const tegning = o.tegning && TEGNINGER[o.tegning] ? TEGNINGER[o.tegning]() : '';
  return tegning + (o.mere ?? []).map(([sp, svar]) => `<p class="ordbog-mere"><b>${sp}</b> ${svar}</p>`).join('');
}

function vis(liste) {
  const ul = $('ordbogListe');
  ul.innerHTML = liste.map((o) => `<li class="ordbog-ord" id="ord-${o.id}" data-bogstav="${forbogstav(o)}"><h3>${o.ord}</h3><p>${o.tekst}</p>${mereHTML(o)}${linkHTML(o.id)}</li>`).join('');
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
  verden.styring.autoRotate = !ROLIG; // stjernehimlen drejer langsomt bag listen
  // Med mus og tastatur kan man skrive med det samme (på en tablet ville tastaturet dække skærmen)
  if (!LAV_KVALITET) $('ordbogSøg').focus({ preventScroll: true });
}

export function stopOrdbog() {
  verden.styring.autoRotate = false;
  $('ordbogSøg').blur();
}
