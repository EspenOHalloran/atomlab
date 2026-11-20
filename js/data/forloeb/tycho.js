// Forløbet "Den nye stjerne" i bogen om Tycho Brahe (Opdagelserne, docs/drejebog-tycho.md, afsnit 5). Ren data uden DOM,
// så det kan testes i Node. T2 (19. november 2026) har drejebogens fire trin, og trin 2 er delt i to
// ("Tæt på eller langt væk?" og "Jorden og Månen", 20. november 2026), så der er fem. Vejene fra "Det så du" står i
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
      // Trin 2 og 3 var ét trin til 20. november 2026 (fund: "Jeg fatter ikke en skid af, hvad der er meningen her").
      // Nu først tommelfingeren alene, så Jorden og Månen, og spørgsmålet først, når man har set tommelfingeren hoppe
      id: 'tommel',
      kapitel: 'Tæt på eller langt væk?',
      spørg: 'Man havde lært, at himlen aldrig forandrer sig. Er stjernen så noget i luften, tæt på Jorden? Først et lille forsøg med din egen tommelfinger.',
      gør: 'Tryk på "Skift øje" et par gange. Kig efter: Tommelfingeren hopper frem og tilbage foran klosteret, men klosteret langt væk står stille.',
      så: 'Det, der er tæt på, hopper mest, når man ser det fra et nyt sted. Det hedder parallakse (forskydning), og du kan selv prøve det med strakt arm.',
      ord: ['parallakse'],
    },
    {
      id: 'parallakse',
      kapitel: 'Jorden og Månen',
      spørg: 'Hvordan kan Tycho så se, om den nye stjerne er tæt på?',
      gæt: {
        // Svarene står alene i rækken. "Flyt Tycho" kommer først efter gættet (js/forloeb.js)
        alene: true,
        valg: [
          { tekst: 'Han måler lyset', svar: 'Det siger ikke nok: Et lille lys tæt på kan være lige så klart som et stort lys langt væk.' },
          { tekst: 'Det kan man ikke', svar: 'Jo, det kan man. Det virker ligesom med tommelfingeren.' },
          { tekst: 'Han ser, om den hopper', svar: 'Rigtigt gættet!' },
        ],
      },
      gør: 'Tryk på "Flyt Tycho" fra toppen til siden af Jorden. Kig efter: Månen hopper mod stjernerne bag den, men den nye stjerne hopper ikke.',
      // Månens parallakse er ca. 57′ (58½′ lige under Månen, n56-n57), og Månen er ca. ½° bred
      så: 'Månen er tæt på, så den hopper næsten en grad, omtrent to gange sin egen bredde. Den nye stjerne hopper ikke, så den må være langt væk, ude mellem stjernerne.',
      ord: [],
    },
    {
      id: 'hoejt',
      kapitel: 'Højt og lavt',
      // Broen fra "Flyt Tycho": Når stjernen står lavt, ser han den lidt fra siden af Jorden (jo lavere, jo mere)
      spørg: 'Men Tycho kan ikke rejse om på siden af Jorden. Når den nye stjerne står lavt på himlen, ser han den dog lidt fra siden. Hvad måler han så?',
      gæt: {
        valg: [
          { tekst: 'En anden afstand', svar: 'Det ville den, hvis stjernen var tæt på. Men Tycho målte det samme hver gang.' },
          { tekst: 'Samme afstand', svar: 'Rigtigt gættet!' },
          { tekst: 'Stjernen er væk', svar: 'Nej. Cassiopeia går aldrig ned under horisonten i Danmark.' },
        ],
      },
      gør: 'Træk Cassiopeia rundt om Nordstjernen, og mål afstanden til Schedir, når den nye stjerne står højt og lavt.',
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
