# Laver kortene over Uranus og Neptun (js/kosmos/uranus.js og neptun.js) ud fra Hubbles OPAL-kort (FITS).
# Hent originalerne til en mappe (navnene nedenfor), og kør:
#   python3 lav_isgiganter.py <mappe med originaler> <ud-mappe>              uranus-2k/1k.jpg og neptun-2k/1k.jpg
#   python3 lav_isgiganter.py <mappe med originaler> <ud-mappe> sammenlign   et ark med OPAL's farvebillede og vores kort
#
# Originalerne (Hubble OPAL, NASA, ESA, A. Simon (GSFC), OPAL, CC BY 4.0, doi:10.17909/T9G593):
#   https://archive.stsci.edu/missions/hlsp/opal/cycle33/uranus/   (23.-24. okt. 2025, cyklus 33)
#     hlsp_opal_hst_wfc3-uvis_uranus-2025a_{f467m,f547m,f657n}_v1_globalmap.fits
#     hlsp_opal_hst_wfc3-uvis_uranus-2025a_f657n-f547m-f467m_v1_globalmap.tif   (kun til arket "sammenlign")
#   https://archive.stsci.edu/missions/hlsp/opal/cycle22/uranus/   (8.-9. nov. 2014, cyklus 22: Uranus' sydlige halvdel)
#     hlsp_opal_hst_wfc3-uvis_uranus-2014a_{f467m,f547m,f658n}_v1_globalmap.fits
#   https://archive.stsci.edu/missions/hlsp/opal/cycle32/neptune/  (24.-25. aug. 2025, cyklus 32)
#     hlsp_opal_hst_wfc3-uvis_neptune-2025b_{f467m,f547m,f657n}_v1_globalmap.fits
#     hlsp_opal_hst_wfc3-uvis_neptune-2025b_f467m-f547m-f657n_v1_globalmap.tif  (kun til arket "sammenlign")
#   curl kræver en rodliste med "emSign Root CA - G1" (docs/erfaringer/netsider-og-arbejdsgang.md).
#
# Kortene er 721 x 361 (2 pixel pr. grad, planetografisk bredde, første række er 90° N). FITS-tallene ganges med
# README'ens faktorer og giver lysstyrken I/F (rettet for randformørkelse, Minnaert). Søjlerne (fælden i
# fakta-solsystemet/del6, afsnit 9): Uranus 2025 har 0° øst i højre kant (østlig længde vokser mod venstre), Uranus
# 2014 har 0° øst i venstre kant, og Neptun har 360° vest i venstre kant (vestlig længde falder mod højre, altså øst
# til højre). Den sidste søjle er den første igen og fjernes.
#
# Vores kort (u = østlig længde / 360, øst til højre, som Jupiter; rækkerne følger den parametriske bredde, så kortet
# passer på den fladtrykte kugle, scale.y):
# 1. Båndene: medianen af hver breddegrad i de tre filtre (blåt F467M, grønt F547M og rødt F657N).
#    - Uranus: 2025 fra nordpolen til 5° S (resten var i mørke). 2014 fra 5° S til 45° S, ganget med forholdet mellem
#      2025 og 2014 ved ækvator for hvert filter (2014 brugte F658N i stedet for F657N, og årstiden er en anden).
#      Syd for ca. 50° S er der ingen målinger siden Voyager 2 (1986): Her er båndene nordpolens bånd fra 2025 spejlet
#      (glidende fra 45° S til 62° S)
#      (Voyager så en lys sydpol, da den havde sommer). Det står i KILDER.md og skal stå i "Ærligt talt".
#    - Neptun: 2025 fra 50° N til sydpolen. Nord for ca. 55° N (i mørke og på skrå) er sydens bånd spejlet (glidende fra 48° N til 64° N).
# 2. Plettene: forholdet mellem hver pixel og båndets median (kappen, de lyse skyer og de mørke pletter), der hvor der
#    er målt, og glidende mod 1 mod kanten af målingerne. Sømmene mellem Hubbles delkort (striber langs en søjle) er
#    taget ud med medianen af hver søjle.
# 3. Farven: de tre lysstyrker (I/F) bruges direkte som lineært rødt, grønt og blåt lys (hvidt sollys giver hvidt) og
#    gemmes som sRGB. Én omregning til begge planeter, så forskellen mellem dem er ægte. Irwin m.fl. 2024 (MNRAS 527,
#    11521) fandt, at begge er lyst grønlig blå, og Neptun lidt mere blå: Arket "sammenlign" skriver forholdet blåt/rødt
#    ud for begge (Neptuns skal være størst).
#    Forenkling: Tre filtre er ikke øjets farvefølsomhed. En omregning med alle syv filtre gav en alt for mættet cyan,
#    fordi metanfiltrene (619 og 727 nm) er smalle og ligger i metanens huller.
import sys
import os
import numpy as np
from PIL import Image

