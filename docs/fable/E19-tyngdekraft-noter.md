# E19: Opus' noter til tyngdekraften som gåde

*17. november 2026, Opus. Læses sammen med [E19-tyngdekraft.md](E19-tyngdekraft.md). Tjekket mod `js/data/gaader.js`, `js/gaader.js`, `js/gaader/skinne.js`, `js/kosmos/rumtid.js` og [plan-gaader-3d.md](../plan-gaader-3d.md). Fables tal, der er regnet (**R**), er regnet efter her. Kilderne er ikke slået op igen: Det sker med `/faktatjek`, når teksten skrives. Kun dokumenter.*

## 1. Kort sagt
Jeg er enig med Fable i det store: "Ingen ved, hvorfor tyngdekraften trækker" er for groft, og den gode gåde er **"Hvordan virker tyngdekraften i det allermindste?"**. Det klareste svar på jeres eget spørgsmål står i afsnit 9: Einsteins teori siger, *at* stof krummer rumtiden, og præcis hvor meget, men ikke *hvorfor*. Det er ikke noget, I har overset. Jeg er uenig i én af Fables tre grunde til pladsen på skinnen (afsnit 4.1 nedenfor) og vil gøre "For nørder" i Rumtid enklere (4.3).

## 2. Det nye i E19
- **Jeres spørgsmål er Newtons eget.** Han skrev i 1713, at han ikke kendte grunden. Det er en god åbning, både i Rumtid og i et kort.
- **Svagheden er både det, der får en til at sige "wow", og forklaringen.** En køleskabsmagnet slår hele Jorden, og det er netop derfor, ingen har kunnet måle tyngdekraften fra noget mindre end ca. 90 mg (guldkuglerne, Wien 2021). Det binder trin 1 og trin 2 sammen uden fagord.
- **Broen til "Hvor stopper kvanteverdenen?":** Det ene kort spørger, hvor *stor* en ting kan være og stadig gå to veje, og det andet spørger, hvor *lille* en ting kan være, før ingen har målt dens tyngdekraft. Forsøget med de to diamanter er stedet, hvor de mødes. Det er en god grund til, at kortet venter på Kvantefysik forløb 1.
- **Listen:** Tre kort mangler den *samme* teori (Sort hul, Før Big Bang og Tyngdekraften). Det har vi ikke set før.
- **Rumtid har allerede den halve sætning.** "Ærligt talt" i `rumtid.js` (linje 41) siger, at det for langsomme ting mest er tidens krumning, der får dem til at falde. Det nye "Hvorfor?"-svar kan bygge videre på den, uden at noget gentages.

## 3. Tjekket mod koden og planen
| Fables påstand | Tjek | Status |
|---|---|---|
| Skinnen er sorteret efter `størrelse`, og −3 lander mellem Livets begyndelse og Liv andre steder | `begyndelsen` −8 og `liv` 7 (`gaader.js` data, `påSkinnen()` linje 423) | Rigtigt |
| Første gang står man foran det mindste | `fokusId = række[0]` (`js/gaader.js` linje 107) | Rigtigt. **Nyt:** Det rammer også **Kvanteverdenen**, som efter planen bliver den mindste. Når den bygges, ser en ny bruger den først, og ikke Antistof, som er det, der er prøvet. Første gang skal derfor sættes til `antistof` med navn, uanset tyngdekraften (skrevet i planen) |
| Rumtid har tre spørgsmål, og budgettet er fire | "Hvad er tyngdekraft så?", "Hvornår går en planet i bane?" og "Bøjer lys også?" (`rumtid.js` linje 25-33) | Rigtigt. Der er plads til ét |
| "Se det selv: Rumtid", og Rumtid får linket tilbage | Mørkt stof peger allerede på `kosmos:rumtid` (`gaader.js` linje 403), og "Bøjer lys også?" har allerede et link til Gåden om mørkt stof | Det går, men så peger to gåder på Rumtid. Linket i det nye svar sættes først på, når kortet findes (som Fable skriver) |
| De regnede tal | Elektrisk kraft mod tyngdekraft: 1,24 · 10³⁶ (to protoner), 2,27 · 10³⁹ og 4,17 · 10⁴². Guldkuglerne: ca. 9 · 10⁻¹⁴ N ved ca. 2,4 mm mellem midterne, ca. 5 · 10¹⁰ gange mindre end en clips på 0,5 g. Rumstationen: (6.371/6.771)² = 88,5 %. Diamanten: 1,5 · 10⁻¹⁴ kg og ca. 7 · 10¹¹ atomer. 10¹⁵ gange LHC | Regnet efter: alle passer. **Én mangler en afstand:** "to brintatomer: ca. 10⁻⁴⁴ N" gælder ved ca. 0,1 nm (1 Å). Uden afstanden er tallet meningsløst |

