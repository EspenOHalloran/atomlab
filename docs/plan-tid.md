# Idé og plan: Tid og rum (relativitet)

*Startet 7. november 2026. Idéen er jeres. Opus' forklaring, idéer og forslag står i samtalen fra 7. november 2026 og er skrevet ind her, så en ny session kan arbejde videre. **Intet er besluttet eller bygget endnu**, og **ingen tal er faktatjekket** (de er Opus' egne udregninger og hukommelse og skal gennem `/faktatjek`, før de kommer i programmet).*

## Jeres idé (jeres ord)
"Vi er nødt til at dykke længere ned i fænomenet 'tid'. Hvordan kan det være, at hvis man rejser tæt på lysets hastighed, så kan man have været væk fra Jorden i et par dage (i ens egen tid), men når man kommer tilbage, kan der være gået tusinder af år eller noget i den stil? Kan vi lave noget interaktivt, så man kan 'lege' med tid, der kan hjælpe med at forklare dette svære og uhyre interessante koncept? Kan det passe ind i noget af det, vi allerede har?" Og: Flere idéer til, hvordan vi kan forklare tid og sammenhængen med rum.

## Det, der findes i dag
AtomLab har et lille Einstein-hjørne i Kosmos (`js/kosmos.js`): Rumtid, Tyngdebølger, Sort hul og Ormehul. Tiden nævnes kun kort:
- `js/kosmos/rumtid.js`: "For nørder" om GPS-urene (højden giver ca. +45 µs/døgn, farten ca. −7 µs/døgn, samlet ca. +38 µs/døgn, ellers ca. 10 km fejl pr. døgn). Tallet "GPS uden rettelse: fejl på 10 km pr. døgn" står også i tallene. "Ærligt talt" siger, at det for langsomme ting mest er tidens krumning, der får dem til at falde.
- `js/kosmos/sorthul.js`: astronauten bliver langsommere og rødere set udefra (emnet "Hvad sker der med en astronaut?").
- `js/kosmos/ormehul.js`: "For nørder" om tidsrejser (et ormehul som tidsmaskine, Hawking).
- `js/data/fakta.js` og `js/data/grundstoffer.js`: cæsium bruges i atomure, der definerer sekundet (også rubidium og ytterbium).
- `js/data/sorthul.js`: tidsforlængelsen indgår allerede i lysberegningen ved Det sorte hul (rødforskydning og dopplereffekt).

Der mangler et sted, hvor man selv kan **lege** med tiden.

## Forklaringen (grundlaget for teksterne)
1. **Den ene mærkelige regel:** Lysets fart er den samme for alle, uanset hvor hurtigt man selv bevæger sig. Det er målt igen og igen. Alt det andet følger af den.
2. **Lysuret:** Et lysglimt hopper op og ned mellem to spejle, og hvert hop er ét tik. I skibet ser det normalt ud. Set fra Jorden flytter spejlene sig, mens lyset er undervejs, så lyset tager en længere, skrå vej (zigzag). Lyset kan ikke køre hurtigere for at nå det, så hvert tik tager længere tid set fra Jorden. Det gælder alt om bord (hjertet, tankerne), og den rejsende mærker intet. *Det bedste "aha" for, hvorfor det sker.*
3. **Hvor meget?** γ = 1/√(1 − v²/c²) (ren matematik, regnet efter):

   | Fart (af lysets) | 1 dag i skibet = på Jorden |
   |---|---|
   | 50 % | 1,15 dage |
   | 90 % | 2,3 dage |
   | 99 % | 7,1 dage |
   | 99,9 % | 22 dage |
   | 99,99 % | 71 dage |
   | 99,9999 % | 707 dage (knap 2 år) |

   Hvert ekstra 9-tal gør forskellen ca. √10 ≈ 3,16 gange større. "Et par dage mod tusinder af år" (fx 2 dage mod 2.000 år, γ ≈ 365.000) kræver ca. 99,9999999996 % af lysets fart (elleve 9-taller i alt, 1 − v/c ≈ 3,75 · 10⁻¹²).
