// Pause til skærme med en simulering (Stjerneovnen, Reaktoren og Kosmos): en knap, mellemrumstasten
// og et lille mærke nederst i 3D-billedet. Kameraet kan stadig drejes, mens tiden står stille.
import { lyd } from './lyd.js';
import { bundIVindue } from './beskeder.js';

// knap: pauseknappen. vindue: 3D-vinduet, hvor mærket skal stå. aktiv(): vises skærmen lige nu?
// mellemrum: hvad mellemrumstasten skal gøre (som standard skifter den pausen).
// Giver { til, sæt(til), skift() } tilbage. til er true, mens tiden står stille.
export function lavPause({ knap, vindue, aktiv, mellemrum }) {
  const mærke = document.createElement('div');
  mærke.className = 'pause-mærke skjult';
  mærke.textContent = '⏸ Pause';
  bundIVindue(vindue).prepend(mærke); // lige over underteksterne
  knap.title = 'Pause (mellemrum)';

  const pause = {
    til: false,
    sæt(til) {
      pause.til = til;
      knap.textContent = til ? '▶ Fortsæt' : '⏸ Pause';
      knap.classList.toggle('valgt', til);
      mærke.classList.toggle('skjult', !til);
    },
    skift() {
      lyd.klik();
      pause.sæt(!pause.til);
    },
  };
  pause.sæt(false);
  knap.addEventListener('click', () => pause.skift());

  addEventListener('keydown', (h) => {
    if (h.key !== ' ' || !aktiv() || h.ctrlKey || h.metaKey || h.altKey) return;
    // Ikke når en dialog er åben, eller man skriver. Står man på en knap, trykker mellemrum på knappen som normalt.
    if (document.querySelector('.overlag:not(.skjult)') || h.target.closest?.('input, textarea, select, button, a')) return;
    h.preventDefault();
    (mellemrum ?? pause.skift)();
  });
  return pause;
}
