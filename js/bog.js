// Bogen (docs/plan-videnskabsfolk.md, afsnit 3 og 4): klodsen, som alle ti bøger i Opdagelserne bruger. Én ting ad
// gangen: ét opslag fremme, bladring med "‹" og "›" (mindst 44 px), et vandret stryg med fingeren og piletasterne.
// Bladringen vender siden om ryggen (et blad med det gamle opslag drejer væk, 0,45 s, kortere og uden skær med lav, slet
// ingen bevægelse med ROLIG). Ændret 18. november 2026 efter brugerens ønske: "Bogen må animeres mere". Før var det et skub.
//
// Den fælles ramme (størrelsen, knapperne, sidetallet og papirets kant) står i style.css under #opdagelser. Tidens
// udseende kommer fra bogens stil (js/data/opdagelser.js) som CSS-variabler: --bog-papir, --bog-papir-mork, --bog-blaek og
// --bog-skrift.
//
// lavBog(rod, bog, tekster, { rolig, lav, påBladr, påBegynd, lavScene }) bygger bogen i rod og giver { vis(nr), bladr(retning),
// nr(), antal(), opslag(), find(id), lås(ja), scene(), fjern() }. tekster er modulet fra bog.tekster() med FORSIDE og
// OPSLAG. Bogen har kun de opslag, der er bygget (E20 fund 6, stilguiden A9). Opslagets slags:
//   'forside'  portrættet, spørgsmålet, Galileis lille tegning (eller bogens egen), navnet og "Begynd"
//   'scene'    et kapitel med en tegning, man gør noget i (fortællingen, H2): titlen og et felt (.bog-scene), som
//              lavScene(opslag, felt) fylder (bogens egen fil i js/bog/). lavScene giver et objekt med fjern(), som
//              kaldes, når man bladrer væk
//   'sider'    bogen selv (H4): de rigtige sider fra personens bog (tekster.BOGEN) med faner, glødende steder, der viser
//              latinen og vores oversættelse, og "Linje for linje". Siderne hentes med hentBillede (js/hentning.js),
//              første gang opslaget åbnes, og toner ind
//   'om'       bogens sidste opslag "Om …" (H4, tekster.OM): navnet, højst to tal, højst tre sætninger, højst fire
//              "Hvorfor?"-kort (visHvorfor fra js/lag.js) og "Vil du vide mere?" og "Ærligt talt" som lukkede foldebokse
// påBegynd() kaldes ved "Begynd" (giver den true, bladrer bogen ikke selv). lås(true) slår bladringen fra (knapperne,
// stryget og bladr()), mens et forløb kører i bogen.

import { hentBillede } from './hentning.js';
import { lavLagBokse, visHvorfor, lukHvorfor, vistHvorfor } from './lag.js';

const STRYG = 50; // px vandret, før et stryg bladrer
const sideBilleder = new Map(); // fil → Promise med et hentet <img> (siderne hentes kun én gang)
const valgtSide = new Map(); // bog → { side, sted }, så opslaget husker siden, når man bladrer frem og tilbage

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

// Bogen selv (H4): faner til siderne, siden med de glødende steder (knapper, så de kan bruges med tastatur) og ved
// siden af stederne som knapper på mindst 44 px, forklaringen og "Linje for linje".
function siderHTML(o, b) {
  return `<div class="bog-opslag bog-sider-opslag"><h3 class="bog-kapitel">${esc(o.titel)}</h3>`
    + `<div class="bs-faner" role="group" aria-label="Siderne">${b.sider.map((s, i) => `<button class="bs-fane" data-side="${i}" aria-pressed="false">${esc(s.fane)}</button>`).join('')}</div>`
    + '<div class="bs-krop"><div class="bs-billede"><p class="bs-henter">Henter siden …</p></div>'
    + '<div class="bs-tekst"><p class="bs-om"></p><div class="bs-steder"></div><div class="bs-forklaring" aria-live="polite"></div></div></div></div>';
}

function linjerHTML(b, side) {
  const l = b.linjer;
  const rækker = l?.rækker.filter((r) => r.side === side.id) ?? [];
  if (!rækker.length) return '';
  return `<details class="lag-boks bs-linjer" data-lag="bog-linjer"><summary><strong>${esc(l.titel)}</strong> <span class="lag-kort">${esc(l.linje)}</span></summary>`
    + rækker.map((r) => `<div class="bs-række"><p class="bs-hvor">${esc(r.linjer)}</p><p class="bs-latin" lang="la">${esc(r.latin)}</p><p class="bs-dansk">${esc(r.dansk)}</p></div>`).join('')
    + `<p class="bs-note">${esc(l.note)}</p></details>`;
}

