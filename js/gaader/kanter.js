// Kantudglatning kun i Gåderne (18. november 2026): Den fælles renderer tegner uden (antialias: false, se scene3d.js),
// så skiven, ringene, kolben og kuglerne fik trappekanter. Mens Gåderne er åbne, får komponisten et lag med flere
// prøver pr. pixel (MSAA), og når man går, får den et almindeligt lag igen. Tabletten (en Mali, hvor MSAA er billig)
// får 2 prøver, pc 4. Testene tegner uden komponist (TEST_HURTIG), så der sker intet.
// Værn: Er der under 45 billeder i sekundet i 3 sekunder, slås udglatningen fra resten af besøget (ikke med ?test, hvor
// testbrowseren altid er langsom, ligesom linsens dynamiske opløsning i js/kosmos/linse.js).
import * as THREE from 'three';
import { verden, LAV_KVALITET, TEST_HURTIG } from '../scene3d.js';

export const PRØVER = LAV_KVALITET ? 2 : 4;
const VÆRN = !new URLSearchParams(location.search).has('test');
const FPS_MINDST = 45;
let til = false;
const måling = { tid: 0, billeder: 0, sidst: 0 };

// Den rigtige tid mellem billederne (dt fra scene3d.js er højst 0,05 s, så den kan ikke måle langsomme billeder)
function mål() {
  const nu = performance.now();
  const dt = (nu - måling.sidst) / 1000;
  måling.sidst = nu;
  if (dt > 0.5) { måling.tid = måling.billeder = 0; return; } // det første billede eller en skjult fane tæller ikke
  måling.tid += dt;
  måling.billeder++;
  if (måling.tid < 3) return;
  const fps = måling.billeder / måling.tid;
  måling.tid = måling.billeder = 0;
  if (fps < FPS_MINDST) {
    udglat(false);
    globalThis.atomlabMåler?.(`Gåderne: kantudglatning slået fra (${fps.toFixed(0)} billeder/s)`);
  }
}

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
  // Med MSAA er kanterne glatte i forvejen, så den fælles udglatning bagefter (SMAA/FXAA, G2) holder pause imens
  if (verden.kanter) verden.kanter.enabled = !tænd;
  måling.tid = måling.billeder = måling.sidst = 0;
  if (tænd && VÆRN) verden.opdateringer.add(mål);
  else verden.opdateringer.delete(mål);
}

export const prøver = () => verden.komponist?.renderTarget1.samples ?? 0;
