# Faktagrundlag: Einsteins bog (de tre ligninger)

*Lavet af Opus xhigh i stedet for Fable, 19.-20. november 2026, til Einsteins bog i [plan-videnskabsfolk.md](plan-videnskabsfolk.md) (jeres ønske 18. november, jeres go 19. november). Fable er ikke til rådighed (se [plan-fable.md](plan-fable.md)), så det kan tjekkes af Fable senere. Bygger videre på afsnit 8 i [fakta-videnskabsfolk.md](fakta-videnskabsfolk.md). Fælderne i [fakta-faelder-videnskabsfolk.md](erfaringer/fakta-faelder-videnskabsfolk.md) og [fakta-faelder.md](erfaringer/fakta-faelder.md) (relativitet og tyngdekraft) og [plan-tid-t5.md](plan-tid-t5.md) er læst først, så ord og tal passer med Tid.*

**Sikkerhed** (som i [tycho.md](fakta-videnskabsfolk/tycho.md)): **Sikker** = læst på sidebilledet eller i to uafhængige kilder. **Ret sikker** = én pålidelig kilde, eller regnet ud fra sikre tal. **Usikker** = kilderne er uenige, eller det kunne ikke læses direkte.

**Kilderne (åbnet 19.-20. november 2026):**
- **Artiklerne selv, læst på sidebillederne** (`archive.org/download/<id>/page/n<nr>_w1600.jpg`). Al tysk tekst nedenfor er skrevet af efter billederne. OCR-teksten (`<id>_djvu.txt`) er kun brugt til at finde siderne.
- **Wikipedia (engelsk), wikitekst** (`action=raw`): "Annus mirabilis papers", "Mass–energy equivalence", "Mileva Marić", "Einstein field equations", "General relativity priority dispute", "History of general relativity", "History of special relativity", "Cosmological constant", "Theory of relativity", "Einstein notation", "Albert Einstein", "Tests of general relativity", "Eddington experiment", "Hafele–Keating experiment", "Friedrich Hasenöhrl", "Olinto De Pretto". Wikipedia svarede tit med en fejlside (for mange opslag): "Twin paradox" kunne ikke hentes.
- **Lukket i miljøet** (ikke nødvendige, men nævnt, hvor de ville hjælpe): de.wikisource.org, einsteinpapers.press.princeton.edu, onlinelibrary.wiley.com, www.biodiversitylibrary.org, echo.mpiwg-berlin.mpg.de og bibliothek.bbaw.de. Commons' API svarede ikke.
- Tallene er regnet efter i Python (udregningen står i afsnit 8).

## 1. De tre artikler og skanningerne

