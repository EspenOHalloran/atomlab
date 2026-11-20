# Laver kortene over formen af Saturns måner (Saturn S3 i docs/plan-saturn-kvalitet.md, js/kosmos/saturn.js).
# Hent originalerne til en mappe (navnene til venstre), og kør:  python3 lav_saturn_former.py <mappe med originaler> <ud-mappe>
#
#   enceladus_2019pm_radius.tif   Enceladus' form: radius minus 251.500 m (middelradius), 2 pixel pr. grad (ca. 2,2 km
#       pr. pixel), planetocentrisk, østlig længde, 180° Ø i midten (kortets venstre kant er 0°).
#       Bland m.fl. 2019 (ISPRS 2020), via USGS:
#       https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Enceladus/enceladus_cassini_iss_shapemodel_bland_2019/
#
#   S3b: Mimas, Tethys, Dione og Rhea (formmodeller i PDS Small Bodies Node, hentet i en browser 20. november 2026,
#   for sbnarchive.psi.edu ligger bag Cloudflares robottjek). Punkter (x, y, z) i km i månens egne retninger: x mod
#   0° (Saturn), z mod nord, y mod 90° Ø. Formatet står i .xml-filen ved siden af. Originalerne (og .xml-filerne)
#   ligger på grenen kilder-saturn-s3b under billeder/solsystem/kilder/s3b/.
#   mimas_quad256q.tab    Gaskell 2013, ICQ med q = 256 (6 × 257² punkter, ca. 1,2 km mellem dem): første linje er q,
#       så x, y, z. https://sbnarchive.psi.edu/pds4/non_mission/gaskell.mimas.shape-model/data/
#   tethys_ver128q.tab, dione_ver128q.tab    Gaskell 2013, trekanter lavet af ICQ med q = 128 (ca. 6,5 og 7 km):
#       første linje er antallet af punkter, så nummer, x, y, z (trekanterne bagefter bruges ikke).
#       https://sbnarchive.psi.edu/pds4/non_mission/gaskell.tethys.shape-model/data/ (og gaskell.dione...)
#   rhea_128_i.tab        SPC-model af Rhea, ICQ med q = 128 (ca. 8,6 km): første linje er q, så x, y, z og albedo.
#       https://sbnarchive.psi.edu/pds4/cassini/satellite-rhea.cassini.shape-models-maps/data/
#   Punkterne laves om til et kort: En stråle fra midten i hver pixels retning rammer en trekant mellem tre punkter
#   (trekanterne findes som det konvekse hylster om punkternes retninger, så formatet med eller uden trekanter er
#   ligegyldigt), og radius er der, hvor strålen rammer. Der regnes med 2 × 2 stråler pr. pixel. Kræver scipy.
#   Retningen er tjekket: Herschel (Mimas) er den laveste egn ved ca. 111° V, Odysseus (Tethys) ved ca. 35° N, 125° V.
#
# Formen gemmes som et kort over radius med 16 bit i rød og grøn (rød = de høje 8 bit) som Phobos og Deimos
# (lav_maaner.py), men regnet fra en "nul" i km, for radius i meter kan ikke være i 16 bit: værdi = radius − nul + 32,768 km
# i meter. Nul står også i js/kosmos/saturn.js (MÅNER, form.nul). Kortet har −180° til venstre, 0° (siden, der vender
# mod Saturn) i midten og østlig længde mod højre som farvekortene (lav_saturn.py).
#
# Huller (ca. 7 %, mest mod nord): Topografien (formen uden ellipsoiden) fyldes jævnt ind fra kanterne (som varme, der
# breder sig), og ellipsoiden lægges til igen. Så bliver hullerne hverken striber eller kugleformede buler.
import sys
import os
import numpy as np
from PIL import Image

ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)
INGEN = -1e30  # (ISIS' tomme værdi er ca. −3,4e38)


def læs(navn):
    a = np.asarray(Image.open(os.path.join(ind, navn)), np.float64)
    return a, a > INGEN


def fyld(a, gyldig, gange=4000):
    # Fyld hullerne jævnt: Hvert tomt punkt bliver gennemsnittet af sine naboer, igen og igen (rundt i længden)
    a = np.where(gyldig, a, 0.0)
    for _ in range(gange):
        n = (np.roll(a, 1, 1) + np.roll(a, -1, 1) + np.vstack([a[:1], a[:-1]]) + np.vstack([a[1:], a[-1:]])) / 4
        a = np.where(gyldig, a, n)
    return a


def glat(a, gange=2):
    # Glat punktstøjen fra punktskyen væk ([1, 2, 1] / 4 i begge retninger, rundt i længden), ca. 2 km
    for _ in range(gange):
        a = (np.roll(a, 1, 1) + 2 * a + np.roll(a, -1, 1)) / 4
        a = (np.vstack([a[:1], a[:-1]]) + 2 * a + np.vstack([a[1:], a[-1:]])) / 4
    return a


def ellipsoide(r_m, gyldig, lat, lon):
    # Den bedste ellipsoide med akserne langs x (mod Saturn), y (i banen) og z (aksen): 1/r² = x²/a² + y²/b² + z²/c²
    cb, sb = np.cos(lat), np.sin(lat)
    X = np.stack([(cb * np.cos(lon)) ** 2, (cb * np.sin(lon)) ** 2, sb ** 2 + 0 * lon], -1)
    A = X[gyldig]
    k = np.linalg.lstsq(A, 1 / r_m[gyldig] ** 2, rcond=None)[0]
    akser = 1 / np.sqrt(k)
    return 1 / np.sqrt(X @ k), akser


