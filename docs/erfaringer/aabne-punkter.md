# Åbne punkter

- **Fra gennemgangen** i oktober 2026 mangler stadig: forslagene i afsnit B (links mellem delene, app på hjemmeskærmen og "Test dig selv". Fremgangen i menuen og guiden i Batteriet er lavet), tilgængelighed (D8), fælles kode (D9), mindre download (D11) og ubrugt kode (D12). Se [gennemgang-2026-10.md](../gennemgang-2026-10.md).
- Ikke testet med rigtig mus og rigtige fingre: hvordan det føles at sigte i Stjerneovnen, og hvor glat rejsen ind i Solen kører. Det skal prøves af jer. Det samme gælder ordforklaringerne og de fire nye Kosmos-fænomener.
- **Uopklaret:** Hvorfor "Vis en kædereaktion" døde ud netop i guide-testen (2 gange i ca. 14), men aldrig i 400 forsøg uden for den. Med tre sikre generationer er det ikke set siden. Dukker det op igen, så log reaktorens tilstand lige før "Vis mig".
- **To tests ad gangen** er kun målt stabilt i to hele kørsler. Hold øje med "OBS"-linjerne fra `koer-alle.mjs`.
- **Kædereaktionen efter "Vis mig" går oftere i stå end "ca. 1 %"** (målt i F1, 23. oktober 2026, med 100 forsøg og stavene på 50 %):
  - 6 gik i stå inden for 15 sekunder, og 11 inden for 2 minutter.
  - Testen `reaktor` tillader højst 6 af 100, så den er på grænsen og kan begynde at fejle.
  - Testbillede 45 i `docs/fable/billeder/` er et af tilfældene.
- **`stjerneovn-mus` (rejsen starter) og `guide` ("pc: måleren i 3D-billedet") fejlede sammen med andre** (29. oktober 2026, kategorien som link, samlingen tog 27 minutter i stedet for ca. 10). Begge bestod alene, og ændringen rørte ingen af dem. I næste kørsel samme dag (fotonerne, kun tekst) fejlede `stjerneovn-mus` igen og `mars` ("Modlys": Solen står bag Mars) én gang, og begge bestod alene. I kørslen af Ordbogen fejlede `mars` igen under belastning ("Modlys" slået fra: Solen er tilbage) og bestod alene. `stjerneovn-mus` fejler altså tit under belastning. Ikke undersøgt endnu. Genskab det med fire travle CPU-løkker (som `batteri` og `beskeder`) og find den faste ventetid.
- **`fuldskaerm` ("pc: fuld skærm efter klik") fejlede én gang under belastning** i kørslen af Mars M8a (30. oktober 2026) og bestod alene. Ændringen rørte ikke fuld skærm. Hold øje med den.
- **`docs/fable/tablet/LISTE.md` passer ikke med filerne:** 08 er Pulsar, 09 Kilonova, 10 Rumtid, 11 Tyngdebølger, 12 Ormehul, og 14 er menuen i Chrome. Billedet af teksten i Formørkelser mangler.