OPAL = 'hlsp_opal_hst_wfc3-uvis_'
# I/F-faktorer fra README'erne (cyklus 33, 22 og 32)
FAKTOR = {
    'uranus-2025a': {'f467m': 0.00317, 'f547m': 0.00266, 'f657n': 0.00440},
    'uranus-2014a': {'f467m': 0.00325, 'f547m': 0.00260, 'f658n': 0.00127},
    'neptune-2025b': {'f467m': 0.00496, 'f547m': 0.00257, 'f657n': 0.00413},
}
# Ækvator og pol i km (NSSDC, samme som OPAL's ellipsoide)
FORM = {'uranus': (25559.0, 24973.0), 'neptune': (24764.0, 24341.0)}
UD = {'uranus': 'uranus', 'neptune': 'neptun'}
KANT_IND = 12  # pixel (6°): så langt ind fra kanten af målingen bruges plettene ikke
KANT_BLØD = 16  # så mange gange glattes kanten, så plettene toner ind (ca. 4°)


def læs_fits(navn):
    # En simpel FITS-fil (32 bit kommatal, big-endian), 721 x 361. Første række er nord.
    with open(navn, 'rb') as f:
        raw = f.read()
    i = 0
    hoved = {}
    while True:
        blok = raw[i:i + 2880].decode('ascii', 'replace')
        i += 2880
        for j in range(0, 2880, 80):
            kort = blok[j:j + 80]
            if '=' in kort[:10]:
                hoved[kort[:8].strip()] = kort[10:].split('/')[0].strip()
        if any(blok[j:j + 80].startswith('END') for j in range(0, 2880, 80)):
            break
    w, h = int(hoved['NAXIS1']), int(hoved['NAXIS2'])
    return np.frombuffer(raw[i:i + w * h * 4], dtype='>f4').reshape(h, w).astype(np.float64)


def læs_sæt(mappe, sæt, øst_til_højre):
    # De tre filtre som I/F (rød, grøn, blå), søjlerne vendt, så øst står til højre, og den sidste søjle fjernet
    lag = []
    for f, k in FAKTOR[sæt].items():
        a = læs_fits(os.path.join(mappe, f'{OPAL}{sæt}_{f}_v1_globalmap.fits')) * k
        a = a[:, :-1]
        if not øst_til_højre:
            a = a[:, ::-1]
        lag.append(a)
    return np.stack(lag[::-1], axis=2)  # filtrene står blå, grøn, rød: vend til rød, grøn, blå


def bånd(a):
    # Medianen af hver række (kun målte pixel) og hvor stor en del af rækken, der er målt
    gyldig = (a > 0).all(axis=2)
    med = np.full((a.shape[0], 3), np.nan)
    dæk = gyldig.mean(axis=1)
    for i in range(a.shape[0]):
        if dæk[i] > 0.9:
            med[i] = np.median(a[i][gyldig[i]], axis=0)
    return med, gyldig


def glat(x, n):
    # Glidende gennemsnit over n rækker (kanterne holdes)
    p = np.concatenate([np.repeat(x[:1], n, 0), x, np.repeat(x[-1:], n, 0)])
    k = np.ones(2 * n + 1) / (2 * n + 1)
    return np.stack([np.convolve(p[:, c], k, 'valid') for c in range(x.shape[1])], axis=1)


def spejl(b):
    # Båndene spejlet i ækvator (række i <-> 360 - i)
    return b[::-1]


