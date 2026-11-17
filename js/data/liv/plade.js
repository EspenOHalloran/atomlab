// Liv L4: pladen med bakterierne (turen "Fejlen, der hjalp" og "Leg frit: pladen"). Ren data uden Three.js, så den kan
// testes i Node. Tegningen står i js/liv/plade.js og delen i js/liv-fejlen.js.
// Efter et rigtigt forsøg: Baym m.fl. 2016, Science 353:1147-1151, PMC5534434 (MEGA-pladen, 120 × 60 cm, E. coli, bånd
// med 0, 3, 30, 300 og 3.000 gange så meget trimethoprim, som stopper de almindelige bakterier, ti gange mere pr. bånd,
// ca. 10 dage). Her er pladen den ene halvdel: feltet uden medicin til venstre og det stærkeste bånd til højre (i forsøget
// var det midten). "Uden mellemtrin" er forsøget i artiklens fig. 2: direkte fra ingen medicin til 3.000 gange, og der
// kom de aldrig igennem ("unable to adapt directly from zero to the highest concentration").
// Modellen: et gitter af felter (søjler × rækker). En bakterie (en prik) har et niveau r fra 0 til 4: hvor mange fejl,
// der beskytter den. Den kan leve i et bånd, hvis båndets niveau er højst r. En ny bakterie arver forælderens niveau, og
// en sjælden gang kommer en fejl med (r + 1). Fejlene kommer tilfældigt, også i feltet uden medicin (Luria og Delbrück
// 1943). De sker meget oftere end i virkeligheden, så man kan se dem. Tilfældigheden har et fast frø, så testene er stabile.

export const BÅND = [0, 3, 30, 300, 3000]; // gange så meget medicin, som stopper de almindelige bakterier
export const OMRÅDER = 5; // feltet uden medicin og fire bånd, lige brede
export const LAG = { normal: [0, 1, 2, 3, 4], spring: [0, 0, 0, 4, 4] }; // niveauet i hvert område
export const MAKS = 4;
const TAKT = 30; // skridt i sekundet ved 100 søjler (færre søjler: færre skridt, så det tager lige lang tid)
const P_VOKS = 0.16; // sandsynligheden for, at en bakterie ved kanten af kolonien deler sig i et skridt
const MU = 0.0008; // en fejl med pr. ny bakterie i feltet uden medicin
const MU_BÅND = 0.0002; // og i båndene (sjældnere, så grenene kommer en ad gangen, og man kan nå at finde dem)
const P_VÆG = 4e-5; // pr. bakterie ved en kant og skridt (ved 100 søjler): en ny gren, efter at den første er kommet
const VENT = 1.6; // sekunder, efter at et bånd er åbnet, før nogen kan komme ind (så man ser dem stoppe)
const VÆG_FRA = 1.4; // og så kommer den første gren efter mellem VÆG_FRA og VÆG_TIL sekunder ved kanten
const VÆG_TIL = 3.6;
const TVUNGET = [0.15, 0.3, 0.45, 0.6, 0.75]; // ved så stor en del af feltet uden medicin får en ny bakterie altid en fejl (trin 4)
const GREN_AFSTAND = 0.1; // to grene i samme bånd er mindst så stor en del af pladen fra hinanden
const NABO = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

