// "Hvorfor går tiden langsommere?" (T5, drejebogen er docs/plan-tid-t5.md, faktagrundlaget
// docs/fakta-tid/hvorfor-langsommere.md, skitsen docs/skitser/tid-t5.html). Fem små scener, der går frem med "Næste" i
// bjælken (fænomenets trin()): 1 bolden og lyset, 2 lysuret med trekanten, 3 myonernes kapløb, 4 "nu" er ikke det
// samme for alle og 5 rumtidskortet. T5a har scene 1 og 2. Scene 3-5 siger "kommer snart", til T5b og T5c bygger dem.
//
// Hovedsagen er et 2D-lærred i overlaget (som lysuret i Rejsen i tid) over en rolig stjernehimmel. Lærredet får den
// højde, der er plads til mellem Styr-boksen og underteksten med bjælken (størrelse()), så det aldrig dækker dem.
// Teksten, der altid er fremme, står som fasens undertekst, og kontakterne og skyderne står i Styr-boksen og skifter
// med scenen. Siden bygges én gang (ét emne pr. scene). Lysurets tegning er delt med tid.js (lysur.js).
import { gå } from '../sideknap.js';
import * as T from '../data/tid.js';
import * as Lys from './lysur.js';

const MAKS_BREDDE = 760; // lærredets største bredde i pixel
const BRED2 = 520; // scene 2: lysurene ved siden af hinanden fra denne bredde, ellers over hinanden (telefon på højkant)
const FARVE = { ...Lys.FARVE, tog: '#33456f', bold: '#ff9f43' };
const fmt = (x, d = 0) => x.toLocaleString('da-DK', { minimumFractionDigits: d, maximumFractionDigits: d });
const { læggesSammen } = T; // farter lægges sammen med Einsteins formel (js/data/tid.js)

// Den højeste scene, man har set (0-4). Huskes kun, mens AtomLab er åben (intet i localStorage): Første gang går man
// frem med "Næste", og bagefter kan man trykke sig til de scener, man har set (alle, når man har været igennem).
let højesteSet = 0;

// ---------- Scene 1: bolden og lyset ----------
const FARTER1 = [
  { navn: '100 km/t', b: 0 },
  { navn: '50 % af lysets fart', b: 0.5 },
  { navn: '90 % af lysets fart', b: 0.9 },
];
const BOLD_TEKST = 'Toget kører 100 km/t, og bolden kastes 50 km/t fremad. Set fra perronen flyver bolden 150 km/t. Farterne lægges sammen.';
const LYS_TEKST = 'Med lyset sker der noget mærkeligt: Det har lysets fart set fra toget og præcis den samme fart set fra perronen. Togets fart lægges ikke til.';
// Bolden ved store farter: 80 % ved 50 % og 96,6 % ved 90 %
const boldProcent = (fart) => fmt(læggesSammen(0.5, FARTER1[fart].b) * 100, fart === 2 ? 1 : 0);

// ---------- Scene 2: lysuret med trekanten ----------
const LIGE_TEKST = 'Set fra Jorden går lyset i uret en længere, skrå vej. Lyset kan ikke køre hurtigere, så hvert tik tager længere tid. Uret går langsommere.';
const erTo = (gam) => Math.abs(gam - 2) < 1e-9;
const gangeTekst = (gam) => fmt(gam, erTo(gam) ? 0 : 1);

// Scenerne: navn (bjælken og prikkerne), titel (underteksten) og spørgsmålet (Lige nu). klar: bygget (T5a: 1 og 2).
const SCENER = [
  { navn: 'Bolden og lyset', titel: 'Den mærkelige regel', spm: 'Hvorfor skulle tiden overhovedet kunne gå forskelligt?', klar: true,
    overgang: 'Når lyset ikke kan køre hurtigere, må noget andet give efter. Hvad? Næste: Lysuret.' },
  { navn: 'Lysuret', titel: 'Lysuret: tiden giver efter', spm: 'Hvad giver efter, når lysets fart ikke gør?', klar: true,
    overgang: 'Er det bare en tanke, eller kan man måle det? Næste: Myonernes kapløb.' },
  { navn: 'Myonerne', titel: 'Myonernes kapløb', spm: 'Er det målt, eller er det bare en tanke?' },
  { navn: '"Nu"', titel: '"Nu" er ikke det samme for alle', spm: 'Hvordan kan begge se den andens ur gå langsomt?' },
  { navn: 'Rumtidskortet', titel: 'Rumtidskortet: Hvem bliver yngst?', spm: 'Hvorfor er det den rejsende, der bliver yngst, og ikke den, der bliver hjemme?' },
];

