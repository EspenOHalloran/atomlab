# Laver Huygens' billeder fra luften til "Land med Huygens" (spor Måner, M5a, js/maaner/nedtur.js og
# js/data/maaner/landhuygens.js, docs/drejebog-maaner.md afsnit 8 og 13).
# Kør:  python3 -I lav_huygens.py <PIA07234.mov> <ud-mappe>
# (kræver Pillow og ffmpeg. Originalen ligger ikke i repoet. Hent den med
#  curl -o PIA07234.mov https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia07/pia07234/PIA07234.mov)
# Billedet fra jorden (M5b, huygens/jorden.webp):  python3 -I lav_huygens.py --jorden <PIA07232.tif> <ud-mappe>
# (hent den med
#  curl -o PIA07232.tif https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia07/pia07232/PIA07232.tif)
# PIA07232 "First Color View of Titan's Surface" (credit NASA/JPL/ESA/University of Arizona) er Huygens' billede fra jorden
# med farverne lagt på bagefter ud fra Huygens' måling af lyset. Originalen er 546 × 693 med en hvid kant om billedet. Vi
# skærer kanten væk (316 × 628 punkter) og ændrer ellers intet. Stenenes plads i billedet står i JORDEN i
# js/data/maaner/landhuygens.js og passer kun til dette udsnit.
#
# Kilden er NASA Photojournal PIA07234 "Descent Through Clouds to Surface" (credit: NASA/JPL/ESA/University of Arizona,
# ESA skriver "ESA/NASA/JPL/University of Arizona"): en film af Huygens' egne sort-hvide billeder fra kameraet DISR
# under nedstigningen 14. januar 2005, fra 152,4 km til jorden. Hvert billede står i filmen i 5 billeder (15 i sekundet),
# og højden står øverst i hvert billede (fx "25.4 km"). Højderne i HØJDER er aflæst der (20. november 2026), så hvert
# billede har sin højde fra kilden selv. Vi skærer teksten og den sorte kant væk og gemmer billedet i fuld størrelse
# (ca. 200 × 335 punkter, så skarpt som filmen): Huygens' kamera havde kun få punkter pr. billede.
# Licensen er ESA's standardlicens (må bruges til undervisning med credit), se billeder/solsystem/KILDER.md.
import os
import subprocess
import sys
import tempfile
from PIL import Image

# Billedets nummer i filmen (0 = det første) og højden, der står på det (km). Udvalgt, så der er et billede ca. hver
# gang, noget nyt kan ses: disen højt oppe, de første spor af jorden ved ca. 30 km, flodsporene, sletten og bakkerne
HØJDER = [
    (1, 147.7), (7, 113.6), (10, 75.6), (13, 53.4), (19, 39.1), (21, 30.8), (22, 25.4), (33, 21.9),
    (41, 17.9), (48, 15.7), (58, 13.3), (71, 7.8), (85, 2.8), (93, 1.5), (99, 0.7),
]
BILLEDER_PR = 5  # filmbilleder pr. Huygens-billede
UDSNIT = (12, 53, 212, 388)  # venstre, top, højre, bund: billedet uden højden og den sorte kant (filmen er 233 × 400)


def navn(km):
    return f'luft-{round(km * 10):04d}.webp'


JORDEN_UDSNIT = (115, 32, 431, 660)  # billedet uden den hvide kant (PIA07232.tif er 546 × 693)


def jorden(tif, ud):
    billede = Image.open(tif).convert('RGB')
    if billede.size != (546, 693):
        raise SystemExit(f'Uventet størrelse {billede.size}: tjek JORDEN_UDSNIT')
    udsnit = billede.crop(JORDEN_UDSNIT)
    # Tjek, at der ikke er hvid kant tilbage (kanten er næsten 255 i alle tre farver)
    for x, y in [(0, 300), (udsnit.width - 1, 300), (150, 0), (150, udsnit.height - 1)]:
        if min(udsnit.getpixel((x, y))) > 240:
            raise SystemExit(f'Hvid kant ved {(x, y)}: tjek JORDEN_UDSNIT')
    os.makedirs(ud, exist_ok=True)
    mål = os.path.join(ud, 'jorden.webp')
    udsnit.save(mål, 'WEBP', quality=88, method=6)
    print(f'jorden.webp  {udsnit.size}  {os.path.getsize(mål) // 1024} KB')


def main():
    if len(sys.argv) == 4 and sys.argv[1] == '--jorden':
        jorden(sys.argv[2], sys.argv[3])
        return
    if len(sys.argv) < 3:
        print('Brug: python3 -I lav_huygens.py <PIA07234.mov> <ud-mappe>')
        sys.exit(1)
    film, ud = sys.argv[1], sys.argv[2]
    os.makedirs(ud, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['ffmpeg', '-v', 'error', '-i', film, os.path.join(tmp, '%03d.png')], check=True)
        alle = 0
        for nr, km in HØJDER:
            # Det midterste af de fem filmbilleder (ffmpeg tæller fra 1)
            fil = os.path.join(tmp, f'{nr * BILLEDER_PR + 3:03d}.png')
            billede = Image.open(fil).convert('L')
            if billede.size != (233, 400):
                raise SystemExit(f'Uventet størrelse {billede.size}: tjek UDSNIT')
            mål = os.path.join(ud, navn(km))
            billede.crop(UDSNIT).save(mål, 'WEBP', quality=82, method=6)
            alle += os.path.getsize(mål)
            print(f'{navn(km)}  {km:5.1f} km  {os.path.getsize(mål) // 1024} KB')
        print(f'I alt {alle // 1024} KB')


if __name__ == '__main__':
    main()
