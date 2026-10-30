// Stå på Mars (M8 i docs/plan-mars.md): et landskab omkring et sted, hvor kameraet står i øjenhøjde og kan dreje
// hovedet. Det er sin egen lille verden (ikke et net på Mars-kloden): Nulpunktet ligger lige under kameraet, og der
// regnes i meter, så jorden ikke ryster helt tæt på (tal med 32 bit er for unøjagtige ved Mars' radius).
//
// Nettet ligger i ringe om stedet: tæt ved fødderne og grovere længere væk, så hvert stykke fylder omtrent lige meget
// på skærmen. Højderne læses i vertex-shaderen fra fire lag (billeder/solsystem/lav_landskab.py): lag 0 (2 × 2 km,
// 1 m mellem højderne), lag 1 (8 × 8 km, 4 m), lag 2 (64 × 64 km, 16 m) og lag 3 (stedets kort fra M5b, ca. 356 km,
// ca. 0,17 km). Hvert lag glider over i det næste ved kanten. Mars' krumning trækkes fra (1,7 m ved 3,4 km).
// Fotoene fra kredsløb er grå. Farven kommer fra Viking-kortet langt væk (stedets kort) og en farvetone, der følger
// lysstyrken (mørkt sand er gråligt, lyst støv og lys sten mere rødbrunt).
//
// Lyset: Solen efter klokken på stedet, Mars' himmel (gulbrun om dagen, blålig omkring Solen og en blå glød efter
// solnedgang), skygger fra bjerge og bakker (et skyggekort pr. lag, regnet på grafikkortet, når Solen har flyttet sig)
// og dis: Det fjerne landskab blandes med himlens farve efter, hvor meget støvet luft der er imellem (skalahøjden).
// Phobos og Deimos står på himlen i den rigtige størrelse og bevæger sig rigtigt (Phobos står op i vest), men
// pladsen i dag er ikke slået op.
//
// 1 enhed = 1 km i verden (stjernehimlen ligger 700-1.300 enheder væk, bag himlen og landskabet).

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG } from '../scene3d.js';

const R = 3396190; // m: den kugle, USGS' kort er lavet til
export const ØJE = 1.7; // m over jorden (en voksen; rovernes kameraer sidder ca. 2 m oppe)
const TAU = 0.4; // støvets optiske dybde lodret ved kraterbunden. Ved Gale ca. 0,4 i den klare tid (Ls ca. 135°, som ved
// Naukluft i april 2016), ca. 0,7-0,8 det meste af året og over 1,25 i støvsæsonen (Chen-Chen m.fl. 2019, Navcam)
const TAU_HØJDE = -4500; // m: den højde, TAU gælder for
const SKALAHØJDE = 11000; // m (NSSDC)
const SOL_RADIUS = THREE.MathUtils.degToRad(0.35 / 2); // Solen er ca. 0,35° bred set fra Mars
// Månerne (km fra Mars' midte og middelradius i km, som MÅNER i js/kosmos/mars.js). periode: timer mellem to gange,
// månen står højest set fra jorden (Phobos ca. 11,1 t mod øst, Deimos ca. 131 t mod vest). fase: timevinkel kl. 0.
const MÅNER = [
  { id: 'phobos', afstand: 9376, radius: 11.08, periode: -11.11, fase: 0.62 * Math.PI },
  { id: 'deimos', afstand: 23460, radius: 6.2, periode: 131, fase: -0.4 * Math.PI },
];
const MAKS = 150000; // m: så langt ud går nettet

