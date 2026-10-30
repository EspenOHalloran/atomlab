# AtomLab: indhold og plan

AtomLab skal lære en 13-årig om protoner, neutroner og elektroner, om grundstofferne og om kernereaktioner (fusion og fission). Det er et **laboratorium med opgaver**: man kan eksperimentere frit, men der er også opgaver, som giver stjerner og låser ting op. Alt er i 3D med glød og partikler.

## Lige nu (status til næste session)
*Opdateres, hver gang et stykke arbejde slutter (se `/faerdig`). Læs det først i en ny session. Sidst opdateret: 30. oktober 2026 (Mars M6b: flybyen ud til Phobos og Deimos. M6 er færdig).*

**Sådan arbejder vi (jeres svar):**
- Få et "go", før et større stykke arbejde går i gang, og spørg, når noget er uklart. I vil have ærlige svar, ikke at blive talt efter munden.
- Én PR for hvert færdigt punkt. Opus merger den selv til `main`, når hele testsamlingen er grøn, så det kommer på GitHub Pages med det samme (https://espenohalloran.github.io/atomlab/). Bagefter startes arbejdsgrenen forfra fra `main`.
- Beslutninger og jeres svar skrives ind her med det samme, ikke kun i chatten.
- Det er kun jer, der bruger AtomLab indtil videre. Prototyper må derfor gerne ligge i den almindelige udgave (24. oktober 2026).
- Tabletten bruges lige meget på langs og på højkant. Lyd: ingen baggrundsmusik, de små lyde bliver.
- **Tests (jeres svar 24. oktober 2026):** Test, når det giver mening i forhold til prisen. I tester selv på den rigtige tablet. Derfor:
  - Mens der arbejdes: kun `node tests/koer-alle.mjs --ændret`. Før merge køres `node tests/koer-alle.mjs --ændret`. Vælger den selv alle tests (fordi fx `index.html`, `style.css`, `main.js` eller `scene3d.js` er ændret), køres alle. Hele samlingen køres kun eksplicit, når en ændring rører fælles moduler eller data, og `--ændret` ser ud til at vælge for lidt, som afslutning på en serie af opgaver og før et større mål (fx at dele AtomLab med andre). Jeres ønske 29. oktober 2026: ikke vente på tests af ting, der næsten sikkert ikke er rørt. `main` er det, jeres søn bruger. Den koster få tokens, når den er grøn (én linje pr. test).
  - Skærmbilleder koster flest tokens. Tag kun billeder af det, der er ændret, og se kun de størrelser, hvor layoutet kan gå galt (fx pc og tablet på højkant).
  - Hvordan det føles med fingre, om det kører glat, og hvordan det ser ud på den rigtige skærm, tester I selv. Skriv i "Ikke afprøvet", hvad I skal kigge efter.
  - Nye tests tjekker logik og tal (fx retninger, pladser og tekster), ikke hvert billede.

**Jeres mål for Solsystemet** (jeres ord): Man skal få oplevelsen af at besøge planeterne, også deres måner. Flybyen ved Saturn er første skridt og skal senere bruges ved alle planeter.

**Mars (besluttet 24. oktober 2026):** Mars bygges som Saturn med Phobos og Deimos og en flyby, der også besøger steder på planeten (Olympus Mons, Tharsis, Valles Marineris, Hellas, nordpolen, Gale og Jezero). Jeres svar: Saturn og flybyen kører helt flydende på tabletten, så vi giver den gas med grafikken. "Det hele skal med. Det skal være så flot og imponerende som muligt": detaljer helt tæt på, "Stå på Mars" og månerne i den rigtige form. Opgaven er delt i otte delopgaver (M1-M8), og I siger go mellem hver. Planen står i [docs/plan-mars.md](docs/plan-mars.md). I M4 flyttes Mars og Saturn til deres egen skærm, "Solsystemet". Overblikket med Solen og planeterne (trin 2) venter. Mars får et 8k-kort.
- **Tokens bruges med omhu (jeres svar 24. oktober 2026):** Sig det med det samme, når noget koster unødigt mange tokens (fx sider, miljøet ikke kan åbne, eller en hjælpeagent, der må søge mange gange). Ofte kan I let løse det, fx ved at tilføje et domæne under miljøets Network access.
- **Spørg om adgang først (jeres svar 29. oktober 2026):** Skal en opgave bruge et domæne, der ikke står på listen over åbne domæner, så spørg om adgang, *før* arbejdet går i gang, ikke først når siden viser sig at være blokeret. I åbnede library.si.edu og archive.org til citatet til Saturn.
- **Blokeret adgang (jeres svar 24. oktober 2026):** Er en netside eller et værktøj blokeret i miljøet, så sæt udviklingen på pause, og bed jer om adgang (navngiv domænet). Gå ikke videre med en nødløsning uden at spørge først.
- **Værktøjer (jeres svar 24. oktober 2026):** Billedværktøjerne må bruge Python-pakker (fx `rasterio`). Bed altid om værktøjer (eller adgang til netsider), når noget kan gøre arbejdet hurtigere, billigere eller bedre.

**Mars M5 er færdig (30. oktober 2026).** Næste kan være M6 (Phobos og Deimos), M7b (meget skarpe kort ved Gale og Jezero) eller M8 (Stå på Mars). Det venter på jeres valg og go. Planen står i [docs/plan-mars.md](docs/plan-mars.md).
- ~~**Knappen "Navne"**~~ ✅ Lavet 30. oktober 2026 (se nedenfor).
- **M6 (Phobos og Deimos): Planen er klar og venter på jeres go** ([docs/plan-mars.md](docs/plan-mars.md) under "Plan for M6", syv beslutninger til jer til sidst, billederne i `docs/m6/`). Formen er afgjort: Phobos' højdekort vender rigtigt, og Deimos' formmodel har vestlig længde (ellers ville Deimos blive spejlvendt). Anbefalingen er to dele: M6a (formen, kortene og banerne) og M6b (flybyen og teksterne). **Jeres svar (30. oktober 2026): "Go herfra. Vi følger dine anbefalinger."** Alle syv anbefalinger gælder. M6a bygges nu, og M6b venter på et go efter M6a (anbefaling 7). **Jeres svar (30. oktober 2026):** JAXA var blokeret. Lav planen nu, og I åbner `*.jaxa.jp`. Samme dag virkede www.mmx.jaxa.jp, global.jaxa.jp og www.jaxa.jp (isas.jaxa.jp svarede 502 fra siden selv).

**Senest lavet (30. oktober 2026): Mars M6b, flybyen ud til Phobos og Deimos. M6 er færdig.** Næste kan være M7b (meget skarpe kort ved Gale og Jezero) eller M8 (Stå på Mars). Det venter på jeres valg og go.
- **Flybyen har nu 13 stop:** Efter Nordpolen går turen ud til **Phobos** (Stickney ude ved kanten i lav sol, Mars i baggrunden), **"Mars set fra Phobos"** (kameraet står 300 m over Phobos og kigger op: Mars er 42,5° bred og drejer, og man kan dreje hovedet og kigge ned på Phobos) og **Deimos** (Mars er en kugle på 16,6° ved siden af).
- **Ærligt om billedet ved Phobos:** Stickney i fuld sol og Mars i baggrunden kan ikke ses på samme tid. Stickney ligger på den side, der vender halvt mod Mars, og når Solen lyser Stickney op, er den side af Mars, man ser bag Phobos, i mørke. Valget blev: Solen fra siden og lidt bagfra, så Mars bag Phobos er lyst op, og Stickney ligger ude ved kanten i lav sol. Kameraet kigger lidt ved siden af Phobos mod Mars, så begge kan ses.
- **Jeres fejl (30. oktober 2026):** "Månerne" og et tryk på Phobos viste ingenting. Årsagen var, at Phobos stod i Mars' skygge: Så var både Phobos og den side af Mars, man ser bag den, helt sorte. Nu glider månen frem i banen og ud af skyggen, mens kameraet flyver derhen, og teksten siger det ærligt ("Ud af skyggen"). Testen `mars` tjekker det.
- **Flimmer:** Kameraets near er 0,005 som ved resten af Mars. Systemet er skaleret ca. 59 gange, så det svarer til ca. 85 m. Et billede med 10 gange bedre dybdeopløsning var ens med billedet i programmet (målt). Derfor står kameraet 300 m over Phobos, ikke 2-3 km.
- **Faktatjekket** (to hjælpeagenter, NASA, JAXA, ESA, JPL og Wikipedia læst direkte). Rettet bl.a.:
  - Stickney er ca. 9 km på en måne, der er ca. 26 km lang, ikke "halvdelen af Phobos".
  - Phobos er i Mars' skygge på næsten hver omgang (ikke omkring solhverv), Deimos kun omkring jævndøgn.
  - Hall brugte verdens største *linsekikkert*.
  - Deimos' kratere er kun *delvist* fyldt op.
  - MMX' status er slået op hos JAXA i dag: sonden var sund og på vej mod Mars sidst i oktober 2026.
  - Nye fagord: bundet rotation, regolit og tidevandskraft.
  - Kilderne står i `docs/fakta-solsystemet.md` under "Faktatjek M6b".
- **Billeder i sekundet** (testbrowseren, fuld grafik, én ad gangen): pc: hele Mars 1,1, Phobos 1,1, Mars set fra Phobos 1,0 og Deimos 1,1. Tablet på højkant: 2,3, 1,5, 2,3 og 1,4. Maskinen var langsommere end i tidligere sessioner, så tallene kan kun sammenlignes indbyrdes.
- **Ikke afprøvet (på tabletten):**
  1. Ser I Mars i baggrunden ved Phobos, både på langs og på højkant? (På højkant står Phobos tæt på underteksten.)
  2. Flimrer luften eller skyerne på Mars ved "Mars set fra Phobos", når Mars drejer, eller når I drejer hovedet?
  3. Føles det naturligt at dreje rundt ved "Mars set fra Phobos" (man drejer om et punkt lige foran kameraet), og kan I kigge ned og se Phobos' overflade?
  4. Føles flyvningen rundt om Phobos (til og fra overfladen) for hurtig eller for lav?
  5. "Månerne" → tryk på Phobos, når den står bag Mars: Ser I den glide ud af skyggen?
  6. Er teksterne ved de tre stop for lange?

**Før det (30. oktober 2026): Mars M6a, Phobos og Deimos i den rigtige form.**
- **Månerne kredser om Mars** i den rigtige afstand og i det rigtige forhold til Mars' døgn: Phobos runder Mars ca. 3,2 gange, mens Mars drejer én gang (ca. 32 sekunder i programmet), så den står op i vest. Deimos er ca. 2 minutter om en omgang. Begge vender samme side mod Mars, og de bliver mørke i Mars' skygge.
- **Knappen "Månerne"** viser begge baner med navnene. Et tryk på en måne flyver derhen (også når navnene er slået fra). Langt væk er månerne tegnet større, og det står i "Ærligt talt".
- **Formen:** Phobos af USGS' højdekort fra Mars Express, Deimos af Thomas' formmodel (vendt fra vestlig til østlig længde). Set fra samme side som HiRISE-fotoene passer silhuetterne (overlap 0,92 og 0,93), og ved Phobos sidder kraterparret forneden samme sted (`docs/m6/programmet-mod-fotos.jpg`).
- **Rettet i kilderne:** Phobos' højdekort har kopierede søjler ved 180°, og mosaikken har et hul dér. Det så ud som en streg fra pol til pol og er rettet i billedværktøjet (`lav_maaner.py`).
- **Kilder og licenser** står i `KILDER.md`, `LICENSE` og "Om AtomLab" (Phobos CC BY-SA 3.0 IGO).
- **Billeder i sekundet:** ingen målbar forskel ved hele Mars med og uden månerne (testbrowseren).
- **Ikke afprøvet (på tabletten):** 1) Kan man ramme månerne med fingeren i "Månerne"? 2) Er Phobos og Deimos for lyse eller for mørke ved siden af Mars? 3) Kan I se en kant ved 180° på Phobos (bagsiden, væk fra Mars)? 4) Ved Deimos' nordpol er en lys kam med en mørk skråning under. Ser det mærkeligt ud? 5) Hakker det, når Phobos' kort (ca. 1 MB) hentes, kort efter Mars er åbnet?

