// Fuld skærm: fjerner browserens adressefelt og knapper, så atomet får hele skærmen.
// Nogle browsere (fx Safari på iPhone) kan ikke, og så skjules knapperne.

const IKON_UD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>';
const IKON_IND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></svg>';

const kanFuldSkærm = Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);

function erFuldSkærm() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}

function skift() {
  if (erFuldSkærm()) {
    const ud = document.exitFullscreen || document.webkitExitFullscreen;
    ud.call(document);
  } else {
    const side = document.documentElement;
    const ind = side.requestFullscreen || side.webkitRequestFullscreen;
    // Nogle browsere giver et løfte (promise) tilbage, som kan fejle
    Promise.resolve(ind.call(side)).catch(() => {});
  }
}

function opdater() {
  const fuld = erFuldSkærm();
  for (const knap of document.querySelectorAll('.knap-fuldskaerm')) {
    knap.innerHTML = fuld ? IKON_IND : IKON_UD;
    knap.title = fuld ? 'Forlad fuld skærm' : 'Fuld skærm';
    knap.setAttribute('aria-label', knap.title);
  }
}

export function lavFuldSkærmKnapper() {
  const knapper = document.querySelectorAll('.knap-fuldskaerm');
  if (!kanFuldSkærm) {
    knapper.forEach((k) => k.classList.add('skjult'));
    return;
  }
  knapper.forEach((k) => k.addEventListener('click', skift));
  document.addEventListener('fullscreenchange', opdater);
  document.addEventListener('webkitfullscreenchange', opdater);
  opdater();
}
