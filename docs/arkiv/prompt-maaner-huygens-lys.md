# Prompt: Måner · Huygens' lys og jorden under faldet

*Lavet 22. november 2026 (se docs/lige-nu/maaner.md). Lagt i kø 22. november 2026 af orkestratoren efter jeres skærmbilleder fra "Land med Huygens" på telefonen. **Venter på jeres go**, og I vælger selv, hvornår den startes. Ny session, Opus, høj effort. Kopiér prompten nedenfor.*

## Det, I så (22. november 2026)
1. **Huygens og faldskærmen er kridhvide og gløder** som en lyspære (ved 92 km og ved 7,9 km).
2. **Jorden ses ikke i scenen**, selv om Huygens' kamera i hjørnet viser jorden tydeligt ved 13 km, og teksten spørger "Hvornår kan det se jorden?". Ved 7,9 km ser kameraet næsten lige ned på faldskærmen, men bagved er der kun dis.

## Orkestratorens bud (læst i koden, ikke prøvet på skærmen)
- `js/maaner/nedtur.js` ca. linje 217-220: `AmbientLight(0xffb878, 1.1)` + `DirectionalLight(0xffd8a8, 1.0)` overbelyser de lyse materialer, og gløden gør det værre. Ved Titans overflade er lyset meget svagt (Titan får ca. 1 % af Jordens sollys, og kun en lille del når gennem disen; slå tallet op, før det skrives nogen steder).
- Jorden i kuplen (`SIGT = 15.8`, `exp(-s/uSigt)`) burde ses ca. 60 % ved 7,9 km, når man ser ned. Mulige grunde: gløden vasker den ud, kortet `titan-2k.jpg` er ikke hentet på telefonen (`uHarKort` = 0), eller jordens og disens farver ligger for tæt.

## Prompt
"Spor Måner: Huygens' lys og jorden under faldet i 'Land med Huygens'. Læs docs/prompt-maaner-huygens-lys.md (det, brugeren så, og orkestratorens bud), docs/lige-nu/maaner.md, drejebogen docs/drejebog-maaner.md afsnit 8, docs/kode/ om js/maaner/nedtur.js og js/maaner/landhuygens.js, tjekliste E og docs/erfaringer/ om Måner. Tjek i origin/main, at det ikke er lavet. (1) Find med skærmbilleder (telefon på højkant 412×915, på langs og tablet, også med LAV_KVALITET), hvorfor Huygens og faldskærmen er hvide og gløder, og skru lyset ned, så de ses i et dæmpet orange lys fra disen, som det er ved Titan. Slå lysniveauet ved overfladen op (Tomasko m.fl. 2005) og skriv i nørd-teksten, hvad tegningen snyder med. (2) Find, hvorfor jorden ikke ses i scenen, når kameraet ser ned (også på telefonen), og ret det, så jorden toner frem efter de samme højder som Huygens' egne billeder (anes ca. 30 km oppe, klar under 5 km). Tjek med `?test` og skærmbilleder ved 40, 20, 8 og 2 km fra siden og ovenfra. Faktatjek nye tal (/faktatjek), --ændret i baggrunden, /faerdig, PR og merge."
