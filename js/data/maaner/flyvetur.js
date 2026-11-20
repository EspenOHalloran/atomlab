// "Flyv gennem fontænen" (spor Måner, M4, docs/drejebog-maaner.md afsnit 6a): tallene, tætheden i sprøjtet, målerne og
// teksterne. Ren data uden Three.js, så det kan testes i Node (tests/maaner-underisen.mjs). Selve turen (kameraet bag
// Cassini, kornene og styringen) står i js/maaner/flyvetur.js.
// Fakta (tjekket 20. november 2026): Cassinis dybeste dyk gennem sprøjtet var ca. 49 km over sydpolen 28. oktober 2015
// (E21) med ca. 8,5 km/s (JPL og NASA "Enceladus Flyby at a Glance"). Det var på det dyk, gasmåleren (INMS) fandt
// brinten (Waite m.fl. 2017, Science 356:155). Gassen er mest vand. Tæt på kilderne er de store, saltrige korn i
// flertal, målt af støvmåleren (CDA) på tre passager i 2008-2009 (Postberg m.fl. 2011, Nature 474:620). De store stoffer
// med kulstof er målt i korn både i sprøjtet og i E-ringen (Postberg m.fl. 2018, Nature 558:564). Fosfatet er kun fundet
// i korn fra E-ringen (Postberg m.fl. 2023). Fælden: Cassinis LAVESTE forbiflyvning var 25 km (9. oktober 2008), ikke 49.
// Tætheden er en enkel model (en klokke om sydpolens akse, der bliver bredere og tyndere højere oppe), ikke målt.

export const FLYVETUR = {
  højde: { min: 49, max: 300, start: 180 }, // km over sydpolen (49 km: Cassinis dybeste dyk, lavere kan man ikke)
  fra: -700, // km langs banen (0 er lige under sydpolen), hvor turen starter og slutter
  til: 500,
  varighed: 12, // sekunder for en tur gennem sprøjtet
  rigtigFart: 8.5, // km/s (E21)
  // Hvor hurtigt målerne fyldes, hvor sprøjtet er tættest (pr. sekund). Regnet, så én tur under ca. 110 km fylder
  // målerne, og højt oppe skal der to eller tre ture til (et rundt mål: Cassini flyver igennem igen).
  rate: { korn: 0.65, gas: 0.5 },
};

// Hvor meget hurtigere end den rigtige Cassini turen går (ca. 12 gange)
export const spoletFrem = () => (FLYVETUR.til - FLYVETUR.fra) / FLYVETUR.varighed / FLYVETUR.rigtigFart;

// Sprøjtets tæthed (0-1) for korn eller gas, s km fra sydpolens akse og h km over sydpolen. Gassen breder sig mere end
// kornene, og de store korn falder tilbage, så de bliver hurtigere tyndere opad.
export function tæthed(s, h, slags = 'korn') {
  const σ = (slags === 'gas' ? 110 : 80) + 0.5 * h;
  const H = slags === 'gas' ? 200 : 150;
  return Math.exp(-((s / σ) ** 2)) * Math.exp(-(h - FLYVETUR.højde.min) / H);
}

// Fylder målerne { korn, gas } (0-1), når Cassini er s km fra aksen i højden h i dt sekunder
export function fyld(målere, s, h, dt) {
  for (const slags of ['korn', 'gas']) målere[slags] = Math.min(1, målere[slags] + FLYVETUR.rate[slags] * tæthed(s, h, slags) * dt);
  return målere;
}

// Hvor meget én hel tur i den faste højde h fylder måleren (til testen og til at vælge tallene)
export function enTur(h, slags = 'korn') {
  const { fra, til, varighed } = FLYVETUR;
  const skridt = 200;
  let sum = 0;
  for (let i = 0; i < skridt; i++) sum += FLYVETUR.rate[slags] * tæthed(fra + ((i + 0.5) * (til - fra)) / skridt, h, slags) * (varighed / skridt);
  return sum;
}

// Fundene: Når en måler passerer mærket, falder kortet ud på tavlen, og linjen står under scenen.
// (Kortene står i js/data/maaner/tavle.js. Rækkefølgen er den, de kan falde ud i.)
export const FUND = [
  { kort: 'enceladus-salt', måler: 'korn', ved: 0.3, tekst: 'Iskorn: Mange af de store korn er fulde af salt.' },
  { kort: 'enceladus-brint', måler: 'gas', ved: 0.5, tekst: 'Gas: Den er mest vand, men der er også lidt brint.' },
  { kort: 'enceladus-kulstof', måler: 'korn', ved: 0.65, tekst: 'Iskorn: Nogle af dem har store stoffer med kulstof.' },
  { kort: 'enceladus-fosfat', måler: 'korn', ved: 1, tekst: 'Iskorn: Fosfat fandt forskerne i korn fra fontænerne, som Cassini fangede længere ude i Saturns E-ring.' },
];

export const TEKST = {
  knap: '🛰️ Flyv med Cassini',
  lab: '🛰️ Flyv gennem fontænen',
  højde: 'Højde over sydpolen',
  korn: '🧊 Iskorn',
  gas: '💨 Gas',
  styr: '↕ Træk op mod Enceladus for at flyve tættere på.',
  start: 'Cassini flyver ind i sprøjtet. Støvmåleren fanger iskorn, og gasmåleren snuser til gassen.',
  igen: 'Målerne er ikke fulde endnu, så Cassini flyver igennem igen. Den rigtige Cassini fløj også gennem sprøjtet flere gange.',
  bund: 'Lavere end 49 km kom Cassini aldrig gennem sprøjtet.',
  færdig: 'Målerne er fulde. Læg de fire fund på tavlen.',
  færdigLab: 'Målerne er fulde. Cassini fandt salt, brint, store stoffer med kulstof og (i E-ringen) fosfat.',
  vink: 'Træk op mod Enceladus, så Cassini flyver tættere på sydpolen. Jo tættere, jo flere iskorn fanger den.',
};
