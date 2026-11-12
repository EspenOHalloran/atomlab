# E5: Opus' noter til Fables faktatjek af Liv og månerne

*Skrevet 12. november 2026 af Opus efter "Efter Fables svar" i [prompt-fable-liv.md](../prompt-fable-liv.md). Læst: [E5-liv.md](E5-liv.md) og de linjer i koden og faktafilerne, Fable peger på. Fables fil er ikke rettet.*

## Kort
Jeg er enig i Fables hovedfund. Faktagrundlaget holder, og programmet havde ingen grove fejl. Alle 12 punkter i Fables afsnit 2 er rettet nu (tabellen nedenfor), også RNA "lillebror", som Fable ville vente med. Faktafilerne har fået en note øverst, og rettelserne står ved påstandene (mærket "Fable E5"). I svarede på de fem spørgsmål samme aften og valgte anbefalingen i alle fem (nederst).

**Nye fund**, der ikke stod i faktagrundlaget eller i "Opus' vurdering":
- **Fontænerne på Europa** (Roth m.fl. 2026, 5. maj 2026): Hubble-beviset er trukket tilbage. Det vigtigste nye fund. Programmet nævner ikke fontæner på Europa (tjekket med `grep` i `jupiter.js`), så kun faktafilen er rettet.
- **Seglcellen kræver begge forældre** i hovedteksten, ikke kun under "For nørder". Det havde jeg selv set, men lagt for langt nede.
- **Ribosomets fart** (5,6 i sekundet, Ingolia 2011), **celletallet** (Hatton 2023), **146 og 147**, **G–T** (wobble) og **"et enzym er et protein"**.
- **QT45 er nu sikker** (forfatternes manuskript i PMC), **chimpanse-tallet er forældet** (Yoo 2025), og **Huygens' landingstid** var mærket forkert.
- **Evolution ved naturligt udvalg mangler.** Det er det vigtigste hul, og jeg er enig: "mutationerne gør, at livet kan udvikle sig" forklarer ingenting uden udvalget.

## Rettet i programmet

| Fil | Før | Nu |
|---|---|---|
| `js/data/liv/protein.js` (opgaven `liv-segl`) | "Skift ét bogstav, så du får seglcelleanæmi" og "Så klumper hæmoglobinet …" | "Lav den ændring, der giver seglcelleanæmi" og "Har man ændringen fra både sin mor og sin far, klumper hæmoglobinet sammen i lange tråde, når det har afleveret ilten." |
| `js/data/liv/protein.js` (beskeden ved GTG) | "Så klumper hæmoglobinet sammen …" | "Har man ændringen fra både mor og far, klumper hæmoglobinet sammen …" (159 tegn, så "afleveret ilten" står kun i opgaven og kortet) |
| `js/data/hvorfor.js` (`livSegl`) | Begge forældre kun under "For nørder" | Begge forældre og "når det har afleveret ilten" i svaret. Nørd-teksten handler nu om bærerne og slutter: "Derfor er genet almindeligt, hvor der er meget malaria." |
| `js/data/liv/protein.js` (ribosomet) | "I dine celler: op til ca. 6-9 i sekundet" | "I celler som dine: ca. 5-6 i sekundet" |
| `js/data/liv/protein.js` og `js/data/ordbog.js` (enzym) | "Et enzym er et protein" | "Næsten alle enzymer er proteiner" og "Et stof, næsten altid et protein, …" |
| `js/data/liv/protein.js` (foldningen og opgaven `liv-protein`), `js/liv-protein.js` | 147 aminosyrer som den færdige β-kæde | Ribosomet bygger 147, den første klippes af, og kæden i blodet har 146 |
| `js/data/liv/protein.js` (tavst skift) | "Det gør ingenting" og "skiftet gør ingenting" | "Samme aminosyre" og "Sådan et skift gør næsten altid ingenting." |
| `js/data/liv/protein.js` ("Skift et bogstav") | "hedder en mutation" | "er en mutation" |
| `js/data/liv/protein.js` (opgaven `liv-tavs`) | "Over meget lang tid er det mutationerne, der gør, at livet kan udvikle sig." | "Dem, der hjælper, bliver oftere givet videre, fordi den, der har dem, får flere børn. Sådan udvikler livet sig over meget lang tid." Én sætning om udvalget nu. Kortet kommer før L3 |
| `js/data/liv/opskriften.js` (cellen) | "Din krop er bygget af ca. 30 billioner celler" og "ca. 84 % af dine celler" | "En voksen krop har ca. 30 billioner celler, og din har lidt færre" og "langt de fleste af dine celler" |
| `js/data/sider/saturn.js` (Enceladus) | "fandt salt, organiske stoffer og fosfat … Liv har man ikke fundet." | "fandt salt, brint og organiske stoffer. I iskorn fra fontænerne er der også fosfat. … Cassini kunne ikke se, om der er liv, og det har ingen endnu kunnet se efter." |
| `js/data/sider/jupiter.js` (Europa) | "ca. 29 km", "Junos 29 km" og "kan kun forklares med" | "ca. 30 km (et sted mellem 20 og 40)", "Junos ca. 30 km" og "forklares bedst med" |
| `js/data/ordbog.js` (RNA) | "DNA'ets lillebror" | "DNA'ets nære slægtning" |
| `index.html` (Liv, "For nørder" og "Ærligt talt") | "delt i flere stykker" og intet om G–T | "delt i tre stykker", og "Ærligt talt" siger, at G og T godt kan holde lidt sammen, hvis de rykker sig skævt, og at det er en af de almindeligste kopifejl |

