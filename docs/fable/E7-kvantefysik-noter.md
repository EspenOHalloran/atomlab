# E7: Opus' noter til Fables faktagrundlag og drejebog for Kvantefysik

*Skrevet 13. november 2026 af Opus efter "Efter Fables svar" i [prompt-fable-kvantefysik.md](../prompt-fable-kvantefysik.md). Læst helt: [fakta-kvantefysik.md](../fakta-kvantefysik.md), [fakta-kvantefysik/kvantecomputeren.md](../fakta-kvantefysik/kvantecomputeren.md) og [drejebog-kvantefysik.md](../drejebog-kvantefysik.md). Tjekket i koden: `js/data/hvorfor.js` (`skaller`, `orbitaler`, `tunnel`), `js/data/ordbog.js`, `js/data/orbitaler.js` (`prøver`), `js/fusion.js` (`BAKKE` og grafens tekst) og `index.html` (hjælpen i Stjerneovnen). Fables filer er ikke rettet. Det, der står her, gælder, når Opus bygger.*

## Kort
Faktagrundlaget er solidt og godt skåret til. Det holder målt og fortolkning adskilt, og fælderne er de rigtige. Jeg har regnet de fleste af Fables tal efter (bølgelængden og farten ved 50 kV, fodbolden, atomets fald på 1,6 × 10⁻¹¹ s, Gamow-tallene, 10⁻¹⁷⁶, guldets 58 % af lysets fart og hårets bredde i g-faktoren), og de passer. Opdelingen i fire forløb og at orbitalerne er laboratoriet til forløb 2 og ikke et femte emne, er jeg enig i.

**Men drejebogen har tre fejl, der skal rettes, før der bygges** (afsnit 3, punkt 1-3), og to forløb er for store (punkt 4-5). Ingen af dem er alvorlige, men punkt 1 og 2 ville lære barnet noget forkert.

## 1. Det nye (det, vi ikke havde før)
- **Forsøgene bag bænken:** Hitachi 1989 (én elektron ad gangen, ca. 20 minutter) og Bach m.fl. 2013 (rigtige sprækker og en skyder, der lukker dem). Det giver "Ærligt talt" noget konkret at sige.
- **"Ingen behøver at kigge":** De varme C₇₀-molekyler (2004) mister striberne, fordi deres egen varmestråling røber vejen. Det er det bedste svar på fælden om bevidstheden, vi har.
- **Rekorden fra januar 2026:** striber med klumper på over 7.000 atomer. Det gør Gåde-kortet "Hvor stopper kvanteverdenen?" aktuelt.
- **Tunneleffekten er ikke hele forklaringen på, at Solen brænder langsomt.** Den svage kernekraft står for det meste af ventetiden. Det er nyt for programmet og vigtigt, fordi det er nemt at skrive forkert.
- **Kvantefysik i hverdagen:** telefonens hukommelse, tunnelmikroskopet, atomuret og guldets farve (relativitet). Godt stof til "I din hverdag" og "Hvorfor?"-kort.
- **Nobelprisen 2025** binder energitrin, tunneleffekten og de superledende qubits sammen. Det er en fin rød tråd til forløb 4.
- **Modellerne til Opus** (mønstret på bagvæggen og chancen for at tunnelere) og forslaget om at trække prikkerne som `prøver` i `js/data/orbitaler.js` gør det, så de kan bygges uden at gætte.
- **Kvantecomputeren med datoer** i en egen fil, og en klar liste over, hvad der skal slås op igen.

## 2. Det, jeg er enig i
- **Fire forløb, ét ad gangen, og prøv forløb 1 med sønnen først.** Det følger reglen "prøv før næste".
- **Elektronen tegnes ikke på vej** (spørgsmål 2, valg a). En flyvende kugle lærer netop det billede, forløbet skal af med.
- **Trin 4 i forløb 1 (luk en sprække, og der kommer *flere*)** er forløbets stærkeste trin. Det kan kun en bølge forklare, og det kan *gøres*.
- **Gåde-kortet med spørgsmålet "Hvor stopper kvanteverdenen?"** og ikke "Hvad betyder det?". Det har et forsøg, og det andet er filosofi.
- **Orbitalerne:** ikke mere fysik i skyen, men "én orbital ad gangen", en energistige og tre linjer i "Ærligt talt".

