# Noter til E14: Fables eftersyn af forløbene

*Skrevet 15. november 2026 af Opus. Fables fil er [E14-forloeb-eftersyn.md](E14-forloeb-eftersyn.md) og rettes ikke. Alle fund er tjekket mod koden og billederne i [E14-billeder/](E14-billeder/). Intet er rettet endnu: Listen "Ret før prøven" står til sidst som valg, og jeres svar skrives ind her og i sporenes filer.*

## Det, jeg har tjekket efter
- **Molekyler:** δ+ og δ− tegnes altid, når molekylet er polært (`js/molekyle3d.js:408`, ladningerne fra `form.struktur.q` i `js/molekyler-byg.js`). Forløbet slukker dem ikke, selvom drejebogen lægger dem i laboratoriet (`docs/drejebog-molekyler.md:39`). Atomerne i trin 1-2 er små på billede 02 og 03. Fable har ret.
- **Liv 1:** ⚠-boksen "A–C holder ikke" kommer fra `vælgBase` (`js/liv.js:368`), som ikke spørger, om forløbet kører. Teksten er `PAR_TEKST.ladning` med δ+ og δ−. **Bogstaverne** står kun på det trin, der lyser (`js/liv/stige.js:314`), så han ser dem først, når han har trykket på et trin. Før det er der kun farver og den lille nøgle. Fable har ret, men problemet er mindre end "ingen bogstaver": De kommer, når man rammer.
- **Liv 1, "Det så du":** `slutTekst` (`js/liv.js:538`) bringer "Sådan kopierer cellen sit DNA", som drejebogen har som Så i trin 4 (`E3-liv-drejebog.md:18`). Fable har ret.
- **Liv 2 trin 4:** Skiftet viser en besked med `type: 'advarsel'` (`js/liv-ordene.js:57`) med den samme sætning om mor og far, som Så-teksten. Fable har ret.
- **Rejsen trin 2:** "⌚ Dit ur" er kun aktiv, mens skibet flyver (`js/kosmos/tid.js:685`). "Vis mig" redder det efter 20 sekunder (flyver og viser uret), så han går ikke helt i stå, men han venter på et skib, der er landet, uden at vide hvorfor. "⏩ Hurtigere" (`tid.js:662`) er rigtigt nok et dårligt navn i et forløb om fart.
- **Rejsen trin 3, tallene** regnet efter: 50 % til 4,344 lysår og hjem giver 17,38 år på Jorden og 15,05 år i skibet (28 og 30). 99,99 % giver 8,69 år og 0,123 år = 45 dage (13 og 21). Fables tal holder.
- **Myonerne:** Forløbet siger "Myoner fra rummet" (`js/data/forloeb/tid.js:122`). Faktafilen (`docs/fakta-tid.md:111`), Ordbogen og scenens egen overskrift ("Den kosmiske stråling rammer luften") siger, at de dannes ca. 15 km oppe. **Fakta forkert, Fable har ret.** Bygen trækkes mellem 11 og 15 af 24 (`js/kosmos/tidhvorfor.js:1118`). 15 af 24 er 62 %, så "ca. halvdelen" er lidt rundt.
- **Overblikket trin 1:** Kameraet sigter på de fire inderste (`INDERST` i `js/solsystem/overblik-forloeb.js:286`), som E9 bad om, men den pustede Sol fylder, og planeterne er prikker (billede 11). Trin 2's tekst efter gættet er kun "Prøv det!" (`js/data/forloeb/overblik.js`). Fable har ret.
- **Laboratoriet (billede 15):** "Solsystemet" går ud over sit felt, "Skala" står klistret til teksten, og Uranus' navn forsvinder bag panelet. Set på billedet.
- **Antistof (billede 14):** Scenen siger "Træk dem sammen", og gættets knapper står klar i panelet samtidig. Fable har ret.
- **Kosmos' fire grupper** har emoji (`js/kosmos.js:25-28`). Det har Solsystemets faner også, så det er ikke nyt for de fire grupper, men det bryder Retningens punkt 5.
- **"Hvordan kan det ske?" trin 2:** Mærkaten "lyset: lysets fart (ikke mere!)" er skåret af ved kanten (billede 09, `tidhvorfor.js:343`).

## Det, der er nyt, og som jeg er enig i
1. **Mønster A (laboratoriet lækker ind)** er Fables største fund. Det samme fejlmønster står fem steder (δ, to ⚠-bokse, µs og γ, "8 yderst"). Klodsen skjuler panelerne, men scenen ved ikke, at den er i et forløb. Det hører hjemme i byggeklodserne (Serie 2 nr. 5): én kontakt "i forløb" til scenen, og en forkert handling giver et `forløbVink`, aldrig en ⚠-boks.
2. **Mønster B (det, teksten peger på, er for småt).** Kan testes: Det, Spørg nævner, skal være mindst 44 px.
3. **Fakta: myonerne** (se ovenfor). Skal rettes, uanset hvad.
4. **"Dit første atom" trin 2:** Ingen har sagt, at elektronen er minus. Trin 1 siger kun, at protonen er plus. Fables tekst er 22 ord og holder testens grænse.
5. **"Dit første atom" trin 3:** Teksten siger "kan ikke holde sammen", og kernen holder på skærmen. Fables tekst siger, at den ryster, og "i virkeligheden". Den skal stadig ikke lyde, som om frastødningen alene er grunden (fælden i `docs/erfaringer/fakta-faelder.md`): Fables udgave sætter de to ting ved siden af hinanden, ikke med "så". Den er i orden.
6. **"Dit første atom" trin 5:** Kernesætningens anden halvdel (protonerne bestemmer grundstoffet) bliver ikke sagt, før "Det så du". Fables Spørg med "én proton og to protoner" retter det.
7. **Rejsen trin 3** indbyder til den forkerte slutning (tvillingen er yngre efter den hurtige tur, fordi turen er kortere). God observation. Jeg foreslår en kortere tekst end Fables (se Tid nedenfor).
8. **Prøven:** De otte ting at se efter i E4, afsnit 6, passer ikke længere til forløbet (skyderen, "Vis lysuret" og scene 5 er der ikke). Fables nye spørgsmål er bedre. Spørgsmålet "Blev det et andet grundstof?" i "Dit første atom" er klart bedre end "plus skubber plus".
9. **Rækkefølgen ved prøven** (Første atom, så Molekyler, så Rejsen) er god.

