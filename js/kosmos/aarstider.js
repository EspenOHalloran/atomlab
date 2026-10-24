// Årstiderne: Jorden på sin bane om Solen. Aksen hælder ca. 23,4° og peger samme vej hele året.
// Man går frem trin for trin (jævndøgn og solhverv) og kan bagefter selv vælge datoen med en skyder.
// Panelet viser dagens længde og Solens højde ved middag fire steder. Tallene regnes ud i js/data/solbane.js
// for de rigtige steder (de passer med almanakkerne inden for få minutter, se tests/aarstider.mjs).

import * as THREE from 'three';
import { stjerne, skilt } from './faelles.js';
import { lavJorden, overflade } from './jorden.js';
import { HÆLDNING, dagIÅret, dagIDag, datoTekst, måned, dagslængde, middagshøjde, afstand, solensLængde, timerTekst } from '../data/solbane.js';

const BANE = 12; // Jordens bane i animationen (1 astronomisk enhed)
const JORD_R = 1.8;
const RAD = Math.PI / 180;
const OMDREJNING = 9; // sekunder for én omdrejning af Jorden i animationen

// De fire steder i panelet: navn, by, bredde og længde i grader (nord og øst er positive) og farve.
// skub = [øst, nord]: navnet flyttes lidt, så Danmark, Nordgrønland og N ikke står oven i hinanden.
const STEDER = [
  { navn: 'Danmark', by: 'København', bredde: 55.68, længde: 12.57, farve: '#ffd166', skub: [0.55, -0.2] },
  { navn: 'Australien', by: 'Sydney', bredde: -33.87, længde: 151.21, farve: '#7ee0ff', skub: [0, 0] },
  { navn: 'Ækvator', by: 'Singapore', bredde: 1.35, længde: 103.82, farve: '#9dff9d', skub: [0, 0] },
  { navn: 'Nordgrønland', by: 'Ilulissat', bredde: 69.22, længde: -51.1, farve: '#ff9de2', skub: [-0.6, 0.05] },
];

// Årstiden et sted (som DMI regner dem: vinter er december-februar, forår marts-maj osv.)
const NORD = ['vinter', 'vinter', 'forår', 'forår', 'forår', 'sommer', 'sommer', 'sommer', 'efterår', 'efterår', 'efterår', 'vinter'];
const SYD = ['sommer', 'sommer', 'efterår', 'efterår', 'efterår', 'vinter', 'vinter', 'vinter', 'forår', 'forår', 'forår', 'sommer'];
function årstid(sted, n, kort = false) {
  if (Math.abs(sted.bredde) < 10) return kort ? 'varmt hele året' : 'ingen sommer og vinter';
  return (sted.bredde > 0 ? NORD : SYD)[måned(n)];
}

// Trinene: dag i året, og om kameraet skal være tæt på Jorden (og fra hvilken retning)
const TRIN = [
  {
    titel: 'Jorden og Solen', dag: null, tæt: false,
    tekst: 'Jorden kredser om Solen på et år. Aksen hælder ca. 23,4° og peger hele tiden samme vej ud i rummet. Det giver årstiderne.',
  },
  {
    titel: 'Forår i nord', dag: dagIÅret(3, 20), tæt: true, retning: [1, 0.35, 0],
    tekst: 'Ingen af polerne hælder mod Solen, så grænsen mellem dag og nat går gennem begge poler. Dag og nat er ca. 12 timer overalt: forårsjævndøgn.',
  },
  {
    titel: 'Sommer i nord', dag: dagIÅret(6, 21), tæt: true, retning: [0, 0.3, 1],
    tekst: 'Nordpolen hælder mod Solen: sommer i nord og vinter i Australien. Solen står højt, så lyset rammer mere lige ned og varmer mere. Og dagene er lange.',
  },
  {
    titel: 'Efterår i nord', dag: dagIÅret(9, 23), tæt: true, retning: [1, 0.35, 0],
    tekst: 'Aksen peger stadig samme vej, men Jorden er nu på den anden side af Solen. Igen hælder ingen af polerne mod Solen: efterårsjævndøgn.',
  },
  {
    titel: 'Vinter i nord', dag: dagIÅret(12, 21), tæt: true, retning: [0, 0.3, 1],
    tekst: 'Nordpolen hælder væk fra Solen: vinter i nord og sommer i Australien. Men Jorden er tættest på Solen i januar. Så det er ikke afstanden, der giver årstiderne.',
  },
  {
    titel: 'Prøv selv', dag: null, tæt: false,
    tekst: 'Vælg selv datoen med skyderen. Jo længere fra ækvator, jo større er forskellen mellem sommer og vinter.',
  },
];

