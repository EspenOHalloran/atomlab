# Prompt: Fable tjekker UI og UX af Gåderne og det nye fra den sidste uge

*Skrevet 16. november 2026 efter jeres prøve af Gåderne på tabletten ("Måske vi skal have fable til at lave et tjek på ui/ux generelt på gåder og de andre nye dele, der er kommet den sidste uges tid"). Hører til sporet Småting. **Fable kan kun bruges til og med 16. november 2026**, så tag den sammen med [prompt-fable-tyngdekraft.md](prompt-fable-tyngdekraft.md) i dag. Kun dokumenter, ingen kode.*

## Sådan startes den
- Egen session med Fable 5.2 i miljøet "Default". Effort: `high`. Svaret i `docs/fable/E20-ux-nyt.md`. Opus skriver noter bagefter (`E20-ux-nyt-noter.md`).
- Første besked: "Læs `docs/prompt-fable-ux-nyt.md`, og gør det, der står under 'Opgaven'."

## Opgaven
Se på brugeroplevelsen (UI og UX, ikke faktaene) af det, der er kommet siden ca. 9. november 2026, set med en 13-årigs øjne på en tablet: **Gåderne** (skinnen og Antistof), **Forløb** (Dit første atom, Rejsen i tid, Rundt om Solen i Solsystemets overblik, Liv forløb 1-2, Molekyler som egen del), **Menuen som ring** og de nye vink og "Spol frem".

**Jeres fund fra prøven af Gåderne (16. november 2026), som Fable skal tage stilling til:**
1. **Kernesætningen virker:** Efter Antistof kunne sønnen sige den uden hjælp.
2. **"Fra mindre til større" er ikke tydeligt.** Er det størrelsen på gåden? (Svar: Nej. Det er den skala, gåden hører til: fra de mindste ting til hele Universet, [plan-gaader-3d.md](plan-gaader-3d.md).) Skal skinnen overhovedet sorteres sådan, eller skal den vise noget, som en 13-årig forstår uden forklaring? Hvis ja, hvordan vises det (en skala under stien, ord i enderne)?
3. **Man "tvinges" ind i Antistof, før man ser de andre.** Det er med vilje (første gang: kun Antistof, så tændes de andre lys), men er det godt for en nysgerrig 13-årig, eller føles det som en lås? Hvad er det mindste, der bevarer undringen?
4. **Skinnen eller cirklen ser hakket ud på tabletten** (billede følger fra jer). Opus' fund: Renderen har ingen kantudglatning (`antialias: false` i `js/scene3d.js`), og stien er en `Line2` på 2,5 px, så kanten får trappetrin.

**Se også efter**, på tværs af de nye dele: Er det altid tydeligt, hvad der er næste skridt? Er knapperne store nok (44 px)? Forstår man vinkene og "Spol frem"? Ser delene ud, som om de hører til samme program? Hvad ville en 13-årig opgive?

**Svar med:** de fem vigtigste fund (hvad, hvorfor, hvad man gør ved det, og størrelsen på rettelsen), en kort liste over resten og det, der virker godt og ikke må ændres.

## Hvad der skal læses (kort)
CLAUDE.md (står i samtalen), [retning.md](retning.md), [plan-gaader-3d.md](plan-gaader-3d.md) ("Oversigten: Frontlinjen"), [kode/gaader.md](kode/gaader.md), [fable/E14-forloeb-eftersyn.md](fable/E14-forloeb-eftersyn.md) (så du ikke gentager det) og skærmbillederne i `docs/fable/E14-billeder/` og `tests/billeder/`, hvis de findes. Kør ikke kode.
