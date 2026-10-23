# Faktagrundlag: Molekyler i Atomværkstedet

*Lavet 23. oktober 2026 af en hjælpeagent (Opus, høj effort) til [planen](plan-molekyler.md). Ikke tjekket af Fable.*

**Status:** Tallene er tjekket mod søgeresultater og deres uddrag, men ingen kildesider kunne åbnes i miljøet. Før en tekst kommer med i programmet, skal tallet bag den slås op i kilden (NIST WebBook, CRC eller artiklen) med `/faktatjek`. Det gælder især dem, der er mærket "ret sikker", "usikker" eller "fra min viden".

**Vigtigt om kilderne:** Jeg kunne ikke åbne en eneste side. WebFetch gav DNS-fejl for alle domæner (nist.gov, wikipedia, libretexts), og curl blev afvist af proxyen (403). Alle kilder nedenfor har jeg kun set som søgeresultater med uddrag. Hvor uddragene bekræfter et tal, skriver jeg det. Hvor tallet er standardlærebogsviden, som uddragene ikke dækkede, står det som "fra min viden". Inden teksterne kommer med, bør de vigtigste tal slås op i NIST WebBook eller CRC i en browser.

Omregning: 1 eV pr. molekyle = 96,485 kJ/mol.

## 1. Natrium og chlor

- **Ioniseringsenergien for Na er 5,139 eV (496 kJ/mol).** NIST angiver 5,139076 eV. https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable1.htm (set i uddrag). **Sikker.**
- **Elektronaffiniteten for Cl er 3,613 eV (349 kJ/mol)**, målt af Berzinsh m.fl. 1995 til 3,612724(27) eV. https://arxiv.org/pdf/1301.1598 (uddrag). **Sikker.**
- **Det koster energi for to frie atomer.** 5,14 − 3,61 = 1,53 eV (147 kJ/mol) pr. par. Udregningen er min. **Sikker.** Ioner langt fra hinanden er altså dårligere stillet end neutrale atomer.
- **Elektronen hopper først, når atomerne er tæt på hinanden.** Tiltrækningen mellem plus og minus betaler de 1,53 eV, når afstanden er under 14,40 eV·Å / 1,53 eV ≈ **9,4 Å**. Det er ca. fire gange bindingslængden. Fænomenet kaldes "harpunmekanismen" (Polanyi): elektronen springer over på stor afstand, og bagefter trækker ionerne hinanden ind. https://ar5iv.labs.arxiv.org/html/1510.07687 (uddrag). Mekanismen er **sikker**, og tallet er en enkel udregning (**ret sikker**). Det passer godt til en animation: Atomerne nærmer sig, elektronen hopper, og ionerne suser sammen.
- **Et NaCl-par i gas:**
  - Bindingslængden er 2,36 Å. OpenStax University Physics 3, §9.1: https://openstax.org/books/university-physics-volume-3/pages/9-1-types-of-molecular-bonds. **Sikker.**
  - Det kræver ca. **4,2 eV** at dele parret i to neutrale atomer. Matcha (IBM, J. Chem. Phys.) angiver 0,155 hartree = 4,22 eV. https://research.ibm.com/publications/theoretical-analysis-of-the-electronic-structure-and-molecular-properties-of-the-alkali-halides-iii-sodium-chloride. OpenStax skriver 4,26 eV. **Ret sikker** (4,2-4,3 eV).
  - Regnet fra ionerne: Na⁺ + Cl⁻ → NaCl frigør ca. 4,2 + 1,5 ≈ **5,8 eV**. Udregningen er min. **Ret sikker.**
- **Gitterenergien i krystallen er 787 kJ/mol = 8,2 eV pr. ionpar** (fra frie ioner til krystal). Born-Haber-kredsløb, fx https://cognito.org/courses/alevel/chemistry/ocr/notes/elB6V2RhVE0/22.2-the-born-haber-cycle. Det er også Atkins' tal. **Sikker.**
  - Regnet fra neutrale gasatomer giver krystallen ca. 640 kJ/mol = **6,6 eV pr. NaCl**. Udregning: ΔfH(NaCl) −411, Na(s)→Na(g) +107, ½Cl₂→Cl +122. **Ret sikker.**
  - Til en 13-årig: Det koster 1,5 eV at flytte elektronen, og man får 6-8 eV tilbage, når ionerne sætter sig sammen. Krystallen giver mere end et enkelt par, fordi hver ion har 6 naboer med modsat ladning.
