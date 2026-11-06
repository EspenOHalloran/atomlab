# Laver kortet over Jupiter (js/kosmos/jupiter.js) ud fra Hubbles OPAL-kort (2025) og Cassinis kort (2000).
# Hent originalerne til en mappe (navnene til venstre), og kør:
#   python3 lav_jupiter.py <mappe med originaler> <ud-mappe>              kortene jupiter-4k/2k/1k.jpg
#   python3 lav_jupiter.py <mappe med originaler> <ud-mappe> sammenlign   et billede med OPAL og Cassini side om side
#
#   hlsp_opal_hst_wfc3-uvis_jupiter-2025a_f395n-f502n-f631n_v1_globalmap.tif
#       Hubble OPAL, cyklus 32 (11.-12. dec. 2025), farvebilledet fra tre smalle filtre, 3600 x 1800 (10 pixel pr. grad).
#       NASA, ESA, A. Simon (GSFC), OPAL, CC BY 4.0, doi:10.17909/T9G593:
#       https://archive.stsci.edu/hlsps/opal/cycle32/jupiter/
#       curl kræver en rodliste med "emSign Root CA - G1": certifi 2025.1.31 har den, 2026.10.18 har den ikke
#       (pip download certifi==2025.1.31, og læg cacert.pem sammen med /root/.ccr/ca-bundle.crt).
#   PIA07782.tif   Cassinis kort (11.-12. dec. 2000), 3601 x 1801, NASA/JPL/Space Science Institute:
#       https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia07/pia07782/PIA07782.tif
#
# Kortet:
# - Rækkerne følger den parametriske bredde beta (v = 0,5 + beta/180), for kloden er en kugle, der er trykket sammen
#   (scale.y = b/a i three.js). OPAL er planetografisk: tan(phi) = (a/b) tan(beta). Cassini er planetocentrisk:
#   tan(phi) = (b/a) tan(beta). Uden omregning står pletten ca. 2,8 grader forkert, og båndene fra de to kort passer ikke.
# - Søjlerne: OPAL har 0 grader System III i venstre kant, og den vestlige længde falder mod højre. Altså står øst til
#   højre, og u = østlig længde / 360 (vestlig længde = 360 (1 - u)). Det beholdes. Cassinis sidste søjle er en kopi af
#   den første (målt: forskellen er 0) og fjernes. Begge kort har øst til højre (Den Store Røde Plets hale af hvirvler
#   står vest for pletten, og festonerne ved NEB trækker mod sydvest).
# - Farverne: OPAL's farver er "arbitrarily scaled" (tre smalle filtre). De stemmes af efter Cassinis farver, som er tæt
#   på det, øjet ville se (NASA). Det er én fælles omregning af farverne for hele kloden (middelværdi og kovarians
#   i lineært lys, Monge-Kantorovich), målt mellem 60 grader S og 60 grader N. Den flytter ikke båndenes lysstyrke fra 2000 over på 2025.
# - Polerne: OPAL dækker kun ca. 81 grader S til 85 grader N. Fra 70 grader og op glider kortet over i Cassinis kort. Cassinis
#   polkort (PIA07783/84) er lavet af de samme billeder og er ikke skarpere end det cylindriske kort, så de bruges ikke.
#   Skyerne ved polerne er fra 2000 (polerne skjules alligevel af det tegnede lag med cyklonerne, J5).
import sys
import os
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
A, B = 71492.0, 66854.0  # km, ækvator og pol (NSSDC, samme som OPAL's ellipsoide)
OPAL = 'hlsp_opal_hst_wfc3-uvis_jupiter-2025a_f395n-f502n-f631n_v1_globalmap.tif'
CASSINI = 'PIA07782.tif'
POL_FRA, POL_TIL = 70.0, 78.0  # grader planetografisk: her glider OPAL over i Cassini (nord og syd)


def lin(a):  # sRGB (0-255) til lineært lys
    a = a / 255.0
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def srgb(a):
    a = np.clip(a, 0, 1)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * a ** (1 / 2.4) - 0.055) * 255.0


def læs(mappe):
    o = np.asarray(Image.open(os.path.join(mappe, OPAL))).astype(np.float64)
    c = np.asarray(Image.open(os.path.join(mappe, CASSINI))).astype(np.float64)[:, :-1]  # sidste søjle = første
    return o, c


