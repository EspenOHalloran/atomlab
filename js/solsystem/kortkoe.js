// Kortkøen (feedback nr. 5, 16. november 2026): Store kort lægges i grafikkortet ét pr. billede, i stedet for at alle,
// der kommer samtidig, lægges i det samme billede (fx Jordens fire månedskort i 4k, ca. 4 × 180 ms på en Iris Xe).
// Et kort, der skal bruges nu, går først. Et kort på forhånd (rolig, fx månerne til flybyen) venter, til kameraet har
// været roligt i ROLIG_S (det flyver ikke), så det ikke rykker midt i en flyvning, men højst MAKS_S.
// Uden renderer (fx tests/vaerktoejer/kloder.html før scenen er lavet) kaldes færdig med det samme.
// Store kort i strimler (Mars anden gang, 18. november 2026): Et kort over 2 × STRIMMEL_PX punkter, der er pakket ud som
// et vendt ImageBitmap (vendt i js/hentning.js), lægges ind i strimler, én pr. billede (den første på STRIMMEL_PX
// punkter, de næste større eller mindre, så hver tager ca. STRIMMEL_MS: få på en hurtig pc, flere på en tablet):
// først pladsen (initTexture uden data), så strimlerne (texSubImage2D med UNPACK_SKIP_ROWS) og til sidst mipmaps. Fx
// mars-8k.jpg i 16 billeder i stedet for ét på 127 ms på Tab A11. færdig kaldes først, når hele kortet er lagt ind, så
// et halvt kort ses aldrig, og bliver kortet glemt midt i (man forlader planeten), slettes det fra grafikkortet.

import * as THREE from 'three';
import { verden } from '../scene3d.js';

const ROLIG_S = 0.3; // sekunder, kameraet skal have stået stille før et kort på forhånd
const MAKS_S = 4; // sekunder, et kort på forhånd højst venter
const ROLIG_FART = 0.1; // pr. sekund: kameraet flytter sig under 10 % af afstanden (og drejer under 0,1 radian)
export const STRIMMEL_PX = 2 ** 21; // punkter i den første strimmel (ca. 8 ms på Tab A11, hvor 8k tog 127 ms)
const STRIMMEL_MS = 8; // ms pr. strimmel, som strimlerne tilpasses efter (højst dobbelt eller halvt så stor hver gang)
const STRIMMEL_MAKS = 2 ** 23; // højst så mange punkter i én strimmel (så et 8k-kort altid deles i mindst 4)

const kø = []; // { t, færdig, rolig, glemt, fra, strimler } (strimler: { rækker, y, nr, antal } for et stort kort)
let kører = false;
let sidstPos = null;
let sidstRet = null;
let stilleFra = 0;

// Læg tekstur t i grafikkortet, og kald færdig() bagefter. glemt(): kortet bruges ikke mere (det springes over).
export function iGrafikkort(t, færdig, { rolig = false, glemt = () => false } = {}) {
  if (!verden.renderer) { færdig(); return; }
  kø.push({ t, færdig, rolig, glemt, fra: performance.now(), strimler: iStrimler(t) });
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
  // De glemte ud (er et stort kort halvt lagt ind, slettes det), så det første kort, der skal bruges nu, og ellers det
  // første på forhånd, hvis kameraet står stille. Et stort kort bliver stående i køen, til den sidste strimmel er lagt ind.
  for (let i = kø.length - 1; i >= 0; i--) {
    if (!kø[i].glemt()) continue;
    if (kø[i].strimler?.nr > 0) { kø[i].t.dispose(); kø[i].t.image?.close?.(); }
    kø.splice(i, 1);
  }
  let i = kø.findIndex((x) => !x.rolig);
  if (i < 0) i = kø.findIndex((x) => stille || nu - x.fra > MAKS_S * 1000);
  const x = i >= 0 ? kø[i] : null;
  if (x && !x.strimler) kø.splice(i, 1);
  // (det næste billede bestilles først, så køen ikke går i stå, hvis færdig() fejler)
  if (kø.length) requestAnimationFrame(trin);
  else kører = false;
  if (!x) return;
  if (!x.strimler) {
    try {
      verden.renderer.initTexture(x.t);
    } finally {
      x.færdig();
    }
    return;
  }
  try {
    strimmel(x.t, x.strimler);
  } catch (e) {
    // (kan en strimmel ikke lægges ind, lægges hele kortet ind som før)
    console.warn('Kortet kunne ikke lægges ind i strimler:', e);
    x.strimler.nr = x.strimler.antal + 1;
    x.t.needsUpdate = true;
    verden.renderer.initTexture(x.t);
  }
  if (x.strimler.nr <= x.strimler.antal) return;
  kø.splice(kø.indexOf(x), 1); // (hele kortet er lagt ind)
  x.færdig();
}

