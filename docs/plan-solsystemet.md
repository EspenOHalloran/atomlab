# Plan: Solsystemet (ny del) med Rumrejsen (Voyager-spillet)

*Foreløbig plan, oktober 2026. Gennemgået af Opus med høj effort den 23. oktober 2026 (trin 0, se "Gennemgang af planen" nederst), fordi Fable venter på version 5.5. Tallene står med kilder i [fakta-solsystemet.md](fakta-solsystemet.md). Punkter mærket **(foreslået)** er mine anbefalinger, som vi afklarer ét spørgsmål ad gangen. Alle tal og datoer skal faktatjekkes, før de bruges (se "Faktagrundlag" nederst).*

## Hvad det går ud på
En ny del i menuen, hvor man kan udforske Solen, planeterne og deres måner i 3D, og et spil, hvor man selv sender en sonde ud i solsystemet og bruger planeternes tyngdekraft til at få fart på, ligesom Voyager.

Der er tre ting, delen skal kunne:
1. **Udforske:** Flyv hen til hver planet og hver vigtig måne. Se, hvordan de ser ud (rigtige billeder), og læs kort, hvad der er særligt ved dem.
2. **Liv i solsystemet?** Et tema om de steder, hvor der måske er betingelser for liv: Europa, Enceladus, Titan, Ganymedes og Mars. Hvad kræver liv, hvad har man fundet, og hvilke rumsonder er på vej?
3. **Rumrejsen:** Voyager-spillet med missioner og et frit rum (se nedenfor).

Jeres svar indtil nu:
- Det skal være en **egen del** (et nyt kort i menuen).
- Der skal bruges **rigtige billeder** af planeter og måner.
- Spillet skal have **både missioner og et frit rum**. Anbefalingen står i afsnittet om Rumrejsen.
- Visningen **"Set fra Jupiter" og "Set fra Solen"** skal være med.

## 1. Udforsk solsystemet
**Overblikket**
- Solen, de otte planeter og deres baner med den rigtige hældning og det rigtige tempo. Planeterne står, hvor de står i dag.
- Med en tidsskyder kan man spole frem og tilbage.
- Asteroidebæltet og Kuiperbæltet er svage bånd af prikker. Pluto er med som dværgplanet **(foreslået)**.
- To slags skala: "Forstørret", så man kan se planeterne, og **"Rigtig størrelse og afstand"**, så man kan se, hvor tomt rummet er. Begge er ærlige om, hvad de snyder med.

**En planet tæt på**
- Kameraet flyver ind til planeten, der drejer med sit rigtige døgn og sin rigtige hældning, og dens måner kredser omkring den.
- Panelet viser nøgletal: størrelse, afstand til Solen, døgn, år, temperatur og antal måner. Desuden "Kort fortalt", "For nørder" med "Ærligt talt", og et citat (et nyt, der ikke er brugt før).
- **Månerne (foreslået):**
  - Jorden: Månen
  - Mars: Phobos og Deimos
  - Jupiter: Io, Europa, Ganymedes og Callisto
  - Saturn: Titan, Enceladus, Mimas og Iapetus
  - Uranus: Miranda
  - Neptun: Triton
  - Pluto: Charon

  De andre måner er små prikker med et tal og en dato, for tallet ændrer sig hele tiden ("Saturn har over 280 kendte måner (marts 2026)").

**Himlen (besluttet 24. oktober 2026)**
- Himlen er sort med stjerner (ingen farvede tågeskyer). Solen er en lille, skarp prik med lidt glød i den retning, lyset kommer fra. Fra Saturn ser Solen ca. 9½ gange mindre ud end fra Jorden og giver ca. 1/90 så meget lys, men den er stadig blændende.
- **Planeterne på himlen** (fx Jupiter og Jorden set fra Saturn) kommer med, når overblikket regner planeternes pladser ud efter datoen (trin 2). Fra en anden planet er de kun prikker som stjerner, så de skal have et navn.
- **Idé:** knappen "Find Jorden" ved Saturn, som Cassinis billede fra 19. juli 2013, hvor Jorden er en lille prik under ringene.
- **Flyby** (jeres idé, prototypen 24. oktober 2026): en guidet tur forbi planeten, ringene og månerne med stop, en kort tekst og "Næste" ved hvert. Kameraet flyver i den rigtige skala (`js/solsystem/rejse.js`), så den kan genbruges ved alle planeter.

