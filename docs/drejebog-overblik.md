# Drejebog: Solsystemets overblik (Opus' udkast)

*Skrevet 13. november 2026 i sporet [Solsystemet og Kosmos](lige-nu/solsystemet.md) efter [prompt-overblik.md](prompt-overblik.md) og skemaet i [skabelonen](fable/E3-forloeb.md). Fable tjekker udkastet før 16. november 2026 ([prompt-fable-overblik.md](prompt-fable-overblik.md), svaret i `docs/fable/E9-overblik.md`). Bygges efter G1 trin 3. Intet er bygget endnu.*

**Hvad det er:** Solen, de otte planeter og Pluto i deres rigtige baner, som de står i dag, som Solsystemets forside. Et tryk på en planet flyver ind til den (filmisk overgang, besluttet 5. november 2026). Første gang et forløb på fem trin, bagefter laboratoriet.

## 1. Kernesætningen
*Efter fem minutter kan brugeren sige:*

- **A (anbefalet):** "Planeterne går rundt om Solen, de inderste hurtigst, og imellem dem er rummet næsten helt tomt."
- **B:** "Hvis Solen var en fodbold, var Jorden et knappenålshoved 24 meter væk. Solsystemet er næsten helt tomt."
- **C:** "Jorden er den tredje af otte planeter om Solen, og lyset fra Solen er otte minutter om at nå os."

