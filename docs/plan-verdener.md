# Plan: Verdenerne i menuen (K4)

*Startet 7. november 2026 i en drøftelse af idéerne (sporet Småting). Beslutningen hører til sporet **Menuen** ([lige-nu/menuen.md](lige-nu/menuen.md)). Den står i sin egen fil, fordi K2 var i gang i [plan-menu.md](plan-menu.md) samtidig. Byggeriet startes med [prompt-menu-k4.md](prompt-menu-k4.md).*

## Hvorfor
Menuen har 8 dele, og 12-15 er på vej (Kvantefysik, Ild, Liv, Elektricitet og radio, Gåderne, Videnskabsfolkene, Tidslinjen …). Det kan ringen fra K1 ikke rumme pænt, for vinklen mellem kortene er 360° delt med antallet. Kosmos har også 12 fænomener på én liste, og flere er på vej.

## Jeres svar (7. november 2026)
- **Verdener i ringen:** Ringen får 5-6 kort, ét pr. verden. Når en verden står forrest, vises dens dele som små kort lige under. Man trykker direkte på en del, så der stadig kun er ét tryk ind (ingen mappe og ingen ekstra skærm). Har en verden kun én del, går man lige ind.
- **Bygges lige efter K2** (ikke først efter Molekyler M2). Det betyder, at nogle verdener har kun én eller to dele i et stykke tid.
- **Elektricitet står mellem Kemi og liv og Rummet** (ioner → strøm → lyn → radiobølger fra rummet).

## Verdenerne (rækkefølgen er stadig fra det mindste til det største)
| Verden | Dele nu | Dele senere |
|---|---|---|
| ⚛️ Atomerne | Atomværkstedet, Det periodiske system | Kvantefysik (med kvantecomputeren) |
| ☢️ Kernerne | Stjerneovnen, Reaktoren | Tjernobyl (i Reaktoren), måske Antistof |
| 🧪 Kemi og liv | Byttebørsen (i dag inde i Værkstedet) | Byg molekyler (M2), Ild, Liv med DNA |
| ⚡ Elektricitet | Batteriet | Strøm og spænding, magnetisme, radiobølger, lyn, nerver |
| 🔭 Rummet | Solsystemet, Kosmos | Gåderne, Planet X (Tid og rum ligger i Kosmos) |
| 📚 Biblioteket | Ordbogen | Videnskabsfolkene, Tidslinjen, Uddrag fra gamle bøger |

Navnene er forslag (se Åbent).

## Åbent (afgøres i Trin 0 af K4, med en anbefaling og jeres valg)
1. **Navnene på verdenerne:** Er det ord, en 13-årig har lyst til at trykke på? Forslag: Lad sønnen vælge mellem 2-3 bud pr. verden.
2. **Byttebørsen under Kemi og liv:** Den ligger i Værkstedet (`del = 'bytte'` i `js/vaerksted.js`) og har ingen egen adresse. Kortet skal kunne åbne Værkstedet direkte i Byttebørsen (fx `#vaerksted/bytte`). Bør den også stå under Atomerne, eller kun ét sted?
3. **K2's baggrunde:** Skal baggrunden følge verdenen (5-6 baggrunde) eller delen, man peger på under den?
4. **Docken og "Din fremgang":** Viser docken verdenerne eller alle delene? Får en verden et ✓, når alle dens dele er klaret?
5. **Start på den del, man sidst var i** (`atomlabSidsteDel`): Ringen drejer til verdenen, og delen er fremhævet?
6. **Kosmos indeni:** Skal Kosmos' liste deles i under-punkter som i Solsystemet (fx "Stjernernes liv", "Sorte huller og rumtid")? Det kan være en egen, lille opgave efter K4.
7. **Antistof:** under Kernerne (kobler til beta-plus og PET-scanning) eller som fænomen i Kosmos (som i planen)?

## Trin
- [ ] **K4 Trin 0:** Svar på punkterne under Åbent (et billede af idéen før byggeriet, som ved ringen).
- [ ] **K4:** Verdenerne i ringen (stadig bag `?karrusel`, hvis K3 ikke er lavet), testen `karrusel` udvidet.
- [ ] **K3** (ringen bliver standard) kommer efter K4, så gitteret kun fjernes én gang.