export default {
  id: 'tidhvorfor',
  navn: 'Hvorfor går tiden langsommere?',
  ikon: '🔦',
  undertitel: 'Lysets mærkelige regel',
  kamera: { retning: [0, 0.15, 1], radius: 30, drej: false },
  tal: [
    ['Lysets fart', 'ca. 300.000 km i sekundet'],
    ['Lysets fart er', 'den samme for alle'],
    ['Et ur ved 87 % af lysets fart', 'går halvt så hurtigt set fra Jorden'],
    ['Teorien', 'Einstein, 1905'],
  ],
  // Siden bygges én gang og skifter ikke med scenen: ét emne pr. scene (scenens titel og dens "Hvorfor?"), og For
  // nørder og Ærligt talt med ét afsnit pr. scene. Teksterne er fra drejebogen (faktatjekket i T5 Trin 0, afsnit 15
  // i docs/fakta-tid/hvorfor-langsommere.md). T5b og T5c sætter scene 3-5 ind.
  side: {
    kort: 'Hvorfor går et ur langsommere, når det farer af sted? Fem små scener viser det trin for trin, fra lysets mærkelige regel til tvillingen, der kommer yngst hjem.',
    emner: [
      {
        titel: 'Den mærkelige regel',
        tekst: `<p>Lysets fart er ca. 300.000 km i sekundet (ca. 1 milliard km/t). Den er den samme for alle, uanset hvor hurtigt de selv bevæger sig. Det er målt igen og igen. I 1887 ledte Michelson og Morley efter en forskel: Jorden farer om Solen med 30 km i sekundet, så lyset burde gå en anelse hurtigere den ene vej end den anden. De fandt ingen forskel.</p>
          <p>Men hvordan kan det passe? Hvis toget og perronen måler den samme fart for det samme lys, selv om toget kører efter lyset, så må noget andet være anderledes for dem. Fart er jo vej delt med tid. Det, der giver efter, er tiden (og afstanden).</p>`,
      },
      {
        titel: 'Lysuret: tiden giver efter',
        tekst: `<p>Tegn et halvt tik som en trekant: den lige vej op (1), det stykke, spejlene flytter sig, mens lyset er undervejs (1,73), og den skrå vej, lyset går (2). Pythagoras siger 1² + 1,73² = 2², altså 1 + 3 = 4. Den skrå vej er 2 gange så lang, og lyset har den samme fart, så det tager 2 gange så lang tid.</p>
          <p>Om bord mærker du intet. Dit eget ur, dit hjerte og dine tanker går helt normalt for dig. Først når man sammenligner med urene på Jorden, viser forskellen sig.</p>`,
      },
    ],
    videre: [gå('kosmos:tid', '⏳ Rejsen i tid'), gå('kosmos:rumtid', 'Rumtid')],
    nørd: `
      <p><b>Den mærkelige regel:</b> Einstein fortalte selv mange år senere, at han som 16-årig forestillede sig at løbe efter en lysstråle med lysets fart. Så burde lyset se ud, som om det stod stille. Men sådan noget lys findes ikke. I 1905 byggede han relativitetsteorien på to regler: Fysikkens love er de samme for alle, der bevæger sig jævnt, og lysets fart er den samme, uanset hvor hurtigt lampen bevæger sig.</p>
      <p>Farter lægges i virkeligheden sammen med w = (u + v)/(1 + u·v/c²). Bolden flyver derfor ikke præcis 150 km/t. Den mangler ca. 6 · 10⁻¹³ km/t, under en milliontedel millimeter i timen. Ved store farter kan man se det: Kører toget 50 % af lysets fart og kaster bolden 50 % fremad, flyver bolden 80 %, ikke 100 %. Og med lyset (u = c) giver formlen altid c.</p>
      <p><b>Lysuret:</b> Kald tiden for et tik set fra Jorden for t. På et halvt tik går lyset c·t/2 på skrå, mens spejlene flytter sig v·t/2. Højden er L. Pythagoras: (c·t/2)² = L² + (v·t/2)². Løs for t: t = (2L/c) · 1/√(1 − v²/c²). Det sidste stykke er γ (gamma), tidsforlængelsen. Ved 50 % er γ = 1,15, ved 87 % 2, ved 95 % 3,2 og ved 99 % 7,1.</p>
      <p>Hvorfor skal alt følge med? Hvis dit hjerte fulgte lysuret, men dit armbåndsur ikke gjorde, kunne du se på urene, at skibet bevæger sig. Men regel 1 siger, at fysikken er den samme for alle, der bevæger sig jævnt. Så alt følger med.</p>`,
    ærligt: `<p><b>Den mærkelige regel:</b> Et tog kan ikke køre med en mærkbar del af lysets fart, og lyset er tegnet meget langsommere, end det er. Men det har den samme fart i begge billeder. Billederne viser, hvad man ville måle, ikke hvad øjet ser (lyset skal også nå frem til øjet).</p>
      <p><b>Lysuret:</b> Lysuret er et tankeeksperiment, som står i de fleste lærebøger. Man kan ikke se lysglimtet undervejs. Animationen viser, hvad man ville regne sig frem til. "87 %" er 86,6 %, hvor γ er præcis 2. Lysuret trin for trin står også i Rejsen i tid.</p>`,
  },

  lav(gruppe, { fase, forklaring, overlag, opdaterKnapper, sætKontakt }) {
    // ---------- Lærredet i overlaget ----------
    const holder = document.createElement('div');
    holder.className = 'tidh';
    const lærred = document.createElement('canvas');
    lærred.setAttribute('role', 'img');
    holder.append(lærred);
    const lag = overlag();
    lag.append(holder);
    const vindue = lag.closest('.vindue');
    const bund = lag.parentElement; // .vindue-bund: overlaget, underteksten og bjælken
    let W = 600, H = 300; // lærredets størrelse i CSS-pixel

    let aktiv = 0; // scenen (0-4)
    const sc1 = { bold: true, fart: 0, t: 0 }; // scene 1: bolden eller lygten, togets fart og tiden i kastet
    const sc2 = { fart: T.LYSUR_START, trekant: false, ur: Lys.nytUr(), sidst: null }; // scene 2 (sidst: trekanten)

    const lille = () => W < 520;
    const skrift = () => (lille() ? 12 : 14);
    let g = null;
    const tekst = (s, x, y, o = {}) => Lys.tekst(g, s, x, y, { farve: FARVE.tekst, str: skrift(), ...o });
    function panel(x, y, w, h, titel, aktivt = false) {
      Lys.boks(g, x, y, w, h, { aktiv: aktivt, klip: false, r: 12 });
      if (titel) tekst(titel, x + 12, y + skrift() + 7, { side: 'left', farve: FARVE.svag });
    }
    function pil(x1, y, x2, farve, label) {
      const ret = Math.sign(x2 - x1) || 1;
      g.strokeStyle = farve;
      g.fillStyle = farve;
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x1, y);
      g.lineTo(x2 - ret * 6, y);
      g.stroke();
      g.beginPath();
      g.moveTo(x2, y);
      g.lineTo(x2 - ret * 8, y - 5);
      g.lineTo(x2 - ret * 8, y + 5);
      g.closePath();
      g.fill();
      if (label) tekst(label, (x1 + x2) / 2, y - 7, { farve, str: skrift() - 1 });
    }

    // ---------- Scene 1: bolden og lyset (to billeder over hinanden) ----------
    const hoejde1 = () => 2 * Math.max(132, Math.min(170, W * 0.26)) + 10;
    function tegn1() {
      const ph = (H - 10) / 2, t = sc1.t, lys = !sc1.bold;
      const b = FARTER1[sc1.fart].b, hverdag = sc1.fart === 0;
      // Skærmens skala: ved 100 km/t med bolden i km/t, ellers med lysets fart (den samme i begge billeder)
      const C = 0.22 * W; // lysets fart på skærmen (pixel pr. sekund)
      const gam = hverdag ? 1 : T.lysurGamma(b);
      let vS, uS, wS; // togets, boldens (set fra toget) og boldens fart set fra perronen
      if (hverdag && !lys) { const k = 0.0012 * W; vS = 100 * k; uS = 50 * k; wS = 150 * k; }
      else if (hverdag) { vS = 0; uS = C; wS = C; }
      else { vS = b * C; uS = lys ? C : 0.5 * C; wS = lys ? C : læggesSammen(0.5, b) * C; }
      const Ltog = 0.3 * W, P = 0.12 * W; // togets længde og afstanden mellem pælene, når de står stille
      const h1 = Math.min(40, ph * 0.3);
      const tegnTog = (x0, y, L) => {
        g.fillStyle = FARVE.tog;
        g.strokeStyle = 'rgba(160,190,255,0.5)';
        g.lineWidth = 1;
        g.beginPath();
        g.roundRect(x0, y - h1, L, h1, [4, Math.min(16, L * 0.25), 4, 4]);
        g.fill();
        g.stroke();
        const n = Math.max(2, Math.round(L / 34));
        g.fillStyle = 'rgba(190,220,255,0.35)';
        for (let i = 0; i < n; i++) g.fillRect(x0 + 6 + i * ((L - 18) / n), y - h1 + 6, Math.max(4, (L - 18) / n - 6), h1 * 0.38);
        g.fillStyle = '#ffd9a8'; // kasteren i det forreste vindue
        g.beginPath();
        g.arc(x0 + L - 12, y - h1 + 12, 4, 0, Math.PI * 2);
        g.fill();
      };
      const ting = (x, y) => {
        if (lys) Lys.glimt(g, x, y, 5);
        else {
          g.fillStyle = FARVE.bold;
          g.beginPath();
          g.arc(x, y, 5.5, 0, Math.PI * 2);
          g.fill();
        }
      };
      const pælene = (y0, forskydning, afstand) => {
        g.strokeStyle = 'rgba(150,170,220,0.35)';
        g.lineWidth = 2;
        const start = ((forskydning % afstand) + afstand) % afstand;
        for (let x = start - afstand; x < W + afstand; x += afstand) {
          g.beginPath();
          g.moveTo(x, y0);
          g.lineTo(x, y0 - 22);
          g.stroke();
        }
        g.strokeStyle = 'rgba(150,170,220,0.5)';
        g.beginPath();
        g.moveTo(0, y0 + 0.5);
        g.lineTo(W, y0 + 0.5);
        g.stroke();
      };
      const boldTog = hverdag ? '50 km/t' : '50 % af lysets fart';
      const boldPerron = hverdag ? '150 km/t' : `${boldProcent(sc1.fart)} % af lysets fart`;
      const togNavn = hverdag ? '100 km/t' : FARTER1[sc1.fart].navn;
      // Hjørneteksten skjules, når billedet er lavt (telefon på langs), så den ikke rammer pilens tekst
      const hjørne = (s) => { if (ph >= 120) tekst(s, W - 12, skrift() + 7, { side: 'right', farve: FARVE.svag, str: skrift() - 1, vægt: 500 }); };
      const pilFarve = lys ? FARVE.skrå : FARVE.bold;

      // Øverst: set fra toget (toget står stille, og perronen glider baglæns med pælene γ gange tættere)
      g.save();
      panel(0, 0, W, ph, 'Set fra toget');
      const y1 = ph - 26, xa = 0.04 * W;
      pælene(y1 + 4, -vS * t, P / gam);
      tegnTog(xa, y1, Ltog);
      const xo1 = xa + Ltog + uS * t;
      if (xo1 < W + 10) ting(xo1, y1 - h1 * 0.55);
      pil(xa + Ltog + 4, y1 - h1 - 16, xa + Ltog + 4 + Math.max(36, Math.min(0.25 * W, uS * 0.9)), pilFarve, lys ? 'lyset: lysets fart' : `bolden: ${boldTog}`);
      if (vS > 0) hjørne(`← perronen: ${togNavn}`);
      else if (lys) hjørne('toget står næsten stille i forhold til lyset');
      g.restore();

      // Nederst: set fra perronen (toget kører, og det er γ gange kortere ved høj fart)
      g.save();
      g.translate(0, ph + 10);
      panel(0, 0, W, ph, 'Set fra perronen');
      const y2 = ph - 26;
      pælene(y2 + 4, 0, P);
      const L2 = Ltog / gam, xr = 0.04 * W + vS * t;
      tegnTog(xr, y2, L2);
      const xo2 = 0.04 * W + L2 + wS * t; // tingen starter ved forenden (ved t = 0)
      if (xo2 < W + 10) ting(xo2, y2 - h1 * 0.55);
      pil(xr + L2 + 4, y2 - h1 - 16, xr + L2 + 4 + Math.max(36, Math.min(0.3 * W, wS * 0.9)), pilFarve, lys ? (b > 0 ? 'lyset: lysets fart (ikke mere!)' : 'lyset: lysets fart') : `bolden: ${boldPerron}`);
      if (vS > 0) hjørne(`toget: ${togNavn} →`);
      g.restore();
    }

    // ---------- Scene 2: lysuret (ved siden af hinanden på brede skærme, over hinanden under 560 px) ----------
    const hoejde2 = () => (W >= BRED2 ? Math.max(250, Math.min(330, W * 0.4)) : 2 * (Math.min(130, W * 0.32) + 62) + 10);
    function geo2() {
      const bred = W >= BRED2, sk = skrift(), top = sk + 22;
      const sw = Math.min(40, (bred ? (W - 10) * 0.32 : W) * 0.18);
      if (bred) {
        const ws = (W - 10) * 0.32, we = W - 10 - ws;
        const L = Math.max(40, Math.min(H - top - sk - 22, we * 0.42));
        return { bred, ws, we, hs: H, hE: H, L, top, sw, xE: ws + 10, yE: 0, xs0: sw / 2 + 14, c: (2 * L) / Lys.LYS_TIK };
      }
      const L = Math.max(40, Math.min(130, W * 0.32, (H - 10) / 2 - 62));
      const hs = (H - 10) / 2;
      return { bred, ws: W, we: W, hs, hE: hs, L, top: top + Math.max(0, (hs - L - 62) / 2), sw, xE: 0, yE: hs + 10, xs0: sw / 2 + 14, c: (2 * L) / Lys.LYS_TIK };
    }
    function tegn2() {
      const G = geo2(), v = T.LYSUR_FARTER[sc2.fart], gam = T.lysurGamma(v), ur = sc2.ur;
      const tri = ur.stille && v > 0;
      const tikTekst = (n) => `Tik: ${T.tal(Math.floor(n + 1e-9))}`;
      // I skibet
      g.save();
      panel(0, 0, G.ws, G.hs, lille() ? 'I skibet' : 'Set i skibet');
      g.beginPath();
      g.roundRect(0, 0, G.ws, G.hs, 12);
      g.clip();
      Lys.tegnSkibUr(g, ur, { x: G.ws / 2, top: G.top, L: G.L, sw: G.sw, lige: tri });
      tekst(tri ? 'lige vej: 1' : tikTekst(ur.skib), G.ws / 2, G.hs - 10, { farve: tri ? FARVE.lige : FARVE.tik, vægt: 700 });
      g.restore();
      // Set fra Jorden
      g.save();
      g.translate(G.xE, G.yE);
      panel(0, 0, G.we, G.hE, v > 0 ? 'Set fra Jorden: skibet farer forbi →' : 'Set fra Jorden: skibet står stille');
      g.beginPath();
      g.roundRect(0, 0, G.we, G.hE, 12);
      g.clip();
      if (tri) {
        sc2.sidst = Lys.tegnTrekant(g, { v, top: G.top, L: G.L, sw: G.sw, we: G.we, hE: G.hE, skrift: skrift() });
      } else {
        sc2.sidst = null;
        Lys.tegnJordUr(g, ur, { v, top: G.top, L: G.L, sw: G.sw, xs0: G.xs0, we: G.we, kant: 10 });
        tekst(tikTekst(ur.jord), G.we / 2, G.hE - 10, { farve: FARVE.tik, vægt: 700 });
        if (v > 0) tekst(`γ = ${fmt(gam, erTo(gam) ? 0 : 2)}`, G.we - 10, G.hE - 10, { side: 'right', farve: FARVE.svag, vægt: 500 });
      }
      g.restore();
    }

    // ---------- Scene 3-5: kommer snart (T5b og T5c) ----------
    function tegnSnart() {
      panel(0, 0, W, H, '');
      tekst(`${aktiv + 1}. ${SCENER[aktiv].titel}`, W / 2, H / 2 - 6, { vægt: 700, str: skrift() + 2 });
      tekst('Denne scene kommer snart.', W / 2, H / 2 + skrift() + 8, { farve: FARVE.svag, vægt: 500 });
    }

    const scene = () => [
      { hoejde: hoejde1, tegn: tegn1 },
      { hoejde: hoejde2, tegn: tegn2 },
    ][aktiv] ?? { hoejde: () => 200, tegn: tegnSnart };

    // ---------- Lærredets størrelse ----------
    // Bredden følger 3D-billedet (højst MAKS_BREDDE). Højden er scenens egen, men højst det, der er plads til mellem
    // Styr-boksen (eller toppen af billedet) og underteksten med bjælken.
    function størrelse() {
      if (!vindue || !bund) return;
      // Fanerne, der skjuler panelerne (‹ og › midt på kanterne), skal ikke dække lærredet
      const faner = [...vindue.querySelectorAll(':scope > .panel-fane')].some((f) => f.offsetWidth > 0) ? 36 : 0;
      const nyW = Math.max(240, Math.min(MAKS_BREDDE, bund.clientWidth - faner));
      const vR = vindue.getBoundingClientRect();
      // Underteksten, bjælken og mellemrummene (målt hver for sig: .vindue-bund har en største højde og bliver ikke højere)
      const mellemrum = parseFloat(getComputedStyle(bund).rowGap) || 6;
      const andre = [...bund.children].filter((e) => e !== lag && e.offsetHeight > 0).reduce((sum, e) => sum + e.offsetHeight + mellemrum, 0);
      const styr = vindue.querySelector('.styr');
      const sR = styr && styr.offsetHeight > 0 ? styr.getBoundingClientRect() : null;
      const øverst = Math.max(vR.top + 44, sR ? sR.bottom + 8 : 0);
      const plads = vR.bottom - 8 - andre - øverst;
      W = nyW;
      const nyH = Math.round(Math.max(150, Math.min(scene().hoejde(), plads)));
      if (Math.abs(nyH - H) < 1 && holder.style.width === `${W}px`) return;
      H = nyH;
      holder.style.width = `${W}px`;
      lærred.style.height = `${H}px`;
    }
    const iagt = typeof ResizeObserver === 'function' ? new ResizeObserver(() => størrelse()) : null;
    if (iagt && vindue) {
      iagt.observe(vindue);
      iagt.observe(bund);
      const styr = vindue.querySelector('.styr');
      if (styr) iagt.observe(styr);
    }

    function tegn() {
      g = Lys.klarLærred(lærred, W, H);
      scene().tegn();
    }

    // ---------- Teksterne: underteksten (altid fremme) og Lige nu ----------
    function fremme() {
      if (aktiv === 0) {
        if (!sc1.bold) return LYS_TEKST;
        if (sc1.fart === 0) return BOLD_TEKST;
        return `Ved så store farter lægges farterne ikke helt sammen: Bolden flyver ${boldProcent(sc1.fart)} % af lysets fart, ikke ${fmt((0.5 + FARTER1[sc1.fart].b) * 100)} %. Se For nørder.`;
      }
      if (aktiv === 1) {
        const v = T.LYSUR_FARTER[sc2.fart], gam = T.lysurGamma(v);
        if (sc2.ur.stille && v > 0) return `Ved ${T.lysurFartTekst(v)} er den skrå vej ${gangeTekst(gam)} gange så lang som den lige. Derfor tager hvert tik ${gangeTekst(gam)} gange så lang tid set fra Jorden.`;
        if (sc2.ur.stille) return 'Står skibet stille, er der ingen skrå vej. Lyset går lige op og ned i begge billeder.';
        return LIGE_TEKST;
      }
      return 'Denne scene kommer snart. Indtil da kan du gå tilbage til scene 1 og 2.';
    }
    function visTekst() {
      const s = SCENER[aktiv];
      fase(s.titel, fremme(), [aktiv + 1, SCENER.length]);
      lærred.setAttribute('aria-label', `Scene ${aktiv + 1}: ${s.titel}. ${fremme()}`);
      forklaring(`<p><b>Scene ${aktiv + 1} af ${SCENER.length}:</b> ${s.spm}</p>${s.overgang ? `<p>${s.overgang}</p>` : ''}`);
    }

    // ---------- Styringen (skifter med scenen) ----------
    const boldKontakter = [
      { tekst: '⚾ Bold', bold: true },
      { tekst: '🔦 Lygte', bold: false },
    ].map((k) => ({
      tekst: k.tekst, til: sc1.bold === k.bold,
      skift: () => {
        // Præcis én er tændt: Et tryk på den, der allerede er valgt, slukker den ikke
        for (const bk of boldKontakter) { bk.til = bk.tekst === k.tekst; sætKontakt(bk.tekst, bk.til); }
        if (sc1.bold === k.bold) return;
        sc1.bold = k.bold;
        sc1.t = 0;
        visTekst();
      },
    }));
    const fart1 = {
      skyder: true, navn: 'Togets fart', min: 0, max: FARTER1.length - 1, værdi: sc1.fart, vis: (i) => FARTER1[i].navn,
      ændring: (i) => { sc1.fart = i; sc1.t = 0; visTekst(); },
    };
    const fart2 = {
      skyder: true, navn: 'Fart', min: 0, max: T.LYSUR_FARTER.length - 1, værdi: sc2.fart, vis: (i) => T.lysurFartTekst(T.LYSUR_FARTER[i]),
      ændring: (i) => { sc2.fart = i; Lys.nulstilUr(sc2.ur); visTekst(); },
    };
    const trekantKontakt = {
      tekst: '△ Vis trekanten', til: false,
      // Tændt: uret stopper, næste gang lyset set fra Jorden er oppe, og trekanten tegnes. Slukket: uret går videre.
      skift: (til) => { sc2.trekant = til; if (!til) sc2.ur.stille = false; visTekst(); },
    };
    const styring = [];
    function byg() {
      const liste = aktiv === 0 ? [...boldKontakter, fart1] : aktiv === 1 ? [fart2, trekantKontakt] : [];
      styring.splice(0, styring.length, ...liste);
    }

    // ---------- Scenerne som trin i bjælken ----------
    function gåTil(nr) {
      // Man kan kun springe til en scene, man har set, eller den næste (et tryk længere frem går til den næste)
      const ny = Math.max(0, Math.min(SCENER.length - 1, Math.min(nr, Math.max(højesteSet, aktiv) + 1)));
      aktiv = ny;
      højesteSet = Math.max(højesteSet, aktiv);
      sc1.t = 0;
      Lys.nulstilUr(sc2.ur);
      byg();
      opdaterKnapper();
      visTekst();
      størrelse();
      tegn();
    }

    byg();
    visTekst();
    størrelse();
    tegn();

    return {
      styring,
      opdater(dt) {
        if (aktiv === 0) {
          sc1.t += dt;
          if (sc1.t > 4.6) sc1.t = 0;
        } else if (aktiv === 1) {
          const G = geo2();
          const stoppet = Lys.skridtUr(sc2.ur, dt, { v: T.LYSUR_FARTER[sc2.fart], c: G.c, bredde: G.we, stopOppe: sc2.trekant });
          if (stoppet) visTekst();
        }
      },
      // Lærredet tegnes hvert billede, også under pause (fx når trekanten slås til, eller skærmen skifter størrelse)
      altid: () => tegn(),
      trin: () => ({
        nr: aktiv, ialt: SCENER.length, næste: SCENER[aktiv + 1]?.navn ?? '',
        gå: gåTil, forfra: () => gåTil(0),
      }),
      stop() {
        iagt?.disconnect();
        holder.remove();
      },
      test: {
        scene: () => aktiv,
        højesteSet: () => højesteSet,
        lærred: () => {
          const r = lærred.getBoundingClientRect();
          return { bredde: W, højde: H, top: r.top, bund: r.bottom, venstre: r.left, højre: r.right };
        },
        scene1: () => ({ bold: sc1.bold, fart: FARTER1[sc1.fart].b, boldFart: sc1.fart === 0 ? 150 : læggesSammen(0.5, FARTER1[sc1.fart].b), t: sc1.t }),
        scene2: () => ({ fart: T.LYSUR_FARTER[sc2.fart], trekant: sc2.trekant, stille: sc2.ur.stille, skib: sc2.ur.skib, jord: sc2.ur.jord, tegnet: sc2.sidst }),
      },
    };
  },
};
