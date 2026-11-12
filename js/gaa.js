// Spring til et fænomen eller et grundstof på en anden skærm (fx fra grundstofkortet, Ordbogen eller en tekst i Kosmos).
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

// Det sted, skærmen skal gå til, når den starter (eller null). Glemmes, når det er hentet.
export function tagVentSted(skærm) {
  const sted = ventSted?.skærm === skærm ? ventSted.sted : null;
  ventSted = null;
  return sted;
}

// Knapper med data-gaa="skærm:id" (eller bare "skærm", eller "skærm:id:sted") i teksterne åbner et fænomen et andet sted,
// og data-gaa="system:55" et grundstof i Det periodiske system
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
  if (!NØGLER[skærm]) return;
  lyd.klik();
  åbnFænomen(skærm, id, sted);
});