## Hvor jeg har gjort det anderledes, eller hvor jeg er uenig
- **Ribosomets fart:** Fable foreslog "(målt i museceller)". Jeg skrev "I celler som dine" i stedet, fordi panelet er kort. Det er en lille udvidelse af kilden: Tallet er målt i mus, ikke i mennesker. Begge er pattedyr, og tallet er det bedste, der findes, men det står ikke ordret i kilden.
- **De røde blodlegemer:** "84 %" er fra Sender 2016, som også har de 30 billioner. Hatton 2023 har et højere tal i alt, og andelen fandt jeg ikke i artiklen. Derfor "langt de fleste", som passer med begge.
- **"Det er næsten alt det, liv har brug for"** (Fables forslag til Enceladus) brugte jeg ikke i programmet. Jeg skrev "meget af det, liv har brug for", fordi jeg ikke har tjekket, om svovl er fundet. Den valgte kernesætning for månerne siger "næsten alt". Det skal slås op i Postberg m.fl. 2023, før månerne bygges.
- **G og T** står i "Ærligt talt" og ikke under "For nørder", fordi det handler om, hvad "Byg stigen" snyder med.
- **Fables påstande efter hukommelsen (H)** er sat ind i faktafilerne med Fables mærke og står stadig som usikre: kodon 24 og thalassæmi, Woese, Crick og Orgel, Gibsons celle, Feynman-citatet, Hansens "150-300 kg" og pH 8-12. Programmet bruger ingen af dem. Teksten om tavse skift siger bare "næsten altid", og den holder uden kodon 24.
- **Fables kilder (S):** Jeg har kun selv åbnet Hatton 2023 (PMC10523466: 36, 28 og 17 billioner) og regnet tegnene i de nye beskeder efter. Resten bygger på Fables åbnede kilder.

## Fables afsnit 5 og 6 (det, der ikke rettes nu)
- **Evolution:** et "Hvorfor?"-kort og et afsnit i faktagrundlaget før L3 (jeres valg). Skrevet ind i [prompt-liv-l3.md](../prompt-liv-l3.md) (punkt 5b) og [plan-liv.md](../plan-liv.md) (afsnit 7).
- **"Kom livet fra rummet?", damme og væld, mennesket på døgnuret og hinder i saltvand:** til L5, skrevet i [plan-liv.md](../plan-liv.md) (afsnit 7). Tallene skal slås op først.
- **Rettelserne til drejebogen (E5 afsnit 6):** gælder, når "Liv som to forløb" bygges. Den session skal læse afsnit 6 i [E5-liv.md](E5-liv.md) sammen med drejebogen.

## Jeres svar på Fables spørgsmål (12. november 2026)
1. **Seglcelleanæmi:** begge forældre i opgaven og kortet. Lavet.
2. **Kernesætningen for månerne:** forslag 1, der slutter "… men ingen har endnu kunnet se efter, om der er liv". Skrevet i [fakta-maaner-liv.md](../fakta-maaner-liv.md).
3. **Cheyava Falls:** "måske det stærkeste spor af liv, der er fundet på Mars". Skrevet i [fakta-liv.md](../fakta-liv.md), [rummet.md](../fakta-liv/rummet.md) og [plan-liv.md](../plan-liv.md). Programmet (`mars.js`) brugte ikke ordene og er ikke ændret.
4. **Evolution:** et "Hvorfor?"-kort og et afsnit i faktagrundlaget før L3.
5. **Mennesker og chimpanser:** intet tal i lag 1, kun "vores nærmeste slægtning", og tallene under "For nørder".
