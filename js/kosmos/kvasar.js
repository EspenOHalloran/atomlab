// Kvasar: et kæmpe sort hul midt i en galakse, der spiser så meget gas, at det lyser stærkere end hele galaksen.
// To stråler (jets) skyder ud med næsten lysets fart.

import * as THREE from 'three';
import { glød, prikSky, toningTekstur, skilt, KVALITET } from './faelles.js';

const GALAKSE_R = 22;
const JET_LÆNGDE = 42;

// Et tilfældigt tal med "klokkeform" (de fleste tæt på 0)
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

export default {
  id: 'kvasar',
  navn: 'Kvasar',
  ikon: '🌟',
  undertitel: 'Et sort hul, der lyser stærkere end en hel galakse',
  citat: 'einsteinForstå',
  kamera: { retning: [0.3, 0.55, 1], radius: 21 },
  tal: [
    ['Første kvasar, man forstod', '3C 273 (1963)'],
    ['Afstand til 3C 273', 'ca. 2 mia. lysår'],
    ['3C 273 lyser som', 'ca. 4 billioner sole'],
    ['Det sorte hul vejer', 'millioner til milliarder × Solen'],
  ],
  kort: `
    <p>En <b>kvasar</b> er et kæmpe sort hul i midten af en galakse, der spiser enorme mængder gas. Gassen hvirvler rundt og bliver så varm, at den lyser stærkere end alle galaksens milliarder af stjerner tilsammen.</p>
    <p>Hos nogle kvasarer bliver noget af gassen skudt ud i to <b>stråler</b> (jets) med næsten lysets fart. De kan blive længere end hele galaksen. Strålerne kommer ikke ud af selve det sorte hul. De bliver slynget ud lige uden for det af magnetfelter, som skiven og det snurrende sorte hul vrider op.</p>
    <p>Vores egen galakse, Mælkevejen, har også et kæmpe sort hul i midten. Men det får næsten ingen mad, så det lyser kun meget svagt. Prøv at slukke og tænde kvasaren, og giv det sorte hul mad.</p>`,
  nørd: `
    <p><b>Navnet</b> kommer af "kvasistellar", som betyder "næsten som en stjerne". I et teleskop ligner en kvasar nemlig bare en prik. I 1963 opdagede Maarten Schmidt, at lyset fra kvasaren 3C 273 var forskudt mod rødt, så lyset måtte have været ca. 2 milliarder år undervejs. Når den alligevel kan ses herfra, må den lyse helt utroligt kraftigt.</p>
    <p><b>Mere effektivt end fusion:</b> Når Solen laver helium af hydrogen, bliver 0,7 % af massen til energi (se Stjerneovnen). Gas, der falder ind mod et sort hul, kan afgive over 10 % af sin masse som energi. Det er derfor, kvasarer kan lyse så kraftigt.</p>
    <p><b>Hvorfor stråler?</b> Gassen i skiven er så varm, at den er plasma, og plasma trækker magnetfelter med sig. Når skiven og det snurrende sorte hul drejer rundt, bliver magnetfeltet vredet op som en proptrækker langs aksen. Noget af plasmaet bliver slynget ud langs feltet med næsten lysets fart og klemt sammen til to smalle stråler, én op og én ned. Energien kan komme fra det sorte huls egen drejning. Tryk "Vis magnetfeltet" for at se det.</p>
    <p><b>Det ved man ikke helt:</b> Forskerne er ikke sikre på alle detaljer, og ingen ved præcis, hvorfor kun ca. hver tiende kvasar har kraftige stråler. Men i 2021 viste Event Horizon Telescope mønsteret i magnetfeltet lige uden for det sorte hul i galaksen M87, som har samme slags stråler, og det passer med forklaringen.</p>
    <p><b>At kigge tilbage i tiden:</b> Lys er længe om at nå frem. De fjerneste kvasarer ser vi, som de så ud for over 13 milliarder år siden, da universet var ungt og galakserne fulde af gas. Lyset sendte de ud, længe før Jorden fandtes.</p>
    <p><b>Ærligt talt:</b> Det sorte hul, skiven og strålerne er tegnet enormt store i forhold til galaksen. I virkeligheden er hele det lysende område ikke meget større end vores solsystem, mens galaksen er 100.000 lysår bred.</p>`,

  lav(gruppe, { kamera, opdaterKnapper, verden, fase }) {
    // Galaksen: en central kugle af gamle, gule stjerner og to spiralarme med unge, blå stjerner
    const N = Math.round(7000 * KVALITET);
    const r0 = new Float32Array(N);
    const v0 = new Float32Array(N);
    const y0 = new Float32Array(N);
    const galakse = prikSky(N, 0.3, (i, c) => {
      if (i < N * 0.22) {
        // den centrale kugle
        const r = Math.abs(gauss()) * 3.2 + 0.4;
        r0[i] = r;
        v0[i] = Math.random() * Math.PI * 2;
        y0[i] = gauss() * 1.4 * Math.max(0.3, 1 - r / 5);
        c.setRGB(1.3, 1.05, 0.65).multiplyScalar(0.7);
      } else {
        const arm = i % 2;
        const r = 3 + Math.pow(Math.random(), 0.8) * (GALAKSE_R - 3);
        r0[i] = r;
        // To arme, men en del af stjernerne ligger spredt i hele skiven
        v0[i] = Math.random() < 0.35 ? Math.random() * Math.PI * 2 : arm * Math.PI + Math.log(r / 3) / Math.tan(0.38) + gauss() * 0.75;
        y0[i] = gauss() * 0.3;
        const k = Math.random();
        if (k < 0.05) c.setRGB(1.8, 0.55, 1.0); // lyserøde stjernetåger, hvor nye stjerner bliver født
        else if (k < 0.55) c.setRGB(0.85, 1.0, 1.5);
        else c.setRGB(1.2, 1.05, 0.85);
        c.multiplyScalar(0.55 + 0.45 * (1 - r / GALAKSE_R));
      }
    });
    gruppe.add(galakse);
    // Et blødt skær af de mange stjerner, man ikke kan se hver for sig
    const skær = new THREE.Mesh(
      new THREE.PlaneGeometry(GALAKSE_R * 2.3, GALAKSE_R * 2.3),
      new THREE.MeshBasicMaterial({ map: galakseTekstur(), color: new THREE.Color(0.9, 0.9, 1.1), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    );
    skær.rotation.x = -Math.PI / 2;
    gruppe.add(skær);
    const gPos = galakse.geometry.attributes.position.array;

    // Kernen: skiven og det blændende lys
    const skive = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 2.4, 96, 1),
      new THREE.MeshBasicMaterial({ map: skiveTekstur(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    );
    skive.rotation.x = -Math.PI / 2;
    const hul = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    const kerneLys = glød(new THREE.Color(2.6, 2.4, 3.0), 6, 1);
    const blænd = glød(new THREE.Color(1.6, 1.5, 2.0), 30, 0.45);
    gruppe.add(skive, hul, kerneLys, blænd);

    // Strålerne: prikker, der suser ud langs aksen, og et svagt skær
    const NJ = Math.round(900 * KVALITET);
    const jT = new Float32Array(NJ);
    const jSide = new Int8Array(NJ);
    const jFase = new Float32Array(NJ);
    for (let i = 0; i < NJ; i++) {
      jT[i] = Math.random();
      jSide[i] = i % 2 ? 1 : -1;
      jFase[i] = Math.random() * Math.PI * 2;
    }
    const jets = prikSky(NJ, 0.35, (i, c) => c.setRGB(0.75, 0.95, 2.4));
    gruppe.add(jets);
    const jPos = jets.geometry.attributes.position.array;
    const jFarve = jets.geometry.attributes.color.array;
    const jetMat = new THREE.MeshBasicMaterial({ map: toningTekstur(), color: new THREE.Color(0.4, 0.55, 1.5), transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    for (const side of [1, -1]) {
      const kegle = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 0.05, JET_LÆNGDE, 20, 1, true), jetMat);
      kegle.position.y = (side * JET_LÆNGDE) / 2;
      if (side < 0) kegle.rotation.x = Math.PI;
      gruppe.add(kegle);
    }

    // Magnetfeltet: feltlinjer, der starter i skiven og bliver vredet op som en proptrækker langs aksen.
    // Længere ude bliver proptrækkeren smallere og klemmer strålen sammen. Det hele drejer med skiven.
    const felt = new THREE.Group();
    const feltMat = new THREE.LineBasicMaterial({ color: new THREE.Color(0.45, 1.6, 1.3), transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending });
    const FELT_HØJDE = 16;
    for (const side of [1, -1]) {
      for (let j = 0; j < 6; j++) {
        const r0 = 0.5 + (j % 3) * 0.45; // hvor i skiven linjen starter
        const punkter = [];
        for (let k = 0; k <= 160; k++) {
          const s = k / 160;
          const r = 0.22 + (r0 - 0.22) * Math.exp(-s * 5);
          const v = (j / 6) * Math.PI * 2 - s * Math.PI * 2 * 6; // længere ude halter linjen efter skiven (den bliver vredet op)
          punkter.push(new THREE.Vector3(Math.cos(v) * r, side * (0.05 + s * FELT_HØJDE), Math.sin(v) * r));
        }
        felt.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(punkter), feltMat));
      }
    }
    const feltSkilt = skilt('Magnetfelt', '#7ff0d8', 0.3);
    feltSkilt.position.set(1.1, 2.3, 0);
    felt.add(feltSkilt);
    felt.visible = false;
    gruppe.add(felt);

    // Mad: en sky af gas, der spiraler ind mod hullet
    const NM = Math.round(400 * KVALITET);
    const mR = new Float32Array(NM);
    const mV = new Float32Array(NM);
    const mY = new Float32Array(NM);
    const mad = prikSky(NM, 0.4, (i, c) => c.setRGB(1.8, 1.0, 0.5));
    mad.visible = false;
    gruppe.add(mad);
    const mPos = mad.geometry.attributes.position.array;

    let tændt = true;
    let styrke = 1; // hvor kraftigt kvasaren lyser lige nu (glider mod 1 eller 0)
    let ekstra = 0; // ekstra lys, når den får mad
    let tid = 0;

    const zoom = (til) => kamera(til ? { retning: [0.3, 0.45, 1], radius: 3.4, flyv: false } : { retning: [0.3, 0.55, 1], radius: 21, flyv: false });
    const styring = [
        { tekst: '💡 Kvasaren er tændt', til: true, skift: (til) => { tændt = til; } },
        {
          tekst: '🍽️ Giv det sorte hul mad', handling: () => {
            const start = Math.random() * Math.PI * 2;
            for (let i = 0; i < NM; i++) {
              mR[i] = 11 + Math.random() * 3;
              mV[i] = start + Math.random() * 0.9;
              mY[i] = gauss() * 0.4;
            }
            mad.visible = true;
            if (!tændt) {
              tændt = true;
              styring[0].til = true;
              opdaterKnapper();
            }
          }, deaktiv: () => mad.visible,
        },
        { tekst: '🔍 Zoom ind i kernen', til: false, skift: (til) => zoom(til) },
        {
          // Feltet kan kun ses tæt på, så knappen zoomer også ind
          tekst: '🧲 Vis magnetfeltet', til: false, skift: (til) => {
            felt.visible = til;
            if (til) {
              fase('Magnetfeltet', 'Skiven og det snurrende sorte hul vrider magnetfeltet op som en proptrækker. Langs den bliver plasma slynget ud i to smalle stråler.');
              if (!styring[2].til) {
                styring[2].til = true;
                zoom(true);
                opdaterKnapper();
              }
            } else fase(null);
          },
        },
    ];

    return {
      styring,
      opdater(dt) {
        tid += dt;
        // Galaksen drejer (stjernerne har næsten samme fart, så de inderste når flere omgange)
        for (let i = 0; i < N; i++) {
          const r = r0[i];
          const v = v0[i] + (tid * 0.5) / r;
          gPos[i * 3] = Math.cos(v) * r;
          gPos[i * 3 + 1] = y0[i];
          gPos[i * 3 + 2] = Math.sin(v) * r;
        }
        galakse.geometry.attributes.position.needsUpdate = true;

        // Tænd og sluk glidende
        styrke += ((tændt ? 1 : 0) - styrke) * Math.min(1, dt * 2);
        ekstra = Math.max(0, ekstra - dt * 0.15);
        const lys = styrke + ekstra;
        // Skæret bliver mindre, når man zoomer ind, så man kan se skiven og hullet
        const nær = Math.min(1, Math.max(0.1, (verden.kamera.position.length() - 12) / 60));
        kerneLys.material.opacity = (0.15 + 0.85 * Math.min(1, lys)) * (0.35 + 0.65 * nær);
        kerneLys.scale.setScalar((2 + 4 * lys) * nær);
        blænd.material.opacity = 0.4 * lys * nær;
        blænd.scale.setScalar((30 + 20 * ekstra) * nær);
        skær.rotation.z = -tid * 0.02;
        // Helt tæt på skjuler vi galaksens stjerner, så man kan se kernen
        const galakseSynlig = Math.min(1, Math.max(0, (nær - 0.15) / 0.3));
        skær.material.opacity = galakseSynlig;
        galakse.material.opacity = galakseSynlig;
        galakse.visible = skær.visible = galakseSynlig > 0.01;
        skive.material.opacity = 0.25 + 0.75 * Math.min(1, lys);
        skive.rotation.z += dt * 1.5;
        if (felt.visible) felt.rotation.y += dt * 1.5; // drejer med skiven, så proptrækkeren ser ud til at skrue sig udad
        feltMat.opacity = 0.3 + 0.45 * Math.min(1, lys);
        jetMat.opacity = 0.3 * Math.min(1, lys);

        // Strålerne: prikkerne suser udad og drejer lidt i en spiral
        for (let i = 0; i < NJ; i++) {
          jT[i] += dt * 0.55;
          if (jT[i] > 1) jT[i] -= 1;
          const t = jT[i];
          const h = 0.3 + t * JET_LÆNGDE;
          const bred = 0.05 + t * 1.4;
          const v = jFase[i] + t * 12;
          jPos[i * 3] = Math.cos(v) * bred * 0.5;
          jPos[i * 3 + 1] = jSide[i] * h;
          jPos[i * 3 + 2] = Math.sin(v) * bred * 0.5;
          const f = Math.min(1, lys) * (1 - t) * 1.2;
          jFarve[i * 3] = 0.75 * f;
          jFarve[i * 3 + 1] = 0.95 * f;
          jFarve[i * 3 + 2] = 2.4 * f;
        }
        jets.geometry.attributes.position.needsUpdate = true;
        jets.geometry.attributes.color.needsUpdate = true;

        // Mad: spiraler ind hurtigere og hurtigere
        if (mad.visible) {
          let tilbage = 0;
          for (let i = 0; i < NM; i++) {
            if (mR[i] <= 0) continue;
            mR[i] -= dt * (0.6 + 6 / mR[i]);
            mV[i] += dt * 3 / Math.sqrt(Math.max(0.3, mR[i]));
            if (mR[i] < 0.35) {
              mR[i] = 0;
              ekstra = Math.min(1.5, ekstra + 0.006);
              mPos[i * 3 + 1] = 9999;
              continue;
            }
            tilbage++;
            mPos[i * 3] = Math.cos(mV[i]) * mR[i];
            mPos[i * 3 + 1] = mY[i] * Math.min(1, mR[i] / 4);
            mPos[i * 3 + 2] = Math.sin(mV[i]) * mR[i];
          }
          mad.geometry.attributes.position.needsUpdate = true;
          if (tilbage === 0) mad.visible = false;
        }
      },
    };
  },
};

// Den lille skive om hullet: hvidglødende inderst og orange yderst
function skiveTekstur() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 128 * (0.3 / 2.4), 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,225,170,0.9)');
  grad.addColorStop(0.6, 'rgba(255,140,60,0.45)');
  grad.addColorStop(1, 'rgba(200,60,30,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Galaksens skær: mange bløde prikker langs to spiralarme og en lys midte
function galakseTekstur() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  const m = 256;
  const skala = 256 / (GALAKSE_R * 1.15);
  const midte = g.createRadialGradient(m, m, 0, m, m, 70);
  midte.addColorStop(0, 'rgba(255,230,180,0.9)');
  midte.addColorStop(1, 'rgba(255,200,140,0)');
  g.fillStyle = midte;
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {
    const arm = i % 2;
    const r = 3 + Math.pow(Math.random(), 0.9) * (GALAKSE_R - 3);
    const v = arm * Math.PI + Math.log(r / 3) / Math.tan(0.38) + gauss() * 0.6;
    const x = m + Math.cos(v) * r * skala, y = m + Math.sin(v) * r * skala;
    const str = 4 + Math.random() * 10;
    const prik = g.createRadialGradient(x, y, 0, x, y, str);
    prik.addColorStop(0, `rgba(150,180,255,${0.05 + 0.06 * (1 - r / GALAKSE_R)})`);
    prik.addColorStop(1, 'rgba(150,180,255,0)');
    g.fillStyle = prik;
    g.fillRect(x - str, y - str, str * 2, str * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
