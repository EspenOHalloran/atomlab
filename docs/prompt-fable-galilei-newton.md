# Prompt: Fable laver faktagrundlaget til Galilei og Newton (E15)

*Skrevet 15. november 2026 af sessionen "Småting · Overblik og de næste fem sessioner" efter jeres valg (C på listen over ekstra Fable-opgaver, [prompt-naeste-fem.md](prompt-naeste-fem.md)). **Fable kan kun bruges til og med 16. november 2026.** Hører til sporet Videnskabsfolkene ([plan-videnskabsfolk.md](plan-videnskabsfolk.md), afsnit 2: "Galilei og Newton har intet faktagrundlag endnu"). Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**. **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 8-15 $. Gratis 15. november.
- **Første besked:** "Læs `docs/prompt-fable-galilei-newton.md`, og gør det, der står under 'Prompten'."
- **Domæner:** archive.org, gallica.bnf.fr og babel.hathitrust.org er åbne. Til bøgerne kan der skulle bruges fx `cudl.lib.cam.ac.uk` (Newtons egne eksemplarer af *Principia*), `www.e-rara.ch`, `bibdig.museogalileo.it` og `www.loc.gov`. Bed om dem med en anmodning til miljøet, når du skal bruge dem.
- Kan køre samtidig med Fables tjek af Huygens (begge i sporet Videnskabsfolkene, men de skriver i hver sin fil, og ingen af dem retter i sporets fil).

---

## Prompten

Opdagelserne i Biblioteket er ti bøger om videnskabsfolk. Huygens er prøven og har sit faktagrundlag ([docs/fakta-videnskabsfolk/huygens.md](fakta-videnskabsfolk/huygens.md)). De syv andre står i [docs/fakta-videnskabsfolk.md](fakta-videnskabsfolk.md). **Galilei (nr. 9) og Newton (nr. 10) har intet.** Du skal lave det, så de kan bygges uden at slå op igen.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen) og [docs/plan-videnskabsfolk.md](plan-videnskabsfolk.md), afsnit 1-5 og "Jeres svar" (`grep -n "^## "`, og læs kun dem). Afsnit 2 siger præcis, hvad der skal slås op til de to.
2. Huygens' faktagrundlag som **mønster** (form, længde og hvor præcist siderne fra bogen er beskrevet): [docs/fakta-videnskabsfolk/huygens.md](fakta-videnskabsfolk/huygens.md), og drejebogens form i [docs/drejebog-huygens.md](drejebog-huygens.md) (kun afsnittene om forløbet og bogen selv).
3. "Myterne" i [docs/fakta-videnskabsfolk.md](fakta-videnskabsfolk.md) og rettighederne i [docs/fakta-bogsider-rettigheder.md](fakta-bogsider-rettigheder.md).
4. Det, de skal kobles til i programmet: Jupiters måner (`js/data/sider/jupiter.js`) og Solsystemets overblik (`js/data/sider/overblik.js`, `js/data/planeter.js`).
5. Fælderne: [docs/erfaringer/fakta-faelder-videnskabsfolk.md](erfaringer/fakta-faelder-videnskabsfolk.md).

### Hvad du skal levere
To filer i samme form som Huygens' (højst ca. 15 KB hver): **`docs/fakta-videnskabsfolk/galilei.md`** og **`docs/fakta-videnskabsfolk/newton.md`**. Hver med:
1. **Det vigtigste først** (højst 5 linjer) og et forslag til **kernesætningen** (A, B og C, din anbefaling først).
2. **Opdagelsen** med datoer, tal og kilde (bogen selv først). Galilei: nætterne 7.-15. januar 1610 i *Sidereus Nuncius* (hvilke sider viser Jupiter og "stjernerne" nat for nat), kikkerten (hvad han selv skriver om forstørrelsen), "de mediceiske stjerner". Newton: bog III i *Principia* (1687), månetesten med tal, Keplers love og hvad Newton forklarede.
3. **Siderne fra bogen:** hvilken skanning (bibliotek, adresse, licens, side for side), og hvilke 2-3 sider der skal vises, med det latinske uddrag og en dansk oversættelse til en 13-årig.
4. **Gåden fra bogen og Gør det selv:** fx at finde månerne i Galileis tegninger nat for nat, og månetesten som regnestykke en 13-årig kan følge. Hvad findes allerede i programmet at bygge på?
5. **Myterne og fælderne:** tårnet i Pisa, "Og dog bevæger den sig", at Galilei opfandt kikkerten, æblet. Hvad man skriver i stedet. Hver fælde også som en ny linje i bunden af fakta-fælderne (`merge=union`).
6. **Portrættet:** Sustermans 1636 og Kneller 1689: hvilken skanning, licens og opløsning.
7. **Det, du er mindst sikker på.**

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet, planen eller Huygens' filer. Skriv kun de to nye filer (og nye linjer i fælderne). Når de er skrevet, **stopper du**.
- Primære kilder (bøgerne selv, biblioteker, Galileo-museet, Newton Project, fagfællebedømte artikler). Står en kilde kun i din hukommelse, så skriv det.
- Commit, push, PR til `main`, og merge den med det samme (CLAUDE.md).

## Efter Fables svar
Galilei og Newton bygges efter de syv andre (planen afsnit 2 og 8). Opus læser filerne, når de skal bruges, og skriver sine noter dér.
