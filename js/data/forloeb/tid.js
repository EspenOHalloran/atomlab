// Forløbet "Rejsen i tid" i Kosmos (Serie 1, nr. 4, forløb A). Ren data uden Three.js, så det kan testes i Node.
// Drejebogen står i docs/fable/E4-tid.md (afsnit 4) og jeres svar i docs/fable/E4-noter.md og docs/lige-nu/tid.md.
// Det, der rører scenen (knapperne, hvornår trinet er gjort og "Vis mig"), står i js/kosmos/tid.js under samme trin-id.
// Tallene er regnet med js/data/tid.js (tests/tid.mjs og tests/tid-forloeb.mjs): TRAPPIST-1 (40,66 lysår) ved 99,99 %
// giver 14 år og 55 dage og 94 år, Alpha Centauri (4,344 lysår) ved 50 % 28 og 30 år og ved 99,99 % 13 år og 45 dage og 21 år.

export const REJSEN_I_TID = {
  id: 'rejsen-i-tid',
  del: 'kosmos',
  fænomen: 'tid', // fænomenet i Kosmos, der viser forløbet (js/faenomenskaerm.js vælger det)
  titel: 'Rejsen i tid',
  kernesætning: 'Flyver man næsten med lysets fart ud og hjem, er der gået meget længere tid på Jorden end i skibet. Man mærker det ikke undervejs. Man ser det først, når man mødes igen.',
  trin: [
    {
      id: 'flyv',
      // Længere end skabelonens ca. 15 ord (Fables drejebog har 22): Opgaven skal stå der, før man gætter
      spørg: 'Du og din tvilling er 13. Du flyver næsten med lysets fart til en stjerne 41 lysår væk og hjem. Hvor gammel er din tvilling?',
      gæt: {
        valg: [
          { tekst: '13, som mig', efter: 'Tryk på "Flyv", og hold øje med urene.' },
          { tekst: 'Ca. 20', efter: 'Tryk på "Flyv", og hold øje med urene.' },
          { tekst: 'Over 90', efter: 'Tryk på "Flyv", og hold øje med urene.' },
        ],
      },
      gør: 'Flyv til TRAPPIST-1 og hjem.',
      så: 'Du er 14. Din tvilling er 94. I blev født samme dag.',
      ord: ['lysaar'],
    },
    {
      id: 'maerke',
      spørg: 'Du var væk i godt et år. Mærkede du noget om bord?',
      gæt: {
        valg: [
          { tekst: 'Ja, alt gik langsomt', efter: 'Flyv igen, og tryk på "Dit ur" undervejs.' },
          { tekst: 'Nej, ingenting', efter: 'Flyv igen, og tryk på "Dit ur" undervejs.' },
        ],
      },
      gør: 'Flyv igen, og se dit ur undervejs.',
      så: 'Om bord er alt normalt. Forskellen ses først, når I mødes. Det hedder tidsforlængelse.',
      ord: ['tidsforlaengelse'],
    },
    {
      // Jeres valg 13. november 2026: to ture til samme mål, så kun farten skifter
      id: 'farten',
      spørg: 'Er det farten, der gør det? Flyv til Alpha Centauri, godt 4 lysår væk, med halv lysfart. Bliver der stor forskel?',
      gæt: {
        valg: [
          { tekst: 'Stor forskel', efter: 'Flyv med 50 %, og bagefter med 99,99 % for at sammenligne.' },
          { tekst: 'Næsten ingen', efter: 'Flyv med 50 %, og bagefter med 99,99 % for at sammenligne.' },
        ],
      },
      gør: 'Flyv til Alpha Centauri med 50 % og med 99,99 %.',
      // Så kommer før "Det så du" (kernesætningen), fordi det sidste trin har en Så-tekst (js/forloeb.js)
      så: 'Halv lysfart: Du er 28, tvillingen 30. 99,99 %: Du er 13, tvillingen 21. Det sker først for alvor tæt på lysets fart.',
      ord: [],
    },
  ],
};
