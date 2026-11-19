# Prompt: Ild, forløb 2 "Flammens form og farve"

*Skrevet 19. november 2026, da Ild 1 var færdig (PR #337-#339: Kemi i ringen, flammen og laboratoriet, turen "Hvad brænder egentlig?" og knaldgassen i Ild). Start en ny session med "Læs docs/prompt-ild-2.md". **Model: Opus. Effort: høj** (tekster med fakta og en ny ting i flammen). **Først efter prøven med sønnen** (DESIGN.md, "Prøv før næste"): Står prøven af forløb 1 ikke i `docs/lige-nu/molekyler.md`, så spørg, før der bygges.*

---

Spor: Molekyler. Navngiv chatten "Molekyler · Ild 2: Flammens form og farve". Tjek først i `origin/main`, at det ikke er bygget, og læs, hvad prøven viste (sporets fil og [ikke-afproevet.md](ikke-afproevet.md)). Ret først det, prøven fandt i forløb 1.

**Det, der skal bygges** ([drejebog-ild.md](drejebog-ild.md), afsnit 4 "Forløb 2", og [fable/E17-ild-noter.md](fable/E17-ild-noter.md), punkt 2 og 6): fire trin og "Det så du" på det bord, der findes:
1. *Gæt:* Hvad er det gule lys? (*Lys fra varm luft* / *Glødende korn* / *Brændende gas*, ikke "den varmeste del", noterne punkt 2). *Gør:* Hold skeen ind i den gule del. *Så:* sod, glødende korn af kulstof. Ord: sod.
2. Gasbrænderen brænder gult. *Gør:* Luk mere luft ind (skyderen). *Så:* blå og varmere, ingen sod, det blå kommer fra reaktionen.
3. *Gæt:* Hvad sker der uden op og ned? *Gør:* Slå tyngdekraften fra (kontakten "Rumstation"). *Så:* en lille blå halvkugle (ikke en kugle, noterne punkt 6). Her vises NASA's billede af de to flammer (NASA, "Candle Flame – 1g vs Microgravity", 2020) med kilden i `billeder/KILDER.md` eller en ny `billeder/ild/KILDER.md`. Billedteksten siger "halvkugle".
4. *Gør:* Slå tyngdekraften til igen, og følg en røgprik. *Så:* Varm gas er let og stiger op, kold luft suges ind forneden.
5. "Det så du" med kernesætningen for forløb 2, og vejene: laboratoriet, forløb 3 (eller kortet om slukning, til det findes) og "Farv flammen" (Lys, kun når den findes, stilguiden A9).

**Det, der findes, og som genbruges** ([kode/ild.md](kode/ild.md)): `js/flamme.js` (`sod`, `tyngde`, `bøj` og `salt` glider med `dt`), bordet i `js/ild/bord.js` (gasbrænderen med luftringen, røgen, der bliver hængende i vægtløshed), skeens zoner og sod i `js/data/ild.js`, turen i `js/ild.js` (`DEL`, `trinStart`, `tagVærktøj`) og Forløb-klodsen. Røgprikken i trin 4 er nyt: én partikel i røgen, som kameraet eller en ring følger. Udfordringen "Hvor længe kan et lys brænde på rumstationen Mir?" (op til 45 minutter, tidsknappen spoler) er stadig valgfri (spørg først, ingen ★ før prøven).

**Spørg om adgang før arbejdet:** NASA's billede skal hentes fra nasa.gov eller images-assets.nasa.gov. Er domænet ikke åbent, så send en anmodning med `update_environment` (CLAUDE.md, "Billeder og netsider"), før der bygges.

**Læs først (kun disse dele):** `docs/lige-nu/molekyler.md`, DESIGN.md, drejebogen afsnit 1, 4 (forløb 2), 6, 7, 9 og "Jeres svar", noterne "Hvor jeg er uenig" punkt 2 og 6, [fakta-ild.md](fakta-ild.md) afsnit 5, 6, 10 og 12 (med `grep` eller `offset`), [kode/ild.md](kode/ild.md), [kode/forloeb.md](kode/forloeb.md), tjekliste C, D og E og fælderne om Ild i [fakta-faelder.md](erfaringer/fakta-faelder.md). `/faktatjek` af alle tekster.

**Tests:** 5-8 tjek som `ild-forloeb` i en ny `tests/ild-forloeb2.mjs`. Kun `--ændret`.

**Til sidst:** Status i `docs/lige-nu/molekyler.md`, en linje i "Ikke afprøvet" og prompten til forløb 3 ("Sluk den!", drejebogen afsnit 4, med vand på tændstikken, ikke på lyset, og gryden vist roligt).
