# Laver kortene til Nordpolen på Mars set lige ovenfra (M7b-pol, docs/plan-mars.md): et højdekort og et farvekort
# i polarstereografisk projektion fra polen ned til POLKANT (78° N, ca. 1.420 km bredt), som polarnettet i
# js/solsystem/klippeplanet.js (lokalt({ pol })) bruger.
# Kør:  python3 -I lav_pol.py <mappe til de hentede originaler> <ud-mappe>
# (kræver numpy, Pillow og rasterio). Originalerne hentes selv, kun den del, der skal bruges (med Range):
#
#   megt_n_256_1.img   Højder: MOLA MEGDR, polarstereografisk, 256 pixel pr. grad (230 m pr. pixel), NASA/GSFC,
#       PDS Geosciences Node: https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/polar/
#       16 bit (MSB), meter over areoiden = værdi · 0,25 − 8000 (samme nulpunkt som klodens højdekort, lav_mars.py).
#       Projektionen (catalog/dsmap_polar.cat): kugle med radius 3.376,2 km, X = (I − N/2 − 0,5) / RES og
#       Y = (J − N/2 − 0,5) / RES (I søjle og J række, fra 1), R = √(X² + Y²), længde = atan2(X, Y) (0° lige ned fra
#       midten, 90° Ø til højre), bredde = 90° − 2 · atan(R · π / 360).
#   Mars_Viking_ClrMosaic_global_925m.tif   Farver: Viking (NASA/JPL/USGS), 925 m pr. pixel, samme som kloden og de
#       andre steder. MDIM 2.1 i 232 m blev prøvet: Ved polen har den tydelige sømme mellem billederne og dis.
#
# Kortene (samme retninger som Merkurs polkort i lav_merkur.py): stereografisk på enhedskuglen,
# x = cos(b) · cos(l) / (1 + sin(b)) og z = cos(b) · sin(l) / (1 + sin(b)). Pixlen i billedets række i og søjle j:
# u = (j + 0,5) / N og v = 1 − (i + 0,5) / N, x = (u − 0,5) · 2 · RMAX og z = (v − 0,5) · 2 · RMAX. Længde 0° er altså
# til højre og 90° Ø opad. Hjørnerne (under POLKANT) er med i billedet, men nettet bruger dem ikke.
# Højderne gemmes som kloden (16 bit i rød og grøn, fra HØJDE_MIN til HØJDE_MAX).
import sys
import os
import math
import urllib.request
import numpy as np
from PIL import Image

POLKANT = 78.0  # grader. Skal være den samme som pol i LOKALE i js/kosmos/mars.js
RMAX = math.tan(math.radians(90 - POLKANT) / 2)  # 0,105: kortets kant i planet
HØJDE_MIN, HØJDE_MAX = -8500.0, 21500.0  # m, de samme som i lav_mars.py og js/kosmos/mars.js
HØJDE = (2048, 1024)  # pc og tablet, tests (ca. 0,69 og 1,39 km pr. pixel)
FARVE = (2048, 1024)  # pc, tablet og tests (kilden har 925 m)
SS = 3  # punkter pr. pixel på hver led (gennemsnittet af dem)
MOLA_URL = 'https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/polar/megt_n_256_1.img'
MOLA_N, MOLA_RES = 11520, 256
VIKING = '/vsicurl/https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars_Viking_ClrMosaic_global_925m.tif'
MOLA_GLOBAL = '/vsicurl/https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif'
R = 3396190.0

orig, ud = sys.argv[1], sys.argv[2]
os.makedirs(orig, exist_ok=True)
os.makedirs(ud, exist_ok=True)
if os.path.exists('/root/.ccr/ca-bundle.crt'):
    os.environ.setdefault('CURL_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')
    os.environ.setdefault('SSL_CERT_FILE', '/root/.ccr/ca-bundle.crt')
import rasterio  # noqa: E402 (efter certifikatet)
from rasterio.windows import Window  # noqa: E402


def gitter(N):
    # Bredde og længde (grader øst) for SS · N × SS · N punkter (rækkerne oppefra)
    M = N * SS
    t = (np.arange(M) + 0.5) / M
    X = (t[None, :] - 0.5) * 2 * RMAX
    Z = (0.5 - t[:, None]) * 2 * RMAX
    r = np.hypot(X, Z)
    return 90 - np.degrees(2 * np.arctan(r)), np.degrees(np.arctan2(Z, X)) % 360


