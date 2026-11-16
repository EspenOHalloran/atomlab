# E20: Fables eftersyn af UI og UX i hele programmet

*Skrevet af Fable 16. november 2026 efter [prompten](../prompt-fable-ux-nyt.md). Bygger på de kendte fund, kortet over navigationen, ca. 35 af skærmbillederne og koden bag Forløb-klodsen og bogen om Huygens. "Saturns ører" er desuden kørt trin for trin i testbrowseren (jeres tilføjelse: forløbet føles låst). Kendte fund er ikke gentaget. Ingen kode er ændret. **Principperne er skrevet ind som en blivende [stilguide](../stilguide.md)** (jeres ønske samme dag).*

## Kort sagt
AtomLab er flot, og de bedste steder (Mars, det sorte hul, mørket i Antistof) er i klasse med gode spil. Problemet er ikke de enkelte dele. Det er, at programmet er bygget over lang tid og derfor taler med flere stemmer: fire måder at sige "gør det her nu" på, fire steder at gå tilbage, fire udseender for et spørgsmål. De nyeste dele (Gåderne og Opdagelserne) viser retningen: én ting ad gangen og én knap. De ældste (Stjerneovnen, Batteriet og højre panel i Solsystemet og Kosmos) viser alt på én gang.

Det vigtigste er derfor ikke mere indhold, men tre greb: **én stemme, én sti i toplinjen, og et forløb, der foreslår i stedet for at spærre.**

## De ti vigtigste fund
Sorteret efter, hvor meget de gør programmet nemmere at finde rundt i og mere fuldt af undring. Størrelse: lille (under en time), mellem (en session), stor (flere sessioner).

**1. Fire stemmer siger, hvad man skal gøre nu.** *Hvor:* Forløb-linjen (under scenen), "Næste skridt"-boksen (øverst til venstre), guide-kortet (midt i scenen i Stjerneovnen, Reaktoren og Batteriet), opgavebjælken og opgavepillen (Værkstedet) og en undertekst med farvet kant (Gåderne, Opdagelserne, Det periodiske system). I Værkstedet står bjælken ("Byg et hydrogenatom") og pillen ("Byg carbon-12") fremme samtidig. I Molekyler står den samme sætning i "Næste skridt" og i højre panel. *Hvorfor:* En 13-årig lærer ét sted at kigge. Skifter stedet fra del til del, læser han det ikke. *Gør:* Alt "gør nu" flytter til linjen under scenen med Forløb-linjens udseende (stilguiden A1). Det giver "én udgave af hver klods" i køreplanens Serie 2 nr. 5 en skarp regel. *Størrelse:* stor, én del ad gangen. Værkstedet og Molekyler først (lille hver).

**2. Forløbet er en gang med låste døre.** *Hvor:* Forløb-klodsen (`js/forloeb.js`), altså alle otte forløb. Tydeligst i "Saturns ører" (se tillægget). *Hvorfor:* Scenen er død, mens man gætter. "Næste ›" findes først, når handlingen er ramt præcist. Hjælpen ("Vis mig") kommer efter 20 sekunder. Den eneste udvej er "Spring over", som springer alt over. Det passer en forsigtig begynder, men ikke en nysgerrig, der vil røre, og ikke en voksen, der kender svaret. *Gør:* De syv regler i stilguiden B: scenen virker altid, "Næste ›" står der altid, runde mål, og alt legetøjet er fremme bagefter. Forløbet kommer stadig først. *Størrelse:* mellem (klodsen og Huygens i én session, de andre forløb får det meste gratis).

**3. Vejen ét niveau op sidder fire steder, og tablettens tilbage-knap gør noget andet.** *Hvor:* "‹ Tilbage" i kortet (Det periodiske system), "‹ Alle gåder" i kortet (Gåderne), "‹ Hylden" nederst til venstre (Opdagelserne) og titlen som knap (Solsystemet). "‹ Menu" er et link, der lægger en ny side i browserens historie. Efter koden (ikke prøvet) fører tablettens tilbage-knap derfor fra menuen ind i delen igen, og inde i en gåde eller en bog fører den helt ud af delen. *Hvorfor:* På en Samsung-tablet er tilbage-knappen den mest brugte vej tilbage. *Gør:* Toplinjen bliver en sti som i Solsystemet ("Gåderne › Antistof"), og hvert niveau får en plads i historien, som Det periodiske system allerede gør (stilguiden A2). *Størrelse:* mellem. Prøv først tilbage-knappen på tabletten (to minutter).