**Hvorfor A:** Den rummer det, forløbet viser (hvor vi er, tempoet og tomheden), og kan siges uden tal. B er det stærkeste billede, men et tal at huske, ikke en forståelse (det står i trin 4's Så). C er opslag, og lyset hører til i laboratoriet.

## 2. Forløbet
Scenen er overblikket i skalaen **Forstørret** (afsnit 3), skråt oppefra, så alle otte baner ses, med dagens dato. Panelerne, klodegitteret, tidsknappen og kontakterne er skjult, Pluto, bælterne og navnene indtil trin 5. Forløbets linje står under scenen som i "Dit første atom".

| Trin | Spørg (højst ca. 15 ord) | Gæt | Gør | Så (højst ca. 20 ord) | Ord |
|---|---|---|---|---|---|
| 1 | Sådan står Solsystemet lige nu. Hvilken af planeterne er vores? | – | Tryk på Jorden i scenen | Jorden er nummer tre fra Solen. Alle otte planeter går rundt om Solen, hver i sin bane. | planet, bane |
| 2 | Planeterne bevæger sig hele tiden. Hvem kommer hurtigst rundt? | *De inderste* / *De yderste* / *Alle lige hurtigt* | Træk tiden ét år frem (skyderen i linjen. Den stopper, når Jorden er nået rundt) | Jorden kom én gang rundt: Det er et år. Merkur nåede over fire omgange, og Neptun flyttede sig næsten ikke. | – |
| 3 | Her er planeterne pustet op, så du kan se dem. Hvordan ser det rigtigt ud? | *De bliver små prikker* / *De forsvinder helt* | Træk skyderen fra "Forstørret" til "Rigtig størrelse og afstand" | Planeterne er for små til at ses. Selv Solen er mindre end en pixel. Kun dens lys kan ses. | – |
| 4 | Jorden er der stadig. Find den. | – | Tryk på Jordens ring (en tynd cirkel med navnet) | Hvis Solen var en fodbold, var Jorden et knappenålshoved 24 meter væk, og Neptun en ært 700 meter væk. | – |
| 5 | **Det så du:** kernesætningen. Hvilken planet vil du besøge? | – | Tryk på en planet (skalaen er Forstørret igen, og alle navne er fremme) | Flyver ind til planeten (overgangen i afsnit 3) | – |

- **Wow-øjeblikket er trin 3 og 4:** Man trækker selv skyderen, og planeterne skrumper, mens afstandene vokser, til alt er væk. Så dykker kameraet i den rigtige skala fra hele Solsystemet ned til en blå kugle, der fylder skærmen (ca. 8 sekunder, med en tæller for afstanden). Det vil han vise en ven.
- **Efter gættet** (en linje, før man prøver): Trin 2: *De inderste* → "Prøv det!", *De yderste* → "Store baner, så det lyder rimeligt. Prøv det!", *Alle lige hurtigt* → "Prøv det!". Trin 3: begge → "Prøv det!". Svaret kommer i Så (i trin 3 er begge næsten rigtige).
- **Man kan ikke fejle:** Trykker man på en forkert planet i trin 1, står der fx "Det er Mars. Jorden er den blå, nummer tre fra Solen", og Jorden lyses op. "Vis mig" efter ca. 20 sekunder: Forløbet trykker eller trækker selv.
- **Trin 4:** Ringen er mindst 44 px at trykke på, også når Jorden er under en pixel.
- **Til sidst tre veje:** *Besøg en planet* (trin 5's tryk), *Leg frit* (laboratoriet) og *Er der en planet mere derude?* (gåden om Planet 9, når den findes, se afsnit 3).

**Valgt fra, og hvor det bor:** Pluto og ordet dværgplanet, asteroidebæltet og Kuiperbæltet (laboratoriet og "Hvorfor?"), lyset ("Rejs med lyset"), ellipserne, hældningen, Keplers love og astronomisk enhed (For nørder), månerne (planeternes visninger) og Planet 9 (Gåderne).

**Ordene:** planet og bane (står ikke i Ordbogen, kun "Baneplan"). Laboratoriet lægger dværgplanet, asteroidebælte og Kuiperbælte til.

**Prøven (tre spørgsmål bagefter):**
1. Hvilken planet bor vi på, og hvor ligger den?
2. Hvilke planeter kommer hurtigst rundt om Solen?
3. Hvorfor kunne man ikke se planeterne i rigtig størrelse og afstand?

**Eget link:** `?forloeb=overblik#solsystem`. ✓ i "Din fremgang".

## 3. Laboratoriet bagefter
**Altid fremme:** scenen, linjen med datoen ("13. november 2026, i dag") og **tidsskyderen** nederst (den ene ting at gøre).

**Venstre panel:** klodegitteret som i dag med "Solsystemet" som første klode, og under det Styr-boksen med fire valg:
1. **Skala:** en skyder fra "Forstørret" til "Rigtig størrelse og afstand" (som i trin 3).
2. **Navne:** den fælles kontakt fra `navne.js`.
3. **Rejs med lyset:** en lysende skal vokser ud fra Solen i den rigtige skala, og et ur viser, når den når hver planet (Jorden efter 8 min 19 s, Neptun efter ca. 4 timer). Spolet frem, og det står der.
4. **Bælterne:** asteroidebæltet og Kuiperbæltet til og fra (til fra start).

**Højre panel:** titlen "Solsystemet", to tal ("Solen har over 99,8 % af al massen" og "Lyset er 8 minutter om at nå Jorden"), højst tre sætninger og fire spørgsmål:
1. Hvorfor går alle planeterne samme vej rundt?
2. Hvorfor er Pluto ikke en planet længere?
3. Hvordan ved vi, hvor planeterne er lige nu? (et "Hvordan ved vi det?"-kort: Kepler og JPL)
4. Er der en planet mere derude? (peger på gåden om Planet 9)

Derefter "For nørder" (astronomisk enhed, Keplers 3. lov, banernes hældning og formlerne fra JPL) og "Ærligt talt" (de to skalaer, at bæltet ser tæt ud, men er næsten tomt, og at Solens glød er større end Solen).

**Tidsskyderen:** 1800-2050 (JPL's formler, tabel 1), "I dag" og tidsknappen med ⏩ som ved Jorden. Alt bruger `opdater(dt, tid)`, så det står stille under pause.

**De to skalaer** (begge siges ærligt):
- **Forstørret:** Afstandene er presset sammen (afstanden fra Solen tegnes som kvadratroden af den rigtige), og planeterne er pustet op, men den største er stadig størst. Banernes form og hældning er de rigtige, og Plutos bane krydser stadig Neptuns.
- **Rigtig størrelse og afstand:** alt i samme skala. Planeterne får en tynd ring med navnet, og Solen tegnes som sit lys (en glød), og det siges. Skyderen glider imellem.

**Ind til en planet og ud igen:**
- **Ind:** Tryk på planeten, dens navn eller kloden i gitteret. Kameraet flyver mod planetens lille kugle (2-3 s, `glatVej` i `rejse.js`), til den fylder ca. en tredjedel af skærmen, mens planetens første kort hentes. Så toner billedet gennem mørke (ca. 0,5 s) over i planetens egen visning, hvor kameraet glider det sidste stykke ind (ca. 1 s).
- **Mørket skjuler et brud:** Mars, Jupiter og Saturn har en fast retning til Solen og en fast årstid (Saturns ringe står som i 2004), mens overblikket viser dagens. En krydstoning ville vise ringene vippe. Overblikket flyver derfor ind fra den side, der giver samme fase (hvor meget er belyst). Jorden, Venus, Uranus og Neptun regner allerede Solens retning ud fra datoen.
- **Ud:** "Solsystemet" i vejen øverst (`#solsystemVej`: Solsystemet › Mars › Olympus Mons) eller i klodegitteret. Omvendt overgang, og overblikket står, som man forlod det.
- **Merkur og Pluto** (ikke bygget): Kameraet flyver ind til deres kugle i overblikket (rigtigt kort, døgn og hældning), og panelet viser navn, to tal, tre sætninger og "Besøget kommer senere".
- **Planet 9:** tegnes ikke (ingen har set den). Spørgsmål 4 peger på gåden, som kan genbruge scenen langt ude med Kuiperbæltet og de aflange baner ([plan-gaader-3d.md](plan-gaader-3d.md), nr. 5).

## 4. Fakta
Tjekket 13. november 2026 (NSSDC-tal regnet efter). Teksterne tjekkes igen med `/faktatjek`, når de skrives.

| # | Påstand | Mærke | Kilde |
|---|---|---|---|
| 1 | Solen har over 99,8 % af Solsystemets masse | Sikker | NASA "Sun: Facts". NSSDC regnet: 99,87 % |
| 2 | Solen er ca. 109 gange så bred som Jorden | Sikker | NSSDC Sun Fact Sheet (695.700 km mod 6.371 km) |
| 3 | Lyset er 8 min 19 s om at nå Jorden og ca. 4 timer og 10 minutter om at nå Neptun | Sikker | 1 AU = 149.597.870,7 km (IAU 2012), c = 299.792,458 km/s. Neptun 4.515 mio. km (NSSDC) |
| 4 | Omløbstider: Merkur 88 døgn, Jorden 365,2, Mars 687, Jupiter 11,9 år, Saturn 29,4, Uranus 84, Neptun 164 (59.800 døgn), Pluto 248 | Sikker | NSSDC Planetary Fact Sheet |
| 5 | Merkur når over fire omgange på et år, og Neptun flytter sig ca. 2° | Sikker | Regnet: 365,25/88,0 = 4,15 og 360°/164 år = 2,2° |
| 6 | Alle planeter går samme vej rundt, og banerne hælder højst 7° (Merkur). Plutos hælder 17° | Sikker | NSSDC (hældning mod ekliptikken) |
| 7 | Fodbolden: Solen 22 cm → Jorden 2,0 mm 23,7 m væk, Jupiter 2,3 cm 123 m væk, Neptun 7,8 mm 714 m væk | Sikker (regnet) | NSSDC-diametre og -afstande. Fodbold str. 5: omkreds 68-70 cm (IFAB), dvs. ca. 22 cm |
| 8 | Med hele Neptuns bane på 1.000 pixel er Solen 0,15 pixel og Jorden 0,0014 pixel (4K: Solen 0,6) | Sikker (regnet) | Som 7 |
| 9 | Den nærmeste stjerne (Proxima Centauri) ville i fodbold-skalaen ligge ca. 6.350 km væk, omtrent som København-New York (6.190 km). Kun til "Hvorfor?" | Ret sikker | Regnet med 4,2465 lysår (Gaia, via Wikipedia) |
| 10 | Asteroidebæltet ligger mellem Mars og Jupiter og er næsten tomt | Ret sikker | NASA "Asteroids: Facts"; Wikipedia "Asteroid belt" ("mostly empty") |
| 11 | Kuiperbæltet går fra Neptuns bane (ca. 30 AU) til ca. 50 AU (hoveddelen) | Sikker | NASA "Kuiper Belt: Facts" |
| 12 | Pluto blev dværgplanet, da IAU vedtog definitionen af en planet 24. august 2006 | Sikker | IAU resolution B5 (via Wikipedia) |
| 13 | JPL's korte formler (tabel 1) giver planeternes plads inden for ca. 0,2° i 1800-2050 (Saturn er den værste med 600″) | Sikker | ssd.jpl.nasa.gov/planets/approx_pos.html (tabellen "Accuracy") |
| 14 | **Pluto er fjernet fra JPL's tabel** ("The former planet Pluto has also been removed"), så Plutos bane skal komme fra Horizons og tjekkes i en test | Sikker | Samme side |
| 15 | Planet 9 er hverken fundet eller modbevist | Ret sikker | [fakta-gaader.md](fakta-gaader.md), "Reserven" |

## 5. Ydelse
Budgettet i [retning.md](retning.md): en skærm uden kloder ca. 1 MB, en klode ca. 20-25 MB.

**Hentes, når Solsystemet åbnes (overblikket), i alt under ca. 1 MB:**
- Modulet (`js/solsystem/overblik.js` og `js/data/planeter.js`, ca. 40 KB). Banerne regnes med `plads` fra `js/data/isgiganter.js` (Venus bruger den allerede), som flyttes til `planeter.js` med alle planeterne og Pluto.
- Små kort (1k) til de ni kugler: fire findes (Jupiter, Uranus, Neptun og Venus' skyer, 160 KB i alt), fem skal laves (ca. 50-120 KB hver).
- Solen som shader (ingen billeder). Stjernehimlen findes.
- Asteroiderne og Kuiperbæltet som ét lag prikker hver (ca. 2.000 på tablet, 5.000 på pc), der kredser i shaderen, så det koster intet at spole.

**Hentes, når man flyver ind:** planetens egen visning som i dag (Mars 18,6 MB på tablet). Første kort hentes, mens kameraet flyver, og "Henter …" vises kun, hvis det ikke er nået.

**Det dyre, og hvad der gøres ved det:**
- **Hak lige ved wow'et:** G1 viste, at nye shadere og store kort hakker på bærbare uden grafikkort. Overblikkets shadere laves, når det åbnes (`lavShadereFørst`), og toningen venter, til planetens shadere og første kort er lagt i grafikkortet (`initTexture`). Hellere et hak i mørket end i flyvningen.
- **Den rigtige skala:** fra 30 AU til 6.371 km er ca. 10⁶. `rejse.js` flytter og skalerer systemet, så fokus står i midten (præcisionen), og `near` og `far` sættes efter fokus som ved Saturn. Ingen logaritmisk dybde (den hører til den fælles renderer).
- **Tilbage:** Overblikket bliver i hukommelsen (få MB), så det er der med det samme. Planetens store kort frigives, når man går, som i dag.
- **Genbruges:** `rejse.js`, `navne.js`, `hent.js`, `shadere.js`, `maaler.js` (mål overgangen med `?maal`), klodegitteret og vejen fra `faenomenskaerm.js` og Forløb-klodsen.

## 6. Til Fable og til jer
**Fælder, jeg fandt:** JPL har fjernet Pluto fra de korte formler (punkt 14). Og planeternes visninger bruger ikke samme dato som overblikket (afsnit 3, "Mørket skjuler et brud").

**Spørgsmål til jer** (min anbefaling først):
1. **Kernesætningen:** A (anbefalet), B eller C fra afsnit 1?
2. **Afstandene i "Forstørret":** kvadratroden (anbefalet: alle otte ses, rækkefølgen og formen holder), logaritmisk (ser mindre rigtigt ud) eller de rigtige, hvor de inderste klumper sammen.
3. **Overgangen til Mars, Jupiter og Saturn:** gennem mørke med samme fase (anbefalet), eller visningerne lærer først datoen (bedst, men en opgave pr. planet).
4. **Merkur og Pluto, før de er bygget:** en lille kugle i overblikket med et kort panel (anbefalet), eller kun navnet med "kommer senere".
5. **Tidsskyderen:** 1800-2050, hvor formlerne er bedst (anbefalet), eller 1900-2100 med JPL's tabel 2 (lidt større fejl).
6. **Planet 9:** kun som spørgsmål, der peger på gåden (anbefalet), eller et felt i overblikket, der viser, hvor man leder.

## Jeres svar (13. november 2026)
- **1-3:** anbefalingerne: kernesætning A, "Forstørret" med kvadratroden og overgangen gennem mørke med samme fase.
- **4, Merkur og Pluto:** "Lad os få dem bygget, men indtil da en placeholder eller hvad du anbefaler." Indtil de er bygget: den lille kugle med et kort panel. Bagefter får de overgangen som de andre.
- **5 og 6** er ikke spurgt endnu. Anbefalingen gælder, indtil I siger andet.
