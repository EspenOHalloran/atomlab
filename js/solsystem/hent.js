// Henter billederne til planeterne og månerne i Solsystemet (Mars, Saturn og Jupiter) fra billeder/solsystem/.
// Hvert billede hentes kun én gang og bliver i grafikkortet, så det går hurtigt at åbne en planet igen.
// Billedet afkodes, før det bruges (image.decode() sker uden for hovedtråden), så det ikke hakker, når det lægges i
// grafikkortet.

import * as THREE from 'three';

export const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const henter = new THREE.TextureLoader();
export const lager = new Map(); // filnavn → { tekstur, fejlet, venter, fejlVenter }

// hent(navn, færdig, valg): færdig(tekstur) kaldes, når billedet er klar (med det samme, hvis det allerede er hentet).
// farve: et farvefoto (sRGB), ellers målinger, der bruges, som de er. kanaler: 1 (gråtoner, RedFormat) eller 2 (højden i
// rød og grøn, RGFormat) sparer hukommelse i grafikkortet. rundt: kortet går hele vejen rundt (de lokale kort gør ikke).
// fejl kaldes, hvis billedet ikke kan hentes (så bruges det tegnede).
export function hent(navn, færdig, { farve = true, kanaler = 4, anisotropi = 1, rundt = true, fejl } = {}) {
  let b = lager.get(navn);
  if (!b) {
    b = { tekstur: null, fejlet: false, venter: [], fejlVenter: [] };
    lager.set(navn, b);
    henter.load(new URL(navn, MAPPE).href, (t) => {
      t.colorSpace = farve ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      if (kanaler === 2) t.format = THREE.RGFormat;
      if (kanaler === 1) t.format = THREE.RedFormat;
      if (rundt) t.wrapS = THREE.RepeatWrapping;
      t.anisotropy = anisotropi;
      (t.image.decode ? t.image.decode() : Promise.resolve()).catch(() => {}).then(() => {
        b.tekstur = t;
        for (const f of b.venter) f(t);
        b.venter.length = 0;
      });
    }, undefined, () => {
      b.fejlet = true;
      for (const f of b.fejlVenter) f();
      b.fejlVenter.length = 0;
    });
  }
  if (b.tekstur) færdig(b.tekstur);
  else if (!b.fejlet) b.venter.push(færdig);
  if (fejl) {
    if (b.fejlet) fejl();
    else if (!b.tekstur) b.fejlVenter.push(fejl);
  }
}

// De hentede billeder, og om de ligger med én kanal i grafikkortet (til tests). navne: kun billeder, hvis navn starter
// med et af dem.
export function hentedeBilleder(navne) {
  return Object.fromEntries([...lager]
    .filter(([n, b]) => b.tekstur && (!navne || navne.some((s) => n.startsWith(s))))
    .map(([n, b]) => [n, b.tekstur.format === THREE.RedFormat ? 'én kanal' : 'farver']));
}
