// Turen "Begyndelsen" (forløb 5, L5), en egen del i verdenen Liv. Ren data uden Three.js, så det kan testes i Node.
// Drejebogen står i docs/drejebog-liv.md, afsnit 4 (med Opus' noter i docs/fable/E10-liv-noter.md, afsnit 3, punkt
// 10-12), og skabelonen i docs/fable/E3-forloeb.md. Det, der rører scenen, står i js/begyndelsen.js under samme trin-id.
// Drejebogens trin 6 er "Det så du". Livets begyndelse er omstridt stof: Teksterne siger, hvad forsøgene viste, og at
// ingen ved, hvordan det skete.
// Fakta (docs/fakta-liv/begyndelsen.md, slået op igen 18. november 2026):
// - Miller, Science 117:528 (15. maj 1953): gnister i CH₄, NH₃, H₂ og H₂O (Lazcano og Bada 2003), "tre gasser og vand"
//   (E10-noterne, punkt 10). Vandet var lyserødt efter en dag og mørkerødt efter en uge (Wikipedia "Miller–Urey
//   experiment"). Ingen O₂ i kolben, så gasserne brænder ikke.
// - Luften: Parker m.fl. 2011 ("weakly reducing … N₂, CO₂ …", "significant yields of amino acids can still be
//   synthesized"). Cleaves m.fl. 2008: Med CO₂, N₂ og vand og kalk (calciumcarbonat) som buffer "yields of amino acids
//   greatly increased" (Wikipedia, læst 18. november 2026). Derfor "Ja, men det afhænger af, hvad der ellers er i vandet"
//   (ikke "færre", E10-noterne, punkt 11). Byggesten i Bennu: NASA 29. januar 2025.
// - Hinder: fosfolipider og fedtsyrer samler sig selv i vand (OpenStax Biology 5.1), også fedtagtige stoffer fra
//   Murchison-meteoritten (Deamer 1985).
// - QT45: Gianni m.fl., Science 391:1022-1028 (12. februar 2026), forfatternes manuskript PMC7618777 (læst 18. november
//   2026): 45 baser, i is ved −7 °C, 94,1 % rigtige bogstaver, udbytte ca. 0,2 % på 72 dage, med byggestykker af tre
//   bogstaver, som forskerne gav det.
// - Ingen har lavet liv af stoffer uden liv ("has not been observed experimentally", Wikipedia "Abiogenesis").

export const BEGYNDELSEN = {
  id: 'begyndelsen',
  del: 'begyndelsen',
  titel: 'Begyndelsen',
  kernesætning: 'Livets byggesten laver sig selv af gas og energi, og de findes også i rummet. Men ingen har lavet liv af dem, og ingen ved, hvordan det skete første gang.',
  trin: [
    {
      id: 'kolbe',
      spørg: 'Forskerne troede i 1953, at den unge Jord havde disse tre gasser. Hvad gør et lyn?',
      gæt: {
        valg: [
          { tekst: 'Ingenting', efter: 'Send lyn gennem kolben tre gange.', svar: 'Det ligner ingenting, men der kom nye stoffer i vandet.' },
          { tekst: 'Gasserne brænder', efter: 'Send lyn gennem kolben tre gange.', svar: 'De kan ikke brænde: Der er ingen ilt i kolben.' },
          { tekst: 'Der kommer nye stoffer i vandet', efter: 'Send lyn gennem kolben tre gange.', svar: 'Rigtigt: Lynet slår molekylerne i stykker, og stykkerne sætter sig sammen på nye måder.' },
        ],
      },
      gør: 'Send lyn gennem kolben tre gange.',
      // Drejebogen: "Vandet farves." Et lyn her er et døgn eller to i forsøget (Ærligt talt)
      så: 'Vandet farves. I det er der aminosyrer, byggestenene i dine proteiner, lavet af gas og lyn. Stanley Miller gjorde det i 1953.',
      ord: ['aminosyre'],
    },
    {
      id: 'luften',
      spørg: 'I dag tror mange forskere, at luften mest var kuldioxid og nitrogen. Virker det stadig?',
      gæt: {
        valg: [
          { tekst: 'Ja', efter: 'Skift luften, og send lyn gennem kolben.', svar: 'Rigtigt, når der er kalk i vandet. Uden kalk bliver der kun få.' },
          { tekst: 'Nej', efter: 'Skift luften, og send lyn gennem kolben.', svar: 'Det troede mange længe. Men med kalk i vandet kom der mange aminosyrer.' },
        ],
      },
      gør: 'Skift luften, og send lyn gennem kolben.',
      så: 'Ja, men det afhænger af, hvad der ellers er i vandet. Ingen kender luften præcist. Byggestenene findes også i sten fra rummet.',
      ord: [],
    },
    {
      id: 'hinde',
      spørg: 'En celle har en hinde om sig. Hvad gør fedtstoffer, når de kommer i vand?',
      gæt: {
        valg: [
          { tekst: 'Flyder ovenpå', efter: 'Dryp fedtstof i vandet.', svar: 'Nogle gør. Men disse har et hoved, der kan lide vand, og en hale, der skyr det.' },
          { tekst: 'Laver små bobler', efter: 'Dryp fedtstof i vandet.', svar: 'Rigtigt: Halerne gemmer sig for vandet, og laget lukker sig om sig selv.' },
          { tekst: 'Opløses', efter: 'Dryp fedtstof i vandet.', svar: 'Kun hovederne kan lide vand. Halerne skyr det og samler sig.' },
        ],
      },
      gør: 'Dryp fedtstof i vandet.',
      så: 'De samler sig selv til små bobler med vand indeni. Det er ikke en celle, men nu er der en inderside.',
      ord: ['hinde'],
    },
    {
      id: 'rna',
      spørg: 'I cellen er det proteiner, der kopierer DNA. Kan et molekyle kopiere sig selv?',
      gæt: {
        valg: [
          { tekst: 'Ja', efter: 'Lad RNA\'et kopiere sig selv, og hold øje med fejlene.', svar: 'Ikke helt endnu: Det lille RNA klarede det ikke helt selv.' },
          { tekst: 'Næsten', efter: 'Lad RNA\'et kopiere sig selv, og hold øje med fejlene.', svar: 'Rigtigt: Forskerne er tæt på, men ikke helt.' },
          { tekst: 'Nej', efter: 'Lad RNA\'et kopiere sig selv, og hold øje med fejlene.', svar: 'Det troede mange længe. Men i 2026 kom forskerne tæt på.' },
        ],
      },
      gør: 'Lad RNA\'et kopiere sig selv, og hold øje med fejlene.',
      så: 'Næsten. I 2026 byggede et lille RNA en kopi af sig selv: langsomt, med fejl og med forskernes hjælp.',
      ord: ['rna'],
    },
    {
      id: 'trappen',
      spørg: 'Byggesten, en hinde og en kopi, der næsten virker. Hvad mangler, før det er liv?',
      gør: 'Prøv at nå det øverste trin.',
      så: 'At det hele kører af sig selv og kan udvikle sig. Dér er ingen nået til. Ingen ved, hvordan det skete.',
      ord: [],
    },
  ],
};
