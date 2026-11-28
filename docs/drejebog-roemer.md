# Drejebog: Ole Rømer og lyset, der bruger tid

*Opus' udkast 20. november 2026 (V2 i [plan-videnskabsfolk.md](plan-videnskabsfolk.md), afsnit 8), startet af orkestratoren, mens I sov. Bog nr. 3 på hylden, bygget med `js/bog.js` som [Tychos bog](drejebog-tycho.md), og med **den røde tråd fra begyndelsen** (erfaringen fra Huygens' afsnit 13). Faktagrundlaget er [fakta-videnskabsfolk/roemer.md](fakta-videnskabsfolk/roemer.md): **faktatjekket af Opus i stedet for Fable** (Fable er ikke til rådighed, linjen står i [plan-fable.md](plan-fable.md)). Intet er bygget. Spørgsmålene til jer står i afsnit 16, og bogen bygges i R1-R3 efter jeres go (afsnit 15).*

## 1. Kernesætningen
*Efter fem minutter kan brugeren sige:*

**A (anbefalet):** "Io kom for sent, når Jorden var langt fra Jupiter, for så skulle lyset rejse længere. Lyset bruger altså tid. Det viste Rømer i 1676, og jeg har selv set Io forsvinde i Jupiters skygge."

- B: "Lyset kommer ikke frem på et øjeblik. Det fandt en dansker ud af med en af Jupiters måner." (Kortere, men siger ikke hvordan, og "fandt ud af" lyder, som om han fandt farten. Det gjorde Huygens.)

Delens kernesætning ("De gættede ikke bare. De så efter og målte …") passer godt: Rømer kunne ikke se lyset rejse, men han kunne måle, at en måne kom for sent, og han sagde det **før**, det skete.

**Det første wow** (stilguiden C1): I det første trin glider Io ind i Jupiters skygge og slukker pludselig, før man har læst mere end én linje. **Det andet wow:** I trin 4 tikker uret forbi det tidspunkt, tabellen siger, og intet sker … til Io dukker op 10 minutter for sent. **Det, barnet fortæller en ven:** "Når du ser Solen, ser du den, som den var for 8 minutter siden. Det fandt man ud af, fordi en af Jupiters måner kom for sent." **Noget, man selv finder** (C3): I gåden tæller man selv lysets minutter på Rømers tegning og får de 10 minutter, og så opdager man, at Rømers 22 minutter for hele Jordens bane var for mange.

## 2. Den røde tråd
Spørgsmålet **"Hvorfor kom Io for sent?"** (står allerede som bogens `spørgsmål` i `js/data/opdagelser.js`) driver alle fem opslag. Hvert opslag slutter med en knap, der leder videre.

| Opslag | Delen af historien | Slutter med |
|---|---|---|
| 1 Forsiden | **Mysteriet og manden:** Jupiters måner var himlens ur, men Io gik ikke til tiden. En ung dansker siger til de lærde i Paris, at Io i november kommer 10 minutter for sent | "Begynd ›" |
| 2 Himlens ur (turen) | **Sporene:** Io i skyggen (uret), Io kommer for sent, når Jorden fjerner sig, lysglimtet, der skal rejse længere, og aftenen den 9. november | "Men hvor mange minutter er lyset om vejen? Tæl dem på Rømers tegning ›" (den vigtige knap) |
| 3 Tæl lysets minutter (gåden) | **Beviset i tal:** 181 mio. km længere i november giver 10 minutter. Hele Jordens bane giver 16½, og Rømer sagde 22 | "10 minutter, som Rømer sagde." + "Se det hele i tidsskriftet fra 1677 ›" |
| 4 Tidsskriftet fra 1677 | **Kilden selv:** fire sider som en sti: spørgsmålet (s. 893), tegningen (Fig. 11), de 40 omgange og 9. november (s. 894) og Rømers egen liste med 9. november | "Men troede de ham? ›" |
| 5 Om Rømer | **Troede de ham?** Huygens og Newton ja, Cassini aldrig. I 1729 viste Bradley det på en anden måde. Og du kan selv se Io forsvinde i skyggen | "Se Io forsvinde i Jupiters skygge ›" (Gør det selv) |

**Tråden bagud til Tycho:** Rømer kom til Paris, fordi han i 1671 hjalp en fransk astronom med at måle på Hven, hvor Tychos Uranienborg havde stået (spørgsmål 1 i "Om Rømer").

