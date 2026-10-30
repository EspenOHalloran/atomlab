// En klippeplanet med rigtige højder (først Mars). Kuglen er et fint net, der løftes efter højdekortet i
// vertex-shaderen, så bjergene rager op over horisonten, og kløfter og kratere ligger lavere. Lyset regnes med
// bjergenes skrå sider (ud fra det samme højdekort), så de kaster lys og skygge, når Solen står lavt.
//
// Kortene ligger som Jordens: længdegrad 0° i midten (retningen +x i kuglen), øst til højre (mod −z) og nord opad (+y).
// Højdekortet har 16 bit i rød og grøn (se billeder/solsystem/lav_mars.py).
// Radier og højder regnes i kuglens egne enheder (1 = radius ved ækvator), så det virker, når systemet er skaleret.
//
// Højderne ligger også i en tabel i JS (den højeste værdi i hvert felt), så kameraet kan holdes over bjergene
// (overflade) og et sted kan findes på kuglen (sted).
//
// Over et sted kan der ligge et lokalt net med sit eget, skarpere højdekort og farvekort (lokalt, Mars M7a), og inden
// for det et detaljekort med endnu skarpere højder (detalje), der hentes, når man skal helt tæt på.

import * as THREE from 'three';
import { SKY_GLSL } from './skyer.js';

// Det, kuglen og de lokale net har til fælles: højden fra et kort og hældningen af bjergenes sider
const HOEJDE_GLSL = /* glsl */ `
  uniform float hMin;      // laveste højde i kortet (i radier)
  uniform float hSpan;     // fra laveste til højeste (i radier)
  uniform float overdriv;  // 1 = rigtige højder
  uniform float flad;      // polradius / radius ved ækvator
  const float OMGANG = 6.2831853;
  float hoejdeAf(sampler2D t, vec2 uv) {
    vec2 v = texture2D(t, uv).rg;
    return v.x * (65280.0 / 65535.0) + v.y * (255.0 / 65535.0);
  }
  #ifdef DETALJE
  // Detaljekortet (et skarpere højdekort i en del af det lokale net). lod: niveauet i kortets mipmaps, så nettets
  // punkter får middelhøjden omkring sig og ikke tilfældige toppe og bunde fra det skarpe kort.
  uniform sampler2D detaljeHoejde;
  uniform float harDetalje;
  uniform vec4 detaljeBoks;  // detaljekortets grænser i stedets uv
  uniform vec2 detaljeKant;  // overgangen i detaljekortets uv
  float hoejdeLod(sampler2D t, vec2 uv, float lod) {
    vec2 v = textureLod(t, uv, lod).rg;
    return v.x * (65280.0 / 65535.0) + v.y * (255.0 / 65535.0);
  }
  // Hvor meget detaljekortet bruges (0 udenfor, 1 inde bag overgangen), og stedet i detaljekortet (d)
  float detaljeVaegt(vec2 lok, out vec2 d) {
    d = (lok - detaljeBoks.xy) / (detaljeBoks.zw - detaljeBoks.xy);
    vec2 e = min(d, 1.0 - d) / detaljeKant;
    return harDetalje > 0.5 ? smoothstep(0.0, 1.0, clamp(min(e.x, e.y), 0.0, 1.0)) : 0.0;
  }
  #endif
  // Bjergenes skrå sider: hvor meget højden ændrer sig pr. strækning mod øst og nord (begge i radier). tx er en pixel i
  // kortet, og spaend er, hvor mange radianer hele kortet dækker mod øst og nord.
  vec2 haeldning(sampler2D t, vec2 uv, vec2 tx, vec2 spaend, float cosB) {
    float dO = hoejdeAf(t, uv + vec2(tx.x, 0.0)) - hoejdeAf(t, uv - vec2(tx.x, 0.0));
    float dN = hoejdeAf(t, uv + vec2(0.0, tx.y)) - hoejdeAf(t, uv - vec2(0.0, tx.y));
    float s = hSpan * overdriv;
    return vec2(dO * s / (2.0 * tx.x * spaend.x * max(cosB, 0.02)), dN * s / (2.0 * tx.y * spaend.y));
  }`;

