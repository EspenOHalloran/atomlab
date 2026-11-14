// Forløbene "Rejsen i tid" og "Hvordan kan det ske?" i Kosmos (Serie 1, nr. 4, forløb A og B). Ren data uden
// Three.js, så det kan testes i Node.
// Drejebogen står i docs/fable/E4-tid.md (afsnit 4) og jeres svar i docs/fable/E4-noter.md og docs/lige-nu/tid.md.
// Det, der rører scenen (knapperne, hvornår trinet er gjort og "Vis mig"), står i js/kosmos/tid.js (forløb A) og
// js/kosmos/tidhvorfor.js (forløb B) under samme trin-id.
// Tallene er regnet med js/data/tid.js (tests/tid.mjs og tests/tid-forloeb.mjs): TRAPPIST-1 (40,66 lysår) ved 99,99 %
// giver 14 år og 55 dage og 94 år, Alpha Centauri (4,344 lysår) ved 50 % 28 og 30 år og ved 99,99 % 13 år og 45 dage og 21 år.

export const REJSEN_I_TID = {
  id: 'rejsen-i-tid',
  del: 'kosmos',
  fænomen: 'tid', // fænomenet i Kosmos, der viser forløbet (js/faenomenskaerm.js vælger det)
  titel: 'Rejsen i tid',
  kernesætning: 'Flyver man næsten med lysets fart ud og hjem, er der gået meget længere tid på Jorden end i skibet. Man mærker det ikke undervejs. Man ser det først, når man mødes igen.',
  trin: [
    {
      id: 'flyv',
      // Længere end skabelonens ca. 15 ord (Fables drejebog har 22): Opgaven skal stå der, før man gætter
      spørg: 'Du og din tvilling er 13. Du flyver næsten med lysets fart til en stjerne 41 lysår væk og hjem. Hvor gammel er din tvilling?',
      gæt: {
        valg: [
          { tekst: '13, som mig', efter: 'Tryk på "Flyv", og hold øje med urene.' },
          { tekst: 'Ca. 20', efter: 'Tryk på "Flyv", og hold øje med urene.' },
          { tekst: 'Over 90', efter: 'Tryk på "Flyv", og hold øje med urene.' },
        ],
      },
      gør: 'Flyv til TRAPPIST-1 og hjem.',
      så: 'Du er 14. Din tvilling er 94. I blev født samme dag.',
      ord: ['lysaar'],
    },
    {
      id: 'maerke',
      spørg: 'Du var væk i godt et år. Mærkede du noget om bord?',
      gæt: {
        valg: [
          { tekst: 'Ja, alt gik langsomt', efter: 'Flyv igen, og tryk på "Dit ur" undervejs.' },
          { tekst: 'Nej, ingenting', efter: 'Flyv igen, og tryk på "Dit ur" undervejs.' },
        ],
      },
      gør: 'Flyv igen, og se dit ur undervejs.',
      så: 'Om bord er alt normalt. Forskellen ses først, når I mødes. Det hedder tidsforlængelse.',
      ord: ['tidsforlaengelse'],
    },
    {
      // Jeres valg 13. november 2026: to ture til samme mål, så kun farten skifter
      id: 'farten',
      spørg: 'Er det farten? Flyv med halv lysfart til Alpha Centauri, godt 4 lysår væk. Bliver der stor forskel?',
      gæt: {
        valg: [
          { tekst: 'Stor forskel', efter: 'Flyv med 50 %, og bagefter med 99,99 % for at sammenligne.' },
          { tekst: 'Næsten ingen', efter: 'Flyv med 50 %, og bagefter med 99,99 % for at sammenligne.' },
        ],
      },
      gør: 'Flyv til Alpha Centauri med 50 % og med 99,99 %.',
      // Så kommer før "Det så du" (kernesætningen), fordi det sidste trin har en Så-tekst (js/forloeb.js)
      så: 'Halv lysfart: Du er 28, tvillingen 30. 99,99 %: Du er 13, tvillingen 21. Det sker først for alvor tæt på lysets fart.',
      ord: [],
    },
  ],
};

