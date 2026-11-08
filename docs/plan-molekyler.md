# Plan: Molekyler i Atomværkstedet

*Udkast, 23. oktober 2026 (punkt 9 i "Lige nu" i DESIGN.md). Lavet af Opus med høj effort. Fable venter på version 5.5, så planen er ikke tjekket af Fable. Tallene står med kilder i [fakta-molekyler.md](fakta-molekyler.md). Punkter mærket **(foreslået)** er mine anbefalinger. Spørgsmålene i afsnit 7 skal I svare på, før vi bygger.*

## Hvad det går ud på
Indtil nu bygger man ét atom ad gangen. Her skal man se, hvad der sker, når atomer mødes. Jeres ønsker (DESIGN.md, 21. oktober 2026):
- **Give og tage elektroner (ionbinding):** En elektron hopper fra natrium til chlor. De bliver til Na⁺ og Cl⁻, som trækker i hinanden. Sådan er køkkensalt.
- **Dele elektroner (molekyler):** H₂, O₂, H₂O og CO₂. Atomerne deler elektronerne i par. I vand trækker oxygen mest i de delte elektroner, og vandmolekylet er bøjet.
- **Se vand blive til:** 2 H₂ + O₂ → 2 H₂O. Molekylerne går i stykker, atomerne sætter sig sammen på en ny måde, og der bliver frigjort energi.
- **Hvor kom Jordens vand fra?** Ærligt, at man ikke ved det helt.
- Både frit byggeri og trin for trin med opgaver.
- Delen, hvor atomerne giver og tager elektroner, kan hedde noget i stil med **Byttebørsen** (jeres forslag).

Det, man skal gå derfra med:
1. Atomer binder sig til hinanden med de **yderste elektroner**. Kernen er med, men den ændrer sig ikke (det er forskellen på kemi og kernefysik, som man kender fra Stjerneovnen og Reaktoren).
2. Nogle atomer **giver** elektroner væk, og andre **deler** dem. Der er en glidende overgang, og den afgøres af, hvor hårdt atomerne trækker i elektronerne (elektronegativitet).
3. Et molekyle har en **form**, og formen kommer af, at elektronparrene skubber hinanden væk. Derfor er vand bøjet.
4. Energien i en kemisk reaktion kommer af, at de nye bindinger er **stærkere** end de gamle. Det koster energi at bryde en binding. Man får energi, når en ny bliver lavet.

## 1. Hvor delen ligger
**Forslag: i Atomværkstedet med knapper øverst**, ligesom "Spalt én kerne" og "Kædereaktion" i Reaktoren. Infopanelet må ikke få en rullebjælke, så hver del får sit eget panel.

| Knap | Hvad |
|---|---|
| **Byg et atom** | Værkstedet, som det er i dag. |
| **Byttebørsen** | To atomer giver og tager elektroner (ionbinding). Til sidst en saltkrystal. |
| **Byg molekyler** | Frit byggeri med H, C, N, O og Cl, hvor atomerne deler elektroner. Med knappen "Gnist" kan man lave knaldgas om til vand. |

Det, man har bygget i "Byg et atom", tager man med: Har man bygget et neutralt natriumatom, står det klar i Byttebørsen.

## 2. Byttebørsen (ionbinding)
**Trin for trin (første gang) og bagefter frit:**
1. **To atomer side om side:** natrium og chlor, langt fra hinanden. Kun den yderste skal er tydelig, og de inderste er svage (man kan slå dem til). Under hvert atom står, hvor mange elektroner det har i den yderste skal.
2. **Giv en elektron:** Man trækker natriums yderste elektron over til chlor med fingeren eller musen. En energimåler viser ærligt:
   - Det **koster** energi at trække elektronen af natrium.
   - Chlor **giver noget tilbage**, når den får elektronen, men **mindre**.
   - Bjælken står altså i minus. "Atomer vil gerne have en fuld skal" passer ikke alene (fælden i erfaringer.md).
