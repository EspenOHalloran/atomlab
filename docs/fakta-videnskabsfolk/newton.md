# Faktagrundlag: Isaac Newton (bog nr. 10)

*Lavet 15. november 2026 af Fable 5.2 (effort høj) efter [prompt-fable-galilei-newton.md](../prompt-fable-galilei-newton.md), i samme form som [huygens.md](huygens.md) og [galilei.md](galilei.md). Til [plan-videnskabsfolk.md](../plan-videnskabsfolk.md), afsnit 2. Opus skriver sine noter nederst.*

**Sikkerhed:** **Sikker** = læst på billedet af siden, eller regnet efter med kendte tal. **Ret sikker** = én pålidelig kilde, eller kun læst i OCR-teksten. **Usikker** = kilderne er uenige, eller kun efter hukommelsen.

## 1. Det vigtigste først
- **Månetesten fylder en halv side** i *Principia* (1687), bog III, sætning IV, s. 406-407, og den kan en 13-årig følge: Månen er 60 jordradier væk. Er tyngden 60 × 60 gange svagere derude, skal Månen falde lige så langt på **ét minut**, som en sten falder på **ét sekund**. Det gør den: 15 1/12 Paris-fod (4,9 m).
- **Galilei, Huygens og Rømer står på siderne:** Jupiters fire måner er Newtons første eksempel (s. 402-403, med en tabel over dem), og tallet for stenens fald er Huygens' ("Hugenius", s. 407). Reolens bøger hænger altså sammen.
- Smithsonians skanning af førsteudgaven er **CC0** og ligger på archive.org.
- **Brug ikke en moderne oversættelse ved siden af siderne:** Alle engelske bygger på 3. udgave (1726), hvor teksten og tallene er andre. I 1687 hedder reglerne "Hypotheses", og "Hypotheses non fingo" står der ikke endnu.

**Kernesætningen** (*Efter fem minutter kan brugeren sige:*)
- **A (anbefalet):** "Det, der får en sten til at falde, er det samme, som holder Månen i dens bane. Newton regnede efter, og tallene passede, og jeg kan selv se, at planeterne tættest på Solen går hurtigst."
- B (billedet): "Månen falder hele tiden mod Jorden. Den flyver bare så hurtigt sidelæns, at den aldrig rammer."
- C (loven): "Tyngden bliver svagere med afstanden: 60 gange så langt væk giver 3.600 gange så svag. Det passer for Månen."

A følger delens kernesætning (måle, ikke gætte, og se det selv). B er det, barnet fortæller en ven, og bør være wow-øjeblikket i forløbet.

## 2. Kilderne (åbnet 15. november 2026)
- **Bogen:** *Philosophiae Naturalis Principia Mathematica* (London, Joseph Streater for Royal Society, 1687), Smithsonian Libraries' eksemplar, archive.org-id **`philosophiaenat00newt`** (522 billeder). S. 402, 403, 406 og 407 er læst som billeder (`archive.org/download/<id>/page/n<nr>_w1400.jpg`, 1.930 × 2.674 px). Resten er læst i OCR-teksten, som er til at læse (langt s bliver til f).
- **Newton Project** (`newtonproject.ox.ac.uk` uden "www."): William Stukeleys håndskrift fra 1752 (Royal Society MS/142), blad 15.
- **Wikipedia (engelsk)** som wikitekst (artiklerne står ved påstandene) og Wikipedias API for portrættet.

