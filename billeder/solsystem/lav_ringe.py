# Laver tætheden i Saturns ringe (optisk dybde τ langs radius) ud fra Cassinis måling, da stjernen β Centauri skinnede
# gennem ringene (UVIS, Rev 78, 28. juli 2008, 10 km pr. målepunkt). Skriver js/data/ringe-tau.js.
#
# Hent profilen hos NASA's PDS Ring-Moon Systems Node (offentlige data fra NASA, UVIS er bygget af LASP, University of Colorado):
#   https://pds-rings.seti.org/holdings/volumes/COUVIS_8xxx/COUVIS_8001/data/UVIS_HSP_2008_210_BETCEN_E_TAU10KM.TAB
#   (beskrivelsen af kolonnerne står i .LBL-filen ved siden af). Metoden: Colwell m.fl. 2010, Astronomical Journal 140, 1569-1578 (doi:10.1088/0004-6256/140/6/1569).
# Kør:  python3 lav_ringe.py <TAB-filen> ../../js/data/ringe-tau.js
#
# Hvorfor β Centauri: Cassini så stjernen 66,7° over ringplanet, så lyset går den korte vej gennem ringene, og stjernen er
# klar i ultraviolet. Målingen kan derfor se gennem B-ringen (τ op til ca. 6-10). γ Crucis (62,3°, men en rød kæmpe, der er
# svag i ultraviolet) stopper ved τ ≈ 2,5, og radiomålingerne (RSS) bruger bølger på nogle cm, så de mærker mest de store isklumper.
#
# Det, målingen ikke viser, og hvad vi gør:
#   - Støj: Negative værdier og værdier under STØJ bliver 0 (målingen kan ikke se under ca. 0,01).
#   - D-ringen (66.900-74.490 km) er for tynd til at måle. Den tegnes af js/data/ringe.js som før.
#   - F-ringen er skæv (excentrisk) og klumpet. Målingen er fra ét sted på ringen, hvor den lå ved ca. 140.556 km.
#     Toppen flyttes hen på F-ringens middelafstand (F_MIDT, samme som i js/data/ringe.js).
#   - Encke- og Keeler-mellemrummet sættes til 0 i js/data/ringe.js (målingen viser kun støj dér).
#   - τ over TAU_MAKS bliver TAU_MAKS: Så tæt er ringen alligevel helt uigennemsigtig.
import sys
import base64
import numpy as np

RING_IND, RING_UD, N = 66900, 141000, 8192  # samme som i js/data/ringe.js (ca. 9 km pr. punkt)
C_IND = 74490  # C-ringens inderkant: Inden for den er D-ringen, som målingen ikke kan se
F_MÅLT, F_MIDT, F_BREDDE = 140556, 140200, 60  # km: F-ringens top i målingen, middelafstanden og halvdelen af bredden
STØJ = 0.006
TAU_MAKS = 6.5  # Uint16 med τ × 10.000 kan højst være 6,5535

tab, ud = sys.argv[1], sys.argv[2]
d = np.loadtxt(tab, delimiter=',')
r, tau = d[:, 0], d[:, 4]  # kolonne 1: radius (km), kolonne 5: normal optisk dybde
assert r.min() < C_IND and r.max() > RING_UD, 'profilen dækker ikke hele ringsystemet'
assert np.all(np.diff(r) > 0)
tau = np.where(tau < STØJ, 0.0, np.minimum(tau, TAU_MAKS))

km = RING_IND + (np.arange(N) + 0.5) / N * (RING_UD - RING_IND)
ny = np.interp(km, r, tau)
ny[km < C_IND] = 0  # D-ringen tegnes af ringe.js
# F-ringen: alt mellem A-ringen og F-ringen er tomt, og den målte top lægges på middelafstanden
mellem = km > 137000
ny[mellem] = 0
f = np.abs(km - F_MIDT) < F_BREDDE
ny[f] = np.interp(km[f] - F_MIDT + F_MÅLT, r, tau)

u16 = np.round(ny * 10000).astype('<u2')
b64 = base64.b64encode(u16.tobytes()).decode()
with open(ud, 'w', encoding='utf-8') as fil:
    fil.write('// Saturns ringe: normal optisk dybde τ (× 10.000) i ' + str(N) + ' punkter fra ' + f'{RING_IND:,}'.replace(',', '.')
              + ' til ' + f'{RING_UD:,}'.replace(',', '.') + ' km fra Saturns centrum,\n'
              + '// som Uint16 (little-endian) i base64. Lavet af billeder/solsystem/lav_ringe.py ud fra Cassinis måling med UVIS, da\n'
              + '// stjernen β Centauri skinnede gennem ringene (Rev 78, 28. juli 2008, NASA PDS Ring-Moon Systems Node). Ret ikke i hånden.\n'
              + f'export const TAU_N = {N};\n'
              + f"export const TAU_B64 = '{b64}';\n")
for navn, a, b in [('C', 74490, 91975), ('B', 91975, 117570), ('Cassini-delingen', 117570, 122170), ('A', 122170, 136775), ('F', 140000, 140400)]:
    m = (km >= a) & (km < b)
    print(f'{navn}: median τ {np.median(ny[m]):.3f}, største {ny[m].max():.3f}')
print('ok', ud, len(b64), 'tegn')
