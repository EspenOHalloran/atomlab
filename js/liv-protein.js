// Liv L2, fra opskrift til protein (docs/plan-liv.md, afsnit 2): knapperne og panelet til tre ting, man kan gøre:
// - 'genet': "Se genet blive læst": aflæsningen, ud af kernen, ribosomet og foldningen (js/liv/protein.js).
//   Tidsknappen styrer farten.
// - 'læs': "Læs selv": Man er selv ribosomet og finder de første 9 ord i kodehjulet (js/liv/kodehjul.js).
// - 'ret': "Skift et bogstav": Man skifter bogstaver i de første 10 ord af genet og ser, hvad der sker med proteinet
//   (seglcellen, et skift, der ikke gør noget, et stop for tidligt og "Skriv LIV").
// liv.js viser tegningen (vis), går tilbage til stigen (forlad) og ejer opgaverne (løs) og panelet (panel, mission).

import { lavKontakt } from './kontakt.js';
import { lavTidsknap } from './pause.js';
import { lyd } from './lyd.js';
import { visBesked, rydBeskeder, bundIVindue } from './beskeder.js';
import { lukHvorfor } from './lag.js';
import * as fremgang from './fremgang.js';
import { lavKodehjul, U_FARVE } from './liv/kodehjul.js';
import { BASE_FARVE } from './liv/stige.js';
import { HBB } from './data/liv/gener.js';
import { AMINOSYRER, SLAGS, KODE, STOP, aminosyre, aaNavn, kodoner, tilRNA } from './data/liv/kode.js';
import { TRIN_PROTEIN, LÆS_START, LÆS_ANTAL, ANTAL_AA, svarFor, vurderSkift, proteinTekst } from './data/liv/protein.js';

const $ = (id) => document.getElementById(id);
const FART = { pause: 0, spil: 1, hurtig: 4 };
const OPDATER = 0.25; // panelets tal opdateres højst 4 gange i sekundet

