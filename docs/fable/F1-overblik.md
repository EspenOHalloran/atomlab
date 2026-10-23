# F1: Overblik over AtomLab

*Skrevet 23. oktober 2026 ud fra [briefen](brief.md), jeres 14 tabletbilleder, de 53 testbilleder, jeres noter og koden. To ting har jeg selv afprøvet i programmet (se "Andet, jeg så").*

> **Jeres princip (23. oktober):** Brugeroplevelsen skal være i top. Man skal ikke bombarderes med information, men den skal være let at nå for den nysgerrige. AtomLab skal have stor dybde og tyngde, men føles let, og man bestemmer selv, hvor dybt man vil bore.
>
> Alle forslag nedenfor er vurderet ud fra det.

## 1. Det vigtigste først
- AtomLab er fagligt stærkt, teknisk solidt og flot i Kosmos. Det, der mangler, før det føles som et gennemført spil, sidder ikke i koden, men **på skærmen**: Der er for mange tekster på én gang, og tit står den samme tekst to eller tre steder.
- Den største gevinst er jeres eget princip: dybde i lag, som man selv åbner. Meget af dybden findes allerede, men den ligger de forkerte steder, fx i den lange hjælp.
- Grafisk er Batteriet og atomet de svageste steder. Det sorte hul har en fejl, der koster meget "wow" og er let at rette.
- Lav poleringen (punkt 1-7) før de nye store dele. Ellers arver de nye dele de samme problemer.

## 2. Det, der er godt, og som ikke skal røres
- **Den ærlige faglighed:** "Ærligt talt", faktatjek og 21 tests. Det er sjældent og meget værd.
- **Kosmos på tabletten:** Jorden, supernovaen, kvasaren og gummidugen ser ud som i et godt spil og kører flydende.
- **Ordforklaringerne:** Et tryk på et ord giver en kort forklaring. Det er jeres princip i lille format og bør være modellen for resten.
- **Spilmekanikken:** rejsen ind i Solen, "Vis mig", pause, "Næste" og opgaver med stjerner. Og **3D-væggen** i Det periodiske system.
- **Teknikken** holder ikke noget tilbage: fælles byggeklodser, testadgangen og ingen fejl i konsollen.

## 3. De 10 forbedringer, der løfter mest

### 1. Ro på skærmen: hver oplysning ét sted, og dybde i lag
*UI · mellem · en kort plan først, så byg · nyt*
- **Hvorfor:** Jeres søn sagde det selv. På tabletbilledet fra Stjerneovnen er der ca. ni tekstfelter på én gang. Når to kerner smelter sammen, står forklaringen både i underteksten og i boksen til højre. I Reaktoren siger guidens boble og højre panel næsten ordret det samme, mens "Næste skridt" også er fremme. Når alt taler på én gang, læser man ingenting.
- **Forslag:** Tre lag på alle skærme:
  - **Lag 1, altid fremme:** 3D, én kort linje om det, der sker nu, og "Næste skridt".
  - **Lag 2, et tryk:** "Hvorfor?" folder forklaringen ud på stedet.
  - **Lag 3, et tryk mere:** "For nørder" med tal, formler og "Ærligt talt".

  Regler: En tekst står kun ét sted ad gangen. Underteksten siger, hvad der skete, og panelet forklarer det. Mens guiden er fremme, er "Næste skridt" skjult. Boksene til højre er foldet sammen, undtagen den nyeste.
- **Belæg:** `js/fusion.js:1059` og `:1062` skriver samme tekst i panelet og underteksten. `js/reaktor.js:541` og `:631`. Tabletbillede 02 og 03, testbillede 41.

### 2. Skjul panelerne og "Kun grafik"
*UI · mellem · byg direkte (planen findes) · kendt (jeres idé)*
- **Hvorfor:** Det er jeres søns første ønske. På tabletten på langs fylder panelerne knap halvdelen af bredden, og ting i 3D gemmer sig bag dem, fx "21. december" i Årstiderne (tabletbillede 05).
- **Forslag:** Byg det som planen i DESIGN.md, som I har sagt ja til. Når panelerne er skjult, bliver lag 1 (underteksten og "Næste ›") tilbage, så man stadig kan følge med.

