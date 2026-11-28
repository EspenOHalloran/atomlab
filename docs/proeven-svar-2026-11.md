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
