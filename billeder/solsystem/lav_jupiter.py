# Laver kortet over Jupiter (js/kosmos/jupiter.js) ud fra Hubbles OPAL-kort (2025) og Cassinis kort (2000).
# Hent originalerne til en mappe (navnene til venstre), og kør:
#   python3 lav_jupiter.py <mappe med originaler> <ud-mappe>              kortene jupiter-4k/2k/1k.jpg
#   python3 lav_jupiter.py <mappe med originaler> <ud-mappe> sammenlign   et billede med OPAL og Cassini side om side
#   python3 lav_jupiter.py <mappe med originaler> js/data vinde          vindene målt i OPAL (js/data/vinde-jupiter.js)
#
#   hlsp_opal_hst_wfc3-uvis_jupiter-2025a_f395n-f502n-f631n_v1_globalmap.tif
#       Hubble OPAL, cyklus 32 (11.-12. dec. 2025), farvebilledet fra tre smalle filtre, 3600 x 1800 (10 pixel pr. grad).
#       NASA, ESA, A. Simon (GSFC), OPAL, CC BY 4.0, doi:10.17909/T9G593:
#       https://archive.stsci.edu/hlsps/opal/cycle32/jupiter/
#       curl kræver en rodliste med "emSign Root CA - G1": certifi 2025.1.31 har den, 2026.10.18 har den ikke
#       (pip download certifi==2025.1.31, og læg cacert.pem sammen med /root/.ccr/ca-bundle.crt).
#   hlsp_opal_hst_wfc3-uvis_jupiter-2025{a,b}_{f631n,f502n,f395n,f467m}_v1_globalmap.fits
#       OPAL's to omgange (a og b) i fire filtre (FITS, ikke skaleret), til vindene. Samme sted og licens.
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


# ---------- Vindene (J2) ----------
# Hubble fotograferede Jupiter to omgange i træk (README for cyklus 32): omgang 1 fra 11. dec. 07:24:09 til 15:40:10
# og omgang 2 fra 16:49:03 til 12. dec. 01:05:03, altså 9 t 24 min 54 s senere ved hver længde (6 omløb med Hubble).
# Skyerne har flyttet sig i mellemtiden. For hver række (0,1° bred) findes den forskydning mod øst eller vest, hvor de
# to omgange ligner hinanden mest (krydskorrelation af rækken og dens naboer, efter at de store træk er trukket fra).
# Sådan målte Tollefson m.fl. (2017) vindene. Pletten og området omkring den tages ud, for den drejer og forvrænger
# målingen. Fire filtre måles hver for sig, og medianen bruges.
VIND_DT = 9 * 3600 + 24 * 60 + 54  # sekunder mellem de to omgange
VIND_FILTRE = ['f631n', 'f502n', 'f395n', 'f467m']
VIND_MAKS = 80  # pixel (8°) mod øst og vest
VIND_GYLDIG = 68.0  # grader: længere mod polerne er målingen for usikker (skrå vinkel, kanten af kortet)
PLET_SØJLE, PLET_RÆKKE = 383, 1130  # pletten i OPAL's kort (kun til at tage den ud af målingen)


def læs_fits(navn):
    # En simpel FITS-fil (32 bit kommatal, big-endian), 3600 x 1800. Første række er nord.
    with open(navn, 'rb') as f:
        raw = f.read()
    i = 0
    while True:
        blok = raw[i:i + 2880].decode('ascii', 'replace')
        i += 2880
        if any(blok[j:j + 80].startswith('END') for j in range(0, 2880, 80)):
            break
    return np.frombuffer(raw[i:i + 3600 * 1800 * 4], dtype='>f4').reshape(1800, 3600).astype(np.float64)


def højpas(r, n=61):
    # Træk et glidende gennemsnit (6°) fra, så båndenes lysstyrke ikke bestemmer korrelationen
    p = np.concatenate([r[-n:], r, r[:n]])
    return r - np.convolve(p, np.ones(n) / n, 'same')[n:-n]


