// Tegningerne i bogen om Huygens (Opdagelserne, docs/drejebog-huygens.md, afsnit 3): fortællingen "Saturns ører" i et
// lærred i 2D. Stilen er tavlen i Systema Saturnium (ved s. 35) og figurerne på s. 16-18: hvide figurer på en mørk,
// prikket bund, her i kikkertens runde synsfelt på bogens papir.
//
// lavFortælling(felt, { rolig, tekster, anagram, påIgen }) fylder opslagets felt (.bog-scene fra js/bog.js) og giver
//   forløbDel(data)  det, Forløb-klodsen (js/forloeb.js) skal bruge pr. trin-id (start, knapper, færdig, visMig)
//   fri(kapitel)     laboratoriet efter forløbet: de tre kapitler som tre valg (linse, naetter og ringen, standard
//                    ringen, man selv kan dreje) og "Fortæl det igen" (påIgen)
//   fjern()          stopper tegningen, timerne og lytterne
//   test             til testadgangen (tilstanden og handlingerne)
//
// Forløbet er en sti (E20, 17. november 2026, stilguiden B): Glasset, skyderen og ringen virker i alle faser (også mens man
// gætter, hvor et tryk lader gættet tone væk, og under Så). Målene er runde: Nat 15 og 17 falder selv på 16, kanten tæller
// fra 3°, og går man forbi, kommer et vink med det samme (teksterne i js/data/forloeb/huygens.js).
//
// Trinene (H2, 16. november 2026):
//   linse    Galileis tre kugler (tavlens nr. I) er slørede. Man gnider på glasset (eller trykker "Slib linsen"), og
//            billedet bliver skarpt: kuglerne vokser sammen til Huygens' tynde arme fra 1655 (s. 18 og 46)
//   naetter  Saturn og en svag prik (Titan) i den rigtige afstand (20,3 gange Saturns radius). Én skyder for nætterne fra
//            25. marts 1655. Efter 16 nætter er prikken tilbage ved sit mærke (i dag 15,945 døgn). Rækken "* O" som s. 16-17
//   kanten   Saturn står med ringen på kant (januar 1656, s. 16). Man trækker op og ned (vinklen B), og tavlens tegninger
//            lyser op, når ringen ligner dem. Tilbage ved kanten forsvinder armene, og billedet løfter sig: Kikkertens
//            uskarphed og synsfelt forsvinder, og man ser den samme ring skråt fra
//   annulo   (H3, 17. november 2026) Lærredet er væk, og de 17 bunker af bogstaver står i stedet (js/bog/huygens-gaade.js).
//            Man finder ANNULO, og resten af sætningen flyver på plads med dansk under
//
// Saturn tegnes som en kugle med en flad ring (indre kant 1,53 og ydre 2,27 gange Saturns radius: B-ringens inderkant og
// A-ringens yderkant). B er vinklen, vi ser ringen fra (0 = fra kanten, højst ca. 27° fra Jorden). Snyd, der siges i
// nørd-teksten: Kikkertens uskarphed er gjort ens i alle retninger, og Saturn i trin 1 og 3 er tegnet meget større end
// i en rigtig kikkert. Kikkertens uskarphed laves ved at tegne i lav opløsning og forstørre (virker også på ældre iPads,
// hvor lærredets filter ikke findes).

import { forløbRørt, forløbVenter, forløbVink } from '../forloeb.js';
import { lavAnagram } from './huygens-gaade.js';
// Opslaget "Hemmeligheden" (H3): bogens anden tegning, lavet af opdagelser.js med lavScene
export { lavUdfordring as lavGåde } from './huygens-gaade.js';

