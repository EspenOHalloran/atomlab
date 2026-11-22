// Forløbet "Lige hurtigt for alle" i bogen om Albert Einstein (Opdagelserne, docs/drejebog-einstein.md, afsnit 5). Ren data
// uden DOM, så det kan testes i Node. E2 (21. november 2026): fire trin og "Det så du". Vejene fra "Det så du" står i
// js/data/opdagelser/einstein.js (VEJE), og det, der rører scenen (toget, urene, vægten og satellitten), står i
// js/bog/einstein.js under samme trin-id.
// Fakta: docs/fakta-einstein-bog.md og drejebogen afsnit 15 (regnet efter i Python). De to regler står på s. 891-892, og
// reglen om lyset er, at farten ikke afhænger af, hvordan lampen bevæger sig (ikke "intet kan indhente lyset"). Rundturen
// står på s. 904-905. Ikke "en lampe i stikkontakten": Det er batteriet, der mister energien, og det er al energien (lys
// og varme). GPS-tallene er de samme som i Rumtid (js/kosmos/rumtid.js) og regnes i gpsUr.

export const LIGE_HURTIGT = {
  id: 'lige-hurtigt',
  del: 'opdagelser',
  titel: 'Lige hurtigt for alle',
  // Kernesætning A (jeres valg 21. november 2026, drejebogen afsnit 1 og 17). Den sidste sætning kom med i E4 (22. november
  // 2026), da alle tre sider med ligningerne var bygget
  kernesætning: 'Fordi lyset er lige hurtigt for alle, går et ur, der farer af sted, langsommere, og masse er energi (E = mc²). Ti år senere viste Einstein, at tunge ting også får tiden til at gå langsommere, og det skal GPS\'en i min telefon regne med. Jeg har selv læst de tre ligninger på hans egne sider.',
  // Vinkene (stilguiden B5, js/bog/einstein.js), kun mens trinet venter
  vink: {
    tog: 'Lygterne tænder, når togets lygte er lige ud for en lygte på perronen.',
    gps: 'Træk satellitten helt op, hvor GPS-satellitterne kredser.',
  },
  trin: [
    {
      id: 'toget',
      kapitel: 'Bern, 1905: Toget og lyset',
      spørg: 'Et tog kører forbi en perron. Der sidder en lygte foran på toget og en på perronen. De tænder på samme tid, lige ud for hinanden. Hvilket lys kommer først?',
      gør: 'Tryk på "Tænd begge", og se, hvilket lysglimt der først når målet.',
      // Målt mange gange siden: fx dobbeltstjerner (de Sitter 1913) og lys fra partikler med næsten lysets fart (1964)
      så: 'De kom samtidig. Lyset bliver ikke hurtigere af, at toget kører: Det er Einsteins regel om lyset, og den er målt mange gange siden.',
      ord: [],
    },
    {
      id: 'rundtur',
      kapitel: 'Uret, der flyver en tur',
      spørg: 'To ure går helt i takt. Det ene bliver hjemme. Det andet flyver en tur rundt, meget hurtigt, og kommer tilbage. Hvad viser det?',
      gæt: {
        valg: [
          { tekst: 'Det samme', svar: 'Det ville man tro. Men urene viser ikke det samme, når det ene har fløjet.' },
          { tekst: 'Mere tid', svar: 'Nej, det er omvendt: Uret, der fløj, har vist mindre tid.' },
          { tekst: 'Mindre tid', svar: 'Rigtigt gættet!' },
        ],
      },
      gør: 'Vælg en fart, og tryk på "Send af sted". Sammenlign urene, når det er hjemme igen.',
      // Einstein, s. 904-905: et ur, der flyttes en tur rundt og kommer tilbage, er bagud. Ved 87 % viser det ca. halvt så
      // meget (9,9 mod 20 sekunder)
      så: 'Uret, der fløj, er bagud: Når lyset er lige hurtigt for alle, kan tiden ikke være det. Det er kernen i Einsteins relativitetsteori.',
      ord: ['relativitetsteori'],
    },
    {
      id: 'vaegten',
      kapitel: 'Batteriet på vægten',
      spørg: 'Et batteri får en lampe på 100 W til at lyse i en time. Lys og varme forsvinder ud i rummet. Bliver batteriet og lampen lettere?',
      gæt: {
        valg: [
          { tekst: 'En lillebitte smule', svar: 'Rigtigt gættet!' },
          { tekst: 'Nej, lys vejer intet', svar: 'Lys og varme er energi, og energi har masse. Så batteriet og lampen bliver lettere.' },
          { tekst: 'Så man kan mærke det', svar: 'Nej, det er alt for lidt til at kunne mærkes eller vejes.' },
        ],
      },
      gør: 'Tryk på "Spol en time", og se på tallet under vægten.',
      // 100 W · 3.600 s / c² = 4,0 · 10⁻¹² kg = 4 milliardtedele gram. Solen: 3,828 · 10²⁶ W / c² = 4,3 millioner ton/s
      så: 'Ja, men kun 4 milliardtedele gram: Masse er energi, E = mc². Solen bliver over 4 millioner ton lettere hvert sekund, fordi den lyser.',
      ord: [],
    },
    {
      id: 'gps',
      kapitel: 'Uret højt oppe (1915)',
      // Ikke "derfor falder æblet" (fælden: gælder kun langsomme ting i svag tyngde)
      spørg: 'Ti år senere gjorde Einstein sin teori færdig med tyngdekraften: Tunge ting krummer rumtiden, og tæt på dem går tiden langsommere. Et ur ligger på jorden, og et andet sidder i en GPS-satellit højt oppe, hvor det farer af sted. Hvilket går hurtigst?',
      gæt: {
        valg: [
          { tekst: 'Uret på jorden', svar: 'Lavt nede, ja. Men højt oppe, hvor GPS-satellitterne er, vinder satellittens ur.' },
          { tekst: 'Satellittens ur', svar: 'Rigtigt gættet!' },
          { tekst: 'Lige hurtigt', svar: 'Nej, de skiller sig ud med nogle milliontedele sekund hver dag.' },
        ],
      },
      gør: 'Træk satellitten op til GPS-højden, og se, hvilket ur der vinder på et døgn.',
      // Som Rumtid: +45 for højden, −7 for farten, i alt 38 milliontedele sekund. Ca. 10 km fejl om dagen
      så: 'Uret i satellitten vinder ca. 38 milliontedele sekund om dagen. Uden Einsteins ligninger ville din GPS tage ca. 10 km fejl om dagen.',
      ord: ['rumtid'],
    },
  ],
};
