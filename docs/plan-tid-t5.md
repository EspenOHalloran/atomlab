# Drejebog: "Hvorfor går tiden langsommere?" (T5)

*T5 Trin 0, 8. november 2026 (Opus, høj effort). Prompten er [prompt-tid-t5.md](prompt-tid-t5.md), og jeres ønske og opdelingen står under T5 i [plan-tid.md](plan-tid.md). Faktagrundlaget er [fakta-tid/hvorfor-langsommere.md](fakta-tid/hvorfor-langsommere.md) (afsnit 15), og tallene er regnet efter i [fakta-tid/regn.py](fakta-tid/regn.py). Skitserne er [skitser/tid-t5.html](skitser/tid-t5.html) (også udgivet som artefakt). Teksterne her og i skitsen er de samme. Ret dem begge steder.*

## Jeres svar (8. november 2026)
- **Hvor:** Et nyt fænomen i Kosmos ved siden af Rejsen i tid, og de to henviser til hinanden. **Alle fem scener.** Trin 0 laver skitserne som små animationer i et artefakt.
- **Navnet:** "Hvorfor går tiden langsommere?" (jeres egne ord). Undertitel: "Lysets mærkelige regel". Ikon 🔦 (lygten fra scene 1, så den ikke ligner Rejsen i tids ⏳).
- **Opbygning:** Én rejse med "Næste" og spring. Første gang går man 1 → 5 med "Næste" (som lysurets trin). Bjælken viser fem prikker, og man kan altid trykke sig til en scene, man har set (alle, når man har været igennem én gang).
- **Scene 4:** Lampen i togvognen og én pointe ("samtidig" afhænger af, hvem der kigger). "Hvorfor?" kobler det til, at begge kan se den andens ur gå langsomt. Detaljerne står i "For nørder".
- **Scene 5:** Man trækker vendepunktet med fingeren (ikke frit tegnet). Det kan ikke trækkes fladere end lyset.

## Rammen
- **Fil og plads:** `js/kosmos/tidhvorfor.js` (id `tidhvorfor`), lige efter `tid` i listen i `js/kosmos.js`: `[…, rumtid, tid, tidhvorfor, tyngdebolger, …]`. Når Kosmos får grupper (punkt 7 i [koereplan.md](koereplan.md)), står den i samme gruppe som Rejsen i tid og Rumtid.
- **Skærmen:** Som lysuret i Rejsen i tid er hovedsagen et 2D-lærred over en rolig 3D-baggrund (stjernehimlen). Bjælken nederst har ‹, fem prikker og "Næste ›" (fænomenets `trin()`). Teksten, der altid er fremme, står som fasens undertekst (under ca. 160 tegn, tjekliste B), og kontakterne og skyderne står i Styr-boksen. "Hvorfor?", "For nørder" og "Ærligt talt" står i siden (dybde i lag).
- **Siden (tilføjet 9. november 2026, da prompterne blev skrevet):** Siden i `faenomenskaerm.js` bygges én gang og skifter ikke med scenen. Derfor: fem emner, ét pr. scene (scenens navn som titel og dens "Hvorfor?" som tekst), og "For nørder" og "Ærligt talt" med ét afsnit pr. scene (scenens navn med fed). Kort: "Hvorfor går et ur langsommere, når det farer af sted? Fem små scener viser det trin for trin, fra lysets mærkelige regel til tvillingen, der kommer yngst hjem."
- **Underteksterne:** Scene 3's fælles sætning ("Myoner er små partikler …") står i emnet og i første undertekst, når man kommer til scenen. Bagefter står kun den linje, der hører til kontakten. Scene 4's "Om to ting sker 'samtidig' …" kommer som en ny undertekst, når lyset har ramt forenden.
- **Henvisninger:** I Rejsen i tid får emnet "Hvorfor går Jordens ur så hurtigt?" en knap i teksten "🔦 Hvorfor? Se det trin for trin", der åbner det nye fænomen (`gå('kosmos:tidhvorfor')` eller det, `sideknap.js` bruger). Lysurets sidste trin nævner det også. I det nye fænomen siger scene 2: "Lysuret trin for trin står også i Rejsen i tid", og scene 5 slutter med knappen "⏳ Prøv det på en rigtig rejse: Rejsen i tid".
- **Telefon og tablet på højkant:** Scene 1 og 4 har altid de to billeder over hinanden (togene er brede). Scene 2 har lysurene ved siden af hinanden på brede skærme og over hinanden under ca. 560 px. Scene 3 er en høj søjle (passer godt på højkant). På langs står søjlen til venstre og tallene til højre. Scene 5 er kvadratisk (fylder bredden på højkant). Vendepunktet er en stor prik (mindst 44 px at ramme), og man kan trække uden at ramme præcist (nærmeste punkt).
- **Lys og farver som lysuret:** den lige vej `#7fe0ff`, den skrå vej og lyset `#ffd24a`, spejlene `#cfe3ff`, boksene `rgba(8,12,28,0.96)`, og "nu"-linjerne lyserøde. Lysets fart på skærmen er den samme i begge billeder i hver scene.

