// Gåderne i Biblioteket (#gaader, docs/plan-gaader.md): fem kort om det, videnskaben ikke ved endnu. Hvert kort er
// et lille forløb på tre trin (Hvad ved vi? / Hvad ved vi ikke? / Hvordan finder vi ud af det?) med samme form som
// forløbene i js/data/forloeb/. Uden Three.js, så det kan testes i Node (tests/gaader.mjs).
//
// Et kort: { id, spørgsmål, linje (til oversigten), dato, trin: [{ overskrift, spørg, gæt: { valg: [{ tekst, efter }] }, så }],
// slut (kernen i én-to sætninger), seDet: [data-gaa, tekst], nørd (HTML), ærligt (HTML), ord (fagord på kortet, id'er i
// Ordbogen) }. Et kort uden trin er ikke bygget endnu og står gråt i oversigten ("Kommer senere").
// Kilderne står i docs/fakta-gaader.md. Hvert kort har en dato, fordi stoffet flytter sig: Slå "Tjek igen" op, før
// teksten ændres.

export const GÅDER = [
  {
    id: 'sorthul',
    spørgsmål: 'Hvad er der inde i et sort hul?',
    linje: 'Intet slipper ud, så hvordan kan man vide det?',
    // Datoerne er slået op 12. november 2026: LISA (efter planen 2035) og GW250114 (arXiv:2509.08054)
    dato: 'Sådan stod det i november 2026',
    ord: ['horisont', 'singularitet'],
    trin: [
      {
        overskrift: 'Hvad ved vi?',
        spørg: 'Findes sorte huller i virkeligheden, eller er de bare en idé?',
        gæt: {
          valg: [
            { tekst: 'De er målt', efter: 'Rigtigt, de er målt på to måder.' },
            { tekst: 'Kun en idé', efter: 'Det var de længe, men i dag er de målt på to måder.' },
          ],
        },
        // LIGO 14. september 2015 (arXiv:1602.03837). Billedet af M87* blev vist 10. april 2019 (Event Horizon Telescope).
        så: 'I 2015 målte forskerne tyngdebølger (bølger i selve rummet) fra to sorte huller, der smeltede sammen. I 2019 viste de et billede af skyggen af et sort hul.',
      },
      {
        overskrift: 'Hvad ved vi ikke?',
        spørg: 'Målt eller gæt? »I midten er alt presset sammen i ét punkt.«',
        gæt: {
          valg: [
            { tekst: 'Målt', efter: 'Nej. Ingen kan se ind bag begivenhedshorisonten, så det er ikke målt.' },
            { tekst: 'Gæt', efter: 'Rigtigt. Ingen kan se ind bag begivenhedshorisonten.' },
          ],
          rigtigt: 1,
        },
        // Wikipedia "Gravitational singularity": "signals a breakdown of general relativity"
        så: 'Einsteins teori siger, at alt ender i et punkt, en singularitet. Men teorien giver »uendelig« dér, og det betyder, at den holder op med at virke: Ingen ved, hvad der er i midten.',
      },
      {
        overskrift: 'Hvordan finder vi ud af det?',
        spørg: 'Intet slipper ud. Hvordan kan man så undersøge det?',
        gæt: {
          valg: [
            { tekst: 'Send en sonde ind', efter: 'Den kan aldrig sende noget ud, når den først er inde.' },
            { tekst: 'Lyt til tyngdebølger', efter: 'Godt tænkt. De kommer fra området uden for horisonten, men kan vise, om Einsteins teori passer helt.' },
            { tekst: 'Find en ny teori', efter: 'Godt tænkt. Det arbejder forskerne på.' },
          ],
        },
        // LISA: vedtaget af ESA i januar 2024, opsendelse efter planen ca. 2035 (Wikipedia "Laser Interferometer Space
        // Antenna", stadig 2035 i 2026)
        så: 'Forskerne lytter til sorte huller, der smelter sammen, og ESA\'s LISA skal efter planen sendes op i 2035 og lytte endnu bedre. De leder også efter en teori, der forener tyngdekraften med fysikken for de allermindste ting, men måske får vi aldrig et svar, vi kan måle.',
      },
    ],
    slut: 'Sorte huller er målt. Hvad der er i midten, ved ingen.',
    seDet: ['kosmos:sorthul', 'Se det selv: Kosmos, Sort hul'],
    // τ = πGM/c³ (Lewis og Kwan, arXiv:0705.1029): 1,547 · 10⁻⁵ s pr. solmasse, altså 66,5 s for 4,30 mio. sole (GRAVITY),
    // 27,9 timer for 6,5 mia. sole (M87*) og 0,15 ms for 10 sole. Hawking: T = ħc³/(8πGMk) = 6,2 · 10⁻⁸ K for én solmasse,
    // ca. 44 millioner gange koldere end baggrundsstrålingen (2,725 K).
    nørd: `
      <p><b>Hvor lang tid?</b> Inden for horisonten går der højst πGM/c³ for den, der falder ind (Lewis og Kwan 2007). Det er ca. 67 sekunder i Mælkevejens sorte hul (4,3 millioner sole), ca. 28 timer i M87* (6,5 milliarder sole) og kun ca. 0,15 millisekunder i et hul på 10 sole. Raketter kan give lidt mere tid end et frit fald, men aldrig mere end det.</p>
      <p><b>Et sted eller et tidspunkt?</b> Inden for horisonten af et hul, der ikke drejer, opfører afstanden til midten sig som tid. Singulariteten er derfor nærmere et tidspunkt, der kommer for alle derinde, end et sted, man kan styre udenom.</p>
      <p><b>Huller, der drejer:</b> Rigtige sorte huller drejer som regel. For dem giver teorien (Kerr-hullet) en ring i stedet for et punkt og en ekstra horisont indenfor, men regnestykket for det indre er ustabilt. Heller ikke teorien ved altså, hvordan et rigtigt hul ser ud indeni.</p>
      <p><b>GW250114</b> (målt 14. januar 2025) er det tydeligste signal fra to sorte huller hidtil (ca. 34 og 32 sole). Det nye huls horisont fik et større areal end de to gamles tilsammen, som Hawking forudsagde i 1971, og hullets "toner" passede med Einsteins teori inden for ± 30 %.</p>
      <p><b>Hawking-stråling:</b> Hawking regnede i 1974 ud, at sorte huller stråler svagt og til sidst fordamper. Et hul på én solmasse er kun ca. 0,00000006 grader over det absolutte nulpunkt, ca. 44 millioner gange koldere end baggrundsstrålingen. Strålingen er aldrig målt. De fleste fysikere tror i dag, at oplysningerne om det, der faldt ind, ikke går tabt, men ingen ved hvordan.</p>
      <p><b>Nobelprisen:</b> Roger Penrose viste i 1965, at Einsteins teori giver en singularitet, når et sort hul dannes, og fik Nobelprisen i fysik i 2020 for det.</p>`,
    ærligt: '<p>"Målt eller gæt?" er forenklet. At der er en singularitet, er ikke et vildt gæt: Det er det, Einsteins teori forudsiger, og teorien passer med alle målinger uden for horisonten. Men en forudsigelse er ikke en måling, og her siger teorien selv, at den ikke holder.</p>',
  },
  // De næste kort bygges i G2 og G3 (docs/plan-gaader.md). Uden trin står de gråt i oversigten.
  { id: 'liv', spørgsmål: 'Er der liv andre steder?', linje: 'På Mars, på en måne eller om en anden stjerne' },
  { id: 'begyndelsen', spørgsmål: 'Hvordan begyndte livet?', linje: 'Fra stoffer uden liv til den første celle' },
  { id: 'antistof', spørgsmål: 'Hvor blev antistoffet af?', linje: 'Alt omkring os er stof, næsten intet er antistof' },
  { id: 'moerktstof', spørgsmål: 'Hvad er mørkt stof?', linje: 'Noget usynligt trækker i galakserne' },
];

export const gådeMed = (id) => GÅDER.find((g) => g.id === id) ?? null;
export const bygget = (g) => Array.isArray(g?.trin) && g.trin.length > 0;
