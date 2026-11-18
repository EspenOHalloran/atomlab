// Opdagelserne (#opdagelser, del nr. 3 i Biblioteket, status prøve, docs/plan-videnskabsfolk.md): ti bøger om videnskabsfolk
// på en hylde, der også er en tidslinje. En bygget bog står med omslaget frem og åbnes med et tryk. Kun de næste to, der
// skal bygges, står som en grå ryg med navnet og året, og et tryk stiller bogens spørgsmål (E20 fund 6, stilguiden A9).
// Den åbne bog er klodsen i js/bog.js, og bogens tekster hentes med import(), først når den åbnes.
// H1 (16. november 2026): hylden, forsiden og bladringen med tomme opslag. H2: fortællingen som et forløb (Forløb-klodsen
// i js/forloeb.js) i bogens opslag af slags 'scene' med tegningerne fra js/bog/<id>.js. Første gang starter forløbet efter
// "Begynd". Imens er bladringen låst, og Esc går til hylden (og stopper forløbet, så det starter igen næste gang).
// H3 (17. november 2026): trin 4 (ANNULO) og vejene fra "Det så du": Saturns ringe fra kanten i Solsystemet, hele
// anagrammet (opslaget "Hemmeligheden") og ringen, man selv drejer. H4: Bogen selv (opslaget "Bogen fra 1659" i js/bog.js),
// og den tredje vej bladrer dertil.

import { bogMed, byggede, påHylden, rygLinje, HYLDE_LINJE } from './data/opdagelser.js';
import { forløbMed, forløbI } from './data/forloeb/liste.js';
import { sætVindue, verden, ROLIG, LAV_KVALITET } from './scene3d.js';
import { lyd } from './lyd.js';
import { lavBog } from './bog.js';
import { startForløb, stopForløb, starterSelv, kørerForløb, forløbTest, lavTurKnap } from './forloeb.js';
import { tagVentForløb, åbnFænomen, tagVentBog } from './gaa.js';

const $ = (id) => document.getElementById(id);

// Gåderne, man har løst i bøgerne (et lille ✓, jeres svar 17. november 2026): { bog: tidspunkt } i localStorage
const LØSTE = 'atomlabOpdagelserGaader';
function løste() {
  try { return JSON.parse(localStorage.getItem(LØSTE)) ?? {}; } catch { return {}; }
}
function gemLøst(id) {
  try { localStorage.setItem(LØSTE, JSON.stringify({ ...løste(), [id]: Date.now() })); } catch { /* ingen lagring */ }
}
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

let lavet = false;
let aktiv = false;
let bog = null; // den åbne bog fra lavBog (eller null på hylden)
let åbnerNr = 0; // så en langsom hentning af teksterne ikke åbner en bog, man allerede har forladt
let åben = null; // { b, tekster, scenemodul } for den åbne bog
let tilbageKnap = null; // "‹ Hylden", som flyttes ind i bogens række med "‹" og "›" (så bogen får hele højden)

function rygHTML(b) {
  if (b.bygget) {
    return `<button class="opd-omslag" data-bog="${b.id}" style="--ryg:${b.stil.ryg};--ryg-kant:${b.stil.rygKant};--bog-skrift:${b.stil.skrift}" aria-label="Åbn ${esc(b.navn)}: ${esc(b.titel)}">`
      + `<img src="${esc(b.portræt)}" alt="" width="600" height="750" decoding="async">`
      + `<span class="opd-omslag-titel">${esc(b.titel)}</span><span class="opd-omslag-navn">${esc(b.kort)}</span></button>`;
  }
  return `<button class="opd-ryg" data-bog="${b.id}" aria-label="${esc(rygLinje(b))}">`
    + `<span class="opd-ryg-navn">${esc(b.kort)}</span></button>`;
}

function lavHylde() {
  $('opdHylde').innerHTML = påHylden()
    .map((b) => `<div class="opd-plads${b.bygget ? ' bygget' : ''}" role="listitem">${rygHTML(b)}<span class="opd-år">${b.år}</span></div>`).join('');
  $('opdLinje').textContent = HYLDE_LINJE;
}

function visHylde() {
  åbnerNr++;
  if (kørerForløb()) stopForløb();
  bog?.fjern();
  bog = null;
  åben = null;
  $('opdBogSide').hidden = true;
  $('opdHyldeSide').hidden = false;
  $('opdagelser').classList.remove('bog-åben');
}

// Fortællingens forløb i den åbne bog: bladrer til opslaget med tegningen, låser bladringen og starter forløbet. Når det
// slutter (taget, sprunget over eller stoppet), bliver opslaget et laboratorium (fri).
function startFortælling() {
  const fl = forløbMed(åben?.b.forløb);
  if (!bog || !fl) return false;
  const nr = bog.find('fortaelling');
  if (nr < 0) return false;
  if (bog.nr() !== nr) bog.vis(nr);
  const scene = bog.scene();
  if (!scene) return false;
  bog.lås(true);
  const del = scene.forløbDel(fl);
  // "Det så du": en linje og tre veje (drejebogen afsnit 3, trin 5). Laboratoriet med ringen står stadig i opslaget, når
  // man bladrer tilbage.
  // Den røde tråd (18. november 2026): Den vigtige vej er hemmeligheden på næste opslag, og sætningen fra 1659 står ikke
  // her, for den er svaret dér. Saturn står også som den vigtige knap i "Om Huygens".
  const v = åben.tekster.VEJE;
  del.slutTekst = () => v.sætning;
  del.veje = [
    { tekst: v.anagram, primær: true, gør: () => visOpslag('gaaden') },
    { tekst: v.bog, gør: () => visOpslag('bogen') },
    { tekst: v.saturn, gør: () => åbnFænomen('solsystem', 'saturn', 'kanten') },
  ];
  del.slut = () => {
    bog?.lås(false);
    if (bog?.scene() === scene) scene.fri();
  };
  startForløb(fl, del);
  return true;
}

