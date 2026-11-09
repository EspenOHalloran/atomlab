# Laver billederne til Venus (js/kosmos/venus.js, V1 i docs/plan-venus.md) ud fra Magellans kort hos USGS.
# Hent originalerne til en mappe, og kør:  python3 lav_venus.py <mappe med originaler> <ud-mappe>
# (kræver numpy, Pillow og tifffile. rasterio er ikke nødvendig: kortene er enkle, og grænserne står i etiketterne)
#
#   Venus_Magellan_C3-MDIR_Global_Mosaic_2025m.tif     Radarkortet: Magellan C3-MDIR (NASA/JPL/USGS), 2.025 m pr. pixel,
#       18.775 × 9.388, 8 bit, 176 MB. 0 = ingen data.
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Venus_Magellan_C3-MDIR_Global_Mosaic_2025m.tif
#   Venus_Magellan_Topography_Global_4641m_v02.tif     Højderne: Magellan GTDR, version 2 (NASA/JPL/USGS), 4.641 m pr.
#       pixel, 8.192 × 4.096, 16 bit med fortegn, meter over kuglen med radius 6.051,0 km. −32768 = ingen data.
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Venus_Magellan_Topography_Global_4641m_v02.tif
#
# Begge kort har længdegrad 0° i midten og øst til højre (POSITIVE_LONGITUDE_DIRECTION = EAST i etiketterne), ligesom
# Mars' kort. Etiketterne (*_pds3.lbl) regner med en kugle med radius 6.051,0 km (NSSDC skriver 6.051,8 km, fælde 13 i
# docs/fakta-solsystemet/del7-venus.md). Programmet bruger derfor 6.051,0 km som kuglen, og højderne regnes fra den.
# Kortene går en brøkdel af en pixel ud over ±180° (GeoTIFF-felterne), så der skæres præcis 360° × 180° ud.
#
# Hullerne (Magellan nåede ikke det hele: radaren mangler ca. 4 % af overfladen, mest ved sydpolen syd for ca. 82,5° S
# og i striber, og højderne mangler mest omkring polerne) fyldes blødt med gennemsnittet af det, der er omkring
# (en pyramide: kortet gøres mindre og mindre, til hullerne er fyldt, og så glider det tilbage). Det siges ærligt.
#
# Radarkortet gemmes i gråtoner (8k, 4k og 2k). Lyst betyder ru eller skrå, ikke en lys farve (programmet toner det
# orange, som lyset er under skyerne). Højderne gemmes med 16 bit i rød og grøn som Mars:
# n = (højde − HØJDE_MIN) / (HØJDE_MAX − HØJDE_MIN) · 65535 (rundet til 8), rød = n // 256, grøn = n % 256.
# HØJDE_MIN og HØJDE_MAX skal være de samme som i js/kosmos/venus.js.
import sys
import os
import math
import numpy as np
from PIL import Image
import tifffile

Image.MAX_IMAGE_PIXELS = None
ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)
R = 6051000.0  # m: kuglen i kortene (etiketterne)
HØJDE_MIN, HØJDE_MAX = -3500.0, 12500.0  # m over 6.051,0 km (laveste i kortet ca. −2,95 km, Maxwell Montes ca. 11,7 km)
KANT = 4  # søjler fra den anden kant på hver side, så kortet går hele vejen rundt


def læs(navn):
    with tifffile.TiffFile(os.path.join(ind, navn)) as t:
        p = t.pages[0]
        skala = p.tags['ModelPixelScaleTag'].value
        punkt = p.tags['ModelTiepointTag'].value
        a = p.asarray()
    # Pixelkanterne (venstre, top, højre, bund) for præcis −180° til 180° og 90° til −90° (lagt KANT søjler ind)
    halv = math.pi * R
    x0, y0, dx, dy = punkt[3], punkt[4], skala[0], skala[1]
    boks = ((-halv - x0) / dx + KANT, (y0 - halv / 2) / dy, (halv - x0) / dx + KANT, (y0 + halv / 2) / dy)
    print(navn, a.shape, a.dtype, 'boks', [round(b, 3) for b in boks])
    return a, boks