## 3. Liv og bogen
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Født **25. december 1642** efter den gamle kalender, som England brugte. Det er **4. januar 1643** i vores. Død 20. marts 1727 (31. marts i vores kalender) | Wikipedia "Isaac Newton", note OSNS | Sikker |
| Professor i matematik i Cambridge (Trinity College) fra 1669 | Titelbladet ("Trin. Coll. Cantab. Soc. Matheseos Professore Lucasiano"); Wikipedia | Sikker |
| Titelbladet: "IMPRIMATUR S. PEPYS, Reg. Soc. PRAESES. Julii 5. 1686" og "Anno MDCLXXXVII". Tilladelsen er altså fra 1686, bogen fra **1687** | Titelbladet (`n6`, OCR) | Ret sikker |
| Bogen udkom i juli 1687. **Newton var 44.** Edmond Halley fik ham til at skrive den og betalte selv trykningen | Wikipedia "Principia" ("published by Halley at his own financial risk, appeared in July 1687"). Alderen regnet | Ret sikker |
| Oplaget: Wikipedia giver både "op til 750" og "nok 500". Skriv "nogle hundrede" | Wikipedia "Principia" | Usikker |
| Tre bøger. Bog III hedder *De Mundi Systemate* (Om verdens system) og går fra s. 401 til 510. Newton skriver, at han først skrev den "på en folkelig måde, så flere kunne læse den", men lavede den om til matematik for at undgå diskussioner | S. 401 (`n398`, OCR: "methodo populari, ut a pluribus legeretur") | Ret sikker |
| Bevægelseslovene ("Axiomata sive Leges Motus") står på s. 12 (`n25`) | OCR | Ret sikker |

## 4. Opdagelsen i bog III (s. 402-411)
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| **Hypotese II:** Ens virkninger i naturen har ens årsager, "som stenes fald i Europa og i Amerika" og lyset fra køkkenilden og fra Solen | S. 402 | Sikker |
| **Hypotese V:** Jupiters måner følger samme regel som planeterne: Omløbstiden vokser som afstanden i halvanden potens (Keplers 3. lov, T² ∝ a³). Flamsteed har målt det, bl.a. med månernes formørkelser | S. 402 | Sikker |
| **Tabellen s. 403.** Månernes omløbstider: 1 d 18 t 28⅗ min · 3 d 13 t 17 9⁄10 min · 7 d 3 t 59⅗ min · 16 d 18 t 5⅕ min. Afstandene regnet ud fra tiderne: 5,578 · 8,878 · 14,168 · 24,968 Jupiter-radier. Målt af Flamsteed: 5,578 · 8,876 · 14,159 · 24,903 | S. 403 | Sikker |
| I dag: 1,769 · 3,551 · 7,155 · 16,689 døgn (står i programmet) og 5,90 · 9,39 · 14,97 · 26,33 Jupiter-radier. De to inderste tider ramte inden for få minutter, Callistos inden for halvanden time. Afstandene er ca. 5 % for små, men forholdet mellem dem passer | `js/data/sider/jupiter.js`; afstandene regnet (421.700, 671.000, 1.070.400 og 1.882.700 km delt med 71.492 km, tallene efter hukommelsen) | Ret sikker |
| **Hypotese VII:** Det samme gælder planeterne om Solen. "Dette forhold, som Kepler fandt, er alle enige om" | S. 403 ("Haec a Keplero inventa ratio in confesso est apud omnes") | Sikker |
| **Sætning I-III:** Kraften på Jupiters måner, på planeterne og på Månen peger mod midten og aftager med afstanden i anden | S. 405 (`n402`, OCR: "esse reciproce ut quadrata distantiarum") | Ret sikker |
| **Sætning IV, månetesten.** Månens afstand: 59 jordradier (de fleste), 60 (Vendelin), 60⅓ (Kopernikus), 62½ (Kircher), 56½ (Tycho). Newton vælger **60**. Omløbstid **27 døgn 7 timer 43 minutter**. Jordens omkreds **123.249.600 Paris-fod**, "som franskmændene for nylig har målt" | S. 406 | Sikker |
| Omkredsen er Jean Picards måling: 57.060 toiser pr. grad × 360 × 6 fod. Det er 40.036 km (i dag 40.008 km over polerne) | Regnet (1 Paris-fod = 32,48 cm, efter hukommelsen) | Ret sikker |
| Slap man Månen, ville den på ét minut falde **15 1/12 Paris-fod**. Ved Jordens overflade er kraften 60 × 60 gange større, så dér skal en ting falde 15 1/12 fod på **ét sekund** | S. 406-407 | Sikker |
| Og det gør den: 15 1/12 Paris-fod på et sekund, "som **Huygens** har vist med forsøg med penduler". "Derfor er den kraft, der holder Månen i dens bane, netop den, vi plejer at kalde tyngde" | S. 407 | Sikker |
| 15 1/12 Paris-fod er **4,90 m**. I dag: ½ · 9,81 m/s² · (1 s)² = 4,905 m | Regnet | Sikker |
| Regnet efter med Newtons egne tal giver formlen 15,01 fod (4,88 m), ikke 15,08. Forskellen på ½ % forklarer han ikke | Regnet (2π² · 60 · R / T², R = omkredsen / 2π, T = 39.343 min) | Ret sikker |
| Han tilføjer: Regnestykket antager, at Jorden står stille. Går Jorden og Månen om deres fælles tyngdepunkt, er afstanden 60½ | S. 407 ("Calculus hic fundatur in Hypothesi quod Terra quiescit") | Sikker |
| **Sætning VII:** Tyngden virker på alle legemer og er proportional med, hvor meget stof der er i hvert | S. 411 (`n408`, OCR: "Gravitatem in corpora universa fieri, eamque proportionalem esse quantitati materiae in singulis") | Ret sikker |
| **Keplers love** (1609 og 1619) beskrev, *hvordan* planeterne går. Newton viste, at alle tre følger af én kraft mod Solen, der aftager med afstanden i anden. Kepler så selv i 1621, at den 3. lov også passer for Jupiters måner | Wikipedia "Kepler's laws of planetary motion" | Ret sikker |

