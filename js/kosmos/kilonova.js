// Kilonova: to neutronstjerner spiraler ind mod hinanden og støder sammen.
// En sky af neutronrigt stof bliver slynget ud, og i den bliver der lavet guld, platin og uran.

import * as THREE from 'three';
import { glød, prikSky, hale, ringPulje, KVALITET } from './faelles.js';

const A0 = 6; // afstanden mellem stjernerne i starten
const TAU = 7; // sekunder fra "start" til sammenstødet
const OMEGA0 = Math.PI; // en halv omgang i sekundet i starten
const GRUNDSTOFFER = [['Guld', '#ffd43b'], ['Platin', '#e6ecf5'], ['Uran', '#8ce99a'], ['Sølv', '#cfd8e6'], ['Jod', '#b197fc'], ['Europium', '#ff9be0']];

export default {
  id: 'kilonova',
  navn: 'Kilonova',
  ikon: '✨',
  undertitel: 'To neutronstjerner støder sammen og laver guld',
  citat: 'saganStjernestof',
  kamera: { retning: [0, 0.6, 1], radius: 8 },
  tal: [
    ['Set sammen med tyngdebølger', '17. august 2017'],
    ['Afstand', '130 mio. lysår'],
    ['Guld lavet', 'flere gange Jordens vægt'],
    ['Gammaglimtet kom', '1,7 s efter tyngdebølgen'],
  ],
  kort: `
    <p>En <b>kilonova</b> sker, når to neutronstjerner støder sammen. De har kredset om hinanden i millioner eller milliarder af år og er kommet tættere og tættere på. Til sidst drejer de rundt hundredvis af gange i sekundet og smelter sammen med et kæmpe brag.</p>
    <p>Ved sammenstødet bliver en sky af stof fyldt med neutroner slynget ud. Atomkernerne i skyen fanger neutronerne og <b>henfalder</b> bagefter til tunge grundstoffer: <b>guld</b>, platin, sølv, jod og uran.</p>
    <p>Meget af guldet på Jorden er lavet sådan, længe før Jorden fandtes. Måske også guldet i en ring, du har set.</p>`,
  nørd: `
    <p><b>17. august 2017</b> målte LIGO og Virgo tyngdebølger fra to neutronstjerner, der stødte sammen 130 millioner lysår væk. 1,7 sekund senere så en satellit et kort glimt af gammastråling fra samme sted. Bagefter kiggede omkring 70 teleskoper verden over på kilonovaen. Det var første gang, man både "hørte" tyngdebølger og så lys fra den samme begivenhed.</p>
    <p><b>r-processen</b> ("r" for <i>rapid</i>, hurtig): Kernerne fanger neutroner hurtigere, end de når at henfalde. Når neutronerne slipper op, henfalder de neutronrige kerner med betahenfald igen og igen (en neutron bliver til en proton), indtil de er stabile. Det er det samme betahenfald, som du kan se i Atomværkstedet.</p>
    <p><b>Farven:</b> Først lyser skyen blåt. Efter nogle dage bliver den rød, fordi tunge grundstoffer som europium og neodym holder på det blå lys. Netop den farve afslørede, at der var lavet tunge grundstoffer.</p>
    <p><b>Navnet</b> kommer af, at den lyser ca. 1000 gange stærkere end en almindelig nova.</p>
    <p><b>Ærligt talt:</b> Neutronstjernerne er kun 20 km brede, og de sidste omgange tager under et sekund. Her er det sat ned i fart. Man er ikke sikker på, om resten blev en tung neutronstjerne eller et sort hul.</p>`,

  lav(gruppe, { effekter, lyd, fase, kamera }) {
    const stjerner = [0, 1].map(() => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.8, 2.1, 2.8) })));
      g.add(glød(new THREE.Color(0.6, 0.9, 2.2), 3.2, 0.8));
      gruppe.add(g);
      return g;
    });
    const haler = [0, 1].map(() => {
      const h = hale(140, 0x8fc4ff, 0.55);
      gruppe.add(h.linje);
      return h;
    });
    const ringe = ringPulje(gruppe, 16);

    // Udkastet stof: blåt og hurtigt mod polerne, rødt og langsomt ved ækvator, med guldglimt
    const N = Math.round(2400 * KVALITET);
    const start = new Float32Array(N * 3);
    const fart = new Float32Array(N * 3);
    const slags = new Uint8Array(N); // 0 = blå, 1 = rød, 2 = guld
    const sky = prikSky(N, 0.6, (i, c) => c.setRGB(1, 1, 1));
    sky.visible = false;
    gruppe.add(sky);
    const farver = sky.geometry.attributes.color.array;
    const pos = sky.geometry.attributes.position.array;
    const blå = new THREE.Color(0.6, 1.0, 2.4);
    const rød = new THREE.Color(2.2, 0.45, 0.25);
    const guld = new THREE.Color(2.4, 1.8, 0.35);
    const c = new THREE.Color();

    // Gammaglimtet: to smalle stråler op og ned
    const jetMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.4, 3), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    for (const side of [1, -1]) {
      const jet = new THREE.Mesh(new THREE.CylinderGeometry(side > 0 ? 0.9 : 0.06, side > 0 ? 0.06 : 0.9, 18, 20, 1, true), jetMat);
      jet.position.y = side * 9;
      gruppe.add(jet);
    }
    const glorie = glød(new THREE.Color(2.2, 1.8, 2.2), 14, 0);
    gruppe.add(glorie);
    // Bløde skyer, der gør udkastet til en lysende tåge
    const skyer = [];
    for (let i = 0; i < 18; i++) {
      const polar = i < 6;
      const r = new THREE.Vector3().randomDirection();
      if (polar) r.y = Math.sign(r.y || 1) * (0.75 + Math.random() * 0.25);
      else r.y *= 0.3;
      r.normalize();
      const g = glød(new THREE.Color(1, 1, 1), 3, 0);
      g.userData = { retning: r, fart: polar ? 6 : 3, polar };
      gruppe.add(g);
      skyer.push(g);
    }

    // Det, der bliver tilbage (sandsynligvis et sort hul)
    const rest = new THREE.Group();
    rest.add(new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 20), new THREE.MeshBasicMaterial({ color: 0x000000 })));
    rest.add(glød(new THREE.Color(1.2, 0.7, 2.0), 2.6, 0.6));
    rest.visible = false;
    gruppe.add(rest);

    let t = -1; // sekunder siden "start" (-1 = de kredser bare)
    let fase2 = 0;
    let vinkel = 0;
    let sidsteRing = 0;
    let chirpet = false;
    let navnTid = 0;
    let navnNr = 0;
    const p = new THREE.Vector3();

    function nulstil() {
      t = -1;
      fase2 = 0;
      chirpet = false;
      navnNr = 0;
      navnTid = 0;
      sky.visible = false;
      for (const g of skyer) g.material.opacity = 0;
      rest.visible = false;
      jetMat.opacity = 0;
      glorie.material.opacity = 0;
      ringe.skjul();
      for (const s of stjerner) s.visible = true;
      for (const h of haler) h.linje.visible = true;
      fase(null);
      kamera({ radius: 8, flyv: false });
    }

    function sammenstød() {
      fase2 = 2;
      for (const s of stjerner) s.visible = false;
      for (const h of haler) h.linje.visible = false;
      rest.visible = true;
      effekter.glimt(new THREE.Vector3(), 10, new THREE.Color(2.4, 2.2, 2.4), 1.2);
      effekter.bølge(new THREE.Vector3(), 22, new THREE.Color(2, 2, 2.6), 1.6);
      lyd.eksplosion();
      // Fordel stoffet
      const r = new THREE.Vector3();
      for (let i = 0; i < N; i++) {
        let s;
        // vælg en retning: tæt på polerne bliver det blåt, ved ækvator rødt
        r.randomDirection();
        if (Math.abs(r.y) > 0.55) s = 0;
        else s = Math.random() < 0.18 ? 2 : 1;
        slags[i] = s;
        const v = s === 0 ? 5 + Math.random() * 3 : 2.2 + Math.random() * 2.2;
        start[i * 3] = r.x * 0.4; start[i * 3 + 1] = r.y * 0.4; start[i * 3 + 2] = r.z * 0.4;
        fart[i * 3] = r.x * v; fart[i * 3 + 1] = r.y * v; fart[i * 3 + 2] = r.z * v;
      }
      pos.set(start);
      sky.visible = true;
      kamera({ radius: 15, flyv: false });
      fase('Sammenstød!', 'På et splitsekund smelter de to stjerner sammen. Et kort glimt af gammastråling skyder ud i to smalle stråler, og en sky af neutronrigt stof bliver slynget ud.', [2, 4]);
    }

    return {
      styring: [
        {
          tekst: '▶ Lad dem støde sammen', handling: () => {
            t = 0;
            fase2 = 1;
            fase('De spiraler indad', 'Stjernerne sender tyngdebølger ud (ringene) og mister energi. Så kommer de tættere på hinanden og drejer hurtigere og hurtigere.', [1, 4]);
          }, deaktiv: () => t >= 0,
        },
        { tekst: '↺ Forfra', handling: nulstil, deaktiv: () => t < 0 },
      ],
      opdater(dt) {
        if (t >= 0) t += dt;
        ringe.opdater(dt);
        if (fase2 < 2) {
          // Afstand og fart: jo tættere, jo hurtigere (Keplers lov)
          const f = t < 0 ? 1 : Math.max(0, 1 - t / TAU);
          const a = Math.max(0.9, A0 * Math.pow(f, 0.25));
          const ω = Math.min(45, OMEGA0 * Math.pow(A0 / a, 1.5));
          vinkel += ω * dt;
          stjerner.forEach((s, i) => {
            const v = vinkel + i * Math.PI;
            s.position.set(Math.cos(v) * a / 2, 0, Math.sin(v) * a / 2);
            haler[i].følg(s.position);
          });
          // En ring for hver halve omgang (tyngdebølger har dobbelt så høj frekvens som omløbet)
          sidsteRing += dt;
          if (sidsteRing > Math.max(0.1, Math.PI / ω)) {
            sidsteRing = 0;
            ringe.send(Math.min(1, 0.25 * Math.pow(A0 / a, 0.8)));
          }
          if (fase2 === 1 && !chirpet && t > TAU - 1.4) {
            chirpet = true;
            lyd.chirp(1.4);
          }
          if (fase2 === 1 && t >= TAU) sammenstød();
          return;
        }
        // Efter sammenstødet
        const mt = t - TAU;
        const k = 0.5;
        const s = (1 - Math.exp(-k * mt)) / k;
        for (let i = 0; i < N * 3; i++) pos[i] = start[i] + fart[i] * s;
        sky.geometry.attributes.position.needsUpdate = true;
        // Farverne: hvidglødende → blå → rød (og guldet glimter)
        const varm = Math.max(0, 1 - mt / 1.2);
        const rødning = Math.min(1, Math.max(0, (mt - 3) / 5));
        for (let i = 0; i < N; i++) {
          if (slags[i] === 2) {
            c.copy(guld).multiplyScalar(0.55 + 0.45 * Math.sin(mt * 6 + i));
          } else {
            c.copy(blå).lerp(rød, slags[i] === 0 ? rødning * 0.6 : rødning);
          }
          c.r += varm * 2; c.g += varm * 2; c.b += varm * 2;
          farver[i * 3] = c.r; farver[i * 3 + 1] = c.g; farver[i * 3 + 2] = c.b;
        }
        sky.geometry.attributes.color.needsUpdate = true;
        jetMat.opacity = mt < 1.6 ? 0.8 * (1 - mt / 1.6) : 0;
        glorie.material.opacity = Math.max(0, 0.45 * (1 - mt / 4));
        for (const g of skyer) {
          const { retning, fart: v, polar } = g.userData;
          g.position.copy(retning).multiplyScalar(v * s * 0.8);
          g.scale.setScalar(3 + s * (polar ? 3 : 4));
          g.material.color.copy(blå).lerp(rød, polar ? rødning * 0.6 : rødning).multiplyScalar(0.5);
          g.material.opacity = Math.min(0.35, mt * 0.2) * (1 - Math.max(0, (mt - 14) / 6));
        }
        if (fase2 === 2 && mt > 2.5) {
          fase2 = 3;
          fase('En kilonova', 'Atomkernerne i skyen fanger neutroner og henfalder til tunge grundstoffer. Skyen lyser i nogle dage, først blåt og så rødt.', [3, 4]);
        }
        // Navne på grundstoffer, der dukker op i skyen
        if (mt > 2.5 && navnNr < GRUNDSTOFFER.length * 2) {
          navnTid += dt;
          if (navnTid > 0.7) {
            navnTid = 0;
            const [navn, farve] = GRUNDSTOFFER[navnNr % GRUNDSTOFFER.length];
            navnNr++;
            let i = (Math.random() * N) | 0;
            if (slags[i] === 0) i = (i + 1) % N; // helst i den røde del, hvor de tunge grundstoffer er
            p.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
            effekter.tekst(p, navn, farve, 2.2, 2.4);
          }
        }
        if (fase2 === 3 && mt > 11) {
          fase2 = 4;
          fase('Guld fra rummet', 'Stoffet blandes med gas i galaksen og bliver en dag en del af nye stjerner og planeter. Sådan kom meget af guldet til Jorden.', [4, 4]);
        }
      },
    };
  },
};
