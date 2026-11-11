# E1: Det store eftersyn af AtomLab

*Skrevet 11. november 2026 ud fra [briefen](brief-eftersyn.md). Jeg har set de 12 tabletbilleder, ca. 45 af de 90 testbilleder, tallene, jeres noter og koden, hvor jeg havde brug for belæg. Jeg har også selv kørt programmet som en ny bruger i tablet-størrelse (1280 × 800): det første besøg, Værkstedet, hele Liv, "Giv elektroner" og Tid scene 3-5. Fem billeder derfra ligger i [E1-billeder/](E1-billeder/). De to andre filer er [kortet over verdenerne](E1-verdener.md) og [udkastet til Retningen](E1-retning.md).*

## 1. Kort fortalt
- AtomLab er fagligt ærligt, teknisk sundt og flere steder flottere end købte programmer. Det er bygget på fire uger. Det er en stor præstation.
- Men det er blevet **en samling af gode laboratorier, ikke ét produkt**. Der er ingen dør ind, ingen vej igennem og ingen rød tråd.
- De nye dele (Liv, Molekyler og Tid) er **rigtige, men ikke blide**. De viser alt på én gang og forklarer svaret, før man har fået spørgsmålet. Det er derfor, I selv går i stå.
- Rodårsagen er arbejdsgangen: **Der bliver bygget hurtigere, end nogen kan nå at prøve det.** Intet, der er bygget siden 23. oktober, er prøvet af et barn.
- Det næste skridt er derfor ikke mere indhold. Det er **guidede forløb, en rigtig indgang og en fast prøve med rigtige brugere**. Så kan resten af køreplanen bygges oven på noget, der virker.

## 2. Det, der er stærkt, og som ikke må gå tabt
- **Ærligheden:** "Ærligt talt", faktagrundlag med kilder og faktatjek. Det er AtomLabs særkende, og det er sjældent.
- **Solsystemet:** Mars, Jorden, Saturn og især Stå på Mars (tabletbillede 04 og 05) er i en klasse for sig. Flybyen er et godt forløb: Man bliver ført, og man kan stoppe.
- **Reaktoren som spil:** "Hold den stabil i 30 sekunder" er et klart mål, man kan mærke i fingrene. Det er den bedste model for, hvordan en del lærer noget fra sig.
- **Kernen i Værkstedet:** byg et atom, opdag grundstoffet, og se det lyse op på væggen i Det periodiske system.
- **Ordforklaringerne og Ordbogen:** et tryk på et ord, en kort forklaring. Det er "dybde i lag" i sin reneste form.
- **Opbygningen:** samme tre felter på alle skærme (valg, scene, forklaring), paneler der kan skjules, data adskilt fra grafik, testadgangen og ingen fejl i konsollen i min kørsel.
- **Disciplinen i dokumenterne:** læsekort, spor, erfaringer og tjeklister. Det er grunden til, at 136 PR'er på fire uger ikke er endt i kaos.

## 3. Helheden
**Sådan bør AtomLab hænge sammen.** Én tanke bærer det hele: *Alt er lavet af atomer, og her kan du selv se, hvor de kommer fra, og hvad de bygger.* Om den tanke bør der være tre lag af brug:
1. **Rejsen:** en ført vej gennem det vigtigste, i små forløb på 3-5 minutter. Det er her, en ny bruger starter, og det er det, en lærer bruger i en time.
2. **Laboratorierne:** delene, som de er i dag, hvor man leger frit, når man har fået idéen.
3. **Biblioteket:** opslag (ord, grundstoffer, personer og gåder).

**Sådan er det i dag.** Kun lag 2 findes helt. Lag 3 er begyndt. Lag 1 findes ikke. Derfor skal brugeren selv finde ud af, hvor man starter, hvad en del vil fortælle, og hvornår man er færdig. Det kunne jeres søn med jer ved siden af. Det kan en fremmed 12-årig eller en lærer ikke.

