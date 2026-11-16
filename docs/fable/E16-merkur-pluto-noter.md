# Noter til E16: Fables drejebog til Merkur og Pluto

*Skrevet 16. november 2026 af Opus efter [prompt-fable-merkur-pluto.md](../prompt-fable-merkur-pluto.md). Fables drejebog er [drejebog-merkur-pluto.md](../drejebog-merkur-pluto.md), og faktagrundlaget er [del 8](../fakta-solsystemet/del8-merkur-og-pluto.md). Drejebogen er ikke skrevet om. Jeres svar står i dens afsnit 5, og det, der skal ændres, står i "Til Opus" og her. Intet er bygget: MP1-MP4 kommer efter Venus V3-V5.*

## De tre ting, drejebogen bad mig tjekke først
Kortene er læst direkte fra USGS (S3-spanden bag `planetarymaps.usgs.gov`) med `rasterio` og `/vsicurl/`: hver 4.-128. række, så der kun blev hentet nogle få hundrede MB. De små billeder ligger ikke i repoet.

1. **Polen.** Dataene er gode: MESSENGER fløj tættest på over den nordlige halvkugle, og Prokofiev og kraterne omkring polen er skarpe i kortet. Problemet er vores kugle. I et kort i bredde og længde ligger pixlerne 14 gange tættere i længden end i bredden ved 85,8° N (1/cos). Set skråt bliver det ca. 28 til 1. Grafikkortet kan højst udligne 8 til 1 (`anisotropi` 8, som Mars), så det vælger et mere sløret niveau i kortets mipmaps: ca. 4 gange grovere end ved ækvator. Prokofiev (112 km) bliver ca. 15 pixel bred i stedet for 60. **Det er nok også grunden til, at Mars' nordpol er uskarp** (M7b-pol). **Forslag:** et lille polkort (2k, polarstereografisk, 70-90° N, ca. 0,8 km pr. pixel), som kuglens shader bruger over ca. 72° N og glider over i det almindelige kort. Det er mindre end M7b-pols nye net med et hul i kuglen, for Merkurs kratere ses fra lang afstand og behøver ikke et finere net. Det kan bruges af Mars bagefter. Måles først i MP1 (Prokofiev med anisotropi 8 og 16). Hjælper 16 nok, er polkortet unødvendigt.
2. **Skyggerne i kortet: BDR vinder, men stregerne skal væk.** Jeg har sammenlignet BDR (lav sol) og LOI (høj sol) over Caloris og over polen.
   - **LOI** ligner en anden planet: lyse stråler og pletter, og Caloris' kant og "Edderkoppen" (Pantheon Fossae) kan næsten ikke ses. Det er netop dem, stop 2 skal vise. Højdekortet (665 m) kan ikke give dem tilbage, for revnerne er smallere end det. LOI har også lapper af firkanter og er støjet ved polerne.
   - **BDR** viser Caloris og Edderkoppen flot, som på alle NASA's billeder. Men over hele kloden har den lodrette striber med forskellig lysstyrke (kampagnerne med forskellig sol), som også ses i overblikkets `merkur-1k.jpg`.
   - **Forslag:** BDR's detaljer med jævn lysstyrke i `lav_merkur.py` (BDR delt med en kraftig udjævning af sig selv på ca. 100 km og ganget med en udjævning af LOI). Ved hvert stop står vores sol fra samme side som i fotoet, så skyggerne ikke går imod hinanden.
3. **Evig skygge: kommer gratis fra kortet.** Klippeplaneten regner kun lys efter hældningen. Den kaster ingen skygger. Mars' skygger (`landskab.js`, et skyggekort pr. lag) hører til Stå på Mars' flade landskab, ikke til kuglen. En flad kraterbund ved Prokofiev ville få ca. 7 % lys af os (Solen højst ca. 4° oppe). Men i begge kort er bunden af kraterne ved polen sort, fordi de aldrig er blevet fotograferet i sol, og de skygger er de rigtige, for de er der altid. **Ingen ny skyggekode.** Kortet og kontakten "Isen (set med radar)" bærer stoppet.