def opslag(kort, rækker, søjler):
    # Bilineært opslag i et kort (rækker og søjler som kommatal), søjlerne går hele vejen rundt
    h, w = kort.shape[:2]
    r0 = np.clip(np.floor(rækker).astype(int), 0, h - 1)
    r1 = np.clip(r0 + 1, 0, h - 1)
    fr = np.clip(rækker - r0, 0, 1)[..., None]
    s0 = np.floor(søjler).astype(int)
    fs = (søjler - s0)[..., None]
    s0 %= w
    s1 = (s0 + 1) % w
    top = kort[r0, s0] * (1 - fs) + kort[r0, s1] * fs
    bund = kort[r1, s0] * (1 - fs) + kort[r1, s1] * fs
    return top * (1 - fr) + bund * fr


def på_beta(o, c, bredde, højde):
    # Begge kort lagt om til parametrisk bredde (rækker) og østlig længde (søjler), bredde x højde pixel
    beta = 90.0 - (np.arange(højde) + 0.5) * 180.0 / højde
    tb = np.tan(np.radians(beta))
    graf = np.degrees(np.arctan(A / B * tb))  # planetografisk (OPAL)
    cent = np.degrees(np.arctan(B / A * tb))  # planetocentrisk (Cassini)
    u = (np.arange(bredde) + 0.5) / bredde  # østlig længde / 360
    # OPAL: række i har midten ved 90 - (i + 0,5)/10, søjle j ved østlig længde (j + 0,5)/10
    ro = (90.0 - graf) * 10.0 - 0.5
    so = u * 3600.0 - 0.5
    # Cassini: række i ved 90 - i/10 (første og sidste række er polerne), 3600 søjler
    rc = (90.0 - cent) * 10.0
    sc = u * 3600.0 - 0.5
    R, S = np.meshgrid(ro, so, indexing='ij')
    op = opslag(o, R, S)
    R, S = np.meshgrid(rc, sc, indexing='ij')
    ca = opslag(c, R, S)
    return op, ca, graf


def farveomregning(o_lin, c_lin):
    # Monge-Kantorovich: den lineære omregning, der giver OPAL samme middelværdi og kovarians som Cassini
    mo, mc = o_lin.mean(0), c_lin.mean(0)
    Co = np.cov((o_lin - mo).T)
    Cc = np.cov((c_lin - mc).T)

    def rod(M):
        w, v = np.linalg.eigh(M)
        return v @ np.diag(np.sqrt(np.maximum(w, 1e-12))) @ v.T
    Ro = rod(Co)
    Roi = np.linalg.inv(Ro)
    T = Roi @ rod(Ro @ Cc @ Ro) @ Roi
    return lambda x: (x - mo) @ T.T + mc


def lav_kort(mappe, bredde=4096):
    o, c = læs(mappe)
    gyldig = (o.sum(axis=2) > 0).astype(np.float64)[..., None]
    # Kanten af OPAL's dækning har farvede rækker (filtrene dækker lidt forskelligt). Masken skæres 1° ind.
    for _ in range(10):
        gyldig = np.minimum(gyldig, np.roll(gyldig, 1, 0))
        gyldig = np.minimum(gyldig, np.roll(gyldig, -1, 0))
    højde = bredde // 2
    op, ca, graf = på_beta(np.concatenate([o, gyldig], axis=2), c, bredde, højde)
    maske = op[..., 3] > 0.999
    op = op[..., :3]
    o_lin, c_lin = lin(op), lin(ca)
    midt = np.abs(graf) < 60
    vælg = (maske & midt[:, None])
    omregn = farveomregning(o_lin[vælg][::7], c_lin[midt][::7].reshape(-1, 3))
    o_ny = omregn(o_lin.reshape(-1, 3)).reshape(o_lin.shape)
    # Polerne: Cassini fra POL_FRA til POL_TIL (glat), og altid hvor OPAL mangler
    v = np.clip((np.abs(graf) - POL_FRA) / (POL_TIL - POL_FRA), 0, 1)
    v = v * v * (3 - 2 * v)
    v = np.maximum(v[:, None], 1 - maske)[..., None]
    ud = o_ny * (1 - v) + c_lin * v
    return srgb(ud).astype(np.uint8), srgb(o_lin).astype(np.uint8), srgb(c_lin).astype(np.uint8)