## Scene 1: Den mærkelige regel (bolden og lyset)
**Spørgsmålet:** Hvorfor skulle tiden overhovedet kunne gå forskelligt?

**Animationen:** To billeder over hinanden: "Set fra toget" (toget står stille, og perronens pæle glider forbi) og "Set fra perronen" (toget kører). Fra togets forende kastes en bold, eller en lygte blinker. Pile med farterne over bolden og lyset.

**Man gør selv:** Kontakterne ⚾ Bold og 🔦 Lygte (én tændt). Skyderen "Togets fart": 100 km/t, 50 % og 90 % af lysets fart.

**Altid fremme:**
- Bold: "Toget kører 100 km/t, og bolden kastes 50 km/t fremad. Set fra perronen flyver bolden 150 km/t. Farterne lægges sammen."
- Lygte: "Med lyset sker der noget mærkeligt: Det har lysets fart set fra toget og præcis den samme fart set fra perronen. Togets fart lægges ikke til."
- Bold ved 50 % eller 90 %: "Ved så store farter lægges farterne ikke helt sammen: Bolden flyver 80 % af lysets fart, ikke 100 %. Se For nørder." (96,6 % ved 90 %)

**Hvorfor?** Lysets fart er ca. 300.000 km i sekundet (ca. 1 milliard km/t). Den er den samme for alle, uanset hvor hurtigt de selv bevæger sig. Det er målt igen og igen. I 1887 ledte Michelson og Morley efter en forskel: Jorden farer om Solen med 30 km i sekundet, så lyset burde gå en anelse hurtigere den ene vej end den anden. De fandt ingen forskel.
Men hvordan kan det passe? Hvis toget og perronen måler den samme fart for det samme lys, selv om toget kører efter lyset, så må noget andet være anderledes for dem. Fart er jo vej delt med tid. Det, der giver efter, er tiden (og afstanden).

**For nørder:** Einstein fortalte selv mange år senere, at han som 16-årig forestillede sig at løbe efter en lysstråle med lysets fart. Så burde lyset se ud, som om det stod stille. Men sådan noget lys findes ikke. I 1905 byggede han relativitetsteorien på to regler: Fysikkens love er de samme for alle, der bevæger sig jævnt, og lysets fart er den samme, uanset hvor hurtigt lampen bevæger sig.
Farter lægges i virkeligheden sammen med w = (u + v)/(1 + u·v/c²). Bolden flyver derfor ikke præcis 150 km/t. Den mangler ca. 6 · 10⁻¹³ km/t, under en milliontedel millimeter i timen. Ved store farter kan man se det: Kører toget 50 % af lysets fart og kaster bolden 50 % fremad, flyver bolden 80 %, ikke 100 %. Og med lyset (u = c) giver formlen altid c.

**Ærligt talt:** Et tog kan ikke køre med en mærkbar del af lysets fart, og lyset er tegnet meget langsommere, end det er. Men det har den samme fart i begge billeder. Billederne viser, hvad man ville måle, ikke hvad øjet ser (lyset skal også nå frem til øjet).

**Overgangen:** "Når lyset ikke kan køre hurtigere, må noget andet give efter. Hvad? Næste: Lysuret."

## Scene 2: Lysuret (tiden giver efter)
**Spørgsmålet:** Hvad giver efter, når lysets fart ikke gør?

