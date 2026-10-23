// Sort hul: en sort skygge, en skive af varm gas, der hvirvler rundt, og lys, der bliver bøjet rundt om hullet.
// Man kan sende en astronaut ind (spaghetti!) eller kaste en stjerne forbi, så den bliver revet over.

import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { glød, prikSky, skilt, KVALITET } from './faelles.js';

const HORISONT = 1.5; // begivenhedshorisontens radius
// Skyggen: Lys, der kommer tættere forbi end skyggens kant, bliver bøjet ind i hullet.
// For et sort hul, der ikke drejer, er kanten √27/2 ≈ 2,6 gange horisontens radius.
const SKYGGE = HORISONT * 2.6;
const GM = 45; // tyngdekraftens styrke i animationen
const INDERST = 2.7; // gassens inderste bane
const YDERST = 9;
const GLORIE = 1.9; // buen af bøjet lys går fra skyggens kant ud til 1,9 gange skyggens radius

export default {
  id: 'sorthul',
  hvorfor: ['sorthul'],
  navn: 'Sort hul',
  ikon: '⚫',
  undertitel: 'Hvor ikke engang lys kan slippe ud',
  citat: 'hawkingSorteHuller',
  kamera: { retning: [0, 0.2, 1], radius: 8.5 },
  tal: [
    ['Mælkevejens sorte hul', '4 mio. × Solen'],
    ['Afstand til det', 'ca. 26.000 lysår'],
    ['Første billede', 'M87*, vist i 2019'],
    ['Jorden som sort hul', 'ca. 2 cm bred'],
  ],
  kort: `
    <p>Et <b>sort hul</b> er et sted, hvor så meget masse er presset sammen, at intet kan slippe væk, ikke engang lys. Grænsen kaldes <b>begivenhedshorisonten</b>. Det, der kommer indenfor, kommer aldrig ud igen.</p>
    <p>Selve hullet er sort, men gassen omkring det bliver glohed og lyser, mens den hvirvler rundt og falder ind. Lyset bliver bøjet af tyngdekraften, så man kan se gassen bag hullet som en lysende bue over og under det.</p>
    <p>Den sorte skygge er ca. 2,6 gange bredere end selve horisonten. Lys, der kommer tættere forbi end skyggens kant, bliver bøjet så meget, at det falder ind.</p>
    <p>Midt i vores galakse, Mælkevejen, er der et kæmpe sort hul, der vejer 4 millioner gange så meget som Solen. Prøv at sende en astronaut ind i et sort hul!</p>`,
  nørd: `
    <p><b>Hvor stort?</b> Begivenhedshorisontens radius er 2GM/c² (G er tyngdekonstanten, M massen og c lysets fart). Blev Solen presset sammen til et sort hul, ville den være 6 km bred. Jorden ville være ca. 2 cm.</p>
    <p><b>Spaghetti:</b> Tyngdekraften er stærkere ved fødderne end ved hovedet, hvis man falder med fødderne først. Tæt på et lille sort hul bliver man derfor strakt ud som spaghetti. Ved et kæmpe sort hul er forskellen mindre, og man kunne krydse horisonten uden at mærke noget.</p>
    <p><b>Tiden går i stå:</b> Set udefra bliver astronauten langsommere og rødere tæt på horisonten, og man ser aldrig astronauten nå helt ind. For astronauten selv går det hurtigt.</p>
    <p><b>Billeder af sorte huller:</b> Forskere kombinerede radioteleskoper over hele Jorden til ét kæmpe teleskop (Event Horizon Telescope). Målingerne blev lavet i 2017, og i 2019 viste de det første billede af skyggen af et sort hul, M87*, der vejer 6,5 milliarder sole. I 2022 fulgte et billede af Mælkevejens eget sorte hul.</p>
    <p><b>Ærligt talt:</b> Gas-skiven er tegnet tættere på og mindre end i virkeligheden, og lysets bøjning er kun efterlignet med buen om hullet. Skyggens størrelse passer: ca. 2,6 gange horisonten for et sort hul, der ikke drejer (et hul, der drejer, har en lidt skæv skygge). Gløden om gassen er holdt ude af skyggen, så den er helt sort. Og astronauten bliver kun til spaghetti ved et lille sort hul, mens stjerner bliver revet over ved de kæmpe sorte huller midt i galakser. Her er begge dele vist ved det samme hul. Stephen Hawking regnede ud, at sorte huller langsomt "fordamper" (Hawking-stråling), men så langsomt, at det aldrig er blevet målt.</p>`,

  lav(gruppe, { lyd, fase, verden }) {
    // Skyggen: en sort skive, der altid vender mod os. Gassen foran den tegnes oven på, og gassen bag den er skjult.
    const skygge = new THREE.Mesh(new THREE.CircleGeometry(SKYGGE, 96), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    gruppe.add(skygge);

    // Gas-skiven: en flad ring med striber + prikker, der hvirvler rundt
    const skive = new THREE.Mesh(
      new THREE.RingGeometry(INDERST - 0.2, YDERST + 0.5, 128, 1),
      new THREE.MeshBasicMaterial({ map: skiveTekstur(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    );
    skive.rotation.x = -Math.PI / 2;
    gruppe.add(skive);

    const N = Math.round(2600 * KVALITET);
    const pr = new Float32Array(N); // radius
    const pv = new Float32Array(N); // vinkel
    const py = new Float32Array(N); // højde over skiven
    const grundfarve = new Float32Array(N * 3);
    const nyPartikel = (i, r) => {
      pr[i] = r;
      pv[i] = Math.random() * Math.PI * 2;
      py[i] = (Math.random() - 0.5) * 0.12 * Math.sqrt(r);
      const t = (r - INDERST) / (YDERST - INDERST); // 0 inderst (hvidglødende), 1 yderst (rødlig)
      const c = new THREE.Color(2.4, 2.1, 1.7).lerp(new THREE.Color(1.5, 0.45, 0.12), Math.pow(t, 0.6));
      grundfarve.set([c.r, c.g, c.b], i * 3);
    };
    for (let i = 0; i < N; i++) nyPartikel(i, INDERST + Math.pow(Math.random(), 1.6) * (YDERST - INDERST));
    const gas = prikSky(N, 0.18, () => {});
    gruppe.add(gas);
    const gasPos = gas.geometry.attributes.position.array;
    const gasFarve = gas.geometry.attributes.color.array;

    // Lyset fra skiven bag hullet bliver bøjet op over og ned under hullet (en ring, der altid vender mod os)
    const glorie = new THREE.Mesh(
      new THREE.RingGeometry(SKYGGE, SKYGGE * GLORIE, 128, 1),
      new THREE.MeshBasicMaterial({ map: glorieTekstur(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    gruppe.add(glorie);
    // Et varmt skær om det hele. Det sidder et stykke bag skyggen, så det ikke tegnes oven på den.
    const skær = glød(new THREE.Color(1.2, 0.7, 0.35), 20, 0.1);
    gruppe.add(skær);

    // Navne. Horisonten sidder inde i skyggen og vises som en stiplet ring.
    const navne = new THREE.Group();
    const n1 = skilt('Skygge', '#c9d3f5', 1.1);
    n1.position.set(0, -SKYGGE - 1.1, 0);
    const n2 = skilt('Varm gas', '#ffb36b', 1.1);
    n2.position.set(YDERST * 0.75, 1.3, 0);
    const n3 = skilt('Bøjet lys', '#ffe3b0', 1.1);
    n3.position.set(0, SKYGGE * GLORIE + 0.5, 0);
    const horisont = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, HORISONT, HORISONT).getPoints(96)),
      new THREE.LineDashedMaterial({ color: 0x8d9bcc, dashSize: 0.22, gapSize: 0.16, transparent: true, opacity: 0.8, depthWrite: false }),
    );
    horisont.computeLineDistances();
    const n4 = skilt('Begivenhedshorisont', '#aab6e0', 0.55);
    n4.position.y = 0.5;
    const iSkyggen = new THREE.Group(); // vender altid mod os, ligesom skyggen
    iSkyggen.add(horisont, n4);
    navne.add(n1, n2, n3, iSkyggen);
    gruppe.add(navne);

    // Astronauten og stjernen
    const astronaut = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.22, 0.5, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x666666, roughness: 0.5, transparent: true }),
    );
    astronaut.visible = false;
    gruppe.add(astronaut);
    let astro = null; // { p, v, tid }

    const NS = Math.round(420 * KVALITET);
    const stjerneKugle = new THREE.Group();
    stjerneKugle.add(new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.0, 1.2) })));
    stjerneKugle.add(glød(new THREE.Color(2, 1.5, 0.6), 3, 0.8));
    stjerneKugle.visible = false;
    gruppe.add(stjerneKugle);
    const strøm = prikSky(NS, 0.28, (i, c) => c.setRGB(2.2, 1.7, 0.9));
    strøm.visible = false;
    gruppe.add(strøm);
    const sPos = strøm.geometry.attributes.position.array;
    const sFart = new Float32Array(NS * 3);
    const sVæk = new Uint8Array(NS);
    let stjerne = null; // { p, v, revet }
    let lysere = 0; // skiven lyser op, når den får mad

    const tyngde = (p, a) => {
      const r2 = p.lengthSq();
      a.copy(p).multiplyScalar(-GM / (r2 * Math.sqrt(r2)));
      return a;
    };
    const a = new THREE.Vector3();
    const op = new THREE.Vector3(0, 1, 0);
    const tilKamera = new THREE.Vector3();
    const hjælp = new THREE.Vector3();

    function sendAstronaut() {
      // Astronauten starter på vores side af hullet, så man kan se den blive strakt, før den forsvinder i skyggen
      const k = verden.kamera.position;
      const v = Math.atan2(k.z, k.x) + (Math.random() - 0.5) * 1.4;
      astro = { p: new THREE.Vector3(Math.cos(v) * 13, 1.2, Math.sin(v) * 13), tid: 0 };
      astro.v = astro.p.clone().normalize().multiplyScalar(-1.2).add(new THREE.Vector3(-Math.sin(v), 0, Math.cos(v)).multiplyScalar(0.6));
      astronaut.visible = true;
      astronaut.material.opacity = 1;
      fase('En astronaut falder ind', 'Tæt på et lille sort hul trækker tyngdekraften meget hårdere i fødderne end i hovedet. Astronauten bliver strakt ud som spaghetti!', [1, 2]);
    }

    function kastStjerne() {
      const r0 = 17;
      const rp = 3.6; // tætteste afstand
      const vt = Math.sqrt(2 * GM * rp) / r0;
      const vr = Math.sqrt(2 * GM / r0 - vt * vt);
      const v = Math.random() * Math.PI * 2;
      const ud = new THREE.Vector3(Math.cos(v), 0.08, Math.sin(v)).normalize();
      const tværs = new THREE.Vector3().crossVectors(op, ud).normalize();
      stjerne = { p: ud.clone().multiplyScalar(r0), v: ud.clone().multiplyScalar(-vr).addScaledVector(tværs, vt), revet: false };
      stjerneKugle.visible = true;
      strøm.visible = false;
      fase('En stjerne kommer for tæt på', 'Tyngdekraften trækker mere i den side af stjernen, der vender mod hullet. Stjernen bliver revet over til en lang strøm af gas.', [1, 2]);
    }

    // Gløden må gerne lyse om hullet, men den må ikke brede lyset ind over skyggen
    const sort = holdSkyggenSort(verden, skygge);

    return {
      stop: () => sort.fjern(),
      styring: [
        { tekst: '🧑‍🚀 Send en astronaut ind', handling: sendAstronaut, deaktiv: () => astro !== null },
        { tekst: '⭐ Kast en stjerne forbi', handling: kastStjerne, deaktiv: () => stjerne !== null },
        { tekst: '🏷️ Vis navne', til: true, skift: (til) => { navne.visible = til; } },
      ],
      opdater(dt) {
        // Gassen hvirvler rundt (hurtigst inderst) og falder langsomt ind
        tilKamera.copy(verden.kamera.position).normalize();
        skive.rotation.z += dt * 0.25;
        lysere = Math.max(0, lysere - dt * 0.3);
        for (let i = 0; i < N; i++) {
          const r = pr[i];
          pv[i] += Math.sqrt(GM / (r * r * r)) * dt;
          pr[i] -= dt * 0.04 * (YDERST / r);
          if (pr[i] < INDERST) nyPartikel(i, YDERST - Math.random() * 0.5);
          const x = Math.cos(pv[i]) * pr[i], z = Math.sin(pv[i]) * pr[i];
          gasPos[i * 3] = x;
          gasPos[i * 3 + 1] = py[i];
          gasPos[i * 3 + 2] = z;
          // Gas, der bevæger sig mod os, ser lysere ud (dopplereffekt)
          const mod = (-Math.sin(pv[i]) * tilKamera.x + Math.cos(pv[i]) * tilKamera.z);
          const d = (1 + 0.55 * mod) ** 2 * (1 + lysere);
          gasFarve[i * 3] = grundfarve[i * 3] * d;
          gasFarve[i * 3 + 1] = grundfarve[i * 3 + 1] * d;
          gasFarve[i * 3 + 2] = grundfarve[i * 3 + 2] * d;
        }
        gas.geometry.attributes.position.needsUpdate = true;
        gas.geometry.attributes.color.needsUpdate = true;
        glorie.quaternion.copy(verden.kamera.quaternion);
        skygge.quaternion.copy(verden.kamera.quaternion);
        skær.position.copy(tilKamera).multiplyScalar(-1);
        iSkyggen.quaternion.copy(verden.kamera.quaternion);
        iSkyggen.position.copy(tilKamera);
        skive.material.opacity = 0.85 + 0.15 * lysere;

        // Astronauten: tiden går langsommere tæt på horisonten (set udefra)
        if (astro) {
          astro.tid += dt;
          const r = astro.p.length();
          const langsom = Math.max(0.02, 1 - HORISONT / r);
          for (let s = 0; s < 4; s++) {
            astro.v.addScaledVector(tyngde(astro.p, a), (dt / 4) * langsom);
            astro.p.addScaledVector(astro.v, (dt / 4) * langsom);
          }
          astronaut.position.copy(astro.p);
          astronaut.quaternion.setFromUnitVectors(op, hjælp.copy(astro.p).normalize());
          const stræk = 1 + 40 / (r * r * r);
          astronaut.scale.set(1 / Math.sqrt(stræk), Math.min(stræk, 9), 1 / Math.sqrt(stræk));
          // Rødere og mørkere
          const rød = Math.max(0, Math.min(1, (6 - r) / 4.5));
          astronaut.material.color.setRGB(1, 1 - rød * 0.8, 1 - rød);
          astronaut.material.emissive.setRGB(0.4 * (1 - rød), 0.4 * (1 - rød) * (1 - rød), 0.4 * (1 - rød) * (1 - rød));
          astronaut.material.opacity = Math.min(1, (r - HORISONT) / 0.8);
          if (r < HORISONT * 1.08 || astro.tid > 25) {
            astronaut.visible = false;
            astro = null;
            fase('Væk', 'Set udefra blev astronauten langsommere og rødere og forsvandt til sidst. Ingen kan se, hvad der sker inden for horisonten.', [2, 2]);
          }
        }

        // Stjernen: falder ind, bliver revet over, og gassen fordeler sig
        if (stjerne) {
          if (!stjerne.revet) {
            for (let s = 0; s < 4; s++) {
              stjerne.v.addScaledVector(tyngde(stjerne.p, a), dt / 4);
              stjerne.p.addScaledVector(stjerne.v, dt / 4);
            }
            stjerneKugle.position.copy(stjerne.p);
            const r = stjerne.p.length();
            stjerneKugle.scale.set(1, 1, 1);
            if (r < 6.5) {
              stjerne.revet = true;
              stjerneKugle.visible = false;
              strøm.visible = true;
              for (let i = 0; i < NS; i++) {
                hjælp.randomDirection().multiplyScalar(0.7 * Math.cbrt(Math.random()));
                sPos[i * 3] = stjerne.p.x + hjælp.x;
                sPos[i * 3 + 1] = stjerne.p.y + hjælp.y * 0.5;
                sPos[i * 3 + 2] = stjerne.p.z + hjælp.z;
                // Den side, der vender mod hullet, får lidt mindre fart (og falder ind), den anden lidt mere
                const ind = -hjælp.dot(stjerne.p) / r;
                const f = 1 - 0.35 * ind;
                sFart[i * 3] = stjerne.v.x * f;
                sFart[i * 3 + 1] = stjerne.v.y * f;
                sFart[i * 3 + 2] = stjerne.v.z * f;
                sVæk[i] = 0;
              }
              lyd.sus(1.5);
            }
          } else {
            let tilbage = 0;
            const p = new THREE.Vector3();
            const v = new THREE.Vector3();
            for (let i = 0; i < NS; i++) {
              if (sVæk[i]) continue;
              p.fromArray(sPos, i * 3);
              v.fromArray(sFart, i * 3);
              for (let s = 0; s < 3; s++) {
                v.addScaledVector(tyngde(p, a), dt / 3);
                p.addScaledVector(v, dt / 3);
              }
              const r = p.length();
              if (r < INDERST * 0.9) {
                sVæk[i] = 1;
                lysere = Math.min(1.2, lysere + 0.01);
                p.set(0, 9999, 0);
              } else if (r > 40) {
                sVæk[i] = 1;
              } else tilbage++;
              p.toArray(sPos, i * 3);
              v.toArray(sFart, i * 3);
            }
            strøm.geometry.attributes.position.needsUpdate = true;
            if (tilbage === 0) {
              stjerne = null;
              strøm.visible = false;
              fase('Mæt for nu', 'Halvdelen af stjernen blev slugt og fik skiven til at lyse op. Resten blev slynget ud i rummet. Sådan et glimt har astronomer set mange gange.', [2, 2]);
            }
          }
        }
      },
    };
  },
};

