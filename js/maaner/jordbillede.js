// Billedet fra Titans jord ("Land med Huygens", spor Måner, M5b, docs/drejebog-maaner.md afsnit 8, trin 3): ESA's
// farvebillede PIA07232 fylder 3D-vinduet (det rigtige billede, ikke en 3D-verden, jeres svar 4). De to sten under midten
// har en ring, der lyser svagt, med tallene 1 og 2, og et tryk på en sten viser dens størrelse med en lineal (ca. 15 cm og
// ca. 4 cm, 85 cm fra Huygens). Er der plads ved siden af billedet (telefonen på langs), står luppen "Tæt på stenene" dér:
// det samme billede forstørret, med de samme ringe (jeres valg 22. november 2026, den lille sten var ca. 17 × 8 px).
// Stenenes plads, luppens udsnit og billedets størrelse står i JORDEN i js/data/maaner/landhuygens.js (målt i billedet).
// ✕ lukker billedet i laboratoriet. Billedet hentes, første gang det vises (ca. 9 KB).

import { JORDEN, KREDIT } from '../data/maaner/landhuygens.js';

const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const pct = (v) => `${+v.toFixed(3)}%`;

export function lavJordbillede({ vindue, påMålt, påLuk }) {
  const el = document.createElement('div');
  el.className = 'ui-lh-jorden';
  el.hidden = true;
  // Ringene og linealerne (i procent af hele billedet). I luppen er de kopier, som skærmlæseren springer over
  const sten = (kopi) => JORDEN.sten.map((st, i) => `
    <button type="button" class="lh-sten" data-sten="${st.id}" data-nr="${i + 1}" style="left:${st.x}%;top:${st.y}%;width:${st.b}%;height:${st.h}%"
      ${kopi ? 'tabindex="-1" aria-hidden="true"' : `aria-label="Sten ${i + 1}, ${st.id === 'stor' ? 'til venstre' : 'i midten'}. Tryk for at måle den"`}></button>
    <div class="lh-lineal" data-sten="${st.id}" style="left:${st.x}%;top:${st.y + st.h + 0.8}%;width:${st.b}%" hidden><span>ca. ${st.cm} cm</span></div>`).join('');
  // Luppen: hele billedet i en ramme, der kun viser udsnittet (lup), så ringene kan stå samme sted som på billedet
  const { lup } = JORDEN;
  const indre = `left:${pct(-lup.x / lup.b * 100)};top:${pct(-lup.y / lup.h * 100)};width:${pct(10000 / lup.b)};height:${pct(10000 / lup.h)}`;
  el.innerHTML = `<div class="lh-par">
      <div class="lh-foto" style="aspect-ratio:${JORDEN.bredde} / ${JORDEN.højde}">
        <img alt="Huygens' billede fra Titans jord: små runde sten på en flad, brun jord og en lys, orange himmel">${sten(false)}
        <i class="lh-ramme" style="left:${lup.x}%;top:${lup.y}%;width:${lup.b}%;height:${lup.h}%"></i>
      </div>
      <div class="lh-lup" style="aspect-ratio:${+(lup.b * JORDEN.bredde).toFixed(1)} / ${+(lup.h * JORDEN.højde).toFixed(1)}">
        <div class="lh-lup-indre" style="${indre}"><img alt="">${sten(true)}</div>
        <span class="lh-lup-navn">Tæt på stenene</span>
      </div>
    </div>
    <p class="lh-foto-tekst"><b>Huygens' billede fra jorden</b> Stenene er ca. ${JORDEN.afstandCm} cm fra Huygens. Farverne er lagt på bagefter. <small>${KREDIT}</small></p>
    <button type="button" class="lh-luk" aria-label="Luk billedet" title="Luk billedet">✕</button>`;
  vindue.append(el);
  const billeder = el.querySelectorAll('img');
  const målt = new Set();

  function mål(id) {
    if (målt.has(id) || el.hidden) return;
    målt.add(id);
    el.querySelectorAll(`.lh-sten[data-sten="${id}"]`).forEach((b) => b.classList.add('målt'));
    el.querySelectorAll(`.lh-lineal[data-sten="${id}"]`).forEach((l) => { l.hidden = false; });
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
      if (til && !billeder[0].src) billeder.forEach((b) => { b.src = new URL(JORDEN.fil, MAPPE).href; });
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
