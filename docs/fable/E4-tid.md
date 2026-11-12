# E4: Fables gennemgang af Tid

*Skrevet 12. november 2026 af Fable efter [prompt-fable-tid.md](../prompt-fable-tid.md). Jeg har læst planerne, faktagrundlaget, fælderne og alle tekster i koden, regnet tallene efter med mit eget script (uden `regn.py`) og kørt begge fænomener som ny bruger i tablet-størrelse, på langs og på højkant. Fire billeder ligger i [E4-billeder/](E4-billeder/). Kilder læst i dag: Wikipedias wikitekst (artiklerne står i tabellen). Jeg har ikke ændret kode eller tekster. Hvor der står "forslag", må Opus vælge anderledes.*

## 1. Det vigtigste først
- **Fakta holder.** Jeg fandt ingen forkerte tal. Koden, teksterne og faktagrundlaget siger det samme. Tabellen har 12 punkter, de fleste små. Fire bør rettes før runden (F1-F4).
- **Oplevelsen er ikke sat i scene.** Svaret står i panelet, før man har trykket "Flyv" (billede a). Tvillingen er kun et tal med små bogstaver (billede b). Og ingen af de tre mål kan give en gammel tvilling, der lever: Det er enten 21 år eller 54.000 år.
- **"Hvorfor?" svarer, før man har spurgt.** Scenens spørgsmål står i højre panel, og svaret står i underteksten fra første sekund. Scene 1's overraskelse kan ikke ses i starttilstanden (billede c).
- **Klar til jeres søn?** Ja som måling af, hvor han går i stå. Nej som den blide, færdige udgave. Mit bud: Han flyver gerne og synes, tallene er vilde, men han kan ikke sige hvorfor bagefter, og han står af i scene 3-5.
- **Vejen frem er lille:** ét punkt "Tid" med to korte forløb. Næsten alt kan genbruges (afsnit 4).

## 2. Faktatjek af tekster og tal

**Regnet efter og korrekt** (mit script mod `js/data/tid.js` og alle linjer fra `tid-tekster.mjs`): γ for 1-14 ni-taller. Rejsetiderne til de tre mål. 1 g: 3,57, 19,83 og 28,60 år, størst γ 3,24, 13.935 og 1,29 mio., fotonraketten 40 og 7,8 · 10⁸. 11.529 g og 13,1 år. Myonerne: c·τ = 658,6 m, 4 GeV/c giver γ = 37,87 og 99,9651 %, 55 % når ned, 1 ud af 7,8 mia., 396 m, 50,0 og 1,32 µs. Toget: 0,25, 1,0 og 0,5 og 6,2 fs. Rumtidskortet: 6 og 8 år, 1,8 → 8,2. Bolden: 80 % og 96,6 %. Energien: 55.000 år, 0,086 s, 7.850 ton TNT, 1,5 ton, 50 gange LHC. Forspringet 3,8 timer, 3.885 AU, 99,9 mio. tik i sekundet, Kononenko 27 ms, 33 cm giver 1,1 ns om året, og "Hvorfor?"-kortets 0,92 og 10,6 år. Frisch og Smiths 563, 412 og 27 og bogen fra 1917 står i kilderne i dag.

**Det, der bør rettes.** F1-F4 før runden, resten sammen med ombygningen.

