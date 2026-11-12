// Opgaverne i Værkstedet, Stjerneovnen, Reaktoren og Batteriet. Ren data uden Three.js, så menuen kan tælle
// "Din fremgang" uden at hente skærmene (10a). Flyttet fra skærmenes egne moduler 12. november 2026.
// Livs opgaver står i js/data/liv/opskriften.js, og molekylernes i js/data/molekyler.js og molekyler-byg.js.

// Atomværkstedet
// Opgaver. mål: det antal der skal bygges (null = lige meget).
// hændelse: opgaven løses af noget, der sker (fx et henfald), i stedet for et bestemt atom.
export const OPGAVER = [
  {
    id: 'hydrogen', titel: 'Byg et hydrogenatom', mål: { p: 1, n: 0, e: 1 },
    tip: 'Hydrogen er grundstof nr. 1. Det har ingen neutroner.',
    fakta: 'Hydrogen er det mest almindelige grundstof i universet. Det har kun én proton og én elektron.',
  },
  {
    id: 'uden-lim', titel: 'Prøv to protoner uden neutroner', mål: { p: 2, n: 0, e: null },
    tip: 'Læg to protoner i kernen og ingen neutroner. Hvad sker der?',
    fakta: 'To protoner alene kan ikke holde sammen. Kernekraften mellem kun to protoner er en tand for svag, og de frastøder også hinanden. (To neutroner kan heller ikke!) Med både protoner og neutroner bliver limen stærk nok.',
  },
  {
    id: 'helium', titel: 'Byg helium-4', mål: { p: 2, n: 2, e: 2 },
    tip: 'Helium er nr. 2. Massetallet 4 = protoner + neutroner.',
    fakta: 'Helium-4 er det, Solen laver af hydrogen. Det kan du selv prøve i Stjerneovnen.',
  },
  {
    id: 'deuterium', titel: 'Lav tung brint (deuterium)', mål: { p: 1, n: 1, e: 1 },
    tip: 'Deuterium er hydrogen med én neutron i kernen.',
    fakta: 'Deuterium er stabilt. Det er det første skridt, når Solen laver helium.',
  },
  {
    id: 'tritium', titel: 'Byg tritium: hydrogen med 2 neutroner', mål: { p: 1, n: 2, e: 1 },
    tip: '1 proton, 2 neutroner og 1 elektron.',
    fakta: 'Tritium er radioaktivt. Tryk på "Se den henfalde", og se den blive til helium-3!',
  },
  {
    id: 'henfald', titel: 'Se en kerne henfalde', hændelse: true,
    tip: 'Byg en ustabil kerne, fx tritium eller carbon-14, og tryk på "Se den henfalde".',
    fakta: 'Ved alfa- og betahenfald bliver kernen til et andet grundstof. Det var præcis det, alkymisterne drømte om!',
  },
  {
    id: 'carbon', titel: 'Byg carbon-12 (kulstof)', mål: { p: 6, n: 6, e: 6 },
    tip: 'Carbon er nr. 6. Massetal 12, og atomet skal være neutralt.',
    fakta: 'Alt liv på Jorden er bygget op omkring carbon. Du består af ca. 18 % carbon.',
  },
  {
    id: 'carbon-graense', titel: 'Find den tungeste stabile carbon', mål: { p: 6, n: 7, e: null },
    tip: 'Start med carbon-12, og læg én neutron på ad gangen. Hold øje med boksen om stabilitet.',
    fakta: 'Carbon-13 er den tungeste stabile carbon. Med én neutron mere (carbon-14) bliver kernen radioaktiv.',
  },
  {
    id: 'oxygen', titel: 'Byg oxygen-16 (ilt)', mål: { p: 8, n: 8, e: 8 },
    tip: 'Oxygen er nr. 8. Massetal 16.',
    fakta: 'Oxygen-16 er langt det mest almindelige oxygen. Det er dannet inde i store stjerner.',
  },
  {
    id: 'neon', titel: 'Byg neon-20 med fyldt yderste skal', mål: { p: 10, n: 10, e: 10 },
    tip: 'Neon er nr. 10. Massetal 20.',
    fakta: 'Neon har 2 + 8 elektroner, så den yderste skal er fyldt. Derfor reagerer neon næsten ikke med andre stoffer.',
  },
  {
    id: 'natrium-ion', titel: 'Lav en natrium-ion: Na⁺', mål: { p: 11, n: 12, e: 10 },
    tip: 'Byg natrium-23 (nr. 11), og tag så én elektron væk.',
    fakta: 'Natriums yderste elektron sidder løst og er let at tage. Bagefter har natrium kun fyldte skaller tilbage, men det er plusladet. Hvad der så sker, kan du se under "Byg et molekyle" → "Giv elektroner".',
  },
  {
    id: 'chlorid', titel: 'Lav en chlorid-ion: Cl⁻', mål: { p: 17, n: 18, e: 18 },
    tip: 'Byg chlor-35 (nr. 17), og giv den én ekstra elektron.',
    fakta: 'Na⁺ og Cl⁻ trækker i hinanden, fordi plus og minus tiltrækker hinanden. Sammen bliver de til køkkensalt!',
  },
  {
    id: 'carbon14', titel: 'Byg den radioaktive carbon-14', mål: { p: 6, n: 8, e: 6 },
    tip: 'Samme antal protoner som carbon-12, men to neutroner mere.',
    fakta: 'Carbon-14 bruges til at finde ud af, hvor gamle knogler og træ fra fortiden er.',
  },
  {
    id: 'jern', titel: 'Byg jern-56', mål: { p: 26, n: 30, e: 26 },
    tip: 'Jern er nr. 26. Knappen "Stabil kerne" kan hjælpe med neutronerne.',
    fakta: 'Jern-56 er en af de mest stabile kerner, der findes. Store stjerner ender med en kerne af jern, og så eksploderer de som en supernova.',
  },
  {
    id: 'uran', titel: 'Byg uran-235', mål: { p: 92, n: 143, e: 92 },
    tip: 'Uran er nr. 92. Massetal 235. Hold knapperne inde!',
    fakta: 'Uran-235 er det, man spalter i atomkraftværker. Det kan du prøve i Reaktoren.',
  },
  {
    id: 'uran-kaede', titel: 'Følg uran-238 hele vejen ned til bly', hændelse: true,
    tip: 'Byg uran-238 (hop til uran, og tryk "Stabil kerne"). Tryk så "Se den henfalde" igen og igen.',
    fakta: 'Uran-238 bliver til bly-206 efter 8 alfahenfald og 6 betahenfald. I naturen tager hele rejsen milliarder af år.',
  },
];

