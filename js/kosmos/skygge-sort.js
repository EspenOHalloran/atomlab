// Skyggen om det sorte hul holdes sort, også med gløden. Flyttet uændret fra js/kosmos/sorthul.js (22. november 2026), så
// Gådernes scene Sort hul (js/gaader/sorthul.js) kan bruge den. enhed(): enheder i scenen pr. enhed i linsen (Kosmos 1,
// Gåderne hullets størrelse, se iGruppensRum i js/kosmos/linse.js).

import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { skyggeVinkel } from '../data/sorthul.js';

// Skyggen holdes sort. Gløden (UnrealBloomPass) breder lyset fra gassen ud over hele billedet, også ind over skyggen,
// så den så grå ud. Derfor gemmes billedet lige før gløden, og inde i skyggen bruges det billede i stedet.
// Så er skyggen sort, og gassen, astronauten og stjernen foran skyggen kan stadig ses (bare uden glorie).
// Uden glød (TEST_HURTIG) tegnes efterbehandlingen ikke, og skyggen er sort i forvejen.
const KOPI_VS = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';

export function holdSkyggenSort(verden, hul, { enhed = () => 1 } = {}) {
  const før = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  const gem = new GemPass(før);
  const bland = new SkyggePass(før, verden.kamera, hul, enhed);
  const komponist = verden.komponist;
  const i = komponist.passes.indexOf(verden.glød);
  komponist.insertPass(gem, i);
  komponist.insertPass(bland, i + 2);
  return {
    skærm: () => bland.skærm(),
    slå: (til) => { gem.enabled = bland.enabled = til; }, // til tests og prøvebilleder
    fjern() {
      komponist.removePass(gem);
      komponist.removePass(bland);
      gem.materiale.dispose();
      bland.materiale.dispose();
      før.dispose();
    },
  };
}

// Gemmer billedet, som det ser ud før gløden
class GemPass extends Pass {
  constructor(før) {
    super();
    this.før = før;
    this.needsSwap = false;
    this.materiale = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: KOPI_VS,
      fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main() { gl_FragColor = texture2D(tDiffuse, vUv); }',
    });
    this.quad = new FullScreenQuad(this.materiale);
  }

  setSize(bredde, højde) {
    this.før.setSize(bredde, højde);
  }

  render(renderer, writeBuffer, readBuffer) {
    this.materiale.uniforms.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.før);
    this.quad.render(renderer);
  }
}

// Inde i skyggen: billedet fra før gløden. Udenfor: billedet med glød. Kanten er lidt blød.
class SkyggePass extends Pass {
  constructor(før, kamera, hul, enhed) {
    super();
    this.kamera = kamera;
    this.hul = hul;
    this.enhed = enhed;
    this.midt = new THREE.Vector3();
    this.kant = new THREE.Vector3();
    this.op = new THREE.Vector3();
    this.materiale = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null }, tFoer: { value: før.texture },
        uMidt: { value: new THREE.Vector2() }, uRadius: { value: 1 }, uStoerrelse: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: KOPI_VS,
      fragmentShader: `uniform sampler2D tDiffuse; uniform sampler2D tFoer; uniform vec2 uMidt; uniform float uRadius; uniform vec2 uStoerrelse; varying vec2 vUv;
        void main() {
          float d = length(vUv * uStoerrelse - uMidt) / uRadius;
          float inde = 1.0 - smoothstep(0.8, 1.0, d);
          gl_FragColor = mix(texture2D(tDiffuse, vUv), texture2D(tFoer, vUv), inde);
        }`,
    });
    this.quad = new FullScreenQuad(this.materiale);
  }

  setSize(bredde, højde) {
    this.materiale.uniforms.uStoerrelse.value.set(bredde, højde);
  }

  // Skyggens midte og radius på skærmen (i punkter i lærredet). Radius fra √27 M set fra kameraets afstand (i linsens
  // enheder: afstanden i scenen delt med enhed()).
  måling(størrelse) {
    this.midt.setFromMatrixPosition(this.hul.matrixWorld);
    const afstand = this.kamera.position.distanceTo(this.midt);
    this.op.set(0, 1, 0).applyQuaternion(this.kamera.quaternion);
    this.kant.copy(this.midt).addScaledVector(this.op, afstand * Math.tan(skyggeVinkel(afstand / this.enhed())));
    this.midt.project(this.kamera);
    this.kant.project(this.kamera);
    const x = (this.midt.x + 1) / 2 * størrelse.x, y = (this.midt.y + 1) / 2 * størrelse.y;
    return { x, y, r: Math.max(1, Math.hypot((this.kant.x - this.midt.x) / 2 * størrelse.x, (this.kant.y - this.midt.y) / 2 * størrelse.y)) };
  }

  // Til tests: skyggen i CSS-pixel med y nedad
  skærm() {
    const m = this.måling({ x: innerWidth, y: innerHeight });
    return { x: m.x, y: innerHeight - m.y, r: m.r };
  }

  render(renderer, writeBuffer, readBuffer) {
    const u = this.materiale.uniforms;
    const m = this.måling(u.uStoerrelse.value);
    u.uMidt.value.set(m.x, m.y);
    u.uRadius.value = m.r;
    u.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }
}

