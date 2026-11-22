# Historik: Forløb

*Det forrige "Senest lavet" fra [lige-nu/forloeb.md](../../lige-nu/forloeb.md), det nyeste øverst.*

**Senest lavet (18. november 2026): Grundstoffet flyver hjem** (E20 fund 8, rettelse D i [prompt-e20-rettelser.md](../prompt-e20-rettelser.md), stilguiden C2). Det første grundstof ender ikke længere stille i loggen under "Dit første atom":
- Når et nyt grundstof er opdaget i Værkstedet, flyver et lys fra atomet til dets felt i det lille periodiske system. Feltet tændes med et lille "ting" (`lyd.tændes`), og tælleren går fra fx 0 til 1 af 118, først når lyset lander (`js/vaerksted-hjem.js`).
- Er tabellen ikke fremme (under turen, foldet sammen eller rullet væk), flyver lyset til tælleren eller til et lille mærke øverst i scenen ("Nyt grundstof: Hydrogen · Opdaget: 1 af 118"), til venstre for pillerne. Mærket ligger i scenens lag, så Forløb-linjen står stille, og det tager ikke fokus. Det går væk efter ca. 3 s.
- Med "reducer bevægelse" tændes feltet uden flyvning. Pillen "Nyt grundstof" er som før (dæmpet under en tur).
- Tests: `vaerksted` (lyset til He, tælleren 0 → 1, uden lys med "reducer bevægelse") og `forloeb` (hydrogen til mærket, linjen står stille). Det forrige "Senest lavet" står i [arkiv/historik/forloeb.md](../arkiv/historik/forloeb.md).

**Senest lavet (17. november 2026): Turene er lettere at finde** (jeres ønske: "Jeg tror mange vil overse dem" i "↻ Tur"). Af fire forslag valgte I to:
- **Prikken på "↻ Tur"** (`lavTurKnap` i `js/forloeb.js`, alle dele med en tur): En lyseblå prik, der pulserer tre gange, så længe en af delens ture ikke er taget (også efter "Udforsk selv"). Listen skriver "Ny" ved den, og knappen opdateres, når turen bliver taget.
- **Turene i listen til venstre** (`js/faenomenskaerm.js`, Kosmos og Solsystemet): "▶ Tur: Rejsen i tid ✓" og "▶ Tur: Hvordan kan det ske?" under "Tid" (med prikken, som et fænomen, man ikke har set), og "▶ Tur: Rundt om Solen" øverst i overblikket, som Flybyen ved planeterne. Et tryk starter turen. Liv havde allerede sine ture i venstre panel.
- **Ikke valgt nu** (i [ideer.md](../ideer.md), "På tværs af verdenerne"): et vink i linjen under scenen og turene i menuen ved hver verden.
- Tests: `tid-forloeb` (listen, prikken, "Ny" og et tryk i listen) og `solsystem` (overblikkets træ). Det forrige "Senest lavet" står i [arkiv/historik/forloeb.md](../arkiv/historik/forloeb.md).

**Senest lavet (16. november 2026, E14-rettelserne før prøven, prompten i [prompt-e14-rettelser.md](../../prompt-e14-rettelser.md)):**
- **"Dit første atom"** med Fables tekster ([E14](../../fable/E14-forloeb-eftersyn.md), [noterne](../../fable/E14-noter.md)): Trin 2 siger nu, at elektronen er minus. Trin 3 siger, at kernen ryster, og "i virkeligheden" holder to protoner ikke sammen (de to ting står ved siden af hinanden, fælden holdt). Trin 5's Spørg siger kernesætningens anden halvdel: "Grundstof nr. 1 og 2 lyser: én proton og to protoner." (Fables tekst uden "nu", så den holder 16 ord.) Trin 2's Så er forkortet til "universets mest almindelige grundstof" (Fables var 23 ord).
- **Vinket i trin 4:** Lægger han begge neutroner i før elektronen, siger linjen "Kernen har to plus. Giv atomet en elektron mere, så der er lige mange plus og minus." Tællerne viste allerede, at elektronen mangler, men ikke hvorfor. Testen `forloeb` tjekker vinket.
- **Prøven:** [guide-proeven.md](../../guide-proeven.md) har rækkefølgen, de nye spørgsmål pr. forløb, spørgsmålet næste dag og listen, der afløser E4's otte ting at se efter. Drejebogens spørgsmål 3 er skiftet ud.

**Senest lavet (12. november 2026, Serie 1 nr. 1, prompten i [arkiv/prompt-forloeb.md](../arkiv/prompt-forloeb.md)):**
- **Forløb-klodsen** `js/forloeb.js` med teksterne som data i `js/data/forloeb/` (koden: [kode/forloeb.md](../kode/forloeb.md)). Linjen står under scenen: prikker, Spørg eller Så, gættet, trinets knap, "Vis mig" efter 20 sekunder, "‹", "Næste ›" og "Spring over". Panelerne, opgaverne og kontakterne er skjult (klassen `i-forløb`, virker også i Liv). Til sidst "Det så du" med kernesætningen og tre veje. Huskes i `atomlabFremgang.forløb`, ✓ i "Din fremgang" (et tryk starter det), eget link `?forloeb=foerste-atom#vaerksted`.
- **"Dit første atom"** i Værkstedet efter [drejebogen](../drejebog-foerste-atom.md) (fem trin, faktatjekket: trin 3 sagde for meget om frastødningen, rettet). Starter af sig selv første gang, tages igen fra opgavelisten (★) og hjælpen (?). Hydrogen og helium tæller som opdaget, og trin 3 er helium uden neutroner (opgaven "to protoner" bliver løst).
- **Indgangen:** Toplinjen i Værkstedet giver opgaven sin egen række under 1400 px (før forsvandt teksten ved 1280 px, og P, N, E og Tip lå oven i "Elektronsky" på tabletten på langs). Ny undertitel i menuen. Isotoperne kommer efter carbon, oxygen og neon. Fem nye ord i Ordbogen (proton, neutron, elektron, atomkerne og grundstof), med prikker kun i forløbets linje.
- Ny test `forloeb` (8 tjek).