| Opslag | Artikel | Hvor | Datoer (fra siderne) | Skanning (archive.org) |
|---|---|---|---|---|
| 1. Tiden | "Zur Elektrodynamik bewegter Körper" | *Annalen der Physik*, 4. række, **bd. 17 (1905), s. 891-921** (Wileys nummer: bd. 322, hæfte 10, DOI 10.1002/andp.19053221004) | "Bern, Juni 1905. (Eingegangen 30. Juni 1905.)" s. 921. Udkom 26. september (Wikipedia) | `sim_annalen-der-physik_1905_17_5`, n = sidetal − 777 (s. 891 = `n114`, s. 904 = `n127`) |
| 2. Masse og energi | "Ist die Trägheit eines Körpers von seinem Energieinhalt abhängig?" | *Annalen der Physik* **bd. 18 (1905), s. 639-641** (bd. 323, hæfte 13, DOI 10.1002/andp.19053231314) | "Bern, September 1905. (Eingegangen 27. September 1905.)" s. 641. Udkom 21. november (Wikipedia) | `sim_annalen-der-physik_1905_18_3`, s. 639-641 = `n232`-`n234` |
| 3a. Feltligningen | "Die Feldgleichungen der Gravitation" | *Sitzungsberichte der Königlich Preußischen Akademie der Wissenschaften* **1915, 2. halvbind, s. 844-847** (stykke XLVIII) | "Sitzung der physikalisch-mathematischen Klasse vom 25. November 1915" (s. 843-844). "Ausgegeben am 2. Dezember" (s. 847) | `sitzungsberichte1915deut` (Smithsonian, skarp), s. 843-847 = `n918`-`n922` (set på billederne: archive.org's sideliste er én forskudt her). Også `SitzungsberichtePreussAkad19152` (Google-skanning), s. 844-847 = `n371`-`n374` |
| 3b. Den lange udgave | "Die Grundlage der allgemeinen Relativitätstheorie" | *Annalen der Physik* **bd. 49 (1916), s. 769-822** (bd. 354, hæfte 7, DOI 10.1002/andp.19163540702) | "(Eingegangen 20. März 1916.)" s. 822 | `sim_annalen-der-physik_1916_49_7`, n = sidetal − 769 (s. 808 = `n39`, s. 822 = `n53`) |

Alle sidetal, titler og datoer i tabellen er læst på siderne (**Sikker**), undtagen udgivelsesdagene i 1905 (**Ret sikker**, Wikipedia "Annus mirabilis papers"). Artiklerne er underskrevet "von A. Einstein" (s. 639 og 891) og "Von A. Einstein" (s. 844). Artiklen om tiden er på 31 sider, den om energien på 3, den fra 1915 på 4 og den fra 1916 på 54.

**Linjetal:** Linjerne tælles fra første tekstlinje under sidehovedet (og under titlen på første side). Linjer, der kun er en formel, tælles ikke med, og formlerne kaldes ved Einsteins egne numre, hvor de har et.

## 2. Opslag 1: Tiden i bevægelse (1905)

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Einstein var 26 og arbejdede på patentkontoret i Bern (fra 1902 som "assistant examiner – level III", forfremmet i 1906) | Wikipedia "Albert Einstein"; alderen regnet (født 14. marts 1879) | Ret sikker |
| Artiklen begynder ikke med lys, men med en **magnet og en leder**: Det, man ser, afhænger kun af, hvordan de bevæger sig i forhold til hinanden (s. 891, l. 1-21) | Sidebilledet | Sikker |
| **De to regler** står på s. 891, l. 22-33 og s. 892, l. 1-3: de samme love for alle, der bevæger sig jævnt ("Prinzip der Relativität"), og at lysets fart V ikke afhænger af, hvordan lampen bevæger sig | Sidebilledet | Sikker |
| Han nævner kun "die mißlungenen Versuche" (de mislykkede forsøg) på at måle Jordens fart gennem "Lichtmedium". **Michelson og Morley nævnes ikke** ved navn | s. 891, l. 22-24 | Sikker |
| Lysets fart hedder **V**, ikke c. Med lille c skrev han den først i 1907 | Siderne; Wikipedia "Mass–energy equivalence" | Sikker / Ret sikker |
| Samtidighed forklares med et **tog, der kommer klokken 7** (s. 893, l. 1-6) | Sidebilledet | Sikker |
| Formlen **τ = t·√(1 − (v/V)²)** for et ur, der bevæger sig, står på **s. 904** (efter l. 8) | Sidebilledet | Sikker |
| Rundturen (ur flyttes rundt og kommer tilbage bagud) står allerede her: s. 904, l. 27-33 og s. 905, l. 1. Langevin gjorde urene til personer i 1911 (senere kaldt tvillingeparadokset) | Sidebilledet; Wikipedia "History of special relativity" | Sikker / Ret sikker |
| Han regnede også med, at et ur ved **ækvator** går langsommere end ved polen (s. 905, l. 1-5). **Det er forkert:** Alle ure ved havets overflade går lige hurtigt, fordi tyngdens virkning (som han først fandt senere) ophæver fartens: Havets overflade har samme tyngdepotentiale overalt | Sidebilledet; Wikipedia "Hafele–Keating experiment" | Sikker / Ret sikker |
| Artiklen har **ingen litteraturhenvisninger**. Den eneste, der takkes, er vennen og kollegaen **M. Besso** (s. 921) | Sidebilledet; Wikipedia "Annus mirabilis papers" | Sikker |
| Lysuret (lys mellem to spejle) står **ikke** i artiklen. Det kom med Lewis og Tolman i 1909 | Wikipedia "History of special relativity" | Ret sikker |

**Linje for linje:** de fire steder (s. 891-892, 893, 903-904 og 904-905) står med tysk og dansk i [fakta-einstein-bog-tekster.md](fakta-einstein-bog-tekster.md), afsnit 1.

**Led for led** (τ = t·√(1 − (v/V)²), til en 13-årig):

| Led | Hvad det betyder |
|---|---|
| *t* | Tiden på de ure, der står stille ("det hvilende system", fx perronen eller Jorden) |
| *τ* | Tiden på uret, der farer af sted (τ er det græske t, "tau") |
| *v* | Urets fart. *V* er lysets fart (i dag skriver man *c*) |
| *v*/*V* | Hvor stor en del af lysets fart uret har: 0,5 er halvdelen |
| (*v*/*V*)² | Det tal ganget med sig selv: 0,5 · 0,5 = 0,25 |
| 1 − (*v*/*V*)² | Altid mindre end 1, når uret bevæger sig |
| √ | Kvadratroden. Så er *τ* mindre end *t*: Set fra Jorden viser det farende ur mindre tid |
| ½(*v*/*V*)² | Einsteins lette udgave for små farter ("bis auf Größen vierter und höherer Ordnung") |

