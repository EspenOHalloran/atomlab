# Gennemgang af AtomLab (oktober 2026)

Status (oktober 2026): **Punkt 1 og 2 i afsnit E er lavet** (trin 11 i DESIGN.md): faktafejlene i A1, henfaldsreglerne i A2, de vigtigste fra A3 og kodefejlene D1-D7 og D10. Se "Status for rettelserne" nederst. Afsnit B, D8, D9, D11 og D12 venter.

Mærket ✓ ved et fund betyder, at fundet er tjekket efter i koden eller mod kilder (ikke at det er rettet).

## Sådan er der kigget efter
- **Faktatjek:** Alle tekster og tal er gennemgået i fire dele (Kosmos, grundstofferne, kerner og værkstedet, Stjerneovn/Reaktor/Batteri/citater). Det er ca. 850 tal og påstande. De vigtigste fund er tjekket efter i koden eller mod kilder. De er mærket ✓.
- **Helheden og sektionerne:** skærmbilleder af alle skærme på pc, tablet og telefon (begge veje) og en gennemgang af forløbet.
- **Kode og ydelse:** en gennemgang af hele koden (afsnit D).

Det meste er i fin form. Alle 118 elektronkonfigurationer stemmer med NIST, alle 251 stabile kerner er rigtige, og tallene i Stjerneovnen, "Solen i tal" og sammenligningerne holder. Men der er nogle ægte fejl, især i henfaldsreglerne.

---

## Det vigtigste først
1. **Henfaldsreglerne vælger nogle gange den forkerte vej** ✓ (afsnit A2). Kerner med for få neutroner får betahenfald den forkerte vej (fx cobalt-58 og mangan-54). Tunge kerner med for mange neutroner får alfahenfald i stedet for beta (fx thorium-231, som kommer lige efter uran-235). Det ser man, hver gang man bygger sådan en kerne og trykker "Henfald".
2. **Reaktoren: uran-238 bliver til "uran-235"** ✓. Skyder man en hurtig neutron mod uran-238, ender 1 ud af 10 skud i spaltningen af uran-235. Så står der "Uran-235 + neutron → uran-236", og opgaven "Spalt en uran-235-kerne" bliver klaret (`reaktor.js:646`).
3. **Ca. 15 forkerte påstande** (afsnit A). Fx står der, at Tjernobyl skyldtes svigt i kølingen, og at zirkonia er kunstige diamanter. Supernovaens lag står i forkert rækkefølge, og et Sagan-citat har forkert ordlyd.
4. **Fejl ved skift mellem delene** ✓ (afsnit D). Har man trukket i væggen i Det periodiske system, står atomet forskudt i menuen og værkstedet bagefter. Timere fra én del kan nå at påvirke den næste.
5. **AtomLab hænger ikke helt sammen som én helhed** (afsnit B). Delene er øer: Menuen viser ikke, hvor langt man er i hver del, der er ingen links mellem delene, og kun to af delene har "Næste skridt" og "Vis mig".

---

## A. Faktatjek

