# Drejebog: Måner ("Under isen" og "Land med Huygens")

*Opus' udkast 20. november 2026, spor Måner, trin 1 i [lige-nu/maaner.md](lige-nu/maaner.md) (jeres go 20. november 2026). Kun dokumenter, intet er bygget. Skabelonen er [drejebog-tycho.md](drejebog-tycho.md) og [fable/E3-forloeb.md](fable/E3-forloeb.md), med **den røde tråd fra begyndelsen**. Faktagrundlaget er [fakta-maaner-liv.md](fakta-maaner-liv.md) (tjekket af Fable 12. november 2026). De nye påstande i denne fil er **faktatjekket af Opus (høj) i stedet for Fable** (Fable er ikke til rådighed, linjen står i [plan-fable.md](plan-fable.md)), se afsnit 16. **Navnet:** Sonden Huygens er opkaldt efter Christiaan Huygens, hvis bog står i Opdagelserne ([drejebog-huygens.md](drejebog-huygens.md)). Den drejebog handler om manden, denne om sonden. I koden hedder sondens filer og id'er `landhuygens` / `land-med-huygens`, så de ikke kan forveksles med bogens `huygens`.*

## 1. Kernesætningerne
*Efter fem minutter kan brugeren sige:*

**"Under isen" (valgt 12. november 2026, forslag 1 med Fables slutning):** "Under isen på Europa og Enceladus er der et hav. Enceladus sprøjter havet ud i rummet, så vi har kunnet smage på det og fundet næsten alt, liv har brug for, men ingen har endnu kunnet se efter, om der er liv."

**"Land med Huygens" (ny, I vælger):**
- **A (anbefalet):** "Under Titans orange dis fandt Huygens floder og sten af is. Den er den eneste rumsonde, der er landet så langt ude, og halvdelen af billederne gik tabt på vejen."
- B: "Huygens faldt i over to timer gennem Titans dis og landede i et tørt flodleje med sten af is." (Kortere, men uden det ærlige om billederne, som I bad om.)

**Det første wow** (stilguiden C1):
- *Under isen:* I det første trin trækker man snittet ned gennem Europa. Isen glider til side, og et hav lyser blåt frem under den, før man har læst mere end én linje. I trin 3 tænder fontænerne på Enceladus i modlyset.
- *Land med Huygens:* Faldskærmen folder sig ud i den orange dis, og ca. 30 km over jorden toner det første rigtige billede fra Huygens' kamera frem.

**Det, barnet fortæller en ven:** "Der er en måne ved Saturn, der sprøjter sit hav ud i rummet, og en rumsonde har fløjet igennem og smagt på det." / "Halvdelen af billederne fra Titan gik tabt, fordi Cassini ikke lyttede på den ene kanal."

**Noget, man selv finder** (C3, ingen tekst fortæller om det):
- *Under isen:* Lupen ved snittets kant. Trækker man den hen over Europas hav, står Jordens dybeste sted (ca. 11 km) som et lille hak ved siden af havet på 60-150 km.
- *Land med Huygens:* Uret under nedstigningen. Et tryk skifter mellem "Tid ved Titan" og "Tid på Jorden", og man opdager, at signalet var over en time om at nå hjem (regnet, afsnit 16).

## 2. Hvor det bor
**Anbefalet (spørgsmål 1):** To nye fænomener i **Solsystemet** i verdenen Rummet, som [plan-verdener.md](plan-verdener.md) siger ("månerne med mulige betingelser for liv"). De står som en lille gruppe lige efter Saturn i listen:
- **"Under isen"** (`underisen`): Europa og Enceladus side om side i rigtig størrelse (ca. 3.100 og ca. 504 km). Forløb 1.
- **"Land med Huygens"** (`landhuygens`): Titan og nedstigningen. Forløb 2.

Grunden: Månerne findes allerede i Solsystemet, man kan komme direkte fra Europa-, Enceladus- og Titan-stoppet, og den fælles skal (`js/faenomenskaerm.js`) giver stien i toplinjen, Styr-boksen, tidsknappen og forløb med `fænomen` gratis (som Tid i Kosmos). Ingen ny del i menuen.

*Mulighed B:* en egen del "Månerne" i Rummet (`js/maaner.js` bygget på `lavFænomenSkærm` som `kosmos.js` og `solsystem.js`). Den rører færre af Solsystemets filer, men giver en ny del i menuen for to fænomener og et ekstra sted at finde Europa.

**Filerne, sporet ejer** (begge muligheder): `js/maaner/` (fx `underisen.js`, `snit.js`, `tavle.js`, `landhuygens.js`, `nedtur.js`), `js/data/maaner/` (tal og tekster uden Three.js, kan testes i Node), `js/data/forloeb/under-isen.js` og `land-med-huygens.js`, `billeder/solsystem/huygens/` med `lav_huygens.py`, `docs/kode/maaner.md` og testene `tests/maaner-*.mjs`. Hvilke af Solsystemets filer sporet læser og kun ændrer med et go, står i afsnit 17.

## 3. Den røde tråd
Spørgsmålet **"Hvad gemmer sig under isen, og hvordan kan vi vide det, når ingen har været der?"** driver forløb 1. Forløb 2 vender det om: **"Og hvad med det ene sted, hvor en sonde faktisk er landet?"** Hvert trin slutter med det, der leder videre.

| Trin | Delen af historien | Slutter med |
|---|---|---|
| **Under isen** 1 To isklodser | **Mysteriet:** To måner dækket af is. Snittet viser et hav | "Men ingen har boret gennem isen. Hvordan ved vi det?" |
| 2 Magnetfeltet | **Sporet:** Galileo målte et magnetfelt, der kun kan komme fra salt vand | "Europas hav er gemt. Men der er en måne, der viser sit hav frem …" |
| 3 Enceladus sprøjter | **Beviset, man kan se:** fontænerne ved sydpolen | "Hvis havet sprøjter ud, kan man smage på det." |
| 4 Smag på havet | **Fundene:** Cassini flyver igennem, og fundene lægges på tavlen | "Så er der liv?" |
| 5 Er der liv? | **Det, ingen ved:** Liv står grå på tavlen | "Det så du" og vejen til Titan |
| **Land med Huygens** 1 Slip Huygens | **Turen:** Den eneste landing så langt ude | "Hvad ser kameraet på vejen ned?" |
| 2 Gennem disen | **Sporene fra luften:** floder og bakker | "Hvad er jorden lavet af?" |
| 3 Landet | **Jorden:** sten af is i et tørt flodleje | "Men hvorfor er der så få billeder?" |
| 4 Halvdelen gik tabt | **Ærligt talt som et trin:** kanal A | "Det så du" og vejen til Christiaan Huygens' bog |