| Fart | √(1 − (v/V)²) | Bagud pr. døgn (set fra Jorden) | ½(v/V)² passer? |
|---|---|---|---|
| Bil, 100 km/t | 0,999 999 999 999 996 | 0,000 000 000 37 s | Ja |
| Rumstationen, 7,66 km/s | 0,999 999 999 7 | 0,000 028 s (kun farten) | Ja |
| 1 % af lysets fart | 0,999 95 | 4,3 s | Ja |
| 87 % (som lysuret i Tid) | 0,49 | Uret går halvt så hurtigt | Nej (0,38 i stedet for 0,51) |

**Ærligt talt (til bogen):** "Set fra Jorden" er regnet, ikke det, øjet ser (fælden i Tid). Den, der rejser, mærker intet. Ækvatoruret var forkert. Formlen ½(v/V)² gælder kun ved små farter. Ure i fly og satellitter påvirkes også af tyngden (det kom først med feltligningen, opslag 3).

## 3. Opslag 2: Masse og energi (1905)

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Artiklen bygger på den første: fodnoten på s. 639 henviser til "Ann. d. Phys. 17. p. 891. 1905" | Sidebilledet | Sikker |
| Tankeforsøget: Et legeme sender lige meget lys (L/2) ud i to modsatte retninger og bliver derfor liggende stille (s. 640, l. 5-10) | Sidebilledet | Sikker |
| Han sammenligner bevægelsesenergien før og efter set fra et system, der bevæger sig, og får **K₀ − K₁ = (L/V²)·(v²/2)** (s. 641, formlen efter l. 11). Det er Newtons ½·m·v² med m = L/V² | Sidebilledet | Sikker |
| **Han skrev ikke E = mc².** Han skrev, at massen bliver **L/V² mindre**, når legemet sender energien L ud som stråling (s. 641, l. 13-14), og at massen er et mål for energiindholdet, og at den ændres med **L/9·10²⁰** i erg og gram (l. 18-21) | Sidebilledet | Sikker |
| 9·10²⁰ er V² i cm²/s² med V = 3·10¹⁰ cm/s (i dag 8,99·10²⁰) | Regnet | Sikker |
| Han foreslog at prøve det med **radiumsalte** (l. 22-24) | Sidebilledet | Sikker |
| Beviset gælder kun for små farter ("Unter Vernachlässigung von Größen vierter und höherer Ordnung", l. 10-11). Planck sagde det i 1907. Ives (1952) og Jammer (1961) kaldte beviset en cirkelslutning. Stachel og Torretti mener, beviset holder, og Ohanian (2008) mener, det har andre fejl | Sidebilledet; Wikipedia "Mass–energy equivalence" | Sikker / Ret sikker (en strid blandt historikere) |
| Han beviste det igen på andre måder senere (1906, 1907) og skrev "E = mc²" i titlen på en artikel i 1946 | Wikipedia "Mass–energy equivalence" | Ret sikker |
| Den første måling: I 1933 passede energien fra lithium-7 og protoner, der blev til to alfapartikler, med formlen inden for ±0,5 % | Wikipedia "Mass–energy equivalence" | Ret sikker |

**Linje for linje:** s. 639, 640 og 641 (tre steder) står i [fakta-einstein-bog-tekster.md](fakta-einstein-bog-tekster.md), afsnit 2.

**Led for led** (Δm = L/V², i dag E = mc²): *L* er energien, der forsvinder (i erg, i dag joule). *V*² er lysets fart ganget med sig selv, et kæmpe tal. Derfor bliver massen kun en lille smule mindre. "Træghed" er det, at noget tungt er svært at sætte i gang (massen). Ordet "Strahlung" er lys og anden stråling.

| Eksempel (regnet med c = 299.792.458 m/s) | Resultat | Sikkerhed |
|---|---|---|
| En lampe på 100 W lyser i én time | Den sender lys ud for 4 milliardtedele gram (4 · 10⁻¹² kg). Umuligt at veje i 1905 | Ret sikker (regnet) |
| 1 gram masse som energi | 9 · 10¹³ J, ca. 25 millioner kWh | Ret sikker (regnet) |
| Solen (3,8 · 10²⁶ W) | Ca. 4,3 millioner ton i sekundet (samme tal som Solens nørd-tekst i AtomLab) | Ret sikker (regnet) |
| 4 protoner bliver til en heliumkerne | 0,69 % af massen forsvinder (Stjerneovnens 0,7 %) | Ret sikker (regnet af CODATA-masser) |

