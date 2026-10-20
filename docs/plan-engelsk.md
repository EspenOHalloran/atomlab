# Plan: AtomLab på engelsk

Status: **plan, ikke lavet endnu.** Vi venter med at gå i gang.

## Hvad det går ud på
Man skal kunne vælge mellem dansk og engelsk, og alt skal oversættes: knapper, paneler, opgaver, hjælp, fakta om alle 118 grundstoffer, Kosmos, citater og den tekst, der er tegnet ind i 3D-billedet.

## Hvor stor er opgaven?
Den er stor, men det skyldes mest mængden af tekst. Teknisk er den ligetil.

- Der er ca. **21.500 ord** tekst fordelt på ca. 32 filer (talt i oktober 2026, efter Årstiderne, Formørkelser, kategorikortet og ordforklaringerne). Det svarer til en lille bog.
- De største dele er:

  | Del | Ord |
  |---|---|
  | Hjælpen og teksterne i `index.html` | 3.100 |
  | Kosmos (15 fænomener i `js/kosmos/`) | 8.300 |
  | `js/data/ordbog.js` (ordforklaringerne) | 800 |
  | `js/data/kategorier.js` og `js/kategorikort.js` (kategorikortet) | 1.200 |
  | `js/data/fakta.js` (fakta om alle 118 grundstoffer) | 1.800 |
  | `js/vaerksted.js` | 1.500 |
  | `js/data/grundstoffer.js` (navne, kategorier og korte fakta) | 1.200 |
  | `js/data/citater.js` | 1.000 |
  | `js/reaktor.js` | 950 |
  | `js/fusion.js` | 800 |
  | `js/batteri.js` | 540 |
  | `js/data/isotoper.js` | 400 |
  | Resten (system, beskeder, guide, lyd osv.) | 400 |
- Noget tekst bliver **tegnet i 3D** og ikke skrevet i HTML: navnene på felterne i det periodiske system, navnene på stumperne i Reaktoren, skiltene i Batteriet og i Kosmos samt "+1,44 MeV" ved fusion.
- **Ordforklaringerne** finder fagordene ud fra danske bøjninger (`former` i `ordbog.js`). Den engelske udgave skal have sine egne former (fx "neutrinos"), og testen `ordforklaring` skal tjekke dem på engelsk.
- **Tal skrives forskelligt:** dansk "1,44 MeV" og "10.000 km", engelsk "1.44 MeV" og "10,000 km".
- **Citaterne** har allerede den oprindelige ordlyd i feltet `original` i `citater.js`. De fleste er på engelsk fra starten (Feynman, Sagan, Hawking, Wheeler, Rutherford, Eddington, Faraday). Einstein (tysk), Bohr (genfortalt på tysk af Heisenberg) og Curie (fransk) skal bruge en kendt, udgivet engelsk oversættelse med kilde. Kan en kilde ikke findes, udelades citatet på engelsk.

## Sådan bygges det
**Sproget vælges, når siden starter.** En ny fil, `js/sprog.js`, finder sproget:
1. `?sprog=en` i adressen (så bliver valget også husket), ellers
2. det gemte valg i `localStorage` under `atomlabSprog`, ellers
3. standardsproget (se spørgsmålene nedenfor).

Når man skifter sprog, gemmes valget, og siden genindlæses. Man står bagefter på den samme skærm, fordi skærmen står efter `#` i adressen. Fordi sproget ikke skifter, mens siden kører, kan hvert modul vælge sine tekster med det samme ved start. Så skal intet tegnes om undervejs. Felterne i det periodiske system bliver fx bare tegnet med de engelske navne fra starten.

**To mønstre til teksterne:**
1. **Data med tekst** får engelsk lige ved siden af dansk, så de to sprog står samme sted og er lette at holde ens. Det gælder fx opgaver, reaktioner, Kosmos-fænomener og citater:
   ```js
   { id: 'f-d', titel: 'Lav deuterium (p + p)', tip: '…', fakta: '…',
     en: { titel: 'Make deuterium (p + p)', tip: '…', fakta: '…' } }
   ```
   En lille hjælper, `lokaliser()`, bytter felterne ved start, når sproget er engelsk. Resten af koden læser bare `o.titel` som i dag.
   Meget store tabeller får en engelsk fil ved siden af: `fakta-en.js` (FAKTA), de korte fakta og de 118 navne.
