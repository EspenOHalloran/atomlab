# Erfaringer: det, der virker, og det, der ikke virker

*Delt op i mindre filer 6. november 2026, så en ny session ikke skal læse det hele (filen var ca. 110 KB, ca. 50.000 tokens). Intet er slettet. Denne fil er nu kun en oversigt.*

Erfaringerne skal gøre os mere præcise og hurtigere. De har tre dele:
1. **Tjeklister**, som bruges, mens man arbejder: [docs/tjeklister/](tjeklister/).
2. **Rodårsager:** hvorfor fejlene opstod.
3. **Konkrete erfaringer:** det, der virker, og faldgruberne, sorteret efter emne.

Når noget går galt eller virker særlig godt, skrives det ind med det samme: kort, konkret og med det, vi gjorde ved det. Får en fejl en ny rodårsag, skal den også ind i en tjekliste. Nye erfaringer skrives ind under det emne, de hører til (lav en ny fil, hvis intet passer, og sæt den ind i listen her), ikke som et nyt afsnit pr. opgave.

**Rammer du en merge-konflikt i denne fil** (en anden session har skrevet i den gamle, store udgave): Flyt din nye tekst over i den fil nedenfor, hvor emnet hører til, og behold denne oversigt.

## 1. Tjeklisterne ([docs/tjeklister/](tjeklister/))
| Tjekliste | Hvornår |
|---|---|
| [A. Før et stykke arbejde er færdigt](tjeklister/a-foer-faerdig.md) | Altid før commit og push (`/faerdig`). |
| [B. Ny eller ændret tekst med fakta](tjeklister/b-fakta.md) | Før en tekst med tal, datoer, forklaringer eller citater skrives (`/faktatjek`). |
| [C. Ny regel, beregning eller spillogik](tjeklister/c-regler-og-spillogik.md) | Før en ny regel eller ny spillogik bygges. |
| [D. Ny del (skærm), eller ændring i start og stop](tjeklister/d-ny-del.md) | Før en ny skærm, et nyt fænomen, nye knapper eller kontakter. |
| [E. Ny animation, effekt, grafik, kamera eller fælles funktion](tjeklister/e-animation-grafik-kamera.md) | Før ny grafik, shadere, kort, kamerastop, flyvninger eller en ny fælles funktion. |
| [F. Tests](tjeklister/f-tests.md) | Før nye tests skrives, eller når en test fejler. |

## 2. Rodårsager og fælder
- [Rodårsager](erfaringer/rodaarsager.md): tabellen over, hvorfor fejlene opstod, og hvilken tjekliste der fanger dem.
- [Kendte fælder i fakta](erfaringer/fakta-faelder.md): populære påstande, der er forkerte eller for skarpe. Læses ved alle tekster med fakta.

## 3. Konkrete erfaringer ([docs/erfaringer/](erfaringer/))
| Emne | Indhold |
|---|---|
| [Arbejdsmåde, der virker](erfaringer/arbejdsmaade.md) | Mål i stedet for at gætte, faktatjek og kodereview med agenter, testadgangen, skærmbilleder, hjælpeagenter. |
| [Faldgruber: kamera og layout](erfaringer/kamera-og-layout.md) | Kamera, layout, links i teksterne, dansk sortering, citater, testtal. |
| [Faldgruber: tid, timere og tilstand](erfaringer/tid-timere-tilstand.md) | Pause, `dt`, timere, tilstand ved skærmskift. |
| [Faldgruber: tests og værktøjer](erfaringer/tests-og-vaerktoejer.md) | Playwright, `koer-alle.mjs`, ventetider, processer. Også "Testsamlingen". |
| [Planeter og måner](erfaringer/planeter-og-maaner.md) | Billeder, højdekort, net, luft, skyer, Phobos og Deimos. |
| [Jupiter](erfaringer/jupiter.md) | Kortet (OPAL og Cassini), vindene, pletten, månerne og skyggerne. |
| [Uranus og Neptun](erfaringer/uranus-neptun.md) | Kilderne til isgiganterne: grumsede kort, månernes kort, Horizons og domænerne. |
| [Kameraet, rejsen og flybyen](erfaringer/kamera-rejse-flyby.md) | Saturn i skala, kameraet ned til et sted, flybyerne, hop ved stop, hent på forhånd. |
| [Stå på Mars](erfaringer/staa-paa-mars.md) | Landskabet, lyset, Gale, Jezero og rovernes fotos. |
| [Shadere og lysbøjningen](erfaringer/shadere.md) | Det sorte hul: fysikken i Node først, lysets bane i shaderen, tynde ting under en pixel, `dFdx`, dybden, langsom testbrowser. |
| [Skærme og UI](erfaringer/skaerme-og-ui.md) | Fælles skal, UX-eftersyn, styringen på billedet, siden i lag, Byttebørsen og Byg molekyler (træk i 3D, klassenavne, der allerede findes, panelet uden rullebjælke med kort og ladninger). |
| [Netsider, certifikater og arbejdsgang](erfaringer/netsider-og-arbejdsgang.md) | Certifikatfejl, flere små opgaver i træk, miljøets domæner, Wikipedia (429) og NIST CCCBDB. |
| [Åbne punkter](erfaringer/aabne-punkter.md) | Ting, der ikke er opklaret eller testet. |