3. **Lad dem mødes:** Na⁺ og Cl⁻ trækker i hinanden og flyver sammen. Nu går energimåleren langt over nul (ca. 1,5 eV koster det, og ca. 5,8 eV får man tilbage i et par). Det er tiltrækningen mellem plus og minus, der betaler. De stopper, når elektronskyerne begynder at skubbe.
   - **Ærligt:** I virkeligheden hopper elektronen først, når atomerne er kommet tæt på hinanden (under ca. 1 nanometer), for så betaler tiltrækningen allerede for hoppet. Det kaldes **harpunen**: Elektronen springer over som en harpun, og så trækker ionerne hinanden ind. Første gang viser spillet det omvendt (giv elektronen, og lad dem mødes), så man ser regnestykket. Bagefter kan man trykke "Sådan sker det i virkeligheden" og se harpunen.
4. **Byg en krystal:** Flere par kommer til, og de lægger sig i et terningemønster (hver Na⁺ har seks Cl⁻ omkring sig). Kameraet zoomer ud, så man ser, at saltkorn er små terninger. Energien bliver endnu større i krystallen.
5. **Ærligt talt:** Salt er ikke molekyler. Det er et gitter af ioner, hvor ingen Na⁺ hører til én bestemt Cl⁻.

**Andre par (opgaver):**
- **Li + F** (lithiumfluorid): det letteste salt.
- **Mg + O** (magnesiumoxid): to elektroner flytter sig. Det, der brænder så hvidt i stjernekastere og blitz, er magnesium, der bliver til magnesiumoxid.
- **Ca + 2 Cl** (calciumchlorid, vejsalt): Ét atom giver én elektron til hver af to chloratomer.
- **Na + Na:** Det sker ikke, og man får at vide hvorfor (de trækker lige hårdt).

**Grafik:** Atomerne genbruger skallerne fra `Atom` (ringe), men kernen er lille og rolig, for den ændrer sig ikke. Elektronen, der skifter, får et lysspor. Na⁺ krymper, når den mister sin yderste skal, og Cl⁻ vokser lidt (ionernes rigtige størrelsesforhold, se faktagrundlaget). Krystallen er en InstancedMesh.

### M1 i dag (tjekket mod koden 7. november 2026, Trin 0)
Planen er fra før U1-U4, `lag.js`, tidsknappen og kontakterne. Sådan passer Byttebørsen ind i det, der findes nu:
- **Del-knapperne** står i Værkstedets toplinje lige efter overskriften, som i Reaktoren (`.del-vælger` med to knapper: "Byg et atom" og "Byttebørsen"). De får `data-vaerksted-del`, ikke `data-del`: Reaktoren finder sine knapper med `document.querySelectorAll('.del-knap[data-del]')` uden at afgrænse (tjekliste D). På tablet på højkant og telefon (≤ 820 px) får de deres egen linje i toplinjen (`order: 3`), og opgavepillen kommer under dem.
- **Hvad der skifter:** I Byttebørsen skjules byggepanelet, infopanelet, det lille periodiske system, kontakten "Elektronsky" (prikkerne på ringe er altid prikker) og opgavepillen (i M1a er der ingen opgaver endnu). Byttebørsen får sit eget venstre og højre panel og sit eget gitter, hvor 3D-billedet er stort nok til at trække i på telefonen (som Reaktoren: 3D øverst og panelerne nedenunder ≤ 820 px). Atomet fra "Byg et atom" skjules og står uændret, når man skifter tilbage.
- **Panelet i lag:** Højre panel har trinnet lige nu (kort tekst), måleren med tallene og "Hvorfor?"-knapper (`visHvorfor`) til "Hvorfor koster det?" og "Hvad er en ion?". Tallene og modellen står i en foldeboks "For nørder" (`lag-boks`), og "Ærligt talt" i en foldeboks. Ingen rullebjælke: Det, der ikke kan være, går ind bag "Hvorfor?". "Næste skridt" (`lavNæsteSkridtKort`) står øverst til venstre i 3D-billedet og siger, hvad man skal gøre nu ("Træk den yderste elektron fra natrium over til chlor").
- **Tiden:** Tidsknappen (`lavTidsknap`, ⏸ ▶) står nederst til højre i 3D-billedet. Alt i Byttebørsen bruger `dt` fra opdateringen, så pausen virker. Knapper, der starter noget (fx harpunen), lader tiden gå igen (`fortsæt`).
- **Fremgangen (M1b):** Opgaverne får id'er med `bytte-` foran i `fremgang.js` (ingen ændring i selve modulet). Forslag: De tæller med på Værkstedets kort i menuen (de ligger i Værkstedet), og der kommer ikke en ny linje i menuen, før "Byg molekyler" (M2) findes. Besluttes ved M1b.
- **Jeres svar til M1b (7. november 2026):** (1) Li + F, Mg + O og Ca + 2 Cl går direkte fra elektronerne til krystallen ("Byg krystallen", måleren går over nul med gitterenergien). Kun Na + Cl har parret i gas først, så krystallen bagefter. (2) Calciumchlorid får sit eget mønster (rutil-typen: hver Ca²⁺ har seks Cl⁻, hver Cl⁻ har tre Ca²⁺), og teksten siger, at det er et andet mønster end køkkensalt. (3) Na + Na: Måleren viser −4,59 eV, og elektronen flyver hjem igen ("de bytter ikke"). (4) De fem par er opgaver med ★ på knapperne i venstre panel og tæller med på Værkstedets kort i menuen og i Værkstedets "Opgaver forfra". Ingen ny linje i menuen før M2.
- **Det, man har bygget:** Har man et neutralt natrium- eller chloratom i "Byg et atom", står der "Dit natriumatom fra værkstedet" under det i Byttebørsen. Byttebørsen er ikke låst.
- **Energimåleren:** én vandret bjælke med et nul i midten ("Regnskabet": det, man har fået, minus det, det har kostet, i eV), og under den tre små linjer: "Tage elektronen fra natrium: −5,14", "Chlor tager den: +3,61" og "Plus og minus trækker: +x,xx". Bjælken står i 3D-billedet (så den ses, mens man trækker, også på telefonen), og tallene står i højre panel.
- **Fysikken i mødet:** Energien for parret er −14,40/r eV·Å (Coulomb) plus en frastødning, der vokser hurtigt tæt på (Born-Mayer, `A·e^(−r/ρ)`), valgt så parret stopper ved 2,36 Å med 4,26 eV i alt fra de neutrale atomer (OpenStax). Afstandene tegnes større, men i det rigtige forhold. Det står i "For nørder".

