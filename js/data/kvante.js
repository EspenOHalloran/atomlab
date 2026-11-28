// Kvantefysik (#kvante, del nr. 3 i Atomer): bænken med dobbeltspalten. Modellen og teksterne, uden Three.js, så de kan
// testes i Node (tests/kvante.mjs). Drejebogen: docs/drejebog-kvantefysik.md, afsnit 3, med rettelserne i
// docs/fable/E7-kvantefysik-noter.md. Kilderne står i docs/fakta-kvantefysik.md (afsnit 1, 6, 7 og 8).
//
// Bænken (i bænkens egne enheder): kilden står ved x = KILDE_X, væggen med de to sprækker ved x = 0 og bagvæggen ved
// x = L. Sprækkerne sidder side om side langs z (afstand d mellem midterne, bredden a), og prikkerne lander på
// bagvæggen ved z ∈ [-BAG_HALV, BAG_HALV]. Striberne står lodret på bagvæggen.
//
// Mønstret for bølger (elektroner, lys) er formlen for to smalle sprækker langt fra væggen (Fraunhofer, fakta afsnit 1):
// I(θ) ∝ cos²(π·d·sinθ/λ) · sinc²(π·a·sinθ/λ), hvor sinθ = z/√(z² + L²). Én sprække eller måler: kun sinc² (summen af to
// enkelte mønstre, der ligger oven i hinanden, så det bliver ÉN bred bunke, E7 punkt 1). Kuglerne flyver lige: to bunker
// bag sprækkerne. Tallene er spillets egne (forstørret mange gange), og det siger "Ærligt talt".

export const KILDE_X = -4;
export const KUGLE_X = KILDE_X + 0.66; // kuglerne starter ved rørets munding
export const L = 3.5; // fra væggen med sprækkerne til bagvæggen
export const BAG_HALV = 2.5; // halvdelen af bagvæggens bredde (der, hvor prikkerne kan lande)
export const VÆG_HALV = 2.3; // halvdelen af væggens bredde
export const STRIBE_Y = [0.3, 1.5]; // prikkerne lander mellem disse højder (sprækkernes højde)
export const SPRÆKKE_HØJDE = 1.4; // sprækkerne går fra 0,2 til 1,6

// Standard: 7 lyse striber inden for den brede bunke (d = 4·a), ca. 0,6 mellem dem midt på bagvæggen
// syn: "Målerens lys" (PR 2 af "to steder", 22. november 2026): chancen for, at måleren ser en elektron (1 = alle)
export const STANDARD = { d: 1.0, a: 0.25, fart: 0.6, farve: 0.45, syn: 1 };
export const GRÆNSER = { d: [0.6, 1.6], a: [0.1, 0.45] };
export const SLAGS = ['kugler', 'boelger', 'elektroner', 'lys', 'molekyle', 'klump', 'fodbold'];
// "Større …" (PR 3): et molekyle med ca. 2.000 atomer (Fein m.fl., Nature Physics 15, 1242, 2019), en klump natrium med
// over 7.000 atomer (Pedalino m.fl., Nature 649, 866, januar 2026, arXiv:2507.21211) og en fodbold. Kilderne står i
// docs/fakta-kvantefysik/faktatjek-stoerre.md.
export const STØRRE = ['molekyle', 'klump', 'fodbold'];
// Kugler og fodbolde flyver lige som kugler. Elektroner, lys, molekyler og klumper giver striber (og har måler og bølge).
export const kugleSlags = (s) => s === 'kugler' || s === 'fodbold';
export const kvanteSlags = (s) => s === 'elektroner' || s === 'lys' || s === 'molekyle' || s === 'klump';
export const SPRÆKKER = ['begge', 'venstre', 'højre']; // venstre er z < 0, højre z > 0 (set fra kameraet)

