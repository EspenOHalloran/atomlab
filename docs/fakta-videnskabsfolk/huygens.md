# Faktagrundlag: Christiaan Huygens (til drejebogen)

*Lavet 15. november 2026 af Opus (effort høj) til [drejebog-huygens.md](../drejebog-huygens.md) og [plan-videnskabsfolk.md](../plan-videnskabsfolk.md). Bygger videre på afsnit 3 i [fakta-videnskabsfolk.md](../fakta-videnskabsfolk.md), som er fuld (ca. 30 KB). Fælderne i [fakta-faelder-videnskabsfolk.md](../erfaringer/fakta-faelder-videnskabsfolk.md) er læst først. Ikke tjekket af Fable endnu (det sker i [prompt-fable-huygens.md](../prompt-fable-huygens.md)).*

**Sikkerhed** (som i fakta-videnskabsfolk.md): **Sikker** = læst i bogen selv (skanningen) eller i to uafhængige kilder. **Ret sikker** = én pålidelig kilde, eller regnet ud fra sikre tal. **Usikker** = kilderne er uenige, eller det kunne ikke læses direkte.

**Kilderne (åbnet 15. november 2026):**
- **Bogen:** *Systema Saturnium* (Haag 1659), Smithsonian Libraries' eksemplar på archive.org, id `CristianiHugeni00HuygA` (metadata: "Public domain. The Library considers that this work is no longer under copyright protection"). Siderne er læst som billeder (`archive.org/download/<id>/page/n<nr>_w1200.jpg`, hvor n = sidetal + 19 omkring s. 46-48, og tavlen er `n51`) og i OCR-teksten (`<id>_djvu.txt`). OCR'en mister ofte linjen med bogstaverne, så den er læst på billedet.
- **Wikipedia (engelsk),** hentet som wikitekst (`action=raw`): "Christiaan Huygens", "Titan (moon)", "Rings of Saturn", "Rømer's determination of the speed of light", "Treatise on Light".
- **Wikimedia Commons:** API'et `prop=imageinfo` og filens wikitekst (`action=parse`). Commons svarer **429**, hvis man henter originalen. Brug en ærlig User-Agent og en thumbnail i en standardbredde (fx 960 px).

## 1. Liv og baggrund
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Født 14. april 1629 i Haag, død 8. juli 1695 | Wikipedia; fakta-videnskabsfolk.md | Sikker |
| Faderen, Constantijn Huygens, var diplomat og rådgiver for fyrstehuset Oranien og desuden digter og musiker. Christiaan var nr. 2 af fem børn. Storebroren Constantijn (f. 1628) arbejdede sammen med ham om kikkerterne | Wikipedia "Christiaan Huygens" ("a diplomat and advisor to the House of Orange, in addition to being a poet and a musician"; søskendelisten) | Ret sikker |
| Undervist hjemme til 16-årsalderen. Studerede jura og matematik i Leiden (maj 1645-marts 1647) og i Breda (1647-1649) | Wikipedia | Ret sikker |
| **Fandt Titan 25. marts 1655. Han var 25 år** (fyldte 26 i april) | Bogen s. 26 ("prima nostra observatione, nempe 25 Mart. 1655", hans første iagttagelse af følgesvenden) og Wikipedia. Alderen regnet | Sikker |
| Begyndte at slibe linser sammen med broren **i 1655** (Wikipedia "Christiaan Huygens") eller **omkring 1650** (Wikipedia "Titan (moon)") | De to artikler er uenige | **Usikker:** Skriv "midt i 1650'erne" eller "selv" uden år |
| Medlem af Royal Society i London 1663 (det første udenlandske medlem) og fra 1666 i Paris ved Ludvig 14.'s nye Académie des sciences | Wikipedia | Ret sikker |
| Opfandt penduluret og tog patent på det i 1657 | Wikipedia | Ret sikker |
| Rømers tal for lysets tid (1676) brugte Huygens til at regne farten ud (se afsnit 5) | fakta-videnskabsfolk.md, afsnit 2 og 3 | Ret sikker |
| ESA's sonde **Huygens** er opkaldt efter ham og landede på Titan **14. januar 2005** | Wikipedia; js/data/sider/saturn.js (faktatjekket før) | Sikker |

