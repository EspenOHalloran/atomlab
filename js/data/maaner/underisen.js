// "Under isen" (docs/drejebog-maaner.md, afsnit 4-6): tallene for Europa og Enceladus, lagene i snittet og den enkle
// model af magnetfeltet ved Europa. Ren data uden Three.js, så det kan testes i Node (tests/maaner-data.mjs).
// Kilderne står i docs/fakta-maaner-liv.md (afsnit 1-2) og drejebogens afsnit 16.

import { gå, kontakt } from '../../sideknap.js';

export const KM_PR_ENHED = 250; // 1 enhed i scenen = 250 km (Europa bliver ca. 6,2 enheder i radius)

// Europa: radius 1.560,8 km (NSSDC, "ca. 3.100 km" i teksterne). Isen 15-25 km og havet 60-150 km er skøn fra modeller
// (NASA "Europa Facts"). Snittet tegner midten af spændet. Jernkernen er noget, forskerne tror (NASA: "is thought to
// have an iron core"). Dens størrelse er ikke målt: Modellerne giver ca. 0,3-0,45 af radius, og vi tegner 600 km
// (står som "regnet" ved laget og i Ærligt talt).
export const EUROPA = {
  r: 1560.8,
  is: 20, isSpænd: [15, 25],
  hav: 100, havSpænd: [60, 150],
  kerne: 600,
};

// Enceladus: middelradius 252,1 km (Cassini, ca. 504 km bred). Lagene (M3, trin 3) er skøn ud fra tyngden, formen og
// vuggen (Čadek m.fl. 2016, GRL 43:5653, set i et søgeresultat og i del1): isen 18-22 km i snit og under 5 km ved
// sydpolen, stenkernen 180-185 km i radius. Havet er det, der er tilbage: ca. 47 km (faktafilens "ca. 25-45 km" er fra
// ældre skøn). Ingen jernkerne (kerne 0 i shaderen).
export const ENCELADUS = { r: 252.1, is: 20, isSyd: 5, hav: 47, kerne: 0, sten: 185 };

// Jordens dybeste sted: Challengerdybet i Marianergraven, ca. 10,9 km (lupen, drejebogens afsnit 1)
export const JORDENS_DYBESTE = 11;

// Laget i en given afstand fra Europas midte (km)
export function lagVed(rKm, m = EUROPA) {
  if (rKm > m.r) return 'rum';
  if (rKm > m.r - m.is) return 'is';
  if (rKm > m.r - m.is - m.hav) return 'hav';
  if (rKm > m.kerne) return 'sten';
  return 'jern';
}

// Grænserne som brøkdel af radius (til shaderen): [isens bund, havets bund, kernens kant]
export function lagGrænser(m = EUROPA) {
  return [(m.r - m.is) / m.r, (m.r - m.is - m.hav) / m.r, m.kerne / m.r];
}

// Isens bund ved sydpolen som brøkdel af radius (Enceladus: isen er under 5 km tyk dér). Europa: den samme som ellers.
export const isBundSyd = (m = EUROPA) => (m.r - (m.isSyd ?? m.is)) / m.r;

// Lagene med farve og mærke (snittets forklaring). Farverne er de samme som i shaderen (js/maaner/snit.js).
export const LAG = [
  { id: 'is', navn: 'Is', farve: '#eef4ff', mærke: 'ca. 15-25 km (regnet)' },
  { id: 'hav', navn: 'Hav', farve: '#2f86e8', mærke: '60-150 km (målt, dybden regnet)' },
  { id: 'sten', navn: 'Sten', farve: '#8a6a4c', mærke: 'regnet' },
  { id: 'jern', navn: 'Jern', farve: '#9aa0a8', mærke: 'regnet' },
];

// Lagene i snittet gennem Enceladus (trin 3). Her er lagene tykke nok til at ses uden lup.
export const LAG_ENCELADUS = [
  { id: 'is', navn: 'Is', farve: '#eef4ff', mærke: 'ca. 20 km, under 5 km ved sydpolen (regnet)' },
  { id: 'hav', navn: 'Hav', farve: '#2f86e8', mærke: 'ca. 45 km (målt, dybden regnet)' },
  { id: 'sten', navn: 'Sten', farve: '#8a6a4c', mærke: 'ca. 185 km i radius (regnet)' },
];

