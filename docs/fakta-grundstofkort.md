# Faktagrundlag: Grundstofkortet i lag

*Punkt 7, 23. oktober 2026. Teksterne i `js/data/grundstoflag.js` er skrevet af tre hjælpeagenter (Opus, høj effort) og gennemgået af Opus. Ikke tjekket af Fable.*

**Hvordan det er tjekket:** Agenterne kunne kun bruge websøgning. Ingen kildesider kunne åbnes i miljøet, så tallene er tjekket mod søgeresultater og deres uddrag. Det, de kun havde fra deres egen viden, er mærket "(H)" eller "egen viden" herunder.

**Det, Opus har rettet eller fjernet ved gennemgangen** (tjekliste B: hellere for forsigtigt end forkert):
- Fjernet, fordi kilden manglede: berylliumkobber, der ikke slår gnister, Epsom-salt, vibrationsmotorer af wolfram, scandium i stadionlamper, brændselspillen, der svarer til 1 ton kul, og "Pt er næsten lige så sjældent som guld".
- "I universet" er skrevet mere forsigtigt, hvor fordelingen er usikker: Li ("hvilke stjerner er usikkert"), B (kun kosmisk stråling, som hos Johnson), Cr og V ("både … og"), Cu ("forskerne er ikke helt enige"), W og Hg ("omtrent halvdelen"), og Ag, I, Pt og U ("nok mest" fra neutronstjerner, for r-processen kan også ske andre steder).
- Lithiums "Vidste du?" er skiftet ud med et sikkert tal (massefylde 0,53 g/cm³, ca. halvt så tung som vand).
- Beryllium-8: "Derfor laver stjerner næsten intet beryllium" er blevet til, at stjernernes beryllium ikke kommer den vej (det meste kommer fra kosmisk stråling).
- Bly: "benzin med bly til biler" (fly med stempelmotor bruger stadig blyholdig benzin).
- Platin og guld: Kilonovaen i 2017 lavede "nok" guld og platin (de blev ikke set direkte), og det var guld og platin tilsammen.
- Mangan: "Te, nødder og fuldkorn" er fjernet (ikke slået op).
- Stavemåden følger `js/data/grundstoffer.js`: chrom, cobalt, iod.
- Links til Atomværkstedet er fjernet, for kortet har allerede knappen "Byg det i værkstedet".

**Skal tjekkes, før kortet deles bredt** (`/faktatjek` med adgang til kilderne):
- Johnsons figur i Science 2019 (andelene i "I universet"), især for Ti, V, Cr, Co, Ni og Cu.
- Radon: ca. 300 tilfælde af lungekræft om året i Danmark (Sundhedsstyrelsens ældre skøn).
- De danske 1-, 2- og 5-kroner af kobbernikkel (Nationalbanken).
- Plutonium: "ca. en tredjedel af energien" i et typisk atomkraftværk (World Nuclear Association).

## Nr. 1-14 (H-Si)

Jeg har skrevet kortene til alle 14 grundstoffer. Alle tekster holder sig inden for længderne (tjekket med et lille script), og de modsiger ikke `fakta.js` eller `fusion.js`. Jeg har ikke ændret nogen filer.

**Om kilderne:** Jeg kunne kun bruge websøgning. Netværket afviste næsten alle sider (rsc.org, wikipedia, ohio-state.edu, science.org, phys.org og PDF-kopierne af Johnsons artikel). Alle kildesider nedenfor kender jeg derfor kun fra søgeresultater. Den eneste fil, jeg selv har kunnet åbne og regne på, er Wikimedia-tegningen af Johnsons tabel. Andelene er regnet ud af dens skraveringsdata, så de er groft aflæste. Den bygger på Johnsons webudgave (ca. 2017) og ikke på figuren i Science 2019, som jeg ikke kunne åbne. Andelene i "univers" bør derfor tjekkes mod Science-figuren.

### 1. Kortene

*(Teksterne står nu i `js/data/grundstoflag.js`, rettet som beskrevet øverst.)*

Et udkast ligger også i `/tmp/claude-0/-home-user-atomlab/a5ff1646-2a7a-5247-a5da-527291d3691d/scratchpad/kort.mjs`, sammen med længdetjekket. Det er ikke helt den endelige udgave. Fem tekster blev rettet til sidst, og de er kun rettet i blokken ovenfor: He mere[2], C mere[0], N hverdag, O mere[1] og Na mere[2]. Tag teksterne fra blokken her.

