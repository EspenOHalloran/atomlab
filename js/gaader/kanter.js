// Kantudglatning kun i Gåderne (18. november 2026): Den fælles renderer tegner uden (antialias: false, se scene3d.js),
// så skiven, ringene, kolben og kuglerne fik trappekanter. Mens Gåderne er åbne, får komponisten et lag med flere
// prøver pr. pixel (MSAA), og når man går, får den et almindeligt lag igen. Tabletten (en Mali, hvor MSAA er billig)
// får 2 prøver, pc 4. Testene tegner uden komponist (TEST_HURTIG), så der sker intet.
import * as THREE from 'three';
import { verden, LAV_KVALITET, TEST_HURTIG } from '../scene3d.js';

export const PRØVER = LAV_KVALITET ? 2 : 4;
let til = false;

function nytLag(samples) {
  const { renderer } = verden;
  const s = renderer.getSize(new THREE.Vector2());
  const pr = renderer.getPixelRatio();
  const lag = new THREE.WebGLRenderTarget(s.x * pr, s.y * pr, { type: THREE.HalfFloatType, samples });
  lag.texture.name = 'EffectComposer.rt1';
  return lag;
}

export function udglat(tænd) {
  const { komponist } = verden;
  if (!komponist || TEST_HURTIG || tænd === til) return;
  til = tænd;
  komponist.reset(nytLag(tænd ? PRØVER : 0)); // reset frigiver de gamle lag og laver to nye som det givne
}

export const prøver = () => verden.komponist?.renderTarget1.samples ?? 0;
