# Noter til E8: Fables vurdering af Gåderne i 3D

*Skrevet 14. november 2026 af Opus (spor Småting). Fables fil er [E8-gaader-3d.md](E8-gaader-3d.md) og rettes ikke. Planen [plan-gaader-3d.md](../plan-gaader-3d.md) er rettet efter disse noter. Spørgsmålene til jer står til sidst og i planen.*

## 1. Det, jeg har slået op
| Fables påstand | Det, jeg fandt | Sikkerhed nu |
|---|---|---|
| Tyngdebølgen fra 2015 steg fra **35 til 250 Hz** (H) | Resuméet af arXiv:1602.03837: "The signal sweeps upwards in frequency from 35 to 250 Hz" | **S** |
| DUNE skyder neutrinoer ca. **1.300 km** gennem jorden (H) | Wikipedia "Deep Underground Neutrino Experiment": "1,300 kilometers (810 mi)" fra Fermilab til South Dakota | **RS** |
| Planens scener følger ikke kortenes tekster i tre af fem kort | Tjekket mod `js/data/gaader.js`: Fable har ret i alle tre (afsnit 2, punkt 7) | **S** |
| Mars og Enceladus er ca. 6.800 og 500 km (H) | Efter min viden 6.779 og 504 km. Ikke slået op, tjekkes, når scenen bygges (G4d) | **R** |