const VERTEX = /* glsl */ `
  uniform sampler2D hoejde;
  uniform float harHoejde;
  ${HOEJDE_GLSL}
  varying vec2 vUv;
  varying vec3 vObjN;
  varying vec3 vVerden;
  varying float vTynd;
  uniform float luftH;
  void main() {
    vUv = uv;
    vec3 n = normalize(position);
    vObjN = n;
    float h = harHoejde > 0.5 ? hMin + hSpan * hoejdeAf(hoejde, uv) : 0.0;
    vTynd = exp(-max(h, 0.0) / luftH);
    vec3 p = n * vec3(1.0, flad, 1.0) + n * h * overdriv;
    vec4 v = modelMatrix * vec4(p, 1.0);
    vVerden = v.xyz;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;

// Et lokalt net over et sted (fx Olympus Mons): et gitter i bredde og længde med sit eget, skarpere højdekort.
// Ved kanten glider det over i kuglens net, så de mødes uden sprækker: Inderst bruges det lokale kort, og helt ude ved
// kanten ligger nettet præcis på kuglens trekanter (regnet som i THREE.SphereGeometry, med de samme punkter og højder).
// Kanten har et skørt, der hænger lidt ned, så små huller mellem de to net ikke kan ses.
const VERTEX_LOKAL = /* glsl */ `
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform sampler2D lokalHoejde;
  uniform vec4 boks;         // stedets grænser i kuglens uv (u0, v0, u1, v1)
  uniform vec2 kant;         // overgangens bredde i stedets uv
  uniform vec2 netKugle;     // kuglens net: felter omkring og fra pol til pol
  uniform float skoertDybde; // hvor langt skørtet hænger ned (i radier)
  #ifdef DETALJE
  uniform float detaljeLod;
  #endif
  attribute float skoert;
  attribute vec3 kugle;      // punktet på kuglens trekant her uden bjerge (regnet i JS: sin og cos i shaderen er for unøjagtige)
  ${HOEJDE_GLSL}
  varying vec2 vUv;
  varying vec2 vLok;
  varying float vVaegt;
  varying vec3 vObjN;
  varying vec3 vVerden;
  varying float vTynd;
  uniform float luftH;
  // Højden i et punkt i kuglens net (søjle og række fra nordpolen)
  float kugleHoejde(vec2 i) {
    return hMin + hSpan * hoejdeAf(hoejde, vec2(i.x / netKugle.x, 1.0 - i.y / netKugle.y));
  }
  void main() {
    vUv = uv;
    vLok = (uv - boks.xy) / (boks.zw - boks.xy);
    vec2 e = min(vLok, 1.0 - vLok) / kant;
    float w = smoothstep(0.0, 1.0, clamp(min(e.x, e.y), 0.0, 1.0));
    vVaegt = w;
    vec3 n = normalize(position);
    vObjN = n;
    #ifdef DETALJE
    // Inde i detaljekortet læses kun det (det sparer tid), og i overgangen begge
    vec2 d;
    float wd = detaljeVaegt(vLok, d);
    float h = wd < 1.0 ? hMin + hSpan * hoejdeAf(lokalHoejde, vLok) : 0.0;
    if (wd > 0.0) h = mix(h, hMin + hSpan * hoejdeLod(detaljeHoejde, d, detaljeLod), wd);
    #else
    float h = hMin + hSpan * hoejdeAf(lokalHoejde, vLok);
    #endif
    vec3 p = n * vec3(1.0, flad, 1.0) + n * h * overdriv;
    float hL = h; // til støvet i luften
    if (w < 1.0) {
      // Kuglens overflade her: den trekant i kuglens net, punktet ligger i (diagonalen går fra nordvest til sydøst).
      // Højderne i trekantens hjørner lægges langs n (i stedet for hjørnernes egne retninger, det flytter punktet højst
      // nogle få meter til siden).
      vec2 g = vec2(uv.x * netKugle.x, (1.0 - uv.y) * netKugle.y);
      vec2 i0 = floor(g);
      vec2 f = g - i0;
      float hb = kugleHoejde(i0), hd = kugleHoejde(i0 + 1.0);
      float hK = f.x >= f.y
        ? hb * (1.0 - f.x) + kugleHoejde(i0 + vec2(1.0, 0.0)) * (f.x - f.y) + hd * f.y
        : hb * (1.0 - f.y) + kugleHoejde(i0 + vec2(0.0, 1.0)) * (f.y - f.x) + hd * f.x;
      if (harHoejde < 0.5) hK = 0.0;
      p = mix(kugle + n * hK * overdriv, p, w);
      hL = mix(hK, h, w);
    }
    vTynd = exp(-max(hL, 0.0) / luftH);
    p -= n * skoert * skoertDybde;
    vec4 v = modelMatrix * vec4(p, 1.0);
    vVerden = v.xyz;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;

// Lyset, luften, isen og skyernes skygge (fælles for kuglen og de lokale net). n0 er retningen fra midten, nr
// retningen vinkelret på bjergsiden (begge i kuglens egne retninger), og c farven.
const LYS_GLSL = /* glsl */ `
  uniform mat3 rot;        // kuglens drejning (fra dens egne retninger til verdens)
  uniform vec3 uSol;       // retningen mod Solen (i verden)
  uniform vec3 tusFarve;   // farven på lyset i tusmørket og på støvet i luften
  uniform float tusSin;    // hvor langt ind i natten tusmørket når (sinus til vinklen)
  uniform float sloer;     // hvor meget støvet i luften slører kloden mod kanten
  uniform float luftH;     // luftens skalahøjde (i radier)
  uniform float skala;     // kuglens radius i verden
  uniform float skyH;      // skyernes højde over kuglen (i radier)
  varying vec3 vVerden;
  varying float vTynd;     // hvor tynd luften er ved stedet (1 ved nulpunktet og lavere)
  #ifdef SKYER
  SKY_GLSL_HER
  #endif
  vec3 belys(vec3 n0, vec3 nr, vec3 c) {
    vec3 N = normalize(rot * n0);
    vec3 Nr = normalize(rot * nr);
    vec3 V = normalize(cameraPosition - vVerden);
    #ifdef IS
    // Polkapperne: Kortet viser isen lidt rosa og mat. Lyse steder uden meget rødt tæt på polerne gøres hvidere.
    float lum = dot(c, vec3(0.3, 0.59, 0.11));
    float isen = smoothstep(0.6, 0.76, c.b / max(c.r, 0.01)) * smoothstep(0.25, 0.42, lum) * smoothstep(0.82, 0.9, abs(n0.y));
    c = mix(c, vec3(lum * 1.12) * vec3(0.97, 0.99, 1.02), isen * 0.8);
    #endif
    float i = max(dot(Nr, uSol), 0.0);
    float e = max(dot(N, V), 0.0);
    // Støv og sten: mest som en mat flade (Lambert), lidt som Månen (Lommel-Seeliger), så kanten ikke bliver for mørk
    float lys = mix(i, 2.0 * i / (i + e + 0.05), 0.3);
    // Ved grænsen mellem dag og nat slukker lyset blødt. Bjergsider, der vender mod Solen, lyser lidt længere ind i natten.
    float cosZ = dot(N, uSol);
    lys *= smoothstep(-0.02, 0.04, dot(mix(N, Nr, 0.6), uSol));
    #ifdef SKYER
    // Skyernes skygge: kig fra stedet mod Solen op til skyernes højde
    if (cosZ > 0.0 && skyAktiv > 0.5) {
      vec3 solObj = normalize(transpose(rot) * uSol);
      vec3 vandret = solObj - n0 * dot(solObj, n0);
      lys *= 1.0 - 0.45 * skyer(normalize(n0 + vandret * skyH / max(cosZ, 0.25)));
    }
    #endif
    vec3 ud = c * lys + c * 0.006;
    #ifdef LUFT
    // Tusmørket: Støv højt oppe i luften er stadig i sollys, når Solen er gået ned, og spreder lidt lys ind i natten
    float tus = smoothstep(-tusSin, 0.02, cosZ) * (1.0 - smoothstep(0.0, 0.12, cosZ));
    ud += c * tusFarve * tus * tus * tus * 0.12;
    // Himlens lys: Den støvede himmel lyser lidt ind i skyggerne om dagen (mest på flader, der vender opad)
    ud += c * 0.06 * smoothstep(-0.02, 0.25, cosZ) * (0.5 + 0.5 * dot(Nr, N));
    // Støvet i luften: Mod kanten kigger man gennem mere luft, så kloden bliver lidt sløret og lysere brun
    // Luften mellem stedet og kameraet: Fra rummet er det hele luften over stedet (sloer / e). Er kameraet tæt på (inde i
    // luften), er det kun den del, der ligger på strækningen L. Højt oppe er luften tyndere (skalahøjden).
    float luftLys = smoothstep(-tusSin, 0.15, cosZ);
    float ee = max(e, 0.04);
    float L = length(cameraPosition - vVerden) / skala; // i radier
    float s = 1.0 - exp(-sloer / ee * (1.0 - exp(-L * ee / luftH)) * vTynd);
    ud = mix(ud, tusFarve * 0.32 * luftLys, s * 0.65);
    #endif
    return ud;
  }
  // Retningerne øst og nord på kuglen (nord = cross(n0, oest)). Giver cos til bredden.
  float oestNord(vec3 n0, out vec3 oest, out vec3 nord) {
    oest = vec3(n0.z, 0.0, -n0.x);
    float cosB = length(oest);
    oest = cosB > 1e-4 ? oest / cosB : vec3(0.0, 0.0, -1.0);
    nord = cross(n0, oest);
    return cosB;
  }`;


const FRAGMENT = /* glsl */ `
  uniform sampler2D kort;
  uniform float harKort;
  uniform vec3 farve;      // farven, indtil kortet er hentet
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform vec2 texel;      // en pixel i højdekortet (u, v)
  #if HULLER > 0
  uniform vec4 huller[HULLER]; // de lokale nets grænser i uv: dér tegnes kuglen ikke (0 = intet hul)
  #endif
  ${HOEJDE_GLSL}
  ${LYS_GLSL}
  varying vec2 vUv;
  varying vec3 vObjN;
  void main() {
    #if HULLER > 0
    for (int k = 0; k < HULLER; k++) {
      vec4 b = huller[k];
      if (vUv.x > b.x && vUv.x < b.z && vUv.y > b.y && vUv.y < b.w) discard;
    }
    #endif
    vec3 n0 = normalize(vObjN);
    vec3 oest, nord;
    float cosB = oestNord(n0, oest, nord);
    vec2 g = harHoejde > 0.5 ? haeldning(hoejde, vUv, texel, vec2(OMGANG, OMGANG * 0.5), cosB) : vec2(0.0);
    vec3 c = harKort > 0.5 ? texture2D(kort, vUv).rgb : farve;
    gl_FragColor = vec4(belys(n0, normalize(n0 - g.x * oest - g.y * nord), c), 1.0);
  }`;

const FRAGMENT_LOKAL = /* glsl */ `
  uniform sampler2D kort;
  uniform float harKort;
  uniform vec3 farve;
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform vec2 texel;
  uniform sampler2D lokalKort;
  uniform float harLokalKort;
  uniform sampler2D lokalHoejde;
  uniform vec2 lokalTexel;   // en pixel i det lokale højdekort
  uniform vec2 lokalSpaend;  // hvor mange radianer stedet dækker mod øst og nord
  #ifdef DETALJE
  uniform vec2 detaljeTexel;
  uniform vec2 detaljeSpaend;
  #endif
  ${HOEJDE_GLSL}
  ${LYS_GLSL}
  varying vec2 vUv;
  varying vec2 vLok;
  varying float vVaegt;
  varying vec3 vObjN;
  void main() {
    vec3 n0 = normalize(vObjN);
    vec3 oest, nord;
    float cosB = oestNord(n0, oest, nord);
    // Ved kanten glider hældningen og farven over i kuglens
    #ifdef DETALJE
    vec2 d;
    float wd = detaljeVaegt(vLok, d);
    vec2 g = wd < 1.0 ? haeldning(lokalHoejde, vLok, lokalTexel, lokalSpaend, cosB) : vec2(0.0);
    if (wd > 0.0) g = mix(g, haeldning(detaljeHoejde, d, detaljeTexel, detaljeSpaend, cosB), wd);
    #else
    vec2 g = haeldning(lokalHoejde, vLok, lokalTexel, lokalSpaend, cosB);
    #endif
    vec3 c = harLokalKort > 0.5 ? texture2D(lokalKort, vLok).rgb : harKort > 0.5 ? texture2D(kort, vUv).rgb : farve;
    if (vVaegt < 0.999) {
      vec2 gK = harHoejde > 0.5 ? haeldning(hoejde, vUv, texel, vec2(OMGANG, OMGANG * 0.5), cosB) : vec2(0.0);
      g = mix(gK, g, vVaegt);
      vec3 cK = harKort > 0.5 ? texture2D(kort, vUv).rgb : farve;
      c = mix(cK, c, vVaegt);
    }
    gl_FragColor = vec4(belys(n0, normalize(n0 - g.x * oest - g.y * nord), c), 1.0);
  }`;

// Højdetabellen: højst størrelse[0] × størrelse[1] felter, hvert med den højeste højde (i radier) fra højdekortet i
// feltet. Billedet læses i strimler med en pause imellem (ca. 10 ms ad gangen), så billedet ikke fryser imens.
function lavTabel(billede, hMin, hSpan, størrelse, færdig) {
  const B = Math.min(størrelse[0], billede.width), H = Math.min(størrelse[1], billede.height);
  const fx = billede.width / B, fy = billede.height / H;
  const v = new Float32Array(B * H).fill(-1);
  const c = document.createElement('canvas');
  const STRIMMEL = 64;
  c.width = billede.width;
  c.height = STRIMMEL;
  const g = c.getContext('2d', { willReadFrequently: true });
  let y0 = 0;
  const strimmel = () => {
    const h = Math.min(STRIMMEL, billede.height - y0);
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(billede, 0, -y0);
    const px = g.getImageData(0, 0, c.width, h).data;
    for (let y = 0; y < h; y++) {
      const række = Math.min(H - 1, Math.floor((y0 + y) / fy)) * B;
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        const j = række + Math.min(B - 1, Math.floor(x / fx));
        const værdi = (px[i] * 256 + px[i + 1]) / 65535;
        if (værdi > v[j]) v[j] = værdi;
      }
    }
    y0 += STRIMMEL;
    if (y0 < billede.height) {
      setTimeout(strimmel, 0);
      return;
    }
    for (let j = 0; j < v.length; j++) v[j] = hMin + hSpan * v[j];
    færdig({ B, H, v });
  };
  strimmel();
}

