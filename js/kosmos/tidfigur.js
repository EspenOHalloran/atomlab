// De to tegnede figurer i Rejsen i tid (E4, trin A1): dig og din tvilling, tegnet som piktogrammer (som på et skilt) efter
// alderen: ung (under 20, med kasket), voksen (20-59) og gammel (60 og derover, foroverbøjet med stok og hvidt hår). De
// står oven på hvert sit ur før afgang, undervejs og ved hjemkomsten (jeres valg 13. november 2026). Alderen deles i de tre slags i js/data/tid.js (figurSlags), så det kan testes uden browser.

// Hver figur er tegnet i en boks på 40 × 84 med jorden ved y = 82: hovedet er en cirkel, og kroppen, armene og benene er
// tykke streger med runde ender.
const FIGURER = {
  // Den unge er tydeligt lavere end den voksne (samme boks), så forskellen kan ses, selv om de står på hvert sit ur
  ung: {
    hoved: [20, 24, 6.3],
    streger: [
      [[20, 33], [20, 54], 9], // kroppen
      [[16.5, 35], [12, 53], 4.2], [[23.5, 35], [28, 53], 4.2], // armene
      [[18, 57], [16.5, 81], 5.4], [[22, 57], [23.5, 81], 5.4], // benene
    ],
    // Kasketten: toppen af hovedet og en skygge til siden (som på et skilt)
    pynt: '<path class="tid-figur-mørk" d="M13.6 23.2 A6.5 6.5 0 0 1 26.4 23.2 Z"/><line class="tid-figur-mørk" x1="24" y1="22.6" x2="30.5" y2="23.4" stroke-width="2.4"/>',
  },
  voksen: {
    hoved: [20, 8.5, 6.6],
    streger: [
      [[20, 20], [20, 46], 11.5],
      [[15, 20.5], [25, 20.5], 6.5], // skuldrene
      [[14, 22], [9, 45], 4.8], [[26, 22], [31, 45], 4.8],
      [[17.6, 49], [16, 81], 6.2], [[22.4, 49], [24, 81], 6.2],
    ],
  },
  // Foroverbøjet med en stok i den forreste hånd. Vender mod højre (spejles, når den skal se den anden vej).
  gammel: {
    hoved: [27, 21, 6],
    streger: [
      [[23, 30], [18.5, 52], 9.5],
      [[21, 33], [18.5, 51], 4.2], // den bageste arm
      [[25, 33], [31, 48], 4.2], // armen til stokken
      [[17.5, 55], [16, 80], 5.6], [[20.5, 55], [24.5, 67], 5.6], [[24.5, 67], [22.5, 80], 5.6], // benene, det ene bøjet
      [[32, 47], [33.5, 81], 2.4], // stokken
      [[30, 47.5], [32, 47], 2.4], // stokkens greb
    ],
    // Hvidt hår over toppen og baghovedet (figuren vender mod højre)
    pynt: '<path class="tid-figur-hår" d="M21.1 23.2 A6.3 6.3 0 0 1 30.2 15.6" fill="none" stroke-width="2.8"/>',
  },
};

// SVG for en figur af slagsen ('ung', 'voksen' eller 'gammel'). spejl: vend figuren (den gamle ser så mod venstre).
export function figurSVG(slags, { spejl = false } = {}) {
  const f = FIGURER[slags];
  if (!f) return '';
  const [hx, hy, hr] = f.hoved;
  const streger = f.streger.map(([[x1, y1], [x2, y2], b]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${b}"/>`).join('');
  const vend = spejl ? ' transform="translate(40 0) scale(-1 1)"' : '';
  return `<svg class="tid-figur-svg" viewBox="0 0 40 84" aria-hidden="true"><g${vend}><circle cx="${hx}" cy="${hy}" r="${hr}"/><g class="tid-figur-krop">${streger}</g>${f.pynt ?? ''}</g></svg>`;
}
