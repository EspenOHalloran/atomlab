# E5: Fables faktatjek af Liv og månerne

*Skrevet 12. november 2026 af Fable 5.2 (effort høj) efter [prompt-fable-liv.md](../prompt-fable-liv.md). Kun dokumenter: ingen kode, tekster eller faktafiler er rettet. Opus skriver sine noter i `E5-noter.md`.*

**Læst:** fælderne og tjekliste B, hele faktagrundlaget ([fakta-liv.md](../fakta-liv.md), de fire filer i `fakta-liv/` og [fakta-maaner-liv.md](../fakta-maaner-liv.md)), planen, min egen drejebog og alle tekster om Liv, Cheyava Falls, Europa, Enceladus og Titan i programmet.

**Sikkerhed:** **S** = jeg har selv åbnet kilden i dag. **RS** = god sekundær kilde eller kun resuméet. **H** = efter hukommelsen, ikke åbnet i dag (skal slås op, før det skrives i programmet).

**Adgang:** NCBI's poster, PMC, nature.com (resuméer), arXiv, NASA, ESA, OpenStax, genome.gov og Wikipedia virkede. PubMed, PNAS, OUP, science.org og NCBI Bookshelf viser en robotkontrol. Det kan ikke løses ved at åbne flere domæner, og jeg har ikke prøvet at komme udenom. `www.aanda.org` og `uniprot.org` er lukket, men det, jeg skulle bruge, stod på arXiv og hos NCBI, så jeg har ikke bedt om dem.

## 1. Det vigtigste først
- **Faktagrundlaget holder.** Det er grundigt og ærligt, og jeg fandt ingen grov fejl i det. Stikprøverne (ca. 25 påstande åbnet i kilden) passede, bortset fra de få i afsnit 3 og 4.
- **Programmet har ingen grove fejl.** Der er 12 små ting (afsnit 2). De tre vigtigste, før jeres søn ser det igen: seglcelleanæmi kræver ændringen fra **begge** forældre (står kun under "For nørder"), ribosomets fart er sat for højt, og "et enzym er et protein" er for skarpt.
- **Ét nyt fund ændrer faktagrundlaget for månerne:** Det vigtigste bevis for fontæner på Europa (Hubble) blev i maj 2026 trukket tilbage af forskeren selv (afsnit 4).
- **Det, der mangler mest,** er evolution ved naturligt udvalg. Den er en kendsgerning og bør ikke gemmes væk (afsnit 5).
- Genet HBB i programmet er tjekket bogstav for bogstav mod NCBI i dag: alle 444 baser og 147 aminosyrer passer.

## 2. Fejl i programmet nu

