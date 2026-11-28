// Forløbet "Himlens ur" i bogen om Ole Rømer (Opdagelserne, docs/drejebog-roemer.md, afsnit 5). Ren data uden DOM, så
// det kan testes i Node. R2 (28. november 2026) har drejebogens fire trin og "Det så du". Vejene fra "Det så du" står i
// js/data/opdagelser/roemer.js (VEJE). Det, der rører scenen (kikkerten, banerne ovenfra, lysglimtet og uret), står i
// js/bog/roemer.js under samme trin-id.
// Fakta: docs/fakta-videnskabsfolk/roemer.md. Io går rundt på ca. 42½ time (bladet s. 893, afsnit 2). Rømer havde sagt
// det til Akademiet "fra begyndelsen af september" (s. 894), ikke "den 16. november". Bladet siger "observed at Paris",
// så "man kigger efter", ikke "Rømer kigger". Klokkeslættet står kun i scenens ur (17.35.45 som i bladet), i teksten
// "lidt over halv seks", fordi Rømers egen liste ser ud til at sige 5.45.35 (afsnit 3). Han viste, at forskellen ikke
// kunne komme af Io's egen bane (s. 894). Tiderne for lyset (36 og 46 minutter) er nutidens tal (Horizons, afsnit 4).

export const HIMLENS_UR = {
  id: 'himlens-ur',
  del: 'opdagelser',
  titel: 'Himlens ur',
  // Kernesætning A (jeres svar 21. november 2026, drejebogen afsnit 1 og 16)
  kernesætning: 'Io kom for sent, når Jorden var langt fra Jupiter, for så skulle lyset rejse længere. Lyset bruger altså tid. Det viste Rømer i 1676, og jeg har selv set Io forsvinde i Jupiters skygge.',
  // Vinkene (stilguiden B5, js/bog/roemer.js), kun mens trinet venter
  vink: {
    juli: 'Tæt på Jupiter kommer Io lidt før tabellen. Træk nu Jorden frem til november.',
    ikkeSes: 'Nu står Jupiter bag Solen og kan ikke ses. Træk Jorden tilbage til november.',
    augustFørst: 'Godt. Prøv nu med Jorden i november.',
    novemberFørst: 'Godt. Prøv nu med Jorden i august.',
    nu: 'Nu skulle den komme …',
    ikkeEndnu: 'Ikke endnu.',
  },
  trin: [
    {
      id: 'skyggen',
      kapitel: 'Paris, 1676: Himlens ur',
      spørg: 'Jupiters fire store måner går rundt om Jupiter som visere på et ur. Den inderste hedder Io. Følg den i kikkerten.',
      gør: 'Træk tiden frem, til der sker noget med Io.',
      // "hver 42½ time": fra formørkelse til formørkelse (bladet s. 893, NSSDC)
      så: 'Io gled ind i Jupiters skygge og blev væk: en formørkelse. Det sker hver 42½ time, så man kan stille uret efter den.',
      ord: ['formoerkelse'],
    },
    {
      id: 'sent',
      kapitel: 'For tidligt og for sent',
      spørg: 'Astronomerne skriver tiden op, hver gang Io kommer ud af skyggen. Om sommeren er Jorden tæt på Jupiter. Hvad tror du, der sker, når Jorden fjerner sig?',
      gæt: {
        // Det rigtige svar står ikke samme sted i de tre gæt (som hos Tycho)
        valg: [
          { tekst: 'Io kommer til tiden', svar: 'Nej. Io går lige hurtigt, men vi ser den komme senere og senere.' },
          { tekst: 'Io kommer for sent', svar: 'Rigtigt gættet!' },
          { tekst: 'Io kommer for tidligt', svar: 'Nej, det gør den, når Jorden kommer tættere på Jupiter.' },
        ],
      },
      gør: 'Træk Jorden rundt om Solen fra august til november, og se urene.',
      // "kommer den tidligere": Tabellen i scenen er regnet ud fra august, så Io kommer kun før tabellen tæt på juli
      så: 'Jo længere Jorden kommer fra Jupiter, jo senere kommer Io. Når Jorden nærmer sig igen, kommer den tidligere.',
      ord: [],
    },
    {
      id: 'hvorfor',
      kapitel: 'Hvorfor?',
      spørg: 'Io går lige hurtigt rundt hele tiden. Hvorfor ser vi den så komme for sent?',
      gæt: {
        valg: [
          { tekst: 'Io går langsommere', svar: 'Nej. Rømer viste, at det ikke kunne komme af Io\'s egen bane.' },
          { tekst: 'Urene går forkert', svar: 'Nej. Så ville Io ikke komme for sent netop, når Jorden er langt væk.' },
          { tekst: 'Lyset skal rejse længere', svar: 'Rigtigt gættet!' },
        ],
      },
      gør: 'Tryk på "Io kommer ud", og følg lysglimtet hen til Jorden. Prøv med Jorden i august og i november.',
      så: 'Lyset skal rejse længere, når Jorden er langt væk, og det tager tid. Lyset kommer altså ikke frem på et øjeblik.',
      ord: [],
    },
    {
      id: 'november',
      kapitel: 'Den 9. november 1676',
      spørg: 'Fra begyndelsen af september har Rømer sagt til de lærde: I november kommer Io ca. 10 minutter senere, end tabellen siger. Om aftenen den 9. november kigger man efter. Hvad tror du, der sker?',
      gæt: {
        valg: [
          { tekst: 'Ca. 10 minutter for sent', svar: 'Rigtigt gættet!' },
          { tekst: 'Når tabellen siger', svar: 'Nej. Den kom 10 minutter senere, som Rømer havde sagt.' },
          { tekst: 'Den kommer slet ikke', svar: 'Jo, den kom, bare 10 minutter for sent.' },
        ],
      },
      gør: 'Se uret og kikkerten. Tryk, når Io dukker op.',
      så: 'Lidt over halv seks dukker Io op, 10 minutter for sent, som Rømer havde sagt. Han havde forudsagt det, før det skete.',
      ord: [],
    },
  ],
};
