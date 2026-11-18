# Laver det lokale net ved hjertet og bjergene på Pluto (js/kosmos/pluto.js, MP4 i docs/drejebog-merkur-pluto.md).
# Kør:  python3 lav_pluto_steder.py <mappe til de hentede rækker> <ud-mappe>
# (kræver numpy og Pillow. Kun rækkerne fra ca. 51° N til 41° S hentes fra USGS, ca. 160 + 320 MB)
#
# Kilderne er de samme som lav_pluto.py: New Horizons' kort og højder med 300 m pr. pixel (USGS, Schenk m.fl.), 180° i
# midten og øst til højre. Udsnittet (GRÆNSER) dækker Sputnik Planitia (hjertets venstre halvdel), bjergene af vandis
# langs kanten (Hillary og Tenzing Montes) og Wright Mons. Grænserne skal være de samme som LOKALT i js/kosmos/pluto.js.
#
# Farverne: Gråtonerne (300 m) ganges med farven fra klodens kort (pluto-kort-4k.jpg delt med gråtonerne i samme
# størrelse og udjævnet), så nettet har samme farve og lysstyrke som kloden omkring det. Huller i dataene fyldes med
# kloden. Højderne fyldes også med klodens (pluto-hoejde-4k.png). HØJDE_MIN og HØJDE_MAX som lav_pluto.py.
import sys
import os
import urllib.request
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ind, ud = sys.argv[1], sys.argv[2]
HER = os.path.dirname(os.path.abspath(__file__))
os.makedirs(ind, exist_ok=True)
os.makedirs(ud, exist_ok=True)
URL = 'https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/'
AGENT = {'User-Agent': 'AtomLab (et skoleprogram om atomer og planeter, billedvaerktoej)'}
PK = 'Pluto_NewHorizons_Global_Mosaic_300m_Jul2017_8bit'
PH = 'Pluto_NewHorizons_Global_DEM_300m_Jul2017_16bit'
B0, H0 = 24888, 12444
S = B0 / 360  # pixel pr. grad
R0, R1 = 2700, 9100  # rækkerne, der hentes (ca. 50,9° N til 41,6° S)
HØJDE_MIN, HØJDE_MAX = -4200.0, 6600.0
# Udsnittet: nord, syd, vest, øst (grader, østlig længde)
GRÆNSER = (50.0, -30.0, 148.0, 206.0)
# Størrelserne (bredde × højde): kortet på pc, tablet og i tests, og højderne
KORT = {'4k': (3072, 4096), '2k': (1536, 2048), '1k': (768, 1024)}  # ca. 400, 810 og 1.620 m pr. pixel
HØJDER = {'1k': (768, 1024)}  # ca. 1,6 km pr. pixel overalt (2k var 4 MB, og nettet har kun ca. 2,5 km mellem punkterne)


