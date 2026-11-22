"""Skrifterne til Opdagelserne (docs/plan-videnskabsfolk.md, afsnit 4). Laver en lille woff2 med kun de tegn, bøgerne
bruger, af en OFL-skrift fra Google Fonts' arkiv på GitHub (raw.githubusercontent.com/google/fonts).

Skriften har et "Reserved Font Name" (fx IM FELL English Roman). Efter OFL er en fil med færre tegn en ændret udgave,
og den må ikke bære det navn. Derfor får filen et nyt navn indeni (AtomLab Fell), og licensen (OFL.txt) ligger ved siden af.
Old Standard TT har intet Reserved Font Name, men får også et nyt navn (AtomLab Old Standard), så den ikke blandes sammen
med en Old Standard TT, der er installeret på maskinen.

En kilde, der ikke ligger i mappen, springes over (så de andre filer ikke laves om, når en ny skrift kommer til).

Kræver fonttools og brotli (pip install fonttools brotli). Kør:
    python lav_skrift.py <mappe med TTF-filen>
"""
import os
import sys
from fontTools.ttLib import TTFont
from fontTools import subset

HER = os.path.dirname(os.path.abspath(__file__))
TEGN = ''.join(chr(c) for c in range(0x20, 0x7F)) + 'æøåÆØÅéèêëüöäÉÜÖÄ«»‹›·–—…‘’“”„°½¼¾×ſ§¶†'
# Til ligningerne i Einsteins bog (E3-E4): rod, potenser, minus, gange og pile (Old Standard TT har ikke græske bogstaver,
# så τ og κ står med reserveskriften)
MATEMATIK = '√²³⁰¹⁴⁵⁶⁷⁸⁹⁻⁺−±≈≠≤≥→∞π′″∂∫ß'
SKRIFTER = [
    # (TTF i Google Fonts' arkiv, ny fil, nyt familienavn, stil, ekstra tegn)
    # ofl/imfellenglish/ (1600-tallets bøger: Huygens og Tycho)
    ('IMFeENrm28P.ttf', 'atomlab-fell.woff2', 'AtomLab Fell', 'Regular', ''),
    # ofl/oldstandardtt/ (1900-tallets bøger: Einstein, Bohr og Lehmann). Kursiv til bogstaverne i tegningerne og ligningerne
    ('OldStandard-Regular.ttf', 'atomlab-oldstandard.woff2', 'AtomLab Old Standard', 'Regular', MATEMATIK),
    ('OldStandard-Italic.ttf', 'atomlab-oldstandard-kursiv.woff2', 'AtomLab Old Standard', 'Italic', MATEMATIK),
]


def lav(mappe):
    for kilde, ud, familie, stil, ekstra in SKRIFTER:
        if not os.path.exists(os.path.join(mappe, kilde)):
            print('springer over', kilde)
            continue
        f = TTFont(os.path.join(mappe, kilde))
        opt = subset.Options()
        opt.flavor = 'woff2'
        opt.layout_features = ['kern', 'liga', 'dlig', 'onum', 'lnum']
        opt.name_IDs = ['*']
        opt.notdef_outline = True
        s = subset.Subsetter(opt)
        s.populate(text=TEGN + ekstra)
        s.subset(f)
        kompakt = familie.replace(' ', '')
        for r in f['name'].names:
            nye = {1: familie, 16: familie, 2: stil, 17: stil, 4: f'{familie} {stil}', 6: f'{kompakt}-{stil}', 3: f'{kompakt}-{stil}-2026'}
            if r.nameID in nye:
                r.string = nye[r.nameID]
            elif r.nameID == 5:
                r.string = r.toUnicode() + '; AtomLab subset (renamed, OFL 1.1)'
        f.flavor = 'woff2'
        f.save(os.path.join(HER, ud))
        print(ud, os.path.getsize(os.path.join(HER, ud)), 'byte')


if __name__ == '__main__':
    lav(sys.argv[1] if len(sys.argv) > 1 else HER)
