// Den fælles skal om fænomenerne i Kosmos og Solsystemet: listen, panelet, knapperne under "Prøv selv",
// underteksterne med trin, toplag og overlag i 3D-billedet, pausen, skærmens eget ur og "Næste ›" med "Kun grafik".
// Hvert fænomen ligger i sin egen fil i js/kosmos/ og har samme opbygning (se fx rumtid.js):
// { id, navn, ikon, undertitel, citat, kamera, tal, kort, nørd, lav(gruppe, ctx) → { styring, opdater(dt, tid), stop() } }
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
import { lavPause } from './pause.js';

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
  let pause = null; // pausen (pause.til er true, mens tiden står stille)
  let tid = 0; // skærmens eget ur, som står stille under pause
  let forklaringVist = ''; // teksten i panelet lige nu (fra fænomenets forklaring())
  let kameraTur = null;

  function valgKnap(f, klasse) {
    const b = document.createElement('button');
    b.className = `kosmos-valg ${klasse}`;
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
    const næste = Object.assign(document.createElement('button'), { className: 'knap lille kosmos-næste', id: `${skærm}Næste`, hidden: true });
    bundIVindue($('Vindue')).append(næste);

    const boks = $('Liste');
    for (const [i, g] of grupper.entries()) {
      if (!grupperet) {
        boks.append(valgKnap(g.f, ''));
        continue;
      }
      // En gruppe: kloden (fx Jorden) og under den de fænomener, der hører til (fx Årstiderne)
      const div = document.createElement('div');
      div.className = 'sol-gruppe';
      div.dataset.gruppe = i;
      let hoved;
      if (g.f) hoved = valgKnap(g.f, 'sol-hoved');
      else {
        hoved = document.createElement('button');
        hoved.className = 'kosmos-valg sol-hoved';
        hoved.innerHTML = `<span class="kosmos-valg-ikon">${g.ikon}</span><span class="kosmos-valg-navn">${g.navn}</span>`;
        hoved.addEventListener('click', () => {
          if (g.under.includes(valgt)) return;
          lyd.klik();
          fane = 'kort';
          vælg(g.under[0].id);
        });
      }
      div.append(hoved);
      if (g.under.length) {
        const under = document.createElement('div');
        under.className = 'sol-under';
        for (const f of g.under) under.append(valgKnap(f, 'sol-punkt'));
        div.append(under);
      }
      boks.append(div);
    }
    for (const b of sektion.querySelectorAll('[data-kosmos-fane]')) {
      b.addEventListener('click', () => {
        fane = b.dataset.kosmosFane;
        lyd.klik();
        visTekst();
      });
    }
    $('Hjælp').addEventListener('click', () => { lyd.klik(); document.getElementById(`hjælp${skærm[0].toUpperCase()}${skærm.slice(1)}`).classList.remove('skjult'); });
    pause = lavPause({ knap: $('Pause'), vindue: $('Vindue'), aktiv: () => aktiv });
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
    pause.sæt(false);
    luk();
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
    effekter.opdater(1e6); // alle effekter bliver færdige med det samme
    ryd(gruppe);
    $('Overlag').innerHTML = '';
    $('Toplag').innerHTML = '';
    valgt = null;
  }

  function vælg(id) {
    const f = FÆNOMENER.find((x) => x.id === id) ?? FÆNOMENER[0];
    pause.sæt(false);
    luk();
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
    for (const b of sektion.querySelectorAll('.kosmos-valg[data-id]')) {
      b.classList.toggle('valgt', b.dataset.id === f.id);
      b.classList.toggle('ny', !set.has(b.dataset.id));
    }
    for (const div of sektion.querySelectorAll('.sol-gruppe')) {
      const g = grupper[div.dataset.gruppe];
      const åben = g.f === f || g.under.includes(f);
      div.classList.toggle('åben', åben);
      if (!g.f) div.querySelector('.sol-hoved').classList.toggle('valgt', åben);
    }
    // Er listen en vandret række (på telefoner), rulles det valgte fænomen frem
    const boks = $('Liste');
    if (boks.scrollWidth > boks.clientWidth + 4) {
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
  function visFase(titel, tekst = '', trin = null) {
    if (!titel) {
      skjulUndertekst('fase');
      return;
    }
    visBesked({ titel, tekst, type: 'fase', varighed: 0, trin, log: false });
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

  // Knapperne under "Prøv selv". Et punkt kan være en knap, en til/fra-knap eller en skyder.
  function lavStyring() {
    const boks = $('Styring');
    boks.innerHTML = '';
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
        continue;
      }
      const b = document.createElement('button');
      b.textContent = s.tekst;
      if (s.til !== undefined) {
        b.className = 'chip filter kosmos-til';
        b.classList.toggle('valgt', s.til);
        b.addEventListener('click', () => {
          s.til = !s.til;
          b.classList.toggle('valgt', s.til);
          lyd.klik();
          s.skift(s.til);
        });
      } else {
        b.className = 'knap lille kosmos-knap';
        b.addEventListener('click', () => {
          if (b.disabled) return;
          lyd.klik();
          pause.sæt(false); // en handling (fx "Lad stjernen eksplodere") skal kunne ses
          s.handling();
          tjekKnapper();
        });
      }
      s.knap = b;
      boks.append(b);
    }
    tjekKnapper();
  }

  // Nogle knapper kan ikke bruges hele tiden (fx "Eksplodér", når stjernen allerede er eksploderet)
  function tjekKnapper() {
    for (const s of kørende?.styring ?? []) {
      if (s.knap && s.deaktiv) s.knap.disabled = s.deaktiv();
    }
    opdaterNæste();
  }

  // Med "Kun grafik" er panelerne væk. Så står fænomenets "Næste" (eller "Start") nederst i 3D-billedet.
  function opdaterNæste() {
    const knap = $('Næste');
    const s = (kørende?.styring ?? []).find((x) => x.handling && /^(Næste|▶ Start)/.test(x.tekst) && !x.deaktiv?.());
    knap.hidden = !s;
    const tekst = s?.tekst.startsWith('▶') ? s.tekst : 'Næste ›';
    if (s && knap.textContent !== tekst) knap.textContent = tekst; // kaldes fire gange i sekundet
    knap.onclick = s ? () => s.knap?.click() : null;
  }

  function opdater(dt) {
    if (!aktiv || !kørende) return;
    kørKameraTur(dt); // kameraet kan stadig flyve under pause
    if (!pause.til) {
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
      knapper: () => (kørende?.styring ?? []).map((s) => s.tekst ?? s.navn),
      tryk: (i) => {
        const s = kørende.styring[i];
        if (!s) return; // knapperne kan have skiftet (fx når Saturns flyby starter)
        if (s.handling) s.handling();
        else if (s.skift) { s.til = !s.til; s.skift(s.til); }
        lavStyring();
      },
      pause: () => pause.til,
      kamera: () => verden.kamera.position.toArray(),
      fænomen: () => kørende?.test, // fænomenets egen testadgang (fx Saturns måner)
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
