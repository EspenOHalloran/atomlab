// Tegningerne i bogen om Ole Rømer (Opdagelserne, docs/drejebog-roemer.md, afsnit 5): turen "Himlens ur" i et lærred i
// 2D. Kikkerten er et rundt, mørkt synsfelt med Jupiter og månerne som prikker (som forsidens vignet), og banerne set
// ovenfra er tegnet med blæk på papiret i stil med Rømers egen Fig. 11 (Solen A, Jupiter B). Tallene står i
// js/data/opdagelser/roemer.js (afstanden fra JPL Horizons, Io's omløb og skygge og aftenen den 9. november).
//
// lavFortælling(felt, { rolig, tekster, påIgen }) fylder opslagets felt (.bog-scene fra js/bog.js) og giver
//   forløbDel(data)  det, Forløb-klodsen (js/forloeb.js) skal bruge pr. trin-id (start, knapper, færdig, visMig)
//   fri(kapitel)     laboratoriet efter turen: de fire kapitler som valg (standard "For sent") og "Fortæl det igen"
//   fjern()          stopper tegningen, timerne og lytterne
//   test             til testadgangen (tilstanden og handlingerne)
//
// Trinene (R2, 28. november 2026). Scenen virker i alle faser (et tryk, mens man gætter, kalder forløbRørt()), og målene
// er runde (stilguiden B):
//   skyggen   Kikkerten. Io glider af sig selv mod Jupiter efter 2 s (eller når man trækker tiden frem med skyderen eller
//             et træk på tværs) og slukker brat ca. én Jupiter-radius fra kanten: Den er gået ind i skyggen. Først da kommer
//             den lille tegning "Set ovenfra" i hjørnet. Navnet "formørkelse" står først i Så (A6). Trækker man tiden
//             videre, går Io ind i skyggen igen 42½ time senere. Færdig ved den første formørkelse
//   sent      Banerne ovenfra. Man trækker Jorden langs banen (eller med skyderen) fra 1. juni 1676 til 26. februar 1677,
//             og to ure viser "Tabellen" (regnet ud fra august) og "Set fra Jorden". Fra begyndelsen af januar står
//             Jupiter for tæt på Solen. Færdig, når Jorden er nået til november
//   hvorfor   Samme tegning med Jorden i august eller november. "Io kommer ud" sender et lysglimt fra Jupiter til Jorden,
//             mens et stopur tæller minutterne (36 og 46). Færdig, når begge er prøvet
//   november  Kikkerten med Jupiter alene og uret fra kl. 17.20. Uret starter, når man har gættet. Ved 17.25.45 (tabellens
//             tid) blinker tallet, og intet sker. Ved 17.35.45 tænder Io. Et tryk (på kikkerten eller "Der er Io!") tæller,
//             når Io er tændt, før det siger linjen "Ikke endnu". Færdig efter trykket
//
// Snyd, der står i "Ærligt talt" i "Om Rømer" (OM i js/data/opdagelser/roemer.js, R3): Banerne ovenfra er ikke i rigtig størrelse (Jupiter er 5,2 gange så langt fra
// Solen som Jorden, her ca. 2,4 gange), og Jupiter står stille i tegningen (den flytter sig ca. 10° fra juli til november).
// Io's bane er tegnet for stor. Lysglimtet farer lige hurtigt i begge forsøg, men stopuret tæller nutidens minutter
// (Horizons), ikke tegningens længde. Tabellen er regnet ud fra august, som Rømer gjorde, ikke Cassinis tabel. Skyggen er
// en skarp cylinder (halvskyggen er udeladt, så Io slukker på et øjeblik i stedet for på ca. 3 minutter). Urene går
// hurtigere end rigtige ure. Tegner kun, når noget bevæger sig.

import { forløbFase, forløbRørt, forløbVenter, forløbVink } from '../forloeb.js';

// Gåden "Tæl lysets minutter" (R3) står i sin egen fil. js/opdagelser.js laver den for opslaget 'gaaden' med lavGåde
export { lavGåde } from './roemer-gaade.js';
import {
  BANE_RADIUS, IO_OMLØB, OMLØB, SKYGGE_VINKEL, ioSted, skyggeKant, AUGUST, NOVEMBER, OPPOSITION, SIDSTE_DAG, MÅNEDER,
  kanSes, lysMinutter, forsinkelse, jordVinkel, minutTekst, datoTekst, NOV_START, NOV_TABEL, NOV_SET, klokken,
} from '../data/opdagelser/roemer.js';

const BLÆK = '#161513';
const PAPIR = '#f1ebdc';
const GULD = '#c9a24a';
const NAT_MIDT = '#0b1220', NAT_KANT = '#03050a';
const MESSING = '#8a6a2e';
const STJERNE = [243, 234, 215];
const GR = Math.PI / 180;
const AUTO_EFTER = 2000; // ms, før Io begynder at glide af sig selv (trin 1)
const AUTO_FART = 1.2; // timer pr. sekund, når Io glider af sig selv
const IO_START = 25 * GR; // Io's vinkel i banen, når trin 1 starter (ude til højre, på vej om bag Jupiter)
const TIMER_MAX = 50; // skyderens længde i trin 1 (den anden formørkelse er efter ca. 47,8 timer)
const FØRSTE = (skyggeKant(SKYGGE_VINKEL, true) - IO_START) / (2 * Math.PI) * IO_OMLØB; // timer til den første formørkelse
// Trin 4: uret går med ca. 1,6 minut i sekundet til tabellens tid, holder en pause og går så med ca. 2,2 minut i sekundet
const FART_FØR = 1.64, PAUSE = 1.4, FART_EFTER = 2.2;
const LYS_TÆND = 0.8; // sekunder, til Io er helt tændt
// De andre måners vinkel i banen ved start (kun til tegningen: tre steder i synsfeltet, der kan ske)
const MÅNE_START = { Europa: 2.0, Ganymedes: 5.2, Callisto: 1.83 };

const glat = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const klem = (x, a, b) => Math.max(a, Math.min(b, x));
const rgb = (f, a = 1) => `rgba(${f[0]}, ${f[1]}, ${f[2]}, ${a})`;

// Svage stjerner i kikkertens synsfelt (fast frø): x og y fra -1 til 1 i synsfeltets radius
const SVAGE = (() => {
  let frø = 7;
  const t = () => ((frø = (frø * 16807) % 2147483647) / 2147483647);
  const ud = [];
  while (ud.length < 26) {
    const x = t() * 2 - 1, y = t() * 2 - 1;
    if (x * x + y * y < 0.9 && Math.abs(y) > 0.12) ud.push({ x, y, a: 0.15 + 0.35 * t() });
  }
  return ud;
})();

