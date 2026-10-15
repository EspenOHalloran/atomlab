// Fælles effekter til Stjerneovnen og Reaktoren: lysglimt, chokbølger,
// små partikler med hale (elektron, positron, neutrino, gamma) og tekst, der svæver op.

import * as THREE from 'three';
import { lavPrikTekstur, ROLIG } from './scene3d.js';

const prik = () => (prik.t ??= lavPrikTekstur(true));

let ringTekstur = null;
function lavRingTekstur() {
  if (ringTekstur) return ringTekstur;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.7, 'rgba(255,255,255,0)');
  grad.addColorStop(0.86, 'rgba(255,255,255,0.9)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  ringTekstur = new THREE.CanvasTexture(c);
  ringTekstur.colorSpace = THREE.SRGBColorSpace;
  return ringTekstur;
}
export { lavRingTekstur };

export const FARVER = {
  elektron: new THREE.Color(1.3, 3.4, 4.2),
  elektronSvag: new THREE.Color(0.45, 1.3, 1.7), // til steder med meget lys omkring (fx Batteriet)
  positron: new THREE.Color(4.2, 1.0, 3.4),
  neutrino: new THREE.Color(0.9, 0.9, 1.0),
  gamma: new THREE.Color(3.5, 3.2, 1.6),
  neutron: new THREE.Color(1.6, 1.9, 2.6),
};

const kugleGeo = new THREE.SphereGeometry(0.2, 12, 8);

export class Effekter {
  constructor(forælder) {
    this.forælder = forælder;
    this.liste = [];
  }

  // Et lysglimt, der vokser og falmer
  glimt(pos, størrelse = 3, farve = FARVER.gamma, varighed = 0.6) {
    if (ROLIG) størrelse *= 0.6; // dæmpet ved "reducer bevægelse"
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: prik(), color: farve, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    s.position.copy(pos);
    this.forælder.add(s);
    this.liste.push({ obj: s, tid: 0, varighed, opdater: (e, t) => {
      s.scale.setScalar(størrelse * (0.4 + 0.9 * t));
      s.material.opacity = (1 - t) * 0.95;
    } });
  }

  // En lysende ring, der udvider sig (chokbølge)
  bølge(pos, størrelse = 8, farve = new THREE.Color(2.2, 1.8, 1.2), varighed = 0.9) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: lavRingTekstur(), color: farve, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    s.position.copy(pos);
    this.forælder.add(s);
    this.liste.push({ obj: s, tid: 0, varighed, opdater: (e, t) => {
      s.scale.setScalar(0.5 + størrelse * t);
      s.material.opacity = (1 - t) * 0.9;
    } });
  }

  // En lille partikel, der skydes ud og trækker en hale efter sig
  skyd(fra, retning, slags = 'elektron', fart = 26, varighed = 1.6) {
    const farve = FARVER[slags] || FARVER.elektron;
    const spøgelse = slags === 'neutrino';
    const kugle = new THREE.Mesh(kugleGeo, new THREE.MeshBasicMaterial({ color: farve, transparent: true }));
    kugle.scale.setScalar(spøgelse ? 0.45 : slags === 'neutron' ? 1.6 : 1.1);
    kugle.position.copy(fra);
    const n = 16;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const hale = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: farve, transparent: true, opacity: spøgelse ? 0.25 : 0.8, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    hale.frustumCulled = false;
    const historik = Array.from({ length: n }, () => fra.clone());
    const v = retning.clone().normalize().multiplyScalar(spøgelse ? fart * 1.6 : fart);
    this.forælder.add(kugle, hale);
    this.liste.push({ obj: kugle, ekstra: hale, tid: 0, varighed, opdater: (dt, t) => {
      kugle.position.addScaledVector(v, dt);
      historik.pop();
      historik.unshift(kugle.position.clone());
      const a = geo.attributes.position.array;
      historik.forEach((p, i) => { a[i * 3] = p.x; a[i * 3 + 1] = p.y; a[i * 3 + 2] = p.z; });
      geo.attributes.position.needsUpdate = true;
      const synlig = Math.min(1, (1 - t) * 3);
      kugle.material.opacity = synlig;
      hale.material.opacity = Math.min(hale.material.opacity, synlig * 0.8);
    } });
  }

  // Tekst, der svæver op og forsvinder (fx "+5,49 MeV")
  tekst(pos, tekst, farve = '#ffd43b', størrelse = 1.6, varighed = 1.8) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 64;
    const g = c.getContext('2d');
    g.font = '800 40px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.shadowColor = 'rgba(0,0,0,0.8)';
    g.shadowBlur = 8;
    g.fillStyle = farve;
    g.fillText(tekst, 128, 34);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false }));
    s.scale.set(størrelse * 4, størrelse, 1);
    s.position.copy(pos);
    s.renderOrder = 10;
    this.forælder.add(s);
    this.liste.push({ obj: s, egenTekstur: true, tid: 0, varighed, opdater: (dt, tt) => {
      s.position.y += dt * 1.6;
      s.material.opacity = tt < 0.7 ? 1 : (1 - tt) / 0.3;
    } });
  }

  opdater(dt) {
    for (const e of this.liste) {
      e.tid += dt;
      const t = Math.min(1, e.tid / e.varighed);
      e.opdater(dt, t);
      if (t >= 1) {
        this.forælder.remove(e.obj);
        if (e.egenTekstur) e.obj.material.map.dispose(); // delte teksturer må ikke smides væk
        e.obj.material.dispose();
        if (e.ekstra) {
          this.forælder.remove(e.ekstra);
          e.ekstra.geometry.dispose();
          e.ekstra.material.dispose();
        }
      }
    }
    this.liste = this.liste.filter((e) => e.tid < e.varighed);
  }
}
