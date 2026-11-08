// Teksterne i højre panel ved Neptun (siden i lag, U3 i docs/plan-ux.md). UN1 i docs/plan-uranus-neptun.md: kun den
// korte tekst, billederne og "Ærligt talt". UN3: Den Store Mørke Plet, farverne og ringbuerne (faktatjekket i
// fakta-solsystemet/del6, "Faktatjek UN3"). UN5: stederne (Den Store Mørke Plet og Ringbuerne), flybyen (TUR) og resten
// af emnerne (faktatjekket i fakta-solsystemet/del6, "Faktatjek UN5").
// Tallene er fra docs/fakta-solsystemet/del6-uranus-og-neptun.md (NSSDC og Voyager 2). Uden Three.js.

import { kontakt, sted, tid } from '../../sideknap.js';

export const SIDE = {
  kort: 'Neptun er den yderste planet i solsystemet og en isgigant ligesom Uranus. Her blæser de hurtigste vinde på nogen planet, ca. 1.400 km/t ved ækvator. Du ser Neptun i den rigtige form, og den drejer rundt én gang på 16 timer og 7 minutter.',
  emner: [
    {
      titel: 'Fundet med matematik',
      tekst: '<p>Uranus bevægede sig ikke helt, som den skulle. Noget trak i den. Den franske matematiker Urbain Le Verrier regnede ud, hvor en ukendt planet måtte stå, og sendte tallene til Johann Galle i Berlin.</p>'
        + '<p>Galle fik brevet om morgenen den 23. september 1846 og fandt Neptun samme nat, mindre end 1 grad fra det sted, Le Verrier havde regnet ud. I England havde John Couch Adams også regnet på det.</p>',
    },
    {
      titel: 'Hvorfor blæser det så meget?', kontakt: 'Vindene',
      tekst: '<p>Det ved forskerne ikke helt. Neptun er så langt ude, at den kun får ca. 40 % af det sollys, Uranus får. Men Neptun har varme indefra: Den sender ca. 2,6 gange så meget energi ud i rummet, som den får fra Solen. Den varme er nok til solsystemets hurtigste vinde.</p>'
        + `<p>Slå ${kontakt('Vindene')} til, så viser pilene, hvor det blæser mod øst, og hvor det blæser mod vest.</p>`,
      hvorfor: ['neptunStaa'],
    },
    {
      titel: 'Er Neptun dybblå?', kontakt: 'Voyagers farver',
      tekst: '<p>Nej. Neptun og Uranus har næsten samme farve, en lys grønlig blå, og Neptun er kun en smule mere blå. Metan i luften opsuger det røde lys, så planeterne ser blå ud.</p>'
        + `<p>Billederne fra Voyager 2 blev behandlet, så skyerne og pletterne var lettere at se, og det gjorde Neptun dybblå. Derfor tror mange, at den er sådan. Patrick Irwin og hans kolleger regnede de ægte farver ud i 2024. Slå ${kontakt('Voyagers farver (1989)', 'Voyagers farver')} til og se forskellen.</p>`,
    },
    {
      titel: 'Triton, den baglæns måne',
      // Bredden 2 · 1.353,4 km (NSSDC). Fundet 10. oktober 1846, 17 dage efter Neptun (Wikipedia "Triton (moon)")
      tekst: '<p>Neptuns største måne, Triton, er ca. 2.700 km bred og kredser den forkerte vej, modsat den vej, Neptun drejer. Den er den eneste store måne i solsystemet, der gør det. Derfor tror man, at Triton engang var en dværgplanet fra Kuiperbæltet, et bælte af små iskloder uden for Neptuns bane, og at Neptun fangede den.</p>'
        + '<p>William Lassell fandt Triton den 10. oktober 1846, kun 17 dage efter Neptun. Triton er ikke med her endnu.</p>',
    },
  ],
  videre: [sted('plet', 'Den Store Mørke Plet'), sted('buer', 'Ringbuerne')],
  nørd: '<p><b>Vindene</b> er Voyager 2\'s målinger fra 1989 (Sromovsky m.fl. 1993): u = −398 + 0,188 φ² − 0,000012 φ⁴ m/s, hvor φ er bredden i grader. Ved ækvator blæser det ca. 400 m/s mod vest, mod Neptuns drejning, og omkring 70° bredde over 200 m/s mod øst. Omkring 50° bredde er der næsten stille. Enkelte målinger giver op til ca. 580 m/s.</p>'
    + '<p><b>Døgnet</b> er 16 t 7 min ifølge Voyagers radiomålinger. Erich Karkoschka fandt i 2011 15 t 58 min ud fra to skyer ved sydpolen, der holdt takten i over 20 år. Det er ikke det officielle tal.</p>'
    + '<p><b>Magnetfeltet</b> (NASA) hælder ca. 47° i forhold til aksen, og dets midte ligger ca. halvdelen af radius væk fra planetens midte.</p>',
  billeder: '<p>Kortet er lavet af Hubbles målinger fra 24.-25. august 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0). Pletterne, skyerne og buerne fra 1989 er lavet efter Voyager 2\'s billeder (NASA/JPL). "Voyagers farver" er lavet efter Solar System Scopes kort over Neptun (CC BY 4.0), som bygger på Voyagers billeder.</p>',
  ærligt: '<p>Hubbles kort er grumsede (ca. 220 km pr. pixel), så kloden er bygget af lysstyrken og farven for hver breddegrad og et svagt lag med de største pletter. Farverne er regnet ud fra Hubbles målinger i tre farver og er tæt på det, øjet ville se. Langt mod nord kunne Hubble ikke se, så der er sydens farver spejlet.</p>'
    + '<p>Herude får Neptun kun 1/903 af det sollys, vi får. Billedet er gjort lysere, som med en længere lukketid. Vindene blæser med den målte fart, men tæt på polerne er de ikke målt og står stille.</p>'
    + '<p>De hvide skyer er tegnet: Hvor båndene af skyer står, og hvor høje de er, passer med Voyagers billeder, men hver sky er tegnet, og de ændrer sig ikke, som de rigtige gør på få timer. "Voyagers farver" er en efterligning.</p>',
};

