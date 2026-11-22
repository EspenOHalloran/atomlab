// Spring til et fænomen, et grundstof eller en gåde på en anden skærm (fx fra grundstofkortet, Ordbogen eller en tekst i Kosmos).
// Ligger for sig selv og hentes ved start, så knapperne virker, før Kosmos, Solsystemet og Det periodiske system er
// hentet (10a).
import { lyd } from './lyd.js';
import { NØGLER } from './data/faenomener.js';
import { hentetSkærm } from './skaerme.js';

// Et sted i træet, som skærmen skal gå til, når den starter (fx Olympus Mons fra Ordbogen): { skærm, sted }
let ventSted = null;
// Skærmen, et link har valgt et fænomen på (så Solsystemet ikke starter på sin forside, overblikket)
let ventFænomen = null;

// Åbner et fænomen på en anden skærm. sted er et sted i fænomenets træ (fx 'olympus'), som kameraet flyver hen til.
export function åbnFænomen(skærm, id, sted) {
  if (id) {
    try { localStorage.setItem(NØGLER[skærm].valgt, id); } catch { /* ingen lagring */ }
  }
  ventFænomen = id ? skærm : null;
  ventSted = sted ? { skærm, sted } : null;
  location.hash = `#${skærm}`;
}

// Grundstoffet, Det periodiske system skal åbne, når det starter (fra en knap data-gaa="system:55" på en anden skærm)
let ventGrundstof = null;
export function tagVentGrundstof() {
  const nr = ventGrundstof;
  ventGrundstof = null;
  return nr;
}

// Gåden, Gåderne skal åbne, når de starter (fra en knap data-gaa="gaader:sorthul" på en anden skærm)
let ventGåde = null;
export function tagVentGåde() {
  const id = ventGåde;
  ventGåde = null;
  return id;
}

// Det, Liv skal åbne, når den starter (fra en knap data-gaa="liv:protein", fx "Se det selv" i Gåderne): 'protein'
// starter "Se genet blive læst"
let ventLiv = null;
export function tagVentLiv() {
  const id = ventLiv;
  ventLiv = null;
  return id;
}

// Bogen, Opdagelserne skal åbne, når de starter (fra en knap data-gaa="opdagelser:huygens", fx ved citatet ved Saturn),
// evt. med et opslag i bogen (data-gaa="opdagelser:einstein:energien", Einstein E5 22. november 2026): { id, opslag }
let ventBog = null;
export function tagVentBog() {
  const id = ventBog;
  ventBog = null;
  return id;
}

// Det, Ild skal åbne, når den starter (fra en knap data-gaa="ild:knaldgas", fx "Knaldgas i Ild ›" i Molekyler)
let ventIld = null;
export function tagVentIld() {
  const id = ventIld;
  ventIld = null;
  return id;
}

// Den måde, Molekyler skal åbne med, når den starter (fra en knap data-gaa="molekyler:bytte", fx i Værkstedets hjælp):
// 'byg' ("Del elektroner") eller 'bytte' ("Giv elektroner")
let ventMolekyler = null;
export function tagVentMolekyler() {
  const id = ventMolekyler;
  ventMolekyler = null;
  return id;
}

// Det, Kvantefysik skal skyde med, når den starter (fra en knap data-gaa="kvante:lys" eller "kvante:stor", fx fotonen i
// Ordbogen eller "Se det selv" i gåden "Hvor stopper kvanteverdenen?"): en slags eller 'stor' ("Større …")
let ventKvante = null;
export function tagVentKvante() {
  const id = ventKvante;
  ventKvante = null;
  return id;
}

// Har et link valgt et fænomen på skærmen (åbnFænomen med id)? Glemmes, når det er hentet.
export function tagVentFænomen(skærm) {
  const ja = ventFænomen === skærm;
  ventFænomen = null;
  return ja;
}

// Det sted, skærmen skal gå til, når den starter (eller null). Glemmes, når det er hentet.
export function tagVentSted(skærm) {
  const sted = ventSted?.skærm === skærm ? ventSted.sted : null;
  ventSted = null;
  return sted;
}