const FIGUR = '#f3ead7'; // tavlens hvide figurer
const BUND = '#1d1a17'; // tavlens mørke bund
const BLÆK = '#2b1f17';
const RING_IND = 1.53, RING_UD = 2.27;
const TITAN_AFSTAND = 20.3; // Titans bane i Saturn-radier (1.221.870 km / 60.268 km)
const TITAN_DØGN = 15.945;
const NAT_MÅL = 16; // Huygens' eget tal: ca. 16 dage (s. 26-27)
const NAT_MAKS = 20;
const B_MAKS = 27; // ringens største vinkel set fra Jorden (ca. 27°)
const B_ÅBEN = 12; // så langt skal ringen åbnes i trin 3, før kanten tæller
const KANT_TÆT = 3; // så tæt på kanten (grader) er "tæt nok": Ringen falder selv det sidste stykke (runde mål, B5)
const FANG_EFTER = 450; // ms uden at røre skyderen, før nat 15 eller 17 selv falder på 16
const B_1655 = 5; // armene i 1655: en smal ring (tegnet efter s. 18)
const GRAD = Math.PI / 180;
const MÅNEDER = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];

// Tavlens tegninger (ved s. 35), som lyser op i trin 3, når ringen ligner dem. fra-til er |B| i grader.
const TAVLE = [
  { id: 'hevelius', nr: 'VI', navn: 'Hevelius', fra: 5, til: 11.5 },
  { id: 'divini', nr: 'X', navn: 'Divini, 1646-1648', fra: 11.5, til: 18.5 },
  { id: 'riccioli', nr: 'IX', navn: 'Riccioli, 1648-1650', fra: 18.5, til: 28 },
];