// ---------- Magnetfeltet ved Europa (trin 2) ----------
// Set fra Europa er Jupiters felt mest rettet mod syd (B_s, ca. 420 nT), men fordi Jupiters magnetfelt hælder 9,4° og
// drejer med planeten, vipper en del af det (B_v, ca. 200 nT) frem og tilbage hver ca. 11 timer (Kivelson m.fl. 2000).
// Et lag, der leder strøm (det salte hav), laver sit eget felt, der skubber den skiftende del ud: uden for havet er
// det en dipol, der vender modsat, og inde i havet er kun den faste del tilbage. Det er det, Galileo målte.
// Enheder: Europas radius og den faste del af feltet (B_s = 1). x mod Jupiter (venstre er mod Jupiter, -x), y mod nord.
export const FELT = {
  fast: 1, // B_s, mod syd
  vip: 0.48, // B_v / B_s (ca. 200 / 420 nT)
  periode: 8, // sekunder i programmets ur for en hel vippen (i virkeligheden ca. 11,2 timer)
  havR: (EUROPA.r - EUROPA.is) / EUROPA.r, // havets top (ca. 0,987 radius): her starter laget, der leder strøm
  hældning: 9.4, // grader, Jupiters magnetfelt i forhold til aksen (NSSDC)
};

// Den vippende del af Jupiters felt til tiden t (sekunder): fra -1 til 1 (ganges med FELT.vip)
export const vippen = (t) => Math.sin((2 * Math.PI * t) / FELT.periode);

// Feltet i punktet (x, y) i Europa-radier, når den vippende del er bx (= FELT.vip · vippen(t)), med eller uden hav.
// Giver [Bx, By] i ud (et array, så der ikke laves nye objekter hvert billede).
export function feltVed(x, y, bx, hav, ud = [0, 0]) {
  let fx = bx, fy = -FELT.fast;
  if (hav) {
    const a = FELT.havR;
    const r2 = x * x + y * y;
    if (r2 < a * a) {
      fx = 0; // inde i havet er den vippende del skubbet ud
    } else {
      // Dipolen fra havet: m = -(a³/2) · bx langs x. B = (3 (m·r̂) r̂ - m) / r³
      const r = Math.sqrt(r2);
      const m = (-(a ** 3) / 2) * bx;
      const rx = x / r, ry = y / r;
      const mr = m * rx;
      const r3 = r2 * r;
      fx += (3 * mr * rx - m) / r3;
      fy += (3 * mr * ry) / r3;
    }
  }
  ud[0] = fx;
  ud[1] = fy;
  return ud;
}

// Det ekstra felt fra Europa, som Galileos magnetometer måler (den del, der ikke kommer fra Jupiter), i punktet (x, y).
// Uden hav er det 0. Til måleren og testene.
export function ekstraFelt(x, y, bx, hav, ud = [0, 0]) {
  feltVed(x, y, bx, hav, ud);
  ud[0] -= bx;
  ud[1] += FELT.fast;
  return ud;
}

// Tallene i højre panel (højst to, drejebogens afsnit 10)
export const TAL = [
  ['Havet på Europa', '60-150 km dybt'],
  ['Fontæner på Enceladus', 'over 100'],
];

// ---------- Siden i højre panel (drejebogens afsnit 9-11: højst tre sætninger i Kort og højst fire spørgsmål) ----------
// Faktatjekket 20. november 2026 (M2 og M3) mod docs/fakta-maaner-liv.md afsnit 1-2 og 7 og drejebogens afsnit 16.
// Cassini fløj gennem fontænerne flere gange, den dybeste i oktober 2015 (NASA "Enceladus Final Flybys"). Europa Clipper:
// opsendt 2024, Jupiter i april 2030, ca. 50 forbiflyvninger, lander ikke og leder ikke efter liv. ESA's sonde og
// lander til Enceladus: opsendelse tidligst i 2040'erne. Svovl kun antydet (Peter m.fl. 2023). Is ca. 0,92 g/cm³.