// Knapper med data-gaa="skærm:id" (eller bare "skærm", eller "skærm:id:sted") i teksterne åbner et fænomen et andet sted,
// data-gaa="system:55" et grundstof i Det periodiske system, data-gaa="gaader:sorthul" et kort i Gåderne og
// data-gaa="liv:protein" "Fra opskrift til protein" i Liv, data-gaa="molekyler:bytte" "Giv elektroner" i Molekyler og
// data-gaa="opdagelser:huygens" en bog i Opdagelserne (og "opdagelser:einstein:energien" et opslag i bogen)
document.addEventListener('click', (h) => {
  const b = h.target.closest?.('[data-gaa]');
  if (!b) return;
  const [skærm, id, sted] = b.dataset.gaa.split(':');
  if (skærm === 'system') {
    const nr = Number(id);
    if (!(nr >= 1 && nr <= 118)) return;
    lyd.klik();
    if (location.hash === '#system' && hentetSkærm('system')) hentetSkærm('system').visGrundstofFraLink(nr);
    else {
      ventGrundstof = nr;
      location.hash = '#system';
    }
    return;
  }
  if (skærm === 'gaader') return åbnGåde(id);
  if (skærm === 'liv') {
    lyd.klik();
    if (location.hash === '#liv' && hentetSkærm('liv')) hentetSkærm('liv').visDel(id);
    else {
      ventLiv = id ?? null;
      location.hash = '#liv';
    }
    return;
  }
  if (skærm === 'opdagelser') {
    lyd.klik();
    if (location.hash === '#opdagelser' && hentetSkærm('opdagelser')) hentetSkærm('opdagelser').visBog(id, sted);
    else {
      ventBog = id ? { id, opslag: sted } : null;
      location.hash = '#opdagelser';
    }
    return;
  }
  if (skærm === 'molekyler') {
    lyd.klik();
    if (location.hash === '#molekyler' && hentetSkærm('molekyler')) hentetSkærm('molekyler').sætMåde(id);
    else {
      ventMolekyler = id ?? null;
      location.hash = '#molekyler';
    }
    return;
  }
  // Ild i Kemi (data-gaa="ild" eller "ild:knaldgas", knaldgassen fra Molekyler)
  if (skærm === 'ild') {
    lyd.klik();
    if (location.hash === '#ild' && hentetSkærm('ild')) hentetSkærm('ild').vis(id);
    else {
      ventIld = id ?? null;
      location.hash = '#ild';
    }
    return;
  }
  // Kvantefysik i Atomer (data-gaa="kvante:lys" eller "kvante:stor")
  if (skærm === 'kvante') {
    lyd.klik();
    if (location.hash === '#kvante' && hentetSkærm('kvante')) hentetSkærm('kvante').vis(id);
    else {
      ventKvante = id ?? null;
      location.hash = '#kvante';
    }
    return;
  }
  // Begyndelsen i Liv (data-gaa="begyndelsen", fx fra gåden "Hvordan begyndte livet?")
  if (skærm === 'begyndelsen') {
    lyd.klik();
    location.hash = '#begyndelsen';
    return;
  }
  if (!NØGLER[skærm]) return;
  lyd.klik();
  åbnFænomen(skærm, id, sted);
});

// ---------- Forløb (js/forloeb.js) ----------
// Et forløb, delen skal starte, når den starter: fra "Din fremgang" i menuen eller fra forløbets eget link
// (?forloeb=foerste-atom#vaerksted, fx fra en lærer). Linket starter forløbet, også selvom man har taget det.
let ventForløb = new URLSearchParams(location.search).get('forloeb');

// Et kort i Gåderne fra et "Hvorfor?"-kort (link.handling), som data-gaa="gaader:id"
export function åbnGåde(id) {
  lyd.klik();
  if (location.hash === '#gaader' && hentetSkærm('gaader')) hentetSkærm('gaader').visGåde(id);
  else {
    ventGåde = id ?? null;
    location.hash = '#gaader';
  }
}

// Starter forløbet id i delen del (en skærm i js/skaerme.js)
export function åbnForløb(del, id) {
  ventForløb = id;
  location.hash = `#${del}`;
}

// Forløbet, der venter, uden at glemme det (Kosmos ser efter, hvilket fænomen der skal vælges, fx Rejsen i tid), og et
// forløb, der skal vente på delen, når man allerede er der (fx fra hjælpen i Kosmos)
export const ventendeForløb = () => ventForløb;
export function sætVentForløb(id) {
  ventForløb = id;
}

// Det forløb, der venter på delens forløb (eller null). Glemmes, når det er hentet, og ?forloeb fjernes fra adressen,
// så det ikke starter igen, når man genindlæser siden.
export function tagVentForløb(ider) {
  if (!ventForløb || !ider.includes(ventForløb)) return null;
  const id = ventForløb;
  ventForløb = null;
  const søg = new URLSearchParams(location.search);
  if (søg.has('forloeb')) {
    søg.delete('forloeb');
    const s = søg.toString();
    history.replaceState(history.state, '', location.pathname + (s ? `?${s}` : '') + location.hash);
  }
  return id;
}
