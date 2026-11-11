# E1: Kortet over AtomLab (verdenerne i ringen)

*Hører til [E1-eftersyn.md](E1-eftersyn.md) (anbefaling nr. 8). Opus bruger filen til en ny udgave af `docs/plan-verdener.md` i E2, når I har valgt.*

## Princippet
- **Ringen er et kort efter størrelse.** Fra atomkernen til universet. Så lærer selve menuen noget, og "mindre … større" bliver sandt.
- **Rejsen er ruten efter historien** (eftersynets nr. 9). Den går på tværs af verdenerne og bestemmer, hvor man starter. Derfor behøver ringen ikke stå i den rækkefølge, man lærer tingene. Nye brugere lander stadig på Atomer med "Start her".
- **Biblioteket står uden for skalaen,** som i dag.

## Verdenerne
| # | Verden | Handler om | Dele nu | Planlagt, og hvor |
|---|---|---|---|---|
| 1 | ☢️ **Kernerne** | Det inderste: kerner, der smelter sammen, spaltes og henfalder | Stjerneovnen, Reaktoren | **Tjernobyl** som en tredje fane i Reaktoren. **Antistof** som en lille del (positronen og PET-scanning) |
| 2 | ⚛️ **Atomer** | Hvad et atom er, og de 118 slags | Atomværkstedet, Det periodiske system | **Kvantefysik** som egen del (orbitalerne i store atomer hører til her). Kvantecomputeren er dens sidste kapitel, hvis den kommer. **Fotos af grundstofferne** og samlekortene på væggen |
| 3 | 🧪 **Stof og kemi** *(ny)* | Atomer, der sætter sig sammen og bytter plads | **Molekyler** (flyttes ud af Værkstedet, med knaldgassen) | **Ild** som egen del, og knaldgassen flytter derhen som det første bål. Rumfærgens blanding |
| 4 | 🧬 **Liv** | Molekyler, der kan kopiere sig selv | Liv (Opskriften) | **Begyndelsen** (L4-L5) og **Liv i rummet** (L6) bliver knapper i verdenens kort, så Liv ikke er én del med tre faner. "Skriv dit navn" |
| 5 | ⚡ **Elektricitet** (senere "Lys og strøm") | Det, man kan holde i hånden: ladninger i bevægelse | Batteriet | **Strøm og magneter**. **Lys** (farver, spektret og radiobølger). Lyn. Nerver som et "Hvorfor?"-kort med link til Liv |
| 6 | 🔭 **Rummet** | Planeterne, stjernerne, og rum og tid | Solsystemet, Kosmos | Solsystemet: **overblikket** som forside, Venus, Merkur, Pluto, **månerne** og landingerne, Mars ekstra og "Yderst ude". **Rumrejsen** som egen del (det er et spil). Kosmos i grupper: *Universet* (Big Bang, **Mørkt stof**, Andromeda), *Stjernernes liv* (Ny stjerne, Hvid dværg, Supernova, Pulsar, Kilonova), *Sorte huller* (Sort hul, Kvasar) og *Tid og rum* (Rumtid, Tid, Tyngdebølger, Ormehul, T4) |
| – | 📚 **Biblioteket** | Videnskaben selv: ordene, menneskene, og det vi ikke ved | Ordbogen | **Gåderne** (med Planet X og gåden om antistof som kort). **Opdagelserne:** én del med tidslinjen, videnskabsfolkene og uddragene fra de gamle bøger |