// Bladrer til et opslag i den åbne bog (fx "Hemmeligheden" fra "Det så du")
function visOpslag(id) {
  const nr = bog?.find(id) ?? -1;
  if (nr >= 0 && bog.nr() !== nr) {
    bog.vis(nr);
    lyd.klik();
  }
}

async function åbnBog(id, { fortælling = false } = {}) {
  const b = bogMed(id);
  if (!b?.bygget) return false;
  const nr = ++åbnerNr;
  const [tekster, scenemodul] = await Promise.all([b.tekster(), b.scene?.() ?? null]);
  if (nr !== åbnerNr || !aktiv) return false;
  bog?.fjern();
  åben = { b, tekster, scenemodul };
  const fl = forløbMed(b.forløb);
  bog = lavBog($('opdBog'), b, tekster, {
    rolig: ROLIG,
    lav: LAV_KVALITET,
    påBladr: () => lyd.klik(),
    // Første gang: "Begynd" starter fortællingen som et forløb. Ellers bladrer den bare til fortællingen.
    påBegynd: () => {
      if (fl && starterSelv(fl)) { lyd.klik(); return startFortælling(); }
      return false;
    },
    lavScene: (o, felt) => {
      if (!scenemodul) return null;
      if (o.id === 'gaaden') {
        return scenemodul.lavGåde(felt, tekster.ANAGRAM, { rolig: ROLIG, tekster: tekster.GÅDE, løst: Boolean(løste()[b.id]), påLøst: () => { lyd.klaret(); gemLøst(b.id); }, påVidere: () => visOpslag('bogen') });
      }
      const scene = scenemodul.lavFortælling(felt, { rolig: ROLIG, tekster: tekster.FRI, anagram: tekster.ANAGRAM, påIgen: () => { lyd.klik(); startFortælling(); } });
      // Uden for forløbet er opslaget et laboratorium
      queueMicrotask(() => { if (!kørerForløb() && bog?.scene() === scene) scene.fri(); });
      return scene;
    },
  });
  $('opdBog').querySelector('.bog-bund').prepend(tilbageKnap);
  $('opdHyldeSide').hidden = true;
  $('opdBogSide').hidden = false;
  $('opdagelser').classList.add('bog-åben');
  $('opdBog').querySelector('.bog-begynd')?.focus({ preventScroll: true });
  if (fortælling) startFortælling();
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
  // "↻ Tur" i toplinjen (E20): åbner bogen og starter fortællingen
  lavTurKnap($('opdagelser'), forløbI('opdagelser'), (fl) => {
    const b = byggede().find((x) => x.forløb === fl.id);
    if (b) åbnBog(b.id, { fortælling: true });
  });
  $('opdHylde').addEventListener('click', (h) => {
    const k = h.target.closest('button[data-bog]');
    if (!k) return;
    lyd.klik();
    const b = bogMed(k.dataset.bog);
    if (b.bygget) åbnBog(b.id);
    else $('opdLinje').textContent = rygLinje(b);
  });
  tilbageKnap = $('opdTilHylden');
  tilbageKnap.addEventListener('click', () => { lyd.klik(); visHylde(); });
  // Esc går fra bogen til hylden, og piletasterne bladrer. Esc lytter i capture-fasen, så en åben dialog ses, før
  // main.js lukker den.
  addEventListener('keydown', (h) => {
    if (!aktiv || !bog || document.querySelector('.overlag:not(.skjult)')) return;
    if (kørerForløb() && h.key !== 'Escape') return; // under forløbet bladrer piletasterne ikke
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
  // Et forløb fra "Din fremgang" (åbnForløb i gaa.js): åbn bogen, og start fortællingen
  const vent = tagVentForløb(byggede().map((b) => b.forløb).filter(Boolean));
  const b = vent && byggede().find((x) => x.forløb === vent);
  if (b) åbnBog(b.id, { fortælling: true });
  // En bog fra en knap et andet sted (data-gaa="opdagelser:huygens", fx citatet ved Saturn)
  else visBog(tagVentBog());
}

// Åbner en bygget bog fra en knap (js/gaa.js). Første gang starter fortællingen efter "Begynd" som normalt
export function visBog(id) {
  if (id && bogMed(id)?.bygget) åbnBog(id);
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
    fortælling: () => startFortælling(),
    scene: () => bog?.scene()?.test ?? null,
    låst: () => $('opdBog').classList.contains('bog-låst'),
    forløb: forløbTest(),
  };
}

// De fælles navne, som skærmlisten (js/skaerme.js) bruger
export { lavOpdagelser as lav, startOpdagelser as start, stopOpdagelser as stop };
