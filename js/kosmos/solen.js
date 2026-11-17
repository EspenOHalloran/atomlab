// Solen i Solsystemet (Mars M4b i docs/plan-mars.md): tal og et link til Stjerneovnen.
// "Jorden ved siden af" viser en lille Jord i den rigtige størrelse (Solen er ca. 109 gange bredere).
// Tal fra NSSDC's faktaark for Solen og NASA (docs/fakta-solsystemet.md, del 4).
// Overfladen har sin egen shader (feedback nr. 3, 16. november 2026): den mørke rand, granuler, solpletter og fakler.
// stjerne() i faelles.js bruges stadig af Kosmos, Solstorm og Stjerneovnen og er ikke rørt.

import * as THREE from 'three';
import { glød, skilt, KVALITET } from './faelles.js';
import { lavJorden } from './jorden.js';
import { kontakt, skærm, gå } from '../sideknap.js';
import { LAV_KVALITET } from '../scene3d.js';
import { RAND_U, GRUPPER, ANTAL_PLETTER, drejFart, gruppeNu } from '../data/solen.js';

const SOL_KM = 695700; // Solens radius (NSSDC)
const JORD_KM = 6371; // Jordens radius (NSSDC)
const SOL_R = 5; // Solens radius i animationen
const JORD_R = (SOL_R * JORD_KM) / SOL_KM; // ca. 0,046: 109 gange mindre
const JORD_PLADS = new THREE.Vector3(SOL_R * 1.3, 0, 0); // tæt ved Solen, så begge kan ses (ikke den rigtige afstand)
const DREJ = 0.03; // kuglens drejning i radianer pr. sekund (ækvators fart): én omgang på ca. 209 s er 25 døgn
const GRAD = Math.PI / 180;

// Solens overflade. Navnene er ASCII (shaderregel). Kuglen drejer med ækvators fart, og pletterne regnes i JS hvert
// billede (retning og radius i kuglens egne retninger), så pletter længere fra ækvator halter efter.
const SOL_VERTEX = `
  varying vec3 vRetning;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vRetning = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`;
