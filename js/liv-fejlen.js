// Liv L4: turen "Fejlen, der hjalp" (forløb 4, drejebogen i docs/drejebog-liv.md, afsnit 3) og "Leg frit: pladen".
// Teksterne står i js/data/forloeb/fejlen.js og js/data/liv/plade.js. Her står det, der rører scenen (Forløb-klodsen,
// js/forloeb.js) og laboratoriet. Scenen er pladen (js/liv/plade.js) med modellen fra js/data/liv/plade.js.
// Fire trin: sæt en bakterie på pladen (den fylder feltet uden medicin), find det sted, hvor en gren bryder ind i det
// første bånd, find hver ny gren til det sidste bånd, og find en bakterie med en fejl i feltet uden medicin.
// I turen har tilfældigheden et fast frø (stabile tests), i laboratoriet et nyt hver gang.
// liv.js giver tegningen, kameraet (vis, kamera) og panelet og sender tryk i 3D hertil (tryk).

import { ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { visBesked, rydBeskeder } from './beskeder.js';
import { forløbVink } from './forloeb.js';
import { åbnForløb } from './gaa.js';
import { visLag } from './lag.js';
import { lavKontakt } from './kontakt.js';
import { PRIK_FARVE } from './liv/plade.js';
import { lavPlade, BÅND, MAKS, PLADE_PANEL, bakterierEfter, timerVed } from './data/liv/plade.js';

const $ = (id) => document.getElementById(id);
const TEMPO = ROLIG ? 3 : 1; // "Reducer bevægelse": det vokser hurtigere
const VIS_FART = 3.5; // "Næste ›" før handlingen: så meget hurtigere vokser det, mens det bliver vist
const FRØ = 20161; // turens faste tilfældighed
const RADIUS = 0.07; // et tryk tæller, hvis det er så stor en del af pladen fra målet (målene er runde)
const SPRING_VENT = 3; // sekunder efter, at feltet er fuldt uden mellemtrin, før ★-opgaven er klaret
const FARVER = PRIK_FARVE.map((f, r) => [r === 0 ? 'Ingen fejl' : `${r} fejl`, f]);
const tekstBånd = (L) => `×${BÅND[L].toLocaleString('da-DK')}`;

export function lavFejlenDel({ tegning, vis, kamera, løs, panel, mission, stoppet, slut }) {
  let trin = null; // trinets id, mens turen kører
  let lab = false; // "Leg frit: pladen"
  let s = null; // { m: modellen, nr: det trin, der sidst kørte på den, fundet: Set af områder, fejl: fundet i trin 4, fart }
  let spring = false; // laboratoriet: "Uden mellemtrin"
  const kol = tegning.kol;

  function ny(felter = {}) {
    s = {
      m: lavPlade({ kol, rækker: kol, lag: felter.lag ?? 'normal', frø: felter.frø ?? FRØ }),
      nr: 0, fundet: new Set(), fejl: null, fart: 1, auto: false, fuld: null, grene: 0, stjerne: false, slut: false,
      ...felter,
    };
    tegning.vis(s.m);
    tegning.sætRinge([]);
    tegning.sætPuls(false);
  }

  // Turens trin bygger videre på det forrige. Kommer man et andet sted fra (‹ eller prikkerne), bygges pladen forfra
  // med det faste frø og køres frem til det sted, trinet starter.
  function sikr(nr) {
    if (s && s.nr === nr - 1 && s.m.frø) {
      s.nr = nr;
      return;
    }
    ny();
    s.m.sæt(Math.round(kol * 0.05), Math.round(kol / 2));
    s.m.kørTilRo();
    if (nr >= 3) {
      s.m.åbn(1);
      s.m.kørTilRo();
    }
    if (nr >= 4) {
      s.m.åbn(MAKS);
      s.m.kørTilRo();
    }
    if (nr >= 2) s.fundet = new Set(nr >= 3 ? [1] : []);
    if (nr >= 4) s.fundet = new Set([1, 2, 3, 4]);
    s.nr = nr;
    tegning.vis(s.m);
    sætRinge();
  }

  // ---------- Hvert billede ----------
  function opdater(dt) {
    if (!s || (!trin && !lab)) return;
    s.m.kør(dt * TEMPO * s.fart);
    if (trin === 'voks') {
      if (s.m.frø) tegning.sætSkilt({ tekst: skiltTid() });
    }
    // "Næste ›" før handlingen: grenene findes af sig selv, efterhånden som de kommer
    if (s.auto && (trin === 'kant' || trin === 'grene')) {
      for (const g of s.m.grene) if (!s.fundet.has(g.område) && (trin === 'grene' || g.område === 1)) find(g);
    }
    if (lab) labOpdater();
  }

  function skiltTid() {
    const h = timerVed(s.m.andelFelt());
    const timer = Math.floor(h);
    const min = Math.floor((h - timer) * 3) * 20;
    const hvornår = h >= 10 ? '10 timer' : `${timer} t ${min} min`;
    return `${hvornår}: ${bakterierEfter(h)} bakterie${h < 0.3 ? '' : 'r'}`;
  }

  // ---------- Det, man finder ----------
  // Ringene om de grene og den fejl, der er fundet
  function sætRinge() {
    const r = [...s.fundet].map((o) => s.m.grene.find((g) => g.område === o)).filter(Boolean).map((g) => ({ k: g.k, j: g.j, r: 3.2 * (kol / 100) * 1.4 }));
    if (s.fejl) r.push({ k: s.fejl.k, j: s.fejl.j, r: 3 * (kol / 100) * 1.4 });
    tegning.sætRinge(r);
  }

  function find(g) {
    s.fundet.add(g.område);
    lyd.proton();
    sætRinge();
    if (trin === 'grene') {
      const n = [2, 3, 4].filter((o) => s.fundet.has(o)).length;
      forløbVink(n < 3 ? `Gren ${n} af 3: ind i båndet med ${tekstBånd(g.niveau)}. Hold øje med det næste.` : '');
    } else forløbVink('');
  }

  // ---------- Tryk i 3D ----------
  function tryk(stråle) {
    if (!s || (!trin && !lab)) return false;
    const f = tegning.feltVed(stråle);
    if (!f) return false;
    const m = s.m;
    const R = RADIUS * kol;
    const felt = m.felt(Math.max(0, Math.min(kol - 1, f.k)), Math.max(0, Math.min(kol - 1, f.j)));
    if (trin === 'voks' || (lab && !m.frø)) {
      if (m.frø) return true;
      if (felt.niveau !== 0) {
        lyd.nej();
        if (trin) forløbVink('Sæt den i det lyse felt til venstre. Der er ingen medicin.');
        else skriv('Sæt den i det lyse felt til venstre. Der er ingen medicin.');
        return true;
      }
      sæt(f.k, f.j);
      return true;
    }
    if (trin === 'kant' || trin === 'grene') {
      const mulige = trin === 'kant' ? [1] : [2, 3, 4];
      // Den nærmeste bakterie i et bånd, hvor der er en gren, man ikke har fundet
      const i = m.nærmest(f.k, f.j, R, (x) => mulige.includes(m.område[x]) && !s.fundet.has(m.område[x]));
      if (i != null) {
        const o = m.område[i];
        const k = i % kol;
        const j = (i - k) / kol;
        const g = m.grene.filter((x) => x.område === o).sort((a, b) => (a.k - k) ** 2 + (a.j - j) ** 2 - ((b.k - k) ** 2 + (b.j - j) ** 2))[0];
        if (g) {
          find(g);
          return true;
        }
      }
      lyd.klik();
      const fundne = m.nærmest(f.k, f.j, R, (x) => s.fundet.has(m.område[x]) && m.område[x] > 0);
      if (fundne != null && trin === 'grene') forløbVink('Den gren har du fundet. Hold øje med kanten af det næste bånd.');
      else if (!m.grene.some((g) => mulige.includes(g.område) && !s.fundet.has(g.område))) forløbVink('Vent lidt, og hold øje med kanten af det mørke bånd.');
      else forløbVink('Find det sted, hvor farvede prikker bryder ind i et nyt bånd.');
      return true;
    }
    if (trin === 'tilfaeldig') {
      const i = m.nærmest(f.k, f.j, R, (x) => m.niveau[x] === 0 && m.r[x] > 0);
      if (i != null) {
        fejlFundet(i);
        return true;
      }
      lyd.klik();
      if (felt.niveau > 0) forløbVink('Den har rørt medicinen. Find en farvet prik i feltet uden medicin.');
      else forløbVink('Den prik har ingen fejl. Find en farvet prik i feltet uden medicin.');
      return true;
    }
    if (lab) {
      // Hvor mange fejl har prikken, og hvor kan den leve?
      const i = m.nærmest(f.k, f.j, 2, null);
      lyd.klik();
      if (i == null) visBesked({ titel: 'Tomt', tekst: 'Her er ingen bakterier endnu.', varighed: 3000 });
      else {
        const r = m.r[i];
        visBesked({
          titel: r === 0 ? 'Ingen fejl' : `${r} fejl`,
          tekst: r === 0 ? 'Den kan kun leve i feltet uden medicin.' : `Den kan leve i båndene op til ${tekstBånd(r)}.`,
          varighed: 3500,
        });
      }
      return true;
    }
    return false;
  }

  function sæt(k, j) {
    if (!s.m.sæt(k, j)) return;
    lyd.proton();
    forløbVink('');
    if (lab) skriv('Se kolonien vokse. Hold øje med kanten af hvert bånd.');
  }

  function fejlFundet(i) {
    const k = i % kol;
    s.fejl = { k, j: (i - k) / kol, i };
    lyd.proton();
    forløbVink('');
    tegning.sætPuls(false);
    sætRinge();
  }

  // ---------- Turen ----------
  function start(id) {
    rydBeskeder();
    trin = id;
    vis();
  }

  const del = {
    trin: {
      voks: {
        start: () => {
          start('voks');
          ny();
          s.nr = 1;
          tegning.sætSkilt({ tekst: 'Sæt en bakterie i det lyse felt' });
        },
        knapper: [{ id: 'sæt', tekst: 'Sæt en bakterie ›', gør: () => sæt(Math.round(kol * 0.05), Math.round(kol / 2)), aktiv: () => Boolean(s) && !s.m.frø }],
        færdig: () => s.m.andelFelt() >= 0.999,
        visMig: () => {
          if (!s.m.frø) sæt(Math.round(kol * 0.05), Math.round(kol / 2));
          s.fart = VIS_FART;
        },
      },
      kant: {
        start: () => {
          start('kant');
          sikr(2);
          s.fart = 1;
          s.auto = false;
          s.m.åbn(1);
          tegning.sætSkilt({ bånd: true });
        },
        færdig: () => s.fundet.has(1),
        visMig: () => {
          s.auto = true;
          s.fart = VIS_FART;
        },
      },
      grene: {
        start: () => {
          start('grene');
          sikr(3);
          s.fart = 1;
          s.auto = false;
          for (const o of [2, 3, 4]) s.fundet.delete(o);
          s.m.åbn(MAKS);
          tegning.sætSkilt({ bånd: true });
          sætRinge();
        },
        færdig: () => [2, 3, 4].every((o) => s.fundet.has(o)),
        visMig: () => {
          s.auto = true;
          s.fart = VIS_FART;
        },
      },
      tilfaeldig: {
        start: () => {
          start('tilfaeldig');
          sikr(4);
          s.fart = 1;
          s.auto = false;
          s.fejl = null;
          s.m.åbn(MAKS);
          tegning.sætSkilt({ bånd: true });
          tegning.sætPuls(true);
          sætRinge();
        },
        færdig: () => Boolean(s.fejl),
        visMig: () => {
          // Den bakterie med en fejl i feltet uden medicin, der står længst fra båndene
          let bedst = null;
          for (let i = 0; i < s.m.n; i++) if (s.m.niveau[i] === 0 && s.m.r[i] > 0 && (bedst == null || i % kol < bedst % kol)) bedst = i;
          if (bedst != null) fejlFundet(bedst);
        },
      },
    },
    layout: () => kamera(),
    slutTekst: () => 'Det samme sker hos mennesker og alt andet liv, bare meget langsommere.',
    // L5: "Næste: Begyndelsen" først. Kortet om mælken gik ud af vejene (det står stadig i panelet ved pladen)
    veje: [
      { tekst: 'Næste: Begyndelsen', primær: true, gør: () => åbnForløb('begyndelsen', 'begyndelsen') },
      { tekst: 'Leg frit: pladen', her: true, gør: () => requestAnimationFrame(() => startLab()) },
      { tekst: 'Sker det også hos mennesker?', hvorfor: 'livMenneske' },
    ],
    slut: () => {
      trin = null;
      if (!lab) {
        s = null;
        tegning.tøm();
      }
      slut();
    },
  };

  // ---------- Leg frit: pladen ----------
  function skriv(tekst) {
    $('livPladeTekst').textContent = tekst;
  }

  function nyLab() {
    ny({ lag: spring ? 'spring' : 'normal', frø: Math.floor(Math.random() * 2 ** 31) });
    s.m.åbn(MAKS);
    tegning.sætSkilt({ bånd: true });
    skriv(spring
      ? 'Uden mellemtrin: direkte fra ingen medicin til ×3.000. Tryk i det lyse felt, og sæt en bakterie.'
      : 'Tryk i det lyse felt til venstre, og sæt en bakterie.');
    mission();
  }

  function startLab() {
    if (lab) stopLab(false);
    lab = true;
    rydBeskeder();
    visLag('liv-plade'); // foldeboksen "Pladen" (også når man kommer fra turen)
    $('livPladeValg').hidden = true;
    $('livPladeIGang').hidden = false;
    vis();
    nyLab();
    panel();
  }

  function labIgen() {
    if (!lab) return;
    lyd.klik();
    nyLab();
  }

  // Følger pladen i laboratoriet: nye grene, en fuld plade og ★-opgaven
  function labOpdater() {
    const m = s.m;
    if (!m.frø) return;
    if (m.grene.length > s.grene) {
      s.grene = m.grene.length;
      const g = m.grene.at(-1);
      skriv(`En gren brød igennem til båndet med ${tekstBånd(g.niveau)}.`);
    }
    if (s.fuld == null && m.andelFelt() >= 0.999) s.fuld = m.tid;
    if (spring && s.fuld != null && !m.grene.length && !s.stjerne && m.tid - s.fuld >= SPRING_VENT) {
      s.stjerne = true;
      skriv('Feltet er fuldt, men ingen kom igennem. Der skal for mange fejl til på én gang.');
      løs('liv-spring');
      mission();
    }
    if (!spring && !s.slut && m.stille() && m.længst() === 4) {
      s.slut = true;
      skriv('Pladen er fuld. Tryk på en prik, og se, hvor mange fejl den har. Eller prøv uden mellemtrin.');
    }
  }

  // tilbage: gå tilbage til stigen (falsk, når liv.js selv skifter til noget andet)
  function stopLab(tilbage = true) {
    if (!lab) return;
    lab = false;
    if (!trin) {
      s = null;
      tegning.tøm();
    }
    $('livPladeValg').hidden = false;
    $('livPladeIGang').hidden = true;
    stoppet(tilbage);
  }

  const springKontakt = lavKontakt($('livPladeSpring'));
  springKontakt.sæt(false);
  springKontakt.knap.addEventListener('click', () => {
    lyd.klik();
    spring = !spring;
    springKontakt.sæt(spring);
    if (lab) nyLab();
  });
  $('livPladeStart').addEventListener('click', () => { lyd.klik(); startLab(); });
  $('livPladeIgen').addEventListener('click', () => labIgen());
  $('livPladeStop').addEventListener('click', () => { lyd.klik(); stopLab(); });

  function missionTekst() {
    if (!s?.m.frø) return 'Sæt en bakterie i feltet uden medicin.';
    if (spring) return s.stjerne ? 'Uden mellemtrin kom ingen igennem ★. Slå det fra, og prøv igen.' : 'Se, om bakterierne kommer igennem uden mellemtrin.';
    return 'Find grenene, der bryder ind i et nyt bånd. Prøv så "Uden mellemtrin".';
  }

  return {
    del,
    kører: () => trin !== null,
    trin: () => trin,
    lab: () => lab,
    startLab,
    stopLab,
    labIgen,
    tryk,
    opdater,
    vilTryk: () => Boolean(s) && (Boolean(trin) || lab),
    tekster: () => PLADE_PANEL,
    mission: missionTekst,
    farver: () => FARVER,
    // Uden mellemtrin (til tests)
    sætSpring: (til) => { if (spring !== til) springKontakt.knap.click(); },
    test: () => (s ? {
      trin, lab, spring, nr: s.nr, frø: s.m.frø, andel: s.m.andelFelt(), antal: s.m.antal(), tid: s.m.tid,
      maks: s.m.maks, længst: s.m.længst(), fundet: [...s.fundet].sort(), fejl: s.fejl, medFejl: s.m.medFejlIFelt(),
      grene: s.m.grene.map((g) => ({ område: g.område, k: g.k, j: g.j })), skilt: tegning.skilt(), stjerne: s.stjerne,
      // En bakterie med en fejl i feltet uden medicin og en uden (til at trykke på i testen)
      medFejlFelt: (() => { for (let i = 0; i < s.m.n; i++) if (s.m.niveau[i] === 0 && s.m.r[i] > 0) return { k: i % kol, j: Math.floor(i / kol) }; return null; })(),
      // (langt nok fra alle med en fejl til, at et tryk dér ikke tæller)
      udenFejlFelt: (() => {
        const m = s.m;
        for (let i = 0; i < m.n; i++) {
          const k = i % kol;
          const j = Math.floor(i / kol);
          if (m.niveau[i] === 0 && m.r[i] === 0 && m.nærmest(k, j, RADIUS * kol + 2, (x) => m.niveau[x] === 0 && m.r[x] > 0) == null) return { k, j };
        }
        return null;
      })(),
    } : null),
    // Spoler tiden frem i små skridt (til tests)
    spol(sek) {
      for (let t = 0; t < sek; t += 0.05) opdater(0.05);
      tegning.opdater(0.05);
    },
  };
}
