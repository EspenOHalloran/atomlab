# Laver billederne til Pluto og Charon (js/kosmos/pluto.js, MP3 i docs/drejebog-merkur-pluto.md) ud fra New Horizons'
# kort hos USGS. Hent originalerne til en mappe, og kør:  python3 lav_pluto.py <mappe med originaler> <ud-mappe>
# (kræver numpy og Pillow. Filerne er rå rækker efter et hoved, så de læses direkte med numpy.memmap)
#
#   Pluto_NewHorizons_Global_Mosaic_300m_Jul2017_8bit.tif   Kortet: New Horizons LORRI og MVIC (NASA/JHUAPL/SwRI), sat
#       sammen af USGS (Schenk m.fl.), 300 m pr. pixel, 24.888 × 12.444, 8 bit, 310 MB. Længde 180° i midten
#       (CenterLongitude = 180 i etiketten), øst til højre. Syd for ca. 30-40° S er der intet (0): det lå i mørke i 2015.
#   Pluto_NewHorizons_Global_DEM_300m_Jul2017_16bit.tif   Højderne (meter over kuglen med radius 1.188,3 km), 16 bit med
#       fortegn, −32.768 = ingen data. Kun den halvkugle, sonden fløj forbi, og et bælte mod nord (ca. 46 % af kortet).
#   Charon_NewHorizons_Global_Mosaic_300m_Jul2017_8bit.tif   Charons kort, 12.693 × 6.347, længde 0° i midten.
#   billeder/solsystem/pluto-1k.jpg (overblikket): New Horizons' farvekort fra Commons (lav_overblik.py), 0° i midten.
#   Adresserne: https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/<navn> (planetarymaps.usgs.gov/mosaic/ sender
#   videre dertil). Etiketterne (*.lbl) står ved siden af. Deres StartByte tæller fra 1.
#
# Plutos kort beholder 180° i midten som kilden, så hjertet (ca. 180° Ø) ikke ligger på kortets kant (Opus' noter til
# E16). Programmet drejer kuglen en halv omgang (midte: 180 i klippeplanet.js).
#
# Farverne: Gråtonekortet er skarpt (300 m), farvekortet groft (Commons' 1.280 px, her 1.024 px). Som Mars' farver fra
# Viking lægges farven fra det grove kort på det skarpe: farven delt med sin egen lysstyrke (udjævnet), ganget på
# gråtonerne. Farverne er gjort 25 % svagere, for det er uvist, om farvekortet er forstærket (del 8, afsnit 9).
#
# Det, ingen har set: Hvor der ikke er data, bruges en mørk, brunlig farve, og kanten glider over på ca. 2°. Højderne
# glider over i en udjævnet udgave af de nærmeste højder, som går mod 0 (kuglen) langt fra dataene, så bagsiden er glat.
# HØJDE_MIN og HØJDE_MAX skal være de samme som i js/kosmos/pluto.js.
import sys
import os
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ind, ud = sys.argv[1], sys.argv[2]
HER = os.path.dirname(os.path.abspath(__file__))
os.makedirs(ud, exist_ok=True)
PK = 'Pluto_NewHorizons_Global_Mosaic_300m_Jul2017_8bit'
PH = 'Pluto_NewHorizons_Global_DEM_300m_Jul2017_16bit'
CK = 'Charon_NewHorizons_Global_Mosaic_300m_Jul2017_8bit'
HØJDE_MIN, HØJDE_MAX = -4200.0, 6600.0  # m over 1.188,3 km (laveste i kilden −4.101 m, højeste 6.455 m)
MØRK = np.array([0.20, 0.165, 0.15])  # det, ingen har set (gange middel af gråtonerne): mørkt brunligt
MÆTNING = 0.75  # farverne gøres 25 % svagere


def læs(navn, dtype):
    lbl = open(os.path.join(ind, navn + '.lbl')).read()
    tal = lambda k: int(lbl.split(k)[1].split('=')[1].split()[0])
    B, H, start = tal('Samples'), tal('Lines'), tal('StartByte') - 1
    return np.memmap(os.path.join(ind, navn + '.tif'), dtype, 'r', offset=start, shape=(H, B))


def mindre(a, b, h):
    return np.asarray(Image.fromarray(np.asarray(a, np.float32), 'F').resize((b, h), Image.BOX), np.float32)


def større(a, b, h):
    return np.asarray(Image.fromarray(np.asarray(a, np.float32), 'F').resize((b, h), Image.BILINEAR), np.float32)


