# Drejebog: Liv, forløb 3-5 (Kopien, Fejlen, der hjalp og Begyndelsen)

*Skrevet af Fable 14. november 2026 ([fable/E10-liv-drejebog.md](fable/E10-liv-drejebog.md)) efter [prompt-fable-liv-l3-l6.md](prompt-fable-liv-l3-l6.md) og [skabelonen](fable/E3-forloeb.md). Flyttet hertil og **rettet 14. november 2026** efter Opus' noter ([fable/E10-liv-noter.md](fable/E10-liv-noter.md)) og jeres svar. Forløb 1 og 2 står i [fable/E3-liv-drejebog.md](fable/E3-liv-drejebog.md). Planen og trinene L3-L6 står i [plan-liv.md](plan-liv.md), afsnit 7. Faktagrundlaget er [fakta-liv/dna-opskriften.md](fakta-liv/dna-opskriften.md) og [fakta-liv/begyndelsen.md](fakta-liv/begyndelsen.md). Teksterne er udkast: De faktatjekkes, når de skrives. Hvert forløb får sit eget go.*

## 1. Rækkefølgen
- **Tre nye forløb:** 3 "Kopien" (L3), 4 "Fejlen, der hjalp" (L4) og 5 "Begyndelsen" (L5, en egen del i verdenen Liv). Liv i rummet bliver ikke et forløb, men ét kort på Mars (L6).
- **En trappe:** parrene (forløb 1), ordene (forløb 2), kopien, fejlene og udvalget, og til sidst begyndelsen. Begyndelsens sidste trin ("noget, der kopierer sig selv og kan udvikle sig") kan kun forstås, når man har prøvet kopien og udvalget.
- **Det er "cellen", der gør det,** som i forløb 2: ingen helikase, polymerase eller kopigaffel i forløbene. Nye fagord i alt: fire (antibiotika, naturligt udvalg, hinde og RNA).

## 2. Forløb 3: "Kopien" (L3, ca. 4 minutter)
**Kernesætning:** *"Før en celle deler sig, lyner den stigen op og bygger en ny side på hver halvdel. Næsten alle fejl bliver rettet. De få, der bliver, er mutationer, og jeg har selv nogle, mine forældre ikke har."*

**Scenen:** Stigen lige ud med begge sider, tegnet som i forløb 2 (`'ord'`-tilstanden i `js/liv/protein.js`), men med **12 trin**, så alt kan ses på tablet på højkant. Gamle sider har én farve, nye en lysere. Fra trin 3 står et lille skilt i scenen: "Her: ca. 1 fejl pr. 30 bogstaver. I dig: under 1 pr. milliard."

| Trin | Spørg | Gør | Så |
|---|---|---|---|
| 1 | *Gæt:* En celle skal blive til to, og begge skal have hele opskriften. Hvordan? (klipper stigen over på midten / lyner den op på langs / bygger en ny fra bunden) | Træk lynlåsen hen ad stigen | Stigen lyner op på langs. Bogstaverne slipper let hinanden, og nu er der to halve stiger. |
| 2 | Hver halvdel mangler sin anden side. Du kender reglen. | Sæt det første bogstav på hver halvdel. Cellen bygger resten | To ens stiger. Hver har én gammel side og én ny. |
| 3 | *Gæt:* Cellen kopierer hurtigt. Hvad sker der, når et forkert bogstav kommer på? (det bliver siddende / cellen retter det / kopien går i stykker) | Find det par, der ikke passer, og tryk på det | Cellen mærker, at parret ikke passer. Den klipper bogstavet af og sætter det rigtige på. Næsten alle fejl rettes. |
| 4 | *Gæt:* Hvor tit slipper en fejl alligevel igennem? (1 ud af tusind / 1 ud af en million / under 1 ud af en milliard) | Kopiér stigen igen, til en fejl bliver siddende (senest tredje gang) | Under én pr. milliard bogstaver. En fejl, der bliver, er en mutation. Du har selv ca. 70, dine forældre ikke har. |
| 5 | **Det så du:** kernesætningen og linjen "De fleste af dine 70 gør ingenting." | *Næste forløb: Fejlen, der hjalp ›* (når L4 findes) · *Leg frit: Kopien* · *Hvordan ved vi det?* (kort 3) | |