**Hvor teksterne skal kunne trykkes på:** Ordbogen har ikke "kosmisk stråling", "supernova", "nova" eller "enzym". Hvis kortene ligger i en ordforklaringszone, bør mindst "kosmisk stråling" og "supernova" ind i ordbogen. Pas på, at formen "kosmisk stråling" ikke rammer det eksisterende opslag "Den kosmiske baggrundsstråling".

### 2. Kilder (kun set som søgeresultater, medmindre andet står)

**Oprindelse (univers), alle grundstoffer:**
- Wikimedia `upload.wikimedia.org/wikipedia/commons/3/31/Nucleosynthesis_periodic_table.svg` (CMG Lee ud fra Johnsons data). Denne fil har jeg åbnet. De groft aflæste andele:
  - H: 100 % Big Bang.
  - He: 91 % Big Bang, 5 % kæmpestjerner, 4 % små stjerner.
  - Li: 64 % små stjerner, 23 % Big Bang, 13 % kosmisk stråling.
  - Be og B: 100 % kosmisk stråling.
  - C og N: ca. 75 % små stjerner og 25 % kæmpestjerner.
  - O, F, Ne og Na: 100 % kæmpestjerner.
  - Mg og Al: ca. 99-100 % kæmpestjerner.
  - Si: ca. 71 % kæmpestjerner og 29 % hvide dværge.
- Johnson, Science 363:474 (2019), https://www.science.org/doi/10.1126/science.aau9540. Ikke åbnet.
- APOD 24.10.2017, https://apod.nasa.gov/apod/ap171024.html.
- Litium og novaer: https://observatoiredeparis.psl.eu/novae-lithium-factories.html og https://bigthink.com/?p=152884.
- Fluor (AGB-stjerner og kæmpestjerner, "debated"): https://arxiv.org/pdf/2009.13374 og https://www.aanda.org/articles/aa/full_html/2025/04/aa53209-24/aa53209-24.html.
- B-11 fra supernovaer (neutrino-processen): https://arxiv.org/pdf/1510.04643.

**Kroppen:**
- https://www.knowledgedoor.com/2/elements_handbook/element_abundances_in_the_human_body.html (70 kg). Den dækker Na 100 g, Mg 19 g, B 18 mg, Li 7 mg og Si 1 g.
- RSC-tabel (via søgning): F 2,6 g.
- https://elements.visualcapitalist.com/the-elemental-composition-of-a-human-body/ (ICRP). Den dækker O 43, C 16, H 7 og N 1,8 kg.
- Wikipedia "Composition of the human body": H 62 % af atomerne.
- NIH ODS Magnesium: over 300 enzymer.
- Aluminium 30-50 mg: ATSDR https://www.atsdr.cdc.gov/ToxProfiles/tp22-c2.pdf.
- Bor er nødvendigt for planter, men det er ikke vist for mennesker: https://pmc.ncbi.nlm.nih.gov/articles/PMC7442337.
- Silicium, ikke fastslået: https://pmc.ncbi.nlm.nih.gov/articles/PMC8283247.
- Beryllium og lungesygdom: Wikipedia "Berylliosis".

**Andre fakta:**
- James Webb-spejlene af beryllium: https://jwst.nasa.gov/mirrors.html.
- Flydende ilt er blåt og magnetisk: https://chemed.chem.purdue.edu/genchem/demosheets/14.2.html.
- Helium bliver ikke fast (ca. 25 atm): https://www.chemicool.com/elements/helium-facts.html.
- Litium flyder på olie: CIA-dokument om metallurgi og Wikipedia-kopier.
- Helium fra uran og thorium: USGS, https://www.usgs.gov/publications/prodigious-degassing-a-billion-years-accumulated-radiogenic-helium-yellowstone.
- Neon 18 ppm og nr. 5 i universet: https://www-jmg.ch.cam.ac.uk/data/weii/neon.html. Rent neon er rødorange: Wikipedia "Neon sign".
- Solen bruger 600 mio. ton brint i sekundet: RSC og OpenStax. Jeg fandt ikke NASA's egen side.
- Ordet "fluorescens" (Stokes 1852, fluorit): https://www.etymonline.com/word/fluorescence.
- Genbrug af aluminium sparer ca. 95 % af energien: https://international-aluminium.org/landing/aluminium-recycling-saves-95-of-the-energy-needed-for-primary-aluminium-production/.
- Rubin og krom: GIA, https://www.gia.edu/gem-education/gem-encyclopedia/gem-encyclopedia/ruby/gem-overview.
- Slim med borax: https://edu.rsc.org/experiments/pva-polymer-slime/756.article.
- Magnesium i klorofyl: undervisningssider (svag kilde, men det er lærebogsviden).
- Jordskorpen (O 46 %, Si 28 %, Al 8 %): WorldAtlas. Jeg fandt ikke USGS direkte.

