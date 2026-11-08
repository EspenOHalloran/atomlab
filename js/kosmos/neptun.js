// Neptun (docs/plan-uranus-neptun.md). UN1: kloden og skelettet. UN3: vejret (høje skyer, "Neptun i 1989", Voyagers
// farver og pilene) og ringene med buerne. Koden er fælles med Uranus (js/solsystem/isgigant.js).
// Tallene står i docs/fakta-solsystemet/del6-uranus-og-neptun.md og js/data/isgiganter.js.

import { lavIsgigant } from '../solsystem/isgigant.js';
import { SIDE } from '../data/sider/neptun.js';

export default lavIsgigant({
  id: 'neptun',
  navn: 'Neptun',
  ikon: '🔵',
  undertitel: 'Den yderste planet',
  kort: 'neptun',
  kantFarve: [0.85, 0.95, 1.0],
  ringe: 'neptun',
  vejr: true,
  tal: [
    ['Neptuns bredde', 'ca. 49.500 km'],
    ['Døgn', '16 t 7 min'],
    ['Vægt', 'ca. 17 Jorder'],
    ['Afstand til Solen', 'ca. 4,5 mia. km'],
  ],
  side: SIDE,
});
