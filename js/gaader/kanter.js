// Kantudglatning kun i Gåderne (18. november 2026): Den fælles renderer tegner uden (antialias: false, se scene3d.js),
// så skiven, ringene, kolben og kuglerne fik trappekanter. Mens Gåderne er åbne, får komponisten et lag med flere
// prøver pr. pixel (MSAA), og når man går, får den et almindeligt lag igen. Tabletten (en Mali, hvor MSAA er billig)
// får 2 prøver, pc 4. Testene tegner uden komponist (TEST_HURTIG), så der sker intet.
// Værn: Er der under 45 billeder i sekundet i 3 sekunder, slås udglatningen fra (ikke med ?test, hvor testbrowseren
// altid er langsom, ligesom linsens dynamiske opløsning i js/kosmos/linse.js).
// Rettet efter målingen på Tab A11 (22. november 2026): Værnet slog udglatningen fra, mens Sort hul lavede sine shadere
// (ca. 3 s med ryk), og så var billedet grimt resten af besøget, selvom det kørte med 91 billeder/s. Nu måler værnet ikke
// de første RO sekunder efter start og efter nye shadere (nyeShadere i scene3d.js), og har det slået udglatningen fra,
// prøves den igen én gang, når billedet bagefter følger skærmens loft (mindst 90 % i 5 s). Falder den igen, er det
// grafikkortet, og så bliver den slukket, til Gåderne lukkes.
import * as THREE from 'three';
import { verden, LAV_KVALITET, TEST_HURTIG, nyeShadere, skærmLoft, SHADER_RO } from '../scene3d.js';

export const PRØVER = LAV_KVALITET ? 2 : 4;
// fps: grænsen, ro: sekunder efter start, ryk: længere billeder tæller ikke, igen: andel af loftet for at prøve igen.
// Kun testene ændrer dem (testbrowseren er langsom).
export const VÆRN = { til: !new URLSearchParams(location.search).has('test'), fps: 45, ro: SHADER_RO, ryk: 0.5, igen: 0.9, tid: 3, igenTid: 5 };
let til = false; // MSAA er slået til lige nu
let ønsket = false; // Gåderne er åbne og vil have udglatning
const måling = { tid: 0, billeder: 0, sidst: 0, fra: 0, slukket: false, prøvetIgen: false };

// Den rigtige tid mellem billederne (dt fra scene3d.js er højst 0,05 s, så den kan ikke måle langsomme billeder).
// nu: tiden i ms (testene giver selv tiderne, målBillede)
function mål(nu) {
  const dt = (nu - måling.sidst) / 1000;
  måling.sidst = nu;
  // Det første billede, en skjult fane, et ryk, de første sekunder og tiden lige efter nye shadere tæller ikke
  if (dt > VÆRN.ryk || nu < måling.fra || nyeShadere(nu)) { måling.tid = måling.billeder = 0; return; }
  måling.tid += dt;
  måling.billeder++;
  if (måling.tid < (måling.slukket ? VÆRN.igenTid : VÆRN.tid)) return;
  const fps = måling.billeder / måling.tid;
  måling.tid = måling.billeder = 0;
  if (!måling.slukket && fps < VÆRN.fps) {
    måling.slukket = true;
    skift(false);
    globalThis.atomlabMåler?.(`Gåderne: kantudglatning slået fra (${fps.toFixed(0)} billeder/s)`);
  } else if (måling.slukket && !måling.prøvetIgen && fps >= VÆRN.igen * skærmLoft()) {
    måling.slukket = false;
    måling.prøvetIgen = true;
    skift(true);
    globalThis.atomlabMåler?.(`Gåderne: kantudglatning slået til igen (${fps.toFixed(0)} billeder/s uden)`);
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

// Gåderne kalder udglat(true) i start og udglat(false) i stop
export function udglat(tænd) {
  if (!verden.komponist || TEST_HURTIG || tænd === ønsket) return;
  ønsket = tænd;
  Object.assign(måling, { tid: 0, billeder: 0, sidst: 0, slukket: false, prøvetIgen: false });
  skift(tænd);
  if (tænd && VÆRN.til) verden.opdateringer.add(målNu);
  else verden.opdateringer.delete(målNu);
}

function skift(tænd) {
  const { komponist } = verden;
  if (tænd === til) return;
  til = tænd;
  komponist.reset(nytLag(tænd ? PRØVER : 0)); // reset frigiver de gamle lag og laver to nye som det givne
  // Med MSAA er kanterne glatte i forvejen, så den fælles udglatning bagefter (SMAA/FXAA, G2) holder pause imens
  if (verden.kanter) verden.kanter.enabled = !tænd;
  måling.fra = performance.now() + VÆRN.ro * 1000; // (nye lag, og billedet skal falde til ro)
}

const målNu = () => mål(performance.now());

// Til testene: værnets tilstand, og ét billede på tiden nu (ms), så testen selv bestemmer tiden mellem billederne
export const værnTilstand = () => ({ ønsket, til, slukket: måling.slukket, prøvetIgen: måling.prøvetIgen });
export const målBillede = (nu) => mål(nu);

export const prøver = () => verden.komponist?.renderTarget1.samples ?? 0;
