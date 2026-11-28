// Opslag af slags 'ligning' i bogen (js/bog.js), E3 22. november 2026, docs/drejebog-einstein.md afsnit 6 og 7. Fælles for
// alle ti bøger, men i dag kun brugt af Einstein (tiden i E3, energien og tyngden i E4). Budgettet (planen, afsnit 3): Fremme
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
//          Alt står i dataene (E4): trinenes resultater (res), svaret, en del to efter svaret (efter), en linje, der står
//          fremme under boksen (ikke), nørd-tabellen og et skema (tyngden: 4 · 4 felter, hvor man trykker de dobbelte væk).
//   Efter det sidste led: L.ligning.slut (tiden: uret fra turen med turens farter, energien: E = mc² med tre masser,
//          tyngden: John Wheelers korte udgave). titel og tekst kan være funktioner af det valgte.
//
// ligningHTML(o, L, { harNæste, visning }) giver opslagets HTML, og lavLigning(felt, bogId, L, { rolig, bladrVidere })
// styrer det og giver { fjern(), test }.

import { hentBillede } from './hentning.js';
import { lavLagBokse } from './lag.js';

const NØGLE = 'atomlabBogSide'; // { bog: 'sat' } (skanning er standard)
const billeder = new Map(); // fil → Promise med et hentet <img>

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Tekst med små tal forneden: G_im, R_μν og T_im i teksterne om tyngden bliver til G med im under (E4)
const prosa = (t) => esc(t).replace(/_([a-zμνρσλ]+)/g, '<sub>$1</sub>');
// Et punkt i "For nørder" er en tekst eller { tekst, gaa, knap } med et link til et andet sted (Rømers bog, R3)
const punkt = (p) => (typeof p === 'string' ? prosa(p)
  : `${prosa(p.tekst)} <button class="link-knap" data-gaa="${esc(p.gaa)}">${esc(p.knap)} ›</button>`);

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
// lille tal foroven, _{…} lille tal forneden. Fra E4 (s. 641 og s. 845): \h{…} høj krøllet parentes, \i{op}{ned} to små
// indekser over hinanden (Γ med l foroven og im forneden), \s{…} et summetegn med indekset under, \c{a}{b} Christoffels
// krøllede parentes med a over b og \k{…} kapitæler (EINSTEIN i sidehovedet). Alt andet skrives, som det står (escaped)
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
        else if (k === 'p') ud += `<span class="lg-hoj"><span class="lg-par">(</span><span>${gruppe()}</span><span class="lg-par">)</span></span>`;
        else if (k === 'h') ud += `<span class="lg-hoj"><span class="lg-par">{</span><span>${gruppe()}</span><span class="lg-par">}</span></span>`;
        else if (k === 'i') { const op = gruppe(); const ned = gruppe(); ud += `<span class="lg-idx"><span>${op}</span><span>${ned}</span></span>`; }
        else if (k === 's') ud += `<span class="lg-sum">Σ<span>${gruppe()}</span></span>`;
        else if (k === 'c') { const a = gruppe(); const b = gruppe(); ud += `<span class="lg-hoj"><span class="lg-par">{</span><span class="lg-brok lg-uden"><span>${a}</span><span>${b}</span></span><span class="lg-par">}</span></span>`; }
        else if (k === 'k') ud += `<span class="lg-kap">${gruppe()}</span>`;
        continue;
      }
      if (c === '^') { i++; ud += `<sup>${gruppe()}</sup>`; continue; }
      if (c === '_') { i++; ud += `<sub>${gruppe()}</sub>`; continue; }
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
// Energien (drejebogen afsnit 8): massen bliver L/V² mindre (s. 641, l. 14), og under den Einsteins eget tal for V² (l. 20)
function ligningEnergien() {
  const g = (led, t) => `<span class="lg-g" data-led="${led}">${t}</span>`;
  const brøk = `<span class="lg-brok" data-led="brok">${g('L', '<i>L</i>')}${g('V2', '<i>V</i><sup>2</sup>')}</span>`;
  return `${g('masse', 'Masse')}<span class="lg-lig"> − </span>${brøk}`
    + `<span class="lg-stor-under">${g('tal', '9 · 10<sup>20</sup>')} = <i>V</i><sup>2</sup> i erg og gram</span>`;
}
// Tyngden (drejebogen afsnit 9): G_im = −κ(T_im − ½ g_im T), formel (2a) på s. 845. Alle de små i og m er ét led
function ligningTyngden() {
  const g = (led, t) => `<span class="lg-g" data-led="${led}">${t}</span>`;
  const im = '<sub data-led="im"><i>im</i></sub>';
  const halv = `<span data-led="halv"><span class="lg-brok"><span>1</span><span>2</span></span> ${g('g', `<i>g</i>${im}`)}<i>T</i></span>`;
  return `${g('G', `<i>G</i>${im}`)}<span class="lg-lig" data-led="lig"> = </span>−${g('kappa', 'κ')}`
    + `<span class="lg-hoj"><span class="lg-par">(</span><span>${g('T', `<i>T</i>${im}`)} − ${halv}</span><span class="lg-par">)</span></span>`;
}
const STORE = { tiden: ligningTiden, energien: ligningEnergien, tyngden: ligningTyngden };

