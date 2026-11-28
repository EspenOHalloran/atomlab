// Gåden i bogen om Ole Rømer: "Tæl lysets minutter" (Opdagelserne, docs/drejebog-roemer.md, afsnit 6, R3 28. november
// 2026). Rømers Fig. 11 tegnet om af os med blæk på papiret: Solen A i midten af Jordens bane med bogstaverne E, F, G, H, K
// og L som hos Rømer, og Jupiter B ude i rigtig afstand (5,2 AE) med Io's bane og skyggen (C og D). Fra Jupiter til Jorden
// går lyset som en perlesnor: én perle for hvert minut, lyset farer (18 millioner km).
//   aug     Jorden står ved 14. august 1676, og snoren har 36 perler. Man trækker Jorden langs banen til 9. november (eller
//           trykker på den, så går den selv). De nye perler er gyldne
//   tæl     Man tæller de nye perler: et tryk på snoren giver den næste gyldne perle et tal, eller man vælger tallet med − og
//           +. "Svar" med 10 er rigtigt (det, man selv finder, stilguiden C3). Et forkert tal ryster bare lidt (B5)
//   løst1   "10 minutter, som Rømer sagde." og knappen "Hele vejen fra H til E"
//   he      Jorden står ved H (tættest på Jupiter). Man trækker den over på den anden side af Solen til E (begge veje rundt)
//   tæller  Ved E tælles de nye perler af sig selv: 16½. Så kommer "Og i dag?" og "Se det hele i tidsskriftet fra 1677 ›"
// Antallet af perler er regnet ud fra JPL Horizons i august og november (PERLER i js/data/opdagelser/roemer.js) og fra
// runde baner fra H til E (HELE_BANEN, 2 AE). Perlerne lægges jævnt på den tegnede snor.
//
// Snyd, der skal stå i "Ærligt talt": Banerne er tegnet helt runde, og Jupiter og Io's bane er tegnet alt for store (Io's
// bane er i virkeligheden en 350-del af Jordens). Perlerne er rundet til hele minutter.
//
// lavGåde(felt, _, { rolig, tekster, løst, påLøst, påVidere, medForord }) fylder opslagets felt (.bog-scene fra js/bog.js)
// med forordet (broen fra turen) og så gåden, og giver { fjern(), test }. Teksterne er GÅDE i js/data/opdagelser/roemer.js.
// Tegningen er et SVG i skærmens pixel (tegnes om, når feltet ændrer størrelse): Jupiter til højre, når der er bedst plads
// til det, ellers øverst som hos Rømer. Jorden er en knap oven på (mindst 48 px), så den kan trækkes, trykkes og flyttes med
// piletasterne. Med ROLIG flytter Jorden sig med det samme, og perlerne tælles uden pause.

import {
  AUGUST, NOVEMBER, OPPOSITION, jordVinkel, lysMinutter, tegnetMinutter, JUPITER_AE, BOGSTAVER, PERLER, HELE_BANEN,
} from '../data/opdagelser/roemer.js';

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const GR = Math.PI / 180;
const klem = (x, a, b) => Math.max(a, Math.min(b, x));
// Tegningens udstrækning i AE langs retningen Sol-Jupiter (u) og på tværs (v): fra E's side til lidt bag Jupiter
const U0 = -1.55, U1 = JUPITER_AE + 0.75, V = 1.55;
const VINKEL_AUG = jordVinkel(AUGUST), VINKEL_NOV = jordVinkel(NOVEMBER); // ca. 32,5° og 111°
const PR_DAG = jordVinkel(OPPOSITION + 1); // grader pr. dag (ca. 0,9°)
const M_AUG = lysMinutter(AUGUST); // ca. 35,8 minutter
const M_H = tegnetMinutter(0); // ca. 34,9 minutter fra Jupiter til H
const GÅ_TID = 1600; // ms, når Jorden går af sig selv efter et tryk
const TÆL_PAUSE = 110; // ms mellem perlerne, når de tælles af sig selv ved E

function ryst(el, rolig) {
  if (!el) return;
  if (rolig || !el.animate) {
    el.classList.add('ryster');
    setTimeout(() => el.classList.remove('ryster'), 300);
    return;
  }
  el.animate([{ transform: 'none' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'none' }], { duration: 280 });
}

