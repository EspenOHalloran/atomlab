// Opdagelserne (#opdagelser, del nr. 3 i Biblioteket, status prøve, docs/plan-videnskabsfolk.md): ti bøger om videnskabsfolk
// på en hylde, der også er en tidslinje. En bygget bog står med omslaget frem og åbnes med et tryk. De kommende er en grå
// ryg med navnet og året, og et tryk viser kun én linje. Den åbne bog er klodsen i js/bog.js, og bogens tekster hentes
// med import(), først når den åbnes.
// H1 (16. november 2026): hylden, forsiden og bladringen med tomme opslag. Fortællingen, gåden, Gør det selv og bogen
// selv kommer i H2-H4.

import { BØGER, bogMed, kommerSenere, HYLDE_LINJE } from './data/opdagelser.js';
import { sætVindue, verden, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { lavBog } from './bog.js';

const $ = (id) => document.getElementById(id);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

let lavet = false;
let aktiv = false;
let bog = null; // den åbne bog fra lavBog (eller null på hylden)
let åbnerNr = 0; // så en langsom hentning af teksterne ikke åbner en bog, man allerede har forladt
let tilbageKnap = null; // "‹ Hylden", som flyttes ind i bogens række med "‹" og "›" (så bogen får hele højden)

function rygHTML(b) {
  if (b.bygget) {
    return `<button class="opd-omslag" data-bog="${b.id}" style="--ryg:${b.stil.ryg};--ryg-kant:${b.stil.rygKant};--bog-skrift:${b.stil.skrift}" aria-label="Åbn ${esc(b.navn)}: ${esc(b.titel)}">`
      + `<img src="${esc(b.portræt)}" alt="" width="600" height="750" decoding="async">`
      + `<span class="opd-omslag-titel">${esc(b.titel)}</span><span class="opd-omslag-navn">${esc(b.kort)}</span></button>`;
  }
  return `<button class="opd-ryg" data-bog="${b.id}" aria-label="${esc(b.navn)}, ${b.år}. Kommer senere">`
    + `<span class="opd-ryg-navn">${esc(b.kort)}</span></button>`;
}

function lavHylde() {
  $('opdHylde').innerHTML = [...BØGER].sort((a, b) => a.år - b.år)
    .map((b) => `<div class="opd-plads${b.bygget ? ' bygget' : ''}" role="listitem">${rygHTML(b)}<span class="opd-år">${b.år}</span></div>`).join('');
  $('opdLinje').textContent = HYLDE_LINJE;
}

function visHylde() {
  åbnerNr++;
  bog?.fjern();
  bog = null;
  $('opdBogSide').hidden = true;
  $('opdHyldeSide').hidden = false;
  $('opdagelser').classList.remove('bog-åben');
}

async function åbnBog(id) {
  const b = bogMed(id);
  if (!b?.bygget) return false;
  const nr = ++åbnerNr;
  const tekster = await b.tekster();
  if (nr !== åbnerNr || !aktiv) return false;
  bog?.fjern();
  bog = lavBog($('opdBog'), b, tekster, { rolig: ROLIG, påBladr: () => lyd.klik() });
  $('opdBog').querySelector('.bog-bund').prepend(tilbageKnap);
  $('opdHyldeSide').hidden = true;
  $('opdBogSide').hidden = false;
  $('opdagelser').classList.add('bog-åben');
  $('opdBog').querySelector('.bog-begynd')?.focus({ preventScroll: true });
  return true;
}

// Skriften til 1600-tallets bøger (fonts/KILDER.md). Hentes først, når Opdagelserne åbnes (ikke ved start af AtomLab),
// og med FontFace i stedet for @font-face i style.css. Indtil den er hentet, står overskrifterne med Georgia.
function hentSkrift() {
  if (!window.FontFace || !document.fonts) return;
  const f = new FontFace('AtomLab Fell', "url('fonts/atomlab-fell.woff2') format('woff2')", { display: 'swap' });
  document.fonts.add(f);
  f.load().catch(() => {}); // uden skriften bruges Georgia
}

export function lavOpdagelser() {
  if (lavet) return;
  lavet = true;
  hentSkrift();
  lavHylde();
  $('opdHylde').addEventListener('click', (h) => {
    const k = h.target.closest('button[data-bog]');
    if (!k) return;
    lyd.klik();
    const b = bogMed(k.dataset.bog);
    if (b.bygget) åbnBog(b.id);
    else $('opdLinje').textContent = kommerSenere(b);
  });
  tilbageKnap = $('opdTilHylden');
  tilbageKnap.addEventListener('click', () => { lyd.klik(); visHylde(); });
  // Esc går fra bogen til hylden, og piletasterne bladrer. Esc lytter i capture-fasen, så en åben dialog ses, før
  // main.js lukker den.
  addEventListener('keydown', (h) => {
    if (!aktiv || !bog || document.querySelector('.overlag:not(.skjult)')) return;
    if (h.key === 'Escape') {
      h.preventDefault();
      h.stopPropagation();
      lyd.klik();
      visHylde();
    } else if ((h.key === 'ArrowRight' || h.key === 'ArrowLeft') && !h.target.closest?.('input, textarea')) {
      if (bog.bladr(h.key === 'ArrowRight' ? 1 : -1)) h.preventDefault();
    }
  }, true);
}

export function startOpdagelser() {
  aktiv = true;
  sætVindue($('opdagelser'));
  verden.styring.autoRotate = !ROLIG; // stjernehimlen drejer langsomt bag hylden
  $('opdLinje').textContent = HYLDE_LINJE;
  visHylde();
}

export function stopOpdagelser() {
  aktiv = false;
  visHylde();
  verden.styring.autoRotate = false;
}

export function testAdgang() {
  return {
    vist: () => (bog ? { bog: $('opdBog').dataset.bog, nr: bog.nr(), opslag: bog.opslag(), antal: bog.antal() } : null),
    åbn: åbnBog,
    hylden: visHylde,
    bladr: (r) => bog?.bladr(r) ?? false,
    hylde: () => [...document.querySelectorAll('#opdHylde [data-bog]')].map((k) => ({ id: k.dataset.bog, bygget: k.classList.contains('opd-omslag') })),
  };
}

// De fælles navne, som skærmlisten (js/skaerme.js) bruger
export { lavOpdagelser as lav, startOpdagelser as start, stopOpdagelser as stop };
