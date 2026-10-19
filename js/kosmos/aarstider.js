// Årstiderne: Jorden på sin bane om Solen. Aksen hælder ca. 23,4° og peger samme vej hele året.
// Man går frem trin for trin (jævndøgn og solhverv) og kan bagefter selv vælge datoen med en skyder.
// Panelet viser dagens længde og Solens højde ved middag fire steder. Tallene regnes ud i js/data/solbane.js
// for de rigtige steder (de passer med almanakkerne inden for få minutter, se tests/aarstider.mjs).

import * as THREE from 'three';
import { stjerne, glød, skilt } from './faelles.js';
import { LANDKORT } from '../data/landkort.js';
import { HÆLDNING, dagIÅret, datoTekst, måned, dagslængde, middagshøjde, afstand, solensLængde, timerTekst } from '../data/solbane.js';

const BANE = 12; // Jordens bane i animationen (1 astronomisk enhed)
const JORD_R = 1.8;
const RAD = Math.PI / 180;
const OMDREJNING = 9; // sekunder for én omdrejning af Jorden i animationen

// De fire steder i panelet: navn, by, bredde og længde i grader (nord og øst er positive) og farve
const STEDER = [
  { navn: 'Danmark', by: 'København', bredde: 55.68, længde: 12.57, farve: '#ffd166' },
  { navn: 'Australien', by: 'Sydney', bredde: -33.87, længde: 151.21, farve: '#7ee0ff' },
  { navn: 'Ækvator', by: 'Singapore', bredde: 1.35, længde: 103.82, farve: '#9dff9d' },
  { navn: 'Nordgrønland', by: 'Ilulissat', bredde: 69.22, længde: -51.1, farve: '#ff9de2' },
];

// Årstiden et sted (som DMI regner dem: vinter er december-februar, forår marts-maj osv.)
const NORD = ['vinter', 'vinter', 'forår', 'forår', 'forår', 'sommer', 'sommer', 'sommer', 'efterår', 'efterår', 'efterår', 'vinter'];
const SYD = ['sommer', 'sommer', 'efterår', 'efterår', 'efterår', 'vinter', 'vinter', 'vinter', 'forår', 'forår', 'forår', 'sommer'];
function årstid(sted, n) {
  if (Math.abs(sted.bredde) < 10) return 'ingen sommer og vinter';
  return (sted.bredde > 0 ? NORD : SYD)[måned(n)];
}

// Trinene: dag i året, og om kameraet skal være tæt på Jorden (og fra hvilken retning)
const TRIN = [
  {
    titel: 'Jorden og Solen', dag: null, tæt: false,
    tekst: 'Jorden kredser om Solen på et år og drejer om sig selv én gang i døgnet. Aksen, den drejer om, hælder ca. 23,4°, og den peger hele tiden samme vej ud i rummet, mod Nordstjernen. Det giver årstiderne.',
  },
  {
    titel: 'Forår i nord', dag: dagIÅret(3, 20), tæt: true, retning: [1, 0.35, 0],
    tekst: 'Forårsjævndøgn: Ingen af polerne hælder mod Solen, så Solen står lige over ækvator. Grænsen mellem dag og nat går gennem begge poler, og dag og nat er ca. 12 timer overalt på Jorden.',
  },
  {
    titel: 'Sommer i nord', dag: dagIÅret(6, 21), tæt: true, retning: [0, 0.3, 1],
    tekst: 'Nordpolen hælder mod Solen. I Danmark står Solen højt, og dagen er ca. 17½ time. I Ilulissat i Nordgrønland går Solen slet ikke ned: midnatssol. Samtidig hælder den sydlige halvdel væk fra Solen, så i Australien er det vinter.',
  },
  {
    titel: 'Efterår i nord', dag: dagIÅret(9, 23), tæt: true, retning: [1, 0.35, 0],
    tekst: 'Efterårsjævndøgn: Aksen peger stadig samme vej ud i rummet, men nu er Jorden på den anden side af Solen. Igen hælder ingen af polerne mod Solen, og dag og nat er ca. lige lange overalt.',
  },
  {
    titel: 'Vinter i nord', dag: dagIÅret(12, 21), tæt: true, retning: [0, 0.3, 1],
    tekst: 'Nordpolen hælder væk fra Solen. I Danmark er dagen kun ca. 7 timer, og i Ilulissat i Nordgrønland står Solen slet ikke op: mørketid. I Australien er det sommer. Og Jorden er faktisk tættest på Solen i starten af januar!',
  },
  {
    titel: 'Prøv selv', dag: null, tæt: false,
    tekst: 'Vælg selv datoen med skyderen, og følg dagens længde i panelet. Jo længere fra ækvator, jo større er forskellen mellem sommer og vinter.',
  },
];

