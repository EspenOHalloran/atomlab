# Laver billederne til Mars (js/kosmos/mars.js) ud fra originalerne hos USGS.
# Hent originalerne til en mappe, og kør:  python3 lav_mars.py <mappe med originaler> <ud-mappe>
# (kræver numpy, Pillow og rasterio)
#
#   Mars_Viking_ClrMosaic_global_925m.tif      Mars i farver: Viking MDIM 2.1 (NASA/JPL/USGS), 925 m pr. pixel, 0,8 GB:
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars_Viking_ClrMosaic_global_925m.tif
#   Mars_MGS_MOLA_DEM_mosaic_global_463m.tif   Højder: MOLA fra Mars Global Surveyor (NASA/GSFC, via USGS), 463 m pr. pixel, 2,1 GB:
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif
#
# Begge kort har længdegrad 0° i midten og øst til højre, ligesom Jordens kort (se GeoTIFF-felterne: central_meridian 0).
# De går en lille smule ud over ±180°, så der skæres præcis 360° × 180° ud ud fra kortenes geografiske felter.
# Højderne er i meter over Mars' nulpunkt (areoiden). De gemmes med 16 bit i rød og grøn (som Jordens højdekort):
# n = (højde − HØJDE_MIN) / (HØJDE_MAX − HØJDE_MIN) · 65535 (rundet til 8), rød = n // 256, grøn = n % 256.
# HØJDE_MIN og HØJDE_MAX skal være de samme som i js/kosmos/mars.js.
import sys
import os
import math
import numpy as np
from PIL import Image
import rasterio

Image.MAX_IMAGE_PIXELS = None
ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)
HØJDE_MIN, HØJDE_MAX = -8500.0, 21500.0  # m (Hellas' bund er ca. −8,2 km, Olympus Mons' top ca. 21,2 km)


def kasse(d):
    # Pixelkanterne (venstre, top, højre, bund) for præcis −180° til 180° og 90° til −90° (Mars' kugle i kortet)
    R = d.crs.to_dict().get('R') or 3396190.0
    halv = math.pi * R
    t = d.transform
    return ((-halv - t.c) / t.a + KANT, (halv / 2 - t.f) / t.e, (halv - t.c) / t.a + KANT, (-halv / 2 - t.f) / t.e)


# Kortet går hele vejen rundt: Der lægges et par søjler fra den anden kant på hver side, fordi kanten ikke ligger
# præcis på ±180° (kortet mangler fx under en pixel i øst).
KANT = 4


def rundt(a):
    return np.concatenate([a[:, -KANT:], a, a[:, :KANT]], axis=1)


# ---------- Farverne ----------
with rasterio.open(os.path.join(ind, 'Mars_Viking_ClrMosaic_global_925m.tif')) as d:
    boks = kasse(d)
    rgb = np.moveaxis(d.read(), 0, -1)
    # Søjler helt uden data (fx den første) får nabosøjlens farver, ellers bliver der en sort streg ved 180°
    tomme = np.where((rgb == 0).all(axis=(0, 2)))[0]
    print('tomme søjler', tomme)
    for x in tomme:
        rgb[:, x] = rgb[:, x + 1 if x + 1 < rgb.shape[1] else x - 1]
    rgb = rundt(rgb)
print('farver', rgb.shape, boks)


def glat(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# Mosaikkens blå kanal er næsten den samme overalt (ca. 68-70), så de mørke egne (fx Syrtis Major) bliver blålige.
# På rigtige billeder i naturlige farver er de mørke egne mørk gråbrune. Derfor får de mørke egne en gråbrun farve
# med samme lysstyrke. De lyse, røde egne og polkapperne bliver, som de er.
for y in range(0, rgb.shape[0], 1024):
    del_ = rgb[y:y + 1024].astype(np.float32)
    r, g, b = del_[..., 0], del_[..., 1], del_[..., 2]
    lys = 0.3 * r + 0.59 * g + 0.11 * b
    behold = np.maximum(glat(1.1, 1.6, r / (g + 1)), glat(120, 170, lys))[..., None]
    mørk = lys[..., None] * np.array([1.28, 0.98, 0.74], np.float32)
    rgb[y:y + 1024] = np.clip(np.round(mørk + (del_ - mørk) * behold), 0, 255).astype(np.uint8)
farve = Image.fromarray(rgb, 'RGB')
del rgb
for størrelse, b in (('8k', 8192), ('4k', 4096), ('2k', 2048)):
    farve.resize((b, b // 2), Image.LANCZOS, box=boks).save(os.path.join(ud, f'mars-{størrelse}.jpg'), quality=90 if b == 8192 else 88, optimize=True, progressive=True)
del farve

# ---------- Højderne ----------
with rasterio.open(os.path.join(ind, 'Mars_MGS_MOLA_DEM_mosaic_global_463m.tif')) as d:
    boks = kasse(d)
    h = rundt(d.read(1)).astype(np.float32)
    ingen = d.nodata
if ingen is not None:
    assert not (h == ingen).any(), 'huller i højdekortet'
print('højder', h.shape, boks, 'min', h.min(), 'max', h.max())
assert HØJDE_MIN <= h.min() and h.max() <= HØJDE_MAX
højde = Image.fromarray(h, 'F')
del h
for størrelse, b in (('4k', 4096), ('2k', 2048)):
    a = np.asarray(højde.resize((b, b // 2), Image.BOX, box=boks), dtype=np.float64)
    # Polen er ét punkt: Den øverste og nederste række får samme højde hele vejen rundt (ellers bliver polen takket)
    a[0, :] = a[0, :].mean()
    a[-1, :] = a[-1, :].mean()
    n = np.clip(np.round((a - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535).astype(np.uint32)
    n = np.minimum(np.round(n / 8) * 8, 65535).astype(np.uint32)  # trin på ca. 3,7 m er nok (filen bliver en tredjedel mindre)
    rg = np.zeros((b // 2, b, 3), np.uint8)
    rg[:, :, 0] = n >> 8
    rg[:, :, 1] = n & 255
    Image.fromarray(rg, 'RGB').save(os.path.join(ud, f'mars-hoejde-{størrelse}.png'), optimize=True)
    print(størrelse, 'højde', a.min(), a.max())
print('ok')
