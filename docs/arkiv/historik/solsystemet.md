# Historik: Solsystemet og Kosmos

*Det forrige "Senest lavet" fra [lige-nu/solsystemet.md](../../lige-nu/solsystemet.md) flyttes hertil ordret, nyeste øverst (fra 7. november 2026). Det, der er ældre, står i den lukkede [historik.md](../historik.md).*

**Senest lavet (9. november 2026): Venus V1, jorden og skelettet.** Jeres go: "Læs docs/prompt-venus.md og kør V1."
- **Venus står i Solsystemet** mellem Solen og Jorden (halvfærdig, som aftalt): Magellans radarkort med højderne (`klippeplanet.js` som Mars), tonet orange, for radaren ser ikke farver. "Bjergene 10 gange højere" og "Modlys". En kort side, der siger ærligt, at skyerne kommer snart.
- **Venus står, som den gør i dag:** Aksen peger mod IAU's nordpol, drejningen følger IAU's formel, og Solen følger banen. Punktet under Solen passer med JPL Horizons inden for 0,02°. Venus drejer baglæns, og Solen står op i vest (prøv ⏩: et døgn i sekundet).
- **Kortene:** `lav_venus.py` (radar 8k/4k/2k, højder 4k/2k). Ca. 3 % af overfladen mangler (mest ved sydpolen) og er fyldt blødt. Mørke sømme mellem Magellans strimler og et spring på ca. 120 m ved 180° i højderne er rettet.
- **Tests:** `tests/venus.mjs` (26 tjek). Koden står i [kode/venus.md](../kode/venus.md), erfaringerne i [erfaringer/venus.md](../erfaringer/venus.md).
- **Spørgsmål til jer:** Ingen. `darts.isas.jaxa.jp` svarede i dag, så Akatsukis kort kan nok bruges i V2.

**Senest lavet (9. november 2026): Planen for Venus.** Jeres go: "Skriv planen for Venus efter mønstret fra plan-uranus-neptun.md."
- **Planen:** [plan-venus.md](../plan-venus.md) med kilderne (tjekket med curl), to lag (skyerne udenpå og Magellans radarkort med højder indeni), otte signatur-effekter, flybyen med 6 stop, himlen og delopgaverne V1-V5 (V6 er valgfri). Faktagrundlaget med kilder står i [fakta-solsystemet/del7-venus.md](../fakta-solsystemet/del7-venus.md) med 14 fælder.
- **Kilderne:** Magellans kort ligger frit hos USGS (radar 2 km og 225 m pr. pixel, højder 4,6 km). Venera 13's farvepanorama og Parker Solar Probes billeder af natsiden er public domain. Akatsukis kort over skyerne ligger i `darts.isas.jaxa.jp`, som er lukket.
- **Jeres svar (9. november 2026):** "Vi følger dine anbefalinger." Svarene står i planen under "Jeres svar". Prompten er [prompt-venus.md](../prompt-venus.md).
- **Til jer før V2:** Åbn `darts.isas.jaxa.jp` i miljøets Network access (Akatsukis kort over skyerne).

**Senest lavet (8. november 2026): Uranus lukket for nu (bedre kort over planeten og månerne).** Jeres go: "Læs docs/prompt-uranus-kort.md og kør".
- **Månerne:** Kortene er nu JPL's originaler i 1440 × 720 (før Commons' småbilleder i 1280 × 640), hentet som TIF fra NASA 3D Resources på GitHub (Commons svarede stadig 429). Oberon har ikke længere JPEG-blokke. Det er ca. 12 % flere pixel, så forskellen er lille at se.
- **Et skarpere Miranda-kort blev prøvet og givet op:** USGS' mosaik set fra sydpolen (PIA01490) blev lagt præcist på kortet, men JPL's kort havde lige så mange eller flere detaljer. Det er allerede på højde med Voyagers bedste billeder af hele Miranda (ca. 0,5 km pr. pixel mod 560-740 m), så et større kort giver intet.
- **Planeten:** Der findes ikke noget bedre kort med fri licens. Den sydlige halvdel vender væk fra Solen og Jorden (sydpolen er i mørke til jævndøgnet omkring 2049), USGS har kun et malet kort uden fri licens, Kecks og Geminis kort er i infrarødt lys, og jeg fandt ingen fri licens, og Webb er ikke skarpere end Hubble. Hubbles kort og shaderens bånd bliver.
- **Senere:** USGS (Patthoff m.fl.) er ved at lave nye mosaikker og højdekort over de fem måner ud fra Voyagers billeder (GSA 2025). Tjek planetarymaps.usgs.gov, før månerne-runden starter.
- **Spørgsmål til jer:** Ingen.

