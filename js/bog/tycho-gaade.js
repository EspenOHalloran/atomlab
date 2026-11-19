// Gåden i bogen om Tycho Brahe: "Tychos tal" (Opdagelserne, docs/drejebog-tycho.md, afsnit 6, T3 19. november 2026).
// Tychos kort over Cassiopeia (s. B1b) i træsnitsstil med bogstaverne A-H og uden I, den nye stjerne. Tre stjerner har
// Tychos tal (B Schedir 7° 55′, G stolens top 5° 21′ og D hoften 5° 1′). Et tryk slår en cirkel med tallet som en
// passer, og den nye stjerne står der, hvor cirklerne mødes. To cirkler mødes to steder, og det tredje tal vælger det
// rigtige (det, man selv finder, stilguiden C3). Et tryk på mødestedet tegner stjernen I, og "Og i dag?" viser nutidens
// tal. Man kan ikke fejle: Et forkert sted ryster bare lidt.
//
// lavGåde(felt, _, { rolig, tekster, løst, påLøst, påVidere }) fylder opslagets felt (.bog-scene fra js/bog.js) med
// forordet (broen fra turen) og så gåden, og giver { fjern(), test }. Teksterne er GÅDE i js/data/opdagelser/tycho.js.
// Cirklerne regnes på himmelkuglen om stjernernes rigtige pladser (cirkel og mødes i dataene) og tegnes på samme kort
// (påKortet), så de mødes inden for 8′ af resten af supernovaen (testen i Node). Tegningen er et SVG, og knapperne
// ligger oven på i % af kortet (mindst 44 px). Med ROLIG tegnes cirklerne med det samme.

import {
  CASSIOPEIA, KORT_EKSTRA, NY_STJERNE, TYCHOS_TAL, påKortet, cirkel, mødes, talGrader, afstand,
} from '../data/opdagelser/tycho.js';
import { træsnitStjerne } from '../bog.js';

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const HM = ' '; // hårdt mellemrum i "7° 55′"
const talTekst = (t) => `${t.grader}°${HM}${t.minutter}′`; // som Tycho skrev dem: 5° 1′

// Kortets ramme i grader (påKortet: x mod højre, y op) og skalaen i SVG-enheder pr. grad
const X0 = -9.6, X1 = 8.0, Y0 = -5.0, Y1 = 6.4, S = 10;
export const KORT_B = (X1 - X0) * S, KORT_H = (Y1 - Y0) * S;
const KANT = 6; // den indre ramme (cirklerne klippes af den)
const sx = (x) => (x - X0) * S, sy = (y) => (Y1 - y) * S;
const indenfor = (p) => sx(p.x) > KANT && sx(p.x) < KORT_B - KANT && sy(p.y) > KANT && sy(p.y) < KORT_H - KANT;
const TEGNE_TID = 600; // ms for en cirkel (passeren går rundt)
const PÅ_CIRKLEN = 0.2; // grader: et mødested ligger på alle tre cirkler, hvis det er så tæt på hver af dem

const stjerne = (id) => CASSIOPEIA.find((s) => s.id === id);

function ryst(el, rolig) {
  if (!el) return;
  if (rolig || !el.animate) {
    el.classList.add('ryster');
    setTimeout(() => el.classList.remove('ryster'), 300);
    return;
  }
  el.animate([{ transform: 'translate(-50%, -50%)' }, { transform: 'translate(calc(-50% - 5px), -50%)' }, { transform: 'translate(calc(-50% + 5px), -50%)' }, { transform: 'translate(-50%, -50%)' }], { duration: 280 });
}