function satHTML(side) {
  const [venstre = '', midt = '', højre = ''] = side.hoved;
  // Linjerne grupperes, så et glødende sted er én knap om sine linjer
  const grupper = [];
  let nr = 0;
  for (const l of side.linjer) {
    const x = typeof l === 'string' ? { t: l } : l;
    const sted = x.sted ?? null;
    const sidste = grupper.at(-1);
    if (!sidste || sidste.sted !== sted) grupper.push({ sted, linjer: [] });
    let html;
    // En formel på sin egen linje med Einsteins nummer til højre (s. 845). lille: den lange formel (6)
    if (x.f) html = `<span class="lg-formel${x.lille ? ' lg-formel-lille' : ''}"><span class="lg-fx">${matte(x.f)}</span>${x.nr ? `<span class="lg-fnr">${esc(x.nr)}</span>` : ''}</span>`;
    else {
      nr++;
      const ind = x.t.startsWith('>');
      // En kort linje (den sidste i et afsnit, "und", "Es ist also") strækkes ikke ud til kanten
      const kortLinje = x.t.replace(/[*>_^{}]|\\[a-z]/g, '').length < 40;
      html = `<span class="lg-linje${ind ? ' lg-ind' : ''}${kortLinje ? ' lg-kortlinje' : ''}${x.midt ? ' lg-midt' : ''}"${nr % 5 ? '' : ` data-nr="${nr}"`}>${matte(ind ? x.t.slice(1) : x.t)}</span>`;
    }
    grupper.at(-1).linjer.push(html);
  }
  // Sidehovedet: sidetallet til venstre eller højre og titlen i midten (kursiv i Annalen, kapitæler i Sitzungsberichte)
  return `<div class="lg-sat" lang="de" data-side="${side.id}"><span class="lg-sat-hoved"><span>${esc(venstre)}</span><span class="lg-sat-titel">${matte(midt)}</span><span>${esc(højre)}</span></span>`
    + grupper.map((gr) => (gr.sted ? `<button class="lg-sat-sted" data-sted="${gr.sted}" aria-pressed="false">${gr.linjer.join('')}</button>` : gr.linjer.join(''))).join('')
    + '</div>';
}