// ---------- GLSL: lagene ----------
const LAG_GLSL = /* glsl */ `
  uniform sampler2D tH0, tH1, tH2, tH3;   // højder (16 bit i rød og grøn)
  uniform vec4 bH0, bH1, bH2, bH3;         // øst og nord for hjørnet mod sydvest (m) og 1 / bredde og 1 / højde
  uniform vec2 rH0, rH1, rH2, rH3;         // laveste og højeste højde (m)
  uniform vec4 pxH;                        // m pr. pixel i hvert lag
  vec2 lagUV(vec4 b, vec2 en) { return (en - b.xy) * b.zw; }
  float kantV(vec2 uv) {                   // 1 inde i laget, glider til 0 ved kanten
    vec2 k = min(uv, 1.0 - uv);
    return smoothstep(0.0, 0.05, min(k.x, k.y));
  }
  float lagH(sampler2D t, vec2 uv, vec2 r, float lod) {
    vec2 v = textureLod(t, uv, lod).rg;
    return r.x + (v.x * 65280.0 + v.y * 255.0) / 65535.0 * (r.y - r.x);
  }
  // Højden (m) i punktet en (øst, nord i m). s: hvor langt der er mellem de punkter, der skal bruge højden (m), så
  // der læses et passende groft niveau (ellers tilfældige toppe). Kun de lag, der skal bruges, læses.
  float hoejde(vec2 en, float s) {
    vec2 u0 = lagUV(bH0, en), u1 = lagUV(bH1, en), u2 = lagUV(bH2, en), u3 = lagUV(bH3, en);
    float w0 = kantV(u0), w1 = kantV(u1), w2 = kantV(u2);
    if (w0 >= 0.999) return lagH(tH0, u0, rH0, max(0.0, log2(s / pxH.x)));
    float h;
    if (w1 >= 0.999) h = lagH(tH1, u1, rH1, max(0.0, log2(s / pxH.y)));
    else {
      if (w2 >= 0.999) h = lagH(tH2, u2, rH2, max(0.0, log2(s / pxH.z)));
      else {
        h = lagH(tH3, u3, rH3, max(0.0, log2(s / pxH.w)));
        if (w2 > 0.0) h = mix(h, lagH(tH2, u2, rH2, max(0.0, log2(s / pxH.z))), w2);
      }
      if (w1 > 0.0) h = mix(h, lagH(tH1, u1, rH1, max(0.0, log2(s / pxH.y))), w1);
    }
    if (w0 > 0.0) h = mix(h, lagH(tH0, u0, rH0, max(0.0, log2(s / pxH.x))), w0);
    return h;
  }`;

// ---------- Himlen (fælles for himlen, disen i landskabet og månerne) ----------
const HIMMEL_GLSL = /* glsl */ `
  uniform vec3 uSol;       // retningen mod Solen (verden: x øst, y op, z syd)
  uniform float uTau;      // støvets optiske dybde lodret
  // Himlens lys i retningen v (lineære farver). Gulbrun af støvet om dagen, lysest mod horisonten, blålig omkring
  // Solen (støvet sender blåt lys fremad), og efter solnedgang en blå glød, hvor Solen gik ned.
  vec3 himmel(vec3 v) {
    float hs = uSol.y;
    float mu = dot(v, uSol);
    float vy = max(v.y, 0.0);
    float m = 1.0 / (vy + 0.08);                       // hvor meget luft man kigger igennem
    float dag = smoothstep(-0.12, 0.25, hs);          // dagslys
    float tus = smoothstep(-0.3, 0.0, hs) * (1.0 - smoothstep(-0.02, 0.18, hs)); // tusmørke
    // Støvets gulbrune lys: mest mod horisonten, mindre ved Solen lavt
    vec3 brun = vec3(0.62, 0.40, 0.24) * (1.0 - exp(-uTau * m * 0.55)) * (0.35 + 0.65 * smoothstep(-0.05, 0.5, hs));
    brun = mix(brun, vec3(0.42, 0.24, 0.13) * (1.0 - exp(-uTau * m * 0.55)), 1.0 - smoothstep(0.0, 0.3, hs));
    // Fremad: blåligt lys omkring Solen (Henyey-Greenstein, g = 0,8), svækket af luften
    float g = 0.8;
    float hg = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * mu, 1.5);
    vec3 blaa = vec3(0.30, 0.42, 0.62) * hg * 0.035 * exp(-uTau * 0.6 / (max(hs, 0.0) + 0.1));
    vec3 c = (brun + blaa) * dag;
    // Efter solnedgang: en blå glød over stedet, hvor Solen gik ned, og en svag rødbrun himmel
    float mod = max(dot(normalize(vec3(v.x, 0.0, v.z) + 1e-5), normalize(vec3(uSol.x, 0.0, uSol.z) + 1e-5)), 0.0);
    c += tus * (vec3(0.10, 0.17, 0.32) * pow(mod, 6.0) * exp(-vy * 6.0) + vec3(0.07, 0.04, 0.03) * exp(-vy * 3.0));
    return c;
  }
  // Sollyset, der når frem (farve og styrke), og himlens lys på jorden ovenfra
  vec3 sollys() {
    float hs = max(uSol.y, 0.0);
    vec3 t = exp(-uTau * vec3(0.9, 1.0, 1.15) / (hs + 0.035)); // rødligere, når Solen står lavt
    return 2.4 * t * smoothstep(-0.01, 0.03, uSol.y);
  }
  vec3 himmellys() {
    return vec3(0.62, 0.42, 0.28) * 0.55 * smoothstep(-0.12, 0.4, uSol.y) + vec3(0.03, 0.025, 0.03);
  }`;

