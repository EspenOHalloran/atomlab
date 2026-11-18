# Pluto og Charon

## Kortene, Charon, dansen og disen (MP3, 17. november 2026)
- **USGS' Pluto-filer er små nok til at hente helt:** gråtonerne (310 MB), højderne (620 MB) og Charon (81 MB) kom på ca. to minutter fra `asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/`. Læs `Samples`, `Lines` og `StartByte` (tæller fra 1) i etiketten, som ved Merkur.
- **Hold kortets midte, hvor kilden har den:** Plutos kort har 180° i midten, og hjertet ligger ved ca. 180° Ø. I stedet for at rulle kortet fik `lavKlippeplanet` en valgfri `midte`: Kuglen drejes, og kun `højde()` og `lokalt` skal regne længden om. `sted`, `punkt` og `overflade` tager den rigtige længde, så resten af koden ikke mærker noget.
- **Farver på et skarpt kort:** Farvekortet fra Commons kunne ikke hentes (svaret 429), men overblikkets `pluto-1k.jpg` er det samme kort. Farven delt med sin egen lysstyrke og ganget på gråtonerne (300 m) gav et skarpt kort i farver. Tjek, at de to ligger oven i hinanden: Lysstyrken korrelerede 0,976 uden forskydning.
- **Kanten mod det, ingen har set:** Ud over dataene glider kortet over i en mørk farve på ca. 2°, og højderne over i en udjævning af de nærmeste højder, der går mod 0. Så er der ingen trappe ved kanten, og bagsiden er glat.
- **Toppene bliver lavere i små kort:** Tenzing Montes når ca. 3,9 km over kuglen i kilden, men kun få hundrede meter i 2k (3,6 km pr. pixel). Test højderne med det højeste i et lille område og med forskellen til sletten, ikke med kildens tal.
- **Systemets midte er Plutos midte, ikke tyngdepunktet:** Så virker `bund`, kameraets bue og stederne som ved de andre planeter. Dansen ses ved at lade kameraet kigge på tyngdepunktet langt ude (glidende fra 3 til 8 radier). Tæt på kigger det på Plutos midte, ellers ville Pluto glide ud af billedet med ⏩.
- **Charon skal ses ved siden af, ikke bagved:** Med kameraet lige ude bag Charon dækkede Charon Pluto helt. Ca. 16° fra linjen mellem dem står Pluto som en skive ved siden af Charon.
- **Navne med `depthTest: false` skal skjules bag planeten:** Charons navn og tyngdepunktet stod oven på Pluto, når de var bag den. En lille test (rammer linjen fra kameraet Plutos kugle?) løste det.
- **Disen set tæt på:** Hen over kanten kigger man gennem ca. 12 gange så meget dis som lige op (√(2πR/H)). Uden at regne det med blev himlen lys over bjergene. Forfra er disen næsten usynlig, i modlys er den en blå ring.
- **`side()` i testadgangen går ned uden emner:** `sidst` læser `summary` i det sidste element. En side med kun en kort tekst (Charon) gav en fejl i testen. Charons side fik et emne, og det var også bedre for siden.
- **Testbrowseren tegner få billeder:** Efter `hop()` er fokus regnet med den gamle afstand i ét billede. Vent med `waitForFunction`, til fokus er på plads, i stedet for en fast pause.

## MP4: det lokale net, stederne og flybyen (18. november 2026)
- **Kun de rækker, der skal bruges, hentes:** USGS' filer er rå rækker efter et hoved, så ét `Range`-kald pr. fil henter et bælte (ca. 51° N til 42° S, 160 + 320 MB på under 10 s). `lav_pluto_steder.py` gør det selv.
- **`Image.fromarray(a, 'F')` kræver float32.** Et float64-array blev læst som noget helt andet (støj og NaN), uden fejl. Kortet så næsten rigtigt ud, men JPEG-filen blev 6,7 MB i stedet for 3,2. Gør altid `.astype(np.float32)`, før et array bliver til et `'F'`-billede, og tjek filstørrelsen.
- **`lokalt` med `midte` virker** (grænserne gives i rigtige længder, og klippeplaneten trækker kortets midte fra). Ét net over både hjertet og bjergene er nemmere end to: Flyvningen mellem stop 2 og 3 skifter ikke net, og der er ingen kant imellem.
- **Nettets farve:** Gråtonerne (300 m) ganget med klodens farve delt med gråtonerne i samme størrelse giver præcis klodens lysstyrke (forholdet 1,00), så kanten mellem nettet og kloden ikke ses.
- **Lyset ved stederne:** Skyggerne i mosaikken kommer fra nordvest (New Horizons' fotos med Solen over ca. 128° Ø). Solen står længere mod nord i 2026, så med 128° står den kun ca. 5° over Tenzing Montes. 145° giver ca. 10°, stadig fra nordvest. Kameraet ved bjergene kigger fra syd, ca. 26° ned, så sletten ligger bagved. Lavere (14-18°) blev det for mørkt og rodet.
- **Testen af højderne:** Den højeste top i nettet ligger ved ca. 16,6° S, 175,7° Ø, ikke ved navnelistens midte (15,6° S, 177,4° Ø). Søg efter toppen i et lidt større område.
- **Stop 1 med både Pluto og Charon:** Hjertet vender næsten præcis væk fra Charon, så set fra hjertets side står Charon bag Pluto. Kameraet står 55° fra linjen gennem dem og kigger midt imellem.
