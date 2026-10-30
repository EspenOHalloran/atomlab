// En lille måne med sin rigtige form (Phobos og Deimos, Mars M6a): Et kort over radius (meter, 16 bit i rød og grøn,
// lavet af billeder/solsystem/lav_maaner.py) skubber en kugle ud til den rigtige form én gang i JS. Kortet over
// overfladen er i gråtoner, og lyset regnes ud fra formen.
//
// Retningerne (som Mars i klippeplanet.js): længde 0° (siden, der vender mod planeten) mod +x, nord mod +y og 90° Ø
// mod −z. Kortene har −180° til venstre og 0° i midten.
//
// Planetens skygge: Står månen bag planeten set fra Solen, bliver den mørk (en cylinder bag planeten med en blød kant).

import * as THREE from 'three';

const VERTEX = /* glsl */ `
  varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 v = modelMatrix * vec4(position, 1.0);
    vVerden = v.xyz;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uSol, uFarve, uPlanet;
  uniform float uPlanetR, uHarKort, uLys;
  uniform sampler2D tKort;
  varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  void main() {
    vec3 farve = uFarve * (uHarKort > 0.5 ? texture2D(tKort, vUv).r * uLys : 0.75);
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vVerden);
    float i = max(dot(N, uSol), 0.0);
    float e = max(dot(N, V), 0.0);
    // Mørk, støvet overflade: kaster lyset tilbage næsten som Månen (Lommel-Seeliger blandet med lidt Lambert)
    float lys = mix(i, 2.0 * i / (i + e + 0.001), 0.7);
    // Planetens skygge: afstanden fra linjen gennem planetens midte i Solens retning (kun bag planeten)
    vec3 d = vVerden - uPlanet;
    float bag = dot(d, uSol);
    float tvaers = length(d - bag * uSol);
    float skygge = bag < 0.0 ? smoothstep(uPlanetR * 0.985, uPlanetR * 1.015, tvaers) : 1.0;
    gl_FragColor = vec4(farve * lys * skygge + farve * 0.012, 1.0);
  }`;

// skala: km pr. enhed. net: [felter rundt, felter fra pol til pol]. farve: overfladens farve (rgb, ganges på kortet).
// lys: ganges på kortet. middel: middelradius i km (kuglen, indtil formen er hentet).
export function lavFormmåne({ skala, net = [256, 128], farve = [0.5, 0.45, 0.4], lys = 1, middel }) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uFarve: { value: new THREE.Vector3(...farve) },
      uPlanet: { value: new THREE.Vector3(0, 0, -1e6) },
      uPlanetR: { value: 0 },
      tKort: { value: null },
      uHarKort: { value: 0 },
      uLys: { value: lys },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
  // (SphereGeometry har samme retninger: længde −180° ved −x og −90° ved +z)
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(middel / skala, 48, 24), mat);
  const gruppe = new THREE.Group();
  gruppe.add(mesh);
  let radier = null; // { B, H, v } i km
  let størst = middel / skala;

  // Radius (km) i en retning, lineært mellem kortets punkter og hele vejen rundt
  function radius(bredde, længde) {
    const { B, H, v } = radier;
    const x = ((((længde + 180) / 360) * B - 0.5) % B + B) % B;
    const y = THREE.MathUtils.clamp(((90 - bredde) / 180) * H - 0.5, 0, H - 1);
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    const x1 = (x0 + 1) % B, y1 = Math.min(y0 + 1, H - 1);
    const a = v[y0 * B + x0] * (1 - fx) + v[y0 * B + x1] * fx;
    const b = v[y1 * B + x0] * (1 - fx) + v[y1 * B + x1] * fx;
    return a * (1 - fy) + b * fy;
  }
  // Punktet på overfladen i (bredde, længde) i enheder
  const retning = (bredde, længde, ud = new THREE.Vector3()) => {
    const b = THREE.MathUtils.degToRad(bredde), l = THREE.MathUtils.degToRad(længde);
    return ud.set(Math.cos(b) * Math.cos(l), Math.sin(b), -Math.cos(b) * Math.sin(l));
  };

  function bygNet() {
    const [B, H] = net;
    const n = (B + 1) * (H + 1);
    const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), nor = new Float32Array(n * 3);
    const p = new THREE.Vector3();
    størst = 0;
    for (let j = 0; j <= H; j++) {
      const bredde = 90 - (180 * j) / H;
      for (let i = 0; i <= B; i++) {
        const længde = -180 + (360 * i) / B;
        const r = radius(bredde, længde) / skala;
        retning(bredde, længde, p).multiplyScalar(r);
        const k = j * (B + 1) + i;
        pos.set([p.x, p.y, p.z], k * 3);
        uv.set([i / B, 1 - j / H], k * 2);
        størst = Math.max(størst, r);
      }
    }
    // Normalerne ud fra naboerne (hele vejen rundt, så sømmen ikke kan ses). Ved polerne: retningen ud.
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3(), N = new THREE.Vector3();
    const punkt = (i, j, ud) => ud.fromArray(pos, (j * (B + 1) + ((i + B) % B)) * 3);
    for (let j = 0; j <= H; j++) {
      for (let i = 0; i <= B; i++) {
        const k = j * (B + 1) + i;
        if (j === 0 || j === H) N.fromArray(pos, k * 3).normalize();
        else {
          punkt(i + 1, j, a).sub(punkt(i - 1, j, b)); // mod øst
          punkt(i, j - 1, c).sub(punkt(i, j + 1, d)); // mod nord
          N.crossVectors(a, c).normalize();
          if (N.dot(punkt(i, j, b)) < 0) N.negate();
        }
        nor.set([N.x, N.y, N.z], k * 3);
      }
    }
    const indeks = [];
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < B; i++) {
        const k = j * (B + 1) + i;
        if (j > 0) indeks.push(k, k + B + 1, k + 1);
        if (j < H - 1) indeks.push(k + 1, k + B + 1, k + B + 2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(indeks);
    g.computeBoundingSphere();
    mesh.geometry.dispose();
    mesh.geometry = g;
  }

  return {
    gruppe,
    mesh,
    // Den største radius (enheder), så kameraet ikke kommer ind i månen
    get radius() { return størst; },
    get harForm() { return !!radier; },
    // Kortet over radius (et billede, der er hentet). Formen bygges med det samme.
    sætForm(billede) {
      const c = document.createElement('canvas');
      c.width = billede.width;
      c.height = billede.height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(billede, 0, 0);
      const px = g.getImageData(0, 0, c.width, c.height).data;
      const v = new Float32Array(c.width * c.height);
      for (let k = 0; k < v.length; k++) v[k] = (px[k * 4] * 256 + px[k * 4 + 1]) / 1000;
      radier = { B: c.width, H: c.height, v };
      bygNet();
    },
    sætKort(t) { mat.uniforms.tKort.value = t; mat.uniforms.uHarKort.value = t ? 1 : 0; },
    // Solens retning og planetens midte og radius i verden (til skyggen)
    sæt(sol, planet, planetR) {
      mat.uniforms.uSol.value.copy(sol);
      mat.uniforms.uPlanet.value.copy(planet);
      mat.uniforms.uPlanetR.value = planetR;
    },
    // Til tests: radius (km) og retningen ud (i månens egne retninger)
    radiusVed: (bredde, længde) => (radier ? radius(bredde, længde) : middel),
    retning,
    stop() {
      mesh.geometry.dispose();
      mat.dispose();
    },
  };
}