// ---------- UN5: stederne og flybyen ----------
const IR = kontakt('Infrarødt (som JWST)', 'Infrarødt');
// Stederne i træet (gruppen "Steder") og underteksten, når man besøger dem (bjælkens linje, under ca. 160 tegn)
export const STEDER = [
  { id: 'plet', navn: 'Den Store Mørke Plet', undertitel: 'Som Voyager 2 så den i 1989' },
  { id: 'buer', navn: 'Ringbuerne', undertitel: 'Klumper af støv i modlys' },
];
export const STED_STOP = {
  plet: {
    titel: 'Den Store Mørke Plet (1989)',
    // "As large along its longer dimension as the Earth" (PIA02245). Væk på Hubbles billeder i november 1994.
    tekst: 'Voyager 2 så en mørk storm, lige så lang som Jorden er bred. Da Hubble kiggede igen i 1994, var den væk.',
    nu: `<p><b>Lige nu:</b> ${kontakt('Neptun i 1989')} er slået til. Her står Neptuns døgn stille, så pletten bliver i sollys, men den driver langsomt med vinden. Prøv ${kontakt('Voyagers farver (1989)', 'Voyagers farver')}.</p>`,
  },
  buer: {
    titel: 'Ringbuerne i modlys',
    // Liberté, Égalité 1 og 2 og Fraternité (frihed, lighed og broderskab) og Courage. IAU's liste har også
    // "Sincérité", men hvornår den er set, er ikke slået op (fakta-solsystemet/del6, fælden fra UN3).
    tekst: 'Den yderste ring har klumper af støv, kaldet ringbuer. Voyager 2 så fem. Fire har navne efter frihed, lighed og broderskab.',
    nu: `<p><b>Lige nu:</b> Solen står bag Neptun, så støvet lyser. Ringene er tegnet lysere, end de er. Slå ${IR} til, som på Webbs billede.</p>`,
  },
};
// Flybyen (plan-uranus-neptun.md, afsnit 4, og jeres svar 5): 4 stop. id: stedet (dets side står i panelet), visning:
// hvad kameraet viser, når det ikke er stedet selv. kamera: 'system' (med ringene) eller 'sol' (hele kloden i sollys).
// nu: "Lige nu" ved stoppet.
export const TUR = [
  {
    id: 'neptun', titel: 'Neptun', knap: 'Neptun', kamera: 'system',
    // 4.515 mio. km (NSSDC) / 299.792 km/s = 4,2 timer
    tekst: 'Den yderste planet, ca. 4,5 milliarder km fra Solen. Sollyset er over 4 timer om at nå herud.',
    nu: '<p><b>Lige nu:</b> Herude er Solen kun en lille, skarp prik. Billedet er gjort lysere, som med en længere lukketid.</p>',
  },
  {
    id: 'vinde', visning: 'neptun', kamera: 'sol', titel: 'De hurtigste vinde', knap: 'vindene',
    // Voyagers formel ved ækvator: 398 m/s = 1.430 km/t. NSSDC: op til 580 m/s = 2.090 km/t.
    tekst: 'Ved ækvator blæser det ca. 1.400 km/t mod vest, og nogle steder er der målt over 2.000 km/t. Ingen planet har hurtigere vinde.',
    nu: `<p><b>Lige nu:</b> Slå ${kontakt('Vindene')} til, så viser pilene vindene. ${tid('hurtig', 'Prøv ⏩')}</p>`,
  },
  { id: 'plet', ...STED_STOP.plet, titel: 'Neptun i 1989', knap: 'pletten' },
  { id: 'buer', ...STED_STOP.buer, knap: 'ringbuerne' },
];
export const TUR_SLUT = '<p><b>Turen er slut.</b> Drej selv rundt, slå kontakterne til og fra, eller vælg et sted i listen.</p>';

