// Tegningerne i bogen om Huygens (Opdagelserne, docs/drejebog-huygens.md, afsnit 3): fortællingen "Saturns ører" i et
// lærred i 2D. Stilen er tavlen i Systema Saturnium (ved s. 35) og figurerne på s. 16-18: hvide figurer på en mørk,
// prikket bund, her i kikkertens runde synsfelt på bogens papir.
//
// lavFortælling(felt, { rolig, tekster, påIgen }) fylder opslagets felt (.bog-scene fra js/bog.js) og giver
//   forløbDel(data)  det, Forløb-klodsen (js/forloeb.js) skal bruge pr. trin-id (start, knapper, færdig, visMig)
//   fri()            laboratoriet efter forløbet: ringen, man selv kan dreje, og "Fortæl det igen" (påIgen)
//   fjern()          stopper tegningen og lytterne
//   test             til testadgangen (tilstanden og handlingerne)
//
// Saturn tegnes som en kugle med en flad ring (indre kant 1,53 og ydre 2,27 gange Saturns radius: B-ringens inderkant og
// A-ringens yderkant). B er vinklen, vi ser ringen fra (0 = fra kanten). Kikkertens uskarphed laves ved at tegne i lav
// opløsning og forstørre (virker også, hvor lærredets filter ikke findes).

const FIGUR = '#f3ead7'; // tavlens hvide figurer
const BUND = '#1d1a17'; // tavlens mørke bund
const BLÆK = '#2b1f17';
const RING_IND = 1.53, RING_UD = 2.27;
const GRAD = Math.PI / 180;

const glat = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mod = (a, b, t) => a + (b - a) * t;

// Den prikkede bund (som tavlens fine kobberstik): én flise, der gentages
function lavPrikker() {
  const c = document.createElement('canvas');
  c.width = c.height = 48;
  const g = c.getContext('2d');
  g.fillStyle = BUND;
  g.fillRect(0, 0, 48, 48);
  let frø = 7;
  const tilfældig = () => ((frø = (frø * 16807) % 2147483647) / 2147483647);
  for (let y = 1; y < 48; y += 3) {
    for (let x = (y % 2) * 1.5 + 0.5; x < 48; x += 3) {
      g.fillStyle = `rgba(255, 250, 235, ${0.12 + tilfældig() * 0.2})`;
      g.fillRect(x + tilfældig() * 0.6, y + tilfældig() * 0.6, 1, 1);
    }
  }
  return c;
}

// Saturn: kuglen og ringen set fra vinklen B (grader, + ovenfra, - nedefra). R er radius i px. Ringens bageste halvdel
// tegnes først, så kuglen, så den forreste halvdel. Striben over kuglen (s. 16-18) flytter sig med B: midt på, når ringen
// står på kant, over armene i 1655 og under dem i oktober 1656.
export function tegnSaturn(g, x, y, R, B, alfa = 1) {
  const sinB = Math.sin(B * GRAD);
  const aUd = RING_UD * R, bUd = Math.max(0.6, Math.abs(sinB) * aUd);
  const aInd = RING_IND * R, bInd = Math.abs(sinB) * aInd;
  const ring = (halv) => {
    g.save();
    g.beginPath();
    // Bageste halvdel ligger over midten set ovenfra (B > 0) og under set nedefra
    const op = (halv === 'bag') === (B >= 0);
    g.rect(x - aUd - 2, op ? y - bUd - 2 : y, 2 * aUd + 4, bUd + 2);
    g.clip();
    g.beginPath();
    g.ellipse(x, y, aUd, bUd, 0, 0, 2 * Math.PI);
    if (bInd > 0.3) g.ellipse(x, y, aInd, bInd, 0, 0, 2 * Math.PI);
    g.fill('evenodd');
    g.restore();
  };
  g.save();
  g.globalAlpha = alfa;
  g.fillStyle = FIGUR;
  ring('bag');
  // Kuglen (lidt fladtrykt som den rigtige: 54.364 / 60.268 km)
  g.beginPath();
  g.ellipse(x, y, R, R * 0.92, 0, 0, 2 * Math.PI);
  g.fill();
  // Striben: en mørk, skraveret bånd over kuglen
  g.save();
  g.beginPath();
  g.ellipse(x, y, R, R * 0.92, 0, 0, 2 * Math.PI);
  g.clip();
  g.fillStyle = 'rgba(40, 32, 26, 0.55)';
  const sy = y - sinB * R * 1.1;
  g.fillRect(x - R, sy - R * 0.06, 2 * R, R * 0.12);
  g.restore();
  ring('for');
  // Ringens forreste kant over kuglen får en fin, mørk streg, så den kan ses mod den hvide kugle
  if (bInd > 1) {
    g.strokeStyle = 'rgba(40, 32, 26, 0.5)';
    g.lineWidth = Math.max(0.6, R * 0.025);
    g.beginPath();
    g.ellipse(x, y, aInd, bInd, 0, B >= 0 ? 0 : Math.PI, B >= 0 ? Math.PI : 2 * Math.PI);
    g.stroke();
  }
  g.restore();
}