export function lavLivProtein({ tegning, vindue, vis, forlad, stoppet, løs, panel, mission, kamera, aktiv }) {
  let tilstand = null; // null, 'genet', 'læs' eller 'ret'
  let læs = null; // { k, svar, læst }
  let ret = null; // { dna, valgt }
  let ventetid = 0;
  let snavset = false;
  let sidstTrin = '';
  let færdigVist = false;

  // Kodehjulet og tidsknappen i 3D-billedet
  const hjul = lavKodehjul(vindue);
  hjul.kort.id = 'livHjul';
  const hjulKontakt = lavKontakt($('livHjulKontakt'));
  hjulKontakt.knap.addEventListener('click', () => {
    lyd.klik();
    visHjul(!hjulKontakt.til);
  });
  // Kodehjulet står øverst til højre, så tegningen rykker ned og til venstre, når det er fremme
  function visHjul(til) {
    hjulKontakt.sæt(til);
    hjul.vis(til);
    if (til) tegning.flyt.set(tilstand === 'ret' ? 0 : -4, tilstand === 'ret' ? -3.5 : -2.5);
    else tegning.flyt.set(0, 0);
  }
  const række = document.createElement('div');
  række.className = 'bjælke-række';
  række.id = 'livBund';
  række.hidden = true;
  bundIVindue(vindue).append(række);
  const tid = lavTidsknap({ holder: række, aktiv: () => aktiv() && tilstand && tilstand !== 'ret', ændret: (t) => { tegning.fart = FART[t]; } });
  tid.hurtig('4 gange hurtigere');
  række.querySelector('.tidsknap').id = 'livTid';

  for (const b of document.querySelectorAll('[data-liv-protein]')) {
    b.addEventListener('click', () => {
      lyd.klik();
      start(b.dataset.livProtein);
    });
  }
  $('livProteinStop').addEventListener('click', () => { lyd.klik(); stop(); });
  $('livProteinVidere').addEventListener('click', () => {
    lyd.klik();
    tegning.manuel = false;
    tid.fortsæt();
    $('livProteinVidere').hidden = true;
    $('livSvar').hidden = true;
    skriv('Ribosomet læser resten af genet selv.');
    snavset = true;
  });
  $('livProteinNulstil').addEventListener('click', () => {
    lyd.klik();
    ret.dna = LÆS_START;
    visRet();
    visBesked({ titel: 'Som i genet', tekst: 'Alle bogstaverne er, som de står i genet HBB.', varighed: 5000 });
  });
  tegning.påSkift = () => { snavset = true; };

  function skriv(tekst) {
    $('livProteinTekst').innerHTML = tekst;
  }

  // ---------- Start og stop ----------
  function start(ny) {
    rydBeskeder();
    lukHvorfor();
    tilstand = ny;
    læs = null;
    ret = null;
    sidstTrin = '';
    færdigVist = false;
    tid.sæt('spil');
    tegning.fart = 1;
    if (ny === 'genet') tegning.startAflæs(HBB.dna);
    else if (ny === 'læs') {
      tegning.startOversæt(HBB.dna, { manuel: true });
      læs = { k: -1, svar: [], læst: 0 };
    } else {
      ret = { dna: LÆS_START, valgt: 6 };
      tegning.visRet(ret.dna, LÆS_START, ret.valgt);
    }
    // Kodehjulet er fremme, når man selv skal læse
    visHjul(ny !== 'genet');
    hjul.fremhæv(null);
    $('livProteinValg').hidden = true;
    $('livProteinIGang').hidden = false;
    $('livSvar').hidden = ny !== 'læs';
    $('livRet').hidden = ny !== 'ret';
    $('livProteinVidere').hidden = true;
    $('livProteinNulstil').hidden = ny !== 'ret';
    række.hidden = ny === 'ret';
    skriv({
      genet: 'Genet HBB bliver læst. ⏩ går hurtigere, og ⏸ stopper tiden.',
      læs: 'Du er ribosomet. Find ordet i kodehjulet.',
      ret: 'Tryk på et ord i genet, og skift et bogstav.',
    }[ny]);
    if (ny === 'ret') visRet();
    vis();
    snavset = true;
  }

  // tilbage: gå tilbage til stigen (falsk, når liv.js selv skifter til noget andet)
  function stop(tilbage = true) {
    if (!tilstand) return;
    tilstand = null;
    læs = null;
    ret = null;
    tegning.tøm();
    tegning.fart = 1;
    visHjul(false);
    række.hidden = true;
    $('livProteinValg').hidden = false;
    $('livProteinIGang').hidden = true;
    stoppet();
    if (tilbage) forlad();
  }

  // ---------- Hvert billede ----------
  function opdater(dt) {
    if (!tilstand) return;
    ventetid -= dt;
    if (!snavset || ventetid > 0) return;
    snavset = false;
    ventetid = OPDATER;
    const trin = trinNu();
    if (trin !== sidstTrin) {
      const ny = sidstTrin !== '';
      sidstTrin = trin;
      panel();
      if (ny) kamera();
    } else panel(true);
    if (tegning.tilstand === 'færdig' && !færdigVist) {
      færdigVist = true;
      færdig();
    }
    // Kodehjulet følger ordet, ribosomet læser (ikke i "Læs selv", hvor man selv skal finde det)
    if (tegning.tilstand === 'oversæt' && !tegning.manuel) hjul.fremhæv(tegning.ordNu);
    if (tilstand === 'læs' && tegning.manuel && tegning.venter && læs.k !== tegning.k) spørg(tegning.k);
  }

  function færdig() {
    if (!fremgang.erLøst('liv-protein')) løs('liv-protein');
    else visBesked({ titel: 'Proteinet er færdigt', tekst: 'Kæden af 147 aminosyrer har foldet sig. Prøv nu at læse selv, eller skift et bogstav.', varighed: 7000 });
    skriv('Proteinet er færdigt ★. Prøv "Læs selv" eller "Skift et bogstav".');
    mission();
  }

  // Hvilket af teksternes trin vi er ved
  function trinNu() {
    if (tilstand === 'ret') return 'ret';
    const t = tegning.tilstand;
    if (t === 'fold' || t === 'færdig') return 'fold';
    if (t === 'oversæt' && tegning.manuel) return 'læs';
    return t === 'tom' ? 'aflæs' : t;
  }

  // ---------- Læs selv ----------
  function spørg(k) {
    læs.k = k;
    if (k >= LÆS_ANTAL) {
      // De 9 ord er læst
      løs('liv-læs');
      $('livSvar').hidden = true;
      $('livProteinVidere').hidden = false;
      skriv(`Du har læst ${LÆS_ANTAL} ord: <strong>${tegning.kæde}</strong> ★`);
      hjul.fremhæv(null);
      mission();
      return;
    }
    const ord = tegning.ord[k];
    læs.svar = svarFor(ord);
    skriv(`Ord ${k + 1} af ${LÆS_ANTAL}: ${bogstaver(ord)}. Hvilken aminosyre?`);
    const holder = $('livSvar');
    holder.innerHTML = '';
    for (const aa of læs.svar) {
      const b = document.createElement('button');
      b.className = 'liv-svar-knap';
      b.dataset.livSvar = aa;
      b.style.setProperty('--farve', SLAGS[AMINOSYRER[aa].slags].farve);
      b.innerHTML = `<strong>${aa}</strong><small>${AMINOSYRER[aa].navn}</small>`;
      b.addEventListener('click', () => svar(aa));
      holder.append(b);
    }
    holder.hidden = false;
    snavset = true;
  }

  function svar(aa) {
    if (!læs || !tegning.venter) return;
    const ord = tegning.ord[læs.k];
    const rigtig = aminosyre(ord);
    if (aa === rigtig) {
      lyd.proton();
      læs.læst++;
      tegning.godkend();
      tid.fortsæt();
      hjul.fremhæv(ord);
      $('livSvar').innerHTML = '';
      skriv(`${bogstaver(ord)} giver ${aaNavn(aa)}. Budbringeren kommer med den.`);
    } else {
      lyd.nej();
      hjul.fremhæv(ord);
      visBesked({
        titel: `${ord} er ikke ${AMINOSYRER[aa].navn}`,
        tekst: `Følg vejen i kodehjulet: ${ord[0]} i midten, så ${ord[1]} i næste ring og ${ord[2]} yderst. Der står aminosyren.`,
        type: 'advarsel', varighed: 8000,
      });
    }
    snavset = true;
  }

  // ---------- Skift et bogstav ----------
  function visRet() {
    const ord = kodoner(ret.dna);
    const orig = kodoner(LÆS_START);
    const kodonHolder = $('livKodoner');
    kodonHolder.innerHTML = '';
    ord.forEach((k, i) => {
      const b = document.createElement('button');
      const aa = aminosyre(k);
      b.className = 'liv-kodon';
      b.dataset.livKodon = i;
      b.classList.toggle('valgt', i === ret.valgt);
      b.classList.toggle('ændret', k !== orig[i]);
      b.disabled = i === 0;
      b.title = i === 0 ? 'ATG er start-ordet. Det lader vi stå.' : `Kodon ${i + 1}: ${k} giver ${aaNavn(aa)}`;
      b.innerHTML = `<small>${k}</small><strong>${aa === STOP ? '■' : aa}</strong>`;
      b.addEventListener('click', () => {
        lyd.klik();
        ret.valgt = i;
        visRet();
      });
      kodonHolder.append(b);
    });
    // De tre bogstaver i det valgte ord, hver med A, T, G og C
    const holder = $('livBogstaver');
    holder.innerHTML = '';
    const valgt = ord[ret.valgt];
    for (let pos = 0; pos < 3; pos++) {
      const søjle = document.createElement('div');
      søjle.className = 'liv-bogstav-søjle';
      for (const base of 'ATGC') {
        const b = document.createElement('button');
        b.className = 'liv-base liv-base-lille';
        b.style.setProperty('--farve', BASE_FARVE[base]);
        b.textContent = base;
        b.dataset.livPos = pos;
        b.dataset.livBogstav = base;
        b.classList.toggle('valgt', valgt[pos] === base);
        b.addEventListener('click', () => skiftBogstav(ret.valgt, pos, base));
        søjle.append(b);
      }
      holder.append(søjle);
    }
    tegning.visRet(ret.dna, LÆS_START, ret.valgt);
    hjul.fremhæv(valgt);
    snavset = true;
  }

  function skiftBogstav(i, pos, base) {
    if (!ret || i === 0) return;
    const n = 3 * i + pos;
    if (ret.dna[n] === base) return;
    const før = ret.dna;
    ret.dna = før.slice(0, n) + base + før.slice(n + 1);
    const v = vurderSkift(før, ret.dna, i);
    visBesked({ titel: v.titel, tekst: v.tekst, type: v.type === 'stop' || v.type === 'segl' ? 'advarsel' : undefined, varighed: 9000 });
    if (v.type === 'tavs' || v.type === 'stop' || v.type === 'segl') lyd.klik();
    else lyd.proton();
    visRet();
    if (v.type === 'segl') løs('liv-segl');
    if (v.type === 'tavs') løs('liv-tavs');
    if (v.type === 'stop') løs('liv-stop');
    if (v.protein.includes('LIV')) løs('liv-skriv');
  }

  // ---------- Panelet ----------
  const bogstaver = (ord) => [...tilRNA(ord)].map((b) => `<b class="liv-bogstav" style="--farve:${b === 'U' ? U_FARVE : BASE_FARVE[b]}">${b}</b>`).join('');

  // Teksterne til panelet i liv.js: { titel, tekst, tal, ekstra, hvorfor }
  function tekster() {
    const t = TRIN_PROTEIN[trinNu()];
    let n = '';
    let ord = '';
    if (tilstand === 'ret') {
      n = proteinTekst(ret.dna).join(' ');
      const k = kodoner(ret.dna)[ret.valgt];
      ord = `${k} → ${aminosyre(k) === STOP ? 'stop' : aminosyre(k)}`;
    } else if (tegning.tilstand === 'aflæs') n = `${Math.floor(tegning.p)} af ${HBB.dna.length} bogstaver`;
    else if (trinNu() === 'læs') {
      n = String(læs?.læst ?? 0);
      ord = tegning.ordNu ?? '–';
    } else {
      n = `${tegning.antal} af ${ANTAL_AA}`;
      const k = tegning.ordNu;
      ord = k ? `${k} → ${KODE[k] === STOP ? 'stop' : KODE[k]}` : '–';
    }
    return { ...t, tal: t.tal.map(([a, b]) => [a, b.replace('{n}', n).replace('{ord}', ord)]) };
  }

  function farver() {
    if (tilstand === 'ret' || trinNu() === 'oversæt' || trinNu() === 'fold' || trinNu() === 'læs') {
      return Object.values(SLAGS).map((s) => [s.navn, s.farve]);
    }
    return [['A', BASE_FARVE.A], ['T', BASE_FARVE.T], ['G', BASE_FARVE.G], ['C', BASE_FARVE.C], ['U', U_FARVE]];
  }

  function missionTekst() {
    if (tilstand === 'ret') {
      if (!fremgang.erLøst('liv-segl')) return 'Gør kodon 7 (GAG) til valin (V), som ved seglcelleanæmi.';
      if (!fremgang.erLøst('liv-tavs')) return 'Find et skift, hvor aminosyren bliver den samme.';
      if (!fremgang.erLøst('liv-stop')) return 'Lav et stop-ord (TAA, TAG eller TGA) med ét skift.';
      if (!fremgang.erLøst('liv-skriv')) return 'Få proteinet til at sige LIV. Kodon 4 er allerede L.';
      return 'Du har klaret opgaverne her ★. Prøv selv flere skift.';
    }
    if (tilstand === 'læs') {
      if (læs && læs.k >= LÆS_ANTAL) return 'Tryk "Lad ribosomet læse resten", eller skift et bogstav.';
      return 'Find ordet i kodehjulet, og vælg aminosyren.';
    }
    const t = tegning.tilstand;
    if (t === 'færdig') return 'Prøv nu "Læs selv": Så er du ribosomet.';
    if (t === 'oversæt' || t === 'fold') return 'Se budbringerne komme med aminosyrerne. ⏩ går hurtigere.';
    return 'Se, hvordan RNA-kopien bliver bygget.';
  }

  return {
    get tilstand() { return tilstand; },
    start,
    stop,
    opdater,
    tekster,
    farver,
    trin: trinNu,
    mission: missionTekst,
    // Til tests
    test: () => ({
      tilstand,
      trin: trinNu(),
      tegning: tegning.tilstand,
      kæde: tegning.kæde,
      venter: tegning.venter,
      k: tegning.k,
      læst: læs?.læst ?? 0,
      svar: læs ? [...læs.svar] : [],
      dna: ret?.dna ?? null,
      hjul: hjul.vist,
      fremhævet: hjul.fremhævet,
    }),
    svar,
    skiftBogstav,
    vælgKodon: (i) => { ret.valgt = i; visRet(); },
    spol(sek) {
      // Spoler tiden frem i små skridt (med tidsknappens fart)
      for (let t = 0; t < sek; t += 0.05) tegning.opdater(0.05);
      snavset = true;
      ventetid = 0;
      opdater(0);
    },
  };
}
