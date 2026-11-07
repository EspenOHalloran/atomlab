# Plan: Verdenerne i menuen (K4)

*Startet 7. november 2026 i en drøftelse af idéerne (sporet Småting). Beslutningen hører til sporet **Menuen** ([lige-nu/menuen.md](lige-nu/menuen.md)). Den står i sin egen fil, fordi K2 var i gang i [plan-menu.md](plan-menu.md) samtidig. Byggeriet startes med [prompt-menu-k4.md](prompt-menu-k4.md).*

## Hvorfor
Menuen har 8 dele, og 12-15 er på vej (Kvantefysik, Ild, Liv, Elektricitet og radio, Gåderne, Videnskabsfolkene, Tidslinjen …). Det kan ringen fra K1 ikke rumme pænt, for vinklen mellem kortene er 360° delt med antallet. Kosmos har også 12 fænomener på én liste, og flere er på vej.

## Jeres svar (7. november 2026)
- **Verdener i ringen:** Ringen får 5 kort (senere 6), ét pr. verden. Når en verden står forrest, vises dens dele som små kort lige under. Man trykker direkte på en del, så der stadig kun er ét tryk ind (ingen mappe og ingen ekstra skærm). Har en verden kun én del, går man lige ind.
- **Bygges lige efter K2** (ikke først efter Molekyler M2). Det betyder, at nogle verdener har kun én eller to dele i et stykke tid.
- **Elektricitet står mellem Kernerne og Rummet** (ioner → strøm → lyn → radiobølger fra rummet). Når Ild og liv kommer, står Ild og liv mellem Kernerne og Elektricitet (som "Kemi og liv" i jeres valg).
- **Molekylerne hører til atomerne** (jeres spørgsmål, Opus' svar og jeres valg): Verdenen hedder **Atomer og molekyler**, og molekylerne ligger i Værkstedet med fanerne "Byg et atom | Byg et molekyle" (to måder indeni: "Del elektroner" og "Giv elektroner", det, der hed Byttebørsen). Detaljerne står i [plan-molekyler.md](plan-molekyler.md). **Ild og liv** kommer først i ringen, når Ild eller Liv findes. Indtil da er der 5 verdener.
- **Svar i K4 Trin 0 (7. november 2026, efter billedet af idéen):** Billedet blev lavet i to udgaver på pc og tablet på højkant: A (delene som små kort under verdenen) og B (delene som knapper inde i verdenens kort).
  - **Udseende: B.** Verdenens kort forrest bliver højere og har én knap pr. del (ikon, navn og en lille pil ›). Så ligner verdenens kort en kasse med knapper og ikke selv en knap. En verden med kun én del (Elektricitet, Biblioteket) har ingen knapper: hele kortet åbner delen. Kortene til siden er som i dag (uden knapper). På billedet blev pladsen til ringen ca. 96 px lavere på pc og tablet, så kortet ikke går ned over docken.
  - **Baggrunden: ét motiv pr. verden.** Atomer og molekyler: elektronskyerne. Kernerne: stjernen, der bobler. Elektricitet: ionerne. Rummet: planetbanerne. Biblioteket: ordene. Reaktorbassinet, det periodiske system og galaksen bruges ikke indtil videre, men koden bliver i `js/menubaggrund.js`.
  - **Docken og ✓:** Docken viser de 5 verdener. En del får ✓ på sin knap, når den er klaret, og verdenen får ✓, når alle dens dele er klaret. "Din fremgang" viser alle delene samlet under deres verden.
  - **Start:** Ringen starter på verdenen for den del, man sidst var i (`atomlabSidsteDel`), og den dels knap har en svag glød og en lille prik.
  - **Navnene:** Forslagene bruges nu (Atomer og molekyler, Kernerne, Elektricitet, Rummet og Biblioteket). Jeres søn vælger bagefter på tabletten mellem dem og bud 2: Byggeklodserne, Atomkernerne, Strøm og lyn, Universet og Biblioteket (spørgsmålet står i "Ikke afprøvet").
  - **Kosmos indeni:** Grupperne i Kosmos' liste (fx "Stjernernes liv", "Sorte huller og rumtid") bliver en egen, lille opgave efter K4 i sporet Solsystemet og Kosmos.
  - **Antistof:** under Kernerne (beta-plus-henfald, positronerne fra Solens fusion og PET-scanning). Gåden om, hvorfor der er mere stof end antistof, får et kort afsnit dér og måske et kort fænomen i Kosmos senere.

## Verdenerne (rækkefølgen er stadig fra det mindste til det største)
| Verden | Dele nu | Dele senere |
|---|---|---|
| ⚛️ Atomer og molekyler | Atomværkstedet (med fanerne "Byg et atom" og "Byg et molekyle"), Det periodiske system | Kvantefysik (med kvantecomputeren) |
| ☢️ Kernerne | Stjerneovnen, Reaktoren | Tjernobyl (i Reaktoren), måske Antistof |
| 🔥 Ild og liv (først, når Ild eller Liv findes) | – | Ild, Liv med DNA |
| ⚡ Elektricitet | Batteriet | Strøm og spænding, magnetisme, radiobølger, lyn, nerver |
| 🔭 Rummet | Solsystemet, Kosmos | Gåderne, Planet X (Tid og rum ligger i Kosmos) |
| 📚 Biblioteket | Ordbogen | Videnskabsfolkene, Tidslinjen, Uddrag fra gamle bøger |

Navnene er forslag, som jeres søn vælger mellem senere (se Jeres svar).

## Åbent (alle punkter afgjort i K4 Trin 0, 7. november 2026, se Jeres svar)
1. ✅ **Navnene på verdenerne:** Er det ord, en 13-årig har lyst til at trykke på? Forslag: Lad sønnen vælge mellem 2-3 bud pr. verden.
2. ✅ Afgjort 7. november 2026: Molekylerne ligger i Værkstedet under Atomer og molekyler (se Jeres svar).
3. ✅ **K2's baggrunde:** Skal baggrunden følge verdenen (5-6 baggrunde) eller delen, man peger på under den?
4. ✅ **Docken og "Din fremgang":** Viser docken verdenerne eller alle delene? Får en verden et ✓, når alle dens dele er klaret?
5. ✅ **Start på den del, man sidst var i** (`atomlabSidsteDel`): Ringen drejer til verdenen, og delen er fremhævet?
6. ✅ **Kosmos indeni:** Skal Kosmos' liste deles i under-punkter som i Solsystemet (fx "Stjernernes liv", "Sorte huller og rumtid")? Det kan være en egen, lille opgave efter K4.
7. ✅ **Antistof:** under Kernerne (kobler til beta-plus og PET-scanning) eller som fænomen i Kosmos (som i planen)?

## Trin
- [x] **K4 Trin 0:** Svar på punkterne under Åbent og et billede af idéen (lavet 7. november 2026, svarene står under Jeres svar).
- [ ] **K4 (venter på jeres go):** Verdenerne i ringen (udgave B, stadig bag `?karrusel`, hvis K3 ikke er lavet). Testen `karrusel` udvidet.
- [ ] **K3** (ringen bliver standard) kommer efter K4, så gitteret kun fjernes én gang.
