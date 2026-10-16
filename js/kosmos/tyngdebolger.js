// Tyngdebølger: to sorte huller kredser om hinanden på rumtidens "gummidug" og sender bølger ud.
// Ude ved kanten står en detektor (som LIGO), hvis arme bliver strakt og presset, når bølgerne kommer forbi.

import * as THREE from 'three';
import { gitterDug, glød, skilt, rullendeGraf, KVALITET } from './faelles.js';

const A0 = 7; // afstanden mellem de sorte huller i starten
const TAU = 9; // sekunder fra start til sammensmeltning
const OMEGA0 = 0.9; // omløbsfart i starten (radianer pr. sekund)
const C = 9; // bølgernes fart (lysets fart i animationen)
const SLUT = TAU * 0.9992; // her er de så tætte, at de smelter sammen
const DETEKTOR = new THREE.Vector3(15, 0, 13);


export default {
  id: 'tyngdebolger',
  navn: 'Tyngdebølger',
  ikon: '〰️',
  undertitel: 'Bølger i selve rumtiden',
  citat: 'wheeler',
  kamera: { retning: [0.15, 0.55, 1], radius: 18 },
  tal: [
    ['Forudsagt', 'Einstein, 1916'],
    ['Første direkte måling', '14. september 2015'],
    ['De sorte huller vejede', '36 og 29 × Solen'],
    ['Armene blev ændret', 'under 1/100 proton'],
  ],
  kort: `
    <p>Når meget tunge ting bevæger sig hurtigt, sender de <b>bølger</b> ud i selve rumtiden, lidt ligesom når man rører rundt i vand. Det kaldes <b>tyngdebølger</b>. Når en bølge kommer forbi, bliver rummet skiftevis strakt og presset en lille smule sammen.</p>
    <p>Her kredser to <b>sorte huller</b> om hinanden. De mister energi til bølgerne, kommer tættere på og drejer hurtigere og hurtigere, til de smelter sammen.</p>
    <p>Ude ved kanten står en <b>detektor</b>. Grafen nederst viser, hvad den måler. Einstein forudsagde tyngdebølgerne i 1916, men troede ikke, man nogensinde ville kunne måle dem. 100 år senere lykkedes det.</p>`,
  nørd: `
    <p><b>Den første måling</b> (14. september 2015) kom fra to sorte huller, der smeltede sammen 1,3 milliarder lysår væk. Bølgerne havde været undervejs, siden livet på Jorden mest bestod af encellede organismer. På 0,2 sekunder blev 3 gange Solens masse lavet om til tyngdebølger (E = mc²). I det øjeblik var det mere kraftfuldt end alle stjerner i det synlige univers tilsammen.</p>
    <p><b>LIGO</b> er to detektorer i USA. Hver har to 4 km lange arme, hvor laserlys løber frem og tilbage. Bølgen ændrede armenes længde med mindre end en hundrededel af en protons bredde. Tre af forskerne bag fik Nobelprisen i 2017.</p>
    <p><b>Chirpet:</b> Signalet stiger i tone og styrke og stopper brat, ligesom et fuglepip. Derfor kalder man det et "chirp". Tryk på knappen og hør det.</p>
    <p><b>Ærligt talt:</b> Bølgerne er tegnet enormt store. Og rumtiden har fire dimensioner (tre i rummet og én i tiden), så en flad dug er kun en tegning af en lille del af det.</p>`,

  lav(gruppe, { effekter, lyd, fase, overlag }) {
    const dug = gitterDug(52, Math.round(35 + 16 * KVALITET), Math.round(90 + 50 * KVALITET));
    gruppe.add(dug.mesh);

    const huller = [0, 1].map(() => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 20), new THREE.MeshBasicMaterial({ color: 0x000000 })));
      g.add(glød(new THREE.Color(1.4, 0.9, 2.2), 3.4, 0.7));
      gruppe.add(g);
      return g;
    });
    const nytHul = new THREE.Group();
    nytHul.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), new THREE.MeshBasicMaterial({ color: 0x000000 })));
    nytHul.add(glød(new THREE.Color(1.4, 0.9, 2.2), 4.6, 0.75));
    nytHul.visible = false;
    gruppe.add(nytHul);

    // Detektoren: to arme i en L-form med spejle for enden
    const detektor = new THREE.Group();
    detektor.position.copy(DETEKTOR);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xc9d3f5, emissive: 0x30406a, roughness: 0.4, metalness: 0.5 });
    const armX = new THREE.Mesh(new THREE.BoxGeometry(5, 0.25, 0.25).translate(2.5, 0, 0), armMat);
    const armZ = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 5).translate(0, 0, -2.5), armMat);
    const laser = glød(new THREE.Color(2.4, 0.6, 0.5), 1.4, 0.9);
    const spejlX = glød(new THREE.Color(2.2, 0.6, 0.5), 0.9, 0.8);
    const spejlZ = glød(new THREE.Color(2.2, 0.6, 0.5), 0.9, 0.8);
    const detSkilt = skilt('Detektor', '#ffd43b', 1.1);
    detSkilt.position.set(1.5, 2, -1.5);
    detektor.add(armX, armZ, laser, spejlX, spejlZ, detSkilt);
    gruppe.add(detektor);
    const tilDetektor = Math.hypot(DETEKTOR.x, DETEKTOR.z);
    const detVinkel = Math.atan2(DETEKTOR.z, DETEKTOR.x);

    const graf = rullendeGraf(overlag(), 'Det, detektoren måler', '#ffd43b', { midt: true });

    let T = 0; // tid siden starten af animationen
    let start = Infinity; // hvornår de begyndte at spirale indad
    let smeltet = Infinity; // hvornår de smeltede sammen
    let trin = 0;
    let chirpet = false;
    let φSlut = 0;

    // Omløbsvinkel og afstand på tidspunktet tid. Efter start skrumper banen (Peters' formel).
    function bane(tid) {
      if (tid < start) return { φ: OMEGA0 * tid, a: A0 };
      const f = Math.max(1 - (tid - start) / TAU, 1e-5);
      return {
        φ: OMEGA0 * start + OMEGA0 * TAU * 1.6 * (1 - Math.pow(f, 0.625)),
        a: Math.max(1, A0 * Math.pow(f, 0.25)),
      };
    }

    // Bølgens styrke og vinkel på et bestemt tidspunkt (før, under og efter sammensmeltningen)
    function kilde(tid) {
      if (tid >= smeltet) {
        const efter = tid - smeltet;
        return { styrke: 2.2 * Math.exp(-efter / 0.45), φ: φSlut + efter * 9 };
      }
      const b = bane(tid);
      return { styrke: Math.min(2.2, 0.45 * Math.pow(A0 / b.a, 1.1)), φ: b.φ };
    }

    // Dugens højde: fordybninger under de sorte huller + bølger, der breder sig ud med lysets fart
    const brønde = [];
    const højde = (x, z) => {
      let y = 0;
      for (const b of brønde) {
        const d2 = (x - b.x) ** 2 + (z - b.z) ** 2;
        y -= b.dybde / Math.sqrt(1 + d2 / (b.bredde * b.bredde));
      }
      const r = Math.hypot(x, z);
      if (r > 1.5) {
        const k = kilde(T - r / C);
        if (k.styrke > 0.001) y += k.styrke * Math.min(1, (r - 1.5) / 3) * (10 / (10 + r)) * Math.cos(2 * Math.atan2(z, x) - 2 * k.φ);
      }
      return y;
    };

    function nulstil() {
      T = 0;
      start = Infinity;
      smeltet = Infinity;
      trin = 0;
      chirpet = false;
      nytHul.visible = false;
      for (const h of huller) h.visible = true;
      graf.nulstil();
      fase(null);
    }

    return {
      styring: [
        {
          tekst: '▶ Lad dem smelte sammen', handling: () => {
            start = T;
            trin = 1;
            fase('De spiraler indad', 'Hver omgang sender bølger ud i rumtiden. Det koster energi, så de sorte huller kommer tættere på hinanden og drejer hurtigere.', [1, 3]);
          }, deaktiv: () => start < Infinity,
        },
        { tekst: '↺ Forfra', handling: nulstil, deaktiv: () => start === Infinity },
        { tekst: '🔊 Hør chirpet', handling: () => lyd.chirp(1.4) },
        { tekst: '📡 Vis detektoren', til: true, skift: (til) => { detektor.visible = til; } },
      ],
      opdater(dt) {
        T += dt;
        if (T < smeltet) {
          const b = bane(T);
          huller.forEach((h, i) => {
            const v = b.φ + i * Math.PI;
            h.position.set(Math.cos(v) * b.a / 2, 0, Math.sin(v) * b.a / 2);
          });
          brønde.length = 0;
          for (const h of huller) brønde.push({ x: h.position.x, z: h.position.z, dybde: 4.5, bredde: 1.3 });
          for (const h of huller) h.position.y = højde(h.position.x, h.position.z) + 0.75;
          if (trin === 1 && !chirpet && T - start > SLUT - 1.4) {
            chirpet = true;
            lyd.chirp(1.4);
          }
          if (trin === 1 && T - start >= SLUT) {
            smeltet = T;
            φSlut = b.φ;
            trin = 2;
            for (const h of huller) h.visible = false;
            nytHul.visible = true;
            effekter.glimt(new THREE.Vector3(0, -3, 0), 12, new THREE.Color(2.2, 1.8, 2.8), 1);
            fase('De smelter sammen', 'På en brøkdel af et sekund bliver de til ét større sort hul. Rumtiden "ringer" som en klokke, man har slået på, og falder så til ro.', [2, 3]);
          }
        } else {
          brønde.length = 0;
          brønde.push({ x: 0, z: 0, dybde: 7.5, bredde: 1.6 });
          nytHul.position.y = højde(0, 0) + 1;
          if (trin === 2 && T - smeltet > 2.5) {
            trin = 3;
            fase('Bølgerne rejser videre', 'De farer ud i universet med lysets fart. Når de når Jorden, er de så svage, at LIGOs 4 km lange arme kun bliver ændret mindre end en hundrededel af en protons bredde.', [3, 3]);
          }
        }
        dug.opdater(højde);

        // Detektoren bliver strakt i den ene retning og presset i den anden
        const k = kilde(T - tilDetektor / C);
        const h = k.styrke * (10 / (10 + tilDetektor)) * Math.cos(2 * detVinkel - 2 * k.φ);
        armX.scale.x = 1 + h * 0.5;
        armZ.scale.z = 1 - h * 0.5;
        spejlX.position.set(5 * armX.scale.x, 0, 0);
        spejlZ.position.set(0, 0, -5 * armZ.scale.z);
        detektor.position.y = højde(DETEKTOR.x, DETEKTOR.z) + 0.4;
        graf.tilføj(Math.max(-1, Math.min(1, h * 1.4)));
        graf.tegn();
      },
    };
  },
};
