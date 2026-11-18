# Prompt: Liv L6, kortet "Hvor sikkert er et spor?" ved Cheyava Falls

*Skrevet 18. november 2026, da L5 (delen "Begyndelsen") var færdig. Start en ny session med "Læs docs/prompt-liv-l6.md". **Model: Opus. Effort: høj** (fakta om liv i rummet, plan-liv.md, afsnit 10). En lille opgave, men den har brug for sit eget go. Spørg kun, hvis noget er uklart.*

---

Spor: Molekyler. Navngiv chatten "Molekyler · Liv L6: kortet Hvor sikkert er et spor?". Tjek først i `origin/main`, at det ikke er bygget (CLAUDE.md, "Parallelle sessioner").

**Det, der skal bygges** (drejebogen [drejebog-liv.md](drejebog-liv.md), afsnit 6, og [plan-liv.md](plan-liv.md), afsnit 7, punkt 3): Ét "Hvorfor?"-kort, **"Hvor sikkert er et spor?"**, ved Cheyava Falls på Mars: de syv trin på CoLD-skalaen (Green m.fl. 2021, Nature 598:575) forklaret enkelt (fra "vi har målt noget" til "liv er den eneste forklaring"), hvor Cheyava Falls står (ærligt: et *muligt* biospor), og meteoritten ALH84001 fra 1996 som eksemplet på et spor, der ikke holdt. Højst 3-5 korte sætninger i svaret og resten under "For nørder".

**Hvor det står:**
1. Kortet i `js/data/hvorfor.js` (fx `livSpor`) og en knap til det **kun i Cheyava Falls-blokken** i `js/data/sider/mars.js` (Neretva Vallis-siden ved linje ca. 427 og/eller rovernes side ved linje ca. 216). Rør ikke resten af Mars (sporet Solsystemet).
2. Links til kortet fra gådekortet "Er der liv andre steder?" (kun én linje i `js/data/gaader.js`, som L5 gjorde med `seDet`) og fra Begyndelsen (fx en `næste` på kortet `begRummet` i `js/data/hvorfor.js`, så det ikke lægger noget til panelet). Lægger det noget til et panel, så sig, hvad der flytter ned.

**Læs først (kun disse dele):** `docs/lige-nu/molekyler.md`, DESIGN.md, drejebogen afsnit 6, plan-liv.md afsnit 4 og 7, `docs/fakta-liv/` (det, der står om Cheyava Falls, CoLD og ALH84001, find det med `grep`), fælderne i `docs/erfaringer/fakta-faelder-liv-og-videnskabsfolk.md` og tjekliste B. `/faktatjek` af alle nye påstande (Green m.fl. 2021, NASA om Cheyava Falls (Hurowitz m.fl., Nature 2025), McKay m.fl. 1996 om ALH84001). Wikipedia svarer 429: brug `index.php?title=…&action=raw`.

**Tests:** 2-4 tjek i den test, der passer (fx `tests/mars-steder.mjs` eller en lille Node-del i `tests/begyndelsen.mjs`: kortet findes, knappen står i Cheyava Falls-blokken, og linkene peger på kortet). Kun `--ændret`.

**Til sidst:** Status i `docs/lige-nu/molekyler.md`, linjer i "Ikke afprøvet", og skriv, hvad det næste i sporet er (Ild, køreplanen nr. 6).