## Hvor jeg er uenig eller vil gøre det anderledes
1. **"Træk målebåndet" i "Hvordan kan det ske?" trin 4.** Jeres valg 14. november 2026 var et animeret målebånd (`docs/arkiv/historik/tid.md:11`). Jeg bygger det ikke om før prøven. Vælger han selv vejen fra Rejsen, viser prøven, om "tryk og se" keder ham. Fable siger selv, at forløbet kommer til sidst.
2. **Rejsen trin 2: "Vis 'Dit ur' af sig selv".** Så forsvinder trinets eneste handling, og så er spørgsmålet "Mærkede du noget?" besvaret uden ham. Jeg anbefaler Fables andet forslag: et vink ved landingen, når han ikke trykkede.
3. **Rejsen trin 3, Fables tekst** ("godt to års forskel på 17 år") er svær at læse. Mit forslag: *"Halv lysfart: godt 2 års forskel. 99,99 %: Du var væk i 45 dage, din tvilling i knap 9 år. Det sker først for alvor tæt på lysets fart."* (2,33 år, 45 dage og 8,69 år.) At begge resultater bliver stående i scenen, er mere kode og kan vente på prøven.
4. **"Dit første atom" trin 4:** Knapperne har tællere ("Neutron 0/2", "Elektron 0/2", `js/vaerksted.js:204-205`), så han kan se, at elektronen mangler. Vinket er stadig godt (det siger *hvorfor*), men det er ikke et sted, han går i stå.
5. **Liv 1 trin 3:** Hellere farvenøglen ind i forløbets linje (stor og med bogstaverne A, T, G og C) end at zoome ind til 6-8 trin. Det er lille, og bogstaverne kommer allerede på det trin, han rammer. Zoom kan prøves bagefter, hvis han stadig ikke rammer.
6. **Myonernes Spørg:** Fables tekst bliver 25 ord. Mit forslag (19 ord): *"Myoner bliver til ca. 15 km oppe og lever så kort, at de burde gå i stykker deroppe. Hvor mange når ned?"*
7. **Kosmos' emoji:** Ikke før prøven, og ikke kun Kosmos. Hører sammen med Solsystemets faner og knapperne i Tid (byggeklodsernes punkt 7).

## Hvem retter hvad (sporene)
- **Forløb:** "Dit første atom" trin 2, 3, 4 og 5. Klodsen: teksten efter gættet som "Prøv det: <handling>" og byggeklodsernes otte punkter (Serie 2 nr. 5, skrives ind i planen, når den laves). Prøven: nye spørgsmål i `docs/guide-proeven.md` og rettelsen af E4's liste.
- **Molekyler:** "Når atomer mødes" (atomernes størrelse i trin 1-2, δ slukket i forløbet, trin 4's farver, linket "Tag 'Dit første atom' først"). Liv 1 (nøglen og bogstaverne i trin 3, vinket i stedet for ⚠ i trin 4, "Det så du" flyttes til Så i trin 4, trin 1's tekst, trin 2's tekst efter gættet). Liv 2 (ingen ⚠-besked i trin 4, trin 1 og 5's tekster).
- **Tid og rum:** Rejsen (vink ved landingen i trin 2, "Spol frem", aldrene stort, trin 3's tekst). "Hvordan kan det ske?" (myonernes tekst, bygen 11-13, panelet uden µs og γ, mærkaten i trin 2, målebåndet efter prøven).
- **Solsystemet og Kosmos:** Overblikket trin 1 (de fire inderste synlige), trin 2 og 4's tekster, laboratoriets tre mærkater. Kosmos' ikoner senere.
- **Småting:** Antistof (gættet dæmpet, til der er lavet et par), trin 3's tal, og spørgsmålet om "‹ mindre · større ›" på skinnen ved prøven.

## Ret før prøven (min anbefaling, de vigtigste først)
1. **Myonernes fakta** (Tid, 1 linje). Forkert fakta.
2. **"Dit første atom" trin 2, 3 og 5** (Forløb, tre tekster og testen `forloeb`). Det er det første forløb, han prøver.
3. **Molekyler: større atomer i trin 1-2 og δ slukket i forløbet** (Molekyler, lille-mellem). Uden det kan trin 2's spørgsmål ikke ses.
4. **Rejsen trin 2: vink ved landingen og "Spol frem"** (Tid, lille). Det eneste trin, der kræver timing.
5. **Liv 1: nøglen i linjen og vink i stedet for ⚠** (Molekyler, lille). Kan vente, til Liv er næste i prøven.
6. **Overblikket trin 1 og 2** (Solsystemet, lille-mellem). Kan vente, til "Rundt om Solen" er næste.

Resten (Rejsen trin 3, aldrene stort, Liv 2, laboratoriets mærkater, Antistof, myonpanelet, ikonerne og byggeklodserne) venter på prøven.

## Jeres svar
*(skrives her, når I har valgt)*
