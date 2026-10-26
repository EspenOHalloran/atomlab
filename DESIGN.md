# AtomLab: indhold og plan

AtomLab skal lære en 13-årig om protoner, neutroner og elektroner, om grundstofferne og om kernereaktioner (fusion og fission). Det er et **laboratorium med opgaver**: man kan eksperimentere frit, men der er også opgaver, som giver stjerner og låser ting op. Alt er i 3D med glød og partikler.

## Lige nu (status til næste session)
*Opdateres, hver gang et stykke arbejde slutter (se `/faerdig`). Læs det først i en ny session. Sidst opdateret: 26. oktober 2026 (Mars M4b).*

**Sådan arbejder vi (jeres svar):**
- Få et "go", før et større stykke arbejde går i gang, og spørg, når noget er uklart. I vil have ærlige svar, ikke at blive talt efter munden.
- Én PR for hvert færdigt punkt. Opus merger den selv til `main`, når hele testsamlingen er grøn, så det kommer på GitHub Pages med det samme (https://espenohalloran.github.io/atomlab/). Bagefter startes arbejdsgrenen forfra fra `main`.
- Beslutninger og jeres svar skrives ind her med det samme, ikke kun i chatten.
- Det er kun jer, der bruger AtomLab indtil videre. Prototyper må derfor gerne ligge i den almindelige udgave (24. oktober 2026).
- Tabletten bruges lige meget på langs og på højkant. Lyd: ingen baggrundsmusik, de små lyde bliver.
- **Tests (jeres svar 24. oktober 2026):** Test, når det giver mening i forhold til prisen. I tester selv på den rigtige tablet. Derfor:
  - Mens der arbejdes: kun `node tests/koer-alle.mjs --ændret`. Hele samlingen køres én gang pr. delopgave, før den merges, for `main` er det, jeres søn bruger. Den koster få tokens, når den er grøn (én linje pr. test).
  - Skærmbilleder koster flest tokens. Tag kun billeder af det, der er ændret, og se kun de størrelser, hvor layoutet kan gå galt (fx pc og tablet på højkant).
  - Hvordan det føles med fingre, om det kører glat, og hvordan det ser ud på den rigtige skærm, tester I selv. Skriv i "Ikke afprøvet", hvad I skal kigge efter.
  - Nye tests tjekker logik og tal (fx retninger, pladser og tekster), ikke hvert billede.

**Jeres mål for Solsystemet** (jeres ord): Man skal få oplevelsen af at besøge planeterne, også deres måner. Flybyen ved Saturn er første skridt og skal senere bruges ved alle planeter.

**Mars (besluttet 24. oktober 2026):** Mars bygges som Saturn med Phobos og Deimos og en flyby, der også besøger steder på planeten (Olympus Mons, Tharsis, Valles Marineris, Hellas, nordpolen, Gale og Jezero). Jeres svar: Saturn og flybyen kører helt flydende på tabletten, så vi giver den gas med grafikken. "Det hele skal med. Det skal være så flot og imponerende som muligt": detaljer helt tæt på, "Stå på Mars" og månerne i den rigtige form. Opgaven er delt i otte delopgaver (M1-M8), og I siger go mellem hver. Planen står i [docs/plan-mars.md](docs/plan-mars.md). I M4 flyttes Mars og Saturn til deres egen skærm, "Solsystemet". Overblikket med Solen og planeterne (trin 2) venter. Mars får et 8k-kort.
- **Tokens bruges med omhu (jeres svar 24. oktober 2026):** Sig det med det samme, når noget koster unødigt mange tokens (fx sider, miljøet ikke kan åbne, eller en hjælpeagent, der må søge mange gange). Ofte kan I let løse det, fx ved at tilføje et domæne under miljøets Network access.
- **Blokeret adgang (jeres svar 24. oktober 2026):** Er en netside eller et værktøj blokeret i miljøet, så sæt udviklingen på pause, og bed jer om adgang (navngiv domænet). Gå ikke videre med en nødløsning uden at spørge først.
- **Værktøjer (jeres svar 24. oktober 2026):** Billedværktøjerne må bruge Python-pakker (fx `rasterio`). Bed altid om værktøjer (eller adgang til netsider), når noget kan gøre arbejdet hurtigere, billigere eller bedre.

**Senest lavet (26. oktober 2026): Mars, M4b (Solen og Jorden får egne visninger).**
- Et tryk på **Solen** og **Jorden** i listen åbner nu deres egen visning. Solsystemet har 8 fænomener, og menuen viser "x/8 set". Første gang åbner Solsystemet på Solen.
- **Jorden** er en klode med Månen i den rigtige størrelse og afstand (1 enhed = 1.000 km). Den bruger `lavJorden` og `lavMånen`, som de var. Lyset passer med datoen og klokken lige nu: Solens retning, Jordens drejning og Månens plads (og dermed månefasen) regnes ud fra tidspunktet (`js/data/himmel.js`). Danmark er en gul prik. Et ur nederst i 3D-billedet viser tiden i Danmark, om Solen er oppe, og månefasen og afstanden til Månen. "Drej Jorden" lader tiden gå ca. 800 gange hurtigere (mod øst), og "Månen" flyver ud til Månen og tilbage. En tynd linje viser Månens bane.
- **Solen** har den kogende overflade fra Kosmos, tal, et link til Stjerneovnen og knappen "Jorden ved siden af" (Jorden i den rigtige størrelse, 109 gange mindre).
- **Jeres svar ved go:** "Enig i dine anbefalinger": Månen står, hvor den er i dag, Jorden starter drejet efter klokken, og Solen får knappen "Jorden ved siden af".
- **Faktatjekket** (NSSDC og NASA, siderne åbnet med curl, `docs/fakta-solsystemet.md` del 4) rettede fem ting: lyset er 8 min 19 s (ikke 20 s), overfladen "bobler" (det er konvektion, ikke kogning), helium er ca. en fjerdedel af vægten, granulerne er ca. 4 mio. og ca. 1.500 km brede, og skyerne på Jorden er fra nogle få dage. Månens afstand står med yderværdierne (356.000-407.000 km), som erfaringer.md siger.
- **Formlerne** er testet mod Meeus' eksempel (0,1°), formørkelserne i 2026 (nymåne og fuldmåne), solopgang i København og tidsjævningen (ny test `jorden`).
- **Netsider:** earthobservatory.nasa.gov blev afvist af miljøets proxy (hjælpeagenten prøvede). Det er kun brugt til at tjekke, om skyerne er fra én dag, så teksten er skrevet forsigtigt i stedet.

**Før det (26. oktober 2026): Mars, M4a (skærmen Solsystemet).**
- Et nyt kort i menuen, **Solsystemet**, lige før Kosmos. Menuen har nu 4 + 3 kort på pc og tablet på langs (den sidste række i midten), 2 kolonner på tablet på højkant, 1 på telefon på højkant og 4 på telefon på langs.
- Skærmen `#solsystem` har en liste efter afstanden til Solen: Solen (Solstorm, Solens fremtid), Jorden (Årstiderne, Formørkelser), Mars og Saturn. På telefon på højkant står de fire kloder på én række, og underpunkterne kommer i en række under dem. Indtil M4b åbner et tryk på Solen eller Jorden det første underpunkt.
- Kosmos har nu 11 fænomener i samme rækkefølge som før og et link til Solsystemet under listen. "Solens fremtid" i Hvid dværg er et link, og grundstofkortet (carbon og nitrogen) linker til "Solsystemet: Solens fremtid".
- Det, man har set, og det sidst valgte flytter med fra Kosmos, så prikkerne ikke kommer igen.
- Skallen om fænomenerne (listen, panelet, knapperne, underteksterne, pausen og "Kun grafik") er fælles for Kosmos og Solsystemet (`js/faenomenskaerm.js`). Saturn, Mars og de andre virker som før. Kun Saturns første linje er ændret ("Et besøg hos Saturn og dens måner" i stedet for "En prøve på …").
- Ny test `solsystem`. Testene for Saturn, Mars, Årstiderne og Formørkelser åbner nu `#solsystem`.

**Før det (25. oktober 2026): Mars, M3 (atmosfæren og lyset).**
- Mars har nu en tynd, støvet luft i kanten med den rigtige skalahøjde (11 km) og et tusmørke, der lyser svagt rødbrunt ind på natsiden.
- Polkapperne fra Viking-kortet er gjort hvidere.
- Skyer af is kommer over Olympus Mons, Tharsis-vulkanerne, Alba Mons og Elysium Mons om eftermiddagen på Mars, mens den drejer. De kaster en svag skygge.
- Knappen "Modlys" sætter Solen lige bag kanten af Mars, så luften lyser som en bue (langt væk som en ring hele vejen rundt) og er lidt blå tæt ved Solen.
- Teksterne er faktatjekket mod NSSDC, NASA (PIA02049, PIA07997, PIA19400), ESA og Wikipedia (`docs/fakta-solsystemet.md`, del 3, afsnit 11). Der er to nye fagord i ordbogen: tøris og skalahøjde.
- **Jeres svar ved go:** Polkapperne kommer fra kortet (ingen vinterkappe af tøris). Skyerne tegnes af programmet på de rigtige steder og kun om eftermiddagen. Årstiden er nordlig forårsjævndøgn.
- **Faktatjekket ændrede én ting:** Den lange sky ved Arsia Mons kommer i det sydlige forår, så den nævnes kun i nørd-teksten.
- **Netsider:** I åbnede msss.com, agupubs, nature.com og pubs.usgs.gov. pubs.usgs.gov virkede med det samme og msss.com sidst i sessionen (MARCI's vejrrapporter bekræftede skyerne over vulkanerne om eftermiddagen i det nordlige forår, også over Elysium Mons, som derfor kom med). nature.com blev stadig afvist af miljøets proxy, og agupubs (Wiley) svarer selv 403.
- Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Status efter M3".

**Før det (24. oktober 2026): Saturn, S1 (skarpere kort).** Tablet og telefon henter nu 4k-kort af Saturn og månerne (før 2k). Pc henter 8k af Enceladus, Tethys, Dione og Rhea. Saturn bliver på 4k, for kildens "8k"-fil er kun 4096 × 2048. Mimas og Titan bliver også på 4k, for deres kilder er ikke skarpere. Månernes kort ligger med én kanal i grafikkortet og fylder en fjerdedel. Enceladus' kort havde en tom række ved sydpolen, og den er skåret væk. Jeres svar ved go: Telefonen må også få 4k, og effort var medium. **Jeres svar bagefter (24. oktober 2026):** Det kører fint på mobil og tablet. Enceladus var overstrålet i fuldt dagslys, så den er dæmpet lidt (kortet ganges med 1,5 i stedet for 1,85 og klippes ikke længere, og lyset er ca. 10 % svagere). Nu ses kraterne og sprækkerne, og den er stadig den lyseste måne. Detaljer i [docs/plan-saturn-kvalitet.md](docs/plan-saturn-kvalitet.md) under "Status efter S1".

**Før det (24. oktober 2026): Mars, M2 (Mars-kloden).** Mars står i Kosmos mellem Solstorm og Saturn: en klode med de rigtige højder fra MOLA (bjergene er et net, der løftes efter højdekortet) og farverne fra Viking i 8k. Mars drejer mod øst og står stille helt tæt på, og knappen "Bjergene 10 gange højere" viser landskabet tydeligt. Teksterne er faktatjekket mod NSSDC, NASA og ESA (`docs/fakta-solsystemet.md`, del 3 afsnit 10). KTX2 kunne ikke prøves (GitHub er blokeret), så kortene er JPG. Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Status efter M2".

**Før det (24. oktober 2026): Mars, M1.** Planen ([docs/plan-mars.md](docs/plan-mars.md)) og faktagrundlaget med kilder (`docs/fakta-solsystemet.md`, del 3).

**Før det (24. oktober 2026, Trin 19 nedenfor):**
- **Saturn i Kosmos** (prototypen til Solsystemet) står nu i den almindelige liste efter Solstorm. Der skal ikke længere skrives en særlig adresse. Saturn, ringene og de seks store måner har den rigtige størrelse og afstand, og kameraet flyver mellem dem uden spring. "▶ Start flyby" har ni stop med en kort tekst og "Næste": oversigten, Saturn, hen over ringene, Mimas, Enceladus, Tethys, Dione, Rhea og Titan. Et tryk på en måne besøger den. Alle månerne har Cassinis kort. Teksterne er faktatjekket (`docs/fakta-solsystemet.md` afsnit 4b).
- **Himlen:** Der er ingen farvede tågeskyer i vores eget solsystem (Saturn, Årstiderne, Formørkelser, Solstorm og Solens fremtid). Ved Saturn er Solen en lille, skarp prik. Tågerne er stadig ved atomerne og i fx Big Bang.
- **Ringe eller sky i Det periodiske system:** knappen "Elektronsky" øverst på grundstofkortet. Valget deles med Værkstedet og huskes.
- **"Start forfra"** i Værkstedet, Stjerneovnen, Reaktoren og Batteriet: en knap nederst i opgavelisten. Den kræver to tryk og nulstiller kun den del.
- **Piletasterne** drejer kameraet i hele Kosmos, og Saturn lyser ca. 12 % svagere end før (jeres bemærkninger).
- **Atomet:** B (orbitalernes former) er standard for alle.

**Næste i gang (26. oktober 2026):** **Mars M4** er delt i M4a (skærmen Solsystemet, den fælles skal og flytningen, ✅ lavet), M4b (Solen og Jorden får egne visninger, ✅ lavet) og M4c (den fælles flyby og rejsen ned til overfladen, høj effort). **M4c venter på et go.** Se [docs/plan-mars.md](docs/plan-mars.md) under "Svar ved go til M4".
- **Jorden og Solen i Solsystemet (jeres svar 26. oktober 2026):** Med i M4. Jorden bliver en klode som Mars (man kan dreje den, og Månen er med), og Årstiderne og Formørkelser ligger under Jorden. Solstorm og Solens fremtid flytter med under "Solen". Jorden bruger de billeder og modeller, vi har nu, og kan gøres flottere senere, når Mars er færdig. Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Jorden i Solsystemet". S2 (ringene fra Cassinis målinger) og S3 (højder på månerne) venter, til Mars er færdig.
- **Mars på tabletten (jeres svar 24. oktober 2026):** kører fint med 8k-kortet og ser super ud. KTX2 er derfor ikke nødvendigt lige nu.
- **GitHub-adgang:** I har åbnet for GitHub under Network access, men github.com gav stadig 403, også i en ny session (tjekket 24. oktober 2026 i S1). Det er ikke brugt i S1. Skal KTX2 (`basisu`) prøves, så tjek miljøets indstilling for Network access igen.

**Venter på et go** (ikke startet, størrelsen står i parentes):
1. **Det sorte hul** er ikke imponerende nok (jeres billede): Den hvide ring ligner ikke bøjet lys, skiven foran hullet ligner et beige låg, og den ene side er ikke lysere end den anden. **Forslag:** Byg det om med rigtig lysbøjning (en shader, der regner lysets baner som i Interstellar), så skivens bagside bøjes op over og ned under skyggen, med en tynd fotonring og Doppler-lys (stor).
2. **Kategorien som link** (lille), **Ordbogen** (lille til mellem) og **fotoner i Stjerneovnen** (lille, skal faktatjekkes). Forslagene står under "Idéer til senere" nederst.
3. **Orbitalerne i store atomer** (fx jern) er svære at læse, fordi de mange former ligger oven i hinanden og ligner en blomst. **Jeres svar:** behold som nu, men tag det op igen. Forslaget er én underskal ad gangen (fx "4s" og "3d") med en kort tekst, som i fysikbøgerne (mellem).
4. **Molekyler, M1 (Byttebørsen):** Planen og jeres svar ligger klar i [docs/plan-molekyler.md](docs/plan-molekyler.md) (stor).
5. **Solsystemet, trin 2:** overblikket med Solen og planeterne, hvor de står i dag. Derefter kan planeterne ses på himlen fra Saturn, og der kan komme en knap "Find Jorden" (se [planen](docs/plan-solsystemet.md) under "Himlen") (stor).
6. **Fotos af grundstofferne** fra Wikimedia Commons med navn og licens (mellem).
7. **Et citat til Saturn** (de andre fænomener har et). Det skal have en sikker kilde (lille).
8. **Tjernobyl og Liv** venter på Fable (se [docs/plan-fable.md](docs/plan-fable.md)).

**Åbne spørgsmål til jer:**
- **Domæner (25. oktober 2026):** Listen over de domæner, der skal tilføjes under Network access, står i [docs/plan-mars.md](docs/plan-mars.md) under "Domæner, der skal på listen". Tjek dem med `curl`, når I har tilføjet dem.
- **Atomet B:** I har ikke set det på tabletten endnu. Sig til, hvis det skal ændres.
- **Faktatjek, der mangler:** Hjælpeagenterne kunne ikke åbne kildesiderne (kun søgeresultater). Det, der skal tjekkes mod kilderne, står i `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md` (især del 2 om Voyager og afsnit 4b om flybyen).

**Ikke afprøvet endnu:**
- **Jorden og Solen (M4b) på tabletten:** Passer dag og nat med det, I ser udenfor? Kan man finde Danmark-prikken og Månen? Er uret nederst i vejen på tablet på højkant? Kan man se den lille Jord ved "Jorden ved siden af" (zoom ind)? I testbrowseren er den kun et par pixel.
- **Solsystemet (M4a) på tabletten:** Er listen let at bruge med fingre på langs og på højkant? Ser menuen med 7 kort godt ud? På telefon på langs fylder underpunkterne en linje hver.
- **Mars M3 på tabletten:** Kører det stadig flydende med luften og skyerne? Er skyerne for tydelige eller for svage, og ser "Modlys" godt ud tæt på og langt væk? Er tusmørket for kraftigt?
- **Saturns måner (S1):** Den dæmpede Enceladus og 8k på pc er ikke set på en rigtig skærm endnu. 4k kører fint på mobil og tablet (jeres svar).
- **Mars:** Hvordan føles det at zoome helt ind og dreje tæt på overfladen, og drejer Mars for hurtigt (en omgang på ca. 1¾ minut)? (Den kører fint på tabletten med 8k.)
- Saturn på tablet på højkant: Ved Titan står Saturn bag panelerne, men man kan selv dreje. (Saturn og flybyen kører helt flydende på jeres tablet, og I synes, flybyen er super flot, 24. oktober 2026.)
- Stoppet over ringene: De mange tynde ringe er lavet af programmet og ser lidt "børstede" ud helt tæt på.
- NASA-billederne på en telefon. De er set på jeres tablet.
- Lyden og hvordan det føles med fingre.
- Det nye sorte hul (fra 23. oktober) på en rigtig tablet.

**Tidligere (23. oktober 2026):** De ni punkter efter F1-overblikket ([docs/fable/F1-overblik.md](docs/fable/F1-overblik.md)) er lavet. Se Trin 18 nedenfor og listen herunder. Noterne fra afprøvningen med jeres søn ligger i `docs/fable/soen-og-espens-noter.md`, og 14 skærmbilleder fra en rigtig tablet i `docs/fable/tablet/`. Jeres svar dengang, som stadig gælder:
- **Fotos af grundstofferne:** Ja, men efter teksterne i lag (punkt 7 er lavet). Fra Wikimedia Commons med navn og licens.
- **"Er det farligt?":** Kortet kommer der, hvor spørgsmålet opstår, med et dybere lag om, hvad strålingen gør ved cellerne og DNA, og hvor meget der skal til (lavet som "Hvorfor?"-kort).
- **Solsystemet:** Spørgsmål 1-5 i planen følger planens forslag, indtil I siger andet.

**Punkterne fra 23. oktober 2026 (alle lavet):**
1. ✅ **Hurtige rettelser:** Det sorte hul er sort (en større skygge uden glød), og "For nørder" står øverst igen i Kosmos på højkant.
2. ✅ **En kort UI-plan for lagene:** [docs/plan-lag.md](docs/plan-lag.md), godkendt med jeres svar (kortet åbner ved knappen, opgaverne foldes sammen, citaterne bliver, og underteksten er kort med "Hvorfor?").
3. ✅ **Vis eller skjul panelerne** og "Kun grafik".
4. ✅ **"Hvorfor?"-kort** (20 kort, faktatjekket).
5. ✅ **Et grafisk løft af atomet:** B (orbitalernes former) er standard fra 24. oktober 2026.
6. ✅ **Batteriet:** grafik, start og navnet "lithium-ion-batteri".
7. ✅ **Grundstofkortet i lag** og **fremgang i menuen**.
8. ✅ **Copyright** i README, hjælpen og `LICENSE`.
9. ✅ **De store dele:** plan og faktagrundlag til Molekyler, trin 0 i Solsystemet og prototypen med Saturn (siden 24. oktober med alle seks måner og flyby).

## Grundregler
- Dansk tekst i et enkelt sprog. Fagord forklares.
- Tæt på den rigtige fysik. Forenklinger siges ærligt.
- **Dybde i lag** (jeres princip, 23. oktober 2026): Brugeroplevelsen skal være i top, med flot UI og gode informationer de rigtige steder. Man skal ikke bombarderes med informationer, men de skal være lette at nå for den nysgerrige, fx med et klik. AtomLab skal have stor dybde og tyngde, men føles let, og man bestemmer selv, hvor dybt man vil bore. F1 foreslår, hvordan det kan gøres: Hver oplysning står ét sted ad gangen, og der er tre lag (altid fremme, "Hvorfor?" og "For nørder").
- Virker på pc (mus og tastatur) og tablet (fingre).
- Man åbner det via et link (GitHub Pages).

## Trin

- [x] **Trin 1: Grundskelet og Atomværkstedet**
  - Menu med fire dele. De tre sidste står som "kommer snart".
  - Knap til fuld skærm i menuen og i værkstedet (skjules, hvor browseren ikke kan).
  - 3D-scene med stjernehimmel og glød. Man drejer og zoomer med mus eller fingre.
  - Byg et atom: protoner, neutroner og elektroner flyver ind. Hold knappen inde for at tilføje mange. Tasterne P, N og E virker også, og med Shift fjerner de.
  - Infopanel: grundstof, isotop, massetal, ladning (ion), elektronskaller og om kernen er stabil (med halveringstid og grunden til, at den er ustabil).
  - Kernen ryster og lyser grønt, når den er ustabil, og blinker rødt, når den slet ikke kan hænge sammen.
  - Skift mellem ringe (Bohrs model) og elektronsky, med en ærlig forklaring.
  - Lille periodisk system. Grundstoffer bliver "opdaget", når man har bygget dem, og så kan man hoppe direkte til dem.
  - 16 opgaver: hydrogen, to protoner uden neutroner, helium-4, deuterium, tritium, se et henfald, carbon-12, den tungeste stabile carbon, oxygen-16, neon-20, Na⁺, Cl⁻, carbon-14, jern-56, uran-235 og uran-238-kæden ned til bly-206. Man kan starte forfra med opgaverne (opdagede grundstoffer beholdes).
- [x] **Trin 1b: Neutronernes rolle og ioner**
  - Stabilitetskort: protoner op ad, neutroner hen ad. De stabile kerner danner et bånd, der bøjer mod flere neutroner, og ens egen kerne er en lysende prik. Teksten under viser neutroner pr. proton og hvor mange neutroner, stabile kerner af grundstoffet har.
  - "Se den henfalde": kernen ryster, og så sker henfaldet som animation (betahenfald, beta-plus, alfa, dobbelt beta, neutron eller proton ud) med lysglimt og partikler med hale. Atomet bliver til det nye grundstof og er en ion et øjeblik, før det bliver neutralt igen. Uran-238-kæden følger den rigtige rækkefølge (8 alfa, 6 beta).
  - Hjælpen forklarer "Hvad er en ion?", "Hvorfor neutroner?" og "Hvad er radioaktivitet, og hvorfor er det farligt?", og der er links fra infopanelet. Ved ustabile kerner står, hvilken stråling de sender ud, og hvad der stopper den.
- [x] **Trin 1c: Flottere grafik og citater**
  - Elektroner med lysende haler, kuglerne har kantlys, og protonerne pulserer svagt. Gyldne lyspunkter viser kernekraftens "lim" (det siges ærligt, at det er en tegning). Rumstøv driver forbi. Chokbølge ved henfald.
  - Kameraet flyver ind, når man åbner en del, og svinger blødt, når man skifter grundstof.
  - Citater fra Feynman, Rutherford, Bohr, Sagan, Einstein, Hawking, Eddington, Faraday, Wheeler og Marie Curie i menuen, i hjælpen, i infopanelet og i Stjerneovnen, Reaktoren, Batteriet og opgavelisten. Kun citater med en sikker kilde (de står i `js/data/citater.js`). Brug dem også i de kommende dele (fx Einsteins E = mc² i Stjerneovnen og Reaktoren, Sagans "stjernestof" ved supernovaer).
- [x] **Trin 1d: Nørd-fanen**
  - En fjerde fane i infopanelet til dem, der vil vide mere: elektronkonfiguration (fx [Ar] 3d⁶ 4s², med de rigtige undtagelser som chrom og kobber), kernens radius, bindingsenergi i alt og pr. nukleon (målt, eller beregnet med dråbemodellen) med en bjælke, hvor jern og nikkel er toppen, og kernestoffets tæthed.
- [x] **Trin 2: Det periodiske system**
  - En buet 3D-væg med 118 felter, farvet efter kategori. Feltet under musen løfter sig og lyser op, og en etiket viser navnet. Opdagede grundstoffer har en gul stjerne.
  - Klik på et felt: væggen trækker sig tilbage, og grundstoffet vises som et atom i 3D. Kortet til højre viser fakta, hvor det findes, hvad det bruges til, hvornår og af hvem det blev opdaget, hvor navnet kommer fra, elektronskaller og stabile isotoper. Pilene (eller piletasterne) skifter grundstof.
  - "Byg det i værkstedet": er grundstoffet opdaget, åbnes det i værkstedet. Ellers får man en opgave om selv at bygge det (så "opdaget" stadig betyder, at man har bygget det).
  - Filtre: kategori, tilstand (fast, væske, gas) og opdagede.
- [x] **Trin 3: Stjerneovnen (fusion)**
  - Solens kerne i 3D: brintkerner suser rundt i et glødende plasma med frie elektroner (små blå gnister). Temperaturskyder fra 1 til 120 mio. °C og to tempi.
  - Plusladede kerner frastøder hinanden synligt (de bøjer af). Kun hvis de er hurtige nok, når de sammen. Er det for koldt, bliver en skudt proton skubbet væk.
  - Klik på en kerne og derefter på en anden for at skyde den første mod den anden (lige så hurtigt som temperaturen tillader). Målet bremser lidt, så det er til at ramme.
  - pp-kæden med rigtige energier: p + p → D + e⁺ + ν (1,44 MeV, lykkes kun nogle gange, fordi en proton skal laves om til en neutron), D + p → ³He + γ (5,49 MeV), ³He + ³He → ⁴He + 2 p (12,86 MeV). Bonus ved mindst 80 mio. °C: ⁴He + ⁴He → ⁸Be, som skal rammes af en tredje ⁴He, før den falder fra hinanden → ¹²C.
  - Lysglimt, chokbølge, "+MeV" der svæver op, positroner, neutrinoer og gammastråling med hale. Panel med frigjort energi, Solens opskrift (med tællere), seneste reaktion og E = mc².
  - Hjælpen siger ærligt, at det i virkeligheden kræver tunneleffekt, og at første skridt tager milliarder af år for én proton.
  - 7 opgaver (fx "for koldt", deuterium, helium-3, helium-4, 5 helium, 100 MeV og carbon).
- [x] **Trin 4: Reaktoren (fission)**
  - **Spalt én kerne:** Vælg uran-235 eller uran-238 og en langsom eller hurtig neutron. Uran-235 + langsom neutron: kernen vrider sig som en dråbe og spalter i et af tre rigtige par (Ba-141 + Kr-92 + 3 n, Xe-140 + Sr-94 + 2 n, Te-137 + Zr-97 + 2 n), med regnskab for protoner (92) og nukleoner (236) og ca. 200 MeV. Ca. 1 ud af 7 gange bliver neutronen bare fanget (uran-236). Hurtige neutroner preller oftest af. Uran-238 fanger neutronen og bliver til uran-239 (på vej mod plutonium-239).
  - **Kædereaktion:** 112 brændselskugler i vand med 6 kontrolstave. Neutroner (hvide = hurtige, blå = langsomme) bremses af vandet, spalter uran-235 og giver 2-3 nye. Effektmåler med grønt felt (6-16 spaltninger pr. sekund), nødstop over 28, blåt Tjerenkov-lys. Uden vand dør reaktionen ud. Stabil omkring 50 % stave.
  - Ærlig hjælp: hvorfor en reaktor ikke kan eksplodere som en bombe, men kan nedsmelte (Tjernobyl, Fukushima), og at brugt brændsel i spillet bliver frisk igen efter få sekunder.
  - 7 opgaver.

- [x] **Trin 5: Batteriet**
  - Et LiPo-batteri skåret igennem i 3D: kobberfolie og grafit (minus), elektrolyt med en porøs skillevæg, metaloxid (kobolt og oxygen) og aluminiumsfolie (plus). En ledning over toppen med en lader eller en lampe.
  - Opladning: Li⁺-ioner svømmer gennem elektrolytten (gennem hullerne i skillevæggen) og lægger sig mellem grafitlagene, mens elektroner (blå prikker) løber gennem ledningen. Konstant strøm, og ved 85 % konstant spænding, hvor strømmen falder. Fuld = 4,2 V.
  - Afladning: det modsatte, og lampen lyser. Beskyttelsen slår fra ved 3,0 V.
  - Hastighed (langsom, normal, hurtig) med varmemåler. "Snyd laderen": lithium-nåle vokser fra grafitten, stikker hul i skillevæggen og giver kortslutning med glimt, alarm og røg.
  - 24 lithium-ioner vises (det står ærligt i hjælpen). 5 opgaver.
  - **Hvad løber i ledningen?** Ledningen er halvgennemsigtig og fuld af elektroner, der flytter sig sammen som en kæde, når der løber strøm, og står stille ellers. Når en ion går, hopper en elektron ud i metalfolien, og når den lander, hopper en elektron ind og møder den. Ved pause er en afbryder slukket. Hjælpen forklarer, at elektronerne kryber langsommere end en snegl, mens skubbet når frem næsten med lysets fart.
  - Panelet viser strømmen i ampere (en celle på 1.000 mAh: 0,5, 1 eller 2 A). Laderen lader med konstant strøm, til klemspændingen når 4,2 V, og holder så spændingen, mens strømmen falder. Lader man hurtigt, sker skiftet tidligere.

- [x] **Trin 1d: Overskueligt værksted**
  - Opgaven står som en pille i toplinjen og kan foldes sammen (huskes).
  - Infopanelet har ingen scrollbar: et kompakt hoved (symbol, navn, gruppe), en statuslinje (isotop, ladning, stabilitet og knappen "Henfald") og tre faneblade: **Atom** (isotop, massetal, ladning, skaller), **Kerne** (stabilitet, stråling, seneste henfald og stabilitetskortet) og **Fakta** (fakta, gruppe, tilstand, placering, citat). Der er en blinkende prik på Kerne-fanen, når kernen er ustabil.
  - Efter et henfald skifter panelet til Kerne-fanen, og forklaringen bliver stående der. Beskeden øverst er kort.
  - Kraftigere henfaldslyd med geigerklik, brag og sus.
  - Hjælpen forklarer, hvad det betyder, at kernen "skyder en elektron ud", og hvor elektronen bliver af.

- [x] **Trin 6: Kosmos**
  - En ny del med animationer af vilde fænomener i rummet. Til venstre vælger man et fænomen og har knapperne "Prøv selv". Til højre står nøgletal, "Kort fortalt", "For nørder" (med en ærlig "Ærligt talt"-note om, hvad animationen snyder med) og et citat. En undertekst nederst i animationen fortæller, hvad der sker lige nu, med prikker for trinnene.
  - **Solstorm:** Solen (med kogende overflade) sender solvind ud. En solstorm (CME) trykker Jordens magnetfelt sammen, partiklerne glider uden om, og nogle bliver fanget i halen og laver grønne og røde nordlysgardiner ved polerne. Zoom ind på Jorden.
  - **Supernova:** Betelgeuse som rød kæmpe. "Vis lagene" skærer stjernen op (hydrogen, helium, carbon, oxygen, neon, silicium, jern). Jernkernen falder sammen, neutrinoer og en chokbølge, eksplosion, en tåge i lagenes farver og en neutronstjerne i midten.
  - **Pulsar:** en neutronstjerne med to stråler, der fejer forbi Jorden. En graf viser blinkene, som et radioteleskop måler dem. Man kan høre Vela- og Krabbe-pulsaren og den hurtigste kendte pulsar i deres rigtige tempo.
  - **Kilonova:** to neutronstjerner spiraler ind (tyngdebølger som ringe), støder sammen, gammaglimt og en sky, der går fra blå til rød, mens navnene på de nye grundstoffer (guld, platin, uran ...) dukker op.
  - **Rumtid:** gummidugen. Læg stjerner og sorte huller, skyd planeter ind, og send lys forbi.
  - **Tyngdebølger:** to sorte huller på dugen sender spiralbølger ud og smelter sammen. En detektor (som LIGO) ude ved kanten bliver strakt og presset, og grafen viser "chirpet", som også kan høres.
  - **Sort hul:** skygge, en gas-skive (lysest på den side, der kommer mod os), en bue af bøjet lys, en astronaut, der bliver strakt som spaghetti og ser ud til at gå i stå, og en stjerne, der bliver revet over.
  - **Kvasar:** en spiralgalakse med en blændende kerne og to jetstråler. Tænd og sluk, giv det sorte hul mad, og zoom ind i kernen.
  - **Ormehul:** universet tegnet som foldet papir med en tunnel. Kapløb mellem lyset (den lange vej) og et rumskib (genvejen). Det siges tydeligt, at ingen har set et ormehul.

- [x] **Trin 7: Telefon, tablet og et samlet UI-review**
  - Tablet på højkant: 3D-billedet øverst (næsten halvdelen af skærmen) og de to paneler side om side nedenunder.
  - Telefon på højkant: 3D-billedet øverst og panelerne under hinanden. Hele skærmen ruller, og 3D-billedet følger med. I Kosmos er fænomenerne en vandret række, så knapperne kommer lige under animationen.
  - Telefon på langs: tre smalle kolonner og en kompakt menu, hvor alle seks kort kan ses.
  - Menuen kan rulle på små skærme (før kunne man ikke nå de nederste kort på en telefon).
  - Paneler, der kan rulles, toner ud forneden, så man kan se, at der er mere.
  - "Start her" på Atomværkstedet, når man er helt ny. I Kosmos har fænomener, man ikke har set, en lille prik, og der står, hvor mange man har set.
  - To nye citater (Sagan og Feynman), så citaterne i Kosmos ikke bliver gentaget.

- [x] **Trin 8: Forbedringer efter det store review**
  - [x] **Hurtige rettelser:** Luk og ‹ › står øverst i grundstofkortet, kortet kan rulles, og telefonens tilbage-knap lukker det. I Stjerneovnen tæller opgaverne kun egne skud. "Genstart reaktoren". Dæmpede lysglimt i supernova og kilonova, og hensyn til "reducer bevægelse".
  - [x] **Nyt beskedsystem:** Undertekster nederst i 3D-billedet (én ad gangen, højst to linjer på telefoner og "Mere"). Belønninger som små piller i hjørnet, som man kan trykke på. Store advarsler (nødstop, kortslutning) kommer lidt efter hændelsen og bliver stående. En log (🔔), hvor man kan læse beskederne igen. Beskederne ryddes, når man skifter del. I Stjerneovnen står den valgte kerne med en lille etiket i stedet for en besked.
  - [x] **Det periodiske system på telefon:** Første tryk løfter det nærmeste felt og viser navnet, andet tryk åbner det. Træk med én finger for at flytte væggen, og knib for at zoome. Et søgefelt (navn, kaldenavn, symbol eller nummer). Filtrene er samlet bag én knap på telefoner. Et tip første gang.
  - [x] **Kom i gang-guide** i Stjerneovnen og Reaktoren: korte trin første gang med en lysende ring om det, man skal trykke på (kan ses igen fra hjælpen). Et kort med "Næste skridt" i 3D-billedet og knappen "Vis mig", som viser det næste skridt i slowmotion. I Stjerneovnen blinker de kerner, man kan smelte sammen med, og et tryk vælger den nærmeste kerne. I Reaktoren viser kortet effekten med et levende tip og en lille graf, og "Vis mig" viser en kædereaktion, hvor man kan tælle neutronerne i hver generation. Stavene starter ved 50 %, hvor reaktoren er tæt på stabil.
- [x] **Trin 9: Stjerneovnen lettere og med baggrund**
  - [x] **Lettere at ramme:** Musen vælger den nærmeste kerne (ligesom fingre), og en ring, et navn og en stiplet sigtelinje viser, hvad man peger på. Mens man sigter, går tiden langsomt. Pause med mellemrum eller knappen, og Esc fortryder.
  - [x] **Find kernerne:** Et klik i kernelisten eller i opskriften vælger en kerne af den slags. Opskriften har farveprikker som kuglerne i 3D.
  - [x] **Hvorfor så varmt?** En graf over protonernes fart og frastødningens "bakke", som flytter sig med temperaturen, med en ærlig note om tunneleffekten. 1 gram brint giver lige så meget energi som over 20 ton kul.
  - [x] **Rejsen ind i Solen:** Første gang flyver kameraet fra Solen udefra og ind i kernen med tre korte undertekster. Boksen "Solen i tal".
- [x] **Trin 10: Ting fra Stjerneovnen, der kan bruges andre steder**
  - [x] **Pause med mellemrum** i Stjerneovnen, Reaktoren og Kosmos (samme knap og samme tast alle steder). Under pausen kan man dreje kameraet og flytte kontrolstavene.
  - [x] **Sammenligninger med hverdagen:** 1 gram uran-235 svarer til ca. 3 ton kul. En stor reaktor bruger ca. 3 kg uran-235 om dagen, mens et kulkraftværk brænder ca. 10.000 ton kul. Batteriet: cellen, en mobil og et elbil-batteri, og hvor lidt energi et batteri gemmer pr. kilo.
  - [x] **Erfaringer** samles i [docs/erfaringer.md](docs/erfaringer.md).
- [ ] **Trin 11: Rettelser efter den store gennemgang** (se [docs/gennemgang-2026-10.md](docs/gennemgang-2026-10.md))
  - [x] **Faglige rettelser:** faktafejlene (A1), henfaldsreglerne (A2) og de vigtigste upræcise formuleringer (A3), med en ny test af henfaldsreglerne mod kendte kerner.
  - [x] **Fejlrettelser og små UI-rettelser:**
    - én fælles nulstilling ved skærmskift og timere, der ryddes
    - "Start forfra" i alle dele
    - Reaktorens panel og gløden på tablets
    - den fulde ovn
    - "Reducer bevægelse"
    - menuen på tablet, etiketten i Batteriet, zoom på væggen og ionen i 3 sekunder
    - stjernerne under pause
  - [x] **Jeres punkter efter afprøvning:** fagord forklaret (neutrino, alfapartikel, beryllium-8), batteriets ioner og elektroner, Reaktoren efter Kosmos, neutronkilden og "6-16", tempo og trin for trin i Stjerneovnen, pulsarens 716 blink og batteriets etiketter på pc.
  - [ ] **Sammenhæng:** fremgang pr. del i menuen og links mellem delene ("Se også").
  - [ ] **Fælles "Næste skridt"-modul**, og "Næste skridt", "Vis mig" og en guide i Batteriet og en kort guide i værkstedet.
  - [ ] **Tilgængelighed og app:** dialoger, tastatur, en app på hjemmeskærmen og mindre download.
- [x] **Trin 12: Ordforklaringer og fire nye fænomener i Kosmos**
  - [x] **Ordforklaringer:** 32 fagord (neutrino, positron, isotop, ion, MeV, plasma, halveringstid …) har prikker under første gang, de står i en tekst. Et tryk eller klik viser en kort forklaring, og med mus vises den også, når man holder musen over ordet. Virker i hjælpen, panelerne, Kosmos, grundstofkortet, underteksterne og loggen.
  - [x] **Big Bang:** fra en suppe af protoner og neutroner til 75 % hydrogen og 25 % helium efter ca. 20 minutter, de første atomer og de første stjerner. Man går frem trin for trin med "Næste".
  - [x] **Ny stjerne:** En sky af gas falder sammen. Skyderen vælger massen, og resultatet bliver en brun dværg, en rød dværg, en stjerne som Solen eller en kæmpestjerne.
  - [x] **Solens fremtid:** Solen bliver lysere, en rød kæmpe sluger Merkur og Venus, helium tænder, en planetarisk tåge og en hvid dværg.
  - [x] **Hvid dværg:** En hvid dværg suger gas fra en nabostjerne, når grænsen på ca. 1,4 sole og eksploderer (type Ia-supernova). En graf viser lyset, og panelet viser nikkel-56 → cobalt-56 → jern-56.
  - [x] Listen i Kosmos fortæller en historie: Big Bang først, så stjernernes liv og til sidst de mærkeligste ting.
- [x] **Trin 13: Årstiderne i Kosmos**
  - [x] Jorden på sin bane om Solen med den skrå akse (ca. 23,4°), der peger samme vej hele året. Kloden har land og hav, grænsen mellem dag og nat, ækvator, polarcirklerne og de fire steder.
  - [x] Trin for trin: forårsjævndøgn, sommer i nord, efterårsjævndøgn og vinter i nord, og bagefter vælger man selv datoen med en skyder.
  - [x] En lille tabel i 3D-billedet med dagens længde og Solens højde ved middag i Danmark, Australien, ved ækvator og i Grønland. Tallene regnes ud for de rigtige steder og passer med almanakkerne inden for få minutter.
  - [x] Fælden: Jorden er tættest på Solen i starten af januar. Nye ordforklaringer: jævndøgn, solhverv, polarcirkel, midnatssol og mørketid.
- [x] **Trin 14: Formørkelser i Kosmos**
  - [x] Sol, Jord og Måne med den samme Jord som Årstiderne (`js/kosmos/jorden.js`). Trin for trin: Månen kredser, hvorfor det ikke sker hver måned (banen hælder), total solformørkelse, ringformørkelse og måneformørkelse, og bagefter "Prøv selv" med skydere for Månens fase, tid på året og Månens afstand og knappen "Uden hældning".
  - [x] Skyggerne er regnet: Månens skygge på Jorden (kerneskygge og halvskygge) og Jordens skygge på Månen, som bliver kobberrød. Solens og Månens størrelse på himlen passer i forhold til hinanden, så det bliver total, når Månen er tæt på, og en ring, når den er langt væk.
  - [x] "Solen set fra Jorden" og "Månen set fra Jorden" i et lille rundt kort i 3D-billedet (med koronaen ved total solformørkelse). Sikkerhed: Kig aldrig direkte på Solen. Nye ordforklaringer: baneplan, korona, kerneskygge og halvskygge.
- [x] **Trin 15: Forbedringer af Årstiderne og Formørkelser efter review**
  - [x] Korte undertekster med pointen først (under ca. 160 tegn), så den ikke bliver skåret af på tablet og telefon.
  - [x] Årstiderne: stråler med "Lys fra Solen" i nærbillederne. Trinnet om sommer siger, hvorfor høj sol varmer, og trinnet om vinter, at det ikke er afstanden. Navnene på Jorden står ikke oven i hinanden og skjules på bagsiden. Tabellen viser årstiden, og Jorden kører rundt om Solen i første trin.
  - [x] Formørkelser: Solformørkelsen kommer nu før "Hvorfor ikke hver måned?". Et skilt "Månens skygge" og en ring om kerneskyggen i nærbilledet, "nymåne" og "fuldmåne" på banen. Himmelkortet viser Månen ude ved kanten, når den går over eller under Solen, og Jordens skygge på Månen ved en delvis måneformørkelse. Skyderen "Tid på året" siger, når det er en formørkelsesperiode. Nyt afsnit under "For nørder": Hvorfor rød?
- [x] **Trin 16: Kvasarens stråler, flere citater og kategorierne i Det periodiske system**
  - [x] Kvasaren: "Hvorfor stråler?" (magnetfeltet bliver vredet op som en proptrækker, og plasma bliver slynget ud) med en ærlig note om, hvad man ikke ved. Knappen "🧲 Vis magnetfeltet" viser de snoede feltlinjer tæt på.
  - [x] Citater: Hvert fænomen i Kosmos har sit eget citat. Nye: Carrington (solstorm), Tycho Brahe (supernova), Jocelyn Bell Burnell (pulsar), David Reitze (tyngdebølger), Einstein (kvasar), Haldane (ormehul) og Meitner og Frisch (Reaktorens hjælp). Alle er faktatjekket. Paynes citat blev droppet, fordi ordlyden ikke kunne bekræftes.
  - [x] Kategorierne: Vælger man en kategori i filtrene, kommer et kort med hvad de har til fælles, et lille atom, der viser hvorfor (de yderste elektroner), et animeret signaturforsøg (fx alkalimetal i vand, salt af natrium og chlor, lys i ædelgasrør), en tendens, kendte medlemmer og links til resten af AtomLab. Væggen laver en bølge, og kategoriens felter glider frem.
- [x] **Trin 17: Flot Jord og Måne med rigtige billeder fra NASA** (trin 1a i [planen for Solsystemet](docs/plan-solsystemet.md))
  - [x] Jorden: Blue Marble for januar, april, juli og oktober, der glider over i hinanden efter datoen (sne om vinteren), byernes lys om natten (Black Marble), skyer med skygge, bjerge, der får skygger i lav sol, og Solens glimt i havet.
  - [x] Luften: et blåt skær mod kanten, rødligt lys i tusmørket og en tynd atmosfære, der lyser kraftigt i modlys.
  - [x] Månen: kort og højder fra Lunar Reconnaissance Orbiter. Fuldmånen er næsten lige lys over hele skiven, som den rigtige.
  - [x] 4k på pc og 2k på tablet og telefon. Kilder og licenser i `billeder/solsystem/KILDER.md`, og en ærlig note under "For nørder" om, hvad der er gjort større.

- [ ] **Trin 18: Forbedringer efter F1** (se [F1-overblik.md](docs/fable/F1-overblik.md) og "Lige nu" øverst)
  - [x] **Det sorte hul er sort:** Skyggen er ca. 2,6 gange bredere end horisonten, som i virkeligheden (for et sort hul, der ikke drejer), og gløden bliver holdt ude af den. Horisonten står som en stiplet ring inde i skyggen. Astronauten starter på vores side af hullet, så man ser den blive strakt.
  - [x] **"For nørder" står øverst igen** i Kosmos på tablet og telefon på højkant (CSS-reglen gælder nu kun Reaktoren).
  - [x] **UI-planen for lagene** ([docs/plan-lag.md](docs/plan-lag.md)) og byggeklodserne (`js/lag.js`: foldebokse, "Hvorfor?"-kort og "Næste skridt"). Stjerneovnen og Reaktoren har fået lagene. Værkstedet og Kosmos har fået "Hvorfor?"-kort, og Kosmos har "Mere" under "Kort fortalt". Tippene om at holde knapperne inde og om tasterne i Værkstedet flyttes til hjælpen, når Værkstedet får sin korte guide.
  - [x] **Vis eller skjul panelerne og "Kun grafik"** (`js/paneler.js`), også med G og Esc. Huskes for hver skærm.
  - [x] **"Hvorfor?"-kort:** 20 kort med "Og hvorfor det?", faktatjekket af to hjælpeagenter (`docs/fakta-hvorfor.md`).
  - [x] **Et grafisk løft af atomet:** B (former) er standard fra 24. oktober 2026: Elektronskyen viser de yderste orbitaler som glødende former regnet som i hydrogen, kernen har skygge, og der er en glidende overgang mellem ringe og sky. Det gælder også atomet i Det periodiske system og i menuen. `?udgaver` kan stadig vise de andre udgaver til sammenligning.
  - [x] **Batteriet: grafik, start og navn** (23. oktober 2026):
    - Grafitten er lag af carbonatomer i sekskanter, og metaloxidet er en krystal med kobolt mellem to lag oxygen. Kameraet ser lidt fra siden og oppefra.
    - Guiden kommer første gang, "Næste skridt" følger opgaverne, og "Vis mig" lader op i slowmotion, til to ioner er nået frem.
    - Navnet er nu "lithium-ion-batteri", og hjælpen forklarer "LiPo eller Li-ion?" (faktatjekket: LiPo er en slags Li-ion i en blød pose, og "polymer" er i dag tit en gel).
    - Forklaringerne er foldebokse, opgaverne står som én linje, farverne står i et lille felt i 3D-billedet, og varmemåleren har et "Hvorfor?"-kort.
  - [x] **Grundstofkortet i lag og fremgang i menuen** (23. oktober 2026):
    - 41 grundstoffer (de første 30 og Ag, Sn, I, W, Pt, Au, Hg, Pb, Rn, U og Pu) har tre linjer fremme: "I din hverdag", "I din krop" og "I universet". Under "Mere" står eksempler, et "Vidste du?", links til resten af AtomLab og tallene. Teksterne står i `js/data/grundstoflag.js`, og kilderne og forbeholdene i `docs/fakta-grundstofkort.md`.
    - Tre nye fagord: r-processen, s-processen og kosmisk stråling.
    - Menuen viser fremgangen på hvert kort ("3/7 ★", "2/118 opdaget" og "2/15 set"). Når en del er klaret, står der "Næste eventyr" på den næste del i rækkefølgen.
    - Senere: fotos af grundstofferne (Wikimedia kan nu hentes, men svarede "for mange forespørgsler" den 23. oktober) og tekster til flere grundstoffer.
  - [x] **Copyright:** "© 2026 Espen O'Halloran. Alle rettigheder forbeholdes" i README, i hjælpen ("Om AtomLab" med kilder og licenser) og i en licensfil (`LICENSE`), og at man gerne må bruge AtomLab i undervisningen og dele linket.

- [x] **Trin 19: Saturn med måner og flyby, en sort himmel og små ønsker** (24. oktober 2026, PR #10-#14)
  - [x] Saturn-prototypen med rigtige billeder: Saturns kort og ringenes farver (Solar System Scope, CC BY 4.0) og Cassinis kort over alle seks store måner (via USGS, Mimas lavet af DLR).
  - [x] Saturn, ringene og månerne i den rigtige størrelse og afstand. Kameraets rejse (`js/solsystem/rejse.js`) skalerer systemet, så man kan flyve fra hele systemet ind til en lille måne. Et tryk på en måne besøger den.
  - [x] Flybyen med ni stop, en undertekst med prikker og "Næste". Teksterne er faktatjekket.
  - [x] Sort himmel i vores eget solsystem og Solen som en lille prik ved Saturn.
  - [x] Saturn står i den almindelige liste i Kosmos efter Solstorm (før kun med `?saturn` i adressen).
  - [x] Piletasterne drejer kameraet i Kosmos.
  - [x] "Start forfra" i Værkstedet, Stjerneovnen, Reaktoren og Batteriet.
  - [x] Atomet: B (orbitalernes former) er standard.
  - [x] Knappen "Elektronsky"/"Ringe" på grundstofkortet i Det periodiske system, og valget deles med Værkstedet.

## Idéer til senere
- **Kategorien som link** (jeres ønske, 24. oktober 2026): I Atomværkstedet og Det periodiske system skal kategorien under navnet (fx "Overgangsmetal") kunne trykkes på og vise, hvad kategorien er. **Anbefaling:** et "Hvorfor?"-kort, der popper op ved ordet. Det bruger teksterne fra kategorikortet (`js/data/kategorier.js`: hvad de har til fælles, og hvorfor), så man bliver, hvor man er. Nederst står "Se hele kategorien ›", som åbner kategorikortet i Det periodiske system med forsøget og medlemmerne. Det følger planen for lagene (ét tryk for mere, uden at forlade skærmen), og teksterne findes allerede. Lille opgave. Venter på et go.
- **Ny del: Ordbogen** (jeres idé, 24. oktober 2026): Alle begreber, der er spredt rundt i AtomLab, samlet ét sted, så de er lette at slå op. Fx gammastråling: Den står allerede i ordbogen (`js/data/ordbog.js`, 44 fagord), men man kan kun se forklaringen ved at trykke på det prikkede ord i en tekst. **Forslag:** en side med alle fagord i alfabetisk rækkefølge og en søgning, og med "Hvorfor?"-kortene og kategorierne. Fra hvert ord kan man gå derhen, hvor det bruges. Den kan åbnes fra menuen og fra hjælpen. Lille til mellem. Venter på et go.
- **Fotoner i Stjerneovnen?** (jeres spørgsmål, 24. oktober 2026): I dag står der kun "gammastråling (meget kraftigt lys)". **Forslag:** "foton" (en lyspartikel) som nyt fagord, og én sætning i Stjerneovnens forklaring om, at energien kommer ud som fotoner af gammastråling, og at de bruger meget lang tid på at kæmpe sig ud af Solen. Det står allerede i "Lys og neutrinoer", men uden ordet foton. Lille, men skal faktatjekkes. Venter på et go.
- "Test dig selv": 3-5 små spørgsmål til sidst i hver del, så man husker det, man har set.
- En engelsk udgave med en sprogvælger. Planen ligger i [docs/plan-engelsk.md](docs/plan-engelsk.md).
- En chat, hvor man kan stille spørgsmål (skal diskuteres: hvor den kører, hvem der betaler, og hvordan den holdes til emnet).
- Tidslinje over, hvornår grundstofferne blev opdaget.
- **Molekyler i Atomværkstedet** (jeres ønske, 21. oktober 2026): se, hvordan atomer giver og tager elektroner, og byg molekyler, fx vand.
  - **Give og tage elektroner (ionbinding):** Man ser en elektron hoppe fra et atom til et andet, fx fra natrium til chlor. Så bliver de til Na⁺ og Cl⁻, som trækker i hinanden (køkkensalt). Det bygger videre på opgaverne Na⁺ og Cl⁻ og på "Hvad er en ion?" i hjælpen.
  - **Dele elektroner (molekyler):** Man sætter atomer sammen, fx H₂, O₂, H₂O og CO₂. I vand giver atomerne ikke elektroner væk. De deler dem i par. Oxygen trækker mest i de delte elektroner, så oxygen-enden bliver lidt minus og hydrogen-enderne lidt plus. Vandmolekylet er bøjet (ca. 104,5°).
  - Navn: Delen, hvor atomerne giver og tager elektroner, kan hedde noget i stil med **Byttebørsen** (jeres forslag).
  - **Se, hvordan vand bliver til:** Besluttet: først den kemiske reaktion, fx 2 H₂ + O₂ → 2 H₂O. Molekylerne går i stykker, atomerne sætter sig sammen på en ny måde, og der bliver frigjort energi (knaldgas, som i en raketmotor).
  - **Hvor og hvordan blev Jordens vand dannet?** (jeres ønske). Det ved man ikke helt, og det skal siges ærligt. Foreløbig, og ikke faktatjekket: Meget af vandet blev nok dannet ude i rummet, før Solen fandtes. Det skete i kolde skyer af gas og støv, hvor hydrogen og oxygen mødes på små iskolde støvkorn. Vandet kom til Jorden med de sten, Jorden blev bygget af, med asteroider og nok kun lidt med kometer. Det blev ikke dannet som knaldgas, for ude i rummet er der næsten ingen O₂. Skal faktatjekkes grundigt (fx forholdet mellem tungt og almindeligt hydrogen og prøverne fra asteroiderne Ryugu og Bennu).
  - Besluttet: både frit byggeri og trin for trin med opgaver.
  - Ærligt (se fælden i docs/erfaringer.md): "Atomer vil gerne have en fuld skal" er en forenkling. Hvis natrium giver sin elektron til chlor, og de to atomer er langt fra hinanden, koster det energi. Gevinsten kommer først, når plus og minus trækker i hinanden. Teksterne om salt i hjælpen og i kategorikortet skal tjekkes samtidig.
  - Plads: Infopanelet må ikke få en rullebjælke. Derfor skal molekylerne nok være en ny del i værkstedet med knapper øverst, som "Spalt én kerne" og "Kædereaktion" i Reaktoren.
- **Tjernobyl i Reaktoren** (foreslået af jer): forstå, hvad der skete i 1986, trin for trin. Kræver en anden slags reaktor i spillet: I Tjernobyl bremsede grafit neutronerne, og vandet slugte dem mest, så damp gav flere spaltninger. I spillets reaktor er det omvendt. Se fælden om Tjernobyl i docs/erfaringer.md. En alvorlig ulykke med døde. Besluttet: Den skal behandles med respekt, og formålet er oplysning og læring (forstå, hvad der skete, og hvorfor), ikke at "vinde".
- **Ny del: Solsystemet med Rumrejsen** (jeres ønske): Udforsk planeterne og månerne (især Europa, Enceladus og Titan, hvor der måske er betingelser for liv), og Voyager-spillet, hvor man bruger planeternes tyngdekraft. Foreløbig plan i [docs/plan-solsystemet.md](docs/plan-solsystemet.md). Fable skal gennemgå den, før vi går i gang.
- **Vis eller skjul panelerne** (jeres ønske, især til Årstiderne og Formørkelser), så man bedre kan nyde grafikken. Forslag (venter):
  - Hvert sidepanel kan foldes væk med en fane på kanten (‹ og ›), og 3D-billedet glider ud og fylder pladsen (`centrerVindue`). Fx kan teksten til højre foldes væk, mens "Næste" og datoen bliver til venstre.
  - Knappen "Kun grafik" i toplinjen (ved siden af fuld skærm) og tasten G folder begge væk. Esc eller knappen igen henter dem tilbage.
  - Tilbage bliver underteksterne, pause (mellemrum), tabellen og himmelkortet i 3D-billedet og en lille "Næste ›" i underteksten i fænomener, der går trin for trin.
  - Valget huskes for hver skærm, men første gang er panelerne fremme. På tablet og telefon på højkant viser "Kun grafik" 3D-billedet på hele skærmen.
  - Gælder de fem skærme med panel, 3D og panel (Værkstedet, Stjerneovnen, Reaktoren, Batteriet og Kosmos). Det periodiske system har sit eget layout og kommer ikke med i første omgang.
  - Mellemstor opgave. Risikoen er layoutet på de mange skærmstørrelser, så det skal testes på pc, tablet og telefon begge veje. Besluttet: begge dele (foldbare paneler og "Kun grafik"). Venter på et go.
- **Tre nye idéer fra F1** (ikke besluttet, se afsnit 4 i [F1-overblik.md](docs/fable/F1-overblik.md)):
  - **Zoom ind fra hverdagen:** korte rejser fra noget kendt (blyant → grafit → carbonatomet).
  - **Grundstofsamlingen:** samlekort, der vender, når man opdager et grundstof.
  - **Grundstoffernes rejse:** en historie på tværs af delene, fra Big Bang til lithium i mobilen.
- [x] **Skills til udviklingen** (lavet i oktober 2026): `/faerdig` (tests, skærmbilleder, dokumentation, commit og push) og `/faktatjek` (påstande, kilder og fælderne) i `.claude/skills/`. De peger på tjeklisterne i `docs/erfaringer.md` og kopierer dem ikke.
- **Rækkefølge** (aftalt): Årstiderne (Trin 13) og formørkelserne (Trin 14) er lavet. Så Tjernobyl og til sidst Liv. **Besluttet 23. oktober 2026: Tjernobyl og Liv venter, til Fable 5.5 kommer**, for dér koster en fejl mest. Vil I i gang før, kan Opus lave dem med ekstra grundigt faktatjek.
- **Ny del: Liv** (foreslået af jer): et laboratorium, hvor man blander livets ingredienser og ser, hvor langt man kan komme (fx Miller-Urey-forsøget, byggesten, hinder, RNA). Vigtigt at sige ærligt, at ingen endnu har lavet liv fra bunden, og at det er uvist, hvordan det opstod. Med de nyeste fund på Mars (Perseverance, "leopardpletterne" i klippen Cheyava Falls). Besluttet: Forklar, hvad der er fundet, hvorfor det er så interessant, og hvorfor det er det bedste spor af liv på andre planeter indtil nu, men også ærligt, at det ikke er bevist. Teksten skal faktatjekkes grundigt. Molekyle-idéen ovenfor kan være første skridt.

## Før vi deler AtomLab med andre (tjekliste)
AtomLab ligger allerede på GitHub Pages. Før vi deler det bredere:
- [ ] **Fagligt tjek:** En fysik/kemi-lærer eller en anden fagperson gennemgår indholdet.
- [ ] **Afprøvning:** 3-5 børn og en lærer prøver det. Vi skriver ned, hvor de går i stå, og retter det.
- [ ] **Skolernes enheder:** afprøvet på ældre iPads og Chromebooks (hastighed og glød).
- [ ] **"Om AtomLab"-side:** hvem der har lavet det og hvorfor, at der ikke indsamles data (kun det, der gemmes i ens egen browser), hvordan man melder fejl, og at det er lavet med hjælp fra AI.
- [ ] **Licens og kilder:** vælg en licens, og tjek, at citater og kilder er i orden. **Lavet 23. oktober 2026:** "Alle rettigheder forbeholdes" i README, hjælpen og `LICENSE`, med kilder og licenser i hjælpen. Tilbage: et sidste tjek af citater og kilder, før det deles bredt. Drøftet i oktober 2026:
  - En linje med "© 2026 [navn]" i README og i hjælpen og en licensfil. Ophavsret opstår af sig selv i Danmark og EU, men linjen viser tydeligt, hvem der ejer det.
  - Vælg enten "Alle rettigheder forbeholdes" eller en åben licens, fx CC BY-NC (andre må dele med kildeangivelse, men ikke tjene penge på det). Den sidste passer godt, hvis lærere skal kunne bruge det.
  - Et afsnit "Kilder og licenser" i hjælpen: Three.js (MIT), landkortet fra global-land-mask (MIT), citaterne og de kommende billeder fra NASA m.fl.
  - Ærligt om AI: Meget af koden er skrevet med AI, og i nogle lande er det juridisk uafklaret, hvor meget ophavsret der er på den. Idéerne, valgene og teksterne er tydeligt jeres. (Ikke juridisk rådgivning.)
  - Navnet er Espen O'Halloran. Mit forslag (venter på et ja): "© 2026 Espen O'Halloran. Alle rettigheder forbeholdes" i README og hjælpen og en licensfil, plus en linje om, at man gerne må bruge AtomLab i undervisningen og dele linket. Man kan altid åbne mere op senere, men en åben licens kan ikke trækkes tilbage. Three.js, landkortet og NASA's billeder bevarer deres egne licenser.
- [ ] **Til lærere:** en kort lærervejledning, en kobling til fagets mål i 7.-9. klasse og nogle opgaver.
- [ ] **Del i det små først:** først med en lærer og en klasse, derefter i faglige netværk for fysik/kemi-lærere.