### A1. Fejl, der bør rettes
| Hvor | Problem | Forslag |
|---|---|---|
| `reaktor.js:646` ✓ | Uran-238 + hurtig neutron falder i 10 % af tilfældene igennem til spaltningen af uran-235 (forkerte tekster, og en opgave klares). | Uran-238 + hurtig neutron preller altid af (eller fanges). |
| `index.html:445` (Reaktor-hjælp) | "hvis kølingen svigter … Det skete i Tjernobyl i 1986 og Fukushima i 2011". Tjernobyl var ikke kølesvigt. Reaktoren løb løbsk under et forsøg, og en dampeksplosion sprængte den. | Del det op: Tjernobyl løb løbsk, og i Fukushima svigtede kølingen efter en tsunami. |
| `supernova.js:13-14, 36` ✓ | Lagene står som carbon, **oxygen, neon**, silicium. Stjernen brænder carbon, så neon, så oxygen, så silicium. Udefra og ind er lagene derfor H, He, C, **Ne, O**, Si, Fe. | Byt neon og oxygen i lagene og i teksten. |
| `supernova.js:32, 210` | "lyser stærkere end en hel galakse" og "milliarder af sole". En supernova som Betelgeuses lyser som ca. 0,2-1 milliard sole. Mælkevejen er 40-100 gange stærkere. | "lyser som flere hundrede millioner sole" / "op mod en milliard sole". |
| `kvasar.js:28` | Mælkevejens sorte hul "lyser ikke". Det er en kendt radiokilde og har udbrud (Sgr A*). | "…så det lyser kun meget svagt." |
| `citater.js:100` (saganKosmos) | Ordlyden. Udskriften af *Cosmos* afsnit 1 har efter alt at dømme "The cosmos is also within us … a way for the **cosmos** to know itself". Versionen med "universe" er en omskrivning, der går igen mange steder. | Brug "cosmos"-ordlyden. Kunne ikke hente selve udskriften herfra, så det er ikke 100 % sikkert. |
| `citater.js:42` (Einstein) ✓ | LIFE 1955 har "existence", ikke "existing" (Quote Investigator). Den danske "Det vigtige er ikke at holde op med at stille spørgsmål" kan læses forkert. | "…reason for existence" og "Det vigtige er, at man aldrig holder op med at stille spørgsmål." |
| `citater.js:77` (Faraday) | "Faraday fandt på ordene ion, elektrode, anode, katode og elektrolyt". Anode, katode og ion blev foreslået af William Whewell. | "Faraday indførte ordene … (nogle af dem fandt han på sammen med William Whewell)." |
| `fakta.js:48` (zirconium) | "kunstige diamanter (zirkonia)". Zirkonia er en efterligning, ikke diamant. | "smykkesten, der ligner diamanter (zirkonia)". |
| `fakta.js` (He og flere) | "af" sættes foran teksten, så kortet viser "1868 af Fundet i Solens lys…" og "af Danskeren H.C. Ørsted", "af Brødrene…", "af Forskere i…". | Ret teksterne (lille begyndelsesbogstav, og He: "Jules Janssen og Norman Lockyer (i Solens lys)"). |
| `vaerksted.js:108, 129`, `atom.js:392` | Dobbelt beta-plus "skød to positroner ud". Kr-78, Xe-124 og Ba-130 henfalder ved dobbelt elektronindfangning. To positroner er aldrig set. | "Kernen fangede to af atomets egne elektroner (dobbelt elektronindfangning)." |
| `isotoper.js:29, 31, 92` | V-50 laver elektronindfangning, ikke beta. La-138 laver 66 % elektronindfangning og 34 % beta. At-210 laver næsten kun elektronindfangning, ikke alfa. | Ret i `KENDTE`. |
| `isotoper.js:123-129` | Lette kerner uden for grænsen for, hvad der kan hænge sammen (fx Be-6, B-7, Li-10, H-8 og op), vises som radioaktive med betahenfald. I virkeligheden falder de fra hinanden med det samme. | Udvid `STRAKS_VÆK` med grænserne for de lette kerner. |
| `grundstoffer.js:46` ✓ | Zirconiums atommasse er rettet af IUPAC i 2024 fra 91,224 til 91,222. | 91.222 |
| `grundstoffer.js:168` (He) | "Dannes af hydrogen inde i stjerner". Det meste helium blev dannet lige efter Big Bang. Helium på Jorden kommer fra radioaktivt henfald. | "Det meste helium blev dannet lige efter Big Bang, og stjerner laver mere af hydrogen." |

### A2. Henfaldsreglerne ✓
Tjekket ved at køre funktionerne (`henfaldsmåde`):
- **For få neutroner, men "beta-" vælges:** Nb-92, Mn-54, Co-58, I-124, Eu-152 og ca. 25 andre. Reglen prøver `beta-` før `beta+`, når begge naboer er stabile (`isotoper.js:244`). Forslag: Ved for få neutroner prøves `beta+` først.
- **Tunge kerner med for mange neutroner får "alfa":** Th-231, Ra-228, Ac-228, Pa-233, Pu-241, U-237, Np-238 og Am-242 laver i virkeligheden betahenfald. Omvendt får Po-216 og Bi-211 beta, selvom de laver alfa. Det gør thorium-kæden forkert fra første skridt. Uran-238-kæden er stadig rigtig (8 alfa og 6 beta). Forslag: Læg dem ind i `KENDTE`.
- Efter rettelsen skal det tjekkes igen, at alle kerner ender i en stabil kerne uden løkker, og at uran-238 stadig ender som bly-206.

