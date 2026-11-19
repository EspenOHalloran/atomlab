# Drejebog: Tycho Brahe og den nye stjerne

*Opus' udkast 19. november 2026 (V1 i [plan-videnskabsfolk.md](plan-videnskabsfolk.md), afsnit 8). Bog nr. 2 på hylden, bygget med `js/bog.js` som [Huygens' bog](drejebog-huygens.md), og med **den røde tråd fra begyndelsen** (erfaringen fra Huygens' afsnit 13). Faktagrundlaget er [fakta-videnskabsfolk/tycho.md](fakta-videnskabsfolk/tycho.md): **faktatjekket af Opus i stedet for Fable** (Fable er ikke til rådighed, linjen står i [plan-fable.md](plan-fable.md)). Intet er bygget. Byggeriet (T1-T3) starter først, når I har givet go til drejebogen.*

## 1. Kernesætningen
*Efter fem minutter kan brugeren sige:*

**A (anbefalet):** "Den nye stjerne i 1572 flyttede sig ikke mod de andre stjerner, selv når den stod højt og lavt. Så var den langt bag Månen, og himlen kan forandre sig. Det målte Tycho, og jeg har selv set sådan en stjerne eksplodere."

- B: "Alle troede, at himlen aldrig forandrer sig. Tycho målte, at den nye stjerne var langt bag Månen, og så måtte de tænke om igen." (Kortere, men "alle troede" er for skarpt, og B siger ikke, hvordan han målte det.)

Delens kernesætning passer bedst af alle på Tycho: "De gættede ikke bare. De så efter og **målte** …" (planen, afsnit 1).

**Det første wow** (stilguiden C1): I det første trin lyser en ny stjerne op i Cassiopeia, hvor der ikke var noget, før man har læst mere end én linje. **Det, barnet fortæller en ven:** "Han kunne bevise, at stjernen var langt væk, bare fordi den IKKE flyttede sig." **Noget, man selv finder** (C3): I gåden giver to af Tychos tal to mulige steder, og man opdager selv, hvorfor han skulle bruge et tal mere.

## 2. Den røde tråd
Spørgsmålet **"Hvor kom den nye stjerne fra?"** (står allerede som bogens `spørgsmål` i `js/data/opdagelser.js`) driver alle fem opslag. Hvert opslag slutter med en knap, der leder videre.

| Opslag | Delen af historien | Slutter med |
|---|---|---|
| 1 Forsiden | **Mysteriet og manden:** Himlen skulle være uforanderlig, men en aften står der en ny stjerne over hovedet på en ung dansker, der kender hver eneste stjerne | "Begynd ›" |
| 2 Den nye stjerne (turen) | **Sporene:** stjernen, tommelfingeren (parallakse), målingen højt og lavt og stjernen, der falmer | "Men hvordan kunne han være så sikker? Find stjernen med Tychos tal ›" (den vigtige knap) |
| 3 Tychos tal | **Beviset:** de tyske skrifter, der kaldte den en komet, og Tychos tre afstande, der peger på ét sted | "Alle tre passer." + "Se tallene i bogen fra 1573 ›" |
| 4 Bogen fra 1573 | **Bogen selv:** fire sider som en sti: aftenen (A), kortet (B1b), "O crassa ingenia" (brevet) og farven (D2) | "Men havde han ret? ›" |
| 5 Om Tycho | **Havde han ret?** Ja om stjernen og himlen. Nej om Jorden, der står stille, og grunden er den samme parallakse. Og du kan selv se en hvid dværg eksplodere | "Se en stjerne eksplodere ›" (Gør det selv) |

## 3. Bogen og stilen
Bogen er en 2D-bog som Huygens' (planen, afsnit 3 og 4, `js/bog.js`). Én ting ad gangen, billedet fylder mindst to tredjedele af et opslag, siden vendes om ryggen, og "Om Tycho" er sidste opslag. Tychos bog ligner en bog fra **København i 1573**:
- **Papiret** er lyst og varmt, og **blækket** sort. Bogen er sat med kursiv, og overskrifterne har store versaler ("DE NOVA ET NVLLIVS"). Overskrifter og det store forbogstav står med **IM Fell English** (samme fil som Huygens, `fonts/atomlab-fell.woff2`, ingen ny skrift). Brødteksten står med programmets skrift (mindst 15 px).
- **Ryggen** er mørk nattehimmelblå med guld (fx `ryg: '#1c2a44'`, `rygKant: '#c9a24a'`), så den ikke ligner Huygens' røde.
- **Tegningerne:** I turen er himlen mørk med rigtige stjerner (Cassiopeia efter stjernernes rigtige pladser, "W"-et). I gåden skifter de til **træsnitsstjernerne fra hans kort** (s. B1b): sorte, takkede stjerner på papiret i en dobbelt ramme med bogstaverne A-I. Ornamentet fra bogen (blomsterranken, s. A4b) kan være vignet.
- **Fortælleren** taler i nutid og tredje person ("Herrevad, november 1572. Tycho er 25 år …"). Ingen opdigtede citater: Det, Tycho selv skrev, står kun i "Bogen fra 1573" med hans latin og vores oversættelse.

## 4. Opslag 1: Forsiden
- **Titlen** er spørgsmålet **"Hvor kom den nye stjerne fra?"**, og under den en lille tegning af Cassiopeias W med en ny, klar stjerne øverst (efter kortet s. B1b).
- **Bogteksten** (stort forbogstav, 4 sætninger): "**Herrevad, november 1572.** Siden oldtiden havde man lært, at himlen bag Månen aldrig forandrer sig. Stjernerne havde stået de samme steder, så længe nogen kunne huske. Men en aften står der en ny og strålende stjerne næsten lige over hovedet på Tycho Brahe, en ung dansk adelsmand på 25, der har kendt hver eneste stjerne, siden han var dreng. Hvad er den, og hvor langt væk er den?"
- **Portrættet** (de Gheyn, se afsnit 11) og småt: "Tycho Brahe · 1546-1601". Under portrættet: "Kobberstik af Jacob de Gheyn fra 1586. Tycho var omkring 40."
- **Knappen** "Begynd ›". Første gang er det det eneste, man kan trykke på. Telefon og lav skærm: mindre portræt, så "Begynd" ses uden at rulle (som Huygens).

## 5. Opslag 2: Turen "Den nye stjerne"
Hvert trin er et opslag i bogen: billedet (scenen) og fortællerens linje med handlingen. Hver "Så" har højst to sætninger. Gæt i tre af fire trin.

| Trin | Spørg | Gæt | Gør | Så | Ord |
|---|---|---|---|---|---|
| 1 *Herrevad, 11. november 1572* | Tycho ser op, som han plejer. Kan du se, hvad der er galt med Cassiopeia i aften? | – | Tryk på stjernen, der ikke var der før | Den er klarere end alle andre stjerner, ja end Venus. Tycho tror ikke sine egne øjne, men da han viser andre stedet, kan de også se den. Men hvad er den? | – |
| 2 *Tæt på eller langt væk?* | Man havde lært, at himlen aldrig forandrer sig. Så måske er den noget i luften, tæt på Jorden? Hvordan kan Tycho finde ud af det? | *Han måler, hvor klar den er* / *Han ser, om den flytter sig mod de andre stjerner* / *Det kan man ikke* | Skift mellem venstre og højre øje, og se tommelfingeren hoppe. Skift så mellem at se Månen fra toppen og fra siden af Jorden | Det, der er tæt på, hopper mest. Det hedder parallakse. Var den nye stjerne lige så tæt på som Månen, ville den flytte sig næsten en grad, to gange Månens bredde | parallakse |
| 3 *Højt og lavt* | Hen over natten drejer Cassiopeia rundt om Nordstjernen. Hvad tror du, Tycho måler, når den nye stjerne står lavt? | *Afstanden til Schedir bliver større* / *Den er den samme* / *Stjernen forsvinder* | Træk Cassiopeia rundt, og mål afstanden til stjernen Schedir, når den står højt, og når den står lavt | Begge gange 7 grader og 55 minutter. Den flytter sig ikke, så den er langt bag Månen, ude mellem stjernerne. Himlen kan altså forandre sig | – |
| 4 *Stjernen falmer* | Måned for måned ændrer stjernen sig. Hvad tror du, der sker med den? | *Den lyser som før* / *Den bliver svagere og skifter farve* / *Den flytter sig væk* | Træk månederne frem, fra november 1572 til begyndelsen af 1574 | Den falmer fra hvid som Jupiter til rød som Aldebaran og bleg som Saturn. Så er den væk. I dag ved vi, at det var en stjerne, der eksploderede: en supernova | supernova |
| 5 **Det så du** | Kernesætningen. Under den: "Men hvordan kunne han være så sikker? Han havde målt afstanden til tre stjerner." | – | Vælg en vej | – | – |

**Scenen i hvert trin:**
- **Trin 1 (det første wow):** Nattehimlen over en lav trætop eller et klostertag med Cassiopeias W højt oppe (stjernernes rigtige pladser og lysstyrker). Efter ca. 2 sekunder (eller når man rører himlen) lyser en ny stjerne op ved W'ets top, langsomt og stille, til den er den klareste på himlen. En lille "før"-tegning i hjørnet (W uden den nye) hjælper, hvis man ikke ser den. Et tryk tæt på stjernen tæller (målet er rundt, B5). Navnet ("den nye stjerne") står først, når man har fundet den (A6).
- **Trin 2:** Venstre halvdel: en tommelfinger foran bjerge eller en kirkemur langt væk, og knappen "Venstre øje / Højre øje" (eller man trykker på øjnene). Tommelfingeren hopper, baggrunden står stille. Højre halvdel: Jorden, Månens bane og stjernehimlen som Tychos egen figur (s. C2b, kugle i kugle), tegnet af os. Man skifter mellem "set fra Jordens midte" og "set fra Herrevad". Månen hopper mod stjernerne, den nye stjerne gør ikke. Linjen nederst viser "Månen: ca. 1°" og "Den nye stjerne: 0°". *Det her er den nye idé i trinet.* **Dette trin flyttes ind i trin 3** (kun Månen, ikke tommelfingeren), hvis turen tager over fem minutter i prøven.
- **Trin 3:** Himlen drejer om Nordstjernen, når man trækker (som Saturn i Huygens' trin 3). En stiplet bue fra den nye stjerne til Schedir viser afstanden: **7° 55′** hele vejen rundt. En svag "spøgelsesstjerne" viser, hvor den ville stå, hvis den var lige så tæt på som Månen: Når den står lavt, er den en hel grad forskudt, og tallet bliver op til ca. 1° anderledes. Færdig, når man har målt både højt (over 70°) og lavt (under 35°). Instrumentet er tegnet som en stor passer med en bue med grader (ærligt sagt i "Ærligt talt").
- **Trin 4:** Stjernen ved W'ets top, en skyder med månederne (nov 1572 → begyndelsen af 1574) og til siden de stjerner, Tycho selv sammenlignede med: Venus og Jupiter (nov-dec), de klareste stjerner (feb-mar), Aldebaran (rød), stjerner af anden størrelse (maj) og Saturn (bleg). Stjernen bliver mindre, rød og bleg og er væk til sidst. Færdig ved begyndelsen af 1574.
- **Trin 5:** Kernesætningen og tre veje: **"Find stjernen med Tychos tal ›"** (gåden, primær), "Bladr i bogen fra 1573 ›" og "Tag turen igen". Gør det selv står på sidste opslag (den røde tråd, som hos Huygens).

**Det sværeste** at bygge er trin 3 (himlen, der drejer, med en afstand, der skal stå stille, mens "spøgelset" flytter sig) og trin 2's to halvdele på en telefon (to rækker over hinanden).

## 6. Opslag 3: Tychos tal (gåden fra bogen)
**Forordet** (bogtekst med stort forbogstav, broen fra turen): "**Knudstrup, foråret 1573.** Tycho får nogle skrifter fra Tyskland. De kalder stjernen en komet og siger, at den kun er 12-15 gange Jordens radius væk, langt tættere på end Månen. Tycho bliver vred: Så ville den hoppe over tre grader, og det kunne enhver se med øjnene! Han har målt afstanden fra den nye stjerne til tre stjerner i Cassiopeia med et fint instrument, der kan vise ned til et minut (en tresindstyvendedel af en grad). Kan du finde stjernen ud fra hans tal?" og "Prøv gåden ›".

**Gåden:** Tychos kort i træsnitsstil (s. B1b) med A-H, men **uden I**. Tre stjerner har en knap med Tychos tal: **B Schedir 7° 55′**, **G stolens top 5° 21′** og **D ved hoften 5° 1′**. Et tryk på en stjerne slår en cirkel med det tal som en passer (den tegnes rundt på 0,6 s). Hvor cirklerne mødes, står den nye stjerne.
- **To cirkler** (G og D, dem Tycho selv regnede med) mødes **to steder**. Linjen siger: "To steder passer. Hvilket af dem?" Den tredje (B) går kun gennem det ene. *Det er det, man selv finder.* (Tycho vidste i forvejen, hvilken side den stod på, se "Ærligt talt".)
- Et tryk på mødestedet: Stjernen I tegnes på kortet som i bogen, og linjen siger **"Alle tre passer."** Kun det ene sted gløder, et tryk forkert ryster lidt (B5).
- **Bagefter:** En lille boks "Og i dag?" med nutidens tal: 7° 50′, 5° 21′ og 5° 0′. "Tycho ramte inden for 5 minutter, en sjettedel af Månens bredde, uden kikkert." Knappen "Se tallene i bogen fra 1573 ›" (bladrer).
- Cirklerne regnes i en projektion af kortet efter stjernernes rigtige pladser (ikke efter træsnittet, hvor stjernerne står lidt skævt). Tallene står på kortet, og en test i Node tjekker, at de tre cirkler mødes inden for 10′ af supernovaens sted.

*Valgt fra i gåden:* "Lav din egen måling" (en tommelfinger i strakt arm er ca. 2° bred): en god idé til senere, ikke nu.

## 7. Opslag 4: Bogen fra 1573
Faksimilen fra 1901 (afsnit 11), fire sider som en sti. **Linjen øverst:** "*De nova stella* (Om den nye stjerne) blev trykt i København i 1573. Tycho skrev den på latin og ville først ikke udgive den. Følg stjernen fra den første aften til den falmer." Hver sides `om` er et stykke af historien (2 sætninger), og "Næste side ›" fører videre. På den sidste: "Havde han ret? ›" (bladrer). Højst seks glødende steder i alt.

| Side (billede) | Det glødende sted | Det, der står ved siden af |
|---|---|---|
| **A** (n36): *Aftenen* | "die eiusdem undecimo, vesperi post Solis occasum" | Den 11. november om aftenen efter solnedgang |
| A | "iuxta capitis verticem" | Næsten lige over hovedet |
| A | "ut de fide, propriis oculis adhibenda, dubitare non puduerit" | Han skammede sig ikke over at tvivle på sine egne øjne |
| **B1b** (n45): *Kortet* | I (Noua stella) og linjen "ab ea, quæ est in pectore, Schedir appellata B, 7. partibus & 55. minutis" | Den nye stjerne og afstanden til Schedir: 7 grader og 55 minutter |
| **Brevet** (n32): *Tykhovederne* | "paralaxin 3 Grad. plus ⅓ … 4. partium cum ¼" og "O crassa ingenia. O cæcos cœli spectatores." | Var den så tæt på, som de siger, ville den flytte sig 3⅓-4¼ grad. "O tykke hoveder! O blinde iagttagere af himlen!" |
| **D2** (n62): *Farven* | "qualis est Aldeboræ, aut illius, quæ in dextro humero Orionis rubescit" | Rød som Aldebaran eller stjernen i Orions højre skulder (Betelgeuse, se Supernova i Kosmos) |

**Linje for linje** (Opus' oversættelse, pr. sætning ved de linjer, den hører til. Det lange s er skrevet som s):

| Side | Latin | Dansk |
|---|---|---|
| A, overskrift | DE NOVA ET NULLIUS ÆVI MEMORIA, A MUNDI EXORDIO PRIUS CONSPECTA STELLA, quæ in fine Anni superioris omnium primò apparuit. | Om den nye stjerne, som aldrig før er set i nogen tids erindring siden verdens begyndelse, og som viste sig første gang sidst på året, der gik. |
| A, 1-7 | Anno præcedente, mense Novembri, die eiusdem undecimo, vesperi post Solis occasum, cùm meo more sidera cœlo sereno contemplarer, novam quandam & inusitatam, præq; aliis admodum conspicuam, iuxta capitis verticem, animadverti fulgere Stellam: | Sidste år, den 11. november om aftenen efter solnedgang, mens jeg efter min vane så på stjernerne på den klare himmel, opdagede jeg en ny og usædvanlig stjerne, der lyste meget tydeligere end de andre, næsten lige over mit hoved. |
| A, 7-14 | cumq; mihi, qui inde ferè à pueritia, omnia cœli sidera perfectè (non enim magna huic scientiæ inest difficultas) cognita haberem, satis evidenter constaret, nullam in eo cœli loco unquam antea extitisse, vel minimam, nedum tam conspicuæ claritatis stellam: in tantam rei istius admirationem sum adductus, ut de fide, propriis oculis adhibenda, dubitare non puduerit. | Jeg har kendt alle himlens stjerner godt næsten fra jeg var dreng (det er ikke svært), og jeg var helt sikker på, at der aldrig før havde stået nogen stjerne på det sted, ikke engang den mindste, slet ikke en så klar. Derfor blev jeg så forbløffet, at jeg ikke skammede mig over at tvivle på mine egne øjne. |
| A, 14-17 | Cùm verò & ab aliis loco monstrato conspici posse animadvertissem, stellam reverà illic apparere, nullum mihi amplius movebatur dubium. | Men da jeg så, at også andre kunne se den, når jeg viste dem stedet, var jeg ikke længere i tvivl om, at stjernen virkelig var der. |
| A, 17-21 | Miraculum sanè inter omnia, quæ à mundi exordio, in tota rerum natura extiterunt, aut maximum, aut illi certè æquiparandum, quod in Solaris cursus retentione, Iosuæ precibus impetrata … | Sandelig et mirakel. Enten det største af alle, der har vist sig i hele naturen siden verdens begyndelse, eller i hvert fald lige så stort som dengang, Solen standsede i sit løb, fordi Josva bad om det … (som citatet `tycho`) |
| B1b, under kortet | Distantiam verò huius stellæ à fixis aliquibus in hac Cassiopeiæ constellatione, exquisito instrumento, & omnium minutorum capaci, aliquoties observavi. Inveni autem eam distare ab ea, quæ est in pectore, Schedir appellata B, 7. partibus & 55. minutis: | Afstanden fra denne stjerne til nogle af stjernerne i Cassiopeia har jeg målt flere gange med et fint instrument, der kan vise alle minutter. Jeg fandt, at den er 7 grader og 55 minutter fra stjernen i brystet, der hedder Schedir (B). |
| B1b, kortet | A caput Cassiopeæ, B pectus Schedir, C Cingulum, D flexura ad Ilia, E Genu, F Pes, G suprema Cathedræ, H media Cathedræ, I Noua stella. | A Cassiopeias hoved, B brystet (Schedir), C bæltet, D bøjningen ved hoften, E knæet, F foden, G toppen af stolen, H midten af stolen, I den nye stjerne. |
| Brevet, 1-4 | … carere, visus diversitate: cùm tamen, si 15 saltem removeretur terræ semidiametris, ut illi sentiunt, in circulo Verticali, Horizonti vicina, paralaxin 3 Grad. plus ⅓ induxisset: sin verò 12. saltem (ut alii volunt) eandem, 4. partium cum ¼ effecisset. | … (at stjernen er) uden parallakse. Var den kun 15 jordradier væk, som de mener, ville den nær horisonten flytte sig 3⅓ grad, og var den kun 12 væk (som andre vil have det), 4¼ grad. |
| Brevet, 4-7 | Hæ verò tantæ differentiæ loci illius, à maxima altitudine in minimam, etiam sine instrumento, solis oculis, diligenter consideranti animadverti poterant. O crassa ingenia. O cæcos cœli spectatores. | Så store forskelle i dens plads, fra den står højest til lavest, kunne enhver, der så godt efter, se uden instrument, med øjnene alene. O tykke hoveder! O blinde iagttagere af himlen! |
| D2, 9-16 | Quantùm verò ad colorem huius stellæ attinet, non semper eundem retinuit, sed ab initio albicans videbatur, & propius Ioviali splendori accessit: progressu autem temporis, lumine coarctato & inspissato, in rutilantem & Martium fulgorem degeneravit: qualis est Aldeboræ, aut illius, quæ in dextro humero Orionis rubescit. | Farven har ikke altid været den samme. I begyndelsen så den hvidlig ud og lignede mest Jupiters glans. Men efterhånden som lyset blev mindre og tættere, blev den til en rødlig glød som Mars, som Aldebaran eller stjernen, der lyser rødt i Orions højre skulder. |
| D2, 16-21 | Non tamen usq; adeo rutilans fuit, quemadmodum hæc in humero, sed propius ad colorem Aldeboræ accessit. Nunc autem relicto isto Martio rubore, in lividam transiit albedinem, ita ut hoc mense Maio, quiddam Saturnium & Veneri simile præ se ferat. | Den var dog ikke så rød som stjernen i skulderen, men nærmere Aldebarans farve. Nu har den forladt den røde farve og er blevet bleg og hvidlig, så den her i maj ligner Saturn og Venus lidt. |

## 8. Opslag 5: Om Tycho (bogens sidste opslag)
*Budgettet: titel, højst to tal, højst tre sætninger, højst fire spørgsmål. Derefter "Vil du vide mere?" og "Ærligt talt", lukkede.*

**Fremme:** "Tycho Brahe (1546-1601)". To tal: **25 år** (da han så stjernen) og **7° 55′** (afstanden til Schedir, højt og lavt). Tre sætninger (slutningen på historien): "Tycho havde ret: Stjernen var langt bag Månen, og himlen kan forandre sig. Men han troede, at Jorden stod stille, blandt andet fordi han ikke kunne se stjernerne flytte sig, mens Jorden går rundt om Solen. Det gør de, men så lidt, at det først blev målt i 1838." Den vigtige knap: **"Se en stjerne eksplodere ›"** (Gør det selv, afsnit 9).

**Fire spørgsmål ("Hvorfor?"):**
1. **Hvorfor troede man, at himlen aldrig forandrer sig?** Siden den græske filosof Aristoteles havde man lært, at alt bag Månen er evigt og fuldkomment. Det, der kom og gik, som kometer, troede man var i luften tæt på Jorden. Den nye stjerne passede ikke ind.
2. **Hvorfor ville han ikke udgive bogen?** Det blev set som upassende for en adelsmand at skrive bøger. Hans venner, lægen Johannes Pratensis og slægtningen Peder Oxe, blev ved med at spørge. Da han læste de tyske skrifter, der kaldte stjernen en komet, gav han efter, og bogen udkom i 1573.
3. **Hvad var stjernen egentlig?** En hvid dværg, resten af en stjerne som Solen, i et par med en anden stjerne. Den sugede gas, til den eksploderede: en supernova. I 2008 fandt man lys fra eksplosionen, der var blevet kastet tilbage af støvskyer (et lysekko), og det viste, hvilken slags den var.
4. **Hvad skete der bagefter?** Bogen gjorde ham kendt. I 1576 gav kong Frederik 2. ham øen Hven, hvor han byggede Uranienborg og målte stjernerne og planeterne nat efter nat i 21 år. Senere brugte Johannes Kepler hans målinger til at finde ud af, hvordan planeterne går rundt om Solen.

**Ærligt talt:**
- Tycho var ikke den første, der så stjernen. Den dukkede op i begyndelsen af november, og mange så den, også i Kina. Men han målte den meget nøjagtigt og skrev bogen om den.
- Han målte den høj og lav over flere måneder, ikke på én nat. I bogen drejer du himlen med et træk.
- Tommelfingeren og Månen i trin 2 er overdrevet, så man kan se det. Månens hop fra toppen til siden af Jorden er ca. 1 grad.
- Han regnede stedet ud med to af tallene og vidste i forvejen, hvilken side af de to stjerner den stod på. I gåden bruger du det tredje tal til at vælge.
- Instrumentet er tegnet som en passer med en bue. Hvordan hans så ud i 1572, ved vi ikke præcist.
- Datoerne er i den gamle kalender. I vores kalender var aftenen den 21. november 1572.
- Han havde en kunstig næse efter en duel. Den var af messing, ikke af guld og sølv, som historien siger (en analyse i 2012).
- Billederne i turen er vores egne tegninger. Kortet i gåden er tegnet efter hans kort. Fortælleren er vores, og oversættelsen fra latin er vores egen.

**Vil du vide mere? (For nørder):**
- Tychos tal mod i dag: Schedir 7° 55′ (7° 50′), stolens top 5° 21′ (5° 21′), hoften 5° 1′ (5° 0′). Nutidens tal er vores udregning ud fra stjernernes pladser.
- Var stjernen lige under Månen (52 jordradier, som Kopernikus regnede), ville den flytte sig 58½ minutter fra højt til lavt (side C3b). Månen er i dag ca. 60 jordradier væk.
- Den var klarere end Venus i november og kunne ses om dagen. I maj 1573 var den som en stjerne af anden størrelse, og i begyndelsen af 1574 var den væk.
- Afstanden i dag: ca. 8.000-12.000 lysår (skønnene er uenige). Resten blev fundet med radio i 1952 og kan ses i røntgen.
- Bogens titel, *De nova stella*, gav navnet: I dag hedder sådan en "nova" eller "supernova".
- Stjerneparallaksen, Tycho ledte efter, blev målt af Friedrich Bessel i 1838: 0,3 buesekunder for stjernen 61 Cygni.

## 9. Gør det selv
**Knappen "Se en stjerne eksplodere ›"** åbner Kosmos ved **Hvid dværg** (`data-gaa="kosmos:hviddvaerg"`) med en linje: "Tryk på ›Lad den suge gas‹. Når den hvide dværg eksploderer, viser grafen, hvordan lyset falder bagefter, ligesom Tychos stjerne blev svagere måned for måned." Ærligt talt står allerede ved fænomenet (grafen er forenklet og viser ca. 100 dage).

**Links begge veje** (planen, afsnit 6):
- Ved **Hvid dværg**, emnet "Hvem har set en?": knappen "Læs Tychos bog ›" (`data-gaa="opdagelser:tycho"`).
- Ved citatet `tycho` (står i dag ved **Supernova**): feltet `bog: 'tycho'` giver knappen "Læs Tychos bog ›", som ved Huygens. Se spørgsmål 5 om at flytte citatet til Hvid dværg.
- *Ekstra (lille):* Siden D2 i bogen nævner Orions skulder (Betelgeuse). Forklaringen kan få et link til Supernova ("Betelgeuse set fra Jorden").

Teksten "Hvem har set en?" ved Hvid dværg passer med faktagrundlaget (november 1572, Cassiopeia, "i over et år", "langt bag Månen").

## 10. Det, der er valgt fra
Kometen i 1577 (hans næste store bevis), Uranienborg og Stjerneborg (kun én linje i "Hvorfor?"), hans verdensmodel (kun i de tre sætninger), alkymien og astrologien (halvdelen af bogen er astrologi, det nævnes ikke), Sophie Brahe, Kirsten Jørgensdatter, Prag og døden (myten om kviksølv), måneformørkelsen 1573 og digtet til Urania. Siden C2b (kugle-i-kugle-figuren) vises ikke som billede, men tegnes af os i trin 2. Siden D (lyset måned for måned) vises ikke: tallene står i trin 4 og "For nørder". Højst fire sider pr. bog.

## 11. Billederne (kilde og licens)
| Billede | Kilde | Licens | Bruges |
|---|---|---|---|
| **Portrættet** | Jacob de Gheyn II, kobberstik, "ætatis suæ anno 40, anno Dni 1586" (Museum of Fine Arts, Houston). Commons: "Jacques de Gheyn Ii - Portrait of Tycho Brahe, astronomer (without a hat) - Google Art Project.jpg" (960 px thumbnail, API'et svarer 429, `upload.wikimedia.org` virker) | **PD-Art, PD-old-100-expired**. I Danmark har et foto af et stik fra 1586 ingen egen ret (§ 70 stk. 4). **Sikker** | Forsiden og hylden, 600 × 750, WebP ca. 180 KB, udsnit: hovedet og kraven inde i buen (uden våbenskjoldene) |
| *Alternativ* | Pennetegningen i faksimilen 1901 (n7), Kobberstiksamlingen, tilskrevet Goltzius eller Gemperlin | Fri (tegning fra 1500-tallet, foto fra 1901). **Ret sikker** | Kun hvis de Gheyn ikke kan bruges |
| **Bogsiderne** (A n36, B1b n45, brevet n32, D2 n62) | Faksimilen 1901 ("Fototypi. Pacht & Crone"), Toronto-eksemplaret på archive.org (`operumprimitiasd00brahuoft`, skannet 2009) | Teksten og fotoene fra 1901 er frie. Skanningen fra 2009 har ingen licens, kun "NOT_IN_COPYRIGHT". Om § 70 gælder en skanning af en tekstside, er uklart. **Usikker**, spørgsmål 4 | `lav_bogsider.py` (som Huygens), ca. 190 KB pr. side |
| Tegningerne i turen og gåden | Vores egne (lærred i 2D), kortet efter s. B1b, figuren i trin 2 efter s. C2b | Vores | `js/bog/tycho.js` |

Bogen i alt ca. 950 KB (portræt ca. 180 KB og fire sider ca. 190 KB). Skriften er hentet i forvejen (Huygens).

## 12. Ordene
**parallakse** (trin 2) og **supernova** (trin 4). Ingen af dem står i Ordbogen (`js/data/ordbog.js`). Forslag (under 260 tegn, faktatjekket):
- **Parallakse:** "Når noget ser ud til at flytte sig mod baggrunden, fordi man ser det fra et andet sted. Jo tættere på, jo mere flytter det sig. Prøv med tommelfingeren og ét øje ad gangen. Astronomer måler afstande sådan."
- **Supernova:** "En stjerne, der eksploderer. I nogle uger lyser den stærkere end hundrede millioner sole. Det sker, når en hvid dværg bliver for tung, eller når kernen i en kæmpestjerne falder sammen."

"Grad" forklares i teksten ("to gange Månens bredde"), "Cassiopeia" ("et stjernebillede, der ligner et W") og "minut" (en tresindstyvendedel af en grad) står i forordet. "Komet" kendes. **Hvid dværg** står allerede i Ordbogen.

## 13. Prøven
Efter ti minutter uden hjælp: *Hvad gjorde du først? Hvor gik du i stå? Hvad handlede det om?* Og:
1. Hvordan fandt Tycho ud af, at den nye stjerne var langt væk? (Den flyttede sig ikke mod de andre stjerner, selv når den stod højt og lavt. Noget tæt på ville flytte sig.)
2. Hvad troede folk om himlen før 1572? (At den aldrig forandrer sig.)
3. Hvad var stjernen, og hvad skete der med den? (En stjerne, der eksploderede. Den blev svagere og rødere og forsvandt.)

## 14. Fakta
Alle tal og årstal står med kilde og sikkerhed i [fakta-videnskabsfolk/tycho.md](fakta-videnskabsfolk/tycho.md) (19. november 2026). Det latinske er læst på sidebillederne, ikke i OCR'en. Rettelserne under faktatjekket står i faktafilens afsnit 8. *Kan tjekkes af Fable senere* (linjen i [plan-fable.md](plan-fable.md)): oversættelsen af de fire sider og forordets "12-15 jordradier".

## 15. Byggeriet (T1-T3, efter jeres go)
*Model: Opus, høj effort. Én session pr. trin, prompten står i [lige-nu/videnskabsfolkene.md](lige-nu/videnskabsfolkene.md). `js/bog.js` findes, så det er lille til mellem pr. trin.*
- **T1: Forsiden og bogen** (lille). `tycho` bygget i `js/data/opdagelser.js` (stil, portræt, tekster, forløb), `js/data/opdagelser/tycho.js` (FORSIDE med intro, OPSLAG), portrættet med `lav_portraet.py tycho` og `KILDER.md`, og tegningen af W'et på forsiden. Rømer og Ørsted bliver de to grå rygge (`KOMMENDE_PÅ_HYLDEN`). Test 1, 3 og 8 for Tycho.
- **T2: Turen** (mellem). `js/data/forloeb/tycho.js` (fire trin og "Det så du") og `js/bog/tycho.js` (nattehimlen, tommelfingeren og Månen, himlen, der drejer, og stjernen, der falmer). Ordene `parallakse` og `supernova` i Ordbogen. Test 4 og 5.
- **T3: Gåden, bogen og "Om Tycho"** (mellem). Cirklerne på kortet (test i Node: mødestedet inden for 10′), `lav_bogsider.py` med de fire sider og de glødende steder (felterne måles med scriptet), "Om Tycho", Gør det selv og links begge veje (Hvid dværg og citatet `tycho`, sig det til sporet Solsystemet og Kosmos). Test 6 og 7, `/faktatjek` på de færdige tekster og `/faerdig`. Så har Tycho status "prøve".

## 16. Spørgsmål til jer (anbefalingen først)
*Stilles som en dialog med valgmuligheder. Jeres svar skrives nedenfor.*
1. **Kernesætningen:** A (anbefalet, siger hvordan han målte og slutter med "jeg har selv set") eller B (kortere).
2. **Portrættet:** de Gheyns stik med kobberstik-filteret som de andre (anbefalet), og kun hvis filteret giver striber oven i stikkets egne linjer, stikket selv tonet til papir og blæk. Eller pennetegningen fra faksimilen 1901.
3. **De fire sider:** A, kortet, brevet med "O crassa ingenia" og farven D2 (anbefalet: opdagelsen, målingen, beviset med Tychos egne ord og stjernen, der falmer). Eller figuren C2b i stedet for brevet (flottere tegning, men beviset står på næste side).
4. **Skanningen:** Toronto-skanningen af faksimilen fra 1901 med kilden i `KILDER.md` og "Ærligt talt" (anbefalet: teksten og fotoene fra 1901 er frie, og risikoen ved en ren skanning fra 2009 er lille for et gratis program). Eller vent og spørg Det Kongelige Bibliotek (kb@kb.dk) om deres eksemplar fra 1573.
5. **Citatet `tycho`:** flyttes fra Supernova til Hvid dværg, hvor Tychos stjerne hører til (anbefalet, en lille ændring i sporet Solsystemet og Kosmos i T3), eller bliver ved Supernova og får kun knappen "Læs Tychos bog ›".