## 3. Byg molekyler (kovalente bindinger)
**Frit byggeri:**
- En lille palet med H, C, N, O og Cl (måske senere F, S og P). Man trækker et atom ind i 3D-billedet.
- Hvert atom viser sine **yderste elektroner** som prikker, og de elektroner, der ikke har en partner, blinker svagt.
- Kommer to atomer tæt på hinanden, og har de begge en elektron uden partner, **springer en binding**: De to elektroner lægger sig som et par mellem atomerne (en lille sky). Dobbelt- og tripelbindinger kommer, når der er flere elektroner uden partner (O₂ og N₂).
- **Formen kommer af sig selv:** Elektronparrene skubber hinanden væk (også de frie par, som ikke binder). Så bliver vand bøjet, ammoniak en lav pyramide, metan en tetraeder og CO₂ en lige linje. Fysikken er en enkel model med fjedre og frastødning, som giver de rigtige vinkler inden for ca. 1°. Den er ikke en rigtig kvanteudregning, og det står i "For nørder".
- **Ladning:** Trækker det ene atom mere i elektronparret, bliver skyen skæv, og enderne farves svagt blå (lidt plus, δ+) og røde (lidt minus, δ−). I vand bliver oxygen-enden rød og hydrogen-enderne blå.
- Når et molekyle er færdigt (ingen elektroner uden partner), lyser det op og får sit navn, hvis det er et kendt molekyle: "Vand (H₂O)". Et kort fortæller, hvor man møder det, ligesom grundstofkortet.
- **Kendte molekyler (forslag, ca. 15):** H₂, O₂, N₂, Cl₂, HCl, H₂O, H₂O₂ (brintoverilte), CO₂, CO, CH₄ (metan), NH₃ (ammoniak), C₂H₆ (ethan), C₂H₄ (ethen), C₂H₂ (ethyn), CH₃OH (methanol), C₂H₅OH (ethanol), HCN. Ukendte, men lovlige molekyler får formlen og "Det er et rigtigt molekyle, men det har ikke noget kendt navn her".
- **Ulovligt:** Et H, der får to bindinger, sker ikke. Atomet skubbes væk, og der står hvorfor.
- **Ærligt talt (i "For nørder"):** Prikkerne og stregerne er en model (Lewis-strukturer og VSEPR). Elektronerne er skyer. Modellen tager også fejl ét kendt sted: O₂ har i virkeligheden to elektroner uden makker, så flydende oxygen hænger fast på en magnet.

