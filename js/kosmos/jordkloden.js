// Jorden i Solsystemet (Mars M4b i docs/plan-mars.md): kloden og Månen i den rigtige størrelse og afstand, med lyset,
// som det er lige nu. Solens retning, Jordens drejning og Månens plads regnes ud fra tidspunktet (js/data/himmel.js).
// Kloden og Månen er de samme som i Årstiderne og Formørkelser (js/kosmos/jorden.js).
// Tal fra NSSDC's faktaark for Jorden og Månen (docs/fakta-solsystemet.md, del 4).
//
// 1 enhed = 1.000 km. Retningerne er ekliptikkens: y peger mod nord (vinkelret på Jordens bane), z mod forårspunktet
// (Solens længde 0°) og x mod Solens længde 90° (sommersolhverv). Jordaksen hælder mod +x (lavJorden).
// Hele systemet er én gruppe, som kameraets rejse (js/solsystem/rejse.js) flytter, så Månen kan stå i midten.

import * as THREE from 'three';
import { LAV_KVALITET, passerTil } from '../scene3d.js';
import { glød, skilt } from './faelles.js';
import { lavJorden, lavMånen, overflade } from './jorden.js';
import { lavRejse } from '../solsystem/rejse.js';
import { dageSidenJ2000, hældningVed, solen, månen, stjernetid, månefase, faseNavn, solHøjde } from '../data/himmel.js';