**Fra lærebøger, ikke slået op enkeltvis:** flydende nitrogen -196 °C, helium -269 °C, C-14 op til ca. 50.000 år, Hindenburg 1937, chips pakket i nitrogen, TNT, ca. 35 g salt pr. liter havvand, ikke-gnistende værktøj af berylliumkobber, kiselalger.

### De påstande, jeg er mindst sikker på

1. **Li univers:** Hos Johnson kommer det meste fra små, døende stjerner, men nyere arbejde peger på novaer (eksplosioner på hvide dværge). Andelene er usikre.
2. **F univers:** Webudgaven af Johnsons tabel siger 100 % kæmpestjerner, mens nyere forskning peger mest på døende stjerner som Solen (AGB). Derfor står der "Ikke helt sikkert".
3. **B univers "Lidt fra supernovaer":** Det står ikke i Johnsons webtabel, men bygger på forskning i neutrino-processen. Det kan fjernes for at følge Johnson.
4. **Andelene for C, N, He og Si** er aflæst af skraveringen i tegningen, ikke af et tal fra Johnson.
5. **Mg i kroppen:** Emsley siger 19 g og NIH ca. 25 g (det sidste kunne jeg ikke bekræfte). Derfor står der "ca. 20-25 g".
6. **F i kroppen:** "Ca. 3 g" er rundet op fra 2,6 g.
7. **Mere-punkterne om berylliumkobber, Epsom-salt og magnesiumfælge** er ikke slået op i en primær kilde.

## Nr. 15-30 (P-Zn)

### Grundstofkort for P-Zn (nr. 15-30)

Vigtigt om kilderne: Jeg kunne ikke åbne en eneste kilde. WebFetch gav DNS-fejl på alle adresser, også rsc.org, wikipedia.org, commons.wikimedia.org og drkohn.org. Alt nedenfor er derfor tjekket mod søgeresultater og deres uddrag, og ikke mod selve kildesiderne.

Jeg har ikke ændret nogen filer. Teksterne modsiger ikke `fakta.js`, og de gentager ikke dets navne- og opdagelsestekster. Jeg har brugt stavemåden fra `grundstoffer.js` (chlor, chrom, cobalt) og ordbrugen fra `kosmos/hviddvaerg.js` ("hvide dværge, der eksploderer").

*(Teksterne står nu i `js/data/grundstoflag.js`, rettet som beskrevet øverst.)*

### Kilder (kun søgeresultater og uddrag, ingen sider åbnet)

**Fælles**
- Kroppens indhold (70 kg, Emsley-tal): Wikipedias tabel "Composition of the human body" og knowledgedoor.com, "element abundances in the human body". Tallene er Fe 4,2 g, Zn 2,3 g, Cu 72 mg, Mn 12 mg, Ni 15 mg, Cr 14 mg og Co 3 mg. P 780 g, S 140 g, Cl 95 g, K 140 g og Ca ca. 1 kg er fra den samme tabel, men jeg kender dem fra Emsley og har ikke set dem i et uddrag. IUPAC-siden old.iupac.org/didac siger P 700 g og Ca 1.050 g. Derfor står P som "0,7-0,8 kg".
- Grundstoffernes oprindelse, Fe og Ca: astrobiology.com (2022), som opsummerer NASA/Chandras grafik ud fra Johnsons data. Ca. halvdelen af calcium og ca. 40 % af jernet kommer fra eksploderende kæmpestjerner, og resten fra hvide dværge. galacticarchaeology.nd.edu siger, at det meste jern kommer fra type Ia. ipmu.jp siger, at type Ia er hovedkilden til Mn, Fe og Ni. Selve Johnsons tal for de andre grundstoffer kunne jeg ikke åbne.
- Zink: arXiv 2508.16717 (cf. Bisterzo 2014) siger ca. 80 % fra kæmpestjernernes eksplosioner og 20 % fra den svage s-proces. Kobber: flere kilder er uenige (se nedenfor).

