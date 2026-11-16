# AtomLab: kort over navigationen

Lavet 16. november 2026 af en hjælpeagent ud fra koden (ikke ved at køre programmet), til Fables UI/UX-eftersyn E20.
Rettes, hvis koden ændres. "Set i koden" betyder ikke "prøvet på en skærm". Er noget markeret med ?, kunne det ikke ses i koden.

## 1. Rejsen fra start

**Første gang.** En bjælke "Henter AtomLab" (index.html:30-55) fyldes, mens JavaScript hentes, og tones væk, når det første 3D-billede er tegnet. Bagefter står man i **menuen**.

**Menuen** er en ring af seks verdener, der kredser om et lille svævende carbon-atom på en skrå elektronbane. Rækkefølgen er fra det mindste til det største: Kernerne, Atomer, Liv, Elektricitet, Rummet, og Biblioteket sidst (uden for skalaen). Den verden, der står forrest, har et kort med navn, en linje tekst og knapper til sine dele. Man drejer ringen på fire måder: **træk med finger eller mus** (ringen tager farten med og falder på plads), **musehjul** (ét kort pr. rul), **piletaster** venstre og højre, og **et tryk på en verden til siden** eller på dens ikon i **docken** under ringen (teksten "‹ mindre … større ›"). Under docken står knappen **"★ Din fremgang"**.

- Ringen starter på den verden, hvis del man sidst var i (gemt som `atomlabSidsteDel`). Ny bruger starter på Atomer, og knappen **Atomværkstedet** har en blinkende lap "Start her" (karrusel.js:271-278, style.css:1971).
- En verden med **én del** (Liv, Elektricitet) er ét stort kort: et tryk et vilkårligt sted åbner delen. Verdener med flere dele (Kernerne 2, Atomer 3, Rummet 2, Biblioteket 3) har en knap pr. del på kortet.

**Ind og ud.** Hver del er et `#navn` i adressen (fx `#vaerksted`). Delene hentes først, når de åbnes. Tager det mere end 1 sekund, står en bjælke "Henter Solsystemet …" øverst, og den gamle skærm står, til den nye er klar (main.js:123-150, hentning.js). Fejler hentningen, bliver man, hvor man var, og får en besked om at tjekke nettet og genindlæse.
- **Hjem:** Knappen **"‹ Menu"** øverst til venstre i hver del (et link til `#`). Der er ingen anden vej hjem; logoet er ikke et link.
- **Browserens tilbage-knap** virker, fordi hvert skærmskift er en ny adresse. Da "‹ Menu" også er en ny adresse, vil Tilbage fra menuen føre en tilbage ind i delen (set i koden, ikke prøvet).
- **Esc** lukker dialoger. Der er ingen genvej til menuen.
- Knapper i tekster (`data-gaa`, js/gaa.js) kan hoppe direkte til et grundstof, en gåde, et forløb eller et fænomen i en anden del.

**Antal tryk fra menuen til den første handling** (fra ringen, via docken: 1 tryk på verdenens ikon, 1 tryk på delen; Liv og Elektricitet: 1 + 1 på kortet; Atomer, når ny: 1):
| Del | Tryk til delen | Det første, der sker bagefter |
|---|---|---|
| Atomværkstedet | 1 (ny) eller 2 | Forløbet "Dit første atom" starter af sig selv; første handling er et tryk på + i forløbets linje |
| Molekyler | 1-2 | Forløbet "Når atomer mødes" starter af sig selv (kræver, at man har taget "Dit første atom", ellers står et link dertil) |
| Det periodiske system | 1-2 | Tabellen i 3D; første handling er at trykke på et grundstof eller søge |
| Stjerneovnen | 2 | Første gang en kort rejse ind i Solen, derefter en guide med lysende ring; første handling er at vælge en kerne |
| Reaktoren | 2 | Guide første gang (hver af de to tilstande har sin egen) |
| Liv | 2 (ét kort) | Forløbet "Opskriften i dig" starter af sig selv |
| Batteriet | 2 (ét kort) | Guide første gang |
| Solsystemet | 2 | Forløbet "Rundt om Solen" starter af sig selv på forsiden (overblikket) |
| Kosmos | 2 | Venstre liste med 12 fænomener; Rejsen i tid-forløbet starter kun, hvis man vælger "Tid" |
| Ordbogen | 2 | Søgefelt og bogstavliste; første handling er at skrive eller trykke et bogstav |
| Gåderne | 2 | Skinnen med første gåde i fokus og knappen "Flyv ind ›" |
| Opdagelserne | 2 | Hylden med ti bøger; første handling er at vælge en bog og trykke "Begynd" |

