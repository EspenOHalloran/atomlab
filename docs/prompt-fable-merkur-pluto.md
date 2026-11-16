# Prompt: Fable laver faktagrundlag og drejebog til Merkur og Pluto (E16)

*Skrevet 15. november 2026 af sessionen "Småting · Overblik og de næste fem sessioner" efter jeres valg (D på listen over ekstra Fable-opgaver, [prompt-naeste-fem.md](prompt-naeste-fem.md)). **Fable kan kun bruges til og med 16. november 2026.** Hører til sporet Solsystemet og Kosmos (nr. 13 under "Nyt indhold" i [koereplan.md](koereplan.md): "Merkur og Pluto i en lille udgave"). Normalt skriver Opus udkastet, og Fable tjekker det, men Fable kan ikke bruges senere, så Fable skriver her udkastet selv, og Opus skriver noterne. Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**. **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 8-15 $. Gratis 15. november.
- **Første besked:** "Læs `docs/prompt-fable-merkur-pluto.md`, og gør det, der står under 'Prompten'."
- **Domæner:** NASA, JPL, NSSDC, USGS og planetarynames er åbne. Til MESSENGER og New Horizons kan der skulle bruges `messenger.jhuapl.edu` og `pluto.jhuapl.edu`. Bed om dem med en anmodning til miljøet, når du skal bruge dem.
- Kan køre samtidig med "Solsystemet · Overblikket trin 4" (du skriver kun nye filer og retter ikke `docs/lige-nu/solsystemet.md`).

---

## Prompten

Merkur og Pluto er de sidste kloder i Solsystemet. I dag er de kun "Kort besøg" i overblikket (en kugle med 1k-kort og et kort panel). Køreplanen siger: **en lille udgave** (kloden, tre-fire steder og flybyen), bygget af de byggeklodser, der findes. Bagefter er Solsystemet færdigt.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen), [docs/retning.md](retning.md) og din skabelon [docs/fable/E3-forloeb.md](fable/E3-forloeb.md).
2. Planen: linjerne om Merkur og Pluto i [docs/plan-solsystemet.md](plan-solsystemet.md) (`grep -n -i "merkur\|pluto"`) og [docs/plan-venus.md](plan-venus.md) som mønster for en planet med kun få steder (afsnit "Kort fortalt", 4 og 7).
3. Det, der findes: [docs/kode/solsystem.md](kode/solsystem.md) (`grep` efter `klippeplanet`, `lokalt`, `flyby`, `navne`, `rejse`), [docs/kode/overblik.md](kode/overblik.md) og panelerne for Merkur og Pluto i `js/data/sider/overblik.js`. Billederne: `billeder/solsystem/KILDER.md` (`grep -i "merkur\|pluto\|messenger\|new horizons"`).
4. Mønstret for et faktagrundlag: [docs/fakta-solsystemet/del7-venus.md](fakta-solsystemet/del7-venus.md).
5. Fælderne: [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`grep -i "merkur\|pluto\|dværg"`).

### Hvad du skal levere
**To filer.**

**`docs/fakta-solsystemet/del8-merkur-og-pluto.md`** (højst ca. 25 KB) i samme form som del 7: planeterne med NSSDC-tal og dato, døgnet og året (Merkurs 3:2 og den mærkelige solopgang, Plutos og Charons bundne rotation), Solen på himlen, stederne (fx Caloris, isen i kraterne ved polerne, Hollows, Sputnik Planitia og bjergene af vandis, disen i modlys), sonderne (MESSENGER, BepiColombo med dato, New Horizons), billeder og højdedata med licens og opløsning, fælderne (fx "Merkur er den varmeste planet", "Pluto er en planet, der blev degraderet", "Pluto er altid længst væk") og det, du er mindst sikker på. Hver fælde også som en ny linje i bunden af fakta-fælderne (`merge=union`).

**`docs/drejebog-merkur-pluto.md`** efter skabelonen:
1. **Kernesætningen** for hver af de to (A, B og C, din anbefaling først).
2. **Den lille udgave:** hvilke 3-4 steder pr. klode, hvad flybyen viser, og hvad der er valgt fra. Hvad genbruges (klippeplanet, lokalt, navne, rejse, flyby), og hvad er nyt?
3. **Et kort forløb** eller kun et kort i overblikket? Sig din mening. Skal det være et forløb, så trinene helt udfyldt.
4. **Ordene** (og hvilke der står i `js/data/ordbog.js` i dag), **Ærligt talt** (hvad animationen snyder med) og **For nørder**.
5. **Spørgsmål til jer:** højst fem, hver med to eller tre valgmuligheder og din anbefaling først.

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet eller planerne. Skriv kun de to nye filer (og nye linjer i fælderne). Når de er skrevet, **stopper du**.
- Primære kilder (NSSDC, JPL, NASA, ESA, USGS, IAU og fagfællebedømte artikler). Står en kilde kun i din hukommelse, så skriv det.
- Commit, push, PR til `main`, og merge den med det samme (CLAUDE.md).

## Efter Fables svar
Opus skriver noterne (`docs/fable/E16-merkur-pluto-noter.md`, hvad er nyt, og hvor Opus er uenig), og I svarer på spørgsmålene. Det bygges efter Venus V3-V5. **Lavet 16. november 2026:** [noterne](fable/E16-merkur-pluto-noter.md), og jeres svar står i drejebogens afsnit 5.