4. **Hvorfor ikke omvendt? (tvillingeparadokset):** Set fra skibet er det jo Jorden, der farer af sted. Men rejsen er ikke symmetrisk: Den rejsende skal vende om for at komme hjem og skifter dermed syn på, hvad "nu" er derhjemme. Den hjemmeblevne gør ikke. I rumtiden giver den lige vej (at blive hjemme) altid den **længste** tid, og en omvej giver mindre. Det er det modsatte af en vej på et landkort, og det er hele hemmeligheden.
5. **Forbindelsen til rummet (længdeforkortning):** For den rejsende er det ikke tiden, der går langsomt, men afstanden, der skrumper. Ved 99,99 % er Alpha Centauri (ca. 4,4 lysår) kun ca. 0,06 lysår væk, og turen tager ca. 23 dage i skibet (ca. 4,4 år på Jorden). Begge forklaringer giver samme svar. Derfor slog Einstein rum og tid sammen til ét: rumtiden. Hvad der er "tid" for én, er delvist "rum" for en anden.
6. **Det er målt (ikke science fiction):**
   - **Myoner** (en slags tunge elektroner) laves af den kosmiske stråling ca. 15 km oppe. Deres levetid er ca. 2,2 µs, så uden tidsforlængelse ville de i snit gå i stykker efter ca. 650 m. Alligevel når mange ned til jorden.
   - **Atomure fløjet jorden rundt** i passagerfly (Hafele og Keating, 1971) passede med Einsteins forudsigelse.
   - **GPS** (står allerede i Rumtid).
   - **Astronauter:** De, der har været længst i rummet (fx Padalka, ca. 879 døgn), er ca. 2 hundrededele sekund yngre, end de ellers ville have været. Opus' overslag for ISS: farten giver ca. 3,3 · 10⁻¹⁰ langsommere, højden ca. 0,4 · 10⁻¹⁰ hurtigere.
   - **Ure i forskellig højde:** Man kan i dag måle, at et ur går hurtigere, når det løftes under en meter (NIST 2010 med ca. 33 cm, JILA 2022 over en millimeter). Skal tjekkes.
7. **Ærligt talt:** Ingen ved, hvordan man skulle nå den fart.
   - Ét ton ved γ ≈ 365.000 kræver (γ − 1)mc² ≈ 3,3 · 10²⁵ J, ca. 50.000 års energiforbrug for hele verden (regnet med ca. 620 EJ om året).
   - Et støvkorn på 1 µg ved den fart rammer med ca. 3 · 10¹³ J, omtrent 8 kiloton TNT (en atombombe). Ved 99,99 % er det stadig omkring 1,5 ton TNT.
   - **Mere "realistisk" (men stadig umuligt i dag):** Et skib, der accelererer med 1 g den første halvdel og bremser med 1 g resten, når Mælkevejens centrum (ca. 26.000-27.000 lysår) på ca. 20 år og Andromeda (2,5 mio. lysår) på ca. 29 år i egen tid. På Jorden er der gået ca. 27.000 og 2,5 mio. år (og man skal også hjem igen). Formel: τ = 2(c/a)·arcosh(1 + a·d/(2c²)), hvor c/a ≈ 0,97 år ved 1 g.

## Hovedidéen: "Rejsen i tid" (tvillingerejsen)
Du flyver, og din tvilling (eller en anden, se spørgsmål 3) bliver hjemme.
1. **Vælg et mål:** Alpha Centauri (4,4 lysår), Mælkevejens centrum eller Andromeda.
2. **Vælg farten:** en "9-tals-skyder" (90 %, 99 %, 99,9 % …) eller "1 g hele vejen".
3. **Flyv:** To ure ved siden af hinanden, "Dit ur" og "Jordens ur". Jordens ur ræser af sted, og man kan se tvillingens alder.
4. **Hjem igen:** Fx "Du har været væk i 6 dage. På Jorden er der gået 3.400 år, lige så længe som siden Solvognen blev lavet (ca. 1400 f.Kr., skal tjekkes)." Vi sammenligner med noget i fortiden, fordi ingen kender fremtiden.
5. **Lagene** (som resten af AtomLab):
   - "Hvorfor?": lysuret som en lille animation (zigzag).
   - "Set fra skibet": afstanden skrumper.
   - "Kunne man?": energien og støvkornet.
   - "For nørder": formlen og tvillingeparadokset.
6. **Dyrere ekstra lag: udsigten fra cockpittet.** Tæt på lysets fart samler stjernerne sig i en lys plet foran, blå foran og røde bagude (aberration, dopplereffekt og "beaming"). Det er rigtig fysik, i familie med det, der gør den ene side af skiven ved Det sorte hul lysere (`js/kosmos/linse.js`, `js/data/sorthul.js`). Ved ekstreme farter bliver baggrundsstrålingen forude blåforskudt til farlig stråling.

