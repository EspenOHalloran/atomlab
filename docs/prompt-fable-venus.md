# Prompt: Fable tjekker Venus V3-V5 (E18)

*Skrevet 15. november 2026 af sessionen "Småting · Overblik og de næste fem sessioner" efter jeres valg (F på listen over ekstra Fable-opgaver, [prompt-naeste-fem.md](prompt-naeste-fem.md)). **Fable kan kun bruges til og med 16. november 2026.** Hører til sporet Solsystemet og Kosmos ([plan-venus.md](plan-venus.md), V1 og V2 er lavet, næste er V3). Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**. **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 5-8 $. Gratis 15. november.
- **Første besked:** "Læs `docs/prompt-fable-venus.md`, og gør det, der står under 'Prompten'."
- Kan køre samtidig med "Solsystemet · Overblikket trin 4" (du skriver kun i `docs/fable/` og retter ikke `docs/lige-nu/solsystemet.md`).

---

## Prompten

Venus er halvvejs: V1 (kloden) og V2 er bygget. Nu kommer V3 (natsiden gløder i infrarødt, og stederne under skyerne), V4 og V5. Planen og faktagrundlaget er skrevet af Opus og ikke tjekket af dig. Du skal tjekke dem kritisk, før V3 bygges.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen) og [docs/retning.md](retning.md).
2. Planen: [docs/plan-venus.md](plan-venus.md), hele (ca. 22 KB), især afsnit 1, 2, 4, 5 og tabellen i afsnit 7 (V3-V5), og "Status".
3. Faktagrundlaget: [docs/fakta-solsystemet/del7-venus.md](fakta-solsystemet/del7-venus.md), hele.
4. Det, der er bygget: teksterne i `js/data/sider/venus.js` (hvis den findes, ellers `grep -rl -i venus js/data/sider js/kosmos`).
5. Fælderne: [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`grep -i "venus"`).

### Hvad du skal levere
Én fil: **`docs/fable/E18-venus.md`**, højst ca. 10 KB:
1. **Det vigtigste først** (højst 5 linjer): Kan V3 bygges, som planen står? Hvad skal ændres først?
2. **Gløden i infrarødt** (V3): Holder fysikken (Plancks lov, hvorfor højlandene er mørkere, vinduerne omkring 1 µm, hvad Parker Solar Probe (WISPR) og Venus Express (VIRTIS) faktisk har set)? Hvad skal "Ærligt talt" sige?
3. **Stederne under skyerne:** er de valgte steder de rigtige for en 13-årig, ligger de rigtigt (bredde og længde), og er teksterne til dem rigtige?
4. **V4 og V5:** er de værd at bygge, eller kan Venus lukkes efter V3? Sig din mening (jeres mål: Solsystemet færdigt, før nye spor starter).
5. **Fakta:** de påstande i planen, faktafilen og teksterne i programmet, der er forkerte, upræcise eller for sikre, med kilde (fx vulkanerne, der er i live, fosfin i skyerne, døgnet og superrotationen). Skriv ikke det, der holder, op én for én.
6. **Kernesætningen for Venus** og hvad overblikkets panel om Venus skal sige.

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet, planen eller faktafilen. Skriv kun i `docs/fable/` (og nye linjer i bunden af fakta-fælderne). Når filen er skrevet, **stopper du**.
- Primære kilder (NSSDC, NASA, ESA, JAXA (Akatsuki), fagfællebedømte artikler). Står en kilde kun i din hukommelse, så skriv det. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push, PR til `main`, og merge den med det samme (CLAUDE.md).

## Efter Fables svar
V3-sessionen (Opus, høj, "Læs docs/prompt-venus.md og kør V3") læser `docs/fable/E18-venus.md` først og skriver sine noter i `docs/fable/E18-venus-noter.md`.