const VERTEX = /* glsl */ `
  attribute vec2 polar;    // vinkel (radianer fra nord mod øst) og afstand (m)
  uniform vec2 uSted;      // stedet i kraterets retninger (m)
  uniform float uH0;       // højden lige under kameraet (m)
  uniform float uSkridt;   // vinklen mellem to retninger i nettet
  varying vec2 vEN;
  varying vec3 vRel;       // fra stedet (m): øst, op, syd
  varying vec3 vN;         // normalen (øst, op, syd)
  ${LAG_GLSL}
  void main() {
    vec2 d = vec2(sin(polar.x), cos(polar.x)) * polar.y;
    vec2 en = uSted + d;
    float s = max(polar.y * uSkridt, 0.05);
    float h = hoejde(en, s);
    // Hældningen regnes i nettets punkter (de ligger tættere end højdekortets pixel tæt på, og ca. 7 skærmpixel
    // fra hinanden langt væk). Det sparer mange opslag pr. pixel.
    float e = max(s, pxH.x);
    float hx = hoejde(en + vec2(e, 0.0), e) - hoejde(en - vec2(e, 0.0), e);
    float hy = hoejde(en + vec2(0.0, e), e) - hoejde(en - vec2(0.0, e), e);
    vN = vec3(-hx, 2.0 * e, hy);
    float krum = dot(d, d) / ${(2 * R).toFixed(1)};
    vec3 p = vec3(d.x, h - uH0 - krum, -d.y);
    vEN = en;
    vRel = p;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p * 0.001, 1.0);
  }`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D tF0, tF1, tF2, tF3;   // fotos (grå, 0,5 = lagets middel)
  uniform vec4 bF3;                        // lag 3's foto har sine egne grænser
  uniform sampler2D tS0, tS1, tS2, tS3;   // skyggekort (1 = i sol)
  uniform sampler2D tFarve;                // Viking-farverne (stedets kort fra M5b)
  uniform vec4 bFarve;
  uniform float uSkygger;                  // 0, før skyggekortene er regnet
  uniform float uKamH;                     // kameraets højde (m)
  varying vec2 vEN;
  varying vec3 vRel;
  varying vec3 vN;
  ${LAG_GLSL}
  ${HIMMEL_GLSL}
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float stoej(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  void main() {
    vec2 en = vEN;
    float fod = max(length(fwidth(en)), 0.02); // m pr. skærmpixel
    vec2 u0 = lagUV(bH0, en), u1 = lagUV(bH1, en), u2 = lagUV(bH2, en), u3 = lagUV(bH3, en);
    float w0 = kantV(u0), w1 = kantV(u1), w2 = kantV(u2);
    vec3 n = normalize(vN);
    // Fotoet (det skarpeste lag, der dækker stedet, og højst to lag, hvor de glider over i hinanden)
    float f;
    if (w0 >= 0.999) f = texture2D(tF0, u0).r;
    else {
      if (w1 >= 0.999) f = texture2D(tF1, u1).r;
      else {
        f = w2 >= 0.999 ? texture2D(tF2, u2).r : texture2D(tF3, lagUV(bF3, en)).r;
        if (w2 > 0.0 && w2 < 0.999) f = mix(f, texture2D(tF2, u2).r, w2);
        if (w1 > 0.0) f = mix(f, texture2D(tF1, u1).r, w1);
      }
      if (w0 > 0.0) f = mix(f, texture2D(tF0, u0).r, w0);
    }
    float rel = 2.0 * f;
    // Detaljer helt tæt på (under fotoets skarphed): små sten og grus, tegnet af programmet (fotoet har 25 cm pr. pixel)
    float naer = 1.0 - smoothstep(0.012, 0.09, fod);
    if (naer > 0.0) {
      float stenH = 0.0, stenF = 0.5, fod2 = 1.0;
      vec2 stenN = vec2(0.0);
      for (int lag = 0; lag < 2; lag++) {
        float str = lag == 0 ? 0.32 : 0.11;           // cellernes størrelse (m)
        vec2 q = en / str + float(lag) * 17.3;
        vec2 ci = floor(q);
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 c = ci + vec2(i, j);
          vec2 p = c + vec2(hash(c), hash(c + 3.7)) ;
          float r = 0.12 + 0.3 * hash(c + 9.1) * hash(c + 1.3);
          vec2 d = q - p;
          // kantede sten: en drejet firkant blandet med en cirkel, fladere i den ene retning
          float a = hash(c + 2.9) * 6.283;
          vec2 rd = mat2(cos(a), -sin(a), sin(a), cos(a)) * d * vec2(1.0, 1.0 + hash(c + 4.1));
          float af = mix(length(rd), max(abs(rd.x), abs(rd.y)) * 1.15, 0.65);
          float t = 1.0 - af * af / (r * r);
          bool er = hash(c + 5.5) < (lag == 0 ? 0.22 : 0.3);
          if (er && t > -0.6 && t <= 0.0) fod2 = min(fod2, 1.0 + t * 0.6); // lidt skygge og støv lige omkring stenen
          if (t > 0.0 && er) {
            float k = pow(t, 0.35); // flad top og skarpere kant
            if (k > stenH) { stenH = k; stenN = d / (r * max(k, 0.15)); stenF = hash(c + 7.7); }
          }
        }
      }
      float korn = stoej(en * 40.0) * 0.6 + stoej(en * 113.0) * 0.4;
      rel *= mix(1.0, (0.8 + 0.4 * korn) * mix(fod2, 0.45 + 0.6 * stenF, step(0.01, stenH)), naer);
      n = normalize(n + naer * (vec3(stenN.x, 0.0, -stenN.y) * 0.9 + 0.12 * vec3(korn - 0.5, 0.0, stoej(en * 40.0 + 5.0) - 0.5)));
    }
    // Farven: mørkt sand er gråbrunt, lys sten og støv rødbrune (lysstyrken fra fotoet), og Viking-kortet giver en
    // svag tone fra egn til egn (ca. 10 km)
    vec3 viking = textureLod(tFarve, lagUV(bFarve, en), 4.0).rgb;
    vec3 tone = viking / max(dot(viking, vec3(0.3, 0.59, 0.11)), 1e-3) / vec3(1.42, 0.88, 0.62);
    vec3 c = mix(vec3(0.07, 0.06, 0.055), vec3(0.18, 0.118, 0.078), smoothstep(0.35, 1.0, rel));
    c = mix(c, vec3(0.30, 0.20, 0.13), smoothstep(1.0, 1.7, rel));
    c *= mix(vec3(1.0), clamp(tone, 0.6, 1.6), 0.5);
    // Skygger fra bjerge og bakker
    float sk;
    if (w0 >= 0.999) sk = texture2D(tS0, u0).r;
    else {
      if (w1 >= 0.999) sk = texture2D(tS1, u1).r;
      else {
        sk = w2 >= 0.999 ? texture2D(tS2, u2).r : texture2D(tS3, u3).r;
        if (w2 > 0.0 && w2 < 0.999) sk = mix(sk, texture2D(tS2, u2).r, w2);
        if (w1 > 0.0) sk = mix(sk, texture2D(tS1, u1).r, w1);
      }
      if (w0 > 0.0) sk = mix(sk, texture2D(tS0, u0).r, w0);
    }
    sk = mix(1.0, sk, uSkygger);
    float i = max(dot(n, uSol), 0.0);
    vec3 V = normalize(-vRel);
    float ev = max(dot(n, V), 0.0);
    float lys = mix(i, 2.0 * i / (i + ev + 0.05), 0.3); // mat støv og sten (Lambert og lidt Lommel-Seeliger)
    vec3 ud = c * (sollys() * lys * sk + himmellys() * (0.55 + 0.45 * n.y));
    // Dis: luften mellem kameraet og stedet (optisk dybde efter skalahøjden)
    float L = length(vRel);
    float hm = uKamH + 0.5 * vRel.y;
    float tauVej = uTau / ${SKALAHØJDE.toFixed(1)} * L * exp(-(hm - ${TAU_HØJDE.toFixed(1)}) / ${SKALAHØJDE.toFixed(1)});
    float T = exp(-tauVej);
    vec3 vv = normalize(vRel);
    ud = ud * T + himmel(vec3(vv.x, max(vv.y, 0.0), vv.z)) * (1.0 - T);
    gl_FragColor = vec4(ud, 1.0);
  }`;

// Himlen: en kuppel om kameraet med Solen og månerne. Om natten ses stjernerne igennem.
const HIMMEL_VERTEX = /* glsl */ `
  varying vec3 vRet;
  void main() {
    vRet = position;
    vec4 p = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * p;
  }`;
const HIMMEL_FRAGMENT = /* glsl */ `
  uniform vec4 uMaane[2];      // retning (xyz) og vinkelradius (w)
  uniform vec4 uMaaneLys[2];   // retningen fra månen mod Solen (xyz) og om den er i Mars' skygge (w = 0)
  varying vec3 vRet;
  ${HIMMEL_GLSL}
  void main() {
    vec3 v = normalize(vRet);
    vec3 c = himmel(v);
    float alfa = clamp(dot(c, vec3(0.3, 0.59, 0.11)) * 30.0, 0.0, 1.0);
    // Solen: en skive på 0,35° (lys nok til at gløde) og en lille strålekrans
    float mu = dot(v, uSol);
    float vinkel = acos(clamp(mu, -1.0, 1.0));
    float bred = max(fwidth(vinkel), 1e-5);
    float skive = 1.0 - smoothstep(${SOL_RADIUS.toFixed(6)} - bred, ${SOL_RADIUS.toFixed(6)} + bred, vinkel);
    vec3 solFarve = sollys();
    c += solFarve * skive * 14.0 + solFarve * 0.4 * exp(-vinkel * 60.0) * smoothstep(-0.02, 0.02, uSol.y);
    alfa = max(alfa, skive);
    // Månerne: kugler belyst af Solen (mørke som asfalt), svækket af luften foran
    for (int k = 0; k < 2; k++) {
      vec3 m = uMaane[k].xyz;
      float r = uMaane[k].w;
      float a = acos(clamp(dot(v, m), -1.0, 1.0));
      float b = max(fwidth(a), 1e-5);
      float d = 1.0 - smoothstep(max(r - b, 0.0), r + b, a);
      if (d <= 0.0) continue;
      // Normalen på kuglen i det punkt, man ser
      vec3 vinkelret = v - m * dot(v, m);
      float x = clamp(length(vinkelret) / max(r, 1e-6), 0.0, 1.0);
      vec3 nn = normalize(-m * sqrt(1.0 - x * x) + normalize(vinkelret + 1e-9) * x);
      float lysM = max(dot(nn, uMaaneLys[k].xyz), 0.0) * uMaaneLys[k].w;
      float tM = exp(-uTau / (max(m.y, 0.0) + 0.05));
      vec3 mc = vec3(0.16, 0.135, 0.11) * 2.6 * lysM * tM;
      c = mix(c, c * (1.0 - tM * 0.6) + mc, d);
      alfa = max(alfa, d * clamp(0.5 + dot(mc, vec3(4.0)), 0.0, 1.0));
    }
    gl_FragColor = vec4(c / max(alfa, 1e-3), alfa);
  }`;

// Skyggekortet for et lag: Fra hver pixel kigges mod Solen hen over landskabet. Står bjergene højere end Solen, er
// der skygge. Kanten er blød (Solen er 0,35° bred, og lidt lys kommer fra himlen omkring den).
const SKYGGE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const SKYGGE_FRAGMENT = /* glsl */ `
  uniform vec4 bLag;        // lagets grænser (som bH)
  uniform float uPx;        // lagets m pr. pixel
  uniform vec3 uSolL;       // retningen mod Solen (øst, nord, op)
  uniform float uHMaks;     // den højeste højde i landskabet (m)
  varying vec2 vUv;
  ${LAG_GLSL}
  void main() {
    vec2 en = bLag.xy + vUv / bLag.zw;
    float h0 = hoejde(en, uPx);
    float vandret = length(uSolL.xy);
    if (uSolL.z <= -0.01) { gl_FragColor = vec4(0.0); return; }
    vec2 ret = uSolL.xy / max(vandret, 1e-5);
    float tanSol = uSolL.z / max(vandret, 1e-5);
    float maks = -1e9;
    float t = uPx * 1.5;
    for (int i = 0; i < 110; i++) {
      vec2 p = en + ret * t;
      float h = hoejde(p, t * 0.08) - t * t / ${(2 * R).toFixed(1)};
      maks = max(maks, (h - h0) / t);
      t *= 1.11;
      if (h0 + t * tanSol > uHMaks || t > 120000.0) break;
    }
    float bred = 0.0062; // Solens bredde (0,35°) i tangens
    gl_FragColor = vec4(smoothstep(-bred, bred, tanSol - maks));
  }`;

// Nettet i ringe: punkt 0 er midten, så kommer ringene fra 0,3 m til MAKS
function lavNet(retninger, ringe) {
  const q = Math.pow(MAKS / 0.3, 1 / (ringe - 1));
  const polar = new Float32Array((1 + retninger * ringe) * 2);
  for (let j = 0; j < ringe; j++) {
    const r = 0.3 * Math.pow(q, j);
    for (let i = 0; i < retninger; i++) {
      const k = 1 + j * retninger + i;
      polar[k * 2] = (i / retninger) * Math.PI * 2;
      polar[k * 2 + 1] = r;
    }
  }
  const indeks = [];
  for (let i = 0; i < retninger; i++) indeks.push(0, 1 + ((i + 1) % retninger), 1 + i);
  for (let j = 0; j < ringe - 1; j++) {
    for (let i = 0; i < retninger; i++) {
      const a = 1 + j * retninger + i, b = 1 + j * retninger + ((i + 1) % retninger);
      const c = a + retninger, d = b + retninger;
      indeks.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('polar', new THREE.BufferAttribute(polar, 2));
  // position er nødvendig for Three.js, men bruges ikke (vertex-shaderen regner punkterne ud)
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((1 + retninger * ringe) * 3), 3));
  geo.setIndex(new THREE.BufferAttribute(new Uint32Array(indeks), 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), MAKS / 1000);
  return geo;
}

// data: kraterets JSON fra lav_landskab.py. hent(navn, færdig, valg) som i js/kosmos/mars.js (billederne bliver i
// grafikkortet). bredde: stedets bredde (grader) til Solens bane. deklination: Solens deklination (grader).
export function lavLandskab({ renderer, data, hent, krater, deklination = 0 }) {
  const gruppe = new THREE.Group();
  const maks = renderer.capabilities.maxTextureSize;
  const anisotropi = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const [retninger, ringe] = TEST_HURTIG ? [256, 300] : LAV_KVALITET ? [640, 640] : [1024, 900];
  const geo = lavNet(retninger, ringe);
  const tom = new THREE.DataTexture(new Uint8Array([128, 0, 0, 255]), 1, 1);
  tom.needsUpdate = true;
  const hvid = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  hvid.needsUpdate = true;
  const u = {
    uSted: { value: new THREE.Vector2() }, uH0: { value: 0 }, uSkridt: { value: (Math.PI * 2) / retninger },
    pxH: { value: new THREE.Vector4(1, 4, 16, 174) }, uKamH: { value: 0 },
    uSol: { value: new THREE.Vector3(0, 1, 0) }, uTau: { value: TAU }, uSkygger: { value: 0 },
    tFarve: { value: tom }, bFarve: { value: new THREE.Vector4(0, 0, 1, 1) }, bF3: { value: new THREE.Vector4(0, 0, 1, 1) },
  };
  for (let k = 0; k < 4; k++) {
    u[`tH${k}`] = { value: tom };
    u[`tF${k}`] = { value: tom };
    u[`tS${k}`] = { value: hvid };
    u[`bH${k}`] = { value: new THREE.Vector4(-1e9, -1e9, 1e-12, 1e-12) };
    u[`rH${k}`] = { value: new THREE.Vector2(0, 0) };
  }
  const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERTEX, fragmentShader: FRAGMENT });
  mat.extensions = { derivatives: true };
  const jord = new THREE.Mesh(geo, mat);
  jord.frustumCulled = false;
  gruppe.add(jord);

  // Himlen
  const hu = {
    uSol: u.uSol, uTau: u.uTau,
    uMaane: { value: [new THREE.Vector4(), new THREE.Vector4()] },
    uMaaneLys: { value: [new THREE.Vector4(), new THREE.Vector4()] },
  };
  const himmelMat = new THREE.ShaderMaterial({
    uniforms: hu, vertexShader: HIMMEL_VERTEX, fragmentShader: HIMMEL_FRAGMENT,
    side: THREE.BackSide, transparent: true, depthWrite: false,
  });
  const himmel = new THREE.Mesh(new THREE.SphereGeometry(500, 96, 48), himmelMat);
  himmel.renderOrder = 10; // efter stjernerne, så de kun ses om natten
  himmel.frustumCulled = false;
  gruppe.add(himmel);

  // ---------- Lagene ----------
  const lagData = {};
  const bounds = (v, øst, nord) => v.set(øst[0], nord[0], 1 / (øst[1] - øst[0]), 1 / (nord[1] - nord[0]));
  function sætLag(k, L) {
    bounds(u[`bH${k}`].value, L.øst, L.nord);
    u[`rH${k}`].value.set(L.h[0], L.h[1]);
    lagData[k] = L;
    u.pxH.value.setComponent(k, (L.øst[1] - L.øst[0]) / L.px);
  }
  // Billednavnene: pc og tablet får den store udgave, tests den lille
  const fotoNavn = (navn, k) => {
    if (TEST_HURTIG) return navn.replace('.jpg', '-lille.jpg');
    if (k === 0 && maks >= 8192 && !LAV_KVALITET) return navn.replace('.jpg', '-8k.jpg');
    return navn;
  };
  const højdeNavn = (navn, global) => (global ? navn.replace('{}', TEST_HURTIG ? '1k' : '2k') : TEST_HURTIG ? navn.replace('.png', '-lille.png') : navn);

  let stedId = null;
  let hentId = 0;
  const hentet = {};
  // Gå til et sted: hent lagene (lag 2 og 3 deles af stederne ved samme krater) og kald klar, når alle er hentet
  function gåTil(id, klar) {
    const st = data.steder[id];
    const mit = ++hentId;
    const lag = [data.lag[`${id}0`], data.lag[`${id}1`], data.lag['2'], data.lag['3']];
    const px = TEST_HURTIG ? [512, 512, 512, 1024] : [2048, 2048, 4096, 2048];
    const ny = {}; // teksturerne skiftes først, når alle er hentet (ellers hopper jorden et øjeblik)
    let mangler = 1;
    const ét = () => {
      if (--mangler > 0 || mit !== hentId) return;
      stedId = id;
      bredde = THREE.MathUtils.degToRad(st.bredde);
      u.uSted.value.set(st.øst, st.nord);
      lag.forEach((L, k) => sætLag(k, { ...L, px: px[k] }));
      for (const [n, t] of Object.entries(ny)) if (t && u[n]) u[n].value = t;
      hentet.h0 = ny.h0Billede;
      const L3 = data.lag['3'];
      bounds(u.bF3.value, L3.foto_øst, L3.foto_nord);
      bounds(u.bFarve.value, L3.øst, L3.nord);
      u.uH0.value = højdeVedSted();
      opdaterHimmel();
      nyeSkygger();
      klar?.();
    };
    lag.forEach((L, k) => {
      mangler += 2;
      hent(`${L.global ? '' : 'landskab/'}${højdeNavn(L.højde, L.global)}`, (t) => {
        ny[`tH${k}`] = t;
        if (k === 0) ny.h0Billede = t.image;
        ét();
      }, { farve: false, kanaler: 2, rundt: false, fejl: ét });
      hent(`landskab/${fotoNavn(L.foto, k)}`, (t) => { ny[`tF${k}`] = t; ét(); }, { farve: false, kanaler: 1, anisotropi, rundt: false, fejl: ét });
    });
    mangler++;
    hent(`mars-${krater}-farve.jpg`, (t) => { ny.tFarve = t; ét(); }, { rundt: false, fejl: ét });
    ét(); // (den første tæller: så kan ét() først nå nul, når alle hentninger er sat i gang)
  }

  // Højden under kameraet (m), læst i lag 0's billede (midten er stedet)
  const lærred = document.createElement('canvas');
  function højdeVedSted() {
    const img = hentet.h0;
    if (!img) return 0;
    const L = lagData[0];
    const fx = (u.uSted.value.x - L.øst[0]) / (L.øst[1] - L.øst[0]);
    const fy = 1 - (u.uSted.value.y - L.nord[0]) / (L.nord[1] - L.nord[0]);
    lærred.width = 2;
    lærred.height = 2;
    const c = lærred.getContext('2d', { willReadFrequently: true });
    const x = fx * img.width - 0.5, y = fy * img.height - 0.5;
    c.drawImage(img, Math.floor(x), Math.floor(y), 2, 2, 0, 0, 2, 2);
    const p = c.getImageData(0, 0, 2, 2).data;
    const tx = x - Math.floor(x), ty = y - Math.floor(y);
    const v = (i) => (p[i * 4] * 256 + p[i * 4 + 1]) / 65535;
    const a = v(0) * (1 - tx) + v(1) * tx, b = v(2) * (1 - tx) + v(3) * tx;
    return L.h[0] + (a * (1 - ty) + b * ty) * (L.h[1] - L.h[0]);
  }

  // ---------- Skyggekortene ----------
  const skyggeStr = TEST_HURTIG ? [256, 256, 256, 256] : LAV_KVALITET ? [1024, 512, 1024, 512] : [1024, 1024, 1024, 1024];
  const mål = skyggeStr.map((n) => new THREE.WebGLRenderTarget(n, n, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, generateMipmaps: false }));
  const su = { bLag: { value: new THREE.Vector4() }, uPx: { value: 1 }, uSolL: { value: new THREE.Vector3() }, uHMaks: { value: 2000 } };
  for (let k = 0; k < 4; k++) Object.assign(su, { [`tH${k}`]: u[`tH${k}`], [`bH${k}`]: u[`bH${k}`], [`rH${k}`]: u[`rH${k}`] });
  su.pxH = u.pxH;
  const skyggeMat = new THREE.ShaderMaterial({ uniforms: su, vertexShader: SKYGGE_VERTEX, fragmentShader: SKYGGE_FRAGMENT, depthTest: false, depthWrite: false });
  const skyggeScene = new THREE.Scene();
  skyggeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), skyggeMat));
  const skyggeKamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const regnetSol = new THREE.Vector3(0, -1, 0);
  let skyggeKø = [];
  function nyeSkygger() { skyggeKø = [3, 2, 1, 0]; regnetSol.copy(u.uSol.value); }
  function regnSkygge(k) {
    const L = lagData[k];
    if (!L) return;
    bounds(su.bLag.value, L.øst, L.nord);
    su.uPx.value = (L.øst[1] - L.øst[0]) / skyggeStr[k];
    const s = u.uSol.value;
    su.uSolL.value.set(s.x, -s.z, s.y);
    su.uHMaks.value = data.hMaks;
    const før = renderer.getRenderTarget();
    renderer.setRenderTarget(mål[k]);
    renderer.render(skyggeScene, skyggeKamera);
    renderer.setRenderTarget(før);
    u[`tS${k}`].value = mål[k].texture;
    if (k === 0) u.uSkygger.value = 1;
  }

  // ---------- Tiden, Solen og månerne ----------
  let timer = 9; // lokal soltid
  let dag = 0; // hele døgn siden start (månerne bevæger sig videre fra døgn til døgn)
  const lokal = (øst, nord, op, v) => v.set(øst, op, -nord); // fra (øst, nord, op) til verden
  let bredde = THREE.MathUtils.degToRad(data.steder[Object.keys(data.steder)[0]].bredde);
  const δ = THREE.MathUtils.degToRad(deklination);
  // Retningen mod et punkt på himlen ved timevinkel H og deklination d (fra Mars' midte, som for Solen)
  function himmelRetning(H, d, v) {
    return lokal(-Math.cos(d) * Math.sin(H), Math.sin(d) * Math.cos(bredde) - Math.cos(d) * Math.cos(H) * Math.sin(bredde),
      Math.sin(d) * Math.sin(bredde) + Math.cos(d) * Math.cos(H) * Math.cos(bredde), v);
  }
  const hjælp = new THREE.Vector3();
  const tilSol = new THREE.Vector3();
  function opdaterHimmel() {
    const H = ((timer - 12) / 24) * Math.PI * 2;
    himmelRetning(H, δ, u.uSol.value);
    tilSol.copy(u.uSol.value);
    // Månerne: set fra stedet (ikke fra Mars' midte, de er tæt på)
    const op = lokal(0, 0, 1, new THREE.Vector3());
    MÅNER.forEach((m, k) => {
      const Hm = m.fase + ((dag * 24 + timer) / m.periode) * Math.PI * 2;
      const fraMidt = himmelRetning(Hm, 0, hjælp).clone().multiplyScalar(m.afstand);
      const rel = fraMidt.clone().addScaledVector(op, -R / 1000);
      const d = rel.length();
      hu.uMaane.value[k].set(rel.x / d, rel.y / d, rel.z / d, Math.atan(m.radius / d));
      // Mars' skygge: bag Mars set fra Solen og inden for Mars' radius fra skyggens akse
      const bag = fraMidt.dot(tilSol) < 0 && fraMidt.clone().addScaledVector(tilSol, -fraMidt.dot(tilSol)).length() < R / 1000;
      hu.uMaaneLys.value[k].set(tilSol.x, tilSol.y, tilSol.z, bag ? 0 : 1);
    });
    if (stedId && regnetSol.angleTo(u.uSol.value) > 0.004 && !skyggeKø.length) nyeSkygger();
  }
  opdaterHimmel();

  return {
    gruppe,
    gåTil,
    get sted() { return stedId; },
    get tid() { return timer; },
    // Over 24 (fx når dagen går) tæller et nyt døgn. Under 24 er det klokken i samme døgn (skyderen).
    set tid(t) { dag += Math.floor(t / 24); timer = ((t % 24) + 24) % 24; opdaterHimmel(); },
    sol: u.uSol.value,
    // Hvert billede: himlen følger kameraet, ét skyggekort ad gangen, og kameraets højde (til disen)
    opdater(kamera) {
      himmel.position.copy(kamera.position);
      u.uKamH.value = u.uH0.value + kamera.position.y * 1000;
      if (skyggeKø.length) regnSkygge(skyggeKø.pop());
    },
    // Højden under stedet (m over nulpunktet)
    get højde() { return u.uH0.value; },
    // Kun til tests
    test: () => ({ sted: stedId, tid: timer, højde: u.uH0.value, net: [retninger, ringe], skygger: u.uSkygger.value, solHøjde: THREE.MathUtils.radToDeg(Math.asin(u.uSol.value.y)), måner: hu.uMaane.value.map((m) => ({ højde: THREE.MathUtils.radToDeg(Math.asin(m.y)), kompas: (THREE.MathUtils.radToDeg(Math.atan2(m.x, -m.z)) + 360) % 360, bredde: THREE.MathUtils.radToDeg(2 * m.w) })) }),
    stop() {
      geo.dispose();
      mat.dispose();
      himmel.geometry.dispose();
      himmelMat.dispose();
      skyggeMat.dispose();
      for (const m of mål) m.dispose();
      tom.dispose();
      hvid.dispose();
    },
  };
}
