# Lige nu: Tid og rum

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i `docs/arkiv/historik/tid.md`. Højst ca. 5 KB. Sidst opdateret: 8. november 2026.*

**Senest lavet (8. november 2026): Jeres ønsker til "Rejsen i tid" (efter T3).** I `js/kosmos/tid.js` og `js/data/tid.js`:
- **"Hurtigere end lyset? Nej!"** (jeres spørgsmål: 4 lysår på 21 dage): et nyt emne øverst, der henviser til T3's "Set fra skibet" med tre trin: set fra Jorden (turen tager 4,3 år, et lysglimt sendt samtidig kommer kun knap 4 timer før, men dit ur går 71 gange langsommere), set fra skibet (vejen er skrumpet til 0,061 lysår) og "begge dele er rigtige". "Lige nu" siger det samme kort med de rigtige tal for målet og farten (`forspring`, `forspringTekst`), før afgang, ved målet og hjemme.
- **Målet er tre kontakter** (🎯 Alpha Centauri, Mælkevejens centrum, Andromeda), hvor præcis én er tændt, i stedet for skyderen "Mål". Skyderen "Fart" hedder nu "Fast fart".
- **"Fast fart eller 1 g?"**: T3's emne "Hvorfor tager det år med 1 g?" hedder nu sådan og forklarer også fast fart (folder sig stadig ud med 1 g), og "Lige nu" siger før afgang, hvad den valgte måde betyder (fast fart er snyd, 1 g er den realistiske). Alternativet til 1 g er skyderen "Fast fart".
- **Lysuret trin for trin** (bjælken ‹ og "Næste", `LYS_TRIN`): 1 Et lysur (kun skibets), 2 Set fra Jorden, 3 Den skrå vej er længere (står stille med den lige og den skrå vej, 2 gange så lang), 4 Uret går langsommere (tæl tikkene), 5 Alt om bord følger med (skyderen "Fart i lysuret": 0, 50, 87, 95 og 99 %). Lysuret har sin egen fart (87 %, γ = 2): Ved rejsens 99,99 % fór spejlene mange gange hen over billedet for hvert tik, så zigzaggen var umulig at forstå. Billedet fra Jorden følger nu spejlene, så de aldrig forsvinder ud af det.
- Faktatjek: alle tal regnet efter med `js/data/tid.js` mod fakta-tid.md (22 dage, 3,8 timer, 71, 0,061 lysår, 95 % midtvejs med 1 g, over 96 % efter 2 år, γ = 2 ved 86,6 %).
- Test: `tests/tid.mjs` (alle T3's tjek og de nye).

**Næste: intet. Sporet er lukket for nu (besluttet 8. november 2026).** T4, udsigten fra cockpittet (stjernerne samler sig foran, blå foran og røde bagude, en shader i familie med `js/kosmos/linse.js`), er ikke lavet, men ligger som en mulig udvidelse i fremtiden. Prompten er [prompt-tid-t4.md](../prompt-tid-t4.md), og den kan bruges uændret, hvis I en dag giver go. Artefaktet "AtomLab Overblik" opdateres med, at "Rejsen i tid" er færdig (T1-T3).

**Spørgsmål til jer:** ingen lige nu.