**Pr. grundstof**
- **P:** ods.od.nih.gov (Phosphorus fact sheet: ca. 85 % i knogler og tænder). edu.rsc.org og sciencehistory.org om Hennig Brand, der kogte tis ind for at lave guld.
- **S:** science.nasa.gov/APOD om Io: svovl og frossen svovldioxid.
- **Cl:** CDC MMWR 2007 (cdc.gov/media/mmwrnews/2007/n070913.htm): lugten kommer fra chloraminer. Miljøstyrelsen, "Rent drikkevand" (2015): 99,9 % af drikkevandet er grundvand, og der tilsættes ingen stoffer. Chlors andel af PVC er regnet: 35,45/62,5 = 57 %.
- **Ar:** Wikipedia "Isotopes of argon" og "Potassium-40": luftens argon er 99,6 % ⁴⁰Ar fra ⁴⁰K. Klasseværelset er regnet: 168 m³ × 0,93 % ≈ 1,6 m³.
- **K:** hps.org (Health Physics Society) siger ca. 4.200 Bq, og Wikipedia siger 3.850-4.300 Bq. Regnet: 140 g × ca. 31 Bq/g ≈ 4.300 Bq. Teksten siger "ca. 4.000".
- **Ca:** lex.dk ("coccolitter", "Møns Klint") og Naturstyrelsens folder: kalkalger, ca. 70 mio. år. Fyrværkeri: TAMU Galveston og Mental Floss (calcium giver orange).
- **Sc:** lindahall.org, RSC-podcasten og Wikipedia "Mendeleev's predicted elements": ekabor 1871, Nilson 1879, Cleve så sammenhængen.
- **Ti:** Kilder om "45 % lettere" (westportlibrary.libguides.com) er svage. Jeg har selv regnet: 1 - 4,51/7,87 = 43 %. Derfor står der "ca. 40 %".
- **V:** Henry Ford-museets blog og sciencehistory.org ("The rocks at the top of the world"): vanadiumstål i Model T. Hiroshima University (Michibata): søpunge, 350 mM, 10⁷ × havvand.
- **Cr:** EFSA Journal 2014 (efsa.europa.eu/en/efsajournal/pub/3845): ingen bevis for, at chrom er nødvendigt.
- **Mn:** usgs.gov (Manganese statistics): 85-90 % til stål, og årbøgerne siger over 90 %. OSTI/Springer (Chalmin m.fl.): manganoxid i Lascaux' sorte farve.
- **Fe:** Chandra/astrobiology.com (60/40, se ovenfor).
- **Co:** Battery University-kopi og intechopen: lithium-cobaltoxid i telefoner. Lyset fra cobalt-56 passer med `hviddvaerg.js`.
- **Ni:** US Mint-sammendrag (moneymetals.com, numismaticnews): 75/25. Ahlström m.fl. 2017 og Cutis/MDedge: nikkel er den mest almindelige kontaktallergi.
- **Cu:** Scientific American og National Geographic: hæmocyanin. copper.org (2011): 3/32 tomme ≈ 2,4 mm.
- **Zn:** NIH ODS (arkiveret 2004) og en kilde, der citerer fagudgaven: ca. 100 enzymer, smag og lugt. Pfizer skriver "over 70". moneymetals: 97,5 % zink siden 1982.

### Mindst sikre påstande
1. **"univers" for Ti, V, Cr, Mn, Co, Ni og Cu.** Rangordenen er min egen viden, ikke Johnsons tal. Kun Fe og Ca har tal fra en kilde. Kobber er mest usikkert: Studierne siger alt fra "mest fra kæmpestjerner" til "mest fra type Ia". Cobalt og vanadium er nok de næste. Johnsons figur bør tjekkes direkte.
2. **Ca: "Næsten alt i knogler og tænder" (99 %).** Det er velkendt, men jeg så det ikke i et uddrag.
3. **Ni: danske 1-, 2- og 5-kroner er af kobbernikkel.** Den eneste kilde var skagenonline.dk. Tjek det hos Nationalbanken.
4. **Co: "mange telefonbatterier".** Det er sikkert for de fleste ældre telefoner, men jeg fandt ingen tal for markedsandele i dag.
5. **Sc: aluminium med scandium i cykelstel og sportsudstyr og i stadionlamper.** Jeg kender det fra egen viden og har ikke tjekket det.
6. **Ti: "vokser fast i knoglen".** Det er egen viden og ikke tjekket.
7. **S: "også i prutter".** Det er egen viden og ikke tjekket.
8. **Mn: "Te, nødder og fuldkorn".** Det er egen viden og ikke tjekket.
9. **Chlor i drikkevandet.** Kilden er Miljøstyrelsens hæfte fra 2015. Der findes enkelte undtagelser, deraf "normalt".

