// Flybyen: en guidet tur med stop i et planetsystem (Saturn og Mars). Hvert stop har en undertekst med prikker
// (fase), en tekst i panelet og bjælkens "Næste: … ›" i 3D-billedet. Selve flyvningen til stoppet laver planeten
// (flyvTil).
//
// stop: [{ titel, tekst, mere, knap }]: tekst er underteksten, mere teksten i panelet og knap et kortere navn på
//   "Næste"-knappen (ellers titlen).
// fase og forklaring kommer fra fænomenskærmen. flyvTil(stop, nr, hop) flyver kameraet derhen. hop er true, når man
// springer (‹ eller en prik) i stedet for at tage det næste stop. skift() bygger knapperne om. slut kommer til sidst i
// panelet ved det sidste stop.

export function lavFlyby({ stop, fase, forklaring, flyvTil, skift, slut = '' }) {
  let trin = null; // det stop, turen er ved (null = ingen tur)

  // Gå til stop nr (fra 0). Ved det sidste stop er turen slut, og bjælken viser "▶ Start flyby" igen.
  function gå(nr) {
    if (trin === null || nr === trin || nr < 0 || nr >= stop.length) return;
    const hop = nr !== trin + 1;
    trin = nr;
    const s = stop[nr];
    const sidste = nr === stop.length - 1;
    fase(s.titel, s.tekst, [nr + 1, stop.length]);
    forklaring(s.mere + (sidste ? slut : ''));
    flyvTil(s, nr, hop);
    if (sidste) trin = null;
    skift();
  }

  // Stopper turen. Underteksten forsvinder.
  function afslut() {
    if (trin === null) return;
    trin = null;
    fase(null);
  }

  return {
    get kører() { return trin !== null; },
    get trin() { return trin; },
    start() {
      trin = -1;
      gå(0);
    },
    næste: () => gå(trin + 1),
    gå,
    afslut,
    // Trinene til bjælken i fænomenskærmen (null, når turen ikke kører)
    bjælke() {
      if (trin === null || trin < 0) return null;
      const n = stop[trin + 1];
      return {
        nr: trin, ialt: stop.length, næste: n ? (n.knap ?? n.titel) : '', gå,
        stop: () => { afslut(); skift(); },
      };
    },
  };
}
