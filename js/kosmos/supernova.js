// Supernova: en kæmpestjerne (som Betelgeuse) er bygget i lag som et løg.
// Når kernen er blevet til jern, falder den sammen, og stjernen eksploderer.

import * as THREE from 'three';
import { stjerne, stjerneTid, glød, prikSky, KVALITET } from './faelles.js';

const R = 6; // stjernens radius
// Lagene udefra og ind: navn, ydre radius, farve
const LAG = [
  ['Hydrogen', R, '#ff9a4a'],
  ['Helium', 4.4, '#ff6f3c'],
  ['Carbon', 3.4, '#ffd43b'],
  ['Neon', 2.6, '#4dabf7'], // stjernen brænder carbon, så neon, så oxygen og til sidst silicium
  ['Oxygen', 1.95, '#8ce99a'],
  ['Silicium', 1.35, '#b197fc'],
  ['Jern', 0.75, '#e6ecf5'],
];
const SNIT = Math.PI * 1.5; // vi skærer en fjerdedel af stjernen væk, så man kan se ind
const SNIT_VINKEL = (135 * Math.PI) / 180; // hvor meget lagene skal drejes for at snittet vender mod kameraet

export default {
  id: 'supernova',
  navn: 'Supernova',
  ikon: '💥',
  undertitel: 'En kæmpestjerne eksploderer',
  citat: 'tycho',
  kamera: { retning: [0.35, 0.3, 1], radius: 8.5 },
  tal: [
    ['Betelgeuse er', 'ca. 550 lysår væk'],
    ['Betelgeuse er', 'ca. 750 × Solens bredde'],
    ['Kernen falder sammen på', 'under 1 sekund'],
    ['En supernova lyser som', 'op mod en milliard sole'],
  ],
  kort: `
    <p>De fleste stjerner, der er mere end ca. 8 gange tungere end Solen, ender deres liv med et kæmpe brag: en <b>supernova</b>. Stjernen <b>Betelgeuse</b> i Orion er sådan en. Den eksploderer en dag, måske først om 100.000 år.</p>
    <p>Hele livet laver stjernen tungere og tungere grundstoffer i sit indre: helium, carbon, neon, oxygen, silicium og til sidst <b>jern</b>. Den bliver bygget op i lag ligesom et løg. Tryk "Vis lagene".</p>
    <p>Jern kan ikke give energi ved fusion. Jernkernen i midten af stjernen vokser, og når den vejer ca. 1,4 gange så meget som hele vores Sol, kan den ikke længere holde sig selv oppe. Den falder sammen på under et sekund, og resten af stjernen bliver blæst ud i rummet.</p>
    <p>Tilbage bliver en lille, ekstremt tung <b>neutronstjerne</b> eller et <b>sort hul</b>. Hvad det bliver, afhænger af, hvor tung resten i midten er: Vejer den mere end ca. 2-3 sole, kan intet holde den oppe, og den falder sammen til et sort hul. Det sker oftest for stjerner, der fra starten var mere end ca. 20-25 gange tungere end Solen. Betelgeuse bliver nok til en neutronstjerne. Stoffet, der bliver blæst ud, bliver en dag til nye stjerner og planeter. Oxygenet, du ånder, er lavet i sådan en stjerne.</p>`,
  nørd: `
    <p><b>Hvorfor stopper det ved jern?</b> Jern og nikkel har den højeste bindingsenergi pr. nukleon. Fusion af lette kerner giver energi, men at lave noget tungere end jern <i>koster</i> energi. Se Nørd-fanen i Atomværkstedet, når du har bygget jern-56.</p>
    <p><b>Sammenfaldet:</b> Jernkernen i midten af stjernen vejer ca. 1,4 gange så meget som hele vores Sol, men den er kun på størrelse med Jorden. På under et sekund falder den sammen til en kugle på ca. 20 km. Elektronerne bliver presset ind i protonerne og bliver til neutroner og <b>neutrinoer</b>. En neutrino er en bittelille partikel uden ladning, der næsten ikke vejer noget. Den reagerer næsten aldrig med noget og flyver lige gennem stjerner, planeter og hele Jorden. Det er betahenfald baglæns (se Atomværkstedet). 99 % af energien forsvinder som neutrinoer.</p>
    <p><b>Supernova 1987A:</b> Da en stjerne eksploderede i en nabogalakse i 1987, fangede detektorer på Jorden ca. 25 neutrinoer, et par timer før man kunne se lyset. Det var første gang, man fangede neutrinoer fra en anden stjerne end Solen.</p>
    <p><b>Krabbetågen</b> er resterne af en supernova, som kinesiske astronomer så i år 1054. Den kunne ses om dagen i 23 dage. I midten snurrer en neutronstjerne 30 gange i sekundet.</p>
    <p><b>Ærligt talt:</b> I virkeligheden er kernen bittelille i forhold til stjernen. Betelgeuse er så stor, at den ville nå langt ud forbi Mars, hvis den stod, hvor Solen står. Lagene er tegnet tykkere, så man kan se dem. Og selve jernkernen bliver til neutronstjernen. Det jern, der bliver blæst ud, bliver lavet i selve eksplosionen.</p>`,

  lav(gruppe, { effekter, lyd, fase, kamera, verden, opdaterKnapper, forklaring }) {
    // Hele stjernen
    const hel = stjerne(R, '#ffb066', '#9a2a0c', new THREE.Color(1.6, 0.45, 0.12), 2.2, { styrke: 1.25, skala: 2.0, kant: 0.3 });
    const stjerneMat = hel.userData.materiale;
    gruppe.add(hel);

    // Stjernen skåret op: lag uden på lag
    const snit = new THREE.Group();
    snit.visible = false;
    const ydre = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 40, 0, SNIT), stjerneMat);
    stjerneMat.side = THREE.DoubleSide;
    ydre.onBeforeRender = () => { stjerneMat.uniforms.tid.value = stjerneTid(); };
    snit.add(ydre);
    for (let i = 1; i < LAG.length - 1; i++) {
      const farve = new THREE.Color(LAG[i][2]);
      snit.add(new THREE.Mesh(
        new THREE.SphereGeometry(LAG[i][1], 48, 32, 0, SNIT),
        new THREE.MeshStandardMaterial({ color: farve, emissive: farve, emissiveIntensity: 0.12, roughness: 0.8, side: THREE.DoubleSide }),
      ));
    }
    gruppe.add(snit);

    // Jernkernen (en hel kugle i midten)
    const kerne = new THREE.Mesh(new THREE.SphereGeometry(LAG[6][1], 32, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.95, 1.05) }));
    kerne.visible = false;
    gruppe.add(kerne);

    // Chokbølgen
    const chok = new THREE.Mesh(
      new THREE.SphereGeometry(1, 40, 24),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 1.0, 0.6), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide }),
    );
    gruppe.add(chok);

    // Neutrinoer: et hurtigt, svagt glimt af prikker, der flyver lige igennem det hele
    const NN = Math.round(300 * KVALITET);
    const neutrinoer = prikSky(NN, 0.16, (i, c) => c.setRGB(0.8, 1.1, 1.6));
    neutrinoer.visible = false;
    const nRetning = Array.from({ length: NN }, () => new THREE.Vector3().randomDirection());
    gruppe.add(neutrinoer);

    // Resterne: gas i klumper og tråde i lagenes farver
    const ND = Math.round(2600 * KVALITET);
    const klumper = Array.from({ length: 120 }, () => new THREE.Vector3().randomDirection());
    const dLag = new Uint8Array(ND);
    const dStart = new Float32Array(ND * 3);
    const dFart = new Float32Array(ND * 3);
    const lagFarver = LAG.map((l) => new THREE.Color(l[2]));
    const rest = prikSky(ND, 0.6, (i, c) => {
      // flest partikler i de ydre lag
      const r = Math.random();
      const lag = r < 0.34 ? 0 : r < 0.6 ? 1 : r < 0.74 ? 2 : r < 0.86 ? 3 : r < 0.93 ? 4 : r < 0.98 ? 5 : 6;
      dLag[i] = lag;
      c.copy(lagFarver[lag]).multiplyScalar(1.6);
    });
    rest.visible = false;
    gruppe.add(rest);
    const dPos = rest.geometry.attributes.position.array;
    const dFarve = rest.geometry.attributes.color.array;
    const dFarveStart = dFarve.slice();
    const tåger = [];
    for (let i = 0; i < 40; i++) {
      const t = glød(lagFarver[i % 5].clone().multiplyScalar(0.9), 4, 0);
      t.userData.retning = klumper[i * 2];
      t.userData.fart = 4 + Math.random() * 4;
      gruppe.add(t);
      tåger.push(t);
    }
    const lysglimt = glød(new THREE.Color(2.2, 1.9, 1.6), 40, 0);
    gruppe.add(lysglimt);

    // Neutronstjernen, der bliver tilbage
    const neutronstjerne = new THREE.Group();
    neutronstjerne.add(new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(2, 2.4, 3) })));
    neutronstjerne.add(glød(new THREE.Color(0.7, 1.1, 2.4), 3, 0.9));
    const stråler = new THREE.Group();
    for (const side of [1, -1]) {
      const kegle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.5, 9, 16, 1, true),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0.6, 1.0, 2.2), transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
      );
      kegle.position.y = side * 4.5;
      kegle.rotation.x = side > 0 ? 0 : Math.PI;
      stråler.add(kegle);
    }
    // Strålerne følger magnetfeltets akse, som hælder i forhold til den akse, stjernen drejer om
    stråler.rotation.z = 0.5;
    const snurre = new THREE.Group();
    snurre.add(stråler);
    neutronstjerne.add(snurre);
    neutronstjerne.visible = false;
    gruppe.add(neutronstjerne);

    let t = -1; // sekunder siden sammenfaldet startede (-1 = stjernen lever)
    let trin = 0;
    let visLag = false;

    // Farveforklaring til lagene (vises i panelet, når lagene er synlige)
    const lagListe = '<ul class="kerne-liste">' + LAG.map(([navn, , farve], i) =>
      `<li><span class="farveprik" style="background:${farve}"></span>${navn}${i === 0 ? ' (yderst)' : i === LAG.length - 1 ? ' (kernen)' : ''}</li>`).join('') + '</ul>';

    function opdaterVisning() {
      const lever = t < 3;
      hel.visible = lever && !visLag;
      snit.visible = lever && visLag;
      kerne.visible = lever && visLag;
      forklaring(lever && visLag ? lagListe : '');
    }

    function nulstil() {
      t = -1;
      trin = 0;
      rest.visible = false;
      neutrinoer.visible = false;
      neutronstjerne.visible = false;
      chok.material.opacity = 0;
      lysglimt.material.opacity = 0;
      for (const tå of tåger) tå.material.opacity = 0;
      kerne.scale.setScalar(1);
      snit.scale.setScalar(1);
      hel.scale.setScalar(1);
      opdaterVisning();
      fase(null);
      kamera({ radius: 8.5, flyv: false });
    }

    function eksplodér() {
      t = 0;
      trin = 1;
      // Vis lagene, så man kan se kernen falde sammen
      visLag = true;
      styring[1].til = true;
      opdaterKnapper();
      opdaterVisning();
      lyd.opbygning();
      fase('Jernkernen falder sammen', 'Jernkernen kan ikke give mere energi, men den vokser. Da den vejer ca. 1,4 gange Solen, kan trykket ikke længere holde den oppe. På under et sekund falder den sammen fra Jordens størrelse til en kugle på ca. 20 km.', [1, 4]);
    }

    function sprængStjernen() {
      trin = 3;
      opdaterVisning();
      chok.material.opacity = 0;
      // Gassen starter, hvor lagene var, og flyver ud i klumper
      const hjælp = new THREE.Vector3();
      for (let i = 0; i < ND; i++) {
        const lag = dLag[i];
        const ydreR = LAG[lag][1], indreR = LAG[lag + 1]?.[1] ?? 0.2;
        const retning = klumper[(Math.random() * klumper.length) | 0].clone().add(hjælp.randomDirection().multiplyScalar(0.06 + Math.random() * 0.16)).normalize();
        const r = indreR + Math.random() * (ydreR - indreR);
        const fart = (2.5 + Math.random() * 3.5) * (0.55 + (r / R) * 0.7);
        dStart[i * 3] = retning.x * r;
        dStart[i * 3 + 1] = retning.y * r;
        dStart[i * 3 + 2] = retning.z * r;
        dFart[i * 3] = retning.x * fart;
        dFart[i * 3 + 1] = retning.y * fart;
        dFart[i * 3 + 2] = retning.z * fart;
      }
      dPos.set(dStart);
      rest.visible = true;
      neutronstjerne.visible = true;
      effekter.glimt(new THREE.Vector3(), 18, new THREE.Color(2.4, 2.1, 1.7), 1.4);
      effekter.bølge(new THREE.Vector3(), 34, new THREE.Color(2.6, 1.6, 0.9), 2.2);
      lyd.eksplosion();
      kamera({ radius: 22, flyv: false });
      fase('Supernova!', 'Stjernen bliver blæst ud i rummet med 10.000 km i sekundet. I nogle uger lyser den som flere hundrede millioner sole.', [3, 4]);
    }

    const styring = [
      { tekst: '💥 Lad stjernen eksplodere', handling: eksplodér, deaktiv: () => t >= 0 },
      {
        tekst: '🧅 Vis lagene', til: false, skift: (til) => {
          visLag = til;
          opdaterVisning();
        },
      },
      { tekst: '↺ Ny stjerne', handling: nulstil, deaktiv: () => t < 0 },
    ];

    return {
      styring,
      opdater(dt, tid) {
        // Snittet vender altid mod kameraet
        const k = verden.kamera.position;
        snit.rotation.y = Math.atan2(k.x, k.z) + SNIT_VINKEL;
        if (t < 0) {
          // En kæmpestjerne pulserer langsomt
          hel.scale.setScalar(1 + 0.015 * Math.sin(tid * 0.7));
          return;
        }
        t += dt;
        if (trin === 1) {
          // Kernen falder sammen (hurtigere og hurtigere), og lagene begynder at falde ind
          const f = Math.min(1, t / 0.8);
          kerne.scale.setScalar(1 - 0.82 * f * f);
          snit.scale.setScalar(1 - 0.05 * f);
          if (t >= 0.8) {
            trin = 2;
            effekter.glimt(new THREE.Vector3(), 6, new THREE.Color(2.4, 2.6, 3), 0.8);
            neutrinoer.visible = true;
            lyd.fusion(2);
            fase('Neutrinoer og en chokbølge', 'Kernen er presset så hårdt sammen, at den preller af. En chokbølge farer ud gennem lagene, og en storm af neutrinoer (bittesmå partikler uden ladning, der flyver gennem næsten alt) farer lige igennem det hele.', [2, 4]);
          }
        } else if (trin === 2) {
          const f = Math.min(1, (t - 0.8) / 2.2);
          chok.scale.setScalar(0.8 + (R - 0.6) * f);
          chok.material.opacity = 0.22 * (1 - f * 0.5);
          snit.scale.setScalar(0.95 + 0.05 * f);
          if (t >= 3) sprængStjernen();
        }
        // Neutrinoerne flyver ud med næsten lysets fart
        if (neutrinoer.visible) {
          const nt = t - 0.8;
          const p = neutrinoer.geometry.attributes.position.array;
          for (let i = 0; i < NN; i++) {
            const r = 0.4 + nt * 22 * (0.9 + (i % 7) * 0.02);
            p[i * 3] = nRetning[i].x * r;
            p[i * 3 + 1] = nRetning[i].y * r;
            p[i * 3 + 2] = nRetning[i].z * r;
          }
          neutrinoer.geometry.attributes.position.needsUpdate = true;
          neutrinoer.material.opacity = Math.max(0, 1 - nt / 1.6);
          if (nt > 1.6) neutrinoer.visible = false;
        }
        if (trin >= 3) {
          const et = t - 3; // tid siden eksplosionen
          // Gassen bremses langsomt (strækning = fart · (1 - e^(-k·t)) / k)
          const k2 = 0.28;
          const s = (1 - Math.exp(-k2 * et)) / k2;
          for (let i = 0; i < ND * 3; i++) dPos[i] = dStart[i] + dFart[i] * s;
          rest.geometry.attributes.position.needsUpdate = true;
          // Farven går fra hvidglødende til tågens farver
          const varm = Math.max(0, 1 - et / 2.5);
          for (let i = 0; i < ND * 3; i++) dFarve[i] = dFarveStart[i] * (0.85 + 0.15 * varm) + varm * 1.2;
          rest.geometry.attributes.color.needsUpdate = true;
          // Stjernen blusser op og falmer (dæmpet, så det ikke blænder)
          lysglimt.material.opacity = Math.max(0, 0.5 * Math.min(1, et * 2) * (1 - et / 4));
          lysglimt.scale.setScalar(24 + et * 8);
          for (const tå of tåger) {
            tå.position.copy(tå.userData.retning).multiplyScalar(tå.userData.fart * s * 0.9);
            tå.scale.setScalar(5 + s * 2.6);
            tå.material.opacity = Math.min(0.09, et * 0.03);
          }
          snurre.rotation.y += dt * 2.5;
          if (trin === 3 && et > 6) {
            trin = 4;
            fase('En supernova-rest', 'Gassen breder sig ud i tusinder af år og bliver til en lysende tåge ligesom Krabbetågen. I midten snurrer en neutronstjerne. Prøv Pulsar i listen!', [4, 4]);
          }
        }
      },
    };
  },
};
