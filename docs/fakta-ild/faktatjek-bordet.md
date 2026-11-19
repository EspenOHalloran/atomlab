# Faktatjek: Ild, laboratoriet "Bordet" (PR 1)

*18. november 2026, Opus (høj effort). Teksterne står i `js/data/ild.js` (PANEL, ZONER), `js/data/hvorfor.js` (`ildPlasma`, `ildSolen`, `ildVarmer`) og `index.html` (`#ild`: "Vil du vide mere?", "Ærligt talt" og hjælpen `#hjælpIld`). Fælderne i [fakta-faelder.md](../erfaringer/fakta-faelder.md) (Ild) og afsnit 12 i [fakta-ild.md](../fakta-ild.md) er læst først. Ca. 30 påstande: Det meste står i faktagrundlaget med **S** (Fable åbnede kilden). Dem, der var mærket **RS** eller **U**, er slået op igen her (Wikipedia er hentet med `action=raw` samme dag). W = engelsk Wikipedia.*

| Påstand | Kilde | Dom |
|---|---|---|
| Den varmeste del af et stearinlys er kanten (og lige over den blå bund), ca. 1.400 °C | W "Candle" (zone V "the flame is at its hottest, at around 1400 °C" og "just above the very dull blue part … about 1400 °C") | OK |
| Den gule del ca. 1.200 °C, lyser mest, men er ikke varmest | W "Candle" (zone IV "brightest zone, but not the hottest … around 1200 °C") | OK |
| Den mørke kegle om vægen: damp, der ikke brænder endnu, ca. 1.000 °C | W "Candle" (zone III "unburnt wax … around 1000 °C"). Faktagrundlaget skrev 600-1.000 °C (en ældre udgave). Teksten bruger kildens tal med "ca." | OK, forsigtigt |
| Et stearinlys giver ca. 80 watt varme, ca. 0,1 g i minuttet og ca. 13 lumen | W "Candle" (Hamins m.fl., NIST 2005: 77 W, 0,1 g/min, 13 lm, "almost a hundred times lower than an incandescent light bulb") | OK ("ca. 80") |
| Den hvide røg er stearindamp (en tåge af dråber), og en flamme i røgen lige over vægen løber ned og tænder lyset | Weizmann Institute (davidson.weizmann.ac.il, "a trail of hot wax vapor rising up from the wick", kun få sekunder), Steve Spangler, Flinn (søgeresultater, ikke alle åbnet). Faraday 1861 om dampen | OK |
| Pust: Man blæser flammen (varmen) væk fra brændstoffet og køler, ikke oxygenet væk | W "Fire" ("blowing hard on a flame will displace the heat of the currently burning gas from its fuel source"). Fælde 8 | OK |
| Lysslukkeren lukker for oxygenet, og så puster man ikke varm stearin ud | W "Candle" ("Placing the snuffer over the flame cuts off the oxygen supply", "The best way to avoid getting burned from splashed wax is to use a candle snuffer instead of blowing") | OK |
| Vand kan få den varme stearin til at sprøjte | Lysproducenterne ("Never use water to extinguish a candle"), noterne E17 punkt 1, W "Boilover" | OK |
| Under glasset går flammen ud med en god del oxygen tilbage | Faktagrundlaget afsnit 2 (U: tallet er ikke fundet). Teksten giver intet tal, og tiden under glasset er valgt (står i "Ærligt talt") | OK, forsigtigt |
| CO₂ er tungere end luft, skubber luften væk, og der er CO₂ i nogle ildslukkere | W "Carbon dioxide" ("heavier than air"), lex.dk "Slukningsmidler" (kulsyre, kvælende) | OK |
| Dugget på skeen er vand fra flammen, og det fordamper, når skeen bliver varm | Faraday 1861 ("just water — nothing but water"), W "Flame" (skeen: "water vapor deposition") | OK |
| Sod er små korn af kulstof, der gløder gult i flammen | W "Candle" ("radiative emission from hot soot particles"), W "Flame", Faraday | OK |
| Gasbrænderen: lidt luft giver en gul, sodende flamme, der er køligere, men lysere; luft nok giver blå, varmere og ingen sod | W "Bunsen burner" ("cooler but brighter yellow … leaves a layer of carbon", "the flame will burn hotter, appearing blue"), W "Flame" ("When enough air is supplied, no soot … the flame becomes blue") | OK |
| Det blå lys kommer fra CH og C₂, der lige er dannet, mest under ca. 565 nm (blåt og grønt) | W "Flame" | OK |
| Vægtløshed: Flammen bliver en lille, blå halvkugle med næsten ingen sod, frisk luft kommer kun langsomt ind | NASA "Candle Flame – 1g vs Microgravity" (2020, "soot-free and blue"), NTRS 20010074076 ("hemispherical") | OK |
| Stearinlys brændte på rumstationen Mir (1996) i op til 45 minutter | NTRS 20000005087 og 19970020585 (faktagrundlaget afsnit 10, S). Noterne E17 punkt 6 | OK |
| Kolde flammer, FLEX på Den Internationale Rumstation, 2012 | NTRS 20160000344, W "Cool flame" | OK |
| Ild er ikke plasma: typisk ca. ét molekyle ud af en milliard er en ion | ca. 10¹⁰ ioner pr. cm³ i en støkiometrisk flamme af kulbrinter og luft (DTIC-rapporter, søgeresultat), op til ca. 10¹²/cm³ de tætteste steder (patent, søgeresultat), mod ca. 4 · 10¹⁸ molekyler pr. cm³ ved 1.700 K (udregning). Teksten siger "typisk" | OK, forsigtigt |
| Ionerne kommer fra kemien (CH + O → CHO⁺ + e⁻), ikke fra varmen, og flammen bøjer i et stærkt elektrisk felt | Patentet i søgningen ("chemi-ionization … CH + O → CHO+ + e−"), W "Flame" (link: "A candle flame strongly influenced and moved about by an electric field due to the flame having ions"), W "Fire" (Fukuyama 2019) | OK |
| Solen: fusion, ca. 27 MeV pr. heliumkerne mod ca. 8 eV pr. metanmolekyle (over tre millioner gange) | pp-kæden 26,7 MeV (lærebogstal), metan 802,6 kJ/mol med vandet som damp = 8,3 eV (faktagrundlaget afsnit 3, NIST). Fælden "brænder om stjerner" er fulgt | OK |
| Én spaltning ca. 200 MeV, over 20 millioner gange så meget som ét metanmolekyle | Ordbogens `mev`, 200 MeV / 8,3 eV = 24 millioner | OK |
| En person, der sidder stille, giver ca. 100 watt, lidt mere end et stearinlys. 2.000 kcal i døgnet er ca. 97 watt | Udregning (2.000 · 4.184 J / 86.400 s = 96,9 W), noterne E17 punkt 8 ("lidt mere end et stearinlys") | OK |
| Ånding har samme regnskab (CO₂ og vand), men i mange små trin ved 37 °C og uden flamme | Faktagrundlaget afsnit 3 (RS), fælde 15 | OK |
| Atomerne i luppen: C₂H₄ + 3 O₂ → 2 CO₂ + 2 H₂O (2 C, 4 H og 6 O på begge sider) | Afstemt | OK |
| Stearin er mest lange kæder af kulstof og hydrogen, og lysene er af stearin, paraffin eller en blanding | lex.dk "Stearin", W "Candle", noterne E17 punkt 4 | OK |
| Vægens spids brænder langsomt væk | W "Candle" ("the end of the wick gets trimmed by itself through incineration") | OK |

**Rettet undervejs:** "Varmer du som et stearinlys eller to" blev "Lidt mere" (77 W mod ca. 100 W). Gasbrænderens temperaturer er ikke skrevet (W "Flame" giver 900-1.600 °C og en gul flamme på ca. 2.000 K, kilderne er uenige), så panelet viser luften og soden i stedet. Ingen nye fælder.
