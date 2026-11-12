# Prompt: Fable gennemgår Tid ("Rejsen i tid" og "Hvorfor går tiden langsommere?")

*Skrevet 12. november 2026 efter jeres go ("Fable skal også gennemgå eksisterende tekst og tal. Det køres inden runden med jeres søn"). Hører til sporet Tid og rum ([lige-nu/tid.md](lige-nu/tid.md)) og til Fables eftersyn ([fable/E1-eftersyn.md](fable/E1-eftersyn.md), punkt 6). Fable skriver kun dokumenter, så den kan køre samtidig med andre sessioner.*

## Sådan startes den
- **Egen session med Fable 5.2** (som i [plan-fable.md](plan-fable.md)), i miljøet **"Default"** (kildedomænerne er åbne dér, se [prompt-faktagrundlag.md](prompt-faktagrundlag.md)).
- **Effort: `high`.** Skal I have et ekstra sikkert faktatjek af tvillingeparadokset og samtidigheden, kan I skifte til `xhigh` for den del. Det koster mere, og `high` er sandsynligvis nok, fordi tallene allerede er regnet efter med `regn.py`.
- **Pris (usikkert skøn):** ca. 8-15 $ (Fable 5.2: 8 $ ind og 40 $ ud pr. million tokens). Fable læser ca. 250 KB (35-70.000 tokens) og skriver højst ca. 20 KB. Tjek saldoen før og efter, så vi ved, hvad det rigtigt kostede.
- **Første besked til Fable:** "Læs `docs/prompt-fable-tid.md`, og gør det, der står under 'Prompten'."

---

## Prompten

Du skal gennemgå Tid-delen af AtomLab: Kosmos-fænomenerne **"Rejsen i tid"** (tvillingen, der flyver til Alpha Centauri, Mælkevejens centrum eller Andromeda og hjem) og **"Hvorfor går tiden langsommere?"** (fem små scener). Opus har bygget det hele og skrevet teksterne, og du har endnu ikke set dem. Dit eneste tidligere bidrag er punkt 6 i dit eget eftersyn ([docs/fable/E1-eftersyn.md](fable/E1-eftersyn.md)): *"Tid: oplevelsen først, og én indgang"*.

### Målet (jeres ord)
Tid er for jer **noget af det vigtigste i AtomLab**. Det skal blive så fedt, sjovt og forståeligt som muligt, så et ekstremt spændende og komplekst emne bliver formidlet til en 13-årig på en pædagogisk måde, hvor han selv opdager det. Ærlighed er vigtigere end pæne ord: Siger du, at noget ikke er godt nok, så sig det, og sig hvorfor. Er du i tvivl, så sig det.

### Hvem det er til, og rammerne
Læs CLAUDE.md (står i samtalen), især "Hvem bruger det" og "Regler, der gælder på tværs". Teksten er på dansk til en 13-årig, og fysikken skal være tæt på virkeligheden, men enkelt forklaret, og forenklinger skal siges ærligt. Du ændrer **ikke kode og ikke tekster i programmet**. Du skriver kun i `docs/fable/`. Opus bygger bagefter. Hvor du siger "forslag", må Opus vælge anderledes, hvis koden taler for det. Reglerne ændres kun med jeres go.