**4. Billedet får ikke lov at stå alene.** *Hvor:* Solsystemet og Kosmos, tablet på langs: Panelerne dækker knap halvdelen af bredden fra første sekund. Ved Big Bang står "75 % hydrogen og 25 % helium" og hele forklaringen, før man har trykket "Start universet". Under rejsen ind i Solen er begge paneler med ligninger fremme. *Hvorfor:* Det er her, programmets største "wow" ligger, og det er Retningens "spørgsmålet før svaret". *Gør:* Ved ankomst til en klode eller et fænomen er scenen alene i 2-3 sekunder eller til første berøring. Så glider panelerne ind. Tal og tekst om det, der endnu ikke er sket, vises først bagefter (stilguiden A6). *Størrelse:* lille for forsinkelsen, mellem for Big Bang-panelet.

**5. Klippen efter forløbet.** *Hvor:* Værkstedet (og Molekyler, Liv). *Hvorfor:* I forløbet er der én linje og én knap. Sekundet efter "Byg videre selv" står der fem knapper i toplinjen, opgavebjælken, en opgavepille, klokken, venstre panel, højre panel med fire faner og det lille periodiske system. Det er det stejleste sted i de første fem minutter. *Gør:* Laboratoriet åbner i to skridt: scenen og det, man styrer med (venstre panel). Højre panel er foldet ind bag sin fane, til han selv åbner det (stilguiden B8). Koden til at skjule et panel findes. *Størrelse:* lille til mellem.

**6. Byggepladsen kan ses.** *Hvor:* Opdagelserne: ni grå bogrygge mod én bog, og fire af bogens seks opslag siger "Dette opslag er ikke færdigt endnu". Efter "Videre i bogen ›" lander man på en tom side. *Hvorfor:* `main` er det, jeres søn bruger. Han lærer, at et tryk ofte giver ingenting, og holder op med at trykke. *Gør:* Vis kun det, der findes: Bogen har de opslag, der er bygget (sidetallet "1 / 2"), og hylden viser den byggede bog og højst to rygge, der hver stiller sit spørgsmål i stedet for "kommer senere" (stilguiden A9). *Størrelse:* lille.

**7. Det samme ser forskelligt ud.** *Hvor:* Et spørgsmål er en gul pille (Værkstedet, Molekyler), en blågrøn boks (Stjerneovnen, Reaktoren, Batteriet), en mørk linje (Solsystemet, Kosmos) eller en orange overskrift, og Reaktoren har to af dem i samme panel. "Ærligt talt" har tre farver. Pillen bruges til valg, opgaver, links og ren status ("Neutralt", "Stabil"), som ikke kan trykkes. *Hvorfor:* "Man kan se uden at læse, hvad der kan trykkes på" holder kun, når formen betyder det samme hver gang. *Gør:* Stilguiden A3-A5 og A7. *Størrelse:* mellem (mest CSS), sammen med touch-størrelserne, som er kendt.

**8. Belønningen gemmer sig.** *Hvor:* Under et forløb vises belønninger slet ikke (`dæmpPiller`). Det første grundstof, han nogensinde bygger, ender derfor stille i klokken. "Din fremgang" er en lille knap under menuen. Biblioteket kan aldrig få ✓ (kendt i kortet). Kernesætningen forsvinder, når forløbet lukker. *Hvorfor:* Det er de øjeblikke, han skulle huske. *Gør:* Det nye grundstof fejres i scenen, også i forløbet, og "Din fremgang" får siden "Det ved jeg nu" med kernesætningerne fra de forløb, han har taget (stilguiden C2 og C4, grebene nedenfor). *Størrelse:* lille til mellem.

**9. "‹ mindre" og "større ›" læses som knappernes navn.** *Hvor:* Gåderne og menuens dok. Se svaret om Gåderne nedenfor. *Størrelse:* lille.

**10. Tynde, lyse streger på sort er det, der ser hakket ud.** *Hvor:* Baner, elektronringe, menuens ring, skinnen. Se svaret om kantudglatning nedenfor. *Størrelse:* lille at måle, mellem at rette.