## 3. Det, der skal rettes i drejebogen, når der bygges
1. **Trin 5 i forløb 1 lover "to brede bunker, der flyder sammen".** Fables egen model siger noget andet. Med måler er mønstret summen af to enkelte sprækker, og langt fra sprækkerne ligger de to oven i hinanden. Det giver **én** bred bunke, ikke to (se også Bach m.fl.: sprækkerne var 62 nm brede med 272 nm imellem, så bunkerne kan ikke skilles ad). Kuglerne i trin 1 gav to striber, så barnet vil forvente "som kuglerne" og ser noget andet. **Sådan:** "Så" siger *"Måleren finder altid en hel elektron ved én sprække. Men nu er de mørke striber væk."* Skriv ikke "som kuglerne", og tegn den ene brede bunke, formlen giver. Testen ("ingen mørke striber inden for den brede bunke") passer allerede.
2. **"Ærligt talt" siger: "Bølgen er regnestykket for chancerne."** Det er Københavnerfortolkningen. I pilotbølgen og mange verdener er bølgen virkelig. Det bryder Fables egen regel om at holde målt og fortolkning adskilt. **Skriv i stedet:** *"Bølgen kan ikke ses direkte. Man ser kun, hvor elektronerne lander, og bølgen fortæller, hvor chancen er stor."*
3. **Trin 4 i forløb 3 siger: "protonerne er flere hundrede gange for langsomme".** Det er **energien**, der er ca. 400 gange for lille (som i [fakta-ordbog.md](../fakta-ordbog.md)). Farten er kun ca. 20 gange for lille (√400). **Skriv:** "har flere hundrede gange for lidt energi" eller "er ca. 20 gange for langsomme". **Det, der findes i dag:** Grafen i Stjerneovnen skriver "26 % af protonerne er hurtige nok … til at komme over frastødningens bakke" (`js/fusion.js` linje 445) uden "i spillet", mens `HVORFOR.tunnel` siger "langt fra hurtige nok". Hjælpen har et "Ærligt talt", men grafens egen tekst mangler det. Det er en lille rettelse, der kan laves for sig selv (se afsnit 5).
4. **Forløb 2 er for stort.** Kernesætningen har tre "derfor", og forløbet har fem trin og fire nye ord. Det er mere end "én idé" (skabelonens regel, som Fable selv bruger i afsnit 2). **Forslag:** Kernen er "bølgen spærret inde giver trin, og der er intet lavere trin". Natriums gule lys bliver "Så" i trin 3 (én linje) eller vejen videre til Lys, ikke et eget trin. "Orbital" og "elektronsky" er ikke med i nogen af trinene, så de hører til laboratoriet (Værkstedet), ikke til forløbets ord.
5. **Trin 4 i forløb 2 viser kun halvdelen.** "Pres bølgen sammen, og se energien stige" er rigtigt, men forklaringen er en balance. Klemt sammen stiger bevægelsesenergien, og bredt ud ligger elektronen længere fra kernen og har mere energi den vej. **Gør i stedet:** en skyder for skyens størrelse og en måler for den samlede energi, der har en bund (en dal). Man finder selv bunden, og den er det nederste trin. **Gættet "Den er for hurtig"** er halvt rigtigt: Elektronen *er* hurtig, netop fordi den er klemt sammen. Det er forvirrende at kalde det det forkerte svar. Brug fx *"Den kredser så hurtigt, at den ikke falder (som Månen)"* / *"Der er ikke noget lavere trin"*.
6. **Trin 4 i forløb 4 (sammenfiltring) viser ikke noget kvante.** "Svarene passer altid sammen, og man kan ikke bestemme sit eget" gælder også for to sokker, der er lagt i hver sin kasse. Uden Bells forsøg lærer trinet netop "de har aftalt svarene hjemmefra", som Fables egen tabel (afsnit 6) siger er forkert, og Bells forsøg er for svært til et trin. **Forslag:** Flyt sammenfiltring til et "Hvorfor?"-kort i forløb 4. Kernesætningen bruger den ikke, og forløbet går fra fem til fire nye ord.
7. **Reglen om højst to sætninger på skærmen** brydes flere steder i forløb 1 (fx Spørg i trin 3 og Så i trin 3 og 4 har tre eller fire sætninger). Det rettes, når teksterne skrives. Det ændrer ikke noget i trinene.
8. **Energistigen i Værkstedet** skal stå i scenen, ikke i infopanelet (reglen: ingen scrollbar), og prøves ved 560 px bredde og under 500 px højde.

