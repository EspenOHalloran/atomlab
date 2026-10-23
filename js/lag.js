// Dybde i lag (se docs/plan-lag.md): fælles byggeklodser, så alle dele opfører sig ens.
// - Foldebokse: <details class="lag-boks" data-lag="id"> med en <summary> (overskrift og én linje). Et tryk folder resten ud.
//   Om en boks er åben, huskes (atomlabLag). visLag(id) folder en boks ud, fx den om det, der lige er sket.
// - "Hvorfor?"-kort: <button class="hvorfor" data-hvorfor="id">…</button> (teksterne står i data/hvorfor.js),
//   eller visHvorfor(id eller { spørgsmål, svar }, knap). Kortet åbner ved knappen, og på telefon på højkant
//   kommer det op nedefra. "Og hvorfor det?" går et lag dybere, og "‹ Tilbage" går tilbage.
// - "Næste skridt": lavNæsteSkridt(kort, { visMig }) styrer kortet øverst til venstre i 3D-billedet (fold sammen og "Vis mig").

import { HVORFOR } from './data/hvorfor.js';
import { lyd } from './lyd.js';

const NØGLE = 'atomlabLag';
const ARK = matchMedia('(max-width: 560px) and (orientation: portrait)');

let åbne = hentÅbne();
let kort = null; // "Hvorfor?"-kortet
let anker = null; // knappen, kortet hører til
let historik = []; // de kort, man har været igennem (til "‹ Tilbage")

function hentÅbne() {
  try {
    return JSON.parse(localStorage.getItem(NØGLE)) || {};
  } catch {
    return {};
  }
}

function gemÅbne() {
  try {
    localStorage.setItem(NØGLE, JSON.stringify(åbne));
  } catch {
    // ingen lagring
  }
}

// ---------- Foldebokse ----------
// Første gang er de foldet sammen. Bagefter huskes det, man selv har valgt.
export function lavLagBokse(rod = document) {
  for (const boks of rod.querySelectorAll('details.lag-boks[data-lag]')) {
    if (boks.dataset.klar) continue;
    boks.dataset.klar = '1';
    const id = boks.dataset.lag;
    if (id in åbne) boks.open = åbne[id];
    boks.addEventListener('toggle', () => {
      if (boks.dataset.auto) {
        delete boks.dataset.auto; // åbnet af visLag, ikke af brugeren
        return;
      }
      åbne[id] = boks.open;
      gemÅbne();
    });
  }
}

// Folder en boks ud uden at huske det (fx "Seneste reaktion"). De andre i samme panel, som spillet selv har
// foldet ud, folder sig sammen igen, så der kun står én forklaring fremme ad gangen.
export function visLag(id) {
  const boks = document.querySelector(`details.lag-boks[data-lag="${id}"]`);
  if (!boks) return;
  const panel = boks.closest('.panel') ?? document;
  for (const anden of panel.querySelectorAll('details.lag-boks[data-auto-vist]')) {
    if (anden === boks) continue;
    delete anden.dataset.autoVist;
    if (anden.open && !åbne[anden.dataset.lag]) {
      anden.dataset.auto = '1';
      anden.open = false;
    }
  }
  if (!boks.open) {
    boks.dataset.auto = '1';
    boks.open = true;
  }
  boks.dataset.autoVist = '1';
}

// Kaldes én gang ved start (før de andre lyttere på tasterne, se Esc nedenfor)
export function lavLag() {
  if (!kort) lavKort();
  lavLagBokse();
}

// ---------- "Hvorfor?"-kort ----------
function lavKort() {
  kort = document.createElement('div');
  kort.className = 'hvorfor-kort skjult';
  kort.id = 'hvorforKort';
  kort.setAttribute('role', 'dialog');
  kort.innerHTML = `<div class="hk-top"><strong class="hk-titel"></strong><button class="hk-luk" title="Luk (Esc)" aria-label="Luk">×</button></div>
    <div class="hk-tekst"></div>
    <details class="hk-nørd"><summary>For nørder</summary><p></p></details>
    <div class="hk-knapper"><button class="knap lille svag hk-tilbage">‹ Tilbage</button><button class="knap lille hk-næste"></button></div>`;
  document.body.append(kort);
  kort.querySelector('.hk-luk').addEventListener('click', () => {
    lyd.klik();
    lukHvorfor();
  });
  kort.querySelector('.hk-tilbage').addEventListener('click', () => {
    lyd.klik();
    historik.pop();
    vis(historik[historik.length - 1]);
  });
  kort.querySelector('.hk-næste').addEventListener('click', () => {
    lyd.klik();
    const nu = historik[historik.length - 1];
    const næste = HVORFOR[nu.næste];
    if (!næste) return;
    historik.push(næste);
    vis(næste);
  });
  // Esc og et tryk et andet sted lukker kortet (men ikke et tryk i en ordforklaring)
  addEventListener('keydown', (h) => {
    // Esc lukker kun kortet (ikke også guiden eller "Kun grafik"), så denne lytter skal laves først (lavLag i main.js)
    if (h.key === 'Escape' && !kort.classList.contains('skjult')) {
      h.stopImmediatePropagation();
      lukHvorfor();
    }
  }, true);
  addEventListener('pointerdown', (h) => {
    if (kort.classList.contains('skjult')) return;
    if (h.target.closest('.hvorfor-kort, .ordforklaring, .fagord') || (anker && anker.contains(h.target))) return;
    lukHvorfor();
  }, true);
  addEventListener('resize', () => placer());
  // Knapper i teksterne finder kortet selv (også i tekster, der kommer senere)
  document.addEventListener('click', (h) => {
    const knap = h.target.closest('button.hvorfor[data-hvorfor]');
    if (!knap) return;
    lyd.klik();
    if (anker === knap && !kort.classList.contains('skjult')) lukHvorfor();
    else visHvorfor(knap.dataset.hvorfor, knap);
  });
}