## 5. Siderne fra bogen
**Skanningen:** Smithsonian Libraries, `library.si.edu/digital-library/book/philosophiaenat00newt`, DOI 10.5479/sil.52126.39088015628399. Siden siger **"CC0 … in the public domain (free of copyright restrictions)"** (læst 15. november 2026). archive.org-metadata har ingen linje om rettigheder, så henvis til Smithsonians side. **Sikker.**

**Sidetal:** I bog III er billedet `n(sidetal − 3)` (s. 406 er `n403`). Før s. 383 er det `n(sidetal + 13)`, fordi trykkeren sprang fra s. 383 til 400. Titelbladet er `n6`.

**Forslag: to opslag.** A: s. 402-403 (`n399`, `n400`: hypoteserne og tabellen over Jupiters måner). B: s. 406-407 (`n403`, `n404`: månetesten). Ekstra: titelbladet.

| Side | Det glødende sted (latin) | Dansk (Fables oversættelse) |
|---|---|---|
| 402 | *Hypoth. II. Ideoque effectuum naturalium ejusdem generis eaedem sunt causae. Uti … descensus lapidum in Europa & in America; Lucis in Igne culinari & in Sole* | Derfor har virkninger af samme slags i naturen de samme årsager. Som … stenes fald i Europa og i Amerika, lyset fra ilden i køkkenet og fra Solen. |
| 402 | *Hypoth. V. Planetas circumjoviales … tempora periodica esse in ratione sesquialtera distantiarum ab ipsius centro.* | Planeterne om Jupiter [altså månerne] har omløbstider, der vokser som afstanden fra Jupiters midte i halvanden potens. |
| 403 | Tabellen *Satellitum tempora periodica* og *Distantiae Satellitum a centro Jovis* | Månernes omløbstider og månernes afstande fra Jupiters midte (i Jupiter-radier). Nederste linje er regnet ud fra tiderne. |
| 406 | *Prop. IV. Theor. IV. Lunam gravitare in terram, & vi gravitatis retrahi semper a motu rectilineo, & in orbe suo retineri.* | Sætning IV. Månen er tung mod Jorden, og tyngdens kraft trækker den hele tiden væk fra den lige bevægelse og holder den i dens bane. |
| 406 | *& si Luna motu omni privari fingatur, ac dimitti ut, urgente vi illa omni qua in Orbe suo retinetur, descendat in terram; haec spatio minuti primi cadendo describet pedes Parisienses 15 1⁄12.* | Forestil dig, at Månen mistede al sin fart og blev sluppet, så den faldt mod Jorden, drevet af hele den kraft, der holder den i banen. Så ville den på ét minut falde 15 1/12 Paris-fod. |
| 407 | *Atqui corpora in regionibus nostris vi gravitatis cadendo describunt tempore minuti unius secundi pedes Parisienses 15 1⁄12, uti Hugenius, factis pendulorum experimentis & computo inde inito, demonstravit* | Men her hos os falder ting ved tyngden 15 1/12 Paris-fod på ét sekund, som Huygens har vist med forsøg med penduler og beregninger ud fra dem. |
| 407 | *& propterea vis qua Luna in orbe suo retinetur, illa ipsa est quam nos gravitatem dicere solemus.* | Og derfor er den kraft, der holder Månen i dens bane, netop den, vi plejer at kalde tyngde. |
| 407 | *Nam si gravitas ab ea diversa est, corpora viribus utrisque conjunctis Terram petendo duplo velocius descendent … omnino contra experientiam.* | For var tyngden en anden kraft, ville ting blive trukket af begge på én gang og falde dobbelt så hurtigt … og det strider helt mod erfaringen. |

