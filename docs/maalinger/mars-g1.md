# Målinger: hakkene på Mars med `?maal` (G1 trin 2)

*Jeres målinger 13. november 2026 efter trin 1 (PR #195). Teksten fra "Kopiér" står nedenfor. Jeres ønske: "Lad os lave flere målinger, før vi konkluderer noget." Første kørsel tæller mindst (se nedenfor).*

## Det, I sagde
- **1. kørsel (bærbar med Intel Iris Xe):** "Den døde, da jeg ville ned og stå ved randen af Jezero. Tag resultaterne med et gran salt, for jeg ved ikke, om computeren har haft en anden opgave kørende i baggrunden, fx en virusscanning af Windows Defender."
- **2. kørsel (samme bærbar, efter en genstart):** "Det kørte meget bedre. Jeg synes ikke, vi skal tillægge første gennemkørsel alt for stor værdi. Jeg tror, den dårlige ydelse handlede mere om forhold på computeren end om AtomLab."
- **3. måling:** jeres søns gamer-bærbar (RTX 4060, skærm 3440 × 1440).

## Foreløbigt billede (ikke en konklusion, flere målinger kommer)
| | Iris Xe, 2. kørsel | RTX 4060 |
|---|---|---|
| Billeder i sekundet (gennemsnit / median) | 58 / 60 (17 ms) | 98 / 100 (10 ms) |
| 99 % af billederne under | 20 ms | 11 ms |
| Grafikkortets tid pr. billede | ca. 9,6 ms (lærred 1920 × 1080) | ca. 8,8 ms (3440 × 1440) |
| Ryk over 50 ms | 29 på 230 s | 13 på 193 s |
| Mars åbnes: 8k-kortet i grafikkortet | 677 ms | 371 ms |
| Stå på Mars, Gale: landingen | 1.757 ms (8k-fotoet 802 ms) | 912 ms (324 ms) |
| Stå på Mars, Jezero (Ved randen) | 1.877 ms (8k-fotoet 706 ms) | 832 ms (278 ms) |
| Solens shader (første gang i Solsystemet) | 229 ms | 174 ms |

- **Under flyvningerne** (2. kørsel): kun 3 små ryk (51-71 ms, ukendt årsag). Ingen nye shadere og ingen store kort. Trin 1 ser ud til at virke dér.
- **Tilbage er de store kort:** når Mars åbnes (8k-farvekortet og 4k-højden) og især ved landingen i Stå på Mars (landskabets kort på 8k og 4k, ca. 1,6-1,8 s på Iris Xe). De hentes med `<img>` i dag (ikke `vendt`).
- **Grafikkortet har luft** (ca. 9-10 ms pr. billede ved 60 billeder i sekundet). Forslag C, D og E (lavere opløsning, gløden og færre trekanter) ser ikke nødvendige ud på de to pc'er.
- **Fejl i måleren (rettet 13. november 2026):** "Kald 1, trekanter 1" var forkert. `renderer.info` blev nulstillet ved hvert `render`, så den viste kun gløden sidste trin. Grafikkortets tid var for hele billedet og var rigtig. Nu viser måleren også teksturerne i grafikkortet i MB (skøn). Med fuld grafik i testbrowseren: Mars ca. 256 MB, 36 kald og 1,06 mio. trekanter.
- **Fanen døde ved Jezero (1. kørsel):** Jeres svar: "Jeg tror, det skyldtes, at pc'en var optaget af andre ting. Den kom igen, da jeg vendte tilbage til skærmen." Den frøs altså og kom tilbage, den gik ikke ned. Tidligere tekst: Et gæt: hukommelsen. Landskabets kort bliver i grafikkortet, så efter Gale og Jezero er der mange store kort (skøn: flere hundrede MB) på et grafikkort, der deler hukommelse med en pc, der i forvejen var presset. Det skal måles (måleren viser ikke hukommelsen endnu).
- **Mangler:** tabletten, og en gentagelse på Iris Xe.

## Tabletten efter H (14. november 2026, kl. 19.01-19.05)
*Jeres måling efter G1 trin 3, del 2 (H, a + b, PR #225). Stå på Mars ved Gale (Naukluft) og Jezero (Ved randen) med ▶ og "🌅 Solnedgang". Skrevet ind af sessionen "Småting · Overblik og de næste fem sessioner". Hovedtallene og rykkene er gengivet nedenfor, og de mange ens linjer med "skyggerne regnes (grove, Solen flytter sig)" er slået sammen.*

**Opus' læsning:**
- **Mens man står stille:** 60 billeder i sekundet (17 ms), før ca. 10-18. **Forslag c (dynamisk opløsning) er ikke nødvendigt.**
- **Mens Solen flytter sig** (▶ og Solnedgang): ca. 50-90 ms pr. billede (11-20 billeder i sekundet), mange gange i træk. `opdater` og `tegn` bruger kun ca. 1-2 ms, så tiden går i grafikkortet med de grove skygger. Det er tilbage at løse (fx skyggerne regnet sjældnere eller spredt over flere billeder).
- **Ankomsten til Jezero:** ét ryk på 1.238 ms, hvor kortene lægges i grafikkortet (jezero-h2.png 358 ms, jezero-f2.jpg 198 ms og jezero-randen-f0.jpg 183 ms). Det er det, forslag A og F (`vendt`) skal løse. Gale: 82 ms med panoramaet (45 ms).

```
AtomLab-måler 14.11.2026, 19.05.03, skærm #solsystem
Grafikkort: ANGLE (ARM, Mali-G615 MC2, OpenGL ES 3.2)
Skærm 1280×800, vindue 1280×800, devicePixelRatio 1.5, touch (LAV_KVALITET): ja
Lærred 1920×1200 (pixelRatio 1.5)
Nu: 60 billeder/s, 17 ms pr. billede, værst (5 s) 38 ms
Kald 26, trekanter 940.104 (hele billedet), geometrier 82, teksturer 59, shaderprogrammer 36
Teksturer i grafikkortet (skøn): 403 MB nu, højst 568 MB. JavaScript-hukommelse: 18 MB
Siden start (222 s): 12.347 billeder, gennemsnit 56 billeder/s, median 16 ms, 95 % under 36 ms, 99 % under 52 ms, ryk over 50 ms: 193
Kort lagt i grafikkortet: 106 (3.321 ms i alt). Shaderprogrammer lavet: 15 (194 ms i alt)
De dyreste shadere: kort, harKort, farve 43 ms; uSol, rot, skySted 28 ms; tRing, uRingInd, tKort 23 ms; uMaane, uMaaneLys, uSol 17 ms; tF0, bF3, tS0 16 ms
De dyreste kort: 8192×4096 mars-8k.jpg 670 ms; 4096×4096 jezero-h2.png 358 ms; gale-h2.png 265 ms; jezero-f2.jpg 198 ms; jezero-randen-f0.jpg 183 ms; jezero-randen-f1.jpg 174 ms; gale-naukluft-f0.jpg 153 ms; gale-naukluft-f1.jpg 152 ms

Ryk (udvalg af de sidste 100):
19.03.10  82 ms (opdater 11, tegn 52): kort i grafikkortet 50 ms: pano-naukluft-4k.jpg 45 ms, pano-naukluft-maske.png 5,1 ms; skyggerne regnes; lang opgave 64 ms
19.03.26-19.03.52  ca. 45 ryk på 50-129 ms (opdater 0,4-2,2, tegn 0,8-2,5): skyggerne regnes (grove, Solen flytter sig)
19.03.46  138 ms: tryk: 🌅 Solnedgang
19.04.10  111 ms: hentet jezero.json; lang opgave 106 ms
19.04.13  79 ms: skyggerne regnes; lang opgave 71 ms
19.04.13  1238 ms (opdater 0,5, tegn 1231): kort i grafikkortet 1217 ms: jezero-h2.png 358 ms, jezero-f2.jpg 198 ms, jezero-randen-f0.jpg 183 ms, 6 små; lang opgave 1234 ms
19.04.26-19.04.54  ca. 40 ryk på 51-93 ms (opdater 0,4-2,3, tegn 0,6-2,0): skyggerne regnes (grove, Solen flytter sig)
```

## Tabletten (13. november 2026, kl. 19.04-19.08)
Mali-G615 MC2 (Android, Chrome), lærred 1920 × 1200 (pixelRatio 1,5, `LAV_KVALITET`). Jorden, Venus, Uranus, Neptun, Jupiter, Mars, Stå på Mars ved Gale og ved Jezero.
- **Gennemsnit 62 billeder i sekundet** (median 16 ms, 95 % under 29 ms, 99 % under 50 ms), 151 ryk på 238 s. Grafikkortets tid kan ikke måles på denne tablet.
- **Teksturerne i grafikkortet var ca. 849 MB** (skøn), selvom tabletten henter mindre kort. Det er over dobbelt så meget som budgettet i [retning.md](../retning.md) (ca. 350 MB på tablet). Den gik ikke ned.
- **Stå på Mars er tungt på tabletten:** Mens man stod ved Gale (fra 19.06.32 til "Tilbage til flybyen" 19.06.38) og ved Jezero (19.07.09-19.07.16), var næsten hvert billede 50-120 ms (ca. 10-18 billeder i sekundet) uden kendt årsag og med under 3 ms på hovedtråden. Så er det næsten sikkert grafikkortet (det kan ikke måles her). Måske da der blev kigget rundt.
- **Landingen:** Gale 1.362 ms (landskabets 3 shadere 242 ms og kortene 1.097 ms: `gale-h2.png` 310 ms, `gale-naukluft-f0.jpg` 179 ms …), Jezero 1.028 ms (kortene 1.010 ms). Landskabets shadere blev ikke lavet på forhånd, så tabletten kan nok ikke oversætte i baggrunden.
- **Andre ryk:** Mars åbnes 434 ms, Jupiters månekort på forhånd ca. 110 ms hver (fire ryk), Jordens kort 164 ms.
- Uddrag af teksten:
```
AtomLab-måler 13.11.2026, 19.08.01, skærm #solsystem
Browser: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36
Grafikkort: ANGLE (ARM, Mali-G615 MC2, OpenGL ES 3.2)
Skærm 1280×800, vindue 1280×800, devicePixelRatio 1.5, touch (LAV_KVALITET): ja
Lærred 1920×1200 (pixelRatio 1.5)
Nu: 62 billeder/s, 16 ms pr. billede, værst (5 s) 21 ms
Kald 27, trekanter 669.456 (hele billedet), geometrier 57, teksturer 93, shaderprogrammer 40
Teksturer i grafikkortet (skøn): 849 MB nu, højst 849 MB. JavaScript-hukommelse: 10 MB
Siden start (238 s): 14.790 billeder, gennemsnit 62 billeder/s, median 16 ms, 95 % under 29 ms, 99 % under 50 ms, ryk over 50 ms: 151
Kort lagt i grafikkortet: 72 (2.937 ms i alt). Shaderprogrammer lavet: 24 (607 ms i alt)
De dyreste shadere: tF0, bF3, tS0 106 ms; bLag, uPx, uSolL 82 ms; uMaane, uMaaneLys, uSol 54 ms; tRing, uRingInd, tKort 43 ms; uSol, rot, skySted 42 ms; kort, harKort, farve 40 ms
De dyreste kort: 4096×4096 gale-h2.png 310 ms; 4096×4096 jezero-h2.png 301 ms; 4096×4096 gale-naukluft-f0.jpg 179 ms; 4096×4096 gale-naukluft-f1.jpg 165 ms; 4096×4096 jezero-f2.jpg 164 ms; 4096×4096 jezero-randen-f1.jpg 149 ms; 4096×4096 gale-f2.jpg 148 ms; 4096×4096 jezero-randen-f0.jpg 138 ms
19.04.34-36  ca. 85-120 ms × 4: io-, europa-, ganymedes- og callisto-4k.jpg på forhånd
19.04.43  434 ms: 9 nye shadere 0,2 ms; tryk: 🔴Mars; lang opgave 430 ms
19.06.14  1362 ms (tegn 1355): 3 nye shadere 242 ms (bLag, uPx, uSolL | tF0, bF3, tS0 | uMaane, uMaaneLys, uSol); kort i grafikkortet 1097 ms: gale-h2.png 310 ms, gale-naukluft-f0.jpg 179 ms, gale-naukluft-f1.jpg 165 ms, 6 små
19.06.32-38  ca. 60 billeder på 50-134 ms, ingen kendt årsag (opdater og tegn under 3 ms), indtil "↑ Tilbage til flybyen"
19.07.00  1028 ms (tegn 1021): kort i grafikkortet 1010 ms: jezero-h2.png 301 ms, jezero-f2.jpg 164 ms, jezero-randen-f1.jpg 149 ms, 6 små
19.07.09-16  ca. 15 billeder på 50-100 ms, ingen kendt årsag (stående ved Jezero)
```

## 3. kørsel: Iris Xe om aftenen, med den rettede måler (13. november 2026, kl. 18.56-19.00)
Mars (flyby, Stå på Mars ved Gale), så menuen, Solsystemet igen og Saturn. Kopieret i menuen.
- **Det nye: teksturerne i grafikkortet er ca. 937 MB** (skøn, højst 938 MB), også efter man er gået tilbage til menuen. JavaScript-hukommelsen er 324 MB. Billederne fra `hent.js` bliver i grafikkortet, når man forlader en planet (med vilje, så den åbner hurtigt igen), men det strider mod [retning.md](../retning.md) ("Når man forlader en skærm, frigives dens billeder", højst ca. 350 MB på tablet). Det kan have været med til frysningen i 1. kørsel, og det er en risiko på tabletten.
- **Flyvningerne er stadig rene:** under flybyen kun ryk på 50-53 ms.
- **Store kort, der stadig hakker:** Mars' 8k-kort 678 ms, Stå på Mars ved Gale 1.576 ms (8k-fotoet 740 ms), panoramaet 203 ms. **Saturn:** månernes 8k-kort lægges i grafikkortet på forhånd lige efter hinanden: Enceladus 462, Tethys 420, Dione 679 og Rhea 391 ms (ca. 2 s i alt i fem ryk), og Saturns 7 shadere 268 ms.
- Uddrag af teksten:
```
AtomLab-måler 13.11.2026, 19.00.51, skærm #menu
Grafikkort: ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x00009A49) Direct3D11 vs_5_0 ps_5_0, D3D11)
Lærred 1920×1080 (pixelRatio 1.25)
Nu: 60 billeder/s, 17 ms pr. billede, værst (5 s) 47 ms, grafikkortet 6,8 ms pr. billede
Kald 39, trekanter 15.984 (hele billedet), geometrier 35, teksturer 58, shaderprogrammer 24
Teksturer i grafikkortet (skøn): 937 MB nu, højst 938 MB. JavaScript-hukommelse: 324 MB
Siden start (273 s): 15.854 billeder, gennemsnit 58 billeder/s, median 17 ms, 95 % under 18 ms, 99 % under 21 ms, ryk over 50 ms: 39
Kort lagt i grafikkortet: 72 (4.954 ms i alt). Shaderprogrammer lavet: 44 (660 ms i alt)
De dyreste kort: 8192×8192 gale-naukluft-f0-8k.jpg 740 ms; 8192×4096 dione-8k.jpg på forhånd 679 ms; 8192×4096 mars-8k.jpg 678 ms; 8192×4096 enceladus-8k.jpg på forhånd 462 ms; 8192×4096 tethys-8k.jpg på forhånd 420 ms; 8192×4096 rhea-8k.jpg på forhånd 391 ms; 4096×4096 gale-h2.png 238 ms; 8192×1883 pano-naukluft-8k.jpg 203 ms
18.56.19  785 ms: kort i grafikkortet 678 ms: 8192×4096 mars-8k.jpg
18.56.49  51 ms: tryk: ▶ Start flyby; kamerarejse starter
18.57.12  50 ms: tryk: Næste: Tharsis ›; kamerarejse starter
18.57.56  1576 ms: ny shader 3,6 ms (bLag, uPx, uSolL); kort i grafikkortet 1520 ms: gale-naukluft-f0-8k.jpg 740 ms, gale-h2.png 238 ms, gale-naukluft-f1.jpg 174 ms, 6 små
18.58.02  215 ms: kort i grafikkortet 207 ms: pano-naukluft-8k.jpg 203 ms
18.59.25  281 ms: 7 nye shadere 268 ms (Saturn: tRing, uRingInd, tKort | uSol, tKort, uHarKort …)
18.59.27  476 ms: enceladus-8k.jpg på forhånd 462 ms
18.59.28  430 ms: tethys-8k.jpg på forhånd 420 ms
18.59.30  695 ms: dione-8k.jpg på forhånd 679 ms
18.59.31  405 ms: rhea-8k.jpg på forhånd 391 ms
```

## 2. kørsel: Iris Xe efter genstart
```
AtomLab-måler 13.11.2026, 13.39.26, skærm #solsystem
Browser: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36
Grafikkort: ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x00009A49) Direct3D11 vs_5_0 ps_5_0, D3D11)
Skærm 1536×864, vindue 1536×864, devicePixelRatio 1.25, touch (LAV_KVALITET): nej
Lærred 1920×1080 (pixelRatio 1.25)

Nu: 60 billeder/s, 17 ms pr. billede, værst (5 s) 37 ms, grafikkortet 9,6 ms pr. billede
Kald 1, trekanter 1, geometrier 38, teksturer 70, shaderprogrammer 31
Siden start (230 s): 13.323 billeder, gennemsnit 58 billeder/s, median 17 ms, 95 % under 17 ms, 99 % under 20 ms, ryk over 50 ms: 29
Kort lagt i grafikkortet: 65 (4.618 ms i alt). Shaderprogrammer lavet: 14 (365 ms i alt)
De dyreste shadere: farveLys, farveMork, tid 229 ms (13.35.37); bLag, uPx, uSolL 51 ms (13.37.33); uSol, rot, skySted 23 ms (13.35.53); kam, sol, R 15 ms (13.35.53); kort, harKort, farve 14 ms (13.35.53); kort, harKort, farve 12 ms (13.35.53); diffuse, opacity, transmissionMapTransform 10 ms (13.35.53); tF0, bF3, tS0 4,6 ms (13.37.29)
De dyreste kort: 8192×8192 gale-naukluft-f0-8k.jpg 802 ms (13.37.33); 8192×8192 jezero-randen-f0-8k.jpg 706 ms (13.38.10); 8192×4096 mars-8k.jpg 677 ms (13.35.54); 4096×4096 jezero-h2.png 283 ms (13.38.10); 4096×4096 jezero-randen-f1.jpg 262 ms (13.38.11); 4096×4096 jezero-f2.jpg 251 ms (13.38.11); 4096×4096 gale-h2.png 243 ms (13.37.33); 4096×4096 jezero-f3.jpg 187 ms (13.38.11)

Ryk (de sidste 29):
13.35.37  218 ms (opdater 0,3, tegn 0,9): lang opgave 200 ms
13.35.37  245 ms (opdater 0,4, tegn 233): ny shader 229 ms (farveLys, farveMork, tid); kort i grafikkortet 0,0 ms: 1 små; lang opgave 239 ms; hentet jorden-… (Jordens kort)
13.35.37  122 ms (opdater 0,4, tegn 1,1): hentet jorden-dag-07-4k.jpg (1,1 MB); hentet jorden-skyer-4k.jpg (2,2 MB)
13.35.37  62 ms (opdater 0,2, tegn 1,6): ingen kendt årsag
13.35.38  180 ms (opdater 0,2, tegn 0,6): ingen kendt årsag
13.35.40  63 ms (opdater 0,2, tegn 0,5): ingen kendt årsag
13.35.49  201 ms (opdater 0,1, tegn 0,7): tryk: Skjul panelet til højre; lang opgave 197 ms
13.35.52  579 ms (opdater 0,1, tegn 0,7): 10 nye shadere 0,0 ms (…); tryk: 🔴Mars; lang opgave 572 ms; hentet mars-2k.jpg (0,3 MB)
13.35.53  118 ms (opdater 2,8, tegn 71): shadere 78 ms; kort i grafikkortet 0,0 ms: 6 små; lang opgave 101 ms
13.35.53  51 ms (opdater 0,5, tegn 45): kort i grafikkortet 42 ms: 2048×1024 mars-2k.jpg 42 ms; oprydning i hukommelsen (−119 MB)
13.35.53  263 ms (opdater 0,9, tegn 0,8): hentet mars-8k.jpg (3,6 MB); hentet mars-hoejde-4k.png (7,7 MB)
13.35.54  799 ms (opdater 0,5, tegn 678): kort i grafikkortet 677 ms: 8192×4096 mars-8k.jpg 677 ms; lang opgave 679 ms; lang opgave 119 ms
13.35.55  168 ms (opdater 0,5, tegn 149): kort i grafikkortet 148 ms: 4096×2048 mars-hoejde-4k.png 148 ms; lang opgave 150 ms; hentet mars-olympus-farve.jpg (0,1 MB); hentet phobos-4k.jpg (1,0 MB); hentet deimos-form.png (0,0 MB); hentet deimos-2k.jpg (0,3 MB)
13.35.55  54 ms (opdater 0,3, tegn 0,6): hentet phobos-form.png (0,2 MB)
13.35.55  104 ms (opdater 0,5, tegn 1,1): lang opgave 93 ms; hentet mars-olympus-hoejde-2k.png (2,8 MB)
13.35.55  60 ms (opdater 9,7, tegn 0,6): kort i grafikkortet 23 ms: 4096×2048 phobos-4k.jpg på forhånd 14 ms, 2048×2048 mars-olympus-hoejde-2k.png på forhånd 9,3 ms; oprydning i hukommelsen (−28 MB)
13.36.12  52 ms (opdater 0,4, tegn 0,3): ingen kendt årsag
13.36.53  71 ms (opdater 0,5, tegn 0,6): ingen kendt årsag
13.37.13  51 ms (opdater 0,6, tegn 0,8): hentet mars-jezero-hoejde-2k.png (2,1 MB); hentet mars-jezero-detalje-hoejde-2k.png (1,1 MB)
13.37.29  87 ms (opdater 0,3, tegn 0,5): 2 nye shadere 0,1 ms (tF0, bF3, tS0 | uMaane, uMaaneLys, uSol); kamerarejse starter; hentet pano-naukluft.json, pano-naukluft-maske.png, gale.json; lang opgave 77 ms
13.37.31  67 ms (opdater 0,6, tegn 0,7): lang opgave 60 ms
13.37.33  1757 ms (opdater 0,6, tegn 1724): ny shader 51 ms (bLag, uPx, uSolL); kort i grafikkortet 1622 ms: 8192×8192 gale-naukluft-f0-8k.jpg 802 ms, 4096×4096 gale-h2.png 243 ms, 4096×4096 gale-naukluft-f1.jpg 160 ms, 6 små; lang opgave 1747 ms
13.37.36  53 ms (opdater 0,2, tegn 0,3): ingen kendt årsag
13.37.39  211 ms (opdater 22, tegn 184): kort i grafikkortet 183 ms: 8192×1883 pano-naukluft-8k.jpg 178 ms, 2048×471 pano-naukluft-maske.png 4,4 ms; lang opgave 210 ms
13.37.39  72 ms (opdater 0,2, tegn 0,2): ingen kendt årsag
13.38.06  106 ms (opdater 0,5, tegn 1,0): tryk: 🧍 Stå på Mars; kamerarejse starter; hentet jezero.json (0,0 MB); lang opgave 92 ms
13.38.08  107 ms (opdater 0,7, tegn 1,3): lang opgave 93 ms
13.38.09  1877 ms (opdater 0,1, tegn 1872): kort i grafikkortet 1818 ms: 8192×8192 jezero-randen-f0-8k.jpg 706 ms, 4096×4096 jezero-h2.png 283 ms, 4096×4096 jezero-randen-f1.jpg 262 ms, 6 små; lang opgave 1876 ms
13.38.36  140 ms (opdater 0,4, tegn 1,4): ingen kendt årsag
```

## RTX 4060 (jeres søns bærbar)
```
AtomLab-måler 13.11.2026, 14.51.37, skærm #solsystem
Browser: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0
Grafikkort: ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Laptop GPU (0x000028E0) Direct3D11 vs_5_0 ps_5_0, D3D11)
Skærm 3440×1440, vindue 3440×1440, devicePixelRatio 1, touch (LAV_KVALITET): nej
Lærred 3440×1440 (pixelRatio 1)

Nu: 100 billeder/s, 10 ms pr. billede, værst (5 s) 30 ms, grafikkortet 8,8 ms pr. billede
Kald 1, trekanter 1, geometrier 37, teksturer 64, shaderprogrammer 31
Siden start (193 s): 18.831 billeder, gennemsnit 98 billeder/s, median 10 ms, 95 % under 10 ms, 99 % under 11 ms, ryk over 50 ms: 13
Kort lagt i grafikkortet: 59 (2.314 ms i alt). Shaderprogrammer lavet: 24 (280 ms i alt)
De dyreste shadere: farveLys, farveMork, tid 174 ms (14.48.29); bLag, uPx, uSolL 39 ms (14.49.59); kort, harKort, farve 36 ms (14.48.25); …
De dyreste kort: 8192×4096 mars-8k.jpg 371 ms (14.48.27); 8192×8192 gale-naukluft-f0-8k.jpg 324 ms (14.49.59); 8192×8192 jezero-randen-f0-8k.jpg 278 ms (14.50.37); 4096×4096 jezero-h2.png 183 ms (14.50.37); 4096×4096 gale-h2.png 167 ms (14.49.59); 8192×1883 pano-naukluft-8k.jpg 106 ms (14.50.04); 4096×4096 jezero-f2.jpg 98 ms (14.50.38); 4096×4096 gale-naukluft-f1.jpg 91 ms (14.49.59)

Ryk (de sidste 13):
14.48.25  71 ms (opdater 2,2, tegn 60): shadere 50 ms; fanen vises igen; lang opgave 66 ms
14.48.27  377 ms (opdater 0,3, tegn 372): kort i grafikkortet 371 ms: 8192×4096 mars-8k.jpg 371 ms; lang opgave 372 ms
14.48.28  77 ms (opdater 0,2, tegn 0,3): hentet mars-hoejde-4k.png (7,7 MB); oprydning i hukommelsen (−9 MB); lang opgave 74 ms
14.48.28  89 ms (opdater 0,3, tegn 83): kort i grafikkortet 83 ms: 4096×2048 mars-hoejde-4k.png 83 ms; lang opgave 83 ms
14.48.29  178 ms (opdater 0,2, tegn 175): ny shader 174 ms (farveLys, farveMork, tid); tryk: ☀️Solen; lang opgave 176 ms
14.48.49  379 ms (opdater 0,0, tegn 0,3): 10 nye shadere 0,0 ms (…); tryk: 🔴Mars; lang opgave 377 ms
14.49.00  86 ms (opdater 0,3, tegn 0,3): ingen kendt årsag
14.49.54  55 ms (opdater 0,3, tegn 0,3): 2 nye shadere 0,0 ms (tF0, bF3, tS0 | uMaane, uMaaneLys, uSol); tryk: 🧍 Stå på Mars; kamerarejse starter; lang opgave 51 ms
14.49.58  63 ms (opdater 0,4, tegn 0,3): hentet gale-h2.png (11 MB); lang opgave 57 ms
14.49.59  912 ms (opdater 0,4, tegn 909): ny shader 39 ms (bLag, uPx, uSolL); kort i grafikkortet 844 ms: 8192×8192 gale-naukluft-f0-8k.jpg 324 ms, 4096×4096 gale-h2.png 167 ms, 4096×4096 gale-naukluft-f1.jpg 91 ms, 6 små; lang opgave 910 ms
14.50.04  121 ms (opdater 11, tegn 109): kort i grafikkortet 109 ms: 8192×1883 pano-naukluft-8k.jpg 106 ms, 2048×471 pano-naukluft-maske.png 3,2 ms; lang opgave 120 ms
14.50.32  52 ms (opdater 0,3, tegn 0,4): tryk: 🧍 Stå på Mars; kamerarejse starter; hentet jezero.json (0,0 MB)
14.50.37  832 ms (opdater 0,2, tegn 830): kort i grafikkortet 812 ms: 8192×8192 jezero-randen-f0-8k.jpg 278 ms, 4096×4096 jezero-h2.png 183 ms, 4096×4096 jezero-f2.jpg 98 ms, 6 små; lang opgave 832 ms
```

## 1. kørsel: Iris Xe, pc'en var måske presset (tæller mindst)
Uddrag: overskriften og rykkene fra Stå på Mars og frem, til fanen døde ved Jezero (Ved randen).
```
AtomLab-måler 13.11.2026, 13.28.10, skærm #solsystem
Browser: … Chrome/156.0.0.0 Safari/537.36
Grafikkort: ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x00009A49) Direct3D11 vs_5_0 ps_5_0, D3D11)
Skærm 1536×864, vindue 1536×864, devicePixelRatio 1.25, touch (LAV_KVALITET): nej
Lærred 1920×1080 (pixelRatio 1.25)
Nu: 60 billeder/s, 17 ms pr. billede, værst (5 s) 50 ms, grafikkortet 8,8 ms pr. billede
Siden start (330 s): 15.934 billeder, gennemsnit 49 billeder/s, median 17 ms, 95 % under 19 ms, 99 % under 35 ms, ryk over 50 ms: 108
Kort lagt i grafikkortet: 78 (12.006 ms i alt). Shaderprogrammer lavet: 37 (2.143 ms i alt)
De dyreste kort: 8192×4096 mars-8k.jpg 1990 ms; 8192×8192 gale-naukluft-f0-8k.jpg 1597 ms; 8192×8192 jezero-randen-f0-8k.jpg 1479 ms; 4096×4096 gale-f3.jpg 930 ms; 4096×4096 gale-f2.jpg 826 ms; 8192×1883 pano-naukluft-8k.jpg 717 ms; 4096×4096 jezero-h2.png 679 ms; 4096×4096 gale-h2.png 674 ms
(Under flyvningerne mange ryk på 60-460 ms uden kendt årsag og ét på 4.252 ms ved Valles Marineris, de fleste med lange opgaver.)
13.25.20  5981 ms (opdater 2,5, tegn 5589): ny shader 86 ms (bLag, uPx, uSolL); kort i grafikkortet 5258 ms: 8192×8192 gale-naukluft-f0-8k.jpg 1597 ms, 4096×4096 gale-f3.jpg 930 ms, 4096×4096 gale-f2.jpg 826 ms, 6 små; lang opgave 5958 ms
13.25.26  687 ms: oprydning i hukommelsen (−132 MB); lang opgave 675 ms
13.25.31  4270 ms (opdater 3478, tegn 732): kort i grafikkortet 730 ms: 8192×1883 pano-naukluft-8k.jpg 717 ms; lang opgave 4211 ms
13.25.38  1475 ms: lang opgave 1136 ms; lang opgave 326 ms
13.25.45  1422 ms: lang opgave 1202 ms
13.26.18  3554 ms (tegn 3500): kort i grafikkortet 3391 ms: 8192×8192 jezero-randen-f0-8k.jpg 1479 ms, 4096×4096 jezero-h2.png 679 ms, 4096×4096 jezero-f2.jpg 402 ms, 6 små; lang opgave 3507 ms
13.26.33  5083 ms: lang opgave 2842 ms
13.27.04  251 ms: tryk: 🧍 Stå på Mars; kamerarejse starter; lang opgave 234 ms
13.27.28  5335 ms: ingen kendt årsag
13.27.33  1207 ms (opdater 487): lang opgave 720 ms; lang opgave 485 ms
(… derefter døde fanen ved Jezero, Ved randen)
```
