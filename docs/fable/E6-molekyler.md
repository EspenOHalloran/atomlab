# E6: Fables tjek af drejebogen til Molekyler

*Skrevet 14. november 2026 af Fable 5.2 (høj effort) efter [prompt-fable-molekyler.md](../prompt-fable-molekyler.md). Tjekker Opus' udkast [drejebog-molekyler.md](../drejebog-molekyler.md). Læst: skabelonen, Retningen, fælderne, afsnit 1, 2, 3, 6 og 7 i faktagrundlaget, "M1 i dag" og "M2 i dag", teksterne i `js/molekyler.js`, `js/molekyler-byg.js`, `js/data/hvorfor.js` og Ordbogen. Jeg har ikke kørt programmet denne gang. Opus skriver sine noter i `E6-molekyler-noter.md`. Denne fil rettes ikke.*

## 1. Det vigtigste først
- **Trin 1-2 kan bygges næsten, som de står. Trin 3-5 kan ikke.** Kernesætningen holder.
- **Ret først trin 3-4:** Den omvendte rækkefølge findes i laboratoriet for at vise regnskabet. I forløbet er måleren skjult, så grunden er væk, og tilbage står to sætninger om "kostede" og "betaler", som barnet ikke kan se noget af. "Ærligt talt" er også skjult, så rettelsen kommer aldrig. **Vis den rigtige rækkefølge i stedet:** Træk natrium hen til chlor (samme greb som trin 1), elektronen hopper, og ionerne suser sammen. Regnskabet bliver vej 3.
- **Tre fejl mod skabelonen:** Ordet "ion" bliver aldrig forklaret i en sætning. "Deler alligevel" er ikke et rigtigt gæt, når spørgsmålet lige har sagt "deler ikke". Trin 4 og 5 er begge "tryk på en knap og se på" (regel 4).
- **To steder går barnet i stå:** Linjen efter gættet siger kun "Prøv det!" og ikke, hvad hænderne skal gøre. Og sætter man to H sammen i trin 2, mangler der et til vandet.

## 2. Kernesætningen
Den holder. Den er lidt lang (36 ord), men det egentlige problem er den korte udgave til "Det så du": Den skærer netop det ærlige væk, nemlig at det er plus og minus, der holder salt sammen, ikke selve det at give. Forslag (26 ord, vis det hele til sidst):

> **"Atomer hænger sammen ved at dele eller give elektroner. I vand deler de. I salt har det ene givet, så plus og minus trækker i hinanden."**

- "Deres yderste" kan undværes i sætningen (barnet kan sige den uden). Scenen viser det.
- **Metaller** behøver ikke at stå der. Programmet siger selv, at natriumatomer "deler" elektronerne (Na + Na), så "dele eller give" er ærligt nok. Én linje i "Ærligt talt" i laboratoriet: "Deler rigtig mange atomer, bliver det ikke et molekyle, men fx et metal eller en diamant."

## 3. Trinene
**Mit forslag: fire trin og "Det så du"** (ca. 3-4 minutter). Trin 1-2 i "Del elektroner", trin 3-4 i "Giv elektroner".

| Trin | Spørg | Gæt | Gør | Så | Ord |
|---|---|---|---|---|---|
| 1 | To hydrogenatomer har hver én elektron. Hvad sker der, når de mødes? | *De skubber hinanden væk* / *De hænger sammen* | Træk det ene hen til det andet | De deler deres to elektroner. Begge kerner trækker i parret, og det holder dem sammen. Det er et molekyle: H₂. | molekyle |
| 2 | Oxygen har to elektroner uden partner. Hvor mange hydrogen kan det holde på? | *Én* / *To* / *Tre* | Sæt hydrogen på oxygen | To. Nu har alle elektroner en partner. Det er vand, H₂O. Se, det er bøjet. | – |
| 3 | Chlor trækker meget hårdere i elektroner end natrium. Hvad sker der, når de mødes? | *De deler* / *Chlor tager en elektron* | Træk natrium hen til chlor | Chlor tog elektronen til sig. Nu er natrium plus og chlor minus, og plus og minus trækker i hinanden. | – |
| 4 | Atomer med ladning hedder ioner. Hvad sker der, når mange ioner mødes? | *De sætter sig to og to* / *De lægger sig i ét stort mønster* | **Byg krystallen** (knappen i linjen) | Ikke to og to. Hver ion får seks naboer af den anden slags. Det er en krystal: køkkensalt. | ion, krystal |
| 5 | **Det så du:** kernesætningen | – | Vælg en af tre veje | – | – |

