# Faktagrundlag: Kvantefysik (med kvantecomputeren som sidste kapitel)

*Lavet 13. november 2026 af Fable efter [prompt-fable-kvantefysik.md](prompt-fable-kvantefysik.md). Kun dokumenter, ingen kode. Drejebogen står i [drejebog-kvantefysik.md](drejebog-kvantefysik.md). Før en tekst kommer med i programmet, skal den gennem `/faktatjek` mod denne fil, og påstande mærket **RS** eller **U** skrives forsigtigt eller slås op igen. Kvantecomputeren flytter sig hurtigt: Alle tal i afsnit 5 har en dato, og "Tjek igen" (afsnit 9) slås op, før teksterne skrives.*

**Sikkerhed:** **S** (sikker) = læst i dag i den oprindelige kilde (resuméet på arXiv, Nobel-siden, Hitachi, IBM) eller regnet efter (afsnit 10). **RS** (ret sikker) = én pålidelig sekundær kilde (Wikipedia med henvisning, Stanford Encyclopedia of Philosophy) eller lærebogsviden fra hukommelsen, der passer med kilderne. **U** (usikker) = kun set i et søgeresultat, kilderne er uenige, eller kilden kunne ikke læses.

**Kilderne (åbnet 13. november 2026):** arXiv (resuméer, numrene står ved påstandene), engelsk Wikipedia som wikitekst (artiklens navn i anførselstegn), nobelprize.org og de domæner, I åbnede i dag: hitachi.com, ibm.com og plato.stanford.edu (SEP). **Kunne ikke læses:** feynmanlectures.caltech.edu og journals.aps.org (åbne i miljøet, men siderne afviser automatiske opslag), Natures artikel om rundspørgen (afsnit 6) og American Journal of Physics (Tonomuras artikel). **Ikke åbnet:** research.google, blog.google, csrc.nist.gov og scottaaronson.blog (miljøet afviste den første anmodning med 11 domæner, den anden med 5 gik igennem).

## Det vigtigste først
1. **Kvantefysik kan siges rigtigt uden mystik:** Det mindste (elektroner, lys, atomer) breder sig som en bølge, men bliver altid fundet ét sted som en hel partikel. Bølgen bestemmer chancen for hvor.
2. **To ting følger af bølgen:** En bølge, der er spærret inde, kan kun have bestemte former (energitrin, afsnit 2). En bølge stopper ikke brat ved en forhindring (tunneleffekten, afsnit 3).
3. **Hold "målt" og "fortolkning" adskilt i hver tekst.** Alt i punkt 1 og 2 er målt igen og igen. Det, fysikerne er uenige om, er, hvad bølgen *er* (afsnit 6).
4. **Programmet har halvdelen i forvejen:** elektronskyen i Værkstedet, tunnel-kortet i Stjerneovnen og fotonen i Ordbogen. Det nye, der skal bygges, er dobbeltspalten. Resten er mest links og små tilføjelser.
5. **Kvantecomputeren (november 2026):** De bedste har ca. 100-160 qubits. Den første fejlretning virker, men ingen har løst en nyttig opgave, uden at det er omstridt, og det største tal, der er delt med Shors algoritme, er 21.

