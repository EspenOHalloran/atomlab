# Plan: Menuen som en karrusel, og fremgangen mindre fremme

*Startet 7. november 2026. Idéen er jeres (fra trin 0 i Molekyler M1, se "Menuen som en karrusel" i [ideer.md](ideer.md)). Opus' vurdering og forslag står i samtalen fra 7. november 2026 og er skrevet ind her.*

## Hvorfor
- **Karrusellen:** Menuen har 8 kort i et gitter (4 + 4). Liv, Ild, Kvantefysik og Gåderne gør det til 10-12, og det kan gitteret ikke rumme pænt. På telefonen skal man rulle for at nå Solsystemet, Kosmos og Ordbogen. En karrusel ligner startskærmen i et spil, og kortet i midten får plads til mere.
- **Fremgangen:** I dag har alle 8 kort en gul pille ("5/16 ★", "0/9 set", "60 fagord"), der er en linje med alle tallene under kortene, og "Næste eventyr" peger på den næste del i en fast rækkefølge (aldrig på Solsystemet eller Kosmos). Det gør menuen til en tjekliste. "Set" tæller besøg og ikke noget, man har klaret, og "60 fagord" er slet ikke fremgang.

## Jeres svar (7. november 2026)
- **B og C:** Karrusellen med en række ikoner (A), og baggrunden bag kortene skifter med emnet (B). Delene står efter størrelse (C).
- **Fremgangen:** "Han går lidt op i det." Derfor får kortene et lille ✓, når en del er helt klaret, og tallene flyttes til "Din fremgang", som man selv åbner. "Næste eventyr" erstattes af, at karrusellen starter på den del, man sidst var i. "Start her" bliver til en ny bruger. Opgaverne og stjernerne inde i delene bliver, som de er.
- **Karrusellen bruges alle steder** (pc, tablet og telefon), ikke kun på tablet og telefon.
- **Rækkefølgen er efter størrelse** (C).
- **Ordbogen bliver i karrusellen** (ikke en knap i hjørnet).
- **Prototype først:** Karrusellen vises kun med `?karrusel` i adressen, så I kan prøve den på tabletten på GitHub Pages, uden at menuen ændrer sig.

## Rækkefølgen (efter størrelse)
Fra det mindste til det største: **Stjerneovnen** (lette kerner smelter sammen) → **Reaktoren** (en tung kerne flækker) → **Atomværkstedet** → **Det periodiske system** → **Batteriet** (ioner i et stof) → **Solsystemet** → **Kosmos**, og til sidst **Ordbogen** (et opslagsværk, ikke et sted). En ny bruger starter på Atomværkstedet, næsten i midten. Stjerneovnen kunne også stå ved Solsystemet (den foregår inde i Solen), men det, man ser, er kerner. Nye dele senere: Kvantefysik helt til venstre, Molekyler, Ild og Liv efter Batteriet, og Gåderne efter Kosmos.

## Trin
- [ ] **K1: Prototypen bag `?karrusel`** (bygget 7. november 2026, testen `karrusel` har 80 tjek; venter på jeres svar om "ellipseformet", se nedenfor) (lille til mellem, Opus medium): karrusellen (stryg, pile, musehjul, tastatur, tryk på et kort ved siden af flytter det ind i midten), rækkefølgen, ikonrækken, ✓ på klarede dele, "Din fremgang" og start på den del, man sidst var i (`atomlabSidsteDel`). Den almindelige menu er uændret. Kortet i midten står i `#menu[data-midt]`, så K2 kan bygges ovenpå.
- [ ] **K2: Baggrunden skifter med (B)** (mellem til stor, eget go). 3D-billedet bag kortene skifter til delens emne. Skal holdes let på tabletten (ingen 8k-kort i menuen).
- [ ] **K3: Karrusellen bliver standard** efter jeres runde på tabletten: gitteret, de gule piller, linjen med tallene og "Næste eventyr" fjernes, og testene rettes (`system` tjekker i dag "Næste eventyr").

## Ringen på en elektronbane (jeres ønske 7. november 2026)
- **Jeres ord:** "Kan vi gøre karussellen flottere? Lidt mere svævende måske. Og måske lidt mere ellipseformet. Kan vi tage inspiration fra en elektron eller en planets kredsløb?" Og: "fint med elektronbane. det skal være lækkert at se på. rigtig lækkert. nærmest noget apple kunne have lavet." Effort: høj (Opus' anbefaling). Et billede af idéen før grafikken bygges.
- **Idéen (billedet er lavet 7. november 2026):** Kortene kredser om menuens atom på en skrå, lysende elektronbane (klar fortil, svag bagtil, små lysprikker med hale). Kortet forrest er stort og skarpt, kortene til siden mindre og mørkere (lysstyrke, ikke gennemsigtighed, så de ikke skinner igennem). Kun forrest, ±1 og ±2 vises. Kort af tæt, frostet glas med en lyskant foroven. Ikonrækken bliver en dok af glas med en lille prik under den valgte del. Ringen drejer med fjeder og fart, og kortene svæver let.
- **Ikke i billedet, men i byggeriet:** bevægelsen (det vigtigste), svæven, at banen går bag om atomet, vip mod musen på pc og en billigere udgave på tabletten, hvis sløringen koster for meget.

## Åbent (7. november 2026)
- **"Ellipseformet skulle der stå"** er afklaret: ringen på elektronbanen ovenfor. Venter på jeres mening om billedet og et go til at bygge ringen.