**Animationen:** Lysurene fra Rejsen i tid: til venstre (eller øverst) uret i skibet, til højre (eller nederst) det samme ur set fra Jorden, hvor spejlene farer forbi og lyset går i zigzag. Begge tæller tik. Nyt: "△ Vis trekanten" stopper, når lyset set fra Jorden er oppe, og tegner trekanten for et halvt tik: den lige vej (1), det stykke, spejlene har flyttet sig, og den skrå vej, med tallene og "1² + 1,73² = 2²". Ved høje farter skaleres billedet ned, så trekanten kan være der (vinklerne er de rigtige).

**Man gør selv:** Skyderen "Fart": 0, 50, 87, 95 og 99 % (starter ved 87 %, γ = 2). Knappen "△ Vis trekanten" / "▶ Fortsæt".

**Altid fremme:** "Set fra Jorden går lyset i uret en længere, skrå vej. Lyset kan ikke køre hurtigere, så hvert tik tager længere tid. Uret går langsommere."
Med trekanten: "Ved 87 % er den skrå vej 2 gange så lang som den lige. Derfor tager hvert tik 2 gange så lang tid set fra Jorden." (tallene følger farten)

**Hvorfor?** Tegn et halvt tik som en trekant: den lige vej op (1), det stykke, spejlene flytter sig, mens lyset er undervejs (1,73), og den skrå vej, lyset går (2). Pythagoras siger 1² + 1,73² = 2², altså 1 + 3 = 4. Den skrå vej er 2 gange så lang, og lyset har den samme fart, så det tager 2 gange så lang tid.
Om bord mærker du intet. Dit eget ur, dit hjerte og dine tanker går helt normalt for dig. Først når man sammenligner med urene på Jorden, viser forskellen sig.

**For nørder:** Kald tiden for et tik set fra Jorden for t. På et halvt tik går lyset c·t/2 på skrå, mens spejlene flytter sig v·t/2. Højden er L. Pythagoras: (c·t/2)² = L² + (v·t/2)². Løs for t: t = (2L/c) · 1/√(1 − v²/c²). Det sidste stykke er γ (gamma), tidsforlængelsen. Ved 50 % er γ = 1,15, ved 87 % 2, ved 95 % 3,2 og ved 99 % 7,1.
Hvorfor skal alt følge med? Hvis dit hjerte fulgte lysuret, men dit armbåndsur ikke gjorde, kunne du se på urene, at skibet bevæger sig. Men regel 1 siger, at fysikken er den samme for alle, der bevæger sig jævnt. Så alt følger med.

**Ærligt talt:** Lysuret er et tankeeksperiment, som står i de fleste lærebøger. Man kan ikke se lysglimtet undervejs. Animationen viser, hvad man ville regne sig frem til. "87 %" er 86,6 %, hvor γ er præcis 2. Lysuret trin for trin står også i Rejsen i tid.

**Overgangen:** "Er det bare en tanke, eller kan man måle det? Næste: Myonernes kapløb."

## Scene 3: Myonernes kapløb (det er målt)
**Spørgsmålet:** Er det målt, eller er det bare en tanke?

**Animationen:** En høj søjle af luft: øverst "15 km: Den kosmiske stråling rammer luften", nederst jorden med en detektor og tælleren "Nåede ned: 13 af 24". En byge på 24 myoner (prikker med et lille ur) falder ned. Hver myon har sin egen tilfældige levetid (i gennemsnit 2,2 µs på dens eget ur) og går i stykker med et lille glimt, når dens ur når den. To ure i hjørnet: "Jordens ur" og "Myonens ur" i milliontedele sekund. Den samme byge (de samme levetider) bruges i alle tre kontakter, så man kan se, at de samme myoner når ned "Med Einstein" og "Set fra myonen".
- **Uden Einstein:** Myonens ur går som Jordens. Næsten alle går i stykker inden for de øverste ca. 660 m.
- **Med Einstein (set fra Jorden):** Myonens ur går γ gange langsommere. De fleste når ned ved den typiske fart.
- **Set fra myonen:** Søjlen klemmes sammen til 15 km/γ (ca. 400 m), billedet zoomer ind, og så suser jorden op mod myonerne, der står stille. Linealen skifter fra km til m, og de 15 kilometermærker står tæt.

