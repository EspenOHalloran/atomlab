// Tavlen med de tre ting ("Under isen", trin 4-5, docs/drejebog-maaner.md afsnit 6). Rækkerne Vand, Energi, Stoffer og
// Liv, søjlerne Europa og Enceladus. Et felt får farven fra det bedste kort i det (grøn = målt, gul = regnet eller
// gættet, grå = ukendt), og Liv er altid grå. Dataene står i js/data/maaner/tavle.js.
//
// I trin 4 falder fire kort ud af Cassini (slip). De ligger i bunken øverst, og man trækker hvert kort hen på en række
// (eller trykker på kortet og så på rækken, så det også virker med tastatur). Lægges et kort på en forkert række, glider
// det selv hen til den rigtige, og et vink forklarer (stilguiden B5: ingen point og ingen rød farve). Bagefter fylder
// Europas søjle sig selv, kort for kort (fyldEuropa, styret af opdater(dt), så det står stille under pause).
// I trin 5 trykker man på rækken Liv. Et tryk på et kort på tavlen åbner et "Hvordan ved vi det?"-kort (visHvorfor).
// Under forløbet står tavlen under scenen (eller til højre på brede skærme, style.css), i laboratoriet i 3D-vinduet,
// hvor den kan foldes ind.

import { visHvorfor } from '../lag.js';
import { lyd } from '../lyd.js';
import { ROLIG } from '../scene3d.js';
import { MÅNER, RÆKKER, FARVER, LIV, KORT, kortMed, feltFarve } from '../data/maaner/tavle.js';

