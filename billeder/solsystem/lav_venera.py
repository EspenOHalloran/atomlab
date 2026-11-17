# Laver Venera 13's farvefoto til turen ned gennem skyerne og stedets side (js/kosmos/venus-ned.js, V5 i
# docs/plan-venus.md).
# Kør:  python3 lav_venera.py <ud-mappe> [hentet tiff-fil]
# (kræver kun Pillow. Fotoet hentes selv fra NSSDC's billedkatalog. Svarer NSSDC ikke Python, så hent filen med
# curl -A 'AtomLab' -o v13.tiff <KILDE>, og giv den med som anden parameter)
#
# Kilden er NSSDC's TIFF-fil af farvepanoramaet (VG00261/262, 1. marts 1982, 170°, sat sammen af billeder med mørkeblåt,
# grønt og rødt filter). Fotoet vises fladt, som det er: Kameraet kiggede skråt ned og svingede fra side til side, så
# horisonten står i billedets øverste hjørner. Den tynde kant af papir og scanning skæres væk, og billedet gøres
# mindre (originalen er kun 1.000 punkter bred). Farverne rettes ikke.
import sys
import os
import urllib.request
from io import BytesIO
from PIL import Image

KILDE = 'https://nssdc.gsfc.nasa.gov/imgcat/higher_res/venera/v13_vg261_262.tiff'
BREDDE = 1400  # punkter i det færdige billede
KANT = (6, 6, 4, 6)  # venstre, top, højre, bund: kanten, der skæres væk (målt i middelværdien af søjler og rækker)


def main():
    ud = sys.argv[1] if len(sys.argv) > 1 else '.'
    if len(sys.argv) > 2:
        billede = Image.open(sys.argv[2]).convert('RGB')
    else:
        anmodning = urllib.request.Request(KILDE, headers={'User-Agent': 'AtomLab-billedvaerktoej/1.0 (et skoleprojekt)'})
        with urllib.request.urlopen(anmodning, timeout=60) as svar:
            billede = Image.open(BytesIO(svar.read())).convert('RGB')
    v, t, h, b = KANT
    billede = billede.crop((v, t, billede.width - h, billede.height - b))
    højde = round(billede.height * BREDDE / billede.width)
    billede = billede.resize((BREDDE, højde), Image.LANCZOS)
    sti = os.path.join(ud, 'venera13-foto.jpg')
    billede.save(sti, quality=86, optimize=True, progressive=True)
    print(sti, billede.size, os.path.getsize(sti), 'bytes')


if __name__ == '__main__':
    main()