// En fast tilfældighed (mulberry32): samme frø giver samme plade
export function tilfældighed(frø) {
  let a = frø >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Antallet af bakterier efter h timer, når de deler sig hvert 20. minut (3 gange i timen), som tekst
export function bakterierEfter(h) {
  const n = 2 ** Math.floor(h * 3);
  if (n >= 1e9) return 'over en milliard';
  if (n >= 1e6) return `ca. ${Math.floor(n / 1e6)} million${n >= 2e6 ? 'er' : ''}`;
  return n.toLocaleString('da-DK');
}

// Hvor lang tid der er gået (timer), når så stor en del af feltet uden medicin er fyldt: 10 timer, når det er fuldt
export const timerVed = (andel) => Math.min(10, 10 * andel);

export function lavPlade({ kol = 100, rækker = 100, lag = 'normal', frø = 1, tilfældig = null } = {}) {
  const rnd = tilfældig ?? tilfældighed(frø);
  const n = kol * rækker;
  const niveauer = LAG[lag] ?? LAG.normal;
  const område = new Int8Array(n); // områdets nummer for hvert felt (0 = feltet uden medicin)
  const niveau = new Int8Array(n); // båndets niveau
  for (let j = 0; j < rækker; j++) {
    for (let k = 0; k < kol; k++) {
      const o = Math.min(OMRÅDER - 1, Math.floor((k * OMRÅDER) / kol));
      område[j * kol + k] = o;
      niveau[j * kol + k] = niveauer[o];
    }
  }
  const skala = 100 / kol;
  const takt = TAKT / skala;
  const pVæg = P_VÆG * skala * skala;
  const r = new Int8Array(n).fill(-1); // bakteriens niveau (-1: tomt)
  const født = new Float32Array(n); // hvornår den kom (sekunder)
  const fra = new Int32Array(n).fill(-1); // forælderen
  let kant = []; // bakterier, der måske kan dele sig
  const nye = []; // nye bakterier siden sidst, tegningen tager dem
  const iFelt = niveauer.filter((x) => x === 0).length * (kol / OMRÅDER) * rækker; // felter uden medicin
  let fyldtFelt = 0;
  const iNiveau = Array(MAKS + 1).fill(0); // antal bakterier i båndene med hvert niveau
  let tvunget = 0;
  let antal = 0;
  let sidstFødt = -1;
  let rest = 0;

  const m = {
    kol, rækker, n, lag, niveauer, r, født, fra, område, niveau, nye,
    tid: 0,
    maks: 0, // højeste bånd, bakterierne må komme ind i (turen åbner dem et ad gangen)
    åbnet: Array(MAKS + 1).fill(0), // hvornår hvert bånd blev åbnet
    vent: Array(MAKS + 1).fill(null), // hvor længe de har ventet ved kanten til hvert bånd, og hvornår den første gren kommer
    grene: [], // [{ område, niveau, i, tid, fundet }]: hvor en slægt brød ind i et nyt bånd
    frø: null, // hvor den første bakterie blev sat
    antal: () => antal,
    andelFelt: () => fyldtFelt / iFelt,

    // Sæt en bakterie i felt (k, j). Kun i feltet uden medicin og på et tomt felt
    sæt(k, j) {
      k = Math.round(k);
      j = Math.round(j);
      if (k < 0 || j < 0 || k >= kol || j >= rækker) return false;
      const i = j * kol + k;
      if (niveau[i] !== 0 || r[i] >= 0) return false;
      fød(i, 0, -1);
      if (!m.frø) m.frø = { k, j };
      return true;
    },

    // Bakterierne må nu komme ind i båndene op til niveau maks (et nyt bånd venter VENT sekunder)
    åbn(maks) {
      for (let L = m.maks + 1; L <= Math.min(maks, MAKS); L++) m.åbnet[L] = m.tid + VENT;
      m.maks = Math.max(m.maks, Math.min(maks, MAKS));
    },

    // Kører modellen sek sekunder frem
    kør(sek) {
      rest += sek * takt;
      while (rest >= 1) {
        rest -= 1;
        skridt();
      }
    },

    // Kører frem, til intet sker længere (højst maksSek), fx når turen springer til et trin
    kørTilRo(maksSek = 200) {
      for (let t = 0; t < maksSek; t += 0.5) {
        m.kør(0.5);
        if (m.stille()) return;
      }
    },

    // Sker der ikke mere (ingen nye bakterier i lidt over et sekund, og ingen venter ved en kant til et åbent bånd)?
    stille: () => m.tid - sidstFødt > 1.2 && !venter(),
    // Bakteriernes niveau i et felt, og hvilket bånd det er
    felt: (k, j) => {
      const i = Math.round(j) * kol + Math.round(k);
      return i >= 0 && i < n ? { i, r: r[i], niveau: niveau[i], område: område[i] } : null;
    },
    // Den nærmeste bakterie med et af niveauerne i et bånd (eller null) inden for radius (søjler) af (k, j)
    nærmest(k, j, radius, test) {
      let bedst = null;
      let bd = radius * radius;
      for (let jj = Math.max(0, Math.floor(j - radius)); jj <= Math.min(rækker - 1, Math.ceil(j + radius)); jj++) {
        for (let kk = Math.max(0, Math.floor(k - radius)); kk <= Math.min(kol - 1, Math.ceil(k + radius)); kk++) {
          const i = jj * kol + kk;
          if (r[i] < 0 || (test && !test(i))) continue;
          const d = (kk - k) ** 2 + (jj - j) ** 2;
          if (d <= bd) {
            bd = d;
            bedst = i;
          }
        }
      }
      return bedst;
    },
    // Antal bakterier med niveau ≥ 1 i feltet uden medicin (dem, man skal finde i trin 4)
    medFejlIFelt() {
      let a = 0;
      for (let i = 0; i < n; i++) if (niveau[i] === 0 && r[i] > 0) a++;
      return a;
    },
    // Er der bakterier i område o?
    iOmråde(o) {
      for (let j = 0; j < rækker; j++) {
        const start = j * kol;
        for (let k = Math.floor((o * kol) / OMRÅDER); k < Math.floor(((o + 1) * kol) / OMRÅDER); k++) if (r[start + k] >= 0) return true;
      }
      return false;
    },
    // Det højeste område, bakterierne er nået ind i
    længst() {
      let o = 0;
      for (let i = 0; i < n; i++) if (r[i] >= 0 && område[i] > o) o = område[i];
      return o;
    },
    tag() {
      const ud = nye.splice(0);
      return ud;
    },
  };

  function fød(i, niv, forælder) {
    r[i] = niv;
    født[i] = m.tid;
    fra[i] = forælder;
    kant.push(i);
    nye.push(i);
    antal++;
    sidstFødt = m.tid;
    if (niveau[i] === 0) fyldtFelt++;
    iNiveau[niveau[i]]++;
    // En slægt, der bryder ind i et nyt bånd, er en ny gren (hvis der ikke allerede er en tæt ved)
    if (forælder >= 0 && niveau[i] > niveau[forælder]) {
      const k = i % kol;
      const j = (i - k) / kol;
      const tæt = m.grene.some((g) => g.område === område[i] && (g.k - k) ** 2 + (g.j - j) ** 2 < (GREN_AFSTAND * kol) ** 2);
      if (!tæt) m.grene.push({ område: område[i], niveau: niveau[i], i, k, j, tid: m.tid, fundet: false });
    }
  }

  // Kan bakterien i felt i leve i felt b?
  const kanLeve = (niv, b) => niveau[b] <= niv && niveau[b] <= m.maks && (niveau[b] === 0 || m.tid >= m.åbnet[niveau[b]]);

  // Er der en kant, hvor en gren venter på at komme ind i et åbent bånd?
  function venter() {
    for (let L = 1; L <= m.maks; L++) if (m.vent[L]?.kandidater || m.tid < m.åbnet[L]) return true;
    return false;
  }

  function skridt() {
    m.tid += 1 / takt;
    const kandidater = Array.from({ length: MAKS + 1 }, () => []);
    const tomme = [];
    for (let x = 0; x < kant.length; x++) {
      const c = kant[x];
      const ck = c % kol;
      const cj = (c - ck) / kol;
      tomme.length = 0;
      let blokeret = false;
      for (const [dk, dj] of NABO) {
        const kk = ck + dk;
        const jj = cj + dj;
        if (kk < 0 || jj < 0 || kk >= kol || jj >= rækker) continue;
        const b = jj * kol + kk;
        if (r[b] >= 0) continue;
        if (kanLeve(r[c], b)) tomme.push(b);
        else {
          blokeret = true;
          // En kant til det næste bånd: her kan en gren bryde igennem, hvis en ny bakterie får en fejl
          const L = niveau[b];
          if (L === r[c] + 1 && L <= m.maks && m.tid >= m.åbnet[L]) kandidater[L].push([c, b]);
        }
      }
      if (!tomme.length) {
        if (!blokeret) {
          // Ingen tomme naboer: den kan ikke dele sig mere
          kant[x] = kant[kant.length - 1];
          kant.pop();
          x--;
        }
        continue;
      }
      if (rnd() > P_VOKS) continue;
      const b = tomme[Math.floor(rnd() * tomme.length)];
      let niv = r[c];
      if (niv < MAKS) {
        // En fejl med: tilfældigt (MU), og et par gange i feltet uden medicin altid (så trin 4 har noget at finde)
        const tving = niveau[b] === 0 && tvunget < TVUNGET.length && fyldtFelt >= TVUNGET[tvunget] * iFelt && (b % kol) < (kol / OMRÅDER) * 0.6;
        if (tving) tvunget++;
        if (tving || rnd() < (niveau[b] === 0 ? MU : MU_BÅND)) niv++;
      }
      fød(b, niv, c);
    }
    // Ved kanten til et bånd: Den første gren kommer efter VÆG_FRA-VÆG_TIL sekunder, og senere en sjælden gang flere
    for (let L = 1; L <= m.maks; L++) {
      const kand = kandidater[L];
      const tomt = iNiveau[L] === 0;
      if (!kand.length) {
        if (m.vent[L]) m.vent[L].kandidater = 0;
        continue;
      }
      if (tomt) {
        m.vent[L] ??= { t: 0, grænse: VÆG_FRA + rnd() * (VÆG_TIL - VÆG_FRA) };
        m.vent[L].kandidater = kand.length;
        m.vent[L].t += 1 / takt;
        if (m.vent[L].t >= m.vent[L].grænse) brydIgennem(kand);
      } else {
        if (m.vent[L]) m.vent[L].kandidater = 0;
        for (const [c, b] of kand) if (r[b] < 0 && rnd() < pVæg) fød(b, r[c] + 1, c);
      }
    }
  }

  function brydIgennem(kand) {
    const [c, b] = kand[Math.floor(rnd() * kand.length)];
    if (r[b] < 0) fød(b, r[c] + 1, c);
  }

  return m;
}

// Panelet i "Leg frit: pladen" (budgettet: højst to tal og tre sætninger fremme, resten i "For nørder").
// Kilder: Baym m.fl. 2016 (se øverst), Luria og Delbrück 1943 (Wikipedia "Luria–Delbrück experiment": "arise in the
// absence of selective pressure rather than being a response to it", antallet "varied drastically", Nobelprisen 1969
// "in part for this work"). "Highly resistant mutants may be trapped behind more sensitive lineages" (Baym, resuméet).
export const PLADE_PANEL = {
  titel: 'Pladen',
  tekst: 'Hver prik står for mange bakterier. Hver gang en bakterie deler sig, bliver hele opskriften kopieret, og en sjælden gang kommer en fejl med. En fejl, der beskytter mod medicinen, lader efterkommerne vokse ind i næste bånd.',
  tal: [['Hvert bånd', '10 gange stærkere'], ['Det rigtige forsøg', 'ca. 10 dage']],
  nørd: {
    tal: [['Pladen i forsøget', '120 × 60 cm'], ['Det stærkeste bånd', '3.000 gange']],
    tekst: 'I 2016 lod Michael Baym og kolleger bakterier (E. coli) svømme ud over en plade med bånd af antibiotika, hvert med 10 gange så meget som det forrige. Det stærkeste havde 3.000 gange så meget, som der skal til at stoppe de almindelige bakterier. Uden båndene imellem kom de aldrig igennem. At fejlene kommer før medicinen, viste Salvador Luria og Max Delbrück i 1943 med bakterier og virus: Hvor mange der kunne tåle virussen, svingede vildt fra glas til glas, og det passer kun, hvis fejlene kom tilfældigt i forvejen. Og evolution er ikke kun udvalg. Tilfældigheder spiller også ind: På pladen var det ikke altid de mest modstandsdygtige, der kom først, for nogle blev fanget bag andre.',
  },
  hvorfor: ['livMenneske', 'livMaelk'],
};