### Hvad du skal læse
Læs de små filer helt og de store med `grep` eller i afsnit. Læs ikke alt to gange.
1. **Retning og skabelon:** [docs/retning.md](retning.md) og [docs/fable/E3-forloeb.md](fable/E3-forloeb.md) (din egen skabelon til et forløb, og drejebogens skema, som du skal bruge).
2. **Det, der er sagt om Tid:** [docs/fable/E1-eftersyn.md](fable/E1-eftersyn.md) punkt 6 og E1-billede e ([docs/fable/E1-billeder/e-tid-scene3-myoner.jpg](fable/E1-billeder/e-tid-scene3-myoner.jpg)), tablet-billede 09 i [docs/fable/eftersyn/tablet/](fable/eftersyn/tablet/LISTE.md) og de punkter om Tid i [docs/ikke-afproevet.md](ikke-afproevet.md), som I endnu ikke har prøvet med jeres søn.
3. **Planerne og faktagrundlaget:** [docs/plan-tid.md](plan-tid.md) ("Forklaringen" og "Fælder, vi skal undgå"), [docs/plan-tid-t5.md](plan-tid-t5.md) (drejebogen til de fem scener), [docs/fakta-tid.md](fakta-tid.md), [docs/fakta-tid/hvorfor-langsommere.md](fakta-tid/hvorfor-langsommere.md) og [docs/fakta-tid/regn.py](fakta-tid/regn.py) (kør den: `python3 docs/fakta-tid/regn.py`).
4. **Fælderne og reglerne for fakta:** [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) og skillen `/faktatjek` (tjekliste B). Læs dem, **før** du vurderer teksterne.
5. **Teksterne, som brugeren faktisk ser** (det er dem, du skal gennemgå): `js/data/tid.js` (regning og hjemkomsttekster, se også `node tests/vaerktoejer/tid-tekster.mjs`), `js/kosmos/tid.js` (siden og de syv emner, "For nørder" og "Ærligt talt", lysurets trin og underteksterne), `js/kosmos/tidhvorfor.js` (de fem scener, emnerne og henvisningerne), "Hvorfor?"-kortet `lysfart` i `js/data/hvorfor.js`, ordene "Samtidighed", "Egentid" og de andre tidsord i Ordbogen (`js/data/ordbog.js`), og [docs/kode/tid.md](kode/tid.md) som kort over koden.
6. **Se det køre** (valgfrit, men det er anbefalet, hvis du kan): Start `python -m http.server 8000`, og tag billeder med `FAENOMEN=tid node tests/vaerktoejer/skaermbilleder.mjs kosmos` og `FAENOMEN=tidhvorfor …` (se [tests/README.md](../tests/README.md)). Testbrowseren har intet grafikkort, så vurdér hellere opbygning og tekst end farver og glød.

### Hvad du skal levere
Én fil: **`docs/fable/E4-tid.md`**, højst ca. 20 KB, uden at gentage det, der allerede står i planerne. For hvert fund: peg på en fil og en linje (eller et skærmbillede), og sig, hvor sikker du er. Skriv det i denne rækkefølge:

1. **Det vigtigste først** (højst 5 linjer, og om Tid er klar til jeres søn eller ikke).
2. **Faktatjek af tekster og tal.**
   - Gå alle tekster med fakta og tal igennem, i "Rejsen i tid" og i de fem scener (også "For nørder", "Ærligt talt", Ordbogen og "Hvorfor?"-kortet).
   - **Regn selv de vigtigste tal efter** (γ, rejsetiderne for de tre mål og de tolv ni-taller, 1 g-rejsen, myonernes 99,965 %, rumtidskortets 4 lysår og 6 og 8 år), uden at stole på `regn.py`, og sammenlign med `js/data/tid.js`. Find ud af, om regningen i koden og teksterne siger det samme.
   - Tjek de steder, hvor en forenkling lyder som en fejl, fx tvillingeparadokset (hvem er det, der vender om, og hvorfor er det ikke symmetrisk), "set fra skibet" og længdeforkortelsen, "nu" for den rejsende (springet 1,8 → 8,2 år) og "tiden går langsommere" mod "uret går langsomt".
   - En tabel: **tekst (fil:linje) · påstand · dom** (korrekt, upræcist, forkert eller for forsigtigt) **· kilde · forslag til ordlyd**. Brug primære kilder og de åbne domæner i miljøet. Står kilden kun i din hukommelse, så skriv det.
3. **Det pædagogiske eftersyn.** Hvor får en 13-årig sandsynligvis en forkert intuition eller går i stå, og hvorfor? Gå de fem scener og de syv emner igennem, og vurdér:
   - rækkefølgen (må man se γ = 38, før man har undret sig?)
   - om hver scene har **én** ny idé, og om man gør noget i hver (E3-reglerne)
   - om der står for meget tekst på skærmen på én gang, og om der er for mange kontakter
   - hvilke ord der bliver brugt, før de er forklaret
   - hvad der er godt og ikke skal røres (sig det, så Opus ikke ændrer det)
