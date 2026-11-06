# Plan: Det sorte hul bygges om

*Skrevet 6. november 2026 (Opus, xhigh) efter [prompt-sorthul.md](prompt-sorthul.md). Trin 1 (plan og prøvebillede) er lavet. **Jeres svar 6. november 2026: "vi går med dine anbefalinger. go."** Altså g⁴, 6.000 K, mindste afstand 15, astronauten og stjernen bøjes ikke, og dynamisk opløsning på både pc og tablet. Trin 2 er i gang.*

## Trin 1: lavet (prøven)
- **`js/data/sorthul.js`** (uden Three.js, kan testes i Node): tallene og fysikken. M = 0,75 enhed, så horisonten (2M) er 1,5 og skyggen (√27 M) 3,90 enheder som før. Fotonkuglen 3M, inderkanten ved ISCO 6M (4,5 enheder), skiven ud til 20M (15 enheder). Lysets bane (RK4), rødforskydningen g, skivens temperatur og sortlegeme-farverne.
- **`js/kosmos/linse.js`**: shaderen. Den følger lysets bane baglæns for hver pixel og viser skiven, skyggen, fotonringen og den bøjede stjernehimmel (stjernerne og tågeskyerne fra scene3d.js laves i shaderen, så de kan bøjes).
- **`js/kosmos/sorthul.js`**: koblet til shaderen. Den flade skygge, skiven, de 2.600 prikker og ringen er væk. Astronauten, stjernen, kontakterne og siden er som før (teksterne er ikke rettet endnu).
- **Kontrolleret i Node** (samme skridt som shaderen): skyggens kant b = 5,19615 M (√27 = 5,19615), med shaderens skridt 5,1976 M (0,03 % for stor). En stråle lige uden for kanten kommer ned til 3,0025 M (fotonkuglen). ISCO = 6,000 M. Afbøjningen langt fra passer med 4M/b + 15π/4 · (M/b)² (b = 100 M: 0,041213 mod 0,041221). Skivens krydsninger med shaderens skridt rammer en meget fin regning med 3 decimaler. g = √0,5 ved ISCO set lige ovenfra.
- **Prøvebilleder** (fuld grafik, pc og tablet): `node tests/vaerktoejer/sorthul-billeder.mjs`. Forfra, med navne, tæt på, ovenfra, fra siden, langt væk og uden glødemasken. Oversigten (før og efter): [sorthul-proeve.jpg](sorthul-proeve.jpg).
- **Billeder i sekundet i testbrowseren** (uden grafikkort, så kun til sammenligning): den gamle udgave 4, den nye 1,5 på pc (1280 × 800) og 5 med tablettens indstillinger. Et rigtigt grafikkort er 100-1000 gange hurtigere. Overslag: ca. 20 skridt pr. pixel og ca. 2.000 regneoperationer pr. pixel forfra. Det er nok til en tablet i halv opløsning, men en svag pc med en stor skærm kan komme under 60 (derfor dynamisk opløsning i trin 2). De rigtige tal kan kun måles hos jer.

## Fysikken (valgene)
- **Et hul, der ikke drejer (Schwarzschild).** Banen ligger i et plan og regnes som u = 1/r ud fra vinklen φ: u'' = 3Mu² − u, med RK4 og korte skridt tæt på hullet (0,06 rad) og lange langt væk (0,24). Skridtet slutter præcis, hvor banen krydser skivens plan (de vinkler kendes på forhånd), så r dér bliver nøjagtig. I gennemsnit ca. 20 skridt pr. pixel forfra og ca. 37 helt tæt på, højst 170.
- **Kameraet står stille** i forhold til hullet (ikke i kredsløb). Det giver den rigtige skygge på alle afstande: sin ψ = √27 M/r · √(1 − 2M/r).
- **Prompten skrev kraften som −3/2·h²·r̂/r⁵.** Den rigtige er −3/2·h²·r̂/r⁴ (= −3/2·h²·**r**/r⁵, med r_s = 1). Jeg har brugt u(φ)-formen, som giver det samme.
- **Skiven** er tynd og flad, fra ISCO til 20M. Temperaturen følger Shakura og Sunyaev (0 ved inderkanten, varmest ved 1,36 gange den). **g = √(1 − 3M/r) / (1 − Ω·λ)** (tyngdekraft, fart og doppler i én) og en lille faktor for kameraet. **Lysstyrken ganges med g⁴**: den samlede lysstyrke af et sortlegeme går som T⁴, og T ganges med g. Farven er et sortlegeme ved g·T (Plancks lov og CIE-kurverne, regnet i JS). Farvetemperaturen er valgt (6.000 K, hvor skiven er varmest), så farverne kan ses. Den rigtige gas er meget varmere og lyser mest i ultraviolet og røntgen (skal faktatjekkes).
- **Striberne** kredser med Keplers fart (hurtigst inderst). To lag skiftes ud hvert ca. 9. sekund, så striberne ikke bliver viklet uendeligt tæt og flimrer. `ROLIG`: skiven drejer 4 gange langsommere. Tiden er fænomenets `tid` (står stille under pause).
- **Stjernehimlen** er bøjet. Kameraet er tæt på (ca. 41 M), så Einsteinringen er stor (ca. √(4M/D) ≈ 18°): Stjerner op til ca. 15° fra hullet bliver trukket ud til buer. Det er rigtigt, ikke en fejl.
- **Tynde billeder**: Mønsteret i de billeder af skiven, der er gået halvt rundt om hullet og er presset sammen tæt på skyggen, glattes ud, så de ikke flimrer. Lige ved skyggens kant følges 3 stråler mere pr. pixel, så fotonringen ikke bliver stiplet (den var stiplet på tabletten i halv opløsning).