## 1. Dobbeltspalten
| Påstand | Kilde | |
|---|---|---|
| Lys gennem to spalter giver lyse og mørke striber (interferens), som kun bølger kan lave. Thomas Young beskrev det i 1801 (trykt 1804). Skriv "i begyndelsen af 1800-tallet" | Wikipedia "Double-slit experiment" | RS |
| Louis de Broglie foreslog i 1924, at også stof har en bølgelængde: λ = h/(m·v). Davisson og Germer og, uafhængigt, G.P. Thomson viste det for elektroner i 1927 | Wikipedia "Matter wave" | RS |
| Første forsøg med elektroner gennem spalter: Claus Jönsson, Tübingen, 1961 (mange ad gangen). Første med **én elektron ad gangen:** Merli, Missiroli og Pozzi, Bologna, 1974. Den kendte film: Tonomura m.fl., Hitachi, 1989 | Wikipedia "Double-slit experiment" | RS |
| **Hitachis forsøg:** Elektronerne fik fart med 50.000 volt (ca. 41 % af lysets fart). "De to spalter" var en tråd tyndere end 1 µm (et elektron-biprisme). Hver elektron ses som én lys prik. Der var "at most one electron in the microscope at one time". Efter 20 minutter er striberne tydelige | hitachi.com (R&D, "Double-slit experiment"); farten regnet efter | S |
| De elektroners bølgelængde er 5,4 pm: ca. 90.000 gange kortere end grønt lys | regnet | S |
| **Rigtige spalter og en skyder:** Bach, Pope, Liou og Batelaan (2013) lukkede én spalte ad gangen og byggede mønstret op prik for prik: "the full realization of his famous thought experiment" (Feynmans). Elektroner på 600 eV (λ = 50 pm). Spalterne var 62 nm brede med 272 nm imellem (fra hukommelsen): ca. 1.000 gange smallere end et hår | arXiv:1210.6243 (New J. Phys. 15, 033018) | S (resultatet), RS (målene) |
| Med en måler ved spalterne findes partiklen altid ved **én** spalte, aldrig en halv ved hver, og striberne forsvinder. Ved man kun lidt om vejen, bliver striberne kun svagere | Wikipedia "Double-slit experiment" (Feynman 1965; Greenberger og Yasin 1988) | RS |
| **Ingen behøver at kigge:** Varme C₇₀-molekyler sender selv varmestråling ud undervejs. Jo varmere, jo svagere striber. Lyset "røber" vejen til omgivelserne | arXiv:quant-ph/0402146 (Hackermüller m.fl., Nature 427, 711, 2004) | S |
| **Store ting:** C₆₀ (60 kulstofatomer) i 1999 (Arndt m.fl., Wien, fra hukommelsen). Molekyler med 2.000 atomer i 2019 (Fein m.fl.). **Rekorden:** klumper af natrium med over 7.000 atomer (over 170.000 Da, ca. 8 nm), Wien, Nature 21. januar 2026. De store forsøg bruger gitre med mange spalter (også gitre af laserlys), ikke to spalter | arXiv:2507.21211 (Pedalino m.fl., Nature 649, 866); Wikipedia | S (resuméet), RS (resten) |
| En fodbold (0,43 kg, 30 m/s) har bølgelængden 5 × 10⁻³⁵ m: ca. 10¹⁹ gange mindre end en atomkerne. Og luft og lys "måler" den hele tiden. Derfor ser man aldrig striber med store ting | regnet | S |
| Læserne af Physics World kårede i 2002 forsøget med én elektron ad gangen til fysikkens smukkeste. Feynman (1965): "a phenomenon which is impossible […] to explain in any classical way, and which has in it the heart of quantum mechanics. In reality, it contains the only mystery" | Wikipedia ("[…]" er Wikipedias, citatet er ikke læst i Feynmans bog) | RS |

- **Målt:** Hver partikel lander ét sted. Mønstret af mange følger en bølge. Lukkes en spalte, eller måles vejen, forsvinder striberne. Det virker for lys, elektroner, atomer og klumper med over 7.000 atomer.
- **Fortolkning:** hvad der "går gennem spalterne". Skriv "Bølgen går gennem begge sprækker. Elektronen bliver altid fundet ét sted." Skriv ikke "elektronen går gennem begge".
- **Findes i forvejen:** Ordbogens `foton` ("Er lys en bølge eller en partikel?") beskriver forsøget med fotoner og slutter rigtigt: "en kvanteting, der hverken ligner bølger eller kugler fra hverdagen". `HVORFOR.orbitaler` siger, at elektronen "opfører sig som en bølge". Brug ordet "sprækker" som Ordbogen, og kald forsøget "dobbeltspalteforsøget" i lag 2.
- **Gør i programmet:** en bænk med kilde, væg med to sprækker og bagvæg. Skyd kugler, bølger og elektroner. Luk en sprække. Tænd en måler. Drejebogen har trinene.
- **Modellen (til Opus):** Chancen på bagvæggen er I(x) ∝ cos²(π·d·x/(λ·L)) · sinc²(π·a·x/(λ·L)) med d = afstand mellem sprækkerne, a = bredden og L = afstanden til væggen. Én sprække: kun sinc². Med måler: summen af de to enkelte mønstre (ingen cos²). Træk prikkerne tilfældigt efter I(x), som `prøver` gør i `js/data/orbitaler.js`.

## 2. Energitrin og spektrallinjer
*Linjerne (Balmer, natrium, lithium, kalium, helium i Solen, Kirchhoff og Bunsen) står i [fakta-strom-og-lys.md](fakta-strom-og-lys.md) afsnit 7 og gentages ikke. Bohrs artikler fra 1913 står i [fakta-videnskabsfolk.md](fakta-videnskabsfolk.md) afsnit 5. Her står kun **hvorfor**.*