| Nr. | Tekst | Påstand | Dom | Kilde | Forslag til ordlyd |
|---|---|---|---|---|---|
| F1 | `tidhvorfor.js:192` | "Derfor opdagede ingen det før Einstein." | **For skarpt.** Strider mod jeres egen fælde (Poincaré 1900) | Wikipedia "Relativity of simultaneity", læst i dag | "Derfor har ingen nogensinde mærket det i hverdagen." |
| F2 | `tid.js:129`, `tidhvorfor.js:194` | "Man kan lave forsøg, hvor begge ure accelererer lige meget …" | **Upræcist.** Det er tankeforsøg ("one imagines"). Det rigtige forsøg er CERN 1977: Myonerne blev slynget rundt med ca. 10¹⁸ g, og urene fulgte kun farten | Wikipedia "Twin paradox" og "Experimental testing of time dilation", læst i dag. Bailey 1977 er ikke læst | "Man kan tænke sig en rejse, hvor begge ure speeder op og bremser lige meget og alligevel kommer forskelligt hjem. I CERN's ring fulgte myonernes ure kun farten, selv om de blev slynget rundt med en milliard milliarder g." |
| F3 | `tidhvorfor.js:72` | "Ved den typiske fart når de fleste ned, og det er det, man måler." | **For skarpt mod jeres egen tæller.** Udregningen giver 55 %. Af 24 når højst 12 ned i 4 ud af 10 byger, så der står "de fleste" over "11 af 24". Og målingen (Frisch og Smith) gik fra 1,9 km, ikke 15 km | Egen udregning (binomial, p = 0,547) | "Derfor når ca. halvdelen ned i stedet for næsten ingen. At myoner lever længere i fart, er målt (se For nørder)." |
| F4 | `tidhvorfor.js:325` | Hjørneteksten "toget står næsten stille i forhold til lyset" | **Kan læses forkert.** At stå stille i forhold til lyset er netop det, der ikke kan lade sig gøre | – | "100 km/t er næsten ingenting mod lysets fart" |
| F5 | `tid.js:365` og urene | "Se urene: Jordens ur løber fra dit." | **Forenkling, der ikke er sagt.** Under turen viser de to ure Jordens "nu". Set fra skibet går Jordens ur langsomt på vejen ud (det siger scene 3-4 selv). Kun ved afgang og hjemkomst er alle enige. Kontakten "Set fra skibet" ændrer kun afstanden, ikke urene | Wikipedia "Twin paradox" | Nyt afsnit i "Ærligt talt": "Mens du flyver, viser urene tiden, som man regner den på Jorden. Set fra skibet er 'nu' på Jorden et andet. Kun når I står ved siden af hinanden, er alle enige." |
| F6 | `tidhvorfor.js:193` | "ser den rejsende … Jordens ur gå langsomt … springer 'nu derhjemme' fra 1,8 til 8,2 år" | **Forenkling, der lyder som en fejl.** "Ser" er regnet. I en kikkert ser han Jordens ur vise 1 år ved vendingen og derefter gå 3 gange for hurtigt. Og intet springer derhjemme | Samme, "What it looks like". Regnet efter: k = 3 ved 80 % | Tilføj i "Ærligt talt": "Springet sker ikke derhjemme. Det er den rejsendes måde at regne 'nu' på, der skifter, når han vender." |
| F7 | `tidhvorfor.js:173` mod `:185` og `:188` | "regel 1" er lysets fart ét sted og "fysikken er ens for alle" et andet | **Ikke ens** | – | Brug navne: "den mærkelige regel" og "reglen om, at fysikken er ens for alle" |
| F8 | `tid.js:79` og `:334` | "Det er kun dit ur, der går langsommere" | **Mild udgave af fælden** "tiden går langsommere for dig" | fakta-faelder | "Det er kun tiden på dit ur, der bliver kortere." og "Set fra Jorden går dit ur langsommere." |
| F9 | `tid.js:64-65` og `:312` | "ca. 70 gange hurtigere" og "ca. 71 gange langsommere" i samme emne, og "70,71 gange" i Lige nu | **Samme tal (70,7) rundet på tre måder** | Egen udregning | "ca. 71" alle tre steder |
| F10 | `data/tid.js:236` | 1 g til Alpha Centauri: "gået 12 år … Din tvilling er 24". Seks ni-taller: "væk i 4,5 dage … Du er 13 år og 4 dage" | **Afrunding, der ikke går op** (11,95 år, og 13 + 12 er 25 for en 13-årig) | `tid-tekster.mjs` | Under 100 år: "knap 12 år" eller én decimal. Drop "og N dage" under 10 dage |
| F11 | `hvorfor.js:113` | "Hvorfor kan intet nå lysets fart?" | **Upræcist.** Lyset kan. Svaret og tallene er rigtige | – | "Hvorfor kan et rumskib aldrig nå lysets fart?" |
| F12 | `ordbog.js:386` | Tidsforlængelse: "fordi det farer forbi næsten med lysets fart" | **Upræcist.** Det sker ved alle farter (målt i passagerfly) | Samme opslag nævner flyene | "fordi det bevæger sig i forhold til os. Forskellen er bittelille, indtil farten nærmer sig lysets." |

