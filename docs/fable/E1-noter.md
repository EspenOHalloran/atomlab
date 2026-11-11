# E2: Opus' noter til Fables eftersyn

*Skrevet 11. november 2026 af Opus i E2 ([plan-fable-eftersyn.md](../plan-fable-eftersyn.md)). Læst: [E1-eftersyn.md](E1-eftersyn.md), [E1-verdener.md](E1-verdener.md), [E1-retning.md](E1-retning.md) og E3-filerne ([skabelonen](E3-forloeb.md) og [drejebogen til Liv](E3-liv-drejebog.md)), som Fable lavede samme dag. Påstandene er tjekket mod koden og [tal.md](eftersyn/tal.md), hvor det kunne lade sig gøre. Fables egne filer er ikke rettet.*

## Kort
Fables vigtigste fund holder, og jeg er enig: AtomLab er blevet gode laboratorier uden en vej igennem, og der bliver bygget hurtigere, end nogen kan prøve det. Forløbene, prøven med et barn og budgettet for lag 1 er de tre ting, der løfter mest. Jeg er uenig i nogle detaljer og i et par begrundelser, ikke i retningen.

## Det, der er tjekket og passer
- `js/main.js` importerer alle skærme og bygger alle ni ved start (linje 6-28 og 66-80). 149 filer og 4,4 MB ved start (`tal.md`).
- "Ikke afprøvet" har 47 punkter.
- `style.css` bruger 13 px 46 gange, 12,5 px 27 gange og 12 px 24 gange. Kun 32 steder bruger 15 px eller mere.
- Molekylernes opgaver tæller under Værkstedet (`js/main.js:17-18`).
- 18 planer i `docs/plan-*.md`, 309 MB billeder, og `.git` fylder 354 MB.
- Fakta, Fable var usikker på (efter min viden, tjekkes igen i faktagrundlaget): GitHub Pages har en grænse på 1 GB for et udgivet site. Einstein døde i 1955, så hans tekster er frie i EU fra 1. januar 2026 (70 år efter døden). Bohr (død 1962) er fri i 2033, Lehmann (død 1993) i 2064. Bemærk: En ny oversættelse har sine egne rettigheder, selvom originalen er fri.

## Det, der er nyt
- **Forløb som "lag 0"** og én fælles klods i stedet for fem slags vejledning (nr. 1, skabelonen i E3).
- **Prøv før næste:** status "prøve", til et barn har prøvet delen (nr. 2).
- **Budgettet for lag 1** med tal: højst to nye fagord pr. trin, fire spørgsmål, tre sætninger og to tal (Retningen).
- **Liv skåret ned til to forløb**, og L3-L6 venter (nr. 4, drejebogen i E3).
- **Molekyler ud af Værkstedet** og **Tid som ét punkt** (nr. 5 og 6).
- **Ringen med en rigtig skala** og Kernerne først (nr. 8).
- **To udgaver** (stabil og `?lab`) som afløser for prototyper i den almindelige udgave (nr. 13).
- **Lys** som det manglende led, og **"Hvordan ved vi det?"**.
- **Prioriteringen af Solsystemet:** overblikket frem, månerne med mulige betingelser for liv før Merkur og Pluto, og en lille udgave af det kommende (nr. 12).
- **Videnskabsfolkene knyttet til én opdagelse,** man kan gøre efter i programmet.

## Det, der var kendt
- "Se også", guiden i Værkstedet og app og tilgængelighed: Trin 11 fra oktober (DESIGN.md, "Ikke lavet fra de gamle trin").
- At hente skærmene efter behov: D11 i F1 (oktober).
- Målingen på svage enheder og kvalitetstrinnene: G1 i [plan-grafik.md](../plan-grafik.md) og [foer-vi-deler.md](../foer-vi-deler.md).
- Tre lag og "hver oplysning ét sted": F1 (23. oktober). Fable påviser, at det ikke bliver holdt i de nye dele.
- Grundstoffernes rejse som rød tråd: F1. Ny er rollen som indgang og som skoleprodukt.
- Grupper i Kosmos' liste: besluttet 7. november (køreplanens punkt 7).

