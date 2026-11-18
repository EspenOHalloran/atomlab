// Turen "Fejlen, der hjalp" i Liv (forløb 4, L4). Ren data uden Three.js, så det kan testes i Node. Drejebogen står i
// docs/drejebog-liv.md, afsnit 3 (med Opus' noter i docs/fable/E10-liv-noter.md, afsnit 3, punkt 6-9) og skabelonen i
// docs/fable/E3-forloeb.md. Det, der rører scenen, står i js/liv-fejlen.js under samme trin-id. Drejebogens trin 5 er
// "Det så du". Scenen er en plade efter et rigtigt forsøg (Baym m.fl. 2016), se js/data/liv/plade.js.
// Fakta: 20 minutter pr. deling (OpenStax Microbiology 9.1, "as little as 20 minutes under optimal growth conditions"),
// 2³⁰ = 1.073.741.824 efter 30 delinger (10 timer), og 2¹⁰ = 1.024 efter 3 timer og 20 minutter. Båndene: ti gange
// stærkere pr. bånd, op til 3.000 gange, ca. 10 dage med trimethoprim (Baym m.fl. 2016, PMC5534434). Fejlene kommer
// tilfældigt, før medicinen (Luria og Delbrück 1943, Wikipedia). Ikke "de vænner sig til det" (fælden fra E10).

export const FEJLEN = {
  id: 'fejlen',
  del: 'liv',
  titel: 'Fejlen, der hjalp',
  kernesætning: 'Kopien laver tilfældige fejl. En sjælden gang hjælper en fejl, og så får den, der har den, flere efterkommere. Det er naturligt udvalg, og sådan har livet udviklet sig.',
  trin: [
    {
      id: 'voks',
      spørg: 'En bakterie deler sig hvert 20. minut. Hvor mange er der efter 10 timer?',
      gæt: {
        valg: [
          { tekst: '30', efter: 'Sæt en bakterie på pladen.', svar: 'Det er antallet af delinger. Men hver deling fordobler antallet.' },
          { tekst: 'Ca. 1.000', efter: 'Sæt en bakterie på pladen.', svar: 'Over 1.000 var der allerede efter 3 timer og 20 minutter.' },
          { tekst: 'Over en milliard', efter: 'Sæt en bakterie på pladen.', svar: 'Rigtigt: 30 fordoblinger giver over en milliard.' },
        ],
      },
      gør: 'Sæt en bakterie på pladen.',
      så: 'Over en milliard, hvis der er mad nok. Hver deling er en kopi, og nogle få kopier har en fejl.',
      ord: [],
    },
    {
      id: 'kant',
      spørg: 'Det mørke bånd har antibiotika: medicin mod bakterier. Hvad sker der ved kanten?',
      gæt: {
        valg: [
          { tekst: 'Alle stopper', efter: 'Tryk på det sted, hvor de bryder igennem.', svar: 'Næsten: Kun nogle få kom igennem.' },
          { tekst: 'De vænner sig til den', efter: 'Tryk på det sted, hvor de bryder igennem.', svar: 'Ingen af dem blev bedre til at tåle den. Det var nogle få, der allerede kunne.' },
          { tekst: 'Nogle få kommer igennem', efter: 'Tryk på det sted, hvor de bryder igennem.', svar: 'Ja: de få med en fejl, og så deres efterkommere.' },
        ],
      },
      gør: 'Tryk på det sted, hvor de bryder igennem.',
      // Drejebogen sagde "Én havde en fejl", men pladen viser ofte to-tre grene (som i forsøget: "multiple coexisting lineages")
      så: 'Næsten alle stopper. Kun de få med en fejl, der beskytter dem, kommer igennem, og deres efterkommere vokser videre.',
      ord: ['antibiotika'],
    },
    {
      id: 'grene',
      spørg: 'Næste bånd er ti gange stærkere, og det næste igen. Kan de blive ved?',
      gør: 'Tryk på hver ny gren, der bryder igennem, til de når det sidste bånd.',
      så: 'Fejl oven på fejl. I det rigtige forsøg nåede de båndet med 3.000 gange så meget medicin på ca. 10 dage.',
      ord: [],
    },
    {
      id: 'tilfaeldig',
      spørg: 'Var det medicinen, der fik bakterierne til at ændre sig?',
      gæt: {
        valg: [
          { tekst: 'Ja', efter: 'Find en bakterie med fejlen, der aldrig har rørt medicinen, og tryk på den.', svar: 'Det tror mange. Men fejlene var der, før medicinen kom.' },
          { tekst: 'Nej', efter: 'Find en bakterie med fejlen, der aldrig har rørt medicinen, og tryk på den.', svar: 'Rigtigt: Fejlene kom af sig selv.' },
        ],
      },
      gør: 'Find en bakterie med fejlen, der aldrig har rørt medicinen, og tryk på den.',
      så: 'Nej. Fejlene kom tilfældigt. Medicinen afgjorde kun, hvem der kom videre. Det hedder naturligt udvalg.',
      ord: ['naturligt-udvalg'],
    },
  ],
};