**Tre mønstre går igen:**
- **Lag 3 er rykket op i lag 1 i de nye dele.** Reglen om dybde i lag findes, men den bliver ikke holdt. "Se genet blive læst" i Liv bruger på under et minut ordene enzym, RNA-polymerase, gen, RNA, base, ribosom, kodon, budbringer (tRNA), aminosyre og hæmoglobin (E1-billede b og c). "Giv elektroner" åbner med et regnskab i eV (E1-billede d). Sætningerne er korte og pæne. Det er *mængden af nye begreber*, der er for stor, ikke sproget.
- **Virkelighed vinder over forståelse.** Liv bruger det rigtige gen (444 bogstaver) og atompladser fra en rigtig krystal. Det er imponerende, men det hjælper ikke en 12-årig med den ene idé, det handler om: *DNA er en opskrift skrevet med fire bogstaver, som læses tre ad gangen.*
- **Hver session lægger til, ingen trækker fra.** Jupiter har ni spørgsmål i højre panel (testbillede 082). Liv møder én med fem zoomtrin, "Byg stigen", tre knapper om protein, opgaver, "Næste skridt" og en klokke (tabletbillede 03). Der er fem slags vejledning på samme tid: guidebobler, "Næste skridt" med "Vis mig", opgaver med stjerner, undertekster med prikker og "Gå videre". Ingen af dem er *vejen*.

**Hvad står dobbelt?** Viden står nu fire steder: i de syv lange hjælpetekster, i "Hvorfor?"-kortene (38), i Ordbogen (106 ord, flere med egne "Hvorfor?") og i "For nørder". Tiden har to indgange i Kosmos. **Hvad mangler?** Indgangen, vejen, links mellem delene ("Se også" fra oktober er stadig ikke lavet) og et overblik over Solsystemet (planeterne om Solen), som er det første, en 12-årig venter af en del, der hedder Solsystemet.

## 4. De 13 anbefalinger, der løfter mest

**1. Guidede forløb: tag brugeren i hånden** *(UX og indhold · stor, i portioner · dybde fra Fable til skabelonen, så Opus med plan · sikker · nyt, bygger på det, der findes)*
- **Hvorfor:** Det er svaret på både "for komplekst" og "svært at forstå". En ny bruger skal ikke vælge mellem ni knapper. Hun skal have ét spørgsmål, gøre én ting og få én sætning om, hvad hun lige så.
- **Forslag:** Én fælles byggeklods, "Forløb", som afløser de fem slags vejledning. Et forløb har 3-6 trin. Hvert trin: et spørgsmål ("Hvad tror du, der sker?", gerne med to svar at gætte på), en handling og én sætning bagefter. Mens forløbet kører, er panelerne skjult (det kan `js/paneler.js` allerede), og kun scenen og forløbets linje er fremme. Til sidst: "Nu kan du lege frit", og panelerne åbner. Første gang i en del starter forløbet af sig selv og kan springes over. Opgaverne med stjerner bliver "Udfordringer" bagefter. Linjen med prikker og "Næste: …" i Tid og flybyen er den bedste model (tabletbillede 06).
- **Start:** "Dit første atom" i Værkstedet (nr. 3) og Liv (nr. 4) som prøve på et svært emne.
- **Belæg:** `js/guide.js`, `js/lag.js:211`, `js/beskeder.js`, `js/solsystem/flyby.js` og scenerne i `js/kosmos/tidhvorfor.js` er fem løsninger på samme opgave.

**2. Prøv før næste: byg ikke hurtigere, end nogen kan prøve** *(arbejdsgang · lille · en regel · sikker · nyt)*
- **Hvorfor:** Det er rodårsagen til nr. 1, 4, 5 og 6. "Ikke afprøvet" har 47 punkter. Liv L1-L2 blev bygget på to dage oven på Molekyler, som ingen havde prøvet. Tid blev godkendt som skitse af en voksen, der selv siger, at den er svær. Runden med sønnen blev sprunget over før eftersynet.
- **Forslag:** En ny stor del eller et nyt forløb er først færdigt, når et barn på 12-14 år har prøvet det i ti minutter uden hjælp, og en voksen bagefter kan sige idéen med egne ord. Tre faste spørgsmål: Hvad gjorde du først? Hvor gik du i stå? Hvad handlede det om? Der må gerne bygges videre imens (jeres svar 11. november 2026), men en ny del har status "prøve", til den er prøvet, og der er højst én ny stor del i gang ad gangen ud over Solsystemet. "Ikke afprøvet" holdes under ca. 10 punkter. Resten slettes, for de bliver aldrig besvaret.

