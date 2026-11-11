# Plan: Det store eftersyn med Fable 5.2 (E0-E3)

*Lavet 9. november 2026 sammen med jer. Hører til sporet Småting ([lige-nu/smaating.md](lige-nu/smaating.md)). Starter, når T5c er færdig. Hvert trin får et go. Den første plan for Fable (F0-F4) står i [plan-fable.md](plan-fable.md).*

## Hvad det går ud på (jeres ord)
Når T5c er færdig, stopper vi op og får en ekspert til at vurdere hele AtomLab: "en slags konsulent eller arkitekt, der kan sikre en professionel løsning".
- **Helikopterperspektivet:** Giver det mening, sådan som det hele er sat sammen?
- **Indholdet** i de enkelte områder: Er det det rigtige indhold, der er med? Koden skal ikke tjekkes i detaljer.
- **UI, UX og ydelse,** og muligheder for at løfte projektet på alle mulige måder.
- Fable **må gerne udfordre beslutninger,** der allerede er taget.
- **Verdenerne i ringen** (jeres ønske, samme dag): Hvor skal tingene ligge i karrusellen, og skal der nye verdener ind? De planlagte ting skal tænkes med (fx de store videnskabsfolk, Gåderne, Mørkt stof og Kvantefysik), så vi får en plan for, hvor de skal være, hvad der logisk hører sammen, og hvad der giver den bedste oplevelse.
- Forslag til, **hvordan AtomLab skal udvikle sig** fremover, både indholdet og indpakningen. Også **arbejdsgangen**, hvis noget kan justeres.
- **Opus 5.5 står for den videre udvikling,** når Fable har givet sine anbefalinger. Fable bygger ikke.
- Fable må ikke bruges på noget, Opus kan lave lige så godt.

## Jeres svar (9. november 2026)
- **Kørsel:** I starter selv en session med Fable 5.2, så I kan tale med den og stille spørgsmål bagefter.
- **Budget:** ca. 20-40 $ til Fables del, inklusive samtalen bagefter.
- **Pause:** Kun nye store dele venter (fx Liv L2, Venus V3 og nye planer), fra E0 starter, til I har valgt i E2. Igangværende delopgaver og småting må gøres færdige.
- **Sønnen:** I laver en kort, ny runde med ham før E1 ([guiden](fable/runde-med-soennen.md)).
- Beslutningen fra 23. oktober om at vente på "Fable 5.5" gælder ikke længere for eftersynet: Fable 5.2 er kommet, og nu er et godt tidspunkt. Om Tjernobyl stadig skal vente, afgøres i E2.

## Sådan får vi mest ud af Fable
- **Prisen:** Fable 5.2 koster 8 $ ind og 40 $ ud pr. million tokens, og det, der læses fra cachen, koster 0,20 $. Opus 5.5 koster 4 $ og 20 $. Fable er altså dobbelt så dyr som Opus. At læse er billigt, men det, Fable skriver og tænker, er dyrt (tænkningen betales som tekst, den skriver). **Fable skal derfor se meget og skrive kort.**
- **Hvor Fable er bedre end Opus** (Anthropics vejledning): svære vurderinger uden en facitliste, lange og svære opgaver, at se en stor kodebase som en helhed, at bedømme billeder, og at finde det, ingen har spurgt om. Ved rutinearbejde er forskellen lille. Eftersynet er lavet til at bruge netop det.
- **Mål, grund og rammer, ikke en tjekliste.** For detaljerede prompter giver ringere svar hos Fable. Briefen stiller derfor spørgsmål og siger, hvad svaret skal bruges til.
- **Opus samler fakta, ikke meninger.** Opus' vurderinger (F1 og eftersynet fra oktober) skal ikke præge Fable. Fable laver først sin egen vurdering og læser dem først bagefter for at se, hvad der er nyt.
- **Billige hjælpere:** Fable må bruge Haiku eller Sonnet som hjælpeagenter til at tælle og søge, men læser selv det, den vurderer.
- **Effort:** `high`. Anthropic anbefaler at starte ved `high` for Fable 5.2 og kun gå op, hvor gevinsten er målt.
- **Svaret skal kunne bruges af Opus i mange sessioner.** Hver anbefaling siger hvad, hvorfor, hvordan, størrelsen, rækkefølgen, og om Opus kan gå direkte i gang eller skal lave en plan først. Fable skriver desuden et kort udkast til **"Retningen"** (højst ca. 5 KB): principperne, kvalitetskravene og grænserne for ydelsen, som Opus læser, før en ny del bygges. Det er den del af Fables arbejde, der bliver ved med at virke.

**Fable laver ikke** (Opus gør det lige så godt og billigere): skærmbilleder, målinger, tests, kode, danske tekster til programmet, faktatjek af korte tekster og at skrive forslagene ind i køreplanen.

## Trinnene

