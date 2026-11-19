# Laver js/data/exoplaneter.js (Gåderne G4d, "Er der liv andre steder?") ud fra Wikipedias lister over exoplaneter.
# Hent først siderne som rå wikitekst i en mappe (19. november 2026 kunne NASA Exoplanet Archive ikke nås fra miljøet):
#   curl -s "https://en.wikipedia.org/w/index.php?title=List_of_exoplanets_discovered_before_2000&action=raw" -o y1990s.txt
#   curl -s "https://en.wikipedia.org/w/index.php?title=List_of_exoplanets_discovered_between_2000%E2%80%932009&action=raw" -o y2000s.txt
#   for y in $(seq 2010 2026); do curl -s "https://en.wikipedia.org/w/index.php?title=List_of_exoplanets_discovered_in_$y&action=raw" -o y$y.txt; done
# Kør så: python3 -I tests/vaerktoejer/lav_exoplaneter.py <mappen> js/data/exoplaneter.js <NASA's antal> '<dato>'
# NASA's antal står i Wikipedias skabelon "Extrasolar planet counts/numbers/NEA". De planeter, listerne mangler, lægges
# til årene efter deres andel med afstanden 0 (ukendt).
import collections, os, re, sys

mappe, ud, TOTAL, DATO = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
filer = ['y1990s.txt', 'y2000s.txt'] + [f'y{y}.txt' for y in range(2010, 2027)]

def ren(c):
    c = re.sub(r'<ref[^>]*/>', '', c)
    c = re.sub(r'<ref.*?</ref>', '', c, flags=re.S)
    c = re.sub(r'<ref.*', '', c, flags=re.S)
    c = re.sub(r'^\s*style="[^"]*"\s*\|', '', c)
    return c.strip()

def tal(c):
    m = re.search(r'-?\d+(?:\.\d+)?', c.replace(',', ''))
    return float(m.group(0)) if m else None

pr = collections.defaultdict(list)
for f in filer:
    t = open(os.path.join(mappe, f), encoding='utf8').read()
    start = t.find('{|')
    tab = t[start:t.find('\n|}', start)]  # kun den første tabel (listen), ikke "Former candidates"
    for s in re.split(r'\n\|-[^\n]*', tab)[1:]:
        celler = []
        for linje in s.split('\n'):
            if not linje.startswith('|') or linje.startswith('|}') or linje.startswith('|+'):
                if celler and not linje.startswith('!'):
                    celler[-1] += ' ' + linje
                continue
            celler += linje[1:].split('||')
        celler = [ren(c) for c in celler]
        m = re.match(r'y(\d{4})\.txt', f)
        if m:  # listerne for ét år har ingen kolonne med året: navn, masse, radius, periode, afstand til stjernen, temp., metode, afstand (ly)
            if len(celler) < 9:
                continue
            år, afst = int(m.group(1)), tal(celler[7])
        else:  # de ældre lister har året i kolonne 8 og afstanden i kolonne 9
            if len(celler) < 10:
                continue
            år, afst = tal(celler[7]), tal(celler[8])
        if år is None or not 1988 <= år <= 2026:
            continue
        pr[int(år)].append(0 if afst is None or afst <= 0 else max(1, round(afst)))

år = sorted(pr)
n = sum(len(pr[a]) for a in år)
mangler = TOTAL - n
andele = [(len(pr[a]) * mangler / n, a) for a in år]
hel = {a: int(x) for x, a in andele}
for x, a in sorted(andele, key=lambda t: -(t[0] - int(t[0])))[:mangler - sum(hel.values())]:
    hel[a] += 1
uden = sum(1 for a in år for d in pr[a] if d == 0)
linjer = '\n'.join(f"  [{a}, '{','.join(str(x) for x in sorted(pr[a]) + [0] * hel[a])}']," for a in år)
open(ud, 'w').write(f"""// De kendte planeter om andre stjerner (exoplaneter), til gåden "Er der liv andre steder?" (G4d, js/gaader/liv.js).
// Uden Three.js, så det kan testes i Node. Lavet med tests/vaerktoejer/lav_exoplaneter.py.
// Kilde: Wikipedias lister "List of exoplanets discovered before 2000", "… between 2000–2009" og "… in 2010" til
// "… in 2026" (hentet 19. november 2026): fundåret og afstanden i lysår for {n} planeter. NASA Exoplanet Archive har
// {TOTAL} bekræftede ({DATO}, via Wikipedias skabelon "Extrasolar planet counts"), så de {mangler}, listerne mangler,
// er lagt til årene efter deres andel (afstanden 0 = ukendt, tegnes som en afstand fra samme år). {uden} planeter i
// listerne har ingen afstand og står også som 0. Retningen på himlen findes ikke i listerne (NASA's arkiv kunne ikke nås).
// PLANETER_PR_ÅR: [år, 'afstand i lysår, afstand, …'] (heltal, sorteret).
export const EXOPLANETER_I_ALT = {TOTAL};
export const EXOPLANETER_DATO = '{DATO}';
export const PLANETER_PR_ÅR = [
{linjer}
];
// Afstandene for ét år som tal
export const afstandeFor = (række) => række[1].split(',').map(Number);
""")
print(n, 'fra listerne,', mangler, 'lagt til,', uden, 'uden afstand')