**Før det (30. oktober 2026): Knappen "Navne" ved Mars og Saturn (del 1 af opgaven med navneknappen og M6).**
- Under "Prøv selv" ved Mars og Saturn står en til/fra-knap **"Navne"**, slået til fra start. Slået fra forsvinder navnene og prikkerne på Mars (og et tryk på kloden flyver ingen steder hen) og månernes navne ved Saturn (man kan stadig trykke på selve månerne).
- Valget er fælles for alle planeterne og huskes (`atomlabNavne`). Det er en lille fælles hjælper (`js/solsystem/navne.js`), som Phobos og Deimos og de kommende planeter også skal bruge.
- Testene `mars` og `saturn` tjekker, at navnene forsvinder, at et tryk på kloden ikke flyver nogen steder hen, og at valget huskes efter genindlæsning.
- **Ikke afprøvet (på tabletten):** Er knappen let at finde blandt de andre? Ser Mars pænere ud at se dreje uden navne?

**Senest lavet (30. oktober 2026): Mars M5b (Gale, Jezero, Nordpolen og navnene på kloden).**
- **Flybyen har nu 10 stop.** **Gale og Curiosity:** krateret og Mount Sharp set fra nord. **Jezero og Perseverance:** krateret, der engang var en sø, i lav morgensol (ellers kunne det næsten ikke ses). **Nordpolen:** iskappen med spiralkløfterne set fra højt oppe.
- **Navnene på kloden:** Når man ser hele Mars, står Olympus Mons, Tharsis, Valles Marineris, Hellas, Gale, Jezero og Nordpolen på kloden. Et tryk på et navn flyver direkte derhen. Navnene skjules på bagsiden og tæt på.
- **Sommer ved polen:** På vejen til nordpolen drejer programmet Mars' akse til midt på sommeren i nord, så Solen står 22-28° oppe hele døgnet (midnatssol). Det står ærligt i teksten og i "Ærligt talt". Tryk "Drej Mars" ved polen, så går lyset rundt, uden at det bliver nat.
- **Skarpe kort ved Gale og Jezero:** HRSC+MOLA var tydeligt skarpere end MOLA (billederne i chatten). Kortene er lige så skarpe som kilden (ca. 0,17 km pr. pixel), så et detaljekort ville ikke give mere. Roverne og deltaet (kun ca. 40 m højt) kan ikke ses: Det kommer med M7b.
- **Faktatjekket** (to hjælpeagenter, kilderne læst: NASA, USGS, UT Austin, ASU og MSSS). Rovernes status er slået op i dag: Curiosity har kørt ca. 38 km og er 1 km oppe ad Mount Sharp. Perseverance har kørt over 45 km (rekord), er uden for krateret og har fyldt 30 rør. NASA skriver om Mars Sample Return i datid. Rettet bl.a.: Gales alder, Ingenuitys sidste flyvning, de organiske stoffer (ikke afgjort, ny NASA-undersøgelse fra februar 2026), kappens tykkelse og "en fjerdedel af luften" (mest ved sydpolen). Nye fagord: rover, delta og biospor. Kilderne: `docs/fakta-solsystemet.md` under "Faktatjek M5b".
- **Billeder i sekundet** i testbrowseren: De nye stop koster ikke mere end Olympus Mons og Valles Marineris (tal i `docs/plan-mars.md` under "Status efter M5b").
- **Ikke afprøvet (på tabletten):** 1) Kan man ramme navnene på kloden med fingeren, og er de store nok på højkant? 2) Ser man Mount Sharp tydeligt ved Gale, og Jezero-krateret i den lave morgensol? 3) Føles flyvningen til nordpolen og drejningen af aksen naturlig (Mars vipper under flyvningen)? 4) Hakker det, når kortene til Gale og Jezero hentes ved stoppet før? 5) Kan man se kanten af nettene ved Gale og Jezero? 6) Hvor længe er "Start flyby" grå, og er hakket ved Saturn væk (del 1)?