### 3. "Hvorfor?" der, hvor spørgsmålet opstår
*Indhold og UI · mellem · byg direkte efter punkt 1 · nyt*
- **Hvorfor:** Jeres søn spurgte, hvorfor radioaktivitet er farligt. Svaret findes (`index.html:661`), og Kerne-fanen har et link "Er det farligt?" (`js/vaerksted.js:932`). Men linket åbner den lange hjælp, og det findes ikke i Reaktoren. Enten fandt han det ikke, eller svaret var ikke dybt nok (spørgsmål 3). Magnetisme bliver ikke forklaret nogen steder, selvom magnetfelter er med i Solstorm, Pulsar og Kvasar, og ordbogen har ikke "magnetfelt".
- **Forslag:** "Hvorfor?"-kort, der åbner på stedet ligesom ordforklaringerne. Hvert kort svarer på ét spørgsmål i 3-5 sætninger og slutter med "Og hvorfor det?", som åbner næste lag. Start med 10-15 kort, fx "Er det farligt?" lige efter et henfald og i Reaktoren, "Hvorfor er Jorden en magnet?" i Solstorm og "Hvorfor holder kernen sammen?". Alle tekster skal gennem `/faktatjek`.

### 4. Et grafisk løft af atomet
*Grafik · mellem til stor · lav først en lille prøve · nyt (jeres ønske)*
- **Hvorfor:** Atomet er det første, man ser, både i menuen og i værkstedet. Kernen er pæn, men ligner glatte plastkugler. Elektronskyen er en tynd kugle af blå prikker, hvor man ikke kan se skallerne (mit eget billede af neon-20 med "Elektronsky").
- **Forslag:** Vigtigst er **rigtige orbitaler i elektronskyen**: kugler for s og "dobbeltdråber" for p, hver med sin farve. Elektronkonfigurationen findes allerede (`konfiguration` i `grundstoffer.js`), så det bliver både flottere og mere rigtigt. "Ærligt talt": Formerne er regnet som for hydrogen og er en tilnærmelse for større atomer. Derudover en glidende overgang fra ringe til sky, et større og mere levende atom i menuen og en kerne med lidt skygge, hvor kuglerne rører hinanden. Vis 2-3 udgaver på tabletten, før det bygges færdigt.
- **Belæg:** `js/atom.js:85-98` (materialerne) og `:268-300` (skyen), tabletbillede 01, testbillede 02.

### 5. Batteriet: grafik, start og navn
*Grafik og UI · stor (kan deles op) · en kort plan først · delvist kendt (B3)*
- **Hvorfor:** Det er det svageste sted grafisk, og I peger selv på det. 3D-billedet er kasser set lige forfra, grafitten er flade grå plader, og man kan næsten ikke dreje billedet. Det ligner en tegning i en bog, ikke et spil. Batteriet starter også i "Pause" uden guide eller "Næste skridt".
- **Forslag:**
  - Kameraet lidt fra siden og oppefra, så man ser dybde. Grafitten som sekskantede lag af carbonatomer og metaloxidet som lag i en krystal, hvor lithium-ionerne glider ind mellem lagene.
  - En kort rejse fra en mobil ind i batteriet, som rejsen ind i Solen. Og "Næste skridt", "Vis mig" og en kort guide.
  - **Navnet:** "Lithium-ion-batteri" i titlen og menuen, og "LiPo" som den slags, der er vist. Svaret i jeres noter holder i hovedtræk: LiPo er en slags Li-ion, og grafit og metaloxid er det samme. Men "kun indpakningen" er lidt for skarpt, for LiPo har tit en elektrolyt af gel (polymer). Det har jeg ikke tjekket i kilder, så det skal gennem `/faktatjek`, før teksten rettes.
- **Belæg:** `js/batteri.js:109-156` (kasserne) og `:324` (låst drejning), tabletbillede 04, testbillede 06.

