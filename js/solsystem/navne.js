// Knappen "Navne" under "Prøv selv": navnene på planeterne og månerne (fx stederne på Mars og Saturns måner).
// Ét valg for alle planeterne, som huskes i localStorage under 'atomlabNavne' ('til' eller 'fra').

const NØGLE = 'atomlabNavne';
let til = hent();

function hent() {
  try {
    return localStorage.getItem(NØGLE) !== 'fra';
  } catch {
    return true;
  }
}

// Er navnene slået til?
export function navneTil() {
  return til;
}

// Til/fra-knappen til styringen. skift(til) kaldes, når valget ændres (fx for at skjule navnene med det samme).
export function navneKnap(skift) {
  return {
    tekst: 'Navne',
    til,
    skift: (ny) => {
      til = ny;
      try {
        localStorage.setItem(NØGLE, til ? 'til' : 'fra');
      } catch {
        // ingen lagring, så husker vi det bare ikke
      }
      skift?.(til);
    },
  };
}
