// Lysuret: et tænkt ur, hvor et lysglimt hopper op og ned mellem to spejle. Delt mellem Rejsen i tid (tid.js) og
// "Hvordan kan det ske?" (tidhvorfor.js, før "Hvorfor går tiden langsommere?"), så de to ikke glider fra hinanden (T5a, 9. november 2026).
// Kun regning og tegning på et 2D-lærred, ingen Three.js. Hvert fænomen har sine egne billeder (bokse og tekster) og
// bruger herfra: uret (nytUr, nulstilUr, skridtUr), spejlene og lyset (tegnSkibUr, tegnJordUr) og trekanten.
//
// Uret: skib og jord er fasen i tik (0 = nede, ½ = oppe, 1 = nede igen) i skibet og set fra Jorden. x er spejlenes vej
// set fra Jorden i pixel. spor er zigzaggens knæk set fra Jorden som [x, fase] (sat præcist, så spidserne ikke bliver
// skåret af, når et billede springer over dem). stille: uret er stoppet, fordi lyset set fra Jorden er nået op.
import { lysurGamma } from '../data/tid.js';

// Et tik (op og ned) tager LYS_TIK sekunder på skærmen i skibet og γ gange så lang tid set fra Jorden
export const LYS_TIK = 1.4;

export const FARVE = {
  lige: '#7fe0ff', // den lige vej
  skrå: '#ffd24a', // den skrå vej
  spejl: '#cfe3ff',
  boks: 'rgba(8,12,28,0.96)', // næsten uigennemsigtig, så scenen bag ikke forstyrrer
  kant: 'rgba(120,150,210,0.35)',
  kantAktiv: 'rgba(160,200,255,0.75)',
  tekst: '#c9d6ee',
  svag: '#93a0c4',
  tik: '#ffe08a',
};

export function nytUr() {
  const ur = { skib: 0, jord: 0, x: 0, stille: false, spor: [] };
  nulstilUr(ur);
  return ur;
}

export function nulstilUr(ur) {
  ur.skib = 0;
  ur.jord = 0;
  ur.x = 0;
  ur.stille = false;
  ur.spor.length = 0;
  ur.spor.push([0, 0]);
}

// Højden over det nederste spejl for en fase i tik
export const højde = (f, L) => { const r = f - Math.floor(f); return L * (r < 0.5 ? 2 * r : 2 - 2 * r); };

// Den næste gang, lyset set fra Jorden er oppe (½, 1½, 2½ …)
const næsteTop = (f) => (Math.floor(f) + 0.5 > f + 1e-9 ? Math.floor(f) + 0.5 : Math.floor(f) + 1.5);

// Et skridt på dt sekunder. v er farten (andel af lysets fart), c lysets fart på skærmen (pixel pr. sekund) og bredde
// billedet fra Jorden (gamle punkter mere end 3 bredder ude til venstre smides væk). stopOppe: uret stopper, når lyset
// set fra Jorden er nået op til det øverste spejl. Giver true, når uret lige er stoppet.
export function skridtUr(ur, dt, { v, c, bredde, stopOppe = false }) {
  if (ur.stille) return false;
  const gam = lysurGamma(v);
  let d = dt;
  const top = stopOppe ? næsteTop(ur.jord) : Infinity;
  if (stopOppe) d = Math.min(dt, (top - ur.jord) * LYS_TIK * gam);
  const før = { jord: ur.jord, x: ur.x };
  ur.skib += d / LYS_TIK;
  ur.jord += d / (LYS_TIK * gam);
  ur.x += v * c * d;
  const skridt = Math.max(1e-12, ur.jord - før.jord);
  for (let k = Math.floor(før.jord * 2) + 1; k / 2 <= ur.jord + 1e-12; k++) {
    const f = k / 2;
    ur.spor.push([før.x + ((f - før.jord) / skridt) * (ur.x - før.x), f]);
  }
  while (ur.spor.length > 2 && ur.spor[1][0] < ur.x - 3 * bredde) ur.spor.shift();
  if (stopOppe && ur.jord >= top - 1e-9) {
    ur.jord = top;
    ur.stille = true;
    return true;
  }
  return false;
}

