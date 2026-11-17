// Tegningen af Solen, der vender om (Merkur, MP2 i docs/drejebog-merkur-pluto.md): en lille horisont oven på
// 3D-billedet, som den ses fra ækvator dér, hvor Solen står op ved perihel. Solens højde regnes for programmets dato
// (js/data/merkur-sol.js), så tegningen passer med 3D-billedet og står stille i pause. Med ▶ (et døgn i sekundet) kommer
// Solen et stykke op, synker ned igen og står så op for alvor (ca. 20 sekunder).
//
// Himlen er forstørret: Solens skive er ca. 1,7° bred og tegnes ca. 60 pixel bred. Der er ingen luft, så himlen er sort
// og uden morgenrøde.

import { solHøjde, solSkive } from '../data/merkur-sol.js';

const DØGN = 864e5;
const PX = 36; // pixel pr. grad på himlen
const B = 320, H = 150, HORISONT = 104; // tegningens størrelse og horisontens højde (pixel)

// overlag: elementet oven på 3D-billedet. igen(): "Se det igen" (datoen sættes tilbage til starten).
export function lavSolTegning({ overlag, igen }) {
  const boks = document.createElement('figure');
  boks.className = 'merkur-sol';
  boks.hidden = true;
  // Stjernerne står fast (ingen tilfældighed, så billederne i testene er ens)
  const stjerner = [[22, 18], [61, 47], [94, 12], [140, 33], [205, 15], [238, 52], [281, 24], [300, 70], [176, 64], [40, 80], [262, 88], [118, 78]]
    .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 0.7 : 1}" fill="#cdd6ff" opacity="${i % 2 ? 0.45 : 0.7}"/>`).join('');
  // Jorden: lave bakker (ganske lidt, så horisonten er næsten flad)
  const bakker = `M0 ${HORISONT} C40 ${HORISONT - 2} 70 ${HORISONT + 1} 110 ${HORISONT} S190 ${HORISONT - 1.5} 230 ${HORISONT} S300 ${HORISONT + 1} ${B} ${HORISONT} L${B} ${H} L0 ${H} Z`;
  boks.innerHTML = `
    <svg viewBox="0 0 ${B} ${H}" role="img" aria-label="Solen ved horisonten på Merkur">
      <defs>
        <radialGradient id="merkurSolSkive"><stop offset="0" stop-color="#fffdf6"/><stop offset="0.75" stop-color="#fff3d6"/><stop offset="1" stop-color="#ffe0a8"/></radialGradient>
        <radialGradient id="merkurSolGloed"><stop offset="0.45" stop-color="#fff0c8" stop-opacity="0.5"/><stop offset="1" stop-color="#fff0c8" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${B}" height="${H}" fill="#02030a"/>
      ${stjerner}
      <g class="ms-sol"><circle r="46" fill="url(#merkurSolGloed)"/><circle r="31" fill="url(#merkurSolSkive)"/></g>
      <path d="${bakker}" fill="#2b2925"/>
      <path d="${bakker.split(' L')[0]}" fill="none" stroke="#5a554c" stroke-width="1"/>
      <text x="${B / 2}" y="${H - 12}" text-anchor="middle" class="ms-oest">Øst</text>
    </svg>
    <figcaption><span class="ms-status" aria-live="polite"></span><button type="button" class="ms-igen">↻ Se det igen</button></figcaption>
    <p class="ms-hvor"></p>`;
  const sol = boks.querySelector('.ms-sol');
  const status = boks.querySelector('.ms-status');
  const hvor = boks.querySelector('.ms-hvor');
  boks.querySelector('.ms-igen').addEventListener('click', () => igen());
  overlag.append(boks);
  let vistStatus = '', vistHvor = '', vistY = null, vistR = null;

  // Teksten under tegningen efter, hvor langt Solen er nået (d: dobbeltSolopgang, ø: øverste kant over horisonten)
  function tekst(ms, d, ø, n) {
    if (Math.abs(ms - d.stille1) < 0.7 * DØGN && ø > 0) return 'Solen står stille …';
    if (Math.abs(ms - d.stille2) < 0.7 * DØGN) return 'Solen står stille under horisonten …';
    if (ms < d.stille1) return ø > 0 ? 'Solen står op …' : 'Det er nat. Solen står snart op i øst.';
    if (ms < d.stille2) return ø > 0 ? '… og går ned igen!' : 'Solen er gået ned igen.';
    if (n > 0) return 'Nu står Solen op for alvor. Dagen varer 88 jorddøgn.';
    return ø > 0 ? '… og står op igen.' : 'Om lidt står Solen op igen.';
  }

  return {
    // Tegningen for datoen ms ved den dobbelte solopgang d (js/data/merkur-sol.js: dobbeltSolopgang)
    vis(ms, d) {
      if (boks.hidden) boks.hidden = false;
      const dato = new Date(ms);
      const e = solHøjde(dato, d.længde);
      const s = solSkive(dato);
      const y = Math.round((HORISONT - e * PX) * 10) / 10;
      const r = Math.round((s / 2) * PX * 10) / 10;
      if (y !== vistY) { sol.setAttribute('transform', `translate(${B / 2} ${y})`); vistY = y; }
      if (r !== vistR) { sol.firstChild.setAttribute('r', String(r * 1.5)); sol.lastChild.setAttribute('r', String(r)); vistR = r; }
      const t = tekst(ms, d, e + s / 2, e - s / 2);
      if (t !== vistStatus) status.textContent = vistStatus = t;
      const l = d.længde <= 180 ? `${Math.round(d.længde)}° Ø` : `${Math.round(360 - d.længde)}° V`;
      const h = `Set fra ækvator ved ${l}, hvor Solen står op. Himlen er forstørret.`;
      if (h !== vistHvor) hvor.textContent = vistHvor = h;
    },
    skjul() { if (!boks.hidden) boks.hidden = true; },
    get vist() { return !boks.hidden; },
    // Til tests: Solens øverste kant over horisonten (grader) og teksten
    test: () => ({ vist: !boks.hidden, status: vistStatus, hvor: vistHvor, y: vistY, r: vistR }),
    stop() { boks.remove(); },
  };
}