// Styrer et opslag af slags 'sider' og giver { fjern(), test }
function lavSider(felt, bogId, b, rolig) {
  const husk = valgtSide.get(bogId) ?? { side: 0, sted: null };
  let levende = true;
  const billede = felt.querySelector('.bs-billede');
  const steder = felt.querySelector('.bs-steder');
  const forklaring = felt.querySelector('.bs-forklaring');

  function forklar() {
    const s = b.sider[husk.side];
    const sted = s.steder.find((x) => x.id === husk.sted);
    for (const k of felt.querySelectorAll('[data-sted]')) k.setAttribute('aria-pressed', String(k.dataset.sted === husk.sted));
    forklaring.innerHTML = sted
      ? `<p class="bs-navn">${esc(sted.navn)}</p><p class="bs-latin" lang="la"><span class="bs-mærke">${esc(b.stedLatin)}</span> ${esc(sted.latin)}</p>`
        + `<p class="bs-dansk"><span class="bs-mærke">${esc(b.stedDansk)}</span> ${esc(sted.dansk)}</p>`
      : `<p class="bs-vælg">${esc(b.vælg)}</p>`;
  }

  function visSide(nr) {
    husk.side = nr;
    husk.sted = null;
    const s = b.sider[nr];
    for (const k of felt.querySelectorAll('.bs-fane')) k.setAttribute('aria-pressed', String(Number(k.dataset.side) === nr));
    felt.querySelector('.bs-om').textContent = s.om;
    steder.innerHTML = s.steder.map((x) => `<button class="bs-sted-knap" data-sted="${x.id}" aria-pressed="false">${esc(x.navn)}</button>`).join('');
    felt.querySelector('.bs-linjer')?.remove();
    forklaring.insertAdjacentHTML('afterend', linjerHTML(b, s));
    lavLagBokse(felt);
    billede.style.setProperty('--forhold', `${s.b} / ${s.h}`);
    billede.style.setProperty('--r', String(s.b / s.h)); // til sidens højde i CSS (højst 58 % af bogens bredde)
    billede.dataset.side = s.id;
    billede.querySelectorAll('img, .bs-glød').forEach((e) => e.remove());
    billede.classList.add('henter');
    forklar();
    hentSide(s).then((img) => {
      if (!levende || b.sider[husk.side] !== s) return;
      // Det hentede <img> sættes selv ind (blob-adressen er lukket, så en kopi ville være tom). Et opslag ad gangen,
      // så det samme billede kan flyttes ind igen, når man kommer tilbage.
      img.alt = s.alt;
      img.className = 'bs-side';
      billede.prepend(img);
      billede.insertAdjacentHTML('beforeend', s.steder.flatMap((x) => x.felter.map(([v, o, br, h]) =>
        `<button class="bs-glød" data-sted="${x.id}" aria-pressed="${x.id === husk.sted}" aria-label="${esc(x.navn)}" style="left:${v}%;top:${o}%;width:${br}%;height:${h}%"></button>`)).join(''));
      billede.classList.remove('henter');
      // De andre sider hentes bagefter, så fanerne skifter med det samme
      for (const a of b.sider) hentSide(a).catch(() => {});
    }).catch(() => {
      if (levende) billede.querySelector('.bs-henter').textContent = 'Siden kunne ikke hentes.';
    });
  }

  const klik = (h) => {
    const k = h.target.closest('button');
    if (!k) return;
    if (k.dataset.side) visSide(Number(k.dataset.side));
    else if (k.dataset.sted) {
      husk.sted = husk.sted === k.dataset.sted && k.classList.contains('bs-glød') ? null : k.dataset.sted;
      forklar();
      // Et tryk på siden: forklaringen står over siden på højkant, så den rulles frem, hvis den ikke kan ses
      if (husk.sted && k.classList.contains('bs-glød')) forklaring.scrollIntoView({ block: 'nearest', behavior: rolig ? 'auto' : 'smooth' });
    }
  };
  felt.addEventListener('click', klik);
  valgtSide.set(bogId, husk);
  const valgt = husk.sted; // visSide glemmer stedet, så det sættes igen
  visSide(husk.side);
  if (valgt) { husk.sted = valgt; forklar(); }
  return {
    fjern() { levende = false; felt.removeEventListener('click', klik); },
    test: {
      side: () => b.sider[husk.side].id,
      sted: () => husk.sted,
      hentet: () => !billede.classList.contains('henter'),
      visSide,
      vælg(id) { husk.sted = id; forklar(); },
    },
  };
}

