# Faktagrundlag, afsnit 15: "Hvorfor går tiden langsommere?" (T5)

*T5 Trin 0, 8. november 2026 (Opus, høj effort). Afsnit 1-13 står i [fakta-tid.md](../fakta-tid.md) (14 er holdt fri til T4). Afsnit 15 står i sin egen fil, fordi fakta-tid.md ellers kom over ca. 30 KB. Drejebogen er [plan-tid-t5.md](../plan-tid-t5.md). Alle tal er regnet efter i [regn.py](regn.py), afsnit "== 15." (kør `python3 docs/fakta-tid/regn.py`). Kilderne er læst af Opus selv (ca. 15 påstande, under grænsen for en hjælpeagent): Wikipedias wikitekst (`action=raw`) og arXiv:1906.03934 (læst i PDF'en).*

## 15.1 Lysets fart og de to regler (Einstein 1905)
- c = 299.792,458 km/s (eksakt). Det er ca. 1,08 milliarder km/t (regn.py).
- Einsteins artikel "Zur Elektrodynamik bewegter Körper" ("Om elektrodynamikken for legemer i bevægelse") blev modtaget 30. juni og udgivet 26. september 1905. Den bygger på to regler: Fysikkens love er de samme for alle, der bevæger sig jævnt (relativitetsprincippet), og lysets fart i tomt rum er den samme, uanset hvor hurtigt det, der sender lyset, bevæger sig. Kilde: Wikipedia "Annus mirabilis papers" (med citatet fra artiklen).
- **Til teksten:** "Lysets fart er den samme for alle" er den korte udgave af de to regler sammen. Den er rigtig, men det er to regler, ikke én. "For nørder" kan sige det.

## 15.2 Michelson og Morley (1887): hvad de faktisk målte
- Forsøget blev lavet fra april til juli 1887 i Cleveland, Ohio (i dag Case Western Reserve University), og udgivet i november 1887. Kilde: Wikipedia "Michelson–Morley experiment".
- **Hvad de ledte efter:** Man troede, at lyset var bølger i et usynligt stof, "æteren", og at Jorden fór gennem æteren med ca. 30 km/s på sin vej om Solen. Så skulle lyset gå en anelse hurtigere i nogle retninger end i andre ("ætervinden").
- **Hvordan:** Et interferometer (et apparat, der lader to lysstråler mødes igen, så selv en lille forskel i deres rejsetid ses som striber, der flytter sig). Lyset blev sendt frem og tilbage mellem spejle, så vejen blev ca. 11 m lang. Det hele stod på en sandstensblok, der flød i kviksølv, så man kunne dreje det rundt.
- **Hvad de fandt:** De ventede, at striberne flyttede sig 0,40 af en stribe. De fandt højst 0,02 og i gennemsnit under 0,01 (deres egne ord i et brev, citeret i Wikipedia). Da forskydningen går med farten i anden, betød det, at ætervinden højst var ca. 1/6 af de 30 km/s (højst 5 km/s) og "helt sikkert" under 1/4 (7,5 km/s). Regn.py: √(1/40) ≈ 0,16.
- **Ærligt:** Michelson og Morley målte ikke lysets fart. De målte, at lyset ikke var hurtigere i én retning end i en anden. Senere forsøg har gjort grænsen mange gange skarpere.
- **Fælde:** "Einstein byggede relativitetsteorien på Michelson og Morley." Det er omstridt. Mange historikere mener, at forsøget ikke spillede nogen stor rolle for Einstein. Han var drevet af Maxwells teori om elektricitet og magnetisme, og af at ingen havde fundet æteren (Wikipedia "Michelson–Morley experiment", afsnittet om Einstein). Skriv i stedet, at forsøget passede med Einsteins regel, og at det var et af de første tegn på, at noget var galt med æteren.

## 15.3 Einstein som 16-årig og lysstrålen
- Einstein skrev i "Autobiographical Notes" (i P. A. Schilpp (red.), *Albert Einstein: Philosopher-Scientist*, 1949, 2. udgave 1951, s. 52-53): "...a paradox upon which I had already hit at the age of sixteen: If I pursue a beam of light with the velocity c (velocity of light in a vacuum), I should observe such a beam of light as an electromagnetic field at rest though spatially oscillating. There seems to be no such thing, however, neither on the basis of experience nor according to Maxwell's equations." Kilde: Wikipedia "Einstein's thought experiments", "Pursuing a beam of light".
- **Fri oversættelse til teksten** (skal stå som "fortalte han selv", ikke som et citat i anførselstegn): Som 16-årig forestillede han sig at løbe efter en lysstråle med lysets fart. Så burde lyset se ud, som om det stod stille. Men sådan noget lys findes ikke.
- **Ærligt:** Han fortalte det over 50 år senere. Historikeren John Norton peger på, at erindringen nok er farvet af bagklogskab: Som 16-årig i Aarau (1895-96) kendte Einstein efter alt at dømme ikke Maxwells teori, som han først lærte i 1898 (Norton 2013, citeret i samme Wikipedia-artikel). Skriv derfor "fortalte han selv mange år senere".

## 15.4 Bolden i toget (at lægge farter sammen)
- Den rigtige regel: w = (u + v)/(1 + u·v/c²). Kilde: Wikipedia "Velocity-addition formula".
- Bolden (50 km/t) kastet fremad i et tog (100 km/t): w = 149,999999999999 km/t. Forskellen fra 150 er ca. 6 · 10⁻¹³ km/t, under en nanometer i timen, altså et par atomers bredde (regn.py). "150 km/t" er rigtigt i alt, man kan måle med en bold.
- Lyset fra en lygte i toget: (c + v)/(1 + c·v/c²) = c. Lyset får aldrig togets fart lagt til, uanset hvor hurtigt toget kører.
- Til nørderne: Kører toget med 50 % af lysets fart og kaster en bold med 50 % (set fra toget), farer bolden 80 % af lysets fart set fra perronen, ikke 100 %. Ved 90 % og 50 % bliver det 96,6 % (regn.py).
- **Ærligt (til skitsen):** Et tog kan ikke køre med en mærkbar del af lysets fart. Skitsen viser lyset meget langsommere end i virkeligheden, men med den samme fart i begge billeder.

## 15.5 Lysuret og trekanten
- Afsnit 3 i fakta-tid.md. Nyt: Ved 86,6 % (√3/2, i AtomLab "87 %") er γ = 2,000. Et halvt tik giver en retvinklet trekant med siderne 1 (den lige vej, højden L), √3 ≈ 1,73 (det stykke, spejlene flytter sig) og 2 (den skrå vej). Pythagoras: 1 + 3 = 4 (regn.py).
- Generelt: (c·t/2)² = L² + (v·t/2)² giver t = γ · 2L/c med γ = 1/√(1 − v²/c²). γ ved 50, 87, 95 og 99 %: 1,155, 2,0 (ved 86,6 %), 3,203 og 7,089.
- **Fælde:** "87 %" giver γ = 2,03 regnet med præcis 0,87. AtomLab bruger √3/2 = 86,6 % og skriver "87 %". Skriv γ = 2 og "ca. 87 %".

## 15.6 Myonernes kapløb
- Myoner dannes, når den kosmiske stråling rammer luften, "most atmospheric muons are produced at a height of around 15 km" (arXiv:1906.03934, Bonechi m.fl., "Atmospheric muons as an imaging tool", s. 3). Middellevetiden er 2,197 µs (afsnit 10).
- Uden tidsforlængelse: c·τ = 658,6 m. Fra 15 km når e^(−15000/658,6) ≈ 1,3 · 10⁻¹⁰ ned, ca. 1 ud af 8 milliarder (regn.py, passer med afsnit 10).
- **Med tidsforlængelse:** "The momentum spectrum of atmospheric muons peaks at around 4 GeV" og "most of them reach sea level" (arXiv:1906.03934, s. 3). 4 GeV/c giver γ = √(1 + (4000/105,66)²) ≈ 38 og v ≈ 99,965 % af lysets fart. Middelvejen bliver γ·v·τ ≈ 25 km, og ca. 55 % når ned fra 15 km (regn.py, den enkle udregning uden energitab). *Artiklen skriver "γ ≈ 20" ved 4 GeV, men det passer ikke med dens egen formel og dens egen vej på 24 km. γ ≈ 38 er det rigtige.*
- **Set fra myonen:** Myonens ur går normalt, men luften er presset sammen med γ: 15 km bliver ca. 400 m (15.000/37,9 = 396 m). Turen tager ca. 50 µs på Jorden og ca. 1,3 µs for myonen (under levetiden på 2,2 µs). Samme svar som "set fra Jorden" (regn.py).
- Ved 99 % (γ = 7,1): middelvej 4,6 km, ca. 4 % når ned. Ved 99,9 % (γ = 22,4): 14,7 km, ca. 36 % (regn.py, til skitsens skyder).
- **Rossi og Hall** målte i 1940 myonerne på Echo Lake (3.240 m) og i Denver (1.616 m) i Colorado. Myonerne fór over 0,99 c, og de fik en levetid på ca. 2,4 µs (i dag 2,2 µs). Phys. Rev. 59, 223-228 (1941). Kilde: Wikipedia "Experimental testing of time dilation".
- **Frisch og Smith** (målt 1962, Am. J. Phys. 31, 342-355, 1963): ✅ *Bekræftet 8. november 2026 (T5)*. Wikipedia "Experimental testing of time dilation" har nu tallene med henvisning til artiklen: ca. 563 myoner i timen på toppen af Mount Washington (1.917 m) og ca. 412 i timen ved havet i Cambridge, Massachusetts. Turen ned tager ca. 6,4 µs, og uden tidsforlængelse skulle der kun være kommet ca. 27 i timen. Den målte faktor er 8,8 ± 0,8, og relativitetsteorien forudsiger ca. 8,4 ± 2 (myonerne fór ca. 99,5 % af lysets fart på toppen og blev bremset til ca. 98,9 % ved havet, så γ faldt fra ca. 10,2 til ca. 6,8). T3's "8,4 ± 2" var altså forudsigelsen, ikke målingen. Forsøget blev filmet ("Time Dilation, An Experiment With Mu-Mesons", 1962). *Artiklen selv er ikke læst (betalingsmur), kun Wikipedias gengivelse.* T3 fandt ikke tallene (afsnit 10). Teksten skal sige "ca." og "i timen".
- Hvor mange: "roughly 100 Hz/m²" ved havets overflade (arXiv:1906.03934), dvs. ca. 100 myoner i sekundet gennem hver kvadratmeter. Wikipedia "Muon" citerer "About 10,000 muons reach every square meter of the earth's surface a minute" (ca. 170 i sekundet). Skriv "omkring 100 i sekundet" eller "ca. én pr. cm² i minuttet".
- **Ærligt:** Myonerne taber op til ca. 2 GeV på vejen ned, luften er tyndere foroven, og ikke alle laves i 15 km højde. Den enkle udregning (55 %) er derfor kun et overslag. Kilden siger "de fleste", og det er det, teksten skal sige.

## 15.7 "Nu" er ikke det samme for alle (lampen i togvognen)
- En lampe midt i en togvogn blinker. Set fra toget når lyset begge ender samtidig. Set fra perronen når det bagenden først, fordi bagenden kører lyset i møde, mens forenden kører væk. Kilde: Wikipedia "Relativity of simultaneity" ("A flash of light is given off at the center of the traincar ... the light will reach the front and back of the traincar at the same time").
- Einsteins egen udgave har to lyn, der rammer enderne af et tog (i den populære bog *Relativity: The Special and General Theory*, 1917). I 1905-artiklen regnede han det ud fra, hvordan man stiller ure i takt (samme kilde).
- **Skitsens tal** (60 % af lysets fart, γ = 1,25, vognen med længden L): I toget når lyset begge ender efter 0,5 L/c. Set fra perronen er vognen 0,8 L lang (længdeforkortelse), og lyset når bagenden efter 0,25 L/c og forenden efter 1,0 L/c. Forskellen er γ·v·L/c² = 0,75 L/c (regn.py).
- **En rigtig togvogn** (20 m ved 100 km/t): Forskellen er ca. 6 · 10⁻¹⁵ s, ca. 6 femtosekunder (regn.py). Derfor mærker vi det aldrig.
- **Ærligt:** "Set fra perronen" betyder ikke, hvad øjnene ser. Lyset skal også nå frem til den, der kigger. Det er det, man får, når man har trukket lysets rejsetid fra (eller har ure i takt langs hele perronen). Det gælder alle "set fra" i fænomenet.
- **Koblingen til urene** (scene 4's "Hvorfor?"): Når to ikke er enige om, hvad der sker "samtidig", kan begge se den andens ur gå langsomt, uden at det er en modsigelse. De sammenligner ikke de samme øjeblikke (Wikipedia "Relativity of simultaneity" og "Twin paradox").

## 15.8 Rumtidskortet og egentiden
- På et rumtidskort er op tid og til siden rum. Med år op og lysår til siden går lyset skråt, 45°. Et ur, der bevæger sig, måler sin egentid (sin egen tid langs sin vej): τ² = t² − (x/c)² for hvert lige stykke (afsnit 9).
- "The world lines of the inertially moving bodies maximise the proper time elapsed between two events" (Minkowski, også i Weyls (1918) og Paulis (1921) lærebøger). Kilde: Wikipedia "Twin paradox". Den lige streg (at blive hjemme) giver mest tid.
- **Skitsens tal** (hjemme 10 år, vendepunktet halvvejs): Vendepunkt 3 lysår ude giver 2·√(5² − 3²) = 8 år (60 % af lysets fart), 4 lysår giver 2·√(5² − 4²) = 6 år (80 %). Tæt på lysets linje (4,9 lysår) bliver det ca. 2 år (98 %) (regn.py).
- **"Nu"-linjerne (For nørder):** Den rejsendes "nu" er en skrå linje med hældningen v/c. Ved 80 % ældes hjemmet ca. 1,8 år, mens den rejsende ældes 3 år på vejen ud (3/γ, med γ = 5/3). Ved vendingen springer "nu derhjemme" fra 1,8 år til 8,2 år. Det er dér, de "manglende" år derhjemme ligger (afsnit 9, regn.py).
- **Fælder** (står i fakta-faelder.md): Lyset har ikke sit eget ur (egentiden findes ikke for lys, Wikipedia "Proper time"). Accelerationen er ikke årsagen, det er vejens længde. Billedet "man bevæger sig altid gennem rumtiden med lysets fart" bruges kun med forbehold, fordi rumtidens "Pythagoras" har et minus.

## Faktatjek af T5 Trin 0 (8. november 2026)
*Drejebogens tekster i [plan-tid-t5.md](../plan-tid-t5.md) og skitsen `docs/skitser/tid-t5.html`. Alle tal er regnet efter i regn.py (afsnit 15). Opus tjekkede selv påstandene mod kilderne (ca. 15).*

| Påstand | Resultat | Kilde |
|---|---|---|
| Lysets fart ca. 300.000 km/s, ca. 1 mia. km/t | OK (1,08 mia.) | SI, regn.py |
| Einstein 1905, to regler | OK (modtaget 30. juni, udgivet 26. september) | Wikipedia "Annus mirabilis papers" |
| Michelson og Morley 1887: forventet 0,40 stribe, højst 0,02 | OK | Wikipedia "Michelson–Morley experiment" |
| Ætervinden højst ca. 1/6 af 30 km/s | OK ("probably less than one-sixth", "certainly less than one-fourth") | samme |
| Einstein byggede på Michelson og Morley | **Omstridt**, skrives ikke | samme, afsnittet om Einstein |
| Einstein som 16-årig løb i tankerne efter en lysstråle | OK som hans egen erindring (1949), med forbehold (Norton) | Wikipedia "Einstein's thought experiments" |
| 50 + 100 km/t = 150 km/t "næsten præcist" | OK (mangler ca. 6 · 10⁻¹³ km/t) | Wikipedia "Velocity-addition formula", regn.py |
| Lyset fra toget har lysets fart, også set fra perronen | OK | samme |
| Lysuret: 1 + 3 = 4 ved 87 % (γ = 2) | OK (√3/2 = 86,6 %) | regn.py |
| Myonerne laves ca. 15 km oppe | OK | arXiv:1906.03934 |
| Uden tidsforlængelse ca. 660 m, 1 ud af ca. 8 mia. når ned | OK | regn.py, afsnit 10 |
| De fleste myoner når ned (typisk 4 GeV, γ ≈ 38) | OK ("most of them reach sea level", γ regnet efter: 38, ikke artiklens 20) | arXiv:1906.03934, regn.py |
| Set fra myonen er 15 km kun ca. 400 m | OK (396 m) | regn.py |
| Rossi og Hall 1940, over 0,99 c | OK | Wikipedia "Experimental testing of time dilation" |
| Frisch og Smith: ca. 563 og 412 i timen mod ca. 27 | OK (nu i Wikipedia med henvisning til Am. J. Phys. 1963, artiklen ikke læst) | samme |
| Lampen i vognen: bagenden først set fra perronen | OK | Wikipedia "Relativity of simultaneity" |
| En rigtig togvogn: ca. 6 femtosekunder | OK | regn.py |
| Den lige vej giver mest tid (egentid) | OK | Wikipedia "Twin paradox" |
| 3 lysår ude: 8 år, 4 lysår ude: 6 år | OK | regn.py |

**Nye fælder** (skrevet ind i [fakta-faelder.md](../erfaringer/fakta-faelder.md)):
- "Einstein byggede relativitetsteorien på Michelson og Morleys forsøg." Omstridt. Skriv, at forsøget passede med hans regel.
- "Michelson og Morley målte, at lysets fart er konstant." De målte, at lyset ikke var hurtigere i én retning end i en anden (ingen ætervind).
- Einstein og lysstrålen som 16-årig er hans egen erindring over 50 år senere. Skriv "fortalte han selv", og citér ikke en dansk udgave med anførselstegn.
- arXiv:1906.03934 skriver "γ ≈ 20" for myoner med 4 GeV. Det er ca. 38 (√(1 + (4000/105,66)²)). Regn γ efter, selv i en fagfællebedømt kilde.
- "Set fra perronen" er ikke det, øjnene ser: Lysets rejsetid er trukket fra.
