// Tegningerne i bogen om Tycho Brahe (Opdagelserne, docs/drejebog-tycho.md, afsnit 5): turen "Den nye stjerne" i et lærred
// i 2D. Himlen er mørk med de rigtige stjerner (Cassiopeia, NY_STJERNE og projicer fra js/data/opdagelser/tycho.js, som
// forsiden), og tommelfingeren og "kugle i kugle" er tegnet med blæk på papir som figuren i hans bog (s. C2b).
//
// lavFortælling(felt, { rolig, tekster, påIgen }) fylder opslagets felt (.bog-scene fra js/bog.js) og giver
//   forløbDel(data)  det, Forløb-klodsen (js/forloeb.js) skal bruge pr. trin-id (start, knapper, færdig, visMig)
//   fri(kapitel)     laboratoriet efter turen: de fire kapitler som valg (standard "Højt og lavt") og "Fortæl det igen"
//   fjern()          stopper tegningen, timerne og lytterne
//   test             til testadgangen (tilstanden og handlingerne)
//
// Trinene (T2, 19. november 2026). Scenen virker i alle faser (et tryk mens man gætter kalder forløbRørt()), og målene er
// runde (stilguiden B):
//   stjernen    Cassiopeias W over klostertaget. Efter 2 s (eller når man rører himlen) lyser den nye stjerne op, til den
//               er den klareste. Et tryk tæt på den (mindst 28 px eller 1,8°) tæller. Navnet står først bagefter (A6).
//               Den lille tegning "Før" i hjørnet viser W'et uden den nye stjerne
//   parallakse  To tegninger: tommelfingeren foran klosteret langt væk (skift øje, og den hopper) og Jorden med Månen og
//               stjernehimlen (flyt Tycho fra toppen til siden af Jorden, og Månen ses et andet sted mellem stjernerne).
//               Færdig, når begge er skiftet. Den nye stjerne er ikke med her, for det er svaret i trin 3 (A6)
//   hoejt       Himlen drejer om Nordstjernen (himmelskiven), og "Tychos instrument" viser den nye stjerne og Schedir tæt på
//               med passeren: 7° 55′ hele vejen rundt. Spøgelset viser, hvor den ville stå, hvis den var lige så tæt på
//               som Månen (måling() i dataene: op til ca. 1° anderledes, når den står lavt). Færdig efter højt (over 70°)
//               og lavt (under 35°)
//   falmer      W'et og en skyder med månederne fra november 1572 til februar 1574. Stjernen bliver mindre, rød og bleg,
//               og prikkerne under skyderen lyser ved det, Tycho sammenlignede med. Færdig i begyndelsen af 1574
//
// Snyd, der skal stå i "Ærligt talt" (T3): Tommelfingeren og Jorden med Månen er ikke i rigtig størrelse (Månen er ca. 60
// jordradier væk, her ca. 2,6). Instrumentet er tegnet som en passer, ikke som Tychos sekstant. Klostertaget står højere,
// end et rigtigt tag ville, så man kan se horisonten. Stjernens lysstyrke måned for måned er omtrentlig, og farvernes
// måneder før maj er vores bud. Tegner kun, når noget bevæger sig.

import { forløbRørt, forløbVenter, forløbVink } from '../forloeb.js';
import {
  CASSIOPEIA, NY_STJERNE, projicer, BAGGRUND, NORDSTJERNEN, iPolkort, måling, grader, højde, højestVed, HERREVAD,
  MÅNEDER, MÅNED_MÅL, SAMMENLIGN,
} from '../data/opdagelser/tycho.js';

const NAT_TOP = '#0a1220', NAT_BUND = '#1c2a44'; // nattehimlen (bunden er bogens ryg)
const STJERNE = [246, 241, 226];
const GULD = '#c9a24a';
const BLÆK = '#1e1a16';
const PAPIR = '#ece0c4';
const SKIND = '#ecd8b8';
const HØJT = 70, LAVT = 35; // grader over horisonten (drejebogen)
const LYS_EFTER = 2000; // ms, før den nye stjerne begynder at lyse op
const LYS_TID = 3; // sekunder, til den er helt tændt
const TAG_HØJDE = 20; // klostertagets top i grader over horisonten (højere end et rigtigt tag, se toppen)
const GR = Math.PI / 180;
const NAVNE = { schedar: 'Schedir', kaph: 'Kaph', gamma: 'γ', ruchbah: 'Ruchbah', segin: 'Segin' };

const glat = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mod = (a, b, t) => a + (b - a) * t;
const klem = (x, a, b) => Math.max(a, Math.min(b, x));
const rgb = (f, a = 1) => `rgba(${f[0]}, ${f[1]}, ${f[2]}, ${a})`;

// Baggrundens svage stjerner (fast frø, så himlen er den samme hver gang): jævnt over himlen nord for dek 20°, ikke tæt
// på W'ets stjerner eller den nye stjerne
const SVAGE = (() => {
  let frø = 11;
  const t = () => ((frø = (frø * 16807) % 2147483647) / 2147483647);
  const ud = [];
  const tæt = [...CASSIOPEIA, NY_STJERNE];
  while (ud.length < 700) {
    const ra = t() * 24, dek = Math.asin(mod(Math.sin(20 * GR), 1, t())) / GR;
    const mag = 6.2 - 2.4 * t() ** 2.2;
    if (tæt.some((s) => Math.abs(s.dek - dek) < 1.2 && Math.abs((s.ra - ra) * 15 * Math.cos(dek * GR)) < 1.2)) continue;
    ud.push({ ra, dek, mag });
  }
  return ud;
})();

// En stjerne: en prik med glød, størrelsen efter lysstyrken (k er skalaen for hele tegningen)
function prik(g, x, y, mag, k, farve = STJERNE, alfa = 1) {
  if (mag > 6.5 || alfa <= 0) return;
  const r = klem(0.5 + (6.2 - mag) * 0.62, 0.5, 9) * k;
  const a = alfa * klem((6.6 - mag) / 2.2, 0.15, 1);
  if (mag < 2.6) {
    const glød = g.createRadialGradient(x, y, 0, x, y, r * 3.4);
    glød.addColorStop(0, rgb(farve, 0.4 * a));
    glød.addColorStop(1, rgb(farve, 0));
    g.fillStyle = glød;
    g.beginPath();
    g.arc(x, y, r * 3.4, 0, 2 * Math.PI);
    g.fill();
  }
  if (mag < -0.5) {
    // Fire tynde stråler ved de klareste
    g.strokeStyle = rgb(farve, 0.55 * a);
    g.lineWidth = Math.max(0.7, r * 0.18);
    const l = r * mod(2.5, 5, klem((-0.5 - mag) / 3.5, 0, 1));
    g.beginPath();
    g.moveTo(x - l, y); g.lineTo(x + l, y);
    g.moveTo(x, y - l); g.lineTo(x, y + l);
    g.stroke();
  }
  g.fillStyle = rgb(farve, a);
  g.beginPath();
  g.arc(x, y, r, 0, 2 * Math.PI);
  g.fill();
}

