// Tavlen med de tre ting ("Under isen", trin 4-5, docs/drejebog-maaner.md afsnit 6). Ren data uden Three.js, så den kan
// testes i Node (tests/maaner-data.mjs). Selve tavlen (træk, tryk og farverne) står i js/maaner/tavle.js.
// Rækkerne er Vand, Energi, Stoffer og Liv, søjlerne Europa og Enceladus. Et felt får farven fra det bedste kort i det:
// grøn = målt, gul = regnet eller gættet, grå = ukendt. Liv er altid grå.
// Kilderne står i docs/fakta-maaner-liv.md (afsnit 1-2) og drejebogens afsnit 16. Faktatjekket 20. november 2026 (M3):
// Postberg m.fl. 2009 (Nature 459:1098, salt i E-ringens iskorn, der kun kan komme fra flydende vand), Waite m.fl. 2017
// (brint), Postberg m.fl. 2018 (store organiske molekyler over 200 u), Postberg m.fl. 2023 (fosfat), Thomas m.fl. 2016
// (vuggen), Kivelson m.fl. 2000 (Galileo), Trumbo m.fl. 2019 (salt, Hubble), Trumbo og Brown 2023 (kuldioxid, Webb),
// Szalay m.fl. 2024 (ilt, Juno) og Byrne m.fl. 2026 (havbunden er nok stille).

export const MÅNER = [
  { id: 'europa', navn: 'Europa' },
  { id: 'enceladus', navn: 'Enceladus' },
];

export const RÆKKER = [
  { id: 'vand', navn: 'Vand', ikon: '💧' },
  { id: 'energi', navn: 'Energi', ikon: '⚡' },
  { id: 'stoffer', navn: 'Stoffer', ikon: '🧪' },
  { id: 'liv', navn: 'Liv', ikon: '🦠' },
];

// Farverne (stilguiden A7: grøn og gul er ikke fare). Rækkefølgen er den bedste først.
export const FARVER = [
  { id: 'målt', navn: 'målt', farve: '#4fc27a' },
  { id: 'regnet', navn: 'regnet eller gættet', farve: '#e8c34a' },
  { id: 'ukendt', navn: 'ukendt', farve: '#6b7383' },
];

// Liv er grå for begge måner. Teksten kommer, når man trykker på rækken (trin 5).
export const LIV = {
  felt: 'Ikke fundet',
  tekst: 'Ikke fundet. Ingen har endnu kunnet se efter.',
};

