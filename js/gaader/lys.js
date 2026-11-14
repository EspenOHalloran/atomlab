// Lysene for gåderne (G4a, docs/plan-gaader-3d.md, tabellen "Gåderne"): enkle lys med en form, man kan kende, ikke små
// animationer. Indtil en gåde får sin egen scene, står dens lys stort bag kortet (js/gaader/scene.js), og i G4b står de
// langs skinnen. lavLys(id) giver { gruppe, opdater(dt, tid) } eller null for en ukendt gåde. Lysene er symboler, ikke i skala.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG } from '../scene3d.js';
import { glød, prikTekstur } from '../kosmos/faelles.js';
import { fuld } from './streg.js';

const prikker = (antal, størrelse) => {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(antal * 3);
  const farve = new Float32Array(antal * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(farve, 3));
  const p = new THREE.Points(geo, new THREE.PointsMaterial({
    size: størrelse, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  return { p, pos, farve };
};

const LYS = {
  // Et par, der bliver til et glimt: to partikler kredser om hinanden, mødes og lyser op, og så kommer et nyt par
  antistof() {
    const g = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.3, 20, 14);
    const a = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xffb340, emissive: 0xffb340, emissiveIntensity: 0.8 }));
    const b = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x52d9ff, emissive: 0x52d9ff, emissiveIntensity: 0.8 }));
    const glimt = glød(new THREE.Color(1.5, 1.4, 1.2), 4, 0);
    g.add(a, b, glimt);
    return {
      gruppe: g,
      opdater(dt, tid) {
        const f = (tid / 3) % 1; // ét par hvert 3. sekund
        const r = 1.6 * Math.max(0, 1 - f / 0.8);
        const v = tid * 2.4;
        a.position.set(Math.cos(v) * r, Math.sin(v) * r * 0.5, 0);
        b.position.set(-a.position.x, -a.position.y, 0);
        a.visible = b.visible = f < 0.8;
        glimt.material.opacity = f < 0.8 ? 0 : (ROLIG ? 0.6 : 1) * Math.sin(((f - 0.8) / 0.2) * Math.PI);
      },
    };
  },

  // En kolbe med et lyn (Millers forsøg)
  begyndelsen() {
    const g = new THREE.Group();
    const glas = new THREE.Color(0.55, 0.8, 0.95);
    const profil = [];
    for (let i = 0; i <= 48; i++) {
      const a = Math.PI / 2 + 0.38 + (i / 48) * (Math.PI * 2 - 0.76); // åben foroven, hvor halsen sidder
      profil.push([Math.cos(a) * 1.5, Math.sin(a) * 1.5 - 0.6, 0]);
    }
    const hals = Math.sin(0.38) * 1.5;
    const halsBund = Math.cos(0.38) * 1.5 - 0.6;
    const venstre = [[-hals, halsBund, 0], [-hals, 2.1, 0]];
    const højre = [[hals, halsBund, 0], [hals, 2.1, 0]];
    g.add(fuld(profil, glas, { bredde: 2.5 }), fuld(venstre, glas, { bredde: 2.5 }), fuld(højre, glas, { bredde: 2.5 }));
    // Vandet: bunden af kuglen under en vandret overflade
    const form = new THREE.Shape();
    const v0 = Math.PI + 0.45;
    form.absarc(0, 0, 1.42, v0, Math.PI * 2 - 0.45, false);
    form.lineTo(Math.cos(v0) * 1.42, Math.sin(v0) * 1.42);
    const vand = new THREE.Mesh(new THREE.ShapeGeometry(form, 24), new THREE.MeshBasicMaterial({ color: 0x1d4a6a, transparent: true, opacity: 0.6 }));
    vand.position.y = -0.6;
    g.add(vand);
    const lyn = fuld([[-0.2, 1.6, 0], [0.25, 0.7, 0], [-0.15, 0.3, 0], [0.3, -0.5, 0]], new THREE.Color(1.6, 1.5, 0.9), { bredde: 3 });
    g.add(lyn);
    return {
      gruppe: g,
      opdater(dt, tid) {
        // Med "Reducer bevægelse" lyser lynet roligt i stedet for at blinke
        const f = tid % 2.2;
        lyn.visible = ROLIG || f < 0.12 || (f > 0.2 && f < 0.28);
      },
    };
  },

  // Et blåt lys blandt mange hvide
  liv() {
    const g = new THREE.Group();
    const N = LAV_KVALITET ? 180 : 300;
    const { p, pos, farve } = prikker(N, 0.16);
    for (let i = 0; i < N; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(1.2 + Math.random() * 2);
      pos.set([v.x, v.y, v.z], i * 3);
      const l = 0.5 + Math.random() * 0.5;
      farve.set([l, l, l * 1.05], i * 3);
    }
    const blå = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), new THREE.MeshStandardMaterial({ color: 0x3d8bff, emissive: 0x3d8bff, emissiveIntensity: 0.9 }));
    g.add(p, blå, glød(new THREE.Color(0.25, 0.5, 1.4), 2, 0.6));
    return { gruppe: g, opdater(dt) { p.rotation.y += dt * 0.05; } };
  },

  // En sort skive med en glødende ring
  sorthul() {
    const g = new THREE.Group();
    const skive = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    skive.renderOrder = 2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.12, 12, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.25, 0.62, 0.22) }));
    ring.rotation.x = 1.25;
    const kant = new THREE.Mesh(new THREE.RingGeometry(1, 1.12, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.75, 0.38, 0.14) }));
    kant.position.z = -0.01;
    const skær = glød(new THREE.Color(1, 0.5, 0.2), 6, 0.22);
    skær.position.z = -2; // bag skiven, så skiven forbliver sort
    g.add(skær, ring, kant, skive);
    return { gruppe: g, opdater(dt) { ring.rotation.z += dt * 0.3; } };
  },

  // En spiralgalakse (uden glorie: Det mørke stof kan ikke ses)
  moerktstof() {
    const g = new THREE.Group();
    const N = LAV_KVALITET ? 900 : 1600;
    const { p, pos, farve } = prikker(N, 0.11);
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const arm = i % 2;
      const r = 0.15 + Math.pow(Math.random(), 0.8) * 2.6;
      const a = arm * Math.PI + Math.log(r + 0.3) * 2.4 + (Math.random() - 0.5) * 0.6;
      pos.set([Math.cos(a) * r, (Math.random() - 0.5) * 0.12, Math.sin(a) * r], i * 3);
      c.setHSL(r < 0.7 ? 0.11 : 0.6, 0.5, 0.75 - r * 0.1);
      farve.set([c.r, c.g, c.b], i * 3);
    }
    const vippet = new THREE.Group(); // vippet mod kameraet, så den drejer om sin egen akse
    vippet.rotation.x = 0.9;
    vippet.add(p);
    g.add(vippet, glød(new THREE.Color(1, 0.85, 0.6), 1.4, 0.5));
    return { gruppe: g, opdater(dt) { p.rotation.y += dt * 0.12; } };
  },
};

export function lavLys(id) {
  return LYS[id]?.() ?? null;
}