**Før det (30. oktober 2026): Første stop på flybyen hentes på forhånd (del 1 af jeres opgave med M5b).**
- **Saturn:** Hakket, I så, når flybyen startede, havde en klar årsag: "Start flyby" hentede alle seks månekort på én gang (ca. 23 MB på pc), og de blev lagt i grafikkortet midt i den første flyvning. I testbrowseren tog ét billede 4 sekunder. Nu hentes månernes kort, når Saturn åbnes (efter Saturns egne kort), ét ad gangen, og de lægges i grafikkortet med det samme. Bagefter var der ingen overførsler under flybyen.
- **Mars:** Kortene til Olympus Mons (ca. 2,9 MB) hentes, når Mars åbnes, efter Mars' egne kort.
- **Knappen:** Indtil kortene er klar, står der "▶ Start flyby (henter kort …)", og knappen er grå. Kan kortene ikke hentes, eller tager det for lang tid, bliver den aktiv efter 8 sekunder alligevel. "Næste: …"-knapperne er ikke ændret.
- Billederne afkodes nu, før de bruges (`image.decode()`), så overførslen til grafikkortet går ca. 3 gange hurtigere.
- **Domænerne:** www.jsg.utexas.edu, marsed.asu.edu og www.dlr.de virker nu. De var ikke blokeret: Containeren manglede et rodcertifikat, og dlr.de sender ikke sit mellemcertifikat. Løst uden at slå tjekket fra (Mozillas rodliste og mellemcertifikatet fra crt.harica.gr, som I åbnede). Fremgangsmåden står i `docs/erfaringer.md`.
- **Ikke afprøvet:** Hvor længe "Start flyby" er grå på tabletten (Saturn ca. 10 MB, Mars ca. 2,9 MB efter planetens egne kort). Hakker det én gang pr. måne, mens kortene lægges i grafikkortet, kort efter Saturn er åbnet? Er hakket væk, når flybyen starter?