// Spillets bølgelængde. Elektroner: hurtigere giver kortere bølge (λ = h/(m·v)). Lys: blåt (450 nm) til rødt (680 nm),
// skaleret, så grønt (530 nm) giver de samme striber som elektronerne med standardfarten.
const λ_ELEKTRON = [0.27, 0.11]; // fra langsom (0) til hurtig (1)
// Vandet: lange bølger (rettelse 3 efter prøven 28. november 2026), så de stille linjer ligger langt nok fra hinanden til at
// kunne ses og forklares (med standardfarten 0,29: tre lyse og fire mørke striber på bagvæggen)
const λ_VAND = [0.42, 0.2];
// Molekylet og klumpen er tungere, så bølgen er kortere og striberne tættere. I virkeligheden er forskellen langt større:
// klumpernes bølge er ca. 10-22 fm (arXiv:2507.21211), elektronernes i bænkens rigtige forsøg ca. 50 pm.
const λ_STØRRE = { molekyle: 0.12, klump: 0.085 }; // vandets bølger: fra lange (0) til korte (1), ikke kortere, så de kan ses på en telefon
export function bølgelængde(slags, { fart = STANDARD.fart, farve = STANDARD.farve } = {}) {
  if (slags === 'lys') return elektronλ(STANDARD.fart) * nanometer(farve) / 530;
  if (slags === 'boelger') return λ_VAND[0] + (λ_VAND[1] - λ_VAND[0]) * fart;
  if (λ_STØRRE[slags]) return λ_STØRRE[slags];
  return elektronλ(fart);
}
const elektronλ = (fart) => λ_ELEKTRON[0] + (λ_ELEKTRON[1] - λ_ELEKTRON[0]) * fart;
export const nanometer = (farve) => Math.round(450 + 230 * farve);

// Lysets farve for en bølgelængde i nm (til prikkerne), som [r, g, b] fra 0 til 1
export function lysFarve(nm) {
  const stop = [[450, [0.35, 0.45, 1]], [490, [0.2, 0.85, 1]], [530, [0.35, 1, 0.4]], [580, [1, 0.95, 0.25]], [620, [1, 0.55, 0.15]], [680, [1, 0.2, 0.15]]];
  for (let i = 1; i < stop.length; i++) {
    if (nm <= stop[i][0]) {
      const [n0, c0] = stop[i - 1];
      const [n1, c1] = stop[i];
      const t = Math.max(0, (nm - n0) / (n1 - n0));
      return c0.map((c, j) => c + (c1[j] - c) * t);
    }
  }
  return stop[stop.length - 1][1];
}

// Midten af hver åben sprække (z)
export function åbneSprækker(sprækker, d) {
  if (sprækker === 'venstre') return [-d / 2];
  if (sprækker === 'højre') return [d / 2];
  return [-d / 2, d / 2];
}

const sinc2 = (b) => (Math.abs(b) < 1e-6 ? 1 : (Math.sin(b) / b) ** 2);
// En kurve, der går blødt fra 0 til 1 mellem -s og s (til kuglernes bunker, som har skarpe kanter)
const trin = (x, s) => {
  const t = Math.min(1, Math.max(0, (x + s) / (2 * s)));
  return t * t * (3 - 2 * t);
};

// Chancen (ikke normeret) for at lande ved z på bagvæggen
export function intensitet(z, { slags = 'elektroner', sprækker = 'begge', måler = false, d = STANDARD.d, a = STANDARD.a, λ = bølgelængde(slags) } = {}) {
  if (kugleSlags(slags)) {
    // Kuglerne (og fodbolden) flyver lige fra rørets munding: sprækken projiceres ud på bagvæggen
    const f = kugleForstørrelse();
    const h = (a * f) / 2;
    let sum = 0;
    for (const zs of åbneSprækker(sprækker, d)) sum += trin(z - zs * f + h, 0.1) - trin(z - zs * f - h, 0.1);
    return sum;
  }
  const sinθ = z / Math.hypot(z, L);
  const kuvert = sinc2((Math.PI * a * sinθ) / λ);
  if (sprækker !== 'begge' || måler) return kuvert;
  return 2 * Math.cos((Math.PI * d * sinθ) / λ) ** 2 * kuvert;
}