**Opgaver (forslag):**
1. Byg H₂ (det enkleste molekyle).
2. Byg vand, og se, at det er bøjet.
3. Find ud af, hvorfor CO₂ ikke er polær, selvom hver binding er det.
4. Byg metan (naturgas), og drej den, så du ser tetraederen.
5. Byg et molekyle med en tripelbinding (N₂, som er 78 % af luften).
6. Byg ethanol (sprit).

### M2 i dag (tjekket mod koden 7. november 2026, Trin 0)
Faktagrundlaget står i [fakta-molekyler/m2.md](fakta-molekyler/m2.md). Sådan passer Byg molekyler ind i det, der findes nu:
- **Ændret 7. november 2026 (jeres svar om fanerne, se "Jeres svar om fanerne og navnet" nedenfor):** Der kommer ingen tredje del-knap. Toplinjen får to faner, "Byg et atom" og "Byg et molekyle", og inde i "Byg et molekyle" vælger man "Del elektroner" (`del = 'byg'`) eller "Giv elektroner" (`del = 'bytte'`). Tabellen med start og stop pr. del i `sætDel` gælder stadig. Den oprindelige tekst: **Den tredje del-knap:** "Byg molekyler" med `data-vaerksted-del="byg"` i `#værkstedDele`, `del = 'byg'` og klassen `byg` på `#vaerksted`. `sætDel` får en lille tabel med start og stop for hver del i stedet for `del === 'bytte' ? … : …`. Det samme skjules som i Byttebørsen (byggepanelet, infopanelet, det lille periodiske system, opgavepillen, "Elektronsky" og udgavevælgeren), så CSS-reglerne laves om til `#vaerksted:is(.bytte, .byg) > …` (id'et skal med, tjekliste D). Byg molekyler får sit eget venstre panel (paletten, opgaverne med ★ og "Forfra") og højre panel (navnet og formlen, en kort tekst om det, der sker, "Hvorfor?"-knapper og foldeboksene "For nørder" og "Ærligt talt" med `name`, så kun én er åben). Gitteret er som `.bytte`, også på tablet på højkant og telefon (3D øverst, panelerne nedenunder, ≤ 820 px). De tre del-knapper står på deres egen linje dér. Det skal måles i M2a, at de kan være på én linje ved 390 px.
- **Elektronerne i 3D (prøve A og B, se billedet [fakta-molekyler/m2-proeve-elektroner.jpg](fakta-molekyler/m2-proeve-elektroner.jpg)):** Ringene i `molekyle3d.js` ligger fladt mod kameraet. I et molekyle i 3D flyder de ind i hinanden, og prikkerne viser ikke, hvor parrene er (prøve B). **Forslag (prøve A):** Kun de yderste elektroner vises. Et delt par er to prikker midt i bindingen med en svag blå sky, et frit par er to prikker på atomets frie side med en svag violet sky, og en elektron uden partner er én prik, der blinker. Prikkerne står i de retninger, formen giver (også på et frit atom: C med fire enlige prikker i en tetraeder, O med to par og to enlige). Bindingen er en tynd pind. Kernerne er små kugler i de farver, kemikere bruger (H hvid, C grå, N blå, O rød, Cl grøn), med symbolet på. Alle prikker i hele molekylet er én InstancedMesh, pindene én og kernerne én (højst 12 atomer, ca. 100 prikker), så det kører på tabletten. En ny klasse eller en ny visning i `molekyle3d.js` genbruger prik-teksturen, glødens farve og `LAV_KVALITET`.
- **At trække og dreje:** Man trækker et grundstof fra paletten ind i 3D-billedet (et tryk på knappen sætter det et ledigt sted ved siden af molekylet). Et atom flyttes i planet parallelt med skærmen gennem atomet, og trækket fanges i `pointerdown` med `capture` før kameraets styring (som elektronen i Byttebørsen, tjekliste D). Mens man trækker, lyser det atom op, som bindingen vil gå til, og en stiplet streg viser bindingen. Slipper man inden for ca. 60 px (finger) eller 40 px (mus) af et atom, der kan tage en binding mere, springer bindingen (det nærmeste vinder). Et træk på et tomt sted drejer molekylet (den almindelige styring), og to fingre zoomer. Trækker man et atom langt væk fra molekylet (eller tilbage til paletten), går dets bindinger i stykker. "Forfra" rydder det hele.
- **Reglerne for byggeriet (forslag):**
  - Hvert atom har et antal "hænder" (bindinger, når det er færdigt): H 1, C 4, N 3, O 2 og Cl 1. Et atom kan få en ny nabo, så længe det har færre naboer end hænder. Spillet gemmer kun, hvem der sidder sammen. Bagefter regner det dobbelt- og tripelbindingerne ud, så så mange elektroner som muligt får en partner (højst tre par mellem to atomer). Det er en lille opgave med højst 12 atomer, der kan løses ved at prøve alle muligheder. Så er rækkefølgen ligegyldig: C + C bliver til C≡C med én elektron tilbage på hver, og sætter man bagefter H'er på, åbner tripelbindingen sig af sig selv (ethen og ethan). Elektronerne glider på plads med `dt`.
  - **Færdigt:** når alle elektroner i molekylet har en partner. Så lyser det op og får sit navn, hvis det er kendt.
  - **Ulovligt:** Et atom, der allerede har alle sine hænder optaget (fx H i H₂, O i vand), skubbes væk, og der står hvorfor ("Hydrogen har kun én elektron, og den er allerede i et par").
  - **Kulilte:** C + O alene bliver C=O med to elektroner tilbage på C. Så låner O et af sine frie par ud, og det bliver C≡O med et frit par på C (fælde 1 i faktagrundlaget). Kun for C + O alene.
  - **Højst 12 atomer** i alt (ethanol har 9, propan 11). Flere molekyler må ligge ved siden af hinanden. Hvert får sit navn, når det er færdigt.
  - **Kendte molekyler** genkendes på, hvilke atomer der sidder sammen (en lille sammenligning af grafer), ikke kun på formlen, for C₂H₆O er både ethanol og dimethylether.
  - **Ukendte, men lovlige:** "Alle elektronerne har fået en partner, så reglerne passer. AtomLab kender ikke dette molekyle. Nogle af den slags findes, andre falder straks fra hinanden." (fælde 6). Formlen står også.
- **Formen:** Bindingerne er fjedre med længder i det rigtige forhold (tegnet × `S` = 2,4 som i Byttebørsen eller større, så prikkerne kan ses). Om hvert atom skubber retningerne hinanden væk (bindinger w = 1, dobbeltbinding 1,1, frit par 1,245), og de frie par er retninger, der også bevæger sig. Frastødningen regnes på retningerne, ikke på pladserne. En svag frastødning mellem atomer med mindst to atomer imellem gør ethan forskudt. H₂O₂ får et lille led, der drejer X–O–O–X til ca. 112° (fælde 3). Alt i en datafil uden Three.js, som testene kan køre i Node.
- **Ladningerne (M2b):** δ-farver kun ved ΔEN ≥ 0,4 (C–H ingen farve, fælde 4). Molekylet er polært, hvis bindingernes træk (ΔEN langs bindingen) ikke ophæver hinanden. CO får ingen farver og en linje i "Ærligt talt".
- **Filerne:** `js/molekyler.js` er 53 KB, så Byg molekyler får sin egen fil **`js/molekyler-byg.js`** (3D, træk, paneler og opgaver) og sine egne data **`js/data/molekyler-byg.js`** (hænderne, elektronegativiteten, bindingerne, genkendelsen, formen, δ, de kendte molekyler med navne og senere kortene). `js/data/molekyler.js` (14 KB) beholder Byttebørsen. Testadgang: `window.atomlabTest.vaerksted.byg`.
- **Opgaverne (M2b):** `OPGAVER_BYG` i `js/data/molekyler-byg.js` med id'erne `byg-h2`, `byg-vand`, `byg-co2`, `byg-metan`, `byg-tripel` og `byg-ethanol`. `fremgang.js` skal ikke ændres (id'erne er bare tekst). Værkstedets opgaveliste, tæller og "Opgaver forfra" får dem med (`js/vaerksted.js`, de linjer der har `OPGAVER_BYTTE`). Værkstedets kort i menuen tæller i `js/main.js` (`[...OPGAVER, ...OPGAVER_BYTTE]` to steder og importen), som hører til sporet Menuen (se spørgsmål 4).
- **Tiden:** Tidsknappen (`lavTidsknap`) nederst til højre i 3D-billedet. Formen, prikkernes blink og elektronerne, der glider, bruger `dt`, så pausen virker. Et træk virker også under pause (som i Byttebørsen).
- **"Næste skridt"** (`lavNæsteSkridtKort`): "Træk et atom fra paletten ind i billedet", "Oxygen har en elektron uden partner. Sæt et H mere på", "Færdigt! Drej molekylet, så du kan se formen".

