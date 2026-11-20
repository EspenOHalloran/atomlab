// Vis eller skjul panelerne (jeres ønske, se docs/plan-lag.md), så man kan nyde grafikken:
// - En lille fane på kanten af 3D-billedet (‹ og ›) folder panelet på den side væk, og 3D-billedet fylder pladsen.
// - "Kun grafik" (knappen i toplinjen eller tasten G) folder begge paneler væk. Esc eller knappen igen henter dem.
// - Valget huskes for hver skærm (atomlabPaneler), men første gang er panelerne fremme.
// - På højkant står panelerne under 3D-billedet. Der bruges fanerne ikke, og "Kun grafik" viser 3D-billedet på hele skærmen.
// - Telefon på højkant med fingre (jeres ønske 19. november 2026): Et swipe ned på panelerne, når de er rullet helt op, er det
//   samme som "Kun grafik". En greb-streg mellem scenen og panelerne (nederst, når de er væk) henter dem igen med et tryk eller
//   et swipe op. Lytterne sidder kun på panelerne og stregen, så det at dreje scenen er urørt.
// Tilbage i 3D-billedet er underteksten, tidsknappen, "Næste skridt" og det, delen selv har lagt i billedet.

import { centrerVindue, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';

const NØGLE = 'atomlabPaneler';
// De skærme, der har et panel til venstre, 3D-billedet i midten og et panel til højre.
// nede: de paneler, der står under 3D-billedet på telefonen og kan swipes ned.
const SIDER = { venstre: '.venstre-panel', højre: '.højre-panel', nede: '.side-panel' };
const SKÆRME = {
  vaerksted: { venstre: '#byggepanel', højre: '#infopanel', nede: '#byggepanel, #minitabelPanel' },
  fusion: SIDER,
  reaktor: SIDER,
  batteri: SIDER,
  ild: SIDER,
  liv: SIDER,
  begyndelsen: SIDER,
  kvante: SIDER,
  solsystem: SIDER,
  kosmos: SIDER,
};
// Samme grænse som i style.css: her står panelerne under 3D-billedet
const STABLET = matchMedia('(max-width: 820px) and (orientation: portrait), (max-width: 820px) and (min-height: 501px)');
// Samme grænse som telefonen i style.css (.panel-greb): her kan panelerne swipes ned
const TELEFON = matchMedia('(max-width: 560px) and (orientation: portrait) and (pointer: coarse)');
const SWIPE = 60; // px lodret, før et swipe tæller
const GLID = 250; // ms, panelerne glider ned
const IKON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14M16 5v14"/></svg>';

let tilstand = hent();
let aktiv = null; // den skærm, der vises lige nu
let sidstSwipe = 0; // så trykket efter et swipe på stregen ikke slår tilbage igen

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
  const greb = skærm.querySelector('.panel-greb');
  const grebTekst = v.kunGrafik ? 'Vis panelerne' : 'Skjul panelerne';
  greb.title = grebTekst;
  greb.setAttribute('aria-label', grebTekst);
  greb.setAttribute('aria-expanded', String(!v.kunGrafik));
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

// Panelerne glider ned (0,25 s) og forsvinder, eller de kommer op igen. Med "reducer bevægelse" sker det med det samme.
function glid(id, ned) {
  const skærm = document.getElementById(id);
  if (valg(id).kunGrafik === ned) return;
  if (ROLIG) return skiftKunGrafik(id, ned);
  if (!ned) {
    skiftKunGrafik(id, false);
    skærm.classList.add('paneler-ind');
    setTimeout(() => skærm.classList.remove('paneler-ind'), GLID + 50);
    return;
  }
  skærm.classList.add('paneler-ud');
  setTimeout(() => {
    skærm.classList.remove('paneler-ud');
    skiftKunGrafik(id, true);
  }, GLID);
}

// Er noget mellem fingeren og skærmen rullet ned, så ruller et swipe ned bare op igen som før
function rulletNed(el, skærm) {
  for (let e = el; e && e !== skærm.parentElement; e = e.parentElement) if (e.scrollTop > 0) return true;
  return false;
}

// Swipe ned på panelerne (eller stregen) skjuler dem, swipe op på stregen henter dem. Passive lyttere, så rulning er urørt.
function lavSwipe(id, skærm, greb) {
  let start = null;
  skærm.addEventListener('touchstart', (h) => {
    start = null;
    if (!TELEFON.matches || h.touches.length !== 1 || skærm.classList.contains('i-forløb')) return;
    const mål = h.target;
    const påGreb = greb.contains(mål);
    if (!påGreb && (valg(id).kunGrafik || !mål.closest?.(SKÆRME[id].nede))) return;
    if (mål.closest?.('input, select, textarea, [data-ingen-stryg]')) return;
    if (!påGreb && rulletNed(mål, skærm)) return;
    start = { x: h.touches[0].clientX, y: h.touches[0].clientY, påGreb };
  }, { passive: true });
  skærm.addEventListener('touchend', (h) => {
    const s = start;
    start = null;
    if (!s || !h.changedTouches.length) return;
    const dx = h.changedTouches[0].clientX - s.x;
    const dy = h.changedTouches[0].clientY - s.y;
    if (Math.abs(dy) < SWIPE || Math.abs(dy) < 2 * Math.abs(dx)) return;
    const ned = dy > 0;
    // Op på et panel er almindelig rulning
    if ((!ned && !s.påGreb) || valg(id).kunGrafik === ned) return;
    sidstSwipe = performance.now();
    lyd.klik();
    glid(id, ned);
  }, { passive: true });
  skærm.addEventListener('touchcancel', () => { start = null; }, { passive: true });
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
    // Greb-stregen: en stribe mellem 3D-billedet og panelerne (kun på telefonen, se style.css)
    const greb = document.createElement('button');
    greb.className = 'panel-greb';
    greb.innerHTML = '<span aria-hidden="true"></span>';
    greb.addEventListener('click', () => {
      if (performance.now() - sidstSwipe < 500) return;
      lyd.klik();
      glid(id, !valg(id).kunGrafik);
    });
    vindue.after(greb);
    lavSwipe(id, skærm, greb);
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
    telefon: () => TELEFON.matches,
  };
}
