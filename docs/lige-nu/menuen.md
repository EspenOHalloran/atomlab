# Lige nu: Menuen

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/menuen.md](../arkiv/historik/menuen.md). Højst ca. 5 KB. Sidst opdateret: 8. november 2026 (K3).*

**Senest lavet (8. november 2026): K3, ringen er den almindelige menu.** Jeres go blev givet 7. november 2026. Ringen med verdenerne vises nu altid, og `?karrusel` er væk (der er ingen `?gammelmenu`). Fjernet: gitteret med 8 kort (og reglerne for det ved 1150, 820 og 560 px og under 500 px højde), de gule piller, linjen med tallene, citatet (og listen `MENU_CITATER`) og "Næste eventyr". "Start her" for en ny bruger står stadig på Atomværkstedets knap. ✓ på delene og "Start her" er flyttet fra main.js til karrusel.js, så alt om menuen står ét sted. `fremgangPrDel()` i main.js giver stadig tallene. Testene `system`, `solsystem`, `ordbog`, `kosmos`, `byttebors`, `henter` og `karrusel` er rettet: de tjekker nu ✓ og tallene i "Din fremgang" i stedet for de gule piller, og at det gamle er væk.

**Næste (venter på jeres go):**
1. **Jeres runde på tabletten** (nu uden `?karrusel`, spørgsmålene står i [ikke-afproevet.md](../ikke-afproevet.md)). Det, I vil have rettet i ringen, kan tages i en ny session med en kort tekst, fx "Ret menuen: …" (Opus, effort medium).
2. **Ild og liv** bliver en ny verden, når Ild eller Liv findes (se [plan-verdener.md](../plan-verdener.md), "En ny del"). Det laves sammen med den del, ikke i sporet Menuen.

**Spørgsmål til jer:**
- **Rækkefølgen:** Planen siger "fra det mindste til det største", men Atomer og molekyler står før Kernerne (som i jeres tabel), og kerner er mindre end atomer. Skal Kernerne stå først? Det er én linje i `js/karrusel.js`. Indtil I svarer, står den som i tabellen.
- Kører baggrundene glat på tabletten (mest Stjerneovnen), og er nogen af dem for kraftige eller for svage? Spørgsmålene står i [ikke-afproevet.md](../ikke-afproevet.md).