## Tillæg: "Saturns ører" føles låst (jeres tilføjelse)
I har ret, og det kan forklares præcist. Det er ikke idéen om et forløb, der låser. Det er syv konkrete ting, set i koden og ved at køre det:
1. **Fingeren vinker, men glasset er dødt.** I trin 1 gnider en finger rundt på linsen, mens gættets knapper står der. Gnider man, sker der intet, før man har gættet (målt: skarpheden blev på 0).
2. **Gættet er en port, ikke et spørgsmål.** Alle tre svar giver den samme tekst, og intet siger senere, om man gættede rigtigt. Så føles det som en knap, man skal trykke for at få lov.
3. **Ingen vej frem.** I trin 2 er der hverken "Næste ›" eller en knap. Man skal ramme nat 16 præcist. Ved nat 18 sker der intet, og der kommer intet vink. "Vis mig" kommer først efter 20 sekunder.
4. **Legetøjet tages væk, når man har forstået.** Når "Så" står der, kan skyderen og ringen ikke flyttes mere. Det er netop der, man har lyst til at prøve igen.
5. **Bogen kan ikke bladres, og hylden er væk.** Under forløbet er hele rækken med "‹ Hylden" og pilene skjult. På en tablet (uden Esc) er de eneste udveje "‹ Menu" og "Spring over".
6. **"Spring over" er alt eller intet,** og det lyder som at give op. Bagefter starter forløbet aldrig af sig selv igen.
7. **Laboratoriet bagefter har kun ringen.** Linsen og nætterne med Titan kan kun prøves ved at tage hele fortællingen forfra.

**Det, jeg vil beholde:** rækkefølgen linse, måne, kant. Løftet, når ringen ses fra kanten, er forløbets bedste øjeblik. Tavlens tegninger, der lyser op, er fine. Kernesætningen er god.

**Forslaget (én session, Opus, høj):** Byg stilguidens B1-B7 ind i Forløb-klodsen, så alle forløb får det:
- Scenen virker i alle faser. Begynder man at gnide uden at gætte, tæller det som "jeg vil prøve selv", og gættet toner væk.
- "Næste ›" står altid i linjen, svagt. Før handlingen er gjort, viser den handlingen på et sekund (det, "Vis mig" gør i dag) og går videre. Så misser ingen pointen, og ingen sidder fast. "Vis mig" efter 20 sekunder kan udgå.
- Nat 16 og kanten falder selv på plads, når man er tæt på, og et vink kommer straks, hvis man er forbi ("Den var hjemme efter 16 nætter").
- Hvert gæt får sit eget korte svar i "Så" (teksterne skal faktatjekkes).
- "‹ Hylden" bliver fremme, og "Spring over" hedder "Udforsk selv ›" og fører til laboratoriet.
- Laboratoriet får de tre kapitler som tre valg: Linsen, Den lille prik og Ringen. Forløbets prikker kan trykkes, når det tages igen.
- Teksten: Det, man skal gøre, står hvidt, og det besvarede spørgsmål toner ned (i dag er det omvendt).

Prøven af Antistof peger samme vej: Dér er scenen levende, mens man gætter, og jeres søn kunne sige kernesætningen bagefter.

## Svar på spørgsmålene
**1. De første fem minutter.** Bjælken "Henter AtomLab", ringen med Atomer forrest og "Start her", ét tryk, og "Dit første atom" starter med et tryk på "+". Det er en ren og god start, og første handling kommer inden for et minut. Men det første "wow" på den vej er beskedent: et atom, der lyser. De store ligger to-tre tryk væk. Han kan mistes tre steder: (a) når det første grundstof ikke fejres (fund 8), (b) på klippen efter forløbet (fund 5), og (c) ved "Det så du", hvor den vigtige knap er "Byg videre selv". *Forslag (lille):* Gør "Se Solen lave helium" til den vigtige knap. Så kommer rejsen ind i Solen som det første store "wow" omkring minut fem, og den svarer på AtomLabs egen tanke: hvor atomerne kommer fra.

**2. At finde rundt.** Ringen, kortene og dokken er logiske, og "‹ Menu" sidder samme sted overalt. Det er godt. Problemerne er niveauet under (fund 3), blindgyderne i Opdagelserne (fund 6), og at tre ting ikke kan findes fra menuen: at tage et forløb igen (kun i "Din fremgang"), "Nulstil al fremgang" og "Om AtomLab" (kun i Værkstedets hjælp). *Forslag (lille):* "Din fremgang" bliver stedet for alle tre, og menuen får et "?".

**3. Ét program.** Næsten. Mørket, den blå glød, skriften og toplinjen holder det sammen. Opdagelsernes papir og gamle skrift bryder ikke stilen: En bog må gerne ligne en bog, når rammen om den (toplinjen og linjen under) er programmets. Det, der bryder, er de ældre panelers mange former (fund 7). Stilguiden står i [stilguide.md](../stilguide.md), med tabellen over, hvem der bryder hvad.

