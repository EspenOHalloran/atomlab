# Prompt: Fable tjekker faktagrundlaget for Liv og månerne

*Skrevet 12. november 2026 efter jeres go ("Ja inkl måner"). Hører til sporet Molekyler ([lige-nu/molekyler.md](lige-nu/molekyler.md)) og til Fables rolle i [plan-fable.md](plan-fable.md) (F3: Fable tjekker Liv kritisk, og faktagrundlaget for omstridt stof, bl.a. livets begyndelse). Ventetiden på "Fable 5.5" sluttede 11. november 2026 (E2), så det tjek, der blev skudt til side, laves nu. Fable skriver kun dokumenter, så den kan køre samtidig med andre sessioner. Bør laves, før "Liv som to forløb" bygges (Serie 1 nr. 2 i [koereplan.md](koereplan.md)).*

## Sådan startes den
- **Egen session med Fable 5.2** (som i [plan-fable.md](plan-fable.md)), i miljøet **"Default"**. Kildedomænerne er åbne dér, også dem, der blev åbnet til denne opgave 12. november 2026 (`www.pnas.org`, `www.genome.gov`, `pubmed.ncbi.nlm.nih.gov`, `www.ncbi.nlm.nih.gov`, `academic.oup.com` og `pdb101.rcsb.org`).
- **Effort: `high`.** Vil I have et ekstra sikkert tjek af livets begyndelse og Cheyava Falls (det mest omstridte), kan I skifte til `xhigh` for den del. Det koster mere.
- **Pris (usikkert skøn):** ca. 10-15 $ (Fable 5.2: 8 $ ind og 40 $ ud pr. million tokens). Fable læser ca. 200-250 KB og skriver højst ca. 20 KB. Tjek saldoen før og efter.
- **Første besked til Fable:** "Læs `docs/prompt-fable-liv.md`, og gør det, der står under 'Prompten'."

---

## Prompten

Du skal lave et kritisk faktatjek af **Liv** i AtomLab og af **månerne med mulige betingelser for liv**. Opus har skrevet faktagrundlaget (med hjælpeagenter på effort xhigh) og bygget L0-L2 af Liv (DNA-stigen og "Fra opskrift til protein"). Ingen har tjekket det udefra. Du har selv skrevet drejebogen til Liv som to forløb ([docs/fable/E3-liv-drejebog.md](fable/E3-liv-drejebog.md)), men ikke set faktagrundlaget eller teksterne i programmet.

### Målet
Det skal være **korrekt og ærligt**, før forløbene bygges, og før en 13-årig læser det. Livets begyndelse og liv andre steder er områder, hvor det er nemt at skrive for sikkert (en hypotese, der lyder som en kendsgerning) eller for forsigtigt (så det bliver kedeligt og uklart). Sig det, når noget ikke holder, og sig hvorfor. Er du i tvivl, så sig det.

### Hvem det er til, og rammerne
Læs CLAUDE.md (står i samtalen), især "Hvem bruger det" og "Regler, der gælder på tværs". Teksten er på dansk til en 13-årig, og forenklinger skal siges ærligt. Du ændrer **ikke kode og ikke tekster i programmet** og retter ikke i faktafilerne. Du skriver kun i `docs/fable/` (og nye linjer i fælderne, se nedenfor). Opus retter bagefter.

### Hvad du skal læse
Læs de små filer helt og de store med `grep` eller i afsnit. Læs ikke alt to gange.
1. **Reglerne for fakta:** [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) og skillen `/faktatjek` (tjekliste B). Læs dem, **før** du vurderer noget.
2. **Faktagrundlaget for Liv:** [docs/fakta-liv.md](fakta-liv.md) (oversigten og "Opus' vurdering") og de fire filer i [docs/fakta-liv/](fakta-liv/): `begyndelsen.md` (livets begyndelse, det mest omstridte), `rummet.md` (Cheyava Falls og liv andre steder), `dna-stigen.md` og `dna-opskriften.md`.
3. **Faktagrundlaget for månerne:** [docs/fakta-maaner-liv.md](fakta-maaner-liv.md) (Europa, Enceladus, Titan og Huygens).
4. **Planen og drejebogen:** [docs/plan-liv.md](plan-liv.md) (kun for at se, hvad der er tænkt at komme med) og din egen [E3-liv-drejebog.md](fable/E3-liv-drejebog.md).
5. **Teksterne, som brugeren faktisk ser i dag** (det vigtigste at tjekke, fordi de allerede er i brug):
   - Liv: `js/liv.js`, `js/liv-protein.js` og `js/data/liv/*.js` (`stige.js`, `opskriften.js`, `protein.js`, `kode.js`, `gener.js`). Spring `1BNA.pdb` og `dna-atomer.js` over (atomkoordinater).
   - "Hvorfor?"-kortene og ordene om Liv: `grep` i `js/data/hvorfor.js` og `js/data/ordbog.js` efter fx DNA, gen, protein, RNA, ribosom, celle, base, aminosyre og evolution.
   - Mars: afsnittet om Cheyava Falls i `js/data/sider/mars.js` (`grep -n -i "cheyava\|leopard\|liv"`).
   - Månerne: det, der står om Europa i `js/data/sider/jupiter.js` og om Enceladus og Titan i `js/data/sider/saturn.js` (`grep -n -i "europa\|enceladus\|titan\|liv\|hav"`).
   - Kort over koden: [docs/kode.md](kode.md) og filen om Liv i `docs/kode/`.

