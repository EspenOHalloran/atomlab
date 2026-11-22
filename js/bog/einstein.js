// Tegningerne i bogen om Albert Einstein (Opdagelserne, docs/drejebog-einstein.md, afsnit 5): turen "Lige hurtigt for alle"
// i et lærred i 2D. Alt er stregtegninger i blæk på bogens papir som figurerne i Annalen der Physik 1905 (tynde linjer,
// skravering og kursive bogstaver). Kun lysglimtene, lampens lys og urenes visere er gule, så man kan følge dem (som
// forsidens lommeur, lommeurTegning i js/bog.js).
//
// lavFortælling(felt, { rolig, tekster, påIgen }) fylder opslagets felt (.bog-scene fra js/bog.js) og giver
//   forløbDel(data)  det, Forløb-klodsen (js/forloeb.js) skal bruge pr. trin-id (start, knapper, færdig, visMig)
//   fri(kapitel)     laboratoriet efter turen: de fire kapitler som valg (standard "Uret flyver en tur") og "Fortæl det igen"
//   fjern()          stopper tegningen, timerne og lytterne
//   test             til testadgangen (tilstanden og handlingerne)
//
// Trinene (E2, 21. november 2026). Scenen virker i alle faser (et tryk, mens man gætter, kalder forløbRørt()):
//   toget    Bern med Alperne i baggrunden, et damplokomotiv, der kører mod højre, og en række gaslygter på perronen bag
//            sporet. "Tænd begge" tænder togets lygte og perronens lygte, når de står lige ud for hinanden (højst ca. 2 s
//            at vente), og de to lysglimt farer side om side til målstregen. Færdig, når de er fremme. Bagefter kan toget
//            køre med halvdelen af lysets fart, og glimtene følges stadig ad
//   rundtur  To lommeure på perronen. "Send af sted" sender det højre en tur rundt på en bane, der er længere ved en højere
//            fart (turen varer HJEMME = 20 sekunder på uret hjemme ved alle farter). Uret, der fløj, viser t·√(1 − (v/V)²)
//   vaegten  En skålvægt med batteriet og lampen på den ene skål og lodderne på den anden. "Spol en time" tænder lampen
//            og drejer et ur fra klokken 7 til 8 (Einsteins 7, s. 893). Vægten står stille, men tallet viser 4 milliardtedele
//            gram lettere
//   gps      Jorden forneden med et ur, og en GPS-satellit med et ur, man trækker op (eller skyderen). Højden og farten
//            regnes i gpsUr: Lavt nede vinder farten (uret er bagud), højt oppe vinder højden (+45 − 7 = 38). "Uden
//            rettelse" viser et lille kort, hvor prikken glider ca. 10 km væk på et døgn
//
// Snyd, der skal stå i "Ærligt talt" (E5): Lyset farer alt for langsomt i tegningen (ellers kunne man ikke se det), og
// 100 km/t ses som en langsom kørsel, ikke 10 millioner gange langsommere end lyset. Urene under rundturen viser tiden
// "set fra perronen" (regnet, ikke det, øjet ser), og kun ved afgang og hjemkomst er alle enige. Banen er ikke i rigtig
// størrelse (ved 99 % ville turen på 20 sekunder være næsten 6 millioner km). Vægten kan ikke vise 4 milliardtedele gram.
// Satellitten og Jorden er ikke i rigtig størrelse, højden er trykket sammen, og Jordens drejning er ikke regnet med.
// Tegner kun, når noget bevæger sig (toget kører hele tiden i trin 1).

import { forløbRørt, forløbVenter, forløbVink, tegnForløb } from '../forloeb.js';
import {
  TOG_FARTER, URETS_FARTER, HJEMME, egentid, massetab, LAMPE_W, gpsUr, gpsTal, gpsFejlKm, GPS_HØJDE, RUMSTATIONEN,
  LYSETS_FART_KMT, dansk, småGram,
} from '../data/opdagelser/einstein.js';

const GUL = '#f2b400', GUL_LYS = '#fff3b8', GUL_KANT = '#e0a000', GUL_MØRK = '#c98d00';
const LYS_TEGNET = 0.55; // lysets fart i tegningen: 0,55 gange lærredets bredde pr. sekund
const TUR_TID = 6; // sekunder i tegningen for en rundtur (20 sekunder på uret hjemme)
const SPOL_TID = 3; // sekunder i tegningen for en time
const TOP_KM = GPS_HØJDE; // skyderen går fra rumstationen til GPS-højden
const HØJDE_EKSP = 0.55; // højden trykkes sammen: y følger (h/TOP)^0,55
const GR = Math.PI / 180;
const ROM = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

const klem = (x, a, b) => Math.max(a, Math.min(b, x));
const mod = (a, b, t) => a + (b - a) * t;
const glat = (t) => { t = klem(t, 0, 1); return t * t * (3 - 2 * t); };

// Skyderens værdi (0-1000) og højden i km: lineært i den sammentrykte højde
const fAfHøjde = (h) => (klem(h, 0, TOP_KM) / TOP_KM) ** HØJDE_EKSP;
const højdeAfF = (f) => TOP_KM * klem(f, 0, 1) ** (1 / HØJDE_EKSP);
const F_MIN = fAfHøjde(RUMSTATIONEN);

