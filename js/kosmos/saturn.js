// Prototype til Solsystemet (trin 1b i docs/plan-solsystemet.md): Saturn med ringene, Enceladus med fontænerne og
// Titan i sin orange dis. Vises kun med ?saturn i adressen (se FÆNOMENER i js/kosmos.js), indtil Solsystemet bygges.
// Tal fra docs/fakta-solsystemet.md. Grafikken ligger i js/solsystem/, så Solsystemet kan genbruge den.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG } from '../scene3d.js';
import { skilt } from './faelles.js';
import { ringTekstur, lavRinge, RING_IND, RING_UD } from '../solsystem/ringe.js';
import { lavGasplanet } from '../solsystem/planet.js';
import { lavEnceladus } from '../solsystem/fontaener.js';
import { lavTitan } from '../solsystem/atmosfaere.js';

const SATURN_R = 60268; // km ved ækvator
const SATURN_POL = 54364; // km ved polerne
const HÆLDNING = THREE.MathUtils.degToRad(26.73);
const ENCELADUS_R = 252;
const ENCELADUS_AFSTAND = 238037; // km fra Saturns centrum
const TITAN_R = 2575;
const TITAN_AFSTAND = 1221870;
// Saturns seks store måner: afstand fra Saturns centrum og radius i km og omløbstid i døgn (NASA/JPL).
// Enceladus og Titan kan man besøge. De andre får en kort tekst.
const MÅNER = [
  { navn: 'Mimas', afstand: 185539, r: 198, døgn: 0.942, farve: [0.85, 0.85, 0.85], tekst: 'Den mindste af de store måner, kun 396 km bred. Krateret Herschel er ca. en tredjedel så bredt som hele månen.' },
  { navn: 'Enceladus', afstand: ENCELADUS_AFSTAND, r: ENCELADUS_R, døgn: 1.37, farve: [1, 1, 1], besøg: 'enceladus' },
  { navn: 'Tethys', afstand: 294619, r: 531, døgn: 1.888, farve: [0.92, 0.92, 0.9], tekst: 'Næsten ren is. I snit vejer den næsten lige så lidt som vand.' },
  { navn: 'Dione', afstand: 377396, r: 561, døgn: 2.737, farve: [0.82, 0.82, 0.82], tekst: 'Den har lange, lyse skrænter af is, hvor skorpen er revnet.' },
  { navn: 'Rhea', afstand: 527108, r: 764, døgn: 4.518, farve: [0.8, 0.79, 0.77], tekst: 'Saturns næststørste måne, ca. 1.530 km bred og mest is.' },
  { navn: 'Titan', afstand: TITAN_AFSTAND, r: TITAN_R, døgn: 15.945, farve: [0.9, 0.62, 0.3], besøg: 'titan' },
];

// Billederne (se billeder/solsystem/KILDER.md): pc henter -4k.jpg, tablet, telefon og tests -2k.jpg
const STØRRELSE = LAV_KVALITET || TEST_HURTIG ? '2k' : '4k';
const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const henter = new THREE.TextureLoader();
// farve: billedet er et farvefoto (sRGB). Kortene over Enceladus og Titan er målinger i gråtoner og bruges, som de er.
function hent(navn, færdig, farve = true) {
  henter.load(new URL(navn, MAPPE).href, (t) => {
    t.colorSpace = farve ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    færdig(t);
  }, undefined, () => { /* mangler billedet, bruges det tegnede */ });
}