## 4. Opslag 3: Feltligningen (1915 og 1916)

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| I november 1915 lagde han fire meddelelser frem på akademiet i Berlin: 4., 11., 18. og 25. november (s. 778, 799, 831 og 844). Den 18. var Merkurs bane | Sidehovederne i skanningen; fodnoterne s. 844 og 1916, s. 822 | Sikker |
| Den 25. november står ligningen med stof som **(2a)** på **s. 845**: G_im = −κ(T_im − ½ g_im T). Uden stof er den (2): G_im = 0 | Sidebilledet | Sikker |
| Han kalder dem selv **"zehn Gleichungen"** (ti ligninger), s. 845, l. 1 | Sidebilledet | Sikker |
| Det nye den 25. november var at sætte stoffets energi ind "in etwas anderer Weise" (leddet med ½ g_im T), så han ikke længere behøvede en ekstra antagelse (s. 844, l. 14-20) | Sidebilledet | Sikker |
| "Damit ist endlich die allgemeine Relativitätstheorie als logisches Gebäude abgeschlossen" (s. 847, l. 3-4). På samme side skriver han, at en mening, han havde fremsat for nylig, "war irrtümlich" (l. 11-12) | Sidebilledet | Sikker |
| I 1916 er ligningen (53) på **s. 808** med indeks μν og summen skrevet ud. Under den: "Es muß zugegeben werden, daß diese Einführung des Energietensors der Materie durch das Relativitätspostulat allein nicht gerechtfertigt wird" (l. 3-5) | Sidebilledet | Sikker |
| Han skriver selv (1916, s. 807, l. 6-7), at den specielle relativitetsteori har vist, "daß die träge Masse nichts anderes ist als Energie". Derfor står energien (ikke kun massen) i ligningen. **Den røde tråd fra opslag 2** | Sidebilledet | Sikker |
| Han indførte reglen om at **droppe summetegnene** (Einsteins summeregel) i 1916-artiklen, s. 781 | Sidebilledet; Wikipedia "Einstein notation" | Sikker |
| Konstanten: **κ = 8πK/c² = 1,87·10⁻²⁷** (cm/g), hvor K = 6,7·10⁻⁸ er Newtons tyngdekonstant (s. 818, (69)). I dag skrives κ = 8πG/c⁴ | Sidebilledet; regnet; Wikipedia | Sikker |
| Med svag tyngde bliver ligningen til Newtons lov: "äquivalent dem Newtonschen Gravitationsgesetz" (s. 818) | Sidebilledet | Sikker |
| Ure går langsommere tæt på tunge masser, og lys fra store stjerner må være rødforskudt (s. 820). Målt på Jorden i 1959-1960 (Pound og Rebka) | Sidebilledet; Wikipedia "Pound–Rebka experiment" | Sikker / Ret sikker |
| Lys bøjes **1,7″** ved Solen og ca. 0,02″ ved Jupiter (s. 822). I 1911 havde han regnet halvt så meget (0,83″). I dag 1,75″ | Sidebilledet; Wikipedia "Eddington experiment"; regnet (1,751″ og 0,016″) | Sikker |
| Merkurs bane drejer **43″ pr. århundrede** mere end Newton giver (s. 822, formel (75)). Han skriver "(Leverrier)", men Le Verrier fandt 38″ i 1859. De 43″ er Newcombs tal fra 1882 | Sidebilledet; Wikipedia "Tests of general relativity"; regnet (42,98″) | Sikker |
| Grossmann, matematikeren, hjalp ham "beim Suchen nach den Feldgleichungen der Gravitation" (tak på s. 769) | OCR-teksten s. 769 | Ret sikker (ikke læst på billedet) |
| Matematikeren **David Hilbert** lagde sit arbejde frem 20. november 1915 i Göttingen (trykt i 1916). Det er omstridt, hvad hans første korrektur indeholdt (Corry, Renn og Stachel 1997 mod Winterberg 2003), men de fleste historikere mener, at Einstein fandt den selv (Sauer: Hilbert-korrekturen udelukker, at han fik det sidste skridt fra Hilbert). Hilbert skrev selv, at hans ligninger passede med Einsteins almene relativitetsteori (Isaacson, citeret i Wikipedia, ingen dansk tekst i anførselstegn) | Wikipedia "General relativity priority dispute" | Ret sikker |
| Den kosmologiske konstant **Λ** stod ikke i ligningen i 1915. Den kom til i 1917 | Wikipedia "Einstein field equations" og "Cosmological constant" | Ret sikker |
| Schwarzschild fandt den første præcise løsning (1915, trykt 1916) | Wikipedia "History of general relativity" | Ret sikker |

**Linje for linje:** 1915, s. 844, 845 og 847, og 1916, s. 822, står i [fakta-einstein-bog-tekster.md](fakta-einstein-bog-tekster.md), afsnit 3.

**Led for led** (G_im = −κ(T_im − ½ g_im T), som han skrev den 25. november 1915):

