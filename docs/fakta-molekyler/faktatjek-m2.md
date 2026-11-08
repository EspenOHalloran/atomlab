# Faktatjek af Byg molekyler (Molekyler M2)

*Tallene og kilderne står i [m2.md](m2.md). Her står tjekket af teksterne i spillet.*

## M2a (8. november 2026)

Tjekket af Opus mod faktagrundlaget (CCCBDB, OpenStax 7.2, 7.3 og 7.6 og Wikipedia, alle åbnet i Trin 0) og én ny opslag i OpenStax 7.2. Ingen hjælpeagenter (ca. 25 påstande, men næsten alle står allerede med kilde i m2.md).

| Påstand (hvor) | Resultat | Kilde |
|---|---|---|
| Begge kerner trækker i det delte par, derfor holder atomerne sammen (`bygBinder`, Ordbogen "Kovalent binding") | OK | OpenStax 7.2: "The strong attraction of each shared electron to both nuclei stabilizes the system" (åbnet 8. november 2026) |
| H laver én binding, O to, N tre, C fire, Cl én (paletten, `bygBinder`, "For nørder") | OK | OpenStax 7.3, m2.md afsnit 2 |
| C, N og O ender med 8 elektroner, H med 2 (oktetreglen, nørd i `bygBinder`) | OK | OpenStax 7.3 |
| O₂ har to elektroner uden makker, flydende oxygen hænger på en magnet ("Ærligt talt", `bygBinder`) | OK | m2.md fælde 2 (Wikipedia "Oxygen") |
| Prik-reglen kan ikke bygge kulilte, det ene af de tre par kommer helt fra oxygen ("Ærligt talt") | OK | m2.md fælde 1 (Wikipedia "Carbon monoxide") |
| Brintoverilte er vredet som en halvt åben bog, den enkle model gør den flad ("Ærligt talt", formen) | OK | m2.md fælde 3 (CCCBDB 119,8°/111,5°, Wikipedia "nonplanar"). Spillet skriver ingen vinkel. |
| Vand er bøjet, ca. 104,5° (formen, `bygForm`, nørd) | OK | CCCBDB 104,48° |
| Tetraeder 109,5° (metan, `bygForm`) | OK | CCCBDB 109,47° |
| Ammoniak er en lav pyramide, ca. 107° | OK | CCCBDB 106,67° |
| De frie par skubber hårdere end bindingerne (`bygForm`, formteksterne) | OK | OpenStax 7.6 ("lone pair-lone pair > lone pair-bonding pair > bonding pair-bonding pair") |
| CO₂ er lige, kulstof har ingen frie par | OK | CCCBDB 180°, OpenStax 7.6 |
| Ethen er fladt, ethan forskudt, ethyn og HCN lige, methanol og ethanol bøjet ved O | OK | CCCBDB (m2.md afsnit 3) |
| De frie par skubber 1,245 gange så hårdt, valgt så vand får 104,5°, ammoniak får 106,7° af sig selv (nørd) | OK: spillets eget tal, og det står, at det er valgt. Modellen giver 106,74°, målt 106,67°. | min udregning (m2.md afsnit 4) og `tests/molekyler.mjs` |
| Bindingerne har længder i det rigtige forhold (nørd) | **Rettet** til "omtrent i det rigtige forhold (de målte, hvor de kunne slås op)": C–Cl, N–O, O–Cl osv. er ikke slået op, de er et skøn. | m2.md "mindst sikker på" |
| Oktetreglen passer på alle molekylerne, "undtagen at O₂ har to elektroner uden makker" (nørd i `bygBinder`) | **Rettet**: O₂ følger oktetreglen i prik-modellen. Ny tekst: reglen kan ikke se, at O₂ har to elektroner uden makker. | m2.md fælde 2 |
| Nitrogens tripelbinding er så stærk, at nitrogen næsten ikke reagerer (Ordbogen "Tripelbinding") | **Rettet** til "… ved stuetemperatur" | Wikipedia "Nitrogen": "mostly unreactive at room temperature" (m2.md afsnit 6) |
| Teksterne ved det ulovlige: H har kun én elektron, Cl seks andre i frie par, O fire andre i to frie par, N et frit par, C fire i par | OK | m2.md afsnit 2 (tabellen med yderste elektroner) |
| "Reglerne passer" er ikke det samme som "molekylet findes" (teksten ved ukendte molekyler) | OK | m2.md fælde 6 |
| Kuglerne er tegnet mindre end atomerne, og elektronskyerne går ind i hinanden ("Ærligt talt") | OK (forenkling, siges ærligt) | OpenStax 7.2 (orbitalerne overlapper) |
| VSEPR = Valence Shell Electron Pair Repulsion (nørd i `bygForm`) | OK | OpenStax 7.6 |
| Molekyle: to eller flere atomer, der holder sammen, fordi de deler elektroner (Ordbogen) | OK som forenkling (salt er en krystal, ikke molekyler, som "Giv elektroner" siger) | OpenStax 7.2 |

**Ingen nye fælder** ud over dem fra Trin 0 (står allerede i `docs/erfaringer/fakta-faelder.md`).
