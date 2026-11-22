// Opslag af slags 'ligning' i bogen (js/bog.js), E3 22. november 2026, docs/drejebog-einstein.md afsnit 6 og 7. Fælles for
// alle ti bøger, men i dag kun brugt af Einstein (tiden, og energien og tyngden i E4). Budgettet (planen, afsnit 3): Fremme
// står kun forordet, siden og den store ligning. "Led for led" kommer frem ét led ad gangen, og "Regn selv", "Linje for
// linje", "For nørder" og "Ærligt talt" er lukkede foldebokse.
//
//   Siden: skanningen (hentes med hentBillede, første gang opslaget åbnes) med højst to glødende steder, eller den samme
//          side sat af os med bogens skrift og de samme linjer (kontakten "Skanning / Sat tekst", jeres tilføjelse 20.
//          november 2026). De glødende steder findes i begge udgaver, og kontakten husker valget for hele bogen
//          (localStorage atomlabBogSide, docs/kode/gemte-data.md).
//   Ligningen: bogstaverne er spændvidder med data-led inden i hinanden (v i v/V i (v/V)² i 1 − (v/V)² i √), så et tryk
//          på et bogstav vælger det inderste led, der rummer det. "Led for led ›" går gennem leddene i drejebogens orden.
//   Regn selv: ét trin ad gangen med en knap, og til sidst tre svar. Et forkert svar ryster lidt og giver et vink (B5).
//
// ligningHTML(o, L, { harNæste, visning }) giver opslagets HTML, og lavLigning(felt, bogId, L, { rolig, bladrVidere })
// styrer det og giver { fjern(), test }.

import { hentBillede } from './hentning.js';
import { lavLagBokse } from './lag.js';
import { bagudLet, bagudRigtig, bagudPrDøgn, ledForLedEksempel, dansk, småGram, LYSETS_FART, URETS_FARTER } from './data/opdagelser/einstein.js';

const NØGLE = 'atomlabBogSide'; // { bog: 'sat' } (skanning er standard)
const billeder = new Map(); // fil → Promise med et hentet <img>

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function læsVisning(bogId) {
  try { return JSON.parse(localStorage.getItem(NØGLE) ?? '{}')[bogId] === 'sat' ? 'sat' : 'skanning'; } catch { return 'skanning'; }
}
function gemVisning(bogId, v) {
  try {
    const alle = JSON.parse(localStorage.getItem(NØGLE) ?? '{}');
    if (v === 'sat') alle[bogId] = 'sat'; else delete alle[bogId];
    localStorage.setItem(NØGLE, JSON.stringify(alle));
  } catch { /* privat vindue: valget huskes kun, mens bogen er åben */ }
}

// Rodtegnet som en lille tegning, der strækkes til højden af det, der står under roden (stregen foroven er en kant på
// .lg-rodunder, så de mødes)
const RODTEGN = '<svg class="lg-rodtegn" viewBox="0 0 10 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0.5 11.5 L2.6 10.4 L5 19.3 L9.3 0.6 L10 0.6"/></svg>';
const rod = (indhold, attr = '') => `<span class="lg-rod"${attr}>${RODTEGN}<span class="lg-rodunder">${indhold}</span></span>`;

// Den lille opmærkning fra js/data/opdagelser/einstein.js: *x* kursiv, \r{…} rod, \b{a}{b} brøk, \p{…} høj parentes, ^{…}
// lille tal foroven. Alt andet skrives, som det står (escaped)
export function matte(s) {
  let i = 0;
  function gruppe() {
    // Læser fra '{' til den '}', der hører til
    if (s[i] !== '{') return '';
    i++;
    const ud = del(true);
    i++; // '}'
    return ud;
  }
  function del(iGruppe) {
    let ud = '';
    while (i < s.length) {
      const c = s[i];
      if (iGruppe && c === '}') return ud;
      if (c === '\\') {
        const k = s[i + 1];
        i += 2;
        if (k === 'r') ud += rod(gruppe());
        else if (k === 'b') { const a = gruppe(); const b = gruppe(); ud += `<span class="lg-brok"><span>${a}</span><span>${b}</span></span>`; }
        else if (k === 'p') ud += `<span class="lg-hoj"><span class="lg-par">(</span>${gruppe()}<span class="lg-par">)</span></span>`;
        continue;
      }
      if (c === '^') { i++; ud += `<sup>${gruppe()}</sup>`; continue; }
      if (c === '*') {
        const slut = s.indexOf('*', i + 1);
        ud += `<i>${esc(s.slice(i + 1, slut))}</i>`;
        i = slut + 1;
        continue;
      }
      ud += esc(c);
      i++;
    }
    return ud;
  }
  return del(false);
}

