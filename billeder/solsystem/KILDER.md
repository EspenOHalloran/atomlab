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
| `saturn-4k.jpg` og `-2k.jpg` | Saturns skybånd (til prototypen med Saturn) | [Solar System Scope](https://www.solarsystemscope.com/textures/) (bygger på NASA's billeder), hentet fra Wikimedia Commons | CC BY 4.0, Solar System Scope skal nævnes |
| `saturn-ringe.png` | Ringenes farver og fine striber, 2048 × 1, lagt på de rigtige grænser med `lav_saturn.py` (ringbilledets egne afstande passer ikke helt) | Lavet af Solar System Scopes ringbillede (`8k_saturn_ring_alpha.png`), hentet fra Wikimedia Commons | CC BY 4.0, Solar System Scope skal nævnes |
| `enceladus-4k.jpg` og `-2k.jpg` | Enceladus' overflade (gråtoner, 110 m pr. pixel i originalen) | NASA/JPL/Space Science Institute, Cassini ISS, global mosaik fra USGS Astrogeology (`Enceladus_Cassini_mosaic_global_110m`) | Public domain (NASA/USGS) |
| `titan-4k.jpg` og `-2k.jpg` | Titans overflade i nær-infrarødt lys, set gennem disen (gråtoner, 4 km pr. pixel) | NASA/JPL-Caltech/Space Science Institute, Cassini ISS, PIA19658, fra USGS Astrogeology | Public domain (NASA) |

`lav_saturn.py` laver billederne til Saturn, Enceladus og Titan (adresserne står øverst i filen).