const SOL_FRAGMENT = `
  uniform float tid;
  uniform vec3 farve;      // midten af skiven (lineært lys, lige over grænsen for gløden)
  uniform vec3 randU;      // den mørke rand: I = 1 - u (1 - mu) for rød, grøn og blå
  uniform float celler;    // granuler pr. radius
  uniform vec4 pletter[ANTAL]; // xyz: pletten midte (enhedsvektor), w: radius i radianer (0 = ingen plet)
  varying vec3 vRetning;
  varying vec3 vNormal;
  varying vec3 vView;

  vec3 hash3(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
  }
  float hash1(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float stoej(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash1(i), hash1(i + vec3(1, 0, 0)), f.x), mix(hash1(i + vec3(0, 1, 0)), hash1(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(hash1(i + vec3(0, 0, 1)), hash1(i + vec3(1, 0, 1)), f.x), mix(hash1(i + vec3(0, 1, 1)), hash1(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
  // Cellestøj: afstanden til det nærmeste og det næstnærmeste punkt og et tal for den nærmeste celle (dens lysstyrke).
  // Punkterne bevæger sig langsomt, så cellerne ændrer sig.
  vec3 celle(vec3 p, float t) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    float d1 = 8.0;
    float d2 = 8.0;
    float id = 0.0;
    for (int z = -1; z <= 1; z++)
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
      vec3 g = vec3(float(x), float(y), float(z));
      vec3 h = hash3(i + g);
      vec3 r = g + 0.5 + 0.38 * sin(t * (0.6 + 0.5 * h) + 6.2831 * h) - f;
      float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; id = h.z; } else if (d < d2) { d2 = d; }
    }
    return vec3(sqrt(vec2(d1, d2)), id);
  }

  void main() {
    vec3 n = normalize(vRetning);
    float mu = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);

    // Granuler: lyse midter (varm gas, der stiger op) og mørke render (kølig gas, der synker)
    // Langt væk bliver cellerne mindre end et par pixel: tonet ud til gennemsnittet, så de ikke flimrer. Under 3 pixel
    // regnes de slet ikke (det sparer det meste af arbejdet, når hele Solen ses).
    vec3 p = n * celler;
    float px = 1.0 / max(length(fwidth(p)), 1e-4);
    float gran = 0.88;
    float render = 0.5;
    if (px > 3.0) {
      vec3 q = p + (stoej(p * 0.6) - 0.5) * 0.9; // bøjer renderne, så cellerne ikke bliver kantede
      vec3 F = celle(q, tid * 0.25);
      render = smoothstep(0.0, 0.45, F.y - F.x);
      float midte = 1.0 - F.x * F.x * 0.6;
      gran = mix(0.88, mix(0.66, 0.88 + 0.16 * F.z, render) * midte, clamp((px - 3.0) / 5.0, 0.0, 1.0));
    }

    // Større, svage lyse og mørke områder
    float m = stoej(n * 3.5 + vec3(0.0, tid * 0.01, 0.0));
  #ifndef LAV
    m = m * 0.55 + stoej(n * 7.3 - vec3(tid * 0.015)) * 0.3 + stoej(n * 15.1) * 0.15;
  #endif
    float plettet = 0.95 + 0.1 * m;

    // Solpletter (mørk kerne, lysere kant med striber) og fakler (lyse pletter omkring dem, mest synlige ved randen)
    float plet = 1.0;
    float inde = 0.0;
    float fakkel = 0.0;
    for (int k = 0; k < ANTAL; k++) {
      vec4 pl = pletter[k];
      if (pl.w <= 0.0) continue;
      vec3 v = n - pl.xyz;
      float d = length(v) / pl.w;
      fakkel = max(fakkel, smoothstep(0.9, 1.4, d) * (1.0 - smoothstep(1.4, 3.8, d)));
      if (d < 1.0) {
        float halv = 0.8;
  #ifndef LAV
        vec3 rundt = normalize(v - dot(v, pl.xyz) * pl.xyz + 1e-5);
        halv += 0.1 * (stoej(rundt * 9.0 + pl.xyz * 13.0) - 0.5);
  #endif
        float l = mix(0.2, halv, smoothstep(0.36, 0.46, d));
        l = mix(l, 1.0, smoothstep(0.86, 1.0, d));
        plet = min(plet, l);
        inde = max(inde, 1.0 - smoothstep(0.86, 1.0, d));
      }
    }
    gran = mix(gran, 0.88, inde);
    vec3 pletFarve = mix(vec3(1.0, 0.72, 0.5), vec3(1.0), plet); // pletterne er køligere og derfor rødere
    float fakler = 1.0 + 0.45 * fakkel * (1.0 - mu) * (0.6 + 0.8 * render);

    // Potensen gør randen kraftigere i tegningen: Efterbehandlingen (ACES-tonemapping, som ganger med 1/0,6 først) og
    // skærmens gamma trykker de lyse farver sammen, så 40 % ellers ser ud som ca. 60-80 % (målt i skærmbilledet)
    vec3 rand = pow(1.0 - randU * (1.0 - mu), vec3(2.3));
    vec3 c = farve * rand * gran * plettet * plet * pletFarve * fakler;
    gl_FragColor = vec4(c, 1.0);
  }`;

