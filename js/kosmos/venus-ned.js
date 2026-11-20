// Turen ned gennem skyerne til Venera 13 (V5 i docs/plan-venus.md, jeres svar på Fables tjek E18: flybyens sidste stop
// og en knap ved Venera 13 i træet). Bruges af js/kosmos/venus.js.
//
// - Kameraet flyver først hen over stedet (ca. 320 km oppe) og daler så lodret ned til ca. 3 km over jorden (en bane i
//   kameraets rejse, js/solsystem/rejse.js), mens det kigger mere og mere mod horisonten. Måleren viser højden over
//   jorden, temperaturen og lufttrykket fra VIRA (js/data/luft-venus.js). Det sidste stykke ned viser måleren alene
//   (kameraet stopper ca. 3 km oppe, for radarkortet har kun ca. 2 km pr. pixel), og så kommer Veneras foto frem fladt.
// - Inde i skyerne (ca. 48-70 km) er der lys dis omkring kameraet. Under dem er himlen orange og diset uden Sol og
//   stjerner, og jorden ses gennem en dis, der bliver tyndere tæt på jorden. Det er en kuppel om kameraet (tegnet sidst,
//   oven på alt), ikke regnet lys. Farverne er valgt efter Veneras fotos og målingen af lyset dernede.
// - venus.js tager skyerne væk (skyderen "Under skyerne" på 100 %), når kameraet er under skyernes top, og sætter dem
//   tilbage, når man zoomer op over dem igen (iSkyerne()).
// - Undervejs skifter underteksten ved hvert trin (over skyerne, i skyerne, stuetemperatur, under skyerne, varmere end
//   en ovn og landet, NED_TRIN i js/data/sider/venus.js), og en søjle ved måleren viser, hvor man er i forhold til
//   skyerne (jeres feedback 17. november 2026: "jeg forstår ikke rigtig, hvad det gør").
// - Hvert trin får sin tid fra kurven (KNÆK) plus ca. 3 sekunder ekstra i snit, fordelt efter antallet af ord i
//   underteksten (jeres svar 20. november 2026). ‹ og › i bjælken, prikkerne i underteksten og piletasterne bladrer:
//   kameraet glider hen til starten af trinet og fortsætter derfra (spring). Underteksterne står i loggen 🔔.

import * as THREE from 'three';
import { ROLIG } from '../scene3d.js';
import { MAPPE } from '../solsystem/hent.js';
import { VIRA, SKYER, luftVed, målerTekst } from '../data/luft-venus.js';
import { NED_TRIN } from '../data/sider/venus.js';

const MIDDEL_KM = 6051.8; // VIRA's højder er over middelradius (NSSDC)
const START_KM = 320; // så højt over stedet starter turen ned
const SLUT_KM = 3; // så højt over jorden stopper kameraet (MARGEN i venus.js er 2 km)
const LAND_TID = 2.5; // sekunder: måleren tager det sidste stykke ned
const VINKEL = [55, 12]; // grader under vandret, kameraet kigger ned øverst og nederst
// Højden over jorden (km) på kurven (u er 0 til 1): Den blev lavet til en tur på KURVE_TID sekunder, hvor hvert trin
// fik ca. 4-8 sekunder, og det går langsomt forbi stuetemperaturen ved ca. 55 km
const KNÆK = [[0, START_KM], [0.12, 100], [0.26, 70], [0.38, 58], [0.56, 52], [0.74, 22], [1, SLUT_KM]];
const KURVE_TID = 34;
// Trinene og den højde over middelradius (km), de starter under (underteksterne står i NED_TRIN i js/data/sider/venus.js).
// 'over' starter, når kameraet begynder at dale, og 'landet', når måleren har taget det sidste stykke.
export const TRIN = [['over', Infinity], ['skyer', SKYER.top], ['stue', 58.5], ['under', SKYER.bund], ['ovn', 20], ['landet', -Infinity]];
// Ekstra tid til hvert trin (undtagen 'landet', som bliver stående): EKSTRA sekunder i snit, delt efter antallet af ord
// i underteksten, så lange tekster får lidt mere og korte lidt mindre (jeres svar 20. november 2026)
const EKSTRA = 3;
const ORD = TRIN.slice(0, -1).map(([id]) => NED_TRIN.find((t) => t.id === id).tekst.split(/\s+/).length);
const EKSTRA_TID = ORD.map((n) => (EKSTRA * n * ORD.length) / ORD.reduce((a, b) => a + b, 0));
export const NED_TID = KURVE_TID + EKSTRA * ORD.length; // sekunder fra 320 km til 3 km (ca. 49)
const SPRING_TID = 1.2; // sekunder: så længe glider kameraet hen til starten af et trin, når man bladrer
const glat = (t) => t * t * t * (t * (t * 6 - 15) + 10); // som kameraets rejse (js/solsystem/rejse.js)
// Tiden (0 til 1) ved e: rejsen giver e = glat(tiden), så den vendes om (glat vokser hele vejen)
function tidVed(e) {
  let a = 0, b = 1;
  for (let i = 0; i < 22; i++) {
    const m = (a + b) / 2;
    if (glat(m) < e) a = m; else b = m;
  }
  return (a + b) / 2;
}
const FOTO = new URL('venera13-foto.jpg', MAPPE).href;