def uranus(mappe):
    a25 = læs_sæt(mappe, 'uranus-2025a', øst_til_højre=False)
    a14 = læs_sæt(mappe, 'uranus-2014a', øst_til_højre=True)
    b25, g25 = bånd(a25)
    b14, _ = bånd(a14)
    phi = 90.0 - np.arange(361) / 2.0
    # 2014 stemmes af efter 2025 ved ækvator (5° S til 10° N) for hvert filter
    ved = (phi <= 10) & (phi >= -5)
    b14 = b14 * (np.nanmean(b25[ved], 0) / np.nanmean(b14[ved], 0))
    nord = (phi >= -5)
    # 2014 bruges ned til 45° S (længere mod syd er det randen, som er mørkere), og værdien der holdes videre mod syd
    b14[phi < -45] = b14[np.argmin(np.abs(phi + 45))]
    syd14 = (phi < -5) & (phi >= -45)
    ud = np.full_like(b25, np.nan)
    ud[nord] = b25[nord]
    ud[syd14] = b14[syd14]
    # Overgang 2025 -> 2014 over 2° ved 5° S (begge findes der)
    over = (phi < -3) & (phi >= -7)
    w = ((phi[over] + 7) / 4)[:, None]
    ud[over] = np.where(np.isnan(b25[over]), b14[over], b25[over] * w + b14[over] * (1 - w))
    # Syd for 45° S: nordpolens bånd spejlet, glidende fra 45° S til 62° S
    sp = spejl(b25)
    resten = phi < -45
    w = np.clip((-45 - phi[resten]) / 17, 0, 1)[:, None]
    w = w * w * (3 - 2 * w)
    ud[resten] = b14[resten] * (1 - w) + sp[resten] * w
    ud = glat(ud, 2)
    # Plettene: kun hvor 2025 er målt, og kun nord for ca. 2° N (længere mod syd er målingen ved randen og natsiden)
    vægt = np.clip((phi - 2) / 6, 0, 1)
    return ud, a25, g25, vægt


def neptun(mappe):
    a = læs_sæt(mappe, 'neptune-2025b', øst_til_højre=True)
    b, g = bånd(a)
    phi = 90.0 - np.arange(361) / 2.0
    # Målingen bruges op til 50° N (længere mod nord er den på skrå og ved randen), og værdien der holdes mod nord
    b[phi > 50] = b[np.argmin(np.abs(phi - 50))]
    ud = b.copy()
    sp = spejl(b)
    nord = phi > 48
    w = np.clip((phi[nord] - 48) / 16, 0, 1)[:, None]
    w = w * w * (3 - 2 * w)
    ud[nord] = b[nord] * (1 - w) + sp[nord] * w
    ud = glat(ud, 2)
    # Plettene kun syd for ca. 20° N: længere mod nord er randens striber og sømmene mellem delkortene stærkest
    vægt = np.clip((24 - phi) / 6, 0, 1)
    return ud, a, g, vægt


def pletter(a, gyldig, b, vægt):
    # Forholdet mellem hver pixel og båndet (1 = som båndet), glidende mod 1 mod kanten af målingen
    with np.errstate(invalid='ignore', divide='ignore'):
        f = np.where(gyldig[..., None], a / b[:, None, :], 1.0)
    f = np.nan_to_num(f, nan=1.0, posinf=1.0, neginf=1.0)
    f = np.clip(f, 0.4, 2.5)
    # Sømmene mellem Hubbles delkort (OPAL glatter dem ud, men en svag farvet stribe langs en søjle bliver tilbage,
    # fx Neptun ved u = 0,52 og 0,82 fra 45° N til 17° N): Medianen af hver søjle over alle de breddegrader, der bruges,
    # er søjlens skævhed. Den divideres ud. En rigtig plet fylder kun få grader og påvirker ikke medianen.
    brugt = (vægt > 0)[:, None] & gyldig
    skæv = np.ones((f.shape[1], 3))
    for j in range(f.shape[1]):
        r = brugt[:, j]
        if r.sum() > 20:
            skæv[j] = np.median(f[r, j], axis=0)
    skæv = (skæv + np.roll(skæv, 1, 0) + np.roll(skæv, -1, 0)) / 3
    f = f / skæv[None, :, :]
    # Kanten af målingen (kanten af natsiden og randen, hvor filtrene ikke dækker helt ens og giver farvede striber):
    # skåret 6° ind i alle retninger, og derfra toner det ind over yderligere 4°
    kant = gyldig.astype(np.float64)
    for _ in range(KANT_IND):
        for akse in (0, 1):
            kant = np.minimum(kant, np.roll(kant, 1, akse))
            kant = np.minimum(kant, np.roll(kant, -1, akse))
    blød = kant.copy()
    for _ in range(KANT_BLØD):
        blød = (blød + np.roll(blød, 1, 0) + np.roll(blød, -1, 0) + np.roll(blød, 1, 1) + np.roll(blød, -1, 1)) / 5
        blød = np.minimum(blød, kant)
    v = (vægt[:, None] * blød)[..., None]
    return 1 + (f - 1) * v


