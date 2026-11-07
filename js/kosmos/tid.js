// Rejsen i tid (tvillingerejsen, T1 i docs/plan-tid.md): Du flyver til Alpha Centauri og hjem igen næsten med lysets
// fart, mens din tvilling bliver hjemme. To ure i et HTML-lag oven på 3D-billedet viser "Dit ur" og "Jordens ur".
// Regningen står i js/data/tid.js (testes i Node), og tallene i docs/fakta-tid.md.
//
// Skyderen giver fast fart (vi springer over, hvordan man kommer op i fart, se "Ærligt talt"). Skærmens tid følger
// tiden på Jorden: ÅR_PR_SEKUND år pr. sekund (⏩ HURTIG gange mere). Tiden i skibet er Jordens tid delt med γ. Farten
// kan skiftes undervejs: Urene lægger tiden sammen bid for bid, så regnestykket passer også da.
// "⏱ Vis lysuret" viser to lysure side om side i et lærred (2D) i stedet for urene. Imens står rejsen stille.

import * as THREE from 'three';
import { handling, tid as tidKnap, gå } from '../sideknap.js';
import { stjerne, glød, skilt, hale, KVALITET } from './faelles.js';
import { lavJorden } from './jorden.js';
import { ROLIG } from '../scene3d.js';
import * as T from '../data/tid.js';

const MÅL = T.MÅL.alpha;
const ÅR_PR_SEKUND = 0.36; // ▶: år på Jorden pr. sekund på skærmen (én vej til Alpha Centauri tager ca. 12 sekunder)
const HURTIG = 6; // ⏩
const START_ÅR = new Date().getFullYear(); // Jordens ur starter i år (jeres svar: "fra år 2026")
const START_NI = 4; // 99,99 %: ca. 45 dage i skibet mod ca. 8,7 år på Jorden
// Scenen (ikke i skala): Jorden til venstre, Alpha Centauri til højre og skibets vej imellem
const JORD_X = -12.5;
const MÅL_X = 12.5;
const SKIB_FRA = JORD_X + 2.1;
const SKIB_TIL = MÅL_X - 2.4;
const SKIB_Y = 0.45;
// Lysuret: et tik (op og ned) tager LYS_TIK sekunder på skærmen i skibet
const LYS_TIK = 1.4;

