# Historik: Tid og rum

*Det forrige "Senest lavet" fra [lige-nu/tid.md](../../lige-nu/tid.md) flyttes hertil ordret, nyeste øverst (fra 7. november 2026).*

**Senest lavet (9. november 2026): T5a, fænomenet "Hvorfor går tiden langsommere?" med scene 1 og 2.**
- **Fænomenet** `js/kosmos/tidhvorfor.js` (🔦, "Lysets mærkelige regel") står lige efter Rejsen i tid i Kosmos (13 fænomener). Fem scener er trin i bjælken (‹, fem prikker og "Næste"). Første gang går man frem med "Næste", og en prik længere fremme går kun til den næste scene. Det huskes kun, mens AtomLab er åben (intet i localStorage). Scene 3-5 siger "kommer snart".
- **Scene 1** (⚾ Bold / 🔦 Lygte og "Togets fart") og **scene 2** (skyderen "Fart" og kontakten "△ Vis trekanten", der stopper uret, når lyset er oppe, og tegner trekanten med 1² + 1,73² = 2²). Teksterne er drejebogens ordret. Underteksten er "altid fremme", og "Lige nu" viser scenens spørgsmål og overgangen.
- **Lærredet** står i overlaget og får den højde, der er plads til mellem Styr-boksen og underteksten med bjælken. På telefon på højkant får 3D-billedet 76 % af højden, når fænomenet er åbent.
- **Lysuret er delt:** `js/kosmos/lysur.js` (uret, spejlene, lyset, zigzaggen og trekanten) bruges af både Rejsen i tid og det nye fænomen. Rejsen i tid ser ud som før. Den har fået knappen "🔦 Hvorfor? Se det trin for trin" i emnet "Hvorfor går Jordens ur så hurtigt?".
- **Tests:** `tests/tidhvorfor.mjs` (23 tjek), `tests/kosmos.mjs` med 13 fænomener.

**Senest lavet (9. november 2026): T5 Trin 0, drejebogen, faktagrundlaget og skitserne til "Hvorfor går tiden langsommere?".**
- **Drejebogen** [plan-tid-t5.md](../plan-tid-t5.md): fem scener (bolden og lyset, lysuret med trekanten, myonernes kapløb, "nu" er ikke det samme for alle og rumtidskortet) med teksterne i lag, rammen, henvisningerne til Rejsen i tid og layoutet på højkant. Jeres svar 8. november: navnet, en rejse med "Næste" og spring, lampen og én pointe i scene 4 og vendepunktet, man trækker, i scene 5.
- **Faktagrundlaget** [fakta-tid/hvorfor-langsommere.md](../fakta-tid/hvorfor-langsommere.md) (afsnit 15) med tallene i regn.py. Frisch og Smiths tal (563, 412 og 27 i timen) er nu bekræftet i Wikipedia. Nye fælder i fakta-faelder.md.
- **Skitserne** [skitser/tid-t5.html](../skitser/tid-t5.html) (artefaktet "Hvorfor går tiden langsommere?"). Jeres runde 9. november: "Skitsen er afprøvet. Den er god." Godkendt uden ændringer.