| Tekst (fil:linje) | Påstand | Dom | Kilde | Forslag til ordlyd |
|---|---|---|---|---|
| `js/data/liv/protein.js:61` og `:122`, `js/data/hvorfor.js:198` | "Skift ét bogstav, så du får seglcelleanæmi" og "Så klumper hæmoglobinet sammen" | **For sikkert.** Man bliver kun syg med ændringen fra begge forældre. Det står kun i nørd-teksten (`hvorfor.js:199`). Og hæmoglobinet klumper først, når det har afleveret ilten | genome.gov, "Sickle Cell Disease" (S): "inherits a gene for the disorder from both parents", bærere "typically don't get the disease". Ilten: lærebogsviden (H) | Opgaven: "Lav den ændring, der giver seglcelleanæmi". Kortet: "Har man ændringen fra både sin mor og sin far, klumper hæmoglobinet sammen i lange tråde, når det har afleveret ilten." |
| `js/data/liv/protein.js:27` | "I dine celler: op til ca. 6-9 i sekundet" | **Upræcist.** Den bedste måling er lavere | Ingolia m.fl. 2011, Cell 147:789, PMC3225288 (S): "5.6 amino acids per second" i museceller | "ca. 5-6 i sekundet (målt i museceller)" |
| `js/data/liv/protein.js:22`, `js/data/ordbog.js:204` | "Et enzym er et protein" | **For skarpt.** Ribosomets kerne er RNA, så ribosomet er selv et enzym af RNA ([begyndelsen.md](../fakta-liv/begyndelsen.md) afsnit 6, Nobel 1989 og Nissen 2000). Vil stride mod RNA-verdenen, når den bygges | faktagrundlaget (S) | "Næsten alle enzymer er proteiner." |
| `js/data/liv/protein.js:33` og `:54`, `js/liv-protein.js:166` | Den færdige β-kæde har 147 aminosyrer | **Upræcist.** Ribosomet bygger 147, men den første (M) klippes af. β-kæden i blodet har 146. Nørd-teksten (`index.html:770`) siger det rigtige | NCBI NP_000509 (S): 147 aminosyrer, og det færdige protein begynder med "N-acetylvaline" på plads 2 | "Ribosomet bygger en kæde på 147 aminosyrer. Den første klippes af bagefter." |
| `js/data/liv/opskriften.js:16` | "Din krop er bygget af ca. 30 billioner celler" | **Upræcist** for et barn | Hatton m.fl. 2023, PNAS 120:e2303077120, PMC10523466 (S): ca. 36 billioner (mand), 28 (kvinde) og 17 (barn på 10 år) | "En voksen krop har ca. 30 billioner celler." |
| `js/data/sider/saturn.js:106` | Cassini "fløj gennem fontænerne og fandt salt, organiske stoffer og fosfat" | **Upræcist, og det vigtigste mangler.** Fosfatet er fundet i iskorn i E-ringen (de kommer fra fontænerne). Brinten (energien) er målt i selve fontænen | Postberg 2023 og Waite 2017 ([fakta-maaner-liv.md](../fakta-maaner-liv.md) afsnit 2) | "Cassini fløj gennem fontænerne og fandt salt, brint og organiske stoffer. I iskorn fra fontænerne er der også fosfat. Det er næsten alt det, liv har brug for. Liv har ingen fundet, og Cassini kunne heller ikke have set det." |
| `js/data/sider/jupiter.js:193` | Juno "målte ca. 29 km" | **For præcist** | Levin m.fl., Nature Astronomy 10:84-91 (S, resumé): "29 ± 10 km" for ren is | "ca. 30 km (et sted mellem 20 og 40)" |
| `js/data/sider/jupiter.js:201` | Magnetfeltet "kan kun forklares med" saltvand | **Lidt for sikkert** | Kivelson 2000, NASA: "best evidence" | "forklares bedst med" |
| `js/data/liv/protein.js:116` | Samme aminosyre, "så skiftet gør ingenting" | **Lidt for sikkert.** Næsten altid. Men et "tavst" skift i samme gen (kodon 24, GGT → GGA) giver blodsygdommen thalassæmi, fordi RNA'et bliver klippet forkert | Goldsmith m.fl. 1983, PNAS 80:2318 (H) | "Proteinet bliver det samme. Sådan et skift gør næsten altid ingenting." |
| `js/data/liv/opskriften.js:99-100` | "G–T holder ikke … Så skubber de" | **Forenkling, der ikke siges.** G og T kan holde sammen med to hydrogenbindinger, hvis de rykker sig lidt skævt (et "wobble"-par). Det er en af de almindeligste kopifejl | Lærebogsviden, Crick 1966 (H) | Under "For nørder": "G og T kan faktisk holde sammen, hvis de rykker sig skævt. Så buler stigen, og cellen finder fejlen." Vigtigt for L3 (fejlene) |
| `js/data/liv/protein.js:44` | "Et skift af ét bogstav i DNA'et hedder en mutation" | **Upræcist.** En mutation er enhver ændring (ordbogen siger rigtigt "fx") | `js/data/ordbog.js:199` | "Et skift af ét bogstav er en mutation." |
| `js/data/ordbog.js:189` | RNA er "DNA'ets lillebror" | Ikke forkert, men RNA kom nok før DNA (RNA-verdenen) | begyndelsen.md afsnit 6 | "DNA'ets slægtning". Ret, når Begyndelsen bygges |

**Tjekket uden fund:** kodetabellen (alle 64 ord mod standardkoden), genet (mod NCBI), aminosyrernes grupper, stigens tal (0,34 nm, 10,5 trin, 2 nm, 63-64 og 41 atomer), zoom-rejsens tal (6 µm, 46 kromosomer, 6,1 milliarder, 2 m, 33 km, 3.000 gange), kromosomet og X'et, kortet "Hvad holder stigen sammen?", de øvrige ord i Ordbogen, hjælpen, "Ærligt talt" og "For nørder". **Cheyava Falls i `js/data/sider/mars.js:215` og `:427` er korrekt og ærlig**, og de 30 prøver passer med NASA's liste i dag (S). Teksterne om Titan og "Kan der være liv?" på Europa er i orden.

