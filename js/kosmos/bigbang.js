// Big Bang: hvor de første atomkerner kom fra.
// Protoner og neutroner (1:1) → neutronerne bliver færre (1:7) → efter ca. 3 minutter bliver de bygget ind i helium-4
// → efter ca. 20 minutter stopper det (75 % hydrogen, 25 % helium) → efter 380.000 år fanger kernerne elektroner (de første atomer)
// → de første stjerner. Man går selv videre fra trin til trin, så der er tid til at læse.

import * as THREE from 'three';
import { glød, prikSky, KVALITET } from './faelles.js';

// 128 kernepartikler. Fra start er halvdelen neutroner. Da fusionen går i gang, er der 1 neutron for hver 7 protoner (16 og 112).
// 16 neutroner + 16 protoner bliver til 8 heliumkerner (32 af 128 = 25 %), og 96 protoner bliver hydrogen (75 %).
const ANTAL = 128;
const NEUTRONER_FØR = 64;
const NEUTRONER_EFTER = 16;
const FARVE = {
  p: new THREE.Color(1.8, 0.42, 0.38),
  n: new THREE.Color(0.85, 0.92, 1.2),
  he: new THREE.Color(0.42, 0.85, 1.9),
};
const TETRA = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => new THREE.Vector3(...v).normalize().multiplyScalar(0.2));

// Trinene: titel, undertekst, hvor stort universet er (skala) og kameraets afstand
const TRIN = [
  {
    titel: 'Det første øjeblik',
    tekst: 'Alt det, vi kan se i universet i dag, var samlet i en ufatteligt varm og tæt tilstand. Så begyndte rummet at udvide sig, alle steder på én gang. Det var alt for varmt til atomer og selv til atomkerner.',
    tid: 'Brøkdele af et sekund', skala: 1.6, radius: 4,
  },
  {
    titel: 'Protoner og neutroner',
    // Kvarkerne samles til protoner og neutroner ved ca. 150 MeV, efter ca. 10-20 milliontedele af et sekund
    tekst: 'Efter ca. en hundredtusindedel af et sekund er der protoner (røde) og neutroner (hvide), lige mange af hver. Finder en proton og en neutron sammen til deuterium, bliver de straks skudt fra hinanden igen af den hårde stråling (de små glimt).',
    tid: 'Ca. en hundredtusindedel af et sekund', skala: 3.4, radius: 6.5,
  },
  {
    titel: 'Neutronerne bliver færre',
    tekst: 'En neutron er en smule tungere end en proton. Mens universet køler af, bliver flere neutroner til protoner end omvendt, og frie neutroner henfalder også af sig selv. Efter ca. 3 minutter er der kun 1 neutron for hver 7 protoner.',
    tid: 'Fra en brøkdel af et sekund til 3 minutter', skala: 4.2, radius: 7.5,
  },
  {
    titel: 'Fusion!',
    tekst: 'Nu er universet kølet af til omkring en milliard grader. Deuterium kan holde sammen, og på få minutter bliver næsten alle neutronerne bygget ind i helium-4 (blå). Det er fusion som i Stjerneovnen, men lettere, for neutronerne er der allerede.',
    tid: 'Ca. 3 minutter', skala: 4.8, radius: 8,
  },
  {
    titel: 'Det stopper efter ca. 20 minutter',
    tekst: 'Universet er blevet for koldt og tyndt til mere fusion. Næsten ingen tungere kerner nåede at blive lavet, for der findes ingen stabile kerner med 5 eller 8 nukleoner. Resultatet er ca. 75 % hydrogen og 25 % helium (af vægten) og en lille smule lithium.',
    tid: 'Ca. 20 minutter', skala: 5.6, radius: 8.5,
  },
  {
    titel: 'De første atomer',
    tekst: 'I 380.000 år var universet en glødende tåge af plasma, som lyset ikke kunne komme igennem. Ved ca. 3.000 grader fanger kernerne elektroner (de lyseblå prikker), og de første atomer bliver til. Nu kan lyset flyve frit. Det kan vi stadig måle: den kosmiske baggrundsstråling.',
    tid: 'Ca. 380.000 år', skala: 6.4, radius: 9.5,
  },
  {
    titel: 'De første stjerner',
    tekst: 'Tyngdekraften samler gassen i klumper, og de første stjerner tænder. Inde i dem, og når de eksploderer, bliver hydrogen og helium til carbon, oxygen og jern, som Big Bang aldrig nåede at lave. Prøv "Ny stjerne" i listen.',
    tid: 'Ca. 100-200 millioner år', skala: 7.2, radius: 10.5,
  },
];