## 2. Kikkerten (i hans egne ord)
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Den første kikkert, han brugte, var **12 fod lang** med to konvekse linser. Med den fandt han "den nye planet" (Titan) og så Saturn i nogle måneder | *Systema Saturnium* s. 3 ("Primus quem adhibuimus duodenos pedes non excedebat, duobus convexis vitris instructus … Eo planetam novum & deteximus primum") og s. 46 ("tubo illo 12 pedum quo tunc utebar") | Sikker |
| Okularet samlede lyset på knap 3 tommer, så forstørrelsen var **ca. 50 gange** (12 rhinlandske fod ≈ 144 tommer, 144 / 3 ≈ 48) | Regnet ud fra s. 3. Wikipedia siger **43 gange** (med Louwman 2004 som kilde) | **Ret sikker** (ca. 40-50). Skriv "ca. 50 gange" kun med "ca." |
| 12 rhinlandske fod er ca. **3,8 m** (1 rhinlandsk fod ≈ 31,4 cm) | Foden efter hukommelsen | Ret sikker. **Rettet i H4:** Skriv "over 3 meter" (se afsnit 4, linsen er 332 cm) |
| Siden byggede han kikkerter på **23 fod** (ca. 7 m) med rør af jernplade, der forstørrede **næsten 100 gange**. **Galileis forstørrede højst ca. 30 gange** | *Systema Saturnium* s. 4 ("Centuplam itaque fere rationem hanc in perspicillis nostris esse constat, cum Galileana non ultra trigecuplam processerint") | Sikker |
| Med en kort kikkert (5-6 fod) så han selv Saturn med **to små kugler** i stedet for arme, som de andre havde tegnet | s. 35 ("quoties breviori perspicillo, quinum puta aut senum pedum, Saturnum aspicimus, binos globulos dictorum loco brachiorum apparere") | Sikker |
| Mange "huller" i de gamle tegninger skyldtes **dårlige kikkerter**, ikke snyd: "observatørerne gav dem i god tro" | s. 36 ("telescopiorum culpa phasin hanc vitiatam esse, licet observatores bona fide eam tradiderint") | Sikker |