// Stjerneovnen
export const OPGAVER_FUSION = [
  {
    id: 'f-koldt', titel: 'Prøv at skyde to protoner sammen, mens det er for koldt',
    tip: 'Skru temperaturen ned under 10 mio. °C, og skyd en proton mod en anden.',
    fakta: 'Protoner er plusladede og frastøder hinanden. Kun ved enorm varme, som i en stjernes kerne, kommer de så tæt på hinanden, at de en sjælden gang kan smelte sammen.',
  },
  {
    id: 'f-d', titel: 'Lav deuterium (p + p)', tip: 'Skyd en proton mod en anden proton ved Solens temperatur (15 mio. °C). Det kan kræve flere forsøg.',
    fakta: 'Det første skridt er det sværeste: En proton skal laves om til en neutron, mens de rører hinanden. I Solen venter en proton i gennemsnit milliarder af år på det!',
  },
  {
    id: 'f-he3', titel: 'Lav helium-3', tip: 'Skyd en proton mod en deuteriumkerne (de orange).',
    fakta: 'Deuterium og en proton bliver hurtigt til helium-3. Energien kommer ud som gammastråling.',
  },
  {
    id: 'f-he4', titel: 'Lav helium-4', tip: 'Skyd en helium-3 mod en anden helium-3 (de gule).',
    fakta: 'Fire protoner er blevet til én heliumkerne, og 0,7 % af massen er blevet til energi. Sådan lyser Solen.',
  },
  {
    id: 'f-fem', titel: 'Lav 5 heliumkerner', tip: 'Skru op for varmen, sæt tiden på ⏩, eller skyd selv kernerne sammen.',
    fakta: 'Hvert sekund laver Solen ca. 600 millioner ton hydrogen om til helium.',
  },
  {
    id: 'f-energi', titel: 'Frigør 100 MeV energi', tip: 'Hver heliumkerne giver ca. 27 MeV i alt.',
    fakta: 'I Solen bliver ca. 4 millioner ton masse til energi hvert sekund. Det er derfor, den lyser og varmer.',
  },
  {
    id: 'f-carbon', titel: 'Bonus: Lav carbon som en rød kæmpe', tip: 'Skru op til mindst 80 mio. °C (i spillet; i rigtige stjerner ca. 100 mio. °C). To heliumkerner bliver til beryllium-8, som hurtigt skal rammes af en tredje heliumkerne.',
    fakta: 'Alt carbon i din krop er lavet sådan i gamle stjerner. Vi er lavet af stjernestof!',
  },
];

