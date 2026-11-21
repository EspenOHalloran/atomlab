# Kode: kvalitetstrinnet på touch

*Lavet 20. november 2026 (G1 del 2, [plan-kvalitetstrin.md](../plan-kvalitetstrin.md), status prøve). Koden står i `js/scene3d.js` lige efter kantudglatningen (G2).*

- **To trin på touch** (`LAV_KVALITET`): *Basis* (skarphed højst 1,5, `FXAAPass`, gløden sat til en fjerdedel af lærredet i `tilpasStørrelse`) og *Høj* (skarphed højst 2, `SMAAPass` og gløden i halv opløsning som på pc). Pc'en har kun ét trin, og `sætTrin` gør intet dér.
- `sætTrin('basis' | 'høj')` sætter `renderer.setPixelRatio`, `komponist.setPixelRatio`, kalder `tilpasStørrelse` og `skiftKanter`. `kvalitetstrin()` giver trinnet. `skarphed()` er den fælles regel for `pixelRatio` (også ved start).
- `vælgKvalitet(tilladt)` kaldes af `main.js` ved hvert skærmskift, før skærmens `start`. `tilladt` er `høj: true` i `SKÆRME` (`js/skaerme.js`) eller menuen. Må den nye skærm ikke, går den til Basis. Må den, beholdes trinnet (billedet springer ikke).
- **Den automatiske måling** `vogtTrin` (i billedløkken, efter `vogtKanter`): `TRIN_GRÆNSER` = op ved mindst 58 billeder/s i 3 s, ned under 45 i 2 s. Efter et fald er skærmen låst i Basis resten af besøget. De første 1,5 s efter et skift (`ro`) og billeder over 0,5 s (`ryk`) tæller ikke. Skiftene meldes til måleren (`?maal`), som også viser trinnet ved lærredet. Ikke med `?test`. Testene slår den til med `autoTrin(true)`.
- **Hænger sammen med:** Skærme, der læser `renderer.getPixelRatio()` én gang, når de bygges (fx `betelgeuse.js` og `overblik.js` i Kosmos), skal læse den igen, før de får `høj: true`. Menubaggrunden (`menubaggrund.js`) læser den i hvert billede. Partikler, kuglernes felter og teksturer følger stadig `LAV_KVALITET`, fordi de bygges ved start.
- **Test:** `tests/grafik.mjs` (tabletten med devicePixelRatio 2 i Værkstedet: Basis, Høj, Kosmos går til Basis, faldet under 45 og pc uændret).