**3. Indgangen: det første minut** *(UX · lille til mellem · Opus direkte · sikker · delvist kendt: guiden i Værkstedet har ventet siden oktober)*
- **Hvorfor:** "Start her" fører til en sort, tom scene med tre tællere på nul og ingen guide (E1-billede a). Den vigtigste linje på skærmen, opgaven, er klippet af: "Byg et h…" (testbillede 017). På tabletten på langs ligger pillerne oven i hinanden, og "Tip" dækker "Elektronsky" (testbillede 037). Opgaverne går til isotoper (deuterium og tritium) som nr. 4 og 5, før man har bygget carbon (`js/vaerksted.js:30-60`).
- **Forslag:** Forløbet "Dit første atom" (2 minutter: én proton, én elektron, helium, og se det lyse op på væggen). Ret toplinjen. Ret undertitlen i menuen, som ikke nævner liv og molekyler. Flyt isotoperne til et senere forløb.

**4. Liv: skær ned til én idé** *(indhold · mellem · efter nr. 1, drejebog fra Fable, Opus bygger · sikker · nyt)*
- **Hvorfor:** Se afsnit 3. Det er den del, I selv har sværest ved, og den er nyest, så der er mindst at miste.
- **Forslag:** Ét forløb, "Opskriften på dig": cellen → kernen → stigen (byg tre trin selv) → "tre bogstaver er ét ord" (læs to ord selv) → "skift ét bogstav". Højst to nye fagord pr. trin. Enzym, polymerase, tRNA, krystaldata og hele genet flyttes til "For nørder". **L3-L6 venter**, til L1-L2 er forstået af et barn. Ingen af delene skal kasseres: "Byg stigen", kodehjulet og "Skift et bogstav" er gode, de mangler rækkefølgen.

**5. Molekyler: sin egen del, og energiregnskabet ned i lag 2** *(indhold og helhed · mellem · Opus med plan · sandsynlig · nyt)*
- **Hvorfor:** Knaldgassen ligger tre lag nede (Værkstedet → Byg et molekyle → Del elektroner → Knaldgas), og molekylernes opgaver tæller som Værkstedets. Navnene "Del elektroner" og "Giv elektroner" siger, hvordan det virker, ikke hvad man laver. Regnskabet i eV ("det hårdeste stød havde kun 0,12 eV, men det koster 4,52 eV", tabletbillede 01) er gymnasiestof i lag 1.
- **Forslag:** Molekyler bliver en del for sig med indgangene "Byg vand", "Lav salt" og "Tænd knaldgassen". Først idéen (atomer hænger sammen ved at dele eller give elektroner), så energien som "Hvorfor?" og tallene i "For nørder". Den ærlige pointe om, at det koster energi at flytte elektronen, bevares i lag 2. Værkstedet bliver enkelt igen, og Ild får et sted at høre til. Se [E1-verdener.md](E1-verdener.md).

**6. Tid: oplevelsen først, og én indgang** *(indhold · lille til mellem · Opus direkte · sandsynlig · nyt)*
- **Hvorfor:** Listen har "Rejsen i tid" og "Hvorfor går tiden langsommere?" som to punkter blandt 13. De fem scener er i virkeligheden et forløb, og det er godt tænkt. Men scene 3 har tre kontakter, en skyder og γ = 38 (E1-billede e), og scene 4 og 5 (samtidighed og rumtidskort) er universitetsstof. Man får forklaringen, før man har undret sig.
- **Forslag:** Ét punkt, "Tid", der starter med rejsen: Du kommer hjem, og din tvilling er blevet gammel. *Så* kommer spørgsmålet "Hvordan kan det ske?" og scene 1 og 2. Scene 3-5 bliver "Vil du vide mere?".

