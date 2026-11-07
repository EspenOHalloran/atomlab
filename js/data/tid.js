// Rejsen i tid (tvillingerejsen): regningen uden Three.js, så den kan testes i Node (tests/tid.mjs).
// Tallene og kilderne står i docs/fakta-tid.md (afsnit 2, 4 og 5), og udregningerne i docs/fakta-tid/regn.py.
//
// Farten gives som antallet af 9-taller n: 90 % (n = 1), 99 % (n = 2) … 99,9999 % (n = 6). Så er 1 − v/c = ε = 10⁻ⁿ,
// og gammafaktoren regnes som γ = 1/√(ε(2 − ε)). Det er det samme som 1/√(1 − v²/c²), men med 14 ni-taller (T2) ville
// v/c = 0,99999999999999 give for store afrundingsfejl i 1 − v², og ved 16 ni-taller bliver det 1 i computeren.

export const DAGE_PR_ÅR = 365.25; // et lysår er den vej, lyset går på 365,25 døgn (fakta-tid.md, øverst)
export const START_ALDER = 13; // du og din tvilling er begge 13 år ved afgang (jeres svar 3)
export const TVILLING_GRÆNSE = 100; // op til ca. 100 år står tvillingens alder (jeres svar 3)

// Målene. I T1 kun Alpha Centauri: parallaksen 750,81 mas giver 1,3319 pc = 4,344 lysår (fakta-tid.md, afsnit 4).
export const MÅL = {
  alpha: { navn: 'Alpha Centauri', lysår: 4.344 },
};

// Skyderen: fra 90 % (1 ni-tal) til 99,9999 % (6 ni-taller) i T1. T2 går op til 14.
export const MINDST_NI = 1;
export const FLEST_NI = 6;

export const epsilon = (n) => 10 ** -n; // 1 − v/c
export const fart = (n) => 1 - epsilon(n); // v/c
export function gamma(n) {
  const e = epsilon(n);
  return 1 / Math.sqrt(e * (2 - e));
}

// Danske tal: komma som decimaltegn og punktum mellem tusinder (fx 2.294,5)
export function tal(x, decimaler = 0) {
  const s = Math.abs(x).toFixed(decimaler);
  const [hel, dec] = s.split('.');
  const medPunktum = hel.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (x < 0 ? '−' : '') + medPunktum + (dec ? ',' + dec : '');
}

// Farten som tekst: n = 4 → "99,99 %"
export const fartTekst = (n) => (n === 1 ? '90 %' : n === 2 ? '99 %' : `99,${'9'.repeat(n - 2)} %`);

// γ som tekst med 3-4 betydende cifre (som i tabellen i fakta-tid.md): 2,294, 7,089, 22,37, 70,71, 223,6, 707,1
export function gammaTekst(g) {
  if (g < 10) return tal(g, 3);
  if (g < 100) return tal(g, 2);
  if (g < 1000) return tal(g, 1);
  return tal(g, 0);
}

// Rejsen med fast fart ud og hjem (ingen tid til at speede op, vende og bremse, fakta-tid.md, afsnit 5):
// Jordens tid = 2d/v, skibets tid = Jordens tid/γ. Alle tider i år.
export function rejse(lysår, n) {
  const g = gamma(n);
  const ud = lysår / fart(n); // år på Jorden for én vej
  return {
    gamma: g,
    jordÅr: 2 * ud,
    skibÅr: (2 * ud) / g,
    ud: { jordÅr: ud, skibÅr: ud / g },
    afstandFraSkibet: lysår / g, // længdeforkortelsen (bruges i T2)
  };
}

// Et tidsrum som tekst til underteksterne og panelet: "18 timer", "4,5 dage", "45 dage", "4,2 år", "54.000 år"
export function varighed(år) {
  const dage = år * DAGE_PR_ÅR;
  if (dage < 1) {
    const timer = Math.round(dage * 24);
    return timer === 1 ? '1 time' : `${timer} timer`;
  }
  if (dage < 10) return `${tal(dage, 1).replace(/,0$/, '')} dage`;
  if (år < 1) return `${tal(Math.round(dage))} dage`;
  if (år < 10) return `${tal(år, 1)} år`;
  return `${tal(Math.round(år))} år`;
}

// Hele år og dage: 0,1229 år → { år: 0, dage: 45 }. Dagene rundes, og 365 dage og derover bliver et år mere.
export function årOgDage(år) {
  let hele = Math.floor(år);
  let dage = Math.round((år - hele) * DAGE_PR_ÅR);
  if (dage >= 365) { hele += 1; dage = 0; }
  return { år: hele, dage };
}

// En alder som tekst: "13 år og 45 dage" (eller "17 år" lige på dagen)
export function alderTekst(år) {
  const a = årOgDage(år);
  return a.dage ? `${tal(a.år)} år og ${a.dage === 1 ? '1 dag' : `${a.dage} dage`}` : `${tal(a.år)} år`;
}

// Tvillingens alder i hele år, eller null, når der er gået mere end et menneskeliv (over ca. 100 år gammel)
export function tvillingAlder(jordÅr) {
  const alder = Math.floor(START_ALDER + jordÅr);
  return alder <= TVILLING_GRÆNSE ? alder : null;
}

// "Dit ur" (tiden i skibet siden afgang, tæller op som et ur): "3 dage 7 timer" eller "4 år 75 dage"
const flertal = (x, en, flere) => `${tal(x)} ${x === 1 ? en : flere}`;
export function ditUr(år) {
  if (år < 1) {
    const timer = Math.floor(år * DAGE_PR_ÅR * 24 + 1e-9);
    return `${flertal(Math.floor(timer / 24), 'dag', 'dage')} ${flertal(timer % 24, 'time', 'timer')}`;
  }
  const hele = Math.floor(år + 1e-9);
  return `${tal(hele)} år ${flertal(Math.floor((år - hele) * DAGE_PR_ÅR + 1e-9), 'dag', 'dage')}`;
}

// "Jordens ur" som årstal: år 2026 + tiden på Jorden
export const jordÅrstal = (startÅr, jordÅr) => Math.floor(startÅr + jordÅr + 1e-9);

// Hvor mange dage der går på Jorden for hver dag i skibet (tabellen i fakta-tid.md, afsnit 2): "2,3", "71", "707"
export function dagePåJorden(n) {
  const g = gamma(n);
  return g < 10 ? tal(g, 1) : tal(Math.round(g));
}

// Teksten ved hjemkomsten (underteksten, under ca. 160 tegn, pointen først). skibÅr og jordÅr er hele rejsen.
// Over ca. 100 år står årstallet og en kort, rolig linje om tvillingen. Sammenligningen med fortiden kommer i T2.
export function hjemkomst(skibÅr, jordÅr, startÅr) {
  const tvilling = tvillingAlder(jordÅr);
  const årstal = tal(jordÅrstal(startÅr, jordÅr));
  if (tvilling !== null) {
    return `Du har været væk i ${varighed(skibÅr)}, men på Jorden er der gået ${varighed(jordÅr)}. Du er ${alderTekst(START_ALDER + skibÅr)}. Din tvilling er ${tvilling}.`;
  }
  return `Du har været væk i ${varighed(skibÅr)}, men på Jorden er det nu år ${årstal}. Din tvilling levede et langt liv, mens du var væk.`;
}