// Solens kugle og en svag glorie. Giver gruppen, kuglen og en funktion, der flytter pletterne til tiden t.
function lavSolen() {
  const pletter = Array.from({ length: ANTAL_PLETTER }, () => new THREE.Vector4());
  // Hver plets faste bredde og drejefart, så der intet regnes om hvert billede
  const liste = GRUPPER.flatMap((g, gi) => g.pletter.map(([dl, db, r]) => ({ gi, dl, bredde: g.bredde + db, r, fart: drejFart(g.bredde + db) })));
  const materiale = new THREE.ShaderMaterial({
    name: 'solen',
    defines: { ANTAL: ANTAL_PLETTER, ...(LAV_KVALITET ? { LAV: '' } : {}) },
    uniforms: {
      tid: { value: 0 },
      farve: { value: new THREE.Color(1.3, 0.84, 0.33) },
      randU: { value: new THREE.Vector3(...RAND_U) },
      celler: { value: 72 },
      pletter: { value: pletter },
    },
    vertexShader: SOL_VERTEX,
    fragmentShader: SOL_FRAGMENT,
  });
  const kugle = new THREE.Mesh(new THREE.SphereGeometry(SOL_R, 64 * KVALITET + 32, 48 * KVALITET + 16), materiale);
  const glorie = glød(new THREE.Color(1.4, 0.8, 0.3), SOL_R * 2.5, 0.6);
  const gruppe = new THREE.Group();
  gruppe.add(kugle, glorie);

  const nu = GRUPPER.map(() => null);
  const sætTid = (t) => {
    materiale.uniforms.tid.value = t;
    kugle.rotation.y = t * DREJ;
    const drejet = (t * DREJ) / GRAD; // hvor langt ækvator er drejet (grader)
    GRUPPER.forEach((g, i) => { nu[i] = gruppeNu(g, t); });
    liste.forEach((pl, i) => {
      const g = nu[pl.gi];
      // Pletten halter efter ækvator: længden i kuglens egne retninger
      const længde = (g.længde + pl.dl + drejet * (pl.fart - 1)) * GRAD;
      const bredde = pl.bredde * GRAD;
      // Med kuglens drejning om +y går voksende længde den rigtige vej (mod uret set fra nord)
      pletter[i].set(Math.cos(bredde) * Math.cos(længde), Math.sin(bredde), -Math.cos(bredde) * Math.sin(længde), pl.r * GRAD * g.størrelse);
    });
  };
  sætTid(0);
  const synlige = () => liste.filter((_, i) => pletter[i].w > 0).map((pl) => ({ bredde: pl.bredde, fart: pl.fart }));
  return { gruppe, kugle, materiale, sætTid, synlige };
}

