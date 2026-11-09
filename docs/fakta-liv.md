# Faktagrundlag: Liv (DNA og livets begyndelse)

*L0 i [planen for Liv](plan-liv.md). Lavet 9. november 2026: Tre hjælpeagenter (Opus, effort xhigh) slog påstandene op i kilderne, og Opus vurderede dem bagefter (afsnittet "Opus' vurdering" nedenfor). Ikke tjekket af Fable (venter på 5.5, se [plan-fable.md](plan-fable.md), F3).*

| Del | Emne | Fil |
|---|---|---|
| A1 | DNA: opbygningen (stigen, hydrogenbindinger, atomer pr. basepar, 1BNA) og genomet (tal, gener, "skrald", chimpanser, celler) | [fakta-liv/dna-stigen.md](fakta-liv/dna-stigen.md) |
| A2 | DNA: opskriften (fra DNA til protein, seglcelle, laktase), kopien, historien (Franklin, Watson og Crick), fælderne og det usikre for hele del A | [fakta-liv/dna-opskriften.md](fakta-liv/dna-opskriften.md) |
| B | Livets begyndelse: hvad er liv, tidslinjen, Miller-Urey, byggesten fra rummet, spejlbilleder, RNA-verdenen, hinder, hvor det begyndte, og om nogen har lavet liv | [fakta-liv/begyndelsen.md](fakta-liv/begyndelsen.md) |
| C | Liv i rummet: Cheyava Falls, fund der ikke holdt, månerne med hav, og hvordan man leder | [fakta-liv/rummet.md](fakta-liv/rummet.md) |

Læs kun den fil, du skal bruge. Før en tekst kommer med i programmet, skal den stadig gennem `/faktatjek` (mod disse filer), og påstande mærket **Ret sikker** eller **Usikker** skal skrives forsigtigt eller slås op igen.

