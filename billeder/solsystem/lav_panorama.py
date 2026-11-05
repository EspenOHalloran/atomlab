# Laver rovernes panoramaer til "Stå på Mars" (Mars M8c del 1 i docs/plan-mars.md, js/solsystem/panorama.js).
# Kør:  python3 lav_panorama.py <ud-mappe> [orig=mappe]   (kræver numpy, scipy og Pillow)
# Originalerne hentes fra NASA's Photojournal (assets.science.nasa.gov), hvis de ikke ligger i orig-mappen.
#
# Fotoene er 360°-striber i en ligevinklet cylinder: Retningen vokser med uret mod højre, og der er lige mange pixel
# pr. grad vandret og lodret (målt 5. november 2026, se "M8c del 1: rovernes panoramaer, målingerne" i plan-mars.md):
#   Naukluft: Curiositys egen skygge står i −Solens højde (26,7° ifølge Mars24-formlerne) og passer med lige vinkler.
#   Landingsstedet: Mastcam-Z-billedernes retninger (CAHVOR-modellen i NASA's API over rå billeder) passer ned til
#   ca. −47° inden for ca. 1°.
# venstre: retningen (grader fra nord mod øst) ved fotoets venstre kant i fotoets egen ramme.
# nul: den række (i originalen), hvor 0° (vandret i fotoets ramme) ligger.
# kvaternion: (w, x, y, z) fra fotoets ramme til nord-øst-ned. Naukluft-fotoet er vandret (ingen målbar hældning).
# Landingsstedets foto følger roverens ramme, og kvaternionen er roverens hældning (attitude) fra NASA's API.
#
# Det ud-mappen får pr. foto: pano-<id>-8k.jpg (pc), -4k.jpg (tablet), -lille.jpg (tests), pano-<id>-maske.png (hvor
# fotoet har data, blød i kanten, så programmet kan tone det ud) og pano-<id>.json med vinklerne. Uden for data (sort
# i originalen, også huller mellem billederne inde i fotoet) fyldes billedet med den nærmeste pixel med data, så der
# ikke kommer en sort rand, når fotoet toner ud.
import sys
import os
import json
import urllib.request
import numpy as np
from PIL import Image
from scipy import ndimage

Image.MAX_IMAGE_PIXELS = None
NASA = 'https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/'
FOTOS = {
    'naukluft': {
        'fil': 'PIA20332.jpg', 'url': NASA + 'pia20/pia20332/PIA20332.jpg',
        'venstre': 180.75, 'nul': 1157, 'kvaternion': [1, 0, 0, 0],
    },
    'landing': {
        'fil': 'PIA24264.tif', 'url': NASA + 'pia24/pia24264/PIA24264.tif',
        'venstre': 0.52, 'nul': 239.9, 'kvaternion': [0.415617, -0.00408664, -0.00947025, 0.909481],
    },
}
BREDDER = {'8k': 8192, '4k': 4096, 'lille': 1024}
MASKE_BREDDE = 2048  # pixel i masken (ca. 5,7 pr. grad)
TONING = 1.5        # grader, som fotoet toner ud over ved kanten
MØRK = 10      # pixel, hvor alle tre farver er under dette, er uden data (sort i originalen)

ud = sys.argv[1]
orig = next((a[5:] for a in sys.argv[2:] if a.startswith('orig=')), '.')
os.makedirs(ud, exist_ok=True)


def træk_ind(a, n, P=64):
    # Trækker kanten af data n pixel ind. Rundt om sømmen i siderne (fotoet går hele vejen rundt), men over og under
    # fotoet er der intet, så dér trækkes den ind
    b = np.pad(np.pad(a, ((0, 0), (P, P)), mode='wrap'), ((P, P), (0, 0)), constant_values=False)
    return ndimage.binary_erosion(b, iterations=n, border_value=1)[P:-P, P:-P]


for id_, f in FOTOS.items():
    sti = os.path.join(orig, f['fil'])
    if not os.path.exists(sti):
        print('henter', f['url'], flush=True)
        urllib.request.urlretrieve(f['url'], sti)
    im = Image.open(sti).convert('RGB')
    W, H = im.size
    pp = W / 360
    print(id_, W, H, f'{pp:.2f} px/grad', flush=True)
    # Masken: hvor fotoet har data (ikke sort). Små prikker af JPEG-støj i det sorte fjernes, og kanten trækkes lidt
    # ind, så den mørke rand ved det sorte ikke kommer med
    s = max(1, W // 4096)
    lille = np.asarray(im.resize((W // s, H // s), Image.BILINEAR))
    # Fotoet går hele vejen rundt: Masken regnes med et stykke af den anden ende på hver side (ellers æder den sig ind
    # fra venstre og højre kant og giver en stribe i sømmen)
    P = 64
    mørk = np.pad(lille.max(2) <= MØRK, ((0, 0), (P, P)), mode='wrap')
    data = ndimage.binary_opening(~mørk, iterations=2)
    # Mørke skygger (mellem klipperne og under roveren) er også næsten sorte. Kun sorte områder, der rører fotoets
    # øverste eller nederste kant, er uden data (det gælder alle huller i begge fotos). De andre fyldes ud (før skinnede
    # det tegnede landskab igennem)
    huller, n = ndimage.label(~data)
    kant = np.unique(np.concatenate([huller[0], huller[-1]]))
    ude = np.zeros(n + 1, bool)
    ude[kant] = True
    ude[0] = False
    data = ~ude[huller]
    data = træk_ind(data[:, P:-P], 3)
    # Fyld uden for data med den nærmeste pixel med data, så fotoet ikke får en sort rand, når det toner ud
    a = np.asarray(im)
    nær = ndimage.distance_transform_edt(~data, return_distances=False, return_indices=True)
    fyld = Image.fromarray(lille[nær[0], nær[1]]).resize((W, H), Image.BILINEAR)
    m = Image.fromarray((data * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
    im = Image.composite(im, fyld, m)
    # Masken gemmes lille og blød: den toner over ca. TONING grader
    mb = MASKE_BREDDE
    mh = round(H * mb / W)
    maske = np.asarray(Image.fromarray((data * 255).astype(np.uint8)).resize((mb, mh), Image.BILINEAR)).astype(np.float32) / 255
    maske = træk_ind(maske > 0.5, max(1, round(TONING * mb / 360 / 2))).astype(np.float32)
    maske = ndimage.gaussian_filter(maske, TONING * mb / 360 / 2.5, mode=('nearest', 'wrap'))
    Image.fromarray(np.clip(maske * 255 + 0.5, 0, 255).astype(np.uint8), 'L').save(os.path.join(ud, f'pano-{id_}-maske.png'), optimize=True)
    for navn, bredde in BREDDER.items():
        h = round(H * bredde / W)
        fil = os.path.join(ud, f'pano-{id_}-{navn}.jpg')
        im.resize((bredde, h), Image.LANCZOS).save(fil, quality=88 if navn != 'lille' else 80, optimize=True)
        print('  ', os.path.basename(fil), f'{bredde} × {h}', f'{os.path.getsize(fil) / 1e6:.2f} MB', flush=True)
    json.dump({
        'venstre': f['venstre'],
        'op': round(f['nul'] / pp, 3),      # grader over vandret ved fotoets øverste kant
        'højde': round(H / pp, 3),          # grader fra øverste til nederste kant
        'kvaternion': f['kvaternion'],
    }, open(os.path.join(ud, f'pano-{id_}.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    print('   op', round(f['nul'] / pp, 2), '° højde', round(H / pp, 2), '°', flush=True)