// Gør lærredet klar til et nyt billede i størrelsen W × H (CSS-pixel) og giver tegnefladen
export function klarLærred(lærred, W, H) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (lærred.width !== Math.round(W * dpr) || lærred.height !== Math.round(H * dpr)) {
    lærred.width = Math.round(W * dpr);
    lærred.height = Math.round(H * dpr);
  }
  const g = lærred.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  return g;
}

// Tekst på lærredet: tekst(g, s, x, y, { farve, str, vægt, side })
export function tekst(g, s, x, y, { farve = FARVE.tekst, str = 13, vægt = 600, side = 'center' } = {}) {
  g.font = `${vægt} ${str}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  g.fillStyle = farve;
  g.textAlign = side;
  g.textBaseline = 'alphabetic';
  g.fillText(s, x, y);
}

// En boks (et af billederne) med afrundede hjørner. klip: det, der tegnes bagefter, holdes inden for boksen.
export function boks(g, x, y, w, h, { aktiv = false, klip = true, r = 10 } = {}) {
  g.fillStyle = FARVE.boks;
  g.strokeStyle = aktiv ? FARVE.kantAktiv : FARVE.kant;
  g.lineWidth = aktiv ? 1.6 : 1;
  g.beginPath();
  g.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, r);
  g.fill();
  g.stroke();
  if (klip) g.clip();
}

export function spejl(g, x, y, sw) {
  g.fillStyle = FARVE.spejl;
  g.shadowColor = 'rgba(140,200,255,0.8)';
  g.shadowBlur = 6;
  g.fillRect(x - sw / 2, y - 2, sw, 4);
  g.shadowBlur = 0;
}

export function glimt(g, x, y, r = 6) {
  const grad = g.createRadialGradient(x, y, 0, x, y, r * 2.4);
  grad.addColorStop(0, 'rgba(255,255,230,1)');
  grad.addColorStop(0.35, 'rgba(255,236,140,0.85)');
  grad.addColorStop(1, 'rgba(255,200,80,0)');
  g.fillStyle = grad;
  g.beginPath();
  g.arc(x, y, r * 2.4, 0, Math.PI * 2);
  g.fill();
}

function lodret(g, x, y1, y2, farve, b, stiplet) {
  g.strokeStyle = farve;
  g.lineWidth = b;
  g.setLineDash(stiplet ? [6, 5] : []);
  g.beginPath();
  g.moveTo(x, y1);
  g.lineTo(x, y2);
  g.stroke();
  g.setLineDash([]);
}

// Uret i skibet: spejlene står stille, og lyset går lige op og ned (midt i x). lige: den lige vej stiplet og lyseblå.
export function tegnSkibUr(g, ur, { x, top, L, sw, lige = false, r = 6 }) {
  const bund = top + L;
  lodret(g, x, bund, top, lige ? FARVE.lige : 'rgba(255,230,140,0.35)', lige ? 3 : 2, lige);
  spejl(g, x, top, sw);
  spejl(g, x, bund, sw);
  glimt(g, x, bund - højde(ur.skib, L), r);
}

// Hvor meget billedet fra Jorden er rykket med spejlene (de når aldrig ud over kanten)
export const jordForskud = (ur, { xs0, we, sw, kant = 6 }) => Math.max(0, xs0 + ur.x - (we - sw / 2 - kant));

// Det samme ur set fra Jorden (i et billede, der starter i x = 0 og er we bredt): spejlene farer forbi, og lyset går
// skråt (zigzag). Når spejlene er ved at nå kanten, følger billedet med dem, og de lodrette streger (som står stille i
// forhold til Jorden) glider mod venstre i stedet. skrå: sporet tykt og gult med den lige vej ved siden af (v er farten).
export function tegnJordUr(g, ur, { v, top, L, sw, xs0, we, kant = 6, skrå = false, r = 6 }) {
  const bund = top + L;
  const forskud = jordForskud(ur, { xs0, we, sw, kant });
  const sx = (wx) => xs0 + wx - forskud;
  g.strokeStyle = 'rgba(120,150,210,0.16)';
  g.lineWidth = 1;
  for (let gx = -(forskud % 40); gx < we; gx += 40) {
    g.beginPath();
    g.moveTo(gx, top - 6);
    g.lineTo(gx, bund + 6);
    g.stroke();
  }
  g.strokeStyle = skrå ? FARVE.skrå : 'rgba(255,230,140,0.6)';
  g.lineWidth = skrå ? 3 : 2;
  g.beginPath();
  ur.spor.forEach(([wx, f], j) => (j ? g.lineTo(sx(wx), bund - højde(f, L)) : g.moveTo(sx(wx), bund - højde(f, L))));
  g.lineTo(sx(ur.x), bund - højde(ur.jord, L));
  g.stroke();
  // Den lige vej ved siden af den skrå, så man kan se, at den skrå er længere
  if (skrå) lodret(g, sx(ur.x - v * lysurGamma(v) * L), bund, top, FARVE.lige, 3, true);
  spejl(g, sx(ur.x), top, sw);
  spejl(g, sx(ur.x), bund, sw);
  glimt(g, sx(ur.x), bund - højde(ur.jord, L), r);
}

// Tal med komma (dansk)
const fmt = (x, d) => x.toLocaleString('da-DK', { minimumFractionDigits: d, maximumFractionDigits: d });
const erTo = (gam) => Math.abs(gam - 2) < 1e-9;

// Trekanten for et halvt tik set fra Jorden (fra skitsen, T5 Trin 0): den lige vej op (1), det stykke, spejlene har
// flyttet sig (v·γ i lysurets højder), og den skrå vej (γ), med tallene og Pythagoras. Ved høje farter tegnes den
// mindre, så den kan være der (vinklerne er de rigtige). Tegnes i et billede, der starter i x = 0 og er we × hE.
export function tegnTrekant(g, { v, top, L, sw, we, hE, skrift = 13 }) {
  const gam = lysurGamma(v);
  const vand = v * gam; // spejlenes vej på et halvt tik i højder (1,73 ved 87 %)
  const s = Math.min(1, (we - 2 * (sw + 18)) / (vand * L + 1));
  const Ls = L * s;
  const Ax = 22 + sw / 2;
  const Bx = Ax + vand * L * s;
  const y0 = top + (L - Ls) / 2 + Ls;
  const y1 = y0 - Ls;
  g.globalAlpha = 0.35;
  spejl(g, Ax, y0, sw);
  spejl(g, Ax, y1, sw);
  g.globalAlpha = 1;
  g.strokeStyle = FARVE.skrå;
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(Ax, y0);
  g.lineTo(Bx, y1);
  g.stroke();
  lodret(g, Bx, y0, y1, FARVE.lige, 3, true);
  g.strokeStyle = 'rgba(230,236,255,0.7)';
  g.lineWidth = 2;
  g.setLineDash([3, 4]);
  g.beginPath();
  g.moveTo(Ax, y0);
  g.lineTo(Bx, y0);
  g.stroke();
  g.setLineDash([]);
  spejl(g, Bx, y0, sw);
  spejl(g, Bx, y1, sw);
  glimt(g, Bx, y1);
  tekst(g, '1', Bx + 10, (y0 + y1) / 2 + 5, { farve: FARVE.lige, side: 'left', vægt: 700, str: skrift });
  tekst(g, fmt(vand, 2), (Ax + Bx) / 2 + (Bx - Ax) * 0.12, y0 - 7, { farve: 'rgba(230,236,255,0.85)', vægt: 700, str: skrift });
  g.save();
  g.translate((Ax + Bx) / 2, (y0 + y1) / 2);
  g.rotate(-Math.atan2(Ls, vand * L * s));
  tekst(g, fmt(gam, erTo(gam) ? 0 : 2), 0, -8, { farve: FARVE.skrå, vægt: 700, str: skrift });
  g.restore();
  const ligning = erTo(gam) ? '1² + 1,73² = 2²  (1 + 3 = 4)' : `1² + ${fmt(vand, 2)}² = ${fmt(gam, 2)}²`;
  tekst(g, ligning, we / 2, hE - 10, { farve: FARVE.tik, vægt: 700, str: skrift });
  if (s < 0.999) tekst(g, `(tegnet ${fmt(1 / s, 1)} gange mindre)`, we - 10, top - 4, { side: 'right', farve: FARVE.svag, str: skrift - 2, vægt: 500 });
  return { gamma: gam, vand, skala: s };
}
