// Henter billederne til planeterne og månerne i Solsystemet (Mars, Saturn og Jupiter) fra billeder/solsystem/.
// Hvert billede hentes kun én gang og bliver i grafikkortet, så længe en ejer bruger det (en planet eller Stå på Mars,
// se billedEjer i js/hentning.js). Når den sidste ejer er frigivet, slettes det fra grafikkortet og lageret (G1 trin 3).
// Billedet hentes med hentBillede (js/hentning.js), så bjælken "Henter …" kan tælle de hentede MB, og det er afkodet,
// før det bruges (uden for hovedtråden), så det ikke hakker, når det lægges i grafikkortet.

import * as THREE from 'three';
import { hentBillede, billedEjer, vedFrigiv } from '../hentning.js';

export const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
export const lager = new Map(); // filnavn → { tekstur, fejlet, venter, fejlVenter, ejere, glemt }

// hent(navn, færdig, valg): færdig(tekstur) kaldes, når billedet er klar (med det samme, hvis det allerede er hentet).
// farve: et farvefoto (sRGB), ellers målinger, der bruges, som de er. kanaler: 1 (gråtoner, RedFormat) eller 2 (højden i
// rød og grøn, RGFormat) sparer hukommelse i grafikkortet. rundt: kortet går hele vejen rundt (de lokale kort gør ikke).
// fejl kaldes, hvis billedet ikke kan hentes (så bruges det tegnede). vendt: billedet pakkes ud som et ImageBitmap, der
// er vendt (hentBillede), så det går hurtigere at lægge det i grafikkortet. Kun til billeder, der ikke læses som et
// <img> bagefter (lavTabel i klippeplanet.js kender billede.vendt). ejer: hvem billedet hører til (standard: det valgte
// fænomen, billedEjer()). Stå på Mars har sin egen, så landskabet kan frigives, når man letter.
export function hent(navn, færdig, { farve = true, kanaler = 4, anisotropi = 1, rundt = true, fejl, vendt = false, ejer = billedEjer() } = {}) {
  let b = lager.get(navn);
  if (!b) {
    b = { tekstur: null, fejlet: false, venter: [], fejlVenter: [], ejere: new Set(), glemt: false };
    lager.set(navn, b);
    hentBillede(new URL(navn, MAPPE).href, { vendt }).then((billede) => {
      if (b.glemt) { billede.close?.(); return; } // (frigivet, mens det blev hentet: ingen bruger det mere)
      const t = new THREE.Texture(billede);
      t.flipY = !billede.vendt; // (et ImageBitmap er vendt, da det blev pakket ud)
      t.needsUpdate = true;
      t.colorSpace = farve ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      if (kanaler === 2) t.format = THREE.RGFormat;
      if (kanaler === 1) t.format = THREE.RedFormat;
      if (rundt) t.wrapS = THREE.RepeatWrapping;
      t.anisotropy = anisotropi;
      b.tekstur = t;
      for (const f of b.venter) f(t);
      b.venter.length = 0;
    }, () => {
      if (b.glemt) return;
      b.fejlet = true;
      for (const f of b.fejlVenter) f();
      b.fejlVenter.length = 0;
    });
  }
  if (ejer) b.ejere.add(ejer);
  if (b.tekstur) færdig(b.tekstur);
  else if (!b.fejlet) b.venter.push(færdig);
  if (fejl) {
    if (b.fejlet) fejl();
    else if (!b.tekstur) b.fejlVenter.push(fejl);
  }
}

// Er billedet hentet (og ligger i grafikkortet)?
export const iLager = (navn) => Boolean(lager.get(navn)?.tekstur);
// Fjern et billede fra grafikkortet og lageret (et ImageBitmap lukkes, så hukommelsen frigives med det samme). Er det
// ikke hentet endnu, smides det væk, når det kommer.
function smid(navn, b) {
  b.glemt = true;
  b.venter.length = b.fejlVenter.length = 0;
  b.tekstur?.dispose();
  b.tekstur?.image?.close?.();
  if (lager.get(navn) === b) lager.delete(navn);
}
// Den lille udgave af et billede bruges ikke mere (den store er sat ind): fjern den fra grafikkortet og lageret
export function glem(navn) {
  const b = lager.get(navn);
  if (b) smid(navn, b);
}
// Ejeren e bruger ikke sine billeder mere: de billeder, ingen andre bruger, slettes (kaldes fra frigivBilleder)
vedFrigiv((e) => {
  for (const [navn, b] of [...lager]) if (b.ejere.delete(e) && !b.ejere.size) smid(navn, b);
});

// De hentede billeder, og om de ligger med én kanal i grafikkortet (til tests). navne: kun billeder, hvis navn starter
// med et af dem.
export function hentedeBilleder(navne) {
  return Object.fromEntries([...lager]
    .filter(([n, b]) => b.tekstur && (!navne || navne.some((s) => n.startsWith(s))))
    .map(([n, b]) => [n, b.tekstur.format === THREE.RedFormat ? 'én kanal' : 'farver']));
}