// Hvor meget længere ude end i væggen en kugle lander på bagvæggen (den flyver lige fra rørets munding)
export const kugleForstørrelse = () => (L - KUGLE_X) / -KUGLE_X;

// Det første mørke sted ved siden af midten (til ringen i turens trin 4): d·sinθ = λ/2
export function mørktSted({ d = STANDARD.d, λ = bølgelængde('elektroner') } = {}) {
  const s = λ / (2 * d);
  return (L * s) / Math.sqrt(1 - s * s);
}

// Bølger i vand: et sted på den første stille linje (vejen fra den venstre sprække er en halv bølge længere end fra den
// højre) i afstanden x bag væggen, z > 0. Til skiltet "Top møder dal" på vandet (rettelse 3 efter prøven).
export function stilleSted(x, { d = STANDARD.d, λ = bølgelængde('boelger') } = {}) {
  const f = (z) => Math.hypot(x, z + d / 2) - Math.hypot(x, z - d / 2) - λ / 2;
  let lo = 0, hi = BAG_HALV;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (f(m) < 0) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
}

// De to skilte på vandet, når bølgerne er nået bagvæggen (rettelse 3 efter prøven 28. november 2026)
export const FORKLAR = [
  { id: 'høj', titel: 'Top møder top: høj bølge', tekst: 'Lige langt til begge sprækker' },
  { id: 'stille', titel: 'Top møder dal: stille', tekst: 'En halv bølge længere til den ene sprække' },
];

// Ringen i turens trin 4 tæller prikkerne inden for ±RING_HALV af det mørke sted (hele bagvæggens højde)
export const RING_HALV = 0.08;

// "Vis bølgen" (22. november 2026, docs/plan-kvante-to-steder.md): Hver elektron får en bølgepakke, der løber fra rørets
// munding (BØLGE_START), gennem begge sprækker og ud til bagvæggen. Prikken tændes, når pakken når det sted, hvor den
// lander. Vejen regnes som i vandets shader: frem til væggen og så i en lige linje fra den nærmeste åbne sprække.
export const BØLGE_START = KILDE_X + 0.6;
export const PULS_FART = 4.5; // enheder pr. sekund (ca. 1,6 s til midten af bagvæggen)
export const PULS_BREDDE = 1.2; // pakkens længde (ca. fem bølgetoppe med elektronernes bølgelængde)
// Prikken tændes lidt efter, at fronten er nået stedet (PULS_EFTER), mens lyset på bagvæggen toner ud, så man ser den ene prik.
export const PULS_EFTER = 0.2;
export function pulsTid(z, { sprækker = 'begge', d = STANDARD.d } = {}) {
  const r = Math.min(...åbneSprækker(sprækker, d).map((zs) => Math.hypot(L, z - zs)));
  return (-BØLGE_START + r) / PULS_FART + PULS_EFTER;
}

// Tælleren ved måleren: hvor mange elektroner lamperne fandt ved hver sprække, og hvor mange gange begge blinkede for
// den samme elektron (aldrig: Hver elektron findes ét sted, docs/fakta-kvantefysik/faktatjek-to-steder.md)
// ikkeSet (et tal, når målerens lys er skruet ned): elektroner, måleren ikke så
export function målerTekst([venstre, højre], begge = 0, ikkeSet = null) {
  const ikke = ikkeSet == null ? '' : ` · Ikke set: ${talTekst(ikkeSet)}`;
  return { linje: `Venstre: ${talTekst(venstre)} · Højre: ${talTekst(højre)}${ikke}`, begge: `Begge på én gang: ${talTekst(begge)}` };
}

