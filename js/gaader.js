// Gåderne (#gaader, docs/plan-gaader.md og plan-gaader-3d.md): det, videnskaben ikke ved endnu, i Biblioteket.
// Først skinnen med gåderne (G4b, js/gaader/skinne.js, hentet med import()), så ét kort ad gangen: tre trin (Spørg, Gæt,
// Så) og bagefter "Det så du".
// Et kort har en scene i 3D bag sig (G4a): js/gaader/scene.js hentes med import() første gang og får trinet med
// scene.vis(id, trin, valgt). Panelet står til højre eller forneden (klassen paa-kort på #gaader).
// Teksterne står i js/data/gaader.js. Gættets knapper og prikkerne har samme udseende som forløbene (js/forloeb.js),
// "For nørder" og "Ærligt talt" er de fælles foldebokse (js/lag.js), "Se det selv" er en data-gaa-knap (js/gaa.js), og et trin
// med hvorfor får det fælles "Hvorfor?"-kort under Så (fx "Hvornår er noget opdaget?", Gåderne G3).

import { gådeMed, bygget, påSkinnen, SKINNE_ÆRLIGT } from './data/gaader.js';
import { HVORFOR } from './data/hvorfor.js';
import { sætVindue, verden, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { lavLagBokse } from './lag.js';
import { tagVentGåde } from './gaa.js';

const NØGLE = 'atomlabGaader'; // { id: tidspunkt } for de kort, man har gjort færdige
const NØGLE_SKINNE = 'atomlabGaaderSkinne'; // '1', når man har set lysene på skinnen tænde (første gang er forbi)
const $ = (id) => document.getElementById(id);

let lavet = false;
let gåde = null; // kortet, der vises (eller null i oversigten)
let trin = 0; // 0-2 er trinene, 3 er "Det så du"
let valgt = null; // nummeret på det valgte svar i trinet (eller null, før man har gættet)
let aktiv = false;
let scene = null; // js/gaader/scene.js, når den er hentet
let sceneLøfte = null;
const hentScene = () => (sceneLøfte ??= import('./gaader/scene.js').then((m) => (scene = m)));
let skinne = null; // js/gaader/skinne.js, når den er hentet
let skinneLøfte = null;
const hentSkinne = () => (skinneLøfte ??= import('./gaader/skinne.js').then((m) => (skinne = m)));
let fokusId = null; // gåden i fokus på skinnen (bliver, når man går ind i et kort og ud igen, også via "Se det selv")

// Scenen følger kortet: samme gåde og samme trin. Hentes den stadig, får den trinet, når den er klar.
function følgScene() {
  if (!aktiv || !gåde) return;
  const id = gåde.id;
  if (scene) scene.vis(id, trin, valgt);
  else hentScene().then(() => { if (aktiv && gåde?.id === id) scene.vis(id, trin, valgt); });
}

// Skinnen fylder skærmen (panelet er skjult), og et kort har panelet ved siden af scenen
function sætLayout(påKort) {
  const s = $('gaader');
  s.classList.toggle('paa-kort', påKort);
  if (!påKort) s.classList.remove('gaetter');
  $('gaaderFokus').hidden = påKort;
  if (påKort) $('gaaderFørste').hidden = true;
  sætVindue($('gaaderVindue'));
}

function hentFærdige() {
  try {
    const d = JSON.parse(localStorage.getItem(NØGLE));
    return d && typeof d === 'object' ? d : {};
  } catch {
    return {};
  }
}

function gemFærdig(id) {
  const d = hentFærdige();
  if (d[id]) return;
  d[id] = Date.now();
  try { localStorage.setItem(NØGLE, JSON.stringify(d)); } catch { /* ingen lagring */ }
}

// Første gang: Man står foran det første kort, til man har fløjet ud af et kort én gang (eller har gjort et færdigt)
function førsteGang() {
  try {
    if (localStorage.getItem(NØGLE_SKINNE)) return false;
  } catch { /* ingen lagring */ }
  return !Object.keys(hentFærdige()).length;
}
function førsteGangForbi() {
  try { localStorage.setItem(NØGLE_SKINNE, '1'); } catch { /* ingen lagring */ }
}

// Panelet toner ud forneden, når der er mere at rulle til (klassen mere, som panelerne i js/main.js). Det gøres her,
// fordi indholdet skifter uden at panelet skifter størrelse.
const tjekRulning = () => {
  const p = $('gaaderPanel');
  p.classList.toggle('mere', p.scrollHeight - p.scrollTop - p.clientHeight > 8);
};
const tjekSnart = () => requestAnimationFrame(tjekRulning);

const tegn = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- Skinnen ----------
// Gåderne står langs en sti fra det mindste til det største med én i fokus. Teksten og knapperne under lyset står her.
// valg (til skinne.vis): ud (fra et kort: kameraet trækker sig ud af lyset) og videre (1: "Næste gåde ›").
let første = false; // første gang: kun det første lys, tæt foran
let linjeTekst = ''; // linjen over knappen ("Videnskaben er ikke færdig …" og "Der er flere.")
function visOversigt(valg = {}) {
  const fraKort = Boolean(gåde);
  gåde = null;
  sætLayout(false);
  scene?.skjul();
  const række = påSkinnen();
  første = førsteGang();
  // Ud af et kort første gang: lysene tændes ("Der er flere."), og første gang er forbi
  const tænd = fraKort && Boolean(valg.ud) && første;
  if (tænd) {
    førsteGangForbi();
    første = false;
  }
  if (første) fokusId = række[0]?.id ?? null; // første gang står man foran det mindste
  else if (!række.some((g) => g.id === fokusId)) {
    // En ukendt gåde: den første, man ikke har gjort færdig
    const færdige = hentFærdige();
    fokusId = (række.find((g) => !færdige[g.id]) ?? række[0])?.id ?? null;
  }
  linjeTekst = første ? 'Videnskaben er ikke færdig. Det her er en af gåderne.' : tænd ? 'Der er flere.' : '';
  const id = fokusId;
  const vis = () => skinne.vis(påSkinnen(), fokusId, hentFærdige(), { fokus: visFokus, vælg: flyvInd, første, ud: Boolean(valg.ud), tænd, videre: valg.videre ?? 0 });
  if (skinne) vis();
  else hentSkinne().then(() => { if (aktiv && !gåde && fokusId === id) vis(); });
}

// Gåden i fokus: spørgsmålet og linjen på knappen "Flyv ind", og pilene er grå i enderne. Første gang er der kun knappen.
function visFokus(id) {
  if (id !== fokusId && linjeTekst === 'Der er flere.') linjeTekst = ''; // linjen går væk, når man flytter sig
  fokusId = id;
  const g = gådeMed(id);
  if (!g) return;
  $('gaaderFokusSpm').textContent = g.spørgsmål;
  $('gaaderFokusLinje').textContent = hentFærdige()[id] ? `✓ ${g.linje}` : g.linje;
  $('gaaderInd').dataset.gaade = id;
  const l = $('gaaderFørste');
  l.textContent = linjeTekst;
  l.hidden = !linjeTekst;
  const { første: ved1, sidste } = skinne.ender();
  for (const [b, grå] of [[$('gaaderFokus').querySelector('[data-skinne="-1"]'), ved1], [$('gaaderFokus').querySelector('[data-skinne="1"]'), sidste]]) {
    b.disabled = grå;
    b.hidden = første;
  }
}

// Ind i en gåde: kameraet flyver ind i lyset (et tryk springer over), og så vises kortet
function flyvInd(id) {
  if (!aktiv || gåde || !skinne) return;
  if (skinne.flyvInd(() => { if (aktiv && !gåde) visGåde(id); })) lyd.klik();
}

// Fra et kort tilbage til skinnen (‹ Alle gåder, Esc og "Alle gåder" under "Det så du")
function tilSkinnen(valg = {}) {
  if (!gåde) return;
  visOversigt({ ud: true, ...valg });
}

// ---------- Et kort ----------
// Viser en gåde (fra oversigten, fra en knap data-gaa="gaader:id" eller fra testen). En ukendt eller ikke bygget gåde
// giver oversigten.
export function visGåde(id) {
  const g = gådeMed(id);
  if (!bygget(g)) { visOversigt(); return; }
  gåde = g;
  fokusId = g.id;
  skinne?.skjul();
  trin = 0;
  valgt = null;
  sætLayout(true);
  const kort = $('gaadeKort');
  kort.hidden = false;
  kort.innerHTML = `
    <button class="knap lille gaade-tilbage" data-alle>‹ Alle gåder</button>
    <h3 class="gaade-spørgsmål">${tegn(g.spørgsmål)}</h3>
    <p class="gaade-dato">${tegn(g.dato)}</p>
    ${g.løst ? `<p class="gaade-løst">Løst! (${tegn(g.løst)})</p>` : ''}
    ${g.nyt ? `<p class="gaade-nyt"><b>Nyt siden sidst (${tegn(g.nyt.dato)}):</b> ${tegn(g.nyt.tekst)}</p>` : ''}
    <div class="gaade-trin" id="gaadeTrin" aria-live="polite"></div>
    <div class="gaade-lag">
      ${g.nørd ? `<details class="lag-boks" data-lag="gaade-nørd"><summary><strong>For nørder</strong><span class="lag-kort">Tal, navne og flere detaljer</span></summary>${g.nørd}</details>` : ''}
      ${g.ærligt ? `<details class="lag-boks ærligt" data-lag="gaade-ærligt"><summary><strong>Ærligt talt</strong><span class="lag-kort">Hvad kortet forenkler</span></summary>${g.ærligt}${g.scene?.ærligt ?? ''}<p>${tegn(SKINNE_ÆRLIGT)}</p></details>` : ''}
    </div>`;
  lavLagBokse(kort);
  visTrin();
  $('gaaderPanel').scrollTop = 0;
}

function prikker() {
  return `<span class="fl-prikker" aria-hidden="true">${gåde.trin.map((_, i) => `<i class="${i < trin ? 'ja' : i === trin ? 'nu' : ''}"></i>`).join('')}</span>`;
}

function visTrin() {
  tjekSnart();
  $('gaader').classList.toggle('gaetter', trin < gåde.trin.length && valgt === null);
  følgScene();
  const boks = $('gaadeTrin');
  const ord = `data-ord-kun="${gåde.ord.join(' ')}"`;
  if (trin >= gåde.trin.length) {
    // "Det så du": kernen og højst tre veje
    gemFærdig(gåde.id);
    // Den næste gåde på skinnen (den næste større)
    const række = påSkinnen();
    const næste = række[række.indexOf(gåde) + 1];
    boks.innerHTML = `
      <div class="gaade-hoved">${prikker()}<span class="gaade-overskrift">Det så du</span></div>
      <p class="fl-tekst fl-så" ${ord}>${tegn(gåde.slut)}</p>
      <div class="fl-række gaade-veje">
        <button class="fl-vej primær" data-gaa="${gåde.seDet[0]}">${tegn(gåde.seDet[1])} ›</button>
        ${næste ? `<button class="fl-vej" data-naeste-gaade>Næste gåde ›</button>` : ''}
        <button class="fl-vej" data-alle>Alle gåder</button>
      </div>
      <div class="fl-række"><span class="fl-nav"><button class="fl-tilbage" data-tilbage aria-label="Et trin tilbage">‹</button></span></div>`;
    return;
  }
  const t = gåde.trin[trin];
  const svar = valgt === null ? '' : `
      <p class="fl-tekst gaade-efter" ${ord}>${tegn(t.gæt.valg[valgt].efter)}</p>
      <p class="fl-tekst fl-så" ${ord}>${tegn(t.så)}</p>
      ${t.hvorfor ? `<p class="hvorfor-linje"><button class="hvorfor" data-hvorfor="${t.hvorfor}">${tegn(HVORFOR[t.hvorfor].spørgsmål)}</button></p>` : ''}`;
  boks.innerHTML = `
    <div class="gaade-hoved">${prikker()}<span class="gaade-overskrift">${trin + 1}. ${tegn(t.overskrift)}</span></div>
    <p class="fl-tekst gaade-spørg" ${ord}>${tegn(t.spørg)}</p>
    <div class="fl-række gaade-gæt">${t.gæt.valg.map((v, i) => `<button class="fl-gæt${i === valgt ? ' valgt' : ''}" data-gaet="${i}"${valgt !== null ? ' disabled' : ''}>${tegn(v.tekst)}</button>`).join('')}</div>
    ${svar}
    <div class="fl-række"><span class="fl-nav">
      ${trin > 0 ? '<button class="fl-tilbage" data-tilbage aria-label="Et trin tilbage">‹</button>' : ''}
      ${valgt !== null ? `<button class="fl-næste" data-naeste>${trin < gåde.trin.length - 1 ? 'Næste ›' : 'Færdig ›'}</button>` : ''}
    </span></div>`;
}

function gæt(i) {
  if (!gåde || trin >= gåde.trin.length || valgt !== null) return;
  if (!(i >= 0 && i < gåde.trin[trin].gæt.valg.length)) return;
  valgt = i;
  visTrin();
  // Det nye svar kan ligge under kanten på en lille skærm
  $('gaadeTrin').querySelector('.fl-næste')?.scrollIntoView({ block: 'nearest', behavior: ROLIG ? 'auto' : 'smooth' });
}

function næste() {
  if (!gåde || valgt === null || trin >= gåde.trin.length) return;
  trin++;
  valgt = null;
  visTrin();
  $('gaadeTrin').scrollIntoView({ block: 'nearest' });
}

function tilbage() {
  if (!gåde || trin === 0) return;
  trin--;
  valgt = null;
  visTrin();
}

export function lavGåder() {
  if (lavet) return;
  lavet = true;
  const panel = $('gaaderPanel');
  panel.addEventListener('scroll', tjekRulning, { passive: true });
  new ResizeObserver(tjekSnart).observe(panel);
  panel.addEventListener('toggle', tjekSnart, true); // en foldeboks, der foldes ud
  // Skinnen: "‹ mindre · større ›" og gåden i fokus
  $('gaaderFokus').addEventListener('click', (h) => {
    const b = h.target.closest('button');
    if (!b || b.disabled || !skinne) return;
    if (b.dataset.skinne) { lyd.klik(); skinne.flyt(Number(b.dataset.skinne)); }
    else if (b.hasAttribute('data-ind')) flyvInd(b.dataset.gaade);
  });
  // Esc går fra et kort til skinnen. Lytter i capture-fasen, så en åben dialog ses, før main.js lukker den
  // ("Hvorfor?"-kortet og ordforklaringerne stopper selv Esc, når de lukkes).
  addEventListener('keydown', (h) => {
    if (h.key !== 'Escape' || !aktiv || !gåde || document.querySelector('.overlag:not(.skjult)')) return;
    h.preventDefault();
    h.stopPropagation(); // ellers springer skinnen straks flyvningen ud over (Esc springer en flyvning over)
    lyd.klik();
    tilSkinnen();
  }, true);
  panel.addEventListener('click', (h) => {
    const b = h.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.gaa || b.dataset.hvorfor) return; // "Se det selv" klares af js/gaa.js og "Hvorfor?" af js/lag.js
    lyd.klik();
    if (b.hasAttribute('data-naeste-gaade')) tilSkinnen({ videre: 1 });
    else if (b.hasAttribute('data-alle')) tilSkinnen();
    else if (b.dataset.gaet) gæt(Number(b.dataset.gaet));
    else if (b.hasAttribute('data-naeste')) næste();
    else if (b.hasAttribute('data-tilbage')) tilbage();
  });
}

export function startGåder() {
  aktiv = true;
  const id = tagVentGåde();
  if (id) visGåde(id);
  else visOversigt();
}

export function stopGåder() {
  aktiv = false;
  scene?.stop();
  skinne?.fjern();
  verden.styring.autoRotate = false;
  $('gaader').classList.remove('paa-kort', 'gaetter');
}

export function testAdgang() {
  return {
    vist: () => (gåde ? { id: gåde.id, trin, valgt } : null),
    visGåde,
    gæt,
    næste,
    tilbage,
    færdige: () => Object.keys(hentFærdige()),
    scene: () => scene?.testAdgang() ?? null,
    skinne: () => skinne?.testAdgang() ?? null,
    alle: tilSkinnen,
  };
}

// De fælles navne, som skærmlisten (js/skaerme.js) bruger
export { lavGåder as lav, startGåder as start, stopGåder as stop };