## 2. Skærmene

Alle 12 dele står i js/skaerme.js:10-23. "Prøve" betyder, at delen ikke er prøvet af et barn endnu (js/skaerme.js:6-7); det vises ikke anderledes i programmet.

| Del | Verden | Status | Det første, man ser | Underdele, faner, knapper til at skifte | Sådan kommer man ud |
|---|---|---|---|---|---|
| Atomværkstedet | Atomer | færdig | Forløbet "Dit første atom" (linje under scenen; ellers venstre byggepanel med Protoner, Neutroner, Elektroner, højre infopanel, atom i midten) | Fire faner i infopanelet: Atom, Kerne, Fakta, Nørd. Kontakt "Elektronsky". Opgave-pille ★ i toplinjen. Små periodisk system nederst | ‹ Menu |
| Molekyler | Atomer | færdig | Forløbet "Når atomer mødes" første gang; ellers venstre panel med palet (træk atomer ind) og højre forklaring | To måder: **Del elektroner** og **Giv elektroner** (knapper øverst i panelet). Knapper "Forfra", "Pile", "Knaldgas". Opgaver i panelet | ‹ Menu |
| Det periodiske system | Atomer | færdig | Tabel i 3D med søgefelt i toplinjen og filtre (kategorier) nederst | Tryk på et grundstof giver et kort (‹ ›, "‹ Tilbage", "Byg det i værkstedet"). Tryk på en kategori giver et kategorikort med små forsøg | ‹ Menu. Fra grundstofkort: "‹ Tilbage", Esc eller browserens tilbage |
| Stjerneovnen | Kerner | færdig | Første gang rejsen ind i Solen, så en guide; venstre panel med temperaturskyder | Højre panel; foldeboks med graf og opgaver. Tidsknap (⏸ ▶ ⏩ og langsom) nederst | ‹ Menu |
| Reaktoren | Kerner | færdig | Guide; venstre panel (vælg kerne og neutron) | Toplinjens vælger **Spalt én kerne** / **Kædereaktion**. Chips for Uran-235 og -238 | ‹ Menu |
| Liv | Liv | prøve | Forløbet "Opskriften i dig"; ellers venstre panel med to forløb og "Leg frit" (niveauer fra cellen til atomerne) | Knapper "Forløb 1" og "Forløb 2", niveauer, "Vis hydrogen", "Byg stigen", "Fra opskrift til protein" | ‹ Menu |
| Batteriet | Elektricitet | færdig | Guide; batteriet skåret igennem | Tre chips (Oplad, Aflad, Pause), tre hastigheder, "Snyd laderen (farligt!)", "Nyt batteri" | ‹ Menu |
| Solsystemet | Rummet | færdig | Forløbet "Rundt om Solen", overblikket | Listen til venstre: Overblik, Solen, Venus, Jorden, Mars, Jupiter, Saturn, Uranus, Neptun m.fl. (13 steder), og under hver klode steder, måner og forsøg. Titlen i toplinjen er en knap tilbage til forsiden. Flyby og "Stå på Mars" | ‹ Menu (eller titlen for at gå til forsiden) |
| Kosmos | Rummet | færdig | Venstre liste i fire grupper (Universet, Stjernernes liv, Tid og rum m.fl.) med 12 fænomener | Vælg et fænomen; knapper i scenen til det, der kan ske. Knap til Solsystemet nederst i listen | ‹ Menu |
| Ordbogen | Biblioteket | færdig | Søgefelt, bogstavbjælke og alfabetisk liste | Søg, tryk bogstav, tryk et ord. Et ord kan have "Hvorfor?"-knapper og links til andre dele | ‹ Menu |
| Gåderne | Biblioteket | prøve | Skinnen: én gåde i fokus med sit spørgsmål og "Flyv ind ›" | "‹ mindre" og "større ›" langs skinnen; i et kort "‹ Alle gåder" | ‹ Menu. Fra et kort: "‹ Alle gåder" eller Esc |
| Opdagelserne | Biblioteket | prøve | Hylden med ti bøger (en tidslinje efter årstal) | Vælg en bog, bladr (pile), "Begynd" starter fortællingen som forløb | ‹ Menu. Fra en bog: "‹ Hylden" eller Esc |

## 3. Fælles mønstre pr. del

