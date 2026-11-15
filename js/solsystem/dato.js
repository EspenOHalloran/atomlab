// Overblikkets dato (docs/drejebog-overblik.md, "Datoen følger med"): Er tiden spolet i overblikket, starter Venus,
// Jorden, Uranus og Neptun på den samme dato, når man flyver ind. Ellers på tidspunktet lige nu.
// Mars, Jupiter og Saturn har en fast årstid, så de bruger den ikke (mørket i overgangen skjuler det).
let spolet = null; // ms, eller null: overblikket viser i dag

export function sætOverblikDato(ms) {
  spolet = ms;
}

// Den dato (ms), en planets visning skal starte på
export function startDato() {
  return spolet ?? Date.now();
}
