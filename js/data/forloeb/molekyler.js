// Forløbet "Når atomer mødes" i Molekyler (Serie 1, nr. 3). Ren data uden Three.js, så det kan testes i Node.
// Drejebogen står i docs/drejebog-molekyler.md (afsnit 2) og skabelonen i docs/fable/E3-forloeb.md.
// Trin 1-2 foregår i "Del elektroner" og trin 3-4 i "Giv elektroner". Det, der rører scenen, står i js/molekyler-skaerm.js
// under samme trin-id. Fakta er tjekket i drejebogen (afsnit 6) og i docs/fakta-molekyler/faktatjek-forloeb.md.

export const MØDES = {
  id: 'molekyler',
  del: 'molekyler',
  titel: 'Når atomer mødes',
  // Hele sætningen (den korte udgave skar netop det væk, der holder salt sammen). Metaller nævnes ikke.
  kernesætning: 'Atomer hænger sammen ved at dele eller give elektroner. I vand deler de. I salt har natrium givet chlor en elektron, så plus og minus trækker i hinanden.',
  // Plus og minus, og at de trækker i hinanden, kommer fra "Dit første atom"
  før: { id: 'foerste-atom', del: 'vaerksted', tekst: 'Tag "Dit første atom" først' },
  trin: [
    {
      id: 'h2',
      spørg: 'To hydrogenatomer har hver én elektron. Hvad sker der, når de mødes?',
      gæt: {
        valg: [
          { tekst: 'De skubber hinanden væk', efter: 'Prøv det: Træk det ene atom hen til det andet.' },
          { tekst: 'De hænger sammen', efter: 'Prøv det: Træk det ene atom hen til det andet.' },
        ],
      },
      gør: 'Træk det ene atom hen til det andet.',
      så: 'De deler deres to elektroner. Begge kerner trækker i parret mellem dem, og det holder dem sammen. Det er et molekyle: H₂.',
      ord: ['molekyle'],
    },
    {
      id: 'vand',
      spørg: 'Oxygen har to elektroner uden partner. Hvor mange hydrogen kan det holde på?',
      gæt: {
        valg: [
          { tekst: 'Én', efter: 'Prøv det: Træk hydrogen hen til oxygen.' },
          { tekst: 'To', efter: 'Prøv det: Træk hydrogen hen til oxygen.' },
          { tekst: 'Tre', efter: 'Prøv det: Træk hydrogen hen til oxygen.' },
        ],
      },
      gør: 'Træk hydrogen hen til oxygen.',
      så: 'To. Nu har alle elektroner en partner. Det er vand, H₂O. Se, det er bøjet.',
      ord: [],
    },
    {
      id: 'salt',
      spørg: 'Natrium har én elektron yderst, og chlor har syv. Hvad sker der, når de mødes?',
      gæt: {
        valg: [
          { tekst: 'De deler', efter: 'Prøv det: Træk natrium hen til chlor.' },
          { tekst: 'Natrium giver chlor en elektron', efter: 'Prøv det: Træk natrium hen til chlor.' },
        ],
      },
      gør: 'Træk natrium hen til chlor.',
      // Den rigtige rækkefølge: Elektronen hopper først, når atomerne er tæt på (harpunen). Hvor tæt, og at den tit slet
      // ikke hopper, står i "Ærligt talt" i "Giv elektroner" (docs/fable/E6-molekyler-noter.md, afsnit 2).
      så: 'Tæt på hoppede elektronen over til chlor. Nu er natrium plus og chlor minus, og plus og minus trækker i hinanden.',
      ord: [],
    },
    {
      id: 'krystal',
      spørg: 'Atomer, der er plus eller minus, hedder ioner. Hvad sker der, når mange ioner mødes?',
      gæt: {
        valg: [
          { tekst: 'De sætter sig to og to', efter: 'Prøv det!' },
          { tekst: 'De lægger sig i ét stort mønster', efter: 'Prøv det!' },
        ],
      },
      gør: 'Byg krystallen.',
      så: 'Ikke to og to. Hver ion får seks naboer af den anden slags. Det er en krystal: køkkensalt.',
      ord: ['ion', 'krystal'],
    },
  ],
};
