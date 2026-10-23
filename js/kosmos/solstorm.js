// Solstorm: Solen kaster en sky af partikler mod Jorden. Jordens magnetfelt leder dem udenom,
// men nogle bliver fanget og styrter ned mod polerne, hvor de laver nordlys.

import * as THREE from 'three';
import { stjerne, glød, prikSky, dipolLinjer, skilt, KVALITET } from './faelles.js';

const SOL_X = -15;
const SOL_R = 5;
const JORD_X = 14;
const JORD_R = 1.1;
const NÆSE = 3.2; // hvor langt foran Jorden magnetfeltet holder solvinden væk

export default {
  id: 'solstorm',
  hvorfor: ['magnetfelt'],
  navn: 'Solstorm',
  ikon: '☀️',
  undertitel: 'Når Solen kaster en sky af partikler mod Jorden',
  citat: 'carrington',
  kamera: { retning: [0.12, 0.38, 1], radius: 17, mål: [-1, 0, 0], drej: false },
  tal: [
    ['Solvindens fart', 'ca. 400 km/s'],
    ['En solstorm vejer', 'ca. 1 mia. ton'],
    ['Tid til Jorden', 'typisk 1 til 3 døgn'],
    ['Nordlys i Danmark', 'fx maj 2024'],
  ],
  kort: `
    <p>Solen sender hele tiden en strøm af elektroner og protoner ud i rummet. Det hedder <b>solvinden</b>. Nogle gange sker der et kæmpe udbrud, og Solen kaster en hel sky af partikler af sted. Det er en <b>solstorm</b>.</p>
    <p>Jorden har et <b>magnetfelt</b>, ligesom en stor magnet. Det fungerer som et skjold og leder partiklerne udenom. Men nogle bliver fanget og suser ned i en ring omkring Nordpolen og Sydpolen. Når de rammer luften højt oppe, lyser den. Det er <b>nordlys</b>.</p>
    <p>Prøv at sende en solstorm, og se nordlyset tænde.</p>`,
  nørd: `
    <p><b>Farverne i nordlyset</b> kommer fra luften: Grønt og rødt er oxygen (grønt ca. 100 til 250 km oppe, rødt højere oppe), og blåt og lilla er nitrogen. Det er samme idé som i et neonrør: Atomer, der får et skub, sender lys ud i en bestemt farve.</p>
    <p><b>Udbruddet</b> hedder en <i>koronamasseudkastning</i> (CME). Magnetfelter i Solens yderste lag bliver vredet sammen, til de springer som en elastik. Partiklerne kommer især ind på Jordens natside: Magnetfeltet bliver strakt ud i en lang hale, og når feltlinjerne i halen "klikker" sammen igen, bliver partiklerne skudt ned mod polerne.</p>
    <p><b>Carrington-stormen</b> i 1859 var så kraftig, at telegrafledninger slog gnister, og der var nordlys helt ned til Caribien. Sker det samme i dag, kan satellitter, GPS og elnet blive ramt. I 1989 slukkede en solstorm strømmen i Québec i Canada i ni timer.</p>
    <p><b>Ærligt talt:</b> Solen er i virkeligheden 109 gange bredere end Jorden og 150 millioner km væk. Her er alt rykket tæt sammen.</p>`,

  lav(gruppe, { effekter, lyd, fase, kamera }) {
    // Solen og dens lys
    const sol = stjerne(SOL_R, '#ffe08a', '#e0661a', new THREE.Color(2.2, 1.3, 0.4), 2.6, { skala: 4.5 });
    sol.position.x = SOL_X;
    const korona = glød(new THREE.Color(1.2, 0.7, 0.25), SOL_R * 5.5, 0.35);
    korona.position.x = SOL_X;
    const sollys = new THREE.PointLight(0xfff1d6, 3, 0, 0);
    sollys.position.x = SOL_X;
    gruppe.add(sol, korona, sollys);

    // Buer af glødende gas på Solens overflade
    const buer = new THREE.Group();
    buer.position.x = SOL_X;
    const bueMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 0.9, 0.35), transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending });
    function lavBue(retning, størrelse) {
      const v = new THREE.Vector3(...retning).normalize();
      const tværs = new THREE.Vector3(0, 1, 0).cross(v).normalize().multiplyScalar(størrelse);
      const a = v.clone().multiplyScalar(SOL_R).add(tværs);
      const b = v.clone().multiplyScalar(SOL_R).sub(tværs);
      const top = v.clone().multiplyScalar(SOL_R + størrelse * 1.8);
      const kurve = new THREE.QuadraticBezierCurve3(a, top, b);
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(kurve, 24, 0.12, 6, false), bueMat);
      buer.add(mesh);
      return mesh;
    }
    lavBue([1, 0.5, 0.4], 0.9);
    lavBue([0.6, -0.7, 0.6], 0.7);
    lavBue([0.9, 0.1, -0.6], 0.8);
    const udbrudsBue = lavBue([1, 0.12, 0.1], 0.8);
    gruppe.add(buer);

    // Jorden
    const jord = new THREE.Group();
    jord.position.x = JORD_X;
    const jordKugle = new THREE.Mesh(
      new THREE.SphereGeometry(JORD_R, 48, 32),
      new THREE.MeshStandardMaterial({ map: jordTekstur(), roughness: 0.8, metalness: 0 }),
    );
    jordKugle.rotation.z = 0.41; // Jordens akse hælder 23 grader
    const atmosfære = glød(new THREE.Color(0.35, 0.65, 1.6), JORD_R * 3.2, 0.55);
    jord.add(jordKugle, atmosfære);
    gruppe.add(jord);

    // Nordlys: et lysende "gardin" i en ring om hver pol (grønt forneden, rødt øverst)
    const gardinTekstur = nordlysTekstur();
    const nordlys = [];
    for (const side of [1, -1]) {
      const gardin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5 * JORD_R, 0.4 * JORD_R, 0.32 * JORD_R, 64, 1, true),
        new THREE.MeshBasicMaterial({ map: gardinTekstur, color: new THREE.Color(2.2, 2.2, 2.2), transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      gardin.position.y = side * 1.0 * JORD_R;
      gardin.scale.y = side; // på Sydpolen vender gardinet nedad
      jord.add(gardin);
      nordlys.push(gardin);
    }

    // Magnetfeltet: feltlinjer, der bliver trykket sammen på dagsiden og strakt ud i en hale på natsiden
    const felt = dipolLinjer([1.5, 2, 2.6, 3.3], 10, 0x6fb6ff, 0.4);
    felt.scale.setScalar(JORD_R);
    jord.add(felt);
    const feltOrg = felt.geometry.attributes.position.array.slice();

    // Den yderste grænse for magnetfeltet: et par tynde streger, der viser en skål foran Jorden
    const skalPos = [];
    const skålX = (r) => -NÆSE + (r * r) / 5;
    for (const r of [1.6, 3, 4.4]) {
      for (let i = 0; i < 48; i++) {
        const v1 = (i / 48) * Math.PI * 2, v2 = ((i + 1) / 48) * Math.PI * 2;
        skalPos.push(skålX(r), Math.cos(v1) * r, Math.sin(v1) * r, skålX(r), Math.cos(v2) * r, Math.sin(v2) * r);
      }
    }
    for (let k = 0; k < 12; k++) {
      const v = (k / 12) * Math.PI * 2;
      for (let i = 0; i < 12; i++) {
        const r1 = (i / 12) * 4.6, r2 = ((i + 1) / 12) * 4.6;
        skalPos.push(skålX(r1), Math.cos(v) * r1, Math.sin(v) * r1, skålX(r2), Math.cos(v) * r2, Math.sin(v) * r2);
      }
    }
    const skalGeo = new THREE.BufferGeometry();
    skalGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(skalPos), 3));
    const skal = new THREE.LineSegments(skalGeo, new THREE.LineBasicMaterial({ color: 0x6f9dff, transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending }));
    jord.add(skal);

    // Skilte
    const solSkilt = skilt('Solen', '#ffd27a', 1.4);
    solSkilt.position.set(SOL_X, SOL_R + 2.2, 0);
    const jordSkilt = skilt('Jorden', '#9fd3ff', 1.1);
    jordSkilt.position.set(JORD_X, JORD_R + 2.6, 0);
    gruppe.add(solSkilt, jordSkilt);

    // Partikler: solvind (0), solstorm (1) og fangede partikler på vej mod polerne (2)
    const VIND = Math.round(700 * KVALITET);
    const STORM = Math.round(520 * KVALITET);
    const N = VIND + STORM;
    const farveVind = new THREE.Color(1.0, 0.85, 0.5).multiplyScalar(0.7);
    const farveStorm = new THREE.Color(1.8, 0.7, 0.45);
    const farveFanget = new THREE.Color(0.4, 2.0, 0.8);
    const sky = prikSky(N, 0.32, (i, c) => c.copy(i < VIND ? farveVind : farveStorm));
    gruppe.add(sky);
    const pos = sky.geometry.attributes.position.array;
    const farver = sky.geometry.attributes.color.array;
    const vel = new Float32Array(N * 3);
    const slags = new Int8Array(N).fill(-1); // -1 = ikke i brug
    const fangst = Array.from({ length: N }, () => null);

    const sort = new THREE.Color(0, 0, 0);
    let visVind = true;
    const sætFarve = (i, c) => { farver[i * 3] = c.r; farver[i * 3 + 1] = c.g; farver[i * 3 + 2] = c.b; };
    // Solvinden kan skjules (den bliver sort, og sort lyser ikke), men den laver stadig nordlys
    const farveFor = (type) => (type === 1 ? farveStorm : type === 2 ? farveFanget : visVind ? farveVind : sort);
    function udsend(i, type, kegle = 1, fart = 8) {
      const d = new THREE.Vector3(1, (Math.random() - 0.5) * 2 * kegle, (Math.random() - 0.5) * 2 * kegle).normalize();
      pos[i * 3] = SOL_X + d.x * SOL_R;
      pos[i * 3 + 1] = d.y * SOL_R;
      pos[i * 3 + 2] = d.z * SOL_R;
      const f = fart * (0.8 + Math.random() * 0.4);
      vel[i * 3] = d.x * f;
      vel[i * 3 + 1] = d.y * f;
      vel[i * 3 + 2] = d.z * f;
      slags[i] = type;
      fangst[i] = null;
      sætFarve(i, farveFor(type));
    }
    // Start: solvinden er allerede i gang
    for (let i = 0; i < VIND; i++) {
      udsend(i, 0, 1.2);
      const t = Math.random() * 4;
      pos[i * 3] += vel[i * 3] * t;
      pos[i * 3 + 1] += vel[i * 3 + 1] * t;
      pos[i * 3 + 2] += vel[i * 3 + 2] * t;
    }
    for (let i = VIND; i < N; i++) pos[i * 3 + 1] = 9999;

    let storm = 0; // hvor hårdt solstormen trykker på magnetfeltet (0 til 1)
    let lys = 0; // hvor kraftigt nordlyset er (0 til 1)
    let cmeTid = -1; // sekunder siden udbruddet (-1 = intet udbrud)
    let tid = 0;
    let faseNr = 0;

    function sendStorm() {
      cmeTid = 0;
      faseNr = 1;
      udbrudsBue.scale.setScalar(1);
      const sted = new THREE.Vector3(SOL_X + SOL_R, 0.6, 0.5);
      effekter.glimt(sted, 9, new THREE.Color(3, 2.2, 1.2), 1.2);
      effekter.bølge(sted, 10, new THREE.Color(2.4, 1.2, 0.5), 1.4);
      lyd.sus(2.2);
      for (let i = VIND; i < N; i++) {
        udsend(i, 1, 0.42, 6.5);
        // ikke alle på én gang: skyen bliver lidt lang
        const t = -Math.random() * 0.6;
        pos[i * 3] += vel[i * 3] * t + 0.6;
        pos[i * 3 + 1] += vel[i * 3 + 1] * t;
        pos[i * 3 + 2] += vel[i * 3 + 2] * t;
      }
      fase('Et udbrud på Solen', 'Magnetfelter på Solen er blevet vredet sammen og springer som en elastik. En sky af en milliard ton partikler bliver kastet ud i rummet.', [1, 4]);
    }

    const styring = [
      { tekst: '💥 Send en solstorm', handling: sendStorm, deaktiv: () => cmeTid >= 0 && cmeTid < 7 },
      { tekst: '🧲 Vis magnetfeltet', til: true, skift: (til) => { felt.visible = til; skal.visible = til; } },
      {
        tekst: '🌬️ Vis solvinden', til: true, skift: (til) => {
          visVind = til;
          for (let i = 0; i < N; i++) if (slags[i] === 0) sætFarve(i, farveFor(0));
        },
      },
      {
        tekst: '🔍 Zoom ind på Jorden', til: false, skift: (til) => kamera(til
          ? { retning: [0.5, 0.35, 1], radius: 5, mål: [JORD_X, 0, 0], drej: false, flyv: false }
          : { retning: [0.12, 0.38, 1], radius: 17, mål: [-1, 0, 0], drej: false, flyv: false }),
      },
    ];

    const hjælp = new THREE.Vector3();
    const p0 = new THREE.Vector3();
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();

    return {
      styring,
      opdater(dt) {
        tid += dt;
        sol.userData.kugle.rotation.y += dt * 0.05;
        jordKugle.rotation.y += dt * 0.25;
        buer.children.forEach((b, i) => { if (b !== udbrudsBue) b.scale.setScalar(1 + 0.06 * Math.sin(tid * 1.3 + i * 2)); });
        korona.material.opacity = 0.32 + 0.04 * Math.sin(tid * 0.8);

        // Udbruddet: buen vokser og bliver revet løs
        if (cmeTid >= 0) {
          cmeTid += dt;
          udbrudsBue.scale.setScalar(1 + Math.min(4, cmeTid * 5));
          bueMat.opacity = 0.8;
          if (cmeTid > 0.8) udbrudsBue.visible = false;
          if (faseNr === 1 && cmeTid > 1.6) {
            faseNr = 2;
            fase('Skyen er på vej', 'Her tager turen et par sekunder. I virkeligheden tager den typisk 1 til 3 døgn (de hurtigste under et døgn), så man kan nå at advare om den.', [2, 4]);
          }
          if (cmeTid > 12) {
            cmeTid = -1;
            udbrudsBue.visible = true;
            udbrudsBue.scale.setScalar(1);
          }
        }

        // Partiklerne flytter sig
        let tryk = 0;
        const næse = NÆSE * (1 - 0.35 * storm);
        for (let i = 0; i < N; i++) {
          const s = slags[i];
          if (s < 0) continue;
          const k = i * 3;
          if (s === 2) {
            // Fanget: følger en bue fra halen ind mod polen
            const f = fangst[i];
            f.t += dt / f.varighed;
            const t = Math.min(1, f.t);
            p0.copy(f.fra).multiplyScalar((1 - t) * (1 - t)).addScaledVector(f.via, 2 * (1 - t) * t).addScaledVector(f.til, t * t);
            pos[k] = p0.x; pos[k + 1] = p0.y; pos[k + 2] = p0.z;
            if (t >= 1) {
              lys = Math.min(1, lys + (f.storm ? 0.03 : 0.006));
              if (i < VIND) udsend(i, 0, 1.2);
              else { slags[i] = -1; pos[k + 1] = 9999; }
            }
            continue;
          }
          pos[k] += vel[k] * dt;
          pos[k + 1] += vel[k + 1] * dt;
          pos[k + 2] += vel[k + 2] * dt;
          // Magnetfeltets grænse: en skål foran Jorden. Partikler, der kommer ind i den, glider langs den.
          const dx = pos[k] - JORD_X;
          const r = Math.hypot(pos[k + 1], pos[k + 2]);
          const grænse = -næse + (r * r) / 5;
          if (dx > grænse && r < 7 && dx < 8) {
            // skub partiklen ud til grænsen og fjern den del af farten, der peger indad
            const ry = r > 1e-4 ? pos[k + 1] / r : 1, rz = r > 1e-4 ? pos[k + 2] / r : 0;
            hjælp.set(1, -(2 * r / 5) * ry, -(2 * r / 5) * rz).normalize();
            const ind = vel[k] * hjælp.x + vel[k + 1] * hjælp.y + vel[k + 2] * hjælp.z;
            if (ind > 0) {
              vel[k] -= ind * hjælp.x;
              vel[k + 1] -= ind * hjælp.y;
              vel[k + 2] -= ind * hjælp.z;
              if (s === 1) tryk += ind;
            }
            const ud = dx - grænse;
            pos[k] -= ud * hjælp.x * 0.9;
            pos[k + 1] -= ud * hjælp.y * 0.9;
            pos[k + 2] -= ud * hjælp.z * 0.9;
            // hold farten oppe, så de glider videre bagud
            const v = Math.hypot(vel[k], vel[k + 1], vel[k + 2]);
            if (v < 4) { vel[k] += dt * 6; }
          }
          // Ude ved siden af og bag Jorden: nogle bliver fanget i halen og skudt ind mod polerne
          const rGrænse = Math.sqrt(Math.max(0, 5 * (dx + næse)));
          if (dx > 0.5 && dx < 7 && Math.abs(r - rGrænse) < 1 && Math.random() < dt * (s === 1 ? 0.9 : 0.025)) {
            const nord = pos[k + 1] >= 0 ? 1 : -1;
            const vinkel = Math.random() * Math.PI * 2;
            fangst[i] = {
              t: 0,
              varighed: 0.8 + Math.random() * 0.5,
              storm: s === 1,
              fra: new THREE.Vector3(pos[k], pos[k + 1], pos[k + 2]),
              via: new THREE.Vector3(JORD_X + 2.2, nord * 2.6 * JORD_R, pos[k + 2] * 0.4),
              til: new THREE.Vector3(JORD_X + Math.cos(vinkel) * 0.45 * JORD_R, nord * 1.0 * JORD_R, Math.sin(vinkel) * 0.45 * JORD_R),
            };
            slags[i] = 2;
            sætFarve(i, farveFanget);
            continue;
          }
          // Langt væk: solvinden starter forfra, solstormen er færdig
          if (pos[k] > JORD_X + 14 || Math.abs(pos[k + 1]) > 16 || Math.abs(pos[k + 2]) > 16) {
            if (s === 0) udsend(i, 0, 1.2);
            else { slags[i] = -1; pos[k + 1] = 9999; }
          }
        }
        sky.geometry.attributes.position.needsUpdate = true;
        sky.geometry.attributes.color.needsUpdate = true;

        // Solstormen trykker magnetfeltet sammen
        storm = Math.max(0, Math.min(1, storm + tryk * 0.004 - dt * 0.12));
        if (faseNr === 2 && storm > 0.15) {
          faseNr = 3;
          fase('Skyen rammer magnetfeltet', 'Jordens magnetfelt bliver trykket sammen på dagsiden og strakt ud på natsiden. Skjoldet holder de fleste partikler ude.', [3, 4]);
          lyd.sus(1.4);
        }
        if (faseNr === 3 && lys > 0.6) {
          faseNr = 4;
          fase('Nordlys!', 'Partikler fra halen af magnetfeltet styrter ned mod polerne. Når de rammer luften ca. 100 til 400 km oppe, lyser den grønt og rødt.', [4, 4]);
        }
        if (faseNr === 4 && cmeTid < 0 && lys < 0.25) {
          faseNr = 0;
          fase(null);
        }
        const a = felt.geometry.attributes.position.array;
        const dag = 0.82 - 0.3 * storm;
        const nat = 1.9 + 1.2 * storm;
        for (let i = 0; i < a.length; i += 3) {
          const x = feltOrg[i];
          a[i] = x < 0 ? x * dag : x * nat;
          a[i + 1] = feltOrg[i + 1] * (x > 0 ? 1 - 0.25 * storm * Math.min(1, x / 4) : 1);
        }
        felt.geometry.attributes.position.needsUpdate = true;
        felt.material.opacity = 0.35 + 0.35 * storm;
        skal.scale.set(1 - 0.35 * storm, 1, 1);
        skal.material.opacity = 0.16 + 0.3 * storm;

        // Nordlyset flakker og falmer langsomt
        lys = Math.max(0, lys - dt * 0.035);
        gardinTekstur.offset.x = tid * 0.03;
        nordlys.forEach((o, i) => {
          const flakker = 0.8 + 0.2 * Math.sin(tid * 5 + i * 1.7) * Math.sin(tid * 2.3 + i);
          o.material.opacity = Math.min(1, lys * 1.3 + 0.06) * flakker;
          o.rotation.y = tid * 0.08 * (i ? -1 : 1);
        });
      },
    };
  },
};

