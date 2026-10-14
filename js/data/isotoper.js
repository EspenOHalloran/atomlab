// Isotoper: Hvilke kerner er stabile, og hvor længe lever de ustabile?
// En isotop skrives som "symbol-massetal", fx C-14 (6 protoner + 8 neutroner).

import { grundstof } from './grundstoffer.js';

// Stabile isotoper (massetal) for hvert grundstof. Tc (43), Pm (61) og alt fra nr. 84 har ingen.
const STABILE = {
  1: [1, 2], 2: [3, 4], 3: [6, 7], 4: [9], 5: [10, 11], 6: [12, 13], 7: [14, 15], 8: [16, 17, 18],
  9: [19], 10: [20, 21, 22], 11: [23], 12: [24, 25, 26], 13: [27], 14: [28, 29, 30], 15: [31],
  16: [32, 33, 34, 36], 17: [35, 37], 18: [36, 38, 40], 19: [39, 41], 20: [40, 42, 43, 44, 46],
  21: [45], 22: [46, 47, 48, 49, 50], 23: [51], 24: [50, 52, 53, 54], 25: [55], 26: [54, 56, 57, 58],
  27: [59], 28: [58, 60, 61, 62, 64], 29: [63, 65], 30: [64, 66, 67, 68, 70], 31: [69, 71],
  32: [70, 72, 73, 74], 33: [75], 34: [74, 76, 77, 78, 80], 35: [79, 81], 36: [80, 82, 83, 84, 86],
  37: [85], 38: [84, 86, 87, 88], 39: [89], 40: [90, 91, 92, 94], 41: [93], 42: [92, 94, 95, 96, 97, 98],
  44: [96, 98, 99, 100, 101, 102, 104], 45: [103], 46: [102, 104, 105, 106, 108, 110], 47: [107, 109],
  48: [106, 108, 110, 111, 112, 114], 49: [113], 50: [112, 114, 115, 116, 117, 118, 119, 120, 122, 124],
  51: [121, 123], 52: [120, 122, 123, 124, 125, 126], 53: [127], 54: [126, 128, 129, 130, 131, 132, 134],
  55: [133], 56: [132, 134, 135, 136, 137, 138], 57: [139], 58: [136, 138, 140, 142], 59: [141],
  60: [142, 143, 145, 146, 148], 62: [144, 149, 150, 152, 154], 63: [153], 64: [154, 155, 156, 157, 158, 160],
  65: [159], 66: [156, 158, 160, 161, 162, 163, 164], 67: [165], 68: [162, 164, 166, 167, 168, 170],
  69: [169], 70: [168, 170, 171, 172, 173, 174, 176], 71: [175], 72: [176, 177, 178, 179, 180], 73: [181],
  74: [182, 183, 184, 186], 75: [185], 76: [184, 187, 188, 189, 190, 192], 77: [191, 193],
  78: [192, 194, 195, 196, 198], 79: [197], 80: [196, 198, 199, 200, 201, 202, 204], 81: [203, 205],
  82: [204, 206, 207, 208],
};

// Næsten stabile: findes stadig i naturen, fordi de henfalder ekstremt langsomt. Halveringstid i år.
const NÆSTEN_STABILE = {
  'K-40': 1.25e9, 'Ca-48': 6.4e19, 'V-50': 2.7e17, 'Ge-76': 1.9e21, 'Se-82': 9e19, 'Kr-78': 9e21,
  'Rb-87': 4.9e10, 'Zr-96': 2e19, 'Mo-100': 7e18, 'Cd-113': 8e15, 'Cd-116': 3e19, 'In-115': 4.4e14,
  'Te-128': 2e24, 'Te-130': 8e20, 'Xe-124': 1.8e22, 'Xe-136': 2.2e21, 'Ba-130': 1e21, 'La-138': 1e11,
  'Nd-144': 2.3e15, 'Nd-150': 9e18, 'Sm-147': 1.06e11, 'Sm-148': 7e15, 'Eu-151': 5e18, 'Gd-152': 1.1e14,
  'Lu-176': 3.7e10, 'Hf-174': 2e15, 'W-180': 1.8e18, 'Re-187': 4.1e10, 'Os-186': 2e15, 'Pt-190': 6.5e11,
  'Bi-209': 2e19, 'Th-232': 1.4e10, 'U-235': 7.04e8, 'U-238': 4.47e9,
};

