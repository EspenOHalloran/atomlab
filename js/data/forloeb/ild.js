// Forløbet "Hvad brænder egentlig?" i Ild (Kemi, forløb 1). Ren data uden Three.js, så det kan testes i Node.
// Drejebogen står i docs/drejebog-ild.md (afsnit 3) med rettelserne i docs/fable/E17-ild-noter.md, og skabelonen i
// docs/fable/E3-forloeb.md. Det, der rører scenen, står i js/ild.js under samme trin-id. Faktatjekket står i
// docs/fakta-ild/faktatjek-forloeb1.md (og bordet i faktatjek-bordet.md).

export const ILD_1 = {
  id: 'ild',
  del: 'ild',
  titel: 'Hvad brænder egentlig?',
  kernesætning: 'I et stearinlys er det dampen, der brænder. Stearinens atomer og luftens oxygen bytter partnere og bliver til CO₂ og vand. Det giver varme, og varmen laver ny damp.',
  // Molekyle, og at atomer deler elektroner, kommer fra "Når atomer mødes"
  før: { id: 'molekyler', del: 'molekyler', tekst: 'Tag "Når atomer mødes" først' },
  trin: [
    {
      id: 'roeg',
      spørg: 'Lyset er lige pustet ud. Der stiger hvid røg op fra vægen. Hvad er røgen?',
      gæt: {
        valg: [
          { tekst: 'Aske fra vægen', efter: 'Prøv det: Før tændstikken ind i røgen, et stykke over vægen.', svar: 'Ikke aske: Røgen kunne jo brænde.' },
          { tekst: 'Stearin som damp', efter: 'Prøv det: Før tændstikken ind i røgen, et stykke over vægen.', svar: 'Ja. Stearin, der er blevet til damp, kan brænde.' },
          { tekst: 'Varm luft', efter: 'Prøv det: Før tændstikken ind i røgen, et stykke over vægen.', svar: 'Varm luft kan ikke brænde. Det kunne røgen.' },
        ],
      },
      gør: 'Før tændstikken ind i røgen, et stykke over vægen.',
      så: 'Flammen løb ned gennem røgen og tændte lyset! Røgen er stearin, der er fordampet. Det er dampen, der brænder.',
      ord: [],
    },
    {
      id: 'ske',
      spørg: 'Lyset bliver kortere og kortere. Hvor bliver stearinen af?',
      gæt: {
        valg: [
          { tekst: 'Den bliver til varme og lys', efter: 'Prøv det: Hold den kolde ske over flammen.', svar: 'Der kommer varme og lys, men atomerne forsvinder ikke.' },
          { tekst: 'Den bliver til gasser, man ikke kan se', efter: 'Prøv det: Hold den kolde ske over flammen.', svar: 'Ja: vand som damp og CO₂.' },
          { tekst: 'Den bliver til sod', efter: 'Prøv det: Hold den kolde ske over flammen.', svar: 'Kun en lille smule. Det meste bliver til gasser.' },
        ],
      },
      gør: 'Hold den kolde ske over flammen.',
      så: 'Skeen dugger. Flammen laver vand! Der kommer også en gas, man ikke kan se: CO₂.',
      ord: [],
    },
    {
      id: 'atomer',
      spørg: 'Stearin er mest lange kæder af kulstof og hydrogen. Hvordan bliver de til vand og CO₂?',
      gør: 'Træk oxygen (ilt) fra luften hen til stykket af stearinen, ét ad gangen.',
      så: 'Atomerne bytter partnere og bliver til CO₂ og vand. Det er en kemisk reaktion, og den hedder forbrænding.',
      ord: ['kemisk-reaktion', 'forbraending'],
    },
    {
      id: 'pust',
      spørg: 'Hver gang atomerne bytter partnere, kommer der varme. Hvad bruger flammen den til?',
      gæt: {
        valg: [
          { tekst: 'Ingenting, den forsvinder bare', efter: 'Prøv det: Pust til flammen.', svar: 'Nej, den bliver brugt. Varmen smelter og fordamper ny stearin, og dampen brænder og giver ny varme. Sådan holder flammen sig selv i gang.' },
          { tekst: 'Til at lave ny damp af stearinen', efter: 'Prøv det: Pust til flammen.', svar: 'Ja. Varmen smelter og fordamper ny stearin, og dampen brænder og giver ny varme. Sådan holder flammen sig selv i gang.' },
        ],
      },
      gør: 'Pust til flammen.',
      // Prøven 28. november 2026: lettere at forstå. Så siger, hvad pustet gjorde, og svaret på gættet siger ringen
      // (varme → ny damp → varme). Faktatjek: docs/fakta-ild/faktatjek-forloeb1.md, "Rettelser efter prøven".
      så: 'Pustet skubbede flammen væk fra vægen. Så kunne varmen ikke lave ny damp, og uden damp er der intet at brænde.',
      ord: [],
    },
  ],
};
