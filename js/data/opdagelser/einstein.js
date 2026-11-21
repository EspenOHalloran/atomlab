// Teksterne i bogen om Albert Einstein og de tre ligninger (docs/drejebog-einstein.md, jeres svar 21. november 2026:
// "Ja til alle anbefalinger", kernesætning A, og ønsket om en stor bog: "Det skal være fedt"). Kilderne står i
// docs/fakta-einstein-bog.md (Opus xhigh i stedet for Fable). Uden DOM, så testene i Node kan læse dem.
//
// E1 (21. november 2026): forsiden med vignetten (lommeuret og lysglimtet, tegnet af lommeurTegning i js/bog.js). Kun de
// opslag, der er bygget, står i OPSLAG (E20 fund 6, stilguiden A9). Turen kommer i E2, ligningerne i E3 og E4, og
// "Om Einstein" i E5.

export const FORSIDE = {
  // Bogens røde tråd (drejebogen afsnit 2): alle tre ligninger følger af, at lyset er lige hurtigt for alle
  spørgsmål: 'Hvad sker der, når lyset er lige hurtigt for alle?',
  // Vignetten under introduktionen (drejebogen afsnit 3 og 4): en stregtegning som figurerne i Annalen der Physik 1905.
  // Kun lysglimtet og urets visere er gule. Bogstaverne er Einsteins egne: t for tiden og V for lysets fart (han skrev V,
  // ikke c, i 1905, faktafilen afsnit 2). Uret viser 7: toget, der "kommer hertil klokken 7", er hans eksempel på
  // samtidighed (s. 893, l. 1-6). Glimtet farer forbi med samme fart hele vejen (lineært)
  vignet: {
    klokken: 7,
    tid: 't',
    lys: 'V',
    tekst: 'Et lommeur og et lysglimt, tegnet som en figur i et tidsskrift fra 1905.',
    alt: 'Et lommeur med visere, der viser klokken 7, og et gult lysglimt, der farer forbi langs en linje under uret. Ved uret står bogstavet t og ved lyset bogstavet V.',
  },
  navn: 'Albert Einstein',
  liv: '1879-1955',
  // Schmutzers foto er kun dateret "1921", og Einstein fyldte 42 i marts det år (fælden med alderen, drejebogen afsnit 15)
  portrætTekst: 'Foto af Ferdinand Schmutzer fra 1921. Einstein var omkring 42.',
  portrætAlt: 'Albert Einstein med krøllet hår, overskæg og høj, hvid flip, tegnet som et gammelt kobberstik.',
  begynd: 'Begynd',
  // Introduktionen (den røde tråd fra begyndelsen, drejebogen afsnit 4). Faktatjekket (faktafilen afsnit 2): Einstein var
  // 26 i juni 1905 (født 14. marts 1879) og arbejdede på patentkontoret i Bern (Wikipedia "Albert Einstein"). De to regler står på s. 891-892: "Prinzip der Relativität" og lysets fart V i
  // "im leeren Raume", som ikke afhænger af, hvordan det lysende legeme bevæger sig. Derfor "i det tomme rum".
  intro: {
    sted: 'Bern, 1905',
    tekst: 'Albert Einstein er 26 år og arbejder på patentkontoret. Han tager to regler for givet: Naturens love er de samme for alle, der bevæger sig jævnt, og lyset i det tomme rum er altid lige hurtigt, uanset hvordan lampen bevæger sig. Det lyder harmløst, men han regner sig frem til, at så kan tiden ikke være den samme for alle. Hvad sker der, hvis begge regler gælder?',
  },
};

export const OPSLAG = [
  { id: 'forside', slags: 'forside' },
];
