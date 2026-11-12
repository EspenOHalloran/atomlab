# E4: Opus' noter til Fables gennemgang af Tid

*Skrevet 12. november 2026 af Opus efter "Efter Fables svar" i [prompt-fable-tid.md](../prompt-fable-tid.md). Læst: [E4-tid.md](E4-tid.md), [plan-tid.md](../plan-tid.md) i uddrag, [koereplan.md](../koereplan.md) (nr. 4) og de linjer i koden, Fable peger på. Fables fil er ikke rettet.*

## Kort
Jeg er enig i Fables hovedfund: Tallene holder, men oplevelsen er ikke sat i scene, og svaret står fremme, før man har undret sig. F1-F4 er rettet nu (tabellen nedenfor), og efter jeres svar også F5-F9, F11 og F12. Det pædagogiske hører til ombygningen "Tid som ét punkt", som venter på Forløb-klodsen. Jeg er uenig i et par detaljer, ikke i retningen.

## Det, jeg har tjekket, og som passer
- **Linjerne:** F1 (`tidhvorfor.js:192`), F2 (`tid.js:129` og `tidhvorfor.js:194`), F3 (`tidhvorfor.js:72`) og F4 (`tidhvorfor.js:325`) står, som Fable skriver. F9 (`tid.js:64-65`: "ca. 70 gange" og "ca. 71 gange" i samme emne) og F11 (`hvorfor.js:113`) passer også.
- **CERN 1977:** Wikipedia "Experimental testing of time dilation" (læst i dag): "transverse acceleration of up to ~10¹⁸ g", og forsøget "confirmed both time dilation and the twin paradox". Regnet efter: ringens radius ca. 7 m og γ = 29,3 giver en egenacceleration på ca. 10¹⁸ g.
- **Tankeforsøget:** Wikipedia "Twin paradox" (læst i dag) har figuren "Differential aging despite identical accelerations" (Wiechert, 1911). Det er et tankeforsøg, ikke et forsøg, der er lavet.
- **Poincaré:** Wikipedia "Relativity of simultaneity" (læst i dag): Poincaré skrev om samtidighed som en aftale i 1898 og om ure, der stilles med lyssignaler, i 1900. "Ingen opdagede det før Einstein" var derfor for skarpt.
- **Myonerne:** γβcτ = 37,87 · 0,99965 · 658,6 m ≈ 24,9 km, og e^(−15/24,9) ≈ 0,55. "Ca. halvdelen" passer.
- **Drejebogens nye tal:** 50 % til Alpha Centauri (4,344 lysår i `js/data/tid.js:16`) giver 17,4 år på Jorden og 15,0 i skibet, altså 30 og 28. TRAPPIST-1 (40,66 lysår) ved 99,99 % giver 81,3 og 1,15 år, altså 94 og 14. Fødselsdagshilsnerne ved 80 % (Doppler-faktor 3): den rejsende får 1 + 9, tvillingen 3 + 3. Alle passer.
- **Skyderen "Fra gåben til lysets fart":** gå 0,34 ns, fly 11 µs, rumstationen 0,010 s, halv lysfart 49 dage og 99 % 314 dage passer. **Bilen** giver 0,14 µs ved 100 km/t og 0,2 µs først ved ca. 120 km/t. Skriv farten ved hvert tal, når den bygges.

