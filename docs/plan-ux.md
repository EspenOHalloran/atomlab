# Plan: Ny opbygning af Solsystemet og Kosmos (UX)

*Skrevet 30. oktober 2026 efter et eftersyn af UI og UX i Solsystemet: koden og skærmbilleder på pc, tablet på langs og på højkant og telefon (Mars, Saturn, Solen og flybyen), sammenlignet med Kosmos og Stjerneovnen. Byg ét trin ad gangen (U1-U4) med et go før hvert.*

## Kort fortalt
Panelerne er bygget op efter koden: én fil er ét punkt i listen. De følger ikke den måde, man rejser på, hvor der er steder inde i steder. Derfor står det meste af indholdet (ca. 20 steder og måner ved Mars, Saturn og Jorden) ikke i listen. Man kommer derhen med knapper under "Prøv selv", der ligner kontakterne. Teksten om stedet står i den mindste boks, og det store panel gentager planetens tekst.

Den nye opbygning: **Alt er et sted.**
- **Venstre panel: Hvor er jeg, og hvor kan jeg tage hen?** Kun navigation, som et træ.
- **Billedet: oplevelsen** og alt, der styrer billedet: bjælken med turen, en boks med kontakter og skydere og en tidsknap.
- **Højre panel: Hvad ser jeg?** Siden om det sted, man er ved, i lag fra let til dybt.

"Prøv selv" forsvinder.

## Jeres svar (30. oktober 2026)
- Det var især "Prøv selv", der var for rodet. I er enige i betragtningerne i eftersynet.
- Kontakterne (til/fra) står på billedet.
- Pause, "Drej Mars" og "Drej Jorden" bliver én tidsknap.
- Ingen skitse først.
- Hvilke steder man har set, skal ikke tælles.
- "Generelt har du frie tøjler til at gøre det, som du synes fungerer bedst." Derfor gælder alle anbefalingerne her: Alt er et sted, én side med foldebokse i stedet for fanerne "Kort fortalt" og "For nørder", og "Ærligt talt" i sin egen boks.

## Problemerne i dag
**1. Fire slags knapper ligner hinanden og står i samme bunke.** Under "Prøv selv" står:
- knapper, der tager et sted hen (Hele Mars, Månerne, Saturn, Enceladus, Titan)
- knapper, der starter noget (▶ Start flyby)
- kontakter (Drej Mars, Bjergene 10 gange højere, Modlys, Navne)
- knapper til turen (Næste, Stop flyby)

Om en kontakt er slået til, ses kun på en turkis kant. Ved Saturn ser "Saturn" (du er her, derfor grå) og "Modlys" (slået fra, også grå) ens ud. Knapperne skifter også plads: "Hele Mars" forsvinder ved hele Mars, "Saturn" bliver grå, og flybyen skifter de øverste knapper ud.

**2. Det samme niveau i listen betyder to ting, og de fleste steder står der ikke.** Under Solen og Jorden er punkterne forsøg i deres egen scene. Under Mars og Saturn viser listen ingenting.

```
Solen ...................... listen
  Solstorm ................. listen (egen scene)
  Solens fremtid ........... listen (egen scene)
Jorden ..................... listen
  Månen .................... til/fra-knap (!)
  Årstiderne ............... listen (egen scene)
  Formørkelser ............. listen (egen scene)
Mars ....................... listen
  Olympus Mons, Tharsis,
  Valles, Hellas, Gale,
  Jezero, Nordpolen ........ navne på kloden, flyby
    Calderaen, Skrænten .... kun flyby
  Månerne (oversigt) ....... knap i "Prøv selv"
  Phobos, Deimos ........... tryk på månen, flyby
    Mars set fra Phobos .... kun flyby (11 × Næste)
Saturn ..................... listen
  Saturn tæt på ............ knap i "Prøv selv"
  Ringene .................. kun flyby
  Månerne (oversigt) ....... knap i "Prøv selv"
  Enceladus, Titan ......... knap, tryk, flyby
  Mimas, Tethys, Dione,
  Rhea ..................... tryk på månen, flyby
```

**3. Teksten om stedet står i den forkerte boks, og planetens tekst gentager den.**
- Stoppenes tekster (3-5 afsnit om fx Olympus Mons eller Phobos) står i den lille boks nederst til venstre (`Forklaring`). På pc er den skåret af, og på tablet på højkant ligger den uden for skærmen.
- Højre panel viser hele tiden planetens tekst. "Kort fortalt" om Mars fortæller selv om Olympus Mons, Valles Marineris og Hellas.
- "For nørder" om Mars er ca. 6.800 tegn med egne afsnit om Olympus Mons, Tharsis og månerne.
- Det bryder reglen fra [plan-lag.md](plan-lag.md): En tekst står kun ét sted.

**4. Nogle veje er skjult som kontakter eller tekst.**
- Jordens "Månen" er en kontakt, men den flyver et sted hen.
- 22 steder i teksterne står "Tryk 'X'" og peger på en knap et andet sted.
- Solens fremtid slutter med "Prøv Hvid dværg i listen". Siden flytningen til Solsystemet står Hvid dværg ikke i den liste (den er i Kosmos).

**5. "Næste" i flybyen står langt fra det, man kigger på.** Den står i venstre panel, og på tablet på højkant under listen over kloderne. "Næste ›" findes i billedet, men kun med "Kun grafik". Man kan ikke gå et stop tilbage.