**Tværsnit**
- Knappen "Skær igennem" viser lagene indeni:
  - **Jorden:** jernkerne, kappe og skorpe
  - **Europa:** jernkerne, sten, et hav af saltvand og en isskal på ca. 15-30 km eller mere (Juno målte ca. 29 km i ét område)
  - **Enceladus:** stenkerne, hav og is med revner ved sydpolen
  - **Titan:** søer af metan på overfladen og dybt inde enten et hav af vand eller sjap med lommer af vand. Det er omstridt siden en ny analyse i december 2025, så tværsnittet skal vise begge og sige det ærligt.
  - **Ganymedes:** flere lag

## 2. Liv i solsystemet?
En lille tur trin for trin, ligesom "Næste" i Kosmos.
- **Hvad kræver liv?** Flydende vand, energi (fra Solen eller fra varmen indefra) og de rigtige grundstoffer: carbon, hydrogen, nitrogen, oxygen, fosfor og svovl. Her kommer et link til Det periodiske system.
- **Europa:** Et hav under isen med ca. dobbelt så meget vand som alle Jordens have (et skøn). Jupiters tyngdekraft ælter månen, så den holdes varm. Europa Clipper er på vej.
- **Enceladus:** Fontæner af vand fra sydpolen. Cassini fløj gennem dem og fandt salt, organiske stoffer og fosfat.
  - Grafikken skal vise fontænerne i modlys fra Solen. Det er et af de flotteste syn i solsystemet.
- **Titan:** Den eneste måne med en tyk atmosfære og det eneste andet sted med søer på overfladen, men de er af metan. Huygens landede i 2005, og Dragonfly skal sendes op tidligst i juli 2028 og nå frem i 2034.
- **Ganymedes:** et hav dybt inde, og den eneste måne med sit eget magnetfelt. JUICE er på vej.
- **Mars:** Der var engang søer og floder. Perseverance har fundet de mærkelige "leopardpletter" i klippen Cheyava Falls. Her kommer et link til den kommende del "Liv".
- **Ærligt talt:** Man har ikke fundet liv noget sted uden for Jorden. Men det er stederne, hvor man leder.

## 3. Rumrejsen (Voyager-spillet)
**Anbefaling: Begge dele, men i rækkefølge.**
- **Missionerne** lærer én ting ad gangen og giver 1-3 stjerner.
- **Frit rum** åbner efter de to første missioner. Her kan man selv vælge dato, retning og fart og prøve alt det, man vil.
- Missionerne gør det sjovt at lære, og det frie rum belønner nysgerrighed.

**Missionerne (foreslået):**
1. **Nå Jupiter.** Lær at sigte. Linjen viser, hvor sonden flyver.
2. **Få fart på ved Jupiter.** Se farten før og efter, og knappen "Set fra Jupiter / Set fra Solen" viser hvorfor (pile, der lægges sammen).
3. **Voyager 2's store tur fra 1977.** Planeterne står rigtigt, og man prøver den rigtige rute forbi Jupiter, Saturn, Uranus og Neptun. Den rigtige Voyager-rute kan vises som et spøgelse.
4. **Brems ved Venus og nå Merkur.** Slyngen kan også bremse, sådan som rigtige sonder til Merkur gør.
5. **Ud af solsystemet med mindst muligt brændstof.**

Til slut kommer **"Den lyseblå prik"**: Sonden vender sig om, og Jorden er en lille prik, ligesom Voyager 1's billede fra 1990. Det skal have et citat, hvis ordlyden kan bekræftes.

**Spillets fysik:**
- Rigtig tyngdekraft fra Solen og planeterne. Planeterne følger deres rigtige baner (baneelementer fra JPL).
- Sonden regnes i små skridt, og skridtene er mindre tæt på planeterne.
- Den stiplede linje regner et stykke frem hvert øjeblik.

**Tiden:**
- Tiden går automatisk hurtigt mellem planeterne og langsomt tæt på dem.
- Nærbilledet har den rigtige skala, så sonden ikke ser ud til at flyve gennem en forstørret planet. Det er samme idé som i Formørkelser.

**Grafen:** Sondens fart, der hopper ved hver planet. Den rigtige Voyager 2-kurve vises svagt bagved.

