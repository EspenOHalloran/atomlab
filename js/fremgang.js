// Gemmer, hvad man har klaret: løste opgaver, opdagede grundstoffer og forløb (js/forloeb.js).
// Det ligger i browserens localStorage under nøglen 'atomlabFremgang'.

const NØGLE = 'atomlabFremgang';

let data = hent();

function hent() {
  try {
    const gemt = JSON.parse(localStorage.getItem(NØGLE));
    if (gemt && typeof gemt === 'object') {
      return { opgaver: gemt.opgaver || {}, opdaget: Array.isArray(gemt.opdaget) ? gemt.opdaget : [], forløb: gemt.forløb || {} };
    }
  } catch {
    // ødelagte data: start forfra
  }
  return { opgaver: {}, opdaget: [], forløb: {} };
}

function gem() {
  try {
    localStorage.setItem(NØGLE, JSON.stringify(data));
  } catch {
    // ingen lagring (fx privat vindue): fremgangen gælder kun, til siden lukkes
  }
}

export function erOpdaget(nr) {
  return data.opdaget.includes(nr);
}

// Giver true, hvis grundstoffet er nyt
export function opdag(nr) {
  if (erOpdaget(nr)) return false;
  data.opdaget.push(nr);
  gem();
  return true;
}

export function antalOpdaget() {
  return data.opdaget.length;
}

export function erLøst(id) {
  return Boolean(data.opgaver[id]);
}

// Giver true, hvis opgaven ikke var løst før
export function løs(id) {
  if (erLøst(id)) return false;
  data.opgaver[id] = Date.now();
  gem();
  return true;
}

export function antalLøste(ider) {
  return ider.filter(erLøst).length;
}

// Starter forfra med opgaverne (de opdagede grundstoffer beholdes)
// Nulstiller kun én dels opgaver ("Start forfra" i delen)
export function nulstilDel(ider) {
  for (const id of ider) delete data.opgaver[id];
  gem();
}

export function nulstilOpgaver() {
  data.opgaver = {};
  gem();
}

export function nulstilFremgang() {
  data = { opgaver: {}, opdaget: [], forløb: {} };
  gem();
  try {
    localStorage.removeItem('atomlabKosmosSet'); // de fænomener, man har set i Kosmos
    localStorage.removeItem('atomlabSolsystemSet'); // og i Solsystemet
  } catch {
    // ingen lagring
  }
}

// ---------- Forløb (js/forloeb.js) ----------
// forløb[id] = { taget, sprunget }: taget = gennemført til "Det så du" (✓ i "Din fremgang"), sprunget = "Spring over".
// Med ingen af dem starter forløbet af sig selv, når man åbner delen. Tallene er tidspunkter.
export function forløbTaget(id) {
  return Boolean(data.forløb[id]?.taget);
}

export function forløbSprunget(id) {
  return Boolean(data.forløb[id]?.sprunget);
}

// hvad: 'taget' eller 'sprunget'
export function markérForløb(id, hvad) {
  const f = (data.forløb[id] ??= {});
  f[hvad] ??= Date.now();
  gem();
}