**Senest lavet (8. november 2026): Uranus og Neptun UN5, flybyerne, stederne og siderne. Serien UN1-UN5 er færdig.** Jeres go: "Go" og anbefalingerne på de tre åbne spørgsmål.
- **Uranus' flyby (5 stop):** Oversigten i dag, "Et år er 84 år" set fra siden, mens skyderen **År** kører tilbage til januar 1986, Miranda med Voyagers billeder i sollys, de mørke ringe (med epsilon-ringen foran Uranus, prøv "Infrarødt") og "I Uranus' skygge", hvor støvet lyser. Skyderen står på 1986 bagefter.
- **Neptuns flyby (4 stop):** Oversigten, de hurtigste vinde, Den Store Mørke Plet i formiddagssol ("Neptun i 1989" slås til) og ringbuerne i modlys. Neptun har fået **"Infrarødt (som JWST)"**.
- **"Steder" i træet:** Uranus' nordpol og ringe, Neptuns plet og ringbuer, hver med sin egen side. **Nye emner** (opdagelserne, farven, hvorfor Uranus ligger på siden, Neptuns vinde, Triton), to "Hvorfor?"-kort og "isgigant" og "ringbue" i Ordbogen. Alt faktatjekket. **Rettet:** "Ringene kaster 1,5 % af lyset tilbage" er nu "højst ca. 2 %" (samme fælde som ved Ariel).
- **Spørgsmål til jer:** Ingen nye. Triton og Neptuns gejsere (UN6) venter til månerne-runden, som I har besluttet.

**Senest lavet (8. november 2026): Uranus og Neptun UN4, Uranus' måner.** Jeres go: "start un4".
- **De fem store måner** (Miranda, Ariel, Umbriel, Titania og Oberon) med Voyager 2's kort (Caltech/JPL/USGS, public domain, fundet på Wikimedia Commons, som nu er åben). Voyager så kun den sydlige halvdel, så den nordlige er en blød, grå flade ("aldrig fotograferet tæt på"). Den halvdel har sol nu, så træk **År** til 1986 ved en måne: Kameraet følger Solen, og man ser Voyagers billeder.
- **Banerne** (NSSDC) i Uranus' ækvatorplan som en skydeskive, den rigtige vej (med uret om IAU's nordpol, som Uranus drejer), Miranda hælder 4,3°, alle vender samme side mod Uranus. Den rigtige størrelse ved en måne, større langt væk. Skygger begge veje, navne, tryk på en måne og "Måner" i træet med sider (faktatjekket, 14 påstande).
- **"Små måner":** Cressida, Desdemona, Cupid og Belinda som små, grå klumper (formen tegnet, 5 gange lysere end de er). Cressida indhenter Desdemona ca. hver 22. døgn (⏩).
- **Spørgsmål til jer:** (1) Ved et besøg i 2026 er månen en grå kugle, for den side, der har sol nu, er aldrig fotograferet. Skal besøget i stedet starte i 1986 (så man ser Voyagers billeder med det samme), eller skal det blive ved den ærlige grå og "Træk År til 1986"? Anbefaling: lad det være, og lad flybyen (UN5) vise en måne i 1986. (2) Spørgsmålene fra UN3 (Uranus i "Voyagers farver" og "Infrarødt" ved Neptun) og UN2 (kameraet ved skyderen) står stadig.

**Senest lavet (8. november 2026): Uranus og Neptun UN3, Neptuns vejr og ringbuer.** Jeres go: "start un3".
- **Høje, hvide skyer** af metan-is i bånd ved de breddegrader, Voyager så dem. De kaster blålige skygger ca. 50 km under sig (som på Voyagers foto), som ses tæt på ved grænsen mellem dag og nat. Skyerne er tegnet, og der er få i 2025 (de forsvandt næsten i 2019).
- **Kontakten "Neptun i 1989":** Den Store Mørke Plet (22° S, 13.000 km lang, med den lyse sky ved kanten), Scooter og den lille mørke plet D2 ved de rigtige breddegrader og med Voyagers målte omgange, så de driver fra hinanden. Flere skyer og buerne, som de var i 1989.
- **"Voyagers farver (1989)"** (dybblå, målt på Solar System Scopes kort) og **"Vindene"** (pile). **Ringene:** fem tynde, støvede ringe, usynlige forfra og synlige i modlys, med de fem buer i Adams-ringen, der kredser på 10,5 timer. Tre nye emner på Neptuns side (faktatjekket).
- **Spørgsmål til jer:** (1) Skal Uranus også have "Voyagers farver (1986)"? Anbefaling: nej, for Voyagers billeder af Uranus var tæt på de ægte farver (tjekkes, før det skrives). (2) Webb tog også et berømt billede af Neptuns ringe i infrarødt lys. Skal Neptun have "Infrarødt (som JWST)" som Uranus? Anbefaling: ja, det er lille, og det kan komme med i UN5. (3) Spørgsmålet fra UN2 om kameraet ved skyderen "År" står stadig (anbefaling: lad det være, og vis det fra siden i flybyen).