## 3. Saturns "ører", ringen og bogen
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| **Tavlen ved s. 35** viser 13 tegninger af Saturn fra andre astronomer: I Galilei (1610, tre kugler), II Scheiner (1614), III Riccioli (1640 og 1643), IV-VII Hevelius (V også Gassendi), VIII-IX Riccioli (1648-1650), X Eustachio Divini (1646-1648), XI Fontana, XII Gassendi og Blancanus, XIII Riccioli (efter andre i Rom 1644-1645) | Tavlen (`n51`, påskrevet "Pag. 35") og teksten s. 35-38 | Sikker |
| **Galilei** så i 1610 Saturn som tre kloder, der næsten rørte hinanden. I 1612 forsvandt "ørerne" (ringen stod på kant) | Wikipedia "Rings of Saturn" (brevet til hertugen af Toscana; "In 1612 the Earth passed through the plane of the rings and they became invisible"). Det første også i citatet `huygensSaturn` (faktatjekket 29. oktober 2026) | Sikker (1610), Ret sikker (1612) |
| I 1655 så Huygens med 12-fods-kikkerten "armene" stikke ud i én lige linje, "som om en akse gik gennem planeten", og det samme dag efter dag. Derfor måtte Saturn være omgivet af en ring, der går rundt om den | s. 46 ("secundum eandem rectam lineam protendebantur, velut si axe quodam medius planeta trajiceretur … intellexi … nisi ut globus Saturni a corpore alio aequaliter undique cinctus poneretur, atque ita annulus quidam medium eum ambiret") | Sikker |
| Han målte, at armene hældte **mere end 20°** i forhold til ekliptika (Jordens baneplan). Derfor ser ringen skiftevis ud som en bred ellipse, en smal ellipse og til sidst som en ret linje | s. 46 ("intersecare eam angulo 20 partibus majore … nunc ellipsin satis latam, nunc eandem strictiorem, nonnunquam denique & rectam lineam") | Sikker |
| I dag: Saturns akse hælder **26,7°** i forhold til dens bane, og banen hælder ca. 2,5° i forhold til Jordens. Ringen hælder derfor ca. 27-28° i forhold til ekliptika | NSSDC (Saturn fact sheet: obliquity 26,73°, inclination 2,49°), efter hukommelsen | Ret sikker. **Rettet 16. november 2026:** Regnet med IAU's pol (RA 40,589°, Dec 83,537°) mod ekliptikas pol giver **28,05°**. Skriv "ca. 28° mod ekliptika" (26,7° er mod Saturns egen bane). Huygens satte senere ringens plan parallelt med Jordens ækvator, altså 23½° (OCR: "planum annuli plano aequatoris nostri parallelum") |
| **Anagrammet:** udgivet i **marts 1656** "med blandede bogstaver sammen med iagttagelsen af Saturns måne". Skriftet er dateret **5. marts 1656** (s. 2: "Itaque anno 1656 die 5 Martij, de Saturni Luna … observationem emisi"). s. 47 siger 25. marts, men det er Huygens' egen fejl (Fable E12, tjekket i OCR 16. november 2026) | s. 2 og s. 47 | Sikker (5. marts) |
| **Bogstaverne:** a×7, c×5, d, e×5, g, h, i×7, l×4, m×2, n×9, o×4, p×2, q, r×2, s, t×5, u×5. **62 bogstaver** i alt | s. 47, læst på billedet. Talt efter i sætningen (et lille script) | Sikker |
| **Sætningen:** "Annulo cingitur, tenui, plano, nusquam cohaerente, ad eclipticam inclinato" (bogen skriver "cohærente" med æ) | s. 47 (kursiv); citatet `huygensSaturn` | Sikker |
| Bogen *Systema Saturnium* udkom i Haag i **1659**, tilegnet prins Leopold af Toscana (Leopoldo de' Medici) | Titelbladet ("Hagae-Comitis … M.DCLIX") og tilegnelsen ("Serenissimo Principi Leopoldo ab Hetruria", OCR'en er utydelig) | Sikker (år og by), Ret sikker (Leopold) |
| Wikipedia "Titan (moon)" kalder skriftet om månen (*De Saturni Luna Observatio Nova*) "the 1655 tract". Huygens selv skriver, at det udkom **i 1656** | s. 47 mod Wikipedia | **Fælde.** Skriv 1656 (bogen) |
| Ringens største diameter er ca. **9 til 4** i forhold til Saturns, og mellemrummet mellem ringen og kuglen er mindst lige så bredt som selve ringen | s. 47 ("rationem habere ad diametrum Saturni quae est 9 ad 4"; "aequare ipsius annuli latitudinem vel excedere etiam") | Sikker |
| I dag: A-ringens yderkant ligger 136.775 km fra Saturns centrum, og Saturns radius ved ækvator er 60.268 km. **136.775 / 60.268 = 2,27**, altså **9,1 til 4**. Huygens ramte næsten præcist | `js/data/ringe.js` (A-ringen), NSSDC (radius) efter hukommelsen. Regnet | Ret sikker |
| Månen går rundt om Saturn på **ca. 16 døgn** (hans eget tal). I dag: 15,945 døgn | s. 26-27 ("circiter 16 dierum spatio"; "Comitem vero spatio dierum 16 circuitum unum absolvere scio"); NSSDC 15,945 d (del3f) | Sikker |
| **Huygens troede, ringen var fast:** "denne ring, fast og varig (for det tror jeg, den er)" | s. 48 ("annulum hunc solidum ac permanentem (talem enim arbitror)"), læst på billedet | Sikker |
| Laplace viste i 1787, at en ensartet, fast ring ikke kan holde. **Maxwell viste i 1859,** at ringen må bestå af utallige små stykker, der hver går i sin egen bane. Keeler (og Belopolsky) målte det i 1895 | Wikipedia "Rings of Saturn" | Ret sikker |
| Ringen står på kant set fra Jorden **hver 13-15 år** (ca. et halvt Saturn-år). Senest **23. marts 2025**. Næste gang **15. oktober 2038, 1. april 2039 og 9. juli 2039** | Wikipedia "Rings of Saturn" | Ret sikker |
| Mellemrummet, Huygens så, er ikke helt tomt: Der ligger svage ringe (C- og D-ringen) inden for de klare | `js/data/ringe.js`; Wikipedia | Ret sikker |
| Huygens så i 1659 også Syrtis Major på Mars og fandt, at et døgn på Mars er ca. 24½ time (i dag 24 t 37 min) | Wikipedia "Christiaan Huygens" | Ret sikker (kun til "For nørder", hvis der er plads) |

