// Teksterne i højre panel ved Solsystemets overblik (docs/drejebog-overblik.md, afsnit 3): titlen, to tal, højst tre
// sætninger og fire spørgsmål, så "Vil du vide mere?" og "Ærligt talt". Merkur og Pluto har deres eget besøg (MP1 og MP3,
// 17. november 2026), så de korte paneler er væk. Tallene står i drejebogens afsnit 4. Uden Three.js.

import { gå } from '../../sideknap.js';

export const TAL = [
  ['Solens del af al massen', 'over 99,8 %'],
  ['Lyset fra Solen til Jorden', 'ca. 8 minutter'],
];

export const SIDE = {
  kort: 'Her står Solen og planeterne, som de står i dag. Planeterne går rundt om Solen, de inderste hurtigst. Træk i tidsskyderen nederst, og se dem bevæge sig, eller tryk på en planet for at besøge den.',
  emner: [
    {
      titel: 'Hvorfor går alle planeterne samme vej rundt?',
      tekst: '<p>Solen og planeterne blev til af den samme store sky af gas og støv for ca. 4,6 milliarder år siden. Skyen drejede langsomt, og da den faldt sammen, blev den til en flad skive, der drejede rundt om den unge Sol. Planeterne blev bygget i skiven og drejer stadig samme vej som den.</p>'
        + '<p>Derfor ligger banerne også næsten i samme plan. Den, der hælder mest, er Merkurs med 7°. Plutos hælder 17°.</p>',
    },
    {
      titel: 'Hvorfor er Pluto ikke en planet længere?',
      tekst: '<p>I 2006 blev astronomerne enige om, hvad en planet er: Den går rundt om Solen, den er så tung, at den er blevet rund, og den har ryddet sin bane for andre kloder. Pluto er rund og går rundt om Solen, men den deler sin bane med tusindvis af isklumper i Kuiperbæltet (et bælte af is og sten uden for Neptun).</p>'
        + '<p>Derfor kaldes Pluto nu en <b>dværgplanet</b>: en rund klode, der ikke har ryddet sin bane. Pluto blev ikke mindre. Det var ordet "planet", der blev skarpere. ' + gå('solsystem:pluto', 'Besøg Pluto') + '</p>',
    },
    {
      titel: 'Hvordan ved vi, hvor planeterne er lige nu?',
      tekst: '<p>For godt 400 år siden fandt Johannes Kepler ud af, at planeterne går i ellipser (lidt flade cirkler) med Solen tæt ved midten, og at de går hurtigst, når de er tættest på Solen.</p>'
        + '<p>I dag måler NASA\'s JPL planeternes pladser meget præcist, bl.a. med radar og rumsonder. Ud fra målingerne har JPL lavet nogle korte formler, som AtomLab bruger til at regne pladserne ud for hver dag fra 1800 til 2100.</p>',
    },
    {
      titel: 'Hvor tomt er her egentlig?',
      tekst: '<p>Hvis Solen var en fodbold, ville Jorden være et knappenålshoved 24 meter væk, og Neptun en ært ca. 700 meter væk. Den nærmeste stjerne ville ligge ca. 6.300 km væk, omtrent som fra København til New York.</p>'
        + '<p>Da Voyager 1 i 1990 tog et billede af Jorden fra ca. 6 milliarder km, var Jorden kun en lille lysende prik. Prøv selv skalaen "Rigtig størrelse og afstand" i Styr.</p>'
        // Planet 9 (gåden, 20. november 2026): tegnes ikke i overblikket, for ingen har set den (drejebog-overblik.md)
        + '<p><b>Er der en planet mere derude?</b> Nogle forskere tror, at en planet, ingen har set, trækker i de fjerneste småkloder, langt uden for Neptun. Andre tvivler. ' + gå('gaader:planet9', 'Gåden: Er der en planet mere?') + '</p>',
    },
  ],
  nørd: '<p><b>Astronomisk enhed (AU):</b> Jordens middelafstand fra Solen, 149.597.870,7 km. Neptun er ca. 30 AU ude, og lyset er lige nu ca. 4 timer om at nå derud.</p>'
    + '<p><b>Keplers 3. lov:</b> Omløbstiden i år ganget med sig selv er lig med afstanden i AU ganget med sig selv to gange (T² = a³). Jupiter er 5,2 AU ude, så T = √(5,2³) ≈ 11,9 år.</p>'
    + '<p><b>Banernes hældning</b> mod Jordens bane: Merkur 7°, de andre planeter under 3,4° og Pluto 17°.</p>'
    + '<p><b>Formlerne:</b> Pladserne regnes med JPL\'s tabel 1 ("Approximate Positions of the Planets"), der gælder 1800-2050 med en fejl på højst ca. 0,2° (Saturn). Efter 2050 bliver de lidt mindre præcise, men i 2100 er fejlen stadig kun et par tiendedele af en grad. Pluto er ikke med i tabellen længere, så dens plads kommer fra JPL Horizons.</p>',
  ærligt: '<p><b>To skalaer.</b> I "Pustet op og rykket sammen" er afstandene presset sammen: Afstanden fra Solen er tegnet som kvadratroden af den rigtige. Derfor ser banerne lidt rundere ud, end de er (Merkurs ser kun halvt så aflang ud), og Solen er tegnet alt for lille. Planeterne er forstørret lige meget, så Jupiter er 11 gange så bred som Jorden, men de mindste er tegnet som prikker, selv om de egentlig ville være mindre end en pixel.</p>'
    + '<p>I "Rigtig størrelse og afstand" er alt i samme skala, og så kan man ikke se planeterne. De får en tynd ring med navnet, og Solen er tegnet som sit lys.</p>'
    + '<p><b>Bælterne</b> ser tætte ud, men er næsten tomme. Rumsonder er fløjet gennem asteroidebæltet mange gange uden at ramme noget. Solens glød er også større end Solen.</p>',
};

// Merkur og Pluto havde et kort panel her (jeres ønske 13. november 2026), til de fik deres eget besøg (MP1 og MP3)
export const SIDER = {};