**Spørgsmål til jer (Trin 0, 7. november 2026), med min anbefaling først:**
1. **Elektronerne i 3D:** prøve A (prikkerne i bindingerne og de frie par, kernerne i kemikernes farver) eller B (ringe mod kameraet som i Byttebørsen)? Anbefaling: A. B bliver uoverskuelig, så snart der er mere end to atomer.
2. **Paletten:** H, C, N, O og Cl (anbefaling), eller også F, S og P? F er let at tage med senere. S og P kan lave flere bindinger end prik-reglen, så reglerne skal laves om først.
3. **Kulilte (CO):** O låner et par ud, når C og O er alene (anbefaling, så man kan bygge kulilte, og "Ærligt talt" forklarer det), eller kan CO ikke bygges (C=O står som "ikke færdig")?
4. **Små valg, hvor jeg foreslår:** alle 17 kendte molekyler med navn allerede i M2a (kortene i M2b), højst 12 atomer, ingen δ på C–H, H₂O₂ drejes med et ekstra led, teksten ved ukendte molekyler fra fælde 6, og at M2b må rette de 3 linjer i `js/main.js` (importen og de to lister, som M1b også rettede), så opgaverne tæller på Værkstedets kort. Sporet Menuen venter på et go til K2, så risikoen for en konflikt er lille.