## Andre ting, jeg har tjekket efter
- **Kortenes længde 0° (del 8, afsnit 9, punkt 5): ikke ens.** Billedkortene for Merkur (BDR og LOI) og Charon har 0° i midten. **Merkurs højdekort og Plutos to kort har 180° i midten.** Alle tæller mod øst (Caloris ligger ved 162° Ø i BDR, og Prokofiev står, hvor den skal, ved polen). `lav_merkur.py` skal derfor rulle højdekortet en halv omgang, ellers ligger bjergene og billedet 180° fra hinanden. Filerne regner med radius 2.439,4 km (NSSDC 2.439,7).
- **Plutos hjerte ligger ved 180°.** Rulles Plutos kort, så 0° står i midten (som `pluto-1k.jpg` og de andre planeter), ligger hjertet og bjergene lige på kortets kant. Lokale net kan ikke gå hen over kanten (`boks` og `huller` i `klippeplanet.js` regner med (længde + 180°)/360 uden omløb). **Forslag:** Pluto beholder 180° i midten, som kilden, og `lavKlippeplanet` og `lokalt` får en parameter med kortets midte.
- **Plutos farvekort** fra Commons er nok meget grovere end gråtonekortet (del 8 nævner 1.280 px). Til kloden kan farverne lægges på det skarpe gråtonekort (300 m), som Mars' farver fra Viking. Hvor stort farvekortet er, og om det er forstærket (afsnit 9, punkt 4), tjekkes i MP3.
- **Tallene i Node:** Solen går baglæns i 8,10 døgn og 1,11° (Keplers ligning med NSSDC's tal). Tyngdepunktet ligger 2.126 km fra Plutos midte, altså 938 km over overfladen. Charon er 3,8° bred på Plutos himmel. Alt som Fable skrev.
- **Ordene:** "Soldøgn", "Sublimation" og "Fælles tyngdepunkt" står ikke i ordbogen, og "Bundet rotation" taler kun om måner. Som Fable skrev.
- **Underteksterne tjekket mod del 8:** stort set rigtige. Se rettelserne nedenfor. Mængden af is bruges ikke (*U*), og BepiColombo skrives først, når det er sket.

## Det, der er nyt, og som jeg er enig i
1. **Kernesætning A begge steder:** sol og skygge med isen til sidst, og is som sten og som gletsjer. Begge har noget, man kan se, og et spørgsmål, man kan gætte på.
2. **Flybyen er rundturen, ikke et forløb.** En lille udgave har næsten kun ting at se på, og prøven er fyldt.
3. **Tegningen af Solen, der vender om.** Det er det, man husker om Merkur, og det kan ikke ses fra rummet. Tallene passer.
4. **Pluto og Charon i rigtig skala** og dansen om tyngdepunktet. Det eneste sted i Solsystemet, hvor vi ikke behøver at snyde med afstanden.
5. **Ærligheden om det, ingen har set:** Plutos bagside er uskarp, og det sydligste er aldrig set.
6. **"Hvorfor?" bor ét sted:** Venus forklarer, hvorfor Merkur ikke er varmest, og overblikket, hvorfor Pluto ikke er en planet.
7. **Budgettet** (8 MB på tablet og 12 MB på pc pr. klode) og 4k til Pluto, fordi dataene ikke kan bære mere.

## Hvor jeg er uenig eller vil lægge noget til
1. **Merkur, stop 5:** "Noget i klippen forsvinder ud i rummet" siges, som om man ved det. Del 8 siger, at stoffet ikke kendes. Forslag: "Man tror, at noget i klippen forsvinder ud i rummet i solheden, så jorden synker."
2. **Pluto, stop 4:** "Fra Pluto hænger Charon stille på himlen" gælder kun den ene side. Forslag: "Fra den ene side af Pluto hænger Charon stille på himlen. Fra den anden ser man den aldrig."
3. **Merkur, stop 6:** "under −170 °C" er kun *RS* i del 8 (Paige m.fl. 2013 er ikke læst). Slås op, før det skrives. Ellers: "så koldt, at isen aldrig når at fordampe".
4. **Merkurs tal i panelet:** "Et døgn: 176 jorddøgn" bør sige, hvilket døgn (fælde 3): "Fra solopgang til solopgang: 176 jorddøgn".
5. **Ordet "Soldøgn":** Venus V5 kommer først, så Venus skriver ordet, og Merkur bruger det.
6. **Overblikkets trin 5:** Når Merkur får sit besøg, skal reglen "Merkur får sit besøg senere" (`merkurSenere` i `js/data/forloeb/overblik.js`) også væk, ikke kun linjen i "Besøg en planet" og panelerne.
7. **Polerne er ikke M7b-pols problem alene:** Se tjek 1. Polkortet laves i `klippeplanet.js` i MP1, hvis målingen viser, at det trænger, og Mars får glæde af det.

## Jeres svar (16. november 2026)
Alle fem som anbefalet: Merkurs kernesætning A (sol og skygge), Plutos kernesætning A (is som sten og som gletsjer), kun flybyen (6 og 5 stop), tegningen af Solen, der vender om, og de lyse huller som Merkurs tredje sted. Står også i drejebogens afsnit 5, i [sporets fil](../lige-nu/solsystemet.md) og i [køreplanen](../koereplan.md). Mine tilføjelser ovenfor gælder, medmindre I siger andet.
