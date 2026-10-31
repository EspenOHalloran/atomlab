// Solens fremtid: Solen i dag → lidt stærkere → rød kæmpe (sluger Merkur og Venus) → helium tænder → sidste opsvulmning
// og en planetarisk tåge → en hvid dværg. Man går selv videre fra trin til trin.
// Tal: Schröder og Smith (2008) og lærebøger. Rød kæmpe størst om ca. 7,6 mia. år (ca. 250 gange så bred som i dag).

import * as THREE from 'three';
import { sted, gå, skærm } from '../sideknap.js';
import { stjerne, glød, prikSky, skilt, KVALITET } from './faelles.js';

const AU = 7; // 1 astronomisk enhed (Jordens afstand til Solen) i animationen
// Planeterne: navn, afstand i AU, størrelse, farve
const PLANETER = [
  ['Merkur', 0.39, 0.13, 0x9c8f86],
  ['Venus', 0.72, 0.2, 0xe6c58f],
  ['Jorden', 1.0, 0.21, 0x4f8fd8],
];
const GUL = { lys: new THREE.Color('#fff1b8'), mørk: new THREE.Color('#ff8a20'), glød: new THREE.Color(2.2, 1.6, 0.7) };
const RØD = { lys: new THREE.Color('#ff9a5a'), mørk: new THREE.Color('#a8240a'), glød: new THREE.Color(1.8, 0.5, 0.2) };
const ORANGE = { lys: new THREE.Color('#ffd08a'), mørk: new THREE.Color('#d0581a'), glød: new THREE.Color(2.0, 1.1, 0.4) };

// Trinene. r = Solens radius i animationen (i dag 0,8, tegnet alt for stor, så man kan se den), farve, glødens styrke,
// bane = hvor meget planeternes baner er vokset (når Solen mister masse, trækker den mindre i dem), radius = kameraets afstand,
// panel = alder, bredde og lysstyrke
const TRIN = [
  {
    titel: 'Solen i dag', r: 0.8, farve: GUL, glød: 0.85, bane: 1, radius: 8,
    tekst: 'Solen er ca. 4,6 milliarder år gammel og cirka halvvejs gennem sit liv. I midten smelter hydrogen sammen til helium, ligesom i Stjerneovnen. Solen og planeterne er ikke tegnet i rigtig størrelse.',
    panel: ['ca. 4,6 mia. år', 'som i dag', 'som i dag'],
  },
  {
    titel: 'Om ca. 1 milliard år', r: 0.88, farve: GUL, glød: 1, bane: 1, radius: 8,
    tekst: 'Solen lyser ca. 10 % stærkere. Det lyder ikke af meget, men efter de fleste beregninger er det nok til, at havene på Jorden begynder at fordampe. Så er det slut med liv, som vi kender det på Jorden.',
    panel: ['ca. 5,6 mia. år', 'en smule større', 'ca. 10 % stærkere'],
  },
  {
    titel: 'En rød kæmpe', r: 8, farve: RØD, glød: 0.5, bane: 1.4, radius: 11.5,
    tekst: 'Om ca. 5 milliarder år er hydrogenet i midten brugt op, og Solen begynder at svulme op. Om ca. 7,6 milliarder år er den over 200 gange så bred som i dag og rød. Merkur og Venus bliver slugt. Jordens bane bliver større, fordi Solen mister masse, men om det redder Jorden, er forskerne ikke enige om.',
    panel: ['ca. 12 mia. år', 'over 200 gange så bred', 'et par tusind gange stærkere'],
  },
  {
    titel: 'Helium tænder',
    r: 1.6, farve: ORANGE, glød: 0.8, bane: 1.45, radius: 11.5,
    tekst: 'Midten når ca. 100 millioner grader, og helium begynder at smelte sammen til carbon (tre-alfa-processen fra Stjerneovnen) og videre til oxygen. Solen trækker sig sammen igen, og helium smelter roligt sammen i ca. 100 millioner år.',
    panel: ['ca. 12 mia. år', 'ca. 10 gange så bred', 'ca. 50 gange stærkere'],
  },
  {
    titel: 'En planetarisk tåge', r: 0.18, farve: ORANGE, glød: 0.9, bane: 1.85, radius: 14,
    tekst: 'Nu er helium i midten også brugt op. Solen svulmer op en sidste gang og blæser sine ydre lag ud i rummet. Den varme kerne lyser gassen op: en planetarisk tåge. Den lyser i ca. 10.000 år, før gassen er spredt.',
    panel: ['ca. 12,3 mia. år', 'kun kernen er tilbage', 'kernen er meget varm'],
  },
  {
    titel: 'En hvid dværg', r: 0.18, farve: ORANGE, glød: 0.9, bane: 1.85, radius: 14,
    tekst: 'Tilbage er den glødende kerne af carbon og oxygen: en hvid dværg på størrelse med Jorden, men med over halvdelen af Solens masse. Den fusionerer ikke mere og bliver langsomt koldere i mange milliarder år.',
    panel: ['fra ca. 12,3 mia. år', 'som Jorden', 'svag, og den bliver svagere'],
  },
];

