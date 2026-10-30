# Laver de lokale kort til stederne på Mars (js/kosmos/mars.js, LOKALE): et højdekort og et farvekort over et område
# på ca. 1.000 × 1.000 km, som det lokale net i js/solsystem/klippeplanet.js bruger (Mars M7a).
# Kør:  python3 lav_steder.py <ud-mappe> [mappe med originaler] [kun=olympus,tharsis]
# (kræver numpy, Pillow og rasterio). Uden en mappe med originaler læses kun vinduet om stedet direkte hos USGS
# (filerne er ukomprimerede, så rasterio kan læse et vindue over nettet: ca. 3 minutter for HRSC+MOLA).
#
#   Mars_MGS_MOLA_DEM_mosaic_global_463m.tif   Højder: MOLA (NASA/GSFC, via USGS), 463 m pr. pixel, CC0
#   Mars/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2.tif
#       Højder: HRSC (ESA/DLR/FU Berlin) og MOLA lagt sammen af USGS (Fergason, Hare og Laura 2018), 200 m pr. pixel,
#       CC BY-SA 3.0 IGO. Højdekortene herfra er derfor også CC BY-SA 3.0 IGO (se KILDER.md).
#   Mars_Viking_ClrMosaic_global_925m.tif      Farver: Viking (NASA/JPL/USGS), 925 m pr. pixel, samme som kloden.
#   Alle under https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/
#
# Farverne: Viking MDIM 2.1 i 232 m blev prøvet, men billederne har skygger fra Solen, da de blev taget (fx mørke
# skygger i calderaen og en lys skrænt). De ville modsige programmets eget lys, som regnes ud fra højderne. Derfor
# bruges 925 m-mosaikken (næsten uden skygger), og detaljerne kommer fra højdekortet.
#
# Højderne: HRSC+MOLA er skarpere end MOLA (mellem MOLA's målespor er der fyldt ud, så MOLA får et ternet mønster og
# et takket kraterrand), men den har et par kasseformede fejl, hvor landet er fladt (op til 1,2 km fra MOLA i snit over
# ca. 7 km). Hvor HRSC+MOLA i snit afviger mere fra MOLA, end landet omkring er ujævnt, bruges MOLA (MOLA er målt med
# laser og er rigtig i store træk). Ved Olympus Mons gælder det ca. 0,5 % af området.
#
# Detaljekort: Inden for et sted kan et mindre område få et skarpere højdekort (DETALJER), som det lokale net bruger,
# hvor det findes (ved calderaen og skrænten på Olympus Mons ca. 0,22 km pr. pixel, næsten som kilden). Det hentes
# først, når flybyen nærmer sig stoppene dér.
#
# Kortene dækker præcis stedets grænser i bredde og længde (grader øst), med længden mod højre og nord øverst.
# Højderne gemmes som kloden (lav_mars.py): 16 bit i rød og grøn, fra HØJDE_MIN til HØJDE_MAX i trin på ca. 3,7 m.
import sys
import os
import math
import numpy as np
from PIL import Image
import rasterio
from rasterio.windows import from_bounds