| Led | Hvad det betyder (forenklet, og det siges) |
|---|---|
| *g*_im | Rumtidens "målestokke og ure" i hvert punkt: hvordan man måler afstande og tid lige dér. Det er det, man leder efter |
| *G*_im | Et mål for, hvor krum rumtiden er (regnet ud af *g*_im og hvordan den ændrer sig). **Ikke** det samme *G* som i dag (se fælderne) |
| *i*, *m* | Tal fra 1 til 4: tre retninger i rummet og tiden (*x*₄). 4 · 4 = 16 par, men *G*_im = *G*_mi, så der er **10 forskellige ligninger** |
| *κ* | Et lille tal, hvor Newtons tyngdekonstant gemmer sig. Fordi det er så lille, skal der meget masse til, før rumtiden krummer mærkbart |
| *T*_im | Energitensoren: hvor meget energi (og dermed masse, opslag 2) der er, hvordan den strømmer, og hvor hårdt den trykker |
| *T* | Én samlet sum af *T*_im (formel (5)) |
| ½ *g*_im *T* | Det nye stykke fra 25. november, der får energien til at passe |
| = | Ikke en udregning, men en regel, der skal gælde i hvert punkt, hele tiden |
| I dag | R_μν − ½ R g_μν + Λ g_μν = (8πG/c⁴) T_μν. Uden Λ er det den samme ligning, bare "vendt om": ½-leddet står på den anden side |

**Kort sagt** (efter hukommelsen fra fysikeren John Wheeler, ordlyden varierer, så uden anførselstegn): Stoffet fortæller rumtiden, hvordan den skal krumme, og rumtiden fortæller stoffet, hvordan det skal bevæge sig.

**Hvad man ærligt ikke kan uden mere matematik:**
- Man kan **ikke sætte tal ind og få et svar**, som med Newtons lov. Ligningen skal *løses* for *g*_im, og det er ti koblede, ikke-lineære differentialligninger (Wikipedia "Einstein field equations"). Det kræver tensorregning fra universitetet. **Ret sikker.**
- Selv Einstein fik hjælp af matematikeren Grossmann (1916, s. 769) og regnede Merkur og lyset med tilnærmelser ("in der uns interessierenden Näherung", s. 818). **Sikker.**
- Præcise løsninger findes kun, når noget er meget symmetrisk (Schwarzschild for en rund stjerne). Svære tilfælde, som to sorte huller, der smelter sammen, regnes i dag på supercomputere (efter hukommelsen, ikke slået op). **Ret sikker / Usikker.**
- **Det, man godt kan:** læse den som en sætning, tælle de ti ligninger, se at den bliver til Newton ved svag tyngde, og regne Einsteins færdige formler efter med en lommeregner: (75) giver Merkurs 43″ (a = 5,79 · 10¹⁰ m, T = 88,0 døgn regnet om til sekunder, e = 0,206, 415 omløb pr. århundrede) og (74) giver lysets 1,75″.

## 5. Myter og fælder

