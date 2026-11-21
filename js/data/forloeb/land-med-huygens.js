// Forløbet "Land med Huygens" i Solsystemet (docs/drejebog-maaner.md, afsnit 3, 7 og 8). Ren data uden Three.js, så det
// kan testes i Node. Det, der rører scenen (Cassini, Huygens, faldskærmen, disen, måleren og Huygens' kamera), står i
// js/maaner/landhuygens.js og js/maaner/nedtur.js under samme trin-id.
// M5a (21. november 2026): trin 1-2 (slip Huygens og turen gennem disen). M5b (21. november 2026): trin 3-4 (landingen
// med stenene og de tabte billeder) og kernesætning A (drejebogens afsnit 1, jeres valg 20. november 2026).
// Fakta (docs/fakta-maaner-liv.md afsnit 4, drejebogens afsnit 16 og js/data/maaner/landhuygens.js): 2 t 27 min 50 s i
// faldskærm, kameraet kunne se jorden fra ca. 30 km, halvt så højt som ventet (ESA). Disen er der hele vejen ned (fælden
// "kom ud af disen" i docs/erfaringer/fakta-faelder-liv.md). Udefra havde Cassini og teleskoper på Jorden kun set lyse og
// mørke egne gennem disen i infrarødt lys, så "ingen havde set jorden tæt på".
// M5b: lampen 700 m oppe målte jordens farve (ESA), stenene er små sten af is (ESA: "a mixture of water and hydrocarbon
// ice", "more pebble-sized"), ca. −179 °C (som Titans side i js/data/sider/saturn.js), "a dry riverbed" (Tomasko m.fl.
// 2005, at væsken var metan, er forskernes tolkning: "nok"), 700 billeder planlagt og 350 kom frem, fordi Cassini aldrig
// lyttede på kanal A (Wikipedia efter ESA, fakta-maaner-liv.md afsnit 4). Den eneste landing så langt ude (RS).

export const LAND_MED_HUYGENS = {
  id: 'land-med-huygens',
  del: 'solsystem',
  fænomen: 'landhuygens', // fænomenet i Solsystemet, der viser forløbet (js/faenomenskaerm.js vælger det)
  titel: 'Land med Huygens',
  // Kernesætning A (drejebogens afsnit 1)
  kernesætning: 'Under Titans orange dis fandt Huygens floder og sten af is. Den er den eneste rumsonde, der er landet så langt ude, og halvdelen af billederne gik tabt på vejen.',
  slut: 'Titan blev fundet i 1655 af Christiaan Huygens, som sonden er opkaldt efter.',
  vink: {
    slip: 'Tryk på "Slip Huygens" for at sende Huygens af sted mod Titan.',
    kamera: 'Hold øje med Huygens\' kamera i hjørnet. Hvornår kan det se jorden?',
    land: 'Tryk på "Land" for at lade Huygens dale det sidste stykke ned.',
    sten: 'Tryk på de to sten foran Huygens.',
    kanaler: 'Tryk på modtagerne A og B på Cassini.',
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
    {
      id: 'landet',
      spørg: '700 m over jorden tænder Huygens en lampe. Hvad tror du, den skal bruge den til?',
      gæt: {
        valg: [
          { tekst: 'At se i mørket', svar: 'Der er tusmørke, ikke mørkt.' },
          { tekst: 'At måle farven på jorden', svar: 'Ja. Derfor ved vi, hvilken farve jorden har.' },
          { tekst: 'At blive fundet', svar: 'Der er ingen til at finde den.' },
        ],
      },
      gør: 'Land, og tryk på de to sten foran Huygens.',
      så: 'Stenene er af is, hårde som sten ved ca. −179 °C. Huygens står i et tørt flodleje, som nok er gravet af flydende metan.',
      ord: ['metan'],
    },
    {
      id: 'tabt',
      spørg: 'Huygens sendte billeder til Cassini på to radiokanaler, A og B. Der skulle komme 700 billeder. Hvor mange tror du, der kom?',
      gæt: {
        valg: [
          { tekst: 'Alle 700', svar: 'Desværre ikke.' },
          { tekst: '350', svar: 'Ja.' },
          { tekst: 'Ingen', svar: 'Heldigvis kom der nogle.' },
        ],
      },
      gør: 'Tænd Cassinis to modtagere, og se, hvad der kommer igennem.',
      så: '350. En fejl i kommandoerne gjorde, at Cassini aldrig lyttede på kanal A, så halvdelen af billederne gik tabt.',
      ord: [],
    },
  ],
};
