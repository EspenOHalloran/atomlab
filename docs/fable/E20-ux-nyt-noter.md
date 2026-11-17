# E20: Opus' noter til eftersynet af UI og UX

*17. november 2026, Opus. Læses sammen med [E20-ux-nyt.md](E20-ux-nyt.md) og [stilguide.md](../stilguide.md). Fundene er tjekket mod koden i `origin/main` (17. november 2026), ikke på tabletten. Kun dokumenter.*

## 1. Kort sagt
Diagnosen holder: Programmet taler med flere stemmer, har fire veje tilbage, og forløbene spærrer i stedet for at foreslå. De fund, der kan ses i koden, passer alle (afsnit 2). **Det nye, som ikke stod i de kendte fund:** tablettens tilbage-knap (fund 3), at det første grundstof ikke bliver fejret under et forløb (fund 8), at kantudglatning skal måles som en prøve og ikke bare slås til (fund 10), og at Gåderne ikke holder sit eget løfte om tilbage-knappen (nyt her). Jeg er uenig i tre ting (afsnit 3): højre panel i Værkstedet skal ikke foldes helt ind, "Se Solen lave helium" skal ikke være den vigtigste knap efter "Dit første atom", og "Næste ›" har brug for et lille værn.

## 2. Tjekket mod koden
| Fund | Det, koden viser | Status |
|---|---|---|
| 2. Forløbet spærrer | `VIS_MIG_EFTER = 20000` (`js/forloeb.js` linje 29). I forløbet skjuler `#opdagelser.i-forløb .bog-bund { display: none }` (`style.css` linje 1277) rækken med "‹ Hylden" | Rigtigt |
| 3. Tilbage-knappen | "‹ Menu" er `<a href="#">` i alle dele (`index.html` linje 165, 293, …), så hvert tryk lægger en ny side i browserens historie. Kun Det periodiske system bruger `pushState` og `popstate` (`js/system.js` linje 599-642) | Rigtigt. **Nyt:** [plan-gaader-3d.md](../plan-gaader-3d.md) lover "Tilbage-knappen og Esc går fra kort til sti", men `js/gaader.js` bruger ikke historien, så kun Esc gør det. På tabletten fører tilbage-knappen inde fra et kort ud af Gåderne |
| 6. Byggepladsen kan ses | `TOM_LINJE = 'Dette opslag er ikke færdigt endnu.'` (`js/data/opdagelser/huygens.js` linje 29), og ryggene hedder "Kommer senere" (`js/opdagelser.js` linje 34) | Rigtigt. H3 fylder nogle af opslagene, men ikke alle |
| 8. Belønningen gemmer sig | `dæmpPiller(true)`, når et forløb starter (`js/forloeb.js` linje 71), og `if (!dæmpPillerne) visPille(b)` (`js/beskeder.js` linje 79) | Rigtigt: "Opdaget: Hydrogen" i "Dit første atom" ses kun i loggen |
| 9. "‹ mindre · større ›" | `js/gaader.js` linje 255 | Rigtigt |
| 10. Kantudglatning | `scene3d.js` linje 86-87: Udglatning i gløden (`samples: 4` på komponistens billede) kostede ca. 40 % i testbrowseren. `antialias` på lærredet virker slet ikke, når gløden tegner (står i [rodårsagerne](../erfaringer/rodaarsager.md)) | Rigtigt. **Skærpet:** Prøvekontakten `?aa` skal slå `samples` til i komponisten, ikke `antialias: true`, ellers måler man en indstilling, der ikke gør noget |
| Gåderne, svar 3 | Linjen "Videnskaben er ikke færdig. Det her er en af gåderne." (`js/gaader.js` linje 113). Fem gåder er bygget (`påSkinnen()`) | Rigtigt. Tallet tages fra `påSkinnen().length` |
| 1, 4, 5, 7 | Ikke tjekket linje for linje (de passer med de kendte fund og skærmbillederne). 4 og 5 skal mærkes på tabletten | Sandsynligt |

