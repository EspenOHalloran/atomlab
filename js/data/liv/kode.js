// Liv L2: den genetiske kode (standardkoden) og aminosyrerne. Kun tal og tekst, kan testes i Node.
// Kilder: OpenStax Biology 2e 15-1 (64 kodoner, 3 stop, AUG er start og methionin) og 3-4 (aminosyrernes slags),
// docs/fakta-liv/dna-opskriften.md og docs/fakta-liv.md (bogstaverne).

// Basernes rækkefølge i hjulet og i tabellen (som i lærebøgerne): U, C, A, G
export const BASER_RNA = ['U', 'C', 'A', 'G'];

// Standardkoden (NCBI's tabel 1): kodon nr. 16·i + 4·j + k har baserne BASER_RNA[i], [j] og [k]. * er stop.
const TABEL = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';

// 'UUU' → 'F' … 'UAA' → '*'
export const KODE = {};
for (let n = 0; n < 64; n++) {
  KODE[BASER_RNA[n >> 4] + BASER_RNA[(n >> 2) & 3] + BASER_RNA[n & 3]] = TABEL[n];
}
export const STOP = '*';

// De 20 aminosyrer. slags (OpenStax 3-4 og Lehningers grupper): 'skyr' (upolær, skyr vand), 'elsker' (polær, kan lide
// vand), 'plus' og 'minus' (ladet). Histidin er kun plus en del af tiden, men står med de plusladede som i lærebøgerne.
export const AMINOSYRER = {
  A: { navn: 'alanin', kort: 'Ala', slags: 'skyr' },
  R: { navn: 'arginin', kort: 'Arg', slags: 'plus' },
  N: { navn: 'asparagin', kort: 'Asn', slags: 'elsker' },
  D: { navn: 'asparaginsyre', kort: 'Asp', slags: 'minus' },
  C: { navn: 'cystein', kort: 'Cys', slags: 'elsker' },
  E: { navn: 'glutaminsyre', kort: 'Glu', slags: 'minus' },
  Q: { navn: 'glutamin', kort: 'Gln', slags: 'elsker' },
  G: { navn: 'glycin', kort: 'Gly', slags: 'skyr' },
  H: { navn: 'histidin', kort: 'His', slags: 'plus' },
  I: { navn: 'isoleucin', kort: 'Ile', slags: 'skyr' },
  L: { navn: 'leucin', kort: 'Leu', slags: 'skyr' },
  K: { navn: 'lysin', kort: 'Lys', slags: 'plus' },
  M: { navn: 'methionin', kort: 'Met', slags: 'skyr' },
  F: { navn: 'phenylalanin', kort: 'Phe', slags: 'skyr' },
  P: { navn: 'prolin', kort: 'Pro', slags: 'skyr' },
  S: { navn: 'serin', kort: 'Ser', slags: 'elsker' },
  T: { navn: 'threonin', kort: 'Thr', slags: 'elsker' },
  W: { navn: 'tryptofan', kort: 'Trp', slags: 'skyr' },
  Y: { navn: 'tyrosin', kort: 'Tyr', slags: 'elsker' },
  V: { navn: 'valin', kort: 'Val', slags: 'skyr' },
};

export const SLAGS = {
  skyr: { navn: 'Skyr vand', farve: '#ffc93c' },
  elsker: { navn: 'Kan lide vand', farve: '#3ddc84' },
  plus: { navn: 'Plus', farve: '#4ea8ff' },
  minus: { navn: 'Minus', farve: '#ff5a5f' },
};
export const STOP_FARVE = '#c8ccd8';

// Navnet på en aminosyre eller stop, fx 'valin (V)' eller 'stop'
export function aaNavn(aa) {
  return aa === STOP ? 'stop' : `${AMINOSYRER[aa].navn} (${aa})`;
}

// DNA → RNA: U i stedet for T (RNA-kopien har samme bogstaver som streng I, den streng, der ikke bliver læst)
export const tilRNA = (dna) => dna.replace(/T/g, 'U');
export const tilDNA = (rna) => rna.replace(/U/g, 'T');

// Deler en streng op i ord på tre bogstaver
export function kodoner(s) {
  const ud = [];
  for (let i = 0; i + 3 <= s.length; i += 3) ud.push(s.slice(i, i + 3));
  return ud;
}

// Aminosyren for et kodon (DNA eller RNA)
export const aminosyre = (kodon) => KODE[tilRNA(kodon)];

// Oversætter fra starten til første stop: { protein: 'MVHL…', stop: kodonets nummer (0-baseret) eller -1 }
export function oversæt(s) {
  let protein = '';
  const ord = kodoner(s);
  for (let i = 0; i < ord.length; i++) {
    const aa = aminosyre(ord[i]);
    if (aa === STOP) return { protein, stop: i };
    protein += aa;
  }
  return { protein, stop: -1 };
}

// De aminosyrer, man får ved at skifte ét bogstav i et kodon (uden stop og uden den samme), til forkerte svar
export function naboer(kodon) {
  const rna = tilRNA(kodon);
  const egen = KODE[rna];
  const ud = new Set();
  for (let i = 0; i < 3; i++) {
    for (const b of BASER_RNA) {
      if (b === rna[i]) continue;
      const aa = KODE[rna.slice(0, i) + b + rna.slice(i + 1)];
      if (aa !== STOP && aa !== egen) ud.add(aa);
    }
  }
  return [...ud];
}