### Hvad du skal levere
Én fil: **`docs/fable/E5-liv.md`**, højst ca. 20 KB. For hvert fund: peg på en fil og en linje, og sig, hvor sikker du er. I denne rækkefølge:

1. **Det vigtigste først** (højst 5 linjer): Holder faktagrundlaget? Er der noget i programmet, der skal rettes, før jeres søn ser det igen?
2. **Fejl i programmet nu** (det, der skal rettes med det samme): en tabel med **tekst (fil:linje) · påstand · dom** (korrekt, upræcist, forkert, for sikkert eller for forsigtigt) **· kilde · forslag til ordlyd** (kort dansk, til en 13-årig).
3. **Faktagrundlaget for Liv.** Gå mindst disse igennem, og regn tallene efter, hvor det kan lade sig gøre:
   - livets begyndelse: hvad der er kendsgerning, hvad der er den førende hypotese, og hvad der er strid om (RNA-verdenen, hydrotermiske væld eller damme på land, Miller-Urey, hvor gammelt det ældste spor af liv er, LUCA)
   - Cheyava Falls: hvad der er fundet, hvad NASA og forfatterne faktisk har sagt (og hvornår), og CoLD-skalaen
   - DNA og protein: tal (fx antal gener, baser, hvor stor en del der koder), den genetiske kode, seglcellen, Franklin-historien og laktose-tallet
   - tabellen som i punkt 2, men kun for de påstande, der er forkerte, upræcise eller for sikre. Skriv ikke det, der holder, op én for én. Sig bare, hvilke afsnit du har tjekket uden fund.
4. **Faktagrundlaget for månerne** på samme måde: Europas og Enceladus' hav, fosfat og fontænerne på Enceladus, om fontænerne på Europa er sikre, Titans søer og "liv, men ikke som vores", og Huygens. Og: Er kernesætningen for månerne ærlig?
5. **Det, der mangler, eller som er skrevet for sikkert eller for forsigtigt** i faktagrundlaget som helhed, og nye fund efter datoen i filerne, som ændrer noget. Giv fundet en dato.
6. **Rettelser til din egen drejebog** (E3-liv-drejebog), hvis faktatjekket ændrer noget i den. Ret ikke i E3-filen, skriv det her.
7. **Spørgsmål til jer.** Højst fem, hver med to eller tre valgmuligheder og din anbefaling først.

### Regler for dig
- **Kilder:** Brug primære kilder (artiklerne, NASA og ESA) og de åbne domæner i miljøet. Står en kilde kun i din hukommelse, så skriv det. **Er et domæne, du har brug for, lukket, så bed om at få det åbnet med en anmodning til miljøet (værktøjet til at ændre miljøet), som brugeren kan godkende. Navngiv domænet og hvorfor.** Gå ikke videre med en nødløsning.
- Du **bygger ikke** og ændrer hverken kode, tekster i programmet, faktafilerne eller regler. Når filen er skrevet, **stopper du**, og du går ikke videre til noget andet af dig selv.
- Nye fælder (det, der ofte siges forkert om livets begyndelse, DNA eller liv i rummet) skrives som nye linjer i bunden af [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md), uden at rette i de gamle (`merge=union`).
- Skriv ikke fund, der allerede står i "Opus' vurdering" i `fakta-liv.md`, eller i "Fælder" og "Ikke fundet" i `fakta-maaner-liv.md`. Henvis i stedet, og sig, om du er enig.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje i [lige-nu/molekyler.md](lige-nu/molekyler.md): "Fables faktatjek af Liv og månerne er skrevet, se `docs/fable/E5-liv.md`".

## Efter Fables svar
1. Opus skriver `docs/fable/E5-noter.md` (hvilke fund der er nye, hvad der rettes med det samme, og hvor Opus er uenig). Fables fil rettes ikke.
2. **Fejl i programmet rettes med det samme** (Opus med `/faktatjek`), og faktafilerne får en note øverst om, at Fable har tjekket dem.
3. I får et dialogkort med Fables spørgsmål.
4. Så kan "Liv som to forløb" bygges (Serie 1 nr. 2), når Forløb-klodsen findes.
