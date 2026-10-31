// Knapper i teksterne i Kosmos og Solsystemet (siden i lag, U3 i docs/plan-ux.md). De afløser "Tryk X" i teksterne.
// Skallen (js/faenomenskaerm.js) finder dem i panelet og gør det samme, som hvis man trykkede på det rigtige sted:
// - sted(id, tekst): et sted i træet (fx 'olympus'), og kameraet flyver derhen
// - kontakt(navn): en kontakt i Styr-boksen (fx 'Modlys'). Den viser, om kontakten er tændt, og et tryk slår den til eller fra.
// - handling(navn, tekst): en handling i bjælken (fx 'Stå på Mars'). Den er grå, når handlingen ikke kan bruges lige nu.
// - tur(tekst): turen (flybyen)
// - tid(tilstand, tekst): tidsknappen ('spil', 'pause' eller 'hurtig')
// - gå(mål, tekst): et fænomen på en skærm ('kosmos:hviddvaerg' eller 'solsystem:aarstider')
// - skærm(adresse, tekst): en anden del af AtomLab (fx '#fusion')
// Uden Three.js, så teksterne kan testes i Node.

const navnet = (s) => s.replace(/"/g, '&quot;');

export const sted = (id, tekst) => `<button class="side-knap" data-sted="${id}">${tekst} ›</button>`;
export const kontakt = (navn, tekst = navn) => `<button class="side-knap side-kontakt" data-kontakt="${navnet(navn)}"><span class="kontakt-boks" aria-hidden="true"></span>${tekst}</button>`;
export const handling = (navn, tekst = navn) => `<button class="side-knap" data-handling="${navnet(navn)}">${tekst}</button>`;
export const tur = (tekst) => `<button class="side-knap" data-tur="1">${tekst}</button>`;
export const tid = (tilstand, tekst) => `<button class="side-knap" data-tid="${tilstand}">${tekst}</button>`;
export const gå = (mål, tekst) => `<button class="side-knap" data-gaa="${mål}">${tekst} ›</button>`;
export const skærm = (adresse, tekst) => `<a class="side-knap" href="${adresse}">${tekst} ›</a>`;