## 4. Portrættet og billederne af siderne
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| **Portrættet:** Caspar Netscher, *Christiaan Huygens, the astronomer*, olie, **1671** (Museum Boerhaave i Leiden, lån fra Haags Historisch Museum). Huygens var 42 | Commons: `File:Caspar Netscher - Christiaan Huygens, the astronomer, 1671.jpg`, skabelonen `{{PD-Art|PD-old-auto-expired|deathyear=1684}}`, LicenseShortName "Public domain". Wikipedia nævner lånet | Sikker |
| Et foto af et maleri, hvis beskyttelse er udløbet, har **ingen egen ret** i Danmark (ophavsretslovens § 70 stk. 4, billedkunst) | [fakta-bogsider-rettigheder.md](../fakta-bogsider-rettigheder.md) | Sikker (loven), Ret sikker (at et portræt er billedkunst, det er ret klart) |
| Andre muligheder: Bernard Vaillant 1686 (`Christiaan-huygens4.jpg`, også PD) og Gerard Edelincks kobberstik efter Netscher (1684-1687, ikke fundet på Commons ved en hurtig søgning) | Commons; Wikipedia ("Portraits") | Ret sikker |
| **Siderne:** Smithsonians skanning er frigivet ("no longer under copyright protection"), så s. 46-48 og tavlen ved s. 35 kan vises. Et nyt foto af en *tekstside* ville ellers have sin egen ret (§ 70) | archive.org-metadata; fakta-bogsider-rettigheder.md | Sikker |