- **Afstanden mellem Na⁺ og Cl⁻ i krystallen er 2,82 Å (282 pm).** Gitterkonstanten er a = 5,640 Å, og afstanden er a/2. https://unit.aist.go.jp/ifm-ri/ja/groups/db-nomura/common/struc-coord/NaCl-c.html og https://www.ilpi.com/inorganic/structures/nacl/index.html. **Sikker.** Afstanden er større end i gasparret (2,36 Å).
- **Terninger:** Ionerne sidder skiftevis i et kubisk gitter (stensaltstrukturen), og hver ion har 6 naboer. Krystallen flækker langs terningens sider. https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Map%3A_Inorganic_Chemistry_(Housecroft)/06%3A_Structures_and_Energetics_of_Metallic_and_Ionic_solids/6.11%3A_Ionic_Lattices/6.11A%3A_Structure_-_Rock_Salt_(NaCl) (Housecroft). **Sikker.** Ærligt: Med tilsætninger og hurtig vækst kan der også komme andre former, fx trappeformede "hopper"-krystaller (fra min viden, **ret sikker**).
- **Strøm:** I tørt salt sidder ionerne fast, så salt isolerer. Opløst i vand (eller smeltet ved 801 °C) kan ionerne bevæge sig, og så er det **ionerne, der bærer strømmen, ikke elektroner, der løber gennem vandet**. Rent vand leder meget dårligt. Lærebogsviden. **Sikker.**

## 2. Elektronegativitet (Pauling)

H 2,20 · C 2,55 · N 3,04 · O 3,44 · F 3,98 (ofte rundet til 4,0) · Na 0,93 · Cl 3,16. https://scilearn.sydney.edu.au/fychemistry/Pauling%20Electronegativities.pdf (uddrag). **Sikker.**

**Tommelfingerregel** (forskellen ΔEN mellem de to atomer):
- under ca. 0,4: upolær kovalent binding, fx C–H (0,35) og H–H (0)
- ca. 0,4-1,7: polær kovalent binding, fx O–H (1,24), N–H (0,84) og C=O (0,89)
- over ca. 1,7-2: mest ionbinding, fx Na–Cl (2,23)

Grænserne er en konvention, og lærebøgerne bruger 1,7, 1,8 eller 2,0. **Ret sikker.**

Ærligt om den glidende overgang:
- Ingen binding er 100 % ionisk. Et mål (min udregning): Hvis NaCl-parret i gas bestod af to rene punktladninger 2,36 Å fra hinanden, ville dipolmomentet være 11,3 D. Målt er 8,97 D (Matcha, link ovenfor). Det svarer groft til "ca. 80 % ionisk". **Ret sikker**, men målet er groft, fordi ionerne trækker i hinandens elektroner.
- HF har ΔEN 1,78, men er et molekyle med en kovalent binding. Reglen er altså kun en tommelfingerregel. **Sikker.**

## 3. Molekylernes form og tal

Tallene i tabellen er fra min viden. Kun vinklen i NH₃ er bekræftet i et uddrag.

