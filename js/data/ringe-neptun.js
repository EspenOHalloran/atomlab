// Neptuns ringe og ringbuer som tal (UN3 i docs/plan-uranus-neptun.md). Uden Three.js.
// Kilder: NSSDC's "Neptunian Rings Fact Sheet" (opdateret 14. oktober 2015) og Wikipedias "Rings of Neptune" (wikitekst
// 8. november 2026, som henviser til Smith m.fl. 1989, Horn m.fl. 1990, Porco 1991, Miner m.fl. 2007 og de Pater m.fl.
// 2005). Se docs/fakta-solsystemet/del6-uranus-og-neptun.md, afsnit 6.
//
// - Ringene er tynde og støvede (20-70 % støv), så de tegnes som Jupiters ringe (støv, der spreder lyset fremad, i
//   js/solsystem/ringe.js). Forfra er de næsten usynlige, i modlys lyser de.
// - Buerne er klumper i Adams-ringen. Deres længdegrader er målt i et system, der følger ringen rundt (fastlagt
//   18. august 1989). Hvor buerne står i forhold til Neptuns skyer i programmet, er derfor valgt af os.
// - Arago-ringens tæthed er ikke målt (en "lille top" i lysstyrken): tegnet.

export const RING_IND = 40000; // km: tekstur og flade begynder (lige inden for Galle-ringen)
export const RING_UD = 64000; // km: lidt uden for Adams-ringen
export const TAU_ENHED = 1e-4; // τ gemmes i tiendetusindedele i teksturen (Galle og Lassell har τ ca. 10⁻⁴)
export const GM = 6.8365e6; // km³/s² (NSSDC)

// Radius (km, midten), bredde (km) og τ. Hvor kilderne giver et interval, bruges midten.
export const RINGE = [
  { navn: 'Galle', r: 41900, bred: 2000, tau: 1e-4 }, // NSSDC, Wikipedia: 41.000-43.000 km
  { navn: 'Le Verrier', r: 53200, bred: 113, tau: 0.0062 }, // Horn m.fl. 1990
  { navn: 'Lassell', r: 55200, bred: 4000, tau: 1e-4 }, // et tyndt lag fra Le Verrier til Arago (53.200-57.200 km)
  { navn: 'Arago', r: 57200, bred: 60, tau: 5e-4 }, // under 100 km bred, τ tegnet
  { navn: 'Adams', r: 62933, bred: 35, tau: 0.011 }, // 15-50 km, τ 0,011 uden for buerne (Horn m.fl. 1990)
];
export const ADAMS = RINGE[4];

// Buerne i Adams-ringen, regnet mod uret (i Neptuns drejeretning) i grader. Voyager 2's tid (1986-1989, Miner m.fl. 2007
// og Porco 1991). Fraternité er den længste og lyseste, Courage den svageste. τ i buerne er 0,03-0,09 (Smith m.fl. 1989),
// fordelt af os efter lysstyrken. NSSDC skriver 0,12.
export const BUER_1989 = [
  { navn: 'Fraternité', fra: 247, til: 257, tau: 0.08 },
  { navn: 'Egalité 1', fra: 261, til: 264, tau: 0.06 },
  { navn: 'Egalité 2', fra: 265, til: 266, tau: 0.06 },
  { navn: 'Liberté', fra: 276, til: 280, tau: 0.05 },
  { navn: 'Courage', fra: 284.5, til: 285.5, tau: 0.03 },
];
// Senest kendt (Keck og Hubble 2002-2003, de Pater m.fl. 2005): Liberté er næsten væk, og Courage er sprunget 8° frem
// til ca. 294°. Nyere målinger kender vi ikke (IAU's navneliste har i 2026 også en bue, der hedder Sincérité, se
// fælderne i faktagrundlaget). Programmet viser disse, når kontakten "Neptun i 1989" er slået fra.
export const BUER_NU = BUER_1989.map((b) => (
  b.navn === 'Liberté' ? { ...b, tau: 0.008 } : b.navn === 'Courage' ? { ...b, fra: 293.5, til: 294.5 } : { ...b }
));

// Omløbstiden i Adams-ringens afstand (Keplers 3. lov) i sekunder: ca. 10,5 timer
export const ADAMS_OMLØB = 2 * Math.PI * Math.sqrt(ADAMS.r ** 3 / GM);

// τ i gennemsnit fra a til b (km), så smalle ringe bevarer τ gange bredde
export function tauMellem(a, b) {
  let sum = 0;
  for (const g of RINGE) {
    const ind = g.r - g.bred / 2, ud = g.r + g.bred / 2;
    sum += g.tau * Math.max(0, Math.min(b, ud) - Math.max(a, ind));
  }
  return sum / (b - a);
}

const FARVE = [1, 0.9, 0.8]; // ringene er rødlige (Wikipedia, Smith m.fl. 1989)

// Til ringTekstur (js/solsystem/ringe.js): n punkter med τ i TAU_ENHED
export function ringProfil(n = 8192) {
  const d = (RING_UD - RING_IND) / n;
  const ud = [];
  for (let i = 0; i < n; i++) ud.push({ tau: tauMellem(RING_IND + i * d, RING_IND + (i + 1) * d) / TAU_ENHED, farve: FARVE });
  return ud;
}
