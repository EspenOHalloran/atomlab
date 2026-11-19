# Laver kortene over formen af Saturns måner (Saturn S3 i docs/plan-saturn-kvalitet.md, js/kosmos/saturn.js).
# Hent originalerne til en mappe (navnene til venstre), og kør:  python3 lav_saturn_former.py <mappe med originaler> <ud-mappe>
#
#   enceladus_2019pm_radius.tif   Enceladus' form: radius minus 251.500 m (middelradius), 2 pixel pr. grad (ca. 2,2 km
#       pr. pixel), planetocentrisk, østlig længde, 180° Ø i midten (kortets venstre kant er 0°).
#       Bland m.fl. 2019 (ISPRS 2020), via USGS:
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Enceladus/enceladus_cassini_iss_shapemodel_bland_2019/
#
# Formen gemmes som et kort over radius med 16 bit i rød og grøn (rød = de høje 8 bit) som Phobos og Deimos
# (lav_maaner.py), men regnet fra en "nul" i km, for radius i meter kan ikke være i 16 bit: værdi = radius − nul + 32,768 km
# i meter. Nul står også i js/kosmos/saturn.js (MÅNER, form.nul). Kortet har −180° til venstre, 0° (siden, der vender
# mod Saturn) i midten og østlig længde mod højre som farvekortene (lav_saturn.py).
#
# Huller (ca. 7 %, mest mod nord): Topografien (formen uden ellipsoiden) fyldes jævnt ind fra kanterne (som varme, der
# breder sig), og ellipsoiden lægges til igen. Så bliver hullerne hverken striber eller kugleformede buler.
import sys
import os
import numpy as np
from PIL import Image

ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)
INGEN = -1e30  # (ISIS' tomme værdi er ca. −3,4e38)


def læs(navn):
    a = np.asarray(Image.open(os.path.join(ind, navn)), np.float64)
    return a, a > INGEN


def fyld(a, gyldig, gange=4000):
    # Fyld hullerne jævnt: Hvert tomt punkt bliver gennemsnittet af sine naboer, igen og igen (rundt i længden)
    a = np.where(gyldig, a, 0.0)
    for _ in range(gange):
        n = (np.roll(a, 1, 1) + np.roll(a, -1, 1) + np.vstack([a[:1], a[:-1]]) + np.vstack([a[1:], a[-1:]])) / 4
        a = np.where(gyldig, a, n)
    return a


def glat(a, gange=2):
    # Glat punktstøjen fra punktskyen væk ([1, 2, 1] / 4 i begge retninger, rundt i længden), ca. 2 km
    for _ in range(gange):
        a = (np.roll(a, 1, 1) + 2 * a + np.roll(a, -1, 1)) / 4
        a = (np.vstack([a[:1], a[:-1]]) + 2 * a + np.vstack([a[1:], a[-1:]])) / 4
    return a


def ellipsoide(r_m, gyldig, lat, lon):
    # Den bedste ellipsoide med akserne langs x (mod Saturn), y (i banen) og z (aksen): 1/r² = x²/a² + y²/b² + z²/c²
    cb, sb = np.cos(lat), np.sin(lat)
    X = np.stack([(cb * np.cos(lon)) ** 2, (cb * np.sin(lon)) ** 2, sb ** 2 + 0 * lon], -1)
    A = X[gyldig]
    k = np.linalg.lstsq(A, 1 / r_m[gyldig] ** 2, rcond=None)[0]
    akser = 1 / np.sqrt(k)
    return 1 / np.sqrt(X @ k), akser


def gem_form(r_m, nul_km, navn):
    r_m = r_m.copy()
    r_m[0] = r_m[0].mean()  # polerne: samme værdi hele vejen rundt (ellers bliver de takkede)
    r_m[-1] = r_m[-1].mean()
    v = np.round(r_m - nul_km * 1000 + 32768)
    assert v.min() >= 0 and v.max() <= 65535, (v.min(), v.max())
    v = v.astype(np.uint16)
    rgb = np.zeros(v.shape + (3,), np.uint8)
    rgb[..., 0] = v >> 8
    rgb[..., 1] = v & 255
    Image.fromarray(rgb, 'RGB').save(os.path.join(ud, navn), optimize=True)
    print(navn, v.shape[::-1], f'radius {r_m.min() / 1000:.2f}-{r_m.max() / 1000:.2f} km')


# Enceladus
if os.path.exists(os.path.join(ind, 'enceladus_2019pm_radius.tif')):
    r, gr = læs('enceladus_2019pm_radius.tif')
    H, B = r.shape
    # Rul en halv omgang, så 0° er i midten (pixelernes midter passer præcist, for B er lige)
    r, gyldig = (np.roll(x, B // 2, axis=1) for x in (r, gr))
    lat = np.radians(90 - (np.arange(H) + 0.5) * 180 / H)[:, None]
    lon = np.radians(-180 + (np.arange(B) + 0.5) * 360 / B)[None, :]
    r_m = r + 251500
    ell, akser = ellipsoide(r_m, gyldig, lat, lon)
    print('Enceladus: ellipsoide', ', '.join(f'{x / 1000:.1f}' for x in akser), 'km; huller', f'{(~gyldig).mean():.1%}')
    topo = fyld(r_m - ell, gyldig)
    # Punktskyen giver støj fra punkt til punkt (tiere af meter), som bliver til korn i lav sol: glattes ca. 2 km
    gem_form(ell + glat(np.where(gyldig, r_m - ell, topo)), 252, 'enceladus-form.png')