"Minutum primum" er et minut, "minutum secundum" et sekund. En Paris-fod er 32,5 cm (en engelsk 30,5 cm).

## 6. Gåden fra bogen og Gør det selv
**Månetesten som regnestykke (med tal fra i dag, regnet efter):**
1. Månen er 384.400 km væk. Jordens radius er 6.371 km. Det er **ca. 60 gange** så langt (60,3).
2. Newtons gæt: Tyngden bliver svagere med afstanden gange sig selv. 60 × 60 = **3.600 gange** svagere ved Månen.
3. En sten falder **4,9 m** på det første sekund. Ved Månen skulle den altså falde 4,9 m / 3.600 = **1,4 mm** på et sekund.
4. Hvad gør Månen? Den går en omgang (2.415.000 km) på 27,3 døgn, altså **ca. 1 km i sekundet**. På den kilometer bøjer banen **1,4 mm** væk fra den lige linje (1.023 m × 1.023 m / (2 × 384.400.000 m) = 1,36 mm). Det passer.
5. Newtons smukke udgave: På et minut falder Månen 60 × 60 gange længere end på et sekund, altså 3.600 × 1,36 mm = **4,9 m**. Månen falder på ét minut lige så langt, som stenen falder på ét sekund.

Tallene passer inden for ca. 1 %. Resten skyldes bl.a., at Månen også trækker i Jorden (den vejer 1/81 af Jorden).

- **I forløbet (lille udgave):** Barnet gætter først ("Hvorfor falder Månen ikke ned?": *Den er for langt væk* / *Den falder hele tiden* / *Noget holder den oppe*) og skyder så en kugle vandret fra et højt bjerg med mere og mere fart, til den går hele vejen rundt. Billedet er Newtons eget, men fra en senere bog (*A Treatise of the System of the World*, 1728, efter hukommelsen), ikke fra 1687. Sig det i "Ærligt talt". Derefter trin 2-5 med ét tal ad gangen.
- **Udfordringen bagefter:** tabellen s. 403. Tag de fire måners tid (døgn) og afstand (1.000 km: 421,7 · 671,0 · 1.070,4 · 1.882,7, tjek dem mod programmets), og regn afstand³ / tid². Det giver 23,96 millioner for alle fire. Det er Newtons hypotese V, og månerne er dem, Galilei fandt i bog nr. 9.
- **Gør det selv:** **Solsystemets overblik** (`js/data/sider/overblik.js`, `js/data/planeter.js`) har tidsskyderen, teksten "de inderste hurtigst" og T² = a³ under "For nørder". Linjen kunne være: "Træk i tiden. Merkur når over fire omgange, mens Jorden går én. Tættest på Solen trækker tyngden hårdest, så dér skal man hurtigst rundt." (365,26 / 87,97 = 4,15.) *Mulighed B:* Jupiter → Månerne med ⏩, det samme i lille udgave og Newtons eget eksempel.
- **"Ærligt talt" og videre:** Newtons lov er ikke det sidste ord. Merkurs bane drejer en smule mere, end loven siger, og det forklarede Einstein i 1915 (Einsteins bog og Kosmos → rumtiden).

