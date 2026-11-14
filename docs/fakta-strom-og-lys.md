# Faktagrundlag: Strøm og magneter og Lys

*Emne 3 i [prompt-faktagrundlag.md](prompt-faktagrundlag.md). Lavet 12. november 2026 af Opus (effort høj), spor Småting. Kun dokumenter, ingen kode eller tekster til programmet endnu. Før en tekst kommer med, skal den stadig gennem `/faktatjek` mod denne fil.*

**Sikkerhed:** **S** = sikker (åbnet i en primær eller officiel kilde, eller en fysisk lov fra lærebogen), **RS** = ret sikker (en god sekundær kilde, fx Wikipedia med henvisning), **U** = usikker (ikke åbnet, kun et søgeresultat, eller kilderne er uenige). "Åbnet" betyder, at jeg selv har læst teksten i kilden i dag. Wikipedia er læst som wikitekst (`action=raw`).

**Det, repoet allerede har:** Ørsted (1820, nålen drejer ca. 45°, myten om tilfældet), Rømer (lysets fart), Bohr (skallerne) og Einstein (lyskvanter) står i [fakta-videnskabsfolk.md](fakta-videnskabsfolk.md) og gentages ikke her. Batteriet har spænding og strøm (LiPo-cellen, 4,2 V og 3,0 V), men ingen magnet. Flammefarverne for Li og K står i `js/data/grundstoflag.js` og `js/data/kategorier.js` ("lilla flamme", "dybrød"), og de passer.

**Adgang:** retsinformation.dk, uvm.dk og emu.dk (de to sidste åbnet i miljøet "Default" i dag med jeres go), NIST's spektraldatabase (physics.nist.gov), archive.org og Wikipedia virkede.

---

## Kort fortalt
- **Strøm laver magnetisme** (Ørsted 1820), og **en magnet, der bevæger sig, laver strøm** (Faraday 1831). Det er grunden til motorer, dynamoer, vindmøller og transformere.
- **Lys er en elektromagnetisk bølge** (Maxwell 1865). Radiobølger, mikrobølger, infrarødt, synligt lys, ultraviolet, røntgen og gammastråling er samme slags bølge med forskellig bølgelængde.
- **Hvert grundstof sender sine egne farver ud** (spektrallinjer, Kirchhoff og Bunsen 1859-1861). Derfor ved vi, hvad Solen og stjernerne er lavet af, selvom Comte i 1835 skrev, at det aldrig ville kunne lade sig gøre.
- **Fælles Mål:** Den bindende bekendtgørelse siger intet om strøm og lys. Men både den gamle vejledning og udkastet til den nye fagplan (gælder fra skoleåret 2027/28) har elektricitet, magnetisme og bølger. "Lys", "stråling" og "spektrallinjer" står slet ikke i udkastet (afsnit 1).

## Kernesætning (forslag, I vælger)
Fable foreslog rækkefølgen "Strøm og magneter, så Lys, så Kvantefysik". Jeg foreslår derfor **to dele med hver sin kernesætning**:
1. **(Anbefalet) Strøm og magneter:** "Efter fem minutter kan brugeren sige: Strøm laver magnetisme, og en magnet, der bevæger sig, laver strøm. Sådan laver vindmøllerne vores strøm."
2. **(Anbefalet) Lys og farver:** "Efter fem minutter kan brugeren sige: Hvert grundstof sender sine egne farver ud, som en stregkode. Derfor kan vi se, hvad Solen er lavet af, uden at rejse derhen."
3. Én samlet del: "Strøm, magneter og lys er den samme kraft. Når den svinger, bliver den til lys og radiobølger." Rigtigt, men for meget for fem minutter. Passer bedre som sidste trin eller "For nørder".

Nye fagord i forslag 1: *magnetfelt* og *induktion* (kan undgås: "en magnet, der bevæger sig"). I forslag 2: *spektrum* og *spektrallinje*.

---

## 1. Fælles Mål for fysik/kemi (tjekket, Fable skrev efter hukommelsen)

