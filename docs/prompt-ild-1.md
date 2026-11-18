# Prompt: Ild, forløb 1 "Hvad brænder egentlig?" med laboratoriet

*Skrevet 18. november 2026, da Liv L6 var færdig og Liv L3-L6 dermed er bygget. Start en ny session med "Læs docs/prompt-ild-1.md". **Model: Opus. Effort: høj** (ny del, kemi og en ny flamme i 3D). En stor opgave: Få et go på planen, før der bygges, og del den gerne i to PR'er.*

---

Spor: Molekyler. Navngiv chatten "Molekyler · Ild 1: Hvad brænder egentlig?". Tjek først i `origin/main`, at det ikke er bygget (CLAUDE.md, "Parallelle sessioner"), og se efter `js/flamme.js` (sporet Lys skal bruge samme flamme).

**Det, der skal bygges** ([drejebog-ild.md](drejebog-ild.md), afsnit 3 og 11, og "Jeres svar" nederst, med rettelserne i [fable/E17-ild-noter.md](fable/E17-ild-noter.md)): Delen Ild i den nye verden **Kemi** (Molekyler flytter dertil, [plan-verdener.md](plan-verdener.md)), forløb 1 "Hvad brænder egentlig?" (fem trin: røgen, skeen, atomerne bytter partnere, pust og "Det så du") og laboratoriet bagefter. Kernesætningen er A med "bytter partnere". Én fælles flamme i `js/flamme.js` (gul eller blå, spids eller kuppel, farve fra et salt), som virker med `LAV_KVALITET` og står stille under pause. **Træk fra:** Knappen "Knaldgas" i "Del elektroner" bliver et link til Ild.

**Forslag til deling (spørg om go):** PR 1: verdenen Kemi i ringen, skærmen Ild med flammen og laboratoriet. PR 2: forløb 1 med testen. Prøven med sønnen kommer efter forløb 1, før forløb 2.

**Læs først (kun disse dele):** `docs/lige-nu/molekyler.md`, DESIGN.md, drejebogen afsnit 1-3, 5-9 og 11 og "Jeres svar", noterne afsnit "Hvor jeg er uenig" og "Jeres svar", [fakta-ild.md](fakta-ild.md) afsnit 1-5, 9, 12-14 (med `grep` eller `offset`), [retning.md](retning.md), [stilguide.md](stilguide.md), tjekliste C, D og E, `docs/kode/molekyler.md` og [kode/forloeb.md](kode/forloeb.md). `/faktatjek` af alle tekster (det, der er mærket RS og U i faktagrundlaget, især temperaturerne og pustet), og læs fælderne først.

**Tests:** 5-8 tjek pr. forløb som `molekyler-forloeb`. Kun `--ændret`.

**Til sidst:** Status i `docs/lige-nu/molekyler.md`, linjer i "Ikke afprøvet" (sikkerhedslinjen i hjælpen, flammen på tabletten) og prompten til forløb 2.