// Månerne ved Saturn: en enkel kugle med lys fra Solen (de er for små her til at se detaljer)
function lavMåneMateriale(farve) {
  return new THREE.ShaderMaterial({
    uniforms: { uSol: { value: new THREE.Vector3(1, 0, 0) }, uFarve: { value: new THREE.Vector3(...farve) } },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      void main() { vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSol, uFarve;
      varying vec3 vN;
      void main() { gl_FragColor = vec4(uFarve * (0.06 + 0.9 * max(dot(normalize(vN), uSol), 0.0)), 1.0); }`,
  });
}

const VISNINGER = {
  saturn: {
    navn: 'Saturn',
    kamera: { retning: [0.55, 0.32, 1], radius: 15 },
    tekst: '<p><b>Saturn:</b> Se skyggen, ringene kaster på Saturn, og skyggen, Saturn kaster på ringene. Tryk "Modlys", og se ringene bagfra med Solen bag Saturn.</p>',
  },
  maaner: {
    navn: 'Månerne',
    kamera: { retning: [0.15, 0.6, 1], radius: 135 },
    tekst: '<p><b>Saturn og månerne:</b> Saturn har over 280 kendte måner. Her er de seks store. Tryk på en måne for at se den. Enceladus og Titan kan du besøge.</p>',
  },
  enceladus: {
    navn: 'Enceladus',
    kamera: { retning: [0.25, -0.35, 1], radius: 5, mål: [0, -1.2, 0] },
    tekst: '<p><b>Enceladus:</b> Fontænerne sprøjter op fra de fire "tigerstriber" ved sydpolen. Tryk "Modlys", og se dem lyse.</p>',
  },
  titan: {
    navn: 'Titan',
    kamera: { retning: [0.4, 0.15, 1], radius: 5.5 },
    tekst: '<p><b>Titan:</b> Den orange dis skjuler overfladen. Tryk "Under disen" for at se den i infrarødt lys, eller "Modlys", og se disen lyse som en ring rundt om månen.</p>',
  },
};

export default {
  id: 'saturn',
  navn: 'Saturn (prototype)',
  ikon: '🪐',
  undertitel: 'Ringene og de store måner',
  kamera: VISNINGER.saturn.kamera,
  tal: [
    ['Saturns bredde', 'ca. 120.500 km'],
    ['Tæthed', 'lettere end vand (i snit)'],
    ['Ringenes tykkelse', 'typisk ca. 10 m'],
    ['Kendte måner', 'ca. 285 (marts 2026)'],
  ],
  kort: `
    <p>En prøve på, hvordan Solsystemet kan komme til at se ud: et besøg hos Saturn og dens måner. Vælg under "Prøv selv", eller tryk på en måne. Drej med fingeren, musen eller piletasterne.</p>
    <p><b>Saturn</b> er en kæmpe kugle af gas, mest brint og helium. Den drejer så hurtigt (ca. 10½ time om sig selv), at den er ca. 10 % fladere ved polerne end ved ækvator. Ringene er milliarder af klumper af næsten ren vandis, fra støv til flere meter store, og hver kredser for sig. Fra kant til kant er de ca. 270.000 km, men de er typisk kun ca. 10 m tykke.</p>
    <p><b>Enceladus</b> er en lille måne, kun 504 km bred og dækket af is. Den er det mest hvide sted i solsystemet og kaster ca. 80 % af sollyset tilbage. Under isen er der et hav, og fra sprækker ved sydpolen sprøjter fontæner af vand og is ud i rummet. Rumsonden Cassini fløj gennem dem og fandt salt, organiske stoffer og fosfat.</p>
    <p><b>Titan</b> er Saturns største måne og større end planeten Merkur. Den er den eneste måne med en tyk atmosfære: mest nitrogen og lidt metan, og trykket ved jorden er ca. 1,5 gange Jordens. Nede under disen er der ca. −179 °C og søer og have af flydende metan og ethan. Sonden Huygens landede der 14. januar 2005.</p>`,
  nørd: `
    <p><b>Ringene i tegningen</b> er regnet ud fra, hvor tætte de er i hver afstand (deres optiske dybde): D-ringen er næsten gennemsigtig, B-ringen næsten tæt, og Cassini-delingen (ca. 4.600 km bred) er ikke tom. Grænserne og Encke-mellemrummet passer, men tætheden er omtrentlig, og de mange tynde ringe er lavet af programmet. Set fra den side, Solen ikke skinner på, bliver de tætte ringe mørke, og de tynde lyser, fordi lyset kun kommer igennem dem.</p>
    <p><b>Billederne:</b> Enceladus er Cassinis kort (NASA/JPL/Space Science Institute, via USGS). Titans overflade er Cassinis kort i nær-infrarødt lys, hvor man kan se gennem disen (PIA19658). Saturns kort og ringenes farver er fra Solar System Scope (CC BY 4.0), som bygger på NASA's billeder.</p>
    <p><b>Ærligt talt:</b> Ringenes farver er lagt på de rigtige grænser, men de mange tynde ringe er omtrentlige. Ved Enceladus og Titan er Saturn rykket tættere på, men den har den rigtige størrelse på himlen. Månerne vender samme side mod Saturn, ligesom Månen mod Jorden. Ved Saturn er månerne tegnet større, end de er, så man kan se dem, og de kredser meget hurtigere, men i det rigtige forhold (Mimas kommer rundt på under et døgn, Titan på ca. 16 døgn). Fontænernes partikler er tegnet meget større end de rigtige iskorn, og "Modlys" flytter Solen om bag Saturn eller månen. "Under disen" viser Titan, som et kamera med infrarødt lys ser den. Med øjnene ser man kun den orange dis.</p>`,

  lav(gruppe, { kamera, opdaterKnapper, forklaring, verden }) {
    const ring = ringTekstur();
    const gammelMax = verden.styring.maxDistance;
    verden.styring.maxDistance = 450; // så man kan se hele Titans bane
    let visning = 'saturn';
    let modlys = false;
    const sol = new THREE.Vector3(1, 0.05, 0.55).normalize(); // Solens retning (lyset kommer herfra)
    const solNu = new THREE.Vector3();

    // ---------- Saturn med ringene (1 enhed = 10.000 km) ----------
    const S = 10000;
    const lavSaturn = (skala) => {
      const g = new THREE.Group();
      g.rotation.z = -HÆLDNING; // aksen hælder 26,7° (her mod Solen, så ringene er belyst fra oven)
      const planet = lavGasplanet({ skala, radius: SATURN_R, polRadius: SATURN_POL, ringTekstur: ring, ringInd: RING_IND, ringUd: RING_UD });
      const ringe = lavRinge({ skala, tekstur: ring, planetRadius: SATURN_R, flad: SATURN_POL / SATURN_R });
      g.add(planet.mesh, ringe.mesh);
      return { g, planet, ringe };
    };
    const saturn = lavSaturn(S);
    const saturnVisning = new THREE.Group();
    saturnVisning.add(saturn.g);
    // De store måner: en bane, en lille kugle og et navn. De kredser i ringenes plan.
    const måneGeo = new THREE.SphereGeometry(1, 24, 16);
    const måner = MÅNER.map((m, i) => {
      const bane = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(Array.from({ length: 240 }, (_, j) => new THREE.Vector3(Math.cos(j / 240 * Math.PI * 2), 0, Math.sin(j / 240 * Math.PI * 2)).multiplyScalar(m.afstand / S))),
        new THREE.LineBasicMaterial({ color: m.besøg ? 0x7fb4ff : 0x8a96b8, transparent: true, opacity: m.besøg ? 0.3 : 0.18 }),
      );
      const kugle = new THREE.Mesh(måneGeo, lavMåneMateriale(m.farve));
      const navn = skilt(m.navn, m.besøg ? '#cfe6ff' : '#b8c2dc', 1);
      saturn.g.add(bane, kugle, navn);
      return { ...m, kugle, etiket: navn, fase: i * 1.7 };
    });

    // ---------- Enceladus tæt på (radius 2), med Saturn i baggrunden i den rigtige størrelse på himlen ----------
    const encVisning = new THREE.Group();
    const E_R = 2;
    const enceladus = lavEnceladus(E_R);
    encVisning.add(enceladus.gruppe);
    const kmE = ENCELADUS_R / E_R;
    const bagE = lavSaturn(1);
    const D_E = 170; // Saturn rykket tættere på, men med den rigtige vinkel på himlen
    bagE.g.scale.setScalar((D_E / (ENCELADUS_AFSTAND / kmE)) / kmE);
    bagE.g.position.set(-0.75, 0, -0.66).normalize().multiplyScalar(D_E);
    encVisning.add(bagE.g);
    enceladus.gruppe.rotation.y = Math.atan2(-bagE.g.position.z, bagE.g.position.x);

    // ---------- Titan tæt på (radius 2,6 med disen) ----------
    const titVisning = new THREE.Group();
    const T_R = 2.6;
    const titan = lavTitan(T_R, TITAN_R / T_R);
    titVisning.add(titan.gruppe);
    const kmT = TITAN_R / T_R;
    const bagT = lavSaturn(1);
    const D_T = 200;
    bagT.g.scale.setScalar((D_T / (TITAN_AFSTAND / kmT)) / kmT);
    bagT.g.position.set(-0.8, 0.05, -0.6).normalize().multiplyScalar(D_T);
    titVisning.add(bagT.g);
    titan.gruppe.rotation.y = Math.atan2(-bagT.g.position.z, bagT.g.position.x);

    // De rigtige billeder (kommer lidt efter, indtil da ses det tegnede)
    hent(`saturn-${STØRRELSE}.jpg`, (t) => { for (const s of [saturn, bagE, bagT]) s.planet.sætKort(t); });
    hent('saturn-ringe.png', (t) => { for (const s of [saturn, bagE, bagT]) s.ringe.sætFarve(t); });
    hent(`enceladus-${STØRRELSE}.jpg`, (t) => enceladus.sætKort(t), false);
    hent(`titan-${STØRRELSE}.jpg`, (t) => titan.sætKort(t), false);

    gruppe.add(saturnVisning, encVisning, titVisning);

    // Tryk på en måne (eller dens navn): Enceladus og Titan besøges, de andre får en kort tekst
    function vælgMåne(m) {
      if (m.besøg) vælg(m.besøg);
      else forklaring(`<p><b>${m.navn}:</b> ${m.tekst} (Et besøg kommer, når Solsystemet bliver bygget.)</p>`);
    }
    const lærred = verden.renderer.domElement;
    const stråle = new THREE.Raycaster();
    const peg = new THREE.Vector2();
    let ned = null;
    const vedNed = (h) => { ned = { x: h.clientX, y: h.clientY }; };
    const vedOp = (h) => {
      if (!ned || !saturnVisning.visible || Math.hypot(h.clientX - ned.x, h.clientY - ned.y) > 8) return;
      const r = lærred.getBoundingClientRect();
      peg.set(((h.clientX - r.left) / r.width) * 2 - 1, -((h.clientY - r.top) / r.height) * 2 + 1);
      stråle.setFromCamera(peg, verden.kamera);
      // Den måne, der er tættest på strålen (inden for et lille stykke, så de er lette at ramme med en finger)
      let bedst = null;
      for (const m of måner) {
        m.kugle.getWorldPosition(hjælp);
        const afstand = stråle.ray.distanceToPoint(hjælp);
        const grænse = Math.max(m.kugle.scale.x * 2.2, hjælp.distanceTo(verden.kamera.position) * 0.03);
        if (afstand < grænse && (!bedst || afstand < bedst.afstand)) bedst = { m, afstand };
      }
      if (bedst) vælgMåne(bedst.m);
    };
    lærred.addEventListener('pointerdown', vedNed);
    lærred.addEventListener('pointerup', vedOp);

    let ir = false;
    const styring = [];
    const lavKnapper = () => {
      styring.length = 0;
      for (const [id, vis] of Object.entries(VISNINGER)) styring.push({ tekst: vis.navn, handling: () => vælg(id), deaktiv: () => visning === id });
      styring.push({ tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } });
      if (visning === 'titan') styring.push({ tekst: 'Under disen (infrarødt)', til: ir, skift: (til) => { ir = til; titan.sætIR(til); } });
    };

    function vælg(v, flyv = false) {
      visning = v;
      saturnVisning.visible = v === 'saturn' || v === 'maaner';
      encVisning.visible = v === 'enceladus';
      titVisning.visible = v === 'titan';
      kamera({ ...VISNINGER[v].kamera, drej: false, flyv: true });
      if (v === 'maaner') verden.målAfstand = 380; // længere væk end normalt, så Titans bane er med
      forklaring(VISNINGER[v].tekst);
      lavKnapper();
      opdaterKnapper();
    }
    vælg('saturn');


    const kamPos = new THREE.Vector3();
    const op = new THREE.Vector3(0, 1, 0);
    const hjælp = new THREE.Vector3();
    const normal = new THREE.Vector3();
    return {
      styring,
      opdater(dt, tid) {
        // I modlys står Solen næsten lige bag månen, set fra kameraet
        if (modlys) {
          kamPos.copy(verden.kamera.position).normalize();
          solNu.copy(kamPos).multiplyScalar(-1).addScaledVector(op, 0.22).normalize();
        } else solNu.copy(sol);
        saturn.planet.mesh.rotation.y = tid * 0.08;
        // Månerne kredser (meget hurtigere end i virkeligheden, men i det rigtige forhold) og tegnes større, jo længere
        // væk kameraet er, så de altid kan ses. Navnene står over dem.
        if (saturnVisning.visible) {
          const afstand = verden.kamera.position.length();
          for (const m of måner) {
            const v = m.fase + (tid * 0.069) / m.døgn;
            m.kugle.position.set(Math.cos(v), 0, -Math.sin(v)).multiplyScalar(m.afstand / S);
            const r = Math.max(m.r / S, afstand * 0.0045);
            m.kugle.scale.setScalar(r);
            m.kugle.material.uniforms.uSol.value.copy(solNu);
            const str = afstand * 0.018;
            m.etiket.scale.set((m.etiket.scale.x / m.etiket.scale.y) * str, str, 1);
            m.etiket.position.copy(m.kugle.position).add(hjælp.set(0, r + str * 0.8, 0));
          }
        }
        // Saturn i baggrunden: ringenes plan går (næsten) gennem kameraet, for månerne kredser i ringenes plan
        for (const [s, hæld] of [[bagE, 0], [bagT, 0.006]]) { // Titans bane hælder ca. 0,35° (0,006 rad)
          if (!s.g.parent.visible) continue;
          hjælp.copy(verden.kamera.position).sub(s.g.position).normalize();
          normal.copy(op).addScaledVector(hjælp, -hjælp.dot(op)).normalize();
          normal.addScaledVector(hjælp, hæld).normalize();
          s.g.quaternion.setFromUnitVectors(op, normal);
        }
        for (const s of [saturn, bagE, bagT]) {
          if (!s.g.parent.visible) continue;
          const { midt, akse } = s.planet.sæt(solNu, tid);
          s.ringe.sæt(solNu, midt, akse);
        }
        if (encVisning.visible) enceladus.sæt(solNu, tid);
        if (titVisning.visible) titan.sæt(solNu, dt);
      },
      stop() {
        ring.dispose();
        verden.styring.maxDistance = gammelMax;
        lærred.removeEventListener('pointerdown', vedNed);
        lærred.removeEventListener('pointerup', vedOp);
      },
      // Kun til tests: hvor en måne står på skærmen (i pixels), så testen kan trykke på den
      test: {
        månePlads(navn) {
          const m = måner.find((x) => x.navn === navn);
          m.kugle.getWorldPosition(hjælp).project(verden.kamera);
          const r = lærred.getBoundingClientRect();
          return { x: r.left + ((hjælp.x + 1) / 2) * r.width, y: r.top + ((1 - hjælp.y) / 2) * r.height };
        },
        visning: () => visning,
      },
    };
  },
};