## 4. Forløb 1: "Under isen"
Linjen under scenen er Forløb-klodsen (`js/forloeb.js`). Hver "Så" har højst to sætninger og under ca. 160 tegn. Gæt i fire af fem trin. "Næste ›" står der hele tiden (B2), og "Vis mig" gør handlingen.

| Trin | Spørg | Gæt (og svaret bagefter) | Gør | Så | Ord |
|---|---|---|---|---|---|
| 1 *To isklodser* | To måner dækket af is. Europa kredser om Jupiter, den lille Enceladus om Saturn. Hvad tror du, der er under isen? | *Is hele vejen ind* ("Isen er kun det yderste lag.") / *Sten* ("Inderst er der sten, men først kommer et hav.") / *Vand* ("Ja, et hav under isen.") | Træk snittet ned gennem Europa | Under ca. 20 km is er der et hav, 60-150 km dybt. Det er måske dobbelt så meget vand som i alle Jordens have. | – |
| 2 *Hvordan ved vi det?* | Ingen har boret gennem isen. Hvordan kan forskerne vide, at der er et hav? | *En rumsonde så vandet* ("Intet kamera kan se gennem 20 km is.") / *En rumsonde målte et magnetfelt* ("Ja. Det er målt, men på en omvej.") / *Det er bare et gæt* ("Det er mere end et gæt. Det er målt, men på en omvej.") | Slå havet til og fra, og se, hvad Galileo måler, når Jupiters magnetfelt vipper | Salt vand leder strøm. Når Jupiters magnetfelt vipper, laver havet sit eget lille felt, og det målte rumsonden Galileo omkring år 2000. | magnetfelt |
| 3 *Enceladus sprøjter* | Enceladus er kun ca. 500 km bred. Da Cassini kom forbi i 2005, opdagede den noget mærkeligt ved sydpolen. Hvad tror du, det var? | *Støv fra et nedslag* ("Støv ville falde ned igen. Det her bliver ved og ved.") / *Vand og is, der sprøjter op* ("Ja.") / *Gas fra Saturn* ("Det kommer inde fra månen selv.") | Drej Enceladus, så Solen står bag sydpolen | Over 100 fontæner sprøjter vand og is ud gennem revner ved sydpolen. Vandet kommer fra et hav under isen. | fontæne |
| 4 *Smag på havet* | Liv, som vi kender det, har brug for tre ting: vand, energi og de rigtige stoffer. Cassini fløj gennem sprøjtet. Hvad tror du, den fandt? | *Kun vand* / *Vand og salt* / *Næsten alt, liv har brug for* (alle får svaret: "Se tavlen.") | Flyv med Cassini gennem sprøjtet (M4, afsnit 6a), og læg de fire fund på tavlen | Enceladus har næsten alt, liv har brug for, og det meste er målt. På Europa er det meste regnet eller gættet. | – |
| 5 *Er der liv?* | Så er der liv i havet? | *Ja* / *Nej* / *Det ved ingen* (alle: "Det ved ingen endnu.") | Tryk på den sidste linje på tavlen | Det ved ingen. Cassini kunne ikke se efter liv, og det har ingen rumsonde endnu kunnet. | – |
| **Det så du** | Kernesætningen. Under den: "Men på én måne er en sonde faktisk landet." | – | Vælg en vej | – | – |

**Trin 5 slås sammen med "Det så du",** hvis forløbet tager over fem minutter i prøven (spørgsmålet "Så er der liv?" bliver så overskriften over kernesætningen).

## 5. Scenen i "Under isen"
- **Begyndelsen** (billedet først, A6): Europa og Enceladus side om side i rigtig størrelse mod en sort himmel, Solen fra siden. Europa med USGS-kortet (det samme som ved Jupiter), Enceladus med Cassinis kort og formen (det samme som ved Saturn). Navnene står under månerne (kontakten "Navne"). Efter ca. 2 sekunder (eller når man rører scenen) kommer linjen.
- **Trin 1, snittet:** Man trækker et snit ned gennem Europa (træk på månen, eller skyderen "Snit" i trinnet). Den forreste kvart glider væk, og lagene ses i rigtig skala: isen (hvid, tynd), havet (blåt, lyser svagt), stenen (brun) og en lille jernkerne (grå). Lagene får små mærker: "Is: 15-25 km (regnet)", "Hav: målt, dybden regnet", "Sten og jern: regnet". Målet er rundt (B5): Er snittet over halvvejs, glider det selv det sidste stykke. **Lupen** (C3): en lille rund lup ved snittets kant, der kan trækkes. I lupen er lagene forstørret, og Jordens dybeste sted (ca. 11 km) står som en lille søjle ved siden af.
- **Trin 2, magnetfeltet:** Jupiter står uden for billedet til venstre. Dens feltlinjer er tegnet som svage, blå buer, der vipper langsomt frem og tilbage (Jupiters felt hælder ca. 9,4° og drejer med planeten, så set fra Europa vipper det). En lille Galileo flyver forbi, og en måler ("Galileos magnetometer") viser feltet. Kontakten **"Hav"** står i linjen: Med havet slået til bøjer feltlinjerne uden om Europa og vender, når Jupiters felt vender. Uden hav går de lige igennem. Færdig, når man har prøvet begge. *Det her er den nye idé i trinnet, og det sværeste at tegne enkelt.*
- **Trin 3, fontænerne:** Kameraet glider hen til Enceladus. Man drejer månen (træk), og når Solen står bag sydpolen (modlys), tænder fontænerne fra de fire tigerstriber. Færdig, når modlyset er nået (rundt mål: inden for ca. 30°). Bagefter åbner snittet sig selv gennem Enceladus: isen (ca. 20 km, under 5 km ved sydpolen), havet (ca. 25-45 km) og stenkernen (ca. 185 km i radius). Her er lagene tykke nok til at ses uden lup.
- **Trin 4, tavlen** (afsnit 6): Tavlen kommer frem til højre (under scenen på en telefon). Man flyver selv med Cassini gennem sprøjtet (M4, afsnit 6a; med `ROLIG` flyver en lille Cassini i en bue, set udefra), og fire kort falder ud: "Salt", "Brint", "Store stoffer med kulstof" og "Fosfat". Man trækker hvert kort hen på den række, det hører til (vand, energi eller stoffer). Europas søjle fylder sig selv bagefter, kort for kort, så man kan sammenligne.
- **Trin 5:** Den nederste linje på tavlen, "Liv", er grå for begge måner. Et tryk viser: "Ikke fundet. Ingen har endnu kunnet se efter."
- **Det så du:** Kernesætningen og vejene: **"Land med Huygens ›"** (primær, når forløb 2 findes), "Flyv gennem fontænen ›" (findes fra M4), "Se fontænerne ved Saturn ›", "Leg frit" og "Tag turen igen". En vej kommer først frem, når den findes (A9).