Mindre:
- "Relativitetsteorien" fra 1905 er den særlige (`tidhvorfor.js:147` og `:185`, `tid.js:55`). Den almene, om tyngden, står i Rumtid lige ved siden af. Skriv "den særlige relativitetsteori" første gang.
- "Omkring 100 myoner gennem hver kvadratmeter hvert sekund" (`tidhvorfor.js:168`) er rigtigt som størrelse. Tommelfingerreglen er ca. 1 pr. cm² i minuttet (ca. 170), men den har jeg kun efter hukommelsen. "Over 100" er sikkert.
- `regn.py` skriver, at bolden mangler 6,25 · 10⁻¹³ km/t. Det er en afrundingsfejl i computeren. Det rigtige er 6,44 · 10⁻¹³, og tekstens "ca. 6 · 10⁻¹³" passer.
- "99,97 % (typisk)" er 99,965 % (`tidhvorfor.js:49`). Sig det i "Ærligt talt" som ved "87 %".
- Frisch og Smith fortælles to steder (`tid.js:104` uden tal og `tidhvorfor.js:189` med). De skal bo ét sted.

**De fire steder, I bad mig se på:**
- **Tvillingeparadokset** er rigtigt forklaret (`tid.js:92-93` og `:123`): Du vender om, og det gør tvillingen ikke. Vejens længde afgør, hvor stor forskellen bliver. Kun F2 og F6 skal rettes.
- **"Set fra skibet"** og længdeforkortelsen er rigtige, og tallene går op begge veje (22 dage).
- **"Nu" og springet:** Tallene er rigtige, men se F5 og F6. Det er dér, en skarp læser vil sige "det passer da ikke".
- **"Tiden går langsommere":** Teksterne siger næsten altid "set fra Jorden går uret langsommere", og "Du mærker intet" står fire steder. Det er godt. Men titlen "Hvorfor går tiden langsommere?" er selve fælden (spørgsmål 5).

## 3. Det pædagogiske eftersyn

**Hvor han sandsynligvis får en forkert idé eller går i stå:**
1. **Ingen undren før svaret.** Lige nu-boksen siger "45 dage for dig og 8,7 år på Jorden" og "Hurtigere end lyset? Nej", før han har trykket noget: fem afsnit, seks kontakter og otte emner (billede a). Der er intet gæt.
2. **Hjemkomsten er én linje.** Scenen ser ud som ved start, og "Tvillingen: 21 år" står med småt (billede b). Man ser aldrig tvillingen.
3. **Anden tur er en blindgyde.** Vælger han Mælkevejens centrum med samme fart, står der "Så længe kan ingen leve". Han skal op på seks ni-taller for at nå hjem i live (som 89-årig) og ni-ti for at komme ung hjem, og "99,9…9 % (10 ni-taller)" siger ham ingenting.
4. **Skyderen starter ved 90 %.** Han ser aldrig, at der næsten intet sker ved halv lysfart. Derfor opdager han ikke selv, at det først sker tæt på lyset.
5. **Scene 1 med lygten:** Ved 100 km/t er de to billeder ens, for toget flytter sig ikke mod lyset (billede c). Det mærkelige ses først ved 50 %, og det skal han selv finde på.
6. **Spørgsmålet står det forkerte sted.** I alle fem scener står spørgsmålet og overgangen til næste scene i højre panel (under scenen på højkant), mens svaret står i underteksten. Tre steder at læse på én gang, som jeg skrev i E3.
7. **Lysurets trin 1-4** i Rejsen i tid er kun "Næste", og lysuret findes to steder.
8. **Scene 3** har tre idéer (660 m, uret går langsomt, luften presses sammen) og fem ting at trykke på. "γ = 38" og "µs" står i billedet uden forklaring (som i E1 punkt 6).
9. **Scene 4** viser, at lyset rammer bagenden først. Men springet derfra til "derfor kan begge se den andens ur gå langsomt" bliver kun sagt, ikke vist. Vognen er også kortere uden et ord om det. Her ser man mest på: Der er kun "Blink igen" og én kontakt.
10. **Scene 5** er den bedste leg i Tid (træk i vendepunktet), men underteksten røber svaret ("får altid flest tik"), og prikkerne er år, ikke tik. "Nu"-linjerne er for svære, også for mig som forklaring til en 13-årig (billede d).

**Ord, der bruges, før de er forklaret:** γ, µs og "kosmisk stråling" (i billedet i scene 3), regnestykket "1² + 1,73² = 2²" (i billedet i scene 2), "ni-taller", "vendepunkt", "tik" om år, og selve "set fra" (at det er det, man måler, ikke det, øjet ser, står kun i "Ærligt talt"). Pythagoras kommer typisk først i 8. klasse (efter hukommelsen). Spørg ham.