**Tjekket i H4 (17. november 2026, `/faktatjek`, Opus):**
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Oversættelsen af **s. 48, linje 5-10** ("Hos autem reputare … me percipere"): Latinen er læst på billedet (`n67`) og passer ord for ord med drejebogen. "ikke bare har fundet på … efter mit eget hoved, sådan som astronomerne har fundet på deres epicykler … Jeg ser også denne ring ret tydeligt med øjnene" holder (*mera inventione atque arbitrio meo* = "blot af egen opfindelse og eget skøn", *fingere* = "finde på") | s. 48 | Sikker |
| **Titan fik sit navn i 1847** af John Herschel (*Results of Astronomical Observations … at the Cape of Good Hope*, London 1847), sammen med de andre syv kendte Saturn-måner. Huygens kaldte den "Saturns måne" (*De Saturni Luna Observatio Nova*) | Wikipedia "Titan (moon)" og "John Herschel" (begge med henvisning til bogen fra 1847 og Lassell, MNRAS, 12. november 1847) | Ret sikker |
| **OC XV:** I skriftet fra 1656 ventede Huygens armene tilbage **"sub finem Aprilis, si non ante"** (sidst i april, hvis ikke før). Saturn forsvandt i Solens lys i juni 1656 uden arme, og han så dem først igen 13. oktober (s. 17). Han sendte skriftet til Hevelius 8. marts 1656. Linsen fra hans 12-fods-kikkert, der findes endnu, har en brændvidde på **332 cm** (målt 1898) | *Oeuvres complètes* XV (archive.org `oeuvrescomplte15huyguoft`, OCR), s. 14 og indledningen til *Observatio nova* | Sikker (april og 13. oktober), Ret sikker (332 cm) |
| **Divini (nr. X på tavlen):** "credibile est omnium emendatissimè nativam Saturni faciem nobis descripsisse, nisi quod umbras illas … de suo, ut opinor, adjecit" (det er troligt, at han har tegnet Saturns rigtige udseende mest nøjagtigt af alle, bortset fra skyggerne, som han vist selv lagde til). Divini så den 1646, 1647 og 1648 | s. 37 (`n56`, læst på billedet) | Sikker |
| **Kikkertens længde, hvilket tal står hvor:** Bogen siger "ikke over 12 fod" (s. 3). 12 rhinlandske fod er ca. 3,8 m (foden efter hukommelsen), og linsen, der findes endnu, har en brændvidde på 332 cm (OC XV). Programmet skriver "12 fod (over 3 m)" under "For nørder" i "Om Huygens", fordi det er sandt med begge tal. Skriv ikke "næsten 4 m" eller "lidt under 4 m" | s. 3; OC XV, s. 14 | Sikker ("over 3 m") |
| **"Bogstavgåde":** Huygens kalder anagrammet "literarium gryphum" | *Systema Saturnium* (OCR) og OC XV ("sequenti grypho consignare visum est") | Sikker |
| **Grunden til anagrammet** (introduktionen til "Hemmeligheden", 18. november 2026): Han var endnu ikke helt sikker på ringen og kunne gøre løsningen kendt senere, når han var sikker. Anagrammer var dengang en måde at gøre krav på at være først, fordi flere astronomer kiggede på Saturn på samme tid. Løsningen sendte han i et brev til Chapelain i marts 1658, før bogen i 1659 | KNAW, Digitaal Wetenschapshistorisch Centrum (dwc.knaw.nl, "Huygens' discovery of a ring around Saturn"), JSTOR Daily ("Christiaan Huygens and the Scientific Secrets of Saturn") og historyofinformation.com. Kun læst som søgeresultater | Ret sikker. **Fælde:** Skriv "viste løsningen i sin bog i 1659", ikke "fortalte det til ingen før 1659" (brevet til Chapelain 1658) |

## 5. Lysets fart (til "For nørder")
| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Rømer viste i 1676, at lyset bruger ca. 22 minutter over Jordbanens bredde (i dag 16 min 38 s). **Han gav aldrig farten i km/s** | fakta-videnskabsfolk.md, afsnit 2 (Phil. Trans. 1677) | Sikker |
| Huygens regnede ud fra Rømers tal: ca. **110 millioner toiser i sekundet**, ca. **214.000 km/s** (1 toise ≈ 1,95 m). I dag: 299.792 km/s. Det var et overslag over størrelsen, ikke en præcis måling | Wikipedia "Rømer's determination …" ("Huygens's estimate was a value of 110,000,000 toises per second … an illustration at an order of magnitude level") og "Treatise on Light" (214.000 km/s) | Ret sikker |
| Huygens beskrev det i *Traité de la lumière* (1690), hvor lyset er bølger | Wikipedia "Treatise on Light" | Ret sikker |