def rundt(a):
    return np.concatenate([a[:, -KANT:], a, a[:, :KANT]], axis=1)


def mindre(a, b, boks):
    return np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize((b, b // 2), Image.BOX, box=boks), dtype=np.float64)


def fyld(v, w):
    # v: værdierne ganget med vægten, w: hvor stor en del af pixlen der er data (0-1). Huller fyldes med et blødt
    # gennemsnit af naboerne (pyramide). Kortet går rundt i øst-vest, så kanterne lånes fra den anden side.
    H, B = v.shape
    if (w > 1e-6).all() or H < 2:
        return v / np.maximum(w, 1e-9)
    lille_v = (v[0::2, 0::2] + v[1::2, 0::2] + v[0::2, 1::2] + v[1::2, 1::2]) / 4
    lille_w = (w[0::2, 0::2] + w[1::2, 0::2] + w[0::2, 1::2] + w[1::2, 1::2]) / 4
    grov = fyld(lille_v, lille_w)
    # Tilbage til fuld størrelse og blødt (en lille udglatning, så der ikke ses firkanter)
    stor = np.repeat(np.repeat(grov, 2, axis=0), 2, axis=1)
    p = np.pad(stor, ((1, 1), (0, 0)), mode='edge')
    p = np.concatenate([p[:, -1:], p, p[:, :1]], axis=1)
    stor = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:] + 4 * p[1:-1, 1:-1]) / 8
    ww = np.clip(w, 0, 1)
    return np.where(ww > 1e-6, v / np.maximum(w, 1e-9), 0) * ww + stor * (1 - ww)


def fyldRundt(v, w):
    # Pyramiden ser ikke, at kortets to kanter (180° V og 180° Ø) er naboer. Derfor lånes en fjerdedel af kortet fra
    # den anden side på hver side, før hullerne fyldes, ellers bliver der et spring ved 180°.
    P = v.shape[1] // 4
    om = lambda a: np.concatenate([a[:, -P:], a, a[:, :P]], axis=1)
    return fyld(om(v), om(w))[:, P:-P]


def sømmen(h, N=12):
    # Kilden har et spring ved 180° (ca. 120 m i middel mod ca. 30 m mellem to søjler ellers: målt i V1), så der ville
    # komme en streg i lyset. Springet i hver række (udglattet op og ned) fordeles over N søjler på hver side.
    spring = h[:, :2].mean(axis=1) - h[:, -2:].mean(axis=1)
    k = np.ones(9) / 9
    spring = np.convolve(np.pad(spring, 4, mode='edge'), k, mode='valid')
    t = (1 - (np.arange(N) + 0.5) / N)[None, :]  # 1 lige ved sømmen, 0 ude
    h[:, :N] -= spring[:, None] / 2 * t
    h[:, -N:] += spring[:, None] / 2 * t[:, ::-1]


def huller(maske, navn):
    # Hvor stor en del af overfladen der mangler (vægtet med cos til bredden, for rækkerne ved polerne er små)
    H = maske.shape[0]
    cosb = np.cos((0.5 - (np.arange(H) + 0.5) / H) * math.pi)
    andel = (maske.mean(axis=1) * cosb).sum() / cosb.sum()
    print(f'{navn}: {100 * andel:.1f} % af overfladen mangler')


# ---------- Radarkortet ----------
a, boks = læs('Venus_Magellan_C3-MDIR_Global_Mosaic_2025m.tif')
# Ved kanten af hullerne er der en søjle med for mørke værdier (ca. 10-30 mod ca. 127 i middel), som blev til mørke
# streger. Værdier under 50 er derfor huller (det er under 0,5 % af kortet), og hullerne gøres en pixel større.
data = a >= 50
data[:, 1:-1] &= data[:, :-2] & data[:, 2:]
data[1:-1, :] &= data[:-2, :] & data[2:, :]
# Den sidste søjle er tom, og den næstsidste er alt for mørk (middel ca. 44): begge er huller
data[:, -2:] = False
huller(~data, 'radar')


