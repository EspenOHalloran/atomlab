# Drejebog: Albert Einstein og de tre ligninger

*Opus' udkast 21. november 2026 (V6 i [plan-videnskabsfolk.md](plan-videnskabsfolk.md), afsnit 2 og 8), startet af orkestratoren, mens I sov. **Lavet af Opus i stedet for Fable** (Fable er ikke til rådighed, linjen står i [plan-fable.md](plan-fable.md) under "Kan tjekkes af Fable senere"). Bog nr. 6 på hylden, bygget med `js/bog.js` som [Tychos](drejebog-tycho.md) og [Rømers](drejebog-roemer.md) bøger, med **den røde tråd fra begyndelsen** (erfaringen fra Huygens' afsnit 13). Faktagrundlaget er [fakta-einstein-bog.md](fakta-einstein-bog.md) (Opus xhigh i stedet for Fable) med teksterne linje for linje i [fakta-einstein-bog-tekster.md](fakta-einstein-bog-tekster.md). Jeres fire svar i faktafilens afsnit 11 er fulgt (skanningerne med en kontakt til sat tekst, 1915 som opslag 3, 1916 i "For nørder", én linje om Mileva Marić). Intet er bygget. Spørgsmålene står i afsnit 16, og **ét åbent punkt skal være på plads, før 1915-siden bygges** (afsnit 11).*

## 1. Kernesætningen
*Efter fem minutter kan brugeren sige:*

**A (anbefalet):** "Fordi lyset er lige hurtigt for alle, går et ur, der farer af sted, langsommere, og masse er energi (E = mc²). Ti år senere viste Einstein, at tunge ting også får tiden til at gå langsommere, og det skal GPS'en i min telefon regne med. Jeg har selv læst de tre ligninger på hans egne sider."

- B: "Einstein skrev tre ligninger: Tiden går forskelligt, masse er energi, og tunge ting krummer rumtiden." (Kortere, men siger ikke hvorfor, og intet, man selv har set.)

**Delens kernesætning** ("De gættede ikke bare. De så efter og målte …") passer kun halvt, og det siges ærligt: Einstein målte ikke selv. Han regnede ud fra to regler og sagde, hvad andre skulle måle (radiumsaltene, lyset ved Solen, urene). Målingerne passede. Det står i "Om Einstein".

**Det første wow** (stilguiden C1): I trin 1 tænder lygten på toget og en lygte på perronen på samme tid, og de to lysglimt farer side om side, selv om toget kører. **Det andet wow:** I trin 4 går uret i GPS-satellitten hurtigere end uret på jorden. **Det, barnet fortæller en ven:** "Din telefons GPS ville tage ca. 10 km fejl om dagen, hvis den ikke regnede med Einstein." **Noget, man selv finder** (C3): I de tre "Regn selv" regner man med Einsteins egne formler: et ur, der kommer 4,3 sekunder bagud pr. døgn, en lampe, der bliver 4 milliardtedele gram lettere, og 16 felter, der bliver til 10 ligninger.

## 2. Den røde tråd
Spørgsmålet **"Hvad sker der, når lyset er lige hurtigt for alle?"** (bogens `spørgsmål` i `js/data/opdagelser.js`, sættes i E1) driver alle seks opslag. Hver ligning følger af den forrige, og Einstein siger det selv på siderne. Hvert opslag slutter med en knap, der leder videre.

| Opslag | Delen af historien | Slutter med |
|---|---|---|
| 1 Forsiden | **Manden og de to regler:** Bern 1905, en ung mand på patentkontoret tager to regler for givet: Naturens love er de samme for alle, der bevæger sig jævnt, og lyset er lige hurtigt, uanset hvordan lampen bevæger sig | "Begynd ›" |
| 2 Lige hurtigt for alle (turen) | **Sporene:** lyset fra toget, uret, der flyver en tur, batteriet, der bliver lettere, og uret i GPS-satellitten | "Men hvordan skrev han det? Læs ligningerne på hans egne sider ›" (den vigtige knap) |
| 3 1905: Tiden | **Ligning 1** (s. 904): τ = t√(1 − (v/V)²), led for led, og "Regn selv": 4,3 sekunder bagud pr. døgn | "Tre måneder senere fandt han noget mere. Hvad med massen? ›" |
| 4 1905: Energien | **Ligning 2** (s. 641): massen bliver L/V² mindre, og Einstein siger selv, at den bygger på artiklen om tiden (fodnoten s. 639). "Regn selv": lampen | "Hvis masse er energi, hvad gør energien så ved tyngden? ›" |
| 5 1915: Tyngden | **Ligning 3** (s. 845): feltligningen. Energien står i den, fordi "die träge Masse nichts anderes ist als Energie" (1916, s. 807). Og tiden kommer igen: Urene går langsommere tæt på tunge ting (1916, s. 820). "Regn selv": de ti ligninger | "Havde han ret? ›" |
| 6 Om Einstein | **Havde han ret?** Han regnede, og andre målte efter, og målingerne passede. Ligningerne bruges hver dag i GPS'en. Og du kan selv sende et ur af sted | "Send et ur på rejse ›" (Gør det selv) |

**Tråden bagud til Rømer:** Opslag 3, "For nørder": Rømer viste i 1676, at lyset bruger tid. Einstein gjorde lysets fart til en regel for alle (et link til Rømers bog, når den er bygget).

## 3. Bogen og stilen
Bogen er en 2D-bog som de andre (planen, afsnit 3 og 4, `js/bog.js`). Én ting ad gangen, billedet fylder mindst to tredjedele af et opslag, siden vendes om ryggen, og "Om Einstein" er sidste opslag. Einsteins bog ligner **et tysk tidsskrift fra 1905**:
- **Papiret** er lyst og let gulnet (som et tidsskrift fra 1900, ikke en bog fra 1600-tallet), og **blækket** sort. Overskrifter og det store forbogstav står med **Old Standard TT** (planen, afsnit 4: lavet efter bøger og tidsskrifter fra ca. 1900, OFL, spørgsmål 5). Brødteksten står med programmets skrift (mindst 15 px).
- **Ryggen** er mørk bordeaux med sølv eller tyndt guld (fx `ryg: '#4a1f2a'`, `rygKant: '#b8b8b8'`), så den ikke ligner Huygens' røde, Tychos blå eller Rømers grønne. Prøves på hylden i E1.
- **Tegningerne:** stregtegninger i sort på papiret, som figurerne i et tidsskrift fra 1905 (tynde linjer, kursive bogstaver ved tingene, intet farvet). Kun lysglimtene og urenes visere er gule, så man kan følge dem. Ligningerne står store, sat med Old Standard TT og kursiv som i *Annalen* (MathML eller SVG, afgøres i E3).
- **Fortælleren** taler i nutid og tredje person ("Bern, 1905. Albert Einstein er 26 år …"). Ingen opdigtede citater: Det, Einstein selv skrev, står kun på siderne med hans tysk og vores oversættelse. Hans erindring om lysstrålen som 16-årig bruges ikke (fælden: skrevet over 50 år senere).