| Påstand | Kilde | |
|---|---|---|
| Efter den gamle fysik kan Rutherfords atom (1911) ikke holde: En elektron i kreds sender lys ud, mister energi og falder ind i kernen på ca. 1,6 × 10⁻¹¹ s (under en milliardtedel sekund) | regnet med Larmors formel (kendt lærebogsopgave); Wikipedia "Bohr model" | S (tallet), RS |
| Bohr (1913) *bestemte*, at elektronen kun kan have visse energier, og at lys kommer ved spring mellem dem. Det forklarede hydrogens linjer, men ikke hvorfor. Forklaringen kom i 1925-26 (Heisenberg, Schrödinger): Elektronen er en stående bølge. Bohrs model med baner er forældet ("obsolete scientific theory") og bruges kun som indgang | Wikipedia "Bohr model" | RS |
| **Hvorfor trin?** En stående bølge kan kun have et helt antal buer, som en guitarstreng. Hver form har sin energi. (`HVORFOR.skaller` bruger allerede guitarstrengen) | lærebogsviden | S |
| **Hvorfor falder elektronen ikke ind?** Klemmes bølgen sammen om kernen, bliver bølgelængden kortere, og bevægelsesenergien stiger. Det laveste trin er der, hvor det bedst kan betale sig (hydrogen: 0,053 nm fra kernen). Der findes ingen bølgeform med lavere energi, så der er intet at falde ned til | lærebogsviden (Feynman III, kap. 2), ikke slået op i dag | RS |
| Lysets farve svarer præcis til forskellen mellem to trin. Hvert grundstof har sine egne trin, fordi kernens ladning og de andre elektroner er forskellige | fakta-strom-og-lys.md afsnit 7 (NIST) | S |
| Et spring i **ét atom** blev set første gang i 1986: En fanget ion lyser og holder pludselige pauser | Wikipedia "Quantum jump" (New York Times 21. oktober 1986) | RS |
| Springet sker **ikke på ingen tid**: I 2019 fulgte forskere et spring i et kunstigt atom (et superledende kredsløb), så det komme og vendte det om undervejs. Hvornår et spring begynder, er stadig tilfældigt | arXiv:1803.00545 (Minev m.fl., Nature 570, 200) | S |
| Sekundet er defineret ved et spring mellem to trin i cæsium-133: 9.192.631.770 svingninger | SI (BIPM), fra hukommelsen | S |
| **Nobelprisen 2025** (Clarke, Devoret og Martinis, forsøg i 1984-85): energitrin og tunneleffekt i et elektrisk kredsløb, "big enough to be held in the hand". Kredsløbet "only absorbs or emits specific amounts of energy" | nobelprize.org, pressemeddelelsen 7. oktober 2025 | S |

- **Fortolkning:** ingen her. Trinene og linjerne er både målt og regnet, og de passer.
- **Findes i forvejen:** `HVORFOR.skaller` og `orbitaler`, kontakten "Elektronsky", og forslaget "Elektronens trin (i Værkstedet)" i fakta-strom-og-lys.md afsnit 9 (B3). **Del arbejdet:** Lys ejer flammeprøven og stregkoden (*hvad* man ser). Kvantefysik ejer *hvorfor* der er trin. "Elektronens trin" bygges én gang og bruges begge steder.
- **Gør i programmet:** Knips en streng (1, 2, 3 buer). Løft elektronen i hydrogen med lys: Kun den rigtige farve virker. Lad den falde, og se farven (3 → 2: rød, 656 nm). Prøv at presse bølgen sammen: Energien stiger.
- **Ord:** Brug "energitrin" (som fakta-strom-og-lys.md). Lærebøgerne siger "energiniveau".

## 3. Tunneleffekten
**Findes i forvejen:** `HVORFOR.tunnel` ("Er 15 mio. °C så nok?"), Ordbogens `tunneleffekt` og tallet i [fakta-ordbog.md](fakta-ordbog.md): Bakken er ca. 400 gange protonernes typiske energi. **Pas på:** Grafen i Stjerneovnen viser, hvor mange protoner der er "hurtige nok til at komme over frastødningens bakke" (26 % ved 15 mio. °C). Det er spillets bakke (`BAKKE` i `js/fusion.js`). I den rigtige Sol kommer ingen over (tabellen). Forløbet må ikke sige det modsatte af grafen uden at sige "i spillet".

