// Forløbet "Den nye stjerne" i bogen om Tycho Brahe (Opdagelserne, docs/drejebog-tycho.md, afsnit 5). Ren data uden DOM,
// så det kan testes i Node. T2 (19. november 2026) har drejebogens fire trin. Vejene fra "Det så du" står i
// js/data/opdagelser/tycho.js (VEJE). Det, der rører scenen (himlen, tommelfingeren, Månen og skyderen), står i
// js/bog/tycho.js under samme trin-id.
// Fakta: docs/fakta-videnskabsfolk/tycho.md. Han tvivlede på sine øjne, til andre kunne se den, når han viste dem stedet
// (afsnit 2, ikke "tjenerne og bønderne"). Høj og lav måling var ikke samme nat (afsnit 3). Han målte 7° 55′ til Schedir
// (n45). Lige under Månen ville forskellen være 58½′ (n56-n57). Farven og lyset måned for måned (afsnit 4). Den kunne
// ses til begyndelsen af 1574 (ikke "marts 1574").

export const DEN_NYE_STJERNE = {
  id: 'den-nye-stjerne',
  del: 'opdagelser',
  titel: 'Den nye stjerne',
  // Kernesætning A (jeres valg 19. november 2026, drejebogen afsnit 1 og 16)
  kernesætning: 'Den nye stjerne i 1572 flyttede sig ikke mod de andre stjerner, selv når den stod højt og lavt. Så var den langt bag Månen, og himlen kan forandre sig. Det målte Tycho, og jeg har selv set sådan en stjerne eksplodere.',
  // Vinkene (stilguiden B5, js/bog/tycho.js), kun mens trinet venter
  vink: {
    forkert: 'Se på den lille tegning i hjørnet. Hvilken stjerne er ny?',
    lavt: 'Godt, højt oppe er det 7° 55′. Træk den nu ned, så den står lavt.',
    højt: 'Godt, lavt nede er det 7° 55′. Træk den nu op, så den står højt.',
  },
  trin: [
    {
      id: 'stjernen',
      kapitel: 'Herrevad, 11. november 1572',
      spørg: 'Tycho ser op, som han plejer. Hvad er der galt med Cassiopeia, stjernebilledet, der ligner et W?',
      gør: 'Tryk på stjernen, der ikke var der før.',
      // Ikke "end Venus" den første aften: Tycho skriver det om hele november (side D). Det står i trin 4
      så: 'Den er klarere end alle andre stjerner. Tycho tror ikke sine egne øjne, før han viser andre stedet, og de også kan se den.',
      ord: [],
    },
    {
      id: 'parallakse',
      kapitel: 'Tæt på eller langt væk?',
      spørg: 'Man havde lært, at himlen aldrig forandrer sig. Er stjernen noget i luften, tæt på Jorden? Hvordan kan Tycho se det?',
      gæt: {
        valg: [
          { tekst: 'Han måler lyset', svar: 'Det siger ikke nok: Et lille lys tæt på kan være lige så klart som et stort lys langt væk.' },
          { tekst: 'Det kan man ikke', svar: 'Jo, det kan man. Det virker også med din egen tommelfinger.' },
          { tekst: 'Han ser, om den flytter sig', svar: 'Rigtigt gættet!' },
        ],
      },
      gør: 'Skift øje, og se tommelfingeren hoppe. Flyt så Tycho fra toppen til siden af Jorden.',
      // 58½′ under Månen (n56-n57) og "næsten en grad" er det samme. Månens bredde er ca. ½°
      så: 'Det, der er tæt på, hopper mest. Det hedder parallakse, og var stjernen lige så tæt på som Månen, ville den hoppe næsten en grad, to gange Månens bredde.',
      ord: ['parallakse'],
    },
    {
      id: 'hoejt',
      kapitel: 'Højt og lavt',
      spørg: 'Om natten drejer Cassiopeia rundt om Nordstjernen. Hvad måler Tycho, når den nye stjerne står lavt?',
      gæt: {
        valg: [
          { tekst: 'En anden afstand', svar: 'Det ville den, hvis stjernen var tæt på. Men Tycho målte det samme hver gang.' },
          { tekst: 'Samme afstand', svar: 'Rigtigt gættet!' },
          { tekst: 'Stjernen er væk', svar: 'Nej. Cassiopeia går aldrig ned under horisonten i Danmark.' },
        ],
      },
      gør: 'Træk Cassiopeia rundt, og mål afstanden til Schedir, når den nye stjerne står højt og lavt.',
      // "i flere måneder": Han målte ikke højt og lavt samme nat (fakta afsnit 3)
      så: 'Højt og lavt, i flere måneder: altid 7° 55′. Den flytter sig ikke, så den er langt bag Månen, og himlen kan altså forandre sig.',
      ord: [],
    },
    {
      id: 'falmer',
      kapitel: 'Stjernen falmer',
      spørg: 'Måned for måned ændrer stjernen sig. Hvad tror du, der sker med den?',
      gæt: {
        valg: [
          { tekst: 'Den lyser som før', svar: 'Nej. I maj 1573 var den kun så klar som en almindelig stjerne.' },
          { tekst: 'Den flytter sig', svar: 'Nej. Den blev på sin plads mellem stjernerne. Kun lyset ændrede sig.' },
          { tekst: 'Den falmer og skifter farve', svar: 'Rigtigt gættet!' },
        ],
      },
      gør: 'Træk månederne frem til begyndelsen af 1574.',
      // Supernova af type Ia: en hvid dværg (fakta afsnit 6). "En stjerne, der eksploderede" er ærligt nok her
      så: 'Den falmer fra hvid som Jupiter til rød som Aldebaran og bleg som Saturn, og så er den væk. I dag ved vi, at det var en stjerne, der eksploderede: en supernova.',
      ord: ['supernova'],
    },
  ],
};
