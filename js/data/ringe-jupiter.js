// Jupiters ringe som tal (J5 i docs/plan-jupiter.md): grænserne og den optiske dybde τ i hver afstand fra Jupiters midte.
// Fra NSSDC's "Jupiter Rings Fact Sheet" (docs/fakta-solsystemet.md, del 5 punkt 8). Ringene er fint, mørkt støv og så
// tynde (τ ca. 5 · 10⁻⁶), at de næsten kun ses i modlys. Kanterne er glattet af os, og formen inde i hver ring er
// forenklet. Tegnes af js/solsystem/ringe.js (støv, der spreder lyset fremad). Uden Three.js, så det kan testes i Node.

export const RING_IND = 89400; // km: glorien (halo) begynder
export const RING_UD = 280000; // km: Thebe-ringens svage forlængelse slutter
export const TAU_ENHED = 1e-6; // τ gemmes i milliontedele, så de små tal kan ligge i en tekstur

// Ringene (km fra Jupiters midte), τ og tykkelse (NSSDC)
export const RINGE = [
  { navn: 'Glorien', ind: 89400, ud: 123000, tau: 3e-6, tyk: 10000 },
  { navn: 'Hovedringen', ind: 123000, ud: 128940, tau: 5e-6, tyk: 100 },
  { navn: 'Amalthea-ringen', ind: 128940, ud: 181350, tau: 1e-7, tyk: 2600 },
  { navn: 'Thebe-ringen', ind: 181350, ud: 221900, tau: 1e-7, tyk: 8800 },
];
// Thebe-ringens svage forlængelse til 280.000 km. NSSDC giver ingen τ. Vi har sat den til en tredjedel af Thebe-ringen.
const FORLÆNGELSE = { ind: 221900, ud: 280000, tau: 3e-8 };

const glat = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const FARVE = [0.82, 0.68, 0.55]; // svagt rødbrunt støv (tegnet)

// Optisk dybde i afstanden r (km). Glorien bliver tyndere indad, hovedringen er tættest ved sin ydre kant og har en skarp
// kant ved Adrastea (128.940 km), og de to tynde ringe slutter ved Amalthea og Thebe.
export function tauVed(r) {
  if (r < RING_IND || r > RING_UD) return 0;
  const [glorie, hoved, amalthea, thebe] = RINGE;
  let tau = 0;
  tau += glorie.tau * glat(glorie.ind, glorie.ud, r) * (1 - glat(hoved.ud - 400, hoved.ud + 200, r));
  tau += (hoved.tau - glorie.tau) * glat(hoved.ind, hoved.ind + 2500, r) * (1 - glat(hoved.ud - 300, hoved.ud + 100, r));
  tau += amalthea.tau * glat(hoved.ud - 300, hoved.ud + 300, r) * (1 - glat(amalthea.ud - 1500, amalthea.ud + 500, r));
  tau += thebe.tau * glat(thebe.ind - 1000, thebe.ind + 1000, r) * (1 - glat(thebe.ud - 2000, thebe.ud + 500, r));
  tau += FORLÆNGELSE.tau * glat(FORLÆNGELSE.ind - 2000, FORLÆNGELSE.ind, r) * (1 - glat(FORLÆNGELSE.ud - 15000, FORLÆNGELSE.ud, r));
  return tau;
}

// Alle punkterne (til teksturen i ringe.js): τ i milliontedele og farven, n punkter fra RING_IND til RING_UD
export function ringProfil(n = 4096) {
  const ud = [];
  for (let i = 0; i < n; i++) ud.push({ tau: tauVed(RING_IND + ((i + 0.5) / n) * (RING_UD - RING_IND)) / TAU_ENHED, farve: FARVE });
  return ud;
}
