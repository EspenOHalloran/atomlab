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
- **Svar på K3 (7. november 2026):** "go" til K3. Citatet må gerne forsvinde fra menuen, og den tomme plads øverst på højkant skal rettes. Men K2 laves først, og K3 bagefter. Pladsen på højkant blev rettet i K2. **K3 kommer nu efter K4** (verdenerne, [plan-verdener.md](plan-verdener.md)), så gitteret kun fjernes én gang.
- **Prototype først:** Karrusellen vises kun med `?karrusel` i adressen, så I kan prøve den på tabletten på GitHub Pages, uden at menuen ændrer sig.

## Rækkefølgen (efter størrelse)
Fra det mindste til det største: **Stjerneovnen** (lette kerner smelter sammen) → **Reaktoren** (en tung kerne flækker) → **Atomværkstedet** → **Det periodiske system** → **Batteriet** (ioner i et stof) → **Solsystemet** → **Kosmos**, og til sidst **Ordbogen** (et opslagsværk, ikke et sted). En ny bruger starter på Atomværkstedet, næsten i midten. Stjerneovnen kunne også stå ved Solsystemet (den foregår inde i Solen), men det, man ser, er kerner. Nye dele senere: Kvantefysik helt til venstre, Molekyler, Ild og Liv efter Batteriet, og Gåderne efter Kosmos.

## Trin
- [x] **K1: Prototypen bag `?karrusel`** (lavet 7. november 2026, først som en lige række og samme dag bygget om til ringen på elektronbanen, se nedenfor; testen `karrusel` har 96 tjek): ringen (træk og kast med fjeder, musehjul, piletaster, tryk på et kort til siden drejer det frem), rækkefølgen, docken med ikonerne, ✓ på klarede dele, "Din fremgang" og start på den del, man sidst var i (`atomlabSidsteDel`). Den almindelige menu er uændret. Kortet forrest står i `#menu[data-midt]`, så K2 kan bygges ovenpå. Citatet er skjult i ringen (ingen plads).
- [x] **K2: Baggrunden skifter med (B)** (lavet 7. november 2026, stadig kun med `?karrusel`, jeres go efter billedet af idéen): Bag atomet toner et let motiv frem for kortet forrest, og to motiver glider blødt over i hinanden, når ringen drejes (`js/menubaggrund.js`). Motiverne: kanten af en stjerne, der bobler (Stjerneovnen), reaktorbassinet med blåt Tjerenkov-lys (Reaktoren), elektronskyer og partikler (Værkstedet), det periodiske system svagt og skråt med ét felt, der lyser op ad gangen, ioner gennem midten og elektroner i en bue over atomet samme vej (Batteriet), planetbaner med de rigtige omløbstider mod uret og afstandene presset sammen (Solsystemet), en spiralgalakse (Kosmos) og ord fra Ordbogen, der svæver op. Ingen billeder, der skal hentes. Tabletten får færre prikker og en enklere stjerne. Samtidig går banen højere op på højkant (ingen tom plads under titlen). Testen `karrusel` har 107 tjek.
- [x] **K4: Verdenerne i ringen** (lavet 8. november 2026, se [plan-verdener.md](plan-verdener.md)).
- [x] **K3: Karrusellen bliver standard** (lavet 8. november 2026 med [prompt-menu-k3.md](arkiv/prompt-menu-k3.md)): Ringen vises altid, og `?karrusel` er væk. Gitteret, de gule piller, linjen med tallene, citatet og "Næste eventyr" er fjernet. "Start her" og ✓ på delene står nu i karrusel.js. Testene, der tjekkede det gamle, er rettet.

## Ringen på en elektronbane (jeres ønske 7. november 2026)
- **Jeres ord:** "Kan vi gøre karussellen flottere? Lidt mere svævende måske. Og måske lidt mere ellipseformet. Kan vi tage inspiration fra en elektron eller en planets kredsløb?" Og: "fint med elektronbane. det skal være lækkert at se på. rigtig lækkert. nærmest noget apple kunne have lavet." Effort: høj (Opus' anbefaling). Et billede af idéen før grafikken bygges.
- **Idéen (billedet er lavet 7. november 2026):** Kortene kredser om menuens atom på en skrå, lysende elektronbane (klar fortil, svag bagtil, små lysprikker med hale). Kortet forrest er stort og skarpt, kortene til siden mindre og mørkere (lysstyrke, ikke gennemsigtighed, så de ikke skinner igennem). Kun forrest, ±1 og ±2 vises. Kort af tæt, frostet glas med en lyskant foroven. Ikonrækken bliver en dok af glas med en lille prik under den valgte del. Ringen drejer med fjeder og fart, og kortene svæver let.
- **Ikke i billedet, men i byggeriet:** bevægelsen (det vigtigste), svæven, at banen går bag om atomet, vip mod musen på pc og en billigere udgave på tabletten, hvis sløringen koster for meget.

## Åbent (7. november 2026)
- **"Ellipseformet skulle der stå"** er afklaret: ringen på elektronbanen ovenfor. Jeres svar på billedet: "retningen er god. go". Ringen er bygget (K1).
- **Jeres runde på tabletten** (spørgsmålene står i [ikke-afproevet.md](ikke-afproevet.md)): Hvordan føles fjederen og kastet? Kører den glat? Savner I citatet? På højkant er der lidt tom plads øverst.
- **Ringen går rundt**, så Ordbogen står mellem Kosmos og Stjerneovnen. Docken viser rækkefølgen fra mindst til størst. Med 12 dele senere skal kortene stå tættere (vinklen mellem dem er 360° delt med antallet).