**7. Ét sæt byggeklodser og et budget for panelerne** *(UI og udtryk · mellem · Opus med en kort plan · sikker · delvist kendt: F1 nr. 1 og 10, men det er skredet igen)*
- **Hvorfor:** Den samme ting ser forskellig ud fra skærm til skærm, fordi sessionerne har bygget hver sin. "Hvorfor?" er gule piller i Liv og Reaktoren, men foldebokse i Kosmos. "Ærligt talt" har gul kant i Kosmos og blå i Liv. Knapper og faner bruger emoji (🧩 🧬 📖 🔔), som ser forskellige ud på hver enhed og billige ud ved siden af menuens tegnede ikoner. Det meste tekst er 12-14 px (`style.css`: 13 px bruges 46 gange, 12,5 px 27 gange). Det er småt for en 12-årig med tabletten i hånden.
- **Forslag:** Én udgave af hver klods (spørgsmål, nørdeboks, "Ærligt talt", fakta-felt, knaprække). Et budget: højst fire spørgsmål fremme, resten under "Flere spørgsmål". Brødtekst mindst 15 px. Egne ikoner (SVG) i stedet for emoji. Fjern klokken, eller gør den til en del af forløbet. Slank de syv hjælpetekster til "sådan styrer du", og lad forklaringerne bo i kortene og Ordbogen.

**8. Ringen: en rigtig skala, og hver ting på sin plads** *(helhed · mellem · Opus, efter jeres valg · sandsynlig · nyt)*
- Tre af seks verdener har kun én del, "Ild og liv" parrer to ting uden noget til fælles, og skalaen "mindre … større" passer ikke (kernerne er mindre end atomerne). Forslaget står i [E1-verdener.md](E1-verdener.md): syv verdener i rigtig størrelsesorden, og en plads til alt det planlagte.

**9. Rejsen: den røde tråd** *(helhed · mellem til stor · efter nr. 1 og 3-6, Opus med plan · sandsynlig · idéen er kendt fra F1, rollen er ny)*
- **Forslag:** Når fire-fem forløb findes, bindes de sammen til én vej med 6-8 stationer: dit første atom → hvor atomerne kommer fra (Big Bang og Stjerneovnen) → de tunge (supernova og kilonova) → atomer bygger stof → stof bygger liv → kernen kan spaltes → ud i Solsystemet. Efter hver station: "Næste station" eller "Bliv og leg". Det er også skoleproduktet: Hver station har sit eget link, som en lærer kan dele.

**10. Hent skærmene, når de skal bruges, og giv hver skærm sine egne filer** *(teknik · mellem til stor · Opus med plan · sikker · delvist kendt: D11 i oktober)*
- **Hvorfor:** Ved start hentes alle 149 filer, og alle ni skærme bygges (`js/main.js:66-79`), også dem man aldrig åbner. Med dobbelt så meget indhold bliver starten dobbelt så tung. Og tre filer, `index.html` (1.100 linjer med alle skærme), `style.css` (1.834 linjer) og `js/main.js`, er det sted, hvor parallelle sessioner støder sammen.
- **Forslag:** Uden byggetrin: Hver skærm hentes med `import()` første gang, den åbnes. Hver skærm ejer sin egen HTML og sit eget stilark. Én lille liste (id, verden, titel, hvor koden ligger, status) erstatter de faste importer. En ny del bliver så en mappe og én linje. Gør det, før indholdet vokser videre.

**11. Ydelsen på skolernes enheder: mål først** *(ydelse · mellem · Opus, når I har lånt enhederne · sandsynlig · kendt som G1 og "Før vi deler", men vigtigere nu)*
- **Hvorfor:** En klode bruger skønnet op til 320 MB til teksturer på en tablet (Mars og Saturn, `tal.md`). Jeres tablet klarer det. En ældre skole-iPad eller Chromebook gør det måske ikke, og så lukker browseren siden. Det er ikke målt. Solsystemet henter desuden 3-10 MB af Jordens kort, bare fordi man åbner ved Solen.
- **Forslag:** Lån en gammel iPad og en Chromebook, og prøv Mars, Saturn og Stå på Mars. Lav derefter et tredje trin, "Let" (2k-kort, ingen glød), som vælges af sig selv på svage enheder. Beslutningen om komprimerede teksturer (KTX2) tages op igen ud fra målingen, ikke før.