// "Om …" (H4): budgettet fra planen (titel, to tal, tre sætninger, fire spørgsmål, så de lukkede lag)
function omHTML(o, om, bogId) {
  // "Vil du vide mere?" (nørd) er en lille, lys linje uden den korte tekst (18. november 2026)
  const boks = (lag, slags) => `<details class="lag-boks bo-lag${slags === 'ærligt' ? ' ærligt' : ' lag-mere'}" data-lag="bog-${slags}-${bogId}"><summary><strong>${esc(lag.titel)}</strong>${slags === 'ærligt' ? ` <span class="lag-kort">${esc(lag.linje)}</span>` : ''}</summary>`
    + `<ul>${lag.punkter.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></details>`;
  return `<div class="bog-opslag bog-om-opslag"><h3 class="bog-kapitel">${esc(o.titel)}</h3><div class="bo-krop">`
    + `<p class="bo-navn">${esc(om.navn)}</p>`
    + `<div class="bo-tal">${om.tal.slice(0, 2).map((x) => `<p><b>${esc(x.tal)}</b> <span>${esc(x.tekst)}</span></p>`).join('')}</div>`
    + `<p class="bo-tekst">${esc(om.sætninger)}</p>`
    + `<div class="bo-hvorfor">${om.hvorfor.slice(0, 4).map((h, i) => `<button class="hvorfor" data-bo-hvorfor="${i}" aria-expanded="false">${esc(h.spørgsmål)}</button>`).join('')}</div>`
    + boks(om.nørd, 'nørd') + boks(om.ærligt, 'ærligt')
    + '</div></div>';
}

function lavOm(felt, om) {
  lavLagBokse(felt);
  const klik = (h) => {
    const k = h.target.closest('button[data-bo-hvorfor]');
    if (!k) return;
    if (k.getAttribute('aria-expanded') === 'true' && vistHvorfor()) lukHvorfor();
    else visHvorfor(om.hvorfor[Number(k.dataset.boHvorfor)], k);
  };
  felt.addEventListener('click', klik);
  return {
    fjern() { felt.removeEventListener('click', klik); lukHvorfor(); },
    test: {
      lag: () => [...felt.querySelectorAll('details.bo-lag')].map((d) => ({ titel: d.querySelector('strong').textContent, åben: d.open })),
    },
  };
}

function hentSide(s) {
  if (!sideBilleder.has(s.fil)) {
    const p = hentBillede(s.fil);
    p.catch(() => sideBilleder.delete(s.fil)); // prøv igen næste gang
    sideBilleder.set(s.fil, p);
  }
  return sideBilleder.get(s.fil);
}

// Bladet, der vendes (18. november 2026): en kopi af det gamle opslag ligger over det nye og drejer om ryggen (venstre
// kant frem, højre kant tilbage), mens skyggen på bladet bliver mørkere, og et lyst skær glider hen over det. Kun transform
// og opacity, så det kører glat på tabletten. Lærreder kopieres med drawImage, og de hentede sider (blob, lukket adresse)
// flyttes selv over i kopien. Giver bladet, så vis() kan lægge det over det nye opslag.
const VEND_TID = 450, VEND_TID_LAV = 300;
function lavBlad(ramme) {
  const blad = document.createElement('div');
  blad.className = 'bog-ramme bog-blad';
  blad.setAttribute('aria-hidden', 'true');
  blad.inert = true;
  // De hentede sider tages ud før kopien (en kopi ville prøve at hente den lukkede blob-adresse) og sættes ind i bladet
  const sider = [...ramme.querySelectorAll('img.bs-side')];
  sider.forEach((img) => img.replaceWith(document.createElement('i')));
  for (const barn of ramme.children) blad.append(barn.cloneNode(true));
  const gamle = ramme.querySelectorAll('canvas'), nye = blad.querySelectorAll('canvas');
  gamle.forEach((c, i) => { try { if (c.width && c.height) nye[i].getContext('2d')?.drawImage(c, 0, 0); } catch { /* et lærred i 3D kan ikke kopieres */ } });
  const pladser = blad.querySelectorAll('.bs-billede > i');
  sider.forEach((img, i) => pladser[i]?.replaceWith(img));
  return blad;
}

