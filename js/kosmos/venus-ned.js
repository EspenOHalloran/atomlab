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

import * as THREE from 'three';
import { ROLIG } from '../scene3d.js';
import { MAPPE } from '../solsystem/hent.js';
import { VIRA, SKYER, luftVed, målerTekst } from '../data/luft-venus.js';

const MIDDEL_KM = 6051.8; // VIRA's højder er over middelradius (NSSDC)
const START_KM = 320; // så højt over stedet starter turen ned
const SLUT_KM = 3; // så højt over jorden stopper kameraet (MARGEN i venus.js er 2 km)
const NED_TID = 26; // sekunder fra 320 km til 3 km
const LAND_TID = 2.5; // sekunder: måleren tager det sidste stykke ned
const VINKEL = [55, 12]; // grader under vandret, kameraet kigger ned øverst og nederst
// Højden over jorden (km) gennem turen: knæk, så kameraet er nogle sekunder inde i skyerne (e er 0 til 1, blødt)
const KNÆK = [[0, START_KM], [0.25, 74], [0.5, 44], [0.8, 10], [1, SLUT_KM]];
const FOTO = new URL('venera13-foto.jpg', MAPPE).href;

// Højden over jorden ved e (0 til 1) og vinklen ned mod jorden
export function nedHøjde(e) {
  let i = 0;
  while (i < KNÆK.length - 2 && e > KNÆK[i + 1][0]) i++;
  const [e0, h0] = KNÆK[i], [e1, h1] = KNÆK[i + 1];
  return h0 + (h1 - h0) * THREE.MathUtils.clamp((e - e0) / (e1 - e0), 0, 1);
}
const nedVinkel = (e) => THREE.MathUtils.lerp(VINKEL[0], VINKEL[1], e) * (Math.PI / 180);

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
// overlag: elementet oven på 3D-billedet. ændret(): Indstillinger skal bygges om (fotoets kontakt).
export function lavNedtur({ gruppe, kamera, rejse, S, kortKm, sted, jordKm, overlag, ændret }) {
  let fase = null; // null, 'hen' (flyver hen over stedet), 'ned', 'lander' eller 'landet'
  let landT = 0;
  let fotoTil = true;
  let hVist = START_KM; // den højde, måleren viser (km over jorden)

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
  const tågeFarve = new THREE.Color(0.6, 0.55, 0.45); // inde i skyerne: gullig dis (mørk nok til, at panelerne kan læses)
  const himmelTop = new THREE.Color(0.64, 0.48, 0.29); // lige under skyerne
  const himmelBund = new THREE.Color(0.6, 0.35, 0.14); // nede ved jorden (orange som på Veneras fotos)
  const disTop = new THREE.Color(0.5, 0.34, 0.19);
  const disBund = new THREE.Color(0.42, 0.24, 0.1);
  // Kuplen efter højden h (km over middelradius)
  function sætKuppel(h) {
    const u = kuppelMat.uniforms;
    // (helt tæt ved skyernes top, så skylaget kan skjules bag disen, når kameraet kommer ind i det: iSkyerne)
    const iSky = THREE.MathUtils.smoothstep(h, SKYER.bund - 3, SKYER.bund) * (1 - THREE.MathUtils.smoothstep(h, SKYER.top, SKYER.top + 2.5));
    const under = 1 - THREE.MathUtils.smoothstep(h, SKYER.bund - 3, SKYER.bund);
    kuppel.visible = iSky + under > 0.002;
    if (!kuppel.visible) return;
    const f = THREE.MathUtils.clamp(h / SKYER.bund, 0, 1); // 1 lige under skyerne, 0 ved jorden
    // Himlen: under skyerne helt dækkende (ingen Sol og stjerner), i skyerne lys dis
    u.uHimmel.value.copy(farve.copy(himmelBund).lerp(himmelTop, f)).lerp(tågeFarve, iSky);
    u.uDis.value.copy(farve.copy(disBund).lerp(disTop, f)).lerp(tågeFarve, iSky);
    u.uHimmelA.value = Math.max(iSky * 0.97, under);
    u.uHorisontA.value = Math.max(iSky * 0.95, under * 0.92);
    u.uDisA.value = Math.max(iSky * 0.9, under * THREE.MathUtils.lerp(0.28, 0.62, f));
  }

  // ---------- Måleren og fotoet (oven på 3D-billedet) ----------
  const boks = document.createElement('div');
  boks.className = 'venus-ned';
  boks.innerHTML = `
    <figure class="venus-foto" hidden><img src="${FOTO}" alt="Venera 13's farvefoto af jorden på Venus: flade, lyse sten og mørk jord, og forneden en del af landeren med tænder" draggable="false">
      <figcaption>Venera 13's foto fra jorden på Venus, 1. marts 1982 (USSR/NASA). Forneden ses en del af landeren.</figcaption></figure>
    <div class="venus-maaler" hidden role="group" aria-label="Måleren">
      <div><span>Højde over jorden</span><strong class="vm-hoejde"></strong></div>
      <div><span>Temperatur</span><strong class="vm-temp"></strong></div>
      <div><span>Lufttryk (Jorden: 1 bar)</span><strong class="vm-tryk"></strong></div>
    </div>`;
  const foto = boks.querySelector('.venus-foto');
  const måler = boks.querySelector('.venus-maaler');
  const felter = { højde: boks.querySelector('.vm-hoejde'), temperatur: boks.querySelector('.vm-temp'), tryk: boks.querySelector('.vm-tryk') };
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
  }
  function visFoto() {
    const til = fase === 'landet' && fotoTil;
    if (foto.hidden === til) foto.hidden = !til;
  }

  // ---------- Vejen ned ----------
  const kam = new THREE.Vector3(), mål = new THREE.Vector3();
  // Kameraets plads og det punkt, det kigger på, ved e (systemets retninger, 1 = 1.000 km)
  function vej(e, k, m) {
    const { grund, op, nord } = sted();
    const h = nedHøjde(e);
    k.copy(grund).addScaledVector(op, h / S);
    m.copy(grund).addScaledVector(nord, h / Math.tan(nedVinkel(e)) / S);
  }
  const jordMiddel = () => kortKm + jordKm() - MIDDEL_KM; // jorden ved stedet over middelradius (km)

  function start({ færdig } = {}) {
    fase = 'hen';
    landT = 0;
    fotoTil = true;
    vej(0, kam, mål);
    rejse.flyv({
      fokus: () => { vej(0, kam, mål); return mål; }, op: () => sted().op,
      afstand: kam.distanceTo(mål), retning: kam.clone().sub(mål).normalize(), min: 0.003, max: 3,
      færdig: () => {
        if (fase !== 'hen') return;
        fase = 'ned';
        vej(1, kam, mål);
        const slut = kam.distanceTo(mål);
        rejse.flyv({
          fokus: () => { vej(1, kam, mål); return mål; }, op: () => sted().op, afstand: slut, retning: kam.clone().sub(mål).normalize(),
          min: 0.003, max: 3, tid: NED_TID, bane: vej,
          færdig: () => {
            if (fase !== 'ned') return;
            fase = 'lander';
            landT = 0;
            færdig?.();
          },
        });
      },
    });
    ændret();
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
    sætKuppel(fase === 'lander' || fase === 'landet' ? Math.min(hMiddelNu, jord + hVist + 0.5) : hMiddelNu);
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
    // Er kameraet under skyernes top? (så tager venus.js skyerne væk)
    iSkyerne: () => fase !== null && hMiddelNu < SKYER.top,
    // Kontakten "Venera 13's foto" i Indstillinger (kun når man er landet)
    kontakt: () => (fase === 'landet' ? [{ tekst: 'Venera 13\'s foto', til: fotoTil, skift: (til) => { fotoTil = til; visFoto(); } }] : []),
    stop() {
      kuppel.geometry.dispose();
      kuppelMat.dispose();
      boks.remove();
    },
    test: () => ({
      fase, hVist, hMiddel: hMiddelNu, jord: jordMiddel(), måler: !måler.hidden, foto: !foto.hidden,
      tekst: { ...vist }, kuppel: kuppel.visible ? { himmel: kuppelMat.uniforms.uHimmelA.value, dis: kuppelMat.uniforms.uDisA.value } : null,
      vira: VIRA.length,
    }),
  };
}