// Den store ligning τ = t√(1 − (v/V)²) med et data-led om hvert led (drejebogen afsnit 7)
function ligningTiden() {
  const g = (led, t) => `<span class="lg-g" data-led="${led}">${t}</span>`;
  const brøk = `<span class="lg-brok" data-led="brok">${g('v', '<i>v</i>')}${g('V', '<i>V</i>')}</span>`;
  const kvadrat = `<span class="lg-hoj" data-led="kvadrat"><span class="lg-par">(</span>${brøk}<span class="lg-par">)</span><sup>2</sup></span>`;
  return `${g('tau', '<i>τ</i>')}<span class="lg-lig"> = </span>${g('t', '<i>t</i>')}${rod(`<span data-led="enminus">1 − ${kvadrat}</span>`, ' data-led="rod"')}`;
}
const STORE = { tiden: ligningTiden };

function satHTML(side) {
  // Linjerne grupperes, så et glødende sted er én knap om sine linjer
  const grupper = [];
  let nr = 0;
  for (const l of side.linjer) {
    const x = typeof l === 'string' ? { t: l } : l;
    const sted = x.sted ?? null;
    const sidste = grupper.at(-1);
    if (!sidste || sidste.sted !== sted) grupper.push({ sted, linjer: [] });
    let html;
    if (x.f) html = `<span class="lg-formel">${matte(x.f)}</span>`;
    else {
      nr++;
      const ind = x.t.startsWith('>');
      // En kort linje (den sidste i et afsnit, "und", "Es ist also") strækkes ikke ud til kanten
      const kortLinje = x.t.replace(/[*>]|\\r|[{}^]/g, '').length < 40;
      html = `<span class="lg-linje${ind ? ' ind' : ''}${kortLinje ? ' kort' : ''}"${nr % 5 ? '' : ` data-nr="${nr}"`}>${matte(ind ? x.t.slice(1) : x.t)}</span>`;
    }
    grupper.at(-1).linjer.push(html);
  }
  return `<div class="lg-sat" lang="de"><span class="lg-sat-hoved"><span>${esc(side.hoved[0])}</span><i>${esc(side.hoved[1])}</i><span></span></span>`
    + grupper.map((gr) => (gr.sted ? `<button class="lg-sat-sted" data-sted="${gr.sted}" aria-pressed="false">${gr.linjer.join('')}</button>` : gr.linjer.join(''))).join('')
    + '</div>';
}

function regnHTML(r) {
  return `<details class="lag-boks lg-regn"><summary><strong>${esc(r.titel)}</strong></summary>`
    + `<div class="lg-regn-krop"><p class="lg-regn-intro">${esc(r.intro)}</p><ol class="lg-regn-trin"></ol>`
    + '<div class="lg-regn-valg" role="group"></div><p class="lg-regn-svar" aria-live="polite"></p></div>'
    + `<details class="lg-regn-nørd"><summary>${esc(r.nørd.titel)}</summary><p>${esc(r.nørd.tekst)}</p>`
    + `<table class="lg-tabel"><thead><tr>${r.nørd.kolonner.map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>`
    + r.nørd.farter.map((β) => `<tr><td>${dansk(β * 100)} %</td><td>${kort(bagudLet(β))}</td><td>${kort(bagudRigtig(β))}</td></tr>`).join('')
    + '</tbody></table></details></details>';
}
// Tre betydende cifre på dansk (0,00501 og 0,134)
export function kort(x) {
  return Number(x.toPrecision(3)).toString().replace('.', ','); // tallene her er alle over 0,00001, så ingen e-notation
}