// Kendte ustabile isotoper: [halveringstid, ekstra fakta, 'beta' hvis den laver betahenfald selvom den er tung]
const KENDTE = {
  'H-3': ['12 år', 'Kaldes tritium. Bruges i selvlysende urskiver og nødskilte.'],
  'He-6': ['0,8 sekunder'],
  'Li-8': ['0,8 sekunder'],
  'Be-7': ['53 dage'],
  'Be-10': ['1,4 mio. år'],
  'B-8': ['0,8 sekunder'],
  'C-11': ['20 minutter', 'Bruges til PET-skanning på hospitaler.'],
  'C-14': ['5.730 år', 'Bruges til at finde ud af, hvor gamle fund fra fortiden er (kulstof-14-datering).'],
  'N-13': ['10 minutter'],
  'N-16': ['7 sekunder'],
  'O-15': ['2 minutter'],
  'F-18': ['110 minutter', 'Bruges til PET-skanning på hospitaler.'],
  'Na-22': ['2,6 år'],
  'Na-24': ['15 timer'],
  'Al-26': ['720.000 år'],
  'P-32': ['14 dage'],
  'S-35': ['87 dage'],
  'Cl-36': ['300.000 år'],
  'Ar-39': ['270 år'],
  'Ca-41': ['100.000 år'],
  'Fe-55': ['2,7 år'],
  'Fe-60': ['2,6 mio. år'],
  'Co-60': ['5,3 år', 'Bruges til strålebehandling af kræft.'],
  'Ni-63': ['100 år'],
  'Kr-85': ['11 år'],
  'Kr-92': ['1,8 sekunder', 'Dannes, når uran-235 spaltes.'],
  'Sr-90': ['29 år', 'Dannes i atomreaktorer.'],
  'Sr-94': ['75 sekunder', 'Dannes, når uran-235 spaltes.'],
  'Zr-97': ['17 timer', 'Dannes, når uran-235 spaltes.'],
  'Tc-97': ['4,2 mio. år'],
  'Tc-98': ['4,2 mio. år'],
  'Tc-99': ['211.000 år', 'En kortlivet udgave bruges ved skanninger på hospitaler.'],
  'Te-137': ['2,5 sekunder', 'Dannes, når uran-235 spaltes.'],
  'I-129': ['16 mio. år'],
  'I-131': ['8 dage', 'Dannes i atomreaktorer. Bruges også til at behandle sygdomme i skjoldbruskkirtlen.'],
  'Xe-133': ['5 dage'],
  'Xe-140': ['14 sekunder', 'Dannes, når uran-235 spaltes.'],
  'Cs-134': ['2,1 år'],
  'Cs-137': ['30 år', 'Dannes i atomreaktorer.'],
  'Ba-141': ['18 minutter', 'Dannes, når uran-235 spaltes.'],
  'Pm-145': ['18 år'],
  'Pm-147': ['2,6 år'],
  'Po-209': ['125 år'],
  'Po-210': ['138 dage'],
  'At-210': ['8 timer'],
  'At-211': ['7 timer'],
  'Rn-222': ['3,8 dage', 'Kan sive op fra undergrunden og samle sig i kældre.'],
  'Fr-223': ['22 minutter', '', 'beta'],
  'Ra-226': ['1.600 år'],
  'Ac-227': ['22 år', '', 'beta'],
  'Pa-231': ['33.000 år'],
  'U-233': ['159.000 år'],
  'U-234': ['246.000 år'],
  'U-236': ['23 mio. år'],
  'U-239': ['23 minutter', 'Dannes, når uran-238 fanger en neutron.', 'beta'],
  'Np-237': ['2,1 mio. år'],
  'Np-239': ['2,4 dage', 'Bliver til plutonium-239.', 'beta'],
  'Pu-238': ['88 år', 'Har givet strøm til rumsonder som Voyager.'],
  'Pu-239': ['24.000 år', 'Kan spaltes ligesom uran-235.'],
  'Pu-244': ['80 mio. år'],
  'Am-241': ['432 år', 'Findes i nogle røgalarmer.'],
  'Am-243': ['7.400 år'],
  'Cm-247': ['16 mio. år'],
  'Bk-247': ['1.400 år'],
  'Cf-251': ['900 år'],
  'Cf-252': ['2,6 år'],
  'Es-252': ['1,3 år'],
  'Fm-257': ['100 dage'],
  'Md-258': ['52 dage'],
  'No-259': ['58 minutter'],
  'Lr-266': ['11 timer'],
  'Og-294': ['0,7 millisekunder'],
};

