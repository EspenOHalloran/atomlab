# Drejebog: Merkur og Pluto i en lille udgave (E16)

*Skrevet 15.-16. november 2026 af Fable (høj effort) efter [prompt-fable-merkur-pluto.md](prompt-fable-merkur-pluto.md) og skemaet i [skabelonen](fable/E3-forloeb.md). Hører til sporet [Solsystemet og Kosmos](lige-nu/solsystemet.md), nr. 13 i [køreplanen](koereplan.md). Fakta og kilder står i [fakta-solsystemet/del8-merkur-og-pluto.md](fakta-solsystemet/del8-merkur-og-pluto.md). Opus' noter står i [fable/E16-merkur-pluto-noter.md](fable/E16-merkur-pluto-noter.md), og jeres svar (16. november 2026) står i afsnit 5. Intet er bygget.*

## Kort fortalt
- **Merkur handler om sol og skygge.** Der er ingen luft til at flytte varmen, så der er over 400 °C i solen og is i kraterne ved polerne. Rundturen slutter ved isen.
- **Pluto handler om is, der opfører sig som sten og som hav.** Bjergene er vandis, og sletten i hjertet er frossent kvælstof, der langsomt rører rundt. Rundturen slutter med den blå ring i modlys, som New Horizons så.
- **Flybyen er rundturen.** Jeg fraråder et forløb med Forløb-klodsen her (afsnit 3).
- **Næsten alt findes:** `klippeplanet.js`, `maane.js`, `atmosfaere.js`, `navne.js`, `rejse.js`, `flyby.js` og Styr-boksens kontakter. Nyt er to billedværktøjer, en lille tegning af Solen på Merkurs himmel, et lille kort over radarens is og Plutos og Charons dans om deres fælles tyngdepunkt.
- **To ting haster ikke, men skal huskes:** BepiColombo går efter planen i bane om Merkur 21. november 2026 (teksten skrives med dato og tjekkes igen), og polerne er klippeplanetens svage sted (samme problem som Mars' nordpol, M7b-pol).

## 1. Kernesætningerne
*Efter fem minutter kan brugeren sige:*

**Merkur**
- **A (min anbefaling):** "Merkur har næsten ingen luft. Derfor er der over 400 grader i solen og iskoldt i skyggen, og i kraterne ved polerne ligger der is, selv om Merkur er planeten nærmest Solen."
- **B:** "På Merkur varer en dag to år: Den drejer tre gange, mens den går to gange rundt om Solen, og nogle steder står Solen op, vender om og står op igen."
- **C:** "Merkur er en jernkugle med en tynd skal af sten, og den er skrumpet, så skallen har slået folder."

Hvorfor A: Den har et spørgsmål, man kan gætte på ("Hvor leder du efter is på planeten nærmest Solen?"), den forklarer det, man ser (skarpe skygger, sort himmel, kratere overalt), og den bruger tre af de fire steder. B er den sjoveste enkeltting, men den er en mekanisme. Den får et stop i flybyen og et "Hvorfor?"-kort. C kan ikke ses på kloden og bor i et spørgsmål i panelet.

**Pluto**
- **A (min anbefaling):** "På Pluto er der så koldt, at vandis er hård som sten og danner bjerge, og kvælstof, som vi indånder, ligger som en gletsjer, der stadig bevæger sig. Pluto er lille, men ikke død."
- **B:** "Pluto og Charon er en dobbeltklode: De vender altid samme side mod hinanden og kredser om et punkt imellem sig."
- **C:** "Pluto blev ikke mindre i 2006. Den blev den første af en ny slags: dværgplaneterne i Kuiperbæltet."

Hvorfor A: Det var den store overraskelse i 2015, og man kan se den: en slette uden kratere ved siden af bjerge. B får et stop og et spørgsmål. C står allerede i overblikket ("Hvorfor er Pluto ikke en planet længere?"), og hver oplysning bor ét sted, så Pluto linker dertil.

## 2. Den lille udgave

### Merkur
**Træet:** `▶ Flyby · 6 stop` · Merkur · **Steder:** Caloris · De lyse huller (Raditladi) · Is ved Nordpolen (Prokofiev).

| Sted | Hvor | Hvad man ser | Kræver |
|---|---|---|---|
| Caloris Planitia | 31,65° N, 161,98° Ø | Bassinet på 1.500 km med ringen af bjerge og revnerne i midten (Pantheon Fossae). Lav sol fra siden | Kun kloden: Kortet over hele kloden er nok (8k giver ca. 1,9 km pr. pixel) |
| De lyse huller | Raditladi, 27,15° N, 119,06° Ø | Kameraet går ned over bassinet. Hullerne selv er for små til kloden (18 m-1,6 km), så MESSENGERs nærbillede står i panelet | Ét foto (public domain) i "Billederne" |
| Is ved Nordpolen | Prokofiev, 85,77° N, 62,92° Ø | Skråt ned over polens kratere med Solen i horisonten. Kontakten "Isen (set med radar)" farver radarens pletter gule, som på NASA's billede | Et lille kort over polen (afsnit "Nyt") |

**Styr-boksen:** "Navne", "Bjergene 10 gange højere", "Isen (set med radar)" og tidsknappen. ⏩ lader dagen gå (en dag på ca. et halvt minut, tempoet sættes under byggeriet).

**Solen på himlen (det ene nye stykke grafik):** en lille tegning i overlaget ved stoppet "Solen vender om": en horisont og Solens skive, som den ses fra ækvator ved længde 90° V. Med ⏩ ser man skiven komme to tredjedele op, synke ned igen og så stå op. Tallene regnes i `js/data/` (Keplers ligning findes i `planeter.js`) og kan testes i Node: baglæns i ca. 8,1 døgn og 1,1° (fakta, afsnit 2). Fra rummet kan det ikke ses: Grænsen mellem dag og nat flytter sig kun ca. 47 km baglæns på en klode, der er 4.879 km bred.

**Valgt fra, og hvor det bor:**
- Klinterne (Discovery Rupes, Enterprise Rupes) og den store jernkerne: spørgsmålet "Hvad er der inden i Merkur?" i panelet. Som sted kun, hvis I vælger det i spørgsmål 5.
- Det laveste punkt (Rachmaninoff), strålekrateret Hokusai og "weird terrain" modsat Caloris: "Navne" på kloden og "For nørder".
- Magnetfeltet, halen af natrium og exosfæren: "For nørder".
- At stå på Merkur (et landskab som Stå på Mars): ikke i en lille udgave.
- Forstærkede farver (MESSENGERs farvekort): ikke nu. Merkur er gråbrun, og det forstærkede kort ligner en anden planet.

### Pluto
**Træet:** `▶ Flyby · 5 stop` · Pluto · **Steder:** Hjertet (Sputnik Planitia) · Bjergene af vandis (Tenzing Montes) · **Måner:** Charon.

| Sted | Hvor | Hvad man ser | Kræver |
|---|---|---|---|
| Hjertet | Sputnik Planitia, 19,51° N, 178,69° Ø | Den glatte slette med mønstret af mangekanter (ca. 33 km), uden et eneste krater | Et lokalt net (`lokalt`) af 300 m-kortet, så mønstret er skarpt |
| Bjergene af vandis | Tenzing Montes, 15,61° S, 177,38° Ø | Lavt hen over bjergene med sletten bagved. Wright Mons (den mulige isvulkan, 21,36° S, 173,24° Ø) ligger i samme net og får et navn | Det samme eller ét net mere med højder |
| Charon | 19.596 km fra Pluto | Charon tæt på med den røde nordpol og Pluto stor bagved | `lavIsmåne` med 2k-kort |

**Styr-boksen:** "Navne", "Modlys" (kameraet bag Pluto, den blå ring) og tidsknappen. ⏩ viser dansen: Pluto og Charon drejer om det fælles tyngdepunkt (et lille kryds, når "Navne" er slået til), og Charon bliver hængende over samme sted på Pluto.

**Rigtig størrelse og afstand:** Pluto, Charon og afstanden imellem dem tegnes i samme skala. Her behøver vi ikke snyde: Charon er halvt så bred som Pluto og kun otte Pluto-bredder væk.

**Det, ingen har set:** New Horizons så kun den ene halvkugle skarpt, og alt syd for ca. 38° S lå i mørke. Kloden viser det, som det er: uskarpt på bagsiden og mørkt forneden, som i overblikket i dag. Højderne findes kun på forsiden, så bagsiden er glat, fordi vi ikke ved bedre. Flybyens stop stiller Pluto, så forsiden er belyst.

**Valgt fra:**
- De fire små måner (Styx, Nix, Kerberos, Hydra): nævnt i "For nørder".
- Knivene (Tartarus Dorsa), den mørke hval (Belton Regio), Burney-krateret og Piccard Mons: "Navne" på kloden.
- Havet under isen: én forsigtig sætning i "For nørder".
- Arrokoth og resten af Kuiperbæltet: ikke nu.
- "Hvorfor er Pluto ikke en planet?": bor i overblikket. Pluto linker dertil.

### Genbrug og nyt
| | Merkur | Pluto |
|---|---|---|
| Kloden | `lavKlippeplanet` med gråt kort og `tone` (som Venus V1), højder 665 m, uden `luft` | `lavKlippeplanet` med farvekort, højder kun på forsiden (resten 0, blød kant) |
| Steder | Ingen lokale net. Polen ses skråt | `lokalt` ved hjertet og bjergene |
| Luft | Ingen | Tynd blå dis: `lavLuft` eller Titans dis fra `atmosfaere.js`. Lagene tegnes kun, hvis det er billigt |
| Måner | Ingen | Charon med `lavIsmåne`, i den rigtige afstand |
| Fælles | `hent.js`, `navne.js`, `rejse.js`, `flyby.js`, `sideknap.js`, `dato.js` (overblikkets dato), pol og drejning fra `js/data/planeter.js` (findes for begge), Plutos bane fra `pluto-bane.js` | |
| **Nyt** | `lav_merkur.py`, `js/kosmos/merkur.js`, `js/data/sider/merkur.js`, tegningen af Solen (`js/data/merkur-sol.js` og lidt HTML i overlaget), polkortet med radarens is (1k, fra PIA19411 eller Harmon m.fl. 2011), `tests/merkur.mjs` | `lav_pluto.py`, `js/kosmos/pluto.js`, `js/data/sider/pluto.js`, dansen om tyngdepunktet, `tests/pluto.mjs` |
| Overblikket | "Kort besøg" bliver til rigtige besøg (`fænomen` i `planeter.js`), og linjen "Merkur … senere" i forløbets vej "Besøg en planet" fjernes. Panelerne i `js/data/sider/overblik.js` kortes ned til en henvisning | |

**Ydelse (forslag):** hver klode højst ca. 8 MB på tablet og 12 MB på pc (budgettet er 20 og 25). Pluto er kun set med 300 m pr. pixel på forsiden, så et 8k-kort er mere, end data kan bære. 4k er nok, og resten lægges i de lokale net.

**Tre ting, Opus skal tjekke først:**
1. **Polen.** Kortet er trukket ud ved polerne, og Mars' nordpol er allerede uskarp (M7b-pol). Se Prokofiev skråt fra ca. 80° N, og tjek skarpheden i første delopgave. Er den ikke god nok, løses den sammen med M7b-pol.
2. **Skyggerne i kortet.** MESSENGERs kort (BDR) er fotos med skygger, som ikke følger vores sol. Prøv også kortet med høj sol (LOI), der har færre.
3. **Evig skygge.** Klippeplaneten regner lys efter bjergenes hældning. Tjek, om skyggerne fra Mars kan bruges i kraterne ved polen. Ellers bærer kontakten "Isen (set med radar)" stoppet alene.

## 3. Forløb eller kun flyby?
**Min mening: Ikke et forløb. Flybyen er rundturen, og de to "Kort besøg" i overblikket bliver indgangene.**

- **Én udgave af hver klods.** Planeterne har flybyen som rundtur, og den skal alligevel flyttes over på forløbets linje senere (E3). To rundture på samme klode er én for meget.
- **Et forløb kræver en handling i hvert trin.** En lille udgave har næsten kun ting at se på. Merkur har én god handling (⏩ og Solen, der vender om), Pluto har én ("Modlys"). Det er ikke nok til 3-6 trin.
- **Prøven er fyldt.** Overblikkets forløb, Liv, Molekyler og Tid venter allerede på en aften med jeres søn.
- **Spørgsmålet før svaret kan flybyen godt klare:** Stoppet før isen slutter med et spørgsmål, og det næste svarer.

**Vil I alligevel have et forløb,** så kun for Merkur: "Dagen, der varer to år" i fire trin (gæt dagens længde, kør ⏩ og tæl år, se Solen vende om, find det koldeste sted). Det kræver et mærket sted på jorden, en tæller og et termometer, altså mere end en lille udgave. Trinene skriver jeg ikke ud, før I har valgt det.

### Merkurs flyby (6 stop)
*Underteksterne er under 160 tegn. Opus faktatjekker dem igen mod del 8, når de skrives ind.*

| Stop | Kameraet | Undertekst |
|---|---|---|
| 1. Merkur | Hele kloden, Solen fra siden, kloden drejer langsomt | "Merkur er den mindste planet og den nærmeste ved Solen. Den har næsten ingen luft, så intet slider kraterne væk. Derfor ligner den Månen." |
| 2. Caloris | Skråt over bassinet, lav sol | "Caloris er et af de største nedslagskratere i Solsystemet, ca. 1.500 km bredt. Navnet betyder 'den varme slette'. Her er et af de varmeste steder." |
| 3. Den lange dag | Over grænsen mellem dag og nat, ⏩ | "Fra solopgang til solopgang går der 176 jorddøgn. Det er to hele år på Merkur. I solen er der over 400 °C, om natten ca. −180 °C." |
| 4. Solen vender om | Som før, tegningen af Solen ved horisonten kommer frem | "Tættest på Solen løber Merkur så stærkt, at Solen går i stå på himlen, bakker i otte døgn og går frem igen. Nogle få steder står den op to gange." |
| 5. De lyse huller | Ned over Raditladi, fotoet i panelet | "De lyse pletter er flade huller. Noget i klippen forsvinder ud i rummet i solheden, så jorden synker. Hvor på Merkur ville du lede efter is?" |
| 6. Is ved Nordpolen | Skråt over Prokofiev, Solen i horisonten, "Isen" slås til | "Ved polerne står Solen altid helt nede i horisonten. Bunden af kraterne får aldrig sol og er under −170 °C. Dér ligger der is." |

### Plutos flyby (5 stop)
*Rækkefølgen følger New Horizons 14. juli 2015: ind mod hjertet, forbi bjergene, forbi Charon og et blik tilbage.*

| Stop | Kameraet | Undertekst |
|---|---|---|
| 1. Pluto og Charon | Begge i billedet i rigtig skala, forsiden belyst | "Pluto er mindre end vores måne og så langt ude, at sollyset er ca. fem timer om at nå herud. Månen Charon er halvt så bred som Pluto selv." |
| 2. Hjertet | Ned over Sputnik Planitia | "Hjertets venstre halvdel er en slette af frossent kvælstof, ca. 1.000 km bred. Der er ingen kratere, for isen rører langsomt rundt og glatter sig selv." |
| 3. Bjerge af vandis | Lavt forbi Tenzing Montes, lav sol | "Bjergene er flere km høje og lavet af vandis. Her er ca. −230 °C, og så kold er is hård som klippe. Kvælstof-isen er for blød til at bære et bjerg." |
| 4. Charon | Ved Charon med Pluto bagved, ⏩ et øjeblik | "Pluto og Charon vender altid samme side mod hinanden, som to dansere, der holder i hånd. Fra Pluto hænger Charon stille på himlen og går aldrig ned." |
| 5. Farvel i modlys | Bag Pluto, Solen lige bag kanten, "Modlys" | "Da New Horizons fløj forbi i 2015 og så sig tilbage, lyste en blå ring om Pluto: dis i en luft, der er 100.000 gange tyndere end Jordens." |

## 4. Lagene

### Panelet (titel, to tal, højst tre sætninger, fire spørgsmål)
**Merkur.** Tal: "Et døgn: 176 jorddøgn" og "Et år: 88 jorddøgn". Spørgsmål:
1. *Hvorfor er der is på planeten nærmest Solen?* Aksen står lodret (0,034°), så Solen kun strejfer polerne, og uden luft kommer varmen ikke derned.
2. *Hvorfor varer en dag to år?* Tre omdrejninger på to år, og Solens tidevandskraft holder Merkur fast i den takt.
3. *Hvordan ved vi det?* Radar fra Jorden fandt de lyse pletter i 1991. MESSENGER målte brint over dem i 2012 og fotograferede bunden af kraterne i lyset fra kratervæggene.
4. *Hvad er der inden i Merkur?* En kerne af jern, der fylder over fire femtedele af vejen ud. Den er kølet af, Merkur er skrumpet nogle km, og skorpen har slået folder: klinterne.

"Hvorfor er Merkur ikke den varmeste planet?" bor ved Venus (kortet "Hvorfor er Venus varmere end Merkur?" i Venus V5). Merkur linker dertil.

**Pluto.** Tal: "Et år: 248 jordår" og "På jorden: ca. −230 °C". Spørgsmål:
1. *Hvorfor er der ingen kratere i hjertet?* Kvælstof-isen er blød. Varme indefra får den til at stige op og synke ned i store celler, så overfladen hele tiden bliver ny.
2. *Hvordan kan is være et bjerg?* Jo koldere is er, jo hårdere. Ved −230 °C er vandis hård som klippe.
3. *Hvorfor står Charon stille på himlen?* Bundet rotation begge veje. Og står man i hjertet, ser man den aldrig, for hjertet vender næsten præcis væk fra Charon.
4. *Hvordan ved vi det?* Én sonde, én forbiflyvning: over ni år undervejs, forbi på få timer med næsten 50.000 km/t, og over 15 måneder om at sende billederne hjem.

### Ordene
| Ord | Står i `js/data/ordbog.js` i dag? | Bruges |
|---|---|---|
| Nedslagskrater (og nedslagsbassin) | Ja | Merkur |
| Resonans | Ja (eksemplet er Jupiters måner) | Merkur 3:2, Pluto og Neptun 2:3. Kun i "Hvorfor?" og "For nørder" |
| Tidevandskraft | Ja | Begge |
| Bundet rotation | Ja, men teksten taler kun om måner | Pluto og Charon. Forslag: tilføj "Pluto og Charon er bundet til hinanden begge veje" |
| Dværgplanet, Kuiperbælte, Bane | Ja | Pluto |
| **Soldøgn** | Nej | Merkur (og Venus V5: Aftal med Venus, hvem der skriver det) |
| **Sublimation** | Nej (nævnt inde i teksten om tøris) | Merkurs huller og Plutos luft |
| **Fælles tyngdepunkt** | Nej | Pluto og Charon |
| Isvulkan | Nej ("Skjoldvulkan" findes) | Kun hvis Wright Mons får en tekst |

Højst to nye fagord pr. stop, og underteksterne ovenfor klarer sig næsten med hverdagsord. "Hollows" får ikke et dansk fagord: Teksten siger "lyse huller". "Exosfære" og "tholiner" står kun i "For nørder" og forklares dér.

### Ærligt talt
**Merkur:** Kortet er sat sammen af tusindvis af MESSENGERs fotos, så de små skygger i kortet følger ikke vores sol. Merkur er mørkere, end vi tegner den: Den kaster kun ca. en tiendedel af lyset tilbage. Isen kan ikke ses: Den ligger i mørke, og det gule er radarens pletter set fra Jorden. Tegningen af Solen ved horisonten gælder ét bestemt sted. Dagen er spolet frem.

**Pluto:** Kun den ene side er set tæt på. Bagsiden er uskarp, det sydligste er aldrig set, og højderne findes kun på forsiden. Dislagene er tegnet efter New Horizons' billeder, ikke målt lag for lag. Solen står, som den stod i 2015, når flybyen kører. Størrelser og afstand mellem Pluto og Charon er ægte.

### For nørder
**Merkur:** 3:2 og de to slags døgn med NSSDC's tal. De varme poler (længde 0° og 180°) og Caloris tæt ved den ene. Solen 2,1-3,25 gange så bred som fra Jorden. Kernen (ca. 2.000 km af 2.440). Magnetfeltet (1 % af Jordens, forskudt mod nord). Exosfæren af natrium. Højeste og laveste punkt. Mariner 10, MESSENGER og BepiColombo med dato.

**Pluto:** Banen (30-49 AU, hældning 17°, nærmere end Neptun 1979-1999, resonansen 2:3). Tyngdepunktet 940 km over overfladen. Aksen på 120°. Luftens tryk og tholinerne. De fire små måner. Det mulige hav. De officielle navne (Belton Regio, Neverland Regio). Sollyset i dag: ca. 1/1.270 af Jordens, stadig flere hundrede fuldmåner.

### Links begge veje
Merkur → Venus (varmest), Solen og Månen (kratere uden luft). Pluto → overblikket (dværgplanet), Neptun (Triton er nok en fanget klode fra Kuiperbæltet, tjekkes) og kvælstof i Det periodiske system. Overblikkets vej "Besøg en planet" og spørgsmålet om Pluto peger ind.

### Prøven (tre spørgsmål til hver)
- Merkur: Hvor er der is på Merkur, og hvorfor smelter den ikke? Hvor lang er en dag? Hvorfor ligner Merkur Månen?
- Pluto: Hvad er hjertet lavet af? Hvad er bjergene lavet af? Hvorfor kan man altid se Charon samme sted?

## 5. Spørgsmål til jer
1. **Merkurs kernesætning:** **A, sol og skygge med isen til sidst** (anbefalet). Eller B, dagen, der varer to år. Eller C, jernkuglen, der skrumper.
2. **Plutos kernesætning:** **A, is som sten og is som gletsjer** (anbefalet). Eller B, dobbeltkloden. Eller C, den første dværgplanet.
3. **Rundturen:** **Kun flybyen, 6 og 5 stop** (anbefalet). Eller også et forløb på fire trin for Merkur ("Dagen, der varer to år"), som er en større opgave.
4. **Solen, der vender om:** **En lille tegning af horisonten og Solen i overlaget** (anbefalet: Det er det, man husker, og det kan ikke ses fra rummet). Eller kun tekst og et "Hvorfor?"-kort, så har Merkur 5 stop.
5. **Merkurs tredje sted:** **De lyse huller med MESSENGERs foto i panelet** (anbefalet: De passer til kernesætningen). Eller klinten Discovery Rupes i 3D i stedet (kan ses på kloden med "Bjergene 10 gange højere", men hører til kernesætning C). Eller begge, altså fire steder.

**Jeres svar 16. november 2026:** Alle fem som anbefalet: (1) Merkurs kernesætning A, sol og skygge med isen til sidst. (2) Plutos kernesætning A, is som sten og is som gletsjer. (3) Kun flybyen, 6 og 5 stop, intet forløb. (4) Tegningen af Solen, der vender om, i overlaget. (5) De lyse huller (Raditladi) med MESSENGERs foto som Merkurs tredje sted. Opus' noter og de tre tjek står i [fable/E16-merkur-pluto-noter.md](fable/E16-merkur-pluto-noter.md).

## 6. Til Opus
- **Efter Opus' noter (16. november 2026), læs dem før MP1:** Merkurs højdekort og Plutos kort har 180° i midten, Merkurs billedkort og Charons 0° (`lav_merkur.py` ruller højdekortet). Pluto beholder 180° i midten, så hjertet ikke ligger på kortets kant, og `lavKlippeplanet`/`lokalt` får en parameter med kortets midte. BDR med jævn lysstyrke (stregerne fjernes med LOI), ikke LOI. Polen måles i MP1 (anisotropi 8 og 16), og trænger den, laves et lille polkort i kuglens shader. Ingen ny skyggekode til evig skygge. Fire rettelser i underteksterne og panelet (noterne, "Hvor jeg er uenig").
- **Rækkefølge (forslag, et go pr. del):** MP1 Merkur: kort, højder og skelet. MP2 Merkur: stederne, tegningen af Solen, flybyen og siderne. MP3 Pluto og Charon: kort, højder, dansen og disen. MP4 Pluto: de lokale net, flybyen og siderne, og overblikkets "Kort besøg" rettes. Alle mellem. Bygges efter Venus V3-V5.
- **Tjek igen, når teksterne skrives:** BepiColombo (21. november og 9.-10. december 2026), mængden af is, bjergenes højde, Plutos farver og kortenes længde 0° (del 8, afsnit 9).
- **Tests (5-8 pr. klode):** tallene i Node (soldøgnet 175,94 døgn ud fra drejning og år, Solen baglæns i ca. 8 døgn, tyngdepunktet uden for Pluto, Charon over samme længde efter en omgang), stederne på den rigtige bredde og længde, flybyen igennem, underteksterne under 160 tegn, står stille i pause og ingen konsolfejl.
