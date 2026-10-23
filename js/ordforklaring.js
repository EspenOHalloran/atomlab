// Ordforklaringer: Første gang et fagord (fra js/data/ordbog.js) står i en tekst, bliver det en lille knap med prikket understregning.
// Et tryk eller klik viser en kort forklaring. Med mus vises den også, når man holder musen over ordet.
// Teksterne bliver markeret af sig selv, også når de skifter (en MutationObserver holder øje med de steder, der står i ZONER).

import { ORDBOG } from './data/ordbog.js';

// Steder med tekst, hvor fagord bliver markeret. Hvert sted får hvert ord markeret én gang (første gang det står der).
const ZONER = [
  '.hjælp-indhold', '.forklaring-boks', '.seneste-boks', '.kosmos-tekst', '.kosmos-forklaring', '.fane',
  '.system-kort', '.system-kategori', '.ærligt', '.ut-tekst', '.pille-mere', '#logListe li', '.hk-tekst', '.hk-nørd',
].join(', ');
// Her markeres aldrig (knapper, overskrifter, citater og fremhævet tekst)
const ALDRIG = 'button, a, input, textarea, select, label, h1, h2, h3, h4, strong, b, summary, blockquote, .fagord, .ordforklaring, canvas, svg';

const OPSLAG = new Map(); // form (små bogstaver, ét mellemrum) → ord
for (const o of ORDBOG) for (const f of o.former) OPSLAG.set(f, o);
const MØNSTER = new RegExp(
  '(?<![\\p{L}\\p{N}\\-])(' + [...OPSLAG.keys()]
    .sort((a, b) => b.length - a.length) // de længste først (fx "antineutrino" før "neutrino")
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+'))
    .join('|') + ')(?![\\p{L}\\p{N}])',
  'giu',
);

let boble = null; // forklaringen, der vises
let vistFor = null; // knappen, forklaringen hører til
let fastholdt = false; // vist med et klik (ellers med musen over ordet)
let musTimer = null;