## 7. Portrættet
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Godfrey Kneller, olie, **1689**, 76 × 64 cm. Det ældste kendte portræt. Newton var 46, to år efter bogen, med sit eget hår. I privat eje (jarlen af Portsmouth) | Wikipedia "Portrait of Isaac Newton" | Ret sikker |
| Commons: **`File:Portrait of Sir Isaac Newton, 1689.jpg`**, **2.218 × 2.671 px**, "Public domain", fra Cambridge University Librarys udstilling "Lines of Thought". Der findes også en lysnet udgave ("(brightened)", samme mål). Brug den oprindelige og lad filteret klare lyset | Wikipedias API (`prop=imageinfo`) | Sikker |
| Kneller døde i 1723. Et foto af et frit maleri har ingen egen ret i Danmark (§ 70 stk. 4) | [fakta-bogsider-rettigheder.md](../fakta-bogsider-rettigheder.md) | Sikker (loven) |
| **Brug ikke Knellers portræt fra 1702** (National Portrait Gallery, med paryk): Commons skriver ved filen, at "third parties have made copyright claims" | Wikipedias API, feltet Credit ved `Sir Isaac Newton by Sir Godfrey Kneller, Bt.jpg` | Sikker. **Fælde** |

## 8. Myterne og fælderne (også i fakta-fælderne)
| Myte | Hvad man skriver i stedet | Kilde |
|---|---|---|
| **Æblet faldt ned i hovedet på ham** | Han fortalte selv som gammel, at tanken kom, da han så et æble falde. Stukeley, 15. april 1726 i en have i Kensington: "occasion'd by the fall of an apple, as he sat in a contemplative mood" og "why should that apple always descend perpendicularly to the ground". Intet om hovedet. Det var 60 år efter, så skriv "han fortalte selv" | Stukeleys håndskrift, blad 15 (Newton Project, læst). Står også under "Myterne" i [fakta-videnskabsfolk.md](../fakta-videnskabsfolk.md) |
| **Newton opdagede tyngdekraften** | Alle vidste, at ting falder. Han viste, at det er den samme kraft, der styrer Månen og planeterne, og hvordan den aftager | S. 407 |
| **F = G · m · M / r² står i Principia** | Der er ingen formel og intet G. Han skriver i forhold og i ord. Tallet G blev først målt af Cavendish i 1797-1798 | S. 405-411; Wikipedia "Cavendish experiment" |
| **Født det år, Galilei døde** | Kun hvis man blander kalenderne: Galilei døde 8. januar 1642 (ny kalender), Newton blev født 4. januar 1643 (ny) | Afsnit 3 |
| **Månen falder ikke** | Den falder hele tiden, 1,4 mm for hver kilometer, den flyver | Afsnit 6 |

Flere fælder: "Hypotheses non fingo" og "Regulae philosophandi" kom først i 2. udgave (1713). Fortællingen om, at han prøvede månetesten i 1666 og lagde den væk i 20 år, fordi han regnede med en for lille Jord, kommer fra andre end ham selv (efter hukommelsen: Pemberton 1728). Hans egne ord er, at det passede "pretty nearly". Skriv det ikke som sikkert.

## 9. Det, jeg er mindst sikker på
1. **De ½ %** mellem Newtons tal og min efterregning (afsnit 4). Efter hukommelsen har Westfall (1973) vist, at Newton i de senere udgaver rettede tallene til, så de passede for godt. Det bør stå forsigtigt eller slet ikke.
2. **Halleys besøg i august 1684** og Royal Society, der ikke havde råd, fordi pengene var brugt på en bog om fisk: efter hukommelsen, ikke slået op.
3. **Kanonkuglen fra bjerget** (1728) og **"pretty nearly"** (Cambridge, MS Add. 3968): efter hukommelsen. Jeg fandt ikke stedet hos Newton Project.
4. **Oversættelsen** er min egen fra latin. "Gravitare in terram" er oversat "er tung mod Jorden" (ordret) frem for "tiltrækkes af".
5. S. 401, 405 og 411 er kun læst i OCR-teksten.

