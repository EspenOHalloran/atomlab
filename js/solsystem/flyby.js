// Flybyen: en guidet tur med stop i et planetsystem (Saturn og Mars). Hvert stop har en undertekst med prikker
// (fase), en tekst i panelet og knappen "Næste: … ›". Selve flyvningen til stoppet laver planeten (flyvTil).
//
// stop: [{ titel, tekst, mere, knap }]: tekst er underteksten, mere teksten i panelet og knap et kortere navn på
//   "Næste"-knappen (ellers titlen).
// fase og forklaring kommer fra fænomenskærmen. flyvTil(stop, trin) flyver kameraet derhen. skift() bygger
// knapperne om. slut kommer til sidst i panelet ved det sidste stop.

export function lavFlyby({ stop, fase, forklaring, flyvTil, skift, slut = '' }) {
  let trin = null; // det stop, turen er ved (null = ingen tur)

  function næste() {
    if (trin === null || trin >= stop.length - 1) return;
    trin++;
    const s = stop[trin];
    const sidste = trin === stop.length - 1;
    fase(s.titel, s.tekst, [trin + 1, stop.length]);
    forklaring(s.mere + (sidste ? slut : ''));
    flyvTil(s, trin);
    if (sidste) trin = null; // ved det sidste stop er turen slut, og knapperne bliver de almindelige igen
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
      næste();
    },
    næste,
    afslut,
    // Knapperne under turen
    knapper() {
      const n = stop[trin + 1];
      return [
        { tekst: `Næste: ${n.knap ?? n.titel} ›`, handling: næste },
        { tekst: '■ Stop flyby', handling: () => { afslut(); skift(); } },
      ];
    },
  };
}