| Påstand | Kilde | |
|---|---|---|
| Friedrich Hund regnede først på det (1927). George Gamow og, uafhængigt, Gurney og Condon forklarede alfahenfald med det i 1928 | Wikipedia "Quantum tunnelling" | RS |
| **Lidt tykkere væg, vildt meget færre igennem:** Polonium-212 har halveringstiden 294 ns, uran-238 ca. 4,5 milliarder år: ca. 5 × 10²³ gange længere. Men alfapartiklens energi er kun ca. halvt så stor (ca. 4,3 mod ca. 9 MeV) | Wikipedia "Isotopes of polonium", "Uranium-238", "Geiger–Nuttall law"; poloniums energi fra hukommelsen | RS |
| **Ingen proton i Solen er hurtig nok til at komme over bakken:** Andelen er ca. 10⁻¹⁷⁶, og Solen har "kun" ca. 10⁵⁷ protoner | regnet (Maxwell-Boltzmann, bakke 0,55 MeV, kT 1,35 keV) | S (regnet), bakkens højde er et skøn |
| Chancen for at slippe igennem i ét sammenstød lige på: ca. 1 ud af 200 millioner ved typisk fart, ca. 1 ud af 8.000 ved den fart, der betyder mest (ca. 6 keV) | regnet med Gamows formel. Kun størrelsesordenen | RS |
| **Tunneleffekten er ikke hele forklaringen på, at Solen brænder langsomt.** Når to protoner er mødtes, skal den ene også nå at blive til en neutron (den svage kernekraft). "More than 99.99% of the time" skilles de igen. En proton i Solens midte venter i gennemsnit ca. 9 milliarder år | Wikipedia "Proton–proton chain" | RS |
| Eddington foreslog i 1920'erne, at Solen laver helium af hydrogen. Indvendingen var, at Solen var for kold. Tunneleffekten løste det | Wikipedia "Proton–proton chain" | RS |
| **Man kan se atomer med den:** I et tunnelmikroskop (Binnig og Rohrer, 1981, Nobelpris 1986) falder strømmen ca. 10 gange, når spidsen løftes 0,1 nm (mindre end et atom) | Wikipedia "Scanning tunneling microscope"; nobelprize.org | RS |
| **Den er i din lomme:** Flash-hukommelse (telefon, USB-nøgle) gemmer ved at lade elektroner tunnelere gennem et isolerende lag. Og isolerende lag i chips kan ikke blive meget tyndere end ca. 1 nm, for så siver elektronerne igennem | Wikipedia "Flash memory", "Quantum tunnelling" | RS |
| Nobelprisen 2025 (se afsnit 2): Alle de ladede partikler i et superledende kredsløb opførte sig tilsammen som én partikel ("a single particle that filled the entire circuit"), der slap gennem en barriere. Det er grundlaget for de superledende qubits | nobelprize.org | S |
| Hvor lang tid det tager, er omstridt. Én måling: Rubidium-atomer brugte 0,62 ms på en 1,3 µm tyk barriere. Påstande om "hurtigere end lyset" er fejltolkninger | arXiv:1907.13523 (Ramos m.fl., Nature 2020); Wikipedia | S (målingen), RS |

- **Sådan siges det:** Bølgen stopper ikke brat ved bakken. Den bliver hurtigt svagere inde i den. Er bakken tynd nok, er der lidt bølge på den anden side, og så er der en lille chance for at finde partiklen dér. Partiklen har samme energi før og efter.
- **Gør i programmet:** Rul en kugle mod en bakke med for lidt fart (kommer altid tilbage). Skyd protoner (nogle få dukker op på den anden side). Gør bakken tykkere (næsten ingen). Sæt Solens temperatur (ingen over, nogle igennem).
- **Modellen (til Opus):** Chancen er ca. e^(−2κL) med κ = √(2m(V−E))/ħ. For en elektron: κ ≈ 5,1 nm⁻¹ · √(V−E i eV). Et forløb skal bruge et tal i spillet (fx 1 ud af 20), og det skal siges.

## 4. Orbitalerne i store atomer
**Findes i forvejen (læst i koden):** `js/data/orbitaler.js` regner formerne som i hydrogen (s, p, d og f), trækker prikker med sandsynligheden |ψ|² og fordeler elektronerne efter de rigtige konfigurationer og Hunds regel. `js/atom.js` gør hver orbital så stor, at 85 % ligger inden for skallens ring, og viser de yderste som glødende former (udgaven "former" er standard).

