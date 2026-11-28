// Forløbet "Dit første atom" i Værkstedet (Serie 1, nr. 1). Ren data uden Three.js, så det kan testes i Node.
// Drejebogen står i docs/drejebog-foerste-atom.md og skabelonen i docs/fable/E3-forloeb.md.
// Fem felter pr. trin: spørg (højst ca. 15 ord), gæt (valgfrit), gør (én handling), så (højst ca. 20 ord) og ord (højst to).
// Det, der rører scenen (knapperne, hvornår trinet er gjort og "Vis mig"), står i js/vaerksted.js under samme trin-id.
// Fakta er tjekket i docs/drejebog-foerste-atom.md (punkt 6).

export const FØRSTE_ATOM = {
  id: 'foerste-atom',
  del: 'vaerksted',
  titel: 'Dit første atom',
  kernesætning: 'Et atom har en kerne med protoner og neutroner og elektroner udenom. Antallet af protoner bestemmer, hvilket grundstof det er.',
  trin: [
    {
      id: 'proton',
      spørg: 'Alt, du kan røre ved, er bygget af atomer. Lad os bygge det mindste.',
      gør: 'Læg én proton i kernen.',
      // Ingen ladning i de første trin (prøven 28. november 2026: "plusladet" og "minus" giver ikke mening endnu). Ladningen
      // kommer, når ordet forklares: i boblen ved proton og elektron (js/data/ordbog.js) og i "Hvorfor holder kernen?".
      så: 'Det er atomets kerne: én proton. Næsten hele atomets vægt sidder i kernen.',
      ord: ['proton', 'kerne'],
    },
    {
      id: 'elektron',
      spørg: 'Hvad mangler, før det er et helt atom?',
      gæt: {
        valg: [
          { tekst: 'En proton mere', efter: 'Det prøver vi om lidt. Prøv først en elektron.' },
          { tekst: 'En elektron', efter: 'Prøv det!' },
        ],
      },
      gør: 'Giv atomet en elektron.',
      så: 'Protonen trækker i elektronen, så den bliver ved kernen. Nu har du hydrogen, universets mest almindelige grundstof.',
      ord: ['elektron', 'grundstof'],
    },
    {
      id: 'proton2',
      spørg: 'Hvad sker der, hvis du lægger en proton mere i kernen?',
      gæt: {
        valg: [
          { tekst: 'Det bliver et nyt grundstof', efter: 'Prøv det!' },
          { tekst: 'Kernen går i stykker', efter: 'Prøv det!' },
        ],
      },
      gør: 'Læg en proton mere i kernen.',
      // Ikke "plus skubber plus væk, SÅ den falder fra hinanden": To neutroner kan heller ikke holde sammen, så frastødningen
      // er kun en del af grunden (docs/erfaringer/fakta-faelder.md), så de to ting står ved siden af hinanden.
      // Scenen holder på kernen (den ryster), så man kan redde den. Derfor "i virkeligheden" (E14).
      så: 'Begge dele! To protoner er helium. Men kernen ryster: Protonerne skubber hinanden væk, og i virkeligheden holder to protoner alene ikke sammen.',
      ord: [],
    },
    {
      id: 'neutroner',
      spørg: 'Kernen mangler noget, der kan holde den sammen.',
      gør: 'Læg to neutroner i kernen, og giv atomet en elektron mere.',
      så: 'Nu holder kernen. Neutronerne er en slags lim: De trækker uden at skubbe. Du har bygget helium.',
      ord: ['neutron'],
    },
    {
      id: 'tabel',
      // Siger kernesætningens anden halvdel (protonerne bestemmer grundstoffet) før "Det så du" (E14).
      spørg: 'Grundstof nr. 1 og 2 lyser: én proton og to protoner. Tryk på et af dem.',
      gør: 'Tryk på H eller He.',
      så: null, // det sidste trin slutter med "Det så du" og kernesætningen
      ord: [],
    },
  ],
};
