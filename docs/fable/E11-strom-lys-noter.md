# Noter til E11: Fables drejebøger til Strøm og magneter og Lys og farver

*Skrevet 14. november 2026 af Opus (spor Småting) efter "Efter Fables svar" i [prompt-fable-strom-lys.md](../prompt-fable-strom-lys.md). Fables fil er [E11-strom-lys-drejebog.md](E11-strom-lys-drejebog.md) og rettes ikke. Drejebøgerne er flyttet til [drejebog-strom.md](../drejebog-strom.md) og [drejebog-lys.md](../drejebog-lys.md) og rettet efter disse noter. Spørgsmålene til jer står til sidst og i begge drejebøger.*

## 1. Det, jeg har slået op (Fables (H))
Fable mærkede fem ting **(H)** (efter hukommelsen), ikke tre. Fire er slået op i dag, og alle fire holder. Den femte kunne ikke slås op.

| Fables påstand | Det, jeg fandt | Sikkerhed nu |
|---|---|---|
| Solens kant viser en **rød, en gul og en blågrøn** linje (trin 4 i Lys) | Lockyers brev til Royal Society, 20. oktober 1868 (*Proceedings of the Royal Society* 17, s. 91-92, læst på archive.org `proceedings1718681869roya`): "three bright lines … I. Absolutely coincident with C. II. Nearly coincident with F. III. Near D." C er hydrogens røde (656,3 nm), F hydrogens blågrønne (486,1 nm), og den tredje er heliums gule. **Men:** Lockyer så dem i London uden formørkelse, og hans spektroskop viste kun en del af spektret. Hydrogens blå og violette linjer er også i Solens kant (se afsnit 3, Lys punkt 1) | **S** (ordlyden) |
| Helium ses **ikke** blandt de mørke linjer i almindeligt sollys | Gershberg m.fl. 2024 (arXiv 2411.11898, s. 119): "The helium D3 absorption line is absent in the spectrum of the quiescent photosphere of the Sun but can be seen in active regions". Wikipedias tabel over Fraunhofer-linjerne har den alligevel med som D₃ (navnet kommer fra Lockyers lyse linje). Grunden (Solens overflade er for kold til at løfte heliums elektron så højt, ca. 21 eV) er lærebogsfysik | **RS** |
| Et rør med hydrogen lyser **lyserødt**. En skærm kan ikke vise de rene farver i spektret | Wikipedia "Gas-discharge lamp" (tabellen): hydrogen "Lavender at low currents, pink to magenta over 10 mA". Wikipedia "Spectral color": "displays cannot produce all, if any, spectral colors" | **RS** |
| Jordens **vandrette** felt i Danmark er ca. **17 µT** (ca. **50 µT** i alt). 45° to cm fra tråden kræver ca. **1,7 A** | Regnet med IGRF-14 (koefficienterne fra pakken `ppigrf` på GitHub, mit eget lille script, tjekket mod Boulder) for 14. november 2026: København 16,8 µT vandret, 50,7 µT i alt og 71° hældning. Aalborg 16,2 og Esbjerg 17,0 µT vandret. Strømmen: B = μ₀I/(2πr) = 16,8 µT ved 2 cm giver **1,68 A** | **S** (regnet) |
| Vindens andel af det, Danmark **bruger**, er lavere end 59,3 % af det, Danmark **laver** | Ikke slået op: ens.dk, energinet.dk og dst.dk er lukket i miljøet. Det betyder intet for drejebøgerne, for kernesætningen har intet tal. Slås op, før et tal skrives i en tekst | **U** |

Fables andre nye fakta (helium 18. august 1868, 587,56 nm, Palmieri 1881, Ramsay 1895, Payne 1925, NIST-linjerne for Li, Cs og Rb) har jeg ikke slået op igen. De har kilder i Fables tabel og tjekkes med `/faktatjek`, når teksterne skrives. Heliumhistorien og 587,5618 nm står også i Wikipedia "Helium" og "Fraunhofer lines", som jeg har læst i dag.