**6. Tre knapper styrer tiden hver på sin måde.**
- "Pause" stopper alt.
- "Drej Mars" stopper Mars og månerne. Ved et sted står Mars stille, indtil man slår den til.
- "Drej Jorden" får tiden til at gå ca. 820 gange hurtigere.
- Årstiderne har desuden "Jorden drejer".

## Den nye opbygning

### Fire slags indhold, fire faste pladser
| Slags | Hvad | Hvor |
|---|---|---|
| **Sted** | En klode, en måne eller et sted på en klode. Kameraet flyver derhen | Træet til venstre |
| **Forsøg** | En model i sin egen scene, ikke i den rigtige størrelse (Årstiderne, Formørkelser, Solstorm, Solens fremtid) | Træet, under det sted, det handler om, med mærket "Forsøg" |
| **Tur** | Steder i en bestemt rækkefølge (flybyen, senere "Liv i solsystemet?") | Øverst i træet. Den kører i bjælken på billedet |
| **Styring** | Kontakter og skydere, der ændrer billedet (Navne, Modlys, ×10, Infrarødt, Dato …) | Styr-boksen på billedet |

Det er det samme mønster som i PhET-simuleringerne fra University of Colorado, som er lavet og afprøvet til elever: Kontakter og skydere står i en boks i selve simuleringen, og afspil og pause står forneden.

### Venstre panel: træet
```
[Sol] [Jord] [MARS] [Saturn]
────────────────────────────
▶ Flyby · 13 stop
Mars
STEDER
  Olympus Mons
    Calderaen
    Skrænten
  Tharsis
  Valles Marineris
  Hellas
  Gale · Curiosity
  Jezero · Perseverance
  Nordpolen
MÅNER
  Phobos
    Mars set fra Phobos
  Deimos
```

**Reglerne:**
- **Øverst står kloderne på én række** (som på telefonen i dag). Der er plads til otte planeter (to rækker af fire på pc).
- **Kun den valgte klodes punkter vises**, i grupperne Steder, Måner og Forsøg. Tomme grupper vises ikke.
- **Højst tre niveauer.** Det tredje niveau (Calderaen, "Mars set fra Phobos") vises kun under det sted, man er ved.
- **"Du er her"** har en lys streg i siden og bliver aldrig grå.
- **En gruppeoverskrift kan selv være et sted.** "Måner" viser banerne og afløser knappen "Månerne". "Mars" (klodens navn over grupperne) er hele Mars.
- **Et tryk på et navn på kloden er det samme som et tryk i træet.** Træet lyser op samme sted. Navnene på kloden bliver, nu som en genvej.
- **Flybyen er træet kørt igennem fra en ende af.** Mens turen kører, lyser stedet op i træet, og træet ruller med.
- **Forsøg har et lille mærke** ("Forsøg"), så man kan se, at man forlader de rigtige størrelser og går ind i en model.
- **Hvilke steder man har set, tælles ikke** (jeres svar). "x af 8 set" og den blå prik ved nye punkter bliver, som de er (planeterne og forsøgene).

**Træet for hver klode:**

| Klode | Steder | Måner | Forsøg |
|---|---|---|---|
| Solen | | | Solstorm, Solens fremtid |
| Jorden | | Månen | Årstiderne, Formørkelser |
| Mars | Olympus Mons (Calderaen, Skrænten), Tharsis, Valles Marineris, Hellas, Gale, Jezero, Nordpolen | Phobos ("Mars set fra Phobos"), Deimos | |
| Saturn | Ringene | Mimas, Enceladus, Tethys, Dione, Rhea, Titan | |

Senere uden nye måder at vise tingene på:
- **Overblikket** (trin 2 i [plan-solsystemet.md](plan-solsystemet.md)) bliver øverste niveau, "Solsystemet".
- **"Liv i solsystemet?"** bliver en tur på tværs af planeterne.
- **Planet X** bliver et sted under "Yderst ude".
- **Det dybere lag om Saturns måner** (idé A) bliver månens egen side.
- **"Stå på Mars" (M8)** bliver et punkt under stederne.

**Kosmos** beholder sin flade liste: 11 fænomener i en rækkefølge, der fortæller en historie. Den virker godt.

### Billedet: bjælken, Styr-boksen og tidsknappen
**Bjælken (forneden, hvor underteksten står i dag).** Den viser det, der sker, og det, man kan gøre nu:
- **Tur og trin:**
  - prikker, som man kan trykke på
  - titlen og én linje
  - "‹", "Næste: Calderaen ›" og ✕ (stop)
  - Til sidst i et forsøg med trin: "↺ Forfra".

  Bjælken bruges til flybyen og til alt, der går trin for trin (Big Bang, Årstiderne, Formørkelser, Solens fremtid).
- **Hovedhandlingen:** Når der ikke kører noget, viser bjælken scenens vigtigste knap ("▶ Start flyby", "💥 Send en solstorm", "▶ Start universet").
- **Altid i billedet:** Bjælken står der også med "Kun grafik", så den særlige knap `kosmos-næste` forsvinder.
- **På tablet på højkant** står bjælken lige under billedet, hvor underteksten står i dag. Så er "Næste" altid i synsfeltet.
- **Det er stadig underteksten.** Faser uden knapper (fx supernovaens faser) står i den samme bjælke som i dag.

**Styr-boksen (øverst til højre i billedet).** Scenens kontakter og skydere:
- **Kontakter ligner kontakter:** tændt er fyldt og har ✓, slukket er en tynd kant. De ligner aldrig en knap.
- **Skydere** står med navn og værdi som i dag.
- **Den er åben fra start** på pc og tablet på langs. På tablet på højkant og telefon er den foldet sammen til knappen "Styr", fordi den ellers dækker for meget af billedet.
- **Den gemmer sig ikke for Årstidernes tabel og Formørkelsernes himmel** (`toplag`), som står øverst til venstre.