// En fordeling, man kan trække prikker fra (en tabel over den samlede chance, BIN felter over bagvæggen)
export const BIN = 600;
export function lavFordeling(valg) {
  const kum = new Float64Array(BIN + 1);
  const bredde = (2 * BAG_HALV) / BIN;
  for (let i = 0; i < BIN; i++) kum[i + 1] = kum[i] + intensitet(-BAG_HALV + (i + 0.5) * bredde, valg);
  const total = kum[BIN];
  return {
    total,
    // Et z på bagvæggen ud fra et tilfældigt tal u ∈ [0, 1)
    træk(u) {
      const mål = u * total;
      let lo = 0, hi = BIN;
      while (hi - lo > 1) {
        const m = (lo + hi) >> 1;
        if (kum[m] <= mål) lo = m; else hi = m;
      }
      const inde = (mål - kum[lo]) / Math.max(1e-12, kum[lo + 1] - kum[lo]);
      return -BAG_HALV + (lo + inde) * bredde;
    },
  };
}

// Tilfældige tal med et fast frø (mulberry32), så testene kan regne på mønstret
export function tilfældig(frø = 1) {
  let s = frø >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Prikkerne i felter over bagvæggen (til testene og tælleren)
export function histogram(zer, felter = 60) {
  const h = new Array(felter).fill(0);
  for (const z of zer) {
    const i = Math.floor(((z + BAG_HALV) / (2 * BAG_HALV)) * felter);
    if (i >= 0 && i < felter) h[i]++;
  }
  return h;
}

// Antal toppe i et mønster: felter, der er højere end begge naboer og end en tiendedel af den højeste
export function toppe(h) {
  const top = Math.max(...h);
  let n = 0;
  for (let i = 1; i < h.length - 1; i++) if (h[i] > h[i - 1] && h[i] >= h[i + 1] && h[i] > top * 0.1) n++;
  return n;
}

// Mørke striber inde i den brede bunke: et felt, der er under 40 % af begge sine højeste naboer inden for 'vidde' felter,
// mens bunken selv er over en fjerdedel af toppen
export function mørkeStriber(h, vidde = 4) {
  const top = Math.max(...h);
  let n = 0;
  for (let i = vidde; i < h.length - vidde; i++) {
    const v = Math.max(...h.slice(i - vidde, i));
    const ø = Math.max(...h.slice(i + 1, i + 1 + vidde));
    if (v > top * 0.25 && ø > top * 0.25 && h[i] < 0.4 * Math.min(v, ø)) n++;
  }
  return n;
}

// Tallene på dansk med punktum mellem tusinderne (1.234)
export const talTekst = (n) => Math.round(n).toLocaleString('da-DK');

// ---------- Teksterne (faktatjekket mod docs/fakta-kvantefysik.md, 20. november 2026) ----------
// Højre panel: titel og højst tre sætninger (Retningen). Nøglen er slags, eller slags med 'en' (én sprække) eller
// 'måler' (måleren er tændt).
export const PANEL = {
  kugler: { titel: 'Kugler', tekst: 'Hver kugle flyver lige gennem én af sprækkerne. Den sætter et mærke på bagvæggen lige bag sprækken.' },
  boelger: { titel: 'Bølger i vand', tekst: 'Bølgerne breder sig som ringe fra begge sprækker og mødes bag væggen. Hvor top møder top, bliver bølgen høj, og hvor top møder dal, står vandet stille (de stiplede linjer). Det hedder interferens.' },
  elektroner: { titel: 'Elektroner', tekst: 'Hver elektron lander som én prik ét sted. Men mange prikker danner striber, som kun bølger kan lave.' },
  'elektroner-en': { titel: 'Én sprække åben', tekst: 'Med kun én vej er der ingen anden bølge at mødes med. De mørke striber er væk, og elektronerne lander i én bred bunke.' },
  'elektroner-måler': { titel: 'Måleren er tændt', tekst: 'Måleren finder altid en hel elektron ved én af sprækkerne. Men nu er de mørke striber væk.' },
  lys: { titel: 'Lys', tekst: 'Lys gør det samme som elektronerne: Hver foton lander som én prik, og mange prikker danner striber. Fotonen er hverken en bølge eller en kugle fra hverdagen.' },
  'lys-en': { titel: 'Én sprække åben', tekst: 'Med kun én vej er der ingen anden bølge at mødes med. De mørke striber er væk, og fotonerne lander i én bred bunke.' },
  'lys-måler': { titel: 'Måleren er tændt', tekst: 'Måleren finder altid en hel foton ved én af sprækkerne. Men nu er de mørke striber væk.' },
  // "Større …" (faktatjek i docs/fakta-kvantefysik/faktatjek-stoerre.md)
  molekyle: { titel: 'Molekyler med 2.000 atomer', tekst: 'I 2019 sendte forskere i Wien molekyler med ca. 2.000 atomer gennem gitre, der virker som mange sprækker side om side, og de gav striber. Molekylerne er meget tungere end elektroner, så bølgen er kortere, og striberne ligger tættere.' },
  'molekyle-en': { titel: 'Én sprække åben', tekst: 'Med kun én vej er der ingen anden bølge at mødes med. De mørke striber er væk, og molekylerne lander i én bred bunke.' },
  'molekyle-måler': { titel: 'Måleren er tændt', tekst: 'Måleren finder altid et helt molekyle ved én af sprækkerne. Men nu er de mørke striber væk.' },
  klump: { titel: 'Klumper med over 7.000 atomer', tekst: 'Rekorden er fra januar 2026: klumper af natrium med over 7.000 atomer, ca. 8 nanometer store, gav også striber. Ingen ved endnu, om der er en grænse for, hvor stort noget kan være.' },
  'klump-en': { titel: 'Én sprække åben', tekst: 'Med kun én vej er der ingen anden bølge at mødes med. De mørke striber er væk, og klumperne lander i én bred bunke.' },
  'klump-måler': { titel: 'Måleren er tændt', tekst: 'Måleren finder altid en hel klump ved én af sprækkerne. Men nu er de mørke striber væk.' },
  // λ = h/(m·v) = 6,626 · 10⁻³⁴ / (0,43 · 30) = 5,1 · 10⁻³⁵ m, ca. 10¹⁹ gange mindre end en proton (8,4 · 10⁻¹⁶ m)
  fodbold: { titel: 'En fodbold', tekst: 'En fodbold har også en bølge, men den er ca. 10¹⁹ gange mindre end en atomkerne, så striberne ville ligge alt for tæt til at ses. Og luften og lyset, der rammer bolden, røber hele tiden dens vej, så den lander i to bunker som kuglerne.' },
};
// "Målerens lys" skruet ned (PR 2 af "to steder"): Feynmans tankeforsøg med svagt lys. Med én sprække åben giver både de
// sete og de usete én bred bunke, så teksten om svagere striber gælder kun med begge åbne.
const DELVIS = { elektroner: 'elektronerne', lys: 'fotonerne', molekyle: 'molekylerne', klump: 'klumperne' };
for (const [slags, navn] of Object.entries(DELVIS)) {
  PANEL[`${slags}-delvis`] = {
    titel: 'Måleren ser kun nogle af dem',
    tekst: `Med svagt lys ser måleren kun nogle af ${navn}. De gule prikker er dem, den så, og de giver ingen striber. De andre giver striber, så striberne bliver svagere.`,
  };
}
export function panelNøgle({ slags, sprækker, måler, syn = 1 }) {
  if (kugleSlags(slags) || slags === 'boelger') return slags;
  if (måler) return syn < 1 && sprækker === 'begge' ? `${slags}-delvis` : `${slags}-måler`;
  return sprækker === 'begge' ? slags : `${slags}-en`;
}

// Navnet på det, der lander (tælleren og panelets tal)
export const PRIKKER = { kugler: 'Kugler', elektroner: 'Elektroner', lys: 'Fotoner', molekyle: 'Molekyler', klump: 'Klumper', fodbold: 'Fodbolde' };
const ENTAL = { kugler: 'kugle', elektroner: 'elektron', lys: 'foton', molekyle: 'molekyle', klump: 'klump', fodbold: 'fodbold' };

// Skiltet øverst i midten af scenen (js/kvante/skilt.js, rettelse 1 efter prøven 28. november 2026): hvad der sendes nu,
// en linje, når en sprække er lukket eller måleren tændt, hvor mange der er landet, og tallet i den gule ring (trin 4)
const SKILT_TITEL = {
  kugler: 'Kugler', boelger: 'Bølger i vand', elektroner: 'Elektroner, én ad gangen', lys: 'Lys, én foton ad gangen',
  molekyle: 'Molekyler med 2.000 atomer', klump: 'Klumper med over 7.000 atomer', fodbold: 'Fodbolde',
};
export function skiltTekst({ slags, sprækker = 'begge', måler = false, bølgen = false }) {
  const ekstra = [];
  if (sprækker !== 'begge') ekstra.push(`Kun den ${sprækker} sprække er åben`);
  if (måler && kvanteSlags(slags)) ekstra.push('Måleren er tændt');
  else if (bølgen && kvanteSlags(slags)) ekstra.push('Bølgen er tegnet');
  return { titel: SKILT_TITEL[slags] ?? '', ekstra: ekstra.join(' · ') };
}
// Bølge eller prik (rettelse 7 efter prøven 28. november 2026: "mere klar undervejs at nu ser vi elektronen som bølger og
// hvornår vi ikke gør"): to mærker langs bænkens forkant, ét under vejen og ét under bagvæggen. ikon er 'bølge', 'prik' eller
// 'kugle'. Elektronen tegnes ikke på vej, men delen siger, at den breder sig som en bølge (kernesætningen, fakta-faelder.md:
// "Bølgen går gennem begge sprækker. Elektronen bliver altid fundet ét sted"). Med måler siges kun det målte.
export function visning({ slags, måler = false, bølgen = false }) {
  if (kugleSlags(slags)) return { vej: { ikon: 'kugle', tekst: 'På vejen: en kugle' }, bag: { ikon: 'prik', tekst: 'På bagvæggen: ét mærke' } };
  if (slags === 'boelger') return { vej: { ikon: 'bølge', tekst: 'På vejen: bølger' }, bag: { ikon: 'bølge', tekst: 'Bagvæggen lyser, hvor bølgerne er høje' } };
  const bag = { ikon: 'prik', tekst: 'På bagvæggen: én prik' };
  if (måler) return { vej: { ikon: 'prik', tekst: 'Ved sprækkerne: fundet ét sted' }, bag };
  return { vej: { ikon: 'bølge', tekst: bølgen ? 'På vejen: en bølge (tegnet)' : 'På vejen: en bølge (tegnes ikke)' }, bag };
}

export const tælTekst = (slags, n) => (PRIKKER[slags] ? { tal: talTekst(n), enhed: Math.round(n) === 1 ? ENTAL[slags] : PRIKKER[slags].toLowerCase() } : null);
export const ringTekst = (nu, før = null) => ({ navn: 'I den gule ring:', tal: talTekst(nu), før: før == null ? '' : `(før: ${talTekst(før)})` });

// Skyderen under "Afstand": fart for elektroner, farve for lys, bølgelængde for vandet. Kuglerne har ingen.
export const SKYDER = {
  elektroner: { navn: 'Fart', ender: ['langsom', 'hurtig'] },
  lys: { navn: 'Farve', ender: ['blå', 'rød'] },
  boelger: { navn: 'Bølgelængde', ender: ['lang', 'kort'] },
};

// "Hvorfor?"-kortene i højre panel (js/data/hvorfor.js). Højst fire (Retningen). "To steder" kom 22. november 2026.
export const KVANTE_KORT = ['kvanteToSteder', 'kvanteKigger', 'kvanteHvordan', 'kvanteUsikker'];
