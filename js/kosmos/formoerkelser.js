// Formørkelser: Sol, Jord og Måne. Hvorfor der ikke er formørkelse hver måned (Månens bane hælder),
// solformørkelse (total og ring) og måneformørkelse (Månen bliver kobberrød). Trin for trin og bagefter "Prøv selv".
// Afstandene er ikke målfaste, men Solens og Månens størrelse på himlen passer i forhold til hinanden:
// Fra Jorden ser Månen lidt større ud end Solen, når den er tættest på (total), og lidt mindre, når den er længst væk (ring).
// Skyggerne regnes ud i js/data/skygge.js og i shaderne i js/kosmos/jorden.js.

import * as THREE from 'three';
import { stjerne, skilt } from './faelles.js';
import { lavJorden, lavMånen } from './jorden.js';
import { dækket, påHimlen } from '../data/skygge.js';
import { dagIÅret, dagIDag, måned, MÅNEDER } from '../data/solbane.js';

const RAD = Math.PI / 180;
const JORD_R = 1;
const MÅNE_R = 0.273; // Månens radius i forhold til Jordens (1.737 km / 6.371 km)
const KM_PR_ENHED = 384400 / 6; // Månens middelafstand (384.400 km) er 6 enheder her (i virkeligheden ca. 60 jordradier)
const SOL_POS = new THREE.Vector3(-30, 0, 0); // Solen ligger mod -x
// Solens radius: Set fra Jordens overflade ser Solen 1,3 % større ud end Månen ved middelafstand, som i virkeligheden
// (0,533° mod ca. 0,527°, når man står under Månen). Så bliver det total, når Månen er tæt på, og en ring, når den er langt væk.
const SOL_R = (MÅNE_R / 5) * 1.0126 * 29;
const HÆLDNING_VIST = 25; // Månens bane hælder ca. 5,1°, men tegnes med 25° (se "Ærligt talt")
const SÆSON_DAG = dagIÅret(2, 24); // i 2026 var der formørkelser omkring 24. februar og 20. august
const FORMØRKELSESÅR = 346.62; // dage, før Solen igen står ved samme knude (så perioderne kommer ca. 173 dage fra hinanden)
const SYNODISK = 29.53; // dage fra nymåne til nymåne

const enheder = (kilometer) => kilometer / KM_PR_ENHED;
const tal = (n) => n.toLocaleString('da-DK');

// Trinene: Månens vinkel fra nymåne (grader), knudelinjens retning (grader), afstand i km og kameraet
const TRIN = [
  {
    titel: 'Sol, Jord og Måne', e: null, Ω: 60, afstand: 384400, skygger: 'begge', kamera: { retning: [0.35, 0.75, 1], radius: 8 },
    tekst: 'Månen kredser om Jorden på ca. en måned. Ved nymåne står den mellem Solen og Jorden, og ved fuldmåne står den på den anden side af Jorden.',
  },
  {
    titel: 'Solformørkelse', e: 0, Ω: 0, afstand: 363300, skygger: 'ingen', kamera: { retning: [-1, 0.3, 0.45], radius: 2.2 },
    tekst: 'Ved nymåne kan Månen stå præcis foran Solen, så dens skygge falder på Jorden. I den lille kerneskygge er Solen helt dækket: en total solformørkelse.',
  },
  {
    titel: 'Ringformørkelse', e: 0, Ω: 0, afstand: 405500, skygger: 'ingen', kamera: { retning: [-1, 0.3, 0.45], radius: 2.2 },
    tekst: 'Når Månen er længst væk, ser den lidt for lille ud til at dække Solen. Så bliver der en ring af Solen tilbage: en ringformørkelse.',
  },
  {
    titel: 'Måneformørkelse', e: 180, Ω: 0, afstand: 384400, skygger: 'jord', kamera: { retning: [0.15, 0.35, 1], radius: 4.2, mål: [3.4, 0, 0] },
    tekst: 'Ved fuldmåne kan Månen gå ind i Jordens skygge. Den bliver mørk kobberrød af lyset fra alle Jordens solopgange og solnedgange.',
  },
  {
    titel: 'Hvorfor ikke hver måned?', e: 0, Ω: 90, afstand: 384400, skygger: 'begge', kamera: { retning: [0, 0.12, 1], radius: 7 },
    tekst: 'Månens bane hælder ca. 5° (her tegnet større). Derfor går Månen som regel lidt over eller under Solen, og dens skygge rammer ved siden af Jorden.',
  },
  {
    titel: 'Prøv selv', e: null, Ω: null, afstand: null, skygger: 'begge', kamera: { retning: [0.35, 0.75, 1], radius: 8 },
    tekst: 'Træk i skyderne. Formørkelser sker kun ved nymåne eller fuldmåne, når Månen samtidig er tæt på Jordens baneplan. Prøv også uden hældning.',
  },
];