// En nattehimmel-plade: afrundet med en fin dobbelt ramme i blæk (som en tavle i bogen)
function natPlade(g, x, y, w, h, r = 8) {
  const v = g.createLinearGradient(0, y, 0, y + h);
  v.addColorStop(0, NAT_TOP);
  v.addColorStop(1, NAT_BUND);
  g.fillStyle = v;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}
function ramme(g, x, y, w, h, r = 8) {
  g.strokeStyle = BLÆK;
  g.lineWidth = 1.6;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.stroke();
  g.lineWidth = 0.7;
  g.beginPath();
  g.roundRect(x + 3.5, y + 3.5, w - 7, h - 7, Math.max(2, r - 3));
  g.stroke();
}

// Klostertaget og trætoppene mod himlen (en silhuet). bund er pladens nederste kant, top tagets top i px
function klostertag(g, x0, x1, top, bund, midt) {
  const h = bund - top;
  g.fillStyle = '#05080f';
  g.beginPath();
  g.moveTo(x0, bund);
  g.lineTo(x0, top + h * 0.55);
  // Trætoppe til venstre
  let n = 0;
  const træ = () => [0.2, 0.27, 0.17, 0.31, 0.22][n++ % 5];
  for (let x = x0, r = træ(); x < midt - h * 1.1; x += h * r * 1.6, r = træ()) g.arc(x + h * r * 0.8, top + h * (0.62 - r), h * r, Math.PI, 0);
  // Taget med en lille tagrytter (tårn) midt på
  g.lineTo(midt - h * 1.1, top + h * 0.5);
  g.lineTo(midt - h * 0.12, top + h * 0.05);
  g.lineTo(midt - h * 0.12, top - h * 0.3);
  g.lineTo(midt, top - h * 0.62);
  g.lineTo(midt + h * 0.12, top - h * 0.3);
  g.lineTo(midt + h * 0.12, top + h * 0.05);
  g.lineTo(midt + h * 1.1, top + h * 0.5);
  for (let x = midt + h * 1.1, r = træ(); x < x1; x += h * r * 1.6, r = træ()) g.arc(x + h * r * 0.8, top + h * (0.74 - r), h * r, Math.PI, 0);
  g.lineTo(x1, bund);
  g.closePath();
  g.fill();
}

