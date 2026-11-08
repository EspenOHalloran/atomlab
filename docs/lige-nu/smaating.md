# Lige nu: Småting

*Spor i [oversigten](../lige-nu.md) til små rettelser på tværs, tests, dokumenterne og arbejdsgangen. Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/smaating.md](../arkiv/historik/smaating.md). Højst ca. 5 KB. Sidst opdateret: 8. november 2026.*

**Senest lavet (8. november 2026): Stabile tests og oprydning i de åbne punkter.** Jeres go til trin 1 i forslaget ("Risici og hurtige gevinster").
- **Otte tests, der fejlede nu og da, er rettet** (genskabt med fire travle CPU-løkker ved siden af, se [tests-og-vaerktoejer.md](../erfaringer/tests-og-vaerktoejer.md)): `ordforklaring` (fejlede hver gang alene: Playwrights egen rulning lukkede forklaringen), `solsystem` (rejseskiltet), `henter` (en fil holdes tilbage), `stjerneovn-mus` (pause, og rejsen ind i Solen fryses straks), `guide` og `reaktor` (kædereaktionen går tilfældigt i stå lige efter start) og `stjerneovn` (ikke genskabt, skriver nu, hvad der skete).
- **Reaktoren, "Vis mig":** De sikre neutroner bliver ikke længere suget op af stavene eller tabt ud af kernen. Med stavene på 90 % døde demoen ud i 95 af 150 forsøg før og i 0 nu. Hjælpens "Ærligt talt" siger det.
- **Grene:** 67 kan slettes, listen står i [grene-der-kan-slettes.md](../grene-der-kan-slettes.md). En kort klon fik dem til at se umergede ud, så hele historien skal hentes først.

**Spørgsmål til jer:** Reaktoren går i stå af sig selv lige efter "Start reaktoren" i ca. 1,6 % af gangene (8 af 500 inden for 4 sekunder, stavene på 50 %). Underteksten siger så "Kædereaktionen gik i stå", og guiden taler om en måler, der er væk. Mit forslag er, at neutronkilden bliver ved med at sende neutroner ind i de første sekunder, som hjælpen allerede siger, den gør. Alternativet er at lade det være (det er ægte tilfældighed). Testene tåler det nu.

**Næste:** Trin 2 i forslaget: faktatjek af `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md`, én ny session pr. fil med `/faktatjek`. Først skal I godkende de domæner, der mangler (fx NASA, se "Miljøet" i [aabne-punkter.md](aabne-punkter.md)).