const glat = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mod = (a, b, t) => a + (b - a) * t;
const klem = (x, a, b) => Math.max(a, Math.min(b, x));

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
// står på kant, over armene i 1655 og under dem i oktober 1656. Står ringen helt på kant, er den næsten usynlig.
export function tegnSaturn(g, x, y, R, B, alfa = 1) {
  const sinB = Math.sin(B * GRAD);
  const aUd = RING_UD * R, bUd = Math.max(0.35, Math.abs(sinB) * aUd);
  const aInd = RING_IND * R, bInd = Math.abs(sinB) * aInd;
  const ringAlfa = alfa * mod(0.25, 1, glat(0, 1.5, Math.abs(B)));
  const ring = (halv) => {
    g.save();
    g.globalAlpha = ringAlfa;
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
  g.fillStyle = FIGUR;
  ring('bag');
  // Kuglen (lidt fladtrykt som den rigtige: 54.364 / 60.268 km)
  g.globalAlpha = alfa;
  g.beginPath();
  g.ellipse(x, y, R, R * 0.92, 0, 0, 2 * Math.PI);
  g.fill();
  // Striben: et mørkt bånd over kuglen
  g.save();
  g.beginPath();
  g.ellipse(x, y, R, R * 0.92, 0, 0, 2 * Math.PI);
  g.clip();
  g.fillStyle = 'rgba(40, 32, 26, 0.55)';
  const sy = y - sinB * R * 1.1;
  g.fillRect(x - R, sy - R * 0.06, 2 * R, R * 0.12);
  g.restore();
  ring('for');
  // Ringens forreste kanter får en fin, mørk streg, så ringen kan ses foran den hvide kugle
  if (bInd > 1) {
    g.globalAlpha = alfa;
    g.strokeStyle = 'rgba(40, 32, 26, 0.55)';
    g.lineWidth = Math.max(0.6, R * 0.025);
    const [a0, a1] = B >= 0 ? [0, Math.PI] : [Math.PI, 2 * Math.PI];
    g.beginPath();
    g.ellipse(x, y, aInd, bInd, 0, a0, a1);
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

// En lille tegning fra tavlen som SVG (samme stil som Galileis tegning på forsiden i js/bog.js)
function tavleSVG(id) {
  const bund = '<rect width="90" height="50" rx="3" fill="#1d1a17"/>';
  const f = FIGUR, m = BUND;
  let figur = '';
  if (id === 'hevelius') {
    // Kuglen med to "ører" (halvmåner) og et mørkt mellemrum (nr. VI)
    figur = `<ellipse cx="25" cy="25" rx="11" ry="12" fill="${f}"/><ellipse cx="65" cy="25" rx="11" ry="12" fill="${f}"/>`
      + `<circle cx="45" cy="25" r="17" fill="${m}"/><circle cx="45" cy="25" r="14" fill="${f}"/>`;
  } else if (id === 'divini') {
    // En ring om kuglen, der går foran den forneden (nr. X)
    figur = `<ellipse cx="45" cy="25" rx="38" ry="15" fill="${f}"/><ellipse cx="45" cy="25" rx="30" ry="10" fill="${m}"/>`
      + `<circle cx="45" cy="25" r="13" fill="${f}"/>`
      + `<path d="M7 25a38 15 0 0 0 76 0h-8a30 10 0 0 1-60 0z" fill="${f}" stroke="${m}" stroke-width="0.8"/>`;
  } else {
    // En bred ellipse med to mørke halvmåner ved kuglen (nr. IX)
    figur = `<ellipse cx="45" cy="25" rx="38" ry="20" fill="${f}"/><ellipse cx="45" cy="25" rx="28" ry="14" fill="${m}"/>`
      + `<ellipse cx="45" cy="25" rx="15" ry="19" fill="${f}"/>`;
  }
  return `<svg viewBox="0 0 90 50" aria-hidden="true">${bund}${figur}</svg>`;
}

// Datoen n nætter efter Huygens' første iagttagelse af Titan, 25. marts 1655 (Holland brugte den gregorianske kalender)
function nattensDato(n) {
  const d = new Date(1655, 2, 25 + n);
  return `${d.getDate()}. ${MÅNEDER[d.getMonth()]} ${d.getFullYear()}`;
}

export function lavFortælling(felt, { rolig = false, tekster = {}, anagram = null, påIgen = null } = {}) {
  let fl = null; // forløbets data (vinkene), når forløbet kører
  let ag = null; // bunkerne i trin 4 (lavAnagram)
  felt.innerHTML = '<div class="hs-lærred"><canvas role="img"></canvas></div><div class="hs-under"></div>';
  const lærred = felt.querySelector('canvas');
  const under = felt.querySelector('.hs-under');
  const g = lærred.getContext('2d');
  const kapitel = felt.closest('.bog-opslag')?.querySelector('.bog-kapitel');
  const titel = kapitel?.textContent ?? '';
  const prikker = g.createPattern(lavPrikker(), 'repeat');
  const sløret = document.createElement('canvas'); // til kikkertens uskarphed
  const sg = sløret.getContext('2d');
  const skrift = getComputedStyle(felt).getPropertyValue('--bog-skrift').trim() || 'Georgia, serif';

  // Tilstanden. trin: 'linse', 'naetter', 'kanten' eller 'fri'. vis… er det, der tegnes (glider mod målet).
  const s = {
    trin: 'fri',
    skarp: 0, visSkarp: 0, gnidet: false, // trin 1
    nat: 0, visNat: 0, natRørt: false, navn: false, // trin 2
    B: 0, visB: 0, maksB: 0, løft: 0, visLøft: 0, løftTegn: 1, løftet: false, // trin 3 og laboratoriet
    lab: null, // laboratoriets kapitel ('linse', 'naetter' eller 'ringen'), null i forløbet
  };
  let W = 0, H = 0, dpr = 1;
  let aktiv = true;
  let ramme = 0;
  let sidst = 0; // tiden for sidste billede (til glidningen)
  let ur = 0; // sekunder, til fingeren, der gnider
  let timere = [];
  let træk = null; // { id, x, y }
  let fang = null; // timeren, der lader nat 15 eller 17 falde på 16
  let skyder = null, dato = null, skitser = null, tavle = null;

  const vent = (ms, f) => timere.push(setTimeout(() => { if (aktiv) f(); }, ms));
  const rydTimere = () => { timere.forEach(clearTimeout); timere = []; };
  // Et kort vink i forløbets linje, kun mens trinet venter på handlingen (ikke i laboratoriet og ikke under Så)
  const vink = (tekst) => { if (fl && !s.lab && forløbVenter()) forløbVink(tekst); };

  const tegnIgen = () => {
    if (!ramme && aktiv) {
      sidst = 0;
      ramme = requestAnimationFrame(billede);
    }
  };

  function tilpas() {
    const r = lærred.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    lærred.width = Math.round(W * dpr);
    lærred.height = Math.round(H * dpr);
    // En ny størrelse tømmer lærredet: Tegn med det samme, så det ikke blinker
    cancelAnimationFrame(ramme);
    ramme = 0;
    sidst = 0;
    billede(performance.now());
  }
  const ro = new ResizeObserver(tilpas);
  ro.observe(lærred);

  // Kikkertens runde synsfelt: midten og radius i px (med plads under feltet til en linje)
  const synsfelt = () => {
    const r = Math.max(20, Math.min(W * 0.47, (H - 34) * 0.5));
    return { x: W / 2, y: Math.max(r + 2, (H - 34) / 2), r };
  };

  // Tegner figuren (tegn(g, x, y)) i synsfeltet med uskarpheden u (0 = skarp, 1 = meget uskarp). åben (0-1) lader
  // synsfeltet vokse ud over hele lærredet og kanten forsvinde (billedet "løfter sig" i trin 3).
  function iFeltet(f, u, tegn, åben = 0) {
    const r = mod(f.r, Math.hypot(W, H), glat(0, 1, åben));
    g.save();
    g.beginPath();
    g.arc(f.x, f.y, r, 0, 2 * Math.PI);
    g.clip();
    g.fillStyle = prikker;
    g.fillRect(0, 0, W, H);
    if (u < 0.02) tegn(g, f.x, f.y);
    else {
      // Tegn i lav opløsning og forstør (blødt, ikke firkantet)
      const skala = mod(1, 0.07, u);
      const sw = Math.max(4, Math.round(2 * f.r * dpr * skala));
      if (sløret.width !== sw) sløret.width = sløret.height = sw;
      sg.setTransform(sw / (2 * f.r), 0, 0, sw / (2 * f.r), 0, 0);
      sg.clearRect(0, 0, 2 * f.r, 2 * f.r);
      tegn(sg, f.r, f.r);
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = 'high';
      g.drawImage(sløret, f.x - f.r, f.y - f.r, 2 * f.r, 2 * f.r);
    }
    // Kanten af synsfeltet bliver mørkere (som i et rør)
    if (åben < 1) {
      const v = g.createRadialGradient(f.x, f.y, f.r * 0.72, f.x, f.y, f.r);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, `rgba(0,0,0,${0.55 * (1 - åben)})`);
      g.fillStyle = v;
      g.fillRect(0, 0, W, H); // hele lærredet, så der ikke kommer en firkant, når feltet vokser
    }
    g.restore();
    if (åben < 0.5) {
      g.strokeStyle = BLÆK;
      g.globalAlpha = 1 - 2 * åben;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(f.x, f.y, r + 1, 0, 2 * Math.PI);
      g.stroke();
      g.globalAlpha = 1;
    }
  }

  // Linjen under synsfeltet (med bogens skrift). lys: på den mørke bund (efter løftet)
  function linjeUnder(f, tekst, lys = false) {
    if (!tekst) return;
    g.fillStyle = lys ? FIGUR : BLÆK;
    g.font = `${Math.round(klem(f.r * 0.1, 14, 20))}px ${skrift}`;
    g.textAlign = 'center';
    g.textBaseline = 'top';
    g.fillText(tekst, f.x, Math.min(H - 24, f.y + f.r + 8));
  }

  // Glider vis… mod målet (øjeblikkeligt med ROLIG). Giver true, så længe noget bevæger sig.
  function glid(dt) {
    const k = rolig ? 1 : 1 - Math.exp(-dt * 7);
    let bevæger = false;
    for (const [vis, mål, tæt] of [['visSkarp', 'skarp', 0.002], ['visNat', 'nat', 0.002], ['visB', 'B', 0.02]]) {
      s[vis] += (s[mål] - s[vis]) * k;
      if (Math.abs(s[mål] - s[vis]) < tæt) s[vis] = s[mål];
      else bevæger = true;
    }
    // Løftet tager ca. 1,6 s (lige meget, hvor langt der er)
    if (s.visLøft !== s.løft) {
      s.visLøft = rolig ? s.løft : klem(s.visLøft + Math.sign(s.løft - s.visLøft) * dt / 1.6, 0, 1);
      bevæger = true;
    } else if (s.visLøft >= 1 && !s.løftet) {
      // Billedet har løftet sig: Nu kan man selv dreje den skarpe ring (også under Så, B1)
      s.løftet = true;
      s.B = s.visB = 24 * s.løftTegn;
    }
    return bevæger;
  }

  function billede(nu) {
    ramme = 0;
    if (!aktiv || s.trin === 'annulo') return; // i trin 4 er lærredet skjult
    const dt = sidst ? Math.min(0.1, (nu - sidst) / 1000) : 0;
    sidst = nu;
    ur += dt;
    let mere = glid(dt);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const f = synsfelt();
    if (s.trin === 'linse') mere = tegnLinse(f) || mere;
    else if (s.trin === 'naetter') tegnNætter(f);
    else tegnKanten(f);
    if (mere) {
      ramme = requestAnimationFrame(billede);
    } else sidst = 0;
  }

  // ---------- Trin 1: linsen ----------
  function tegnLinse(f) {
    const sk = s.visSkarp;
    const m = glat(0.35, 0.85, sk); // fra Galileis kugler til Huygens' arme
    const R = f.r * 0.2;
    iFeltet(f, mod(0.75, 0, glat(0, 1, sk)), (c, x, y) => {
      if (m < 1) tegnGalilei(c, x, y, R, 1 - m);
      if (m > 0) tegnSaturn(c, x, y, R, B_1655, m);
    });
    linjeUnder(f, m < 0.5 ? 'Galileis kikkert, 1610' : 'Huygens\' kikkert, 1655');
    // En finger, der gnider rundt, til man selv har gnidet (står stille med ROLIG)
    if (!s.gnidet && sk === 0) {
      const v = rolig ? 0.6 : ur * 3.6;
      const hx = f.x + Math.cos(v) * f.r * 0.32, hy = f.y + f.r * 0.42 + Math.sin(v) * f.r * 0.12;
      g.save();
      g.font = `${Math.round(klem(f.r * 0.2, 28, 46))}px sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.shadowColor = 'rgba(0,0,0,0.7)';
      g.shadowBlur = 8;
      g.fillText('👆', hx, hy);
      g.restore();
      return !rolig;
    }
    return false;
  }

  function slib(mængde) {
    if (s.trin !== 'linse') return;
    forløbRørt(); // gnider man uden at gætte, toner gættet væk
    s.skarp = klem(s.skarp + mængde, 0, 1);
    tegnIgen();
  }

  // ---------- Trin 2: nætterne ----------
  const titanVinkel = (n) => 0.45 + (2 * Math.PI * n) / TITAN_DØGN;

  function tegnNætter(f) {
    const R = f.r / 25; // Saturns radius, så Titans bane (20,3 R) passer i synsfeltet
    const a = TITAN_AFSTAND * R, b = a * 0.1;
    const pos = (n) => { const v = titanVinkel(n); return [f.x + a * Math.cos(v), f.y + b * Math.sin(v)]; };
    const hjemme = s.nat === NAT_MÅL && s.visNat === NAT_MÅL;
    iFeltet(f, 0, (c, x, y) => {
      tegnSaturn(c, x, y, R, B_1655);
      // Mærket, hvor prikken startede
      const [sx, sy] = pos(0);
      c.strokeStyle = hjemme ? 'rgba(255, 214, 120, 0.95)' : 'rgba(243, 234, 215, 0.6)';
      c.lineWidth = hjemme ? 2 : 1;
      c.beginPath();
      c.arc(sx, sy, Math.max(5, f.r * 0.035), 0, 2 * Math.PI);
      c.stroke();
      // Titan: en svag prik
      const [tx, ty] = pos(s.visNat);
      c.fillStyle = 'rgba(243, 234, 215, 0.9)';
      c.shadowColor = 'rgba(243, 234, 215, 0.8)';
      c.shadowBlur = 4;
      c.beginPath();
      c.arc(tx, ty, Math.max(2.2, f.r * 0.014), 0, 2 * Math.PI);
      c.fill();
      c.shadowBlur = 0;
      if (s.navn) {
        c.fillStyle = FIGUR;
        c.font = `${Math.round(klem(f.r * 0.09, 14, 20))}px ${skrift}`;
        c.textAlign = 'center';
        c.textBaseline = 'bottom';
        c.fillText('Titan', tx, ty - Math.max(8, f.r * 0.05));
      }
    });
  }

  function opdaterSkitser() {
    if (!skyder) return;
    skyder.value = String(s.nat);
    dato.textContent = s.nat === 0 ? nattensDato(0) : `${nattensDato(s.nat)} · ${s.nat} ${s.nat === 1 ? 'nat' : 'nætter'} senere`;
    // Rækken "* O" (som s. 16-17): de sidste seks nætter, hvor prikken står til venstre eller højre for Saturn
    const fra = Math.max(0, s.nat - 5);
    let html = '';
    for (let n = fra; n <= s.nat; n++) {
      const x = Math.cos(titanVinkel(n)) * 24;
      html += `<span class="hs-skitse${n === s.nat ? ' nu' : ''}"><i style="left:calc(50% + ${x.toFixed(1)}px)">*</i>O</span>`;
    }
    skitser.innerHTML = html;
  }

  function sætNat(n) {
    if (s.trin !== 'naetter') return;
    forløbRørt();
    s.nat = klem(Math.round(n), 0, NAT_MAKS);
    s.natRørt = true;
    clearTimeout(fang);
    if (s.lab) {
      if (s.nat === NAT_MÅL) s.navn = true;
    } else if (Math.abs(s.nat - NAT_MÅL) === 1) {
      // Tæt på tæller: Prikken falder selv på plads det sidste stykke
      fang = setTimeout(() => { if (aktiv && s.trin === 'naetter' && Math.abs(s.nat - NAT_MÅL) === 1) sætNat(NAT_MÅL); }, rolig ? 0 : FANG_EFTER);
      vink('');
    } else if (s.nat > NAT_MÅL + 1) vink(fl?.vink?.forbi ?? '');
    else vink('');
    opdaterSkitser();
    tegnIgen();
  }

  // ---------- Trin 3: ringen fra kanten ----------
  function tegnKanten(f) {
    const L = glat(0, 1, s.visLøft);
    const B = s.løftet ? s.visB : mod(s.visB, 24 * s.løftTegn, L);
    const R = f.r * mod(0.27, 0.24, L);
    iFeltet(f, mod(0.25, 0, L), (c, x, y) => tegnSaturn(c, x, y, R, B), L);
    let tekst = '';
    if (L > 0.5) tekst = Math.abs(B) < 0.8 ? 'Set fra kanten' : `Den samme ring, set ${B > 0 ? 'ovenfra' : 'nedefra'}`;
    else if (Math.abs(s.visB) < 0.8) tekst = 'Set fra kanten';
    linjeUnder(f, tekst, L > 0.5);
    // Tavlens tegning, der ligner, lyser op
    if (tavle) {
      const nu = L > 0 ? null : TAVLE.find((t) => Math.abs(s.visB) >= t.fra && Math.abs(s.visB) < t.til)?.id;
      for (const el of tavle.children) el.classList.toggle('lyser', el.dataset.tavle === nu);
    }
  }

  function drej(B) {
    if (!(s.trin === 'kanten' || s.trin === 'fri')) return;
    if (s.løftVenter && !s.løftet) return; // mens billedet løfter sig
    forløbRørt();
    const før = s.B;
    s.B = klem(B, -B_MAKS, B_MAKS);
    if (s.trin === 'kanten' && !s.løftVenter) {
      // Et hurtigt træk kan springe over kanten (fra +2° til -3°): Det tæller som kanten
      if (s.maksB >= B_ÅBEN && før * s.B < 0) s.B = 0;
      s.maksB = Math.max(s.maksB, Math.abs(s.B));
      // Tæt på kanten efter at have åbnet ringen: Den falder selv på plads, og billedet løfter sig
      if (s.maksB >= B_ÅBEN && Math.abs(s.B) < KANT_TÆT) {
        s.B = 0;
        s.løftVenter = true;
        s.løftTegn = s.visB >= 0 ? 1 : -1;
        vink('');
        vent(rolig ? 0 : 350, () => { s.løft = 1; tegnIgen(); });
      } else if (Math.abs(s.B) >= B_MAKS) vink(fl?.vink?.helt ?? '');
      else if (s.maksB >= B_ÅBEN) vink('');
    }
    tegnIgen();
  }

  // ---------- Det under lærredet ----------
  function underNætter() {
    under.innerHTML = '<label class="hs-nat"><span class="hs-nat-tekst"></span>'
      + `<input type="range" min="0" max="${NAT_MAKS}" step="1" value="0" aria-label="Nætter efter 25. marts 1655"></label>`
      + '<div class="hs-skitser" aria-hidden="true"></div>';
    skyder = under.querySelector('input');
    dato = under.querySelector('.hs-nat-tekst');
    skitser = under.querySelector('.hs-skitser');
    skyder.addEventListener('input', () => sætNat(Number(skyder.value)));
    opdaterSkitser();
  }

  function underTavle() {
    const div = document.createElement('div');
    div.className = 'hs-tavle';
    div.setAttribute('aria-label', 'Tegninger fra tavlen i Huygens\' bog');
    div.innerHTML = TAVLE.map((t) => `<figure data-tavle="${t.id}">${tavleSVG(t.id)}<figcaption>${t.navn}</figcaption></figure>`).join('');
    under.append(div);
    tavle = div;
  }

  // ---------- Fingeren og musen på lærredet ----------
  const ned = (h) => {
    if (!h.isPrimary) return;
    træk = { id: h.pointerId, x: h.clientX, y: h.clientY };
    lærred.setPointerCapture?.(h.pointerId);
    if (s.trin === 'linse') s.gnidet = true;
  };
  const flyt = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    const dx = h.clientX - træk.x, dy = h.clientY - træk.y;
    træk.x = h.clientX;
    træk.y = h.clientY;
    const f = synsfelt();
    if (s.trin === 'linse') slib(Math.hypot(dx, dy) / (f.r * 8)); // et par runder med fingeren
    else if (s.trin === 'kanten' || s.trin === 'fri') drej(s.B + (dy / f.r) * 30);
  };
  const op = (h) => { if (træk && h.pointerId === træk.id) træk = null; };
  lærred.addEventListener('pointerdown', ned);
  lærred.addEventListener('pointermove', flyt);
  lærred.addEventListener('pointerup', op);
  lærred.addEventListener('pointercancel', op);

  function sætTrin(trin) {
    rydTimere();
    clearTimeout(fang);
    s.trin = trin;
    s.lab = null;
    skyder = dato = skitser = tavle = null;
    ag?.fjern();
    ag = null;
    under.replaceChildren();
    felt.classList.toggle('hs-ord', trin === 'annulo');
    const etiket = {
      linse: 'Saturn i en kikkert: først slørede kugler, der bliver til to tynde arme, når linsen er slebet',
      naetter: 'Saturn med en svag prik, der går rundt om den i en smal ellipse',
      kanten: 'Saturn med ringen set fra forskellige vinkler',
      fri: 'Saturn med ringen, som du selv kan dreje',
      annulo: 'Saturn er rund',
    }[trin];
    lærred.setAttribute('aria-label', etiket);
    tegnIgen();
  }

  function sætKapitel(t) {
    if (kapitel) kapitel.textContent = t ?? titel;
  }

  function forløbDel(data) {
    fl = data;
    const trin = {
      linse: {
        start() {
          sætTrin('linse');
          Object.assign(s, { skarp: 0, visSkarp: 0, gnidet: false });
          ur = 0;
        },
        knapper: [{ id: 'slib', tekst: 'Slib linsen', gør: () => { s.gnidet = true; slib(0.25); } }],
        færdig: () => s.skarp >= 1 && s.visSkarp > 0.97,
        visMig: () => { s.gnidet = true; slib(1); },
      },
      naetter: {
        start() {
          sætTrin('naetter');
          Object.assign(s, { nat: 0, visNat: 0, natRørt: false, navn: false });
          underNætter();
        },
        færdig() {
          const ja = s.natRørt && s.nat === NAT_MÅL && Math.abs(s.visNat - NAT_MÅL) < 0.05;
          // Navnet Titan kommer frem sammen med Så (forløbet viser Så 0,7 s efter)
          if (ja && !s.navn) vent(700, () => { s.navn = true; tegnIgen(); });
          return ja;
        },
        visMig: () => sætNat(NAT_MÅL),
      },
      kanten: {
        start() {
          sætTrin('kanten');
          Object.assign(s, { B: 0, visB: 0, maksB: 0, løft: 0, visLøft: 0, løftVenter: false, løftet: false });
          underTavle();
        },
        get knapper() {
          return [
            { id: 'aaben', tekst: 'Åbn armene', gør: () => drej((s.B < 0 ? -1 : 1) * Math.min(B_MAKS, Math.abs(s.B) + 7)), aktiv: () => !s.løft && Math.abs(s.B) < B_MAKS },
            { id: 'kant', tekst: 'Mod kanten', gør: () => drej(Math.sign(s.B) * Math.max(0, Math.abs(s.B) - 7)), aktiv: () => !s.løft && s.B !== 0 },
          ];
        },
        færdig: () => s.visLøft >= 1,
        visMig() {
          drej(18);
          vent(rolig ? 300 : 1300, () => drej(0));
        },
      },
      annulo: {
        start() {
          sætTrin('annulo');
          if (anagram) ag = lavAnagram(under, anagram, { rolig, påRørt: forløbRørt });
        },
        færdig: () => ag?.færdig() ?? true,
        visMig: () => ag?.visMig(),
      },
    };
    // Kapitlets titel følger trinet (fx "Haag, 1655")
    for (const t of data.trin) {
      const d = trin[t.id];
      if (!d) continue;
      const start = d.start;
      d.start = () => { sætKapitel(t.kapitel); start(); };
    }
    return { trin };
  }

  // Laboratoriet: de tre kapitler som tre valg (stilguiden B7). Et tryk på det valgte starter det forfra.
  function fri(kap = 'ringen') {
    sætKapitel(titel);
    if (kap === 'linse') {
      sætTrin('linse');
      Object.assign(s, { skarp: 0, visSkarp: 0, gnidet: false });
      ur = 0;
    } else if (kap === 'naetter') {
      sætTrin('naetter');
      Object.assign(s, { nat: 0, visNat: 0, natRørt: false, navn: false });
      underNætter();
    } else {
      kap = 'ringen';
      sætTrin('fri');
      Object.assign(s, { B: 14, visB: 14, løft: 0, visLøft: 0, løftet: false });
      underTavle();
    }
    s.lab = kap;
    const kapitler = tekster.kapitler ?? [];
    const valg = document.createElement('div');
    valg.className = 'hs-kapitler';
    valg.setAttribute('role', 'group');
    valg.setAttribute('aria-label', 'Prøv et kapitel');
    for (const k of kapitler) {
      const b = document.createElement('button');
      b.className = 'hs-kapitel';
      b.textContent = k.tekst;
      b.setAttribute('aria-pressed', String(k.id === kap));
      b.addEventListener('click', () => fri(k.id));
      valg.append(b);
    }
    const p = document.createElement('p');
    p.className = 'hs-linje';
    p.textContent = kapitler.find((k) => k.id === kap)?.linje ?? tekster.linje ?? '';
    const igen = document.createElement('button');
    igen.className = 'knap hs-igen';
    igen.textContent = `${tekster.igen ?? 'Fortæl det igen'} ›`;
    igen.addEventListener('click', () => påIgen?.());
    under.prepend(valg);
    under.append(p, igen);
    tegnIgen();
  }

  return {
    forløbDel,
    fri,
    fjern() {
      aktiv = false;
      rydTimere();
      clearTimeout(fang);
      ag?.fjern();
      cancelAnimationFrame(ramme);
      ramme = 0;
      ro.disconnect();
      lærred.removeEventListener('pointerdown', ned);
      lærred.removeEventListener('pointermove', flyt);
      lærred.removeEventListener('pointerup', op);
      lærred.removeEventListener('pointercancel', op);
      felt.replaceChildren();
    },
    test: {
      tilstand: () => ({ trin: s.trin, skarp: s.skarp, nat: s.nat, B: s.B, maksB: s.maksB, løft: s.visLøft, løftet: s.løftet, navn: s.navn, lab: s.lab, lyser: tavle?.querySelector('.lyser')?.dataset.tavle ?? null, anagram: ag?.tilstand() ?? null }),
      bogstav: (b) => ag?.tryk(b) ?? false,
      lab: (kap) => fri(kap),
      slib,
      nat: sætNat,
      drej,
    },
  };
}
