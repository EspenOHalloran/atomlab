# Kilder til billederne

Billederne bruges af Jorden og Månen i Kosmos (`js/kosmos/jorden.js`) og senere af Solsystemet.
Hvert billede står her med, hvor det kommer fra, og hvilken licens det har.
NASA's billeder er offentligt ejede (public domain), men NASA skal nævnes som kilde. Det sker i hjælpen til Kosmos og under "For nørder".

`lav_billeder.py` laver filerne ud fra originalerne (adresserne står øverst i filen). `-4k` er 4096 × 2048 (pc), `-2k` er 2048 × 1024 (tablet og telefon).

| Fil | Hvad | Kilde | Licens |
|---|---|---|---|
| `jorden-dag-01/04/07/10-4k.jpg` og `-2k.jpg` | Jorden om dagen i januar, april, juli og oktober 2004 (med havdybde) | NASA Earth Observatory, Blue Marble Next Generation, billederne 73580, 73655, 73751 og 73826 | Public domain (NASA) |
| `jorden-nat-4k.jpg` og `-2k.jpg` | Byernes lys om natten, 2016. Den svage blå baggrund (land i måneskin) er trukket fra | NASA Earth Observatory, Black Marble 2016 (billede 144898) | Public domain (NASA) |
| `jorden-skyer-4k.jpg` og `-2k.jpg` | Skyer (gråtoner) | NASA Earth Observatory, Blue Marble: Clouds (billede 57747) | Public domain (NASA) |
| `jorden-hoejde-2k.png` | Jordens højder over havet (16 bit i rød og grøn) | NASA Earth Observatory, Topography (billede 73934), bygger på GEBCO | Public domain (NASA) |
| `jorden-hav.png` | Hav og land (hvidt = hav), 2048 × 1024, til Solens glimt i havet | Lavet med `havkort.py` af [global-land-mask](https://github.com/toddkarin/global-land-mask), som bygger på NOAA's GLOBE-data | MIT |
| `maanen-4k.jpg` og `-2k.jpg` | Månens overflade i farver | NASA Scientific Visualization Studio, CGI Moon Kit (4720), fra Lunar Reconnaissance Orbiter (LROC) | Public domain (NASA) |
| `maanen-hoejde-1k.png` | Månens højder (ca. 19,7 km fra det laveste til det højeste, 16 bit i rød og grøn) | NASA SVS, CGI Moon Kit (4720), fra LRO's højdemåler (LOLA) | Public domain (NASA) |
| `saturn-4k.jpg` og `-2k.jpg` | Saturns skybånd (til prototypen med Saturn). Kildens fil hedder "8k", men er kun 4096 × 2048, så der er ingen 8k-udgave | [Solar System Scope](https://www.solarsystemscope.com/textures/) (bygger på NASA's billeder), hentet fra Wikimedia Commons | CC BY 4.0, Solar System Scope skal nævnes |
| `saturn-ringe.png` | Ringenes farver og fine striber, 2048 × 1, lagt på de rigtige grænser med `lav_saturn.py` (ringbilledets egne afstande passer ikke helt) | Lavet af Solar System Scopes ringbillede (`8k_saturn_ring_alpha.png`), hentet fra Wikimedia Commons | CC BY 4.0, Solar System Scope skal nævnes |
| `enceladus-8k.jpg`, `-4k.jpg` og `-2k.jpg` | Enceladus' overflade (gråtoner, 110 m pr. pixel i originalen, ca. 14.400 pixel rundt). Originalens sidste søjle (den første igen) og tomme nederste række er skåret væk | NASA/JPL/Space Science Institute, Cassini ISS, global mosaik fra USGS Astrogeology (`Enceladus_Cassini_mosaic_global_110m`) | Public domain (NASA/USGS) |
| `mimas-4k.jpg` og `-2k.jpg` | Mimas' overflade (gråtoner, 216 m pr. pixel i originalen) | NASA/JPL/Space Science Institute, Cassini ISS, global mosaik lavet af DLR, fra USGS Astrogeology (`Cassini_DLR_Mimas.zip`, `MI_170630_DLR_basemap`) | Public domain (NASA/USGS) |
| `tethys-8k.jpg`, `-4k.jpg` og `-2k.jpg` | Tethys' overflade (gråtoner, 293 m pr. pixel, 11.520 pixel rundt) | NASA/JPL/Space Science Institute, Cassini ISS, global mosaik fra USGS Astrogeology (`Tethys_Cassini_mosaic_global_293m`) | Public domain (NASA/USGS) |
| `dione-8k.jpg`, `-4k.jpg` og `-2k.jpg` | Diones overflade (gråtoner, 154 m pr. pixel, 23.040 pixel rundt) | NASA/JPL/Space Science Institute, Cassini ISS og lidt fra Voyager, global mosaik fra USGS Astrogeology (`Dione_Cassini_Voyager_mosaic_global_154m`) | Public domain (NASA/USGS) |
| `rhea-8k.jpg`, `-4k.jpg` og `-2k.jpg` | Rheas overflade (gråtoner, 417 m pr. pixel, 11.520 pixel rundt) | NASA/JPL/Space Science Institute, Cassini ISS og lidt fra Voyager, global mosaik fra USGS Astrogeology (`Rhea_Cassini_Voyager_mosaic_global_417m`) | Public domain (NASA/USGS) |
| `titan-4k.jpg` og `-2k.jpg` | Titans overflade i nær-infrarødt lys, set gennem disen (gråtoner, 4 km pr. pixel) | NASA/JPL-Caltech/Space Science Institute, Cassini ISS, PIA19658, fra USGS Astrogeology | Public domain (NASA) |

`lav_saturn.py` laver billederne til Saturn og månerne (adresserne står øverst i filen). 8k laves kun, hvor originalen har mindst 8.192 pixel hele vejen rundt (Mimas og Titan har det ikke). Månernes kort har længdegrad 0° (siden, der vender mod Saturn) i midten og øst til højre.

## Mars

`lav_mars.py` laver billederne til Mars (`js/kosmos/mars.js`) ud fra originalerne hos USGS (adresserne står øverst i filen). `lav_steder.py` laver de lokale kort over stederne (først Olympus Mons, Mars M7a) og læser kun vinduet om stedet direkte hos USGS. Kortene har længdegrad 0° i midten og øst til højre. `-8k` er 8192 × 4096 (pc og, som en prøve, tablet), `-4k` bruges, hvis grafikkortet ikke kan klare 8k, og `-2k` bruges af testene.

| Fil | Hvad | Kilde | Licens |
|---|---|---|---|
| `mars-8k.jpg`, `-4k.jpg` og `-2k.jpg` | Mars i farver (925 m pr. pixel i originalen). Den tomme første søjle i mosaikken er udfyldt, og de mørke egne er gjort gråbrune i stedet for blålige (mosaikkens blå kanal er næsten den samme overalt) | NASA/JPL/USGS, Viking MDIM 2.1, global farvemosaik fra USGS Astrogeology (`Mars_Viking_ClrMosaic_global_925m`) | Public domain (NASA/USGS) |
| `mars-hoejde-4k.png` og `-2k.png` | Mars' højder fra −8,5 til 21,5 km over nulpunktet (areoiden), 16 bit i rød og grøn, i trin på ca. 3,7 m | NASA/GSFC, MOLA-holdet (Mars Global Surveyor), global mosaik fra USGS Astrogeology (`Mars_MGS_MOLA_DEM_mosaic_global_463m`) | Public domain (NASA/USGS) |
| `mars-olympus-hoejde-2k.png` og `-1k.png` | Lokalt højdekort over Olympus Mons (27,5° N til 9,5° N og 143,5° V til 124,5° V, ca. 0,5 km pr. pixel i 2k), samme skala som `mars-hoejde` (16 bit i rød og grøn). Hvor HRSC+MOLA har kasseformede fejl på sletterne (ca. 0,5 % af området), er MOLA brugt i stedet (se `lav_steder.py`) | ESA/DLR/FU Berlin (HRSC på Mars Express) og NASA/GSFC (MOLA), lagt sammen af USGS: Fergason, Hare og Laura 2018, `Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2` (200 m pr. pixel). MOLA-delen fra `Mars_MGS_MOLA_DEM_mosaic_global_463m` | **CC BY-SA 3.0 IGO** (HRSC) og CC0 (MOLA), ifølge USGS' side. Udsnittet deles under CC BY-SA 3.0 IGO |
| `mars-olympus-farve.jpg` | Farverne over det samme område, 1024 × 1024 (ca. 1 km pr. pixel), med samme farverettelse som `mars-8k.jpg`. Viking MDIM 2.1 i 232 m pr. pixel blev prøvet, men har skygger fra Solen, da billederne blev taget, som ville modsige programmets eget lys | NASA/JPL/USGS, Viking (`Mars_Viking_ClrMosaic_global_925m`) | Public domain (NASA/USGS) |
