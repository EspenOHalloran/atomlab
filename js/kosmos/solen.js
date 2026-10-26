// Solen i Solsystemet (Mars M4b i docs/plan-mars.md): den kogende overflade fra Kosmos, tal og et link til Stjerneovnen.
// "Jorden ved siden af" viser en lille Jord i den rigtige størrelse (Solen er ca. 109 gange bredere).
// Tal fra NSSDC's faktaark for Solen og NASA (docs/fakta-solsystemet.md, del 4).

import * as THREE from 'three';
import { stjerne, skilt } from './faelles.js';
import { lavJorden } from './jorden.js';

const SOL_KM = 695700; // Solens radius (NSSDC)
const JORD_KM = 6371; // Jordens radius (NSSDC)
const SOL_R = 5; // Solens radius i animationen
const JORD_R = (SOL_R * JORD_KM) / SOL_KM; // ca. 0,046: 109 gange mindre
const JORD_PLADS = new THREE.Vector3(SOL_R * 1.3, 0, 0); // tæt ved Solen, så begge kan ses (ikke den rigtige afstand)

export default {
  id: 'solen',
  navn: 'Solen',
  ikon: '☀️',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Vores stjerne',
  kamera: { retning: [0.15, 0.25, 1], radius: SOL_R, drej: true },
  tal: [
    ['Solens bredde', 'ca. 1,39 mio. km'],
    ['Overfladen', 'ca. 5.500 °C'],
    ['I midten', 'ca. 15 mio. °C'],
    ['Massen', 'ca. 333.000 Jorder'],
  ],
  hvorfor: ['stjerner'],
  kort: `
    <p><b>Solen</b> er en stjerne: en kæmpe kugle af glødende gas, mest brint (hydrogen) og helium. Inde i midten smelter brintkerner sammen til helium. Det kaldes fusion, og det er det, der får Solen til at lyse. <a class="link-knap" href="#fusion">Prøv selv i Stjerneovnen ›</a></p>
    <p><b>Den er kæmpestor:</b> 109 Jorder kan ligge på række hen over Solen, og der er plads til ca. 1,3 mio. Jorder inden i den. Tryk "Jorden ved siden af" for at se, hvor lille Jorden er.</p>
    <p><b>I midten</b> er der ca. 15 mio. °C og et kæmpe tryk. Hvert sekund bliver ca. 4 mio. ton af Solens masse til energi. Ca. 9 ud af 10 atomer i overfladen er brint, og næsten resten er helium. Solen er ca. 4,6 mia. år gammel og er nogenlunde halvvejs gennem sit liv.</p>
    <p><b>Overfladen bobler:</b> Den er ca. 5.500 °C. Varm gas stiger op, bliver afkølet og synker ned igen, ligesom suppe, der simrer i en gryde. Lyset fra overfladen er lidt over 8 minutter om at nå Jorden.</p>
    <p><b>Solen drejer</b> om sig selv, men den er ikke fast, så ækvator drejer hurtigere (en omgang på ca. 25 døgn) end polerne (ca. 36 døgn). Se også <button class="link-knap" data-gaa="solsystem:solstorm">Solstorm</button> og <button class="link-knap" data-gaa="solsystem:solensfremtid">Solens fremtid</button>.</p>`,
  nørd: `
    <p><b>Tallene</b> er fra NASA (NSSDC's faktaark om Solen): Radius 695.700 km, massen ca. 2 · 10³⁰ kg (et 2-tal med 30 nuller, 333.000 gange Jordens), overfladen 5.772 K (ca. 5.500 °C) og midten ca. 15,7 mio. K. Ca. 91 % af atomerne i overfladen er brint og ca. 9 % helium. Regnet efter vægt fylder helium mere, ca. en fjerdedel, for et heliumatom vejer ca. 4 gange så meget som et brintatom.</p>
    <p><b>Masse bliver til energi:</b> Solen sender 3,8 · 10²⁶ watt ud som lys og varme. Med Einsteins E = mc² svarer det til ca. 4,3 mio. ton masse i sekundet. Det lyder af meget, men på 4,6 mia. år er det højst ca. 0,03 % af Solens masse (den unge Sol lyste lidt svagere).</p>
    <p><b>Lyset:</b> Solen er i snit 149,6 mio. km fra Jorden, og lyset kører ca. 300.000 km i sekundet. Det giver 499 sekunder, altså 8 minutter og 19 sekunder.</p>
    <p><b>Ærligt talt:</b> Overfladen er tegnet af programmet, så den ligner boblende gas. I virkeligheden er der ca. 4 millioner "bobler" (granuler) på én gang, hver ca. 1.500 km bred, og der er ingen solpletter her. Gløden om Solen er pynt. Med "Jorden ved siden af" står Jorden i den rigtige størrelse, men alt for tæt på. I virkeligheden er Jorden ca. 107 gange Solens bredde væk.</p>`,

  lav(gruppe, { opdaterKnapper, forklaring, kamera }) {
    const sol = stjerne(SOL_R, '#ffe08a', '#e0661a', new THREE.Color(2.2, 1.3, 0.4), 2.6, { skala: 4.5 });
    gruppe.add(sol);

    // Jorden i den rigtige størrelse ved siden af (vises med knappen)
    const jorden = lavJorden(JORD_R);
    jorden.klode.position.copy(JORD_PLADS);
    jorden.sætLys(new THREE.Vector3(), SOL_R);
    const navn = skilt('Jorden', '#cfe0ff', 0.8);
    navn.position.copy(JORD_PLADS).add(new THREE.Vector3(0, 0.6, 0));
    const med = new THREE.Group();
    med.add(jorden.klode, navn);
    med.visible = false;
    gruppe.add(med);

    function vis() {
      forklaring(med.visible
        ? '<p><b>Jorden ved siden af:</b> Den lille prik til højre er Jorden i den rigtige størrelse. Der kan ligge 109 Jorder på række hen over Solen. Zoom ind på Jorden for at se den.</p>'
        : '<p><b>Solen:</b> Overfladen er ca. 5.500 °C varm og bobler. Varm gas stiger op, og køligere gas synker ned igen. Langt inde i midten laver fusion lyset.</p>');
    }
    const styring = [
      {
        tekst: 'Jorden ved siden af', til: false,
        skift: (til) => {
          med.visible = til;
          kamera(til
            ? { retning: [0.1, 0.12, 1], radius: SOL_R * 1.45, mål: [SOL_R * 0.3, 0, 0], drej: false, flyv: false }
            : { retning: [0.15, 0.25, 1], radius: SOL_R, drej: true, flyv: false });
          vis();
        },
      },
    ];
    vis();
    opdaterKnapper();

    let tid = 0;
    return {
      styring,
      opdater(dt) {
        tid += dt;
        sol.rotation.y = tid * 0.03;
        jorden.omdrejning.rotation.y = tid * 0.2;
      },
      // Kun til tests: Solens og Jordens radius i animationen, og om Jorden vises
      test: { radier: () => ({ sol: SOL_R, jorden: JORD_R }), jordenVist: () => med.visible },
    };
  },
};