**Hvad jeg har ændret, og hvorfor:**
- **Trin 1, Så:** "Begge kerner trækker i parret" i stedet for "Parret holder dem sammen". Det er den rigtige grund, den står allerede i kortet `bygBinder`, og den bygger på "plus trækker i minus" fra "Dit første atom". Så er det samme kraft i trin 1 og trin 3. **"Elektronpar" udgår som fagord** (barnet kan sige kernesætningen uden). "Par" er et almindeligt ord.
- **Trin 2:** "Tre" i stedet for "Fire". Der står tre H i scenen, og prøvens spørgsmål 2 handler om tre. Med "Fire" kan gættet ikke prøves. "Partner" i stedet for "makker", fordi laboratoriet siger "uden partner" ca. ti steder (knappen "Hvorfor uden partner?"). Vælg ét ord. Det billigste er "partner".
- **Trin 3 (før trin 3 og 4):** Samme greb som i trin 1, men et andet udfald. Det er den klareste måde at vise "dele eller give" på: Barnet gør det samme to gange og ser forskellen. Scenen: Når atomerne er tæt nok på, hopper elektronen med sit lysspor (animationen findes: `startHarpun`, tilstanden `nærmer`), Na⁺ krymper, Cl⁻ vokser, og de suser sammen. Hoppet skal gå langsomt nok til at blive set. Spørgsmålet giver en ærlig grund uden "fuld skal": Chlor trækker hårdere (elektronegativitet 3,16 mod 0,93, uden at ordet nævnes).
- **Trin 4 (før trin 5):** Gættet rammer den almindeligste misforståelse (salt som små par, fælde 2 i faktagrundlaget), og efter trin 3 ligger der netop ét par i scenen, så gættet er naturligt. Krystallen er forløbets ene "se på"-animation, og nu har den et gæt.
- **Linjen efter gættet siger, hvad man gør:** trin 1 "Prøv det: Træk det ene atom hen til det andet." Trin 2: "Prøv det: Træk hydrogen hen til oxygen." Trin 3: "Prøv det: Træk natrium hen til chlor." Trin 4: "Prøv det!" (knappen står der).
- **Vej 3 hedder** "Hvorfor hopper elektronen først, når de er tæt på?" og åbner "Giv elektroner" med måleren. Dér trækker man selv elektronen over, mens atomerne er langt fra hinanden, og ser, at det koster. Laboratoriets omvendte rækkefølge bliver altså forsøget, der svarer på spørgsmålet. Det er det, jeg mente med "energien i lag 2" i eftersynet.

**Hvis det er for dyrt at trække et atom i "Giv elektroner"** (i dag kan kun elektronen trækkes, `js/molekyler.js:251`. Mit skøn er en lille til mellemstor ændring, men jeg har ikke prøvet): Behold udkastets rækkefølge, men
1. Trin 3 Spørg: "Hvad sker der, hvis natrium giver sin yderste elektron til chlor?" Gæt: *Ingenting* / *De bliver ladede*. Så: "Nu mangler natrium en elektron og er plus. Chlor har en ekstra og er minus. Ladede atomer hedder ioner."
2. Fjern "kostede" og "betaler" fra trin 3 og 4, eller vis målerens bjælke uden tal (lidt i rødt, så langt i grønt). Uden bjælken er de to sætninger kun påstande.
3. "Det så du" får linjen "Vi byttede om på rækkefølgen: I virkeligheden hopper elektronen først, når atomerne er tæt på. Se harpunen" som vej 3 (som "Vi sprang et led over" i Liv).
4. Trin 5 får gættet fra mit trin 4.