// Markér fagordene i et sted (zone), som ikke allerede er markeret der
export function markérFagord(zone) {
  const markeret = new Set([...zone.querySelectorAll('.fagord')].map((k) => k.dataset.ord));
  const gå = document.createTreeWalker(zone, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue.trim() && !n.parentElement.closest(ALDRIG) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const tekster = [];
  while (gå.nextNode()) tekster.push(gå.currentNode);
  for (let node of tekster) {
    MØNSTER.lastIndex = 0;
    let m;
    while ((m = MØNSTER.exec(node.nodeValue))) {
      const o = OPSLAG.get(m[1].toLowerCase().replace(/\s+/g, ' '));
      if (!o || markeret.has(o.id)) continue;
      markeret.add(o.id);
      // Del teksten: før | ordet (som knap) | efter, og fortsæt i resten
      const ordNode = node.splitText(m.index);
      const efter = ordNode.splitText(m[1].length);
      const knap = document.createElement('button');
      knap.type = 'button';
      knap.className = 'fagord';
      knap.dataset.ord = o.id;
      knap.setAttribute('aria-label', `${m[1]}: tryk for at få ordet forklaret`);
      knap.textContent = ordNode.nodeValue;
      ordNode.replaceWith(knap);
      node = efter;
      MØNSTER.lastIndex = 0;
    }
  }
}

export function lavOrdforklaringer() {
  boble = document.createElement('div');
  boble.className = 'ordforklaring skjult';
  boble.setAttribute('role', 'tooltip');
  boble.id = 'ordforklaring';
  boble.innerHTML = '<strong></strong><p></p>';
  document.body.append(boble);

  // Markér alt, der står i siden nu, og hold øje med nye tekster
  for (const z of document.querySelectorAll(ZONER)) markérFagord(z);
  // Markeringen sker med det samme (lige efter den kode, der skrev teksten), ikke først i næste billede.
  // Så ses teksten aldrig uden prikker, og det virker også, når der tegnes få billeder i sekundet.
  const iagttager = new MutationObserver((ændringer) => {
    const nye = new Set();
    for (const æ of ændringer) {
      const el = æ.target.nodeType === 1 ? æ.target : æ.target.parentElement;
      const zone = el?.closest(ZONER);
      if (zone) nye.add(zone);
      for (const n of æ.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.matches(ZONER)) nye.add(n);
        for (const z of n.querySelectorAll(ZONER)) nye.add(z);
      }
    }
    for (const z of nye) if (z.isConnected) markérFagord(z);
    iagttager.takeRecords(); // vores egne ændringer skal ikke give en ny runde
  });
  iagttager.observe(document.body, { childList: true, subtree: true, characterData: true });

  // Klik eller tryk på et ord viser forklaringen (og et klik til lukker den igen).
  // Fanges først (capture), så klikket ikke også gør noget andet (fx folder en pille sammen).
  document.addEventListener('click', (h) => {
    const knap = h.target.closest?.('.fagord');
    if (!knap) return;
    h.preventDefault();
    h.stopPropagation();
    clearTimeout(musTimer); // musen over ordet må ikke vise den igen bagefter
    if (vistFor === knap && fastholdt) skjul();
    else vis(knap, true);
  }, true);
  // Med mus: vis forklaringen, når musen er over ordet et øjeblik
  document.addEventListener('pointerover', (h) => {
    if (h.pointerType !== 'mouse') return;
    const knap = h.target.closest?.('.fagord');
    if (!knap || fastholdt) return;
    clearTimeout(musTimer);
    musTimer = setTimeout(() => vis(knap, false), 300);
  });
  document.addEventListener('pointerout', (h) => {
    if (h.pointerType !== 'mouse' || !h.target.closest?.('.fagord')) return;
    clearTimeout(musTimer);
    if (!fastholdt) skjul();
  });
  // Tryk et andet sted, Esc, rulning og skærmskift lukker forklaringen
  document.addEventListener('pointerdown', (h) => {
    if (boble.classList.contains('skjult')) return;
    if (!h.target.closest?.('.fagord, .ordforklaring')) skjul();
  }, true);
  addEventListener('keydown', (h) => {
    if (h.key !== 'Escape' || boble.classList.contains('skjult')) return;
    skjul();
    h.stopImmediatePropagation(); // Esc lukker kun forklaringen, ikke også hjælpen bagved
  }, true);
  addEventListener('scroll', (h) => { if (!boble.contains(h.target)) skjul(); }, true);
  addEventListener('resize', () => skjul());
  addEventListener('hashchange', () => skjul());
}

function vis(knap, klik) {
  const o = ORDBOG.find((x) => x.id === knap.dataset.ord);
  if (!o) return;
  boble.querySelector('strong').textContent = o.ord;
  boble.querySelector('p').textContent = o.tekst;
  vistFor?.setAttribute('aria-expanded', 'false');
  vistFor = knap;
  fastholdt = klik;
  knap.setAttribute('aria-expanded', 'true');
  knap.setAttribute('aria-describedby', 'ordforklaring');
  boble.classList.remove('skjult');
  // Under ordet, eller over det, hvis der ikke er plads forneden. Altid inden for skærmen.
  const r = knap.getBoundingClientRect();
  const b = boble.getBoundingClientRect();
  const venstre = Math.min(Math.max(8, r.left + r.width / 2 - b.width / 2), innerWidth - b.width - 8);
  const top = r.bottom + 8 + b.height < innerHeight - 8 ? r.bottom + 8 : Math.max(8, r.top - 8 - b.height);
  boble.style.left = `${venstre}px`;
  boble.style.top = `${top}px`;
}

function skjul() {
  clearTimeout(musTimer);
  boble?.classList.add('skjult');
  vistFor?.setAttribute('aria-expanded', 'false');
  vistFor = null;
  fastholdt = false;
}

// Kun til automatiske tests
export function testAdgang() {
  return {
    vist: () => (boble.classList.contains('skjult') ? null : boble.querySelector('strong').textContent),
    ord: () => ORDBOG.map((o) => o.id),
  };
}