// Kerner, der falder fra hinanden med det samme
const STRAKS_VÆK = {
  'H-4': '', 'H-5': '', 'H-6': '', 'H-7': '',
  'He-5': '', 'He-7': '',
  'Li-4': '', 'Li-5': '',
  'Be-8': 'Den falder straks i to heliumkerner. Derfor er det svært for stjerner at lave tungere stoffer end helium.',
  'B-9': '',
};

// Det mest almindelige (eller mest stabile) massetal for hvert grundstof
const TYPISK = {
  1: 1, 2: 4, 3: 7, 4: 9, 5: 11, 6: 12, 7: 14, 8: 16, 9: 19, 10: 20, 11: 23, 12: 24, 13: 27, 14: 28,
  15: 31, 16: 32, 17: 35, 18: 40, 19: 39, 20: 40, 21: 45, 22: 48, 23: 51, 24: 52, 25: 55, 26: 56,
  27: 59, 28: 58, 29: 63, 30: 64, 31: 69, 32: 74, 33: 75, 34: 80, 35: 79, 36: 84, 37: 85, 38: 88,
  39: 89, 40: 90, 41: 93, 42: 98, 43: 98, 44: 102, 45: 103, 46: 106, 47: 107, 48: 114, 49: 115,
  50: 120, 51: 121, 52: 130, 53: 127, 54: 132, 55: 133, 56: 138, 57: 139, 58: 140, 59: 141, 60: 142,
  61: 145, 62: 152, 63: 153, 64: 158, 65: 159, 66: 164, 67: 165, 68: 166, 69: 169, 70: 174, 71: 175,
  72: 180, 73: 181, 74: 184, 75: 187, 76: 192, 77: 193, 78: 195, 79: 197, 80: 202, 81: 205, 82: 208,
  83: 209,
};

// Typisk antal neutroner for et grundstof (bruges af knappen "Stabil kerne")
export function typiskeNeutroner(z) {
  if (z <= 0) return 0;
  const a = TYPISK[z] || Math.round(grundstof(z).masse);
  return a - z;
}

// Særlige navne
export function isotopNavn(z, n) {
  if (z === 1 && n === 0) return 'Hydrogen-1 (protium)';
  if (z === 1 && n === 1) return 'Hydrogen-2 (deuterium)';
  if (z === 1 && n === 2) return 'Hydrogen-3 (tritium)';
  const g = grundstof(z);
  return `${g.navn}-${z + n}`;
}

// Formaterer et meget stort antal år
function formaterÅr(år) {
  if (år >= 1e12) return 'over 1000 milliarder år – meget længere end universets alder';
  if (år >= 1e9) return `${(år / 1e9).toLocaleString('da-DK', { maximumFractionDigits: 1 })} mia. år`;
  return `${(år / 1e6).toLocaleString('da-DK', { maximumFractionDigits: 0 })} mio. år`;
}

