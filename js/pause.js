// Pause til skærme med en simulering (Stjerneovnen og Reaktoren): en knap, mellemrumstasten
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
  vedMellemrum(aktiv, () => (mellemrum ?? pause.skift)());
  return pause;
}

// Mellemrumstasten. Ikke når en dialog er åben, eller man skriver. Står man på en knap, trykker mellemrum på knappen
// som normalt.
function vedMellemrum(aktiv, gør) {
  addEventListener('keydown', (h) => {
    if (h.key !== ' ' || !aktiv() || h.ctrlKey || h.metaKey || h.altKey) return;
    if (document.querySelector('.overlag:not(.skjult)') || h.target.closest?.('input, textarea, select, button, a')) return;
    h.preventDefault();
    gør();
  });
}

// Tidsknappen nederst til højre i 3D-billedet (Kosmos og Solsystemet, docs/plan-ux.md): ⏸ og ▶, og ⏩, hvor scenen
// kan gå hurtigere. holder: elementet, den står i. aktiv(): vises skærmen lige nu? ændret(tilstand): kaldes, når
// tilstanden skifter. Mellemrumstasten skifter mellem pause og det, tiden gik med før (▶ eller ⏩).
// Giver { tilstand, til, sæt(tilstand), hurtig(titel), skift() } tilbage. tilstand er 'pause', 'spil' eller 'hurtig',
// og til er true, mens tiden står stille (som i lavPause). hurtig(titel) viser ⏩ (null skjuler den).
const TIDER = {
  pause: ['<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>', 'Pause (mellemrum)'],
  spil: ['<path d="M7 4l13 8-13 8z"/>', 'Lad tiden gå (mellemrum)'],
  hurtig: ['<path d="M2 5l10 7-10 7zM12 5l10 7-10 7z"/>', 'Hurtigere'],
};
export function lavTidsknap({ holder, aktiv, ændret }) {
  const boks = document.createElement('div');
  boks.className = 'tidsknap';
  boks.setAttribute('role', 'group');
  boks.setAttribute('aria-label', 'Tiden');
  const knapper = {};
  for (const [navn, [tegn, titel]] of Object.entries(TIDER)) {
    const b = Object.assign(document.createElement('button'), { title: titel });
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${tegn}</svg>`;
    b.dataset.tid = navn;
    b.setAttribute('aria-label', titel);
    b.addEventListener('click', () => {
      if (t.tilstand === navn) return;
      lyd.klik();
      t.sæt(navn);
    });
    knapper[navn] = b;
    boks.append(b);
  }
  holder.append(boks);
  let sidst = 'spil'; // det, mellemrum går tilbage til efter en pause

  const t = {
    tilstand: 'spil',
    get til() { return t.tilstand === 'pause'; },
    sæt(tilstand) {
      if (tilstand === 'hurtig' && knapper.hurtig.hidden) tilstand = 'spil';
      const før = t.tilstand;
      t.tilstand = tilstand;
      if (tilstand !== 'pause') sidst = tilstand;
      for (const [navn, b] of Object.entries(knapper)) {
        b.classList.toggle('valgt', navn === tilstand);
        b.setAttribute('aria-pressed', String(navn === tilstand));
      }
      if (før !== tilstand) ændret?.(tilstand);
    },
    // titel: hvad ⏩ gør (fx "ca. 820 gange hurtigere"). null = scenen kan ikke gå hurtigere.
    hurtig(titel) {
      knapper.hurtig.hidden = !titel;
      if (titel) {
        knapper.hurtig.title = `Hurtigere: ${titel}`;
        knapper.hurtig.setAttribute('aria-label', knapper.hurtig.title);
      } else if (t.tilstand === 'hurtig') t.sæt('spil');
      if (!titel) sidst = 'spil';
    },
    skift() {
      lyd.klik();
      t.sæt(t.til ? sidst : 'pause');
    },
  };
  t.hurtig(null);
  t.sæt('spil');
  vedMellemrum(aktiv, () => t.skift());
  return t;
}
