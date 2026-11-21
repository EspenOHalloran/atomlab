// Billedet fra Titans jord ("Land med Huygens", spor Måner, M5b, docs/drejebog-maaner.md afsnit 8, trin 3): ESA's
// farvebillede PIA07232 fylder 3D-vinduet (det rigtige billede, ikke en 3D-verden, jeres svar 4). De to sten under midten
// lyser svagt, og et tryk på en sten viser dens størrelse med en lineal (ca. 15 cm og ca. 4 cm, 85 cm fra Huygens).
// Stenenes plads og billedets størrelse står i JORDEN i js/data/maaner/landhuygens.js (målt i billedet). ✕ lukker
// billedet i laboratoriet. Billedet hentes, første gang det vises (ca. 9 KB).

import { JORDEN, KREDIT } from '../data/maaner/landhuygens.js';

const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);

export function lavJordbillede({ vindue, påMålt, påLuk }) {
  const el = document.createElement('div');
  el.className = 'ui-lh-jorden';
  el.hidden = true;
  const sten = JORDEN.sten.map((st) => `
    <button type="button" class="lh-sten" data-sten="${st.id}" style="left:${st.x}%;top:${st.y}%;width:${st.b}%;height:${st.h}%"
      aria-label="Stenen ${st.id === 'stor' ? 'til venstre' : 'i midten'}. Tryk for at måle den"></button>
    <div class="lh-lineal" data-sten="${st.id}" style="left:${st.x}%;top:${st.y + st.h + 0.8}%;width:${st.b}%" hidden><span>ca. ${st.cm} cm</span></div>`).join('');
  el.innerHTML = `<div class="lh-foto" style="aspect-ratio:${JORDEN.bredde} / ${JORDEN.højde}">
      <img alt="Huygens' billede fra Titans jord: små runde sten på en flad, brun jord og en lys, orange himmel">${sten}
    </div>
    <p class="lh-foto-tekst"><b>Huygens' billede fra jorden</b> Stenene er ca. ${JORDEN.afstandCm} cm fra Huygens. Farverne er lagt på bagefter. <small>${KREDIT}</small></p>
    <button type="button" class="lh-luk" aria-label="Luk billedet" title="Luk billedet">✕</button>`;
  vindue.append(el);
  const img = el.querySelector('img');
  const målt = new Set();

  function mål(id) {
    if (målt.has(id) || el.hidden) return;
    målt.add(id);
    el.querySelector(`.lh-sten[data-sten="${id}"]`).classList.add('målt');
    el.querySelector(`.lh-lineal[data-sten="${id}"]`).hidden = false;
    påMålt?.(id);
  }
  el.addEventListener('click', (h) => {
    const b = h.target.closest('.lh-sten');
    if (b) mål(b.dataset.sten);
    else if (h.target.closest('.lh-luk')) påLuk?.();
  });

  return {
    el,
    målt,
    get vist() { return !el.hidden; },
    // til: vis eller skjul. luk: om ✕ skal være der (kun i laboratoriet)
    vis(til, { luk = false } = {}) {
      if (til && !img.src) img.src = new URL(JORDEN.fil, MAPPE).href;
      el.hidden = !til;
      el.classList.toggle('med-luk', luk);
      if (til) requestAnimationFrame(() => el.classList.add('vis'));
      else el.classList.remove('vis');
    },
    // Glemmer, hvilke sten der er målt (et nyt forsøg)
    nulstil() {
      målt.clear();
      el.querySelectorAll('.lh-sten').forEach((b) => b.classList.remove('målt'));
      el.querySelectorAll('.lh-lineal').forEach((l) => { l.hidden = true; });
    },
    mål,
    stop() { el.remove(); },
  };
}
