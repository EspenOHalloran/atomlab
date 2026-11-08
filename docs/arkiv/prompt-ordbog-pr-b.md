# Prompt: Ordbogen, PR B ("Hvorfor?" og "Hvordan?" til flere ord)

*Skrevet 8. november 2026. Jeres ønske blev givet 7. november 2026 (se "Næste" i `docs/lige-nu/ordbog-og-system.md`). Start PR B med en ny session: "Læs docs/prompt-ordbog-pr-b.md. Lav PR B." **Model: Opus. Effort: høj** (det er mest danske tekster med fakta, og en fejl i en forklaring er dyr). Koden er lille: feltet `mere` findes allerede fra PR A (plasma).*

---

Giv de ca. 15-20 ord i Ordbogen, hvor det giver mest mening, et par afsnit med "Hvorfor?" og "Hvordan?" (feltet `mere`), som plasma fik i PR A.

**Læs først (kun disse dele):**
- `docs/lige-nu/ordbog-og-system.md` og DESIGN.md.
- I `docs/kode/skaerme.md` linjerne om `js/ordbog.js`, `js/data/ordbogliste.js` og `js/data/ordbog.js` (søg efter "Ordbogen").
- Tjekliste B (`docs/tjeklister/b-fakta.md`) og **[de kendte fælder](erfaringer/fakta-faelder.md), før teksterne skrives**. Tjekliste F, hvis testen ændres.
- I `docs/fakta-grundstofkort.md` afsnittet "Gruppernes navne og plasma (7. november 2026)" (sådan blev kilderne skrevet sidst).
- I koden: toppen af `js/data/ordbog.js` (kommentarerne) og opslaget `plasma` (forbilledet), og de opslag, du vælger. `tests/ordbog.mjs` linje ca. 45-80 (tjekkene af `mere`).

**Jeres svar (7. november 2026):**
- Ca. 15-20 ord, hvor det giver mest mening. Eksempler: tøris, ion, isotop, fusion og halveringstid.
- Forklaringerne må gerne være ca. dobbelt så lange som boblerne, men **kun i Ordbogen**. Boblerne forbliver korte (`tekst` højst 260 tegn, uændret).

**Sådan:**
1. **Vælg ordene og spørgsmålene først.** Forslag ud over jeres eksempler (vælg dem, hvor en 13-årig naturligt spørger "hvorfor?" eller "hvordan?"): fission, radioaktiv, antistof, neutrino, foton, kvark, tunneleffekt, bindingsenergi, kovalent binding, ionbinding, lysår, tidsforlængelse, neutronstjerne, baggrundsstrålingen, nordlys, tidevandskraft og bundet rotation. Hvert ord får 2-4 par, ikke 5 som plasma. Spørgsmålene skal være dem, sønnen ville stille (fx tøris: "Hvorfor bliver den ikke flydende?", halveringstid: "Hvordan kan man vide det, når det er tilfældigt?"). Vis listen med ord og spørgsmål til brugeren og få et **go**, før teksterne skrives.
2. **Skriv teksterne** i `mere` som `[spørgsmål, svar]`. Spørgsmålet ender med "?", svaret er 2-5 sætninger (ca. 250-450 tegn), i sprog en 13-årig forstår, og fagord forklares eller er selv i Ordbogen. Gentag ikke boblens tekst, byg videre på den. Forenklinger siges ærligt. Er du i tvivl om et tal, så lad det være eller skriv det forsigtigt. En kommentar over `mere` med kilderne (som ved plasma).
3. **Faktatjek** med `/faktatjek`. Der bliver mere end 15 påstande, så en Sonnet-hjælpeagent finder kilderne, og Opus vurderer dem (se `/faktatjek`). Kilderne skrives i en ny fil `docs/fakta-ordbog.md` (`docs/fakta-grundstofkort.md` er allerede ca. 24 KB), med det, der er mindst sikkert, til sidst. Nye fælder skrives i `docs/erfaringer/fakta-faelder.md`.
4. **Tegninger** (`tegning`, `TEGNINGER` i `js/ordbog.js`) kun, hvis en tegning forklarer noget, ord ikke kan, og højst 1-2 (fx halveringstid som en kurve). Spørg brugeren først. De skal virke i lyst og mørkt tema og på telefon.
5. **Links:** Nævner et nyt svar et sted i programmet, må det ikke give et link, medmindre ordet står dér (testen `ordbog` tjekker det).
6. **Test:** `tests/ordbog.mjs` tjekker allerede formen af alle `mere`. Tilføj et tjek af, at mindst ca. 15 ord har `mere`, og at boblen (`js/ordforklaring.js`) ikke viser `mere` for et af de nye ord. Kør `node tests/koer-alle.mjs --ændret` i baggrunden. Skærmbilleder af Ordbogen med et åbent ord med "Hvorfor?" på telefon (begge veje) og pc: `node tests/vaerktoejer/skaermbilleder.mjs ordbog`.
7. `/faerdig` til sidst. Ret `docs/kode/skaerme.md` (hvilke ord der har `mere`, kort) og sporets fil, og flyt denne prompt til `docs/arkiv/`.

**Spørgsmål til brugeren undervejs** (stil dem sammen med listen i trin 1): Skal boblerne have et lille link "Mere i Ordbogen ›" ved de ord, der har `mere`? (Opus' forslag fra PR A, ikke besluttet.) Siger de ja, så hører det med i PR B (`js/ordforklaring.js` og en linje i `style.css`).

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Ordbogen og Det periodiske system** (`docs/lige-nu/ordbog-og-system.md`). Du ejer `js/ordbog.js`, `js/data/ordbogliste.js`, `tests/ordbog.mjs` og `docs/fakta-ordbog.md`. `js/data/ordbog.js` er fælles: ret kun i felterne `mere` (og evt. `tegning`) på de ord, du vælger, og tilføj ikke nye ord uden at sige det. Ret ikke `tekst` i boblerne, medmindre faktatjekket finder en fejl (sig det så). `js/ordforklaring.js` og `style.css` kun, hvis linket "Mere i Ordbogen ›" bliver besluttet. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves.
