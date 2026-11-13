// Gåderne i Biblioteket (#gaader, docs/plan-gaader.md): fem kort om det, videnskaben ikke ved endnu. Hvert kort er
// et lille forløb på tre trin (Hvad ved vi? / Hvad ved vi ikke? / Hvordan finder vi ud af det?) med samme form som
// forløbene i js/data/forloeb/. Uden Three.js, så det kan testes i Node (tests/gaader.mjs).
//
// Et kort: { id, spørgsmål, linje (til oversigten), dato, trin: [{ overskrift, spørg, gæt: { valg: [{ tekst, efter }] }, så,
// hvorfor (id i HVORFOR, en knap under Så) }],
// slut (kernen i én-to sætninger), seDet: [data-gaa, tekst], nørd (HTML), ærligt (HTML), ord (fagord på kortet, id'er i
// Ordbogen) }. Et kort uden trin er ikke bygget endnu og står gråt i oversigten ("Kommer senere").
// Kilderne står i docs/fakta-gaader.md. Hvert kort har en dato, fordi stoffet flytter sig: Slå "Tjek igen" op, før
// teksten ændres.

export const GÅDER = [
  {
    id: 'sorthul',
    spørgsmål: 'Hvad er der inde i et sort hul?',
    linje: 'Intet slipper ud, så hvordan kan man vide det?',
    // Datoerne er slået op 12. november 2026: LISA (efter planen 2035) og GW250114 (arXiv:2509.08054)
    dato: 'Sådan stod det i november 2026',
    ord: ['horisont', 'singularitet'],
    trin: [
      {
        overskrift: 'Hvad ved vi?',
        spørg: 'Findes sorte huller i virkeligheden, eller er de bare en idé?',
        gæt: {
          valg: [
            { tekst: 'De er målt', efter: 'Rigtigt, de er målt på to måder.' },
            { tekst: 'Kun en idé', efter: 'Det var de længe, men i dag er de målt på to måder.' },
          ],
        },
        // LIGO 14. september 2015 (arXiv:1602.03837). Billedet af M87* blev vist 10. april 2019 (Event Horizon Telescope).
        så: 'I 2015 målte forskerne tyngdebølger (bølger i selve rummet) fra to sorte huller, der smeltede sammen. I 2019 viste de et billede af skyggen af et sort hul.',
      },
      {
        overskrift: 'Hvad ved vi ikke?',
        spørg: 'Målt eller gæt? »I midten er alt presset sammen i ét punkt.«',
        gæt: {
          valg: [
            { tekst: 'Målt', efter: 'Nej. Ingen kan se ind bag begivenhedshorisonten, så det er ikke målt.' },
            { tekst: 'Gæt', efter: 'Rigtigt. Ingen kan se ind bag begivenhedshorisonten.' },
          ],
          rigtigt: 1,
        },
        // Wikipedia "Gravitational singularity": "signals a breakdown of general relativity"
        så: 'Einsteins teori siger, at alt ender i et punkt, en singularitet. Men teorien giver »uendelig« dér, og det betyder, at den holder op med at virke: Ingen ved, hvad der er i midten.',
      },
      {
        overskrift: 'Hvordan finder vi ud af det?',
        spørg: 'Intet slipper ud. Hvordan kan man så undersøge det?',
        gæt: {
          valg: [
            { tekst: 'Send en sonde ind', efter: 'Den kan aldrig sende noget ud, når den først er inde.' },
            { tekst: 'Lyt til tyngdebølger', efter: 'Godt tænkt. De kommer fra området uden for horisonten, men kan vise, om Einsteins teori passer helt.' },
            { tekst: 'Find en ny teori', efter: 'Godt tænkt. Det arbejder forskerne på.' },
          ],
        },
        // LISA: vedtaget af ESA i januar 2024, opsendelse efter planen ca. 2035 (Wikipedia "Laser Interferometer Space
        // Antenna", stadig 2035 i 2026)
        så: 'Forskerne lytter til sorte huller, der smelter sammen, og ESA\'s LISA skal efter planen sendes op i 2035 og lytte endnu bedre. De leder også efter en teori, der forener tyngdekraften med fysikken for de allermindste ting, men måske får vi aldrig et svar, vi kan måle.',
      },
    ],
    slut: 'Sorte huller er målt. Hvad der er i midten, ved ingen.',
    seDet: ['kosmos:sorthul', 'Se det selv: Kosmos, Sort hul'],
    // τ = πGM/c³ (Lewis og Kwan, arXiv:0705.1029): 1,547 · 10⁻⁵ s pr. solmasse, altså 66,5 s for 4,30 mio. sole (GRAVITY),
    // 27,9 timer for 6,5 mia. sole (M87*) og 0,15 ms for 10 sole. Hawking: T = ħc³/(8πGMk) = 6,2 · 10⁻⁸ K for én solmasse,
    // ca. 44 millioner gange koldere end baggrundsstrålingen (2,725 K).
    nørd: `
      <p><b>Hvor lang tid?</b> Inden for horisonten går der højst πGM/c³ for den, der falder ind (Lewis og Kwan 2007). Det er ca. 67 sekunder i Mælkevejens sorte hul (4,3 millioner sole), ca. 28 timer i M87* (6,5 milliarder sole) og kun ca. 0,15 millisekunder i et hul på 10 sole. Raketter kan give lidt mere tid end et frit fald, men aldrig mere end det.</p>
      <p><b>Et sted eller et tidspunkt?</b> Inden for horisonten af et hul, der ikke drejer, opfører afstanden til midten sig som tid. Singulariteten er derfor nærmere et tidspunkt, der kommer for alle derinde, end et sted, man kan styre udenom.</p>
      <p><b>Huller, der drejer:</b> Rigtige sorte huller drejer som regel. For dem giver teorien (Kerr-hullet) en ring i stedet for et punkt og en ekstra horisont indenfor, men regnestykket for det indre er ustabilt. Heller ikke teorien ved altså, hvordan et rigtigt hul ser ud indeni.</p>
      <p><b>GW250114</b> (målt 14. januar 2025) er det tydeligste signal fra to sorte huller hidtil (ca. 34 og 32 sole). Det nye huls horisont fik et større areal end de to gamles tilsammen, som Hawking forudsagde i 1971, og hullets "toner" passede med Einsteins teori inden for ± 30 %.</p>
      <p><b>Hawking-stråling:</b> Hawking regnede i 1974 ud, at sorte huller stråler svagt og til sidst fordamper. Et hul på én solmasse er kun ca. 0,00000006 grader over det absolutte nulpunkt, ca. 44 millioner gange koldere end baggrundsstrålingen. Strålingen er aldrig målt. De fleste fysikere tror i dag, at oplysningerne om det, der faldt ind, ikke går tabt, men ingen ved hvordan.</p>
      <p><b>Nobelprisen:</b> Roger Penrose viste i 1965, at Einsteins teori giver en singularitet, når et sort hul dannes, og fik Nobelprisen i fysik i 2020 for det.</p>`,
    ærligt: '<p>"Målt eller gæt?" er forenklet. At der er en singularitet, er ikke et vildt gæt: Det er det, Einsteins teori forudsiger, og teorien passer med alle målinger uden for horisonten. Men en forudsigelse er ikke en måling, og her siger teorien selv, at den ikke holder.</p>',
  },
  // G2 (13. november 2026). Kilderne står i docs/fakta-liv/rummet.md (Fable E5) og fakta-gaader.md afsnit 1.
  {
    id: 'liv',
    spørgsmål: 'Er der liv andre steder?',
    linje: 'På Mars, på en måne eller om en anden stjerne',
    // Datoerne er slået op 13. november 2026: over 6.000 exoplaneter (science.nasa.gov/exoplanets), Tianwen-3 (opsendes
    // 2028, prøverne hjem 2031), Europa Clipper (Jupiter april 2030, NASA), Dragonfly (NET juli 2028, Titan 2034),
    // Rosalind Franklin (2028), JUICE (juli 2031), ELT (første lys marts 2029) og HWO (2040'erne) på Wikipedia
    dato: 'Sådan stod det i november 2026',
    ord: ['biospor'],
    trin: [
      {
        overskrift: 'Hvad ved vi?',
        spørg: 'Har forskerne fundet liv et andet sted end på Jorden?',
        gæt: {
          valg: [
            { tekst: 'Ja', efter: 'Nej, ikke endnu. Men der er steder, hvor det kunne være.' },
            { tekst: 'Nej, ikke endnu', efter: 'Rigtigt. Liv er kun fundet på Jorden.' },
          ],
          rigtigt: 1,
        },
        // Enceladus: globalt hav (Thomas m.fl. 2016), brint (Waite 2017), store organiske molekyler (Postberg 2018) og
        // fosfat (Postberg 2023). Fem af de seks CHNOPS, svovl måske (Peter m.fl. 2023). Mars: Jezero var en sø.
        så: 'Liv er kun fundet på Jorden. Men forskerne kender over 6.000 planeter om andre stjerner, Mars havde engang søer og floder, og Saturns måne Enceladus har et hav under isen med mange af de stoffer, liv har brug for.',
      },
      {
        overskrift: 'Hvad ved vi ikke?',
        spørg: 'Målt eller gæt? »Pletterne på en sten på Mars er lavet af levende væsner.«',
        gæt: {
          valg: [
            { tekst: 'Målt', efter: 'Nej. Pletterne er målt, men ikke hvad der lavede dem.' },
            { tekst: 'Gæt', efter: 'Rigtigt. Det kan være sådan, men ingen ved det endnu.' },
          ],
          rigtigt: 1,
        },
        // Hurowitz m.fl., Nature 645:332-340 (2025): "potential biosignatures", og først en undersøgelse på Jorden "will
        // enable the measurements required to determine the origin". NASA 2025: abiotiske forklaringer "we cannot rule
        // them out". Stenen blev fundet i juli 2024 (NASA 2024).
        så: 'I 2024 fandt roveren Perseverance stenen Cheyava Falls med små pletter, der måske er et biospor (et spor efter liv). Kemi uden liv kan også have lavet dem, og det kan kun afgøres, hvis en prøve af stenen kommer til et laboratorium på Jorden.',
      },
      {
        overskrift: 'Hvordan finder vi ud af det?',
        spørg: 'Hvordan kan forskerne finde ud af, om der er liv derude?',
        gæt: {
          valg: [
            // Mars Sample Return: "cancelled by the US in 2026" (Wikipedia), programkontoret lukket (Planetary Society jan. 2026)
            { tekst: 'Hent prøver hjem fra Mars', efter: 'Godt tænkt. Perseverance har gemt prøver i rør, men NASA og ESA\'s plan for at hente dem blev lukket i 2026.' },
            // NASA: "Europa Clipper is not a life detection mission". Dragonfly "isn't a mission to detect life".
            { tekst: 'Send sonder til månerne', efter: 'Godt tænkt. Sonderne skal finde ud af, om livet kunne klare sig dér, men ingen af dem er bygget til at finde liv.' },
            // DMS på K2-18b: 3 sigma (Madhusudhan 2025), ikke bekræftet (Luque, Welbanks, Hu 2025)
            { tekst: 'Kig på luften om fjerne planeter', efter: 'Godt tænkt. James Webb-teleskopet måler gasserne om fjerne planeter, men intet spor efter liv er bekræftet.' },
          ],
        },
        hvorfor: 'opdaget', // Gåderne G3: DMS på K2-18b er 3 sigma
        så: 'Kina vil efter planen sende Tianwen-3 af sted i 2028 og have prøver fra Mars hjem i 2031. Europa Clipper når Jupiter i 2030 og skal flyve tæt forbi månen Europa mange gange, og Dragonfly skal efter planen lande på Saturns måne Titan i 2034.',
      },
    ],
    slut: 'Liv er kun fundet på Jorden. Et muligt spor på Mars og havene under isen venter på at blive undersøgt.',
    seDet: ['solsystem:mars:jezero', 'Se det selv: Mars, Jezero'],
    // CoLD: Green m.fl. 2021 (arXiv:2107.10975). Trin 1: NASA's billedtekst 25. juli 2024. Trin 3: Hurowitz 1. okt. 2025.
    // Pletterne: Hurowitz 2025 ("about 200 μm to 1 mm", "likely vivianite and greigite", "<150–200 °C"). "Måske det
    // stærkeste": Jim Bell, "perhaps the best evidence yet" (Fable E5). Sagan: Broca's Brain (1979) s. 62 (Wikipedia).
    // Rosalind Franklin borer op til 2 m (Wikipedia). HWO: "search for signs of life on Earth-like exoplanets" (Wikipedia).
    nørd: `
      <p><b>Hvor sikkert er sporet?</b> Forskerne har en skala med syv trin fra "et muligt signal" til "sikkert liv" (CoLD, Green m.fl. 2021). NASA kaldte Cheyava Falls trin 1 i 2024. Hovedforfatteren af artiklen om stenen, Joel Hurowitz, mener selv, det er trin 3. Skalaens forfattere regnede med, at Perseverance kan nå trin 3, og at resten kræver, at prøven kommer til Jorden.</p>
      <p><b>Pletterne</b> er 0,2-1 mm, lyse i midten med en mørk kant. Kanten er sandsynligvis jernfosfat (vivianit) og midten jernsulfid (greigit). Mikrober på Jorden laver de to stoffer, når de "spiser" organisk stof. Uden liv går det meget langsomt under ca. 150-200 °C, men én vej uden liv er ikke udelukket (Hurowitz m.fl., Nature 2025). Det er måske det stærkeste spor af liv, der er fundet på Mars.</p>
      <p><b>Enceladus:</b> Rumsonden Cassini fandt brint (2017), store organiske molekyler (2018) og fosfat (2023) i fontænerne. Af de seks grundstoffer, livets store molekyler er bygget af (C, H, N, O, P og S), er de fem fundet, og svovl måske. Ingen har endnu kunnet se efter liv dér.</p>
      <p><b>Fund, der ikke holdt:</b> Vikings forsøg på Mars (1976) og meteoritten ALH84001 fra Mars (1996) lignede spor af liv, men de fleste forskere mener i dag, at kemi uden liv forklarer dem. Gassen fosfin på Venus (2020) er omstridt, og gassen DMS på planeten K2-18b (2025) er ikke bekræftet. Carl Sagan skrev i 1979 tanken sådan (frit oversat): Usædvanlige påstande kræver usædvanlige beviser.</p>
      <p><b>Planerne:</b> ESA's rover Rosalind Franklin skal efter planen sendes op i 2028 og kan bore op til 2 m ned i Mars. ESA's JUICE når Jupiter i 2031. Teleskopet ELT i Chile skal efter planen se sit første lys i 2029, og NASA's Habitable Worlds Observatory skal efter planen op i 2040'erne og lede efter spor af liv på planeter som Jorden.</p>`,
    ærligt: '<p>"Målt eller gæt?" er forenklet. At pletterne er lavet af liv, er ikke et vildt gæt: Mikrober på Jorden laver de samme stoffer. Men kemi uden liv er ikke udelukket, og flere fund, der lignede liv, holdt ikke.</p><p>Vi kender kun ét eksempel på liv, vores eget. Derfor ved ingen, om liv opstår let, når der er vand og de rigtige stoffer.</p>',
  },
  // Kortene om liv står ikke ved siden af hinanden, så "hvor" og "hvordan" ikke flyder sammen (jeres valg 13. november 2026)
  // G3 (13. november 2026). Kilderne står i docs/fakta-gaader.md afsnit 3.
  {
    id: 'antistof',
    spørgsmål: 'Hvor blev antistoffet af?',
    linje: 'Alt omkring os er stof, næsten intet er antistof',
    // Datoerne er slået op 13. november 2026: Hyper-Kamiokande (måler fra 2028) og DUNE (strålen i begyndelsen af
    // 2030'erne) på Wikipedia, BASE's lastbil (home.cern 24. marts 2026) og Nobelprisen 2015 (nobelprize.org)
    dato: 'Sådan stod det i november 2026',
    ord: ['antistof'],
    trin: [
      {
        overskrift: 'Hvad ved vi?',
        spørg: 'Big Bang burde have lavet lige meget stof og antistof. Hvor meget antistof er tilbage?',
        gæt: {
          valg: [
            // Wikipedia "Antimatter": "the gamma rays produced in annihilation reactions along the boundary ... would be detectable"
            { tekst: 'Lige så meget som stof', efter: 'Det skulle man tro. Men så ville grænserne mellem stof og antistof lyse af stråling, og det ser man ingen steder.' },
            { tekst: 'Næsten intet', efter: 'Rigtigt. Næsten alt, man har fundet i universet, er stof.' },
          ],
          rigtigt: 1,
        },
        // Ca. 6 · 10⁻¹⁰ kernepartikler pr. lyspartikel (Planck, via Wikipedia "Big Bang nucleosynthesis"): en størrelsesorden
        så: 'Stof og antistof bliver til stråling, når de mødes, og næsten alt blev udslettet. Men for hver milliard par var der ca. én partikel stof i overskud, og det er den rest, stjernerne og du er lavet af.',
      },
      {
        overskrift: 'Hvad ved vi ikke?',
        // Her er svaret "Målt", så man ikke lærer, at svaret altid er "Gæt"
        spørg: 'Målt eller gæt? »Naturen behandler stof og antistof en lille smule forskelligt.«',
        gæt: {
          valg: [
            { tekst: 'Målt', efter: 'Rigtigt. Det blev målt første gang i 1964 og senest på CERN i 2025.' },
            { tekst: 'Gæt', efter: 'Nej, det er faktisk målt, første gang i 1964 og senest på CERN i 2025.' },
          ],
          rigtigt: 0,
        },
        // T2K, arXiv:1910.03887: "it is too small to explain the matter-antimatter imbalance of the universe"
        så: 'Men den forskel, man har målt, er alt for lille til at forklare, at der blev stof tilovers. Derfor tror forskerne, at der findes en forskel mere, som ingen har fundet endnu.',
      },
      {
        overskrift: 'Hvordan finder vi ud af det?',
        spørg: 'Hvordan kan forskerne lede efter den forskel, ingen har fundet?',
        gæt: {
          valg: [
            // ALPHA-g 2023 (falder nedad), BASE 2022 (samme forhold mellem ladning og masse inden for 16 billiontedele)
            { tekst: 'Mål antistof meget præcist', efter: 'Godt tænkt. På CERN laver de antistof og måler fx, om det vejer og falder præcis som stof. Indtil nu passer alt.' },
            { tekst: 'Studér neutrinoer', efter: 'Godt tænkt. Neutrinoer (næsten usynlige partikler) skifter mellem tre slags, mens de flyver. Måske gør deres antitvillinger det på en anden måde.' },
            // AMS-02: "The result remains to be verified" (Wikipedia "Alpha Magnetic Spectrometer")
            { tekst: 'Led efter antistof i rummet', efter: 'Godt tænkt. Et instrument på Rumstationen leder. Det har set nogle få mulige tegn, men intet er bekræftet.' },
          ],
        },
        // Hyper-Kamiokande: "2028: The expected beginning of data-taking". DUNE: "neutrino-beam start-date for the early-2030s"
        så: 'Japans Hyper-Kamiokande skal efter planen begynde at måle i 2028, og USA\'s DUNE skal efter planen få sin stråle af neutrinoer i begyndelsen af 2030\'erne. De skal se, om neutrinoer og deres antitvillinger opfører sig forskelligt.',
      },
    ],
    slut: 'Antistof findes, men næsten alt blev udslettet. Hvorfor der blev stof tilovers, ved ingen.',
    seDet: ['kosmos:bigbang', 'Se det selv: Kosmos, Big Bang'],
    // Nobelpriserne (nobelprize.org): 1980 Cronin og Fitch ("violations of fundamental symmetry principles in the decay of
    // neutral K-mesons"), 2008 Kobayashi og Maskawa, 2015 Kajita og McDonald ("neutrino oscillations, which shows that
    // neutrinos have mass"). LHCb 2025: arXiv:2503.16954. ALPHA-g: Nature 621:716 (PMC10533407). BASE 2022: Nature 601:53.
    // BASE-STEP: 92 antiprotoner, 24. marts 2026 (home.cern). "A few nanograms" (Wikipedia "Antimatter").
    nørd: `
      <p><b>Fundet:</b> Paul Dirac forudsagde antistof i 1928 ud fra en ligning for elektronen, og i 1932 fandt Carl Anderson positronen (en plusladet elektron). Antiprotonen blev fundet i 1955. Hospitaler bruger positroner hver dag i PET-skannere. I Atomværkstedet kan du se det selv: Byg fluor-18 eller kulstof-11, og se positronen møde en elektron og blive til et glimt.</p>
      <p><b>Hvor meget tilovers?</b> I dag er der ca. 6 kernepartikler for hver 10 milliarder lyspartikler fra Big Bang. "Én ud af en milliard" er en afrunding.</p>
      <p><b>Forskellen, der er målt (CP-brud):</b> James Cronin og Val Fitch målte den i 1964 i partikler, der hedder K-mesoner, og fik Nobelprisen i 1980. Makoto Kobayashi og Toshihide Maskawa forklarede, hvordan den kan opstå hos kvarkerne (Nobelprisen 2008). I 2025 så LHCb på CERN den for første gang i partikler af tre kvarker, samme slags som protonen.</p>
      <p><b>Ens indtil videre:</b> Protonen og antiprotonen har samme forhold mellem ladning og masse inden for 16 billiontedele (BASE 2022), og i 2023 viste ALPHA-g, at antibrint falder nedad som alt andet. Den 24. marts 2026 kørte BASE 92 antiprotoner i en fælde på en lastbil tværs over CERN. Målet er at kunne måle dem i roligere laboratorier. Alt det antistof, der er lavet, vejer kun nogle få nanogram (milliardtedele af et gram).</p>
      <p><b>Neutrinoerne:</b> Takaaki Kajita og Arthur McDonald fik Nobelprisen i 2015 for at vise, at neutrinoer skifter mellem tre slags og derfor har en masse. Det åbner for, at neutrinoer og antineutrinoer kan skifte forskelligt. T2K i Japan og NOvA i USA har målt i årevis, men har ikke fundet et klart svar.</p>`,
    ærligt: '<p>At Big Bang lavede lige meget stof og antistof, er det, fysikkens love tyder på, men ingen har set det. Og "Målt eller gæt?" er her den anden vej rundt: Forskellen er målt, men hvad den skyldes i sidste ende, og om der er flere, er ikke afgjort.</p>',
  },
  // G2 (13. november 2026). Kilderne står i docs/fakta-liv/begyndelsen.md (Fable E5) og fakta-gaader.md afsnit 4.
  {
    id: 'begyndelsen',
    spørgsmål: 'Hvordan begyndte livet?',
    linje: 'Fra stoffer uden liv til den første celle',
    // QT45 er slået op 13. november 2026: Gianni m.fl., Science 391:1022-1028 (12. februar 2026), læst af Fable i
    // forfatternes manuskript (PMC7618777). Wikipedia "RNA world" kalder det "a 2024 study" (fortrykket).
    dato: 'Sådan stod det i november 2026',
    ord: ['aminosyre', 'rna'],
    trin: [
      {
        overskrift: 'Hvad ved vi?',
        spørg: 'Kan man lave livets byggesten af stoffer uden liv?',
        gæt: {
          valg: [
            { tekst: 'Ja', efter: 'Rigtigt. Det gjorde den unge forsker Stanley Miller allerede i 1953.' },
            { tekst: 'Nej', efter: 'Jo, det kan man. Det gjorde den unge forsker Stanley Miller allerede i 1953.' },
          ],
          rigtigt: 0,
        },
        // Miller, Science 117:528 (15. maj 1953): gnister i CH₄, NH₃, H₂O og H₂ (Lazcano og Bada 2003). Bennu: "14 of the
        // 20 ... and all five nucleobases" og ribose (NASA 29. jan. og 2. dec. 2025), "do not show evidence for life itself".
        så: 'Miller fik aminosyrer, byggestenene til proteiner, ud af gasser og elektriske gnister, og i prøver fra asteroiden Bennu er der fundet mange af livets byggesten. Men byggesten er ikke liv, ligesom en bunke mursten ikke er et hus.',
      },
      {
        overskrift: 'Hvad ved vi ikke?',
        spørg: 'Målt eller gæt? »Livet begyndte med RNA, der kunne kopiere sig selv.«',
        gæt: {
          valg: [
            { tekst: 'Målt', efter: 'Nej. Mange forskere tror det, men ingen har set det ske.' },
            { tekst: 'Gæt', efter: 'Rigtigt. Der er gode spor, men ingen ved det.' },
          ],
          rigtigt: 1,
        },
        // Ribozymer: Nobelprisen i kemi 1989. Ribosomets kerne er RNA (Nissen m.fl. 2000, Nobelkomitéen 2009), men
        // proteinhaler hjælper også, så "kernen", ikke "ribosomet er RNA". Varme væld eller kilder på land: begyndelsen.md afsnit 8.
        så: 'RNA kan både bære en opskrift og arbejde som et værktøj, og kernen i ribosomet, cellens proteinfabrik, er af RNA. Men ingen har lavet et RNA, der klarer sig helt selv, og ingen ved, om livet begyndte ved varme kilder på havbunden eller på land.',
      },
      {
        overskrift: 'Hvordan finder vi ud af det?',
        spørg: 'Ingen var der. Hvordan kan man så finde ud af det?',
        gæt: {
          valg: [
            { tekst: 'Prøv det i et laboratorium', efter: 'Godt tænkt. Forskerne prøver at få RNA til at kopiere sig selv og små fedtbobler til at vokse og dele sig.' },
            // USGS: "Earth's oldest rocks have been recycled and destroyed". Isua er omstridt (Allwood m.fl. 2018).
            { tekst: 'Led i meget gamle sten', efter: 'Godt tænkt. Men der er næsten ingen sten tilbage fra den første tid, og nogle af de ældste spor er omstridte.' },
            { tekst: 'Find liv et andet sted', efter: 'Godt tænkt. Ét eksempel mere kunne vise, om livet opstår let.' },
          ],
        },
        // QT45: 94,1 % rigtige bogstaver, ca. 0,2 % udbytte på 72 dage, de to trin i hver sin reaktion (Fable E5).
        så: 'I 2026 viste forskere et lille RNA, QT45, der kan bygge en kopi af sig selv, men kun langsomt, med mange fejl og med forskernes hjælp. Ingen har endnu lavet liv af stoffer uden liv.',
      },
    ],
    slut: 'Livets byggesten opstår let. Hvordan de blev til noget levende, ved ingen endnu.',
    seDet: ['liv:protein', 'Se det selv: Liv, Fra opskrift til protein'],
    // Jorden 4,54 mia. år (USGS). Dresser-formationen ca. 3,48 mia. år, "most scientists accept" (Wikipedia). Isua:
    // Nutman 2016 og Allwood 2018. 4,54 − 3,48 = 1,06. Miller: 5 aminosyrer (Lazcano og Bada 2003), DNA-modellen
    // 25. april 1953. Luften: Parker 2011. RNA-verdenen: Gilbert 1986, idéen fra 1960'erne (Fable E5). Nobel 1989 (Cech
    // og Altman) og 2009. Poul Nissen: Nissen m.fl., Science 289 (2000). QT45: 0,941⁴⁵ = 0,065, ca. 1 af 15. Darwin:
    // brev til Hooker 1. februar 1871 ("warm little pond"). Væld: "strong dilution by seawater" (Wikipedia "Abiogenesis").
    // JCVI-syn1.0 (2010): genomet kom ind i levende celler (Fable E5).
    nørd: `
      <p><b>Hvor gammelt er livet?</b> Jorden er ca. 4,54 milliarder år gammel. De ældste spor, de fleste forskere godtager, er ca. 3,48 milliarder år gamle lag, som mikrober har bygget (stromatolitter), i Pilbara i Australien. Spor fra Isua i Grønland (ca. 3,7 milliarder år) er omstridte. Livet var der altså senest ca. 1 milliard år efter, at Jorden blev dannet, og måske meget før.</p>
      <p><b>Millers forsøg</b> kom 15. maj 1953, samme forår som DNA's dobbeltspiral. Han sendte gnister gennem metan, ammoniak, brint og vanddamp i en uge og fandt selv 5 aminosyrer. Mange tror i dag, at Jordens første luft mest var CO₂ og N₂. Så bliver der færre aminosyrer, men ikke ingen.</p>
      <p><b>Bennu:</b> I prøverne fandt NASA 14 af de 20 aminosyrer, liv bruger, alle fem baser fra DNA og RNA og sukkeret ribose, men ingen tegn på liv.</p>
      <p><b>RNA-verdenen:</b> Idéen er fra 1960'erne, og Walter Gilbert gav den navnet i 1986. Thomas Cech og Sidney Altman fik Nobelprisen i kemi i 1989 for at vise, at RNA kan arbejde som et enzym. Kernen i ribosomet er RNA (Nobelprisen i kemi 2009), og danske Poul Nissen var med til at vise det i 2000.</p>
      <p><b>QT45</b> (Science, februar 2026) er 45 baser langt og virker i is ved −7 °C. Hvert bogstav bliver rigtigt i ca. 94 % af tilfældene, så kun ca. hver femtende kopi er helt uden fejl. Efter 72 dage var kun ca. 0,2 % kopieret, og de to halvdele af arbejdet sker i hver sin reaktion.</p>
      <p><b>Hvor?</b> Darwin skrev i et brev i 1871 om "en lille varm dam". I dag diskuterer forskerne især varme væld på havbunden og varme kilder på land. Et argument mod vældene er, at havvandet fortynder stofferne.</p>
      <p><b>Kunstigt liv?</b> I 2010 byggede forskere en bakteries arvemasse kemisk og satte den ind i levende celler. Det er ikke liv lavet fra bunden.</p>`,
    ærligt: '<p>"Målt eller gæt?" er forenklet. RNA-verdenen er ikke et vildt gæt: RNA kan både gemme en opskrift og arbejde, og ribosomet ligner en rest fra den tid. Men nogle forskere tror, at kemien fx i varme væld kom før RNA ("stofskiftet først"), og det er ikke afgjort.</p>',
  },
  // G3 (13. november 2026). Kilderne står i docs/fakta-gaader.md afsnit 5.
  {
    id: 'moerktstof',
    spørgsmål: 'Hvad er mørkt stof?',
    linje: 'Noget usynligt trækker i galakserne',
    // Datoerne er slået op 13. november 2026: LZ's hændelse (arXiv:2609.02823, 2. september 2026; XENONnT og PandaX-4T
    // har ikke meldt noget om den på arXiv), Euclid DR1-Foundation (ESA 12. november 2026) og DR1 (midt 2027, ESA)
    dato: 'Sådan stod det i november 2026',
    ord: ['moerktstof'],
    trin: [
      {
        overskrift: 'Hvad ved vi?',
        spørg: 'Galakserne drejer så hurtigt, at de burde flyve fra hinanden. Hvorfor gør de ikke?',
        gæt: {
          valg: [
            { tekst: 'Noget usynligt holder på dem', efter: 'Det tror næsten alle forskere.' },
            // MOND (Milgrom 1983): "a few dozens of scientists ... several thousand" (Hossenfelder og McGaugh 2018)
            { tekst: 'Tyngdekraften virker anderledes langt ude', efter: 'Det tror et lille mindretal af forskerne. Men så er det svært at forklare andre målinger.' },
          ],
        },
        // Planck 2018: Ω_c h² = 0,120 og Ω_b h² = 0,0224, altså 5,4 gange så meget. Bullet-hoben: Clowe m.fl. 2006.
        så: 'Der er ca. fem gange så meget usynligt stof som almindeligt stof, og det kaldes mørkt stof. Man kan se, hvor det er, fordi dets tyngdekraft bøjer lyset fra galakser bagved.',
      },
      {
        overskrift: 'Hvad ved vi ikke?',
        spørg: 'Målt eller gæt? »Mørkt stof er lavet af en ukendt slags partikel.«',
        gæt: {
          valg: [
            { tekst: 'Målt', efter: 'Nej. Det er det bedste bud, men ingen har fanget sådan en partikel.' },
            { tekst: 'Gæt', efter: 'Rigtigt. Det er det bedste bud, men ingen har fanget sådan en partikel.' },
          ],
          rigtigt: 1,
        },
        // LZ: "one event ... 248 ± 23 (stat) ± 23 (sys) keV", "global significance of 2.6σ" (arXiv:2609.02823)
        så: 'Store detektorer dybt under jorden venter på, at en partikel af mørkt stof rammer dem. I september 2026 så detektoren LZ én hændelse, der måske kunne være det, men det er langt fra nok til at kalde det et fund.',
        hvorfor: 'opdaget',
      },
      {
        overskrift: 'Hvordan finder vi ud af det?',
        spørg: 'Mørkt stof er usynligt. Hvordan kan man så undersøge det?',
        gæt: {
          valg: [
            // LZ (South Dakota), XENONnT (Gran Sasso, Italien) og PandaX-4T (Jinping, Kina)
            { tekst: 'Fang en partikel', efter: 'Godt tænkt. Detektorer i USA, Italien og Kina leder dybt under jorden, hvor de er skærmet mod stråling fra rummet.' },
            { tekst: 'Tegn et kort over det', efter: 'Godt tænkt. Det gør rumteleskopet Euclid ved at måle, hvordan lyset fra galakser bliver bøjet.' },
            // Wikipedia "Dark matter": LHC har ikke fundet supersymmetriske partikler, "cast doubt on the simplest WIMP hypothesis"
            { tekst: 'Lav det selv', efter: 'Godt tænkt. Partikelacceleratoren LHC på CERN leder efter nye partikler, der forsvinder uden spor, men har ikke fundet nogen.' },
          ],
        },
        // ESA 12. november 2026: "Over 900 million galaxies", og DR1 "to come in mid-2027 ... observations of weak lensing"
        så: 'Rumteleskopet Euclid sendte den 12. november 2026 sit første store datasæt med over 900 millioner galakser. De målinger, der skal tegne kortet over det mørke stof, kommer efter planen i 2027.',
      },
    ],
    slut: 'Mørkt stof trækker i galakserne, men ingen ved, hvad det er.',
    seDet: ['kosmos:rumtid', 'Se det selv: Kosmos, Rumtid'],
    // Zwicky 1933 og Rubin og Ford 1970 (Wikipedia "Dark matter"). Clowe m.fl. 2006 (arXiv:astro-ph/0608407): "An 8-sigma
    // significance spatial offset". Planck 2013: 4,9, 26,8 og 68,3 %. 0,120 / (0,120 + 0,0224) = 84 %. LZ: 7 tons xenon
    // ca. 1.500 m nede (Wikipedia "LZ experiment"), solneutrinoer 4,5σ (arXiv:2512.08065). Euclid: sendt op 1. juli 2023,
    // ca. en tredjedel af himlen, DR1-Foundation: "Around 15 000 strong gravitational lensing candidates", ca. 14 % af
    // området (ESA). Nobelprisen 2011: Perlmutter, Schmidt og Riess (nobelprize.org).
    nørd: `
      <p><b>Opdaget to gange:</b> Fritz Zwicky målte i 1933, at galakserne i hoben Coma bevæger sig for hurtigt til, at det synlige stof kan holde på dem. Vera Rubin og Kent Ford målte fra 1970, at stjernerne yderst i galakser kredser lige så hurtigt som dem tættere på midten.</p>
      <p><b>Bullet-hoben:</b> Her er to hobe af galakser stødt sammen. Den varme gas, der vejer mest af det almindelige stof, er bremset op i midten, men det meste af massen er fortsat videre. Det er målt med 8 sigma (Clowe m.fl. 2006), og det er svært at forklare med en ændret tyngdelov.</p>
      <p><b>Hvor meget:</b> Ca. 5 % af universet er almindeligt stof, ca. 27 % mørkt stof og ca. 68 % mørk energi. Mørkt stof er altså ca. 84 % af alt stof. Mørk energi er noget helt andet: Den får universet til at udvide sig hurtigere, og det gav Nobelprisen i 2011 til Saul Perlmutter, Brian Schmidt og Adam Riess.</p>
      <p><b>Forslagene:</b> en tung, ukendt partikel (WIMP), en meget let partikel (axion), som forsøget ADMX lytter efter, eller små sorte huller fra Big Bang. Ingen er fundet.</p>
      <p><b>LZ</b> er 7 tons flydende xenon ca. 1,5 km nede i en gammel guldmine i South Dakota. Den er så følsom, at den har målt neutrinoer fra Solen. Hændelsen fra 2026 havde 248 keV og er 2,6 sigma (se "Hvornår er noget opdaget?"). Mange teoriartikler har allerede foreslået, hvad den kan være.</p>
      <p><b>Euclid</b> blev sendt op 1. juli 2023 og skal kortlægge ca. en tredjedel af himlen. Det første store datasæt dækker ca. 14 % af det og har ca. 15.000 mulige steder, hvor en galakse bøjer lyset fra en anden bagved, så den ses som buer eller en ring. Det er flere end alle tidligere fundet tilsammen.</p>`,
    ærligt: '<p>"Mørkt" er et dårligt navn: Det er ikke sort, men usynligt. Det sender intet lys ud og kaster ingen skygge. Og at der er ekstra tyngdekraft, er målt mange gange, men at den kommer fra en slags partikler, er et gæt, som næsten alle forskere deler. Et lille mindretal mener, at det er tyngdeloven, der skal ændres.</p>',
  },
];

export const gådeMed = (id) => GÅDER.find((g) => g.id === id) ?? null;
export const bygget = (g) => Array.isArray(g?.trin) && g.trin.length > 0;