// Forløb B (jeres svar 14. november 2026: B4 med et målebånd, der lægger den lige vej to gange langs den skrå).
// Tallene: 87 % (√3/2) giver γ = 2 i lysuret, og 99,965 % giver γ ≈ 37,8 for myonerne (scene 3 i tidhvorfor.js). Ca.
// halvdelen når ned: e^(−15 km / 24,9 km) ≈ 0,55 (docs/fable/E4-noter.md).
export const HVORDAN_KAN_DET_SKE = {
  id: 'hvordan-kan-det-ske',
  del: 'kosmos',
  fænomen: 'tidhvorfor',
  titel: 'Hvordan kan det ske?',
  kernesætning: 'Lyset har den samme fart for alle. Derfor går et ur, der farer forbi, langsommere set udefra. Det er målt.',
  trin: [
    {
      id: 'kast',
      spørg: 'Et tog kører 100 km/t. I toget kastes en bold 50 km/t fremad. Hvor hurtigt flyver bolden set fra perronen?',
      gæt: {
        valg: [
          { tekst: '50 km/t', efter: 'Tryk på "Kast", og se bolden fra perronen.' },
          { tekst: '100 km/t', efter: 'Tryk på "Kast", og se bolden fra perronen.' },
          { tekst: '150 km/t', efter: 'Tryk på "Kast", og se bolden fra perronen.' },
        ],
      },
      gør: 'Kast bolden.',
      så: '150 km/t. Farterne lægges sammen. Sådan plejer det at være.',
      ord: [],
    },
    {
      id: 'lygte',
      spørg: 'Nu kører toget med halv lysfart og tænder en lygte. Hvor hurtigt er lyset set fra perronen?',
      gæt: {
        valg: [
          { tekst: 'Halvanden gange lysets fart', efter: 'Tryk på "Tænd lygten", og se lyset fra perronen.' },
          { tekst: 'Lysets fart', efter: 'Tryk på "Tænd lygten", og se lyset fra perronen.' },
        ],
      },
      gør: 'Tænd lygten.',
      så: 'Lysets fart, ikke mere. Lyset er ligeglad med togets fart.',
      ord: ['lysetsfart'],
    },
    {
      id: 'skraa',
      spørg: 'Et ur, hvor lys hopper op og ned mellem to spejle, flyver forbi dig. Hvilken vej går lyset set fra dig?',
      gæt: {
        valg: [
          { tekst: 'Lige op og ned', efter: 'Tryk på "Send uret forbi", og se det nederste billede.' },
          { tekst: 'På skrå', efter: 'Tryk på "Send uret forbi", og se det nederste billede.' },
        ],
      },
      gør: 'Send uret forbi.',
      så: 'På skrå, for spejlene flytter sig, mens lyset er på vej. Sådan et ur kaldes et lysur.',
      ord: ['lysur'],
    },
    {
      // Intet gæt (drejebogen): Her skal man selv måle
      id: 'maal',
      spørg: 'Hvor meget længere er den skrå vej end den lige?',
      gør: 'Tryk på "Mål", og se målebåndet lægge sig langs den skrå vej.',
      så: 'Dobbelt så lang. Lyset kan ikke skynde sig, så hvert tik tager dobbelt så lang tid set fra dig.',
      ord: [],
    },
    {
      id: 'myoner',
      spørg: 'Er det bare en tanke? Myoner fra rummet lever så kort, at de burde gå i stykker højt oppe. Hvor mange når ned?',
      gæt: {
        valg: [
          { tekst: 'Næsten ingen', efter: 'Se først "Uden Einstein", og skift så til "Med Einstein".' },
          { tekst: 'Ca. halvdelen', efter: 'Se først "Uden Einstein", og skift så til "Med Einstein".' },
        ],
      },
      gør: 'Skift fra "Uden Einstein" til "Med Einstein".',
      // 38: γ ≈ 37,8 ved 99,965 %. "Gennem dig": ca. 100 myoner i sekundet pr. m² ved havets overflade (arXiv:1906.03934, docs/fakta-tid/hvorfor-langsommere.md)
      så: 'Ca. halvdelen. Set fra os går deres ure 38 gange langsommere. De flyver gennem dig lige nu.',
      ord: ['myon'],
    },
  ],
};
