// Forløb-klodsen (Serie 1, skabelonen i docs/fable/E3-forloeb.md): fører brugeren gennem én idé i 3-6 trin.
// Imens er kun scenen og forløbets linje fremme (klassen i-forløb på skærmen skjuler panelerne, opgaverne og kontakterne,
// se style.css). Linjen står under scenen: prikker, Spørg eller Så, gættet, trinets knapper, "‹", "Næste ›" og
// "Udforsk selv ›" (ud af turen).
//
// Forløbet er en sti, ikke en gang med låste døre (stilguiden B, E20 17. november 2026): Gættet er en invitation (trinets
// knapper står der også, og et tryk på en af dem lader gættet tone væk), "Næste ›" står der altid (før handlingen er gjort,
// viser den handlingen med delens visMig, og Så kommer, før man kan gå videre), knapperne bliver under Så, og er turen
// taget før, kan prikkerne trykkes. Scenen må delen lade virke i alle faser (forløbRørt() fra et tryk i scenen gør det
// samme som et tryk på en af trinets knapper).
//
// Teksterne står som data i js/data/forloeb/ ({ id, del, titel, kernesætning, trin: [{ id, spørg, gæt, gør, så, ord }] }).
// Delen leverer det, der rører scenen, pr. trin-id:
//   start()       sætter scenen op til trinet (kaldes også, når man går tilbage, så den skal kunne gentages)
//   knapper       [{ id, tekst, kugle, gør(), aktiv(), tæller(), valgt() }]: trinets handling (de eneste knapper, der er
//                 fremme). Må være en getter, hvis knapperne skifter undervejs (linjen tegnes igen efter hvert tryk og
//                 efter tegnForløb()). valgt() giver knappen klassen valgt.
//   færdig()      er handlingen gjort?
//   visMig()      gør handlingen for brugeren (når man trykker "Næste ›", før handlingen er gjort)
//   vis           CSS-vælgere for det, der skal være fremme i trinet ud over scenen (fx det lille periodiske system)
// og for hele forløbet: slutTekst() (en linje under kernesætningen), veje [{ tekst, primær, gør }] (højst tre veje videre,
// eller { tekst, hvorfor: id } for et "Hvorfor?"-kort, som en gul pille med "?"; en vej med gør får "›", undtagen med
// her: true, når man bliver i laboratoriet, fx "Leg frit"), layout() (scenen har fået ny størrelse), slut() (kaldes, når
// forløbet slutter, springes over eller stoppes). En tur tages igen med "↻ Tur" i toplinjen (lavTurKnap).
// Et gæt kan have svar (et kort svar, der står under Så, når man har gættet det). Forløbet kan have før: { id, del, tekst } (et andet forløb, der bør tages først): Er det ikke taget, står et link til det
// i første trin. forløbVink(tekst) skriver en kort linje i linjen (fx hvorfor et træk ikke lykkedes), til trinet skifter.
// Klodsen husker i fremgang.js, om forløbet er taget (✓ i "Din fremgang") eller sprunget over. Uden noget af det starter
// delen forløbet af sig selv (starterSelv).

import { lyd } from './lyd.js';
import { centrerVindue } from './scene3d.js';
import { dæmpPiller, visBesked } from './beskeder.js';
import { lukHvorfor, visHvorfor } from './lag.js';
import * as fremgang from './fremgang.js';
import { åbnForløb } from './gaa.js';

const SÅ_EFTER = 700; // ms efter handlingen, før Så kommer (man skal nå at se det ske)
const VISER_I = 6000; // ms, "Næste ›" venter på delens visMig, før et nyt tryk går videre uden (hvis den ikke blev færdig)
const TONING = 1100; // ms med klassen fra-forløb (laboratoriet toner ind i to skridt, style.css)
const SØG = new URLSearchParams(location.search);
// I de automatiske tests starter et forløb kun af sig selv med ?forloebstart (ellers ville alle Værkstedets tests ramme det)
const SELV_I_TEST = !SØG.has('test') || SØG.has('forloebstart');