## 4. Opslag 1: Forsiden
- **Titlen** er spørgsmålet **"Hvad sker der, når lyset er lige hurtigt for alle?"**, og under den en lille vignet: et lommeur med visere og et lysglimt, der farer forbi (stregtegning).
- **Bogteksten** (stort forbogstav, 4 sætninger): "**Bern, 1905.** Albert Einstein er 26 år og arbejder på patentkontoret i Bern. Han tager to regler for givet: Naturens love er de samme for alle, der bevæger sig jævnt, og lyset er altid lige hurtigt, uanset hvordan lampen bevæger sig. Det lyder harmløst, men han regner sig frem til, at så kan tiden ikke være den samme for alle. Hvad sker der, hvis begge regler gælder?"
- **Portrættet** (Schmutzer, se afsnit 11) og småt: "Albert Einstein · 1879-1955". Under portrættet: "Foto af Ferdinand Schmutzer fra 1921. Einstein var omkring 42."
- **Knappen** "Begynd ›". Første gang er det det eneste, man kan trykke på. Telefon og lav skærm: mindre portræt, så "Begynd" ses uden at rulle (som de andre bøger).

## 5. Opslag 2: Turen "Lige hurtigt for alle"
Hvert trin er et opslag i bogen: billedet (scenen) og fortællerens linje med handlingen. Hver "Så" har højst to sætninger. Gæt i tre af fire trin. **Erfaringen fra Tycho** ("Jeg fatter ikke en skid af, hvad der er meningen her"): Hvert trin har én ting at gøre, og "Gør" siger i én sætning, hvad man skal kigge efter.

| Trin | Spørg | Gæt | Gør | Så | Ord |
|---|---|---|---|---|---|
| 1 *Bern, 1905: Toget og lyset* | Et tog kører forbi en perron. Der sidder en lygte foran på toget og en på perronen. Hvilket lys kommer først? | – | Tryk på "Tænd begge", og se, hvilket lysglimt der kommer først frem til målet | De kom samtidig. Lyset bliver ikke hurtigere af, at toget kører: Det er Einsteins regel om lyset, og den er målt mange gange siden | – |
| 2 *Uret, der flyver en tur* | To ure går helt i takt. Det ene bliver hjemme. Det andet flyver en tur rundt, meget hurtigt, og kommer tilbage. Hvad viser det? | *Det samme som uret hjemme* / *Mindre tid* / *Mere tid* | Vælg farten, og send uret af sted. Sammenlign urene, når det er hjemme | Uret, der fløj, er bagud. Når lyset skal være lige hurtigt for alle, kan tiden ikke være det | relativitetsteori |
| 3 *Batteriet på vægten* | Et batteri får en lampe på 100 W til at lyse i en time. Lys og varme forsvinder ud i rummet. Bliver batteriet og lampen lettere? | *Nej, lys vejer ingenting* / *Ja, en lillebitte smule* / *Ja, så man kan mærke det* | Tænd lampen, og spol en time frem. Se på vægten | Ja, men kun 4 milliardtedele gram. Masse er energi: E = mc². Solen bliver over 4 millioner ton lettere hvert sekund, fordi den lyser | – |
| 4 *Uret højt oppe (1915)* | Ti år senere gjorde Einstein sin teori færdig med tyngdekraften: Tunge ting krummer rumtiden, og tæt på dem går tiden langsommere. Et ur ligger på jorden, og et andet sidder i en GPS-satellit højt oppe, hvor det farer af sted. Hvilket går hurtigst? | *Uret på jorden* / *Uret i satellitten* / *De går lige hurtigt* | Træk satellitten op, og se, hvor meget urene skiller sig ud på et døgn | Uret i satellitten vinder ca. 38 milliontedele sekund om dagen. Uden Einsteins ligninger ville din GPS tage ca. 10 km fejl om dagen | rumtid |
| 5 **Det så du** | Kernesætningen. Under den: "Det står i tre ligninger på Einsteins egne sider." | – | Vælg en vej | – | – |

**Scenen i hvert trin:**
- **Trin 1 (det første wow):** Set fra siden: perronen nederst, toget, der kører mod højre (af sig selv, når opslaget åbnes), og en målstreg langt ude til højre. Begge lygter står ud for hinanden, da man trykker. To gule lysglimt farer mod målet. Togets lysglimt kunne man vente var foran, men de to følges ad og rammer målet samtidig. Under tegningen: "Togets fart: 100 km/t. Lysets fart: 1.079 millioner km/t (for begge)". Bagefter kan man trykke igen med toget hurtigere (skyderen "Togets fart" op til halvdelen af lysets), og de kommer stadig samtidig. *Lyset går alt for langsomt i tegningen, se Ærligt talt.*
- **Trin 2:** To lommeure side om side på perronen med hver sit tal under (sekunder). Skyderen "Fart" (10 %, 50 %, 87 %, 99 % af lysets fart). "Send af sted" sender det ene ur en tur rundt på en bane (ca. 6 sekunder i tegningen). Hjemme viser uret ved 87 % halvt så meget tid som det, der blev hjemme (fx 10 og 20 sekunder). Ved 10 % er forskellen kun lidt, og tallet viser den. Linjen nævner ikke lysuret (det er ikke Einsteins, se Ærligt talt), men "Hvorfor?" i opslag 3 linker til Lysuret i Rejsen i tid.
- **Trin 3:** En gammel skålvægt med batteriet og lampen på den ene skål og et lod på den anden. Tændt lyser lampen og sender små gule streger ud (lys) og bølgede streger (varme). "Spol en time" drejer et ur en time frem på 3 sekunder. Vægten bevæger sig ikke synligt, men tallet under den skifter fra "0" til "0,000 000 004 g lettere". Først når man har gættet, står svaret.
- **Trin 4 (det andet wow):** Jorden som en stor kugle forneden, et ur på jorden og en satellit med et ur, som man trækker op. To små tal: "Højden: +45 milliontedele sekund pr. døgn" og "Farten: −7". Under urene: "Satellittens ur er … foran efter et døgn". Ved fuld højde står der 38. Et lille kort over byen, der viser en prik, der glider ca. 10 km væk efter et døgn, når man trykker "Uden rettelse". *Tallene er de samme som i Rumtid i Kosmos.*
- **Trin 5:** Kernesætningen og tre veje: **"Læs ligningerne på Einsteins egne sider ›"** (opslag 3, primær), "Gå til en af ligningerne" (de tre opslag) og "Tag turen igen". Gør det selv står på sidste opslag (den røde tråd, som i de andre bøger).

**Det sværeste** at bygge er trin 4, fordi to virkninger trækker hver sin vej (højden og farten). Linjen siger kun, hvem der vinder, og de to tal står småt. Trin 1 må ikke se ud, som om lyset kan ses flyve: Det står i Ærligt talt.