def gem_form(r_m, nul_km, navn):
    r_m = r_m.copy()
    r_m[0] = r_m[0].mean()  # polerne: samme værdi hele vejen rundt (ellers bliver de takkede)
    r_m[-1] = r_m[-1].mean()
    v = np.round(r_m - nul_km * 1000 + 32768)
    assert v.min() >= 0 and v.max() <= 65535, (v.min(), v.max())
    v = v.astype(np.uint16)
    rgb = np.zeros(v.shape + (3,), np.uint8)
    rgb[..., 0] = v >> 8
    rgb[..., 1] = v & 255
    Image.fromarray(rgb, 'RGB').save(os.path.join(ud, navn), optimize=True)
    print(navn, v.shape[::-1], f'radius {r_m.min() / 1000:.2f}-{r_m.max() / 1000:.2f} km')


def stråler(P, B, H):
    # Radius (km) i et gitter B × H (bredde 90° til −90°, længde −180° til 180° øst): en stråle fra midten gennem pixlens
    # midte rammer trekanten mellem tre punkter. d = α·P0 + β·P1 + γ·P2 med α, β, γ ≥ 0, og radius er 1 / (α + β + γ).
    from scipy.spatial import ConvexHull, cKDTree
    P = np.unique(np.round(P, 4), axis=0)  # ICQ har punkterne langs terningens kanter to gange
    u = P / np.linalg.norm(P, axis=1)[:, None]
    tri = ConvexHull(u).simplices
    ved = [[] for _ in range(len(P))]  # trekanterne ved hvert punkt
    for t, hjørner in enumerate(tri):
        for v in hjørner:
            ved[v].append(t)
    lat = np.radians(90 - (np.arange(H) + 0.5) * 180 / H)[:, None]
    lon = np.radians(-180 + (np.arange(B) + 0.5) * 360 / B)[None, :]
    D = np.stack([np.cos(lat) * np.cos(lon), np.cos(lat) * np.sin(lon), np.sin(lat) + 0 * lon], -1).reshape(-1, 3)
    træ = cKDTree(u)
    r = np.full(len(D), np.nan)
    for k in (1, 3, 8):  # trekanterne ved det nærmeste punkt, ellers ved de 3 eller 8 nærmeste
        idx = np.where(np.isnan(r))[0]
        if not len(idx):
            break
        nær = træ.query(D[idx], k=k)[1].reshape(len(idx), -1)
        for j in range(nær.shape[1]):
            for s in range(max(len(x) for x in ved)):
                tt = np.array([ved[v][s] if s < len(ved[v]) else -1 for v in nær[:, j]])
                ok = (tt >= 0) & np.isnan(r[idx])
                if not ok.any():
                    continue
                M = np.transpose(P[tri[tt[ok]]], (0, 2, 1))
                al = np.linalg.solve(M, D[idx[ok]][..., None])[..., 0]
                træf = (al >= -1e-9).all(1)
                r[idx[ok][træf]] = 1 / al[træf].sum(1)
    assert not np.isnan(r).any(), 'stråler, der ikke ramte'
    return r.reshape(H, B)


def læs_punkter(navn, nummer=False):
    # x, y, z (km) efter den første linje. nummer: der står et nummer før x (og trekanterne kommer efter punkterne)
    with open(os.path.join(ind, navn)) as f:
        n = int(f.readline().split()[0])
        if nummer:
            return np.array([f.readline().split()[1:4] for _ in range(n)], np.float64)
        return np.loadtxt(f, usecols=(0, 1, 2))


# Mimas, Tethys, Dione og Rhea (S3b). nul = radius i js/kosmos/saturn.js
for navn, fil, nummer, nul in [('mimas', 'mimas_quad256q.tab', False, 198), ('tethys', 'tethys_ver128q.tab', True, 531),
                               ('dione', 'dione_ver128q.tab', True, 561), ('rhea', 'rhea_128_i.tab', False, 764)]:
    if not os.path.exists(os.path.join(ind, fil)):
        continue
    H, B = 360, 720
    r_m = stråler(læs_punkter(fil, nummer), 2 * B, 2 * H).reshape(H, 2, B, 2).mean((1, 3)) * 1000
    lat = np.radians(90 - (np.arange(H) + 0.5) * 180 / H)[:, None]
    lon = np.radians(-180 + (np.arange(B) + 0.5) * 360 / B)[None, :]
    alle = np.ones_like(r_m, bool)
    ell, akser = ellipsoide(r_m, alle, lat, lon)
    print(navn.capitalize() + ': ellipsoide', ', '.join(f'{x / 1000:.1f}' for x in akser), 'km')
    # Trekanternes kanter glattes lidt (som punktstøjen på Enceladus)
    gem_form(ell + glat(r_m - ell), nul, f'{navn}-form.png')

# Enceladus
if os.path.exists(os.path.join(ind, 'enceladus_2019pm_radius.tif')):
    r, gr = læs('enceladus_2019pm_radius.tif')
    H, B = r.shape
    # Rul en halv omgang, så 0° er i midten (pixelernes midter passer præcist, for B er lige)
    r, gyldig = (np.roll(x, B // 2, axis=1) for x in (r, gr))
    lat = np.radians(90 - (np.arange(H) + 0.5) * 180 / H)[:, None]
    lon = np.radians(-180 + (np.arange(B) + 0.5) * 360 / B)[None, :]
    r_m = r + 251500
    ell, akser = ellipsoide(r_m, gyldig, lat, lon)
    print('Enceladus: ellipsoide', ', '.join(f'{x / 1000:.1f}' for x in akser), 'km; huller', f'{(~gyldig).mean():.1%}')
    topo = fyld(r_m - ell, gyldig)
    # Punktskyen giver støj fra punkt til punkt (tiere af meter), som bliver til korn i lav sol: glattes ca. 2 km
    gem_form(ell + glat(np.where(gyldig, r_m - ell, topo)), 252, 'enceladus-form.png')
