# Tjekliste D. Ny del (skærm), eller ændring i start og stop

- [ ] Stop-funktionen rydder **alt**: timere, kameraets mål, kamerabegrænsninger, pause, guide, beskeder og cursor.
- [ ] Alle `setTimeout` tjekker `aktiv` eller bliver ryddet i stop.
- [ ] Opgavelister og tal bygges, når delen startes, så de passer efter "Start forfra" og nulstilling.
- [ ] Paneler opdateres højst 4 gange i sekundet og kun, når noget har ændret sig, ikke hvert billede.
- [ ] Brug de fælles byggeklodser (beskeder, guide, pause, "Næste skridt") i stedet for at kopiere.
- [ ] En CSS-regel, der skal vinde over en regel med et id (fx `#fusion .vindue { grid-area: vindue }`), skal selv have et id, fx `:is(#fusion, #reaktor).skjul-venstre > .vindue`. Ellers sker der ingenting (panelerne i oktober 2026).
- [ ] `document.querySelectorAll` er afgrænset til delen (`#reaktor .del-knap`) eller bruger en data-attribut, som kun findes der. Får to skærme den samme skal (Kosmos og Solsystemet), står den nye skærm efter den gamle i index.html, så tests uden afgrænsning stadig finder den gamle. En klasse kan bruges på flere skærme. Det samme gælder CSS-regler, også dem i `@media` (fx `order`).
- [ ] Værdier, der styrer tilstanden (fx `tilstand = 'kerne' | 'kæde'`), tjekkes, så en ukendt værdi ikke giver en tom skærm.
- [ ] Kameraets fælles indstillinger nulstilles af `nulstilStyring()` i main.js. En del, der ændrer andre indstillinger, skal også nulstille dem der.
- [ ] Nye knapper eller steder i Kosmos og Solsystemet: Sortér dem efter de fire slags i [plan-ux.md](../plan-ux.md) (sted, forsøg, tur og styring), og sæt dem på den plads, planen siger. Et sted, man flyver hen til, er aldrig en knap blandt kontakterne, og en kontakt skal ligne en kontakt. Siden U2: et sted står i træet (`træ`, `gåTil`), en handling i bjælken (`styring` med `handling`, og `skjul`, hvis den kun giver mening i nogle tilstande), en kontakt eller skyder i Styr-boksen, trin i `trin()` og en tur i `tur`. Tiden styres kun med tidsknappen (`ctx.tiden`, `hurtig`, `tempo`), aldrig med en kontakt.
- [ ] En ny til/fra-knap er en kontakt med et fast navn (`lavKontakt` i `js/kontakt.js`, i Kosmos og Solsystemet en kontakt i Styr-boksen), ikke en knap, der skifter tekst. Tiden styres med tidsknappen (`lavTidsknap`), ikke med egne pause- eller tempoknapper (U4).
- [ ] En handling i bjælken er tjekket i alle tilstande, fænomenet kan være i (fx "▶ Start flyby", mens man står på Mars, U2).
- [ ] En handling, der fører ind i en ny tilstand midt på en tur (fx "🧍 Stå på Mars" på flybyen), sætter turen på pause, så dens "Næste" ikke virker i den forkerte tilstand, og giver én tydelig knap tilbage til turen (fundet af brugeren efter M8b).
- [ ] Et element, der skjules med `hidden`, men har `display` i CSS (flex, grid, block), får en regel `.x[hidden] { display: none; }`. Ellers står det gamle indhold fremme (plutonium ved copernicium, 7. november 2026).
- [ ] Skifter en skærm mellem dele (del-knapper som i Reaktoren og Værkstedet), så gør delskiftet det, main.js gør ved et skærmskift: stop kameraets sving og zoom (`stopKamera`), ryd beskeder og "Hvorfor?"-kortet, og nulstil kameraets styring (Byttebørsen, M1a).
- [ ] Et træk i 3D-billedet, der ikke skal dreje kameraet (fx en elektron, man flytter), fanges i `pointerdown` med `{ capture: true }` på lærredet, og `verden.styring.enabled` sættes til falsk, til fingeren slipper. Et skærmskift midt i trækket skal sætte styringen til igen.