const S = 1000; // km pr. enhed
const JORD_R = 6371; // km (NSSDC: middelradius 6.371,0 km)
const MÅNE_R = 1737.4; // km (NSSDC: middelradius 1.737,4 km)
const SOL_R = 695700; // km (NSSDC)
const OMDREJNING = (2 * Math.PI) / 86164.1; // Jordens drejning i forhold til stjernerne (radianer i sekundet, 23 t 56 min 4 s)
const DREJ = 0.06; // "Drej Jorden": radianer i sekundet (et døgn på ca. 1¾ minut, som Mars)
const HURTIG = DREJ / OMDREJNING; // så meget hurtigere går tiden (ca. 820 gange)
const KBH = { bredde: 55.68, længde: 12.57 }; // København
const RAD = Math.PI / 180;
const BANE_DAGE = 27.3217; // Månens omløbstid (NSSDC): banen tegnes en omgang omkring tidspunktet
const DANSK_TID = new Intl.DateTimeFormat('da-DK', { timeZone: 'Europe/Copenhagen', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

// En retning ud fra længde og bredde i ekliptikken (grader)
function ekliptik(længde, bredde, ud = new THREE.Vector3()) {
  const l = længde * RAD, b = bredde * RAD;
  return ud.set(Math.cos(b) * Math.sin(l), Math.sin(b), Math.cos(b) * Math.cos(l));
}

let startRetning = [0.3, 0.3, 1]; // kameraets retning, når Jorden åbnes (sættes i lav, så Danmark og dagsiden ses)

export default {
  id: 'jorden',
  navn: 'Jorden',
  ikon: '🌍',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Vores klode og Månen, lige nu',
  træ: { rod: 'jorden', grupper: [{ navn: 'Måner', punkter: [{ id: 'månen', navn: 'Månen', undertitel: 'Jordens måne, lige nu' }] }] },
  get kamera() { return { retning: startRetning, radius: JORD_R / S, drej: false }; },
  tal: [
    ['Jordens bredde', 'ca. 12.740 km'],
    ['Et døgn', '24 timer'],
    ['Til Månen', 'ca. 384.400 km'],
    ['Månens bredde', 'ca. 3.470 km'],
  ],
  kort: `
    <p><b>Jorden</b> er den tredje planet fra Solen og den eneste, vi kender, hvor der er liv. Lyset passer med lige nu: Den lyse side har dag, og den mørke side har nat. Den gule prik er Danmark. Drej kloden med fingeren, musen eller piletasterne, og zoom ind.</p>
    <p><b>Dag og nat:</b> Jorden drejer om sig selv mod øst én gang i døgnet. Derfor står Solen op i øst og går ned i vest. Tryk "Drej Jorden", så går tiden ca. 800 gange hurtigere, og et døgn varer under 2 minutter. Hvorfor vi har årstider, kan du se i <button class="link-knap" data-gaa="solsystem:aarstider">Årstiderne</button>.</p>
    <p><b>Månen</b> er ca. 3.470 km bred, lidt over en fjerdedel af Jordens bredde. Den er i snit ca. 384.400 km væk, så der er plads til ca. 30 Jorder på række mellem Jorden og Månen. Her står den i den rigtige størrelse og afstand og der, hvor den er i dag. Vælg Månen i listen for at flyve derud.</p>
    <p><b>Månens faser:</b> Månen kredser om Jorden på ca. 27 døgn og drejer om sig selv lige så hurtigt. Derfor vender den altid den samme side mod os. Solen lyser altid på den ene halvdel af Månen. Hvor meget af den lyse halvdel vi ser fra Jorden, kommer an på, hvor Månen står i sin bane. Fra fuldmåne til fuldmåne går der ca. 29½ døgn. Ved nymåne og fuldmåne kan der komme <button class="link-knap" data-gaa="solsystem:formoerkelser">formørkelser</button>.</p>`,
  nørd: `
    <p><b>Tidspunktet:</b> Solens retning, Jordens drejning og Månens plads er regnet ud fra datoen og klokken med de korte formler fra "The Astronomical Almanac". Månens plads passer inden for ca. 0,3°, og grænsen mellem dag og nat passer inden for få minutter.</p>
    <p><b>Månens bane</b> er ikke helt rund, men en ellipse (en lidt aflang cirkel). Afstanden svinger mellem ca. 356.000 og 407.000 km. Banen hælder ca. 5,1° i forhold til Jordens bane om Solen, og derfor er der ikke formørkelse ved hver nymåne og fuldmåne. Linjen viser Månens vej i en måned omkring det tidspunkt, du ser.</p>
    <p><b>Jordens form:</b> Jorden er ca. 12.756 km bred ved ækvator og 12.714 km fra pol til pol. Den er lidt fladtrykt, fordi den drejer. Kuglen her er helt rund.</p>
    <p><b>Et døgn</b> er 24 timer fra middag til middag. I forhold til stjernerne drejer Jorden én gang på 23 timer og 56 minutter. Forskellen kommer af, at Jorden også flytter sig et stykke i sin bane om Solen hver dag, så den skal dreje lidt ekstra, før Solen står samme sted på himlen igen.</p>
    <p><b>Ærligt talt:</b> Billederne er fra NASA (Blue Marble og Black Marble), og skyerne er et øjebliksbillede fra nogle få dage, så de passer ikke med vejret i dag. Bjergene er gjort højere end i virkeligheden, så de kan ses. Solen er tegnet som en lille prik langt væk. Når du trykker "Drej Jorden", går tiden ca. 800 gange hurtigere, og Månen flytter sig i sin bane imens.</p>`,

  lav(gruppe, { opdaterKnapper, forklaring, overlag, verden }) {
    const { kamera } = verden;
    const orbit = verden.styring; // kameraets styring med mus og fingre
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, fjern: kamera.far };
    orbit.minDistance = 0.001; // rejsen holder selv afstanden (i systemets enheder)
    orbit.maxDistance = 1e5;
    kamera.near = 0.01;
    kamera.far = 20000;
    kamera.updateProjectionMatrix();

    let nu = Date.now(); // tidspunktet, der vises (går ca. 820 gange hurtigere, når Jorden drejer)
    let d = dageSidenJ2000(new Date(nu));

    // ---------- Jorden, Månen og Månens bane ----------
    const system = new THREE.Group();
    gruppe.add(system);
    const jR = JORD_R / S, mR = MÅNE_R / S;
    const jorden = lavJorden(jR, { hældning: hældningVed(d) });
    const måneKlode = lavMånen(mR);
    system.add(jorden.klode, måneKlode.måne);
    // Danmark: en lille gul prik, der drejer med Jorden
    const danmark = glød(0xffd166, jR * 0.06);
    danmark.position.copy(overflade(KBH.bredde, KBH.længde, jR * 1.006));
    jorden.omdrejning.add(danmark);
    const måneNavn = skilt('Månen', '#cfe0ff', 1);
    system.add(måneNavn);
    const baneGeo = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 241 }, () => new THREE.Vector3()));
    const bane = new THREE.Line(baneGeo, new THREE.LineBasicMaterial({ color: 0x8aa6d8, transparent: true, opacity: 0.25, depthWrite: false }));
    system.add(bane);
    let baneDag = null; // tidspunktet, banen er tegnet omkring
    function tegnBane() {
      baneDag = d;
      const p = baneGeo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) {
        const m = månen_(d + (i / (p.count - 1) - 0.5) * BANE_DAGE, v);
        p.setXYZ(i, m.x, m.y, m.z);
      }
      p.needsUpdate = true;
      baneGeo.computeBoundingSphere();
    }
    // Månens plads (systemets enheder) på dag d
    function månen_(dag, ud) {
      const m = månen(dag);
      return ekliptik(m.længde, m.bredde, ud).multiplyScalar(m.afstand / S);
    }

    // Solen: en lille, skarp prik langt væk i lysets retning
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.024 : 0.02);
    const solGlød = glød(0xffe2b0, 0.2, 0.55);
    for (const s of [solKerne, solGlød]) {
      s.material.sizeAttenuation = false;
      s.renderOrder = -1;
      gruppe.add(s);
    }

    // ---------- Tidspunktet: Solen, Jordens drejning og Månen ----------
    const solRetning = new THREE.Vector3();
    const månePos = new THREE.Vector3();
    function stil() {
      d = dageSidenJ2000(new Date(nu));
      const s = solen(d);
      ekliptik(s.længde, 0, solRetning);
      // Greenwich står stjernetiden mod øst for forårspunktet (+z). Længde 0° på kuglen peger mod +x, 90° øst mod -z.
      jorden.omdrejning.rotation.y = (stjernetid(d) - 90) * RAD;
      månen_(d, månePos);
      måneKlode.måne.position.copy(månePos);
      if (baneDag === null || Math.abs(d - baneDag) > 0.5) tegnBane();
    }
    stil();
    // Kameraet starter, så man ser Danmark og lidt af dagsiden
    {
      jorden.klode.updateMatrixWorld(true);
      const dk = danmark.getWorldPosition(new THREE.Vector3()).normalize();
      const r = dk.multiplyScalar(1.2).add(solRetning).normalize();
      startRetning = [r.x, r.y + 0.15, r.z];
    }

    // ---------- Kameraets rejse ----------
    const rejse = lavRejse({ system, verden, nær: 0.01 }); // nær: systemet skaleres aldrig (Jorden og Månen er store nok)
    rejse.grænser(jR * 1.08, 450);
    const nul = new THREE.Vector3();
    function passer(radius) {
      passerTil(10);
      const f = (verden.målAfstand ?? 40) / 10;
      verden.målAfstand = null;
      return radius * f;
    }
    let ved = 'jorden';
    function flyv(til) {
      ved = til;
      if (til === 'månen') {
        const tilJorden = månePos.clone().normalize().negate();
        const retning = solRetning.clone().add(tilJorden).add(new THREE.Vector3(0, 0.35, 0)).normalize();
        rejse.flyv({ fokus: () => månePos, afstand: passer(mR * 1.1), retning, min: mR * 1.15, max: 450 });
      } else {
        const retning = kamera.position.clone().sub(orbit.target).normalize(); // samme retning som nu
        rejse.flyv({ fokus: () => nul, afstand: passer(jR * 1.02), retning, min: jR * 1.08, max: 450 });
      }
      vis();
    }

    // ---------- Knapperne og teksten ----------
    let drejer = false;
    const styring = [
      { tekst: 'Drej Jorden', til: drejer, skift: (til) => { drejer = til; vis(); } },
    ];
    function vis() {
      if (ved === 'månen') {
        forklaring('<p><b>Månen:</b> Drej kameraet rundt, så kan du se Jorden langt væk. Der er plads til ca. 30 Jorder på række mellem Jorden og Månen. Den samme side af Månen vender altid mod Jorden. Tryk på Jorden i listen for at flyve tilbage.</p>');
        return;
      }
      forklaring(drejer
        ? '<p><b>Jorden drejer:</b> Tiden går nu ca. 800 gange hurtigere. Se Danmark (den gule prik) komme ind i dagen om morgenen og ud i natten om aftenen. Månen flytter sig også lidt i sin bane.</p>'
        : '<p><b>Lige nu:</b> Den lyse side har dag, og den mørke side har nat. Om natten kan du se lyset fra byerne. Den gule prik er Danmark. Uret nederst viser tiden i Danmark, og om Solen er oppe.</p>');
    }
    vis();
    opdaterKnapper();

    // Uret nederst i 3D-billedet (skrives kun om, når teksten ændrer sig)
    const ur = document.createElement('div');
    ur.className = 'kosmos-graf jord-ur';
    const linje1 = document.createElement('span');
    const linje2 = document.createElement('span');
    ur.append(linje1, linje2);
    overlag().append(ur);
    function skrivUr() {
      const oppe = solHøjde(d, KBH.bredde, KBH.længde) > -0.833; // Solens øverste kant over horisonten (med lysbrydning)
      const fase = månefase(d);
      const afstand = Math.round(månen(d).afstand / 100) * 100;
      const t1 = `Danmark: ${DANSK_TID.format(new Date(nu))}. Solen er ${oppe ? 'oppe' : 'nede'}.`;
      const t2 = `Månen: ${faseNavn(fase)}, ${Math.round(fase.belyst * 100)} % belyst, ${afstand.toLocaleString('da-DK')} km væk.`;
      if (linje1.textContent !== t1) linje1.textContent = t1;
      if (linje2.textContent !== t2) linje2.textContent = t2;
    }
    skrivUr();
    let urTid = 0;

    // ---------- Hvert billede: kameraet, lys og skygger ----------
    const hjælp = new THREE.Vector3();
    const solPos = new THREE.Vector3();
    const månePosV = new THREE.Vector3();
    const jordPosV = new THREE.Vector3();
    function hvertBillede() {
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solRetning, 600);
      // Solen står i den rigtige afstand (ca. 150 mio. km), så skyggerne har den rigtige størrelse
      solPos.copy(solRetning).multiplyScalar(solen(d).afstand / S);
      system.localToWorld(solPos);
      måneKlode.måne.getWorldPosition(månePosV);
      jorden.klode.getWorldPosition(jordPosV);
      jorden.sætLys(solPos, SOL_R / S, månePosV, mR);
      måneKlode.sætLys(solPos, SOL_R / S, jordPosV, jR);
      måneKlode.vend(jordPosV);
      // Navnet ses kun, når Månen er lille på skærmen. Banen forsvinder tæt på Månen (den skærer gennem den).
      const afstand = månePosV.distanceTo(kamera.position);
      måneNavn.visible = mR / afstand < 0.03;
      const str = afstand * 0.018;
      måneNavn.scale.set((måneNavn.scale.x / måneNavn.scale.y) * str, str, 1);
      måneNavn.position.copy(månePos).add(hjælp.set(0, mR + str * 0.8, 0));
      bane.material.opacity = 0.25 * THREE.MathUtils.smoothstep(afstand, 20, 80);
    }
    function hvertBilledeMedRejse(dt) {
      rejse.opdater(dt);
      hvertBillede();
    }
    verden.opdateringer.add(hvertBilledeMedRejse);

    return {
      styring,
      gåTil: (id) => flyv(id), // træet i listen (js/faenomenskaerm.js): 'jorden' eller 'månen'
      sted: () => ved,
      opdater(dt) {
        nu += dt * 1000 * (drejer ? HURTIG : 1);
        stil();
        urTid += dt;
        if (urTid > 0.25) {
          urTid = 0;
          skrivUr();
        }
      },
      stop() {
        verden.opdateringer.delete(hvertBilledeMedRejse);
        rejse.stop();
        baneGeo.dispose();
        bane.material.dispose();
        orbit.minDistance = gammelt.min;
        orbit.maxDistance = gammelt.max;
        kamera.near = gammelt.nær;
        kamera.far = gammelt.fjern;
        kamera.updateProjectionMatrix();
      },
      // Kun til tests
      test: {
        tid: () => nu,
        sætTid(ms) { nu = ms; stil(); skrivUr(); },
        ved: () => ved,
        flyver: () => rejse.flyver,
        hop: () => rejse.hop(),
        ur: () => [linje1.textContent, linje2.textContent],
        // Punktet, hvor Solen står lige over hovedet, regnet ud fra 3D-billedet (kuglens egne retninger)
        solUnder() {
          jorden.klode.updateMatrixWorld(true);
          const q = jorden.omdrejning.getWorldQuaternion(new THREE.Quaternion()).invert();
          const v = solRetning.clone().applyQuaternion(system.getWorldQuaternion(new THREE.Quaternion())).applyQuaternion(q);
          return { bredde: Math.asin(v.y) / RAD, længde: Math.atan2(-v.z, v.x) / RAD };
        },
        // Nordpolens retning, Månens afstand fra Jordens midte og radius (km)
        nordpol: () => new THREE.Vector3(0, 1, 0).applyQuaternion(jorden.hældning.getWorldQuaternion(new THREE.Quaternion())).toArray(),
        måne: () => ({ afstand: månePos.length() * S, radius: MÅNE_R, jord: JORD_R, solRetning: solRetning.toArray(), måneRetning: månePos.clone().normalize().toArray() }),
        drejning: () => jorden.omdrejning.rotation.y,
      },
    };
  },
};
