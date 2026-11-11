# Prompt: E0, materialet til Fables store eftersyn

*Skrevet 9. november 2026 ([plan-fable-eftersyn.md](plan-fable-eftersyn.md)). Start en ny session med "Læs docs/prompt-fable-e0.md", når T5c er færdig og merget, og når I har lavet runden med jeres søn ([guiden](fable/runde-med-soennen.md)). **Model: Opus. Effort: høj** (Fable bygger på det, så tallene og listerne skal være rigtige).*

---

Saml materialet til Fables store eftersyn af AtomLab, og fyld afsnittene med ⟨E0⟩ ud i `docs/fable/brief-eftersyn.md`. Fable 5.2 kører bagefter i sin egen session på en frisk klon af `main`. **Det, der ikke er pushet til `main`, findes ikke for Fable.**

**Læs først:**
- `docs/plan-fable-eftersyn.md` (hele, den er kort): især "Sådan får vi mest ud af Fable".
- `docs/fable/brief-eftersyn.md` (hele): det er den, du fylder ud.
- `docs/fable/F1-overblik.md`, afsnit 3 (de ti punkter), og `docs/plan-fable.md`, "Status".
- `tests/vaerktoejer/fable-billeder.mjs` (værktøjet fra F0) og "Værktøjer" i `tests/README.md`.

**Vigtigst: Saml fakta, ikke meninger.** Fable skal danne sin egen mening. Skriv ingen vurderinger, anbefalinger eller "det her er svagt" i materialet. Også beslutningerne skrives neutralt med grunden, der blev givet dengang.

**Opgaven:**
1. **Jeres noter:** Få noterne fra runden med sønnen og svarene til faren (fra chatten eller `docs/fable/eftersyn/noter.md`). Skriv dem rent i `docs/fable/eftersyn/noter.md` uden at ændre meningen. Mangler noget, så spørg faren, før du går videre.
2. **Tabletbillederne:** Gør dem mindre (ca. 1600 px på den lange led, JPG), læg dem i `docs/fable/eftersyn/tablet/` med en `LISTE.md` (én linje pr. billede med farens ord). Tjek, at listen passer med filerne (det gjorde den ikke i F0).
3. **Skærmbillederne:** Lav en ny udgave af `fable-billeder.mjs` (fx med en mappe som argument), så de gamle billeder i `docs/fable/billeder/` ikke slettes. Gem i `docs/fable/eftersyn/billeder/` med `LISTE.md`. Ca. 70-100 billeder i alt:
   - menuen (ringen) og hver verden forrest, på pc, tablet på langs, tablet på højkant og telefon
   - hver del (skærm) på pc og tablet på højkant, de vigtigste også på tablet på langs og telefon
   - et udvalg af fænomenerne i Kosmos og Solsystemet på pc (mindst ét fra hver gruppe, alle de store planeter og "Hvorfor går tiden langsommere?")
   - 3-4 billeder i træk af 4-5 forløb (fx en fusion, en kædereaktion, knaldgassen, en flyby og en scene i T5)
   - med et åbent "Hvorfor?"-kort og et åbent "For nørder", så man kan se lagene
   Kig selv på billederne (deviceScaleFactor 1), og tag et billede om, hvis det er tomt eller midt i en overgang. Skriv i `LISTE.md`, hvis noget ikke kunne fotograferes.
4. **Målingerne** (et lille værktøj i `tests/vaerktoejer/`, fx `maal-eftersyn.mjs`, så det kan køres igen senere). Pr. skærm og for 5-6 tunge fænomener, på pc og tablet (`LAV_KVALITET`):
   - hvad der hentes ved første besøg (MB og antal filer, delt i Three.js, egen kode, billeder og andet), og hvad der hentes ved start, før man har valgt noget
   - `renderer.info` (kald pr. billede, trekanter, teksturer, geometrier) og et skøn over teksturernes hukommelse
   - JS-heap efter at have været på skærmen og efter at have forladt den igen (frigives det?)
   - tiden til første tegnede billede (siges med forbehold, fordi testbrowseren ikke har et grafikkort)
   - Skriv tydeligt, hvad testbrowseren **ikke** kan måle (billeder i sekundet og varme på en rigtig tablet).
5. **Koden og dokumenterne:** linjer pr. mappe og de 15 største filer, antal moduler, størrelsen af `billeder/` (og hvad der faktisk bliver hentet), antal dokumenter og KB pr. mappe i `docs/`, og hvor mange KB en ny session mindst læser efter læsekortet i CLAUDE.md.
6. **Testene og arbejdsgangen:** antal tests og tjek, tiden for `--ændret` (et typisk eksempel) og for hele samlingen, punkterne i `docs/lige-nu/aabne-punkter.md` (antal), antal PR'er og commits pr. uge siden start, antal prompter i `docs/` og sporene. Kør hele samlingen én gang i baggrunden, og skriv resultatet.
7. **Status for F1:** én linje pr. punkt (lavet, delvist eller ikke lavet, og hvor), og de store dele, der er kommet til siden 23. oktober (én linje hver).
8. **Beslutningerne:** de 15-25 vigtigste, med dato og grunden, der blev givet (find dem i DESIGN.md, CLAUDE.md, `docs/koereplan.md`, planerne og `docs/arkiv/historik/`). Én linje hver, neutralt skrevet.
9. **Det planlagte og ringen** (til opgave 8 i briefen, farens ønske 9. november 2026): Alt, der er besluttet eller foreslået, men ikke bygget, fra `docs/koereplan.md`, `docs/ideer.md` og planerne (også de store videnskabsfolk, Gåderne, Mørkt stof, Kvantefysik, Antistof, Ild, Tjernobyl, månerne, Planet X og T4). Én linje hver: navnet, en halv linje om indholdet, størrelsen og hvor det er tænkt at ligge (verden og del) eller "ikke afgjort". Plus ringen, som den er nu (`VERDENER` i `js/karrusel.js`): verdenerne i rækkefølge med deres dele, og hvad Kosmos og Solsystemet har af grupper og fænomener. Neutralt, uden forslag til, hvor tingene skal flyttes hen.
10. Fyld punkt 4-9 ind i afsnittene med ⟨E0⟩ i briefen (fjern ⟨E0⟩-mærkerne og de kursive pladsholdere). Hold briefen under ca. 15 KB. Detaljerne må gerne stå i `docs/fable/eftersyn/tal.md`, som briefen så peger på.

**Tests:** Kun det nye værktøj skal virke. Kode i programmet ændres ikke. Den fulde kørsel i punkt 6 er en måling, ikke en del af en ændring.

**Andre sessioner kan køre samtidig** (kun nye store dele venter). Dit spor er **Småting**. Du ejer `docs/fable/eftersyn/`, `docs/fable/brief-eftersyn.md`, `docs/plan-fable-eftersyn.md`, de nye værktøjer i `tests/vaerktoejer/` og `docs/lige-nu/smaating.md`. Ret ikke i kode.

**Når E0 er færdig:** `/faerdig` (kun de dele, der passer: ingen kode er ændret), sæt kryds ved E0 i planen, ret `docs/lige-nu/smaating.md`, commit, PR og merge til `main`. Sig så til faren: "Start en ny session med **Fable 5.2** og effort **high**, tjek saldoen, og skriv: *Læs docs/fable/brief-eftersyn.md og lav eftersynet.*"