**Tidsknappen (nederst til højre i billedet):** ⏸ ▶ og ⏩, hvis scenen kan gå hurtigere.
- Den afløser "⏸ Pause", "Drej Mars" og "Drej Jorden". Mellemrumstasten virker som før.
- **Ved et sted på Mars står tiden stille fra start** (som i dag, hvor Mars står stille ved et sted). ▶ lader lyset og skyggerne gå rundt, ligesom "Drej Mars" gør i dag.
- **Jorden:** ⏩ er de ca. 820 gange hurtigere fra "Drej Jorden".
- **Pas på:** Kameraets flyvninger kører i dag inde i fænomenets `opdater` (`rejse.opdater` i mars.js, saturn.js og jordkloden.js). Når tiden står stille, står flyvningen også stille. Et tryk i træet skal derfor flyve, selv om tiden står stille, ligesom kameraets tur i `faenomenskaerm.js` (`kørKameraTur`) allerede gør.

### Højre panel: stedets side
Den samme opbygning for alle steder (planet, måne og sted) og alle fænomener i Kosmos:
1. **Navn, undertitel og 2-4 tal** for netop dette sted (fx Olympus Mons: ca. 22 km høj, ca. 600 km bred).
2. **Lige nu** (kun når der er noget): det, der i dag står i den lille boks til venstre (`forklaring()`). Det er tal, der ændrer sig (tiden efter Big Bang, dato og afstand i Årstiderne), og hvad en kontakt viser (fx "Modlys: Nu står Solen lige bag kanten …"). API'et `forklaring(html)` bliver, men skriver her.
3. **Kort:** 1-3 sætninger, der står fremme.
4. **Emner, man kan folde ud.** Afsnittene har allerede en fed overskrift (Stickney, Rillerne, Står op i vest, Lyset), som bliver til en foldeboks. Hvor det passer, bliver overskriften et spørgsmål ("Hvorfor er Phobos fuld af riller?"). "Hvorfor?"-kortene står ved det emne, de hører til.
5. **Gå videre:** Knapper i stedet for "Tryk X". Det gælder både stedets egne punkter ("Se Olympus Mons ›") og andre dele ("Stjerneovnen ›", "Hvid dværg i Kosmos ›").
6. **For nørder ▸**
7. **Ærligt talt ▸** står altid sidst og samme sted: hvad billedet snyder med, og hvor billeder, højder og tal kommer fra.
8. **Citatet.**

**Planetens side bliver en indgang, ikke et resumé.** Siden om Mars handler om Mars som helhed: størrelsen, farven, døgnet, luften og polkapperne. Den peger videre til stederne i stedet for at fortælle om dem. Afsnittene om de enkelte steder i "For nørder" og "Ærligt talt" flytter ud til stederne ("Ved Olympus Mons", "Ved Tharsis og Valles Marineris", "Månerne" …).

**En kontakt folder sit emne ud.** Slår man fx "Modlys" til, folder emnet om modlys sig ud i siden, og bjælken siger kort, hvad man ser. Det er regel 3 fra [plan-lag.md](plan-lag.md): Kun den boks, der handler om det, der lige er sket, folder sig ud.

### Lagene
| Lag | Hvad | Hvordan |
|---|---|---|
| 1 | Kort tekst og tal (og bjælken i billedet) | Står altid fremme |
| 2 | Emnerne og "Hvorfor?"-kortene | Ét tryk pr. emne |
| 3 | For nørder | Ét tryk |
| Fast plads | Ærligt talt | Ét tryk, altid sidst |

- **Fanerne "Kort fortalt" og "For nørder" forsvinder.** Siden går fra let øverst til dybt nederst og bruger kun foldebokse.
  - Overskrifterne bliver en indholdsfortegnelse, så man kan se, hvad der findes, uden at læse det.
  - En fane, der hedder "For nørder", opfattes let som "ikke for mig".
  - Ulempen er, at siden bliver længere på pc, når mange emner er foldet ud.
- **"Ærligt talt" får sin egen boks.** I dag står den som sidste afsnit i den længste tekst (hos Mars efter 8 andre afsnit). Den er det, AtomLab går mest op i, så den skal være let at finde.
- **Én tekst står ét sted:** Bjælkens linje står ikke igen på siden.

### Toplinjen: vejen dertil
"Solsystemet › Mars › Olympus Mons" afløser undertitlen ("Solen, Jorden, Mars og Saturn"). Man kan trykke på hvert led. På telefonen står kun skærmens navn, som i dag.

### Tablet på højkant og telefon
- **Tablet på højkant:** 3D-billedet øverst og bjælken lige under det. Træet står til venstre og siden til højre (som panelerne i dag). Træet ruller for sig, hvis det er for langt (ved Mars ca. 15 linjer).
- **Telefon på højkant:**
  - Kloderne står på én række (findes).
  - Den valgte klodes punkter står som en vandret række, der kan rulles (som `sol-under` i dag), og det tredje niveau står i en række under.
  - Det afgøres med skærmbilleder i U1.

