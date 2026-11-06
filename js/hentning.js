// Store billeder hentes med fetch, så de hentede byte kan tælles, og en lille bjælke i 3D-billedet ("Henter
// landskabet … 18 af 42 MB") kan vise, hvor langt det er nået. Bjælken ses kun, når man venter mere end ca. et sekund
// (FORSINKELSE), så den aldrig blinker, når billederne allerede ligger i grafikkortet.
// Toningen og bjælken følger det rigtige ur (performance.now), ikke spillets tid: de skal også køre under pause.
import { verden, ROLIG } from './scene3d.js';

const FORSINKELSE = 1000; // ms, før bjælken vises
const igang = new Set(); // hentninger, der ikke er færdige: { modtaget, total } (total er null, indtil størrelsen kendes)
const målere = new Set(); // bjælker, der venter lige nu (hver tæller de hentninger, der er i gang, mens den venter)

// Henter et billede og giver et færdigt afkodet <img> (Promise). Fejler, hvis billedet ikke findes.
export async function hentBillede(url) {
  const h = { modtaget: 0, total: null };
  igang.add(h);
  for (const m of målere) m.hentninger.add(h);
  try {
    const svar = await fetch(url);
    if (!svar.ok) throw new Error(`${svar.status} ${url}`);
    h.total = Number(svar.headers.get('content-length')) || null;
    let blob;
    if (svar.body?.getReader) {
      const læser = svar.body.getReader();
      const dele = [];
      for (;;) {
        const { done, value } = await læser.read();
        if (done) break;
        dele.push(value);
        h.modtaget += value.length;
      }
      blob = new Blob(dele, { type: svar.headers.get('content-type') || '' });
    } else {
      blob = await svar.blob();
    }
    h.modtaget = h.total = blob.size;
    const img = new Image();
    const adresse = URL.createObjectURL(blob);
    img.src = adresse;
    try {
      await img.decode(); // afkodes uden for hovedtråden, så det ikke hakker, når det lægges i grafikkortet
    } finally {
      URL.revokeObjectURL(adresse);
    }
    return img;
  } finally {
    h.total = Math.max(h.total ?? 0, h.modtaget); // (pakket svar: content-length er mindre end det udpakkede)
    h.færdig = true;
    igang.delete(h);
  }
}

// Bjælken. vent(tekst, aktiv) starter den (vises efter FORSINKELSE), færdig() skjuler den. Den tæller alle billeder, der
// hentes, mens den venter (også dem, der allerede var i gang). Kun én ventetid ad gangen pr. bjælke. aktiv (valgfri)
// siger, om det, der venter, stadig ses (ellers skjules bjælken, fx når man har forladt skærmen).
export function lavHentebjælke() {
  const boks = document.createElement('div');
  boks.className = 'hentebjaelke';
  boks.setAttribute('role', 'status');
  boks.innerHTML = '<p class="hentebjaelke-tekst"></p><div class="hentebjaelke-spor"><div class="hentebjaelke-fyld"></div></div>';
  const tekstEl = boks.querySelector('.hentebjaelke-tekst');
  const fyld = boks.querySelector('.hentebjaelke-fyld');
  document.body.appendChild(boks);
  const måler = { hentninger: new Set() };
  let tekst = '', start = 0, ur = null, vist = false, sidst = '', aktiv = null;

  function opdater() {
    if (aktiv && !aktiv()) {
      if (vist) { vist = false; boks.classList.remove('vist'); }
      return;
    }
    if (!vist && performance.now() - start < FORSINKELSE) return;
    // MB vises først, når størrelsen på alle billederne kendes (ellers ville bjælken fx stå på "4 af 4 MB" og vente)
    let modtaget = 0, total = 0;
    for (const h of måler.hentninger) {
      if (h.total === null) { total = 0; break; }
      modtaget += h.modtaget;
      total += Math.max(h.total, h.modtaget);
    }
    const h = verden.hul;
    Object.assign(boks.style, { left: `${h.left + h.width / 2}px`, top: `${h.top + h.height / 2}px` });
    const mb = (b) => (b / 1e6).toFixed(b < 1e7 ? 1 : 0).replace('.', ',');
    const ny = total > 0 ? `${tekst} ${mb(modtaget)} af ${mb(total)} MB` : tekst;
    if (ny !== sidst) { tekstEl.textContent = ny; sidst = ny; } // kun når teksten ændrer sig
    fyld.style.width = `${total > 0 ? Math.max(4, (100 * modtaget) / total) : 4}%`;
    if (!vist) { vist = true; boks.classList.add('vist'); }
  }
  function færdig() {
    målere.delete(måler);
    måler.hentninger.clear();
    clearInterval(ur);
    ur = null;
    if (vist) fyld.style.width = '100%';
    vist = false;
    boks.classList.remove('vist');
  }
  return {
    vent(t, erAktiv = null) {
      færdig();
      tekst = t;
      aktiv = erAktiv;
      sidst = '';
      start = performance.now();
      for (const h of igang) måler.hentninger.add(h);
      målere.add(måler);
      ur = setInterval(opdater, 250); // højst 4 gange i sekundet
    },
    færdig,
    get venter() { return ur !== null; }, // til tests
    get vist() { return vist; }, // til tests
    fjern() { færdig(); boks.remove(); },
  };
}

// Toner et tal fra 0 til 1 på sek sekunder (sæt(v) kaldes i hvert billede). ROLIG: med det samme.
export function tonInd(sæt, sek = 0.6) {
  if (ROLIG || sek <= 0) { sæt(1); return; }
  const start = performance.now();
  const trin = () => {
    const v = Math.min(1, (performance.now() - start) / (sek * 1000));
    sæt(v * v * (3 - 2 * v));
    if (v < 1) requestAnimationFrame(trin);
  };
  sæt(0);
  requestAnimationFrame(trin);
}
