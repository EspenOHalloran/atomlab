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
| M2 | **Byg molekyler:** paletten, bindingerne, formen, ladningerne, de kendte molekyler og opgaverne | stor (faktagrundlaget med **xhigh**, byggeriet med høj) |
| M3 | **Knaldgas:** boksen, gnisten, kæden og energimåleren | mellem |
| M4 | "Hvorfor?"-kortet om Jordens vand og links til Kosmos og senere Liv | lille |

## 7. Spørgsmål til jer
**Jeres svar (23. oktober 2026):** i Atomværkstedet med knapper øverst, atomerne trækkes med fingeren eller musen, elektronerne vises som prikker på ringe, og Byttebørsen bygges først. Navnene "Byttebørsen" og "Byg molekyler" bruges, indtil I siger andet. Næste skridt er M1 (Byttebørsen), når I giver et go.

1. **Hvor:** i Atomværkstedet med knapper øverst (forslag), eller som en egen del i menuen (fx "Kemilab")?
2. **Hvordan man bygger:** trække atomer med fingeren eller musen (forslag), eller trykke på knapper ("Tilføj H"), som når man bygger et atom i dag?
3. **Elektronerne:** som prikker på ringe (forslag, det er enkelt og passer med Byttebørsen), eller som skyer (passer med udgave A eller B af atomet, men er sværere at forstå i et molekyle)?
4. **Navne:** "Byttebørsen" og "Byg molekyler"? Eller noget andet?
5. **Rækkefølge:** Byttebørsen først (forslag, for den bygger videre på ionerne, man kender), eller molekylerne først (vand er måske sjovere)?
