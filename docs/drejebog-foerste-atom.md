# Drejebog: "Dit første atom" (Værkstedet)

*Skrevet 12. november 2026 i sporet [Forløb](lige-nu/forloeb.md) efter skemaet i [skabelonen](fable/E3-forloeb.md). Bygger på Fables eksempel. Jeres go samme dag (se "Jeres svar" nederst). Bygget og faktatjekket samme dag. Status: **prøve**.*

## 1. Kernesætningen
*Efter forløbet kan brugeren sige:* "Et atom har en kerne med protoner og neutroner og elektroner udenom. Antallet af protoner bestemmer, hvilket grundstof det er."

## 2. Trinene
Scenen er Værkstedets atom. Panelerne, opgaverne, fanerne og "Elektronsky" er skjult. Forløbets linje står under scenen med prikker, Spørg eller Så, gættet og trinets knap. Knapperne i linjen ligner dem i byggepanelet (samme kugle og "+"), så man kender dem bagefter.

| Trin | Spørg (højst ca. 15 ord) | Gæt | Gør (knappen i linjen) | Så (højst ca. 20 ord) | Ord |
|---|---|---|---|---|---|
| 1 | Alt, du kan røre ved, er bygget af atomer. Lad os bygge det mindste. | – | **+ Proton** (atomet var tomt) | Det er atomets kerne: én proton. Den er plusladet. | proton, kerne |
| 2 | Hvad mangler, før det er et helt atom? | *En proton mere* / *En elektron* | **+ Elektron** | Plus trækker i minus, så elektronen bliver ved kernen. Nu har du hydrogen, det mest almindelige grundstof i universet. | elektron, grundstof |
| 3 | Hvad sker der, hvis du lægger en proton mere i kernen? | *Det bliver et nyt grundstof* / *Kernen går i stykker* | **+ Proton** | Begge dele! To protoner er helium. Men plus skubber plus væk, og to protoner alene kan ikke holde sammen. | – |
| 4 | Kernen mangler noget, der kan holde den sammen. | – | **+ Neutron** (0/2) og **+ Elektron** (1/2). Knapperne stopper ved 2 | Nu holder kernen. Neutronerne er en slags lim: De trækker uden at skubbe. Du har bygget helium. | neutron |
| 5 | Hydrogen og helium lyser nu i det periodiske system. Tryk på et af dem. | – | Tryk på H eller He (kun det lille periodiske system vises) | **Det så du:** kernesætningen og "Opdaget: 2 af 118" (tallet er det rigtige) | – |

- **Efter gættet** står én linje, før man prøver: trin 2 "En elektron" → "Prøv det!", "En proton mere" → "Det prøver vi om lidt. Prøv først en elektron." Trin 3: begge → "Prøv det!". Svaret kommer i Så.
- **Scenen i trin 3:** Kernen med to protoner ryster og blinker (det gør den allerede i dag ved "Falder fra hinanden"). Den henfalder ikke af sig selv, så man kan redde den i trin 4. I virkeligheden falder den fra hinanden med det samme (står i Kerne-fanen).
- **"Vis mig"** kommer efter ca. 20 sekunder uden noget: Værkstedet trykker selv på knappen.
- **Til sidst tre veje:** *Byg videre selv* (panelerne åbner, Værkstedet som i dag), *Se Solen lave helium* (Stjerneovnen) og *Hvorfor holder kernen?* (det "Hvorfor?"-kort, der findes).
- **Undervejs:** Belønningspillerne ("Opgave klaret", "Nyt grundstof") vises ikke, men gemmes i loggen, og opgaverne hydrogen, "to protoner" og helium bliver løst, fordi man har bygget dem. Fyrværkeriet i scenen bliver.

## 3. Valgt fra, og hvor det bor
Isotoper, henfald, skaller, elektronsky, ioner, fanerne, "Gør neutral", "Stabil kerne" og stabilitetskortet: i laboratoriet og som udfordringer bagefter. Hvorfor kernen holder (kernekraften): "Hvorfor?"-kortet `kernen` (lag 2). At kernen i virkeligheden falder fra hinanden på langt under et milliardtedel sekund: Kerne-fanen (lag 2).

