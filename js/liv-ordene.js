// Liv: forløbet "Hvad står der i opskriften?" (Serie 1 nr. 2, forløb 2, drejebogen i docs/fable/E3-liv-drejebog.md).
// Teksterne står i js/data/forloeb/ordene.js. Her står det, der rører scenen i hvert trin (Forløb-klodsen, js/forloeb.js).
// Scenen er tegningen fra L2 (js/liv/protein.js) i tilstanden 'ord': DNA'et lige ud med bogstaverne og kæden over det.
// Fem trin: tryk på et ord, slå tre ord op i den lille ordbog, "Læs resten" (kæden vokser og folder sig), skift A'et i
// ord 7 til T (seglcellen), og ét skift, man selv vælger (tryk på et ord, vælg et bogstav og et nyt).
// liv.js giver tegningen, kameraet (vis, kamera), filmen og menuen og sender tryk i 3D hertil (tryk).

import { lyd } from './lyd.js';
import { visBesked, rydBeskeder } from './beskeder.js';
import { tegnForløb } from './forloeb.js';
import { BASE_FARVE } from './liv/stige.js';
import { HBB } from './data/liv/gener.js';
import { kodoner } from './data/liv/kode.js';
import { ORD_START, ORDBOG, SLÅ_OP, SEGL, skiftIForløb } from './data/forloeb/ordene.js';

const BASER = ['A', 'T', 'G', 'C'];
const SEGL_DNA = skift(ORD_START, SEGL.ord, SEGL.plads, SEGL.til);
const VIS_MIG_SKIFT = [8, 0, 'T']; // AAG → TAG: et stop for tidligt

function skift(dna, i, plads, base) {
  const n = 3 * i + plads;
  return dna.slice(0, n) + base + dna.slice(n + 1);
}

