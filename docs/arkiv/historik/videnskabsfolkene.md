# Historik: Videnskabsfolkene

*Det forrige "Senest lavet" fra [lige-nu/videnskabsfolkene.md](../../lige-nu/videnskabsfolkene.md) flyttes hertil ordret, nyeste øverst (fra 16. november 2026).*

**Senest lavet (17. november 2026): H3, gåden og Gør det selv, og E20 fund 6.**
- **Jeres svar:** Go til A, B og C hver for sig og til D og E i træk. Den tredje vej er "Prøv ringen selv" til H4. Et løst anagram huskes (✓). Hylden har Tycho og Rømer som grå rygge.
- **Kun det byggede (A):** Bogen har kun de byggede opslag, og hylden viser Huygens og de næste to bøger, der stiller deres spørgsmål.
- **Trin 4 (B):** ANNULO i de 17 bunker, så flyver resten af sætningen på plads med dansk under. "Det så du" har sætningen fra 1659 og tre veje. Ordet `anagram` er i Ordbogen.
- **"Hemmeligheden" (C):** De otte brikker lægges på deres betydning, til "Alle 62 er brugt. Det passer." Bagefter kommer "Lav dit eget anagram".
- **Links (D):** "Se ringen forsvinde ved Saturn" lander ved Saturn fra kanten (stedet `kanten` i `js/kosmos/saturn.js`). Kortet "Hvordan ved vi, at det er en ring?" står ved ringene, og citatet har "Læs Huygens' bog ›".
- **Faktatjek:** "som han havde sagt" er fjernet (armene kom senere end forudsagt), og der står "kunne forklare", ikke "kun en ring". Der er to nye fælder. `opdagelser` har 26 tjek.

**Senest lavet (17. november 2026): E15, Opus' noter til Galilei og Newton.**
- **Noterne** står nederst i [galilei.md](../fakta-videnskabsfolk/galilei.md) og [newton.md](../fakta-videnskabsfolk/newton.md): hvad der er nyt, hvor Opus er uenig med Fable, og hvilke sider fra bøgerne der passer til de fem lag. Tallene er regnet efter (månetesten, Picards omkreds, Keplers 3. lov for Jupiters måner).
- **Uenig med Fable:** Synsfeltet forklarer ikke, at Galilei ikke så Callisto 8. januar (han så den 7. januar 9,1 bueminutter ude). Begge forløb er kortet ned til fire trin med to gæt. Newtons kernesætning giver Kepler hans del. Kanonkuglen er nok fra den "folkelige" udgave af bog III (trykt 1728) og skal slås op.
- **Jeres svar 17. november 2026** (står i begge filer): Uffizi-portrættet fra 1635, Galileis kernesætning A, Opus' udgave af Newtons A, og månetestens regnestykke som gåden bagefter. Planens afsnit 2 er rettet: Galilei og Newton har nu faktagrundlag.

**Senest lavet (16. november 2026): H2, fortællingen "Saturns ører".**
- **Go til H2** 16. november 2026 (jeres svar står i drejebogen, punkt 8: laboratoriet med ringen og "Fortæl det igen", og Gør-teksten i trin 3 er rettet). Bygget i trinene A-E med et go til A og så B-D samlet.
- **Forløbet** `js/data/forloeb/huygens.js` (trin 1-3 og kernesætning D) kører med Forløb-klodsen i bogens opslag `fortaelling` (slags `scene` i `js/bog.js`). Første gang starter det efter "Begynd". Imens er bladringen låst, og Esc går til hylden. Bagefter er opslaget et laboratorium. Det kan også startes fra "Din fremgang".
- **Tegningerne** `js/bog/huygens.js` i tavlens stil (s. 16-18 og tavlen ved s. 35 er set i skanningen): linsen, der bliver skarp, når man gnider, Titan i den rigtige afstand med skyderen og rækken "* O", og ringen, der drejes, med tavlens Hevelius, Divini og Riccioli, der lyser op, og løftet ved kanten.
- **Faktatjek:** "en lang rejse" blev til "en rejse" (to nye fælder). Ordet `linse` er i Ordbogen (kom med her, fordi trin 1 bruger det). `tests/opdagelser.mjs` har 18 tjek.