// Kortene. fra: det trin, kortet ligger på tavlen fra ('felt' = trin 2, 'fontæner' = trin 3, 'tavle' = Europas søjle
// fylder sig selv i trin 4). selv: kortet falder ud af Cassini i trin 4, og man lægger det selv på den rigtige række.
// forkert: vinket, når kortet lægges på en forkert række (stilguiden B5: det glider selv hen til den rigtige).
export const KORT = [
  // ---------- Europa ----------
  {
    id: 'europa-felt', måne: 'europa', række: 'vand', farve: 'målt', fra: 'felt',
    titel: 'Magnetfeltet', hvem: 'Galileo, omkring år 2000',
    spørgsmål: 'Hvordan ved vi, at Europa har et hav?',
    svar: 'Rumsonden Galileo målte et ekstra magnetfelt ved Europa, der vendte, når Jupiters magnetfelt vippede. Det kræver et lag, der leder strøm godt, og den bedste forklaring er salt vand.\n\nDet er målt, men på en omvej: Ingen har set havet.',
  },
  {
    id: 'europa-varme', måne: 'europa', række: 'energi', farve: 'regnet', fra: 'tavle',
    titel: 'Varme fra tidevandet', hvem: 'Regnet',
    spørgsmål: 'Hvordan ved vi, at Europa bliver varmet?',
    svar: 'Det er regnet ud. Jupiter trækker i Europa, så månen bliver æltet og varmet indefra, og det holder havet flydende.\n\nOm der er varme kilder på havbunden, ved ingen. En model fra 2026 siger, at havbunden nok er stille i dag.',
  },
  {
    id: 'europa-ilt', måne: 'europa', række: 'energi', farve: 'regnet', fra: 'tavle',
    titel: 'Ilt fra strålingen', hvem: 'Juno, 2024',
    spørgsmål: 'Hvordan ved vi, at der er ilt?',
    svar: 'Strålingen fra Jupiter splitter isen på overfladen til brint og ilt. Rumsonden Juno målte i 2024, hvor meget ilt der bliver lavet, og det var mindre end ventet.\n\nOm ilten når ned i havet, er gættet.',
  },
  {
    id: 'europa-salt', måne: 'europa', række: 'stoffer', farve: 'regnet', fra: 'tavle',
    titel: 'Salt på overfladen', hvem: 'Hubble, 2019',
    spørgsmål: 'Hvordan ved vi, at der er salt?',
    svar: 'Rumteleskopet Hubble så et tegn på køkkensalt i lyset fra egne, hvor isen er brudt op, og hvor havvand nok er kommet op.\n\nSaltet er målt på overfladen. At det kommer fra havet, er forskernes bedste gæt.',
  },
  {
    id: 'europa-co2', måne: 'europa', række: 'stoffer', farve: 'regnet', fra: 'tavle',
    titel: 'Kuldioxid', hvem: 'Webb, 2023',
    spørgsmål: 'Hvordan ved vi, at der er kulstof?',
    svar: 'Rumteleskopet Webb fandt kuldioxid (CO₂) samlet i et ungt område på Europa. Kulstoffet kommer nok inde fra månen.\n\nMen forskerne skriver selv, at det også kan være lavet på overfladen.',
  },
  // ---------- Enceladus ----------
  {
    id: 'enceladus-fontæner', måne: 'enceladus', række: 'vand', farve: 'målt', fra: 'fontæner',
    titel: 'Fontænerne', hvem: 'Cassini, 2005',
    spørgsmål: 'Hvordan opdagede Cassini fontænerne?',
    svar: 'Først med sit magnetometer: I februar og marts 2005 bøjede Saturns magnetfelt uden om Enceladus. I juli 2005 fløj Cassini tæt forbi og fandt en sky af vand over sydpolen, og senere kom billederne af fontænerne.',
  },
  {
    id: 'enceladus-vugger', måne: 'enceladus', række: 'vand', farve: 'målt', fra: 'fontæner',
    titel: 'Månen vugger', hvem: 'Cassini (udgivet 2016)',
    spørgsmål: 'Hvordan ved vi, at havet er under hele isen?',
    svar: 'Enceladus vugger lidt frem og tilbage, mens den kredser om Saturn. Cassinis billeder viste, at den vugger for meget til, at isen kan sidde fast på stenkernen.\n\nSå må isen flyde på et hav, der går hele vejen rundt.',
  },
  {
    id: 'enceladus-salt', måne: 'enceladus', række: 'stoffer', farve: 'målt', fra: 'tavle', selv: true,
    titel: 'Salt', hvem: 'Cassini, 2009',
    forkert: 'Salt er et stof, der er opløst i vandet. Det hører til under Stoffer.',
    spørgsmål: 'Hvordan ved vi, at havet er salt?',
    svar: 'Cassini fangede iskorn fra fontænerne i Saturns tynde E-ring. Nogle af dem var fulde af salt.\n\nSå meget salt kan kun komme med, hvis kornene kommer fra flydende vand, der har rørt ved sten.',
  },
  {
    id: 'enceladus-brint', måne: 'enceladus', række: 'energi', farve: 'målt', fra: 'tavle', selv: true,
    titel: 'Brint', hvem: 'Cassini, 2017',
    forkert: 'Brint giver energi: Mikrober (små levende celler) kan leve af brint. Det hører til under Energi.',
    spørgsmål: 'Hvordan ved vi, at der er energi?',
    svar: 'Cassini fandt brint (hydrogen) i fontænerne. Brinten bliver nok lavet, når varmt vand reagerer med stenen på havbunden.\n\nPå Jorden lever nogle mikrober (små levende celler) af at lade brint reagere med kuldioxid.',
  },
  {
    id: 'enceladus-kulstof', måne: 'enceladus', række: 'stoffer', farve: 'målt', fra: 'tavle', selv: true,
    titel: 'Store stoffer med kulstof', hvem: 'Cassini, 2018',
    forkert: 'Stoffer med kulstof er byggesten. De hører til under Stoffer.',
    spørgsmål: 'Hvordan ved vi, at der er stoffer med kulstof?',
    svar: 'I nogle iskorn fandt Cassini store molekyler med kulstof. Liv på Jorden er bygget af stoffer med kulstof.\n\nMen den slags stoffer kan også blive lavet uden liv, så de er ikke et tegn på liv.',
  },
  {
    id: 'enceladus-fosfat', måne: 'enceladus', række: 'stoffer', farve: 'målt', fra: 'tavle', selv: true,
    titel: 'Fosfat', hvem: 'Cassini (fundet i 2023)',
    forkert: 'Fosfat er en byggesten, som liv bruger i DNA. Det hører til under Stoffer.',
    spørgsmål: 'Hvordan ved vi, at der er fosfat?',
    svar: 'Forskerne fandt fosfat i iskorn fra fontænerne, som Cassini havde fanget. Liv bruger fosfor i DNA og i cellernes energi.\n\nHavet har nok mindst 100 gange mere fosfor end Jordens have. Det er et skøn.',
  },
];

export const kortMed = (id) => KORT.find((k) => k.id === id);

// De kort, der ligger på tavlen efter trinet ('felt', 'fontæner' eller 'tavle'): de tidligere trins kort er der også
const TRIN_RÆKKE = ['felt', 'fontæner', 'tavle'];
export function kortEfter(trin) {
  const n = TRIN_RÆKKE.indexOf(trin);
  return KORT.filter((k) => TRIN_RÆKKE.indexOf(k.fra) <= n);
}

// De fire kort, man selv lægger i trin 4 (de falder ud af Cassini i den rækkefølge)
export const SELV = KORT.filter((k) => k.selv);

// Feltets farve ud fra de kort, der ligger i det: den bedste farve, eller 'ukendt' uden kort. Liv er altid ukendt.
export function feltFarve(kortIFelt, række) {
  if (række === 'liv' || !kortIFelt.length) return 'ukendt';
  for (const f of FARVER) if (kortIFelt.some((k) => k.farve === f.id)) return f.id;
  return 'ukendt';
}

// Hele tavlens farver: { europa: { vand: 'målt', … }, enceladus: { … } } ud fra listen af kort, der er lagt
export function tavlensFarver(lagte) {
  const ud = {};
  for (const m of MÅNER) {
    ud[m.id] = {};
    for (const r of RÆKKER) ud[m.id][r.id] = feltFarve(lagte.filter((k) => k.måne === m.id && k.række === r.id), r.id);
  }
  return ud;
}

// Er kortet lagt på den rigtige række? (Søjlen er altid Enceladus' for de kort, man selv lægger.)
export const rigtigRække = (kort, række) => kort.række === række;
