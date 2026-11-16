"""Skrifterne til Opdagelserne (docs/plan-videnskabsfolk.md, afsnit 4). Laver en lille woff2 med kun de tegn, bøgerne
bruger, af en OFL-skrift fra Google Fonts' arkiv på GitHub (raw.githubusercontent.com/google/fonts).

Skriften har et "Reserved Font Name" (fx IM FELL English Roman). Efter OFL er en fil med færre tegn en ændret udgave,
og den må ikke bære det navn. Derfor får filen et nyt navn indeni (AtomLab Fell), og licensen (OFL.txt) ligger ved siden af.

Kræver fonttools og brotli (pip install fonttools brotli). Kør:
    python lav_skrift.py <mappe med TTF-filen>
"""
import os
import sys
from fontTools.ttLib import TTFont
from fontTools import subset

HER = os.path.dirname(os.path.abspath(__file__))
TEGN = ''.join(chr(c) for c in range(0x20, 0x7F)) + 'æøåÆØÅéèêëüöäÉÜÖÄ«»‹›·–—…‘’“”„°½¼¾×ſ§¶†'
SKRIFTER = [
    # (TTF i Google Fonts' arkiv: ofl/imfellenglish/, ny fil, nyt familienavn, stil)
    ('IMFeENrm28P.ttf', 'atomlab-fell.woff2', 'AtomLab Fell', 'Regular'),
]


def lav(mappe):
    for kilde, ud, familie, stil in SKRIFTER:
        f = TTFont(os.path.join(mappe, kilde))
        opt = subset.Options()
        opt.flavor = 'woff2'
        opt.layout_features = ['kern', 'liga', 'dlig', 'onum', 'lnum']
        opt.name_IDs = ['*']
        opt.notdef_outline = True
        s = subset.Subsetter(opt)
        s.populate(text=TEGN)
        s.subset(f)
        kompakt = familie.replace(' ', '')
        for r in f['name'].names:
            nye = {1: familie, 16: familie, 2: stil, 17: stil, 4: f'{familie} {stil}', 6: f'{kompakt}-{stil}', 3: f'{kompakt}-{stil}-2026'}
            if r.nameID in nye:
                r.string = nye[r.nameID]
            elif r.nameID == 5:
                r.string = r.toUnicode() + '; AtomLab subset (renamed, OFL Reserved Font Name)'
        f.flavor = 'woff2'
        f.save(os.path.join(HER, ud))
        print(ud, os.path.getsize(os.path.join(HER, ud)), 'byte')


if __name__ == '__main__':
    lav(sys.argv[1] if len(sys.argv) > 1 else HER)
