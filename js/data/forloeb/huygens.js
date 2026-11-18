// Forløbet "Saturns ører" i bogen om Huygens (Opdagelserne, docs/drejebog-huygens.md, afsnit 3). Ren data uden DOM, så
// det kan testes i Node. H2 (16. november 2026) har drejebogens trin 1-3, H3 (17. november 2026) trin 4 (anagrammet
// ANNULO). Vejene fra "Det så du" står i js/opdagelser.js. Det, der rører scenen (lærredet i bogen, bunkerne, knapperne,
// hvornår trinet er gjort og "Vis mig"), står i js/bog/huygens.js under samme trin-id.
// Fakta: docs/fakta-videnskabsfolk/huygens.md (12-fods-kikkerten er over 3 m, Titan 25. marts 1655 og ca. 16 døgn,
// armene væk 16. januar 1656 efter hans rejse, s. 16).

export const SATURNS_ØRER = {
  id: 'saturns-oerer',
  del: 'opdagelser',
  titel: 'Saturns ører',
  // Kernesætning D (jeres valg 16. november 2026, drejebogen afsnit 1)
  kernesætning: 'Saturns "ører" er en tynd, flad ring, som vi ser fra skiftende vinkler. Fra kanten forsvinder den næsten. Det så Huygens, og det kan jeg også se.',
  // Vinkene, når man går forbi målet (stilguiden B5, js/bog/huygens.js). Ca. 27° er ringens største vinkel set fra Jorden
  vink: {
    forbi: 'Prikken var tilbage ved sit mærke efter 16 nætter. Træk lidt tilbage.',
    helt: 'Mere åben kan vi ikke se ringen fra Jorden. Træk nu tilbage mod kanten.',
  },
  trin: [
    {
      id: 'linse',
      kapitel: 'Haag, 1655',
      spørg: 'Sådan så Galilei Saturn i 1610. Hvad tror du, de to små kugler er?',
      gæt: {
        valg: [
          // Svarene (E20, 17. november 2026): Galilei så tre kloder, der næsten rørte hinanden (fakta afsnit 3), og de
          // gamle tegninger var "dårlige kikkerters skyld" (s. 36). Ører og buer: tavlen ved s. 35 (nr. VI og IX)
          { tekst: 'To måner', efter: 'Slib linsen: Gnid rundt på glasset, til billedet bliver skarpt.', svar: 'Galilei troede, det var tre kloder, der næsten rørte hinanden. Men det var ikke måner.' },
          { tekst: 'To håndtag', efter: 'Slib linsen: Gnid rundt på glasset, til billedet bliver skarpt.', svar: 'Tæt på. Andre astronomer tegnede dem senere som ører og buer. Men hvad var de?' },
          { tekst: 'Kikkerten snyder', efter: 'Slib linsen: Gnid rundt på glasset, til billedet bliver skarpt.', svar: 'Ja, på en måde. Huygens skrev senere, at mange af de mærkelige tegninger var dårlige kikkerters skyld.' },
        ],
      },
      gør: 'Slib linsen: Gnid rundt på glasset, til billedet bliver skarpt.',
      // "over 3 meter": Han skriver "ikke over 12 fod" (s. 3), og linsen fra 1655 har 332 cm brændvidde (fælden "næsten 4 meter")
      // Den røde tråd (18. november 2026): slutter med et spørgsmål, der leder videre til nætterne. Højst 22 ord
      så: 'Med Huygens\' bedre linse i en kikkert på over 3 meter bliver kuglerne til to tynde arme. Men hvad er de?',
      ord: ['linse'],
    },
    {
      id: 'naetter',
      kapitel: 'Den lille prik',
      spørg: 'Christiaan kigger nat efter nat. En svag prik ved Saturn flytter sig. Hvad er den?',
      gæt: {
        valg: [
          { tekst: 'En stjerne', efter: 'Træk nætterne frem, til prikken er tilbage, hvor den startede.', svar: 'En stjerne ville ikke følge med Saturn. Prikken gik rundt om den.' },
          { tekst: 'En måne', efter: 'Træk nætterne frem, til prikken er tilbage, hvor den startede.', svar: 'Rigtigt gættet!' },
          { tekst: 'En komet', efter: 'Træk nætterne frem, til prikken er tilbage, hvor den startede.', svar: 'En komet går rundt om Solen. Prikken gik rundt om Saturn.' },
        ],
      },
      gør: 'Træk nætterne frem, til prikken er tilbage, hvor den startede.',
      // 16 nætter: hans eget tal (s. 26-27). I dag 15,945 døgn
      så: 'Efter 16 nætter er den tilbage: en måne, den første ved Saturn. I dag hedder den Titan.',
      ord: [],
    },
    {
      id: 'kanten',
      kapitel: 'Januar 1656',
      // "kommer hjem fra en rejse": "cum ad hoc usque tempus peregre abfuissem" (s. 16, 16. januar 1656). Ikke "lang": Rejsen
      // til Frankrig i 1655 varede efter en af kilderne kun fra juli til september (faktatjekket 16. november 2026)
      spørg: 'Christiaan kommer hjem fra en rejse. Saturns arme er væk! Hvor er de blevet af?',
      gæt: {
        valg: [
          // Armene var tilbage 13. oktober 1656, "senere end jeg havde forudsagt" (s. 16-17, faktatjekket 17. november 2026). Ringen er 9 til 4 i forhold
          // til Saturn (s. 47), altså over dobbelt så bred
          { tekst: 'De er faldet af', efter: 'Træk op eller ned for at se Saturn fra en anden vinkel. Træk så tilbage, til armene er helt væk.', svar: 'Nej. 13. oktober 1656 så Huygens armene igen, senere end han havde regnet med.' },
          { tekst: 'De gemmer sig bag Saturn', efter: 'Træk op eller ned for at se Saturn fra en anden vinkel. Træk så tilbage, til armene er helt væk.', svar: 'Armene er over dobbelt så brede som Saturn. De kan ikke gemme sig bag den.' },
          { tekst: 'Vi ser dem fra kanten', efter: 'Træk op eller ned for at se Saturn fra en anden vinkel. Træk så tilbage, til armene er helt væk.', svar: 'Rigtigt gættet!' },
        ],
      },
      // Rettet 16. november 2026 (jeres svar): Scenen starter med armene væk, så man åbner dem først og finder kanten bagefter
      gør: 'Træk op eller ned for at se Saturn fra en anden vinkel. Træk så tilbage, til armene er helt væk.',
      // Ikke "Saturn vipper": Ringen peger samme vej i rummet, og vi ser den fra en ny vinkel (fælden i fakta-faelder)
      så: 'Armene er en tynd, flad ring. Fra kanten bliver den til en streg, som kikkerten ikke kan se.',
      ord: [],
    },
    {
      id: 'annulo',
      kapitel: 'Hemmeligheden',
      // Skriftet med anagrammet er dateret 5. marts 1656 (s. 2), mens armene var væk (16. januar-17. juni 1656, s. 16-17)
      // Første sætning ændret 18. november 2026 (fundet "lige på og hårdt"): hvorfor han ikke bare fortæller det. Armene er
      // væk fra 16. januar til efter juni 1656, så ringen kan ikke ses (s. 16-17). Højst 16 ord
      spørg: 'Ringen ses ikke lige nu. Hvordan viser han, at han kender svaret, uden at røbe det?',
      gæt: {
        valg: [
          { tekst: 'Han holder det hemmeligt', efter: 'Find ordet ANNULO ("med en ring") i bunkerne af bogstaver.', svar: 'Men hvordan skulle han så bagefter bevise, at han vidste det først?' },
          { tekst: 'Han blander bogstaverne', efter: 'Find ordet ANNULO ("med en ring") i bunkerne af bogstaver.', svar: 'Rigtigt gættet!' },
          // Sætningen stod først i Systema Saturnium (1659, s. 47)
          { tekst: 'Han fortæller det til alle', efter: 'Find ordet ANNULO ("med en ring") i bunkerne af bogstaver.', svar: 'Det gjorde han først i 1659, i sin bog.' },
        ],
      },
      gør: 'Find ordet ANNULO ("med en ring") i bunkerne af bogstaver.',
      // Ikke "som han havde sagt": Armene kom 13. oktober 1656, "senere end jeg havde forudsagt" (s. 17, faktatjekket
      // 17. november 2026). Det står allerede i svaret til trin 3
      så: 'Et anagram: beviset på, at han vidste det først. I oktober 1656 kom armene igen.',
      ord: ['anagram'],
    },
  ],
};