**4. Næste skridt.** Forløb-linjen forstås: titel, prikker, "Trin 1 af 3" og en knap. Tre ting forstås ikke uden hjælp: (a) Tidsknappen er to til fire små ikoner uden ord, og i Stjerneovnen står "▷" (langsom) ved siden af "▶" (normal). (b) Linjens instruks er grå, mens det gamle spørgsmål er hvidt. (c) I Solsystemet og Kosmos ligger "Gå videre" midt i højre panel under seks spørgsmål. *Forslag:* Stilguiden A1 og B6, og "Gå videre" flytter op som det første under teksten.

**5. Glæde og undring.** Se næste afsnit.

**6. Hvad ville en 13-årig opgive, og hvor keder han sig?** Han opgiver, når et tryk ikke giver noget: de grå bøger, den døde linse, en pille, der ikke er en knap. Han keder sig, når han skal vente eller læse, før noget sker: Stjerneovnen efter guiden (vent på tilfældige sammenstød ved siden af ligninger i MeV), Batteriet (se en bjælke fyldes ved siden af et afsnit på ti linjer), Ordbogen (126 forklaringer i træk, der åbner fuldt udfoldet), og opgave nummer fire af typen "byg et atom med plus og minus". Molekyler efter forløbet åbner på en helt sort scene. *Forslag (små):* Molekyler starter med et vandmolekyle, han kan skille ad. Ordbogen viser kun ordene, og forklaringen åbner ved tryk.

**7. Jeres fire fund fra Gåderne.**
1. *Kernesætningen virker.* Enig, og det er det vigtigste resultat i hele eftersynet: Én scene, ét kort, gæt, gør og se er modellen. Rør ikke trin 1 og 2.
2. *"Fra mindre til større".* Skinnen er allerede sorteret efter skala (fra 10⁻¹⁵ m til 10²¹ m i `js/data/gaader.js`). Behold det, for det er samme tanke som menuens ring. Fejlen er, at ordene står på knapperne, så de læses som "zoom ud" eller "mere". *Gør (lille):* Knapperne bliver rene pile. Under hvert navn på skinnen står skalaen med småt: "mindre end et atom", "en celle", "planeter", "stjerner", "galakser". Så forklarer rækkefølgen sig selv. Gør det samme i menuens dok: enderne hedder "atomkernen" og "universet". En lineal under stien er ikke nødvendig, før en prøve viser det.
3. *Tvinges ind i Antistof.* For en 13-årig er ét lys og én knap en invitation, så længe ét tryk giver noget flot. Det gør det her. Lås føles det først, når man ikke ved, at der er mere, og at man kan komme ud. *Det mindste (lille):* Linjen "Det her er en af gåderne" bliver "Det her er den første af fem gåder" (tallet tages fra listen). Behold resten, også at lysene først tændes bagefter.
4. *Kantudglatning.* Ja, det er værd at tage op, men som en måling, ikke som en kontakt, der bare slås til. Renderen kører uden (`antialias: false`), og kommentaren i `scene3d.js` siger, at udglatning kostede ca. 40 % af billederne. Det tal er fra testbrowseren, der tegner uden grafikkort, så det siger intet om tabletten. *Gør:* (a) En prøvekontakt i adressen (fx `?aa`), og mål med `?maal` på tabletten i de tre tungeste scener (Mars, det sorte hul, skinnen). (b) Koster det mere end ca. en tiendedel af billederne, så brug i stedet det, der virkede på skinnen (blød kant, lidt bredere streg) på de få slags tynde streger: baner, elektronringe og menuens ring. Det giver det meste af det, øjet ser, uden at koste noget.

## "Wow" i dag, hvor det mangler, og fem greb
**De fem stærkeste i dag** (vurderet ud fra billederne, ikke på en tablet):
1. Mars og de andre kloder, flybyen og "Stå på Mars".
2. Det sorte hul med det bøjede lys og astronauten.
3. Rejsen ind i Solen.
4. Antistof: "Tryk i mørket, så bliver lys til stof", og lysene, der tændes på skinnen bagefter.
5. Tvillingen med stok i "Rejsen i tid". Lige efter: menuens ring og ringen, der forsvinder fra kanten hos Huygens.