def gauss(a, sigma):
    # Udjævning med en gaussklokke (rundt i længden, spejlet ved polerne), på et gitter så groft, at sigma er 4 pixel
    H, B = a.shape
    f = max(1, int(sigma / 4))
    g = mindre(a, B // f, H // f) if f > 1 else a.astype(np.float32)
    s = sigma / f
    x = np.arange(-int(3 * s) - 1, int(3 * s) + 2)
    k = np.exp(-0.5 * (x / s) ** 2)
    k /= k.sum()
    n = len(x) // 2
    g = np.concatenate([g[:, -n:], g, g[:, :n]], axis=1)
    g = np.apply_along_axis(lambda r: np.convolve(r, k, 'valid'), 1, g)
    g = np.concatenate([g[n - 1::-1], g, g[:-n - 1:-1]], axis=0)
    g = np.apply_along_axis(lambda r: np.convolve(r, k, 'valid'), 0, g)
    return større(g, B, H) if f > 1 else g


def glid(a, b0, b1):
    t = np.clip((a - b0) / (b1 - b0), 0, 1)
    return t * t * (3 - 2 * t)


def gem_jpg(rgb, navn, kvalitet):
    Image.fromarray(np.clip(np.round(rgb), 0, 255).astype(np.uint8)).save(os.path.join(ud, navn), quality=kvalitet, optimize=True, progressive=True)
    print(navn, os.path.getsize(os.path.join(ud, navn)) // 1024, 'KB')


def gem16(hh, navn):
    n = np.clip(np.round((hh - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535).astype(np.uint32)
    n = np.minimum(np.round(n / 16) * 16, 65535).astype(np.uint32)  # trin på ca. 2,6 m er nok (filen bliver mindre)
    rg = np.zeros(hh.shape + (3,), np.uint8)
    rg[:, :, 0] = n >> 8
    rg[:, :, 1] = n & 255
    Image.fromarray(rg, 'RGB').save(os.path.join(ud, navn), optimize=True)
    print(navn, os.path.getsize(os.path.join(ud, navn)) // 1024, 'KB')


# ---------- Plutos kort ----------
kilde = læs(PK, np.uint8)
H0, B0 = kilde.shape
fuld = np.asarray(kilde, np.float32)
maske = (fuld > 0).astype(np.float32)
# 8k (pc) laves for sig, så resten kan regnes i 4k: gråtonerne i 8k ganges med farven og kanten fra 4k
B, H = 8192, 4096
m8 = mindre(maske, B, H)
g8 = mindre(fuld, B, H) / np.maximum(m8, 1e-3)
B, H = 4096, 2048
m4 = mindre(maske, B, H)
g4 = mindre(fuld, B, H) / np.maximum(m4, 1e-3)  # middel af de pixler, der har data
del fuld, maske
middel = float((g4 * m4).sum() / m4.sum())
print('Pluto: data i', round(float(m4.mean()) * 100, 1), '% af kortet, middel', round(middel, 1))
# Kanten mod det, ingen har set: glider over på ca. 2° (sigma 1°), og kun dér, hvor der er data
kant = glid(gauss((m4 > 0.5).astype(np.float32), B / 360), 0.5, 0.95) * glid(m4, 0.5, 1)

# Farven fra det grove farvekort (rullet, så 180° står i midten som gråtonerne)
f1 = np.asarray(Image.open(os.path.join(HER, 'pluto-1k.jpg')).convert('RGB'), np.float32)
f1 = np.roll(f1, f1.shape[1] // 2, axis=1)
lum1 = f1 @ np.array([0.3, 0.59, 0.11], np.float32)
# Ligger farvekortet, hvor gråtonerne ligger? (lysstyrken sammenlignes med gråtonerne i samme størrelse)
g1 = mindre(g4 * kant, f1.shape[1], f1.shape[0])
gyld = mindre(kant, f1.shape[1], f1.shape[0]) > 0.9
bedst = max(((dx, dy) for dx in range(-3, 4) for dy in range(-3, 4)),
            key=lambda d: np.corrcoef(np.roll(lum1, d, axis=(1, 0))[gyld], g1[gyld])[0, 1])
print('farvekortet ligger bedst forskudt', bedst, 'pixel (1k), korrelation', round(float(np.corrcoef(np.roll(lum1, bedst, axis=(1, 0))[gyld], g1[gyld])[0, 1]), 3))
f1 = np.roll(f1, bedst, axis=(1, 0))
forhold = np.stack([gauss(f1[:, :, k], 1.5) for k in range(3)], axis=2)
forhold /= np.maximum(forhold @ np.array([0.3, 0.59, 0.11], np.float32), 1)[:, :, None]
forhold = 1 + MÆTNING * (forhold - 1)
forhold4 = np.stack([større(forhold[:, :, k], B, H) for k in range(3)], axis=2)
rgb = g4[:, :, None] * forhold4
mørk = MØRK * middel
rgb = rgb * kant[:, :, None] + mørk[None, None, :] * (1 - kant[:, :, None])
gem_jpg(rgb, 'pluto-kort-4k.jpg', 86)
# 8k: de skarpe gråtoner med farven og kanten fra 4k (glat forstørret)
rgb8 = np.stack([g8 * større(forhold4[:, :, k], 8192, 4096) for k in range(3)], axis=2)
k8 = større(kant, 8192, 4096)[:, :, None]
gem_jpg(rgb8 * k8 + mørk[None, None, :] * (1 - k8), 'pluto-kort-8k.jpg', 84)
del rgb8, k8, g8, m8
gem_jpg(np.stack([mindre(rgb[:, :, k], 2048, 1024) for k in range(3)], axis=2), 'pluto-kort-2k.jpg', 86)
del rgb, forhold4

# ---------- Plutos højder ----------
dem = læs(PH, np.int16)
h = np.asarray(dem, np.float32)
gyldig = (h > -32000).astype(np.float32)
h[gyldig < 0.5] = 0
print('højder', h[gyldig > 0.5].min(), h[gyldig > 0.5].max())
assert HØJDE_MIN <= h[gyldig > 0.5].min() and h[gyldig > 0.5].max() <= HØJDE_MAX
mh = mindre(gyldig, B, H)
h4 = mindre(h, B, H) / np.maximum(mh, 1e-3)
del h, gyldig
# Ud over kanten: de nærmeste højder udjævnet (sigma ca. 3°), og de går mod 0, hvor der er langt til data
sigma = 3 * B / 360
sum_ = gauss(h4 * (mh > 0.5), sigma)
vægt = gauss((mh > 0.5).astype(np.float32), sigma)
ude = sum_ / np.maximum(vægt, 1e-4) * glid(vægt, 0.02, 0.35)
w = glid(gauss((mh > 0.5).astype(np.float32), B / 360), 0.5, 0.95) * (mh > 0.5)
h4 = h4 * w + ude * (1 - w)
h4[0, :] = h4[0, :].mean()
h4[-1, :] = h4[-1, :].mean()
print('højder efter', round(float(h4.min())), round(float(h4.max())))
gem16(h4, 'pluto-hoejde-4k.png')
gem16(mindre(h4, 2048, 1024), 'pluto-hoejde-2k.png')

# ---------- Charons kort (gråtoner, 2k) ----------
c = læs(CK, np.uint8)
cf = np.asarray(c, np.float32)
cm = (cf > 0).astype(np.float32)
cm[0, :] = 0  # øverste række er tom
B, H = 2048, 1024
m2 = mindre(cm, B, H)
c2 = mindre(cf, B, H) / np.maximum(m2, 1e-3)
cmiddel = float((c2 * m2).sum() / m2.sum())
ckant = glid(gauss((m2 > 0.5).astype(np.float32), B / 360), 0.5, 0.95) * glid(m2, 0.5, 1)
# Over polen: den øverste række med data fortsætter (ellers bliver polen sort)
top = np.argmax(m2.mean(axis=1) > 0.9)
c2[:top] = c2[top].mean()
ckant[:top] = 1
c2 = c2 * ckant + 0.2 * cmiddel * (1 - ckant)
print('Charon: middel', round(cmiddel, 1))
Image.fromarray(np.clip(np.round(c2), 0, 255).astype(np.uint8), 'L').save(os.path.join(ud, 'charon-2k.jpg'), quality=88, optimize=True, progressive=True)
print('charon-2k.jpg', os.path.getsize(os.path.join(ud, 'charon-2k.jpg')) // 1024, 'KB')
# Charons farve (lille kort, der ganges på i maane.js): grå med en rødbrun nordpol (Neverland Regio, "Mordor"). Tegnet:
# rødbrunt over ca. 60° N, mest dér, hvor kortet er mørkt. Ganget med 1/1,4, så det ikke klippes (sætTone(t, 1.4)).
tb, th = 256, 128
bredde = 90 - (np.arange(th) + 0.5) / th * 180
mørkhed = 1 - np.clip(mindre(c2, tb, th) / cmiddel, 0, 1.2) / 1.2
v = glid(bredde, 55, 75)[:, None] * (0.45 + 0.55 * mørkhed)
grå = np.array([1.0, 0.97, 0.94])
rød = np.array([1.35, 0.78, 0.55])
tone = grå[None, None, :] * (1 - v[:, :, None]) + rød[None, None, :] * v[:, :, None]
Image.fromarray(np.clip(np.round(tone / 1.4 * 255), 0, 255).astype(np.uint8)).save(os.path.join(ud, 'charon-tone.jpg'), quality=92)
print('ok')