// Jordens plads i banen på dag n. Ved sommersolhverv ligger Jorden på -x, så den nordlige halvdel hælder mod Solen (+x).
function jordPlads(n, v = new THREE.Vector3()) {
  const θ = (solensLængde(n) + 90) * RAD;
  const r = BANE * afstand(n) / 149.6;
  return v.set(Math.cos(θ) * r, 0, -Math.sin(θ) * r);
}

// Et punkt på Jordens overflade (samme retninger som kortet på kuglen: længde 0 peger mod +x, 90° øst mod -z)
function overflade(bredde, længde, r) {
  const b = bredde * RAD, l = længde * RAD;
  return new THREE.Vector3(Math.cos(b) * Math.cos(l) * r, Math.sin(b) * r, -Math.cos(b) * Math.sin(l) * r);
}

// Kortet over land og hav som tekstur (hav blåt, land grønt og brunt, is ved polerne)
function lavJordTekstur() {
  const { bredde: B, højde: H, data } = LANDKORT;
  const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const c = document.createElement('canvas');
  c.width = B;
  c.height = H;
  const g = c.getContext('2d');
  const billede = g.createImageData(B, H);
  for (let y = 0; y < H; y++) {
    const breddegrad = 90 - (y + 0.5) * (180 / H);
    for (let x = 0; x < B; x++) {
      const i = y * B + x;
      const land = (bytes[i >> 3] >> (7 - (i & 7))) & 1;
      let farve;
      if (land) farve = Math.abs(breddegrad) > 64 ? [228, 236, 242] : Math.abs(breddegrad) < 35 ? [118, 132, 70] : [70, 126, 62];
      else farve = Math.abs(breddegrad) > 78 ? [210, 225, 238] : [22, 66, 140];
      billede.data.set([...farve, 255], i * 4);
    }
  }
  g.putImageData(billede, 0, 0);
  // Tegnet fire gange større med udglatning, så kysterne ikke bliver kantede
  const stor = document.createElement('canvas');
  stor.width = B * 4;
  stor.height = H * 4;
  const sg = stor.getContext('2d');
  sg.imageSmoothingEnabled = true;
  sg.imageSmoothingQuality = 'high';
  sg.drawImage(c, 0, 0, stor.width, stor.height);
  const t = new THREE.CanvasTexture(stor);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Dag og nat: Siden, der vender mod Solen, er lys. Grænsen mellem dag og nat er lidt blød (tusmørke).
const JORD_VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const JORD_FRAGMENT = `
  uniform sampler2D kort;
  uniform vec3 solRetning;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec3 c = texture2D(kort, vUv).rgb;
    float l = dot(normalize(vNormal), solRetning);
    float dag = smoothstep(-0.06, 0.1, l);
    vec3 lys = c * (0.35 + 0.65 * max(l, 0.0));
    vec3 nat = c * 0.06 + vec3(0.004, 0.008, 0.02);
    gl_FragColor = vec4(mix(nat, lys, dag), 1.0);
  }`;

// En cirkel på Jorden ved en bestemt breddegrad (ækvator og polarcirklerne)
function breddeCirkel(bredde, farve, opacitet) {
  const punkter = [];
  const r = JORD_R * 1.004 * Math.cos(bredde * RAD);
  const y = JORD_R * 1.004 * Math.sin(bredde * RAD);
  for (let i = 0; i <= 96; i++) punkter.push(new THREE.Vector3(Math.cos((i / 96) * Math.PI * 2) * r, y, Math.sin((i / 96) * Math.PI * 2) * r));
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(punkter), new THREE.LineBasicMaterial({ color: farve, transparent: true, opacity: opacitet, depthWrite: false }));
}