// Galileis tegning fra 1610 (tavlens nr. I): en stor kugle og en lille på hver side
export function tegnGalilei(g, x, y, R, alfa = 1) {
  g.save();
  g.globalAlpha = alfa;
  g.fillStyle = FIGUR;
  for (const [dx, r] of [[0, R], [-1.72 * R, 0.5 * R], [1.72 * R, 0.5 * R]]) {
    g.beginPath();
    g.arc(x + dx, y, r, 0, 2 * Math.PI);
    g.fill();
  }
  g.restore();
}

export function lavFortælling(felt, { rolig = false, tekster = {}, påIgen = null } = {}) {
  felt.innerHTML = '<div class="hs-lærred"><canvas role="img"></canvas></div><div class="hs-under"></div>';
  const lærred = felt.querySelector('canvas');
  const under = felt.querySelector('.hs-under');
  const g = lærred.getContext('2d');
  const kapitel = felt.closest('.bog-opslag')?.querySelector('.bog-kapitel');
  const titel = kapitel?.textContent ?? '';
  const prikker = g.createPattern(lavPrikker(), 'repeat');
  const sløret = document.createElement('canvas'); // til kikkertens uskarphed
  const sg = sløret.getContext('2d');

  // Tilstanden. trin: 'linse', 'naetter', 'kanten' eller 'fri'
  const s = { trin: 'fri', B: 0, gjort: false };
  let W = 0, H = 0, dpr = 1;
  let aktiv = true;
  let ramme = 0;
  let skal = true; // tegn igen i næste billede

  const tegnIgen = () => {
    skal = true;
    if (!ramme && aktiv) ramme = requestAnimationFrame(billede);
  };

  function tilpas() {
    const r = lærred.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    lærred.width = Math.round(W * dpr);
    lærred.height = Math.round(H * dpr);
    tegnIgen();
  }
  const ro = new ResizeObserver(tilpas);
  ro.observe(lærred);

  // Kikkertens runde synsfelt: midten og radius i px (efterlader plads under feltet til en linje)
  const felt0 = () => {
    const r = Math.max(20, Math.min(W * 0.47, (H - 34) * 0.5));
    return { x: W / 2, y: Math.max(r + 2, (H - 34) / 2), r };
  };

  // Tegner figuren (en funktion af g, x, y) i synsfeltet med uskarpheden u (0 = skarp, 1 = meget uskarp)
  function iFeltet(f, u, tegn) {
    g.save();
    g.beginPath();
    g.arc(f.x, f.y, f.r, 0, 2 * Math.PI);
    g.clip();
    g.fillStyle = prikker;
    g.fillRect(f.x - f.r, f.y - f.r, 2 * f.r, 2 * f.r);
    if (u < 0.02) tegn(g, f.x, f.y);
    else {
      // Tegn i lav opløsning og forstør (to trin, så det bliver blødt og ikke firkantet)
      const skala = mod(1, 0.07, u);
      const sw = Math.max(4, Math.round(2 * f.r * dpr * skala));
      sløret.width = sløret.height = sw;
      sg.setTransform(sw / (2 * f.r), 0, 0, sw / (2 * f.r), 0, 0);
      sg.clearRect(0, 0, 2 * f.r, 2 * f.r);
      tegn(sg, f.r, f.r);
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = 'high';
      g.drawImage(sløret, f.x - f.r, f.y - f.r, 2 * f.r, 2 * f.r);
    }
    // Kanten af synsfeltet bliver mørkere (som i et rør)
    const v = g.createRadialGradient(f.x, f.y, f.r * 0.72, f.x, f.y, f.r);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.55)');
    g.fillStyle = v;
    g.fillRect(f.x - f.r, f.y - f.r, 2 * f.r, 2 * f.r);
    g.restore();
    g.strokeStyle = BLÆK;
    g.lineWidth = 2;
    g.beginPath();
    g.arc(f.x, f.y, f.r + 1, 0, 2 * Math.PI);
    g.stroke();
  }

  // Linjen under synsfeltet (med bogens skrift)
  function linjeUnder(f, tekst) {
    if (!tekst) return;
    g.fillStyle = BLÆK;
    g.font = `${Math.round(Math.min(20, Math.max(14, f.r * 0.1)))}px ${getComputedStyle(felt).getPropertyValue('--bog-skrift') || 'Georgia, serif'}`;
    g.textAlign = 'center';
    g.textBaseline = 'top';
    g.fillText(tekst, f.x, f.y + f.r + 8);
  }

  function billede() {
    ramme = 0;
    if (!aktiv) return;
    if (!skal) return;
    skal = false;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const f = felt0();
    if (s.trin === 'linse') {
      iFeltet(f, 0.6, (c, x, y) => tegnGalilei(c, x, y, f.r * 0.2));
      linjeUnder(f, 'Galileis kikkert, 1610');
    } else if (s.trin === 'naetter') {
      iFeltet(f, 0, (c, x, y) => tegnSaturn(c, x, y, f.r / 24, 5));
    } else {
      iFeltet(f, 0.25, (c, x, y) => tegnSaturn(c, x, y, f.r * 0.27, s.B));
    }
  }

  function sætTrin(trin) {
    s.trin = trin;
    s.gjort = false;
    under.replaceChildren();
    tegnIgen();
  }

  function sætKapitel(t) {
    if (kapitel) kapitel.textContent = t ?? titel;
  }

  // Midlertidigt i trin A: hvert trin har én knap, til tegningerne kommer i trin B-D
  const midlertidig = (id) => ({
    start: () => sætTrin(id),
    knapper: [{ id: 'gjort', tekst: 'Videre', gør: () => { s.gjort = true; } }],
    færdig: () => s.gjort,
    visMig: () => { s.gjort = true; },
  });

  function forløbDel(data) {
    const trin = { linse: midlertidig('linse'), naetter: midlertidig('naetter'), kanten: midlertidig('kanten') };
    // Kapitlets titel følger trinet (fx "Haag, 1655")
    for (const t of data.trin) {
      const d = trin[t.id];
      if (!d) continue;
      const start = d.start;
      d.start = () => { sætKapitel(t.kapitel); start(); };
    }
    return { trin };
  }

  function fri() {
    sætKapitel(titel);
    sætTrin('fri');
    s.B = 14;
    under.innerHTML = `<p class="hs-linje"></p><button class="knap hs-igen"></button>`;
    under.querySelector('.hs-linje').textContent = tekster.linje ?? '';
    const igen = under.querySelector('.hs-igen');
    igen.textContent = `${tekster.igen ?? 'Fortæl det igen'} ›`;
    igen.addEventListener('click', () => påIgen?.());
    tegnIgen();
  }

  return {
    forløbDel,
    fri,
    fjern() {
      aktiv = false;
      cancelAnimationFrame(ramme);
      ramme = 0;
      ro.disconnect();
      felt.replaceChildren();
    },
    test: {
      tilstand: () => ({ trin: s.trin, B: s.B, gjort: s.gjort }),
    },
  };
}
