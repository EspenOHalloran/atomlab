// Fænomenerne i Kosmos og Solsystemet som id'er, så menuen kan tælle "x af y set" uden at hente skærmene (10a).
// Rækkefølgen er den samme som i js/kosmos.js og js/solsystem.js. Testen skaermliste.mjs tjekker, at listerne passer.

export const FÆNOMEN_IDER = {
  kosmos: ['bigbang', 'stjernefoedsel', 'hviddvaerg', 'supernova', 'pulsar', 'kilonova', 'rumtid', 'tid', 'tidhvorfor', 'tyngdebolger', 'sorthul', 'kvasar', 'ormehul'],
  solsystem: ['solen', 'solstorm', 'solensfremtid', 'venus', 'jorden', 'aarstider', 'formoerkelser', 'mars', 'jupiter', 'saturn', 'uranus', 'neptun'],
};

// Hvor hver skærm gemmer det valgte fænomen og dem, man har set (docs/kode/gemte-data.md)
export const NØGLER = {
  kosmos: { valgt: 'atomlabKosmos', set: 'atomlabKosmosSet' },
  solsystem: { valgt: 'atomlabSolsystem', set: 'atomlabSolsystemSet' },
};

// De fænomener, man har set på en skærm (en tom liste, hvis intet er gemt)
export function setFænomener(skærm) {
  try {
    return JSON.parse(localStorage.getItem(NØGLER[skærm].set)) || [];
  } catch {
    return [];
  }
}

// Fænomenerne lå i Kosmos før 26. oktober 2026. Det, man har set og sidst valgt, flytter med til Solsystemet.
// Køres ved start (main.js), før menuen tæller, hvad man har set.
export function flytGemt() {
  const ider = new Set(FÆNOMEN_IDER.solsystem);
  try {
    const k = NØGLER.kosmos;
    const s = NØGLER.solsystem;
    const kosmosSet = JSON.parse(localStorage.getItem(k.set) || '[]');
    const flyttes = kosmosSet.filter((id) => ider.has(id));
    if (flyttes.length) {
      const solSet = new Set(JSON.parse(localStorage.getItem(s.set) || '[]'));
      for (const id of flyttes) solSet.add(id);
      localStorage.setItem(s.set, JSON.stringify([...solSet]));
      localStorage.setItem(k.set, JSON.stringify(kosmosSet.filter((id) => !ider.has(id))));
    }
    const sidst = localStorage.getItem(k.valgt);
    if (ider.has(sidst)) {
      if (!localStorage.getItem(s.valgt)) localStorage.setItem(s.valgt, sidst);
      localStorage.removeItem(k.valgt); // Kosmos starter så på Big Bang
    }
  } catch {
    // ingen lagring
  }
}
