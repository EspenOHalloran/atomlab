# Laver lagene til "Stå på Mars" (Mars M8 i docs/plan-mars.md, js/solsystem/landskab.js): højdekort og fotos i
# fire lag om de steder, man kan stå, fra 1 m tæt på til ca. 0,17 km langt væk.
# Kør:  python3 lav_landskab.py <ud-mappe> [krater]   (kræver numpy, scipy, Pillow og rasterio)
# Kun vinduerne om stederne læses direkte over nettet (filerne er GeoTIFF i firkanter eller striber).
#
#   USGS (https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars/):
#   MSL/MSL_Gale_DEM_Mosaic_1m_v3.tif          Højder ved Gale, 1 m pr. pixel (Calef og Parker, JPL/USGS, af HRSC,
#                                              CTX og HiRISE). Mærkes CC BY-SA 3.0 IGO for en sikkerheds skyld (HRSC).
#   MSL/MSL_Gale_Orthophoto_Mosaic_25cm_v3.tif Foto ved Gale, 25 cm pr. pixel, gråt (HiRISE: NASA/JPL-Caltech/UArizona)
#   CTX_EZs/Gale_CTX_BlockAdj_dd.tif           Foto over hele Gale, ca. 5 m pr. pixel, gråt (CTX: NASA/JPL/MSSS)
#   Langt væk bruges højdekortet fra lav_steder.py (HRSC+MOLA, ../mars-gale-hoejde-2k.png).
#
# Lagene (forslag i planen, M8a): Hvert sted har et lag 0 (2 × 2 km) og et lag 1 (8 × 8 km). Lag 2 (64 × 64 km) og
# lag 3 (stedets kort fra lav_steder.py, ca. 356 × 356 km) deles af stederne ved samme krater.
#
# Retningerne: Alle lag regnes i meter mod øst og nord fra kraterets nulpunkt (REF): øst = R·cos(bredde₀)·Δlængde og
# nord = R·Δbredde (R = 3.396.190 m, den kugle, USGS' kort er lavet til). Det er en lige skalering af USGS' kort, så
# intet skal projiceres om. js/solsystem/landskab.js bruger samme regel. Grænserne skrives i <krater>.json.
#
# Huller: Hvor et lag ikke har data (fx uden for Gale-kortet), fyldes det med det grovere lag, og de to glider over i
# hinanden. Så har alle lag data overalt, og programmet behøver ingen maske.
#
# Skyggerne i fotoene: Fotoene fra kredsløb er taget om eftermiddagen, så Solens lys og skygger er malet ind. Programmet
# regner selv lyset ud fra højderne. Derfor fjernes den del af lysstyrken, der følger skråningerne i højdekortet: I
# firkanter regnes log(foto) ≈ a + b·hældning_øst + c·hældning_nord, og b·hældning_øst + c·hældning_nord trækkes fra.
# Det, der er mindre end højdekortets skarphed (sten, ribber i sandet), bliver tilbage.
# Lysstyrken: Hvert lag tilpasses det grovere lag (samme lysstyrke i snit), så de passer sammen, hvor de glider over.
# Fotoene gemmes som gråtoner, hvor 128 er lagets middel (programmet ganger med 2 · værdi).
import sys
import os
import json
import math
import numpy as np
from PIL import Image
from scipy import ndimage
import rasterio
from rasterio.windows import from_bounds
from rasterio.enums import Resampling

