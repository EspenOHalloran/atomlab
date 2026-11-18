// Liv L3, kopien: stigen med 12 trin, fejlene i turen "Kopien" og laboratoriet "Leg frit: Kopien". Kun tal og tekst, så det
// kan testes i Node. Drejebogen står i docs/drejebog-liv.md (afsnit 2) og faktagrundlaget i docs/fakta-liv/dna-opskriften.md,
// afsnit 4 (kopien) og "Godt til en 13-årig".
//
// Halvdelene: 0 er den øverste (den gamle side I, der får en ny side II), 1 er den nederste (den gamle side II, der får
// en ny side I). En ny base på plads k i halvdel 0 skal passe til I[k], og i halvdel 1 til II[k] = PARTNER[I[k]], altså
// være I[k] selv. Derfor bliver de to nye stiger ens.

import { PARTNER } from './stige.js';
import { HBB } from './gener.js';

export const KOPI_TRIN = 12;
// De første 12 bogstaver i genet HBB (ATG GTG CAT CTG), de samme som i turen "Hvad står der i opskriften?"
export const KOPI_START = HBB.dna.slice(0, KOPI_TRIN);

// Den base, halvdel h skal have på plads k, når den gamle side I er dna
export const nyBase = (dna, h, k) => (h === 0 ? PARTNER[dna[k]] : dna[k]);
// Den gamle base, en ny base på plads k i halvdel h sidder over for
export const gammelBase = (dna, h, k) => (h === 0 ? dna[k] : PARTNER[dna[k]]);

// Et forkert bogstav: en base, der ikke passer til den gamle. Helst ikke den gamle base selv (fx A over for A), så
// parret er let at se med farverne og bogstaverne.
export function forkertBase(gammel, tilfældig = Math.random) {
  const valg = [...'ATGC'].filter((b) => b !== PARTNER[gammel] && b !== gammel);
  return valg[Math.floor(tilfældig() * valg.length)];
}

// Fejlene i turen er faste, så testene er stabile. Trin 3: ét forkert bogstav, man selv finder. Trin 4: tre kopier, og
// den tredje fejl bliver siddende (drejebogen: "senest tredje gang", her altid tredje gang).
// I = ATGGTGCATCTG: I[7] = A (skal have T, får C), I[3] = G (halvdel 1 skal have G, får A), I[9] = C (skal have G, får T),
// I[5] = G (halvdel 1 skal have G, får T: over for C).
export const FEJL_FIND = { h: 0, k: 7, forkert: 'C' };
export const FEJL_KOPIER = [
  { h: 1, k: 3, forkert: 'A', bliver: false },
  { h: 0, k: 9, forkert: 'T', bliver: false },
  { h: 1, k: 5, forkert: 'T', bliver: true },
];

// Laboratoriet: Fejlene kommer med ca. 1 pr. 30 nye bogstaver (skiltet i scenen), og en del af dem bliver siddende.
// Efter tre kopier uden en fejl, der blev, bliver den næste (så ★-opgaven kan klares, uden at man venter længe).
export const FEJL_PR_BOGSTAV = 1 / 30;
export const BLIVER_ANDEL = 0.35;
// tilfældig: tal i [0, 1). uden: så mange kopier i træk, hvor ingen fejl blev. Giver fejlene for én kopi.
export function labFejl(dna, tilfældig = Math.random, uden = 0) {
  const fejl = [];
  for (let h = 0; h < 2; h++) {
    for (let k = 1; k < KOPI_TRIN; k++) { // det første bogstav på hver halvdel får aldrig en fejl
      if (tilfældig() < FEJL_PR_BOGSTAV) fejl.push({ h, k, forkert: forkertBase(gammelBase(dna, h, k), tilfældig), bliver: tilfældig() < BLIVER_ANDEL });
    }
  }
  if (uden >= 3 && !fejl.some((f) => f.bliver)) {
    const h = tilfældig() < 0.5 ? 0 : 1;
    const k = 2 + Math.floor(tilfældig() * (KOPI_TRIN - 3));
    const før = fejl.findIndex((f) => f.h === h && f.k === k);
    if (før >= 0) fejl.splice(før, 1);
    fejl.push({ h, k, forkert: forkertBase(gammelBase(dna, h, k), tilfældig), bliver: true });
  }
  return fejl.sort((a, b) => a.k - b.k);
}

// En ny stige til "Kopiér igen" i laboratoriet: 12 bogstaver med alle fire
export function nyKopistige(tilfældig = Math.random) {
  for (;;) {
    let s = '';
    for (let i = 0; i < KOPI_TRIN; i++) s += 'ATGC'[Math.floor(tilfældig() * 4)];
    if ([...'ATGC'].every((b) => s.includes(b))) return s;
  }
}

// Panelet i "Leg frit: Kopien" (budgettet i docs/retning.md: højst to tal og tre sætninger fremme, resten i "Vil du vide mere?").
// Kilder (docs/fakta-liv/dna-opskriften.md, afsnit 4): 1,46 kb/min = 24 bogstaver i sekundet pr. kopigaffel (Conti m.fl.
// 2007). Én gaffel alene: 6,1 · 10⁹ / 24 = 2,5 · 10⁸ s ≈ 8 år. 30.000-50.000 startsteder (Hutchins m.fl. 2015) med to
// gafler hver giver titusindvis af gafler. Bakterier ca. 1.000 i sekundet (OpenStax 14-4). "Nogle timer": 8 timer er ikke
// fundet i en kilde. Under 1 fejl pr. milliard (McCulloch og Kunkel 2008): 6,1 · 10⁹ · 10⁻⁹ ≈ 6 pr. hel kopi. De ca. 70
// (Jónsson m.fl. 2017: 108.778 / 1.548 = 70,3) er samlet op gennem mange delinger, og nogle er skader (Fable E10).
export const KOPI_PANEL = {
  titel: 'Kopien',
  tekst: 'Før en celle deler sig, lyner den stigen op og bygger en ny side på hver halvdel. Én lynlås er for langsom, så cellen bruger titusindvis på én gang. Næsten alle fejl bliver rettet, og de få, der bliver, er mutationer.',
  tal: [['Farten ét sted', 'ca. 25 bogstaver i sekundet'], ['Med kun én lynlås', 'ca. 8 år']],
  nørd: {
    tal: [['Hos bakterier', 'ca. 1.000 bogstaver i sekundet'], ['Startsteder i en af dine celler', '30.000-50.000']],
    tekst: 'Med alle startstederne tager det nogle timer. Lynlåsen er et enzym, der hedder helikase, og det, der bygger den nye side, hedder DNA-polymerase. Stedet, hvor stigen deler sig, hedder en kopigaffel. DNA-polymerasen læser selv korrektur, og bagefter er der under 1 fejl pr. milliard bogstaver, altså kun nogle få nye pr. hel kopi. Dine ca. 70 nye er samlet op, fordi cellerne, der blev til sæd og æg, har delt sig mange gange, før du blev til. Og nogle er skader, ikke kopifejl.',
  },
  hvorfor: 'livKopi',
};

export const OPGAVER_KOPI = [
  {
    id: 'liv-mutation', titel: 'Find en mutation, der blev', tip: 'Åbn "Kopien", træk lynlåsen, og kopiér igen, til en fejl bliver siddende. Tryk så på parret, der ikke passer.',
    fakta: 'En fejl, der ikke bliver rettet, er en mutation. I dine celler sker det under én gang pr. milliard bogstaver, men du har alligevel ca. 70 nye, som ingen af dine forældre har.',
  },
];