export function lavBog(rod, bog, tekster, { rolig = false, lav = false, påBladr = null, påBegynd = null, lavScene = null } = {}) {
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
    // Det gamle opslag bliver et blad, der vendes væk (før scenen fjernes, så tegningen er med)
    rod.querySelector('.bog-blad')?.remove();
    const blad = retning && !rolig && ramme.animate && ramme.childElementCount ? lavBlad(ramme) : null;
    const gammelTop = ramme.scrollTop;
    scene?.fjern();
    scene = null;
    ramme.innerHTML = o.slags === 'forside' ? forsideHTML(bog, tekster.FORSIDE)
      : o.slags === 'sider' ? siderHTML(o, tekster.BOGEN)
        : o.slags === 'om' ? omHTML(o, tekster.OM, bog.id) : sceneHTML(o);
    ramme.dataset.opslag = o.id;
    ramme.scrollTop = 0;
    if (o.slags === 'scene' && lavScene) scene = lavScene(o, ramme.querySelector('.bog-scene'));
    else if (o.slags === 'sider') scene = lavSider(ramme.querySelector('.bog-sider-opslag'), bog.id, tekster.BOGEN, rolig);
    else if (o.slags === 'om') scene = lavOm(ramme.querySelector('.bog-om-opslag'), tekster.OM);
    // Portrættet toner ind, når det er hentet (ingen tom ramme, der blinker)
    const img = ramme.querySelector('.bog-portræt img');
    if (img && !img.complete) {
      img.classList.add('henter');
      img.addEventListener('load', () => img.classList.remove('henter'), { once: true });
      img.addEventListener('error', () => img.classList.remove('henter'), { once: true });
    }
    if (blad) vend(blad, retning, gammelTop);
    sidetal.textContent = `${nr + 1} / ${opslag.length}`;
    pile();
  }

  function vend(blad, retning, top) {
    const tid = lav ? VEND_TID_LAV : VEND_TID;
    const frem = retning > 0;
    blad.insertAdjacentHTML('beforeend', `<div class="bog-blad-skygge"></div>${lav ? '' : '<div class="bog-blad-skær"></div>'}`);
    rod.append(blad);
    // Lige over rammen, uanset hvilket element bladet måles fra
    const r = ramme.getBoundingClientRect(), f = blad.offsetParent ?? document.body, p = f.getBoundingClientRect();
    Object.assign(blad.style, { top: `${r.top - p.top - f.clientTop + f.scrollTop}px`, left: `${r.left - p.left - f.clientLeft + f.scrollLeft}px`, width: `${r.width}px`, height: `${r.height}px`, transformOrigin: frem ? 'left center' : 'right center' });
    blad.scrollTop = top;
    const slut = frem ? -90 : 90;
    const a = blad.animate([{ transform: 'perspective(4200px) rotateY(0deg)' }, { transform: `perspective(4200px) rotateY(${slut}deg)` }], { duration: tid, easing: 'cubic-bezier(0.45, 0, 0.75, 0.6)' });
    blad.querySelector('.bog-blad-skygge').animate([{ opacity: 0 }, { opacity: 0.75 }], { duration: tid, easing: 'ease-in', fill: 'forwards' });
    blad.querySelector('.bog-blad-skær')?.animate([{ transform: `translateX(${frem ? 120 : -120}%)` }, { transform: `translateX(${frem ? -120 : 120}%)` }], { duration: tid, easing: 'ease-in-out', fill: 'forwards' });
    // Det nye opslag ligger i skygge ved ryggen og lyser op, mens bladet drejer væk
    if (!lav) ramme.animate([{ filter: 'brightness(0.82)' }, { filter: 'none' }], { duration: tid, easing: 'ease-out' });
    a.onfinish = a.oncancel = () => blad.remove();
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
    vis: (n) => vis(n, Math.sign(n - nr)),
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
      rod.querySelector('.bog-blad')?.remove();
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
