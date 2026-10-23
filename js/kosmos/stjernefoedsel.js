// En stjerne bliver født: En sky af gas og støv falder sammen, drejer hurtigere (piruetteffekten) og bliver til en flad skive.
// Midten bliver varmere og varmere, og ved nok varme tænder fusionen. Er skyen for lille, bliver det kun en brun dværg.

import * as THREE from 'three';
import { stjerne, glød, prikSky, ryd, KVALITET } from './faelles.js';

const SKY_R = 9; // skyens radius ved start
const VARIGHED = 15; // sekunder fra start, til stjernen er født (i animationen)

// Massen, der samles i midten (i sole), og hvad der kommer ud af det. temp = omtrentlig temperatur i midten (mio. °C), når den er færdig.
// Kilder: stjernemodeller (fx Baraffe m.fl.). Under ca. 0,08 sol bliver midten aldrig varm nok til almindelig hydrogen-fusion.
const MASSER = [
  { m: 0.03, temp: 1, slags: 'brun' },
  { m: 0.05, temp: 2, slags: 'brun' },
  { m: 0.1, temp: 4, slags: 'rød' },
  { m: 0.3, temp: 7, slags: 'rød' },
  { m: 0.5, temp: 9, slags: 'rød' },
  { m: 1, temp: 15, slags: 'sol' },
  { m: 2, temp: 20, slags: 'stor' },
  { m: 5, temp: 27, slags: 'stor' },
  { m: 10, temp: 31, slags: 'kæmpe' },
  { m: 20, temp: 34, slags: 'kæmpe' },
  { m: 50, temp: 38, slags: 'kæmpe' },
];
// Hvordan resultatet ser ud, og hvad der står om det
const SLAGS = {
  brun: {
    navn: 'En brun dværg', r: 0.45, lys: '#a8442a', mørk: '#3a0d08', glød: new THREE.Color(0.9, 0.25, 0.12), styrke: 0.9,
    tekst: 'Skyen var for lille. Midten nåede højst en til to millioner grader, og det er for lidt til, at almindelig hydrogen kan smelte sammen. Det blev en brun dværg: en "mislykket stjerne", der gløder svagt og langsomt bliver koldere.',
  },
  rød: {
    navn: 'En rød dværg', r: 0.5, lys: '#ff8a4a', mørk: '#b02a0a', glød: new THREE.Color(1.8, 0.55, 0.2), styrke: 1.4,
    tekst: 'Fusionen tænder i en lille, kølig og rødlig stjerne. Røde dværge bruger deres hydrogen meget langsomt. De mindste kan lyse i billioner af år, langt længere end universet har eksisteret. De fleste stjerner i Mælkevejen er røde dværge.',
  },
  sol: {
    navn: 'En stjerne som Solen', r: 0.8, lys: '#fff1b8', mørk: '#ff8a20', glød: new THREE.Color(2.2, 1.6, 0.7), styrke: 1.6,
    tekst: 'Fusionen tænder: Hydrogen smelter sammen til helium i midten, og en gul stjerne som Solen er født. Den kan lyse i ca. 10 milliarder år. Rundt om den kan resten af skiven blive til planeter.',
  },
  stor: {
    navn: 'En stor, hvid stjerne', r: 1.05, lys: '#f2f6ff', mørk: '#9ab4ff', glød: new THREE.Color(1.6, 1.8, 2.4), styrke: 1.8,
    tekst: 'Fusionen tænder i en stor, hvid stjerne. Den er varmere og lyser mange gange stærkere end Solen, men den bruger også sin hydrogen meget hurtigere. Den lever kun fra omkring hundrede millioner til lidt over en milliard år.',
  },
  kæmpe: {
    navn: 'En blå kæmpestjerne', r: 1.45, lys: '#e8f0ff', mørk: '#6f8cff', glød: new THREE.Color(1.3, 1.7, 3.0), styrke: 2,
    tekst: 'Fusionen tænder i en kæmpestjerne. Den lyser tusinder til hundredtusinder af gange stærkere end Solen, men lever kun nogle få til nogle titals millioner år og ender som regel som en supernova. Prøv Supernova i listen.',
  },
};

