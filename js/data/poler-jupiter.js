// Junos cykloner ved Jupiters poler (J5 i docs/plan-jupiter.md). Tallene står i docs/fakta-solsystemet.md, del 5
// punkt 6 og "Faktatjek J5": Ved nordpolen ligger 8 cykloner i en ring om én i midten, ved sydpolen 5 om én (NASA,
// Adriani m.fl. 2018). Ringene ligger ved ca. 84° N og S, cyklonerne er ca. 4.000-6.000 km brede, og vinden i dem når op
// til ca. 100 m/s (Gavriel og Kaspi 2021, Nature Geoscience 14, 559-563, arXiv 2110.09422). Cyklonerne ved sydpolen er
// større end ved nordpolen (Adriani m.fl. 2018: 5.600-7.000 km mod 4.000-4.600 km).
// Hvor langt rundt de står (længden), er valgt af os: De flytter sig langsomt (nogle grader om året mod vest).
// Uden Three.js, så det kan testes i Node.

// bredde: planetografisk (grader). bred: diameter i km. vind og rMaks: den største fart (m/s) og afstanden fra midten,
// hvor den er (km), for cyklonen i midten (Gavriel og Kaspi 2021, efter Grassi m.fl. 2018). Ringens cykloner drejer
// med samme omløbstid.
export const POLER = {
  nord: { antal: 8, bredde: 84, bred: 4400, midtBred: 4000, vind: 80, rMaks: 900, start: 15 },
  syd: { antal: 5, bredde: -84, bred: 5800, midtBred: 5600, vind: 85, rMaks: 1100, start: 40 },
};

// Omløbstiden for en cyklon i sekunder (i virkeligheden): 2π · rMaks / vind
export const omløb = (p) => (2 * Math.PI * p.rMaks * 1000) / p.vind;

// Alle cyklonerne ved en pol: [{ bredde, længde (østlig, grader), bred (km) }], den i midten først
export function cykloner(navn) {
  const p = POLER[navn];
  const ud = [{ bredde: Math.sign(p.bredde) * 90, længde: 0, bred: p.midtBred }];
  for (let i = 0; i < p.antal; i++) ud.push({ bredde: p.bredde, længde: (p.start + (360 * i) / p.antal) % 360, bred: p.bred });
  return ud;
}