2. **Løse tekster** i koden og i HTML slås op i en engelsk ordbog med den danske tekst som nøgle:
   ```js
   knap.textContent = t('Skyd neutron');
   tekst = t('Lav 5 heliumkerner ({n} af 5)', { n });
   ```
   Den danske tekst bliver stående i koden, så koden stadig er let at læse. Korte tekster i `index.html` (knapper, overskrifter, `title` og `aria-label`) oversættes automatisk ved start. Lange afsnit med fed skrift og links, fx hjælpen, får en `data-t="id"` og en engelsk udgave i en egen fil.

**Andre ting, der skal ordnes:**
- `tal(x, decimaler)` formaterer tal efter sproget i stedet for `toLocaleString('da-DK')` og `.replace('.', ',')`. Tider i loggen (🔔) formateres også efter sproget.
- Grundstofferne får deres officielle engelske navne (IUPAC: aluminium, caesium, sulfur). Søgningen i det periodiske system bruger det valgte sprog.
- Sætninger med tal og flertal (fx "1 proton" / "2 protoner") laves om, så de også virker på engelsk. Der er allerede en hjælper, `stk(antal, ental, flertal)` i `vaerksted.js`.
- Mærket "Start her" står i dag i CSS. Det flyttes til JS.
- `beskeder.js` fjerner i dag "Opgave klaret: " fra titler med et regulært udtryk på dansk. I stedet skal den korte titel sendes med.
- `<html lang>` sættes til det valgte sprog.
- README får et kort afsnit på engelsk.

## Trin (hver med et go)
1. **Fundament, menu og det periodiske system:** `sprog.js`, ordbogen, `tal()`, oversættelse af HTML, alle 118 navne, kategorier, korte fakta og FAKTA.
2. **Atomværkstedet:** knapper, infopanelet og fanerne, opgaver, henfald og isotoper samt den store hjælp om atomer og radioaktivitet.
3. **Stjerneovnen, Reaktoren og Batteriet:** paneler, opgaver, reaktioner, guider, undertekster, skilte og hjælp.
4. **Kosmos, citater og samlet gennemgang:** de 15 fænomener (kort fortalt, for nørder, faser, knapper og skilte), ordforklaringerne, citaterne med kontrol af kilderne, stavekontrol og layout på telefon og tablet.

Vælgeren i menuen bliver først vist, når alle fire trin er færdige. Indtil da kan man se den engelske udgave med `?sprog=en` i adressen. Det, der ikke er oversat endnu, står så på dansk.

## Test
- I testtilstand (`?test`) giver en manglende oversættelse en advarsel i konsollen, så de automatiske tests fanger den.
- Et lille script tjekker, at alle `t('…')` og `data-t` har en engelsk tekst, og finder engelske tekster, der ikke bruges mere.
- En engelsk testrunde går gennem alle skærme, hjælpevinduer og Kosmos-fænomener. Den leder efter æ, ø, å og almindelige danske ord i den synlige tekst.
- Der køres engelsk stavekontrol (en_GB) på alle engelske tekster.
- Der tages skærmbilleder på telefon og tablet, for engelske ord er nogle gange længere ("Elektronsky" bliver "Electron cloud").
- Alle de nuværende tests kører videre på dansk.

## Bagefter
Ny tekst skal altid skrives på både dansk og engelsk. Testene fanger det, hvis den engelske mangler. Det skrives ind i `CLAUDE.md`.

## Spørgsmål, vi skal afklare, før vi går i gang
1. **Britisk eller amerikansk engelsk?** Jeg foreslår britisk (colour, metre). Det er det, man oftest lærer i danske skoler, og grundstofnavnene følger IUPAC uanset hvad.
2. **Hvilket sprog skal AtomLab starte på?** Altid dansk, til man vælger andet, eller det sprog, telefonen eller browseren er sat til?
3. **Hvornår skal vælgeren kunne ses?** Først når alt er oversat (forslag), eller med det samme?
4. **Engelske navne på delene:** forslag Atom Workshop, Periodic Table, Star Furnace, Reactor, Battery og Cosmos. Måske vil sønnen være med til at vælge.