export function lavFortælling(felt, { rolig = false, tekster = {}, påIgen = null } = {}) {
  let fl = null; // forløbets data (vinkene), når forløbet kører
  felt.innerHTML = '<div class="hs-lærred"><canvas role="img"></canvas></div><div class="hs-under"></div>';
  const lærred = felt.querySelector('canvas');
  const under = felt.querySelector('.hs-under');
  const g = lærred.getContext('2d');
  const kapitel = felt.closest('.bog-opslag')?.querySelector('.bog-kapitel');
  const titel = kapitel?.textContent ?? '';
  const skrift = getComputedStyle(felt).getPropertyValue('--bog-skrift').trim() || 'Georgia, serif';

  // Tilstanden. trin: 'stjernen', 'parallakse', 'hoejt', 'falmer'. vis… glider mod målet.
  const s = {
    trin: 'hoejt',
    lys: 0, fundet: false, forkert: 0, // trin 1
    øje: 1, visØje: 1, sted: 0, visSted: 0, øjeSkift: 0, stedSkift: 0, // trin 2 (øje: 1 venstre, -1 højre. sted: 0 toppen, 1 siden)
    θ: 0, visθ: 0, højt: false, lavt: false, // trin 3 (θ: stjernetiden i grader)
    måned: 0, visMåned: 0, månedRørt: false, // trin 4
    lab: null,
  };
  let W = 0, H = 0, dpr = 1;
  let aktiv = true;
  let ramme1 = 0;
  let sidst = 0;
  let timere = [];
  let træk = null; // { id, x, y, sx, sy, flyttet, dreje: 'skive' | 'instrument' | null }
  let lysStart = null; // tiden (s), hvor den nye stjerne begyndte at lyse
  let ur = 0;
  let visning = null; // trin 3: { skive: { cx, cy, r }, instrument: { x, y, w, h } }
  let forrigeP = null; // trin 2: hvor Månen sås før (til den svage ring)
  let tommelFør = null; // trin 2: tommelfingerens forrige plads
  let skyder = null, månedTekst = null, sammenTekst = null, sammen = null, mål = null;

  const vent = (ms, f) => timere.push(setTimeout(() => { if (aktiv) f(); }, ms));
  const rydTimere = () => { timere.forEach(clearTimeout); timere = []; };
  const vink = (tekst) => { if (fl && !s.lab && forløbVenter()) forløbVink(tekst); };
  const tegnIgen = () => {
    if (!ramme1 && aktiv) {
      sidst = 0;
      ramme1 = requestAnimationFrame(billede);
    }
  };

  function tilpas() {
    const r = lærred.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    lærred.width = Math.round(W * dpr);
    lærred.height = Math.round(H * dpr);
    cancelAnimationFrame(ramme1);
    ramme1 = 0;
    sidst = 0;
    billede(performance.now());
  }
  const ro = new ResizeObserver(tilpas);
  ro.observe(lærred);

  // Skalaen for prikkerne (mindre på en telefon)
  const pk = () => klem(Math.min(W, H) / 380, 0.75, 1.5);

  // inden: [venstre, højre] holder en centreret tekst inden for billedet
  function tekst(t, x, y, { str = 15, farve = 'rgba(246, 241, 226, 0.85)', align = 'center', base = 'middle', kursiv = false, inden = null } = {}) {
    g.font = `${kursiv ? 'italic ' : ''}${Math.round(str)}px ${skrift}`;
    if (inden && align === 'center') {
      const b = g.measureText(t).width / 2 + 6;
      x = klem(x, inden[0] + b, Math.max(inden[0] + b, inden[1] - b));
    }
    g.fillStyle = farve;
    g.textAlign = align;
    g.textBaseline = base;
    g.fillText(t, x, y);
  }

  function glid(dt) {
    let bevæger = false;
    const k = rolig ? 1 : 1 - Math.exp(-dt * 6);
    const kθ = rolig ? 1 : 1 - Math.exp(-dt * 3.2);
    for (const [vis, mål, tæt, kk] of [['visØje', 'øje', 0.003, k], ['visSted', 'sted', 0.002, k], ['visMåned', 'måned', 0.004, k], ['visθ', 'θ', 0.05, kθ]]) {
      s[vis] += (s[mål] - s[vis]) * kk;
      if (Math.abs(s[mål] - s[vis]) < tæt) s[vis] = s[mål];
      else bevæger = true;
    }
    if (lysStart != null && s.lys < 1) {
      s.lys = rolig ? 1 : klem((ur - lysStart) / LYS_TID, 0, 1);
      bevæger = true;
    }
    return bevæger;
  }

  function billede(nu) {
    ramme1 = 0;
    if (!aktiv) return;
    const dt = sidst ? Math.min(0.1, (nu - sidst) / 1000) : 0;
    sidst = nu;
    ur += dt;
    const mere = glid(dt);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    if (s.trin === 'stjernen') tegnStjernen();
    else if (s.trin === 'parallakse') tegnParallakse();
    else if (s.trin === 'hoejt') tegnHøjtLavt();
    else tegnFalmer();
    if (s.trin === 'hoejt') opdaterMåling();
    if (s.trin === 'falmer') opdaterMåned();
    if (mere) ramme1 = requestAnimationFrame(billede);
    else sidst = 0;
  }

  // ---------- Cassiopeia som på forsiden (trin 1 og 4) ----------
  // projicer giver grader på et kort om W'ets midte (drejet, så W'et står vandret med den nye stjerne øverst)
  const W_KORT = projicer([...CASSIOPEIA, NY_STJERNE]);
  const BAG_KORT = projicer([...BAGGRUND, ...SVAGE].filter((x) => Math.abs(x.dek - 60.5) < 34 && Math.cos((x.ra - 0.85) * 15 * GR) > Math.cos(70 * GR)));
  const W_MIDTE = { x: -1.35, y: 0.75 };

  // Kortets grader til px: midten (mx, my) i px og k px pr. grad
  function wVisning(mx, my, k) {
    return (p) => [mx + (p.x - W_MIDTE.x) * k, my - (p.y - W_MIDTE.y) * k];
  }

  function tegnW(til, k, { ny = null, navne = false, linje = true } = {}) {
    const p = pk();
    for (const b of BAG_KORT) {
      const [x, y] = til(b);
      if (x > -10 && x < W + 10 && y > -10 && y < H + 10) prik(g, x, y, b.mag, p);
    }
    const w = W_KORT.filter((x) => x.id !== 'ny');
    if (linje) {
      // W'et som en svag, prikket linje (som på forsiden)
      g.strokeStyle = 'rgba(246, 241, 226, 0.22)';
      g.setLineDash([2, 5]);
      g.lineWidth = 1;
      g.beginPath();
      w.forEach((st, i) => { const [x, y] = til(st); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
      g.stroke();
      g.setLineDash([]);
    }
    for (const st of w) {
      const [x, y] = til(st);
      prik(g, x, y, st.mag, p);
      if (navne && st.id === 'schedar') tekst(NAVNE.schedar, x, y + 14 * p, { str: 14, base: 'top' });
    }
    if (ny) {
      const [x, y] = til(W_KORT.find((x) => x.id === 'ny'));
      prik(g, x, y, ny.mag, p, ny.farve ?? STJERNE);
      return [x, y];
    }
    return null;
  }

  // ---------- Trin 1: den nye stjerne ----------
  function stjernenSted() {
    const k = Math.min(W / 24, H * 0.7 / 11);
    return { k, til: wVisning(W / 2, H * 0.44, k) };
  }

  function tegnStjernen() {
    natPlade(g, 0, 0, W, H);
    const { k, til } = stjernenSted();
    const mag = mod(7, -4, glat(0, 1, s.lys));
    const [nx, ny] = tegnW(til, k, { ny: { mag } });
    // Cassiopeia under W'et (navnet står i spørgsmålet)
    const [, wy] = til({ x: W_MIDTE.x, y: -4.8 });
    tekst('Cassiopeia', W / 2, wy, { str: 15, farve: 'rgba(246, 241, 226, 0.55)', kursiv: true });
    if (s.fundet) {
      g.strokeStyle = GULD;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(nx, ny, Math.max(16, 1.1 * k), 0, 2 * Math.PI);
      g.stroke();
      tekst('Den nye stjerne', nx, ny - Math.max(16, 1.1 * k) - 6, { str: 16, farve: '#f3dfa6', base: 'bottom' });
    }
    klostertag(g, 0, W, H * 0.86, H, W * 0.62);
    // "Før": W'et uden den nye stjerne i hjørnet
    const b = klem(Math.min(W, H) * 0.32, 90, 160), h = b * 0.66, x0 = 10, y0 = 10;
    g.fillStyle = 'rgba(5, 9, 18, 0.85)';
    g.beginPath();
    g.roundRect(x0, y0, b, h, 6);
    g.fill();
    g.strokeStyle = 'rgba(201, 162, 74, 0.7)';
    g.lineWidth = 1;
    g.stroke();
    const kf = (b * 0.78) / 14;
    const tilF = wVisning(x0 + b / 2, y0 + h * 0.58, kf);
    for (const st of W_KORT.filter((x) => x.id !== 'ny')) {
      const [x, y] = tilF(st);
      prik(g, x, y, st.mag, 0.75);
    }
    tekst('Før', x0 + 8, y0 + 6, { str: 14, align: 'left', base: 'top', farve: 'rgba(243, 223, 166, 0.9)' });
    lærred.setAttribute('aria-label', s.fundet
      ? 'Cassiopeias W over klostertaget, og over W\'et den nye, strålende stjerne'
      : 'Cassiopeias W over et klostertag. Tryk på stjernen, der ikke var der før');
  }

  function tænd() {
    if (lysStart == null) {
      lysStart = ur;
      tegnIgen();
    }
  }

  function trykStjernen(x, y) {
    forløbRørt();
    if (s.lys < 0.15) { tænd(); return; } // når man rører himlen, lyser den op
    const { k, til } = stjernenSted();
    const [nx, ny] = til(W_KORT.find((p) => p.id === 'ny'));
    if (Math.hypot(x - nx, y - ny) <= Math.max(28, 1.8 * k)) find();
    else if (!s.fundet) {
      s.forkert++;
      vink(fl?.vink?.forkert ?? '');
    }
  }
  function find() {
    if (s.trin !== 'stjernen') return;
    tænd();
    s.lys = Math.max(s.lys, 0.15);
    s.fundet = true;
    vink('');
    tegnIgen();
  }

  // ---------- Trin 2: tommelfingeren og Månen ----------
  function paneler() {
    const gap = 10;
    if (W >= H * 1.25) {
      const b = (W - gap) / 2;
      return [{ x: 0, y: 0, w: b, h: H }, { x: b + gap, y: 0, w: b, h: H }];
    }
    const h = (H - gap) / 2;
    return [{ x: 0, y: 0, w: W, h }, { x: 0, y: h + gap, w: W, h }];
  }

  function papirPlade(p) {
    g.fillStyle = PAPIR;
    g.beginPath();
    g.roundRect(p.x, p.y, p.w, p.h, 8);
    g.fill();
    ramme(g, p.x, p.y, p.w, p.h);
  }

  function tommel(cx, bund, h, b, { stiplet = false } = {}) {
    // Hånden (en knytnæve) nederst og tommelfingeren op
    const tb = b * 0.42;
    const form = (f) => {
      g.beginPath();
      f();
      if (stiplet) {
        g.setLineDash([4, 4]);
        g.strokeStyle = 'rgba(30, 26, 22, 0.35)';
        g.lineWidth = 1.2;
        g.stroke();
        g.setLineDash([]);
      } else {
        g.fillStyle = SKIND;
        g.fill();
        g.strokeStyle = BLÆK;
        g.lineWidth = 1.8;
        g.stroke();
      }
    };
    // Tommelfingeren først, så næven, der dækker dens rod
    form(() => g.roundRect(cx - tb / 2, bund - h, tb, h * 0.75, tb / 2));
    form(() => g.roundRect(cx - b / 2, bund - h * 0.36, b, h * 0.36 + 12, b * 0.28));
    if (stiplet) return;
    // Neglen og fingrenes linjer
    g.beginPath();
    g.roundRect(cx - tb * 0.3, bund - h + tb * 0.18, tb * 0.6, tb * 0.7, tb * 0.25);
    g.fillStyle = '#f7ecd8';
    g.fill();
    g.lineWidth = 1;
    g.stroke();
    g.beginPath();
    for (let i = 1; i < 4; i++) {
      const y = bund - h * 0.36 + (h * 0.36) * (i / 4.2);
      g.moveTo(cx - b * 0.36, y);
      g.lineTo(cx + b * 0.36, y);
    }
    g.globalAlpha = 0.5;
    g.stroke();
    g.globalAlpha = 1;
  }

  function øjne(cx, y, r, venstre) {
    // To øjne: det åbne med en pupil, det lukkede som en bue
    for (const [dx, åben] of [[-r * 1.5, venstre], [r * 1.5, !venstre]]) {
      g.strokeStyle = BLÆK;
      g.lineWidth = 1.6;
      g.beginPath();
      if (åben) {
        g.ellipse(cx + dx, y, r, r * 0.55, 0, 0, 2 * Math.PI);
        g.stroke();
        g.fillStyle = BLÆK;
        g.beginPath();
        g.arc(cx + dx, y, r * 0.3, 0, 2 * Math.PI);
        g.fill();
      } else {
        g.arc(cx + dx, y - r * 0.4, r, 0.2 * Math.PI, 0.8 * Math.PI);
        g.stroke();
      }
    }
  }

  function tegnTommel(p) {
    papirPlade(p);
    g.save();
    g.beginPath();
    g.roundRect(p.x + 4, p.y + 4, p.w - 8, p.h - 8, 5);
    g.clip();
    // Bakkerne og klosteret langt væk (står stille)
    const hy = p.y + p.h * 0.5;
    g.strokeStyle = 'rgba(30, 26, 22, 0.45)';
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(p.x, hy + p.h * 0.04);
    g.bezierCurveTo(p.x + p.w * 0.25, hy - p.h * 0.06, p.x + p.w * 0.4, hy + p.h * 0.06, p.x + p.w * 0.6, hy);
    g.bezierCurveTo(p.x + p.w * 0.75, hy - p.h * 0.05, p.x + p.w * 0.9, hy + p.h * 0.03, p.x + p.w, hy - p.h * 0.02);
    g.stroke();
    const kx = p.x + p.w * 0.5, kb = p.w * 0.16, kh = p.h * 0.1;
    g.fillStyle = 'rgba(30, 26, 22, 0.18)';
    g.beginPath();
    g.rect(kx - kb / 2, hy - kh, kb, kh);
    g.moveTo(kx - kb / 2 - 3, hy - kh);
    g.lineTo(kx, hy - kh * 1.7);
    g.lineTo(kx + kb / 2 + 3, hy - kh);
    g.rect(kx + kb * 0.22, hy - kh * 2.2, kb * 0.2, kh * 1.2);
    g.fill();
    g.stroke();
    // Tommelfingeren: tæt på, så den hopper, når man skifter øje
    const th = p.h * 0.62, tb = Math.min(p.w * 0.2, th * 0.45);
    const skub = p.w * 0.14;
    const cx = p.x + p.w / 2 + s.visØje * skub;
    if (tommelFør != null) tommel(p.x + p.w / 2 + tommelFør * skub, p.y + p.h + 4, th, tb, { stiplet: true });
    tommel(cx, p.y + p.h + 4, th, tb);
    g.restore();
    // Øjnene øverst (navnet står under lærredet)
    const r = klem(p.w * 0.035, 7, 13);
    øjne(p.x + 16 + r * 2.6, p.y + 14 + r, r, s.øje === 1);
  }

  function tegnMånen(p) {
    papirPlade(p);
    const rS = Math.min(p.h * 0.72, p.w * 0.6);
    const rE = rS / 5.4, rM = rE * 2.6;
    const x0 = p.x + p.w / 2, y0 = p.y + p.h - rE - 12;
    // Stjernehimlen: en stor bue med stjerner (kugle i kugle, som Tychos figur s. C2b)
    g.strokeStyle = BLÆK;
    g.lineWidth = 1.4;
    g.beginPath();
    g.arc(x0, y0, rS, -Math.PI / 2 - 0.95, -Math.PI / 2 + 0.95);
    g.stroke();
    for (let i = -6; i <= 6; i++) {
      const v = -Math.PI / 2 + i * 0.145 + (i % 2 ? 0.03 : -0.02);
      const x = x0 + Math.cos(v) * (rS - 7), y = y0 + Math.sin(v) * (rS - 7);
      g.fillStyle = BLÆK;
      g.beginPath();
      for (let t = 0; t < 10; t++) {
        const rr = t % 2 ? 1.5 : 3.6, a = (t * Math.PI) / 5;
        g[t ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      g.fill();
    }
    // Månens bane og Månen
    g.setLineDash([3, 4]);
    g.lineWidth = 1;
    g.beginPath();
    g.arc(x0, y0, rM, Math.PI, 2 * Math.PI);
    g.stroke();
    g.setLineDash([]);
    const mx = x0, my = y0 - rM, mr = Math.max(5, rE * 0.27);
    g.fillStyle = '#fbf6e8';
    g.beginPath();
    g.arc(mx, my, mr, 0, 2 * Math.PI);
    g.fill();
    g.stroke();
    // Jorden
    g.fillStyle = '#d9c7a0';
    g.beginPath();
    g.arc(x0, y0, rE, 0, 2 * Math.PI);
    g.fill();
    g.lineWidth = 1.6;
    g.stroke();
    // Tycho: fra toppen (a = 0) til siden (a = 90°)
    const a = s.visSted * Math.PI / 2;
    const ox = x0 + Math.sin(a) * rE, oy = y0 - Math.cos(a) * rE;
    // Sigtelinjen gennem Månen ud til stjernehimlen
    const dx = mx - ox, dy = my - oy;
    const bb = (ox - x0) * dx + (oy - y0) * dy, cc = (ox - x0) ** 2 + (oy - y0) ** 2 - rS * rS, aa = dx * dx + dy * dy;
    const t = (-bb + Math.sqrt(bb * bb - aa * cc)) / aa;
    const px = ox + dx * t, py = oy + dy * t;
    if (forrigeP) {
      g.strokeStyle = 'rgba(30, 26, 22, 0.35)';
      g.setLineDash([3, 3]);
      g.beginPath();
      g.arc(x0 + forrigeP[0] * rS, y0 + forrigeP[1] * rS, 9, 0, 2 * Math.PI);
      g.stroke();
      g.setLineDash([]);
    }
    g.strokeStyle = 'rgba(150, 40, 20, 0.85)';
    g.lineWidth = 1.4;
    g.setLineDash([6, 4]);
    g.beginPath();
    g.moveTo(ox, oy);
    g.lineTo(px, py);
    g.stroke();
    g.setLineDash([]);
    g.lineWidth = 2;
    g.beginPath();
    g.arc(px, py, 9, 0, 2 * Math.PI);
    g.stroke();
    // Tycho som en lille figur på Jorden
    g.save();
    g.translate(ox, oy);
    g.rotate(a);
    g.fillStyle = BLÆK;
    g.fillRect(-1.2, -11, 2.4, 9);
    g.beginPath();
    g.arc(0, -13.5, 3, 0, 2 * Math.PI);
    g.fill();
    g.restore();
    tekst('Jorden', x0 - rE - 6, y0, { str: 13, farve: BLÆK, align: 'right' });
    tekst('Månen', mx - mr - 6, my, { str: 13, farve: BLÆK, align: 'right' });
    return [(px - x0) / rS, (py - y0) / rS];
  }

  let sidsteP = null;
  let par = null; // teksterne under lærredet i trin 2
  function tegnParallakse() {
    const [a, b] = paneler();
    tegnTommel(a);
    sidsteP = tegnMånen(b);
    if (par) {
      sæt(par.øje, s.øje === 1 ? 'Med venstre øje' : 'Med højre øje');
      sæt(par.sted, s.sted ? 'Tycho på siden af Jorden' : 'Tycho på toppen af Jorden');
      sæt(par.måne, s.stedSkift ? 'Månen ses ca. 1° et andet sted mellem stjernerne.' : '');
    }
    lærred.setAttribute('aria-label', 'Til venstre en tommelfinger foran et kloster langt væk. Til højre Jorden, Månen og stjernehimlen, hvor Månen ses et andet sted, når Tycho flytter sig');
  }

  function underParallakse() {
    under.innerHTML = '<p class="ts-par"><span class="ts-par-øje"></span> · <span class="ts-par-sted"></span></p>'
      + '<p class="ts-par-måne"></p><p class="ts-småt">Tegningen er ikke i rigtig størrelse.</p>';
    par = { øje: under.querySelector('.ts-par-øje'), sted: under.querySelector('.ts-par-sted'), måne: under.querySelector('.ts-par-måne') };
  }

  function skiftØje() {
    if (s.trin !== 'parallakse') return;
    forløbRørt();
    tommelFør = s.øje;
    s.øje = -s.øje;
    s.øjeSkift++;
    tegnIgen();
  }
  function skiftSted() {
    if (s.trin !== 'parallakse') return;
    forløbRørt();
    forrigeP = sidsteP;
    s.sted = s.sted ? 0 : 1;
    s.stedSkift++;
    tegnIgen();
  }

  // ---------- Trin 3: højt og lavt ----------
  const ny = () => NY_STJERNE;
  const schedir = CASSIOPEIA.find((x) => x.id === 'schedar');
  const timevinkel = () => ((((s.visθ - højestVed(ny())) % 360) + 540) % 360) - 180; // -180..180

  function visninger() {
    // Side om side kun, når instrumentet stadig får mindst 260 px. Ellers ligger skiven i hjørnet af instrumentet
    const rb = Math.min(H / 2 - 6, W * 0.24);
    const bred = W >= H * 1.3 && W - 2 * rb - 18 >= 260;
    if (bred) {
      const r = rb;
      return { bred, skive: { cx: r + 6, cy: H / 2, r }, instrument: { x: 2 * r + 18, y: 0, w: W - 2 * r - 18, h: H } };
    }
    const r = klem(Math.min(W, H) * 0.2, 48, 92);
    return { bred, skive: { cx: r + 8, cy: r + 8, r }, instrument: { x: 0, y: 0, w: W, h: H } };
  }

  // Himmelskiven: hele himlen om Nordstjernen med klostertaget forneden (som når man ser mod nord)
  function tegnSkive(sk, bred) {
    const k = sk.r / 44; // med plads til taget forneden (taget er 36° under Nordstjernen)
    const til = (st) => { const p = iPolkort(st, s.visθ); return [sk.cx + p.x * k, sk.cy - p.y * k]; };
    g.save();
    g.beginPath();
    g.arc(sk.cx, sk.cy, sk.r, 0, 2 * Math.PI);
    g.clip();
    natPlade(g, sk.cx - sk.r, sk.cy - sk.r, 2 * sk.r, 2 * sk.r, 0);
    const p = bred ? pk() : 0.55;
    if (bred) for (const b of SVAGE) { const [x, y] = til(b); prik(g, x, y, b.mag + 0.4, p); }
    for (const b of BAGGRUND) { const [x, y] = til(b); prik(g, x, y, b.mag, p); }
    // Den nye stjernes vej rundt om Nordstjernen
    const pn = (90 - ny().dek) * k;
    g.strokeStyle = 'rgba(201, 162, 74, 0.35)';
    g.setLineDash([2, 4]);
    g.lineWidth = 1;
    g.beginPath();
    g.arc(sk.cx, sk.cy, pn, 0, 2 * Math.PI);
    g.stroke();
    g.setLineDash([]);
    for (const st of CASSIOPEIA) { const [x, y] = til(st); prik(g, x, y, st.mag, p); }
    const [nx, nyy] = til(ny());
    prik(g, nx, nyy, -2.5, p);
    // Horisonten (taget) forneden
    const tagY = sk.cy + (HERREVAD - TAG_HØJDE) * k;
    if (tagY < sk.cy + sk.r) klostertag(g, sk.cx - sk.r, sk.cx + sk.r, tagY, sk.cy + sk.r, sk.cx);
    g.restore();
    g.strokeStyle = GULD;
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(sk.cx, sk.cy, sk.r, 0, 2 * Math.PI);
    g.stroke();
    if (bred) {
      const [px, py] = til(NORDSTJERNEN);
      tekst('Nordstjernen', px, py + 10, { str: 14, base: 'top', farve: 'rgba(246, 241, 226, 0.7)' });
    }
    // En pil, der viser, at man kan trække himlen rundt
    if (!træk && !s.højt && !s.lavt) {
      g.strokeStyle = 'rgba(243, 223, 166, 0.8)';
      g.lineWidth = 2;
      const rr = pn + 12 * p;
      const v0 = Math.atan2(nyy - sk.cy, nx - sk.cx);
      g.beginPath();
      g.arc(sk.cx, sk.cy, rr, v0 + 0.25, v0 + 0.85);
      g.stroke();
      const ve = v0 + 0.85, ex = sk.cx + Math.cos(ve) * rr, ey = sk.cy + Math.sin(ve) * rr;
      g.beginPath();
      g.moveTo(ex, ey);
      g.lineTo(ex - Math.cos(ve - 0.9) * 7, ey - Math.sin(ve - 0.9) * 7);
      g.moveTo(ex, ey);
      g.lineTo(ex + Math.cos(ve + 0.6) * 7, ey + Math.sin(ve + 0.6) * 7);
      g.stroke();
    }
  }

  // Tychos instrument: den nye stjerne og Schedir tæt på med passeren og spøgelset (zenit opad, som i skiven)
  function tegnInstrument(iv, skive) {
    const m = måling(s.visθ);
    const pN = iPolkort(ny(), s.visθ), pS = iPolkort(schedir, s.visθ);
    const ox = (pN.x + pS.x) / 2, oy = (pN.y + pS.y) / 2;
    const k = Math.min(iv.w * 0.5, iv.h * 0.56) / 8;
    // I det smalle layout ligger skiven i hjørnet: Stjernerne står lidt til højre og nedad for den
    const smal = skive && !skive.bred;
    const mx = iv.x + iv.w / 2 + (smal ? skive.skive.r * 0.45 : 0), my = iv.y + iv.h * 0.5 + (smal ? skive.skive.r * 0.3 : 0);
    const til = (p) => [mx + (p.x - ox) * k, my - (p.y - oy) * k];
    natPlade(g, iv.x, iv.y, iv.w, iv.h);
    g.save();
    g.beginPath();
    g.roundRect(iv.x, iv.y, iv.w, iv.h, 8);
    g.clip();
    const p = pk();
    for (const b of [...SVAGE, ...BAGGRUND]) {
      const q = iPolkort(b, s.visθ);
      if (Math.abs(q.x - ox) * k > iv.w || Math.abs(q.y - oy) * k > iv.h) continue;
      const [x, y] = til(q);
      prik(g, x, y, b.mag, p);
    }
    for (const st of CASSIOPEIA) {
      const [x, y] = til(iPolkort(st, s.visθ));
      prik(g, x, y, st.mag, p * 1.2);
    }
    const [nx, nyy] = til(pN), [sx, sy] = til(pS), [gx, gy] = til(m.spøgelsePå);
    // Taget, når stjernerne står lavt
    const tagY = my - (-(HERREVAD - TAG_HØJDE) - oy) * k;
    if (tagY < iv.y + iv.h) klostertag(g, iv.x, iv.x + iv.w, tagY, iv.y + iv.h + 2, mx - ox * k);
    // Passeren: to ben fra et hængsel ud til de to stjerner, og en bue med grader
    const ux = sx - nx, uy = sy - nyy, L = Math.hypot(ux, uy);
    // Hængslet står på den side af stjernerne, hvor der er bedst plads (inden for billedet og væk fra skiven)
    const kandidat = (fortegn) => {
      const x = (nx + sx) / 2 - fortegn * uy * 0.6, y = (nyy + sy) / 2 + fortegn * ux * 0.6;
      let point = Math.min(x - iv.x, iv.x + iv.w - x, y - iv.y, iv.y + iv.h - y);
      if (smal) point = Math.min(point, Math.hypot(x - skive.skive.cx, y - skive.skive.cy) - skive.skive.r);
      return { x, y, point };
    };
    const [h1, h2] = [kandidat(1), kandidat(-1)];
    const { x: hx, y: hy } = h1.point >= h2.point ? h1 : h2;
    g.strokeStyle = GULD;
    g.lineWidth = 2.4;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(hx, hy); g.lineTo(nx, nyy);
    g.moveTo(hx, hy); g.lineTo(sx, sy);
    g.stroke();
    const vN = Math.atan2(nyy - hy, nx - hx), vS = Math.atan2(sy - hy, sx - hx);
    let v0 = vN, v1 = vS;
    if (((v1 - v0 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI < 0) [v0, v1] = [v1, v0];
    const rb = L * 0.42;
    g.lineWidth = 1.4;
    g.beginPath();
    g.arc(hx, hy, rb, v0, v0 + (((v1 - v0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
    g.stroke();
    const spænd = (((v1 - v0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    g.lineWidth = 1;
    g.beginPath();
    for (let i = 0; i <= 8; i++) {
      const v = v0 + spænd * (i / 8), l = i % 4 ? 4 : 8;
      g.moveTo(hx + Math.cos(v) * rb, hy + Math.sin(v) * rb);
      g.lineTo(hx + Math.cos(v) * (rb + l), hy + Math.sin(v) * (rb + l));
    }
    g.stroke();
    g.fillStyle = GULD;
    g.beginPath();
    g.arc(hx, hy, 4, 0, 2 * Math.PI);
    g.fill();
    g.lineCap = 'butt';
    // Den stiplede bue mellem stjernerne med Tychos tal
    g.strokeStyle = 'rgba(243, 223, 166, 0.9)';
    g.setLineDash([3, 4]);
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(nx, nyy); g.lineTo(sx, sy);
    g.stroke();
    // Spøgelset: hvor den ville stå, hvis den var lige så tæt på som Månen (rødlig, stiplet)
    g.strokeStyle = 'rgba(232, 120, 96, 0.85)';
    g.beginPath();
    g.moveTo(gx, gy); g.lineTo(sx, sy);
    g.stroke();
    g.setLineDash([]);
    g.lineWidth = 1.6;
    g.beginPath();
    g.arc(gx, gy, Math.max(5, 4 * p), 0, 2 * Math.PI);
    g.stroke();
    prik(g, nx, nyy, -2.5, p * 1.2);
    // Navnene står ud for stjernerne væk fra hængslet, og tallet på den anden side af den stiplede bue
    const væk = (x, y, d) => { const l = Math.hypot(x - hx, y - hy) || 1; return [x + (x - hx) / l * d, y + (y - hy) / l * d]; };
    const inden = [iv.x, iv.x + iv.w];
    tekst('Den nye stjerne', ...væk(nx, nyy, 24), { str: 15, farve: '#f3dfa6', inden });
    tekst(NAVNE.schedar, ...væk(sx, sy, 20), { str: 15, inden });
    const [lx, ly] = væk((nx + sx) / 2, (nyy + sy) / 2, 22);
    tekst(grader(m.afstand), lx, ly, { str: 18, farve: '#f3dfa6' });
    tekst('Tychos instrument', iv.x + iv.w - 12, iv.y + 10, { str: 13, align: 'right', base: 'top', farve: 'rgba(243, 223, 166, 0.65)', kursiv: true });
    g.restore();
    ramme(g, iv.x, iv.y, iv.w, iv.h);
  }

  function tegnHøjtLavt() {
    visning = visninger();
    tegnInstrument(visning.instrument, visning);
    if (!visning.bred) {
      // Skiven ligger oven på instrumentet i hjørnet: en mørk kant, så den kan ses
      g.fillStyle = 'rgba(5, 8, 15, 0.9)';
      g.beginPath();
      g.arc(visning.skive.cx, visning.skive.cy, visning.skive.r + 4, 0, 2 * Math.PI);
      g.fill();
    }
    tegnSkive(visning.skive, visning.bred);
    const h = højde(ny(), s.visθ);
    if (h >= HØJT - 0.01) s.højt = true;
    if (h <= LAVT + 0.01) s.lavt = true;
    if (fl && !s.lab) {
      if (s.højt && !s.lavt) vink(fl.vink?.lavt ?? '');
      else if (s.lavt && !s.højt) vink(fl.vink?.højt ?? '');
      else if (s.højt && s.lavt) vink('');
    }
    lærred.setAttribute('aria-label', `Cassiopeia drejer om Nordstjernen. Den nye stjerne står ${Math.round(h)} grader over horisonten, og afstanden til Schedir er 7 grader og 55 minutter`);
  }

  // Tallene under lærredet (skrives kun om, når de ændrer sig)
  function underMåling() {
    under.innerHTML = '<div class="ts-maal">'
      + '<p class="ts-højde"><span class="ts-højde-tal"></span> <span class="ts-mærke" data-mærke="hoejt">Højt</span> <span class="ts-mærke" data-mærke="lavt">Lavt</span></p>'
      + '<p class="ts-linje ts-rigtig"><i aria-hidden="true"></i><span></span></p>'
      + '<p class="ts-linje ts-spøgelse"><i aria-hidden="true"></i><span></span></p>'
      + '<p class="ts-småt">′ betyder minutter: 60 minutter er én grad.</p></div>';
    mål = {
      højde: under.querySelector('.ts-højde-tal'),
      højt: under.querySelector('[data-mærke="hoejt"]'),
      lavt: under.querySelector('[data-mærke="lavt"]'),
      rigtig: under.querySelector('.ts-rigtig span'),
      spøgelse: under.querySelector('.ts-spøgelse span'),
    };
  }
  const sæt = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };
  function opdaterMåling() {
    if (!mål) return;
    const m = måling(s.visθ);
    sæt(mål.højde, `Højde over horisonten: ${Math.round(m.højde)}°`);
    mål.højt.classList.toggle('ja', s.højt);
    mål.lavt.classList.toggle('ja', s.lavt);
    // Tallet brydes ikke over to linjer (et hårdt mellemrum mellem grader og minutter)
    sæt(mål.rigtig, `Afstand til Schedir: ${grader(m.afstand).replace(' ', '\u00a0')}`);
    sæt(mål.spøgelse, `Hvis den var lige så tæt på som Månen: ${grader(m.spøgelse).replace(' ', '\u00a0')}`);
  }

  // Drej himlen til timevinklen H (0 = højest, 180 = lavest) ad den korteste vej
  function drejTil(Htil) {
    const nu = s.θ - højestVed(ny());
    let d = ((((Htil - nu) % 360) + 540) % 360) - 180;
    s.θ += d;
    forløbRørt();
    tegnIgen();
  }
  function drej(dθ, straks = false) {
    if (s.trin !== 'hoejt') return;
    forløbRørt();
    s.θ += dθ;
    if (straks) s.visθ = s.θ;
    tegnIgen();
  }

  // ---------- Trin 4: stjernen falmer ----------
  function tegnFalmer() {
    natPlade(g, 0, 0, W, H);
    const k = Math.min(W / 22, H * 0.86 / 10);
    const til = wVisning(W / 2, H * 0.54, k);
    const n = klem(s.visMåned, 0, MÅNEDER.length - 1);
    const a = MÅNEDER[Math.floor(n)], b = MÅNEDER[Math.ceil(n)], t = n - Math.floor(n);
    const mag = mod(a.mag, b.mag, t);
    const farve = a.farve.map((c, i) => Math.round(mod(c, b.farve[i], t)));
    const [nx, nyy] = tegnW(til, k, { ny: { mag, farve }, navne: true });
    // I maj er den som en stjerne af anden størrelse, som Schedir: en svag ring om Schedir
    if (MÅNEDER[Math.round(n)].sammen.includes('anden')) {
      const [sx, sy] = til(W_KORT.find((x) => x.id === 'schedar'));
      g.strokeStyle = 'rgba(201, 162, 74, 0.7)';
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(sx, sy, 12, 0, 2 * Math.PI);
      g.stroke();
    }
    if (mag < 6) tekst('Den nye stjerne', nx, nyy - Math.max(22, 1.4 * k), { str: 15, farve: '#f3dfa6', base: 'bottom' });
    else {
      g.strokeStyle = 'rgba(243, 223, 166, 0.45)';
      g.setLineDash([3, 4]);
      g.lineWidth = 1.2;
      g.beginPath();
      g.arc(nx, nyy, 12, 0, 2 * Math.PI);
      g.stroke();
      g.setLineDash([]);
    }
    lærred.setAttribute('aria-label', `Cassiopeia i ${MÅNEDER[Math.round(n)].navn}: ${MÅNEDER[Math.round(n)].tekst}`);
  }

  function underMåneder() {
    const prikker = SAMMENLIGN.map((c) => {
      const r = klem((5.8 - c.mag) * 0.75, 2.5, 7);
      return `<span class="ts-ting" data-ting="${c.id}"><i style="--r:${r.toFixed(1)}px;--f:${rgb(c.farve)}" aria-hidden="true"></i>${c.navn}</span>`;
    }).join('');
    under.innerHTML = '<label class="hs-nat"><span class="hs-nat-tekst"></span>'
      + `<input type="range" min="0" max="${MÅNEDER.length - 1}" step="1" value="0" aria-label="Måneder fra november 1572"></label>`
      + '<p class="ts-sammen-tekst"></p>'
      + `<div class="ts-sammen" aria-label="Det, Tycho sammenlignede med">${prikker}</div>`;
    skyder = under.querySelector('input');
    månedTekst = under.querySelector('.hs-nat-tekst');
    sammenTekst = under.querySelector('.ts-sammen-tekst');
    sammen = under.querySelector('.ts-sammen');
    skyder.addEventListener('input', () => sætMåned(Number(skyder.value)));
    opdaterMåned();
  }
  function opdaterMåned() {
    if (!skyder) return;
    const m = MÅNEDER[s.måned];
    if (skyder.value !== String(s.måned)) skyder.value = String(s.måned);
    sæt(månedTekst, m.navn[0].toUpperCase() + m.navn.slice(1));
    sæt(sammenTekst, m.tekst);
    for (const el of sammen.children) el.classList.toggle('lyser', m.sammen.includes(el.dataset.ting));
  }
  function sætMåned(n) {
    if (s.trin !== 'falmer') return;
    forløbRørt();
    s.måned = klem(Math.round(n), 0, MÅNEDER.length - 1);
    s.månedRørt = true;
    opdaterMåned();
    tegnIgen();
  }

  // ---------- Fingeren og musen ----------
  const lokal = (h) => { const r = lærred.getBoundingClientRect(); return [h.clientX - r.left, h.clientY - r.top]; };
  const ned = (h) => {
    if (!h.isPrimary) return;
    const [x, y] = lokal(h);
    træk = { id: h.pointerId, x, y, sx: x, sy: y, flyttet: false, dreje: null };
    if (s.trin === 'hoejt' && visning) {
      const sk = visning.skive;
      træk.dreje = Math.hypot(x - sk.cx, y - sk.cy) <= sk.r + 6 ? 'skive' : 'instrument';
    }
    lærred.setPointerCapture?.(h.pointerId);
    if (s.trin === 'stjernen' && s.lys < 0.15) { forløbRørt(); tænd(); }
  };
  const flyt = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    const [x, y] = lokal(h);
    if (Math.hypot(x - træk.sx, y - træk.sy) > 8) træk.flyttet = true;
    if (træk.dreje && visning) {
      // Drej om Nordstjernen: om skivens midte, eller (i instrumentet) med et træk på tværs
      let dθ;
      if (træk.dreje === 'skive') {
        const sk = visning.skive;
        const v0 = Math.atan2(træk.y - sk.cy, træk.x - sk.cx), v1 = Math.atan2(y - sk.cy, x - sk.cx);
        dθ = -((((v1 - v0) / GR) % 360 + 540) % 360 - 180);
      } else {
        // Et træk mod venstre drejer himlen samme vej som skiven (mod uret), ca. 180° over lærredets bredde
        dθ = ((x - træk.x) - (y - træk.y) * 0.4) * (180 / Math.max(240, visning.instrument.w));
      }
      drej(dθ, true);
    }
    træk.x = x;
    træk.y = y;
  };
  const op = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    const t = træk;
    træk = null;
    if (!t.flyttet) {
      if (s.trin === 'stjernen') trykStjernen(t.sx, t.sy);
      else if (s.trin === 'parallakse') {
        const [a] = paneler();
        const iA = t.sx >= a.x && t.sx <= a.x + a.w && t.sy >= a.y && t.sy <= a.y + a.h;
        if (iA) skiftØje(); else skiftSted();
      }
    }
    tegnIgen();
  };
  lærred.addEventListener('pointerdown', ned);
  lærred.addEventListener('pointermove', flyt);
  lærred.addEventListener('pointerup', op);
  const afbryd = () => { træk = null; };
  lærred.addEventListener('pointercancel', afbryd);

  // ---------- Trinene ----------
  function sætTrin(trin) {
    rydTimere();
    s.trin = trin;
    s.lab = null;
    skyder = månedTekst = sammenTekst = sammen = mål = par = null;
    visning = null;
    under.replaceChildren();
    tegnIgen();
  }
  const start = {
    stjernen(lab = false) {
      sætTrin('stjernen');
      Object.assign(s, { lys: lab ? 1 : 0, fundet: lab, forkert: 0 });
      lysStart = lab ? ur - LYS_TID : null;
      if (!lab) vent(rolig ? 1200 : LYS_EFTER, tænd);
    },
    parallakse() {
      sætTrin('parallakse');
      Object.assign(s, { øje: 1, visØje: 1, sted: 0, visSted: 0, øjeSkift: 0, stedSkift: 0 });
      forrigeP = tommelFør = null;
      underParallakse();
    },
    hoejt(lab = false) {
      sætTrin('hoejt');
      // Starter skråt oppe (ca. 65° over horisonten): hverken højt eller lavt
      const θ = højestVed(ny()) + (lab ? -120 : -50);
      Object.assign(s, { θ, visθ: θ, højt: false, lavt: false });
      underMåling();
    },
    falmer() {
      sætTrin('falmer');
      Object.assign(s, { måned: 0, visMåned: 0, månedRørt: false });
      underMåneder();
    },
  };

  function sætKapitel(t) {
    if (kapitel) kapitel.textContent = t ?? titel;
  }

  function forløbDel(data) {
    fl = data;
    const trin = {
      stjernen: {
        start: () => start.stjernen(),
        færdig: () => s.fundet,
        visMig: () => { tænd(); vent(rolig ? 0 : 900, find); },
      },
      parallakse: {
        start: () => start.parallakse(),
        knapper: [
          { id: 'oeje', tekst: 'Skift øje', gør: skiftØje },
          { id: 'sted', tekst: 'Flyt Tycho', gør: skiftSted },
        ],
        færdig: () => s.øjeSkift > 0 && s.stedSkift > 0 && Math.abs(s.visSted - s.sted) < 0.02,
        visMig() {
          if (!s.øjeSkift) skiftØje();
          vent(rolig ? 0 : 900, () => { if (!s.stedSkift) skiftSted(); });
        },
      },
      hoejt: {
        start: () => start.hoejt(),
        get knapper() {
          const h = højde(ny(), s.θ);
          return [
            { id: 'hoej', tekst: 'Drej højt', gør: () => drejTil(0), aktiv: () => h < HØJT + 10 },
            { id: 'lav', tekst: 'Drej lavt', gør: () => drejTil(180), aktiv: () => h > LAVT - 4 },
          ];
        },
        færdig: () => s.højt && s.lavt && Math.abs(s.visθ - s.θ) < 0.5,
        visMig() {
          if (!s.højt) drejTil(0);
          vent(rolig ? 300 : (s.højt ? 0 : 1600), () => { if (!s.lavt) drejTil(180); });
        },
      },
      falmer: {
        start: () => start.falmer(),
        færdig: () => s.månedRørt && s.måned >= MÅNED_MÅL && Math.abs(s.visMåned - s.måned) < 0.05,
        visMig: () => sætMåned(MÅNED_MÅL + 1),
      },
    };
    for (const t of data.trin) {
      const d = trin[t.id];
      if (!d) continue;
      const st = d.start;
      d.start = () => { sætKapitel(t.kapitel); st(); };
    }
    return { trin };
  }

  // Laboratoriet: de fire kapitler som valg (stilguiden B7). Et tryk på det valgte starter det forfra.
  function fri(kap = 'hoejt') {
    sætKapitel(titel);
    if (kap === 'stjernen') start.stjernen(true);
    else if (kap === 'parallakse') start.parallakse();
    else if (kap === 'falmer') start.falmer();
    else { kap = 'hoejt'; start.hoejt(true); }
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
    // I laboratoriet for trin 2 står knapperne her (i turen står de i forløbets linje)
    if (kap === 'parallakse') {
      const r = document.createElement('div');
      r.className = 'ts-knapper';
      for (const [t, f] of [['Skift øje', skiftØje], ['Flyt Tycho', skiftSted]]) {
        const b = document.createElement('button');
        b.className = 'hs-kapitel';
        b.textContent = t;
        b.addEventListener('click', f);
        r.append(b);
      }
      under.prepend(r);
    }
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
      cancelAnimationFrame(ramme1);
      ramme1 = 0;
      ro.disconnect();
      lærred.removeEventListener('pointerdown', ned);
      lærred.removeEventListener('pointermove', flyt);
      lærred.removeEventListener('pointerup', op);
      lærred.removeEventListener('pointercancel', afbryd);
      felt.replaceChildren();
    },
    test: {
      tilstand: () => {
        const m = måling(s.visθ);
        return {
          trin: s.trin, lab: s.lab, lys: s.lys, fundet: s.fundet, forkert: s.forkert,
          øje: s.øje, sted: s.sted, øjeSkift: s.øjeSkift, stedSkift: s.stedSkift,
          højde: m.højde, timevinkel: timevinkel(), højt: s.højt, lavt: s.lavt, afstand: grader(m.afstand), spøgelse: grader(m.spøgelse),
          måned: s.måned, månedNavn: MÅNEDER[s.måned].navn, lyser: sammen ? [...sammen.querySelectorAll('.lyser')].map((e) => e.dataset.ting) : [],
        };
      },
      // Et tryk på den nye stjerne (ja) eller langt fra den (nej) i lærredets egne px
      tryk(ja = true) {
        if (s.trin !== 'stjernen') return false;
        const { til } = stjernenSted();
        const [x, y] = til(W_KORT.find((p) => p.id === 'ny'));
        trykStjernen(ja ? x + 3 : x - W * 0.3, ja ? y : y + H * 0.25);
        return true;
      },
      øje: skiftØje,
      sted: skiftSted,
      drejTil: (Hv) => { if (s.trin === 'hoejt') { drejTil(Hv); s.visθ = s.θ; tegnIgen(); } },
      måned: sætMåned,
      lab: (kap) => fri(kap),
    },
  };
}