### A3. Upræcist (bør rettes, mest vigtige først)
**Reaktoren og fission**
- `index.html:421`, `reaktor.js:517`: "Giver hver spaltning i gennemsnit præcis én ny, er reaktoren stabil" står lige efter "2-3 nye neutroner" og læses som én ny neutron. Skriv "én ny spaltning".
- `reaktor.js:718`: "ca. 200 MeV". Selve spaltningen giver ca. 175-185 MeV. Resten kommer, når stumperne henfalder bagefter.
- `reaktor.js:50`: Nødstop: Nævn, at brændslet bliver ved med at lave varme bagefter og skal køles (det var problemet i Fukushima).
- `reaktor.js:664`: "Uran-238 spalter ikke" → "ikke med langsomme neutroner".
- `index.html:430`: Det blå lys kan kun ses i reaktorer, hvor man kan se ned i vandet (fx forskningsreaktorer).
- `reaktor.js:26`: "ca. 7 gange" → "ca. 7-8 gange" (200 / 26,7 = 7,5).

**Stjerneovnen**
- `index.html:293`: "p + p → D … 1,44 MeV". Selve reaktionen giver 0,42 MeV. Resten kommer, når positronen møder en elektron. Det bør stå i teksten.
- Tre-alfa: Opskriften siger 7,27 MeV, men spillet viser og tæller 7,37 MeV, fordi minus 0,09 MeV for beryllium-8 bliver smidt væk. Tæl med fortegn.
- "mindst 80 mio. °C" er spillets grænse. I stjerner sker det ved ca. 100 mio. °C (sådan står det også i hjælpen).
- Grafen viser bevægelsesenergi. Aksen bør hedde "Energi (fart) →".
- `index.html:310, 328`: "Brint nok til ca. 5 mia. år mere" handler om brinten i kernen.
- `index.html:325`: "Solens opskrift" er den vigtigste af flere veje (ca. 83 %). De to første skridt sker to gange.
- `index.html:327`: Lysets vej ud gennem Solen tager titusinder til over 100.000 år ("mange tusinde år" er for lidt).

**Batteriet**
- `index.html:522`: LiPo har ikke "samme kemi som elbiler". Elbiler bruger oftest andre metaloxider end kobolt, og de fleste telefoner har selv LiPo.
- `index.html:528`: Spændingen stiger mest, fordi batteriet bliver fyldt (3,0 → 4,2 V), ikke kun på grund af den indre modstand.
- `batteri.js:44`, `index.html:529`: Ikke alle LiPo-batterier har beskyttelseskredsløb (droner har det ikke).
- `index.html:531`: "milliarder af milliarder lithium-ioner" er ca. 10.000 gange for lidt (ca. 2·10²² ved én opladning).
- `batteri.js:398`: "holde på strømmen" → "holde på energien".

**Kosmos**
- `sorthul.js:28, 127`: Astronauten bliver kun til spaghetti ved et lille sort hul, ikke ved Mælkevejens store hul, som teksten nævner. Skriv det i "Ærligt talt".
- `supernova.js:37, 181`: Jernkernen holdes oppe af elektronernes tryk, indtil den vejer ca. 1,4 sole. "Intet holder den oppe" er for skarpt.
- `supernova.js:97`: Animationen blæser jernkernen ud. Det jern, der spredes, laves i eksplosionen, og kernen bliver til neutronstjernen.
- `index.html:582`: Carbon kommer også fra mindre stjerner, og jern også fra hvide dværge, der eksploderer.
- `pulsar.js:22, 23, 32`: Massen er 1,2-2,3 sole. En teskefuld vejer ca. 2 mia. ton. Tyngden er "hundredtusinder af gange" stærkere, ikke "tusindvis".
- `kilonova.js:20, 26, 235`: "Første gang set tydeligt" (en kilonova blev set i 2013). "Millioner eller milliarder af år". "Meget af guldet".
- `kvasar.js:20, 21, 23, 27, 30`: "Første kvasar, man forstod". Afstanden er ca. 2 mia. lysår. Hullerne vejer millioner til milliarder af sole. Kun nogle kvasarer har stråler.
- `rumtid.js:15, 21, 24, 25`: "Bekræftet" 1919 (målingerne var usikre). Baner kan være aflange. GPS: +45 og −7 µs, i alt 38.
- `tyngdebolger.js:24`: "Første direkte måling".
- `ormehul.js:28, 31, 38, 42`: Flamm så "broen" i 1916. Der kræves "negativ energi i store mængder". Undgå "der findes ikke noget udenfor".
- `solstorm.js:23, 28, 233, 324`: "typisk 1 til 3 døgn" (de hurtigste tager ca. 17 timer). Nordlys ses i en ring om polerne. Det røde lys er 200-400 km oppe.
- `sorthul.js:33`: Billedet blev vist i 2019 (målingerne er fra 2017).
- `supernova.js:35`: "De fleste stjerner over ca. 8 sole".