export default {
  id: 'solen',
  navn: 'Solen',
  ikon: '☀️',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Vores stjerne',
  kamera: { retning: [0.15, 0.25, 1], radius: SOL_R, drej: true },
  tal: [
    ['Solens bredde', 'ca. 1,39 mio. km'],
    ['Overfladen', 'ca. 5.500 °C'],
    ['I midten', 'ca. 15 mio. °C'],
    ['Massen', 'ca. 333.000 Jorder'],
  ],
  // Teksten i højre panel (siden i lag, U3 i docs/plan-ux.md). Tallene er fra NSSDC (docs/fakta-solsystemet.md, del 4).
  side: {
    kort: 'Solen er en stjerne: en kæmpe kugle af glødende gas, mest brint (hydrogen) og helium. Den er ca. 4,6 mia. år gammel og er nogenlunde halvvejs gennem sit liv.',
    emner: [
      {
        titel: 'Hvorfor lyser Solen?', hvorfor: ['stjerner'],
        tekst: `<p>Inde i midten er der ca. 15 mio. °C og et kæmpe tryk. Her smelter brintkerner sammen til helium. Det kaldes fusion, og det er det, der får Solen til at lyse. Hvert sekund bliver ca. 4 mio. ton af Solens masse til energi. Du kan prøve det selv i Stjerneovnen.</p>`,
      },
      {
        titel: 'Hvor stor er Solen?', kontakt: 'Jorden ved siden af',
        tekst: `<p>109 Jorder kan ligge på række hen over Solen, og der er plads til ca. 1,3 mio. Jorder inden i den. Slå ${kontakt('Jorden ved siden af')} til, så står Jorden i den rigtige størrelse til højre for Solen. Zoom ind på den lille prik for at se den.</p>`,
      },
      {
        titel: 'Hvorfor bobler overfladen?',
        tekst: '<p>Overfladen er ca. 5.500 °C. Varm gas stiger op, bliver afkølet og synker ned igen, ligesom suppe, der simrer i en gryde. Lyset fra overfladen er lidt over 8 minutter om at nå Jorden.</p>',
      },
      {
        titel: 'Drejer Solen?',
        tekst: '<p>Ja, men den er ikke fast, så ækvator drejer hurtigere (en omgang på ca. 25 døgn) end polerne (ca. 36 døgn). Det kan ses på solpletterne: Pletter tæt på ækvator kommer hurtigst rundt.</p>',
      },
    ],
    videre: [skærm('#fusion', 'Stjerneovnen'), gå('solsystem:solstorm', 'Solstorm'), gå('solsystem:solensfremtid', 'Solens fremtid')],
    nørd: `<p><b>Tallene</b> er fra NASA (NSSDC's faktaark om Solen): Radius 695.700 km, massen ca. 2 · 10³⁰ kg (et 2-tal med 30 nuller, 333.000 gange Jordens), overfladen 5.772 K (ca. 5.500 °C) og midten ca. 15,7 mio. K. Ca. 91 % af atomerne i overfladen er brint og ca. 9 % helium. Regnet efter vægt fylder helium mere, ca. en fjerdedel, for et heliumatom vejer ca. 4 gange så meget som et brintatom.</p>
      <p><b>Masse bliver til energi:</b> Solen sender 3,8 · 10²⁶ watt ud som lys og varme. Med Einsteins E = mc² svarer det til ca. 4,3 mio. ton masse i sekundet. Det lyder af meget, men på 4,6 mia. år er det højst ca. 0,03 % af Solens masse (den unge Sol lyste lidt svagere).</p>
      <p><b>Lyset:</b> Solen er i snit 149,6 mio. km fra Jorden, og lyset kører ca. 300.000 km i sekundet. Det giver 499 sekunder, altså 8 minutter og 19 sekunder.</p>
      <p><b>Solpletterne</b> er mørke, fordi de er køligere: Kernen er ca. 2.000 °C koldere end resten af overfladen. Stærke magnetfelter bremser den varme gas, der ellers stiger op nedefra. Pletterne kommer ca. 5-35° nord og syd for ækvator, i starten af en cyklus langt fra ækvator og til sidst tæt på. De lyse pletter omkring dem nær kanten hedder fakler.</p>
      <p><b>Den mørke rand:</b> Ved kanten ser man skråt ind i Solen og når kun de øverste lag, som er køligere. Derfor er kanten kun ca. 30-40 % så lys som midten og mere orange. I tegningen er randen gjort lidt kraftigere, så den kan ses på skærmen.</p>`,
    ærligt: '<p>Overfladen er tegnet af programmet. I virkeligheden er der ca. 4 millioner "bobler" (granuler) på én gang, hver ca. 1.500 km bred. Her er de tegnet ca. 7-10 gange for brede, og de ændrer sig langt langsommere: En rigtig granule lever kun ca. 10-20 minutter. Solpletterne er pynt og står ikke, hvor de er på Solen i dag. Hvor mange der er, skifter med Solens 11-årige cyklus: Ved minimum kan der gå uger uden en eneste plet, og ved maksimum ses mange grupper på én gang. Solen var ved maksimum omkring 2024-2025, så nu bliver der langsomt færre. Gløden om Solen er pynt. Med "Jorden ved siden af" står Jorden i den rigtige størrelse, men alt for tæt på. I virkeligheden er Jorden ca. 107 gange Solens bredde væk.</p>',
  },

  lav(gruppe, { opdaterKnapper, kamera }) {
    const sol = lavSolen();
    gruppe.add(sol.gruppe);

    // Jorden i den rigtige størrelse ved siden af (vises med knappen)
    const jorden = lavJorden(JORD_R);
    jorden.klode.position.copy(JORD_PLADS);
    jorden.sætLys(new THREE.Vector3(), SOL_R);
    const navn = skilt('Jorden', '#cfe0ff', 0.8);
    navn.position.copy(JORD_PLADS).add(new THREE.Vector3(0, 0.6, 0));
    const med = new THREE.Group();
    med.add(jorden.klode, navn);
    med.visible = false;
    gruppe.add(med);

    const styring = [
      {
        tekst: 'Jorden ved siden af', til: false,
        skift: (til) => {
          med.visible = til;
          kamera(til
            ? { retning: [0.1, 0.12, 1], radius: SOL_R * 1.45, mål: [SOL_R * 0.3, 0, 0], drej: false, flyv: false }
            : { retning: [0.15, 0.25, 1], radius: SOL_R, drej: true, flyv: false });
        },
      },
    ];
    opdaterKnapper();

    let tid = 0;
    return {
      styring,
      opdater(dt) {
        tid += dt;
        sol.sætTid(tid);
        jorden.omdrejning.rotation.y = tid * 0.2;
      },
      // Kun til tests: Solens og Jordens radius i animationen, om Jorden vises, Solens shader og de synlige pletter
      test: {
        radier: () => ({ sol: SOL_R, jorden: JORD_R }), jordenVist: () => med.visible,
        shader: () => sol.materiale.name, pletter: sol.synlige,
      },
    };
  },
};
