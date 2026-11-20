// Forløbet "Under isen" i Solsystemet (docs/drejebog-maaner.md, afsnit 3-4). Ren data uden Three.js, så det kan testes
// i Node. Det, der rører scenen (snittet, lupen, magnetfeltet og kontakten "Hav"), står i js/maaner/underisen.js under
// samme trin-id. M2 (20. november 2026) lavede trin 1-2, M3 (20. november 2026) trin 3-5 (fontænerne, tavlen og "Er der
// liv?") og den valgte kernesætning (drejebogens afsnit 1, valgt 12. november 2026).
// Fakta (docs/fakta-maaner-liv.md afsnit 1 og drejebogens afsnit 16): isen 15-25 km, havet 60-150 km og "måske dobbelt
// så meget vand som i alle Jordens have" (NASA, skøn), Galileos måling "omkring år 2000" (Kivelson m.fl. 2000).
// Trin 3-5: Enceladus ca. 504 km bred, Cassini opdagede fontænerne i 2005, over 100 fontæner (Porco m.fl. 2014: 101) langs
// fire revner ved sydpolen (fakta-maaner-liv.md afsnit 2). Liv: ikke fundet, og ingen har kunnet se efter (fælden
// "Cassini fandt ikke liv" i docs/erfaringer/fakta-faelder-liv.md).

export const UNDER_ISEN = {
  id: 'under-isen',
  del: 'solsystem',
  fænomen: 'underisen', // fænomenet i Solsystemet, der viser forløbet (js/faenomenskaerm.js vælger det)
  titel: 'Under isen',
  kernesætning: 'Under isen på Europa og Enceladus er der et hav. Enceladus sprøjter havet ud i rummet, så vi har kunnet smage på det og fundet næsten alt, liv har brug for, men ingen har endnu kunnet se efter, om der er liv.',
  // Vinkene (stilguiden B5), kun mens trinet venter
  vink: {
    snit: 'Træk lidt længere ned. Når snittet er over halvvejs, glider det selv resten.',
    hav: 'Prøv også at slå havet fra, og se, hvad Galileo så måler.',
    modlys: 'Drej videre, til Enceladus står mørk foran Solen. Så lyser fontænerne.',
    tavle: 'Træk et kort hen på en række på tavlen, eller tryk på kortet og så på rækken.',
  },
  trin: [
    {
      id: 'snit',
      spørg: 'To måner dækket af is. Europa kredser om Jupiter, den lille Enceladus om Saturn. Hvad tror du, der er under isen?',
      gæt: {
        valg: [
          { tekst: 'Is hele vejen ind', svar: 'Isen er kun det yderste lag.' },
          { tekst: 'Sten', svar: 'Inderst er der sten, men først kommer et hav.' },
          { tekst: 'Vand', svar: 'Ja, et hav under isen.' },
        ],
      },
      gør: 'Træk snittet ned gennem Europa.',
      så: 'Under ca. 20 km is er der et hav, 60-150 km dybt. Det er måske dobbelt så meget vand som i alle Jordens have.',
      ord: [],
    },
    {
      id: 'felt',
      spørg: 'Ingen har boret gennem isen. Hvordan kan forskerne vide, at der er et hav?',
      gæt: {
        valg: [
          { tekst: 'En rumsonde så vandet', svar: 'Intet kamera kan se gennem 20 km is.' },
          { tekst: 'En rumsonde målte et magnetfelt', svar: 'Ja. Det er målt, men på en omvej.' },
          { tekst: 'Det er bare et gæt', svar: 'Det er mere end et gæt. Det er målt, men på en omvej.' },
        ],
      },
      gør: 'Slå havet til og fra, og se, hvad Galileo måler, når Jupiters magnetfelt vipper.',
      så: 'Salt vand leder strøm. Når Jupiters magnetfelt vipper, laver havet sit eget lille felt, og det målte rumsonden Galileo omkring år 2000.',
      ord: ['magnetfelt'],
    },
    {
      id: 'fontæner',
      spørg: 'Enceladus er kun ca. 500 km bred. Da Cassini kom forbi i 2005, opdagede den noget mærkeligt ved sydpolen. Hvad tror du, det var?',
      gæt: {
        valg: [
          { tekst: 'Støv fra et nedslag', svar: 'Støv ville falde ned igen. Det her bliver ved og ved.' },
          { tekst: 'Vand og is, der sprøjter op', svar: 'Ja.' },
          { tekst: 'Gas fra Saturn', svar: 'Det kommer inde fra månen selv.' },
        ],
      },
      gør: 'Drej Enceladus, så Solen står bag sydpolen.',
      så: 'Over 100 fontæner sprøjter vand og is ud gennem revner ved sydpolen. Vandet kommer fra et hav under isen.',
      ord: ['fontaene'],
    },
    {
      id: 'tavle',
      spørg: 'Liv, som vi kender det, har brug for tre ting: vand, energi og de rigtige stoffer. Cassini fløj gennem sprøjtet. Hvad tror du, den fandt?',
      gæt: {
        valg: [
          { tekst: 'Kun vand', svar: 'Se tavlen.' },
          { tekst: 'Vand og salt', svar: 'Se tavlen.' },
          { tekst: 'Næsten alt, liv har brug for', svar: 'Se tavlen.' },
        ],
      },
      gør: 'Send Cassini gennem sprøjtet, og læg de fire fund på tavlen.',
      så: 'Enceladus har næsten alt, liv har brug for, og det meste er målt. På Europa er det meste regnet eller gættet.',
      ord: [],
    },
    {
      id: 'liv',
      spørg: 'Så er der liv i havet?',
      gæt: {
        valg: [
          { tekst: 'Ja', svar: 'Det ved ingen endnu.' },
          { tekst: 'Nej', svar: 'Det ved ingen endnu.' },
          { tekst: 'Det ved ingen', svar: 'Ja. Det ved ingen endnu.' },
        ],
      },
      gør: 'Tryk på den sidste linje på tavlen, Liv.',
      så: 'Det ved ingen. Cassini kunne ikke se efter liv, og det har ingen rumsonde endnu kunnet.',
      ord: [],
    },
  ],
};