export default {
  id: 'solensfremtid',
  navn: 'Solens fremtid',
  ikon: '🌅',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Rød kæmpe, planetarisk tåge og hvid dværg',
  citat: 'eddington',
  kamera: { retning: [0.15, 0.55, 1], radius: 8 },
  tal: [
    ['Solens alder', 'ca. 4,6 mia. år'],
    ['Hydrogen i midten', 'til ca. 5 mia. år mere'],
    ['Som rød kæmpe', 'over 200 gange så bred'],
    ['Som hvid dværg', 'på størrelse med Jorden'],
  ],
  // Teksten i højre panel (siden i lag, U3 i docs/plan-ux.md)
  side: {
    kort: 'Solen er ca. 4,6 milliarder år gammel og cirka halvvejs gennem sit liv. Gå frem trin for trin, og følg resten af dens liv.',
    emner: [
      {
        titel: 'Hvad sker der, når brinten slipper op?',
        tekst: '<p>Om ca. 5 milliarder år er hydrogenet i midten brugt op. Så begynder Solen at svulme op til en rød kæmpe, over 200 gange så bred som i dag. Merkur og Venus bliver slugt, og måske også Jorden. Når Solen er størst, tænder helium i midten. Så trækker Solen sig sammen igen, og helium smelter sammen til carbon og oxygen.</p>',
      },
      {
        titel: 'Hvordan ender Solen?',
        tekst: '<p>Til sidst blæser Solen sine ydre lag ud i rummet som en lysende boble af gas: en planetarisk tåge. Tilbage bliver den glødende kerne: en hvid dværg på størrelse med Jorden, som langsomt køler af i milliarder af år. Solen er for lille til at eksplodere som en supernova.</p>',
      },
      {
        titel: 'Bliver Jorden slugt?',
        tekst: '<p>Det ved man ikke. Når Solen mister masse, trækker den mindre i planeterne, og banerne bliver større. Om det er nok til, at Jorden slipper for at blive slugt, afhænger af detaljer, som forskerne endnu ikke er enige om.</p>',
      },
    ],
    videre: [gå('kosmos:hviddvaerg', 'Hvid dværg i Kosmos'), sted('solen', 'Solen i dag'), skærm('#fusion', 'Stjerneovnen')],
    nørd: `
      <p><b>Hvorfor svulmer den op?</b> Når hydrogenet i midten er brugt op, trækker midten sig sammen og bliver varmere. Så smelter hydrogen sammen i en skal uden om midten, og det ekstra tryk puster de ydre lag op. Overfladen bliver køligere (ca. 2.500-4.000 grader) og derfor rød. Alligevel lyser Solen et par tusind gange stærkere end i dag, fordi den er så stor.</p>
      <p><b>Heliumglimtet:</b> Når midten når ca. 100 millioner grader, tænder helium. I en stjerne som Solen sker det pludseligt og voldsomt: heliumglimtet. Energien bliver brugt inde i midten, så det kan ikke ses udefra. Bagefter smelter helium roligt sammen til carbon og oxygen i ca. 100 millioner år.</p>
      <p><b>Planetarisk tåge:</b> Navnet er misvisende. Tågerne har intet med planeter at gøre, men i 1700-tallets teleskoper lignede de små, runde planeter. Tågen lyser, fordi den varme kerne (ofte over 100.000 grader) lyser den op. Farverne kommer fra forskellige grundstoffer, fx oxygen (grønblå) og hydrogen (rød).</p>
      <p><b>Den hvide dværg</b> vejer lidt over halvdelen af det, Solen vejer i dag, men er kun på størrelse med Jorden. En teskefuld vejer flere ton. Den lyser kun af sin rest-varme og bliver langsomt koldere. Det tager længere tid, end universet har eksisteret, før en hvid dværg bliver helt kold.</p>`,
    ærligt: '<p>Solen og planeterne er tegnet alt for store i forhold til banerne. Hvis Jordens bane var så stor som her, ville Solen i dag kun være en lille prik. Tiden går også ujævnt: 5 milliarder år og de 10.000 år, tågen lyser, tager lige lang tid her.</p>',
  },

  lav(gruppe, { effekter, lyd, fase, kamera, opdaterKnapper, forklaring }) {
    // ---------- Solen ----------
    const sol = stjerne(1, '#fff1b8', '#ff8a20', GUL.glød.clone(), 2.8, { styrke: 1.5 });
    const solMat = sol.userData.materiale;
    const glorie = sol.userData.glorie;
    gruppe.add(sol);
    let r = TRIN[0].r;
    const lys = GUL.lys.clone(), mørk = GUL.mørk.clone(), glødFarve = GUL.glød.clone();

    // ---------- Planeterne og deres baner ----------
    const planeter = PLANETER.map(([navn, afstand, størrelse, farve]) => {
      const kugle = new THREE.Mesh(new THREE.SphereGeometry(størrelse, 20, 14), new THREE.MeshStandardMaterial({ color: farve, roughness: 0.7, transparent: true }));
      const punkter = [];
      for (let i = 0; i <= 128; i++) punkter.push(new THREE.Vector3(Math.cos((i / 128) * Math.PI * 2), 0, Math.sin((i / 128) * Math.PI * 2)));
      const bane = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(punkter), new THREE.LineBasicMaterial({ color: 0x8fa4d8, transparent: true, opacity: 0.28, depthWrite: false }));
      const navneskilt = skilt(navn, '#cfe0ff', 0.55);
      gruppe.add(kugle, bane, navneskilt);
      return { navn, afstand, kugle, bane, navneskilt, vinkel: Math.random() * Math.PI * 2, synlig: 1, slugt: false };
    });
    const jorden = planeter[2];
    const jordBlå = new THREE.Color(0x4f8fd8), jordBrun = new THREE.Color(0xb88a5a);
    let baneFaktor = 1;

    // ---------- Den planetariske tåge og den hvide dværg ----------
    const NT = Math.round(2200 * KVALITET);
    const tågeRetning = [];
    const tåge = prikSky(NT, 0.34, (i, c) => {
      // Tætte ringe om "ækvator" og mere spredt mod polerne (som Ringtågen)
      const v = new THREE.Vector3().randomDirection();
      v.y *= 0.55 + Math.random() * 0.45;
      v.normalize();
      const indre = Math.random();
      tågeRetning.push({ v, r: 0.75 + indre * 0.45 });
      if (indre < 0.5) c.setRGB(0.35, 1.3, 1.25); // oxygen: grønblå (inderst)
      else c.setRGB(1.6, 0.38, 0.4); // hydrogen og nitrogen: rød (yderst)
    });
    tåge.visible = false;
    gruppe.add(tåge);
    const tågeGlød = glød(new THREE.Color(0.4, 1.0, 1.1), 1, 0);
    gruppe.add(tågeGlød);
    const dværg = new THREE.Group();
    dværg.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.3, 2.7) })));
    const dværgGlød = glød(new THREE.Color(1.3, 1.5, 2.4), 1.6, 0.9);
    dværg.add(dværgGlød);
    dværg.visible = false;
    gruppe.add(dværg);

    let trin = 0;
    let trinTid = 0;
    let tågeTid = -1; // sekunder siden de ydre lag blev blæst af (-1 = ikke endnu)

    function visTrin() {
      const t = TRIN[trin];
      fase(t.titel, t.tekst, [trin + 1, TRIN.length]);
      kamera({ radius: t.radius, flyv: false });
      const [alder, bredde, lysstyrke] = t.panel;
      forklaring(`<p><b>Solens alder:</b> ${alder}</p><p><b>Bredde:</b> ${bredde}</p><p><b>Lysstyrke:</b> ${lysstyrke}</p>`);
      opdaterKnapper();
    }

    function næste() {
      if (trin >= TRIN.length - 1) return;
      trin++;
      trinTid = 0;
      if (trin === 2) lyd.opbygning();
      if (trin === 3) {
        effekter.glimt(new THREE.Vector3(), 6, new THREE.Color(2.4, 2.0, 1.2), 0.9);
        lyd.fusion(2);
      }
      visTrin();
    }

    function nulstil() {
      trin = 0;
      trinTid = 0;
      tågeTid = -1;
      tåge.visible = false;
      tågeGlød.material.opacity = 0;
      dværg.visible = false;
      sol.visible = true;
      r = TRIN[0].r;
      baneFaktor = 1;
      for (const p of planeter) { p.synlig = 1; p.slugt = false; }
      jorden.kugle.material.color.copy(jordBlå);
      visTrin();
    }

    // Trinene står i bjælken. Solen ændrer sig trin for trin, så et trin tilbage starter forfra, og de trin, man
    // springer over, spoles igennem (så planeterne bliver slugt, og tågen bliver blæst af).
    let ud = null;
    function gåTrin(nr) {
      if (nr < 0 || nr >= TRIN.length || nr === trin) return;
      if (nr < trin) nulstil();
      while (trin < nr) {
        næste();
        if (trin < nr) for (let t = 0; t < 8; t += 0.05) ud.opdater(0.05, t);
      }
    }
    const styring = [];

    nulstil();

    return (ud = {
      styring,
      trin: () => ({ nr: trin, ialt: TRIN.length, næste: trin < TRIN.length - 1 ? TRIN[trin + 1].titel.toLowerCase() : '', gå: gåTrin, forfra: nulstil }),
      opdater(dt, tid) {
        trinTid += dt;
        const t = TRIN[trin];
        const glid = 1 - Math.exp(-dt * 1.1);
        // Den planetariske tåge: først svulmer Solen op en sidste gang, så bliver de ydre lag blæst af
        let målR = t.r;
        if (trin === 4) {
          if (trinTid < 2.2) målR = 5.8;
          else if (tågeTid < 0) {
            tågeTid = 0;
            tåge.visible = true;
            effekter.bølge(new THREE.Vector3(), 14, new THREE.Color(1.2, 1.6, 1.8), 2.5);
            lyd.sus(2.5);
          }
        }
        r += (målR - r) * (trin === 4 && tågeTid >= 0 ? 1 - Math.exp(-dt * 4) : glid);
        sol.scale.setScalar(r);
        lys.lerp(t.farve.lys, glid);
        mørk.lerp(t.farve.mørk, glid);
        glødFarve.lerp(t.farve.glød, glid);
        solMat.uniforms.farveLys.value.copy(lys);
        solMat.uniforms.farveMork.value.copy(mørk);
        glorie.material.color.copy(glødFarve);
        glorie.material.opacity += (t.glød - glorie.material.opacity) * glid;
        // Solen pulserer en smule som rød kæmpe
        if (trin === 2) sol.scale.setScalar(r * (1 + 0.012 * Math.sin(tid * 1.3)));

        // Tågen udvider sig, og den hvide dværg bliver synlig
        if (tågeTid >= 0) {
          tågeTid += dt;
          const R = 2 + tågeTid * 1.6;
          const p = tåge.geometry.attributes.position.array;
          tågeRetning.forEach((d, i) => {
            const rr = R * d.r;
            p[i * 3] = d.v.x * rr; p[i * 3 + 1] = d.v.y * rr; p[i * 3 + 2] = d.v.z * rr;
          });
          tåge.geometry.attributes.position.needsUpdate = true;
          // Den lyser stærkt i starten og falmer, når gassen bliver spredt (især i det sidste trin)
          const falm = trin === 5 ? Math.max(0, 1 - trinTid / 4) : 1;
          tåge.material.opacity = Math.min(1, tågeTid / 1.2) * falm;
          tågeGlød.scale.setScalar(R * 2.2);
          tågeGlød.material.opacity = 0.18 * Math.min(1, tågeTid) * falm;
          dværg.visible = true;
          sol.visible = tågeTid < 1.2;
        }
        dværgGlød.scale.setScalar(1.4 + 0.1 * Math.sin(tid * 2));

        // Planeterne kredser (de inderste hurtigst). Banerne vokser, når Solen mister masse.
        baneFaktor += (t.bane - baneFaktor) * glid;
        for (const p of planeter) {
          const afstand = p.afstand * baneFaktor * AU;
          p.vinkel += dt * 0.6 / Math.pow(afstand / AU, 1.5);
          p.kugle.position.set(Math.cos(p.vinkel) * afstand, 0, Math.sin(p.vinkel) * afstand);
          p.bane.scale.setScalar(afstand);
          p.navneskilt.position.copy(p.kugle.position).add(new THREE.Vector3(0, 0.55, 0));
          // Bliver planeten slugt af Solen, forsvinder den (og kommer ikke igen)
          if (sol.visible && afstand < r * 1.02) p.slugt = true;
          p.synlig += ((p.slugt ? 0 : 1) - p.synlig) * (1 - Math.exp(-dt * 3));
          p.kugle.material.opacity = p.synlig;
          p.bane.material.opacity = 0.28 * p.synlig;
          p.navneskilt.material.opacity = p.synlig;
          p.kugle.visible = p.synlig > 0.02;
        }
        // Havene fordamper: Jorden bliver brun
        if (trin >= 1) jorden.kugle.material.color.lerp(jordBrun, 1 - Math.exp(-dt * 0.8));
      },
    });
  },
};