**Man gør selv:** Tre kontakter (én tændt): "Uden Einstein", "Med Einstein" og "Set fra myonen". Skyderen "Fart": 99 %, 99,9 % og 99,97 % (typisk, γ ≈ 38). Knappen "Ny byge".

**Altid fremme:** "Myoner er små partikler, der laves ca. 15 km oppe og kun lever ca. 2 milliontedele sekund. Selv næsten med lysets fart burde de kun nå ca. 660 m."
- Uden Einstein: "Uden tidsforlængelse går næsten alle i stykker højt oppe. Kun ca. 1 ud af 8 milliarder ville nå ned."
- Med Einstein: "Set fra Jorden går myonens ur ca. 38 gange langsommere. Derfor når mange flere ned. Ved den typiske fart når de fleste ned, og det er det, man måler." (γ følger skyderen)
- Set fra myonen: "Set fra myonen går dens ur helt normalt. Til gengæld er luften presset sammen til ca. 400 m, og jorden suser op mod den. Samme svar!" (ca. 670 m ved 99,9 % og ca. 2,1 km ved 99 %)

**Hvorfor?** Myonen er elektronens tunge fætter (ca. 200 gange tungere). Den laves, når den kosmiske stråling (partikler fra rummet) rammer luften. En myon i hvile lever i gennemsnit 2,2 milliontedele sekund. Ved havets overflade suser omkring 100 myoner gennem hver kvadratmeter hvert sekund, også gennem dig.
Set fra Jorden er turen 15 km lang og tager ca. 50 milliontedele sekund. Men myonens ur går så langsomt, at det kun når ca. 1,3 milliontedele sekund. Set fra myonen er turen kun ca. 400 m, og den tager ca. 1,3 milliontedele sekund. Samme ur, samme svar, to forklaringer: Hvad der er tid for den ene, er afstand for den anden.

**For nørder:** Rossi og Hall målte i 1940 myonerne højt oppe på et bjerg i Colorado og længere nede i Denver. Myonerne fór over 99 % af lysets fart, og der kom flere ned, end der burde uden tidsforlængelse. Frisch og Smith gjorde det mere præcist i 1962 og filmede det: På toppen af Mount Washington (1.917 m) talte de ca. 563 myoner i timen. Uden tidsforlængelse skulle der kun være kommet ca. 27 i timen ned til havet, men de talte ca. 412. Det tydeligste forsøg er fra CERN i 1977: Myoner, der kørte rundt i en ring med γ = 29,3, levede 64,4 milliontedele sekund i stedet for 2,2, altså ca. 29 gange længere.
Typiske myoner ved jorden har en energi på ca. 4 GeV (γ ≈ 38). Deres gennemsnitlige vej bliver ca. 25 km i stedet for 660 m.

**Ærligt talt:** Myonerne taber fart på vejen ned, luften er tyndere foroven, og ikke alle laves præcis 15 km oppe. Tallene i animationen er en enkel udregning. Levetiden er et gennemsnit: Nogle myoner går i stykker før, andre efter, helt tilfældigt (som atomkerner, der henfalder). Man kan ikke se myonerne. Man måler dem med en detektor. Animationen er sat meget ned i fart, og "Set fra myonen" endnu mere (urene viser de rigtige tider).

**Overgangen:** "Men vent: Set fra myonen er det Jordens ure, der farer forbi. Så må de gå langsomt set fra myonen. Hvordan kan begge have ret? Næste: 'Nu' er ikke det samme for alle."

## Scene 4: "Nu" er ikke det samme for alle
**Spørgsmålet:** Hvordan kan begge se den andens ur gå langsomt?

**Animationen:** To billeder over hinanden: "Set fra toget" og "Set fra perronen". En lampe midt i en togvogn blinker, og lyset går begge veje med den samme fart på skærmen. Når lyset rammer en ende, lyser enden op og får et nummer (1. og 2., eller "samtidig"). Set fra perronen er vognen 80 % så lang (længdeforkortelse), og der kommer et mærke på perronen, hvor lyset ramte. Gentages efter en pause.

**Man gør selv:** Knappen "💡 Blink igen". Kontakterne "Toget står stille" og "Toget kører 60 % af lysets fart" (starter ved 60 %). Står toget stille, er de to billeder ens.

