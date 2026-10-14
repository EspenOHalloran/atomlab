// Pulsar: en neutronstjerne, der drejer rundt og sender to stråler ud fra sine magnetiske poler.
// Ligesom et fyrtårn: Hver gang en stråle fejer forbi Jorden, måler vi et blink.

import * as THREE from 'three';
import { glød, dipolLinjer, skilt, rullendeGraf } from './faelles.js';

const RADIUS = 1.2;
const HÆLD = (62 * Math.PI) / 180; // vinklen mellem drejeaksen og magnetfeltets akse
const STRÅLE_LÆNGDE = 16;
const STRÅLE_BREDDE = (7 * Math.PI) / 180; // hvor bred strålen er, set fra Jorden
const OP = new THREE.Vector3(0, 1, 0);

export default {
  id: 'pulsar',
  navn: 'Pulsar',
  ikon: '🔦',
  undertitel: 'En neutronstjerne, der blinker som et fyrtårn',
  citat: 'hawkingStjerner',
  kamera: { retning: [-0.25, 0.45, 1], radius: 10 },
  tal: [
    ['Bredde', 'ca. 20 km'],
    ['Vægt', '1,4 til 2 × Solen'],
    ['En teskefuld vejer', 'ca. 1 mia. ton'],
    ['Hurtigste kendte', '716 omgange i sekundet'],
  ],
  kort: `
    <p>Når en kæmpestjerne eksploderer som en supernova, kan der blive en <b>neutronstjerne</b> tilbage. Den er kun ca. 20 km bred, men den vejer mere end Solen. Den er næsten som én kæmpe atomkerne lavet af neutroner.</p>
    <p>En <b>pulsar</b> er en neutronstjerne, der drejer rundt. Den sender to stråler af radiobølger ud fra sine magnetiske poler. Ligesom et fyrtårn: Hver gang en stråle fejer forbi Jorden, måler vores radioteleskoper et blink. Grafen nederst viser blinkene.</p>
    <p>Prøv at lytte til tre rigtige pulsarer. Hvert klik er en omgang!</p>`,
  nørd: `
    <p><b>Opdaget af en studerende:</b> I 1967 opdagede Jocelyn Bell Burnell nogle radioblink, der kom præcis hvert 1,34 sekund. De var så regelmæssige, at man for sjov kaldte signalet LGM-1, "Little Green Men" (små grønne mænd). Hendes vejleder fik Nobelprisen for opdagelsen i 1974, men det gjorde hun ikke. I 2018 fik hun en stor pris på 3 millioner dollar, som hun gav væk til studerende.</p>
    <p><b>Hvorfor drejer den så hurtigt?</b> Tænk på en skøjteløber, der trækker armene ind: Så drejer hun hurtigere. Da stjernen faldt sammen til 20 km, begyndte den at dreje tusindvis af gange hurtigere.</p>
    <p><b>Ekstrem tyngdekraft:</b> Tabte man en ting fra 1 meters højde på en neutronstjerne, ville den ramme overfladen med over 1.000 km i sekundet. Magnetfeltet er omkring en billion gange stærkere end Jordens.</p>
    <p><b>Universets bedste ure:</b> De hurtigste pulsarer tikker lige så præcist som atomure. Ved at holde øje med mange af dem har forskerne fundet spor af tyngdebølger, der ruller gennem hele vores galakse.</p>
    <p><b>Ærligt talt:</b> Strålerne er mest radiobølger, som vi ikke kan se med øjnene. Her har de fået en farve. Og stjernen er tegnet langt større i forhold til strålerne.</p>`,

  lav(gruppe, { lyd, verden, overlag }) {
    // Stjernen drejer om y-aksen. Magnetfeltet og strålerne hælder i forhold til den.
    const drejer = new THREE.Group();
    const kugle = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 48, 32),
      new THREE.MeshStandardMaterial({ color: 0xa9c8ff, emissive: 0x3d64b0, emissiveIntensity: 1.1, roughness: 0.35, metalness: 0.2 }),
    );
    drejer.add(kugle);
    const magnet = new THREE.Group();
    magnet.rotation.z = HÆLD;
    drejer.add(magnet);
    const felt = dipolLinjer([2.4, 3.4, 4.8, 6.6], 8, 0x8fb8ff, 0.3);
    magnet.add(felt);
    const strålerMat = new THREE.MeshBasicMaterial({
      map: strålTekstur(), color: new THREE.Color(0.9, 1.3, 2.6), transparent: true, opacity: 0.6,
      depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    const halvBredde = Math.tan(STRÅLE_BREDDE) * STRÅLE_LÆNGDE;
    for (const side of [1, -1]) {
      const kegle = new THREE.Mesh(new THREE.CylinderGeometry(halvBredde, 0.2, STRÅLE_LÆNGDE, 32, 1, true), strålerMat);
      kegle.position.y = side * (RADIUS + STRÅLE_LÆNGDE / 2);
      if (side < 0) kegle.rotation.x = Math.PI;
      const plet = glød(new THREE.Color(1.4, 1.9, 3), 1.8, 0.9); // den varme plet ved polen
      plet.position.y = side * RADIUS;
      magnet.add(kegle, plet);
    }
    const glorie = glød(new THREE.Color(0.6, 0.9, 2.0), 6, 0.6);
    gruppe.add(drejer, glorie);

    // Drejeaksen som en stiplet linje
    const akseGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -7, 0), new THREE.Vector3(0, 7, 0)]);
    const akse = new THREE.Line(akseGeo, new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.4, gapSize: 0.3, transparent: true, opacity: 0.35 }));
    akse.computeLineDistances();
    const akseSkilt = skilt('Drejeakse', '#c9d3f5', 0.7);
    akseSkilt.position.set(0, 7.6, 0);
    gruppe.add(akse, akseSkilt);

    // Jorden ligger i en retning, som strålerne fejer igennem (i virkeligheden langt, langt væk)
    const tilJorden = new THREE.Vector3(Math.sin(HÆLD), Math.cos(HÆLD), 0).applyAxisAngle(OP, 0.9);
    const jord = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), new THREE.MeshStandardMaterial({ color: 0x3f7fd8, emissive: 0x10305a, roughness: 0.6 }));
    jord.position.copy(tilJorden).multiplyScalar(15);
    const jordBlink = glød(new THREE.Color(1.4, 1.9, 3), 4, 0);
    jordBlink.position.copy(jord.position);
    const jordSkilt = skilt('Jorden', '#9fd3ff', 0.8);
    jordSkilt.position.copy(jord.position).add(new THREE.Vector3(0, 1.1, 0));
    const sigteGeo = new THREE.BufferGeometry().setFromPoints([tilJorden.clone().multiplyScalar(RADIUS + 0.3), jord.position.clone()]);
    const sigte = new THREE.Line(sigteGeo, new THREE.LineDashedMaterial({ color: 0x9fd3ff, dashSize: 0.3, gapSize: 0.3, transparent: true, opacity: 0.3 }));
    sigte.computeLineDistances();
    gruppe.add(jord, jordBlink, jordSkilt, sigte);

    const graf = rullendeGraf(overlag(), 'Det, et radioteleskop på Jorden måler', '#8fd0ff');

    let omgange = 0.5; // pr. sekund
    let vinkel = 0;
    let sidst = 0;
    const akseV = new THREE.Vector3();
    const tilKamera = new THREE.Vector3();

    // Hvor meget en af strålerne peger mod en retning (1 = lige på)
    const styrkeMod = (retning) => {
      akseV.set(0, 1, 0).applyEuler(magnet.rotation).applyAxisAngle(OP, vinkel);
      const v = Math.acos(Math.min(1, Math.abs(akseV.dot(retning))));
      return Math.exp(-((v / STRÅLE_BREDDE) ** 2));
    };

    return {
      styring: [
        {
          skyder: true, navn: 'Fart', min: 0.1, max: 2, trin: 0.1, værdi: omgange,
          vis: (v) => `${v.toFixed(1).replace('.', ',')} omgange/s`,
          ændring: (v) => { omgange = v; },
        },
        { tekst: '🔊 Vela-pulsaren (11 blink/s)', handling: () => lyd.pulsar(11, 2.5) },
        { tekst: '🔊 Krabbe-pulsaren (30 blink/s)', handling: () => lyd.pulsar(30, 2.5) },
        { tekst: '🔊 Den hurtigste (716 blink/s)', handling: () => lyd.pulsar(716, 1.5) },
        { tekst: '🧲 Vis magnetfeltet', til: true, skift: (til) => { felt.visible = til; } },
      ],
      opdater(dt) {
        vinkel += dt * omgange * Math.PI * 2;
        drejer.rotation.y = vinkel;
        // Blink ved Jorden
        const s = styrkeMod(tilJorden);
        jordBlink.material.opacity = s;
        graf.tilføj(s);
        graf.tegn();
        if (s > 0.5 && sidst <= 0.5) lyd.tik();
        sidst = s;
        // Peger en stråle mod kameraet, lyser stjernen ekstra op
        tilKamera.copy(verden.kamera.position).normalize();
        const k = styrkeMod(tilKamera);
        glorie.material.opacity = 0.5 + 0.5 * k;
        glorie.scale.setScalar(6 + 10 * k);
      },
    };
  },
};

// Strålen er lysest tæt på stjernen og falmer udad
function strålTekstur() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 128, 0, 0);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