export default {
  id: 'aarstider',
  navn: 'Årstiderne',
  ikon: '🌍',
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
    <p><b>Ærligt talt:</b> Solen og Jorden er tegnet alt for store i forhold til banen. Solen er ca. 109 gange bredere end Jorden, og afstanden mellem dem er ca. 11.700 gange Jordens bredde. I virkeligheden går der ca. 365 døgn, mens Jorden kommer én tur rundt om Solen. Tallene i panelet er regnet ud for de rigtige steder med den rigtige hældning, fra solopgang til solnedgang.</p>`,

  lav(gruppe, { fase, kamera, opdaterKnapper, forklaring, toplag }) {
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
    const tættest = skilt('Tættest på Solen: ca. 3. januar', '#ffd9a8', 1.1);
    tættest.position.copy(jordPlads(3)).multiplyScalar(0.62).setY(1.2);
    const længst = skilt('Længst væk: starten af juli', '#ffd9a8', 1.1);
    længst.position.copy(jordPlads(dagIÅret(7, 5))).multiplyScalar(0.62).setY(1.2);
    baneSkilte.add(tættest, længst);
    gruppe.add(baneSkilte);

    // ---------- Jorden: hældning (fast) og omdrejning ----------
    const jord = new THREE.Group(); // flytter rundt i banen
    const hældning = new THREE.Group(); // aksen hælder mod +x og peger samme vej hele året
    hældning.rotation.z = -HÆLDNING * RAD;
    const omdrejning = new THREE.Group(); // drejer én gang om dagen (her hvert 9. sekund)
    jord.add(hældning);
    hældning.add(omdrejning);
    gruppe.add(jord);

    const kort = lavJordTekstur();
    const jordMat = new THREE.ShaderMaterial({
      uniforms: { kort: { value: kort }, solRetning: { value: new THREE.Vector3(1, 0, 0) } },
      vertexShader: JORD_VERTEX,
      fragmentShader: JORD_FRAGMENT,
    });
    omdrejning.add(new THREE.Mesh(new THREE.SphereGeometry(JORD_R, 64, 40), jordMat));
    jord.add(glød(new THREE.Color(0.35, 0.6, 1.2), JORD_R * 2.7, 0.28)); // luften om Jorden

    // Aksen med N for nord, ækvator og polarcirklerne
    const akse = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -JORD_R * 1.5, 0), new THREE.Vector3(0, JORD_R * 1.5, 0)]),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }),
    );
    const nord = skilt('N', '#ffffff', 0.5);
    nord.position.set(0, JORD_R * 1.5 + 0.3, 0);
    hældning.add(akse, nord, breddeCirkel(0, 0xffffff, 0.35), breddeCirkel(66.56, 0x9fd3ff, 0.45), breddeCirkel(-66.56, 0x9fd3ff, 0.45));

    // De fire steder: en lysende prik og et navn, som drejer med Jorden
    for (const s of STEDER) {
      const prik = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(s.farve).multiplyScalar(1.6) }));
      prik.position.copy(overflade(s.bredde, s.længde, JORD_R * 1.01));
      const navn = skilt(s.navn, s.farve, 0.42);
      navn.position.copy(overflade(s.bredde, s.længde, JORD_R * 1.28));
      omdrejning.add(prik, navn);
    }

    // ---------- Tilstand ----------
    const iDag = new Date();
    const idagNr = dagIÅret(iDag.getMonth() + 1, Math.min(iDag.getDate(), iDag.getMonth() === 1 ? 28 : 31)); // 29. februar tæller som 28.
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
      // Det lille kort øverst i 3D-billedet
      const rækker = STEDER.map((s) => {
        const timer = dagslængde(s.bredde, dag);
        const h = middagshøjde(s.bredde, dag);
        const dagTekst = timer >= 24 ? 'midnatssol' : timer <= 0 ? 'mørketid' : timerTekst(timer);
        return `<tr><td><span class="farveprik" style="background:${s.farve}"></span>${s.navn}</td><td>${dagTekst}</td><td>${h > 0 ? `${Math.round(h)}°` : 'under horisonten'}</td></tr>`;
      }).join('');
      tabel.innerHTML = `<b>${datoTekst(dag)}</b> · ${afstand(dag).toFixed(1).replace('.', ',')} mio. km fra Solen<table><tr><th></th><th>Dagens længde</th><th>Sol ved middag</th></tr>${rækker}</table>`;

      const linjer = STEDER.map((s) => {
        const timer = dagslængde(s.bredde, dag);
        const h = middagshøjde(s.bredde, dag);
        const dagTekst = timer >= 24 ? 'Midnatssol: Solen går ikke ned' : timer <= 0 ? 'Mørketid: Solen står ikke op' : `Dagens længde: ${timerTekst(timer)} · Solen ved middag: ${Math.round(h)}° oppe`;
        return `<li data-sted="${s.navn}"><span class="farveprik" style="background:${s.farve}"></span><span><b>${s.navn}</b> (${s.by}) · ${årstid(s, dag)}<br><span class="sted-tal">${dagTekst}</span></span></li>`;
      }).join('');
      forklaring(`<p><b>${datoTekst(dag)}</b> · Afstand til Solen: ${afstand(dag).toFixed(1).replace('.', ',')} mio. km</p><ul class="sted-liste">${linjer}</ul>`);
    }

    // Kameraet: tæt på Jorden (med Solen ved siden af) eller hele banen oppefra
    function stilKamera(flyv = false) {
      baneSkilte.visible = !tæt;
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
    return {
      styring,
      opdater(dt) {
        // Jorden glider langs banen hen til datoen (den korteste vej rundt, og hurtigt, så skyderen føles direkte)
        let forskel = dag - visDag;
        if (forskel > 182.5) forskel -= 365;
        if (forskel < -182.5) forskel += 365;
        visDag += Math.abs(forskel) < 0.05 ? forskel : forskel * (1 - Math.exp(-dt * 5));
        visDag = ((visDag - 1 + 365) % 365) + 1;
        jord.position.copy(jordPlads(visDag, plads));
        if (drejer) omdrejning.rotation.y += (dt * Math.PI * 2) / OMDREJNING;
        jordMat.uniforms.solRetning.value.copy(jord.position).negate().normalize();
      },
    };
  },
};