**Altid fremme:** "Lampen midt i vognen blinker. Set fra toget når lyset begge ender samtidig. Set fra perronen når det bagenden først, for bagenden kører lyset i møde."
Og bagefter: "Om to ting sker 'samtidig', kommer an på, hvem der kigger."

**Hvorfor?** Set fra perronen har lyset den samme fart begge veje (regel 1!). Men bagenden kører lyset i møde, og forenden kører fra det. Derfor når lyset bagenden først. I toget er begge ender lige langt fra lampen, så lyset når dem samtidig. Begge har ret.
Det løser gåden fra myonerne: For at sammenligne to ure, der er langt fra hinanden, skal man vide, hvad de viser "på samme tid". Og det er de to ikke enige om. Derfor kan begge se den andens ur gå langsomt, uden at nogen tager fejl. Først når de mødes igen, kan de lægge urene ved siden af hinanden. Det er det, rumtidskortet viser.

**For nørder:** I skitsen kører toget 60 % af lysets fart. Set fra perronen er vognen også kortere (80 % af sin længde), og lyset når bagenden efter 0,25 og forenden efter 1,0 (målt i den tid, lyset er om at gå vognens længde). I toget når det begge efter 0,5.
For en rigtig togvogn på 20 m ved 100 km/t er forskellen ca. 6 femtosekunder (6 milliontedele af en milliardtedel sekund). Derfor opdagede ingen det før Einstein. Han forklarede det selv i en bog fra 1917 med to lyn, der rammer hver sin ende af et tog.

**Ærligt talt:** "Set fra perronen" er ikke det, øjet ser: Lyset skal også nå frem til den, der kigger. Det er det, man får, når man har trukket lysets rejsetid fra (eller har ure i takt langs hele perronen). Et tog kan heller ikke køre 60 % af lysets fart.

**Overgangen:** "Hvem bliver så yngst, når den ene tvilling rejser ud og kommer hjem igen? Næste: Rumtidskortet."

## Scene 5: Rumtidskortet (hvem bliver yngst?)
**Spørgsmålet:** Hvorfor er det den rejsende, der bliver yngst, og ikke den, der bliver hjemme?

**Animationen:** Et kort, hvor op er tid (0-10 år) og til siden er rum (−5 til 5 lysår). De gule streger er lys, der sendes ud ved start og kommer hjem ved slut (45°). Den hjemmeblevnes streg går lige op (blå). Den rejsendes streg går ud til vendepunktet og hjem (gul). Langs hver streg sidder en prik for hvert år på dens eget ur. "▶ Spil rejsen" lader to små ure køre langs stregerne. Tallene: "Hjemme: 10 år · Rejsende: 6 år (80 % af lysets fart)".

**Man gør selv:** Træk i vendepunktet (op, ned og til siden). Det kan ikke komme uden for de gule streger (hurtigere end lyset), og der står "Hurtigere end lyset kan man ikke", hvis man prøver. Knappen "▶ Spil rejsen". For nørder: kontakten "Vis den rejsendes 'nu'".

**Altid fremme:** "Op er tid, til siden er rum. Lyset går skråt (de gule streger). Træk i vendepunktet: Den lige streg (at blive hjemme) får altid flest tik."

**Hvorfor?** Hver prik er ét år på den rejsendes eller den hjemmeblevnes eget ur. På et landkort er den lige vej den korteste. I rumtiden er det omvendt: Den lige vej giver mest tid, og en omvej giver mindre. Det skyldes, at rumtidens Pythagoras har et minus: Vejen ud til 4 lysår på 5 år giver 5² − 4² = 3², altså 3 år. Ud og hjem giver 6 år, mens der går 10 år derhjemme.
De to tvillinger er ikke ligestillede: Kun den rejsendes streg har et knæk. Den rejsende vender om og mærker det. Den hjemmeblevne gør ikke.