def ned(a, N):
    # Gennemsnittet af SS × SS punkter pr. pixel
    return a.reshape(N, SS, N, SS, *a.shape[2:]).mean(axis=(1, 3))


def bilineær(a, rr, cc, rundt=False):
    # a[rr, cc] lineært mellem pixlerne (rundt: søjlerne går hele vejen rundt)
    H, W = a.shape[:2]
    rr = np.clip(rr, 0, H - 1.001)
    r0 = np.floor(rr).astype(np.int64); tr = rr - r0
    if rundt:
        c0 = np.floor(cc).astype(np.int64); tc = cc - c0
        c0 %= W; c1 = (c0 + 1) % W
    else:
        cc = np.clip(cc, 0, W - 1.001)
        c0 = np.floor(cc).astype(np.int64); tc = cc - c0; c1 = c0 + 1
    if a.ndim == 3:
        tr = tr[..., None]; tc = tc[..., None]
    return (a[r0, c0] * (1 - tc) + a[r0, c1] * tc) * (1 - tr) + (a[r0 + 1, c0] * (1 - tc) + a[r0 + 1, c1] * tc) * tr


# ---------- Højderne (MOLA, polarkortet) ----------
# Rækkerne om polen ned til lidt under hjørnerne (ca. 73° N)
hjørne = 2 * math.degrees(math.atan(RMAX * math.sqrt(2)))  # hjørnets afstand fra polen (grader)
px = 360 / math.pi * math.tan(math.radians(hjørne) / 2) * MOLA_RES + 4
r0 = int(MOLA_N / 2 - px); r1 = int(MOLA_N / 2 + px) + 1
sti = os.path.join(orig, f'megt_n_256_1_raekker_{r0}_{r1}.bin')
if not os.path.exists(sti):
    print('henter MOLA, rækkerne', r0, r1, flush=True)
    req = urllib.request.Request(MOLA_URL, headers={'Range': f'bytes={r0 * MOLA_N * 2}-{r1 * MOLA_N * 2 - 1}'})
    with urllib.request.urlopen(req, timeout=600) as svar, open(sti + '.del', 'wb') as f:
        while True:
            b = svar.read(1 << 22)
            if not b:
                break
            f.write(b)
    os.replace(sti + '.del', sti)
mola = np.fromfile(sti, dtype='>u2').reshape(r1 - r0, MOLA_N).astype(np.float32) * 0.25 - 8000
assert mola.min() > -9000 and mola.max() < 0, 'uventede højder i polarkortet'


def molaVed(b, l):
    Rg = 360 / math.pi * np.tan(np.radians(90 - b) / 2)  # R i grader
    X = Rg * np.sin(np.radians(l)); Y = Rg * np.cos(np.radians(l))
    I = X * MOLA_RES + MOLA_N / 2 - 0.5  # 0-baseret søjle (I − 1)
    J = Y * MOLA_RES + MOLA_N / 2 - 0.5 - r0
    return bilineær(mola, J, I)