# Stedets grænser: nord, syd, vest, øst (grader, øst positiv). Skal være de samme som LOKALE i js/kosmos/mars.js.
# Olympus Mons: midten 18,40° N, 226,00° Ø (USGS' navneliste) og ca. 1.000 km på hver led (1° = 59,27 km, og mod øst
# ganges med cos 18,5°).
# Tharsis-vulkanerne (M5a): Arsia, Pavonis og Ascraeus Mons, ca. 1.840 × 1.600 km. Vestkanten holder 0,5° fra Olympus.
STEDER = {
    'olympus': (27.5, 9.5, -143.5, -124.5),
    'tharsis': (16.0, -15.0, -124.0, -97.0),
    # Valles Marineris (M5a): midten med Melas, Candor og Ophir Chasma og starten af Coprates, ca. 1.470 × 950 km
    'valles': (0.0, -16.0, -80.0, -55.0),
    # M5b: Gale (5,37° S, 137,81° Ø) og Jezero (18,41° N, 77,69° Ø), midterne fra USGS' navneliste (MDIM 2.1). Ca. 356 ×
    # 356 km om hvert krater, så kortet på 2048 × 2048 har ca. 0,17 km pr. pixel: lige så skarpt som kilden (200 m),
    # og intet detaljekort er nødvendigt. Jezero: 6° mod øst er kun ca. 5,7° på kloden (cos 18,4°), så kortet er 6,4° bredt.
    'gale': (-2.4, -8.4, 134.8, 140.8),
    'jezero': (21.4, 15.4, 74.5, 80.9),
}
# Steder, hvor HRSC+MOLA ikke var tydeligt skarpere end MOLA i spillets opløsning (billederne i M5a). Her bruges kun
# MOLA (CC0). Tharsis: ca. 0,9 km pr. pixel, og MOLA har 463 m.
KUN_MOLA = {'tharsis'}
# Detaljekortene (samme form, og de skal ligge inden for stedet). Skal være de samme som detalje i LOKALE.
# Olympus Mons: calderaen (18,4° N, 226,7° Ø) og skrænten mod nordvest (22,15° N, 222,6° Ø), ca. 445 × 445 km.
DETALJER = {
    'olympus': (24.0, 16.5, -139.5, -131.5),
    # Valles Marineris: Melas, Candor og Ophir Chasma, hvor kløfterne mødes (ca. 590 × 560 km, ca. 0,28 km pr. pixel)
    'valles': (-3.0, -12.5, -77.0, -67.0),
}
DETALJE = (2048, 1024)  # pc og tablet, tests
HØJDE_MIN, HØJDE_MAX = -8500.0, 21500.0  # m, de samme som i lav_mars.py og js/kosmos/mars.js
HØJDE = (2048, 1024)  # bredden: pc og tablet, tests
FARVE = 1024  # ca. 1 km pr. pixel (originalen har 925 m)
# Højden af kortene i forhold til bredden (1 = kvadratisk). Skal passe med nettet i LOKALE (net) i js/kosmos/mars.js.
FORM = {'valles': 0.5}
R = 3396190.0
USGS = '/vsicurl/https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/'
FILER = {
    'mola': 'Mars_MGS_MOLA_DEM_mosaic_global_463m.tif',
    'hrsc': 'Mars/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2.tif',
    'farve': 'Mars_Viking_ClrMosaic_global_925m.tif',
}
ud = sys.argv[1]
ind = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('kun=') else None
kun = next((a[4:].split(',') for a in sys.argv[2:] if a.startswith('kun=')), None)
os.makedirs(ud, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None
if os.path.exists('/root/.ccr/ca-bundle.crt'):
    os.environ.setdefault('CURL_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')


def læs(navn, grænser):
    # Vinduet om stedet (med en halv grad ekstra) og vinduets venstre og øverste kant og pixel i grader
    n, s, v, ø = grænser
    sti = os.path.join(ind, os.path.basename(FILER[navn])) if ind else USGS + FILER[navn]
    with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR', CPL_VSIL_CURL_CHUNK_SIZE=4194304, GDAL_HTTP_MAX_RETRY=5, GDAL_HTTP_RETRY_DELAY=2):
        with rasterio.open(sti) as d:
            f = 1 if d.crs.is_geographic else math.pi * R / 180  # meter pr. grad i de projicerede kort
            w = from_bounds((v - 0.5) * f, (s - 0.5) * f, (ø + 0.5) * f, (n + 0.5) * f, d.transform).round_offsets().round_lengths()
            a = d.read(window=w)
            t = d.window_transform(w)
            ingen = d.nodata
    if ingen is not None and navn != 'farve':
        assert not (a == ingen).any(), f'huller i {navn}'
    print(navn, a.shape, flush=True)
    return a, (t.c / f, t.a / f, t.f / f, t.e / f)


def udsnit(billede, t, grænser, b, h, metode):
    # Præcis stedets grænser, b × h pixel
    n, s, v, ø = grænser
    return billede.resize((b, h), metode, box=((v - t[0]) / t[1], (n - t[2]) / t[3], (ø - t[0]) / t[1], (s - t[2]) / t[3]))


def boks(x, r):
    # Middelværdien i et vindue på (2r + 1)² pixel
    p = np.pad(x, r + 1, mode='edge').cumsum(0).cumsum(1)
    n = 2 * r + 1
    return (p[n:, n:] - p[:-n, n:] - p[n:, :-n] + p[:-n, :-n])[:x.shape[0], :x.shape[1]] / (n * n)


def glat(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def højder(grænser, B, H=None, kun_mola=False):
    # Højderne i B × H pixel: HRSC+MOLA, men MOLA dér, hvor HRSC+MOLA har kasseformede fejl
    H = H or B
    mola, tm = læs('mola', grænser)
    if kun_mola:
        h = np.asarray(udsnit(Image.fromarray(mola[0].astype(np.float32), 'F'), tm, grænser, B, H, Image.BOX), np.float64)
        print('højder (MOLA)', h.min(), h.max())
        assert HØJDE_MIN <= h.min() and h.max() <= HØJDE_MAX
        return h
    hrsc, th = læs('hrsc', grænser)
    a = np.asarray(udsnit(Image.fromarray(mola[0].astype(np.float32), 'F'), tm, grænser, B, H, Image.BOX), np.float64)
    b = np.asarray(udsnit(Image.fromarray(hrsc[0].astype(np.float32), 'F'), th, grænser, B, H, Image.BOX), np.float64)
    # Vinduerne er lige store i km (ca. 7 km og 13 km), uanset hvor skarpt kortet er (0,52 km pr. pixel ved Olympus)
    km = (grænser[0] - grænser[1]) * math.pi * R / 180 / 1000 / H
    r = lambda n: max(1, round(n * 0.521 / km))
    # Hvor langt HRSC+MOLA i snit er fra MOLA, og hvor ujævnt landet er
    d = b - a
    afvigelse = np.abs(boks(d, r(6)))
    ujævn = np.sqrt(np.maximum(boks(a * a, r(12)) - boks(a, r(12)) ** 2, 0))
    tilladt = 30 + 0.5 * ujævn
    vægt = boks(1 - glat(tilladt, 2 * tilladt, afvigelse), r(3))
    h = a + vægt * d
    print('højder', round(km, 3), 'km pr. pixel', h.min(), h.max(), 'MOLA brugt i', round(float((vægt < 0.5).mean()) * 100, 2), '%')
    assert HØJDE_MIN <= h.min() and h.max() <= HØJDE_MAX
    return h


def gem_højder(h, størrelser, navn):
    # 16 bit i rød og grøn. navn(b) giver filnavnet for kortet med bredden b (højden i samme forhold som h).
    for b_ in størrelser:
        h_ = round(b_ * h.shape[0] / h.shape[1])
        x = h if b_ == h.shape[1] else np.asarray(Image.fromarray(h.astype(np.float32), 'F').resize((b_, h_), Image.BOX), np.float64)
        n = np.clip(np.round((x - HØJDE_MIN) / (HØJDE_MAX - HØJDE_MIN) * 65535), 0, 65535)
        n = np.minimum(np.round(n / 8) * 8, 65535).astype(np.uint32)
        rg = np.zeros((h_, b_, 3), np.uint8)
        rg[:, :, 0] = n >> 8
        rg[:, :, 1] = n & 255
        Image.fromarray(rg, 'RGB').save(os.path.join(ud, navn(b_)), optimize=True)
        print(navn(b_))


for id_, grænser in DETALJER.items():
    if kun and id_ not in kun:
        continue
    n, s, v, ø = grænser
    N, S, V, Ø = STEDER[id_]
    assert S < s < n < N and V < v < ø < Ø, 'detaljekortet skal ligge inden for stedet'
    gem_højder(højder(grænser, DETALJE[0]), DETALJE, lambda b_: f'mars-{id_}-detalje-hoejde-{"2k" if b_ == 2048 else "1k"}.png')

for id_, grænser in STEDER.items():
    if kun and id_ not in kun:
        continue
    form = FORM.get(id_, 1)
    # ---------- Højderne ----------
    gem_højder(højder(grænser, HØJDE[0], round(HØJDE[0] * form), id_ in KUN_MOLA), HØJDE, lambda b_: f'mars-{id_}-hoejde-{"2k" if b_ == 2048 else "1k"}.png')

    # ---------- Farverne (samme rettelse som i lav_mars.py) ----------
    rgb, tf = læs('farve', grænser)
    rgb = np.moveaxis(rgb, 0, -1)
    assert not (rgb == 0).all(axis=2).any(), 'tomme pixel i farvekortet'
    x = rgb.astype(np.float32)
    r, g, bl = x[..., 0], x[..., 1], x[..., 2]
    lys = 0.3 * r + 0.59 * g + 0.11 * bl
    behold = np.maximum(glat(1.1, 1.6, r / (g + 1)), glat(120, 170, lys))[..., None]
    mørk = lys[..., None] * np.array([1.28, 0.98, 0.74], np.float32)
    rgb = np.clip(np.round(mørk + (x - mørk) * behold), 0, 255).astype(np.uint8)
    navn = f'mars-{id_}-farve.jpg'
    udsnit(Image.fromarray(rgb, 'RGB'), tf, grænser, FARVE, round(FARVE * form), Image.LANCZOS).save(os.path.join(ud, navn), quality=90, optimize=True, progressive=True)
    print(navn)
print('ok')
