# Faktagrundlag: Gåderne i en tynd udgave (fem kort)

*Emne 4 i [prompt-faktagrundlag.md](prompt-faktagrundlag.md). Lavet 12. november 2026 af Fable 5.2 i sin egen session (planlagt, startede om natten). Kun dokumenter, ingen kode. Før en tekst kommer med i programmet, skal den stadig gennem `/faktatjek` mod denne fil, og påstande mærket **Ret sikker** eller **Usikker** skal skrives forsigtigt eller slås op igen. Stoffet flytter sig: **Hvert kort skal have en dato ("Sådan stod det i november 2026")**, og datoerne i afsnittet "Tjek igen" skal slås op, før teksterne skrives.*

**Sikkerhed:** **Sikker** = læst i den oprindelige artikel (resuméet på arXiv eller hele teksten) eller hos NASA/ESA. **Ret sikker** = én pålidelig sekundær kilde (Wikipedia med henvisning), eller fra hukommelsen og passer med kilderne. **Usikker** = kilderne er uenige, eller det kunne ikke læses direkte.

**Kilderne (åbnet 12. november 2026):** arXiv (resuméer via `export.arxiv.org/api`, numrene står ved påstandene), engelsk Wikipedia som wikitekst (`action=raw`, artiklen står ved påstanden), science.nasa.gov og www.esa.int. De to kort om liv bygger på det, der allerede er slået op i [fakta-liv/rummet.md](fakta-liv/rummet.md) og [fakta-liv/begyndelsen.md](fakta-liv/begyndelsen.md) (9. november 2026), og er ikke slået op igen. **Åbnet bagefter (12. november 2026, jeres svar):** home.cern, pdg.lbl.gov og pmc.ncbi.nlm.nih.gov. Kun ALPHA-g er slået op dér. **Lukket:** nature.com, science.org, ligo.caltech.edu, eventhorizontelescope.org, rubinobservatory.org, cosmos.esa.int, desi.lbl.gov og nobelprize.org (se spørgsmål 3).

## Hvilke fem bør med?
**Mit råd: de fem fra prompten.** De har alle tre klare svar på de tre spørgsmål, og de fire af dem har et sted i programmet i dag. Den lange liste fra køreplanen, vurderet én for én:

| Gåde | Sted i programmet i dag | Vurdering |
|---|---|---|
| Liv andre steder | Mars (Cheyava Falls), Saturn (Enceladus) | **Med.** Bedst underbygget i repoet |
| Det indre af et sort hul | Kosmos: Sort hul ("Send en astronaut ind") | **Med.** Kortet fortsætter dér, hvor animationen stopper |
| Stof og antistof | Værkstedet (beta-plus, positronen), Kosmos: Big Bang | **Med** |
| Livets begyndelse | Liv ("Fra opskrift til protein") | **Med.** Hønen og ægget: DNA skal bruge proteiner, og proteiner skal bruge DNA |
| Mørkt stof | **Intet endnu.** Kun lysbøjningen ved Sort hul og Rumtid | **Med, men med et svagt link**, til fænomenet i Kosmos er bygget (nr. 8 i køreplanen) |
| Mørk energi | Kosmos: Hvid dværg (standardlyset, 1998) og Ordbogen | **Nr. 6, det første kort bagefter.** Har et bedre sted i dag end mørkt stof. Må ikke blandes sammen med mørkt stof på samme kort (fælde) |
| Planet 9 ("Planet X") | Intet, før Solsystemets overblik findes | **Nr. 7, sammen med overblikket.** En gåde, der måske bliver løst, mens brugeren går i skole (Rubin-teleskopet) |
| Hubble-spændingen | Intet | **Ikke et kort.** Kræver, at man forstår to måder at måle Universets udvidelse på. Et afsnit "For nørder" på kortet om mørk energi |
| Neutrinoens masse | Supernova, betahenfald | **Ikke et kort.** Svært at gøre spændende for en 13-årig. En linje på kortet om stof og antistof |
| Kvantetyngdekraft | Intet | **Ikke et kort.** Den er svaret på "Hvordan finder vi ud af det?" på kortet om det sorte hul |