| Myte | Hvad kilderne siger | Kilde | Sikkerhed |
|---|---|---|---|
| "Einstein skrev E = mc² i 1905" | Han skrev L/V² og 9·10²⁰ (s. 641). Formen med c brugte han i 1907, og E = mc² står i hans håndskrift fra 1912 | Siden; Wikipedia "Mass–energy equivalence" | Sikker / Ret sikker |
| "Han fandt E = mc² i én artikel og beviste det dér" | Beviset gjaldt små farter og blev diskuteret (Planck 1907, Ives 1952). Han beviste det igen senere, og von Laue gav i 1911 et mere almindeligt bevis | Wikipedia "Mass–energy equivalence" | Ret sikker |
| "Andre skrev E = mc² før ham" | Poincaré (1900) gav strålingsenergi en "fiktiv" masse E/c², og Hasenöhrl (1904-1905) fandt (4/3)·E/c² for stråling i en kasse. Olinto De Pretto skrev i 1903 om en energi på m·v² for stof i æteren, men Ignazio Marchioro har vist, at ligheden er et tilfælde, og at De Prettos energi er dobbelt så stor som Einsteins (Wikipedia, som selv beder om flere kilder). Ifølge Wikipedia var Einstein den første, der fandt sammenhængen rigtigt, og den første, der sagde, at den gælder al energi, ikke kun elektromagnetisk | Wikipedia "Mass–energy equivalence", "Friedrich Hasenöhrl", "Olinto De Pretto" | Ret sikker |
| "Mileva Marić skrev artiklerne med ham" | Artiklerne er underskrevet "A. Einstein", og kun Besso takkes (s. 921). Påstanden bygger især på Abram Joffes erindring fra 1955 om navnet "Einstein-Marity", men andre mener, at han næppe så artiklerne, før de blev trykt. Stachel: I brevene skriver Einstein "min" om relativitetsarbejdet over et dusin gange og "vores" én gang. Der findes ingen artikler eller breve med fysik fra hendes hånd. De fleste historikere mener ikke, hun var medforfatter, men nogle mener, at hun var en støtte, man talte fysik med | Siderne; Wikipedia "Mileva Marić" (Stachel; Esterson og Cassidy 2019) | Sikker (siderne) / Ret sikker (debatten) |
| "Mileva fik nobelprisen" | Skilsmissen i 1919 aftalte, at hun skulle have pengene fra en nobelpris. Det skete i 1922 | Wikipedia "Mileva Marić" | Ret sikker |
| "Alt er relativt" | Teorien bygger på to ting, der er **ens for alle**: lovene og lysets fart (s. 891-892). Artiklen siger kun "Prinzip der Relativität". Ordene "Relativtheorie" og "Relativitätstheorie" kom fra Planck og Bucherer i 1906. Efter hukommelsen skrev Einstein i 1921 til Eberhard Zschimmer, at "Invariantentheorie" havde været et bedre navn (Collected Papers bd. 12 nævner brevet, men det kunne ikke læses) | Siderne; Wikipedia "Theory of relativity"; søgning | Sikker / Ret sikker / Usikker (Zschimmer, brug den ikke som citat) |
| "Hilbert fandt ligningen først og blev snydt" | Se afsnit 4. Hilbert regnede selv teorien for Einsteins | Wikipedia "General relativity priority dispute" | Ret sikker |
| "Einstein kaldte Λ sin største brøler" | Alle henvisninger går tilbage til George Gamow (1956 og 1970). Livio fandt intet fra Einstein selv. Alpher og Wheeler sagde dog, at de havde hørt det | Wikipedia "Cosmological constant" | Ret sikker (sig "efter Gamow") |
| "Ligningen fra 1915 er den, man ser i dag" | I dag står Λ med (fra 1917), og ½-leddet står på venstre side. Einsteins G_im fra 1915 er det, man i dag kalder Ricci-tensoren, ikke "Einstein-tensoren" G_μν | Siderne; Wikipedia "Einstein field equations" | Sikker / Ret sikker |
| "Formørkelsen i 1919 beviste teorien" | Målingerne var usikre og blev diskuteret. Senere målinger har bekræftet det meget præcist | Wikipedia "History of general relativity" og "Tests of general relativity" | Ret sikker |
| "Einstein byggede på Michelson og Morley" | Artiklen nævner kun "mißlungenen Versuche" (s. 891) uden navne. Omstridt (fælden står allerede) | Siden; fakta-faelder.md | Sikker |
| "Einstein brugte lysuret i 1905" | Lysuret er Lewis og Tolmans (1909). Tids lysur er vores forklaring, ikke Einsteins | Wikipedia "History of special relativity" | Ret sikker |
| "Man bliver tungere ved høj fart" | Artiklen fra 1905 regner med en masse, der afhænger af farten (§ 10), men det er gammeldags. Brug fælden fra Tid | Wikipedia "Mass–energy equivalence"; fakta-faelder.md | Ret sikker |
| Nobelprisen og matematikken | Står allerede i [fakta-videnskabsfolk.md](fakta-videnskabsfolk.md), afsnit 8 (ikke for relativitetsteorien, og han dumpede ikke matematik) | | Sikker / Ret sikker |

## 6. Rettighederne

| Hvad | Status | Sikkerhed |
|---|---|---|
| **Teksterne** | Einstein døde 18. april 1955, så alle fire tekster er frie i EU fra 1. januar 2026 ([fakta-bogsider-rettigheder.md](fakta-bogsider-rettigheder.md), § 63). Akademiet og *Annalen* har ingen ret til selve teksten | Sikker |
| **Oversættelserne** | Vi oversætter selv. De kendte engelske (fx Perrett og Jeffery 1923, som Wikipedia citerer) kan være beskyttede. Danske oversættelser af andre bruges ikke | Sikker |
| **Smithsonians skanning af 1915** (`sitzungsberichte1915deut`, fotograferet 2010) | Ingen licenslinje i archive.org's metadata, og bibliotekets side (library.si.edu) har den ikke. BHL-siden (www.biodiversitylibrary.org) er lukket i miljøet. For Galilei og Newton var Smithsonians skanninger CC0 | Usikker, til domænet er åbnet |
| **Google-skanningen af 1915** (`SitzungsberichtePreussAkad19152`, Minnesotas eksemplar) | Mærket "Public Domain Mark" af den, der lagde den op, ikke af biblioteket. Google beder om ikke-kommerciel brug (som "…goog"). **Bruges til s. 845** (jeres go 22. november 2026, afsnit 11, svar 5) | Ret sikker, at den må bruges ikke-kommercielt |
| **Mikrofilmene af *Annalen* 1905 og 1916** (`sim_…`, "Serials in Microfilm") | Ingen licens, og ingen dato for filmen. Er filmen fra efter 1970, har fotoet en ret i 50 år i Danmark (§ 70). Ingen anden fri kopi blev fundet på archive.org. Udgiveren står som Wiley | Usikker |
| **Vores egen sætning af siden** (teksten sat i Old Standard TT med de samme linjer) | Altid fri, fordi teksten er fri. Mindre ægte, men skarpere end mikrofilmen | Sikker |

Til `KILDER.md`, hvis skanningerne bruges: værk, bind, side, archive.org-id og "teksten fri fra 2026, skanningens licens ikke angivet" (som Toronto-skanningen hos Tycho).

