# Koden: Uranus og Neptun (isgiganterne)

*Lavet 8. november 2026 (UN1 i [plan-uranus-neptun.md](../plan-uranus-neptun.md)). De fælles moduler (`planet.js`, `rejse.js`, `hent.js`) står i [solsystem.md](solsystem.md).*

## Filerne
- `js/solsystem/isgigant.js`: `lavIsgigant(cfg)` bygger hele fænomenet (de to planeter ligner hinanden, så koden er fælles). `cfg`: `id` (`uranus` eller `neptun`, nøglen i `PLANETER`), `navn`, `ikon`, `undertitel`, `kort` (filnavnets start), `kantFarve` (kanten i modlys), `tal`, `side` og `sider`.
- `js/kosmos/uranus.js` og `neptun.js`: kun tallene i panelet og teksterne. De står i Solsystemet efter Saturn (`js/solsystem.js`).
- `js/data/isgiganter.js` (uden Three.js): `PLANETER` (radius og polradius fra NSSDC, `døgnTimer`, `retning` −1 for Uranus, der drejer med uret om IAU's nordpol, +1 for Neptun, `hældning`, polen som rektascension og deklination, og banen fra JPL's korte formler, tabel 1), `plads(navn, dato)` (AU i ekliptikkens retninger), `pol`, `knude` (Q, hvor kortets længde 0° lægges), `solRetning`, `solBredde(navn, dato, planetografisk)` (passer med JPL Horizons inden for 0,05° i 1986-2046), `baneNormal` og `solAfstand`. **Programmets retninger er ekliptikkens** som i `jordkloden.js`: y mod nord, z mod forårspunktet, x mod længde 90°.
- `js/data/vinde-isgiganter.js` (uden Three.js): `vindVed(navn, φ)` i m/s **med drejningen** (planetografisk bredde), dæmpet til 0 fra `POL_FRA` (75°) til `POL_TIL` (88°). `neptunRå` og `uranusRå` er formlerne uden dæmpning.
- `js/data/ringe-uranus.js` (UN2, uden Three.js): `RINGE` (10 tætte ringe fra NSSDC: radius, bredde, τ, epsilon rund og 58 km bred), `YDRE` (ν og μ, tegnes ikke), `ANTAL` (13 med ζ), `ALBEDO` (0,015), `tauMellem(a, b)` (gennemsnit over et interval, så smalle ringe bevarer τ gange bredde), `ringProfil(n)` (`RING_IND` 38.000 til `RING_UD` 52.000 km) og støvet (`støvVed`, `støvProfil`, tegnet, τ i `STØV_ENHED`).
- `js/data/sider/uranus.js` og `neptun.js`: siderne (Uranus: årene, ringene og isgiganter, nørd, billeder og "Ærligt talt". Neptun: kun den korte tekst, nørd, billeder og "Ærligt talt").
- `billeder/solsystem/lav_isgiganter.py`: kortene `uranus-2k/1k.jpg` og `neptun-2k/1k.jpg` (se `KILDER.md`). Pc henter 2k, tablet, telefon og tests 1k.

