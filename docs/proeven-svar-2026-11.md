# Prøven med sønnen: svarene (november 2026)

*Spor Småting. Ét afsnit pr. punkt, ordret og med dato. Listen over de fem punkter: 1 Forløb-klodsen og tilbage-knappen, 2 Ild, 3 Kvantefysik forløb 1, 4 Videnskabsfolkene (Huygens, Tycho, Einstein), 5 Gåderne på tabletten (Antistof, skinnen, Sort hul).*

## 1a. "Dit første atom" (28. november 2026)
*Prøvet på pc af faren.*

**Svar (ordret):** "det fungerer super. jeg har ikke rigtig nogle bemærkninger. det eneste er at der står noget om minusladet og plusladet. hvis det er her man starter, så giver det måske ikke så meget mening endnu. og en anden ting, mere generelt, hvorfor står spørgsmål med ? .... ? . Kan vi ikke finde en mere elegant måde til det?" (Skærmbillede: knappen "? Hvorfor holder kernen?" med et ? foran teksten.)

**Hvad det betyder for sporet (Forløb):**
- Forløbet virker, ingen blokerende fejl. Status kan gå til "prøvet" for klodsen, når tilbage-knappen er prøvet (1b).
- **Ret:** Trin 1 og 2 i `js/data/forloeb/foerste-atom.js` siger "plusladet" og "minus", før ladning er forklaret. Skriv det uden ladning i de første trin (fx "Den holder kernen sammen" / "Elektronen bliver ved kernen"), og lad ladningen komme, når ordet forklares (Ordbogen, "Hvorfor?"-kortet).
- **Ret (på tværs):** Spørgsmålsknapperne ("? Hvorfor holder kernen?", `hvorfor-række`, `js/vaerksted.js` linje ca. 243) har "?" foran teksten. Find en mere elegant markering, fx en lille cirkel med "?" som ikon eller en tynd streg i stedet for tegnet i teksten, og gør det ens for alle "Hvorfor?"-knapper (stilguiden, `docs/stilguide.md`). Det er en fælles ændring (tjekliste D/E), så den skal have sin egen opgave i Småting eller Forløb og et go.

## 1b. Tilbage-knappen, E20 B (28. november 2026)
*Faren havde prøvet den på tabletten tidligere.*

**Svar (ordret):** "jeg har testet tilbageknappen på tablet tidligere. det virkede så vidt jeg husker fint."

**Hvad det betyder for sporet (Småting):** Faren husker, at den virkede fint, men det er ikke en ny prøve med datoer og trin. Rettelse B i [prompt-e20-rettelser.md](prompt-e20-rettelser.md) er altså ikke nødvendig, medmindre det viser sig, at den ikke går ét niveau op overalt (menu, kort i Gåderne, bog i Opdagelserne). Marker B som "prøvet, virker, husket af faren" i `docs/lige-nu/smaating.md` til sidst. Tager faren den igen og finder en fejl, skrives den her.

## 2. Ild, turen "Hvad brænder egentlig?" (28. november 2026)
*Prøvet af faren og sønnen. Fire skærmbilleder blev sendt i chatten (trin 2 med skeen, trin 3 med molekylerne, trin 3 med CO₂ og H₂O, trin 4 med den slukkede kerte). De ligger ikke i repoet.*

**Svar (ordret):** "vi kunne ikke se at skeen duggede, så den del faldt lidt til jorden. Selve skaftet på skeen reflekterede måske også lige rigelig meget lys. I trin 4 vidste han ikke hvad der var oxygen og stearin. måske et label eller anden indikation. labels kommer først efter. Den kemiske reaktion hvor de bytter partnere kan måske "slowes" ned så man bedre kan se og forstå hvad der sker. Overvej forklaringen i trin 4. kan den gøres mere forståelig? Måske en sætning mere? Ellers ser det fint ud."

**Bemærkning:** Skærmbillederne viser molekylerne ("Træk oxygen fra luften hen til stykket af stearinen") i **trin 3**, og trin 4 er "Du pustede flammen væk". Faren skrev "trin 4" om manglen på navne, så den linje gælder sandsynligvis trin 3. Spørg faren, hvis det ikke er klart, før der rettes.

