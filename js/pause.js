// Tiden i 3D-billedet: tidsknappen (⏸ ▶ ⏩) i Kosmos, Solsystemet, Stjerneovnen og Reaktoren (U2 og U4 i
// docs/plan-ux.md) og mellemrumstasten. Kameraet kan stadig drejes, mens tiden står stille.
import { lyd } from './lyd.js';

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

// Tidsknappen nederst til højre i 3D-billedet: ⏸ og ▶, ⏩, hvor scenen kan gå hurtigere, og en langsom ▷, hvor
// scenen kan gå langsommere (Stjerneovnen). holder: elementet, den står i. aktiv(): vises skærmen lige nu?
// ændret(tilstand): kaldes, når tilstanden skifter. mellemrum: hvad mellemrumstasten skal gøre (som standard skifter
// den mellem pause og det, tiden gik med før). Giver { tilstand, til, sæt(tilstand), hurtig(titel), langsom(titel),
// fortsæt(), skift() } tilbage. tilstand er 'pause', 'langsom', 'spil' eller 'hurtig', og til er true, mens tiden står
// stille. hurtig(titel) og langsom(titel) viser ⏩ og ▷ (null skjuler dem). fortsæt() lader tiden gå igen efter en pause
// (en knap, der starter noget, fx "Skyd neutron" eller "Vis mig").
const TIDER = {
  pause: ['<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>', 'Pause (mellemrum)'],
  langsom: ['<path fill-rule="evenodd" d="M7 4l13 8-13 8zM9.5 8.5v7l5.7-3.5z"/>', 'Langsomt'],
  spil: ['<path d="M7 4l13 8-13 8z"/>', 'Lad tiden gå (mellemrum)'],
  hurtig: ['<path d="M2 5l10 7-10 7zM12 5l10 7-10 7z"/>', 'Hurtigere'],
};
export function lavTidsknap({ holder, aktiv, ændret, mellemrum }) {
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

  // ⏩ og ▷ kan skjules. titel: hvad knappen gør (fx "ca. 820 gange hurtigere"), null = findes ikke her.
  function valgfri(navn, ord, titel) {
    const b = knapper[navn];
    b.hidden = !titel;
    if (titel) {
      b.title = `${ord}: ${titel}`;
      b.setAttribute('aria-label', b.title);
    } else if (t.tilstand === navn) t.sæt('spil');
    if (!titel && sidst === navn) sidst = 'spil';
  }

  const t = {
    tilstand: 'spil',
    get til() { return t.tilstand === 'pause'; },
    sæt(tilstand) {
      if (knapper[tilstand]?.hidden || !knapper[tilstand]) tilstand = 'spil';
      const før = t.tilstand;
      t.tilstand = tilstand;
      if (tilstand !== 'pause') sidst = tilstand;
      for (const [navn, b] of Object.entries(knapper)) {
        b.classList.toggle('valgt', navn === tilstand);
        b.setAttribute('aria-pressed', String(navn === tilstand));
      }
      if (før !== tilstand) ændret?.(tilstand);
    },
    hurtig: (titel) => valgfri('hurtig', 'Hurtigere', titel),
    langsom: (titel) => valgfri('langsom', 'Langsommere', titel),
    fortsæt() {
      if (t.til) t.sæt(sidst);
    },
    skift() {
      lyd.klik();
      t.sæt(t.til ? sidst : 'pause');
    },
  };
  t.hurtig(null);
  t.langsom(null);
  t.sæt('spil');
  vedMellemrum(aktiv, () => (mellemrum ?? t.skift)());
  return t;
}