export const SIDE = {
  kort: 'Europa kredser om Jupiter, den lille Enceladus om Saturn. Begge er dækket af is, og under isen er der et hav af salt vand. Enceladus sprøjter sit hav ud i rummet gennem revner ved sydpolen.',
  emner: [
    {
      titel: 'Hvordan ved vi, at der er et hav på Europa?',
      tekst: `<p>Ingen har set havet. Men Jupiters magnetfelt hælder ca. 9,4° og drejer med planeten, så set fra Europa vipper det frem og tilbage. Salt vand leder strøm, og når feltet vipper, laver havet sit eget lille felt. Det målte rumsonden Galileo omkring år 2000. Det er det bedste bevis, men det er på en omvej. ${kontakt('Hav')}</p>`,
      kontakt: 'Hav',
    },
    {
      titel: 'Hvordan opdagede Cassini fontænerne?',
      tekst: `<p>Først med sit magnetometer: I februar og marts 2005 bøjede Saturns magnetfelt uden om Enceladus. I juli 2005 fløj Cassini tæt forbi og fandt en sky af vand over sydpolen, og senere kom billederne. Over 100 fontæner sprøjter ud gennem fire lange revner, "tigerstriberne". ${kontakt('Modlys')}</p>`,
      kontakt: 'Modlys',
    },
    {
      titel: 'Hvordan ved vi, at Enceladus\' hav er under hele isen?',
      tekst: '<p>Enceladus vugger lidt frem og tilbage, mens den kredser om Saturn. Cassinis billeder viste, at den vugger for meget til, at isen kan sidde fast på stenkernen. Så må isen flyde på et hav, der går hele vejen rundt.</p>',
    },
    {
      titel: 'Hvorfor fryser havene ikke?',
      tekst: '<p>Jupiter og Saturn trækker i deres måner, så månerne bliver æltet og varmet indefra (tidevandskraft). Saltet hjælper også, for salt vand fryser først ved en lavere temperatur end rent vand.</p>',
    },
  ],
  videre: [gå('solsystem:jupiter:europa', 'Se Europa ved Jupiter'), gå('solsystem:saturn:enceladus', 'Se fontænerne ved Saturn')],
  nørd: '<p><b>Isens tykkelse:</b> Den er mest regnet ud fra tyngden og formen. Rumsonden Juno målte i 2022 ca. 29 km ét sted på Europa, men kun det kolde, yderste lag. På Enceladus er isen nok ca. 20 km tyk, men under 5 km ved sydpolen.</p><p><b>Feltet i tegningen:</b> Havet er regnet som en skal, der leder strøm helt uden modstand. Så kan den vippende del af Jupiters felt ikke komme ind, og uden for havet bøjer den, som om der sad en magnet i Europa, der vender modsat. Galileo målte et ekstra felt, der passede med et lag, der leder strøm godt, og den bedste forklaring er salt vand (Kivelson m.fl. 2000).</p><p><b>De næste rumsonder:</b> Europa Clipper blev sendt op i 2024 og skal nå Jupiter i april 2030. Den flyver forbi Europa ca. 50 gange, men lander ikke og leder ikke efter liv. ESA vil sende en sonde og en lander til Enceladus, men tidligst i 2040\'erne.</p><p><b>Svovl:</b> Liv bruger også svovl. På Enceladus er det kun antydet, ikke sikkert fundet, og derfor er det ikke et kort på tavlen.</p><p><b>Prøv selv i køkkenet:</b> Læg en isterning i et glas vand. Isen flyder ovenpå, fordi is er lettere end vand. Derfor ligger isen øverst på månerne og havet nedenunder.</p>',
  billeder: '<p>Europas kort er en mosaik af fotos fra Voyager og Galileo (NASA/JPL/USGS). Enceladus\' kort er fra Cassini (NASA/JPL/Space Science Institute, USGS). Begge er public domain.</p>',
  ærligt: '<p>Lagenes tykkelse er skøn, ikke målt, undtagen Junos ene måling af isen. Snittet tegner midten af skønnene. Jernkernen i Europa er noget, forskerne tror, ikke har set, og dens størrelse er gættet. Magnetfeltet er tegnet langt enklere end det rigtige og vipper meget hurtigere. Galileo og Cassini er tegnet meget større, end de var, og fontænernes partikler er meget større end de rigtige iskorn. Cassini fløj ikke i én bue, men gennem sprøjtet flere gange frem til 2015. Kontakten "Modlys" flytter Solen om bag Enceladus. Tavlen gør det enkelt: Et grønt kort er målt, men tit på en omvej.</p>',
};