**Kerner og værkstedet**
- `vaerksted.js:323`: "I virkeligheden tager det X (halveringstid)" lyder som den tid, ét henfald tager. Skriv, hvad halveringstid betyder.
- `isotoper.js:331`: "Meget ustabil – den henfalder på et øjeblik" passer ikke på fx Gd-150 (1,8 mio. år), Pb-212 og I-123 (timer).
- `isotoper.js:257`, `vaerksted.js:105, 117`: Beta-plus forklares altid som en positron. Mange kerner fanger i stedet en elektron (elektronindfangning).
- `vaerksted.js:29`, `isotoper.js:285`, `index.html:632`: To protoner kan ikke holde sammen, først og fremmest fordi kernekraften mellem kun to er for svag, ikke kun på grund af frastødningen.
- `vaerksted.js:768`: "Nøgne kerner findes inde i Solen" passer på lette grundstoffer, ikke på jern og uran.
- `vaerksted.js:822`: Atomet er ca. 20.000-100.000 gange større end kernen ("ca. 100.000" passer kun på hydrogen).
- `kerne.js`: Dråbemodellen giver for høje tal nær jern (fx Fe-58 og Zn-68 ser ud til at slå nikkel-62). Brug målte værdier for de stabile kerner fra calcium til krypton.
- `isotoper.js:273`: Den frie neutron: Halveringstiden er ca. 10 minutter, og levetiden i gennemsnit ca. 15.
- `isotoper.js:83`: Pa-234 i uran-kæden er den kortlivede udgave (1,2 minutter).
- `index.html:635`, `vaerksted.js:920`: Fra nr. 83 (bismuth) er ingen kerner helt stabile.
- `vaerksted.js:16, 265`, `index.html:629`: Et frit atom kan højst holde på én ekstra elektron. O²⁻ findes kun i krystaller.
- Småting: "Så vidt man ved, holder kernen for evigt", "Ved alfa- og betahenfald bliver kernen til et andet grundstof", antineutrinoen tager en del af energien, Pt-190 ca. 500 mia. år, K-40 og Lu-176 afrundes lidt forkert.

**Grundstofferne**
- Francium og astat: tilstand "ukendt" (ingen har set dem i synlig mængde).
- Rf-Hs får teksten "hårdt, skinnende" (ingen har set dem). Promethium får "bruges i magneter" fra kategorien. Actiniderne får "radioaktive" to gange.
- Bismuth var kendt længe før 1753. Bismuth mangler navnets oprindelse.
- Iridium: "asteroiden", ikke "meteoren". Wolfram: Forklar det tyske navn, ikke kun "tungsten". K og Zn: Navneforklaringerne går i ring.
- Ædelgasser: "8 elektroner i den yderste skal (helium har 2)" i stedet for "fyldt".
- Fl: "Dubna og Livermore". Pu: "næsten alt plutonium er lavet af mennesker". Og: halveringstiden er under 1 ms. "Ukendt"-kategorien: sekunder til minutter, nogle under 1 ms.
- Tin og blikdåser, titan (ca. 40 % lettere end stål), "ad gangen" ved At og Fr.