| Påstand | Kilde | |
|---|---|---|
| **Formerne passer også for store atomer,** i den model, hvor hver elektron mærker kernen og et rundt gennemsnit af de andre: "qualitatively similar to those of hydrogen" | Wikipedia "Atomic orbital" | RS |
| **Størrelserne passer ikke.** I et tungt atom er de inderste skyer meget mindre (1s i guld er ca. 79 gange mindre end i hydrogen), og atomer bliver ikke meget større af flere skaller. Ringene i programmet er en tegning | lærebogsviden (radius ∝ 1/Z), ikke slået op | RS |
| En orbital er en tilnærmelse: "a one-electron wave function … the one-electron view is an approximation". I virkeligheden deler alle elektronerne én bølge. Ordet er fra 1932 (Mulliken) | Wikipedia "Atomic orbital" | RS |
| **Et helt atom er rundt.** Lægges alle orbitalerne i en fyldt underskal sammen, bliver skyen en kugle (Unsölds sætning). Neon er en rund bold, ikke en blomst. Formerne får betydning, når atomet binder sig til andre | lærebogsviden, ikke slået op | RS |
| **2, 6, 10 og 14:** Der er 1 s-form, 3 p-former, 5 d-former og 7 f-former, med plads til to elektroner i hver. Derfor er blokkene i det periodiske system 2, 6, 10 og 14 grundstoffer brede | Wikipedia "Atomic orbital" | RS |
| **Knuder:** Mellem de to "dråber" i en p-orbital er der en flade, hvor elektronen aldrig findes. Den flytter sig ikke fra den ene dråbe til den anden som en kugle. Det er en stående bølge, og en guitarstreng har også punkter, der står stille | Wikipedia "Atomic orbital" (nodal planes) | RS |
| **Relativitet i tunge atomer:** Den inderste elektron i guld svarer til 58 % af lysets fart (v ≈ Z·c/137). Det trækker s-skyerne ind, så guld opsuger blåt lys og bliver gult i stedet for sølvfarvet. Kviksølv er flydende af samme grund. Ca. 10 af de 12 volt i et bilbatteri (bly) skyldes relativitet (en beregning) | Wikipedia "Relativistic quantum chemistry" | RS |
| "4s fyldes før 3d, fordi den har lavere energi" gælder kun kalium og calcium. Forklaringen for resten er svær | fra hukommelsen (Schwarz 2010, J. Chem. Educ.) | U |
| Man har taget billeder, der ligner orbitaler (fx de inderste i strontium med et elektronmikroskop). Det, der måles, er, hvor elektronerne er, ikke selve bølgen | Wikipedia "Atomic orbital" (billedtekst) | RS |

**Hvad mangler så? Min vurdering:** ikke mere fysik i skyen. Rigtigere størrelser (Hartree-Fock) ville være "rigtige data", der gør det første møde sværere. Der mangler fire små ting:
1. **Én orbital ad gangen:** Et tryk på en underskal (fx 2p) lyser den op alene, så man kan se formen i et stort atom, hvor alt ellers er tåge.
2. **En energistige** ved siden af atomet (1s, 2s, 2p, 3s …) med pladserne som felter. Den er broen til energitrin og til 2-6-10-14.
3. **"Ærligt talt":** Det samlede atom er rundt, de inderste skyer er tegnet for store, og formerne er regnet som i hydrogen (det sidste står i koden, ikke på skærmen).
4. **To "Hvorfor?"-kort i Det periodiske system:** "Hvorfor er guld gult?" og "Hvorfor er systemet 2, 6, 10 og 14 bredt?".

## 5. Kvantecomputeren
**Står i sin egen fil: [fakta-kvantefysik/kvantecomputeren.md](fakta-kvantefysik/kvantecomputeren.md)** (idéen med pilen på kuglen, en tabel med tal og datoer, og hvad man kan sige i november 2026). Kort:
- En qubit er en pil på en kugle. En måling giver 0 eller 1, og retningen bestemmer chancen. Superposition er en bestemt retning, ikke "begge dele".
- De bedste maskiner har ca. 100-160 qubits (Google Willow 105, IBM Heron 156, Quantinuum Helios 98). Den første fejlretning virker (Willow, 2024).
- Det største tal, der er delt med Shors algoritme, er 21. Skønnene for, hvad der skal til for at bryde RSA-2048, er faldet fra 20 millioner qubits (2019) til under 1 million (2025) og lavere endnu i 2026, men det er regnestykker.
- Danmark får efter planen Magne omkring årsskiftet 2026/27 (ikke meldt færdig).

