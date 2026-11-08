# Faktatjek: Molekyler M3 (knaldgas)

*8. november 2026, Opus (`/faktatjek`, under 30 påstande, så hovedsessionen tjekkede selv). Teksterne: "Hvorfor?"-kortene `knaldBakke`, `knaldKæde` og `knaldVarme` (`js/data/hvorfor.js`), panelet og "For nørder"/"Ærligt talt" (`#knaldInfo` i `index.html`), panelets tekster (`js/knaldgas.js`), opgaverne `byg-uden-gnist` og `byg-knaldgas` (`js/data/molekyler-byg.js`) og ordene aktiveringsenergi, radikal og kædereaktion (`js/data/ordbog.js`). Tallene står med kilder i [m3.md](m3.md).*

| Påstand | Resultat | Kilde |
|---|---|---|
| Et molekyle har ca. 0,04 eV fart-energi ved stuetemperatur | OK | 3/2 · k · T = 1,5 · 8,617·10⁻⁵ eV/K · 298 K = 0,0385 eV (min udregning) |
| Det koster 4,5 eV at bryde H₂ og 5,2 eV at bryde O₂ | OK | NIST (m3.md afsnit 2): 436,0 og 498,4 kJ/mol = 4,52 og 5,17 eV |
| De fleste stød er over 100 gange for svage | OK, rettet | 4,52 / 0,0385 = 117. Først stod der "stødene er over 100 gange for svage", men det hårdeste stød i boksen kan nå ca. 0,2 eV (testen), så nu står der "de fleste". |
| Knaldgas kan stå i årevis uden at brænde | OK | LibreTexts, "The Chemistry of Hydrogen": "a balloon filled with hydrogen and oxygen at room temperature will remain inert indefinitely" |
| Den mindste gnist, der kan tænde knaldgas, er ca. 0,007 mJ (hydrogen i luft ca. 0,02) | Rettet | Først stod der 0,02 mJ, men det tal er for hydrogen i **luft** (Wikipedia "Hydrogen safety"). For hydrogen og oxygen: "about 0.007 mJ" (Wikipedia "Oxyhydrogen", med kilde). |
| H + O₂ → OH + O giver to radikaler for ét (forgrening) | OK | LibreTexts (Gutow 5.19), m3.md afsnit 4 |
| Kædens trin lagt sammen: ét H bliver til tre, og der dannes to H₂O | Rettet | H + O₂ + 3 H₂ → 2 H₂O + 3 H kræver OH + H₂ to gange. Teksten sagde "de tre første", nu "trinene (det sidste to gange)". |
| Den rigtige reaktion har ca. 20 trin, fx også HO₂ og H₂O₂ | OK | fakta-molekyler.md afsnit 4 (Liang og Law 2018, ca. 20 trin), LibreTexts nævner HO₂. H₂O₂ er med i alle de store modeller (min viden, ret sikker) |
| 10,0 eV for fire vandmolekyler, ca. 2,5 eV for hvert | OK | NIST: 2 · 483,6 kJ/mol / 96,485 = 10,02 eV |
| 2 H₂ + O₂ → 2 H₂O giver 483,6 kJ (damp), et mol er ca. 6 · 10²³ | OK | NIST (CODATA), Avogadros tal |
| Bindingstabeller giver ca. 480-486 kJ | OK | m3.md afsnit 3 (OpenStax tabel 7.2) |
| Forskellen er den samme uanset vejen (Hess' lov) | OK | Termodynamik. Testen viser det for 60 forsøg (forskellen er altid 10,024 eV) |
| Mange tror, at energien kommer, når bindinger brydes | OK | Fælde 3 i fakta-molekyler.md (Boo 1998) |
| At bryde en binding koster altid | OK | OpenStax 7.5 (bindingsenergier er altid positive) |
| Bindingerne i "For nørder": 4,52, 5,17, 4,44 og 5,17 eV / 436, 498, 428 og 499 kJ/mol, tabellens gennemsnit ca. 464 | OK | NIST og OpenStax (m3.md afsnit 2) |
| To, der bliver til én (H + OH → H₂O), har brug for et tredje molekyle til energien | OK | Min viden (sikker): bevægelsesmængden og energien kan ikke begge passe med kun ét produkt, derfor skrives rekombination H + OH + M → H₂O + M i alle modeller |
| I virkeligheden går meget af varmen til drejning, vibration og beholderen | OK | Fysik (ekvipartition). I spillet bliver al varmen til fart, og det står i "Ærligt talt" |
| Rumfærgens og SLS-rakettens motorer brænder hydrogen og oxygen | OK | RS-25 (fakta-molekyler.md afsnit 4, NASA) |
| Bakkerne i spillet: H + O₂ ca. 0,75 eV, O + H₂ ca. 0,4, OH + H₂ ca. 0,2 (står kun i koden og m3.md) | OK, "ca." | H + O₂: målt ca. 62-79 kJ/mol (0,64-0,82 eV) i stødbølgeforsøg (fx Masten, Hanson og Bowman), og spillet skal mindst bruge 0,728 eV (det, trinnet koster). OH + H₂: ca. 17-25 kJ/mol (0,18-0,26 eV). O + H₂: ca. 37-43 kJ/mol (min viden, ret sikker). Kun søgeresultater, artiklerne er ikke læst. Ingen af tallene står i spillets tekster. |
| Ordene aktiveringsenergi, radikal og kædereaktion | OK | Definitioner (OpenStax kapitel 12 og LibreTexts). Under 260 tegn (248, 160 og 211) |

**Spillets egne tal** (ikke fakta, men sagt ærligt): gnisten (ca. 7,5 eV i spillet, fordi der kun er 6 molekyler), farten (al varme bliver til fart) og at kæden aldrig dør. Det står i "Ærligt talt".