def mål_række(a, b, r):
    # Forskydningen (pixel mod øst, med decimaler) og hvor godt de to omgange passer (0-1) for række r
    ra, rb = a[r - 1:r + 2], b[r - 1:r + 2]
    m = ((ra > 0) & (rb > 0)).all(0)
    if abs(r - PLET_RÆKKE) < 120:
        s = (np.arange(3600) - PLET_SØJLE + 1800) % 3600 - 1800
        m &= np.abs(s) > 160
    if m.mean() < 0.5:
        return np.nan, 0.0
    xa = np.array([højpas(x) for x in ra]) * m
    xb = np.array([højpas(x) for x in rb]) * m
    lags = np.arange(-VIND_MAKS, VIND_MAKS + 1)
    c = np.array([(xa * np.roll(xb, -L, 1)).sum() / max(1, (m & np.roll(m, -L)).sum()) for L in lags])
    c /= np.sqrt((xa ** 2).sum() / m.sum() * (xb ** 2).sum() / m.sum())
    i = int(np.argmax(c))
    dx = 0.0
    if 0 < i < len(c) - 1:
        y0, y1, y2 = c[i - 1:i + 2]
        dx = 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2)
    return lags[i] + dx, c[i]


def mål_vinde(mappe):
    phi = 90 - (np.arange(1800) + 0.5) / 10  # planetografisk bredde for hver række
    beta = np.arctan(B / A * np.tan(np.radians(phi)))
    km_pr_pixel = np.radians(0.1) * A * np.cos(beta)  # langs breddekredsen
    U = []
    for f in VIND_FILTRE:
        a = læs_fits(os.path.join(mappe, f'hlsp_opal_hst_wfc3-uvis_jupiter-2025a_{f}_v1_globalmap.fits'))
        b = læs_fits(os.path.join(mappe, f'hlsp_opal_hst_wfc3-uvis_jupiter-2025b_{f}_v1_globalmap.fits'))
        u = np.full(1800, np.nan)
        for r in range(50, 1720):
            lag, q = mål_række(a, b, r)
            if q > 0.35:
                u[r] = lag * km_pr_pixel[r] * 1000 / VIND_DT
        U.append(u)
        print(f, 'målt', flush=True)
    U = np.array(U)
    n = np.sum(~np.isnan(U), 0)
    with np.errstate(all="ignore"):
        med = np.nanmedian(np.where(n >= 3, U, np.nan), 0)
        spred = np.nanmax(U, 0) - np.nanmin(U, 0)
    med[(n < 3) | (spred > 15) | (np.abs(phi) > VIND_GYLDIG)] = np.nan
    ok = ~np.isnan(med)
    # Huller fyldes ved at trække en lige linje, så glattes det lidt (median over 5 rækker og et gaussisk filter, 0,15°)
    fyldt = np.interp(np.arange(1800), np.nonzero(ok)[0], med[ok])
    glat = np.array([np.median(fyldt[max(0, i - 2):i + 3]) for i in range(1800)])
    k = np.exp(-0.5 * (np.arange(-5, 6) / 1.5) ** 2)
    glat = np.convolve(np.pad(glat, 5, mode='edge'), k / k.sum(), 'valid')
    # Uden for det målte område: 0 (skyerne står stille ved polerne, J5 tegner polerne). De sidste 3° ind mod
    # grænsen (der, hvor målingen holder op mod nord og syd) tones vinden ned til 0, så der ikke kommer et spring (det
    # ville give en søm, hvor skyerne glider).
    første, sidste = np.nonzero(ok)[0][[0, -1]]
    kant = np.clip(np.minimum(np.arange(1800) - første, sidste - np.arange(1800)) / 30.0, 0, 1)
    glat *= kant * kant * (3 - 2 * kant)
    # Fra bredde -90 til 90 i trin på 0,25°
    bredder = np.arange(-90, 90.001, 0.25)
    profil = np.interp(bredder, phi[::-1], glat[::-1], left=0, right=0)
    return bredder, profil, (phi[sidste], phi[første])


