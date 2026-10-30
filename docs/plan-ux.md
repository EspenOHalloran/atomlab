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
| Jorden | Månen | | Årstiderne, Formørkelser |
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
| Jorden | Månen (kontakt) | Træet: Steder → Månen |
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

## Afgøres undervejs (med skærmbilleder)
- **Telefon på højkant:** Står punkterne som en vandret række, eller som en kort liste?
- **Styr-boksen:** Er den åben eller foldet fra start på tablet på langs?
- **Forsøgenes mærke:** Er det et ord ("Forsøg") eller et lille ikon?
- **Tallene for hvert sted:** Hvilke 2-4 tal skal stå (U3)?

## Ikke afprøvet (skal prøves på tabletten efter hvert trin)
- Kan man ramme punkterne i træet med fingeren, og er det tydeligt, hvor man er?
- Forstår man, at flybyen går gennem træet?
- Er Styr-boksen let at finde, og dækker den for meget på højkant?
- Er "Næste" i bjælken let at ramme?