## 2. Det, der er nyt, og som jeg er enig i
1. **Fables største fund: Helium var en lys linje fra Solens kant, ikke en mørk linje i sollyset.** Faktagrundlaget (afsnit 9, Del B, punkt 2) var skrevet, så man kunne tro det modsatte. Det gør forløbet enklere: lyse streger hele vejen, og de mørke linjer bor i laboratoriet. Faktagrundlaget er rettet (afsnit 7 og 9).
2. **Byg Lys først.** Kvantefysik forløb 2 skal bruge Lys, mens intet venter på Strøm. Lys har også det stærkeste wow og binder Værkstedet, Det periodiske system og Solen sammen.
3. **Ét forløb pr. del**, og Strøms trin 6 er kun "Det så du", så det er reelt fem trin.
4. **Kun salte, hvor atomerne selv lyser, i forløbet** (natrium, lithium og kalium). Kobber, strontium og barium (brede bånd fra molekyler) i laboratoriet. Det undgår faktagrundlagets fælde om fyrværkeriet.
5. **Hydrogen-røret i trin 3.** Hydrogen farver ikke en flamme, men dens stregkode skal bruges i trin 4. Røret løser det.
6. **"Elektronens trin" som et "Hvorfor?"-kort i Lys med kun hydrogen** (dér er trin og skaller det samme, så fælden om natrium undgås). Det passer med reglen om ingen scrollbar i Værkstedet og med E7-noternes punkt 8 (stigen skal stå i en scene, ikke i et panel). **Men det ændrer jeres svar fra 13. november** (Kvantefysik spørgsmål 3: "Elektronens trin i Værkstedet bliver bygget af Lys"). Derfor er det spørgsmål 2.
7. **Arbejdsdelingen med Kvantefysik:** Lys viser, *at* hvert grundstof har en stregkode, og hvad man kan bruge den til. Kvantefysik viser, *hvorfor* der er trin. Lys bruger hverken bølger eller fotoner. Det passer med jeres svar 3 i Kvantefysik og med E7-noternes punkt 4 (forløb 2 gøres mindre).
8. **Sådan regner scenen i Strøm:** tan(vinkel) = trådens felt / Jordens vandrette felt, ca. 45° tæt på og aldrig 90°. Nu regnet efter (afsnit 1).
9. **Grafikken i Lys:** streger mindst 3 px med glød, styrken presset sammen, natriums to linjer som én og én funktion fra bølgelængde til farve alle steder. Heliums linje 1,4 nm fra natriums kræver en lup.
10. **Kernesætningen i Strøm** slutter med "en vindmølle" i stedet for "vindmøllerne vores strøm" (spørgsmål 4).

## 3. Hvor jeg er uenig eller vil lægge noget til
**Lys:**
1. **Solens kant i trin 4 skal vise hydrogens fire linjer, ikke kun den røde og den blågrønne.** Barnet har lige gemt hydrogens stregkode med fire streger (rød, blågrøn, blå og violet). Lægges den på en kant med kun tre linjer, passer to af stregerne ikke, og "Hydrogen passer" bliver forkert. Hydrogens blå og violette linjer er også i lyset fra Solens kant, bare svagere (Lockyers tre linjer var det, hans instrument kunne se). **Sådan:** Kanten viser fem lyse linjer: hydrogens fire og den gule. "For nørder" kan sige, at Lockyer så den gule linje i London 20. oktober 1868 uden formørkelse, og at kanten har mange flere linjer (fx calcium).
2. **"Et, ingen kender" kræver, at barnet ved, at astronomerne havde stregkoderne for alle kendte grundstoffer.** Barnet har kun tre kort. Ellers kan han tænke: "Den passede bare ikke på mine tre." **Sådan:** Så siger: "Hydrogen passer. Den gule linje passede ikke på nogen af de grundstoffer, man kendte. Den fik navnet helium, efter Solen." Og gættet "Et, ingen kender" bliver "Et grundstof, ingen kendte".
3. **Trin 3 har to handlinger** (lithium og hydrogen-røret), og skabelonen siger én. Det er samme slags træk, så det er en lille ting: Lithium trækkes hen, og hydrogen-røret står ved siden af og tænder af sig selv, når lithiums streger er gemt. Eller man trækker begge, og det står i Gør som "Træk de to andre hen foran sprækken".
4. **Prismet spreder ikke farverne jævnt** (violet spredes langt mere end rødt). Stregkoderne skal kunne sammenlignes, så tegn væggen med en jævn skala (som et gitter), og sig det i "Ærligt talt". Prismet bliver i scenen.
5. **De mørke linjer i laboratoriet:** Helium må ikke tegnes som en mørk linje i sollyset (nu slået op). Natrium og hydrogen må gerne.