**Senest lavet (8. november 2026): Jeres ønsker til "Rejsen i tid" (efter T3).** I `js/kosmos/tid.js` og `js/data/tid.js`:
- **"Hurtigere end lyset? Nej!"** (jeres spørgsmål: 4 lysår på 21 dage): et nyt emne øverst, der henviser til T3's "Set fra skibet" med tre trin: set fra Jorden (turen tager 4,3 år, et lysglimt sendt samtidig kommer kun knap 4 timer før, men dit ur går 71 gange langsommere), set fra skibet (vejen er skrumpet til 0,061 lysår) og "begge dele er rigtige". "Lige nu" siger det samme kort med de rigtige tal for målet og farten (`forspring`, `forspringTekst`), før afgang, ved målet og hjemme.
- **Målet er tre kontakter** (🎯 Alpha Centauri, Mælkevejens centrum, Andromeda), hvor præcis én er tændt, i stedet for skyderen "Mål". Skyderen "Fart" hedder nu "Fast fart".
- **"Fast fart eller 1 g?"**: T3's emne "Hvorfor tager det år med 1 g?" hedder nu sådan og forklarer også fast fart (folder sig stadig ud med 1 g), og "Lige nu" siger før afgang, hvad den valgte måde betyder (fast fart er snyd, 1 g er den realistiske). Alternativet til 1 g er skyderen "Fast fart".
- **Lysuret trin for trin** (bjælken ‹ og "Næste", `LYS_TRIN`): 1 Et lysur (kun skibets), 2 Set fra Jorden, 3 Den skrå vej er længere (står stille med den lige og den skrå vej, 2 gange så lang), 4 Uret går langsommere (tæl tikkene), 5 Alt om bord følger med (skyderen "Fart i lysuret": 0, 50, 87, 95 og 99 %). Lysuret har sin egen fart (87 %, γ = 2): Ved rejsens 99,99 % fór spejlene mange gange hen over billedet for hvert tik, så zigzaggen var umulig at forstå. Billedet fra Jorden følger nu spejlene, så de aldrig forsvinder ud af det.
- Faktatjek: alle tal regnet efter med `js/data/tid.js` mod fakta-tid.md (22 dage, 3,8 timer, 71, 0,061 lysår, 95 % midtvejs med 1 g, over 96 % efter 2 år, γ = 2 ved 86,6 %).
- Test: `tests/tid.mjs` (alle T3's tjek og de nye).

**Senest lavet (8. november 2026): T3, lagene og teksterne.** I "⏳ Rejsen i tid" (`js/kosmos/tid.js`):
- Syv emner: de to fra T1 og nu "Hvorfor ikke omvendt?" (tvillingeparadokset), "Set fra skibet" (længdeforkortelsen, folder sig ud med kontakten), "Hvorfor tager det år med 1 g?" (folder sig ud med "1 g hele vejen", har nu de 11.500 g), "Er det målt?" (myonerne, Hafele og Keating, GPS med en knap til Rumtid, Kononenko og urene, der løftes 33 cm) og "Kunne man?" (energien, brændstoffet, sandkornet og gassen). Knapperne "Set fra skibet" og "1 g hele vejen" står også i teksten.
- "For nørder": reglen om √10, 1 g med Jordens tid, tvillingeparadokset med rumtidens minus, samtidighed og "Hvad er et sekund?" med knappen "Cæsium ›". Den åbner cæsiums kort i Det periodiske system (ny lytter efter `data-gaa="system:55"` i `js/system.js`).
- "Ærligt talt": fælderne (accelerationen, lyset har intet ur, galakserne, Interstellar). Brændstoffet er flyttet til "Kunne man?".
- "Hvorfor?"-kortet "Hvorfor kan intet nå lysets fart?" (`lysfart` i `js/data/hvorfor.js`, fælden om massen i dets nørd-bid) og tre ord i Ordbogen: tidsforlængelse, længdeforkortelse og myon (med links til Rejsen i tid).
- Faktatjekket mod fakta-tid.md og kilderne (tabellen står i `docs/fakta-tid.md` under "Faktatjek af T3"). Fælderne er flyttet til `docs/erfaringer/fakta-faelder.md`.
- Test: `tests/tid.mjs` (173 tjek, nu også teksterne, knapperne i teksten, at emnerne folder sig ud med kontakterne, "Hvorfor?"-kortet og cæsium).

**Senest lavet (7. november 2026): T2, alle mål, "1 g hele vejen" og afstanden, der skrumper.** I "⏳ Rejsen i tid" (`js/kosmos/tid.js`, regningen i `js/data/tid.js`):
- Skyderen "Mål" (Alpha Centauri, Mælkevejens centrum og Andromeda, med en bule af stjerner og en skrå spiral lavet med `prikSky`) og skyderen "Fart" op til 14 ni-taller ("99,9…9 % (12 ni-taller)"). Et skift af mål starter forfra. Hver vej tager 12,5 sekunder på skærmen uanset målet (⏩ 4 gange hurtigere). Med fast fart følger skærmen Jordens ur, med 1 g dit ur.
- Kontakten "1 g hele vejen": speed op med 1 g til midtvejs og brems resten (3,6 / 19,8 / 28,6 år i skibet én vej). Skyderen "Fart" forsvinder, og "Lige nu" viser farten nu og den største fart midtvejs.
- Kontakten "Set fra skibet": scenen trykkes sammen om skibet med γ^(−1/3) (meget mindre end i virkeligheden, siges ærligt). "Lige nu" viser altid to afstande (set fra Jorden og d/γ set fra skibet) og ved målet "En radiobesked hjem tager 4,3 år".
- Hjemkomsten: over 100 år årstallet ("år 56.018"), en sammenligning med fortiden (neandertalerne, Lucy) og tvillingen. Er turen over ca. 87 år for dig: "Så længe kan ingen leve" og overskriften "Turen er slut". Urskiven gløder, når Jordens ur løber mange år i sekundet. Årstal under 10.000 uden punktum.
- "For nørder" og "Ærligt talt" har fået 1 g, brændstoffet og "Set fra skibet". Resten af teksterne er T3. Faktatjekket mod fakta-tid.md.
- Test: `tests/tid.mjs` (146 tjek, også 1 g mod afsnit 6 og de nye mål mod afsnit 5) og `tests/vaerktoejer/tid-tekster.mjs` (alle hjemkomster til gennemlæsning).
- Node.js og Playwright er nu installeret på Windows-pc'en, så testene kan køre her (se tests-og-vaerktoejer.md under erfaringerne).

**Senest lavet (7. november 2026): T1, lysuret og rejsen til Alpha Centauri.** Et nyt fænomen i Kosmos lige efter Rumtid: "⏳ Rejsen i tid" (`js/kosmos/tid.js`, regningen i `js/data/tid.js`).
- Jorden, skibet og Alpha Centauri A og B. Skyderen "Fart" går fra 90 % til 99,9999 % (99,99 % fra start) og kan skiftes undervejs. "🚀 Flyv til Alpha Centauri" går gennem fire faser: afgang, ude ved målet (med tiden for én vej), på vej hjem og hjemkomsten ("Du har været væk i 45 dage, men på Jorden er der gået 8,7 år. Du er 13 år og 45 dage. Din tvilling er 21.").
- To ure oven på 3D-billedet: "Dit ur" (dage og timer, eller år og dage) og "Jordens ur" (årstallet fra i år) med en urskive, der går én gang rundt pr. år. Under dem står din og tvillingens alder. ⏩ går 6 gange hurtigere, og pausen virker.
- "⏱ Vis lysuret": to lysure side om side (i skibet og set fra Jorden). Spejlene farer forbi, og sporet viser zigzaggen, der bliver flad ved høj fart. Farten følger skyderen. Imens står rejsen stille.
- Siden: Kort, to emner ("Hvorfor går Jordens ur så hurtigt?" og "Hvad gør farten?"), For nørder (γ, lysuret og regnestykket) og Ærligt talt (skyderen springer accelerationen over, ca. 11.500 g, du mærker intet om bord, og hvad animationen snyder med). Faktatjekket mod fakta-tid.md.
- Test: `tests/tid.mjs` (tallene mod tabellerne i fakta-tid.md og fænomenet i browseren).

**Senest lavet (7. november 2026):** Jeres svar på de fem spørgsmål efter Trin 0: "Go. Følg dine anbefalinger". Svarene står i [plan-tid.md](../plan-tid.md) under "Spørgsmål til jer efter Trin 0": fast fart med en ærlig linje og senere kontakten "1 g hele vejen", to digitale ure og en urskive for Jorden, tvillingen (begge 13 år, alderen op til ca. 100 år), op til 14 ni-taller og listen over fortiden. Prompten til T1 er skrevet. Trin 0 (faktagrundlaget og planen) står i historikken.

**Senest lavet (7. november 2026): Trin 0.** Jeres svar: placering **A**, et fænomen i Kosmos ("Rejsen i tid"). Faktagrundlaget står i [fakta-tid.md](../../fakta-tid.md) med kilder, og udregningerne i `docs/fakta-tid/regn.py`. Trinene T1-T4 står i [plan-tid.md](../../plan-tid.md) under "Trinene". Det vigtigste fra faktatjekket:
- Med 1 g tager rejsen *år* i skibet (ca. 20 år til Mælkevejens centrum og ca. 29 år til Andromeda, én vej). "Et par dage mod tusinder af år" kræver ca. 11.500 g, så skyderen med fast fart skal sige ærligt, at den springer accelerationen over.
- Planen havde fem små fejl, som er rettet i fakta-tid.md: Alpha Centauri er ca. 4,3 lysår væk (ikke 4,4), verdens energiforbrug er ca. 592 EJ (ét ton ved γ = 365.250 svarer til ca. 55.000 års forbrug), rekorden i rummet er Kononenko med 1.111 døgn (ikke Padalka), lyset fra Solen er 8 min 19 s, og eksemplet med Solvognen passer ikke til nogen af de tre mål.

**Senest lavet (7. november 2026):** Idéen og planen i [plan-tid.md](../../plan-tid.md) (intet bygget eller faktatjekket). Jeres svar: Tid kommer før Uranus og Neptun og Liv, og en **tvilling** bliver hjemme. Placeringen (A, B eller C) er ikke besluttet endnu.
