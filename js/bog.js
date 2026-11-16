// Bogen (docs/plan-videnskabsfolk.md, afsnit 3 og 4): klodsen, som alle ti bøger i Opdagelserne bruger. Én ting ad
// gangen: ét opslag fremme, bladring med "‹" og "›" (mindst 44 px), et vandret stryg med fingeren og piletasterne.
// Bladringen er et hurtigt skub (ikke en animeret side) og slet ingen bevægelse med ROLIG.
//
// Den fælles ramme (størrelsen, knapperne, sidetallet og papirets kant) står i style.css under #opdagelser. Tidens
// udseende kommer fra bogens stil (js/data/opdagelser.js) som CSS-variabler: --bog-papir, --bog-papir-mork, --bog-blaek og
// --bog-skrift.
//
// lavBog(rod, bog, tekster, { rolig, påBladr, påBegynd, lavScene }) bygger bogen i rod og giver { vis(nr), bladr(retning),
// nr(), antal(), opslag(), find(id), lås(ja), scene(), fjern() }. tekster er modulet fra bog.tekster() med FORSIDE, OPSLAG
// og TOM_LINJE. Opslagets slags:
//   'forside'  portrættet, spørgsmålet, Galileis lille tegning (eller bogens egen), navnet og "Begynd"
//   'scene'    et kapitel med en tegning, man gør noget i (fortællingen, H2): titlen og et felt (.bog-scene), som
//              lavScene(opslag, felt) fylder (bogens egen fil i js/bog/). lavScene giver et objekt med fjern(), som
//              kaldes, når man bladrer væk
//   'tom'      et kapitel, der kommer i et senere trin: titlen og én linje
// påBegynd() kaldes ved "Begynd" (giver den true, bladrer bogen ikke selv). lås(true) slår bladringen fra (knapperne,
// stryget og bladr()), mens et forløb kører i bogen. Nye slags (gåden, Gør det selv, bogen selv og "Om …") kommer i H3-H4.

