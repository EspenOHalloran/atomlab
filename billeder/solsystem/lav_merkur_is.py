# Laver kortet over radarens is ved Merkurs nordpol (js/kosmos/merkur.js, kontakten "Isen (set med radar)", MP2 i
# docs/drejebog-merkur-pluto.md). Kør:  python3 lav_merkur_is.py <PIA15530.jpg> <ud-mappe> [merkur-pol-nord-2k.jpg]
# (kræver numpy og Pillow)
#
#   PIA15530.jpg   NASA Photojournal PIA15530 "Radar-bright Deposits near Mercury's North Pole" (NASA/JHUAPL/Carnegie
#       Institution of Washington/Arecibo, public domain), 1920 × 1452: Arecibos radarbillede (Harmon m.fl. 2011, Icarus
#       211, 37-50) i gult oven på MESSENGERs fotos. Polarstereografisk med en cirkel for hver 5° bredde og 0° længde
#       forneden. Adressen: https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia15/pia15530/PIA15530.jpg
#
# Gitteret er målt i billedet: Polen står i pixel (640,5, 583), og cirklerne ved 85°, 80°, 75° og 70° har radius 306,8,
# 614,9, 925,2 og 1.239,2 pixel. Det passer med stereografisk (radius ∝ tan(afstand fra polen / 2)) inden for 0,1 %.
# Længden går mod uret set fra oven (Prokofiev, 62,9° Ø, står nede til højre), så punktet (bredde b, længde l) står i
# x = 640,5 + K · t · sin(l) og y = 583 + K · t · cos(l) med t = tan((90° − b) / 2).
#
# Det gule skilles fra det grå med (rød + grøn) / 2 − blå: Det grå har næsten lige meget af alle tre, og gitterets hvide
# streger er også grå. Kun klart gult tæller, og små prikker (støj) fjernes. Kortet gemmes i samme projektion og størrelse som polkortet (lav_merkur.py: polGitter), 1024 ×
# 1024 i gråtoner, så shaderen kan slå det op med polkortets uv (klippeplanet.js, pol.is). Med det tredje argument
# skrives også et billede, der sammenligner billedets grå med polkortet (kun til at se, at de passer).
import sys
import os
import math
import numpy as np
from PIL import Image, ImageFilter

pia, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)
CX, CY = 640.5, 583.0
CIRKLER = {85: 306.8, 80: 614.9, 75: 925.2, 70: 1239.2}
# K: pixel pr. tan(afstand / 2), mindste kvadrater gennem de fire cirkler
t = np.array([math.tan(math.radians(90 - b) / 2) for b in CIRKLER])
r = np.array(list(CIRKLER.values()))
K = float((t * r).sum() / (t * t).sum())
print('K', round(K, 1), 'afvigelse (pixel)', np.round(r - K * t, 1))

POLKANT = 70.0
RMAX = math.tan(math.radians(90 - POLKANT) / 2)  # som lav_merkur.py
N, SS = 1024, 2

a = np.asarray(Image.open(pia).convert('RGB')).astype(np.float32)
# Klart gult (radarens lyse pletter). I det mørke område ved polen, som ikke var fotograferet, er radarbilledet vist med
# svag, gul støj (prikker på få pixel). Den fjernes med en åbning (mindste og så største værdi i 5 × 5 pixel), så kun
# pletter over ca. 5 pixel (ca. 3 km) bliver.
gul = np.clip(((a[..., 0] + a[..., 1]) / 2 - a[..., 2] - 110) / 60, 0, 1)  # 0 = gråt, 1 = klart gult
g8 = Image.fromarray((gul * 255).astype(np.uint8), 'L')
åben = np.asarray(g8.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))).astype(np.float32) / 255
gul = np.minimum(gul, åben)
grå = a.mean(2)


def slåOp(billede, x, y):
    # Lineært mellem de fire nærmeste pixler (0 uden for billedet)
    h, b = billede.shape
    x0 = np.floor(x).astype(int); y0 = np.floor(y).astype(int)
    tx = x - x0; ty = y - y0
    inde = (x0 >= 0) & (y0 >= 0) & (x0 < b - 1) & (y0 < h - 1)
    x0 = np.clip(x0, 0, b - 2); y0 = np.clip(y0, 0, h - 2)
    v = (billede[y0, x0] * (1 - tx) + billede[y0, x0 + 1] * tx) * (1 - ty) \
        + (billede[y0 + 1, x0] * (1 - tx) + billede[y0 + 1, x0 + 1] * tx) * ty
    return np.where(inde, v, 0), inde


M = N * SS
j = (np.arange(M) + 0.5) / M
X = (j[None, :] - 0.5) * 2 * RMAX          # mod længde 0°
Z = (0.5 - j[:, None]) * 2 * RMAX          # mod 90° Ø
rr = np.hypot(X, Z)
l = np.arctan2(Z, X)
x = CX + K * rr * np.sin(l)
y = CY + K * rr * np.cos(l)
m, inde = slåOp(gul, x, y)
m = m.reshape(N, SS, N, SS).mean((1, 3))
Image.fromarray(np.clip(m * 255 + 0.5, 0, 255).astype(np.uint8), 'L').save(
    os.path.join(ud, 'merkur-is-nord-1k.png'), optimize=True)
print('is: andel af pixler over 0,5', round(float((m > 0.5).mean()) * 100, 2), '%')
print('dækket af billedet', round(float(inde.mean()) * 100, 1), '%')

if len(sys.argv) > 3:
    g, _ = slåOp(grå, x, y)
    g = g.reshape(N, SS, N, SS).mean((1, 3))
    p = np.asarray(Image.open(sys.argv[3]).convert('L').resize((N, N), Image.BILINEAR)).astype(np.float32)
    # Strakt kontrast i begge, side om side, og isen i rødt oven på polkortet
    st = lambda v: np.clip((v - np.percentile(v, 1)) / (np.percentile(v, 99) - np.percentile(v, 1)) * 255, 0, 255)
    rgb = np.stack([np.maximum(st(p), m * 255), st(p) * (1 - m), st(p) * (1 - m)], -1)
    Image.fromarray(np.concatenate([np.stack([st(g)] * 3, -1), rgb], 1).astype(np.uint8)).save(
        os.path.join(ud, 'sammenligning.jpg'), quality=85)
    # Hvor godt passer de? Korrelation med små skub (pixel i polkortet)
    gg = g - g.mean(); pp = p - p.mean()
    bedst = max(((float((np.roll(np.roll(gg, dy, 0), dx, 1) * pp)[100:-100, 100:-100].mean()), dx, dy)
                 for dx in range(-4, 5) for dy in range(-4, 5)))
    print('bedste skub (søjler, rækker)', bedst[1:], 'korrelation', round(bedst[0] / (gg.std() * pp.std()), 3))
