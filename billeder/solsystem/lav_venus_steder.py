# Laver billederne til stederne under skyerne og gløden på natsiden (js/kosmos/venus.js, V3 i docs/plan-venus.md).
# Kør:  python3 lav_venus_steder.py <mappe til de hentede originaler> <ud-mappe>
# (kræver kun numpy og Pillow. Magellans kort hentes selv fra USGS, de store kun i udsnit)
#
# 1. De lokale kort ved Maat Mons og pandekagekuplerne (Seoritsu Farra): Magellans radar med 225 m pr. pixel
#    (Venus_Magellan_LeftLook_mosaic_global_225m.tif, 13 GB, NASA/JPL/USGS). Filen er ukomprimeret med rækkerne lige
#    efter hinanden, så hver række i udsnittet hentes for sig med Range (ca. 4 KB pr. række). Etiketten (*.lbl) giver
#    StartByte i tif-filen, rækkens længde og hjørnet (UpperLeftCornerX/Y). (.cub-filerne er lagt i fliser og har deres
#    egen StartByte: brug dem ikke.) Lysstyrken rettes, så den passer med kloden
#    (venus-radar-8k.jpg), og huller fyldes med klodens kort.
#    Højderne er stadig Magellans GTDR (4.641 m pr. pixel), skåret ud og gjort glat større (bilineært). De lokale kort
#    giver altså en skarpere overflade, ikke skarpere bjerge.
# 2. Gløden på natsiden: Jorden stråler efter Plancks lov. Ved 1,0 µm (et af vinduerne i luften) er lysstyrken i
#    forhold til middelhøjden L = (exp(c2/T0) − 1) / (exp(c2/T) − 1), hvor T = T0 − FALD · (h − 0,8 km) (VIRA:
#    737 K ved 6.051,8 km og 7,7 K pr. km. h er over kortets kugle, 6.051,0 km). Skyerne spreder lyset, så alt under ca.
#    50-100 km bliver udvisket (Lustig-Yaeger m.fl.): Kortet sløres med SLØR km (gaussisk), så det, man ser gennem
#    skyerne, er målt og ikke tegnet. Uden skyer regner shaderen gløden skarpt ud fra højdekortet (samme formel, tallene
#    står også i js/data/venus.js som GLØD).
#    Gemmes som venus-gloed-1k.jpg i gråtoner: g = sqrt(L / GLØD_MAKS) · 255.
#
# Grænserne (grader, øst positiv og længde fra −180° til 180°) skal være de samme som LOKALE i js/kosmos/venus.js.
import sys
import os
import math
import urllib.request
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
cache, ud = sys.argv[1], sys.argv[2]
os.makedirs(cache, exist_ok=True)
URL = 'https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/'
AGENT = {'User-Agent': 'AtomLab (et skoleprogram om atomer og planeter, billedvaerktoej)'}
R_KM = 6051.0  # kuglen i kortene
HØJDE_MIN, HØJDE_MAX = -3500.0, 12500.0  # som lav_venus.py og js/kosmos/venus.js
# Gløden (som GLØD i js/data/venus.js)
T0, FALD, NUL_KM, BØLGE = 737.0, 7.7, 0.8, 1.0  # K, K pr. km, km over 6.051,0 km, µm
C2 = 14387.77  # µm · K (h · c / k)
GLØD_MAKS = 4.0
SLØR = 50.0  # km (gaussisk sigma: halvbredden er ca. 120 km)

# De lokale kort: navn, grænser (nord, syd, vest, øst) og størrelser (radarens bredde i pixel, højdernes bredde)
STEDER = [
    # Maat Mons (0,5° N, 194,6° Ø = −165,4°): ca. 920 × 920 km om vulkanen og lavaen omkring den
    ('maat', 4.865, -3.865, -169.77, -161.03, (4096, 2048, 1024), 1024),
    # Pandekagekuplerne i Seoritsu Farra (30,0° S, 11,0° Ø): ca. 460 × 460 km
    ('kupler', -27.82, -32.18, 8.48, 13.52, (2048, 1024), 512),
]


def hent(navn):
    sti = os.path.join(cache, navn)
    if not os.path.exists(sti):
        print('henter', navn)
        with urllib.request.urlopen(urllib.request.Request(URL + navn, headers=AGENT)) as r, open(sti + '.del', 'wb') as f:
            while True:
                b = r.read(1 << 20)
                if not b:
                    break
                f.write(b)
        os.rename(sti + '.del', sti)
    return sti


def etiket(navn):
    with urllib.request.urlopen(urllib.request.Request(URL + navn, headers=AGENT)) as r:
        tekst = r.read().decode('latin-1')
    v = {}
    for linje in tekst.splitlines():
        if '=' in linje:
            k, _, x = linje.partition('=')
            v.setdefault(k.strip(), x.strip().split(' ')[0])
    return v


def stykke(navn, start, længde):
    req = urllib.request.Request(URL + navn, headers={**AGENT, 'Range': f'bytes={start}-{start + længde - 1}'})
    for forsøg in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                b = r.read()
            if len(b) == længde:
                return b
        except Exception as e:  # nettet kan svigte: prøv igen
            print('igen', start, e)
    raise RuntimeError('kunne ikke hente ' + navn)