**12. Solsystemet: overblikket nu, og en lille udgave af resten** *(indhold · stor · Opus med den plan, der findes · sandsynlig · nyt som prioritering)*
- **Hvorfor:** Solsystemet er jeres stærkeste del og samtidig den dyreste. Venus, Merkur, Pluto, månerne, landinger og Rumrejsen på Mars-niveau er mange uger. Imens mangler det enkleste: at se planeterne kredse om Solen.
- **Forslag:** Overblikket rykkes frem og bliver Solsystemets forside. Derefter månerne med mulige betingelser for liv (Enceladus, Europa og Titan), for dér er historien, og de binder Liv og Gåderne sammen. På Europa og Enceladus er det spændende havet under isen, så et snit gennem månen giver mere end en landing. Kun Titan har rigtige billeder fra overfladen (Huygens). Venus gøres færdig i en kort udgave. Merkur og Pluto får "lille udgave" (kloden, tre-fire steder og flyby). "Det hele skal med" gælder det, der er bygget, ikke alt det kommende.

**13. Før I deler: to udgaver og det praktiske** *(udgivelse · mellem i alt · Opus direkte · sikker · mest kendt, to-udgaver er nyt)*
- En **stabil udgave** til andre og en **prøveudgave** til jer: Hver del får en status i listen fra nr. 10, og dele under arbejde vises kun med `?lab`. Det afløser beslutningen om prototyper i den almindelige udgave, den dag den første fremmede får linket.
- App på hjemmeskærmen, som også virker uden net (vigtigt på iPads, hvor fuld skærm ikke virker i dag, og på skolers net). Tastatur og skærmlæser i dialogerne. "Om AtomLab" med "ingen data indsamles": Det er et stærkt kort over for skoler. En side til lærere med forløbenes links.

## 5. Beslutninger, jeg vil udfordre
| Nr. | Beslutning | Min vurdering |
|---|---|---|
| 1 | Sprog til en 13-årig | **Holder.** Men tilføj et mål for *begreber*: højst to nye fagord pr. trin i lag 1. Enkle sætninger gør ikke svært indhold let. |
| 2 | Laboratorium med opgaver og stjerner | **Holder, med en ny rækkefølge:** forløb først, fri leg og udfordringer bagefter. |
| 3 | Dybde i tre lag | **Holder, men bliver ikke holdt.** Lag 1 skal have et budget (se Retningen), og forløbet kommer foran som "lag 0". |
| 6 | "Det hele skal med" i Solsystemet | **Udfordres** for det kommende (nr. 12). Koster intet at skifte. |
| 7 | Ringen fra mindst til størst | **Holder som idé,** men gør skalaen ægte, og tag ikke flere end syv verdener ind. |
| 8 | Molekyler i Værkstedet | **Udfordres** (nr. 5). Koster 1-2 sessioner. Antistof under Kernerne holder. Tid i Kosmos holder, som ét punkt. |
| 9 | Liv lige efter Molekyler | **Var for tidligt.** Liv blev bygget på noget uprøvet. Gør L1-L2 forståelige, før L3-L6. |
| 10 | Prototyper i den almindelige udgave | **Skal ændres, før I deler** (nr. 13). Lille. |
| 11-12 | Intet byggetrin, GitHub Pages, ingen server | **Holder.** Det kan bære dobbelt indhold med nr. 10. Det første, der bliver svært, er starten og de tre fælles filer. Derefter repoets størrelse: 309 MB billeder nu, og så vidt jeg husker en grænse på ca. 1 GB hos GitHub Pages (ikke tjekket). Kildebilleder, der ikke hentes af programmet, bør ud af repoet, før månerne kommer. |
| 14 | KTX2 er ikke nødvendigt | **Tages op igen efter målingen** (nr. 11). |
| 15 | Et go før hvert trin | **Holder,** men flyt jeres go fra planens detaljer til to ting: delens ene sætning før, og resultatet på tabletten efter. |
| 16-20 | PR'er uden review, spor, små dokumenter, tests | **Holder.** |
| 21 | Opus bygger, Fable vurderer | **Holder.** Se afsnit 8. |

## 6. Arbejdsgangen
**Det virker:** sporene, læsekortet, faktagrundlag før tekst, `--ændret`, en ny session pr. delopgave og reglen om et go. En leder af et lille hold ville lade det være.

