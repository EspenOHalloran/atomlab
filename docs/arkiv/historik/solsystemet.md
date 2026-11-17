# Historik: Solsystemet og Kosmos

**Lavet (17. november 2026): Feedback nr. 3, Solen som en bedre tegning** (prompten i [arkiv/prompt-solen.md](../arkiv/prompt-solen.md)).
- **Egen shader i `js/kosmos/solen.js`** (`stjerne()` er ikke rørt): den mørke rand (orange og kraftigere mod kanten), granuler som cellestøj med mørke render, der kun ses, når man zoomer ind, 9 solpletter i 4 grupper med mørk kerne og lysere kant, der halter efter ved højere bredde (25 døgn ved ækvator, 36 ved polerne), og fakler nær randen (jeres valg). Grupperne vokser, svinder og kommer igen et nyt sted. Skiven ligger under grænsen for gløden, så den ikke brænder ud. Tallene i `js/data/solen.js`.
- **Tabletten:** 1 lag støj i stedet for 3 og ingen striber i pletternes kant (`LAV_KVALITET`). Granulerne regnes slet ikke, når hele Solen ses.
- **Teksten:** "Ærligt talt" (granulerne er for brede og for langsomme, pletterne er pynt, 11-årscyklus og maksimum omkring 2024-2025), to afsnit i "For nørder" (solpletter og den mørke rand, der er gjort kraftigere i tegningen), en sætning i "Drejer Solen?" og ordet "Solplet" i ordbogen. Faktatjekket.
- **Tilbage:** jeres måling med `?maal` på Tab A11 ([ikke-afproevet.md](../ikke-afproevet.md)). Solstorm bruger stadig den gamle `stjerne()` og kan få den nye Sol bagefter, hvis I vil (lille opgave).

**Lavet (16. november 2026): Feedback om at åbne Kosmos og Solsystemet.**
- **Kosmos' forside** (`js/kosmos/oversigt.js`): Fra menuen starter Kosmos altid på forsiden "Kosmos" med fire kort (ét pr. gruppe, en knap pr. fænomen). Det sidst valgte fænomen (`atomlabKosmos`) åbnes ikke længere af sig selv. Før landede man midt i fx forløbet "Rejsen i tid" uden listen.
- **Overblikket i Solsystemet:** Trin 1 i "Rundt om Solen" viser først hele Solsystemet i 2,5 s (`HEL_S`) og glider så ind til de fire inderste.
- **Ud af et forløb:** "Spring over" er nu knappen "✕ Ud af forløbet" i alle forløb (`js/forloeb.js`, `.fl-spring`).
- **Forberedt:** "For nørder" bliver "Vil du vide mere?" ([prompt-vil-du-vide-mere.md](../prompt-vil-du-vide-mere.md), sporet Småting).

**Lavet (16. november 2026): Feedback nr. 5, ryk ved skift** (prompten i [prompt-solsystem-feedback.md](../prompt-solsystem-feedback.md)).
- **Shaderne:** Kloden er skjult under rejseskiltet og i overblikkets mørke, til dens shadere er oversat (højst 1,5 s, `skjulTilKlar`). Three.js ventede ellers første gang, en shader blev tegnet, også bag skiltet. "Ring-shaderen" blev ikke bygget igen: Hver gasplanet har sin egen udgave.
- **Kortene:** Kortkøen (`js/solsystem/kortkoe.js`) lægger ét kort pr. billede i grafikkortet (fx Jordens fire månedskort), og månerne på forhånd venter, til kameraet ikke flyver.
- **Kig efter:** mål igen på pc og Tab A11, se [ikke-afproevet.md](../ikke-afproevet.md).

*Det forrige "Senest lavet" fra [lige-nu/solsystemet.md](../../lige-nu/solsystemet.md) flyttes hertil ordret, nyeste øverst (fra 7. november 2026). Det, der er ældre, står i den lukkede [historik.md](../historik.md).*