**Kan gøres bedre:** "delt i flere stykker" (`index.html:768`) kan blive "delt i tre stykker". NCBI's post har tre exoner, og RNA'et er 628 baser langt, hvoraf de 444 er opskriften (S). Det lukker hullet i `fakta-liv.md:24`.

## 3. Faktagrundlaget for Liv

**Livets begyndelse.** Opdelingen i filen er rigtig, og jeg er enig i den:
- **Kendsgerning:** Jorden er ca. 4,54 milliarder år. Liv fandtes for ca. 3,5 milliarder år siden. Alt liv har samme kode og en fælles forfader. Byggestenene dannes let (Miller, meteoritter, Bennu og Ryugu). Fedtstoffer laver hinder af sig selv. RNA kan både gemme opskrifter og være enzym.
- **Førende hypotese:** RNA-verdenen. Ribosomets kerne af RNA er det stærkeste indicium.
- **Strid:** hvor det skete (væld på havbunden eller damme på land), hvad luften bestod af, Isua, alt ældre end ca. 3,5 milliarder år, og LUCA's alder.
- **Ukendt:** hvordan byggesten blev til noget, der kopierer sig selv. Ingen har lavet liv.

**Cheyava Falls.** Jeg er enig i "Opus' vurdering", også om ordet "på Mars" og om CoLD-skalaen. NASA's trin 1 fra juli 2024 er bekræftet i billedteksten (S). Artiklen selv regner med, at organiske stoffer kan have lavet jernet om uden liv ved 10-80 °C (S). Det svære at forklare uden liv er svovlet. Det passer med filens "tredje vej".

**DNA og protein.** Tallene er regnet efter og passer (se også afsnit 2). Franklin-historien og laktose-tallet (6 % i Juhl 2018, S) holder.

| Sted | Påstand | Dom | Kilde | Forslag |
|---|---|---|---|---|
| `fakta-liv/rummet.md:53`, `plan-liv.md` afsnit 4 | "En rover kan højst nå trin 3" | **Lidt for sikkert.** Artiklen giver et eksempel med Perseverance: "could gather evidence that reaches CoLD Level 3", og Hurowitz siger selv, at holdet er ved at løfte foden fra trin 3 | Green m.fl. 2021, arXiv:2107.10975 (S) | "Skalaens forfattere regnede med, at Perseverance kan nå trin 3. Resten kræver, at prøven kommer til Jorden." |
| `fakta-liv/rummet.md:40` | "det stærkeste spor af liv, der er fundet på Mars" | **Lidt for sikkert.** Bell siger "perhaps the best evidence yet" | samme fil | "måske det stærkeste spor" (spørgsmål 3) |
| `fakta-liv/begyndelsen.md:81`, `fakta-liv.md:39` | QT45 er "Ret sikker", detaljerne usikre | **For forsigtigt.** Forfatternes manuskript ligger i PMC | Gianni m.fl. 2026, PMC7618777 (S): 45 baser, i is ved −7 °C, 94,1 % rigtige bogstaver, udbytte ca. 0,2 % på 72 dage, de to trin "in separate reactions" | Sikker. Planens trin 4 holder. Regnet: 0,941⁴⁵ ≈ 6 %, så kun ca. hver femtende kopi er fejlfri |
| `fakta-liv/begyndelsen.md:127` | "Johnson 2008 … Brug 23" | **Misvisende.** Det er to forsøg: 22 aminosyrer i vulkan-udgaven (Johnson 2008, H) og 23 i H₂S-forsøget (Parker 2011). Planens "22 i 2008" er rigtig | samme fil, linje 42-43 | Skriv 22 om 2008 og 23 om 2011 |
| `fakta-liv/begyndelsen.md:99` | Genomet kom ind i en celle, "that had its DNA removed" | **Upræcist** (Wikipedias ord, S). Cellen blev ikke tømt først: Hele celler fik det nye genom, og det gamle forsvandt bagefter (H). Planens "en bakterie, der levede i forvejen" er rigtig | Gibson m.fl. 2010 (H) | Skriv ikke "en tømt celle". Og Feynman-citatet i vandmærket var et fejlcitat (H): brug det ikke |
| `fakta-liv/begyndelsen.md:72` og fælde 15 | "Idéen er fra Rich (1962)" | **For skarpt.** Idéen krediteres oftest Woese (1967), Crick og Orgel (1968). Rich var tidligt ude | H | "Idéen er fra 1960'erne. Navnet gav Gilbert i 1986." |
| `fakta-liv/dna-opskriften.md:25` | Ribosomet: "ca. 5-9 i celler med kerne" | **Upræcist** | Ingolia 2011 (S): 5,6 | "ca. 5-6" |
| `fakta-liv/dna-stigen.md:54` | Chimpansen: "ca. 4 %" med indsættelser og sletninger | **Forældet.** De første hele abe-genomer viser, at 12,5-27,3 % af et abe-genom ikke kan lægges side om side med et andet. Den lave ende er menneske og chimpanse (H) | Yoo m.fl. 2025, Nature 641:401-418 (S): "greater divergence than previously estimated" | Skriv ikke et tal i lag 1 (spørgsmål 5) |
| `fakta-liv/dna-stigen.md:56` | Kun Sender 2016 om celletallet | **Mangler** nyere tal | Hatton 2023 (S), se afsnit 2 | Tilføj |