### 6. Mere om grundstofferne, i lag
*Indhold · stor (kan laves i portioner) · byg direkte med `/faktatjek` · nyt (jeres ønske)*
- **Hvorfor:** Jeres søn vil vide, hvor grundstofferne findes, og hvad de bruges til. I dag står der én kort linje om hver, fx lithium: "Genopladelige batterier og medicin".
- **Forslag:** Kortet får lag. Øverst står tre små linjer med ikoner: "I din hverdag", "I din krop" og "I universet". Et tryk på "Mere" giver 3-5 konkrete eksempler, et "Vidste du?" og links til resten af AtomLab, fx "Se det i Batteriet" og "Lavet i en kilonova". Start med de ca. 40 grundstoffer, en 13-årig møder (de første 30 og fx sølv, guld, bly og uran).
- **Belæg:** `js/data/fakta.js:9-12`.

### 7. Fremgang og sammenhæng
*UI · lille og mellem · byg direkte · kendt (B1 og B2)*
- **Hvorfor:** Et godt spil viser, hvor langt man er, og hvad man kan gøre bagefter. Menuen viser kun "Opgaver klaret: 15 af 35" (tabletbillede 14), og delene linker ikke til hinanden.
- **Forslag:** "3/7 ★" på hvert kort i menuen, "Se også" mellem delene og et forslag til næste eventyr, når en del er klaret.

### 8. Gør det sorte hul sort
*Grafik · lille · byg direkte · nyt*
- **Hvorfor:** Det sorte hul er et af de flotteste fænomener, men midten ligner en lysende kugle og ikke et hul. Det ses både på tabletten (billede 13) og i testbrowseren (billede 31).
- **Forslag:** Den sandsynlige årsag er gløden (effekten, der giver lyse ting en glorie, `js/scene3d.js:89`). Den breder lyset fra gassen og lysbuen ind over den lille sorte kugle (`js/kosmos/sorthul.js:39` og `:69-74`). Gør skyggen ca. 2,5 gange så stor som horisonten, som nørdteksten selv siger (`:34`), og hold gløden ude af den. Årsagen er ikke afprøvet.

### 9. "For nørder" ligger nederst i Kosmos på højkant
*UI · lille · byg direkte · nyt*
- **Hvorfor:** På tablet og telefon på højkant står "Kort fortalt / For nørder" under citatet, helt nederst i panelet (tabletbillede 13). Så bliver det dybeste lag svært at finde, stik imod jeres princip.
- **Forslag:** `style.css:1081` (`.del-vælger { order: 3 }`) er ment for Reaktorens knapper i toplinjen, men rammer også Kosmos (`index.html:606`). Den skal kun gælde i Reaktoren. Det er samme rodårsag som en tidligere fejl: en klasse, der bruges på flere skærme (se `docs/erfaringer.md`).

### 10. Én fælles byggeklods til lagene og "Næste skridt"
*Teknik · mellem · byg direkte som del af planen i punkt 1 · kendt (D9), med et nyt formål*
- **Hvorfor:** Punkt 1, 3 og 5 laver det samme mange steder: bokse, der folder ud, "Hvorfor?", "For nørder", "Næste skridt" og "Vis mig". "Næste skridt" findes allerede i flere kopier. Laves det på seks skærme hver for sig, bliver det seks lidt forskellige udgaver.
- **Forslag:** Lav byggeklodsen først, og brug den i alle dele og senere i de nye dele.

## 4. Idélisten
| Idé | Værdi for jeres søn | Sværhed | Kort sagt |
|---|---|---|---|
| Vis eller skjul panelerne | Høj | Mellem | Punkt 2. Planen findes. Byg snart. |
| "Test dig selv" | Mellem | Mellem | Gør det til "gæt først, og prøv så" inde i forsøgene ("Hvad sker der, hvis du fjerner vandet?") i stedet for en prøve til sidst. Kort plan først. |
| Tidslinje | Mellem | Lille | En skyder på væggen i Det periodiske system, så grundstofferne lyser op i den rækkefølge, de blev opdaget. Årstallene findes. Byg direkte. |
| Chat | Høj, men risikabel | Stor | GitHub Pages kan ikke holde en nøgle hemmelig, så det kræver en server og betaling. Svarene kan være forkerte. Ikke nu. "Hvorfor?"-kortene dækker meget. |
| Molekyler | Høj (næste skridt efter atomer, og tæt på fysik/kemi i skolen) | Stor | Den bedste nye del efter poleringen. Kræver plan og faktagrundlag. |
| Tjernobyl | Høj (spændende for en 13-årig) | Stor og følsom | Enig i at vente, som I har besluttet. Faktagrundlaget først. |
| Solsystemet | Høj (meget "wow") | Stor | Planen findes, og Jorden og Månen er i topkvalitet. Efter poleringen. |
| Liv | Mellem | Meget stor, og videnskaben er usikker | Til sidst, og byg videre på Molekyler. |

