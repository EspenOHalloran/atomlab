// Kanal A og B ("Land med Huygens", spor Måner, M5b, docs/drejebog-maaner.md afsnit 8, trin 4): Cassinis to modtagere
// for Huygens' radiokanaler. Et tryk på B: lampen blinker, og billederne tæller op til 350. Et tryk på A: Lampen blafrer og
// bliver mørk, for Cassini lyttede aldrig på kanal A (en fejl i kommandoerne). Strimlen viser billederne fra trin 2 og 3,
// og hvert andet felt er tomt (tegnet: den viser kun, at halvdelen manglede, ikke hvilke). Tallene står i KANALER og
// STRIMMEL i js/data/maaner/landhuygens.js. Tiden går med opdater(dt), så den står stille under pause.

import { KANALER, STRIMMEL } from '../data/maaner/landhuygens.js';

const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const TÆL_S = 2.4; // sekunder, B tæller op til 350
const A_S = 0.9; // sekunder, A blafrer, før den bliver mørk

export function lavKanaler({ vindue, påSkift }) {
  const el = document.createElement('div');
  el.className = 'ui-lh-kanaler';
  el.hidden = true;
  const felter = STRIMMEL.map((fil, i) => `<i class="lh-felt tomt" data-kanal="A"></i><i class="lh-felt" data-kanal="B" data-nr="${i}"><img alt="" data-fil="${fil}"></i>`).join('');
  el.innerHTML = `<div class="lh-kort">
      <p class="lh-k-titel"><span aria-hidden="true">🛰️</span> Cassini lytter efter Huygens</p>
      <div class="lh-modtagere">
        ${['A', 'B'].map((k) => `<button type="button" class="lh-modtager" data-kanal="${k}" aria-label="Modtager ${k}. Tryk for at tænde den">
          <i class="lh-lampe" aria-hidden="true"></i><b>${k}</b><span class="lh-k-status">Slukket</span></button>`).join('')}
      </div>
      <p class="lh-taeller">Billeder: <strong>0</strong> af ${KANALER.planlagt}</p>
      <div class="lh-strimmel" aria-hidden="true">${felter}</div>
    </div>`;
  vindue.append(el);
  const tæller = el.querySelector('.lh-taeller strong');
  const knap = { A: el.querySelector('.lh-modtager[data-kanal="A"]'), B: el.querySelector('.lh-modtager[data-kanal="B"]') };
  const status = { A: knap.A.querySelector('.lh-k-status'), B: knap.B.querySelector('.lh-k-status') };
  const bFelter = [...el.querySelectorAll('.lh-felt[data-kanal="B"]')];

  // tA, tB: sekunder siden A eller B blev tændt (null: ikke tændt)
  let tA = null, tB = null, antal = 0, aFærdig = false, bFærdig = false;

  function tænd(k) {
    if (el.hidden) return;
    if (k === 'A' && tA === null) { tA = 0; knap.A.classList.add('blafrer'); status.A.textContent = 'Tænder …'; }
    if (k === 'B' && tB === null) { tB = 0; knap.B.classList.add('lytter'); status.B.textContent = 'Lytter'; }
    påSkift?.();
  }
  el.addEventListener('click', (h) => {
    const b = h.target.closest('.lh-modtager');
    if (b) tænd(b.dataset.kanal);
  });
  function tegnB() {
    tæller.textContent = String(antal);
    const fyldt = Math.round((antal / KANALER.kom) * bFelter.length);
    bFelter.forEach((f, i) => {
      if (i < fyldt && !f.classList.contains('fyldt')) {
        const img = f.querySelector('img');
        img.src = new URL(img.dataset.fil, MAPPE).href;
        f.classList.add('fyldt');
      }
    });
  }

  return {
    el,
    get færdig() { return aFærdig && bFærdig; },
    get antal() { return antal; },
    vis(til) { el.hidden = !til; },
    tænd,
    nulstil() {
      tA = tB = null;
      antal = 0;
      aFærdig = bFærdig = false;
      knap.A.className = knap.B.className = 'lh-modtager';
      status.A.textContent = status.B.textContent = 'Slukket';
      bFelter.forEach((f) => f.classList.remove('fyldt'));
      el.querySelectorAll('.lh-felt.tomt').forEach((f) => f.classList.remove('tabt'));
      el.classList.remove('halvt');
      tæller.textContent = '0';
    },
    // Hvert billede (dt: sekunder på skærmen)
    opdater(dt) {
      if (el.hidden) return;
      if (tB !== null && !bFærdig) {
        tB += dt;
        const nyt = Math.min(KANALER.kom, Math.round((KANALER.kom * tB) / TÆL_S));
        if (nyt !== antal) { antal = nyt; tegnB(); }
        if (antal >= KANALER.kom) { bFærdig = true; status.B.textContent = `${KANALER.kom} billeder`; påSkift?.(); }
      }
      if (tA !== null && !aFærdig) {
        tA += dt;
        if (tA >= A_S) {
          aFærdig = true;
          knap.A.classList.remove('blafrer');
          knap.A.classList.add('mørk');
          status.A.textContent = 'Ingen lyttede';
          el.querySelectorAll('.lh-felt.tomt').forEach((f) => f.classList.add('tabt'));
          påSkift?.();
        }
      }
      el.classList.toggle('halvt', aFærdig && bFærdig);
    },
    test: () => ({ vist: !el.hidden, antal, a: status.A.textContent, b: status.B.textContent, fyldt: bFelter.filter((f) => f.classList.contains('fyldt')).length, felter: bFelter.length * 2, færdig: aFærdig && bFærdig }),
    stop() { el.remove(); },
  };
}
