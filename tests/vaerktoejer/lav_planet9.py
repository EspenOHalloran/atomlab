#!/usr/bin/env python3
# Laver js/data/planet9.js: banerne for de fjerneste småkloder til gåden "Er der en planet mere i Solsystemet?"
# (js/gaader/planet9.js). Henter fra JPL's Small-Body Database (sbdb_query.api) alle småkloder med a > 250 AU og
# q > 30 AU (de grænser, Batygin og Brown brugte i 2016) og beholder kun dem med en godt målt bane: målt over mindst
# et år (data_arc >= 365 dage) og condition code højst 5. Kør: python3 tests/vaerktoejer/lav_planet9.py
import json
import urllib.parse
import urllib.request
from datetime import date

URL = 'https://ssd-api.jpl.nasa.gov/sbdb_query.api?' + urllib.parse.urlencode({
    'fields': 'pdes,name,a,e,i,om,w,ma,data_arc,condition_code',
    'sb-cdata': json.dumps({'AND': ['a|GT|250', 'q|GT|30']}),
})
# De seks fra Batygin og Brown 2016 (arXiv:1601.05438, Wikipedia "Planet Nine"): Sedna, 2012 VP113, Alicanto
# (2004 VN112), 2010 GB174, 2007 TG422 og 2013 RF98
SEKS = {'90377', '2012 VP113', '474640', '2010 GB174', '523622', '2013 RF98'}
# Navnene, som de skrives i spillet (nummererede uden navn får deres foreløbige betegnelse)
BETEGNELSE = {'90377': 'Sedna', '474640': 'Alicanto', '523622': '2007 TG422', '765133': '2013 SL102',
              '689335': '2013 FL28', '765047': '2013 RA109', '768325': 'Geyagugv', '541132': 'Leleākūhonua'}

with urllib.request.urlopen(URL, timeout=60) as svar:
    d = json.load(svar)
rækker = []
for pdes, navn, a, e, i, om, w, ma, bue, cc in d['data']:
    if int(bue or 0) < 365 or cc in (None, '') or int(cc) > 5:
        continue
    rækker.append((float(a), BETEGNELSE.get(pdes, navn or pdes), float(e), float(i), float(om), float(w), float(ma), pdes in SEKS))
rækker.sort()
linjer = [f"  ['{n}', {a:.1f}, {e:.4f}, {i:.1f}, {om:.1f}, {w:.1f}, {ma:.1f}, {str(s).lower()}]," for a, n, e, i, om, w, ma, s in rækker]
dato = date.today()
måned = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'][dato.month - 1]
ud = f"""// Banerne for de fjerneste småkloder (gåden om Planet 9, js/gaader/planet9.js). Lavet af tests/vaerktoejer/lav_planet9.py
// ud fra JPL's Small-Body Database (sbdb_query.api) {dato.day}. {måned} {dato.year}: alle med a > 250 AU og q > 30 AU og en godt målt bane
// (målt over mindst et år, condition code højst 5). Uden Three.js, så det kan testes i Node.
// En bane: [navn, a (AU), e, i (°), Ω (°), ω (°), M (°, middelanomalien nu), en af de seks fra Batygin og Brown 2016].

export const SMÅKLODER = [
{chr(10).join(linjer)}
];
export const SMÅKLODER_DATO = '{dato.day}. {måned} {dato.year}';

// Retningen mod perihelium (det sted, banen kommer tættest på Solen), set lige oppefra Jordens baneplan, i grader.
// ϖ = Ω + ω gælder kun for baner, der ikke hælder. Her regnes punktet ud og lægges ned i planet.
export function periheliumRetning([, , , i, om, w]) {{
  const g = Math.PI / 180;
  const x = Math.cos(om * g) * Math.cos(w * g) - Math.sin(om * g) * Math.sin(w * g) * Math.cos(i * g);
  const y = Math.sin(om * g) * Math.cos(w * g) + Math.cos(om * g) * Math.sin(w * g) * Math.cos(i * g);
  return ((Math.atan2(y, x) / g) + 360) % 360;
}}
"""
open('js/data/planet9.js', 'w', encoding='utf-8').write(ud)
print(len(rækker), 'baner,', sum(r[-1] for r in rækker), 'af de seks')