def gem_højder(h, navn):
    for B in HØJDE:
        x = h if B == h.shape[0] else np.asarray(Image.fromarray(h.astype(np.float32), 'F').resize((B, B), Image.BOX), np.float64)
        n = np.clip(np.round((x - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535)
        n = np.minimum(np.round(n / 8) * 8, 65535).astype(np.uint32)
        rg = np.zeros((B, B, 3), np.uint8)
        rg[:, :, 0] = n >> 8
        rg[:, :, 1] = n & 255
        f = navn(B)
        Image.fromarray(rg, 'RGB').save(os.path.join(ud, f), optimize=True)
        print(f, os.path.getsize(os.path.join(ud, f)) // 1024, 'KB')


N = HØJDE[0]
b, l = gitter(N)
h = ned(molaVed(b, l), N).astype(np.float64)
print('højder', round(h.min()), round(h.max()), 'km pr. pixel ved polen', round(4 * RMAX * 3376.2 / N, 3))
assert HØJDE_MIN <= h.min() and h.max() <= HØJDE_MAX

# Kontrol: polarkortet mod klodens MOLA-kort (463 m) i en ring ved kanten (77,5-78,5° N)
with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR', CPL_VSIL_CURL_CHUNK_SIZE=4194304):
    with rasterio.open(MOLA_GLOBAL) as d:
        f = math.pi * R / 180
        t = d.transform
        rk = int(math.ceil((76.5 * f - t.f) / t.e)) + 2
        g = d.read(1, window=Window(0, 0, d.width, rk), out_shape=(rk // 4, d.width // 4)).astype(np.float32)
        gt = (t.c / f, t.a * 4 / f, t.f / f, t.e * 4 / f)
ring = np.abs(b - 78) < 0.5
gr = bilineær(g, (b[ring] - gt[2]) / gt[3], (((l[ring] + 180) % 360) - 180 - gt[0]) / gt[1], rundt=True)
d = molaVed(b[ring], l[ring]) - gr
print('polarkort − klodens kort ved 78° N: middel', round(float(d.mean()), 1), 'm, spredning', round(float(d.std()), 1), 'm')
gem_højder(h, lambda B: f'mars-nordpol-hoejde-{"2k" if B == 2048 else "1k"}.png')

# ---------- Farverne (Viking, samme rettelse som i lav_steder.py) ----------
with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR', CPL_VSIL_CURL_CHUNK_SIZE=4194304):
    with rasterio.open(VIKING) as d:
        f = 1 if d.crs.is_geographic else math.pi * R / 180
        t = d.transform
        rk = int(math.ceil(((min(b.min(), 90) - 0.5) * f - t.f) / t.e)) + 2
        rgb = np.moveaxis(d.read(window=Window(0, 0, d.width, rk)), 0, -1)
        vt = (t.c / f, t.a / f, t.f / f, t.e / f)
print('Viking', rgb.shape)
# Kortets første søjle er tom (0 i alle tre farver), og ved 180° passer de to sider ikke sammen (nærmest polen er
# forskellen stor). Ved polen trækkes den søm sammen til en stiplet linje. Derfor er søjlerne på hver side af 180°
# erstattet af en jævn overgang over ca. SØM_KM (mindst 16 søjler, ca. 0,25°).
assert (rgb[:, 0] == 0).all() and not (rgb[:, 1:] == 0).all(axis=2).any(), 'uventede tomme pixel i farvekortet'
x = rgb.astype(np.float32)
SØM_KM = 3.0
for r in range(x.shape[0]):
    b_r = vt[2] + (r + 0.5) * vt[3]
    k = int(np.clip(SØM_KM / (0.925 * max(math.cos(math.radians(b_r)), 1e-4)) / 2, 16, x.shape[1] // 8))
    w = ((np.arange(2 * k) + 1) / (2 * k + 1))[:, None]
    overgang = x[r, -1 - k] * (1 - w) + x[r, k] * w
    x[r, -k:] = overgang[:k]
    x[r, :k] = overgang[k:]
rr, gg, bb = x[..., 0], x[..., 1], x[..., 2]
lys = 0.3 * rr + 0.59 * gg + 0.11 * bb
glat = lambda a, b_, v: np.clip((v - a) / (b_ - a), 0, 1) ** 2 * (3 - 2 * np.clip((v - a) / (b_ - a), 0, 1))
behold = np.maximum(glat(1.1, 1.6, rr / (gg + 1)), glat(120, 170, lys))[..., None]
mørk = lys[..., None] * np.array([1.28, 0.98, 0.74], np.float32)
x = np.clip(mørk + (x - mørk) * behold, 0, 255)
del rgb
N = FARVE[0]
b, l = gitter(N)
c = ned(bilineær(x, (b - vt[2]) / vt[3] - 0.5, (((l + 180) % 360) - 180 - vt[0]) / vt[1] - 0.5, rundt=True), N)
billede = Image.fromarray(np.clip(np.round(c), 0, 255).astype(np.uint8), 'RGB')
for B in FARVE:
    navn = f'mars-nordpol-farve-{"2k" if B == 2048 else "1k"}.jpg'
    (billede if B == N else billede.resize((B, B), Image.LANCZOS)).save(os.path.join(ud, navn), quality=90, optimize=True, progressive=True)
    print(navn, os.path.getsize(os.path.join(ud, navn)) // 1024, 'KB')
print('ok')
