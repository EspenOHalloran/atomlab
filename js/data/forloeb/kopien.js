// Turen "Kopien" i Liv (forløb 3, L3). Ren data uden Three.js, så det kan testes i Node. Drejebogen står i
// docs/drejebog-liv.md, afsnit 2 (med Opus' noter i docs/fable/E10-liv-noter.md, afsnit 3) og skabelonen i
// docs/fable/E3-forloeb.md. Det, der rører scenen, står i js/liv-kopien.js under samme trin-id. Drejebogens trin 5 er
// "Det så du". "Det er cellen, der gør det": helikase, DNA-polymerase og kopigaffel står kun i "Vil du vide mere?".
// Fakta: docs/fakta-liv/dna-opskriften.md, afsnit 4 (semikonservativ, korrektur, under 1 pr. milliard, ca. 70).

export const KOPIEN = {
  id: 'kopien',
  del: 'liv',
  titel: 'Kopien',
  kernesætning: 'Før en celle deler sig, lyner den stigen op og bygger en ny side på hver halvdel. Næsten alle fejl bliver rettet. De få, der bliver, er mutationer, og jeg har selv nogle, som mine forældre ikke har.',
  trin: [
    {
      id: 'lyn',
      spørg: 'En celle skal blive til to, og begge skal have hele opskriften. Hvordan?',
      gæt: {
        valg: [
          { tekst: 'Den klipper stigen over på midten', efter: 'Træk lynlåsen hen ad stigen.' },
          { tekst: 'Den lyner den op på langs', efter: 'Træk lynlåsen hen ad stigen.' },
          { tekst: 'Den bygger en ny fra bunden', efter: 'Træk lynlåsen hen ad stigen.' },
        ],
      },
      gør: 'Træk lynlåsen hen ad stigen.',
      så: 'Stigen lyner op på langs. Bogstaverne slipper let hinanden, og nu er der to halve stiger.',
      ord: [],
    },
    {
      id: 'byg',
      // Trin 2 gentager ikke forløb 1's byggestige: ét bogstav på hver halvdel, og cellen bygger resten (E10-noterne, 3)
      spørg: 'Hver halvdel mangler sin anden side. Du kender reglen.',
      gør: 'Sæt det første bogstav på hver halvdel. Cellen bygger resten.',
      så: 'To ens stiger. Hver har én gammel side og én ny.',
      ord: [],
    },
    {
      id: 'fejl',
      spørg: 'Cellen kopierer hurtigt. Hvad sker der, når et forkert bogstav kommer på?',
      gæt: {
        valg: [
          { tekst: 'Det bliver siddende', efter: 'Find det par, der ikke passer, og tryk på det.' },
          { tekst: 'Cellen retter det', efter: 'Find det par, der ikke passer, og tryk på det.' },
          { tekst: 'Kopien går i stykker', efter: 'Find det par, der ikke passer, og tryk på det.' },
        ],
      },
      gør: 'Find det par, der ikke passer, og tryk på det.',
      // Ikke "parret buler" eller hvordan cellen mærker det (fælden om G–T, Kimsey m.fl. 2018)
      så: 'Cellen mærker, at parret ikke passer. Den klipper bogstavet af og sætter det rigtige på. Næsten alle fejl rettes.',
      ord: [],
    },
    {
      id: 'bliver',
      spørg: 'Hvor tit slipper en fejl alligevel igennem?',
      gæt: {
        valg: [
          { tekst: '1 ud af tusind', efter: 'Kopiér stigen igen, til en fejl bliver siddende.' },
          { tekst: '1 ud af en million', efter: 'Kopiér stigen igen, til en fejl bliver siddende.' },
          { tekst: 'Under 1 ud af en milliard', efter: 'Kopiér stigen igen, til en fejl bliver siddende.' },
        ],
      },
      gør: 'Kopiér stigen igen, til en fejl bliver siddende.',
      // Under 1 pr. 10⁹ efter korrekturen (McCulloch og Kunkel 2008). Ca. 70 nye pr. barn (Jónsson m.fl. 2017). Hvorfor
      // det ikke modsiger hinanden, står i kortet "Hvorfor ligner jeg mine forældre?" (en af vejene til sidst)
      så: 'Under 1 pr. milliard bogstaver. En fejl, der bliver, er en mutation. Du har ca. 70, som ingen af dine forældre har.',
      ord: ['mutation'],
    },
  ],
};