## Opus' noter
*Skrevet 17. november 2026 af Opus (effort høj) efter Fables fil. Regnet efter: månetesten med Newtons egne tal (15,01 fod, som Fable skriver), med tal fra i dag (1,36 mm pr. sekund, 4,90 m pr. minut, ca. 1 % fra 4,9 m / 3.600 · 60²), Picards omkreds (40.036 km) og afstand³ / tid² for Jupiters måner (23,96 millioner for både Io og Callisto). Det passer alt sammen. Programmets tekster er læst (`overblik` i `js/data/sider/overblik.js` og månerne i `js/data/sider/jupiter.js`). Jeres svar står under noterne.*

**Det, der er nyt (planen vidste det ikke):**
- **Månetesten er en halv side, og den kan en 13-årig følge.** Den er bogens gåde, ikke kun dens historie.
- **Tallet 60 står der to gange**, og det er derfor, Newtons sætning er så smuk: Månen er 60 jordradier væk, så tyngden er 60 × 60 gange svagere. Og et fald vokser med tiden ganget med sig selv, så på 60 sekunder falder man 60 × 60 gange længere end på ét. Derfor falder Månen på ét minut lige så langt, som stenen falder på ét sekund.
- **Reolen hænger sammen på siderne:** s. 402-403 bruger Galileis fire måner, og s. 407 bruger Huygens' tal ("Hugenius"). Når et glødende sted nævner en bog på hylden, kan der stå en lille knap til den bog (et forslag til drejebogen, ikke spurgt endnu).
- **Titelbladet** har Samuel Pepys' tilladelse ("IMPRIMATUR S. PEPYS"). Ham kender nogle fra dagbogen. En linje til "For nørder".
- **Oversættelserne passer ikke til siderne** (de bygger på 3. udgave). Vi oversætter selv fra førsteudgaven.

**Hvor jeg er uenig eller vil rette:**
1. **Kernesætning A** siger "jeg kan selv se, at planeterne tættest på Solen går hurtigst". Det vidste Kepler i 1619, så barnet kan tro, at Newton fandt det. Mit forslag: *"Det, der får en sten til at falde, er det samme, som holder Månen i dens bane. Newton regnede efter, og tallene passede, og jeg kan selv se den samme kraft styre planeterne om Solen."* B bliver wow-øjeblikket i forløbet, som Fable skriver.
2. **Forløbet** bliver for langt med et gæt, kanonkuglen og så fire regnetrin (seks trin og mange tal). Mit forslag er fire trin (højst fem minutter, gæt i to af dem). De rigtige tal kommer i gåden bagefter:
   1. **Gæt:** "Hvorfor falder Månen ikke ned?" (*Den er for langt væk* / *Den falder hele tiden* / *Noget holder den oppe*.)
   2. **Kanonkuglen fra bjerget:** Barnet skruer op for farten, til kuglen går hele vejen rundt. Wow: Den falder hele tiden, den rammer bare aldrig.
   3. **Gæt:** "Månen er 60 gange så langt fra Jordens midte som vi. Hvor meget svagere er tyngden dér?" (*60 gange* / *600 gange* / *3.600 gange*.)
   4. **Månetesten som ét billede:** to ure. Stenen falder 4,9 m på ét sekund, og Månen falder 4,9 m væk fra den lige linje på ét minut. Så kernesætningen.
