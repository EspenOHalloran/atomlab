// Huygens' anagram i bogen (Opdagelserne, docs/drejebog-huygens.md, afsnit 3-4): de 17 bunker af bogstaver, som rækken
// blev trykt i 1656, og sætningen, der kommer frem. Bruges af fortællingens trin 4 (js/bog/huygens.js) og af opslaget
// "Hemmeligheden" (udfordringen med de otte brikker, H3 trin C). Teksterne står i js/data/opdagelser/huygens.js (ANAGRAM
// og GÅDE).
//
// lavAnagram(rod, anagram, { rolig, påRørt }) fylder rod og giver { tryk(bogstav), visMig(), færdig(), tilstand(), fjern() }.
//   Man finder nøgleordet (ANNULO) ved at trykke på bunkerne i rækkefølge. Et rigtigt bogstav flyver fra bunken til sin
//   plads, og bunkens tal tæller ned. Et forkert bogstav ryster bare lidt. Er ordet fundet, flyver resten af sætningen
//   på plads ord for ord med den danske betydning under, og bunkerne tæller ned til 0.
//   påRørt kaldes ved hvert tryk (Forløb-klodsen: et tryk, mens man gætter, lader gættet tone væk).
// Bunkerne er knapper på mindst 44 px (tre rækker på en telefon). Med ROLIG flyver og ryster intet.
//
// lavUdfordring(felt, anagram, { rolig, tekster, løst, påLøst, påVidere }) er opslaget "Hemmeligheden" (drejebogen afsnit 4): de otte
//   latinske brikker lægges på deres danske betydning (tryk på brikken og så på betydningen, eller omvendt). En forkert
//   brik ryster og hopper tilbage. For hver brik tæller bunkerne ned, og til sidst står alle på 0: "Alle 62 er brugt."
//   Man kan ikke fejle og kan stoppe når som helst. Bagefter (eller hvis gåden er løst før) kommer "Lav dit eget anagram":
//   Man skriver en hemmelighed, og bogstaverne sorteres som Huygens'. Intet gemmes. Giver { fjern(), test }.

import { bunker, bogstaver } from '../data/opdagelser/huygens.js';

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ORD_EFTER = 380; // ms mellem ordene, når resten af sætningen flyver på plads
const BOGSTAV_EFTER = 220; // ms mellem bogstaverne, når "Næste ›" viser ordet

// Bunkerne som HTML (fælles for trin 4 og udfordringen)
// knap: falsk giver bunker, man ikke kan trykke på (i udfordringen tæller de bare ned)
export function bunkerHTML(række, knap = true) {
  const t = knap ? 'button' : 'span';
  return bunker(række).map(([b, n]) => `<${t} class="ag-bunke" data-b="${b}" aria-label="${b}, ${n} tilbage">`
    + `<span class="ag-b">${b}</span><span class="ag-tal">${n}</span></${t}>`).join('');
}

// Bogstaverne i en tekst sorteret og samlet i bunker som Huygens' række (fx "aaa c d ee"). Også æ, ø og å (efter z)
export function sorterSomHuygens(tekst) {
  const alle = [...tekst.toLowerCase()].filter((c) => /[a-zæøå]/.test(c)).sort((a, b) => a.localeCompare(b, 'da'));
  const bunker = [];
  for (const c of alle) {
    if (bunker.length && bunker[bunker.length - 1][0] === c) bunker[bunker.length - 1] += c;
    else bunker.push(c);
  }
  return { række: bunker.join(' '), antal: alle.length };
}

// Tæller bunkerne. tal: { a: 7, … }. Opdaterer knappernes tal og aria-label.
export function lavTæller(rod, række) {
  const tal = Object.fromEntries(bunker(række));
  const knap = (b) => rod.querySelector(`.ag-bunke[data-b="${b}"]`);
  const vis = (b) => {
    const k = knap(b);
    if (!k) return;
    k.querySelector('.ag-tal').textContent = String(tal[b]);
    k.setAttribute('aria-label', `${b}, ${tal[b]} tilbage`);
    k.classList.toggle('tom', tal[b] === 0);
  };
  return {
    tal,
    knap,
    tag(b) {
      if (!(tal[b] > 0)) return false;
      tal[b]--;
      vis(b);
      return true;
    },
    sum: () => Object.values(tal).reduce((a, n) => a + n, 0),
  };
}