## Ag, Sn, I, W, Pt, Au, Hg, Pb, Rn, U og Pu

### 1. Tekster til grundstofkortet

Jeg har ikke ændret nogen filer. Udkastet ligger også i /tmp/claude-0/-home-user-atomlab/a5ff1646-2a7a-5247-a5da-527291d3691d/scratchpad/lag.mjs, men Pb.univers og Hg.mere[1] står kun rettet her nedenfor. Jeg har målt længderne med et script. Alle tekster holder sig inden for grænserne, bortset fra fire, der er 1-2 tegn for lange (W.krop er 92, Rn.mere[1] er 81).

*(Teksterne står nu i `js/data/grundstoflag.js`, rettet som beskrevet øverst.)*

Teksterne passer med `FAKTA` i js/data/fakta.js og med de korte fakta i js/data/grundstoffer.js. Det gælder fx W ca. 3400 °C, tin med 10 stabile isotoper som i isotoper.js og Pu med "kun spor i naturen".

**Ting, du skal tage stilling til:**
- **Stavemåden iod og jod er ikke ens i programmet.** grundstoffer.js og fakta.js skriver "Iod", men js/kosmos/kilonova.js skriver "Jod" (linje 10 og 27). Jeg har brugt "iod".
- **Nye ord til ordbogen:** "r-processen" og "s-processen" findes ikke i js/data/ordbog.js. De bør med, fx sådan:
  - r-processen: "kerner fanger neutroner så hurtigt, at de ikke når at henfalde imens"
  - s-processen: "langsom neutronfangst i døende kæmpestjerner (AGB-stjerner)"
  - "Struma" og "cisplatin" er forklaret i selve teksten.
- **Et forbehold, der ikke er skrevet i teksterne:** Johnsons skema henfører hele r-processen til neutronstjerner, der støder sammen. Andre steder kan bidrage, fx collapsarer (sjældne kæmpestjerner, der falder sammen) og magnetarer. Derfor står der "nok mest" i teksterne.

### 2. Kilder og sikkerhed

**Vigtigt om metoden:** WebFetch kunne ikke slå nogen adresser op (ENOTFOUND for alle domæner, også science.org, rsc.org og wikipedia). Alt nedenfor bygger derfor på de resuméer, websøgningen gav. Jeg har ikke åbnet en eneste kilde selv. Det, der er markeret med (H), har jeg fra min egen viden, og det er ikke tjekket på nettet.

**Oprindelse (alle grundstofferne):**
- Søgeresultaterne om Johnsons skema (sciencealert.com, popsci.com/neutron-star-gold med kreditten "Jennifer Johnson/NASA/ESA" og york.cuny.edu/ia/spergel-lecture-series) giver de seks kategorier i skemaet.
- Ag med ca. 80 % fra r-processen: aanda.org/articles/aa/full_html/2026/07/aa59578-26, som citerer Sneden m.fl. 2008 og Prantzos m.fl. 2020.
- Pb med ca. 87 % fra s-processen (Sneden 2008): indico.gsi.de, Gallinos slides.
- Usikkerheden om guld: sciencenews.org om collapsarer (op til 80 % af r-processen ifølge Siegel) og physicsworld.com om magnetarer (op til ca. 10 %). Samme kilde siger, at GW170817 lavede ca. 10 jordmasser guld og platin.
- **Mindst sikker:** andelene fra s- og r-processen for Sn ("mest s"), W ("lidt over halvdelen s"), Hg ("mest s") og I, Pt og Au ("næsten alt r") (H). Kildernes tabel kunne jeg ikke se. Hg og W er de mest usikre (ca. 55-65 % s), så du kan skrive "omtrent halvdelen" i stedet.

**Ag:**
- Argyri, og at sølv ikke er et nødvendigt næringsstof: info.gov.hk (Hongkongs sundhedsmyndighed) og webmd.com.
- Solcellerne brugte 197,6 mio. ounce i 2024 ud af ca. 1,16 mia., altså ca. 17 %. Brøken har jeg selv regnet ud fra pv-magazine.com, der citerer Silver Institutes World Silver Survey 2025.
- OL-medaljerne har mindst 6 g guld og en kerne af 92,5 % sølv. Det kommer kun fra sekundære kilder (NBC, APMEX), ikke fra IOC selv.