**Senest lavet (16. november 2026): Feedback fra prøven, nr. 1, 2 og 4** (prompten i [prompt-solsystem-feedback.md](../prompt-solsystem-feedback.md)).
- **Nr. 1:** Trin 1 og 4 i "Rundt om Solen" siger nu, hvad man skal ("… Hvilken er vores? Tryk på den.", "Find den, og tryk på ringen."). Kun de to trin i alle forløbene havde fejlen (ingen knapper, og klodsen viser ikke `gør`).
- **Nr. 2:** "💡 Rejs med lyset" hedder "✕ Stop lyset", mens rejsen kører. Et tryk, Esc og rejsens slutning (10 s efter Pluto, jeres valg) stiller skalaen på "Pustet op" og flyver kameraet hjem.
- **Nr. 4:** Årsagen var `stop()`, der gemte kameraet, efter det var fløjet ind til planeten. Nu går man fra en planet altid tilbage til hjemblikket i "Pustet op" (datoen huskes stadig).
- Testene `overblik` og `overblik-forloeb` har fem nye tjek. **Kig efter på tabletten:** [ikke-afproevet.md](../ikke-afproevet.md).

**Senest lavet (16. november 2026): Opus' noter til Fables drejebog til Merkur og Pluto (E16) og jeres svar.** Kun dokumenter. Intet er bygget.
- **Noterne:** [fable/E16-merkur-pluto-noter.md](../fable/E16-merkur-pluto-noter.md). Drejebogen er [drejebog-merkur-pluto.md](../drejebog-merkur-pluto.md).
- **De tre tjek:** (1) Polen: Dataene er skarpe. Det slørede kommer af kuglens kort i bredde og længde (anisotropi 8 er for lidt så tæt på polen). Måles i MP1, og trænger det, kommer et lille polkort i kuglens shader (kan også hjælpe Mars' nordpol). (2) BDR vinder over LOI, men stregerne i BDR fjernes. (3) Evig skygge: Kraterbundene er allerede sorte i kortet. Ingen ny skyggekode.
- **Fund:** Merkurs højdekort og Plutos kort har 180° i midten, Merkurs billedkort 0°. Pluto beholder 180° i midten, så hjertet ikke ligger på kortets kant.
- **Jeres svar (alle som anbefalet):** Kernesætning A for begge, kun flybyen (6 og 5 stop), tegningen af Solen, der vender om, og de lyse huller som Merkurs tredje sted.

**Senest lavet (16. november 2026): Rettelserne fra Fables eftersyn E14 i "Rundt om Solen"** (prompten i [prompt-e14-rettelser.md](../prompt-e14-rettelser.md), noterne i [fable/E14-noter.md](../fable/E14-noter.md)).
- **Trin 1:** De fire inderste er mindst ca. 14 px brede og har en ring (uden navn, så gættet ikke er givet), og de ydre planeter og Saturns ringe er dæmpet (`vis.inderst` i `js/kosmos/overblik.js`). Når Jorden er fundet, er alt som før.
- **Trin 2:** Teksten efter gættet er "Prøv det: Træk skyderen ét år frem." for alle tre svar (`js/data/forloeb/overblik.js`).
- **Laboratoriets tre mærkater (billede 15):** "Solsystemet" har to felter i gitteret, "Skala" har luft til "Pustet op og rykket sammen" (gælder alle skydere i Styr), og et navn ved vinduets højre kant står til venstre for kloden (Uranus bag panelet).
- Testen `overblik-forloeb` har to nye tjek (trin 1). Trin 4's Spørg (Fables forslag) er ikke rettet, den var ikke med i prompten.
- **Kig efter på tabletten:** se [ikke-afproevet.md](../ikke-afproevet.md) (de fire inderste i trin 1).

**Senest lavet (15. november 2026): Overblikket trin 4, forløbet "Rundt om Solen" og "Rejs med lyset"** efter [drejebog-overblik.md](../drejebog-overblik.md) og jeres go pr. del (A-E). Status "prøve". Koden står i [kode/overblik.md](../kode/overblik.md).
- **A og B:** teksterne (`js/data/forloeb/overblik.js`), listen, knappen i hjælpen, fem ord i Ordbogen, trin 1 (find Jorden) og trin 2 (et år rundt med haler og tællere). Jorden har fået blå luft i overblikket.
- **C:** trin 3 (knappen "Rigtig størrelse og afstand", glider 3 s), trin 4 (kun Jordens ring, dykket på 8 s fra 11 milliarder km ned til Jorden med en tæller, Jorden fra den belyste side) og "Det så du" (kameraet trækker sig ud, skalaen tilbage) med tre veje: "Besøg en planet" (navnene tændt, Merkur mat), "Leg frit" og "Rejs med lyset". ✓ i "Din fremgang".
- **D:** "💡 Rejs med lyset" i bjælken (jeres svar: bjælken, kameraet følger skallen). En lysende skal vokser fra Solen i den rigtige skala, uret viser lysets tid ("spolet frem"), og tiden står ved hver planet (i dag Jorden 8 min 13 s, Neptun 4 t 8 min).
- **E:** testen `overblik-forloeb` (17 tjek), `overblik` og den nye med i hele samlingen, hjælpen ("fire korte trin" og Rejs med lyset) og dokumenterne. Faktatjek: Alle tal regnes af data, der er tjekket i drejebogens afsnit 4 og testen mod Horizons.
- **Kig efter på tabletten:** se [ikke-afproevet.md](../ikke-afproevet.md) (Jordens ring i trin 4, dykkets fart, Jorden til sidst og rejsens fart).

**Senest lavet (15. november 2026, natkørsel): Overblikket, trin 1-3** efter [drejebog-overblik.md](../drejebog-overblik.md) og jeres go (status "prøve", forløbet mangler). Koden står i [kode/overblik.md](../kode/overblik.md).
- **Trin 1, data og kort:** `js/data/planeter.js` (JPL's tabel 1 for de otte planeter, Kepler-regningen flyttet hertil fra `isgiganter.js`) og Plutos plads hvert år fra Horizons (`pluto-bane.js`). Testen `overblik` sammenligner med Horizons i 1850, 1979, 2026 og 2100 (højst 0,23° i 2100) og tjekker Pluto inden for Neptun 1979-1999. Nye 1k-kort: Merkur (MESSENGER) og Pluto (New Horizons) fra Commons, Jorden med skyer, Mars og Saturn (`lav_overblik.py`, `KILDER.md`).
- **Trin 2, laboratoriet:** "Solsystemet" er den første klode og forsiden. Solen, banerne, kuglerne med kort, Saturns ringe, bælterne som prikker, skalaen med to stillinger (glider selv i mål), spole-skyderen (et træk er et år) med ⏪ ⏩ i tre tempi og "I dag", 1800-2100, Navne (de inderste samles i den rigtige skala) og højre panel med fire spørgsmål, For nørder og Ærligt talt (faktatjekket).
- **Trin 3, ind og ud:** Tryk på en klode (den nærmeste inden for 44 px) eller i gitteret: Kameraet flyver ind og toner gennem mørke over i planetens visning. Titlen "Solsystemet" i toplinjen fører tilbage, og overblikket flyver ud fra planeten. Venus, Jorden, Uranus og Neptun får overblikkets dato (Uranus' "År" går til 2100). Merkur og Pluto er "Kort besøg" i træet med et kort panel.
- **Spørgsmål til jer** (valg, jeg tog i nat efter drejebogen, ret dem gerne):
  1. Solsystemet åbner altid på overblikket, også hvis man sidst var ved Mars. Links direkte til en planet springer det over.
  2. Trin 1-3 blev merget samlet (trin 1 alene kunne ikke ses).
  3. Retningen ind mod en planet er fra den belyste side (Saturn fra syd). Den passer ikke helt med, hvor hver visning selv starter kameraet, så det er ikke helt "ét blink". Er det godt nok på tabletten?
  4. Venus er en jævn, lys kugle uden kort, og kloderne drejer ikke i overblikket. Bælterne er tilfældige prikker, ikke rigtige asteroider (det står i "Ærligt talt").
  5. Ordene planet, bane, dværgplanet, asteroidebælte og Kuiperbælte kommer i Ordbogen med forløbet (trin 4).
- **Jeres svar (15. november 2026):** Alle fem er godkendt, som de er. Punkt 3 (retningen ind mod en planet) vurderer I på tabletten senere.

**Kosmos, senest lavet (13. november 2026): Betelgeuse set fra Jorden (Supernova).** Jeres ønske: "en hurtig MEN fed tilføjelse til supernovaer om Betelgeuse", og ja til både den nye ledsagerstjerne og en 3D-del. Nyt emne "Hvad sker der, når Betelgeuse eksploderer?" (emnet "Hvad har det med dig at gøre?" er lagt ind under "Hvad bliver der tilbage?", så der stadig er fire spørgsmål) og fire afsnit i For nørder (lyskurven, advarslen fra Super-Kamiokande, den store formørkelse 2019-20 og makkeren Siwarha). Kontakten "🌃 Betelgeuse set fra Jorden": en vinternat i Danmark med Orion på de rigtige pladser. "💥 Lad Betelgeuse eksplodere" spiller ca. fem år på et halvt minut (neutrinoerne, lyset et døgn senere, klar som en halvmåne i tre måneder og så falmer den), skyderen "Tid efter eksplosionen", "↻ Vend dig om" (din egen skygge, stakittet, træet og huset) og "☀️ Om dagen" (en eftermiddag i marts). Faktatjekket med kilder (Astronomy, Adler Planetarium, NOIRLab/AAS Nova, NASA/Hubble, ESO, Super-Kamiokande 2022 og en oversigtsartikel om Betelgeuse 2023). Ingen Fable, for stoffet er ikke omstridt. Ikke afprøvet på en rigtig tablet.

**Senest lavet (14. november 2026): G1 trin 3, del 3, forslag A og F, en glidende landing i Stå på Mars og skyggerne i strimler.** Jeres go: del 3 og (for skyggerne) "1: Strimler".
- **A og F:** Mars' store kort, landskabets lag, roverens foto og Saturns og Jupiters måner pakkes ud uden for hovedtråden (`vendt`). Udseendet er det samme.
- **Den glidende landing:** Kortene, shaderne og de første skygger lægges nu i grafikkortet, mens kameraet står stille over stedet, før toningen. Før skete det i billedet lige efter toningen (2,0-2,3 s i testbrowseren, 1,2 s på tabletten ved Jezero). Prisen: Kameraet står lidt længere stille over stedet.
- **Skyggerne i strimler:** Mens Solen flytter sig, regnes hvert skyggelag over flere billeder i et kort ved siden af, der skiftes ind, når det er færdigt. I testbrowseren er det dyreste billede faldet fra 410 til 66 ms (skøn på tabletten: ca. 35-50 billeder i sekundet i stedet for 11-20). Detaljer og tal under "Status" i [plan-grafik.md](../plan-grafik.md). Værktøj: `tests/vaerktoejer/maal-landing.mjs`.
- **Spørgsmål til jer:** Mål med `?maal` på A11 og A56 (se [ikke-afproevet.md](../ikke-afproevet.md)): Er hakket ved "Stå på Mars" væk, og hvor mange billeder i sekundet er der med ▶ og "🌅 Solnedgang"?

**Senest lavet (14. november 2026): G1 trin 3, del 2, forslag H (Stå på Mars lettere på tablet).** Jeres go: a + b, så en ny måling på tabletten, før c (dynamisk opløsning) overvejes.
- **(a)** Landskabets net er delt i 16 lagkagestykker, og kun dem i de retninger, billedet viser, tegnes (lodret ned tegnes alle). Udseendet er det samme. **(b)** På tablet regnes skyggerne i halv opløsning, mens Solen flytter sig (▶, skyderen eller "Solnedgang"), og skarpt igen, når den står stille. Pc'en er uændret.
- **Målt i testbrowseren (tablet-udgaven, kun til sammenligning):** et billede vandret −39 %, op mod himlen −55 %, ned −36 %, lodret ned −23 %. Skyggerne, mens Solen flytter sig, koster ca. en femtedel. Detaljer under "Status" i [plan-grafik.md](../plan-grafik.md). Tests: `tests/landskab-tablet.mjs` (ny) og `tests/landskab.mjs`. Værktøj: `tests/vaerktoejer/staa-tid.mjs`.
- **Spørgsmål til jer:** Mål med `?maal` på tabletten ved Gale og Jezero (se [ikke-afproevet.md](../ikke-afproevet.md)). Er det stadig under ca. 30 billeder i sekundet, mens man står, er (c) dynamisk opløsning det næste.

**Senest lavet (13. november 2026): G1 trin 3, del 1, forslag G (billederne frigives).** Jeres go: "Go med dine anbefalinger" (alt frigives, når man forlader Solsystemet eller Kosmos, og landskabet, når man letter fra Stå på Mars).
- Hvert billede har nu en ejer (planeten eller Stå på Mars) og slettes fra grafikkortet, når ejeren forlades. Delte billeder bliver liggende (fx Jorden mellem Årstiderne og Formørkelser). Udseendet er det samme.
- **Målt (fuld grafik i testbrowseren, pc):** menuen efter turen 991 → 27 MB, Saturn 838 → 271 MB, Jorden 991 → 180 MB. Mens man står ved et sted med fotoet, er der stadig ca. 600 MB på pc. **Prisen:** En planet eller et landskab åbner lidt langsommere anden gang (hentes igen fra browserens cache). Detaljer under "Status" i [plan-grafik.md](../plan-grafik.md). Test: `tests/frigiv.mjs`.
- **Spørgsmål til jer:** Mål gerne igen med `?maal` på tabletten (samme tur som før), og sig, om det føles langsomt at åbne en planet anden gang.

**Senest lavet (13. november 2026): Måleren og hakkene på Mars (G1 trin 1).** Jeres go: "Læs docs/prompt-maaler.md og lav trin 1." Jeres svar: Det hakker, når kameraet flyver, og første gang et sted besøges, på en bærbar uden særskilt grafikkort.
- **Måleren:** `?maal` i adressen (fx `…/atomlab/?maal#solsystem`) viser billeder i sekundet, det værste billede, ryk over 50 ms og en liste over rykkene med det, der skete lige før (nye shadere, kort lagt i grafikkortet, hentede billeder, kamerarejser, tryk). "Kopiér" giver teksten til chatten. Den hentes kun med `?maal` (`js/maaler.js`).
- **Rettet på Mars (ingen ændring af udseendet):** Shaderne laves, når Mars åbnes, og ikke første gang kameraet flyver til et sted (før 200-500 ms pr. shader i testbrowseren, nu ingen under flyvningerne). De lokale kort og månernes kort pakkes ud uden for hovedtråden (4-6 gange hurtigere at lægge i grafikkortet), og kortene til næste stop lægges i grafikkortet, når kameraet står stille.
- **Fundene og forslag A-F** (det, der ændrer udseendet, venter på jeres måling): "Status" i [plan-grafik.md](../plan-grafik.md). Tests: `tests/maaler.mjs`.
- **Spørgsmål til jer:** Mål med `?maal` på pc og tablet (vejledningen står under "Trin 2" i [prompt-maaler.md](../prompt-maaler.md)), og send teksten fra "Kopiér".

**Senest lavet (9. november 2026): Venus V2, skyerne og superrotationen.** Jeres go: "Læs docs/prompt-venus.md og kør V2."
- **Skyerne fra Akatsuki:** 48 billeder i ultraviolet fra 13.-19. august 2017 (JAXA's arkiv DARTS) er lagt sammen til ét kort over hele kloden (`lav_venus_skyer.py`). Fra start ser Venus ud, som den gør: lyst gullig hvid og næsten glat. "Ultraviolet (som Akatsuki)" viser striberne. Skyderen "Under skyerne" toner dem væk, og en tynd dis lyser i "Modlys".
- **Vindene er målt:** i de samme billeder (som Jupiters vinde): ca. 103 m/s mod vest ved ækvator, en omgang på ca. 4,3 døgn, som Venus Express. Over 42° aftager de til 0 ved polerne (ikke målt her). Skyerne kører samme vej som Venus, ca. 55 gange hurtigere.
- **Tempoet:** ▶ en time i sekundet (skyerne er knap 2 minutter om en omgang), ⏩ seks timer i sekundet. "Bjergene 10 gange højere" løfter også skyerne.
- **Hurtigere end V1:** Jorden tegnes ikke, når skyerne dækker helt.
- **Domænet:** Dataene lå på `data.darts.isas.jaxa.jp`, ikke `darts.isas.jaxa.jp`. Jeg åbnede det i miljøet (I godkendte det).
- **Tests:** `tests/venus.mjs` (38 tjek). Koden: [kode/venus.md](../kode/venus.md).
- **Spørgsmål til jer:** Ingen.

**Senest lavet (9. november 2026): Venus V1, jorden og skelettet.** Jeres go: "Læs docs/prompt-venus.md og kør V1."
- **Venus står i Solsystemet** mellem Solen og Jorden (halvfærdig, som aftalt): Magellans radarkort med højderne (`klippeplanet.js` som Mars), tonet orange, for radaren ser ikke farver. "Bjergene 10 gange højere" og "Modlys". En kort side, der siger ærligt, at skyerne kommer snart.
- **Venus står, som den gør i dag:** Aksen peger mod IAU's nordpol, drejningen følger IAU's formel, og Solen følger banen. Punktet under Solen passer med JPL Horizons inden for 0,02°. Venus drejer baglæns, og Solen står op i vest (prøv ⏩: et døgn i sekundet).
- **Kortene:** `lav_venus.py` (radar 8k/4k/2k, højder 4k/2k). Ca. 3 % af overfladen mangler (mest ved sydpolen) og er fyldt blødt. Mørke sømme mellem Magellans strimler og et spring på ca. 120 m ved 180° i højderne er rettet.
- **Tests:** `tests/venus.mjs` (26 tjek). Koden står i [kode/venus.md](../kode/venus.md), erfaringerne i [erfaringer/venus.md](../erfaringer/venus.md).
- **Spørgsmål til jer:** Ingen. `darts.isas.jaxa.jp` svarede i dag, så Akatsukis kort kan nok bruges i V2.

**Senest lavet (9. november 2026): Planen for Venus.** Jeres go: "Skriv planen for Venus efter mønstret fra plan-uranus-neptun.md."
- **Planen:** [plan-venus.md](../plan-venus.md) med kilderne (tjekket med curl), to lag (skyerne udenpå og Magellans radarkort med højder indeni), otte signatur-effekter, flybyen med 6 stop, himlen og delopgaverne V1-V5 (V6 er valgfri). Faktagrundlaget med kilder står i [fakta-solsystemet/del7-venus.md](../fakta-solsystemet/del7-venus.md) med 14 fælder.
- **Kilderne:** Magellans kort ligger frit hos USGS (radar 2 km og 225 m pr. pixel, højder 4,6 km). Venera 13's farvepanorama og Parker Solar Probes billeder af natsiden er public domain. Akatsukis kort over skyerne ligger i `darts.isas.jaxa.jp`, som er lukket.
- **Jeres svar (9. november 2026):** "Vi følger dine anbefalinger." Svarene står i planen under "Jeres svar". Prompten er [prompt-venus.md](../prompt-venus.md).
- **Til jer før V2:** Åbn `darts.isas.jaxa.jp` i miljøets Network access (Akatsukis kort over skyerne).

**Senest lavet (8. november 2026): Uranus lukket for nu (bedre kort over planeten og månerne).** Jeres go: "Læs docs/prompt-uranus-kort.md og kør".
- **Månerne:** Kortene er nu JPL's originaler i 1440 × 720 (før Commons' småbilleder i 1280 × 640), hentet som TIF fra NASA 3D Resources på GitHub (Commons svarede stadig 429). Oberon har ikke længere JPEG-blokke. Det er ca. 12 % flere pixel, så forskellen er lille at se.
- **Et skarpere Miranda-kort blev prøvet og givet op:** USGS' mosaik set fra sydpolen (PIA01490) blev lagt præcist på kortet, men JPL's kort havde lige så mange eller flere detaljer. Det er allerede på højde med Voyagers bedste billeder af hele Miranda (ca. 0,5 km pr. pixel mod 560-740 m), så et større kort giver intet.
- **Planeten:** Der findes ikke noget bedre kort med fri licens. Den sydlige halvdel vender væk fra Solen og Jorden (sydpolen er i mørke til jævndøgnet omkring 2049), USGS har kun et malet kort uden fri licens, Kecks og Geminis kort er i infrarødt lys, og jeg fandt ingen fri licens, og Webb er ikke skarpere end Hubble. Hubbles kort og shaderens bånd bliver.
- **Senere:** USGS (Patthoff m.fl.) er ved at lave nye mosaikker og højdekort over de fem måner ud fra Voyagers billeder (GSA 2025). Tjek planetarymaps.usgs.gov, før månerne-runden starter.
- **Spørgsmål til jer:** Ingen.

**Senest lavet (8. november 2026): Uranus og Neptun UN5, flybyerne, stederne og siderne. Serien UN1-UN5 er færdig.** Jeres go: "Go" og anbefalingerne på de tre åbne spørgsmål.
- **Uranus' flyby (5 stop):** Oversigten i dag, "Et år er 84 år" set fra siden, mens skyderen **År** kører tilbage til januar 1986, Miranda med Voyagers billeder i sollys, de mørke ringe (med epsilon-ringen foran Uranus, prøv "Infrarødt") og "I Uranus' skygge", hvor støvet lyser. Skyderen står på 1986 bagefter.
- **Neptuns flyby (4 stop):** Oversigten, de hurtigste vinde, Den Store Mørke Plet i formiddagssol ("Neptun i 1989" slås til) og ringbuerne i modlys. Neptun har fået **"Infrarødt (som JWST)"**.
- **"Steder" i træet:** Uranus' nordpol og ringe, Neptuns plet og ringbuer, hver med sin egen side. **Nye emner** (opdagelserne, farven, hvorfor Uranus ligger på siden, Neptuns vinde, Triton), to "Hvorfor?"-kort og "isgigant" og "ringbue" i Ordbogen. Alt faktatjekket. **Rettet:** "Ringene kaster 1,5 % af lyset tilbage" er nu "højst ca. 2 %" (samme fælde som ved Ariel).
- **Spørgsmål til jer:** Ingen nye. Triton og Neptuns gejsere (UN6) venter til månerne-runden, som I har besluttet.

**Senest lavet (8. november 2026): Uranus og Neptun UN4, Uranus' måner.** Jeres go: "start un4".
- **De fem store måner** (Miranda, Ariel, Umbriel, Titania og Oberon) med Voyager 2's kort (Caltech/JPL/USGS, public domain, fundet på Wikimedia Commons, som nu er åben). Voyager så kun den sydlige halvdel, så den nordlige er en blød, grå flade ("aldrig fotograferet tæt på"). Den halvdel har sol nu, så træk **År** til 1986 ved en måne: Kameraet følger Solen, og man ser Voyagers billeder.
- **Banerne** (NSSDC) i Uranus' ækvatorplan som en skydeskive, den rigtige vej (med uret om IAU's nordpol, som Uranus drejer), Miranda hælder 4,3°, alle vender samme side mod Uranus. Den rigtige størrelse ved en måne, større langt væk. Skygger begge veje, navne, tryk på en måne og "Måner" i træet med sider (faktatjekket, 14 påstande).
- **"Små måner":** Cressida, Desdemona, Cupid og Belinda som små, grå klumper (formen tegnet, 5 gange lysere end de er). Cressida indhenter Desdemona ca. hver 22. døgn (⏩).
- **Spørgsmål til jer:** (1) Ved et besøg i 2026 er månen en grå kugle, for den side, der har sol nu, er aldrig fotograferet. Skal besøget i stedet starte i 1986 (så man ser Voyagers billeder med det samme), eller skal det blive ved den ærlige grå og "Træk År til 1986"? Anbefaling: lad det være, og lad flybyen (UN5) vise en måne i 1986. (2) Spørgsmålene fra UN3 (Uranus i "Voyagers farver" og "Infrarødt" ved Neptun) og UN2 (kameraet ved skyderen) står stadig.

**Senest lavet (8. november 2026): Uranus og Neptun UN3, Neptuns vejr og ringbuer.** Jeres go: "start un3".
- **Høje, hvide skyer** af metan-is i bånd ved de breddegrader, Voyager så dem. De kaster blålige skygger ca. 50 km under sig (som på Voyagers foto), som ses tæt på ved grænsen mellem dag og nat. Skyerne er tegnet, og der er få i 2025 (de forsvandt næsten i 2019).
- **Kontakten "Neptun i 1989":** Den Store Mørke Plet (22° S, 13.000 km lang, med den lyse sky ved kanten), Scooter og den lille mørke plet D2 ved de rigtige breddegrader og med Voyagers målte omgange, så de driver fra hinanden. Flere skyer og buerne, som de var i 1989.
- **"Voyagers farver (1989)"** (dybblå, målt på Solar System Scopes kort) og **"Vindene"** (pile). **Ringene:** fem tynde, støvede ringe, usynlige forfra og synlige i modlys, med de fem buer i Adams-ringen, der kredser på 10,5 timer. Tre nye emner på Neptuns side (faktatjekket).
- **Spørgsmål til jer:** (1) Skal Uranus også have "Voyagers farver (1986)"? Anbefaling: nej, for Voyagers billeder af Uranus var tæt på de ægte farver (tjekkes, før det skrives). (2) Webb tog også et berømt billede af Neptuns ringe i infrarødt lys. Skal Neptun have "Infrarødt (som JWST)" som Uranus? Anbefaling: ja, det er lille, og det kan komme med i UN5. (3) Spørgsmålet fra UN2 om kameraet ved skyderen "År" står stadig (anbefaling: lad det være, og vis det fra siden i flybyen).

**Senest lavet (8. november 2026): Uranus og Neptun UN2, Uranus' årstider og ringe.** Jeres go: "Go un2".
- **Skyderen "År"** (1986-2070) flytter kun Solen. Solens højde over Uranus passer med Horizons (1986: −82,5°, 2007: 0°, 2026: +74°). **Kappen over polen** er lys, når Solen står højt over den (tegnet).
- **Ringene** (NSSDC): 10 tætte ringe, mørke som kul, så forfra er de næsten usynlige. Støvet mellem dem ses i modlys, og kontakten **"Infrarødt (som JWST)"** gør planeten mørkere og ringene 40 gange lysere. To nye emner på Uranus' side (årene og ringene).
- **Spørgsmål til jer:** Startbilledet er set fra Solens side i 2026. Trækker I skyderen til 1986, står Solen bag Uranus, og man ser natsiden (rigtig fysik). Skal kameraet i stedet stå, så man ser begge poler fra siden, når man bruger skyderen? Anbefaling: Lad det være, og lav flybyens stop 2 ("Et år er 84 år") set fra siden i UN5.

**Senest lavet (8. november 2026): Uranus og Neptun UN1, kloderne og skelettet.** Jeres go: "go, og ja til emSign".
- **Begge kloder står i Solsystemet efter Saturn** (🩵 Uranus og 🔵 Neptun) med Hubbles kort fra 2025: båndene i de ægte farver (lyst grønlig blå, Neptun lidt mere blå) og et svagt lag med de største pletter. Uranus' sydlige halvdel er fra Hubble i 2014, og længst mod syd er nordpolen spejlet (sydpolen har været i mørke siden 2007). Det står i "Ærligt talt".
- **Aksen og Solen er rigtige for dagens dato:** Polens retning (NSSDC) og banen (JPL) giver Solens bredde inden for 0,05° af Horizons, så Uranus' nordpol har sol nu. Uranus drejer "baglæns", Neptun den almindelige vej. Vindene blæser med de målte formler, og de står stille i pause.
- **Fælles kode** i `js/solsystem/isgigant.js`, så UN2-UN5 kan bygge videre på begge. Ny test `isgiganter` (38 tjek). Testene `jupiter` og `solsystem` er rettet til syv kloder (to rækker på pc).

**Senest lavet (7. november 2026): Planen for Uranus og Neptun.** Jeres go: "fortsæt".
- **Planen:** [plan-uranus-neptun.md](../../plan-uranus-neptun.md) med kilderne (tjekket med curl), kloderne bygget af målte bånd og vinde, signatur-effekterne, månerne, to flybyer med 4 stop, himlen, tablet og delopgaverne UN1-UN6. **Seks spørgsmål til jer** står i afsnit 8.
- **Faktagrundlaget:** [fakta-solsystemet/del6-uranus-og-neptun.md](../../fakta-solsystemet/del6-uranus-og-neptun.md) (NSSDC, JPL Horizons, OPAL, vindformlerne, Irwin m.fl. 2024 om farverne og ni fælder).
- **Vigtige fund:** Hubbles kort har kun 2 pixel pr. grad, og Uranus-kortet fra 2025 har kun den nordlige halvdel. USGS har ingen globale kort over Uranus' fem måner (Triton findes). Uranus' solhverv er ifølge Horizons i 2030, ikke 2028, som mange skriver.
- **Domæner:** Miljøet var blevet lavet om af Molekyler M2. I åbnede 13 nye (listen står i planen, afsnit 0). `archive.stsci.edu` kræver emSign-roden fra en ældre `certifi` (se erfaringerne).

**Senest lavet (7. november 2026): Tre ønsker fra jer.** Jeres go: "go til det du anbefaler … også go til 8k månekort".
- **Roverens foto er standard i Stå på Mars** (Naukluft og landingsstedet): Det hentes, mens kameraet flyver ned, og tændes, når man er landet (klokken står på fotoets tid). Slår man det fra, huskes det, indtil man forlader Mars. Går klokken (▶, skyderen eller "Solnedgang"), skjules fotoet, for det er taget på ét tidspunkt.
- **Skiftet til Mars var langsomt** (4-5 s uden noget): Det var ikke billederne, men JS, der lavede Mars' fem lokale net og sorterede kuglen om fem gange. Nu ca. 0,6 s i testbrowseren (før 4,4 s). **Rejseskiltet** "Kurs mod Mars" med en raket, der kredser om planeten, vises ved skift af klode, hvis det tager over 0,2 s (`js/rejseskilt.js`).
- **Månens kort i 8k** på pc (6,3 MB, 4k på tablet, før 2k). Kilde: NASA SVS CGI Moon Kit.
- **Tests:** `landskab` tjekker fotoet som standard og rejseskiltet. Fem tests ventede ikke på skiftet af klode (det venter nu ét billede på skiltet) og er rettet. Hele samlingen efter fletningen med `main` (35 tests, 27 min): alle bestod.
