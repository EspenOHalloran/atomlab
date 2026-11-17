# Laver billederne til Merkur (js/kosmos/merkur.js, MP1 i docs/drejebog-merkur-pluto.md) ud fra MESSENGERs kort hos USGS.
# Hent originalerne til en mappe, og kør:  python3 lav_merkur.py <mappe med originaler> <ud-mappe>
# (kræver numpy og Pillow. Filerne er rå rækker efter et hoved, så de læses direkte med numpy.memmap)
#
#   Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m.tif   Kortet: MESSENGER MDIS Basemap BDR (NASA/JHUAPL/
#       Carnegie Institution of Washington, USGS/PDS), 256 pixel pr. grad (166 m), 92.160 × 46.080, 8 bit, 4,25 GB.
#       Længde 0° i midten, øst til højre. Fotos med lav sol (skyggerne gør kratere og klinter tydelige).
#   Mercury_MESSENGER_MDIS_Basemap_LOI_Mosaic_Global_166m.tif   Samme kort med høj sol (LOI). Kun hver 32. række hentes
#       (med Range, ca. 130 MB), for den bruges kun meget udjævnet (se nedenfor). Gemmes som loi-32.npy i mappen.
#   Mercury_Messenger_USGS_DEM_Global_665m_v2.tif   Højderne (Becker m.fl. 2016, NASA/JHUAPL/USGS), 64 pixel pr. grad
#       (665 m), 23.040 × 11.520, 16 bit med fortegn, gange 0,5 = meter over kuglen med radius 2.439,4 km. Længde 180° i
#       midten (CenterLongitude = 180 i etiketten), så kortet rulles en halv omgang (docs/fable/E16-merkur-pluto-noter.md).
#   Adresserne: https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/<navn> (planetarymaps.usgs.gov/mosaic/ sender
#   videre dertil). Etiketterne (*.lbl) står ved siden af. Deres StartByte tæller fra 1, så rækkerne starter ved
#   StartByte − 1 (filerne passer præcis i størrelsen).
#
# Kortet med lav sol (BDR) er sat sammen af mange kampagner med forskellig sol, så der er lodrette striber med
# forskellig lysstyrke over hele kloden. Kortet med høj sol (LOI) har jævn lysstyrke, men næsten ingen skygger (Caloris'
# kant og "Edderkoppen" forsvinder). Derfor: BDR's detaljer delt med en kraftig udjævning af BDR selv og ganget med den
# samme udjævning af LOI (Opus' noter til E16). Udjævningen er en gaussklokke med sigma 80 km, så kun de brede striber
# rettes og ikke lyse kratere og stråler (med 30 km blev kortet plettet). Smalle, skarpe overgange mellem to kampagner
# kan stadig anes. Ved polerne (over 78°, glidende fra 72°) bruges BDR, som det er: Dér står Solen altid lavt, LOI er
# støjet, og de sorte kraterbunde er de rigtige (evig skygge).
#
# Kortet gemmes i gråtoner (8k, 4k og 2k). 8k har kvalitet 82, så det fylder ca. 7,9 MB (Merkur har mange flere
# detaljer end Venus' radarkort). Programmet toner det svagt brunt (Merkur er mørkt gråbrun). Højderne gemmes
# med 16 bit i rød og grøn som Mars og Venus: n = (højde − HØJDE_MIN) / (HØJDE_MAX − HØJDE_MIN) · 65535,
# rød = n // 256, grøn = n % 256 (rundet til 16, ca. 2,5 m). HØJDE_MIN og HØJDE_MAX skal være de samme som i js/kosmos/merkur.js.
import sys
import os
import math
import urllib.request
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)
KILDE = 'https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/'
BDR = 'Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m'
LOI = 'Mercury_MESSENGER_MDIS_Basemap_LOI_Mosaic_Global_166m'
DEM = 'Mercury_Messenger_USGS_DEM_Global_665m_v2'
B, H = 92160, 46080  # BDR og LOI
HØJDE_MIN, HØJDE_MAX = -5500.0, 4600.0  # m over 2.439,4 km (laveste i kortet ca. −5,38 km, højeste ca. 4,48 km)
TRIN = 32  # LOI: hver 32. række
GROV = (1024, 512)  # gitteret for udjævningen (ca. 15 km pr. pixel ved ækvator)
SIGMA_KM = float(os.environ.get('SIGMA_KM', 80))  # udjævningen (gauss)
POL = (72, 78)  # grader: LOI glider ud mellem disse bredder (over 78° kun BDR)
R_KM = 2439.4