- **Wow:** "Du har ca. 70 stavefejl, som hverken din mor eller far har."
- **For nørder ved trin 4** (og i kort 2): "Hvordan kan det blive til 70? Cellerne, der blev til sæd og æg, har delt sig mange gange, før du blev til, og jo ældre faren er, jo flere. Og nogle fejl er skader, ikke kopifejl." Antallet af delinger slås op ved `/faktatjek`, ellers skrives det uden tal.
- **Ærligt talt:** Fejlene kommer meget oftere her end i virkeligheden (skiltet siger det). Den ene nye side bygges i virkeligheden i små stykker, her er de tegnet ens. Stigen er snoet i virkeligheden, her ligger den lige ud.
- **Leg frit: Kopien:** Lynlåsen og "Kopiér igen" uden trin. Panelet har to tal: farten (ca. 25 bogstaver i sekundet ét sted) og "8 år med én lynlås, derfor titusindvis på én gang". Resten af tallene (bakterier ca. 1.000 i sekundet, 30.000-50.000 startsteder, "nogle timer") og fagordene (helikase, DNA-polymerase, kopigaffel) står i "For nørder". **Én ★-opgave:** "Find en mutation, der blev" (`liv-mutation`, jeres valg). Opgaven bliver ikke løst i forløbet, som de andre opgaver i Liv.
- **Rettelse i appen:** "Ærligt talt" i Liv (`index.html`, linje 820) siger, at parret "buler", og at G–T er "en af de almindeligste fejl". Begge dele er usikre (Kimsey m.fl. 2018, Fables E10, afsnit 4). Nyt forslag: "I virkeligheden kan G og T godt holde lidt sammen. Det er en af de fejl, der kan ske, når DNA bliver kopieret, og cellen retter de fleste." Kommentaren i `js/data/forloeb/opskriften.js` (linje 48) rettes med. **Lavet 16. november 2026** (sammen med højre panel, før L3).

## 3. Forløb 4: "Fejlen, der hjalp" (L4, ca. 4 minutter)
**Kernesætning:** *"Kopien laver tilfældige fejl. En sjælden gang hjælper en fejl, og så får den, der har den, flere efterkommere. Det er naturligt udvalg, og sådan har livet udviklet sig."*

**Scenen:** En plade set fra oven, efter et rigtigt forsøg (Baym m.fl. 2016): et lyst felt uden medicin og bånd med mere og mere antibiotika. Bakterierne er prikker, og dem med en fejl har en anden farve. Én InstancedMesh eller et 2D-lærred, en fast tilfældighed (stabile tests) og færre prikker med `LAV_KVALITET`. Størrelse: mellem (ny tegning).

| Trin | Spørg | Gør | Så | Ord |
|---|---|---|---|---|
| 1 | *Gæt:* En bakterie deler sig hvert 20. minut. Hvor mange er der efter 10 timer? (30 / ca. 1.000 / over en milliard) | Sæt en bakterie på pladen | Over en milliard, hvis der er mad nok. Hver deling er en kopi, og nogle få kopier har en fejl. | – |
| 2 | *Gæt:* Det mørke bånd har antibiotika, medicin der dræber bakterier. Hvad sker der ved kanten? (alle stopper / de vænner sig til den / nogle få kommer igennem) | Tryk på det sted, hvor de bryder igennem | Næsten alle stopper. Én havde en fejl, der beskytter den, og kun dens efterkommere vokser videre. | antibiotika |
| 3 | Næste bånd er ti gange stærkere, og det næste igen. Kan de blive ved? | Tryk på hver ny gren, der bryder igennem, til de når midten | Fejl oven på fejl. I det rigtige forsøg nåede de båndet med 3.000 gange så meget medicin på ca. 10 dage. | – |
| 4 | *Gæt:* Var det medicinen, der fik bakterierne til at ændre sig? (ja / nej) | Find en bakterie med fejlen, der aldrig har rørt medicinen, og tryk på den | Nej. Fejlene kom tilfældigt. Medicinen afgjorde kun, hvem der kom videre. Det hedder naturligt udvalg. | naturligt udvalg |
| 5 | **Det så du:** kernesætningen | *Næste: Begyndelsen ›* (når L5 findes) · *Leg frit: pladen* · *Sker det også hos mennesker?* (kort 4) | | |

