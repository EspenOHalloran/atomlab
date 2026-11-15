"""Portrætterne til Videnskabsfolkene i Biblioteket (docs/plan-videnskabsfolk.md, "Portrætterne").

Et rigtigt portræt fra personens egen tid (maleri, kobberstik eller gammelt foto) laves om til et ens
"kobberstik": linjer, der bliver tykkere, hvor billedet er mørkt, en ekstra krydsskravering i skyggerne, korte
streger langs kanterne (øjne, næse og mund) og en oval ramme på papirfarve. Alle personer får samme filter,
så de ligner ét sæt, selv om kilderne er meget forskellige.

Kun PIL og numpy. Kildebillederne lægges ikke i repoet (docs/retning.md). Kør:
    python lav_portraet.py <person> [mappe med kildebilledet] [ud-mappe]
Uden mappe hentes kilden fra upload.wikimedia.org (en ærlig User-Agent og en thumbnail i en standardbredde,
ellers svarer Wikimedia 429). Uden ud-mappe skrives <person>.webp ved siden af denne fil.

Licensen for hver kilde står i PERSONER og skal også stå i KILDER.md, før billedet kommer med i programmet.
"""
import os
import sys
import urllib.request
import numpy as np
from PIL import Image, ImageFilter

HER = os.path.dirname(os.path.abspath(__file__))
UA = 'AtomLab-billedvaerktoej/1.0 (educational, non-commercial)'
B, H = 600, 750          # det færdige billede (4:5), vises ca. 300 CSS-px bredt med dpr 2
SKALA = 2                # der tegnes i dobbelt størrelse og gøres mindre bagefter (bløde kanter på linjerne)
PAPIR = np.array([241, 232, 211], float)
BLÆK = np.array([40, 30, 24], float)

PERSONER = {
    'huygens': {
        # Caspar Netscher, 1671 (Museum Boerhaave, lån fra Haags Historisch Museum). Commons: PD-Art,
        # PD-old-auto-expired (Netscher døde 1684). Et foto af et maleri, hvis beskyttelse er udløbet, har ingen
        # egen ret i Danmark (ophavsretsloven § 70 stk. 4).
        'fil': 'huygens.jpg',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/'
               'Caspar_Netscher_-_Christiaan_Huygens%2C_the_astronomer%2C_1671.jpg/'
               '960px-Caspar_Netscher_-_Christiaan_Huygens%2C_the_astronomer%2C_1671.jpg',
        'udsnit': (195, 50, 835, 850),   # venstre, top, højre, bund i kilden (960 x 1258), 4:5
        'gamma': 0.55,                   # < 1 gør lyst (malerier fra 1600-tallet er mørke)
        'baggrund': 0.45,                # hvor meget den store tone trykkes sammen og løftes (0 = intet)
        'detalje': 1.9,                  # hvor meget detaljerne forstærkes
    },
}


def hent(mappe, p):
    sti = os.path.join(mappe, p['fil'])
    if not os.path.exists(sti):
        req = urllib.request.Request(p['url'], headers={'User-Agent': UA})
        with urllib.request.urlopen(req) as svar, open(sti, 'wb') as f:
            f.write(svar.read())
    return Image.open(sti).convert('RGB')


def lysstyrke(billede, p):
    """Gråtone 0-1 (0 = sort), strakt ud mellem 1 % og 99 %, gjort lysere med gamma."""
    a = np.asarray(billede, float) / 255
    l = 0.30 * a[..., 0] + 0.59 * a[..., 1] + 0.11 * a[..., 2]
    lav, høj = np.percentile(l, [1, 99])
    l = np.clip((l - lav) / (høj - lav), 0, 1) ** p['gamma']
    # Lokal kontrast: Den store, bløde tone trykkes sammen mod lys (baggrund), og detaljerne (krøller, folder og
    # ansigtet) forstærkes. Ellers bliver et mørkt maleri bare en mørk flade af linjer
    stor = slør(l, 30)
    l = 0.5 + (stor - 0.5) * (1 - p['baggrund']) + p['baggrund'] * 0.25 + (l - stor) * p['detalje']
    return np.clip(l, 0, 1)