Resten af Fables (H) (BICEP2's støv, "137 er det sidste", Parker Solar Probe, status for 119 i Dubna) hører til kortene 6-10 og slås op, når de skrives. jinr.ru er stadig ikke åbent i miljøet.

## 2. Det, der er nyt, og som jeg er enig i
1. **G4a, som den stod, var en menu i 3D.** Ti symboler uden scener giver ingen undren, og I ville først se det vigtige efter G4b.
2. **Ét kort helt færdigt først**, så prøven med jeres søn, så resten.
3. **Én gåde i fokus langs en skinne** ("‹ mindre · større ›", som i menuen) med én knap, "Flyv ind". Det løser ti knapper på højkant og telefon, tastaturet og et tomt rum, man farer vild i. Fri drejning kun inde i en scene.
4. **Første gang står man foran en gåde, ikke foran et kort over dem.** Oversigtens wow ("Der er flere", lysene tændes) kommer, når man flyver ud.
5. **De slørede "?"-pladser tages ud.** "?" skal betyde "det ved ingen", ikke "det har vi ikke bygget".
6. **Tre slags streg** i stedet for sløring: målt, regnet ud eller gættet, og ingen ved det. Det er kernesætningen, man kan se (se punkt 4 i afsnit 3 om formen).
7. **Planens tabel mod teksterne:** Antistof trin 2 er den målte forskel, og trin 3 er Hyper-Kamiokande og DUNE. Livets begyndelse trin 1 er Miller og Bennu, og trin 3 er QT45. Mørkt stof trin 2 er LZ, og trin 3 er Euclid. Scenerne er skrevet om efter teksterne.
8. **Én stor scene pr. kort** med én ting til hånden i trin 1, kanten i trin 2 og et lille billede af redskabet med årstal i trin 3. 15 fulde scener ville blive dyre eller tynde, og 15 gæt i samme form bliver en quiz.
9. **Metoden i slutningen:** "Sig det til en ven: …" som sidste linje. Det er kernesætningens anden halvdel.
10. **Tilbage og Esc** går fra kort til sti, et tryk springer flyvningen over, "Næste gåde ›" fører videre, og "Se det selv" lander ved samme gåde, når man kommer tilbage.
11. **"Nyt siden sidst" og "Løst!" med dato** i data. Billigt, og 119 og Planet 9 kan blive løst.
12. **Højkant:** Mens han gætter, viser panelet kun spørgsmålet og valgene.
13. **"Pas på"-billederne** (antistof er ikke mørkt, mørkt stof er ikke et skær, havbunden er ikke livets begyndelse, ingen spids i midten) står allerede i [fakta-faelder.md](../erfaringer/fakta-faelder.md).
14. **Gåderne 6-10 og dem, der ikke bliver kort** (Hubble-spændingen, neutrinoens masse og tidens pil). Enig i valget. Om 119, se afsnit 3, punkt 8.

## 3. Hvor jeg er uenig eller vil lægge noget til
1. **Sort hul i 3D findes allerede i Kosmos.** Lysbøjningen, at flyve om hullet, og astronauten, der set udefra bliver langsommere og rødere og aldrig når ind ("højst ca. et minut"), står i `js/kosmos/sorthul.js`. Fables wow og kant er derfor for en stor del Kosmos igen, og "Se det selv" peger på det samme. Det nye ved kortet er tonen, de to kanter (horisonten, hvor målingen stopper, og midten, hvor teorien stopper) og LISA. **Derfor anbefaler jeg Antistof som det første kort:** Alt er nyt (antistof findes ikke i 3D andre steder), det er billigt (ingen shader), og "Du kan kun lave par" afprøver hele idéen på én gang: én ting til hånden, de tre slags streg (de to søjler) og "Alt, du kan se, er resten". Fables argument for Sort hul (linsen findes) er rigtigt for prisen, men den dyreste shader som det første på en ny skærm gør prøven på tabletten til en prøve af ydelsen, ikke af idéen. Sort hul bliver nr. 2 og bygger på linsen med kun det nye lagt til. **Spørgsmål 1.**
2. **Ringen: ikke nu.** Menuen er allerede en ring, så Gåderne ligner den. "Det mindste og det største mødes ved Big Bang" er en flot idé, men den skal forklares, og Big Bang er ikke selv en gåde. Med fem kort er en ring tynd. En skinne fra det mindste til det største nu (AtomLabs røde tråd), og koden laves, så stien kan lukkes til en ring, når der er 8-10 gåder. **Spørgsmål 2.**
3. **"Stien fortsætter ud i mørket" virker kun, hvis de manglende står for enden.** Det gør de ikke: 119 ligger mellem antistof og livets begyndelse, og kvanteverdenen før dem alle. **Sådan:** Kun de byggede står på skinnen, sorteret efter størrelse. En ny gåde rykker ind på sin plads. Svage lys uden navn og "Flere gåder er på vej" står i begge ender. Koden bruger ingen pladsnumre.
4. **De tre slags streg, sagt enklere: fuld farve = målt, stiplet hvid = ikke målt, men nogen har et bud (regnet ud eller gættet), intet = ingen har et bud.** Stemplet bliver ved to ord (MÅLT og GÆT), for kortene spørger "Målt eller gæt?". Tre ting mangler:
   - **En forklaring første gang** (én linje under scenen og i "Ærligt talt"). Ellers er stregerne bare pynt.
   - **Hullet skal have en kant.** Den stiplede streg løber hen til hullet og toner ud. Et hul uden kant læses som "der er ingenting", og det er en påstand, ikke "ingen ved det".
   - **Teknik:** WebGL tegner kun streger, der er 1 px tykke. Tykke stiplede streger kræver `Line2` og `LineMaterial` fra `three@0.186.1` (`examples/jsm/lines/`), kopieret til `lib/three/addons/lines/` (samme bibliotek, ingen ny pakke). Flader (en galakse, en planet) kan ikke være stiplede, de tegnes som hvide prikker eller et omrids uden fyld. Én fælles fil, `js/gaader/streg.js`, så alle scener ser ens ud.
5. **Tonen fra tyngdebølgen ligger for dybt** til en tablets højttaler (35 Hz høres næsten ikke). Den skal flyttes op (fx to oktaver), og "Ærligt talt" skal sige det. Tonen vises også som en kurve, der stiger, så den virker uden lyd.
6. **"Et tal, der vokser" i Sort hul er uklart** (hvilket tal?). Mit forslag: Vis kun "højst ca. 67 sekunder til midten (i Mælkevejens sorte hul)" fra nørd-teksten og "uendelig: her virker teorien ikke". Færre ting.
7. **Antistof:** Lys bliver kun til et par, hvis det har energi nok og er tæt på en atomkerne. Det skal stå i "Ærligt talt". Og én ud af en milliard kan ikke tegnes: Vis fx tusind par, og sig "i virkeligheden ca. én ud af en milliard" (fælde 10). Den stiplede søjle ("det, der skal til") går ud over skærmen, og størrelsen faktatjekkes, før den skrives.
8. **Grundstof 119 bør hedde "Hvor stopper det periodiske system?"** "Findes der et grundstof nr. 119?" kan blive løst næste måned (Dubna lovede svar i efteråret 2026), og så er kortet forældet, før det er bygget. At lave 119 er mest et spørgsmål om at skyde længe nok. Den egentlige gåde er, hvor langt systemet kan fortsætte, og om øen findes. Med det navn bliver et fund af 119 til "Nyt siden sidst", og kortet holder. 119 er krogen, og landskabet med øen er scenen. **Spørgsmål 4.**
9. **Liv andre steder, de 6.000 lys:** Står de, hvor planeterne rigtigt er, klumper de sig i Keplers lille felt på himlen. Det er ærligt og interessant, men kræver data fra NASA Exoplanet Archive (et domæne, der skal åbnes). Med tilfældige pladser skal "Ærligt talt" sige det. Afgøres i G4d, ikke nu.
10. **G4a, som Fable beskriver den (layoutet, flyvningen og en hel scene), er for stor til én session.** Den deles i to: G4a (panelet, stregerne, stemplet og hele det første kort, mens oversigten midlertidigt er den gamle liste) og G4b (skinnen, flyvningen, første gang og "Der er flere"). Prøven med jeres søn kommer efter G4b, for første gang hører med til det, der skal prøves.

## 4. Spørgsmål til jer (før G4a)
1. **Hvilket kort bygges helt færdigt først?** Min anbefaling: Antistof (alt nyt, billigt, afprøver idéen). Fable: Sort hul (det største wow, men meget findes i Kosmos).
2. **Oversigten:** en skinne fra det mindste til det største (min anbefaling), eller Fables ring.
3. **Venter de andre scener på prøven med jeres søn efter G4b?** Min anbefaling: ja. Det er én aften, og prøven er hele pointen med at bygge ét kort først.
4. **Gåde 6:** "Hvor stopper det periodiske system?" med 119 som krog (min anbefaling) eller Fables "Findes der et grundstof nr. 119?".

**Jeres svar (14. november 2026): alle fire anbefalinger.** Antistof først, en skinne, scenerne til de andre kort venter på prøven efter G4b, og gåde 6 hedder "Hvor stopper det periodiske system?". Planen er rettet.