// Skemaet i "Regn selv" (tyngden): n · n felter med G og de to små tal. Felterne over den skrå linje (i < m) kan foldes
// oven på deres makker under linjen
const SMÅ = '₀₁₂₃₄₅₆₇₈₉';
const småTal = (n) => String(n).split('').map((c) => SMÅ[c]).join('');
function skemaHTML(n) {
  let ud = `<div class="lg-skema" role="group" aria-label="Skemaet med ${n * n} felter" style="--n:${n}">`;
  for (let i = 1; i <= n; i++) for (let m = 1; m <= n; m++) {
    const del = i < m ? 'over' : i > m ? 'under' : 'skrå';
    ud += `<button class="lg-felt lg-${del}" data-i="${i}" data-m="${m}" aria-label="G ${i} ${m}"><i>G</i>${småTal(i)}${småTal(m)}</button>`;
  }
  return `${ud}</div>`;
}
function regnHTML(r) {
  const n = r.nørd;
  const tabel = n.tabel ? `<table class="lg-tabel"><thead><tr>${n.tabel.kolonner.map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>`
    + n.tabel.rækker.map((række) => `<tr>${række.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('') + '</tbody></table>' : '';
  return `<details class="lag-boks lg-regn"><summary><strong>${esc(r.titel)}</strong></summary>`
    + `<div class="lg-regn-krop"><p class="lg-regn-intro">${prosa(r.intro)}</p>${r.skema ? skemaHTML(r.skema.n) : ''}<ol class="lg-regn-trin"></ol>`
    + '<div class="lg-regn-valg" role="group"></div><p class="lg-regn-svar" aria-live="polite"></p></div>'
    + `<details class="lg-regn-nørd"><summary>${esc(n.titel)}</summary><p>${prosa(n.tekst)}</p>${tabel}</details></details>`
    + (r.ikke ? `<p class="lg-ikke">${esc(r.ikke)}</p>` : '');
}

function bokse(L, bogId) {
  const liste = (lag, id, ærligt = false) => `<details class="lag-boks bo-lag${ærligt ? ' ærligt' : ' lag-mere'}" data-lag="${id}"><summary><strong>${esc(lag.titel)}</strong>${ærligt ? ` <span class="lag-kort">${esc(lag.linje)}</span>` : ''}</summary>`
    + `<ul>${lag.punkter.map((p) => `<li>${punkt(p)}</li>`).join('')}</ul></details>`;
  const l = L.linjer;
  return `<details class="lag-boks bs-linjer" data-lag="bog-linjer"><summary><strong>${esc(l.titel)}</strong> <span class="lag-kort">${esc(l.linje)}</span></summary>`
    + l.rækker.map((r) => `<div class="bs-række"><p class="bs-hvor">${esc(r.hvor)}</p><p class="bs-latin" lang="de">${prosa(r.tysk)}</p><p class="bs-dansk">${prosa(r.dansk)}</p></div>`).join('')
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
    + `<div class="lg-forord"><p class="lg-forord-sted">${esc(L.forord.sted)}</p><p class="lg-forord-tekst" data-ord-kun="${esc((L.ord ?? []).join(' '))}">${esc(L.forord.tekst)}</p></div>`
    + `<div class="lg-ligning"><div class="lg-stor" lang="de" data-ligning="${esc(o.ligning)}" aria-label="${esc(L.ligning.alt)}">${STORE[o.ligning]?.() ?? matte(L.ligning.navn)}</div>`
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
  const slut = L.ligning.slut;
  let valgt = slut.standard ?? null; // det valgte i slut (tiden: farten, energien: massen)
  const regn = { trin: 0, svar: null, forkert: null, foldet: new Set(), efter: false, skrå: false };
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
      ? `<p class="bs-navn">${esc(x.navn)}</p><p class="lg-kort">${prosa(x.kort)}</p>`
        + `<p class="bs-latin" lang="de"><span class="bs-mærke">Tysk, ${esc(x.linjer.toLowerCase())}</span> ${prosa(x.tysk)}</p>`
        + `<p class="bs-dansk"><span class="bs-mærke">På dansk</span> ${prosa(x.dansk)}</p>`
      : `<p class="bs-vælg">${esc(L.vælg)}</p>`;
  }

  // ---------- Led for led ----------
  function visLed() {
    const lg = L.ligning;
    for (const e of felt.querySelectorAll('.lg-stor [data-led]')) e.classList.toggle('lg-lyser', led >= 0 && !ledSlut && e.dataset.led === lg.led[led].id);
    if (ledSlut) {
      const hent = (x) => (typeof x === 'function' ? x(valgt) : x);
      ledFelt.innerHTML = (slut.intro ? `<p class="lg-slut-intro">${matte(slut.intro)}</p>` : '')
        + `<p><b>${esc(hent(slut.titel))}</b> ${esc(hent(slut.tekst))}</p>`
        + (slut.valg ? `<p class="lg-farter"><span>${esc(slut.vælg)}</span> ${slut.valg.map((x, i) => `<button class="lg-fart" data-fart="${x.v}" data-valg="${i}" aria-pressed="${x.v === valgt}">${esc(x.knap)}</button>`).join('')}</p>` : '')
        + (slut.idag ? `<p class="lg-idag">${matte(slut.idag)}</p>` : '');
      ledKnap.textContent = `${lg.forfra} ›`;
    } else if (led < 0) {
      ledFelt.innerHTML = `<p class="bs-vælg">${esc(lg.hjælp)}</p>`;
      ledKnap.textContent = `${lg.start} ›`;
    } else {
      const x = lg.led[led];
      ledFelt.innerHTML = `<p><b class="lg-led-navn" lang="de">${matte(x.navn)}</b> ${prosa(x.linje)}</p>${x.idag ? `<p class="lg-idag">${prosa(x.idag)}</p>` : ''}`;
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
  const skema = felt.querySelector('.lg-skema');
  const nøgle = (i, m) => `${Math.min(i, m)}-${Math.max(i, m)}`;
  const antalDobbelte = R.skema ? (R.skema.n * (R.skema.n - 1)) / 2 : 0;
  function visSkema() {
    if (!skema) return;
    skema.classList.toggle('lg-fold', regn.trin === R.skema.fold);
    for (const f of skema.querySelectorAll('.lg-felt')) {
      const i = Number(f.dataset.i), m = Number(f.dataset.m), k = nøgle(i, m);
      f.classList.toggle('lg-foldet', i < m && regn.foldet.has(k));
      f.classList.toggle('lg-dobbelt', i > m && regn.foldet.has(k));
      // Felterne over den skrå linje glider hen over deres makker (en celle er 1, og de står i, m og m, i)
      f.style.setProperty('--dx', String(i - m));
      f.style.setProperty('--dy', String(m - i));
      f.disabled = regn.trin !== R.skema.fold || i > m && regn.foldet.has(k) || f.classList.contains('lg-foldet');
    }
  }
  function visRegn() {
    regnTrin.innerHTML = R.trin.slice(0, regn.trin + 1).map((t, i) => `<li><span>${prosa(t.tekst)}</span>`
      + (i < regn.trin ? ` <b class="lg-regn-res">${esc(t.res)}</b>` : t.knap ? ` <button class="knap lille lg-regn-knap">${esc(t.knap)}</button>` : '')
      + '</li>').join('');
    const sidste = regn.trin === R.trin.length - 1;
    regnValg.innerHTML = sidste ? R.valg.map((v, i) => `<button class="knap lille lg-svar" data-svar="${i}"${regn.svar !== null ? ' disabled' : ''}${regn.svar === i ? ' aria-pressed="true"' : ''}>${esc(v.tekst)}</button>`).join('') : '';
    if (regn.svar !== null) {
      // Svaret, og en del to, når der er en (energien: Solen)
      const e = R.efter;
      regnSvar.innerHTML = `<b>${esc(R.svar)}</b> ${esc(R.svarMere ?? '')}`
        + (e ? `<span class="lg-regn-efter"><span>${esc(e.tekst)}</span> ${regn.efter ? `<b class="lg-regn-res">${esc(e.res)}</b>` : `<button class="knap lille lg-regn-del2">${esc(e.knap)}</button>`}</span>` : '')
        + ` <button class="knap lille svag lg-regn-igen">${esc(R.igen)} ›</button>`;
    } else if (regn.forkert !== null) {
      const v = R.valg[regn.forkert];
      regnSvar.textContent = `${R.vink[v.for]} ${R.vink.fælles}`.trim();
    } else regnSvar.textContent = regn.skrå ? R.vink.diagonal : '';
    visSkema();
  }
  function regnKnap() { if (regn.trin < R.trin.length - 1 && regn.trin !== R.skema?.fold) { regn.trin++; visRegn(); } }
  function vælgSvar(i) {
    if (regn.svar !== null || regn.trin !== R.trin.length - 1) return;
    if (R.valg[i].rigtig) { regn.svar = i; regn.forkert = null; }
    else regn.forkert = i;
    visRegn();
    if (!R.valg[i].rigtig) ryst(regnValg.querySelector(`[data-svar="${i}"]`), rolig);
  }
  // Et tryk på et felt i skemaet: Et felt over den skrå linje (eller dets makker under den) lægger sig oven på makkeren.
  // Et felt på den skrå linje har ingen makker (vink). Når alle de dobbelte er foldet, går regnestykket videre
  function fold(i, m) {
    if (!skema || regn.trin !== R.skema.fold) return;
    if (i === m) {
      regn.skrå = true;
      visRegn();
      ryst(skema.querySelector(`[data-i="${i}"][data-m="${m}"]`), rolig);
      return;
    }
    regn.skrå = false;
    regn.foldet.add(nøgle(i, m));
    if (regn.foldet.size >= antalDobbelte) regn.trin++;
    visRegn();
  }
  function regnForfra() {
    Object.assign(regn, { trin: 0, svar: null, forkert: null, foldet: new Set(), efter: false, skrå: false });
    visRegn();
  }

  const klik = (h) => {
    const g = h.target.closest('.lg-stor [data-led]');
    if (g) { vælgLed(g.dataset.led); return; }
    const f = h.target.closest('.lg-felt');
    if (f) { fold(Number(f.dataset.i), Number(f.dataset.m)); return; }
    const k = h.target.closest('button');
    if (!k) return;
    if (k.dataset.visning) sætVisning(k.dataset.visning);
    else if (k.dataset.valg) { valgt = slut.valg[Number(k.dataset.valg)].v; visLed(); }
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
    else if (k.classList.contains('lg-regn-del2')) { regn.efter = true; visRegn(); }
    else if (k.classList.contains('lg-regn-igen')) regnForfra();
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
      // Det valgte efter det sidste led (tiden: farten, energien: massen). fart() er det gamle navn fra E3
      fart(v) { valgt = v; visLed(); },
      valgt: () => valgt,
      vælgLed,
      regn: () => ({ ...regn, foldet: regn.foldet.size }),
      regnKnap,
      vælgSvar,
      fold,
      delTo() { if (regn.svar !== null) { regn.efter = true; visRegn(); } },
    },
  };
}

export { læsVisning };