## Hvad hver knap bliver til
| Hvor | Knap i dag | Bliver |
|---|---|---|
| Alle | ⏸ Pause | Tidsknappen |
| Solen | Jorden ved siden af | Styr: kontakt |
| Solstorm | 💥 Send en solstorm | Bjælken: hovedhandling |
| Solstorm | 🧲 Vis magnetfeltet, 🌬️ Vis solvinden, 🔍 Zoom ind på Jorden | Styr: kontakter |
| Solens fremtid | Næste ›, ↺ Forfra | Bjælken: trin |
| Jorden | Drej Jorden | Tidsknappen: ⏩ |
| Jorden | Månen (kontakt) | Træet: Måner → Månen |
| Årstiderne | Næste ›, ↺ Forfra | Bjælken: trin |
| Årstiderne | Tæt på Jorden, Jorden drejer | Styr: kontakter |
| Årstiderne | Dato | Styr: skyder |
| Formørkelser | Næste ›, ↺ Forfra | Bjælken: trin |
| Formørkelser | Månens fase, Tid på året, Månens afstand, Uden hældning | Styr: skydere og kontakt |
| Mars | Hele Mars, Månerne | Træet: "Mars" og overskriften "Måner" |
| Mars | ▶ Start flyby, Næste: … ›, ■ Stop flyby | Træet (Flyby) og bjælken |
| Mars | Drej Mars | Tidsknappen (▶ og ⏸) |
| Mars | Bjergene 10 gange højere, Modlys, Navne | Styr: kontakter |
| Saturn | Saturn, Månerne, Enceladus, Titan | Træet (alle seks måner og Ringene) |
| Saturn | ▶ Start flyby, Næste, Stop | Træet (Flyby) og bjælken |
| Saturn | Modlys, Navne, Under disen (infrarødt) | Styr: kontakter |
| Kosmos | Knapper, kontakter og skydere i de 11 fænomener | Samme regel: handling og trin i bjælken, kontakter og skydere i Styr-boksen. De sorteres ét for ét i U2 |

## Trinene
Hvert trin får sin egen PR, og I siger go før hvert. Kosmos og Solsystemet deler skallen (`js/faenomenskaerm.js`). Derfor gælder U2 og U3 begge skærme på én gang, så der ikke skal vedligeholdes to måder.

### U1: Træet og stedets side (Solsystemet) · stor
- **Hver klode giver sine steder til træet.** En ny del i fænomenet, fx `træ: [{ gruppe: 'Steder', punkter: [{ id, navn, under: [...] }] }, …]`, og `lav()` giver `gåTil(id)` og `sted()` tilbage.
  - Mars og Saturn har allerede funktionerne: `vælgSted`, `besøgMåne`, `visMåner`, `tilbage`, `flyvTilOverflade`, `vælg(visning)` og `besøg(måne)`.
  - Jordkloden får Månen som sted.
- **Skallen tegner træet** under planetrækken. `solsystem.js` beskriver kloderne og forsøgene, og forsøgene står i gruppen Forsøg med mærket.
- **Knapperne til at gå steder hen fjernes fra "Prøv selv":** Hele Mars, Månerne, Saturn, Enceladus, Titan og Jordens Månen.
- **Flybyen markerer stedet i træet**, og "Calderaen" og "Mars set fra Phobos" kan nås direkte.
- **Højre panels hoved** viser stedet (navn og undertitel). Stedets tekst (`mere`) står i "Lige nu", og den lille boks til venstre flytter over i højre panel. Det sker i begge skærme, fordi skallen er fælles.
- **Vejen i toplinjen.**
- **Tests:** Træet har alle steder, et tryk flyver derhen (`ved()`), flybyen markerer det rigtige punkt, og der er ingen knapper til at gå steder hen under "Prøv selv". Testadgang: `træ()`, `gåTil(id)` og `sted()`.
  - `tests/mars.mjs` (59 steder bruger knapperne) og `tests/saturn.mjs` (26) skal tilpasses.
  - Knapperne findes ud fra deres tekst, ikke deres nummer.

### U2: Styringen på billedet (Solsystemet og Kosmos) · mellem-stor
- **Bjælken:** tur, trin og hovedhandling. Fænomenerne beskriver selv deres trin (fx `trin: { nr, ialt, næste, forrige, forfra }`). Det afløser den skrøbelige søgning efter "Næste" og "▶ Start" i knapteksterne (`opdaterNæste`).
- **Styr-boksen** med kontakter, der ligner kontakter, og skydere.
- **Tidsknappen.** Flyvningerne skal køre, mens tiden står stille (se "Pas på" ovenfor). Mars' "Ved et sted står Mars stille" bliver tidsknappens udgangspunkt dér.
- **"Prøv selv" og pause-knappen i panelet forsvinder.** Kontrollerne i de 11 fænomener i Kosmos sorteres ét for ét.
- **Teksterne, der nævner en knap, der forsvinder** ("Drej Mars", "Månen", "Pause"), rettes med det samme, så de ikke peger på noget, der ikke findes.
- **Tests:**
  - Alle punkter i Styr-boksen er kontakter eller skydere.
  - Bjælken har "Næste" under en tur og står der også med "Kun grafik".
  - Tidsknappen stopper tiden, men ikke flyvningen.
  - Mellemrumstasten virker.
  - `tests/kosmos.mjs`, `kosmos-nye.mjs`, `aarstider.mjs`, `formoerkelser.mjs`, `jorden.mjs` og `pause.mjs` tilpasses.

