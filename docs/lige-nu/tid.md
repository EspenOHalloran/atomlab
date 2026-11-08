# Lige nu: Tid og rum

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i `docs/arkiv/historik/tid.md`. Højst ca. 5 KB. Sidst opdateret: 7. november 2026.*

**Senest lavet (7. november 2026): T2, alle mål, "1 g hele vejen" og afstanden, der skrumper.** I "⏳ Rejsen i tid" (`js/kosmos/tid.js`, regningen i `js/data/tid.js`):
- Skyderen "Mål" (Alpha Centauri, Mælkevejens centrum og Andromeda, med en bule af stjerner og en skrå spiral lavet med `prikSky`) og skyderen "Fart" op til 14 ni-taller ("99,9…9 % (12 ni-taller)"). Et skift af mål starter forfra. Hver vej tager 12,5 sekunder på skærmen uanset målet (⏩ 4 gange hurtigere). Med fast fart følger skærmen Jordens ur, med 1 g dit ur.
- Kontakten "1 g hele vejen": speed op med 1 g til midtvejs og brems resten (3,6 / 19,8 / 28,6 år i skibet én vej). Skyderen "Fart" forsvinder, og "Lige nu" viser farten nu og den største fart midtvejs.
- Kontakten "Set fra skibet": scenen trykkes sammen om skibet med γ^(−1/3) (meget mindre end i virkeligheden, siges ærligt). "Lige nu" viser altid to afstande (set fra Jorden og d/γ set fra skibet) og ved målet "En radiobesked hjem tager 4,3 år".
- Hjemkomsten: over 100 år årstallet ("år 56.018"), en sammenligning med fortiden (neandertalerne, Lucy) og tvillingen. Er turen over ca. 87 år for dig: "Så længe kan ingen leve" og overskriften "Turen er slut". Urskiven gløder, når Jordens ur løber mange år i sekundet. Årstal under 10.000 uden punktum.
- "For nørder" og "Ærligt talt" har fået 1 g, brændstoffet og "Set fra skibet". Resten af teksterne er T3. Faktatjekket mod fakta-tid.md.
- Test: `tests/tid.mjs` (146 tjek, også 1 g mod afsnit 6 og de nye mål mod afsnit 5) og `tests/vaerktoejer/tid-tekster.mjs` (alle hjemkomster til gennemlæsning).
- Node.js og Playwright er nu installeret på Windows-pc'en, så testene kan køre her (se tests-og-vaerktoejer.md under erfaringerne).

**Næste (venter på et go):** T3, lagene og teksterne (emnerne om tvillingeparadokset, længdeforkortelsen, "Er det målt?" og "Kunne man?", et "Hvorfor?"-kort, cæsiumuret og tre ord i Ordbogen). Start en ny session med "Læs docs/prompt-tid-t3.md" (Opus, høj effort). Bagefter venter T4 (udsigten fra cockpittet) på sit eget go.

**Spørgsmål til jer:** ingen lige nu.