R = 3396190.0
USGS = '/vsicurl/https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars/'
HØJDE_MIN, HØJDE_MAX = -8500.0, 21500.0  # lag 3: kortene fra lav_steder.py (som lav_mars.py)
# Kraterne. REF: nulpunktet (bredde, længde i grader øst), midten af lag 2. steder: hvor man står (rovernes stop
# fra NASA's kortdata, mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json). fjern: lag 3 (nord, syd, vest,
# øst), som STEDER i lav_steder.py. Skal passe med LANDSKAB i js/kosmos/mars.js.
KRATERE = {
    'gale': {
        'ref': (-4.7515, 137.3735),
        'steder': {
            'naukluft': (-4.67837549, 137.3593593),   # stoppet ved sol 1301, hvor panoramaet PIA20332 er taget (4. april 2016, sol 1302)
            'curiosity': (-4.82466475, 137.3876138),  # sol 5045 (ca. 15. oktober 2026)
        },
        'fjern': (-2.4, -8.4, 134.8, 140.8),
        'fjern_fil': 'mars-gale-hoejde-{}.png',
        'dem': 'MSL/MSL_Gale_DEM_Mosaic_1m_v3.tif',
        'foto': 'MSL/MSL_Gale_Orthophoto_Mosaic_25cm_v3.tif',
        'ctx': 'CTX_EZs/Gale_CTX_BlockAdj_dd.tif',
    },
}
# Lagene: halv bredde (m), pixel i højdekortet og i fotoet. Lag 0 og 1 for hvert sted, lag 2 for krateret.
LAG = {
    0: {'halv': 1024, 'højde': 2048, 'foto': 8192},  # 1 m og 0,25 m
    1: {'halv': 4096, 'højde': 2048, 'foto': 4096},  # 4 m og 2 m
    2: {'halv': 32768, 'højde': 4096, 'foto': 4096},  # 16 m og 16 m
}
FOTO3 = 4096  # lag 3: CTX over hele stedets kort (ca. 87 m pr. pixel)
LILLE = {'højde': 512, 'foto': 1024}  # testudgaver (TEST_HURTIG)

