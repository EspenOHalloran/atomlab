// Teksterne i højre panel ved Uranus (siden i lag, U3 i docs/plan-ux.md). UN1 i docs/plan-uranus-neptun.md: kun den
// korte tekst, billederne og "Ærligt talt". UN2: årene og ringene (faktatjekket i fakta-solsystemet/del6, "Faktatjek UN2").
// Månerne og resten af emnerne kommer i UN4 og UN5.
// Tallene er fra docs/fakta-solsystemet/del6-uranus-og-neptun.md (NSSDC og JPL Horizons). Uden Three.js.

import { kontakt } from '../../sideknap.js';

export const SIDE = {
  kort: 'Uranus er en isgigant langt ude i solsystemet. Den ligger på siden: Aksen hælder ca. 98 grader, så polerne skiftes til at pege mod Solen. Lige nu har nordpolen sol. Du ser Uranus i den rigtige form, og den drejer rundt én gang på 17 timer og 14 minutter.',
  emner: [
    {
      titel: 'Et år på Uranus varer 84 år',
      tekst: '<p>Uranus er 84 år om at komme én gang rundt om Solen. Fordi den ligger på siden, peger først den ene pol og så den anden mod Solen. Hver pol har sol i ca. 42 år og mørke i ca. 42 år.</p>'
        + '<p>Træk i skyderen <b>År</b>. Da Voyager 2 fløj forbi i januar 1986, pegede sydpolen næsten lige mod Solen. I 2007 stod Solen over ækvator, og omkring 2030 står den højest over nordpolen. Den pol, der har sommer, får en lys kappe af dis. Drej selv kameraet rundt, så du ser fra Solens side.</p>',
    },
    {
      titel: 'Har Uranus ringe?', kontakt: 'Infrarødt',
      tekst: '<p>Ja, 13. De blev opdaget i 1977, da Uranus gik foran en stjerne: Stjernen blinkede flere gange, før og efter planeten dækkede den. Ringene er smalle og mørke som kul. De kaster kun ca. 1,5 % af lyset tilbage, så forfra kan du næsten ikke se dem.</p>'
        + `<p>Slå ${kontakt('Infrarødt (som JWST)', 'Infrarødt')} til. Rumteleskopet James Webb har fotograferet Uranus i infrarødt lys. Dér er planeten mørk, fordi metan opsuger det lys, og ringene træder frem. Med ${kontakt('Modlys')} ses det fine støv mellem ringene.</p>`,
    },
    {
      titel: 'Hvad er en isgigant?',
      tekst: '<p>Uranus og Neptun kaldes isgiganter. Yderst er de luft af brint og helium med lidt metan, ligesom Jupiter og Saturn. Men inde i dem er der mest stoffer som vand, ammoniak og metan. Astronomer kalder dem "is", men inde i planeten er de varme, tætte væsker og slet ikke frosne.</p>',
    },
  ],
  nørd: '<p><b>"Baglæns" eller tippet?</b> NASA skriver, at aksen hælder 97,77°, og at Uranus drejer baglæns. Man kan også sige, at den drejer den almindelige vej, men er tippet 82° den anden vej. Det er to måder at sige det samme på.</p>'
    + '<p><b>Ringene</b> (NASA): Den største, epsilon-ringen, ligger ca. 51.000 km fra Uranus\' midte og er 20-96 km bred, fordi den ikke er helt rund. De andre er kun 1-11 km brede. De to yderste ringe, som Hubble fandt i 2003, er så tynde, at de ikke tegnes.</p>'
    + '<p><b>Solens retning</b> regnes ud fra Uranus\' bane og retningen af dens nordpol for dagens dato. Det passer med NASA\'s JPL Horizons inden for ca. 0,1°: Solen står ca. 74° over ækvator mod nord i november 2026.</p>',
  billeder: '<p>Kortet er lavet af Hubbles målinger fra 23.-24. oktober 2025 (OPAL: NASA, ESA, A. Simon, CC BY 4.0). Den sydlige halvdel var i mørke, så den er lavet af Hubbles målinger fra 8.-9. november 2014.</p>',
  ærligt: '<p>Hubbles kort er grumsede (ca. 220 km pr. pixel), så kloden er bygget af lysstyrken og farven for hver breddegrad og et svagt lag med de største pletter. Farverne er regnet ud fra Hubbles målinger i tre farver og er tæt på det, øjet ville se. Uranus\' sydpol har ligget i mørke, siden Solen gik over ækvator i 2007, og Hubbles kort går ikke så langt mod syd. Derfor er nordpolens farver spejlet længst mod syd.</p>'
    + '<p>Herude får Uranus kun 1/369 af det sollys, vi får. Billedet er gjort lysere, som med en længere lukketid. Vindene blæser med den målte fart, men tæt på polerne er de ikke målt og står stille.</p>'
    + '<p>Hvornår kappen over polen kommer og går, er tegnet: Den er lys, når Solen står højt over polen. Ringene har den rigtige afstand, tæthed og mørke farve, men epsilon-ringen er tegnet rund. Støvet mellem ringene er tegnet og gjort lysere, så det kan ses i modlys. "Infrarødt" er falske farver, som på James Webbs billede.</p>',
};