**Hvorfor de hører sammen sådan:**
- **Stof og kemi** samler det, der i dag er spredt: molekylerne gemt i Værkstedet og Ild parret med Liv. Knaldgas og ild er samme sag (en kædereaktion med radikaler), og det er skolens kemi.
- **Liv** bygger på molekyler og står derfor lige efter. Ild har ikke noget med Liv at gøre ud over et pænt navn.
- **Elektricitet** er "menneskestørrelse" og står mellem cellen og planeterne. Verdenen har kun én del og intet besluttet indhold. Den holder kun, hvis den får mere. Lys er mit bud på det vigtigste (se eftersynet, afsnit 7).
- **Gåderne** går på tværs (mørkt stof, livets begyndelse og kvantetyngdekraft) og passer derfor bedre i Biblioteket end i Rummet. Hver gåde linker ud til det sted, den hører til.
- **Grundstoffernes rejse** (fra F1) bliver ikke en del i Biblioteket. Den *er* Rejsen.
- **Uden for ringen:** "Test dig selv" bliver "gæt først" i forløbene. "Zoom ind fra hverdagen" bliver indledningen til et forløb. Hjernen og AI og chatten kommer ikke med.

## Det, der skal flyttes i dag, og hvad det koster
| Flytning | Størrelse | Hvad det rører |
|---|---|---|
| Molekyler ud af Værkstedet til sin egen skærm, og verdenen "Stof og kemi" ind i ringen | mellem (1-2 sessioner) | En ny skærm i `index.html` og `js/main.js`. Modulerne (`js/molekyler.js`, `js/molekyler-byg.js` og `js/knaldgas.js`) er allerede adskilt. Opgaverne tælles i dag under Værkstedet (`js/main.js:17-18`) og skal have deres egen linje i "Din fremgang". Testene `byg-molekyler`, `byttebors`, `molekyler`, `vaerksted` og `karrusel` |
| "Ild og liv" bliver "Liv" | lille | Navn, ikon og baggrundsmotiv i `VERDENER` (`js/karrusel.js`) |
| Rækkefølgen: Kernerne først | lille | Rækkefølgen i `VERDENER` og testen `karrusel` |
| Kosmos' liste i fire grupper, og de to punkter om tid bliver ét | lille til mellem | `js/kosmos.js` og fænomenerne `tid` og `tidhvorfor`. Grupperne er allerede besluttet 7. november |

I alt ca. 3-4 sessioner. Lav flytningen af Molekyler sammen med dens forløb (eftersynets nr. 5), så delen kun åbnes én gang. Gemte data (stjerner og opdagede grundstoffer) skal følge med.

## Sådan vokser ringen uden at blive uoverskuelig
1. **Højst syv verdener.** Noget nyt bliver en del i en verden, der findes. En ny verden kræver, at den har mindst to dele fra starten.
2. **To til fire dele pr. verden.** Bliver der flere, er to af dem nok i virkeligheden én (som Tjernobyl i Reaktoren).
3. **En liste med flere end otte punkter får grupper** (Kosmos nu, Solsystemet er der allerede).
4. **En verden med én del er et løfte.** Enten kommer del nummer to på køreplanen, eller også lægges delen ind i en nabo.
5. **Hver ny ting får sin plads i dette kort, før den får en plan.**

## Hvor jeg er i tvivl
1. **Rækkefølgen.** *A (mit råd):* Kernerne først, så skalaen er ægte. *B:* Atomer først som i dag, og teksten "mindre … større" fjernes. B er lidt enklere for en ny bruger, men så er ringen bare en række.
2. **Batteriet.** *A (mit råd):* bliver i Elektricitet, og verdenen får Lys og Strøm og magneter. *B:* Hvis Elektricitet ikke får mere inden for et halvt år, flytter Batteriet til Stof og kemi (det er kemi med ioner), og verdenen lukkes. Så er der seks.
3. **Tid og rum.** *A (mit råd):* en gruppe i Kosmos. *B:* en tredje del i Rummet, hvis T4 og flere scener kommer, og gruppen får over seks punkter.
4. **Gåderne.** *A (mit råd):* Biblioteket. *B:* Rummet, som i `plan-verdener.md`, hvis listen ender med næsten kun at handle om rummet.
5. **Navnet "Stof og kemi".** Det er et arbejdsnavn. Lad sønnen vælge, fx mellem det, "Molekyler og ild" og "Kemi".
