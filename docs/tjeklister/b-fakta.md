# Tjekliste B. Ny eller ændret tekst med fakta

- [ ] Før hjælpeagenter sættes i gang med at søge: tjek med `curl`, at kildesiderne kan åbnes. Er de blokeret, så bed brugeren om at tilføje domænerne under miljøets Network access først. Giver curl "unable to get local issuer certificate" eller "unable to verify the first certificate", er siden ikke blokeret: Der mangler et certifikat i containeren (se "Certifikater" i [netsider-og-arbejdsgang.md](../erfaringer/netsider-og-arbejdsgang.md)).
- [ ] Planlæg kilderne, før opgaven går i gang: Står et domæne ikke på listen over åbne domæner, så spørg brugeren om adgang først (brugerens svar 29. oktober 2026, da library.si.edu og archive.org var lukket under citatet til Saturn).
- [ ] Er en netside eller et værktøj blokeret (fx GitHub-udgivelser til `basisu` i Mars M2), så stop og bed brugeren om adgang, før arbejdet fortsætter med en nødløsning (brugerens svar 24. oktober 2026). Adgang, der åbnes midt i sessionen, virker ikke altid med det samme (GitHub gav stadig 403 i S1). I Mars M3 virkede msss.com først ca. en halv time senere, så prøv igen, før du giver op, og ellers i en ny session.
- [ ] Hvert tal er regnet efter eller slået op. Udregningen står i en kommentar eller i commit-beskeden.
- [ ] Kilden er primær eller pålidelig (fagbøger, NIST, IUPAC, NUBASE, NASA, forskningsartikler). Populærvidenskab og "alle siger det" er ikke nok. Se fælderne i [fakta-faelder.md](../erfaringer/fakta-faelder.md).
- [ ] Litteraturhenvisninger (tidsskrift, bind, sider) er slået op i kilden, ikke skrevet efter hukommelsen (S2).
- [ ] Kilden handler om præcis det samme (samme billede, samme dag, samme instrument). Et søgeresultat om et andet panorama fra samme sted gav en forkert påstand om farverne (M8c del 1).
- [ ] Citater: præcis ordlyd fra den oprindelige kilde (bog, afsnit, år). Er ordlyden usikker, så skriv det, eller lad citatet være.
- [ ] Er det spillets eget tal (fx 80 mio. °C eller 6-16 spaltninger), så skriv "i spillet" og det rigtige tal ved siden af.
- [ ] Brug "ca.", "typisk" eller "de fleste", når virkeligheden har undtagelser.
- [ ] Tekster, der sættes sammen af data (fx "opdaget 1868 af …"), er læst i den færdige form for alle tilfælde (lav et lille script, der skriver dem alle ud).
- [ ] Fagord forklares med få ord første gang, de bruges i en tekst (fx "en neutrino (en næsten usynlig partikel)", "en alfapartikel (en heliumkerne)"). Læs teksten, som om du ikke kan fysik.
- [ ] Står der et tal fra spillet (fx "6-16"), så sig også, hvad det tæller ("spaltninger i sekundet i det grønne felt").
- [ ] Nye fagord kommer i ordbogen (`js/data/ordbog.js`), så de kan trykkes på. Forklaringen er højst 260 tegn.
- [ ] Flytter en tekst til en anden side eller fil (fx et sted i Solsystemet), så søg efter links til den (Ordbogens `LINKS`, `data-gaa`, `HVORFOR`), og lad dem pege på det sted, teksten står nu (U3).
- [ ] Undertekster (trin og faser): Pointen står i første sætning, og teksten er under ca. 160 tegn. På tablet og telefon ses kun to linjer, og man trykker sjældent på "Mere". Detaljer hører til i panelet eller "For nørder".