// Jordens plads i banen på dag n. Ved sommersolhverv ligger Jorden på -x, så den nordlige halvdel hælder mod Solen (+x).
function jordPlads(n, v = new THREE.Vector3()) {
  const θ = (solensLængde(n) + 90) * RAD;
  const r = BANE * afstand(n) / 149.6;
  return v.set(Math.cos(θ) * r, 0, -Math.sin(θ) * r);
}

export default {
  id: 'aarstider',
  navn: 'Årstiderne',
  ikon: '🌍',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Hvorfor det er sommer i nord, når det er vinter i syd',
  citat: 'einsteinNysgerrighed',
  kamera: { retning: [0.15, 0.9, 1], radius: 17 },
  tal: [
    ['Jordaksen hælder', 'ca. 23,4°'],
    ['Tættest på Solen', 'ca. 3. januar'],
    ['Længste dag i København', 'ca. 17½ time'],
    ['Korteste dag i København', 'ca. 7 timer'],
  ],
  kort: `
    <p>Jorden kredser om Solen på et år, og den drejer om sig selv én gang i døgnet. Aksen, som den drejer om, hælder ca. 23,4°, og den peger hele tiden samme vej ud i rummet, mod Nordstjernen.</p>
    <p>Derfor hælder den nordlige halvdel af Jorden mod Solen i den ene halvdel af året og væk fra den i den anden. Når den hælder mod Solen, er det sommer i nord: Solen står højt på himlen, og dagene er lange. Samtidig hælder den sydlige halvdel væk fra Solen, så det er vinter i fx Australien. Derfor holder de jul om sommeren dér.</p>
    <p>Jo længere man er fra ækvator, jo større er forskellen mellem sommer og vinter. Ved ækvator er dagen ca. 12 timer hele året. Nord for polarcirklen, fx i Nordgrønland, går Solen slet ikke ned midt på sommeren, og midt på vinteren står den slet ikke op.</p>
    <p>Tryk "Næste", og følg Jorden rundt om Solen. Bagefter kan du selv vælge datoen.</p>`,
  nørd: `
    <p><b>Hvorfor er det varmere om sommeren?</b> Af to grunde. Solen står højere, så lyset rammer mere lige ned. I København står Solen ca. 58° over horisonten ved middag på årets længste dag og kun ca. 11° på den korteste. Om vinteren bliver det samme sollys derfor fordelt på et ca. 4½ gange større område, så hver kvadratmeter får mindre. Og om sommeren skinner Solen mange flere timer.</p>
    <p><b>Det er ikke afstanden.</b> Jordens bane er næsten en cirkel. Jorden er tættest på Solen omkring 3. januar (ca. 147 mio. km) og længst væk i starten af juli (ca. 152 mio. km). I januar rammer der ca. 7 % mere sollys Jorden end i juli, og alligevel er det vinter i Danmark. Hvis afstanden gav årstiderne, ville hele Jorden have sommer på samme tid.</p>
    <p><b>Jævndøgn og solhverv:</b> Ved jævndøgn (ca. 20. marts og 23. september) står Solen lige over ækvator, og dag og nat er næsten lige lange overalt. Ved solhverv (ca. 21. juni og 21. december) står Solen længst mod nord eller syd, og dagen er længst eller kortest.</p>
    <p><b>Polarcirklen</b> ligger ca. 66,6° nord for ækvator (90° minus 23,4°). Mellem den og Nordpolen er der mindst én dag om året, hvor Solen ikke går ned, og mindst én, hvor den ikke står op. (Lige ved cirklen snyder luften lidt: Den bøjer lyset, så man kan skimte Solen midt på dagen.) I Ilulissat i Grønland er der midnatssol i ca. to måneder (ca. 20. maj til 23. juli) og mørketid i ca. seks uger (ca. 30. november til 11. januar). Mørketid er ikke kulsort i Ilulissat: Midt på dagen er der tusmørke.</p>
    <p><b>Hvorfor er juli varmere end 21. juni?</b> Land og hav er længe om at blive varme og om at køle af igen. Derfor er det som regel varmest i juli og august og koldest i januar og februar, lidt efter solhverv.</p>
    <p><b>Lidt over 12 timer ved ækvator:</b> I Singapore er dagen mellem ca. 12 t 03 min og 12 t 12 min hele året. Den er lidt over 12 timer, fordi luften bøjer sollyset, så man kan se Solen et par minutter, før den egentlig er over horisonten, og et par minutter efter den er gået ned. Og dagen regnes fra Solens øverste kant.</p>
    <p><b>Ærligt talt:</b> Solen og Jorden er tegnet alt for store i forhold til banen. Solen er ca. 109 gange bredere end Jorden, og afstanden mellem dem er ca. 11.700 gange Jordens bredde. I virkeligheden går der ca. 365 døgn, mens Jorden kommer én tur rundt om Solen. Tallene i panelet er regnet ud for de rigtige steder med den rigtige hældning, fra solopgang til solnedgang.</p>
    <p><b>Billederne af Jorden</b> er fra NASA. Jorden om dagen er sat sammen af satellitbilleder fra 2004, én måned for hver årstid, så man kan se sneen komme og gå, når du flytter datoen. Byernes lys om natten er fra 2016. Skyerne er de samme hele året. Bjergene er gjort højere, og luften om Jorden er tegnet ca. 10 gange tykkere end i virkeligheden. Ellers kunne man ikke se dem.</p>`,

  lav(gruppe, { fase, kamera, opdaterKnapper, forklaring, toplag, verden }) {
    // ---------- Solen ----------
    const sol = stjerne(2, '#fff1b8', '#ff8a20', new THREE.Color(2.2, 1.6, 0.7), 2.6, { styrke: 1.5 });
    gruppe.add(sol);

    // ---------- Banen med datoer ----------
    const banePunkter = [];
    for (let n = 1; n <= 365; n += 2) banePunkter.push(jordPlads(n));
    gruppe.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(banePunkter), new THREE.LineBasicMaterial({ color: 0x8fa4d8, transparent: true, opacity: 0.35, depthWrite: false })));
    // Skiltene på banen vises kun i oversigten (tæt på Jorden fylder de for meget)
    const baneSkilte = new THREE.Group();
    for (const [m, d, tekst] of [[3, 20, '20. marts'], [6, 21, '21. juni'], [9, 23, '23. september'], [12, 21, '21. december']]) {
      const s = skilt(tekst, '#cfe0ff', 1.5);
      s.position.copy(jordPlads(dagIÅret(m, d))).multiplyScalar(1.3).setY(-0.8);
      baneSkilte.add(s);
    }
    gruppe.add(baneSkilte);

    // ---------- Jorden (js/kosmos/jorden.js): aksen hælder mod +x og peger samme vej hele året ----------
    const { klode: jord, hældning, omdrejning, breddeCirkel, sætLys, sætDato: jordSætDato } = lavJorden(JORD_R, { hældning: HÆLDNING });
    gruppe.add(jord);
    sætLys(new THREE.Vector3(0, 0, 0), 2); // Solen i midten

    // Aksen med N for nord, ækvator og polarcirklerne
    const akse = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -JORD_R * 1.5, 0), new THREE.Vector3(0, JORD_R * 1.5, 0)]),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }),
    );
    const nord = skilt('N', '#ffffff', 0.5);
    nord.position.set(0, JORD_R * 1.5 + 0.45, 0);
    hældning.add(akse, nord, breddeCirkel(0, 0xffffff, 0.35), breddeCirkel(66.56, 0x9fd3ff, 0.45), breddeCirkel(-66.56, 0x9fd3ff, 0.45));

    // De fire steder: en lysende prik og et navn, som drejer med Jorden. Navnene tegnes oven på kloden (så de ikke
    // bliver skåret af ved kanten), men skjules, når stedet er på bagsiden.
    const navne = [];
    for (const s of STEDER) {
      const prik = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(s.farve).multiplyScalar(1.6) }));
      prik.position.copy(overflade(s.bredde, s.længde, JORD_R * 1.01));
      const navn = skilt(s.navn, s.farve, 0.42);
      const b = s.bredde * RAD, l = s.længde * RAD;
      const øst = new THREE.Vector3(-Math.sin(l), 0, -Math.cos(l));
      const nordpå = new THREE.Vector3(-Math.sin(b) * Math.cos(l), Math.cos(b), Math.sin(b) * Math.sin(l));
      navn.position.copy(overflade(s.bredde, s.længde, JORD_R * 1.24)).addScaledVector(øst, s.skub[0]).addScaledVector(nordpå, s.skub[1]);
      navn.material.depthTest = false;
      navn.renderOrder = 2;
      omdrejning.add(prik, navn);
      navne.push({ prik, navn });
    }

    // ---------- Sollyset tæt på Jorden: stråler fra Solen hen mod Jorden, så man kan se, hvor Solen er ----------
    // (I gruppen peger +x fra Solen mod Jorden. Gruppen følger Jorden og drejes hvert billede.)
    const solLys = new THREE.Group();
    const strålePunkter = [];
    const pile = [];
    for (const y of [-1.1, 0, 1.1]) {
      for (const z of [-1.1, 0, 1.1]) {
        strålePunkter.push(new THREE.Vector3(-4.8 * JORD_R, y * JORD_R, z * JORD_R), new THREE.Vector3(-1.9 * JORD_R, y * JORD_R, z * JORD_R));
        pile.push([-1.9 * JORD_R, y * JORD_R, z * JORD_R]);
      }
    }
    const lysFarve = 0xffd27a;
    solLys.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(strålePunkter), new THREE.LineBasicMaterial({ color: lysFarve, transparent: true, opacity: 0.45, depthWrite: false })));
    const pilGeo = new THREE.ConeGeometry(0.09, 0.3, 10).rotateZ(-Math.PI / 2); // spidsen peger mod +x (mod Jorden)
    const pilMat = new THREE.MeshBasicMaterial({ color: lysFarve, transparent: true, opacity: 0.7, depthWrite: false });
    for (const [x, y, z] of pile) {
      const pil = new THREE.Mesh(pilGeo, pilMat);
      pil.position.set(x, y, z);
      solLys.add(pil);
    }
    const lysSkilt = skilt('Lys fra Solen', '#ffd27a', 0.5);
    lysSkilt.position.set(-2.3 * JORD_R, 1.45 * JORD_R, 0);
    solLys.add(lysSkilt);
    solLys.visible = false;
    gruppe.add(solLys);
    const xAkse = new THREE.Vector3(1, 0, 0);

    // ---------- Tilstand ----------
    const idagNr = dagIDag();
    let trin = 0;
    let dag = idagNr;
    let visDag = idagNr; // den dag, Jorden er tegnet ved (glider hen mod dag langs banen)
    let tæt = false;
    let drejer = true;
    let selv = false; // man har selv flyttet skyderen

    const tabel = document.createElement('div');
    tabel.className = 'aarstid-kort';
    toplag().append(tabel);

    function panel() {
      const d = ((Math.round(dag) - 1 + 365) % 365) + 1; // dag kan være et kommatal, mens Jorden kører rundt i første trin
      // Det lille kort øverst i 3D-billedet
      const rækker = STEDER.map((s) => {
        const timer = dagslængde(s.bredde, d);
        const h = middagshøjde(s.bredde, d);
        const dagTekst = timer >= 24 ? 'midnatssol' : timer <= 0 ? 'mørketid' : timerTekst(timer);
        return `<tr><td><span class="farveprik" style="background:${s.farve}"></span>${s.navn}</td><td>${årstid(s, d, true)}</td><td>${dagTekst}</td><td>${h > 0 ? `${Math.round(h)}°` : 'under horisonten'}</td></tr>`;
      }).join('');
      tabel.innerHTML = `<b>${datoTekst(d)}</b> · ${afstand(d).toFixed(1).replace('.', ',')} mio. km fra Solen<table><tr><th></th><th>Årstid</th><th>Dagens længde</th><th>Sol ved middag</th></tr>${rækker}</table>`;

      const linjer = STEDER.map((s) => {
        const timer = dagslængde(s.bredde, d);
        const h = middagshøjde(s.bredde, d);
        const dagTekst = timer >= 24 ? 'Midnatssol: Solen går ikke ned' : timer <= 0 ? 'Mørketid: Solen står ikke op' : `Dagens længde: ${timerTekst(timer)} · Solen ved middag: ${Math.round(h)}° oppe`;
        return `<li data-sted="${s.navn}"><span class="farveprik" style="background:${s.farve}"></span><span><b>${s.navn}</b> (${s.by}) · ${årstid(s, d)}<br><span class="sted-tal">${dagTekst}</span></span></li>`;
      }).join('');
      forklaring(`<p><b>${datoTekst(d)}</b> · Afstand til Solen: ${afstand(d).toFixed(1).replace('.', ',')} mio. km</p><ul class="sted-liste">${linjer}</ul>`);
    }

    // Kameraet: tæt på Jorden (med Solen ved siden af) eller hele banen oppefra
    function stilKamera(flyv = false) {
      baneSkilte.visible = !tæt;
      solLys.visible = tæt;
      if (tæt) {
        const t = TRIN[trin];
        let retning = t.tæt && !selv ? t.retning : null;
        if (!retning) {
          // Fra siden, så Solen er til højre eller venstre, og grænsen mellem dag og nat kan ses
          const p = jordPlads(dag).normalize();
          retning = [-p.z + p.x * 0.15, 0.35, p.x + p.z * 0.15];
        }
        kamera({ retning, radius: JORD_R * 2.5, mål: jordPlads(dag).toArray(), drej: false, flyv });
      } else {
        kamera({ retning: [0.15, 0.9, 1], radius: 17, mål: [0, 0, 0], drej: false, flyv });
      }
    }

    function visTrin() {
      const t = TRIN[trin];
      fase(t.titel, t.tekst, [trin + 1, TRIN.length]);
      if (t.dag) dag = t.dag;
      tæt = t.tæt;
      styring[1].værdi = dag;
      styring[2].til = tæt;
      styring[0].tekst = trin < TRIN.length - 1 ? `Næste: ${TRIN[trin + 1].titel.toLowerCase()} ›` : 'Næste ›';
      opdaterKnapper();
      stilKamera();
      panel();
    }

    function næste() {
      if (trin >= TRIN.length - 1) return;
      trin++;
      selv = false;
      visTrin();
    }

    function nulstil() {
      trin = 0;
      selv = false;
      dag = idagNr;
      visTrin();
    }

    const styring = [
      { tekst: 'Næste ›', handling: næste, deaktiv: () => trin >= TRIN.length - 1 },
      {
        skyder: true, navn: 'Dato', min: 1, max: 365, værdi: dag, vis: datoTekst,
        ændring: (v) => {
          dag = v;
          if (!selv) {
            selv = true;
            fase('Du vælger selv datoen', 'Følg dagens længde i panelet. Jo længere fra ækvator, jo større er forskellen mellem sommer og vinter.');
          }
          if (tæt) stilKamera();
          panel();
        },
      },
      { tekst: 'Tæt på Jorden', til: tæt, skift: (t) => { tæt = t; stilKamera(); } },
      { tekst: 'Jorden drejer', til: drejer, skift: (t) => { drejer = t; } },
      { tekst: '↺ Forfra', handling: nulstil, deaktiv: () => trin === 0 && !selv },
    ];

    nulstil();

    const plads = new THREE.Vector3();
    const hjælp = new THREE.Vector3();
    let panelUge = -1;
    return {
      styring,
      opdater(dt) {
        // I første trin kører Jorden rundt om Solen (et år på ca. 24 sekunder), så man kan se, at aksen peger samme vej hele året.
        // Tabellen og panelet skrives kun om én gang om ugen i animationen (ellers forsvinder ordforklaringerne hele tiden).
        if (trin === 0 && !selv) {
          dag = ((dag - 1 + (dt * 365) / 24) % 365) + 1;
          const uge = Math.floor(dag / 7);
          if (uge !== panelUge) {
            panelUge = uge;
            panel();
            styring[1].sæt?.(Math.round(dag));
          }
        }
        // Jorden glider langs banen hen til datoen (den korteste vej rundt, og hurtigt, så skyderen føles direkte)
        let forskel = dag - visDag;
        if (forskel > 182.5) forskel -= 365;
        if (forskel < -182.5) forskel += 365;
        visDag += Math.abs(forskel) < 0.05 ? forskel : forskel * (1 - Math.exp(-dt * 5));
        visDag = ((visDag - 1 + 365) % 365) + 1;
        jord.position.copy(jordPlads(visDag, plads));
        jordSætDato(visDag); // sne og grønt efter årstiden (når der er billeder)
        if (drejer) omdrejning.rotation.y += (dt * Math.PI * 2) / OMDREJNING;
        // Sollyset peger fra Solen mod Jorden
        if (solLys.visible) {
          solLys.position.copy(jord.position);
          solLys.quaternion.setFromUnitVectors(xAkse, hjælp.copy(jord.position).normalize());
        }
        // Navne på bagsiden af Jorden skjules (lige bag kanten må de gerne stå, for de stikker ud over kloden)
        const k = verden.kamera.position;
        for (const { prik, navn } of navne) {
          prik.getWorldPosition(hjælp);
          const ux = hjælp.x - jord.position.x, uy = hjælp.y - jord.position.y, uz = hjælp.z - jord.position.z;
          const kx = k.x - hjælp.x, ky = k.y - hjælp.y, kz = k.z - hjælp.z;
          navn.visible = (ux * kx + uy * ky + uz * kz) / (Math.hypot(ux, uy, uz) * Math.hypot(kx, ky, kz)) > -0.15;
        }
      },
    };
  },
};
