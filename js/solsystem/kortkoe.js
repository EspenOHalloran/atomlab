// Kortkøen (feedback nr. 5, 16. november 2026): Store kort lægges i grafikkortet ét pr. billede, i stedet for at alle,
// der kommer samtidig, lægges i det samme billede (fx Jordens fire månedskort i 4k, ca. 4 × 180 ms på en Iris Xe).
// Et kort, der skal bruges nu, går først. Et kort på forhånd (rolig, fx månerne til flybyen) venter, til kameraet har
// været roligt i ROLIG_S (det flyver ikke), så det ikke rykker midt i en flyvning, men højst MAKS_S.
// Uden renderer (fx tests/vaerktoejer/kloder.html før scenen er lavet) kaldes færdig med det samme.

import { verden } from '../scene3d.js';

const ROLIG_S = 0.3; // sekunder, kameraet skal have stået stille før et kort på forhånd
const MAKS_S = 4; // sekunder, et kort på forhånd højst venter
const ROLIG_FART = 0.1; // pr. sekund: kameraet flytter sig under 10 % af afstanden (og drejer under 0,1 radian)

const kø = []; // { t, færdig, rolig, glemt, fra }
let kører = false;
let sidstPos = null;
let sidstRet = null;
let stilleFra = 0;

// Læg tekstur t i grafikkortet, og kald færdig() bagefter. glemt(): kortet bruges ikke mere (det springes over).
export function iGrafikkort(t, færdig, { rolig = false, glemt = () => false } = {}) {
  if (!verden.renderer) { færdig(); return; }
  kø.push({ t, færdig, rolig, glemt, fra: performance.now() });
  if (!kører) {
    kører = true;
    sidstPos = sidstRet = null; // (en gammel måling fra sidst, køen kørte, tæller ikke)
    requestAnimationFrame(trin);
  }
}

// Har kameraet været roligt i ROLIG_S? Roligt er under ROLIG_FART af afstanden til målet (og radianer) i sekundet:
// Den langsomme drejning af sig selv (autoRotate, ca. 0,04 radianer i sekundet) tæller som rolig, en flyvning ikke.
let sidstNu = 0;
function kameraStille(nu) {
  const k = verden.kamera;
  const pos = k.position, ret = k.quaternion;
  const dt = Math.max(1e-3, (nu - sidstNu) / 1000);
  const afstand = Math.max(1e-9, pos.distanceTo(verden.styring?.target ?? pos.clone().setScalar(0)));
  const drejet = sidstRet ? 2 * Math.acos(Math.min(1, Math.abs(ret.dot(sidstRet)))) : Infinity;
  const stille = sidstPos && pos.distanceTo(sidstPos) / afstand / dt < ROLIG_FART && drejet / dt < ROLIG_FART;
  sidstPos = pos.clone();
  sidstRet = ret.clone();
  sidstNu = nu;
  if (!stille) stilleFra = nu;
  return nu - stilleFra > ROLIG_S * 1000;
}

function trin(nu) {
  const stille = kameraStille(nu);
  // De glemte ud, så det første kort, der skal bruges nu, og ellers det første på forhånd, hvis kameraet står stille
  for (let i = kø.length - 1; i >= 0; i--) if (kø[i].glemt()) kø.splice(i, 1);
  let i = kø.findIndex((x) => !x.rolig);
  if (i < 0) i = kø.findIndex((x) => stille || nu - x.fra > MAKS_S * 1000);
  const x = i >= 0 ? kø.splice(i, 1)[0] : null;
  // (det næste billede bestilles først, så køen ikke går i stå, hvis færdig() fejler)
  if (kø.length) requestAnimationFrame(trin);
  else kører = false;
  if (!x) return;
  try {
    verden.renderer.initTexture(x.t);
  } finally {
    x.færdig();
  }
}

// Til tests: antal kort, der venter
export const iKø = () => kø.length;
