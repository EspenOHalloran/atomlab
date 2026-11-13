// Rejsen i tid (tvillingerejsen, T1-T3 i docs/plan-tid.md): Du flyver til Alpha Centauri, TRAPPIST-1, Mælkevejens
// centrum eller Andromedagalaksen og hjem igen næsten med lysets fart, mens din tvilling bliver hjemme. To ure i et HTML-lag oven på
// 3D-billedet viser "Dit ur" og "Jordens ur". Regningen står i js/data/tid.js (testes i Node), og tallene i docs/fakta-tid.md.
//
// To måder at flyve på: Skyderen "Fart" giver fast fart (vi springer over, hvordan man kommer op i fart, se "Ærligt
// talt"), og kontakten "1 g hele vejen" speeder op med 1 g til midtvejs og bremser med 1 g resten. Hver vej tager
// SKÆRM_VEJ sekunder på skærmen uanset målet (ellers ville Andromeda tage timer): Med fast fart følger skærmen tiden på
// Jorden (målets lysår / SKÆRM_VEJ år pr. sekund), og med 1 g tiden i skibet. Farten kan skiftes undervejs: Urene lægger
// tiden sammen bid for bid, så regnestykket passer også da.
// "Set fra skibet" trykker scenen sammen om skibet, når farten stiger (længdeforkortelsen, men meget mindre end i
// virkeligheden). "⏱ Vis lysuret" viser to lysure side om side i et lærred (2D) i stedet for urene. Imens står rejsen stille.
// Styr-boksen bygges om efter tilstanden (styring er en liste, der rettes på stedet, og opdaterKnapper() tegner den igen).

import * as THREE from 'three';
import { handling, kontakt, tid as tidKnap, gå } from '../sideknap.js';
import { stjerne, glød, skilt, hale, prikSky, KVALITET } from './faelles.js';
import { lavJorden } from './jorden.js';
import { ROLIG, passerTil, passerTilBoks } from '../scene3d.js';
import * as T from '../data/tid.js';
import * as Lys from './lysur.js'; // lysurets regning og tegning (delt med tidhvorfor.js)
import { figurSVG } from './tidfigur.js'; // de tegnede figurer ved hjemkomsten (E4, trin A1)
import { startForløb, stopForløb, starterSelv, kørerForløb, tegnForløb, forløbTest } from '../forloeb.js';
import { tagVentForløb } from '../gaa.js';
import { REJSEN_I_TID } from '../data/forloeb/tid.js'; // forløbet "Rejsen i tid" (E4, forløb A)

const SKÆRM_VEJ = 12.5; // ▶: sekunder på skærmen for hver vej (ud og hjem ca. 25 sekunder), uanset målet
const HURTIG = 4; // ⏩: en tur tager ca. 6 sekunder
const START_ÅR = new Date().getFullYear(); // Jordens ur starter i år (jeres svar: "fra år 2026")
const START_NI = 4; // 99,99 %: ca. 45 dage i skibet mod ca. 8,7 år på Jorden
const LØBSK = 2.5; // år på Jorden pr. sekund på skærmen, hvor urskivens viser drejer så hurtigt, at den bliver en skive
// Scenen (ikke i skala): Jorden til venstre, målet til højre og skibets vej imellem
const JORD_X = -12.5;
const MÅL_X = 12.5;
const SKIB_FRA = JORD_X + 2.1;
const SKIB_TIL = MÅL_X - 2.4;
const SKIB_Y = 0.45;
// "Set fra skibet": afstandene i scenen ganges med γ^(−1/3) (i virkeligheden 1/γ, men så ville målet ligge oven i skibet)
const KLEM = 1 / 3;
// Lysuret trin for trin (jeres ønske 8. november 2026: "tag brugeren i hånden"). Trin 1-4 er ved 87 % (γ = 2), og i det
// sidste kan man selv vælge farten.
const LYS_TRIN = [
  { titel: 'Et lysur', tekst: 'Et lysur er et tænkt ur: Et lysglimt hopper op og ned mellem to spejle. Hver gang lyset er nede igen, siger uret "tik". Til venstre ser du uret, som du ser det om bord i skibet.' },
  { titel: 'Set fra Jorden', tekst: 'Til højre er det samme ur set fra Jorden, mens skibet farer forbi med 87 % af lysets fart. Mens lyset er på vej op, flytter spejlene sig. Derfor går lyset skråt, i zigzag.' },
  { titel: 'Den skrå vej er længere', tekst: 'Den skrå vej er 2 gange så lang som den lige vej. Lyset har altid den samme fart, også set fra Jorden. Så tager hvert tik 2 gange så lang tid.' },
  { titel: 'Uret går langsommere', tekst: 'Tæl tikkene. Det er det samme ur, men set fra Jorden når det kun halvt så mange tik. Om bord mærker du intet: For dig går uret helt normalt.' },
  { titel: 'Alt om bord følger med', tekst: 'Alle ure i skibet går langsommere set fra Jorden, også dit hjerte og dine tanker. Det kaldes tidsforlængelse. Skru op for farten under Styr, og se den skrå vej blive længere.' },
];

