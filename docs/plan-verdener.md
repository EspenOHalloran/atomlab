# Plan: Verdenerne i ringen (udgave 2)

*Udgave 2 lavet 11. november 2026 i E2 ud fra Fables kort ([fable/E1-verdener.md](fable/E1-verdener.md)) og jeres valg ([fable/E1-noter.md](fable/E1-noter.md)). Den første udgave (K4, 7.-8. november 2026) med de tekniske detaljer om ringen står i [arkiv/plan-verdener-k4.md](arkiv/plan-verdener-k4.md). Hører til sporet **Menuen** ([lige-nu/menuen.md](lige-nu/menuen.md)). Reglerne for vækst står også i [retning.md](retning.md).*

## Princippet
- **Ringen er et kort efter størrelse,** fra atomkernen til universet. Så lærer menuen selv noget, og "mindre … større" bliver sandt. **Kernerne står først** (jeres valg 11. november 2026).
- **Rejsen** (eftersynets nr. 9) er ruten efter historien. Den går på tværs af verdenerne og bestemmer, hvor man starter. Nye brugere lander stadig på Atomer med "Start her".
- **Biblioteket står uden for skalaen** og sidst.

## Verdenerne
| # | Verden | Handler om | Dele nu | Planlagt, og hvor |
|---|---|---|---|---|
| 1 | ☢️ **Kernerne** | Kerner, der smelter sammen, spaltes og henfalder | Stjerneovnen, Reaktoren | **Tjernobyl** som tredje fane i Reaktoren (parkeret 14. november 2026, står i [ideer.md](ideer.md)). **Antistof** som en lille del (positronen og PET-scanning) |
| 2 | ⚛️ **Atomer** (i dag "Atomer og molekyler") | Hvad et atom er, og de 118 slags | Atomværkstedet, Det periodiske system. **Molekyler** bliver en egen del her (Serie 1) | **Kvantefysik** som egen del (orbitalerne i store atomer hører til her, kvantecomputeren er dens sidste kapitel, hvis den kommer). **Fotos af grundstofferne** på væggen. Molekyler flytter til Stof og kemi, når den kommer |
| 3 | 🧪 **Stof og kemi** *(kommer, når Ild findes)* | Atomer, der sætter sig sammen og bytter plads | – | **Molekyler** (flytter fra Atomer, med knaldgassen) og **Ild** (knaldgassen som det første bål). Rumfærgens blanding |
| 4 | 🧬 **Liv** (i dag "Ild og liv") | Molekyler, der kan kopiere sig selv | Liv | **Begyndelsen** (L4-L5) og **Liv i rummet** (L6) som knapper i verdenens kort. "Skriv dit navn" |
| 5 | ⚡ **Elektricitet** (senere måske "Lys og strøm") | Ladninger i bevægelse, det man kan holde i hånden | Batteriet | **Strøm og magneter**, **Lys** (farver, spektret og radiobølger), lyn. Nerver som et "Hvorfor?"-kort med link til Liv |
| 6 | 🔭 **Rummet** | Planeterne, stjernerne, og rum og tid | Solsystemet, Kosmos | Solsystemet: **overblikket** som forside, **månerne** med mulige betingelser for liv, Venus kort, Merkur og Pluto i lille udgave, Mars ekstra. **Rumrejsen** som egen del, når overblikket findes. Kosmos i fire grupper: *Universet* (Big Bang, **Mørkt stof**, Andromeda), *Stjernernes liv*, *Sorte huller* og *Tid og rum* (med "Tid" som ét punkt) |
| – | 📚 **Biblioteket** | Videnskaben selv: ordene, menneskene og det, vi ikke ved | Ordbogen | **Gåderne** (med Planet X og gåden om antistof). **Opdagelserne:** tidslinjen, videnskabsfolkene og siderne fra de gamle bøger, hver person knyttet til en opdagelse, man kan gøre efter i programmet |

Indtil Ild findes, er der seks verdener. Batteriet bliver i Elektricitet. Får Elektricitet ikke en del mere inden for et halvt år, tages det op igen (Fables mulighed B: Batteriet til Stof og kemi).

**Uden for ringen:** "Test dig selv" bliver "gæt først" i forløbene. "Zoom ind fra hverdagen" bliver indledningen til et forløb. Grundstoffernes rejse (F1) *er* Rejsen. Hjernen og AI og en chat kommer ikke med.

## Regler for vækst
1. **Højst syv verdener.** Noget nyt bliver en del i en verden, der findes. En ny verden kræver mindst to dele fra starten.
2. **To til fire dele pr. verden.** Bliver der flere, er to af dem nok i virkeligheden én (som Tjernobyl i Reaktoren).
3. **En liste med flere end otte punkter får grupper** (Kosmos nu, Solsystemet har dem).
4. **En verden med én del er et løfte:** Enten kommer del nummer to på køreplanen, eller også lægges delen ind i en nabo.
5. **Hver ny ting får sin plads her, før den får en plan.**

## Opgaverne
| Opgave | Hvornår | Størrelse | Hvad det rører |
|---|---|---|---|
| **Ringen:** Kernerne først, "Atomer og molekyler" bliver "Atomer", "Ild og liv" bliver "Liv" (navn, ikon og tekst) | Serie 2 (nr. 8), eller før, hvis den passer ind | lille | `VERDENER` i `js/karrusel.js`, `js/menubaggrund.js` (motivet) og testen `karrusel` |
| **Molekyler som egen del i Atomer** med sit forløb (eftersynets nr. 5 og 10b) | Serie 1, efter skærmlisten (10a) og Forløb-klodsen | mellem (1-2 sessioner) | En ny skærm i skærmlisten med egen HTML og CSS. `js/molekyler.js`, `js/molekyler-byg.js` og `js/knaldgas.js` er allerede adskilt. Opgaverne får deres egen linje i "Din fremgang" (i dag under Værkstedet, `js/main.js:17-18`), og de gemte stjerner flytter med. Testene `byg-molekyler`, `byttebors`, `molekyler`, `vaerksted` og `karrusel` |
| **Kosmos i fire grupper,** og de to punkter om tid bliver ét | Serie 1 (sammen med Tid, nr. 6) | lille til mellem | `js/kosmos.js` og fænomenerne `tid` og `tidhvorfor` |
| **Stof og kemi** ind i ringen, og Molekyler flytter dertil | Når Ild bygges | lille (selve flytningen) | `VERDENER`, et nyt motiv og et nyt ikon (`ikon-v-<id>`) |

**En ny del i en verden, der findes:** en ny linje i `dele` under verdenen i `VERDENER` (og i skærmlisten fra nr. 10a). Detaljerne om knapperne, ✓ og "Din fremgang" står i [arkiv/plan-verdener-k4.md](arkiv/plan-verdener-k4.md).

## Åbent
- **Navnene:** "Stof og kemi" er et arbejdsnavn. Sønnen vælger, når verdenen kommer (fx mellem "Stof og kemi", "Molekyler og ild" og "Kemi"). Hans valg mellem navnene fra K4 står stadig i [ikke-afproevet.md](ikke-afproevet.md).
- **Tid og rum:** en gruppe i Kosmos (valgt nu). Bliver gruppen over seks punkter (fx med T4), kan den blive en del for sig i Rummet.
- **Gåderne:** Biblioteket (valgt nu). Ender listen med næsten kun at handle om rummet, kan de flytte til Rummet.
