// Gåderne (#gaader, docs/plan-gaader.md): en side uden 3D i Biblioteket med det, videnskaben ikke ved endnu.
// Først en oversigt over kortene, så ét kort ad gangen: tre trin (Spørg, Gæt, Så) og bagefter "Det så du".
// Teksterne står i js/data/gaader.js. Gættets knapper og prikkerne har samme udseende som forløbene (js/forloeb.js),
// "For nørder" og "Ærligt talt" er de fælles foldebokse (js/lag.js), og "Se det selv" er en data-gaa-knap (js/gaa.js).

import { GÅDER, gådeMed, bygget } from './data/gaader.js';
import { sætVindue, verden, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { lavLagBokse } from './lag.js';
import { tagVentGåde } from './gaa.js';

const NØGLE = 'atomlabGaader'; // { id: tidspunkt } for de kort, man har gjort færdige
const $ = (id) => document.getElementById(id);

let lavet = false;
let gåde = null; // kortet, der vises (eller null i oversigten)
let trin = 0; // 0-2 er trinene, 3 er "Det så du"
let valgt = null; // nummeret på det valgte svar i trinet (eller null, før man har gættet)

function hentFærdige() {
  try {
    const d = JSON.parse(localStorage.getItem(NØGLE));
    return d && typeof d === 'object' ? d : {};
  } catch {
    return {};
  }
}

function gemFærdig(id) {
  const d = hentFærdige();
  if (d[id]) return;
  d[id] = Date.now();
  try { localStorage.setItem(NØGLE, JSON.stringify(d)); } catch { /* ingen lagring */ }
}

// Panelet toner ud forneden, når der er mere at rulle til (klassen mere, som panelerne i js/main.js). Det gøres her,
// fordi indholdet skifter uden at panelet skifter størrelse.
const tjekRulning = () => {
  const p = $('gaaderPanel');
  p.classList.toggle('mere', p.scrollHeight - p.scrollTop - p.clientHeight > 8);
};
const tjekSnart = () => requestAnimationFrame(tjekRulning);

const tegn = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- Oversigten ----------
function visOversigt() {
  gåde = null;
  const færdige = hentFærdige();
  // "Start her" står på det første kort, der er bygget, indtil man har gjort et kort færdigt
  const start = Object.keys(færdige).length ? null : GÅDER.find(bygget)?.id;
  $('gaaderListe').innerHTML = GÅDER.map((g, i) => {
    const klar = bygget(g);
    const mærke = !klar ? '<span class="gaade-mærke senere">Kommer senere</span>'
      : færdige[g.id] ? '<span class="gaade-mærke færdig" title="Du har gjort den færdig">✓</span>'
        : g.id === start ? '<span class="gaade-mærke start">Start her</span>' : '';
    return `<li><button class="gaade-valg${klar ? '' : ' senere'}" data-gaade="${g.id}"${klar ? '' : ' disabled'}>`
      + `<span class="gaade-nr">${i + 1}</span><span class="gaade-tekst"><strong>${tegn(g.spørgsmål)}</strong><small>${tegn(g.linje)}</small></span>${mærke}</button></li>`;
  }).join('');
  $('gaaderOversigt').hidden = false;
  $('gaadeKort').hidden = true;
  $('gaaderPanel').scrollTop = 0;
  tjekSnart();
}

// ---------- Et kort ----------
// Viser en gåde (fra oversigten, fra en knap data-gaa="gaader:id" eller fra testen). En ukendt eller ikke bygget gåde
// giver oversigten.
export function visGåde(id) {
  const g = gådeMed(id);
  if (!bygget(g)) { visOversigt(); return; }
  gåde = g;
  trin = 0;
  valgt = null;
  $('gaaderOversigt').hidden = true;
  const kort = $('gaadeKort');
  kort.hidden = false;
  kort.innerHTML = `
    <button class="knap lille gaade-tilbage" data-alle>‹ Alle gåder</button>
    <h3 class="gaade-spørgsmål">${tegn(g.spørgsmål)}</h3>
    <p class="gaade-dato">${tegn(g.dato)}</p>
    <div class="gaade-trin" id="gaadeTrin" aria-live="polite"></div>
    <div class="gaade-lag">
      ${g.nørd ? `<details class="lag-boks" data-lag="gaade-nørd"><summary><strong>For nørder</strong><span class="lag-kort">Tal, navne og flere detaljer</span></summary>${g.nørd}</details>` : ''}
      ${g.ærligt ? `<details class="lag-boks ærligt" data-lag="gaade-ærligt"><summary><strong>Ærligt talt</strong><span class="lag-kort">Hvad kortet forenkler</span></summary>${g.ærligt}</details>` : ''}
    </div>`;
  lavLagBokse(kort);
  visTrin();
  $('gaaderPanel').scrollTop = 0;
}

function prikker() {
  return `<span class="fl-prikker" aria-hidden="true">${gåde.trin.map((_, i) => `<i class="${i < trin ? 'ja' : i === trin ? 'nu' : ''}"></i>`).join('')}</span>`;
}

function visTrin() {
  tjekSnart();
  const boks = $('gaadeTrin');
  const ord = `data-ord-kun="${gåde.ord.join(' ')}"`;
  if (trin >= gåde.trin.length) {
    // "Det så du": kernen og højst tre veje
    gemFærdig(gåde.id);
    const næste = GÅDER.slice(GÅDER.indexOf(gåde) + 1).find(bygget);
    boks.innerHTML = `
      <div class="gaade-hoved">${prikker()}<span class="gaade-overskrift">Det så du</span></div>
      <p class="fl-tekst fl-så" ${ord}>${tegn(gåde.slut)}</p>
      <div class="fl-række gaade-veje">
        <button class="fl-vej primær" data-gaa="${gåde.seDet[0]}">${tegn(gåde.seDet[1])} ›</button>
        ${næste ? `<button class="fl-vej" data-gaade="${næste.id}">Næste gåde ›</button>` : ''}
        <button class="fl-vej" data-alle>Alle gåder</button>
      </div>
      <div class="fl-række"><span class="fl-nav"><button class="fl-tilbage" data-tilbage aria-label="Et trin tilbage">‹</button></span></div>`;
    return;
  }
  const t = gåde.trin[trin];
  const svar = valgt === null ? '' : `
      <p class="fl-tekst gaade-efter" ${ord}>${tegn(t.gæt.valg[valgt].efter)}</p>
      <p class="fl-tekst fl-så" ${ord}>${tegn(t.så)}</p>`;
  boks.innerHTML = `
    <div class="gaade-hoved">${prikker()}<span class="gaade-overskrift">${trin + 1}. ${tegn(t.overskrift)}</span></div>
    <p class="fl-tekst gaade-spørg" ${ord}>${tegn(t.spørg)}</p>
    <div class="fl-række gaade-gæt">${t.gæt.valg.map((v, i) => `<button class="fl-gæt${i === valgt ? ' valgt' : ''}" data-gaet="${i}"${valgt !== null ? ' disabled' : ''}>${tegn(v.tekst)}</button>`).join('')}</div>
    ${svar}
    <div class="fl-række"><span class="fl-nav">
      ${trin > 0 ? '<button class="fl-tilbage" data-tilbage aria-label="Et trin tilbage">‹</button>' : ''}
      ${valgt !== null ? `<button class="fl-næste" data-naeste>${trin < gåde.trin.length - 1 ? 'Næste ›' : 'Færdig ›'}</button>` : ''}
    </span></div>`;
}

function gæt(i) {
  if (!gåde || trin >= gåde.trin.length || valgt !== null) return;
  if (!(i >= 0 && i < gåde.trin[trin].gæt.valg.length)) return;
  valgt = i;
  visTrin();
  // Det nye svar kan ligge under kanten på en lille skærm
  $('gaadeTrin').querySelector('.fl-næste')?.scrollIntoView({ block: 'nearest', behavior: ROLIG ? 'auto' : 'smooth' });
}

function næste() {
  if (!gåde || valgt === null || trin >= gåde.trin.length) return;
  trin++;
  valgt = null;
  visTrin();
  $('gaadeTrin').scrollIntoView({ block: 'nearest' });
}

function tilbage() {
  if (!gåde || trin === 0) return;
  trin--;
  valgt = null;
  visTrin();
}

export function lavGåder() {
  if (lavet) return;
  lavet = true;
  const panel = $('gaaderPanel');
  panel.addEventListener('scroll', tjekRulning, { passive: true });
  new ResizeObserver(tjekSnart).observe(panel);
  panel.addEventListener('toggle', tjekSnart, true); // en foldeboks, der foldes ud
  panel.addEventListener('click', (h) => {
    const b = h.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.gaa) return; // "Se det selv" klares af js/gaa.js
    lyd.klik();
    if (b.dataset.gaade) visGåde(b.dataset.gaade);
    else if (b.hasAttribute('data-alle')) visOversigt();
    else if (b.dataset.gaet) gæt(Number(b.dataset.gaet));
    else if (b.hasAttribute('data-naeste')) næste();
    else if (b.hasAttribute('data-tilbage')) tilbage();
  });
}

export function startGåder() {
  sætVindue($('gaader'));
  verden.styring.autoRotate = !ROLIG; // stjernehimlen drejer langsomt bag siden, som i Ordbogen
  const id = tagVentGåde();
  if (id) visGåde(id);
  else visOversigt();
}

export function stopGåder() {
  verden.styring.autoRotate = false;
}

export function testAdgang() {
  return {
    vist: () => (gåde ? { id: gåde.id, trin, valgt } : null),
    visGåde,
    gæt,
    næste,
    tilbage,
    færdige: () => Object.keys(hentFærdige()),
  };
}

// De fælles navne, som skærmlisten (js/skaerme.js) bruger
export { lavGåder as lav, startGåder as start, stopGåder as stop };