// Reaktoren
export const OPGAVER_REAKTOR = [
  {
    id: 'r-spalt', titel: 'Spalt en uran-235-kerne', tip: 'Vælg uran-235 og en langsom neutron, og tryk "Skyd neutron".',
    fakta: 'Når uran-235 spalter, frigøres ca. 200 MeV. Det er ca. 7-8 gange mere end hele Solens opskrift (ca. 27 MeV). Men pr. gram brændsel giver fusion ca. 8 gange mere, fordi brintkerner er så lette.',
  },
  {
    id: 'r-hurtig', titel: 'Skyd en hurtig neutron mod uran-235', tip: 'Vælg "Hurtig" neutron.',
    fakta: 'Hurtige neutroner preller oftest af. Derfor bremser man dem med vand i en reaktor. Vandet kaldes en moderator.',
  },
  {
    id: 'r-u238', titel: 'Skyd en neutron mod uran-238', tip: 'Vælg uran-238 og en langsom neutron.',
    fakta: 'Uran-238 fanger neutronen og bliver til uran-239. Efter to betahenfald er det blevet til plutonium-239, som også kan spaltes.',
  },
  {
    id: 'r-tre', titel: 'Find alle tre måder at spalte på', tip: 'Spalt uran-235 flere gange. Den spalter tilfældigt.',
    fakta: 'I virkeligheden kan uran-235 spalte på mere end hundrede forskellige måder. Stumperne har næsten altid tilsammen 92 protoner. En sjælden gang flyver der også en lille heliumkerne ud.',
  },
  {
    id: 'r-start', titel: 'Start en kædereaktion', tip: 'Gå til "Kædereaktion", og tryk "Start reaktoren".',
    fakta: 'Hver spaltning giver 2-3 nye neutroner, som kan spalte nye kerner. Derfor kan det tage fart.',
  },
  {
    id: 'r-stabil', titel: 'Hold reaktoren stabil i 30 sekunder', tip: 'Brug kontrolstavene, så effekten bliver i det grønne felt.',
    fakta: 'I et atomkraftværk styrer man reaktoren præcis sådan: Kontrolstavene suger neutroner op, så hver spaltning i gennemsnit giver præcis én ny spaltning.',
  },
  {
    id: 'r-nødstop', titel: 'Få reaktoren til at lave nødstop', tip: 'Træk kontrolstavene helt op, og se hvad der sker.',
    fakta: 'Ved nødstop kommer alle kontrolstavene ind på få sekunder, og kædereaktionen stopper. Men brændslet bliver ved med at lave varme længe bagefter, så det skal stadig køles.',
  },
];

// Batteriet
export const OPGAVER_BATTERI = [
  {
    id: 'b-fuld', titel: 'Lad batteriet helt op', tip: 'Tryk "Oplad", og vent til 100 %.',
    fakta: 'Fuldt opladet er en LiPo-celle 4,2 V. Til sidst skifter laderen til konstant spænding, så strømmen falder, og cellen ikke bliver overladet.',
  },
  {
    id: 'b-lampe', titel: 'Få lampen til at lyse med batteriet', tip: 'Lad batteriet lidt op, og tryk så "Aflad".',
    fakta: 'Elektronerne laver arbejde, når de løber gennem lampen. Det er den energi, du gemte, da du ladede batteriet op.',
  },
  {
    id: 'b-tom', titel: 'Aflad batteriet, til beskyttelsen slår fra', tip: 'Aflad, til spændingen når 3,0 V.',
    fakta: 'Mange LiPo-batterier, fx i telefoner, har et lille beskyttelseskredsløb. I fx droner passer laderen og elektronikken på i stedet. Går en celle meget længere ned end 3 V, kan kobberet i den begynde at opløses, og cellen tager skade.',
  },
  {
    id: 'b-hurtig', titel: 'Lad hurtigt, og hold øje med varmen', tip: 'Vælg "Hurtig", og tryk "Oplad".',
    fakta: 'Jo hurtigere man lader, jo varmere bliver batteriet. Laderen når også 4,2 V tidligere, så den sidste del tager længere tid. Varme slider på batteriet, så det holder kortere.',
  },
  {
    id: 'b-overlad', titel: 'Se hvad der sker, hvis man overlader', tip: 'Slå "Snyd laderen" til, og lad videre efter 100 %.',
    fakta: 'Derfor må man aldrig lade en LiPo med en forkert lader. Gode ladere stopper ved 4,2 V og balancerer cellerne, så ingen bliver overladet.',
  },
];