def streger(a, data, akse, B=512, grænse=0.93):
    # Sømme mellem Magellans strimler kan være en til tre rækker (eller søjler), der er mørkere end naboerne (fx ca.
    # 121 mod 151 ved 21,7° N). For hver række og hvert stykke på B pixel sammenlignes middelværdien med medianen af de
    # fire rækker over og under. Er den mere end 7 % mørkere, gøres den lysere, så den passer (mønstret bliver).
    if akse == 1:
        return streger(a.T, data.T, 0, B, grænse).T
    H, W = a.shape
    n = (W + B - 1) // B
    pad = n * B - W
    af = np.pad(a.astype(np.float32) * data, ((0, 0), (0, pad)))
    df = np.pad(data.astype(np.float32), ((0, 0), (0, pad)))
    m = af.reshape(H, n, B).sum(axis=2) / np.maximum(df.reshape(H, n, B).sum(axis=2), 1)
    gyldig = df.reshape(H, n, B).mean(axis=2) > 0.5
    naboer = np.stack([np.roll(m, k, axis=0) for k in (-4, -3, -2, 2, 3, 4)])
    ref = np.median(naboer, axis=0)
    f = np.where(gyldig & (m < grænse * ref) & (ref > 0), ref / np.maximum(m, 1), 1.0)
    f[:4] = f[-4:] = 1
    print('streger', 'rækker' if a.shape[0] < a.shape[1] else 'søjler', int((f > 1).sum()), 'stykker rettet')
    fakt = np.repeat(f, B, axis=1)[:, :W]
    return np.where(data, np.clip(np.round(a * fakt), 0, 255), a).astype(np.uint8)


a = streger(a, data, 0)
a = streger(a, data, 1)
a = rundt(a)
data = rundt(data)
for størrelse, b in (('8k', 8192), ('4k', 4096), ('2k', 2048)):
    w = mindre(data, b, boks)
    v = mindre(np.where(data, a, 0), b, boks)  # (BOX giver gennemsnittet, så v / w er middelværdien af det, der findes)
    g = fyldRundt(v, w)
    # Polen er ét punkt: den øverste og nederste række får samme værdi hele vejen rundt
    g[0, :] = g[0, :].mean()
    g[-1, :] = g[-1, :].mean()
    Image.fromarray(np.clip(np.round(g), 0, 255).astype(np.uint8), 'L').save(
        os.path.join(ud, f'venus-radar-{størrelse}.jpg'), quality=90 if b == 8192 else 88, optimize=True, progressive=True)
    print(størrelse, 'radar', round(g.min(), 1), round(g.max(), 1), 'middel', round(g.mean(), 1))
del a, data

# ---------- Højderne ----------
h, boks = læs('Venus_Magellan_Topography_Global_4641m_v02.tif')
data = h != -32768
huller(~data, 'højder')
print('højder', h[data].min(), h[data].max())
assert HØJDE_MIN <= h[data].min() and h[data].max() <= HØJDE_MAX
h = rundt(np.where(data, h, 0).astype(np.float32))
data = rundt(data)
for størrelse, b in (('4k', 4096), ('2k', 2048)):
    w = mindre(data, b, boks)
    v = mindre(h, b, boks)
    hh = fyldRundt(v, w)
    sømmen(hh)
    hh[0, :] = hh[0, :].mean()
    hh[-1, :] = hh[-1, :].mean()
    n = np.clip(np.round((hh - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535).astype(np.uint32)
    n = np.minimum(np.round(n / 8) * 8, 65535).astype(np.uint32)  # trin på ca. 2 m er nok (filen bliver mindre)
    rg = np.zeros((b // 2, b, 3), np.uint8)
    rg[:, :, 0] = n >> 8
    rg[:, :, 1] = n & 255
    Image.fromarray(rg, 'RGB').save(os.path.join(ud, f'venus-hoejde-{størrelse}.png'), optimize=True)
    print(størrelse, 'højde', round(hh.min()), round(hh.max()))
print('ok')