**Før det (30. oktober 2026): Mars M5a (Tharsis, Valles Marineris og Hellas).**
- Flybyen har nu 7 stop. **Tharsis:** de tre vulkaner set langs rækken fra sydvest i morgenlys, med Arsia Mons forrest. **Valles Marineris:** midten af kløfterne fra syd, med et skarpt detaljekort, så man kan zoome ned i kløfterne. **Hellas:** det kæmpe krater fra højt oppe.
- **Flyvningen mellem to steder** går nu langs overfladen og højt op, så man kan se begge steder fra toppen. Før strøg den lavt hen over Mars på 3 sekunder. Lange hop tager op til 10 sekunder.
- Kun nettene ved stedet og det sted, man flyver hen til, tegnes, så billeder i sekundet er de samme som ved Olympus Mons. Kortene hentes ved stoppet før.
- **Faktatjekket** (hjælpeagent, kilderne åbnet med curl: ESA, NASA, USGS, NTRS og Wikipedia) rettede Tharsis' størrelse (ca. 5.000 km), toppenes højde (Pavonis ca. 14 km, de andre ca. 18 km, ikke 20), dybden (op til ca. 10 km) og de yngste lavastrømme (måske kun få millioner år gamle). To nye fagord: nedslagskrater og sprækkedal. Kilderne står i `docs/fakta-solsystemet.md` under "Faktatjek M5a".
- **Fundet:** Koordinaterne til Olympus Mons er fra USGS' ældre kortsæt (ca. 15 km forskel). Ikke rettet (stoppet er valgt ud fra højdekortet).
- **Ikke afprøvet:** Hvordan føles de lange flyvninger på tabletten (for lange eller for høje)? Er der et hak, når kortene hentes? Kan man se kanten af nettene ved Tharsis og Valles Marineris?
- Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Status efter M5a".