def rækker(navn, byte):
    sti = os.path.join(ind, navn + '.rows')
    if not os.path.exists(sti):
        lbl = urllib.request.urlopen(urllib.request.Request(URL + navn + '.lbl', headers=AGENT)).read().decode('latin-1')
        start = int(lbl.split('StartByte')[1].split('=')[1].split()[0]) - 1
        a, e = start + R0 * B0 * byte, start + R1 * B0 * byte - 1
        print('henter', navn, (e - a + 1) // 2**20, 'MB')
        req = urllib.request.Request(URL + navn + '.tif', headers={**AGENT, 'Range': f'bytes={a}-{e}'})
        with urllib.request.urlopen(req) as r, open(sti + '.del', 'wb') as f:
            while True:
                b = r.read(1 << 22)
                if not b:
                    break
                f.write(b)
        os.rename(sti + '.del', sti)
    return np.memmap(sti, np.uint8 if byte == 1 else np.int16, 'r', shape=(R1 - R0, B0))


def boks(nord, syd, vest, øst, B, H):
    # Udsnittet i kildens pixel (x0, y0, x1, y1) i de hentede rækker
    return (vest * S, (90 - nord) * S - R0, øst * S, (90 - syd) * S - R0)


def skær(a, bx, B, H):
    # Udsnittet bx (brøkdele af pixel) gjort til B × H med middel af pixlerne (BOX)
    x0, y0, x1, y1 = bx
    i0, j0, i1, j1 = int(x0) - 1, int(y0) - 1, int(np.ceil(x1)) + 1, int(np.ceil(y1)) + 1
    stk = np.asarray(a[j0:j1, i0:i1], np.float32)
    return np.asarray(Image.fromarray(stk, 'F').resize((B, H), Image.BOX, box=(x0 - i0, y0 - j0, x1 - i0, y1 - j0)), np.float32)


def fra_klode(billede, nord, syd, vest, øst, B, H):
    # Det samme udsnit af et kort over hele kloden (180° i midten, så længde 0° er venstre kant)
    Hk, Bk = billede.shape[:2]
    sx, sy = Bk / 360, Hk / 180
    bx = (vest * sx, (90 - nord) * sy, øst * sx, (90 - syd) * sy)
    kan = [billede] if billede.ndim == 2 else [billede[:, :, k] for k in range(billede.shape[2])]
    res = [np.asarray(Image.fromarray(np.asarray(c, np.float32), 'F').resize((B, H), Image.BILINEAR, box=bx), np.float32) for c in kan]
    return res[0] if billede.ndim == 2 else np.stack(res, axis=2)


def gauss(a, s):
    x = np.arange(-int(3 * s) - 1, int(3 * s) + 2)
    k = np.exp(-0.5 * (x / s) ** 2)
    k /= k.sum()
    p = len(x) // 2
    g = np.pad(a, p, mode='edge')
    g = np.apply_along_axis(lambda r: np.convolve(r, k, 'valid'), 1, g)
    return np.apply_along_axis(lambda r: np.convolve(r, k, 'valid'), 0, g)


def gem16(hh, navn):
    n = np.clip(np.round((hh - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535).astype(np.uint32)
    n = np.minimum(np.round(n / 16) * 16, 65535).astype(np.uint32)
    rg = np.zeros(hh.shape + (3,), np.uint8)
    rg[:, :, 0] = n >> 8
    rg[:, :, 1] = n & 255
    Image.fromarray(rg, 'RGB').save(os.path.join(ud, navn), optimize=True)
    print(navn, os.path.getsize(os.path.join(ud, navn)) // 1024, 'KB')


kort = rækker(PK, 1)
dem = rækker(PH, 2)
nord, syd, vest, øst = GRÆNSER
print('udsnittet', round((nord - syd) * S), '×', round((øst - vest) * S), 'pixel i kilden')

# Klodens kort og dets gråtoner i samme størrelse (4k: 2048 rækker over 180°)
klode = np.asarray(Image.open(os.path.join(HER, 'pluto-kort-4k.jpg')).convert('RGB'), np.float32)
Bm = int(round((øst - vest) * klode.shape[1] / 360))
Hm = int(round((nord - syd) * klode.shape[0] / 180))
rgb4 = fra_klode(klode, nord, syd, vest, øst, Bm, Hm)
g4 = skær(kort, boks(nord, syd, vest, øst, Bm, Hm), Bm, Hm)
lum = lambda c: c @ np.array([0.3, 0.59, 0.11], np.float32)
# Farven: klodens farve delt med gråtonerne, udjævnet (ca. 5 km)
forhold = (np.stack([gauss(rgb4[:, :, k], 2.5) for k in range(3)], axis=2) / np.maximum(gauss(g4, 2.5), 1)[:, :, None]).astype(np.float32)
print('farven (middel r, g, b):', np.round(forhold.reshape(-1, 3).mean(0), 3))

for str_, (B, H) in KORT.items():
    bx = boks(nord, syd, vest, øst, B, H)
    g = skær(kort, bx, B, H)
    f = np.stack([np.asarray(Image.fromarray(forhold[:, :, k], 'F').resize((B, H), Image.BILINEAR), np.float32) for k in range(3)], axis=2)
    rgb = g[:, :, None] * f
    k = fra_klode(klode, nord, syd, vest, øst, B, H)
    tom = g < 1  # ingen data
    rgb[tom] = k[tom]
    print(str_, 'uden data', round(float(tom.mean()) * 100, 2), '%', 'lysstyrke mod kloden', round(float(lum(rgb).mean() / lum(k).mean()), 3))
    navn = f'pluto-hjertet-kort-{str_}.jpg'
    Image.fromarray(np.clip(np.round(rgb), 0, 255).astype(np.uint8)).save(os.path.join(ud, navn), quality=84, optimize=True, progressive=True)
    print(navn, os.path.getsize(os.path.join(ud, navn)) // 1024, 'KB')

# Højderne: middel af de pixler, der har data. Huller fyldes med klodens højder
hk = np.asarray(Image.open(os.path.join(HER, 'pluto-hoejde-4k.png')).convert('RGB'), np.float32)
hk = HØJDE_MIN + (hk[:, :, 0] * 256 + hk[:, :, 1]) / 65535 * (HØJDE_MAX - HØJDE_MIN)
for str_, (B, H) in HØJDER.items():
    bx = boks(nord, syd, vest, øst, B, H)
    x0, y0, x1, y1 = bx
    i0, j0, i1, j1 = int(x0) - 1, int(y0) - 1, int(np.ceil(x1)) + 1, int(np.ceil(y1)) + 1
    rå = np.asarray(dem[j0:j1, i0:i1], np.float32)
    gyld = (rå > -32000).astype(np.float32)
    rå[gyld < 0.5] = 0
    lb = (x0 - i0, y0 - j0, x1 - i0, y1 - j0)
    sm = np.asarray(Image.fromarray(rå, 'F').resize((B, H), Image.BOX, box=lb), np.float32)
    sg = np.asarray(Image.fromarray(gyld, 'F').resize((B, H), Image.BOX, box=lb), np.float32)
    h = sm / np.maximum(sg, 1e-3)
    k = fra_klode(hk, nord, syd, vest, øst, B, H)
    w = np.clip((sg - 0.2) / 0.6, 0, 1)
    h = h * w + k * (1 - w)
    print(str_, 'højder uden data', round(float((sg < 0.5).mean()) * 100, 2), '%', 'fra', round(float(h.min())), 'til', round(float(h.max())), 'm', 'mod kloden', round(float(np.abs(h - k).mean())), 'm')
    gem16(h, f'pluto-hjertet-hoejde-{str_}.png')