let k = null; // det forløb, der kører: { data, del, skærm, linje, nr, fase, gæt, viser, vist, vink, igen }
let token = 0; // så timere fra et gammelt trin ikke rører et nyt
let poll = null;
let viserTimer = null;
let såTimer = null;

// Skal forløbet starte af sig selv? Første gang i delen, til man har taget det eller sprunget det over.
export function starterSelv(data) {
  return SELV_I_TEST && !fremgang.forløbTaget(data.id) && !fremgang.forløbSprunget(data.id);
}

export function kørerForløb() {
  return k ? k.data.id : null;
}

// Tegner linjen igen (fx når et tryk i scenen har ændret trinets knapper)
export function tegnForløb() {
  if (k && k.fase === 'gør') tegn();
}

// En kort linje i forløbets linje (fx "Prøv at sætte det på oxygen"). Står, til trinet skifter, eller til næste vink.
export function forløbVink(tekst) {
  if (!k || k.vink === tekst) return;
  k.vink = tekst;
  tegn();
}

// Fasen i det forløb, der kører ('gæt', 'gør', 'så' eller 'slut'), fx så et tryk i scenen kun tæller, når trinet venter på det
export function forløbFase() {
  return k ? k.fase : null;
}

// Venter trinet på handlingen? (fasen 'gæt' eller 'gør': Man må gerne handle uden at gætte, stilguiden B4)
export function forløbVenter() {
  return Boolean(k && (k.fase === 'gæt' || k.fase === 'gør'));
}

// Brugeren er gået i gang i scenen uden at gætte ("jeg vil prøve selv"): Gættet toner væk, og instruksen står hvidt
export function forløbRørt() {
  if (!k || k.fase !== 'gæt') return;
  k.fase = 'gør';
  tegn();
}

export function startForløb(data, del) {
  if (k) afslut({ stille: true });
  const skærm = document.getElementById(data.del);
  lukHvorfor();
  dæmpPiller(true);
  skærm.classList.add('i-forløb');
  const linje = document.createElement('div');
  linje.className = 'forløb-linje';
  linje.setAttribute('role', 'region');
  linje.setAttribute('aria-label', `Tur: ${data.titel}`);
  linje.addEventListener('click', klik);
  skærm.append(linje);
  // igen: turen er taget før, så prikkerne kan trykkes (stilguiden B7)
  k = { data, del, skærm, linje, nr: 0, fase: 'gør', gæt: null, viser: false, vist: [], vink: '', igen: fremgang.forløbTaget(data.id) };
  gåTil(0);
}

// Kaldes af delens stop (skærmskift): forløbet slutter uden at blive husket som taget eller sprunget over,
// så det starter igen næste gang
export function stopForløb() {
  if (k) afslut({ stille: true });
}

function ryd() {
  token++;
  clearInterval(poll);
  clearTimeout(viserTimer);
  clearTimeout(såTimer);
  poll = viserTimer = såTimer = null;
}

let toningTimer = null;

// stille: ved et skærmskift eller et skift i delen (ingen zoom og ingen toning). toning: laboratoriet toner ind i to
// skridt (scenen og det, man styrer med, først, og det, man læser, lidt efter, stilguiden B8)
function afslut({ sprunget = false, stille = false, toning = !stille } = {}) {
  ryd();
  const { data, del, skærm, linje } = k;
  for (const el of k.vist) el.classList.remove('fl-vis');
  k = null;
  linje.remove();
  skærm.classList.remove('i-forløb');
  if (toning) {
    clearTimeout(toningTimer);
    for (const s of document.querySelectorAll('.fra-forløb')) s.classList.remove('fra-forløb');
    skærm.classList.add('fra-forløb');
    toningTimer = setTimeout(() => skærm.classList.remove('fra-forløb'), TONING);
  }
  dæmpPiller(false);
  lukHvorfor();
  if (sprunget) fremgang.markérForløb(data.id, 'sprunget');
  del.slut?.();
  // Scenen får panelerne igen. Ikke ved et skærmskift eller et skift i delen (stille): Så har den nye skærm sit eget kamera.
  if (!stille) {
    requestAnimationFrame(() => {
      centrerVindue();
      del.layout?.();
    });
  }
  if (sprunget && !stille) {
    visBesked({ titel: 'Udforsk selv', tekst: `Du kan tage turen "${data.titel}" igen med ↻ øverst.`, varighed: 7000 });
  }
}