**Godt, og skal ikke røres:**
- Regningen i `js/data/tid.js` og alle tallene.
- De to ure med "Du: 13 år og 45 dage" og "Tvillingen: 21 år". De er lette at læse, også på højkant.
- Hjemkomstens sætning (pointen først) og "Din tvilling levede et langt liv".
- Lysuret: samme lysfart i begge billeder, og tallene 1, 1,73 og 2.
- Bolden mod lygten og "(ikke mere!)".
- Den samme byge i alle kontakter i scene 3.
- "1." og "2." og "Begge har ret" i scene 4.
- Trækket og "Hurtigere end lyset kan man ikke!" i scene 5.
- "Ærligt talt"-teksterne og henvisningerne begge veje.

## 4. Drejebogen til det nye "Tid"

**Opbygning:** Ét punkt, "Tid", i Kosmos med **to forløb** (A er 4 trin og B er 6, og ét forløb på 10 trin bryder E3). Bagefter åbner laboratoriet, som er Rejsen i tid i dag, og "Vil du vide mere?".

### Forløb A: "Rejsen i tid"
**Kernesætning:** *"Flyver man næsten med lysets fart ud og hjem, er der gået meget længere tid på Jorden end i skibet. Man mærker det ikke undervejs. Man ser det først, når man mødes igen."*

| Trin | Spørg | Gæt | Gør | Så | Ord |
|---|---|---|---|---|---|
| A1 | Du og din tvilling er 13. Du flyver til en stjerne 40 lysår væk og hjem. Hvor gammel er din tvilling, når du lander? | 13 som mig / ca. 20 / over 90 | Tryk "Flyv" (scenen, de to ure og to tegnede figurer) | Du er 14. Din tvilling er 94. I blev født samme dag. | lysår |
| A2 | Mærkede du noget om bord? | Ja, alt gik langsomt / Nej, intet | Flyv igen, og tryk på "Dit ur" undervejs (uret og et hjerte går helt normalt) | Om bord er alt normalt. Forskellen ses først, når I mødes. Det hedder tidsforlængelse. | tidsforlængelse |
| A3 | Er det farten, der gør det? Tag en kort tur, 4 lysår, med halv lysfart. | Stor forskel / næsten ingen | Vælg 50 %, og flyv til Alpha Centauri | Du er 28, din tvilling er 30. Det sker først for alvor tæt på lysets fart. | – |
| A4 | **Det så du:** kernesætningen | – | Vælg vej: "Hvordan kan det ske?" (forløb B), "Leg frit" eller "Er det målt?" | – | – |

### Forløb B: "Hvordan kan det ske?"
**Kernesætning:** *"Lyset har den samme fart for alle. Derfor går et ur, der farer forbi, langsommere set udefra. Det er målt."*

| Trin | Spørg | Gæt | Gør | Så | Ord |
|---|---|---|---|---|---|
| B1 | Et tog kører 100 km/t. En bold kastes 50 km/t fremad. Hvor hurtigt flyver den set fra perronen? | 50 / 100 / 150 km/t | Tryk "Kast" (scene 1, bold) | 150 km/t. Farterne lægges sammen. Sådan plejer det at være. | – |
| B2 | Nu kører toget med halv lysfart og tænder en lygte. Hvor hurtigt er lyset set fra perronen? | Halvanden gange lysets fart / lysets fart | Tryk "Tænd lygten" (scene 1, lygte, **50 %**) | Lysets fart, ikke mere. Lyset er ligeglad med togets fart. | lysets fart |
| B3 | Et ur, hvor lys hopper mellem to spejle, flyver forbi dig. Hvilken vej går lyset set fra dig? | Lige op og ned / på skrå | Tryk "Send uret forbi" (scene 2, 87 %) | På skrå, for spejlene flytter sig imens. | lysur |
| B4 | Hvor meget længere er den skrå vej? | – | Træk målebåndet langs den skrå vej (eller "Vis trekanten") | Dobbelt så lang. Lyset kan ikke skynde sig, så hvert tik tager dobbelt så lang tid. | – |
| B5 | Er det bare en tanke? Myoner fra rummet lever så kort, at de burde gå i stykker højt oppe. Hvor mange når ned? | Næsten ingen / ca. halvdelen | Skift fra "Uden Einstein" til "Med Einstein" (scene 3 uden skyder) | Ca. halvdelen. Deres ure går 38 gange langsommere set fra os. De flyver gennem dig lige nu. | myon |
| B6 | **Det så du:** kernesætningen | – | Vælg vej: "Prøv rejsen igen", "Hvorfor ikke omvendt?" eller "Set fra myonen" | – | – |