## 3. Bogen og stilen
Bogen er en 2D-bog som Huygens' og Tychos (planen, afsnit 3 og 4, `js/bog.js`). Én ting ad gangen, billedet fylder mindst to tredjedele af et opslag, siden vendes om ryggen, og "Om Rømer" er sidste opslag. Rømers bog ligner **et videnskabeligt tidsskrift fra 1670'erne**:
- **Papiret** er lyst og lidt koldere end Tychos, og **blækket** sort. Tidsskriftet er sat med antikva og kursiv, og overskrifter og det store forbogstav står med **IM Fell English** (samme fil, `fonts/atomlab-fell.woff2`, ingen ny skrift. Fell-typerne er fra Oxford i 1670'erne, altså fra samme år). Brødteksten står med programmets skrift (mindst 15 px).
- **Ryggen** er mørk flaskegrøn med guld (fx `ryg: '#23402f'`, `rygKant: '#c9a24a'`), så den ikke ligner Huygens' røde eller Tychos blå.
- **Tegningerne:** Turen veksler mellem to billeder: **kikkerten** (et rundt synsfelt med mørk himmel, Jupiter som en lille skive og månerne som prikker, som man så dem i 1676) og **banerne set ovenfra** i stil med Rømers egen Fig. 11 (tynde streger og bogstaverne A-L). I gåden er det Fig. 11 selv, tegnet om af os som et kobberstik. **Uret** er et ur med visere (Huygens havde lavet det første pendulur i 1656-1657, så de var nye) med et lille tal under.
- **Fortælleren** taler i nutid og tredje person ("Paris, 1676. Ole Rømer er 32 år …"). Ingen opdigtede citater: Det, der stod i bladet, står kun i "Tidsskriftet fra 1677" med den engelske tekst og vores oversættelse.

## 4. Opslag 1: Forsiden
- **Titlen** er spørgsmålet **"Hvorfor kom Io for sent?"**, og under den en lille tegning af Jupiter med de fire måner på en linje, som i kikkerten (vignet).
- **Bogteksten** (stort forbogstav, 4 sætninger): "**Paris, 1676.** Jupiters måner går rundt om Jupiter så regelmæssigt, at astronomerne bruger dem som et ur på himlen. Men den inderste, Io, går ikke til tiden: Nogle gange dukker den op for tidligt, andre gange for sent. En ung dansker på observatoriet, Ole Rømer, tror, han ved hvorfor, og han siger til de lærde i Akademiet, at Io i november kommer 10 minutter for sent. Hvordan kan han vide det?"
- **Portrættet** (Coning, se afsnit 11) og småt: "Ole Rømer · 1644-1710". Under portrættet: "Maleri af Jacob Coning fra omkring 1700. Rømer var omkring 56."
- **Knappen** "Begynd ›". Første gang er det det eneste, man kan trykke på. Telefon og lav skærm: mindre portræt, så "Begynd" ses uden at rulle (som Huygens og Tycho).

## 5. Opslag 2: Turen "Himlens ur"
Hvert trin er et opslag i bogen: billedet (scenen) og fortællerens linje med handlingen. Hver "Så" har højst to sætninger. Gæt i tre af fire trin.

| Trin | Spørg | Gæt | Gør | Så | Ord |
|---|---|---|---|---|---|
| 1 *Paris, 1676: Himlens ur* | Jupiters fire store måner går rundt om Jupiter som visere på et ur. Den inderste hedder Io. Følg den i kikkerten | – | Træk tiden frem, til der sker noget med Io | Io gled ind i Jupiters skygge og blev væk: en formørkelse. Det sker hver 42½ time, så man kan stille uret efter den | formørkelse |
| 2 *For tidligt og for sent* | Astronomerne skriver tiden op, hver gang Io kommer ud af skyggen. Om sommeren er Jorden tæt på Jupiter. Hvad tror du, der sker, når Jorden fjerner sig? | *Io kommer til tiden* / *Io kommer for sent* / *Io kommer for tidligt* | Træk Jorden rundt om Solen fra sommer til efterår, og se uret | Jo længere Jorden kommer fra Jupiter, jo senere kommer Io. Når Jorden nærmer sig igen, kommer den for tidligt | – |
| 3 *Hvorfor?* | Io går lige hurtigt rundt hele tiden. Hvorfor ser vi den så komme for sent? | *Io går langsommere om efteråret* / *Lyset fra Io skal rejse længere* / *Urene i Paris går forkert* | Lad Io komme ud af skyggen, og følg lysglimtet hen til Jorden. Prøv med Jorden tæt på og langt væk | Lyset skal rejse længere, når Jorden er langt væk, og det tager tid. Lyset kommer altså ikke frem på et øjeblik | – |
| 4 *Den 9. november 1676* | Fra begyndelsen af september har Rømer sagt til de lærde: I november kommer Io ca. 10 minutter senere, end tabellen siger. Om aftenen den 9. november kigger man efter. Hvad tror du, der sker? | *Io kommer, når tabellen siger* / *Io kommer ca. 10 minutter for sent* / *Io kommer slet ikke* | Se uret og kikkerten. Tryk, når Io dukker op | Lidt over halv seks dukker Io op, 10 minutter for sent, som Rømer havde sagt. Han havde forudsagt det, før det skete | – |
| 5 **Det så du** | Kernesætningen. Under den: "Men hvor mange minutter er lyset om vejen? Rømer tegnede det." | – | Vælg en vej | – | – |

**Scenen i hvert trin:**
- **Trin 1 (det første wow):** Kikkertens runde synsfelt: Jupiter i midten med sine bånd, fire prikker på en linje. Io (navnet står ved den) glider langsomt hen mod Jupiter, når man trækker tiden frem (eller af sig selv efter 2 sekunder). Lidt før den når Jupiter (på den side, der vender væk fra Solen), slukker den, som når man trykker på en kontakt. Først da kommer et lille "ovenfra"-billede i hjørnet: Solen, Jupiter, skyggen bag Jupiter og Io inde i den. Navnet "formørkelse" står først, når Io er væk (A6). Et lille ur viser 42½ time, når Io er ude igen.
- **Trin 2:** Banerne ovenfra (Fig. 11-stil): Solen A i midten, Jordens bane, Jupiter B langt ude med Io og skyggen. Man trækker Jorden langs banen (datoer på banen: juli, august, september … november). Ved siden af to ure: "Tabellen" og "Set fra Jorden". Når Jorden fjerner sig, kommer "Set" bagud, op til ca. 10 minutter i november. Trækker man Jorden den anden vej (mod Jupiter, foråret), kommer "Set" foran. Færdig, når man har trukket til november. Fra midten af vinteren (Jupiter bag Solen) står der "Jupiter kan ikke ses nu".
- **Trin 3:** Samme tegning. Knappen "Io kommer ud". Io tænder, og en lille lysende prik farer langs en stiplet linje fra Jupiter til Jorden, mens et stopur tæller. Med Jorden i august: ca. 36 minutter. I november: ca. 46. Begge tider står under tegningen. Færdig, når man har prøvet begge. *Tiderne er nutidens tal (Rømer kendte dem ikke), se Ærligt talt.*
- **Trin 4 (det andet wow):** Kikkerten igen, med Jupiter alene og Io inde i skyggen (usynlig), og uret, der går fra kl. 17.20. Ved **17.25¾** (tabellens tid) blinker tallet, og linjen siger "Nu skulle den komme …". Intet sker. Uret går videre (lidt hurtigere), og ved **17.35¾** tænder Io. Et tryk inden for et par sekunder tæller (målet er rundt, B5). Trykker man for tidligt, siger linjen "Ikke endnu".
- **Trin 5:** Kernesætningen og tre veje: **"Tæl lysets minutter ›"** (gåden, primær), "Bladr i tidsskriftet fra 1677 ›" og "Tag turen igen". Gør det selv står på sidste opslag (den røde tråd, som hos Huygens og Tycho).

**Det sværeste** at bygge er trin 2 og 3's tegning, fordi Jupiter er fem gange så langt fra Solen som Jorden: I rigtig størrelse bliver Jordens bane lille. Tegningen må gerne være skæv (som Rømers egen), men tiderne skal være de rigtige, og det siges i Ærligt talt. På en telefon står urene under tegningen.

## 6. Opslag 3: Tæl lysets minutter (gåden fra tidsskriftet)
**Forordet** (bogtekst med stort forbogstav, broen fra turen): "**Paris, december 1676.** Et blad fortæller om Rømers opdagelse og viser hans tegning: Solen er A, Jupiter er B, og E, F, G, H, K og L er Jorden på sin vej rundt om Solen. Rømer har regnet ud, at lyset er ca. 22 minutter om at krydse hele Jordens bane, fra H til E. I dag ved vi præcis, hvor langt lyset farer på et minut: 18 millioner km. Kan du tælle dig frem til hans 10 minutter?" og "Prøv gåden ›".

**Gåden:** Fig. 11 tegnet om af os (kobberstik, bogstaverne som hos Rømer), men med Jupiter i rigtig afstand ude til højre. Fra Jupiter til Jorden går lyset som **en perlesnor: én perle for hvert minut, lyset farer** (18 mio. km).
1. Jorden står ved **14. august 1676**. Snoren har 36 perler. Linjen: "I august er lyset 36 minutter om at komme fra Jupiter. Træk Jorden til den 9. november."
2. Man trækker Jorden langs banen. Snoren bliver længere, og de nye perler er guld. Ved **9. november** står den stille. Linjen: "Hvor mange minutter længere er lyset om vejen nu? Tæl de nye perler." Man trykker på de gyldne perler én ad gangen (de får tal 1, 2, 3 …), eller vælger tallet med − og +. **Svaret er 10.** Et forkert tal ryster lidt (B5).
3. Linjen: **"10 minutter, som Rømer sagde."** Under den: "Jorden var 181 millioner km længere væk fra Jupiter i november end i august."
4. **Del to:** "Rømer sagde 22 minutter for hele vejen fra H til E. Træk Jorden fra H, tættest på Jupiter, over på den anden side af Solen til E, og tæl." Snoren får 16½ nye perler (16 hele og en halv). Linjen: **"16½ minut. Rømers 22 var for mange, men han var den første, der viste, at lyset bruger tid."** (Ved E står der småt: "Herfra kan man ikke se Jupiter. Solen er i vejen.")
- **Bagefter:** En lille boks "Og i dag?": Tabellen med *Rømer* og *i dag*: 10 minutter for sent / 10,1 minut. Hele Jordens bane: 22 minutter / 16 min 38 s. Fra Solen til Jorden: ca. 11 minutter / 8 min 19 s. Knappen "Se det hele i tidsskriftet fra 1677 ›" (bladrer).
- Afstandene regnes i R3 ud fra JPL Horizons (14. august 4,306 AE, 9. november 5,518 AE, faktafilen afsnit 4) og står som tal i dataene. En test i Node tjekker, at perlerne bliver 36, 46 og 16,6.

*Valgt fra i gåden:* Rømers egne tider fra listen (de giver ikke 10 minutter direkte, fordi tiderne nok er sand soltid, og Io's bane ikke er helt jævn, se faktafilen afsnit 4), og "Sortér Rømers liste" (Imm før og Emers efter oppositionen på tegningen). Den sidste er en god idé, men den handler om skyggen og ikke om lyset.

## 7. Opslag 4: Tidsskriftet fra 1677
*Philosophical Transactions* bd. 12, s. 893-894, tavlen med Fig. 11 og Rømers egen liste (afsnit 11). Fire sider som en sti. **Linjen øverst:** "Rømer skrev ikke selv om sin opdagelse. En reporter fortalte om den i det franske blad *Journal des sçavans* den 7. december 1676, og året efter kom den på engelsk i *Philosophical Transactions* i London. Det er de sider, du ser her, og til sidst Rømers egen liste." Hver sides `om` er et stykke af historien (2 sætninger), og "Næste side ›" fører videre. På den sidste: "Men troede de ham? ›" (bladrer). Højst seks glødende steder i alt. Det lange s er skrevet som s i oversættelsen.

| Side (billede) | Det glødende sted | Det, der står ved siden af |
|---|---|---|
| **s. 893**: *Spørgsmålet* | "whether the action of Light be conveyed in an instance to distant places, or whether it requireth time" | Kommer lyset frem på et øjeblik, eller bruger det tid? |
| s. 893 | "Light needs not one second of time" | Lyset bruger ikke engang ét sekund på at krydse Jorden |
| **Fig. 11** (udsnit af tavlen): *Tegningen* | Hele figuren med bogstaverne | A Solen, B Jupiter, C og D, hvor Io går ind i og ud af skyggen, og E-L Jorden. Ikke i rigtig størrelse |
| **s. 894**: *De 40 omgange* | "forty revolutions observed on the side F, might be sensibly shorter … twenty two for the whole interval of H E" | 40 omgange ved F er tydeligt kortere. Det svarer til 22 minutter for hele vejen fra H til E |
| s. 894 | "the 9th of November last at 5 a Clock, 35'. 45". at Night, 10 minutes later than it was to be expected … Which M. Romer had predicted to the said Academy from the beginning of September" | Den 9. november kl. 5.35.45 om aftenen, 10 minutter for sent. Det havde Rømer sagt fra begyndelsen af september |
| **Rømers liste** (side 1): *Hans egen hånd* | Rækken "Nov. 9 … Em." under 1676 | Rømers egen liste over Io's formørkelser. "Em." betyder, at Io kom ud (emersio). Han skrev listen efter 1678, og den overlevede branden i 1728 |

**Linje for linje** (Opus' oversættelse fra engelsk, pr. sætning ved de linjer, den hører til):

| Side | Engelsk (1677) | Dansk |
|---|---|---|
| s. 893, overskrift | A Demonstration concerning the Motion of Light, communicated from Paris, in the Journal des Scavans, and here made English. | Et bevis for lysets bevægelse, sendt fra Paris i *Journal des Sçavans* og her oversat til engelsk. |
| s. 893, 1-4 | Philosophers have been labouring for many years to decide by some Experience, whether the action of Light be conveyed in an instance to distant places, or whether it requireth time. | I mange år har de lærde prøvet at afgøre med et forsøg, om lyset når fjerne steder på et øjeblik, eller om det bruger tid. |
| s. 893, 4-9 | M. Romer of the R. Academy of the Sciences hath devised a way, taken from the Observations of the first Satellit of Jupiter, by which he demonstrates, that for the distance of about 3000 leagues, such as is very near the bigness of the Diameter of the Earth, Light needs not one second of time. | Hr. Rømer fra Det Kongelige Videnskabsakademi har fundet en måde ud fra iagttagelserne af Jupiters første måne. Med den viser han, at lyset ikke engang bruger ét sekund på ca. 3.000 mil, omtrent Jordens diameter. |
| s. 893, 10-13 | Let (in Fig. 11.) A be the Sun, B Jupiter, C the first Satellit of Jupiter, which enters into the shadow of Jupiter, to come out of it at D; and let EFGHKL be the Earth placed at divers distances from Jupiter. | Lad (i Fig. 11) A være Solen, B Jupiter og C Jupiters første måne, som går ind i Jupiters skygge og kommer ud af den ved D. Og lad E, F, G, H, K og L være Jorden på forskellige afstande fra Jupiter. |
| s. 893, 14-19 | Now, suppose the Earth, being in L towards the second Quadrature of Jupiter, hath seen the first Satellit at the time of its emersion or issuing out of the shadow in D; and that about 42½ hours after, (vid. after one revolution of this Satellit,) the Earth being in K, do see it returned in D; | Forestil dig, at man fra Jorden i L har set månen komme ud af skyggen ved D, og at man ca. 42½ time senere (altså efter én omgang) ser den komme tilbage til D, mens Jorden er i K. |
| s. 893, 19-26 | it is manifest, that if the Light require time to traverse the interval LK, the Satellit will be seen returned later in D, than it would have been if the Earth had remained in L, … and that, on the contrary, in the other Quadrature FG, where the Earth by approaching goes to meet the Light, the revolutions of the Immersions will appear to be shortned by so much, as those of the Emersions had appeared to be lengthned. | Så er det tydeligt: Bruger lyset tid på vejen fra L til K, ses månen komme senere tilbage til D, end hvis Jorden var blevet i L. Og omvendt ved F og G, hvor Jorden kommer lyset i møde: Dér ser omgangene lige så meget kortere ud. |
| s. 893, 26-35 | And because in 42½ hours, which this Satellit very near takes to make one revolution, the distance between the Earth and Jupiter in both the Quadratures varies at least 210 Diameters of the Earth, it follows, that if for the account of every Diameter of the Earth there were required a second of time, the Light would take 3½ minutes for each of the intervals GF, KL; which would cause near half a quarter of an hour between two revolutions of the first Satellit, one observed in FG, and the other in KL, whereas there is not observed any sensible difference. | På de 42½ time, en omgang tager, ændrer afstanden mellem Jorden og Jupiter sig mindst 210 jorddiametre. Brugte lyset et sekund for hver jorddiameter, ville det tage 3½ minut fra G til F og fra K til L, og så ville der være næsten et halvt kvarter mellem en omgang set ved F og G og en set ved K og L. Men man ser ingen forskel, der kan mærkes. |
| s. 894, 1-9 | Yet doth it not follow hence, that Light demands no time. For, after M. Romer had examin'd the thing more nearly, he found, that what was not sensible in two revolutions, became very considerable in many being taken together, and that, for example, forty revolutions observed on the side F, might be sensibly shorter, than forty others observed in any place of the Zodiack where Jupiter may be met with; and that in proportion of twenty two for the whole interval of H E, which is the double of the interval that is from hence to the Sun. | Men det betyder ikke, at lyset ikke bruger tid. Da hr. Rømer så nærmere efter, fandt han, at det, man ikke kunne mærke på to omgange, blev meget stort, når mange blev lagt sammen. Fx kan 40 omgange set ved F være tydeligt kortere end 40 andre, og det svarer til 22 (minutter) for hele vejen fra H til E, som er dobbelt så lang som vejen herfra til Solen. |
| s. 894, 10-12 | The necessity of this new Equation of the retardment of Light, is established by all the observations that have been made in the R. Academy, and in the Observatory, for the space of eight years, | At man må regne lysets forsinkelse med, viser alle iagttagelserne i Akademiet og på observatoriet gennem otte år, |
| s. 894, 13-20 | and it hath been lately confirmed by the Emersion of the first Satellit observed at Paris the 9th of November last at 5 a Clock, 35'. 45". at Night, 10 minutes later than it was to be expected, by deducing it from those that had been observed in the Month of August, when the Earth was much nearer to Jupiter: Which M. Romer had predicted to the said Academy from the beginning of September. | og det er for nylig blevet bekræftet: Den første måne blev set komme ud af skyggen i Paris den 9. november kl. 5, 35 minutter og 45 sekunder om aftenen, 10 minutter senere, end man ventede ud fra dem, der var set i august, da Jorden var meget nærmere Jupiter. Det havde hr. Rømer sagt til Akademiet fra begyndelsen af september. |
| s. 894, 21-24 | But to remove all doubt, that this inequality is caused by the retardment of the Light, he demonstrates, that it cannot come from any excentricity, or any other cause of those that are commonly alledged … | Og for at fjerne al tvivl om, at forskellen skyldes lysets forsinkelse, viser han, at den ikke kan komme af en skæv bane eller af nogen af de andre grunde, man plejer at nævne … |
| Listen, øverst | Obser. primi Jovialium Parisiis | Iagttagelser af den første Jupiter-måne i Paris |
| Listen, 1676 | Aug. 7 … Emers. · Aug. 14 … Emers. · Aug. 23 … Emers. · Nov. 9 … Em. | 7., 14. og 23. august: kom ud. 9. november: kom ud. (Tiderne er talt fra middag, så "9 49 50" den 7. august er kl. 21.49.50) |

## 8. Opslag 5: Om Rømer (bogens sidste opslag)
*Budgettet: titel, højst to tal, højst tre sætninger, højst fire spørgsmål. Derefter "Vil du vide mere?" og "Ærligt talt", lukkede.*

**Fremme:** "Ole Rømer (1644-1710)". To tal: **10 minutter** (Io for sent den 9. november 1676) og **22 minutter** (lyset over hele Jordens bane efter Rømer, i dag 16½). Tre sætninger (slutningen på historien): "Rømer havde ret: Lyset bruger tid. Chefen for observatoriet, Cassini, troede aldrig helt på det, men Huygens og Newton gjorde, og i 1729 viste englænderen James Bradley det på en helt anden måde. I dag ved vi, at lyset er 8 minutter og 19 sekunder om at komme fra Solen." Den vigtige knap: **"Se Io forsvinde i Jupiters skygge ›"** (Gør det selv, afsnit 9).

**Fire spørgsmål ("Hvorfor?"):**
1. **Hvorfor kiggede de på Jupiters måner?** Formørkelserne sker på samme øjeblik for alle, der kan se Jupiter. Ser man en formørkelse i Paris og på Hven, kan man ud fra forskellen i klokkeslæt regne ud, hvor langt mod øst Hven ligger. Det gjorde Rømer i 1671 på Hven sammen med franskmanden Jean Picard, dér hvor Tycho Brahes Uranienborg havde stået. Picard tog ham med til Paris.
2. **Hvor hurtigt er lyset så?** Rømer gav aldrig en fart, kun tiden. Christiaan Huygens regnede den ud fra Rømers 22 minutter: godt 210.000 km i sekundet, over 600.000 gange hurtigere end lyden. I dag ved vi, at det er 299.792 km i sekundet.
3. **Hvorfor troede Cassini ikke på det?** Io går ikke helt jævnt rundt, fordi de andre måner trækker i den, og de andre måner viste ikke forsinkelsen tydeligt. Rømer svarede, at de var sværere at måle. Først i 1700-tallet kunne man regne månernes træk ud.
4. **Hvad lavede Rømer bagefter?** Han kom hjem til København i 1681 og blev professor og målte stjerner fra Rundetårn. Han fik kongen til at indføre den nye kalender i 1700 og blev politimester i 1705, hvor han satte gadelygter op. De fleste af hans papirer brændte ved Københavns brand i 1728.

**Ærligt talt:**
- Rømer målte ikke lysets fart, men den tid, lyset er om at krydse Jordens bane. Farten regnede Huygens ud.
- Hans 22 minutter var for mange. I dag: 16 minutter og 38 sekunder.
- Måske var det Cassini, der først fik idéen om, at lyset bruger tid (forskerne er uenige). Men Cassini opgav den, og det var Rømer, der holdt fast og viste den.
- Siderne er ikke skrevet af Rømer selv, men af en reporter, og den engelske tekst er oversat fra fransk. Kun listen er Rømers egen hånd.
- Vi ved ikke, hvem der stod ved kikkerten den 9. november. Bladet siger bare, at man så det i Paris.
- I turen er lysglimtet en tegning: Lys kan man ikke se flyve gennem rummet. Tiderne (36 og 46 minutter) er nutidens tal. Rømer kendte ikke afstandene i km.
- Tegningerne er ikke i rigtig størrelse, og uret går hurtigere i trin 4. Kikkerten viser Jupiter, som den ses i en lille kikkert, ikke præcis som i Rømers.
- Io går ikke helt jævnt rundt, og urene i 1676 gik efter Solen. Derfor kan man ikke regne de 10 minutter direkte ud fra Rømers liste. I gåden bruger du nutidens afstande.
- Billederne i turen og gåden er vores egne tegninger. Fortælleren er vores, og oversættelsen fra engelsk er vores egen.

**Vil du vide mere? (For nørder):**
- Bladets første regnestykke: På én omgang (42½ time) ændrer afstanden sig mindst 210 jorddiametre. Brugte lyset 1 sekund pr. jorddiameter, ville Io komme 3½ minut for sent pr. omgang. Det så man ikke, så lyset er meget hurtigere. I dag ved vi, at Jorden højst fjerner sig ca. 4 mio. km på en omgang, og det giver ca. 14 sekunder. Over 40 omgange bliver det minutter.
- Afstanden Jorden-Jupiter (JPL Horizons): 14. august 1676 644 mio. km, 9. november 1676 825 mio. km. Forskellen, 181 mio. km, er lyset 10,1 minut om.
- Huygens' tal (*Traité de la lumière*, trykt 1690): 22.000 jorddiametre på 22 minutter, altså 16⅔ jorddiametre i sekundet eller over 110 millioner toiser (en gammel fransk længde på knap 2 m).
- Newton skrev i 1704 "syv eller otte minutter" fra Solen. Bradley fik 8 minutter og 13 sekunder i 1729. I 1849 målte Fizeau lysets fart på Jorden for første gang.
- På dansk kaldte man det "lysets tøven" (fysikeren Kirstine Meyer, 1915).
- Rømers temperaturskala: Fahrenheit besøgte ham i 1708 og byggede sin skala på den.

## 9. Gør det selv
**Knappen "Se Io forsvinde i Jupiters skygge ›"** åbner Solsystemet ved **Jupiter → Månerne** (`data-gaa="solsystem:jupiter:maaner"`) med en linje: "Tryk ⏩, og følg Io, den inderste måne. Bag Jupiter glider den ind i skyggen og bliver mørk. Det sker hver 42½ time. Det var Rømers ur." **Ærligt talt** (står i "Om Rømer"): I programmet når lyset frem med det samme, så Io kommer aldrig for sent. *Tjekkes i R3 på skærmen:* at Io ses blive mørk i overblikket ved ⏩ (koden gør månerne sorte i skyggen, `js/kosmos/jupiter.js`). Ses det ikke tydeligt, så skriv i stedet "se Io's skygge på Jupiters skyer".

**Links begge veje** (planen, afsnit 6):
- Ved **Jupiter → Månerne**: et "Hvordan ved vi det?"-kort i `js/data/hvorfor.js`, "Hvordan ved man, at lyset bruger tid?", med to sætninger og knappen "Læs Rømers bog ›" (`data-gaa="opdagelser:roemer"`). Det rører sporet Solsystemet (Jupiters fil), så det skal aftales eller laves i deres blok.
- I **Ordbogen** ved "Lysets fart": en linje "Rømer viste i 1676, at lyset bruger tid" med linket (lille, valgfri).
- *Ekstra (lille):* Huygens' "For nørder" nævner allerede Rømers tal. Den linje kan få knappen "Læs Rømers bog ›".
- **Idé til senere** (ikke en del af bogen): "Rømers ur" ved Jupiter, et stopur for, hvornår Io kommer ud af skyggen, med lysets rejsetid slået til (står i [fakta-videnskabsfolk.md](fakta-videnskabsfolk.md), afsnit 2).

## 10. Det, der er valgt fra
Længdegraden som eget trin (kun i "Hvorfor?" 1), immersioner og emersioner som ord (kun "gå ind" og "komme ud"), kvadratur og opposition som ord, Rømers liste fra 1672 (eksemplet med "et kvarter for sent" er mest målefejl, se faktafilen afsnit 4), Cassinis meddelelse 22. august 1676, Doppler-tolkningen, Rømers instrumenter (meridiankredsen og transitinstrumentet), mål og vægt, milestenene, Versailles' springvand, Dauphinen og hans to ægteskaber. Bradleys aberration forklares ikke (kun én sætning). Den franske original fra *Journal des sçavans* vises ikke (ikke fundet åbent). Højst fire sider pr. bog.

## 11. Billederne (kilde og licens)
| Billede | Kilde | Licens | Bruges |
|---|---|---|---|
| **Portrættet** | Jacob Coning, maleri ca. 1700. Commons: "Rømer, Ole (ur Berømte danske maend).jpg" (fra en bog med farvegengivelser, København 1943), 1280 px fra `upload.wikimedia.org` | **PD-Art, PD-old-100.** Et foto af et maleri fra ca. 1700 har ingen egen ret i Danmark (§ 70 stk. 4), og fotoet er fra 1943. **Sikker** | Forsiden og hylden, 600 × 750, WebP ca. 180 KB, udsnit: hovedet og parykken |
| *Alternativ* | "Ole Rømer at work.jpg": Rømer ved sit instrument hjemme i Kannikestræde, kobberstik fra Horrebows *Basis Astronomiæ* (1735) | PD-old-100. **Sikker** | Kun hvis I vil have ham i arbejde (spørgsmål 2) |
| **s. 893, s. 894 og tavlen** | *Phil. Trans.* bd. 12, nr. 136 (1677), archive.org `paper-doi-10_1098_rstl_1677_0024` (PDF, 600 ppi). Fig. 11 skæres ud af tavlens øverste venstre hjørne. JSTOR's bjælke nederst på s. 893 skæres fra | **Public Domain Mark** på archive.org. Skanningen er Royal Society og JSTOR's (2006, "Early Journal Content"). Om § 70 gælder en skanning af en tekstside, er uklart, som ved Tycho. **Ret sikker**, spørgsmål 4 | `lav_bogsider.py roemer` (PDF i stedet for sidebilleder: `pdftoppm`), ca. 150-190 KB pr. side |
| **Rømers liste** | "Ole Rømer - Obser. Primi Jovialium Parisiis - pp1+4.jpg" (Commons), gengivet af Kirstine Meyer i 1915. Kun side 1 (højre halvdel) | **PD-old-100 og PD-Denmark50.** **Ret sikker** | Som en side, ca. 150 KB |
| Tegningerne i turen og gåden | Vores egne (lærred i 2D), Fig. 11 tegnet om | Vores | `js/bog/roemer.js` |

Bogen i alt ca. 900 KB (portræt ca. 180 KB og fire sider ca. 180 KB). Skriften er hentet i forvejen (Huygens). Ingen nye domæner: archive.org og `upload.wikimedia.org` er åbne.

## 12. Ordene
**formørkelse** (trin 1). Står ikke i Ordbogen (`js/data/ordbog.js`), men nævnes i "Kerneskygge". Forslag (under 260 tegn, faktatjekket):
- **Formørkelse:** "Når et himmellegeme bliver mørkt eller skjult, fordi det kommer ind i et andets skygge, eller noget kommer foran det. Ved en måneformørkelse er Månen i Jordens skygge. Jupiters måner bliver formørket, når de går ind i Jupiters skygge." (237 tegn)

"Lysets fart" står i Ordbogen. "Måne", "bane" og "kikkert" kendes. "Akademiet" forklares i teksten ("de lærde i Akademiet"). "Opposition" og "kvadratur" bruges ikke.

## 13. Prøven
Efter ti minutter uden hjælp: *Hvad gjorde du først? Hvor gik du i stå? Hvad handlede det om?* Og:
1. Hvorfor kom Io for sent i november? (Jorden var længere væk fra Jupiter, så lyset skulle rejse længere, og det tager tid.)
2. Hvordan vidste man, at Rømer havde ret? (Han sagde det, før det skete, og Io kom 10 minutter for sent.)
3. Hvor længe er lyset om at komme fra Solen? (Ca. 8 minutter.)

## 14. Fakta
Alle tal og årstal står med kilde og sikkerhed i [fakta-videnskabsfolk/roemer.md](fakta-videnskabsfolk/roemer.md) (20. november 2026). Den engelske tekst er læst på sidebillederne, rækkerne i listen på billedet af håndskriften, og afstandene er fra JPL Horizons. Faktatjekket af drejebogens tekster står nedenfor. *Kan tjekkes af Fable senere* (linjen i [plan-fable.md](plan-fable.md)): oversættelsen af de to sider, Huygens' tal og om Rømers "22" og bladets "210 jorddiametre" er gengivet rigtigt.

**Faktatjekket af drejebogen (20. november 2026, Opus i stedet for Fable).** Hver påstand i afsnit 1-9 og 12 er holdt op mod faktafilen. Rettet undervejs:
| Påstand i udkastet | Ret til | Hvorfor |
|---|---|---|
| "Rømer forudsagde, at Io ville komme for sent den 16. november" | "i november", og 9. november som dagen, man så det | Wikipedia siger 16. november, bladet siger kun "fra begyndelsen af september" og 9. november |
| "Rømer så selv Io komme for sent" | "man kigger efter" | Bladet siger "observed at Paris" |
| "kl. 17.35.45" i fortællerens linje | "lidt over halv seks" (uret i scenen viser bladets 17.35¾) | Rømers egen liste ser ud til at sige 5.45.35. Begge er "lidt over halv seks" |
| Rømers liste fra 1672 som gåde ("et kvarter for sent efter 30 omgange") | Perlesnoren med nutidens afstande | Lyset forklarer kun ca. 2¾ af de 15 minutter (Horizons) |
| "Huygens: 214.000 km/s" (Huygens' bog) | "godt 210.000 km i sekundet" | 16⅔ jorddiametre giver 212.000, toiserne 214.000. Begge er omregninger |
| "Rømer var den første, der tænkte det" | "den første, der viste" | Bobis og Lequeux (2008): Måske var idéen Cassinis |
| "Bradley 1727" | "1729" | Han målte fra 1727, men forklaringen kom i 1729 |
| "Tidsskriftet kom 25. juli 1677" | "året efter" / "1677" | Wikipedia og Commons er uenige (juli eller juni) |

## 15. Byggeriet (R1-R3, efter jeres go)
*Model: Opus, høj effort. Én session pr. trin, prompten står i [lige-nu/videnskabsfolkene.md](lige-nu/videnskabsfolkene.md). `js/bog.js` findes, så det er lille til mellem pr. trin.*
- [x] **R1: Forsiden og bogen** (lille, lavet 27.-28. november 2026, startet af orkestratoren, se [kode/opdagelser-roemer.md](kode/opdagelser-roemer.md). Afvigelser: `forløb` venter til R2 som hos Tycho, så forsiden har intet "Begynd" endnu. Vignetten er en bred, mørk stribe som Galileis tegning, ikke et rundt synsfelt, der gjorde Jupiter for lille. Curies grå ryg har fået et foreløbigt spørgsmål). `roemer` bygget i `js/data/opdagelser.js` (stil, portræt, tekster, forløb), `js/data/opdagelser/roemer.js` (FORSIDE, OPSLAG), portrættet med `lav_portraet.py roemer` og `KILDER.md`, og vignetten med Jupiter og de fire måner. Ørsted og Curie bliver de to grå rygge (`KOMMENDE_PÅ_HYLDEN`). Test 1, 3 og 8 for Rømer.
- [ ] **R2: Turen** (mellem). `js/data/forloeb/roemer.js` (fire trin og "Det så du") og `js/bog/roemer.js` (kikkerten, banerne ovenfra, lysglimtet og uret). Ordet `formoerkelse` i Ordbogen. Test 4 og 5.
- [ ] **R3: Gåden, tidsskriftet og "Om Rømer"** (mellem). Perlesnoren (testen i Node: 36, 46 og 16,6), `lav_bogsider.py roemer` (PDF'en fra archive.org og listen fra Commons) med seks glødende steder, "Om Rømer", Gør det selv (tjek på skærmen, at Io bliver mørk) og links begge veje (kortet ved Jupiters måner aftales med sporet Solsystemet). `/faktatjek` på de færdige tekster og `/faerdig`. Så har Rømer status "prøve".

## 16. Spørgsmål til jer (anbefalingen først)
*Orkestratoren startede drejebogen, mens I sov, så spørgsmålene er ikke stillet endnu. Jeres svar skrives nedenfor.*
1. **Kernesætningen:** A (anbefalet: siger hvorfor Io kom for sent, og slutter med "jeg har selv set") eller B (kortere, men siger ikke hvordan).
2. **Portrættet:** Jacob Conings maleri fra ca. 1700 med kobberstik-filteret som de andre (anbefalet: det eneste portræt fra hans egen levetid, frit). Eller stikket fra 1735 af Rømer ved sit instrument (flot og i arbejde, men lavet efter hans død).
3. **De fire sider:** s. 893, Fig. 11, s. 894 og Rømers egen liste (anbefalet: spørgsmålet, tegningen, beviset med 9. november og hans egen hånd). Eller kun tidsskriftet (s. 893, Fig. 11 og s. 894, tre sider) uden listen.
4. **Skanningen:** Royal Society og JSTOR's skanning fra archive.org med kilden i `KILDER.md` (anbefalet: den har Public Domain Mark, og bladet er fra 1677). Eller vent og find den franske original i *Journal des sçavans* (Gallica afviser automatiske opslag, så I skulle selv hente den).
5. **Gåden:** "Tæl lysets minutter" med perlesnoren og nutidens afstande (anbefalet: man finder selv de 10 minutter og opdager, at 22 var for mange). Eller "Sortér Rømers liste" (man lægger hans iagttagelser på tegningen og finder selv, hvornår Io ses gå ind og komme ud).
6. **Gør det selv:** Jupiter → Månerne, som de er nu (anbefalet: findes allerede, og man ser Io i skyggen). Eller vent og byg "Rømers ur" ved Jupiter først (et større stykke arbejde i sporet Solsystemet).

**Jeres svar (21. november 2026):** "Ja til alle anbefalinger." Det betyder: 1) kernesætning A, 2) Jacob Conings maleri med filteret, 3) de fire sider (s. 893, Fig. 11, s. 894 og Rømers liste), 4) skanningen fra Royal Society og JSTOR på archive.org, 5) gåden "Tæl lysets minutter", 6) Gør det selv: Jupiter → Månerne, som de er nu. R1-R3 kan bygges.
