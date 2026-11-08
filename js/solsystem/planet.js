// En gasplanet (Saturn og Jupiter): en fladtrykt kugle med skybånd, lys og (valgfrit) skygge fra ringene.
// Har vi et kort (billede), bruges det. Ellers tegnes båndene af shaderen.
//
// Valgfrit (Jupiter, J2): vindene, en hvirvel (Den Store Røde Plet), fine skyer tæt på og pile, der viser vindene.
// - vind: { tekstur, skala, fase }. tekstur har én række med vindens fart for hver række i kortet (uv pr. sekund
//   gange 1/skala, så tallene passer til en HalfFloat). Kortet glider i to faser, som vand i spil: Hver fase
//   forskyder kortet med vinden i fase sekunder og starter så forfra, og de to faser tones over i hinanden (den ene er
//   altid halvvejs, når den anden starter). Så glider skyerne med den rigtige fart uden at blive trukket ud i striber,
//   men de toner langsomt ud og kommer igen, hvor de stod på kortet.
// - hvirvel: { u, v, au, av, ind, ud }: en ellipse (midten og halvakserne i kortets koordinater), der drejer som en
//   hel skive (mod uret set ovenfra, vinklen sættes med sætHvirvel). Den toner over i vindene fra ind til ud (målt i
//   halvakser), og vindene dæmpes tæt på den, så de ikke trækker pletten med sig.
// - detaljer: fine skyer, der tegnes oven på kortet, når én pixel i kortet fylder mere end ca. 2 pixel på skærmen.
// - pile: højst så mange rækker af pile, der viser vindene (sættes med sætPile).
// - måner (Jupiter, J3): højst så mange måner, der kaster en skygge på planeten (sættes med sætMåner). Skyggen har en
//   kerneskygge og en halvskygge efter Solens vinkel og afstanden fra månen.
// - cykloner (Jupiter, J5): [{ retning, øst, a, spin }] i kuglens egne retninger (før den trykkes sammen): midten
//   (enhedsvektor), en retning mod øst, radius (som en korde på enhedskuglen) og hvor hurtigt den drejer (radianer pr.
//   sekund, positiv er mod uret set udefra). Skyerne i hver cyklon tegnes som spiraler, der drejer, oven på kortet.
// - kantFarve (Uranus og Neptun, UN1): farven på kanten i modlys (standard en varm, gullig farve som Saturn og Jupiter).
// - kapper (Uranus, UN2): { fra, til, vNord, vSyd }. Kortet har en lys kappe over polerne. Den toner ud mod farven ved
//   rækkerne vNord og vSyd (samme halvkugle), når kappen er slukket (sætKapper(nord, syd), 0 til 1). fra og til er
//   sinus til den parametriske bredde, hvor kappen begynder og er fuld.
// - Neptuns vejr (UN3), alt valgfrit:
//   højeSkyer: { bånd, højde, fine }: højst så mange bånd af høje, hvide skyer (metan-is), der kaster skygge på skylaget
//   under dem. Hvert bånd (sætSkyer) har midten og den halve bredde i kortets v, en forskydning i u (båndet flytter
//   sig med vinden ved sin bredde som én stiv blok, så skyerne ikke trækkes ud) og hvor meget af båndet der er skyer
//   (0 til 1). højde: skyernes højde over skylaget i planetradier (skyggens længde er højde gange tan til Solens
//   vinkel). fine: tynde striber inde i skyerne (kun pc).
//   pletter: højst så mange pletter (sætPletter): mørke ovaler (Den Store Mørke Plet), lyse skyer ved kanten og i
//   midten og lyse skyer uden mørk plet (Scooter). sætPletStyrke toner dem ind og ud (kontakten "Neptun i 1989").
//   voyager: kontakten "Voyagers farver (1989)": kortets farve gjort blåere og med mere kontrast, som Voyagers billeder
//   blev behandlet (sætVoyager(styrke, gain, midt, kontrast)).

import * as THREE from 'three';
import { RING_GLSL } from './ringe.js';

