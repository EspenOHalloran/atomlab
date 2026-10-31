// Den fælles skal om fænomenerne i Kosmos og Solsystemet: listen (i Solsystemet et træ), panelet, underteksterne med
// trin, toplag og overlag i 3D-billedet og skærmens eget ur. Styringen står i selve 3D-billedet (U2 i docs/plan-ux.md):
// - bjælken forneden: turen og trinene (‹, "Næste: … ›", ↺ Forfra og ✕) og scenens handlinger (fx "▶ Start flyby")
// - Styr-boksen øverst til højre: kontakter (tændt er fyldt med ✓) og skydere
// - tidsknappen nederst til højre: ⏸ ▶ og ⏩, hvor scenen kan gå hurtigere (mellemrum skifter pausen)
// Hvert fænomen ligger i sin egen fil i js/kosmos/ og har samme opbygning (se fx rumtid.js):
// { id, navn, ikon, undertitel, citat, kamera, tal, kort, nørd, lav(gruppe, ctx) → { styring, opdater(dt, tid), stop() } }
// lav() kan også give: trin() (trinene i bjælken, se tegnBjælke), tur (en tur som flybyen, øverst i træet:
// { navn, stop, klar(), kører(), start(), skjul()? }),
// hurtig (teksten til ⏩, fx 'ca. 820 gange hurtigere'), tempo(tilstand) (kaldes, når tidsknappen skifter) og
// altid(dt) (kaldes hvert billede, også under pause, fx når Jorden glider hen til en dato fra en skyder).
//
// Elementerne i index.html har skærmens navn foran (fx kosmosListe og solsystemListe), så CSS og tests kan finde dem.

import * as THREE from 'three';
import { verden, sætVindue, passerTil, ROLIG, piletaster, visTåger, tågerVist } from './scene3d.js';
import { Effekter } from './effekter.js';
import { lyd } from './lyd.js';
import { citatHTML } from './data/citater.js';
import { visBesked, skjulUndertekst, bundIVindue } from './beskeder.js';
import { lavLagBokse } from './lag.js';
import { HVORFOR } from './data/hvorfor.js';
import { ryd, stjerneUr } from './kosmos/faelles.js';
import { lavTidsknap } from './pause.js';

// Tablet på højkant, telefoner og telefon på langs: Styr-boksen er foldet sammen fra start
const SMAL = matchMedia('(max-width: 820px), (max-height: 500px)');

// Hvor hver skærm husker det sidst valgte fænomen og de fænomener, man har kigget på
export const NØGLER = {
  kosmos: { valgt: 'atomlabKosmos', set: 'atomlabKosmosSet' },
  solsystem: { valgt: 'atomlabSolsystem', set: 'atomlabSolsystemSet' },
};

// Åbner et fænomen på en anden skærm (fx fra grundstofkortet eller en tekst i Kosmos)
export function åbnFænomen(skærm, id) {
  if (id) {
    try { localStorage.setItem(NØGLER[skærm].valgt, id); } catch { /* ingen lagring */ }
  }
  location.hash = `#${skærm}`;
}

// Knapper med data-gaa="skærm:id" (eller bare "skærm") i teksterne åbner et fænomen et andet sted
document.addEventListener('click', (h) => {
  const b = h.target.closest?.('[data-gaa]');
  if (!b) return;
  const [skærm, id] = b.dataset.gaa.split(':');
  if (!NØGLER[skærm]) return;
  lyd.klik();
  åbnFænomen(skærm, id);
});