**Før det (30. oktober 2026): Mars M7a+ (detaljekort ved calderaen og skrænten).**
- **Jeres spørgsmål:** Calderaen og skrænten var "lidt grumsede". Svaret: Det lokale højdekort brugte kun ca. 0,5 km pr. pixel, kilden har 200 m. **Jeres go:** Lav det skarpere først. Jeres idé (almindelige kort under flyvningen, det skarpeste kort ved stoppet) er sådan, det er lavet.
- Et detaljekort i ca. 0,22 km pr. pixel over calderaen og skrænten (ca. 445 × 445 km, 2,2 MB). Det hentes, når flybyen når Olympus Mons, så det er klar ved calderaen. Calderaens bund viser nu rynker og kanter, og skrænten flere kløfter. Helt nede ved jorden er det stadig blødt, for kilden er ikke skarpere (HRSC's egne højdekort på ca. 50 m kan komme i M7b). Farverne er de samme.
- Billeder i sekundet: højst ca. 10 % lavere ved de to stop i testbrowseren (målestøjen er lige så stor). Testen `mars` tjekker detaljekortet.
- Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Status efter M7a+".
- **Ikke afprøvet:** Ser I en kant eller et skift i lyset, hvor detaljekortet slutter (ca. 200 km fra calderaen)? Er der et hak, når det hentes ved Olympus Mons? Ses fine skrå striber på vulkanens sider (fejl i HRSC-målingerne)?

**Før det (30. oktober 2026): Mars, M7a (lokale detaljer ved Olympus Mons).**
- **Jeres go (29. oktober 2026):** de tre anbefalinger i planen: HRSC+MOLA, hvis den er tydeligt skarpere, de to nye stop med `/faktatjek` og én PR for hele M7a. Højderne er rigtige som standard (jeres beslutning).
- **Et fint net over Olympus Mons** (ca. 1.000 × 1.000 km, ca. 2 km mellem punkterne på pc og 2,6 km på tablet, før ca. 21 km) med sit eget højdekort (ca. 0,5 km pr. pixel, før ca. 5 km). Kortene hentes først, når flybyen starter (ca. 2,9 MB). Ved kanten glider nettet over i resten af Mars uden synlige sprækker.
- **Højderne er fra HRSC+MOLA** (Mars Express og MOLA, lagt sammen af USGS). I spillets opløsning var den tydeligt skarpere end MOLA alene (billedet i chatten). Den har licensen CC BY-SA 3.0 IGO, som står i `KILDER.md`, `LICENSE` og "Om AtomLab". Et par kasseformede fejl i HRSC+MOLA er erstattet af MOLA.
- **Farverne er ikke skarpere end ca. 1 km:** Den skarpere Viking-mosaik (232 m) har skygger fra Solen malet ind, som ville modsige programmets eget lys. Detaljerne kommer derfor fra højderne. Det er en afvigelse fra planen.
- **Flybyen har fire stop:** hele Mars, Olympus Mons (lavere og tættere på, kl. 7), **Calderaen** (skråt ned i de seks kratere) og **Skrænten** (ved foden mod nordvest, hvor den falder ca. 8 km, i morgenlys med Solen bag skrænten). Man kan zoome ned til 3 km fra stedet (kameraet holdes stadig 2 km over jorden), og helt nede drejer og zoomer det langsommere.
- **Luften tæt på jorden:** Støvet slører nu kun efter den luft, der er mellem stedet og kameraet, så landskabet ikke bliver mælket ud tæt på. Himlen lyser lidt ind i skyggerne. Kloden ser næsten ud som før, men de høje vulkaner er lidt mindre slørede.
- **Faktatjekket** (hjælpeagent med kilderne åbnet: USGS SIM 3470, ESA, NSSDC, Wikipedia og Taylor m.fl. 2020) rettede kraternes alder (ca. 100-400 mio. år), kantens højde (ca. 20-21 km), lufttrykket (ca. 10-15 %) og at kraterne "overlapper hinanden". nature.com og lpi.usra.edu gav 403, så Neukum 2004 og Robbins 2011 er kun læst gennem USGS.
- **Billeder i sekundet i testbrowseren** ved Olympus Mons: pc ca. 2,3 → 1,6 og tablet ca. 3,7 → 2,5 (hele Mars uændret). Det koster at tegne det fine net. Et rigtigt grafikkort klarer det meget lettere, men det skal I prøve.
- **Tests:** Hele samlingen bestod (27 af 27, 15 minutter). Testen `mars` har fået tjek af det lokale kort, de nye stop og højderne.
- Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Status efter M7a".

**Citatet til Saturn (opgave 3):** Huygens' sætning om ringen er bekræftet i hans egen bog (*Systema Saturnium*, 1659, McGill-eksemplaret på archive.org). I åbnede library.si.edu og *.archive.org. **Lavet 29. oktober 2026: fire små opgaver med go** (jeres besked): 1) kategorien som link, 2) fotoner i Stjerneovnen (med faktatjek), 3) et citat til Saturn (kun med en sikker kilde, ellers intet) og 4) Ordbogen som egen del (spørg om kort i menuen eller kun fra hjælpen, med en skitse, før der bygges). I den rækkefølge og én PR pr. opgave, som Opus selv merger, når `--ændret` er grøn. Hele samlingen køres én gang til sidst. Testene `batteri` og `beskeder` bestod to runder i træk på den nye `main`.

**Før det (29. oktober 2026): Ordbogen (opgave 4).**
- Menuen har et ottende kort, **Ordbogen** (4 + 4 på pc, jeres valg). Det viser antallet af fagord (49). Værkstedets hjælp har et link under "Ordforklaringer". Adressen er `#ordbog`.
- Alle fagordene står i alfabetisk rækkefølge (dansk sortering, æ, ø og å til sidst) med bogstaver at hoppe til og en søgning. Ord, hvor navnet passer, kommer først, derefter ord, hvor teksten nævner det. Esc tømmer søgningen. Teksterne er de samme som i ordforklaringerne, så intet er skrevet om.
- 29 ord har et link til et sted, hvor de bruges: tre "Hvorfor?"-kort (tunneleffekt, den stærke kernekraft, bindingsenergi), Stjerneovnen, Reaktoren eller Batteriet, eller et fænomen i Kosmos eller Solsystemet. Et link må kun pege på et sted, hvor ordet står i teksten. Fire, der ikke gjorde det, blev fjernet (fx radioaktiv → "Hvorfor er nogle kerner ustabile?"). De andre 20 ord har intet link.
- Skifter man skærm, lukker hjælpen nu af sig selv (før kunne den blive stående over den nye skærm).
- Ny test `ordbog`.

**Før det (29. oktober 2026): Et citat til Saturn (opgave 3).**
- Saturn har nu et citat af Christiaan Huygens fra *Systema Saturnium* (1659): "Den er omgivet af en tynd, flad ring, der ingen steder hænger fast i den og hælder i forhold til Jordens baneplan." Den latinske ordlyd står, når man holder musen over, og kommentaren fortæller om anagrammet fra 1656 og Galilei.
- Ordlyden er læst i bogen selv (archive.org, som I åbnede). Wikipedia staver ét ord forkert, og bogstaverne i anagrammet viser den rigtige stavning. Kilderne står i `docs/fakta-solsystemet.md` til sidst.

**Før det (29. oktober 2026): Fotoner i Stjerneovnen (opgave 2).**
- Nyt fagord **foton** (en lyspartikel) i ordbogen. Trin 2 i "Fra brint til carbon, trin for trin" siger nu, at energien kommer ud som en foton af gammastråling, og at gassen i Solen sluger den og sender nye ud med lidt mindre energi igen og igen, så energien er titusinder af år om at nå overfladen. Hjælpens "Lys og neutrinoer" siger "Fotonerne af gammastråling".
- Faktatjekket (kilderne i `docs/fakta-hvorfor.md` til sidst) rettede to ting: Fotoner flyver kun "altid" med lysets fart i tomt rum, og de bliver til svagere lys undervejs. Der står ikke et præcist tal for tiden, kun "titusinder af år" som de andre steder.

**Før det (29. oktober 2026): Kategorien som link (opgave 1).**
- Kategorien under grundstoffets navn (fx "Overgangsmetal") er nu en knap i Atomværkstedet og på grundstofkortet i Det periodiske system. Et tryk viser et "Hvorfor?"-kort ved ordet med det, kategorien har til fælles, og hvorfor (de eksisterende tekster fra `js/data/kategorier.js`). Esc og et tryk udenfor lukker det, og på telefon på højkant kommer det nedefra.
- Nederst står "Se hele kategorien ›". Det lukker grundstoffet og viser kategorikortet på væggen med forsøget og medlemmerne. Fra værkstedet skifter det først til Det periodiske system.
- Nye tjek i testen `kategorier` (kortet, Esc, linket fra begge steder, ingen rullebjælke i infopanelet, telefon).

**Før det (29. oktober 2026): Mars, M4c (den fælles flyby og rejsen ned til Olympus Mons).**
- **Mars har "▶ Start flyby"** med to stop: hele Mars og Olympus Mons. Kameraet flyver i en bue ned over Mars og ser skråt hen over vulkanen mod horisonten, hvor den tynde luft lyser. Kameraets "op" følger den lodrette retning på stedet, så man drejer rundt om vulkanen med fingeren. Mars står stille, og klokken er 8 om morgenen ved vulkanen (lange skygger og ingen skyer). "Hele Mars" flyver tilbage. "Bjergene 10 gange højere" og "Modlys" virker også ved stedet (i modlys står Solen lige under horisonten foran kameraet).
- **Kameraet kommer aldrig ind under bjergene.** Det holdes mindst 2 km over jorden: under flyvningen (også fra bagsiden af Mars), når man selv drejer og zoomer, og med de høje bjerge.
- **Flybyen er et fælles modul** (`js/solsystem/flyby.js`), som Saturn og Mars bruger. Saturns flyby er den samme som før: Kameraets tal er helt ens ved alle ni stop, og billederne afviger ikke mere end mellem to kørsler før ændringen.
- **Teksten om Olympus Mons** er faktatjekket (Wikipedia, USGS og en artikel fra UCL, alle åbnet med curl). Faktatjekket rettede skråningen (ca. 3°, ikke 5°) og koordinaterne (USGS' navneliste). To nye fagord: skjoldvulkan og caldera.
- **Jeres svar ved go:** Flybyen med to stop (anbefalingen), og jeg valgte formiddag, fordi skyerne om eftermiddagen dækkede vulkanen. I åbnede `discovery.ucl.ac.uk` og `planetarynames.wr.usgs.gov`, og begge virker.
- Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Status efter M4c".

**Før det (29. oktober 2026): Testene `batteri` og `beskeder` holder under belastning.**
- **Jeres opgave (29. oktober 2026):** Ret de to tests (del 1, egen PR), og lav derefter Mars M4c (del 2, egen PR, planen skal godkendes først).
- Begge fejlede, når de kørte sammen på en travl maskine. Genskabt med fire travle CPU-løkker ved siden af. `batteri` åbnede "Vis mig"-siden, mens den første side stadig tegnede batteriet, og indlæsningen nåede ikke at blive færdig på 30 sekunder. Nu lukkes den første side først, og testen venter på, at skærmen er klar. I `beskeder` forsvandt pillerne (4,5 sekunder i rigtig tid), før testen nåede at trykke. Nu fryser testen pillernes tid og lader den selv løbe ud (ny testadgang `atomlabTest.beskeder`), og den tjekker også, at den næste pille i køen kommer frem.
- Med rettelsen bestod begge tre runder i træk med samme belastning. Selve spillet er ikke ændret (kun en testadgang i `js/beskeder.js`).

**Før det (26. oktober 2026): Mars, M4b (Solen og Jorden får egne visninger).**
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

**Næste i gang (26. oktober 2026):** **Mars M4** er delt i M4a (skærmen Solsystemet, den fælles skal og flytningen, ✅ lavet), M4b (Solen og Jorden får egne visninger, ✅ lavet) og M4c (den fælles flyby og rejsen ned til overfladen, høj effort). M4c (den fælles flyby og rejsen ned til overfladen, ✅ lavet 29. oktober 2026).
- **Ny rækkefølge (jeres svar 29. oktober 2026):** Olympus Mons var "ikke for imponerende". Det skyldes mest, at Mars' net er groft (ca. 21 km mellem punkterne). Derfor kommer **M7a** (lokale detaljer, prøvet på Olympus Mons) før M5: M7a → M5 → M6 → M7b → M8. Højderne forbliver rigtige som standard. **M7a er lavet (30. oktober 2026), og M7a+ (detaljekortet ved calderaen og skrænten) også. M5 har go (alle syv anbefalinger), M5a er lavet, og M5b er næste. Planen står i `docs/plan-mars.md` under "Plan for M5".** Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Detaljer før flere stop".
- **Jorden og Solen i Solsystemet (jeres svar 26. oktober 2026):** Med i M4. Jorden bliver en klode som Mars (man kan dreje den, og Månen er med), og Årstiderne og Formørkelser ligger under Jorden. Solstorm og Solens fremtid flytter med under "Solen". Jorden bruger de billeder og modeller, vi har nu, og kan gøres flottere senere, når Mars er færdig. Detaljer i [docs/plan-mars.md](docs/plan-mars.md) under "Jorden i Solsystemet". S2 (ringene fra Cassinis målinger) og S3 (højder på månerne) venter, til Mars er færdig.
- **Mars på tabletten (jeres svar 24. oktober 2026):** kører fint med 8k-kortet og ser super ud. KTX2 er derfor ikke nødvendigt lige nu.
- **GitHub-adgang:** I har åbnet for GitHub under Network access, men github.com gav stadig 403, også i en ny session (tjekket 24. oktober 2026 i S1). Det er ikke brugt i S1. Skal KTX2 (`basisu`) prøves, så tjek miljøets indstilling for Network access igen.

**Venter på et go** (ikke startet, størrelsen står i parentes):
1. **Det sorte hul** er ikke imponerende nok (jeres billede): Den hvide ring ligner ikke bøjet lys, skiven foran hullet ligner et beige låg, og den ene side er ikke lysere end den anden. **Forslag:** Byg det om med rigtig lysbøjning (en shader, der regner lysets baner som i Interstellar), så skivens bagside bøjes op over og ned under skyggen, med en tynd fotonring og Doppler-lys (stor, **Opus med xhigh**: sværeste fysik og matematik på listen).
2. ~~**Ordbogen**, **kategorien som link** og **fotoner i Stjerneovnen**~~ ✅ Lavet 29. oktober 2026.
3. **Orbitalerne i store atomer** (fx jern) er svære at læse, fordi de mange former ligger oven i hinanden og ligner en blomst. **Jeres svar:** behold som nu, men tag det op igen. Forslaget er én underskal ad gangen (fx "4s" og "3d") med en kort tekst, som i fysikbøgerne (mellem).
4. **Molekyler, M1 (Byttebørsen):** Planen og jeres svar ligger klar i [docs/plan-molekyler.md](docs/plan-molekyler.md) (stor). Faktagrundlaget til M2 laves med xhigh.
5. **Solsystemet, trin 2:** overblikket med Solen og planeterne, hvor de står i dag. Derefter kan planeterne ses på himlen fra Saturn, og der kan komme en knap "Find Jorden" (se [planen](docs/plan-solsystemet.md) under "Himlen") (stor).
6. **Fotos af grundstofferne** fra Wikimedia Commons med navn og licens (mellem).
7. ~~**Et citat til Saturn**~~ ✅ Lavet 29. oktober 2026 (Huygens).
8. **Tjernobyl og Liv** venter på Fable (se [docs/plan-fable.md](docs/plan-fable.md)). Kører Opus dem før Fable 5.5, så med xhigh til faktagrundlaget.

**Åbne spørgsmål til jer:**
- **Domæner (25. oktober 2026):** Listen over de domæner, der skal tilføjes under Network access, står i [docs/plan-mars.md](docs/plan-mars.md) under "Domæner, der skal på listen". Tjek dem med `curl`, når I har tilføjet dem.
- **Atomet B:** I har ikke set det på tabletten endnu. Sig til, hvis det skal ændres.
- **Faktatjek, der mangler:** Hjælpeagenterne kunne ikke åbne kildesiderne (kun søgeresultater). Det, der skal tjekkes mod kilderne, står i `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md` (især del 2 om Voyager og afsnit 4b om flybyen).

**Ikke afprøvet endnu:**
- **Olympus Mons (M7a) på tabletten:** Kører det glat ved Olympus Mons, calderaen og skrænten (det fine net koster mest dér)? Er der et hak, når kortene hentes ved flybyens start? Kan I se en kant eller flimmer, hvor det fine net går over i resten af Mars (ca. 500 km fra toppen)? Hvordan føles det at zoome helt ned til et par km over jorden? Er den støvede himmel ved skrænten for brun eller for lys? Hakker det, er første skridt et grovere net på tabletten (256 × 256).
- **Ordbogen på tabletten:** Er bogstaverne og linkene lette at ramme? Ruller listen glat med fingeren? Ser menuen med 8 kort godt ud på langs og på højkant? Kommer tastaturet op, når man trykker i søgefeltet, og dækker det listen?
- **Kategorien som link på tabletten:** Er ordet let at ramme med fingeren, og ser man, at det kan trykkes på (en tynd streg under)? Står kortet godt ved ordet på tablet på langs og på højkant?
- **Olympus Mons (M4c) på tabletten:** Hvordan føles det at dreje rundt om vulkanen med fingeren og zoome ind (drejningen er lidt langsommere ved stedet)? Kører flyvningen ned glat? Et lille hak, første gang Mars åbnes, mens højdetabellen bliver lavet? Ser vulkanen for flad ud med de rigtige højder, og er udsigten mod horisonten flot?
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
- **Uddrag fra gamle bøger** (jeres idé, 29. oktober 2026): Billeder af siderne fra de oprindelige bøger og breve af fx Newton, Huygens, Tycho Brahe, Galilei og Einstein, med den oprindelige tekst og en dansk oversættelse ved siden af. Eksempel: Huygens' *Systema Saturnium* (1659), hvor anagrammet om Saturns ring bliver afsløret (siden findes på archive.org, McGill og Smithsonian). Forbehold: Bøgerne er så gamle, at teksten er fri, men bibliotekernes skanninger kan have egne vilkår, så licensen skal tjekkes side for side og skrives i `KILDER.md`. Ikke vurderet eller planlagt endnu.
- **Kategorien som link** (jeres ønske, 24. oktober 2026): I Atomværkstedet og Det periodiske system skal kategorien under navnet (fx "Overgangsmetal") kunne trykkes på og vise, hvad kategorien er. **Anbefaling:** et "Hvorfor?"-kort, der popper op ved ordet. Det bruger teksterne fra kategorikortet (`js/data/kategorier.js`: hvad de har til fælles, og hvorfor), så man bliver, hvor man er. Nederst står "Se hele kategorien ›", som åbner kategorikortet i Det periodiske system med forsøget og medlemmerne. Det følger planen for lagene (ét tryk for mere, uden at forlade skærmen), og teksterne findes allerede. Lille opgave. ✅ Lavet 29. oktober 2026.
- **Ny del: Ordbogen** (jeres idé, 24. oktober 2026): Alle begreber, der er spredt rundt i AtomLab, samlet ét sted, så de er lette at slå op. Fx gammastråling: Den står allerede i ordbogen (`js/data/ordbog.js`, 44 fagord), men man kan kun se forklaringen ved at trykke på det prikkede ord i en tekst. **Forslag:** en side med alle fagord i alfabetisk rækkefølge og en søgning, og med "Hvorfor?"-kortene og kategorierne. Fra hvert ord kan man gå derhen, hvor det bruges. Den kan åbnes fra menuen og fra hjælpen. Lille til mellem. Venter på et go. ✅ Lavet 29. oktober 2026 (8. kort i menuen).
- **Fotoner i Stjerneovnen?** (jeres spørgsmål, 24. oktober 2026): I dag står der kun "gammastråling (meget kraftigt lys)". **Forslag:** "foton" (en lyspartikel) som nyt fagord, og én sætning i Stjerneovnens forklaring om, at energien kommer ud som fotoner af gammastråling, og at de bruger meget lang tid på at kæmpe sig ud af Solen. Det står allerede i "Lys og neutrinoer", men uden ordet foton. Lille, men skal faktatjekkes. ✅ Lavet 29. oktober 2026.
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
- **Meget mere om Saturns måner** (jeres idé, 29. oktober 2026): I dag har hver måne en kort tekst i flybyen. Under Saturn skal der være langt mere: *hvad ved vi om dem?* Især **Enceladus** (fontænerne, havet under isen og om der måske er betingelser for liv) og **Titan** (søerne af metan og ethan, den tykke dis, regn, og om livet kan være noget helt andet end vores). **Forslag:** Samme lag-princip som resten af AtomLab: kort fremme, og "Hvorfor?"-kort og "For nørder" under, fx "Hvad er under isen på Enceladus?", "Hvordan kan der være søer på Titan?" og "Kan der være liv?". Kan kobles til flybyen (et stop kan få et dybere lag) og senere til delen Liv. **Jeres svar:** månerne ligger under Saturn, og Liv linker til dem. Livsafsnittet skrives nu (besluttet 29. oktober 2026), ikke først med Liv. Skal siges ærligt: der er **ikke** fundet liv, kun betingelser, der *kan* passe, og hvad vi ved, kommer fra Cassini og Huygens. Skal faktatjekkes grundigt (Fable tjekker Opus' udkast, som ved Solsystemet i øvrigt). Mellem til stor. Venter på et go.
- **Planet X** (jeres idé, 29. oktober 2026): Solsystemet skal også fortælle om den mulige ekstra planet langt ude: *hvorfor tror man, der kan være en, og hvad kunne den være?* **Forslag:** Tag udgangspunkt i konsensus (hvad man har set, og hvad forskerne er enige om), og vis så de alternative forklaringer ved siden af, hver med en ærlig vurdering af, hvor stærk den er. Skal vise tydeligt, at **ingen har fundet planeten**, og at en del forskere mener, at mønstret kan skyldes måden, man har søgt på. Skal skelne mellem det gamle "Planet X" (der blev søgt efter omkring Neptun og Pluto) og den nuværende hypotese. **Jeres svar:** Sandsynligvis en gruppe "Yderst ude", afgøres senere. Kunne vise de fjerne objekters baner som en visning i Solsystemet med afstandene i den rigtige skala. Stor, og **omstridt videnskab**, så faktagrundlaget laves med xhigh og tjekkes af Fable. Venter på et go.
- **Formørkelser under Jorden skal have et grafisk løft** (jeres ønske, 29. oktober 2026): Grafikken er lidt for grim. Især **lysstrålerne og lyskeglerne** (Månens og Jordens skygger, kerneskygge og halvskygge) skal løftes. Fænomenet ligger i Solsystemet under Jorden (`js/kosmos/formoerkelser.js`). **Forslag:** Se først, hvordan det ser ud i dag (skærmbilleder pc og tablet), og foreslå så, hvordan strålerne og keglerne kan blive blødere og mere troværdige (toning, glød i stedet for hårde flader). Fysikken og tallene (`js/data/skygge.js`) skal ikke ændres. Mellem. Venter på et go.
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