// Viser et kort. indhold er et id i HVORFOR eller { spørgsmål, svar, næste, nørd }. knap er det, kortet hører til.
export function visHvorfor(indhold, knap = null) {
  if (!kort) lavKort();
  const k = typeof indhold === 'string' ? HVORFOR[indhold] : indhold;
  if (!k) return;
  anker?.setAttribute('aria-expanded', 'false');
  anker = knap;
  anker?.setAttribute('aria-expanded', 'true');
  historik = [k];
  vis(k);
}

function vis(k) {
  kort.querySelector('.hk-titel').textContent = k.spørgsmål;
  const tekst = kort.querySelector('.hk-tekst');
  tekst.replaceChildren(...String(k.svar).split('\n\n').map((afsnit) => Object.assign(document.createElement('p'), { textContent: afsnit })));
  const nørd = kort.querySelector('.hk-nørd');
  nørd.hidden = !k.nørd;
  nørd.open = false;
  nørd.querySelector('p').textContent = k.nørd ?? '';
  const næste = kort.querySelector('.hk-næste');
  næste.hidden = !HVORFOR[k.næste];
  næste.textContent = HVORFOR[k.næste] ? `Og hvorfor det? ›` : '';
  næste.title = HVORFOR[k.næste]?.spørgsmål ?? '';
  kort.querySelector('.hk-tilbage').hidden = historik.length < 2;
  kort.querySelector('.hk-knapper').hidden = næste.hidden && historik.length < 2;
  kort.classList.remove('skjult');
  kort.scrollTop = 0;
  placer();
}

// Ved knappen (under den, eller over den, hvis der er mere plads), og altid inde på skærmen.
// På en telefon på højkant står kortet nederst og fylder bredden.
function placer() {
  if (!kort || kort.classList.contains('skjult')) return;
  const ark = ARK.matches || !anker || !anker.isConnected;
  kort.classList.toggle('ark', ark);
  if (ark) {
    kort.style.transform = '';
    return;
  }
  const r = anker.getBoundingClientRect();
  const b = kort.offsetWidth;
  const h = kort.offsetHeight;
  let x = r.left + r.width / 2 - b / 2;
  const under = innerHeight - r.bottom;
  let y = under >= h + 12 || under > r.top ? r.bottom + 8 : r.top - h - 8;
  x = Math.min(Math.max(8, x), innerWidth - b - 8);
  y = Math.min(Math.max(8, y), innerHeight - h - 8);
  kort.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}

export function lukHvorfor() {
  if (!kort) return;
  kort.classList.add('skjult');
  anker?.setAttribute('aria-expanded', 'false');
  anker = null;
  historik = [];
}

// Til tests: id-agtigt navn på det viste kort (spørgsmålet) eller null
export function vistHvorfor() {
  return kort && !kort.classList.contains('skjult') ? kort.querySelector('.hk-titel').textContent : null;
}

// ---------- "Næste skridt" ----------
// kort er .mission-elementet. Giver sæt({ tekst, kanVise, travl }), som kun skriver om, når noget har ændret sig.
export function lavNæsteSkridt(kortEl, { visMig } = {}) {
  const tekst = kortEl.querySelector('.mission-tekst');
  const vis = kortEl.querySelector('.mission-vis');
  const fold = kortEl.querySelector('.mission-fold');
  fold.addEventListener('click', () => {
    lyd.klik();
    const foldet = kortEl.classList.toggle('foldet');
    fold.textContent = foldet ? '+' : '–';
    fold.title = foldet ? 'Vis næste skridt' : 'Skjul næste skridt';
  });
  if (vis && visMig) {
    vis.addEventListener('click', () => {
      lyd.klik();
      visMig();
    });
  }
  return {
    sæt({ tekst: t, kanVise = false, travl = false }) {
      if (tekst.textContent !== t) tekst.textContent = t;
      if (vis) {
        vis.hidden = !kanVise;
        vis.disabled = Boolean(travl);
      }
    },
  };
}

// Laver et "Næste skridt"-kort i et 3D-vindue, der ikke har et i index.html (fx Batteriet)
export function lavNæsteSkridtKort(vindue, id) {
  const el = document.createElement('div');
  el.className = 'mission';
  el.id = id;
  el.innerHTML = `<div class="mission-top"><span class="mission-mærke">Næste skridt</span><button class="mission-fold" title="Skjul næste skridt">–</button></div>
    <span class="mission-tekst"></span>
    <button class="knap lille mission-vis" hidden>▶ Vis mig</button>`;
  vindue.append(el);
  return el;
}
