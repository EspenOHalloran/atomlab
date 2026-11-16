// Teksterne i bogen om Huygens og Saturns ører (docs/drejebog-huygens.md, rettet efter Fable 16. november 2026).
// Kilderne står i docs/fakta-videnskabsfolk/huygens.md. Uden DOM, så testene i Node kan læse dem.
//
// opslag er bogens opslag i rækkefølge. slags 'forside' har sin egen opbygning i js/bog.js. slags 'scene' er et kapitel
// med en tegning, man gør noget i (js/bog/huygens.js). slags 'tom' er et opslag, der kommer i et senere trin (H3-H4 i
// docs/plan-videnskabsfolk.md): kun kapitlets titel og én linje.

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
  { id: 'gaaden', slags: 'tom', titel: 'Hemmeligheden', tekst: 'Her kommer gåden fra bogen: et anagram på 62 bogstaver.' },
  { id: 'selv', slags: 'tom', titel: 'Se det selv', tekst: 'Her kommer vejen til Saturns ringe i Solsystemet.' },
  { id: 'bogen', slags: 'tom', titel: 'Bogen fra 1659', tekst: 'Her kommer siderne fra Huygens\' egen bog, Systema Saturnium.' },
  { id: 'om', slags: 'tom', titel: 'Om Huygens', tekst: 'Her kommer "Hvorfor?", "For nørder" og "Ærligt talt".' },
];

export const TOM_LINJE = 'Dette opslag er ikke færdigt endnu.';

// Fortællingens laboratorium (opslaget, når forløbet er taget eller sprunget over)
export const FRI = {
  linje: 'Træk op og ned, og se Saturn fra andre vinkler.',
  igen: 'Fortæl det igen',
};