## 6. Fortolkningerne
| Påstand | Kilde | |
|---|---|---|
| **Enige:** Regnereglerne passer. Elektronens magnetisme er målt til g/2 = 1,001 159 652 180 59 (13), og teori og måling er enige til 1 del ud af 10¹². Det svarer til at kende afstanden København-New York på en tiendedel af et hårs bredde | arXiv:2209.13084 (Fan m.fl., PRL 2023); sammenligningen er regnet | S |
| **Uenige:** hvad bølgen er, og hvad der sker ved en måling. I Natures rundspørge (30. juli 2025, over 1.100 svar) valgte 36 % Københavnerfortolkningen, 15 % mange verdener og 7 % pilotbølgen. Kun 24 % var sikre på, at deres valg er det rigtige | Nature (Gibney), kun set i søgeresultater | U |
| **København** (Bohr og Heisenberg, 1925-27): Bølgen er vores bedste viden om, hvad en måling vil give. Navnet er fra 1955 (Heisenberg), og Bohr og Heisenberg var ikke enige | SEP "Copenhagen Interpretation of Quantum Mechanics" (2024) | S |
| **Mange verdener** (Everett, 1957): Bølgen er virkelig og falder aldrig sammen. Alle udfald sker, i hver sin gren. **Pilotbølgen** (de Broglie 1927, Bohm 1952): Der er både en partikel og en bølge. Partiklen går gennem én sprække, bølgen gennem begge | Wikipedia "Interpretations of quantum mechanics"; årstal fra hukommelsen | RS |
| De tre giver **præcis de samme tal** i alle forsøg. Derfor kan et forsøg ikke vælge mellem dem | lærebogsviden | RS |
| **Kollaps-teorier** (GRW 1986, Penrose): Bølgen falder sammen af sig selv, når tingene bliver store. De forudsiger noget andet og **kan testes**. Den enkleste udgave af Penroses idé er udelukket (2021), og natrium-klumperne (afsnit 1) flytter grænsen | arXiv:2111.13490 (Donadi m.fl., Nature Physics 17, 74); arXiv:2507.21211 | S |
| En svingende krystal med en masse på 16 µg (som et lille sandkorn) er bragt til at svinge i to modsatte takter på én gang | arXiv:2211.00449 (Bild m.fl., Science 2023) | S |
| **Ikke fortolkning:** Bells sætning (1964) og forsøgene (afsnit 5). To sammenfiltrede partikler har ikke "aftalt svarene hjemmefra" | nobelprize.org (2022) | S |
| Bohrs udgave er "independent of a subjective observer". Idéen om, at bevidstheden spiller en rolle, kommer fra von Neumann (1932) og Wigner og har få tilhængere | Wikipedia "Interpretations of quantum mechanics"; SEP | RS |
| Schrödingers kat (1935) var en indvending ("quite ridiculous case"), ikke en påstand om katte | Wikipedia "Schrödinger's cat" | RS |
| At omgivelserne hele tiden "måler" store ting (dekohærens), forklarer, hvorfor vi ikke ser striber i hverdagen. Det løser ikke i sig selv spørgsmålet om, hvad en måling er | SEP "The Role of Decoherence in Quantum Mechanics" (2025) | S |

**Det kan man sige til en 13-årig** (forslag): "Regnereglerne passer hver gang, med tolv cifre. Men spørger du fysikerne, hvad der *egentlig* sker, mens ingen måler, får du flere forskellige svar, og ingen ved, hvem der har ret. Det er ikke hokuspokus. Det er et åbent spørgsmål, ligesom mørkt stof."

**Min mening om Gåderne:** Ja, et kort, men med spørgsmålet **"Hvor stopper kvanteverdenen?"**, ikke "Hvad betyder kvantefysikken?". Det første har alle tre faste svar: *Hvad ved vi?* (striber med klumper på 7.000 atomer, januar 2026). *Hvad ved vi ikke?* (om der er en grænse, eller om alt i princippet kan). *Hvordan finder vi ud af det?* (større og større ting, og test af kollaps-teorierne). Det andet er filosofi uden et forsøg og hører til i kortets "For nørder" med de tre fortolkninger på én linje hver. Kortet er billigt (kun data i `js/data/gaader.js`) og bør bygges sammen med forløb 1, så det peger på bænken.

