# E13: Faktatjek af det, der står i programmet

*Fable 5.2 (high), 15. november 2026. Opgaven står i [prompt-fable-faktatjek.md](../prompt-fable-faktatjek.md). Alle kilder med adresse er åbnet af mig i dag, medmindre der står "hukommelse" eller "kun Wikipedia". Ingen kode eller tekster er ændret.*

## 1. Det vigtigste først
- **Der står intet alvorligt forkert i programmet.** Af flere hundrede påstande fandt jeg to, der er forkerte (lithium fra Bolivia og zinks "ca. 100 enzymer"), og fem, der er forældede eller for skarpe (Saturns måner, guldterningen, Ganymedes' mørke egne, Lascaux og en sætning om radon).
- **Alle tal i Molekyler passer** med NIST (ioniseringsenergier, dannelsesenthalpier, bindingslængder) og med tabellerne for elektronaffinitet, elektronegativitet og gitterenergi.
- **Alle tal ved Saturn og Jupiter passer** med JPL SSD, NSSDC og USGS Gazetteer. Kun antallet af Saturns måner er vokset (293 i august 2026).
- **"I universet" på grundstofkortene holder**, men ikke kun mod Johnson: Ti, Co, Cu, Zn og Pb følger nyere artikler, som siger noget andet end Johnsons skema (se afsnit 3).
- **Faktafilerne har tre fejl, som ikke er i programmet** (Voyager 2's afstand, Hayabusa2's dato og Jupiters varmetal), se afsnit 2d.

## 2. Det, der skal rettes

### 2a. Grundstofkortene (`js/data/grundstoflag.js`)
| Linje | Der står | Det rigtige | Kilde | Forslag |
|---|---|---|---|---|
| 28, `Li.mere[2]` | "Meget lithium kommer fra saltsøer i Chile, Argentina og Bolivia." | Bolivia har verdens næststørste *forekomster* (23 mio. ton), men står slet ikke på listen over lande, der udvinder. I 2025: Australien 92.000 t (miner), Kina 62.000, Chile 56.000, Zimbabwe 28.000, Argentina 23.000. | USGS Mineral Commodity Summaries 2026, Lithium: https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-lithium.pdf | "Meget lithium kommer fra miner i Australien og saltsøer i Chile." |
| 242, `Zn.krop` | "Ca. 100 enzymer bruger zink, …" | Tallet er gammelt (NIH's faktaark fra 2004). Nu regnes med over 300 enzymer. RSC skriver "over 20", som er endnu ældre. | Wikipedia "Zinc" (afsnittet Biological role, "over 300 enzymes and 1000 transcription factors"): https://en.wikipedia.org/wiki/Zinc. NIH's nye faktaark siger "hundreds" (hukommelse, siden spærrer for automatisk hentning). | "Flere hundrede enzymer bruger zink, også til smag, lugt og immunforsvar. En voksen har ca. 2-3 g." |
| 292, `Au.mere[2]` | "… en terning på ca. 22 meter." | Tallet vokser hvert år. Nu ca. 222.600 ton og 22,6 m. | World Gold Council: https://www.gold.org/goldhub/data/how-much-gold | "… en terning på knap 23 meter." |
| 205, `Mn.vidste` | "… malede stenalderfolk dyr for ca. 17.000 år siden." | Alderen sættes nu til 17.000-22.000 år. (Lille. Kun Wikipedia.) | https://en.wikipedia.org/wiki/Lascaux | "… for mindst 17.000 år siden." |
| 317, `Rn.vidste` | "… uran, der har ligget i jorden siden før Jorden blev dannet." | Sproget modsiger sig selv: Uranet kan ikke ligge i jorden, før Jorden findes. Fakta er rigtige (uranet er ældre end Jorden). | (logik) | "Radonet i en kælder kommer fra uran, som er ældre end Jorden. Det uran blev lavet ude i rummet." |
| 4 (kommentar) | "'I universet' bygger på Jennifer Johnsons periodiske system" | Linjerne for Ti, Co, Cu, Zn og Pb følger ikke Johnson, men Kobayashi m.fl. 2020 og Prantzos m.fl. 2020 (se afsnit 3). | https://arxiv.org/abs/2008.04660 og https://arxiv.org/abs/1911.02545 | Tilføj de to artikler i kommentaren og i faktafilen. Teksten til brugeren ændres ikke. |

### 2b. Saturn
| Fil og linje | Der står | Det rigtige | Kilde | Forslag |
|---|---|---|---|---|
| `js/kosmos/saturn.js:123` og `js/data/sider/saturn.js:64` | "over 280 (2026)" | 293 bekræftede måner i august 2026. | NASA: https://science.nasa.gov/saturn/moons/ ("293 confirmed moons in its orbit as of August 2026") | "over 290 (2026)" |
| `js/data/sider/saturn.js:73` | "Over 280 kendte måner (marts 2026), …" | Samme. | Samme | "Over 290 kendte måner (august 2026), og der bliver stadig fundet nye. …" |

### 2c. Jupiter
| Fil og linje | Der står | Det rigtige | Kilde | Forslag |
|---|---|---|---|---|
| `js/data/sider/jupiter.js:211` | "Omkring en tredjedel af overfladen er mørk." | NASA skriver 40 % mørk og 60 % lys. Wikipedia skriver "about one-third". Kilderne er uenige, og NASA er den primære. (Lille.) | NASA Ganymede Facts: https://science.nasa.gov/jupiter/jupiter-moons/ganymede/facts/ | "Ca. 40 % af overfladen er mørk." |

### 2d. Fejl i faktafilerne, som ikke står i programmet
| Fil | Der står | Det rigtige | Kilde |
|---|---|---|---|
| `fakta-solsystemet/del2-voyager.md` linje 20 og "Mindst sikre" nr. 3 | Voyager 2 ved Jupiter: "570.000 km … eller ca. 720.000 km fra centrum" | 570.000 km er over skytoppene. Fra centrum er det ca. 645.000 km (570.000 + 71.492 ≈ 641.500). "720.000" er forkert. | NASA: https://science.nasa.gov/mission/voyager/voyager-2/ ("about 645,000 kilometers"), Wikipedia "Voyager 2" ("within 570,000 km of the planet's cloud tops") |
| `del2-voyager.md` "Mindst sikre" nr. 1 | Datoen 18. november 2026 for 1 lysdøgn er "usikker" | **Bekræftet:** NASA skriver "on Wednesday, Nov. 18 will have traveled one light-day from Earth … 25.9 billion kilometers". Det er om tre dage. | https://www.nasa.gov/news-release/nasa-invites-media-public-to-join-voyager-1-one-light-day-activities/ |
| `fakta-molekyler.md` afsnit 5 | Ryugu-prøven "landede i Australien 6. december 2020" | 5. december 2020 UTC (6. december lokal tid i Australien). Skriv "december 2020". | https://en.wikipedia.org/wiki/Hayabusa2 (kun Wikipedia) |
| `del5a` "Mindst sikre" nr. 6 | Jupiters varme: "ca. 2,2 er min egen omregning" | Artiklen giver selv tallet: 2,132 ± 0,051 (før 1,668 ± 0,085). Programmets "ca. dobbelt" og "nærmere 2" er rigtigt. | Li m.fl. 2018, Nature Communications: https://pmc.ncbi.nlm.nih.gov/articles/PMC6137063/ |

## 3. Det, der nu er bekræftet (de gamle advarsler kan fjernes)

**`docs/fakta-grundstofkort.md`**
- **"I universet", alle 40 kort:** tjekket mod tre kilder. (1) Tallene bag Wikimedia-tegningen af Johnsons skema, læst direkte ud af filen (https://upload.wikimedia.org/wikipedia/commons/3/31/Nucleosynthesis_periodic_table.svg): He 91 % Big Bang, Li 23/13/64, C og N 25/75, Si 71/29, S 58/42, Ca 51/49, Mn 84 % hvide dværge, Fe 64 %, Ni 70 %, Ag 81 % r, Sn 69 % s, W 57 % s, Hg 62 % s. (2) Kobayashi, Karakas og Lugaro 2020 (ApJ 900:179, arXiv 2008.04660): 49 % af C, 51 % af F og 74 % af N fra døende stjerner. 22 % af Si, 29 % af S, 34 % af Ar og 39 % af Ca fra hvide dværge. Fe 60 % fra hvide dværge. "Co, Cu, Zn … are largely produced by HNe" (kæmpestjerner). (3) Prantzos m.fl. 2020 (MNRAS 491:1832, arXiv 1911.02545), s-andele: Ag 0,21, Sn 0,68, I 0,03, W 0,60, Pt 0,08, Au 0,06, Hg 0,55, Pb 0,83. Bisterzo m.fl. 2014 (arXiv 1403.1764) giver det samme inden for ±10.
- **Hvor programmet med rette afviger fra Johnson:** Johnson har Ti 65 %, Co 67 %, Cu 58 % og Zn 54 % fra hvide dværge og Pb kun 47 % fra s-processen. Programmet siger "mest kæmpestjerner" for Ti, Co, Cu og Zn og "mest s-processen" for Pb, og det er det, de nyere artikler siger. Behold teksterne.
- **Punkterne under "Skal tjekkes, før kortet deles bredt":** De danske 1-, 2- og 5-kroner er kobbernikkel (Nationalbanken, https://www.nationalbanken.dk/da/vores-arbejde/sedler-og-moenter/danske-moenter-i-dag/moentraekken). Plutonium: "Over one-third of the energy produced in most nuclear power plants comes from plutonium" (https://world-nuclear.org/information-library/nuclear-fuel-cycle/fuel-recycling/plutonium). Radon-tallet (300) står ikke i programmet.
- **"I din krop":** O 43, C 16, H 7 og N 1,8 kg er ICRP's tal. Resten passer med Emsleys tabel (https://en.wikipedia.org/wiki/Composition_of_the_human_body): P 780 g, K 140 g, S 140 g, Na 100 g, Cl 95 g, Mg 19 g (RSC: 25 g), Zn 2,3 g, F 2,6 g, Si 1 g, Cu 72 mg, B 18 mg, Mn 12 mg, Li 7 mg, Co 3 mg. Brint er 63 % af atomerne.
- **(H)-punkterne og "Mindst sikre":** Platin fra Sydafrika: 120 af 170 ton i 2025, ca. 70 % (USGS MCS 2026, https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-platinum-group.pdf). Wolfram er "the heaviest metal to have a known biological role" (https://periodic-table.rsc.org/element/74/tungsten). Bly: "no level of exposure … known to be without harmful effects" (https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health). Bekræftet på Wikipedia (med kilder dér): OL-guldmedaljen (6 g guld, 92,5 % sølv), neon 18,2 ppm og nr. 5 i universet, tin 10 stabile isotoper og tinskriget, bladguld 0,1 µm, kviksølv 13,5 g/cm³, radon 3,82 døgn, kalium-40 3.850-4.300 Bq, argon-40 99,6 %, beryllium-8 8·10⁻¹⁷ s, blybenzin juli 2021, Frihedsgudinden 2,4 mm, Solen 600 mia. kg brint i sekundet, 1-cent 97,5 % zink, nickel 75/25, kilogrammet til 2019, GW170817 ca. 10 jordmasser guld og platin, scandium i cykelstel og sportsudstyr, vanadium i søpunge, titan og knogler.
- **`js/data/grundstoffer.js` (de korte fakta) og `js/data/kategorier.js`:** læst igennem, ingen fejl fundet. Gruppernes navne blev tjekket mod åbnede sider 7. november.

**`docs/fakta-molekyler.md`**
- **Afsnit 1 og 7 (tallene i `js/data/molekyler.js`):** alle ioniseringsenergier passer ciffer for ciffer med NIST Handbook (https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable1.htm og de seks andre). Elektronaffiniteterne, også O⁻ = −7,71 eV, passer med https://en.wikipedia.org/wiki/Electron_affinity_(data_page). Gitterenergierne 1.030, 786 og 3.795 kJ/mol passer med https://en.wikipedia.org/wiki/Lattice_energy. NaCl-parret: 2,3608 Å (NIST WebBook) og 4,26 eV, 0,236 nm og 1,52 eV (OpenStax §9.1, åbnet). Slaters radier, CaCl₂'s gitter (6,379 og 4,193 Å) og MgO's smeltepunkt (2.852 °C) passer.
- **Afsnit 2:** Paulings tal for H, Li, C, N, O, F, Na, Mg, Cl og Ca passer alle (https://en.wikipedia.org/wiki/Electronegativities_of_the_elements_(data_page)).
- **Afsnit 3 (`LÆNGDER` i `js/data/molekyler-byg.js`):** de toatomige er tjekket i NIST WebBook (Huber og Herzberg): H₂ 0,7414, O₂ 1,2075, N₂ 1,0977, Cl₂ 1,9879, HCl 1,2746, CO 1,1283 og OH 0,9697 Å. Vinklerne: vand 104,48°, ammoniak 106,7° (Wikipedia). De fleratomige længder kunne ikke tjekkes i CCCBDB i dag (se afsnit 4), men Opus åbnede dem 7. november.
- **Afsnit 4 (`js/data/knaldgas.js`):** ΔfH for H 218,00, O 249,18, OH 38,99 og H₂O −241,83 kJ/mol passer med NIST WebBook (https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Units=SI&Mask=1 og de tre andre). De fire bindingsenergier er regnet rigtigt ud af dem.
- **Hverdagsteksterne i `KENDTE_LISTE`:** kulilte ca. 200-240 gange ("over 200" er rigtigt), CO₂ 0,043 % af luften, ethen som plantehormon, dimethylether som drivgas, HCN på Titan, ethyn over 3.300 °C. Ingen fejl.
- **Afsnit 5 (Jordens vand):** står ikke i programmet. Stikprøver passer: VSMOW 155,76 ppm, Bennu-prøven 24. september 2023, Europa Clipper april 2030 og 49 forbiflyvninger.

**`docs/fakta-solsystemet/del1-saturn-og-maanerne.md`**
- **Afsnit 4b og tallene i `js/kosmos/saturn.js`:** radier og tæthed passer med JPL SSD (https://ssd.jpl.nasa.gov/sats/phys_par/): Mimas 198,2, Enceladus 252,1, Tethys 531,1 (0,984 g/cm³), Dione 561,4, Rhea 763,5, Titan 2.574,76, Iapetus 734,3 km. Afstande og omløbstider passer med NSSDC (https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturniansatfact.html) inden for 0,02 %. Herschel 139 km, Odysseus 445 km og Ithaca Chasma 1.219 km passer med Gazetteer (https://planetarynames.wr.usgs.gov/Feature/2478, /4406 og /2751).
- **"Mindst sikre":** nr. 3 er bekræftet (134 K ved 1 bar, hældning 26,73°, radier 60.268 og 54.364 km, NSSDC). Nr. 4: JUICE fløj forbi Venus 31. august 2025 og Jorden 28. september 2026, bane om Ganymedes fra december 2034 (kun Wikipedia). Ringenes kanter passer med NSSDC (D 66.900, A 136.780, G 166.000-173.000, E 180.000-480.000 km). Cassini-delingen er 4.600 km hos PDS og 4.830 km hos NSSDC. Programmets "ca. 4.600" kan blive.
- Mimas' hav (20-30 km, under 25 mio. år), Titan (1,45 atm, 93,7 K) og Huygens 14. januar 2005 passer.

**`docs/fakta-solsystemet/del5a` og `del5b` (Jupiter)**
- **Tallene i `js/kosmos/jupiter.js`:** radier og afstande passer med JPL SSD, og omløbstiderne 1,769138, 3,551181, 7,154553 og 16,689017 døgn med NSSDC. Jupiter: 71.492 og 66.854 km, fladtrykning 0,06487, døgn 9,9250 timer, hældning 3,13° (NSSDC).
- **Ringene:** alle tal i `SIDER.ringe` står i NSSDC's faktaark (hovedringen 123.000-128.940 km, under ca. 100 km tyk, glorien ca. 10.000 km, optisk dybde 5·10⁻⁶, 3·10⁻⁶ og 10⁻⁷).
- **115 måner** er NASA's tal i dag (https://science.nasa.gov/jupiter/jupiter-moons/). Juno er i drift (14. november 2026) og forlænget til september 2028 (kun Wikipedia). Cyklonerne ligger ved ca. 84° N og S (Gavriel og Kaspi 2021, arXiv 2110.09422).
- **Månerne:** Io hæver sig 100 m, Europas is 15-25 km og hav 60-150 km, Ganymedes' hav 100 km under 150 km is, Callistos mulige hav 250 km nede ("or may not exist at all") står alle på NASA's faktasider. Juno målte "about 29 kilometers" (https://www.jpl.nasa.gov/news/nasas-juno-measures-thickness-of-europas-ice-shell). Valhalla ca. 3.800 km og pletten (1831, 4,5 døgn, 22° S) kun på Wikipedia.

**`docs/fakta-solsystemet/del2-voyager.md`:** "Mindst sikre" nr. 1 og 3 er afklaret (afsnit 2d), og nr. 6 passer (BepiColombo 21. november 2026, kun Wikipedia). Nr. 2, 4, 5 og 7 er ikke tjekket.

## 4. Det, jeg ikke kunne tjekke
| Hvad | Hvorfor |
|---|---|
| Bindingslængder og vinkler for de fleratomige molekyler i CCCBDB | `cccbdb.nist.gov` faldt ud af miljøets liste midt i arbejdet. Tjekket af Opus 7. november. |
| Johnsons figur i Science 2019 | `www.science.org` afviser automatisk hentning (403). Brugt i stedet: tallene bag Wikimedia-tegningen (Johnsons webudgave) og to nyere artikler. |
| NIH's faktaark (Mg ca. 25 g og over 300 enzymer, zink) | `ods.od.nih.gov` afviser automatisk hentning. RSC og Wikipedia er brugt. |
| Amalgam i EU fra 2025, iod i dansk salt | `eur-lex.europa.eu` og `www.retsinformation.dk` kræver en browser med JavaScript. Begge er kendt stof (hukommelse). |
| Radon: måling i 2-3 måneder, Bornholm | `www.sst.dk` svarede 429 (for mange forespørgsler) tre gange. |
| US Mint (nickel og cent) | `www.usmint.gov` afviser automatisk hentning. Wikipedia er brugt. |
| Størrelsen på cyklonerne ved polerne (4.000-4.600 og 5.600-7.000 km) og den sjette cyklon | Adriani m.fl. 2018 i Nature sender videre til `idp.nature.com`, som ikke er åben. |
| Sølv til solceller (en sjettedel), ammoniak til gødning (70 %), aluminium i kroppen (30-50 mg), chlor i dansk drikkevand | Silver Institute, IEA, ATSDR og Miljøstyrelsen står ikke på listen. Tallene er rimelige (hukommelse). |
| Jupiters plet i km, nordlysets farve, Ios udbrud i 2024, Callistos skygger | Ikke nået. De er skrevet forsigtigt i programmet. |

## 5. Til den, der retter
- Rettelserne i afsnit 2a-2c er syv linjer i tre filer. Kør `node tests/koer-alle.mjs --ændret` bagefter (ingen test bruger de gamle tekster, tjekket med `grep`).
- Fjern advarslerne "ingen kildesider kunne åbnes" i de fem faktafiler, og henvis hertil. Ret de fire linjer i afsnit 2d.
- Seks nye fælder står nederst i [fakta-faelder.md](../erfaringer/fakta-faelder.md).
