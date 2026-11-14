// Rejsen i tid (tvillingerejsen): regningen uden Three.js, så den kan testes i Node (tests/tid.mjs).
// Tallene og kilderne står i docs/fakta-tid.md (afsnit 2, 4, 5, 6, 7 og 13), og udregningerne i docs/fakta-tid/regn.py.
//
// Farten gives som antallet af 9-taller n: 90 % (n = 1), 99 % (n = 2) … 99,9999 % (n = 6). Så er 1 − v/c = ε = 10⁻ⁿ,
// og trinnet n = 0 er halv lysfart, 50 % (ε = 0,5, Fables drejebog E4 trin A3: "det sker først tæt på lysets fart"),
// og gammafaktoren regnes som γ = 1/√(ε(2 − ε)). Det er det samme som 1/√(1 − v²/c²), men med 14 ni-taller (T2) ville
// v/c = 0,99999999999999 give for store afrundingsfejl i 1 − v², og ved 16 ni-taller bliver det 1 i computeren.

export const DAGE_PR_ÅR = 365.25; // et lysår er den vej, lyset går på 365,25 døgn (fakta-tid.md, øverst)
export const START_ALDER = 13; // du og din tvilling er begge 13 år ved afgang (jeres svar 3)
export const TVILLING_GRÆNSE = 100; // op til ca. 100 år står tvillingens alder (jeres svar 3)

// Målene (fakta-tid.md, afsnit 4, de samme tal som i regn.py). Alpha Centauri: parallaksen 750,81 mas giver
// 1,3319 pc = 4,344 lysår. TRAPPIST-1 (en lille, rød stjerne med syv kendte planeter): Gaia DR3 (source_id
// 2635476908753563008, slået op i Gaia-arkivet 12. november 2026) har parallaksen 80,2123 ± 0,0716 mas, som giver
// 12,467 pc = 40,66 ± 0,04 lysår. Ved 99,99 % er tvillingen 94, når du lander (E4, trin A1). Mælkevejens centrum (Sgr A*): 8,277 kpc = 26.996 lysår (GRAVITY 2023). Andromeda: ca. 2,5 mio.
// lysår (765 kpc). kort står på knappen og skyderen, afstand i scenen og ved i "Ude ved …".
export const MÅL = {
  alpha: { navn: 'Alpha Centauri', kort: 'Alpha Centauri', ved: 'Alpha Centauri', lysår: 4.344, afstand: 'ca. 4,3 lysår' },
  trappist: { navn: 'TRAPPIST-1', kort: 'TRAPPIST-1', ved: 'TRAPPIST-1', lysår: 40.66, afstand: 'ca. 41 lysår' },
  centrum: { navn: 'Mælkevejens centrum', kort: 'Mælkevejens centrum', ved: 'Mælkevejens centrum', lysår: 26996, afstand: 'ca. 27.000 lysår' },
  andromeda: { navn: 'Andromedagalaksen', kort: 'Andromeda', ved: 'Andromedagalaksen', lysår: 2.5e6, afstand: 'ca. 2,5 mio. lysår' },
};
export const MÅL_RÆKKE = ['alpha', 'trappist', 'centrum', 'andromeda']; // rækkefølgen på kontakterne (efter afstand)
export const START_MÅL = 'trappist'; // den første rejse (jeres svar 12. november 2026, E4-noter)

// Skyderen: fra 50 % (trin 0) og 90 % (1 ni-tal) til 14 ni-taller (γ ≈ 7,1 mio., jeres svar 4)
export const MINDST_NI = 0;
export const FLEST_NI = 14;

export const epsilon = (n) => (n === 0 ? 0.5 : 10 ** -n); // 1 − v/c
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

