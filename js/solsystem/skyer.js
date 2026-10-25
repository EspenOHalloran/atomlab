// Skyer af is over bjergene på en klippeplanet (først Mars). Luft, der stiger op ad bjergsiderne, bliver kold,
// og vanddampen fryser til iskrystaller (NASA PIA02049). Skyerne er tegnet af programmet (støj), men de ligger på de
// rigtige steder, og de kommer om eftermiddagen. Hvor meget sky der er ved hvert sted, regnes i JS ud fra stedets
// lokale tid (`mængder`), så det kan testes.
//
// Skyerne er en skal lidt over overfladen, som drejer med planeten. Den samme funktion (SKY_GLSL) bruges af
// klippeplanetens shader til skyernes skygge på jorden.

import * as THREE from 'three';

export const MAKS_STEDER = 6;

// Retningerne regnes som i klippeplanet.js: længdegrad 0° mod +x, øst mod −z og nord mod +y.
export function retning(bredde, længde, ud = new THREE.Vector3()) {
  const b = THREE.MathUtils.degToRad(bredde), l = THREE.MathUtils.degToRad(længde);
  return ud.set(Math.cos(b) * Math.cos(l), Math.sin(b), -Math.cos(b) * Math.sin(l));
}

// Stedets lokale soltid i timer (0-24, 12 = Solen står højest) ud fra Solens retning i planetens egne retninger.
// Planeten drejer mod øst, så steder øst for middagsstedet har eftermiddag.
export function lokalTid(d, sol) {
  const t = Math.atan2(d.x * sol.z - d.z * sol.x, d.x * sol.x + d.z * sol.z);
  return (12 + (t * 12) / Math.PI + 24) % 24;
}

// Skyerne vokser fra sidst på formiddagen, er størst midt på eftermiddagen og forsvinder om natten
export function eftermiddag(timer) {
  return THREE.MathUtils.smoothstep(timer, 10.5, 14.5) * (1 - THREE.MathUtils.smoothstep(timer, 18.5, 21.5));
}

export const SKY_GLSL = /* glsl */ `
  uniform vec4 skySted[${MAKS_STEDER}];   // retning (xyz) og radius (w, i radianer)
  uniform float skyMaengde[${MAKS_STEDER}];
  uniform float skyTid;
  uniform float skyAktiv;                 // 1, når der er sky et sted (ellers springes skyggen over)
  float skyHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float skyStoej(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(skyHash(i), skyHash(i + vec3(1,0,0)), f.x), mix(skyHash(i + vec3(0,1,0)), skyHash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(skyHash(i + vec3(0,0,1)), skyHash(i + vec3(1,0,1)), f.x), mix(skyHash(i + vec3(0,1,1)), skyHash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  // Hvor tæt skyen er i retningen n (planetens egne retninger, længde 1)
  float skyer(vec3 n) {
    float vaegt = 0.0;
    for (int i = 0; i < ${MAKS_STEDER}; i++) {
      vec4 s = skySted[i];
      if (skyMaengde[i] < 0.01) continue;
      vec3 a = n - s.xyz; // korden er næsten lige så lang som buen tæt på stedet (og billigere end acos)
      float v2 = dot(a, a) / (s.w * s.w);
      if (v2 > 9.0) continue;
      vaegt += skyMaengde[i] * exp(-v2);
    }
    if (vaegt < 0.01) return 0.0;
    // Tynde, laset skyer: støj i flere størrelser, trukket ud mod øst og vest (vinden), som langsomt flytter sig
    vec3 p = n * vec3(30.0, 75.0, 30.0) + vec3(skyTid * 0.02, 0.0, skyTid * 0.013);
    float st = 0.5 * skyStoej(p) + 0.3 * skyStoej(p * 2.3 + 4.1) + 0.2 * skyStoej(p * 5.1 - 2.7);
    // Støjen bestemmer formen, så kanten bliver laset og ikke rund. Tæt ved bjerget er der mere og tættere sky.
    float v = min(vaegt, 1.0);
    return v * smoothstep(0.62 - 0.3 * v, 0.95 - 0.25 * v, st);
  }`;

// steder: [{ navn, bredde, længde, radius (km), styrke }]. radius, polRadius og højde i km. Skallen er et barn af
// klippeplanetens mesh (hvor 1 = radius ved ækvator).
export function lavSkyer({ radius, polRadius = radius, højde, steder, net = [256, 128] }) {
  const sted = [];
  const mængde = [];
  for (let i = 0; i < MAKS_STEDER; i++) {
    const s = steder[i];
    sted.push(s ? new THREE.Vector4().copy(retning(s.bredde, s.længde)).setW(s.radius / radius) : new THREE.Vector4(1, 0, 0, 0.01));
    mængde.push(0);
  }
  // Uniforms, som deles med klippeplanetens shader (skyggen)
  const uniforms = { skySted: { value: sted }, skyMaengde: { value: mængde }, skyTid: { value: 0 }, skyAktiv: { value: 0 } };
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      rot: { value: new THREE.Matrix3() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vObjN; varying vec3 vVerden;
      void main() {
        vObjN = normalize(position);
        vec4 v = modelMatrix * vec4(position, 1.0);
        vVerden = v.xyz;
        gl_Position = projectionMatrix * viewMatrix * v;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSol;
      uniform mat3 rot;
      varying vec3 vObjN; varying vec3 vVerden;
      ${SKY_GLSL}
      void main() {
        vec3 n = normalize(vObjN);
        float t = skyer(n);
        if (t < 0.004) discard;
        vec3 N = normalize(rot * n);
        vec3 V = normalize(vVerden - cameraPosition);
        float lys = smoothstep(-0.06, 0.2, dot(N, uSol));
        // Iskrystaller spreder lyset mest fremad, så skyerne lyser i modlys
        float fremad = 1.0 + 3.0 * pow(max(dot(V, uSol), 0.0), 8.0);
        gl_FragColor = vec4(vec3(0.93, 0.96, 1.0) * lys * fremad, t * 0.55);
      }`,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, net[0], net[1]), mat);
  const h = højde / radius; // skyernes højde over kuglen (i radier)
  let overdriv = 1;
  const sætStørrelse = () => mesh.scale.set(1 + h * overdriv, polRadius / radius + h * overdriv, 1 + h * overdriv);
  sætStørrelse();
  mesh.renderOrder = 1;
  mesh.onBeforeRender = () => mat.uniforms.rot.value.setFromMatrix4(mesh.matrixWorld);
  const tider = steder.map(() => 0);
  return {
    mesh,
    uniforms,
    højde: h,
    steder,
    // Sæt Solens retning i planetens egne retninger (solObj) og i verden (sol) og skyernes tid
    sæt(solObj, sol, tid) {
      mat.uniforms.uSol.value.copy(sol);
      uniforms.skyTid.value = tid;
      steder.forEach((s, i) => {
        tider[i] = lokalTid(sted[i], solObj);
        mængde[i] = eftermiddag(tider[i]) * (s.styrke ?? 1);
      });
      uniforms.skyAktiv.value = mængde.some((m) => m >= 0.01) ? 1 : 0;
      mesh.visible = uniforms.skyAktiv.value > 0; // ingen skyer: skallen tegnes slet ikke
    },
    set overdriv(v) { overdriv = v; sætStørrelse(); },
    // Kun til tests: lokal tid og mængden af sky ved hvert sted
    måling: () => steder.map((s, i) => ({ navn: s.navn, tid: tider[i], mængde: mængde[i] })),
    stop() { mesh.geometry.dispose(); mat.dispose(); },
  };
}
