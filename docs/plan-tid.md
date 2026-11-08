# Idé og plan: Tid og rum (relativitet)

*Startet 7. november 2026. Idéen er jeres. Opus' forklaring, idéer og forslag står i samtalen fra 7. november 2026 og er skrevet ind her, så en ny session kan arbejde videre. **Besluttet:** placering A (et fænomen i Kosmos) og en tvilling. **Trin 0 er lavet** (7. november 2026): Tallene er regnet efter og tjekket i [fakta-tid.md](fakta-tid.md), og trinene står under "Trinene" nedenfor. Teksterne i afsnittet "Forklaringen" er stadig udkast. Brug tallene fra fakta-tid.md, hvor de to er forskellige.*

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

## Hvor skal det ligge? (besluttet: A, 7. november 2026)
- **A. Et nyt fænomen i Kosmos,** "Rejsen i tid", ved siden af Rumtid. Bygges på fænomenskærmen (`js/faenomenskaerm.js`: faser, handlingsknapper, "Hvorfor?"-kort, "For nørder", "Ærligt talt"). Idé 2 kan blive emner eller handlinger i Rumtid og Sort hul. *Mellem til stor.*
- **B. En ny del "Tid og rum"** (eller "Relativitet") i menuen med flere stationer: lysuret, rejsen, Rumtidskortet, urenes stige og myonerne. En naturlig tvilling til den planlagte del Kvantefysik: de to store teorier fra 1900-tallet. Menuen bliver en karrusel ([plan-menu.md](plan-menu.md)), som kan rumme flere dele. Rækkefølgen er efter størrelse, så det skal afgøres, hvor "Tid og rum" står (måske ved Kosmos). *Stor.*
- **C. Kun små kroge** rundt omkring (lysets forsinkelse i Solsystemet, cæsiumuret, urene ved Sort hul). Billigt, men der er ikke noget sted at lege for alvor.

**Opus' anbefaling:** Start med **A** som et prøvestykke med lysuret og tvillingerejsen. Den kan bygges uden at vente på menuen. Bliver han grebet, kan det senere vokse til **B** (sammen med Kvantefysik), med Rumtidskortet som det næste. Idé 4 (lysets forsinkelse) og 5 (cæsiumuret) er så billige og stærke, at de kan komme med uanset hvad (fx når Solsystemet eller Værkstedet alligevel bliver rørt).

## Trinene (Trin 0, 7. november 2026, go til T1 givet samme dag)
*Tallene og kilderne står i [fakta-tid.md](fakta-tid.md), og udregningerne i `docs/fakta-tid/regn.py`. Hvert trin får sin egen session og prompt (`docs/prompt-tid-t1.md` osv., færdige prompter ligger i `docs/arkiv/`), og hvert trin får sit eget go. Model: Opus med høj effort, også til teksterne i T3. Cockpitudsigten (T4) har sit eget go senere.*

**Rammen (gælder alle trin):**
- **Fænomenet** `js/kosmos/tid.js`, "Rejsen i tid" (ikon ⏳), står i listen i `js/kosmos.js` lige efter Rumtid. Det bygges på fænomenskærmen som de andre fænomener: faserne i underteksten, handlinger i bjælken, en skyder og en kontakt i Styr-boksen og siden i lag.
- **Regningen uden Three.js** i `js/data/tid.js`, så den kan testes i Node: gammafaktoren, rejsen med fast fart og med 1 g, og teksterne til hjemkomsten. Gammafaktoren regnes ud fra antallet af 9-taller (1 − v/c = 10⁻ⁿ, så γ = 1/√(ε(2 − ε))), for ellers bliver 0,999999999999 til 1 i computeren.
- **Scenen:** Jorden, skibet og målet under en stjernehimmel, med de byggeklodser, der allerede findes i `js/kosmos/faelles.js`. **De to ure** står i et lag oven på 3D-billedet (HTML, så de er skarpe og kan læses på tabletten).
- **Ærligt fra start:** Med skyderen springer vi over, hvordan man kommer op i fart. Det siges i underteksten og i "Ærligt talt" (se spørgsmål 1).