## 4. Ordene
proton, (atom)kerne, elektron, grundstof, neutron. Fem ord. **Ingen af dem står i Ordbogen i dag** (se spørgsmålet til jer).

## 5. Prøven (tre spørgsmål bagefter)
1. Hvad er der i midten af et atom, og hvad er udenom?
2. Hvad gør hydrogen til hydrogen og helium til helium?
3. Hvorfor holdt kernen ikke med to protoner, og hvad hjalp?

## 6. Fakta, der skal tjekkes
- Hydrogen er det mest almindelige grundstof i universet.
- To protoner alene kan ikke holde sammen (helium-2 er ubunden). "Plus skubber plus væk" er en del af grunden, ikke hele (kernekraften mellem to protoner er også en tand for svag). Teksten siger ikke "kun".
- Neutronerne trækker med kernekraften uden at skubbe (passer med `HVORFOR.kernen`).
- 118 kendte grundstoffer.
- Teksterne til de fem ord i Ordbogen.

## Sådan bygges det (kort)
- `js/forloeb.js` (klodsen) og `js/data/forloeb/foerste-atom.js` (teksterne, fem felter pr. trin). Delen leverer pr. trin `start`, `knapper`, `færdig` og `visMig`.
- Klodsen sætter klassen `i-forløb` på skærmen (virker også i Liv, uden `js/paneler.js`), viser linjen og husker forløbet i `atomlabForløb`.
- Starter af sig selv første gang i Værkstedet. "Spring over" og "‹" i linjen. Tages igen fra listen over opgaver og fra hjælpen. ✓ i "Din fremgang". Eget link: `?forloeb=foerste-atom#vaerksted`.

## Faktatjek (12. november 2026)
| Påstand | Resultat | Kilde |
|---|---|---|
| Hydrogen er det mest almindelige grundstof i universet | OK (ca. ¾ af massen, ca. 9 af 10 atomer) | NASA "Ask an Astrophysicist" (via arkiv), RSC |
| To protoner er helium | OK: grundstoffet bestemmes af antallet af protoner | IUPAC (atomnummer) |
| "Plus skubber plus væk, **så** kernen falder fra hinanden" | **Rettet**: To neutroner kan heller ikke holde sammen. Kernekraften mellem to ens partikler er en tand for svag, og frastødningen gør det kun værre. Ny tekst: "…og to protoner alene kan ikke holde sammen" | arXiv 0904.1807, 2103.15744 (diprotonen er ubunden, også uden Coulomb) |
| Neutronerne trækker uden at skubbe | OK (kernekraften virker på dem, ingen ladning) | `HVORFOR.kernen` (faktatjekket) |
| 118 kendte grundstoffer | OK | IUPAC |
| Elektronen vejer ca. 1.800 gange mindre end en proton | OK (1836) | NIST CODATA |
| Neutronen vejer næsten det samme som protonen | OK (0,14 % mere) | NIST CODATA |
| Kernen er 10.000-100.000 gange mindre end atomet, og næsten al vægten sidder i den | OK (radius ca. 10⁻¹⁵ m mod ca. 10⁻¹⁰ m; hydrogen ca. 60.000, uran ca. 25.000 målt i diameter) | Lærebøger (fx Nagwa, Vaia), regnet efter |

## Jeres svar (12. november 2026)
- **Go** til drejebogen og linjen, som på billederne (knappen i linjen, ikke i byggepanelet).
- **Ordene** kommer i Ordbogen, men får kun prikker i forløbets linje (`kunI` i `js/data/ordbog.js`).
- **Toplinjen:** Under 1400 px står opgaven på sin egen række under toplinjen.
- **Undertitlen:** "Byg atomer og molekyler, lav kernereaktioner, se livets opskrift, og udforsk rummet".
