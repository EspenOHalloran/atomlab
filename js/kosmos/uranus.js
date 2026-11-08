// Uranus (docs/plan-uranus-neptun.md). UN1: kloden og skelettet. UN2: årstiderne (skyderen "År" og kappen) og ringene. Koden er fælles med Neptun (js/solsystem/isgigant.js).
// Tallene står i docs/fakta-solsystemet/del6-uranus-og-neptun.md og js/data/isgiganter.js.

import { lavIsgigant } from '../solsystem/isgigant.js';
import { SIDE } from '../data/sider/uranus.js';

export default lavIsgigant({
  id: 'uranus',
  navn: 'Uranus',
  ikon: '🩵',
  undertitel: 'Planeten, der ligger på siden',
  kort: 'uranus',
  kantFarve: [0.85, 0.95, 1.0],
  // UN2: skyderen "År" (1986, da Voyager 2 kom, til 2070, jeres svar 6), de mørke ringe og kappen over polerne
  år: { fra: 1986, til: 2070 },
  ringe: 'uranus',
  kapper: true,
  tal: [
    ['Uranus\' bredde', 'ca. 51.000 km'],
    ['Døgn', '17 t 14 min'],
    ['Vægt', 'ca. 14,5 Jorder'],
    ['Afstand til Solen', 'ca. 2,9 mia. km'],
  ],
  side: SIDE,
});