| Molekyle | Form | Tal | Sikkerhed |
|---|---|---|---|
| H₂O | bøjet | 104,5°, O–H 0,957 Å, dipolmoment 1,85 D | Sikker (CCCBDB-siden kunne ikke åbnes) |
| CO₂ | lineær (180°) | C=O 1,16 Å, dipolmoment 0 | Sikker |
| CH₄ | tetraeder | 109,5°, C–H 1,09 Å | Sikker |
| NH₃ | pyramide | 106,7°, N–H 1,01 Å, 1,47 D | Ret sikker. Vinklen er bekræftet i uddrag (https://wiki.ch.ic.ac.uk/wiki/Rep:Mod:EM0516), og andre skriver 106,6-107,8° |
| H₂ | | 0,74 Å, enkeltbinding | Sikker |
| O₂ | | 1,21 Å, dobbeltbinding | Sikker |
| N₂ | | 1,10 Å, tripelbinding | Sikker |

**CO₂ er ikke polær,** selv om begge C=O-bindinger er polære. Molekylet er lige, så de to træk er lige store og modsat rettede og ophæver hinanden. **Sikker.**

**Bindingsenergier ved 25 °C** (CRC/Luo og lærebøger, set i uddrag, fx https://direct.physicsclassroom.com/getattachment/Chemistry-Tutorial/Reference-Tables/Bond-Enthalpy/BondEnthalpies.pdf):
- H–H: 436 kJ/mol (4,5 eV)
- O=O: 498 kJ/mol (5,2 eV)
- N≡N: 945 kJ/mol (9,8 eV)
- O–H: 463 kJ/mol (4,8 eV) i gennemsnit. Den første O–H i vand koster 497 og den anden 428.
- C–H: ca. 413-416 kJ/mol (4,3 eV) i gennemsnit
- C=O i CO₂: ca. 803 kJ/mol (8,3 eV)

Kilderne giver 799-805 for C=O. Gennemsnitsværdier varierer lidt fra tabel til tabel. **Ret sikker.**

**Hvorfor vand er bøjet** (enkelt, men korrekt): Oxygen har fire elektronpar omkring sig, to i bindingerne og to frie elektronpar. De frastøder hinanden og stiller sig nogenlunde som et tetraeder. Kun de to H'er "ses", så molekylet ser bøjet ud. De frie par fylder lidt mere og presser vinklen ned fra 109,5° til 104,5°. Det samme mønster ses i rækken CH₄ 109,5° (ingen frie par), NH₃ 107° (ét par) og H₂O 104,5° (to par). Det er VSEPR-modellen. **Sikker som model**, men ærligt: Kemikere diskuterer, om de to frie par virkelig er ens "kaninører". https://pubs.rsc.org/en/content/articlehtml/2014/rp/c4rp00057a (Clauss m.fl. 2014) og svaret fra Hiberty m.fl. Skriv derfor "en model, der forklarer formen godt".

## 4. Knaldgas

- **Reaktionsenergien:** 2 H₂ + O₂ → 2 H₂O frigør **483,6 kJ** (vanddamp) eller **571,7 kJ** (flydende vand). Pr. vandmolekyle er det 2,5 eV (damp) eller 3,0 eV (flydende). Det bygger på ΔfH = −241,8 og −285,8 kJ/mol, som kun blev bekræftet i uddrag fra svage kilder. Tallene er standard (CODATA/NIST). **Sikker.**
- **Udregnet med bindinger:** Det koster 2·436 + 498 = 1370 kJ at bryde bindingerne. Der kommer 4·463 = 1852 kJ tilbage, når de nye O–H-bindinger dannes. Netto frigøres ca. 480 kJ. Pointen: **Energien kommer fra, at de nye bindinger er stærkere end de gamle.** **Sikker.**
- **Sammenligninger** (min udregning):
  - 1 kg hydrogen giver 120 MJ (damp) eller 142 MJ (flydende vand). https://nap.nationalacademies.org/read/10922/chapter/240.html (uddrag). **Sikker.** Det er ca. 2,8 gange så meget som benzin (ca. 43 MJ/kg) pr. kg brændstof.
  - Regnet med oxygenen gemmer 1 kg knaldgas ca. 13,4 MJ, ca. 3 gange så meget som 1 kg TNT (4,2 MJ). **Ret sikker.**
  - 1 g hydrogen (med 8 g oxygen) giver 142 kJ. Det kan varme ca. 0,4 liter vand fra 20 til 100 °C. **Ret sikker.**
- **Hvorfor blandingen ikke eksploderer af sig selv:** Først skal nogle bindinger brydes, og det koster energi (aktiveringsenergi). Ved stuetemperatur går reaktionen så langsomt, at blandingen kan stå i årevis. En gnist er nok, for den mindste tændenergi i luft er kun ca. 0,02 mJ. Selvantændelse sker ved ca. 500-585 °C, afhængigt af forsøget. Blandingen kan brænde ved 4-75 % hydrogen i luft. https://en.wikipedia.org/wiki/Hydrogen_safety og https://www.energy.gov/eere/fuelcells/articles/safetygram-gaseous-hydrogen (uddrag). Grænserne og at der skal en gnist til: **sikker**. Temperaturerne: **ret sikker**, for kilderne er uenige.
- **Trin for trin (kæde af radikaler):** En gnist eller varme river molekyler over, så der kommer frie H- og O-atomer (radikaler: atomer med en uparret elektron, som er meget reaktive). Hovedleddet er H + O₂ → OH + O, som giver to radikaler for ét. Derefter O + H₂ → OH + H og OH + H₂ → H₂O + H. Lægger man trinene sammen, bliver ét H-atom til tre, og samtidig dannes 2 H₂O. Kæden vokser lavinagtigt, og det er derfor, det eksploderer. https://chem.libretexts.org/Courses/University_of_Wisconsin_Oshkosh/Chem_371%3A_P-Chem_2_to_Folow_Combined_Biophysical_and_P-Chem_1_(Gutow)/05%3A_Moving_Molecules_and_Chemical_Kinetics/5.19%3A_Chain_Branching_Explosions og Liang & Law, PCCP 2018 (uddrag). **Sikker.** Ærligt: Det fulde forløb har ca. 20 trin, så skriv "forenklet".
- **RS-25 (rumfærgen og SLS):** Motoren brænder flydende hydrogen og flydende oxygen. Den giver 512.300 lbf (2,28 MN) i vakuum og ca. 418.000 lbf (1,86 MN) ved havoverfladen, med en specifik impuls på ca. 452 s. Kernetrinnet i SLS har fire motorer. https://www.nasa.gov/wp-content/uploads/2020/09/final_sls_rs25_fact_sheet_508_07312015.pdf og https://l3harris.com/sites/default/files/2024-07/l3harris-ar-rs-25-spec-sheet.pdf (uddrag). **Sikker.** Ærligt (fra min viden, **ret sikker**): Motoren kører med for meget hydrogen (ca. 6 dele oxygen til 1 del hydrogen efter vægt, mod 8 til 1 for at alt brænder). Udstødningen er derfor mest vanddamp med lidt uforbrændt hydrogen.

## 5. Jordens vand

- **D/H i havet (VSMOW) er 155,76 × 10⁻⁶.** Det svarer til ca. 1 deuteriumatom pr. 6.400 H, og ca. 1 vandmolekyle ud af 3.200 er HDO (min udregning). https://www.sedgeochem.uni-bremen.de/water_isotopes.html (uddrag). **Sikker.**
- **Kometer:**
  - Kometer fra Oortskyen har i gennemsnit ca. 2,96 × 10⁻⁴, ca. 2 gange havets værdi. **Sikker.**
  - Hartley 2 har (1,61 ± 0,24) × 10⁻⁴, som i havet (Hartogh m.fl., Nature 478, 218, 2011). https://sci.esa.int/web/herschel/-/49382-hartogh-p-et-al-2011. **Sikker.**
  - 67P/Tjurjumov-Gerasimenko: Altwegg m.fl. (Science 2015) målte (5,3 ± 0,7) × 10⁻⁴, ca. 3,4 gange havets værdi. https://sci.esa.int/web/rosetta/-/55119-altwegg-et-al-2015. **Sikker.**
  - **Men:** Mandt m.fl. (Science Advances, nov. 2024) regnede over 4.000 målinger igennem igen. Støv med deuteriumrig is havde trukket tallet op, og langt fra kernen er D/H "close to terrestrial". https://astrobiology.com/2024/12/09/nasa-led-team-links-comet-water-to-earths-oceans/. **Ret sikker** på resultatet. Spørgsmålet om kometerne er altså åbent igen.
- **Kulholdige meteoritter:** Vandet i dem, især i CI-typen, har D/H tæt på havets. De peger på asteroider som hovedkilden (Alexander m.fl., Science 2012, 85-86 meteoritter). https://www.chemistryworld.com/research/where-did-earths-water-come-from/5216.article. **Ret sikker.** Jeg fandt ikke et præcist tal.
- **Ryugu (Hayabusa2):**
  - Prøven landede i Australien 6. december 2020 og vejede ca. 5,4 g. **Sikker.**
  - Materialet ligner CI-meteoritter. Vandet sidder i lermineraler (vandholdige mineraler), ikke som is. Det blev omdannet af vand ved ca. 37 °C, ca. 5 millioner år efter Solsystemets begyndelse (Yokoyama m.fl., Science 379, 2023, online 2022). https://eprints.lib.hokudai.ac.jp/dspace/handle/2115/90313. **Sikker.**
  - D/H i de vandholdige mineraler er (165 ± 19) × 10⁻⁶, tæt på havets 156 (Piani m.fl., ApJL 2023). https://profiles.wustl.edu/en/publications/hydrogen-isotopic-composition-of-hydrous-minerals-in-asteroid-ryu/. **Ret sikker.**
- **Bennu (OSIRIS-REx):**
  - Prøven landede 24. september 2023 og vejede 121,6 g. **Sikker.**
  - Den består mest af vandholdige mineraler (serpentin, smektit).
  - McCoy m.fl. (Nature, jan. 2025) fandt 11 mineraler fra fordampet saltvand (evaporitter), bl.a. **halit (NaCl, køkkensalt!)**, sylvit og natriumcarbonat. Bennus moderlegeme havde altså flydende saltvand.
  - Glavin m.fl. (Nature Astronomy, 2025) fandt usædvanligt meget ammoniak, 14 af de 20 aminosyrer i proteiner og alle 5 nukleobaser. Glavin som forfatter har jeg ikke set bekræftet.
  - https://lpl.arizona.edu/news/spotlight/asteroid-bennu-comes-long-lost-salty-world-ingredients-life og https://www.nasa.gov/news-release/nasas-asteroid-bennu-sample-reveals-mix-of-lifes-ingredients/. **Sikker.** D/H for Bennu fandt jeg ikke.
- **Vand dannet før Solen:** I kolde molekylskyer (ca. 10 K) sætter H-atomer sig på O-atomer på iskolde støvkorn: O → OH → H₂O. Det er vist i laboratoriet (Dulieu m.fl.). https://arxiv.org/pdf/0903.3120. **Sikker.**
  - Ekstra deuterium er et "fingeraftryk" af stor kulde. Cleeves m.fl. (Science 2014) regnede ud, at Solens skive ikke selv kan lave havets deuterium, så en del af vandet må være arvet. Ca. 30-50 % af havvandet kan være ældre end Solen, og mindst ca. 7 %. https://www.scientificamerican.com/article/earth-has-water-older-than-the-sun/. **Ret sikker.** Det er en model, ikke en måling.
- **Vand i Jordens byggesten:** Enstatit-kondritter blev regnet for tørre. Piani m.fl. (Science 369, 1110, 2020) fandt i 11 af 13 meteoritter hydrogen nok til mindst 3 gange havenes vand, og med isotoper som i Jordens kappe. https://www.cnrs.fr/en/earth-may-always-have-been-wet. **Sikker** på resultatet. Det udelukker ikke, at noget kom senere.
- **En anden idé:** Hydrogen fra urskyen kan have reageret med et hav af magma (Young m.fl., Nature 2023, fra min viden). **Ret sikker** på, at idéen findes.
- **Hvor meget vand:**
  - Havene vejer ca. 1,4 × 10²¹ kg, ca. 0,023 % af Jordens masse (min udregning). **Sikker.**
  - Kappen kan rumme 0,5 til flere haves vand. En ringwoodit-krystal med ca. 1-1,5 % vand (Pearson m.fl., Nature 2014) blev forstørret op til "måske et hav". https://physicstoday.aip.org/news/unexpected-mineral-hints-at-large-amounts-of-water-in-earths-mantle. **Usikker** (tallet er usikkert i sig selv).
- **Samlet billede (ærligt):** Det meste vand kom nok fra stenmateriale som asteroider og Jordens egne byggesten, og en del af det er ældre end Solen. Kometerne bidrog nok lidt, men hvor meget, diskuteres igen efter 2024. Ingen ved det med sikkerhed.

## 6. Fælder

1. **"Atomer vil gerne have en fuld skal."** For frie Na og Cl koster overførslen 1,5 eV. Gevinsten (5,8 eV i et par, 8,2 eV pr. ionpar i krystallen) kommer fra tiltrækningen mellem plus og minus. "Fuld skal" forklarer, *hvilke* ladninger der dannes (+1, −1), ikke *hvorfor* det sker. Bemærk: **hjælpens "Hvad er en ion?" (index.html, linje ca. 689-691) og halogen-kortets `forsøg` i js/data/kategorier.js (linje 74: "så begge får en fuld yderste skal") skal tjekkes**, ligesom DESIGN.md siger.
2. **"Salt er molekyler."** Køkkensalt er et gitter af ioner. NaCl er forholdet 1:1, og hver ion har 6 naboer. Enkelte NaCl-par findes kun i damp.
3. **"Bindinger gemmer energi, der frigives, når de brydes."** At bryde en binding koster altid energi. Energien kommer fra de nye, stærkere bindinger. Halvdelen af gymnasieelever i et studie (Boo, JRST 35, 569, 1998) troede det modsatte. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12142379/. **Sikker.**
4. **"Vand er bare H₂O."**
   - Molekylerne hænger sammen med hydrogenbindinger.
   - Ca. 1 ud af 3.200 molekyler er HDO.
   - Ca. 1 ud af 550 millioner vandmolekyler er delt i H⁺ og OH⁻ (min udregning ud fra pH 7: 10⁻⁷ / 55,5 mol/L). **Sikker.**
5. **"Saltvand leder strøm, fordi elektronerne løber i vandet."** Det er ionerne, der flytter sig.
6. **"CO₂ er upolær, fordi bindingerne er upolære."** Bindingerne er polære, men de ophæver hinanden.
7. **"Ionbindinger er stærkere end kovalente."** Ikke altid: N≡N (9,8 eV) er stærkere end NaCl-parret (4,2 eV fra atomerne). **Ret sikker.**
8. **"O₂ er O=O med alle elektroner i par."** O₂ har to uparrede elektroner, så flydende oxygen hænger fast på en magnet. Stregmodellen er en forenkling. **Sikker.**
9. **"Knaldgas eksploderer af sig selv"** / **"en flamme med hydrogen giver kun vand."** Der skal en gnist til (en meget lille en). I luft dannes også lidt NOx. **Ret sikker.**
10. **"Jordens vand kom fra kometer."** Det meste nok ikke, men se Mandt 2024.
11. **Elektronegativitetsreglen er en skarp grænse.** Den er en tommelfingerregel, se HF.

## Forslag til "Ærligt talt"-linjer

1. "Natrium giver ikke sin elektron væk af lyst. Det koster faktisk energi. Gevinsten kommer, når plus og minus bagefter trækker i hinanden."
2. "Der findes ikke ét saltmolekyle. Et saltkorn er et kæmpe gitter, hvor hver ion har seks naboer med modsat ladning."
3. "Ingen binding er helt ionbinding eller helt delt. Selv i salt deler atomerne lidt, og i vand trækker oxygen mest i elektronerne."
4. "Det koster altid energi at bryde en binding. Knaldgas giver energi, fordi de nye bindinger i vand holder bedre end de gamle."
5. "Tegningen med to H'er og én O og streger er en model. Elektronerne er skyer, ikke prikker på streger."
6. "Vandmolekylet er bøjet, fordi oxygen også har to elektronpar, der ikke binder. Modellen forklarer vinklen godt, men kemikere diskuterer stadig, hvordan de par ser ud."
7. "O₂ er lidt mærkelig: Den har to elektroner uden makker, så flydende oxygen hænger fast på en magnet."
8. "Hvor Jordens vand kom fra, ved man ikke sikkert. Det meste kom nok med stenene, og en del er måske ældre end Solen."
9. "I 2025 fandt man køkkensalt (halit) i støv fra asteroiden Bennu. Der har engang været saltvand derude."

## Det, jeg er mindst sikker på

- Alle kilder er kun set i søgeuddrag. Ingen sider kunne åbnes (DNS- og proxyfejl).
- NaCl-parrets energi (4,2 eV til atomer, 5,8 eV til ioner) og "ca. 80 % ionisk": udregninger på tal fra uddrag. Huber & Herzberg eller NIST blev ikke åbnet.
- C=O i CO₂ (799-805 kJ/mol) og C–H (413-416): Tabellerne er uenige.
- Selvantændelsen for hydrogen (500-585 °C).
- Kappens vandmængde.
- Cleeves' 30-50 % (en model).
- Mandt 2024 mod Altwegg 2015: Debatten er ikke afgjort.
- At Glavin er forfatter på Bennu-artiklen, og D/H for Bennu (ikke fundet).
- Young m.fl. 2023 (fra min viden, ikke tjekket).
- Ammoniaks vinkel (106,6-107,8° i forskellige kilder, brug "ca. 107°").
