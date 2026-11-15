"""Små kort (1024 x 512) til kuglerne i Solsystemets overblik (docs/drejebog-overblik.md, afsnit 5).

Kortene står i ækvidistant projektion med længde 0° i midten og øst mod højre (som de andre kort).

- merkur-1k.jpg: MESSENGER MDIS BDR-mosaikken (USGS/PDS, public domain), hentet fra Wikimedia Commons i 1280 px.
  Gråtoner. Den øverste og nederste række er tomme i kilden og sættes til nabo-rækken.
- pluto-1k.jpg: New Horizons' farvekort (NASA/JHUAPL/SwRI, public domain, 2017), hentet fra Commons i 1280 px.
  Kilden har 180° i midten, så kortet rulles et halvt omgang. Det sydligste, som New Horizons ikke så (det lå i
  mørke), er sort i kilden og fyldes med en mørk, dæmpet udgave af kortets middelfarve (det siges i panelet).
- jorden-1k.jpg, mars-1k.jpg og saturn-1k.jpg: gjort mindre ud fra de kort, der allerede ligger her. Jorden får
  skyerne lagt ovenpå (jorden-skyer-2k.jpg), for sådan ser den ud langt væk.

Kildebillederne til Merkur og Pluto lægges ikke i repoet (retning.md). Kør:
    python lav_overblik.py <mappe med merkur.jpg og pluto.jpg>
Uden mappe hentes de fra upload.wikimedia.org.

Plutos baner (js/data/pluto-bane.js) laves af `python lav_overblik.py pluto-bane` (JPL Horizons).
"""
import sys
import os
import urllib.request
import urllib.parse
import json
from PIL import Image, ImageOps

HER = os.path.dirname(os.path.abspath(__file__))
B, H = 1024, 512
KILDER = {
    'merkur.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_32ppd.jpg/1280px-Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_32ppd.jpg',
    'pluto.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Pluto_color_mapmosaic.jpg/1280px-Pluto_color_mapmosaic.jpg',
}


def hent(mappe, navn):
    sti = os.path.join(mappe, navn)
    if not os.path.exists(sti):
        urllib.request.urlretrieve(KILDER[navn], sti)
    return Image.open(sti)