**Genbruges uændret:** regningen, scenen og urene i `tid.js`, lysuret (`lysur.js`), lærrederne til scene 1-3 og scene 4-5 som de er.

**Bygges nyt** (lille til mellem, når Forløb-klodsen findes):
- teksterne som data (`js/data/forloeb/tid.js`)
- gættet i A1 og de to figurer ved hjemkomsten
- "Dit ur" stort i A2
- 50 % som fart (i dag kun ni-taller)
- målet TRAPPIST-1
- målebåndet i B4
- ét punkt i listen i stedet for to

**Valgt fra, og hvor det bor:**
- **Laboratoriet efter A:** Mælkevejens centrum, Andromeda, ni-tals-skyderen, 1 g og "Set fra skibet". Højst fem valg synlige i Styr, resten foldet.
- **"Vil du vide mere?" (lag 2):** "To forklaringer, samme svar" (scene 3 med "Set fra myonen" og skyderen) og "Hvorfor ikke omvendt?" (scene 5 med "nu"-linjerne slukket).
- **"For nørder" (lag 3):** scene 4, "nu"-linjerne, formlerne, Michelson og Morley, Einstein som 16-årig og linjen med Pythagoras.
- **Højre panel:** fire spørgsmål ("Hurtigere end lyset?", "Hvorfor ikke omvendt?", "Er det målt?" og "Kunne man?"). "Hvad gør farten?", "Fast fart eller 1 g?" og "Set fra skibet" folder sig ud med deres kontakt, som i dag.
- **Udgår:** lysurets fem trin i Rejsen i tid og emnet "Hvorfor går Jordens ur så hurtigt?". Forløb B tager over.

**Ordene (5):** lysår, lysets fart, lysur, tidsforlængelse og myon. Længdeforkortelse, samtidighed, egentid og rumtid hører til "Vil du vide mere?".

**Prøven:**
1. Du flyver ud og hjem næsten med lysets fart. Hvem er ældst, når I mødes, og mærkede du noget undervejs?
2. Hvad er det mærkelige ved lysets fart?
3. Hvorfor går uret i skibet langsommere, set fra Jorden?

**Nye fakta, der skal tjekkes:**
- TRAPPIST-1: 40,66 lysår (parallakse 80,2123 mas, Wikipedia i dag. Gaia er ikke læst) og syv planeter (efter hukommelsen). Ved 99,99 % giver det 81,3 år på Jorden og 1,15 år i skibet, altså 94 og 14.
- 50 % til Alpha Centauri: 17,4 og 15,0 år, altså 30 og 28.
- "Ca. halvdelen" af myonerne (55 % i den enkle udregning).
- CERN og 10¹⁸ g.

## 5. Det fede og sjove
| Idé | Størrelse | Hvem | Hvad den lærer |
|---|---|---|---|
| **Gæt din tvillings alder** før afgang (A1) | lille | Opus direkte | Overraskelsen bliver hans egen |
| **Mød din tvilling:** to tegnede figurer ved hjemkomsten. Tvillingens ældes under turen | lille til mellem | Opus direkte | At to mennesker har levet forskellig tid |
| **TRAPPIST-1 som mål** (syv planeter, 40 lysår): "Du er 14, din tvilling er 94" | lille | Opus med faktatjek | Det billede, alle husker. Det kan ikke laves i dag |
| **Fra gåben til lysets fart:** én skyder, der viser "så meget yngre er du efter et år". Gå: 0,3 milliardtedele sekund. Bil: 0,2 milliontedele. Fly: 11 milliontedele. Rumstationen: 0,01 sekund. Halv lysfart: 49 dage. 99 %: 314 dage | lille | Opus direkte | At det altid sker, men først kan ses tæt på lyset. Mit eget ur |
| **Fødselsdagshilsner** på rumtidskortet: Hver tvilling sender et lysglimt hvert år. Ved 80 % får den rejsende 1 på vejen ud og 9 på vejen hjem. Tvillingen får 3 på ni år og 3 det sidste år | mellem | Opus med en kort plan | Hvorfor de to ikke er ens, uden "nu"-linjer. Det er det, man ville se i en kikkert |
| **Myonerne i din hånd:** en tæller, "ca. én i sekundet flyver gennem din hånd lige nu" | lille | Opus med faktatjek | At det er målt, og at det er her |
| **Mål selv den skrå vej** med et målebånd (B4) | lille | Opus direkte | Længere vej giver længere tik, uden Pythagoras |