def glidStørre(a, B, H):
    return np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize((B, H), Image.BILINEAR), dtype=np.float64)


# ---------- Klodens kort (til lysstyrken og hullerne) og højderne ----------
klode = np.asarray(Image.open(os.path.join(ud, 'venus-radar-8k.jpg')).convert('L'), dtype=np.float64)
KH, KB = klode.shape
gtdr_lbl = etiket('Venus_Magellan_Topography_Global_4641m_v02.lbl')
gtdr = np.fromfile(hent('Venus_Magellan_Topography_Global_4641m_v02.tif'), dtype='<i2', offset=int(gtdr_lbl['StartByte']) - 1,
                   count=int(gtdr_lbl['Samples']) * int(gtdr_lbl['Lines'])).reshape(int(gtdr_lbl['Lines']), int(gtdr_lbl['Samples']))
g_x0, g_y0, g_px = float(gtdr_lbl['UpperLeftCornerX']), float(gtdr_lbl['UpperLeftCornerY']), float(gtdr_lbl['PixelResolution'])
print('GTDR', gtdr.shape, 'Maxwell (65,2° N, 3,3° Ø):', gtdr[int((g_y0 - math.radians(65.2) * R_KM * 1000) / g_px), int((math.radians(3.3) * R_KM * 1000 - g_x0) / g_px)])
glob_h = np.asarray(Image.open(os.path.join(ud, 'venus-hoejde-4k.png')).convert('RGB'), dtype=np.float64)
glob_h = HØJDE_MIN + (glob_h[:, :, 0] * 256 + glob_h[:, :, 1]) / 65535 * (HØJDE_MAX - HØJDE_MIN)


def udsnit(kort, x0, y0, px, nord, syd, vest, øst, B, H):
    # Et udsnit af et kort i ligeafstand (meter fra 0° og ækvator, hjørnet x0, y0) med B × H punkter i midten af
    # hver pixel (bilineært)
    m = R_KM * 1000
    lon = np.radians(vest + (øst - vest) * (np.arange(B) + 0.5) / B)
    lat = np.radians(nord - (nord - syd) * (np.arange(H) + 0.5) / H)
    sx = (lon * m - x0) / px - 0.5
    sy = (y0 - lat * m) / px - 0.5
    i0, j0 = np.floor(sx).astype(int), np.floor(sy).astype(int)
    fx, fy = (sx - i0)[None, :], (sy - j0)[:, None]
    W = kort.shape[1]
    g = lambda j, i: kort[np.clip(j, 0, kort.shape[0] - 1)[:, None], (i % W)[None, :]].astype(np.float64)
    return (g(j0, i0) * (1 - fx) * (1 - fy) + g(j0, i0 + 1) * fx * (1 - fy) + g(j0 + 1, i0) * (1 - fx) * fy + g(j0 + 1, i0 + 1) * fx * fy)