## Flere idéer til tid og rum
1. **Rumtidskortet:** Tegn din rejse med fingeren på et kort, hvor op er tid og til siden er rum. Et ur følger stregen. Lyset går skråt (45°), og man kan ikke tegne fladere end lyset (hurtigere end lyset). Man opdager selv, at den lige streg altid giver mest tid. Det rigtige svar på tvillingeparadokset, og godt på tablet. *Mellem.*
2. **Urenes stige (tyngdekraft og tid):** Ure i forskellig højde og tyngde: køkkengulvet og loftet, Mount Everest, en GPS-satellit, en neutronstjerne og lige ved et sort hul. Kan sættes ind i Rumtid og Sort hul. *Lille til mellem.*
3. **Myonernes kapløb:** Set fra Jorden går myonens ur langsomt. Set fra myonen er atmosfæren presset sammen. Samme svar, to forklaringer, hvor rum og tid bytter roller. Kobler til atomerne (myonen er elektronens tunge fætter) og "kosmisk stråling" i Ordbogen. *Mellem.*
4. **At se langt ud er at se tilbage i tiden:** Send et lysglimt fra Jorden, og se det kravle: Månen ca. 1,3 s, Solen ca. 8 min 20 s, Mars 3-22 min (derfor kan man ikke styre roveren med joystick), Voyager 1 ca. et døgn (efter NASAs beregning en hel lysdag væk omkring november 2026, skal tjekkes), Andromeda 2,5 mio. år. "Et lysår er en afstand målt i tid." Passer i Solsystemet (og Mars-siderne, Big Bang som det ældste lys). *Lille til mellem, billig og stærk.*
5. **Hvad er et sekund?** Et sekund er 9.192.631.770 svingninger i et cæsium-133-atom. AtomLabs atomer er bogstaveligt talt urene. Kan komme ind ved cæsium i Værkstedet eller grundstofkortet. *Lille.*
6. **Atomer som naturens ure:** Halveringstider bruges til at datere: kulstof-14 (fx moselig) og uran-bly i meteoritter (Jordens alder ca. 4,54 mia. år). Hører til isotoperne og kernen. *Mellem.*
7. **Tidens zoom:** Fra det korteste til det længste: lyset over et atom (ca. 10⁻¹⁹-10⁻¹⁸ s), en pulsar, der drejer, et hjerteslag, et menneskeliv, Universets 13,8 mia. år. Eller Universets historie presset ned i ét år (mennesket de sidste minutter nytårsaften). Passer til Big Bang og Solens fremtid, og til F1-idéen "Zoom ind fra hverdagen". *Mellem.*
8. **Tidens pil:** Hvorfor kan et æg gå i stykker, men ikke samle sig selv (entropi, uorden)? Kobler til Big Bang (Universet startede meget ordnet). Ærligt: stadig delvis en gåde, så den passer til Gåderne. *Mellem, svær at gøre enkel og ærlig.*
9. **"Nu" er ikke det samme for alle (samtidighed):** To lyn rammer et tog. Den på perronen ser dem samtidig, den i toget gør ikke. Den sværeste idé, men den forklarer tvillingeparadokset helt. Kan ligge i nørd-laget under Rumtidskortet. *Mellem.*
10. **Kan man rejse tilbage i tiden?** Fremad: Ja, astronauterne har gjort det en lillebitte smule. Bagud: De fleste fysikere tror nej (Ormehul nævner det allerede). Kan ligge i Gåderne sammen med Ormehul. *Lille.*

## Hvor skal det ligge? (ikke besluttet)
- **A. Et nyt fænomen i Kosmos,** "Rejsen i tid", ved siden af Rumtid. Bygges på fænomenskærmen (`js/faenomenskaerm.js`: faser, handlingsknapper, "Hvorfor?"-kort, "For nørder", "Ærligt talt"). Idé 2 kan blive emner eller handlinger i Rumtid og Sort hul. *Mellem til stor.*
- **B. En ny del "Tid og rum"** (eller "Relativitet") i menuen med flere stationer: lysuret, rejsen, Rumtidskortet, urenes stige og myonerne. En naturlig tvilling til den planlagte del Kvantefysik: de to store teorier fra 1900-tallet. Menuen bliver en karrusel ([plan-menu.md](plan-menu.md)), som kan rumme flere dele. Rækkefølgen er efter størrelse, så det skal afgøres, hvor "Tid og rum" står (måske ved Kosmos). *Stor.*
- **C. Kun små kroge** rundt omkring (lysets forsinkelse i Solsystemet, cæsiumuret, urene ved Sort hul). Billigt, men der er ikke noget sted at lege for alvor.