## Hvor jeg er uenig, og hvorfor
1. **Nr. 10 (hver skærm sine egne filer): Ja til at gøre det først, nej til størrelsen.** Fable begrunder det med, at parallelle sessioner støder sammen i `index.html`, `style.css` og `js/main.js`. Vores egen erfaring (CLAUDE.md, "Parallelle sessioner") er, at næsten alle konflikter var i de fælles *dokumenter*. Starten sparer ca. 2 MB kode, og JavaScript komprimeres over nettet, så gevinsten for brugeren er mindre, end tallet ser ud. Det, der giver mest, er listen over skærmene og at hente og bygge en skærm først, når den åbnes. At flytte 1.100 linjer HTML og 1.834 linjer CSS på én gang rører alle testenes vælgere og giver mest risiko for mindst gevinst. **Jeres valg:** delt. Listen og hentningen efter behov først og alene (10a). Egen HTML og CSS pr. skærm, når en skærm alligevel åbnes (10b, fx Molekyler).
2. **Kortet over verdenerne bryder sine egne regler i starten.** Reglen er "en ny verden har mindst to dele", og kritikken var "tre af seks verdener har kun én del". Med kortet, som det står, ville fire af syv have én del (Stof og kemi, Liv, Elektricitet og Biblioteket). **Jeres valg:** Molekyler bliver en egen del i Atomer nu, og "Stof og kemi" kommer, når Ild findes.
3. **Tallene for kloderne i Retningen er lavere end i dag.** "Højst ca. 10 MB pr. klode på tablet", men Mars henter 18,6 MB, Saturn 13,4 og Venus 13,2 (`tal.md`, tablet). Rettet til ca. 20 MB i [retning.md](../retning.md).
4. **"Resten slettes"** (punkterne i "Ikke afprøvet" over ca. 10) strider mod reglen "Intet slettes, det flyttes" (CLAUDE.md). Rettet til: flyttes til arkivet.
5. **15 px brødtekst kan ikke bare skrues op.** Reglen om, at infopanelet i Værkstedet ikke må få en rullebjælke, betyder, at større tekst kræver mindre tekst. Det skal laves sammen med budgettet for panelerne, skærm for skærm, og ses på tabletten (nr. 7).
6. **"Hvordan ved vi det?" må ikke blive en ny slags klods.** Det strider mod nr. 7 (én udgave af hver klods). Det bliver en slags "Hvorfor?"-kort med sin egen overskrift.
7. **Forløbet "afløser" ikke de fem slags vejledning på én gang.** Flybyen og scenerne i Tid virker. E3-skabelonen siger det samme (de flyttes senere, ikke nu). Underteksten (`js/beskeder.js`) er ikke en konkurrent, men det sted, forløbets linje bor.
8. **Skønnet "hele pakken på en måned"** forudsætter, at prøven med barnet holder trit. Det er den, der bestemmer tempoet, ikke sessionerne (Fable siger det selv i afsnit 6).

## Småting, der ikke kræver et valg
- **"Cellekernen" i Liv** (drejebogen, punkt 1): enig. Rettes, når Livs forløb bygges.
- **Testen `mars` (585 sekunder) deles i to:** enig, en opgave i Småting.
- **Kildebilleder ud af repoet:** Det gør det udgivne site mindre, men ikke `.git` (historikken beholder dem). Tages op sammen med Serie 3.
- **Fable om sig selv** (afsnit 8): enig. Et kort eftersyn før hver udgivelse eller ca. hver anden måned, og faktagrundlaget for det omstridte (Tjernobyl, Gåderne og livets begyndelse).

## Jeres valg (11. november 2026, i E2)
| Spørgsmål | Valg |
|---|---|
| Molekyler ud af Værkstedet (Fables spørgsmål 4) | Ja, som en egen del i verdenen Atomer nu. "Stof og kemi" kommer, når Ild findes |
| Enheder til målingen (5) | I kan låne en ældre iPad og en Chromebook |
| Hvornår er AtomLab frigivet (6) | Når 3-5 børn og en lærer har brugt det uden hjælp, og fundene er rettet |
| E3 (7) | Ja. Lavet samme dag af Fable ([E3-forloeb.md](E3-forloeb.md) og [E3-liv-drejebog.md](E3-liv-drejebog.md)) |
| Nr. 10 | Delt: listen og hentningen efter behov først og alene (10a), filerne pr. skærm gradvist (10b) |
| Retningen | Godkendt med Opus' rettelser: [docs/retning.md](../retning.md) |
| Nye regler | Alle fire: prøv før næste, én sætning før planen, træk fra, når I lægger til, og højst to nye fagord pr. trin (DESIGN.md) |
| "Det hele skal med" i Solsystemet | Gælder det, der er bygget. Det kommende får en lille udgave. Overblikket kommer frem |
| Tjernobyl | Bliver sent i rækkefølgen. Fable 5.2 laver faktagrundlaget og drejebogen, når den står for tur. Ventetiden på "Fable 5.5" er slut |
| Prøven | En fast aften om ugen ([guide-proeven.md](../guide-proeven.md)) |

Fra samtalen med Fable (E1, samme dag): pause for Liv L3 og Venus V3, til Serie 1 er lavet og prøvet, en fast prøve, Kernerne først i ringen og go til den ændrede rækkefølge og de tre betingelser for at bygge videre. Det hele står nu i [koereplan.md](../koereplan.md) og [plan-verdener.md](../plan-verdener.md).