def startbyte(navn):
    # StartByte i etiketten (ISIS) tæller fra 1
    for linje in open(os.path.join(ind, navn + '.lbl')):
        if linje.strip().startswith('StartByte'):
            return int(linje.split('=')[1]) - 1
    raise SystemExit('ingen StartByte i ' + navn)


def hentLoi():
    sti = os.path.join(ind, f'loi-{TRIN}.npy')
    if os.path.exists(sti):
        return np.load(sti)
    if not os.path.exists(os.path.join(ind, LOI + '.lbl')):
        urllib.request.urlretrieve(KILDE + LOI + '.lbl', os.path.join(ind, LOI + '.lbl'))
    start = startbyte(LOI)
    rækker = list(range(TRIN // 2, H, TRIN))

    def række(r):
        a = start + r * B
        for forsøg in range(6):
            try:
                q = urllib.request.Request(KILDE + LOI + '.tif', headers={'Range': f'bytes={a}-{a + B - 1}'})
                data = urllib.request.urlopen(q, timeout=60).read()
                if len(data) == B:
                    return np.frombuffer(data, np.uint8)
            except Exception as e:
                print('prøver igen', r, e)
        raise SystemExit('kunne ikke hente række %d' % r)

    with ThreadPoolExecutor(24) as p:
        a = np.stack(list(p.map(række, rækker)))
    np.save(sti, a)
    return a


def mindre(a, b, h):
    return np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize((b, h), Image.BOX), dtype=np.float64)


def gauss(a, sigma_px_x, sigma_px_y):
    # Udjævning med en gaussklokke (rundt i øst-vest, spejlet ved polerne). sigma_px_x kan være en for hver række
    # (samme antal km ved alle bredder).
    def kerne(s):
        n = int(math.ceil(3 * s))
        x = np.arange(-n, n + 1)
        k = np.exp(-0.5 * (x / s) ** 2)
        return k / k.sum()
    ky = kerne(sigma_px_y)
    n = len(ky) // 2
    p = np.concatenate([a[n - 1::-1], a, a[:-n - 1:-1]], axis=0)
    a = sum(ky[i] * p[i:i + a.shape[0]] for i in range(len(ky)))
    ud_ = np.empty_like(a)
    for j in range(a.shape[0]):
        f = np.fft.rfft(a[j])
        x = np.fft.rfftfreq(a.shape[1])
        ud_[j] = np.fft.irfft(f * np.exp(-2 * (math.pi * x * sigma_px_x[j]) ** 2), n=a.shape[1])
    return ud_


# ---------- Kortet ----------
bdr = np.memmap(os.path.join(ind, BDR + '.tif'), np.uint8, 'r', offset=startbyte(BDR), shape=(H, B))
# Først 5 gange mindre (18.432 × 9.216, middelværdien af 5 × 5 pixel), i stykker, så det ikke fylder hele hukommelsen
F5 = 5
stor = np.empty((H // F5, B // F5), np.float32)
for r0 in range(0, H, F5 * 512):
    blok = np.asarray(bdr[r0:r0 + F5 * 512], dtype=np.float32)
    stor[r0 // F5:(r0 + blok.shape[0]) // F5] = blok.reshape(-1, F5, B // F5, F5).mean(axis=(1, 3))
print('BDR', stor.shape, 'middel', round(float(stor.mean()), 1))

# Lysstyrken udjævnet i BDR og LOI på det grove gitter
gb, gh = GROV
bredder = 90 - (np.arange(gh) + 0.5) * 180 / gh
km_px = 2 * math.pi * R_KM / gb
sx = SIGMA_KM / (km_px * np.maximum(np.cos(np.radians(bredder)), 0.05))
sy = SIGMA_KM / km_px
loi = hentLoi().astype(np.float32)
print('LOI', loi.shape, 'middel', round(float(loi.mean()), 1))
lB = gauss(mindre(stor, gb, gh), sx, sy)
lL = gauss(mindre(loi, gb, gh), sx, sy)
cosb = np.cos(np.radians(bredder))[:, None]
vægt = cosb * (np.abs(bredder) < POL[0])[:, None]
# LOI er lysere (høj sol): skaleres til BDR's middel, så kortet beholder BDR's lysstyrke
lL *= (lB * vægt).sum() / (lL * vægt).sum()
faktor = lL / np.maximum(lB, 1)
# Ved polerne glider faktoren over i 1 (kun BDR)
p = np.clip((np.abs(bredder) - POL[0]) / (POL[1] - POL[0]), 0, 1)[:, None]
faktor = faktor * (1 - p) + p
faktor = np.clip(faktor, 0.5, 2.0)
print('faktor', round(float(faktor.min()), 2), round(float(faktor.max()), 2))


def opRundt(f, b, h):
    # Faktoren op i fuld størrelse (lineært og rundt i øst-vest)
    f = np.concatenate([f[:, -1:], f, f[:, :1]], axis=1).astype(np.float32)
    im = Image.fromarray(f, 'F').resize((b + 2 * b // gb, h), Image.BILINEAR, box=(0, 0, gb + 2, gh))
    a = np.asarray(im, dtype=np.float32)
    k = b // gb
    return a[:, k:k + b]


for størrelse, b in (('8k', 8192), ('4k', 4096), ('2k', 2048)):
    g = mindre(stor, b, b // 2) * opRundt(faktor, b, b // 2)
    # Polen er ét punkt: den øverste og nederste række får samme værdi hele vejen rundt
    g[0, :] = g[0, :].mean()
    g[-1, :] = g[-1, :].mean()
    Image.fromarray(np.clip(np.round(g), 0, 255).astype(np.uint8), 'L').save(
        os.path.join(ud, f'merkur-kort-{størrelse}.jpg'), quality=82 if b == 8192 else 88, optimize=True, progressive=True)
    print(størrelse, 'kort', round(g.min(), 1), round(g.max(), 1), 'middel', round(g.mean(), 1))

# ---------- Polkortene (MP1: målingen af polen, docs/kode/merkur.md) ----------
# Ved polerne ligger pixlerne i kortet meget tættere mod øst end mod nord, så grafikkortet slører dem (stråler ud fra
# polen). Derfor et kort for hver pol set lige ovenfra (stereografisk: x = cos(b) · cos(l) / (1 + sin(b)) og
# z = cos(b) · sin(l) / (1 + sin(b)) for nordpolen, b = |bredde|), fra polen ned til POLKANT. Kuglens shader bruger det
# over ca. 72° (klippeplanet.js, pol). Pixlen i billedets række i og søjle j: u = (j + 0,5) / N og v = 1 − (i + 0,5) / N
# (billedet vendes, når det lægges i grafikkortet), x = (u − 0,5) · 2 · RMAX og z = (v − 0,5) · 2 · RMAX.
POLKANT = 70.0  # grader
RMAX = math.tan(math.radians(90 - POLKANT) / 2)  # 0,176: kortets kant i planet


def polGitter(N, ss, i0, i1, nord):
    # Bredde og længde (grader) for de ss · N søjler i rækkerne i0 til i1 (i det ss gange større gitter)
    M = N * ss
    j = (np.arange(M) + 0.5) / M
    i = (np.arange(i0, i1) + 0.5) / M
    X = (j[None, :] - 0.5) * 2 * RMAX
    Z = (0.5 - i[:, None]) * 2 * RMAX
    r = np.hypot(X, Z)
    b = 90 - np.degrees(2 * np.arctan(r))
    return (b if nord else -b), np.degrees(np.arctan2(Z, X))


def faktorVed(bredde, længde):
    # Faktoren fra udjævningen (det grove gitter) lineært i bredde og længde
    y = (90 - bredde) / 180 * gh - 0.5
    x = (længde + 180) / 360 * gb - 0.5
    y0 = np.clip(np.floor(y).astype(int), 0, gh - 2); ty = np.clip(y - y0, 0, 1)
    x0 = np.floor(x).astype(int); tx = x - x0
    x0 %= gb; x1 = (x0 + 1) % gb
    f = faktor
    return (f[y0, x0] * (1 - tx) + f[y0, x1] * tx) * (1 - ty) + (f[y0 + 1, x0] * (1 - tx) + f[y0 + 1, x1] * tx) * ty


def polBdr(nord, N=2048, ss=4):
    # Polkortet af BDR: ss × ss punkter pr. pixel (nærmeste pixel i 166 m-kortet), og middelværdien
    rækker = int((90 - POLKANT + 0.5) * 256)
    blok = np.asarray(bdr[:rækker] if nord else bdr[H - rækker:], dtype=np.uint8)
    ud_ = np.empty((N, N), np.float32)
    for i0 in range(0, N * ss, 256):
        bb, ll = polGitter(N, ss, i0, i0 + 256, nord)
        r = np.clip(np.round((90 - bb) * 256 - 0.5).astype(int), 0, H - 1)
        if not nord:
            r -= H - rækker
        c = np.round((ll + 180) * 256 - 0.5).astype(int) % B
        v = np.clip(r, 0, rækker - 1)
        a = blok[v, c].astype(np.float32) * faktorVed(bb, ll)
        a[np.abs(bb) < POLKANT - 0.5] = 70  # hjørnerne bruges aldrig (jævnt grå, så filen bliver mindre)
        ud_[i0 // ss:(i0 + 256) // ss] = a.reshape(256 // ss, ss, N, ss).mean(axis=(1, 3))
    return ud_


for nord, navn in ((True, 'nord'), (False, 'syd')):
    g = polBdr(nord)
    Image.fromarray(np.clip(np.round(g), 0, 255).astype(np.uint8), 'L').save(
        os.path.join(ud, f'merkur-pol-{navn}-2k.jpg'), quality=88, optimize=True, progressive=True)
    print('polkort', navn, round(float(g.mean()), 1))
del stor, bdr

# ---------- Højderne ----------
hB, hH = 23040, 11520
dem = np.memmap(os.path.join(ind, DEM + '.tif'), np.int16, 'r', offset=startbyte(DEM), shape=(hH, hB))
h = np.asarray(dem, dtype=np.float32) * 0.5
assert (dem != -32768).all()
# Kilden har 180° i midten (første søjle er 0°): rulles en halv omgang, så 0° står i midten som kortet
h = np.roll(h, hB // 2, axis=1)
print('højder', h.min(), h.max())
assert HØJDE_MIN <= h.min() and h.max() <= HØJDE_MAX
spring = np.abs(h[:, hB // 2] - h[:, hB // 2 - 1]).mean()
print('springet ved 0° (den gamle kant):', round(float(spring), 1), 'm, ellers', round(float(np.abs(np.diff(h[:, 1000:1100], axis=1)).mean()), 1), 'm')
# Springet i hver række (udglattet op og ned) fordeles over N søjler på hver side af 0°, så der ikke kommer en streg
# i lyset (som Venus' højder ved 180°, lav_venus.py)
N, m = 24, hB // 2
spring = h[:, m:m + 2].mean(axis=1) - h[:, m - 2:m].mean(axis=1)
spring = np.convolve(np.pad(spring, 4, mode='edge'), np.ones(9) / 9, mode='valid')
t = (1 - (np.arange(N) + 0.5) / N)[None, :]
h[:, m:m + N] -= spring[:, None] / 2 * t
h[:, m - N:m] += spring[:, None] / 2 * t[:, ::-1]
print('springet efter:', round(float(np.abs(h[:, m] - h[:, m - 1]).mean()), 1), 'm')
for størrelse, b in (('4k', 4096), ('2k', 2048)):
    hh = mindre(h, b, b // 2)
    hh[0, :] = hh[0, :].mean()
    hh[-1, :] = hh[-1, :].mean()
    n = np.clip(np.round((hh - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535).astype(np.uint32)
    n = np.minimum(np.round(n / 16) * 16, 65535).astype(np.uint32)  # trin på ca. 2,5 m er nok (filen bliver mindre)
    rg = np.zeros((b // 2, b, 3), np.uint8)
    rg[:, :, 0] = n >> 8
    rg[:, :, 1] = n & 255
    Image.fromarray(rg, 'RGB').save(os.path.join(ud, f'merkur-hoejde-{størrelse}.png'), optimize=True)
    print(størrelse, 'højde', round(hh.min()), round(hh.max()))

def gem16(hh, navn):
    n = np.clip(np.round((hh - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535).astype(np.uint32)
    n = np.minimum(np.round(n / 16) * 16, 65535).astype(np.uint32)
    rg = np.zeros(hh.shape + (3,), np.uint8)
    rg[:, :, 0] = n >> 8
    rg[:, :, 1] = n & 255
    Image.fromarray(rg, 'RGB').save(os.path.join(ud, navn), optimize=True)


# Polhøjderne (1k, ca. 1,7 km pr. pixel): 2 × 2 punkter pr. pixel, lineært mellem højdekortets punkter
for nord, navn in ((True, 'nord'), (False, 'syd')):
    N, ss = 1024, 2
    bb, ll = polGitter(N, ss, 0, N * ss, nord)
    y = np.clip((90 - bb) * 64 - 0.5, 0, hH - 1.001)
    x = (ll + 180) * 64 - 0.5
    y0 = np.floor(y).astype(int); ty = y - y0
    x0 = np.floor(x).astype(int); tx = x - x0
    x0 %= hB; x1 = (x0 + 1) % hB
    v = (h[y0, x0] * (1 - tx) + h[y0, x1] * tx) * (1 - ty) + (h[y0 + 1, x0] * (1 - tx) + h[y0 + 1, x1] * tx) * ty
    hh = v.reshape(N, ss, N, ss).mean(axis=(1, 3))
    gem16(hh, f'merkur-pol-{navn}-hoejde-1k.png')
    print('polhøjder', navn, round(float(hh.min())), round(float(hh.max())))
print('ok')
