# Faktagrundlag: Kvantecomputeren (afsnit 5 i Kvantefysik)

*Afsnit 5 i [fakta-kvantefysik.md](../fakta-kvantefysik.md), lagt i sin egen fil, fordi tallene skal slås op igen, før de bruges ("Tjek igen" i afsnit 9 dér). Lavet 13. november 2026 af Fable. Sikkerheden (**S**, **RS**, **U**) og kilderne er forklaret øverst i hovedfilen. Fælderne om kvantecomputeren står i afsnit 7 dér.*

## Sådan stod det 13. november 2026
**Idéen (S, lærebogsviden og regnet):**
- En **qubit** kan tegnes som en pil på en kugle (Bloch-kuglen): op er 0, ned er 1. En måling giver altid 0 eller 1. Chancen for 0 er cos²(θ/2), hvor θ er vinklen fra toppen: 100 % i toppen, 75 % ved 60°, 50 % ved ækvator. Efter målingen peger pilen på svaret.
- **Superposition** er altså en bestemt retning, ikke "begge dele". Tilfældet kommer først ved målingen. Vis det sådan: En kvart omgang fra toppen giver 50/50. To kvarte omgange *uden at måle imellem* giver altid 1. En mønt, der kastes to gange, er stadig tilfældig. Måler man imellem, bliver qubitten også tilfældig (som måleren ved sprækkerne).
- Hvor pilen peger rundt om kuglen (fasen), ses ikke i én måling, men afgør, om to veje forstærker eller udslukker hinanden. Det er **interferens**, og det er den, algoritmerne bruger.
- Kuglen gælder kun én qubit. **Sammenfiltrede** qubits kan ikke tegnes som hver sin pil: n qubits kræver 2ⁿ tal. Ved 300 qubits er det 2 × 10⁹⁰, flere end atomerne i det synlige univers (ca. 10⁸⁰). Men man kan kun læse n bits ud til sidst.
- **God til (i teorien):** at efterligne molekyler og materialer (Feynmans idé, 1981) og at dele store tal i primtal (Shor, 1994). Søgning bliver kun kvadratisk hurtigere (Grover: √N skridt, og det er bevist, at det ikke kan gøres bedre). **Ikke god til:** film, spil, internet og regneark. Den er ikke "en hurtigere computer".

| Hvad | Tal | Dato | Kilde | |
|---|---|---|---|---|
| Google Sycamore | 53 qubits, 200 sekunder mod "10.000 år" på en supercomputer. IBM svarede 2,5 døgn. I 2024 regnede Google selv med 6 sekunder | 2019, 2024 | Wikipedia "Quantum supremacy" | RS |
| Google Willow | 105 qubits. Fejlen falder 2,14 gange, hver gang koden gøres et trin større. Én "logisk" qubit af 101 fysiske lever 2,4 gange længere end den bedste enkelte | 2024 (Nature 638, 920, 2025) | arXiv:2408.13687 | S |
| Willows prøve: "5 minutter mod 10²⁵ år" | opgaven er valgt, fordi den er svær for almindelige computere. Ingen har brug for svaret | dec. 2024 | Googles blog, fra hukommelsen | RS |
| Quantinuum Helios | 98 ioner (barium), fejl i porte med to qubits: 0,079 % | nov. 2025 | arXiv:2511.05465 | S |
| IBM i drift | Heron (156 qubits) og Nighthawk (120 qubits) | 13. nov. 2026 | ibm.com/quantum/hardware | S |
| IBM's plan | Kookaburra 2026 (første modul med fejlrettet hukommelse), Starling 2029 (200 logiske qubits, 100 millioner porte), Blue Jay 2033 eller senere (2.000 logiske) | læst 13. nov. 2026 | ibm.com/roadmaps/quantum | S (at det er planen) |
| Atomer i lysfælder | 6.100 atomer holdt fast som qubits (Caltech). Ikke en computer endnu | Nature 647, 60 (2025) | arXiv:2403.12021 | S |
| Største tal delt med Shors algoritme | **21** (2012). 15 i 2001 (IBM, 7 qubits). Selv de forsøg "compile the circuit using prior knowledge of the solution" | uændret nov. 2026 | Wikipedia "Shor's algorithm"; søgning | RS |
| Hvad skal der til for at bryde RSA-2048? | 20 millioner qubits i 8 timer (2019) → under 1 million i under en uge (maj 2025) → "as few as 10,000" atom-qubits, men så tager det meget længere (marts 2026) | regnestykker, ingen maskine | arXiv:1905.09749, 2505.15917, 2603.28627 | S |
| Samme, nyeste skøn | 22.593 "cat qubits" på 3,14 døgn (firmaet Alice & Bob) | okt. 2026 | ePrint 2026/2665, kun set i søgeresultat | U |
| Nye koder | USA's NIST udgav 13. august 2024 de første tre standarder for kryptering, som kvantecomputere ikke menes at kunne bryde. Signal har brugt sådan kryptering siden 2023 og Apples iMessage siden 2024 | 2023-2025 | Wikipedia "NIST Post-Quantum Cryptography Standardization", "Post-quantum cryptography" | RS |
| Kulde | Superledende qubits køles til under 0,015 K: ca. 180 gange koldere end rummet mellem stjernerne (2,7 K) | – | Wikipedia "Superconducting quantum computing"; regnet | RS |
| "Kvantefordel" | IBM og partnere meldte 30. juli 2026 tre beregninger ud. En anden gruppe regnede den ene efter på 37 minutter på grafikkort (13. august). Ikke afgjort | nov. 2026 | søgeresultater, ikke læst i kilden | U |
| Danmark | **Magne** (ejet af QuNorth, betalt af EIFO og Novo Nordisk Fonden, bygget af Atom Computing og Microsoft): 1.225 atomer, mål 50 logiske qubits, planlagt klar omkring årsskiftet 2026/27. Ikke meldt færdig | nov. 2026 | pressemeddelelser via søgning | U |
| Sammenfiltring | målt uden smuthuller første gang i Delft i 2015 (1,3 km) og fra en satellit over 1.200 km i 2017. Nobelpris 2022 (Aspect, Clauser, Zeilinger) | – | Wikipedia "Bell test", "Quantum Experiments at Space Scale"; nobelprize.org | RS, S (prisen) |

**Sådan kan det siges i november 2026:** "Kvantecomputere findes, men de er små og laver fejl. De har vundet over almindelige computere i opgaver, der er lavet til dem. Ingen har endnu løst noget nyttigt, som en almindelig computer ikke kan, uden at andre har sået tvivl om det."