## 6. Opslagene med ligningerne (fælles form)
Opslag 3, 4 og 5 er bygget ens, som en ny slags opslag `ligning` i `js/bog.js` (fælles for alle ti bøger, men i dag kun brugt her). **Budgettet** (planen, afsnit 3): Fremme står kun forordet, siden og den store ligning. "Led for led", "Regn selv", "Linje for linje" og "For nørder" er lukkede eller kommer frem én ad gangen.
1. **Forordet** (bogtekst med stort forbogstav, 2-3 sætninger): broen fra opslaget før.
2. **Siden** (skanningen, se afsnit 11) med højst to glødende steder. Et tryk viser tysk og dansk, som i Huygens' og Rømers bøger. **Kontakten "Skanning / Sat tekst"** (jeres tilføjelse 20. november 2026): Er siden svær at læse, kan man skifte til den samme side sat af os med Old Standard TT og de samme linjer og formler. De glødende steder findes i begge udgaver. Kontakten husker valget for hele bogen.
3. **Ligningen stor** under eller ved siden af siden, sat som på siden (med *V* og ikke *c*). Hvert led er en knap ("Led for led"): Et tryk lyser leddet op og viser én linje om det. Den lette forklaring står først, og under den "I dag skriver man …".
4. **"Regn selv"** (gåden for opslaget): et lille regnestykke med knapper, ét trin ad gangen, og et svar, man vælger. Et forkert valg ryster lidt (B5), og så kommer et vink.
5. **Lukkede foldebokse:** "Linje for linje" (siden og de andre sider fra artiklen, kun tekst), "For nørder" og en lille "Se det selv"-knap til stedet i AtomLab.
6. **Knappen videre** (den røde tråd) nederst.

På telefon og højkant: siden øverst, ligningen under, og resten ruller (klassen `mere`).

## 7. Opslag 3: 1905, tiden
*Annalen der Physik* bd. 17, **s. 904** (artiklen "Zur Elektrodynamik bewegter Körper", s. 891-921).

**Forordet:** "**Bern, juni 1905.** Einstein skriver 31 sider til tidsskriftet *Annalen der Physik*. Han begynder ikke med lys, men med en magnet og en ledning, og først på side 904 står det, han har regnet sig frem til: Et ur, der farer af sted, går langsommere, set fra dem, der står stille."

**De glødende steder:**
| Sted | Det glødende | Det, der står ved siden af |
|---|---|---|
| s. 904, l. 1-12 | Formlen *τ = t√(1 − (v/V)²)* og "um ½(v/V)² Sek. zurückbleibt" | Uret, der bevæger sig, kommer bagud. Ved små farter er det ½(v/V)² sekund for hvert sekund |
| s. 904, l. 27-33 | "so geht die letztere Uhr bei ihrer Ankunft in A … um ½ t (v/V)² Sek. nach" | Rundturen: Uret, der har været en tur rundt, er bagud, når det kommer hjem. Det er uret fra trin 2 |

**Led for led** (*τ = t√(1 − (v/V)²)*, fra faktafilens afsnit 2):
| Led | Linjen |
|---|---|
| *t* | Tiden på urene, der står stille (perronen, Jorden) |
| *τ* | Tiden på uret, der farer af sted. τ er det græske t og hedder "tau" |
| *v* | Urets fart |
| *V* | Lysets fart. Einstein skrev *V*. I dag skriver man *c* |
| *v*/*V* | Hvor stor en del af lysets fart uret har: 0,5 er halvdelen |
| (*v*/*V*)² | Det tal ganget med sig selv: 0,5 · 0,5 = 0,25 |
| 1 − (*v*/*V*)² | Altid mindre end 1, når uret bevæger sig |
| √ | Kvadratroden. Den er også mindre end 1, så *τ* bliver mindre end *t*: Uret viser mindre tid |

**Regn selv: "Hvor meget bagud?"** Et ur flyver med 1 % af lysets fart (ca. 10,8 millioner km/t) i et døgn. Hvor meget kommer det bagud? Einstein giver selv den lette udgave på siden: ½(*v*/*V*)².
1. *v*/*V* = 0,01. Gang med sig selv: 0,0001 (knappen "× sig selv").
2. Halvdelen: 0,00005 sekund bagud for hvert sekund.
3. Et døgn har 86.400 sekunder. Vælg svaret: *0,4 sekund* / **4,3 sekunder** / *43 sekunder*. Linjen: **"4,3 sekunder om dagen. Ved 100 km/t er det kun 0,000 000 000 37 sekund."**
- *For nørder (lukket):* "Prøv 87 %: Den lette udgave giver 0,38, men den rigtige formel giver 0,51 sekund bagud pr. sekund, altså at uret går halvt så hurtigt. Den lette udgave passer kun ved små farter. Det skriver Einstein selv: 'bis auf Größen vierter und höherer Ordnung'."
- Tallene står i dataene, og en test i Node tjekker 4,32 s, 0,38 og 0,51 (`decimal`-fælden: regn 1 − √(1 − β²) præcist).

**Linje for linje:** s. 904 (begge steder) og fra de andre sider: de to regler (s. 891-892), toget klokken 7 (s. 893) og ækvatoruret (s. 905). Alt står i [fakta-einstein-bog-tekster.md](fakta-einstein-bog-tekster.md), afsnit 1.

**For nørder:** Artiklen har ingen henvisninger til andres arbejde, og den eneste, der takkes, er vennen M. Besso (s. 921). Han nævner kun "die mißlungenen Versuche" (de mislykkede forsøg) på at måle Jordens fart gennem "lysmediet", ikke Michelson og Morley ved navn. Lysuret, man ser i Rejsen i tid, er fra 1909 (Lewis og Tolman). Rømer viste i 1676, at lyset bruger tid.

**Se det selv:** "Rejsen i tid ›" (`kosmos:tid`).

**Knappen videre:** "Tre måneder senere fandt han noget mere. Hvad med massen? ›"

## 8. Opslag 4: 1905, energien
*Annalen der Physik* bd. 18, **s. 641** (artiklen "Ist die Trägheit eines Körpers von seinem Energieinhalt abhängig?", s. 639-641).

**Forordet:** "**Bern, september 1905.** Einstein sender tre sider mere til *Annalen*. Den første linje siger, at de bygger på artiklen om tiden. Han forestiller sig et legeme, der sender lige meget lys ud til begge sider, og regner ud, hvad det betyder for dets masse. Han skriver ikke E = mc², men noget, der betyder det samme."

**De glødende steder:**
| Sted | Det glødende | Det, der står ved siden af |
|---|---|---|
| s. 641, l. 12-21 | "so verkleinert sich seine Masse um L/V²" og "Die Masse eines Körpers ist ein Maß für dessen Energieinhalt" | Sender noget energien L ud som lys, bliver massen L/V² mindre. Massen er et mål for, hvor meget energi der er i noget. I dag: E = mc² |
| s. 641, l. 22-24 | "(z. B. bei den Radiumsalzen)" | Han foreslår, hvordan man kan prøve det: med radiumsalte, hvis energi ændrer sig meget. Den første måling, der passede, kom i 1933 |

**Led for led** (massen bliver *L*/*V*² mindre, i dag *E* = *mc*²):
| Led | Linjen |
|---|---|
| *L* | Energien, der forsvinder ud som lys. Einstein målte den i erg, i dag i joule. I dag hedder den *E* |
| *V*² | Lysets fart ganget med sig selv: et kæmpe tal (90 millioner milliarder, når farten er i meter i sekundet). I dag *c*² |
| *L*/*V*² | Energien delt med det kæmpe tal. Derfor bliver massen kun en lillebitte smule mindre |
| Masse | Hvor svært noget er at sætte i gang (Einstein skriver "Trägheit", træghed) |
| 9 · 10²⁰ | Einsteins eget tal for *V*² i centimeter og sekunder |

**Regn selv: "Hvor meget lettere?"** (batteriet fra trin 3)
1. Lampen bruger 100 W i en time: 100 · 3.600 = 360.000 joule energi, der forsvinder ud som lys og varme.
2. Del med *c*² = 90.000.000.000.000.000 (knappen "÷ c²").
3. Vælg svaret: **4 milliardtedele gram** / *4 gram* / *4 milligram*. Linjen: **"4 milliardtedele gram. Det kunne ingen vægt i 1905 mærke. Derfor foreslog Einstein radium."**
- *Del to:* "Gør det samme med Solen: Den sender 380 millioner milliarder milliarder joule ud hvert sekund." Svaret: over 4 millioner ton i sekundet (samme tal som Solens nørd-tekst i AtomLab).
- *For nørder (lukket):* Med Einsteins egne tal: 360.000 joule er 3,6 · 10¹² erg, og *L*/9 · 10²⁰ giver 4 · 10⁻⁹ gram, præcis det samme.
- En test i Node tjekker 4,0 · 10⁻¹² kg og 4,3 · 10⁹ kg/s.