3. **Kanonkuglen:** Fable skriver (efter hukommelsen), at tegningen er fra *A Treatise of the System of the World* (1728). Efter min hukommelse er den bog netop den "folkelige" udgave af bog III, som Newton selv nævner på s. 401, at han skrev først og lagde væk. Den blev trykt året efter hans død. Passer det, kan "Ærligt talt" sige: "Tegningen af kuglen er fra den lette udgave, han skrev først. Den kom først på tryk efter hans død." **Ret sikker, efter hukommelsen.** Slås op i drejebogen, og findes der en fri skanning, kan figuren være et ekstra opslag i "Bogen selv".
4. **Tegningernes stil** mangler. Mit forslag: bogens egne træsnit, altså tynde sorte linjer, buer og store bogstaver ved punkterne (A, B, C) på lyst papir. Drejebogen udpeger en figur i skanningen at gå efter.
5. **Gør det selv:** Jeg er enig i overblikket. Linjen skal give Kepler hans del: *"Træk i tiden. Merkur når fire omgange, mens Jorden går én. Det vidste Kepler. Newton fandt grunden: Tættest på Solen trækker tyngden hårdest, så dér skal man hurtigst rundt for ikke at falde ind."* (365,26 / 87,97 = 4,15.)
6. **De ½ % og Westfall (afsnit 9, punkt 1):** De kommer ikke med i bogen, heller ikke under "For nørder". Det er for fint til en 13-årig, og vi har ikke selv læst Westfall.
7. **Udfordringen med tabellen s. 403** (afstand³ / tid²) er god, men tunge tal for en 13-årig, og bogen har allerede en gåde. Jeg vil sætte den under "For nørder" ved opslag A og bruge programmets afstande (421.800, 671.100 km, 1,07 og 1,88 mio. km), ikke Fables, så tallene passer med det, barnet ser ved Jupiter.
8. **Halley og bogen om fisk (afsnit 9, punkt 2):** Efter min hukommelse også rigtigt (Royal Society havde brugt pengene på Willughbys *Historia Piscium*, 1686). Men det står kun i hukommelsen, og en sjov historie skal slås op, før den kommer med.

**Siderne til bogens fem lag** (billedet `nX` i archive.org-id `philosophiaenat00newt`):
| Lag | Hvad | Sider |
|---|---|---|
| 1. Forsiden | Knellers portræt fra 1689 med filteret, "1643-1727" (ny kalender), titel fx "Månen falder" | (titelbladet `n6` kan være forsidens baggrund) |
| 2. Fortællingen | Vores egne tegninger i stil med bogens figurer: bjerget og kuglen, Jorden og Månen, de to ure | |
| 3. Gåden | Månetesten med Newtons egne tal (60 jordradier, 27 døgn 7 timer 43 minutter, 15 1/12 Paris-fod) og så regnestykket med tal fra i dag (afsnit 6): de 1,4 mm | S. 406-407 (`n403`, `n404`) ved siden af |
| 4. Gør det selv | Solsystemets overblik med tidsskyderen. Mulighed B (Jupiter → Månerne) er Galileis sted, så den bruges ikke to gange | |
| 5. Bogen selv | Opslag A: s. 402-403 (`n399`, `n400`, hypotese II og V og tabellen over Jupiters måner, med en knap til Galileis bog). B: s. 406-407 (`n403`, `n404`, månetesten, de fire glødende steder, med en knap til Huygens' bog). Ekstra: titelbladet (`n6`) og s. 401 (`n398`, "på en folkelig måde"), som først skal læses som billede | `n6`, `n398`-`n400`, `n403`, `n404` |

**Det, der skal laves i drejebogen:** slå kanonkuglen op (punkt 3), vælg en figur til stilen (punkt 4), og læs s. 401 og titelbladet som billeder.

## Jeres svar (17. november 2026)
1. **Kernesætningen:** Opus' udgave af A: "Det, der får en sten til at falde, er det samme, som holder Månen i dens bane. Newton regnede efter, og tallene passede, og jeg kan selv se den samme kraft styre planeterne om Solen." B ("Månen falder hele tiden …") er wow-øjeblikket i forløbet.
2. **Månetesten:** Forløbet har fire trin (to gæt, kanonkuglen og månetesten som ét billede med to ure). Hele regnestykket med Newtons egne tal er bogens gåde bagefter, og tabellen over Jupiters måner står under "For nørder".
3. Gør det selv, tegningernes stil og siderne til de fem lag tages som i Opus' noter, til drejebogen viser andet.