## 7. Fælderne
*De står også, kort, nederst i [fakta-faelder.md](erfaringer/fakta-faelder.md).*

| Ofte sagt | Skriv i stedet | Hvorfor |
|---|---|---|
| "Partiklen er to steder på én gang" | "Bølgen breder sig over begge veje. Partiklen bliver altid fundet ét sted" | Ingen måling har fundet en partikel to steder |
| "Observatøren er en bevidsthed", "elektronen ved, at vi kigger" | "At måle er, at noget (lys, luft, en måler) mærker, hvilken vej partiklen tog. Det virker også, når ingen kigger" | C₇₀-forsøget (afsnit 1) |
| "Sammenfiltring sender beskeder hurtigere end lyset" | "Svarene passer sammen, men hvert svar er tilfældigt. Man kan ikke bestemme sit eget svar, så man kan ikke sende noget" | Mønstret ses først, når de to sammenligner med en almindelig besked |
| "Kvantecomputeren prøver alle svar på én gang" | "Den får de forkerte svar til at udslukke hinanden og de rigtige til at forstærke hinanden. Det kan kun lade sig gøre for få slags opgaver" | Prøvede den alle, gav målingen bare et tilfældigt af dem |
| "En qubit er 0 og 1 på samme tid" | "En qubit er en pil, der kan pege i alle retninger. En måling giver 0 eller 1, og retningen bestemmer chancen" | Afsnit 5 |
| "Elektronen kredser om kernen som en planet" | "Elektronen er en stående bølge om kernen" | I det laveste trin har elektronen slet ingen omdrejning |
| "Elektronen falder ikke ind, fordi den er så hurtig", "Bohr forklarede hvorfor" | Afsnit 2: Der er intet lavere trin. Bohr satte det som en regel i 1913, forklaringen kom i 1925-26 | |
| "Et kvantespring er et kæmpe spring", "det sker øjeblikkeligt" | "Det mindste spring, der findes." Og det tager tid (2019) | Afsnit 2 |
| "Usikkerhedsrelationen skyldes, at målingen skubber til partiklen" | "En bølge kan ikke både have et skarpt sted og en skarp bølgelængde" | Heisenberg sagde det første i 1927. I dag regnes det for en egenskab ved bølgen (Wikipedia "Uncertainty principle") |
| "Partiklen låner energi", "graver sig igennem", "tunnelerer hurtigere end lyset" | Afsnit 3: Bølgen rækker gennem bakken. Samme energi før og efter | |
| "Du kan gå gennem en væg, hvis du prøver længe nok" | "For store ting er chancen så lille, at det aldrig sker" | |
| "Protonen venter 9 milliarder år på grund af tunneleffekten" | Det meste af ventetiden skyldes den svage kernekraft | Afsnit 3 |
| "Schrödingers kat er både levende og død" | "Schrödinger fandt på katten for at vise, at noget var galt" | Afsnit 6 |
| "Lys er nogle gange en bølge og nogle gange en partikel" | "Hverken eller: en kvanteting" (som Ordbogens `foton`) | |
| "Atomet ligner kløverblade", "orbitalen er elektronens bane" | Et helt atom er rundt. En orbital er en bølgeform, ikke en bane | Afsnit 4 |
| "Google viste, at kvantecomputeren er 10²⁵ år foran" | "…i en opgave, der er lavet til formålet" | "10.000 år" fra 2019 blev til sekunder |
| "Kvantecomputere bryder snart al kryptering" | Rekorden er 21. Skønnene falder hurtigt, men ingen maskine er i nærheden, og de nye standarder findes siden 2024. Kun nogle slags kryptering er truet | Afsnit 5 |
| "Flere qubits er bedre" | Fejlprocenten tæller lige så meget. Skeln mellem fysiske og logiske (fejlrettede) qubits | |
| "Einstein troede ikke på kvantefysikken" | Han var med til at grundlægge den (lyskvanter, 1905) og fandt selv sammenfiltringen (1935). Han troede ikke på, at tilfældet er grundlæggende. Citatet om terninger skal slås op, før det bruges | |
| Tonomura: "10 elektroner i sekundet" | Skriv "én ad gangen" og "ca. 20 minutter" | Hitachis side siger 10 i sekundet (12.000 på 20 min), men billederne går op til 140.000 elektroner (Wikipedia) |
| "C₆₀ i 2002" (Wikipedia et enkelt sted) | 1999 (Arndt m.fl., Nature 401, 680) | Slå det op, før årstallet bruges |
| "Kvante-" om tanker, held og helbred | "Kvantefysik handler om ting på størrelse med atomer" | En 13-årig møder ordet i reklamer |