4. **Drejebogen til det nye "Tid"** (jeres svar på punkt 6, nu uddybet) i skemaet fra `E3-forloeb.md`:
   1. kernesætningen
   2. trinene med de fem felter (Spørg, Gæt, Gør, Så, Ord) og hvad scenen viser
   3. det, der er valgt fra, og hvor det bor i stedet ("Vil du vide mere?", lag 2, lag 3)
   4. ordene (højst ca. otte)
   5. prøven (tre spørgsmål)
   6. nye fakta, der skal tjekkes

   Opbygningen skal starte med oplevelsen ("Du kommer hjem, og din tvilling er blevet gammel"), og først derefter "Hvordan kan det ske?". Forklar, hvordan de fem scener og de syv emner kan **genbruges** (det meste skal ikke bygges om), og hvad der skal bygges nyt. Sig også, om opbygningen skal være ét forløb eller to (fx "Rejsen" og "Hvorfor?").
5. **Det fede og sjove.** 5-8 konkrete idéer til, hvordan emnet kan blive mere gribende og legende, **inden for reglerne** (man gør noget, kan ikke fejle, og skærmen er ikke fuld af tekst). Hver idé med størrelsen (lille, mellem eller stor), hvem der bygger den (Opus direkte eller med en plan), og hvad den lærer. Tænk fx på: hvad man kan mærke på sin egen krop og sit eget ur, hvad man kan gætte og så se, og små overraskelser, man husker. Nævn også ting, der er fristende, men **ikke** bør laves (fx T4, cockpittet, [prompt-tid-t4.md](prompt-tid-t4.md)), og hvorfor.
6. **Prøven med jeres søn** (runden er efter dit eftersyn): De 5-8 konkrete ting, som I skal se efter, når han prøver Tid for første gang (hvad gør han først, hvor går han i stå, hvilke ord forstår han ikke, hvad kan han sige med egne ord bagefter), og de tre spørgsmål, du ville stille ham. Skriv dem, så Espen kan bruge dem uden at have læst resten.
7. **Spørgsmål til jer.** Højst fem, hver med to eller tre valgmuligheder og din anbefaling først (så de kan stilles som en dialog).

### Regler for dig
- Du **bygger ikke** og ændrer hverken kode, tekster i programmet eller regler. Når filen er skrevet, **stopper du**, og du går ikke videre til noget andet af dig selv.
- Nye fælder, du finder (noget, der ofte siges forkert om relativitet), skrives som nye linjer i bunden af [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md), uden at rette i de gamle. Listerne merges med `merge=union`.
- Skriv ikke fund, der allerede står i planerne eller i dit eget eftersyn, igen. Henvis i stedet (fx "som i E1 punkt 6").
- Du kan ikke mærke, hvordan det føles med fingre, eller om det hakker på tabletten. Skriv, når et fund afhænger af det, og at det skal prøves.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje i [lige-nu/tid.md](lige-nu/tid.md): "Fables eftersyn er skrevet, se `docs/fable/E4-tid.md`".

## Efter Fables svar
1. Opus skriver `docs/fable/E4-noter.md` (hvilke fund der er nye, hvilke fakta der skal rettes med det samme, og hvad der er uenighed om). Fables fil rettes ikke.
2. **Fakta, der er forkert, rettes med det samme** (små rettelser af tekster og tal), før jeres søn prøver det. Det er Opus med `/faktatjek`.
3. I får et dialogkort med Fables spørgsmål. Først derefter går jeres runde med jeres søn i gang med Fables liste fra punkt 6.
4. Drejebogen (punkt 4) er det, I siger go til, før "Tid som ét punkt" bygges (Serie 1, nr. 4 i [koereplan.md](koereplan.md)).