**Tre nye idéer:**
- **Zoom ind fra hverdagen:** Start en del med en kort rejse fra noget kendt: blyanten → grafit → carbonatomet, eller kraftværket → reaktorkernen. Den bygger på rejsen ind i Solen og svarer på "hvor findes det?". Mellem pr. del.
- **Grundstofsamlingen:** Når man opdager et grundstof, vender et samlekort med "I din hverdag" (punkt 6), og man kan bladre i sine kort. Mellem.
- **Grundstoffernes rejse:** en historie på tværs af delene: hydrogen i Big Bang → helium i Stjerneovnen → jern i en supernova → guld i en kilonova → lithium i din mobil. Den binder delene sammen som en kampagne i et spil. Stor og kræver en plan.

## 5. Hvor det betaler sig at gå i dybden (F2)
Et bredt eftersyn af alle fire områder betaler sig ikke nu. Det meste, der skal laves, er tydeligt og kan planlægges og bygges uden en dyrere model.
- **UI:** Her betaler en plan sig. Lav én kort plan for lagene og byggeklodsen (punkt 1, 3 og 10) på alle seks skærme, med skitser, før der bygges.
- **Grafik:** Prøver på tabletten (atomet og Batteriet) giver mere end et eftersyn, for kun I kan se, om det føles flot.
- **Indhold:** Faktagrundlag til "Hvorfor?"-kortene og grundstofferne. `/faktatjek` rækker til korte tekster.
- **Teknik:** Det betaler sig ikke. Testene er grønne, det kører flydende på tabletten, og de kendte punkter (D8, D11 og D12) betyder lidt for jeres søn nu.

Om stopreglen i planen: Punkt 1, 3, 4, 6, 8 og 9 stod ikke i eftersynet fra oktober. Punkt 4 og 6 er jeres søns egne ønsker, så helt nye fund er punkt 1, 3, 8 og 9.

## 6. Spørgsmål til jer
1. Skal den korte UI-plan (punkt 1 og 10) laves først, så panelerne (punkt 2) bygges sammen med den? Mit råd er ja, for de ændrer de samme paneler.
2. Bruger jeres søn mest tabletten på langs eller på højkant?
3. Så han linket "Er det farligt?" i Kerne-fanen? Og var svaret i hjælpen nok, eller ville han vide mere?
4. Har han lyden tændt, og skal der være baggrundsmusik? Lyden kan jeg ikke bedømme ud fra billeder.
5. Skal grundstofkortet have fotos af de rene stoffer (med kilder og licenser), eller er tegninger nok?
6. Vil I vælge mellem 2-3 udgaver af atomet på tabletten, før det bygges færdigt?

## Andet, jeg så (til den, der bygger)
- **Kædereaktionen efter "Vis mig":** Jeg kørte den 100 gange. 6 gik i stå inden for 15 sekunder og 11 inden for 2 minutter (testbillede 45 er en af dem). Testen `reaktor` tillader højst 6, så den er på grænsen og kan begynde at fejle. `docs/erfaringer.md` siger "ca. 1 %".
- **`docs/fable/tablet/LISTE.md` passer ikke med filerne:** 08 er Pulsar, 09 Kilonova, 10 Rumtid, 11 Tyngdebølger, 12 Ormehul og 14 menuen i Chrome. Billedet af teksten i Formørkelser mangler.
- **Ikke tjekket:** lyden, hvordan det føles med fingre, telefonen (kun testbilleder) og årsagen i punkt 8 (kun set i koden og på billeder).