**Strøm:**
6. **Trin 3 og Jordens felt hænger ikke sammen med trin 1.** I trin 1 er Jordens træk med (det giver 45°). Ved 1,7 A er trådens felt lige så stærkt som Jordens, så små nåle rundt om tråden vil ikke danne pæne ringe, men et skævt mønster. **Sådan:** I trin 3 viser de små nåle kun trådens eget felt, og "Ærligt talt" siger: "Her har vi slukket for Jordens træk, så du kan se trådens magnetfelt alene." Kameraet drejer, så man ser langs tråden, for ringene står lodret, og en finger kan ikke føre en nål rundt i en flade, man ser fra siden.
7. **En pære kan ikke lyse af en magnet, der skubbes med hånden.** En glødepære skal bruge langt mere strøm, end en hånd og en lille spole kan lave. En lysdiode kan godt (sådan virker en rystelygte, efter min viden). Men én lysdiode lyser kun den ene vej, så halvdelen af bevægelserne giver intet. **Mit forslag:** To lysdioder vendt hver sin vej (rød, når magneten går ind, grøn, når den går ud). Det er et kendt skoleforsøg, det er ærligt, og det viser Fables egen pointe om retningen uden ord. I teksten hedder den bare "lampen" (intet nyt fagord). I vindmøllen i trin 5 kan der godt være en almindelig pære.
8. **Trin 1 "På tværs sker der ingenting"** er kun rigtigt ved svag strøm. Er trådens felt stærkere end Jordens og peger den modsatte vej, vender nålen helt om. Det skal scenen regne rigtigt (det gør tan-formlen, hvis den bruges med fortegn), og det kan blive en sjov opdagelse i laboratoriet.
9. **Vindmøllens magneter:** "Ærligt talt" skal sige, at nogle møller har faste magneter og andre elektromagneter (Fables kilde siger "most … do not use permanent magnets", men jeg tror, at mange nye havmøller har faste magneter, efter min hukommelse, ikke slået op). Begge er en magnet, der drejer forbi spoler, så trin 5 holder. Skriv ikke "de fleste", før det er slået op.

**Begge:**
10. **Ordbogen** mangler alle de nye ord: strøm, magnetfelt, spole og generator (Strøm), prisme, spektrum og spektrallinje (Lys) og energitrin (deles med Kvantefysik). De skrives sammen med delen, med `/faktatjek`.
11. **Faktagrundlagets Del B, punkt 3** ("Elektronens trin" i Værkstedet) og afsnit 11 (Jordens felt "et gæt") er rettet i faktagrundlaget.

## 4. Det, I skal tage stilling til
Fables fire spørgsmål. Jeg er enig i Fables anbefaling i alle fire. Står også i drejebøgerne.
1. **Rækkefølgen:** Lys først (anbefalet) eller Strøm først som i køreplanen.
2. **"Elektronens trin":** et "Hvorfor?"-kort med en lille scene inde i Lys, kun hydrogen, som Kvantefysik genbruger (anbefalet), eller et værktøj i Værkstedet (det, I svarede 13. november).
3. **Strøm som ét forløb** på seks trin, der deles efter trin 3, hvis prøven viser over fem minutter (anbefalet), eller to forløb fra starten.
4. **Kernesætningen i Strøm:** "Sådan laver en vindmølle strøm" (anbefalet) eller "Sådan laver vindmøllerne vores strøm".

## Jeres svar (14. november 2026)
Alle fire som anbefalet: Lys først, "Elektronens trin" som kort i Lys, Strøm som ét forløb og "Sådan laver en vindmølle strøm". Skrevet ind i begge drejebøger, i [drejebog-kvantefysik.md](../drejebog-kvantefysik.md) og i køreplanen.
