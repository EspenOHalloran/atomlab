// Rejseskiltet i Solsystemet: "Kurs mod Mars" med en lille raket, der kredser om planeten, mens den nye klode bygges.
// At bygge en klode (nettene, shaderne og kortene i grafikkortet) kan låse browseren et øjeblik. Skiltet vises derfor
// først, og arbejdet starter, når det er tegnet. Raketten og toningen er rene CSS-animationer (transform og opacity),
// så browseren kan køre dem videre, mens programmet arbejder. Skiltet toner først ind efter 0,2 s (CSS), så et hurtigt
// skift ikke blinker.
import { ROLIG } from './scene3d.js';

// Små linjer, der skifter fra tur til tur (ingen tal, så de passer til alle kloderne)
const LINJER = [
  'En rigtig rumsonde er måneder eller år om turen. Vi tager en genvej.',
  'Spænd sikkerhedsselen …',
  'Vi pakker kortene over kloden …',
  'Motorerne varmer op …',
];

export function lavRejseskilt(vindue) {
  const boks = document.createElement('div');
  boks.className = 'rejseskilt';
  boks.setAttribute('role', 'status');
  boks.innerHTML = `<div class="rejse-bane" aria-hidden="true"><span class="rejse-maal"></span>
    <span class="rejse-arm"><span class="rejse-raket">🚀</span></span></div>
    <p class="rejse-titel"></p><p class="rejse-tekst"></p>`;
  vindue.append(boks);
  const mål = boks.querySelector('.rejse-maal');
  const titel = boks.querySelector('.rejse-titel');
  const tekst = boks.querySelector('.rejse-tekst');
  let nr = 0; // den nyeste tur (et nyt tryk undervejs vinder)
  let linje = Math.floor(Math.random() * LINJER.length);
  const efterTegning = (f) => requestAnimationFrame(() => setTimeout(f, 0)); // når browseren har tegnet billedet

  // Vis skiltet, og gør arbejdet (gør), når det er tegnet. Skiltet toner ud, når det første billede efter er tegnet.
  function rejs(navn, ikon, gør) {
    const mit = ++nr;
    mål.textContent = ikon ?? '';
    titel.textContent = `Kurs mod ${navn}`;
    linje = (linje + 1) % LINJER.length;
    tekst.textContent = LINJER[linje];
    boks.classList.toggle('rolig', ROLIG);
    boks.classList.add('vist');
    efterTegning(() => {
      if (mit !== nr) return;
      try {
        gør();
      } finally {
        // To billeder: det første oversætter shaderne og lægger kortene i grafikkortet
        requestAnimationFrame(() => requestAnimationFrame(() => { if (mit === nr) boks.classList.remove('vist'); }));
      }
    });
  }
  return {
    rejs,
    get vist() { return boks.classList.contains('vist'); }, // til tests
  };
}
