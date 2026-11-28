"""Siderne fra bøgerne til Videnskabsfolkene i Biblioteket (docs/plan-videnskabsfolk.md, afsnit 6, og drejebogens
afsnit "Bogen selv"). Højst fire sider pr. bog.

Siderne hentes fra en frigivet skanning på archive.org (licensen står i SIDER og i KILDER.md) og gøres mindre:
1000 px brede og WebP med den kvalitet, der lige holder filen under MAKS (ca. 150-200 KB). Siden klippes ikke (kun
Einsteins mikrofilm klippes til papiret, se 'udsnit'), så de
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
    'tycho': {
        # De nova stella (København 1573) i Videnskabernes Selskabs faksimile fra 1901 ("Fototypi. Pacht & Crone"),
        # Toronto-eksemplaret (skannet 2009). archive.org-metadata: "NOT_IN_COPYRIGHT" uden en licens (se KILDER.md og
        # docs/drejebog-tycho.md, spørgsmål 4: jeres svar 19. november 2026 er at bruge den). Siden A er n36, kortet
        # B1b n45, brevet til Pratensis med "O crassa ingenia" n32 og farven D2 n62.
        'arkiv': 'operumprimitiasd00brahuoft',
        'sider': {'a': 36, 'b1b': 45, 'brevet': 32, 'd2': 62},
    },
    'einstein': {
        # Annalen der Physik 1905 i "Serials in Microfilm" (sim_...). Teksten er fri fra 2026 (Einstein døde 1955), men
        # mikrofilmen har ingen licens og ingen dato (docs/fakta-einstein-bog.md, afsnit 6, jeres svar 1: bruges med
        # "Ærligt talt" og kontakten til sat tekst). De to sider ligger i hver sit bind, så hver side har sit 'arkiv'.
        # Mikrofilmen har sorte kanter og nabosidens kant med, så siden klippes til papiret ('udsnit' i kildens px,
        # w1200 giver her ca. 2080 px). Stederne i js/data/opdagelser/einstein.js er målt på det klippede billede.
        'sider': {
            's904': {'arkiv': 'sim_annalen-der-physik_1905_17_5', 'n': 127, 'udsnit': (440, 110, 1988, 2720)},
            's641': {'arkiv': 'sim_annalen-der-physik_1905_18_3', 'n': 234, 'udsnit': (45, 135, 1910, 2980)},
            # Sitzungsberichte 1915, s. 845 (E4, 22. november 2026): Googles skanning af Minnesotas eksemplar (reserven i
            # docs/drejebog-einstein.md afsnit 11, jeres go 22. november 2026). w1200 giver her 1240 px. Udsnittet tager
            # den tomme margen væk, men beholder linjen "Digitized by Google / Original from University of Minnesota"
            # nederst, så skanningen bærer sin kilde (Google beder om, at den bliver stående)
            's845': {'arkiv': 'SitzungsberichtePreussAkad19152', 'n': 372, 'udsnit': (130, 140, 1090, 1767)},
        },
    },
    'roemer': {
        # Philosophical Transactions bd. 12, nr. 136 (1677), s. 893-894 og tavlen: Royal Society og JSTOR's skanning
        # ("Early Journal Content") på archive.org med Public Domain Mark (docs/drejebog-roemer.md afsnit 11, jeres svar 4
        # 21. november 2026). n0 er s. 893 (JSTOR's bjælke nederst skæres fra), n1 s. 894, og n2 er tavlen, hvor Fig. 11
        # står i øverste venstre hjørne. Fig. 11 hentes i fuld størrelse ('stor', 3969 px), for udsnittet er lille, og den
        # bliver 870 px bred. Rømers egen liste "Obser. primi Jovialium Parisiis" er fra Commons (Kirstine Meyers gengivelse
        # 1915, PD-old-100): billedet er side 4 (venstre) og side 1 (højre), så kun højre halvdel bruges
        'arkiv': 'paper-doi-10_1098_rstl_1677_0024',
        'sider': {
            's893': {'n': 0, 'udsnit': (170, 100, 1730, 2600)},
            'fig11': {'n': 2, 'stor': True, 'udsnit': (180, 80, 1050, 1660), 'bredde': 870},
            's894': {'n': 1, 'udsnit': (170, 30, 1730, 2560)},
            'liste': {'url': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/'
                             'Ole_R%C3%B8mer_-_Obser._Primi_Jovialium_Parisiis_-_pp1%2B4.jpg/'
                             '3840px-Ole_R%C3%B8mer_-_Obser._Primi_Jovialium_Parisiis_-_pp1%2B4.jpg',
                      'fil': 'roemer-liste-3840.jpg', 'udsnit': (1920, 0, 3840, 2826)},
        },
    },
}


def hent(mappe, arkiv, n, stor=False, url=None, fil=None):
    """En side fra archive.org (w1200, eller fuld størrelse med stor) eller et billede fra en adresse (url)."""
    sti = os.path.join(mappe, fil or f"{arkiv}-n{n}{'-stor' if stor else ''}.jpg")
    if not os.path.exists(sti):
        url = url or f"https://archive.org/download/{arkiv}/page/n{n}{'' if stor else '_w1200'}.jpg"
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
        # En side er enten nummeret i bogens arkiv eller {'arkiv', 'n', 'udsnit'} (Einstein: to bind og et udsnit).
        # Rømer: en side kan også have 'stor' (fuld størrelse), 'url' og 'fil' (et billede fra Commons) og 'bredde'.
        s = {'arkiv': bog.get('arkiv'), **n} if isinstance(n, dict) else {'arkiv': bog['arkiv'], 'n': n}
        kilde = hent(mappe, s['arkiv'], s.get('n'), s.get('stor', False), s.get('url'), s.get('fil'))
        if s.get('udsnit'):
            kilde = kilde.crop(s['udsnit'])
        b = s.get('bredde', BREDDE)
        h = round(kilde.height * b / kilde.width)
        data, q = webp(kilde.resize((b, h), Image.LANCZOS))
        sti = os.path.join(ud, f'{navn}-{side}.webp')
        with open(sti, 'wb') as f:
            f.write(data)
        print(f'{sti}: {b} x {h}, kvalitet {q}, {len(data) // 1024} KB')


if __name__ == '__main__':
    navn = sys.argv[1] if len(sys.argv) > 1 else 'huygens'
    mappe = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HER, 'kilder')
    ud = sys.argv[3] if len(sys.argv) > 3 else HER
    lav(navn, mappe, ud)
