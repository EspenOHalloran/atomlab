# Laver kortene over Uranus' fem store måner (UN4 i docs/plan-uranus-neptun.md, js/solsystem/isgigant.js).
# Hent originalerne til en mappe (navnene nedenfor), og kør:
#   python3 -I lav_uranus_maaner.py <mappe med originaler> <ud-mappe>        miranda-1280.jpg ... oberon-1280.jpg
#
# Originalerne (Caltech/JPL/USGS, mosaikker af Voyager 2's billeder fra januar 1986, public domain), fra Wikimedia
# Commons' småbilleder i 1280 pixels bredde (originalerne er 1440 x 720, men Commons svarede 429 på dem):
#   https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Miranda_map_JPL_USGS.jpg/1280px-Miranda_map_JPL_USGS.jpg
#   https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ariel_map_JPL_USGS.jpg/1280px-Ariel_map_JPL_USGS.jpg
#   https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Umbriel_map_JPL_USGS.jpg/1280px-Umbriel_map_JPL_USGS.jpg
#   https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Titania_map_JPL_USGS.jpg/1280px-Titania_map_JPL_USGS.jpg
#   https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Oberon_map_JPL_USGS.jpg/1280px-Oberon_map_JPL_USGS.jpg
# Gem dem som Miranda.jpg, Ariel.jpg, Umbriel.jpg, Titania.jpg og Oberon.jpg. Hent dem langsomt (Commons' grænse).
#
# Kortene er gråtoner, 0° (siden mod Uranus) i midten og østlig længde til højre (som programmets måner). Det er tjekket
# med Wunda på Umbriel (7,9° S, 273,6° Ø) og Inverness Corona på Miranda (66,9° S, 325,7° Ø). Voyager 2 så kun den
# sydlige halvdel (Solen stod over månernes sydpoler i 1986), og resten er sort i originalerne. Den sorte del bliver
# en blød, jævn grå flade med månens gennemsnitlige lysstyrke ("aldrig fotograferet"), som glider ind over ca. 2°.

import sys, os
import numpy as np
from PIL import Image, ImageFilter

MÅNER = ['Miranda', 'Ariel', 'Umbriel', 'Titania', 'Oberon']
SORT = 10  # pixel under dette er "ikke fotograferet"
KANT = 3  # pixel, der skæres væk langs kanten af det fotograferede (JPEG-støj)
BLØD = 7  # pixel (ca. 2°), som det fotograferede glider over i den grå flade


def lav(ind, ud):
    for navn in MÅNER:
        im = Image.open(os.path.join(ind, f'{navn}.jpg')).convert('L')
        a = np.asarray(im).astype(np.float64)
        h, w = a.shape
        assert w == 2 * h, (navn, a.shape)
        # Småbillederne har en ødelagt sidste søjle og række (springet til naboen er ca. 25 mod 1-3 ellers). Søjlen
        # bliver gennemsnittet af naboerne på begge sider af ±180°, og rækken ved sydpolen bliver én værdi (et punkt).
        a[:, -1] = (a[:, -2] + a[:, 0]) / 2
        a[-1, :] = a[-2, :].mean()
        maske = Image.fromarray(((a > SORT) * 255).astype(np.uint8))
        maske = maske.filter(ImageFilter.MinFilter(2 * KANT + 1))  # skær kanten væk
        m = np.asarray(maske).astype(np.float64) / 255
        # Gennemsnittet af det fotograferede (vægtet med cos(bredde), så polen ikke tæller for meget)
        bredde = (0.5 - (np.arange(h) + 0.5) / h) * np.pi
        vægt = np.cos(bredde)[:, None] * m
        grå = (a * vægt).sum() / vægt.sum()
        # Blød kant: masken sløres, men kun ind i det fotograferede (uden for er der intet at blande med)
        blød = np.asarray(maske.filter(ImageFilter.GaussianBlur(BLØD))).astype(np.float64) / 255
        blød = np.clip(2 * blød - 1, 0, 1) * m
        ny = grå + blød * (a - grå)
        dækket = vægt.sum() / np.cos(bredde)[:, None].repeat(w, 1).sum()
        # Kanten ved ±180°: springet mellem første og sidste søjle (tjekliste E)
        spring = np.abs(ny[:, 0] - ny[:, -1]).mean()
        nabo = np.abs(np.diff(ny, axis=1)).mean()
        Image.fromarray(np.clip(ny + 0.5, 0, 255).astype(np.uint8)).save(os.path.join(ud, f'{navn.lower()}-1280.jpg'), quality=90)
        print(f'{navn}: {w} x {h}, gennemsnit {grå / 255:.3f}, fotograferet {dækket * 100:.0f} % af overfladen, '
              f'spring ved ±180° {spring:.1f} (naboer {nabo:.1f})')


if __name__ == '__main__':
    lav(sys.argv[1], sys.argv[2])
