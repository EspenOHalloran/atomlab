// Prototype til Solsystemet (trin 1b i docs/plan-solsystemet.md): Saturn med ringene, Enceladus med fontænerne og
// Titan i sin orange dis. Vises kun med ?saturn i adressen (se FÆNOMENER i js/kosmos.js), indtil Solsystemet bygges.
// Tal fra docs/fakta-solsystemet.md. Grafikken ligger i js/solsystem/, så Solsystemet kan genbruge den.

import * as THREE from 'three';
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

const VISNINGER = {
  saturn: {
    navn: 'Saturn',
    kamera: { retning: [0.55, 0.32, 1], radius: 15 },
    tekst: '<p><b>Saturn:</b> Se skyggen, ringene kaster på Saturn, og skyggen, Saturn kaster på ringene. Tryk "Modlys", og se ringene bagfra med Solen bag Saturn.</p>',
  },
  enceladus: {
    navn: 'Enceladus',
    kamera: { retning: [0.25, -0.35, 1], radius: 5, mål: [0, -1.2, 0] },
    tekst: '<p><b>Enceladus:</b> Fontænerne sprøjter op fra de fire "tigerstriber" ved sydpolen. Tryk "Modlys", og se dem lyse.</p>',
  },
  titan: {
    navn: 'Titan',
    kamera: { retning: [0.4, 0.15, 1], radius: 5.5 },
    tekst: '<p><b>Titan:</b> Den orange dis skjuler overfladen. Tryk "Modlys", og se disen lyse som en ring rundt om månen.</p>',
  },
};

export default {
  id: 'saturn',
  navn: 'Saturn (prototype)',
  ikon: '🪐',
  undertitel: 'Ringene, Enceladus og Titan',
  kamera: VISNINGER.saturn.kamera,
  tal: [
    ['Saturns bredde', 'ca. 120.500 km'],
    ['Tæthed', 'lettere end vand (i snit)'],
    ['Ringenes tykkelse', 'typisk ca. 10 m'],
    ['Kendte måner', 'ca. 285 (marts 2026)'],
  ],
  kort: `
    <p>En prøve på, hvordan Solsystemet kan komme til at se ud. Vælg Saturn, Enceladus eller Titan under "Prøv selv".</p>
    <p><b>Saturn</b> er en kæmpe kugle af gas, mest brint og helium. Den drejer så hurtigt (ca. 10½ time om sig selv), at den er ca. 10 % fladere ved polerne end ved ækvator. Ringene er milliarder af klumper af næsten ren vandis, fra støv til flere meter store, og hver kredser for sig. Fra kant til kant er de ca. 270.000 km, men de er typisk kun ca. 10 m tykke.</p>
    <p><b>Enceladus</b> er en lille måne, kun 504 km bred og dækket af is. Den er det mest hvide sted i solsystemet og kaster ca. 80 % af sollyset tilbage. Under isen er der et hav, og fra sprækker ved sydpolen sprøjter fontæner af vand og is ud i rummet. Rumsonden Cassini fløj gennem dem og fandt salt, organiske stoffer og fosfat.</p>
    <p><b>Titan</b> er Saturns største måne og større end planeten Merkur. Den er den eneste måne med en tyk atmosfære: mest nitrogen og lidt metan, og trykket ved jorden er ca. 1,5 gange Jordens. Nede under disen er der ca. −179 °C og søer og have af flydende metan og ethan. Sonden Huygens landede der 14. januar 2005.</p>`,
  nørd: `
    <p><b>Ringene i tegningen</b> er regnet ud fra, hvor tætte de er i hver afstand (deres optiske dybde): D-ringen er næsten gennemsigtig, B-ringen næsten tæt, og Cassini-delingen (ca. 4.600 km bred) er ikke tom. Grænserne og Encke-mellemrummet passer, men tætheden er omtrentlig, og de mange tynde ringe er lavet af programmet. Set fra den side, Solen ikke skinner på, bliver de tætte ringe mørke, og de tynde lyser, fordi lyset kun kommer igennem dem.</p>
    <p><b>Ærligt talt:</b> Saturns bånd, Enceladus og Titan er tegnet af programmet, for kortene fra NASA og USGS er ikke hentet endnu. Ved Enceladus og Titan er Saturn rykket tættere på, men den har den rigtige størrelse på himlen. Fontænernes partikler er tegnet meget større end de rigtige iskorn, og "Modlys" flytter Solen om bag Saturn eller månen.</p>`,

  lav(gruppe, { kamera, opdaterKnapper, forklaring, verden }) {
    const ring = ringTekstur();
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
    // Enceladus' bane og en lille prik (månen selv er for lille til at ses herfra)
    const bane = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 180 }, (_, i) => new THREE.Vector3(Math.cos(i / 180 * Math.PI * 2), 0, Math.sin(i / 180 * Math.PI * 2)).multiplyScalar(ENCELADUS_AFSTAND / S))),
      new THREE.LineBasicMaterial({ color: 0x7fb4ff, transparent: true, opacity: 0.25 }),
    );
    saturn.g.add(bane);
    const prik = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    saturn.g.add(prik);
    const navnEnceladus = skilt('Enceladus', '#cfe6ff', 0.9);
    saturn.g.add(navnEnceladus);

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

    gruppe.add(saturnVisning, encVisning, titVisning);

    function vælg(v, flyv = false) {
      visning = v;
      saturnVisning.visible = v === 'saturn';
      encVisning.visible = v === 'enceladus';
      titVisning.visible = v === 'titan';
      kamera({ ...VISNINGER[v].kamera, drej: false, flyv: true });
      forklaring(VISNINGER[v].tekst);
      opdaterKnapper();
    }
    vælg('saturn');

    const styring = [
      ...Object.entries(VISNINGER).map(([id, v]) => ({ tekst: v.navn, handling: () => vælg(id), deaktiv: () => visning === id })),
      { tekst: 'Modlys', til: () => modlys, skift: () => { modlys = !modlys; opdaterKnapper(); } },
    ];

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
        // Enceladus' prik på banen (omløbet er ca. 33 timer, her meget hurtigere)
        const v = tid * 0.05;
        prik.position.set(Math.cos(v), 0, Math.sin(v)).multiplyScalar(ENCELADUS_AFSTAND / S);
        navnEnceladus.position.copy(prik.position).add(new THREE.Vector3(0, 1.1, 0));
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
        if (titVisning.visible) titan.sæt(solNu);
      },
      stop() {
        ring.dispose();
      },
    };
  },
};