export default {
  id: 'stjernefoedsel',
  hvorfor: ['stjerner'],
  navn: 'Ny stjerne',
  ikon: '⭐',
  undertitel: 'En stjerne bliver født i en sky af gas',
  citat: 'hawkingStjerner',
  kamera: { retning: [0.25, 0.55, 1], radius: 10 },
  tal: [
    ['Orion-tågen er', 'ca. 1.350 lysår væk'],
    ['Skyen falder sammen på', 'ca. 100.000 år'],
    ['Fusionen tænder ved', 'ca. 10 mio. °C (i en stjerne som Solen)'],
    ['Den mindste stjerne vejer', 'ca. 8 % af Solen'],
  ],
  kort: `
    <p>Stjerner bliver født i kæmpe skyer af gas og støv. Et kendt eksempel er Orion-tågen, som man kan se som en lille tåget plet i Orions sværd, og tydeligere med en kikkert. Skyerne består mest af hydrogen og helium fra Big Bang.</p>
    <p>Et sted i skyen er gassen lidt tættere. Tyngdekraften trækker den sammen, og jo mere den falder sammen, jo hurtigere drejer den, ligesom en skøjteløber, der trækker armene ind. Gassen bliver til en flad, roterende skive med en tæt klump i midten.</p>
    <p>Når gassen falder ind, bliver den varmere. For en stjerne som Solen begynder hydrogen at smelte sammen til helium, når midten når omkring 10 millioner grader. Fusionen tænder, og en stjerne er født. Rundt om den kan resten af skiven blive til planeter. Sådan blev Solen og Jorden til for ca. 4,6 milliarder år siden.</p>
    <p>Prøv at skrue på, hvor meget gas der samles i midten (stjernens masse). Er det for lidt, bliver det kun en brun dværg.</p>`,
  nørd: `
    <p><b>Piruetteffekten:</b> Skyen drejer en lille smule fra start. Når den trækker sig sammen, drejer den hurtigere, fordi drejningen (fysikere siger impulsmomentet) bliver bevaret. Derfor bliver den flad: Langs aksen kan gassen falde frit ind, men ude til siden holder drejningen den ude.</p>
    <p><b>Jetstråler:</b> Unge stjerner skyder ofte to smalle stråler af gas ud fra polerne med hundredvis af kilometer i sekundet. Strålerne fjerner noget af drejningen, så mere gas kan falde ind på stjernen.</p>
    <p><b>Hvor kommer varmen fra?</b> Når gassen falder ind, bliver farten til varme. Den unge stjerne lyser derfor allerede, før fusionen tænder. Det tager nogle titals millioner år, før en stjerne som Solen er helt færdig og brænder hydrogen stabilt (astronomer siger "brænder", men det er fusion, ikke ild).</p>
    <p><b>Små og store stjerner:</b> Små stjerner er tættere i midten og klarer sig med lavere temperatur, ned til ca. 3-4 mio. °C. Under ca. 8 % af Solens masse rækker det ikke, og så bliver det en brun dværg. De største stjerner vejer over 100 gange så meget som Solen. De lyser op til millioner af gange stærkere og lever kun nogle få millioner år. Små røde dværge kan lyse i billioner af år.</p>
    <p><b>Vi er lavet af stjernestof:</b> Skyerne indeholder også lidt støv og tungere grundstoffer fra tidligere stjerner, der døde: Nogle eksploderede, andre blæste deres ydre lag ud. Det var dem, der blev til Jorden, og til dig.</p>
    <p><b>Ærligt talt:</b> Sammenfaldet tager ca. 100.000 år og hele fødslen nogle titals millioner år, men her tager det et kvart minut. En rigtig sky er mange lysår bred, og stjernen i midten er en bitte prik. Temperaturerne i panelet er omtrentlige tal fra modeller af stjerner.</p>`,

  lav(gruppe, { effekter, lyd, fase, kamera, opdaterKnapper, forklaring }) {
    let masseNr = 5; // 1 sol
    let t = -1; // sekunder siden sammenfaldet startede (-1 = skyen venter)
    let tændt = false;
    let fasenr = 0;
    let sidstVist = '';

    // ---------- Skyen ----------
    const N = Math.round(2400 * KVALITET);
    const R0 = new Float32Array(N), Y0 = new Float32Array(N), F = new Float32Array(N); // cylinder-koordinater ved start
    const R1 = new Float32Array(N), Y1 = new Float32Array(N); // hvor partiklen ender
    const rolle = new Uint8Array(N); // 0 = falder ind i stjernen, 1 = ender i skiven, 2 = bliver ude
    const forsink = new Float32Array(N), varig = new Float32Array(N);
    const basis = new Float32Array(N * 3);
    const sky = prikSky(N, 0.32, (i, c) => {
      const valg = Math.random();
      if (valg < 0.45) c.setRGB(0.95, 0.38, 0.62); // lyserød gas (hydrogen lyser rødt)
      else if (valg < 0.8) c.setRGB(0.55, 0.42, 1.05); // violet
      else c.setRGB(1.0, 0.55, 0.3); // støv
      basis.set([c.r, c.g, c.b], i * 3);
    });
    const sPos = sky.geometry.attributes.position.array;
    const sFarve = sky.geometry.attributes.color.array;
    gruppe.add(sky);
    const ROTATION = 0.07; // skyens drejning fra start (radianer i sekundet)

    function lavSky() {
      const v = new THREE.Vector3();
      for (let i = 0; i < N; i++) {
        do v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        while (v.lengthSq() > 1);
        v.multiplyScalar(SKY_R);
        R0[i] = Math.hypot(v.x, v.z);
        Y0[i] = v.y;
        F[i] = Math.atan2(v.z, v.x);
        const r = v.length() / SKY_R;
        const u = Math.random();
        rolle[i] = u < 0.32 ? 0 : u < 0.9 ? 1 : 2;
        if (rolle[i] === 0) { R1[i] = Math.random() * 0.25; Y1[i] = (Math.random() - 0.5) * 0.2; }
        else if (rolle[i] === 1) { R1[i] = 1.2 + Math.pow(R0[i] / SKY_R, 0.7) * 6.2; Y1[i] = Y0[i] * 0.035; }
        else { R1[i] = R0[i] * 1.05; Y1[i] = Y0[i]; }
        // Indefra og ud: midten falder først sammen
        forsink[i] = 0.2 + r * 4.2 + Math.random() * 0.8;
        varig[i] = 5.5 + Math.random() * 3.5;
        sPos[i * 3] = R0[i] * Math.cos(F[i]);
        sPos[i * 3 + 1] = Y0[i];
        sPos[i * 3 + 2] = R0[i] * Math.sin(F[i]);
      }
      sFarve.set(basis);
      sky.geometry.attributes.position.needsUpdate = true;
      sky.geometry.attributes.color.needsUpdate = true;
    }

    // ---------- Protostjernen, strålerne, stjernen og planeterne ----------
    const proto = glød(new THREE.Color(1.6, 0.5, 0.2), 1, 0);
    gruppe.add(proto);
    const stråler = new THREE.Group();
    for (const side of [1, -1]) {
      const kegle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.38, 7, 16, 1, true),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 1.1, 2.2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
      );
      kegle.position.y = side * 3.8;
      kegle.rotation.x = side > 0 ? 0 : Math.PI;
      stråler.add(kegle);
    }
    gruppe.add(stråler);
    const holder = new THREE.Group(); // stjernen og planeterne (laves, når fusionen tænder)
    gruppe.add(holder);
    let planeter = [];

    function masse() { return MASSER[masseNr]; }
    function slags() { return SLAGS[masse().slags]; }
    function masseTekst(m) { return m < 1 ? `${String(m).replace('.', ',')} sol (${Math.round(m * 100)} %)` : `${m} ${m === 1 ? 'sol' : 'sole'}`; }

    function temperatur() {
      if (t < 0) return 0.01;
      const f = Math.max(0, Math.min(1, (t - 2.5) / (VARIGHED - 3)));
      return masse().temp * (0.02 + 0.98 * f * f);
    }

    function nulstil() {
      t = -1;
      tændt = false;
      fasenr = 0;
      ryd(holder);
      planeter = [];
      proto.material.opacity = 0;
      for (const k of stråler.children) k.material.opacity = 0;
      lavSky();
      sky.visible = true;
      fase(null);
      opdaterPanel(true);
      kamera({ radius: 10, flyv: false });
    }

    function start() {
      if (t >= 0) nulstil();
      t = 0;
      lyd.sus(2.5);
      visFase(1);
    }

    function visFase(nr) {
      fasenr = nr;
      if (nr === 1) fase('Skyen falder sammen', 'Tyngdekraften trækker gassen ind mod midten. Skyen drejer en lille smule, og jo mere den falder sammen, jo hurtigere drejer den, ligesom en skøjteløber, der trækker armene ind.', [1, 4]);
      if (nr === 2) fase('En flad skive', 'Drejningen gør skyen flad som en pizza. I midten samler gassen sig i en tæt, varm klump: en protostjerne, altså en stjerne, der er ved at blive født. Den skyder stråler af gas ud fra polerne.', [2, 4]);
      if (nr === 3) fase('Midten bliver varmere og varmere', 'Når gassen falder ind, bliver farten til varme. Følg temperaturen i panelet. I en stjerne som Solen tænder fusionen ved omkring 10 millioner grader.', [3, 4]);
      if (nr === 4) fase(slags().navn, slags().tekst, [4, 4]);
      if (nr === 2) kamera({ radius: 8, retning: [0.2, 0.7, 1], flyv: false });
    }

    function tænd() {
      tændt = true;
      const s = slags();
      const st = stjerne(s.r, s.lys, s.mørk, s.glød, masse().slags === 'brun' ? 2 : 3.2, { styrke: s.styrke });
      holder.add(st);
      if (masse().slags !== 'brun') {
        effekter.glimt(new THREE.Vector3(), 5 + s.r * 4, s.glød.clone().multiplyScalar(1.2), 1);
        lyd.fusion(2);
        // Planeter, der samler sig i skiven
        planeter = [2.4, 3.4, 4.8, 6.3].map((r, i) => {
          const farve = [0xb9a48a, 0x4f8fd8, 0xd9733f, 0xe0c48a][i];
          const p = new THREE.Mesh(new THREE.SphereGeometry(0.12 + i * 0.04, 16, 12), new THREE.MeshStandardMaterial({ color: farve, roughness: 0.7, transparent: true, opacity: 0 }));
          p.userData = { r, vinkel: Math.random() * Math.PI * 2 };
          holder.add(p);
          return p;
        });
      } else lyd.nej();
      visFase(4);
    }

    // Panelet: masse, temperatur i midten og resultatet (skrives kun, når noget har ændret sig)
    function opdaterPanel(altid = false) {
      const T = temperatur();
      const tal = T < 1 ? 'under 1' : String(Math.round(T));
      const s = slags();
      const html = `<p><b>Masse, der samles i midten:</b> ${masseTekst(masse().m)}</p>
        <p><b>Temperatur i midten:</b> ${t < 0 ? 'kold (ca. −260 °C)' : `ca. ${tal} mio. °C`}</p>
        ${tændt ? `<p><b>Resultat:</b> ${s.navn}${masse().slags === 'brun' ? ' (ingen fusion)' : ''}</p>` : ''}`;
      if (altid || html !== sidstVist) {
        sidstVist = html;
        forklaring(html);
      }
    }

    const styring = [
      {
        skyder: true, navn: 'Stjernens masse', min: 0, max: MASSER.length - 1, trin: 1, værdi: masseNr,
        vis: (v) => masseTekst(MASSER[v].m),
        ændring: (v) => { masseNr = v; nulstil(); },
      },
      { tekst: '▶ Lad skyen falde sammen', handling: start, deaktiv: () => t >= 0 && !tændt },
      { tekst: '↺ Ny sky', handling: nulstil, deaktiv: () => t < 0 },
    ];

    nulstil();
    let panelTid = 0;

    return {
      styring,
      opdater(dt, tid) {
        if (t < 0) {
          // Skyen venter og drejer langsomt
          for (let i = 0; i < N; i++) {
            F[i] += ROTATION * dt;
            sPos[i * 3] = R0[i] * Math.cos(F[i]);
            sPos[i * 3 + 2] = R0[i] * Math.sin(F[i]);
          }
          sky.geometry.attributes.position.needsUpdate = true;
          return;
        }
        t += dt;
        if (fasenr === 1 && t > 4.5) visFase(2);
        if (fasenr === 2 && t > 9.5) visFase(3);
        const T = temperatur();
        const varme = Math.min(1, T / 15);
        // Partiklerne: falder ind, drejer hurtigere og hurtigere og bliver til en skive
        for (let i = 0; i < N; i++) {
          const p0 = Math.max(0, Math.min(1, (t - forsink[i]) / varig[i]));
          const p = p0 * p0 * (3 - 2 * p0);
          const R = R0[i] + (R1[i] - R0[i]) * p;
          const py = 1 - (1 - p) * (1 - p); // højden falder hurtigere end afstanden: skyen bliver flad
          const y = Y0[i] + (Y1[i] - Y0[i]) * py;
          const ω = Math.min(3.2, ROTATION * (R0[i] / Math.max(R, 0.05)) ** 2);
          F[i] += ω * dt;
          sPos[i * 3] = R * Math.cos(F[i]);
          sPos[i * 3 + 1] = y;
          sPos[i * 3 + 2] = R * Math.sin(F[i]);
          // Gassen, der falder ind i midten, bliver varm (og forsvinder ind i stjernen, når den tænder)
          if (rolle[i] === 0) {
            const h = p * varme;
            const synlig = tændt ? Math.max(0, 1 - (t - VARIGHED) * 1.5) : 1;
            sFarve[i * 3] = (basis[i * 3] * (1 - h) + 2.2 * h) * synlig;
            sFarve[i * 3 + 1] = (basis[i * 3 + 1] * (1 - h) + 1.5 * h) * synlig;
            sFarve[i * 3 + 2] = (basis[i * 3 + 2] * (1 - h) + 0.8 * h) * synlig;
          }
        }
        sky.geometry.attributes.position.needsUpdate = true;
        sky.geometry.attributes.color.needsUpdate = true;

        // Protostjernen gløder mere og mere (rød → gul), og strålerne skydes ud
        const fProto = Math.max(0, Math.min(1, (t - 2) / 8));
        proto.scale.setScalar(0.6 + fProto * 3.2);
        proto.material.color.setRGB(1.2 + varme, 0.35 + varme * 1.3, 0.15 + varme * 0.6);
        proto.material.opacity = tændt ? Math.max(0, proto.material.opacity - dt) : fProto * 0.9;
        const jet = Math.max(0, Math.min(1, (t - 5) / 2)) * (tændt ? Math.max(0, 1 - (t - VARIGHED) / 3) : 1);
        for (const k of stråler.children) k.material.opacity = 0.16 * jet * (0.85 + 0.15 * Math.sin(tid * 9));
        stråler.rotation.y += dt * 0.5;

        if (!tændt && t >= VARIGHED) tænd();
        // Planeterne samler sig i skiven og kredser om stjernen
        const fPlanet = Math.max(0, Math.min(1, (t - VARIGHED - 1.5) / 2.5));
        for (const pl of planeter) {
          pl.userData.vinkel += dt * 1.4 / pl.userData.r ** 1.5;
          pl.position.set(Math.cos(pl.userData.vinkel) * pl.userData.r, 0, Math.sin(pl.userData.vinkel) * pl.userData.r);
          pl.material.opacity = fPlanet;
        }
        panelTid += dt;
        if (panelTid > 0.25) { panelTid = 0; opdaterPanel(); }
      },
    };
  },
};