export function lavGåde(felt, _anagram, { rolig = false, tekster = {}, løst = false, påLøst = null, påVidere = null, medForord = true } = {}) {
  const T = tekster;
  const L = T.linjer ?? {};
  let levende = true;
  let erLøst = løst;
  let fase = 'aug'; // 'aug', 'tæl', 'løst1', 'he', 'tæller', 'løst'
  let dag = AUGUST; // Jordens dato i del ét
  let vinkel = 0; // Jordens vinkel fra H i del to (grader, plus er mod uret)
  let talt = 0; // de gyldne perler, der har fået et tal
  let ramme = 0, gåRamme = 0, tælTimer = 0;
  let mål = { b: 0, h: 0, k: 1, bred: true, sol: [0, 0] }; // tegningens størrelse i px

  felt.classList.add('tg-felt');
  felt.innerHTML = '<div class="tg rg">'
    + `<div class="rg-kort"><svg role="img" aria-label="${esc(T.alt ?? '')}"></svg>`
    + `<button class="rg-jord" aria-label="${esc(T.jorden ?? 'Jorden')}"></button></div>`
    + '<div class="tg-side">'
    + '<p class="hs-linje tg-linje" aria-live="polite"></p>'
    + '<p class="rg-under" hidden></p>'
    + `<div class="rg-tæl" hidden><button class="knap rg-minus" aria-label="${esc(T.færre ?? '−')}">−</button>`
    + '<output class="rg-tal" aria-live="polite">0</output>'
    + `<button class="knap rg-plus" aria-label="${esc(T.flere ?? '+')}">+</button>`
    + `<button class="knap rg-svar">${esc(T.svar ?? 'Svar')}</button></div>`
    + `<button class="knap rg-del-to" hidden>${esc(T.delTo ?? '')} ›</button>`
    + `<p class="rg-perle"><span class="rg-perle-prik" aria-hidden="true"></span> ${esc(T.perle ?? '')}</p>`
    + '<div class="tg-efter" hidden></div>'
    + '</div></div>';
  const tg = felt.querySelector('.tg');
  const kort = felt.querySelector('.rg-kort');
  const svg = felt.querySelector('svg');
  const jordKnap = felt.querySelector('.rg-jord');
  const linje = felt.querySelector('.tg-linje');
  const under = felt.querySelector('.rg-under');
  const tæl = felt.querySelector('.rg-tæl');
  const tal = felt.querySelector('.rg-tal');
  const delTo = felt.querySelector('.rg-del-to');
  const efter = felt.querySelector('.tg-efter');

  // Introduktionen før gåden (som Tychos): en side bogtekst med det store forbogstav og "Prøv gåden ›"
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
    mål = måltagning();
    tegn();
    if (!rolig && tg.animate) tg.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
  }

  // ---------- Tegningens mål: Jupiter til højre eller øverst, det der giver den største tegning ----------
  function måltagning() {
    const b = kort.clientWidth, h = kort.clientHeight;
    const kBred = Math.min(b / (U1 - U0), h / (2 * V)), kHøj = Math.min(h / (U1 - U0), b / (2 * V));
    const bred = kBred >= kHøj;
    const k = Math.max(1, bred ? kBred : kHøj);
    // Solen står, så udstrækningen er i midten
    const midtU = (U0 + U1) / 2;
    const sol = bred ? [b / 2 - midtU * k, h / 2] : [b / 2, h / 2 + midtU * k];
    return { b, h, k, bred, sol };
  }
  // (u, v) i AE til px. u peger mod Jupiter, v 90° mod uret
  const P = (u, v) => (mål.bred
    ? [mål.sol[0] + u * mål.k, mål.sol[1] - v * mål.k]
    : [mål.sol[0] - v * mål.k, mål.sol[1] - u * mål.k]);
  const påBanen = (grader, r = 1) => P(r * Math.cos(grader * GR), r * Math.sin(grader * GR));
  // Vinklen (grader fra H, mod uret) for et punkt i px
  function vinkelVed(x, y) {
    const dx = (x - mål.sol[0]) / mål.k, dy = (y - mål.sol[1]) / mål.k;
    const [u, v] = mål.bred ? [dx, -dy] : [-dy, -dx];
    return Math.atan2(v, u) / GR;
  }
  const f = (x) => x.toFixed(1);

  // Jordens vinkel og snorens længde i minutter lige nu
  const jordGrader = () => (fase === 'aug' || fase === 'tæl' || fase === 'løst1' ? jordVinkel(dag) : vinkel);
  const snorMinutter = () => (fase === 'aug' || fase === 'tæl' || fase === 'løst1' ? lysMinutter(dag) : tegnetMinutter(vinkel));

  // Perlerne som { m, guld, nr, halv }: m er minutter fra Jupiter. De hvide tælles tilbage fra Jordens sted i august (eller
  // ved H), så den sidste ligger ved Jorden, og de gyldne kommer til, efterhånden som snoren bliver længere
  function perler() {
    const delEt = fase === 'aug' || fase === 'tæl' || fase === 'løst1';
    const start = delEt ? M_AUG : M_H;
    const nu = snorMinutter();
    // m er perlens midte: midt i dens minut
    const ud = [];
    for (let i = 0; start - i - 0.5 > 0; i++) ud.push({ m: start - i - 0.5, guld: false });
    const nye = delEt ? PERLER.nye : Math.floor(HELE_BANEN);
    for (let j = 1; j <= nye; j++) {
      if (start + j - 0.5 > nu + 0.05) break;
      ud.push({ m: start + j - 0.5, guld: true, nr: j });
    }
    // Den halve perle ved E (16½): midt i det sidste stykke på 0,63 minut
    if (!delEt && fase !== 'he') ud.push({ m: start + (nye + HELE_BANEN) / 2, guld: true, nr: HELE_BANEN, halv: true });
    return ud;
  }

  // ---------- Tegningen ----------
  function tegn() {
    if (!levende || tg.hidden || !mål.b) return;
    const k = mål.k;
    const [sx, sy] = mål.sol;
    const [jx, jy] = P(JUPITER_AE, 0);
    const rJ = klem(0.075 * k, 5, 11); // Jupiter (alt for stor)
    const rIo = rJ * 2.3; // Io's bane (alt for stor)
    const fra = (x, y) => `${f(x)},${f(y)}`;
    let s = '';
    // Aksen fra E gennem Solen og H til Jupiter (som Rømers lodrette streg) og Jordens bane
    const [ex, ey] = påBanen(180);
    s += `<line x1="${f(ex)}" y1="${f(ey)}" x2="${f(jx)}" y2="${f(jy)}" class="rg-akse"/>`;
    s += `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(k)}" class="rg-bane"/>`;
    // Skyggen bag Jupiter (væk fra Solen) og Io's bane med C og D, hvor Io går ind i og kommer ud af skyggen
    const ud = rIo / k + 0.25; // skyggens længde i AE
    const [a1x, a1y] = P(JUPITER_AE, -rJ / k), [a2x, a2y] = P(JUPITER_AE + ud, -rJ / k);
    const [b1x, b1y] = P(JUPITER_AE, rJ / k), [b2x, b2y] = P(JUPITER_AE + ud, rJ / k);
    s += `<path d="M${fra(a1x, a1y)}L${fra(a2x, a2y)}L${fra(b2x, b2y)}L${fra(b1x, b1y)}Z" class="rg-skygge"/>`;
    s += `<circle cx="${f(jx)}" cy="${f(jy)}" r="${f(rIo)}" class="rg-io-bane"/>`;
    const cU = Math.sqrt(rIo * rIo - rJ * rJ) / k;
    const [cx, cy] = P(JUPITER_AE + cU, -rJ / k), [dx, dy] = P(JUPITER_AE + cU, rJ / k);
    const [cx2, cy2] = P(JUPITER_AE + cU + 11 / k, -(rJ + 9) / k), [dx2, dy2] = P(JUPITER_AE + cU + 11 / k, (rJ + 9) / k);
    s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="1.8" class="rg-io"/><circle cx="${f(dx)}" cy="${f(dy)}" r="1.8" class="rg-io"/>`;
    s += `<text x="${f(cx2)}" y="${f(cy2 + 5)}" class="rg-bogstav lille">C</text><text x="${f(dx2)}" y="${f(dy2 + 5)}" class="rg-bogstav lille">D</text>`;
    // Jupiter med to bånd og B
    s += `<circle cx="${f(jx)}" cy="${f(jy)}" r="${f(rJ)}" class="rg-jupiter"/>`;
    for (const t of [-0.35, 0.3]) {
      const [p1x, p1y] = P(JUPITER_AE - rJ * 0.94 / k, t * rJ / k), [p2x, p2y] = P(JUPITER_AE + rJ * 0.94 / k, t * rJ / k);
      s += `<line x1="${f(p1x)}" y1="${f(p1y)}" x2="${f(p2x)}" y2="${f(p2y)}" class="rg-bånd"/>`;
    }
    const [bx, by] = P(JUPITER_AE - (rJ + 6) / k, -(rJ + 12) / k);
    s += `<text x="${f(bx)}" y="${f(by + 5)}" class="rg-bogstav">B</text>`;
    // Solen med stråler som på tavlen og A
    const rS = klem(0.07 * k, 4, 8);
    s += `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(rS)}" class="rg-sol"/>`;
    for (let i = 0; i < 16; i++) {
      const v = i * 22.5 * GR;
      s += `<line x1="${f(sx + Math.cos(v) * (rS + 1.5))}" y1="${f(sy + Math.sin(v) * (rS + 1.5))}" x2="${f(sx + Math.cos(v) * (rS + 4.5))}" y2="${f(sy + Math.sin(v) * (rS + 4.5))}" class="rg-stråle"/>`;
    }
    const [ax, ay] = P(-(rS + 12) / k, (rS + 10) / k); // på den anden side af aksen end perlernes tal
    s += `<text x="${f(ax - 5)}" y="${f(ay + 5)}" class="rg-bogstav">A</text>`;
    // Rømers bogstaver på Jordens bane (udenfor)
    for (const b of BOGSTAVER) {
      // H og E står på aksen, hvor snoren også går, så de flyttes lidt til siden (mod uret)
      const skæv = b.navn === 'H' || b.navn === 'E' ? 16 / k : 0;
      const [lx, ly] = påBanen(b.vinkel + (b.navn === 'E' ? -1 : 1) * skæv / GR, 1 + 12 / k);
      s += `<text x="${f(lx - 5)}" y="${f(ly + 5)}" class="rg-bogstav">${b.navn}</text>`;
    }
    // Datoerne i del ét: et lille mærke på banen ved 14. august og 9. november
    if (fase === 'aug' || fase === 'tæl' || fase === 'løst1') {
      for (const [g, tekst] of [[VINKEL_AUG, k >= 80 ? T.datoer?.aug : ''], [VINKEL_NOV, k >= 80 ? T.datoer?.nov : '']]) {
        const [m1x, m1y] = påBanen(g, 1 - 5 / k), [m2x, m2y] = påBanen(g, 1 + 5 / k);
        const [tx, ty] = påBanen(g, 1 - 22 / k);
        s += `<line x1="${f(m1x)}" y1="${f(m1y)}" x2="${f(m2x)}" y2="${f(m2y)}" class="rg-mærke"/>`;
        s += `<text x="${f(tx)}" y="${f(ty + 4)}" class="rg-dato">${esc(tekst ?? '')}</text>`;
      }
    }
    // Snoren fra Jupiter til Jorden med perlerne
    const g = jordGrader();
    const [ejx, ejy] = påBanen(g);
    const nu = snorMinutter();
    const længde = Math.hypot(ejx - jx, ejy - jy);
    // Perlerne lægges fra Jupiters kant til Jordens kant, så de ikke dækker Jupiter eller Jorden
    const fraPx = rJ + 3, tilPx = Math.max(fraPx + 10, længde - 9);
    const pr = (tilPx - fraPx) / nu; // px pr. minut
    const r = klem(pr * 0.36, 1.4, 4.6);
    s += `<line x1="${f(jx)}" y1="${f(jy)}" x2="${f(ejx)}" y2="${f(ejy)}" class="rg-snor"/>`;
    const medTal = pr >= 12; // tallene ved perlerne kun, når der er plads
    let tekst = '';
    for (const p of perler()) {
      const t = (fraPx + Math.min(1, p.m / nu) * (tilPx - fraPx)) / længde;
      const x = jx + (ejx - jx) * t, y = jy + (ejy - jy) * t;
      const erTalt = p.guld && p.nr <= talt;
      const cls = `rg-p${p.guld ? ' guld' : ''}${erTalt ? ' talt' : ''}`;
      if (p.halv) {
        // En halv perle: en halvcirkel med den flade side mod Jupiter
        const v = Math.atan2(ejy - jy, ejx - jx);
        const px = Math.cos(v + Math.PI / 2) * r, py = Math.sin(v + Math.PI / 2) * r;
        const bx = x - Math.cos(v) * r * 0.5, by = y - Math.sin(v) * r * 0.5;
        s += `<path d="M${fra(bx + px, by + py)}A${f(r)},${f(r)} 0 0 0 ${fra(bx - px, by - py)}Z" class="${cls}"/>`;
      } else s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" class="${cls}"/>`;
      if (erTalt && medTal) {
        // Tallet ved siden af snoren (½ på den anden side, så det ikke rammer 16)
        const v = Math.atan2(ejy - jy, ejx - jx) + (p.halv ? Math.PI / 2 : -Math.PI / 2);
        tekst += `<text x="${f(x + Math.cos(v) * (r + 8))}" y="${f(y + Math.sin(v) * (r + 8) + 4)}" class="rg-perle-tal">${p.halv ? '½' : p.nr}</text>`;
      }
    }
    s += tekst;
    // Et bredt, usynligt felt over snoren: et tryk tæller den næste gyldne perle
    if (fase === 'tæl') s += `<line x1="${f(jx)}" y1="${f(jy)}" x2="${f(ejx)}" y2="${f(ejy)}" class="rg-snor-tryk"/>`;
    // Jorden som det gamle tegn ⊕
    s += `<g class="rg-jorden"><circle cx="${f(ejx)}" cy="${f(ejy)}" r="6.5"/><line x1="${f(ejx - 6.5)}" y1="${f(ejy)}" x2="${f(ejx + 6.5)}" y2="${f(ejy)}"/><line x1="${f(ejx)}" y1="${f(ejy - 6.5)}" x2="${f(ejx)}" y2="${f(ejy + 6.5)}"/></g>`;
    svg.setAttribute('viewBox', `0 0 ${mål.b} ${mål.h}`);
    svg.innerHTML = s;
    jordKnap.style.left = `${f(ejx)}px`;
    jordKnap.style.top = `${f(ejy)}px`;
    jordKnap.hidden = !(fase === 'aug' || fase === 'he');
  }
  const tegnSnart = () => { cancelAnimationFrame(ramme); ramme = requestAnimationFrame(tegn); };

  // ---------- Faserne og linjen ----------
  const sætLinje = (t) => {
    const tekst = t + (erLøst && fase === 'aug' && t === L.aug ? ` · ${T.løstFør ?? ''}` : '');
    if (linje.textContent !== tekst) linje.textContent = tekst;
    linje.classList.toggle('løst', fase === 'løst1' || fase === 'løst');
  };
  const sætUnder = (t) => { under.textContent = t ?? ''; under.hidden = !t; };
  function visFase() {
    tæl.hidden = !(fase === 'tæl' || fase === 'tæller');
    for (const k of tæl.querySelectorAll('button')) k.hidden = fase !== 'tæl';
    tal.textContent = fase === 'tæl' ? String(talt) : (fase === 'tæller' || fase === 'løst') ? talTekst() : '';
    delTo.hidden = fase !== 'løst1';
    if (fase === 'aug') { sætLinje(L.aug); sætUnder(null); }
    else if (fase === 'tæl') { sætLinje(L.tæl); sætUnder(L.tælHjælp); }
    else if (fase === 'løst1') { sætLinje(L.løst1); sætUnder(L.løst1Under); }
    else if (fase === 'he') { sætLinje(L.he); sætUnder(null); }
    else if (fase === 'tæller') { sætLinje(L.he); sætUnder(L.vedE); }
    else if (fase === 'løst') { sætLinje(L.løst); sætUnder(L.vedE); }
    tegn();
  }
  const talTekst = () => (talt > Math.floor(HELE_BANEN) ? `${Math.floor(HELE_BANEN)}½` : String(talt));

  // Jorden er nået frem: til tællingen (9. november) eller til E (tælles af sig selv)
  function nåetFrem() {
    if (fase === 'aug') {
      dag = NOVEMBER;
      fase = 'tæl';
      talt = 0;
      visFase();
    } else if (fase === 'he') {
      vinkel = vinkel < 0 ? -180 : 180;
      fase = 'tæller';
      talt = 0;
      visFase();
      tælSelv();
    }
  }
  // Ved E tælles de gyldne perler én ad gangen og til sidst den halve (16½)
  function tælSelv() {
    const slut = Math.floor(HELE_BANEN) + 1;
    const trin = () => {
      if (!levende || fase !== 'tæller') return;
      talt++;
      tal.textContent = talTekst();
      tegn();
      if (talt >= slut) løs();
      else tælTimer = setTimeout(trin, TÆL_PAUSE);
    };
    if (rolig) { talt = slut; løs(); return; }
    tælTimer = setTimeout(trin, 300);
  }
  function løs() {
    fase = 'løst';
    talt = Math.floor(HELE_BANEN) + 1;
    visFase();
    tg.classList.add('fundet');
    if (!erLøst) påLøst?.();
    erLøst = true;
    visEfter();
  }

  function visEfter() {
    const D = T.iDag ?? {};
    efter.innerHTML = `<div class="tg-idag"><p class="tg-idag-titel">${esc(D.titel ?? '')}</p>`
      + `<table><thead><tr>${(D.hoved ?? []).map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>`
      + `<tbody>${(D.rækker ?? []).map(([a, b, c]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table>`
      + `<p class="tg-småt">${esc(D.note ?? '')}</p></div>`
      + `<div class="tg-videre-række">${påVidere && T.videre ? `<button class="knap tg-videre">${esc(T.videre)} ›</button>` : ''}`
      + `<button class="knap tg-igen">${esc(T.igen ?? 'Prøv igen')}</button></div>`;
    efter.hidden = false;
    // Tegningen står øverst, så "Og i dag?" kan være under kanten
    requestAnimationFrame(() => { if (levende) efter.scrollIntoView({ block: 'nearest', behavior: rolig ? 'auto' : 'smooth' }); });
  }

  // ---------- Jorden: træk, tryk eller piletaster ----------
  // Sætter Jorden ud fra en vinkel (grader fra H). I del ét kun mellem august og november, i del to hele vejen til E
  function sætVinkel(g) {
    if (fase === 'aug') {
      const v = g < 0 ? VINKEL_AUG : klem(g, VINKEL_AUG, VINKEL_NOV);
      dag = OPPOSITION + v / PR_DAG;
      if (dag >= NOVEMBER - 0.6) { nåetFrem(); return; }
    } else if (fase === 'he') {
      vinkel = klem(g, -180, 180);
      if (Math.abs(vinkel) >= 176) { nåetFrem(); return; }
    }
    tegnSnart();
  }
  // Et tryk (uden træk): Jorden går selv frem (mod uret, gennem L og K)
  function gåSelv() {
    if (fase !== 'aug' && fase !== 'he') return;
    cancelAnimationFrame(gåRamme);
    const fraV = fase === 'aug' ? jordVinkel(dag) : vinkel;
    const tilV = fase === 'aug' ? VINKEL_NOV : (vinkel < 0 ? -180 : 180);
    if (rolig) { sætVinkel(tilV); return; }
    const start = performance.now();
    const minFase = fase;
    const trin = (t) => {
      if (!levende || fase !== minFase) return;
      const x = Math.min(1, (t - start) / GÅ_TID);
      const e = x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x);
      sætVinkel(fraV + (tilV - fraV) * e);
      if (x < 1 && fase === minFase) gåRamme = requestAnimationFrame(trin);
    };
    gåRamme = requestAnimationFrame(trin);
  }

  let træk = null; // { id, x, y, flyttet }
  jordKnap.addEventListener('pointerdown', (h) => {
    if (fase !== 'aug' && fase !== 'he') return;
    h.preventDefault();
    cancelAnimationFrame(gåRamme);
    træk = { id: h.pointerId, x: h.clientX, y: h.clientY, flyttet: false };
    jordKnap.setPointerCapture?.(h.pointerId);
  });
  jordKnap.addEventListener('pointermove', (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    if (Math.hypot(h.clientX - træk.x, h.clientY - træk.y) > 6) træk.flyttet = true;
    if (!træk.flyttet) return;
    const r = kort.getBoundingClientRect();
    sætVinkel(vinkelVed(h.clientX - r.left, h.clientY - r.top));
  });
  const slip = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    const varTryk = !træk.flyttet;
    træk = null;
    if (varTryk) gåSelv();
  };
  jordKnap.addEventListener('pointerup', slip);
  jordKnap.addEventListener('pointercancel', (h) => { if (træk && h.pointerId === træk.id) træk = null; });
  // Tastaturet: Enter og mellemrum giver et "click" uden pointerdown, så Jorden går selv. Pilene flytter den
  jordKnap.addEventListener('click', (h) => { if (h.detail === 0) gåSelv(); });
  jordKnap.addEventListener('keydown', (h) => {
    const frem = h.key === 'ArrowRight' || h.key === 'ArrowUp', tilbage = h.key === 'ArrowLeft' || h.key === 'ArrowDown';
    if (!frem && !tilbage) return;
    h.preventDefault();
    if (fase === 'aug') sætVinkel(jordVinkel(dag) + (frem ? 5 : -5) * PR_DAG);
    else if (fase === 'he') sætVinkel((vinkel < 0 ? -1 : 1) * Math.max(0, Math.abs(vinkel) + (frem ? 10 : -10)));
  });

  // ---------- Tællingen og knapperne ----------
  function sætTal(n) {
    talt = klem(n, 0, 20);
    tal.textContent = String(talt);
    tegn();
  }
  function svar() {
    if (fase !== 'tæl') return;
    if (talt === PERLER.nye) {
      fase = 'løst1';
      talt = PERLER.nye;
      visFase();
      return;
    }
    sætLinje(L.forkert);
    ryst(tæl, rolig);
  }
  function startDelTo() {
    if (fase !== 'løst1') return;
    fase = 'he';
    vinkel = 0;
    talt = 0;
    visFase();
    jordKnap.focus({ preventScroll: true });
  }
  const klik = (h) => {
    const k = h.target.closest('button, .rg-snor-tryk');
    if (!k) return;
    if (k.classList.contains('rg-snor-tryk')) { if (fase === 'tæl' && talt < PERLER.nye) sætTal(talt + 1); }
    else if (k.classList.contains('rg-minus')) sætTal(talt - 1);
    else if (k.classList.contains('rg-plus')) sætTal(talt + 1);
    else if (k.classList.contains('rg-svar')) svar();
    else if (k.classList.contains('rg-del-to')) startDelTo();
    else if (k.classList.contains('tg-videre')) påVidere?.();
    else if (k.classList.contains('tg-igen')) {
      fjern();
      felt.classList.remove('tg-felt');
      Object.assign(api, lavGåde(felt, null, { rolig, tekster, løst: true, påLøst, påVidere, medForord: false }));
    }
  };
  felt.addEventListener('click', klik);

  // Tegningen følger feltets størrelse
  const iagttager = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
    const m = måltagning();
    if (m.b !== mål.b || m.h !== mål.h) { mål = m; tegnSnart(); }
  }) : null;
  iagttager?.observe(kort);

  function fjern() {
    levende = false;
    cancelAnimationFrame(ramme);
    cancelAnimationFrame(gåRamme);
    clearTimeout(tælTimer);
    iagttager?.disconnect();
    felt.removeEventListener('click', klik);
    felt.replaceChildren();
  }

  if (!tg.hidden) mål = måltagning();
  visFase();

  const api = {
    fjern,
    test: {
      tilstand: () => {
        const p = perler();
        return {
          fase, dag: Math.round(dag), vinkel: Math.round(vinkel), talt, løst: erLøst,
          perler: p.filter((x) => !x.halv).length, gyldne: p.filter((x) => x.guld && !x.halv).length, halv: p.some((x) => x.halv),
          minutter: Math.round(snorMinutter() * 10) / 10, linje: linje.textContent, tal: tal.textContent,
          forord: Boolean(felt.querySelector('.ag-forord')), bred: mål.bred,
        };
      },
      visGåden,
      // Flyt Jorden til november (del ét) eller E (del to), som om man havde trukket den
      flyt: () => sætVinkel(fase === 'aug' ? VINKEL_NOV : 180),
      gåSelv,
      tæl: (n) => sætTal(n),
      tryk: () => felt.querySelector('.rg-snor-tryk')?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
      svar,
      delTo: startDelTo,
    },
  };
  return api;
}