// Tabellen gemmes på billedet, så den kun laves én gang (billedet bliver i grafikkortet, når planeten lukkes).
// færdig(tabel) kaldes, når den er klar (med det samme, hvis den allerede findes).
function tabelFor(t, hMin, hSpan, størrelse, færdig) {
  const nøgle = `${hMin}:${hSpan}:${størrelse}`;
  let gemt = t.userData.højdeTabel;
  if (gemt?.nøgle !== nøgle) {
    gemt = t.userData.højdeTabel = { nøgle, tabel: null, venter: [] };
    lavTabel(t.image, hMin, hSpan, størrelse, (ny) => {
      gemt.tabel = ny;
      for (const f of gemt.venter) f(ny);
      gemt.venter.length = 0;
    });
  }
  if (gemt.tabel) færdig(gemt.tabel);
  else gemt.venter.push(færdig);
}

// Højden i tabellen ved (x, y) i felter. maks: den højeste i felterne omkring (3 × 3), for nettet kan ligge højere end
// kortet mellem to punkter i nettet. Ellers glat mellem felternes midter. rundt: kortet går hele vejen rundt.
function slåOp({ B, H, v }, x, y, maks, rundt) {
  const søjle = (i) => (rundt ? (i + B) % B : THREE.MathUtils.clamp(i, 0, B - 1));
  if (maks) {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    let h = -Infinity;
    for (let dy = -1; dy <= 1; dy++) {
      const r = THREE.MathUtils.clamp(y0 + dy, 0, H - 1) * B;
      for (let dx = -1; dx <= 1; dx++) h = Math.max(h, v[r + søjle(x0 + dx)]);
    }
    return h;
  }
  const fx = rundt ? x - 0.5 : THREE.MathUtils.clamp(x - 0.5, 0, B - 1), fy = THREE.MathUtils.clamp(y - 0.5, 0, H - 1);
  const x0 = Math.floor(fx), y0 = Math.floor(fy), y1 = Math.min(H - 1, y0 + 1);
  const tx = fx - x0, ty = fy - y0;
  const a = søjle(x0), b = søjle(x0 + 1);
  return (v[y0 * B + a] * (1 - tx) + v[y0 * B + b] * tx) * (1 - ty) + (v[y1 * B + a] * (1 - tx) + v[y1 * B + b] * tx) * ty;
}