export default {
  id: 'tid',
  navn: 'Rejsen i tid',
  ikon: '⏳',
  undertitel: 'Flyv næsten med lysets fart',
  kamera: { retning: [0, 0.3, 1], radius: 14.5, drej: false },
  tal: [
    ['Alpha Centauri', 'ca. 4,3 lysår væk'],
    ['Lysets fart', 'ca. 300.000 km/s'],
    ['Ved 99,99 %, ud og hjem', '45 dage mod 8,7 år'],
    ['Teorien', 'Einstein, 1905'],
  ],
  side: {
    kort: 'Kan man rejse ind i fremtiden? Ja, hvis man flyver næsten med lysets fart. Set fra Jorden går alle ure i skibet langsommere. Det kaldes tidsforlængelse. Flyv til Alpha Centauri og hjem, og se, hvor gammel din tvilling er blevet.',
    emner: [
      {
        titel: 'Hvorfor går Jordens ur så hurtigt?',
        tekst: `<p>Lyset har altid den samme fart, uanset hvem der måler den. Forestil dig et ur, hvor et lysglimt hopper op og ned mellem to spejle. I skibet går lyset lige op og ned. Set fra Jorden flytter spejlene sig, mens lyset er undervejs, så lyset går en længere, skrå vej. Derfor tager hvert tik længere tid set fra Jorden. ${handling('Vis lysuret', '⏱ Vis lysuret')}</p>
          <p>Det gælder ikke kun lysure. Alt om bord følger med: atomurene, dit hjerte og dine tanker.</p>`,
      },
      {
        titel: 'Hvad gør farten?',
        tekst: `<p>Ved 90 % af lysets fart går der ca. 2,3 dage på Jorden for hver dag i skibet. Ved 99,99 % er det ca. 71 dage, og ved 99,9999 % ca. 707 dage, næsten 2 år. Hvert ekstra 9-tal gør forskellen ca. 3 gange større.</p>
          <p>Alpha Centauri er ca. 4,3 lysår væk. Et lysår er den vej, lyset når på et år. Set fra Jorden tager turen ud og hjem derfor altid mindst ca. 8,7 år, for skibet kan ikke flyve hurtigere end lyset. Det er kun dit ur, der går langsommere og langsommere. ${tidKnap('hurtig', 'Prøv ⏩')}</p>`,
      },
    ],
    videre: [gå('kosmos:rumtid', 'Rumtid'), gå('kosmos:sorthul', 'Sort hul')],
    nørd: `
      <p><b>Gammafaktoren:</b> γ = 1/√(1 − v²/c²), hvor v er farten og c lysets fart. Et ur, der farer forbi med farten v, går γ gange langsommere set fra os. Ved 99,99 % er γ ca. 70,7.</p>
      <p><b>Lysuret:</b> Spejlene står L fra hinanden, så ét tik (op og ned) tager 2L/c. Set fra Jorden går lyset skråt, og Pythagoras giver, at hvert tik tager γ · 2L/c. Med 1,5 m mellem spejlene ville et lysur tikke ca. 100 millioner gange i sekundet.</p>
      <p><b>Rejsen:</b> Tiden på Jorden er 2 · afstanden / farten. Tiden i skibet er den tid delt med γ.</p>`,
    ærligt: `<p><b>Skyderen springer over, hvordan man kommer op i fart.</b> Man skulle speede knusende hårdt op. Skal en tur tage 2 dage for dig og 2.000 år på Jorden, skal man speede op med ca. 11.500 g (1 g er lige så hårdt, som tyngden trykker her på Jorden). Med 1 g tager det år i skibet at komme op i fart, ikke dage.</p>
      <p><b>Du mærker intet om bord.</b> Dit eget ur går helt normalt, ét sekund pr. sekund, og dit hjerte slår, som det plejer. Det er først, når I sammenligner urene derhjemme, at du er den yngste.</p>
      <p>Jorden og stjernerne er tegnet alt for store, og skibet flyver selvfølgelig ikke med lysets fart hen over skærmen. I lysuret går lyset ufatteligt meget langsommere end i virkeligheden, og man kan ikke se et lysglimt undervejs. Animationen viser det, man ville regne sig frem til. Forholdet mellem de to lysure passer.</p>`,
  },

  lav(gruppe, { fase, lyd, forklaring, overlag, opdaterKnapper }) {
    // ---------- Scenen: Jorden, Alpha Centauri og skibet ----------
    const jorden = lavJorden(1.3);
    jorden.klode.position.set(JORD_X, 0, 0);
    jorden.sætLys(new THREE.Vector3(JORD_X + 40, 18, 70), 1);
    gruppe.add(jorden.klode);

    const alphaA = stjerne(0.95, '#fff4d6', '#e8a040', new THREE.Color(2.0, 1.7, 1.0), 3.0);
    alphaA.position.set(MÅL_X - 0.1, 0.25, -0.8);
    const alphaB = stjerne(0.72, '#ffd6a0', '#c8601c', new THREE.Color(1.9, 1.0, 0.45), 2.8);
    alphaB.position.set(MÅL_X + 1.4, -0.45, 0.7);
    gruppe.add(alphaA, alphaB);

    const navnJord = skilt('Jorden', '#cfe0ff', 1.25);
    navnJord.position.set(JORD_X, 2.6, 0);
    const navnMål = skilt(MÅL.navn, '#ffe6b0', 1.25);
    navnMål.position.set(MÅL_X + 0.4, 2.6, 0);
    const navnAfstand = skilt('ca. 4,3 lysår', '#9fb4d8', 1.0);
    navnAfstand.position.set(0, -0.95, 0);
    gruppe.add(navnJord, navnMål, navnAfstand);

    // Vejen imellem (stiplet)
    const vejGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(SKIB_FRA, 0, 0), new THREE.Vector3(SKIB_TIL, 0, 0)]);
    const vej = new THREE.Line(vejGeo, new THREE.LineDashedMaterial({ color: 0x6f8fc8, dashSize: 0.35, gapSize: 0.3, transparent: true, opacity: 0.55 }));
    vej.computeLineDistances();
    gruppe.add(vej);

    // Skibet peger mod +x (en krop, en næse, tre finner og flammen bagved)
    const skib = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: 0xd8dee8, metalness: 0.5, roughness: 0.35 });
    const krop = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.8, 20), metal);
    krop.rotation.z = -Math.PI / 2;
    const næse = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.34, 20), new THREE.MeshStandardMaterial({ color: 0xff7a4a, roughness: 0.4 }));
    næse.rotation.z = -Math.PI / 2;
    næse.position.x = 0.57;
    skib.add(krop, næse);
    for (let i = 0; i < 3; i++) {
      const finne = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.16), metal);
      const v = (i / 3) * Math.PI * 2;
      finne.position.set(-0.32, Math.cos(v) * 0.17, Math.sin(v) * 0.17);
      finne.rotation.x = v;
      skib.add(finne);
    }
    const flamme = glød(new THREE.Color(0.7, 1.3, 2.6), 1.1, 0);
    flamme.position.x = -0.55;
    skib.add(flamme);
    skib.scale.setScalar(1.25);
    const skibHale = hale(Math.round(70 * KVALITET + 30), 0x7fc8ff, 0.55);
    gruppe.add(skib, skibHale.linje);

    // ---------- Urene (HTML oven på 3D-billedet) ----------
    const ure = document.createElement('div');
    ure.className = 'tid-ure';
    const streger = Array.from({ length: 12 }, (_, i) => {
      const v = (i / 12) * Math.PI * 2;
      return `<line x1="${(Math.sin(v) * 15).toFixed(2)}" y1="${(-Math.cos(v) * 15).toFixed(2)}" x2="${(Math.sin(v) * 18).toFixed(2)}" y2="${(-Math.cos(v) * 18).toFixed(2)}"/>`;
    }).join('');
    ure.innerHTML = `
      <div class="tid-ur"><span class="tid-ur-navn">🚀 Dit ur</span><strong class="tid-ur-tal"></strong><span class="tid-ur-alder"></span></div>
      <div class="tid-ur tid-ur-jord">
        <svg class="tid-skive" viewBox="-21 -21 42 42" aria-hidden="true"><circle r="20"/><g class="tid-streger">${streger}</g><line class="tid-viser" x1="0" y1="3" x2="0" y2="-15"/><circle class="tid-midt" r="2"/></svg>
        <div class="tid-ur-tekst"><span class="tid-ur-navn">🌍 Jordens ur</span><strong class="tid-ur-tal"></strong><span class="tid-ur-alder"></span></div>
      </div>`;
    const [skibTal, jordTal] = ure.querySelectorAll('.tid-ur-tal');
    const [skibAlder, jordAlder] = ure.querySelectorAll('.tid-ur-alder');
    const viser = ure.querySelector('.tid-viser');

    // ---------- Lysuret (et lærred med to lysure side om side) ----------
    const lysur = document.createElement('div');
    lysur.className = 'tid-lysur';
    lysur.hidden = true;
    const lærred = document.createElement('canvas');
    lysur.append(lærred);
    overlag().append(ure, lysur);

    // ---------- Tilstanden ----------
    let ni = START_NI; // antallet af 9-taller på skyderen
    let tilstand = 'hjemme'; // 'hjemme' (før afgang), 'ud', 'hjem' eller 'færdig'
    let skibÅr = 0; // tiden i skibet siden afgang
    let jordÅr = 0; // tiden på Jorden siden afgang
    let pos = 0; // skibets afstand fra Jorden i lysår
    let ved = { skibÅr: 0, jordÅr: 0 }; // urene, da skibet nåede Alpha Centauri
    let hurtig = false; // ⏩
    let lysurVist = false;
    let faseNr = 0;
    let vending = 0; // skibets drejning: 0 = mod Alpha Centauri, 1 = mod Jorden
    // Lysurets egne ure: fasen i skibet og set fra Jorden (i tik) og spejlenes vej set fra Jorden (i lysurets højder)
    const ly = { skib: 0, jord: 0, x: 0, spor: [] };

    const flyver = () => tilstand === 'ud' || tilstand === 'hjem';

    function visUre() {
      const t1 = T.ditUr(skibÅr);
      const t2 = `år ${T.jordÅrstal(START_ÅR, jordÅr)}`;
      const a1 = `Du: ${T.alderTekst(T.START_ALDER + skibÅr)}`;
      const tvilling = T.tvillingAlder(jordÅr);
      const a2 = tvilling !== null ? `Tvillingen: ${tvilling} år` : 'Tvillingen levede et langt liv';
      if (skibTal.textContent !== t1) skibTal.textContent = t1;
      if (jordTal.textContent !== t2) jordTal.textContent = t2;
      if (skibAlder.textContent !== a1) skibAlder.textContent = a1;
      if (jordAlder.textContent !== a2) jordAlder.textContent = a2;
      // Viseren går én gang rundt pr. år på Jorden
      viser.setAttribute('transform', `rotate(${(((jordÅr % 1) * 360)).toFixed(1)})`);
    }

    // "Lige nu" i panelet: hvad farten betyder (skrives kun om, når teksten ændrer sig)
    function visLigeNu() {
      const r = T.rejse(MÅL.lysår, ni);
      const f = T.fartTekst(ni);
      if (lysurVist) {
        forklaring(`<p><b>Lige nu:</b> To billeder af det samme lysur ved ${f} af lysets fart. Set fra Jorden tager hvert tik ${T.gammaTekst(r.gamma)} gange så lang tid.</p>`);
        return;
      }
      const prognose = `<p><b>Lige nu:</b> Ved ${f} af lysets fart tager turen ud og hjem ca. ${T.varighed(r.skibÅr)} for dig og ca. ${T.varighed(r.jordÅr)} på Jorden. For hver dag i skibet går der ca. ${T.dagePåJorden(ni)} dage på Jorden.</p>`;
      const ekstra = flyver() ? '<p>Du kan skifte fart undervejs.</p>' : tilstand === 'færdig' ? '<p>Vælg en anden fart, og flyv igen.</p>' : '<p>Du og din tvilling er begge 13 år.</p>';
      forklaring(prognose + ekstra);
    }

    function visFase() {
      if (lysurVist) {
        fase('Lysuret', 'Lyset har samme fart i begge billeder. Set fra Jorden går det en længere, skrå vej, så hvert tik tager længere tid.');
        return;
      }
      const f = T.fartTekst(ni);
      if (faseNr === 0) fase(null);
      else if (faseNr === 1) fase('Afgang', `Du flyver med ${f} af lysets fart. Se urene: Jordens ur løber fra dit. Om bord mærker du intet.`, [1, 4]);
      else if (faseNr === 2) fase(`Ude ved ${MÅL.navn}`, `For dig har turen taget ${T.varighed(ved.skibÅr)}. På Jorden er der gået ${T.varighed(ved.jordÅr)}. Nu vender du om.`, [2, 4]);
      else if (faseNr === 3) fase('På vej hjem', `Set fra Jorden går alle ure i skibet ca. ${T.dagePåJorden(ni)} gange langsommere end Jordens. Dit ur går stadig helt normalt for dig.`, [3, 4]);
      else fase('Hjemme igen', T.hjemkomst(skibÅr, jordÅr, START_ÅR), [4, 4]);
    }

    function stilSkib() {
      const x = SKIB_FRA + (SKIB_TIL - SKIB_FRA) * (pos / MÅL.lysår);
      skib.position.set(x, SKIB_Y, 0);
      skib.rotation.y = Math.PI * vending;
    }

    function nulstil() {
      tilstand = 'hjemme';
      skibÅr = 0;
      jordÅr = 0;
      pos = 0;
      vending = 0;
      faseNr = 0;
      flamme.material.opacity = 0;
      stilSkib();
      skibHale.nulstil(skib.position);
      visUre();
      visFase();
      visLigeNu();
    }

    function flyv() {
      nulstil();
      tilstand = 'ud';
      faseNr = 1;
      lyd.sus?.(2);
      visFase();
      visLigeNu();
    }

    function visLysur(til) {
      lysurVist = til;
      ure.hidden = til;
      lysur.hidden = !til;
      if (til) {
        ly.skib = 0;
        ly.jord = 0;
        ly.x = 0;
        ly.spor.length = 0;
        tegnLysur();
      }
      visFase();
      visLigeNu();
    }

    // Rejsen frem med dJord år på Jorden. Ved målet og ved hjemkomsten deles skridtet, så tallene passer præcist.
    function rejs(dJord) {
      const v = T.fart(ni);
      const g = T.gamma(ni);
      while (dJord > 0 && flyver()) {
        const tilbage = tilstand === 'ud' ? MÅL.lysår - pos : pos; // lysår til næste vending eller hjem
        const tidTil = tilbage / v;
        const d = Math.min(dJord, tidTil);
        jordÅr += d;
        skibÅr += d / g;
        pos += (tilstand === 'ud' ? 1 : -1) * v * d;
        dJord -= d;
        if (d >= tidTil) {
          if (tilstand === 'ud') {
            pos = MÅL.lysår;
            tilstand = 'hjem';
            ved = { skibÅr, jordÅr };
            faseNr = 2;
            visFase();
          } else {
            pos = 0;
            tilstand = 'færdig';
            faseNr = 4;
            flamme.material.opacity = 0;
            lyd.klaret?.();
            visFase();
            visLigeNu();
            opdaterKnapper();
          }
        }
      }
      // På vej hjem: Efter ca. en tredjedel af hjemturen skifter underteksten fra "Ude ved målet" til "På vej hjem"
      if (tilstand === 'hjem' && faseNr === 2 && pos < MÅL.lysår * 0.7) {
        faseNr = 3;
        visFase();
      }
    }

    // ---------- Lysuret ----------
    function tegnLysur() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = lærred.clientWidth || 520;
      const H = lærred.clientHeight || 220;
      if (lærred.width !== Math.round(W * dpr) || lærred.height !== Math.round(H * dpr)) {
        lærred.width = Math.round(W * dpr);
        lærred.height = Math.round(H * dpr);
      }
      const g = lærred.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const lille = W < 400;
      const skrift = lille ? 11 : 13;
      const mellem = 10;
      const pw = (W - mellem) / 2; // hvert billedes bredde
      const top = skrift + 14; // det øverste spejl
      const bund = H - skrift - 14; // det nederste spejl
      const L = bund - top;
      const sw = Math.min(46, pw * 0.16); // spejlenes bredde

      const spejl = (x, y) => {
        g.fillStyle = '#cfe3ff';
        g.shadowColor = 'rgba(140,200,255,0.8)';
        g.shadowBlur = 6;
        g.fillRect(x - sw / 2, y - 2, sw, 4);
        g.shadowBlur = 0;
      };
      const glimt = (x, y) => {
        const r = lille ? 5 : 6;
        const grad = g.createRadialGradient(x, y, 0, x, y, r * 2.4);
        grad.addColorStop(0, 'rgba(255,255,230,1)');
        grad.addColorStop(0.35, 'rgba(255,236,140,0.85)');
        grad.addColorStop(1, 'rgba(255,200,80,0)');
        g.fillStyle = grad;
        g.beginPath();
        g.arc(x, y, r * 2.4, 0, Math.PI * 2);
        g.fill();
      };
      // Højden over det nederste spejl for en fase i tik (0 = nede, ½ = oppe, 1 = nede igen)
      const højde = (f) => { const r = f - Math.floor(f); return L * (r < 0.5 ? 2 * r : 2 - 2 * r); };
      const tekst = (s, x, y, farve = '#c9d6ee', vægt = 600) => {
        g.font = `${vægt} ${skrift}px system-ui, sans-serif`;
        g.fillStyle = farve;
        g.textAlign = 'center';
        g.fillText(s, x, y);
      };

      for (const [i, navn] of [[0, 'Set af dig i skibet'], [1, 'Set fra Jorden']]) {
        const x0 = i * (pw + mellem);
        g.save();
        g.fillStyle = 'rgba(8,12,28,0.82)';
        g.strokeStyle = 'rgba(120,150,210,0.35)';
        g.lineWidth = 1;
        g.beginPath();
        g.roundRect(x0 + 0.5, 0.5, pw - 1, H - 1, 10);
        g.fill();
        g.stroke();
        g.clip();
        tekst(navn, x0 + pw / 2, skrift + 3);
        if (i === 0) {
          // I skibet: spejlene står stille, og lyset hopper lige op og ned
          const mx = x0 + pw / 2;
          g.strokeStyle = 'rgba(255,230,140,0.35)';
          g.lineWidth = 2;
          g.beginPath();
          g.moveTo(mx, bund);
          g.lineTo(mx, top);
          g.stroke();
          spejl(mx, top);
          spejl(mx, bund);
          glimt(mx, bund - højde(ly.skib));
          tekst(`Tik: ${T.tal(Math.floor(ly.skib))}`, mx, H - 5, '#ffe08a', 700);
        } else {
          // Set fra Jorden: spejlene farer forbi, og lyset går skråt (zigzag). Når spejlene er ude til højre, kommer
          // de ind fra venstre igen, og sporet starter forfra.
          const bane = pw + sw;
          const mx = x0 - sw / 2 + (ly.x % bane);
          g.strokeStyle = 'rgba(255,230,140,0.6)';
          g.lineWidth = 2;
          g.beginPath();
          ly.spor.forEach(([sx, sy], j) => (j ? g.lineTo(x0 + sx, sy) : g.moveTo(x0 + sx, sy)));
          g.lineTo(mx, bund - højde(ly.jord));
          g.stroke();
          spejl(mx, top);
          spejl(mx, bund);
          glimt(mx, bund - højde(ly.jord));
          const tik = ly.jord < 10 ? T.tal(ly.jord, ly.jord < 1 ? 2 : 1) : T.tal(Math.floor(ly.jord));
          tekst(`Tik: ${tik}`, x0 + pw / 2, H - 5, '#ffe08a', 700);
        }
        g.restore();
      }
    }

    function opdaterLysur(dt) {
      const g = T.gamma(ni);
      const v = T.fart(ni);
      const W = lærred.clientWidth || 520;
      const H = lærred.clientHeight || 220;
      const pw = (W - 10) / 2;
      const sw = Math.min(46, pw * 0.16);
      const skrift = W < 400 ? 11 : 13;
      const L = H - 2 * (skrift + 14);
      const c = (2 * L) / LYS_TIK; // lysets fart på skærmen (pixel pr. sekund)
      const bane = pw + sw;
      const førRunde = Math.floor(ly.x / bane);
      ly.skib += dt / LYS_TIK;
      ly.jord += dt / (LYS_TIK * g);
      ly.x += v * c * dt;
      // Sporet set fra Jorden: punkter siden spejlene kom ind fra venstre (i billedets egne koordinater)
      if (Math.floor(ly.x / bane) !== førRunde) ly.spor.length = 0;
      const r = ly.jord - Math.floor(ly.jord);
      ly.spor.push([-sw / 2 + (ly.x % bane), H - skrift - 14 - L * (r < 0.5 ? 2 * r : 2 - 2 * r)]);
      if (ly.spor.length > 600) ly.spor.splice(0, ly.spor.length - 600);
      tegnLysur();
    }

    // ---------- Styringen ----------
    const styring = [
      { tekst: `🚀 Flyv til ${MÅL.navn}`, handling: flyv, deaktiv: flyver, skjul: () => lysurVist },
      { tekst: '⏱ Vis lysuret', handling: () => visLysur(true), skjul: () => lysurVist },
      { tekst: '↩ Tilbage til rejsen', handling: () => visLysur(false), skjul: () => !lysurVist },
      { tekst: '↺ Forfra', handling: nulstil, skjul: () => lysurVist || tilstand === 'hjemme' },
      {
        skyder: true, navn: 'Fart', min: T.MINDST_NI, max: T.FLEST_NI, værdi: ni, vis: T.fartTekst,
        ændring: (v) => {
          ni = v;
          if (lysurVist) ly.spor.length = 0; // en ny vinkel: sporet starter forfra
          if (faseNr === 1 || faseNr === 3) visFase();
          visLigeNu();
        },
      },
    ];

    nulstil();
    let panelTid = 0;
    const bag = new THREE.Vector3(); // punktet bag skibet, hvor halen starter

    return {
      styring,
      hurtig: `rejsen går ${HURTIG} gange hurtigere`,
      tempo: (t) => { hurtig = t === 'hurtig'; },
      opdater(dt) {
        jorden.omdrejning.rotation.y += dt * 0.12;
        if (lysurVist) {
          opdaterLysur(dt * (hurtig ? 3 : 1)); // ⏩ går 3 gange hurtigere her, så man stadig kan følge lyset
          return;
        }
        if (flyver()) {
          rejs(dt * ÅR_PR_SEKUND * (hurtig ? HURTIG : 1));
          flamme.material.opacity = 0.9;
          visUre();
        }
        // Skibet vender om ved målet (kun at se på: vendingen tager ingen tid i regnestykket)
        const målVending = tilstand === 'hjem' || tilstand === 'færdig' ? 1 : 0;
        vending = ROLIG ? målVending : vending + Math.sign(målVending - vending) * Math.min(Math.abs(målVending - vending), dt * 2.5);
        stilSkib();
        skibHale.følg(skib.localToWorld(bag.set(-0.5, 0, 0)));
        panelTid += dt;
        if (panelTid > 0.25) { panelTid = 0; visLigeNu(); }
      },
      test: {
        tilstand: () => tilstand,
        ni: () => ni,
        ure: () => ({ skibÅr, jordÅr, skib: skibTal.textContent, jord: jordTal.textContent, skibAlder: skibAlder.textContent, jordAlder: jordAlder.textContent, vist: !ure.hidden }),
        startÅr: START_ÅR,
        lysur: () => ({ vist: !lysur.hidden, skib: ly.skib, jord: ly.jord, x: ly.x, spor: ly.spor.length, bredde: lærred.clientWidth }),
      },
    };
  },
};