**Opus' anbefaling:** Start med **A** som et prøvestykke med lysuret og tvillingerejsen. Den kan bygges uden at vente på menuen. Bliver han grebet, kan det senere vokse til **B** (sammen med Kvantefysik), med Rumtidskortet som det næste. Idé 4 (lysets forsinkelse) og 5 (cæsiumuret) er så billige og stærke, at de kan komme med uanset hvad (fx når Solsystemet eller Værkstedet alligevel bliver rørt).

## Fælder, vi skal undgå
*Flyttes til [erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md), når de er tjekket og arbejdet går i gang.*
- **"Tiden går langsommere for dig."** Du mærker intet. Dit eget ur går altid ét sekund pr. sekund. Det er en sammenligning mellem to veje gennem rumtiden.
- **"Det er accelerationen, der gør det."** Kun en del af historien. Det afgørende er vejen gennem rumtiden (den rejsende skifter ramme, når den vender om).
- **"For lyset står tiden stille."** Populært, men lyset har ikke sit eget ur (ingen hvileramme) i relativitetsteorien.
- **"Man bliver tungere, når man kører hurtigt."** Gammeldags formulering ("relativistisk masse"). Sig i stedet, at det kræver mere og mere energi at komme hurtigere, og uendelig meget at nå lysets fart.
- **"Intet kan bevæge sig hurtigere end lyset."** Gælder lokalt. Fjerne galakser fjerner sig hurtigere end lyset, fordi Universet udvider sig.
- **Interstellar** (filmen, 1 time = 7 år på Millers planet) kræver et sort hul, der drejer næsten så hurtigt som muligt. Nævnes kun med det forbehold.
- **"Rum og tid er det samme som tre retninger plus én"** (bevægelse gennem rumtiden med "lysets fart"). Et populært billede, der har noget om sig, men rumtidens geometri har et minus: Derfor giver omvejen *mindre* tid, ikke mere.

## Åbne spørgsmål (skal besvares før start)
1. **A, B eller C** (eller noget andet)?
2. ✅ Besvaret 7. november 2026: **Tid kommer nu**, før Uranus og Neptun og Liv (det mindste af de tre). Prompten til Trin 0 er [prompt-tid.md](prompt-tid.md). (Spørgsmålet var: **Hvor i køen?** 7. november 2026 venter Jupiter J5 og Molekyler M1b, og Liv kommer lige efter Molekyler (se [lige-nu.md](lige-nu.md)).)
3. ✅ Besvaret 7. november 2026: **en tvilling.** (Spørgsmålet var: **Hvem bliver hjemme?** En tvilling (klassisk) eller noget mere personligt, fx "din far"? Det sidste rammer hårdere (far er der ikke, når man kommer hjem efter 3.000 år): stærkt, men måske lidt trist.)
4. ✅ Besvaret 7. november 2026: Idéerne skrives ind her, så en anden session kan arbejde videre.

## Model og effort
- **Faktagrundlaget og planen:** Opus med høj effort. Regningen er enkel, men fysikken er let at forklare forkert (se fælderne). Kilderne skrives i en fil i `docs/` (fx `docs/fakta-tid.md`), som ved de andre dele.
- **Byggeriet:** Opus med høj effort. Cockpitudsigten (hvis den kommer med) er en shader, men enklere end lysbøjningen ved Det sorte hul, så høj effort er nok.
- **Domæner til faktatjekket** (spørg om adgang før start, hvis de ikke er åbne): fx NIST (allerede åben), NASA/JPL (Voyager), Wikipedia (allerede åben), BIPM (definitionen af sekundet).

## Sådan startes næste session
Ny session med Opus (høj effort). Prompt, der kan kopieres:

> Læs docs/lige-nu.md, DESIGN.md og docs/plan-tid.md. Spor: Solsystemet og Kosmos (docs/lige-nu/solsystemet.md), hvis det bliver et fænomen i Kosmos (A), ellers et nyt spor "Tid og rum" (B). Vi skal arbejde videre med idéen "Tid og rum". Mine svar på de åbne spørgsmål: 1) … 2) … 3) … Lav først faktagrundlaget (Trin 0) med kilder i docs/fakta-tid.md og en plan med trin i docs/plan-tid.md, og vent på mit go, før der bygges.
