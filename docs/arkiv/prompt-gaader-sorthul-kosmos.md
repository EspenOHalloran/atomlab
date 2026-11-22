# Prompt: Det sorte hul i Gåderne skal ligne Kosmos'

*Skrevet 22. november 2026 efter jeres fund: "Det sorte hul under Gåder er også smågrimt på pc. Hvorfor bruger vi ikke bare det flotte sorte hul, vi allerede har fra Kosmos?" og jeres valg "Ny session til det". **Model: Opus. Effort: høj.** Sporet er Småting (Gåderne bor dér). Kopiér teksten under stregen til en ny session.*

---

Spor: Småting. Navngiv chatten "Småting · Sort hul i Gåderne som i Kosmos". Tjek først i `origin/main`, at det ikke er lavet (CLAUDE.md, "Parallelle sessioner").

**Læs først:** `docs/lige-nu/smaating.md` (Senest lavet), DESIGN.md, `docs/kode/gaader.md` (linjen om `js/gaader/lys.js`, "Det sorte hul med linsen" og "Skarp på touch"), `docs/kode/gaader-scener.md` (linjen om `js/gaader/sorthul.js`), `docs/kode/kosmos.md` (linjen om Sort hul og `linse.js`), `docs/erfaringer/shadere.md`, `docs/erfaringer/kamera-og-layout.md` ("Gløden lyser sorte ting op", "En ring om en sort skive" og "En flyvning hen mod en flade") og tjekliste E.

**Det, der er galt (set i skærmbilleder på pc 1280×800 med fuld grafik, 22. november 2026):** Gåderne bruger samme lysbøjning som Kosmos (`lavLinse` fra `js/kosmos/linse.js`), men som et lille billede på en flade, der vender mod kameraet (lampen, `lavSortHul` i `js/gaader/lys.js`). Derfor:
1. Skyggen er brunlig, og der ligger et brunt, kantet skær om hullet (gløden og `skær` lyser det sorte op; Kosmos holder skyggen sort med `GemPass`/`SkyggePass`).
2. Himlen omkring hullet bøjes ikke (den er skåret væk i lampen). Det er det, der gør Kosmos' hul flot.
3. Trappetrin langs skyggen og en hård kant på den nederste bue (alpha regnes ud fra dybden).
4. Skiven er vippet (`LINSE_HÆLDNING`) og ser flad og grå ud.

**Opgaven (anbefalingen, få jeres go, før I bygger):**
- **Scenen Sort hul (`js/gaader/sorthul.js`, trin 1 og dykket):** Brug Kosmos' linse over hele billedet som baggrund (`linse.flade` i scenen som i `js/kosmos/sorthul.js`, med den sorte skygge bevaret mod gløden). Gådernes egne ting (kurven, horisonten, LISA) tegnes ovenpå. Gådernes scene er mindre end Kosmos' (hullet ±4,3 enheder, Kosmos' skive går ud til 15), så linsen skal have en skala (en valgfri parameter i `linse.js`, så Kosmos er uændret, og sig det i PR'en). Tjek dykket hen mod horisonten (lampen bliver i dag større og glider ind i midten) og LISA, hvor hullet ikke ses.
- **Skinnen:** Lampen bliver (den er lille dér), men uden det brune skær og med sort skygge og bløde kanter.
- **Behold det, der lige er lavet** for touch (skarp efter billeder/s, `atomlabLinseSkarp`, shaderne på forhånd), eller flyt det til den nye løsning, hvis lampen ikke længere bruges i scenen.

**Mål og billeder:** Skærmbilleder før og efter af Kosmos → Sort hul og Gåderne → Sort hul trin 1 på pc og telefon på langs (fuld grafik, `tests/vaerktoejer/skaermbilleder.mjs` eller et lille script med `fuldGrafik: true`). Linje i "Ikke afprøvet": mål med `?maal#gaader` på A56 og Tab A11 (før: A56 120 billeder/s med lampen). Tests: `--ændret` (gaader, kosmos) og et par tjek af det nye (fx at scenen bruger linsen over hele billedet, og at skyggen er sort i et skærmbillede). Afslut med `/faerdig`.

**Rør ikke:** de andre spors filer. I `js/kosmos/linse.js` kun valgfrie parametre, så Kosmos' tests er grønne.