**Sonden og kameraet:** En Voyager-sonde af simple former, som er til at kende (parabolen og de lange arme). Når sonden nærmer sig en planet, glider kameraet ind bag den som i en film. Tiden går langsomt, planeten fylder billedet, banen bøjer, og så trækker kameraet sig tilbage. Det er her, wow-øjeblikket er.

**Lyd:** Web Audio som i resten af AtomLab, fx et sus ved forbiflyvningen og en tone, der stiger med farten.

**I Kosmos (foreslået):** et kort fænomen om tyngdekraftens slynge, der linker til Rumrejsen.

## 4. Grafik på øverste hylde
I vil gerne bruge ekstra ressourcer her, så planen sigter højt. Alt skal stadig virke på en tablet (`LAV_KVALITET` skruer ned).

- **Rigtige billeder:** globale kort over planeter og måner fra NASA, JPL og USGS. De er offentligt ejede (public domain).
  - Planetkort fra fx Solar System Scope må bruges med kildeangivelse (CC BY 4.0). Hver licens skal tjekkes.
  - 2k-billeder som standard og 4k på pc, når man er tæt på. De hentes først, når man flyver derhen. Overblikket bruger små udgaver.
- **Atmosfærer med lysspredning** (en shader):
  - Jordens blå kant
  - Venus' gule skyer
  - Mars' tynde lyserøde himmel
  - **Titans orange dis**, der også skal kunne ses som en ring i modlys
- **Jorden:**
  - skyer i et lag for sig
  - byernes lys på natsiden
  - Solens spejling i havet
- **Jupiter:** skybåndene glider forbi hinanden, og Den Store Røde Plet drejer (en lille forvrængning i en shader).
- **Saturn:**
  - ringene med de rigtige mellemrum og gennemsigtighed
  - planeten kaster skygge på ringene, og ringene kaster skygge på planeten
- **Månerne:**
  - højdekort, så kratere og revner får skygger i det skrå lys
  - Io's vulkaner som partikler
  - Enceladus' fontæner i modlys
- **Solen:** den kogende overflade fra Kosmos og et blændende skær.
- **Baggrunden:** Mælkevejen fra NASA's stjernekort, der er public domain.
- **Kameraet:** bløde ture fra planet til planet med en "biograf"-fornemmelse, og navne, der ikke står oven i hinanden.

**Forslag: Start med en lille, færdig bid (en prototype).** Saturn med ringe og skygger, Enceladus med fontæner og Titan med dis, alt i topkvalitet. Så kan I se og mærke, om niveauet er rigtigt, før resten bygges. Det er den bedste måde at bruge de ekstra ressourcer på.

**Jorden og Månen først (lavet i oktober 2026):** Jorden og Månen findes allerede i Årstiderne og Formørkelser. Gør dem flotte først, så I kan se forskellen før og efter. Bagefter bruges den samme teknik (kort, højdekort og atmosfære) til planeterne.
- **Jorden med rigtige billeder fra NASA:**
  - om dagen: Blue Marble (Jorden uden skyer)
  - om natten: byernes lys (Black Marble)
  - skyer i et lag for sig, der kaster en svag skygge
  - et højdekort, så bjergene får relief
  - **årstider:** 4 måneder af Blue Marble (januar, april, juli og oktober), der glider over i hinanden efter datoen. Så kommer sneen om vinteren, og Jorden bliver grøn om sommeren. 12 måneder er lidt flottere, men tager længere tid at hente.
  - Solen glimter i havet, en blå atmosfære ses i kanten, og der er et rødligt bånd ved solnedgangen langs grænsen mellem dag og nat.
  - Formørkelsernes skygger beholdes med den samme udregning som nu (`js/data/skygge.js` og GLSL i `js/kosmos/jorden.js`).
- **Månen:** et rigtigt kort fra NASA's Lunar Reconnaissance Orbiter (CGI Moon Kit) med kratere og et højdekort.
- **Opløsning:** 4096 × 2048 på pc og 2048 × 1024 på tablet og telefon (`LAV_KVALITET`). Ikke 8k, for så fylder ét billede ca. 130 MB i grafikkortet. Det kan tablets ikke klare, og forskellen ses næsten ikke på en klode, der kun fylder en del af skærmen.
- **Hentetid:** skønnet 10-15 MB i alt. En lille udgave vises først, mens de store bliver hentet.
- **Ærligt:** I Formørkelser er Jorden lille i de fleste trin, så forskellen ses mest i nærbillederne og i Årstiderne.