**Her mangler et:** det første grundstof i Værkstedet, ankomsten til Molekyler, Det periodiske system (118 felter, men intet sker, når man har "opdaget" ét), Batteriet, Ordbogen og hylden i Opdagelserne.

**Fem små greb, mest undring for mindst kode:**
| Greb | Hvad | Størrelse |
|---|---|---|
| Billedet først | Scenen alene i 2-3 sekunder ved ankomst, så glider panelerne ind (fund 4) | lille |
| Grundstoffet flyver hjem | Når et nyt grundstof er bygget, flyver et lys fra atomet til dets felt i det lille periodiske system, feltet tændes med en lyd, og tælleren går fra 1 til 2 af 118. Også i forløbet | lille til mellem |
| "Det ved jeg nu" | Kernesætningerne fra de forløb, han har taget, samles som kort i "Din fremgang". Noget at vise frem | lille |
| Dit atom i menuen | Atomet midt i ringen er det sidste grundstof, han selv har opdaget, med navnet under. Noget, han selv opdager | lille til mellem |
| "Vidste du?" mens der hentes | Bjælken "Henter …" viser én linje fra de fakta, der allerede er tjekket (`js/data/fakta.js`) | lille |

## Resten, kort
- Menuen på højkant med Biblioteket forrest: ordene i baggrunden ligger oven i hinanden, oven i logoet og oven i kortene. Færre ord, og ikke bag tekst (lille).
- Molekyler: instruksen står tre steder ("Næste skridt", højre panel og under paletten).
- Det periodiske system på højkant: væggen fylder en tredjedel af skærmen, og et felt åbner først ved andet tryk.
- Toplinjen: fem ikoner uden ord i Værkstedet. Undertitlen findes i nogle dele og ikke i andre.
- Forløb-linjen under bogen er mørk og moderne under gammelt papir. Det er i orden: Det er programmets stemme.
- I trin 2 hos Huygens er kikkertens felt lille, og Titan er en prik på 2-3 px. Afstanden er ærlig, men på tabletten kan prikken forsvinde (står i "Ikke afprøvet").
- "Det så du" hos Huygens har kun én vej. Når H3 er bygget, bør der være to: videre i bogen og Saturns ringe i Solsystemet.

## Det virker, og må ikke ændres
- **Gådernes opbygning:** én scene, ét kort til højre, gæt, gør og se. Det er modellen for nye dele.
- **Menuens ring** fra det mindste til det største, "Start her" og de tegnede ikoner.
- **"‹ Menu" øverst til venstre** i alle dele, og at hver del har sin adresse.
- **Forløb-linjens form:** titel, prikker, én tekst, én række knapper, 44 px. Det er indholdet af faserne, der skal løsnes, ikke formen.
- **Hylden som tidslinje** med årstal, bogens forside med spørgsmålet, og løftet i trin 3.
- **Kloderne,** flybyen og det sorte hul, som de er.
- **Ordforklaringerne, "Ærligt talt" og "For nørder"** som idé. Kun udseendet skal være ens.
- Det, der står i de kendte fund under "Det virker".

## Det, jeg ikke kunne se
Hvordan det føles med fingre, lyden, overgangene i bevægelse, farten på den rigtige tablet og tablettens tilbage-knap. Fund 3 (tilbage-knappen), 4 (om 2-3 sekunder er rigtigt) og 10 (kantudglatning) skal derfor prøves på tabletten, før de bygges færdigt. Alle skærmbilleder er fra testbrowseren uden grafikkort.

## Jeres svar (16. november 2026)
- **Stilguiden:** Ja, den gælder som faste regler for alt nyt fra i dag (A, B og C).
- **Forløbet:** Reglerne i B bygges ind i den fælles Forløb-klods, så alle otte forløb får dem. "Saturns ører" rettes i samme session.
- **Først:** Forløbet som sti (fund 2 og tillægget).

## Næste skridt
1. Principperne i [stilguide.md](../stilguide.md) er godkendt (se ovenfor). Resten af rækkefølgen nedenfor er min anbefaling.
2. Opus skriver noter (`E20-ux-nyt-noter.md`): tjekker fundene mod koden og lægger dem i køreplanen.
3. Min anbefalede rækkefølge: fund 2 (forløbet, også for Huygens) → fund 6 og 9 og de små forslag (en samlet session med småting) → fund 4 og grebet "Grundstoffet flyver hjem" → fund 3 → fund 1, 5 og 7 sammen med byggeklodserne i Serie 2 nr. 5.
