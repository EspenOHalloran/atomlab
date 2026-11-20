// Forløbet "Under isen" i Solsystemet (docs/drejebog-maaner.md, afsnit 3-4). Ren data uden Three.js, så det kan testes
// i Node. Det, der rører scenen (snittet, lupen, magnetfeltet og kontakten "Hav"), står i js/maaner/underisen.js under
// samme trin-id. M2 (20. november 2026) har trin 1-2. M3 tilføjer trin 3-5 (fontænerne, tavlen og "Er der liv?") og
// skifter kernesætningen til den valgte (drejebogens afsnit 1), som også handler om Enceladus.
// Fakta (docs/fakta-maaner-liv.md afsnit 1 og drejebogens afsnit 16): isen 15-25 km, havet 60-150 km og "måske dobbelt
// så meget vand som i alle Jordens have" (NASA, skøn), Galileos måling "omkring år 2000" (Kivelson m.fl. 2000).

export const UNDER_ISEN = {
  id: 'under-isen',
  del: 'solsystem',
  fænomen: 'underisen', // fænomenet i Solsystemet, der viser forløbet (js/faenomenskaerm.js vælger det)
  titel: 'Under isen',
  // Kun til M2 (trin 1-2). M3 sætter drejebogens kernesætning ind, når Enceladus' trin findes.
  kernesætning: 'Under isen på Europa er der et hav. Ingen har set det, men rumsonden Galileo målte det på en omvej, med et magnetfelt.',
  // Vinkene (stilguiden B5), kun mens trinet venter
  vink: {
    snit: 'Træk lidt længere ned. Når snittet er over halvvejs, glider det selv resten.',
    hav: 'Prøv også at slå havet fra, og se, hvad Galileo så måler.',
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
  ],
};