✓ = findes i koden. – = findes ikke. ? = kunne ikke ses.

| Del | Forløb-klods | "Hvorfor?"-kort | "Næste skridt" | Guide 1. gang | Tidsknap / pause | Fuldskærm | "Forfra" | Fremgang / ✓ i menuen | Hjælp (?) | Ord-forklaring | Lyd | "Kun grafik" (G) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Atomværkstedet | ✓ (Dit første atom) | ✓ | – (opgavepille i stedet) | – (forløb i stedet) | – | ✓ | ✓ (Start forfra i opgavelisten) | ✓ opgaver | ✓ | ✓ | ✓ | ✓ |
| Molekyler | ✓ (Når atomer mødes) | ✓ | ✓ | – | ✓ (i begge måder og knaldgas) | ✓ | ✓ | ✓ opgaver | ✓ | ✓ | ✓ | – |
| Det periodiske system | – | ✓ (kategorikort) | – | – | – | ✓ | – | ✓ opdaget x/118 | – | ✓ | ✓ | – |
| Stjerneovnen | – | ✓ | ✓ | ✓ (+ rejsen) | ✓ | ✓ | ✓ | ✓ opgaver | ✓ | ✓ | ✓ | ✓ |
| Reaktoren | – | ✓ | ✓ | ✓ (to) | ✓ | ✓ | ✓ | ✓ opgaver | ✓ | ✓ | ✓ | ✓ |
| Liv | ✓ (to forløb) | ✓ | ✓ | – | ✓ (kun i "Fra opskrift til protein") | ✓ | ✓ | ✓ opgaver | ✓ | ✓ | ✓ | – |
| Batteriet | – | ✓ | ✓ | ✓ | – (egen "Pause"-chip og hastigheds-chips) | ✓ | ✓ ("Nyt batteri" er noget andet) | ✓ opgaver | ✓ | ✓ | ✓ | ✓ |
| Solsystemet | ✓ (Rundt om Solen) | ✓ | – | – | ✓ | ✓ | – | ✓ "set" | ✓ | ✓ | ✓ | ✓ |
| Kosmos | ✓ (to om tid) | ✓ | – | – | ✓ | ✓ | – | ✓ "set" | ✓ | ✓ | ✓ | ✓ |
| Ordbogen | – | ✓ | – | – | – | ✓ | – | – | – | – (er selv ordene) | ✓ | – |
| Gåderne | – | ✓ | – | – (egen første-gang-linje på skinnen) | – (?) | ✓ | – | ✓ egne ✓ i oversigten, men ikke i menuens "Din fremgang" | – | – | ✓ | – |
| Opdagelserne | ✓ (Saturns ører i bogen) | – | – | – | – | ✓ | – | ✓ forløbet ✓ i "Din fremgang"; ellers intet | – | – | ✓ | – |

Noter til matrixen:
- **Hjælp** er en "?"-knap i toplinjen i otte dele, og dialogen har hver sin titel: "Sådan virker et atom" (Værkstedet, index.html:1139), "Molekyler: når atomer mødes" (425), "Sådan virker Stjerneovnen" (597), "Sådan virker Reaktoren" (727), "Liv: opskriften" (838), "Sådan virker et lithium-ion-batteri" (931), "Kosmos" (989), "Solsystemet" (1042). **Menuen, Det periodiske system, Ordbogen, Gåderne og Opdagelserne har ingen hjælp.**
- **Lyd** (🔊/🔇) står i alle toplinjer undtagen menuens og gælder alle dele (`atomlabLyd`).
- **Fuldskærm** skjules, hvis browseren ikke kan (fx Safari på iPhone, js/fuldskaerm.js:34-38).
- **Forløb-klodsen** er linjen under scenen (prikker, Spørg, Gæt, knapper, "‹", "Næste ›", "Spring over"); paneler og knapper skjules imens. Otte forløb (js/data/forloeb/liste.js) starter af sig selv første gang og kan tages igen fra "Din fremgang".
- **"Kun grafik"** (en knap med et panelikon før fuldskærmsknappen, plus tasten G og små fane-pile på panelernes kant) findes kun i de seks dele med to paneler (js/paneler.js:14-21). På tablet i højkant står panelerne under scenen, og fanerne bruges ikke.
- **Menuens "Din fremgang"** viser 9 af 12 dele (ikke Ordbogen, Gåderne og Opdagelserne) plus forløbenes ✓ (js/main.js:fremgangPrDel, karrusel.js:467-535). Verdenen Biblioteket kan derfor aldrig få ✓ (`v.dele.every(klaret)` kræver data for alle, karrusel.js:283-286).