## 7. Steder i AtomLab ("Gør det selv")
- **Opslag 1:** Kosmos → **Rejsen i tid** (`tid`): toget med lygten, lysuret (87 %) og rumtidskortet med tvillingerne. Einsteins tog kl. 7 passer med scenen om samtidighed.
- **Opslag 2:** **Stjerneovnen** (foldeboksen "Hvor kommer energien fra?", 0,7 %), **Reaktoren** (citatet `einsteinEnergi`) og Solens nørd-tekst (4,3 mio. ton i sekundet).
- **Opslag 3:** Kosmos → **Rumtid** (`rumtid`, "Einstein, 1915", gummidugen, og nørd-teksten om Merkur og GPS). Også **Sort hul** (lysbøjningen) og **Tyngdebølger**.

## 8. Faktatjekket
*`/faktatjek` på begge filer, 20. november 2026 (Opus xhigh). Udregningen ligger i `regn/einstein.py` i sessionens kladdemappe og er skrevet her:* τ-tabellen: 1 − √(1 − β²) med `decimal` (fælden med kommatal). 1 g · c² = 8,99 · 10¹³ J = 2,50 · 10⁷ kWh. 100 W · 3.600 s / c² = 4,0 · 10⁻¹² kg. 3,828 · 10²⁶ W / c² = 4,26 · 10⁹ kg/s. (4 · 1,007276 − 4,001506)/(4 · 1,007276) = 0,685 %. κ = 8π · 6,7 · 10⁻⁸ / (3 · 10¹⁰)² = 1,871 · 10⁻²⁷. Lys: 4GM/(c²R) = 1,751″ (Sol), 0,016″ (Jupiter). Merkur (75): 5,019 · 10⁻⁷ rad pr. omløb · 415,2 = 42,98″.

| Påstand (før tjekket) | Resultat | Kilde |
|---|---|---|
| Sidetal, datoer og al tysk tekst | OK, læst på billederne | Skanningerne (afsnit 1) |
| "Le Verrier fandt 43″" | Ret: 38″ (1859). 43″ er Newcombs (1882) | Wikipedia "Tests of general relativity" |
| "Ligningen fra 1915 er den moderne" | Ret: G_im er Ricci-tensoren, ½-leddet står til højre, Λ mangler | s. 844-845; Wikipedia |
| "½(v/V)² er formlen for urene" | Ret: kun ved små farter (87 %: 0,38 mod 0,51) | s. 904; regnet |
| "Lysuret er Einsteins" | Ret: Lewis og Tolman 1909 | Wikipedia "History of special relativity" |
| "Smithsonian-skanningen af 1915 er CC0" | Ret: ingen licenslinje fundet | archive.org-metadata |
| Sideliste: s. 847 = `n923` | Ret: `n922` (`n923` er blank) | Billederne |
| De Pretto, Hilbert og Joffe | Skrevet mere forsigtigt | Wikipedia (afsnit 5) |
| 1 g = 25 mio. kWh, 4 ng, 4,3 mio. t/s, 0,69 %, κ, 1,75″, 43″ | OK, regnet | Udregningen ovenfor |

- **Ikke fundet:** Ordlyden af brevet til Zschimmer om "Invariantentheorie" (Princetons side er lukket). John Wheelers sætning er efter hukommelsen. Om numerisk relativitet er efter hukommelsen.
- **Kan tjekkes af Fable senere:** oversættelserne (især s. 891-892 og s. 844), sikkerheden i myte-tabellen og rettighederne til skanningerne.

## 9. Til drejebogen
- **Tre opslag, én side hver, bygget som "Bogen fra 1659":** s. 904 (formlen og rundturen), s. 641 (L/V² og radiumsaltene) og s. 845 (ligningerne (2) og (2a)). Højst to glødende steder pr. side. De øvrige steder (s. 891-893, 639-640, 844 og 847, og 1916-siderne 807, 808 og 822) står i "Linje for linje" og foldeboksene.
- **Den røde tråd:** Opslag 2 begynder med fodnoten til opslag 1 (s. 639), og opslag 3 bruger "die träge Masse nichts anderes ist als Energie" (1916, s. 807). Tiden fra opslag 1 kommer igen i opslag 3 (urene går langsommere tæt på tunge ting, s. 820).
- **Forslag til gåder (én pr. opslag):** (1) "Hvor meget bagud?" med ½(v/V)² ved 1 % af lysets fart (4,3 sekunder pr. døgn). (2) "Hvor meget lettere bliver lampen?" (100 W i en time: 4 milliardtedele gram). (3) "Hvor mange ligninger gemmer der sig i én?" (4 · 4 = 16, men 10, som Einstein selv skriver). For nørderne: Merkurs 43″ med formel (75) og en lommeregner.
- **Gæt i to trin**, fx "Hvad sker der med det ur, der kommer tilbage?" og "Hvor meget masse forsvinder?" (svaret er overraskende lidt).
- **Ærligt talt:** ækvatoruret, at beviset for L/V² kun gjaldt små farter, at Λ kom senere, at man ikke kan regne med feltligningen uden universitetsmatematik, og at Mileva Marić-spørgsmålet er nævnt kort og fair.
- **Ord til Ordbogen** (findes ikke i dag): *relativitetsteori*, *rumtid*, *masse* (som træghed), *feltligning* og *tensor* (højst 260 tegn hver). *Tidsforlængelse*, *lysets fart* og *samtidighed* findes.
- **Stilen:** 1900-tallet med Old Standard TT ([plan-videnskabsfolk.md](plan-videnskabsfolk.md), afsnit 4). Portrættet er stadig ikke tjekket (afsnit 5 i planen).