**Linje for linje:** s. 641 (tre steder), og fra de andre sider: fodnoten til artiklen om tiden (s. 639) og tankeforsøget med lyset til begge sider (s. 640). Alt står i [fakta-einstein-bog-tekster.md](fakta-einstein-bog-tekster.md), afsnit 2.

**For nørder:** Han skrev *c* for lysets fart fra 1907, E = mc² står i hans håndskrift fra 1912, og i 1946 stod den i titlen på en artikel. Andre var tæt på før ham: Poincaré (1900) gav lysets energi en "tænkt" masse *E*/*c*², og Hasenöhrl (1904-1905) fandt et tal for lys i en kasse, der var for stort. Einstein var den første, der sagde, at det gælder al energi. I 1933 passede energien, når lithium og protoner blev til to heliumkerner, med formlen inden for en halv procent. I Stjerneovnen forsvinder 0,7 % af massen, når brint bliver til helium.

**Se det selv:** "Stjerneovnen ›" (`fusion`, foldeboksen "Hvor kommer energien fra?").

**Knappen videre:** "Hvis masse er energi, hvad gør energien så ved tyngden? ›"

## 9. Opslag 5: 1915, tyngden
*Sitzungsberichte der Königlich Preußischen Akademie der Wissenschaften* 1915, **s. 845** ("Die Feldgleichungen der Gravitation", s. 844-847). Den lange udgave fra 1916 (*Annalen* bd. 49) står i "For nørder" (jeres svar 3). **Siden bygges først, når rettighedslinjen er på plads** (afsnit 11). Indtil da bruges kun sat tekst.

**Forordet:** "**Berlin, 25. november 1915.** Længe har Einstein prøvet at få tyngdekraften med i sin teori. I november lægger han fire meddelelser frem på akademiet i Berlin, en hver torsdag, og i den sidste står ligningen færdig. Energi og masse er det samme, skriver han senere, og derfor er det energien, der står i den."

*Faktatjek:* 4., 11., 18. og 25. november 1915 var alle torsdage (regnet efter med `datetime` 21. november 2026).

**De glødende steder:**
| Sted | Det glødende | Det, der står ved siden af |
|---|---|---|
| s. 845, l. 1-2 og (2) | "zehn Gleichungen" og *G*ᵢₘ = 0 | Ti ligninger for tyngdefeltet, hvor der ikke er noget stof. Sådan regnede han Merkurs bane |
| s. 845, l. 9-10 og (2a) | *G*ᵢₘ = −κ(*T*ᵢₘ − ½ *g*ᵢₘ *T*) | Ligningen med stof: Energien og stoffet til højre fortæller rumtiden til venstre, hvordan den skal krumme |

**Led for led** (*G*ᵢₘ = −κ(*T*ᵢₘ − ½ *g*ᵢₘ *T*), fra faktafilens afsnit 4, forenklet, og det siges):
| Led | Linjen |
|---|---|
| *g*ᵢₘ | Rumtidens målestokke og ure i hvert punkt: hvordan man måler afstand og tid lige dér. Det er det, man leder efter |
| *G*ᵢₘ | Et mål for, hvor krum rumtiden er. Det regnes ud af *g*ᵢₘ |
| *i*, *m* | Tal fra 1 til 4: tre retninger i rummet og tiden |
| κ | Et lillebitte tal, hvor Newtons tyngdekonstant gemmer sig. Derfor skal der meget masse til, før rumtiden krummer mærkbart |
| *T*ᵢₘ | Hvor meget energi (og dermed masse, opslag 4) der er, hvordan den strømmer, og hvor hårdt den trykker |
| ½ *g*ᵢₘ *T* | Det nye stykke fra 25. november, der fik det hele til at passe |
| = | Ikke en udregning, men en regel, der skal gælde i hvert punkt, hele tiden |

**Kort sagt** (efter fysikeren John Wheeler, uden anførselstegn, fordi ordlyden varierer): Stoffet fortæller rumtiden, hvordan den skal krumme, og rumtiden fortæller stoffet, hvordan det skal bevæge sig.

**Regn selv: "Hvor mange ligninger gemmer der sig i én?"**
1. Et skema med 4 · 4 = 16 felter (*i* ned ad, *m* hen ad, 1-4). Linjen: "*i* og *m* kan hver være 1, 2, 3 eller 4. Hvor mange ligninger er det?"
2. "Men *G*₁₂ er det samme som *G*₂₁. Tryk på de felter, der er dobbelte." Man trykker på felterne over diagonalen, og hver lægger sig oven på sin spejling (6 felter forsvinder).
3. Vælg svaret: *16* / **10** / *4*. Linjen: **"10, som Einstein selv skriver: 'zehn Gleichungen'. Ti ligninger, der hænger sammen, og de skal løses alle på én gang."**
- En test i Node tjekker 16, 6 og 10.

**Hvad man ikke kan** (står fremme som én linje under "Regn selv", jeres ønske om at sige det ærligt): "Med Newtons lov kan man sætte tal ind og få et svar. Det kan man ikke her: De ti ligninger skal løses, og det kræver matematik fra universitetet. Selv Einstein fik hjælp af matematikeren Grossmann."

**Linje for linje:** s. 845 (begge steder), og fra de andre sider: "in etwas anderer Weise" (s. 844) og "endlich … als logisches Gebäude abgeschlossen" (s. 847). Alt står i [fakta-einstein-bog-tekster.md](fakta-einstein-bog-tekster.md), afsnit 3.

**For nørder** (1916 og i dag, jeres svar 3):
- I 1916 skrev han den lange udgave på 54 sider (*Annalen* bd. 49). Ligningen er nr. (53) på s. 808, og dér skriver han selv, at energien står i ligningen, fordi "die träge Masse nichts anderes ist als Energie" (s. 807).
- På s. 822 regner han to ting, man kan måle: Lys, der går tæt forbi Solen, bøjes 1,7″ (i dag regnet til 1,75″), og Merkurs bane drejer 43″ pr. århundrede mere, end Newton giver. Han skriver "(Leverrier)", men Le Verrier fandt 38″ i 1859. De 43″ er Newcombs tal fra 1882.
- På s. 820 skriver han, at ure går langsommere tæt på tunge ting, og at lys fra store stjerner derfor må være rødforskudt. Det blev målt på Jorden i 1959-1960 (Pound og Rebka). Det er urene i GPS'en fra trin 4.
- I dag skrives den *R*ᵤᵥ − ½*R* *g*ᵤᵥ + Λ*g*ᵤᵥ = (8π*G*/*c*⁴) *T*ᵤᵥ (μ og ν i stedet for i og m). Uden Λ er det den samme ligning, bare med ½-leddet på den anden side. Λ kom til i 1917. Einsteins *G*ᵢₘ er det, man i dag kalder Ricci-tensoren. I 1916 indførte han også reglen om at droppe summetegnene (Einsteins summeregel, s. 781).
- Med en lommeregner: Formel (75) giver Merkurs 43″ (*a* = 5,79 · 10¹⁰ m, *T* = 88,0 døgn, *e* = 0,206, 415 omløb pr. århundrede).
- Matematikeren David Hilbert lagde sit arbejde frem den 20. november 1915. Hvem der var først med hvad, har historikere diskuteret, men de fleste mener, at Einstein fandt ligningen selv, og Hilbert regnede selv teorien for Einsteins.