## 4. Uens ting set i koden

1. **Tre slags "første gang"-hjælp.** Guide med lysende ring (Stjerneovnen, Reaktoren, Batteriet: js/fusion.js:273, reaktor.js:228, batteri.js:364), Forløb-klods (Værkstedet, Molekyler, Liv, Solsystemet, Kosmos' tid, Opdagelserne) og intet (Det periodiske system, Ordbogen; Gåderne har sin egen linje på skinnen). Genvejen til at få dem igen hedder noget forskelligt: "Vis guiden igen" (index.html:611, 738, 946), "Tag forløbet "Dit første atom" ›" (1145) og "Vis rejsen ind i Solen" (611); i Molekyler, Liv og Solsystemet står forløbene i en liste.
2. **Tilbage-knapper med forskellige navne og pladser.** "‹ Menu" (toplinjen, alle dele), "‹ Tilbage" (inde i grundstofskortets panel i Det periodiske system, index.html:459), "‹ Alle gåder" (i kortet, js/gaader.js:166), "‹ Hylden" (øverst i bogen, js/opdagelser.js:133), Solsystemets titel i toplinjen som knap til forsiden (js/faenomenskaerm.js:492-495), og "‹ mindre / større ›" i Gåderne og i menuens dok (to ens tegn, to betydninger: rundt i en skala). Kun Det periodiske system bruger browserens historik til sit kort (js/system.js:599-642); de andre gør ikke, så Tilbage i browseren går direkte ud af delen.
3. **"Nulstil" hedder mange ting:** "↺ Start forfra" (index.html:433, 1063), "Forfra" (Molekyler, index.html:314, uden pil), "Ryd" (Værkstedet), "Nyt batteri", "Ny stige", "↺ Som i genet" (:796), "Nulstil al fremgang" (gemt i Værkstedets hjælp, :1186). "Nulstil al fremgang" og "Om AtomLab" (ophavsret, kilder og licenser, :1183-1186) ligger kun i Værkstedets hjælp, ikke et sted, hvor man leder efter dem fra menuen.
4. **Hvor opgaverne står:** pille ★ x/y i toplinjen (Værkstedet), panel (Molekyler, "Opgaver" med ★), foldeboks "Opgaver" i højre eller venstre panel (Stjerneovnen, Reaktoren, Batteriet: index.html:535, 658, 801, 878 `opgave-boks`), "Leg frit" (Liv), små prikker for "set" (Kosmos, Solsystemet) og slet ingen (Ordbogen, Opdagelserne).
5. **Tid:** tidsknappen (⏸ ▶ ⏩) findes i seks dele, men Batteriet har i stedet chips "⏸ Pause" og "Langsom / Normal / Hurtig" inde i panelet (index.html:868-877), og Liv har kun tidsknap i "Fra opskrift til protein" (js/liv-protein.js:54). Værkstedet og Det periodiske system har ingen, og der er ikke noget "afspil igen".
6. **Skift mellem to måder:** Reaktorens vælger i toplinjen ("Spalt én kerne / Kædereaktion", index.html:622-623) og Molekylers vælger inde i venstre panel ("Del elektroner / Giv elektroner", :307). Begge er `.del-knap`, men på to forskellige pladser. Værkstedets "Elektronsky" er en `.kontakt`-knap i toplinjen; i Det periodiske system står den i kortet (index.html:456).
7. **Hjælp og toplinje:** Åtte dele har "?" i toplinjen, fire har ikke. Nogle toplinjer har en statuslinje (`system-status`, fx "Inde i Solens kerne") andre har søgefelt (Det periodiske system), vælger (Reaktoren) eller opgavepille (Værkstedet), så toplinjen ser forskellig ud fra del til del. På en smal skærm bryder den over på to linjer (style.css:1436).
8. **Touch-størrelser** (der er ingen `pointer: coarse`-regel, der gør knapper større: kun style.css:64 og :398):
   - `.knap.lille` ca. 31-33 px høj (padding 7 px og 14 px tekst, style.css:89). Bruges til "‹ Menu", "Hjælp", "Luk" og mange små knapper. `.knap.ikon` er 36 px bred (style.css:90): Lyd, ?, Fuldskærm og Kun grafik.
   - `.chip` ca. 24 px høj (style.css:341-348), og som filter/valgknap i Reaktoren og Batteriet (`chip filter`, :850). I stabilitetskortet 12 px og 2 px padding (:525), i udgavevælgeren 12 px (:193).
   - `.menu-ikon` (docken i menuen) 38 px, 34 px under 560 px bredde (style.css:2021, 2061). `.verden-knap` 48, men 44 og 40 på små skærme (2059, 2076).
   - `.rund` (+ og − i Værkstedet) 44 px, men 40 px under 820 px bredde (style.css:375-377, 1461).
   - `.panel-fane` 22 × 60 px (style.css:1632). `button.hvorfor` ca. 22 px (padding 1 px, style.css:1837). `.link-knap` 13 px tekst (style.css:507). `.del-knap` ca. 31 px (style.css:1026). `.ut-luk` 28 × 24 px og `.logknap` 30 px på telefon (style.css:1584-1585).
   - Til sammenligning har nyere dele 44-48 px: Liv (style.css:928, 955, 983), Gåderne (1189, 1197), Opdagelserne (1226, 1251), forløbets linje (2174-2191).
   Ældre dele (Værkstedet, Fusion, Reaktor) bruger de små knapper; de nyere bruger 44-48 px. Det er det største synlige hul på tablet.
9. **Ord-forklaringer** (prikket understregning) virker i hjælp, paneler og forløbets linje (js/ordforklaring.js:10-16), men ikke i Gåderne og Opdagelserne (ingen vælger for dem i ZONER); Ordbogen er selv opslaget.
10. **Esc** betyder mange ting: lukker dialoger, grundstofkort, gåde, bog, en valgt kerne, "Kun grafik" og guiden.

## 5. Det, Fable ikke kan se på et billede

- **Bevægelser:** Træk for at dreje (alle 3D-scener), rul eller knib for at zoome, træk atomer fra paletten ind i Molekyler, hold + eller − inde for at tilføje mange (Værkstedet), træk i tidsskyderen i Solsystemet, træk ringen i menuen (med fart og blød landing), bladre i en bog i Opdagelserne (pile eller træk, js/bog.js:133). Mellemrum = pause, G = Kun grafik, P/N/E og Shift i Værkstedet, pile i System og menu.
- **Overgange:** Ringen drejer med en fjeder; baggrunden bag menuen skifter motiv pr. verden; kameraet flyver ind til et atom eller en klode (rejse.js, flyby.js); Gåderne "flyver ind" i et kort og ud igen, og lysene på skinnen tænder første gang; Stjerneovnen har en rejse ind i Solen. Paneler fader ud forneden (`mere`) for at vise, at der er mere at rulle til; rullebjælkerne er skjult.
- **Lyd:** Klik, belønning og lyde i fænomener (js/lyd.js). Lyden kan slås fra med 🔊 i toplinjen og huskes. Lyd er tændt eller slukket for alle dele samtidig.
- **Ventetider:** Bjælken "Henter AtomLab" (første besøg). Delene hentes først, når de åbnes, og de store billeder (Jorden, Mars, Venus, Solsystemets planeter) hentes med en bjælke "Henter …", der først vises efter 1 sekund (hentning.js:7). Hurtig forbindelse: man ser den ikke; langsom forbindelse eller tablet på mobildata: den gamle skærm står en rum tid, før den nye kommer. Fuld skærm på iPhone findes ikke.
- **Det, der huskes mellem besøg** (docs/kode/gemte-data.md, localStorage, kun i den browser): klarede opgaver og opdagede grundstoffer, forløb og guider set, sidste del, valgt fane, skjulte paneler, åbnede foldebokse, ringe/sky, valgt og "set" fænomen, "Navne", lyd, færdige gåder, 🔔-loggen. **Ny browser eller privat vindue viser alt som første gang**, så skærmbilleder af "første gang" og "senere" er to forskellige oplevelser. Uden lagring virker alt, men intet huskes.
- **Forskel mellem første gang og senere:** Forløb og guider starter kun første gang; "Start her" i menuen vises kun for en helt ny bruger; "‹ mindre … større ›"-skinnens lys i Gåderne tændes første gang; Stjerneovnens rejse vises kun første gang (og ikke med "reducer bevægelse" slået til i styresystemet, ROLIG).
- **Layouts, der skifter:** Ved 1150 px bliver panelerne smallere; under 820 px (og i højkant) står de under scenen, og hele skærmen kan rulles; under 560 px og under 500 px højde skrumper tekst og knapper yderligere (style.css:1414, 1432, 1485, 1530).