### U3: Siden i lag (Solsystemet og Kosmos) · mellem, med faktatjek
- **Fanerne bliver til én side med foldebokse:** Kort, emner, For nørder og Ærligt talt.
- **Planeternes tekster deles op.** Det, der handler om et sted, flytter ud til stedet. "Ærligt talt" og "Billederne" bliver deres egne bokse.
- **Tal for hvert sted:** Nye tal skal faktatjekkes (`/faktatjek`). De fleste står allerede i faktatjekkede tekster i `docs/fakta-solsystemet.md`.
- **"Tryk X" bliver til knapper i teksten** (22 steder), og linket til Hvid dværg rettes (`data-gaa="kosmos:hviddvaerg"`).
- **Tekst, der flytter og bliver kortere, læses igennem**, så sammenhængen holder (tjekliste B i [erfaringer.md](erfaringer.md)).
- **Tests:**
  - Hver side har "Ærligt talt".
  - Bjælkens linje står ikke på siden.
  - En kontakt folder sit emne ud.
  - `tests/lag.mjs` og `ordforklaring.mjs` tilpasses (fagordene skal stadig markeres i de nye bokse).

### U4: Resten af AtomLab · lille-mellem
- **Den samme tidsknap** i Stjerneovnen (Pause og Langsom, Normal og Hurtig) og Reaktoren. I Batteriet betyder "Pause" noget andet (ingen strøm), så dér bliver den.
- **Kontakter ligner kontakter overalt** (fx "Elektronsky"/"Ringe").
- **"Næste skridt" i Stjerneovnen, Reaktoren og Batteriet bliver**, som det er. Det handler om opgaver, ikke om en tur.