**Se det selv:** "Rumtid ›" (`kosmos:rumtid`, gummidugen og GPS-urene).

**Knappen videre:** "Havde han ret? ›"

## 10. Opslag 6: Om Einstein (bogens sidste opslag)
*Budgettet: titel, højst to tal, højst tre sætninger, højst fire spørgsmål. Derefter "Vil du vide mere?" og "Ærligt talt", lukkede.*

**Fremme:** "Albert Einstein (1879-1955)". To tal: **26 år** (hans alder, da han skrev de to første ligninger i 1905) og **38 milliontedele sekund** (så meget går GPS-urene for hurtigt pr. døgn). Tre sætninger: "Einstein regnede, og andre målte efter: Urene i fly og satellitter, lyset, der bøjes ved Solen, og Merkurs bane passer alle med hans ligninger. Han fik nobelprisen for 1921, men ikke for relativitetsteorien. Ligningerne bruges hver dag, når din telefon finder vej med GPS." Den vigtige knap: **"Send et ur på rejse ›"** (Gør det selv, afsnit 12).

**Fire spørgsmål ("Hvorfor?"):**
1. **Hvorfor skrev han ikke E = mc²?** Han kaldte lysets fart *V* og energien *L*, så han skrev, at massen bliver *L*/*V*² mindre. Bogstavet *c* brugte han fra 1907, og E = mc² står i hans håndskrift fra 1912.
2. **Hvordan ved man, at han havde ret?** I 1933 passede energien fra lithium og protoner med E = mc² inden for en halv procent. Merkurs bane drejer de 43″, han regnede ud. Lyset bøjes ved Solen: Målingerne ved solformørkelsen i 1919 var usikre, men senere målinger har vist det meget præcist. Og atomure i fly og satellitter går næsten præcis, som ligningerne siger.
3. **Fik han nobelprisen for relativitetsteorien?** Nej. Han fik prisen for 1921 (givet i 1922) for sit arbejde i teoretisk fysik og især for loven om den fotoelektriske effekt: at lys kommer i små portioner. Den artikel skrev han også i 1905.
4. **Fandt han på det hele alene?** Han byggede på andre: Poincaré og andre havde regnet med lys og bevægelse før ham, han talte med vennen Besso, og matematikeren Grossmann hjalp ham med matematikken til tyngdekraften. Men de to regler og det, han regnede ud af dem, var hans.

**Ærligt talt:**
- Einstein målte ikke selv. Han regnede ud fra to regler og sagde, hvad man skulle måle.
- Hans ur ved ækvator var forkert (s. 905): Alle ure ved havets overflade går lige hurtigt, fordi tyngden ophæver farten. Det kunne han først vide efter 1915.
- Beviset for *L*/*V*² gjaldt kun små farter, og historikere har diskuteret, om det holdt. Han beviste det igen på andre måder senere.
- Ligningen fra 1915 ser lidt anderledes ud i dag, og Λ kom først til i 1917. Og man kan ikke regne med den uden matematik fra universitetet.
- Den almene relativitetsteori bygger også på andre idéer, som bogen springer over.
- Nogle har ment, at hans første kone, Mileva Marić, der læste fysik og matematik sammen med ham i Zürich, var med til at skrive artiklerne fra 1905. De er kun underskrevet af ham, og der findes ingen tekster om fysik fra hendes hånd, så de fleste historikere mener det ikke, men nogle mener, at hun var en støtte, han kunne tale fysik med.
- "Set fra Jorden" er det, man regner sig frem til, ikke det, øjet ser. Den, der rejser, mærker intet.
- Man bliver ikke "tungere" af at flyve hurtigt (artiklen fra 1905 regner sådan, men det er gammeldags). Det kræver bare mere og mere energi at komme op i fart.
- I turen farer lyset alt for langsomt, urene går alt for hurtigt, og ingen kan se et lysglimt flyve. Tallene er de rigtige. Lysuret i Rejsen i tid er ikke Einsteins, men fra 1909.
- Siderne fra 1905 er fotograferet fra gamle mikrofilm, så de er grå og lidt uskarpe. Derfor kan du skifte til sat tekst, som vi har sat med de samme linjer. Oversættelsen fra tysk og fortælleren er vores egne.

**Vil du vide mere? (For nørder):**
- I 1905 skrev han fire store artikler i *Annalen der Physik*, mens han arbejdede på patentkontoret: om lys i små portioner, om små partikler, der danser rundt i en væske (Brownske bevægelser), om tiden og om energien.
- Ordet "relativitetsteori" er ikke hans. Artiklen siger "Prinzip der Relativität", og ordet kom fra Planck og Bucherer i 1906. Teorien bygger på to ting, der er *ens* for alle (lovene og lysets fart), så "alt er relativt" er en misforståelse.
- "Einstein dumpede i matematik" er en myte. Han dumpede den almene del af optagelsesprøven til den tekniske højskole i Zürich som 16-årig (et år før tiden), men klarede sig med udmærkelse i fysik og matematik.
- "Den kosmologiske konstant var min største brøler" har vi kun fra fysikeren George Gamow. Ingen har fundet det i Einsteins egne tekster.