export default {
  id: 'tid',
  navn: 'Rejsen i tid',
  ikon: '⏳',
  undertitel: 'Flyv næsten med lysets fart',
  kamera: { retning: [0, 0.3, 1], radius: 14.5, drej: false },
  tal: [
    ['Alpha Centauri', 'ca. 4,3 lysår væk'],
    ['TRAPPIST-1', 'ca. 41 lysår væk'],
    ['Andromedagalaksen', 'ca. 2,5 mio. lysår væk'],
    ['Med 1 g til Andromeda', 'ca. 29 år i skibet (én vej)'],
    ['Teorien', 'Einstein, 1905'],
  ],
  side: {
    kort: 'Kan man rejse ind i fremtiden? Ja, hvis man flyver næsten med lysets fart. Set fra Jorden går alle ure i skibet langsommere. Det kaldes tidsforlængelse. Flyv til TRAPPIST-1 (en lille, rød stjerne med syv planeter) eller et andet mål og hjem, og se, hvor meget tid der er gået på Jorden.',
    // T3: teksterne er tjekket mod docs/fakta-tid.md (afsnittet står ved hvert emne) og regnet efter med regn.py
    emner: [
      {
        // Jeres spørgsmål 8. november 2026: "4 lysår på 21 dage uden at flyve hurtigere end lyset?" (afsnit 5 og 7)
        titel: 'Hurtigere end lyset? Nej!',
        tekst: `<p>Ved 99,99 % af lysets fart tager turen til Alpha Centauri kun ca. 22 dage i dit ur, selv om den er 4,3 lysår lang. Det lyder, som om du flyver ca. 71 gange hurtigere end lyset. Men det gør du ikke. Det kommer an på, hvis ur man kigger på.</p>
          <p><b>1. Set fra Jorden</b> flyver du lidt langsommere end lyset, så turen tager lidt over 4,3 år. Et lysglimt, der blev sendt af sted samtidig med dig, ville kun nå frem knap 4 timer før dig. Men alle ure i skibet går ca. 71 gange langsommere end Jordens. Derfor viser dit ur kun ca. 22 dage, når du når frem.</p>
          <p><b>2. Set fra dig i skibet</b> går dit ur helt normalt. Til gengæld er vejen skrumpet til ca. 0,061 lysår, og den korte vej klarer du på ca. 22 dage (se "Set fra skibet"). ${kontakt('Set fra skibet')}</p>
          <p><b>3. Begge dele er rigtige på samme tid</b> og giver det samme tal. Ingen ser dig flyve hurtigere end lyset: Set fra Jorden er du lige bag lyset, og set fra skibet er vejen bare kortere.</p>`,
      },
      {
        // Afsnit 3
        titel: 'Hvorfor går Jordens ur så hurtigt?',
        tekst: `<p>Lyset har altid den samme fart, uanset hvem der måler den. Forestil dig et ur, hvor et lysglimt hopper op og ned mellem to spejle. I skibet går lyset lige op og ned. Set fra Jorden flytter spejlene sig, mens lyset er undervejs, så lyset går en længere, skrå vej. Derfor tager hvert tik længere tid set fra Jorden. ${handling('Vis lysuret', '⏱ Vis lysuret')} viser det trin for trin.</p>
          <p>Det gælder ikke kun lysure. Alt om bord følger med: atomurene, dit hjerte og dine tanker. ${gå('kosmos:tidhvorfor', '🔦 Hvorfor? Se det trin for trin')}</p>`,
      },
      {
        // Afsnit 2 og 4
        titel: 'Hvad gør farten?', hvorfor: ['lysfart'],
        tekst: `<p>Ved halv lysfart (50 %) går der kun ca. 1,15 dage på Jorden for hver dag i skibet, og ved 90 % ca. 2,3 dage. Ved 99,99 % er det ca. 71 dage, og ved 99,9999 % ca. 707 dage, næsten 2 år. Hvert ekstra 9-tal gør forskellen ca. 3 gange større.</p>
          <p>Alpha Centauri er ca. 4,3 lysår væk. Et lysår er den vej, lyset når på et år. Set fra Jorden tager turen ud og hjem derfor altid mindst ca. 8,7 år, for skibet kan ikke flyve hurtigere end lyset. Det, der bliver kortere og kortere, er tiden på dit ur. ${tidKnap('hurtig', 'Prøv ⏩')}</p>`,
      },
      {
        // Afsnit 6 (11.500 g og 13 år: regn.py, punkt 13). Fast fart forklaret efter jeres spørgsmål 8. november 2026
        titel: 'Fast fart eller 1 g?', kontakt: '1 g hele vejen',
        tekst: `<p>Du kan flyve på to måder.</p>
          <p><b>Fast fart (skyderen):</b> Du flyver med den fart, du vælger, fra første til sidste sekund. Det er snyd: I virkeligheden skal man først speede op og til sidst bremse. Men fast fart viser tydeligt, hvad farten gør ved tiden.</p>
          <p><b>1 g hele vejen</b> er sådan, det kunne gå i virkeligheden. 1 g er lige så hårdt, som tyngden trykker på dig her på Jorden, så med 1 g kunne man leve om bord i årevis. Raketten speeder op til midtvejs, vender om og bremser resten af vejen. Men det går langsomt. Til Alpha Centauri når man kun op på ca. 95 % af lysets fart, og turen tager ca. 3,6 år for dig (én vej). ${kontakt('1 g hele vejen')}</p>
          <p>Jo længere væk målet er, jo længere tid har man til at speede op. Efter ca. 2 år i dit ur flyver du over 96 % af lysets fart, og så går dit ur langsommere og langsommere. Til Mælkevejens centrum tager det ca. 20 år for dig og ca. 27.000 år på Jorden, og til Andromeda ca. 29 år for dig (én vej). Skulle en tur tage 2 dage for dig og 2.000 år på Jorden, skulle man speede op med ca. 11.500 g, og det ville knuse en. Med 1 g tager det ca. 13 år bare at nå den fart.</p>`,
      },
      {
        // Afsnit 9
        titel: 'Hvorfor ikke omvendt?',
        tekst: `<p>Set fra skibet er det jo Jorden, der farer af sted. Burde din tvilling så ikke være den yngste? Nej, for I er ikke ligestillede. Din tvilling bliver hjemme hele tiden, men du skal vende om for at komme hjem. Det mærker du, når motoren bremser og speeder op igen.</p>
          <p>Tænk på rumtiden (rum og tid tilsammen) som et kort over både hvor og hvornår. Hvert ur måler længden af sin egen vej gennem rumtiden. Den lige vej, at blive hjemme, giver den længste tid, og din omvej ud og hjem giver mindre. Det er det modsatte af et landkort, hvor omvejen er længst.</p>`,
      },
      {
        // Afsnit 7 (0,0614 lysår er ca. 3.900 gange afstanden til Solen, 22 dage er én vej ved 99,99 %)
        titel: 'Set fra skibet', kontakt: 'Set fra skibet',
        tekst: `<p>I skibet er det dig, der står stille, og stjernerne, der farer forbi. Så bliver afstanden langs farten kortere. Det kaldes længdeforkortelse. Ved 99,99 % af lysets fart er Alpha Centauri kun ca. 0,061 lysår væk set fra skibet (ca. 3.900 gange afstanden til Solen) i stedet for 4,3 lysår. Derfor er du kun ca. 22 dage om at nå derhen i dit eget ur. ${kontakt('Set fra skibet')}</p>
          <p>På Jorden siger de, at dit ur går langsomt. I skibet siger du, at vejen er kort. I har begge ret, og I får det samme tal.</p>`,
      },
      {
        // Afsnit 10 (GPS står i Rumtid. Frisch og Smiths tal er ikke bekræftet i T3's faktatjek, derfor uden tal). Kononenko: 1.111 døgn, ca. 27 ms. 33 cm: ca. 1 ns pr. år
        titel: 'Er det målt?',
        tekst: `<p>Ja, mange gange. Myoner (tunge fætre til elektronen) bliver lavet ca. 15 km oppe, når den kosmiske stråling rammer luften. En myon lever i gennemsnit kun ca. 2,2 milliontedele sekund, og på den tid når den kun ca. 660 m, selv med næsten lysets fart. Alligevel når mange af dem helt ned til jorden, fordi deres ure går langsommere set fra os. I begyndelsen af 1960'erne talte Frisch og Smith myonerne på toppen af et bjerg i USA og ved havet. Uden tidsforlængelse skulle kun en lille del af dem være nået ned til havet, men de fleste nåede ned. På CERN levede myoner, der kørte rundt i en ring, i 1977 ca. 29 gange længere end ellers, præcis som Einstein havde regnet ud.</p>
          <p>I 1971 fløj Hafele og Keating fire atomure jorden rundt i passagerfly, først mod øst og så mod vest. Urene mod øst tabte ca. 59 milliardtedele sekund, og urene mod vest vandt ca. 273, næsten som forudsagt. Forskellen mellem øst og vest kommer af, at Jorden selv drejer mod øst. Højden talte også med, for ure højt oppe går lidt hurtigere. Det samme skal rettes i GPS-satellitternes ure. ${gå('kosmos:rumtid', 'Rumtid')}</p>
          <p>Astronauten Oleg Kononenko har været 1.111 døgn i rummet på rumstationen ISS, mere end nogen anden. Han er derfor ca. 27 tusindedele sekund yngre, end hvis han var blevet hjemme. Og i 2010 målte forskere, at et atomur går hurtigere, når det bliver løftet bare 33 cm, ca. 1 milliardtedel sekund om året. Det er tyngden, ikke farten.</p>`,
      },
      {
        // Afsnit 8 (γ = 365.250, ét ton og et korn på 1 µg) og 6 (brændstoffet)
        titel: 'Kunne man?',
        tekst: `<p>Fysikken forbyder det ikke, men det er langt ud over alt, vi kan. Et skib på ét ton, der skal flyve så hurtigt, at 2 dage for dig er 2.000 år på Jorden, skal have mere energi, end hele verden bruger på over 50.000 år. Så meget lys sender Solen ud på knap en tiendedel sekund.</p>
          <p>Med 1 g hele vejen skulle selv en perfekt raket, der skyder lys ud bagud, veje ca. 40 gange så meget ved starten som ved Alpha Centauri (én vej), og ca. 780 millioner gange så meget til Mælkevejens centrum. Vi kender ingen måde at bygge sådan en raket.</p>
          <p>Og rummet er ikke helt tomt. Ved den fart ville et bittelille sandkorn på 1 mikrogram (under en tiendedel millimeter) ramme skibet med lige så meget energi som ca. 8.000 ton sprængstof (TNT). Selv ved 99,99 % er det som ca. 1,5 ton. Her omkring Solen er der også ca. 0,3 atomer i hver kubikcentimeter af rummet, mest brint. Hvert brintatom ville ramme med ca. 50 gange mere energi end protonerne i verdens største partikelaccelerator (LHC ved CERN), og der ville komme milliarder af dem hvert sekund på hver kvadratcentimeter. Det er dræbende stråling.</p>`,
      },
    ],
    videre: [gå('kosmos:rumtid', 'Rumtid'), gå('kosmos:sorthul', 'Sort hul')],
    nørd: `
      <p><b>Gammafaktoren:</b> γ = 1/√(1 − v²/c²), hvor v er farten og c lysets fart. Et ur, der farer forbi med farten v, går γ gange langsommere set fra os. Ved 99,99 % er γ ca. 70,7, og med 14 ni-taller ca. 7,1 millioner.</p>
      <p><b>Reglen om 9-tallene:</b> Med ε = 1 − v/c er γ = 1/√(ε(2 − ε)), og det er ca. 1/√(2ε), når ε er lille. Hvert ekstra 9-tal gør ε 10 gange mindre og γ ca. √10 ≈ 3,16 gange større. Computeren regner også sådan, for ellers regner den forkert, når der er mange 9-taller.</p>
      <p><b>Lysuret:</b> Spejlene står L fra hinanden, så ét tik (op og ned) tager 2L/c. Set fra Jorden går lyset skråt, og Pythagoras giver, at hvert tik tager γ · 2L/c. Med 1,5 m mellem spejlene ville et lysur tikke ca. 100 millioner gange i sekundet.</p>
      <p><b>Rejsen med fast fart:</b> Tiden på Jorden er 2 · afstanden / farten. Tiden i skibet er den tid delt med γ. Set fra skibet er afstanden d/γ, og d/γ delt med farten giver præcis den samme tid.</p>
      <p><b>1 g hele vejen:</b> Med accelerationen a over afstanden d tager én vej τ = 2(c/a) · arcosh(1 + a·d/(2c²)) i skibet og t = 2(c/a) · √((1 + a·d/(2c²))² − 1) på Jorden. Med 1 g er c/a ca. 0,97 år, og c²/a ca. 0,97 lysår. Midtvejs er γ = 1 + a·d/(2c²): ca. 3,2 til Alpha Centauri og ca. 1,3 millioner til Andromeda.</p>
      <p><b>Tvillingeparadokset:</b> Hvert ur måler sin egentid τ, længden af sin vej gennem rumtiden. Rumtidens "Pythagoras" har et minus: For et stykke af vejen med fast fart er τ² = t² − (x/c)², hvor t er tiden og x afstanden set fra Jorden. Jo længere du flytter dig, jo mindre bliver τ. Derfor giver omvejen <i>mindre</i> tid og ikke mere. Rumtiden er altså ikke bare tre retninger plus én: Tiden tæller med minus.</p>
      <p><b>"Nu" er ikke det samme for alle.</b> To ting, der sker samtidig set fra Jorden, sker ikke samtidig set fra skibet. Når du vender om ved målet, skifter dit "nu" derhjemme: Lige før vendingen er "nu" på Jorden kun lidt efter afgangen, og lige efter er det næsten ved hjemkomsten. Det er dér, de mange år derhjemme "forsvinder" set fra skibet.</p>
      <p><b>Hvad er et sekund?</b> Siden 1967 er et sekund 9.192.631.770 svingninger i den stråling, der hører til et bestemt lille spring mellem to energiniveauer i et cæsium-133-atom. Sådan et atomur fløj Hafele og Keating med. I dag er ure med strontium og aluminium endnu mere præcise, men det er stadig cæsium, der bestemmer sekundet. ${gå('system:55', 'Cæsium')}</p>
      <p><b>På skærmen</b> tager hver vej lige lang tid (ca. 12 sekunder), uanset målet. Med fast fart følger skærmen Jordens ur, og med 1 g dit ur.</p>`,
    ærligt: `<p><b>Skyderen "Fast fart" springer over, hvordan man kommer op i fart.</b> I virkeligheden ville det tage år, og at gøre det på dage ville knuse en (se "Fast fart eller 1 g?").</p>
      <p><b>Du mærker intet om bord.</b> Dit eget ur går helt normalt, ét sekund pr. sekund, og dit hjerte slår, som det plejer. Det er først, når I sammenligner urene derhjemme, at du er den yngste.</p>
      <p><b>Urene på skærmen</b> viser tiden, som man regner den på Jorden. Set fra skibet er "nu" på Jorden et andet. Kun når I står ved siden af hinanden, er alle enige om, hvem der er ældst.</p>
      <p><b>"Det er accelerationen, der gør det"</b> er kun en del af historien. Man kan tænke sig en rejse, hvor begge ure speeder op og bremser lige meget og alligevel kommer forskelligt hjem. Og i et rigtigt forsøg på CERN i 1977 fulgte myonernes ure kun farten, selv om de blev slynget rundt i en ring med ca. en milliard milliarder g. Det er vejen gennem rumtiden, der tæller.</p>
      <p><b>"For lyset står tiden stille"</b> hører man tit. Men lyset har ikke sit eget ur, for intet kan følge med lyset og se det stå stille.</p>
      <p><b>"Intet kan flyve hurtigere end lyset"</b> gælder for ting, der farer forbi hinanden. Fjerne galakser fjerner sig fra os hurtigere end lyset, fordi rummet imellem os udvider sig.</p>
      <p><b>I filmen Interstellar</b> svarer 1 time på en planet til 7 år på Jorden. Det er tyngden, ikke farten, og det kræver et sort hul, der drejer næsten så hurtigt, som det overhovedet kan, og en planet meget tæt på det.</p>
      <p><b>Set fra skibet</b> er scenen trykket meget mindre sammen end i virkeligheden. Ellers ville målet ligge oven i skibet. Tallene under "Lige nu" er de rigtige. Man ville heller ikke <i>se</i> det sådan: Når man flyver så hurtigt, ser lyset fra stjernerne helt anderledes ud.</p>
      <p>Jorden, stjernerne og galakserne er tegnet alt for store, og skibet flyver selvfølgelig ikke med lysets fart hen over skærmen. Med 1 g flytter skibet sig jævnt hen over skærmen. Set fra Jorden kryber det af sted i starten og farer gennem midten. I lysuret går lyset ufatteligt meget langsommere end i virkeligheden, og man kan ikke se et lysglimt undervejs. Lysuret har sin egen fart (højst 99 %), for ved rejsens farter ville spejlene fare forbi alt for hurtigt til, at man kan følge dem. Animationen viser det, man ville regne sig frem til.</p>`,
  },

  lav(gruppe, { fase, lyd, forklaring, overlag, opdaterKnapper, sætKontakt, vælgFænomen, tiden }) {
    // ---------- Scenen: Jorden, målene og skibet ----------
    const jorden = lavJorden(1.3);
    jorden.klode.position.set(JORD_X, 0, 0);
    jorden.sætLys(new THREE.Vector3(JORD_X + 40, 18, 70), 1);
    gruppe.add(jorden.klode);

    // Alpha Centauri A og B
    const alpha = new THREE.Group();
    const alphaA = stjerne(0.95, '#fff4d6', '#e8a040', new THREE.Color(2.0, 1.7, 1.0), 3.0);
    alphaA.position.set(-0.1, 0.25, -0.8);
    const alphaB = stjerne(0.72, '#ffd6a0', '#c8601c', new THREE.Color(1.9, 1.0, 0.45), 2.8);
    alphaB.position.set(1.4, -0.45, 0.7);
    alpha.add(alphaA, alphaB);

    // TRAPPIST-1: en lille, rød stjerne (en rød dværg) med syv planeter, der kredser tæt om den. Ikke i skala: Planeterne
    // er tegnet meget større og længere ude. Den relative fart følger omløbstiderne (1,5-19 døgn står i Wikipedia
    // "TRAPPIST-1", de enkelte tal er efter hukommelsen og bruges kun til farten), men alle går langt hurtigere på skærmen.
    const trappist = new THREE.Group();
    const trappistStjerne = stjerne(0.55, '#ffb070', '#b8300c', new THREE.Color(1.9, 0.7, 0.3), 2.4);
    trappist.add(trappistStjerne);
    const OMLØB = [1.51, 2.42, 4.05, 6.10, 9.21, 12.35, 18.77]; // b-h, døgn
    const planetMat = new THREE.MeshStandardMaterial({ color: 0xb89a84, roughness: 0.9 });
    const planeter = OMLØB.map((p, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), planetMat);
      m.userData = { r: 0.85 + i * 0.2, fart: 3 / p, v: i * 2.4 };
      trappist.add(m);
      return m;
    });
    const planetLys = new THREE.PointLight(0xff9a60, 3, 0, 1.2);
    trappist.add(planetLys);
    trappist.rotation.set(0.35, 0, 0.12); // banerne set lidt fra oven
    function drejPlaneter(dt) {
      for (const m of planeter) {
        const u = m.userData;
        u.v += dt * u.fart;
        m.position.set(Math.cos(u.v) * u.r, 0, Math.sin(u.v) * u.r);
      }
    }
    drejPlaneter(0);

    // Mælkevejens centrum: en tæt, gullig bule af stjerner med et lyst midtpunkt (det sorte hul Sgr A* kan ikke ses)
    const centrum = new THREE.Group();
    const NB = Math.round(2600 * KVALITET);
    const bule = prikSky(NB, 0.13, (i, c) => { const v = 0.75 + Math.random() * 0.5; c.setRGB(1.5 * v, 1.2 * v, 0.75 * v); });
    {
      const a = bule.geometry.attributes.position.array;
      for (let i = 0; i < NB; i++) {
        // En gaussisk sky, lidt fladere end en kugle (skrevet med Box-Muller)
        const r = Math.sqrt(-2 * Math.log(1 - Math.random())) * 0.75;
        const u = Math.random() * 2 - 1, v = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
        a.set([r * s * Math.cos(v) * 1.2, r * u * 0.7, r * s * Math.sin(v) * 1.2], i * 3);
      }
    }
    const kerne = glød(new THREE.Color(1.8, 1.4, 0.9), 2.6, 0.9);
    centrum.add(bule, kerne);

    // Andromedagalaksen: en flad, skrå spiral af stjerner med en lys kerne
    const andromeda = new THREE.Group();
    const NA = Math.round(3200 * KVALITET);
    const skive = prikSky(NA, 0.11, (i, c) => { const ydre = (i % 7) / 7; c.setRGB(1.3 - 0.5 * ydre, 1.15 - 0.2 * ydre, 0.85 + 0.7 * ydre); });
    {
      const a = skive.geometry.attributes.position.array;
      for (let i = 0; i < NA; i++) {
        const r = 0.15 + Math.pow(Math.random(), 0.8) * 2.4;
        const arm = (i % 2) * Math.PI;
        const v = arm + r * 1.9 + (Math.random() - 0.5) * 0.9;
        a.set([Math.cos(v) * r, (Math.random() - 0.5) * 0.08, Math.sin(v) * r], i * 3);
      }
    }
    const andKerne = glød(new THREE.Color(1.7, 1.45, 1.0), 1.9, 0.9);
    andromeda.add(skive, andKerne);
    andromeda.rotation.set(1.15, 0.4, 0.25); // skråt set, som på billederne fra Jorden

    const målGrupper = { alpha, trappist, centrum, andromeda };
    for (const g of Object.values(målGrupper)) gruppe.add(g);

    const navnJord = skilt('Jorden', '#cfe0ff', 1.25);
    const navneMål = Object.fromEntries(T.MÅL_RÆKKE.map((k) => [k, skilt(T.MÅL[k].navn, '#ffe6b0', 1.25)]));
    const afstande = Object.fromEntries(T.MÅL_RÆKKE.map((k) => [k, skilt(T.MÅL[k].afstand, '#9fb4d8', 1.0)]));
    const klemt = skilt('kortere set fra skibet', '#9fe6ff', 1.0);
    gruppe.add(navnJord, klemt, ...Object.values(navneMål), ...Object.values(afstande));

    // Vejen imellem (stiplet), fra x = 0 til 1, så den kan strækkes, når scenen trykkes sammen
    const vejGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)]);
    const vej = new THREE.Line(vejGeo, new THREE.LineDashedMaterial({ color: 0x6f8fc8, dashSize: 0.35 / 20, gapSize: 0.3 / 20, transparent: true, opacity: 0.55 }));
    vej.computeLineDistances();
    gruppe.add(vej);

    // Skibet peger mod +x (en krop, en næse, tre finner og flammen bagved)
    const skib = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: 0xd8dee8, metalness: 0.5, roughness: 0.35 });
    const krop = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.8, 20), metal);
    krop.rotation.z = -Math.PI / 2;
    const næse = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.34, 20), new THREE.MeshStandardMaterial({ color: 0xff7a4a, roughness: 0.4 }));
    næse.rotation.z = -Math.PI / 2;
    næse.position.x = 0.57;
    skib.add(krop, næse);
    for (let i = 0; i < 3; i++) {
      const finne = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.16), metal);
      const v = (i / 3) * Math.PI * 2;
      finne.position.set(-0.32, Math.cos(v) * 0.17, Math.sin(v) * 0.17);
      finne.rotation.x = v;
      skib.add(finne);
    }
    const flamme = glød(new THREE.Color(0.7, 1.3, 2.6), 1.1, 0);
    flamme.position.x = -0.55;
    skib.add(flamme);
    skib.scale.setScalar(1.25);
    const skibHale = hale(Math.round(70 * KVALITET + 30), 0x7fc8ff, 0.55);
    gruppe.add(skib, skibHale.linje);

    // ---------- Urene (HTML oven på 3D-billedet) ----------
    const ure = document.createElement('div');
    ure.className = 'tid-ure';
    const streger = Array.from({ length: 12 }, (_, i) => {
      const v = (i / 12) * Math.PI * 2;
      return `<line x1="${(Math.sin(v) * 15).toFixed(2)}" y1="${(-Math.cos(v) * 15).toFixed(2)}" x2="${(Math.sin(v) * 18).toFixed(2)}" y2="${(-Math.cos(v) * 18).toFixed(2)}"/>`;
    }).join('');
    ure.innerHTML = `
      <div class="tid-ur"><span class="tid-figur" hidden></span><span class="tid-ur-navn">🚀 Dit ur</span><strong class="tid-ur-tal"></strong><span class="tid-ur-alder"></span></div>
      <div class="tid-ur tid-ur-jord"><span class="tid-figur" hidden></span>
        <svg class="tid-skive" viewBox="-21 -21 42 42" aria-hidden="true"><circle r="20"/><circle class="tid-sløret" r="16"/><g class="tid-streger">${streger}</g><line class="tid-viser" x1="0" y1="3" x2="0" y2="-15"/><circle class="tid-midt" r="2"/></svg>
        <div class="tid-ur-tekst"><span class="tid-ur-navn">🌍 Jordens ur</span><strong class="tid-ur-tal"></strong><span class="tid-ur-alder"></span></div>
      </div>`;
    const [skibTal, jordTal] = ure.querySelectorAll('.tid-ur-tal');
    const [skibAlder, jordAlder] = ure.querySelectorAll('.tid-ur-alder');
    const viser = ure.querySelector('.tid-viser');
    // Figurerne står oven på urene (position: absolute), så urene ikke flytter sig, når de kommer frem
    const [skibFigur, jordFigur] = ure.querySelectorAll('.tid-figur');
    const jordUr = ure.querySelector('.tid-ur-jord');

    // ---------- Lysuret (et lærred med to lysure side om side) ----------
    const lysur = document.createElement('div');
    lysur.className = 'tid-lysur';
    lysur.hidden = true;
    const lærred = document.createElement('canvas');
    lysur.append(lærred);
    // ---------- "Dit ur" stort (forløbets trin A2): et helt almindeligt sekund om bord ----------
    // Sekundviseren går ét sekund ad gangen, og hjertet slår 72 gange i minuttet. Imens holder rejsen pause, for på
    // skærmen går skibets tid også meget hurtigt (en tur på 1,2 år tager 25 sekunder).
    const mitUr = document.createElement('div');
    mitUr.className = 'tid-mit-ur';
    mitUr.hidden = true;
    const mærker = Array.from({ length: 12 }, (_, i) => {
      const v = (i / 12) * Math.PI * 2;
      return `<line x1="${(Math.sin(v) * 31).toFixed(2)}" y1="${(-Math.cos(v) * 31).toFixed(2)}" x2="${(Math.sin(v) * 36).toFixed(2)}" y2="${(-Math.cos(v) * 36).toFixed(2)}"/>`;
    }).join('');
    mitUr.innerHTML = `
      <svg class="tid-mit-skive" viewBox="-42 -42 84 84" aria-hidden="true"><circle r="40"/><g class="tid-mit-mærker">${mærker}</g>
        <line class="tid-mit-time" x1="0" y1="4" x2="13" y2="-12"/><line class="tid-mit-minut" x1="0" y1="5" x2="-6" y2="-27"/>
        <line class="tid-mit-sekund" x1="0" y1="8" x2="0" y2="-33"/><circle class="tid-mit-midt" r="2.6"/></svg>
      <svg class="tid-hjerte" viewBox="0 0 32 29" aria-hidden="true"><path d="M16 28 C 6 20 0 14 0 8 A 8 8 0 0 1 16 5 A 8 8 0 0 1 32 8 C 32 14 26 20 16 28 Z"/></svg>
      <div class="tid-mit-tekst"><b>Om bord, lige nu</b><span>Sekundviseren går ét sekund ad gangen, og dit hjerte slår, som det plejer. Rejsen holder pause, mens du kigger.</span></div>`;
    const sekundViser = mitUr.querySelector('.tid-mit-sekund');
    const hjerte = mitUr.querySelector('.tid-hjerte');
    let mitUrVist = false;
    let mitUrSek = 0; // sekunder, mens "Dit ur" er fremme (står stille under pause)
    overlag().append(mitUr, ure, lysur);

    // ---------- Tilstanden ----------
    let ni = START_NI; // antallet af 9-taller på skyderen
    let målNr = T.MÅL_RÆKKE.indexOf(T.START_MÅL); // målets kontakt (T.MÅL_RÆKKE), TRAPPIST-1 først
    let enG = false; // kontakten "1 g hele vejen"
    let fraSkib = false; // kontakten "Set fra skibet"
    let tilstand = 'hjemme'; // 'hjemme' (før afgang), 'ud', 'hjem' eller 'færdig'
    let skibÅr = 0; // tiden i skibet siden afgang
    let jordÅr = 0; // tiden på Jorden siden afgang
    let pos = 0; // skibets afstand fra Jorden i lysår
    let vejS = 0; // med 1 g: tiden i skibet på denne vej
    let vejStart = { skibÅr: 0, jordÅr: 0 }; // urene, da denne vej begyndte
    let gammaNu = 1; // γ lige nu (1, når skibet står stille)
    let fartNu = 0; // v/c lige nu
    let ved = { skibÅr: 0, jordÅr: 0 }; // urene, da skibet nåede målet
    let turKort = false; // turen tager under en dag i skibet: "Dit ur" viser timer og minutter
    let hurtig = false; // ⏩
    let lysurVist = false;
    let faseNr = 0;
    let vending = 0; // skibets drejning: 0 = mod målet, 1 = mod Jorden
    let klem = 1; // "Set fra skibet": hvor meget scenen er trykket sammen (1 = ikke)
    let jordFart = 0; // år på Jorden pr. sekund på skærmen (til urskiven)
    // Lysurets egne ure: fasen i skibet og set fra Jorden (i tik) og spejlenes vej set fra Jorden (i lysurets højder)
    // spor: zigzaggens knæk set fra Jorden som [x (pixel, før billedet følger med), fase i tik]. stille: trinnet med
    // den skrå vej står stille, når lyset er nået op.
    const ly = Lys.nytUr();
    let lysTrin = 0; // trinnet i lysuret (LYS_TRIN)
    let lysFart = T.LYSUR_START; // skyderen "Fart i lysuret" i det sidste trin (T.LYSUR_FARTER)

    const mål = () => T.MÅL[T.MÅL_RÆKKE[målNr]];
    const flyver = () => tilstand === 'ud' || tilstand === 'hjem';
    // Hele turen ud og hjem, som den er planlagt nu: { skibÅr, jordÅr, gamma (fast fart eller størst midtvejs) }
    function plan() {
      if (enG) {
        const r = T.enG(mål().lysår);
        return { skibÅr: 2 * r.skibÅr, jordÅr: 2 * r.jordÅr, gamma: r.gamma };
      }
      const r = T.rejse(mål().lysår, ni);
      return { skibÅr: r.skibÅr, jordÅr: r.jordÅr, gamma: r.gamma };
    }

    function visUre() {
      const t1 = T.ditUr(skibÅr, turKort);
      const t2 = `år ${T.årstalTekst(T.jordÅrstal(START_ÅR, jordÅr))}`;
      const a1 = T.forGammel(skibÅr) ? 'Du: over 100 år' : `Du: ${T.alderTekst(T.START_ALDER + skibÅr)}`;
      const tvilling = T.tvillingAlder(jordÅr);
      const a2 = tvilling !== null ? `Tvillingen: ${tvilling} år` : 'Tvillingen levede et langt liv';
      if (skibTal.textContent !== t1) skibTal.textContent = t1;
      if (jordTal.textContent !== t2) jordTal.textContent = t2;
      if (skibAlder.textContent !== a1) skibAlder.textContent = a1;
      if (jordAlder.textContent !== a2) jordAlder.textContent = a2;
      // Viseren går én gang rundt pr. år på Jorden. Går den så hurtigt, at man ikke kan følge den, bliver den en skive.
      const løbsk = flyver() && jordFart > LØBSK;
      if (jordUr.classList.contains('løbsk') !== løbsk) jordUr.classList.toggle('løbsk', løbsk);
      viser.setAttribute('transform', `rotate(${(((jordÅr % 1) * 360)).toFixed(1)})`);
      visFigurer();
    }

    // De tegnede figurer (jeres valg 13. november 2026): før afgang to ens 13-årige, undervejs bliver tvillingen ældre,
    // mens Jordens ur løber, og ved hjemkomsten står I der begge. Tegnet efter alderen (T.figurSlags). Over ca. 100 år
    // står kun teksten.
    function visFigurer() {
      const dig = T.forGammel(skibÅr) ? null : T.figurSlags(Math.floor(T.START_ALDER + skibÅr));
      const tvilling = T.figurSlags(T.tvillingAlder(jordÅr));
      for (const [el, slags, spejl] of [[skibFigur, dig, false], [jordFigur, tvilling, true]]) {
        if ((el.dataset.slags ?? '') === (slags ?? '')) continue;
        el.dataset.slags = slags ?? '';
        el.innerHTML = slags ? figurSVG(slags, { spejl }) : '';
        el.hidden = !slags;
        // Toningen ind kører igen, når figuren skifter (fx når tvillingen bliver voksen)
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      }
    }

    // "Lige nu" i panelet: hvad farten betyder (skrives kun om, når teksten ændrer sig)
    function visLigeNu() {
      const m = mål();
      if (lysurVist) {
        const v = lysV();
        let html = `<p><b>Lige nu:</b> To billeder af det samme lysur, der farer forbi Jorden med ${T.lysurFartTekst(v)} af lysets fart.`;
        html += v > 0 ? ` Set fra Jorden tager hvert tik ${T.tal(T.lysurGamma(v), 1).replace(',0', '')} gange så lang tid.</p>` : ' Ved 0 % står skibet stille, og de to billeder er ens.</p>';
        html += `<p>${lysTrin === LYS_TRIN.length - 1 ? '' : 'Gå frem med "Næste" i bjælken. '}${enG ? '' : `På rejsen flyver du med ${T.fartTekst(ni)}: Der tager hvert tik ${T.gammaTekst(T.gamma(ni))} gange så lang tid set fra Jorden.`}</p>`;
        // Det sidste trin peger videre til "Hvorfor går tiden langsommere?" (T5c): fem scener, der forklarer hvorfor
        if (lysTrin === LYS_TRIN.length - 1) html += `<p>Vil du se hvorfor, trin for trin, og hvorfor det er den rejsende, der kommer yngst hjem? ${gå('kosmos:tidhvorfor', '🔦 Hvorfor går tiden langsommere?')}</p>`;
        forklaring(html);
        return;
      }
      const p = plan();
      const hvordan = enG ? 'Med 1 g hele vejen' : `Ved ${T.fartTekst(ni)} af lysets fart`;
      let html = `<p><b>Lige nu:</b> ${hvordan} tager turen til ${m.navn} og hjem ca. ${T.varighed(p.skibÅr)} for dig og ca. ${T.varighed(p.jordÅr)} på Jorden.`;
      if (enG) html += ` Farten er størst midtvejs: ${T.fartFraGamma(p.gamma)} af lysets fart.`;
      else html += ` For hver dag i skibet går der ca. ${T.prDagTekst(p.gamma)} på Jorden.`;
      html += '</p>';
      if (T.forGammel(p.skibÅr)) html += `<p>Det er længere, end et menneske kan leve. ${enG ? 'Prøv et nærmere mål.' : 'Skru op for farten.'}</p>`;
      // Hvordan du flyver (jeres spørgsmål 8. november 2026: hvad betyder 1 g, og hvad er alternativet?)
      if (!flyver()) {
        html += enG
          ? '<p><b>1 g hele vejen:</b> Raketten trykker dig ned i sædet lige så hårdt, som tyngden gør på Jorden. Midtvejs vender den om og bremser. Sådan kunne det gå i virkeligheden, og derfor tager det år.</p>'
          : '<p><b>Fast fart:</b> Vi snyder lidt: Du har fuld fart fra første sekund. I virkeligheden skal man først speede op. Prøv kontakten "1 g hele vejen" og se forskellen.</p>';
      }
      // "Hurtigere end lyset?" Tiden i dit ur er kortere, end lyset bruger (jeres spørgsmål 8. november 2026)
      const ud = enG ? T.enG(m.lysår) : T.rejse(m.lysår, ni).ud;
      if ((!flyver() || faseNr === 2) && ud.skibÅr < m.lysår) {
        html += `<p><b>Hurtigere end lyset?</b> Nej. At nå ${m.afstand} på ${T.varighed(ud.skibÅr)} lyder sådan, men set fra Jorden tager turen ${T.varighed(ud.jordÅr)} én vej, og et lysglimt, der blev sendt af sted samtidig med dig, ville kun komme ${T.forspringTekst(m.lysår, ud.jordÅr)} før dig. Set fra Jorden går dit ur langsommere. Læs emnet "Hurtigere end lyset? Nej!" nedenfor.</p>`;
      }
      // Afstanden med to tal: set fra Jorden og set fra skibet (d/γ)
      if (flyver()) {
        const tilbage = tilstand === 'ud' ? m.lysår - pos : pos;
        const hvorhen = tilstand === 'ud' ? m.navn : 'Jorden';
        html += `<p>Til ${hvorhen}: ${T.lysårTekst(tilbage)} set fra Jorden`;
        // Først når farten er høj, er vejen tydeligt kortere set fra skibet (γ = 1,1 ved ca. 42 %)
        html += gammaNu > 1.1 ? `, men kun ${T.lysårTekst(tilbage / gammaNu)} set fra skibet.` : '.';
        if (enG) html += ` Farten nu: ${T.fartFraGamma(gammaNu)}.`;
        html += '</p>';
        if (faseNr === 2) html += `<p>En radiobesked hjem tager ${T.varighed(m.lysår)}, for den går med lysets fart.</p>`;
        else if (!enG) html += '<p>Du kan skifte fart undervejs.</p>';
      } else {
        html += `<p>Afstanden: ${m.afstand} set fra Jorden. ${enG ? 'Midtvejs' : 'Under turen'} er den kun ${T.lysårTekst(m.lysår / p.gamma)} set fra skibet.</p>`;
        html += tilstand === 'færdig' ? '<p>Vælg et andet mål eller en anden fart, og flyv igen.</p>' : '<p>Du og din tvilling er begge 13 år.</p>';
      }
      forklaring(html);
    }

    function visFase() {
      if (lysurVist) {
        const t = LYS_TRIN[lysTrin];
        fase(t.titel, t.tekst, [lysTrin + 1, LYS_TRIN.length]);
        return;
      }
      const m = mål();
      const gange = gammaNu < 10 ? T.tal(gammaNu, 1) : T.rundTal(gammaNu);
      if (faseNr === 0) fase(null);
      else if (faseNr === 1) {
        if (enG) fase('Afgang', 'Du speeder op med 1 g. Det føles, som når du står på Jorden. Midtvejs vender skibet om og bremser resten af vejen.', [1, 4]);
        else if (ni === 0) fase('Afgang', 'Du flyver med halv lysfart. Se urene: Jordens ur går kun lidt hurtigere end dit. Om bord mærker du intet.', [1, 4]);
        else fase('Afgang', `Du flyver med ${T.fartTekst(ni)} af lysets fart. Se urene: Jordens ur løber fra dit. Om bord mærker du intet.`, [1, 4]);
      } else if (faseNr === 2) fase(`Ude ved ${m.ved}`, `For dig har turen taget ${T.varighed(ved.skibÅr)}. På Jorden er der gået ${T.varighed(ved.jordÅr)}. Nu vender du om.`, [2, 4]);
      else if (faseNr === 3) {
        if (enG) fase('På vej hjem', 'Du speeder op mod Jorden og bremser igen. Jordens ur løber hurtigst, når farten er størst. Dit ur går stadig helt normalt for dig.', [3, 4]);
        else fase('På vej hjem', `Set fra Jorden går alle ure i skibet ca. ${gange} gange langsommere end Jordens. Dit ur går stadig helt normalt for dig.`, [3, 4]);
      } else fase(T.forGammel(skibÅr) ? 'Turen er slut' : 'Hjemme igen', T.hjemkomst(skibÅr, jordÅr, START_ÅR), [4, 4]);
    }

    // Skibets plads på skærmen (0 ved Jorden, 1 ved målet). Med 1 g flytter det sig jævnt i sin egen tid.
    function andel() {
      if (!enG || !flyver()) return pos / mål().lysår;
      const f = vejS / T.enG(mål().lysår).skibÅr;
      return tilstand === 'ud' ? f : 1 - f;
    }

    // Scenen: Skibet står på sin plads, og med "Set fra skibet" trykkes afstandene sammen om skibet
    function stilScene() {
      const sx = SKIB_FRA + (SKIB_TIL - SKIB_FRA) * andel();
      skib.position.set(sx, SKIB_Y, 0);
      skib.rotation.y = Math.PI * vending;
      const tæt = (fra, mindst) => Math.max(fra * klem, Math.min(fra, mindst));
      const k = T.MÅL_RÆKKE[målNr];
      const jx = sx - tæt(sx - JORD_X, 3.2);
      const stjerner = k === 'alpha' || k === 'trappist';
      const mx = sx + tæt(MÅL_X - sx, stjerner ? 3.2 : 4.2); // en galakse er bredere end stjernerne
      jorden.klode.position.x = jx;
      navnJord.position.set(jx, 2.6, 0);
      målGrupper[k].position.set(mx, 0, 0);
      navneMål[k].position.set(mx + (k === 'alpha' ? 0.4 : 0), k === 'alpha' ? 2.6 : 2.9, 0);
      const a = Math.min(sx, jx + 2.1);
      const b = Math.max(sx, mx - 2.4);
      vej.position.x = a;
      vej.scale.x = Math.max(0.01, b - a);
      // Når scenen er trykket sammen, står "kortere set fra skibet" under skibet i stedet for afstanden (ellers står
      // teksten oven i galaksen)
      klemt.visible = fraSkib && klem < 0.97;
      afstande[k].visible = !klemt.visible;
      afstande[k].position.set((a + b) / 2, -0.95, 0);
      klemt.position.set(sx, -2.7, 0);
    }

    function visMål() {
      const k = T.MÅL_RÆKKE[målNr];
      for (const id of T.MÅL_RÆKKE) {
        målGrupper[id].visible = id === k;
        navneMål[id].visible = id === k;
        afstande[id].visible = false; // stilScene() viser afstanden til det valgte mål
      }
    }

    function nulstil() {
      tilstand = 'hjemme';
      skibÅr = 0;
      jordÅr = 0;
      pos = 0;
      vejS = 0;
      vejStart = { skibÅr: 0, jordÅr: 0 };
      gammaNu = 1;
      fartNu = 0;
      jordFart = 0;
      vending = 0;
      faseNr = 0;
      flamme.material.opacity = 0;
      visMål();
      stilScene();
      skibHale.nulstil(skib.position);
      visUre();
      visFase();
      visLigeNu();
    }

    function flyv() {
      nulstil();
      tilstand = 'ud';
      faseNr = 1;
      turKort = plan().skibÅr * T.DAGE_PR_ÅR < 1;
      if (enG) { gammaNu = 1; fartNu = 0; } else { gammaNu = T.gamma(ni); fartNu = T.fart(ni); }
      lyd.sus?.(2);
      visUre();
      visFase();
      visLigeNu();
      tegnForløb(); // forløbets knapper følger med (fx er "Dit ur" kun aktiv undervejs)
    }

    function visLysur(til) {
      lysurVist = til;
      ure.hidden = til;
      lysur.hidden = !til;
      if (til) {
        lysTrin = 0;
        lysFart = T.LYSUR_START;
        lysSkyder.værdi = lysFart;
        nulstilLy();
        tegnLysur();
      }
      byg();
      opdaterKnapper();
      visFase();
      visLigeNu();
    }

    // Skibet er nået frem til målet eller hjem
    function vejSlut() {
      if (tilstand === 'ud') {
        pos = mål().lysår;
        tilstand = 'hjem';
        ved = { skibÅr, jordÅr };
        vejStart = { skibÅr, jordÅr };
        vejS = 0;
        faseNr = 2;
        visFase();
        visLigeNu();
      } else {
        pos = 0;
        tilstand = 'færdig';
        faseNr = 4;
        gammaNu = 1;
        fartNu = 0;
        flamme.material.opacity = 0;
        lyd.klaret?.();
        hjemMed.add(enG ? 'g' : ni);
        if (kørerForløb()) hurtig = false; // ⏩ i forløbets linje gælder én tur (ellers styrer tidsknappen det)
        visUre();
        tegnForløb();
        visFase();
        visLigeNu();
        opdaterKnapper();
      }
    }

    // Med fast fart: rejsen frem med dJord år på Jorden. Ved målet og ved hjemkomsten deles skridtet, så tallene passer.
    function rejs(dJord) {
      const v = T.fart(ni);
      const g = T.gamma(ni);
      gammaNu = g;
      fartNu = v;
      while (dJord > 0 && flyver()) {
        const tilbage = tilstand === 'ud' ? mål().lysår - pos : pos; // lysår til næste vending eller hjem
        const tidTil = tilbage / v;
        const d = Math.min(dJord, tidTil);
        jordÅr += d;
        skibÅr += d / g;
        pos += (tilstand === 'ud' ? 1 : -1) * v * d;
        dJord -= d;
        if (d >= tidTil) vejSlut();
      }
    }

    // Med 1 g: rejsen frem med dSkib år i skibet. Hver vej regnes forfra fra sin start (T.enGUndervejs), så der ikke
    // samler sig fejl op, når tiden lægges sammen bid for bid.
    function rejs1g(dSkib) {
      while (dSkib > 0 && flyver()) {
        const r = T.enG(mål().lysår);
        const d = Math.min(dSkib, r.skibÅr - vejS);
        vejS += d;
        dSkib -= d;
        const u = T.enGUndervejs(mål().lysår, vejS);
        skibÅr = vejStart.skibÅr + vejS;
        jordÅr = vejStart.jordÅr + u.jordÅr;
        pos = tilstand === 'ud' ? u.pos : mål().lysår - u.pos;
        gammaNu = u.gamma;
        fartNu = u.fart;
        if (vejS >= r.skibÅr - 1e-12) {
          skibÅr = vejStart.skibÅr + r.skibÅr;
          jordÅr = vejStart.jordÅr + r.jordÅr;
          vejSlut();
        }
      }
    }

    function skridt(dt) {
      const før = jordÅr;
      const m = mål();
      if (enG) rejs1g(dt * (T.enG(m.lysår).skibÅr / SKÆRM_VEJ));
      else rejs(dt * (m.lysår / SKÆRM_VEJ));
      jordFart = dt > 0 ? (jordÅr - før) / dt : 0;
      // På vej hjem: Efter ca. en tredjedel af hjemturen skifter underteksten fra "Ude ved målet" til "På vej hjem"
      if (tilstand === 'hjem' && faseNr === 2 && andel() < 0.7) {
        faseNr = 3;
        visFase();
      }
    }

    // ---------- Lysuret (trin for trin, jeres ønske 8. november 2026) ----------
    // To billeder: til venstre uret i skibet (smalt) og til højre det samme ur set fra Jorden (bredt). I billedet fra
    // Jorden flytter spejlene sig mod højre. Når de er ved at nå kanten, følger billedet med dem, og de lodrette streger
    // (som står stille i forhold til Jorden) glider mod venstre i stedet. Så kommer spejlene aldrig ud af billedet.
    const lysV = () => T.LYSUR_FARTER[lysTrin === LYS_TRIN.length - 1 ? lysFart : T.LYSUR_START];
    function lysGeo() {
      const W = lærred.clientWidth || 520;
      const H = lærred.clientHeight || 220;
      const lille = W < 400;
      const skrift = lille ? 11 : 13;
      const mellem = 10;
      const ws = (W - mellem) * 0.32; // skibets billede
      const we = W - mellem - ws; // billedet fra Jorden
      const top = skrift + 16;
      const L = Math.min(H - top - skrift - 14, we * 0.45); // samme afstand mellem spejlene i begge billeder
      const sw = Math.min(40, ws * 0.3);
      const xs0 = sw / 2 + 8; // spejlenes start i billedet fra Jorden
      return { W, H, lille, skrift, mellem, ws, we, top, L, bund: top + L, sw, xs0, c: (2 * L) / Lys.LYS_TIK };
    }
    // Hvor meget billedet fra Jorden er rykket med spejlene
    const lysForskud = (G) => Lys.jordForskud(ly, G);

    const nulstilLy = () => Lys.nulstilUr(ly);

    function tegnLysur() {
      const G = lysGeo();
      const { W, H, lille, skrift, mellem, ws, we, top, L: højde, sw } = G;
      const g = Lys.klarLærred(lærred, W, H);
      const v = lysV();
      const gam = T.lysurGamma(v);
      const r = lille ? 5 : 6;
      const tekst = (s, x, y, farve = Lys.FARVE.tekst, vægt = 600) => Lys.tekst(g, s, x, y, { farve, vægt, str: skrift });
      const tikTekst = (n) => `Tik: ${T.tal(Math.floor(n + 1e-9))}`;
      const trekant = lysTrin === 2;

      // Til venstre: i skibet står spejlene stille, og lyset går lige op og ned
      g.save();
      Lys.boks(g, 0, 0, ws, H, { aktiv: lysTrin === 0 });
      tekst(lille ? 'I skibet' : 'Set i skibet', ws / 2, skrift + 3);
      Lys.tegnSkibUr(g, ly, { x: ws / 2, top, L: højde, sw, lige: trekant, r });
      if (trekant) tekst('lige vej', ws / 2, H - 5, Lys.FARVE.lige, 700);
      else tekst(tikTekst(ly.skib), ws / 2, H - 5, Lys.FARVE.tik, 700);
      g.restore();

      // Til højre: set fra Jorden farer spejlene forbi, og lyset går skråt (zigzag)
      g.save();
      g.translate(ws + mellem, 0);
      Lys.boks(g, 0, 0, we, H, { aktiv: lysTrin === 1 });
      if (lysTrin === 0) {
        // Første trin: kun uret i skibet
        tekst('Set fra Jorden', we / 2, skrift + 3, 'rgba(201,214,238,0.45)');
        tekst('kommer i næste trin ›', we / 2, top + højde / 2 + skrift / 2, 'rgba(201,214,238,0.45)');
        g.restore();
        return;
      }
      tekst(v > 0 ? 'Set fra Jorden: skibet farer forbi →' : 'Set fra Jorden: skibet står stille', we / 2, skrift + 3);
      Lys.tegnJordUr(g, ly, { v, top, L: højde, sw, xs0: G.xs0, we, skrå: trekant, r });
      if (!trekant) tekst(tikTekst(ly.jord), we / 2, H - 5, Lys.FARVE.tik, 700);
      else if (ly.stille) {
        tekst('lige vej', we * 0.27, H - 5, Lys.FARVE.lige, 700);
        tekst(`${lille ? 'skrå' : 'skrå vej'}: ${T.tal(gam, 1).replace(',0', '')} gange så lang`, we * 0.66, H - 5, Lys.FARVE.skrå, 700);
      }
      g.restore();
    }

    function opdaterLysur(dt) {
      if (ly.stille) return;
      const G = lysGeo();
      // Trinnet "Den skrå vej er længere" stopper, når lyset set fra Jorden er nået op til det øverste spejl
      Lys.skridtUr(ly, dt, { v: lysV(), c: G.c, bredde: G.we, stopOppe: lysTrin === 2 });
      tegnLysur();
    }

    // Gå til et trin i lysuret (bjælken: ‹ og "Næste")
    function gåLysTrin(nr) {
      lysTrin = Math.max(0, Math.min(LYS_TRIN.length - 1, nr));
      nulstilLy();
      byg();
      opdaterKnapper();
      visFase();
      visLigeNu();
      tegnLysur();
    }
    const lysSkyder = {
      skyder: true, navn: 'Fart i lysuret', min: 0, max: T.LYSUR_FARTER.length - 1, værdi: T.LYSUR_START,
      vis: (i) => T.lysurFartTekst(T.LYSUR_FARTER[i]),
      ændring: (v) => { lysFart = v; nulstilLy(); visLigeNu(); },
    };

    // ---------- Styringen ----------
    // Et skift af mål eller af 1 g starter forfra: En halv tur kan ikke regnes om til en anden slags tur. Styr-boksen
    // bygges ikke om her (det ville afbryde et træk i skyderen "Mål"). Bjælken følger selv med 4 gange i sekundet.
    function startForfra() {
      if (tilstand !== 'hjemme') nulstil();
      else { visMål(); stilScene(); visFase(); visLigeNu(); }
    }
    const flyvKnap = { get tekst() { return `🚀 Flyv til ${mål().kort}`; }, handling: flyv, deaktiv: flyver, skjul: () => lysurVist };
    // Målene er fire kontakter, hvor præcis én er tændt (jeres ønske 8. november 2026: målet skal ikke vælges med en
    // skyder). Et tryk på det mål, der allerede er valgt, slukker det ikke.
    const målKontakter = T.MÅL_RÆKKE.map((k, i) => ({
      tekst: `🎯 ${T.MÅL[k].kort}`, til: i === målNr,
      skift: () => {
        for (const [j, mk] of målKontakter.entries()) { mk.til = j === i; sætKontakt(mk.tekst, j === i); }
        if (målNr === i) return;
        målNr = i;
        startForfra();
      },
    }));
    const fartSkyder = {
      skyder: true, navn: 'Fast fart', min: T.MINDST_NI, max: T.FLEST_NI, værdi: ni, vis: T.fartTekst,
      ændring: (v) => {
        ni = v;
        if (flyver() && !enG) { gammaNu = T.gamma(ni); fartNu = T.fart(ni); }
        if (faseNr === 1 || faseNr === 3) visFase();
        visLigeNu();
      },
    };
    const enGKontakt = {
      tekst: '1 g hele vejen', til: false,
      skift: (til) => { enG = til; byg(); startForfra(); opdaterKnapper(); },
    };
    const skibKontakt = {
      tekst: 'Set fra skibet', til: false,
      skift: (til) => { fraSkib = til; },
    };
    const styring = [];
    // Styr-boksen efter tilstanden: Med 1 g er der ingen fast fart (skyderen er væk), og i lysuret kun farten
    function byg() {
      const liste = [
        flyvKnap,
        { tekst: '⏱ Vis lysuret', handling: () => visLysur(true), skjul: () => lysurVist },
        { tekst: '↩ Tilbage til rejsen', handling: () => visLysur(false), skjul: () => !lysurVist },
        { tekst: '↺ Forfra', handling: nulstil, skjul: () => lysurVist || tilstand === 'hjemme' },
        ...(lysurVist ? (lysTrin === LYS_TRIN.length - 1 ? [lysSkyder] : []) : [...målKontakter, ...(enG ? [] : [fartSkyder]), enGKontakt, skibKontakt]),
      ];
      styring.splice(0, styring.length, ...liste);
    }
    byg();

    // ---------- Forløbet "Rejsen i tid" (js/forloeb.js, drejebogen i docs/fable/E4-tid.md, afsnit 4) ----------
    // Teksterne står i js/data/forloeb/tid.js. Her står det, der rører scenen. Hvert trins start stiller målet og farten
    // og starter forfra, så "‹" kan gå tilbage. Imens er kun scenen, urene og forløbets linje fremme (style.css).
    const hjemMed = new Set(); // de farter (ni-taller, eller 'g'), man er fløjet hjem med, siden trinet startede (trin A3)

    // "Dit ur" stort: rejsen holder pause imens
    function visMitUr(til) {
      if (mitUrVist === til) return;
      mitUrVist = til;
      mitUr.hidden = !til;
      if (til) {
        mitUrSek = 0;
        harSetMitUr = true;
      }
    }
    let harSetMitUr = false;

    // Stiller målet og farten (som kontakterne og skyderen i Styr), slår 1 g, "Set fra skibet" og lysuret fra og starter forfra
    function stilTil(målId, n) {
      if (lysurVist) visLysur(false);
      enG = false;
      enGKontakt.til = false;
      sætKontakt(enGKontakt.tekst, false);
      fraSkib = false;
      skibKontakt.til = false;
      sætKontakt(skibKontakt.tekst, false);
      målNr = T.MÅL_RÆKKE.indexOf(målId);
      for (const [j, mk] of målKontakter.entries()) {
        mk.til = j === målNr;
        sætKontakt(mk.tekst, mk.til);
      }
      ni = n;
      fartSkyder.værdi = n;
      hurtig = false;
      visMitUr(false);
      hjemMed.clear();
      byg();
      opdaterKnapper();
      nulstil();
    }

    const flyvMed = (n) => {
      if (ni !== n) {
        ni = n;
        fartSkyder.værdi = n;
      }
      flyv();
    };
    // ⏩ under en tur (tidsknappen er skjult i forløbet)
    const hurtigKnap = { id: 'hurtig', tekst: '⏩ Hurtigere', gør: () => { hurtig = !hurtig; }, aktiv: () => flyver() && !mitUrVist, valgt: () => hurtig };
    const flyvIgen = (tekst) => ({ id: 'flyv', tekst, gør: flyv, aktiv: () => !flyver() });
    const visMigFlyv = (gør) => () => {
      if (!flyver()) gør();
      else hurtig = true;
    };

    const FL_DEL = {
      igen: 'fra hjælpen (?) i Kosmos eller fra "Din fremgang" i menuen',
      trin: {
        // A1: til TRAPPIST-1 (40,66 lysår) ved 99,99 % og hjem: du er 14, tvillingen 94
        flyv: {
          start: () => stilTil('trappist', 4),
          get knapper() { return [flyvIgen(tilstand === 'færdig' ? '🚀 Flyv igen' : '🚀 Flyv til TRAPPIST-1'), hurtigKnap]; },
          færdig: () => tilstand === 'færdig',
          visMig: visMigFlyv(flyv),
        },
        // A2: samme tur igen, og "Dit ur" undervejs
        maerke: {
          start: () => { stilTil('trappist', 4); harSetMitUr = false; },
          get knapper() {
            return [
              flyvIgen('🚀 Flyv igen'),
              { id: 'mitur', tekst: mitUrVist ? '↩ Tilbage til rejsen' : '⌚ Dit ur', gør: () => visMitUr(!mitUrVist), aktiv: () => flyver(), valgt: () => mitUrVist },
              hurtigKnap,
            ];
          },
          færdig: () => harSetMitUr && tilstand === 'færdig' && !mitUrVist,
          visMig: () => {
            if (!flyver()) flyv();
            else if (!harSetMitUr) visMitUr(true);
            else if (mitUrVist) visMitUr(false);
            else hurtig = true;
          },
        },
        // A3: Alpha Centauri (4,344 lysår) med 50 % (28 og 30) og med 99,99 % (13 år og 45 dage og 21). Først 50 %.
        // Begge ture starter med ⏩: Ved 50 % tager turen ellers 50 sekunder (skibet flyver halvt så hurtigt), og her er
        // det alderen, der skal sammenlignes. Man kan slå ⏩ fra.
        farten: {
          start: () => stilTil('alpha', 0),
          get knapper() {
            return [
              { id: 'halv', tekst: `🚀 Flyv med 50 %${hjemMed.has(0) ? ' ✓' : ''}`, gør: () => { flyvMed(0); hurtig = true; }, aktiv: () => !flyver() },
              { id: 'naesten', tekst: `🚀 Flyv med 99,99 %${hjemMed.has(4) ? ' ✓' : ''}`, gør: () => { flyvMed(4); hurtig = true; }, aktiv: () => !flyver() && hjemMed.has(0) },
              hurtigKnap,
            ];
          },
          færdig: () => hjemMed.has(0) && hjemMed.has(4) && tilstand === 'færdig',
          visMig: visMigFlyv(() => { flyvMed(hjemMed.has(0) ? 4 : 0); hurtig = true; }),
        },
      },
      slutTekst: () => 'Vælg "Leg frit" for at prøve andre mål, farter og "1 g hele vejen".',
      veje: [
        // Til forløb 2 "Hvordan kan det ske?" findes (næste session): fænomenet med de fem scener (jeres valg 13. november 2026)
        { tekst: '🔦 Hvordan kan det ske?', primær: true, gør: () => vælgFænomen('tidhvorfor') },
        { tekst: 'Leg frit' },
        { tekst: 'Er det målt?', hvorfor: 'tidMaalt' },
      ],
      // Scenen har fået ny størrelse: I forløbet er panelerne væk, så billedet zoomes efter bredden (hele vejen fra Jorden
      // til målet), og bagefter som før (fænomenets kamera)
      layout: () => {
        if (kørerForløb()) passerTilBoks(16.5, 4.5);
        else passerTil(14.5);
      },
      // Efter forløbet: laboratoriet som før (TRAPPIST-1 ved 99,99 %)
      slut: () => {
        visMitUr(false);
        hurtig = false;
        tiden('spil'); // tidsknappen kommer frem igen og skal passe med rejsen
      },
    };
    const startRejsen = () => startForløb(REJSEN_I_TID, FL_DEL);
    // Første gang, man åbner Rejsen i tid, og fra "Din fremgang", linket ?forloeb=rejsen-i-tid#kosmos eller hjælpen.
    // Startes, når fænomenet er bygget færdigt (skallen viser siden og Styr-boksen lige efter lav()).
    let stoppet = false; // fænomenet er lukket, før forløbet nåede at starte
    if (tagVentForløb([REJSEN_I_TID.id]) || starterSelv(REJSEN_I_TID)) {
      requestAnimationFrame(() => { if (!stoppet) startRejsen(); });
    }

    nulstil();
    let panelTid = 0;
    const bag = new THREE.Vector3(); // punktet bag skibet, hvor halen starter

    return {
      styring,
      hurtig: `rejsen går ${HURTIG} gange hurtigere`,
      tempo: (t) => { hurtig = t === 'hurtig'; },
      opdater(dt) {
        jorden.omdrejning.rotation.y += dt * 0.12;
        centrum.rotation.y += dt * 0.04;
        if (trappist.visible) drejPlaneter(dt);
        skive.rotation.y += dt * 0.03;
        if (lysurVist) {
          opdaterLysur(dt * (hurtig ? 3 : 1)); // ⏩ går 3 gange hurtigere her, så man stadig kan følge lyset
          return;
        }
        // "Dit ur" stort: rejsen holder pause, sekundviseren hopper ét sekund ad gangen, og hjertet slår 72 gange i minuttet
        if (mitUrVist) {
          mitUrSek += dt;
          sekundViser.setAttribute('transform', `rotate(${Math.floor(mitUrSek) * 6})`);
          if (!ROLIG) {
            const f = (mitUrSek * 72 / 60) % 1; // fasen i hjerteslaget
            hjerte.style.transform = `scale(${(1 + 0.16 * Math.exp(-f * 9) + 0.08 * Math.exp(-Math.abs(f - 0.22) * 14)).toFixed(3)})`;
          }
          return;
        }
        if (flyver()) {
          skridt(dt * (hurtig ? HURTIG : 1));
          flamme.material.opacity = 0.9;
          visUre();
        }
        // Skibet vender om ved målet (kun at se på: vendingen tager ingen tid i regnestykket)
        const målVending = tilstand === 'hjem' || tilstand === 'færdig' ? 1 : 0;
        vending = ROLIG ? målVending : vending + Math.sign(målVending - vending) * Math.min(Math.abs(målVending - vending), dt * 2.5);
        // "Set fra skibet": scenen trykkes sammen med γ^(−1/3), og det glider, så man kan se det ske
        const målKlem = fraSkib ? Math.pow(gammaNu, -KLEM) : 1;
        klem = ROLIG ? målKlem : klem + (målKlem - klem) * Math.min(1, dt * 3);
        stilScene();
        skibHale.følg(skib.localToWorld(bag.set(-0.5, 0, 0)));
        panelTid += dt;
        if (panelTid > 0.25) { panelTid = 0; visLigeNu(); }
      },
      stop: () => {
        stoppet = true;
        stopForløb();
      },
      // Lysuret går frem trin for trin med bjælken (‹ og "Næste")
      trin: () => (lysurVist ? { nr: lysTrin, ialt: LYS_TRIN.length, næste: LYS_TRIN[lysTrin + 1]?.titel ?? '', gå: gåLysTrin } : null),
      test: {
        tilstand: () => tilstand,
        ni: () => ni,
        mål: () => T.MÅL_RÆKKE[målNr],
        enG: () => enG,
        forløb: forløbTest(),
        startForløb: () => startRejsen(),
        kørerForløb: () => kørerForløb(),
        mitUr: () => ({ vist: mitUrVist, set: harSetMitUr, sek: mitUrSek }),
        hjemMed: () => [...hjemMed],
        hurtig: () => hurtig,
        figurer: () => ({ dig: skibFigur.dataset.slags || null, tvilling: jordFigur.dataset.slags || null }),
        ure: () => ({ skibÅr, jordÅr, skib: skibTal.textContent, jord: jordTal.textContent, skibAlder: skibAlder.textContent, jordAlder: jordAlder.textContent, vist: !ure.hidden, løbsk: jordUr.classList.contains('løbsk') }),
        fart: () => ({ gamma: gammaNu, fart: fartNu, pos, andel: andel() }),
        scene: () => ({ klem, skib: skib.position.x, jord: jorden.klode.position.x, mål: målGrupper[T.MÅL_RÆKKE[målNr]].position.x, synlige: T.MÅL_RÆKKE.filter((k) => målGrupper[k].visible) }),
        startÅr: START_ÅR,
        lysur: () => ({ vist: !lysur.hidden, skib: ly.skib, jord: ly.jord, x: ly.x, spor: ly.spor.length, bredde: lærred.clientWidth, trin: lysTrin, fart: lysV(), stille: ly.stille, forskud: lysForskud(lysGeo()) }),
      },
    };
  },
};
