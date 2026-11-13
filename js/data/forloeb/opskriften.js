// Forløbet "Opskriften i dig" i Liv (Serie 1, nr. 2, forløb 1 af 2). Ren data uden Three.js, så det kan testes i Node.
// Drejebogen står i docs/fable/E3-liv-drejebog.md (med rettelserne i docs/fable/E5-liv.md, afsnit 6) og skabelonen i
// docs/fable/E3-forloeb.md. Fire trin med en handling, og drejebogens trin 5 er "Det så du" (kernesætningen og vejene).
// Det, der rører scenen (tryk i 3D, knapperne, hvornår trinet er gjort og "Vis mig"), står i js/liv.js under samme trin-id.
// Fakta: docs/fakta-liv/dna-stigen.md (2 m DNA, 46 kromosomer, A–T og G–C) og docs/fakta-liv/dna-opskriften.md (kopien).

export const OPSKRIFTEN = {
  id: 'opskriften',
  del: 'liv',
  titel: 'Opskriften i dig',
  // Ikke "I hver af mine celler" (drejebogens udkast): Røde blodlegemer har hverken cellekerne eller mitokondrier, altså
  // intet DNA, og de er ca. 84 % af cellerne (Sender m.fl. 2016, OpenStax 40-2, docs/fakta-liv/dna-stigen.md).
  kernesætning: 'I mine celler ligger DNA. Det er en lang, snoet stige, og trinene er fire bogstaver, der altid passer sammen to og to.',
  trin: [
    {
      id: 'celle',
      spørg: 'Her er en af dine celler. Opskriften ligger i den violette kugle. Tryk på den.',
      gør: 'Zoom ind mod den violette kugle, eller tryk på den.',
      så: 'Det er cellekernen. Her ligger opskriften på dig.',
      ord: ['celle', 'cellekerne'],
    },
    {
      id: 'traade',
      spørg: 'Opskriften er lange, tynde tråde. Hvor lange er de, hvis du trækker dem ud?',
      gæt: {
        valg: [
          { tekst: 'Som en fingernegl', efter: 'Tryk på en tråd for at komme helt tæt på.' },
          { tekst: 'Som din finger', efter: 'Tryk på en tråd for at komme helt tæt på.' },
          { tekst: 'Ca. 2 meter', efter: 'Tryk på en tråd for at komme helt tæt på.' },
        ],
      },
      gør: 'Tryk på en tråd for at komme helt tæt på.',
      // Ikke "i næsten hver celle": De fleste celler målt i antal er røde blodlegemer uden cellekerne (Fable E5, fælden i
      // docs/erfaringer/fakta-faelder-liv-og-videnskabsfolk.md). 6,1 mia. basepar × 0,34 nm = 2,07 m.
      så: 'Ca. 2 meter, i hver celle med en cellekerne! Trådene hedder kromosomer. De er lange stykker DNA.',
      ord: ['kromosom', 'dna'],
    },
    {
      id: 'par',
      spørg: 'Tråden er en snoet stige. Hvert trin er to bogstaver. Hvad står over for A?',
      gæt: {
        valg: [
          { tekst: 'Altid T', efter: 'Drej stigen, og tryk på et trin med et grønt A.' },
          { tekst: 'Det skifter', efter: 'Drej stigen, og tryk på et trin med et grønt A.' },
        ],
      },
      gør: 'Drej stigen, og tryk på et trin med A.',
      // "altid": G og T kan holde lidt sammen, når de rykker sig skævt (en kopifejl). Det står i "Ærligt talt".
      så: 'A står altid over for T, og G står altid over for C. Der er kun de fire bogstaver i DNA.',
      ord: [],
    },
    {
      id: 'byg',
      spørg: 'Kan du bygge den anden side selv? Vælg bogstavet, der passer til det, der lyser.',
      gør: 'Byg de tre sidste trin.',
      så: null, // det sidste trin slutter med "Det så du", og forklaringen står i slutTekst (js/liv.js)
      ord: [],
    },
  ],
};