def mål_plet(mappe):
    # Pletten i omgang 1 (det kort, kloden bruger): rød i forhold til blå (F631N / F395N) over en tærskel.
    # Midten og halvakserne fra momenterne (en ellipse med halvakse a har varians a²/4).
    r = læs_fits(os.path.join(mappe, 'hlsp_opal_hst_wfc3-uvis_jupiter-2025a_f631n_v1_globalmap.fits'))
    b = læs_fits(os.path.join(mappe, 'hlsp_opal_hst_wfc3-uvis_jupiter-2025a_f395n_v1_globalmap.fits'))
    s0 = PLET_SØJLE - 200
    R = np.roll(r, -s0, 1)[1000:1260, :400]
    Bl = np.roll(b, -s0, 1)[1000:1260, :400]
    forhold = R / np.maximum(Bl, 1)
    lav, høj = np.percentile(forhold, 50), np.percentile(forhold, 99.5)
    m = forhold > lav + 0.6 * (høj - lav)
    ys, xs = np.nonzero(m)
    cy, cx = ys.mean(), xs.mean()
    ay, ax = 2 * ys.std(), 2 * xs.std()
    længde = (s0 + cx + 0.5) / 10  # østlig længde (søjle / 10, se på_beta)
    bredde = 90 - (1000 + cy + 0.5) / 10
    return {'længde': round(float(længde), 2), 'bredde': round(float(bredde), 2), 'halvLængde': round(float(ax) / 10, 2), 'halvBredde': round(float(ay) / 10, 2)}


def skriv_vinde(mappe, ud):
    bredder, profil, (syd, nord) = mål_vinde(mappe)
    plet = mål_plet(mappe)
    for p in (24, 7, 0, -7, -20):
        print(f'{p:4d}°: {np.interp(p, bredder, profil):6.1f} m/s')
    print('pletten', plet)
    tal = ','.join(f'{v:.1f}'.rstrip('0').rstrip('.') if abs(v) >= 0.05 else '0' for v in profil)
    tekst = f"""// Jupiters vinde (J2 i docs/plan-jupiter.md), målt af os i Hubbles to omgange fra 11.-12. december 2025 (OPAL, NASA,
// ESA, A. Simon, M. H. Wong, CC BY 4.0) med billeder/solsystem/lav_jupiter.py (vinde). Lavet af værktøjet: ret ikke i hånden.
// Vinden mod øst (m/s, negativ = mod vest) i forhold til System III (Jupiters døgn målt efter magnetfeltet).
// VIND[i] er vinden ved den planetografiske bredde -90 + i * TRIN grader. Målt mellem ca. {-syd:.0f}° S og {nord:.0f}° N (de sidste
// 3° tones ned), uden for det er den sat til 0. Uden Three.js, så det kan testes i Node.

export const TRIN = 0.25;
export const VIND = [{tal}];

// Den Store Røde Plet i Hubbles kort (omgang 1): midten (østlig længde og planetografisk bredde) og halvakserne i grader.
// Målt, hvor den er tydeligt rød (rød i forhold til blå over en tærskel), så den røde kant når lidt længere ud.
export const PLET = {{ {', '.join(f'{k}: {v}' for k, v in plet.items())} }};

// Vinden (m/s mod øst) ved den planetografiske bredde (grader), lineært mellem målingerne
export function vindVed(bredde) {{
  const x = (Math.max(-90, Math.min(90, bredde)) + 90) / TRIN;
  const i = Math.min(VIND.length - 2, Math.floor(x));
  return VIND[i] + (VIND[i + 1] - VIND[i]) * (x - i);
}}
"""
    with open(os.path.join(ud, 'vinde-jupiter.js'), 'w') as f:
        f.write(tekst)


if __name__ == '__main__':
    ind, ud = sys.argv[1], sys.argv[2]
    os.makedirs(ud, exist_ok=True)
    if len(sys.argv) > 3 and sys.argv[3] == 'vinde':
        skriv_vinde(ind, ud)
    elif len(sys.argv) > 3 and sys.argv[3] == 'sammenlign':
        sammenlign(ind, ud)
    else:
        kort, _, _ = lav_kort(ind)
        gem(ud, kort)