- **Wow:** grenene, der bryder gennem muren som en vifte. Han har set evolution ske på et minut.
- **Bakterier, ikke seglcellen:** Man kan se det ske, ingen mennesker dør i scenen, og trin 4 rammer den almindeligste misforståelse ("de vænner sig til det"). Seglcellen står i kort 4.
- **Ærligt talt:** Den rigtige plade var 120 × 60 cm med milliarder af bakterier. Her er der få, og fejlene kommer oftere. Bakterierne med fejlen i feltet uden medicin kunne man ikke se på den rigtige plade: Her har de en farve, så man kan finde dem. Evolution er ikke kun udvalg: Tilfældigheder spiller også ind ("For nørder").
- **Nye ord i Ordbogen:** antibiotika og naturligt udvalg.
- **Bygget 17. november 2026 (L4)** med to ændringer: Pladen er den ene halvdel af den rigtige (feltet uden medicin til venstre, det stærkeste bånd til højre, "Ærligt talt" siger det), så trin 3 siger "til de når det sidste bånd". Trin 2's Så siger "Kun de få med en fejl …" i stedet for "Én havde en fejl", fordi pladen (og forsøget) ofte har flere grene. "Leg frit: pladen" har kontakten "Uden mellemtrin" (artiklens fig. 2) og ★-opgaven "Spring båndene over".

## 4. Forløb 5: "Begyndelsen" (L5, ca. 5 minutter, egen del i verdenen Liv)
**Kernesætning:** *"Livets byggesten laver sig selv af gas og energi, og de findes også i rummet. Men ingen har lavet liv af dem, og ingen ved, hvordan det skete første gang."*

| Trin | Scenen | Spørg | Gør | Så | Ord |
|---|---|---|---|---|---|
| 1 | Millers kolbe: vand, der koger, og tre gasser som molekyler (metan og ammoniak fra "Del elektroner", hydrogen fra "Når atomer mødes") | *Gæt:* Tre gasser over kogende vand, som forskerne i 1953 troede den unge Jord havde. Hvad gør lynet? (ingenting / gasserne brænder af / der kommer nye stoffer i vandet) | Tryk ⚡ tre gange | Vandet farves. I det er der aminosyrer, byggestenene i dine proteiner, lavet af gas og lyn. Stanley Miller gjorde det i 1953. | – |
| 2 | Samme | *Gæt:* I dag tror mange forskere, at luften mest var CO₂ og nitrogen. Virker det stadig? (ja / nej) | Skift luften, og tryk ⚡ | Ja, men det afhænger af, hvad der ellers er i vandet. Ingen kender luften præcist. De samme byggesten er fundet i sten fra rummet. | – |
| 3 | Vandet tæt på | *Gæt:* En celle har en hinde om sig. Hvad gør fedtstoffer, når de kommer i vand? (flyder ovenpå / laver små bobler / opløses) | Dryp fedtstof i vandet | De samler sig selv til små bobler med vand indeni. Det er ikke en celle, men nu er der en inderside. | hinde |
| 4 | En kort RNA-kæde lige ud, kun én side | *Gæt:* Du har kopieret DNA med cellens hjælp. Kan et molekyle kopiere sig selv? (ja / næsten / nej) | Tryk "Kopiér", og hold øje med de røde fejl | Næsten. I 2026 byggede et lille RNA en kopi af sig selv: langsomt, med fejl og med forskernes hjælp. | RNA |
| 5 | Trappen med fem trin. De tre, han har lavet, lyser | Byggesten, hinde og en kopi, der næsten virker. Hvad mangler, før det er liv? | Tryk på det øverste trin | At det hele kører af sig selv og kan udvikle sig. Dér er ingen nået til. Ingen ved, hvordan det skete. | – |
| 6 | Trappen | **Det så du:** kernesætningen | *Leg frit: kolben og trappen* · *Hvornår skete det?* (kort) · *Er der liv andre steder? ›* (Gåden) | | |

