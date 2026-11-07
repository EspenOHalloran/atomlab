# Erfaringer: Uranus og Neptun

*Fra planen 7. november 2026 ([plan-uranus-neptun.md](../plan-uranus-neptun.md)). Nye erfaringer skrives ind her, mens UN1-UN6 bygges.*

## Kilderne
- **Tjek miljøets domæner, før arbejdet går i gang:** Miljøet "atomlab" var blevet lavet om af en anden session (Molekyler M2), så kun fem domæner var åbne, og alle NASA- og USGS-domænerne fra Mars og Jupiter var væk. En hurtig curl-løkke over de domæner, opgaven skal bruge, fandt det på et øjeblik, og brugeren fik en liste til at kopiere ind.
- **Hubbles kort over isgiganterne er grumsede:** OPAL har kun 2 pixel pr. grad (721 × 361), mod 10 pixel pr. grad for Jupiter. Se de små udgaver (`html_pngs/...-small.png`), før der planlægges med et foto som kort. Uranus-kortet fra 2025 har kun den nordlige halvdel (resten var i mørke).
- **OPAL's adresser:** Filerne ligger under `archive.stsci.edu/missions/hlsp/opal/cycleNN/<planet>/`, ikke under `hlsps/opal/...` (gav 404). Find dem på siden `archive.stsci.edu/hlsp/opal/opal-<planet>-cycle-NN`.
- **USGS har ingen globale kort over Uranus' fem måner,** kun kontrolnet og navne. Triton findes i farver (600 m pr. pixel). Mappelisten på `planetarymaps.usgs.gov/mosaic/` sender videre til S3-spanden `asc-pds-services`, som kan listes med `?list-type=2&prefix=mosaic/<navn>`.
- **Solar System Scope:** Hent med en ærlig User-Agent (fx `AtomLab-billedvaerktoej`). Et forsøg med en falsk browser og en falsk henvisning blev stoppet af den automatiske sikkerhedskontrol, og det skal ikke prøves igen.
- **Wikipedias API svarede 429 efter få opslag** (også med User-Agent). Wikiteksten (`index.php?title=...&action=raw`) virkede bagefter. Læs hellere én artikels wikitekst end mange API-kald.
- **JPL Horizons' API** (`ssd.jpl.nasa.gov/api/horizons.api`, kolonne 15) giver Solens bredde på en planet for enhver dato. Den viste, at Uranus' solhverv er i 2030 og ikke i 2028, som mange skriver. Regn efter i stedet for at stole på det tal, alle gentager.
- **Vindformlerne findes i arXiv,** selvom de oprindelige artikler (Icarus) er lukkede: Neptuns formel står i tabel 1 i arXiv:1312.2676, og Uranus' i figurteksten i arXiv:1503.03714. `pdftotext -layout` findes i containeren.
