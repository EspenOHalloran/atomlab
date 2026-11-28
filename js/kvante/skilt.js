// Skiltet øverst i midten af scenen i Kvantefysik (rettelse 1 efter prøven 28. november 2026, docs/proeven-svar-2026-11.md
// afsnit 3: "den type beskeder burde stå mere centralt i billedet, så de ikke misser det"). Det siger, hvad der sendes nu
// (fx "Bølger i vand"), en linje, når noget er ændret ("Måleren er tændt"), hvor mange der er landet, og i turens trin 4
// tallet i den gule ring. Teksterne laves i js/data/kvante.js (skiltTekst, tælTekst, ringTekst).
// Skifter det, man sender, eller det, der er ændret, kommer skiltet stort frem midt i scenen og glider op på sin plads
// (stilguiden A10). Med "reducer bevægelse" står det straks på plads.
import { ROLIG } from '../scene3d.js';

const MIDT_TID = 1500; // ms midt i scenen, før skiltet glider op

export function lavSkilt(vindue) {
  const el = document.createElement('div');
  el.className = 'kv-skilt';
  el.id = 'kvSkilt';
  el.hidden = true;
  // Kun titlen og linjen om det ændrede læses op (tallet skifter for tit)
  el.innerHTML = '<div role="status"><p class="kv-skilt-titel"></p><p class="kv-skilt-ekstra"></p></div>'
    + '<div class="kv-skilt-tal-række"><p class="kv-skilt-tal"><b></b> <span></span></p><p class="kv-skilt-ring"><span></span> <b></b> <small></small></p></div>';
  vindue.append(el);
  const felt = {
    titel: el.querySelector('.kv-skilt-titel'),
    ekstra: el.querySelector('.kv-skilt-ekstra'),
    tal: el.querySelector('.kv-skilt-tal'),
    ring: el.querySelector('.kv-skilt-ring'),
  };
  let nøgle = null; // titel og ekstra: Skifter de, kommer skiltet frem midt i scenen
  let timer = null;
  const tegnet = new Map();
  // Skriver kun en tekst, når den er ændret (tjekliste E: innerHTML og textContent kun ved ændringer)
  function skriv(node, tekst) {
    if (tegnet.get(node) === tekst) return;
    tegnet.set(node, tekst);
    node.textContent = tekst;
  }
  function vis(p, ja) {
    if (p.hidden === !ja) return;
    p.hidden = !ja;
  }
  function midt() {
    clearTimeout(timer);
    if (ROLIG) return;
    el.classList.add('straks', 'midt');
    void el.offsetWidth;
    el.classList.remove('straks');
    timer = setTimeout(() => el.classList.remove('midt'), MIDT_TID);
  }

  return {
    el,
    // { titel, ekstra, tal: { tal, enhed } eller null, ring: { navn, tal, før } eller null }
    sæt({ titel, ekstra = '', tal = null, ring = null }) {
      el.hidden = false;
      skriv(felt.titel, titel);
      skriv(felt.ekstra, ekstra);
      vis(felt.ekstra, Boolean(ekstra));
      vis(felt.tal, Boolean(tal));
      if (tal) {
        skriv(felt.tal.querySelector('b'), tal.tal);
        skriv(felt.tal.querySelector('span'), tal.enhed);
      }
      vis(felt.ring, Boolean(ring));
      if (ring) {
        skriv(felt.ring.querySelector('span'), ring.navn);
        skriv(felt.ring.querySelector('b'), ring.tal);
        skriv(felt.ring.querySelector('small'), ring.før ?? '');
      }
      const ny = `${titel}|${ekstra}`;
      if (ny !== nøgle) {
        nøgle = ny;
        midt();
      }
    },
    // Delen er lukket: Næste gang kommer skiltet frem midt i scenen igen
    stop() {
      clearTimeout(timer);
      timer = null;
      nøgle = null;
      el.classList.remove('midt', 'straks');
      el.hidden = true;
    },
    // Til testen: det, der står, og om det står midt i scenen lige nu
    læs: () => ({
      titel: felt.titel.textContent,
      ekstra: felt.ekstra.hidden ? '' : felt.ekstra.textContent,
      tal: felt.tal.hidden ? '' : felt.tal.textContent.trim(),
      ring: felt.ring.hidden ? '' : felt.ring.textContent.replace(/\s+/g, ' ').trim(),
      midt: el.classList.contains('midt'),
    }),
  };
}