// Kortet som SVG: den dobbelte ramme med skrå hjørner som i bogen, stjernerne A-H og en tom plads til cirklerne
function kortSVG(alt, id) {
  const stjerner = påKortet([...CASSIOPEIA, ...KORT_EKSTRA]).map((s) => {
    const r = Math.max(3, 7.4 - 1.15 * s.mag);
    return `<g class="tg-stjerne" data-tycho="${s.tycho}">${træsnitStjerne(sx(s.x), sy(s.y), r, 8)}`
      + `<text x="${(sx(s.x) + r * 0.2).toFixed(1)}" y="${(sy(s.y) + r + 6.5).toFixed(1)}" class="tg-bogstav">${s.tycho}</text></g>`;
  }).join('');
  const k = KANT;
  return `<svg viewBox="0 0 ${KORT_B} ${KORT_H}" role="img" aria-label="${esc(alt)}">`
    + `<defs><clipPath id="${id}"><rect x="${k}" y="${k}" width="${KORT_B - 2 * k}" height="${KORT_H - 2 * k}"/></clipPath></defs>`
    + `<rect x="1.5" y="1.5" width="${KORT_B - 3}" height="${KORT_H - 3}" class="bog-træsnit-ramme"/>`
    + `<rect x="${k}" y="${k}" width="${KORT_B - 2 * k}" height="${KORT_H - 2 * k}" class="bog-træsnit-ramme tynd"/>`
    + [[1.5, 1.5, k, k], [KORT_B - 1.5, 1.5, KORT_B - k, k], [1.5, KORT_H - 1.5, k, KORT_H - k], [KORT_B - 1.5, KORT_H - 1.5, KORT_B - k, KORT_H - k]]
      .map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="bog-træsnit-ramme tynd"/>`).join('')
    + `<g class="tg-cirkler" clip-path="url(#${id})"></g>`
    + `<g class="bog-træsnit">${stjerner}</g>`
    + '<g class="tg-møder"></g><g class="tg-ny"></g><g class="tg-passer"></g>'
    + '</svg>';
}

let kortNr = 0;

export function lavGåde(felt, _anagram, { rolig = false, tekster = {}, løst = false, påLøst = null, påVidere = null, medForord = true } = {}) {
  const T = tekster;
  const L = T.linjer ?? {};
  let levende = true;
  let erLøst = løst;
  let fundet = false;
  const tegnet = []; // de tal (TYCHOS_TAL), der har fået en cirkel, i rækkefølge
  let ramme = 0;

  felt.classList.add('tg-felt');
  felt.innerHTML = '<div class="tg">'
    + `<div class="tg-kort">${kortSVG(T.alt ?? '', `tg-klip-${++kortNr}`)}<div class="tg-knapper"></div></div>`
    + '<div class="tg-side">'
    + '<p class="hs-linje tg-linje" aria-live="polite"></p>'
    + `<div class="tg-tal" role="group" aria-label="${esc(T.talTekst ?? '')}">${TYCHOS_TAL.map((t) => `<button class="tg-tal-knap" data-tycho="${t.tycho}" aria-pressed="false"><b>${t.tycho}</b> <span>${esc(t.navn)}</span> <i>${talTekst(t)}</i></button>`).join('')}</div>`
    + '<div class="tg-efter" hidden></div>'
    + '</div></div>';
  const tg = felt.querySelector('.tg');
  const svg = felt.querySelector('svg');
  const knapper = felt.querySelector('.tg-knapper');
  const linje = felt.querySelector('.tg-linje');
  const efter = felt.querySelector('.tg-efter');

  // Introduktionen før gåden (som Huygens' "Hemmeligheden"): en side bogtekst med det store forbogstav og "Prøv gåden ›"
  const F = T.forord;
  if (F && medForord) {
    tg.hidden = true;
    tg.insertAdjacentHTML('beforebegin', '<div class="ag-forord">'
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
    tg.hidden = false;
    felt.scrollTop = 0;
    if (!rolig && tg.animate) tg.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
  }

  // Knapperne oven på kortet: de tre stjerner med tal og (senere) mødestederne
  const knap = (cls, p, label, data = {}) => {
    const b = document.createElement('button');
    b.className = `tg-punkt ${cls}`;
    b.style.left = `${(sx(p.x) / KORT_B) * 100}%`;
    b.style.top = `${(sy(p.y) / KORT_H) * 100}%`;
    b.setAttribute('aria-label', label);
    Object.assign(b.dataset, data);
    knapper.append(b);
    return b;
  };
  const påKort = påKortet(CASSIOPEIA);
  for (const t of TYCHOS_TAL) knap('tg-stjerne-knap', påKort.find((s) => s.id === t.id), `${t.tycho}, ${t.navn}: ${talTekst(t)}`, { tycho: t.tycho });

  const sætLinje = (tekst) => {
    const t = tekst + (erLøst && !fundet && tekst === L.start ? ` · ${T.løstFør ?? ''}` : '');
    if (linje.textContent !== t) linje.textContent = t;
    linje.classList.toggle('løst', fundet);
  };

  // En cirkel om tallets stjerne: tegnes rundt på 0,6 s, mens passerens arm følger spidsen
  function slå(t) {
    if (fundet || tegnet.includes(t)) return;
    tegnet.push(t);
    const s = stjerne(t.id), r = talGrader(t);
    const pkt = påKortet(cirkel(s, r, 160));
    const d = pkt.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join('');
    const ns = 'http://www.w3.org/2000/svg';
    const sti = document.createElementNS(ns, 'path');
    sti.setAttribute('d', d);
    sti.setAttribute('class', 'tg-cirkel');
    sti.setAttribute('pathLength', '1');
    sti.dataset.tycho = t.tycho;
    svg.querySelector('.tg-cirkler').append(sti);
    // Tallet ved stjernens bogstav
    const c = påKortet([s])[0];
    const tal = document.createElementNS(ns, 'text');
    tal.setAttribute('x', (sx(c.x) + 6).toFixed(1));
    tal.setAttribute('y', (sy(c.y) - 4).toFixed(1));
    tal.setAttribute('class', 'tg-tal-på');
    tal.textContent = talTekst(t);
    svg.querySelector('.tg-møder').before(tal);
    for (const k of felt.querySelectorAll(`[data-tycho="${t.tycho}"]`)) {
      if (k.matches('button')) k.setAttribute('aria-pressed', 'true');
    }
    if (!rolig && sti.animate) {
      sti.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: TEGNE_TID, easing: 'ease-in-out' });
      passer(c, pkt);
    }
    visMøder();
  }

  // Passerens arm fra stjernen ud til spidsen, der går rundt (kun mens cirklen tegnes)
  function passer(c, pkt) {
    const g = svg.querySelector('.tg-passer');
    g.innerHTML = `<line x1="${sx(c.x).toFixed(1)}" y1="${sy(c.y).toFixed(1)}" class="tg-passer-arm"/><circle cx="${sx(c.x).toFixed(1)}" cy="${sy(c.y).toFixed(1)}" r="1.6" class="tg-passer-hængsel"/>`;
    const arm = g.querySelector('line');
    const start = performance.now();
    cancelAnimationFrame(ramme);
    const trin = (nu) => {
      if (!levende) return;
      const f = Math.min(1, (nu - start) / TEGNE_TID);
      const e = f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f); // som ease-in-out
      const p = pkt[Math.round(e * (pkt.length - 1))];
      arm.setAttribute('x2', sx(p.x).toFixed(1));
      arm.setAttribute('y2', sy(p.y).toFixed(1));
      if (f < 1) ramme = requestAnimationFrame(trin);
      else g.innerHTML = '';
    };
    ramme = requestAnimationFrame(trin);
  }

  // Mødestederne for de cirkler, der er tegnet. Ét sted er "rigtigt", når det ligger på alle tre cirkler
  function mødesteder() {
    const steder = [];
    for (let i = 0; i < tegnet.length; i++) {
      for (let j = i + 1; j < tegnet.length; j++) {
        const a = tegnet[i], b = tegnet[j];
        for (const p of mødes(stjerne(a.id), talGrader(a), stjerne(b.id), talGrader(b))) {
          const k = påKortet([p])[0];
          if (!indenfor(k)) continue;
          const nær = steder.find((x) => Math.hypot(x.x - k.x, x.y - k.y) < 0.5);
          if (nær) continue;
          const rigtig = tegnet.length === 3 && tegnet.every((t) => Math.abs(afstand(p, stjerne(t.id)) - talGrader(t)) < PÅ_CIRKLEN);
          steder.push({ ...k, ra: p.ra, dek: p.dek, rigtig });
        }
      }
    }
    return steder;
  }

  function visMøder() {
    const g = svg.querySelector('.tg-møder');
    for (const k of knapper.querySelectorAll('.tg-møde-knap')) k.remove();
    g.innerHTML = '';
    const steder = tegnet.length >= 2 ? mødesteder() : [];
    steder.forEach((p, i) => {
      g.insertAdjacentHTML('beforeend', `<circle cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="3.2" class="tg-møde${p.rigtig ? ' glød' : ''}"/>`);
      const b = knap('tg-møde-knap', p, `Mødested ${i + 1}`, { rigtig: p.rigtig ? 'ja' : 'nej' });
      b.addEventListener('click', () => vælgSted(b, p));
    });
    sætLinje(tegnet.length === 0 ? L.start : tegnet.length === 1 ? L.én : tegnet.length === 2 ? L.to : L.tre);
  }

  function vælgSted(b, p) {
    if (fundet) return;
    if (tegnet.length < 3) { sætLinje(L.begge); ryst(b, rolig); return; }
    if (!p.rigtig) { sætLinje(L.kunTo); ryst(b, rolig); return; }
    find();
  }

  // Løsningen: stjernen I tegnes, hvor alle tre cirkler mødes (som i bogen), og "Og i dag?" kommer frem
  function find() {
    fundet = true;
    const ny = påKortet([NY_STJERNE])[0];
    const g = svg.querySelector('.tg-ny');
    g.innerHTML = `<g class="tg-ny-stjerne bog-træsnit">${træsnitStjerne(sx(ny.x), sy(ny.y), 7.5, 12)}</g>`
      + `<text x="${(sx(ny.x) - 15).toFixed(1)}" y="${(sy(ny.y) + 2).toFixed(1)}" class="tg-bogstav tg-ny-bogstav">I</text>`;
    const st = g.querySelector('.tg-ny-stjerne');
    if (!rolig && st.animate) st.animate([{ transform: 'scale(0.2)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.2,.7,.3,1.3)' });
    svg.querySelector('.tg-møder').innerHTML = '';
    for (const k of knapper.querySelectorAll('.tg-møde-knap')) k.remove();
    tg.classList.add('fundet');
    sætLinje(L.løst);
    if (!erLøst) påLøst?.();
    erLøst = true;
    visEfter();
  }

  function visEfter() {
    const D = T.iDag ?? {};
    efter.innerHTML = `<div class="tg-idag"><p class="tg-idag-titel">${esc(D.titel ?? '')}</p>`
      + `<table><tbody>${TYCHOS_TAL.map((t) => `<tr><th>${t.tycho} ${esc(t.navn)}</th><td>${talTekst(t)}</td><td>i dag ${esc(t.iDag.replace(' ', HM))}</td></tr>`).join('')}</tbody></table>`
      + `<p>${esc(D.tekst ?? '')}</p><p class="tg-småt">${esc(D.note ?? '')}</p></div>`
      + `<div class="tg-videre-række">${påVidere && T.videre ? `<button class="knap tg-videre">${esc(T.videre)} ›</button>` : ''}`
      + `<button class="knap tg-igen">${esc(T.igen ?? 'Prøv igen')}</button></div>`;
    efter.hidden = false;
  }
  efter.addEventListener('click', (h) => {
    if (h.target.closest('.tg-videre')) påVidere?.();
    else if (h.target.closest('.tg-igen')) {
      fjern();
      felt.classList.remove('tg-felt');
      Object.assign(api, lavGåde(felt, null, { rolig, tekster, løst: true, påLøst, påVidere, medForord: false }));
    }
  });

  const klik = (h) => {
    const k = h.target.closest('.tg-tal-knap, .tg-stjerne-knap');
    if (!k) return;
    const t = TYCHOS_TAL.find((x) => x.tycho === k.dataset.tycho);
    if (t) slå(t);
  };
  felt.addEventListener('click', klik);

  function fjern() {
    levende = false;
    cancelAnimationFrame(ramme);
    felt.removeEventListener('click', klik);
    felt.replaceChildren();
  }

  sætLinje(L.start);

  const api = {
    fjern,
    test: {
      tilstand: () => ({
        tegnet: tegnet.map((t) => t.tycho),
        møder: [...knapper.querySelectorAll('.tg-møde-knap')].map((k) => k.dataset.rigtig === 'ja'),
        fundet, løst: erLøst, linje: linje.textContent,
        forord: Boolean(felt.querySelector('.ag-forord')),
      }),
      visGåden,
      slå: (bogstav) => { const t = TYCHOS_TAL.find((x) => x.tycho === bogstav); if (t) slå(t); },
      // Tryk på det rigtige (ja) eller et forkert mødested
      vælg: (rigtig = true) => knapper.querySelector(`.tg-møde-knap[data-rigtig="${rigtig ? 'ja' : 'nej'}"]`)?.click(),
      mødesteder,
    },
  };
  return api;
}