def opslag(kort, rækker, søjler):
    # Bilineært opslag (rækker og søjler som kommatal), søjlerne går hele vejen rundt
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


def på_beta(kort, planet, bredde):
    # Et OPAL-kort (361 rækker i planetografisk bredde, 720 søjler med øst til højre) lagt om til parametrisk bredde
    A, B = FORM[planet]
    højde = bredde // 2
    beta = 90.0 - (np.arange(højde) + 0.5) * 180.0 / højde
    graf = np.degrees(np.arctan(A / B * np.tan(np.radians(beta))))
    r = (90.0 - graf) * 2.0
    # OPAL: søjle j har midten ved østlig længde (j + 0,5) / 2 (Neptun: vestlig 360 - j/2 i venstre kant af pixlen)
    s = (np.arange(bredde) + 0.5) / bredde * 720.0 - 0.5
    R, S = np.meshgrid(r, s, indexing='ij')
    return opslag(kort, R, S)


def srgb(a):
    a = np.clip(a, 0, 1)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * a ** (1 / 2.4) - 0.055) * 255.0


def lav(mappe, planet):
    b, a, g, vægt = uranus(mappe) if planet == 'uranus' else neptun(mappe)
    f = pletter(a, g, b, vægt)
    kort = b[:, None, :] * f  # lineært lys (I/F)
    return kort, b


def gem(kort, planet, ud):
    for navn, bredde in [('2k', 2048), ('1k', 1024)]:
        k = på_beta(kort, planet, bredde)
        Image.fromarray(np.round(srgb(k)).astype(np.uint8)).save(os.path.join(ud, f'{UD[planet]}-{navn}.jpg'), quality=92)


def sammenlign(mappe, ud):
    from PIL import ImageDraw
    ark = Image.new('RGB', (1440 + 30, 2 * 2 * 361 + 60), (20, 20, 24))
    d = ImageDraw.Draw(ark)
    y = 10
    for planet, tif in [('uranus', 'uranus-2025a_f657n-f547m-f467m'), ('neptune', 'neptune-2025b_f467m-f547m-f657n')]:
        kort, b = lav(mappe, planet)
        k = Image.fromarray(np.round(srgb(på_beta(kort, planet, 1440))).astype(np.uint8)).resize((720, 361))
        o = Image.open(os.path.join(mappe, f'{OPAL}{tif}_v1_globalmap.tif')).convert('RGB')
        if planet == 'uranus':
            o = o.transpose(Image.FLIP_LEFT_RIGHT)
        ark.paste(o.resize((720, 361)), (10, y))
        ark.paste(k, (740, y))
        d.text((14, y + 4), f'{planet}: OPAL (forstærket)', fill=(255, 255, 255))
        d.text((744, y + 4), 'vores kort (I/F, sRGB)', fill=(255, 255, 255))
        ækv = np.nanmean(b[170:191], 0)
        print(f'{planet}: I/F ved ækvator (r, g, b) = {np.round(ækv, 3)}, sRGB = {np.round(srgb(ækv)).astype(int)}, blå/rød = {ækv[2] / ækv[0]:.2f}')
        y += 361 + 20
    ark.save(os.path.join(ud, 'isgiganter-sammenlign.png'))


if __name__ == '__main__':
    mappe, ud = sys.argv[1], sys.argv[2]
    if len(sys.argv) > 3 and sys.argv[3] == 'sammenlign':
        sammenlign(mappe, ud)
    else:
        for p in ['uranus', 'neptune']:
            kort, _ = lav(mappe, p)
            gem(kort, p, ud)