## Teknikken
- Billedet tegnes i et lag for sig (`WebGLRenderTarget`, HalfFloat) og lægges ind i scenen som en flade, der dækker skærmen og tegnes først. Fladen skriver **dybden** (afstanden til skiven eller hullet), så astronauten og stjernen forsvinder bag skiven og i skyggen, men ikke bøjes. Navnene tegnes altid øverst. Den virker også i testene uden glød (`TEST_HURTIG`).
- **Tabletten** (`LAV_KVALITET`): halv opløsning (en fjerdedel af punkterne), højst 110 skridt, længere skridt (0,085 og 0,3), 2 lag støj og 2 lag stjerner.
- **Kameraets mindste afstand** er 15 enheder (ca. 20 M) i stedet for 4 (sat tilbage i `stop`). Ved 7 enheder fyldte skyggen hele billedet, så man kun så sort. Ved 15-16 fylder skyggen det meste af højden, og ringen og skiven foran ses stadig.
- Rumstøvet er skjult ved hullet (det bliver ikke bøjet).

## Trin 2 (efter jeres go)
1. **Billedet færdigt:** finpudse lysstyrke, farver, striber og skivens størrelse efter jeres svar. Navnene flyttes, så de passer (fx "Bøjet lys" på buen), og **"Fotonring"** kommer til. Kameraets startafstand.
2. **Tabletten:** **dynamisk opløsning**: Programmet måler billeder i sekundet og skruer selv ned for opløsningen (ned til ca. en tredjedel), hvis det hakker, og op igen, når der er luft. Testbrowseren har intet grafikkort, så de rigtige tal kan kun måles hos jer. Tallene fra testbrowseren og et overslag skrives i docs/kode.md.
3. **Gløden:** I prøvebillederne var skyggen helt sort (0 af 255) også **uden** masken (`GemPass` og `SkyggePass`), både forfra og tæt på: Det lyseste af skiven ligger nu længere fra skyggen end den gamle ring. Masken bruger nu den rigtige skygge (√27 M set fra kameraets afstand). Anbefaling: Fjern masken, hvis skyggen også er sort, når skiven lyser op (stjernen bliver slugt). Erfaringen og docs/kode.md rettes.
4. **Teksterne** (`side`): "Hvad er den lysende ring?" (bøjet lys og fotonringen), et nyt emne om, hvorfor den ene side er lysere (dopplereffekten forklaret første gang, og at Interstellar tog den ud med vilje), "Ærligt talt" (skivens størrelse, hullet drejer ikke, astronauten bøjes ikke, farverne) og evt. M87* (den lyse side er nederst, fordi gassen dér kommer mod os). Faktatjek med `/faktatjek`.
5. **Tests:** en ny Node-test `sorthul` (tallene ovenfor, g, farverne). Den skal i listen i `koer-alle.mjs`, og så kører `--ændret` alle tests. I `grafik` og `kosmos`: midten er sort, skyggens kant sidder ved √27 M ± 5 % (målt i billedet i flere retninger), den side, der kommer mod os, er lysere, trinnene i efterbehandlingen fjernes, og kameraets mindste afstand sættes tilbage.
6. **Dokumenterne:** docs/kode.md (Sort hul, linse.js, data/sorthul.js og tallene), erfaringer, "Lige nu" i DESIGN.md (og historikken), tests/README.md og artefaktet "AtomLab Overblik".

## Spørgsmål til jer (Opus' anbefaling først)
1. **Dopplerlyset:** g⁴ er den rigtige fysik og gør den mørke side ca. 10-50 gange svagere end den lyse (se billederne). Behold (anbefalet), eller dæmp den lidt, så den mørke side ses bedre (så skal det stå i "Ærligt talt")?
2. **Farverne:** varm hvid til brun-orange (6.000 K, anbefalet), eller koldere (7.000 K: lys side mere blålig, men skiven mere grå)?
3. **Mindste afstand** 15 enheder, hvor skyggen fylder det meste af højden (anbefalet, se "tættest på" i oversigten), eller længere væk, så hele buen altid kan ses?
4. **Astronauten og stjernen** tegnes oven på billedet uden at blive bøjet (anbefalet nu). **En billig måde at bøje dem:** Regn i JS, hvor man ser dem (det første billede af dem, en enkelt søgning pr. billede), og tegn dem dér, evt. med det svage andet billede på den anden side af hullet. Det koster næsten intet, men bygges kun med jeres go.
5. **Dynamisk opløsning** på både pc og tablet (anbefalet), eller kun på tabletten?