## 10. Spørgsmål til jer (anbefalingen først)
1. **Siderne:** Vis de rigtige skanninger (mikrofilmen for 1905, Smithsonian for 1915) med et kort "Ærligt talt" om, at billederne er gamle mikrofilm, som I gjorde med Tychos Toronto-skanning. Eller: Sæt teksten selv i Old Standard TT med de samme linjer (helt fri, men ikke det ægte papir). **Anbefaling: de rigtige skanninger**, fordi I bad om originale udsnit, og fordi teksten er fri. Vil I være helt sikre, så sæt kun opslag 1 og 2 selv (mikrofilmen er den mest usikre).
2. **Domænet www.biodiversitylibrary.org** til at læse rettighedslinjen for Smithsonians skanning fra 1915, før den bruges. **Anbefaling: ja**, når siden bygges (ikke nødvendigt for drejebogen).
3. **Opslag 3 fra 1915 eller 1916?** 1915 (s. 845) er dagen, hvor den blev færdig, og den korte form (2a). 1916 (s. 808) er længere og sværere at læse, men har tallene 1,7″ og 43″ (s. 822). **Anbefaling: s. 845 fra 1915 som siden** og 1916 i "For nørder".
4. **Mileva Marić:** én fair linje i "Ærligt talt" (som i afsnit 5). **Anbefaling: ja**, fordi myten er udbredt.

## 11. Jeres svar (20. november 2026, gennemgangen i Småting)
1. **Siderne:** De rigtige skanninger (som i Tychos bog), med et kort "Ærligt talt" om de gamle mikrofilm. **Tilføjelse fra jer:** Er en side svær at læse, skal man kunne skifte til "sætte teksten selv" (Old Standard TT med de samme linjer). Siden får altså begge udgaver og en kontakt.
2. **Domænet www.biodiversitylibrary.org:** Ja, tilføjet af jer i miljøet. **Tjek samme dag:** Domænet er åbent (proxyen lukker det igennem), men siden svarer med Cloudflares robottjek (403, `cf-mitigated: challenge`), som PSI. Rettighedslinjen for Smithsonians skanning fra 1915 kan derfor ikke læses automatisk. Læs den i en browser (siden for skanningen på biodiversitylibrary.org, "Rights"/"Copyright"), eller tag en anden kilde (Smithsonians egen side eller archive.org), og skriv linjen ind her, før skanningen bruges. **Tjekket igen 21. november 2026** (drejebogen): stadig 403 med robottjek. Står som åbent punkt i [drejebog-einstein.md](drejebog-einstein.md), afsnit 11, og skal være på plads før E4.
3. **Opslag 3:** 1915 (s. 845) som siden, 1916 (s. 808 og tallene 1,7″ og 43″ på s. 822) i "For nørder".
4. **Mileva Marić:** Én fair linje i "Ærligt talt".
Alle fire er jeres svar med anbefalingen. Det blokerer ikke længere drejebogen.
5. **Skanningen af s. 845 (det åbne punkt, lukket 22. november 2026, jeres go kl. ca. 14.40):** Smithsonians rettighedslinje kunne ikke læses (biodiversitylibrary.org afviser automatiske besøg, og I fandt ikke siden). I valgte reserven (drejebogen afsnit 11 og spørgsmål 7, "ja til alle anbefalinger"): **Googles skanning af Minnesotas eksemplar**, archive.org-id `SitzungsberichtePreussAkad19152`, side `n372` = s. 845 (set på billedet i E4: sidehovedet "Einstein: Die Feldgleichungen der Gravitation 845"). archive.org-metadata: `licenseurl` http://creativecommons.org/publicdomain/mark/1.0/ (Public Domain Mark, sat af den, der lagde den op), `date` 1915, "Book digitized by Google and uploaded by ARLIMA". Google beder om ikke-kommerciel brug, og AtomLab er gratis. Linjen "Digitized by Google / Original from University of Minnesota" er beholdt på billedet. **Ret sikker.** Står i `billeder/biblioteket/KILDER.md`.
