# Noter til E10: Fables drejebog til Liv L3-L6

*Skrevet 14. november 2026 af Opus (spor Molekyler) efter punkt 1 under "Efter Fables svar" i [prompt-fable-liv-l3-l6.md](../prompt-fable-liv-l3-l6.md). Fables fil er [E10-liv-drejebog.md](E10-liv-drejebog.md) og rettes ikke. Drejebogen er flyttet til [drejebog-liv.md](../drejebog-liv.md) og rettet efter disse noter. [plan-liv.md](../plan-liv.md) og [prompt-liv-l3.md](../prompt-liv-l3.md) er rettet. Jeres svar står i afsnit 5.*

## 1. Det, jeg har slået op i dag
| Påstand | Det, jeg fandt | Sikkerhed nu |
|---|---|---|
| Millers kolbe: "fire gasser og vand" (Fables trin 1 i Begyndelsen) | Wikipedia "Miller–Urey experiment": "methane (CH4), ammonia (NH3), and hydrogen (H2) … in a 2:2:1 ratio … connected to a 500-mL flask half-full of water". Lazcano og Bada 2003 (i [begyndelsen.md](../fakta-liv/begyndelsen.md), afsnit 3): "CH₄, NH₃, H₂O and H₂". **Tre gasser og vand**, ikke fire gasser | **S** |
| Vandet i kolben farves (Fable: "efter hukommelsen") | Samme side: "After a day, the solution … was pink, and after a week … deep red and turbid" | **RS** (Wikipedia, ikke artiklen) |
| Pladen: båndene og de ca. 10 dage (Fable: "hvor meget de tålte, er ikke tjekket") | Baym m.fl. 2016, PMC5534434 (åbnet i dag): "TMP: 0, 3, 30, 300, 3000x wild-type Minimum Inhibitory Concentration", "120x60cm", "The adaption time (10 days in TMP; 12 days in CPR)", og bakterierne i midten tålte ca. "10,000-fold increase in MIC for TMP". Fables tekst ("nåede båndet med 3.000 gange så meget medicin på ca. 10 dage") holder | **S** |

De andre påstande står allerede med mærker i faktagrundlaget eller i Fables tabel (afsnit 4) og tjekkes med `/faktatjek`, når teksterne skrives.

## 2. Det, der er nyt, og som jeg er enig i
1. **Tre forløb, ikke fire:** "Kopien", "Fejlen, der hjalp" og "Begyndelsen". Trappen (kopien → fejlene → udvalget → begyndelsen) er rigtig: Begyndelsens sidste trin ("noget, der kopierer sig selv og kan udvikle sig") giver kun mening, når man har set begge dele.
2. **Det nye i L3 er fejlene, ikke lynlåsen.** Lynlåsen alene gentager forløb 1. Fables trin 3 og 4 (fejlen, der bliver rettet, og den, der bliver) er forløbets kerne.
3. **Naturligt udvalg som et forløb med bakterier.** Trin 4 ("Var det medicinen, der lavede fejlen?") rammer den almindeligste misforståelse, og pladen viser det, man ellers kun kan læse. Seglcellen er bedre som kort (ingen syge mennesker i scenen).
4. **"Bland ingredienserne" udgår.** Der findes for få rigtige forsøg til at holde en blandemaskine ærlig. Ét rigtigt forsøg pr. trin på trappen er stærkere.
5. **Liv i rummet bliver ét kort, "Hvor sikkert er et spor?",** ved Cheyava Falls på Mars. Gåden og Mars siger allerede resten, og "hver oplysning står ét sted".
6. **Kolben bygges én gang, i Liv,** og Gåden "Hvordan begyndte livet?" får en knap dertil.
7. **"Cellen" gør det,** ingen helikase, polymerase eller kopigaffel i forløbet. De ord står i "For nørder".
8. **De fem kort** og at "Er det meste af DNA'et skrald?" går til "For nørder".
9. **Fables nye fælder** (G–T, mennesket på døgnuret, pladen, de to nye sider) står allerede i [fakta-faelder-liv.md](../erfaringer/fakta-faelder-liv.md).

## 3. Hvor jeg er uenig eller vil lægge noget til
**Kopien:**
1. **"Under én fejl pr. milliard" og "du har ca. 70" ser ud til at modsige hinanden.** 6,1 milliarder bogstaver × under 1 pr. milliard giver højst ca. 6 pr. kopi. En skarp 13-årig kan regne det ud. Svaret er, at de ca. 70 er samlet op gennem mange delinger: Cellerne, der bliver til sæd og æg, har delt sig mange gange, og jo ældre faren er, jo flere (Jónsson m.fl. 2017: 1,51 flere pr. år for faren, 0,37 for moren). Og ikke alle kommer fra kopien, nogle er skader. **Sådan:** én linje i "For nørder" ved trin 4 og i kort 2 ("Hvordan kan det blive til 70?"). Antallet af delinger slås op ved `/faktatjek` og skrives ellers uden tal.
2. **Gættet i trin 4 og det, han ser, passer ikke sammen.** Han gætter "under 1 pr. milliard" og ser så en fejl blive siddende inden for tre kopier af 12 bogstaver. **Sådan:** Et lille skilt i scenen fra trin 3: "Her: ca. 1 fejl pr. 30 bogstaver. I dig: under 1 pr. milliard." Så står det ærligt, uden at Så bliver længere.
3. **Trin 2 gentager forløb 1, trin 4** (Fable siger det selv). **Sådan:** Han sætter ét bogstav på hver halvdel, og cellen bygger resten.
4. **"Som i forløb 2 (12 trin)":** Forløb 2 viser 30 bogstaver (10 ord). Kopien bruger samme tegning (`'ord'`-tilstanden i `js/liv/protein.js`), men med 12 trin, så alt kan ses på tablet på højkant. Det er et nyt valg, ikke en genbrug af tallet.
5. **Teksten i appen i dag er for skarp.** "Ærligt talt" i Liv (`index.html`, linje 820) siger: "Så buler stigen … Det er en af de almindeligste fejl." Fable har mærket begge dele usikre (Kimsey m.fl. 2018). Rettes i L3 til: "I virkeligheden kan G og T godt holde lidt sammen. Det er en af de fejl, der kan ske, når DNA bliver kopieret, og cellen retter de fleste." Kommentaren i `js/data/forloeb/opskriften.js` (linje 48) rettes med.