## Model og effort
- **Planen** er denne fil. Der skal ikke laves en særskilt plan eller bruges Fable først. Det er opbygningen af UI'et, ikke svær fysik eller nye fakta, og koden kender vi.
- **Bygningen laves af Opus.** U1 og U2 ændrer den fælles skal, som 19 fænomener bruger, og mars.js har meget tilstand (flyvninger, flyby, måner og tid). En fejl dér er dyr og svær at se. U3 er danske tekster. Begge dele er Opus' opgaver efter CLAUDE.md.
- **Billigere modeller:** kun Haiku til at opsummere lange testlogs (som altid). En hjælpeagent starter forfra og skal læse det hele igen, og her er det meste af prisen at forstå koden. Derfor ville en billigere model ikke spare meget, og den ville risikere fejl i den fælles skal. Den største besparelse kommer et andet sted fra: få skærmbilleder (kun de størrelser, hvor layoutet kan gå galt) og `--ændret` i stedet for hele testsamlingen undervejs.
- **Effort:**
  - **høj** til U1 og U2 (fælles skal og Mars' tilstand)
  - **medium til høj** til U3 (høj til faktatjekket af stedernes tal)
  - **medium** til U4

  Ingen grund til xhigh.
- **Valgfrit:** Har I credits til Fable senere, er et eftersyn efter U3 (F4 i [plan-fable.md](plan-fable.md)) et godt sted at bruge dem. Fable er stærkest til at bedømme skærmbilleder og UI.

## Rækkefølgen i forhold til Mars M8
**Anbefaling: U1 og U2 før M8 (Stå på Mars).**
- M8 giver nye steder og nye knapper ved Mars. Bygges M8 først, kommer de ind i det gamle "Prøv selv" og skal flyttes bagefter.
- Med træet er "Stå på Mars" bare et nyt punkt under Steder.

U3 og U4 kan komme før eller efter M8.

## Status for U1 (30. oktober 2026)
Lavet, som planen siger. Afgjort undervejs:
- **Månen står under Måner ved Jorden**, ikke under Steder.
- **Forsøgenes mærke er gruppens overskrift** ("Forsøg"), ikke et mærke på hvert punkt.
- **"▶ Start flyby" bliver under "Prøv selv"** til U2, hvor den flytter til bjælken. Flybyen står ikke i træet endnu, for så ville knappen stå to steder. Turen markerer stedet i træet.
- **Ved et sted** viser højre panel stedets navn, "Lige nu" med stedets tekst og kloden under "Om Mars". Klodens tal skjules, til stederne får deres egne tal i U3.
- **Telefon på højkant:** Træet er rækker af små punkter, og gruppernes navne står på deres egen linje.
- **En måne fra træet** glider hen, hvor flybyen stiller den (den korteste vej i banen), mens kameraet flyver derhen. Det giver det samme billede som på flybyen. "Mars set fra Phobos" flyver først til Phobos, hvis man ikke er der.
- **Et tryk i træet under flybyen** stopper turen og flyver derhen.

**Flettet med Mars M8a** (30. oktober 2026, bygget i en anden session samtidig): Stederne, man kan stå ved Gale, står i træet på tredje niveau ("🧍 Naukluft" og "🧍 Hos Curiosity"). "↑ Tilbage i kredsløb" og "Gå til …" er fjernet fra "Prøv selv", for Gale og det andet sted står i træet, og et tryk på et hvilket som helst andet sted letter først. "🧍 Stå på Mars" bliver ved Gale som en handling (flyttes til bjælken i U2). Skyderen, "Lad dagen gå" og "Solnedgang" bliver under "Prøv selv" til U2. M8b og M8c (Jezero og et sted mere) skal bruge det samme: et punkt pr. sted under krateret i `TRÆ` (det sker af sig selv ud fra `LANDSKAB`).

## Status for U2 (31. oktober 2026)
Lavet, som planen siger, i begge skærme på én gang (den fælles skal `js/faenomenskaerm.js`). "Prøv selv" og pauseknappen i panelet er væk. Afgjort undervejs:
- **Flyvningerne under pause:** "Pas på" ovenfor var allerede løst: Kameraets rejse kører i Mars, Saturn og Jorden i deres egen opdatering hvert billede (`verden.opdateringer`), ikke i fænomenets `opdater`. Derfor flyver kameraet, også når tiden står stille. Nu slår et tryk i træet ikke længere pausen fra, og to nye tjek (Jorden og Saturn) viser, at kameraet flyver under pause uden at spole.
- **Prikkerne** står stadig i underteksten (ikke i bjælken), men man kan trykke på dem, når fænomenet har trin. Så fylder bjælken én linje mindre. Bjælken har "‹", "Næste: … ›", til sidst "↺ Forfra" og på flybyen ✕.
- **Big Bang og Solens fremtid** bygges op trin for trin. Et spring tilbage starter forfra og går frem igen, og Solens fremtid spoler de sprungne trin igennem (ellers bliver tågen aldrig blæst af).
- **Flybyen** står øverst i træet ("▶ Flyby · 13 stop", lyser, mens den kører) og som "▶ Start flyby" i bjælken, når den ikke kører, så den også kan startes med "Kun grafik". Ved det sidste stop er turen slut som før (der er ingen "‹" dér). Et spring med "‹" eller en prik flyver derhen som fra træet (månerne glider på plads).
- **Tiden ved Mars:** Ved et sted står tiden stille fra start, ved en måne og hele Mars går den. Før blev Mars stående, når man fløj fra et sted tilbage til hele Mars. Nu drejer den igen.
- **Stå på Mars:** Når man lander, står tiden stille, og ▶ lader dagen gå (før "▶ Lad dagen gå", et døgn på 150 sekunder). Der er ingen ⏩, for 1 gang den rigtige fart ville ikke kunne ses. "Klokken på Mars" står i Styr-boksen og "🌅 Solnedgang" i bjælken. Solnedgang lader tiden gå, så man ser Solen gå ned. Flybyen kan ikke startes, mens man står.
- **Jorden:** ▶ er den rigtige tid og ⏩ ca. 800 gange hurtigere (før "Drej Jorden"). Kun Jorden har ⏩.
- **Årstiderne:** "Jorden drejer" er blevet til tidsknappen. Under pause står Jorden stille, men glider stadig hen til datoen på skyderen (`altid`).
- **Kosmos:** Reglen fra skallen sorterer selv: handlinger i bjælken, kontakter og skydere i Styr-boksen. "↺ Forfra" og "↺ Ny …" dukker først op, når der er sket noget (`skjul`). Pulsarens tre lyde står i bjælken.
- **Styr-boksen** er åben på pc og tablet på langs og foldet sammen på tablet på højkant og telefoner (også telefon på langs).
- **Pausemærket** midt forneden er væk i Kosmos og Solsystemet, for tidsknappen viser det.
- **Tidsknappen** har små tegnede ikoner, fordi ⏸ blev vist meget lille i nogle skrifttyper.
- **Tests:** Knapperne findes ud fra teksten (`trykPå`), også i billedværktøjerne. Nye tjek: Styr-boksen har kun kontakter og skydere, en tændt kontakt har ✓, bjælken står der med "Kun grafik", ‹ og prikkerne (Big Bang, Solens fremtid, Årstiderne, Saturns og Mars' flyby), tidsknappen stopper uret, men ikke flyvningerne, mellemrum går tilbage til ⏩, og Styr-boksen er foldet sammen på højkant.

## U3: Stedernes tal (31. oktober 2026, jeres svar: "Go til dine anbefalinger")
2-4 tal pr. sted, som foreslået. Næsten alle stod allerede i faktatjekkede tekster. Tal med * stod ikke i en tekst og blev faktatjekket (`docs/fakta-solsystemet.md`, "Faktatjek U3"). Tigerstriberne blev rettet til ca. 130 km.

**Mars**
| Sted | Tal |
|---|---|
| Olympus Mons | Højde: ca. 22 km over landet omkring · Bredde: ca. 600 km · Areal: ca. 7 × Danmark |
| Calderaen | Størrelse: ca. 65 × 80 km · Dybde: op til ca. 3 km · Kratere: mindst 6 · Alder: ca. 100-400 mio. år |
| Skrænten | Højde: op til ca. 8 km · Her: ca. 8 km ned på ca. 20 km · Skredene: op til ca. 750 km ud |
| Tharsis | Bulen: ca. 5.000 km bred · Vulkanerne: ca. 14-18 km over nulpunktet · Mellem dem: ca. 700-800 km · Til Olympus Mons: ca. 1.600 km |
| Valles Marineris | Længde: ca. 4.000 km · Dybde: op til ca. 10 km · Bredde i midten: op til ca. 600 km · Alder: ca. 3,5 mia. år |
| Hellas | Bredde: ca. 2.300 km · Laveste sted: ca. 8,2 km under nulpunktet · Lufttryk: op til ca. 2 × nulpunktets · Alder: ca. 4 mia. år |
| Gale | Bredde: 154 km · Mount Sharp: ca. 5 km over bunden · Curiosity landede: 6. august 2012 · Curiosity har kørt: ca. 38 km |
| Jezero | Bredde: ca. 45 km · En sø: for over 3½ mia. år siden · Perseverance har kørt: over 45 km · Prøver: 30 rør |
| Nordpolen | Iskappen: ca. 1.000 km bred · Tykkelse: op til ca. 3 km · Mest: frossent vand · Solen om sommeren: ca. 22-28° oppe |
| Månerne | Phobos rundt: 7 t 39 min · Deimos rundt: ca. 30 timer · Opdaget: 1877 |
| Phobos | Længde: ca. 26 km · Over Mars: ca. 6.000 km · En omgang: 7 t 39 min · Stickney: ca. 9 km |
| Mars set fra Phobos | Mars på himlen: ca. 42° bred · Mod Månen hos os: ca. 80 gange bredere · Vi står: ca. 300 m over Phobos (i programmet) |
| Deimos | Længde: ca. 16 km · Fra Mars' midte: ca. 23.500 km · En omgang: ca. 30 timer · Mars på himlen: ca. 17° |
| 🧍 Naukluft | Til toppen af Mount Sharp: ca. 50 km · Horisonten: ca. 3,4 km væk (fladt land) · Curiosity var her: april 2016 |
| 🧍 Hos Curiosity | Curiosity har kørt: ca. 38 km · Højere end landingen: ca. 1 km · På Mars siden: august 2012 |

**Saturn**
| Sted | Tal |
|---|---|
| Ringene | Bredde: ca. 70.000 km · Tykkelse: mange steder ca. 10 m · Is: over 95 % · Cassini-delingen: ca. 4.600 km |
| Månerne | Kendte måner: over 280 (2026) · Nærmest af de store (Mimas): ca. 185.500 km · Længst ude (Titan): ca. 1,22 mio. km* |
| Mimas | Bredde: 396 km · Herschel: ca. 140 km · En omgang: ca. 22½ timer* · Fra Saturn: ca. 185.500 km |
| Enceladus | Bredde: 504 km · Kaster lyset tilbage: ca. 80 % · Tigerstriberne: 4, hver ca. 130 km lang* · Fra Saturn: ca. 238.000 km* |
| Tethys | Bredde: 1.062 km · Odysseus: 445 km · Ithaca Chasma: over 1.000 km lang · Tæthed: næsten som vand |
| Dione | Bredde: 1.123 km · Isklipperne: flere hundrede m høje · En omgang: ca. 2¾ døgn* · Fra Saturn: ca. 377.400 km* |
| Rhea | Bredde: ca. 1.530 km · Is: måske ca. ¾ · En omgang: ca. 4½ døgn · Fra Saturn: ca. 527.000 km |
| Titan | Bredde: ca. 5.150 km* · Lufttryk: ca. 1,5 × Jordens · Ved jorden: ca. −179 °C · En omgang: ca. 16 døgn* |

**Jorden**
| Sted | Tal |
|---|---|
| Månen | Bredde: ca. 3.470 km · Afstand: ca. 384.400 km (i snit) · En omgang: ca. 27 døgn · Fra fuldmåne til fuldmåne: ca. 29½ døgn |
| Jorden (kloden) | Månens to tal flytter til Månen. I stedet: Et år: ca. 365¼ døgn* · Aksen hælder: ca. 23,4° |

Planeternes tal (Solen, Mars, Saturn) og de 15 forsøg og fænomener i Kosmos beholder deres tal.

## Status for U3 (31. oktober 2026)
Lavet, som planen siger, i begge skærme på én gang. Jeres svar ved go: "Go til dine anbefalinger":
- **Ved et sted viser højre panel kun stedets egen side.** "Om Mars" under stedet er væk. Man kommer tilbage til Mars med træet eller vejen øverst.
- **For nørder, Billederne og Ærligt talt huskes** for alle sider (har man foldet en ud, står den åben på de næste sider). Emnerne starter altid foldet sammen.

Afgjort undervejs:
- **Teksterne til Mars, Saturn og Jorden** står i `js/data/sider/` (planetens side og en side for hvert sted i træet). Fænomenerne i Kosmos og forsøgene har deres side i deres egen fil.
- **Stedernes undertekst** (bjælkens linje, fx "Den største vulkan, vi kender i solsystemet …") er den samme som før. Siden har et nyt Kort, der ikke gentager den. Ved et besøg på en måne fra 3D-billedet (et tryk på månen) står månens undertekst nu også, som når man vælger den i træet.
- **"Lige nu"** viser kun det, der ændrer sig: tiden ved Jorden, Månen, der er flyttet ud af Mars' skygge, Årstidernes dato, Big Bangs tid, Solens fremtid, supernovaens lag og "Turen er slut". Kontakternes forklaringer (fx Modlys og "Bjergene 10 gange højere") er blevet til emner, der folder sig ud, når kontakten slås til.
- **Knapper i teksten** (`js/sideknap.js`): et sted, en kontakt (viser, om den er tændt), en handling (grå, når den ikke kan bruges), tidsknappen, et fænomen og en anden del. "Tryk X" og "i listen" står ikke længere i teksterne.
- **Et link kan pege på et sted:** `data-gaa="solsystem:mars:olympus"`. Ordbogens "skjoldvulkan" og "caldera" peger nu på Olympus Mons og Calderaen, hvor ordene står.
- **Fagord** markeres i hver foldeboks for sig (`.side-del`), så ordet er markeret i den boks, man åbner.
- **Iapetus:** Saturns tredjestørste måne (ca. 1.470 km) er ikke med, selv om teksterne talte om "de seks store måner". Det står nu i "Ærligt talt" ved Månerne, og oversigten siger "seks af Saturns største måner". Den kan komme med senere.
- **Tests:** `kosmos` (siden, knapperne, kontakten folder emnet ud, underteksten står ikke på siden), `solsystem` (alle steder i træet har en side med 2-4 tal og "Ærligt talt" sidst, knapperne virker, links til Hvid dværg og til et sted), `ordforklaring` (fagord i boksene), `mars`, `saturn`, `jorden`, `landskab`, `reaktor` og `ordbog`.

## Status for U4 (31. oktober 2026)
Lavet, som planen siger. Jeres svar ved go: "Go", og I vurderer selv til sidst.
- **Tidsknappen i Stjerneovnen og Reaktoren:** Den samme tidsknap som i Kosmos (`lavTidsknap`) står nederst til højre i 3D-billedet. "⏸ Pause" og tempoknapperne i venstre panel er væk, og det samme er pausemærket midt forneden (tidsknappen viser det). `lavPause` findes ikke længere.
- **Stjerneovnens tre tempoer (valget):** Tidsknappen har fået en fjerde tilstand, ▷ langsom, mellem ⏸ og ▶: **⏸ · ▷ 0,3 · ▶ 0,6 · ⏩ 3**. Grunden:
  - Intet går tabt. Alle tre tempoer er der stadig, og de står ét sted i den rækkefølge, de går (stille, langsomt, normalt, hurtigt).
  - Tempoet er tid, og tiden hører til på tidsknappen. Som kontakt i panelet ("Langsom" til/fra) ville to ting styre tiden, og man skulle tænke over, hvad "Langsom" og ⏩ på samme tid betyder.
  - Mellemrum virker som før: Det skifter mellem ⏸ og det tempo, tiden gik med før (fx ⏩). Det er den samme regel som ved Jorden i Solsystemet.
  - Andre steder er ▷ skjult (`langsom(null)`), så Kosmos og Solsystemet ser ud som før.
  - Ulempen: ▷ (en tom trekant) er ikke et kendt tegn. Titlen siger "Langsommere: slowmotion", og hjælpen forklarer de fire knapper. Synes I, den er svær at forstå, kan den blive til en lille snegl eller et "½".
- **Knapper, der starter noget, lader tiden gå:** I Stjerneovnen et skud (også et klik, når tiden står stille) og "Vis mig". I Reaktoren "Skyd neutron", "Start reaktoren" og "Vis mig". De går tilbage til det tempo, man havde valgt (`fortsæt`), ikke altid til ▶. "Vis mig" kører stadig i slowmotion (Stjerneovnen 0,25, Reaktoren `tidsFaktor`), og vælger man et andet tempo imens, gælder det, når "Vis mig" er færdig.
- **Reaktoren:** ⏸ ▶ (ingen ⏩). Under pause står kædereaktionen stille, men stavene kan stadig flyttes, som før.
- **Under rejsen ind i Solen** er tidsknappen skjult, og mellemrum springer rejsen over, som før.
- **Kontakter ligner kontakter overalt** (`js/kontakt.js`, samme udseende som i Styr-boksen, med en kant om, fordi de står for sig selv). Fundet med grep efter knapper, der skifter tekst eller får `valgt` ved til/fra:
  - "Elektronsky" i Værkstedets toplinje og på grundstofkortet (før skiftede knappen mellem "Elektronsky" og "Ringe" og viste det, man kunne skifte til. Nu står der altid "Elektronsky", og ✓ betyder, at skyen vises).
  - "Vand (moderator)" i Reaktoren (før "Vand (moderator): til/fra").
  - "Snyd laderen (farligt!)" i Batteriet (før "Snyd laderen: fra/TIL (farligt!)"). Den er rød, når den er tændt.
  - **Ikke ændret:** Ikonknapperne i toplinjen (🔊, panelerne og fuld skærm) er små ikoner, hvor et ✓ ikke ville passe. Valg mellem flere ting (Batteriets Oplad/Aflad/Pause og Hastighed, Reaktorens kerne og neutronfart, filtrene, udgaverne og kategorikortets forsøg) er ikke til/fra og bliver valgknapper. Batteriets "Pause" bliver, for den betyder "ingen strøm".
- **"Næste skridt"** i Stjerneovnen, Reaktoren og Batteriet er, som det var.
- **Teksterne:** Hjælpen i Stjerneovnen forklarer de fire knapper, og hjælpen i Reaktoren og opgaven "Lav 5 heliumkerner" peger på tidsknappen i stedet for "Pause" og "tempoet".
- **Tests:** `pause` (tidsknappen i Reaktoren og Stjerneovnen: pause, ▶, mellemrum tilbage til ⏩, de fire tempoer, at et skud, "Skyd neutron" og "Vis mig" lader tiden gå, at "Vis mig" stadig er slowmotion, og at "Vand" er en kontakt), `stjerneovn` og `stjerneovn-mus` (tidsknappen, også skjult under rejsen), `system` og `vaerksted` ("Elektronsky" er en kontakt med ✓) og `batteri` ("Snyd laderen" er en kontakt).

## Afgøres undervejs (med skærmbilleder)
- ~~**Styr-boksen:** Er den åben eller foldet fra start på tablet på langs?~~ Åben (U2).
- ~~**Tallene for hvert sted:** Hvilke 2-4 tal skal stå (U3)?~~ Se "U3: Stedernes tal".

## Ikke afprøvet (skal prøves på tabletten efter hvert trin)
- Kan man ramme punkterne i træet med fingeren, og er det tydeligt, hvor man er?
- Forstår man, at flybyen går gennem træet?
- Er Styr-boksen let at finde, og dækker den for meget på højkant?
- Er "Næste" i bjælken let at ramme? Kan man ramme prikkerne i underteksten med en finger (de er små)?
- Forstår man tidsknappen (⏸ ▶ ⏩), og at tiden står stille ved et sted på Mars?
- U4: Forstår man ▷ (langsom) i Stjerneovnen? Er de fire små knapper lette at ramme med en finger?
- U4: Ser "Elektronsky", "Vand (moderator)" og "Snyd laderen" ud som kontakter, og er det tydeligt, at ✓ betyder "til"?