**Tjekket uden fund:** "Hvad er liv", tidslinjen (klokken 5.36 er regnet efter), Miller-Urey, byggesten fra rummet, spejlbillederne, hinderne, Darwins brev, alle fælderne i de tre filer, den genetiske kode, kopien, historien og "Fund, der ikke holdt". K2-18b er stadig ikke bekræftet (søgning i dag, RS).

## 4. Faktagrundlaget for månerne

Filen er god, og jeg er enig i "Fælder" og "Ikke fundet". Fire ting:

| Sted (`fakta-maaner-liv.md`) | Påstand | Dom | Kilde | Forslag |
|---|---|---|---|---|
| linje 45 | Fontæner på Europa: Hubble og Galileo, "tentative" | **Forældet (nyt fund, 5. maj 2026).** Roth, som fandt vanddampen med Hubble i 2014, har regnet alle billederne fra 1999 og 2012-2020 igennem igen: "No localized emission enhancements are detected in any of the observations, including the image previously interpreted as evidence". Fejlen lå mest i, hvor Europa stod på billedet | Roth m.fl. 2026, A&A 709:A59, arXiv:2604.20324 (S, resumé) | "Hubble-beviset er trukket tilbage. Tilbage står to indirekte spor (Sparks 2016-17 og Jia 2018). Ingen ved, om Europa har fontæner." Programmet nævner dem ikke, og det skal det blive ved med |
| linje 119 | Huygens landede "ca. 12:43 UTC (i rumsondens tid)" | **Forkert mærket** (Wikipedias fejl). 12:43 er, da signalet nåede Jorden, 67 minutter senere | ESA, sci.esa.int 36280 (S): start 09:06 UTC, landing "around 11:30 UTC". 09:10 + 2 t 27 min 50 s = 11:38 (regnet) | "ca. kl. 11.38 UTC ved Titan" eller bare datoen |
| linje 63 | "ca. 200 kg i sekundet", kilde ikke fundet | Usikkert, som filen siger | Hansen m.fl. 2006, Science 311:1422 og Hansen 2011 og 2020 (H): ca. 150-300 kg vanddamp i sekundet | "et par hundrede kg vand i sekundet" |
| linje 71 | pH 11-12 er én model | Enig. Nyere skøn spænder fra ca. 8 til 12 (H, og et søgeresultat i dag) | – | "basisk" uden tal |

**Bekræftet i dag (S):** Petricca 2025 om Titan ("preclude the existence of a subsurface ocean"), Byrne 2026 om Europas havbund, Levin 2025 (29 ± 10 km) og Vu og Hodyss 2026 (hinden "would be unlikely to form in Titan's lake fluids"). "Liv, men ikke som vores" på Titan er altså rigtigt kaldt spekulation. Huygens-tallene passer med ESA. To nye artikler om Enceladus fra 25. september 2026 (Science Advances) kender jeg, ligesom Opus, kun fra søgeresultater (RS).

**Er kernesætningen ærlig?** Forslag 1 er næsten ærligt. To ting:
1. "… fundet næsten alt, liv har brug for, **men ikke liv**" lyder, som om nogen har ledt og ikke fundet noget. Cassini kunne ikke se liv. Skriv: "… men ingen har endnu kunnet se efter, om der er liv."
2. "Under isen på Europa … er der et hav" er i orden. Havet er målt indirekte, men næsten alle forskere regner med det. Det er fontænerne på Europa, der er usikre, ikke havet.

## 5. Det, der mangler, er for sikkert eller for forsigtigt