### E0: Materialet (I og Opus, høj effort, ca. 3-6 $)
- **I:** Runden med jeres søn og 5-10 skærmbilleder fra tabletten ([guiden](fable/runde-med-soennen.md)). Svar også på spørgsmålene til jer som far nederst i guiden.
- **Opus:** Ny session med "Læs docs/arkiv/prompt-fable-e0.md". Opus samler materialet i `docs/fable/eftersyn/` og retter tallene i briefen:
  - nye skærmbilleder af alle verdener og dele på pc, tablet på langs og på højkant og telefon (de gamle fra 22. oktober bliver liggende)
  - målinger af download, hukommelse og opstart pr. skærm, koden, dokumenterne og testene
  - status for F1's ti punkter (én linje hver)
  - en kort liste over de vigtigste beslutninger med grunden, så Fable kan udfordre dem
  - en liste over alt det planlagte (én linje hver, og hvor det er tænkt at ligge) og ringen, som den er nu
  - jeres og sønnens noter, skrevet rent
- Alt pushes til `main`, fordi Fables session starter på en frisk klon.

### E1: Eftersynet (Fable 5.2, egen session, `high`, ca. 20-40 $)
- **Første besked:** "Læs docs/fable/brief-eftersyn.md og lav eftersynet."
- **Svaret:** `docs/fable/E1-eftersyn.md` (højst ca. 8 sider), `docs/fable/E1-verdener.md` (kortet over verdenerne med de planlagte ting på deres plads, højst ca. 6 KB) og `docs/fable/E1-retning.md` (udkastet til Retningen, højst ca. 5 KB).
- **Bagefter:** I læser det og taler med Fable i samme session: spørg ind, og udfordr. Bliver I enige om en ændring, retter Fable sine egne filer. Hold samtalen kort og til overblikket.
- Tjek saldoen før og efter, så vi ved, hvad det kostede.
- **Før og efter (Opus' råd 11. november 2026):** Bed Fable om først at tjekke med `get_session`, hvilken model den kører på (en session kan falde tilbage til en anden model uden at sige det), og tjek igen, når svaret er skrevet. Hold samtalen bagefter kort, for de ca. 100 billeder sendes med i hver ny besked. Tjek til sidst, at de tre E1-filer ligger på `main`, før E2 starter.

### E2: Fra råd til plan (Opus, høj effort)
- Ny session med "Læs docs/fable/E1-eftersyn.md og lav E2" (prompten står i E1-filen eller skrives af Opus).
- Opus skriver `docs/fable/E1-noter.md`: hvad der er nyt, hvad der var kendt, og hvor Opus er uenig, og hvorfor. Fables egne filer rettes ikke.
- Opus lægger anbefalingerne frem for jer som valg (anbefalingen først). Jeres valg bliver til punkter i køreplanen og nye planer. Nye regler i DESIGN.md og CLAUDE.md kommer kun med jeres go.
- Retningen flyttes til `docs/retning.md`, når I har godkendt den, og læsekortet i CLAUDE.md får en linje.
- Kortet over verdenerne bliver til en ny udgave af `docs/plan-verdener.md` med jeres valg. Flytningerne i ringen bliver en opgave i sporet Menuen, og de planlagte ting får deres plads i køreplanen.

### E3: Dybde (Fable 5.2, kun hvis E1 peger på det, og I giver go, ca. 5-15 $ pr. område)
Kun i de områder, hvor Fable selv siger, at den vil gøre det klart bedre end Opus. Opus samler først materialet til området.

## Budget
| Trin | Hvem | Skøn |
|---|---|---|
| E0: materialet | Opus | 3-6 $ |
| E1: eftersynet og samtalen | Fable 5.2 | 20-40 $ |
| E2: fra råd til plan | Opus | 2-5 $ |
| E3: dybde | Fable 5.2 | 5-15 $ pr. område, kun ved go |

Skønnene er usikre og kan være 2 gange forkert begge veje. Priserne er Anthropics API-priser. Opus kan ikke se, hvordan jeres konto trækker, derfor måles E1.

## Det kan Fable ikke
- Den kan ikke mærke, hvordan det føles med fingre og mus, eller om det hakker på tabletten. Derfor runden med sønnen og jeres billeder.
- Testbrowseren har intet grafikkort. Grafikken skal især bedømmes ud fra jeres billeder fra tabletten.
- Fables forslag er forslag. I bestemmer, og hvert trin får et go.

## Status
- [x] Planen, briefen, prompten til E0 og guiden til runden med sønnen er skrevet (9. november 2026).
- [x] T5c er færdig (9. november 2026).
- [x] E0: materialet (11. november 2026): jeres svar og tabletbilleder, briefen fyldt ud, `docs/fable/eftersyn/` (tal, det planlagte, målinger og skærmbilleder). Sønnens runde kom ikke med (jeres valg).
- [ ] E1: Fables eftersyn.
- [ ] E2: Opus' noter og jeres valg.