// Nordlysets gardin: lodrette stråler, grønne forneden og røde øverst
function nordlysTekstur() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d');
  for (let x = 0; x < 256; x += 2) {
    const styrke = Math.pow(Math.random(), 2) * 0.8 + 0.2 * (0.5 + 0.5 * Math.sin(x * 0.15));
    const grad = g.createLinearGradient(0, 64, 0, 0);
    grad.addColorStop(0, 'rgba(40,255,120,0)');
    grad.addColorStop(0.15, `rgba(60,255,140,${styrke})`);
    grad.addColorStop(0.6, `rgba(80,255,150,${styrke * 0.5})`);
    grad.addColorStop(0.85, `rgba(255,60,120,${styrke * 0.35})`);
    grad.addColorStop(1, 'rgba(255,60,120,0)');
    g.fillStyle = grad;
    g.fillRect(x, 0, 2, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.x = 3;
  return t;
}

// Jordens overflade: hav, kontinenter, iskapper og lidt skyer
function jordTekstur() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#1b4f9c';
  g.fillRect(0, 0, 512, 256);
  const land = (x, y, rx, ry, farve) => {
    g.fillStyle = farve;
    for (let i = 0; i < 18; i++) {
      g.beginPath();
      g.ellipse(x + (Math.random() - 0.5) * rx * 1.4, y + (Math.random() - 0.5) * ry * 1.4, rx * (0.3 + Math.random() * 0.5), ry * (0.3 + Math.random() * 0.5), Math.random() * 3, 0, Math.PI * 2);
      g.fill();
    }
  };
  // Groft placeret: Amerika, Europa/Afrika, Asien og Australien
  land(110, 80, 50, 40, '#3d8a3f');
  land(150, 170, 30, 45, '#4a8f3a');
  land(270, 80, 30, 25, '#4f8a3c');
  land(275, 150, 35, 45, '#8a7a45');
  land(370, 85, 70, 40, '#5a8a3e');
  land(430, 180, 25, 15, '#9a7a48');
  g.fillStyle = '#f2f6ff';
  g.fillRect(0, 0, 512, 14);
  g.fillRect(0, 240, 512, 16);
  g.globalAlpha = 0.35;
  g.fillStyle = '#ffffff';
  for (let i = 0; i < 60; i++) {
    g.beginPath();
    g.ellipse(Math.random() * 512, 20 + Math.random() * 216, 10 + Math.random() * 30, 3 + Math.random() * 5, 0, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