**Bygget i M2a (8. november 2026), hvor det afviger fra forslaget ovenfor:** Klassen på `#vaerksted` er `del-elektroner`, ikke `byg` (den klasse har byggepanelet). "Del elektroner | Giv elektroner" står øverst i begge venstre paneler (`data-vaerksted-maade`), og fanen "Byg et molekyle" (`data-vaerksted-del="molekyle"`) åbner den måde, man sidst brugte. Et atom, man trækker i, trækker ikke resten af molekylet med (fjedrene til det er slået fra), så bindingen kan strækkes: Er den mere end ca. 140 px (finger) eller 110 px (mus) for lang på skærmen, når man slipper, går den i stykker. Slippes et atom over paletten, forsvinder det. Formen fik et ekstra led for "forskudt" om enkeltbindinger mellem to tetraedre (ethan), og et lille puf, når noget ændrer sig, så den ikke hænger fast i en flad form (metan som et kvadrat).

**Bygget i M2b (8. november 2026), hvor det afviger fra forslaget ovenfor:** Pilene (bindingernes træk) er en kontakt "Pile" i venstre panel: en gul pil ved siden af hver polær binding mod det atom, der trækker hårdest (OpenStax' tegning), og en orange pil gennem hvert færdigt, polært molekyle (summen). Opgaven om CO₂ er klaret, når CO₂ er færdig med "Pile" tændt, og metan, når den er drejet 90° (kameraet). Kendte molekyler har deres eget flag for "polær" (testet mod formen), ukendte regnes ud fra formen. Kortet "Hvor møder du det?" står i højre panel under teksten, og når en foldeboks åbnes, skjules kortet, tallene og "Hvorfor?"-knapperne imens (ellers fik panelet en rullebjælke på tablet på langs). Opgaverne står som ★-knapper i venstre panel og i Værkstedets opgaveliste.

**Jeres svar til M2a (7. november 2026): "Go til M2a, brug dine anbefalinger".** Altså: (1) prøve A (prikkerne i bindingerne og de frie par, kernerne i kemikernes farver), (2) paletten H, C, N, O og Cl, (3) kulilte: O låner et par ud, når C og O er alene, og (4) ja til de små valg (alle 17 navne i M2a, højst 12 atomer, ingen δ på C–H, H₂O₂ drejes, teksten ved ukendte molekyler fra fælde 6, og M2b må rette de 3 linjer i `js/main.js`).

## 4. Se vand blive til (knaldgas)
I "Byg molekyler" står knappen **"Knaldgas"**: en lille boks med 4 H₂ og 2 O₂, der flyver rundt.
1. **Der sker ingenting:** Molekylerne støder ind i hinanden og hopper væk. Bindingerne er for stærke til, at de går i stykker af et stød. (Aktiveringsenergi forklaret med Stjerneovnens "bakke", som man kender.)
2. **"Gnist":** Et glimt i et hjørne bryder de første bindinger. Så starter en kædereaktion (som i Reaktoren, men med atomer i stedet for neutroner). Frie H- og O-atomer og OH flyver rundt og bryder flere bindinger, og der bliver dannet vand.
3. **Energien:** En måler viser, hvad det koster at bryde bindingerne, og hvad man får, når de nye bliver lavet. Forskellen bliver til varme (molekylerne flyver hurtigere, og boksen gløder). Tallene står i faktagrundlaget.
4. **Til sidst:** 4 vandmolekyler og 0 tilbage. Det er en raketmotor i det små (rumfærgen og SLS brænder flydende hydrogen og oxygen).
5. **Ærligt talt:** Atomerne bytter ikke bare partner i ét hop. Reaktionen går gennem en kæde af mellemtrin med frie atomer og OH (radikaler). Spillet viser en forenklet udgave af kæden.

**Fysikken:** En lille 3D-boks med 6-30 molekyler, der støder sammen, ligesom kernerne i Stjerneovnen. En binding går i stykker, hvis stødet er hårdt nok, og en ny bliver lavet, når to atomer med elektroner uden partner mødes. Energien skal være bevaret (test).

## 5. Hvor kom Jordens vand fra?
**Forslag:** Ikke en ny del, men et **"Hvorfor?"-kort** i "Byg molekyler" (når man har bygget vand) med lag til den nysgerrige og et link til Kosmos (Stjerner bliver født: de kolde skyer af gas og støv). Det, man ved, og det, man ikke ved, står i faktagrundlaget. Hovedpunkterne:
- Meget af vandet blev nok dannet som is på små støvkorn i kolde skyer, før Solen fandtes.
- Det kom til Jorden med de sten, Jorden blev bygget af, og med asteroider. Nok kun lidt med kometer.
- Man ved det ikke sikkert, og forskerne er uenige om, hvor meget der kom fra hvor.

Senere kan det også blive et trin i delen Liv.

## 6. Teknik
- **Ny fil `js/molekyler.js`:** Byttebørsen og Byg molekyler (start og stop, panelet, opgaverne). `js/vaerksted.js` får knapperne øverst og skifter mellem delene.
- **Ny fil `js/molekyle3d.js`:** et let atom til molekyler (kerne, yderste skal, elektronpar og frie par) og bindingerne. Det genbruger farver og glød fra `Atom`, men ikke kernens fysik, for den er for tung, når der er 20-30 atomer.
- **Data `js/data/molekyler.js`:** kendte molekyler (navn, formel, hvor man møder det), elektronegativitet, ioniseringsenergi og elektronaffinitet for de grundstoffer, der er med, og bindingsenergier. Alt med kilder i faktagrundlaget.
- **Formen:** VSEPR-agtig model (elektronparrene skubber hinanden) med fjedre for bindingerne. Bindingslængderne er i det rigtige forhold, men tegnet større.
- **Fremgang:** nye opgaver i `fremgang.js` og en ny linje "Molekyler" i menuen (punkt 7).
- **Tests (`tests/molekyler.mjs`):**
  - vinklerne i H₂O, NH₃, CH₄ og CO₂ inden for ca. 1° af de rigtige
  - at et H aldrig får to bindinger, og at C altid ender med fire
  - at Byttebørsens energimåler giver de rigtige tal (koster ved Na → Cl, gevinst ved mødet)
  - at energien er bevaret i knaldgassen, og at der altid ender med 4 H₂O
  - at alle kendte molekyler kan bygges, og at de får det rigtige navn
  - skærmbilleder på pc, tablet og telefon begge veje

## Trin (hvert trin får et go)
| Trin | Hvad | Størrelse |
|---|---|---|
| M0 | ✅ Plan og faktagrundlag med kilder (denne fil og [fakta-molekyler.md](fakta-molekyler.md)) | lavet |
| M1 | ✅ **Færdig 7. november 2026** (prompt i [arkiv/prompt-molekyler-m1.md](arkiv/prompt-molekyler-m1.md)). **M1a:** del-knapperne, Byttebørsen med Na + Cl, måleren, harpunen og "Ærligt talt". **M1b:** krystallen (InstancedMesh, terningemønstret og rutil for CaCl₂), Li + F, Mg + O, Ca + 2 Cl og Na + Na som opgaver med ★, og fremgangen på Værkstedets kort. | lavet |
| M2 | **Byg molekyler** ([prompt](arkiv/prompt-molekyler-m2.md)). **Trin 0:** ✅ faktagrundlaget i [fakta-molekyler/m2.md](fakta-molekyler/m2.md) og "M2 i dag" (7. november 2026, spørgsmålene står under "M2 i dag"). **M2a:** ✅ paletten, bindingerne, formen, det ulovlige og navnene (8. november 2026). **M2b:** ✅ ladningerne, kortene, opgaverne og fremgangen (8. november 2026) | stor (Trin 0 med **xhigh**, M2a og M2b med høj) |
| M3 | **Knaldgas:** boksen, gnisten, kæden og energimåleren ([prompt](prompt-molekyler-m3.md)) | mellem |
| M4 | "Hvorfor?"-kortet om Jordens vand og links til Kosmos og senere Liv | lille |

## 7. Spørgsmål til jer
**Jeres svar om fanerne og navnet (7. november 2026):** Fra 7. november 2026 (drøftelsen af menuen): **Fanerne øverst i Værkstedet bliver "Byg et atom | Byg et molekyle".** Inde i "Byg et molekyle" vælger man mellem to måder: **"Del elektroner"** (Byg molekyler, M2, standard, når den findes) og **"Giv elektroner"** (det, der hed Byttebørsen). Navnet Byttebørsen forsvinder fra programmet (fanen, hjælpens knap "Prøv det i Byttebørsen", overskrifter og tests). Teksten i "Giv elektroner" siger ærligt, at salt ender som en krystal (et gitter) og ikke som separate molekyler. Id'erne i koden (`bytte`, `bytte-` i fremgangen) må blive, så de gemte stjerner ikke går tabt.

**Jeres svar til M2 (7. november 2026):** Trin 0 (faktagrundlaget med xhigh og "M2 i dag") laves i sin egen session. Byggeriet deles i M2a (paletten, bindingerne, formen, det ulovlige og navnene) og M2b (ladningerne, kortene, opgaverne og fremgangen) med hver sit go og sin egen PR. Opgaverne tæller med på Værkstedets kort i menuen, og der kommer intet nyt kort og ingen ny linje. Prompten står i [arkiv/prompt-molekyler-m2.md](arkiv/prompt-molekyler-m2.md).

**Jeres svar (23. oktober 2026):** i Atomværkstedet med knapper øverst, atomerne trækkes med fingeren eller musen, elektronerne vises som prikker på ringe, og Byttebørsen bygges først. Navnene "Byttebørsen" og "Byg molekyler" bruges, indtil I siger andet. Næste skridt er M1 (Byttebørsen), når I giver et go.

1. **Hvor:** i Atomværkstedet med knapper øverst (forslag), eller som en egen del i menuen (fx "Kemilab")?
2. **Hvordan man bygger:** trække atomer med fingeren eller musen (forslag), eller trykke på knapper ("Tilføj H"), som når man bygger et atom i dag?
3. **Elektronerne:** som prikker på ringe (forslag, det er enkelt og passer med Byttebørsen), eller som skyer (passer med udgave A eller B af atomet, men er sværere at forstå i et molekyle)?
4. **Navne:** "Byttebørsen" og "Byg molekyler"? Eller noget andet?
5. **Rækkefølge:** Byttebørsen først (forslag, for den bygger videre på ionerne, man kender), eller molekylerne først (vand er måske sjovere)?