**T1. Lysuret og rejsen til Alpha Centauri** *(mellem, én session) ✅ lavet 7. november 2026*
- [x] `js/data/tid.js` med gammafaktoren og rejsen med fast fart (ud og hjem).
- [x] Fænomenet med ét mål, Alpha Centauri, og skyderen "Fart" fra 90 % til 99,9999 % (1-6 ni-taller).
- [x] Rejsen i faser: afgang, ude ved målet, vende om og hjemkomst, med "Dit ur", "Jordens ur" og tvillingens alder. Tiden kan spoles (⏩).
- [x] Hjemkomsten med en kort tekst (se spørgsmål 2 og 3).
- [x] Handlingen "⏱ Vis lysuret": to lysure side om side, i skibet (lyset hopper lige op og ned) og set fra Jorden (zigzag). Farten følger skyderen. Det er det vigtigste "aha".
- [x] Teksten "kort", to emner og et første "Ærligt talt".
- [x] **Tests:** En ny `tests/tid.mjs` (og linjen i `koer-alle.mjs`) tjekker tallene (γ ved 90 % til 99,9999 % og rejsetiderne til Alpha Centauri mod fakta-tid.md), at skyderen ændrer urene, og at en rejse spolet frem ender ved hjemkomsten med den rigtige tekst.
- [ ] **På tabletten** (står i [ikke-afproevet.md](ikke-afproevet.md)): Kan urene læses på højkant og på langs? Rammer man skyderens trin med fingeren? Kører lysuret glat, og forstår man zigzaggen?

**T2. Alle mål, "1 g hele vejen" og afstanden, der skrumper** *(mellem, én session) ✅ lavet 7. november 2026*
- [x] Mælkevejens centrum og Andromedagalaksen (skyderen "Mål"). Skyderen går op til 14 ni-taller (γ ≈ 7,1 mio., jeres svar på spørgsmål 4). Så giver Mælkevejens centrum ud og hjem ca. 3 dage i skibet mod ca. 54.000 år på Jorden.
- [x] Kontakten "1 g hele vejen" (speed op med 1 g til midtvejs og brems med 1 g resten): ca. 3,6 år til Alpha Centauri, ca. 20 år til Mælkevejens centrum og ca. 29 år til Andromeda, i skibet og én vej.
- [x] "Set fra skibet": Afstanden til målet står med to tal (set fra Jorden og set fra skibet), og målet rykker tættere, når farten stiger (kontakten "Set fra skibet", trykket sammen med γ^(−1/3)).
- [x] Hjemkomsten sammenligner med fortiden (listen "Sammenligninger med fortiden" i fakta-tid.md) og viser årstallet på Jorden.
- [x] **Tests:** tallene for 1 g, og et lille script, der skriver alle hjemkomstteksterne ud (alle mål og farter) og læses igennem (tjekliste B): `tests/vaerktoejer/tid-tekster.mjs`.
- **Valg i T2:** Hver vej tager 12,5 sekunder på skærmen uanset målet (med fast fart følger skærmen Jordens ur, med 1 g dit ur, og skibet flytter sig jævnt). Solvognen er ikke med i sammenligningerne: Egtvedpigen har samme alder og en præcis datering. Et skift af mål eller af 1 g undervejs starter forfra.
- [ ] **På tabletten:** Forstår man forskellen på skyderen og 1 g? Er de store tal (år 2.502.026) til at læse?

**T3. Lagene og teksterne** *(lille til mellem, én session) ✅ lavet 8. november 2026*
- [x] Emner: "Hvorfor går Jordens ur så hurtigt?" (lysuret), "Hvorfor ikke omvendt?" (tvillingeparadokset), "Set fra skibet" (længdeforkortelsen), "Er det målt?" (myonerne, urene i flyene, GPS med et link til Rumtid, astronauterne og urene, der løftes 33 cm) og "Kunne man?" (energien, støvkornet, gassen i rummet og de ca. 11.500 g).
- [x] Et "Hvorfor?"-kort i `js/data/hvorfor.js`, fx "Hvorfor kan intet nå lysets fart?".
- [x] "For nørder": formlen for γ, reglen om √10 for hvert 9-tal, formlerne for 1 g, tvillingeparadokset (omvejen giver *mindre* tid, rumtidens minus) og et par linjer om samtidighed ("nu" er ikke det samme for alle).
- [x] "Ærligt talt": fælderne fra listen nedenfor (de flyttes til `docs/erfaringer/fakta-faelder.md`, når teksterne er skrevet).
- [x] Cæsiumuret: "Hvad er et sekund?" i "Er det målt?" eller "For nørder" med en knap til cæsium i Det periodiske system.
- [x] Ordbogen: *tidsforlængelse*, *længdeforkortelse* og *myon* er nye. *Lysår* og *kosmisk stråling* findes allerede.
- [x] `/faktatjek` af de færdige tekster mod fakta-tid.md.
- [x] **Tests:** teksterne og knapperne i lagene (som i `lag.mjs`).
- **Valg i T3:** Et syvende emne, "Hvorfor tager det år med 1 g?", folder sig ud med kontakten "1 g hele vejen" og har de 11.500 g (ellers blev "Kunne man?" for langt). Cæsiumuret står i "For nørder" ("Er det målt?" var lang nok). Knappen "Cæsium ›" er `gå('system:55', …)`, og `js/system.js` åbner grundstoffet (før kunne man kun åbne en kategori fra en anden skærm).
- **Efter T3 (8. november 2026, jeres ønsker):** emnet "Hurtigere end lyset? Nej!" øverst, "Hvorfor tager det år med 1 g?" hedder nu "Fast fart eller 1 g?" og forklarer begge måder, lysuret går trin for trin med sin egen fart (87 %), og målet vælges med tre kontakter (skyderen hedder "Fast fart"). Se `docs/lige-nu/tid.md`.
- [ ] **På tabletten** (står i [ikke-afproevet.md](ikke-afproevet.md)): Er emnerne til at forstå, og er de to lange for lange?

