# Historik: Solsystemet og Kosmos

*Det forrige "Senest lavet" fra [lige-nu/solsystemet.md](../../lige-nu/solsystemet.md) flyttes hertil ordret, nyeste øverst (fra 7. november 2026). Det, der er ældre, står i den lukkede [historik.md](../historik.md).*

**Senest lavet (7. november 2026): Planen for Uranus og Neptun.** Jeres go: "fortsæt".
- **Planen:** [plan-uranus-neptun.md](../../plan-uranus-neptun.md) med kilderne (tjekket med curl), kloderne bygget af målte bånd og vinde, signatur-effekterne, månerne, to flybyer med 4 stop, himlen, tablet og delopgaverne UN1-UN6. **Seks spørgsmål til jer** står i afsnit 8.
- **Faktagrundlaget:** [fakta-solsystemet/del6-uranus-og-neptun.md](../../fakta-solsystemet/del6-uranus-og-neptun.md) (NSSDC, JPL Horizons, OPAL, vindformlerne, Irwin m.fl. 2024 om farverne og ni fælder).
- **Vigtige fund:** Hubbles kort har kun 2 pixel pr. grad, og Uranus-kortet fra 2025 har kun den nordlige halvdel. USGS har ingen globale kort over Uranus' fem måner (Triton findes). Uranus' solhverv er ifølge Horizons i 2030, ikke 2028, som mange skriver.
- **Domæner:** Miljøet var blevet lavet om af Molekyler M2. I åbnede 13 nye (listen står i planen, afsnit 0). `archive.stsci.edu` kræver emSign-roden fra en ældre `certifi` (se erfaringerne).

**Senest lavet (7. november 2026): Tre ønsker fra jer.** Jeres go: "go til det du anbefaler … også go til 8k månekort".
- **Roverens foto er standard i Stå på Mars** (Naukluft og landingsstedet): Det hentes, mens kameraet flyver ned, og tændes, når man er landet (klokken står på fotoets tid). Slår man det fra, huskes det, indtil man forlader Mars. Går klokken (▶, skyderen eller "Solnedgang"), skjules fotoet, for det er taget på ét tidspunkt.
- **Skiftet til Mars var langsomt** (4-5 s uden noget): Det var ikke billederne, men JS, der lavede Mars' fem lokale net og sorterede kuglen om fem gange. Nu ca. 0,6 s i testbrowseren (før 4,4 s). **Rejseskiltet** "Kurs mod Mars" med en raket, der kredser om planeten, vises ved skift af klode, hvis det tager over 0,2 s (`js/rejseskilt.js`).
- **Månens kort i 8k** på pc (6,3 MB, 4k på tablet, før 2k). Kilde: NASA SVS CGI Moon Kit.
- **Tests:** `landskab` tjekker fotoet som standard og rejseskiltet. Fem tests ventede ikke på skiftet af klode (det venter nu ét billede på skiltet) og er rettet. Hele samlingen efter fletningen med `main` (35 tests, 27 min): alle bestod.