// Højden over jorden (km) ved u på kurven (0 til 1)
function kurveHøjde(u) {
  let i = 0;
  while (i < KNÆK.length - 2 && u > KNÆK[i + 1][0]) i++;
  const [u0, h0] = KNÆK[i], [u1, h1] = KNÆK[i + 1];
  return h0 + (h1 - h0) * THREE.MathUtils.clamp((u - u0) / (u1 - u0), 0, 1);
}
// Hvor på kurven er højden h (km over jorden)? (kurven falder hele vejen)
function kurveVed(h) {
  let a = 0, b = 1;
  for (let i = 0; i < 30; i++) {
    const m = (a + b) / 2;
    if (kurveHøjde(m) > h) a = m; else b = m;
  }
  return (a + b) / 2;
}
// Tidsplanen for turen ned: u[i] er, hvor på kurven trin i starter, og s[i] det sekund, det starter (s[5] er NED_TID,
// når kameraet er nede). Trinene starter i en højde over middelradius, så planen afhænger af jorden ved stedet (jord, km).
export function lavPlan(jord) {
  const u = [0];
  for (let i = 1; i < TRIN.length - 1; i++) u.push(kurveVed(TRIN[i][1] - jord));
  u.push(1);
  const s = [0];
  for (let i = 0; i < u.length - 1; i++) s.push(s[i] + (u[i + 1] - u[i]) * KURVE_TID + EKSTRA_TID[i]);
  return { u, s };
}
// Højden over jorden (km) sekund sek inde i turen ned: Inden for hvert trin går kurven lige så meget langsommere, som
// trinet har fået ekstra tid
export function nedHøjde(sek, plan) {
  const { u, s } = plan;
  let i = 0;
  while (i < s.length - 2 && sek > s[i + 1]) i++;
  const f = THREE.MathUtils.clamp((sek - s[i]) / (s[i + 1] - s[i]), 0, 1);
  return kurveHøjde(u[i] + f * (u[i + 1] - u[i]));
}
const nedVinkel = (sek) => THREE.MathUtils.lerp(VINKEL[0], VINKEL[1], THREE.MathUtils.clamp(sek / NED_TID, 0, 1)) * (Math.PI / 180);
// Søjlen ved måleren går fra jorden til 100 km over middelradius (procent fra toppen)
const SØJLE_KM = 100;
const iSøjle = (h) => `${(100 * (1 - THREE.MathUtils.clamp(h / SØJLE_KM, 0, 1))).toFixed(1)}%`;

