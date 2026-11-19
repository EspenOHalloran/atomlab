# Laver js/data/exoplaneter.js (Gåderne G4d, "Er der liv andre steder?") ud fra NASA Exoplanet Archive.
# Hent først tabellen pscomppars (én række pr. bekræftet planet) som CSV i en tom mappe:
#   curl -s "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,ra,dec,sy_dist,disc_year+from+pscomppars&format=csv" -o pscomppars.csv
# Kør så: python3 -I tests/vaerktoejer/lav_exoplaneter.py <mappen>/pscomppars.csv js/data/exoplaneter.js '<dato>'
# Retningen (ra og dec) rundes til hele grader og afstanden (sy_dist i parsec) til lysår med to betydende cifre, så filen
# bliver ca. 60 KB. Planeter om samme stjerne fundet samme år står én gang med antallet bagefter. (Før 19. november 2026
# kom tallene fra Wikipedias lister, fordi arkivet ikke kunne nås. Den udgave står i git-historikken.)
import collections, csv, math, sys

kilde, ud, DATO = sys.argv[1], sys.argv[2], sys.argv[3]
rækker = list(csv.DictReader(open(kilde, encoding='utf8')))

def lysår(pc):
    if not pc:
        return 0  # ukendt
    x = float(pc) * 3.26156
    if x < 100:
        return max(1, round(x))
    p = 10 ** (math.floor(math.log10(x)) - 1)
    return int(round(x / p) * p)

pr = collections.defaultdict(collections.Counter)
for r in rækker:
    pr[int(r['disc_year'])][(round(float(r['ra'])) % 360, round(float(r['dec'])), lysår(r['sy_dist']))] += 1
år = range(min(pr), max(pr) + 1)  # også år uden fund, så tælleren går ét år ad gangen
uden = sum(1 for r in rækker if not r['sy_dist'])

def række(a):
    punkter = sorted(pr[a].items(), key=lambda t: (t[0][2], t[0]))
    return ';'.join(f'{ra},{dec},{ly}' + (f',{n}' if n > 1 else '') for (ra, dec, ly), n in punkter)

linjer = '\n'.join(f"  [{a}, '{række(a)}']," for a in år)
open(ud, 'w', encoding='utf8').write(f"""// De kendte planeter om andre stjerner (exoplaneter), til gåden "Er der liv andre steder?" (G4d, js/gaader/liv.js).
// Uden Three.js, så det kan testes i Node. Lavet med tests/vaerktoejer/lav_exoplaneter.py.
// Kilde: NASA Exoplanet Archive, tabellen pscomppars (hentet {DATO}): {len(rækker)} bekræftede planeter med fundår
// (disc_year), retning på himlen (ra og dec i grader) og afstand (sy_dist). {uden} har ingen afstand (0 = ukendt).
// PLANETER_PR_ÅR: [år, 'ra,dec,lysår;ra,dec,lysår,antal;…'] (ra og dec i hele grader, lysår med to betydende cifre,
// antal kun når flere planeter om samme stjerne blev fundet samme år). År uden fund har en tom tekst.
export const EXOPLANETER_I_ALT = {len(rækker)};
export const EXOPLANETER_DATO = '{DATO}';
export const PLANETER_PR_ÅR = [
{linjer}
];
// Planeterne for ét år som [ra, dec, lysår] (én pr. planet)
export function planeterFor(række) {{
  const ud = [];
  for (const p of række[1] ? række[1].split(';') : []) {{
    const [ra, dec, ly, n = 1] = p.split(',').map(Number);
    for (let i = 0; i < n; i++) ud.push([ra, dec, ly]);
  }}
  return ud;
}}
// Afstandene for ét år i lysår
export const afstandeFor = (række) => planeterFor(række).map((p) => p[2]);
""")
print(len(rækker), 'planeter,', uden, 'uden afstand')