const FYLD_S = 0.7; // sekunder mellem Europas kort, når søjlen fylder sig selv
const TRÆK_PX = 6; // så langt skal fingeren flytte sig, før et tryk bliver et træk

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// vink(tekst): en kort linje i forløbets linje (forkert række). lagt(kort): et kort er lagt (af brugeren eller selv).
// liv(): rækken Liv er trykket. forfra(): knappen "↺" (kun i laboratoriet, style.css skjuler den i turen).
export function lavTavle({ vink = () => {}, lagt = () => {}, liv = () => {}, forfra = null } = {}) {
  const el = document.createElement('div');
  el.className = 'ui-tavle';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Tavlen: vand, energi og stoffer på Europa og Enceladus');
  const nøgle = FARVER.map((f) => `<span><i style="background:${f.farve}"></i>${f.navn}</span>`).join('');
  el.innerHTML = `<div class="tv-hoved"><button class="tv-fold" aria-expanded="true"><span class="tv-pil" aria-hidden="true">▾</span> Tavlen</button><span class="tv-nøgle">${nøgle}</span>${forfra ? '<button class="tv-forfra" title="Læg kortene fra Cassini igen" aria-label="Læg kortene fra Cassini igen">↺</button>' : ''}</div>
    <div class="tv-krop">
      <div class="tv-bunke" hidden></div>
      <div class="tv-gitter">
        <span></span>${MÅNER.map((m) => `<span class="tv-måne">${m.navn}</span>`).join('')}
        ${RÆKKER.map((r) => `<button class="tv-række" data-raekke="${r.id}"><span aria-hidden="true">${r.ikon}</span> ${r.navn}</button>`
          + MÅNER.map((m) => `<div class="tv-felt" data-raekke="${r.id}" data-maane="${m.id}" data-farve="ukendt"></div>`).join('')).join('')}
      </div>
      <p class="tv-linje" hidden></p>
    </div>`;
  const bunke = el.querySelector('.tv-bunke');
  const linje = el.querySelector('.tv-linje');
  const felt = (måne, række) => el.querySelector(`.tv-felt[data-maane="${måne}"][data-raekke="${række}"]`);

  let lagte = new Set(); // id'er på kortene på tavlen
  let iBunke = []; // id'er på kortene i bunken
  let fyld = null; // { kø: [id], t } mens Europas søjle fylder sig selv
  let livVist = false;
  let valgt = null; // kortet, man har trykket på i bunken (og så trykker på en række)

  // ---------- Tegningen ----------
  function tegnFelter() {
    for (const m of MÅNER) {
      for (const r of RÆKKER) {
        const f = felt(m.id, r.id);
        const kort = KORT.filter((k) => lagte.has(k.id) && k.måne === m.id && k.række === r.id);
        f.dataset.farve = feltFarve(kort, r.id);
        if (r.id === 'liv') {
          const tekst = livVist ? LIV.felt : '?';
          if (f.textContent !== tekst) f.textContent = tekst;
          continue;
        }
        // Kun kort, der ikke står der i forvejen, tegnes (så et kort, der glider, ikke tegnes om)
        for (const c of [...f.children]) if (!lagte.has(c.dataset.kort)) c.remove();
        for (const k of kort) {
          if (f.querySelector(`[data-kort="${k.id}"]`)) continue;
          const b = document.createElement('button');
          b.className = 'tv-kort';
          b.dataset.kort = k.id;
          b.dataset.farve = k.farve;
          b.textContent = k.titel;
          b.title = `${k.hvem}. Tryk: Hvordan ved vi det?`;
          f.append(b);
        }
      }
    }
    linje.hidden = !livVist;
    linje.textContent = livVist ? LIV.tekst : '';
  }
  function tegnBunke() {
    for (const c of [...bunke.children]) if (!iBunke.includes(c.dataset.kort)) c.remove();
    for (const id of iBunke) {
      if (bunke.querySelector(`[data-kort="${id}"]`)) continue;
      const k = kortMed(id);
      const b = document.createElement('button');
      b.className = 'tv-løs';
      b.dataset.kort = id;
      b.innerHTML = `<b>${esc(k.titel)}</b><small>${esc(k.hvem)}</small>`;
      b.setAttribute('aria-label', `${k.titel}. Træk kortet hen på en række, eller tryk på det og så på rækken.`);
      b.classList.toggle('falder', !ROLIG);
      bunke.append(b);
    }
    bunke.hidden = iBunke.length === 0;
    for (const c of bunke.children) c.classList.toggle('valgt', c.dataset.kort === valgt);
  }
  function tegn() { tegnFelter(); tegnBunke(); }

  // ---------- At lægge et kort ----------
  // fra: det sted, kortet blev sluppet (skærmens punkt), så det kan glide derfra hen til sin plads
  function læg(id, række, fra = null) {
    const k = kortMed(id);
    if (!k || lagte.has(id)) return false;
    const rigtig = k.række === række;
    iBunke = iBunke.filter((x) => x !== id);
    if (valgt === id) valgt = null;
    lagte.add(id);
    tegn();
    const nyt = felt(k.måne, k.række).querySelector(`[data-kort="${id}"]`);
    // Det glider fra det sted, det blev sluppet, hen til den rigtige række (FLIP)
    if (nyt && fra && !ROLIG) {
      const r = nyt.getBoundingClientRect();
      nyt.style.transition = 'none';
      nyt.style.transform = `translate(${fra.x - (r.left + r.width / 2)}px, ${fra.y - (r.top + r.height / 2)}px)`;
      void nyt.offsetWidth;
      nyt.style.transition = `transform ${rigtig ? 0.25 : 0.7}s ease`;
      nyt.style.transform = '';
    }
    nyt?.classList.add('ny');
    if (!rigtig && række) vink(k.forkert ?? '');
    else vink('');
    lyd.klik?.();
    lagt(k);
    return true;
  }

  // ---------- Træk og tryk ----------
  let træk = null; // { id, knap, x0, y0, id: pointerId, i gang }
  function ned(h) {
    const b = h.target.closest('.tv-løs');
    if (!b || h.button > 0) return;
    træk = { id: b.dataset.kort, knap: b, x0: h.clientX, y0: h.clientY, p: h.pointerId, igang: false };
    b.setPointerCapture?.(h.pointerId);
  }
  function flyt(h) {
    if (!træk || h.pointerId !== træk.p) return;
    const dx = h.clientX - træk.x0, dy = h.clientY - træk.y0;
    if (!træk.igang && Math.hypot(dx, dy) < TRÆK_PX) return;
    træk.igang = true;
    træk.knap.classList.add('trækkes');
    træk.knap.style.transform = `translate(${dx}px, ${dy}px)`;
    for (const r of el.querySelectorAll('.tv-række')) r.classList.toggle('over', r === rækkeUnder(h.clientX, h.clientY, true));
  }
  // Rækken under punktet: et felt eller rækkens navn (under kortet, der trækkes)
  function rækkeUnder(x, y, knap = false) {
    const e = document.elementsFromPoint(x, y).map((x) => x.closest('[data-raekke]')).find((x) => x && el.contains(x));
    if (!e) return null;
    return knap ? el.querySelector(`.tv-række[data-raekke="${e.dataset.raekke}"]`) : e.dataset.raekke;
  }
  function op(h) {
    if (!træk || h.pointerId !== træk.p) return;
    const t = træk;
    træk = null;
    for (const r of el.querySelectorAll('.tv-række')) r.classList.remove('over');
    if (!t.igang) return; // et tryk: klik-lytteren vælger kortet
    t.knap.classList.remove('trækkes');
    const række = rækkeUnder(h.clientX, h.clientY);
    if (række && række !== 'liv') { t.knap.dataset.trukket = '1'; læg(t.id, række, { x: h.clientX, y: h.clientY }); }
    else { t.knap.style.transform = ''; t.knap.dataset.trukket = '1'; }
  }
  el.addEventListener('pointerdown', ned);
  el.addEventListener('pointermove', flyt);
  el.addEventListener('pointerup', op);
  el.addEventListener('pointercancel', op);

  el.addEventListener('click', (h) => {
    const løs = h.target.closest('.tv-løs');
    if (løs) {
      if (løs.dataset.trukket) { delete løs.dataset.trukket; return; } // (et træk er ikke et tryk)
      valgt = valgt === løs.dataset.kort ? null : løs.dataset.kort;
      lyd.klik?.();
      tegnBunke();
      return;
    }
    const kort = h.target.closest('.tv-kort');
    if (kort && !valgt) {
      const k = kortMed(kort.dataset.kort);
      lyd.klik?.();
      visHvorfor({ spørgsmål: k.spørgsmål, svar: `${k.svar}\n\nHvem og hvornår: ${k.hvem}.` }, kort);
      return;
    }
    const række = h.target.closest('[data-raekke]')?.dataset.raekke;
    if (!række) return;
    if (række === 'liv') { visLiv(); return; }
    if (valgt) læg(valgt, række, null);
  });
  el.querySelector('.tv-forfra')?.addEventListener('click', () => { lyd.klik?.(); vink(''); forfra(); });
  const fold = el.querySelector('.tv-fold');
  fold.addEventListener('click', () => foldInd(!el.classList.contains('foldet')));
  function foldInd(til) {
    el.classList.toggle('foldet', til);
    fold.setAttribute('aria-expanded', String(!til));
  }

  function visLiv() {
    if (livVist) return;
    livVist = true;
    lyd.klik?.();
    tegnFelter();
    liv();
  }

  tegn();
  return {
    el,
    // Tavlen som efter et trin: kortene fra trinet og de tidligere ligger der, bunken er tom
    // (ids: id'er eller kortene selv)
    sæt(ids, { liv: l = false } = {}) {
      lagte = new Set(ids.map((k) => k.id ?? k));
      iBunke = [];
      fyld = null;
      valgt = null;
      livVist = l;
      for (const f of el.querySelectorAll('.tv-felt')) f.replaceChildren();
      tegn();
    },
    // Et kort falder ud af Cassini og lægges i bunken
    slip(id) {
      if (lagte.has(id) || iBunke.includes(id)) return;
      iBunke.push(id);
      tegnBunke();
    },
    læg: (id) => læg(id, kortMed(id)?.række, null),
    lægForkert: (id, række) => læg(id, række, null), // (til tests: et kort på en forkert række)
    // Europas søjle fylder sig selv, kort for kort
    fyldEuropa() {
      const kø = KORT.filter((k) => k.måne === 'europa' && !lagte.has(k.id)).map((k) => k.id);
      fyld = kø.length ? { kø, t: ROLIG ? 0 : FYLD_S * 0.6 } : null;
    },
    visLiv,
    foldInd,
    opdater(dt) {
      if (!fyld) return;
      fyld.t -= dt;
      while (fyld && fyld.t <= 0) {
        const id = fyld.kø.shift();
        lagte.add(id);
        tegnFelter();
        felt('europa', kortMed(id).række).querySelector(`[data-kort="${id}"]`)?.classList.add('ny');
        if (!fyld.kø.length) fyld = null;
        else fyld.t += ROLIG ? 0 : FYLD_S;
      }
    },
    get lagte() { return [...lagte]; },
    get bunke() { return [...iBunke]; },
    get fylder() { return Boolean(fyld); },
    get livVist() { return livVist; },
    get foldet() { return el.classList.contains('foldet'); },
    farver() {
      const ud = {};
      for (const f of el.querySelectorAll('.tv-felt')) (ud[f.dataset.maane] ??= {})[f.dataset.raekke] = f.dataset.farve;
      return ud;
    },
    stop() { el.remove(); },
  };
}