// skala: km pr. scene-enhed. radius og polRadius i km. ringTekstur: fra ringe.js (til ringenes skygge). Uden
// ringTekstur kastes ingen ringskygge (Jupiters ringe er for tynde til en skygge, man kan se).
export function lavGasplanet({ skala, radius, polRadius, ringTekstur = null, ringInd = 0, ringUd = 0, kort = null, segmenter = 128, vind = null, hvirvel = null, detaljer = false, pile = 0, måner = 0, cykloner = null, kantFarve = [1.0, 0.85, 0.6], kapper = null, højeSkyer = null, pletter = 0, voyager = false }) {
  const R = radius / skala;
  const flad = polRadius / radius;
  const medRing = Boolean(ringTekstur);
  const defines = {};
  if (medRing) defines.RING_SKYGGE = '';
  if (vind) defines.VIND = '';
  if (vind && hvirvel) defines.HVIRVEL = '';
  if (vind && detaljer) defines.DETALJER = '';
  if (pile) defines.PILE = pile;
  if (måner) defines.MAANER = måner;
  if (cykloner?.length) defines.CYKLONER = cykloner.length;
  if (kapper) defines.KAPPER = '';
  if (højeSkyer) defines.HOEJE_SKYER = højeSkyer.bånd;
  if (højeSkyer?.fine) defines.FINE_SKYER = '';
  if (pletter) defines.PLETTER = pletter;
  if (højeSkyer || pletter) defines.NEPTUN_VEJR = '';
  if (voyager) defines.VOYAGER = '';
  const mat = new THREE.ShaderMaterial({
    defines,
    uniforms: {
      tVind: { value: vind?.tekstur ?? null },
      uVindSkala: { value: vind?.skala ?? 1 },
      uFase: { value: vind?.fase ?? 40 },
      uPlet: { value: new THREE.Vector4(hvirvel?.u ?? 0, hvirvel?.v ?? 0, hvirvel?.au ?? 1, hvirvel?.av ?? 1) },
      uPletKant: { value: new THREE.Vector2(hvirvel?.ind ?? 1, hvirvel?.ud ?? 1.3) },
      uPletVinkel: { value: 0 },
      uKortHoejde: { value: 1024 },
      uPile: { value: 0 },
      uPileR: { value: Array.from({ length: Math.max(1, pile) }, () => new THREE.Vector4()) },
      uMaane: { value: Array.from({ length: Math.max(1, måner) }, () => new THREE.Vector4()) },
      uSolVinkel: { value: 0.00089 },
      uCyk: { value: (cykloner ?? [null]).map((c) => (c ? new THREE.Vector4(c.retning.x, c.retning.y, c.retning.z, c.a) : new THREE.Vector4())) },
      uCykOest: { value: (cykloner ?? [null]).map((c) => (c ? new THREE.Vector4(c.øst.x, c.øst.y, c.øst.z, c.spin) : new THREE.Vector4())) },
      tKort: { value: kort },
      uHarKort: { value: kort ? 1 : 0 },
      tRing: { value: ringTekstur },
      uRingInd: { value: ringInd / skala },
      uRingUd: { value: ringUd / skala },
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uAkse: { value: new THREE.Vector3(0, 1, 0) },
      uMidt: { value: new THREE.Vector3() },
      uTid: { value: 0 },
      uEks: { value: 1 },
      uKant: { value: new THREE.Vector3(...kantFarve) },
      uKappe: { value: new THREE.Vector2(1, 1) },
      uSky: { value: Array.from({ length: Math.max(1, højeSkyer?.bånd ?? 0) }, () => new THREE.Vector4()) },
      uSkyHoejde: { value: højeSkyer?.højde ?? 0.002 },
      uSolLokal: { value: new THREE.Vector3(1, 0, 0) },
      uPletter: { value: Array.from({ length: Math.max(1, pletter) }, () => new THREE.Vector4(0, 0, 1, 1)) },
      uPletterB: { value: Array.from({ length: Math.max(1, pletter) }, () => new THREE.Vector4()) },
      uPletStyrke: { value: 0 },
      uVoy: { value: 0 },
      uVoyGain: { value: new THREE.Vector3(1, 1, 1) },
      uVoyMidt: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
      uVoyKontrast: { value: 1 },
      uKappeOmr: { value: new THREE.Vector4(kapper?.fra ?? 0.6, kapper?.til ?? 0.85, kapper?.vNord ?? 0.6, kapper?.vSyd ?? 0.4) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vVerden;
      varying vec2 vUv;
      varying vec3 vLokal;
      void main() {
        vUv = uv;
        vLokal = normalize(position); // retningen på kuglen, før den trykkes sammen (drejer med planeten)
        vNormal = normalize(transpose(inverse(mat3(modelMatrix))) * normal); // rigtig normal på en fladtrykt kugle
        vec4 v = modelMatrix * vec4(position, 1.0);
        vVerden = v.xyz;
        gl_Position = projectionMatrix * viewMatrix * v;
      }`,
    fragmentShader: /* glsl */ `
      #ifdef RING_SKYGGE
      ${RING_GLSL}
      #endif
      uniform sampler2D tKort;
      uniform float uHarKort, uTid, uEks;
      uniform vec3 uSol, uAkse, uMidt, uKant;
      #ifdef KAPPER
      uniform vec2 uKappe;
      uniform vec4 uKappeOmr;
      #endif
      varying vec3 vNormal;
      varying vec3 vVerden;
      varying vec2 vUv;
      varying vec3 vLokal;
      float hash(float n) { return fract(sin(n) * 43758.5453); }
      float stoej(float x) { float i = floor(x); float f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(hash(i), hash(i + 1.0), f); }
      float hash2(vec2 p) { p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
      float stoej2(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + 1.0), f.x), f.y);
      }
      #ifdef VIND
      uniform sampler2D tVind;
      uniform float uVindSkala, uFase;
      uniform vec4 uPlet;
      uniform vec2 uPletKant;
      uniform float uPletVinkel;
      #ifdef DETALJER
      uniform float uKortHoejde;
      // Fine skyer: støj i grader på overfladen, trukket ud mod øst og vest som båndene (3 lag, 0,12° til 0,03°)
      float fine(vec2 uv) {
        float b = (uv.y - 0.5) * 3.14159;
        vec2 p = vec2(uv.x * 360.0 * cos(b) * 0.4, uv.y * 180.0) * 8.0;
        return 0.5 * stoej2(p) + 0.3 * stoej2(p * 2.03 + 17.0) + 0.2 * stoej2(p * 4.11 + 41.0);
      }
      #endif
      // Kortet, der glider med vindene (to faser) og drejer i pletten. fin: de fine skyer på samme sted (0 til 1).
      vec3 stroem(vec2 uv, out float fin) {
        float f = fract(uTid / uFase);
        float wA = 1.0 - abs(2.0 * f - 1.0);
        float tA = f * uFase;
        float tB = fract(f + 0.5) * uFase;
        float fart = texture2D(tVind, vec2(uv.y, 0.5)).r * uVindSkala; // uv pr. sekund mod øst
        float m = 0.0;
        vec2 kilde = uv;
        #ifdef HVIRVEL
        vec2 d = uv - uPlet.xy;
        d.x -= floor(d.x + 0.5);
        vec2 q = d / uPlet.zw;
        float r = length(q);
        fart *= smoothstep(uPletKant.y, uPletKant.y * 1.8, r); // vindene dæmpes tæt på pletten
        m = 1.0 - smoothstep(uPletKant.x, uPletKant.y, r);
        float c = cos(uPletVinkel), s = sin(uPletVinkel);
        kilde = uPlet.xy + vec2(c * q.x + s * q.y, -s * q.x + c * q.y) * uPlet.zw; // drejet tilbage
        // Kun ved pletten (opslaget med kortets egne skridt, så det virker inde i en if)
        vec3 hv = vec3(0.0);
        vec2 gx = dFdx(uv), gy = dFdy(uv);
        if (m > 0.0) hv = textureGrad(tKort, kilde, gx, gy).rgb;
        #endif
        vec2 uvA = vec2(uv.x - fart * tA, uv.y);
        vec2 uvB = vec2(uv.x - fart * tB, uv.y);
        vec3 z = texture2D(tKort, uvA).rgb * wA + texture2D(tKort, uvB).rgb * (1.0 - wA);
        fin = 0.5;
        #ifdef DETALJER
        fin = fine(uvA) * wA + fine(uvB) * (1.0 - wA);
        #ifdef HVIRVEL
        if (m > 0.0) fin = mix(fin, fine(kilde), m);
        #endif
        #endif
        #ifdef HVIRVEL
        z = mix(z, hv, m);
        #endif
        return z;
      }
      #endif
      #ifdef MAANER
      uniform vec4 uMaane[MAANER]; // midten (verden) og radius for hver måne (radius 0: ingen)
      uniform float uSolVinkel; // Solens vinkelradius (radianer)
      // Månernes skygger: Hvor tæt går linjen mod Solen forbi hver måne? Kerneskyggen er radius minus Solens vinkel gange
      // afstanden, halvskyggen radius plus.
      float maaneSkygge(vec3 p, vec3 sol) {
        float s = 1.0;
        for (int i = 0; i < MAANER; i++) {
          vec4 m = uMaane[i];
          if (m.w <= 0.0) continue;
          vec3 d = m.xyz - p;
          float t = dot(d, sol);
          if (t <= 0.0) continue;
          float q = length(d - t * sol);
          float b = t * uSolVinkel;
          float kerne = m.w - b, halv = m.w + b;
          if (q >= halv) continue;
          // Andelen af Solen, der er dækket: fuldt inde i kerneskyggen, ellers glider den ud mod halvskyggens kant
          s *= mix(0.04, 1.0, smoothstep(kerne, halv, q));
        }
        return s;
      }
      #endif
      #ifdef CYKLONER
      uniform vec4 uCyk[CYKLONER]; // midten (enhedsvektor) og radius
      uniform vec4 uCykOest[CYKLONER]; // retningen mod øst og drejningen (radianer pr. sekund, + er mod uret set udefra)
      // Skyerne i cyklonerne: spiralarme, der drejer, og lidt uro imellem. Giver en faktor på lysstyrken (omkring 1).
      float cykloner(vec3 p) {
        float ud = 1.0;
        for (int i = 0; i < CYKLONER; i++) {
          vec3 c = uCyk[i].xyz;
          float a = uCyk[i].w;
          float d = dot(p, c);
          if (d < 0.9) continue;
          vec3 q = p - c * d;
          vec3 e = uCykOest[i].xyz;
          vec3 n = cross(c, e);
          vec2 xy = vec2(dot(q, e), dot(q, n)) / a;
          float r = length(xy);
          if (r > 1.6) continue;
          float th = atan(xy.y, xy.x) - uCykOest[i].w * uTid;
          float fortegn = sign(uCykOest[i].w); // spiralerne vrides med drejningen
          float seed = float(i) * 7.31;
          // Spiralarme (logaritmisk spiral) brudt op af støj, så de ligner skybånd
          float arm = th * (3.0 + mod(float(i), 2.0)) - fortegn * 4.5 * log(r + 0.04) + seed;
          float s = 0.5 + 0.5 * sin(arm + 1.6 * stoej2(xy * 3.0 + seed));
          s = mix(s, stoej2(xy * 9.0 + seed), 0.3);
          float kappe = 1.0 - smoothstep(0.55, 1.05, r); // skyerne i cyklonen
          float kant = smoothstep(0.8, 1.05, r) * (1.0 - smoothstep(1.05, 1.5, r)); // en mørkere kant om den
          float oeje = 1.0 - smoothstep(0.0, 0.12, r); // midten
          ud *= 1.0 + kappe * (s - 0.4) * 1.1 - kant * 0.22 + oeje * 0.15;
        }
        return ud;
      }
      #endif
      #ifdef PILE
      uniform float uPile;
      uniform vec4 uPileR[PILE]; // for hver række: bredden (v), farten (uv pr. sekund), længden (grader) og antal pile
      // Pile, der viser vindene: én række ved hver jetstrøm, længden efter farten. Giver farven og hvor meget den dækker.
      vec4 pile(vec2 uv) {
        float px = fwidth(uv.y) * 180.0; // én pixel på skærmen i grader
        float cb = cos((uv.y - 0.5) * 3.14159);
        vec4 ud = vec4(0.0);
        for (int i = 0; i < PILE; i++) {
          vec4 p = uPileR[i];
          if (p.w < 0.5) continue;
          float dy = (uv.y - p.x) * 180.0;
          if (abs(dy) > 1.5) continue;
          float celle = 360.0 * cb / p.w; // grader langs breddekredsen mellem to pile
          float a = fract((uv.x - p.y * uTid) * p.w) * celle;
          float L = p.z;
          if (p.y < 0.0) a = L - a; // pile mod vest peger den anden vej
          float hoved = min(2.5, L * 0.5);
          float skaft = max(abs(dy) - 0.22, max(-a, a - (L - hoved)));
          float spids = max(abs(dy) - 0.75 * (L - a) / hoved, max(L - hoved - a, a - L));
          float sd = min(skaft, spids);
          float daek = 1.0 - smoothstep(-px, px, sd);
          vec3 farve = p.y >= 0.0 ? vec3(1.0, 0.86, 0.45) : vec3(0.55, 0.85, 1.0);
          ud = max(ud, vec4(farve, daek));
        }
        return ud;
      }
      #endif
      #ifdef NEPTUN_VEJR
      // Støj, der går hele vejen rundt (per celler i u), så der ikke er en søm ved længde 0°
      float hashP(vec2 i, float per) { i.x = mod(i.x, per); return hash2(i + 0.5); }
      float stoejP(vec2 p, float per) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hashP(i, per), hashP(i + vec2(1.0, 0.0), per), f.x), mix(hashP(i + vec2(0.0, 1.0), per), hashP(i + 1.0, per), f.x), f.y);
      }
      #endif
      #ifdef HOEJE_SKYER
      uniform vec4 uSky[HOEJE_SKYER]; // midten (v), den halve bredde (v), forskydningen (u) og dækningen (0 til 1)
      uniform float uSkyHoejde;
      uniform vec3 uSolLokal; // Solens retning i kuglens egne retninger
      float gFin = 0.0; // tæt på: tynde striber i skyerne (sat i main efter, hvor stor en pixel er)
      // Skyerne i båndene: aflange skyer langs breddekredsen (ca. 9° lange celler, 7 gange så lange som brede). Tæt på
      // består de af tynde striber, ca. 50-150 km brede (som på Voyagers foto PIA00058).
      float skyBaand(vec2 uv) {
        float c = 0.0;
        for (int i = 0; i < HOEJE_SKYER; i++) {
          vec4 b = uSky[i];
          if (b.w <= 0.0) continue;
          float dy = (uv.y - b.x) / b.y;
          if (abs(dy) >= 1.0) continue;
          float x = fract(uv.x - b.z);
          vec2 p = vec2(x * 40.0, dy * 2.5 + float(i) * 7.3);
          float n = 0.65 * stoejP(p, 40.0) + 0.35 * stoejP(p * vec2(2.0, 2.7) + vec2(0.0, 3.1), 80.0);
          n *= 1.0 - smoothstep(0.45, 1.0, abs(dy));
          float e = smoothstep(1.0 - b.w, 1.12 - b.w, n);
          #ifdef FINE_SKYER
          if (gFin > 0.0 && e > 0.0) {
            // Striber: 160 celler rundt (ca. 2,3° lange) og 40 på tværs af båndet (ca. 0,15° brede)
            float st = stoejP(vec2(x * 160.0, dy * 20.0 + float(i) * 3.3), 160.0);
            e *= mix(1.0, mix(0.25, 1.0, smoothstep(0.42, 0.62, st)), gFin);
          }
          #endif
          c = max(c, e);
        }
        return c;
      }
      #endif
      #ifdef PLETTER
      uniform vec4 uPletter[PLETTER]; // midten (u, v) og halvakserne (u, v)
      uniform vec4 uPletterB[PLETTER]; // mørk (0 til 1), lys midte (0 til 1), lys sky ved den sydlige kant (0 til 1), vinkel
      uniform float uPletStyrke;
      vec2 pletQ(vec2 uv, int i) { vec2 d = uv - uPletter[i].xy; d.x -= floor(d.x + 0.5); return d / uPletter[i].zw; }
      // Hvor mørke pletterne gør skylaget (0 til 1). Kanten bølger som en spiral, der drejer med pletten.
      float pletMoerke(vec2 uv) {
        float m = 0.0;
        for (int i = 0; i < PLETTER; i++) {
          vec4 b = uPletterB[i];
          if (b.x <= 0.0) continue;
          vec2 q = pletQ(uv, i);
          float r = length(q);
          if (r > 1.6) continue;
          float th = atan(q.y, q.x) - b.w;
          float kant = 1.0 + 0.1 * sin(2.0 * th + 3.0 * r) + 0.06 * (stoej2(vec2(th * 2.0, r * 3.0) + float(i)) - 0.5);
          m = max(m, b.x * (1.0 - smoothstep(0.55 * kant, kant, r)));
        }
        return m * uPletStyrke;
      }
      // De lyse skyer ved pletterne: lyse fjer langs kanten, en lys sky ved den sydlige kant og en lys midte
      float pletSkyer(vec2 uv) {
        float c = 0.0;
        for (int i = 0; i < PLETTER; i++) {
          vec4 b = uPletterB[i];
          vec2 q = pletQ(uv, i);
          float r = length(q);
          if (r > 1.8) continue;
          float th = atan(q.y, q.x) - b.w;
          float fjer = b.x * 0.8 * smoothstep(0.62, 0.85, stoej2(vec2(th * 2.5 + r * 2.0, r * 5.0) + float(i) * 5.0)) * (1.0 - smoothstep(0.12, 0.3, abs(r - 1.05)));
          vec2 s = (q - vec2(0.25, -1.0)) / vec2(0.5, 0.18); // ca. 1.000 km fra nord til syd ved Den Store Mørke Plet
          float syd = b.z * (1.0 - smoothstep(0.5, 1.0, length(s) + 0.25 * (stoej2(q * 6.0 + float(i)) - 0.5)));
          float midt = b.y * (1.0 - smoothstep(0.25, 0.6, r + 0.3 * (stoej2(q * 5.0 - float(i)) - 0.5)));
          c = max(c, max(fjer, max(syd, midt)));
        }
        return c * uPletStyrke;
      }
      #endif
      #ifdef NEPTUN_VEJR
      // Alle de høje, hvide skyer på ét sted i kortet (0 til 1)
      float hoejeSkyer(vec2 uv) {
        float c = 0.0;
        #ifdef HOEJE_SKYER
        c = skyBaand(uv);
        #ifdef PLETTER
        c *= 1.0 - pletMoerke(uv); // inde i de mørke pletter er der ingen skyer
        #endif
        #endif
        #ifdef PLETTER
        c = max(c, pletSkyer(uv));
        #endif
        return c;
      }
      #endif
      #ifdef VOYAGER
      uniform float uVoy, uVoyKontrast;
      uniform vec3 uVoyGain, uVoyMidt;
      #endif
      // Skybånd uden billede: lyse zoner og mørkere bælter, der følger breddegraden
      vec3 baand(vec2 uv) {
        float b = uv.y * 2.0 - 1.0; // -1 (sydpol) til 1 (nordpol)
        float x = uv.x * 6.2832;
        float w = b * 9.0 + 0.08 * sin(x * 3.0 + b * 20.0) + 0.05 * sin(x * 7.0 - uTid * 0.02);
        float s = 0.55 * stoej(w * 2.3) + 0.3 * stoej(w * 5.1 + 7.0) + 0.15 * stoej(w * 11.0 + 3.0);
        vec3 lys = vec3(0.93, 0.84, 0.64);
        vec3 moerk = vec3(0.74, 0.61, 0.42);
        vec3 f = mix(moerk, lys, s);
        f = mix(f, vec3(0.62, 0.64, 0.66), smoothstep(0.78, 0.95, abs(b))); // gråblå ved polerne
        return f;
      }
      void main() {
        vec3 N = normalize(vNormal);
        vec3 farve;
        #ifdef VIND
        float fin;
        farve = uHarKort > 0.5 ? stroem(vUv, fin) : baand(vUv);
        #ifdef DETALJER
        // Tæt på: fine skyer, når én pixel i kortet fylder mere end ca. 2 pixel på skærmen
        float taet = smoothstep(1.5, 4.0, 1.0 / max(fwidth(vUv.y) * uKortHoejde, 1e-6));
        farve *= 1.0 + taet * 0.22 * (fin - 0.5);
        #endif
        #else
        farve = uHarKort > 0.5 ? texture2D(tKort, vUv).rgb : baand(vUv);
        #endif
        #ifdef CYKLONER
        // Ved polerne (fra ca. 76°): Junos cykloner og lidt uro i skyerne imellem dem
        // Kortet er uskarpt ved polerne og samler sig i striber mod polen, så her bruges en udglattet farve (et lille
        // niveau i kortet) med uro i skyerne
        float pol = smoothstep(0.955, 0.985, abs(vLokal.y));
        if (pol > 0.0) {
          if (uHarKort > 0.5) farve = mix(farve, textureLod(tKort, vec2(0.5, vUv.y), 7.0).rgb, smoothstep(0.97, 0.99, abs(vLokal.y)));
          vec2 pp = vLokal.xz * 40.0;
          float uro = 0.8 + 0.4 * (0.5 * stoej2(pp) + 0.3 * stoej2(pp * 2.7 + 5.0) + 0.2 * stoej2(pp * 7.3 + 11.0));
          farve *= mix(1.0, cykloner(vLokal) * uro, pol);
        }
        #endif
        #ifdef PLETTER
        // De mørke pletter er huller i det øverste skylag: dybere blå
        float pm = pletMoerke(vUv);
        farve = mix(farve, farve * vec3(0.5, 0.64, 0.9), pm);
        #endif
        #ifdef NEPTUN_VEJR
        // De høje skyer: hvide (over det meste af metanen) og med skygge på skylaget, der ligger ca. 50 km under dem. Skyggen
        // falder væk fra Solen, så punktet ligger i skygge, hvis der står en sky mellem det og Solen i skyernes højde.
        #ifdef FINE_SKYER
        gFin = 1.0 - smoothstep(0.5, 1.5, fwidth(vUv.y) * 2500.0);
        #endif
        float sky = hoejeSkyer(vUv);
        float skyggeSky = 0.0;
        #ifdef HOEJE_SKYER
        float cosS = dot(vLokal, uSolLokal);
        if (cosS > 0.02) {
          vec3 t = (uSolLokal - vLokal * cosS) / cosS; // mod Solen langs overfladen, længden er tan til Solens vinkel
          float tl = length(t);
          if (tl > 20.0) t *= 20.0 / tl;
          vec3 qs = normalize(vLokal + t * uSkyHoejde);
          vec2 uvS = vec2(fract(atan(qs.z, -qs.x) / 6.28318), 0.5 + asin(clamp(qs.y, -1.0, 1.0)) / 3.14159);
          skyggeSky = hoejeSkyer(uvS) * (1.0 - sky);
        }
        #endif
        // Skyggen er blålig: lys, der spredes i luften over skylaget, falder ind i den (Voyager, PIA00058)
        farve *= mix(vec3(1.0), vec3(0.5, 0.64, 0.9), skyggeSky * 0.8);
        farve = mix(farve, vec3(0.93, 0.96, 1.0), sky * 0.9);
        #endif
        #ifdef VOYAGER
        // Voyagers farver: blåere og med mere kontrast omkring kortets middelfarve
        farve = mix(farve, max(uVoyGain * (uVoyMidt + (farve - uVoyMidt) * uVoyKontrast), 0.0), uVoy);
        #endif
        #ifdef KAPPER
        // Kappen over polerne: slukket toner den ud mod farven længere fra polen på samme halvkugle (et lille niveau i
        // kortet, så båndene ikke ses)
        float kN = smoothstep(uKappeOmr.x, uKappeOmr.y, vLokal.y) * (1.0 - uKappe.x);
        float kS = smoothstep(uKappeOmr.x, uKappeOmr.y, -vLokal.y) * (1.0 - uKappe.y);
        if (kN + kS > 0.0 && uHarKort > 0.5) {
          vec3 uden = textureLod(tKort, vec2(vUv.x, kN > 0.0 ? uKappeOmr.z : uKappeOmr.w), 6.0).rgb;
          farve = mix(farve, uden, kN + kS);
        }
        #endif
        float lys = max(dot(N, uSol), 0.0);
        // Blød overgang ved grænsen mellem dag og nat (lyset spredes i de øverste skyer)
        lys = smoothstep(-0.05, 0.35, dot(N, uSol)) * (0.35 + 0.65 * lys);
        float skygge = 1.0;
        #ifdef RING_SKYGGE
        // Ringenes skygge: hvor rammer strålen mod Solen ringenes plan?
        vec3 d = vVerden - uMidt;
        float sn = dot(uSol, uAkse);
        float t = -dot(d, uAkse) / sn;
        if (t > 0.0 && abs(sn) > 0.001) {
          vec3 q = d + t * uSol;
          vec4 ring = ringData(length(q));
          skygge = exp(-ring.a / abs(sn));
        }
        #endif
        #ifdef MAANER
        lys *= maaneSkygge(vVerden, uSol);
        #endif
        // Lidt mørkere mod kanten (randformørkelse)
        vec3 V = normalize(cameraPosition - vVerden);
        float rand = 0.75 + 0.25 * max(dot(N, V), 0.0);
        // I modlys lyser atmosfæren som en tynd ring i kanten (lyset spredes fremad i de øverste lag)
        float kant = pow(1.0 - max(dot(N, V), 0.0), 6.0) * pow(max(dot(-V, uSol), 0.0), 3.0);
        vec3 ud = farve * lys * mix(0.12, 1.0, skygge) * rand * 0.98 * uEks + uKant * kant * 0.9;
        #ifdef PILE
        if (uPile > 0.0) {
          vec4 p = pile(vUv);
          float dag = smoothstep(-0.25, 0.2, dot(N, uSol)); // pilene toner ud på natsiden
          ud = mix(ud, p.rgb * (0.5 + 0.5 * dag), p.a * uPile * 0.9 * dag);
        }
        #endif
        gl_FragColor = vec4(ud, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(R, segmenter, segmenter / 2), mat);
  mesh.scale.y = flad;
  const akse = new THREE.Vector3();
  const midt = new THREE.Vector3();
  const hjælpS = new THREE.Vector3();
  const hjælpQ = new THREE.Quaternion();
  return {
    mesh,
    radius: R,
    flad,
    sætKort(t) {
      mat.uniforms.tKort.value = t;
      mat.uniforms.uHarKort.value = t ? 1 : 0;
      if (t?.image?.height) mat.uniforms.uKortHoejde.value = t.image.height;
    },
    // Pletten er drejet vinkel (radianer, mod uret set ovenfra)
    sætHvirvel(vinkel) { mat.uniforms.uPletVinkel.value = vinkel; },
    // Pilene: rækker [{ v, fart (uv pr. sekund), længde (grader), antal }] og hvor tydelige de er (0 til 1)
    sætPile(rækker, styrke) {
      if (rækker) mat.uniforms.uPileR.value.forEach((p, i) => { const r = rækker[i]; p.set(r?.v ?? 0, r?.fart ?? 0, r?.længde ?? 0, r?.antal ?? 0); });
      mat.uniforms.uPile.value = styrke;
    },
    // Månernes skygger: [{ midt (verden), r (verden) }], højst måner
    // Billedet gjort lysere (fx ved polerne, hvor Solen står lavt): 1 er det normale
    sætEksponering(e) { mat.uniforms.uEks.value = e; },
    // Kappen over hver pol: 1 er som på kortet, 0 er slukket (kapper)
    sætKapper(nord, syd) { mat.uniforms.uKappe.value.set(nord, syd); },
    // Neptuns vejr (UN3): båndene [{ v, halv, u, dækning }], pletterne [{ u, v, au, av, mørk, midt, syd, vinkel }]
    sætSkyer(bånd) {
      mat.uniforms.uSky.value.forEach((x, i) => { const b = bånd[i]; if (b) x.set(b.v, b.halv, b.u, b.dækning); else x.set(0, 1, 0, 0); });
    },
    sætPletter(liste) {
      mat.uniforms.uPletter.value.forEach((x, i) => { const p = liste[i]; if (p) x.set(p.u, p.v, p.au, p.av); else x.set(0, 0, 1, 1); });
      mat.uniforms.uPletterB.value.forEach((x, i) => { const p = liste[i]; if (p) x.set(p.mørk, p.midt, p.syd, p.vinkel); else x.set(0, 0, 0, 0); });
    },
    sætPletStyrke(s) { mat.uniforms.uPletStyrke.value = s; },
    sætVoyager(styrke, gain, midt, kontrast) {
      mat.uniforms.uVoy.value = styrke;
      if (gain) mat.uniforms.uVoyGain.value.set(...gain);
      if (midt) mat.uniforms.uVoyMidt.value.set(...midt);
      if (kontrast) mat.uniforms.uVoyKontrast.value = kontrast;
    },
    // Cyklonerne drejer med planetens ur (uTid)
    cykloner: cykloner ?? [],
    sætMåner(liste) {
      mat.uniforms.uMaane.value.forEach((v, i) => { const m = liste[i]; if (m) v.set(m.midt.x, m.midt.y, m.midt.z, m.r); else v.set(0, 0, 0, 0); });
    },
    // Kaldes hvert billede med Solens retning (verden)
    sæt(solRetning, tid) {
      mesh.updateWorldMatrix(true, false);
      mesh.getWorldPosition(midt);
      // Ringenes skygge regnes i verdens enheder (Saturn i baggrunden er skaleret)
      const s = mesh.getWorldScale(hjælpS).x;
      mat.uniforms.uRingInd.value = (ringInd / skala) * s;
      mat.uniforms.uRingUd.value = (ringUd / skala) * s;
      akse.set(0, 1, 0).transformDirection(mesh.parent ? mesh.parent.matrixWorld : mesh.matrixWorld);
      mat.uniforms.uSol.value.copy(solRetning);
      mat.uniforms.uAkse.value.copy(akse);
      mat.uniforms.uMidt.value.copy(midt);
      mat.uniforms.uTid.value = tid;
      if (højeSkyer) mat.uniforms.uSolLokal.value.copy(solRetning).applyQuaternion(mesh.getWorldQuaternion(hjælpQ).invert());
      return { midt, akse };
    },
  };
}
