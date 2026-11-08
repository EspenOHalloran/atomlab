# Koden: Uranus og Neptun (isgiganterne)

*Lavet 8. november 2026 (UN1 i [plan-uranus-neptun.md](../plan-uranus-neptun.md)). De fælles moduler (`planet.js`, `rejse.js`, `hent.js`) står i [solsystem.md](solsystem.md).*

## Filerne
- `js/solsystem/isgigant.js`: `lavIsgigant(cfg)` bygger hele fænomenet (de to planeter ligner hinanden, så koden er fælles). `cfg`: `id` (`uranus` eller `neptun`, nøglen i `PLANETER`), `navn`, `ikon`, `undertitel`, `kort` (filnavnets start), `kantFarve` (kanten i modlys), `tal`, `side` og `sider`.
- `js/kosmos/uranus.js` og `neptun.js`: kun tallene i panelet og teksterne. De står i Solsystemet efter Saturn (`js/solsystem.js`).
- `js/data/isgiganter.js` (uden Three.js): `PLANETER` (radius og polradius fra NSSDC, `døgnTimer`, `retning` −1 for Uranus, der drejer med uret om IAU's nordpol, +1 for Neptun, `hældning`, polen som rektascension og deklination, og banen fra JPL's korte formler, tabel 1), `plads(navn, dato)` (AU i ekliptikkens retninger), `pol`, `knude` (Q, hvor kortets længde 0° lægges), `solRetning`, `solBredde(navn, dato, planetografisk)` (passer med JPL Horizons inden for 0,05° i 1986-2046), `baneNormal` og `solAfstand`. **Programmets retninger er ekliptikkens** som i `jordkloden.js`: y mod nord, z mod forårspunktet, x mod længde 90°.
- `js/data/vinde-isgiganter.js` (uden Three.js): `vindVed(navn, φ)` i m/s **med drejningen** (planetografisk bredde), dæmpet til 0 fra `POL_FRA` (75°) til `POL_TIL` (88°). `neptunRå` og `uranusRå` er formlerne uden dæmpning.
- `js/data/sider/uranus.js` og `neptun.js`: siderne (i UN1 kun den korte tekst, et emne ved Uranus, nørd, billeder og "Ærligt talt").
- `billeder/solsystem/lav_isgiganter.py`: kortene `uranus-2k/1k.jpg` og `neptun-2k/1k.jpg` (se `KILDER.md`). Pc henter 2k, tablet, telefon og tests 1k.

## Sådan hænger det sammen
- **Aksen:** `planetG.quaternion` laves af basen (−Q, IAU's nordpol, nordpol × Q), så kuglens +y peger mod IAU's nordpol og kortets længde 0° (−x i `SphereGeometry`) mod knuden Q. `planet.mesh.rotation.y = døgn` drejer om IAU's nordpol: `DREJ` har fortegnet `retning`, så Uranus' døgn falder.
- **Aksens hældning** (NSSDC: 97,77° og 28,32°) er vinklen mellem banens normal og den akse, planeten drejer **mod uret** om (`retning` gange IAU's nordpol). IAU's nordpol ligger altid nord for banen, så for Uranus er vinklen til den 82,23°. Testen tjekker begge dele.
- **Solen** står i `sol` (systemets retninger) for dagens dato (`new Date()` i `lav`). Skyderen "År" (UN2) skal kun ændre `sol`.
- **Uret:** `SEK_PR_SEK` = 450 (som Jupiter), så Uranus' døgn tager ca. 138 sekunder i programmet og Neptuns ca. 129. ⏩ `HURTIG` = 20.
- **Vindene:** teksturen har én række pr. parametrisk bredde (`VIND_RÆKKER` 512) med `retning · vind / (R cos β)` i uv pr. sekund (+ er mod øst i kortet). Ved ækvator blæser det mod drejningen på begge planeter: mod vest (uv < 0) på Neptun og mod øst (uv > 0) på Uranus. `FASE` er 10 sekunder (Jupiter 40), for vindene er hurtige i forhold til planeternes størrelse (Neptuns ækvator flytter sig ca. 4° i én fase).
- **Startbilledet:** set fra Solens retning drejet 28° om ekliptikkens akse og lidt oppefra (`START`), så man ser dagsiden og den pol, der har sol.
- **`planet.js`** har fået den valgfrie `kantFarve` (standard den varme farve, Saturn og Jupiter er uændrede).

## Testadgang (`atomlabTest.solsystem.fænomen()`)
`drejning()`, `døgnTid`, `form()` (flad, radius, hældning i grader mod banen, segmenter), `hentet()`, `billeder()`, `pol()` og `sol()` (verden), `solSystem()`, `punkt(længde)` (et punkt på ækvator i verden), `midt()`, `ur()` (vind, døgn, hurtig), `strøm(bredde)` (`ms` med drejningen regnet tilbage fra teksturen og `uv`), `tur()` og `hop()`. Test: `tests/isgiganter.mjs`. Billeder og billeder i sekundet med fuld grafik: `node tests/vaerktoejer/isgiganter.mjs [størrelse] [uranus|neptun] [hel modlys hurtig]`.