def gem(ud, kort):
    # Kortet går rundt: En stribe fra den modsatte kant lægges på begge sider, før det skaleres ned, ellers giver
    # filteret en søm ved 0° (målt i tests/jupiter.mjs). Kortet er 4096 bredt, så striben bliver et helt antal pixel.
    p = 64
    bred = np.concatenate([kort[:, -p:], kort, kort[:, :p]], axis=1)
    im = Image.fromarray(bred)
    w = kort.shape[1]
    for navn, b in (('4k', 4096), ('2k', 2048), ('1k', 1024)):
        f = b / w
        lille = im.resize((round((w + 2 * p) * f), b // 2), Image.LANCZOS)
        lille.crop((round(p * f), 0, round(p * f) + b, b // 2)).save(os.path.join(ud, f'jupiter-{navn}.jpg'), quality=90, optimize=True, progressive=True)


def klode(kort, længde, str=700, bredde0=0.0):
    # Kloden set udefra (ortografisk), med midten ved østlig længde `længde` (grader) og bredde `bredde0`, fladtrykt.
    # Lyset kommer fra kameraet (fuld fase), og kanten er lidt mørkere (Minnaert, k = 0,9).
    h, w = kort.shape[:2]
    y, x = np.mgrid[0:str, 0:str]
    X = (x + 0.5) / str * 2 - 1
    Y = 1 - (y + 0.5) / str * 2
    f = B / A
    inde = X * X + (Y / f) ** 2 < 1
    Z = np.sqrt(np.clip(1 - X * X - (Y / f) ** 2, 0, 1))
    # punkt på enhedskuglen (før fladtrykning): (X, Y/f, Z), drej om x-aksen med bredde0
    px, py, pz = X, Y / f, Z
    b0 = np.radians(bredde0)
    py, pz = py * np.cos(b0) + pz * np.sin(b0), -py * np.sin(b0) + pz * np.cos(b0)
    beta = np.degrees(np.arcsin(np.clip(py, -1, 1)))
    lon = længde + np.degrees(np.arctan2(px, pz))
    rækker = (90 - beta) / 180 * h - 0.5
    søjler = (lon % 360) / 360 * w - 0.5
    farve = opslag(lin(kort.astype(np.float64)), rækker, søjler)
    # normalen på den fladtrykte klode
    n = np.stack([X, Y / (f * f), Z], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True) + 1e-9
    mu = np.clip(n[..., 2], 0, 1)
    farve = farve * (mu ** 0.9)[..., None]
    billede = srgb(farve)
    billede[~inde] = 0
    return billede.astype(np.uint8)


def udsnit(kort, længde, bredde, grader=24, str=700):
    # Et stykke af kortet omkring (længde, bredde) i fuld opløsning (planetografisk bredde regnes om til beta)
    h, w = kort.shape[:2]
    beta = np.degrees(np.arctan(B / A * np.tan(np.radians(bredde))))
    y, x = np.mgrid[0:str, 0:str]
    lon = længde + (x / str - 0.5) * grader
    bb = beta - (y / str - 0.5) * grader * 0.6
    rækker = (90 - bb) / 180 * h - 0.5
    søjler = (lon % 360) / 360 * w - 0.5
    return srgb(opslag(lin(kort.astype(np.float64)), rækker, søjler)).astype(np.uint8)


def plet(kort, bredde_grad=-22.0):
    # Den Store Røde Plet: den rødeste plet i båndet ved ca. 22° S (planetografisk)
    h, w = kort.shape[:2]
    beta = np.degrees(np.arctan(B / A * np.tan(np.radians(bredde_grad))))
    r = int((90 - beta) / 180 * h)
    bånd = kort[r - h // 90: r + h // 90].astype(np.float64)
    rød = (bånd[..., 0] - bånd[..., 2]).mean(0)
    rød = np.convolve(np.concatenate([rød[-50:], rød, rød[:50]]), np.ones(31) / 31, 'same')[50:-50]
    return (np.argmax(rød) + 0.5) / w * 360


def sammenlign(mappe, ud):
    from PIL import ImageDraw
    kort, opal, cassini = lav_kort(mappe, 3600)
    rækker = []
    for navn, k in (('OPAL 2025 (Hubble), som det er', opal), ('OPAL 2025 med Cassinis farver (anbefalet)', kort), ('Cassini 2000', cassini)):
        l = plet(k)
        række = Image.new('RGB', (1400, 740), (0, 0, 0))
        række.paste(Image.fromarray(klode(k, l + 25)), (0, 40))
        række.paste(Image.fromarray(udsnit(k, l, -22.0)), (700, 40))
        ImageDraw.Draw(række).text((12, 10), f'{navn}. Pletten ved {360 - l:.0f}° V (System III i kortet)', fill=(230, 230, 230))
        rækker.append(række)
        print(navn, 'pletten ved østlig længde', round(l, 1))
    alt = Image.new('RGB', (1400, 740 * 3))
    for i, r in enumerate(rækker):
        alt.paste(r, (0, 740 * i))
    alt.save(os.path.join(ud, 'jupiter-sammenligning.jpg'), quality=88)


if __name__ == '__main__':
    ind, ud = sys.argv[1], sys.argv[2]
    os.makedirs(ud, exist_ok=True)
    if len(sys.argv) > 3 and sys.argv[3] == 'sammenlign':
        sammenlign(ind, ud)
    else:
        kort, _, _ = lav_kort(ind)
        gem(ud, kort)