**Senest lavet (16. november 2026): Fables noter og H1 (delen og forsiden).**
- **Noterne** [fable/E12-huygens-noter.md](../fable/E12-huygens-noter.md): Fables fund er tjekket i bogens OCR (5. marts 1656, armene væk 16. januar 1656 og tilbage 13. oktober, ringen parallel med ækvator, 28° mod ekliptika og Galileis eget anagram). Uenig tre steder: Saturn "vipper" ikke (vi ser den fra en ny vinkel), udfordringen har 8 brikker, og portrættet bliver på forsiden.
- **Drejebogen** [drejebog-huygens.md](../drejebog-huygens.md) er rettet: trin 3 om januar 1656, trin 4 med 17 bunker, seks glødende steder på fire sider (tavlen, s. 16, 47 og 48), oversættelsen og "Om Huygens" som bogens sidste opslag. Faktafilen og fælderne er rettet.
- **Jeres svar 16. november 2026** står i drejebogen: kernesætning D, delens nye kernesætning ("De gættede ikke bare. De så efter og målte …", også i planen), kun linket til Saturns ringe ("Set fra Jorden" i idéerne), portrættet med spørgsmålet som titel, "Lav dit eget anagram" i H3, skriften som woff2.
- **H1:** delen Opdagelserne i Biblioteket (`js/opdagelser.js`), hylden med alle ti (Huygens med omslaget frem, de andre som grå ryg), bogen som klods (`js/bog.js`) med forsiden og bladring (knapper, piletaster, stryg og Esc) og fem tomme opslag, skriften AtomLab Fell (IM Fell English, omdøbt på grund af OFL's Reserved Font Name) i `fonts/`, portrættet og `tests/opdagelser.mjs` (11 tjek). Forløb-klodsen kan bruges direkte i H2.

**Senest lavet (15. november 2026): H0, plan og drejebog til Huygens (kun dokumenter og et billedværktøj).**
- **Planen** [plan-videnskabsfolk.md](../plan-videnskabsfolk.md): de ti (Huygens som prøve, så Tycho, Rømer, Ørsted, Curie, Einstein, Bohr og Lehmann, så Galilei og til sidst Newton), en bog i 2D i fem lag (forsiden, fortællingen, gåden fra bogen, Gør det selv og bogen selv), stilen fra personens tid inden for én fælles ramme, skrifterne (kun OFL), portrætterne, delen **Opdagelserne** i Biblioteket (`opdagelser` i `js/skaerme.js`), filerne, testene og trinene H1-H4. Hvad der skal slås op til Galilei og Newton står i afsnit 2.
- **Drejebogen** [drejebog-huygens.md](../drejebog-huygens.md): kernesætningen (A, B eller C), forløbet "Saturns ører" i 5 trin (linsen, Titan, ringen, der drejes, og anagrammet ANNULO), hele anagrammet som udfordring, Gør det selv ved Saturns ringe, s. 46-48 og tavlen med glødende steder og Opus' oversættelse fra latin, "Hvorfor?", "Ærligt talt" og "For nørder".
- **Faktagrundlaget** [fakta-videnskabsfolk/huygens.md](../fakta-videnskabsfolk/huygens.md): læst direkte i *Systema Saturnium* (Smithsonians frigivne skanning): kikkerten på 12 fod, Titan 25. marts 1655, anagrammet 25. marts 1656, de 62 bogstaver, 9 til 4, og at Huygens troede, ringen var fast (s. 48). Portrættet (Netscher 1671) er public domain. Fem nye fælder.
- **Kobberstik-filteret** `billeder/biblioteket/lav_portraet.py` (PIL og numpy). Udkastet af Huygens blev vist, og I sagde ja til stilen. Billedet selv kommer i repoet i H1.
- **Prompten til Fable** [prompt-fable-huygens.md](../prompt-fable-huygens.md) (Fable 5.2, high, svaret i `docs/fable/E12-huygens.md`).
- **Jeres svar 15. november 2026** står i planen: portrættets stil ja, IM Fell English til overskrifter (programmets skrift til brødteksten), og alle ti bøger på hylden (de kommende som grå ryg).