export function lavFortælling(felt, { rolig = false, tekster = {}, påIgen = null } = {}) {
  let fl = null; // forløbets data (vinkene), når forløbet kører
  felt.innerHTML = '<div class="hs-lærred"><canvas role="img"></canvas></div><div class="hs-under"></div>';
  const lærred = felt.querySelector('canvas');
  const under = felt.querySelector('.hs-under');
  const g = lærred.getContext('2d');
  const kapitel = felt.closest('.bog-opslag')?.querySelector('.bog-kapitel');
  const titel = kapitel?.textContent ?? '';
  const skrift = getComputedStyle(felt).getPropertyValue('--bog-skrift').trim() || 'Georgia, serif';

  // Tilstanden. trin: 'skyggen', 'sent', 'hvorfor', 'november'. vis… glider mod målet.
  const s = {
    trin: 'sent',
    timer: 0, visTimer: 0, auto: false, formørket: false, anden: false, // trin 1
    dag: AUGUST, visDag: AUGUST, nåetNov: false, // trin 2 og 3
    målt: { aug: false, nov: false }, stopur: 0, // trin 3
    urMin: NOV_START, kører: false, pauseTil: 0, ioLys: 0, set: false, forTidligt: 0, nuVist: false, hurtig: false, // trin 4
    lab: null,
  };
  let W = 0, H = 0, dpr = 1;
  let aktiv = true;
  let ramme1 = 0;
  let sidst = 0;
  let ur = 0; // sekunder, tegningen har kørt
  let timere = [];
  let træk = null; // { id, x, y, sx, sy, flyttet }
  let glimt = null; // trin 3: { t0, varighed, dag, min }
  let insetFra = null; // trin 1: tiden (ur), hvor "Set ovenfra" begyndte at tone frem
  let ventStart = null; // trin 4: interval, der venter på, at gættet er gjort
  let skyder = null, skyderTekst = null, linjeTekst = null, mærker = null;

  const vent = (ms, f) => timere.push(setTimeout(() => { if (aktiv) f(); }, ms));
  const rydTimere = () => { timere.forEach(clearTimeout); timere = []; clearInterval(ventStart); ventStart = null; };
  const vink = (tekst) => { if (fl && !s.lab && forløbVenter()) forløbVink(tekst); };
  const rørt = () => { if (fl && !s.lab) forløbRørt(); };
  const sæt = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };
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

  // Skalaen for prikker og tekst (lidt mindre på en telefon)
  const pk = () => klem(Math.min(W, H) / 380, 0.75, 1.4);

  function tekst(t, x, y, { str = 15, farve = BLÆK, align = 'center', base = 'middle', kursiv = false, fed = false } = {}) {
    g.font = `${kursiv ? 'italic ' : ''}${fed ? 'bold ' : ''}${Math.round(str)}px ${skrift}`;
    g.fillStyle = farve;
    g.textAlign = align;
    g.textBaseline = base;
    g.fillText(t, x, y);
  }

  function glid(dt) {
    let bevæger = false;
    const k = rolig ? 1 : 1 - Math.exp(-dt * 7);
    for (const [vis, mål, tæt] of [['visTimer', 'timer', 0.01], ['visDag', 'dag', 0.05]]) {
      s[vis] += (s[mål] - s[vis]) * k;
      if (Math.abs(s[mål] - s[vis]) < tæt) s[vis] = s[mål];
      else bevæger = true;
    }
    // Trin 1: Io glider af sig selv, til den er i skyggen (i turen) og lidt til
    if (s.trin === 'skyggen' && s.auto) {
      const til = FØRSTE + 0.6;
      if (s.timer < til) {
        s.timer = Math.min(til, s.timer + dt * AUTO_FART);
        s.visTimer = s.timer;
        opdaterTid();
        bevæger = true;
      } else s.auto = false;
    }
    if (s.trin === 'skyggen') {
      if (!s.formørket && s.visTimer >= FØRSTE) { s.formørket = true; insetFra = ur; }
      if (!s.anden && s.visTimer >= FØRSTE + IO_OMLØB) s.anden = true;
      if (insetFra != null && ur - insetFra < 0.6) bevæger = true;
    }
    // Trin 3: lysglimtet
    if (glimt) {
      const p = glimt.varighed ? klem((ur - glimt.t0) / glimt.varighed, 0, 1) : 1;
      s.stopur = p * glimt.min;
      if (p >= 1) {
        s.målt[glimt.dag === AUGUST ? 'aug' : 'nov'] = true;
        glimt = null;
        opdaterMærker();
        const begge = s.målt.aug && s.målt.nov;
        if (!begge) vink(s.målt.aug ? fl?.vink.augustFørst : fl?.vink.novemberFørst);
      } else bevæger = true;
    }
    // Trin 4: uret
    if (s.trin === 'november' && s.kører) {
      if (ur < s.pauseTil) bevæger = true;
      else if (s.urMin < NOV_SET) {
        const før = s.urMin < NOV_TABEL;
        s.urMin += dt * (før ? FART_FØR : FART_EFTER) * (s.hurtig ? 3 : 1);
        if (før && s.urMin >= NOV_TABEL) {
          s.urMin = NOV_TABEL;
          s.pauseTil = ur + (s.hurtig ? 0.4 : PAUSE);
          s.nuVist = true;
          vink(fl?.vink.nu);
        }
        if (s.urMin >= NOV_SET) s.urMin = NOV_SET;
        bevæger = true;
      } else if (s.ioLys < 1) {
        s.ioLys = rolig ? 1 : Math.min(1, s.ioLys + dt / LYS_TÆND);
        bevæger = true;
        if (s.hurtig && s.ioLys > 0.5) trykNovember(true);
      }
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
    if (s.trin === 'skyggen') tegnSkyggen();
    else if (s.trin === 'november') tegnNovember();
    else tegnBaner();
    if (mere) ramme1 = requestAnimationFrame(billede);
    else sidst = 0;
  }

  // ---------- Kikkerten (trin 1 og 4) ----------
  // Et rundt synsfelt med en messingring. k er px pr. Jupiter-radius (Io's bane fylder ca. 78 % af radius)
  function synsfelt(cx, cy, rc) {
    const v = g.createRadialGradient(cx, cy, rc * 0.1, cx, cy, rc);
    v.addColorStop(0, NAT_MIDT);
    v.addColorStop(1, NAT_KANT);
    g.fillStyle = v;
    g.beginPath();
    g.arc(cx, cy, rc, 0, 2 * Math.PI);
    g.fill();
    for (const st of SVAGE) {
      g.fillStyle = rgb(STJERNE, st.a);
      g.beginPath();
      g.arc(cx + st.x * rc, cy + st.y * rc, 0.8 * pk(), 0, 2 * Math.PI);
      g.fill();
    }
    g.strokeStyle = MESSING;
    g.lineWidth = 4;
    g.beginPath();
    g.arc(cx, cy, rc + 2, 0, 2 * Math.PI);
    g.stroke();
    g.strokeStyle = BLÆK;
    g.lineWidth = 1;
    g.beginPath();
    g.arc(cx, cy, rc + 4.5, 0, 2 * Math.PI);
    g.stroke();
    return rc / 7.6;
  }

  // Jupiter: en lys, lidt fladtrykt skive med to bånd og mørkere kant
  function jupiter(cx, cy, k) {
    g.save();
    g.beginPath();
    g.ellipse(cx, cy, k, k * 0.935, 0, 0, 2 * Math.PI);
    g.clip();
    g.fillStyle = '#eadfc4';
    g.fillRect(cx - k, cy - k, 2 * k, 2 * k);
    g.fillStyle = 'rgba(180, 154, 116, 0.85)';
    g.fillRect(cx - k, cy - k * 0.36, 2 * k, k * 0.2);
    g.fillRect(cx - k, cy + k * 0.16, 2 * k, k * 0.22);
    const kant = g.createRadialGradient(cx, cy, k * 0.55, cx, cy, k);
    kant.addColorStop(0, 'rgba(0, 0, 0, 0)');
    kant.addColorStop(1, 'rgba(40, 28, 14, 0.45)');
    g.fillStyle = kant;
    g.fillRect(cx - k, cy - k, 2 * k, 2 * k);
    g.restore();
  }

  // En måne som prik (lys 0-1). Navnet står over den
  function måne(x, y, lys, navn = '') {
    if (lys <= 0) return;
    const r = 2.3 * pk();
    const glød = g.createRadialGradient(x, y, 0, x, y, r * 3.2);
    glød.addColorStop(0, rgb(STJERNE, 0.35 * lys));
    glød.addColorStop(1, rgb(STJERNE, 0));
    g.fillStyle = glød;
    g.beginPath();
    g.arc(x, y, r * 3.2, 0, 2 * Math.PI);
    g.fill();
    g.fillStyle = rgb(STJERNE, lys);
    g.beginPath();
    g.arc(x, y, r, 0, 2 * Math.PI);
    g.fill();
    if (navn) tekst(navn, x, y - r - 6 * pk(), { str: 14 * pk(), farve: rgb(STJERNE, 0.85 * lys), base: 'bottom', kursiv: true });
  }

  // Io's vinkel i banen (trin 1: timer efter start. Trin 4: minutter på uret)
  const ioθ1 = (timer) => IO_START + 2 * Math.PI * timer / IO_OMLØB;
  const ioθ4 = (min) => skyggeKant(-SKYGGE_VINKEL, false) + 2 * Math.PI * ((min - NOV_SET) / 60) / IO_OMLØB;

  // Trin 1: kikkerten, det lille ur og "Set ovenfra"
  function skyggenSted() {
    const rc = Math.max(40, Math.min(W, H) / 2 - 8);
    return { cx: W / 2, cy: H / 2, rc };
  }
  function tegnSkyggen() {
    const { cx, cy, rc } = skyggenSted();
    const k = synsfelt(cx, cy, rc);
    g.save();
    g.beginPath();
    g.arc(cx, cy, rc, 0, 2 * Math.PI);
    g.clip();
    // De andre måner bag og foran (de går også rundt, men langsommere)
    for (const navn of ['Europa', 'Ganymedes', 'Callisto']) {
      const p = ioSted(MÅNE_START[navn] + 2 * Math.PI * s.visTimer / OMLØB[navn], SKYGGE_VINKEL, BANE_RADIUS[navn]);
      if (p.z > 0) måne(cx + p.x * k, cy, p.synlig ? 0.9 : 0);
    }
    const io = ioSted(ioθ1(s.visTimer), SKYGGE_VINKEL);
    if (io.z > 0) måne(cx + io.x * k, cy, io.synlig ? 1 : 0, 'Io');
    jupiter(cx, cy, k);
    for (const navn of ['Europa', 'Ganymedes', 'Callisto']) {
      const p = ioSted(MÅNE_START[navn] + 2 * Math.PI * s.visTimer / OMLØB[navn], SKYGGE_VINKEL, BANE_RADIUS[navn]);
      if (p.z <= 0) måne(cx + p.x * k, cy, 0.9);
    }
    if (io.z <= 0) måne(cx + io.x * k, cy, 0.9, 'Io');
    g.restore();
    // Det lille ur i hjørnet: timerne siden start (en viser for timerne på en skive med 12)
    // (ikke på et lille lærred: "‹ Hylden" står i hjørnet, og skyderen siger det samme)
    const lille = Math.min(W, H) < 300;
    const cr = klem(rc * 0.17, 20, 38);
    if (!lille) {
      lilleUr(cr + 8, cr + 8, cr, s.visTimer);
      tekst(`${Math.floor(s.visTimer)} timer`, cr + 8, 2 * cr + 14, { str: 13, base: 'top' });
    }
    if (s.formørket) ovenfra();
    lærred.setAttribute('aria-label', io.synlig
      ? 'Kikkerten: Jupiter i midten og fire små måner på en linje. Io er den, der har navn.'
      : 'Kikkerten: Io er væk. Den er inde i Jupiters skygge. I hjørnet en lille tegning set ovenfra med Solen, Jupiter, skyggen og Io inde i den.');
  }

  function lilleUr(x, y, r, timer) {
    g.fillStyle = PAPIR;
    g.strokeStyle = BLÆK;
    g.lineWidth = 1.4;
    g.beginPath();
    g.arc(x, y, r, 0, 2 * Math.PI);
    g.fill();
    g.stroke();
    for (let i = 0; i < 12; i++) {
      const v = i * 30 * GR;
      g.beginPath();
      g.moveTo(x + Math.sin(v) * r * 0.8, y - Math.cos(v) * r * 0.8);
      g.lineTo(x + Math.sin(v) * r * 0.92, y - Math.cos(v) * r * 0.92);
      g.stroke();
    }
    const v = (timer % 12) * 30 * GR;
    g.lineWidth = 2.2;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.sin(v) * r * 0.62, y - Math.cos(v) * r * 0.62);
    g.stroke();
    g.fillStyle = BLÆK;
    g.beginPath();
    g.arc(x, y, 2, 0, 2 * Math.PI);
    g.fill();
  }

  // "Set ovenfra" i hjørnet: Solen til venstre, Jupiter, skyggen væk fra Solen og Io inde i den
  function ovenfra() {
    const a = rolig ? 1 : glat(0, 0.6, ur - insetFra);
    const b = klem(Math.min(W, H) * 0.55, 120, 230), h = b * 0.52;
    // På et lille lærred står den nederst (øverst står "‹ Hylden")
    const x0 = W - b - 8, y0 = Math.min(W, H) < 300 ? H - h - 8 : 8;
    g.globalAlpha = a;
    g.fillStyle = 'rgba(3, 5, 10, 0.9)';
    g.beginPath();
    g.roundRect(x0, y0, b, h, 6);
    g.fill();
    g.strokeStyle = 'rgba(201, 162, 74, 0.8)';
    g.lineWidth = 1;
    g.stroke();
    const my = y0 + h * 0.5, jx = x0 + b * 0.5, jr = h * 0.13;
    // Solen
    g.fillStyle = '#f3d27a';
    g.beginPath();
    g.arc(x0 + h * 0.18, my, h * 0.12, 0, 2 * Math.PI);
    g.fill();
    // Skyggen bag Jupiter
    g.fillStyle = 'rgba(0, 0, 0, 0.85)';
    g.fillRect(jx, my - jr, b * 0.48, 2 * jr);
    g.strokeStyle = 'rgba(243, 234, 215, 0.25)';
    g.setLineDash([2, 3]);
    g.beginPath();
    g.moveTo(jx, my - jr); g.lineTo(x0 + b - 4, my - jr);
    g.moveTo(jx, my + jr); g.lineTo(x0 + b - 4, my + jr);
    g.stroke();
    g.setLineDash([]);
    // Io's bane og Io i skyggen
    const ir = h * 0.3;
    g.strokeStyle = 'rgba(243, 234, 215, 0.35)';
    g.beginPath();
    g.arc(jx, my, ir, 0, 2 * Math.PI);
    g.stroke();
    g.fillStyle = '#eadfc4';
    g.beginPath();
    g.arc(jx, my, jr, 0, 2 * Math.PI);
    g.fill();
    g.strokeStyle = GULD;
    g.lineWidth = 1.2;
    g.beginPath();
    g.arc(jx + ir, my, 3.2, 0, 2 * Math.PI);
    g.stroke();
    const t = Math.round(12 * pk());
    tekst('Solen', x0 + h * 0.18, my + h * 0.16, { str: t, farve: rgb(STJERNE, 0.8), base: 'top' });
    tekst('Io', jx + ir, my - 6, { str: t, farve: '#f3dfa6', base: 'bottom', kursiv: true });
    tekst('Skyggen', x0 + b - 6, my + jr + 4, { str: t, farve: rgb(STJERNE, 0.6), align: 'right', base: 'top', kursiv: true });
    tekst('Set ovenfra', x0 + 7, y0 + 5, { str: t, farve: rgb(STJERNE, 0.75), align: 'left', base: 'top', kursiv: true });
    g.globalAlpha = 1;
  }

  // ---------- Trin 4: aftenen den 9. november ----------
  function novemberSted() {
    if (W / H > 1.3) {
      const rc = Math.max(40, Math.min(W * 0.3, H / 2 - 8));
      return { cx: W * 0.33, cy: H / 2, rc, ux: W * 0.8, uy: H * 0.42, ur: klem(Math.min(W * 0.13, H * 0.26), 30, 110), under: true };
    }
    const rc = Math.max(40, Math.min(W / 2 - 8, H * 0.33));
    const ur = klem(Math.min(H * 0.14, W * 0.18), 28, 90);
    return { cx: W / 2, cy: rc + 10, rc, ux: W * 0.27, uy: H - ur - 10, ur, under: false };
  }
  function tegnNovember() {
    const n = novemberSted();
    const k = synsfelt(n.cx, n.cy, n.rc);
    const io = ioSted(ioθ4(s.urMin), -SKYGGE_VINKEL);
    jupiter(n.cx, n.cy, k);
    const ioX = n.cx + io.x * k;
    if (io.synlig || s.urMin >= NOV_SET) {
      måne(ioX, n.cy, s.ioLys, s.ioLys > 0.3 ? 'Io' : '');
      if (s.set) {
        g.strokeStyle = GULD;
        g.lineWidth = 2;
        g.beginPath();
        g.arc(ioX, n.cy, 14 * pk(), 0, 2 * Math.PI);
        g.stroke();
      }
    }
    if (s.nuVist && s.urMin < NOV_SET && Math.floor(ur * 2.5) % 2 === 0) {
      tekst('Nu skulle den komme …', n.cx, n.cy + n.rc * 0.55, { str: 15 * pk(), farve: '#f3dfa6', kursiv: true });
    }
    stortUr(n);
    lærred.setAttribute('aria-label', `Kikkerten den 9. november 1676 klokken ${klokken(s.urMin)}. ${s.ioLys > 0.3 ? 'Io er kommet ud af skyggen.' : 'Io er stadig inde i Jupiters skygge.'}`);
  }

  // Uret med visere (Huygens' pendulure var nye), et guldmærke ved tabellens tid og tallene ved siden af eller under
  function stortUr(n) {
    const { ux: x, uy: y, ur: r } = n;
    g.fillStyle = PAPIR;
    g.strokeStyle = BLÆK;
    g.lineWidth = 2;
    g.beginPath();
    g.arc(x, y, r, 0, 2 * Math.PI);
    g.fill();
    g.stroke();
    g.lineWidth = 0.8;
    g.beginPath();
    g.arc(x, y, r - 4, 0, 2 * Math.PI);
    g.stroke();
    for (let i = 0; i < 60; i++) {
      const v = i * 6 * GR, l = i % 5 ? 0.9 : 0.8;
      g.lineWidth = i % 5 ? 0.8 : 1.6;
      g.beginPath();
      g.moveTo(x + Math.sin(v) * r * l, y - Math.cos(v) * r * l);
      g.lineTo(x + Math.sin(v) * r * 0.95, y - Math.cos(v) * r * 0.95);
      g.stroke();
    }
    for (const [tal, i] of [['XII', 0], ['III', 3], ['VI', 6], ['IX', 9]]) {
      const v = i * 30 * GR;
      tekst(tal, x + Math.sin(v) * r * 0.64, y - Math.cos(v) * r * 0.64, { str: Math.max(10, r * 0.2) });
    }
    // Tabellens tid: et guldmærke på kanten
    const vt = (NOV_TABEL % 60) * 6 * GR;
    g.fillStyle = GULD;
    g.beginPath();
    g.moveTo(x + Math.sin(vt) * r * 1.02, y - Math.cos(vt) * r * 1.02);
    g.lineTo(x + Math.sin(vt - 0.07) * r * 1.16, y - Math.cos(vt - 0.07) * r * 1.16);
    g.lineTo(x + Math.sin(vt + 0.07) * r * 1.16, y - Math.cos(vt + 0.07) * r * 1.16);
    g.fill();
    const m = s.urMin;
    const vm = (m % 60) * 6 * GR, vh = ((m / 60) % 12) * 30 * GR;
    g.strokeStyle = BLÆK;
    g.lineCap = 'round';
    g.lineWidth = Math.max(2.5, r * 0.06);
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.sin(vh) * r * 0.45, y - Math.cos(vh) * r * 0.45);
    g.stroke();
    g.lineWidth = Math.max(1.6, r * 0.035);
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.sin(vm) * r * 0.8, y - Math.cos(vm) * r * 0.8);
    g.stroke();
    g.lineCap = 'butt';
    g.fillStyle = BLÆK;
    g.beginPath();
    g.arc(x, y, 3, 0, 2 * Math.PI);
    g.fill();
    // Tallene: under uret (bred) eller til højre for det (smal)
    const str = klem(r * 0.2, 13, 17);
    const [tx, ty, al] = n.under ? [x, y + r + 12, 'center'] : [x + r + 16, y - r * 0.55, 'left'];
    const blink = s.nuVist && m < NOV_SET && Math.floor(ur * 2.5) % 2 === 0;
    tekst(`kl. ${klokken(m)}`, tx, ty, { str: str + 3, align: al, base: 'top', fed: true, farve: blink ? '#9a6b12' : BLÆK });
    tekst(`Tabellen: ${klokken(NOV_TABEL)}`, tx, ty + str * 1.7, { str, align: al, base: 'top', farve: '#7a5a18' });
    if (s.set) {
      tekst(`Set: ${klokken(NOV_SET)}`, tx, ty + str * 3.1, { str, align: al, base: 'top' });
      tekst(`${minutTekst(NOV_SET - NOV_TABEL)} for sent`, tx, ty + str * 4.5, { str, align: al, base: 'top', kursiv: true });
    }
  }

  // ---------- Banerne ovenfra (trin 2 og 3) ----------
  // Rømers Fig. 11 i blæk: Solen A, Jordens bane med månederne, Jupiter B langt ude med Io's bane og skyggen. Er lærredet
  // bredt, står Jupiter til højre (β = 0) og urene til højre for tegningen, ellers står Jupiter øverst og urene under
  function baneSted() {
    const bred = W / H > 1.25;
    if (bred) {
      const fig = { x: 0, y: 0, w: W * 0.66, h: H }, side = { x: W * 0.66, y: 0, w: W * 0.34, h: H };
      const rE = Math.max(20, Math.min(fig.w / 4.9, fig.h / 2.7));
      const sx = fig.x + (fig.w - 4.9 * rE) / 2 + 1.5 * rE, sy = fig.y + fig.h / 2;
      return { bred, fig, side, rE, D: rE * 2.4, sx, sy, β: 0 };
    }
    const fig = { x: 0, y: 0, w: W, h: H * 0.68 }, side = { x: 0, y: H * 0.68, w: W, h: H * 0.32 };
    const rE = Math.max(20, Math.min(fig.h / 4.9, fig.w / 3.1));
    const sx = fig.x + fig.w / 2, sy = fig.y + (fig.h - 4.9 * rE) / 2 + 3.55 * rE;
    return { bred, fig, side, rE, D: rE * 2.4, sx, sy, β: -Math.PI / 2 };
  }
  // Retningen på skærmen til Jordens sted på dag d: mod uret fra retningen mod Jupiter, som set ovenfra fra nord
  const jordRetning = (b, d) => b.β - jordVinkel(d) * GR;
  function jordSted(b, d, r = b.rE) {
    const ψ = jordRetning(b, d);
    return [b.sx + Math.cos(ψ) * r, b.sy + Math.sin(ψ) * r];
  }

  function tegnBaner() {
    const b = baneSted();
    const p = pk();
    const jx = b.sx + Math.cos(b.β) * b.D, jy = b.sy + Math.sin(b.β) * b.D;
    g.strokeStyle = BLÆK;
    g.fillStyle = BLÆK;
    // Jupiters bane (et stykke) og Jordens bane
    g.lineWidth = 0.8;
    g.setLineDash([3, 4]);
    g.beginPath();
    g.arc(b.sx, b.sy, b.D, b.β - 0.32, b.β + 0.32);
    g.stroke();
    g.setLineDash([]);
    g.lineWidth = 1;
    g.beginPath();
    g.arc(b.sx, b.sy, b.rE, 0, 2 * Math.PI);
    g.stroke();
    // Månederne på Jordens bane (kun dem, man kan trække Jorden til)
    for (const m of MÅNEDER) {
      if (m.dag > SIDSTE_DAG) continue;
      const ψ = jordRetning(b, m.dag), c = Math.cos(ψ), si = Math.sin(ψ);
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(b.sx + c * b.rE, b.sy + si * b.rE);
      g.lineTo(b.sx + c * (b.rE + 6), b.sy + si * (b.rE + 6));
      g.stroke();
      const navn = m.navn.length > 5 ? `${m.navn.slice(0, 3)}.` : m.navn;
      tekst(navn, b.sx + c * (b.rE + 11), b.sy + si * (b.rE + 11), {
        str: 12 * p, kursiv: true,
        align: c > 0.3 ? 'left' : c < -0.3 ? 'right' : 'center', base: si > 0.3 ? 'top' : si < -0.3 ? 'bottom' : 'middle',
      });
    }
    // Solen A med stråler
    const sr = Math.max(6, b.rE * 0.11);
    g.fillStyle = '#e9c45a';
    g.beginPath();
    g.arc(b.sx, b.sy, sr, 0, 2 * Math.PI);
    g.fill();
    g.strokeStyle = BLÆK;
    g.lineWidth = 1;
    g.stroke();
    for (let i = 0; i < 12; i++) {
      const v = i * 30 * GR;
      g.beginPath();
      g.moveTo(b.sx + Math.cos(v) * sr * 1.3, b.sy + Math.sin(v) * sr * 1.3);
      g.lineTo(b.sx + Math.cos(v) * sr * 1.75, b.sy + Math.sin(v) * sr * 1.75);
      g.stroke();
    }
    tekst('A', b.sx + sr * 2.1, b.sy + sr * 1.2, { str: 16 * p });
    // Jupiter B, skyggen væk fra Solen og Io's bane, tegnet med "væk fra Solen" opad og drejet på plads
    const jr = Math.max(5, b.rE * 0.13), ir = b.rE * 0.36, L = b.rE * 0.95;
    const rot = b.β + Math.PI / 2;
    const glob = (lx, ly) => [jx + Math.cos(rot) * lx - Math.sin(rot) * ly, jy + Math.sin(rot) * lx + Math.cos(rot) * ly];
    g.save();
    g.translate(jx, jy);
    g.rotate(rot);
    g.fillStyle = 'rgba(22, 21, 19, 0.16)';
    g.fillRect(-jr, -L, 2 * jr, L);
    g.lineWidth = 0.8;
    g.beginPath();
    g.moveTo(-jr, 0); g.lineTo(-jr, -L);
    g.moveTo(jr, 0); g.lineTo(jr, -L);
    g.stroke();
    g.setLineDash([2, 3]);
    g.beginPath();
    g.arc(0, 0, ir, 0, 2 * Math.PI);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = '#e7d8b4';
    g.beginPath();
    g.arc(0, 0, jr, 0, 2 * Math.PI);
    g.fill();
    g.stroke();
    g.restore();
    const [bx, by] = glob(-jr - 8, jr + 6);
    tekst('B', bx, by, { str: 16 * p });
    // Io ved skyggens kant (dér, hvor den kommer ud)
    const [iox, ioy] = glob(jr, -Math.sqrt(Math.max(0, ir * ir - jr * jr)));
    const blink = glimt && ur - glimt.t0 < 0.5;
    g.fillStyle = blink ? GULD : BLÆK;
    g.beginPath();
    g.arc(iox, ioy, blink ? 4.5 : 3, 0, 2 * Math.PI);
    g.fill();
    const [lx, ly] = glob(jr + 9, -Math.sqrt(Math.max(0, ir * ir - jr * jr)) - 4);
    tekst('Io', lx, ly, { str: 13 * p, kursiv: true });
    // Jorden og sigtelinjen til Io
    const [ex, ey] = jordSted(b, s.visDag);
    const ses = kanSes(s.visDag);
    g.strokeStyle = ses ? 'rgba(22, 21, 19, 0.55)' : 'rgba(150, 40, 30, 0.55)';
    g.lineWidth = 1;
    g.setLineDash([4, 4]);
    g.beginPath();
    g.moveTo(ex, ey);
    g.lineTo(iox, ioy);
    g.stroke();
    g.setLineDash([]);
    if (glimt) {
      const q = glimt.varighed ? klem((ur - glimt.t0) / glimt.varighed, 0, 1) : 1;
      const gx = iox + (ex - iox) * q, gy = ioy + (ey - ioy) * q;
      const glød = g.createRadialGradient(gx, gy, 0, gx, gy, 12);
      glød.addColorStop(0, 'rgba(255, 214, 110, 0.95)');
      glød.addColorStop(1, 'rgba(255, 214, 110, 0)');
      g.fillStyle = glød;
      g.beginPath();
      g.arc(gx, gy, 12, 0, 2 * Math.PI);
      g.fill();
    }
    const er = Math.max(5, b.rE * 0.075);
    g.fillStyle = '#7ea6c9';
    g.strokeStyle = BLÆK;
    g.beginPath();
    g.arc(ex, ey, er, 0, 2 * Math.PI);
    g.fill();
    g.stroke();
    const [nx, ny] = jordSted(b, s.visDag, b.rE - er - 12);
    tekst('Jorden', nx, ny, { str: 13 * p });
    if (!ses) tekst('Jupiter kan ikke ses nu', b.sx, b.sy - sr * 2.6, { str: 14 * p, kursiv: true, farve: '#8a2a1e', base: 'bottom' });
    if (s.trin === 'sent') toUre(b);
    else stopur(b);
    lærred.setAttribute('aria-label', s.trin === 'sent'
      ? `Banerne set ovenfra: Solen A i midten, Jorden den ${datoTekst(s.visDag)} og Jupiter B langt ude. ${ses ? `Io ses ${forsinkelseTekst(s.visDag)}.` : 'Jupiter står for tæt på Solen til at ses.'}`
      : `Banerne set ovenfra med Jorden i ${s.dag === AUGUST ? 'august' : 'november'}. Lyset fra Io er ca. ${Math.round(lysMinutter(s.dag))} minutter om at nå Jorden.`);
  }

  const forsinkelseTekst = (d) => {
    const m = forsinkelse(d);
    if (Math.abs(m) < 0.75) return 'til tiden';
    return `${minutTekst(m)} ${m > 0 ? 'for sent' : 'for tidligt'}`;
  };

  // En urskive med kun minutviseren (minut 0 øverst er tabellens tid)
  function minutUr(x, y, r, min, { navn = '', streg = BLÆK, svag = false } = {}) {
    g.globalAlpha = svag ? 0.45 : 1;
    g.fillStyle = PAPIR;
    g.strokeStyle = BLÆK;
    g.lineWidth = 1.6;
    g.beginPath();
    g.arc(x, y, r, 0, 2 * Math.PI);
    g.fill();
    g.stroke();
    for (let i = 0; i < 60; i++) {
      const v = i * 6 * GR, l = i % 5 ? 0.88 : 0.76;
      g.lineWidth = i % 5 ? 0.6 : 1.3;
      g.beginPath();
      g.moveTo(x + Math.sin(v) * r * l, y - Math.cos(v) * r * l);
      g.lineTo(x + Math.sin(v) * r * 0.95, y - Math.cos(v) * r * 0.95);
      g.stroke();
    }
    const v = min * 6 * GR;
    g.strokeStyle = streg;
    g.lineCap = 'round';
    g.lineWidth = Math.max(2, r * 0.07);
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.sin(v) * r * 0.78, y - Math.cos(v) * r * 0.78);
    g.stroke();
    g.lineCap = 'butt';
    g.fillStyle = BLÆK;
    g.beginPath();
    g.arc(x, y, 2.5, 0, 2 * Math.PI);
    g.fill();
    if (navn) tekst(navn, x, y + r + 6, { str: klem(r * 0.32, 12, 16), base: 'top' });
    g.globalAlpha = 1;
  }

  // Trin 2: "Tabellen" og "Set fra Jorden"
  function toUre(b) {
    const { side } = b;
    const ses = kanSes(s.visDag);
    const m = forsinkelse(s.visDag);
    let r, p1, p2;
    if (b.bred && side.w < side.h * 1.1) {
      r = klem(Math.min(side.w * 0.3, side.h * 0.16), 22, 70);
      p1 = [side.x + side.w / 2, side.y + side.h * 0.27];
      p2 = [side.x + side.w / 2, side.y + side.h * 0.66];
    } else if (b.bred) {
      r = klem(Math.min(side.w * 0.2, side.h * 0.3), 22, 70);
      p1 = [side.x + side.w * 0.28, side.y + side.h * 0.45];
      p2 = [side.x + side.w * 0.72, side.y + side.h * 0.45];
    } else {
      r = klem(Math.min(side.h * 0.3, side.w * 0.16), 18, 60);
      p1 = [side.x + side.w * 0.28, side.y + r + 6];
      p2 = [side.x + side.w * 0.72, side.y + r + 6];
    }
    minutUr(p1[0], p1[1], r, 0, { navn: 'Tabellen' });
    minutUr(p2[0], p2[1], r, m, { navn: 'Set fra Jorden', streg: Math.abs(m) < 0.75 ? BLÆK : '#8a2a1e', svag: !ses });
  }

  // Trin 3: stopuret, der tæller lysets minutter
  function stopur(b) {
    const { side } = b;
    const r = b.bred ? klem(Math.min(side.w * 0.32, side.h * 0.25), 24, 80) : klem(Math.min(side.h * 0.34, side.w * 0.2), 20, 64);
    const x = b.bred ? side.x + side.w / 2 : side.x + side.w * 0.3;
    const y = b.bred ? side.y + side.h * 0.42 : side.y + r + 6;
    minutUr(x, y, r, s.stopur, { navn: '' });
    // Knappen på toppen af stopuret
    g.fillStyle = BLÆK;
    g.fillRect(x - 4, y - r - 7, 8, 6);
    const str = klem(r * 0.34, 14, 20);
    const t = glimt || s.stopur > 0 ? `${Math.round(s.stopur)} min` : '0 min';
    if (b.bred) {
      tekst(t, x, y + r + 8, { str: str + 2, base: 'top', fed: true });
      tekst('Stopuret', x, y + r + 12 + str * 1.4, { str: str - 2, base: 'top', kursiv: true });
    } else {
      tekst(t, x + r + 16, y - str * 0.6, { str: str + 2, align: 'left', fed: true });
      tekst('Stopuret', x + r + 16, y + str * 0.8, { str: str - 2, align: 'left', kursiv: true });
    }
  }

  // ---------- Det, man gør ----------
  // Trin 1: tiden (skyderen og et træk på tværs)
  function sætTid(t, { fraSkyder = false } = {}) {
    s.auto = false;
    s.timer = klem(t, 0, TIMER_MAX);
    if (fraSkyder) s.visTimer = s.timer;
    rørt();
    opdaterTid();
    tegnIgen();
  }
  function startAuto() {
    if (s.trin !== 'skyggen' || s.timer > 0) return;
    s.auto = true;
    tegnIgen();
  }

  // Trin 2 og 3: Jordens dag
  function sætDag(d, { fraSkyder = false } = {}) {
    s.dag = klem(Math.round(d), 0, SIDSTE_DAG);
    if (fraSkyder) s.visDag = s.dag;
    if (s.trin === 'sent') {
      if (s.dag >= MÅNEDER[5].dag && kanSes(s.dag)) s.nåetNov = true;
      if (!kanSes(s.dag)) vink(fl?.vink.ikkeSes);
      else if (s.dag < OPPOSITION + 12) vink(fl?.vink.juli);
    }
    rørt();
    opdaterDag();
    tegnIgen();
  }
  // Trin 3: Jorden i august eller november, og lysglimtet
  function jorden(hvor) {
    if (s.trin !== 'hvorfor') return;
    glimt = null;
    s.stopur = 0;
    s.dag = hvor === 'nov' ? NOVEMBER : AUGUST;
    rørt();
    opdaterMærker();
    tegnIgen();
  }
  function send() {
    if (s.trin !== 'hvorfor') return;
    rørt();
    const min = lysMinutter(s.dag);
    // Lige hurtigt i tegningen hver gang: ca. 0,07 s pr. minut (2,5 og 3,2 s)
    glimt = { t0: ur, varighed: rolig ? 0 : min * 0.07, dag: s.dag, min };
    s.visDag = s.dag;
    tegnIgen();
  }

  // Trin 4: uret og trykket
  function startUr() {
    if (s.trin !== 'november' || s.kører) return;
    clearInterval(ventStart);
    ventStart = null;
    s.kører = true;
    tegnIgen();
  }
  function trykNovember(auto = false) {
    if (s.trin !== 'november') return;
    if (!auto) rørt();
    if (!s.kører) startUr();
    if (s.set) return;
    if (s.ioLys < 0.3) {
      s.forTidligt++;
      vink(fl?.vink.ikkeEndnu);
      return;
    }
    s.set = true;
    tegnIgen();
  }

  const lokal = (h) => { const r = lærred.getBoundingClientRect(); return [h.clientX - r.left, h.clientY - r.top]; };
  const ned = (h) => {
    if (!h.isPrimary) return;
    const [x, y] = lokal(h);
    træk = { id: h.pointerId, x, y, sx: x, sy: y, flyttet: false };
    lærred.setPointerCapture?.(h.pointerId);
  };
  const flyt = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    const [x, y] = lokal(h);
    if (Math.hypot(x - træk.sx, y - træk.sy) > 8) træk.flyttet = true;
    if (træk.flyttet && s.trin === 'skyggen') {
      // Et træk mod højre trækker tiden frem: hele bredden er ca. 20 timer
      sætTid(s.timer + (x - træk.x) * 20 / Math.max(240, W));
      s.visTimer = s.timer;
    } else if (træk.flyttet && s.trin === 'sent') {
      // Jorden følger fingeren rundt om Solen
      const b = baneSted();
      const v = (b.β - Math.atan2(y - b.sy, x - b.sx)) / GR;
      const nu = jordVinkel(s.dag);
      const v2 = v + 360 * Math.round((nu - v) / 360);
      sætDag(OPPOSITION + v2 / (jordVinkel(OPPOSITION + 1) - jordVinkel(OPPOSITION)));
      s.visDag = s.dag;
    }
    træk.x = x;
    træk.y = y;
  };
  const op = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    const t = træk;
    træk = null;
    if (!t.flyttet) {
      if (s.trin === 'hvorfor') send();
      else if (s.trin === 'november') trykNovember();
      else if (s.trin === 'skyggen') { rørt(); startAuto(); }
    }
    tegnIgen();
  };
  lærred.addEventListener('pointerdown', ned);
  lærred.addEventListener('pointermove', flyt);
  lærred.addEventListener('pointerup', op);
  const afbryd = () => { træk = null; };
  lærred.addEventListener('pointercancel', afbryd);

  // ---------- Under tegningen ----------
  function underTid() {
    under.innerHTML = '<label class="hs-nat"><span class="hs-nat-tekst"></span>'
      + `<input type="range" min="0" max="${TIMER_MAX}" step="0.25" value="0" aria-label="Timer frem i tiden"></label>`
      + '<p class="ts-maal rs-linje" aria-live="polite"></p>';
    skyder = under.querySelector('input');
    skyderTekst = under.querySelector('.hs-nat-tekst');
    linjeTekst = under.querySelector('.rs-linje');
    skyder.addEventListener('input', () => sætTid(Number(skyder.value), { fraSkyder: true }));
    opdaterTid();
  }
  function opdaterTid() {
    if (!skyder || s.trin !== 'skyggen') return;
    if (Number(skyder.value) !== s.timer) skyder.value = String(s.timer);
    sæt(skyderTekst, `Tid: ${Math.floor(s.timer)} timer`);
    const io = ioSted(ioθ1(s.timer), SKYGGE_VINKEL);
    sæt(linjeTekst, io.iSkygge && s.timer >= FØRSTE + IO_OMLØB - 1 ? 'Io er i skyggen igen, 42½ time efter første gang.'
      : io.iSkygge ? 'Io er i Jupiters skygge.' : io.bag ? 'Io er bag Jupiter.' : 'Io går rundt om Jupiter.');
  }

  function underDag() {
    under.innerHTML = '<label class="hs-nat"><span class="hs-nat-tekst"></span>'
      + `<input type="range" min="0" max="${SIDSTE_DAG}" step="1" value="${s.dag}" aria-label="Datoen fra 1. juni 1676 til 26. februar 1677"></label>`
      + '<p class="ts-maal rs-linje" aria-live="polite"></p><p class="ts-småt">Tabellen er regnet ud fra iagttagelserne i august.</p>';
    skyder = under.querySelector('input');
    skyderTekst = under.querySelector('.hs-nat-tekst');
    linjeTekst = under.querySelector('.rs-linje');
    skyder.addEventListener('input', () => sætDag(Number(skyder.value), { fraSkyder: true }));
    opdaterDag();
  }
  function opdaterDag() {
    if (!skyder || s.trin !== 'sent') return;
    if (Number(skyder.value) !== s.dag) skyder.value = String(s.dag);
    sæt(skyderTekst, datoTekst(s.dag));
    sæt(linjeTekst, kanSes(s.dag) ? `Io kommer ${forsinkelseTekst(s.dag)}.` : 'Jupiter står for tæt på Solen.');
  }

  function underLys() {
    under.innerHTML = '<div class="ts-maal"><p class="rs-mærker"><span class="ts-mærke" data-maaned="aug">August: ca. 36 min</span> '
      + '<span class="ts-mærke" data-maaned="nov">November: ca. 46 min</span></p></div>'
      + '<p class="ts-småt">Minutterne er regnet med nutidens tal. Rømer kendte dem ikke.</p>';
    mærker = under.querySelector('.rs-mærker');
    // Tallene står i dataene (lysMinutter), så de passer med stopuret
    mærker.children[0].textContent = `August: ca. ${Math.round(lysMinutter(AUGUST))} min`;
    mærker.children[1].textContent = `November: ca. ${Math.round(lysMinutter(NOVEMBER))} min`;
    opdaterMærker();
  }
  function opdaterMærker() {
    if (!mærker) return;
    mærker.children[0].classList.toggle('ja', s.målt.aug);
    mærker.children[1].classList.toggle('ja', s.målt.nov);
  }

  // ---------- Trinene ----------
  function sætTrin(trin) {
    rydTimere();
    s.trin = trin;
    s.lab = null;
    felt.dataset.rsTrin = trin;
    glimt = null;
    insetFra = null;
    skyder = skyderTekst = linjeTekst = mærker = null;
    under.replaceChildren();
    tegnIgen();
  }
  const start = {
    skyggen(lab = false) {
      sætTrin('skyggen');
      Object.assign(s, { timer: 0, visTimer: 0, auto: false, formørket: false, anden: false });
      underTid();
      if (!lab) vent(rolig ? 1200 : AUTO_EFTER, startAuto);
    },
    sent() {
      sætTrin('sent');
      Object.assign(s, { dag: AUGUST, visDag: AUGUST, nåetNov: false });
      underDag();
    },
    hvorfor() {
      sætTrin('hvorfor');
      Object.assign(s, { dag: AUGUST, visDag: AUGUST, målt: { aug: false, nov: false }, stopur: 0 });
      underLys();
    },
    november(lab = false) {
      sætTrin('november');
      Object.assign(s, { urMin: NOV_START, kører: false, pauseTil: 0, ioLys: 0, set: false, forTidligt: 0, nuVist: false, hurtig: false });
      // Uret starter, når gættet er gjort (eller med det samme i laboratoriet)
      if (lab) vent(800, startUr);
      else {
        ventStart = setInterval(() => {
          if (!aktiv || (!s.lab && forløbFase() === 'gæt')) return;
          clearInterval(ventStart);
          ventStart = null;
          vent(500, startUr);
        }, 200);
      }
    },
  };

  function sætKapitel(t) {
    if (kapitel) kapitel.textContent = t ?? titel;
  }

  function forløbDel(data) {
    fl = data;
    const trin = {
      skyggen: {
        start: () => start.skyggen(),
        færdig: () => s.formørket,
        visMig: () => { startAuto(); },
      },
      sent: {
        start: () => start.sent(),
        færdig: () => s.nåetNov && Math.abs(s.visDag - s.dag) < 0.5,
        visMig: () => sætDag(NOVEMBER),
      },
      hvorfor: {
        start: () => start.hvorfor(),
        get knapper() {
          return [
            { id: 'ud', tekst: 'Io kommer ud', gør: send },
            { id: 'aug', tekst: 'August', gør: () => jorden('aug'), valgt: () => s.dag === AUGUST },
            { id: 'nov', tekst: 'November', gør: () => jorden('nov'), valgt: () => s.dag === NOVEMBER },
          ];
        },
        færdig: () => s.målt.aug && s.målt.nov && !glimt,
        visMig() {
          const næste = () => {
            if (s.målt.aug && s.målt.nov) return;
            jorden(s.målt.aug ? 'nov' : 'aug');
            send();
            vent(rolig ? 100 : Math.ceil(lysMinutter(s.dag) * 70) + 500, næste);
          };
          næste();
        },
      },
      november: {
        start: () => start.november(),
        knapper: [{ id: 'der', tekst: 'Der er Io!', gør: () => trykNovember(), aktiv: () => !s.set }],
        færdig: () => s.set,
        visMig: () => { s.hurtig = true; startUr(); if (s.ioLys >= 0.3) trykNovember(true); },
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
  function fri(kap = 'sent') {
    sætKapitel(titel);
    if (kap === 'skyggen') start.skyggen(true);
    else if (kap === 'hvorfor') start.hvorfor();
    else if (kap === 'november') start.november(true);
    else { kap = 'sent'; start.sent(); }
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
    // I laboratoriet står trinets knapper her (i turen står de i forløbets linje)
    const knapper = kap === 'hvorfor' ? [['Io kommer ud', send], ['August', () => jorden('aug')], ['November', () => jorden('nov')]]
      : kap === 'november' ? [['Der er Io!', () => trykNovember()], ['Se det igen', () => fri('november')]] : [];
    if (knapper.length) {
      const r = document.createElement('div');
      r.className = 'ts-knapper';
      for (const [t, f] of knapper) {
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
      delete felt.dataset.rsTrin;
    },
    test: {
      tilstand: () => {
        const io = s.trin === 'november' ? ioSted(ioθ4(s.urMin), -SKYGGE_VINKEL) : ioSted(ioθ1(s.visTimer), SKYGGE_VINKEL);
        return {
          trin: s.trin, lab: s.lab,
          timer: s.timer, io: { synlig: io.synlig, iSkygge: io.iSkygge, x: io.x }, formørket: s.formørket, anden: s.anden,
          dag: s.dag, dato: datoTekst(s.dag), forsinkelse: forsinkelse(s.dag), kanSes: kanSes(s.dag), nåetNov: s.nåetNov,
          målt: { ...s.målt }, glimt: Boolean(glimt), stopur: s.stopur,
          ur: klokken(s.urMin), kører: s.kører, ioLys: s.ioLys, set: s.set, forTidligt: s.forTidligt, nuVist: s.nuVist,
          linje: under.querySelector('.rs-linje')?.textContent ?? '',
        };
      },
      tid: (t) => { if (s.trin === 'skyggen') { sætTid(t, { fraSkyder: true }); } },
      dag: (d) => { if (s.trin === 'sent') sætDag(d, { fraSkyder: true }); },
      jorden,
      send,
      tryk: () => trykNovember(),
      // Trin 4: uret springer frem til lige før tabellens tid eller lige før Io (så testene ikke venter)
      spol: (hvor = 'tabel') => {
        if (s.trin !== 'november') return;
        startUr();
        s.urMin = Math.max(s.urMin, (hvor === 'io' ? NOV_SET : NOV_TABEL) - 0.05);
        if (hvor === 'io') s.pauseTil = 0;
        tegnIgen();
      },
      lab: (kap) => fri(kap),
    },
  };
}
