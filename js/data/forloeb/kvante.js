// Turen "Prikker bliver til striber" i Kvantefysik (Atomer, forløb 1). Ren data uden Three.js, så det kan testes i Node.
// Drejebogen står i docs/drejebog-kvantefysik.md (afsnit 3) med rettelserne i docs/fable/E7-kvantefysik-noter.md
// (afsnit 3: trin 5 giver ÉN bred bunke, ikke "som kuglerne", og højst to sætninger pr. tekst), og skabelonen i
// docs/fable/E3-forloeb.md. Det, der rører bænken, står i js/kvante.js under samme trin-id. Faktatjekket står i
// docs/fakta-kvantefysik/faktatjek-forloeb1.md. Det tredje gæt i trin 5 og trin 6 "Bølgen og prikken" kom 22. november 2026
// (docs/plan-kvante-to-steder.md, faktatjek i docs/fakta-kvantefysik/faktatjek-to-steder.md).

export const STRIBER = {
  id: 'striber',
  del: 'kvante',
  titel: 'Prikker bliver til striber',
  kernesætning: 'Elektroner lander én ad gangen som prikker, men prikkerne danner striber, som kun bølger kan lave. Måler man, hvilken vej elektronen tog, forsvinder striberne.',
  trin: [
    {
      id: 'kugler',
      spørg: 'Vi skyder små kugler mod en væg med to sprækker. Hvor rammer de bagvæggen?',
      gæt: {
        valg: [
          { tekst: 'I to striber', efter: 'Prøv det!', svar: 'Ja, én stribe bag hver sprække.' },
          { tekst: 'Over det hele', efter: 'Prøv det!', svar: 'Kun bag sprækkerne. Resten stopper i væggen.' },
        ],
      },
      gør: 'Hold Skyd nede, til 40 kugler har ramt.',
      så: 'To striber, én bag hver sprække. Sådan gør kugler.',
      ord: [],
    },
    {
      id: 'boelger',
      spørg: 'Nu sender vi bølger i vand mod de samme to sprækker.',
      gør: 'Tryk på det blå vand i karret (ved den gule ring), eller på Start bølgerne.',
      så: 'Ringene fra de to sprækker mødes. Hvor top møder top, bliver bølgen høj, og hvor top møder dal, slukker de hinanden: Det hedder interferens.',
      // Hvorfor mønstret (rettelse 3 efter prøven 28. november 2026: "jeg er som voksen ikke sikker på at jeg selv kan forklare det")
      mere: 'Det afhænger af vejen: Er der lige langt til begge sprækker, møder top top. Er vejen fra den ene sprække en halv bølge længere, møder top dal, og vandet står stille (de stiplede linjer). Sådan skifter det ud til siderne, og derfor får bagvæggen lyse og mørke striber.',
      ord: ['interferens'],
    },
    {
      id: 'elektroner',
      spørg: 'Nu elektroner, én ad gangen, og hver bliver til én prik. Hvilket mønster giver mange prikker?',
      gæt: {
        valg: [
          { tekst: 'To striber, som kuglerne', efter: 'Prøv det!', svar: 'Nej. Elektronerne laver bølgernes mønster.' },
          { tekst: 'Mange striber, som bølgerne', efter: 'Prøv det!', svar: 'Ja, selvom de kom én ad gangen.' },
        ],
      },
      gør: 'Hold Skyd nede: 10, 100, 1.000 elektroner.',
      så: 'Mange striber, selvom de kom én ad gangen. Hver prik er en hel elektron, men mønstret er en bølges.',
      ord: [],
    },
    {
      id: 'luk',
      // "den gule ring på bagvæggen" (rettelse 4 efter prøven 28. november 2026: "i ringen - hvilken ring?")
      spørg: 'I den gule ring på bagvæggen lander næsten ingen. Hvad sker der dér, hvis den ene sprække lukkes?',
      gæt: {
        valg: [
          { tekst: 'Der kommer færre', efter: 'Det lyder rimeligt, så prøv det!', svar: 'Det er lige omvendt, og det er det mærkelige.' },
          { tekst: 'Der kommer flere', efter: 'Prøv det!', svar: 'Ja. Det kan kun en bølge gøre.' },
        ],
      },
      gør: 'Tryk på en sprække, så den lukker (elektronerne fortsætter af sig selv).',
      så: 'Flere! Med to åbne sprækker går elektronens bølge gennem begge, og de to dele slukker hinanden i ringen.',
      // Rettelse 5 efter prøven: "så de slukker hinanden fordi bølgetop og bund mødes? måske lige skriv en sætning eller to mere"
      mere: 'Til ringen er vejen fra den ene sprække en halv bølge længere end fra den anden. Så møder bølgetoppen fra den ene sprække bølgedalen fra den anden, og de slukker hinanden, ligesom i vandet. Med én sprække er der ingen anden bølge at slukke med, så nu lander elektronerne også dér.',
      ord: [],
    },
    {
      id: 'maaler',
      spørg: 'Begge sprækker er åbne igen. Hvad ser en måler ved sprækkerne, når en elektron kommer?',
      gæt: {
        valg: [
          { tekst: 'En hel elektron ved én sprække', efter: 'Prøv det!', svar: 'Ja, hver gang.' },
          { tekst: 'En halv ved hver', efter: 'Prøv det!', svar: 'Nej, altid en hel ved én af dem.' },
          // Den populære udgave ("to steder på én gang"), som jeres forventning var (21. november 2026)
          { tekst: 'En hel ved begge på én gang', efter: 'Prøv det!', svar: 'Nej. Lamperne blinker aldrig begge for den samme elektron.' },
        ],
      },
      gør: 'Tænd måleren (elektronerne fortsætter af sig selv).',
      så: 'Måleren finder altid en hel elektron ved én sprække, aldrig ved begge. Men nu er de mørke striber væk.',
      ord: [],
    },
    {
      // Bølgen går gennem begge sprækker, elektronen findes ét sted (delens kernesætning, fakta-faelder.md)
      id: 'boelgen',
      spørg: 'Nu tegner vi elektronens bølge. Hvad finder bagvæggen, når bølgen når frem?',
      gæt: {
        valg: [
          { tekst: 'En udtværet elektron', efter: 'Prøv det!', svar: 'Nej. Bølgen er bredt ud, men elektronen findes ét sted.' },
          { tekst: 'Én hel prik ét sted', efter: 'Prøv det!', svar: 'Ja. Bølgen bestemmer kun chancen for hvor.' },
          { tekst: 'To prikker, én fra hver sprække', efter: 'Prøv det!', svar: 'Nej. Bølgen gik gennem begge, men der kommer kun én prik.' },
        ],
      },
      gør: 'Skyd én elektron ad gangen, og se bølgen.',
      så: 'Bølgen går gennem begge sprækker og breder sig ud. Men elektronen bliver fundet ét sted, oftest hvor bølgen er stærk.',
      ord: [],
    },
  ],
};
