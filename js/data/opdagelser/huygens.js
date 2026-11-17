// Teksterne i bogen om Huygens og Saturns ører (docs/drejebog-huygens.md, rettet efter Fable 16. november 2026).
// Kilderne står i docs/fakta-videnskabsfolk/huygens.md. Uden DOM, så testene i Node kan læse dem.
//
// opslag er bogens opslag i rækkefølge. slags 'forside' har sin egen opbygning i js/bog.js. slags 'scene' er et kapitel
// med en tegning, man gør noget i (js/bog/huygens.js). Kun de opslag, der er bygget, står her (E20 fund 6, stilguiden A9):
// Gør det selv og "Om Huygens" kommer i H3-H4 (docs/plan-videnskabsfolk.md).

export const FORSIDE = {
  spørgsmål: 'Hvorfor havde Saturn ører?',
  galilei: 'Sådan tegnede Galilei Saturn i 1610.',
  navn: 'Christiaan Huygens',
  liv: '1629-1695',
  portrætTekst: 'Malet af Caspar Netscher i 1671. Huygens var ca. 42.',
  portrætAlt: 'Christiaan Huygens med langt, krøllet hår, tegnet som et gammelt kobberstik efter et maleri fra 1671.',
  begynd: 'Begynd',
};

export const OPSLAG = [
  { id: 'forside', slags: 'forside' },
  // Fortællingen (H2): forløbet "Saturns ører" kører i dette opslag med tegningerne fra js/bog/huygens.js. Bagefter er
  // opslaget et lille laboratorium: ringen, man selv kan dreje, og "Fortæl det igen" (jeres svar 16. november 2026).
  { id: 'fortaelling', slags: 'scene', titel: 'Saturns ører' },
];

// Fortællingens laboratorium (opslaget, når forløbet er taget eller sprunget over): de tre kapitler som tre valg
// (E20, stilguiden B7). Ringen er standard.
export const FRI = {
  linje: 'Træk op og ned, og se Saturn fra andre vinkler.',
  igen: 'Fortæl det igen',
  kapitler: [
    { id: 'linse', tekst: 'Linsen', linje: 'Gnid på glasset, og se kuglerne blive til arme.' },
    { id: 'naetter', tekst: 'Den lille prik', linje: 'Træk nætterne frem, og følg prikken rundt om Saturn.' },
    { id: 'ringen', tekst: 'Ringen', linje: 'Træk op og ned, og se Saturn fra andre vinkler.' },
  ],
};
