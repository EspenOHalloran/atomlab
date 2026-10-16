// En hvid dværg eksploderer (type Ia-supernova): Den suger gas fra en nabostjerne, til den nærmer sig ca. 1,4 sole.
// Så tænder carbon i midten, og hele stjernen bliver sprængt i stykker. Lyset bagefter kommer fra henfaldet
// nikkel-56 → cobalt-56 → jern-56 (halveringstider ca. 6,1 og 77 dage).

import * as THREE from 'three';
import { stjerne, glød, prikSky, rullendeGraf, KVALITET } from './faelles.js';

const HVID = new THREE.Vector3(-3, 0, 0); // den hvide dværg
const NABO = new THREE.Vector3(5.2, 0, 0); // nabostjernen
const OPSUGNING = 12; // sekunder (i animationen) fra 1,0 til 1,38 sole
const DAGE_PR_SEKUND = 10; // efter eksplosionen: 1 sekund i animationen = 10 dage
const NI = Math.LN2 / 6.08; // henfaldskonstanter pr. dag (nikkel-56 og cobalt-56)
const CO = Math.LN2 / 77.2;

// Lyset fra henfaldene (energien, der bliver sat af i gassen) og en langsom start, fordi lyset skal sive ud af den tætte gas.
// Efter nogle uger slipper mere og mere gammastråling ud uden at varme gassen (fanget, Jeffery 1999, t0 ca. 38 dage).
// Giver toppen efter ca. 18 dage og ca. 5 % af toppen efter 100 dage, som en rigtig type Ia.
function lysstyrke(dage) {
  const henfald = 6.45 * Math.exp(-dage / 8.8) + 1.45 * Math.exp(-dage / 111.3);
  const fanget = 1 - Math.exp(-((38 / Math.max(dage, 0.1)) ** 2));
  return henfald * fanget * (1 - Math.exp(-((dage / 16) ** 2)));
}
const MAKS_LYS = Math.max(...Array.from({ length: 80 }, (_, d) => lysstyrke(d)));

