// Spring til et fænomen, et grundstof eller en gåde på en anden skærm (fx fra grundstofkortet, Ordbogen eller en tekst i Kosmos).
// Ligger for sig selv og hentes ved start, så knapperne virker, før Kosmos, Solsystemet og Det periodiske system er
// hentet (10a).
import { lyd } from './lyd.js';
import { NØGLER } from './data/faenomener.js';
import { hentetSkærm } from './skaerme.js';

// Et sted i træet, som skærmen skal gå til, når den starter (fx Olympus Mons fra Ordbogen): { skærm, sted }
let ventSted = null;

// Åbner et fænomen på en anden skærm. sted er et sted i fænomenets træ (fx 'olympus'), som kameraet flyver hen til.
export function åbnFænomen(skærm, id, sted) {
  if (id) {
    try { localStorage.setItem(NØGLER[skærm].valgt, id); } catch { /* ingen lagring */ }
  }
  ventSted = sted ? { skærm, sted } : null;
  location.hash = `#${skærm}`;
}

// Grundstoffet, Det periodiske system skal åbne, når det starter (fra en knap data-gaa="system:55" på en anden skærm)
let ventGrundstof = null;
export function tagVentGrundstof() {
  const nr = ventGrundstof;
  ventGrundstof = null;
  return nr;
}

// Gåden, Gåderne skal åbne, når de starter (fra en knap data-gaa="gaader:sorthul" på en anden skærm)
let ventGåde = null;
export function tagVentGåde() {
  const id = ventGåde;
  ventGåde = null;
  return id;
}

// Det sted, skærmen skal gå til, når den starter (eller null). Glemmes, når det er hentet.
export function tagVentSted(skærm) {
  const sted = ventSted?.skærm === skærm ? ventSted.sted : null;
  ventSted = null;
  return sted;
}

// Knapper med data-gaa="skærm:id" (eller bare "skærm", eller "skærm:id:sted") i teksterne åbner et fænomen et andet sted,
// data-gaa="system:55" et grundstof i Det periodiske system og data-gaa="gaader:sorthul" et kort i Gåderne
document.addEventListener('click', (h) => {
  const b = h.target.closest?.('[data-gaa]');
  if (!b) return;
  const [skærm, id, sted] = b.dataset.gaa.split(':');
  if (skærm === 'system') {
    const nr = Number(id);
    if (!(nr >= 1 && nr <= 118)) return;
    lyd.klik();
    if (location.hash === '#system' && hentetSkærm('system')) hentetSkærm('system').visGrundstofFraLink(nr);
    else {
      ventGrundstof = nr;
      location.hash = '#system';
    }
    return;
  }
  if (skærm === 'gaader') {
    lyd.klik();
    if (location.hash === '#gaader' && hentetSkærm('gaader')) hentetSkærm('gaader').visGåde(id);
    else {
      ventGåde = id ?? null;
      location.hash = '#gaader';
    }
    return;
  }
  if (!NØGLER[skærm]) return;
  lyd.klik();
  åbnFænomen(skærm, id, sted);
});

// ---------- Forløb (js/forloeb.js) ----------
// Et forløb, delen skal starte, når den starter: fra "Din fremgang" i menuen eller fra forløbets eget link
// (?forloeb=foerste-atom#vaerksted, fx fra en lærer). Linket starter forløbet, også selvom man har taget det.
let ventForløb = new URLSearchParams(location.search).get('forloeb');

// Starter forløbet id i delen del (en skærm i js/skaerme.js)
export function åbnForløb(del, id) {
  ventForløb = id;
  location.hash = `#${del}`;
}

// Det forløb, der venter på delens forløb (eller null). Glemmes, når det er hentet, og ?forloeb fjernes fra adressen,
// så det ikke starter igen, når man genindlæser siden.
export function tagVentForløb(ider) {
  if (!ventForløb || !ider.includes(ventForløb)) return null;
  const id = ventForløb;
  ventForløb = null;
  const søg = new URLSearchParams(location.search);
  if (søg.has('forloeb')) {
    søg.delete('forloeb');
    const s = søg.toString();
    history.replaceState(history.state, '', location.pathname + (s ? `?${s}` : '') + location.hash);
  }
  return id;
}
