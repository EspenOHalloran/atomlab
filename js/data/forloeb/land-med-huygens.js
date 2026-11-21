// Forløbet "Land med Huygens" i Solsystemet (docs/drejebog-maaner.md, afsnit 3, 7 og 8). Ren data uden Three.js, så det
// kan testes i Node. Det, der rører scenen (Cassini, Huygens, faldskærmen, disen, måleren og Huygens' kamera), står i
// js/maaner/landhuygens.js og js/maaner/nedtur.js under samme trin-id.
// M5a (21. november 2026): trin 1-2 (slip Huygens og turen gennem disen). M5b laver trin 3-4 (landingen og de tabte
// billeder) og sætter den valgte kernesætning A ind (drejebogens afsnit 1). Kernesætningen her er midlertidig.
// Fakta (docs/fakta-maaner-liv.md afsnit 4, drejebogens afsnit 16 og js/data/maaner/landhuygens.js): 2 t 27 min 50 s i
// faldskærm, kameraet kunne se jorden fra ca. 30 km, halvt så højt som ventet (ESA). Disen er der hele vejen ned (fælden
// "kom ud af disen" i docs/erfaringer/fakta-faelder-liv.md). Udefra havde Cassini og teleskoper på Jorden kun set lyse og
// mørke egne gennem disen i infrarødt lys, så "ingen havde set jorden tæt på".

export const LAND_MED_HUYGENS = {
  id: 'land-med-huygens',
  del: 'solsystem',
  fænomen: 'landhuygens', // fænomenet i Solsystemet, der viser forløbet (js/faenomenskaerm.js vælger det)
  titel: 'Land med Huygens',
  // Midlertidig til M5b (så kommer kernesætning A med stenene af is og de tabte billeder)
  kernesætning: 'Huygens dalede i over to timer gennem Titans orange dis, og først ca. 30 km over jorden kunne kameraet se jorden: lyse bakker med spor af floder.',
  vink: {
    slip: 'Tryk på "Slip Huygens" for at sende Huygens af sted mod Titan.',
    kamera: 'Hold øje med Huygens\' kamera i hjørnet. Hvornår kan det se jorden?',
  },
  trin: [
    {
      id: 'slip',
      spørg: 'Titan er pakket ind i en tyk, orange dis, så ingen havde set jorden tæt på. Huygens skal ned i faldskærm. Hvor lang tid tror du, det tager?',
      gæt: {
        valg: [
          { tekst: 'Et par minutter', svar: 'Meget længere.' },
          { tekst: 'En halv time', svar: 'Længere endnu.' },
          { tekst: 'Over to timer', svar: 'Ja, næsten to en halv time.' },
        ],
      },
      gør: 'Slip Huygens fra Cassini.',
      så: 'Over to timer, for luften er tyk, og faldskærmen falder langsomt. Vi spoler frem.',
      ord: [],
    },
    {
      id: 'disen',
      spørg: 'Huygens\' kamera kigger ned hele vejen. Hvornår tror du, det kan se jorden gennem disen?',
      gæt: {
        valg: [
          { tekst: 'Med det samme', svar: 'Højt oppe ser kameraet kun dis.' },
          { tekst: 'Halvvejs nede', svar: 'Senere endnu.' },
          { tekst: 'Først tæt på jorden', svar: 'Ja, ca. 30 km over jorden.' },
        ],
      },
      gør: 'Følg Huygens ned, og se, hvad kameraet ser.',
      så: 'Først ca. 30 km over jorden kunne kameraet se jorden, halvt så højt som ventet. Fra lyse bakker løber spor af floder ned mod en flad, mørk slette.',
      ord: [],
    },
  ],
};