## Rettet nu (F1-F4, `/faktatjek`)
| Nr. | Sted | Før | Nu | Kilde |
|---|---|---|---|---|
| F1 | `tidhvorfor.js:192` | "Derfor opdagede ingen det før Einstein. Han forklarede det …" | "Derfor har ingen nogensinde mærket det i hverdagen. Einstein forklarede det …" ("Han" ville ellers mangle et navn) | Wikipedia "Relativity of simultaneity" |
| F2 | `tid.js:129` | "Man kan lave forsøg, hvor begge ure speeder op og bremser lige meget …" | "Man kan tænke sig en rejse, hvor …" + "Og i et rigtigt forsøg på CERN i 1977 fulgte myonernes ure kun farten, selv om de blev slynget rundt i en ring med ca. en milliard milliarder g." | "Twin paradox" og "Experimental testing of time dilation" |
| F2 | `tidhvorfor.js:194` | "Man kan lave forsøg, hvor begge ure accelererer lige meget …" | Samme som ovenfor, kortere ("Og i CERN's ring …"), fordi forsøget står lige over i "Myonernes kapløb" | Samme |
| F3 | `tidhvorfor.js:72` | "Derfor når mange flere ned. Ved den typiske fart når de fleste ned, og det er det, man måler." | "Derfor når ca. halvdelen ned ved den typiske fart i stedet for næsten ingen. Det er målt (se For nørder)." | Egen udregning (55 %) |
| F4 | `tidhvorfor.js:325` | "toget står næsten stille i forhold til lyset" | "100 km/t er næsten ingenting mod lysets fart" | – |

Fælderne for F1-F3 har Fable allerede skrevet nederst i [fakta-faelder.md](../erfaringer/fakta-faelder.md). Der er ingen nye.

## Det, der er nyt i E4
- **Hjemkomsten mangler et menneske:** Ingen af de tre mål giver en gammel tvilling, der lever (21 år eller over 54.000 år). TRAPPIST-1 (94 år) løser det.
- **Skyderen starter ved 90 %,** så man aldrig ser, at der næsten intet sker ved halv lysfart (A3).
- **Scene 1's lygte viser intet ved 100 km/t** (billede c). B2 starter derfor ved 50 %.
- **Spørgsmålet i højre panel og svaret i underteksten** i alle fem scener.
- **F5 og F6:** Urene og "nu"-springet lyder som fejl for en skarp læser. Det er ikke forkert, men det er ikke sagt.
- **Fødselsdagshilsnerne** som den lette forklaring i stedet for "nu"-linjerne. Det er den bedste nye idé i E4, synes jeg: Man kan tælle dem, og det er det, man faktisk ville se.
- **Prøven med sønnen** (afsnit 6) er klar til brug.

## Det, der var kendt
- "Oplevelsen først, og én indgang": E1 punkt 6, og "Tid som ét punkt" i køreplanen (Serie 1 nr. 4).
- γ og µs uden forklaring i scene 3: E1 punkt 6 og billede e.
- Tre steder at læse på én gang: E3.
- T4, cockpittet, er sat på pause (lige-nu/tid.md, 8. november 2026).

## Hvor jeg er uenig eller vil tilføje noget
1. **F3 var ikke forkert.** 55 % er "de fleste". Problemet var tælleren ved siden af (11 af 24) og "det er det, man måler" (målingen var fra 1,9 km). Rettet alligevel, fordi "ca. halvdelen" er både rigtigt og det, man ser.
2. **Myonerne i forløb B afviger fra køreplanen.** Køreplanen (nr. 4, 11. november) siger: forløbet er Rejsen og scene 1-2, og scene 3-5 bliver "Vil du vide mere?". Fable lægger scene 3 ind som B5 ("Er det målt?"). Jeg er enig med Fable: Uden B5 ender forløb B i en tegning, og kernesætningen siger "Det er målt". Men B5 bør kun have én kontakt, som Fable skriver. Det er jeres valg, og jeg skriver det ind i køreplanen, når I svarer.
3. **"Hvorfor ikke omvendt?"** er det første, et klogt barn spørger om ("men set fra mig er det jo Jorden, der flyver"). Fable lægger svaret i lag 2. Det er rigtigt, men knappen skal stå i B6, så han kan finde den. Det gør den i drejebogen.
4. **De tegnede figurer i A1** er en ny slags grafik i AtomLab. Ser de billige ud, ødelægger de øjeblikket. Jeg vil gøre dem enkle (silhuetter) og vise jer et billede, før resten bygges.
5. **F5-F12:** Fable ville vente med dem til ombygningen. Da runden nu venter, til forløbene er bygget, blev de rettet med det samme (jeres valg, se nedenfor).
6. **Det hele venter på Forløb-klodsen** (sporet Forløb, ikke startet). Drejebogen kan ikke bygges før. Det, der kan bygges uden klodsen: TRAPPIST-1 som mål, 50 % på skyderen og fødselsdagshilsnerne.