**Hvad det betyder for sporet (Molekyler, Ild):**
- **Ret 1, duggen på skeen:** Dugget kunne ikke ses. Gør duggen tydeligere (flere dråber, lysere hvid belægning, gerne en lille tilvækst over få sekunder), og tjek, at skaftet ikke blænder (mat skaft, mindre spejling).
- **Ret 2, navne på molekylerne i trin 3:** Sønnen vidste ikke, hvad oxygen og stearin var. Sæt en label på hvert molekyle, mens han trækker (O₂ "oxygen" og stearin "voks"), eller en tydeligere indikation. Faren siger, at labels først kommer efter (som H₂O og CO₂ vises), så navnene skal komme før, ikke først bagefter.
- **Ret 3, "slow motion" af partnerbyttet:** Selve reaktionen, hvor atomerne bytter partnere, skal gå langsommere, så man kan følge, hvad der sker.
- **Ret 4, forklaringen i trin 4:** Gør forklaringen af, at flammen holder sig selv i gang, lettere at forstå. Tilføj gerne én sætning mere.
- **Ild 2 "Flammens form og farve":** Ingen af fundene blokerer. Fundene 1-4 bør rettes først i en lille session i Molekyler (Ild 1), og Ild 2 kan så startes bagefter eller samtidig, hvis faren vil. Spørgsmål til faren: Skal Ild 2 vente på rettelserne?
- Status for turen kan sættes til "prøvet, med rettelser" (fire).

**Faren svarede bagefter (28. november 2026, ordret):** "ja, det var trin 3 jeg mente. tag rettelserne først som du anbefaler."
- Navneproblemet (oxygen og stearin) gælder altså **trin 3**.
- **Ild 2 venter på de fire rettelser.** Prompten til rettelserne står i [prompt-ild-rettelser.md](prompt-ild-rettelser.md) (ny session, spor Molekyler). Ild 2 startes først bagefter ([prompt-ild-2.md](prompt-ild-2.md)).
- **Lavet 28. november 2026** (spor Molekyler): alle fire rettelser, se [lige-nu/molekyler.md](lige-nu/molekyler.md) og [kode/ild.md](kode/ild.md). Ild 2 kan startes.

## 3. Kvantefysik forløb 1, dobbeltspalten (28. november 2026)
*Prøvet af faren (trin 2, 4 og 5 med skærmbilleder, som ikke ligger i repoet).*

**Svar (ordret):** "jeg tænker om "nu sender vi bølger" og generelt den type beskeder burde stå mere centralt i billedet, så de ikke misser det. Og antal kugler bør nok også stå mere centralt. i trin 2 står der tryk på vandet. hvilket vand? Overvej om det kan forklares bedre HVORFOR bølgerne giver det mønster de gør. jeg er som voksen ikke sikker på at jeg selv kan forklare det bagefter. Måske skal animationen opgraderes så det bedre kan ses. trin 4: "i ringen" - hvilken ring? trin 4b: så de slukker hinanden fordi bølgetop og bund mødes? måske lige skriv en sætning eller to mere så det forstås. Tingene må gerne skæres ud i pap. trin 5: igen her skal der arbejdes med UI - spørgsmålet er for nemt at overse. Det er svært stof det her. måske skal det være mere klar undervejs at nu ser vi elektronen som bølger og hvornår vi ikke gør. du må gerne bruge xhigh eller max her hvis du skønner det givtigt, så vi får det mest informative, forståelige og også videnskabeligt korrekte billede. grafikken kan evt. løftes også."

**Hvad det betyder for sporet (Kvantefysik):**
- Forløb 1 virker, men er **ikke klar til prøve med sønnen**, før det er rettet. Forløb 2 og 3 **venter**: Faren vil først have forløb 1 gjort tydeligere.
- **Rettelser (syv):** (1) Beskeder som "Nu sender vi bølger" og tælleren ("Her: 9") skal stå centralt i scenen, ikke kun i linjen nederst. (2) "Tryk på vandet": Peg på, hvilket vand (det skal være tydeligt i scenen). (3) Forklar bedre, *hvorfor* bølgerne giver stribemønstret, og løft animationen, så man ser bølgerne fra begge sprækker mødes. (4) Trin 4: "I ringen" skal sige, hvilken ring (midterstriben på væggen). (5) Trin 4b: Forklar, at bølgetop og bølgebund slukker hinanden, med en til to sætninger mere. "Tingene må gerne skæres ud i pap." (6) Trin 5: Spørgsmålet og valgene skal være sværere at overse (UI). (7) Gør det tydeligt hele vejen, hvornår elektronen vises som bølge, og hvornår som prik. Grafikken må løftes.
- **Opus xhigh** (jeres tilladelse): Prompten er [prompt-kvante-rettelser.md](prompt-kvante-rettelser.md) (ny session, spor Kvantefysik).