// Skyggen holdes sort. Gløden (UnrealBloomPass) breder lyset fra gassen ud over hele billedet, også ind over skyggen,
// så den så grå ud. Derfor gemmes billedet lige før gløden, og inde i skyggen bruges det billede i stedet.
// Så er skyggen sort, og gassen, astronauten og stjernen foran skyggen kan stadig ses (bare uden glorie).
// Uden glød (TEST_HURTIG) tegnes efterbehandlingen ikke, og skyggen er sort i forvejen.
const KOPI_VS = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';

function holdSkyggenSort(verden, skygge) {
  const før = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  const gem = new GemPass(før);
  const bland = new SkyggePass(før, verden.kamera, skygge);
  const komponist = verden.komponist;
  const i = komponist.passes.indexOf(verden.glød);
  komponist.insertPass(gem, i);
  komponist.insertPass(bland, i + 2);
  return {
    fjern() {
      komponist.removePass(gem);
      komponist.removePass(bland);
      gem.materiale.dispose();
      bland.materiale.dispose();
      før.dispose();
    },
  };
}

// Gemmer billedet, som det ser ud før gløden
class GemPass extends Pass {
  constructor(før) {
    super();
    this.før = før;
    this.needsSwap = false;
    this.materiale = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: KOPI_VS,
      fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main() { gl_FragColor = texture2D(tDiffuse, vUv); }',
    });
    this.quad = new FullScreenQuad(this.materiale);
  }

  setSize(bredde, højde) {
    this.før.setSize(bredde, højde);
  }

  render(renderer, writeBuffer, readBuffer) {
    this.materiale.uniforms.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.før);
    this.quad.render(renderer);
  }
}