const trin = () => k.data.trin[k.nr];
const delTrin = () => k.del.trin[trin().id] ?? {};
const sidste = () => k.nr === k.data.trin.length - 1;

function gåTil(nr) {
  ryd();
  k.nr = Math.max(0, Math.min(nr, k.data.trin.length - 1));
  k.gæt = null;
  k.viser = false;
  k.vistHandling = false;
  k.vink = '';
  for (const el of k.vist) el.classList.remove('fl-vis');
  const d = delTrin();
  d.start?.();
  k.vist = (d.vis ?? []).flatMap((v) => [...k.skærm.querySelectorAll(v)]);
  for (const el of k.vist) el.classList.add('fl-vis');
  k.fase = trin().gæt ? 'gæt' : 'gør';
  ventPåHandling();
  tegn();
  nytLayout();
}

// Scenen har fået en ny størrelse (panelerne er skjult, eller noget er kommet frem): centrér den, og lad delen
// zoome igen (layout), når browseren har lagt siden om
function nytLayout() {
  requestAnimationFrame(() => {
    centrerVindue();
    k?.del.layout?.();
  });
}

// Venter på, at handlingen er gjort (også mens man gætter: Man må gerne handle uden at gætte, stilguiden B4)
function ventPåHandling() {
  const mit = token;
  const d = delTrin();
  poll = setInterval(() => {
    if (mit !== token || !d.færdig?.()) return;
    clearInterval(poll);
    poll = null;
    såTimer = setTimeout(() => { if (mit === token) tilSå(); }, SÅ_EFTER);
  }, 150);
}

function tilSå() {
  clearInterval(poll);
  clearTimeout(viserTimer);
  poll = null;
  k.viser = false;
  // Det sidste trin går direkte til "Det så du", medmindre det har sin egen Så-tekst (så kommer den først)
  if (sidste() && !trin().så) return tilSlut();
  k.fase = 'så';
  k.vink = ''; // et vink fra gør (fx et forsøg, der ikke lykkedes) hører ikke til Så
  tegn();
}

// "Næste ›", før handlingen er gjort: Delen viser handlingen (visMig), og Så kommer, når den er gjort, så ingen misser
// pointen (Opus' noter til E20, afsnit 3.1). Et nyt tryk, mens den viser, gør ingenting. Har delen ingen visMig, eller
// blev den ikke færdig, går et nyt tryk direkte til Så.
function næsteFørHandling() {
  const d = delTrin();
  if (k.fase === 'gæt') k.fase = 'gør';
  if (k.viser) return;
  if (d.visMig && !k.vistHandling) {
    k.vistHandling = true;
    k.viser = true;
    const mit = token;
    viserTimer = setTimeout(() => { if (mit === token && k) { k.viser = false; tegn(); } }, VISER_I);
    d.visMig();
    tegn();
    return;
  }
  tilSå();
}

// "Det så du": forløbet er taget
function tilSlut() {
  k.fase = 'slut';
  fremgang.markérForløb(k.data.id, 'taget');
  for (const opdater of turKnapper) opdater(); // prikken på "↻ Tur" (lavTurKnap)
  lyd.klaret();
  tegn();
}