// skærm: navnet (fx 'kosmos'). liste: fænomenerne i rækkefølge, eller grupper { navn, ikon, f, under: [fænomener] },
// hvor f er gruppens eget fænomen (uden f åbner gruppen sit første underpunkt).
export function lavFænomenSkærm({ skærm, liste }) {
  const $ = (navn) => document.getElementById(skærm + navn);
  const sektion = document.getElementById(skærm);
  const nøgler = NØGLER[skærm];
  const grupper = liste.map((x) => (x.lav ? { f: x, under: [] } : { under: [], ...x }));
  const FÆNOMENER = grupper.flatMap((g) => [g.f, ...g.under].filter(Boolean));
  const grupperet = grupper.some((g) => g.under.length);

  let set = new Set();
  let rod = null;
  let gruppe = null;
  let effekter = null;
  let aktiv = false;
  let valgt = null;
  let kørende = null; // det, fænomenets lav() gav tilbage
  let fane = 'kort';
  let tjekTid = 0;
  let tidsknap = null; // ⏸ ▶ ⏩ (tidsknap.til er true, mens tiden står stille)
  let tid = 0; // skærmens eget ur, som står stille under pause
  let forklaringVist = ''; // teksten i panelet lige nu (fra fænomenets forklaring())
  let kameraTur = null;

  function valgKnap(f) {
    const b = document.createElement('button');
    b.className = 'kosmos-valg';
    b.dataset.id = f.id;
    b.title = f.undertitel;
    b.innerHTML = `<span class="kosmos-valg-ikon">${f.ikon}</span><span class="kosmos-valg-navn">${f.navn}</span>`;
    b.addEventListener('click', () => {
      if (valgt === f) return;
      lyd.klik();
      fane = 'kort'; // et nyt fænomen starter altid på "Kort fortalt"
      vælg(f.id);
    });
    return b;
  }

  function lav() {
    rod = new THREE.Group();
    rod.visible = false;
    verden.scene.add(rod);
    gruppe = new THREE.Group();
    rod.add(gruppe);
    effekter = new Effekter(rod);
    // Styr-boksen øverst til højre i 3D-billedet. Foldet sammen til "Styr" på tablet på højkant og telefon.
    const styr = document.createElement('details');
    styr.className = 'styr';
    styr.id = `${skærm}Styr`;
    styr.open = !SMAL.matches;
    styr.innerHTML = '<summary>Styr</summary><div class="styr-indhold"></div>';
    styr.addEventListener('toggle', () => lyd.klik());
    bundIVindue($('Vindue')); // laver laget med toppen og bunden, hvis det mangler
    $('Vindue').querySelector('.vindue-top').prepend(styr);
    // Bjælken forneden (turen, trinene og handlingerne) og tidsknappen ved siden af
    const række = document.createElement('div');
    række.className = 'bjælke-række';
    const bjælke = document.createElement('div');
    bjælke.className = 'bjælke';
    bjælke.id = `${skærm}Bjælke`;
    række.append(bjælke);
    bundIVindue($('Vindue')).append(række);

    const boks = $('Liste');
    if (!grupperet) for (const g of grupper) boks.append(valgKnap(g.f));
    else {
      // Kloderne på én række (fx Jorden), og under dem et træ med den valgte klodes steder, måner og forsøg
      const kloder = document.createElement('div');
      kloder.className = 'sol-kloder';
      for (const [i, g] of grupper.entries()) {
        const b = document.createElement('button');
        b.className = 'kosmos-valg sol-klode';
        b.dataset.gruppe = i;
        if (g.f) {
          b.dataset.id = g.f.id;
          b.title = g.f.undertitel;
        }
        b.innerHTML = `<span class="kosmos-valg-ikon">${g.f?.ikon ?? g.ikon}</span><span class="kosmos-valg-navn">${g.f?.navn ?? g.navn}</span>`;
        b.addEventListener('click', () => gåTilKlode(g));
        kloder.append(b);
      }
      const træ = document.createElement('div');
      træ.className = 'sol-træ';
      træ.id = `${skærm}Træ`;
      træ.addEventListener('click', (h) => {
        const b = h.target.closest('button');
        if (!b) return;
        const g = åbenGruppe();
        if (b.dataset.tur) {
          if (!kørende?.tur?.kører()) startTur();
        } else if (b.dataset.sted) gå(g, b.dataset.sted);
        else if (b.dataset.id && valgt?.id !== b.dataset.id) {
          lyd.klik();
          fane = 'kort';
          vælg(b.dataset.id);
        } else if (b.dataset.klode) gåTilKlode(g);
      });
      boks.append(kloder, træ);
      // Vejen i toplinjen (Solsystemet › Mars › Olympus Mons): et tryk på kloden går tilbage til den
      $('Vej')?.addEventListener('click', (h) => { if (h.target.closest('button')) gåTilKlode(åbenGruppe()); });
    }
    for (const b of sektion.querySelectorAll('[data-kosmos-fane]')) {
      b.addEventListener('click', () => {
        fane = b.dataset.kosmosFane;
        lyd.klik();
        visTekst();
      });
    }
    $('Hjælp').addEventListener('click', () => { lyd.klik(); document.getElementById(`hjælp${skærm[0].toUpperCase()}${skærm.slice(1)}`).classList.remove('skjult'); });
    tidsknap = lavTidsknap({ holder: række, aktiv: () => aktiv, ændret: (t) => kørende?.tempo?.(t) });
    tidsknap.knap = række.querySelector('.tidsknap');
    tidsknap.knap.id = `${skærm}Tid`;
  }

  function start() {
    aktiv = true;
    rod.visible = true;
    verden.opdateringer.add(opdater);
    piletaster(true); // piletasterne drejer kameraet
    sætVindue($('Vindue'));
    let id = null;
    try {
      id = localStorage.getItem(nøgler.valgt);
      set = new Set(JSON.parse(localStorage.getItem(nøgler.set) || '[]')); // læses igen, hvis fremgangen er nulstillet
    } catch {
      // ingen lagring
    }
    vælg(id);
  }

  function stop() {
    aktiv = false;
    rod.visible = false;
    verden.opdateringer.delete(opdater);
    piletaster(false);
    visTåger(true);
    luk();
    tidsknap.sæt('spil');
    stjerneUr.tid = null;
    verden.styring.target.set(0, 0, 0);
    verden.styring.autoRotate = true;
    verden.styring.autoRotateSpeed = 0.5;
  }

  // Rydder det nuværende fænomen helt væk (så det ikke bruger grafikkortet, når man er et andet sted)
  function luk() {
    kameraTur = null;
    kørende?.stop?.();
    kørende = null;
    bjælkeNøgle = null;
    effekter.opdater(1e6); // alle effekter bliver færdige med det samme
    ryd(gruppe);
    $('Overlag').innerHTML = '';
    $('Toplag').innerHTML = '';
    valgt = null;
  }

  function vælg(id) {
    const f = FÆNOMENER.find((x) => x.id === id) ?? FÆNOMENER[0];
    luk();
    tidsknap.hurtig(null);
    tidsknap.sæt('spil'); // et nyt fænomen starter altid med tiden i gang
    valgt = f;
    set.add(f.id);
    try {
      localStorage.setItem(nøgler.valgt, f.id);
      localStorage.setItem(nøgler.set, JSON.stringify([...set]));
    } catch {
      // ingen lagring
    }
    visFase(null);
    visTåger(f.tåger !== false); // tåger: false = en sort himmel med stjerner (i vores eget solsystem)
    $('Forklaring').innerHTML = '';
    forklaringVist = '';
    kørende = f.lav(gruppe, {
      effekter,
      lyd,
      verden,
      fase: visFase,
      kamera: stilKamera,
      opdaterKnapper: lavStyring,
      // Fænomenet kan selv stille tidsknappen (fx står tiden stille, når man lander ved et sted på Mars)
      tiden: (tilstand) => tidsknap.sæt(tilstand),
      // Skrives kun om, når teksten ændrer sig (ellers forsvinder ordforklaringerne hver gang)
      forklaring: (html) => {
        if (html === forklaringVist) return;
        forklaringVist = html;
        $('Forklaring').innerHTML = html;
      },
      // Et sted oven på 3D-billedet, hvor fænomenet kan vise fx en graf
      overlag: () => $('Overlag'),
      // Et sted øverst til venstre i 3D-billedet (fx en lille tabel)
      toplag: () => $('Toplag'),
    });
    tidsknap.hurtig(kørende.hurtig ?? null);
    for (const b of sektion.querySelectorAll('.kosmos-valg[data-id]')) {
      b.classList.toggle('valgt', b.dataset.id === f.id);
      b.classList.toggle('ny', !set.has(b.dataset.id));
    }
    if (grupperet) {
      const åben = åbenGruppe();
      for (const b of sektion.querySelectorAll('.sol-klode')) b.classList.toggle('valgt', grupper[b.dataset.gruppe] === åben);
    }
    stedVist = undefined; // træet, panelets hoved og vejen tegnes nedenfor (visSted)
    // Er listen en vandret række (på telefoner), rulles det valgte fænomen frem
    const boks = $('Liste');
    if (!grupperet && boks.scrollWidth > boks.clientWidth + 4) {
      const b = boks.querySelector('.valgt').getBoundingClientRect();
      const l = boks.getBoundingClientRect();
      boks.scrollTo({ left: boks.scrollLeft + (b.left - l.left) - (l.width - b.width) / 2, behavior: ROLIG ? 'auto' : 'smooth' });
    }
    const antal = FÆNOMENER.filter((x) => set.has(x.id)).length;
    $('Set').textContent = antal < FÆNOMENER.length ? `${antal} af ${FÆNOMENER.length} set` : 'Alle set ★';
    $('Ikon').textContent = f.ikon;
    $('Navn').textContent = f.navn;
    $('Undertitel').textContent = f.undertitel;
    $('Tal').innerHTML = (f.tal ?? []).map(([navn, værdi]) => `<div><dt>${navn}</dt><dd>${værdi}</dd></div>`).join('');
    $('Citat').innerHTML = f.citat ? citatHTML(f.citat) : '';
    $('Citat').hidden = !f.citat;
    visTekst();
    lavStyring();
    stilKamera(f.kamera);
    visSted();
  }

  // ---------- Træet (Solsystemet): kloderne, deres steder og måner og forsøgene ----------
  // Et fænomen kan have træ: { rod, grupper: [{ navn, id?, titel?, undertitel?, punkter: [{ id, navn, undertitel?,
  // ikon?, under: [...] }] }] }. rod er id'et på kloden selv (fx 'mars'), og en gruppe med id er selv et sted (fx
  // månernes baner). lav() giver så gåTil(id) og sted() (det sted, man er ved) tilbage.
  // Forsøgene (fx Årstiderne) er gruppens andre fænomener (under i listen).
  let stedVist; // det sted, træet sidst blev tegnet for (undefined = tegn igen)
  const åbenGruppe = () => grupper.find((g) => g.f === valgt || g.under.includes(valgt));
  const stedNu = () => (kørende?.sted ? kørende.sted() : null);
  const SLAGS = { Steder: { ikon: '📍', tekst: 'Et sted på' }, Måner: { ikon: '🌑', tekst: 'En måne ved' } };

  // Punktet med id i træet: { p, gruppe }. En gruppe, der selv er et sted, giver { p: gruppen, gruppe }.
  function findPunkt(træ, id) {
    for (const gruppe of træ?.grupper ?? []) {
      if (gruppe.id === id) return { p: gruppe, gruppe };
      for (const p of gruppe.punkter) {
        if (p.id === id) return { p, gruppe };
        const u = p.under?.find((x) => x.id === id);
        if (u) return { p: u, gruppe };
      }
    }
    return null;
  }

  // Et tryk på en klode: Er man ved den, flyver man tilbage til hele kloden. Ellers vælges den.
  function gåTilKlode(g) {
    if (!g) return;
    if (g.f && valgt === g.f) {
      if (g.f.træ && stedNu() !== g.f.træ.rod) gå(g, g.f.træ.rod);
      return;
    }
    lyd.klik();
    fane = 'kort';
    vælg((g.f ?? g.under[0]).id);
  }

  // Gå til et sted i træet. Er et forsøg valgt, vælges kloden først.
  function gå(g, id) {
    if (!g?.f) return;
    lyd.klik();
    if (valgt !== g.f) {
      fane = 'kort';
      vælg(g.f.id);
      if (id === g.f.træ?.rod) return; // kloden starter selv der
    } else if (id === stedNu()) return;
    kørende?.gåTil?.(id); // flyvningen kører også, når tiden står stille
    visSted();
  }

  function stedKnap(id, navn, niveau, ikon = '') {
    const b = document.createElement('button');
    b.className = `sol-sted niveau-${niveau}`;
    b.dataset.sted = id;
    b.innerHTML = `${ikon ? `<span class="kosmos-valg-ikon">${ikon}</span>` : ''}<span>${navn}</span>`;
    return b;
  }

  // Tegner træet for den åbne klode. Det tredje niveau (fx Calderaen) står kun under det sted, man er ved.
  function tegnTræ(sted) {
    const boks = $('Træ');
    const g = åbenGruppe();
    boks.replaceChildren();
    if (!g) return;
    const træ = g.f?.træ;
    // Turen (fx flybyen) står øverst: ▶ Flyby · 13 stop. Den lyser, mens den kører.
    const tur = valgt === g.f ? kørende?.tur : null;
    if (tur) {
      const t = stedKnap('', `${tur.navn} · ${tur.stop} stop${tur.klar() ? '' : ' (henter kort …)'}`, 0, '▶');
      delete t.dataset.sted;
      t.dataset.tur = '1';
      t.classList.add('sol-tur');
      t.classList.toggle('valgt', tur.kører());
      t.disabled = !tur.klar() || Boolean(tur.skjul?.());
      boks.append(t);
    }
    if (g.f) {
      const rod = træ ? stedKnap(træ.rod, g.f.navn, 0, g.f.ikon) : Object.assign(document.createElement('button'), { className: 'sol-sted niveau-0' });
      if (!træ) {
        rod.dataset.klode = g.f.id;
        rod.innerHTML = `<span class="kosmos-valg-ikon">${g.f.ikon}</span><span>${g.f.navn}</span>`;
      }
      rod.classList.toggle('valgt', valgt === g.f && (!træ || sted === træ.rod));
      boks.append(rod);
    }
    const overskrift = (tekst, id) => {
      const o = id ? stedKnap(id, tekst, 'gruppe') : Object.assign(document.createElement('div'), { textContent: tekst });
      o.classList.add('sol-gruppe-navn');
      if (id) o.classList.toggle('valgt', valgt === g.f && sted === id);
      boks.append(o);
    };
    for (const gruppe of træ?.grupper ?? []) {
      overskrift(gruppe.navn, gruppe.id);
      for (const p of gruppe.punkter) {
        const k = stedKnap(p.id, p.navn, 1);
        k.classList.toggle('valgt', valgt === g.f && sted === p.id);
        boks.append(k);
        if (valgt === g.f && p.under && (sted === p.id || p.under.some((u) => u.id === sted))) {
          for (const u of p.under) {
            const ku = stedKnap(u.id, u.navn, 2);
            ku.classList.toggle('valgt', sted === u.id);
            boks.append(ku);
          }
        }
      }
    }
    if (g.under.length) {
      overskrift('Forsøg');
      for (const f of g.under) {
        const k = stedKnap('', f.navn, 1, f.ikon);
        delete k.dataset.sted;
        k.dataset.id = f.id;
        k.title = f.undertitel;
        k.classList.toggle('valgt', valgt === f);
        k.classList.toggle('ny', !set.has(f.id));
        boks.append(k);
      }
    }
  }

  // Træet, panelets hoved (navnet på stedet) og vejen i toplinjen. Kaldes, når fænomenet skifter, og når stedet gør
  // (tjekkes fire gange i sekundet, for et sted kan også vælges på kloden eller på flybyen).
  function visSted() {
    if (!grupperet || !valgt) return;
    const sted = stedNu();
    const tur = kørende?.tur;
    const nøgle = `${sted}|${tur?.kører()}|${tur?.klar()}|${tur?.skjul?.()}`; // træet tegnes også igen, når turen starter eller er klar
    if (nøgle === stedVist) return;
    stedVist = nøgle;
    tegnTræ(sted);
    const træ = valgt.træ;
    const fundet = træ && sted !== træ.rod ? findPunkt(træ, sted) : null;
    sektion.classList.toggle('ved-sted', Boolean(fundet));
    if (fundet) {
      const { p, gruppe } = fundet;
      const slags = SLAGS[gruppe.navn] ?? {};
      $('Ikon').textContent = p.ikon ?? slags.ikon ?? valgt.ikon;
      $('Navn').textContent = p.titel ?? p.navn;
      $('Undertitel').textContent = p.undertitel ?? (slags.tekst ? `${slags.tekst} ${valgt.navn}` : valgt.navn);
    } else {
      $('Ikon').textContent = valgt.ikon;
      $('Navn').textContent = valgt.navn;
      $('Undertitel').textContent = valgt.undertitel;
    }
    if ($('Om')) $('Om').textContent = `Om ${valgt.navn}`;
    // Vejen: › Mars › Olympus Mons (kloden er en knap, når man er et andet sted end ved hele kloden)
    const vej = $('Vej');
    if (vej) {
      const g = åbenGruppe();
      const klode = g.f ?? valgt;
      const herunder = fundet ? (fundet.p.titel ?? fundet.p.navn) : valgt !== klode ? valgt.navn : null;
      vej.replaceChildren('› ');
      if (herunder) {
        vej.append(Object.assign(document.createElement('button'), { className: 'link-knap', textContent: klode.navn }), ` › ${herunder}`);
      } else vej.append(klode.navn);
    }
  }

  // "Kort fortalt": første afsnit står fremme, og resten er foldet sammen under "Mere" (lag 2).
  // Har fænomenet "Hvorfor?"-kort (hvorfor: [id]), står de nederst.
  function visTekst() {
    for (const b of sektion.querySelectorAll('[data-kosmos-fane]')) b.classList.toggle('valgt', b.dataset.kosmosFane === fane);
    const boks = $('Tekst');
    boks.innerHTML = valgt ? valgt[fane] : '';
    if (valgt && fane === 'kort') {
      const afsnit = [...boks.children];
      if (afsnit.length > 1) {
        const mere = document.createElement('details');
        mere.className = 'lag-boks kosmos-mere';
        mere.dataset.lag = 'kosmos-mere';
        mere.innerHTML = '<summary><strong>Mere</strong></summary>';
        mere.append(...afsnit.slice(1));
        boks.append(mere);
        lavLagBokse(boks);
      }
      if (valgt.hvorfor?.length) {
        const linje = document.createElement('p');
        linje.className = 'hvorfor-linje';
        for (const id of valgt.hvorfor) {
          const k = document.createElement('button');
          k.className = 'hvorfor';
          k.dataset.hvorfor = id;
          k.textContent = HVORFOR[id].spørgsmål;
          linje.append(k, ' ');
        }
        boks.append(linje);
      }
    }
    boks.scrollTop = 0;
  }

  // En undertekst nederst i 3D-billedet, der fortæller, hvad der sker lige nu (fx "Jernkernen falder sammen").
  // Den bliver stående, til den næste fase kommer. trin = [nr, ialt] viser prikker. titel = null fjerner den.
  // Har fænomenet trin i bjælken (trin()), kan man trykke på prikkerne og gå til et trin.
  let faseNu = null; // { titel, tekst, trin, klikbar } den fase, der står nu
  function visFase(titel, tekst = '', trin = null) {
    if (!titel) {
      faseNu = null;
      skjulUndertekst('fase');
      return;
    }
    const t = kørende?.trin?.();
    const klikbar = Boolean(t && trin && trin[1] === t.ialt);
    faseNu = { titel, tekst, trin, klikbar };
    const vedTrin = klikbar ? (nr) => brugTrin((x) => x.gå(nr - 1)) : null;
    visBesked({ titel, tekst, type: 'fase', varighed: 0, trin, vedTrin, log: false });
  }

  // Kameraet: retning (hvorfra vi kigger), radius (hvor stort det, vi skal se, er) og mål (midten).
  // flyv: true = kameraet flyver ind langt udefra. false = det glider blødt fra, hvor det er nu.
  function stilKamera({ retning, radius = 16, mål = [0, 0, 0], drej = true, flyv = true } = {}) {
    const s = verden.styring;
    const k = verden.kamera;
    s.autoRotate = drej;
    s.autoRotateSpeed = 0.35;
    const nu = k.position.clone().sub(s.target);
    if (flyv) {
      s.target.set(...mål);
      k.position.copy(s.target).addScaledVector(new THREE.Vector3(...(retning ?? [0, 0.4, 1])).normalize(), radius * 7);
      kameraTur = null;
      passerTil(radius);
      return;
    }
    passerTil(radius);
    kameraTur = {
      t: 0,
      fraMål: s.target.clone(),
      tilMål: new THREE.Vector3(...mål),
      fraRetning: nu.clone().normalize(),
      tilRetning: retning ? new THREE.Vector3(...retning).normalize() : nu.clone().normalize(),
      fraAfstand: nu.length(),
      tilAfstand: verden.målAfstand ?? nu.length(),
    };
    verden.målAfstand = null; // vi styrer selv afstanden under turen
  }

  function kørKameraTur(dt) {
    if (!kameraTur) return;
    const tur = kameraTur;
    tur.t = ROLIG ? 1 : Math.min(1, tur.t + dt / 1.3); // "reducer bevægelse": hop straks på plads
    const e = tur.t * tur.t * (3 - 2 * tur.t); // blød start og slutning
    const s = verden.styring;
    s.target.lerpVectors(tur.fraMål, tur.tilMål, e);
    const retning = tur.fraRetning.clone().lerp(tur.tilRetning, e).normalize();
    verden.kamera.position.copy(s.target).addScaledVector(retning, tur.fraAfstand + (tur.tilAfstand - tur.fraAfstand) * e);
    if (tur.t >= 1) kameraTur = null;
  }

  // Styringen fra fænomenet: Kontakter (til/fra) og skydere står i Styr-boksen, og handlingerne (knapper, der
  // starter noget, fx "💥 Send en solstorm") står i bjælken. Et punkt med skjul() vises ikke, når den giver true.
  function lavStyring() {
    const boks = $('Styr').querySelector('.styr-indhold');
    boks.replaceChildren();
    for (const s of kørende?.styring ?? []) {
      if (s.skyder) {
        const div = document.createElement('label');
        div.className = 'skyder-boks';
        div.innerHTML = `<span class="skyder-top"><span></span><strong></strong></span><input type="range">`;
        div.querySelector('.skyder-top span').textContent = s.navn;
        const vis = div.querySelector('strong');
        const input = div.querySelector('input');
        Object.assign(input, { min: s.min, max: s.max, step: s.trin ?? 1, value: s.værdi });
        vis.textContent = s.vis ? s.vis(s.værdi) : s.værdi;
        input.addEventListener('input', () => {
          s.værdi = Number(input.value);
          vis.textContent = s.vis ? s.vis(s.værdi) : s.værdi;
          s.ændring(s.værdi);
        });
        // Fænomenet kan selv flytte skyderen (fx når Jorden kører rundt i Årstidernes første trin)
        s.sæt = (v) => {
          s.værdi = v;
          input.value = v;
          vis.textContent = s.vis ? s.vis(v) : v;
        };
        boks.append(div);
      } else if (s.til !== undefined) {
        // En kontakt: tændt er fyldt med ✓, slukket er en tynd kant
        const b = document.createElement('button');
        b.className = 'kontakt';
        b.setAttribute('role', 'switch');
        b.innerHTML = '<span class="kontakt-boks" aria-hidden="true"></span><span></span>';
        b.lastChild.textContent = s.tekst;
        const vis = () => {
          b.classList.toggle('til', s.til);
          b.setAttribute('aria-checked', String(s.til));
        };
        vis();
        b.addEventListener('click', () => {
          s.til = !s.til;
          vis();
          lyd.klik();
          s.skift(s.til);
        });
        s.knap = b;
        boks.append(b);
      }
    }
    $('Styr').hidden = !boks.children.length;
    bjælkeNøgle = null; // handlingerne kan have skiftet
    tjekKnapper();
  }

  // En handling eller et trin skal kunne ses: Står tiden stille, går den igen (et sted på Mars stopper den selv)
  function fortsæt() {
    if (tidsknap.til) tidsknap.sæt('spil');
  }
  function brugTrin(gør) {
    const t = kørende?.trin?.();
    if (!t) return;
    lyd.klik();
    fortsæt();
    gør(t);
    tjekKnapper();
  }
  function startTur() {
    const tur = kørende?.tur;
    if (!tur || tur.kører() || !tur.klar()) return;
    lyd.klik();
    fortsæt();
    tur.start();
    tjekKnapper();
  }

  // Bjælken i 3D-billedet. Fænomenets trin() giver { nr, ialt, næste, gå(nr), forfra?, stop? } (nr starter ved 0, og
  // næste er navnet på det næste trin eller ''), eller null, når der ikke er trin lige nu. Uden trin står
  // handlingerne og turens start ("▶ Start flyby"). Bjælken bygges kun om, når den har ændret sig.
  let bjælkeNøgle = null;
  function tegnBjælke() {
    const bjælke = $('Bjælke');
    const t = kørende?.trin?.() ?? null;
    const tur = kørende?.tur;
    const handlinger = (kørende?.styring ?? []).filter((s) => s.handling && !s.skjul?.());
    const turStart = tur && !tur.kører() && !tur.skjul?.() ? (tur.klar() ? `▶ Start ${tur.navn.toLowerCase()}` : `▶ Start ${tur.navn.toLowerCase()} (henter kort …)`) : null;
    const nøgle = JSON.stringify([t && [t.nr, t.ialt, t.næste, !!t.forfra, !!t.stop], handlinger.map((s) => s.tekst), turStart]);
    if (nøgle !== bjælkeNøgle) {
      bjælkeNøgle = nøgle;
      bjælke.replaceChildren();
      const knap = (tekst, klasse, gør) => {
        const b = Object.assign(document.createElement('button'), { className: `knap lille ${klasse}`, textContent: tekst });
        b.addEventListener('click', () => { if (!b.disabled) gør(); });
        bjælke.append(b);
        return b;
      };
      if (t) {
        const tilbage = knap('‹', 'bjælke-tilbage', () => brugTrin((x) => x.gå(x.nr - 1)));
        tilbage.title = 'Et trin tilbage';
        tilbage.setAttribute('aria-label', tilbage.title);
        tilbage.disabled = t.nr <= 0;
        if (t.nr < t.ialt - 1) knap(t.næste ? `Næste: ${t.næste} ›` : 'Næste ›', 'bjælke-næste', () => brugTrin((x) => x.gå(x.nr + 1)));
        else if (t.forfra) knap('↺ Forfra', 'bjælke-forfra', () => brugTrin((x) => x.forfra()));
        if (t.stop) {
          const stop = knap('✕', 'bjælke-stop', () => brugTrin((x) => x.stop()));
          stop.title = `Stop ${tur?.navn.toLowerCase() ?? 'turen'}`;
          stop.setAttribute('aria-label', stop.title);
        }
      }
      for (const s of handlinger) {
        s.knap = knap(s.tekst, 'bjælke-handling', () => {
          lyd.klik();
          fortsæt(); // en handling (fx "Lad stjernen eksplodere") skal kunne ses
          s.handling();
          tjekKnapper();
        });
      }
      if (turStart) {
        const b = knap(turStart, 'bjælke-handling bjælke-tur', startTur);
        b.disabled = !tur.klar();
      }
      bjælke.hidden = !bjælke.children.length;
      // Prikkerne i underteksten kan bruges, når der er trin (fasen kom måske, før trinene var klar)
      if (faseNu?.trin && !faseNu.klikbar && t) visFase(faseNu.titel, faseNu.tekst, faseNu.trin);
    }
    for (const s of handlinger) if (s.knap) s.knap.disabled = Boolean(s.deaktiv?.());
  }

  // Nogle knapper kan ikke bruges hele tiden (fx "Eksplodér", når stjernen allerede er eksploderet)
  function tjekKnapper() {
    tegnBjælke();
    visSted(); // stedet kan være valgt på kloden eller på flybyen
    pladsTilStyr();
  }

  // Styr-boksen dækker ikke toplaget (fx Årstidernes tabel): Er der ikke plads ved siden af, rykker den ned under det
  function pladsTilStyr() {
    const top = $('Toplag');
    const styr = $('Styr');
    const v = $('Vindue');
    const ved = top.offsetWidth > 0 && top.offsetLeft + top.offsetWidth + 8 > v.clientWidth - styr.offsetWidth - 8;
    const ned = ved ? `${top.offsetTop + top.offsetHeight}px` : '';
    if (styr.style.marginTop !== ned) styr.style.marginTop = ned;
  }

  function opdater(dt) {
    if (!aktiv || !kørende) return;
    kørKameraTur(dt); // kameraet kan stadig flyve under pause
    kørende.altid?.(dt);
    if (!tidsknap.til) {
      tid += dt;
      stjerneUr.tid = tid; // stjernernes overflade står også stille under pause
      kørende.opdater(dt, tid);
      effekter.opdater(dt);
    }
    tjekTid += dt;
    if (tjekTid > 0.25) {
      tjekTid = 0;
      tjekKnapper();
    }
  }

  // Adgang for automatiske tests
  function testAdgang() {
    return {
      fænomener: FÆNOMENER.map((f) => f.id),
      vælg: (id) => vælg(id),
      valgt: () => valgt?.id,
      // Teksterne på knapperne i bjælken og navnene i Styr-boksen
      knapper: () => {
        tjekKnapper();
        return [...$('Bjælke').querySelectorAll('button'), ...$('Styr').querySelectorAll('.kontakt, .skyder-top > span')].map((b) => b.textContent.trim());
      },
      // Knapperne i bjælken: { tekst, slået } (slået = kan ikke bruges lige nu)
      bjælke: () => {
        tjekKnapper();
        return [...$('Bjælke').querySelectorAll('button')].map((b) => ({ tekst: b.textContent.trim(), slået: b.disabled }));
      },
      // Punkterne i Styr-boksen: { slags: 'kontakt' | 'skyder' | 'andet', navn, til }
      styr: () => [...$('Styr').querySelector('.styr-indhold').children].map((e) => ({
        slags: e.classList.contains('kontakt') ? 'kontakt' : e.classList.contains('skyder-boks') ? 'skyder' : 'andet',
        navn: (e.classList.contains('kontakt') ? e : e.querySelector('.skyder-top > span'))?.textContent.trim(),
        til: e.classList.contains('kontakt') ? e.classList.contains('til') : undefined,
      })),
      styrÅben: () => $('Styr').open && !$('Styr').hidden,
      // Tryk på en knap i bjælken eller en kontakt i Styr-boksen ud fra teksten (uden forskel på store og små
      // bogstaver). Giver false, hvis den ikke findes eller ikke kan bruges.
      trykPå: (tekst) => {
        tjekKnapper();
        const t = tekst.toLowerCase();
        const b = [...$('Bjælke').querySelectorAll('button'), ...$('Styr').querySelectorAll('.kontakt')]
          .find((x) => x.textContent.trim().toLowerCase().includes(t));
        if (!b || b.disabled) return false;
        b.click();
        return true;
      },
      trin: () => { const t = kørende?.trin?.(); return t ? { nr: t.nr, ialt: t.ialt, næste: t.næste } : null; },
      pause: () => tidsknap.til,
      tidsknap: () => tidsknap.tilstand, // 'pause', 'spil' eller 'hurtig'
      sætTid: (tilstand) => tidsknap.sæt(tilstand),
      kamera: () => verden.kamera.position.toArray(),
      fænomen: () => kørende?.test, // fænomenets egen testadgang (fx Saturns måner)
      // Træet (Solsystemet): punkterne, der vises ({ id, navn, valgt, niveau }), det sted, man er ved, og gå til et sted
      træ: () => [...sektion.querySelectorAll('.sol-træ button')].map((b) => ({
        id: b.dataset.tur ? 'tur' : b.dataset.sted ?? b.dataset.id ?? b.dataset.klode, navn: b.textContent, valgt: b.classList.contains('valgt'),
        niveau: b.classList.contains('niveau-2') ? 2 : b.classList.contains('niveau-0') ? 0 : 1,
      })),
      sted: () => stedNu(),
      gåTil: (id) => { kørende?.gåTil?.(id); visSted(); },
      tåger: () => tågerVist(), // de farvede tågeskyer på himlen
      tid: () => tid,
      stjerneTid: () => stjerneUr.tid,
      antalObjekter: () => { let n = 0; gruppe.traverse(() => n++); return n; },
      // Antal trin i efterbehandlingen (Sort hul lægger et trin til, som skal fjernes igen)
      efterbehandling: () => verden.komponist.passes.length,
      // Spoler tiden frem (testbrowseren tegner kun få billeder i sekundet)
      spol: (sekunder) => {
        for (let t = 0; t < sekunder; t += 0.05) opdater(0.05);
      },
      // Kameraet springer straks derhen, hvor det er på vej hen
      kameraFrem: () => {
        kørKameraTur(10);
        const { kamera, styring, målAfstand } = verden;
        const retning = kamera.position.clone().sub(styring.target);
        if (målAfstand != null) kamera.position.copy(styring.target).add(retning.setLength(målAfstand));
        verden.målAfstand = null;
      },
    };
  }

  return { FÆNOMENER, lav, start, stop, testAdgang };
}