**Fem justeringer:**
1. **Prøv før næste** (nr. 2). Det er den vigtigste. I dag er byggeriet ikke flaskehalsen. Det er jeres tid til at prøve.
2. **Én sætning før planen.** Hver ny del starter med "Efter fem minutter kan brugeren sige: …". Planen, forløbet og testen med barnet måles mod den sætning. Det er billigt, og det er det, der manglede i Liv og Tid.
3. **Træk fra, når I lægger til.** Hver delopgave, der lægger noget i et panel, siger også, hvad der flytter ned i et lag eller ud. `/faerdig` får et punkt: "Er lag 1 inden for budgettet?"
4. **Flyt det dyre fra regler til opbygning.** Reglerne om fælles filer og merge-rækkefølge findes, fordi tre filer deles af alle. Nr. 10 fjerner årsagen.
5. **Ryd op i planerne.** 18 planer på 375 KB er mere tekst, end de fleste dele har kode. Færdige planer til arkivet, og Retningen (5 KB) som det ene dokument, alle læser. Testen `mars` (585 sekunder) deles i to, så `--ændret` for en planet ikke trækker den med.

**Hvad kan nås for hvilke midler?** Jeg kan ikke se jeres forbrug, så jeg regner i sessioner (en delopgave med Opus). Mine skøn er grove:
- Forløb-klodsen og fire forløb (nr. 1 og 3-6): ca. 10-14 sessioner.
- Byggeklodser, ringen og Rejsen (nr. 7-9): ca. 12-16.
- Teknik, ydelse og det praktiske før deling (nr. 10, 11 og 13): ca. 12-16.

Det er 35-45 sessioner i alt. I uge 45 lavede I 76 PR'er. **I kan altså gøre hele pakken på en måned med en fjerdedel af det nuværende tempo.** Penge og tokens er ikke det, der begrænser AtomLab. Det er, hvor meget I og et par børn kan nå at prøve. Mit råd er derfor at sætte tempoet ned og kvaliteten op: to-tre delopgaver ad gangen, og en fast aften om ugen, hvor det nye bliver prøvet.

## 7. Køreplanen, som jeg ville lægge den
*Rettet 11. november 2026 efter samtalen med jer (jeres go). I vil bygge videre imens og har meget forbrug de næste uger. Det ændrer tre ting:*
- ***Nr. 10 (hver skærm får sine egne filer) trækkes frem og laves først og alene,*** *fordi den rører de fælles filer. Bagefter er parallelle sessioner billigere.*
- ***Faktagrundlag laves på forhånd og parallelt*** *(videnskabsfolkene, gåderne, månerne og elektromagnetismen). Det er kun dokumenter, så det gør ikke programmet mere indviklet og støder ikke sammen med andet.*
- ***Nyt indhold må bygges, mens Serie 1 kører, på tre betingelser:*** *(1) Forløb-klodsen findes først, så nye dele ikke får den gamle form. (2) Hver ny del fødes med én kernesætning og sit forløb (Retningen). (3) Den har status "prøve", til et barn har prøvet den.*

**Serie 1, "Forståelig" (nu):** Forløb-klodsen og "Dit første atom" (nr. 1 og 3) → Liv som ét forløb (nr. 4) → Molekyler som egen del med forløb (nr. 5) → Tid som ét punkt og grupper i Kosmos' liste (nr. 6, og køreplanens punkt 7). En prøve med sønnen efter hvert.

**Serie 2, "Ét produkt":** byggeklodser og panelbudget (nr. 7) → ringen (nr. 8) → Rejsen med de første stationer og "Se også" (nr. 9).

**Serie 3, "Klar til andre":** skærmene hentes efter behov (nr. 10) → måling og trinnet "Let" (nr. 11, køreplanens G1) → to udgaver, app, tilgængelighed og lærerside (nr. 13) → 3-5 børn og en lærer prøver, og fundene rettes.

