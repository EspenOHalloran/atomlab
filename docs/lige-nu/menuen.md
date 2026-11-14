# Lige nu: Menuen

*Spor i [oversigten](../lige-nu.md). **Sporet er lukket 14. november 2026.** Det forrige "Senest lavet" står øverst i [arkiv/historik/menuen.md](../arkiv/historik/menuen.md). Sidst opdateret: 14. november 2026 (Ringen).*

**Senest lavet (14. november 2026): Ringen efter størrelse, og sporet lukkes.** Jeres runde på tabletten: Menuen ser fin ud, intet skal rettes. Jeres svar: anbefalingen ([plan-verdener.md](../plan-verdener.md), linjen "Ringen", Serie 2 nr. 6 i [koereplan.md](../koereplan.md)).
- `VERDENER` i `js/skaerme.js` står nu fra det mindste til det største: **Kernerne, Atomer, Liv**, Elektricitet, Rummet og Biblioteket (uden for skalaen, sidst). "Atomer og molekyler" hedder "Atomer", og "Ild og liv" hedder "Liv". Verdenens id er `liv` (før `ildogliv`), så ikonet hedder `.ikon-v-liv` i style.css. Ikonet og baggrundsmotivet var allerede DNA-stigen uden ild, så `js/menubaggrund.js` er ikke ændret (motiverne følger rækkefølgen i `VERDENER`). Liv har én del, så kortets linje er stadig delens egen tekst.
- En ny bruger starter stadig på Atomer med "Start her" på Atomværkstedet (ikke på Kernerne, der står først).
- Testen `karrusel` følger den nye rækkefølge (piletasten fra Kernerne giver Atomer, musehjulet Liv, ← fra Kernerne giver Biblioteket, og "Din fremgang" starter med Kernerne). De gamle navne er rettet i `docs/` (ikke i Fables eftersyn og arkivet, der beskriver, hvordan det var).

**Næste:** Intet i sporet. Små rettelser i menuen tages i [Småting](smaating.md). En ny verden (fx **Stof og kemi**, når Ild findes) laves sammen med den del, der skal bo i den ([plan-verdener.md](../plan-verdener.md), "En ny del").

**Spørgsmål til jer:** Ingen. Det, der ikke er afprøvet (bl.a. om rækkefølgen giver mening for jeres søn), står i [ikke-afproevet.md](../ikke-afproevet.md).