function bokse(L, bogId) {
  const liste = (lag, id, ærligt = false) => `<details class="lag-boks bo-lag${ærligt ? ' ærligt' : ' lag-mere'}" data-lag="${id}"><summary><strong>${esc(lag.titel)}</strong>${ærligt ? ` <span class="lag-kort">${esc(lag.linje)}</span>` : ''}</summary>`
    + `<ul>${lag.punkter.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></details>`;
  const l = L.linjer;
  return `<details class="lag-boks bs-linjer" data-lag="bog-linjer"><summary><strong>${esc(l.titel)}</strong> <span class="lag-kort">${esc(l.linje)}</span></summary>`
    + l.rækker.map((r) => `<div class="bs-række"><p class="bs-hvor">${esc(r.hvor)}</p><p class="bs-latin" lang="de">${esc(r.tysk)}</p><p class="bs-dansk">${esc(r.dansk)}</p></div>`).join('')
    + `<p class="bs-note">${esc(l.note)}</p></details>`
    + liste(L.nørd, `bog-ligning-nørd-${bogId}`) + liste(L.ærligt, `bog-ligning-ærligt-${bogId}`, true);
}

export function ligningHTML(o, L, { bogId, harNæste = false, visning = 'skanning', navne }) {
  const k = (v) => `<button class="lg-valg" data-visning="${v}" aria-pressed="${visning === v}">${esc(navne[v])}</button>`;
  return `<div class="bog-opslag bog-ligning-opslag" data-visning="${visning}">`
    + `<div class="lg-top"><h3 class="bog-kapitel">${esc(o.titel)}</h3><div class="lg-kontakt" role="group" aria-label="${esc(navne.navn)}">${k('skanning')}${k('sat')}</div></div>`
    + '<div class="bs-krop lg-krop">'
    + `<div class="lg-side"><div class="bs-billede lg-skanning"><p class="bs-henter">Henter siden …</p></div>${satHTML(L.side)}<p class="lg-hvor">${esc(L.side.hvor)}</p></div>`
    + '<div class="bs-tekst lg-tekst">'
    + `<div class="lg-forord"><p class="lg-forord-sted">${esc(L.forord.sted)}</p><p class="lg-forord-tekst">${esc(L.forord.tekst)}</p></div>`
    + `<div class="lg-ligning"><div class="lg-stor" lang="de" aria-label="${esc(L.ligning.alt)}">${STORE[o.ligning]?.() ?? matte(L.ligning.navn)}</div>`
    + `<div class="lg-led" aria-live="polite"></div><div class="lg-led-knapper"><button class="knap lille lg-led-næste">${esc(L.ligning.start)} ›</button></div></div>`
    + `<div class="bs-steder">${L.steder.map((x) => `<button class="bs-sted-knap" data-sted="${x.id}" aria-pressed="false">${esc(x.navn)}</button>`).join('')}</div>`
    + '<div class="bs-forklaring" aria-live="polite"></div>'
    + regnHTML(L.regn) + bokse(L, bogId)
    + `<button class="knap lille svag lg-se" data-gaa="${esc(L.seSelv.gaa)}">${esc(L.seSelv.tekst)} ›</button>`
    + (harNæste ? `<button class="knap lg-videre">${esc(L.videre)} ›</button>` : '')
    + '</div></div></div>';
}

function hent(fil) {
  if (!billeder.has(fil)) {
    const p = hentBillede(fil);
    p.catch(() => billeder.delete(fil));
    billeder.set(fil, p);
  }
  return billeder.get(fil);
}

function ryst(el, rolig) {
  if (rolig || !el.animate) return;
  el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 320 });
}