// Inde i skyggen: billedet fra før gløden. Udenfor: billedet med glød. Kanten er lidt blød.
class SkyggePass extends Pass {
  constructor(før, kamera, skygge) {
    super();
    this.kamera = kamera;
    this.skygge = skygge;
    this.midt = new THREE.Vector3();
    this.kant = new THREE.Vector3();
    this.materiale = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null }, tFoer: { value: før.texture },
        uMidt: { value: new THREE.Vector2() }, uRadius: { value: 1 }, uStoerrelse: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: KOPI_VS,
      fragmentShader: `uniform sampler2D tDiffuse; uniform sampler2D tFoer; uniform vec2 uMidt; uniform float uRadius; uniform vec2 uStoerrelse; varying vec2 vUv;
        void main() {
          float d = length(vUv * uStoerrelse - uMidt) / uRadius;
          float inde = 1.0 - smoothstep(0.8, 1.0, d);
          gl_FragColor = mix(texture2D(tDiffuse, vUv), texture2D(tFoer, vUv), inde);
        }`,
    });
    this.quad = new FullScreenQuad(this.materiale);
  }

  setSize(bredde, højde) {
    this.materiale.uniforms.uStoerrelse.value.set(bredde, højde);
  }

  render(renderer, writeBuffer, readBuffer) {
    // Hvor skyggen står på skærmen (i punkter), og hvor stor den er
    const u = this.materiale.uniforms;
    const størrelse = u.uStoerrelse.value;
    this.midt.setFromMatrixPosition(this.skygge.matrixWorld);
    this.kant.set(0, SKYGGE, 0).applyQuaternion(this.kamera.quaternion).add(this.midt);
    this.midt.project(this.kamera);
    this.kant.project(this.kamera);
    u.uMidt.value.set((this.midt.x + 1) / 2 * størrelse.x, (this.midt.y + 1) / 2 * størrelse.y);
    u.uRadius.value = Math.max(1, Math.hypot((this.kant.x - this.midt.x) / 2 * størrelse.x, (this.kant.y - this.midt.y) / 2 * størrelse.y));
    u.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }
}