def slør(a, r):
    # PIL slører kun 8-bit billeder. Tonen i tre kanaler (høj, mellem og lav byte) ville være for meget: 8 bit er nok
    im = Image.fromarray(np.clip(a * 255 + 0.5, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))
    return np.asarray(im, float) / 255


def linjer(l, vinkel, periode, bredde, bøj):
    """Parallelle linjer med vinklen (grader). bredde (0-1) er linjens tykkelse i hver pixel. bøj forskyder
    linjerne efter tonen, så de buer langs formerne som i et rigtigt stik."""
    h, b = l.shape
    y, x = np.mgrid[0:h, 0:b].astype(float)
    v = np.radians(vinkel)
    t = (x * np.cos(v) + y * np.sin(v)) / periode + bøj
    afstand = np.abs((t % 1) - 0.5) * 2          # 0 midt på linjen, 1 midt mellem to linjer
    halv = 1 / periode                           # en halv pixel i linjens enhed (bløde kanter)
    return np.clip((bredde - afstand) / (2 * halv) + 0.5, 0, 1)


def kanter(l):
    """Korte, mørke streger, hvor tonen skifter hurtigt (øjne, næse, mund og kanten af håret)."""
    g = slør(l, 1.2)
    gy, gx = np.gradient(g)
    m = np.hypot(gx, gy)
    m = m / (np.percentile(m, 99.5) + 1e-9)
    return np.clip((m - 0.35) * 1.6, 0, 1)


def stik(l):
    blød = slør(l, 2.0)
    bøj = slør(l, 18) * 2.2
    m1 = linjer(blød, 18, 7.0, np.clip((1 - blød) * 0.95, 0.04, 0.92), bøj)
    m2 = linjer(blød, -48, 7.5, np.clip((0.55 - blød) * 1.8, 0, 0.8), bøj * 0.6)
    m3 = linjer(blød, 75, 8.0, np.clip((0.25 - blød) * 2.5, 0, 0.6), 0)
    blæk = np.maximum.reduce([m1, m2, m3, kanter(l) * 0.85])
    return blæk


def oval(h, b):
    """Maske for ovalen (1 indeni) og de to tynde linjer i rammen."""
    y, x = np.mgrid[0:h, 0:b].astype(float)
    cx, cy, rx, ry = b / 2, h * 0.49, b * 0.45, h * 0.46
    r = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
    px = 1 / min(rx, ry)
    inde = np.clip((1 - r) / px + 0.5, 0, 1)
    ring = lambda r0, tyk: np.clip((tyk - np.abs(r - r0)) / px, 0, 1)
    return inde, np.maximum(ring(1.0 + 3 * px, 1.6 * px), ring(1.0 + 10 * px, 0.8 * px))


def lav(person, mappe, ud):
    p = PERSONER[person]
    kilde = hent(mappe, p).crop(p['udsnit']).resize((B * SKALA, H * SKALA), Image.LANCZOS)
    l = lysstyrke(kilde, p)
    blæk = stik(l)
    inde, ramme = oval(H * SKALA, B * SKALA)
    blæk = np.maximum(blæk * inde, ramme)
    rng = np.random.default_rng(1)
    papir = PAPIR + rng.normal(0, 2.5, l.shape)[..., None]   # en svag struktur i papiret
    rgb = papir * (1 - blæk[..., None]) + BLÆK * blæk[..., None]
    im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).resize((B, H), Image.LANCZOS)
    os.makedirs(ud, exist_ok=True)
    sti = os.path.join(ud, f'{person}.webp')
    im.save(sti, quality=88, method=6)
    print(sti, os.path.getsize(sti), 'byte')


if __name__ == '__main__':
    person = sys.argv[1] if len(sys.argv) > 1 else 'huygens'
    mappe = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HER, 'kilder')
    ud = sys.argv[3] if len(sys.argv) > 3 else HER
    os.makedirs(mappe, exist_ok=True)
    lav(person, mappe, ud)
