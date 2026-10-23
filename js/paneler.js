// Vis eller skjul panelerne (jeres ønske, se docs/plan-lag.md), så man kan nyde grafikken:
// - En lille fane på kanten af 3D-billedet (‹ og ›) folder panelet på den side væk, og 3D-billedet fylder pladsen.
// - "Kun grafik" (knappen i toplinjen eller tasten G) folder begge paneler væk. Esc eller knappen igen henter dem.
// - Valget huskes for hver skærm (atomlabPaneler), men første gang er panelerne fremme.
// - På højkant står panelerne under 3D-billedet. Der bruges fanerne ikke, og "Kun grafik" viser 3D-billedet på hele skærmen.
// Tilbage i 3D-billedet er underteksten, pausen, "Næste skridt" og det, delen selv har lagt i billedet.

import { centrerVindue } from './scene3d.js';
import { lyd } from './lyd.js';

const NØGLE = 'atomlabPaneler';
// De skærme, der har et panel til venstre, 3D-billedet i midten og et panel til højre
const SKÆRME = {
  vaerksted: { venstre: '#byggepanel', højre: '#infopanel' },
  fusion: { venstre: '.venstre-panel', højre: '.højre-panel' },
  reaktor: { venstre: '.venstre-panel', højre: '.højre-panel' },
  batteri: { venstre: '.venstre-panel', højre: '.højre-panel' },
  kosmos: { venstre: '.venstre-panel', højre: '.højre-panel' },
};
// Samme grænse som i style.css: her står panelerne under 3D-billedet
const STABLET = matchMedia('(max-width: 820px) and (orientation: portrait), (max-width: 820px) and (min-height: 501px)');
const IKON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14M16 5v14"/></svg>';

let tilstand = hent();
let aktiv = null; // den skærm, der vises lige nu

function hent() {
  try {
    return JSON.parse(localStorage.getItem(NØGLE)) || {};
  } catch {
    return {};
  }
}

function gem() {
  try {
    localStorage.setItem(NØGLE, JSON.stringify(tilstand));
  } catch {
    // ingen lagring
  }
}

const valg = (id) => (tilstand[id] ??= { venstre: true, højre: true, kunGrafik: false });

// Sætter klasserne på skærmen ud fra valget og layoutet
function vis(id) {
  const skærm = document.getElementById(id);
  const v = valg(id);
  const stablet = STABLET.matches;
  skærm.classList.toggle('kun-grafik', v.kunGrafik);
  skærm.classList.toggle('skjul-venstre', !stablet && !v.kunGrafik && !v.venstre);
  skærm.classList.toggle('skjul-højre', !stablet && !v.kunGrafik && !v.højre);
  for (const side of ['venstre', 'højre']) {
    const fane = skærm.querySelector(`.panel-fane.${side}`);
    const skjult = v.kunGrafik || !v[side];
    fane.hidden = stablet || v.kunGrafik;
    // Pilen peger den vej, panelet vil glide
    fane.textContent = (side === 'venstre') === skjult ? '›' : '‹';
    const tekst = `${skjult ? 'Vis' : 'Skjul'} panelet til ${side}`;
    fane.title = tekst;
    fane.setAttribute('aria-label', tekst);
    fane.setAttribute('aria-expanded', String(!skjult));
  }
  const knap = skærm.querySelector('.knap-kungrafik');
  knap.classList.toggle('valgt', v.kunGrafik);
  knap.setAttribute('aria-pressed', String(v.kunGrafik));
  knap.title = v.kunGrafik ? 'Vis panelerne (G eller Esc)' : 'Kun grafik (G)';
  // 3D-billedet skal centreres i det nye hul, når layoutet har ændret sig
  requestAnimationFrame(() => centrerVindue());
}

export function skiftKunGrafik(id = aktiv, til = null) {
  if (!SKÆRME[id]) return;
  const v = valg(id);
  v.kunGrafik = til ?? !v.kunGrafik;
  // Kommer panelerne tilbage, så kommer begge
  if (!v.kunGrafik) v.venstre = v.højre = true;
  gem();
  vis(id);
}

export function skiftPanel(id, side) {
  const v = valg(id);
  v[side] = !v[side];
  gem();
  vis(id);
}

export function lavPaneler() {
  for (const id of Object.keys(SKÆRME)) {
    const skærm = document.getElementById(id);
    const vindue = skærm.querySelector('.vindue');
    for (const side of ['venstre', 'højre']) {
      const fane = document.createElement('button');
      fane.className = `panel-fane ${side}`;
      fane.addEventListener('click', () => {
        lyd.klik();
        skiftPanel(id, side);
      });
      vindue.append(fane);
    }
    const knap = document.createElement('button');
    knap.className = 'knap lille ikon knap-kungrafik';
    knap.innerHTML = IKON;
    knap.addEventListener('click', () => {
      lyd.klik();
      skiftKunGrafik(id);
    });
    const fuld = skærm.querySelector('.topknapper .knap-fuldskaerm');
    fuld.before(knap);
  }
  // G slår "Kun grafik" til og fra, og Esc henter panelerne tilbage (men ikke, mens man skriver noget)
  addEventListener('keydown', (h) => {
    if (!aktiv || h.ctrlKey || h.metaKey || h.altKey || h.target.closest?.('input, textarea, select')) return;
    if (document.querySelector('.overlag:not(.skjult)')) return;
    if (h.key === 'g' || h.key === 'G') skiftKunGrafik(aktiv);
    else if (h.key === 'Escape' && valg(aktiv).kunGrafik) skiftKunGrafik(aktiv, false);
  }, true);
  STABLET.addEventListener('change', () => aktiv && vis(aktiv));
}

// Kaldes ved hvert skærmskift (main.js)
export function startPaneler(id) {
  aktiv = SKÆRME[id] ? id : null;
  if (aktiv) vis(aktiv);
}

// Kun til automatiske tests
export function testAdgang() {
  return {
    valg: (id) => ({ ...valg(id) }),
    skiftKunGrafik: (id, til) => skiftKunGrafik(id, til),
    skiftPanel: (id, side) => skiftPanel(id, side),
  };
}