**Ærligt om de fem:** To af dem handler om liv. De skal skilles tydeligt: "Er vi alene?" (hvor) og "Hvordan begyndte livet?" (hvordan). Og tre af de fem (sort hul, antistof og mørkt stof) har svar, som ingen ved, om man nogensinde får. Det skal siges, og det er en del af pointen.

## Kernesætningen (valgt 12. november 2026)
"Efter fem minutter kan brugeren sige: **Videnskaben er ikke færdig. Jeg kan nævne en gåde, ingen har løst, og sige, hvordan forskerne prøver at løse den.**"

Alternativ (mere om metoden): "… Jeg kender forskel på det, vi har målt, og det, vi gætter på."

## Fælles for alle kortene
- **De tre spørgsmål:** Hvad ved vi? Hvad ved vi ikke? Hvordan finder vi ud af det? Højst to-tre sætninger til hvert i det, der altid er fremme (Retningen, punkt 3).
- **"Hvornår er noget opdaget?"** (forslag til ét fælles "Hvorfor?"-kort): Forskere måler, hvor sikkert et signal er, i "sigma". I partikelfysik kræves 5 sigma, før man siger "opdaget" (LIGO's første måling: "greater than 5.1 σ", arXiv:1602.03837. **Sikker**). 3 sigma hedder kun "tegn på". Tre steder i stoffet er der lige nu et signal under grænsen: LZ's ene hændelse (2,6 sigma), DMS på K2-18b (3 sigma, ikke bekræftet) og mørk energi, der ændrer sig (2,8-4,2 sigma). Det er god læring: De fleste små signaler forsvinder igen.
- **Dato på kortet,** og ingen "snart" eller "om få år" uden et årstal fra kilden.

## 1. Er der liv andre steder?
*Alle påstande med kilder står i [fakta-liv/rummet.md](fakta-liv/rummet.md). Her kun det, kortet skal bruge, og det nye.*

**Hvad ved vi?**
- Der er ikke fundet liv uden for Jorden. **Sikker.**
- Der er over 6.000 bekræftede planeter om andre stjerner: "We've confirmed more than 6,000 exoplanets, out of the billions that we believe exist" (science.nasa.gov/exoplanets, set 12. november 2026). **Sikker.**
- Der er flydende vand andre steder: Enceladus har et hav under isen med brint, store organiske molekyler og fosfat (rummet.md afsnit 3). Fem af de seks grundstoffer i CHNOPS er fundet, svovl kun måske. **Sikker.**
- Mars havde søer og floder. I 2024 fandt Perseverance stenen Cheyava Falls med pletter, der er et *muligt* biospor (Hurowitz m.fl., Nature 2025). En rover kan højst nå trin 3 af 7 på forskernes skala (CoLD). **Sikker.**

**Hvad ved vi ikke?**
- Om pletterne er lavet af mikrober eller af kemi uden liv. Det kan kun afgøres i et laboratorium på Jorden.
- Om liv opstår let, når der er vand og byggesten. Vi kender kun ét eksempel (Jorden).
- Om der lever noget i havene under isen. Ingen sonde har været dernede.

**Hvordan finder vi ud af det?**
- **Prøverne hjem fra Mars:** NASA og ESA's Mars Sample Return blev lukket i 2026 (rummet.md afsnit 1, og Wikipedia "Mars sample-return mission": "was cancelled by the US in 2026"). Kina planlægger Tianwen-3 til december 2028-januar 2029 (samme). ESA's rover Rosalind Franklin skal efter planen sendes op i 2028 (Wikipedia, kilde fra april 2026). **Ret sikker.** Prøverne i rørene ligger altså stadig på Mars, og ingen ved, hvornår de kommer hjem.
- **Månerne:** Europa Clipper når Jupiter i april 2030, JUICE i juli 2031, og Dragonfly sendes tidligst op i juli 2028 og lander på Titan i 2034. Ingen af dem er bygget til at finde liv (rummet.md afsnit 3). **Sikker.**
- **Luften om fjerne planeter:** James Webb-teleskopet måler gasser. DMS på K2-18b er ikke bekræftet (rummet.md afsnit 2). ELT i Chile skal efter planen se sit første lys i marts 2029 og Habitable Worlds Observatory sendes op i 2040'erne (Wikipedia). **Ret sikker.**

**Gør i programmet:** Solsystemet → Mars → stedet Neretva Vallis (Cheyava Falls). Solsystemet → Saturn → Enceladus (fontænerne).

## 2. Hvad er der inde i et sort hul?
**Hvad ved vi?**
- **Sorte huller findes.** Den 14. september 2015 målte LIGO tyngdebølger fra to sorte huller på 36 og 29 solmasser, der smeltede sammen (arXiv:1602.03837). Event Horizon Telescope viste skyggen af M87* 10. april 2019 (6,5 ± 0,7 milliarder solmasser, arXiv:1906.11238) og af Mælkevejens eget 12. maj 2022 (Wikipedia). Mælkevejens vejer 4,30 millioner solmasser (GRAVITY, arXiv:2112.07478). **Sikker.** Programmet skriver "4 millioner", og det passer.
- **Uden for horisonten passer Einsteins teori.** GW250114 (målt 14. januar 2025) er det tydeligste signal hidtil: to sorte huller på 33,6 og 32,2 solmasser, og det nye huls overflade er større end de to gamles tilsammen, som Hawking forudsagde i 1971 ("confirm that the remnant area is larger than the sum of the initial areas to high credibility", arXiv:2509.08054). **Sikker.**
- **Inden for horisonten siger teorien:** Alt ender i midten (singulariteten) efter en bestemt tid, uanset hvad man gør. Den længste tid er τ = πGM/c³ (Lewis og Kwan, arXiv:0705.1029, ligning 1: "for a stellar mass black hole, this is a fraction of a second, but for a supermassive black hole, this may be hours"). **Sikker** (formlen). Mine udregninger: 15 milliontedele af et sekund pr. solmasse, altså ca. 67 sekunder for Mælkevejens sorte hul og ca. 28 timer for M87* (regnet for et hul, der ikke drejer). Raketter hjælper kun lidt: At kæmpe imod kan ikke give mere end den tid.
- Penrose viste i 1965, at teorien altid giver en singularitet (Phys. Rev. Lett. 14: 57), og fik en halv Nobelpris i 2020 "for the discovery that black hole formation is a robust prediction of the general theory of relativity" (Wikipedia). **Ret sikker.**

**Hvad ved vi ikke?**
- **Hvad der sker i midten.** Teorien giver "uendelig" krumning. Det betyder, at teorien holder op med at virke, ikke at noget uendeligt er målt. Wikipedia "Gravitational singularity": Nogle fysikere mener, at singulariteter ikke findes, og at de "signals a breakdown of general relativity". **Ret sikker.**
- **Hvordan et rigtigt hul ser ud indeni.** Alle rigtige sorte huller drejer. Regnestykket for et hul, der drejer (Kerr), giver en ring i stedet for et punkt og en indre horisont, men "the inner Kerr geometry is unstable" (Wikipedia "Kerr metric", Visser 2007). Det indre af et rigtigt hul er derfor ikke kendt, heller ikke i teorien. **Ret sikker.**
- **Hvad der bliver af det, der falder ind.** Hawking regnede i 1974 ud, at sorte huller stråler svagt og til sidst fordamper. Strålingen er aldrig målt: Et hul på én solmasse er ca. 0,00000006 K varmt (min udregning, T = ħc³/8πGMk), 44 millioner gange koldere end rummets baggrundsstråling på 2,725 K. De fleste fysikere tror i dag, at oplysningerne om det, der faldt ind, ikke går tabt ("It is now generally believed that information is preserved", Wikipedia "Black hole information paradox"), men ingen ved hvordan. **Ret sikker.**

**Hvordan finder vi ud af det?**
- **Ærligt: Man kan ikke kigge ind.** Intet signal kommer ud. Måske får vi aldrig et svar, vi kan måle.
- **Lyt til horisonten:** Et nyt sort hul "ringer" som en klokke, og tonerne afslører, om det er præcis, som Einstein siger (GW250114: tonerne passer inden for ± 30 %, arXiv:2509.08054). Tydeligere signaler kan vise afvigelser. ESA's LISA (tre sonder i rummet) er vedtaget i januar 2024 og skal efter planen sendes op i 2035 (Wikipedia). **Ret sikker.**
- **En ny teori:** Der mangler en teori, der forener tyngdekraften med kvantefysikken (kvantetyngdekraft). Der er forslag (strengteori, loop-kvantetyngdekraft), men ingen er afprøvet med et forsøg. **Ret sikker.**

**Gør i programmet:** Kosmos → Sort hul → "Send en astronaut ind". Kortet tager over ved horisonten: "For astronauten går der højst ca. et minut. Hvad der sker til sidst, ved ingen."

## 3. Hvorfor er der stof og næsten intet antistof?
**Hvad ved vi?**
- **Antistof findes.** Dirac forudsagde det i 1928, og Carl Anderson fandt positronen i 1932 (Wikipedia "Positron"). Antiprotonen blev fundet i 1955 (Wikipedia "Antimatter"). **Ret sikker.** Hospitaler bruger positroner hver dag (PET-skanning med fx fluor-18, som står i `isotoper.js`).
- **Antistof ligner stof meget præcist.** Protonen og antiprotonen har samme forhold mellem ladning og masse inden for 16 billiontedele (BASE, Nature 601: 53, 2022, via Wikipedia). **Ret sikker.** Antibrint falder nedad: ALPHA-g, Nature 621: 716-722 (27. september 2023), læst i PMC (PMC10533407): "the local gravitational acceleration of antihydrogen is directed towards the Earth and has magnitude (0.75 ± 0.13 (statistical + systematic) ± 0.16 (simulation)) g", og "Repulsive 'antigravity' is ruled out". Tallet passer altså med 1 g inden for usikkerheden. **Sikker** (slået op 12. november 2026, efter at PMC blev åbnet).
- **Universet er lavet af stof.** Var der store områder af antistof, ville grænsen til stoffet lyse i gammastråling, og det ses ikke (Wikipedia "Antimatter"). **Ret sikker.** Der er ca. 6 × 10⁻¹⁰ kernepartikler for hver lyspartikel fra Big Bang (Wikipedia "Big Bang nucleosynthesis" med Planck som kilde). Stof og antistof udslettede altså næsten alt, og ca. én ud af en milliard blev tilovers. **Ret sikker** (størrelsesorden).
- **Naturen gør en lille forskel på stof og antistof** (CP-brud): fundet i 1964 (Cronin og Fitch, Nobelpris 1980), i B-mesoner fra 2001, i charm-partikler i 2019 (LHCb, arXiv:1903.08726) og for første gang i partikler af tre kvarker, som protonen er bygget af, i 2025 (LHCb, Nature 643: 1223, arXiv:2503.16954: "the first observation of CP violation in baryon decays"). **Sikker.**

**Hvad ved vi ikke?**
- **Hvorfor der blev noget tilovers.** Den forskel, man har målt, er alt for lille: "it is too small to explain the matter-antimatter imbalance of the universe" (T2K, arXiv:1910.03887). **Sikker.** Der må være en forskel, ingen har fundet endnu.
- Sakharov skrev i 1967, hvad der skal til (bl.a. at stof og antistof ikke opfører sig helt ens, Wikipedia "Baryogenesis"). **Ret sikker.** Hvad der faktisk skete, ved ingen.

**Hvordan finder vi ud af det?**
- **Mål antistof mere præcist** (CERN: ALPHA, BASE, LHCb). Den 24. marts 2026 kørte BASE 92 antiprotoner tværs over CERN på en lastbil i en bærbar fælde (Wikipedia "Antiproton" med CERN som kilde). **Ret sikker.** Det åbner for målinger i roligere laboratorier.
- **Neutrinoer:** Måske ligger forskellen dér. T2K og NOvA's første fælles analyse (Nature 646: 818, 2025, arXiv:2510.19888) gav ikke et klart svar. Hyper-Kamiokande i Japan skal efter planen begynde at måle i 2028, og DUNE i USA får sin stråle i begyndelsen af 2030'erne (Wikipedia). **Ret sikker.**
- **Led efter antistof i rummet:** AMS-02 på rumstationen har set nogle få signaler, der ligner antihelium, men "the result remains to be verified" (Wikipedia). **Ret sikker.** Skriv det ikke som et fund.

**Gør i programmet:** Atomværkstedet → byg kulstof-11 eller fluor-18, og se positronen møde en elektron og blive til et glimt. Kosmos → Big Bang.

## 4. Hvordan begyndte livet?
*Alle påstande med kilder står i [fakta-liv/begyndelsen.md](fakta-liv/begyndelsen.md).*

**Hvad ved vi?**
- Jorden er 4,54 milliarder år. De ældste tegn på liv, de fleste forskere godtager, er ca. 3,48 milliarder år (Pilbara i Australien). Livet var der altså senest ca. 1 milliard år efter Jordens begyndelse, måske meget før (afsnit 2). **Sikker / Ret sikker.**
- **Byggestenene opstår let.** Miller fik aminosyrer af gasser og gnister i 1953 (afsnit 3). Asteroiden Bennu har 14 af de 20 aminosyrer, alle fem baser og sukkeret ribose (NASA 2025, afsnit 4). **Sikker.** Byggesten er ikke liv.
- **RNA kan begge dele:** bære en opskrift og virke som værktøj (Nobelprisen i kemi 1989), og kernen i cellens proteinfabrik er RNA (afsnit 6). **Sikker.**

**Hvad ved vi ikke?**
- **Skridtet fra byggesten til noget, der kopierer sig selv.** Ingen har lavet et RNA, der klarer sig helt selv, og ingen har lavet liv i et laboratorium (afsnit 6 og 9). **Ret sikker.**
- **Hvor det skete:** varme væld på havbunden eller varme kilder på land (afsnit 8). Forskerne er uenige.
- **Hvorfor livet er "venstrehåndet"** (afsnit 5), og om det begyndte én eller flere gange.

**Hvordan finder vi ud af det?**
- **I laboratoriet:** RNA, der kopierer RNA (det nyeste, QT45 fra februar 2026, er **Ret sikker** på artiklen og **Usikker** på detaljerne), og små bobler af fedt, der vokser og deler sig.
- **I gamle sten** (Grønland, Australien) og i **prøver fra asteroider** (Bennu, Ryugu).
- **Find liv et andet sted** (kort 1). Ét eksempel mere ville vise, om livet opstår let.

**Gør i programmet:** Liv → "Fra opskrift til protein". Hønen og ægget: Opskriften (DNA) læses af proteiner, og proteinerne bygges efter opskriften. Hvem kom først? Måske RNA.

## 5. Hvad er mørkt stof?
**Hvad ved vi?**
- **Der er mere, end vi kan se.** Fritz Zwicky målte i 1933, at galakserne i Coma-hoben bevæger sig for hurtigt til, at det synlige stof kan holde på dem. Vera Rubin og Kent Ford målte fra 1970, at stjernerne yderst i galakser kredser for hurtigt (Wikipedia "Dark matter", Rubin og Ford, ApJ 159, 1970). **Ret sikker.**
- **Det er ikke bare gas, vi har overset.** I Bullet-hoben (to hobe af galakser, der er stødt sammen) ligger det meste af massen et andet sted end gassen: "An 8-sigma significance spatial offset … proves that the majority of the matter in the system is unseen" (Clowe m.fl. 2006, arXiv:astro-ph/0608407). Massen er målt på, hvor meget den bøjer lyset fra galakser bagved. **Sikker.**
- **Hvor meget:** Ca. 5 % af Universet er almindeligt stof, ca. 27 % mørkt stof og ca. 68 % mørk energi (Planck 2013: 4,9, 26,8 og 68,3 %, via Wikipedia). Planck 2018 (arXiv:1807.06209): Ω_c h² = 0,120 og Ω_b h² = 0,0224. Min udregning: 0,120 / (0,120 + 0,0224) = 84 % af alt stof er mørkt. **Sikker.** Skriv "ca. fem gange så meget mørkt stof som almindeligt".

**Hvad ved vi ikke?**
- **Hvad det er.** Det sender ikke lys ud og kaster ingen skygge, så det er nærmere usynligt end mørkt. Forslag: en ukendt, tung partikel (WIMP), en meget let partikel (axion) eller små sorte huller fra Big Bang. Ingen er fundet. **Ret sikker.**
- **Detektorerne har ikke set det.** LZ (7 tons flydende xenon ca. halvanden kilometer nede i en gammel mine i South Dakota, Wikipedia "LZ experiment"): "we find no evidence for an excess over expected backgrounds" (arXiv:2410.17036, Phys. Rev. Lett. 2025). Detektoren er nu så følsom, at den ser neutrinoer fra Solen (4,5 sigma, arXiv:2512.08065). **Sikker.**
- **Nyt i september 2026:** LZ så **én** hændelse med høj energi (248 keV), hvor man ventede næsten ingen: "tension with the background-only hypothesis at a global significance of 2.6σ" (arXiv:2609.02823). Flere teoriartikler har allerede foreslået forklaringer med mørkt stof (fx arXiv:2610.03692 og 2610.25423). **Sikker** på, hvad der står. Det er et spor, ikke et fund (se "Hvornår er noget opdaget?").
- **Et lille mindretal** mener, at tyngdeloven skal ændres i stedet (MOND, Milgrom 1983): "a few dozens of scientists are studying modified gravity, whereas several thousand are looking for particle dark matter" (Hossenfelder og McGaugh, Scientific American 2018, via Wikipedia). MOND har svært ved Bullet-hoben og baggrundsstrålingen. **Ret sikker.**

**Hvordan finder vi ud af det?**
- **Fang en partikel:** LZ, XENONnT (Italien) og PandaX-4T (Kina) dybt under jorden, og ADMX, der lytter efter axioner. **Ret sikker.**
- **Tegn kort over det:** ESA's Euclid (sendt op 1. juli 2023) måler, hvordan mørkt stof bøjer lyset fra op til to milliarder galakser over en tredjedel af himlen. Første store datasæt (DR1-Foundation) var planlagt til 12. november 2026 (Wikipedia med ESA som kilde. Ikke tjekket, om det kom). Rubin-observatoriet i Chile begyndte sin tiårige måling 30. juni 2026 (Wikipedia). **Ret sikker.**
- **Lav det selv:** LHC på CERN leder efter partikler, der forsvinder uden spor. Intet fundet (ikke slået op: **Ret sikker**, fra hukommelsen).

**Gør i programmet:** I dag kun Kosmos → Sort hul eller Rumtid ("Tyngdekraft bøjer lys. Sådan vejer man det, man ikke kan se"). Det rigtige sted bliver fænomenet Mørkt stof (galaksen, der drejer for hurtigt i kanten).

## Reserven (kort)
- **Mørk energi:** Opdaget i 1998 med supernovaer af type Ia, Nobelpris 2011 (står i `hviddvaerg.js`). DESI (14 millioner galakser, arXiv:2503.14738) ser tegn på, at den ændrer sig med tiden: "ranges from 2.8-4.2σ depending on which SNe sample is used". **Sikker.** Ikke en opdagelse endnu. DESI blev færdig med sine fem år i 2026 (Wikipedia).
- **Hubble-spændingen:** Målt på baggrundsstrålingen udvider Universet sig med 67,4 ± 0,5 km/s pr. megaparsec (Planck, arXiv:1807.06209). Målt på stjerner og supernovaer i nærheden er det 73,50 ± 0,81 (H0DN, A&A 708: A166, april 2026, via Wikipedia). Ingen kender grunden. **Sikker / Ret sikker.**
- **Planet 9:** Batygin og Brown 2016 (arXiv:1601.05438): Banerne for de fjerneste småkloder peger samme vej, hvilket kun sker ved et tilfælde i 0,007 % af tilfældene, og en planet på over ca. 10 jordmasser kan forklare det. Et nyere skøn: 4,4 ± 1,1 jordmasser og ca. 290 gange Jordens afstand fra Solen (Siraj m.fl. 2025, via Wikipedia). Andre mener, at mønstret skyldes, hvor man har ledt (OSSOS og DES: "no evidence for clustering", Wikipedia). 2017 OF201 (fundet i 2025) passer ikke i mønstret. Ingen har set planeten. Det nyeste skøn lægger den i det område, Rubin-observatoriet måler først (Siraj m.fl., via Wikipedia), så Rubin ventes at afgøre meget. **Ret sikker.** **Navnet:** "Planet 9" er forskernes navn. "Planet X" bruges også om gamle forudsigelser og om nettets dommedagsplanet.
- **Neutrinoens masse:** Neutrinoer har masse (Nobelpris 2015), men ingen ved hvor meget: under 0,45 eV (KATRIN, Science 388: 180, 2025, arXiv:2406.13516), altså mindst en million gange lettere end elektronen (511.000 eV). **Sikker.**

## Fælder (de nye står også i [fakta-faelder.md](erfaringer/fakta-faelder.md))
1. "Mørkt stof og mørk energi er to sider af samme sag." To forskellige ting: Mørkt stof trækker sammen, mørk energi får Universet til at udvide sig hurtigere.
2. "85 % af Universet er mørkt stof." Ca. 84 % af alt *stof*, men ca. 27 % af alt.
3. "Mørkt stof er sorte huller, antistof eller mørke skyer." Det er usynligt (gennemsigtigt), ikke sort, og antistof ville lyse op, når det mødte stof.
4. "LZ fandt mørkt stof i 2026." Én hændelse, 2,6 sigma.
5. "Singulariteten er et punkt i midten, hvor alt er uendelig tæt." Uendelig betyder, at teorien bryder sammen. I et hul, der ikke drejer, er "midten" nærmere et tidspunkt, man ikke kan undgå (lærebogsviden, **Ret sikker**, ikke slået op). Et hul, der drejer, giver en ring.
6. "Jo mere man kæmper imod, jo hurtigere går det." Forkert (Lewis og Kwan): Raketter kan give lidt mere tid, men aldrig mere end πGM/c³.
7. "Et sort hul på 3 solmasser er 10⁻⁷ K" (Wikipedia "Hawking radiation"). Formlen samme sted giver 2 × 10⁻⁸ K, og 6 × 10⁻⁸ K for én solmasse. Regn selv.
8. "Hawking-stråling er målt" og "billedet viser det sorte hul". Aldrig målt. Billedet viser skyggen, som er større end horisonten (programmet siger 2,6 gange).
9. "Stof og antistof var lige meget, så alt forsvandt" eller "LHCb løste gåden i 2025". Der var en lille overvægt af stof, og den målte forskel er alt for lille til at forklare den.
10. "Én ud af en milliard" er en størrelsesorden (6 × 10⁻¹⁰ pr. lyspartikel), ikke et præcist tal.
11. "Antistof falder opad" (udelukket af ALPHA-g 2023) og "antistof er noget fra film": Alt, hvad der er lavet, er nogle få nanogram (Wikipedia "Antimatter").
12. "En banan sender en positron ud hvert 75. minut" (populært tal). Kalium-40 giver en positron i 0,001 % af henfaldene (Wikipedia "Potassium-40"). Min udregning med ca. 13 Bq pr. banan: én hver anden time (13 × 0,00001 pr. sekund). Skriv "omkring ti om dagen", eller lad det være.
13. "Planet X er fundet" eller "er modbevist". Ingen af delene.
14. Fælderne om liv står i rummet.md afsnit 5 og begyndelsen.md afsnit 10 ("Cheyava Falls er liv", "Miller lavede liv", "Bennu viser liv i rummet", "Europa Clipper skal finde liv").

## Forslag til, hvordan det bygges (til planen, ikke besluttet)
- Fem kort i Biblioteket, bygget af klodser, der findes (kortet, "Hvorfor?"-kortet og "Se også"). Ingen ny slags klods.
- Hvert kort åbner med ét spørgsmål og en knap ind til stedet i programmet ("Se det selv"). Kommer man fra stedet, står kortet som et "Se også" dér.
- Det, man gør: Brugeren gætter først ("Tror du, vi ved det?") eller sorterer tre-fire udsagn i "målt" og "gæt". Det tjener kernesætningen bedre end mere tekst.
- Nye fagord, højst to pr. kort: singularitet, biospor (findes), mørkt stof, antistof (findes), sigma (kun i "Hvorfor?").

## Tjek igen, før teksterne skrives (det flytter sig)
- LZ's hændelse på 248 keV: Har XENONnT eller LZ selv set flere? Kom Euclids DR1-Foundation 12. november 2026?
- Antallet af exoplaneter, Rosalind Franklin (2028), Tianwen-3, Europa Clipper (april 2030) og Dragonfly. **Slået op 13. november 2026 (G2):** over 6.000 (NASA), Rosalind Franklin 2028, Tianwen-3 opsendes 2028 og hjem 2031, Europa Clipper april 2030 (NASA), Dragonfly tidligst juli 2028 og Titan 2034 (NASA), ELT marts 2029 og JUICE juli 2031 (Wikipedia). Alle uændrede.
- Hyper-Kamiokande (2028), DUNE, LISA (2035) og ELT (marts 2029): Planer rykker ofte.
- QT45 (se ovenfor). Nobelpriserne (2011, 2015, 2020) står kun efter Wikipedia og hukommelsen.

## Spørgsmål til jer (min anbefaling først)
**Jeres svar (12. november 2026):** 1: **A**, de fem fra prompten, og mørk energi som nr. 6 bagefter. 2: **A**, "Videnskaben er ikke færdig. Jeg kan nævne en gåde, ingen har løst, og sige, hvordan forskerne prøver at løse den." 3: De tre vigtigste domæner åbnes (`home.cern`, `pdg.lbl.gov` og `pmc.ncbi.nlm.nih.gov`). Spørgsmål 4 (navnet Planet 9) er ikke besvaret.

1. **Hvilke fem?** A (mit råd): de fem fra prompten, og mørk energi som nr. 6 bagefter. B: mørk energi i stedet for mørkt stof nu, fordi den har et sted i programmet i dag. C: seks kort fra start.
2. **Kernesætningen:** A (mit råd): "Videnskaben er ikke færdig. Jeg kan nævne en gåde, ingen har løst, og sige, hvordan forskerne prøver at løse den." B: den om forskellen på målt og gæt.
3. **Domæner:** Skal `home.cern`, `pdg.lbl.gov`, `pmc.ncbi.nlm.nih.gov`, `www.ligo.caltech.edu`, `eventhorizontelescope.org`, `rubinobservatory.org` og `www.cosmos.esa.int` åbnes, før teksterne skrives? Mit råd: ja til de tre første (CERN's egne tal, partikelfysikkens opslagsværk og ALPHA-g's artikel). Resten er dækket af arXiv.
4. **Navnet:** "Planet 9" i stedet for "Planet X" i planerne (se Reserven)?