const glidende = (x) => { const t = THREE.MathUtils.clamp(x, 0, 1); return t * t * (3 - 2 * t); }; // som smoothstep(0, 1, x)

// radius og polRadius i km, skala i km pr. enhed. højdeMin og højdeMax i meter (de samme som i billedværktøjet).
// net: [omkring, fra pol til pol] (hvor fint nettet er)
// luft: { tusmørke (grader ind i natten), farve, slør, skalahøjde (km) } giver tusmørke og støv i luften. is: polkapperne gøres hvidere.
// skyer: skyerne fra js/solsystem/skyer.js, som kaster skygge på jorden.
export function lavKlippeplanet({ skala, radius, polRadius = radius, højdeMin, højdeMax, net = [1024, 512], farve = [0.6, 0.35, 0.2], luft = null, is = false, skyer = null }) {
  const R = radius / skala;
  const defines = { ...(luft && { LUFT: '' }), ...(is && { IS: '' }), ...(skyer && { SKYER: '' }) };
  const medSkyer = (glsl) => glsl.replace('SKY_GLSL_HER', skyer ? SKY_GLSL : '');
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      kort: { value: null },
      harKort: { value: 0 },
      farve: { value: new THREE.Vector3(...farve) },
      hoejde: { value: null },
      harHoejde: { value: 0 },
      texel: { value: new THREE.Vector2(1, 1) },
      hMin: { value: højdeMin / 1000 / radius },
      hSpan: { value: (højdeMax - højdeMin) / 1000 / radius },
      overdriv: { value: 1 },
      flad: { value: polRadius / radius },
      rot: { value: new THREE.Matrix3() },
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      tusFarve: { value: new THREE.Vector3(...(luft?.farve ?? [0, 0, 0])) },
      tusSin: { value: Math.sin(THREE.MathUtils.degToRad(luft?.tusmørke ?? 0)) },
      sloer: { value: luft?.slør ?? 0 },
      luftH: { value: (luft?.skalahøjde ?? 11) / radius },
      skyH: { value: skyer?.højde ?? 0 },
      huller: { value: [] },
      skala: { value: 1 },
      ...(skyer ? skyer.uniforms : {}),
    },
    defines: { ...defines, HULLER: 0 },
    vertexShader: VERTEX,
    fragmentShader: medSkyer(FRAGMENT),
  });
  const u = mat.uniforms;
  // Kuglens trekanter på kanten af de lokale net tegnes med et materiale, der har huller (discard), og trekanterne helt
  // inde under et lokalt net tegnes ikke, når nettet er klar. Resten tegnes uden huller, for discard gør shaderen
  // langsommere (grafikkortet kan ikke springe skjulte punkter over, før de er regnet).
  const matHul = new THREE.ShaderMaterial({ uniforms: u, defines: { ...defines, HULLER: 0 }, vertexShader: VERTEX, fragmentShader: medSkyer(FRAGMENT) });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, net[0], net[1]), [mat, matHul]);
  const alle = mesh.geometry.index.array.slice(); // kuglens trekanter
  mesh.geometry.addGroup(0, alle.length, 0);
  mesh.scale.setScalar(R);
  // Bjergene kan rage ud over kuglen (også når de er gjort højere), så den må ikke skæres fra for tidligt
  mesh.geometry.computeBoundingSphere();
  mesh.geometry.boundingSphere.radius = 1.1;
  mesh.onBeforeRender = () => {
    u.rot.value.setFromMatrix4(mesh.matrixWorld);
    u.skala.value = mesh.matrixWorld.getMaxScaleOnAxis();
  };
  const flad = polRadius / radius;
  let tabel = null;
  const lokale = []; // de lokale net (lokalt)
  const n = new THREE.Vector3();
  // Kuglens hul, hvor de lokale net er klar (et hul på 0 × 0 skjuler intet), og hvilke trekanter der tegnes
  let dele = null; // { uden, rand, inde: [antal under hvert lokalt net] } (trekanternes rækkefølge i kuglens liste)
  function opdaterHuller() {
    lokale.forEach((l, k) => { if (l.klar) u.huller.value[k].copy(l.hul); else u.huller.value[k].set(0, 0, 0, 0); });
    const g = mesh.geometry;
    g.clearGroups();
    g.addGroup(0, dele.uden, 0);
    g.addGroup(dele.uden, dele.rand, 1);
    let start = dele.uden + dele.rand;
    dele.inde.forEach((antal, k) => {
      if (!lokale[k].klar) g.addGroup(start, antal, 0);
      start += antal;
    });
  }
  // Højden (i radier, med overdriv) ved retningen n fra kuglens midte. maks: den højeste i felterne omkring,
  // ellers glat. Inden for et lokalt net bruges dets tabel, og ved kanten glider den over i kuglens.
  function højde(retning, maks) {
    if (!tabel) return 0;
    const længde = Math.atan2(-retning.z, retning.x); // længdegrad 0° i midten, øst til højre
    const bredde = Math.asin(THREE.MathUtils.clamp(retning.y, -1, 1));
    const x = ((længde / (2 * Math.PI) + 0.5) * tabel.B) % tabel.B;
    const y = (0.5 - bredde / Math.PI) * tabel.H; // nord øverst
    let h = slåOp(tabel, x, y, maks, true);
    for (const l of lokale) {
      if (!l.tabel) continue;
      const lx = (længde - l.vest) / (l.øst - l.vest), ly = (l.nord - bredde) / (l.nord - l.syd);
      if (lx <= 0 || lx >= 1 || ly <= 0 || ly >= 1) continue;
      const w = glidende(Math.min(lx / l.kant[0], (1 - lx) / l.kant[0], ly / l.kant[1], (1 - ly) / l.kant[1]));
      h += (slåOp(l.tabel, lx * l.tabel.B, ly * l.tabel.H, maks, false) - h) * w;
      const d = l.detalje;
      if (!d?.tabel) continue;
      const dx = (længde - d.vest) / (d.øst - d.vest), dy = (d.nord - bredde) / (d.nord - d.syd);
      if (dx <= 0 || dx >= 1 || dy <= 0 || dy >= 1) continue;
      const wd = glidende(Math.min(dx / d.kant[0], (1 - dx) / d.kant[0], dy / d.kant[1], (1 - dy) / d.kant[1]));
      h += (slåOp(d.tabel, dx * d.tabel.B, dy * d.tabel.H, maks, false) - h) * wd;
    }
    return h * u.overdriv.value;
  }
  return {
    mesh,
    radius: R,
    get overdriv() { return u.overdriv.value; },
    set overdriv(v) { u.overdriv.value = v; u.skyH.value = (skyer?.højde ?? 0) * v; },
    get harTabel() { return !!tabel; },
    sætKort(t) { u.kort.value = t; u.harKort.value = t ? 1 : 0; },
    sætHøjde(t) {
      u.hoejde.value = t;
      u.harHoejde.value = t ? 1 : 0;
      if (t) u.texel.value.set(1 / t.image.width, 1 / t.image.height);
      // Indtil tabellen er klar, regnes der uden bjerge
      tabel = null;
      if (t) tabelFor(t, u.hMin.value, u.hSpan.value, [1024, 512], (ny) => { if (u.hoejde.value === t) tabel = ny; });
    },
    // Et lokalt net over et sted med sit eget højdekort og farvekort (sættes med sætHøjde og sætKort).
    // grænser: { nord, syd, vest, øst } i grader (øst positiv). net: punkter på hver led. kant: overgangen til kuglen
    // i km. Kuglen tegnes ikke inden for grænserne, når det lokale højdekort er hentet.
    // detalje: { nord, syd, vest, øst, kant } et mindre område inden for stedet med et skarpere højdekort (sætDetalje),
    // som glider over i stedets kort på kant km.
    lokalt({ nord, syd, vest, øst, net: lokalNet = [512, 512], kant = 40, detalje = null }) {
      const rad = THREE.MathUtils.degToRad;
      const midt = rad((nord + syd) / 2);
      const l = {
        nord: rad(nord), syd: rad(syd), vest: rad(vest), øst: rad(øst),
        // overgangen i stedets uv (km omregnet med radius ved ækvator; mod øst ved stedets midterste bredde)
        kant: [kant / (rad(øst - vest) * radius * Math.cos(midt)), kant / (rad(nord - syd) * radius)],
        boks: new THREE.Vector4((vest + 180) / 360, (syd + 90) / 180, (øst + 180) / 360, (nord + 90) / 180),
        tabel: null,
        klar: false,
        detalje: detalje && {
          nord: rad(detalje.nord), syd: rad(detalje.syd), vest: rad(detalje.vest), øst: rad(detalje.øst),
          kant: [(detalje.kant ?? 15) / (rad(detalje.øst - detalje.vest) * radius * Math.cos(rad((detalje.nord + detalje.syd) / 2))), (detalje.kant ?? 15) / (rad(detalje.nord - detalje.syd) * radius)],
          tabel: null,
        },
      };
      // Hullet i kuglen er 1,5 km mindre end nettet. I den smalle stribe tegnes begge (de ser ens ud, for nettet ligger
      // på kuglens trekanter helt ude ved kanten). Ellers kan der komme en revne på en pixel, når man kigger hen over kanten.
      const kU = 1.5 / (2 * Math.PI * radius * Math.cos(midt)), kV = 1.5 / (Math.PI * radius);
      l.hul = new THREE.Vector4(l.boks.x + kU, l.boks.y + kV, l.boks.z - kU, l.boks.w - kV);
      // Gitteret og skørtet langs kanten (de sidste 4 · (M − 1) punkter)
      const [M, N] = lokalNet;
      const kantPunkter = [];
      for (let j = 0; j < N; j++) for (let i = 0; i < M; i++) if (i === 0 || j === 0 || i === M - 1 || j === N - 1) kantPunkter.push([i, j]);
      const antal = M * N + kantPunkter.length;
      const pos = new Float32Array(antal * 3), uv = new Float32Array(antal * 2), skørt = new Float32Array(antal);
      const kugle = new Float32Array(antal * 3);
      // Et punkt i kuglens net uden bjerge (som i THREE.SphereGeometry, trykket flad)
      const [W, H] = net;
      const kp = (ix, iy) => {
        const phi = (ix / W) * 2 * Math.PI, th = (iy / H) * Math.PI;
        return [-Math.cos(phi) * Math.sin(th), Math.cos(th) * flad, Math.sin(phi) * Math.sin(th)];
      };
      const sæt = (k, i, j, s) => {
        const b = rad(nord + ((syd - nord) * j) / (N - 1)), lg = rad(vest + ((øst - vest) * i) / (M - 1));
        pos.set([Math.cos(b) * Math.cos(lg), Math.sin(b), -Math.cos(b) * Math.sin(lg)], k * 3);
        const u = (lg / Math.PI + 1) / 2, v = b / Math.PI + 0.5;
        uv.set([u, v], k * 2);
        skørt[k] = s;
        // Trekanten i kuglens net (som i shaderen)
        const gx = u * W, gy = (1 - v) * H, i0 = Math.floor(gx), j0 = Math.floor(gy), fx = gx - i0, fy = gy - j0;
        const [vb, vd, vc] = [kp(i0, j0), kp(i0 + 1, j0 + 1), fx >= fy ? kp(i0 + 1, j0) : kp(i0, j0 + 1)];
        const [wb, wc, wd] = fx >= fy ? [1 - fx, fx - fy, fy] : [1 - fy, fy - fx, fx];
        kugle.set([0, 1, 2].map((a) => vb[a] * wb + vc[a] * wc + vd[a] * wd), k * 3);
      };
      for (let j = 0; j < N; j++) for (let i = 0; i < M; i++) sæt(j * M + i, i, j, 0);
      const skørtNr = new Map();
      kantPunkter.forEach(([i, j], k) => { sæt(M * N + k, i, j, 1); skørtNr.set(j * M + i, M * N + k); });
      const index = [];
      for (let j = 0; j < N - 1; j++) {
        for (let i = 0; i < M - 1; i++) {
          const a = j * M + i, b = a + 1, c = a + M, d = c + 1;
          index.push(a, c, b, b, c, d);
        }
      }
      // Skørtet: fra kanten og ned
      const kantRundt = [];
      for (let i = 0; i < M - 1; i++) kantRundt.push(i);
      for (let j = 0; j < N - 1; j++) kantRundt.push(j * M + M - 1);
      for (let i = M - 1; i > 0; i--) kantRundt.push((N - 1) * M + i);
      for (let j = N - 1; j > 0; j--) kantRundt.push(j * M);
      kantRundt.forEach((a, k) => {
        const b = kantRundt[(k + 1) % kantRundt.length], sa = skørtNr.get(a), sb = skørtNr.get(b);
        index.push(a, b, sa, b, sb, sa, a, sa, b, b, sa, sb); // begge veje, så skørtet ses fra begge sider
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      geo.setAttribute('skoert', new THREE.BufferAttribute(skørt, 1));
      geo.setAttribute('kugle', new THREE.BufferAttribute(kugle, 3));
      geo.setIndex(index);
      geo.computeBoundingSphere();
      geo.boundingSphere.radius += 0.07; // bjergene, også 10 gange højere
      const lm = new THREE.ShaderMaterial({
        uniforms: {
          ...u, // de samme uniforms som kuglen (de deles, så lyset, højderne og overdriv følger med)
          rot: { value: new THREE.Matrix3() },
          skala: { value: 1 },
          lokalKort: { value: null },
          harLokalKort: { value: 0 },
          lokalHoejde: { value: null },
          lokalTexel: { value: new THREE.Vector2(1, 1) },
          lokalSpaend: { value: new THREE.Vector2(rad(øst - vest), rad(nord - syd)) },
          boks: { value: l.boks },
          kant: { value: new THREE.Vector2(...l.kant) },
          netKugle: { value: new THREE.Vector2(...net) },
          skoertDybde: { value: 1.5 / radius }, // 1,5 km
          ...(detalje && {
            detaljeHoejde: { value: null },
            harDetalje: { value: 0 },
            // detaljekortets grænser i stedets uv (vest og syd er 0)
            detaljeBoks: { value: new THREE.Vector4((detalje.vest - vest) / (øst - vest), (detalje.syd - syd) / (nord - syd), (detalje.øst - vest) / (øst - vest), (detalje.nord - syd) / (nord - syd)) },
            detaljeKant: { value: new THREE.Vector2(...l.detalje.kant) },
            detaljeTexel: { value: new THREE.Vector2(1, 1) },
            detaljeSpaend: { value: new THREE.Vector2(rad(detalje.øst - detalje.vest), rad(detalje.nord - detalje.syd)) },
            detaljeLod: { value: 0 },
          }),
        },
        defines: { ...defines, ...(detalje && { DETALJE: '' }) },
        vertexShader: VERTEX_LOKAL,
        fragmentShader: medSkyer(FRAGMENT_LOKAL),
      });
      const lu = lm.uniforms;
      const lmesh = new THREE.Mesh(geo, lm);
      lmesh.visible = false; // indtil højdekortet er hentet
      lmesh.renderOrder = -1; // før kuglen, så kuglens punkter bag nettet kan springes over
      lmesh.onBeforeRender = () => {
        lu.rot.value.setFromMatrix4(lmesh.matrixWorld);
        lu.skala.value = lmesh.matrixWorld.getMaxScaleOnAxis();
      };
      mesh.add(lmesh); // samme retninger og skala som kuglen
      lokale.push(l);
      // Kuglens shader med huller skal kende antallet (laves helst, før kuglen tegnes første gang), og trekanterne,
      // der rører et lokalt net, flyttes til sidst i kuglens liste og tegnes med den.
      u.huller.value.push(new THREE.Vector4());
      matHul.defines.HULLER = lokale.length;
      matHul.needsUpdate = true;
      const uvK = mesh.geometry.attributes.uv;
      const uden = [], rand = [], inde = lokale.map(() => []);
      for (let t = 0; t < alle.length; t += 3) {
        const tre = [alle[t], alle[t + 1], alle[t + 2]];
        const us = tre.map((i) => uvK.getX(i)), vs = tre.map((i) => uvK.getY(i));
        let liste = uden;
        lokale.forEach(({ hul: o }, k) => {
          const inden = Math.min(...us) > o.x && Math.max(...us) < o.z && Math.min(...vs) > o.y && Math.max(...vs) < o.w;
          const rører = Math.max(...us) > o.x && Math.min(...us) < o.z && Math.max(...vs) > o.y && Math.min(...vs) < o.w;
          if (inden) liste = inde[k];
          else if (rører && liste === uden) liste = rand;
        });
        liste.push(...tre);
      }
      mesh.geometry.index.array.set([...uden, ...rand, ...inde.flat()]);
      mesh.geometry.index.needsUpdate = true;
      dele = { uden: uden.length, rand: rand.length, inde: inde.map((a) => a.length) };
      opdaterHuller();
      return {
        mesh: lmesh,
        get harTabel() { return !!l.tabel; },
        get klar() { return l.klar; },
        sætKort(t) { lu.lokalKort.value = t; lu.harLokalKort.value = t ? 1 : 0; },
        sætHøjde(t) {
          lu.lokalHoejde.value = t;
          if (t) lu.lokalTexel.value.set(1 / t.image.width, 1 / t.image.height);
          l.klar = lmesh.visible = !!t;
          l.tabel = null;
          if (t) tabelFor(t, u.hMin.value, u.hSpan.value, [512, 512], (ny) => { if (lu.lokalHoejde.value === t) l.tabel = ny; });
          opdaterHuller();
        },
        get harDetaljeTabel() { return !!l.detalje?.tabel; },
        // Detaljekortet (kun med detalje). Nettets punkter bruger det niveau i kortets mipmaps, der passer til
        // afstanden mellem punkterne.
        sætDetalje(t) {
          if (!l.detalje) return;
          lu.detaljeHoejde.value = t;
          lu.harDetalje.value = t ? 1 : 0;
          l.detalje.tabel = null;
          if (!t) return;
          lu.detaljeTexel.value.set(1 / t.image.width, 1 / t.image.height);
          const punkter = (M - 1) * (detalje.øst - detalje.vest) / (øst - vest); // nettets felter hen over detaljekortet
          lu.detaljeLod.value = Math.max(0, Math.log2(t.image.width / punkter));
          tabelFor(t, u.hMin.value, u.hSpan.value, [512, 512], (ny) => { if (lu.detaljeHoejde.value === t) l.detalje.tabel = ny; });
        },
      };
    },
    // Hvor langt fra midten (i radier) overfladen er under punktet p (i kuglens egne retninger, 1 = radius).
    // maks: den højeste overflade i nærheden (til kameraet), ellers glat (til et sted).
    overflade(p, maks = true) {
      n.set(p.x, p.y / flad, p.z).normalize(); // retningen på kuglen, før den er trykket flad
      return Math.hypot(n.x, n.y * flad, n.z) + højde(n, maks);
    },
    // Et sted (bredde og længde i grader øst) i kuglens egne retninger: retningen fra midten, den lodrette retning
    // (vinkelret på den fladtrykte kugle) og retningerne mod nord og øst
    sted(bredde, længde) {
      const b = THREE.MathUtils.degToRad(bredde), l = THREE.MathUtils.degToRad(længde);
      const retning = new THREE.Vector3(Math.cos(b) * Math.cos(l), Math.sin(b), -Math.cos(b) * Math.sin(l));
      const op = new THREE.Vector3(retning.x, retning.y / flad, retning.z).normalize();
      const øst = new THREE.Vector3(-Math.sin(l), 0, -Math.cos(l));
      const nord = new THREE.Vector3().crossVectors(op, øst);
      return { retning, op, nord, øst };
    },
    // Punktet på overfladen i retningen fra sted() (som nettet i vertex-shaderen, med overdriv)
    punkt(retning, ud = new THREE.Vector3()) {
      return ud.set(retning.x, retning.y * flad, retning.z).addScaledVector(retning, højde(retning, false));
    },
    sæt(solRetning) { u.uSol.value.copy(solRetning); },
    stop() {
      for (const c of [...mesh.children]) if (c.geometry && c.material?.uniforms?.lokalHoejde) { c.geometry.dispose(); c.material.dispose(); }
      mesh.geometry.dispose();
      mat.dispose();
      matHul.dispose();
    },
  };
}
