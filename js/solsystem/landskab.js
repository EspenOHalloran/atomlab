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
// Lyset (L1 i docs/plan-mars.md, justeret efter NASA's panorama PIA20332 fra Naukluft): Sollyset og himlens lys på
// jorden. Mens man står, er gløden slået fra, og js/kosmos/mars.js sætter eksponeringen med eksponering(solY).
const SOLLYS = 2.2;
const HIMMELLYS = 0.18;
const HIMMEL_STYRKE = 1.5; // himlens egen lysstyrke
// Eksponeringen tilpasser sig delvis lyset på jorden, som et kamera eller øjet (ellers er middag meget lysere end
// morgen). EKSPONERING gælder ved Solen 22° over horisonten.
const EKSPONERING = 0.85;
const lysPåJorden = (solY) => {
  const h = Math.max(solY, 0);
  const op = THREE.MathUtils.smoothstep(solY, -0.01, 0.03);
  return SOLLYS * Math.exp(-TAU / (h + 0.035)) * h * op + 0.62 * HIMMELLYS * THREE.MathUtils.smoothstep(solY, -0.12, 0.4) + 0.02;
};
const LYS_REF = lysPåJorden(Math.sin(THREE.MathUtils.degToRad(22)));
export function eksponering(solY) {
  return THREE.MathUtils.clamp(EKSPONERING * (LYS_REF / lysPåJorden(solY)) ** 0.4, 0.55, 1.5);
}
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
    // Støvets gulbrune lys: mest mod horisonten, mindre ved Solen lavt. Opad er himlen mørkere og mere mættet
    // (L1: før var himlen og jorden næsten lige lyse, på rovernes fotos er horisonten det lyseste)
    vec3 farve = mix(vec3(0.70, 0.46, 0.29), vec3(0.62, 0.34, 0.18), smoothstep(0.1, 0.7, vy));
    // Himlen bliver lysere, jo højere Solen står (før L1 holdt den op ved 30°, så jorden ved middag blev lysere end himlen)
    vec3 brun = farve * ${HIMMEL_STYRKE.toFixed(2)} * (1.0 - exp(-uTau * m * 0.6)) * (0.25 + 0.75 * smoothstep(-0.05, 0.9, hs));
    brun = mix(brun, vec3(0.42, 0.24, 0.13) * (1.0 - exp(-uTau * m * 0.6)), 1.0 - smoothstep(0.0, 0.3, hs));
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
  // Sollyset, der når frem (farve og styrke), og himlens lys på jorden ovenfra. Forholdet mellem dem bestemmer, hvor
  // mørke skyggerne er (L1: himmellyset var 0,55, og så var skyggerne kun ca. 3 gange mørkere end det belyste ved lav
  // sol. På rovernes fotos er de meget mørkere)
  vec3 sollys() {
    float hs = max(uSol.y, 0.0);
    vec3 t = exp(-uTau * vec3(0.9, 1.0, 1.15) / (hs + 0.035)); // rødligere, når Solen står lavt
    return ${SOLLYS.toFixed(2)} * t * smoothstep(-0.01, 0.03, uSol.y);
  }
  vec3 himmellys() {
    return vec3(0.62, 0.42, 0.28) * ${HIMMELLYS.toFixed(2)} * smoothstep(-0.12, 0.4, uSol.y) + vec3(0.02, 0.017, 0.02);
  }`;

const VERTEX = /* glsl */ `
  attribute vec2 polar;    // vinkel (radianer fra nord mod øst) og afstand (m)
  uniform vec2 uSted;      // stedet i kraterets retninger (m)
  uniform float uH0;       // højden lige under kameraet (m)
  uniform float uSkridt;   // vinklen mellem to retninger i nettet
  varying vec2 vEN;
  varying vec3 vRel;       // fra stedet (m): øst, op, syd
  varying vec3 vN;         // normalen (øst, op, syd)
  varying float vKlynge;   // stenenes klynger (grov støj, regnet her i punkterne, for den skifter kun over meter)
  ${LAG_GLSL}
  float hashV(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float stoejV(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hashV(i), hashV(i + vec2(1, 0)), u.x), mix(hashV(i + vec2(0, 1)), hashV(i + vec2(1, 1)), u.x), u.y);
  }
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
    vKlynge = polar.y < 60.0 ? stoejV(en * 0.19) * 0.6 + stoejV(en * 0.7 + 3.1) * 0.4 : 0.5;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p * 0.001, 1.0);
  }`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D tF0, tF1, tF2, tF3;   // fotos (grå, 0,5 = lagets middel)
  uniform vec4 bF3;                        // lag 3's foto har sine egne grænser
  uniform sampler2D tS0, tS1, tS2, tS3;   // skyggekort (1 = i sol)
  uniform sampler2D tA0, tA1, tA2, tA3;   // hvor meget af himlen der ses (ambient occlusion, M8c del 3 trin 2)
  uniform float uAO;                       // 0, før kortene er regnet
  uniform float uNaer;                     // 1: stenene helt tæt på tegnes (0 kun til målinger)
  uniform sampler2D tFarve;                // Viking-farverne (stedets kort fra M5b)
  uniform vec4 bFarve;
  uniform float uSkygger;                  // 0, før skyggekortene er regnet
  uniform float uKamH;                     // kameraets højde (m)
  uniform float uStenArt;                  // stenene: 0 plader af sandsten (Gale), 1 kantede sten og klippeflader (Jezero)
  varying vec2 vEN;
  varying vec3 vRel;
  varying vec3 vN;
  varying float vKlynge;
  ${LAG_GLSL}
  ${HIMMEL_GLSL}
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float stoej(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  vec4 hash4(vec2 p) {
    return fract(sin(vec4(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)), dot(p, vec2(97.3, 53.1)))) * 43758.5453);
  }
  // En stens omrids: et uregelmæssigt ottekantet felt (fire akser, og hver af de otte sider har sin egen afstand, så
  // stenen ikke er symmetrisk). Giver afstanden (1 ved kanten for r = 1) og retningen ud gennem den side, der danner
  // kanten (til hældningen, så stenen får facetter).
  vec3 kant(vec2 v, vec4 b) {
    vec4 wp = 0.75 + 0.6 * fract(b * 7.31 + b.yzwx * 3.7);   // siderne mod +
    vec4 wm = 0.75 + 0.6 * fract(b * 5.17 + b.wxyz * 2.3);   // og mod -
    float w = v.x > 0.0 ? wp.x : wm.x;
    vec3 m = vec3(abs(v.x) * w, sign(v.x) * w, 0.0);
    w = v.y > 0.0 ? wp.y : wm.y;
    float s = abs(v.y) * w;
    if (s > m.x) m = vec3(s, 0.0, sign(v.y) * w);
    float e = dot(v, vec2(0.7071, 0.7071));
    w = e > 0.0 ? wp.z : wm.z;
    if (abs(e) * w > m.x) m = vec3(abs(e) * w, sign(e) * w * vec2(0.7071, 0.7071));
    e = dot(v, vec2(0.7071, -0.7071));
    w = e > 0.0 ? wp.w : wm.w;
    if (abs(e) * w > m.x) m = vec3(abs(e) * w, sign(e) * w * vec2(0.7071, -0.7071));
    return m;
  }
  // ---------- Mellemlaget (M8c del 3 trin 3): sten på ca. 0,5-3 m, der rager op ----------
  // En sten malet på jorden bliver trykket flad, når man ser den på skrå (en sten på 1 m 50 m væk fylder ca. 17 × 8
  // skærmpixel, men malet på jorden kun ca. 17 × 1). Derfor følges synslinjen fra punktet på jorden tilbage mod øjet
  // gennem et gitter af celler med højst én sten hver. Stenen er en ellipsoide (delvis begravet) skåret af fem flader,
  // så den bliver kantet, og strålen rammer den præcist (regnet, ingen opslag i kort). Stenene ligger helt inde i deres
  // celle, så den første sten, strålen rammer fra øjets side, er den nærmeste.
  // Jorden mellem øjet og punktet regnes som en ret linje, så strålens højde over jorden er uKamOp · u / afstanden.
  uniform float uMellem;   // 1: mellemlaget tegnes (0 kun til målinger)
  uniform vec2 uSted;      // stedet i kraterets retninger (m)
  uniform vec3 uKam;       // kameraet (m, som vRel: øst, op, syd)
  uniform float uKamOp;    // kameraets højde over jorden lige under det (m)
  // Facetterne (normalen i den skalerede kugle, hvor stenen er en enhedskugle)
  const vec3 F0 = vec3(0.77, 0.26, 0.58), F1 = vec3(-0.62, 0.55, 0.56), F2 = vec3(-0.25, -0.85, 0.46), F3 = vec3(0.47, -0.62, 0.63);
  // Stenen i cellen c (lag med cellestørrelsen str): midten (øst, nord i m), radierne (m: langs, på tværs, op), retningen
  // og de tilfældige tal. Giver false, hvis cellen er tom.
  bool stor(vec2 c, float str, float taet0, float rMin, float rMaks, out vec2 p, out vec3 rad, out vec2 rv, out vec4 b) {
    vec4 a = hash4(c + str * 3.17);
    b = hash4(c + str * 5.31 + 11.0);
    float kl = stoej(c * str * 0.05 + 7.0);                      // klynger (ca. 20 m)
    if (a.z > taet0 * (0.25 + 1.5 * kl * kl)) return false;
    p = (c + 0.25 + 0.5 * a.xy) * str;
    float r = mix(rMin, rMaks, b.x * b.x);                        // potenslov: få store
    if (length(p - uSted) < r + 1.2) return false;               // ingen sten, hvor man står
    float op = uStenArt > 0.5 ? 0.8 + 0.5 * a.w : 0.5 + 0.4 * a.w; // Gale: flade plader, Jezero: højere sten
    rad = vec3(r, r * (0.55 + 0.45 * b.y), r * op);
    rv = normalize(b.zw - 0.5 + 1e-3);
    return true;
  }
  // Strålen (o + u·w, k·u) fra punktet på jorden mod øjet. Giver u, hvor den rammer stenen fra øjets side (-1: ingen), og
  // normalen (øst, op, syd).
  float ram(vec2 o, vec2 w, float k, vec2 p, vec3 rad, vec2 rv, vec4 b, out vec3 nrm) {
    vec2 tv = vec2(-rv.y, rv.x);
    vec2 q = o - p;
    vec3 O = vec3(dot(q, rv), dot(q, tv), 0.3 * rad.z) / rad;   // (midten ligger 30 % under jorden)
    vec3 D = vec3(dot(w, rv), dot(w, tv), k) / rad;
    float A = dot(D, D), B = dot(O, D), C = dot(O, O) - 1.0;
    float disk = B * B - A * C;
    if (disk <= 0.0) return -1.0;
    float sq = sqrt(disk);
    float lo = (-B - sq) / A, hi = (-B + sq) / A;
    vec3 ns = O + hi * D;                                          // (normalen i kuglen)
    vec4 dk = 0.5 + 0.4 * vec4(b.x, fract(b.y * 7.0), fract(b.z * 5.0), fract(b.w * 3.0));
    vec2 spejl = sign(fract(b.yx * 13.0) - 0.5); // (facetterne spejles, så stenene ikke har samme form)
    for (int i = 0; i < 5; i++) {
      vec3 f = i == 0 ? F0 : i == 1 ? F1 : i == 2 ? F2 : i == 3 ? F3 : vec3(0.0, 0.0, 1.0);
      f.xy *= spejl;
      float d = i == 0 ? dk.x : i == 1 ? dk.y : i == 2 ? dk.z : i == 3 ? dk.w : 0.45 + 0.5 * fract(b.w * 11.0);
      float fd = dot(f, D), fo = dot(f, O) - d;
      if (abs(fd) < 1e-5) { if (fo > 0.0) return -1.0; continue; }
      float uf = -fo / fd;
      if (fd > 0.0) { if (uf < hi) { hi = uf; ns = f; } }
      else lo = max(lo, uf);
    }
    if (hi < lo || hi < 0.0) return -1.0;
    vec3 nl = ns / rad;
    vec2 ne = nl.x * rv + nl.y * tv;
    nrm = normalize(vec3(ne.x, nl.z, -ne.y));
    return hi;
  }
  // Følg strålen gennem lagets celler fra øjets side (højst N celler). Giver u for den nærmeste sten (-1: ingen).
  float ramLag(vec2 G, vec2 w, float k, float umaks, float str, float taet0, float rMin, float rMaks, int N, out vec3 nrm, out vec4 bh) {
    vec2 S = (G + w * umaks) / str;
    vec2 dir = -w;
    vec2 cel = floor(S);
    vec2 st = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
    vec2 tD = 1.0 / max(abs(dir), vec2(1e-5));
    vec2 tM = vec2(dir.x >= 0.0 ? cel.x + 1.0 - S.x : S.x - cel.x, dir.y >= 0.0 ? cel.y + 1.0 - S.y : S.y - cel.y) * tD;
    float tEnd = umaks / str;
    for (int i = 0; i < 12; i++) {
      if (i >= N) break;
      vec2 p; vec3 rad; vec2 rv; vec4 b;
      if (stor(cel, str, taet0, rMin, rMaks, p, rad, rv, b)) {
        float u = ram(G, w, k, p, rad, rv, b, nrm);
        if (u >= 0.0) { bh = b; return u; }
      }
      if (min(tM.x, tM.y) > tEnd) break;
      if (tM.x < tM.y) { tM.x += tD.x; cel.x += st.x; } else { tM.y += tD.y; cel.y += st.y; }
    }
    return -1.0;
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
    // Mellemlaget (se ramLag): to lag af celler. A: 3 m, sten 0,15-0,7 m i radius. B: 9 m, 0,6-1,6 m, færre.
    // Et lag tegnes ud til 70 m (A) og 250 m (B), og så længe en sten på ca. 0,5 m (A) eller 1,2 m (B) er mindst ca. 3 pixel
    // høj på skærmen (længere væk er de næsten usynlige og koster mest, for strålen skal gennem flest celler).
    vec3 stenNrm = vec3(0.0, 1.0, 0.0);
    vec4 stenB = vec4(0.5);
    float stenU = -1.0;
    vec2 tilOje = uSted + vec2(uKam.x, -uKam.z) - en;
    float dH = length(tilOje);
    float pa = length(fwidth(normalize(vRel - uKam))); // radianer pr. pixel
    float kOje = uKamOp / max(dH, 0.01);
    bool mellem = uMellem > 0.5 && dH > 1.0 && dH < 250.0 && uKamOp < 50.0;
    if (mellem && dH < 70.0 && 0.5 > 3.0 * dH * pa) {
      vec2 w = tilOje / dH;
      vec3 nr; vec4 bb;
      float u = ramLag(en, w, kOje, min(0.9 / kOje + 0.8, dH - 0.5), 3.0, 0.75, 0.15, 0.7, ${LAV_KVALITET ? 5 : 8}, nr, bb);
      if (u >= 0.0) { stenU = u; stenNrm = nr; stenB = bb; }
      if (dH < 250.0 && 1.2 > 3.0 * dH * pa) {
        float uB = ramLag(en, w, kOje, min(2.2 / kOje + 1.8, dH - 0.5), 9.0, 0.18, 0.6, 1.6, ${LAV_KVALITET ? 4 : 6}, nr, bb);
        if (uB > stenU) { stenU = uB; stenNrm = nr; stenB = bb; }
      }
    }
    // Detaljer helt tæt på (under fotoets skarphed, M8c del 3 trin 1): sten og grus, tegnet af programmet efter rovernes
    // fotos (fotoet fra kredsløb har 25 cm pr. pixel). Tre lag af celler med højst én sten hver: store (0,9 m) og små
    // (0,28 m) sten og ved Jezero flade, lyse klippeflader i niveau med jorden (1,8 m). Størrelsen følger en potenslov
    // (mange små, få store), og stenene ligger i klynger efter en grov støj og fotoets lysstyrke (klippe er lysere end
    // mørkt sand). Hvert lag tegnes, så længe dets celler er store nok på skærmen, så de store sten ses længst væk.
    // Hver sten ligger helt inde i sin celle, så kun cellen selv kan have en sten i punktet, og skyggen kan kun komme
    // fra cellen og de tre naboer mod Solen (4 celler pr. lag i stedet for 9: det første forsøg var ca. 5 gange dyrere).
    float stenAlb = 1.0, stenGraa = 0.0, stenSk = 1.0, stenH0 = 0.0;
    vec2 stenN = vec2(0.0);
    float naer = 1.0 - smoothstep(0.012, 0.09, fod); // (til gruset)
    float jez = step(0.5, uStenArt);
    if (uNaer > 0.5 && stenU < 0.0 && fod < 0.16 + 0.3 * jez) {
      float klynge = smoothstep(0.3, 0.8, vKlynge + (f - 0.5) * 1.2);
      vec2 solV = vec2(uSol.x, -uSol.z);
      float cotSol = length(solV) / max(uSol.y, 0.06);
      vec2 vaek = -solV / max(length(solV), 1e-4); // skyggens retning (øst, nord)
      vec2 mot = vec2(solV.x >= 0.0 ? 1.0 : -1.0, solV.y >= 0.0 ? 1.0 : -1.0); // nabocellerne mod Solen
      float stenH = 0.0, skygge = 0.0, fodM = 0.0;
      for (int lag = 0; lag < 3; lag++) {
        if (lag == 2 && jez < 0.5) break;
        float str = lag == 0 ? 0.9 : lag == 1 ? 0.28 : 1.8;     // cellernes størrelse (m)
        float vis = 1.0 - smoothstep(0.06, 0.16, fod / str);    // til ca. 6-16 pixel pr. celle
        if (vis <= 0.0) continue;
        vec2 q = en / str + float(lag) * 17.3;
        vec2 ci = floor(q);
        for (int k = 0; k < 4; k++) {
          if (lag == 2 && k > 0) break; // (klippefladerne er flade og kaster ingen skygge)
          vec2 c = ci + (k == 1 ? vec2(mot.x, 0.0) : k == 2 ? vec2(0.0, mot.y) : k == 3 ? mot : vec2(0.0));
          vec4 a = hash4(c);
          float taet = lag == 2 ? 0.35 + 0.3 * klynge : mix(0.04, lag == 0 ? 0.55 : 0.75, klynge);
          if (a.z > taet) continue;
          vec4 b = fract(a.wxyz * 7.31 + a.yzwx * 3.17);
          vec2 p = c + 0.3 + 0.4 * a.xy;
          // potenslov: de fleste er små, enkelte fylder næsten cellen (radius højst 0,3 celle)
          float r = lag == 2 ? 0.17 + 0.13 * b.x : 0.07 + 0.23 * b.x * b.x * b.x;
          vec2 d = q - p;
          // Gale: flade plader af sandsten (lave, flad top, skarp kant, lidt skrå). Jezero: højere, kantede sten.
          float hM = lag == 2 ? 0.0 : r * str * (jez > 0.5 ? 0.55 + 0.4 * a.w : 0.2 + 0.3 * a.w); // højden (m)
          if (k == 0) {
            vec2 rv = normalize(b.zw - 0.5 + 1e-3);
            mat2 R = mat2(rv.x, -rv.y, rv.y, rv.x);
            vec3 m = kant(R * d, b);
            float t = 1.0 - m.x / r; // 1 i midten, 0 ved kanten
            if (t > 0.0) {
              if (lag == 2) {
                if (stenH <= 0.0) {
                  stenAlb = mix(stenAlb, 1.35 + 0.35 * a.w, vis * smoothstep(0.0, 0.08, t));
                  stenGraa = mix(stenGraa, 0.25, vis);
                }
              } else if (t * hM > stenH) {
                float k2 = jez > 0.5 ? sqrt(t) : smoothstep(0.0, 0.18, t);
                stenH = max(k2 * hM, 1e-4);
                // hældningen: fladen, der danner kanten (så stenene får facetter), og en skrå top på pladerne
                float dk = jez > 0.5 ? 0.5 / sqrt(max(t, 0.04)) : (1.0 - k2) * 6.0;
                vec2 g = (m.yz * R) * dk * hM / (r * str);
                if (jez < 0.5) g += (b.zw - 0.5) * 0.5 * smoothstep(0.1, 0.3, t);
                stenN = clamp(g, -3.0, 3.0) * vis;
                // farven: mørkere og mere grå end sandet (som på fotoerne), nogle lysere
                stenAlb = mix(1.0, jez > 0.5 ? 0.5 + 0.35 * a.w : 0.72 + 0.4 * a.w, vis);
                stenGraa = vis * (jez > 0.5 ? 0.7 : 0.45);
              }
            } else if (hM > 0.0) fodM = max(fodM, vis * (1.0 - smoothstep(0.0, 0.3, -t))); // lidt mørkere ved foden
          }
          if (hM > 0.0) {
            // skyggen på jorden væk fra Solen: stenen trukket ud som en kapsel (højst én celle lang)
            float L = min(hM * cotSol / str, 1.0);
            float sa = clamp(dot(d, vaek) / max(L, 1e-4), 0.0, 1.0);
            float ds = length(d - vaek * L * sa) / (r * (0.95 - 0.35 * sa));
            skygge = max(skygge, vis * (1.0 - smoothstep(0.85, 1.05, ds)));
          }
        }
      }
      if (stenH <= 0.0) {
        stenSk = 1.0 - 0.92 * skygge * smoothstep(0.0, 0.08, uSol.y);
        stenAlb *= 1.0 - 0.14 * fodM;
      }
      n = normalize(n + vec3(stenN.x, 0.0, -stenN.y));
      stenH0 = stenH;
    }
    if (stenU >= 0.0) { naer = 0.0; n = stenNrm; }
    float korn = stoej(en * 40.0) * 0.6 + stoej(en * 113.0) * 0.4;
    rel *= mix(1.0, 0.8 + 0.4 * korn, naer) * stenAlb;
    n = normalize(n + naer * 0.12 * vec3(korn - 0.5, 0.0, stoej(en * 40.0 + 5.0) - 0.5));
    // Farven: mørkt sand er gråbrunt, lys sten og støv rødbrune (lysstyrken fra fotoet), og Viking-kortet giver en
    // svag tone fra egn til egn (ca. 10 km)
    vec3 viking = textureLod(tFarve, lagUV(bFarve, en), 4.0).rgb;
    vec3 tone = viking / max(dot(viking, vec3(0.3, 0.59, 0.11)), 1e-3) / vec3(1.42, 0.88, 0.62);
    vec3 c = mix(vec3(0.07, 0.06, 0.055), vec3(0.18, 0.118, 0.078), smoothstep(0.35, 1.0, rel));
    c = mix(c, vec3(0.30, 0.20, 0.13), smoothstep(1.0, 1.7, rel));
    c *= mix(vec3(1.0), clamp(tone, 0.6, 1.6), 0.5);
    c = mix(c, vec3(dot(c, vec3(0.3, 0.59, 0.11))) * vec3(1.08, 1.0, 0.94), stenGraa); // stenene er mere grå end sandet
    if (stenU >= 0.0) c = mix(c, vec3(dot(c, vec3(0.3, 0.59, 0.11))) * vec3(1.08, 1.0, 0.94), 0.5) * (jez > 0.5 ? 0.55 + 0.35 * stenB.w : 0.7 + 0.4 * stenB.w);
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
    // Himlen, der ses fra punktet (mørkere i sprækker og lavninger): samme lag som skyggerne
    float ao = 1.0;
    if (uAO <= 0.0) {}
    else if (w0 >= 0.999) ao = texture2D(tA0, u0).r;
    else {
      if (w1 >= 0.999) ao = texture2D(tA1, u1).r;
      else {
        ao = w2 >= 0.999 ? texture2D(tA2, u2).r : texture2D(tA3, u3).r;
        if (w2 > 0.0 && w2 < 0.999) ao = mix(ao, texture2D(tA2, u2).r, w2);
        if (w1 > 0.0) ao = mix(ao, texture2D(tA1, u1).r, w1);
      }
      if (w0 > 0.0) ao = mix(ao, texture2D(tA0, u0).r, w0);
    }
    ao = mix(1.0, ao * ao, uAO);
    sk = mix(1.0, sk, uSkygger) * stenSk;
    if (mellem && stenU < 0.0 && sk > 0.02 && uSol.y > 0.03 && dH < 150.0) {
      vec2 solV2 = vec2(uSol.x, -uSol.z);
      float lv = max(length(solV2), 1e-4);
      vec2 sw = solV2 / lv;
      float ks = uSol.y / lv;
      vec3 nr; vec4 bb;
      float ssk = 1.0;
      if (dH < 50.0 && ramLag(en, sw, ks, min(0.9 / ks + 0.8, 24.0), 3.0, 0.75, 0.15, 0.7, ${LAV_KVALITET ? 3 : 5}, nr, bb) >= 0.0) ssk = 0.08;
      else if (ramLag(en, sw, ks, min(2.2 / ks + 1.8, 45.0), 9.0, 0.18, 0.6, 1.6, ${LAV_KVALITET ? 3 : 4}, nr, bb) >= 0.0) ssk = 0.08;
      sk *= mix(1.0, ssk, smoothstep(0.03, 0.08, uSol.y));
    }
    float i = max(dot(n, uSol), 0.0);
    vec3 V = normalize(-vRel);
    float ev = max(dot(n, V), 0.0);
    float lys = mix(i, 2.0 * i / (i + ev + 0.05), 0.3); // mat støv og sten (Lambert og lidt Lommel-Seeliger)
    vec3 ud = c * (sollys() * lys * sk + himmellys() * (0.55 + 0.45 * n.y) * ao);
    // Sten: lyset, som den solbeskinnede jord kaster op på siderne (ellers er skyggesiden næsten sort)
    if (stenU >= 0.0 || stenH0 > 0.0) ud += c * sollys() * max(uSol.y, 0.0) * 0.22 * (1.0 - n.y);
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
    // Skiven, en lille strålekrans og et bredere skær af støvet omkring Solen. Skæret står her, fordi gløden (bloom) er
    // slået fra, mens man står (L1)
    c += solFarve * skive * 14.0 + solFarve * (0.5 * exp(-vinkel * 50.0) + 0.06 * exp(-vinkel * 9.0)) * smoothstep(-0.02, 0.02, uSol.y);
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

// Ambient occlusion (M8c del 3 trin 2): hvor meget af himlen der ses fra hver pixel i et lag. Horisonten i 8 retninger
// (6 skridt hver, fra 1 til 32 pixel ud), regnet én gang pr. sted (Solen er ligegyldig). Lavninger og sprækker ser
// mindre af himlen og får derfor mindre af himlens lys.
const AO_FRAGMENT = /* glsl */ `
  uniform vec4 bLag;
  uniform float uPx;
  varying vec2 vUv;
  ${LAG_GLSL}
  void main() {
    vec2 en = bLag.xy + vUv / bLag.zw;
    float h0 = hoejde(en, uPx);
    float sum = 0.0;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.7854 + 0.39;
      vec2 ret = vec2(cos(a), sin(a));
      float maks = 0.0;
      float t = uPx;
      for (int j = 0; j < 6; j++) {
        maks = max(maks, (hoejde(en + ret * t, t * 0.3) - h0) / t);
        t *= 2.0;
      }
      sum += maks / sqrt(1.0 + maks * maks); // sinus til horisontens højde
    }
    gl_FragColor = vec4(1.0 - sum / 8.0);
  }`;

// Nettet i ringe: punkt 0 er midten, så kommer ringene fra 0,3 m til MAKS. Det er delt i STYKKER lagkagestykker
// (G1 trin 3, forslag H), så de stykker, der ligger uden for billedet, ikke tegnes: Vertex-shaderen slår højden op fem
// gange i hvert punkt, og med tablet-udgaven i testbrowseren var nettet ca. halvdelen af tiden pr. billede. Kigger man
// vandret, tegnes kun ca. en fjerdedel. Hvert stykke har sin egen midte og deler kanten med naboen (ingen huller).
const STYKKER = 16;
function lavStykker(retninger, ringe) {
  const q = Math.pow(MAKS / 0.3, 1 / (ringe - 1));
  const n = retninger / STYKKER; // retninger pr. stykke (plus kanten mod naboen)
  const stykker = [];
  for (let s = 0; s < STYKKER; s++) {
    const polar = new Float32Array((1 + (n + 1) * ringe) * 2);
    for (let j = 0; j < ringe; j++) {
      const r = 0.3 * Math.pow(q, j);
      for (let i = 0; i <= n; i++) {
        const k = 1 + j * (n + 1) + i;
        polar[k * 2] = ((s * n + i) / retninger) * Math.PI * 2;
        polar[k * 2 + 1] = r;
      }
    }
    const indeks = [];
    for (let i = 0; i < n; i++) indeks.push(0, 1 + i + 1, 1 + i);
    for (let j = 0; j < ringe - 1; j++) {
      for (let i = 0; i < n; i++) {
        const a = 1 + j * (n + 1) + i, b = a + 1;
        const c = a + n + 1, d = b + n + 1;
        indeks.push(a, b, c, b, d, c);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('polar', new THREE.BufferAttribute(polar, 2));
    // position er nødvendig for Three.js, men bruges ikke (vertex-shaderen regner punkterne ud)
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(polar.length / 2 * 3), 3));
    geo.setIndex(new THREE.BufferAttribute(new Uint32Array(indeks), 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), MAKS / 1000);
    stykker.push({ geo, midt: ((s + 0.5) / STYKKER) * Math.PI * 2 }); // midt: stykkets retning (fra nord mod øst)
  }
  return stykker;
}

// data: kraterets JSON fra lav_landskab.py. hent(navn, færdig, valg) fra js/solsystem/hent.js (Mars giver en, der
// henter med Stå på Mars som ejer, så billederne kan slettes fra grafikkortet, når man letter, se frigiv()).
// bredde: stedets bredde (grader) til Solens bane. deklination: Solens deklination (grader).
export function lavLandskab({ renderer, data, hent, krater, deklination = 0 }) {
  const gruppe = new THREE.Group();
  const maks = renderer.capabilities.maxTextureSize;
  const anisotropi = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const [retninger, ringe] = TEST_HURTIG ? [256, 300] : LAV_KVALITET ? [640, 640] : [1024, 900];
  const stykker = lavStykker(retninger, ringe);
  const tom = new THREE.DataTexture(new Uint8Array([128, 0, 0, 255]), 1, 1);
  tom.needsUpdate = true;
  const hvid = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  hvid.needsUpdate = true;
  const u = {
    uSted: { value: new THREE.Vector2() }, uH0: { value: 0 }, uSkridt: { value: (Math.PI * 2) / retninger },
    pxH: { value: new THREE.Vector4(1, 4, 16, 174) }, uKamH: { value: 0 },
    uSol: { value: new THREE.Vector3(0, 1, 0) }, uTau: { value: TAU }, uSkygger: { value: 0 },
    uStenArt: { value: krater === 'jezero' ? 1 : 0 },
    uAO: { value: 0 }, uNaer: { value: 1 }, uMellem: { value: 1 }, uKam: { value: new THREE.Vector3() }, uKamOp: { value: ØJE },
    tFarve: { value: tom }, bFarve: { value: new THREE.Vector4(0, 0, 1, 1) }, bF3: { value: new THREE.Vector4(0, 0, 1, 1) },
  };
  for (let k = 0; k < 4; k++) {
    u[`tH${k}`] = { value: tom };
    u[`tF${k}`] = { value: tom };
    u[`tS${k}`] = { value: hvid };
    u[`tA${k}`] = { value: hvid };
    u[`bH${k}`] = { value: new THREE.Vector4(-1e9, -1e9, 1e-12, 1e-12) };
    u[`rH${k}`] = { value: new THREE.Vector2(0, 0) };
  }
  const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERTEX, fragmentShader: FRAGMENT });
  mat.extensions = { derivatives: true };
  // Jorden: ét net pr. stykke med samme materiale. Lige før et stykke tegnes, tjekkes det, om stykkets retninger (set
  // ovenfra) ligger uden for de retninger, billedet dækker. Så tegnes det ikke (drawRange). Kameraet står lige over
  // midten (højst ca. 10 cm ved siden af, for man drejer om et punkt foran det), så det er nok at se på retningerne
  // til billedets fire hjørner. Kigger man næsten lodret ned eller op, tegnes alle. Det sker i onBeforeRender, for her
  // er kameraet flyttet færdigt i dette billede.
  const mat4 = new THREE.Matrix4();
  const kamLok = new THREE.Vector3();
  const hj = new THREE.Vector3();
  const HJØRNER = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const vinkler = [0, 0, 0, 0];
  const stigende = (a, b) => a - b;
  const HALV = Math.PI / STYKKER + THREE.MathUtils.degToRad(8); // et halvt stykke plus en margen
  const NED = Math.sin(THREE.MathUtils.degToRad(55)); // et hjørne mere end 55° under vandret: tegn alle
  const synlige = { midt: 0, halv: Math.PI, billede: -1 }; // retningerne, billedet dækker (midten og den halve bredde)
  let tegnet = 0; // antal stykker tegnet i dette billede (til tests, nulstilles i opdater)
  const vinkelForskel = (a, b) => Math.abs(((a - b + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
  function regnSynlige(kamera, m) {
    // Kameraets plads i nettet (km), og fra billedets koordinater (-1..1) til nettets
    kamLok.setFromMatrixPosition(kamera.matrixWorld).applyMatrix4(mat4.copy(m.matrixWorld).invert());
    mat4.multiplyMatrices(kamera.projectionMatrix, kamera.matrixWorldInverse).multiply(m.matrixWorld).invert();
    let alle = false;
    for (let i = 0; i < 4; i++) {
      hj.set(HJØRNER[i][0], HJØRNER[i][1], 0.5).applyMatrix4(mat4).sub(kamLok).normalize();
      if (hj.y < -NED) alle = true;
      vinkler[i] = Math.atan2(hj.x, -hj.z); // fra nord mod øst
    }
    // Det mindste udsnit af cirklen, der rummer de fire retninger: det modsatte af det største hul mellem dem. Er
    // hullet under en halv omgang, står lodret op eller ned inde i billedet, og så ses alle retninger.
    const v = vinkler.sort(stigende);
    let hul = 0, efter = 0;
    for (let i = 0; i < 4; i++) {
      const g = i < 3 ? v[i + 1] - v[i] : v[0] + 2 * Math.PI - v[3];
      if (g > hul) { hul = g; efter = i; }
    }
    if (alle || hul < Math.PI) {
      synlige.halv = Math.PI;
      return;
    }
    const start = v[(efter + 1) % 4];
    const bredde = 2 * Math.PI - hul;
    synlige.midt = start + bredde / 2;
    synlige.halv = bredde / 2;
  }
  stykker.forEach(({ geo, midt }) => {
    const m = new THREE.Mesh(geo, mat);
    m.frustumCulled = false;
    m.onBeforeRender = (r, sc, kamera) => {
      const nr = r.info.render.frame;
      if (synlige.billede !== nr) { regnSynlige(kamera, m); synlige.billede = nr; }
      const ses = synlige.halv >= Math.PI || vinkelForskel(midt, synlige.midt) <= synlige.halv + HALV;
      geo.drawRange.count = ses ? Infinity : 0;
      if (ses) tegnet++;
    };
    gruppe.add(m);
  });

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
  // Gå til et sted: hent lagene (lag 2 og 3 deles af stederne ved samme krater) og kald klar, når alle er hentet.
  // læg(teksturer, videre): lægger de nye kort i grafikkortet lidt ad gangen (mars.js, G1 trin 3, del 3), før de
  // bruges. Ellers skete det hele i det første billede af landskabet (ca. 1,2 s på tabletten ved Jezero).
  function gåTil(id, klar, læg = (teksturer, videre) => videre()) {
    const st = data.steder[id];
    const mit = ++hentId;
    const lag = [data.lag[`${id}0`], data.lag[`${id}1`], data.lag['2'], data.lag['3']];
    const px = TEST_HURTIG ? [512, 512, 512, 1024] : [2048, 2048, 4096, 2048];
    const ny = {}; // teksturerne skiftes først, når alle er hentet (ellers hopper jorden et øjeblik)
    let mangler = 1;
    const ét = () => {
      if (--mangler > 0 || mit !== hentId) return;
      læg(Object.values(ny).filter((t) => t?.isTexture), () => { if (mit === hentId) skift(); });
    };
    const skift = () => {
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
      nyeSkygger(false, true);
      aoKø = [3, 2, 1, 0];
      u.uAO.value = 0;
      klar?.();
    };
    lag.forEach((L, k) => {
      mangler += 2;
      hent(`${L.global ? '' : 'landskab/'}${højdeNavn(L.højde, L.global)}`, (t) => {
        ny[`tH${k}`] = t;
        if (k === 0) ny.h0Billede = t.image;
        ét();
      }, { farve: false, kanaler: 2, rundt: false, fejl: ét, vendt: true });
      hent(`landskab/${fotoNavn(L.foto, k)}`, (t) => { ny[`tF${k}`] = t; ét(); }, { farve: false, kanaler: 1, anisotropi, rundt: false, fejl: ét, vendt: true });
    });
    mangler++;
    hent(`mars-${krater}-farve.jpg`, (t) => { ny.tFarve = t; ét(); }, { rundt: false, fejl: ét, vendt: true });
    ét(); // (den første tæller: så kan ét() først nå nul, når alle hentninger er sat i gang)
  }

  // Højden under kameraet (m), læst i lag 0's billede (midten er stedet). Billedet er et vendt ImageBitmap (hent(…,
  // { vendt })), hvor syd står øverst, eller et <img> med nord øverst, hvis browseren ikke kan vende.
  const lærred = document.createElement('canvas');
  function højdeVedSted() {
    const img = hentet.h0;
    if (!img) return 0;
    const L = lagData[0];
    const fx = (u.uSted.value.x - L.øst[0]) / (L.øst[1] - L.øst[0]);
    const nord = (u.uSted.value.y - L.nord[0]) / (L.nord[1] - L.nord[0]);
    const fy = img.vendt ? nord : 1 - nord;
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
  const lavMål = (n) => new THREE.WebGLRenderTarget(n, n, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, generateMipmaps: false });
  // To kort pr. lag (G1 trin 3, del 3): Skyggerne regnes i det ene, mens det andet vises, og de byttes, når laget er
  // regnet færdigt (i strimler, se regnTrin).
  const lavPar = (n) => [lavMål(n), lavMål(n)];
  const mål = skyggeStr.map(lavPar);
  // Grove skygger på tablet (G1 trin 3, forslag H): Mens Solen flytter sig (dagen går, skyderen eller "Solnedgang"),
  // regnes skyggerne igen hele tiden. Det kostede ca. en tredjedel ekstra pr. billede, når Solen står lavt. På tablet
  // regnes de da i halv opløsning (en fjerdedel af prisen, lidt blødere kanter), og når Solen har stået stille i
  // SKARP_EFTER billeder, regnes de skarpt igen.
  const grovMål = LAV_KVALITET ? skyggeStr.map((n) => lavPar(n / 2)) : null;
  const GROV_INDEN = 60; // billeder: flytter Solen sig igen inden da, efter skyggerne sidst blev regnet færdig, bliver de grove
  const SKARP_EFTER = 20; // billeder uden at Solen flytter sig, før de grove skygger regnes skarpt igen
  // Skyggerne i strimler (G1 trin 3, del 3, jeres valg 14. november 2026): Et helt lag i ét billede kostede 50-90 ms
  // på tabletten, mens Solen flyttede sig (strålen mod Solen følges op til 110 trin for hver pixel). Nu regnes højst
  // STRIMMEL pixel pr. billede, og laget skiftes ind, når alle strimlerne er regnet. Skyggerne er de samme, men følger
  // Solen i små trin (en runde med alle fire lag tager ca. 20 billeder med de grove skygger på tablet, 80 med de
  // skarpe og 16 på pc).
  const STRIMMEL = TEST_HURTIG ? 128 * 128 : LAV_KVALITET ? 128 * 256 : 512 * 512;
  const su = { bLag: { value: new THREE.Vector4() }, uPx: { value: 1 }, uSolL: { value: new THREE.Vector3() }, uHMaks: { value: 2000 } };
  for (let k = 0; k < 4; k++) Object.assign(su, { [`tH${k}`]: u[`tH${k}`], [`bH${k}`]: u[`bH${k}`], [`rH${k}`]: u[`rH${k}`] });
  su.pxH = u.pxH;
  const skyggeMat = new THREE.ShaderMaterial({ uniforms: su, vertexShader: SKYGGE_VERTEX, fragmentShader: SKYGGE_FRAGMENT, depthTest: false, depthWrite: false });
  const skyggeScene = new THREE.Scene();
  skyggeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), skyggeMat));
  const skyggeKamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  // Ambient occlusion: ét kort pr. lag (halv opløsning er nok, det er bløde overgange), regnet ét lag ad gangen, når
  // et nyt sted er lagt ind (aoKø), før skyggerne. uAO er 0, indtil alle fire er regnet.
  const aoStr = TEST_HURTIG ? 128 : 512;
  const aoMål = [0, 1, 2, 3].map(() => lavMål(aoStr));
  const aoU = { bLag: { value: new THREE.Vector4() }, uPx: { value: 1 } };
  for (let k = 0; k < 4; k++) Object.assign(aoU, { [`tH${k}`]: u[`tH${k}`], [`bH${k}`]: u[`bH${k}`], [`rH${k}`]: u[`rH${k}`] });
  aoU.pxH = u.pxH;
  const aoMat = new THREE.ShaderMaterial({ uniforms: aoU, vertexShader: SKYGGE_VERTEX, fragmentShader: AO_FRAGMENT, depthTest: false, depthWrite: false });
  const aoScene = new THREE.Scene();
  aoScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), aoMat));
  let aoKø = [];
  function regnAO() {
    const k = aoKø.pop();
    const L = lagData[k];
    if (L) {
      bounds(aoU.bLag.value, L.øst, L.nord);
      aoU.uPx.value = (L.øst[1] - L.øst[0]) / aoStr;
      const før = renderer.getRenderTarget();
      renderer.setRenderTarget(aoMål[k]);
      renderer.render(aoScene, skyggeKamera);
      renderer.setRenderTarget(før);
      u[`tA${k}`].value = aoMål[k].texture;
    }
    if (!aoKø.length) u.uAO.value = 1;
  }
  const regnetSol = new THREE.Vector3(0, -1, 0);
  let skyggeKø = [];
  let igang = null; // { k, m, i, n }: laget k regnes i kortet m, strimmel i af n
  const regner = () => skyggeKø.length > 0 || igang !== null;
  let sidstStrimler = 0; // (til tests)
  let grov = false; // skyggerne regnes (eller er regnet) i halv opløsning
  let billederSiden = Infinity; // billeder, siden en runde med skygger startede eller blev færdig
  let heleLag = false; // et nyt sted: hele lag ad gangen (det sker under tonen, og skyggerne skal passe med det samme)
  function nyeSkygger(g = false, hele = false) {
    skyggeKø = [3, 2, 1, 0];
    heleLag = hele;
    igang = null; // (en halvt regnet runde smides væk: dens kort vises ikke)
    regnetSol.copy(u.uSol.value);
    grov = g;
    billederSiden = 0;
    globalThis.atomlabMåler?.(g ? 'skyggerne regnes (grove, Solen flytter sig)' : 'skyggerne regnes');
  }
  // Regn én strimmel af det næste lag (hele: hele laget på én gang, fx før landskabet vises). Hele runden bruger Solen,
  // som den stod, da runden startede (regnetSol), så strimlerne passer sammen.
  function regnTrin(hele = false) {
    if (!igang) {
      const k = skyggeKø.pop();
      const L = lagData[k];
      if (!L) return;
      const par = (grov ? grovMål : mål)[k];
      const m = par[0].texture === u[`tS${k}`].value ? par[1] : par[0]; // det, der ikke vises
      igang = { k, m, i: 0, n: hele ? 1 : Math.max(1, Math.round((m.width * m.height) / STRIMMEL)) };
      sidstStrimler = igang.n;
    }
    const { k, m, n } = igang;
    const L = lagData[k];
    bounds(su.bLag.value, L.øst, L.nord);
    su.uPx.value = (L.øst[1] - L.øst[0]) / m.width;
    su.uSolL.value.set(regnetSol.x, -regnetSol.z, regnetSol.y);
    su.uHMaks.value = data.hMaks;
    const y0 = Math.floor((igang.i * m.height) / n), y1 = Math.floor(((igang.i + 1) * m.height) / n);
    m.scissor.set(0, y0, m.width, y1 - y0);
    m.scissorTest = n > 1;
    const før = renderer.getRenderTarget();
    renderer.setRenderTarget(m);
    renderer.render(skyggeScene, skyggeKamera);
    renderer.setRenderTarget(før);
    if (++igang.i < n) return;
    igang = null;
    u[`tS${k}`].value = m.texture;
    if (k === 0) u.uSkygger.value = 1;
    if (!skyggeKø.length) billederSiden = 0; // (runden er færdig)
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
    // (Flytter Solen sig midt i en skarp runde på tablet, startes forfra med grove skygger: En skarp runde i strimler
    // tager ca. 80 billeder, og ellers ville skyggerne følge Solen meget langsomt.)
    const flyttet = stedId && regnetSol.angleTo(u.uSol.value) > 0.004;
    if (flyttet && (!regner() || (grovMål && !grov && !heleLag))) nyeSkygger(Boolean(grovMål) && billederSiden < GROV_INDEN);
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
      tegnet = 0;
      u.uKamH.value = u.uH0.value + kamera.position.y * 1000;
      u.uKam.value.copy(kamera.position).multiplyScalar(1000);
      u.uKamOp.value = kamera.position.y * 1000;
      billederSiden++;
      if (grov && !regner() && billederSiden > SKARP_EFTER) nyeSkygger(false); // Solen står stille igen
      if (aoKø.length) regnAO();
      else if (regner()) regnTrin(heleLag);
    },
    // Før landskabet vises (G1 trin 3, del 3): regn ét helt skyggelag. Giver true, når alle lag er regnet.
    forbered() {
      if (aoKø.length) { regnAO(); return false; }
      if (regner()) regnTrin(true);
      return !regner();
    },
    // Højden under stedet (m over nulpunktet)
    get højde() { return u.uH0.value; },
    // Kun til tests
    // (til målinger: hver del af stenene og ambient occlusion til og fra)
    stenTest({ naer = true, mellem = true, ao = true } = {}) { u.uNaer.value = naer ? 1 : 0; u.uMellem.value = mellem ? 1 : 0; u.uAO.value = ao && !aoKø.length ? 1 : 0; },
    test: () => ({ sted: stedId, tid: timer, højde: u.uH0.value, net: [retninger, ringe], stykker: [tegnet, STYKKER], skygger: u.uSkygger.value, ao: u.uAO.value, groveSkygger: grov, strimler: sidstStrimler, regner: regner(), solHøjde: THREE.MathUtils.radToDeg(Math.asin(u.uSol.value.y)), måner: hu.uMaane.value.map((m) => ({ højde: THREE.MathUtils.radToDeg(Math.asin(m.y)), kompas: (THREE.MathUtils.radToDeg(Math.atan2(m.x, -m.z)) + 360) % 360, bredde: THREE.MathUtils.radToDeg(2 * m.w) })) }),
    // Billederne bruges ikke mere (man er lettet, G1 trin 3): slip dem, så de kan slettes fra grafikkortet. Nettet og
    // shaderne bliver, og gåTil henter billederne igen næste gang.
    frigiv() {
      hentId++;
      stedId = null;
      skyggeKø = [];
      aoKø = [];
      igang = null;
      hentet.h0 = null;
      for (const n of Object.keys(u)) if (u[n].value?.isTexture && /^t(H|F)\d$|^tFarve$/.test(n)) u[n].value = tom;
    },
    stop() {
      for (const { geo } of stykker) geo.dispose();
      mat.dispose();
      himmel.geometry.dispose();
      himmelMat.dispose();
      skyggeMat.dispose();
      for (const m of [...mål, ...(grovMål ?? [])].flat()) m.dispose();
      for (const m of aoMål) m.dispose();
      aoMat.dispose();
      tom.dispose();
      hvid.dispose();
    },
  };
}