// Skal kortet t lægges ind i strimler? Kun et stort, vendt ImageBitmap uden egne mipmaps i WebGL 2, som grafikkortet kan
// tage i fuld størrelse (ellers gør Three.js det mindre først), i formater med én byte pr. kanal.
const GL_FORMAT = { [THREE.RGBAFormat]: 'RGBA', [THREE.RGFormat]: 'RG', [THREE.RedFormat]: 'RED' };
function iStrimler(t) {
  const r = verden.renderer, b = t.image;
  if (!r?.capabilities.isWebGL2 || typeof ImageBitmap === 'undefined' || !(b instanceof ImageBitmap) || !b.vendt) return null;
  if (b.width * b.height <= 2 * STRIMMEL_PX || Math.max(b.width, b.height) > r.capabilities.maxTextureSize) return null;
  if (t.mipmaps.length || t.type !== THREE.UnsignedByteType || !GL_FORMAT[t.format]) return null;
  const rækker = Math.max(1, Math.floor(STRIMMEL_PX / b.width));
  return { rækker, y: 0, nr: 0, antal: Math.ceil(b.height / rækker) };
}

// Ét skridt af et stort kort: nr 0 laver pladsen, 1 … antal lægger strimlerne ind, og den sidste laver også mipmaps
function strimmel(t, s) {
  const r = verden.renderer, gl = r.getContext(), b = t.image;
  if (s.nr === 0) {
    // Pladsen i grafikkortet (texStorage2D med alle niveauer), uden data: Three.js lægger ikke billedet ind, når
    // source.dataReady er false, men husker teksturen som lagt ind, så den ikke lægges ind igen bagefter. Mipmaps af
    // det tomme kort springes over (de laves efter den sidste strimmel).
    const mip = gl.generateMipmap;
    t.source.dataReady = false;
    gl.generateMipmap = () => {};
    try { r.initTexture(t); } finally { t.source.dataReady = true; gl.generateMipmap = mip; }
    s.nr = 1;
    return;
  }
  const tex = r.properties.get(t).__webglTexture;
  r.state.bindTexture(gl.TEXTURE_2D, tex);
  r.state.pixelStorei(gl.UNPACK_ALIGNMENT, t.unpackAlignment);
  const h = Math.min(s.rækker, b.height - s.y);
  const fil = b.dataset?.fil;
  if (fil) b.dataset.fil = `${fil} (strimmel ${s.nr} af ${s.antal})`; // (navnet i måleren, ?maal)
  gl.pixelStorei(gl.UNPACK_SKIP_ROWS, s.y);
  const t0 = performance.now();
  try {
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, s.y, b.width, h, gl[GL_FORMAT[t.format]], gl.UNSIGNED_BYTE, b);
  } finally {
    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
    if (fil) b.dataset.fil = fil;
  }
  // Den næste strimmel større eller mindre efter tiden (ikke efter den første, som kan koste mere, fordi pladsen
  // nulstilles, første gang der skrives i den)
  const dt = performance.now() - t0;
  if (s.nr > 1) {
    const maks = Math.max(1, Math.floor(STRIMMEL_MAKS / b.width));
    s.rækker = Math.min(maks, Math.max(16, Math.round(s.rækker * Math.min(2, Math.max(0.5, STRIMMEL_MS / Math.max(dt, 0.1))))));
  }
  s.y += h;
  s.nr++;
  if (s.y < b.height) s.antal = s.nr - 1 + Math.ceil((b.height - s.y) / s.rækker); // (resten med den nye størrelse)
  else s.antal = s.nr - 1;
  if (s.nr > s.antal && t.generateMipmaps && t.minFilter !== THREE.NearestFilter && t.minFilter !== THREE.LinearFilter) {
    gl.generateMipmap(gl.TEXTURE_2D);
  }
}

// Til tests: antal kort, der venter
export const iKø = () => kø.length;