ud = sys.argv[1]
kun = sys.argv[2] if len(sys.argv) > 2 else None
os.makedirs(ud, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None
if os.path.exists('/root/.ccr/ca-bundle.crt'):
    os.environ.setdefault('CURL_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')
ENV = dict(GDAL_DISABLE_READDIR_ON_OPEN='YES', CPL_VSIL_CURL_ALLOWED_EXTENSIONS='.tif,.ovr', GDAL_HTTP_MAX_RETRY=5,
           GDAL_HTTP_RETRY_DELAY=2, GDAL_HTTP_MULTIRANGE='YES', GDAL_HTTP_MERGE_CONSECUTIVE_RANGES='YES')


def grader(ref, øst, nord):
    # meter fra nulpunktet → (længde, bredde) i grader
    b0, l0 = ref
    return l0 + math.degrees(øst / (R * math.cos(math.radians(b0)))), b0 + math.degrees(nord / R)


def meter(ref, bredde, længde):
    b0, l0 = ref
    return R * math.cos(math.radians(b0)) * math.radians(længde - l0), R * math.radians(bredde - b0)


def læs(fil, ref, midt, halv, n, metode, ingen=None):
    # Et kvadrat på 2·halv meter om midt (øst, nord), n × n pixel, nord øverst. Pixel uden data bliver NaN.
    lv, bs = grader(ref, midt[0] - halv, midt[1] - halv)
    lø, bn = grader(ref, midt[0] + halv, midt[1] + halv)
    with rasterio.Env(**ENV):
        with rasterio.open(USGS + fil) as d:
            f = 1 if d.crs.is_geographic else math.pi * R / 180  # kortets enheder pr. grad
            w = from_bounds(lv * f, bs * f, lø * f, bn * f, d.transform)
            a = d.read(1, window=w, out_shape=(n, n), resampling=metode, boundless=True,
                       fill_value=d.nodata if d.nodata is not None else 0).astype(np.float64)
            nd = d.nodata if ingen is None else ingen
    if nd is not None:
        a[(a == nd) | (a < -1e30)] = np.nan
    print('  ', os.path.basename(fil), a.shape, f'{np.isnan(a).mean() * 100:.1f} % uden data', flush=True)
    return a


def fyld(fin, grov):
    # Huller i fin fyldes med grov (samme størrelse), og de to glider over i hinanden på ca. 3 % af bredden
    mangler = np.isnan(fin)
    if not mangler.any():
        return fin
    if mangler.all():
        return grov.copy()
    afstand = ndimage.distance_transform_edt(~mangler)
    v = np.clip(afstand / max(8, fin.shape[0] * 0.03), 0, 1)
    v = v * v * (3 - 2 * v)
    return np.where(mangler, grov, v * fin + (1 - v) * np.where(mangler, 0, grov))


def skaler(a, n):
    # bilineært til n × n (pixelcentre på samme sted)
    if a.shape[0] == n:
        return a
    z = n / a.shape[0]
    return ndimage.zoom(a, z, order=1, mode='nearest', grid_mode=True)


def udsnit_af(grov, grov_midt, grov_halv, midt, halv, n):
    # Et udsnit af et grovere lag (samme retninger), bilineært, n × n
    N = grov.shape[0]
    px = 2 * grov_halv / N
    i = (np.arange(n) + 0.5) / n * 2 * halv - halv  # meter fra midten
    xs = (midt[0] + i - (grov_midt[0] - grov_halv)) / px - 0.5
    ys = ((grov_midt[1] + grov_halv) - (midt[1] - i)) / px - 0.5  # rækkerne går mod syd (i går mod nord)
    yy, xx = np.meshgrid(ys, xs, indexing='ij')
    return ndimage.map_coordinates(grov, [yy, xx], order=1, mode='nearest')


def uden_skygger(foto, højde, px_h, flise=96):
    # Fjerner den del af lysstyrken, der følger skråningerne i højdekortet (se øverst)
    f = np.log(np.maximum(foto, 1e-3))
    gy, gx = np.gradient(højde, px_h)  # gy: mod syd (rækkerne), gx: mod øst
    gx = ndimage.gaussian_filter(gx, 0.7)
    gn = -ndimage.gaussian_filter(gy, 0.7)
    n = højde.shape[0]
    k = max(1, n // flise)
    B = np.zeros((k, k)); C = np.zeros((k, k))
    for i in range(k):
        for j in range(k):
            sl = (slice(i * n // k, (i + 1) * n // k), slice(j * n // k, (j + 1) * n // k))
            ff = skaler_blok(f, n, sl)
            X = np.stack([np.ones(ff.size), gx[sl].ravel(), gn[sl].ravel()], 1)
            if np.std(gx[sl]) + np.std(gn[sl]) < 1e-4:
                continue
            c, *_ = np.linalg.lstsq(X, ff.ravel(), rcond=None)
            B[i, j], C[i, j] = c[1], c[2]
    # glatte koefficienter (ingen kanter mellem firkanterne), i fotoets størrelse
    Bf = skaler(ndimage.zoom(B, n / k, order=1, grid_mode=True, mode='nearest'), foto.shape[0])
    Cf = skaler(ndimage.zoom(C, n / k, order=1, grid_mode=True, mode='nearest'), foto.shape[0])
    korr = Bf * skaler(gx, foto.shape[0]) + Cf * skaler(gn, foto.shape[0])
    print(f'   skygger fjernet: hældning forklarede {np.std(korr):.3f} i log(lysstyrke)', flush=True)
    return np.exp(f - korr)


def skaler_blok(f, n, sl):
    # fotoet (større end højdekortet) i højdekortets pixel for en firkant
    s = f.shape[0] // n
    blok = f[sl[0].start * s:sl[0].stop * s, sl[1].start * s:sl[1].stop * s]
    return blok.reshape(blok.shape[0] // s, s, blok.shape[1] // s, s).mean((1, 3)) if s > 1 else blok


def tilpas(fin, grov_udsnit, faktor):
    # Samme lysstyrke i snit som det grovere lag, så lagene passer sammen, hvor de glider over. faktor: hvor mange af
    # fin's pixel der går på én pixel i det grovere lag (forholdet regnes på det grovere lags skala).
    s = 2.0 * faktor
    g = ndimage.gaussian_filter(grov_udsnit, s)
    fg = ndimage.gaussian_filter(fin, s)
    return fin * ndimage.gaussian_filter(g / np.maximum(fg, 1e-3), s)


def gem_højde(h, navn, lille=True):
    lo, hi = float(np.floor(h.min() - 1)), float(np.ceil(h.max() + 1))
    for n, fil in [(h.shape[0], navn + '.png')] + ([(LILLE['højde'], navn + '-lille.png')] if lille else []):
        x = skaler_ned(h, n)
        v = np.clip(np.round((x - lo) / (hi - lo) * 65535), 0, 65535).astype(np.uint32)
        rg = np.zeros(x.shape + (3,), np.uint8)
        rg[..., 0] = v >> 8
        rg[..., 1] = v & 255
        Image.fromarray(rg, 'RGB').save(os.path.join(ud, fil), optimize=True)
        print('  ', fil, f'{os.path.getsize(os.path.join(ud, fil)) / 1e6:.2f} MB', flush=True)
    return [lo, hi]


def skaler_ned(a, n):
    if a.shape[0] == n:
        return a
    s = a.shape[0] // n
    return a.reshape(n, s, n, s).mean((1, 3))


def gem_foto(f, navn, størrelser):
    # 128 = lagets middel (programmet ganger med 2 · værdi)
    m = np.nanmean(f)
    for n, fil in størrelser:
        x = skaler_ned(f, n) / m * 128
        Image.fromarray(np.clip(np.round(x), 0, 255).astype(np.uint8), 'L').save(os.path.join(ud, fil), quality=90)
        print('  ', fil, f'{os.path.getsize(os.path.join(ud, fil)) / 1e6:.2f} MB', flush=True)


def kort_fra_png(fil):
    a = np.asarray(Image.open(fil).convert('RGB')).astype(np.float64)
    return (a[..., 0] * 256 + a[..., 1]) / 65535 * (HØJDE_MAX - HØJDE_MIN) + HØJDE_MIN


for kid, K in KRATERE.items():
    if kun and kun != kid:
        continue
    ref = K['ref']
    print(kid, flush=True)
    data = {'ref': list(ref), 'R': R, 'lag': {}, 'steder': {}}
    # ---- Lag 3: stedets kort fra lav_steder.py (lat/lon-grænser) som et lag i samme retninger ----
    N, S, V, Ø = K['fjern']
    mappe = os.path.dirname(os.path.abspath(__file__))
    h3 = kort_fra_png(os.path.join(mappe, K['fjern_fil'].format('2k')))
    øv, ns = meter(ref, S, V)
    øø, nn = meter(ref, N, Ø)
    data['lag']['3'] = {'højde': K['fjern_fil'], 'øst': [øv, øø], 'nord': [ns, nn], 'h': [HØJDE_MIN, HØJDE_MAX], 'global': True,
                        'foto': f'{kid}-f3.jpg'}
    # Lag 3 som et kvadrat om nulpunktet (til at fylde huller i lag 2): resample fra lat/lon-kortet
    def h3_ved(midt, halv, n):
        i = (np.arange(n) + 0.5) / n * 2 * halv - halv
        e = midt[0] + i
        no = midt[1] - i
        xs = (e - øv) / (øø - øv) * h3.shape[1] - 0.5
        ys = (nn - no) / (nn - ns) * h3.shape[0] - 0.5
        yy, xx = np.meshgrid(ys, xs, indexing='ij')
        return ndimage.map_coordinates(h3, [yy, xx], order=1, mode='nearest')

    # Lag 3's foto: CTX over hele stedets kort (huller fyldes med middel og glider ud)
    print(' lag 3 foto', flush=True)
    halv3 = max(øø - øv, nn - ns) / 2
    midt3 = ((øv + øø) / 2, (ns + nn) / 2)
    f3 = læs(K['ctx'], ref, midt3, halv3, FOTO3, Resampling.average, ingen=0)
    f3 = fyld(f3, np.full_like(f3, np.nanmean(f3)))
    f3 = uden_skygger(f3, skaler(h3_ved(midt3, halv3, FOTO3 // 2), FOTO3 // 2), 2 * halv3 / (FOTO3 // 2))
    data['lag']['3']['foto_øst'] = [midt3[0] - halv3, midt3[0] + halv3]
    data['lag']['3']['foto_nord'] = [midt3[1] - halv3, midt3[1] + halv3]
    gem_foto(f3, f'{kid}-f3', [(FOTO3, f'{kid}-f3.jpg'), (LILLE['foto'], f'{kid}-f3-lille.jpg')])

    # ---- Lag 2: Gale-kortet (16 m), huller fra lag 3 ----
    print(' lag 2', flush=True)
    L = LAG[2]
    midt2 = (0.0, 0.0)
    g3 = h3_ved(midt2, L['halv'], L['højde'])
    h2 = fyld(læs(K['dem'], ref, midt2, L['halv'], L['højde'], Resampling.average), g3)
    data['lag']['2'] = {'højde': f'{kid}-h2.png', 'foto': f'{kid}-f2.jpg', 'øst': [-L['halv'], L['halv']], 'nord': [-L['halv'], L['halv']],
                        'h': gem_højde(h2, f'{kid}-h2')}
    f2 = læs(K['foto'], ref, midt2, L['halv'], L['foto'], Resampling.average, ingen=0)
    ctx2 = læs(K['ctx'], ref, midt2, L['halv'], L['foto'], Resampling.average, ingen=0)
    f3u = udsnit_af(f3, midt3, halv3, midt2, L['halv'], L['foto'])
    ctx2 = tilpas(fyld(ctx2, f3u), f3u, (2 * halv3 / FOTO3) / (2 * L['halv'] / L['foto']))
    f2 = tilpas(fyld(f2, ctx2), ctx2, 1)
    f2 = uden_skygger(f2, h2, 2 * L['halv'] / L['højde'])
    gem_foto(f2, f'{kid}-f2', [(L['foto'], f'{kid}-f2.jpg'), (LILLE['foto'], f'{kid}-f2-lille.jpg')])

    # ---- Lag 1 og 0 for hvert sted ----
    for sid, (b, l) in K['steder'].items():
        midt = meter(ref, b, l)
        data['steder'][sid] = {'bredde': b, 'længde': l, 'øst': midt[0], 'nord': midt[1]}
        grov_h, grov_midt, grov_halv = h2, midt2, LAG[2]['halv']
        grov_f, grov_fhalv = f2, LAG[2]['halv']
        for k in (1, 0):
            L = LAG[k]
            print(f' {sid} lag {k}', flush=True)
            g = udsnit_af(grov_h, grov_midt, grov_halv, midt, L['halv'], L['højde'])
            h = fyld(læs(K['dem'], ref, midt, L['halv'], L['højde'], Resampling.average if k else Resampling.bilinear), g)
            navn = f'{kid}-{sid}-h{k}'
            data['lag'][f'{sid}{k}'] = {'højde': navn + '.png', 'foto': f'{kid}-{sid}-f{k}.jpg', 'øst': [midt[0] - L['halv'], midt[0] + L['halv']],
                                         'nord': [midt[1] - L['halv'], midt[1] + L['halv']], 'h': gem_højde(h, navn)}
            f = læs(K['foto'], ref, midt, L['halv'], L['foto'], Resampling.average, ingen=0)
            gu = udsnit_af(grov_f, grov_midt, grov_fhalv, midt, L['halv'], L['foto'])
            f = tilpas(fyld(f, gu), gu, (2 * grov_fhalv / grov_f.shape[0]) / (2 * L['halv'] / L['foto']))
            f = uden_skygger(f, h, 2 * L['halv'] / L['højde'])
            størrelser = [(L['foto'], f'{kid}-{sid}-f{k}' + ('-8k' if L['foto'] == 8192 else '') + '.jpg')]
            if L['foto'] == 8192:
                størrelser.append((4096, f'{kid}-{sid}-f{k}.jpg'))
            størrelser.append((LILLE['foto'], f'{kid}-{sid}-f{k}-lille.jpg'))
            gem_foto(f, f'{kid}-{sid}-f{k}', størrelser)
            grov_h, grov_midt, grov_halv = h, midt, L['halv']
            grov_f, grov_fhalv = f, L['halv']
    data['hMaks'] = float(np.ceil(h3.max()))  # den højeste højde (m), så skyggerne kan stoppe tidligt
    with open(os.path.join(ud, f'{kid}.json'), 'w') as fil:
        json.dump(data, fil, ensure_ascii=False, indent=1)
    print('færdig', kid, flush=True)