## Opus' egne opslag (9. november 2026)
- **Begyndelsen af genet for hæmoglobin (HBB), til "Læs selv" i L2.** NCBI RefSeq NM_000518.5 (*Homo sapiens hemoglobin subunit beta (HBB), mRNA*), hentet som GenBank-tekst fra `https://www.ncbi.nlm.nih.gov/sviewer/viewer.fcgi?id=NM_000518.5&db=nuccore&report=gbwithparts&retmode=text`. Den kodende del (CDS) er base 51-494: 147 aminosyrer og stopkodonet TAA. De første ti kodoner er **ATG GTG CAT CTG ACT CCT GAG GAG AAG TCT** (M V H L T P E E K S). En oversættelse med standardkoden giver præcis NCBI's egen `/translation` for alle 147 aminosyrer (tjekket med et lille script). **Sikker.**
  - **Seglcellen:** Kodon nr. 7 er GAG (glutaminsyre). GTG giver valin. Det kaldes traditionelt "position 6", fordi den første methionin fjernes i det færdige protein (NCBI's note: "N-acetylvaline" som første aminosyre). NCBI: "Mutant beta globin causes sickle cell anemia". Selve skiftet GAG → GTG og malaria står med kilde i [del A2](fakta-liv/dna-opskriften.md). **Sikker.**
  - **Til tests i L2:** De ni første kodoner skal give MVHLTPEEK, og GAG → GTG i kodon 7 skal give V.
- **"Kromosomer ligner et X."** Wikipedia "Chromosome" (med Alberts' lærebog som kilde): "Normally, chromosomes are visible under a light microscope only during the metaphase of cell division, where all chromosomes are aligned in the center of the cell in their condensed form". Figuren af X'et er "a duplicated and condensed metaphase eukaryotic chromosome" (to ens kopier, der hænger sammen på midten). Resten af tiden er DNA'et viklet om proteiner (histoner) som kromatin. **Ret sikker** (sekundær kilde med henvisning til Alberts). Tjek den med Alberts i L1.
- **Kromosomet og perlerne (tjekket i L1, 9. november 2026).** OpenStax Biology 2e, 10-1 ("short stretches of the DNA double helix wrap around a core of eight histone proteins", "The beadlike, histone DNA complex is called a nucleosome", "A DNA molecule in this form is about seven times shorter than the double helix without the histones, and the beads are about 10 nm in diameter, in contrast with the 2-nm diameter of a DNA double helix", "DNA packing reaches its most condensed state during metaphase in mitosis", "After replication, the chromosomes are composed of two linked sister chromatids ... The connection between the sister chromatids is closest in a region called the centromere"). **Sikker.** Det bekræfter fælden om X'et ovenfor (Alberts på NCBI Bookshelf gav stadig reCAPTCHA, så OpenStax blev brugt i stedet).
- **Bogstaverne til "Skriv LIV":** De 20 almindelige aminosyrer har bogstaverne A C D E F G H I K L M N P Q R S T V W Y. B, J, O, U, X og Z er ikke blandt dem (O og U bruges til de to sjældne, pyrrolysin og selenocystein, og B, J, X og Z er koder for "en af flere"). L = leucin, I = isoleucin, V = valin. Wikipedia "Amino acid" (tabellerne over koderne, wikiteksten hentet 9. november 2026): Selenocystein = "Sec, U", pyrrolysin = "Pyl, O", og pladsholderne "Any / unknown … X", "Asparagine or aspartate … Asx, B", "Glutamine or glutamate … Glx, Z" og "Leucine or isoleucine … Xle, J". **Sikker** (almindelig lærebogsviden, her bekræftet i en sekundær kilde).

## Opus' vurdering af del A, B og C (9. november 2026)
**Samlet:** Alle tre dele er grundige og ærlige om, hvad der kun er set i en sekundær kilde. Udregningerne er regnet efter (atomer og masse pr. basepar, 2 m DNA, 33 km, 8 år for én kopigaffel, 53 min pr. gaffel, ca. én ny mutation pr. 87 millioner, 4,2 % for chimpanser, 0,13-0,16 % mellem mennesker), og de passer. Planen er rettet efter rettelserne nedenfor.

**Stikprøver, som Opus selv har åbnet i kilden** (ordret som i filerne):
- Del A: Cobb og Comfort 2023 (Nature: "Franklin was no victim in how the DNA double helix was solved") og Yakovchuk m.fl. 2006 (PMC1360284: "base-stacking is the main stabilizing factor in the DNA double helix").
- Del C: Jim Bell hos Planetary Society ("perhaps the best evidence yet for preserved traces of ancient life on Mars, but certainly not a slam dunk"), Sean Duffy ("the closest we have ever come to discovering life on Mars") og NASA's definition af et muligt biospor (begge fra NASA's meddelelse 10. september 2025).
- Del B: **QT45** (ribozymet, der kan lave sin modstreng og en kopi af sig selv, Science, februar 2026) kunne ikke åbnes (PubMed og PMC gav reCAPTCHA, UCL Discovery Cloudflare). Titlen ("A small polymerase ribozyme that can synthesize itself and its complementary strand"), laboratoriet (MRC LMB i Cambridge) og hovedpointen passer i flere søgeresultater (astrobiology.com 16. februar 2026, UKRI). Ifølge dem er de to trin endnu ikke sat sammen til en hel cyklus, og kopieringen er langsom og giver lidt. **Ret sikker.** Slås op i artiklen før L5.

**Rettelser, der ændrer planen:**
- **6,1 milliarder basepar i en celle** (2 × 3,055, en kvinde), ikke 6,2 (del A1, fælde 9).
- **DNA-kopien hos mennesker går ca. 25 baser i sekundet pr. gaffel** (17-50), ikke 50-100 (del A2). Bakterier: ca. 1.000.
- **Ribosomet hos os: ca. 5-9 aminosyrer i sekundet**, ikke 2 (kun Wikipedia, **Ret sikker**).
- **1BNA er bøjet, har 9,8 basepar pr. omgang og nok ingen H-atomer.** Stigen bygges af de ideelle tal, og 1BNA bruges kun til atomernes pladser i ét par. H skal regnes ud eller udelades (del A1).
- **Kæder på ler: op til 55 led, men kun med kemisk "aktiverede" byggesten** og mange fodringer (Ferris 1996, del B).
- **Ryugu: 15 sikre og 5 usikre aminosyrer**, Murchison ca. 70 (del B). Alle fem baser er nu fundet i meteoritter og i Bennu. Bennu har også ribose, men ingen deoxyribose (NASA, december 2025).
- **"Det bedste spor": Alle kilder siger "på Mars".** At intet andet sted har et stærkere spor, er vores sammenfatning (Venus og K2-18b er omstridte). Skriv "det stærkeste spor af liv, der er fundet på Mars" (del C).
- **CoLD-skalaen:** NASA kaldte Cheyava Falls trin 1 i 2024. Hovedforfatteren mener selv trin 3. En rover kan højst nå trin 3 af 7 (del C).
- **Enceladus: fem af de seks CHNOPS er fundet, svovl kun måske** (del C). Programmets tekst om Enceladus (`js/data/sider/saturn.js`) siger kun "salt, organiske stoffer og fosfat" og er fin.
- **Minik Rosing er grønlænder** (professor i København) og selv medforfatter på kritikken af Isua-fossilerne (del B). **Poul Nissen** fra Aarhus er førsteforfatter på artiklen fra 2000, der viste, at ribosomets kerne er RNA (del B): en god dansk vinkel.
- **De fleste danskere kan tåle mælk: ca. 94 %** (Juhl m.fl. 2018, 20.416 voksne danskere). Den ældste kendte bærer er fra ca. 4.700 f.Kr. (del A2).

**Skal slås op, før teksterne skrives** (står under "Ikke fundet" i hver fil): Darwins ordlyd i Darwin Correspondence Project (domænet `www.darwinproject.ac.uk` er lukket), årstallet 1994 for NASA's definition, "kopien tager ca. 8 timer" (ikke fundet, skriv "nogle timer"), bananen (brug den ikke) og om 1BNA har H-atomer.

**Adgangen** skiftede i løbet af dagen: PubMed, PMC og NCBI Bookshelf gav reCAPTCHA i perioder (ikke forsøgt omgået), og nature.com virkede kun med `?error=cookies_not_supported`. Lærebøgerne på NCBI Bookshelf (Alberts, Lodish og Berg) blev derfor ikke brugt. OpenStax Biology 2e var hovedkilden for det grundlæggende.

## De vigtigste fælder
*Hele listerne med kilder står i hver fil: del A2 afsnit 6, del B afsnit 10 og del C afsnit 5. De vigtigste er også skrevet i [erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md).*
- "DNA er en tegning af kroppen." Mere en opskrift (A2).
- "Det meste DNA er skrald" og "80 % har en funktion" (ENCODE). Begge er for skarpe: Ca. 8 % er bevaret af evolutionen, og forskerne er uenige (A1).
- "Det er hydrogenbindingerne, der holder DNA sammen." Stablingen af baserne giver det meste. Hydrogenbindingerne afgør, hvem der passer sammen (A1).
- "98 % chimpanse" og "99,9 % ens" uden forbehold. Det gælder enkeltbogstaver (A1).
- "Watson og Crick stjal Franklins billede, og det gav dem svaret." For enkelt. Hun var en ligeværdig del af arbejdet, men de brugte hendes data uden at spørge (A2).
- "Forskerne har lavet kunstigt liv" (Venter 2010). Genomet kom ind i en celle, der levede i forvejen (B).
- "Millers forsøg viste, hvordan livet opstod." Han fik byggesten, og luften var nok en anden (B).
- "LUCA var den første celle" og "levede for præcis 4,2 milliarder år siden" (B).
- "Meteoritterne forklarer, hvorfor liv er venstrehåndet." Bennu og Ryugu har lige meget af begge (B).
- "Perseverance har fundet liv" og "det bedste spor i hele rummet". Et muligt biospor, og kilderne siger "på Mars" (C).
- "Alle seks CHNOPS er fundet på Enceladus." Svovl kun måske (C).
- "Kromosomer ligner et X." Kun lige før cellen deler sig (Opus' opslag ovenfor).
