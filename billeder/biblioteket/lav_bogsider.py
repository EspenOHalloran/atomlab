"""Siderne fra bøgerne til Videnskabsfolkene i Biblioteket (docs/plan-videnskabsfolk.md, afsnit 6, og drejebogens
afsnit "Bogen selv"). Højst fire sider pr. bog.

Siderne hentes fra en frigivet skanning på archive.org (licensen står i SIDER og i KILDER.md) og gøres mindre:
1000 px brede og WebP med den kvalitet, der lige holder filen under MAKS (ca. 150-200 KB). Siden klippes ikke, så de
glødende steder i js/data/opdagelser/<bog>.js (i % af siden) passer til billedet. Laves en side om med et andet
udsnit, skal stederne måles igen.

Kun PIL. Kildebillederne lægges ikke i repoet (mappen kilder/ er i .gitignore). Kør:
    python lav_bogsider.py <bog> [mappe med kilderne] [ud-mappe]
Uden mappe hentes siderne fra archive.org (w1200 er den største størrelse, archive.org giver uden at pakke hele
bogen ud). Uden ud-mappe skrives <bog>-<side>.webp ved siden af denne fil.
"""
import io
import os
import sys
import urllib.request
from PIL import Image

HER = os.path.dirname(os.path.abspath(__file__))
UA = 'AtomLab-billedvaerktoej/1.0 (educational, non-commercial)'
BREDDE = 1000        # px. Vises ca. 330-500 CSS-px bredt, så skriften kan læses med dpr 2
MAKS = 195 * 1024    # byte pr. side (budgettet er ca. 150-200 KB, planen afsnit 6)

BØGER = {
    'huygens': {
        # Systema Saturnium (Haag 1659), Smithsonian Libraries' eksemplar. archive.org-metadata: "Public domain. The
        # Library considers that this work is no longer under copyright protection." Sidens nummer i skanningen (n)
        # er ikke sidetallet: s. 16 er n33, s. 47-48 er n66-n67, og tavlen "Pag. 35" er n51.
        'arkiv': 'CristianiHugeni00HuygA',
        'sider': {'tavle': 51, 's16': 33, 's47': 66, 's48': 67},
    },
}


def hent(mappe, bog, n):
    sti = os.path.join(mappe, f"{bog['arkiv']}-n{n}.jpg")
    if not os.path.exists(sti):
        url = f"https://archive.org/download/{bog['arkiv']}/page/n{n}_w1200.jpg"
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req) as svar, open(sti, 'wb') as f:
            f.write(svar.read())
    return Image.open(sti).convert('RGB')


def webp(billede):
    """Den højeste kvalitet (i trin af 5), der holder filen under MAKS."""
    for q in range(85, 30, -5):
        b = io.BytesIO()
        billede.save(b, 'WEBP', quality=q, method=6)
        if b.tell() <= MAKS:
            return b.getvalue(), q
    raise SystemExit('Siden bliver for stor selv med kvalitet 35')


def lav(navn, mappe, ud):
    bog = BØGER[navn]
    os.makedirs(mappe, exist_ok=True)
    for side, n in bog['sider'].items():
        kilde = hent(mappe, bog, n)
        h = round(kilde.height * BREDDE / kilde.width)
        data, q = webp(kilde.resize((BREDDE, h), Image.LANCZOS))
        sti = os.path.join(ud, f'{navn}-{side}.webp')
        with open(sti, 'wb') as f:
            f.write(data)
        print(f'{sti}: {BREDDE} x {h}, kvalitet {q}, {len(data) // 1024} KB')


if __name__ == '__main__':
    navn = sys.argv[1] if len(sys.argv) > 1 else 'huygens'
    mappe = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HER, 'kilder')
    ud = sys.argv[3] if len(sys.argv) > 3 else HER
    lav(navn, mappe, ud)
