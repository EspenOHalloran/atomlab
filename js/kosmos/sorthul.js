// Sort hul: rigtig lysbøjning om et sort hul, der ikke drejer. En shader (js/kosmos/linse.js) følger lysets bane for
// hver pixel, så skivens bagside ses som en bue over og under skyggen, med en tynd fotonring og dopplerlys.
// Man kan sende en astronaut ind (spaghetti!) eller kaste en stjerne forbi, så den bliver revet over.

import * as THREE from 'three';
import { handling, gå } from '../sideknap.js';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { visRumstøv } from '../scene3d.js';
import { glød, prikSky, skilt, KVALITET } from './faelles.js';
import { lavLinse } from './linse.js';
import { HORISONT, SKYGGE, ISCO, skyggeVinkel } from '../data/sorthul.js';

const GM = 45; // tyngdekraftens styrke for astronauten og stjernen (deres egen, enkle fysik)
const MINDSTE_AFSTAND = 15; // kameraet kan ikke komme tættere på (ca. 20 M): så fylder skyggen det meste af billedets højde

export default {
  id: 'sorthul',
  navn: 'Sort hul',
  ikon: '⚫',
  undertitel: 'Hvor ikke engang lys kan slippe ud',
  citat: 'hawkingSorteHuller',
  kamera: { retning: [0, 0.2, 1], radius: 8.5 },
  tal: [
    ['Mælkevejens sorte hul', '4 mio. × Solen'],
    ['Afstand til det', 'ca. 27.000 lysår'],
    ['Første billede', 'M87*, vist i 2019'],
    ['Jorden som sort hul', 'ca. 2 cm bred'],
  ],
  // Teksten i højre panel (siden i lag, U3 i docs/plan-ux.md)
  side: {
    kort: 'Et sort hul er et sted, hvor så meget masse er presset sammen, at intet kan slippe væk, ikke engang lys. Midt i vores galakse, Mælkevejen, er der et, der vejer 4 millioner gange så meget som Solen.',
    emner: [
      {
        titel: 'Hvor går grænsen?', hvorfor: ['sorthul'],
        tekst: '<p>Grænsen kaldes begivenhedshorisonten. Det, der kommer indenfor, kommer aldrig ud igen.</p>',
      },
      {
        titel: 'Hvad er den lysende ring?',
        tekst: '<p>Selve hullet er sort, men gassen omkring det bliver glohed og lyser, mens den hvirvler rundt. Tyngdekraften bøjer lyset. Derfor kan man også se gassen <i>bag</i> hullet: Lyset fra den bliver bøjet op over hullet og ned under det. Buen over og under skyggen er altså den samme flade skive af gas, bare set gennem bøjet lys.</p><p>Helt inde ved skyggen er der en tynd, lys ring, fotonringen. Den er lavet af lys, der er gået mindst en halv tur rundt om hullet, før det slap væk.</p>',
      },
      {
        titel: 'Hvorfor er den ene side lysere?',
        tekst: '<p>Gassen inderst kører rundt med omkring halvdelen af lysets fart. Den side, der kommer mod os, ser lysere og mere blålig ud. Den side, der kører væk, ser mørkere og rødere ud. Det kaldes dopplereffekten: Lys fra noget, der kommer mod os, bliver presset sammen til kortere bølger (mere blåt), og lys fra noget, der kører væk, bliver strakt ud (mere rødt). Ved så høj fart bliver lyset også kastet fremad, ligesom lyset fra en lygte.</p><p>Inderst er lyset også rødere og svagere, fordi det skal op ad hullets tyngdekraft. I filmen <i>Interstellar</i> tog man med vilje både dopplereffekten og tyngdekraftens rødforskydning ud. Ellers blev den ene side så lys, at billedet blev skævt og svært at forstå. Her er de med, for de er rigtige. På det første billede af et sort hul (M87*, 2019) er ringen også lysest i den ene side, nederst, hvor gassen efter alt at dømme kommer mod os.</p>',
      },
      {
        titel: 'Hvorfor er skyggen så stor?',
        tekst: '<p>Den sorte skygge er ca. 2,6 gange bredere end selve horisonten. Lys, der kommer tættere forbi end skyggens kant, bliver bøjet så meget, at det falder ind. Lys, der rammer præcis kanten, kan gå i ring om hullet i en afstand fra midten, der er 1,5 gange horisontens. Det giver fotonringen.</p>',
      },
      {
        titel: 'Hvad sker der med en astronaut?',
        tekst: `<p>${handling('astronaut', '🧑‍🚀 Send en astronaut ind')} Tyngdekraften er stærkere ved fødderne end ved hovedet, hvis man falder med fødderne først. Tæt på et lille sort hul bliver man derfor strakt ud som spaghetti. Ved et kæmpe sort hul er forskellen mindre, og man kunne krydse horisonten uden at mærke noget.</p>
          <p>Set udefra bliver astronauten langsommere og rødere tæt på horisonten, og man ser aldrig astronauten nå helt ind. For astronauten selv går det hurtigt.</p>`,
      },
    ],
    videre: [gå('kosmos:kvasar', 'Kvasar'), gå('kosmos:rumtid', 'Rumtid'), gå('kosmos:ormehul', 'Ormehul')],
    nørd: `
      <p><b>Hvor stort?</b> Begivenhedshorisontens radius er 2GM/c² (G er tyngdekonstanten, M massen og c lysets fart). Blev Solen presset sammen til et sort hul, ville den være 6 km bred. Jorden ville være ca. 2 cm.</p>
      <p><b>Billeder af sorte huller:</b> Forskere kombinerede radioteleskoper over hele Jorden til ét kæmpe teleskop (Event Horizon Telescope). Målingerne blev lavet i 2017, og i 2019 viste de det første billede af skyggen af et sort hul, M87*, der vejer 6,5 milliarder sole. I 2022 fulgte et billede af Mælkevejens eget sorte hul.</p>
      <p><b>Sådan er billedet regnet:</b> For hver pixel følger computeren lyset baglæns fra kameraet med Einsteins ligninger for et sort hul, der ikke drejer (Schwarzschild). Lyset går i ét plan, og banen regnes i små skridt, til den falder ind eller slipper væk. Skiven begynder ved den inderste stabile bane, 3 gange horisontens radius. Indenfor falder gassen ind. Lysstyrken ganges med g⁴, hvor g er, hvor meget lyset er presset sammen (g større end 1) eller strakt ud.</p>
      <p><b>Hawking-stråling:</b> Stephen Hawking regnede ud, at sorte huller langsomt "fordamper", men så langsomt, at det aldrig er blevet målt.</p>`,
    ærligt: '<p>Lysets bøjning, skyggens størrelse, fotonringen og dopplerlyset er regnet med Einsteins ligninger, men for et sort hul, der ikke drejer. Rigtige sorte huller drejer som regel, og så kan skyggen blive lidt skæv. Skiven er tegnet tynd og meget mindre end i virkeligheden, og kameraet står stille ved hullet. Farverne er valgt, så de kan ses: Gassen i en tynd skive som denne er så varm, at den mest lyser med ultraviolet lys (ved kæmpe huller) eller røntgenstråler (ved små huller). Billederne af M87* og Mælkevejens hul er taget med radiobølger. Astronauten og stjernen bliver ikke bøjet (de er tegnet oven på billedet). Gløden om gassen er holdt ude af skyggen, så den er helt sort. Og astronauten bliver kun til spaghetti ved et lille sort hul, mens stjerner bliver revet over ved de kæmpe sorte huller midt i galakser. Her er begge dele vist ved det samme hul.</p>',
  },

  lav(gruppe, { lyd, fase, verden }) {
    // Lysbøjningen: skyggen, skiven, fotonringen og den bøjede stjernehimmel tegnes af én shader (js/kosmos/linse.js)
    const linse = lavLinse();
    gruppe.add(linse.flade);
    visRumstøv(false); // rumstøvet bliver ikke bøjet og ville flyde hen over billedet
    const orbit = verden.styring;
    const gammelMin = orbit.minDistance;
    orbit.minDistance = MINDSTE_AFSTAND;

    // Navne. De står i en flade, der altid vender mod os (ligesom skyggen), så de passer til billedet fra alle sider.
    // Horisonten sidder inde i skyggen og vises som en stiplet ring. Navnene tegnes altid øverst.
    const navne = new THREE.Group();
    const R = SKYGGE;
    const navn = (tekst, farve, str, x, y) => {
      const n = skilt(tekst, farve, str);
      n.position.set(x, y, 0);
      navne.add(n);
    };
    navn('Fotonring', '#ffe9c4', 0.7, 0, R * 0.84);
    navn('Skygge', '#c9d3f5', 1.0, 0, R * 0.56);
    navn('Bøjet lys', '#ffe3b0', 1.0, 0, R * 2.05);
    navn('Varm gas', '#ffb36b', 0.9, R * 1.75, R * 0.35);
    navn('Mod os: lysere', '#a9c8ff', 0.75, -R * 1.75, -R * 0.42);
    navn('Væk: mørkere', '#ff9a5c', 0.75, R * 1.75, -R * 0.42);
    const pil = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, R * 0.92, 0), new THREE.Vector3(0, R * 0.985, 0)]),
      new THREE.LineBasicMaterial({ color: 0xffe9c4, transparent: true, opacity: 0.8 }),
    );
    const horisont = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, HORISONT, HORISONT).getPoints(96)),
      new THREE.LineDashedMaterial({ color: 0x8d9bcc, dashSize: 0.22, gapSize: 0.16, transparent: true, opacity: 0.8, depthWrite: false }),
    );
    horisont.computeLineDistances();
    navn('Begivenhedshorisont', '#aab6e0', 0.55, 0, 0.5);
    navne.add(horisont, pil);
    navne.traverse((o) => { if (o.material) { o.material.depthTest = false; o.material.depthWrite = false; o.renderOrder = 10; } });
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
    const sort = holdSkyggenSort(verden, gruppe);

    return {
      stop: () => {
        sort.fjern();
        linse.fjern();
        orbit.minDistance = gammelMin;
      },
      // Til tests: skyggens midte og radius på skærmen (CSS-pixel), regnet med √27 M
      test: {
        skygge: () => sort.skærm(), linseSkala: () => linse.skala(), dynamisk: (til) => linse.dynamisk(til), maske: (til) => sort.slå(til),
        lysere: (v) => { lysere = v; }, // skiven lyser op, som når den får mad
        // Kameraet i afstanden a, h grader over skivens plan og drejet v grader (står stille bagefter)
        kamera: (a, h, v = 0) => {
          orbit.autoRotate = false;
          verden.målAfstand = null;
          verden.kamera.position.setFromSphericalCoords(a, THREE.MathUtils.degToRad(90 - h), THREE.MathUtils.degToRad(v));
          orbit.update();
        },
      },
      styring: [
        { tekst: '🧑‍🚀 Send en astronaut ind', handling: sendAstronaut, deaktiv: () => astro !== null },
        { tekst: '⭐ Kast en stjerne forbi', handling: kastStjerne, deaktiv: () => stjerne !== null },
        { tekst: '🏷️ Vis navne', til: true, skift: (til) => { navne.visible = til; } },
      ],
      opdater(dt, tid) {
        lysere = Math.max(0, lysere - dt * 0.3);
        linse.opdater(tid, lysere);
        navne.quaternion.copy(verden.kamera.quaternion);

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
              if (r < ISCO * 0.9) {
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

function holdSkyggenSort(verden, hul) {
  const før = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  const gem = new GemPass(før);
  const bland = new SkyggePass(før, verden.kamera, hul);
  const komponist = verden.komponist;
  const i = komponist.passes.indexOf(verden.glød);
  komponist.insertPass(gem, i);
  komponist.insertPass(bland, i + 2);
  return {
    skærm: () => bland.skærm(),
    slå: (til) => { gem.enabled = bland.enabled = til; }, // til tests og prøvebilleder
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
  constructor(før, kamera, hul) {
    super();
    this.kamera = kamera;
    this.hul = hul;
    this.midt = new THREE.Vector3();
    this.kant = new THREE.Vector3();
    this.op = new THREE.Vector3();
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

  // Skyggens midte og radius på skærmen (i punkter i lærredet). Radius fra √27 M set fra kameraets afstand.
  måling(størrelse) {
    this.midt.setFromMatrixPosition(this.hul.matrixWorld);
    const afstand = this.kamera.position.distanceTo(this.midt);
    this.op.set(0, 1, 0).applyQuaternion(this.kamera.quaternion);
    this.kant.copy(this.midt).addScaledVector(this.op, afstand * Math.tan(skyggeVinkel(afstand)));
    this.midt.project(this.kamera);
    this.kant.project(this.kamera);
    const x = (this.midt.x + 1) / 2 * størrelse.x, y = (this.midt.y + 1) / 2 * størrelse.y;
    return { x, y, r: Math.max(1, Math.hypot((this.kant.x - this.midt.x) / 2 * størrelse.x, (this.kant.y - this.midt.y) / 2 * størrelse.y)) };
  }

  // Til tests: skyggen i CSS-pixel med y nedad
  skærm() {
    const m = this.måling({ x: innerWidth, y: innerHeight });
    return { x: m.x, y: innerHeight - m.y, r: m.r };
  }

  render(renderer, writeBuffer, readBuffer) {
    const u = this.materiale.uniforms;
    const m = this.måling(u.uStoerrelse.value);
    u.uMidt.value.set(m.x, m.y);
    u.uRadius.value = m.r;
    u.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }
}