- **Wow:** lyn i en flaske: Han laver selv livets byggesten. Og det øverste trin, der ikke kan trykkes færdigt.
- **Trappen er forløbets rygrad:** byggesten ✓, hinder ✓, kæder ½, en kopi ½ og en celle ✗. "Kæder" (ler, Ferris 1996) står i trappen, men er ikke et trin i forløbet. I laboratoriet har hvert trin **ét rigtigt forsøg** med årstal og kilde. Intet "bland ingredienserne" (jeres svar 14. november 2026).
- **Trin 2 (Opus' rettelse):** Fable skrev "færre", men Cleaves m.fl. 2008 fik mange aminosyrer med CO₂ og nitrogen, da vandet fik en buffer, og Parker m.fl. 2011 skriver "significant yields … can still be synthesized". Ordlyden faktatjekkes i L5.
- **Ærligt talt:** En uge er blevet til sekunder, og kemien har mange mellemtrin. Enkle hinder går let i stykker i saltvand. Det lille RNA (QT45) var 72 dage om det, i is, og de to halvdele af kopien blev lavet i hvert sit forsøg.
- **Kort i Begyndelsen (højst fire fremme ad gangen):** "Har nogen lavet liv?" (2010: et bygget genom i en bakterie, der levede i forvejen), "Kom livet fra rummet?", "Skete det i en dam eller på havbunden?" og "Hvornår skete det?" (døgnuret: livet senest kl. 5.36, mennesket ca. 6 sekunder før midnat). Tidslinjen bliver dette ene kort, ikke et panel.
- **En egen del:** en linje i `SKÆRME`, en knap i verdenens kort og sit eget modul (stor opgave).

## 5. "Hvorfor?"-kortene om DNA og naturligt udvalg (fem)
Hvert kort hænger på et sted, hvor man selv kan gøre det. Kort 1-3 bygges i L3, kort 4 og 5 i L4.
1. **Hvem fandt stigen?** (ved Stigen) "I 1953 byggede James Watson og Francis Crick modellen af stigen. De brugte Rosalind Franklins målinger uden at spørge hende. Hun var en ligeværdig del af arbejdet. Watson, Crick og Maurice Wilkins fik Nobelprisen i 1962. Franklin døde i 1958, kun 37 år."
2. **Hvorfor ligner jeg mine forældre, men ikke helt?** (ved Cellekernen) "Af de 46 tråde kom 23 fra din mor og 23 fra din far, så du har opskrifter fra dem begge. Hver af dem gav dig en ny blanding af deres egne. Og du har ca. 70 bogstaver, ingen af dem har." For nørder: "Hvordan kan det blive til 70?" (se forløb 3).
3. **Hvordan ved vi, at hver kopi har en gammel og en ny side?** (ved Kopien, "Hvordan ved vi det?") "I 1958 gav Meselson og Stahl bakterier tungt nitrogen, så deres DNA blev tungt. Så fik de almindeligt nitrogen. Efter én deling var alt DNA midt imellem: én tung side og én let. Efter to delinger var halvdelen midt imellem og halvdelen let."
4. **Sker det også hos mennesker?** (ved "Skift et bogstav" og efter forløb 4) "Ja. Skiftet i ord 7 giver seglcelleanæmi, hvis man har det fra begge forældre. Har man det kun fra den ene, bliver man sjældnere alvorligt syg af malaria. Hvor der er meget malaria, har bærerne derfor fået flere børn, der overlevede, og ændringen er blevet almindelig dér. Det er naturligt udvalg." **Træk fra:** Den sidste sætning under "For nørder" i `livSegl` ("Derfor er genet almindeligt …") flyttes hertil, og `livSegl` linker til kortet.
5. **Hvorfor kan de fleste danskere tåle mælk?** (ved forløb 4) "Alle små børn kan fordøje mælk. Hos mange mennesker slukker genet for det, når de bliver større. Ca. 94 af 100 voksne danskere har en ændring i en "kontakt" ved genet, så det bliver ved med at være tændt. Den blev almindelig i Europa for ca. 4.000 år siden. Forskerne er uenige om, hvorfor den hjalp så meget."

**Ikke med:** "Hvad er et gen?" og "Hvad laver proteinerne?" (Ordbogen), "Er DNA en tegning af kroppen?" (én linje i "Ærligt talt") og "Er det meste af DNA'et skrald?" (omstridt og uden noget at gøre: "For nørder"). `livSegl` og `livSammen` bliver.

## 6. Prøven og overlappet
- **Prøven:** Kan han sige de tre kernesætninger med egne ord? Det sværeste er forløb 4, trin 4: Lavede medicinen fejlen?
- **Gåden "Hvordan begyndte livet?"** fortæller det, forløb 5 lader ham gøre. **Kolben bygges én gang, i Liv** (jeres svar). Gåden beholder sine tre trin og får en knap til Begyndelsen (som `liv:protein` i dag). Rettet i [plan-gaader-3d.md](plan-gaader-3d.md) (G4e).
- **L6, kortet "Hvor sikkert er et spor?"** ved Cheyava Falls på Mars: de syv trin (CoLD-skalaen, Green m.fl. 2021, [plan-liv.md](plan-liv.md), afsnit 4) og meteoritten ALH84001 fra 1996. Gådekortet "Er der liv andre steder?" og Begyndelsen linker dertil. Bygges i sporet Molekyler lige efter L5 (jeres svar) og skriver kun i Cheyava Falls-blokken i `js/data/sider/mars.js`.

## 7. Det, der er skåret fra planen
| Fra planen | Hvorfor | I stedet |
|---|---|---|
| L3: en fjerde knap, fem tal i panelet og tre ★-opgaver | Det er laboratoriet før forløbet | Forløb 3 og "Leg frit: Kopien" med to tal og én ★-opgave |
| L5: "bland ingredienserne" (valg 4a, 9. november) | Hver blanding skal være et rigtigt forsøg, og der findes få | Ét rigtigt forsøg pr. trin |
| L4 og L5 hver for sig, tidslinjen som panel | Miller er trappens første trin | Ét forløb og ét kort |
| Fanerne Opskriften, Begyndelsen og Liv i rummet (valg 1a) | Liv har forløb i stedet for faner | Liv (forløb 1-4) og delen Begyndelsen |
| L6 som fane | Tre steder ville sige det samme | Ét kort på Mars og links |
| Tre af de otte kort, spejlbillederne, Viking, Venus og K2-18b | Læsestof uden noget at gøre | "For nørder" |

## 8. Fakta
Fables tabel med mærker og kilder står i [fable/E10-liv-drejebog.md](fable/E10-liv-drejebog.md), afsnit 4. Det, Opus har slået op 14. november 2026 (Millers tre gasser, vandets farve og pladen), står i noterne, afsnit 1. Fælderne står i [erfaringer/fakta-faelder-liv.md](erfaringer/fakta-faelder-liv.md). **Før L4:** antallet af delinger bag de ca. 70 og Luria og Delbrück 1943 (kun via Wikipedia). **Før L5:** Cleaves 2008, Lane og Martin 2012 (kun resuméet), Gibson 2010 (cellen blev ikke tømt først, kun efter hukommelsen) og at de fleste voksne i verden ikke tåler mælk (efter hukommelsen, bruges kun, hvis det slås op).