function klik(h) {
  const b = h.target.closest('button');
  if (!b || !k || b.disabled) return;
  if (b.classList.contains('fagord')) return; // ordforklaringen klarer sig selv
  const d = delTrin();
  if (b.dataset.gaet != null) {
    if (k.fase !== 'gæt') return;
    lyd.klik();
    k.gæt = Number(b.dataset.gaet);
    k.fase = 'gør';
    tegn();
  } else if (b.dataset.knap) {
    const knap = d.knapper?.find((x) => x.id === b.dataset.knap);
    if (!knap) return;
    if (k.fase === 'gæt') k.fase = 'gør'; // handlet uden at gætte
    knap.gør();
    tegn();
  } else if (b.dataset.nav === 'næste') {
    if (k.fase === 'gæt' || k.fase === 'gør') {
      lyd.klik();
      return næsteFørHandling();
    }
    if (sidste()) return tilSlut(); // (lyd.klaret i stedet for klik)
    lyd.klik();
    gåTil(k.nr + 1);
  } else if (b.dataset.nav === 'trin') {
    lyd.klik();
    gåTil(Number(b.dataset.nr));
  } else if (b.dataset.nav === 'tilbage') {
    lyd.klik();
    gåTil(k.fase === 'slut' ? k.nr : k.nr - 1);
  } else if (b.dataset.nav === 'før') {
    // Det andet forløb først: dette stoppes uden at blive husket, så det starter igen næste gang
    lyd.klik();
    const før = k.data.før;
    afslut({ stille: true });
    åbnForløb(før.del, før.id);
  } else if (b.dataset.nav === 'spring') {
    lyd.klik();
    afslut({ sprunget: true });
  } else if (b.dataset.vej != null) {
    const vej = k.del.veje?.[Number(b.dataset.vej)];
    if (!vej) return;
    lyd.klik();
    if (vej.hvorfor) return visHvorfor(vej.hvorfor, b);
    // En vej til en anden skærm skal ikke zoome Værkstedet bagefter. Laboratoriet toner ind under alle veje.
    afslut({ stille: Boolean(vej.gør), toning: true });
    vej.gør?.();
  }
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Bygger linjen ud fra fasen: 'gæt' (Spørg, gættets knapper og trinets knapper), 'gør' (instruksen og trinets knapper),
// 'så' (Så, svaret på gættet, knapperne og "Næste ›") og 'slut' ("Det så du": kernesætningen og vejene videre). Har det
// sidste trin en Så-tekst, kommer den før "Det så du". Det, man skal gøre nu, står hvidt, og spørgsmålet, der er
// besvaret, toner ned (stilguiden B6). "Næste ›" står der altid: svag, til handlingen er gjort (B2).
function tegn() {
  const { data, del, linje } = k;
  const t = trin();
  const d = delTrin();
  const antal = data.trin.length;
  const slut = k.fase === 'slut';
  const prikker = data.trin.map((_, i) => {
    const klasse = `${i < k.nr || (i === k.nr && (k.fase === 'så' || slut)) ? 'ja' : ''}${i === k.nr && !slut ? ' nu' : ''}`;
    // Er turen taget før, kan man vælge trinene enkeltvis (stilguiden B7)
    return k.igen
      ? `<button class="fl-prik" data-nav="trin" data-nr="${i}" aria-label="Trin ${i + 1}"${i === k.nr && !slut ? ' aria-current="step"' : ''}><i class="${klasse}"></i></button>`
      : `<i class="${klasse}"></i>`;
  }).join('');
  let html = `<div class="fl-hoved"><b class="fl-titel">${esc(data.titel)}</b><span class="fl-prikker"${k.igen ? '' : ' aria-hidden="true"'}>${prikker}</span>`
    + `<span class="fl-nr">${slut ? 'Det så du' : `Trin ${k.nr + 1} af ${antal}`}</span>`
    + (slut ? '' : '<button class="fl-spring" data-nav="spring" title="Ud af turen: Prøv det hele selv">Udforsk selv ›</button>') + '</div>';
  const ord = (t.ord ?? []).join(' ');
  // Under Så kun de knapper, der stadig kan bruges (ingen døde knapper, når legetøjet er brugt op)
  const knapper = () => (d.knapper ?? []).filter((b) => k.fase !== 'så' || !b.aktiv || b.aktiv()).map((b) => {
    const tæller = b.tæller ? ` <small>${esc(b.tæller())}</small>` : '';
    return `<button class="fl-handling ${b.kugle ?? ''}${b.valgt?.() ? ' valgt' : ''}" data-knap="${b.id}"${b.aktiv && !b.aktiv() ? ' disabled' : ''}>`
      + `${b.kugle ? `<span class="kugle ${b.kugle}"></span>` : ''}${esc(b.tekst)}${tæller}</button>`;
  }).join('');
  // En nøgle (fx basernes farver i Liv): mærker, der ikke kan trykkes på. [{ tekst, klasse }]
  const nøgle = () => (d.nøgle ? `<span class="fl-nøgle" aria-label="Nøgle">${d.nøgle.map((m) => `<span class="fl-mærke ${m.klasse ?? ''}">${esc(m.tekst)}</span>`).join('')}</span>` : '');
  let række = '';
  if (k.fase === 'gæt') {
    html += `<p class="fl-tekst" data-ord-kun="${ord}">${esc(t.spørg)}</p>`
      + `<p class="fl-lille">Gæt, eller prøv selv. ${esc(t.gør ?? '')}</p>`;
    række = `<span class="fl-gætter">${t.gæt.valg.map((v, i) => `<button class="fl-gæt" data-gaet="${i}">${esc(v.tekst)}</button>`).join('')}</span>` + nøgle() + knapper();
  } else if (k.fase === 'gør') {
    // Instruksen: gættets "efter" (fx "Prøv det!") og trinets gør, uden at sige det samme to gange
    const efter = k.gæt != null ? t.gæt.valg[k.gæt].efter : '';
    const gør = t.gør ?? '';
    const instruks = efter && gør && !efter.includes(gør) ? `${efter} ${gør}` : (efter || gør);
    html += instruks
      ? `<p class="fl-tekst fl-spurgt" data-ord-kun="${ord}">${esc(t.spørg)}</p><p class="fl-tekst fl-gør">${esc(instruks)}</p>`
      : `<p class="fl-tekst" data-ord-kun="${ord}">${esc(t.spørg)}</p>`;
    række = nøgle() + knapper();
  } else if (k.fase === 'så') {
    html += `<p class="fl-tekst fl-så" data-ord-kun="${ord}">${esc(t.så)}</p>`;
    const svar = k.gæt != null ? t.gæt?.valg[k.gæt]?.svar : null;
    if (svar) html += `<p class="fl-lille fl-svar">${esc(svar)}</p>`;
    // Knapperne bliver: Det, man lige har forstået, må man lege videre med (stilguiden B1)
    række = nøgle() + knapper();
  } else {
    html += `<p class="fl-tekst fl-så" data-ord-kun="">${esc(data.kernesætning)}</p>`;
    if (del.slutTekst) html += `<p class="fl-lille">${esc(del.slutTekst())}</p>`;
    // Et spørgsmål er en gul pille med "?", der åbner et kort. En vej et andet sted hen har "›" (stilguiden A5 og A8)
    række = (del.veje ?? []).map((v, i) => {
      if (v.hvorfor) return `<button class="fl-vej hvorfor" data-vej="${i}">${esc(v.tekst)}</button>`;
      const pil = v.gør && !v.her && !v.tekst.includes('›') ? ' ›' : '';
      return `<button class="fl-vej${v.primær ? ' primær' : ''}" data-vej="${i}">${esc(v.tekst)}${pil}</button>`;
    }).join('');
  }
  if (k.vink && k.fase !== 'slut') html += `<p class="fl-lille fl-vink">${esc(k.vink)}</p>`;
  const før = data.før;
  if (før && k.nr === 0 && !slut && !fremgang.forløbTaget(før.id)) {
    html += `<p class="fl-lille"><button class="link-knap fl-før" data-nav="før">${esc(før.tekst)} ›</button></p>`;
  }
  const venter = k.fase === 'gæt' || k.fase === 'gør';
  const nav = (k.nr > 0 || slut ? '<button class="fl-tilbage" data-nav="tilbage" title="Et trin tilbage" aria-label="Et trin tilbage">‹</button>' : '')
    + (slut ? '' : `<button class="fl-næste${venter ? ' stille' : ''}" data-nav="næste"${venter ? ` title="${d.visMig ? 'Vis mig det, og gå videre' : 'Gå videre'}"` : ''}${k.viser ? ' aria-busy="true"' : ''}>Næste ›</button>`);
  html += `<div class="fl-række">${række}<span class="fl-nav">${nav}</span></div>`;
  // En blød toning, når fasen skifter (ikke ved hvert tryk)
  const skift = linje.dataset.fase !== k.fase || linje.dataset.nr !== String(k.nr);
  linje.innerHTML = html;
  linje.dataset.fase = k.fase;
  linje.dataset.nr = String(k.nr);
  if (skift) {
    linje.classList.remove('fl-skift');
    void linje.offsetWidth;
    linje.classList.add('fl-skift');
  }
}

// "↻ Tur" i toplinjen (E20, jeres valg 17. november 2026): Turen tages igen inde fra delen, ét fast sted i alle dele.
// ture: delens forløbsdata (forløbI(del) fra js/data/forloeb/liste.js). start(data) starter turen i delen. Har delen flere
// ture, åbner knappen en lille liste med ✓ ved dem, der er taget. Knappen er skjult, mens en tur kører (style.css).
// Prikken (klassen ny, jeres valg 17. november 2026): Så længe en af delens ture ikke er taget, har knappen en lyseblå
// prik, og listen skriver "Ny" ved den. Knapperne opdateres, når en tur bliver taget (turKnapper, tilSlut).
const turKnapper = new Set();
export function lavTurKnap(skærm, ture, start) {
  const top = skærm?.querySelector('.topbjælke .topknapper');
  if (!top || !ture.length || top.querySelector('.tur-knap')) return null;
  const knap = document.createElement('button');
  knap.className = 'knap lille tur-knap';
  knap.innerHTML = '<span aria-hidden="true">↻</span><span class="tur-tekst"> Tur</span>';
  const opdater = () => {
    const nye = ture.filter((t) => !fremgang.forløbTaget(t.id)).length;
    knap.classList.toggle('ny', nye > 0);
    if (ture.length > 1) knap.title = nye ? `Tag en tur (${nye} ${nye > 1 ? 'nye' : 'ny'})` : 'Tag en tur igen';
    else knap.title = `Tag turen "${ture[0].titel}"${nye ? '' : ' igen'}`;
    knap.setAttribute('aria-label', knap.title);
  };
  opdater();
  turKnapper.add(opdater);
  top.insertBefore(knap, top.querySelector('[title="Hjælp"]') ?? top.querySelector('.knap-fuldskaerm'));
  let liste = null;
  const udenfor = (h) => { if (liste && !liste.contains(h.target) && !knap.contains(h.target)) luk(); };
  const påEsc = (h) => { if (h.key === 'Escape') { h.stopPropagation(); luk(); knap.focus(); } };
  function luk() {
    liste?.remove();
    liste = null;
    knap.setAttribute('aria-expanded', 'false');
    removeEventListener('pointerdown', udenfor, true);
    removeEventListener('keydown', påEsc, true);
  }
  knap.addEventListener('click', () => {
    lyd.klik();
    if (ture.length === 1) return start(ture[0]);
    if (liste) return luk();
    liste = document.createElement('div');
    liste.className = 'tur-liste';
    liste.setAttribute('role', 'menu');
    for (const t of ture) {
      const b = document.createElement('button');
      b.setAttribute('role', 'menuitem');
      const taget = fremgang.forløbTaget(t.id);
      b.innerHTML = `<span class="tur-mærke">${taget ? '✓' : ''}</span><span>${esc(t.titel)}</span>${taget ? '' : '<span class="tur-ny">Ny</span>'}`;
      b.title = taget ? 'Taget. Tryk for at tage den igen.' : 'Ikke taget endnu';
      b.addEventListener('click', () => { lyd.klik(); luk(); start(t); });
      liste.append(b);
    }
    top.append(liste);
    knap.setAttribute('aria-expanded', 'true');
    addEventListener('pointerdown', udenfor, true);
    addEventListener('keydown', påEsc, true);
    liste.querySelector('button')?.focus({ preventScroll: true });
  });
  return knap;
}

// Kun til automatiske tests (via delens testAdgang)
export function forløbTest() {
  return {
    kører: () => kørerForløb(),
    trin: () => (k ? k.data.trin[k.nr].id : null),
    nr: () => (k ? k.nr : null),
    fase: () => (k ? k.fase : null),
    // "Næste ›", før handlingen er gjort (viser handlingen med delens visMig)
    visMigNu: () => { if (k && (k.fase === 'gæt' || k.fase === 'gør')) næsteFørHandling(); },
    viser: () => Boolean(k?.viser),
  };
}
