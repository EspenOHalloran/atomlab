// Teksterne i højre panel ved Jorden (siden i lag, U3 i docs/plan-ux.md): Jordens egen side (SIDE) og Månens (SIDER).
// Faktatjekket i docs/fakta-solsystemet.md (del 4 og "Faktatjek U3"). Uden Three.js, så teksterne kan testes i Node.

import { sted, gå, tid } from '../../sideknap.js';

export const SIDE = {
  kort: 'Jorden er den tredje planet fra Solen og den eneste, vi kender, hvor der er liv. Her står den med lyset, som det er lige nu, og den gule prik er Danmark.',
  emner: [
    {
      titel: 'Hvorfor står Solen op i øst?',
      tekst: `<p>Jorden drejer om sig selv mod øst én gang i døgnet. Derfor står Solen op i øst og går ned i vest. Tryk ${tid('hurtig', '⏩')}, så går tiden ca. 800 gange hurtigere, og et døgn varer under 2 minutter.</p>`,
    },
    {
      titel: 'Hvorfor har vi årstider?',
      tekst: `<p>Jordens akse hælder ca. 23,4°. Om sommeren hælder vores halvkugle mod Solen, så Solen står højere på himlen og er længere oppe. Det kan du se i forsøget Årstiderne.</p>`,
    },
  ],
  videre: [sted('månen', 'Månen'), gå('solsystem:aarstider', 'Årstiderne'), gå('solsystem:formoerkelser', 'Formørkelser')],
  nørd: `<p><b>Tidspunktet:</b> Solens retning, Jordens drejning og Månens plads er regnet ud fra datoen og klokken med de korte formler fra "The Astronomical Almanac". Grænsen mellem dag og nat passer inden for få minutter.</p>
    <p><b>Et døgn</b> er 24 timer fra middag til middag. I forhold til stjernerne drejer Jorden én gang på 23 timer og 56 minutter. Forskellen kommer af, at Jorden også flytter sig et stykke i sin bane om Solen hver dag, så den skal dreje lidt ekstra, før Solen står samme sted på himlen igen.</p>
    <p><b>Jordens form:</b> Jorden er ca. 12.756 km bred ved ækvator og 12.714 km fra pol til pol. Den er lidt fladtrykt, fordi den drejer. Kuglen her er helt rund.</p>`,
  billeder: '<p>Billederne er fra NASA: Blue Marble (Jorden om dagen) og Black Marble (byernes lys om natten). Bjergene er lavet af et højdekort.</p>',
  ærligt: '<p>Skyerne er et øjebliksbillede fra nogle få dage, så de passer ikke med vejret i dag. Bjergene er gjort højere end i virkeligheden, så de kan ses. Solen er tegnet som en lille prik langt væk. Når du trykker ⏩, går tiden ca. 800 gange hurtigere, og Månen flytter sig i sin bane imens.</p>',
};

export const SIDER = {
  månen: {
    tal: [['Bredde', 'ca. 3.470 km'], ['Afstand', 'ca. 384.400 km (i snit)'], ['En omgang', 'ca. 27 døgn'], ['Fra fuldmåne til fuldmåne', 'ca. 29½ døgn']],
    kort: 'Månen er lidt over en fjerdedel så bred som Jorden. Der er plads til ca. 30 Jorder på række mellem Jorden og Månen. Drej kameraet rundt, så kan du se Jorden langt væk.',
    emner: [
      {
        titel: 'Hvorfor ser vi altid den samme side?',
        tekst: '<p>Månen kredser om Jorden på ca. 27 døgn og drejer om sig selv lige så hurtigt. Det kaldes bundet rotation. Derfor vender den altid den samme side mod os.</p>',
      },
      {
        titel: 'Hvorfor har Månen faser?',
        tekst: `<p>Solen lyser altid på den ene halvdel af Månen. Hvor meget af den lyse halvdel vi ser fra Jorden, kommer an på, hvor Månen står i sin bane. Fra fuldmåne til fuldmåne går der ca. 29½ døgn. Ved nymåne og fuldmåne kan der komme ${gå('solsystem:formoerkelser', 'Formørkelser')}</p>`,
      },
      {
        titel: 'Er Månen altid lige langt væk?',
        tekst: '<p>Nej. Månens bane er ikke helt rund, men en ellipse (en lidt aflang cirkel). Afstanden svinger mellem ca. 356.000 og 407.000 km. Banen hælder ca. 5,1° i forhold til Jordens bane om Solen, og derfor er der ikke formørkelse ved hver nymåne og fuldmåne. Linjen viser Månens vej i en måned omkring det tidspunkt, du ser.</p>',
      },
    ],
    videre: [sted('jorden', 'Tilbage til Jorden')],
    billeder: '<p>Månens kort er lavet af billeder fra rumsonden Lunar Reconnaissance Orbiter (NASA).</p>',
    ærligt: '<p>Månen står, hvor den er lige nu, med den rigtige fase. Dens plads passer inden for ca. 0,3°. Månen og Jorden har den rigtige størrelse og afstand.</p>',
  },
};