// Farten som tekst: n = 0 → "50 %", n = 4 → "99,99 %". Over 6 ni-taller kan man ikke tælle dem, så der står fx "99,9…9 % (12 ni-taller)".
export const fartTekst = (n) => (n === 0 ? '50 %' : n === 1 ? '90 %' : n === 2 ? '99 %' : n <= 6 ? `99,${'9'.repeat(n - 2)} %` : `99,9…9 % (${n} ni-taller)`);

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
  const sek = dage * 86400;
  if (sek < 90) return `${Math.max(1, Math.round(sek))} sekunder`; // 14 ni-taller til Alpha Centauri: ca. 39 sekunder
  if (sek < 3570) return `${Math.round(sek / 60)} minutter`; // fra 59,5 minutter står der "1 time", ikke "60 minutter"
  if (dage < 1) {
    const timer = Math.round(dage * 24);
    return timer === 1 ? '1 time' : `${timer} timer`;
  }
  if (dage < 10) return `${tal(dage, 1).replace(/,0$/, '')} dage`;
  if (år < 1) return `${tal(Math.round(dage))} dage`;
  if (år < 10) return `${tal(år, 1)} år`;
  return `${rundTal(år)} år`;
}

// Et stort tal: under 10.000 hele tal, så 3 betydende cifre (53.996 → "54.000") og over en million "5,0 mio."
export function rundTal(x) {
  if (x >= 1e6) return `${tal(x / 1e6, x < 1e7 ? 1 : 0)} mio.`;
  if (x >= 1e4) {
    const trin = 10 ** (Math.floor(Math.log10(x)) - 2);
    return tal(Math.round(x / trin) * trin);
  }
  return tal(Math.round(x));
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

// De tegnede figurer ved hjemkomsten (js/kosmos/tidfigur.js, E4 trin A1): 'ung' under 20, 'voksen' fra 20 til 59 og
// 'gammel' fra 60. null over TVILLING_GRÆNSE (så står kun teksten).
export function figurSlags(alder) {
  if (alder === null || alder > TVILLING_GRÆNSE) return null;
  return alder < 20 ? 'ung' : alder < 60 ? 'voksen' : 'gammel';
}

// "Dit ur" (tiden i skibet siden afgang, tæller op som et ur): "3 dage 7 timer" eller "4 år 75 dage". kort = turen tager
// under en dag (fra 7 ni-taller til Alpha Centauri), så står der timer og minutter: "2 timer 13 min"
const flertal = (x, en, flere) => `${tal(x)} ${x === 1 ? en : flere}`;
export function ditUr(år, kort = false) {
  if (kort && år * DAGE_PR_ÅR < 1) {
    const min = Math.floor(år * DAGE_PR_ÅR * 1440 + 1e-9);
    return `${flertal(Math.floor(min / 60), 'time', 'timer')} ${min % 60} min`;
  }
  if (år < 1) {
    const timer = Math.floor(år * DAGE_PR_ÅR * 24 + 1e-9);
    return `${flertal(Math.floor(timer / 24), 'dag', 'dage')} ${flertal(timer % 24, 'time', 'timer')}`;
  }
  const hele = Math.floor(år + 1e-9);
  if (hele >= 1000) return `${tal(hele)} år`; // fx "2.421.783 år" (med dagene bliver det for bredt på telefonen)
  return `${tal(hele)} år ${flertal(Math.floor((år - hele) * DAGE_PR_ÅR + 1e-9), 'dag', 'dage')}`;
}

// "Jordens ur" som årstal: år 2026 + tiden på Jorden
export const jordÅrstal = (startÅr, jordÅr) => Math.floor(startÅr + jordÅr + 1e-9);
// Årstallet som tekst: "2026" uden punktum, men "56.018" og "5.002.026" med (som man skriver årstal på dansk)
export const årstalTekst = (år) => (år < 10000 ? String(år) : tal(år));

// Hvor mange dage der går på Jorden for hver dag i skibet (tabellen i fakta-tid.md, afsnit 2): "2,3", "71", "707"
export function dagePåJorden(n) {
  const g = gamma(n);
  return g < 10 ? tal(g, 1) : tal(Math.round(g));
}

// "For hver dag i skibet går der ca. … på Jorden": dage op til 1.000, så år (fx "19.400 år" ved 14 ni-taller)
export function prDagTekst(g) {
  return g < 1000 ? `${g < 10 ? tal(g, 1) : tal(Math.round(g))} dage` : varighed(g / DAGE_PR_ÅR);
}

// En afstand i lysår med 2 betydende cifre under 100 (som i fakta-tid.md, afsnit 5): 1,9, 0,61, 0,0061, 38, 3.500
export function lysårTekst(x) {
  if (x >= 100) return `${rundTal(x)} lysår`;
  if (x < 0.001) {
    // Under en tusindedel lysår står det i km (1 lysår = 9,4607 billioner km): 14 ni-taller til Alpha Centauri giver 5,8 mio. km
    const km = x * 9.4607e12;
    if (km >= 1e9) return `${tal(km / 1e9, km < 1e10 ? 1 : 0)} mia. km`;
    if (km >= 1e6) return `${tal(km / 1e6, km < 1e7 ? 1 : 0)} mio. km`;
    return `${rundTal(km)} km`;
  }
  const d = Math.max(0, 1 - Math.floor(Math.log10(x)));
  return `${tal(x, d)} lysår`;
}

// ---------- "1 g hele vejen" (fakta-tid.md, afsnit 6) ----------
// Skibet speeder op med 1 g til midtvejs og bremser med 1 g resten. Med c/a = K år og c²/a = K lysår (a = 9,80665 m/s²):
// efter tiden s i skibet (fra start, i år) er γ = cosh(s/K), tiden på Jorden K·sinh(s/K) og vejen K·(cosh(s/K) − 1).
export const K = 299792458 / 9.80665 / (DAGE_PR_ÅR * 86400); // c/a i år = c²/a i lysår, ca. 0,9687

// Én vej over afstanden d: tiden i skibet og på Jorden og den største γ (midtvejs)
export function enG(lysår) {
  const top = 1 + lysår / (2 * K);
  return {
    skibÅr: 2 * K * Math.acosh(top),
    jordÅr: 2 * K * Math.sqrt(top * top - 1),
    gamma: top,
  };
}

// Hvor skibet er, når der er gået s år i skibet på én vej: { jordÅr, pos (lysår fra start), gamma, fart (v/c) }
export function enGUndervejs(lysår, s) {
  const r = enG(lysår);
  const h = r.skibÅr / 2;
  const sp = Math.min(Math.max(s, 0), r.skibÅr);
  const t = sp <= h ? sp : r.skibÅr - sp; // tiden fra den nærmeste ende (bremsningen er speedningen baglæns)
  const gamma = Math.cosh(t / K);
  const jord = K * Math.sinh(t / K);
  const vej = K * (gamma - 1);
  return {
    jordÅr: sp <= h ? jord : r.jordÅr - jord,
    pos: sp <= h ? vej : lysår - vej,
    gamma,
    fart: Math.tanh(t / K),
  };
}

// En fart ud fra γ som tekst: "95 %", eller med ni-taller, når den er tæt på lyset: "99,9…9 % (8 ni-taller)".
// 1 − v/c regnes som (1/γ²)/(1 + v), så den ikke bliver 0 i computeren.
export function fartFraGamma(g) {
  const v = Math.sqrt(Math.max(0, 1 - 1 / (g * g)));
  const e = 1 / (g * g) / (1 + v);
  const n = Math.floor(-Math.log10(e) + 1e-9);
  if (n < 2) return `${tal(Math.floor(v * 100))} %`;
  return fartTekst(n);
}

// ---------- Sammenligninger med fortiden (fakta-tid.md, afsnit 13, "ca. år siden" regnet fra 2026) ----------
// Hjemkomsten vælger den største, der er mindre end tiden på Jorden ("længere tid end siden …"). Ved et spænd står det
// største tal (Jellingstenen 960'erne, Tollundmanden 405 f.Kr., pyramiden 2600 f.Kr., Lascaux 22.000, Jebel Irhoud 315.000),
// så "længere end" altid passer. Solvognen (ca. 1400 f.Kr., 1500-1300 f.Kr.) er udeladt: Egtvedpigen har samme alder og er
// dateret præcist (årringe). Fra Alpha Centauri bliver det et menneskeliv, så i praksis bruges kun neandertalerne og Lucy.
export const FORTIDEN = [
  [1070, 'Harald Blåtand rejste den store Jellingsten'],
  [1233, 'vikingerne angreb klostret på Lindisfarne'],
  [2430, 'Tollundmanden døde'],
  [3400, 'Egtvedpigen blev begravet'],
  [4630, 'den store pyramide i Giza blev bygget'],
  [11700, 'den sidste istid sluttede'],
  [22000, 'hulemalerierne i Lascaux blev malet'],
  [40000, 'de sidste neandertalere levede'],
  [315000, 'de ældste kendte mennesker som os levede'],
  [3.2e6, 'vores slægtning Lucy levede'],
];
export function fortiden(jordÅr) {
  let valgt = null;
  for (const [år, tekst] of FORTIDEN) if (år < jordÅr) valgt = tekst;
  return valgt;
}

// Du er ældre end et menneske kan blive (over ca. 100 år) ved hjemkomsten
export const forGammel = (skibÅr) => START_ALDER + skibÅr > TVILLING_GRÆNSE;

// Hjemkomstens tider: Fra 10 til 100 år står én decimal, rundet ned som alderen (Fables F10 i E4): 11,59 år er "11,5 år"
// og ikke "12 år", så "11,5 år" og "Du er 24 år og 215 dage" passer sammen. Ellers som varighed().
function hjemTid(år) {
  if (år < 10 || år >= 100) return varighed(år);
  return `${tal(Math.floor(år * 10 + 1e-9) / 10, 1).replace(/,0$/, '')} år`;
}

// Teksten ved hjemkomsten (underteksten, under ca. 160 tegn, pointen først). skibÅr og jordÅr er hele rejsen.
// Over ca. 100 år står årstallet, en sammenligning med fortiden og en kort, rolig linje om tvillingen.
export function hjemkomst(skibÅr, jordÅr, startÅr) {
  const tvilling = tvillingAlder(jordÅr);
  const årstal = årstalTekst(jordÅrstal(startÅr, jordÅr));
  if (forGammel(skibÅr)) {
    return `Turen tog ${varighed(skibÅr)} for dig. Så længe kan ingen leve, så du ville ikke nå hjem. På Jorden er det år ${årstal}.`;
  }
  if (tvilling !== null) {
    return `Du har været væk i ${hjemTid(skibÅr)}, men på Jorden er der gået ${hjemTid(jordÅr)}. Du er ${alderTekst(START_ALDER + skibÅr)}. Din tvilling er ${tvilling}.`;
  }
  const før = fortiden(jordÅr);
  const mellem = før ? `Der er gået længere tid end siden ${før}.` : `Der er gået ca. ${varighed(jordÅr)}.`;
  return `Du har været væk i ${varighed(skibÅr)}. På Jorden er det år ${årstal}. ${mellem} Din tvilling levede et langt liv.`;
}

// ---------- Lysuret (forklaret trin for trin, jeres ønske 8. november 2026) ----------
// Lysuret har sin egen fart, for ved rejsens farter (99,99 %) ville spejlene fare mange gange hen over billedet for
// hvert tik. Ved 86,6 % (√3/2) er γ = 2: Den skrå vej er præcis 2 gange så lang som den lige vej. Vist som "87 %".
export const LYSUR_FARTER = [0, 0.5, Math.sqrt(3) / 2, 0.95, 0.99];
export const LYSUR_START = 2; // 87 %
export const lysurGamma = (v) => 1 / Math.sqrt(1 - v * v);
export const lysurFartTekst = (v) => `${tal(Math.round(v * 100))} %`;
// Farter lægges sammen (Einstein, "Hvorfor går tiden langsommere?", scene 1): w = (u + v)/(1 + u·v/c²) i andele af
// lysets fart. 50 % + 50 % giver 80 %, og med lyset (u = 1) giver det altid 1.
export const læggesSammen = (u, v) => (u + v) / (1 + u * v);

// "Hurtigere end lyset?": Set fra Jorden er turen én vej (jordÅr) lidt længere end lysets (lysår), så et lysglimt, der
// blev sendt af sted samtidig med skibet, kommer kun forspringet før. Ved 99,99 % til Alpha Centauri: knap 4 timer.
export const forspring = (lysår, jordÅr) => Math.max(0, jordÅr - lysår);
// Forspringet som tekst: "knap 4 timer" bliver "4 timer", og under et sekund (14 ni-taller) "under et sekund"
export function forspringTekst(lysår, jordÅr) {
  const år = forspring(lysår, jordÅr);
  return år * DAGE_PR_ÅR * 86400 < 1 ? 'under et sekund' : varighed(år);
}