// Månens plads: e = vinkel fra nymåne, Ω = knudelinjens retning (hvor banen krydser Jordens baneplan), i = hældning.
// Solen ligger fast mod -x. Månen kredser mod uret set fra nord, ligesom Jorden drejer.
export function månePlads(e, Ω, i, d, v = new THREE.Vector3()) {
  const L = Math.PI - e * RAD; // vinkel i baneplanet (Solen ligger i retningen π)
  const u = L - Ω * RAD;
  const n = [Math.cos(Ω * RAD), Math.sin(Ω * RAD)]; // knudelinjen (x, z)
  const ci = Math.cos(i * RAD), si = Math.sin(i * RAD);
  return v.set(
    d * (Math.cos(u) * n[0] - Math.sin(u) * ci * n[1]),
    d * Math.sin(u) * si,
    d * (Math.cos(u) * n[1] + Math.sin(u) * ci * n[0]),
  );
}

// Månens fase som tekst
function faseNavn(e) {
  const g = ((e % 360) + 360) % 360;
  if (g < 12 || g > 348) return 'nymåne';
  if (Math.abs(g - 180) < 12) return 'fuldmåne';
  if (Math.abs(g - 90) < 12) return 'halvmåne (tiltagende)';
  if (Math.abs(g - 270) < 12) return 'halvmåne (aftagende)';
  return g < 180 ? 'tiltagende' : 'aftagende';
}

// Hvad sker der? Solformørkelse set fra det sted på Jorden, hvor Månens skygge rammer bedst, og måneformørkelse.
// (Bruger faste hjælpevektorer, for den kaldes hvert billede, mens Månen kredser.)
const S = SOL_POS.toArray(), E = [0, 0, 0], M = [0, 0, 0], A = [0, 0, 0];
const u = new THREE.Vector3(), Q = new THREE.Vector3(), P = new THREE.Vector3(), tværs = new THREE.Vector3();
export function formørkelse(måne) {
  måne.toArray(M);
  // Linjen fra Solen gennem Månen: Hvor kommer den tættest på Jorden?
  u.copy(måne).sub(SOL_POS).normalize();
  const t0 = -måne.dot(u);
  Q.copy(måne).addScaledVector(u, t0);
  if (t0 > 0 && Q.length() < JORD_R) P.copy(måne).addScaledVector(u, t0 - Math.sqrt(JORD_R ** 2 - Q.lengthSq()));
  else if (Q.lengthSq() > 0) P.copy(Q).setLength(JORD_R);
  else P.set(-JORD_R, 0, 0);
  const sol = dækket(P.toArray(A), S, SOL_R, M, MÅNE_R);
  const himmel = påHimlen(A, S, SOL_R, M, MÅNE_R);
  let solType = null;
  if (sol > 0.999 && himmel.kugle >= himmel.sol) solType = 'total';
  else if (himmel.foran && himmel.afstand < himmel.sol - himmel.kugle) solType = 'ring';
  else if (sol > 0.003) solType = 'delvis';
  // Måneformørkelse: hvor meget af Solen dækker Jorden, set fra Månens midte og fra dens kant
  // (u peger væk fra Solen gennem Månen, og tværs peger fra skyggens midterlinje ud mod Månen)
  tværs.copy(måne).addScaledVector(u, -måne.dot(u));
  if (tværs.lengthSq() < 1e-9) tværs.set(0, 1, 0);
  tværs.setLength(MÅNE_R);
  const ind = dækket(Q.copy(måne).sub(tværs).toArray(A), S, SOL_R, E, JORD_R);
  const midt = dækket(M, S, SOL_R, E, JORD_R);
  const ud = dækket(Q.copy(måne).add(tværs).toArray(A), S, SOL_R, E, JORD_R);
  let måneType = null;
  if (ud > 0.999) måneType = 'total';
  else if (ind > 0.999) måneType = 'delvis';
  else if (Math.max(ind, midt, ud) > 0.02) måneType = 'halvskygge';
  return { sol, solType, himmel, P, måneType, måneSkygge: midt };
}