// Et kort ryk til siden (et forkert bogstav eller en forkert brik)
export function ryst(el, rolig) {
  if (!el) return;
  if (rolig || !el.animate) {
    el.classList.add('ryster');
    setTimeout(() => el.classList.remove('ryster'), 300);
    return;
  }
  el.animate([{ transform: 'none' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 280 });
}

// el flyver hen på sin plads fra et andet element (fra), fx et bogstav fra sin bunke
export function flyvFra(el, fra, rolig) {
  if (rolig || !el.animate || !fra) return;
  const a = fra.getBoundingClientRect(), b = el.getBoundingClientRect();
  const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(1.3)`, opacity: 0.5 }, { transform: 'none', opacity: 1 }], { duration: 340, easing: 'cubic-bezier(.2,.7,.3,1)' });
}

export function lavAnagram(rod, anagram, { rolig = false, påRørt = null } = {}) {
  const nøgle = anagram.ord.find((o) => o.latin === anagram.nøgle) ?? anagram.ord[0];
  const nøgleBogstaver = [...nøgle.latin];
  rod.innerHTML = '<div class="ag">'
    + `<p class="ag-række" title="Rækken, som Huygens trykte den i 1656">${esc(anagram.række)}</p>`
    + `<div class="ag-bunker" role="group" aria-label="Bunkerne af bogstaver">${bunkerHTML(anagram.række)}</div>`
    + '<div class="ag-sætning" aria-live="polite">'
    + `<span class="ag-ord nøgle"><span class="ag-latin">${nøgleBogstaver.map((b) => `<span class="ag-plads" data-b="${b.toLowerCase()}">${esc(b)}</span>`).join('')}</span>`
    + `<span class="ag-dansk">${esc(nøgle.dansk)}</span></span></div></div>`;
  const ag = rod.querySelector('.ag');
  const sætning = rod.querySelector('.ag-sætning');
  const pladser = [...rod.querySelectorAll('.ag-plads')];
  const tæller = lavTæller(rod, anagram.række);
  let fundet = 0; // så mange bogstaver i nøgleordet er lagt på plads
  let ord = 0; // så mange af de andre ord er fløjet på plads
  let resten = false; // resten af sætningen er på vej
  let viser = false; // "Næste ›" lægger bogstaverne
  let aktiv = true;
  let timere = [];
  const vent = (ms, f) => timere.push(setTimeout(() => { if (aktiv) f(); }, rolig ? 0 : ms));
  rod.querySelector('.ag-bunker').addEventListener('click', (h) => {
    const k = h.target.closest('.ag-bunke');
    if (k) tryk(k.dataset.b);
  });

  function tryk(b) {
    if (!aktiv) return false;
    påRørt?.();
    if (fundet >= pladser.length) return false;
    const plads = pladser[fundet];
    const knap = tæller.knap(b);
    if (plads.dataset.b !== b || !tæller.tag(b)) {
      ryst(knap, rolig);
      return false;
    }
    plads.classList.add('lagt');
    flyvFra(plads, knap, rolig);
    fundet++;
    if (fundet === pladser.length) {
      sætning.querySelector('.nøgle').classList.add('fundet');
      vent(450, flyvResten);
    }
    return true;
  }

  // Resten af sætningen flyver på plads ord for ord, og bunkerne tæller ned
  function flyvResten() {
    if (resten) return;
    resten = true;
    const andre = anagram.ord.filter((o) => o !== nøgle);
    andre.forEach((o, i) => vent(ORD_EFTER * (i + 1), () => {
      const el = document.createElement('span');
      el.className = 'ag-ord';
      el.innerHTML = `<span class="ag-latin">${esc(o.latin)}</span><span class="ag-dansk">${esc(o.dansk)}</span>`;
      sætning.append(el);
      let fra = null;
      for (const b of bogstaver(o.latin)) if (tæller.tag(b)) fra = tæller.knap(b);
      flyvFra(el, fra, rolig);
      ord++;
      if (ord === andre.length) ag.classList.add('hel');
    }));
  }

  return {
    tryk,
    // "Næste ›", før ordet er fundet: bogstaverne lægges selv et ad gangen
    visMig() {
      if (viser || fundet >= pladser.length) return;
      viser = true;
      const mangler = pladser.length - fundet;
      for (let i = 0; i < mangler; i++) vent(BOGSTAV_EFTER * (i + 1), () => tryk(pladser[fundet]?.dataset.b));
    },
    færdig: () => ag.classList.contains('hel'),
    tilstand: () => ({ fundet, ord, tal: tæller.sum(), hel: ag.classList.contains('hel') }),
    fjern() {
      aktiv = false;
      timere.forEach(clearTimeout);
      timere = [];
    },
  };
}

// Brikkernes faste blanding (ikke tilfældig, så testene og skærmbillederne er ens hver gang)
const BLANDING = [5, 2, 7, 0, 3, 6, 1, 4];

export function lavUdfordring(felt, anagram, { rolig = false, tekster = {}, løst = false, påLøst = null, påVidere = null, medForord = true } = {}) {
  const T = tekster;
  const ord = anagram.ord;
  felt.classList.add('ag-felt');
  felt.innerHTML = '<div class="ag ag-udfordring">'
    + `<p class="hs-linje ag-intro">${esc(T.linje ?? '')}</p>`
    + `<p class="ag-række" title="Rækken, som Huygens trykte den i 1656">${esc(anagram.række)}</p>`
    + `<div class="ag-bunker stille" aria-hidden="true">${bunkerHTML(anagram.række, false)}</div>`
    + `<div class="ag-brikker" role="group" aria-label="De latinske ord">${BLANDING.filter((i) => i < ord.length).map((i) => `<button class="ag-brik" data-i="${i}" aria-pressed="false">${esc(ord[i].latin)}</button>`).join('')}</div>`
    + `<div class="ag-betydninger" role="group" aria-label="Den danske betydning">${ord.map((o, i) => `<button class="ag-betydning" data-i="${i}" aria-pressed="false"><span class="ag-latin"></span><span class="ag-dansk">${esc(o.dansk)}</span></button>`).join('')}</div>`
    + '<p class="ag-status" aria-live="polite"></p>'
    + '<div class="ag-efter"></div>'
    + '</div>';
  const ag = felt.querySelector('.ag');
  // Introduktionen før gåden (18. november 2026): en side bogtekst med det store forbogstav og "Prøv gåden ›". Ikke
  // igen efter "Prøv igen"
  const F = T.forord;
  if (F && medForord) {
    ag.hidden = true;
    ag.insertAdjacentHTML('beforebegin', '<div class="ag-forord">'
      + `<p class="ag-sted">${esc(F.sted)}</p>`
      + `<p class="ag-forord-tekst">${esc(F.tekst)}</p>`
      + `<p class="ag-forord-lille">${esc(F.lille)}</p>`
      + `<button class="knap ag-forord-knap">${esc(F.knap)} ›</button></div>`);
    felt.querySelector('.ag-forord-knap').addEventListener('click', visGåden);
  }
  function visGåden() {
    const forord = felt.querySelector('.ag-forord');
    if (!forord) return;
    forord.remove();
    ag.hidden = false;
    felt.scrollTop = 0;
    if (!rolig && ag.animate) ag.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
  }
  const status = felt.querySelector('.ag-status');
  const efter = felt.querySelector('.ag-efter');
  const tæller = lavTæller(felt, anagram.række);
  let valgtBrik = null, valgtBetydning = null;
  let lagt = 0;
  let erLøst = løst;

  const visStatus = () => {
    const rest = tæller.sum();
    if (rest === 0) status.textContent = T.løst ?? '';
    else status.textContent = `${rest} ${T.tilbage ?? 'bogstaver tilbage'}${erLøst ? ` · ${T.løstFør ?? ''}` : ''}`;
    status.classList.toggle('løst', rest === 0);
  };

  const vælg = (el, ja) => { el?.setAttribute('aria-pressed', String(ja)); };

  function prøv() {
    if (!valgtBrik || !valgtBetydning) return;
    const brik = valgtBrik, plads = valgtBetydning;
    valgtBrik = valgtBetydning = null;
    vælg(brik, false);
    vælg(plads, false);
    if (brik.dataset.i !== plads.dataset.i) {
      // Forkert: brikken ryster og hopper tilbage
      ryst(brik, rolig);
      ryst(plads, rolig);
      return;
    }
    const o = ord[Number(brik.dataset.i)];
    plads.querySelector('.ag-latin').textContent = o.latin;
    plads.classList.add('lagt');
    plads.disabled = true;
    flyvFra(plads.querySelector('.ag-latin'), brik, rolig);
    brik.remove();
    for (const b of bogstaver(o.latin)) tæller.tag(b);
    lagt++;
    visStatus();
    if (lagt === ord.length) {
      ag.classList.add('hel');
      if (!erLøst) påLøst?.();
      erLøst = true;
      visEfter();
    }
  }

  felt.querySelector('.ag-brikker').addEventListener('click', (h) => {
    const b = h.target.closest('.ag-brik');
    if (!b) return;
    if (valgtBrik === b) { vælg(b, false); valgtBrik = null; return; }
    vælg(valgtBrik, false);
    valgtBrik = b;
    vælg(b, true);
    prøv();
  });
  felt.querySelector('.ag-betydninger').addEventListener('click', (h) => {
    const b = h.target.closest('.ag-betydning');
    if (!b || b.disabled) return;
    if (valgtBetydning === b) { vælg(b, false); valgtBetydning = null; return; }
    vælg(valgtBetydning, false);
    valgtBetydning = b;
    vælg(b, true);
    prøv();
  });

  // Efter gåden: "Prøv igen" (når den er løst nu) og "Lav dit eget anagram"
  function visEfter() {
    // Videre til bogen fra 1659, når gåden er løst (den røde tråd, 18. november 2026)
    efter.innerHTML = (påVidere && T.videre && (ag.classList.contains('hel') || erLøst) ? `<button class="knap ag-videre">${esc(T.videre)} ›</button>` : '')
      + (ag.classList.contains('hel') ? `<button class="knap ag-igen">${esc(T.igen ?? 'Prøv igen')}</button>` : '')
      + `<button class="knap ag-eget-knap">${esc(T.eget ?? 'Lav dit eget anagram')} ›</button>`;
  }
  efter.addEventListener('click', (h) => {
    if (h.target.closest('.ag-igen')) {
      fjernLyttere();
      felt.classList.remove('ag-felt');
      Object.assign(api, lavUdfordring(felt, anagram, { rolig, tekster, løst: true, påLøst, påVidere, medForord: false }));
    } else if (h.target.closest('.ag-videre')) påVidere?.();
    else if (h.target.closest('.ag-eget-knap')) visEget();
  });

  // "Lav dit eget anagram": et felt og bogstaverne sorteret som Huygens'. Intet gemmes.
  function visEget() {
    ag.classList.add('eget');
    let boks = felt.querySelector('.ag-eget');
    if (!boks) {
      boks = document.createElement('div');
      boks.className = 'ag-eget';
      boks.innerHTML = `<p class="hs-linje">${esc(T.egetLinje ?? '')}</p>`
        + `<input class="ag-eget-felt" type="text" maxlength="80" autocomplete="off" spellcheck="false" aria-label="${esc(T.egetFelt ?? '')}" placeholder="${esc(T.egetFelt ?? '')}">`
        + `<p class="ag-række ag-eget-række" aria-live="polite">${esc(T.egetTom ?? '')}</p>`
        + `<p class="ag-eget-småt">${esc(T.egetIntet ?? '')}</p>`
        + `<button class="knap ag-eget-tilbage">‹ ${esc(T.tilbageTilGåden ?? '')}</button>`;
      ag.after(boks);
      const inp = boks.querySelector('input');
      const ud = boks.querySelector('.ag-eget-række');
      inp.addEventListener('input', () => {
        const { række, antal } = sorterSomHuygens(inp.value);
        ud.textContent = antal ? `${række} (${antal})` : (T.egetTom ?? '');
      });
      boks.querySelector('.ag-eget-tilbage').addEventListener('click', () => {
        boks.hidden = true;
        ag.classList.remove('eget');
      });
    }
    boks.hidden = false;
    boks.querySelector('input').focus({ preventScroll: true });
  }

  function fjernLyttere() {
    felt.replaceChildren();
  }

  visStatus();
  if (erLøst) visEfter();

  const api = {
    fjern: fjernLyttere,
    test: {
      tilstand: () => ({ lagt, tal: tæller.sum(), hel: ag.classList.contains('hel'), løst: erLøst, eget: Boolean(felt.querySelector('.ag-eget:not([hidden])')), forord: Boolean(felt.querySelector('.ag-forord')) }),
      visGåden,
      // Læg brikken med ordet latin på betydningen nr. i (forkert, hvis i ikke er ordets)
      læg(latin, i) {
        felt.querySelector(`.ag-brik[data-i="${ord.findIndex((o) => o.latin === latin)}"]`)?.click();
        felt.querySelector(`.ag-betydning[data-i="${i}"]`)?.click();
      },
      eget: (tekst) => {
        visEget();
        const inp = felt.querySelector('.ag-eget-felt');
        inp.value = tekst;
        inp.dispatchEvent(new Event('input'));
        return felt.querySelector('.ag-eget-række').textContent;
      },
    },
  };
  return api;
}