export function lavLigning(felt, bogId, L, { rolig = false, bladrVidere = null } = {}) {
  let levende = true;
  let sted = null;
  let led = -1; // indekset i L.ligning.led, -1 før "Led for led"
  let ledSlut = false; // efter det sidste led: eksemplet
  let fart = 0.87; // farten i eksemplet (uret fra turen)
  const regn = { trin: 0, svar: null, forkert: null };
  const billede = felt.querySelector('.lg-skanning');
  const forklaring = felt.querySelector('.bs-forklaring');
  const ledFelt = felt.querySelector('.lg-led');
  const ledKnap = felt.querySelector('.lg-led-næste');
  const S = L.side;

  // ---------- Kontakten og siden ----------
  function sætVisning(v) {
    felt.dataset.visning = v;
    for (const k of felt.querySelectorAll('.lg-valg')) k.setAttribute('aria-pressed', String(k.dataset.visning === v));
    gemVisning(bogId, v);
    if (v === 'skanning') visSkanning();
  }
  let skanningVist = false;
  function visSkanning() {
    if (skanningVist) return;
    skanningVist = true;
    billede.style.setProperty('--forhold', `${S.b} / ${S.h}`);
    billede.style.setProperty('--r', String(S.b / S.h));
    billede.classList.add('henter');
    hent(S.fil).then((img) => {
      if (!levende) return;
      img.alt = S.alt;
      img.className = 'bs-side';
      billede.prepend(img);
      billede.insertAdjacentHTML('beforeend', L.steder.flatMap((x) => x.felter.map(([v, o, b, h]) =>
        `<button class="bs-glød" data-sted="${x.id}" aria-pressed="${x.id === sted}" aria-label="${esc(x.navn)}" style="left:${v}%;top:${o}%;width:${b}%;height:${h}%"></button>`)).join(''));
      billede.classList.remove('henter');
    }).catch(() => {
      if (levende) billede.querySelector('.bs-henter').textContent = 'Siden kunne ikke hentes. Prøv "Sat tekst".';
    });
  }

  // ---------- De glødende steder ----------
  function forklar() {
    const x = L.steder.find((s) => s.id === sted);
    for (const k of felt.querySelectorAll('[data-sted]')) k.setAttribute('aria-pressed', String(k.dataset.sted === sted));
    forklaring.innerHTML = x
      ? `<p class="bs-navn">${esc(x.navn)}</p><p class="lg-kort">${esc(x.kort)}</p>`
        + `<p class="bs-latin" lang="de"><span class="bs-mærke">Tysk, ${esc(x.linjer.toLowerCase())}</span> ${esc(x.tysk)}</p>`
        + `<p class="bs-dansk"><span class="bs-mærke">På dansk</span> ${esc(x.dansk)}</p>`
      : `<p class="bs-vælg">${esc(L.vælg)}</p>`;
  }

  // ---------- Led for led ----------
  function visLed() {
    const lg = L.ligning;
    for (const e of felt.querySelectorAll('.lg-stor [data-led]')) e.classList.toggle('lyser', led >= 0 && !ledSlut && e.dataset.led === lg.led[led].id);
    if (ledSlut) {
      const pct = (β) => `${dansk(β * 100)} %`;
      ledFelt.innerHTML = `<p><b>${esc(lg.eksempel.replace('{fart}', pct(fart)))}</b> ${esc(ledForLedEksempel(fart))}</p>`
        + `<p class="lg-farter"><span>${esc(lg.vælgFart)}</span> ${URETS_FARTER.map((β) => `<button class="lg-fart" data-fart="${β}" aria-pressed="${β === fart}">${pct(β)}</button>`).join('')}</p>`
        + `<p class="lg-idag">${esc(lg.idag)}</p>`;
      ledKnap.textContent = `${lg.forfra} ›`;
    } else if (led < 0) {
      ledFelt.innerHTML = `<p class="bs-vælg">${esc(lg.hjælp)}</p>`;
      ledKnap.textContent = `${lg.start} ›`;
    } else {
      const x = lg.led[led];
      ledFelt.innerHTML = `<p><b class="lg-led-navn" lang="de">${matte(x.navn.replace(/([vVt])/g, '*$1*'))}</b> ${esc(x.linje)}</p>${x.idag ? `<p class="lg-idag">${esc(x.idag)}</p>` : ''}`;
      ledKnap.textContent = `${lg.næste} ›`;
    }
  }
  function næsteLed() {
    if (ledSlut) { ledSlut = false; led = 0; }
    else if (led >= L.ligning.led.length - 1) ledSlut = true;
    else led++;
    visLed();
  }
  function vælgLed(id) {
    const n = L.ligning.led.findIndex((x) => x.id === id);
    if (n < 0) return;
    led = n;
    ledSlut = false;
    visLed();
  }

  // ---------- Regn selv ----------
  const R = L.regn;
  const regnTrin = felt.querySelector('.lg-regn-trin');
  const regnValg = felt.querySelector('.lg-regn-valg');
  const regnSvar = felt.querySelector('.lg-regn-svar');
  const β = R.β;
  const resultat = [
    `${dansk(β, 2)} · ${dansk(β, 2)} = ${dansk(β * β, 4)}`,
    `½ · ${dansk(β * β, 4)} = ${dansk(bagudLet(β), 5)}. Uret kommer ${dansk(bagudLet(β), 5)} sekund bagud for hvert sekund.`,
  ];
  function visRegn() {
    regnTrin.innerHTML = R.trin.slice(0, regn.trin + 1).map((t, i) => `<li><span>${esc(t.tekst)}</span>`
      + (i < regn.trin ? ` <b class="lg-regn-res">${esc(resultat[i])}</b>` : t.knap ? ` <button class="knap lille lg-regn-knap">${esc(t.knap)}</button>` : '')
      + '</li>').join('');
    const sidste = regn.trin === R.trin.length - 1;
    regnValg.innerHTML = sidste ? R.valg.map((v, i) => `<button class="knap lille lg-svar" data-svar="${i}"${regn.svar !== null ? ' disabled' : ''}${regn.svar === i ? ' aria-pressed="true"' : ''}>${esc(v.tekst)}</button>`).join('') : '';
    if (regn.svar !== null) {
      const bil = bagudPrDøgn(100 / 3.6 / LYSETS_FART);
      regnSvar.innerHTML = `<b>${dansk(bagudPrDøgn(β), 1)} sekunder om dagen.</b> Ved 100 km/t er det kun ${småGram(bil, 11)} sekund. Så lidt kan ingen mærke. <button class="knap lille svag lg-regn-igen">${esc(R.igen)} ›</button>`;
    } else if (regn.forkert !== null) {
      const v = R.valg[regn.forkert];
      regnSvar.textContent = `${R.vink[v.for]} ${R.vink.fælles}`;
    } else regnSvar.textContent = '';
  }
  function regnKnap() { if (regn.trin < R.trin.length - 1) { regn.trin++; visRegn(); } }
  function vælgSvar(i) {
    if (regn.svar !== null || regn.trin !== R.trin.length - 1) return;
    if (R.valg[i].rigtig) { regn.svar = i; regn.forkert = null; }
    else regn.forkert = i;
    visRegn();
    if (!R.valg[i].rigtig) ryst(regnValg.querySelector(`[data-svar="${i}"]`), rolig);
  }

  const klik = (h) => {
    const g = h.target.closest('.lg-stor [data-led]');
    if (g) { vælgLed(g.dataset.led); return; }
    const k = h.target.closest('button');
    if (!k) return;
    if (k.dataset.visning) sætVisning(k.dataset.visning);
    else if (k.dataset.fart) { fart = Number(k.dataset.fart); visLed(); }
    else if (k.dataset.sted) {
      const på = k.classList.contains('bs-glød') || k.classList.contains('lg-sat-sted');
      sted = sted === k.dataset.sted && på ? null : k.dataset.sted;
      forklar();
      // Et tryk på siden: forklaringen står under siden på højkant, så den rulles frem
      if (sted && på) forklaring.scrollIntoView({ block: 'nearest', behavior: rolig ? 'auto' : 'smooth' });
    }
    else if (k.classList.contains('lg-led-næste')) næsteLed();
    else if (k.classList.contains('lg-regn-knap')) regnKnap();
    else if (k.dataset.svar) vælgSvar(Number(k.dataset.svar));
    else if (k.classList.contains('lg-regn-igen')) { Object.assign(regn, { trin: 0, svar: null, forkert: null }); visRegn(); }
    else if (k.classList.contains('lg-videre')) bladrVidere?.();
  };
  felt.addEventListener('click', klik);
  lavLagBokse(felt);
  forklar();
  visLed();
  visRegn();
  if (felt.dataset.visning === 'skanning') visSkanning();

  return {
    fjern() { levende = false; felt.removeEventListener('click', klik); },
    test: {
      visning: () => felt.dataset.visning,
      sætVisning,
      hentet: () => skanningVist && !billede.classList.contains('henter'),
      sted: () => sted,
      vælg(id) { sted = id; forklar(); },
      led: () => (ledSlut ? 'slut' : L.ligning.led[led]?.id ?? null),
      næsteLed,
      fart(β) { fart = β; visLed(); },
      vælgLed,
      regn: () => ({ ...regn }),
      regnKnap,
      vælgSvar,
    },
  };
}

export { læsVisning };
