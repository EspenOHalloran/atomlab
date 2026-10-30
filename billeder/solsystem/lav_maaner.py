# Laver billederne til Mars' måner Phobos og Deimos (js/kosmos/mars.js, M6a i docs/plan-mars.md).
# Hent originalerne til en mappe (navnene til venstre), og kør:  python3 lav_maaner.py <mappe med originaler> <ud-mappe>
#
#   Phobos_ME_HRSC_DEM_Global_2ppd.tif     Phobos' form: højder i meter over en kugle på 11.100 m, 100 m pr. pixel,
#       østlig længde (ESA/DLR/FU Berlin, Mars Express HRSC, K. Willner m.fl., via USGS):
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Phobos_ME_HRSC_DEM_Global_2ppd.tif
#   Phobos_ME_SRC_Mosaic_Global_16ppd.tif  Phobos' overflade: mosaik af SRC-billeder fra Mars Express og Viking i
#       gråtoner, 16 pixel pr. grad (ESA/DLR/FU Berlin, Willner m.fl. 2008, via USGS):
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Phobos_ME_SRC_Mosaic_Global_16ppd.tif
#   Deimos.tab                             Deimos' form: Thomas' formmodel (1993), radius i km på et gitter på 5°.
#       Længden er VESTLIG (se nedenfor). Fra et spejl af NASA PDS (SHA-256 9a4dbc13…7ca2fd, som originalen):
#       https://raw.githubusercontent.com/andre6226/sistema-solare-opengl/53114a2cf9f266d968e7e475215e5c1985bc2ce3/resources/models/Deimos.tab
#   deimoscyl4.jpg                         Deimos' overflade i gråtoner, 0,1° pr. pixel, østlig længde (Viking, via USGS):
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/wms_basemaps/Deimos/deimoscyl4.jpg
#
# Formen gemmes som et kort over radius i meter med 16 bit i rød og grøn (rød = de høje 8 bit), og de to kort over
# overfladen i gråtoner, hvor lyset fra de store skygger er dæmpet (programmet regner selv lyset ud fra formen).
# Alle kort har længde −180° til venstre, 0° (siden, der vender mod Mars) i midten og østlig længde mod højre.
#
# Retningen er tjekket (docs/plan-mars.md, "Plan for M6"): Kraterne i USGS' navneliste ligger i fordybningerne i
# Phobos' højdekort, når længden er østlig. Thomas' formmodel af Phobos fra samme datasæt som Deimos passer kun med
# USGS' højdekort, når længden læses som vestlig (korrelation 0,96 mod 0,85). Deimos-filen vendes derfor til østlig,
# ellers bliver Deimos spejlvendt.
import sys
import os
import struct
import numpy as np
from PIL import Image

ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)


def tiff_rå(sti, dtype):
    # Læs et ukomprimeret TIFF med én kanal (PIL kan ikke læse USGS' filer med 16 bit og IsisCube-etiket)
    b = open(sti, 'rb').read()
    e = '<' if b[:2] == b'II' else '>'
    off = struct.unpack(e + 'I', b[4:8])[0]
    tags = {}
    for i in range(struct.unpack(e + 'H', b[off:off + 2])[0]):
        t, typ, n, v = struct.unpack(e + 'HHII', b[off + 2 + 12 * i:off + 14 + 12 * i])
        tags[t] = (typ, n, v)
    B, H = tags[256][2], tags[257][2]
    assert tags[259][2] == 1, 'komprimeret'
    def liste(tag):
        typ, n, v = tags[tag]
        if n == 1:
            return [v]
        return struct.unpack(e + f'{n}' + ('I' if typ == 4 else 'H'), b[v:v + (4 if typ == 4 else 2) * n])
    dt = np.dtype(dtype).newbyteorder(e)
    # Hver strimmel læses med sin egen længde (StripByteCounts)
    data = b''.join(b[o:o + n] for o, n in zip(liste(273), liste(279)))
    return np.frombuffer(data[:B * H * dt.itemsize], dt).reshape(H, B).astype(np.float64)


def omkring(a, lon_venstre, grader_pr_pixel, B, H, lat_top=90.0):
    # Læg et kort, der starter ved lon_venstre (grader øst), om på et gitter fra −180° til 180° og 90° til −90°
    # (pixelernes midter), lineært og hele vejen rundt (kortet kan gå lidt mere end en omgang)
    h_, b_ = a.shape
    lon = -180 + (np.arange(B) + 0.5) * 360 / B
    lat = 90 - (np.arange(H) + 0.5) * 180 / H
    x = ((lon - lon_venstre) % 360) / grader_pr_pixel - 0.5
    y = np.clip((lat_top - lat) / grader_pr_pixel - 0.5, 0, h_ - 1)
    x0 = np.floor(x).astype(int); fx = x - x0
    y0 = np.floor(y).astype(int); fy = y - y0
    y1 = np.minimum(y0 + 1, h_ - 1)
    omgang = round(360 / grader_pr_pixel)  # pixel pr. omgang (kortet kan have lidt mere)
    xa, xb = x0 % omgang, (x0 + 1) % omgang
    xa, xb = np.minimum(xa, b_ - 1), np.minimum(xb, b_ - 1)
    r0 = a[y0][:, xa] * (1 - fx) + a[y0][:, xb] * fx
    r1 = a[y1][:, xa] * (1 - fx) + a[y1][:, xb] * fx
    return r0 * (1 - fy)[:, None] + r1 * fy[:, None]


