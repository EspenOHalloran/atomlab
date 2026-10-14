// Ormehul: universet tegnet som et stykke papir, der er foldet, så to fjerne steder ligger over hinanden.
// Ormehullet er en tunnel mellem dem. Lyset tager den lange vej rundt, rumskibet tager genvejen.

import * as THREE from 'three';
import { glød, skilt, hale } from './faelles.js';

const H = 4; // halvdelen af afstanden mellem de to lag
const B = 1.3; // ormehullets smalleste radius
const S = 1.2; // hvor hurtigt tragten flader ud
const HUL_X = -8; // hvor ormehullet er
const KANT_X = 22; // hvor papiret er foldet
const DYBDE = 10; // papirets bredde (z går fra -DYBDE til DYBDE)
const START_X = -2; // hvor kapløbet starter (og slutter på det andet lag)
const LYS_FART = 10;
const SKIB_FART = 3;

// Højden over midten: 0 i ormehullet og næsten H langt fra det
const højde = (r) => H * (1 - Math.exp(-Math.sqrt(Math.max(0, r - B) / S)));

export default {
  id: 'ormehul',
  navn: 'Ormehul',
  ikon: '🌀',
  undertitel: 'En genvej gennem rumtiden (hvis de findes)',
  citat: 'einsteinNysgerrighed',
  kamera: { retning: [0.75, 0.32, 1], radius: 16, mål: [3, 0, 0], drej: false },
  tal: [
    ['Fundet i Einsteins ligninger', '1935'],
    ['Navnet "ormehul"', 'John Wheeler, 1957'],
    ['Ormehuller set', 'ingen'],
    ['Kræver', 'stof, ingen har fundet'],
  ],
  kort: `
    <p>Et <b>ormehul</b> er en tænkt genvej gennem rumtiden. Forestil dig, at universet er et stykke papir, der er bøjet, så to steder, der ligger langt fra hinanden, kommer til at ligge lige over hinanden. Et ormehul ville være en tunnel mellem dem.</p>
    <p>Ingen har nogensinde set et ormehul. De er en mulighed i Einsteins ligninger, men måske findes de slet ikke. Hvis de findes, ville de klappe sammen med det samme, medmindre noget holdt dem åbne.</p>
    <p>Start kapløbet: Lyset tager den lange vej rundt, og rumskibet tager genvejen.</p>`,
  nørd: `
    <p><b>Einstein-Rosen-broen:</b> I 1935 fandt Albert Einstein og Nathan Rosen ud af, at hans ligninger tillader en "bro" mellem to steder i rumtiden. John Wheeler kaldte det senere et ormehul, ligesom en orm, der æder sig gennem et æble i stedet for at kravle rundt om det.</p>
    <p><b>Eksotisk stof:</b> I 1988 regnede Kip Thorne og Michael Morris ud, at man kunne rejse gennem et ormehul, hvis det blev holdt åbent af stof med <i>negativ energi</i>. Små mængder negativ energi findes faktisk i kvantefysikken (Casimir-effekten), men ingen ved, om der kan blive nok.</p>
    <p><b>En kugle, ikke en tragt:</b> Tragten her er en tegning i to dimensioner. Et rigtigt ormehul i vores tredimensionelle rum ville have en åbning, der ligner en kugle. Kigger man ind i den, ser man stjernerne på den anden side. Sådan blev det vist i filmen <i>Interstellar</i>, hvor Kip Thorne var rådgiver.</p>
    <p><b>Tidsrejser?</b> Hvis den ene ende af et ormehul blev fløjet rundt med næsten lysets fart, ville tiden gå langsommere der. Så kunne ormehullet i teorien blive en tidsmaskine. Stephen Hawking mente, at naturen må forhindre det.</p>
    <p><b>Ærligt talt:</b> Der findes ikke noget "udenfor" universet, som det kunne være foldet i. Foldningen er bare en måde at tegne det på.</p>`,

  lav(gruppe, { effekter, lyd, fase, kamera }) {
    // Nettet: to lag forbundet af tragten (ormehullet) og af folden ude til højre
    const pos = [];
    const farver = [];
    const top = new THREE.Color(0.25, 0.55, 1.1);
    const bund = new THREE.Color(0.65, 0.35, 1.1);
    const hals = new THREE.Color(0.4, 0.5, 1.05);
    const c = new THREE.Color();
    const streg = (a, b, fa, fb) => {
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      farver.push(fa.r, fa.g, fa.b, fb.r, fb.g, fb.b);
    };
    const punkt = (x, z, side) => new THREE.Vector3(x, side * højde(Math.hypot(x - HUL_X, z)), z);
    const farveVed = (x, z, side) => {
      const r = Math.hypot(x - HUL_X, z);
      return c.copy(side > 0 ? top : bund).lerp(hals, Math.max(0, 1 - (r - B) / 4)).clone();
    };
    const DEL = 0.5;
    for (const side of [1, -1]) {
      // Linjer langs x
      for (let z = -DYBDE; z <= DYBDE + 0.01; z += 1.25) {
        for (let x = -22; x < KANT_X - 0.01; x += DEL) {
          if (Math.hypot(x - HUL_X, z) < B + 0.15 || Math.hypot(x + DEL - HUL_X, z) < B + 0.15) continue;
          streg(punkt(x, z, side), punkt(x + DEL, z, side), farveVed(x, z, side), farveVed(x + DEL, z, side));
        }
      }
      // Linjer langs z
      for (let x = -22; x <= KANT_X + 0.01; x += 1.25) {
        for (let z = -DYBDE; z < DYBDE - 0.01; z += DEL) {
          if (Math.hypot(x - HUL_X, z) < B + 0.15 || Math.hypot(x - HUL_X, z + DEL) < B + 0.15) continue;
          streg(punkt(x, z, side), punkt(x, z + DEL, side), farveVed(x, z, side), farveVed(x, z + DEL, side));
        }
      }
      // Tragten: ringe og linjer ned gennem halsen
      for (let k = 0; k <= 6; k++) {
        const r = B + 0.02 + k * k * 0.12;
        for (let i = 0; i < 48; i++) {
          const v1 = (i / 48) * Math.PI * 2, v2 = ((i + 1) / 48) * Math.PI * 2;
          const a = new THREE.Vector3(HUL_X + Math.cos(v1) * r, side * højde(r), Math.sin(v1) * r);
          const b = new THREE.Vector3(HUL_X + Math.cos(v2) * r, side * højde(r), Math.sin(v2) * r);
          streg(a, b, hals, hals);
        }
      }
      for (let i = 0; i < 16; i++) {
        const v = (i / 16) * Math.PI * 2;
        let forrige = null;
        for (let k = 0; k <= 20; k++) {
          const r = B + (k / 20) ** 2 * 5;
          const p = new THREE.Vector3(HUL_X + Math.cos(v) * r, side * højde(r), Math.sin(v) * r);
          if (forrige) streg(forrige, p, hals, hals);
          forrige = p;
        }
      }
    }
    // Folden: halvcirkler, der forbinder de to lag ude ved kanten
    const kantH = højde(KANT_X - HUL_X);
    for (let z = -DYBDE; z <= DYBDE + 0.01; z += 1.25) {
      let forrige = null;
      for (let i = 0; i <= 24; i++) {
        const v = Math.PI / 2 - (i / 24) * Math.PI;
        const p = new THREE.Vector3(KANT_X + Math.cos(v) * kantH, Math.sin(v) * kantH, z);
        const f = top.clone().lerp(bund, i / 24);
        if (forrige) streg(forrige.p, p, forrige.f, f);
        forrige = { p, f };
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(farver, 3));
    const net = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }));
    gruppe.add(net);

    // Et skær i halsen (det mærkelige stof, der skulle holde den åben)
    const halsRing = new THREE.Mesh(
      new THREE.TorusGeometry(B, 0.08, 10, 64),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 0.9, 2.4), transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    halsRing.rotation.x = Math.PI / 2;
    halsRing.position.x = HUL_X;
    const halsGlød = glød(new THREE.Color(0.8, 0.55, 1.6), 4, 0.35);
    halsGlød.position.x = HUL_X;
    gruppe.add(halsRing, halsGlød);

    // Steder og skilte
    const her = new THREE.Vector3(START_X, højde(START_X - HUL_X), 0);
    const der = new THREE.Vector3(START_X, -højde(START_X - HUL_X), 0);
    const mærke = (p, farve) => {
      const g = glød(farve, 1.6, 0.9);
      g.position.copy(p);
      gruppe.add(g);
    };
    mærke(her, new THREE.Color(0.6, 1.6, 0.8));
    mærke(der, new THREE.Color(1.8, 0.8, 0.6));
    const s1 = skilt('Her', '#8ce99a', 1.5);
    s1.position.copy(her).add(new THREE.Vector3(0, 1.2, 0));
    const s2 = skilt('Langt, langt væk', '#ffb36b', 1.5);
    s2.position.copy(der).add(new THREE.Vector3(0, -1.4, 0));
    const s3 = skilt('Ormehullet', '#d0b0ff', 1.5);
    s3.position.set(HUL_X, H + 1.3, 0);
    gruppe.add(s1, s2, s3);

    // Kapløbet
    const lys = glød(new THREE.Color(2.6, 2.3, 1.2), 1.4, 0);
    const skib = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x8fb4ff, emissiveIntensity: 0.8 }));
    skib.visible = false;
    const lysHale = hale(70, 0xffe08a, 0.8);
    const skibHale = hale(70, 0x9fd3ff, 0.8);
    lysHale.linje.visible = skibHale.linje.visible = false;
    gruppe.add(lys, skib, lysHale.linje, skibHale.linje);

    // Lysets vej: hen ad det øverste lag, rundt i folden og tilbage ad det nederste lag
    const lysVej = new THREE.CurvePath();
    const ligeStykke = (fra, til, side) => {
      const punkter = [];
      for (let i = 0; i <= 30; i++) {
        const x = fra + ((til - fra) * i) / 30;
        punkter.push(new THREE.Vector3(x, side * højde(Math.abs(x - HUL_X)) + side * 0.15, 0));
      }
      return new THREE.CatmullRomCurve3(punkter);
    };
    lysVej.add(ligeStykke(START_X, KANT_X, 1));
    const foldPunkter = [];
    for (let i = 0; i <= 24; i++) {
      const v = Math.PI / 2 - (i / 24) * Math.PI;
      foldPunkter.push(new THREE.Vector3(KANT_X + Math.cos(v) * (kantH + 0.15), Math.sin(v) * (kantH + 0.15), 0));
    }
    lysVej.add(new THREE.CatmullRomCurve3(foldPunkter));
    lysVej.add(ligeStykke(KANT_X, START_X, -1));
    const lysLængde = lysVej.getLength();

    // Skibets vej: ned gennem tragten og op på den anden side
    const skibPunkter = [];
    const r0 = START_X - HUL_X;
    for (let i = 0; i <= 40; i++) {
      const r = r0 - ((r0 - B) * i) / 40;
      skibPunkter.push(new THREE.Vector3(HUL_X + r, højde(r) + 0.25 * (r / r0), 0));
    }
    for (let i = 1; i <= 40; i++) {
      const r = B + ((r0 - B) * i) / 40;
      skibPunkter.push(new THREE.Vector3(HUL_X + r, -højde(r) - 0.25 * (r / r0), 0));
    }
    const skibVej = new THREE.CatmullRomCurve3(skibPunkter);
    const skibLængde = skibVej.getLength();

    let løb = null; // { t, lysFærdig, skibFærdig }
    let tid = 0;
    const p = new THREE.Vector3();
    const retning = new THREE.Vector3();

    return {
      styring: [
        {
          tekst: '🏁 Start kapløbet', handling: () => {
            løb = { t: 0, lys: null, skib: null };
            lys.material.opacity = 1;
            skib.visible = true;
            lysHale.linje.visible = skibHale.linje.visible = true;
            lysHale.nulstil(her);
            skibHale.nulstil(her);
            lyd.sus(1);
            fase('Kapløb!', 'Lyset er det hurtigste, der findes. Men det må tage den lange vej rundt. Rumskibet er meget langsommere, men tager genvejen gennem ormehullet.');
          }, deaktiv: () => løb !== null,
        },
        {
          tekst: '👀 Se det fra siden', til: false, skift: (til) => kamera(til
            ? { retning: [0.02, 0.05, 1], radius: 17, mål: [3, 0, 0], drej: false, flyv: false }
            : { retning: [0.75, 0.32, 1], radius: 16, mål: [3, 0, 0], drej: false, flyv: false }),
        },
      ],
      opdater(dt) {
        tid += dt;
        halsRing.material.opacity = 0.6 + 0.3 * Math.sin(tid * 2.2);
        halsGlød.material.opacity = 0.25 + 0.12 * Math.sin(tid * 2.2 + 1);
        if (!løb) return;
        løb.t += dt;
        // Lyset
        const lt = Math.min(1, (løb.t * LYS_FART) / lysLængde);
        lysVej.getPointAt(lt, p);
        lys.position.copy(p);
        lysHale.følg(p);
        // Skibet
        const st = Math.min(1, (løb.t * SKIB_FART) / skibLængde);
        skibVej.getPointAt(st, p);
        skib.position.copy(p);
        skibVej.getTangentAt(st, retning);
        skib.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), retning);
        skibHale.følg(p);
        if (st >= 1 && løb.skib === null) {
          løb.skib = løb.t;
          effekter.glimt(der, 3, new THREE.Color(0.8, 1.4, 2.4), 0.6);
          lyd.klaret();
          fase('Rumskibet er fremme!', `Det tog rumskibet ${løb.skib.toFixed(1).replace('.', ',')} sekunder gennem ormehullet. Lyset er stadig på vej rundt.`);
        }
        if (lt >= 1 && løb.lys === null) {
          løb.lys = løb.t;
          effekter.glimt(der, 3, new THREE.Color(2.4, 2, 1), 0.6);
          fase('Rumskibet vandt!', `Rumskibet: ${løb.skib.toFixed(1).replace('.', ',')} s. Lyset: ${løb.lys.toFixed(1).replace('.', ',')} s. Selv om lyset er meget hurtigere, vinder genvejen.`);
        }
        if (løb.lys !== null && løb.t > løb.lys + 3) {
          løb = null;
          lys.material.opacity = 0;
          skib.visible = false;
          lysHale.linje.visible = skibHale.linje.visible = false;
        }
      },
    };
  },
};