// Kuplen om kameraet: dis i skyerne, orange himmel og dis over jorden under dem
const KUPPEL_GLSL = {
  vertex: /* glsl */ `
    varying vec3 vRetning;
    void main() {
      vRetning = normalize((modelMatrix * vec4(position, 0.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragment: /* glsl */ `
    uniform vec3 uHimmel;
    uniform vec3 uDis;
    uniform float uHimmelA;
    uniform float uHorisontA;
    uniform float uDisA;
    varying vec3 vRetning;
    void main() {
      float y = normalize(vRetning).y;
      float over = smoothstep(-0.04, 0.12, y);
      vec3 himmel = uHimmel * (0.82 + 0.25 * max(y, 0.0));
      vec3 c = mix(uDis, himmel, over);
      float ned = mix(uHorisontA, uDisA, smoothstep(0.0, 0.6, -y));
      gl_FragColor = vec4(c, mix(ned, uHimmelA, over));
    }`,
};

// gruppe: fænomenets gruppe (ikke skaleret). sted(): { grund, op, nord } i systemets retninger (grund: punktet på jorden
// ved stedet, med højden). jordKm(): jordens højde over kortets kugle ved stedet. kortKm: kortets radius (6.051,0 km).
// overlag: elementet oven på 3D-billedet. ændret(): Indstillinger skal bygges om (fotoets kontakt). nytTrin(id, nr, ny):
// turen er nået til et nyt trin (TRIN, nr fra 0), så venus.js skifter underteksten. ny er true første gang på turen
// (så kommer den i loggen).
export function lavNedtur({ gruppe, kamera, rejse, S, kortKm, sted, jordKm, overlag, ændret, nytTrin }) {
  let fase = null; // null, 'hen' (flyver hen over stedet), 'ned', 'lander' eller 'landet'
  let landT = 0;
  let fotoTil = true;
  let hVist = START_KM; // den højde, måleren viser (km over jorden)
  let kuppelFra = false; // kun til tests
  let trinNr = -1; // det trin i TRIN, turen er ved (af sig selv går det kun fremad, men man kan bladre)
  let sete = new Set(); // de trin, turen har vist (så står hver undertekst kun én gang i loggen)
  let springer = false; // kameraet glider hen til starten af et trin (man har bladret)
  let plan = lavPlan(0);
  let færdigNed = null;

  // ---------- Kuplen ----------
  const kuppelMat = new THREE.ShaderMaterial({
    uniforms: {
      uHimmel: { value: new THREE.Color() }, uDis: { value: new THREE.Color() },
      uHimmelA: { value: 0 }, uHorisontA: { value: 0 }, uDisA: { value: 0 },
    },
    vertexShader: KUPPEL_GLSL.vertex,
    fragmentShader: KUPPEL_GLSL.fragment,
    side: THREE.BackSide, transparent: true, depthTest: false, depthWrite: false,
  });
  const kuppel = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), kuppelMat);
  kuppel.renderOrder = 50; // efter planeten, skyerne, Solen og stjernerne
  kuppel.frustumCulled = false;
  kuppel.visible = false;
  gruppe.add(kuppel);
  const farve = new THREE.Color();
  const tågeFarve = new THREE.Color(0.12, 0.11, 0.085); // inde i skyerne: gullig dis. Lineære farver: Med fuld grafik bliver de lysere
  // (tonekurven og sRGB), og de skal være mørke nok til, at toplinjen og panelerne kan læses (de ligger oven på lærredet)
  const himmelTop = new THREE.Color(0.13, 0.09, 0.05); // lige under skyerne
  const himmelBund = new THREE.Color(0.12, 0.062, 0.022); // nede ved jorden (orange som på Veneras fotos)
  const disTop = new THREE.Color(0.1, 0.064, 0.032);
  const disBund = new THREE.Color(0.085, 0.045, 0.017);
  // Kuplen efter højden h (km over middelradius)
  function sætKuppel(h) {
    const u = kuppelMat.uniforms;
    const under = 1 - THREE.MathUtils.smoothstep(h, SKYER.bund - 3, SKYER.bund);
    // (helt tæt ved skyernes top, så skylaget kan skjules bag disen, når kameraet kommer ind i det: iSkyerne)
    let iSky = THREE.MathUtils.smoothstep(h, SKYER.bund - 3, SKYER.bund) * (1 - THREE.MathUtils.smoothstep(h, SKYER.top, SKYER.top + 2.5));
    // Over skyerne tager disen til fra ca. 130 km, så skyernes lyse top ikke fylder hele billedet (toplinjen og
    // panelerne skal kunne læses), og man kan se, at man nærmer sig dem
    iSky = Math.max(iSky, 0.65 * (1 - THREE.MathUtils.smoothstep(h, SKYER.top, 130)) * (1 - under));
    kuppel.visible = iSky + under > 0.002;
    if (!kuppel.visible) return;
    const f = THREE.MathUtils.clamp(h / SKYER.bund, 0, 1); // 1 lige under skyerne, 0 ved jorden
    // Himlen: under skyerne helt dækkende (ingen Sol og stjerner), i skyerne lys dis
    u.uHimmel.value.copy(farve.copy(himmelBund).lerp(himmelTop, f)).lerp(tågeFarve, iSky);
    u.uDis.value.copy(farve.copy(disBund).lerp(disTop, f)).lerp(tågeFarve, iSky);
    // (iSky + under er højst 1 og glider fra den ene til den anden ved skyernes bund, så summen giver intet hul)
    u.uHimmelA.value = iSky * 0.97 + under;
    u.uHorisontA.value = iSky * 0.95 + under * 0.92;
    u.uDisA.value = iSky * 0.9 + under * THREE.MathUtils.lerp(0.28, 0.62, f);
  }

  // ---------- Måleren og fotoet (oven på 3D-billedet) ----------
  const boks = document.createElement('div');
  boks.className = 'venus-ned';
  boks.innerHTML = `
    <figure class="venus-foto" hidden><img src="${FOTO}" alt="Venera 13's farvefoto af jorden på Venus: flade, lyse sten og mørk jord, og forneden en del af landeren med tænder" draggable="false">
      <figcaption>Venera 13's foto fra jorden på Venus, 1. marts 1982 (USSR/NASA). Forneden ses en del af landeren.</figcaption></figure>
    <div class="venus-maaler" hidden role="group" aria-label="Måleren">
      <div class="vm-soejle" aria-hidden="true"><i class="vm-bar"><i class="vm-skyer" style="top: ${iSøjle(SKYER.top)}; bottom: ${(100 - parseFloat(iSøjle(SKYER.bund))).toFixed(1)}%"></i><i class="vm-prik"></i></i>
        <small style="top: 0">${SØJLE_KM} km</small><small class="vm-skytekst" style="top: ${iSøjle((SKYER.top + SKYER.bund) / 2)}">skyer</small><small style="bottom: 0">jorden</small></div>
      <div class="vm-tal"><span>Højde over jorden</span><strong class="vm-hoejde"></strong></div>
      <div class="vm-tal"><span>Temperatur</span><strong class="vm-temp"></strong></div>
      <div class="vm-tal"><span>Lufttryk (Jorden: 1 bar)</span><strong class="vm-tryk"></strong></div>
    </div>`;
  const foto = boks.querySelector('.venus-foto');
  const måler = boks.querySelector('.venus-maaler');
  const felter = { højde: boks.querySelector('.vm-hoejde'), temperatur: boks.querySelector('.vm-temp'), tryk: boks.querySelector('.vm-tryk') };
  const prik = boks.querySelector('.vm-prik');
  let prikVist = '';
  overlag.append(boks);
  const vist = { højde: '', temperatur: '', tryk: '' };
  const kold = new THREE.Color(0.75, 0.86, 1), varm = new THREE.Color(1, 0.55, 0.25);
  let tempFarve = '';
  function visMåler(hJord, hMiddel) {
    const synlig = fase !== null && hMiddel <= 100.5;
    if (måler.hidden === synlig) måler.hidden = !synlig;
    if (!synlig) return;
    const luft = luftVed(hMiddel);
    const tekst = målerTekst(hJord, luft);
    for (const k of Object.keys(vist)) if (tekst[k] !== vist[k]) felter[k].textContent = vist[k] = tekst[k];
    // Temperaturens tal bliver varmere i farven (rød og orange bruges kun om varme, stilguiden)
    const f = THREE.MathUtils.clamp((luft.temperatur + 40) / 500, 0, 1);
    const c = `#${farve.copy(kold).lerp(varm, f).getHexString()}`;
    if (c !== tempFarve) felter.temperatur.style.color = tempFarve = c;
    // Prikken i søjlen (højden over middelradius, som skyerne i søjlen)
    const top = iSøjle(hMiddel);
    if (top !== prikVist) prik.style.top = prikVist = top;
  }
  // Det trin, turen er nået til (kun fremad: zoomer man selv op efter landingen, bliver det ved "landet")
  function tjekTrin(hMiddel) {
    if (fase === 'hen' || fase === null || springer) return;
    let nr = TRIN.length - 2;
    if (fase === 'landet') nr = TRIN.length - 1;
    else while (nr > 0 && !(hMiddel < TRIN[nr][1])) nr--;
    if (nr <= trinNr) return;
    sætTrin(nr);
  }
  function sætTrin(nr) {
    trinNr = nr;
    const ny = !sete.has(nr);
    sete.add(nr);
    nytTrin?.(TRIN[nr][0], nr, ny);
  }
  function visFoto() {
    const til = fase === 'landet' && fotoTil;
    if (foto.hidden === til) foto.hidden = !til;
  }

  // ---------- Vejen ned ----------
  const kam = new THREE.Vector3(), mål = new THREE.Vector3();
  // Kameraets plads og det punkt, det kigger på, sekund sek inde i turen ned (systemets retninger, 1 = 1.000 km)
  function vej(sek, k, m) {
    const { grund, op, nord } = sted();
    const h = nedHøjde(sek, plan);
    k.copy(grund).addScaledVector(op, h / S);
    m.copy(grund).addScaledVector(nord, h / Math.tan(nedVinkel(sek)) / S);
  }
  const jordMiddel = () => kortKm + jordKm() - MIDDEL_KM; // jorden ved stedet over middelradius (km)

  function start({ færdig } = {}) {
    fase = 'hen';
    landT = 0;
    fotoTil = true;
    trinNr = -1;
    sete = new Set();
    springer = false;
    færdigNed = færdig;
    plan = lavPlan(jordMiddel());
    vej(0, kam, mål);
    rejse.flyv({
      fokus: () => { vej(0, kam, mål); return mål; }, op: () => sted().op,
      afstand: kam.distanceTo(mål), retning: kam.clone().sub(mål).normalize(), min: 0.003, max: 3,
      færdig: () => {
        if (fase === 'hen') flyvNed(0, false);
      },
    });
    ændret();
  }

  // Flyv ned fra sekund s0 på turen. glid: kameraet glider først hen dertil fra, hvor det er (man har bladret), og
  // imens står turens ur stille
  const fraKam = new THREE.Vector3(), fraMål = new THREE.Vector3();
  function flyvNed(s0, glid) {
    fase = 'ned';
    const g = glid ? SPRING_TID : 0;
    const T = g + (NED_TID - s0);
    springer = glid;
    if (glid) {
      rejse.kameraPunkt(fraKam);
      fraMål.copy(rejse.fokus);
    }
    vej(NED_TID, kam, mål);
    rejse.flyv({
      fokus: () => { vej(NED_TID, kam, mål); return mål; }, op: () => sted().op, afstand: kam.distanceTo(mål), retning: kam.clone().sub(mål).normalize(),
      min: 0.003, max: 3, tid: T,
      // (rejsen giver e = glat(tiden), så den vendes om: turen ned går med jævn fart i tiden)
      bane: (e, k, m) => {
        const t = tidVed(e) * T;
        vej(s0 + Math.max(0, t - g), k, m);
        springer = t < g;
        if (springer) {
          const w = 1 - glat(t / g);
          k.lerp(fraKam, w);
          m.lerp(fraMål, w);
        }
      },
      færdig: () => {
        if (fase !== 'ned') return;
        springer = false;
        fase = 'lander';
        landT = s0 >= NED_TID ? 1 : 0; // (bladrer man til "landet", lander man med det samme)
        færdigNed?.();
      },
    });
  }

  // Bladr til trin nr (‹ ›, prikkerne og piletasterne): underteksten skifter med det samme, og kameraet glider hen til
  // starten af trinet og fortsætter derfra. "landet" er nede ved jorden.
  function spring(nr) {
    if (fase === null || fase === 'hen' || nr < 0 || nr >= TRIN.length || nr === trinNr) return;
    const varLandet = fase === 'landet';
    sætTrin(nr);
    flyvNed(plan.s[nr], true);
    visFoto();
    if (varLandet) ændret(); // fotoets kontakt forsvinder
  }

  function afbryd() {
    if (fase === null) return;
    fase = null;
    kuppel.visible = false;
    måler.hidden = true;
    foto.hidden = true;
    ændret();
  }

  const p = new THREE.Vector3();
  let hMiddelNu = Infinity; // kameraets højde over middelradius (km)
  // Hvert billede (efter kameraets rejse)
  function opdater(dt) {
    if (fase === null) return;
    rejse.kameraPunkt(p);
    hMiddelNu = p.length() * S - MIDDEL_KM;
    const jord = jordMiddel();
    if (fase === 'lander') {
      landT = ROLIG ? 1 : Math.min(1, landT + dt / LAND_TID);
      hVist = SLUT_KM * (1 - THREE.MathUtils.smootherstep(landT, 0, 1));
      if (landT >= 1) {
        fase = 'landet';
        ændret();
      }
    } else if (fase === 'landet') {
      // Zoomer man selv op, følger måleren kameraet igen
      hVist = Math.max(0, hMiddelNu - jord - SLUT_KM);
    } else hVist = Math.max(0, hMiddelNu - jord);
    // Måleren viser luften, hvor "sonden" er (under landingen længere nede end kameraet)
    visMåler(hVist, jord + hVist);
    tjekTrin(jord + hVist);
    sætKuppel(fase === 'lander' || fase === 'landet' ? Math.min(hMiddelNu, jord + hVist + 0.5) : hMiddelNu);
    if (kuppelFra) kuppel.visible = false;
    kuppel.position.copy(kamera.position);
    kuppel.scale.setScalar(kamera.near * 20);
    visFoto();
  }

  return {
    start,
    afbryd,
    opdater,
    get aktiv() { return fase !== null; },
    get fase() { return fase; },
    get landet() { return fase === 'landet'; },
    // Trinene til bjælken i fænomenskærmen (‹, "Næste: … ›" og "↺ Forfra"), null før kameraet begynder at dale
    bjælke() {
      if (fase === null || fase === 'hen' || trinNr < 0) return null;
      const n = NED_TRIN.find((t) => t.id === TRIN[trinNr + 1]?.[0]);
      return { nr: trinNr, ialt: TRIN.length, næste: n ? (n.knap ?? n.titel) : '', gå: spring, forfra: () => spring(0) };
    },
    // Er kameraet under skyernes top? (så tager venus.js skyerne væk)
    iSkyerne: () => fase !== null && hMiddelNu < SKYER.top,
    // Kontakten "Venera 13's foto" i Indstillinger (kun når man er landet)
    kontakt: () => (fase === 'landet' ? [{ tekst: 'Venera 13\'s foto', til: fotoTil, skift: (til) => { fotoTil = til; visFoto(); } }] : []),
    stop() {
      kuppel.geometry.dispose();
      kuppelMat.dispose();
      boks.remove();
    },
    // Kun til tests: skjul kuplen (for at se jorden bag den)
    udenKuppel(til) { kuppelFra = til; },
    test: () => ({
      fase, trin: TRIN[trinNr]?.[0] ?? null, springer, plan: plan.s.map((x) => +x.toFixed(2)), nedTid: NED_TID, hVist, hMiddel: hMiddelNu, jord: jordMiddel(), måler: !måler.hidden, foto: !foto.hidden,
      tekst: { ...vist }, kuppel: kuppel.visible ? { himmel: kuppelMat.uniforms.uHimmelA.value, dis: kuppelMat.uniforms.uDisA.value } : null,
      vira: VIRA.length,
    }),
  };
}