**Det sværeste** at bygge er snittet med lagene i rigtig skala (en egen shader eller to halvkugler med en flad skive, for `lavEnceladus` bruger sin egen shader uden klippeplaner) og magnetfeltet i trin 2, så det er enkelt at forstå.

## 6. Tavlen med de tre ting
Rækkerne er **Vand**, **Energi**, **Stoffer** og til sidst **Liv**. Søjlerne er **Europa** og **Enceladus**. Et felt får farven fra det bedste kort i det: **grøn = målt**, **gul = regnet eller gættet**, **grå = ukendt**. Liv er altid grå. Farverne følger stilguiden A7 (grøn og gul er ikke fare). Hvert kort har en lille linje "Hvem og hvornår", og et tryk på kortet åbner et "Hvordan ved vi det?"-kort (afsnit 9).

| Måne | Kort | Række | Farve | Hvem og hvornår (kilden i faktafilen) |
|---|---|---|---|---|
| Europa | Magnetfeltet | Vand | grøn (målt, på en omvej) | Galileo, omkring år 2000 (Kivelson m.fl. 2000) |
| Europa | Salt på overfladen | Stoffer | gul | Hubble, 2019 (målt på overfladen, at det kommer fra havet er en tolkning) |
| Europa | Kuldioxid | Stoffer | gul | Webb, 2023 ("we cannot rule out formation on the surface") |
| Europa | Varme fra tidevandet | Energi | gul | regnet (og en model fra 2026 siger, at havbunden nok er stille) |
| Europa | Ilt fra strålingen | Energi | gul | Juno målte, at der dannes ilt i isen (2024). Om den når havet, er gættet |
| Enceladus | Fontænerne | Vand | grøn | Cassini, 2005 |
| Enceladus | Månen vugger | Vand | grøn | Cassini (Thomas m.fl. 2016): isen sidder løst på et hav |
| Enceladus | Salt | Stoffer | grøn | Cassini (salt i iskornene) |
| Enceladus | Brint | Energi | grøn | Cassini (Waite m.fl. 2017) |
| Enceladus | Store stoffer med kulstof | Stoffer | grøn | Cassini (Postberg m.fl. 2018) |
| Enceladus | Fosfat | Stoffer | grøn | Cassini-korn i E-ringen (Postberg m.fl. 2023) |

- **De fire kort, man selv lægger** i trin 4, er Enceladus' salt, brint, store stoffer og fosfat. Fontænerne og vuggen ligger der allerede fra trin 3 (vand er grøn). Europas magnetfelt ligger der fra trin 2.
- **Forkert række** (B5): Kortet glider selv hen til den rigtige, og et vink forklarer, fx "Brint er ikke vand. Mikrober (små levende celler) kan få energi af brint." Ingen point, ingen rød farve.
- **Svovl** er ikke et kort: Det er kun antydet på Enceladus (Peter m.fl. 2023), og det står i "Vil du vide mere?".
- **Laboratoriet:** Tavlen kan foldes ind. Kortene kan flyttes frit, og "Forfra" lægger dem tilbage.