export const SIDER = {
  plet: {
    tal: [['Set', 'august 1989'], ['Længde', 'ca. 13.000 km'], ['En omgang', '18,3 timer'], ['Væk', 'i 1994']],
    kort: 'Den Store Mørke Plet var en storm på Neptuns sydlige halvkugle, som Voyager 2 så i 1989. Kontakten "Neptun i 1989" viser den.',
    emner: [
    {
      titel: 'Den Store Mørke Plet', kontakt: 'Neptun i 1989',
      tekst: '<p>Da Voyager 2 fløj forbi i august 1989, så den en mørk storm på Neptuns sydlige halvkugle. Den var ca. 13.000 km lang, lige så lang som Jorden er bred. Man tror, at pletten var et hul i de øverste skyer. Over kanten svævede hvide skyer af frossen metan.</p>'
        + `<p>Slå ${kontakt('Neptun i 1989')} til. Længere mod syd ser du den lyse sky "Scooter" og en mindre mørk plet med en lys midte. De kom rundt med hver deres fart, så de driver fra hinanden. Da Hubble kiggede igen i 1994, var Den Store Mørke Plet væk. Mørke pletter på Neptun kommer og går med få års mellemrum.</p>`,
    },
    ],
    videre: [sted('buer', 'Ringbuerne')],
    nørd: '<p><b>Den Store Mørke Plet</b> lå ved 22° S og kom rundt på 18,3 timer, altså langsommere end Neptuns døgn på 16,1 timer, fordi vinden dér blæser mod vest. Den lille mørke plet ved 54° S kom rundt på 16,1 timer. <b>De hvide skyer</b> ligger ca. 50 km over skylaget og kaster skygger, som er blålige, fordi luften over skylaget spreder blåt lys ind i dem.</p>',
    billeder: '<p>Pletterne og skyerne fra 1989 er lavet efter Voyager 2\'s billeder (NASA/JPL).</p>',
    ærligt: '<p>Pletterne står ved de rigtige breddegrader og kommer rundt med den målte fart, men deres form og hvordan de drejer, er tegnet. Her står Neptuns døgn stille, så pletten bliver i sollys.</p>',
  },
  buer: {
    tal: [['Ringe', '5'], ['Adams-ringen', 'ca. 62.900 km ude'], ['Buer', '5 set af Voyager 2'], ['En omgang', 'ca. 10½ time']],
    kort: 'Neptuns ringe er tynde og støvede. I den yderste, Adams-ringen, er støvet samlet i klumper, der kaldes buer.',
    emner: [
    {
      titel: 'Ringe med klumper', kontakt: 'Infrarødt',
      tekst: '<p>Neptun har fem tynde, mørke ringe med meget støv. De har navne efter astronomer, der arbejdede med Neptun. I den yderste ring, Adams-ringen, er støvet samlet i klumper, der kaldes buer. Voyager 2 så fem: Liberté, Egalité (to buer) og Fraternité, frihed, lighed og broderskab efter den franske revolution, og Courage, mod.</p>'
        + `<p>Forfra kan ringene næsten ikke ses. Her står Solen bag Neptun, så støvet lyser, og du ser buerne kredse rundt på ca. 10½ time. Slå ${IR} til, så ser du ringene som på Webbs billede fra 2022. Ingen ved helt, hvorfor buerne ikke breder sig ud til en jævn ring.</p>`,
    },
    ],
    videre: [sted('plet', 'Den Store Mørke Plet')],
    nørd: '<p><b>Buerne</b> lå i 1986-1989 mellem 247° og 286° i et system, der følger ringen rundt. I 2003 var Liberté næsten væk, og Courage var sprunget ca. 8° frem.</p>',
    billeder: '<p>Ringene er tegnet efter NASA\'s tal for afstand, bredde og tæthed, og buerne efter Voyager 2 (1989) og Keck-teleskopet (2003). "Infrarødt" er lavet efter Webbs billede (NASA, ESA, CSA, STScI).</p>',
    ærligt: '<p>Ringene har den rigtige afstand og tæthed, men er gjort lysere, så de kan ses. Hvor buerne står i forhold til skyerne, er valgt af os. "Infrarødt" er falske farver, som på Webbs billede.</p>',
  },
};