**Citater**
- Rutherford-kommentaren: Forsøget i 1909 var Geiger og Marsdens.
- Einsteins terninger: "alle forsøg tyder på", ikke "vi ved".
- Bohr og Curie: Feltet `original` er en engelsk oversættelse, ikke originalsproget.
- Sagans "stjernestof" står efter "røde kæmper" i hjælpen, og "kulstoffet" bør være "carbon".

### A4. Tvivl (kunne ikke afgøres sikkert)
- Hs: den mest stabile isotop (270 eller 271).
- GPS-fejlen "ca. 10 km pr. døgn": det almindelige tal, men omdiskuteret. Fint med "omkring".
- Betelgeuse: 550 lysår (skøn fra 500 til 720).
- Kilonova: "guld flere gange Jordens vægt" afhænger af modellen.
- Lr-266 og andre supertunge: spontan fission i stedet for alfa?
- Batteriets spændingskurve ligger 0,1-0,15 V under en typisk hvilespænding. Acceptabelt.

---

## B. Helheden

**Det, der virker godt**
- Ensartet udseende og samme opbygning på alle skærme (panel, 3D, panel), samme knapper øverst og samme hjælp.
- Beskedsystemet, pausen, "Næste skridt" og "Vis mig" virker godt der, hvor de findes.
- Det virker på telefon og tablet, og der er ingen konsolfejl på nogen skærm.

**Forslag**
1. **Fremgang i menuen pr. del.** I dag står der kun "Opgaver klaret: 0 af 35". Et lille mærke på hvert kort, fx "3/7 ★", viser, hvor man mangler noget, og giver lyst til at gøre en del færdig. *Lille.*
2. **Links mellem delene ("Se også").** Delene er øer i dag. Eksempler:
   - Grundstofkortet for uran: "Spalt det i Reaktoren".
   - Hydrogen og helium: "Smelt dem sammen i Stjerneovnen".
   - Guld og platin: "Se, hvor de blev lavet (Kosmos: Kilonova)".
   - Lithium og cobalt: "Se dem i Batteriet".
   - Jern: "Supernova".
   - Fra Stjerneovnen og Reaktoren tilbage til grundstofferne.

   Det får AtomLab til at hænge sammen som én historie. *Mellem.*
3. **Samme hjælp til at komme i gang overalt.** Stjerneovnen og Reaktoren har guide, "Næste skridt" og "Vis mig". Batteriet har ingenting (man starter i "Pause" og skal selv finde "Oplad"). Værkstedet har opgavepillen, men ingen guide. *Mellem for Batteriet, lille for en kort guide i værkstedet.*
4. **Læg AtomLab på hjemmeskærmen som en app** (en lille manifest-fil og et ikon). Så åbner den i fuld skærm, også på iPhone og iPad, hvor knappen til fuld skærm ikke virker i dag. Med en lille ekstra fil kan den også virke uden net. *Lille til mellem.*
5. **"Test dig selv"** (idé): 3-5 små spørgsmål til sidst i hver del ("Hvad sker der, hvis du fjerner vandet?"). Det hjælper med at huske det, man har set. *Mellem, kan vente til efter jeres afprøvning.*

---

## C. Sektionerne
| Del | Det virker godt | Forslag |
|---|---|---|
| **Menu** | Flot, "Start her" for nye. | På tablet på højkant er kortene små og står nederst, og den øverste halvdel er tom. Gør kortene større. *Lille.* |
| **Atomværkstedet** | Hurtigt at bygge, gode faner, henfald med animation. | 3D-billedet er tomt og sort, når man starter. Et lille tip midt i billedet ("Tryk + ved Protoner") eller en kort guide. Ionen efter et henfald vises kun i 1,6 sekunder, og det er let at overse: Gør det til ca. 3 sekunder. *Lille.* |
| **Det periodiske system** | Søgning, filtre og grundstofkort virker godt på alle størrelser. | Væggen fylder kun ca. 40 % af bredden på pc og tablet, så felterne er små. Zoom tættere ind fra start. *Lille.* |
| **Stjerneovnen** | Nyt i denne runde: sigtehjælp, pause, graf og rejsen. | Vent på jeres afprøvning. Rettelserne fra A3 (1,44 MeV, 7,27/7,37, aksen). |
| **Reaktoren** | "Vis mig" med generationer, HUD-grafen, nyt: pause og sammenligninger. | Fejlen med uran-238 (A1). |
| **Batteriet** | Elektron-kæden og konstant strøm/spænding er pædagogisk stærke. | Etiketten "Afbryder: slukket" ligger oven i overskriften på tablet på højkant ✓. Ingen "Næste skridt"/"Vis mig" (se B3). *Lille / mellem.* |
| **Kosmos** | 9 fænomener, flot, "Ærligt talt"-noter. | Faktarettelserne fra A. Ellers velfungerende. |

