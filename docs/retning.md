# Retningen

*Læses, før en ny del, en ny skærm eller et nyt forløb planlægges eller bygges. Kun det, der gælder i lang tid. Udkast af Fable 11. november 2026 ([E1-retning.md](fable/E1-retning.md)), godkendt af jer samme dag i E2 med Opus' rettelser ([E1-noter.md](fable/E1-noter.md)). Ændres kun med jeres go. Skabelonen for et forløb står i [fable/E3-forloeb.md](fable/E3-forloeb.md).*

## Hvad AtomLab er
- **Én tanke:** Alt er lavet af atomer. Her kan du selv bygge, prøve og se, hvor de kommer fra, og hvad de bygger, fra atomkernen til universet.
- **Til:** nysgerrige fra ca. 12 år og op, **alene og uden en voksen ved siden af**. Også i en skoletime.
- **Løftet:** en blid indføring i svære ting. Man gør noget først og forstår det bagefter.
- **Ikke:** en lærebog, et leksikon, en simulator for fagfolk, et pointspil eller en chat. Mere indhold er ikke et mål i sig selv.

## Indhold
1. **Én sætning først.** Hver del og hvert forløb har en kernesætning: "Efter fem minutter kan brugeren sige: …". Den skrives før planen. Alt, der ikke tjener den, hører til i et lag længere nede eller slet ikke.
2. **Spørgsmålet før svaret.** Vis noget, der undrer, og lad brugeren gætte. Forklar bagefter.
3. **Gør før læs.** Hvert trin har en handling. Ingen tekst over tre sætninger uden noget at røre ved.
4. **Højst to nye fagord pr. trin** i det, der altid er fremme. Hvert fagord forklares og står i Ordbogen.
5. **Tal kun, når de siger noget,** og helst sammenlignet med noget kendt. Enheder som eV og MeV hører til i "For nørder".
6. **Rigtige data er krydderi.** Rigtige gener, krystaller og målinger må gerne ligge bag, men de må ikke gøre det første møde sværere.
7. **Ærligt:** Forenklinger siges ("Ærligt talt"), og fakta har en kilde i `docs/`. Hvor det passer, siges også, *hvordan vi ved det*: et "Hvorfor?"-kort med overskriften "Hvordan ved vi det?" (hvem målte det, hvornår og hvordan), ikke en ny slags klods.
8. **Hver oplysning bor ét sted.** Forklaringer i kortene og Ordbogen. Hjælpen siger kun, hvordan man styrer.
9. **Læsestof hænger på noget, man kan gøre.** En person, en bogside eller en gåde peger altid på et sted i programmet, hvor man selv kan se det.

## Skærmen
1. **Forløbet kommer først.** Første gang i en del starter et forløb på 3-6 trin (højst fem minutter). Imens er kun scenen og forløbets linje fremme. Bagefter åbner laboratoriet. Forløbet kan springes over og tages igen.
2. **Lagene har et budget:**
   - *Altid fremme:* scenen, én linje om det, der sker nu, og én ting at gøre.
   - *Venstre panel:* højst fem valg synlige. Resten foldes ind.
   - *Højre panel:* titel, højst to tal, højst tre sætninger og højst fire spørgsmål. Derefter "For nørder" og "Ærligt talt", lukkede.
   - Lægger en opgave noget til, flytter den også noget ned eller ud.
3. **Én udgave af hver klods:** forløb, spørgsmål ("Hvorfor?"), "For nørder", "Ærligt talt", fakta-felt og knaprække. Brug de fælles. Byg ikke en ny variant til én skærm.
4. **Læsbart:** brødtekst mindst 15 px, småt mindst 13 px. Alt, der kan trykkes, er mindst 44 px. Gælder alt nyt. De gamle skærme rettes én ad gangen sammen med budgettet for panelerne, fordi infopanelet i Værkstedet ikke må få en rullebjælke.
5. **Ikoner er tegnede** (SVG eller CSS), ikke emoji.
6. **Intet dækker scenen,** man ikke selv har åbnet. Intet ligger oven i andet i nogen størrelse: pc, tablet på langs og på højkant og telefon.
7. **Links begge veje:** Hver del peger mindst ét sted hen, og mindst ét sted peger på den.

## En ny del er færdig, når
- kernesætningen er skrevet, og forløbet findes
- **et barn på 12-14 år har prøvet den i ti minutter uden hjælp, og en voksen bagefter kan sige kernesætningen med egne ord** ([guide-proeven.md](guide-proeven.md))
- den er set på en rigtig tablet på langs og på højkant
- teksterne er faktatjekket, forenklingerne er sagt, og nye ord står i Ordbogen
- lag-budgettet er holdt
- der er 5-10 tjek af det vigtigste, og konsollen er uden fejl
- den har sin plads i kortet over verdenerne ([plan-verdener.md](plan-verdener.md)), og dokumenterne er rettet

Der må bygges videre, mens noget venter på at blive prøvet, men en del har status "prøve", til den er prøvet, og der er højst én ny stor del i gang ad gangen ud over Solsystemet. "Ikke afprøvet" holdes under ca. 10 punkter. Resten flyttes til arkivet.

## Ydelse
*Tallene er et udgangspunkt fra målingerne 11. november 2026 ([tal.md](fable/eftersyn/tal.md)). De rettes, når en ældre iPad og en Chromebook er målt.*
- **Starten vokser ikke, når der kommer nye dele.** En skærm hentes først, når den åbnes. Menuen: højst ca. 1,5 MB over nettet.
- **En skærm uden kloder** henter højst ca. 1 MB ekstra.
- **En klode:** højst ca. 20 MB på tablet og 25 MB på pc (Mars henter i dag 18,6 og 25,4). Der hentes kun det, man kigger på.
- **Teksturer i scenen:** højst ca. 350 MB på tablet (som i dag) og ca. 120 MB i trinnet "Let".
- **Tre trin:** fuld (pc), tablet (`LAV_KVALITET`) og "Let" (svage enheder, valgt af sig selv). Alt nyt skal virke i alle tre, når "Let" findes.
- Når man forlader en skærm, frigives dens billeder og geometrier.
- Kildebilleder, som programmet ikke henter, ligger ikke i repoet.

## Vækst
- Højst syv verdener, to til fire dele i hver, og grupper i lister over otte punkter (se [plan-verdener.md](plan-verdener.md)).
- Det stærke skal ikke kopieres overalt: Nye planeter og måner får en lille udgave (kloden, tre-fire steder og flyby), medmindre I vælger andet.
- Dele under arbejde har status "prøve" og vises ikke i den udgave, andre får, når AtomLab er frigivet.

## Faste rammer
Dansk. Ingen server, ingen konto og ingen indsamling af data. Åbnes via et link. Intet byggetrin og ingen nye biblioteker uden et go. Pc, tablet og telefon.
