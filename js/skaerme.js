// Listen over AtomLabs dele (skærme) og verdener (10a i docs/arkiv/plan-skaermliste.md). Menuen, "Din fremgang" og
// skærmskiftet i main.js bruger den. En skærm hentes med import() og bygges (lav) første gang, den åbnes.
//
// En ny del: en linje i SKÆRME, en sektion med samme id i index.html (og et link i .menukort) og et modul, der
// eksporterer lav, start og stop (og testAdgang til ?test). modul er stien fra denne fil.
// status: 'færdig' eller 'prøve' (prøvet af et barn eller ej, se docs/retning.md). Det vises ikke anderledes endnu (nr. 13).
// html og css er til 10b, når en skærm får sine egne filer (tomme indtil da).
export const SKÆRME = [
  { id: 'vaerksted', verden: 'atomer', titel: 'Atomværkstedet', modul: './vaerksted.js', status: 'færdig' },
  { id: 'system', verden: 'atomer', titel: 'Det periodiske system', modul: './system.js', status: 'færdig' },
  { id: 'fusion', verden: 'kerner', titel: 'Stjerneovnen', modul: './fusion.js', status: 'færdig' },
  { id: 'reaktor', verden: 'kerner', titel: 'Reaktoren', modul: './reaktor.js', status: 'færdig' },
  { id: 'liv', verden: 'ildogliv', titel: 'Liv', modul: './liv.js', status: 'prøve' },
  { id: 'batteri', verden: 'elektricitet', titel: 'Batteriet', modul: './batteri.js', status: 'færdig' },
  { id: 'solsystem', verden: 'rummet', titel: 'Solsystemet', modul: './solsystem.js', status: 'færdig' },
  { id: 'kosmos', verden: 'rummet', titel: 'Kosmos', modul: './kosmos.js', status: 'færdig' },
  { id: 'ordbog', verden: 'biblioteket', titel: 'Ordbogen', modul: './ordbog.js', status: 'færdig' },
];

// Verdenerne i ringens rækkefølge (menuen, js/karrusel.js). dele er delene i SKÆRME med samme verden, i listens rækkefølge.
// motiv er baggrunden bag ringen (js/menubaggrund.js).
export const VERDENER = [
  { id: 'atomer', navn: 'Atomer og molekyler', tekst: 'Byg atomer og molekyler, og mød alle 118 grundstoffer', motiv: 'vaerksted' },
  { id: 'kerner', navn: 'Kernerne', tekst: 'Atomkerner, der smelter sammen i stjernerne eller flækker i en reaktor', motiv: 'fusion' },
  { id: 'ildogliv', navn: 'Ild og liv', motiv: 'liv' },
  { id: 'elektricitet', navn: 'Elektricitet', motiv: 'batteri' },
  { id: 'rummet', navn: 'Rummet', tekst: 'Rejs til planeterne, og se sorte huller og supernovaer', motiv: 'solsystem' },
  { id: 'biblioteket', navn: 'Biblioteket', motiv: 'ordbog' },
].map((v) => ({ ...v, dele: SKÆRME.filter((s) => s.verden === v.id).map((s) => s.id) }));

export const skærmMed = (id) => SKÆRME.find((s) => s.id === id) ?? null;

const løfter = new Map(); // id → løfte om modulet (bygget)
const hentede = new Map(); // id → modulet, når det er hentet og bygget

// Henter og bygger en skærm (én gang). Giver modulet. Fejler hentningen (fx intet net), glemmes løftet, men browseren
// husker selv den mislykkede import(), så i praksis skal siden genindlæses (main.js siger det).
export function hentSkærm(id) {
  let løfte = løfter.get(id);
  if (!løfte) {
    const s = skærmMed(id);
    if (!s) return Promise.reject(new Error(`Ukendt skærm: ${id}`));
    løfte = import(s.modul).then((m) => {
      m.lav();
      hentede.set(id, m);
      return m;
    });
    løfte.catch(() => løfter.delete(id));
    løfter.set(id, løfte);
  }
  return løfte;
}

// Modulet, hvis skærmen er hentet og bygget, ellers null
export const hentetSkærm = (id) => hentede.get(id) ?? null;