**Det bindende i dag:** [BEK nr. 1715 af 30/12/2024](https://www.retsinformation.dk/eli/lta/2024/1715) (Fælles Mål, i kraft 1. januar 2025, retsinformation viser den som gældende med en ændring 29. september 2026). Den har for fysik/kemi kun formålet (§ 16) og fire kompetencemål efter 9. klasse (bilag 15): "Eleven kan designe, gennemføre og evaluere undersøgelser i fysik/kemi", "… anvende og vurdere modeller i fysik/kemi", "… perspektivere fysik/kemi til omverdenen og relatere indholdet i faget til udvikling af naturvidenskabelig erkendelse" og "… kommunikere om naturfaglige forhold med fysik/kemi". **Intet om strøm, magneter, lys eller bølger.** Formålet nævner kun "grundlæggende fysiske og kemiske forhold i natur og teknologi". **S** (åbnet).

**Før 1. januar 2025:** [BEK nr. 699 af 7/6/2023](https://www.retsinformation.dk/eli/lta/2023/699) (ophævet af BEK 1715) havde også seks færdigheds- og vidensområder, bl.a. **"Partikler, bølger og stråling"** og **"Energiomsætning"**. **S** (åbnet). De detaljerede mål stod i faghæftet på emu.dk ([Fælles Mål for fysik/kemi](https://emu.dk/sites/default/files/2020-09/GSK_F%C3%A6llesM%C3%A5l_Fysikkemi.pdf)) og har ikke været bindende siden 2017 (emu.dk: "vejledende færdigheds- og vidensområder", "til inspiration"). Dem, der passer til dette emne (ordret, **S**):
- "Eleven kan undersøge lyd, lys og farver" og "Eleven har viden om bølgetyper, lyd- og lysfænomener".
- "Eleven kan eksperimentere med energiomsætning hvori elektricitet og magnetisme indgår" og "Eleven har viden om elektriske og magnetiske fænomener".
- "Eleven kan med modeller beskrive elektriske kredsløb".
- "Eleven kan beskrive anvendelsen af lyd og lys i medicinsk og teknologisk sammenhæng" og "Eleven har viden om udbredelse af lyd og lys".
- "Eleven kan undersøge typer af stråling" og "Eleven har viden om stråling".

**Det, der kommer:** [Andet udkast til fagplan for fysik/kemi, juni 2026](https://uvm.dk/media/d1rpt0tp/260624-fagplan-for-fysikkemi-juni-2026.pdf) (12 sider). Ifølge uvm.dk sendes fagplanerne i høring "forventeligt i … foråret 2027" og "træder i kraft i skoleåret 2027/2028". Fysik/kemi får ét forløb for 7.-9. klasse og fem indholdsområder. Det, der passer til dette emne (ordret, **S**):
- **Energi og energiomdannelse:** "elproduktion, herunder undersøgelser og modellering af sammenhænge mellem magnetisme og elektricitet", "spænding, strømstyrke, modstand og effekts betydning for elektriske kredsløb", "simpel programmering til elektronisk styring" og "bølgetyper, herunder undersøgelse af amplitude, bølgelængder og frekvens". Mål: "Eleverne generaliserer bølgers egenskaber. De planlægger og udfører undersøgelser af bølger og transport af energi." Teksten nævner også "energi som bølgefænomen".
- **Universets bestanddele og sammenhænge:** "kræfter og bevægelser i universet, herunder tyngdekraft, elektromagnetiske kræfter og teorier om galakser", "kernekræfter og atomets opbygning" og "Eleverne undersøger atomets opbygning gennem digitale simuleringer".
- **Stof og stofegenskaber:** "kemiske analyser og reaktioner" og "materialers egenskaber herunder, ledeevne, brændbarhed og nedbrydelighed".

**Vurdering:**
- Fable havde ret i, at elektricitet, magnetisme og bølger er med, både før og i udkastet. Ørsteds og Faradays forsøg passer præcis til "sammenhænge mellem magnetisme og elektricitet".
- Fable havde **ikke** ret i, at "bølger og stråling fylder meget": I udkastet står ordene "lys" og "stråling" slet ikke (søgt i hele teksten). Området "Partikler, bølger og stråling" er væk, og bølger er nu en del af "Energi og energiomdannelse". Spektrallinjer, flammefarver og radiobølger nævnes ikke ved navn. Flammeprøven kan kaldes "kemisk analyse" (vores tolkning).
- "Digitale simuleringer" af atomet står ordret i udkastet. Det er et godt argument for AtomLab i en skoletime.
- Udkastet er ikke vedtaget. Slå det op igen, før der står "Fælles Mål" i programmet eller i "Før vi deler".

---

## 2. Strøm og spænding

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Strøm er ladning, der flytter sig. 1 ampere er ca. **6,24 milliarder milliarder** (6,24 · 10¹⁸) elektroner i sekundet. Elektronens ladning er præcis 1,602176634 · 10⁻¹⁹ C siden 2019 | Wikipedia "Ampere" ("approximately 6.241509074 × 10¹⁸ elementary charges moving in a second"), regnet efter | S |
| **Spænding** er energi pr. ladning: 1 volt = 1 joule pr. coulomb. Det er "skubbet" i strømmen. (En elektronvolt er den energi, én elektron får af 1 volt, står allerede i Ordbogen) | Wikipedia "Volt" ("one joule of energy per coulomb of charge") | S |
| **Ohms lov:** spænding = strøm × modstand. Georg Ohm udgav den i **1827** (*Die galvanische Kette, mathematisch bearbeitet*) | Wikipedia "Ohm's law" | RS |
| Stikkontakten i Danmark: **230 V, 50 Hz** (vekselstrøm, der skifter retning 100 gange i sekundet) | Wikipedia "Mains electricity by country" (Danmark: 230/400 V, 50 Hz, IEC 60038) | RS |
| Et almindeligt AA-batteri er ca. 1,5 V. En LiPo-celle er 3,0-4,2 V (Batteriet) | Almindelig viden, Batteriets egne tal | RS |
| **Elektronerne kravler.** I en kobbertråd på 2 mm med 1 A flytter elektronerne sig i gennemsnit ca. **0,02 mm i sekundet** (ca. 8 cm i timen). Signalet (og energien) bevæger sig med **50-99 % af lysets fart**. Derfor tænder lampen med det samme | Wikipedia "Drift velocity" (regneeksemplet med 1 A og 2 mm) og "Speed of electricity" ("typically at 50%–99% of the speed of light"). Regnet efter: 1/(8,5·10²⁸ · 3,14·10⁻⁶ m² · 1,6·10⁻¹⁹ C) = 2,3·10⁻⁵ m/s | S (regnet), RS (50-99 %) |
| Uden strøm farer elektronerne rundt i alle retninger (ca. 1.570 km/s), men lige mange hver vej | Wikipedia "Drift velocity" ("Fermi flow velocity … around 1570 km/s") | RS |
| **Strømmens retning er en aftale:** "fra plus til minus". Elektronerne bevæger sig den anden vej. Det var Benjamin Franklin, der kaldte de to slags ladning plus og minus (1747), før nogen kendte elektronen | Wikipedia "Electric current" (conventional current) og "Benjamin Franklin" ("the first to label them as positive and negative") | RS |
| **Farligt:** Vekselstrøm på ca. **30 mA** gennem brystet i over et sekund kan få hjertet til at flimre. Med jævnstrøm skal der mere til. Ca. 1 mA kan mærkes | Wikipedia "Electrical injury" (med henvisning til European Heart Journal 2018) | RS |
| Vindmøller lavede **ca. 59 %** af Danmarks el i 2024 | Wikipedia "Wind power in Denmark" (Our World in Data) | RS (slå op igen med Energistyrelsen, før det skrives) |

## 3. Magneter og magnetfelter

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Jordens magnetfelt er ca. **30.000-60.000 nT** (30-60 µT) ved overfladen: svagest over Brasilien, stærkest over Sibirien (IGRF 2019). En stærk køleskabsmagnet er ca. **10.000 µT** (ca. 200 gange stærkere) | Wikipedia "Earth's magnetic field" (IGRF-13 og National High Magnetic Field Laboratory) | RS |
| En neodymmagnet har typisk ca. **1,3 T** inde i magneten | Wikipedia "Neodymium magnet" ("remanent magnetization of typically 1.3 teslas") | RS |
| **Kompassets nordpol** peger mod nord. Derfor er Jordens magnetiske pol i nord fysisk en **sydpol** (modsatte poler tiltrækker hinanden) | Wikipedia "North magnetic pole" | S |
| Den magnetiske nordpol flytter sig: ca. 1.100 km i det 20. århundrede og ca. **55 km om året** i 2019, fra Canada mod Sibirien | Wikipedia "North magnetic pole" | RS |
| Kun **jern, kobolt og nikkel** (og gadolinium lige under 20 °C) er stærkt magnetiske ved stuetemperatur. Aluminium og kobber hænger ikke fast på en magnet | Wikipedia "Curie temperature" (tabellen: Fe 1043 K, Gd 293 K) og "Ferromagnetism" | RS |
| Jern mister sin magnetisme ved **770 °C** (Curie-temperaturen, 1043 K) | Wikipedia "Curie temperature" | RS |
| Skærer man en magnet over, får man **to magneter** med hver sin nord- og sydpol. En pol alene (en magnetisk monopol) er aldrig fundet | Wikipedia "Magnetic monopole" | S |
| **Elektromagneten** (en spole om jern): William Sturgeon, **1824** | Wikipedia "Electromagnet" | RS |
| Danmarks første satellit hed **Ørsted** og blev opsendt **23. februar 1999** for at måle Jordens magnetfelt. Energiselskabet DONG Energy skiftede navn til Ørsted **6. november 2017**. Enheden oersted (Oe) er også opkaldt efter ham | Wikipedia "Ørsted (satellite)", "Ørsted (company)" og "Oersted" | RS |

## 4. Ørsted og bagefter (tillæg til fakta-videnskabsfolk.md)

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Nålen drejer, fordi strømmen laver et magnetfelt i **ringe rundt om tråden**. Vender man strømmen, drejer nålen den anden vej (højrehåndsreglen: tommelfingeren med strømmen, fingrene viser feltet) | Lærebogsfysik (Ampères lov) | S |
| Opdagelsen blev kendt i Frankrig i **september 1820**, da Arago viste den for Videnskabsakademiet. Ampère gik i gang med det samme | Wikipedia "André-Marie Ampère" | RS |
| **Gian Domenico Romagnosi** skrev allerede i **1802** i to italienske aviser, at en voltasøjle påvirkede et kompas. Det blev ikke kendt, og det er omstridt, om han så det samme som Ørsted | Wikipedia "Gian Domenico Romagnosi" og "Electromagnetism" | RS |
| **Faraday** fik i **1821** strøm og en magnet til at dreje rundt om hinanden: den første elmotor (en "homopolær motor") | Wikipedia "Michael Faraday" | RS |
| Danskeren **Ludvig Lorenz** viste i **1867**, samtidig med Maxwell, at lys kan beskrives som elektromagnetiske bølger (Lorenz-betingelsen er opkaldt efter ham) | Wikipedia "Ludvig Lorenz" | RS |

## 5. Induktion: en magnet, der bevæger sig, laver strøm

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| **Michael Faraday** opdagede induktion. Hans første forsøg var **29. august 1831** (to spoler om en jernring). Joseph Henry fandt det samme uafhængigt i 1832 | Wikipedia "Electromagnetic induction" (Faradays notesbog) | RS |
| Der kommer **kun strøm, mens magnetfeltet ændrer sig**. En magnet, der ligger stille i en spole, giver ingen strøm. Hurtigere bevægelse og flere vindinger giver mere spænding (Faradays lov) | Lærebogsfysik | S |
| Strømmen løber altid sådan, at den **modarbejder** ændringen (Lenz' lov, **1834**). Derfor er det tungere at dreje en dynamo, når lampen er tændt | Wikipedia "Lenz's law" | S |
| Generatorer i kraftværker og **vindmøller**, cykeldynamoer, **transformere**, induktionskomfurer og trådløs opladning bygger alle på induktion | Wikipedia "Electric generator", "Transformer" og "Induction cooking" | RS |

## 6. Lys som bølge og spektret

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| **Maxwell, 1865:** "light is an electromagnetic disturbance propagated through the field according to electromagnetic laws" (*A Dynamical Theory of the Electromagnetic Field*, læst i Royal Society 8. december 1864) | Wikipedia "A Dynamical Theory …" (citatet). Originalen er på archive.org (`dynamicaltheoryo00maxw`), ikke åbnet | RS (citatet), S (året) |
| Lysets fart er **præcis 299.792.458 m/s**, fordi meteren siden **1983** er defineret ud fra den | Wikipedia "Speed of light" | S |
| Synligt lys er **ca. 380-750 nm** (milliontedele af en millimeter). Grænserne er flydende: Nogle skriver 400-700, og øjet kan under særlige forhold se fra ca. 310 til 1.050 nm | Wikipedia "Visible spectrum" | RS |
| Et lysglimt (foton) i synligt lys har ca. **1,7-3,3 eV** (rødt ved 700 nm: 1,77 eV, violet ved 380 nm: 3,26 eV) | Regnet: E = 1239,84 eV·nm / λ | S |
| **Newton** delte først spektret i seks farver og lagde **indigo** til, fordi syv passede med tonerne i musikken. Han udgav det i *Opticks* (**1704**) | Wikipedia "Visible spectrum" og "Opticks" | RS |
| Øjet har tre slags tappe, mest følsomme ved ca. **420, 530 og 560 nm** (blå, grøn og gulgrøn/rød). Skærme blander derfor rød, grøn og blå | Wikipedia "Cone cell" | RS |
| **Magenta** findes ikke i regnbuen: Det er rødt og blåt lys blandet | Wikipedia "Magenta" ("extra-spectral color") | RS |
| **Young** beskrev forsøget med to spalter i **1803**. Det er ikke klart, hvilke forsøg han selv lavede | Wikipedia "Young's interference experiment" | RS |
| **Herschel** fandt infrarødt i **1800** med et termometer bag et prisme. **Ritter** fandt ultraviolet i **februar 1801** med sølvklorid | Wikipedia "Infrared" og "Ultraviolet" | RS |
| **Himlen er blå**, fordi luften spreder blåt lys meget mere end rødt (Rayleigh-spredning, ca. 1/bølgelængden⁴) | Wikipedia "Rayleigh scattering" og "Diffuse sky radiation" | S |
| **Lene Vestergaard Hau** (født i Vejle) bremsede i **1999** lys ned til **ca. 17 m/s** i en ultrakold gas og stoppede det helt i 2001 | Wikipedia "Lene Hau" | RS |

## 7. Spektrallinjer og flammefarver

**Hvordan det virker:** Varme (eller strøm) giver atomets yderste elektron mere energi. Når den falder tilbage, sendes et lysglimt ud med præcis forskellen i energi. Hvert grundstof har sine egne trin og derfor sine egne farver (linjer). Det samme atom kan også *opsuge* præcis de farver, så de mangler i lyset bagved (mørke linjer).

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| **Wollaston** så de første mørke linjer i sollyset i **1802**. **Fraunhofer** fandt dem igen i **1814** og målte over 570 | Wikipedia "Fraunhofer lines" | RS |
| **Kirchhoff** viste i **1859**, at Solen indeholder **natrium**. Kirchhoff og Bunsen fandt **cæsium (1860)** og **rubidium (1861)** ved deres linjer. Cæsium er opkaldt efter de blå linjer (latin *caesius*, blågrå), rubidium efter de dybrøde (*rubidus*) | Wikipedia "Gustav Kirchhoff", "Caesium" og "Rubidium" | RS |
| **Comte, 1835:** "nous ne saurions jamais étudier par aucun moyen leur composition chimique" (om stjernerne). Vores oversættelse: "vi vil aldrig på nogen måde kunne undersøge deres kemiske sammensætning". 24 år senere fandt Kirchhoff natrium i Solen | Comte, *Cours de philosophie positive*, bind 2, 19. lektion. Åbnet i 5. udgave 1892 ("identique à la première"), archive.org `coursdephilosoph02comt` | S (ordlyden), RS (året 1835) |
| **Helium** blev set som en ukendt **lys gul linje** i lyset fra Solens kant (protuberanserne) under formørkelsen **18. august 1868** (Rayet, Haig, Janssen og andre), *ikke* som en mørk linje i sollyset (rettet 14. november 2026 efter Fable E11). Den mangler blandt de mørke linjer i almindeligt sollys. **Lockyer** foreslog et nyt grundstof og opkaldte det efter Solen. På Jorden blev det fundet i **1895** (Ramsay, Cleve og Langlet). Linjen ligger ved **587,56 nm** | Wikipedia "Helium"; NIST ASD (He I) | RS (historien), S (linjen) |
| **Hydrogens synlige linjer** (Balmer, **1885**): **656,28 nm** (rød), **486,14** (blågrøn), **434,05** (blå) og **410,17** (violet). De kommer, når elektronen falder til skal 2 fra skal 3, 4, 5 og 6. Bohr forklarede dem i 1913 | NIST ASD (H I, bølgelængder i luft); Wikipedia "Balmer series" | S |
| **Natrium (gul):** to linjer ved **588,995 og 589,592 nm** (D-linjerne). Natrium er så stærk, at den skjuler de andre. Man kigger gennem **koboltblåt glas** for at se fx kalium | NIST ASD (Na I); Wikipedia "Flame test" | S (linjerne), RS (glasset) |
| **Lithium (dybrød):** **670,78 nm**. **Kalium (lilla):** de stærke linjer ligger ved **766,5 og 769,9 nm** (mørkerødt, lige ved grænsen af det synlige) og svagere ved **404,4 og 404,7 nm** (violet). Det svage lilla er blandingen | NIST ASD (Li I, K I) | S (linjerne), RS (blandingen) |
| **Alle de linjer i natrium, lithium og kalium er et skift inden for samme skal** (3s → 3p, 2s → 2p, 4s → 4p), ikke et hop mellem to skaller. Kun hydrogens linjer ovenfor er hop mellem skaller | NIST ASD (konfigurationerne står ved hver linje) | S |
| **Strontium (rød), calcium (orange), barium (grøn) og kobber med chlor (blå)** får mest farven fra **små molekyler** i flammen (SrCl, SrOH, CaCl, BaCl, BaOH og CuCl), ikke fra frie atomer. Blå er den sværeste farve i fyrværkeri | Wikipedia "Pyrotechnic colorant" (tabellen over "molecular bands", med henvisning til *Chemistry of Fireworks*) | RS |
| **Stearinlysets gule lys** er glødende **sod** (små kulstofkorn). Den blå bund kommer fra molekylerne CH og C₂ | Wikipedia "Flame" | RS |

## 8. Radiobølger og resten af spektret

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| **Hertz** lavede og målte radiobølger i **1886-1888** og viste, at de opfører sig som lys. Det bekræftede Maxwell | Wikipedia "Heinrich Hertz" | RS |
| **Marconi** meldte, at et signal (bogstavet S) kom over Atlanten **12. december 1901**. Det blev ikke bekræftet af andre, og det var svært at skelne fra støj | Wikipedia "Guglielmo Marconi" | RS |
| Danskeren **Valdemar Poulsen** lavede **telegrafonen** (den første magnetiske optager, 1898) og **Poulsen-buen**, den første sender med en jævn radiobølge | Wikipedia "Valdemar Poulsen" | RS |
| **Bølgelængder:** FM-radio 87,5-108 MHz → **ca. 3 m**. Mikrobølgeovn 2,45 GHz → **12,2 cm**. Wi-Fi 2,4 GHz → **12,5 cm**, 5 GHz → **6 cm**. Strømmen i stikkontakten (50 Hz) → **6.000 km** | Wikipedia "FM broadcasting" (Europa: 87,5-108) og "Microwave oven"; regnet med λ = c/f | S (regnet) |
| **Mikrobølgeovnen** rammer ikke en særlig "resonans" i vand. Alle polære molekyler drejer med feltet og varmer | Wikipedia "Microwave oven" ("It is a common misconception …") | RS |
| **Hydrogens radiolinje** ved **1420,405751768 MHz (21,1 cm)** blev forudsagt af van de Hulst i 1944 og set af Ewen og Purcell i **1951**. Med den har man kortlagt Mælkevejens spiralarme | Wikipedia "Hydrogen line" | RS |
| **Jansky** meldte i **april 1933**, at der kommer radiobølger fra Mælkevejen (Skytten) | Wikipedia "Karl Guthe Jansky" | RS |
| **Røntgen** fandt røntgenstrålerne **8. november 1895** | Wikipedia "Wilhelm Röntgen" | RS |
| **Ioniserende stråling** (som kan rive elektroner løs) begynder et sted i ultraviolet. Grænsen er ikke skarp: Ofte bruges **10 eV (124 nm)**. Radio, mikrobølger, Wi-Fi og synligt lys er ikke ioniserende | Wikipedia "Ionizing radiation" | RS |
| Ordet **foton** blev gjort kendt af Gilbert Lewis i **1926**. Ideen (lyskvanter) er Einsteins fra 1905 | Wikipedia "Photon" | RS |

---

## 9. Hvad man kan *gøre* i programmet
*Forslag til planen, ikke besluttet. Hver passer til "gør før læs" og "Hvordan ved vi det?" i [retning.md](retning.md), og to-tre af dem kan gøres med hænderne.*

**Del A: Strøm og magneter** (bygger videre på Batteriet)
1. **Ørsteds bord (første handling):** En tråd over en kompasnål. Tænd for strømmen, og nålen drejer. Vend strømmen, og den drejer den anden vej. Træk tråden op, og den drejer mindre. Magnetfeltet kan slås til som ringe om tråden. "Hvordan ved vi det?": Ørsted, 1820, med bogsiden fra [fakta-videnskabsfolk.md](fakta-videnskabsfolk.md).
2. **Byg en elektromagnet:** Vikl tråd om et søm (træk for hver vinding), tænd, og se, hvor mange clips den kan løfte. Flere vindinger og mere strøm løfter flere. Sluk, og de falder.
3. **Dynamoen (induktion):** Skub en magnet ind og ud af en spole med fingeren. Viseren slår kun ud, *mens* magneten bevæger sig, og den anden vej, når den trækkes ud. Drej hurtigere, og pæren lyser stærkere. Til sidst: en vindmølle, der gør det samme. Kobler til Danmarks el.
4. *(Lag 2 eller "For nørder")* **Snegle-elektronerne:** Tænd en lampe for enden af en lang ledning. Lyset tænder med det samme, men én elektron kravler kun ca. 8 cm i timen.

**Del B: Lys og farver** (bygger videre på Værkstedet og Kosmos)
1. **Flammeprøven (første handling):** Drys et salt i flammen (natrium, lithium, kalium, kobber, strontium), og se farven. Kig så gennem et prisme: Farven deler sig i nogle få skarpe linjer.
2. **Stregkoden:** Et ukendt salt brænder. Find grundstoffet ved at sammenligne linjerne. Til sidst: lyset fra Solens kant under formørkelsen. Find hydrogen, og en gul linje, der ikke passer med noget fra Jorden: helium (1868). *(Rettet 14. november 2026: Heliums linje var lys og kom fra Solens kant, ikke en mørk linje i sollyset. De mørke linjer hører til laboratoriet, se [drejebog-lys.md](drejebog-lys.md).)* "Hvordan ved vi det?": Comte, 1835 ("aldrig"), og Kirchhoff, 1859.
3. **Elektronens trin** (Fable foreslår et "Hvorfor?"-kort i Lys i stedet for Værkstedet, se [drejebog-lys.md](drejebog-lys.md) afsnit 6): Byg hydrogen, giv elektronen energi, og se den falde fra skal 3 til 2: rødt lys ved 656 nm. Linker til Bohr og senere Kvantefysik. Brug "trin" eller "energitrin", ikke "skal", om natrium (fælden nedenfor).

**Del C (mulig senere): Bølgerne.** En skyder fra radiobølger til gamma, hvor bølgen bliver kortere, og man ser, hvad den bruges til (FM-radio 3 m, mikrobølgeovn og Wi-Fi ca. 12 cm, synligt lys, røntgen) og en streg ved ca. 10 eV: "herfra kan den rive elektroner løs". Kobler til hydrogens 21-cm-linje i Kosmos og til strålingen i Reaktoren. Passer til udkastets "bølgetyper, herunder … amplitude, bølgelængder og frekvens".

**Links begge veje:** Batteriet → Strøm og magneter (motoren), Værkstedet → flammefarven for et opdaget grundstof, Det periodiske system → cæsium, rubidium og helium ("fundet med lys"), Solen i Solsystemet → spektret, og Biblioteket → Ørsted, Faraday og Kirchhoff.

---

## 10. Fælder (det, der ofte siges forkert)
*De vigtigste står også i [fakta-faelder.md](erfaringer/fakta-faelder.md).*
- **"Elektroner, der hopper mellem skallerne, giver flammefarverne"** (også i Fables eftersyn E1). For natrium, lithium og kalium er det et skift *inden for samme skal* (3s → 3p osv., NIST). Kun hydrogens linjer er hop mellem skaller. Skriv "elektronen hopper op på et højere energitrin og falder tilbage".
- **"Fyrværkeriets farver kommer fra atomerne."** Rød (strontium), grøn (barium) og blå (kobber) kommer mest fra små molekyler (SrCl, SrOH, BaCl, BaOH, CuCl). Natrium og lithium er atomer.
- **"Elektronerne i ledningen farer af sted med lysets fart."** De kravler ca. 0,02 mm/s. Det er signalet og energien, der går hurtigt (50-99 % af lysets fart).
- **"Strømmen løber fra plus til minus, ligesom elektronerne."** Den aftalte retning er plus til minus, men elektronerne går den anden vej.
- **"Kompasset peger mod Jordens magnetiske nordpol, som er en nordpol."** Den er fysisk en sydpol.
- **"Alle metaller er magnetiske."** Kun jern, kobolt og nikkel (og gadolinium, når det er koldt). Kobber og aluminium er ikke.
- **"Ørsted var den første."** Romagnosi skrev om noget lignende i 1802, men det blev ikke kendt. Skriv "Ørsted viste det i 1820, så hele verden fik det at vide". (Fælden om tilfældet står i fakta-videnskabsfolk.md.)
- **"Mikrobølgeovnen rammer vandets resonans."** Nej. Alle polære molekyler varmes, og 2,45 GHz er valgt af andre grunde.
- **"Mobiltelefoner og Wi-Fi sender radioaktiv stråling."** Radiobølger er ikke ioniserende. Ioniserende stråling begynder i ultraviolet (grænsen er ikke skarp, ofte 10 eV).
- **"Det er strømmen, ikke spændingen, der slår ihjel."** Halvt rigtigt: Det er strømmen gennem kroppen, der skader, men spændingen bestemmer, hvor stor den bliver. Skriv "Stikkontakten kan slå ihjel. Et lille batteri kan ikke skubbe strøm nok gennem huden".
- **"Newton fandt syv farver i regnbuen."** Han valgte syv (indigo blev lagt til) for at passe med musikkens toner. Spektret har ingen grænser mellem farverne.
- **"Synligt lys er 400-700 nm."** Grænserne er flydende (ofte 380-750 nm). Sig "ca.".
- **"Young lavede dobbeltspalteforsøget i 1801."** Han beskrev det i 1803, og det er uklart, hvad han selv lavede.
- **"Helium blev opdaget af Janssen i 1868."** Linjen blev set af flere under formørkelsen. Lockyer sagde "nyt grundstof". Fundet på Jorden i 1895.
- **"Hertz sagde: Det er til ingen nytte."** Citatet står kun i anekdotesamlinger og på en universitetsside uden kilde. Brug det ikke som citat.
- **"Marconi sendte det første signal over Atlanten i 1901."** Det blev aldrig bekræftet. Skriv "Marconi meldte, at …".
- **"Comte sagde, vi aldrig ville kende stjernerne."** Han skrev det om deres *kemiske sammensætning*. Brug ordlyden fra originalen (afsnit 7), ikke en engelsk omskrivning.
- **"Cæsium betyder himmelblå."** Latin *caesius* betyder blågrå (OED via Wikipedia). Navnet kommer fra de blå linjer.
- **Ordbogen** (`elektronvolt`, `js/data/ordbog.js`) siger "Synligt lys har ca. 2-3 eV pr. foton". Rødt lys er 1,8 eV. "ca. 2-3 eV" kan stå som afrunding, men "ca. 1,7-3,3 eV" er mere præcist. Ret det, når Ordbogen alligevel åbnes.

---

## 11. Ikke fundet eller skal tjekkes igen
- ~~Hvor stærkt Jordens magnetfelt er i Danmark~~ **Fundet 14. november 2026:** regnet med IGRF-14 for København: 16,8 µT vandret, 50,7 µT i alt, 71° hældning (se [E11-noterne](fable/E11-strom-lys-noter.md) afsnit 1).
- Vindmøllernes andel af Danmarks el (59 % i 2024 er fra Our World in Data via Wikipedia). Slå op hos Energistyrelsen (ens.dk er lukket i miljøet).
- Hvorfor himlen ikke er violet (mindre violet i sollyset, øjet er mindre følsomt). Ikke åbnet.
- Strømmen i et lyn (ofte sagt ca. 30.000 A). Ikke fundet i den tekst, der blev læst.
- Maxwells citat er ikke læst i originalen (archive.org `dynamicaltheoryo00maxw`).
- Faradays notesbog fra 29. august 1831 (Royal Institution, linket er dødt, arkiveret på archive.org): ikke åbnet.
- Newtons prismeforsøg (år og bogside i *Opticks* 1704): ikke slået op.
- Ørsted-satellitten: hvor længe den målte. Ikke slået op.
- Hvilket år Comtes bind 2 udkom første gang (1835 er almindeligt sagt, og bindets forord taler om "la fin de 1835").

---

## 12. Spørgsmål til jer (min anbefaling først)
1. **Kernesætningen:** to dele med hver sin sætning (forslag 1 og 2, anbefalet) eller én samlet del (forslag 3)?
2. **Hvor bor det?** Strøm og magneter som et nyt rum ved siden af Batteriet, og Lys og farver som en ny del, der linker til Værkstedet og Solen (anbefalet). Eller begge inde i eksisterende dele (Batteriet og Værkstedet), hvilket bryder budgettet for panelerne.
3. **Første handling:** Ørsteds bord for Strøm (anbefalet, fordi det er en dansk opdagelse og første skridt i fagplanen) og flammeprøven for Lys (anbefalet).
4. **Del C (bølgerne fra radio til gamma):** senere, efter de to første er prøvet (anbefalet), eller som tredje trin i Lys med det samme?

## Jeres svar (12. november 2026)
Alle fire som anbefalet: **to dele** med hver sin kernesætning (forslag 1 og 2), som **to nye dele** (Strøm og magneter ved siden af Batteriet, Lys og farver med links til Værkstedet og Solen), **første handling** er Ørsteds bord og flammeprøven, og **Del C (bølgerne)** kommer senere, når de to første er prøvet.