## 3. Hvor jeg er uenig eller vil skærpe
1. **"Næste ›" altid (fund 2):** Enig, med ét værn. Trykker han "Næste ›", før han har gjort noget, skal handlingen spilles (som "Vis mig" i dag) og "Så" vises, før man kan gå videre. Det står også hos Fable. Desuden: "Udforsk selv ›" må ikke tælle som "taget", så forløbet kan foreslås igen (B). Og ved prøven: Se efter, om han trykker sig igennem uden at gøre noget. Gør han det, skal "Næste ›" vente lidt længere, før den bliver tydelig.
2. **Højre panel i Værkstedet efter forløbet (fund 5):** Delvist uenig. Fanen Atom giver den hurtige besked ("Neutralt", "Stabil" og navnet), som gør laboratoriet forståeligt. Mit forslag er at vise toppen af fanen Atom (navn og to linjer) og lægge de tre andre faner bag ved. Det afgøres i Serie 2 nr. 5.
3. **"Se Solen lave helium" som den vigtigste knap (svar 1):** Uenig. Værkstedets kernesætning handler om selv at bygge, og I har lige rost netop den tur. Sendes han til Solen i minut fem, før han har bygget noget selv, lærer han "tryk videre". "Byg videre selv" bliver den vigtigste knap, Solen kommer som nummer to, og der kommer et vink, når han har bygget sit første atom selv. Prøven afgør det.
4. **Billedet først (fund 4):** Enig i tanken, men kun første gang man kommer til et sted i et besøg, ikke hver gang. Første berøring stopper ventetiden, og med `ROLIG` er der ingen ventetid. De 2-3 sekunder skal mærkes på tabletten.
5. **Én stemme (fund 1):** Enig som regel (A1). Men "Næste skridt"-boksen (`js/lag.js`) er lag 1 i mange dele. At lægge den ind i linjen under scenen er en beslutning for Serie 2 nr. 5, ikke en session for sig.
6. **Ord for skalaen under navnene på skinnen (svar 7.2):** Enig. Ordene skal passe til `størrelse` i dataene, og hvis tyngdekraften kommer, skal der stå, at målingerne stopper der (se [E19-noterne](E19-tyngdekraft-noter.md), afsnit 4.1).
7. **Molekyler starter med vand, og Ordbogen er foldet (svar 6):** Enig. Det hører til sporene Molekyler og Småting og kan tages, når de har en session.

## 4. Fundene og sporene (Opus' forslag, før jeres svar)
| Fund | Spor | Størrelse | Hvornår |
|---|---|---|---|
| 2. Forløbet som sti (og jeres punkter fra 17. november 2026) | Småting | mellem | Først (jeres svar 16. november 2026) |
| 9 og Gåde-linjen "den første af fem", ord for skalaen | Småting (Gåderne) | lille | Efter forløbet som sti |
| 6. Kun det byggede i Opdagelserne | Videnskabsfolkene | lille | Sammen med H3 (samme filer) |
| 3. Tilbage-knappen (også Gåderne) | Småting | mellem | Når I har prøvet den på tabletten (to minutter) |
| 8 og grebet "Grundstoffet flyver hjem" | Forløb | lille til mellem | Efter forløbet som sti (rører `js/forloeb.js` og `js/beskeder.js`) |
| 4. Billedet først | Solsystemet og Kosmos | lille | Når det er mærket på tabletten |
| 10. Kantudglatning, kun målingen `?aa` | Småting | lille | Når som helst (I måler på tabletten) |
| 1, 5 og 7 | Forløb (Serie 2 nr. 5) | stor | Med byggeklodserne |
| Grebene "Det ved jeg nu", "Dit atom i menuen" og "Vidste du?" | Forløb og Småting | lille | Efter 8, ét ad gangen |

## 5. Jeres svar (17. november 2026)
- **Rettes nu, efter forløbet som sti:** de små greb i Gåderne og Opdagelserne (fund 9 og 6), det første grundstof fejres (fund 8 og grebet "Grundstoffet flyver hjem") og tilbage-knappen (fund 3, efter jeres prøve på tabletten). Alle tre var anbefalingen.
- **Venter:** billedet først og kantudglatning (fund 4 og 10), til de er mærket og målt på tabletten. Fund 1, 5 og 7 kommer med byggeklodserne (Serie 2 nr. 5). Mine tre indvendinger (afsnit 3.2-3.4) gælder, når de tages op.
- **Sporene: efter filerne** (anbefalingen), som i tabellen i afsnit 4: Gåderne og tilbage-knappen i Småting, Opdagelserne i Videnskabsfolkene sammen med H3, grundstoffet i Forløb.
- **Prompterne** står i [prompt-e20-rettelser.md](../prompt-e20-rettelser.md).