export default {
  id: 'bigbang',
  navn: 'Big Bang',
  ikon: '🌌',
  undertitel: 'Hvor de første atomer kom fra',
  citat: 'saganÆbletærte',
  kamera: { retning: [0.25, 0.35, 1], radius: 5 },
  tal: [
    ['Universets alder', 'ca. 13,8 mia. år'],
    ['Hydrogen og helium', 'blev lavet på ca. 20 minutter'],
    ['Bagefter var der', 'ca. 75 % hydrogen og 25 % helium'],
    ['De første atomer', 'efter ca. 380.000 år'],
  ],
  kort: `
    <p>For ca. 13,8 milliarder år siden var alt det, vi kan se i universet, samlet i en ufatteligt varm og tæt tilstand. Så begyndte rummet at udvide sig, og det gør det stadig. Det kalder vi <b>Big Bang</b>. Det var ikke en eksplosion et bestemt sted: Det var rummet selv, der begyndte at strække sig, alle steder på én gang.</p>
    <p>I de første minutter var hele universet en kæmpe stjerneovn. Protoner og neutroner smeltede sammen til helium. Efter ca. 20 minutter var det slut, og resultatet var ca. 75 % hydrogen og 25 % helium. Sådan ser det stadig ud næsten overalt i universet. Næsten alle tungere grundstoffer blev lavet senere: i stjerner, når stjerner eksploderer, og når neutronstjerner støder sammen.</p>
    <p>Tryk "Start universet", og gå videre med "Næste" i dit eget tempo.</p>`,
  nørd: `
    <p><b>Hvorfor lige 25 % helium?</b> Da fusionen gik i gang efter ca. 3 minutter, var der ca. 1 neutron for hver 7 protoner. Tag 16 nukleoner: 2 neutroner og 14 protoner. De 2 neutroner og 2 af protonerne bliver til én heliumkerne. Det er 4 ud af 16, altså 25 % af vægten. De 12 andre protoner bliver hydrogen. Målinger af gasskyer, der næsten ikke indeholder tungere grundstoffer, og af baggrundsstrålingen passer med det.</p>
    <p><b>Hvorfor blev neutronerne færre?</b> En fri neutron henfalder til en proton, en elektron og en antineutrino (halveringstiden er ca. 10 minutter). I det første sekund blev neutroner og protoner også hele tiden lavet om til hinanden. Da universet var kølet af, gik det lettest den vej, der giver en proton, fordi neutronen er en smule tungere.</p>
    <p><b>Lettere end i Solen:</b> I Stjerneovnen er det første skridt (proton + proton → deuterium) det sværeste, fordi en proton skal laves om til en neutron. En proton i Solen venter i gennemsnit milliarder af år på det. I Big Bang var der frie neutroner, så proton + neutron → deuterium gik let.</p>
    <p><b>Hvorfor stoppede det ved helium?</b> Der findes ingen stabile kerner med 5 eller 8 nukleoner. Helium-4 plus en proton falder straks fra hinanden, og det gør to heliumkerner (beryllium-8) også. Se det selv i Stjerneovnen. Stjernerne klarer det senere, fordi de har millioner af år og stor tæthed, så tre heliumkerner kan nå at mødes. Big Bang havde kun minutter.</p>
    <p><b>Det første lys:</b> Vi kan stadig se lyset fra dengang, da de første atomer blev dannet. Universet er udvidet så meget siden, at lyset er strakt ud til mikrobølger. Det blev opdaget ved et tilfælde i 1964 af Arno Penzias og Robert Wilson. De mistænkte blandt andet duerne, der boede i antennen, og deres klatter for at give støjen. De fjernede duerne og gjorde rent, men støjen blev ved.</p>
    <p><b>Navnet</b> "Big Bang" fandt astronomen Fred Hoyle på i et radioprogram i 1949. Han troede selv ikke på teorien.</p>
    <p><b>Ærligt talt:</b> Animationen viser en klump, der vokser. Men Big Bang skete ikke ét sted i et tomt rum. Det var rummet selv, der udvidede sig overalt. Der er også ufatteligt mange flere partikler, og tiden er spolet vildt: En hundredtusindedel af et sekund, 3 minutter og 380.000 år tager her lige lang tid.</p>`,

  lav(gruppe, { effekter, lyd, fase, kamera, opdaterKnapper, forklaring }) {
    // ---------- Det, man ser ----------
    // Ildkuglen i det første øjeblik og den glødende tåge af plasma, som lyset ikke kan komme igennem
    const ildkugle = glød(new THREE.Color(2.4, 1.8, 1.2), 1, 0);
    const tåge = glød(new THREE.Color(1.4, 0.55, 0.25), 1, 0);
    gruppe.add(ildkugle, tåge);
    // Gnister af energi, der farer ud i det første øjeblik
    const NG = Math.round(260 * KVALITET);
    const gnister = prikSky(NG, 0.16, (i, c) => c.setRGB(1.6, 1.4 + Math.random() * 0.4, 1.0 + Math.random()));
    const gnistRetning = Array.from({ length: NG }, () => new THREE.Vector3().randomDirection().multiplyScalar(0.4 + Math.random()));
    gnister.visible = false;
    gruppe.add(gnister);

    // Kernepartiklerne
    const type = new Array(ANTAL);
    const nuk = prikSky(ANTAL, 0.55, () => {});
    nuk.visible = false;
    gruppe.add(nuk);
    const nPos = nuk.geometry.attributes.position.array;
    const nFarve = nuk.geometry.attributes.color.array;
    const anker = Array.from({ length: ANTAL }, () => new THREE.Vector3()); // plads i "universets koordinater" (ganges med skala)
    const fart = Array.from({ length: ANTAL }, () => new THREE.Vector3());
    const grp = new Int16Array(ANTAL); // hvilken klump (deuterium eller helium) partiklen er i (-1 = fri)
    const forskyd = Array.from({ length: ANTAL }, () => new THREE.Vector3()); // pladsen i klumpen
    const vist = Array.from({ length: ANTAL }, () => new THREE.Vector3()); // hvor den er nu
    let klumper = []; // { medlemmer, anker, fart, helium }

    // Elektronerne (fra "De første atomer")
    const ANTAL_E = ANTAL - NEUTRONER_EFTER * 2 + NEUTRONER_EFTER; // 96 til hydrogen og 2 til hver af de 8 heliumkerner
    const elek = prikSky(ANTAL_E, 0.26, (i, c) => c.setRGB(0.45, 1.4, 1.9));
    elek.visible = false;
    gruppe.add(elek);
    const ePos = elek.geometry.attributes.position.array;
    const eStart = Array.from({ length: ANTAL_E }, () => new THREE.Vector3());
    const eBane = []; // { kerne: partikel-nr eller klump, radius, vinkel, akse }

    // De første stjerner
    const stjerner = [];
    for (let i = 0; i < 5; i++) {
      const s = glød(new THREE.Color(2.2, 1.9, 1.5), 1, 0);
      gruppe.add(s);
      stjerner.push(s);
    }
    let stjerneSteder = [];

    // ---------- Tilstand ----------
    let trin = -1; // -1 = ikke startet
    let trinTid = 0; // sekunder i det nuværende trin
    let skala = 0.4; // hvor stort universet er lige nu
    let overgang = null; // { t, varighed, fra }: kernepartiklerne glider hen til en ny plads (fx ind i en heliumkerne)
    let glimtTid = 0;
    let omdannet = 0; // neutroner, der er blevet til protoner
    let heliumFase = 0; // 0 = intet, 1 = deuterium, 2 = helium

    const blød = (x) => x * x * (3 - 2 * x);

    function tilfældigIKugle(v) {
      do v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      while (v.lengthSq() > 1);
      return v;
    }

    function farvLæg() {
      for (let i = 0; i < ANTAL; i++) {
        const k = grp[i] >= 0 ? klumper[grp[i]] : null;
        const c = k?.helium ? FARVE.he : FARVE[type[i]];
        nFarve[i * 3] = c.r; nFarve[i * 3 + 1] = c.g; nFarve[i * 3 + 2] = c.b;
      }
      nuk.geometry.attributes.color.needsUpdate = true;
    }

    function start() {
      trin = 0;
      trinTid = 0;
      skala = 0.4;
      klumper = [];
      grp.fill(-1);
      overgang = null;
      omdannet = 0;
      heliumFase = 0;
      stjerneSteder = [];
      for (let i = 0; i < ANTAL; i++) {
        type[i] = i < NEUTRONER_FØR ? 'n' : 'p';
        tilfældigIKugle(anker[i]);
        fart[i].randomDirection().multiplyScalar(0.06 + Math.random() * 0.08);
      }
      farvLæg();
      nuk.visible = false;
      elek.visible = false;
      gnister.visible = true;
      for (const s of stjerner) s.material.opacity = 0;
      lyd.sus(2.4);
      visTrin();
    }

    function nulstil() {
      trin = -1;
      nuk.visible = false;
      elek.visible = false;
      gnister.visible = false;
      ildkugle.material.opacity = 0;
      tåge.material.opacity = 0;
      for (const s of stjerner) s.material.opacity = 0;
      fase(null);
      forklaring('');
      kamera({ radius: 5, flyv: false });
      opdaterKnapper();
    }

    // Gør det nuværende trin færdigt med det samme (hvis man trykker "Næste", før animationen er færdig)
    function gørFærdig() {
      if (trin === 2) while (omdannet < NEUTRONER_FØR - NEUTRONER_EFTER) omdanNeutron(false);
      if (trin === 3) {
        if (heliumFase < 1) lavDeuterium();
        if (heliumFase < 2) lavHelium();
        overgang = null;
      }
    }

    function næste() {
      if (trin < 0 || trin >= TRIN.length - 1) return;
      gørFærdig();
      trin++;
      trinTid = 0;
      if (trin === 1) {
        nuk.visible = true;
        lyd.proton();
      }
      if (trin === 5) startAtomer();
      if (trin === 6) startStjerner();
      visTrin();
    }

    function visTrin() {
      const t = TRIN[trin];
      fase(t.titel, t.tekst, [trin + 1, TRIN.length]);
      kamera({ radius: t.radius, flyv: false });
      opdaterPanel();
      opdaterKnapper();
    }

    // Gå til et trin (Næste, ‹ og prikkerne i bjælken). Universet bygges op trin for trin, så et trin tilbage starter
    // forfra og går frem igen (hvert trin gøres færdigt med det samme, gørFærdig).
    function gåTrin(nr) {
      if (trin < 0 || nr < 0 || nr >= TRIN.length || nr === trin) return;
      if (nr < trin) {
        nulstil();
        start();
      }
      while (trin < nr) næste();
    }

    // Panelet: hvor langt vi er, og hvad universet består af
    function opdaterPanel() {
      if (trin < 0) { forklaring(''); return; }
      const nN = type.filter((x) => x === 'n').length;
      let indhold;
      if (heliumFase < 2) {
        indhold = trin === 0 ? 'Endnu ingen protoner eller neutroner.' : `Frie protoner: ${ANTAL - nN} · Frie neutroner: ${nN}`;
      } else {
        indhold = 'Hydrogen: 75 % · Helium: 25 % (af vægten)';
      }
      forklaring(`<p class="bb-tid"><b>Tid efter Big Bang:</b> ${TRIN[trin].tid}</p><p>${indhold}</p>
        <ul class="kerne-liste">
          <li><span class="farveprik" style="background:#ff6b6b"></span>Proton (en hydrogenkerne)</li>
          <li><span class="farveprik" style="background:#d9e4ff"></span>Neutron</li>
          <li><span class="farveprik" style="background:#6fc3ff"></span>Helium-4 (2 protoner og 2 neutroner)</li>
          ${trin >= 5 ? '<li><span class="farveprik" style="background:#6ff3ff"></span>Elektron</li>' : ''}
        </ul>`);
    }

    function omdanNeutron(medGlimt = true) {
      const i = type.indexOf('n');
      if (i < 0) return;
      type[i] = 'p';
      omdannet++;
      if (medGlimt && omdannet % 3 === 0) effekter.glimt(vist[i].clone(), 0.6, new THREE.Color(0.8, 1.2, 2.2), 0.35);
      farvLæg();
    }

    // Kernepartiklerne skal glide hen til deres nye plads
    function startOvergang(varighed = 1.4) {
      overgang = { t: 0, varighed, fra: vist.map((v) => v.clone()) };
    }

    // Hver neutron finder den nærmeste frie proton: deuterium
    function lavDeuterium() {
      heliumFase = 1;
      for (let n = 0; n < ANTAL; n++) {
        if (type[n] !== 'n' || grp[n] >= 0) continue;
        let bedst = -1, bedstAfstand = Infinity;
        for (let p = 0; p < ANTAL; p++) {
          if (type[p] !== 'p' || grp[p] >= 0) continue;
          const d = anker[p].distanceToSquared(anker[n]);
          if (d < bedstAfstand) { bedstAfstand = d; bedst = p; }
        }
        const k = { medlemmer: [n, bedst], anker: anker[n].clone().add(anker[bedst]).multiplyScalar(0.5), fart: fart[n].clone().multiplyScalar(0.5), helium: false };
        const retning = new THREE.Vector3().randomDirection().multiplyScalar(0.13);
        forskyd[n].copy(retning);
        forskyd[bedst].copy(retning).negate();
        grp[n] = grp[bedst] = klumper.length;
        klumper.push(k);
      }
      startOvergang();
      lyd.fusion(1);
    }

    // To og to deuterium bliver til helium-4
    function lavHelium() {
      heliumFase = 2;
      const gamle = klumper;
      const brugt = new Set();
      const nye = [];
      for (let a = 0; a < gamle.length; a++) {
        if (brugt.has(a)) continue;
        let bedst = -1, bedstAfstand = Infinity;
        for (let b = 0; b < gamle.length; b++) {
          if (b === a || brugt.has(b)) continue;
          const d = gamle[a].anker.distanceToSquared(gamle[b].anker);
          if (d < bedstAfstand) { bedstAfstand = d; bedst = b; }
        }
        brugt.add(a);
        brugt.add(bedst);
        const medlemmer = [...gamle[a].medlemmer, ...gamle[bedst].medlemmer];
        const k = { medlemmer, anker: gamle[a].anker.clone().add(gamle[bedst].anker).multiplyScalar(0.5), fart: gamle[a].fart.clone(), helium: true };
        // To protoner og to neutroner i et lille tetraeder
        const p = medlemmer.filter((i) => type[i] === 'p');
        const n = medlemmer.filter((i) => type[i] === 'n');
        [...p, ...n].forEach((i, j) => { forskyd[i].copy(TETRA[j]); grp[i] = nye.length; });
        nye.push(k);
      }
      klumper = nye;
      startOvergang();
      farvLæg();
      for (const k of klumper) effekter.glimt(k.anker.clone().multiplyScalar(skala), 0.9, new THREE.Color(1.2, 1.8, 2.6), 0.5);
      lyd.fusion(2);
      opdaterPanel();
    }

    // Elektronerne bliver fanget: hver proton får én, hver heliumkerne to
    function startAtomer() {
      eBane.length = 0;
      for (let i = 0; i < ANTAL; i++) if (grp[i] < 0) eBane.push({ kerne: i, radius: 0.32 });
      for (const k of klumper) for (let j = 0; j < 2; j++) eBane.push({ klump: k, radius: 0.42 });
      eBane.forEach((b, i) => {
        b.vinkel = Math.random() * Math.PI * 2;
        b.fart = 2.5 + Math.random() * 2;
        b.akse = new THREE.Vector3().randomDirection();
        b.u = new THREE.Vector3().crossVectors(b.akse, new THREE.Vector3(0.3, 1, 0.2)).normalize();
        b.w = new THREE.Vector3().crossVectors(b.akse, b.u);
        tilfældigIKugle(eStart[i]).multiplyScalar(skala * 1.15);
      });
      elek.visible = true;
      effekter.bølge(new THREE.Vector3(), skala * 4, new THREE.Color(1.6, 0.7, 0.4), 2.4);
      lyd.elektron();
    }

    // Tyngdekraften samler gassen i klumper, og de første stjerner tænder
    function startStjerner() {
      stjerneSteder = [];
      for (let i = 0; i < stjerner.length; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(0.35 + Math.random() * 0.45);
        stjerneSteder.push(v);
      }
      // Hver partikel (og klump) søger mod det nærmeste sted
      for (let i = 0; i < ANTAL; i++) anker[i].userData = nærmeste(anker[i]);
      for (const k of klumper) k.anker.userData = nærmeste(k.anker);
      lyd.sus(2);
    }
    function nærmeste(v) {
      let bedst = stjerneSteder[0], d0 = Infinity;
      for (const s of stjerneSteder) { const d = s.distanceToSquared(v); if (d < d0) { d0 = d; bedst = s; } }
      return bedst;
    }

    const hjælp = new THREE.Vector3();
    function flyt(v, f, dt, køling) {
      v.addScaledVector(f, dt * køling);
      if (v.lengthSq() > 1) { v.setLength(1); f.reflect(hjælp.copy(v).normalize()); }
    }

    // Før start står "▶ Start universet" i bjælken, og bagefter trinene (trin() nedenfor)
    const styring = [
      { tekst: '▶ Start universet', handling: start, skjul: () => trin >= 0 },
    ];

    return {
      styring,
      trin: () => (trin < 0 ? null : { nr: trin, ialt: TRIN.length, næste: trin < TRIN.length - 1 ? TRIN[trin + 1].titel.toLowerCase() : '', gå: gåTrin, forfra: nulstil }),
      opdater(dt, tid) {
        if (trin < 0) {
          // Før start: et lille, varmt lyspunkt, der venter
          ildkugle.scale.setScalar(0.9 + 0.12 * Math.sin(tid * 2.2));
          ildkugle.material.opacity = 0.85;
          return;
        }
        trinTid += dt;
        // Universet udvider sig blødt hen mod trinets størrelse
        skala += (TRIN[trin].skala - skala) * (1 - Math.exp(-dt * 1.4));
        const køling = 1 / (1 + trin * 0.6); // partiklerne bliver langsommere, mens universet køler af

        // Det første øjeblik: en ildkugle og gnister
        const ildF = trin === 0 ? Math.min(1, trinTid / 2) : 1;
        ildkugle.scale.setScalar(0.3 + skala * 3.2 * ildF);
        ildkugle.material.opacity = trin === 0 ? 1 - 0.35 * ildF : Math.max(0, ildkugle.material.opacity - dt * 0.6);
        if (gnister.visible) {
          const p = gnister.geometry.attributes.position.array;
          const r = 0.2 + (trin === 0 ? trinTid : 3) * 2.2;
          for (let i = 0; i < NG; i++) {
            p[i * 3] = gnistRetning[i].x * r;
            p[i * 3 + 1] = gnistRetning[i].y * r;
            p[i * 3 + 2] = gnistRetning[i].z * r;
          }
          gnister.geometry.attributes.position.needsUpdate = true;
          gnister.material.opacity = trin === 0 ? Math.max(0, 1 - trinTid / 3) : 0;
          if (trin > 0 && gnister.material.opacity <= 0) gnister.visible = false;
        }
        // Den glødende tåge af plasma: tæt indtil de første atomer, så bliver universet gennemsigtigt
        const tågeMål = trin >= 1 && trin <= 4 ? 0.22 : 0;
        tåge.material.opacity += (tågeMål - tåge.material.opacity) * (1 - Math.exp(-dt * (trin === 5 ? 1.2 : 2)));
        tåge.scale.setScalar(skala * 3.4);

        // Trin 2: neutronerne bliver færre
        if (trin === 2 && omdannet < NEUTRONER_FØR - NEUTRONER_EFTER && trinTid > 0.6) {
          const skal = Math.min(NEUTRONER_FØR - NEUTRONER_EFTER, Math.floor((trinTid - 0.6) * 14));
          while (omdannet < skal) omdanNeutron();
          opdaterPanel();
        }
        // Trin 1-2: deuterium bliver dannet og straks skudt i stykker igen (små glimt)
        if ((trin === 1 || trin === 2) && nuk.visible) {
          glimtTid += dt;
          if (glimtTid > 0.3) {
            glimtTid = 0;
            const i = (Math.random() * ANTAL) | 0;
            effekter.glimt(vist[i].clone(), 0.55, new THREE.Color(2.2, 2.0, 1.2), 0.3);
          }
        }
        // Trin 3: deuterium og så helium
        if (trin === 3) {
          if (heliumFase === 0 && trinTid > 0.4) lavDeuterium();
          if (heliumFase === 1 && trinTid > 2.4) lavHelium();
        }
        // Trin 6: gassen trækkes sammen om stjernerne
        if (trin === 6) {
          const træk = 1 - Math.exp(-dt * 0.35);
          for (let i = 0; i < ANTAL; i++) if (grp[i] < 0 && anker[i].userData) anker[i].lerp(anker[i].userData, træk);
          for (const k of klumper) if (k.anker.userData) k.anker.lerp(k.anker.userData, træk);
          stjerner.forEach((s, i) => {
            const f = Math.max(0, Math.min(1, (trinTid - 2.5) / 2.5));
            s.position.copy(stjerneSteder[i]).multiplyScalar(skala);
            s.scale.setScalar(0.4 + f * 2.6 + 0.15 * Math.sin(tid * 3 + i));
            s.material.opacity = f * 0.95;
          });
        }

        // Kernepartiklerne: frie bevæger sig rundt, klumper bevæger sig samlet
        for (let i = 0; i < ANTAL; i++) if (grp[i] < 0) flyt(anker[i], fart[i], dt, køling * (trin === 6 ? 0.15 : 1));
        for (const k of klumper) flyt(k.anker, k.fart, dt, køling * 0.6 * (trin === 6 ? 0.15 : 1));
        if (overgang) overgang.t += dt;
        const e = overgang ? blød(Math.min(1, overgang.t / overgang.varighed)) : 1;
        for (let i = 0; i < ANTAL; i++) {
          const k = grp[i] >= 0 ? klumper[grp[i]] : null;
          hjælp.copy(k ? k.anker : anker[i]).multiplyScalar(skala);
          if (k) hjælp.add(forskyd[i]);
          if (overgang && e < 1) hjælp.lerp(overgang.fra[i], 1 - e);
          vist[i].copy(hjælp);
          nPos[i * 3] = hjælp.x; nPos[i * 3 + 1] = hjælp.y; nPos[i * 3 + 2] = hjælp.z;
        }
        if (overgang && e >= 1) overgang = null;
        nuk.geometry.attributes.position.needsUpdate = true;

        // Elektronerne kredser om kernerne (de svæver først frit og bliver så fanget)
        if (elek.visible) {
          const f = trin === 5 ? blød(Math.min(1, trinTid / 2.5)) : 1;
          eBane.forEach((b, i) => {
            b.vinkel += dt * b.fart;
            const midt = b.kerne !== undefined ? vist[b.kerne] : hjælp.copy(b.klump.anker).multiplyScalar(skala);
            const x = midt.x + (b.u.x * Math.cos(b.vinkel) + b.w.x * Math.sin(b.vinkel)) * b.radius;
            const y = midt.y + (b.u.y * Math.cos(b.vinkel) + b.w.y * Math.sin(b.vinkel)) * b.radius;
            const z = midt.z + (b.u.z * Math.cos(b.vinkel) + b.w.z * Math.sin(b.vinkel)) * b.radius;
            ePos[i * 3] = eStart[i].x + (x - eStart[i].x) * f;
            ePos[i * 3 + 1] = eStart[i].y + (y - eStart[i].y) * f;
            ePos[i * 3 + 2] = eStart[i].z + (z - eStart[i].z) * f;
          });
          elek.geometry.attributes.position.needsUpdate = true;
        }
      },
    };
  },
};