export default {
  id: 'hviddvaerg',
  navn: 'Hvid dværg',
  ikon: '💫',
  undertitel: 'En hvid dværg i et stjernepar eksploderer',
  citat: 'feynmanVæv',
  kamera: { retning: [0.1, 0.6, 1], radius: 8 },
  tal: [
    ['En hvid dværg kan højst veje', 'ca. 1,4 gange Solen'],
    ['Når den eksploderer, lyser den som', 'flere milliarder sole'],
    ['Tilbage i midten', 'intet'],
    ['Tycho Brahe så en', 'i 1572'],
  ],
  kort: `
    <p>En hvid dværg er resten af en stjerne som Solen (se Solens fremtid). Alene bliver den bare langsomt koldere. Men mange stjerner er i par. Er der en anden stjerne tæt på, kan den hvide dværg suge gas fra den. Gassen samler sig i en hvirvlende skive og falder ned på den hvide dværg, som bliver tungere og tungere.</p>
    <p>En hvid dværg kan højst veje ca. 1,4 gange så meget som Solen. Når den kommer tæt på grænsen, tænder carbon i midten. Fusionen løber løbsk, og på et øjeblik bliver hele den hvide dværg sprængt i stykker. Der bliver intet tilbage i midten.</p>
    <p>Eksplosionen laver især nikkel-56, som henfalder til cobalt-56 og så til jern. Det er de henfald, der får supernovaen til at lyse i månedvis. En stor del af jernet i universet er lavet sådan, også noget af jernet i dit blod.</p>
    <p>Den danske astronom Tycho Brahe så en supernova af denne slags i 1572.</p>`,
  nørd: `
    <p><b>Grænsen på 1,4 sole:</b> En hvid dværg bliver holdt oppe af elektronernes tryk: Elektronerne kan ikke presses ind i samme tilstand. I 1930 regnede den indisk-amerikanske fysiker Subrahmanyan Chandrasekhar ud, at det tryk højst kan bære ca. 1,4 sole. Det er samme slags grænse, der får jernkernen i en kæmpestjerne til at falde sammen (se Supernova). Han fik Nobelprisen i 1983.</p>
    <p><b>Lyset kommer fra henfald:</b> Eksplosionen laver omkring en halv sols masse nikkel-56. Det henfalder til cobalt-56 med en halveringstid på ca. 6 dage, og cobalt-56 henfalder til jern-56 med en halveringstid på ca. 77 dage. Begge gange fanger kernen som regel en af atomets elektroner (elektronindfangning), og energien kommer ud som gammastråling, der varmer gassen op. Se grafen: Lyset falder i takt med henfaldene.</p>
    <p><b>Et standardlys:</b> Supernovaer af denne slags lyser næsten lige stærkt, når de er stærkest, og de små forskelle kan man rette for: De stærkeste falder langsomst bagefter. Derfor kan man regne ud, hvor langt væk de er, ud fra hvor svage de ser ud. I 1998 opdagede to hold forskere på den måde, at universet udvider sig hurtigere og hurtigere. Ingen ved hvorfor, og forskerne kalder det mørk energi. Opdagelsen gav Nobelprisen i 2011.</p>
    <p><b>Tycho Brahes stjerne:</b> I november 1572 så Tycho Brahe en ny, klar stjerne i stjernebilledet Cassiopeia. Den kunne ses med det blotte øje i over et år. Han viste, at den lå langt bag Månen, og at stjernehimlen altså kan forandre sig. I dag ved vi, at det var en hvid dværg, der eksploderede.</p>
    <p><b>Navnet:</b> Astronomerne kalder den en supernova af type Ia (romertallet I og et lille a). Supernovaer fra kæmpestjerner hedder type II (eller Ib og Ic).</p>
    <p><b>To veje:</b> Forskerne er ikke helt enige om, hvordan det oftest sker: at en hvid dværg suger gas fra en nabostjerne (som her), eller at to hvide dværge kredser om hinanden og til sidst støder sammen.</p>
    <p><b>Ærligt talt:</b> Den hvide dværg er tegnet alt for stor: I virkeligheden er den ca. 100 gange mindre end nabostjernen. Det tager millioner af år at samle gassen, men her tager det et øjeblik. Grafen er forenklet: Den viser energien fra henfaldene, som langsomt siver ud af gassen. Efter nogle uger slipper mere og mere af gammastrålingen ud uden at varme gassen, og så falder lyset hurtigt.</p>`,

  lav(gruppe, { effekter, lyd, fase, kamera, opdaterKnapper, forklaring, overlag }) {
    // Hele dobbeltstjernen drejer langsomt rundt
    const system = new THREE.Group();
    gruppe.add(system);
    const nabo = stjerne(2.0, '#ffb070', '#c0401a', new THREE.Color(1.8, 0.6, 0.25), 2.3, { styrke: 1.3 });
    nabo.position.copy(NABO);
    nabo.scale.set(1.12, 1, 1); // trukket lidt ud mod den hvide dværg
    system.add(nabo);
    const hvid = new THREE.Group();
    hvid.position.copy(HVID);
    hvid.add(new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.3, 2.4, 2.8) })));
    const hvidGlød = glød(new THREE.Color(1.2, 1.5, 2.5), 1.3, 0.75);
    hvid.add(hvidGlød);
    system.add(hvid);

    // Skiven om den hvide dværg
    const ND = Math.round(700 * KVALITET);
    const dR = new Float32Array(ND), dV = new Float32Array(ND), dY = new Float32Array(ND);
    const skive = prikSky(ND, 0.16, (i, c) => {
      dR[i] = 0.45 + Math.random() ** 0.7 * 1.3;
      dV[i] = Math.random() * Math.PI * 2;
      dY[i] = (Math.random() - 0.5) * 0.08;
      const varm = 1 - (dR[i] - 0.45) / 1.3; // varmest inderst
      c.setRGB(1.2 + varm * 0.9, 0.6 + varm * 1.2, 0.35 + varm * 1.9);
    });
    skive.visible = false;
    system.add(skive);
    // Gasstrømmen fra nabostjernen over til skiven (en bue)
    const NS = Math.round(260 * KVALITET);
    const sS = Float32Array.from({ length: NS }, () => Math.random());
    const strøm = prikSky(NS, 0.2, (i, c) => c.setRGB(1.6, 0.7, 0.35));
    strøm.visible = false;
    system.add(strøm);
    const bueStart = new THREE.Vector3(3.0, 0, 0), bueKontrol = new THREE.Vector3(0.3, 0, 2.2), bueSlut = new THREE.Vector3(-3, 0, 1.6);

    // Eksplosionen: gas i alle retninger
    const NE = Math.round(1800 * KVALITET);
    const eRetning = Array.from({ length: NE }, () => new THREE.Vector3().randomDirection());
    const eFart = Float32Array.from({ length: NE }, () => 3 + Math.random() * 6);
    const rester = prikSky(NE, 0.4, (i, c) => c.setRGB(2.4, 2.3, 2.0));
    rester.visible = false;
    gruppe.add(rester);
    const lysglimt = glød(new THREE.Color(2.4, 2.2, 1.8), 30, 0);
    gruppe.add(lysglimt);

    const graf = rullendeGraf(overlag(), 'Supernovaens lys (forenklet): højest efter ca. 2½ uge', '#ffd27a');
    graf.nulstil();

    let t = -1; // sekunder siden den begyndte at suge gas (-1 = venter)
    let eksplosion = -1; // sekunder siden eksplosionen (-1 = ikke endnu)
    let fasenr = 0;
    let grafTid = 0;
    let panelTid = 0;
    let sidstVist = '';
    let eStart = new THREE.Vector3();

    function masse() {
      if (t < 0) return 1.0;
      const f = Math.min(1, t / OPSUGNING);
      return 1.0 + 0.38 * (1 - (1 - f) * (1 - f));
    }

    function opdaterPanel(altid = false) {
      let html;
      if (eksplosion < 0) {
        html = `<p><b>Den hvide dværgs masse:</b> ${masse().toFixed(2).replace('.', ',')} sole</p><p><b>Grænsen:</b> ca. 1,4 sole</p>`;
      } else {
        const dage = eksplosion * DAGE_PR_SEKUND;
        const ni = Math.exp(-NI * dage);
        const co = (NI / (CO - NI)) * (Math.exp(-NI * dage) - Math.exp(-CO * dage));
        const fe = Math.max(0, 1 - ni - co);
        const pct = (x) => `${Math.round(x * 100)} %`;
        html = `<p><b>Dage efter eksplosionen:</b> ${Math.round(dage)}</p>
          <ul class="kerne-liste">
            <li><span class="farveprik" style="background:#9be7ff"></span>Nikkel-56: ${pct(ni)}</li>
            <li><span class="farveprik" style="background:#ffb36b"></span>Cobalt-56: ${pct(co)}</li>
            <li><span class="farveprik" style="background:#e6ecf5"></span>Jern-56: ${pct(fe)}</li>
          </ul>`;
      }
      if (altid || html !== sidstVist) {
        sidstVist = html;
        forklaring(html);
      }
    }

    function nulstil() {
      t = -1;
      eksplosion = -1;
      fasenr = 0;
      hvid.visible = true;
      hvid.scale.setScalar(1);
      hvidGlød.scale.setScalar(1.3);
      nabo.position.copy(NABO);
      skive.visible = false;
      strøm.visible = false;
      rester.visible = false;
      lysglimt.material.opacity = 0;
      graf.nulstil();
      graf.tegn();
      fase(null);
      opdaterPanel(true);
      kamera({ radius: 8, flyv: false });
    }

    function start() {
      if (t >= 0) nulstil();
      t = 0;
      skive.visible = true;
      strøm.visible = true;
      fasenr = 1;
      lyd.sus(2);
      fase('Gas strømmer over', 'Den hvide dværg (den lille, hvide) suger gas fra sin nabostjerne. Gassen hvirvler rundt i en skive og falder ned på den hvide dværg, som bliver tungere og tungere.', [1, 4]);
    }

    function eksplodér() {
      eksplosion = 0;
      fasenr = 3;
      // Hvor er den hvide dværg lige nu (systemet drejer)?
      eStart = hvid.getWorldPosition(new THREE.Vector3());
      hvid.visible = false;
      skive.visible = false;
      strøm.visible = false;
      rester.visible = true;
      effekter.glimt(eStart.clone(), 16, new THREE.Color(2.4, 2.4, 2.2), 1.4);
      effekter.bølge(eStart.clone(), 30, new THREE.Color(2.2, 1.9, 1.4), 2.2);
      lyd.eksplosion();
      kamera({ radius: 16, flyv: false });
      fase('Supernova!', 'Fusionen løber løbsk og spreder sig gennem hele stjernen på et sekund. Den hvide dværg bliver sprængt helt i stykker med over 10.000 km i sekundet. Der bliver intet tilbage i midten.', [3, 4]);
    }

    const styring = [
      { tekst: '▶ Lad den suge gas', handling: start, deaktiv: () => t >= 0 && eksplosion < 0 },
      { tekst: '↺ Forfra', handling: nulstil, deaktiv: () => t < 0 },
    ];

    nulstil();
    const hjælp = new THREE.Vector3();

    return {
      styring,
      opdater(dt, tid) {
        system.rotation.y += dt * 0.12;
        // Skiven hvirvler (inderst hurtigst)
        if (skive.visible) {
          const p = skive.geometry.attributes.position.array;
          for (let i = 0; i < ND; i++) {
            dV[i] += dt * 2.2 / dR[i] ** 1.5;
            p[i * 3] = HVID.x + Math.cos(dV[i]) * dR[i];
            p[i * 3 + 1] = dY[i];
            p[i * 3 + 2] = HVID.z + Math.sin(dV[i]) * dR[i];
          }
          skive.geometry.attributes.position.needsUpdate = true;
        }
        // Gassen strømmer ad buen fra nabostjernen til skiven
        if (strøm.visible) {
          const p = strøm.geometry.attributes.position.array;
          for (let i = 0; i < NS; i++) {
            sS[i] = (sS[i] + dt * 0.45) % 1;
            const s = sS[i], a = (1 - s) * (1 - s), b = 2 * (1 - s) * s, c = s * s;
            p[i * 3] = a * bueStart.x + b * bueKontrol.x + c * bueSlut.x;
            p[i * 3 + 1] = (Math.sin(i * 12.9898) * 0.08);
            p[i * 3 + 2] = a * bueStart.z + b * bueKontrol.z + c * bueSlut.z;
          }
          strøm.geometry.attributes.position.needsUpdate = true;
        }

        if (t >= 0 && eksplosion < 0) {
          t += dt;
          // Den hvide dværg gløder mere og mere, jo tungere den bliver
          const m = masse();
          hvidGlød.scale.setScalar(1.3 + (m - 1) * 3.5 + 0.1 * Math.sin(tid * 6));
          if (fasenr === 1 && m > 1.3) {
            fasenr = 2;
            fase('Tæt på 1,4 sole', 'Den hvide dværg nærmer sig grænsen på ca. 1,4 sole. Trykket og varmen i midten stiger, og carbon begynder at smelte sammen. Det kan ikke stoppes.', [2, 4]);
            lyd.opbygning();
          }
          if (t >= OPSUGNING + 1.5) eksplodér();
        }

        if (eksplosion >= 0) {
          eksplosion += dt;
          // Gassen farer ud og bremses lidt; farven går fra hvidglødende til orange og rød
          const s = (1 - Math.exp(-0.35 * eksplosion)) / 0.35;
          const p = rester.geometry.attributes.position.array;
          const f = rester.geometry.attributes.color.array;
          const varm = Math.max(0, 1 - eksplosion / 3);
          for (let i = 0; i < NE; i++) {
            hjælp.copy(eRetning[i]).multiplyScalar(eFart[i] * s).add(eStart);
            p[i * 3] = hjælp.x; p[i * 3 + 1] = hjælp.y; p[i * 3 + 2] = hjælp.z;
            f[i * 3] = 1.6 + 0.8 * varm; f[i * 3 + 1] = 0.7 + 1.6 * varm; f[i * 3 + 2] = 0.45 + 1.5 * varm;
          }
          rester.geometry.attributes.position.needsUpdate = true;
          rester.geometry.attributes.color.needsUpdate = true;
          // Lyset følger henfaldene (glimtet i midten er dæmpet, så det ikke blænder)
          const lys = lysstyrke(eksplosion * DAGE_PR_SEKUND) / MAKS_LYS;
          lysglimt.position.copy(eStart);
          lysglimt.material.opacity = 0.45 * lys;
          lysglimt.scale.setScalar(14 + s * 4);
          rester.material.opacity = 0.35 + 0.65 * lys;
          // Nabostjernen overlever, men får et skub
          nabo.position.x = NABO.x + Math.min(1.2, eksplosion * 0.4);
          if (fasenr === 3 && eksplosion > 3) {
            fasenr = 4;
            fase('Lys fra henfald', 'Nu lyser supernovaen som flere milliarder sole. Lyset kommer fra nikkel-56, der henfalder til cobalt-56 og så til jern-56. Følg henfaldene i panelet og lyset i grafen.', [4, 4]);
          }
          grafTid += dt;
          while (grafTid > 0.12) {
            grafTid -= 0.12;
            graf.tilføj(lysstyrke(eksplosion * DAGE_PR_SEKUND) / MAKS_LYS);
          }
          graf.tegn();
        }
        panelTid += dt;
        if (panelTid > 0.25) { panelTid = 0; opdaterPanel(); }
      },
    };
  },
};