const STRYG = 50; // px vandret, før et stryg bladrer

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Galileis Saturn fra 1610 (en stor kugle med en lille på hver side) i samme stil som tavlen i Systema Saturnium:
// hvide figurer på en mørk, prikket baggrund
function galileiTegning() {
  const prikker = [[14, 12], [37, 30], [71, 9], [118, 26], [151, 13], [168, 41], [25, 50], [139, 53], [96, 55], [57, 52]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9"/>`).join('');
  return '<svg viewBox="0 0 180 64" role="img" aria-label="Saturn som en stor kugle med en lille kugle på hver side">'
    + '<rect width="180" height="64" rx="3" class="bog-tavle"/>'
    + `<g class="bog-tavle-prik">${prikker}</g>`
    + '<g class="bog-tavle-figur"><circle cx="90" cy="32" r="15"/><circle cx="64" cy="32" r="7.5"/><circle cx="116" cy="32" r="7.5"/></g>'
    + '</svg>';
}

function forsideHTML(bog, f) {
  return `<div class="bog-opslag bog-forside">`
    + `<figure class="bog-portræt"><img src="${esc(bog.portræt)}" alt="${esc(f.portrætAlt)}" width="600" height="750" decoding="async"><figcaption>${esc(f.portrætTekst)}</figcaption></figure>`
    + `<div class="bog-forside-tekst">`
    + `<h3 class="bog-titel">${esc(f.spørgsmål)}</h3>`
    + `<figure class="bog-galilei">${galileiTegning()}<figcaption>${esc(f.galilei)}</figcaption></figure>`
    + `<p class="bog-navn">${esc(f.navn)} · ${esc(f.liv)}</p>`
    + `<button class="knap bog-begynd" data-begynd>${esc(f.begynd)} ›</button>`
    + `</div></div>`;
}

function sceneHTML(o) {
  return `<div class="bog-opslag bog-scene-opslag"><h3 class="bog-kapitel">${esc(o.titel)}</h3>`
    + '<div class="bog-scene" data-ingen-stryg></div></div>';
}

function tomHTML(o, tekster) {
  return `<div class="bog-opslag bog-tom"><h3 class="bog-titel">${esc(o.titel)}</h3>`
    + `<p class="bog-tekst">${esc(o.tekst)}</p><p class="bog-småt">${esc(tekster.TOM_LINJE)}</p></div>`;
}

export function lavBog(rod, bog, tekster, { rolig = false, påBladr = null, påBegynd = null, lavScene = null } = {}) {
  const opslag = tekster.OPSLAG;
  let nr = 0;
  let låst = false;
  let scene = null; // tegningen i et opslag af slags 'scene' (fra lavScene)
  const s = bog.stil ?? {};
  rod.style.setProperty('--bog-papir', s.papir ?? '#efe4cc');
  rod.style.setProperty('--bog-papir-mork', s.papirMørk ?? '#dccaa4');
  rod.style.setProperty('--bog-blaek', s.blæk ?? '#2b1f17');
  rod.style.setProperty('--bog-skrift', s.skrift ?? 'Georgia, serif');
  rod.dataset.bog = bog.id;
  rod.setAttribute('aria-label', `${bog.navn}: ${bog.titel ?? ''}`);
  rod.innerHTML = '<div class="bog-ramme" aria-live="polite"></div>'
    + '<nav class="bog-bund" aria-label="Bladr i bogen">'
    + '<button class="bog-pil" data-bladr="-1" aria-label="Forrige opslag">‹</button>'
    + '<span class="bog-sidetal"></span>'
    + '<button class="bog-pil" data-bladr="1" aria-label="Næste opslag">›</button></nav>';
  const ramme = rod.querySelector('.bog-ramme');
  const sidetal = rod.querySelector('.bog-sidetal');
  const [forrige, næste] = rod.querySelectorAll('.bog-pil');

  function vis(ny, retning = 0) {
    nr = Math.max(0, Math.min(ny, opslag.length - 1));
    const o = opslag[nr];
    scene?.fjern();
    scene = null;
    ramme.innerHTML = o.slags === 'forside' ? forsideHTML(bog, tekster.FORSIDE) : o.slags === 'scene' ? sceneHTML(o) : tomHTML(o, tekster);
    ramme.dataset.opslag = o.id;
    ramme.scrollTop = 0;
    if (o.slags === 'scene' && lavScene) scene = lavScene(o, ramme.querySelector('.bog-scene'));
    // Portrættet toner ind, når det er hentet (ingen tom ramme, der blinker)
    const img = ramme.querySelector('.bog-portræt img');
    if (img && !img.complete) {
      img.classList.add('henter');
      img.addEventListener('load', () => img.classList.remove('henter'), { once: true });
      img.addEventListener('error', () => img.classList.remove('henter'), { once: true });
    }
    if (retning && !rolig && ramme.animate) {
      ramme.animate([{ transform: `translateX(${retning > 0 ? 28 : -28}px)`, opacity: 0.55 }, { transform: 'none', opacity: 1 }], { duration: 180, easing: 'ease-out' });
    }
    sidetal.textContent = `${nr + 1} / ${opslag.length}`;
    pile();
  }

  function pile() {
    forrige.disabled = låst || nr === 0;
    næste.disabled = låst || nr === opslag.length - 1;
  }

  function bladr(retning) {
    if (låst) return false;
    const ny = nr + Math.sign(retning);
    if (ny < 0 || ny >= opslag.length) return false;
    vis(ny, retning);
    påBladr?.(nr);
    return true;
  }

  const klik = (h) => {
    const b = h.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.bladr) bladr(Number(b.dataset.bladr));
    else if (b.hasAttribute('data-begynd') && !påBegynd?.()) bladr(1);
  };
  rod.addEventListener('click', klik);

  // Et vandret stryg bladrer (lodret ruller siden som normalt: touch-action: pan-y i CSS)
  let start = null;
  const ned = (h) => { if (h.isPrimary && !låst && !h.target.closest('button, input, [data-ingen-stryg]')) start = { x: h.clientX, y: h.clientY, id: h.pointerId }; };
  const op = (h) => {
    if (!start || h.pointerId !== start.id) return;
    const dx = h.clientX - start.x, dy = h.clientY - start.y;
    start = null;
    if (Math.abs(dx) > STRYG && Math.abs(dx) > 1.5 * Math.abs(dy)) bladr(dx < 0 ? 1 : -1);
  };
  const væk = () => { start = null; };
  ramme.addEventListener('pointerdown', ned);
  ramme.addEventListener('pointerup', op);
  ramme.addEventListener('pointercancel', væk);

  vis(0);

  return {
    vis: (n) => vis(n),
    bladr,
    nr: () => nr,
    antal: () => opslag.length,
    opslag: () => opslag[nr].id,
    find: (id) => opslag.findIndex((o) => o.id === id),
    scene: () => scene,
    lås(ja) {
      låst = Boolean(ja);
      rod.classList.toggle('bog-låst', låst);
      pile();
    },
    fjern() {
      scene?.fjern();
      scene = null;
      rod.removeEventListener('click', klik);
      ramme.removeEventListener('pointerdown', ned);
      ramme.removeEventListener('pointerup', op);
      ramme.removeEventListener('pointercancel', væk);
      rod.replaceChildren();
      rod.removeAttribute('data-bog');
    },
  };
}