**T4. Udsigten fra cockpittet** *(mellem til stor. Besluttet 8. november 2026: ikke lavet nu, men en mulig udvidelse i fremtiden)*: stjernerne samler sig foran, blå foran og røde bagude (aberration, dopplereffekt og "beaming"). En shader i familie med `js/kosmos/linse.js`. Opus med høj effort. Faktagrundlaget laves i samme session.

**De billige idéer:**
- **Lysets forsinkelse:** I "Rejsen i tid" som én linje ved målet ("En besked hjem tager 4,4 år"), i T2. Den store udgave ("Send et lysglimt" fra Jorden til Månen, Solen, Mars, Voyager 1 og Andromeda) hører hjemme i Solsystemet og er et lille trin i Solsystemets spor. Tallene står allerede i fakta-tid.md.
- **Cæsiumuret:** I T3 (se ovenfor). Senere kan det også stå på cæsiums kort i Det periodiske system (sporet Ordbogen og Det periodiske system).

## Fælder, vi skal undgå
*✅ Flyttet til [erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) 8. november 2026 (T3). Listen står her som historik.*
- **"Tiden går langsommere for dig."** Du mærker intet. Dit eget ur går altid ét sekund pr. sekund. Det er en sammenligning mellem to veje gennem rumtiden.
- **"Det er accelerationen, der gør det."** Kun en del af historien. Det afgørende er vejen gennem rumtiden (den rejsende skifter ramme, når den vender om).
- **"For lyset står tiden stille."** Populært, men lyset har ikke sit eget ur (ingen hvileramme) i relativitetsteorien.
- **"Man bliver tungere, når man kører hurtigt."** Gammeldags formulering ("relativistisk masse"). Sig i stedet, at det kræver mere og mere energi at komme hurtigere, og uendelig meget at nå lysets fart.
- **"Intet kan bevæge sig hurtigere end lyset."** Gælder lokalt. Fjerne galakser fjerner sig hurtigere end lyset, fordi Universet udvider sig.
- **Interstellar** (filmen, 1 time = 7 år på Millers planet) kræver et sort hul, der drejer næsten så hurtigt som muligt. Nævnes kun med det forbehold.
- **"Rum og tid er det samme som tre retninger plus én"** (bevægelse gennem rumtiden med "lysets fart"). Et populært billede, der har noget om sig, men rumtidens geometri har et minus: Derfor giver omvejen *mindre* tid, ikke mere.

## Åbne spørgsmål (skal besvares før start)
1. ✅ Besvaret 7. november 2026: **A**, et nyt fænomen i Kosmos ("Rejsen i tid"), der senere kan vokse til B. (Spørgsmålet var: **A, B eller C** (eller noget andet)?)
2. ✅ Besvaret 7. november 2026: **Tid kommer nu**, før Uranus og Neptun og Liv (det mindste af de tre). Prompten til Trin 0 er [prompt-tid.md](arkiv/prompt-tid.md). (Spørgsmålet var: **Hvor i køen?** 7. november 2026 venter Jupiter J5 og Molekyler M1b, og Liv kommer lige efter Molekyler (se [lige-nu.md](lige-nu.md)).)
3. ✅ Besvaret 7. november 2026: **en tvilling.** (Spørgsmålet var: **Hvem bliver hjemme?** En tvilling (klassisk) eller noget mere personligt, fx "din far"? Det sidste rammer hårdere (far er der ikke, når man kommer hjem efter 3.000 år): stærkt, men måske lidt trist.)
4. ✅ Besvaret 7. november 2026: Idéerne skrives ind her, så en anden session kan arbejde videre.

