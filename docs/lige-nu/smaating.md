# Lige nu: Småting

*Spor i [oversigten](../lige-nu.md) til små rettelser på tværs, tests, dokumenterne og arbejdsgangen. Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/smaating.md](../arkiv/historik/smaating.md). Højst ca. 5 KB. Sidst opdateret: 8. november 2026.*

**Senest lavet (8. november 2026): Stabile tests og oprydning i de åbne punkter.** Jeres go til trin 1 i forslaget ("Risici og hurtige gevinster").
- **Otte tests, der fejlede nu og da, er rettet** (genskabt med fire travle CPU-løkker ved siden af, se [tests-og-vaerktoejer.md](../erfaringer/tests-og-vaerktoejer.md)): `ordforklaring` (fejlede hver gang alene: Playwrights egen rulning lukkede forklaringen), `solsystem` (rejseskiltet), `henter` (en fil holdes tilbage), `stjerneovn-mus` (pause, og rejsen ind i Solen fryses straks), `guide` og `reaktor` (kædereaktionen går tilfældigt i stå lige efter start) og `stjerneovn` (ikke genskabt, skriver nu, hvad der skete).
- **Reaktoren, "Vis mig":** De sikre neutroner bliver ikke længere suget op af stavene eller tabt ud af kernen. Med stavene på 90 % døde demoen ud i 95 af 150 forsøg før og i 0 nu. Hjælpens "Ærligt talt" siger det.
- **Grene:** 67 kan slettes, listen står i [grene-der-kan-slettes.md](../grene-der-kan-slettes.md). En kort klon fik dem til at se umergede ud, så hele historien skal hentes først.

**Bagefter, jeres svar ("Kilden bliver ved"):** Reaktoren gik i stå af sig selv lige efter start i ca. 1,6 % af gangene. Nu sender neutronkilden 2,5 neutroner i sekundet i de første 3 sekunder, og kædereaktionen kan ikke gå i stå imens. Med stavene på 50 % gik den i stå inden for 20 sekunder i 4 af 200 forsøg (før 38), og effekten ligger stadig i det grønne felt (median 9 mod 7). "Ærligt talt" i hjælpen siger det. Kun `reaktor` og `guide` er kørt (jeres ønske).

**Næste:** Trin 2 i forslaget: faktatjek af `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md`, én ny session pr. fil med `/faktatjek`. Først skal I godkende de domæner, der mangler (fx NASA, se "Miljøet" i [aabne-punkter.md](aabne-punkter.md)).