## 11. Billederne (kilde og licens)
| Billede | Kilde | Licens | Bruges |
|---|---|---|---|
| **Portrættet** | Ferdinand Schmutzer, foto 1921 (Einstein under et foredrag i Wien). Commons: "Einstein 1921 by F Schmutzer - restoration.jpg" (Adam Cuerdens restaurering af "Einstein 1921 by F Schmutzer.jpg", Østrigs Nationalbibliotek) fra `upload.wikimedia.org` | **PD.** Schmutzer døde i 1928, så både et fotografisk værk (70 år efter fotografens død) og et fotografisk billede (50 år efter det blev taget) er frit i Danmark. Commons: PD-Austria og PD-old-auto-expired (1928). Fotoet blev først udgivet efter 2001, og Commons' sletningssag endte med "keep". **Sikker** (åbnet 21. november 2026) | Forsiden og hylden, 600 × 750, WebP ca. 180 KB, udsnit: hovedet. Filteret prøves (et foto er ikke et stik, så `detalje` og `gamma` justeres) |
| **s. 904 (1905)** | *Annalen der Physik* bd. 17, archive.org `sim_annalen-der-physik_1905_17_5`, `n127` | Teksten er fri fra 2026. Mikrofilmen har ingen licens og ingen dato (faktafilen afsnit 6). Jeres svar 1: bruges med "Ærligt talt" og kontakten til sat tekst. **Usikker, besluttet af jer** | `lav_bogsider.py einstein`, ca. 150-190 KB |
| **s. 641 (1905)** | *Annalen der Physik* bd. 18, `sim_annalen-der-physik_1905_18_3`, `n234` | Som s. 904 | Som s. 904 |
| **s. 845 (1915)** | *Sitzungsberichte* 1915, Smithsonians skanning `sitzungsberichte1915deut`, `n920` (skarp) | **ÅBENT PUNKT, skal være på plads før E4.** Rettighedslinjen står kun på biodiversitylibrary.org, der svarer med Cloudflares robottjek (403, `cf-mitigated: challenge`, også 21. november 2026). Den kan ikke læses automatisk, og vi gætter ikke (for Galilei og Newton var Smithsonians skanninger CC0, men det siger intet om denne) | Kun når linjen er skrevet ind i faktafilens afsnit 11 og `KILDER.md` |
| *Reserve for s. 845* | Google-skanningen `SitzungsberichtePreussAkad19152`, `n372` (Minnesotas eksemplar) | Public Domain Mark sat af den, der lagde den op, ikke af biblioteket. Google beder om ikke-kommerciel brug. **Ret sikker** for et gratis program | Hvis Smithsonians linje ikke er fri, eller I ikke vil vente (spørgsmål 7) |
| **Sat tekst** (alle tre sider) | Vores egen sætning af teksten med Old Standard TT og de samme linjer | Fri, fordi teksten er fri. **Sikker** | Kontakten, og for s. 845, indtil det åbne punkt er lukket |
| Tegningerne i turen og ligningerne | Vores egne (lærred i 2D og MathML eller SVG) | Vores | `js/bog/einstein.js` |