Skyderens tal er mine egne (v²/2c² gange et år). For fly og rumstation trækker tyngden den anden vej. Det skal siges.

**Fristende, men bør ikke laves nu:**
- **T4, cockpittet.** Det er flot, men det er en tredje idé (hvordan lyset ser ud), som ikke tjener nogen af de to kernesætninger. Det er dyrt, og det frister til at tro, at man ser afstanden skrumpe. Vent, til Tid har bestået prøven.
- **Frit tegnede rejser** på rumtidskortet, flere mål og flere ni-taller. Det er flere knapper, ikke mere forståelse.
- **Et gæt om fremtiden** ved hjemkomsten. Hold fast i fortiden.
- **Sorte huller og Interstellar** i Tid. Det er tyngden, og den bor i Rumtid.
- **Point eller en quiz**, man kan dumpe.

## 6. Prøven med jeres søn (kan bruges uden resten)
Ti minutter, start i Kosmos, og sig kun: "Prøv Rejsen i tid." Hjælp ikke. Se efter:
1. **Hvad trykker han først?** "Flyv", eller læser han panelet til højre?
2. **Hvad siger han ved hjemkomsten?** Opdager han selv "Tvillingen: 21 år", eller læser han kun linjen nederst?
3. **Hvad gør han bagefter?** Nyt mål, skyderen, "Vis lysuret" eller ingenting? Hvis han vælger Mælkevejens centrum: Hvad siger han til "Så længe kan ingen leve"?
4. **Forstår han skyderen?** Spørg bagefter: "Hvad er forskellen på 99,99 % og 99,9999 %?"
5. **Finder han "Hvorfor går tiden langsommere?" selv?** Hvis ikke, så vis ham den efter fem minutter.
6. **Scene 1:** Skifter han til lygten, og siger han noget? Skruer han op for togets fart?
7. **Hvor stopper han?** Notér scenens nummer og det ord, han stopper ved (fx myon, γ, "samtidig", "vendepunkt").
8. **Trækker han i vendepunktet i scene 5** uden at få det at vide?

**De tre spørgsmål bagefter:**
1. "Hvem var ældst, da du kom hjem? Kunne du mærke noget i skibet?"
2. "Hvordan kan det ske? Forklar det, som du ville til en ven."
3. "Hvad var det mærkelige ved lyset?"

Siger han noget i retning af "min tid gik langsommere, så jeg følte det gik langsomt", er det fælden. Skriv hans ord ned. Svarer han ikke på spørgsmål 2, er det Tid, der skal rettes, ikke ham.

## 7. Spørgsmål til jer
1. **Ét forløb eller to?** a) To korte under ét punkt, "Rejsen i tid" og "Hvordan kan det ske?" (anbefalet: hver har én sætning og holder fem minutter). b) Ét langt på ca. ti trin. c) Som i dag med to fænomener.
2. **Et fjerde mål, TRAPPIST-1?** a) Ja, som den første rejse i forløbet, så tvillingen bliver 94 (anbefalet). b) Kun i laboratoriet. c) Nej, behold de tre mål.
3. **Runden med jeres søn:** a) Nu, på udgaven som den er, når F1-F4 er rettet, så vi ved, hvor han går i stå, før forløbene bygges (anbefalet). b) Først når forløbene er bygget.
4. **Scene 4 og "nu"-linjerne:** a) Behold dem under "For nørder", og byg senere fødselsdagshilsnerne som den lette forklaring (anbefalet). b) Skjul dem helt, til forløbene er prøvet. c) Lad dem stå som i dag.
5. **Navnet på forløb B:** a) "Hvordan kan det ske?" (anbefalet: Det følger af hjemkomsten og siger ikke fælden). b) "Hvorfor går tiden langsommere?" (jeres egne ord, og det, et barn ville spørge om). c) "Hvorfor går uret langsommere?".

## Det, jeg ikke har set
Hvordan det føles med fingre, og om det hakker på tabletten. Lyden, farver og glød (testbrowseren har intet grafikkort) og telefonen. Fysikartiklerne selv (Frisch og Smith, Bailey og Gaia): kun Wikipedias gengivelse. Myonernes antal pr. cm² og Pythagoras i 8. klasse har jeg efter hukommelsen.