**Sn:**
- 10 stabile isotoper, hvoraf 3 kun er "set stabile": Wikipedia via søgningen. Det passer med isotoper.js.
- Tinskriget: Wikipedia og melscience.com.
- Bronze med ca. 10 % tin, stanniol og at tinstoffer er giftige (H).

**I:**
- Kravet om 20 mg iod pr. kg salt (BEK nr. 613 af 2019): retsinformation.dk og leap.unep.org.
- Iodtabletter: videnskab.dk og ing.dk. Jeg fandt ikke sst.dk selv.
- Stivelsesprøven, den lilla damp og struma (H).

**W:**
- Det tungeste grundstof, som noget levende bruger (kun nogle prokaryoter): pubs.rsc.org (Dalton Trans. 2025) og Inorganics 2020.
- Massefylden 19,25 mod guldets 19,3 og falske barrer: fastmarkets.com og journal.umk.edu.my.
- Vibrationsmotorer: kun patenter (patents.google.com US8137778). Mange nye mobiler bruger en anden slags motor, så "tit" er bevidst forsigtigt.
- Dartpile og wolframcarbid (H).

**Pt:**
- Kilogrammet indtil 20. maj 2019: søgeresultater, der henviser til BIPM og industry.gov.au. Det ligger i Saint-Cloud ved Paris, derfor står der bare "Frankrig".
- "Næsten lige så sjældent som guld" (ca. 0,005 mod 0,004 ppm i jordskorpen) og "det meste fra Sydafrika" (ca. 70 %) (H). USGS-tallene kunne jeg ikke se, og søgningen viste 49 % for Sydafrika i en anden tabel.

**Au:**
- Alt udvundet guld er ca. 216.000 t (World Gold Council, gold.org, via søgningen). 216.000 t / 19,3 t/m³ = 11.200 m³, og det giver en terning med ca. 22,4 m sider.
- Bladguld på 0,1 µm og E175 (H).

**Hg:**
- Metylkviksølv i rovfisk og nervesystemet: WHO's faktaark (2016-kopi, e-lactancia.org) og EFSA (just-food.com).
- Amalgam i EU fra 1. januar 2025, med undtagelser til 30. juni 2026: oeil.europarl.europa.eu (forordning 2024/1849).
- Bly flyder på kviksølv (11,3 mod 13,5-13,6): opgaver fra lærebøger.
- −39 °C, og at man ikke må støvsuge kviksølv (H).

**Pb:**
- "Ingen kendt sikker mængde": WHO og UNICEF (ceh.unicef.org). Den præcise ordlyd fandt jeg ikke.
- Benzin med bly sluttede i juli 2021 (Algeriet): unep.org.
- Plumber og plumbum samt romerske vandrør (H).

**Rn:**
- Ca. 300 tilfælde af lungekræft om året (Sundhedsstyrelsens skøn), de fleste hos rygere, og grænsen på 100 Bq/m³: ing.dk og videnskab.dk. Kilderne er fra 2011-2016, så tjek sst.dk.
- Måling i 2-3 måneder i vinterhalvåret og Bornholm: bolius.dk og sst.dk (radonrapport 2001).
- Halveringstiden 3,8 døgn (H, NUBASE).

**U:**
- Oklo, ca. 2 milliarder år siden (andre siger 1,8): iaea.org/node/51357.
- Giftigt for nyrerne: Health Canada og WHO (news.un.org).
- Brændselspillen (H, men regnet efter): 10 g UO₂ indeholder ca. 8,8 g U. Med 45 MWd/kg giver det ca. 3,4·10¹⁰ J. Kul giver 24-30 MJ/kg, så det svarer til ca. 1,1-1,4 t kul.
- Halvdelen af U-238 er henfaldet: halveringstid 4,47 mia. år mod Jordens alder på 4,54 mia. år (H).
- Uranglas (H).

**Pu:**
- 4,8 kg PuO₂ og overskudsvarmen: jpl.nasa.gov (pressemappen om Mars 2020).
- Pu-244 i havbunden (ca. 180 atomer): physicsworld.com og sciencealert.com om Wallner m.fl., Science 2021.
- "Ca. en tredjedel af energien" (World Nuclear Association), Nagasaki og Voyager (H).

**Mindst sikker, samlet:**
1. Andelene fra s-processen for W, Hg og Sn.
2. Sydafrikas andel af platin og at platin er lige så sjældent som guld.
3. "En tredjedel" for Pu.
4. Vibrationsmotorer.
5. Radon-tallet på 300, som er fra et ældre skøn.

Kør `/faktatjek` på punkterne med (H), før teksterne kommer med.
