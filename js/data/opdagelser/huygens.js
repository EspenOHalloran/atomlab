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

// Vejene fra "Det så du" efter fortællingen (drejebogen afsnit 3, trin 5, og afsnit 5). sætning står foran den danske
// sætning fra 1659 under kernesætningen.
export const VEJE = {
  sætning: 'I 1659 afslørede han, hvad der stod:',
  saturn: 'Se ringen forsvinde ved Saturn',
  anagram: 'Løs hele anagrammet',
  selv: 'Prøv ringen selv',
};

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

// Anagrammet (drejebogen afsnit 3-4, faktagrundlaget afsnit 3): rækken, som den er trykt i 1656 og på s. 47 i Systema
// Saturnium (17 bunker, 62 bogstaver), og sætningen, Huygens afslørede i 1659. Ordene står med deres danske betydning
// (brikkerne i udfordringen). "cohaerente" med ae (bogen skriver æ). dansk er oversættelsen fra citatet huygensSaturn
// (js/data/citater.js), så den står ens begge steder. Testen i Node tjekker, at bogstaverne passer præcist.
export const ANAGRAM = {
  række: 'aaaaaaa ccccc d eeeee g h iiiiiii llll mm nnnnnnnnn oooo pp q rr s ttttt uuuuu',
  sætning: 'Annulo cingitur, tenui, plano, nusquam cohaerente, ad eclipticam inclinato.',
  dansk: 'Den er omgivet af en tynd, flad ring, der ingen steder hænger fast i den og hælder i forhold til Jordens baneplan.',
  // Ordet, man finder i forløbets trin 4 (det første ord i sætningen)
  nøgle: 'Annulo',
  ord: [
    { latin: 'Annulo', dansk: 'med en ring' },
    { latin: 'cingitur', dansk: 'er omgivet' },
    { latin: 'tenui', dansk: 'tynd' },
    { latin: 'plano', dansk: 'flad' },
    { latin: 'nusquam', dansk: 'ingen steder' },
    { latin: 'cohaerente', dansk: 'hængende fast' },
    { latin: 'ad eclipticam', dansk: 'mod Jordens baneplan' },
    { latin: 'inclinato', dansk: 'hældende' },
  ],
};

// De 17 bunker: [bogstav, antal] i rækkens orden
export const bunker = (række = ANAGRAM.række) => række.split(' ').map((b) => [b[0], b.length]);
// Bogstaverne i et ord eller en sætning (kun a-z, små), fx til at tælle bunkerne ned
export const bogstaver = (tekst) => [...tekst.toLowerCase().replace(/æ/g, 'ae').replace(/[^a-z]/g, '')];

