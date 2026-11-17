// Forløbet "Rundt om Solen" på Solsystemets overblik (docs/drejebog-overblik.md, afsnit 2). Ren data uden Three.js, så
// det kan testes i Node. Det, der rører scenen (tryk, tidsskyderen, skalaen, dykket og vejene), står i
// js/solsystem/overblik-forloeb.js under samme trin-id. Trin 5 i drejebogen er "Det så du" (kernesætningen og vejene).
// Tallene står i drejebogens afsnit 4 (NSSDC): Merkur 365,25 / 88,0 = 4,15 omgange på et år, Neptun ca. 2° (360° / 164 år).
// Fodbolden (22 cm, Solen 1.392.700 km): Jorden 2,0 mm og 23,7 m væk (1 AU = 149.597.871 km).

export const OVERBLIK = {
  id: 'overblik',
  del: 'solsystem',
  fænomen: 'overblik', // overblikket i Solsystemet viser forløbet (js/faenomenskaerm.js vælger det)
  titel: 'Rundt om Solen',
  kernesætning: 'Planeterne går rundt om Solen, de inderste hurtigst, og imellem dem er rummet næsten helt tomt.',
  trin: [
    {
      id: 'jorden',
      spørg: 'Solen og de fire inderste planeter, som de står i dag. Hvilken er vores? Tryk på den.',
      // (gør vises ikke af klodsen, og trinet har ingen knapper: opfordringen står derfor i spørg, feedback 16. nov. 2026)
      gør: 'Tryk på Jorden.',
      så: 'Jorden er nummer tre af otte planeter. De går alle rundt om Solen, hver i sin bane.',
      ord: ['planet', 'bane'],
    },
    {
      id: 'rundt',
      spørg: 'Planeterne bevæger sig hele tiden. Hvem kommer hurtigst rundt?',
      gæt: {
        valg: [
          { tekst: 'De inderste', efter: 'Prøv det: Træk skyderen ét år frem.' },
          { tekst: 'De yderste', efter: 'Prøv det: Træk skyderen ét år frem.' },
          { tekst: 'Alle lige hurtigt', efter: 'Prøv det: Træk skyderen ét år frem.' },
        ],
      },
      gør: 'Træk tidsskyderen nederst ét år frem.',
      så: 'Jorden kom én gang rundt: Det er et år. Merkur nåede over fire omgange, og Neptun flyttede sig næsten ikke.',
      ord: [],
    },
    {
      id: 'skala',
      spørg: 'Planeterne er pustet op og rykket sammen. Hvis Solen var en fodbold, hvor stor var Jorden så?',
      gæt: {
        valg: [
          { tekst: 'En tennisbold', efter: 'Tryk på "Rigtig størrelse og afstand", og se, hvad der sker med planeterne.' },
          { tekst: 'En ært', efter: 'Tryk på "Rigtig størrelse og afstand", og se, hvad der sker med planeterne.' },
          { tekst: 'Et knappenålshoved', efter: 'Tryk på "Rigtig størrelse og afstand", og se, hvad der sker med planeterne.' },
        ],
      },
      gør: 'Skift til rigtig størrelse og afstand.',
      så: 'Et knappenålshoved, 24 meter fra fodbolden. Derfor er planeterne væk nu. Selv Solen er kun en lysprik.',
      ord: [],
    },
    {
      // Wow-øjeblikket: dykket fra hele Solsystemet ned til Jorden i den rigtige skala (ca. 8 sekunder)
      id: 'dyk',
      spørg: 'Jorden er derinde, tæt ved Solen. Find den, og tryk på ringen.',
      gør: 'Tryk på Jordens ring.',
      // Så kommer før "Det så du" (kernesætningen), fordi det sidste trin har en Så-tekst (js/forloeb.js)
      så: 'Der er Jorden. Hele vejen herind var der ingenting. Mellem planeterne er der næsten kun tomt rum.',
      ord: [],
    },
  ],
  // Man kan ikke fejle: et tryk på en anden klode i trin 1 (drejebogen, "Man kan ikke fejle")
  forkert: {
    solen: 'Det er Solen. Jorden er den blå, nummer tre fra Solen.',
    merkur: 'Det er Merkur, den inderste. Jorden er den blå, nummer tre fra Solen.',
    venus: 'Det er Venus. Jorden er den blå, nummer tre fra Solen.',
    mars: 'Det er Mars, den røde. Jorden er den blå, nummer tre fra Solen.',
    ude: (navn) => `Det er ${navn}, langt ude. Jorden er den blå, nummer tre fra Solen.`,
    dyk: 'Jorden er i den lille ring tæt ved Solen. Prøv igen.',
  },
  besøgTekst: 'Tryk på en planet for at flyve derind.',
};
