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