// tegning: ProteinTegning. vis(): flyver kameraet til tegningen. kamera(): zoomer til tegningens størrelse nu.
// smal(): er 3D-vinduet så smalt (tablet på højkant), at ordene skal stå på to rækker?
export function lavOrdeneDel({ tegning, vis, kamera, smal, film, menu, slut }) {
  let trin = null; // trinets id, mens forløbet kører
  let s = null; // { dna, læst, lys, plads, navn, fundet, opslag, skift }
  let sidstTilstand = '';

  function tegn() {
    tegning.smal = smal();
    tegning.visOrd(s.dna, ORD_START, { læst: s.læst, lys: s.lys, plads: s.plads, navn: s.navn });
  }

  // Sætter trinets scene (også når man går et trin tilbage med "‹")
  function start(id, felter) {
    rydBeskeder();
    trin = id;
    s = { dna: ORD_START, læst: 0, lys: -1, plads: -1, navn: -1, fundet: false, opslag: 0, skift: 0, ...felter };
    tegn();
    sidstTilstand = tegning.tilstand;
    vis();
  }

  const ordNu = (i) => kodoner(s.dna)[i];

  // Et skift i trin 4 og 5: DNA'et ændres, perlen skifter, og en besked siger, hvad der skete
  function skiftBogstav(i, plads, base) {
    if (ordNu(i)[plads] === base) return;
    const før = s.dna;
    s.dna = skift(før, i, plads, base);
    const v = skiftIForløb(før, s.dna, i);
    let tekst = v.tekst;
    if (trin === 'segl' && v.type !== 'segl') tekst += ' Prøv T, som ved seglcelleanæmi.';
    visBesked({ titel: v.titel, tekst, type: v.type === 'stop' || v.type === 'segl' ? 'advarsel' : undefined, varighed: 9000 });
    if (v.type === 'anden' || v.type === 'segl' || v.type === 'stop') lyd.proton();
    else lyd.klik();
    if (trin === 'selv' && v.type !== 'tilbage') s.skift++;
    s.navn = i;
    tegn();
  }

  // Ordbogen i trin 2: et ord slås op
  function slåOp(ord) {
    if (s.opslag >= SLÅ_OP.length) return;
    const i = SLÅ_OP[s.opslag];
    if (ordNu(i) !== ord) {
      lyd.nej();
      visBesked({ titel: `Ordet, der lyser, er ${ordNu(i)}`, tekst: `Find ${ordNu(i)} i ordbogen. Bogstaverne skal være de samme.`, type: 'advarsel', varighed: 5000 });
      return;
    }
    lyd.proton();
    s.opslag++;
    s.læst = i + 1;
    s.navn = i;
    s.lys = SLÅ_OP[s.opslag] ?? -1;
    tegn();
  }

  // Knapperne i trin 5: først bogstaverne i det ord, man har trykket på, så de fire, man kan skifte til
  function selvKnapper() {
    if (s.lys < 1) return [];
    const ord = ordNu(s.lys);
    const pladser = [0, 1, 2].map((p) => ({
      id: `plads${p}`, tekst: ord[p], kugle: `liv-base-kugle base-${ord[p]} liv-plads`,
      gør: () => { lyd.klik(); s.plads = p; tegn(); },
      valgt: () => s.plads === p,
    }));
    if (s.plads < 0) return pladser;
    const til = BASER.map((b) => ({
      id: `til${b}`, tekst: `→ ${b}`, kugle: `liv-base-kugle base-${b}`,
      gør: () => skiftBogstav(s.lys, s.plads, b),
      aktiv: () => ordNu(s.lys)[s.plads] !== b,
    }));
    return [...pladser, ...til];
  }

  const del = {
    trin: {
      ord: {
        start: () => start('ord', {}),
        færdig: () => s.fundet,
        visMig: () => tryk(null, 1),
      },
      ordbog: {
        start: () => start('ordbog', { læst: 1, lys: SLÅ_OP[0] }),
        knapper: ORDBOG.map((o) => ({
          id: o.ord, tekst: `${o.ord} = ${o.navn}`,
          gør: () => slåOp(o.ord),
          aktiv: () => s && s.opslag < SLÅ_OP.length,
        })),
        færdig: () => s.opslag >= SLÅ_OP.length,
        visMig: () => slåOp(ordNu(SLÅ_OP[s.opslag])),
      },
      resten: {
        start: () => start('resten', { læst: SLÅ_OP.at(-1) + 1 }),
        knapper: [{ id: 'resten', tekst: 'Læs resten ›', gør: () => læsResten(), aktiv: () => tegning.tilstand === 'ord' }],
        færdig: () => tegning.tilstand === 'færdig',
        visMig: () => læsResten(),
      },
      segl: {
        start: () => start('segl', { læst: 10, lys: SEGL.ord, plads: SEGL.plads, navn: SEGL.ord }),
        knapper: BASER.map((b) => ({
          id: b, tekst: b, kugle: `liv-base-kugle base-${b}`,
          gør: () => skiftBogstav(SEGL.ord, SEGL.plads, b),
          aktiv: () => s && ordNu(SEGL.ord)[SEGL.plads] !== b,
        })),
        færdig: () => ordNu(SEGL.ord) === 'GTG',
        visMig: () => skiftBogstav(SEGL.ord, SEGL.plads, SEGL.til),
      },
      selv: {
        start: () => start('selv', { dna: SEGL_DNA, læst: 10, navn: SEGL.ord }),
        get knapper() { return s ? selvKnapper() : []; },
        færdig: () => s.skift > 0,
        visMig: () => {
          const [i, p, b] = VIS_MIG_SKIFT;
          s.lys = i;
          s.plads = p;
          skiftBogstav(i, p, b);
        },
      },
    },
    layout: () => {
      // Vinduet har fået ny størrelse: ordene på én eller to rækker, og kameraet zoomer igen
      if (s && tegning.tilstand === 'ord' && tegning.smal !== smal()) tegn();
      kamera();
    },
    slutTekst: () => 'Vi sprang et led over: Cellen læser ikke DNA\'et direkte. Den laver først en kopi, og det er kopien, der bliver læst. Se filmen.',
    veje: [
      { tekst: '▶ Se, hvordan cellen gør det (film)', primær: true, gør: () => requestAnimationFrame(film) },
      { tekst: 'Leg frit' },
      { tekst: 'Tilbage til menuen', gør: menu },
    ],
    igen: 'fra listen til venstre eller fra hjælpen (?)',
    slut: () => {
      trin = null;
      s = null;
      tegning.tøm();
      slut();
    },
  };

  function læsResten() {
    if (tegning.tilstand !== 'ord') return;
    lyd.klik();
    s.læst = 10;
    s.navn = -1;
    s.lys = -1;
    tegn();
    tegning.læsResten(HBB.protein);
  }

  // Et tryk i 3D (stråle fra liv.js), eller ordet i direkte (Vis mig)
  function tryk(stråle, i = tegning.ordVed(stråle)) {
    if (!trin || i < 0) return false;
    if (trin === 'ord') {
      lyd.klik();
      s.lys = i;
      s.fundet = true;
      tegn();
      return true;
    }
    if (trin === 'selv') {
      if (i === 0) {
        lyd.nej();
        visBesked({ titel: 'ATG er start', tekst: 'ATG er start-ordet. Det lader vi stå. Tryk på et af de andre ord.', varighed: 5000 });
        return true;
      }
      lyd.klik();
      s.lys = i;
      s.plads = -1;
      tegn();
      tegnForløb();
      return true;
    }
    return false;
  }

  // Hvert billede: kameraet følger tegningen, når den skifter tilstand (vokser og folder sig)
  function opdater() {
    if (!trin || tegning.tilstand === sidstTilstand) return;
    sidstTilstand = tegning.tilstand;
    kamera();
  }

  return {
    del,
    kører: () => trin !== null,
    trin: () => trin,
    tryk,
    opdater,
    // Basernes farver til vinduet (forløbet viser kun DNA)
    farver: () => BASER.map((b) => [b, BASE_FARVE[b]]),
    test: () => (s ? { trin, dna: s.dna, læst: s.læst, lys: s.lys, plads: s.plads, opslag: s.opslag, skift: s.skift, tilstand: tegning.tilstand } : null),
  };
}
