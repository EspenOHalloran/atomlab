// Kosmos' forside (brugerens feedback 16. november 2026): Fra menuen starter Kosmos altid her og ikke midt i det
// fænomen, man så sidst. Fire kort, ét for hver gruppe i listen, med en knap for hvert fænomen. Scenen er kun
// stjernehimlen og tågerne, som drejer langsomt. Grupperne kommer fra js/kosmos.js (lavOversigt(grupper)).

export function lavOversigt(grupper) {
  return {
    id: 'oversigt',
    navn: 'Kosmos',
    ikon: '🧭',
    undertitel: 'Vælg, hvor i universet du vil hen',
    kamera: { retning: [0.2, 0.3, 1], radius: 6, drej: true },
    tal: [],
    side: {
      kort: 'Kosmos er de vilde ting i universet langt uden for vores eget solsystem: hvor atomerne kom fra, hvordan stjerner fødes og dør, hvad tid egentlig er, og hvad der sker ved et sort hul. Vælg et kort, eller brug listen.',
    },

    lav(gruppe, { overlag, vælgFænomen }) {
      void gruppe;
      const holder = overlag();
      const boks = document.createElement('div');
      boks.className = 'kosmos-forside';
      for (const g of grupper) {
        const kort = document.createElement('div');
        kort.className = 'kf-kort';
        kort.innerHTML = `<strong class="kf-titel"><span aria-hidden="true">${g.ikon}</span> ${g.navn}</strong><span class="kf-tekst">${g.tekst}</span>`;
        const knapper = document.createElement('div');
        knapper.className = 'kf-knapper';
        for (const f of g.under.filter((x) => !x.hørerTil)) {
          const b = document.createElement('button');
          b.className = 'kf-knap';
          b.dataset.id = f.id;
          b.title = f.undertitel;
          b.textContent = `${f.ikon} ${f.navn}`;
          b.addEventListener('click', () => vælgFænomen(f.id));
          knapper.append(b);
        }
        kort.append(knapper);
        boks.append(kort);
      }
      holder.append(boks);
      return { opdater() {}, stop() { boks.remove(); } };
    },
  };
}
