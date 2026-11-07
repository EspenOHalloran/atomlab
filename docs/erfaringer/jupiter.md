# Jupiter: kortet, vindene, månerne og skyggerne

*Flyttet fra [planeter-og-maaner.md](planeter-og-maaner.md) 7. november 2026. Læs også den (billeder, kort fra USGS, Phobos og Deimos), før der bygges på Jupiter.*

## Planen for Jupiter (6. november 2026)
- **Kildernes domæner:** `archive.stsci.edu` (Hubbles OPAL) gav "unable to get local issuer certificate", også efter I åbnede det. Det var emSign-roden igen (se "Certifikater"), og det virkede med Mozillas rodliste fra `certifi`. `upload.wikimedia.org` svarede 429 på næsten alt, også direkte filer, så hent hellers fra kilden (fx `www.solarsystemscope.com` eller `assets.science.nasa.gov`).
- **NASA's Photojournal er flyttet** til science.nasa.gov. Siderne findes med WordPress-søgningen `https://science.nasa.gov/wp-json/wp/v2/search?search=PIA07782`, og filerne ligger på `assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia07/pia07782/PIA07782.tif`.
- **Se kortene i små udgaver** (OPAL har `-medium` og `-small`, NASA har `dynamicimage/...?w=900`). Det viste forskellen mellem 2000 og 2025 (pletten) og hullerne ved polerne uden at hente 19 MB.
- **Kortets bredde skal passe til kuglen:** OPAL er planetografisk, Cassini planetocentrisk, og en kugle med `scale.y` følger den parametriske bredde. Ved 45° er forskellen op til 3,8°. Tjek, hvilket system et kort bruger, før det lægges på en fladtrykt planet.
- **Mål data selv, når tabellen er lukket:** Ingen fri tabel med Jupiters vinde. Men OPAL har to omgange med ca. 9½ times mellemrum, og krydskorrelation af hver række gav ca. 147 m/s ved 24° N (Simon m.fl. 2015: 153 m/s), allerede i den lille udgave.
- **Hjælpeagenter til fakta:** To agenter (planeten og månerne med himlen) kostede ca. 210.000 tokens hver med åbne domæner. Giv dem tallene, der allerede er slået op, og listen over lukkede domæner, så de ikke prøver dem.

## Jupiter J1: kloden og kortet (6. november 2026)
- **certifi kan miste en rod:** Den nyeste `certifi` (2026.10.18) har ikke længere "emSign Root CA - G1", så `archive.stsci.edu` fejlede igen. `pip download certifi==2025.1.31` har den. Læg dens `cacert.pem` sammen med `/root/.ccr/ca-bundle.crt`, og brug `curl --cacert`.
- **Mål, hvilken bredde et kort bruger,** i stedet for at stole på teksten: Korreler kanterne af båndene (gradienten af lysstyrken pr. række) i to kort under hver antagelse. Cassini som planetocentrisk gav 0,57, som planetografisk 0,34. En plet, der står 2-3° forkert, kan også bare være flyttet siden.
- **En "søm" i et JPG-kort kan være JPEG's blokke:** Springet ved 0° var 2-3 gange springet mellem to nabosøjler, men kun 1,1-1,3 gange springet ved en almindelig blokgrænse (hver 16. søjle). Kortet i hukommelsen havde ingen søm. Mål mod blokgrænserne. PIL's `resize` ved heller ikke, at kortet går rundt: Læg en stribe fra den modsatte kant på før nedskaleringen.
- **`passerTil` i `lav()` giver en forkert afstand,** for panelerne har ikke fået deres plads endnu (Jupiter blev alt for lille). Flyv derhen i det første billede (`hvertBillede`) og `hop()`.
- **`--ændret` efter en push finder intet:** Den sammenligner med den pushede gren. Giv den filerne: `node tests/koer-alle.mjs --ændret $(git diff --name-only origin/main...HEAD)`.
- **Farver fra et andet foto: én omregning for hele kloden.** At stemme af bånd for bånd ville flytte båndenes lysstyrke fra 2000 over på 2025, for båndene ændrer sig. Middelværdi og kovarians (Monge-Kantorovich) i lineært lys gav Cassinis farvetone uden at flytte noget.