def gem_højde(h, sti):
    n = np.clip(np.round((h - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535).astype(np.uint32)
    rg = np.zeros(h.shape + (3,), np.uint8)
    rg[:, :, 0] = n >> 8
    rg[:, :, 1] = n & 255
    Image.fromarray(rg, 'RGB').save(sti, optimize=True)


# ---------- De lokale kort ----------
LL = 'Venus_Magellan_LeftLook_mosaic_global_225m'
ll = etiket(LL + '.lbl')
L_START, L_B, L_H = int(ll['StartByte']) - 1, int(ll['Samples']), int(ll['Lines'])
L_X0, L_Y0, L_PX = float(ll['UpperLeftCornerX']), float(ll['UpperLeftCornerY']), float(ll['PixelResolution'])
print('225 m:', L_B, '×', L_H, 'start', L_START)
for navn, nord, syd, vest, øst, størrelser, h_str in STEDER:
    m = R_KM * 1000
    i0 = int(math.floor((math.radians(vest) * m - L_X0) / L_PX))
    i1 = int(math.ceil((math.radians(øst) * m - L_X0) / L_PX))
    j0 = int(math.floor((L_Y0 - math.radians(nord) * m) / L_PX))
    j1 = int(math.ceil((L_Y0 - math.radians(syd) * m) / L_PX))
    sti = os.path.join(cache, f'{navn}-225m-{i0}-{j0}-{i1}-{j1}.npy')
    if os.path.exists(sti):
        rå = np.load(sti)
    else:
        print(navn, 'henter', j1 - j0, 'rækker à', i1 - i0, 'byte')
        with ThreadPoolExecutor(24) as pool:
            rækker = list(pool.map(lambda j: stykke(LL + '.tif', L_START + j * L_B + i0, i1 - i0), range(j0, j1)))
        rå = np.frombuffer(b''.join(rækker), np.uint8).reshape(j1 - j0, i1 - i0)
        np.save(sti, rå)
    # Udsnittet i fuld størrelse (største radarkort), med hjørnet i pixel i0, j0
    x0, y0 = L_X0 + i0 * L_PX, L_Y0 - j0 * L_PX
    B = størrelser[0]
    data = udsnit((rå > 0).astype(np.float64), x0, y0, L_PX, nord, syd, vest, øst, B, B)
    r = udsnit(rå, x0, y0, L_PX, nord, syd, vest, øst, B, B)
    # Klodens kort i samme punkter (8k: ca. 4,6 km pr. pixel)
    kx0, ky0, kpx = -math.pi * m, math.pi / 2 * m, 2 * math.pi * m / KB
    k = udsnit(klode, kx0, ky0, kpx, nord, syd, vest, øst, B, B)
    god = data > 0.99
    # Lysstyrken: middel og spredning i det grove (begge kort gjort lige grove) skal passe med kloden
    f = max(1, B // 256)
    grov = lambda a: a[:B // f * f, :B // f * f].reshape(B // f, f, B // f, f).mean(axis=(1, 3))
    gg = grov(god.astype(np.float64)) > 0.99
    rg, kg = grov(r)[gg], grov(k)[gg]
    a = kg.std() / max(rg.std(), 1e-6)
    b = kg.mean() - a * rg.mean()
    print(navn, f'huller {100 * (1 - god.mean()):.2f} %', 'lys: ', round(a, 3), '·', '+', round(b, 1))
    r = np.where(god, r * a + b, r)
    # Huller fyldes med klodens kort (blødt ind over to km)
    vægt = np.asarray(Image.fromarray((god * 255).astype(np.uint8), 'L').resize((B // 8, B // 8), Image.BOX).resize((B, B), Image.BILINEAR), dtype=np.float64) / 255
    vægt = np.where(god, vægt, 0)
    r = r * vægt + k * (1 - vægt)
    for s in størrelser:
        lille = np.asarray(Image.fromarray(r.astype(np.float32), 'F').resize((s, s), Image.BOX), dtype=np.float64)
        Image.fromarray(np.clip(np.round(lille), 0, 255).astype(np.uint8), 'L').save(
            os.path.join(ud, f'venus-{navn}-radar-{s // 1024}k.jpg'), quality=88, optimize=True, progressive=True)
        print(navn, s, 'gemt')
    # Højderne: GTDR skåret ud (huller fyldt med klodens 4k-kort)
    hu = udsnit(gtdr.astype(np.float64), g_x0, g_y0, g_px, nord, syd, vest, øst, h_str, h_str)
    hd = udsnit((gtdr != -32768).astype(np.float64), g_x0, g_y0, g_px, nord, syd, vest, øst, h_str, h_str)
    hk = udsnit(glob_h, -math.pi * m, math.pi / 2 * m, 2 * math.pi * m / glob_h.shape[1], nord, syd, vest, øst, h_str, h_str)
    h = np.where(hd > 0.999, hu, hk)
    print(navn, 'højder', round(h.min()), round(h.max()), f'huller {100 * (1 - (hd > 0.999).mean()):.1f} %')
    gem_højde(h, os.path.join(ud, f'venus-{navn}-hoejde.png'))


# ---------- Gløden ----------
def lys(h_m):
    T = T0 - FALD * (h_m / 1000 - NUL_KM)
    return (math.exp(C2 / (BØLGE * T0)) - 1) / (np.exp(C2 / (BØLGE * T)) - 1)


H2, B2 = 1024, 2048
hh = np.asarray(Image.fromarray(glob_h.astype(np.float32), 'F').resize((B2, H2), Image.BOX), dtype=np.float64)
L = lys(hh)
print('gløden: lavest', round(L.min(), 3), 'højest', round(L.max(), 3), 'Maxwell', round(float(lys(np.array(11000.0))), 3))
# Sløret: først mod nord og syd (samme bredde overalt), så mod øst og vest i hver række (bredere mod polerne)
km_px = math.pi * R_KM / H2
y = np.arange(-40, 41)
kern = np.exp(-0.5 * (y * km_px / SLØR) ** 2)
kern /= kern.sum()
p = np.pad(L, ((40, 40), (0, 0)), mode='edge')
L = sum(kern[i] * p[i:i + H2] for i in range(len(kern)))
for j in range(H2):
    cosb = math.cos((0.5 - (j + 0.5) / H2) * math.pi)
    s = SLØR / (km_px * max(cosb, 1e-3))
    if s > B2 / 6:
        L[j] = L[j].mean()
        continue
    n = int(math.ceil(4 * s))
    x = np.arange(-n, n + 1)
    k = np.exp(-0.5 * (x / s) ** 2)
    k /= k.sum()
    p = np.concatenate([L[j, -n:], L[j], L[j, :n]])
    L[j] = np.convolve(p, k, mode='valid')
g = np.asarray(Image.fromarray(L.astype(np.float32), 'F').resize((1024, 512), Image.BOX), dtype=np.float64)
Image.fromarray(np.clip(np.round(np.sqrt(g / GLØD_MAKS) * 255), 0, 255).astype(np.uint8), 'L').save(
    os.path.join(ud, 'venus-gloed-1k.jpg'), quality=92, optimize=True)
print('gløden (sløret): lavest', round(g.min(), 3), 'højest', round(g.max(), 3))
print('ok')