**Nyt indhold, i denne rækkefølge** (må starte, når Forløb-klodsen findes): Solsystemets overblik (nr. 12) · **Gåderne i en tynd udgave** (fem kort, der allerede har et sted i programmet: liv andre steder, det indre af et sort hul, stof og antistof, livets begyndelse og mørkt stof, hvert med tre faste spørgsmål: hvad ved vi, hvad ved vi ikke, og hvordan finder vi ud af det) · **de første 6-8 videnskabsfolk** med sider fra de rigtige bøger (se nedenfor) · månerne med mulige betingelser for liv · Liv L3 og derefter L4-L6 som forløb · Ild (sammen med knaldgassen) · **Strøm og magneter, så Lys, så Kvantefysik** (i den rækkefølge, fordi dobbeltspalten handler om bølger, og spektrallinjer er lys; Kvantefysik får en drejebog først og tre idéer: dobbeltspalten, energitrin med spektrallinjer og tunneleffekten) · Mørkt stof · Antistof · Tjernobyl · Venus kort · fotos af grundstofferne · Merkur og Pluto i lille udgave.

**Videnskabsfolkene og bogsiderne:** Risikoen er et leksikon, man læser, i et program, hvis styrke er, at man gør noget. Derfor er hver person knyttet til én opdagelse, man kan gøre efter i programmet (fx Rømer og lysets fart ved Jupiters måne Io, Tycho Brahe og supernovaen, Huygens og Saturns ring, Bohr og skallerne i Værkstedet). Den danske vinkel (Brahe, Rømer, Ørsted, Bohr og Inge Lehmann) er stærk over for danske skoler. "Ærligt talt" om myterne (Newtons æble, Galilei og tårnet i Pisa). Rettighederne tjekkes side for side: De gamle værker er frie, Einsteins tekster burde være blevet frie i EU i 2026, men Bohrs og Lehmanns er det ikke (efter hukommelsen, ikke juridisk rådgivning). Alle navne, årstal og rettigheder her skal faktatjekkes.

**Ikke nu:** kvantecomputeren (ændrer sig hurtigt og er svær at gøre både ærlig og til at røre ved), T4 (cockpittet), grafik G4, at gå rundt på Mars, Mars som koloniseret, Uranus' måner der støder sammen, Rumrejsen (først når overblikket findes) og den engelske udgave (først når den danske er prøvet, men hold teksterne i datafiler, så det er muligt). **Aldrig i AtomLab:** Hjernen og AI (et andet produkt) og en chat (kræver server og kan svare forkert).

**Hvad jeg flytter, og hvorfor:** Liv L3 og Venus V3 ned, fordi forståelse kommer før mere. Overblikket op foran planeterne. Månerne med mulige betingelser for liv op foran Merkur og Pluto. Gåderne op, fordi formen selv holder mængden nede. Elektromagnetisme foran Kvantefysik, fordi den ene bygger på den anden. Ild efter Molekylers flytning, så de lander samme sted. Nr. 10 og G1 op, fordi målet nu er skoler, og fordi der skal bygges meget.

**To muligheder, ingen har nævnt:**
- **Lys** er det manglende led. Elektroner, der hopper mellem skaller, giver farver. Farverne er grunden til, at vi ved, hvad Solen er lavet af, og at universet udvider sig. Lys binder Værkstedet, Ild, Kvantefysik og Kosmos sammen, og bølger og stråling fylder meget i fysik/kemi i udskolingen (efter hukommelsen, ikke tjekket mod Fælles Mål). I dag ligger det spredt som idéer (flammefarver, spektrallinjer og radiobølger).
- **"Hvordan ved vi det?"** som en fast slags kort ved siden af "Hvorfor?" og "Ærligt talt": hvem målte det, hvornår og hvordan. Myonerne i Tid er allerede sådan et. Det passer til jeres ærlighed, og det giver videnskabsfolkene en plads dér, hvor deres opdagelse bruges.

## 8. Hvor Fable gør det klart bedre end Opus
- **Betaler sig:** (1) Skabelonen for et forløb og drejebogen til de første svære (Liv og Tid): Opgaven er at vælge fra, og det er dér, Opus' drejebøger er blevet for fuldstændige. (2) Et kort eftersyn som dette før hver udgivelse eller ca. hver anden måned. (3) Faktagrundlaget for omstridt stof: Tjernobyl, Gåderne og livets begyndelse. (4) En gennemlæsning af planen for nr. 10, én gang.
- **Betaler sig ikke:** byggeri, tekster, tests, billeder, planeter efter den faste skabelon og faktatjek af korte tekster.
- **Ærligt:** Prøven med et barn (nr. 2) betyder mere for forståelsen end valget af model.

