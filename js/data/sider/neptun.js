// Teksterne i højre panel ved Neptun (siden i lag, U3 i docs/plan-ux.md). UN1 i docs/plan-uranus-neptun.md: kun den
// korte tekst, billederne og "Ærligt talt". UN3: Den Store Mørke Plet, farverne og ringbuerne (faktatjekket i
// fakta-solsystemet/del6, "Faktatjek UN3"). Resten af emnerne kommer i UN5.
// Tallene er fra docs/fakta-solsystemet/del6-uranus-og-neptun.md (NSSDC og Voyager 2). Uden Three.js.

import { kontakt } from '../../sideknap.js';

export const SIDE = {
  kort: 'Neptun er den yderste planet i solsystemet og en isgigant ligesom Uranus. Her blæser de hurtigste vinde på nogen planet, ca. 1.400 km/t ved ækvator. Du ser Neptun i den rigtige form, og den drejer rundt én gang på 16 timer og 7 minutter.',
  emner: [
    {
      titel: 'Den Store Mørke Plet', kontakt: 'Neptun i 1989',
      tekst: '<p>Da Voyager 2 fløj forbi i august 1989, så den en mørk storm på Neptuns sydlige halvkugle. Den var ca. 13.000 km lang, lige så lang som Jorden er bred. Man tror, at pletten var et hul i de øverste skyer. Over kanten svævede hvide skyer af frossen metan.</p>'
        + `<p>Slå ${kontakt('Neptun i 1989')} til. Længere mod syd ser du den lyse sky "Scooter" og en mindre mørk plet med en lys midte. De kom rundt med hver deres fart, så de driver fra hinanden. Da Hubble kiggede igen i 1994, var Den Store Mørke Plet væk. Mørke pletter på Neptun kommer og går med få års mellemrum.</p>`,
    },
    {
      titel: 'Er Neptun dybblå?', kontakt: 'Voyagers farver',
      tekst: '<p>Nej. Neptun og Uranus har næsten samme farve, en lys grønlig blå, og Neptun er kun en smule mere blå. Metan i luften opsuger det røde lys, så planeterne ser blå ud.</p>'
        + `<p>Billederne fra Voyager 2 blev behandlet, så skyerne og pletterne var lettere at se, og det gjorde Neptun dybblå. Derfor tror mange, at den er sådan. Patrick Irwin og hans kolleger regnede de ægte farver ud i 2024. Slå ${kontakt('Voyagers farver (1989)', 'Voyagers farver')} til og se forskellen.</p>`,
    },
    {
      titel: 'Ringe med klumper', kontakt: 'Modlys',
      tekst: '<p>Neptun har fem tynde, mørke ringe med meget støv. De har navne efter astronomer, der arbejdede med Neptun. I den yderste ring, Adams-ringen, er støvet samlet i klumper, der kaldes buer. Voyager 2 så fem: Liberté, Egalité (to buer) og Fraternité, frihed, lighed og broderskab efter den franske revolution, og Courage, mod.</p>'
        + `<p>Forfra kan ringene næsten ikke ses. Zoom ud, og slå ${kontakt('Modlys')} til, så lyser støvet, og du ser buerne kredse rundt på ca. 10½ time. Ingen ved helt, hvorfor buerne ikke breder sig ud til en jævn ring.</p>`,
    },
  ],
  nørd: '<p><b>Vindene</b> er Voyager 2\'s målinger fra 1989 (Sromovsky m.fl. 1993): Ved ækvator blæser det ca. 400 m/s mod vest, mod Neptuns drejning, og omkring 70° bredde over 200 m/s mod øst. Omkring 50° bredde er der næsten stille.</p>'
    + '<p><b>Den Store Mørke Plet</b> lå ved 22° S og kom rundt på 18,3 timer, altså langsommere end Neptuns døgn på 16,1 timer, fordi vinden dér blæser mod vest. Den lille mørke plet ved 54° S kom rundt på 16,1 timer. <b>De hvide skyer</b> ligger ca. 50 km over skylaget og kaster skygger, som er blålige, fordi luften over skylaget spreder blåt lys ind i dem.</p>'
    + '<p><b>Buerne</b> lå i 1986-1989 mellem 247° og 286° i et system, der følger ringen rundt. I 2003 var Liberté næsten væk, og Courage var sprunget ca. 8° frem.</p>',
  billeder: '<p>Kortet er lavet af Hubbles målinger fra 24.-25. august 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0). Pletterne, skyerne og buerne fra 1989 er lavet efter Voyager 2\'s billeder (NASA/JPL). "Voyagers farver" er lavet efter Solar System Scopes kort over Neptun (CC BY 4.0), som bygger på Voyagers billeder.</p>',
  ærligt: '<p>Hubbles kort er grumsede (ca. 220 km pr. pixel), så kloden er bygget af lysstyrken og farven for hver breddegrad og et svagt lag med de største pletter. Farverne er regnet ud fra Hubbles målinger i tre farver og er tæt på det, øjet ville se. Langt mod nord kunne Hubble ikke se, så der er sydens farver spejlet.</p>'
    + '<p>Herude får Neptun kun 1/903 af det sollys, vi får. Billedet er gjort lysere, som med en længere lukketid. Vindene blæser med den målte fart, men tæt på polerne er de ikke målt og står stille.</p>'
    + '<p>De hvide skyer er tegnet: Hvor båndene af skyer står, og hvor høje de er, passer med Voyagers billeder, men hver sky er tegnet, og de ændrer sig ikke, som de rigtige gør på få timer. Pletterne fra 1989 står ved de rigtige breddegrader og kommer rundt med den målte fart, men deres form og hvordan de drejer, er tegnet. "Voyagers farver" er en efterligning. Ringene har den rigtige afstand og tæthed, men er gjort lysere, så de kan ses. Hvor buerne står i forhold til skyerne, er valgt af os.</p>',
};