## 8. Ærligt talt-linjer (det, animationerne snyder med)
- **Dobbeltspalten:** "Vi tegner ikke elektronen på vej. Ingen har set den dér, man ser kun, hvor den lander." Vises bølgen: "Bølgen er regnestykket for chancerne. Den er aldrig set direkte." "Rigtige sprækker er ca. 1.000 gange smallere end et hår, og striberne er forstørret." "I det kendte forsøg fra 1989 var de to sprækker en hårfin tråd, og det tog 20 minutter." "Måleren er i rigtige forsøg fx lys, der rammer partiklen."
- **Energitrin:** "Strengen har én retning, atomet har tre." "Trinene ligger ikke lige langt fra hinanden: De ligger tættere foroven" (tegn stigen sådan). "Elektronen hopper ikke som en kugle: Bølgen skifter form." Farven er den rigtige (656 nm er rød).
- **Tunneleffekten:** "Bakken er en tegning af frastødningen." "Her slipper 1 ud af 20 igennem. I Solen er det langt færre, og bagefter skal mere til." I Stjerneovnen: "I spillet er bakken sat ned, så nogle når over. I Solen når ingen over."
- **Elektronskyen:** "Det samlede atom er rundt." "De inderste skyer er tegnet for store." "Formerne er regnet som i hydrogen."
- **Qubitten:** "Kuglen er et kort over qubittens tilstand, ikke en ting, der drejer. En rigtig qubit er fx et lille superledende kredsløb eller ét atom." "Kuglen virker kun for én qubit ad gangen."

## 9. Tjek igen, før teksterne skrives
- Er IBM's Kookaburra leveret? Er Magne i drift? Er IBM's "kvantefordel" afgjort (IBM's egen frist er udgangen af 2026)? Har Google en ny chip efter Willow?
- Rekorden for store ting i interferens (januar 2026: over 7.000 atomer). Det største tal med Shor (21). Skønnene for RSA-2048.
- Det, der ikke kunne læses: Feynmans citat i bogen, Tonomuras artikel (antal elektroner), Natures rundspørge (tallene) og NIST's egne sider.
- Alt mærket U, og alt "fra hukommelsen".

## 10. Regnestykkerne
- 50 keV: p = √(T² + 2·T·mc²)/c giver λ = h/p = 5,36 pm og v = 0,413 c. 500 nm / 5,36 pm = 93.000. 600 eV: 50,1 pm.
- Fodbold: h/(0,43 kg · 30 m/s) = 5,1 × 10⁻³⁵ m. Kerne ca. 10⁻¹⁵ m.
- Atomets fald: t = a₀³/(4·r_e²·c) = 1,56 × 10⁻¹¹ s (a₀ = 5,29 × 10⁻¹¹ m, r_e = 2,82 × 10⁻¹⁵ m).
- Alfa: 4,463 × 10⁹ år / 294,4 ns = 4,8 × 10²³. 8,95 MeV / 4,27 MeV = 2,1.
- Over bakken: 2·√(x/π)·e^(−x) med x = 550 keV / 1,35 keV = 407 giver 10⁻¹⁷⁶. Protoner i Solen: 2 × 10³⁰ kg · 0,73 / 1,67 × 10⁻²⁷ kg = 8,7 × 10⁵⁶.
- Gamow: E_G = (π·α)²·m_p·c² = 493 keV. Chancen e^(−√(E_G/E)) er 5 × 10⁻⁹ ved 1,35 keV og 1,2 × 10⁻⁴ ved 6,1 keV. Toppen: (E_G·(kT)²/4)^(1/3) = 6,1 keV.
- Tunnelmikroskopet: κ = 5,12 nm⁻¹ · √4,5 = 10,9 nm⁻¹, og e^(2·κ·0,1 nm) = 9.
- Qubit: cos²(30°) = 0,75. 2³⁰⁰ = 2,0 × 10⁹⁰. Kulde: 2,725 K / 0,015 K = 180. Guld: 79/137 = 0,58. Hår: 10⁻¹² · 6.200 km = 6 µm (et hår er ca. 0,07 mm).