## 9. Spørgsmål til jer
1. Vil I sætte nye store dele (Liv L3 og Venus V3) på pause, til Serie 1 er lavet og prøvet? Mit råd: ja.
2. Kan sønnen og gerne ét barn mere prøve noget en fast dag om ugen? Uden det hjælper resten kun halvt.
3. Ringen: rigtig skala med Kernerne først (mit råd), eller Atomer først og ingen skala? Se [E1-verdener.md](E1-verdener.md).
4. Må Molekyler flytte ud af Værkstedet og blive sin egen del?
5. Hvilke enheder har skolerne omkring jer, og kan I låne en gammel iPad og en Chromebook?
6. Hvornår er "frigivet": en fast dato, eller når fem børn og en lærer har brugt det uden hjælp? Mit råd: det sidste.
7. Skal jeg lave skabelonen for forløb og drejebogen til Liv som E3? Det er det ene sted, jeg vil anbefale at bruge mig igen nu.

## Jeres svar (11. november 2026, i samtalen efter eftersynet)
- **Spørgsmål 1 (pause for Liv L3 og Venus V3, til Serie 1 er lavet og prøvet):** Ja.
- **Spørgsmål 2 (en fast prøve):** Ja. Men I vil også gerne bygge videre imens, med et skarpt fokus på, at det ikke bliver for indviklet, og stadig med faglig dybde. Jeres idé: flere "sider" eller forklaringer, så det hele ikke kommer på én gang. Det er det samme som forløbene i nr. 1.
- **Spørgsmål 3 (ringen):** Mit råd følges: en rigtig skala med Kernerne først.
- **Det, I glæder jer mest til:** de store videnskabsfolk og uddrag fra de rigtige bøger (billeder af siderne), elektromagnetisme, kvantefysik, at få Solsystemet færdigt, månerne med mulige betingelser for liv og Gåderne som en sektion. I har meget forbrug til rådighed de næste par uger.
- **Go til den ændrede rækkefølge og de tre betingelser** (afsnit 7 og Retningen er rettet samme dag).
- Spørgsmål 4-7 er ikke besvaret endnu. Opus lægger dem frem som valg i E2.

## Sådan kommer vi videre
1. **E2 (Opus tager over):** en ny session med Opus, høj effort. Prompt: *"Læs docs/plan-fable-eftersyn.md (afsnittet E2), docs/fable/E1-eftersyn.md, docs/fable/E1-verdener.md og docs/fable/E1-retning.md, og lav E2."* Opus skriver sine noter, lægger de åbne valg frem (spørgsmål 4-7 og de udfordrede beslutninger i afsnit 5), retter køreplanen og `docs/plan-verdener.md`, og flytter Retningen til `docs/retning.md`, når I har godkendt den.
2. **Derefter, i hver sin session med Opus:** en plan for nr. 10 (først og alene) og faktagrundlagene (parallelt). Opus skriver prompterne i E2.
3. **E3 (lavet 11. november 2026 efter jeres go):** [skabelonen for et forløb](E3-forloeb.md) og [drejebogen til Liv](E3-liv-drejebog.md). Skabelonen har også et eksempel på "Dit første atom". Oprindeligt forslag: skabelonen for et forløb og drejebogen til Liv. Det er det ene sted, hvor jeg anbefaler dybde fra mig, fordi hele Serie 1 får sin form derfra. Forløb-klodsen bygges af Opus bagefter. En detaljeret plan for resten laver Opus lige så godt og billigere.

## Det har jeg ikke tjekket
Lyden. Hvordan det føles med fingre, og om det hakker (kun jeres ord). Ca. halvdelen af testbillederne (mest planeter og menuens varianter). Fakta om fysik og kemi. GitHub Pages' grænser og Fælles Mål (efter hukommelsen). Skønnene i sessioner er mine egne og kan være forkerte med en faktor to. Størst risiko for fagfejl ser jeg i de nyeste og tætteste tekster: Liv L2 og Tid scene 3-5.