// Giver kernens stabilitet:
// { status: 'stabil' | 'næsten' | 'ustabil' | 'meget' | 'straks', overskrift, tekst, halveringstid }
export function stabilitet(z, n) {
  if (z === 0 && n === 0) return { status: 'tom', overskrift: '', tekst: '' };
  if (z === 0) {
    if (n === 1) {
      return {
        status: 'ustabil', overskrift: 'En fri neutron', halveringstid: 'ca. 10 minutter',
        tekst: 'Alene holder en neutron kun ca. 10 minutter. Så laver den sig om til en proton og sender en elektron ud.',
      };
    }
    return {
      status: 'straks', overskrift: 'Hænger ikke sammen',
      tekst: 'Neutroner alene kan ikke holde sammen. Der skal protoner med.',
    };
  }
  const navn = `${grundstof(z).symbol}-${z + n}`;
  if (n === 0 && z >= 2) {
    return {
      status: 'straks', overskrift: 'Falder fra hinanden med det samme',
      tekst: 'Protoner frastøder hinanden, fordi de alle er plusladede. Kernen har brug for neutroner som "lim".',
    };
  }
  if (navn in STRAKS_VÆK) {
    return {
      status: 'straks', overskrift: 'Falder fra hinanden med det samme',
      tekst: STRAKS_VÆK[navn] || 'Denne kombination kan ikke holde sammen. Den falder fra hinanden på en brøkdel af et sekund.',
    };
  }
  const stabile = STABILE[z] || [];
  if (stabile.includes(z + n)) {
    return { status: 'stabil', overskrift: 'Stabil kerne', tekst: 'Kernen holder for evigt. Den er ikke radioaktiv.' };
  }
  if (navn in NÆSTEN_STABILE) {
    return {
      status: 'næsten', overskrift: 'Næsten stabil',
      halveringstid: formaterÅr(NÆSTEN_STABILE[navn]),
      tekst: 'Den er radioaktiv, men henfalder så langsomt, at den stadig findes i naturen.',
    };
  }

  // Ustabil: find ud af, hvad der er galt
  const typiskN = typiskeNeutroner(z);
  const nMin = stabile.length ? stabile[0] - z : typiskN;
  const nMax = stabile.length ? stabile[stabile.length - 1] - z : typiskN;
  let grund;
  if (n > nMax) grund = 'Den har for mange neutroner. En neutron vil lave sig om til en proton og sende en elektron ud (betahenfald).';
  else if (n < nMin) grund = 'Den har for få neutroner. En proton vil lave sig om til en neutron (beta-plus-henfald).';
  else grund = 'Netop denne blanding holder ikke, selvom naboerne gør. Den henfalder til en stabil nabo.';
  if (!stabile.length && z < 84 && n >= nMin - 1 && n <= nMax + 1) {
    grund = `${grundstof(z).navn} har slet ingen stabile isotoper. Alle udgaver af kernen er radioaktive.`;
  }
  if (z >= 84 && n >= nMin - 4 && n <= nMax + 4) {
    grund = 'Kernen er så stor, at den ikke kan holde sammen. Den skyder små heliumkerner ud (alfahenfald).';
  }

  const afstand = n > nMax ? n - nMax : n < nMin ? nMin - n : 0;
  const kendt = KENDTE[navn];
  if (kendt && kendt[2] === 'beta') {
    grund = 'Den har for mange neutroner. En neutron vil lave sig om til en proton og sende en elektron ud (betahenfald).';
  }
  if (kendt) {
    return {
      status: 'ustabil', overskrift: 'Ustabil (radioaktiv)', halveringstid: kendt[0],
      tekst: grund + (kendt[1] ? ' ' + kendt[1] : ''),
    };
  }
  if (afstand > 10 + z / 4) {
    return {
      status: 'straks', overskrift: 'Falder fra hinanden med det samme',
      tekst: 'Kernen er så skæv, at den slet ikke kan holde sammen. ' + grund,
    };
  }
  if (afstand > 3) {
    return { status: 'meget', overskrift: 'Meget ustabil', tekst: 'Den henfalder på et øjeblik. ' + grund };
  }
  return { status: 'ustabil', overskrift: 'Ustabil (radioaktiv)', tekst: grund };
}