def gem(im, navn, kvalitet=88):
    im.save(os.path.join(HER, navn), quality=kvalitet, optimize=True, progressive=True)
    print(navn, os.path.getsize(os.path.join(HER, navn)) // 1024, 'KB')


def merkur(mappe):
    im = hent(mappe, 'merkur.jpg').convert('L').resize((B, H), Image.LANCZOS)
    px = im.load()
    # Mørke rækker i kanterne (kilden er tom helt oppe og nede) sættes til den nærmeste række med indhold
    # (og den allerøverste og nederste række, der er en lys kant i kilden)
    middel = [sum(px[x, y] for x in range(B)) / B for y in range(H)]
    top = max(1, next(y for y in range(H) if middel[y] > 40))
    bund = min(H - 2, next(y for y in range(H - 1, -1, -1) if middel[y] > 40))
    for x in range(B):
        for y in range(top):
            px[x, y] = px[x, top]
        for y in range(bund + 1, H):
            px[x, y] = px[x, bund]
    gem(im, 'merkur-1k.jpg', 78)


def pluto(mappe):
    im = hent(mappe, 'pluto.jpg').convert('RGB').resize((B, H), Image.LANCZOS)
    # Rul et halvt omgang: kilden har 180° i midten
    rullet = Image.new('RGB', (B, H))
    rullet.paste(im.crop((B // 2, 0, B, H)), (0, 0))
    rullet.paste(im.crop((0, 0, B // 2, H)), (B // 2, 0))
    px = rullet.load()
    sum_ = [0, 0, 0]
    n = 0
    for y in range(H):
        for x in range(B):
            r, g, b = px[x, y]
            if r + g + b > 40:
                sum_[0] += r; sum_[1] += g; sum_[2] += b; n += 1
    mørk = tuple(int(c / n * 0.35) for c in sum_)
    for y in range(H):
        for x in range(B):
            r, g, b = px[x, y]
            if r + g + b <= 40:
                px[x, y] = mørk
    gem(rullet, 'pluto-1k.jpg')


def jorden():
    dag = Image.open(os.path.join(HER, 'jorden-dag-10-2k.jpg')).convert('RGB').resize((B, H), Image.LANCZOS)
    sky = Image.open(os.path.join(HER, 'jorden-skyer-2k.jpg')).convert('L').resize((B, H), Image.LANCZOS)
    hvid = Image.new('RGB', (B, H), (245, 247, 250))
    gem(Image.composite(hvid, dag, sky.point(lambda v: int(v * 0.85))), 'jorden-1k.jpg', 80)


def mindre(kilde, navn):
    im = Image.open(os.path.join(HER, kilde)).convert('RGB').resize((B, H), Image.LANCZOS)
    gem(im, navn)


def pluto_bane():
    """js/data/pluto-bane.js: Plutos plads (AU, ekliptikken J2000) om Solen hvert år fra JPL Horizons."""
    q = {
        'format': 'json', 'COMMAND': "'999'", 'EPHEM_TYPE': "'VECTORS'", 'CENTER': "'500@10'",
        'START_TIME': "'1800-01-05'", 'STOP_TIME': "'2101-01-06'", 'STEP_SIZE': "'1 y'",
        'REF_PLANE': "'ECLIPTIC'", 'REF_SYSTEM': "'J2000'", 'VEC_TABLE': "'1'", 'OUT_UNITS': "'AU-D'", 'CSV_FORMAT': "'YES'",
    }
    url = 'https://ssd.jpl.nasa.gov/api/horizons.api?' + urllib.parse.urlencode(q)
    s = json.load(urllib.request.urlopen(url))['result']
    rækker = []
    for linje in s[s.index('$$SOE') + 5:s.index('$$EOE')].strip().splitlines():
        f = [x.strip() for x in linje.split(',')]
        rækker.append((float(f[0]), float(f[2]), float(f[3]), float(f[4])))
    jd0 = rækker[0][0]
    ud = [
        "// Plutos plads om Solen hvert år fra 5. januar 1800 til 5. januar 2101 (AU, ekliptikkens retninger J2000: X mod",
        "// forårspunktet, Z mod ekliptikkens nordpol). Fra JPL Horizons (Pluto 999, løsningen PLU060/DE440), hentet 15. november",
        "// 2026. JPL har fjernet Pluto fra de korte formler (tabel 1), så overblikket (js/data/planeter.js) bruger tabellen her.",
        "// Lavet af billeder/solsystem/lav_overblik.py pluto-bane, ret ikke i hånden. Uden Three.js.",
        f"export const JD0 = {jd0}; // 1800-01-05 kl. 0 (TDB)",
        "// Juliansk dato for hver række (kalenderår, så 365 eller 366 døgn imellem)",
        "export const DAG = [" + ",".join(str(int(round(r[0] - jd0))) for r in rækker) + "];",
        "export const XYZ = [",
    ]
    for i in range(0, len(rækker), 4):
        ud.append("  " + ",".join(f"{r[1]:.4f},{r[2]:.4f},{r[3]:.4f}" for r in rækker[i:i + 4]) + ",")
    ud.append("];")
    with open(os.path.join(HER, '..', '..', 'js', 'data', 'pluto-bane.js'), 'w', encoding='utf-8') as fil:
        fil.write("\n".join(ud) + "\n")


if __name__ == '__main__':
    if sys.argv[1:2] == ['pluto-bane']:
        pluto_bane()
        sys.exit()
    mappe = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HER, 'kilder-overblik')
    os.makedirs(mappe, exist_ok=True)
    merkur(mappe)
    pluto(mappe)
    jorden()
    mindre('mars-2k.jpg', 'mars-1k.jpg')
    mindre('saturn-2k.jpg', 'saturn-1k.jpg')
