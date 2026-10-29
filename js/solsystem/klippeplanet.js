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

import * as THREE from 'three';
import { SKY_GLSL } from './skyer.js';

const VERTEX = /* glsl */ `
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform float hMin;      // laveste højde i kortet (i radier)
  uniform float hSpan;     // fra laveste til højeste (i radier)
  uniform float overdriv;  // 1 = rigtige højder
  uniform float flad;      // polradius / radius ved ækvator
  varying vec2 vUv;
  varying vec3 vObjN;
  varying vec3 vVerden;
  float hoejdeVed(vec2 uv) {
    vec2 v = texture2D(hoejde, uv).rg;
    return v.x * (65280.0 / 65535.0) + v.y * (255.0 / 65535.0);
  }
  void main() {
    vUv = uv;
    vec3 n = normalize(position);
    vObjN = n;
    float h = harHoejde > 0.5 ? (hMin + hSpan * hoejdeVed(uv)) * overdriv : 0.0;
    vec3 p = n * vec3(1.0, flad, 1.0) + n * h;
    vec4 v = modelMatrix * vec4(p, 1.0);
    vVerden = v.xyz;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D kort;
  uniform float harKort;
  uniform vec3 farve;      // farven, indtil kortet er hentet
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform vec2 texel;      // en pixel i højdekortet (u, v)
  uniform float hSpan;
  uniform float overdriv;
  uniform mat3 rot;        // kuglens drejning (fra dens egne retninger til verdens)
  uniform vec3 uSol;       // retningen mod Solen (i verden)
  uniform vec3 tusFarve;   // farven på lyset i tusmørket og på støvet i luften
  uniform float tusSin;    // hvor langt ind i natten tusmørket når (sinus til vinklen)
  uniform float sloer;     // hvor meget støvet i luften slører kloden mod kanten
  uniform float skyH;      // skyernes højde over kuglen (i radier)
  varying vec2 vUv;
  varying vec3 vObjN;
  varying vec3 vVerden;
  const float OMGANG = 6.2831853;
  float hoejdeVed(vec2 uv) {
    vec2 v = texture2D(hoejde, uv).rg;
    return v.x * (65280.0 / 65535.0) + v.y * (255.0 / 65535.0);
  }
  #ifdef SKYER
  SKY_GLSL_HER
  #endif
  void main() {
    vec3 n0 = normalize(vObjN);
    // Retningerne øst og nord på kuglen
    vec3 oest = vec3(n0.z, 0.0, -n0.x);
    float cosB = length(oest);
    oest = cosB > 1e-4 ? oest / cosB : vec3(0.0, 0.0, -1.0);
    vec3 nord = cross(n0, oest);
    // Bjergenes skrå sider: hvor meget højden ændrer sig pr. strækning mod øst og nord (begge i radier)
    vec3 nr = n0;
    if (harHoejde > 0.5) {
      float dO = hoejdeVed(vUv + vec2(texel.x, 0.0)) - hoejdeVed(vUv - vec2(texel.x, 0.0));
      float dN = hoejdeVed(vUv + vec2(0.0, texel.y)) - hoejdeVed(vUv - vec2(0.0, texel.y));
      float s = hSpan * overdriv;
      dO *= s / (2.0 * texel.x * OMGANG * max(cosB, 0.02));
      dN *= s / (texel.y * OMGANG); // 1 i v er en halv omgang, så 2 · texel.y i v er texel.y · OMGANG radianer
      nr = normalize(n0 - dO * oest - dN * nord);
    }
    vec3 N = normalize(rot * n0);
    vec3 Nr = normalize(rot * nr);
    vec3 V = normalize(cameraPosition - vVerden);
    vec3 c = harKort > 0.5 ? texture2D(kort, vUv).rgb : farve;
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
    // Støvet i luften: Mod kanten kigger man gennem mere luft, så kloden bliver lidt sløret og lysere brun
    float luftLys = smoothstep(-tusSin, 0.15, cosZ);
    float s = 1.0 - exp(-sloer / max(e, 0.04));
    ud = mix(ud, tusFarve * 0.32 * luftLys, s * 0.65);
    #endif
    gl_FragColor = vec4(ud, 1.0);
  }`;