export default {
  id: 'formoerkelser',
  navn: 'Formørkelser',
  ikon: '🌘',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Sol- og måneformørkelser, og hvorfor de er sjældne',
  citat: 'saganScene',
  kamera: { retning: [0.35, 0.75, 1], radius: 8 },
  tal: [
    ['Månens bane hælder', 'ca. 5°'],
    ['Solen er bredere end Månen og længere væk', 'begge ca. 400 gange'],
    ['Total solformørkelse varer', 'højst ca. 7½ minut'],
    ['Næste totale måneformørkelse i Danmark', '31. december 2028'],
  ],
  kort: `
    <p>Månen kredser om Jorden på ca. en måned. Den lyser ikke selv: Vi ser den side, Solen lyser på. Ved nymåne står Månen mellem Solen og Jorden, og ved fuldmåne står Jorden mellem Solen og Månen.</p>
    <p>Ved en <b>solformørkelse</b> står Månen præcis foran Solen, og Månens skygge falder på Jorden. Ved en <b>måneformørkelse</b> går Månen ind i Jordens skygge og bliver mørk og kobberrød.</p>
    <p>Det sker ikke hver måned, fordi Månens bane hælder ca. 5° i forhold til Jordens bane om Solen. Som regel går Månen lidt over eller under Solen og Jordens skygge.</p>
    <p><b>Kig aldrig direkte på Solen</b>, heller ikke når den er delvist dækket. Det kan skade øjnene for altid. Brug godkendte solformørkelsesbriller. En måneformørkelse kan man trygt kigge på.</p>
    <p>Tryk "Næste", og se formørkelserne trin for trin. Bagefter kan du selv prøve.</p>`,
  nørd: `
    <p><b>Et heldigt tilfælde:</b> Solen er ca. 400 gange bredere end Månen, men den er også ca. 400 gange længere væk. Derfor ser de næsten lige store ud på himlen, ca. en halv grad.</p>
    <p><b>Total eller ring:</b> Månens afstand svinger mellem ca. 356.000 og 407.000 km. Er Månen tæt på, kan den dække hele Solen, og så kan man se koronaen, Solens tynde, lysende yderste lag. Er Månen langt væk, bliver der en ring tilbage. I gennemsnit er Månen en lille smule for lille til at dække Solen, så ringformørkelser er lidt mere almindelige end totale.</p>
    <p><b>Kerneskygge og halvskygge:</b> I Månens kerneskygge er hele Solen dækket, men kerneskyggen er højst et par hundrede kilometer bred på Jorden. I halvskyggen omkring, som er flere tusind kilometer bred, er Solen kun delvist dækket. En total solformørkelse varer højst ca. 7½ minut et sted.</p>
    <p><b>Hvorfor rød?</b> Jordens luft bøjer lidt sollys ind i skyggen. På vejen gennem luften bliver det blå lys spredt væk (det er derfor, himlen er blå), og det røde kommer bedst igennem. Det er det samme røde lys, man ser ved solopgang og solnedgang.</p>
    <p><b>Hvor tit?</b> Hvert år er der mindst to solformørkelser et sted på Jorden. Men et bestemt sted går der i gennemsnit ca. 375 år mellem totale solformørkelser. Formørkelserne kommer i perioder ca. 173 dage fra hinanden, når Solen står i den retning, hvor Månens bane krydser Jordens baneplan.</p>
    <p><b>2026:</b> Den 12. august var der total solformørkelse fra det nordligste Rusland over Grønland og Island til Spanien og et lille hjørne af Portugal. I Danmark dækkede Månen ca. 80-88 % af Solen, mens den stod lavt om aftenen. Den 28. august var der en delvis måneformørkelse. Den næste totale måneformørkelse, man kan se fra Danmark, er den 31. december 2028. En total solformørkelse i Danmark kommer først i 2142, og kun på det østlige Bornholm.</p>
    <p><b>Månen fjerner sig</b> ca. 3,8 cm om året. Om ca. 600 millioner år er den så langt væk, at den ikke længere kan dække hele Solen. Så er der kun ringformørkelser.</p>
    <p><b>Ærligt talt:</b> Afstandene er ikke målfaste. Her er Månen ca. 6 jordradier væk, men i virkeligheden er den ca. 60 jordradier væk, og Solen er langt længere væk end her. Derfor er Månens bane tegnet med en hældning på 25° i stedet for 5°, så man kan se, at den går over og under. Selv med den store hældning varer formørkelsesperioderne ca. dobbelt så længe her som i virkeligheden, fordi Månen er så tæt på Jorden. Men Solens og Månens størrelse på himlen og Månens skygge passer i forhold til hinanden, og afstandene i panelet er de rigtige. Jordens skygge er derimod ca. 20 % for bred, hvor Månen er, så måneformørkelser sker lidt lettere her.</p>
    <p><b>Billederne af Jorden og Månen</b> er fra NASA. Jorden om dagen er sat sammen af satellitbilleder fra 2004, én måned for hver årstid, så man kan se sneen komme og gå. Byernes lys om natten er fra 2016, og Månen er fotograferet af rumsonden Lunar Reconnaissance Orbiter, som kom i kredsløb om Månen i 2009. Skyerne er de samme hele året. Bjergene og Månens kratere er gjort højere, og luften om Jorden er tegnet ca. 10 gange tykkere end i virkeligheden. Ellers kunne man ikke se dem.</p>`,

  lav(gruppe, { fase, kamera, opdaterKnapper, forklaring, toplag }) {
    // ---------- Solen (langt væk mod -x) og lyset fra den ----------
    const sol = stjerne(SOL_R, '#fff1b8', '#ff8a20', new THREE.Color(2.2, 1.6, 0.7), 3, { styrke: 1.5 });
    sol.position.copy(SOL_POS);
    gruppe.add(sol);
    const stråler = new THREE.Group();
    const strålePunkter = [];
    for (const y of [-1.4, 0, 1.4]) for (const z of [-1.4, 0, 1.4]) strålePunkter.push(new THREE.Vector3(-12, y, z), new THREE.Vector3(-7.6, y, z));
    stråler.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(strålePunkter), new THREE.LineBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.35, depthWrite: false })));
    const lysSkilt = skilt('Lys fra Solen →', '#ffd27a', 0.6);
    lysSkilt.position.set(-8.8, 2.1, 0);
    stråler.add(lysSkilt);
    gruppe.add(stråler);

    // ---------- Jorden og Månen ----------
    const jorden = lavJorden(JORD_R);
    gruppe.add(jorden.klode);
    const månen = lavMånen(MÅNE_R);
    gruppe.add(månen.måne);

    // Jordens baneplan (en svag skive) og Månens bane
    const plan = new THREE.Mesh(new THREE.CircleGeometry(7.6, 64), new THREE.MeshBasicMaterial({ color: 0x4f6fb0, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false }));
    plan.rotation.x = -Math.PI / 2;
    const banePunkter = Array.from({ length: 129 }, () => new THREE.Vector3());
    const bane = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(banePunkter), new THREE.LineBasicMaterial({ color: 0xc8d2ea, transparent: true, opacity: 0.45, depthWrite: false }));
    const planSkilt = skilt('Jordens baneplan', '#8fb0ff', 0.45);
    planSkilt.position.set(4.2, -0.3, 5.6);
    const baneSkilt = skilt('Månens bane', '#dfe6f7', 0.45);
    const nySkilt = skilt('nymåne', '#dfe6f7', 0.4);
    const fuldSkilt = skilt('fuldmåne', '#dfe6f7', 0.4);
    gruppe.add(plan, bane, planSkilt, baneSkilt, nySkilt, fuldSkilt);

    // Tæt på ved en solformørkelse: en ring om kerneskyggen (den er kun en lille plet) og et skilt
    const skyggeFarve = '#ffe08a';
    const skyggeRing = new THREE.Mesh(new THREE.RingGeometry(0.075, 0.1, 40), new THREE.MeshBasicMaterial({ color: skyggeFarve, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
    const skyggeSkilt = skilt('Månens skygge', skyggeFarve, 0.3);
    skyggeSkilt.material.depthTest = false;
    skyggeSkilt.renderOrder = 2;
    gruppe.add(skyggeRing, skyggeSkilt);
    const udad = new THREE.Vector3();

    // Skyggerne: Jordens kerneskygge (et stykke af den) og Månens kerneskygge (en kegle)
    const skyggeMat = new THREE.MeshBasicMaterial({ color: 0x8796bd, transparent: true, opacity: 0.13, side: THREE.DoubleSide, depthWrite: false });
    // Jordens kerneskygge bliver smallere væk fra Solen. Vis de første 9 enheder. (Den flytter sig aldrig.)
    const hæld = (SOL_R - JORD_R) / SOL_POS.length();
    const skyggeLængde = 9;
    const jordSkygge = new THREE.Mesh(new THREE.CylinderGeometry((JORD_R - hæld * skyggeLængde) * 1.01, JORD_R * 1.01, skyggeLængde, 40, 1, true), skyggeMat);
    jordSkygge.rotation.z = -Math.PI / 2; // langs +x, væk fra Solen
    jordSkygge.position.set(skyggeLængde / 2, 0, 0);
    const måneSkygge = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 32, 1, true), skyggeMat);
    gruppe.add(jordSkygge, måneSkygge);
    const opad = new THREE.Vector3(0, 1, 0);
    const væk = new THREE.Vector3();
    function stilSkygger(m) {
      // Månens kerneskygge: en kegle fra Månen væk fra Solen, med spidsen dér, hvor Månen lige præcis dækker Solen
      væk.copy(m).sub(SOL_POS);
      const L = (MÅNE_R * væk.length()) / (SOL_R - MÅNE_R);
      væk.normalize();
      måneSkygge.scale.set(MÅNE_R * 1.02, L, MÅNE_R * 1.02);
      måneSkygge.quaternion.setFromUnitVectors(opad, væk); // keglens spids (toppen) peger væk fra Solen
      måneSkygge.position.copy(m).addScaledVector(væk, L / 2);
    }

    // ---------- Himlen set fra Jorden (øverst til venstre) ----------
    const himmelKort = document.createElement('div');
    himmelKort.className = 'himmel-kort';
    himmelKort.innerHTML = '<canvas width="300" height="300"></canvas><span></span><strong></strong>';
    toplag().append(himmelKort);
    const lærred = himmelKort.querySelector('canvas');
    const himmelTekst = himmelKort.querySelector('span');
    const himmelHvad = himmelKort.querySelector('strong'); // resultatet kort, så man ser det, mens man trækker i skyderne

    // ---------- Tilstand ----------
    let trin = 0;
    let e = 0; // Månens vinkel fra nymåne (grader)
    let Ω = 60; // knudelinjens retning (grader)
    let afstand = 384400; // km
    let dagIÅr = dagIDag(); // i "Prøv selv"
    let uden = false; // "Uden hældning": hvad nu hvis Månens bane ikke hældte?
    let sidst = '';
    let sidstBane = '';
    const m = new THREE.Vector3();

    // Set fra Jorden flytter Solen sig rundt mellem stjernerne på et år. Her står Solen fast, så knudelinjen (og Jordens akse)
    // drejer i stedet med uret set fra nord. Solen står ved samme knude igen efter et formørkelsesår.
    const Ωfor = (dag) => ((((dag - SÆSON_DAG) * 360) / FORMØRKELSESÅR) % 360 + 360) % 360;
    const dagFor = (Ω) => ((SÆSON_DAG + (Ω / 360) * FORMØRKELSESÅR - 1) % 365) + 1; // den dag, knudelinjen står sådan

    function tegnHimmel(f) {
      const g = lærred.getContext('2d');
      const B = lærred.width, H = lærred.height;
      const nær = Math.abs(((e + 180) % 360) - 180) < 90; // tæt på nymåne: kig mod Solen, ellers mod Månen
      g.clearRect(0, 0, B, H);
      if (nær) {
        const k = 52 / f.himmel.sol; // punkter pr. radian (Solens radius er 52 punkter)
        // Retningen til Månen på himlen (vinkelret på retningen til Solen)
        const tilSol = SOL_POS.clone().sub(f.P).normalize();
        const tilMåne = m.clone().sub(f.P).normalize();
        const højre = new THREE.Vector3().crossVectors(tilSol, opad).normalize();
        const op = new THREE.Vector3().crossVectors(højre, tilSol);
        const dx = tilMåne.dot(højre) / Math.max(0.2, tilMåne.dot(tilSol)), dy = tilMåne.dot(op) / Math.max(0.2, tilMåne.dot(tilSol));
        const lys = 1 - f.sol;
        g.fillStyle = `rgb(${Math.round(20 + 70 * lys)}, ${Math.round(40 + 110 * lys)}, ${Math.round(80 + 140 * lys)})`;
        g.fillRect(0, 0, B, H);
        if (f.solType === 'total') {
          // Koronaen: Solens lysende yderste lag, som kun kan ses, når hele Solen er dækket
          const korona = g.createRadialGradient(B / 2, H / 2, 40, B / 2, H / 2, 140);
          korona.addColorStop(0, 'rgba(255,255,255,0.95)');
          korona.addColorStop(0.35, 'rgba(200,220,255,0.45)');
          korona.addColorStop(1, 'rgba(200,220,255,0)');
          g.fillStyle = korona;
          g.fillRect(0, 0, B, H);
        }
        g.fillStyle = '#fff4c8';
        g.beginPath();
        g.arc(B / 2, H / 2, 52, 0, Math.PI * 2);
        g.fill();
        const mx = B / 2 + dx * k, my = H / 2 - dy * k;
        const væk = Math.hypot(mx - B / 2, my - H / 2);
        if (f.himmel.foran && væk < 200) {
          g.fillStyle = '#16181f';
          g.beginPath();
          g.arc(mx, my, f.himmel.kugle * k, 0, Math.PI * 2);
          g.fill();
        } else if (Math.abs(((e + 180) % 360) - 180) < 30 && væk > 0) {
          // Månen går over eller under Solen: Den er uden for billedet, så den vises halvt ude ved kanten med sit navn
          const ux = (mx - B / 2) / væk, uy = (my - H / 2) / væk;
          g.fillStyle = 'rgba(22, 24, 31, 0.92)';
          g.beginPath();
          g.arc(B / 2 + ux * 150, H / 2 + uy * 150, f.himmel.kugle * k, 0, Math.PI * 2);
          g.fill();
          g.font = 'bold 30px system-ui, sans-serif';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.fillStyle = '#e8eeff';
          g.fillText('Månen', B / 2 + ux * 98, H / 2 + uy * 98);
        }
      } else {
        // Månen set fra Jorden om natten: fasen og evt. Jordens skygge
        g.fillStyle = '#0b1024';
        g.fillRect(0, 0, B, H);
        const r = 80;
        // Lidt mørkere i Jordens halvskygge. Kerneskyggen tegnes ovenpå bagefter.
        const mørk = f.måneType === 'halvskygge' ? Math.min(1, f.måneSkygge) : 0;
        const base = `rgb(${Math.round(228 - 110 * mørk)}, ${Math.round(228 - 110 * mørk)}, ${Math.round(218 - 110 * mørk)})`;
        g.fillStyle = '#20232c';
        g.beginPath();
        g.arc(B / 2, H / 2, r, 0, Math.PI * 2);
        g.fill();
        // Fasen: Den oplyste del er en halv cirkel på den lyse side plus en halv ellipse (grænsen mellem lys og mørke).
        // Tiltagende måne er lys til højre (set fra Danmark). e = 180 er fuldmåne.
        const k = (1 - Math.cos(e * RAD)) / 2; // den oplyste del (0-1)
        const lysHøjre = ((e % 360) + 360) % 360 < 180;
        const gennemVenstre = (k > 0.5) === lysHøjre;
        g.fillStyle = base;
        g.beginPath();
        g.arc(B / 2, H / 2, r, -Math.PI / 2, Math.PI / 2, !lysHøjre);
        g.ellipse(B / 2, H / 2, Math.abs(2 * k - 1) * r, r, 0, Math.PI / 2, gennemVenstre ? Math.PI * 1.5 : -Math.PI / 2, !gennemVenstre);
        g.fill();
        // Jordens kerneskygge som en kobberrød cirkel oven på Månen (ved en delvis eller total måneformørkelse).
        // Skyggens midterlinje går fra Solen gennem Jorden (mod +x), og den bliver smallere væk fra Jorden.
        if (f.måneType === 'total' || f.måneType === 'delvis') {
          const s = m.x;
          const ud = new THREE.Vector3(0, m.y, m.z); // Månens afstand fra skyggens midterlinje
          const rSkygge = JORD_R - (s * (SOL_R - JORD_R)) / SOL_POS.length();
          const px = r / MÅNE_R;
          // Set fra Jorden mod Månen, med nord op
          const frem = m.clone().normalize();
          const højreM = new THREE.Vector3().crossVectors(frem, opad).normalize();
          const opM = new THREE.Vector3().crossVectors(højreM, frem);
          g.save();
          g.beginPath();
          g.arc(B / 2, H / 2, r, 0, Math.PI * 2);
          g.clip();
          g.fillStyle = 'rgb(150, 58, 32)';
          g.beginPath();
          g.arc(B / 2 - ud.dot(højreM) * px, H / 2 + ud.dot(opM) * px, rSkygge * px, 0, Math.PI * 2);
          g.fill();
          g.restore();
        }
      }
      himmelTekst.textContent = nær ? 'Solen set fra Jorden' : 'Månen set fra Jorden';
    }

    function opdaterAlt() {
      månePlads(e, Ω, uden ? 0 : HÆLDNING_VIST, enheder(afstand), m);
      månen.måne.position.copy(m);
      månen.vend(jorden.klode.position);
      jorden.sætLys(SOL_POS, SOL_R, m, MÅNE_R);
      månen.sætLys(SOL_POS, SOL_R, jorden.klode.position, JORD_R);
      stilSkygger(m);
      // Månens bane som en linje, og Jordens akse, der peger samme vej i rummet hele året (kun når noget har ændret sig)
      const baneNøgle = `${Ω.toFixed(2)}|${afstand}|${uden}|${trin}|${dagIÅr}`;
      if (baneNøgle !== sidstBane) {
        sidstBane = baneNøgle;
        const p = bane.geometry.attributes.position.array;
        for (let i = 0; i <= 128; i++) månePlads((i / 128) * 360, Ω, uden ? 0 : HÆLDNING_VIST, enheder(afstand), banePunkter[i]).toArray(p, i * 3);
        bane.geometry.attributes.position.needsUpdate = true;
        månePlads(90, Ω, uden ? 0 : HÆLDNING_VIST, enheder(afstand) + 0.9, baneSkilt.position);
        månePlads(0, Ω, uden ? 0 : HÆLDNING_VIST, enheder(afstand) + 0.9, nySkilt.position);
        månePlads(180, Ω, uden ? 0 : HÆLDNING_VIST, enheder(afstand) + 0.9, fuldSkilt.position);
        // Ved vintersolhverv (dag 355) hælder Nordpolen væk fra Solen (mod +x)
        const dag = trin === TRIN.length - 1 ? dagIÅr : dagFor(Ω);
        jorden.klode.rotation.y = (-(dag - 355) / 365.25) * Math.PI * 2;
        jorden.sætDato(dag);
      }
      // Panelet og himlen (kun når noget har ændret sig, højst for hver hele grad, Månen flytter sig)
      const f = formørkelse(m);
      const nøgle = `${e.toFixed(0)}|${Ω.toFixed(1)}|${afstand}|${uden}|${trin}`;
      if (nøgle === sidst) return;
      sidst = nøgle;
      tegnHimmel(f);
      // Tæt på ved en solformørkelse: en ring om kerneskyggen og et skilt
      const visSkygge = TRIN[trin].skygger === 'ingen' && f.solType !== null;
      skyggeRing.visible = visSkygge;
      skyggeSkilt.visible = visSkygge;
      if (visSkygge) {
        udad.copy(f.P).normalize();
        skyggeRing.position.copy(udad).multiplyScalar(JORD_R * 1.004);
        skyggeRing.lookAt(udad.x * 2, udad.y * 2, udad.z * 2);
        skyggeSkilt.position.copy(udad).multiplyScalar(JORD_R * 1.12).add(opad.clone().multiplyScalar(0.26));
      }
      let hvad;
      if (f.solType === 'total') hvad = 'Månen dækker hele Solen: <b>total solformørkelse</b>';
      else if (f.solType === 'ring') hvad = `Månen ser for lille ud til at dække hele Solen (${Math.round(f.sol * 100)} % dækket): <b>ringformørkelse</b>`;
      else if (f.solType === 'delvis') hvad = `Månen dækker ${Math.round(f.sol * 100)} % af Solen: <b>delvis solformørkelse</b>`;
      else if (f.måneType === 'total') hvad = 'Månen er helt inde i Jordens kerneskygge: <b>total måneformørkelse</b>';
      else if (f.måneType === 'delvis') hvad = 'En del af Månen er i Jordens kerneskygge: <b>delvis måneformørkelse</b>';
      else if (f.måneType === 'halvskygge') hvad = 'Månen er i Jordens halvskygge og bliver kun lidt mørkere';
      else if (faseNavn(e) === 'nymåne') hvad = 'Ingen formørkelse: Månen går over eller under Solen';
      else if (faseNavn(e) === 'fuldmåne') hvad = 'Ingen formørkelse: Månen går over eller under Jordens skygge';
      else hvad = 'Ingen formørkelse (det kan kun ske ved nymåne og fuldmåne)';
      forklaring(`<p><b>Månen:</b> ${faseNavn(e)} · ${tal(afstand)} km væk</p><p data-formoerkelse="${f.solType ?? f.måneType ?? 'ingen'}">${hvad}</p>`);
      himmelHvad.textContent = f.solType === 'total' ? 'Total solformørkelse!'
        : f.solType === 'ring' ? 'Ringformørkelse!'
          : f.solType === 'delvis' ? `Delvis solformørkelse (${Math.round(f.sol * 100)} %)`
            : f.måneType === 'total' ? 'Total måneformørkelse!'
              : f.måneType === 'delvis' ? 'Delvis måneformørkelse'
                : f.måneType === 'halvskygge' ? 'Lidt mørkere (halvskygge)'
                  : 'Ingen formørkelse';
    }

    function visTrin() {
      const t = TRIN[trin];
      fase(t.titel, t.tekst, [trin + 1, TRIN.length]);
      if (t.e !== null) e = t.e;
      if (t.Ω !== null) Ω = t.Ω;
      if (t.afstand !== null) afstand = t.afstand;
      if (trin === TRIN.length - 1) {
        // Prøv selv: start ved nymåne i dag
        e = 0;
        afstand = 384400;
        Ω = Ωfor(dagIÅr);
      }
      uden = false;
      const nær = !!t.kamera.mål || t.kamera.radius < 3;
      for (const o of [stråler, plan, planSkilt, baneSkilt, nySkilt, fuldSkilt]) o.visible = !nær; // skiven ville skære en streg hen over Jorden
      lysSkilt.visible = t.kamera.radius >= 8; // kun i oversigten (ellers står det bag panelet)
      // Tæt på viser kuglerne selv skyggen. Keglerne ville dække den.
      jordSkygge.visible = t.skygger !== 'ingen';
      måneSkygge.visible = t.skygger === 'begge';
      kamera({ retning: t.kamera.retning, radius: t.kamera.radius, mål: t.kamera.mål ?? [0, 0, 0], drej: false, flyv: false });
      opdaterStyring();
      opdaterAlt();
    }

    // Er der en formørkelse ved nymåne eller fuldmåne på den dag (med Månens hældning og den valgte afstand)?
    const prøve = new THREE.Vector3();
    function iPeriode(dag) {
      for (const vinkel of [0, 180]) {
        const f = formørkelse(månePlads(vinkel, Ωfor(dag), HÆLDNING_VIST, enheder(afstand), prøve));
        if (f.solType || f.måneType === 'total' || f.måneType === 'delvis') return true;
      }
      return false;
    }

    function opdaterStyring() {
      const prøv = trin === TRIN.length - 1;
      const ekstra = [];
      if (prøv) {
        ekstra.push(
          { skyder: true, navn: 'Månens fase', min: 0, max: 29.5, trin: 0.5, værdi: Math.round(((e / 360) * SYNODISK) * 2) / 2, vis: (v) => `dag ${tal(v)} · ${faseNavn((v / SYNODISK) * 360)}`, ændring: (v) => { e = (v / SYNODISK) * 360; opdaterAlt(); } },
          { skyder: true, navn: 'Tid på året', min: 1, max: 365, trin: 1, værdi: dagIÅr, vis: (v) => MÅNEDER[måned(v)] + (iPeriode(v) ? ' · formørkelsesperiode' : ''), ændring: (v) => { dagIÅr = v; Ω = Ωfor(v); opdaterAlt(); } },
          { skyder: true, navn: 'Månens afstand', min: 356000, max: 407000, trin: 100, værdi: afstand, vis: (v) => `${tal(v)} km`, ændring: (v) => { afstand = v; opdaterAlt(); } },
          { tekst: 'Uden hældning', til: uden, skift: (t) => { uden = t; opdaterAlt(); } },
        );
      }
      // Skyderne findes kun i "Prøv selv" (trinene står i bjælken, trin() nedenfor)
      styring.splice(0, styring.length, ...ekstra);
      opdaterKnapper();
    }

    // Gå til et trin (Næste, ‹ og prikkerne i bjælken)
    function gåTrin(nr) {
      if (nr < 0 || nr >= TRIN.length) return;
      trin = nr;
      visTrin();
    }

    function nulstil() {
      trin = 0;
      visTrin();
    }

    const styring = [];

    nulstil();

    return {
      styring,
      trin: () => ({ nr: trin, ialt: TRIN.length, næste: trin < TRIN.length - 1 ? TRIN[trin + 1].titel.toLowerCase() : '', gå: gåTrin, forfra: nulstil }),
      opdater(dt) {
        // I første trin kredser Månen hele tiden (en måned på ca. 20 sekunder)
        if (trin === 0) {
          e = (e + (dt * 360) / 20) % 360;
          opdaterAlt();
        }
        jorden.omdrejning.rotation.y += dt * 0.4;
      },
    };
  },
};