// Skiven: lys inderst, rødlig yderst, med striber i omløbsretningen
function skiveTekstur() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  const m = 256;
  const ydre = 256;
  const indre = ydre * ((INDERST - 0.2) / (YDERST + 0.5));
  const grad = g.createRadialGradient(m, m, indre, m, m, ydre);
  grad.addColorStop(0, 'rgba(255,250,235,1)');
  grad.addColorStop(0.12, 'rgba(255,215,150,0.9)');
  grad.addColorStop(0.45, 'rgba(255,140,60,0.55)');
  grad.addColorStop(1, 'rgba(160,40,20,0)');
  g.fillStyle = grad;
  g.beginPath();
  g.arc(m, m, ydre, 0, Math.PI * 2);
  g.arc(m, m, indre, 0, Math.PI * 2, true);
  g.fill();
  // Striber
  g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 140; i++) {
    const r = indre + Math.random() * (ydre - indre);
    const start = Math.random() * Math.PI * 2;
    g.strokeStyle = `rgba(0,0,0,${0.15 + Math.random() * 0.35})`;
    g.lineWidth = 1 + Math.random() * 4;
    g.beginPath();
    g.arc(m, m, r, start, start + 0.5 + Math.random() * 2);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Buen af bøjet lys: en tynd, skarp ring inderst og et bredere skær, kraftigst over og under hullet
function glorieTekstur() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  const m = 256;
  const ydre = 256;
  const indre = ydre / GLORIE;
  const img = g.createImageData(512, 512);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const dx = x - m, dy = y - m;
      const r = Math.hypot(dx, dy);
      if (r < indre || r > ydre) continue;
      const t = (r - indre) / (ydre - indre);
      const ring = Math.exp(-(((t - 0.04) / 0.035) ** 2)); // den skarpe fotonring
      const skær = Math.exp(-t * 3.2) * (0.35 + 0.65 * Math.abs(dy / r)) * (1 - t) ** 2; // mest over og under, og uden kant yderst
      const s = Math.min(1, ring * 1.2 + skær * 0.9);
      const i = (y * 512 + x) * 4;
      img.data[i] = 255;
      img.data[i + 1] = 200 + 55 * ring;
      img.data[i + 2] = 140 + 100 * ring;
      img.data[i + 3] = s * 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
