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

## M2b (8. november 2026)

Tjekket af Opus mod faktagrundlaget og OpenStax 7.6 (åbnet igen 8. november 2026: "Dipole vectors are shown as arrows pointing along the bond from the less electronegative atom toward the more electronegative atom. The length of the arrow is proportional to the magnitude of the electronegativity difference"). Kortene (ca. 40 påstande) blev slået op i engelsk Wikipedia af en Sonnet-hjælpeagent (rå wikitekst med curl), og Opus vurderede hver påstand.

| Påstand (hvor) | Resultat | Kilde |
|---|---|---|
| Den mest elektronegative ende er δ−, kun ved forskel ≥ 0,4, C–H (0,35) ingen farve (3D, `ladninger`, "Hvorfor plus og minus?") | OK (spillets grænse, siges i nørd-teksten) | m2.md afsnit 1 og fælde 4, testet i `tests/molekyler.mjs` |
| Pilene går fra det atom, der trækker mindst, mod det, der trækker mest, og er længere, jo større forskellen er (kontakten "Pile", nørd) | OK | OpenStax 7.6 (citeret ovenfor) |
| CO₂: to polære bindinger, der ophæver hinanden, så den ikke er polær (ladningsteksten, opgaven, Ordbogen "Polær") | OK | OpenStax 7.6 ("The bond moments cancel because they are pointed in opposite directions") |
| Vand er polært, fordi det er bøjet (ladningsteksten) | OK | OpenStax 7.6 ("the molecular structure is bent because of the lone pairs on O, and the two bond moments do not cancel") |
| Polær/ikke polær for alle 17 (panelet "Polært") | OK: passer med målt dipol over 0 (CCCBDB), undtagen CO, som spillet kalder ikke polær med en linje i "Ærligt talt" | m2.md afsnit 3 og fælde 1, testet |
| Kulilte: C-enden er en lille smule minus, selvom O trækker hårdest ("Ærligt talt") | OK | m2.md fælde 1 (Wikipedia "Carbon monoxide") |
| Brintoverilte ville ikke være polær uden drejningen ("Ærligt talt") | OK | m2.md fælde 3 og 5, testet (flad: ikke polær) |
| Elektronegativitet: hvor hårdt et atom trækker i de delte elektroner (Ordbogen, "Hvorfor?") | OK | OpenStax 7.2 |
| δ er det græske bogstav delta, og δ+ og δ− er meget mindre end en hel ladning (Ordbogen) | OK | OpenStax 7.2 (partial charges) |
| H₂: den letteste gas, flydende H₂ og O₂ i rumfærgens hovedmotorer | OK | "Hydrogen" ("the lightest … element"), "RS-25" |
| O₂ ca. 21 %, N₂ ca. 78 %, CO₂ ca. 0,04 % af luften | OK (tør luft) | "Atmosphere of Earth" (20,95 %, 78,08 %, 0,04 %) |
| Planter laver oxygen med sollys | OK | "Photosynthesis" |
| N₂: reagerer næsten ikke ved stuetemperatur, bruges i madpakninger | OK | "Nitrogen" ("mostly unreactive at room temperature", "food packaging") |
| Cl₂: gulgrøn, farlig at indånde, PVC og dræber bakterier i vand | OK | "Chlorine" ("yellow-green", "poisonous", PVC 35-40 %, "water disinfection") |
| HCl: mavesyre er saltsyre | **Rettet** til "mest saltsyre" (mavesyren har også K⁺ og Na⁺) | "Gastric acid" |
| Vand dækker ca. 71 %, kan opløse salt, fordi det er polært | OK | "Water" (71 %), "Properties of water" (polær, godt opløsningsmiddel) |
| Brintoverilte renser sår og bleger hår | **Rettet**: sår er fjernet (brugt før, virkningen er omstridt). Nu "blege hår og dræbe bakterier" | "Hydrogen peroxide" ("bleaching agent, and antiseptic … 3%–6%", "conflicting evidence on … wound healing") |
| CO₂: man ånder den ud, planterne tager den op, bobler i sodavand | OK | "Carbon dioxide" |
| CO: dannes ved forbrænding uden nok luft, farveløs og lugtfri, kulilte-alarmer | OK | "Carbon monoxide", "Carbon monoxide poisoning" |
| CO sætter sig ca. 200 gange fastere i blodet end oxygen | **Rettet** til "over 200 gange" (artiklen siger både ca. 200 og ca. 240) | "Carbon monoxide poisoning" |
| Metan: det meste af naturgassen, dannes i moser og i køers maver | OK | "Methane" ("main constituent", "Wetlands", "Marsh gas", "cattle belch out methane") |
| Ammoniak: skarp lugt, ca. 70 % til kunstgødning, i nogle rengøringsmidler | OK | "Ammonia" |
| Ethan: næststørste del af naturgassen | OK | "Ethane" ("1–6% … second only to methane") |
| Søer af metan og ethan på Titan | **Rettet** til "søer, som nok er flydende metan og ethan" | "Titan (moon)" ("probably of liquid methane and ethane") |
| Ethen: plantehormon, der får frugt til at modne, polyethylen | OK | "Ethylene" |
| Ethyn: over 3.300 °C med ren oxygen, svejse og skære | OK (3600 K ≈ 3.327 °C) | "Acetylene" |
| Methanol: giftig at drikke, kan gøre blind, industri og brændstof | OK | "Methanol" |
| Ethanol: alkoholen i øl og vin, håndsprit, brændstof | OK | "Ethanol" |
| HCN: meget giftig, findes på Titan, kan have været en byggesten til livets første molekyler | OK (allerede forsigtigt skrevet: "kan have været") | "Hydrogen cyanide" ("highly toxic", Titans HCN-sky, "possible relevance to the origin of life") |
| Dimethylether har samme atomer som ethanol og er en drivgas i spraydåser (opgaven "Byg ethanol") | OK | "Dimethyl ether" ("isomer of ethanol", "colorless gas", "aerosol propellant") |
| Metan 109,5°, vand ca. 104,5° (opgaverne) | OK | CCCBDB (m2.md), "Tetrahedral molecular geometry", "Water" |

**Ny fælde:** "Brintoverilte renser sår" står i mange ældre tekster, men brugen er gammel og omstridt (Wikipedia "Hydrogen peroxide"). Skrevet ind i `docs/erfaringer/fakta-faelder.md`.