---

## D. Kode og ydelse
Koden er generelt velstruktureret og læsbar, og oprydningen i Kosmos og effekterne er god. Den største svaghed er, at **der ikke er én fælles nulstilling, når man skifter del**. Hver del rydder sit eget udvalg op, og det giver de mest synlige fejl.

**Høj**
1. **Atomet står forskudt efter Det periodiske system** ✓. Har man trukket i væggen (tablet), står kameraet stadig og kigger på et forkert punkt i menuen og i værkstedet. Der kan man ikke flytte det tilbage (`system.js` stopSystem nulstiller ikke kameraets mål). Rettelse: én fælles nulstilling ved skærmskift. *Lille.*

**Mellem**
2. **Timere, der fortsætter efter skærmskift.**
   - Et henfald lige før man trykker "‹ Menu" kan zoome kameraet på den nye skærm.
   - Guiden kan starte to gange, hvis man skifter hurtigt frem og tilbage.
   - Et henfald, der venter, kan låse værkstedet.

   Rettelse: Ryd timerne, når man forlader en del. *Lille.*
3. **"Start opgaverne forfra"** står i værkstedets dialog, men nulstiller alle dele. Opgavelisterne i Stjerneovnen, Reaktoren og Batteriet viser stadig de gamle stjerner, til siden genindlæses. *Lille.*
4. **Reaktoren skriver i siden hvert billede** ✓, også i del 1. Det får browseren til at regne layout om hele tiden og mærkes mest på tablets. Opdater 4 gange i sekundet og kun, når noget ændrer sig. *Lille.*
5. **Kantudglatningen virker ikke, men koster hukommelse.** Glød-effekten tegner uden om den. Gløden kører desuden i fuld opløsning på tablets, selvom det var meningen, at den skulle køre i halv. Lille rettelse, og vi måler billeder pr. sekund før og efter. *Lille.*
6. **Stjerneovnen: Når ovnen er fuld (140 kerner), forsvinder reaktionsprodukterne** ✓, men energien tælles stadig. "+10 protoner" gør ingenting uden at sige hvorfor. *Lille.*
7. **"Reducer bevægelse" virker kun delvist.** Kameraet flyver stadig ind ved hver skærm og hvert fænomen, og nogle lysglimt bliver ikke dæmpet. *Lille.*
8. **Tilgængelighed:** Dialogerne flytter ikke fokus. Opgavelister og kernelister kan ikke bruges med tastatur. Ikonknapperne (🔊, ?, –) mangler tekst til skærmlæsere. *Lille til mellem.*

**Lav**
9. **Kopieret kode.** "Næste skridt", opgavelister, "Vis mig", tekstskilte og små hjælpefunktioner findes i flere kopier. Saml dem i et fælles modul, før flere dele får "Næste skridt". *Mellem.*
10. **Småfejl:**
    - "Ryd" efterfulgt af et hurtigt klik på et tungt grundstof kan give en grafikfejl.
    - Neutronens fart kan skiftes, mens den flyver (så kan opgaven snydes).
    - Neutronen i Reaktoren frigives aldrig (en lille hukommelseslæk).
    - **Stjernernes overflade i Kosmos koger videre under pause.** Den bruger ikke Kosmos' eget ur. Det burde jeg have fanget, da pausen blev lavet.

    *Lille.*
11. **Download:** ca. 2,8 MB (634 KB pakket). Three.js er 70 % af det. Brug de mindre `.min.js`-udgaver og `modulepreload`, og hent eventuelt Kosmos-fænomenerne først, når de skal bruges. *Lille.*
12. **Ubrugt kode og flere ting, der laves om unødvendigt** (fx elektronskyen ved ringvisning og felterne på væggen). *Lille.*