**Det åbne punkt (før E4):** I åbner siden for skanningen på biodiversitylibrary.org i en browser (søg på "Sitzungsberichte 1915" eller find bogen via archive.org-id'et `sitzungsberichte1915deut`) og skriver linjen under "Rights" eller "Copyright" ind i [fakta-einstein-bog.md](fakta-einstein-bog.md), afsnit 11. Står der CC0 eller "Public domain", bruges Smithsonians skanning. Står der noget andet, eller ingenting, så spørgsmål 7.

**Den sætte tekst** kræver, at hele siden skrives af efter skanningen, ikke kun de linjer, der står i faktafilen. Det gøres i E3 og E4 og tjekkes linje for linje mod billedet (OCR'en må kun bruges til at finde siden).

Bogen i alt ca. 900 KB (portræt ca. 180 KB, tre sider ca. 180 KB, skriften ca. 50-100 KB). Domænerne: archive.org og `upload.wikimedia.org` er åbne. Old Standard TT hentes samme sted som IM Fell English (Google Fonts' arkiv på GitHub). Er domænet lukket, spørges der om det, før E1 går i gang.

## 12. Gør det selv
**Knappen "Send et ur på rejse ›"** åbner Kosmos ved **Rejsen i tid** (`data-gaa="kosmos:tid"`) med en linje: "Send tvillingen ud mellem stjernerne, og se, hvor meget yngre hun er, når hun kommer hjem. Det er Einsteins rundtur fra side 904." *Tjekkes i E5 på skærmen:* at Rejsen i tid starter, hvor man kan sende skibet af sted, og hvad tvillingen hedder i scenen (linjen rettes, så den passer).

**De små links** (et i hvert opslag med en ligning, "Se det selv"): Rejsen i tid (opslag 3), Stjerneovnen (opslag 4) og Rumtid (opslag 5). De er stille knapper, ikke vigtige knapper (én vigtig knap pr. opslag).

**Links begge veje** (planen, afsnit 6):
- Ved **Rumtid**: et "Hvordan ved vi det?"-kort i `js/data/hvorfor.js`, "Hvor kommer ligningen fra?", to sætninger om 25. november 1915 og knappen "Læs Einsteins bog ›" (`data-gaa="opdagelser:einstein"`). Det rører sporet Solsystemet og Kosmos, så det laves i deres blok eller aftales.
- I **Stjerneovnen**: foldeboksen "Hvor kommer energien fra?" får en lille knap "Se Einsteins side ›".
- **Citatet `einsteinEnergi`** (Reaktoren) får knappen "Læs Einsteins bog ›", hvis citatet passer med s. 641 (tjekkes i E5, ellers kun knappen).
- I **Ordbogen** ved "Lysets fart" og "Tidsforlængelse": en linje med linket (lille, valgfri).

## 13. Det, der er valgt fra
Lyskvanterne og de Brownske bevægelser (kun én linje i "For nørder"), magneten og lederen fra s. 891 (kun i "Linje for linje"), længdeforkortelsen, Lorentz-transformationen, ækvivalensprincippet og elevatoren, tvillingeparadokset som ord (rundturen er Einsteins egen), solformørkelsen i 1919 som eget opslag, sorte huller, tyngdebølger og kosmologi, Λ som "største brøler" (kun Gamow, i "For nørder"), Einsteins liv efter 1915 (Princeton, atombomben, brevet til Roosevelt) og citater uden sikker kilde (terningerne, nysgerrigheden). Lysuret bruges ikke i bogen, fordi det ikke er Einsteins (link til Rejsen i tid). Højst tre sider fra dengang, én pr. ligning.

## 14. Ordene
Fire nye ord til Ordbogen (`js/data/ordbog.js`), under 260 tegn og faktatjekket (afsnit 15). Findes ikke i dag. *Lysets fart*, *Tidsforlængelse*, *Samtidighed* og *Lysur* findes.
- **Relativitetsteori** (trin 2): "Einsteins teori om tid, rum og tyngde. Den særlige (1905) siger, at lyset er lige hurtigt for alle, så ure, der farer af sted, går langsommere, og masse er energi. Den almene (1915) siger, at tyngdekraft er krum rumtid." (219 tegn)
- **Rumtid** (trin 4): "Rummets tre retninger og tiden set som én helhed. Ifølge Einstein krummer tunge ting rumtiden, og det mærker vi som tyngdekraft: Ting følger krumningen, og ure går langsommere tæt på tunge ting." (194 tegn)
- **Masse** (opslag 4): "Et mål for, hvor svært noget er at sætte i gang eller standse. Jo større masse, jo tungere er det på Jorden. Einstein viste, at masse er en form for energi: Mister noget energi, får det en lillebitte smule mindre masse." (219 tegn)
- **Feltligning** (opslag 5): "Einsteins ligning fra 1915 for tyngdekraften. Den siger, hvordan energi og stof krummer rumtiden. Man kan ikke bare sætte tal ind: De ti ligninger, den gemmer, skal løses, og det kræver matematik fra universitetet." (214 tegn)

*Tensor* forklares kun i "For nørder" (ingen Ordbog). "Energi", "lysets fart", "ur" og "tyngdekraft" kendes. "Patentkontor" forklares i teksten ("hvor man bedømmer andres opfindelser", hvis prøven viser, at det trænger).

## 15. Prøven og fakta
**Prøven:** Efter ti minutter uden hjælp: *Hvad gjorde du først? Hvor gik du i stå? Hvad handlede det om?* Og:
1. Hvad sker der med et ur, der flyver en tur og kommer tilbage? (Det er bagud.)
2. Hvad betyder E = mc²? (Masse er energi. Når noget sender energi ud, bliver det en lillebitte smule lettere.)
3. Hvorfor skal GPS'en regne med Einstein? (Urene i satellitterne går anderledes end urene på jorden, ellers tager den fejl.)
4. *Til faren:* Gik han i stå i "Led for led"? Hvis ja, skal "Led for led" være kortere, eller kun vise tre led først.

**Fakta:** Alle tal og årstal står med kilde og sikkerhed i [fakta-einstein-bog.md](fakta-einstein-bog.md). Det tyske er læst på sidebillederne. *Kan tjekkes af Fable senere* (linjen i [plan-fable.md](plan-fable.md)): oversættelserne, tallene i turen og "Regn selv", Mileva Marić-linjen og "Fandt han på det hele alene?".

**Faktatjekket af drejebogen (21. november 2026, Opus i stedet for Fable).** Fælderne ([fakta-faelder-videnskabsfolk.md](erfaringer/fakta-faelder-videnskabsfolk.md) og relativiteten i [fakta-faelder.md](erfaringer/fakta-faelder.md)) er læst først. Hver påstand i afsnit 1-14 er holdt op mod faktafilen eller regnet efter i Python. Rettet undervejs:
| Påstand i udkastet | Ret til | Hvorfor |
|---|---|---|
| "En lampe på 100 W bliver 4 milliardtedele gram lettere" (faktafilens gåde 2) | "Et batteri får en lampe til at lyse": batteriet og lampen bliver lettere | En lampe i stikkontakten får energien ind ad ledningen, så dens masse ændrer sig ikke. Det er det, der sender energien ud, som mister massen |
| "Lyset" i lampen forsvinder | "Lys og varme" | Det er hele energien på 360.000 J, der forsvinder, ikke kun lyset |
| Kernesætningen "Lysets fart er det samme for alle, og intet kan indhente det" | "lige hurtigt for alle" | At intet kan nå lysets fart, er rigtigt, men ikke Einsteins regel. Hans erindring om at jagte en lysstråle er fra 1949 (fælden) |
| "Mileva Marić, fysikeren" | "der læste fysik og matematik sammen med ham i Zürich" | Hun fik ikke sit eksamensbevis (Wikipedia "Mileva Marić", læst 21. november 2026) |
| "Einstein var 42" (foto 1921) | "omkring 42" | Fotoet er kun dateret "1921", og han fyldte 42 i marts (fælden med Tychos alder) |
| "Lyset bøjes 1,7″, som Einstein sagde" | "1,7″ (i dag regnet til 1,75″)" | Tallet på s. 822 er afrundet |
| "Han fik nobelprisen for E = mc²" | "for den fotoelektriske effekt" | nobelprize.org (fakta-videnskabsfolk.md, afsnit 8) |
| "Rumtiden krummer, og derfor falder æblet" som fortællerens linje | Ikke brugt. Trin 4 siger kun "tæt på dem går tiden langsommere" | Fælden "Ting falder mod den langsomme tid" gælder kun langsomme ting i svag tyngde |
| Masse: "Hvor meget stof der er i noget" | "Et mål for, hvor svært noget er at sætte i gang eller standse" | Masse er ikke det samme som mængden af stof, og lys i en kasse har også masse. Træghed er Einsteins eget ord ("Trägheit") |
| "Atomure i fly går, som ligningerne siger" | "næsten præcis" | Hafele og Keating 1971: "næsten som regnet ud" (`js/data/hvorfor.js`) |
| Portrættets ophavsret "ikke tjekket" (planen, afsnit 5) | PD, tjekket | Schmutzer døde 1928 (Wikipedia, Commons). Wikipedia har to dødsdage (26. august i boksen, 26. oktober i teksten), men året er det samme |

Regnet efter (Python, 21. november 2026): ½ · 0,01² · 86.400 = 4,32 s (den præcise formel 4,3201 s). Ved 87 %: 0,378 og 0,507. 100 W · 3.600 s / *c*² = 4,0 · 10⁻¹² kg, og 3,6 · 10¹² erg / 9 · 10²⁰ = 4 · 10⁻⁹ g. Solen 3,828 · 10²⁶ W / *c*² = 4,26 · 10⁹ kg/s. 1 % af lysets fart = 10,8 mio. km/t. 4 · 4 = 16, 6 dobbelte, 10 tilbage. GPS-tallene (+45, −7, 38 milliontedele sekund og ca. 10 km) er de samme som i `js/kosmos/rumtid.js`.

**Står tilbage til byggeriet:** citatet `einsteinEnergi` mod s. 641 og hvad tvillingen hedder i Rejsen i tid.

## 16. Byggeriet (E1-E5, efter jeres go)
*Model: Opus, høj effort. Én session pr. trin, prompten står i [lige-nu/videnskabsfolkene.md](lige-nu/videnskabsfolkene.md). `js/bog.js` findes. Bogen er større end de andre (tre sider med ligninger), så den har fem trin.*
- [x] **E1: Forsiden og bogen** (lille, lavet 21. november 2026, se [kode/opdagelser-einstein.md](kode/opdagelser-einstein.md)). `einstein` bygget i `js/data/opdagelser.js` (`spørgsmål`, stil, portræt, tekster, forløb), `js/data/opdagelser/einstein.js` (FORSIDE, OPSLAG), Old Standard TT i `fonts/` med `OFL.txt` (spørgsmål 5), portrættet med `lav_portraet.py einstein` og `KILDER.md`, og vignetten med uret og lysglimtet. Test 1, 3 og 8 for Einstein.
  **Afvigelser og valg i E1** (efter at have set det på skærmen):
  - **Introduktionen** siger "arbejder på patentkontoret" uden "i Bern", fordi "Bern, 1905" står lige over. Og "lyset **i det tomme rum** er altid lige hurtigt", som Einstein selv skriver ("im leeren Raume", s. 892). Lys i glas eller vand er langsommere, så "altid" alene ville være forkert.
  - **Vignetten** fik en **lampe** til venstre, som lysglimtet farer ud fra (lampen fra introduktionen: "uanset hvordan lampen bevæger sig"). Glimtet farer lineært (samme fart hele vejen), sekundviseren tikker, og **uret viser 7**: Einsteins eget eksempel med toget, der "kommer hertil klokken 7" (s. 893). Det kan bruges i E2 eller E3. Bogstaverne er hans: *t* ved uret og *V* ved lyset.
  - **Omslagets titel** er "Lige hurtigt for alle" (navnet på turen). Omslaget har sølv i stedet for guld (`rygTekst`, `rygGlød`).
  - **Titlen er gjort mindre** (`titelSkala: 0.84`): Old Standard er bredere end Fell, så spørgsmålet stod på tre linjer på pc, og navnet blev skubbet ud. Nu står det på to, og der er plads til "Begynd" (E2).
  - **Old Standard TT har ingen græske bogstaver** (τ, κ, φ). Til ligningerne i E3 står de med reserveskriften, eller der findes en fri græsk skrift i samme stil.
  - **Faktatjek** (`/faktatjek`, 21. november 2026, Opus): Bern 1905, 26 år, patentkontoret, de to regler (s. 891-892), "tiden kan ikke være den samme for alle", 1879-1955, Schmutzer 1921 og "omkring 42" står alle med kilde i faktafilen og afsnit 15. Intet skulle rettes.
- [ ] **E2: Turen** (mellem). `js/data/forloeb/einstein.js` (fire trin og "Det så du") og `js/bog/einstein.js` (toget og lygterne, urene og rundturen, vægten med batteriet og GPS-uret). Ordene `relativitetsteori` og `rumtid` i Ordbogen. Test 4 og 5.
- [ ] **E3: Klodsen `ligning` og opslag 3 (tiden)** (mellem til stor). Den nye slags opslag i `js/bog.js` (siden med kontakten "Skanning / Sat tekst", ligningen med "Led for led", "Regn selv" og foldeboksene, tjekliste D og E), `lav_bogsider.py einstein` (s. 904 og s. 641), den sætte tekst af s. 904 (hele siden, linje for linje efter skanningen) og "Regn selv" 1 med testen i Node (4,32 s, 0,38 og 0,51). Kontaktens valg i `docs/kode/gemte-data.md`.
- [ ] **E4: Opslag 4 og 5 (energien og tyngden)** (mellem). **Først det åbne punkt** (afsnit 11): Uden rettighedslinjen bygges s. 845 kun som sat tekst. "Regn selv" 2 og 3 med testene i Node (4,0 · 10⁻¹² kg, 4,3 · 10⁹ kg/s og 16, 6, 10). Den sætte tekst af s. 641 og s. 845. Ordene `masse` og `feltligning`.
- [ ] **E5: "Om Einstein", Gør det selv og links begge veje** (lille til mellem). "Om Einstein", knappen til Rejsen i tid (tjek på skærmen), de små links, kortet ved Rumtid (aftales med sporet Solsystemet og Kosmos) og det, der står tilbage i afsnit 15. `/faktatjek` på alle de færdige tekster og `/faerdig`. Så har Einstein status "prøve".

## 17. Spørgsmål til jer (anbefalingen først)
*Orkestratoren startede drejebogen, mens I sov, så spørgsmålene er ikke stillet endnu. Jeres svar skrives nedenfor.*
1. **Kernesætningen:** A (anbefalet: siger hvorfor, slutter med GPS'en og "jeg har selv læst") eller B (kortere, men siger ikke hvorfor).
2. **Bogens spørgsmål:** "Hvad sker der, når lyset er lige hurtigt for alle?" (anbefalet: det er det, alle tre ligninger følger af, og det er en gåde for en 13-årig). Eller "Hvad betyder E = mc²?" (kendt, men passer kun til opslag 4).
3. **Formen:** en tur i fire trin, der fortæller hele historien, og bagefter de tre ligninger, ét opslag hver med siden, "Led for led" og "Regn selv" (anbefalet: man forstår idéen, før man ser ligningen, og den røde tråd er hel). Eller kun de tre ligninger med hver sin lille tur (færre opslag, men tre ture er for meget på fem minutter).
4. **Portrættet:** Schmutzers foto fra 1921 med kobberstik-filteret som de andre (anbefalet: frit, og det kendte billede af ham). Eller vores egen tegning efter fotoet, hvis filteret ikke klæder et foto.
5. **Skriften:** Old Standard TT til overskrifterne i 1900-tallets bøger (Einstein, Bohr og Lehmann), hentet samme sted som IM Fell English (anbefalet, planen afsnit 4).
6. **Gør det selv:** Rejsen i tid, hvor man selv sender et ur på rejse, med små links til Stjerneovnen og Rumtid i de andre opslag (anbefalet: det er Einsteins egen rundtur fra s. 904). Eller Rumtid (slutningen på den røde tråd med GPS-urene, men man gør mindre selv dér).
7. **1915-siden, hvis Smithsonians rettighedslinje ikke er fri eller ikke kan læses:** Google-skanningen fra Minnesota (anbefalet: mærket Public Domain Mark, og AtomLab er gratis) eller kun den sætte tekst. Det åbne punkt (afsnit 11) skal være lukket før E4 under alle omstændigheder.

**Jeres svar (21. november 2026):** "Ja til alle anbefalinger." Det betyder: 1) kernesætning A, 2) bogens spørgsmål "Hvad sker der, når lyset er lige hurtigt for alle?", 3) turen i fire trin og bagefter de tre ligninger, ét opslag hver, 4) Schmutzers foto fra 1921 med filteret, 5) Old Standard TT, 6) Gør det selv: Rejsen i tid med små links til Stjerneovnen og Rumtid, 7) Googles skanning fra Minnesota, hvis Smithsonians rettighedslinje ikke er fri.

**Jeres ønske samme dag:** "Gør dig virkelig umage med Einstein. Det skal være fedt. Det må også gerne have noget omfang, så du skal ikke være bange for, at det bliver for stort. Hellere en side mere end en for lidt." Einstein er altså bogen, der må være størst på hylden. Hvert trin E1-E5 bygges grundigt med flotte tegninger, og et opslag eller et trin mere er i orden, hvis det gør bogen bedre (spørg ikke om lov til det, men skriv det i sporets fil). Budgettet for lagene og stilguiden gælder stadig: Det ekstra skal ligge i lagene (Gør større, For nørder, Regn selv) og ikke fylde de første fem minutter.