**Mangler:**
- **Evolution ved naturligt udvalg.** Faktagrundlaget har mutationer, men ikke udvalget. Uden det forklarer "mutationerne gør, at livet kan udvikle sig" (`protein.js:66`) ingenting. Seglcellen og malaria er skoleeksemplet, og mælken er et til, og begge findes allerede. Evolution er en kendsgerning og skal ikke skrives med "måske". Det er her, materialet er **for forsigtigt**.
- **"Kom livet fra rummet?"** Det spørger en 13-årig om. Svaret mangler: Byggestenene kom delvist fra rummet, men ingen har fundet liv derude, og idéen flytter bare spørgsmålet et andet sted hen.
- **Argumenterne i striden om stedet** er tynde. For dammene: Den kendte kemi, der laver RNA's byggesten, bruger UV-lys, og det findes kun på land. For vældene: De har en naturlig forskel i surhed, som ligner den måde, alle celler laver energi på. Begge er efter hukommelsen (H: Patel m.fl. 2015, Lane og Martin 2012) og skal slås op før L5.
- **Mennesket på døgnuret** (planen skriver "skal slås op"): 300.000 år ud af 4,54 milliarder er 5,7 sekunder før midnat (regnet, alderen er H).

**For sikkert:** "Fedtstoffer laver hinder af sig selv i vand" passer i ferskvand. I saltvand og sammen med magnesium, som RNA skal bruge, går de enkle hinder let i stykker (H). Det er et af argumenterne for damme. Én sætning i "Ærligt talt" er nok.

**Nye fund, der ændrer noget:**
- **5. maj 2026:** Hubble-beviset for fontæner på Europa er trukket tilbage (afsnit 4).
- **April 2025:** De hele abe-genomer (afsnit 3). Ældre end filerne, men ikke med i dem.
- **12. februar 2026:** QT45 er nu bekræftet i artiklen (afsnit 3).
- **Uændret:** Mars Sample Return er stadig lukket, og Kinas Tianwen-3 er stadig planlagt til 2028 (søgning i dag, RS). Europa Clipper flyver forbi Jorden 3. december 2026. Ingen ny forklaring uden liv på Cheyava Falls er fundet.

## 6. Rettelser til min egen drejebog (E3)
- **Forløb 1, trin 2 og afsnittet "Fakta":** Jeg foreslog "næsten hver celle". Det er selv en fælde: Målt i antal har de fleste celler ingen cellekerne (røde blodlegemer). Skriv "i hver celle med en cellekerne".
- **Forløb 2, trin 1:** "Hvert ord betyder én byggesten" → "61 af ordene betyder en byggesten, og 3 betyder stop". Ellers kommer stoppet i trin 3 som en overraskelse.
- **Forløb 2, trin 3:** "Det her hedder hæmoglobin" → "Det her er en af de fire kæder i hæmoglobin".
- **Forløb 2, trin 4:** "Det er nok til at give sygdommen seglcelleanæmi" → "… hvis man har ændringen fra både sin mor og sin far". Og "Et skift af ét bogstav hedder en mutation" → "er en mutation".
- Den lille ordbog er tjekket mod kodetabellen: GTG valin, CAT histidin, CTG leucin og ACT threonin passer.

## 7. Spørgsmål til jer (anbefalingen først)
1. **Seglcelleanæmi:** (a) Flyt sætningen om begge forældre op i opgaven og kortet (anbefalet, fordi et barn kan kende en, der er bærer). (b) Lad den blive under "For nørder".
2. **Kernesætningen for månerne:** (a) Forslag 1 med ny slutning: "… men ingen har endnu kunnet se efter, om der er liv" (anbefalet). (b) Forslag 1 uændret. (c) Forslag 2 (de tre ting, liv har brug for).
3. **Cheyava Falls:** (a) "måske det stærkeste spor af liv, der er fundet på Mars" (anbefalet, det er forskerens egne ord). (b) "det stærkeste spor … på Mars". (c) "det mest lovende spor".
4. **Evolution:** (a) Et "Hvorfor?"-kort om naturligt udvalg og et afsnit i faktagrundlaget, før L3 bygges (anbefalet). (b) Vent til Begyndelsen (L5). (c) Ikke med.
5. **Mennesker og chimpanser:** (a) Intet tal i lag 1, kun "vores nærmeste slægtning", og tallene under "For nørder" (anbefalet, fordi tallet afhænger af, hvordan man tæller). (b) "ca. 99 % ens i de dele, der kan sammenlignes".