## Jupiter J2: vindene og pletten (6. november 2026)
- **Mål vinde med krydskorrelation pr. række:** Hubbles to omgange (FITS i fuld opløsning) sammenlignet række for række efter at have trukket et glidende gennemsnit på 6° fra (ellers styrer båndenes lysstyrke korrelationen), tre rækker ad gangen, med en parabel om toppen for decimalerne. Fire filtre gav det samme inden for få m/s, og 24° N gav 149 m/s mod 153 i litteraturen. Tag det, der drejer (pletten), ud af målingen.
- **Det, der ikke kan måles, så det må siges:** Plettens drejning i de samme to billeder gav 4-28 døgn alt efter filter (for få detaljer inde i den). Brug kildens tal, og skriv det.
- **Glatte data ved en grænse:** Vinden faldt fra 6-11 m/s til 0, hvor målingen holdt op (ca. 65° S og 66° N), og det ville give en søm, hvor skyerne glider. Ton ned mod den rigtige grænse (der, hvor dataene slutter), ikke mod en fast bredde. Testen tjekker kun springet ved grænsen, for jetstrømmens flanker er stejle i virkeligheden (15 m/s pr. 0,25°).
- **Et kort, der glider i en strømning, skal startes forfra:** Ren forskydning med vinden trækker skyerne ud i striber i løbet af få minutter. To faser, der tones over i hinanden (som vand i spil), holder skyerne hele, men så kommer de igen, hvor de stod på kortet. Det skal stå i "Ærligt talt".
- **En hvirvel i et kort, der glider:** Drej pletten som en skive (ingen striber), og dæmp vindene tæt på den. Ellers trækker vinden pletten røde farve med sig ud til siden.
- **`if` om et teksturopslag i en shader:** Implicitte afledte er udefinerede inde i en `if`. Brug `textureGrad` med `dFdx`/`dFdy` regnet uden for `if`. Det sparede ca. 15 % på tablet i testbrowseren, fordi opslaget i pletten kun sker i nærheden af den.
- **Et sted på en planet, der drejer:** `rejse.js` med `op` drejer systemet med så lille et sving som muligt hvert billede. Følger kameraet et sted, mens planeten drejer, drejer billedet langsomt om den lodrette akse (ca. 135° pr. omgang ved 23° S). Og stedet går ind i natten. Ved pletten står døgnet derfor stille (som ved stederne på Mars), mens vindene går videre.
- **`hurtig` hører til det, `lav` giver tilbage,** ikke til fænomenets eksport. Ellers kommer ⏩ ikke frem på tidsknappen.

## Jupiters måner (J3, 7. november 2026)
- **Mål kortenes huller, før de bruges:** Tæl værdien 0 pr. række og søjle. Europa og Ganymedes fra USGS har en helt tom første søjle (spring på 70-150 mod 1-2 mellem naboer), og alle fire har huller ved polerne af forskellig størrelse. Spejlede rækker i hullets kant gav ingen synlig streg. Tjek retningen med et kendt punkt (Pele på Io, Valhalla på Callisto) på et ark med alle kortene.
- **En skygge kan være der uden at ses:** Io's skygge var regnet rigtigt (testen bestod), men fra startbilledet faldt den helt ude ved Jupiters kant. Find den ved midlertidigt at gøre månens radius i skyggen 10 gange større. Skyggen ligger ca. asin(a · sin α / R) fra punktet under Solen, så månens vinkel α fra Solens retning bestemmer, hvor på kloden den falder.
- **Kameraets vinkel ved et besøg regnes fra Solen, ikke fra planeten:** Med månens egen vinkel + 50° så kameraet Io næsten fra natsiden, efter at uret var spolet ud af skyggen.
- **Forstærkede farver dæmpes mere end man tror:** 40 % af farvekortets farve gav en næsten hvid Io. 80 % gav en dæmpet gul. Se på et billede med fuld grafik, før tallet låses.
- **Startpladser og resonans:** Vælg vinklerne fra Solens retning, og regn den tredje ud af Laplace-relationen (Io = 180° + 3·Europa − 2·Ganymedes). Så holder den, også når uret spoles frem.

## Jupiter J4: flybyen, siderne og citatet (7. november 2026)
- **Byg ikke et stop før det, det skal vise:** Planen havde stop ved sydpolen og i skyggen, men cyklonerne, nordlyset og ringene kommer først i J5. Da hver delopgave merges til `main`, blev de to stop flyttet til J5 (jeres svar), i stedet for at vise en sløret pol og en skygge uden ringe.
- **Gentag ikke flybyens tekst i planetens egen funktion:** `flyby.js` skriver underteksten med prikkerne, før `flyvTil` kaldes. Kalder stoppet den samme funktion som træet (`tilPlet`), overskrives underteksten uden prikker. Del den op i en, der kun flyver (`flyvTilPlet`), og en, der også skriver teksten.
- **Ting, der skal ses langt ude, skal regnes fra den største afstand på en smal skærm:** Banerne begyndte at tone frem ved afstand 35. Hele Jupiter står 33 væk på pc, men over 80 på tablet på højkant, så banerne skar hen over billedet dér. Se stoppene i alle størrelser.
- **Citater fra gamle bøger:** archive.org har skanninger af førsteudgaver med OCR (`_djvu.txt`) og en sidefil (`_djvu.xml`), der viser, hvilken side en tekst står på. Hent siden som billede (`/page/n40_w1400.jpg`), og læs ordlyden i billedet, for OCR'en blander det lange s og f sammen.
- **Lukkede kilder:** nature.com, pubmed og europepmc var lukket, så Li m.fl. 2018 kunne ikke læses. Wikipedias rå wikitekst viste henvisningen. Børneteksten blev skrevet, så den holder med både det gamle og det nye tal ("ca. dobbelt så meget").
