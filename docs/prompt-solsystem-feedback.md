# Prompt: Solsystemet, feedback fra prøven 16. november 2026

**Model: Opus, høj effort.** Fem punkter fra jeres prøve. Nr. 1, 2 og 4 er små rettelser i forløb og kamera, nr. 5 er ydelse (tjekliste E, kode der kommer med i programmet), og nr. 3 er en vurdering med billeder og animation. Der er ingen svær fysik eller omstridt fakta, så Fable er ikke nødvendig. Nr. 3 kan Opus selv vurdere. Hvis Opus alligevel vil have Fables syn på Solens udseende, så sig det i planen, og se [plan-fable.md](plan-fable.md).

Spor: **Solsystemet og Kosmos** ([lige-nu/solsystemet.md](lige-nu/solsystemet.md), punkterne står der under "Næste", nr. 00). Kun denne session skriver i sporets fil.

## Læs først
1. [lige-nu.md](lige-nu.md), [lige-nu/solsystemet.md](lige-nu/solsystemet.md) (nr. 00 med alle fem punkter, årsager og forslag) og [DESIGN.md](../DESIGN.md).
2. [kode.md](kode.md) og filerne i `docs/kode/` om overblikket, forløbet og fænomenskærmen. Tjekliste **D** (knapper) og **E** (animation, kamera, ydelse), og [erfaringer.md](erfaringer.md) om flybyen, kameraet og ydelse.
3. Før du bygger: `git fetch origin`, og se i `origin/main` og åbne PR'er, om noget af det allerede er lavet.
4. Koden: `js/data/forloeb/overblik.js`, `js/forloeb.js`, `js/solsystem/overblik-forloeb.js`, `js/solsystem/overblik-lys.js`, `js/kosmos/overblik.js` (`startKamera`, `gem`, `gåTil`, `styring`), `js/kosmos/solen.js`.

## Opgaven: gennemgå og lav en plan, få et go, byg bagefter
Gentag først hver fejl (`?test`, `atomlabTest`, Playwright, tablet- og pc-størrelse), og tjek, at årsagen i sporets fil holder. Ret årsagen, hvis den ikke gør. Lav så en kort plan med rækkefølge og størrelse for hvert punkt, og **få et go**, før noget bygges (reglerne i DESIGN.md).

1. **Trin 1 i "Rundt om Solen" siger ikke, hvad man skal.** Man ser "Hvilken er vores?" og kun "Spring over" som noget at trykke på. Årsag: `gør` ("Tryk på Jorden.") vises aldrig, og trin 1 og 4 har ingen knapper. Forslag: skriv opfordringen ind i `spørg` (trin 1 "Tryk på den.", trin 4 "Find den, og tryk på ringen."), eller vis `gør` som svag tekst, når et trin ingen knapper har. Tjek alle forløb i `js/data/forloeb/`, om flere trin har samme fejl. Overvej, om "Vis mig" skal komme tidligere end efter ca. 20 s i trin 1.
2. **"Rejs med lyset" har ingen stopknap** ("det virker, som om man sidder fast"). Rejsen stopper kun ved skyderne, et tryk på en klode eller ca. 10 s efter skallen har passeret den yderste, og bagefter står kameraet langt ude i "Rigtig størrelse". Forslag: knappen bliver til "✕ Stop lyset", mens rejsen kører, og et tryk (og Esc) stopper, stiller skalaen tilbage til "Pustet op" og flyver kameraet hjem. Tjek, om man kan komme tilbage fra "Besøg en planet" og de andre veje.
3. **Solen: findes der højere opløsning af et kort?** Solen er tegnet af programmet (`js/kosmos/solen.js`, ingen billedfil). Jeres beslutning: Vurder, om der kan gøres noget, enten (a) et rigtigt kort eller billede (fx NASA SDO/HMI, 4096 × 4096 af skiven; Carrington-kort viser kun magnetfeltet) med kilde, licens og domæne, eller (b) mere ud af animationen, som den er (granuler, pletter, protuberanser, bevægelse). Giv en anbefaling med kvalitet og pris (ydelse, filstørrelse, tablet). Der bygges intet, før I har valgt.
4. **Tilbage til Solsystemet fra Jorden giver tomt rum** (billede fra jer: kun en banelinje og en lille ring, og tidsskyderen står der stadig). Mistanke: `startKamera()` bruger `husk.kamera` og `husk.t`, som `gem()` gemte, da man forlod overblikket tæt på Jorden i den rigtige skala. Forslag: "Solsystemet" i stedmenuen går altid til hjemblikket (`HJEM`, `hjemAfstand()`) og "Pustet op". Tidsskyderen hører til overblikket, men det skal give mening, at den er der.
5. **Ydelse: ryk ved skift mellem planeter** (måling med `?maal`, pc Intel Iris Xe, 16. november 2026; 60 billeder/s i ro, 43 ryk over 50 ms). Største ryk: nye shadere ved første tryk (ring-shaderen `tRing, uRingInd`, Neptun 715 ms, Mars 456, Jupiter 445, Saturn 267), store kort lagt i grafikkortet (Jordens 4k-kort 160-190 ms hver, Mars 8k 234, Jupiter 4k 176), månernes 8k-kort på forhånd, mens kameraet flyver ind (170-230 ms). Forslag: byg shadere i forvejen (`lavShadereFørst`), find ud af, hvorfor ring-shaderen bygges igen for hver planet, ét kort pr. billede, og ingen måne-forhåndsindlæsning under flyvningen. Se også [maalinger/mars-g1.md](maalinger/mars-g1.md) og erfaringerne om Mars-ydelse.

## Rammer
- Tekst på dansk, til en 13-årig. Ingen nye frameworks eller npm.
- Tests: `node tests/koer-alle.mjs --ændret` (kør i baggrunden). Nye tjek: højst 5-10. `overblik-forloeb`, `roeg` og `karrusel` er de vigtigste.
- Skærmbilleder kun af det ændrede, i tablet- og pc-størrelse.
- Ydelse måles igen på tabletten (Tab A11) af jer, og punktet føres ind i [ikke-afproevet.md](ikke-afproevet.md).
- Dokumenterne rettes til sidst (`/faerdig`): sporets fil, [kode/](kode.md), nye erfaringer i [erfaringer/](erfaringer.md). Flyt det forrige "Senest lavet" til [arkiv/historik/solsystemet.md](arkiv/historik/solsystemet.md). PR'en merges med det samme.
- Navngiv chatten "Solsystemet · feedback 16. nov" med `set_session_title`.