---

## E. Forslag til rækkefølge
1. **Faglige rettelser:** A1 + A2 + de vigtigste fra A3, med en ny test, der tjekker henfaldsreglerne mod kendte kerner. *Mellem.*
2. **Fejlrettelser:** D1-D7 og de små UI-rettelser:
   - menuen på tablet
   - etiketten i Batteriet
   - zoom på væggen
   - ionen i 3 sekunder
   - aksen i grafen
   - stjernerne under pause

   Mest små ting, som kan laves samlet. *Lille til mellem.*
3. **Sammenhæng:** fremgang i menuen og links mellem delene. *Lille + mellem.*
4. **Fælles "Næste skridt"-modul** (D9), og derefter "Næste skridt", "Vis mig" og en guide til Batteriet og en kort guide til værkstedet. *Mellem.*
5. **Tilgængelighed og en app på hjemmeskærmen**, med mindre download. *Lille til mellem.*
6. **"Test dig selv"**, når I har prøvet det, der er lavet.

## Status for rettelserne (trin 11)
**Fakta (A1, A2, A3):** Alt i A1 og A2 er rettet. Fra A3 er alle punkter under Reaktoren, Stjerneovnen, Batteriet, Kosmos, kerner og værkstedet, grundstofferne og citaterne rettet. Henfaldsreglerne tjekkes nu af testen `henfaldsregler` (ca. 140 kendte kerner, de letteste kerners grænser, alle kæder og de tre naturlige kæder).

**Kode (D):**
- D1: Én fælles nulstilling af kameraets styring ved skærmskift (`nulstilStyring()` i scene3d.js).
- D2: Opgavernes fejring, guiden og ionen efter et henfald venter ikke længere til næste skærm. Et henfald, der er i gang, bliver gjort færdigt, når man forlader værkstedet. Ionen vises nu i 3 sekunder.
- D3: Opgavelisterne bygges igen, når en del startes. Teksten ved "Start opgaverne forfra" siger, at det gælder alle dele.
- D4: Reaktorens panel opdateres 4 gange i sekundet og kun, når noget har ændret sig.
- D5: Kantudglatningen på lærredet er fjernet (den virkede ikke). Gløden kører i halv opløsning på telefoner og tablets. Målt i testbrowseren: tablet 3,9 → 6,7 og pc 5,1 → 5,5 billeder i sekundet. Kantudglatning i gløden blev prøvet, men kostede ca. 40 %.
- D6: Var allerede rettet.
- D7: "Reducer bevægelse": Kameraet flyver ikke ind og glider ikke, kameraturen i Kosmos hopper, blød rulning er slået fra, og atomets glimt er dæmpet.
- Fundet undervejs: "Vis mig" i kædereaktionen døde ud i ca. 1,3 % af gangene (vandet slugte den første neutron). Rettet og testet med 200 forsøg.
- Fundet undervejs: Stjerneovnens "Vis mig" kunne sigte på en kerne, man selv lige havde skudt af sted, og stoppe uden reaktion (ca. 2,5 % lige efter et eget skud). Rettet og testet med 120 forsøg.
- D10: Stjernernes overflade i Kosmos står stille under pause. "Ryd" og straks et tungt grundstof kan ikke længere løbe tør for plads i grafikken. Neutronens fart og Reaktorens neutron var allerede rettet.

**Små UI-rettelser:** Batteriets etiketter står under kassen og kan ikke længere skæres over af kantlinjen. Menuen på tablet og væggen i Det periodiske system var fine: De to fund kom fra skærmbilleder, der var taget, mens kameraet stadig zoomede.

**Fundet af jer bagefter og rettet:** Reaktoren var tom efter et klik på "For nørder" i Kosmos (en fælles CSS-klasse). Fagord uden forklaring (neutrino, alfapartikel), "6-16" uden enhed, neutronkilden, et for hurtigt tempo i Stjerneovnen og batteriets ioner og elektroner. Se erfaringer.md.

Allerede gjort i den første runde: Testen `henfald` var ustabil, fordi atomet kun er en ion i 1,6 sekunder, og testen kiggede én gang i rigtig tid. Den holder nu øje hele tiden og består stabilt. Der var ikke en fejl i spillet.