## 6. Nye fælder (også skrevet i fakta-faelder-videnskabsfolk.md)
- "Skriftet om Titan kom i 1655" (Wikipedia "Titan (moon)"). Huygens skriver selv, at det udkom i marts 1656 sammen med anagrammet (dateret 5. marts, s. 2).
- "Anagrammet kom præcis ét år efter Titan" (s. 47 siger 25. marts 1656, men s. 2 siger 5. marts). Huygens husker selv forkert.
- "Saturn vipper, så ringen forsvinder." Ringen peger samme vej i rummet. Det er Saturn og Jorden, der flytter sig om Solen, så vi ser den fra en ny vinkel.
- "Huygens var 26, da han fandt Titan." Han var 25 (født april 1629, Titan marts 1655).
- "Huygens' kikkert forstørrede 43 gange" eller "50 gange". Kilderne er uenige, og bogen giver kun længden og okularet. Skriv "ca. 50 gange" eller "omkring 40-50 gange".
- "Huygens fandt ud af, at ringen består af is og sten." Han troede, den var fast (s. 48). Det var Maxwell (1859) og Keeler (1895).
- "Galilei var en dårlig iagttager." Hans kikkert forstørrede højst ca. 30 gange (Huygens' egne ord). Huygens skriver også, at de andre tegnede i god tro.

## 7. Det, Fable bør se på
- Oversættelsen af s. 46-48 i [drejebog-huygens.md](../drejebog-huygens.md), afsnit 6 (Opus' latin, ikke tjekket af andre).
- Om Saturns ring stod næsten på kant omkring 1656. **Nu Sikker** (s. 16-17, OCR tjekket 16. november 2026): Andre så Saturn rund fra sidst i november 1655, Huygens så den uden arme 16. januar 1656 ("brachiis suis spoliatum penitus") og til 17. juni, og armene var tilbage 13. oktober 1656, "senere end jeg havde forudsagt" ("serius quidem quam … praedixeram").
- Tallet for forstørrelsen (43 eller ca. 50).

## 8. Den røde tråd (faktatjekket 18. november 2026, Opus effort høj)
De nye tekster (forsiden, forordet til "Hemmeligheden", stien i "Bogen fra 1659" og slutningen i "Om Huygens") bruger kun påstande, der allerede står ovenfor. Tjekket mod tabellerne og fælderne:
| Påstand | Kilde | Resultat |
|---|---|---|
| Den italienske astronom Galilei så Saturn som tre kugler i sin kikkert i 1610 | Afsnit 3 | OK. Ikke "den første kikkert" eller "opfandt kikkerten" |
| Senere tegnede andre den med ører og håndtag | Tavlen ved s. 35 (nr. II-IX, 1614-1650) | OK |
| I 45 år fandt ingen den rigtige forklaring | 1610-1655, ringen først i anagrammet 1656 | OK. Ikke "ingen kunne forklare det": Der var gæt, der var forkerte (fx Galileis tre kloder) |
| En ung hollænder på 25, der sliber sine egne linser (Haag, 1655) | Afsnit 1 (født 14. april 1629, Titan 25. marts 1655, linserne med broren) | OK. Alderen står kun på forsiden (26 i marts 1656) |
| Marts 1656: han tror, armene er en ring, men de er væk, og andre kigger også | s. 2 og 16-17, grunden til anagrammet (afsnit 3) | OK |
| 62 bogstaver sorteret efter alfabetet, så alle kan tælle efter | Rækken s. 47 (a c d e g h i l m n o p q r s t u) | OK |
| Systema Saturnium (Saturns system), trykt 1659 | Bogen | OK |
| Tavlen: 13 tegninger fra andre astronomer, kugler, ører og buer | Afsnit 3 | OK |
| s. 16: kom hjem fra en rejse 16. januar 1656 og så Saturn helt uden arme | s. 16 | OK |
| s. 48: han har ikke fundet på ringen, han har set den med sine egne øjne | s. 48 ("oculorum sensu"), uden anførselstegn | OK |
| Han troede, ringen var fast som en plade. Den er utallige stykker is og lidt sten | s. 48 ("solidum"), NASA (ringene er mest vandis med lidt sten og støv) | OK |
| I 2005 landede sonden Huygens på Titan, den måne han fandt | Afsnit 1 | OK |
*Kan tjekkes af Fable senere sammen med resten af bogen.*