**Fejlen, der hjalp:**

6. **Scenen er "mellem", ikke "lille".** Pladen er en ny tegning med vækst, grene og farver. Den skal tegnes med én InstancedMesh eller et 2D-lærred, have en fast tilfældighed (så testene er stabile) og have færre prikker med `LAV_KVALITET`.
7. **Trin 4 kræver, at scenen viser bakterier med fejlen i feltet uden medicin fra starten.** På den rigtige plade kunne man ikke se dem. "Ærligt talt" skal sige det.
8. **Kort 4 og `livSegl` siger det samme om malaria.** `livSegl` har allerede "Derfor er genet almindeligt, hvor der er meget malaria" under "For nørder". Når kort 4 skrives, flyttes den sætning dertil, og `livSegl` linker til kortet.
9. **To nye ord til Ordbogen:** antibiotika og naturligt udvalg (`mutation` og `RNA` findes).

**Begyndelsen:**

10. **Trin 1: "Tre gasser og vand"** (afsnit 1): metan og ammoniak (fra "Del elektroner"), hydrogen (fra "Når atomer mødes") og vand, der koger.
11. **Trin 2: "Færre" er for skarpt.** Cleaves m.fl. 2008 fik mange flere aminosyrer med CO₂ og nitrogen, da vandet fik en buffer ("yields of amino acids greatly increased"), og Parker m.fl. 2011 skriver "significant yields of amino acids can still be synthesized" ([begyndelsen.md](../fakta-liv/begyndelsen.md), afsnit 3). **Sådan:** Det rigtige svar er "Ja, det virker stadig", ikke "færre". Så: "Ja, men det afhænger af, hvad der ellers er i vandet. Ingen kender luften præcist." Ordlyden faktatjekkes i L5.
12. **Begyndelsen er en egen del** (som i [plan-verdener.md](../plan-verdener.md)). Det kræver en linje i `SKÆRME`, en knap i verdenens kort og sit eget modul. Det er en stor opgave, ikke en mellem.

**Rækkefølgen og overlappet:**

13. **Kort 4 og 5 kommer med forløb 4, ikke med L3.** Jeres valg 12. november ("et kort om naturligt udvalg før L3") er nu et helt forløb, så L3 laver kort 1-3.
14. **Planen for Gåderne (G4e) byggede kolben i Gåderne.** Den er rettet i [plan-gaader-3d.md](../plan-gaader-3d.md): Kortet "Livets begyndelse" får en knap til Begyndelsen, når den findes, og indtil da står lyset som scene.

## 4. De nye trin i planen
| Trin | Hvad | Størrelse |
|---|---|---|
| L3 | Forløbet "Kopien", "Leg frit: Kopien" med én ★-opgave og to tal, kort 1-3 og rettelsen i "Ærligt talt" | mellem |
| L4 | Forløbet "Fejlen, der hjalp" (pladen), kort 4 og 5 | mellem |
| L5 | Delen "Begyndelsen": forløbet med kolben og trappen og de fire kort | stor |
| L6 | Kortet "Hvor sikkert er et spor?" ved Cheyava Falls på Mars og links fra Gåden og Begyndelsen | lille |

## 5. Jeres svar (14. november 2026)
**Fables fire spørgsmål:** "Gå med dine anbefalinger", altså (a) i alle fire: forløbet "Fejlen, der hjalp" og kort 4 og 5, Begyndelsen som ét forløb uden "bland ingredienserne" (ændrer jeres valg 4a fra 9. november), intet forløb om liv i rummet (ændrer fanerne i valg 1a), og kolben bygges én gang i Liv (ændrer E8 for gåden).

**Mine fire spørgsmål:** alle fire anbefalinger.
1. Den rettede drejebog står i en egen fil, [drejebog-liv.md](../drejebog-liv.md), som ved Molekyler, Strøm og Lys.
2. Kopien bruger stigen lige ud (som i forløb 2), ikke den snoede atomstige.
3. "Leg frit: Kopien" får én ★-opgave: "Find en mutation, der blev" (`liv-mutation`).
4. Kortet "Hvor sikkert er et spor?" (L6) bygges i sporet Molekyler lige efter Begyndelsen.

Hvert forløb får stadig sit eget go. Molekyler er bygget, så L3 er det næste i Liv (Opus, høj).