export function lavFortælling(felt, { rolig = false, tekster = {}, påIgen = null } = {}) {
  let fl = null; // forløbets data (vinkene), når forløbet kører
  felt.innerHTML = '<div class="hs-lærred"><canvas role="img"></canvas></div><div class="hs-under"></div>';
  const lærred = felt.querySelector('canvas');
  const under = felt.querySelector('.hs-under');
  const g = lærred.getContext('2d');
  const kapitel = felt.closest('.bog-opslag')?.querySelector('.bog-kapitel');
  const titel = kapitel?.textContent ?? '';
  const stil = getComputedStyle(felt);
  const skrift = stil.getPropertyValue('--bog-skrift').trim() || 'Georgia, serif';
  const BLÆK = stil.getPropertyValue('--bog-blaek').trim() || '#17140f';
  const PAPIR = stil.getPropertyValue('--bog-papir').trim() || '#f3eee0';

  // Tilstanden. trin: 'toget', 'rundtur', 'vaegten', 'gps'
  const s = {
    trin: 'rundtur', lab: null,
    // trin 1
    togFart: 'tog', togX: 0.05, togAlfa: 1, nyTur: 0, venter: false, glimt: null, mål: false, affyret: 0, tændt: null,
    // trin 2
    urFart: 0.87, rejse: null, hjemme: 0, fløjet: 0, rejst: 0, sidsteFart: null,
    // trin 3
    timer: 0, spoler: false, spolet: 0, slut: 0,
    // trin 4
    højde: RUMSTATIONEN, visHøjde: RUMSTATIONEN, rørtHøjde: false, uden: false, udenT: 0,
  };
  let W = 1, H = 1, dpr = 1; // aldrig 0 (togets fart regnes som en del af bredden)
  let aktiv = true;
  let ramme1 = 0;
  let sidst = 0;
  let ur = 0;
  let timere = [];
  let træk = null; // { id } når satellitten trækkes
  let røg = []; // røgskyer fra lokomotivet: { x, y, t }
  let ui = {}; // elementerne under lærredet i det aktuelle trin

  const vent = (ms, f) => timere.push(setTimeout(() => { if (aktiv) f(); }, ms));
  const rydTimere = () => { timere.forEach(clearTimeout); timere = []; };
  const vink = (t) => { if (fl && !s.lab && t && forløbVenter()) forløbVink(t); };
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

  // ---------- Små tegneværktøjer ----------
  function tekst(t, x, y, { str = 14, farve = BLÆK, align = 'center', base = 'middle', kursiv = false, vægt = '' } = {}) {
    g.font = `${kursiv ? 'italic ' : ''}${vægt ? `${vægt} ` : ''}${Math.round(str)}px ${skrift}`;
    g.fillStyle = farve;
    g.textAlign = align;
    g.textBaseline = base;
    g.fillText(t, x, y);
  }
  function streg(lw = 1, farve = BLÆK) {
    g.strokeStyle = farve;
    g.lineWidth = lw;
    g.lineCap = 'round';
    g.lineJoin = 'round';
  }
  function linje(x1, y1, x2, y2) {
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke();
  }
  // Skravering: parallelle skrå streger inden for en sti (som i et kobberstik)
  function skraver(sti, x, y, w, h, afstand = 4, lw = 0.5, vinkel = 45) {
    g.save();
    g.clip(sti);
    streg(lw);
    g.globalAlpha = 0.55;
    const d = w + h, t = Math.tan(vinkel * GR);
    g.beginPath();
    for (let i = -d; i < d; i += afstand) {
      g.moveTo(x + i, y + h);
      g.lineTo(x + i + h / t, y);
    }
    g.stroke();
    g.restore();
  }
  // Et gult lysglimt: glød, hale bagud (mod venstre, når retningen er 1) og et lyst hoved
  function glimt(x, y, k, retning = 1, alfa = 1) {
    if (alfa <= 0) return;
    g.save();
    g.globalAlpha = alfa;
    const r = 15 * k;
    const glød = g.createRadialGradient(x, y, 0, x, y, r);
    glød.addColorStop(0, 'rgba(255, 230, 128, 0.95)');
    glød.addColorStop(0.45, 'rgba(255, 194, 26, 0.45)');
    glød.addColorStop(1, 'rgba(255, 176, 0, 0)');
    g.fillStyle = glød;
    g.beginPath();
    g.arc(x, y, r, 0, 2 * Math.PI);
    g.fill();
    const l = 52 * k;
    const hale = g.createLinearGradient(x - retning * l, y, x, y);
    hale.addColorStop(0, 'rgba(242, 180, 0, 0)');
    hale.addColorStop(1, 'rgba(242, 180, 0, 1)');
    g.fillStyle = hale;
    g.beginPath();
    g.moveTo(x - retning * l, y);
    g.lineTo(x, y - 2.6 * k);
    g.lineTo(x, y + 2.6 * k);
    g.closePath();
    g.fill();
    g.fillStyle = GUL_LYS;
    g.strokeStyle = GUL_KANT;
    g.lineWidth = Math.max(0.8, 0.7 * k);
    g.beginPath();
    g.arc(x, y, 3.6 * k, 0, 2 * Math.PI);
    g.fill();
    g.stroke();
    g.restore();
  }
  // En lille gul flamme bag glasset i en lygte (lyser, når a > 0)
  function lygteLys(x, y, k, a) {
    if (a <= 0) return;
    const r = 22 * k;
    const glød = g.createRadialGradient(x, y, 0, x, y, r);
    glød.addColorStop(0, `rgba(255, 220, 90, ${0.85 * a})`);
    glød.addColorStop(1, 'rgba(255, 190, 20, 0)');
    g.fillStyle = glød;
    g.beginPath();
    g.arc(x, y, r, 0, 2 * Math.PI);
    g.fill();
  }

  // En Breguet-viser (en smal trekant og en lille ring), gul med blæk om, som på forsidens lommeur
  function viser(x, y, grader, længde, bredde, pomme) {
    const v = grader * GR;
    const ux = Math.sin(v), uy = -Math.cos(v), px = Math.cos(v) * bredde, py = Math.sin(v) * bredde;
    const bx = x - ux * længde * 0.14, by = y - uy * længde * 0.14;
    g.fillStyle = GUL;
    g.strokeStyle = BLÆK;
    g.lineWidth = Math.max(0.5, bredde * 0.3);
    g.beginPath();
    g.moveTo(bx - px, by - py);
    g.lineTo(x + ux * længde, y + uy * længde);
    g.lineTo(bx + px, by + py);
    g.closePath();
    g.fill();
    g.stroke();
    if (pomme) {
      const mx = x + ux * længde * pomme, my = y + uy * længde * pomme, r = bredde * 1.35;
      g.beginPath();
      g.arc(mx, my, r, 0, 2 * Math.PI);
      g.fill();
      g.stroke();
      g.fillStyle = PAPIR;
      g.beginPath();
      g.arc(mx, my, r * 0.45, 0, 2 * Math.PI);
      g.fill();
    }
  }
  // Et lommeur i radius r: bøjlen, kronen, kassen med skravering på skyggesiden, minutstreger, romertal og to visere.
  // timer og minutter er visernes stilling. Uden timer tæller uret sekunder (den lange viser er sekundviseren).
  function lommeur(x, y, r, { timer = null, minutter = 0, sekunder = null } = {}) {
    const lw = Math.max(0.9, r * 0.035);
    // Bøjlen og kronen
    streg(lw);
    g.beginPath();
    g.arc(x, y - r - r * 0.2, r * 0.22, Math.PI * 0.95, Math.PI * 2.05);
    g.stroke();
    g.beginPath();
    g.arc(x, y - r - r * 0.2, r * 0.15, Math.PI * 0.95, Math.PI * 2.05);
    g.lineWidth = lw * 0.5;
    g.stroke();
    g.lineWidth = lw;
    g.fillStyle = PAPIR;
    g.beginPath();
    g.roundRect(x - r * 0.12, y - r - r * 0.17, r * 0.24, r * 0.15, r * 0.03);
    g.fill();
    g.stroke();
    // Kassen
    g.beginPath();
    g.arc(x, y, r, 0, 2 * Math.PI);
    g.fillStyle = PAPIR;
    g.fill();
    streg(lw * 1.3);
    g.stroke();
    // Skyggesiden (nederst til højre), som i et kobberstik
    streg(Math.max(0.4, r * 0.012));
    g.globalAlpha = 0.7;
    g.beginPath();
    for (let a = 62; a < 200; a += 4) {
      const v = a * GR;
      g.moveTo(x + Math.sin(v) * r * 0.94, y - Math.cos(v) * r * 0.94);
      g.lineTo(x + Math.sin(v) * r * 0.99, y - Math.cos(v) * r * 0.99);
    }
    g.stroke();
    g.globalAlpha = 1;
    g.beginPath();
    g.arc(x, y, r * 0.92, 0, 2 * Math.PI);
    g.stroke();
    // Minutstregerne og romertallene
    g.beginPath();
    for (let i = 0; i < 60; i++) {
      const v = i * 6 * GR, ind = i % 5 ? 0.84 : 0.79;
      g.moveTo(x + Math.sin(v) * r * 0.88, y - Math.cos(v) * r * 0.88);
      g.lineTo(x + Math.sin(v) * r * ind, y - Math.cos(v) * r * ind);
    }
    g.stroke();
    if (r >= 30) {
      for (let i = 0; i < 12; i++) {
        const v = i * 30 * GR;
        tekst(ROM[i], x + Math.sin(v) * r * 0.64, y - Math.cos(v) * r * 0.64 + r * 0.01, { str: Math.max(7, r * 0.15) });
      }
    } else {
      g.beginPath();
      for (let i = 0; i < 12; i++) {
        const v = i * 30 * GR;
        g.moveTo(x + Math.sin(v) * r * 0.78, y - Math.cos(v) * r * 0.78);
        g.lineTo(x + Math.sin(v) * r * 0.66, y - Math.cos(v) * r * 0.66);
      }
      g.stroke();
    }
    // Viserne
    if (timer != null) {
      viser(x, y, (timer % 12) * 30 + minutter * 0.5, r * 0.45, Math.max(1.2, r * 0.05), 0.62);
      viser(x, y, minutter * 6, r * 0.72, Math.max(1, r * 0.038), 0.7);
    } else {
      // Et ur, der tæller sekunder: den korte viser er minutterne, den lange sekunderne
      const sek = sekunder ?? 0;
      viser(x, y, sek * 0.1, r * 0.45, Math.max(1.2, r * 0.05), 0.62);
      viser(x, y, sek * 6, r * 0.8, Math.max(1, r * 0.036), 0.72);
    }
    g.fillStyle = GUL;
    g.strokeStyle = BLÆK;
    g.lineWidth = 0.7;
    g.beginPath();
    g.arc(x, y, Math.max(1.6, r * 0.05), 0, 2 * Math.PI);
    g.fill();
    g.stroke();
  }

  // ---------- Trin 1: toget og lyset ----------
  const tFart = () => TOG_FARTER.find((f) => f.id === s.togFart) ?? TOG_FARTER[0];
  function togMål() {
    const k = klem(Math.min(H / 235, W / 470), 0.55, 1.8);
    const yR = klem(H / 2 + 61 * k, 140 * k, H - 16 * k); // skinnernes top (tegningen står midt i lærredet)
    const L = 150 * k; // lokomotiv og tender
    const xMål = W - Math.max(24, W * 0.07);
    const afstand = Math.max(70, W * 0.13);
    const lygter = [];
    for (let x = Math.max(30, W * 0.08); x <= xMål - Math.max(120, W * 0.3); x += afstand) lygter.push(x);
    if (!lygter.length) lygter.push(Math.max(10, W * 0.12)); // altid mindst én lygte (et meget smalt lærred)
    const yTog = yR - 37 * k; // togets lygte
    const yPerron = yR - 96 * k; // lygterne på perronen (over toget)
    return { k, yR, L, xMål, lygter, yTog, yPerron };
  }
  // Togets forreste kant i px
  const togFront = () => s.togX * W;

  function tegnAlperne(m) {
    // Alperne ved Bern i horisonten: en tynd kontur med skraverede skyggesider (til højre for hver tinde) og sne på toppene
    const h = 62 * m.k;
    const bund = m.yR - 14 * m.k;
    const y0 = bund - 36 * m.k - h;
    const toppe = [[-0.02, 0.75], [0.06, 0.25], [0.12, 0.6], [0.2, 0.0], [0.27, 0.55], [0.33, 0.3], [0.4, 0.7], [0.48, 0.15],
      [0.55, 0.5], [0.63, 0.05], [0.7, 0.6], [0.77, 0.35], [0.84, 0.75], [0.91, 0.2], [0.97, 0.55], [1.03, 0.4]];
    const p = toppe.map(([fx, fy]) => [fx * W, y0 + fy * h]);
    const fod = y0 + h * 1.05;
    g.save();
    g.globalAlpha = 0.55;
    // Skyggesiderne: fra hver tinde ned til næste dal
    for (let i = 1; i < p.length - 1; i++) {
      if (p[i][1] > p[i - 1][1] || p[i][1] > p[i + 1][1]) continue; // kun tinder
      const sti = new Path2D();
      sti.moveTo(p[i][0], p[i][1]);
      sti.lineTo(p[i + 1][0], p[i + 1][1]);
      sti.lineTo(p[i + 1][0], fod);
      sti.lineTo(p[i][0] + (p[i + 1][0] - p[i][0]) * 0.35, fod);
      sti.closePath();
      skraver(sti, p[i][0], p[i][1], p[i + 1][0] - p[i][0], fod - p[i][1], 3.2 * m.k, 0.45, 65);
    }
    streg(0.9);
    g.beginPath();
    p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.stroke();
    // Snegrænsen: små takker under de højeste tinder
    streg(0.6);
    for (let i = 1; i < p.length - 1; i++) {
      if (p[i][1] - y0 > h * 0.2) continue;
      const [x, y] = p[i], d = 10 * m.k;
      g.beginPath();
      g.moveTo(x - d, y + d * 0.9);
      g.lineTo(x - d * 0.5, y + d * 0.6);
      g.lineTo(x, y + d);
      g.lineTo(x + d * 0.5, y + d * 0.55);
      g.lineTo(x + d, y + d * 0.95);
      g.stroke();
    }
    g.restore();
  }

  function tegnLygtepæl(x, m, lys) {
    const k = m.k, bund = m.yR - 14 * k, top = m.yPerron + 9 * k;
    streg(1.1 * k);
    linje(x, bund, x, top);
    linje(x - 5 * k, bund, x + 5 * k, bund);
    // Lygten: et lille hus med glas og tag
    lygteLys(x, m.yPerron, k, lys);
    g.fillStyle = lys > 0 ? `rgba(255, 236, 160, ${0.4 + 0.6 * lys})` : PAPIR;
    g.beginPath();
    g.moveTo(x - 5 * k, m.yPerron + 8 * k);
    g.lineTo(x - 7 * k, m.yPerron - 7 * k);
    g.lineTo(x + 7 * k, m.yPerron - 7 * k);
    g.lineTo(x + 5 * k, m.yPerron + 8 * k);
    g.closePath();
    g.fill();
    streg(0.9 * k);
    g.stroke();
    g.beginPath();
    g.moveTo(x - 9 * k, m.yPerron - 7 * k);
    g.lineTo(x, m.yPerron - 13 * k);
    g.lineTo(x + 9 * k, m.yPerron - 7 * k);
    g.closePath();
    g.fillStyle = PAPIR;
    g.fill();
    g.stroke();
    linje(x, m.yPerron - 13 * k, x, m.yPerron - 16 * k);
  }

  function tegnPerron(m) {
    // Perronen bag sporet: en kant med sten og et tag af lygter
    const k = m.k, y = m.yR - 14 * k;
    streg(1);
    linje(0, y, W, y);
    g.save();
    g.globalAlpha = 0.5;
    streg(0.5);
    for (let x = 0; x < W; x += 22 * k) linje(x, y, x, y + 5 * k);
    linje(0, y + 5 * k, W, y + 5 * k);
    g.restore();
  }

  function tegnSpor(m) {
    const k = m.k;
    streg(1.4 * k);
    linje(0, m.yR, W, m.yR);
    streg(0.8 * k);
    linje(0, m.yR + 4 * k, W, m.yR + 4 * k);
    // Svellerne
    g.save();
    g.globalAlpha = 0.7;
    streg(1.6 * k);
    for (let x = 0; x < W; x += 16 * k) linje(x, m.yR + 5 * k, x - 4 * k, m.yR + 12 * k);
    g.restore();
    // Jorden foran sporet: let skravering
    const sti = new Path2D();
    sti.rect(0, m.yR + 13 * k, W, H - m.yR - 13 * k);
    g.save();
    g.globalAlpha = 0.35;
    skraver(sti, 0, m.yR + 13 * k, W, H - m.yR, 7 * k, 0.4, 20);
    g.restore();
  }

  // Lokomotivet med tender, forreste kant i fx (mod højre), stregtegnet. lysA: lygtens lys
  function tegnLokomotiv(fx, m, lysA, alfa) {
    if (alfa <= 0) return;
    const k = m.k, y = m.yR;
    g.save();
    g.globalAlpha = alfa;
    const x = (v) => fx - v * k; // v: px fra fronten mod venstre
    const hjul = (cx, r) => {
      g.fillStyle = PAPIR;
      g.beginPath();
      g.arc(cx, y - r, r, 0, 2 * Math.PI);
      g.fill();
      streg(1.2 * k);
      g.stroke();
      g.beginPath();
      g.arc(cx, y - r, r * 0.78, 0, 2 * Math.PI);
      streg(0.5 * k);
      g.stroke();
      const v0 = -(fx / (r)) % (2 * Math.PI); // hjulene drejer med kørslen
      g.beginPath();
      for (let i = 0; i < 8; i++) {
        const v = v0 + (i * Math.PI) / 4;
        g.moveTo(cx, y - r);
        g.lineTo(cx + Math.cos(v) * r * 0.78, y - r + Math.sin(v) * r * 0.78);
      }
      g.stroke();
      g.fillStyle = BLÆK;
      g.beginPath();
      g.arc(cx, y - r, 1.6 * k, 0, 2 * Math.PI);
      g.fill();
    };
    // Tenderen (bagerst)
    const tender = new Path2D();
    tender.roundRect(x(150), y - 40 * k, 38 * k, 30 * k, 2 * k);
    g.fillStyle = PAPIR;
    g.fill(tender);
    streg(1.2 * k);
    g.stroke(tender);
    skraver(tender, x(150), y - 40 * k, 38 * k, 30 * k, 4 * k, 0.4 * k, 60);
    // Kul i tenderen
    g.beginPath();
    for (let i = 0; i < 6; i++) g.arc(x(146 - i * 6), y - 41 * k, 3.2 * k, Math.PI, 0);
    streg(0.8 * k);
    g.stroke();
    // Førerhuset
    const hus = new Path2D();
    hus.rect(x(108), y - 62 * k, 30 * k, 50 * k);
    g.fillStyle = PAPIR;
    g.fill(hus);
    streg(1.2 * k);
    g.stroke(hus);
    g.beginPath();
    g.moveTo(x(112), y - 62 * k);
    g.quadraticCurveTo(x(93), y - 70 * k, x(74), y - 62 * k);
    g.stroke();
    g.strokeRect(x(103), y - 55 * k, 11 * k, 13 * k); // vinduet
    // Kedlen (en cylinder) med røgskorsten, dom og fløjte
    const kedel = new Path2D();
    kedel.roundRect(x(78), y - 46 * k, 70 * k, 26 * k, 4 * k);
    g.fillStyle = PAPIR;
    g.fill(kedel);
    streg(1.2 * k);
    g.stroke(kedel);
    skraver(kedel, x(78), y - 30 * k, 70 * k, 10 * k, 3.5 * k, 0.4 * k, 80);
    for (const b of [62, 40, 22]) linje(x(b), y - 46 * k, x(b), y - 20 * k); // båndene om kedlen
    g.fillStyle = PAPIR;
    g.beginPath();
    g.moveTo(x(24), y - 46 * k);
    g.lineTo(x(26), y - 64 * k);
    g.lineTo(x(14), y - 64 * k);
    g.lineTo(x(16), y - 46 * k);
    g.closePath();
    g.fill();
    g.stroke();
    g.beginPath();
    g.ellipse(x(20), y - 64 * k, 8 * k, 2.4 * k, 0, 0, 2 * Math.PI);
    g.fill();
    g.stroke();
    g.beginPath();
    g.arc(x(48), y - 46 * k, 7 * k, Math.PI, 0);
    g.fill();
    g.stroke();
    // Rammen, cylinderen og bufferne foran
    g.strokeRect(x(150), y - 18 * k, 150 * k, 4 * k);
    g.beginPath();
    g.roundRect(x(28), y - 22 * k, 18 * k, 10 * k, 2 * k);
    g.stroke();
    linje(fx - 6 * k, y - 26 * k, fx, y - 26 * k);
    linje(fx, y - 29 * k, fx, y - 23 * k);
    // Hjulene og plejlstangen
    hjul(x(88), 13 * k);
    hjul(x(60), 13 * k);
    hjul(x(22), 8 * k);
    hjul(x(142), 7 * k);
    hjul(x(122), 7 * k);
    // Plejlstangen mellem drivhjulene
    streg(1.4 * k);
    const v0 = -(fx / (13 * k));
    linje(x(88) + Math.cos(v0) * 7 * k, y - 13 * k + Math.sin(v0) * 7 * k, x(60) + Math.cos(v0) * 7 * k, y - 13 * k + Math.sin(v0) * 7 * k);
    // Lygten foran på kedlen
    const lx = fx - 6 * k, ly = m.yTog;
    lygteLys(lx + 3 * k, ly, k, lysA);
    g.fillStyle = lysA > 0 ? `rgba(255, 236, 160, ${0.4 + 0.6 * lysA})` : PAPIR;
    g.beginPath();
    g.roundRect(lx - 6 * k, ly - 6 * k, 10 * k, 12 * k, 2 * k);
    g.fill();
    streg(1 * k);
    g.stroke();
    g.beginPath();
    g.arc(lx + 4 * k, ly, 4 * k, -Math.PI / 2, Math.PI / 2);
    g.stroke();
    g.restore();
  }

  function tegnRøg(m) {
    g.save();
    streg(0.7 * m.k);
    for (const p of røg) {
      const a = 1 - p.t / 2.6;
      if (a <= 0) continue;
      g.globalAlpha = 0.5 * a;
      g.beginPath();
      g.arc(p.x, p.y, (5 + p.t * 9) * m.k, 0, 2 * Math.PI);
      g.stroke();
    }
    g.restore();
  }

  function tegnToget() {
    const m = togMål();
    tegnAlperne(m);
    tegnPerron(m);
    const fx = togFront();
    const tændtA = s.tændt ? klem(1 - (ur - s.tændt.t) / 1.4, 0, 1) : 0;
    for (const x of m.lygter) tegnLygtepæl(x, m, s.tændt && Math.abs(s.tændt.x - x) < 1 ? Math.max(tændtA, s.mål ? 0.25 : 0) : 0);
    tegnSpor(m);
    tegnRøg(m);
    tegnLokomotiv(fx, m, s.glimt ? Math.max(tændtA, 0) : 0, s.togAlfa);
    // Målstregen med et lille flag og ordet "Mål"
    const k = m.k, xm = m.xMål;
    streg(1.3 * k);
    g.save();
    g.setLineDash([5 * k, 4 * k]);
    linje(xm, m.yPerron - 18 * k, xm, m.yR);
    g.restore();
    g.fillStyle = PAPIR;
    g.beginPath();
    g.moveTo(xm, m.yPerron - 34 * k);
    g.lineTo(xm + 18 * k, m.yPerron - 29 * k);
    g.lineTo(xm, m.yPerron - 24 * k);
    g.closePath();
    g.fill();
    g.stroke();
    linje(xm, m.yPerron - 34 * k, xm, m.yPerron - 18 * k);
    tekst('Mål', xm - 6 * k, m.yPerron - 29 * k, { str: 13 * k + 2, kursiv: true, align: 'right' });
    // Lysglimtene: ét fra togets lygte og ét fra perronens lygte, samme fart
    if (s.glimt) {
      const x = Math.min(m.xMål, s.glimt.x0 + (rolig ? W : LYS_TEGNET * W * (ur - s.glimt.t)));
      const fremme = x >= m.xMål;
      const a = fremme ? klem(1 - (ur - s.glimt.ved) / 2.5, 0.35, 1) : 1;
      // Sporene efter glimtene: tynde stiplede linjer
      g.save();
      g.globalAlpha = 0.6;
      g.setLineDash([2 * k, 3 * k]);
      streg(0.7 * k, GUL_MØRK);
      linje(s.glimt.x0, m.yPerron, x, m.yPerron);
      linje(s.glimt.x0, m.yTog, x, m.yTog);
      g.restore();
      glimt(x, m.yPerron, k, 1, a);
      glimt(x, m.yTog, k, 1, a);
      if (fremme) {
        // Begge ramte målstregen på én gang
        g.save();
        g.globalAlpha = klem(1 - (ur - s.glimt.ved) / 1.2, 0, 1);
        streg(1.2 * k, GUL_KANT);
        for (const y of [m.yPerron, m.yTog]) {
          g.beginPath();
          g.arc(xm, y, (6 + (ur - s.glimt.ved) * 30) * k, 0, 2 * Math.PI);
          g.stroke();
        }
        g.restore();
        tekst('samtidig!', xm - 8 * k, m.yTog + 20 * k, { str: Math.max(13, 14 * k), kursiv: true, align: 'right', farve: GUL_MØRK, vægt: 'bold' });
      }
    } else if (s.venter) {
      tekst('venter, til lygterne står ud for hinanden …', W / 2, m.yPerron - 30 * m.k, { str: 12 * m.k + 2, kursiv: true });
    }
    // Bogstaverne fra Einsteins egen side: v ved toget og V ved lyset
    tekst('v', fx - 74 * k, m.yR - 80 * k, { str: 16 * k + 2, kursiv: true });
    if (s.glimt && !s.glimt.ved) tekst('V', s.glimt.x0 + LYS_TEGNET * W * (ur - s.glimt.t) - 22 * k, m.yTog - 12 * k, { str: 16 * k + 2, kursiv: true });
  }

  function opdaterToget(dt) {
    const m = togMål();
    const fart = tFart().tegnet * LYS_TEGNET * W;
    const før = togFront();
    // Et nyt tog, når man venter, og det første er kørt forbi den sidste lygte
    if (s.nyTur) {
      s.togAlfa = Math.max(0, s.togAlfa - dt / 0.3);
      if (s.togAlfa <= 0) {
        s.togX = Math.max(0, (m.lygter[0] - fart * 0.9)) / W;
        s.nyTur = 0;
      }
    } else if (s.togAlfa < 1) s.togAlfa = Math.min(1, s.togAlfa + dt / 0.3);
    if (!rolig) s.togX += (fart * dt) / W;
    const nu = togFront();
    if (nu - m.L > W) s.togX = 0;
    // Røgen fra skorstenen
    if (!rolig && s.togAlfa > 0.5) {
      if (!røg.length || røg.at(-1).t > 0.32) røg.push({ x: nu - 20 * m.k, y: m.yR - 66 * m.k, t: 0 });
    }
    for (const p of røg) {
      p.t += dt;
      p.y -= 14 * m.k * dt;
      p.x -= fart * dt * 0.35;
    }
    røg = røg.filter((p) => p.t < 2.6);
    // Tænd, når togets lygte passerer en lygte på perronen
    if (s.venter && !s.nyTur && s.togAlfa >= 1) {
      const ramt = m.lygter.find((x) => før - 6 * m.k <= x && x <= nu - 6 * m.k + 0.001) ?? (rolig ? m.lygter[1] ?? m.lygter[0] : null);
      if (ramt != null) {
        if (rolig) s.togX = (ramt + 6 * m.k) / W;
        affyr(ramt);
      } else if (nu - 6 * m.k > m.lygter.at(-1)) s.nyTur = 1;
    }
    // Glimtene når målet
    if (s.glimt && !s.glimt.ved && (rolig || s.glimt.x0 + LYS_TEGNET * W * (ur - s.glimt.t) >= m.xMål)) {
      s.glimt.ved = ur;
      vent(rolig ? 0 : 350, () => {
        s.mål = true;
        s.affyret++;
        visTogValg();
        tegnForløb();
        tegnIgen();
      });
    }
  }

  function affyr(x) {
    s.venter = false;
    s.glimt = { x0: x, t: ur, ved: 0 };
    s.tændt = { x, t: ur };
    tegnIgen();
  }

  function tænd() {
    forløbRørt();
    if (s.venter) return;
    if (s.glimt && !s.glimt.ved) return; // glimtene er på vej
    s.glimt = null;
    s.tændt = null;
    s.venter = true;
    const m = togMål();
    // Er der langt til næste lygte, siges det, hvorfor man venter
    const front = togFront() - 6 * m.k;
    const næste = m.lygter.find((x) => x >= front);
    const fart = tFart().tegnet * LYS_TEGNET * W;
    if (næste == null || (næste - front) / Math.max(1, fart) > 0.8) vink(fl?.vink?.tog);
    tegnIgen();
  }

  function vælgTogFart(id) {
    if (!TOG_FARTER.some((f) => f.id === id)) return;
    forløbRørt();
    s.togFart = id;
    visTogValg();
    tegnIgen();
  }

  // Under tegningen: farterne (efter første gang i turen, altid i laboratoriet) og tallene
  function underToget() {
    under.replaceChildren();
    const mål = document.createElement('div');
    mål.className = 'ts-maal es-maal';
    mål.innerHTML = '<p class="es-tog-fart"></p><p class="ts-småt">Lysets fart: 1.079 millioner km/t (for begge lygter)</p>';
    const valg = document.createElement('div');
    valg.className = 'ts-knapper es-valg';
    valg.setAttribute('role', 'group');
    valg.setAttribute('aria-label', 'Togets fart');
    for (const f of TOG_FARTER) {
      const b = document.createElement('button');
      b.className = 'hs-kapitel';
      b.dataset.fart = f.id;
      b.textContent = f.tekst;
      b.addEventListener('click', () => vælgTogFart(f.id));
      valg.append(b);
    }
    under.append(valg, mål);
    ui = { valg, fart: mål.querySelector('.es-tog-fart') };
    visTogValg();
  }
  function visTogValg() {
    if (!ui.valg || s.trin !== 'toget') return;
    ui.valg.hidden = !s.lab && !s.affyret;
    for (const b of ui.valg.children) b.setAttribute('aria-pressed', String(b.dataset.fart === s.togFart));
    const f = tFart();
    ui.fart.textContent = `Togets fart: ${f.kmt < 1000 ? `${f.kmt} km/t` : `${dansk(f.kmt / 1e6)} millioner km/t (halvdelen af lysets)`}`;
  }

  // ---------- Trin 2: uret, der flyver en tur ----------
  function rundMål() {
    const k = klem(Math.min(H / 260, W / 470), 0.6, 1.7);
    const yG = H - Math.max(26, H * 0.12); // perronens kant
    const r = klem(Math.min(W * 0.12, H * 0.19), 22, 72);
    const yU = yG - r - 14 * k;
    const xH = Math.max(r + 16, W * 0.2), xF = Math.max(xH + 2.6 * r, W * 0.56);
    const Amax = Math.min(W - xF - r - 10, xF - xH - r * 1.2);
    const Bmax = Math.max(10, (yU - r - 26 * k) / 2);
    return { k, yG, r, yU, xH, xF, Amax, Bmax };
  }
  // Rundturens bane: en ellipse, der begynder og slutter ved urets plads (nederst), og som er længere ved højere fart
  function banePunkt(m, β, u) {
    const A = Math.max(4, m.Amax * β), B = Math.max(6, m.Bmax * β);
    const v = Math.PI / 2 - 2 * Math.PI * u;
    return [m.xF + A * Math.cos(v) - 0, (m.yU - B) + B * Math.sin(v)];
  }

  function tegnRundtur() {
    const m = rundMål();
    const k = m.k;
    // Perronen
    streg(1.2);
    linje(0, m.yG, W, m.yG);
    g.save();
    g.globalAlpha = 0.45;
    streg(0.5);
    for (let x = 6; x < W; x += 20 * k) linje(x, m.yG, x - 8 * k, m.yG + 10 * k);
    g.restore();
    // Banen for den valgte fart (stiplet), med en pil
    const β = s.rejse ? s.rejse.β : s.urFart;
    g.save();
    g.setLineDash([4 * k, 5 * k]);
    streg(0.8 * k);
    g.globalAlpha = 0.65;
    g.beginPath();
    for (let i = 0; i <= 80; i++) {
      const [x, y] = banePunkt(m, β, i / 80);
      if (i) g.lineTo(x, y);
      else g.moveTo(x, y);
    }
    g.stroke();
    g.restore();
    const [px, py] = banePunkt(m, β, 0.25), [qx, qy] = banePunkt(m, β, 0.27);
    const v = Math.atan2(qy - py, qx - px);
    g.fillStyle = BLÆK;
    g.beginPath();
    g.moveTo(qx + Math.cos(v) * 6 * k, qy + Math.sin(v) * 6 * k);
    g.lineTo(qx + Math.cos(v + 2.5) * 6 * k, qy + Math.sin(v + 2.5) * 6 * k);
    g.lineTo(qx + Math.cos(v - 2.5) * 6 * k, qy + Math.sin(v - 2.5) * 6 * k);
    g.closePath();
    g.fill();
    // Fodstykkerne, urene står på
    for (const x of [m.xH, m.xF]) {
      streg(1);
      g.fillStyle = PAPIR;
      g.beginPath();
      g.moveTo(x - m.r * 0.55, m.yG);
      g.lineTo(x - m.r * 0.35, m.yG - 12 * k);
      g.lineTo(x + m.r * 0.35, m.yG - 12 * k);
      g.lineTo(x + m.r * 0.55, m.yG);
      g.fill();
      g.stroke();
    }
    // Uret hjemme
    lommeur(m.xH, m.yU, m.r, { sekunder: s.hjemme });
    // Uret, der flyver (på banen, eller hjemme på sin plads)
    let fx = m.xF, fy = m.yU;
    if (s.rejse) {
      const u = rolig ? 1 : klem((ur - s.rejse.t) / TUR_TID, 0, 1);
      [fx, fy] = banePunkt(m, s.rejse.β, u);
      // Fartstreger bag uret
      const [ax, ay] = banePunkt(m, s.rejse.β, Math.max(0, u - 0.02));
      const vv = Math.atan2(fy - ay, fx - ax);
      g.save();
      g.globalAlpha = 0.6;
      streg(0.8 * k);
      for (const d of [-0.45, 0, 0.45]) {
        const sx = fx - Math.cos(vv) * m.r * 1.15 + Math.cos(vv + Math.PI / 2) * d * m.r;
        const sy = fy - Math.sin(vv) * m.r * 1.15 + Math.sin(vv + Math.PI / 2) * d * m.r;
        linje(sx, sy, sx - Math.cos(vv) * m.r * 0.7 * s.rejse.β, sy - Math.sin(vv) * m.r * 0.7 * s.rejse.β);
      }
      g.restore();
    }
    lommeur(fx, fy, m.r, { sekunder: s.fløjet });
    // Navnene og tallene under urene
    const ty = m.yG + Math.min(16, (H - m.yG) * 0.5);
    tekst(`Hjemme: ${dansk(s.hjemme, 1)} s`, m.xH, ty, { str: 13 * k + 2, kursiv: true });
    tekst(`${s.rejse ? 'Flyver' : 'Fløjet'}: ${dansk(s.fløjet, 1)} s`, m.xF, ty, { str: 13 * k + 2, kursiv: true });
    // Forskellen, når uret er hjemme igen
    if (s.rejst && !s.rejse) {
      const bagud = s.hjemme - s.fløjet;
      const y = m.yU - m.r - 30 * k;
      streg(0.9 * k);
      g.beginPath();
      g.moveTo(m.xH, y + 8 * k);
      g.lineTo(m.xH, y);
      g.lineTo(m.xF, y);
      g.lineTo(m.xF, y + 8 * k);
      g.stroke();
      tekst(`bagud: ${dansk(bagud, 1)} s`, (m.xH + m.xF) / 2, y - 9 * k, { str: 14 * k + 2, kursiv: true, farve: GUL_MØRK, vægt: 'bold' });
    }
    // Bogstaverne fra Einsteins side 904: t hjemme og τ på uret, der flyver
    tekst('t', m.xH + m.r + 8 * k, m.yU - m.r * 0.7, { str: 16 * k + 2, kursiv: true });
    tekst('τ', fx + m.r + 8 * k, fy - m.r * 0.7, { str: 16 * k + 2, kursiv: true });
  }

  function opdaterRundtur() {
    if (!s.rejse) return false;
    const u = rolig ? 1 : klem((ur - s.rejse.t) / TUR_TID, 0, 1);
    s.hjemme = HJEMME * u;
    s.fløjet = egentid(s.hjemme, s.rejse.β);
    if (u >= 1) {
      s.sidsteFart = s.rejse.β;
      s.rejse = null;
      s.rejst++;
      visUrValg();
      tegnForløb();
      return false;
    }
    return true;
  }

  function send() {
    forløbRørt();
    if (s.rejse) return;
    s.rejse = { β: s.urFart, t: ur };
    s.hjemme = s.fløjet = 0;
    visUrValg();
    tegnIgen();
    tegnForløb();
  }

  function vælgUrFart(β) {
    if (!URETS_FARTER.includes(β) || s.rejse) return;
    forløbRørt();
    s.urFart = β;
    visUrValg();
    tegnIgen();
  }

  function underRundtur() {
    under.replaceChildren();
    const valg = document.createElement('div');
    valg.className = 'ts-knapper es-valg';
    valg.setAttribute('role', 'group');
    valg.setAttribute('aria-label', 'Urets fart (en del af lysets fart)');
    for (const β of URETS_FARTER) {
      const b = document.createElement('button');
      b.className = 'hs-kapitel';
      b.dataset.fart = String(β);
      b.textContent = `${Math.round(β * 100)} %`;
      b.setAttribute('aria-label', `${Math.round(β * 100)} % af lysets fart`);
      b.addEventListener('click', () => vælgUrFart(β));
      valg.append(b);
    }
    const p = document.createElement('p');
    p.className = 'ts-småt es-linje';
    under.append(valg, p);
    ui = { valg, linje: p };
    if (s.lab) {
      const b = document.createElement('button');
      b.className = 'knap hs-igen es-send';
      b.textContent = 'Send af sted';
      b.addEventListener('click', send);
      valg.after(b);
      ui.send = b;
    }
    visUrValg();
  }
  function visUrValg() {
    if (!ui.valg || s.trin !== 'rundtur') return;
    for (const b of ui.valg.children) {
      b.setAttribute('aria-pressed', String(Number(b.dataset.fart) === s.urFart));
      b.disabled = Boolean(s.rejse);
    }
    if (ui.send) ui.send.disabled = Boolean(s.rejse);
    ui.linje.textContent = `Fart: ${Math.round(s.urFart * 100)} % af lysets. Turen varer 20 sekunder på uret hjemme.`;
  }

  // ---------- Trin 3: batteriet på vægten ----------
  function vægtMål() {
    const k = klem(Math.min(H / 235, W / 430), 0.55, 1.8);
    const cx = W * 0.54;
    const yBund = H - Math.max(10, H * 0.04);
    const yTap = Math.max(36 * k, H * 0.24); // vægtstangens drejepunkt
    const a = Math.min(W * 0.3, 170 * k); // halvdelen af vægtstangen
    const ySkål = yBund - 34 * k; // skålene hænger ned til her
    const rUr = klem(Math.min(W * 0.075, H * 0.11), 16, 40);
    return { k, cx, yBund, yTap, a, ySkål, rUr };
  }

  function tegnVægten() {
    const m = vægtMål(), k = m.k;
    const lys = s.timer > 0 ? 1 : 0;
    // Foden og søjlen
    streg(1.3 * k);
    g.fillStyle = PAPIR;
    const fod = new Path2D();
    fod.moveTo(m.cx - 44 * k, m.yBund);
    fod.lineTo(m.cx - 30 * k, m.yBund - 12 * k);
    fod.lineTo(m.cx + 30 * k, m.yBund - 12 * k);
    fod.lineTo(m.cx + 44 * k, m.yBund);
    fod.closePath();
    g.fill(fod);
    g.stroke(fod);
    skraver(fod, m.cx - 44 * k, m.yBund - 12 * k, 88 * k, 12 * k, 3 * k, 0.4 * k, 60);
    const søjle = new Path2D();
    søjle.rect(m.cx - 4 * k, m.yTap, 8 * k, m.yBund - 12 * k - m.yTap);
    g.fill(søjle);
    g.stroke(søjle);
    skraver(søjle, m.cx, m.yTap, 4 * k, m.yBund - m.yTap, 2.5 * k, 0.4 * k, 80);
    // Skalaen og viseren (står lige op: vægten bevæger sig ikke synligt)
    streg(0.8 * k);
    g.beginPath();
    g.arc(m.cx, m.yTap, 30 * k, -Math.PI / 2 - 0.45, -Math.PI / 2 + 0.45);
    g.stroke();
    for (let i = -4; i <= 4; i++) {
      const v = -Math.PI / 2 + i * 0.1;
      linje(m.cx + Math.cos(v) * 30 * k, m.yTap + Math.sin(v) * 30 * k, m.cx + Math.cos(v) * (i ? 26 : 23) * k, m.yTap + Math.sin(v) * (i ? 26 : 23) * k);
    }
    streg(1.2 * k);
    linje(m.cx, m.yTap, m.cx, m.yTap - 32 * k);
    // Vægtstangen
    streg(1.6 * k);
    linje(m.cx - m.a, m.yTap, m.cx + m.a, m.yTap);
    g.fillStyle = BLÆK;
    g.beginPath();
    g.moveTo(m.cx, m.yTap - 2 * k);
    g.lineTo(m.cx - 5 * k, m.yTap + 7 * k);
    g.lineTo(m.cx + 5 * k, m.yTap + 7 * k);
    g.closePath();
    g.fill();
    // Skålene med snore
    for (const side of [-1, 1]) {
      const x = m.cx + side * m.a;
      streg(0.7 * k);
      linje(x, m.yTap, x - 34 * k, m.ySkål);
      linje(x, m.yTap, x + 34 * k, m.ySkål);
      linje(x, m.yTap, x, m.ySkål);
      g.fillStyle = PAPIR;
      g.beginPath();
      g.ellipse(x, m.ySkål, 38 * k, 6 * k, 0, 0, Math.PI);
      g.fill();
      streg(1.2 * k);
      g.stroke();
      linje(x - 38 * k, m.ySkål, x + 38 * k, m.ySkål);
    }
    // Lodderne på højre skål
    const hx = m.cx + m.a;
    for (const [dx, h, w] of [[-14, 22, 16], [8, 16, 12]]) {
      const lod = new Path2D();
      lod.roundRect(hx + dx * k - (w / 2) * k, m.ySkål - h * k, w * k, h * k, 2 * k);
      g.fillStyle = PAPIR;
      g.fill(lod);
      streg(1 * k);
      g.stroke(lod);
      skraver(lod, hx + dx * k, m.ySkål - h * k, (w / 2) * k, h * k, 2.6 * k, 0.4 * k, 75);
      g.beginPath();
      g.arc(hx + dx * k, m.ySkål - h * k - 3 * k, 3 * k, 0, 2 * Math.PI);
      g.stroke();
    }
    // Batteriet og lampen på venstre skål
    const vx = m.cx - m.a;
    const bx = vx - 26 * k, bh = 34 * k, bw = 18 * k, by = m.ySkål - bh;
    const bat = new Path2D();
    bat.roundRect(bx - bw / 2, by, bw, bh, 2 * k);
    g.fillStyle = PAPIR;
    g.fill(bat);
    streg(1.1 * k);
    g.stroke(bat);
    // Hvor meget energi der er tilbage (skraveret), og plus-polen
    const fyld = 1 - 0.85 * s.timer;
    const ind = new Path2D();
    ind.rect(bx - bw / 2 + 3 * k, by + 3 * k + (bh - 6 * k) * (1 - fyld), bw - 6 * k, (bh - 6 * k) * fyld);
    skraver(ind, bx - bw / 2, by, bw, bh, 2.2 * k, 0.6 * k, 30);
    g.fillStyle = PAPIR;
    g.beginPath();
    g.rect(bx - 3 * k, by - 4 * k, 6 * k, 4 * k);
    g.fill();
    g.stroke();
    tekst('+', bx + bw / 2 + 5 * k, by + 4 * k, { str: 11 * k + 2 });
    // Lampen: sokkel, glaspære med glødetråd
    const lx = vx + 18 * k, ly = m.ySkål - 34 * k;
    if (lys) {
      // Lyset (gule streger, der farer ud) og varmen (bølgede blækstreger)
      const fase = rolig ? 0.5 : (ur * 0.9) % 1;
      g.save();
      lygteLys(lx, ly, k * 1.6, 1);
      streg(1.3 * k, GUL);
      for (let i = 0; i < 9; i++) {
        const v = -Math.PI + (i / 8) * Math.PI * 1.0 - 0.0;
        for (const f of [fase, (fase + 0.5) % 1]) {
          const r1 = (16 + f * 34) * k, r2 = r1 + 7 * k;
          g.globalAlpha = 1 - f;
          linje(lx + Math.cos(v) * r1, ly + Math.sin(v) * r1, lx + Math.cos(v) * r2, ly + Math.sin(v) * r2);
        }
      }
      g.globalAlpha = 0.55;
      streg(0.8 * k);
      for (const dx of [-20, 20]) {
        g.beginPath();
        for (let t = 0; t <= 1; t += 0.05) {
          const y = ly - 14 * k - t * 34 * k - fase * 10 * k;
          const x = lx + dx * k + Math.sin(t * 12 + fase * 6.28) * 3 * k;
          if (t) g.lineTo(x, y);
          else g.moveTo(x, y);
        }
        g.stroke();
      }
      g.restore();
    }
    g.fillStyle = lys ? 'rgba(255, 238, 170, 0.95)' : PAPIR;
    streg(1.1 * k);
    g.beginPath();
    g.arc(lx, ly, 10 * k, Math.PI * 0.72, Math.PI * 2.28);
    g.lineTo(lx + 4 * k, ly + 15 * k);
    g.lineTo(lx - 4 * k, ly + 15 * k);
    g.closePath();
    g.fill();
    g.stroke();
    streg(0.8 * k, lys ? GUL_MØRK : BLÆK);
    g.beginPath();
    g.moveTo(lx - 3 * k, ly + 8 * k);
    g.lineTo(lx - 3 * k, ly);
    for (let i = 0; i <= 6; i++) g.lineTo(lx - 3 * k + i * k, ly + (i % 2 ? -3 : 0) * k);
    g.lineTo(lx + 3 * k, ly + 8 * k);
    g.stroke();
    streg(1 * k);
    g.fillStyle = PAPIR;
    const sokkel = new Path2D();
    sokkel.rect(lx - 6 * k, ly + 15 * k, 12 * k, m.ySkål - ly - 15 * k);
    g.fill(sokkel);
    g.stroke(sokkel);
    // Ledningerne fra batteriet til lampen
    streg(0.8 * k);
    g.beginPath();
    g.moveTo(bx, by - 4 * k);
    g.bezierCurveTo(bx, by - 18 * k, lx - 16 * k, ly + 30 * k, lx - 6 * k, ly + 22 * k);
    g.moveTo(bx + bw / 2, by + bh * 0.8);
    g.bezierCurveTo(bx + bw, by + bh, lx - 10 * k, m.ySkål - 4 * k, lx - 6 * k, m.ySkål - 6 * k);
    g.stroke();
    // Uret, der viser timen (klokken 7 til 8, som Einsteins tog på s. 893)
    const urX = m.rUr + 10, uy = m.rUr * 1.45 + 4;
    lommeur(urX, uy, m.rUr, { timer: 7 + s.timer, minutter: s.timer * 60 });
    tekst(`${dansk(s.timer * 60)} min`, urX, uy + m.rUr + 13, { str: 12 * k + 2, kursiv: true });
    tekst('L', lx + 30 * k, ly - 24 * k, { str: 16 * k + 2, kursiv: true });
  }

  function opdaterVægten() {
    if (!s.spoler) return false;
    s.timer = rolig ? 1 : klem((ur - s.spoler) / SPOL_TID, 0, 1);
    visLettere();
    if (s.timer >= 1) {
      s.spoler = false;
      s.spolet++;
      s.slut = ur;
      tegnForløb();
      return false;
    }
    return true;
  }

  function spol() {
    forløbRørt();
    if (s.spoler) return;
    s.spoler = ur;
    s.timer = 0;
    tegnIgen();
    tegnForløb();
  }

  function underVægten() {
    under.replaceChildren();
    const mål = document.createElement('div');
    mål.className = 'ts-maal es-maal';
    mål.innerHTML = '<p class="es-lettere"></p><p class="ts-småt es-lampe"></p>';
    under.append(mål);
    ui = { lettere: mål.querySelector('.es-lettere'), lampe: mål.querySelector('.es-lampe') };
    if (s.lab) {
      const b = document.createElement('button');
      b.className = 'knap hs-igen es-spol';
      b.textContent = 'Spol en time';
      b.addEventListener('click', spol);
      under.prepend(b);
    }
    visLettere();
  }
  function visLettere() {
    if (!ui.lettere || s.trin !== 'vaegten') return;
    const gram = massetab(LAMPE_W, 3600 * s.timer) * 1000;
    ui.lettere.innerHTML = `Lettere: <b>${s.timer ? `${småGram(gram)} g` : '0 g'}</b>`;
    ui.lampe.textContent = `Lampen: ${LAMPE_W} W i ${dansk(s.timer * 60)} minutter`;
  }

  // ---------- Trin 4: uret højt oppe ----------
  function gpsMål() {
    const k = klem(Math.min(H / 250, W / 440), 0.55, 1.7);
    const yJ = H - Math.max(30, H * 0.17); // Jordens top
    const Rj = Math.max(W, H) * 6; // næsten flad (Jorden er meget større end tegningen)
    const top = Math.max(30 * k, H * 0.12);
    const xS = W * 0.5;
    const rUr = klem(Math.min(W * 0.07, H * 0.1), 15, 36);
    return { k, yJ, Rj, top, xS, rUr };
  }
  const satY = (m, h) => m.yJ - 18 * m.k - rUrPlads(m) - (m.yJ - 18 * m.k - rUrPlads(m) - m.top) * ((fAfHøjde(h) - F_MIN) / (1 - F_MIN));
  const rUrPlads = (m) => m.rUr * 1.2;

  function tegnJorden(m) {
    const k = m.k, cx = W / 2, cy = m.yJ + m.Rj;
    const sti = new Path2D();
    sti.arc(cx, cy, m.Rj, 0, 2 * Math.PI);
    g.fillStyle = PAPIR;
    g.fill(sti);
    streg(1.5 * k);
    g.stroke(sti);
    // Skravering langs kanten og et par breddegrader
    g.save();
    g.clip(sti);
    g.globalAlpha = 0.45;
    streg(0.5 * k);
    for (let i = 1; i <= 4; i++) {
      g.beginPath();
      g.ellipse(cx, cy, m.Rj * (1 - i * 0.004), m.Rj - i * 9 * k, 0, Math.PI, 2 * Math.PI);
      g.stroke();
    }
    g.restore();
    skraver(sti, 0, m.yJ, W, H - m.yJ, 5 * k, 0.4 * k, 60);
  }

  function tegnSatellit(x, y, k) {
    // Kroppen med skravering, to solpaneler med gitter og en antenne
    const krop = new Path2D();
    krop.rect(x - 9 * k, y - 8 * k, 18 * k, 16 * k);
    g.fillStyle = PAPIR;
    g.fill(krop);
    streg(1.1 * k);
    g.stroke(krop);
    skraver(krop, x - 9 * k, y - 8 * k, 18 * k, 16 * k, 2.6 * k, 0.4 * k, 45);
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? x - 46 * k : x + 14 * k;
      streg(0.8 * k);
      linje(x + side * 9 * k, y, x + side * 14 * k, y);
      g.fillStyle = PAPIR;
      g.beginPath();
      g.rect(x0, y - 7 * k, 32 * k, 14 * k);
      g.fill();
      streg(1 * k);
      g.stroke();
      streg(0.45 * k);
      for (let i = 1; i < 4; i++) linje(x0 + i * 8 * k, y - 7 * k, x0 + i * 8 * k, y + 7 * k);
      linje(x0, y, x0 + 32 * k, y);
    }
    streg(0.9 * k);
    linje(x, y + 8 * k, x, y + 13 * k);
    g.beginPath();
    g.arc(x, y + 17 * k, 5 * k, Math.PI * 1.15, Math.PI * 1.85);
    g.stroke();
  }

  function tegnGPS() {
    const m = gpsMål(), k = m.k;
    const h = s.visHøjde;
    const y = satY(m, h);
    const t = gpsTal(h);
    // Banen (stiplet) i satellittens højde, koncentrisk med Jorden
    const cx = W / 2, cy = m.yJ + m.Rj;
    g.save();
    g.setLineDash([4 * k, 6 * k]);
    streg(0.8 * k);
    g.globalAlpha = 0.6;
    g.beginPath();
    g.arc(cx, cy, cy - y, Math.PI * 1.2, Math.PI * 1.8);
    g.stroke();
    g.restore();
    tegnJorden(m);
    // Højdeskalaen til venstre med rumstationen og GPS
    const sx = Math.max(16, W * 0.06);
    streg(0.9 * k);
    linje(sx, m.yJ - 4 * k, sx, m.top);
    for (const [hh, navn] of [[RUMSTATIONEN, 'Rumstationen'], [3200, ''], [GPS_HØJDE, 'GPS']]) {
      const yy = satY(m, hh);
      linje(sx - 4 * k, yy, sx + 4 * k, yy);
      if (navn && !s.uden) tekst(`${navn}, ${dansk(hh)} km`, sx + 8 * k, yy, { str: Math.max(12, 11 * k), kursiv: true, align: 'left' });
    }
    // Uret på jorden (til højre, så det ikke støder ind i satellitten, når den er lavt nede)
    const xJ = W - m.rUr - 14;
    const yUJ = m.yJ - m.rUr - 6 * k + (W / 2 - xJ) ** 2 / (2 * m.Rj);
    lommeur(xJ, yUJ, m.rUr, { timer: 7, minutter: 0 });
    tekst('på jorden', xJ, yUJ - m.rUr * 1.5 - 8, { str: 12 * k + 2, kursiv: true, align: 'right' });
    // Satellitten med fartstreger (lavere er hurtigere) og sit ur
    const fart = Math.sqrt(3.986004418e14 / ((6371 + h) * 1000)) / 7800; // 1 ved ca. 7,8 km/s
    g.save();
    g.globalAlpha = 0.55;
    streg(0.8 * k);
    for (const d of [-5, 0, 5]) linje(m.xS - 52 * k, y + d * k, m.xS - 52 * k - 44 * k * fart, y + d * k);
    g.restore();
    tegnSatellit(m.xS, y, k);
    const ux = m.xS + 62 * k + m.rUr;
    lommeur(Math.min(ux, W - m.rUr - 6), y, m.rUr, { timer: 7, minutter: 0 });
    // Tallet ved satellitten: + foran, − bagud (gult, når det er foran)
    tekst(`${t.iAlt > 0 ? '+' : ''}${dansk(t.iAlt)} µs`, Math.min(ux, W - m.rUr - 6), y + m.rUr + 13 * k, { str: 13 * k + 2, kursiv: true, vægt: 'bold', farve: t.iAlt > 0 ? GUL_MØRK : BLÆK });
    // Kortet uden rettelse: GPS'ens prik glider ca. 10 km væk på et døgn
    if (s.uden) tegnKort(m);
  }

  function tegnKort(m) {
    const k = m.k;
    const w = klem(W * 0.32, 120, 220);
    const x0 = klem(m.xS - w / 2, 8, W - w - 8), y0 = satY(m, GPS_HØJDE) + 22 * k + m.rUr;
    const h = Math.min(w * 0.62, m.yJ - 12 - y0);
    if (h < 50) return;
    g.fillStyle = PAPIR;
    g.beginPath();
    g.rect(x0, y0, w, h);
    g.fill();
    streg(1.2);
    g.stroke();
    // Gaderne
    g.save();
    g.beginPath();
    g.rect(x0, y0, w, h);
    g.clip();
    streg(0.6);
    g.globalAlpha = 0.6;
    for (let i = 1; i < 8; i++) linje(x0 + (i * w) / 8 + (i % 2) * 4, y0, x0 + (i * w) / 8 - 6, y0 + h);
    for (let i = 1; i < 5; i++) linje(x0, y0 + (i * h) / 5, x0 + w, y0 + (i * h) / 5 - 5);
    g.restore();
    // Målestokken: 10 km er 0,6 af kortets bredde
    const km = (w * 0.6) / 10;
    const ud = rolig ? 1 : klem((ur - s.udenT) / 2.5, 0, 1);
    const fejl = gpsFejlKm() * ud;
    const px = x0 + w * 0.18, py = y0 + h * 0.55;
    g.fillStyle = BLÆK;
    g.beginPath();
    g.arc(px, py, 3.5, 0, 2 * Math.PI);
    g.fill();
    tekst('du', px, py + 11, { str: 11, kursiv: true });
    glimt(px + fejl * km, py - fejl * km * 0.15, 0.6, 1, 1);
    streg(0.9);
    linje(x0 + 8, y0 + h - 9, x0 + 8 + 10 * km, y0 + h - 9);
    tekst('10 km', x0 + 8 + 5 * km, y0 + h - 18, { str: 11, kursiv: true });
    tekst(ud >= 1 ? 'efter et døgn uden rettelse' : 'uden rettelse …', x0 + w / 2, y0 + 11, { str: 11, kursiv: true });
  }

  function opdaterGPS(dt) {
    let mere = false;
    const k = rolig ? 1 : 1 - Math.exp(-dt * 5);
    const fh = fAfHøjde(s.visHøjde) + (fAfHøjde(s.højde) - fAfHøjde(s.visHøjde)) * k;
    s.visHøjde = Math.abs(fAfHøjde(s.højde) - fh) < 0.002 ? s.højde : højdeAfF(fh);
    if (s.visHøjde !== s.højde) mere = true;
    if (s.uden && !rolig && ur - s.udenT < 2.6) mere = true;
    visGPS();
    return mere;
  }

  function sætHøjde(h, { fra = 'skyder' } = {}) {
    forløbRørt();
    s.højde = klem(Math.round(h / 100) * 100, RUMSTATIONEN, GPS_HØJDE);
    if (s.højde >= GPS_HØJDE - 300) s.højde = GPS_HØJDE; // det sidste stykke tæller som helt oppe
    s.rørtHøjde = true;
    if (s.højde < GPS_HØJDE) s.uden = false;
    if (fra !== 'skyder' && ui.skyder) ui.skyder.value = String(Math.round(((fAfHøjde(s.højde) - F_MIN) / (1 - F_MIN)) * 1000));
    tegnIgen();
  }

  function udenRettelse() {
    forløbRørt();
    if (s.højde < GPS_HØJDE) return;
    s.uden = !s.uden;
    s.udenT = ur;
    visGPS();
    tegnIgen();
  }

  function underGPS() {
    under.replaceChildren();
    const nat = document.createElement('label');
    nat.className = 'hs-nat es-hoejde';
    nat.innerHTML = '<span class="es-hoejde-tekst"></span><input type="range" min="0" max="1000" step="1" aria-label="Satellittens højde">';
    const skyder = nat.querySelector('input');
    skyder.value = String(Math.round(((fAfHøjde(s.højde) - F_MIN) / (1 - F_MIN)) * 1000));
    skyder.addEventListener('input', () => sætHøjde(højdeAfF(F_MIN + (Number(skyder.value) / 1000) * (1 - F_MIN))));
    skyder.addEventListener('change', () => { if (s.højde < GPS_HØJDE) vink(fl?.vink?.gps); });
    const mål = document.createElement('div');
    mål.className = 'ts-maal es-maal';
    mål.innerHTML = '<p class="es-gps"></p><p class="ts-småt es-dele"></p>';
    const uden = document.createElement('button');
    uden.className = 'hs-kapitel es-uden';
    uden.addEventListener('click', udenRettelse);
    under.append(nat, mål, uden);
    ui = { skyder, højde: nat.querySelector('.es-hoejde-tekst'), gps: mål.querySelector('.es-gps'), dele: mål.querySelector('.es-dele'), uden };
    visGPS();
  }
  function visGPS() {
    if (!ui.gps || s.trin !== 'gps') return;
    const t = gpsTal(s.visHøjde);
    const navn = s.visHøjde <= RUMSTATIONEN ? ' (rumstationen)' : s.visHøjde >= GPS_HØJDE ? ' (GPS)' : '';
    const ny = `Højde: ${dansk(Math.round(s.visHøjde / 100) * 100)} km${navn}`;
    if (ui.højde.textContent !== ny) ui.højde.textContent = ny;
    const hvem = t.iAlt > 0 ? `<b>${dansk(t.iAlt)}</b> milliontedele sekund <b>foran</b>` : t.iAlt < 0 ? `<b>${dansk(-t.iAlt)}</b> milliontedele sekund <b>bagud</b>` : '<b>lige</b> med uret på jorden';
    const gps = `Satellittens ur er ${hvem} efter et døgn`;
    if (ui.gps.innerHTML !== gps) ui.gps.innerHTML = gps;
    ui.dele.textContent = `Højden: +${dansk(t.højde)}. Farten: −${dansk(t.fart)} (milliontedele sekund pr. døgn)`;
    ui.uden.hidden = s.højde < GPS_HØJDE;
    ui.uden.textContent = s.uden ? 'Med rettelse' : 'Uden rettelse';
    ui.uden.setAttribute('aria-pressed', String(s.uden));
  }

  // Træk satellitten op og ned i lærredet
  function ned(h) {
    if (s.trin !== 'gps' || træk) return;
    træk = { id: h.pointerId };
    lærred.setPointerCapture?.(h.pointerId);
    flyt(h);
  }
  function flyt(h) {
    if (!træk || h.pointerId !== træk.id) return;
    const r = lærred.getBoundingClientRect();
    const m = gpsMål();
    const y = h.clientY - r.top;
    const bund = satY(m, RUMSTATIONEN), top = satY(m, GPS_HØJDE);
    const f = F_MIN + klem((bund - y) / Math.max(1, bund - top), 0, 1) * (1 - F_MIN);
    sætHøjde(højdeAfF(f), { fra: 'træk' });
  }
  function op(h) {
    if (!træk || h.pointerId !== træk.id) return;
    træk = null;
    if (s.højde < GPS_HØJDE) vink(fl?.vink?.gps);
  }
  const afbryd = () => { træk = null; };
  lærred.addEventListener('pointerdown', ned);
  lærred.addEventListener('pointermove', flyt);
  lærred.addEventListener('pointerup', op);
  lærred.addEventListener('pointercancel', afbryd);

  // ---------- Tegningen ----------
  function billede(nu) {
    ramme1 = 0;
    if (!aktiv) return;
    const dt = sidst ? Math.min(0.25, (nu - sidst) / 1000) : 0; // højst ¼ s ad gangen (følger uret, også når der tegnes langsomt)
    sidst = nu;
    ur += dt;
    let mere = false;
    if (s.trin === 'toget') { opdaterToget(dt); mere = !rolig || s.venter; }
    else if (s.trin === 'rundtur') mere = opdaterRundtur();
    else if (s.trin === 'vaegten') mere = opdaterVægten() || (!rolig && s.timer > 0 && ur - s.slut < 8); // lyset farer ud lidt endnu
    else mere = opdaterGPS(dt);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    if (s.trin === 'toget') tegnToget();
    else if (s.trin === 'rundtur') tegnRundtur();
    else if (s.trin === 'vaegten') tegnVægten();
    else tegnGPS();
    lærred.setAttribute('aria-label', beskrivelse());
    if (mere) ramme1 = requestAnimationFrame(billede);
    else sidst = 0;
  }

  // Det, en skærmlæser får at vide om tegningen
  function beskrivelse() {
    if (s.trin === 'toget') return s.mål ? 'Et tog på et spor ved en perron. De to lysglimt fra togets lygte og perronens lygte ramte målstregen samtidig.' : 'Et tog kører forbi en perron med gaslygter. Til højre er en målstreg.';
    if (s.trin === 'rundtur') return `To lommeure på en perron. Uret hjemme viser ${dansk(s.hjemme, 1)} sekunder, og uret, der fløj, viser ${dansk(s.fløjet, 1)} sekunder.`;
    if (s.trin === 'vaegten') return 'En skålvægt med et batteri og en lampe på den ene skål og lodder på den anden. Vægten står lige.';
    return `Jorden forneden med et ur og en satellit med et ur i ${dansk(Math.round(s.visHøjde / 100) * 100)} km's højde.`;
  }

  // ---------- Trinene ----------
  function sætTrin(trin) {
    rydTimere();
    s.trin = trin;
    s.lab = null;
    træk = null;
    felt.dataset.esTrin = trin; // style.css: på en lav skærm står tallene under tegningen i de tre første trin
    ui = {};
    under.replaceChildren();
    tegnIgen();
  }
  const start = {
    toget() {
      sætTrin('toget');
      Object.assign(s, { togFart: 'tog', togX: 0.04, togAlfa: 1, nyTur: 0, venter: false, glimt: null, mål: false, affyret: 0, tændt: null });
      røg = [];
      underToget();
    },
    rundtur() {
      sætTrin('rundtur');
      Object.assign(s, { urFart: 0.87, rejse: null, hjemme: 0, fløjet: 0, rejst: 0 });
      underRundtur();
    },
    vaegten() {
      sætTrin('vaegten');
      Object.assign(s, { timer: 0, spoler: false, spolet: 0 });
      underVægten();
    },
    gps() {
      sætTrin('gps');
      Object.assign(s, { højde: RUMSTATIONEN, visHøjde: RUMSTATIONEN, rørtHøjde: false, uden: false });
      underGPS();
    },
  };

  function sætKapitel(t) {
    if (kapitel) kapitel.textContent = t ?? titel;
  }

  function forløbDel(data) {
    fl = data;
    const trin = {
      toget: {
        start: () => start.toget(),
        knapper: [{ id: 'taend', tekst: 'Tænd begge', gør: tænd }],
        færdig: () => s.mål,
        visMig: () => { if (!s.mål) tænd(); },
      },
      rundtur: {
        start: () => start.rundtur(),
        knapper: [{ id: 'send', tekst: 'Send af sted', gør: send, aktiv: () => !s.rejse }],
        færdig: () => s.rejst > 0 && !s.rejse,
        visMig: () => { if (!s.rejse) send(); },
      },
      vaegten: {
        start: () => start.vaegten(),
        knapper: [{ id: 'spol', tekst: 'Spol en time', gør: spol, aktiv: () => !s.spoler }],
        færdig: () => s.spolet > 0 && !s.spoler,
        visMig: () => { if (!s.spoler) spol(); },
      },
      gps: {
        start: () => start.gps(),
        færdig: () => s.højde >= GPS_HØJDE && Math.abs(s.visHøjde - s.højde) < 50,
        visMig: () => sætHøjde(GPS_HØJDE, { fra: 'vis' }),
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
  function fri(kap = 'rundtur') {
    sætKapitel(titel);
    if (!start[kap]) kap = 'rundtur';
    start[kap]();
    s.lab = kap;
    // Kapitlets egne knapper (i turen står de i forløbets linje)
    if (kap === 'toget') {
      underToget();
      const b = document.createElement('button');
      b.className = 'knap hs-igen es-taend';
      b.textContent = 'Tænd begge';
      b.addEventListener('click', tænd);
      ui.valg.after(b);
    } else if (kap === 'rundtur') underRundtur();
    else if (kap === 'vaegten') underVægten();
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
      tilstand: () => ({
        trin: s.trin, lab: s.lab,
        togFart: s.togFart, togX: s.togX, togAlfa: s.togAlfa, venter: s.venter, glimt: Boolean(s.glimt), mål: s.mål, affyret: s.affyret, lygter: togMål().lygter.length,
        urFart: s.urFart, rejser: Boolean(s.rejse), hjemme: s.hjemme, fløjet: s.fløjet, rejst: s.rejst,
        timer: s.timer, spolet: s.spolet, lettere: massetab(LAMPE_W, 3600 * s.timer) * 1000,
        højde: s.højde, visHøjde: s.visHøjde, gps: gpsTal(s.visHøjde), uden: s.uden,
        valg: [...under.querySelectorAll('.es-valg button')].filter((b) => !b.closest('[hidden]')).map((b) => b.textContent),
        tekst: under.textContent,
      }),
      tænd,
      togFart: vælgTogFart,
      send,
      urFart: vælgUrFart,
      spol,
      højde: (h) => sætHøjde(h, { fra: 'test' }),
      uden: udenRettelse,
      lab: (kap) => fri(kap),
      lysKmt: () => LYSETS_FART_KMT,
      gpsUr: (h) => gpsUr(h),
    },
  };
}