**Senest lavet (8. november 2026): Uranus og Neptun UN2, Uranus' årstider og ringe.** Jeres go: "Go un2".
- **Skyderen "År"** (1986-2070) flytter kun Solen. Solens højde over Uranus passer med Horizons (1986: −82,5°, 2007: 0°, 2026: +74°). **Kappen over polen** er lys, når Solen står højt over den (tegnet).
- **Ringene** (NSSDC): 10 tætte ringe, mørke som kul, så forfra er de næsten usynlige. Støvet mellem dem ses i modlys, og kontakten **"Infrarødt (som JWST)"** gør planeten mørkere og ringene 40 gange lysere. To nye emner på Uranus' side (årene og ringene).
- **Spørgsmål til jer:** Startbilledet er set fra Solens side i 2026. Trækker I skyderen til 1986, står Solen bag Uranus, og man ser natsiden (rigtig fysik). Skal kameraet i stedet stå, så man ser begge poler fra siden, når man bruger skyderen? Anbefaling: Lad det være, og lav flybyens stop 2 ("Et år er 84 år") set fra siden i UN5.

**Senest lavet (8. november 2026): Uranus og Neptun UN1, kloderne og skelettet.** Jeres go: "go, og ja til emSign".
- **Begge kloder står i Solsystemet efter Saturn** (🩵 Uranus og 🔵 Neptun) med Hubbles kort fra 2025: båndene i de ægte farver (lyst grønlig blå, Neptun lidt mere blå) og et svagt lag med de største pletter. Uranus' sydlige halvdel er fra Hubble i 2014, og længst mod syd er nordpolen spejlet (sydpolen har været i mørke siden 2007). Det står i "Ærligt talt".
- **Aksen og Solen er rigtige for dagens dato:** Polens retning (NSSDC) og banen (JPL) giver Solens bredde inden for 0,05° af Horizons, så Uranus' nordpol har sol nu. Uranus drejer "baglæns", Neptun den almindelige vej. Vindene blæser med de målte formler, og de står stille i pause.
- **Fælles kode** i `js/solsystem/isgigant.js`, så UN2-UN5 kan bygge videre på begge. Ny test `isgiganter` (38 tjek). Testene `jupiter` og `solsystem` er rettet til syv kloder (to rækker på pc).

**Senest lavet (7. november 2026): Planen for Uranus og Neptun.** Jeres go: "fortsæt".
- **Planen:** [plan-uranus-neptun.md](../../plan-uranus-neptun.md) med kilderne (tjekket med curl), kloderne bygget af målte bånd og vinde, signatur-effekterne, månerne, to flybyer med 4 stop, himlen, tablet og delopgaverne UN1-UN6. **Seks spørgsmål til jer** står i afsnit 8.
- **Faktagrundlaget:** [fakta-solsystemet/del6-uranus-og-neptun.md](../../fakta-solsystemet/del6-uranus-og-neptun.md) (NSSDC, JPL Horizons, OPAL, vindformlerne, Irwin m.fl. 2024 om farverne og ni fælder).
- **Vigtige fund:** Hubbles kort har kun 2 pixel pr. grad, og Uranus-kortet fra 2025 har kun den nordlige halvdel. USGS har ingen globale kort over Uranus' fem måner (Triton findes). Uranus' solhverv er ifølge Horizons i 2030, ikke 2028, som mange skriver.
- **Domæner:** Miljøet var blevet lavet om af Molekyler M2. I åbnede 13 nye (listen står i planen, afsnit 0). `archive.stsci.edu` kræver emSign-roden fra en ældre `certifi` (se erfaringerne).

**Senest lavet (7. november 2026): Tre ønsker fra jer.** Jeres go: "go til det du anbefaler … også go til 8k månekort".
- **Roverens foto er standard i Stå på Mars** (Naukluft og landingsstedet): Det hentes, mens kameraet flyver ned, og tændes, når man er landet (klokken står på fotoets tid). Slår man det fra, huskes det, indtil man forlader Mars. Går klokken (▶, skyderen eller "Solnedgang"), skjules fotoet, for det er taget på ét tidspunkt.
- **Skiftet til Mars var langsomt** (4-5 s uden noget): Det var ikke billederne, men JS, der lavede Mars' fem lokale net og sorterede kuglen om fem gange. Nu ca. 0,6 s i testbrowseren (før 4,4 s). **Rejseskiltet** "Kurs mod Mars" med en raket, der kredser om planeten, vises ved skift af klode, hvis det tager over 0,2 s (`js/rejseskilt.js`).
- **Månens kort i 8k** på pc (6,3 MB, 4k på tablet, før 2k). Kilde: NASA SVS CGI Moon Kit.
- **Tests:** `landskab` tjekker fotoet som standard og rejseskiltet. Fem tests ventede ikke på skiftet af klode (det venter nu ét billede på skiltet) og er rettet. Hele samlingen efter fletningen med `main` (35 tests, 27 min): alle bestod.