## Sådan hænger det sammen
- **Aksen:** `planetG.quaternion` laves af basen (−Q, IAU's nordpol, nordpol × Q), så kuglens +y peger mod IAU's nordpol og kortets længde 0° (−x i `SphereGeometry`) mod knuden Q. `planet.mesh.rotation.y = døgn` drejer om IAU's nordpol: `DREJ` har fortegnet `retning`, så Uranus' døgn falder.
- **Aksens hældning** (NSSDC: 97,77° og 28,32°) er vinklen mellem banens normal og den akse, planeten drejer **mod uret** om (`retning` gange IAU's nordpol). IAU's nordpol ligger altid nord for banen, så for Uranus er vinklen til den 82,23°. Testen tjekker begge dele.
- **Solen** står i `sol` (systemets retninger) for dagens dato (`new Date()` i `lav`). Skyderen "År" (UN2) skal kun ændre `sol`.
- **Uret:** `SEK_PR_SEK` = 450 (som Jupiter), så Uranus' døgn tager ca. 138 sekunder i programmet og Neptuns ca. 129. ⏩ `HURTIG` = 20.
- **Vindene:** teksturen har én række pr. parametrisk bredde (`VIND_RÆKKER` 512) med `retning · vind / (R cos β)` i uv pr. sekund (+ er mod øst i kortet). Ved ækvator blæser det mod drejningen på begge planeter: mod vest (uv < 0) på Neptun og mod øst (uv > 0) på Uranus. `FASE` er 10 sekunder (Jupiter 40), for vindene er hurtige i forhold til planeternes størrelse (Neptuns ækvator flytter sig ca. 4° i én fase).
- **Startbilledet:** set fra Solens retning drejet 28° om ekliptikkens akse og lidt oppefra (`START`), så man ser dagsiden og den pol, der har sol.
- **`planet.js`** har fået den valgfrie `kantFarve` (standard den varme farve, Saturn og Jupiter er uændrede) og `kapper` (UN2).

## UN2: Uranus' årstider og ringe (valgfrit i `cfg`, Neptun har dem ikke)
- **`cfg.år`** (`{ fra: 1986, til: 2070 }`): skyderen "År" i Styr-boksen (trin 0,1, viser årstallet). `sætÅr(v)` sætter kun `sol` (`solRetning` for `årTilDato(v)`) og kapperne. Kameraet, døgnet og vindene er uændrede (jeres svar 6). Skyderen starter på dagens dato (`datoTilÅr`).
- **`cfg.kapper`:** `planet.js` med `kapper: { fra, til, vNord, vSyd }` (`#define KAPPER`): Kortet har kappen over begge poler (nord fra 2025, syd spejlet). Fra ca. 35° til 60° bredde toner farven mod et lille niveau i kortet ved 25° på samme halvkugle, når kappen er slukket. `sætKapper(nord, syd)` sættes af `sætKapper()` ud fra Solens bredde: fuld over `KAPPE_TIL` (55°), væk under `KAPPE_FRA` (15°) mod den pol (tegnet).
- **`cfg.ringe`** (`'uranus'`): `lavRinge` uden støv med `lys` = `ALBEDO` (ringene er mørke som kul, I/F ca. 0,015) og `RING_N` punkter (pc 8.192, tablet 4.096, tests 2.048), og et lag støv (`støv: true`, `STØV_LYS` 8, tegnet). Begge i `planetG` (ækvatorplanet). Planeten får ringenes skygge (`ringTekstur`, `RING_SKYGGE`). Ringene koster ikke noget, man kan måle (testbrowseren, skiftevis med og uden).
- **Kontakten "Infrarødt (som JWST)"** (kun med ringe): toner `ir` ind og ud (2,5 pr. sekund). Planeten `IR_PLANET` (0,4) gange så lys, ringene `IR_RINGE` (40) og støvet `IR_STØV` (3) gange lysere.
- **`helSystem(retning)`** flyver så langt ud, at hele ringsystemet er i billedet (til tests nu, til flybyens oversigt i UN5).

## Testadgang (`atomlabTest.solsystem.fænomen()`)
`drejning()`, `døgnTid`, `form()` (flad, radius, hældning i grader mod banen, segmenter), `hentet()`, `billeder()`, `pol()` og `sol()` (verden), `solSystem()`, `punkt(længde)` (et punkt på ækvator i verden), `midt()`, `ur()` (vind, døgn, hurtig), `strøm(bredde)` (`ms` med drejningen regnet tilbage fra teksturen og `uv`), `tur()` og `hop()`. UN2: `år()`, `sætÅr(v)` (flytter også skyderen), `kapper()`, `ringeSynlige(til)`, `ringe()` (synlige, ind, ud, lys, støvLys, punkter), `infrarødt()`, `eksponering()`, `drejSelv(til)` og `visRinge()`. Test: `tests/isgiganter.mjs`. Billeder og billeder i sekundet med fuld grafik: `node tests/vaerktoejer/isgiganter.mjs [størrelse] [uranus|neptun] [hel modlys hurtig ir 1986 2007 …]`.