## Spørgsmål til jer efter Trin 0 (7. november 2026, Opus' anbefaling først)
**✅ Jeres svar (7. november 2026): "Go. Følg dine anbefalinger".** Svaret er altså a på alle fem: fast fart med en ærlig linje og kontakten "1 g hele vejen", to digitale ure og en urskive for Jorden, tvillingen som beskrevet i 3a, op til 14 ni-taller og listen over fortiden, som den er. Go til T1.
1. **Skyderen og accelerationen.** Med 1 g (som at stå på Jorden) tager turen *år* i skibet, aldrig dage. "Et par dage mod tusinder af år" kræver ca. 11.500 g, og det ville knuse en (fakta-tid.md, afsnit 6).
   - **a (anbefalet):** Skyderen med fast fart (vi springer over, hvordan man kommer op i fart, og siger det ærligt i underteksten) *og* en kontakt "1 g hele vejen" med de realistiske tider. Man får både "wow" og sandheden.
   - b: Kun 1 g. Det er ærligt, men "et par dage" forsvinder.
   - c: Speed op med 1 g til den fart, skyderen viser. Det er mest korrekt, men forvirrende: Til Alpha Centauri når man aldrig over ca. 95 %, før man skal bremse.
2. **Urene.**
   - **a (anbefalet):** To store digitale ure: "Dit ur" i dage og år siden afgang og "Jordens ur" som årstal (fx "år 2026" → "år 56.026"). Under dem står begges alder. Jordens ur får også en lille urskive, hvor viseren drøner rundt, så man kan *se* forskellen.
   - b: Kun to urskiver. De er flotte, men kan ikke vise tusinder af år.
3. **Hjemkomsten og tvillingen.** Hvad står der, når der er gået mere end et menneskeliv?
   - **a (anbefalet):** I er begge 13 år ved afgang. Op til ca. 100 år står tvillingens alder ("Du er 13 år og 45 dage. Din tvilling er 21."). Derover står årstallet og en sammenligning med fortiden ("Der er gået ca. 54.000 år, længere end siden de sidste neandertalere levede"), og kun en kort, rolig linje om tvillingen ("Din tvilling levede et langt liv, mens du var væk").
   - b: Nævn ikke tvillingen, når der er gået over 100 år.
   - c: En selvvalgt alder ved afgang (fx jeres søns alder).
4. **Hvor mange 9-taller?**
   - **a (anbefalet):** Op til 14 (γ ≈ 7 mio.). Så kan man ramme jeres eget spørgsmål præcist: ca. 3 dage i skibet mod ca. 54.000 år på Jorden til Mælkevejens centrum og hjem. Ved 12 ni-taller er det 28 dage.
   - b: Op til 12 ni-taller.
5. **Sammenligningerne med fortiden.** Listen i fakta-tid.md (afsnit 13) er dansk og verdens historie (Lindisfarne, Jellingstenen, Tollundmanden, Egtvedpigen, Solvognen, pyramiden, istiden, Lascaux, neandertalerne, de første mennesker og Lucy).
   - **a (anbefalet):** Brug den.
   - b: Tilføj eller fjern noget, fx noget fra jeres egen familie eller by.

## Model og effort
- **Faktagrundlaget og planen (Trin 0):** lavet med Opus, høj effort (7. november 2026).
- **T1-T3:** Opus med høj effort, én ny session pr. trin. Prompterne er [prompt-tid-t1.md](arkiv/prompt-tid-t1.md), [prompt-tid-t2.md](arkiv/prompt-tid-t2.md) og [prompt-tid-t3.md](arkiv/prompt-tid-t3.md) (i arkivet, da de var lavet).
- **T4 (cockpitudsigten):** Opus med høj effort. Det er en shader, men enklere end lysbøjningen ved Det sorte hul. Prompten er [prompt-tid-t4.md](prompt-tid-t4.md).
- **Domæner:** Wikipedia, arxiv.org, physics.nist.gov, science.nasa.gov og nssdc.gsfc.nasa.gov var nok til Trin 0. Ingen nye domæner er nødvendige.

## Sådan startes næste session
T1-T3 er lavet, og sporet er lukket for nu (8. november 2026). Skal T4 (cockpitudsigten) laves en dag, kræver det et nyt go: Ny session med Opus (høj effort) og "Læs docs/prompt-tid-t4.md".
