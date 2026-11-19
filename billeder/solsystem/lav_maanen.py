# Laver Månens højdekort i 2k og 4k (js/kosmos/jorden.js) ud fra LOLA-højderne i NASA's CGI Moon Kit.
# (1k-kortet til testene, maanen-hoejde-1k.png, laves stadig af lav_billeder.py.)
#
# Brug:  python3 -I lav_maanen.py <mappe med originalen> <ud-mappe>
# Originalen (public domain, NASA):
#   ldem_16_uint.tif  CGI Moon Kit (4720): https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_16_uint.tif
#                     5760 × 2880 (16 punkter pr. grad, ca. 1,9 km pr. punkt ved ækvator), halve meter.
#
# Højden gemmes som 12 bit (ca. 4,8 m pr. trin over de ca. 19,7 km fra det laveste til det højeste) i rød og grøn
# som 16 bit (den store del i rød, den lille i grøn), samme opbygning som 1k-kortet, så shaderen er den samme.
# 12 bit er nok til lyset på bjergene (4,8 m er ingenting mod en pixel på 2,7 km i 4k), og billedet bliver ca. en
# tredjedel mindre end med 16 bit. Gemmes som WebP uden tab (ca. 25 % mindre end PNG).
import os
import sys

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ind, ud = sys.argv[1], sys.argv[2]
BIT = 12

h = np.asarray(Image.open(os.path.join(ind, 'ldem_16_uint.tif')), np.float32)
lav, høj = float(h.min()), float(h.max())
a = (h - lav) / (høj - lav)  # 0-1, ligesom 1k-kortet
print('højdeforskel i km:', round((høj - lav) / 2000, 2))

trin = 1 << (16 - BIT)
for bredde in (2048, 4096):
    im = np.asarray(Image.fromarray(a, 'F').resize((bredde, bredde // 2), Image.BOX))
    v = (np.clip(np.round(im * 65535 / trin), 0, 65535 // trin) * trin).astype(np.uint32)
    rgb = np.zeros(v.shape + (3,), np.uint8)
    rgb[..., 0] = v >> 8
    rgb[..., 1] = v & 255
    navn = os.path.join(ud, f'maanen-hoejde-{bredde // 1024}k.webp')
    Image.fromarray(rgb, 'RGB').save(navn, lossless=True, method=6)
    print(navn, os.path.getsize(navn) // 1024, 'KB')
