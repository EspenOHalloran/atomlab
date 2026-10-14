// Rumtid som en gummidug: tunge ting laver en fordybning, og andre ting følger krumningen.

import * as THREE from 'three';
import { gitterDug, stjerne, glød, KVALITET } from './faelles.js';

export default {
  id: 'rumtid',
  navn: 'Rumtid',
  ikon: '🌐',
  undertitel: 'Tyngdekraft som en gummidug',
  citat: 'feynmanVæv',
  kamera: { retning: [0, 0.62, 0.78], radius: 21 },
  tal: [
    ['Teorien', 'Einstein, 1915'],
    ['Bevist', 'Solformørkelsen 1919'],
    ['Lys bøjer ved Solen', 'ca. 0,0005°'],
    ['GPS uden rettelse', 'fejl på 10 km pr. døgn'],
  ],
  kort: `
    <p>Einstein fandt i 1915 ud af, at tyngdekraft ikke er et usynligt reb, der trækker. <b>Tunge ting krummer rummet og tiden omkring sig</b>, og andre ting følger krumningen, ligesom kugler, der triller ned i en fordybning i en gummidug.</p>
    <p>Prøv at lægge stjerner og sorte huller på dugen, og skyd planeter ind. Har de den rigtige fart, går de i bane. For langsomt, og de falder ind. For hurtigt, og de flyver væk.</p>`,
  nørd: `
    <p><b>Gummidugen er kun en model.</b> Den snyder lidt, for den bruger jo selv tyngdekraft til at trække kuglerne ned i fordybningen! I virkeligheden er det <i>rumtiden</i>, der krummer, og for ting, der bevæger sig langsomt, er det mest tidens krumning, der får dem til at falde.</p>
    <p><b>Tid går langsommere tæt på tunge ting.</b> Urene i GPS-satellitterne går ca. 38 milliontedele sekund hurtigere pr. døgn end ure på Jorden. Rettede man ikke for det, ville GPS tage fejl med omkring 10 km om dagen.</p>
    <p><b>Lys bøjer også.</b> Ved en solformørkelse i 1919 målte man, at stjernelys bøjer om Solen, præcis som Einstein havde regnet ud. Det gjorde ham verdensberømt. Prøv knappen "Send en lysstråle forbi".</p>
    <p><b>Merkur</b> drejer sin bane en lille smule mere, end Newtons tyngdelov kan forklare. Einsteins teori passer præcist.</p>`,

  lav(gruppe, { effekter }) {
    const dug = gitterDug(60, Math.round(31 + 10 * KVALITET), Math.round(80 + 40 * KVALITET));
    gruppe.add(dug.mesh);
    const masser = []; // { x, z, dybde, bredde, styrke, fangeRadius, mesh }
    const legemer = []; // { x, z, vx, vz, mesh, hale, punkter, lys }

    const højde = (x, z) => {
      let y = 0;
      for (const m of masser) {
        const d2 = (x - m.x) ** 2 + (z - m.z) ** 2;
        y -= m.dybde / Math.sqrt(1 + d2 / (m.bredde * m.bredde));
      }
      return y;
    };

    function tilføjMasse(type, x, z) {
      let mesh;
      let m;
      if (type === 'stjerne') {
        mesh = stjerne(1.3, '#fff0b0', '#ff8a2a', new THREE.Color(2.2, 1.6, 0.6), 3.4);
        m = { dybde: 5, bredde: 3, styrke: 40, fangeRadius: 1.3 };
      } else {
        mesh = new THREE.Group();
        mesh.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), new THREE.MeshBasicMaterial({ color: 0x000000 })));
        mesh.add(glød(new THREE.Color(1.6, 0.9, 2.4), 4.5, 0.7));
        m = { dybde: 13, bredde: 1.6, styrke: 120, fangeRadius: 1.6 };
      }
      Object.assign(m, { x, z, mesh, type });
      gruppe.add(mesh);
      masser.push(m);
    }

    function tilføjLegeme(x, z, vx, vz, lys = false) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(lys ? 0.22 : 0.45, 16, 12),
        lys ? new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 3, 2) }) : new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.6, 0.55), roughness: 0.5 }),
      );
      const n = lys ? 80 : 90;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      const hale = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: lys ? 0xfff3b0 : 0x9fd3ff, transparent: true, opacity: 0.6, depthWrite: false }));
      hale.frustumCulled = false;
      gruppe.add(mesh, hale);
      const punkter = Array.from({ length: n }, () => new THREE.Vector3(x, højde(x, z), z));
      legemer.push({ x, z, vx, vz, mesh, hale, punkter, lys, liv: lys ? 6 : Infinity });
    }

    function fjernLegeme(l) {
      gruppe.remove(l.mesh, l.hale);
      l.mesh.geometry.dispose();
      l.mesh.material.dispose();
      l.hale.geometry.dispose();
      l.hale.material.dispose();
      l.væk = true;
    }

    // Start: en stjerne med to planeter i bane
    tilføjMasse('stjerne', 0, 0);
    for (const r of [8, 14]) tilføjLegeme(r, 0, 0, Math.sqrt(40 / r));

    const tilfældigSted = (min, max) => {
      const v = Math.random() * Math.PI * 2;
      const r = min + Math.random() * (max - min);
      return [Math.cos(v) * r, Math.sin(v) * r];
    };

    return {
      styring: [
        { tekst: '⭐ Læg en stjerne', handling: () => { if (masser.length < 5) tilføjMasse('stjerne', ...tilfældigSted(9, 16)); } },
        { tekst: '⚫ Læg et sort hul', handling: () => { if (masser.length < 5) tilføjMasse('sort hul', ...tilfældigSted(8, 15)); } },
        {
          tekst: '🪐 Skyd en planet ind', handling: () => {
            const [x, z] = tilfældigSted(18, 20);
            const ind = new THREE.Vector2(-x, -z).normalize();
            const tværs = new THREE.Vector2(-ind.y, ind.x);
            const fart = 1.3 + Math.random() * 1.2;
            tilføjLegeme(x, z, tværs.x * fart + ind.x * 0.4, tværs.y * fart + ind.y * 0.4);
          },
        },
        {
          tekst: '💡 Send en lysstråle forbi', handling: () => {
            const z = (Math.random() < 0.5 ? -1 : 1) * (2.5 + Math.random() * 3);
            tilføjLegeme(-26, z, 14, 0, true);
          },
        },
        {
          tekst: '↺ Ryd dugen', handling: () => {
            for (const l of legemer) fjernLegeme(l);
            legemer.length = 0;
            for (const m of masser) gruppe.remove(m.mesh);
            masser.length = 0;
            tilføjMasse('stjerne', 0, 0);
          },
        },
      ],

      opdater(dt) {
        const skridt = 4;
        const h = dt / skridt;
        for (let s = 0; s < skridt; s++) {
          for (const l of legemer) {
            if (l.væk) continue;
            let ax = 0, az = 0;
            for (const m of masser) {
              const dx = m.x - l.x, dz = m.z - l.z;
              const d2 = dx * dx + dz * dz + 0.6;
              const f = (m.styrke * (l.lys ? 0.25 : 1)) / (d2 * Math.sqrt(d2));
              ax += dx * f;
              az += dz * f;
              if (Math.sqrt(dx * dx + dz * dz) < m.fangeRadius) {
                effekter.glimt(new THREE.Vector3(l.x, højde(l.x, l.z), l.z), m.type === 'stjerne' ? 4 : 3, m.type === 'stjerne' ? new THREE.Color(3, 2, 0.8) : new THREE.Color(1.6, 0.8, 2.6), 0.6);
                fjernLegeme(l);
                break;
              }
            }
            if (l.væk) continue;
            l.vx += ax * h;
            l.vz += az * h;
            l.x += l.vx * h;
            l.z += l.vz * h;
          }
        }
        for (const l of legemer) {
          if (l.væk) continue;
          l.liv -= dt;
          if (Math.hypot(l.x, l.z) > 30 || l.liv <= 0) { fjernLegeme(l); continue; }
          const y = højde(l.x, l.z) + (l.lys ? 0.25 : 0.45);
          l.mesh.position.set(l.x, y, l.z);
          l.punkter.pop();
          l.punkter.unshift(l.mesh.position.clone());
          const a = l.hale.geometry.attributes.position.array;
          l.punkter.forEach((p, i) => { a[i * 3] = p.x; a[i * 3 + 1] = p.y; a[i * 3 + 2] = p.z; });
          l.hale.geometry.attributes.position.needsUpdate = true;
        }
        for (let i = legemer.length - 1; i >= 0; i--) if (legemer[i].væk) legemer.splice(i, 1);
        for (const m of masser) m.mesh.position.set(m.x, højde(m.x, m.z) + (m.type === 'stjerne' ? 1.2 : 0.4), m.z);
        dug.opdater(højde);
      },
    };
  },
};