def poler(r):
    # Den øverste og nederste række får samme værdi hele vejen (ellers bliver polen takket)
    r[0] = r[0].mean()
    r[-1] = r[-1].mean()
    return r


def gem_radius(r_m, navn):
    v = np.clip(np.round(r_m), 0, 65535).astype(np.uint16)
    rgb = np.zeros(v.shape + (3,), np.uint8)
    rgb[..., 0] = v >> 8
    rgb[..., 1] = v & 255
    Image.fromarray(rgb, 'RGB').save(os.path.join(ud, navn), optimize=True)
    print(navn, v.shape[::-1], f'{v.min()}-{v.max()} m')


def sløret(a, faktor):
    # Kraftigt sløret udgave (ned og op i størrelse). Kortet går hele vejen rundt, så det forlænges til begge sider
    # først (ellers bliver kanten ved 180° forskellig på de to sider).
    h_, b_ = a.shape
    p = b_ // 4
    a = np.concatenate([a[:, -p:], a, a[:, :p]], axis=1)
    lille = Image.fromarray(a.astype(np.float32), 'F').resize((max(8, a.shape[1] // faktor), max(4, h_ // faktor)), Image.BOX)
    return np.asarray(lille.resize((a.shape[1], h_), Image.BICUBIC), np.float64)[:, p:p + b_]


def dæmp(a, faktor, styrke=0.85):
    # Dæmp de store forskelle i lyset (skygger og lys fra de billeder, mosaikken er lavet af), og behold detaljerne.
    # Mørke pletter, hvor der ingen data er, eller hvor det var skygge, fyldes med den almindelige grå.
    a = np.maximum(a, 1)
    stor = np.maximum(sløret(a, faktor), 1)  # (bikubisk kan gå lidt under 0 ved skarpe kanter)
    midt = np.median(a)
    mørk = np.clip((stor / midt - 0.25) / 0.25, 0, 1)  # 0 i store, mørke pletter
    detalje = a / stor
    ud_ = midt * np.exp(np.log(detalje) * mørk) * (stor / midt) ** (1 - styrke)
    ud_ = np.where(mørk < 1, ud_ * mørk + midt * (1 - mørk), ud_)
    return ud_ / np.percentile(ud_, 99.5)


def glat_poler(a, fra=84.0):
    # Tæt på polerne mødes alle længdegrader, og striber i kortet bliver til en stjerne. Rækkerne glider derfor over i
    # deres eget gennemsnit fra 'fra' grader og ind til polen.
    H = a.shape[0]
    bredde = 90 - (np.arange(H) + 0.5) * 180 / H
    t = np.clip((np.abs(bredde) - fra) / (89.5 - fra), 0, 1)
    w = t * t * (3 - 2 * t)
    return a * (1 - w)[:, None] + a.mean(axis=1, keepdims=True) * w[:, None]


def gem_grå(a, navn, B):
    Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8), 'L').resize((B, B // 2), Image.LANCZOS).save(os.path.join(ud, navn), quality=88, optimize=True, progressive=True)
    print(navn, os.path.getsize(os.path.join(ud, navn)) // 1000, 'kB')


# ---------- Phobos ----------
f = os.path.join(ind, 'Phobos_ME_HRSC_DEM_Global_2ppd.tif')
if os.path.exists(f):
    h = tiff_rå(f, 'i2')  # 699 x 349, 100 m pr. pixel
    # Kortet går lidt mere end en omgang (697 søjler er en omgang). Kanterne er fyldt ud med kopier: Søjle 0 og 1 er
    # ens, og søjle 696 og 697 er ens, og de passer ikke med naboerne (de ses som en rende ved 180° på Phobos). Kun
    # søjle 2 til 695 bruges. Trinnet mellem dem (ca. 200 m) fordeles blødt over 20 søjler (ca. 10°) på hver side, og
    # de tre søjler imellem (696, 0 og 1) fyldes ud.
    h = h[:, :697].copy()
    trin = h[:, 695] - h[:, 2]
    K = 20
    w = (1 - np.arange(K) / K) ** 2  # 1 ved kanten, 0 inde i kortet
    h[:, 2:2 + K] += 0.5 * trin[:, None] * w[None, :]
    h[:, 696 - K:696] -= 0.5 * trin[:, None] * w[None, ::-1]
    for c in (696, 0, 1):
        h[:, c] = h[:, 2]
    omkr = 2 * np.pi * 11100  # m
    gpp = 100 / omkr * 360  # grader pr. pixel
    venstre = -34900 / omkr * 360  # UpperLeftCornerX i etiketten: kortet starter ved −180,15°
    top = 17435.839227 / omkr * 360
    gem_radius(poler(omkring(h, venstre, gpp, 720, 360, top) + 11100), 'phobos-form.png')
f = os.path.join(ind, 'Phobos_ME_SRC_Mosaic_Global_16ppd.tif')
if os.path.exists(f):
    a = tiff_rå(f, 'u1')  # 5760 x 2880, præcis −180° til 180°
    # Kortet har huller uden data (0): mest i de sidste ca. 40 søjler ved 180° (op til 3/4 tomme, de sidste 4 helt) og
    # i de øverste rækker ved nordpolen. Hullerne fyldes lineært langs rækken (hele vejen rundt), og de 4 øverste
    # rækker bliver som række 4.
    # Søjlerne omkring 180° er også mørkere end resten, hvor billederne i mosaikken mødes (de ses som en mørk rende på
    # Phobos). Et bånd på ca. 6° (søjle 5660 til 39) behandles derfor som manglende og fyldes ud.
    # Båndet fyldes med spejlede stykker af overfladen fra begge sider, der glider over i hinanden (en lige linje
    # mellem kanterne gav vandrette striber). Først fyldes de enkelte huller i kanterne.
    x = np.arange(a.shape[1])
    for y in range(a.shape[0]):
        god = a[y] > 0
        if not god.all() and god.sum() > 10:
            a[y, ~god] = np.interp(x[~god], x[god], a[y, god], period=a.shape[1])
    G = 140  # søjle 5660 til 5759 og 0 til 39
    g = np.arange(G)
    t = (g + 0.5) / G
    t = t * t * (3 - 2 * t)
    venstre = a[:, 5659 - g]  # spejlet fra søjle 5659 og mod vest
    højre = a[:, 40 + (G - 1 - g)]  # spejlet fra søjle 40 og mod øst
    bånd = venstre * (1 - t) + højre * t
    a[:, 5660:] = bånd[:, :100]
    a[:, :40] = bånd[:, 100:]
    x = np.arange(a.shape[1])
    for y in range(a.shape[0]):
        god = a[y] > 0
        if not god.all() and god.sum() > 10:
            a[y, ~god] = np.interp(x[~god], x[god], a[y, god], period=a.shape[1])
    a[:4] = a[4]
    # Trinnet mellem de to kanter (ved 180°) fordeles blødt over 96 søjler (6°) på hver side, som i højdekortet
    K = 96
    trin = a[:, -1] - a[:, 0]
    w = (1 - np.arange(K) / K) ** 2
    a[:, :K] += 0.5 * trin[:, None] * w[None, :]
    a[:, -K:] -= 0.5 * trin[:, None] * w[None, ::-1]
    d = glat_poler(dæmp(a, 48))
    gem_grå(d, 'phobos-4k.jpg', 4096)
    gem_grå(d, 'phobos-2k.jpg', 2048)

# ---------- Deimos ----------
f = os.path.join(ind, 'Deimos.tab')
if os.path.exists(f):
    t = np.loadtxt(f)
    lat = np.unique(t[:, 0])[::-1]  # 90 … −90
    lonV = np.unique(t[:, 1])  # 0 … 360 (vestlig)
    g = np.zeros((len(lat), len(lonV)))
    for la, lo, rr in t:
        g[np.where(lat == la)[0][0], np.where(lonV == lo)[0][0]] = rr * 1000
    g = g[:, :-1]  # 360° = 0°
    # Vestlig → østlig: længde øst = −længde vest. Søjlerne for øst −180, −175 … 175.
    lonØ = -180 + 5 * np.arange(72)
    g = g[:, [int(round((-lo) % 360 / 5)) % 72 for lo in lonØ]]
    # Glat forfining til 360 x 180 med Catmull-Rom (hele vejen rundt i længden). Gitteret: rækker 90° … −90°,
    # søjler −180° … 175°, alle i trin på 5°.
    lon = -180 + (np.arange(360) + 0.5)
    la2 = 90 - (np.arange(180) + 0.5)
    fy, fx = (90 - la2) / 5, (lon + 180) / 5
    y0, x0 = np.floor(fy).astype(int), np.floor(fx).astype(int)
    ty, tx = fy - y0, fx - x0

    def vægte(t):
        return [((-t + 2) * t - 1) * t / 2, (3 * t - 5) * t * t / 2 + 1, ((-3 * t + 4) * t + 1) * t / 2, (t - 1) * t * t / 2]

    wy, wx = vægte(ty), vægte(tx)
    r = np.zeros((180, 360))
    for a_ in range(4):
        rækker = np.clip(y0 + a_ - 1, 0, g.shape[0] - 1)
        for b2 in range(4):
            søjler = (x0 + b2 - 1) % 72
            r += wy[a_][:, None] * wx[b2][None, :] * g[rækker][:, søjler]
    gem_radius(poler(r), 'deimos-form.png')
f = os.path.join(ind, 'deimoscyl4.jpg')
if os.path.exists(f):
    a = np.asarray(Image.open(f).convert('L'), np.float64)  # 3600 x 1800, −180° til 180°
    gem_grå(glat_poler(dæmp(a, 36)), 'deimos-2k.jpg', 2048)