// Højdetabellen: højst 1024 × 512 felter, hvert med den højeste højde (i radier) fra højdekortet i feltet.
// Billedet læses i strimler med en pause imellem (ca. 10 ms ad gangen), så billedet ikke fryser, mens tabellen laves.
const TABEL = [1024, 512];
function lavTabel(billede, hMin, hSpan, færdig) {
  const B = Math.min(TABEL[0], billede.width), H = Math.min(TABEL[1], billede.height);
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

// radius og polRadius i km, skala i km pr. enhed. højdeMin og højdeMax i meter (de samme som i billedværktøjet).
// net: [omkring, fra pol til pol] (hvor fint nettet er)
// luft: { tusmørke (grader ind i natten), farve, slør } giver tusmørke og støv i luften. is: polkapperne gøres hvidere.
// skyer: skyerne fra js/solsystem/skyer.js, som kaster skygge på jorden.
export function lavKlippeplanet({ skala, radius, polRadius = radius, højdeMin, højdeMax, net = [1024, 512], farve = [0.6, 0.35, 0.2], luft = null, is = false, skyer = null }) {
  const R = radius / skala;
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
      skyH: { value: skyer?.højde ?? 0 },
      ...(skyer ? skyer.uniforms : {}),
    },
    defines: { ...(luft && { LUFT: '' }), ...(is && { IS: '' }), ...(skyer && { SKYER: '' }) },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT.replace('SKY_GLSL_HER', skyer ? SKY_GLSL : ''),
  });
  const u = mat.uniforms;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, net[0], net[1]), mat);
  mesh.scale.setScalar(R);
  // Bjergene kan rage ud over kuglen (også når de er gjort højere), så den må ikke skæres fra for tidligt
  mesh.geometry.computeBoundingSphere();
  mesh.geometry.boundingSphere.radius = 1.1;
  mesh.onBeforeRender = () => u.rot.value.setFromMatrix4(mesh.matrixWorld);
  const flad = polRadius / radius;
  let tabel = null;
  const n = new THREE.Vector3();
  // Højden (i radier, med overdriv) ved retningen n fra kuglens midte. maks: den højeste i felterne omkring (3 × 3),
  // for nettet kan ligge højere end kortet mellem to punkter i nettet.
  function højde(retning, maks) {
    if (!tabel) return 0;
    const { B, H, v } = tabel;
    const x = ((Math.atan2(-retning.z, retning.x) / (2 * Math.PI) + 0.5) * B) % B; // længdegrad 0° i midten, øst til højre
    const y = (0.5 - Math.asin(THREE.MathUtils.clamp(retning.y, -1, 1)) / Math.PI) * H; // nord øverst
    let h;
    if (maks) {
      const x0 = Math.floor(x), y0 = Math.floor(y);
      h = -Infinity;
      for (let dy = -1; dy <= 1; dy++) {
        const r = THREE.MathUtils.clamp(y0 + dy, 0, H - 1) * B;
        for (let dx = -1; dx <= 1; dx++) h = Math.max(h, v[r + ((x0 + dx + B) % B)]);
      }
    } else {
      // Glat mellem felternes midter
      const fx = x - 0.5, fy = THREE.MathUtils.clamp(y - 0.5, 0, H - 1);
      const x0 = Math.floor(fx), y0 = Math.floor(fy), y1 = Math.min(H - 1, y0 + 1);
      const tx = fx - x0, ty = fy - y0;
      const a = (x0 + B) % B, b = (x0 + 1) % B;
      h = (v[y0 * B + a] * (1 - tx) + v[y0 * B + b] * tx) * (1 - ty) + (v[y1 * B + a] * (1 - tx) + v[y1 * B + b] * tx) * ty;
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
      // Tabellen gemmes på billedet, så den kun laves én gang (billedet bliver i grafikkortet, når planeten lukkes).
      // Indtil den er klar, regnes der uden bjerge.
      tabel = null;
      if (!t) return;
      const nøgle = `${u.hMin.value}:${u.hSpan.value}`;
      let gemt = t.userData.højdeTabel;
      if (gemt?.nøgle !== nøgle) {
        gemt = t.userData.højdeTabel = { nøgle, tabel: null, venter: [] };
        lavTabel(t.image, u.hMin.value, u.hSpan.value, (ny) => {
          gemt.tabel = ny;
          for (const f of gemt.venter) f(ny);
          gemt.venter.length = 0;
        });
      }
      if (gemt.tabel) tabel = gemt.tabel;
      else gemt.venter.push((ny) => { if (u.hoejde.value === t) tabel = ny; });
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
    stop() { mesh.geometry.dispose(); mat.dispose(); },
  };
}