## 4. Fakta, der skal slås op igen, før teksten skrives
Ud over Fables egen liste ("Tjek igen", afsnit 9):
- **"Billeder, der ligner orbitaler, i strontium med et elektronmikroskop"** kender jeg ikke. Det kendte eksempel er "kvantemikroskopet", der i 2013 tog billeder af knuderne i hydrogens bølge (Stodolna m.fl., Physical Review Letters 110, 213001, fra min hukommelse). Slå begge op, før én af dem bruges.
- **"Teori og måling er enige til 1 del ud af 10¹²"** (elektronens magnetisme): Målingen er så præcis, men sammenligningen afhænger af finstrukturkonstanten, og de to bedste målinger af den er uenige med hinanden. Skriv "ca. tolv cifre", som Fables forslag til barnet allerede gør, og ikke et præcist tal.
- **Tunneltiden for rubidium:** Fable skriver 0,62 ms, men jeg husker 0,61 ms (Ramos m.fl. 2020). Det har ingen betydning i lag 1. Slå det op, hvis tallet bruges.
- **"I 2024 regnede Google selv med 6 sekunder"** for Sycamores opgave fra 2019: Jeg kan ikke sige, om det var Google eller en anden gruppe. Skriv "sekunder" uden at nævne hvem, eller slå det op.
- **Donadi m.fl.** (testen af Penroses idé) udkom i Nature Physics i 2020 (bind 17 er dateret 2021). Fables arXiv-nummer ser senere ud end artiklen. Tjek det, før det bruges som kilde.
- **Domænerne, Fable ikke fik åbnet** (research.google, blog.google, csrc.nist.gov og scottaaronson.blog), betyder, at Willows "10²⁵ år" og NIST's datoer kun er fra Wikipedia og hukommelsen. Det er nok til faktagrundlaget, men forløb 4 slår dem op igen.

## 5. Små ting, der kan laves nu, uden at Kvantefysik er bygget
- **"Orbital" mangler i Ordbogen**, men står i `HVORFOR.orbitaler` (Fable har ret, tjekket). En linje i `js/data/ordbog.js` skrevet ud fra fælden "orbitalen er ikke en bane" (fakta afsnit 7).
- **Grafen i Stjerneovnen:** "i spillet" ind i teksten i `js/fusion.js` linje 445, så den ikke siger det modsatte af `HVORFOR.tunnel` (punkt 3 ovenfor).
- Begge er små opgaver til `smaating.md`. De skal igennem `/faktatjek` og `--ændret` som alt andet.

## 6. Spørgsmålene i drejebogen
Fables fem spørgsmål blev stillet til jer 13. november 2026, og I valgte anbefalingen (a) i alle fem. Svarene står i drejebogen under "Jeres svar", sammen med mine tilføjelser (forløb 2 gøres mindre, og sammenfiltring flyttes ud af forløb 4). Det, jeg tilføjede til spørgsmålene:
- **Spørgsmål 3 (energitrinene):** Køreplanen siger "Strøm og magneter, så Lys, så Kvantefysik". Lys kommer altså **før**. Fables valg a (Kvantefysik ejer *hvorfor*, Lys ejer *hvad*) passer stadig, men værktøjet "Elektronens trin" i Værkstedet ([fakta-strom-og-lys.md](../fakta-strom-og-lys.md) afsnit 9, punkt 3) bliver bygget af Lys, og forløb 2 bruger det bagefter.
- **Spørgsmål 5 (kvantecomputeren):** Fable kan ikke slå tallene op igen efter 16. november 2026, så det gør Opus, når forløb 4 bygges. Det taler for at vente (valg a), fordi tallene ellers skal slås op to gange.