## Jeres svar (12. november 2026, dialogen)
1. **To korte forløb** under ét punkt: "Rejsen i tid" og "Hvordan kan det ske?" (som drejebogen i E4, afsnit 4).
2. **TRAPPIST-1 som den første rejse,** så tvillingen bliver 94.
3. **Runden med jeres søn venter, til forløbene er bygget** (ikke Fables anbefaling). Fables liste i E4, afsnit 6, bruges dér.
4. **Scene 4 og "nu"-linjerne under "For nørder",** og fødselsdagshilsnerne bygges senere som den lette forklaring.
5. **Forløb B hedder "Hvordan kan det ske?"**
6. **F5-F12 rettes nu** (Opus' anbefaling). Gjort, se nedenfor.

## Rettet efter jeres svar (F5-F12, `/faktatjek`)
| Nr. | Sted | Nu |
|---|---|---|
| F5 | `tid.js`, "Ærligt talt" | Nyt afsnit: "Urene på skærmen viser tiden, som man regner den på Jorden. Set fra skibet er "nu" på Jorden et andet. Kun når I står ved siden af hinanden, er alle enige om, hvem der er ældst." |
| F6 | `tidhvorfor.js`, scene 5 | "ser den rejsende … Jordens ur gå langsomt" er blevet til "regner den rejsende … med, at Jordens ur går langsomt". "Ærligt talt" har fået: Springet sker ikke derhjemme, og i en kikkert ville Jordens ur vise 1 år ved vendingen og derefter gå 3 gange så hurtigt (regnet efter: Doppler-faktor 3 ved 80 %). |
| F7 | `tidhvorfor.js`, scene 4 og "For nørder" | "(regel 1!)" om lysets fart er blevet til "(den mærkelige regel!)", for "For nørder" nævner fysikkens love som den første af Einsteins to regler, ligesom Einstein selv. Dér står nu "(den første af Einsteins to regler)". |
| F8 | `tid.js`, "Hvad gør farten?" og Lige nu | "Det er kun dit ur, der går langsommere" er blevet til "Det, der bliver kortere og kortere, er tiden på dit ur". "Det er dit ur, der går langsommere" er blevet til "Set fra Jorden går dit ur langsommere". |
| F9 | `tid.js`, "Hurtigere end lyset? Nej!" | "ca. 70 gange hurtigere" er blevet til "ca. 71" (γβ = 70,7). Lige nu's "70,71 gange" er et udregnet tal for hver fart og er ikke rørt. |
| F11 | `hvorfor.js` | "Hvorfor kan et rumskib aldrig nå lysets fart?" (testen i `tests/tid.mjs` er rettet med). |
| F12 | `ordbog.js`, Tidsforlængelse | "… fordi det bevæger sig i forhold til os. Forskellen er bittelille, indtil farten nærmer sig lysets." |

**Ikke rettet:** F10 (afrundingen "12 år" og "og 4 dage" i hjemkomstteksterne) er regnekode i `js/data/tid.js` med egne tests. Den tages med ombygningen. De "mindre" punkter i E4 (fx "den særlige relativitetsteori" og Frisch og Smith to steder) venter også til ombygningen.

## Næste
1. "Tid som ét punkt" med de to forløb, når Forløb-klodsen findes (køreplanen, Serie 1 nr. 4). Drejebogen (E4, afsnit 4) skal have jeres go før.
2. Det, der kan bygges før klodsen, hvis I vil: TRAPPIST-1 som mål (med faktatjek) og 50 % på skyderen.
3. Runden med jeres søn, når forløbene er bygget, med listen i [E4-tid.md](E4-tid.md), afsnit 6.