## 4. Hvor jeg er uenig eller vil skærpe
1. **Pladsen ved 2 mm.** Fables grund (c), at kortet ellers bliver det første, en ny bruger ser, falder bort, fordi første gang alligevel skal sættes til Antistof (afsnit 3). Grund (a) og (b) holder. Men der kommer en ny spænding fra E20: Får skinnen ord for skalaen under hvert navn ("mindre end et atom", "planeter"), kommer der til at stå "på et bord" under en gåde, der hedder "i det allermindste". Mit råd er stadig −3, fordi gåden begynder der, hvor målingerne stopper, men ordet under navnet skal sige det ("her stopper målingerne"). Det afgøres, når kortet bygges, ikke nu.
2. **Magneten og Jorden.** Det er det rigtige "wow", men en magnet er ikke "den elektriske kraft" for en 13-årig. Trin 1 skal sige det i én bisætning ("magnetisme og elektricitet er to sider af samme kraft") eller sammenligne to protoner i "Ærligt talt", som Fable selv foreslår (fælde 7). Højst to nye fagord pr. trin.
3. **"For nørder" i Rumtid skal være enklere end Fables.** "Einsteins ligning er en tilstandsligning" (Jacobson) og "rummet opstår" (Verlinde) er for tunge som navne. Én sætning holder og er ærlig: "Nogle forskere tror, at tyngdekraften kommer af noget endnu dybere, sådan som varme kommer af atomer, der bevæger sig. Det er bud, og ingen har kunnet prøve dem." Strengteori nævnes ikke. Skridtet om tiden ("ting falder den vej, tiden går langsomst") er rigtig fysik for langsomme ting, men det er et *hvordan* og ikke et *hvorfor*, og det skal svaret sige, så det ikke ser ud, som om spørgsmålet er besvaret. Begge dele skal gennem `/faktatjek` (E19 mærker dem **H**).
4. **"Før Big Bang" som reserve.** Enig. Den er den svageste på kernesætningens sidste halvdel ("hvordan forskerne prøver at løse den").
5. **Rækkefølgen.** Enig i, at trin 3 og scenen venter på Kvantefysik forløb 1. Jeg ville heller ikke lave kortet som data med trin 1-2 før: En halv gåde på skinnen bryder modellen fra prøven (én scene, ét kort, gæt, gør og se).

## 5. Hvad det betyder nu
- **Spørgsmålet i Rumtid har jeres go fra 16. november 2026** og er ikke bygget endnu (tjekket i `origin/main` 17. november 2026). Prompten står nederst i [prompt-fable-tyngdekraft.md](../prompt-fable-tyngdekraft.md). Punkt 3 ovenfor skal følge med (står nu i prompten).
- **Gåden** afgøres i jeres svar nedenfor.

## 6. Jeres svar (17. november 2026)
- **Gåden: Ja, på listen nu** (Opus' og Fables anbefaling): "Hvordan virker tyngdekraften i det allermindste?" står i tabellen i [plan-gaader-3d.md](../plan-gaader-3d.md) med status "Senere, efter Kvantefysik forløb 1". E19 og disse noter er faktagrundlaget. Intet bygges nu. Pladsen (−3 eller andet) og ordet under navnet afgøres, når kortet bygges.
- **Listen: 11 gåder** (ikke anbefalingen): "Hvad var der før Big Bang?" bliver på listen. Skinnen skal derfor kunne bære 11, og ringen lukkes først ved 8-11 gåder. Kommer Før Big Bang, skal den handle om det, der kan måles (den første brøkdel af et sekund), ikke om "før" (E19, afsnit 6).
- **Spørgsmålet i Rumtid** har jeres go fra 16. november 2026 og bygges som før, med afsnit 4.3 ovenfor.
