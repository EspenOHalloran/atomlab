# Prompt: Skærmlisten og hentning efter behov (eftersynets nr. 10a)

*Skrevet 11. november 2026 i E2. Sporet Småting. Model: Opus, effort høj. Kør den **alene**: Ingen andre sessioner må røre `js/main.js`, `index.html` eller `style.css`, mens den kører. Kopiér teksten nedenfor ind i en ny session.*

---

Du er i sporet Småting og laver eftersynets nr. 10a: skærmlisten og hentning efter behov.

**Læs først:** CLAUDE.md (står allerede i samtalen), `docs/lige-nu/smaating.md`, [docs/retning.md](../retning.md) (afsnittet Ydelse), afsnittet "nr. 10" i `docs/fable/E1-eftersyn.md` og punkt 1 under "Hvor jeg er uenig" i `docs/fable/E1-noter.md`. Derefter `docs/kode.md`, `docs/kode/faelles.md` og `js/main.js`. Tjekliste D og E.

**Målet:** I dag importerer `js/main.js` alle skærme og bygger alle ni ved start (`lavVærksted()`, `lavSystem()` … linje 66-80). Fremover:
1. **Én liste over skærmene** (fx `js/skaerme.js`): id, verden, titel, hvor koden ligger, og status ("færdig" eller "prøve"). `VERDENER` i `js/karrusel.js` og "Din fremgang" bruger listen i stedet for egne lister, hvor det giver mening.
2. **Hver skærm hentes med `import()` og bygges første gang, den åbnes.** Menuen, fremgangen og ordforklaringerne skal stadig virke uden at hente skærmene (fx har "Din fremgang" brug for opgavernes antal: flyt dem til `js/data/`, hvis de i dag kun findes i skærmens modul).
3. **En ny del bliver en linje i listen** og en mappe eller et modul.
4. Vis "Henter …" (`js/hentning.js`), hvis det tager tid.

**Ikke nu (10b):** at flytte skærmenes HTML ud af `index.html` og CSS ud af `style.css`. Det sker gradvist, når en skærm alligevel åbnes (først Molekyler). Men gør listen klar til det.

**Pas på:**
- `?test` og `window.atomlabTest` (`docs/kode/testadgang.md`): Testadgangen for en skærm findes først, når skærmen er hentet. Testene må ikke gå i stykker. Find en løsning, fx at testadgangen henter skærmen, eller at testene åbner skærmen først.
- Gemte data (`docs/kode/gemte-data.md`), adresser med `#`, "Start her", `atomlabSidsteDel`, "Start forfra" og hoppet fra Det periodiske system til Værkstedet (`åbnGrundstof`).
- Intet byggetrin og ingen nye biblioteker.

**Arbejdsgang:** Lav først en kort plan (`docs/plan-skaermliste.md`, højst ca. 4 KB) med listen, rækkefølgen af skærmene og hvordan testene klarer det. Få et go. Spørg også, om Fable skal læse planen igennem én gang (Fables råd i E1, afsnit 8, ca. 2-5 $). Byg derefter en skærm ad gangen, og kør `--ændret` undervejs. Til sidst hele testsamlingen (fælles moduler er ændret) og målingen af starten (`tests/vaerktoejer/maal-eftersyn.mjs`, kun menuen), før og efter. `/faerdig`.