## 4. Fakta (kun det, der ikke holder)
- **"Natrium og chlor deler ikke" er for skarpt,** og laboratoriet siger ikke resten i dag (linjen "Ingen binding er helt ionbinding eller helt delt" fra faktagrundlaget står ikke i programmet). Wikipedia "Ionic bonding": rent ionisk binding findes ikke, alle ionforbindelser deler lidt. NaCl-parret er groft 80 % ionisk (8,97 D mod 11,3 D, faktagrundlaget afsnit 2). Skriv "tog elektronen til sig", og sæt linjen i "Ærligt talt" i "Giv elektroner".
- **"Det kostede faktisk lidt":** Tallene passer (1,53 eV mod ca. 5,8 eV, OpenStax University Physics 3, §9.1), men 1,53 eV er ikke lidt. Det er en tredjedel af bindingen i H₂ (4,52 eV). Skriv "noget", hvis sætningen bliver.
- **Rækkefølgen** er ikke i orden, når "Ærligt talt" er skjult under forløbet (se afsnit 1).
- **Harpunens afstand er for sikker i laboratoriets tekst** ("hopper elektronen, allerede når atomerne er ca. 9,4 Å fra hinanden"). 9,4 Å er den *største* afstand, hvor hoppet *kan* betale sig (Wikipedia "Harpoon reaction", efter Atkins: "the largest separation at which charge transfer can take place on energetic grounds"). Skriv "kan hoppe, når de er tættere end ca. 9 Å". Fra min hukommelse, ikke slået op: Netop for Na + Cl er krydset så langt ude, at elektronen ofte ikke når at hoppe dér i et hurtigt møde, og de klassiske forsøg med harpunen var et alkaliatom mod et halogen*molekyle* (fx K + Br₂). Den kilde, faktagrundlaget henviser til (arXiv 1510.07687), handler om LiH og LiF, ikke NaCl.
- **"Natrium holder løst, og chlor trækker hårdt"** (Ordbogens "Ion") er sandt sammenlignet med andre grundstoffer, men ikke mod hinanden: Natrium holder på elektronen med 5,14 eV, og chlor trækker kun med 3,61 eV (NIST, faktagrundlaget afsnit 7). Langt fra hinanden vinder natrium. Det er først tæt på, i en binding, at chlor trækker hårdest. Derfor står "når de mødes" i mit trin 3. Sætningen må ikke bruges som grund til, at elektronen flytter af sig selv på afstand.
- **"Saltkorn er terninger"** passer for fint salt, ikke for alt salt. Wikipedia "Salt": "Salt crystals are translucent and cubic in shape". "Halite": mest terninger, men også kornet og trappeformede krystaller, når de vokser hurtigt. Flagesalt og knust groft salt er ikke terninger (fra min hukommelse). Skriv "Kornene i fint salt er små terninger. Kig med en lup." Så kan barnet selv se det.
- **"Når de deler, bliver de til molekyler"** gælder ikke altid (diamant, metaller). Linjen i afsnit 2 dækker det.
- **Til "For nørder", ikke til forløbet** (fra min hukommelse, lærebogsstof): To hydrogenatomer binder kun, når deres elektroner har modsat spin. I tre ud af fire møder skubber de hinanden væk. Gættet "De skubber hinanden væk" er altså ikke dumt.
- **Ordet krystal:** Forklaringen må ikke kun handle om ioner. Sukker, is og diamant er også krystaller. Forslag: "Et fast stof, hvor atomerne, ionerne eller molekylerne ligger i et mønster, der gentager sig. Salt, sukker, is og diamant er krystaller."

## 5. Opus' fire spørgsmål
1. **Hvor forløbet bor:** Enig, men som **to PR'er**: først flytningen uden nyt indhold (testene grønne), så forløbet. Ellers er der to ting, der kan gå galt på én gang.
2. **Knaldgassen** som vej 2: enig.
3. **"Se, det er bøjet":** Enig på én betingelse: Scenen drejer vandet, så man ser vinklen forfra, når sætningen står der. Ellers peger sætningen på noget, man ikke kan se, og så skal den ud.
4. **Krystal** som eget ord: enig, med forklaringen i afsnit 4.

## 6. Det, der mangler
- **H på H i trin 2 er en blindgyde:** Binder barnet to af de tre H sammen, er der kun ét tilbage til oxygen. I trin 2 må H kun kunne binde til O. Et H, der slippes på et andet H, skubbes væk med vinket "Prøv at sætte det på oxygen".
- **Det tredje H bliver stående efter Så,** så alle kan prøve det (prøvens spørgsmål 2 spørger til det, men kun de, der gættede "Tre", prøver det af sig selv). Linjen siger forløbets egen sætning ("Oxygen har ikke flere elektroner uden partner"), ikke laboratoriets (`hvorforFuld` siger "bindinger" og "frie par", to ord uden for budgettet). Den almindelige besked skal være skjult imens, så der ikke er to steder at læse.
- **Det første træk:** I "Dit første atom" var alle handlinger knapper. Her er den første handling et træk i 3D. Vis en lille hånd, der trækker, efter ca. 8 sekunder i trin 1, ikke først "Vis mig" efter 20.
- **To slags tegning:** I trin 1-2 er et atom en kugle med prikker, i trin 3-4 en kerne med ringe. Byg ikke noget for det nu, men spørg ved prøven: "Var det den samme slags atomer hele vejen?"
- **Forløbet bygger på "Dit første atom"** (plus, minus og at de trækker i hinanden). Har barnet ikke ✓ dér, så vis ét link ved starten: "Tag 'Dit første atom' først".
- **Kortet til vej 3** (`bytteKoster` og `bytteBetaler`) har eV i selve svaret, og Retningen lægger eV i "For nørder". Skriv svaret med forhold: "Chlor giver kun godt to tredjedele tilbage af det, det kostede at rive elektronen løs" (3,61 af 5,14) og "tiltrækningen giver næsten fire gange så meget, som der manglede" (5,8 mod 1,5). Tallene i eV flytter til nørd-teksten.
- **Prøvens spørgsmål 1** uden "yderste": "Hvad gør atomer med deres elektroner, når de hænger sammen?"
- **Ordene** bliver tre: molekyle, ion og krystal.

## Det, jeg er mindst sikker på
- Om det er let nok at trække natrium hen til chlor med en finger, og om hoppet bliver set. Det afgør prøven, ikke jeg.
- Prisen for at kunne trække et atom i "Giv elektroner" (ikke målt).
- Det, der står som "fra min hukommelse" i afsnit 4.
