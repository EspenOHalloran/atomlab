# Faktagrundlag: De første 8 videnskabsfolk og siderne fra deres bøger

*Emne 1 i [prompt-faktagrundlag.md](prompt-faktagrundlag.md). Lavet 12. november 2026 af Opus (effort høj) i en planlagt session, der startede om natten. Kun dokumenter, ingen kode. Ikke tjekket af Fable. Før en tekst kommer med i programmet, skal den stadig gennem `/faktatjek` mod denne fil, og påstande mærket **Ret sikker** eller **Usikker** skal skrives forsigtigt eller slås op igen.*

**Sikkerhed:** **Sikker** = læst i den oprindelige tekst (skanningen) eller i to uafhængige kilder. **Ret sikker** = én pålidelig sekundær kilde (fx Wikipedia med henvisning til en lærebog), eller fra hukommelsen og passer med kilderne. **Usikker** = kilderne er uenige, eller det kunne ikke læses direkte.

**Kilderne (åbnet i miljøet 12. november 2026):**
- **archive.org:** skanningerne af de oprindelige bøger og artikler, med deres OCR-tekst (`<id>_djvu.txt`) og metadata (`archive.org/metadata/<id>`). Hvert værk står med sit id nedenfor.
- **Wikipedia (engelsk og dansk)**, hentet som wikitekst (`action=raw`) og læst med `grep`. Artiklerne står ved hver påstand.
- **Wikimedia Commons:** filernes licens (API'et `prop=imageinfo`, kræver en User-Agent) og siderne "Commons:Copyright rules by territory/Denmark" og "Commons:Reuse of PD-Art photographs".
- **Åbnet senere samme dag** (efter jeres svar): www.nobelprize.org (begrundelserne for priserne), www.retsinformation.dk (ophavsretsloven, LBK nr. 1093 af 20. august 2023, hentet som XML fra `/eli/lta/2023/1093/xml`) og www.kb.dk ("Copyright and use of our materials"). Bemærk: Domænerne skal stå med "www." i miljøet, ellers bliver man sendt videre til en lukket adresse.
- **Afviser automatiske opslag (403):** gallica.bnf.fr og babel.hathitrust.org. **Stadig lukket** (ikke nødvendige): web.archive.org, zenodo.org, lex.dk, gutenberg.org, einsteinpapers.press.princeton.edu og articles.adsabs.harvard.edu.

## Forslag til kernesætning
**"Efter fem minutter kan brugeren sige: De fandt det ved at se efter og måle, ikke ved at gætte, og jeg kan selv se det samme her i AtomLab."**

Hver person har *én* opdagelse og *ét* sted i programmet (Retningens punkt 9). Først gør man det, så ser man bogsiden.

## Rettighederne
Står for sig selv i [fakta-bogsider-rettigheder.md](fakta-bogsider-rettigheder.md) (ophavsretsloven §§ 22, 63, 70 og 91, faksimilerne, oversættelserne og bibliotekernes vilkår). Kort sagt: Teksten er fri 70 år efter forfatterens død, men et nyt foto af en tekstside har sin egen ret i 50 år. Brug faksimiler fra før 1970 eller skanninger, som biblioteket selv har frigivet.

## 1. Tycho Brahe (1546-1601): Den nye stjerne i 1572

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Født 14. december 1546 på Knudstrup i Skåne (dengang dansk), død 24. oktober 1601 i Prag | Wikipedia "Tycho Brahe"; datoen for døden står også på titelbladet af faksimilen 1901 ("die XXIV Octobris A. D. MDCI defuncti") | Sikker |
| Så den nye stjerne i Cassiopeia **om aftenen 11. november 1572**, efter solnedgang, "næsten lige over mit hoved" | Tycho selv: "Anno praecedente, mense Novembri, die eiusdem undecimo, vespere post Solis occasum … iuxta capitis verticem animadverti fulgere Stellam" (begyndelsen af hovedteksten i *De nova stella*, faksimilen 1901) | Sikker |
| Han var **ikke den første**, der så den. Den brød frem kort efter 2. november, og mange så den uafhængigt af hinanden (fx Wolfgang Schuler, Clavius, Digges, Hájek og i Kina) | Wikipedia "SN 1572" ("independently discovered by many individuals") | Ret sikker |
| Den var lysest omkring 16. november (ca. som Venus) og kunne ses med det blotte øje til begyndelsen af 1574 | Wikipedia "SN 1572" | Ret sikker |
| Han målte, at den **ikke flyttede sig mod stjernerne** i løbet af natten (ingen daglig parallakse), så den var længere væk end Månen. Det brød med Aristoteles' lære om, at himlen bag Månen aldrig forandrer sig | Wikipedia "Tycho Brahe" (med Christianson 2000 og Thoren 1990) | Ret sikker |
| Bogen *De nova et nullius aevi memoria prius visa stella* udkom i København i **1573**. Ordet "nova" (ny stjerne) kommer herfra | Wikipedia; KB's eksemplar fra 1573 på archive.org | Sikker |
| Det var en **type Ia-supernova** (en hvid dværg, der eksploderede). Bekræftet i 2008 af et "lysekko" | Wikipedia "SN 1572" (Krause m.fl. 2008) | Ret sikker |
| Afstanden er usikker: Wikipedia giver både 7.500 lysår, 3,8 kpc (ca. 12.000 lysår) og 2,5-3 kpc (8.000-10.000 lysår) | Wikipedia "SN 1572" og "Tycho Brahe" | Usikker: Skriv "ca. 10.000 lysår væk" eller lad tallet være |

**Gør det i AtomLab:** Kosmos, **"Hvid dværg"** (`js/kosmos/hviddvaerg.js`): Fænomenet fortæller allerede om Tycho og 1572, og man ser den hvide dværg eksplodere. Citatet `tycho` står ved Supernova. *Idé til senere:* et lille "Hvordan ved vi det?"-kort, hvor man ser Månen flytte sig mod stjernerne (parallakse) og den nye stjerne stå stille.

**Bogsiden:** *De nova stella* (1573), første side af hovedteksten (datoen og "iuxta capitis verticem") og stjernekortet over Cassiopeia, hvor den nye stjerne er mærket **I**.
- **Bedst:** Videnskabernes Selskabs faksimile fra **1901** ("Fototypi. Pacht & Crone"), Toronto-eksemplaret `operumprimitiasd00brahuoft` ("NOT_IN_COPYRIGHT"). Fotoene er fra 1901, så de er frie efter den danske regel. Bemærk: Forordet (s. VII-XVI) er skrevet i 1901 på latin af en ukendt forfatter (ikke tjekket), så brug kun Tychos egne sider. **Ret sikker.**
- **Stjernekortet** findes allerede på Commons: "Tycho Cas SN1572.jpg" (fra faksimilen 1901), "Public domain" (PD-Art, PD-old-100). **Sikker.**
- KB's eksemplar fra 1573 (`den-kbd-pil-130018098815-001`) har ingen licens i metadata, og det er et dansk foto (§ 70). KB's side om ophavsret frigiver ikke skanningerne (se [rettighederne](fakta-bogsider-rettigheder.md)), så brug faksimilen fra 1901 i stedet, eller spørg KB (kb@kb.dk). **Ret sikker.**
- **Citatet `tycho` i `js/data/citater.js`:** Rettet 12. november 2026. `original` er nu Tychos latin, læst på sidebilledet i faksimilen 1901 (side A, archive.org-billede n36): "Miraculum sanè inter omnia, quæ à mundi exordio, in tota rerum natura extiterunt, aut maximum, aut illi certè æquiparandum, quod in Solaris cursus retentione, Iosuæ precibus impetrata …". Sætningen fortsætter "vel eiusdem obscuratione, tempore Victimæ cœlestis facta, contigisse sacra testantur oracula" (eller da Solen blev mørk, da Jesus døde). Den danske tekst er vores egen oversættelse. Den engelske oversættelse er fjernet. **Sikker.**

## 2. Ole Rømer (1644-1710): Lyset er ikke uendelig hurtigt

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Rømer arbejdede ved observatoriet i Paris, da han i **1676** viste, at lyset bruger tid | Wikipedia "Rømer's determination …" | Sikker |
| Han brugte **formørkelserne af Io** (Jupiters inderste store måne), når den gik ind i eller kom ud af Jupiters skygge. Io går rundt på ca. **42½ time** | Rømer selv (Phil. Trans. 1677: "about 42½ hours … one revolution of this Satellit") og Wikipedia | Sikker |
| Når Jorden fjerner sig fra Jupiter, kommer Io's formørkelser lidt for sent. Når Jorden nærmer sig, kommer de lidt for tidligt. Over én omgang kan det ikke ses, men over **40 omgange** kan det | Phil. Trans. 1677, s. 893-894 ("forty revolutions observed on the side F, might be sensibly shorter …") | Sikker |
| Han forudsagde, at Io ville komme ud af skyggen ca. **10 minutter senere** end beregnet. Den blev set i Paris **9. november 1676 kl. 5.35.45 om aftenen**, 10 minutter for sent | Phil. Trans. 1677 ("observed at Paris the 9th of November last at 5 a Clock, 35'. 45". at Night, 10 minutes later than it was to be expected") | Sikker |
| Hans tal: Lyset er **ca. 22 minutter** om at krydse hele Jordens bane (to gange afstanden til Solen). Det rigtige er ca. **16 min 38 s** (2 × 499 s) | Phil. Trans. 1677 ("twenty two for the whole interval of HE, which is the double of the interval that is from hence to the Sun"); 499 s fra fakta-fælderne. Regnet: 2 × 499 = 998 s = 16 min 38 s | Sikker |
| **Rømer gav aldrig farten i km/s.** Huygens regnede den ud fra Rømers tal (ca. 110 mio. toiser i sekundet, ca. 210.000-220.000 km/s). Den rigtige fart er 299.792 km/s | Wikipedia "Rømer's determination …" og "Ole Rømer" (begge tal står der) | Ret sikker |
| Cassini, chefen for observatoriet, blev aldrig helt overbevist. Først James Bradleys måling af aberrationen (1727-1729) gjorde det klart for alle | Wikipedia "Rømer's determination …" | Ret sikker |
| Meddelelsen kom i *Journal des sçavans* 7. december 1676 og på engelsk i *Philosophical Transactions* bd. 12, nr. 136, s. 893-894 (1677) | Wikipedia; skanningen af Phil. Trans. | Sikker |
| De fleste af Rømers papirer brændte ved Københavns brand i 1728 | Wikipedia | Ret sikker |

**Gør det i AtomLab:** Solsystemet, **Jupiter → Månerne** og **Io**: Io går rundt på ca. 4¼ Jupiter-døgn (`døgn: 1.769138` i `js/kosmos/jupiter.js` = 42,46 timer, rigtigt), og dens skygge ses på skyerne. Spol frem med ⏩. **Ærligt:** I dag flytter programmet månen *ud af* skyggen, når man besøger den (`udAfSkygge`), og lysets rejsetid er ikke med. *Idé til senere:* "Rømers ur": et stopur for, hvornår Io kommer ud af skyggen, med Jorden tæt på og langt fra Jupiter. Forskellen er op til ca. 16½ minut.

**Bogsiden:** *Philosophical Transactions* bd. 12 (1677), s. 893-894, "A Demonstration concerning the Motion of Light, communicated from Paris, in the Journal des Sçavans, and here made English", med figuren (Fig. 11: Solen A, Jupiter B, Io C og Jorden i E-L).
- `paper-doi-10_1098_rstl_1677_0024` (Royal Society, **Public Domain Mark**) og `jstor-101779` (JSTOR "Early Journal Content", fri, men "non-commercial"). **Sikker.**
- Den franske original i *Journal des sçavans* (7. december 1676) blev ikke fundet på archive.org. Gallica er lukket.
- Rømers håndskrevne liste over formørkelserne (ca. 1678) findes på Commons ("Ole Rømer - Obser. Primi Jovialium Parisiis - pp1+4.jpg"). Licensen er ikke tjekket.

## 3. Christiaan Huygens (1629-1695): Saturns ring

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Hollandsk, født 14. april 1629 i Haag, død 8. juli 1695 | Wikipedia | Sikker |
| Opdagede **Titan** (Saturns største måne) **25. marts 1655** | Wikipedia ("on 25 March 1655") | Ret sikker |
| Offentliggjorde ringen som et **anagram** i 1656 (bogstaverne blandet) og afslørede den i *Systema Saturnium* i **1659**: "Annulo cingitur, tenui, plano, nusquam cohaerente, ad eclipticam inclinato" | Bogen selv, s. 47 ("anno 1656 die 25 Martij permixtis literis … edidimus") og [del3f](fakta-solsystemet/del3f-solen-jorden-citat-u3-s2.md) | Sikker |
| **Galilei** så ringen i 1610, men hans kikkert var for svag, så han troede, at Saturn bestod af tre kloder. Huygens *forklarede*, hvad det var | citatet `huygensSaturn` (faktatjekket 29. oktober 2026) | Sikker |
| Ringen hælder, så vi ser den skiftevis som en bred ellipse, en smal ellipse og som en streg (når vi ser den fra kanten) | *Systema Saturnium* s. 46-47 ("nunc ellipsin satis latam, nunc eandem strictiorem, nonnunquam denique & rectam lineam") | Sikker |
| Regnede lysets fart ud fra Rømers tal (se Rømer) | Wikipedia | Ret sikker |

**Gør det i AtomLab:** Solsystemet, **Saturn**: ringene, ringenes skygge og jævndøgn, hvor ringens skygge bliver en tynd streg (`js/data/sider/saturn.js`), og **Titan** (`js/kosmos/saturn.js`). Citatet `huygensSaturn` står allerede ved Saturn. *Til kortet:* "Drej Saturn, så du ser ringen fra kanten. Så forsvinder den næsten, præcis som Huygens forklarede."

**Bogsiden:** *Systema Saturnium* (Haag 1659), **s. 47** (anagrammet afsløres) og figuren med Saturns skiftende udseende.
- **Smithsonian Libraries** `CristianiHugeni00HuygA`: "Public domain. The Library considers that this work is no longer under copyright protection". **Sikker.** McGill (`McGillLibrary-osl_…`) har ingen licens i metadata, og Firenze-kopien (`ita-bnc-pos-0000044-001`) er ikke tjekket.

## 4. H.C. Ørsted (1777-1851): Strøm laver magnetisme

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Født 14. august 1777 i Rudkøbing, død 9. marts 1851 i København | Wikipedia | Sikker |
| Opdagede i **1820**, at en elektrisk strøm i en tråd drejer en **kompasnål** | Ørsteds egen tekst (se nedenfor) og Wikipedia | Sikker |
| Ifølge Ørsted selv blev **de første forsøg lavet i hans forelæsninger** om elektricitet, galvanisme og magnetisme "i den forrige vinter" (1819-1820). Virkningen var svag, så han gentog det med et større batteri og vidner | *Experimenta*, første afsnit: "Prima experimenta circa rem … in scholis de Electricitate, Galvanismo et Magnetismo proxime-superiori hieme a me habitis instituta sunt" | Sikker |
| Wikipedia kalder historien om, at han opdagede det *tilfældigt* under en forelæsning, en myte: Han havde ledt efter en sammenhæng siden 1818. Wikipedia "Electromagnetism" skriver "April 1820" | Wikipedia "Hans Christian Ørsted" og "Electromagnetism" | Ret sikker (se fælden) |
| Nålen drejer ca. **45°**, når tråden ligger tæt over den, og mindre, jo længere væk tråden er | *Experimenta* ("declinatio acus angulum circiter 45° efficit") | Sikker |
| Den latinske tekst *Experimenta circa effectum conflictus electrici in acum magneticam* er **4 sider**, dateret **København 21. juli 1820**, og blev sendt til forskere i hele Europa | *Experimenta* ("Dabam Hafniae, d. 21de Julii 1820") | Sikker (4 sider: Ret sikker) |
| Lavede **aluminium** som den første i **1824** (urent), og fremlagde det i **1825**. Wöhler gentog det i 1827 | Wikipedia "Aluminium" | Ret sikker |

**Gør det i AtomLab:** I dag kun **Det periodiske system → aluminium** (`js/data/fakta.js`: "opdaget 1825 … danskeren H.C. Ørsted", passer med 1825 som året, han fremlagde det). Forsøget med kompasnålen hører til den kommende del **Strøm og magneter** (emne 3, `docs/fakta-strom-og-lys.md`), hvor det er den naturlige første handling: "Tænd for strømmen, og se nålen dreje." Batteriet har strøm, men ingen nål.

**Bogsiden:** *Experimenta* (1820), side 1 (titlen og forelæsningerne) og de sidste linjer (datoen og underskriften "Johannes Christianus Örsted").
- **Smithsonian Libraries** `Experimentacirc00Orst`: "Public domain …". Eksemplaret har et dansk følgebrev fra 1930'erne (Polyteknisk Læreanstalt og Carl Allers Etablissement), så det kan være en **faksimile fra 1930'erne**, ikke et tryk fra 1820. Tjek, før det kaldes originalen. Fotoet er under alle omstændigheder fra før 1970. **Ret sikker.**

## 5. Niels Bohr (1885-1962): Elektronerne i skaller

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Født 7. oktober 1885 i København, død 18. november 1962 | Wikipedia | Sikker |
| Tre artikler i *Philosophical Magazine* i **juli, september og november 1913** ("trilogien"), alle med titlen "On the Constitution of Atoms and Molecules". Del I begynder på **s. 1** i bd. 26 (6. række) | Wikipedia; skanningen af bd. 26 | Sikker |
| Han byggede på **Rutherfords** atom med en lille, tung kerne og lod elektronerne kun have bestemte baner. Det forklarede **hydrogens spektrallinjer** (Balmers formel fra 1885), som ingen havde kunnet forklare i 30 år | Wikipedia "Niels Bohr" og "Bohr model"; del I's første linje nævner Rutherford | Sikker |
| Bohr kaldte skallerne **"ringe"**. Hans opstilling fra 1913 for de lette atomer står i del II (september 1913), **s. 496** | Skanningen af bd. 26, s. 496 ("possible scheme for the arrangement of the electrons in light atoms") | Sikker |
| **Den var anderledes end i dag:** neon står som **(8, 2)**, natrium som (8, 2, 1) og argon som (8, 8, 2), altså med den store ring inderst. I dag skriver vi neon 2, 8. Bohr skrev selv, at der allerede i neon "will occur" en indre ring på otte (s. 494) | s. 494 og 496 | Sikker |
| Modellen virkede for hydrogen og ioner med én elektron, men ikke for større atomer. Omkring 1919 gik Bohr selv væk fra baner | Wikipedia "Niels Bohr" | Ret sikker |
| Nobelprisen i fysik **1922** "for his services in the investigation of the structure of atoms and of the radiation emanating from them" | nobelprize.org ("The Nobel Prize in Physics 1922") | Sikker |
| Instituttet for teoretisk fysik (i dag Niels Bohr Institutet) **åbnede 3. marts 1921**. Wikipedias indledning skriver "opened in 1920" | Wikipedia (samme artikel, to forskellige år) | Ret sikker (1921) |
| Grundstoffet **bohrium** (107) er opkaldt efter ham | `js/data/fakta.js` og Wikipedia | Sikker |

**Gør det i AtomLab:** **Værkstedet** (Byg et atom): Byg neon, og se 2 og 8 elektroner i ringene. Knappen "Elektronsky" viser bagefter, hvorfor ringene er en forenkling (teksten og citatet `bohr` står allerede i hjælpen). *Til "Ærligt talt":* "Bohr tegnede selv neon med otte elektroner inderst og to yderst. Det var forkert, og han rettede det selv nogle år senere."

**Bogsiden:** *The London, Edinburgh and Dublin Philosophical Magazine*, 6. række, bd. 26 (juli-december 1913), s. 1 (del I) og s. 496 (skemaet over ringene).
- **Smithsonian Libraries** `londonedinburg6261913lond` (ingen licens i metadata). **Rettighederne:** Bohrs tekst er beskyttet i EU til og med 2032 (men fri i USA, fordi den udkom før 1931). **Vis ikke et foto af siden før 2033.** Brug vores egen tegning af skemaet og et kort citat. **Ret sikker** (se [rettighederne](fakta-bogsider-rettigheder.md)).

## 6. Inge Lehmann (1888-1993): Jorden har en indre kerne

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Født 13. maj 1888 på Østerbro i København, død 21. februar 1993 (104 år) | Wikipedia (engelsk og dansk) | Sikker |
| Statsgeodæt ved Geodætisk Institut i København | dansk Wikipedia | Ret sikker |
| Studerede jordskælvsbølger fra store skælv ved **New Zealand** (bl.a. Murchison 1929). Nogle P-bølger (trykbølger) blev målt i Rusland (fx Sverdlovsk og Irkutsk), et sted, hvor kernen skulle have skygget for dem | Wikipedia (engelsk) | Ret sikker |
| Hun forklarede det i **1936** med en **indre kerne**, hvor bølgerne går hurtigere og derfor bøjes ud i "skyggen". Før troede man, at hele kernen var flydende og ens | Wikipedia (engelsk og dansk) | Ret sikker |
| Artiklens titel er bare **P′** (P-mærke): *Publications du Bureau Central Séismologique International*, série A, bd. 14 (1936), s. 87-115 | Wikipedia (henvisningen) | Ret sikker |
| Hun skønnede kernens radius til **ca. 1.400 km**. I dag ca. **1.220 km** (ca. 20 % af Jordens radius) | Wikipedia "Earth's inner core" | Ret sikker |
| At den indre kerne er **fast**, blev først foreslået senere og vist i **1971** (svingningerne af hele Jorden efter store skælv, Dziewonski og Gilbert) | Wikipedia "Earth's inner core" ("The rigidity of the inner core was confirmed in 1971") | Ret sikker |
| Hun fandt også en anden grænse 190-250 km nede (**Lehmann-diskontinuiteten**) | Wikipedia | Ret sikker |
| Første kvinde, der fik William Bowie-medaljen (**1971**) | Wikipedia (engelsk og dansk) | Ret sikker |

**Gør det i AtomLab:** **Intet sted i dag.** Det nærmeste er "Hvorfor?"-kortet om Jordens magnetfelt (`js/data/hvorfor.js`, linje ca. 76), der nævner "den faste indre kerne". Hun passer til et kommende **snit gennem Jorden** (Solsystemet → Jorden), hvor man sender jordskælvsbølger gennem kloden og ser skyggen og bølgerne, der bøjes ind i den. Det er en ny del, så hun bør vente, eller kun få et "Hvordan ved vi det?"-kort ved magnetfeltet. **Skriv det ærligt i planen:** Hun er den eneste af de otte uden noget at gøre i dag.

**Bogsiden:** *P′* (1936), side 1 (den korte titel). **Rettighederne:** beskyttet til og med 2063. Skanningen ligger på HathiTrust (lukket). Vis titlen som tekst og en tegning af bølgerne, ikke siden.

## 7. Marie Curie (1867-1934): Stoffer, der stråler

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Født Maria Skłodowska 7. november 1867 i Warszawa, død 4. juli 1934 i Frankrig af aplastisk anæmi, sikkert på grund af strålingen | Wikipedia | Sikker |
| **Becquerel** opdagede strålingen fra uran i **1896**. Curie målte den med et elektrometer (som Pierre og hans bror havde lavet) og fandt, at den kun afhang af mængden af uran | Wikipedia | Ret sikker |
| 12. april 1898: Hun skrev, at to uranmineraler (pechblende og chalcolit) stråler **mere end uranet selv**, og at "dette faktum er meget bemærkelsesværdigt og får en til at tro, at disse mineraler kan indeholde et grundstof, der er meget mere aktivt end uran" | *Comptes rendus* bd. 126 (1898), "Rayons émis par les composés de l'uranium et du thorium": "Ce fait est très remarquable et porte à croire que ces minéraux peuvent contenir un élément beaucoup plus actif que l'uranium" | Sikker (sidetallet 1101-1103: Ret sikker, OCR'en har ingen sidetal) |
| **Juli 1898:** Pierre og Marie Curie fandt **polonium**: "nous proposons de l'appeler polonium, du nom du pays d'origine de l'un de nous" (efter Polen) | *Comptes rendus* bd. 127, s. 175-178 | Sikker |
| **26. december 1898:** **radium** (sammen med Gustave Bémont): "auquel nous proposons de donner le nom de radium" | *Comptes rendus* bd. 127, s. 1215-1217 | Sikker |
| Ordet **"radio-active"** står i titlen på artiklen om polonium ("Sur une substance nouvelle radio-active …"). Wikipedia siger, at hun fandt på ordet | *Comptes rendus* bd. 127; Wikipedia | Ret sikker (at det var første gang: slå op) |
| **Nobelpriser:** fysik **1903**: Halvdelen til Becquerel "for his discovery of spontaneous radioactivity", den anden halvdel til Pierre og Marie Curie "for their joint researches on the radiation phenomena discovered by Professor Henri Becquerel". Kemi **1911** alene "by the discovery of the elements radium and polonium, by the isolation of radium …". Første kvinde med en nobelpris og den eneste, der har fået den i to forskellige naturvidenskaber (Pauling fik kemi og fred) | nobelprize.org (1903, 1911 og "Nobel Prize facts"); "første kvinde" og "eneste i to" fra Wikipedia | Sikker |
| Doktorafhandlingen *Recherches sur les substances radioactives* (juni 1903) | Wikipedia; archive.org `recherchessurles00curi` (2. udgave 1904) | Sikker |

**Gør det i AtomLab:** **Værkstedet:** Byg polonium (84) eller radium (88), og tryk **H**, så kernen henfalder. **Det periodiske system:** kortene for Po, Ra og Cm nævner allerede Curie. Citatet `curie` står i opgavelisten. *Forbindelse:* Einstein foreslog i 1905 at teste E = mc² med **radiumsalte** (se Einstein).

**Bogsiden:** *Comptes rendus hebdomadaires des séances de l'Académie des sciences*, bd. 127 (1898), s. 175 (polonium) og s. 1215 (radium).
- archive.org `ComptesRendusAcademieDesSciences0127` (og `…0126`): **Public Domain Mark**, men kilden er **Gallica (BnF)**. Brug med "Source gallica.bnf.fr / BnF", og tjek BnF's vilkår først. **Ret sikker.**

## 8. Albert Einstein (1879-1955): E = mc² og tiden

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Født 14. marts 1879 i Ulm, død 18. april 1955 | Wikipedia | Sikker |
| I **1905** skrev han fire store artikler i *Annalen der Physik*, mens han arbejdede på patentkontoret i Bern: lyset som kvanter (bd. 17, s. 132-148), Brownske bevægelser (bd. 17, s. 549-560), den særlige relativitetsteori, "Zur Elektrodynamik bewegter Körper" (bd. 17, s. 891-921, modtaget 30. juni) og E = mc² (bd. 18, s. 639-641, modtaget 27. september) | Wikipedia "Annus mirabilis papers" (med bibcodes); s. 641 og datoen set i skanningen | Sikker |
| **Han skrev ikke "E = mc²".** Han skrev: "Gibt ein Körper die Energie L in Form von Strahlung ab, so verkleinert sich seine Masse um L/V²" (L er energien, V er lysets fart) | Skanningen af bd. 18, **s. 641** | Sikker |
| På samme side foreslog han at teste teorien med **radiumsalte**, fordi deres energi ændrer sig meget | s. 641 ("Es ist nicht ausgeschlossen, daß bei Körpern, deren Energieinhalt in hohem Maße veränderlich ist (z. B. bei den Radiumsalzen), eine Prüfung der Theorie gelingen wird") | Sikker |
| Nobelprisen i fysik for **1921** (givet i 1922) "for his services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect", **ikke** for relativitetsteorien. Komitéen fandt i 1921 ingen af årets indstillinger gode nok, så prisen blev gemt til året efter | nobelprize.org ("The Nobel Prize in Physics 1921") | Sikker |
| "Einstein dumpede i matematik" er en myte. Han dumpede den almene del af optagelsesprøven til ETH som 16-årig (et år før tiden), men klarede sig "med udmærkelse" i fysik og matematik | Wikipedia ("performed with distinction in physics and mathematics") | Ret sikker |

**Gør det i AtomLab:** **Kosmos → "Rejsen i tid"** (tvillingen og myonerne, `js/kosmos/tid.js`), **Stjerneovnen** (foldeboksen "Hvor kommer energien fra?" med E = mc²) og **Reaktoren** (citatet `einsteinEnergi`). Fælderne om Einstein står allerede i fakta-fælderne (Michelson-Morley, lysstrålen som 16-årig og samtidighed).

**Bogsiden:** *Annalen der Physik*, 4. række, bd. 18 (1905), **s. 641** (sætningen om L/V² og radiumsaltene).
- archive.org `sim_annalen-der-physik_1905_18_3` (samlingen "Serials in Microfilm", ingen licens i metadata). Teksten er fri i EU fra 1. januar 2026. Mikrofilmens foto: alder og rettigheder ukendte. **Usikker:** Find en kopi med Public Domain Mark (fx på Commons) før brug.

## Myterne ("Ærligt talt")
*Myterne om de otte (Tycho fandt supernovaen, Rømer målte farten, Ørsteds tilfælde, Bohrs ringe, Einsteins nobelpris) står i deres tabeller og under Fælder.*

| Myte | Hvad kilderne siger | Kilde | Sikkerhed |
|---|---|---|---|
| **Newtons æble faldt i hovedet på ham** | Newton fortalte selv historien om et æble, der *faldt*, men ikke i hovedet på ham. William Stukeley skrev, at Newton fortalte det under æbletræerne i Kensington **15. april 1726** ("occasion'd by the fall of an apple, as he sat in a contemplative mood"). Voltaire skrev det i 1727 | Wikipedia "Isaac Newton", afsnittet "Apple story" (Stukeleys håndskrift fra 1752 er udgivet af Royal Society) | Ret sikker |
| **Galilei kastede kugler ned fra det skæve tårn i Pisa** | Historien kommer kun fra hans elev Viviani (skrevet 1654, udgivet 1717). De fleste historikere mener, at det var et tankeeksperiment. **Simon Stevin og Jan Cornets de Groot** gjorde det rigtigt i Delft i **1586** (to blykugler, den ene 10 gange tungere, faldt fra ca. 30 fod) | Wikipedia "Galileo's Leaning Tower of Pisa experiment" | Ret sikker |
| Tychos næse var af guld og sølv | En analyse i 2012 viste **messing** | Wikipedia "Tycho Brahe" | Ret sikker |
| Tycho døde af kviksølvforgiftning | Afvist efter opgravningen i 2010: Kviksølvet sad kun yderst på hårene | Wikipedia "Tycho Brahe" | Ret sikker |
| Curie opdagede radioaktiviteten | Becquerel (1896). Curie fandt nye stoffer, der strålede, og ordet "radio-actif" | se Curie | Ret sikker |
| Curies notesbøger er for farlige at røre | Wikipedia skriver "too dangerous to handle" med Gizmodo (2014) som kilde. Efter hukommelsen kan man læse dem i Paris med beskyttelse | Wikipedia "Marie Curie" | Usikker: Brug den ikke |

## Fælder (også skrevet i [fakta-faelder.md](erfaringer/fakta-faelder.md))
- "Lehmann opdagede den **faste** indre kerne." Hun foreslog en indre kerne (1936), hvor bølgerne går hurtigere. At den er fast, blev vist senere (bekræftet 1971). Skriv "en indre kerne".
- "Ørsted opdagede det ved et tilfælde under en forelæsning." Forelæsningen passer (hans egen tekst), tilfældet er for skarpt.
- "Rømer målte lysets fart." Han målte tiden (22 min for Jordbanens bredde, i dag 16 min 38 s). Huygens regnede farten ud.
- "Bohrs skaller var 2, 8, 8." Hans skema fra 1913 havde neon som (8, 2) med den store ring inderst.
- "Einstein skrev E = mc² i 1905." Han skrev L/V².
- Niels Bohr Institutet "åbnede i 1920" (Wikipedias indledning). Samme artikel siger 3. marts 1921 længere nede.
- Et citat i `citater.js` med `original` på engelsk kan være en oversættelse med egne rettigheder (Tycho).
- "Bogen er fri, så billedet af siden er frit." Ikke i Danmark: Et foto af siden har sin egen ret i 50 år (§ 70).

## Forslag til, hvordan det bygges (til planen, ikke besluttet)
- **Opdagelserne i Biblioteket** (plan-verdener): ét kort pr. person med *én* sætning, *ét* billede af bogsiden (eller vores egen tegning for Bohr og Lehmann), en knap "Gør det selv", der springer til stedet i programmet, og "Ærligt talt" med myten. Seks af de otte har et sted i dag (Tycho, Rømer, Huygens, Bohr, Curie og Einstein). Ørsted får sit sted med Strøm og magneter, og Lehmann med et snit gennem Jorden.
- **"Hvordan ved vi det?"-kort** på stederne selv (Retningens punkt 7): Tycho ved Hvid dværg, Rømer ved Io, Huygens ved Saturns ring, Bohr i Værkstedet, Curie ved henfaldet og Einstein i Stjerneovnen. Så kommer personerne først dér, hvor man gør noget, og Biblioteket samler dem.
- **Rækkefølgen** (en tidslinje): Tycho 1572 → Huygens 1655-1659 → Rømer 1676 → Ørsted 1820 → Curie 1898 → Einstein 1905 → Bohr 1913 → Lehmann 1936.
- **Billeder af personerne:** kun fra Commons med fri licens (ikke tjekket her, se ideer.md).

## Jeres svar (12. november 2026)
1. **Domænerne:** åbnet (se Kilderne øverst). Opslagene er lavet samme dag og rettet ind ovenfor.
2. **Bohr og Lehmann** vises med vores egen tegning og et kort citat, ikke med et foto af siden, til 2033 og 2064.
3. **Lehmann** (Opus' råd, som I fulgte): nu kun et "Hvordan ved vi det?"-kort ved Jordens magnetfelt (`js/data/hvorfor.js`). Et snit gennem Jorden med jordskælvsbølger kommer først, når Solsystemets Jorden får en ny del, og står som idé i `docs/ideer.md`.
4. **Citatet `tycho`** er rettet til Tychos latin (Småting, 12. november 2026).