## 6a. M4: Flyv gennem fontænen (20. november 2026, A valgt af orkestratoren, kan ændres af jer, bygget samme dag)
*Trin 4's Gør bliver flyveturen i stedet for Cassini i buen (afsnit 5). Tavlen, kortene og trin 5 er de samme.*
- **Hvad man gør:** I trin 4 står knappen **"🛰️ Flyv med Cassini"** i linjen. *(Bygget som beskrevet. Målerne står øverst i 3D-vinduet, så de ikke dækker Cassini, og på en lav scene, hvor tavlen står under den, er tavlen skjult under turen.)* Kameraet glider ind bag en lille Cassini et stykke fra sydpolen, og Cassini flyver selv fremad gennem sprøjtet med Solen forude (modlys, så strålerne lyser). **Man styrer højden** (anbefalet): træk op og ned i scenen (eller ↑ og ↓). En højdemåler viser "Højde over sydpolen" fra ca. 300 km ned til 49 km, og lavere kan man ikke komme (Cassinis dybeste dyk). Jo lavere og jo tættere på revnerne, jo hurtigere fyldes to målere: **"Iskorn"** (Cassinis støvmåler) og **"Gas"** (Cassinis gasmåler, et massespektrometer, forklaret i én linje).
- **Hvad man ser:** Enceladus som en mørk skive foroven med fontænerne i modlys, og iskorn, der suser forbi som små streger. Når en måler passerer et mærke, falder et kort ud på tavlen med en kort linje om, hvad der var i: Gas: **Brint** ("Gassen er mest vand, men der er også lidt brint"), iskorn: **Salt**, **Store stoffer med kulstof** og **Fosfat**. Bagefter glider kameraet ud i modlyset igen, og man lægger kortene på tavlen som før.
- **Et rundt mål** (B5): Man kan ikke fejle. Højt oppe fyldes målerne langsomt, og er de ikke fulde, når Cassini er igennem, vender den og flyver igennem igen ("Det gjorde den rigtige Cassini også"). "Vis mig" og "Næste ›" flyver turen lavt og lægger kortene.
- **Laboratoriet:** Handlingen "🛰️ Flyv gennem fontænen" i bjælken ved Enceladus, og vejen **"Flyv gennem fontænen ›"** i "Det så du" (flyver turen igen uden forløbet). `ROLIG` (reducer bevægelse): Kameraet bliver stående i modlyset, og Cassini flyver igennem set udefra.
- **Ærligt talt** (lægges til afsnit 10): Cassini fløj forbi Enceladus 23 gange fra 2005 til 2015 og gennem sprøjtet flere gange. Det dybeste dyk var ca. 49 km over sydpolen 28. oktober 2015 med ca. 8,5 km i sekundet, og det var på det dyk, gasmåleren fandt brinten. Cassini kunne ikke styres undervejs: Banen var planlagt længe før. Her styrer du selv for sjov, og turen er spolet frem. Iskornene og Cassini er tegnet meget større end de var. Fosfatet blev fundet i iskorn fra E-ringen, der kommer fra fontænerne, fanget længere ude.
- **Fælde fundet** (skrives i [fakta-faelder-liv.md](erfaringer/fakta-faelder-liv.md)): "Cassinis laveste passage var 49 km" er forkert. Den laveste forbiflyvning var 25 km (9. oktober 2008, ved 28° S). De 49 km i 2015 var det **dybeste dyk gennem sprøjtet** over sydpolen.
- **Tjekket 20. november 2026 (Opus, høj, `/faktatjek`, kan tjekkes af Fable senere):** E21 28. oktober 2015, ca. 48-49 km over sydpolen, 8,5 km/s, "deepest-ever dive through the plume" (JPL, NASA "Enceladus Flyby at a Glance"; én NASA-side siger 25. oktober, de andre 28.). Brinten blev fundet med gasmåleren INMS på netop E21 (Waite m.fl. 2017, *Science* 356:155). Gassen er mest vand, med kuldioxid, metan, ammoniak og brint (NASA-oversigt). 23 forbiflyvninger 2005-2015 i 25-5.000 km (NASA's slutopgørelse). E5 9. oktober 2008: 25 km, 28° S, 17,7 km/s (ESA). Salt: Tæt på kilderne er de store, saltrige korn i flertal, målt af støvmåleren CDA på tre passager gennem sprøjtet i 2008-2009 (Postberg m.fl. 2011, *Nature* 474:620). Store stoffer med kulstof: målt i korn både i sprøjtet og i E-ringen (Postberg m.fl. 2018, *Nature* 558:564, ESA). Fosfat: kun i korn fra E-ringen (Postberg m.fl. 2023), og det står i linjen, når kortet falder ud.
- **Alternativ B:** Ingen styring: Man trykker "Flyv", ser turen, og kortene falder ud af sig selv. Mindre kode, men trinnets Gør bliver kun et tryk.
- **Koden:** sporets egne filer `js/maaner/flyvetur.js` (kameraet bag Cassini, kornene, målerne og styringen) og `js/data/maaner/flyvetur.js` (højderne, tætheden i sprøjtet, mærkerne og teksterne, testes i Node). `fontaener.js` bruges, ændres ikke (fontænernes punkter gøres mindre under turen gennem materialets egen `uStr`, så de ikke fylder skærmen tæt på).

## 7. Forløb 2: "Land med Huygens"
Nedstigningen tog 2 t 27 min 50 s. Her spoles den frem, så hele turen ned tager ca. 1-1½ minut (trinene giver ekstra tid til at læse, som Venus' tur ned). Gæt i alle fire trin.

| Trin | Spørg | Gæt (og svaret bagefter) | Gør | Så | Ord |
|---|---|---|---|---|---|
| 1 *Slip Huygens* | Titan er pakket ind i en tyk, orange dis, så ingen havde set jorden. Huygens skal ned i faldskærm. Hvor lang tid tror du, det tager? | *Et par minutter* / *En halv time* / *Over to timer* ("Ja, næsten to en halv time.") | Slip Huygens fra Cassini | Over to timer, for luften er tyk, og faldskærmen falder langsomt. Vi spoler frem. | – |
| 2 *Gennem disen* | Huygens' kamera kigger ned hele vejen. Hvornår tror du, det kan se jorden gennem disen? | *Med det samme* / *Halvvejs nede* / *Først tæt på jorden* ("Ja, ca. 30 km over jorden.") | Spol ned, og se, hvad kameraet ser | Først ca. 30 km over jorden kunne kameraet se jorden, halvt så højt som ventet. Fra lyse bakker løber floder ned mod en flad, mørk slette. | – |
| 3 *Landet* | 700 m over jorden tænder Huygens en lampe. Hvad tror du, den skal bruge den til? | *At se i mørket* ("Der er tusmørke, ikke mørkt.") / *At måle farven på jorden* ("Ja. Derfor ved vi, hvilken farve jorden har.") / *At blive fundet* ("Der er ingen til at finde den.") | Land, og tryk på de to sten foran Huygens | Stenene er is, hårde som sten ved ca. −180 °C. Huygens står i et tørt flodleje, som nok er gravet af flydende metan. | metan |
| 4 *Halvdelen gik tabt* | Huygens sendte billeder til Cassini på to radiokanaler, A og B. Der skulle komme 700 billeder. Hvor mange tror du, der kom? | *Alle 700* / *350* ("Ja.") / *Ingen* | Tænd Cassinis to modtagere, og se, hvad der kommer igennem | 350. En fejl i kommandoerne gjorde, at Cassini aldrig lyttede på kanal A, så halvdelen af billederne gik tabt. | – |
| **Det så du** | Kernesætningen. Under den: "Titan blev fundet i 1655 af Christiaan Huygens, som sonden er opkaldt efter." | – | Vælg en vej | – | – |

## 8. Scenen i "Land med Huygens"
- **Begyndelsen:** Titan med den orange dis (`lavTitan` fra `atmosfaere.js`, det samme som ved Saturn) og Cassini med Huygens på siden, tegnet af os. Datoen står i hjørnet: 25. december 2004.
- **Trin 1:** Huygens glider fri af Cassini (et lille skub og en langsom drejning). Datoen springer til 14. januar 2005, og sonden suser ind i luften med et svagt skær foran varmeskjoldet. Pilotskærmen trækker hovedskærmen ud. **Uret** starter: "I faldskærmen: 0 t 00 min". *Uret er det, man selv finder: Et tryk skifter til "Tid på Jorden", hvor signalet kommer over en time senere.*
- **Trin 2:** Kameraet følger Huygens ned gennem disen (tidsknappen spoler, ⏩ er slået til). En højdemåler med en søjle viser højden (som Venus' måler). Ved ca. 110-140 km skiftes til den mindre faldskærm (står kun i "For nørder", for tiden er ESA's plan fra før landingen). Disen er tæt hele vejen. Ved ca. 30 km toner **"Huygens' kamera"** frem: et lille vindue med de rigtige sort-hvide billeder fra luften, et nyt billede ved hver højde, hvor der findes et (listen findes i M5a, afsnit 13). Vinden lader Huygens drive lidt til siden højt oppe og næsten ikke de nederste km. Færdig, når man er under ca. 1 km.
- **Trin 3:** 700 m over jorden tændes lampen (et varmt skær under sonden). Huygens lander, laver et lille hul, hopper, glider 30-40 cm og vipper (Wikipedia efter NASA/JPL, RS). Så fylder ESA's **farvebillede fra jorden** (PIA07232) scenen: det rigtige billede, ikke en 3D-verden. De to sten midt i billedet (ca. 15 og 4 cm, ca. 85 cm fra sonden) lyser svagt. Et tryk på en sten viser dens størrelse med en lineal. Færdig, når begge er trykket. Lyset er svagt som i tusmørket lidt efter solnedgang.
- **Trin 4:** To små modtagere på Cassini, "A" og "B", som man tænder med et tryk. B blinker, og billederne tæller op til 350. A er mørk: "Ingen lyttede." Billederne fra trin 2 og 3 står som en strimmel, hvor hvert andet felt er tomt.
- **Det så du:** Kernesætningen og tre veje: **"Læs om ham, der fandt Titan ›"** (primær, `data-gaa="opdagelser:huygens"`), "Se Titan gennem disen ›" (`solsystem:saturn:titan`, kontakten "Under disen (infrarødt)") og "Tag turen igen". "Under isen ›" står i stedet for den sidste, hvis forløb 1 ikke er taget.

**Ingen gåtur** (jeres svar 4): Man står ikke på Titan. Landskabet er ESA's billede selv. At gå rundt på Titan og se søerne er "senere, ikke planlagt" (punkt 5 i sporets plan).

**Det sværeste** at bygge er at spole frem, så både disen, uret, højdemåleren og billederne følger med, også når man bladrer tilbage (Venus' tur ned har løst det samme, se afsnit 17).

## 9. Hvordan ved vi det?
"Hvorfor?"-kort med overskriften "Hvordan ved vi det?" (Retningen, punkt 7), ikke en ny slags klods. Højst fire spørgsmål i panelet ad gangen.

**Under isen:**
- *Hvordan ved vi, at der er et hav på Europa?* Galileos magnetometer (trin 2). "Det er det bedste bevis, men det er på en omvej: Ingen har set havet."
- *Hvordan opdagede Cassini fontænerne?* Først med sit magnetometer: Saturns magnetfelt bøjede uden om Enceladus (februar og marts 2005). I juli 2005 fløj Cassini forbi og fandt en sky af vand over sydpolen, og senere kom billederne.
- *Hvordan ved vi, at Enceladus' hav er under hele isen?* Månen vugger lidt for meget, mens den kredser. Det kan den kun, hvis isen ikke sidder fast på stenkernen (Thomas m.fl. 2016).
- *Hvorfor fryser havene ikke?* Jupiter og Saturn trækker i månerne, så de bliver æltet og varmet indefra (tidevandskraft, står i Ordbogen). Saltet gør også, at vandet fryser ved en lavere temperatur.
- *Hvordan ved vi, hvor tyk isen er?* Mest regnet ud fra tyngden og overfladen. Juno målte i 2022 ca. 29 km i ét område med mikrobølger (udgivet i december 2025).

**Land med Huygens:**
- *Hvordan ved vi, hvilken farve jorden har?* Billederne fra luften er sort-hvide. Lampen målte, hvordan jorden kaster lyset tilbage, og farverne på billedet fra jorden er lagt på bagefter ud fra det.
- *Hvordan ved vi, at jorden er blød?* Måleinstrumenterne under Huygens mærkede stødet: som våd sand eller let sammenpresset sne. Det første gæt, "mudder" eller "crème brûlée", holdt ikke.
- *Hvordan blev vinden målt, når kanal A gik tabt?* Radioteleskoper på Jorden lyttede selv til Huygens' signal og målte ud fra det, hvordan vinden skubbede til sonden.

## 10. Laboratoriet bagefter
Efter forløbet åbner laboratoriet i to skridt (B8): først scenen og Styr-boksen, så panelet, når man selv åbner det.
- **Under isen**, Styr-boksen ("Indstillinger"): skyderen **"Snit"**, kontakterne **"Hav"** (magnetfeltet ved Europa), **"Modlys"** og **"Navne"**, og valget Europa / Enceladus / Begge. Tavlen kan foldes ind.
- **Land med Huygens:** tidsknappen og bladring mellem trinene (‹ og "Næste: … ›", som Venus' tur ned), kontakten **"Huygens' kamera"** og uret.
- **Højre panel** (budgettet): titel, højst to tal (fx "Havets dybde: 60-150 km" og "Isen: ca. 15-25 km"), højst tre sætninger, højst fire spørgsmål (afsnit 9), så "Vil du vide mere?" og "Ærligt talt", lukkede.
- **Ærligt talt, "Under isen":** Lagenes tykkelse er skøn, ikke målt, undtagen Junos ene sted. Jernkernen i Europa er noget, forskerne tror, ikke har set. Magnetfeltet er tegnet langt enklere end det rigtige. Fontænernes partikler er tegnet meget større end de rigtige iskorn. Cassini fløj forbi 23 gange fra 2005 til 2015 og gennem sprøjtet flere gange, dybest ca. 49 km over sydpolen i oktober 2015. Banen var planlagt længe før (man styrer selv for sjov), turen er spolet frem ca. 12 gange, og fosfatet er kun fundet i korn fra E-ringen (afsnit 6a). Tavlen gør det enkelt: Et "grønt" kort er målt, men tit på en omvej.
- **Ærligt talt, "Land med Huygens":** Nedstigningen er spolet frem ca. 100 gange. Sonden, faldskærmene, Cassini og disen er tegnet af os. Billederne i kameraet og fra jorden er Huygens' egne, men farverne fra jorden er lagt på bagefter. Uret ved Titan er omtrentligt.
- **Vil du vide mere?** Europa Clipper (opsendt 2024, skal nå Jupiter i april 2030 og flyve forbi Europa ca. 50 gange, men lander ikke og leder ikke efter liv), ESA's plan om en sonde og en lander til Enceladus (opsendelse tidligst i 2040'erne), Dragonfly til Titan (tidligst juli 2028, fremme sidst i 2034), svovl, havet dybt inde i Titan (omstridt siden december 2025) og Titans søer af metan.

## 11. Gør det selv og links begge veje
**Gør det selv** (i programmet):
- *Under isen:* **"Se fontænerne selv ›"** åbner Saturn ved Enceladus (`data-gaa="solsystem:saturn:enceladus"`) med linjen: "Slå Modlys til, og flyv rundt om sydpolen." Og **"Se Europa ved Jupiter ›"** (`solsystem:jupiter:europa`).
- *Land med Huygens:* **"Læs om ham, der fandt Titan ›"** (`opdagelser:huygens`, Christiaan Huygens' bog) og **"Se Titan gennem disen ›"** (`solsystem:saturn:titan`).

**Prøv selv i køkkenet** (en linje i "Vil du vide mere?", ingen fare):
- "Læg en isterning i et glas vand. Isen flyder ovenpå, fordi is er lettere end vand. Derfor ligger isen øverst på Europa og havet nedenunder."
- "Tab en bold fra ca. 1 m ned på gulvet. Ca. så hårdt ramte Huygens jorden på Titan." (RS, faktafilen afsnit 4.)

**Links begge veje** (med et go, for linjerne står i Solsystemets filer):
- Ved **Europa** (`js/data/sider/jupiter.js`, spørgsmålet "Er der liv?" eller `videre`): "Se under isen ›" (`solsystem:underisen`).
- Ved **Enceladus** (`js/data/sider/saturn.js`): "Se under isen ›".
- Ved **Titan** (`js/data/sider/saturn.js`, svaret "Ja. Sonden Huygens landede på Titan …"): "Land med Huygens ›" (`solsystem:landhuygens`).
- I **Christiaan Huygens' bog** ("Om Huygens", Videnskabsfolkene-sporet): "Land med sonden Huygens ›". Spørges i det spor, ikke her.
- **Gåderne:** Kortet "Er der liv andre steder?" kan pege på "Under isen ›" (Gåde-sporet bestemmer).

## 12. Valgt fra
Io og Ganymedes (Ganymedes har nok også et hav, men det er ikke i faktafilen), Europas fontæner (ingen ved, om de findes: Roth m.fl. 2026), strålingsdosen på Europa (kun "dødelig for et menneske"), Enceladus' pH (kun "basisk", i "Vil du vide mere?"), azotosomerne på Titan (spekulation, imod siden 2020 og 2026), "magiske øer" i Titans søer, at stå på Europa, Enceladus eller Titan (senere, tegnet ud fra fotos fra kredsløb), Titans metankredsløb som eget trin (en sætning i "Vil du vide mere?"), landingens klokkeslæt (kun datoen), landingshastigheden (ikke slået op i en åbnet kilde), hvor længe Huygens sendte fra jorden (kun "over en time"), Titan som tredje søjle på tavlen (se spørgsmål 5).

## 13. Billederne (kilde og licens)
*Skrevet i stilen fra `billeder/solsystem/KILDER.md`. Rækkerne for de nye billeder kommer først i `KILDER.md`, når de er lavet (M5a), og licenslinjen står både dér, ved billedet og i hjælpen.*

| Fil | Hvad | Kilde | Licens |
|---|---|---|---|
| `europa-8k/4k/2k.jpg` (findes, J3) | Europas overflade i gråtoner | NASA/JPL/USGS, Voyager og Galileo SSI, global mosaik fra USGS Astrogeology | Public domain (NASA/USGS). Genbruges, intet nyt |
| `enceladus-8k/4k/2k.jpg` og `enceladus-form.png` (findes) | Enceladus' overflade og form | NASA/JPL/Space Science Institute, Cassini ISS, USGS Astrogeology (formen: Bland m.fl. 2019) | Public domain (NASA/USGS). Genbruges |
| `titan-4k/2k.jpg` (findes) | Titans overflade i nær-infrarødt lys | NASA/JPL-Caltech/Space Science Institute, Cassini ISS, PIA19658, USGS Astrogeology | Public domain (NASA). Genbruges |
| `huygens/jorden.webp` (ny, M5b) | Det første farvebillede fra Titans jord med de to sten. Farverne er lagt på bagefter ud fra Huygens' måling af lyset | ESA/NASA/JPL/University of Arizona, Huygens DISR, 14. januar 2005. NASA Photojournal **PIA07232** "First Color View of Titan's Surface" (åbnet 20. november 2026, credit dér: "NASA/JPL/ESA/University of Arizona") og ESA's udgave | **ESA Standard Licence:** må bruges til undervisning og oplysning, gratis, med "ESA" som kilde og uden at antyde, at ESA står bag (faktafilen afsnit 5, S). Commons kalder billedet `PD-USGov-NASA`, men vi følger ESA. Hele credit-linjen står ved billedet |
| `huygens/luft-*.webp` (ny, M5a) | Sort-hvide billeder fra luften, et pr. højde, fx mosaikken med flodkanalen og bakkerne | ESA/NASA/JPL/University of Arizona, Huygens DISR. Photojournal **PIA07236** "Mosaic of River Channel and Ridge Area on Titan" (åbnet, credit som ovenfor) og billeder fra filmen **PIA08117** "Titan Descent Data Movie" | ESA Standard Licence, som ovenfor. **Højden for hvert billede slås op i kilden i M5a** (står ikke i faktafilen) |
| Sonden, faldskærmene, Cassini, snittet, magnetfeltet og tavlen | Tegnet af os (3D og lærred) | – | Vores |

`lav_huygens.py` (ny, i `billeder/solsystem/`) laver billederne ud fra originalerne, som ikke ligger i repoet (adresserne øverst i filen). Mål: højst ca. 1 MB i alt for Huygens' billeder (Retningen: en skærm uden nye kloder), WebP eller JPG, højst 1600 px bredt (ca. 200-250 KB for billedet fra jorden).

## 14. Ordene
Højst to nye fagord pr. trin. Forslag (under 260 tegn, faktatjekket i afsnit 16):
- **Magnetfelt** (Under isen, trin 2): "Det område rundt om en magnet eller en elektrisk strøm, hvor en kompasnål bliver drejet. Jorden og Jupiter har store magnetfelter. Når et magnetfelt ændrer sig, kan det sætte strøm i gang i noget, der leder strøm, fx salt vand." **Planlagt i Strøm og magneter** ([drejebog-strom.md](drejebog-strom.md), trin 3): Den del, der bygges først, skriver ordet, og den anden bruger det.
- **Fontæne** (Under isen, trin 3): "Vand og is, der sprøjter ud i rummet gennem revner i isen på en måne. Vandet kommer fra et hav under isen. Enceladus har over 100 fontæner ved sydpolen."
- **Metan** (Land med Huygens, trin 3): "En gas af kulstof og brint (CH₄). På Jorden er den i naturgas. På Titan er det så koldt (ca. −180 °C), at metan kan være flydende: Det regner med metan, og der er søer af det."

Allerede i Ordbogen: **tidevandskraft**, **biospor** (bruges kun i "Vil du vide mere?"), **superrotation** (vinden på Titan, "For nørder") og **isvulkan**. "Brint" skrives "brint (hydrogen)" første gang.

## 15. Prøven med sønnen
Efter ti minutter uden hjælp ([guide-proeven.md](guide-proeven.md)): *Hvad gjorde du først? Hvor gik du i stå? Hvad handlede det om?* Og:

**Under isen:**
1. Hvad er der under isen på Europa og Enceladus? (Et hav.)
2. Hvordan ved vi, at der er et hav på Europa, når ingen har set det? (Galileo målte et magnetfelt, som salt vand laver.)
3. Har man fundet liv? (Nej, og ingen har endnu kunnet se efter. Men Enceladus har næsten alt, liv har brug for.)

**Land med Huygens:**
1. Hvad fandt Huygens på Titan? (Floder, et tørt flodleje og sten af is.)
2. Hvorfor kom der kun halvt så mange billeder? (Cassini lyttede ikke på den ene kanal.)
3. Hvad er floderne på Titan lavet af? (Nok metan, ikke vand.)

Forløbet er godt nok, når I bagefter kan sige kernesætningen med jeres egne ord. Tager forløb 1 over fem minutter, slås trin 5 sammen med "Det så du" (afsnit 4).

## 16. Fakta
Alt fra faktafilen bruges med dens sikkerhed. **Nye påstande i denne drejebog** (tjekket af Opus, høj, 20. november 2026, i stedet for Fable):

| Påstand | Kilde | Sikkerhed |
|---|---|---|
| Europa har "an iron core, a rocky mantle, and an ocean of salty water" (forskerne tror det: "is thought to have") | NASA "Europa Facts" (åbnet i dag) | S (at det er en tro). Skriv "regnet" ved kernen |
| Havet "may contain twice as much water as Earth's global ocean" | samme (åbnet) | S. Skriv "måske dobbelt så meget" |
| Galileo kredsede om Jupiter fra 1995, magnetfeltet blev målt ved forbiflyvninger i slutningen af 1990'erne, og artiklen kom i 2000 | NASA (åbnet: "entered orbit around Jupiter in 1995", billeder fra "the late 1990s"), Kivelson m.fl. 2000 (faktafilen) | RS. Skriv "omkring år 2000" |
| Jupiters magnetfelt hælder 9,4° | NSSDC (del5a, S) | S |
| Enceladus' stenkerne har en radius på ca. 185 km | Čadek m.fl. 2016 (del1, via Centauri Dreams) | RS. Skriv "ca." og "regnet" |
| Cassinis magnetometer opdagede fontænerne først (februar-marts 2005), skyen af vand blev fundet 14. juli 2005 | del1 (S) | S |
| Jordens dybeste sted er ca. 11 km | faktafilen afsnit 6 (Marianergraven, ca. 10,9 km) | S |
| Christiaan Huygens fandt Titan 25. marts 1655, og sonden er opkaldt efter ham | fakta-videnskabsfolk/huygens.md (S) | S |
| Huygens fløj med Cassini i over syv år (15. oktober 1997 til 14. januar 2005) og blev sluppet 20 dage før (tre uger) | faktafilen afsnit 4, regnet | S |
| Billederne efter landingen viser "a dry riverbed", og fra luften "traces of once flowing liquid" | Tomasko m.fl. 2005, *Nature* 438:765 (abstract åbnet i dag) | S. At væsken var metan, er forskernes tolkning: skriv "nok" |
| Signalet var over en time om at nå Jorden | regnet: kl. ca. 11.38 UTC ved Titan og 12.43 UTC på Jorden (faktafilen, Fable E5). Saturn var ca. 8 AU fra Jorden (ca. 67 lysminutter) | RS. Skriv "over en time", ikke minuttallet |
| Is er lettere end vand og flyder (ca. 0,92 mod 1,00 g/cm³) | almindelig fysik | S |
| Photojournal skriver credit "NASA/JPL/ESA/University of Arizona" ved PIA07232 og PIA07236 | NASA Photojournal (åbnet i dag) | S. Vi bruger ESA's rækkefølge, som I valgte |

**Ny fælde fundet under tjekket** (står nu også i [fakta-faelder-liv.md](erfaringer/fakta-faelder-liv.md)): "Huygens kom ud af disen 30 km over jorden." Tomasko m.fl. 2005 skriver, at disen kun bliver lidt tættere fra 150 km og ned, "with no clear space below the tropopause". Disen er der hele vejen. ESA's 30 km er, hvor kameraet kunne *se jorden* gennem den. Skriv "kunne se jorden fra ca. 30 km", ikke "kom ud af disen".

**Skal tjekkes, når der bygges:** højden for hvert billede fra luften (M5a), om Europa Clipper fløj forbi Jorden 3. december 2026 som planlagt (faktafilen afsnit 8), og ESA's planer for Enceladus (raketten skulle findes igen i 2026). *Kan tjekkes af Fable senere:* tavlens farver (er "Månen vugger" og "Magnetfeltet" grønne nok?), og om "nok gravet af flydende metan" er for skarpt.

## 17. Solsystemets filer: læse, ikke ændre
Sporet **læser** og **bruger** (importerer) disse filer, men **ændrer dem ikke** uden et go (Solsystemet-sporet ejer dem, se [kode/solsystem.md](kode/solsystem.md), [kode/saturn.md](kode/saturn.md), [kode/jupiter.md](kode/jupiter.md), [kode/venus.md](kode/venus.md) og [kode/staa-paa-mars.md](kode/staa-paa-mars.md)):

| Fil | Hvad sporet bruger den til |
|---|---|
| `js/solsystem/fontaener.js` (`lavEnceladus`) | Enceladus med tigerstriberne og fontænerne i modlys (trin 3). Snittet laves i sporets egen `js/maaner/snit.js`, for fontaener.js' shader har ingen klippeplaner |
| `js/solsystem/maane.js` (`lavIsmåne`) og `maane-form.js` | Europa som iskugle med kortet, og Enceladus' form |
| `js/solsystem/atmosfaere.js` (`lavTitan`, `lavLuft`) | Titans orange dis |
| `js/solsystem/hent.js` | Hente kortene (Europa, Enceladus, Titan) og Huygens' billeder |
| `js/solsystem/navne.js`, `rejse.js`, `flyby.js` | Kontakten "Navne" og kameraets rejse mellem månerne (CLAUDE.md: nye måner bruger dem) |
| `js/solsystem/landskab.js` og `panorama.js` | Kun læst: hvordan lyset og eksponeringen er lavet i Stå på Mars, hvis billedet fra Titans jord skal have samme toning. Bruges ikke direkte (ingen gåtur) |
| `js/kosmos/venus-ned.js` og `js/data/luft-venus.js` | **Mønstret** for nedstigningen: planen efter tiden (`lavPlan`, `nedHøjde`), trinene, bladring, måleren med søjlen og underteksterne i loggen. Ligner sporets nedtur over halvdelen af Venus' kode, så spørges der, før en fælles `js/solsystem/nedtur.js` laves (spørgsmål 6) |
| `js/kosmos/saturn.js`, `js/kosmos/jupiter.js` | Kun læst: månernes størrelse, kort og lys, så de ser ens ud begge steder |
| `js/faenomenskaerm.js`, `js/forloeb.js`, `js/lag.js`, `js/sideknap.js`, `js/kontakt.js`, `js/pause.js`, `js/scene3d.js` | De fælles klodser. Bruges, ændres ikke (de to første ejes af Solsystemet og Forløb, scene3d.js rettes i Grafik G2 lige nu) |

**Sporet må ændre (sin egen linje, efter et go):** listen i `js/solsystem.js` (to fænomener), `FÆNOMEN_IDER` i `js/data/faenomener.js` (samme rækkefølge, testen `skaermliste.mjs` tjekker det), `js/data/forloeb/liste.js` (to forløb), `js/data/ordbog.js` (tre ord, efter alfabetet), linkene i `js/data/sider/jupiter.js` og `saturn.js` (afsnit 11), sin egen blok i `style.css` og hjælpen i `index.html`.

**Rør ikke:** Grafik G2's filer (Småting kører den nu: `js/scene3d.js`, gløden og kantudglatningen, `docs/plan-grafik.md`), Venus' og Mars' filer og alt andet i `js/solsystem/` og `js/kosmos/`.

## 18. Byggeriet (et go pr. trin)
*Model: Opus, høj effort. Én session pr. trin, prompten skrives i [lige-nu/maaner.md](lige-nu/maaner.md). Status "prøve", til jeres søn har prøvet.*
- [x] **M1: Drejebogen** (denne fil, 20. november 2026).
- [x] **M2: "Under isen", del 1** (mellem-stor, lavet 20. november 2026, status prøve, [kode/maaner.md](kode/maaner.md)). Kernesætningen i M2 er midlertidig (kun Europa). Fænomenet står under Saturn ("Forsøg") i stedet for som en egen klode, så gitteret med kloderne er uændret. Fænomenet `underisen` med Europa og Enceladus side om side, snittet med lagene og lupen (`js/maaner/snit.js`), magnetfeltet med kontakten "Hav", forløbets trin 1-2 og linjerne i `solsystem.js`, `faenomener.js` og `liste.js`. Ordet `magnetfelt` (hvis Strøm ikke har lavet det). Tests: fænomenet åbner, snittet når helt igennem, trin 1-2 kan spoles, konsollen er ren.
- [x] **M3: "Under isen", del 2** (mellem, lavet 20. november 2026, status prøve, [kode/maaner.md](kode/maaner.md)). Valget af måne står i bjælken, ikke i Styr-boksen (jeres svar 8 i afsnit 19). Enceladus' hav er tegnet ca. 47 km (Čadek m.fl. 2016: kernen 180-185 km, isen 18-22 km). Fontænerne i modlys og snittet gennem Enceladus (trin 3), tavlen med kortene (`js/maaner/tavle.js`, data i `js/data/maaner/tavle.js`, testet i Node: hvert kort har én række og én farve), Cassini i buen (trin 4), trin 5, "Det så du", laboratoriet, panelet, "Hvordan ved vi det?", ordet `fontæne`, linkene ved Europa og Enceladus (go fra Solsystemet). Skærmbilleder på telefon og tablet (tavlen under scenen).
- [x] **M4: Flyv gennem fontænen** (mellem, lavet 20. november 2026, status prøve, afsnit 6a og [kode/maaner.md](kode/maaner.md)). Man sidder bag Cassini og flyver gennem sprøjtet, styrer højden og fanger korn og gas, og de fire kort falder ud. `fontaener.js` er brugt, ikke ændret. Trin 4's Gør er flyveturen, laboratoriet har handlingen, og "Det så du" har vejen.
- [ ] **M5a: "Land med Huygens", nedstigningen** (mellem). Fænomenet `landhuygens`, Titan med disen, Cassini og Huygens, trin 1-2, nedturen med uret og højdemåleren (`js/maaner/nedtur.js`), "Huygens' kamera" med billederne fra luften, `lav_huygens.py` og rækkerne i `KILDER.md`.
- [ ] **M5b: "Land med Huygens", landingen** (lille til mellem). Trin 3-4, farvebilledet med stenene, kanal A og B, "Det så du", ordet `metan`, linket ved Titan, laboratoriet og testene.

## 19. Spørgsmål til jer (anbefalingen først)
*Stilles som en dialog med valgmuligheder. Jeres svar skrives nedenfor.*
1. **Hvor bor det?** To nye fænomener i Solsystemet lige efter Saturn, "Under isen" og "Land med Huygens" (anbefalet: månerne er der allerede, og man kan gå direkte fra Europa, Enceladus og Titan). Eller en egen del "Månerne" i Rummet.
2. **Kernesætningen til "Land med Huygens":** A (anbefalet: floderne, stenene af is, den eneste landing så langt ude og de tabte billeder) eller B (kortere, uden de tabte billeder).
3. **Trin 4 i "Under isen" før flyveturen findes:** en lille Cassini, der flyver i en bue gennem sprøjtet, og fire kort, man lægger på tavlen (anbefalet: så får forløbet sin slutning nu, og flyveturen i M4 gør trinnet større bagefter). Eller vent med trin 4 og 5, til flyveturen er bygget.
4. **Billedet fra Titans jord:** ESA's rigtige farvebillede fylder scenen, og man trykker på stenene (anbefalet: rigtige data, og I sagde nej til en gåtur). Eller en lille 3D-jord tegnet efter billedet.
5. **Titan på tavlen:** Ikke nu, Titan har sit eget forløb (anbefalet: tavlen er til de to måner med vand, og Titans vand er metan). Eller en tredje søjle, når "Land med Huygens" er taget.
6. **Nedturen:** Byg Huygens' nedtur i sporets egen fil efter mønstret fra Venus' tur ned, og spørg Solsystemet, hvis over halvdelen er ens, før en fælles fil laves (anbefalet). Eller lav en fælles `js/solsystem/nedtur.js` fra starten (rører Venus, kræver Solsystemets go).

**Jeres svar 20. november 2026: "Ja til anbefalinger."** Det betyder: 1) to fænomener i Solsystemet lige efter Saturn, `underisen` og `landhuygens` (ingen ny del i menuen), 2) kernesætning A til "Land med Huygens", 3) en lille Cassini i en bue i trin 4 nu, og flyveturen (M4) gør trinnet større bagefter, 4) ESA's farvebillede fylder scenen ved landingen, ingen 3D-jord, 5) Titan får ikke en søjle på tavlen nu. **Titan og "Land med Huygens" bygges stadig** (jeres tilføjelse: "Den skal selvfølgelig stadig laves, men kan fint være sin egen session"): M5a og M5b er hver sin session. Spørgsmål 5 handlede kun om tavlen i "Under isen". 6) Nedturen bygges i sporets egen fil efter mønstret fra Venus' tur ned, og M5a spørger, hvis over halvdelen er ens.

**Jeres svar 20. november 2026 (M3):** 7) Linkene "Se under isen ›" ved Europa (`js/data/sider/jupiter.js`) og Enceladus (`js/data/sider/saturn.js`) må sættes ind (jeres go som ejer af Solsystemet). 8) Laboratoriets valg Europa / Enceladus / Begge står som tre handlinger i bjælken (den måne, man ser på, er grå), og et tryk på en måne flyver hen til den. Styr-boksen kan kun have kontakter og skydere, og et forsøg kan ikke have steder i træet uden at ændre `faenomenskaerm.js`.