## 5. Teknik
- **Ny skærm `#solsystem`:**
  - `js/solsystem.js`: overblikket, tæt på, panelet og turen "Liv i solsystemet?"
  - `js/rumrejse.js`: spillet
- **Data:**
  - `js/data/planeter.js`: fysiske data og baneelementer
  - `js/data/maaner.js`
  - `js/data/missioner.js`
- **Grafik i `js/solsystem/`:**
  - `planet.js`: kugle, kort, højdekort og atmosfære
  - `ringe.js`
  - `atmosfaere.js`
  - `fontaener.js`
  - `tvaersnit.js`
- **Billeder:** De ligger i `billeder/solsystem/` med en fil, `KILDER.md`, der siger, hvor hvert billede kommer fra, og hvilken licens det har. Hjælpen får et afsnit om kilderne.
- **Hentning af billederne:** NASA's servere er blokeret i Claude-miljøet (proxyen svarer 403). GitHub og npm virker.
  - Tilføj `eoimages.gsfc.nasa.gov`, `svs.gsfc.nasa.gov` og `visibleearth.nasa.gov` under miljøets menu → Edit → Network access ([vejledning](https://code.claude.com/docs/en/cloud-environments#network-access)). Det virker måske først i en ny session.
  - Nødløsning, som ikke anbefales: npm-pakken `three-globe` har Jorden i 4k (dag, nat og skyer). Billederne ligner Blue Marble, men det kan ikke bekræftes, hvor de kommer fra, og der er ingen billeder for hver måned.
- **Ingen byggetrin.** Three.js-addons kopieres som nu.
  - Komprimerede teksturer (KTX2) kan overvejes til tablets. Det kræver addon-filen og en transcoder, men intet byggetrin.
- **Tests:**
  - planeternes pladser mod JPL Horizons på kendte datoer, inden for ca. 1°
  - at energien er bevaret i spillets fysik
  - at farten ved Jupiter stiger, som den skal
  - skærmbilleder på pc, tablet og telefon
  - tid til at hente billederne på en langsom forbindelse

## 6. Trin (hvert trin får et go)
| Trin | Hvad | Hvem |
|---|---|---|
| 0 | ✅ Gennemgang af planen og et faktagrundlag med kilder ([fakta-solsystemet.md](fakta-solsystemet.md)). Lavet af Opus 23. oktober 2026, fordi Fable venter (se "Gennemgang af planen" nederst). Del 2 om Voyager skal tjekkes, før Rumrejsen bygges. | Opus |
| 1a | ✅ **Jorden og Månen** i topkvalitet i Årstiderne og Formørkelser (lavet i oktober 2026, Trin 17 i DESIGN.md). Teknikken (`js/kosmos/jorden.js`, `lav_billeder.py` og `tests/vaerktoejer/kloder.html`) kan genbruges til planeterne. | Opus |
| 1b | ✅ **Prototype**: Saturn, Enceladus og Titan (lavet 23. oktober 2026). Ses i Kosmos som "Saturn" efter Solstorm (fra 24. oktober 2026 i den almindelige udgave, før kun med `?saturn` i adressen). Grafikken ligger i `js/solsystem/` (ringe, planet, fontæner og dis), så Solsystemet kan genbruge den. Siden 24. oktober 2026 med rigtige billeder: Saturn og ringenes farver fra Solar System Scope (CC BY 4.0), de seks store måner fra Cassini via USGS (`billeder/solsystem/lav_saturn.py`). Samme dag: alt i den rigtige skala, en flyby med ni stop og sort himmel med Solen som en lille prik. | Opus |
| 1c | **Mars** med Phobos og Deimos og en flyby, der også besøger steder på overfladen. Otte delopgaver med et go mellem hver, se [plan-mars.md](plan-mars.md). M1 (planen og faktagrundlaget) er lavet 24. oktober 2026. | Opus |
| 2 | Skærmen og overblikket: Solen, planeterne, rigtige baner, tidsskyder og panelet | Opus |
| 3 | Alle planeter og månerne med billeder, tværsnit og grafik | Opus |
| 4 | "Liv i solsystemet?" (tekster faktatjekkes) | Opus + faktatjek |
| 5 | Rumrejsen: fysik, banelinje, mission 1-2, "Set fra Jupiter/Solen" | Opus |
| 6 | Mission 3-5, frit rum, fartgraf, "Den lyseblå prik" | Opus |
| 7 | Samlet gennemgang: test, faktatjek og eftersyn | Fable + Opus |

Det er en stor del, større end Stjerneovnen, og den vil fylde flere arbejdsdage. Trin 1a og 1b er de vigtigste at få rigtigt, for de sætter niveauet.

## 7. Åbne spørgsmål (vi tager dem ét ad gangen)
**Svar (23. oktober 2026):** Spørgsmål 1-5 følger forslagene i planen, indtil I siger andet: månerne i afsnit 1, 4096 × 2048 på pc og 2048 × 1024 på tablet og telefon, Pluto med som dværgplanet, navnene "Solsystemet" og "Rumrejsen", og turen "Liv i solsystemet?" linker til delen Liv, når den kommer. Opus laver trin 0 og prototypen (trin 1b) og stopper derefter, så I kan se dem.

1. Hvilke måner skal med fra start? (forslag ovenfor)
2. Hvor store billeder: 2k som standard og 4k på pc? Hvor meget må delen fylde at hente? Mit forslag: 4096 × 2048 på pc og halvdelen på tablet og telefon, ikke 8k.
3. Skal Pluto og dværgplaneterne med?
4. Hvad skal delen hedde i menuen ("Solsystemet") og spillet ("Rumrejsen")?
5. Skal turen "Liv i solsystemet?" senere kobles sammen med den planlagte del "Liv"?
6. Skal Fable lave trin 0 nu (kræver credits), eller venter vi? Svar (oktober 2026): Ingen credits lige nu, men måske senere. Kommer der ikke credits, laver Opus trin 0 med friske øjne og høj effort. Mit forslag: Vent ikke på en nyere model. Der vides intet om, om eller hvornår der kommer en Fable 5.5. Fable koster ca. 2,5 gange så meget som Opus, så credits skal bruges, hvor forskellen er størst: trin 0 (planen og faktagrundlaget) og trin 7 (eftersynet). Uden credits laver Opus trin 0 med friske øjne og høj effort. Det er en god plan B, men Fable ville nok fange lidt mere. Opdateret 21. oktober 2026: Nu er der en samlet plan for Fable ([plan-fable.md](plan-fable.md)). Opus laver udkastet til faktagrundlaget, og Fable gennemgår planen og tjekker faktagrundlaget. Rækkefølgen afgøres efter Fables overblik (F1).
7. ~~Skal Jorden og Månen gøres flotte først (trin 1a)?~~ Ja, det er lavet. NASA's servere er tilladt.

## Faktagrundlag (skal tjekkes og skrives med kilder i `docs/fakta-solsystemet.md`)
- **Planeterne og månerne:** fysiske tal og baneelementer (JPL Horizons og NASA Planetary Fact Sheets).
- **Europa:** isskalens tykkelse, havets dybde og mængden af vand i forhold til Jordens have. Europa Clipper: opsendelse og ankomst.
- **Enceladus:**
  - fontænerne (opdaget 2005)
  - stofferne Cassini fandt (salt, kiselsyre, organiske stoffer og fosfat i 2023)
  - Cassinis afslutning i 2017
- **Titan:** atmosfærens tryk, søerne af metan og ethan, Huygens' landing 14. januar 2005, Dragonflys tidsplan.
- **Ganymedes:** havet og magnetfeltet, og JUICE' tidsplan.
- **Mars:** Cheyava Falls og "leopardpletterne" (hvad der er fundet, og hvad der ikke er bevist).
- **Voyager 1 og 2:**
  - opsendelser 1977 og forbiflyvninger (Jupiter 1979, Saturn 1980-81, Uranus 1986 og Neptun 1989)
  - "Den lyseblå prik" (14. februar 1990)
  - 1 lysdøgn den 18. november 2026
  - hvor tit planeterne står, så den store tur kan lade sig gøre
- **Slyngfysikken:** typiske fartændringer ved Jupiter, hvorfor planeten bremses en lille smule, og hvorfor sonder til Merkur bremser ved Venus.
- **Billedlicenser:** NASA (fx Blue Marble, Black Marble og CGI Moon Kit), USGS, JPL, Solar System Scope og andre.

## Gennemgang af planen (trin 0, 23. oktober 2026)
*Opus med høj effort, i stedet for Fable. Faktagrundlaget står i [fakta-solsystemet.md](fakta-solsystemet.md). Del 2 om Voyager og slyngen er kun skrevet ud fra hukommelsen, fordi grænsen for websøgninger var nået. Den skal tjekkes, før Rumrejsen bygges.*

**Planen holder.** Rækkefølgen (prototype, overblik, planeterne, "Liv i solsystemet?" og til sidst Rumrejsen) er rigtig, og den sætter grafikken først, hvor I vil bruge flest kræfter. Det, der skal rettes eller tilføjes:

**Fakta, der har ændret sig** (rettet ovenfor):
- **Titans hav dybt inde er omstridt** siden december 2025 (Petricca m.fl., Nature). Måske er det sjap med lommer af vand. Tværsnittet og teksten skal vise begge muligheder.
- **Europas isskal** er måske tykkere end 15-25 km. Juno målte ca. 29 km i ét område i 2025.
- **Dragonfly** sendes op tidligst i juli 2028 og når frem i 2034. Europa Clipper når Jupiter 11. april 2030, og JUICE når frem i juli 2031.
- **Antallet af måner** ændrer sig hele tiden. Saturn havde ca. 285 i marts 2026. Skriv altid datoen.
- **Fælder**, som teksterne skal undgå, står i faktagrundlaget. Fx flyder Saturn ikke i et badekar, ringene er typisk ca. 10 m tykke og ikke 1 km, Enceladus kaster ca. 80 % af lyset tilbage (ikke "over 100 %"), og Cassini fandt ingredienser til liv på Enceladus, ikke liv.

**Teknik, der mangler i planen:**
1. **Store afstande i 3D:** Grafikkortet regner med 32-bit tal. Med rigtige afstande (Neptun er 4,5 milliarder km fra Solen) og små måner (Enceladus har en radius på 252 km) begynder billedet at ryste. Løsningen er en **flydende nulpunkt** (kameraet står altid ved nulpunktet, og verden flyttes) og `logarithmicDepthBuffer` eller to kameraer (fjernt og nært). Det skal med fra trin 2.
2. **Skygger regnes i shaderen**, ligesom formørkelsernes skygger i `js/kosmos/jorden.js`, og ikke med skyggekort. For hvert punkt på Saturn findes stedet, hvor strålen mod Solen rammer ringenes plan, og ringbilledet slås op dér. For hvert punkt på ringene tjekkes det, om strålen rammer Saturn (en fladtrykt kugle). Det er skarpt, præcist og billigt på en tablet.
3. **Ringene set bagfra:** Det fine støv i C-ringen, Cassini-delingen og F-, G- og E-ringen lyser i modlys, mens de tætte A- og B-ringe bliver mørke. Shaderen skal derfor vide, hvilken side Solen står på, og hvor tæt ringen er. Ringbilledet fra Solar System Scope har kun farve og gennemsigtighed. Senere kan gennemsigtigheden regnes ud fra Cassinis målinger (PDS Ring-Moon Systems Node), som er public domain.
4. **Rumrejsen og banerne:** Standish' baneelementer kan være over 1 million km forkerte for Saturn. Det er meget mere end Voyagers forbiflyvninger (fx ca. 5.000 km over Neptuns skyer). Den rigtige Voyager-rute skal derfor hentes fra JPL Horizons som en datafil ("spøgelset"), og spillet skal sigte i forhold til planeten og ikke prøve at regne den rigtige rute frem.
5. **Lagene:** Panelet skal følge [plan-lag.md](plan-lag.md) fra starten (én linje fremme, "Hvorfor?" og "For nørder"), så delen ikke får for meget tekst på én gang.

**Billederne:**
- **Saturn og ringene:** Solar System Scope (CC BY 4.0) ligger på Wikimedia Commons, og den adresse kan hentes i miljøet. De skal krediteres i `LICENSE` og "Om AtomLab".
- **Enceladus og Titan:** USGS' mosaikker fra Cassini (public domain). `planetarymaps.usgs.gov` sender videre til `asc-pds-services.s3.us-west-2.amazonaws.com`, hvor filerne ligger (listen kan hentes med `?list-type=2&prefix=mosaic/`). Tilladt og hentet 24. oktober 2026.

**Skønnet:** Delen er stadig stor, og trin 2 og 5 er de sværeste. Prototypen viser, om grafikken holder på tabletten, før de bygges.

