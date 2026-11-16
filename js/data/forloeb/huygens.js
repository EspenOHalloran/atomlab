// Forløbet "Saturns ører" i bogen om Huygens (Opdagelserne, docs/drejebog-huygens.md, afsnit 3). Ren data uden DOM, så
// det kan testes i Node. H2 (16. november 2026) har drejebogens trin 1-3. Trin 4 (anagrammet ANNULO) og vejene fra
// "Det så du" kommer i H3. Det, der rører scenen (lærredet i bogen, knapperne, hvornår trinet er gjort og "Vis mig"),
// står i js/bog/huygens.js under samme trin-id.
// Fakta: docs/fakta-videnskabsfolk/huygens.md (12-fods-kikkerten er over 3 m, Titan 25. marts 1655 og ca. 16 døgn,
// armene væk 16. januar 1656 efter hans rejse, s. 16).

export const SATURNS_ØRER = {
  id: 'saturns-oerer',
  del: 'opdagelser',
  titel: 'Saturns ører',
  // Kernesætning D (jeres valg 16. november 2026, drejebogen afsnit 1)
  kernesætning: 'Saturns "ører" er en tynd, flad ring, som vi ser fra skiftende vinkler. Fra kanten forsvinder den næsten. Det så Huygens, og det kan jeg også se.',
  trin: [
    {
      id: 'linse',
      kapitel: 'Haag, 1655',
      spørg: 'Sådan så Galilei Saturn i 1610. Hvad tror du, de to små kugler er?',
      gæt: {
        valg: [
          { tekst: 'To måner', efter: 'Slib linsen: Gnid rundt på glasset, til billedet bliver skarpt.' },
          { tekst: 'To håndtag', efter: 'Slib linsen: Gnid rundt på glasset, til billedet bliver skarpt.' },
          { tekst: 'Kikkerten snyder', efter: 'Slib linsen: Gnid rundt på glasset, til billedet bliver skarpt.' },
        ],
      },
      gør: 'Slib linsen: Gnid rundt på glasset, til billedet bliver skarpt.',
      // "over 3 meter": Han skriver "ikke over 12 fod" (s. 3), og linsen fra 1655 har 332 cm brændvidde (fælden "næsten 4 meter")
      så: 'Med en bedre linse bliver kuglerne til to tynde arme. Huygens\' kikkert var over 3 meter lang.',
      ord: ['linse'],
    },
    {
      id: 'naetter',
      kapitel: 'Den lille prik',
      spørg: 'En svag prik ved Saturn flytter sig fra nat til nat. Hvad er den?',
      gæt: {
        valg: [
          { tekst: 'En stjerne', efter: 'Træk nætterne frem, til prikken er tilbage, hvor den startede.' },
          { tekst: 'En måne', efter: 'Træk nætterne frem, til prikken er tilbage, hvor den startede.' },
          { tekst: 'En komet', efter: 'Træk nætterne frem, til prikken er tilbage, hvor den startede.' },
        ],
      },
      gør: 'Træk nætterne frem, til prikken er tilbage, hvor den startede.',
      // 16 nætter: hans eget tal (s. 26-27). I dag 15,945 døgn
      så: 'Efter 16 nætter er den tilbage: en måne, den første ved Saturn. I dag hedder den Titan.',
      ord: [],
    },
    {
      id: 'kanten',
      kapitel: 'Januar 1656',
      // "kommer hjem fra en lang rejse": "cum ad hoc usque tempus peregre abfuissem" (s. 16, 16. januar 1656)
      spørg: 'Christiaan kommer hjem fra en lang rejse. Saturns arme er væk! Hvor er de blevet af?',
      gæt: {
        valg: [
          { tekst: 'De er faldet af', efter: 'Træk op eller ned for at se Saturn fra en anden vinkel. Træk så tilbage, til armene er helt væk.' },
          { tekst: 'De gemmer sig bag Saturn', efter: 'Træk op eller ned for at se Saturn fra en anden vinkel. Træk så tilbage, til armene er helt væk.' },
          { tekst: 'Vi ser dem fra kanten', efter: 'Træk op eller ned for at se Saturn fra en anden vinkel. Træk så tilbage, til armene er helt væk.' },
        ],
      },
      // Rettet 16. november 2026 (jeres svar): Scenen starter med armene væk, så man åbner dem først og finder kanten bagefter
      gør: 'Træk op eller ned for at se Saturn fra en anden vinkel. Træk så tilbage, til armene er helt væk.',
      // Ikke "Saturn vipper": Ringen peger samme vej i rummet, og vi ser den fra en ny vinkel (fælden i fakta-faelder)
      så: 'Armene er en tynd, flad ring. Fra kanten bliver den til en streg, som kikkerten ikke kan se.',
      ord: [],
    },
  ],
};