**For nørder:** Tænd "Vis den rejsendes 'nu'". Hver stiplede linje viser, hvad der sker derhjemme "lige nu" set fra den rejsende (scene 4). Med vendepunktet 4 lysår ude ser den rejsende på vejen ud Jordens ur gå langsomt: Efter 3 år i skibet er der kun gået 1,8 år derhjemme. Det samme på vejen hjem. Men i vendingen springer "nu derhjemme" fra 1,8 til 8,2 år. Dér ligger de manglende år.
Det er ikke accelerationen, der gør det: Man kan lave forsøg, hvor begge ure accelererer lige meget og alligevel kommer forskelligt hjem. Det er vejens længde, der tæller.
Formlen for et lige stykke er τ² = t² − (x/c)². Tiden på ens eget ur kaldes egentiden, og den lige streg giver mest. Tæt på lysets streger bliver der næsten ingen tid, men lyset selv har ikke noget ur.

**Ærligt talt:** Vendingen er tegnet som et knæk. I virkeligheden tager det tid at vende, og det koster masser af energi. Rejsen går lige ud og hjem med fast fart.

**Afslutningen:** "Prøv det på en rigtig rejse:" og knappen "⏳ Rejsen i tid".

## Tjek mod fælderne ([fakta-faelder.md](erfaringer/fakta-faelder.md))
- "Du mærker intet": scene 2 ("Om bord mærker du intet") og scene 3 ("Set fra myonen går dens ur helt normalt"). Ingen tekst siger "tiden går langsommere for dig".
- "Det er accelerationen": scene 5's For nørder siger, at det er vejens længde.
- "For lyset står tiden stille": scene 5 siger, at lyset ikke har noget ur.
- "Rumtiden med lysets fart": billedet bruges ikke. Scene 5 bruger minusset i stedet.
- "Man bliver tungere": bruges ikke.
- "Einstein byggede på Michelson og Morley": scene 1 siger kun, at de ledte og ikke fandt en forskel.
- Einstein som 16-årig: "fortalte selv mange år senere", ingen anførselstegn.
- Myonerne: "de fleste" ved den typiske fart (kildens ord). Frisch og Smiths tal står med "ca." og "i timen" (bekræftet i T5, afsnit 15.6).
- "Set fra" er ikke det, øjet ser (Ærligt talt i scene 1 og 4).

## Byggeriet (forslag, rettes efter jeres runde)
- **T5a:** Fænomenet (filen, listen, rammen med fem scener, prikkerne, "Næste" og spring, lærredet og layoutet på telefon og tablet), scene 1 og 2. Lysurets tegnekode deles mellem `tid.js` og `tidhvorfor.js` (fx `js/kosmos/lysur.js`), så de ikke glider fra hinanden.
- **T5b:** Scene 3 (myonerne).
- **T5c:** Scene 4 og 5, henvisningerne begge veje og nye ord i Ordbogen (fx samtidighed og egentid, tjek først, hvad der findes).
- Model: Opus, høj effort. Tegnekoden i skitsen genbruges (`docs/skitser/tid-t5.html`). Tallene i skitsen er regnet med de samme formler som i regn.py.

## Jeres runde med jeres søn
*Spørgsmålene står også nederst i skitsen. Skriv svarene her (eller sig dem til Opus).*
1. Scene 1: Kan han sige med sine egne ord, hvorfor bolden flyver 150 km/t, men lyset ikke flyver hurtigere?
2. Scene 2: Forstår han, hvorfor den skrå vej gør uret langsommere? Hjælper trekanten, eller er den for meget?
3. Scene 3: Kan han forklare forskellen på "Med Einstein" og "Set fra myonen"? Er det tydeligt, at det er de samme myoner, der når ned?
4. Scene 4: Forstår han, hvorfor lyset når bagenden først set fra perronen? Og giver koblingen til urene mening?
5. Scene 5: Opdager han selv, at den lige streg får flest tik? Hvad siger han til "nu"-linjerne?
6. Hvor faldt han af, og hvor blev han nysgerrig? Var teksterne for lange?

**Svarene (9. november 2026):** Jeres ord: "Skitsen er afprøvet. Den er god. Lad os få det ind i AtomLab." Drejebogen og skitsen er godkendt uden ændringer, og T5 Trin 0 er færdig. Byggeriet: [prompt-tid-t5a.md](prompt-tid-t5a.md), [prompt-tid-t5b.md](prompt-tid-t5b.md) og [prompt-tid-t5c.md](prompt-tid-t5c.md).
