# Laver kortet over Venus' skyer i ultraviolet lys og måler vindene (js/kosmos/venus.js, V2 i docs/plan-venus.md).
# Kør:  python3 lav_venus_skyer.py <mappe til originalerne> <ud-mappe>
# (kræver kun numpy og Pillow. FITS-filerne er enkle tabeller, så astropy er ikke nødvendig. Filerne hentes selv, hvis
# de ikke ligger i mappen.)
#
# Kilden: Akatsuki (JAXA), kameraet UVI med filteret 365 nm, niveau L3b ("Projected image data products") i JAXA's
# arkiv DARTS (PDS4-samlingen vco_uvi, version 2.1):
#   https://data.darts.isas.jaxa.jp/pub/pds4/data/vco/vco_uvi/data_map/l3b/r0057/uvi_<dato>_365_l3b_v21.fit
# Licens: fri brug, også kommercielt, efter ISAS' datapolitik (DARTS' FAQ). Krediteres "ISAS/JAXA". Se KILDER.md.
#
# Hvert L3b-billede er ét billede fra Akatsuki lagt ud på et net med 0,125° (længde 0-360° øst, planetocentrisk bredde),
# som en tabel med en række pr. pixel: længden, bredden, strålingen ved 365 nm og vinklerne til Solen (inangle) og til
# Akatsuki (emangle). Skyerne er regnet i 70 km's højde (S_CLDALT i filerne).
#
# Banen r0057 (13.-19. august 2017): Akatsuki stod langt ude (ca. 300.000-370.000 km) næsten mellem Solen og Venus
# (fasevinkel 2-20°), så hele dagsiden kunne ses, og der blev taget et billede ca. hver 2.-3. time.
#
# 1. Lyset: Hvor lyst et sted er, afhænger både af skyerne og af vinklerne. Det sidste tages ud med Minnaerts lov
#    (I = B · μ0^k · μ^(k−1), μ0 og μ er cos til vinklerne til Solen og Akatsuki), tilpasset hvert billede for sig.
#    Tilbage er skyernes egen lysstyrke (1 er middel).
# 2. Vindene: To billeder med 1,5-3,5 timers mellemrum sammenlignes række for række (krydskorrelation af lysstyrken
#    efter et glidende gennemsnit på 6° er trukket fra, som Jupiters vinde i J2). Flytningen i længde giver farten mod
#    øst eller vest. Medianen over alle par giver profilen. Gemmes i <ud-mappe>/vinde-venus.txt (bredde, m/s, antal).
# 3. Kortet: Alle billederne flyttes med vindene hen til samme tidspunkt (T0) og lægges sammen, vægtet efter, hvor godt
#    hvert sted blev set (lige forfra og i høj sol) og hvor tæt billedet er på T0. Skyerne skifter form med tiden, så det
#    er et billede af mønstret omkring T0, ikke ét foto. Polerne (over ca. 70°) blev set meget skråt og er fyldt blødt.
#    Gemmes i gråtoner (4k, 2k og 1k) med længde 0° i midten og øst til højre (som Magellans kort).
import sys
import os
import math
import datetime
import subprocess
import numpy as np
from PIL import Image

ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ind, exist_ok=True)
os.makedirs(ud, exist_ok=True)
KILDE = 'https://data.darts.isas.jaxa.jp/pub/pds4/data/vco/vco_uvi/data_map/l3b/r0057/'
FRA, TIL = '20170813_1200', '20170819_0600'
T0 = datetime.datetime(2017, 8, 16, 12, 0)
R_SKY = 6051.8 + 70.0  # km: skyernes højde i L3b (S_TGRADI + S_CLDALT)
N_L, N_B = 2880, 1440  # nettet: 0,125°
GLAT = 6.0  # grader: det glidende gennemsnit, der trækkes fra før krydskorrelationen
TAU = 1.0  # døgn: billeder længere fra T0 tæller mindre (exp(−(Δt/TAU)²))


def filer():
    liste = subprocess.run(['curl', '-s', '-m', '60', KILDE], capture_output=True, text=True).stdout
    navne = sorted(set(x for x in __import__('re').findall(r'uvi_\d{8}_\d{6}_365_l3b_v21\.fit', liste)))
    return [n for n in navne if FRA <= n[4:17] <= TIL]


def hent(navn):
    sti = os.path.join(ind, navn)
    if not os.path.exists(sti):
        subprocess.run(['curl', '-s', '-m', '300', '-o', sti + '.del', KILDE + navn], check=True)
        os.rename(sti + '.del', sti)
    return sti


def læs(sti):
    """Tabellen i FITS-filen: længde, bredde, stråling, cos til vinklen til Solen og til Akatsuki (μ0, μ)."""
    data = open(sti, 'rb').read()
    pos, hoveder = 0, []
    while True:
        h = {}
        while True:
            blok = data[pos:pos + 2880]
            pos += 2880
            slut = False
            for i in range(36):
                kort = blok[i * 80:(i + 1) * 80].decode('ascii', 'replace')
                if kort[:8].strip() == 'END':
                    slut = True
                    break
                if kort[8:10] == '= ':
                    h[kort[:8].strip()] = kort[10:].split('/')[0].strip().strip("'").strip()
            if slut:
                break
        hoveder.append(h)
        if h.get('XTENSION') == 'BINTABLE':
            break
    n, bredde = int(h['NAXIS2']), int(h['NAXIS1'])
    rå = np.frombuffer(data[pos:pos + n * bredde], dtype=np.uint8).reshape(n, bredde)
    kol = {}
    off = 0
    for i in range(1, int(h['TFIELDS']) + 1):
        navn, form = h['TTYPE%d' % i].strip(), h['TFORM%d' % i].strip()
        dt, nb = ('>i2', 2) if form == 'I' else ('>f4', 4)
        v = rå[:, off:off + nb].copy().view(dt).ravel().astype(np.float64)
        off += nb
        if 'TNULL%d' % i in h:
            v[v == float(h['TNULL%d' % i])] = np.nan
        v = v * float(h.get('TSCAL%d' % i, 1)) + float(h.get('TZERO%d' % i, 0))
        kol[navn] = v
    tid = datetime.datetime.strptime(h['DATE-BEG'][:19], '%Y-%m-%dT%H:%M:%S')
    il = np.round((kol['longitude'] - 0.0625) / 0.125).astype(int) % N_L
    ib = np.round((kol['latitude'] + 89.9375) / 0.125).astype(int)
    mu0 = np.cos(np.radians(kol['inangle']))
    mu = np.cos(np.radians(kol['emangle']))
    return tid, il, ib, kol['Radiance'], mu0, mu


def lysstyrke(il, ib, I, mu0, mu):
    """Skyernes egen lysstyrke på nettet (1 er middel, NaN uden data) efter Minnaerts lov."""
    ok = (mu0 > 0.2) & (mu > 0.2) & (I > 0) & np.isfinite(mu0) & np.isfinite(mu)
    # log I = log B + k log μ0 + (k − 1) log μ  →  log I + log μ = log B + k (log μ0 + log μ)
    x = np.log(mu0[ok]) + np.log(mu[ok])
    y = np.log(I[ok]) + np.log(mu[ok])
    k, logB = np.polyfit(x, y, 1)
    A = np.full((N_B, N_L), np.nan)
    v = (mu0 > 0.12) & (mu > 0.12) & (I > 0)
    A[ib[v], il[v]] = I[v] / (np.exp(logB) * mu0[v] ** k * mu[v] ** (k - 1))
    W = np.zeros((N_B, N_L))
    W[ib[v], il[v]] = (mu0[v] * mu[v]) ** 2
    return A, W, k


def glat_rundt(r, n):
    """Glidende gennemsnit over n søjler, der går hele vejen rundt (NaN tæller ikke)."""
    ok = np.isfinite(r)
    v = np.where(ok, r, 0.0)
    kern = np.ones(n)
    s = np.convolve(np.concatenate([v[-n:], v, v[:n]]), kern, 'same')[n:-n]
    c = np.convolve(np.concatenate([ok[-n:], ok, ok[:n]]).astype(float), kern, 'same')[n:-n]
    return np.where(c > n * 0.6, s / np.maximum(c, 1), np.nan)


def flytning(a, b, fra, til, glat):
    """Hvor mange søjler b er flyttet mod øst i forhold til a (fra til til søjler, krydskorrelation med en parabel om
    toppen)."""
    na = a - glat_rundt(a, glat)
    nb = b - glat_rundt(b, glat)
    bedst, kurve = None, []
    for s in range(fra, til + 1):
        bb = np.roll(nb, -s)
        ok = np.isfinite(na) & np.isfinite(bb)
        if ok.sum() < 200:
            kurve.append(np.nan)
            continue
        x, y = na[ok] - na[ok].mean(), bb[ok] - bb[ok].mean()
        kurve.append((x * y).sum() / math.sqrt((x * x).sum() * (y * y).sum() + 1e-30))
    kurve = np.array(kurve)
    if not np.isfinite(kurve).any():
        return None
    i = int(np.nanargmax(kurve))
    if i == 0 or i == len(kurve) - 1 or not np.isfinite(kurve[i - 1]) or not np.isfinite(kurve[i + 1]) or kurve[i] < 0.35:
        return None
    y0, y1, y2 = kurve[i - 1], kurve[i], kurve[i + 1]
    return i + fra + 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2)


# ---------- Billederne ----------
navne = filer()
print(len(navne), 'billeder fra', navne[0][4:17], 'til', navne[-1][4:17])
billeder = []
for navn in navne:
    tid, il, ib, I, mu0, mu = læs(hent(navn))
    A, W, k = lysstyrke(il, ib, I, mu0, mu)
    billeder.append((tid, A.astype(np.float32), W.astype(np.float32)))
    print(navn[4:17], 'k = %.3f' % k, 'dækket %.0f %%' % (100 * np.isfinite(A).mean()))

# ---------- Vindene ----------
BÅND = 8  # rækker (1°) lægges sammen
bredder = (np.arange(N_B // BÅND) + 0.5) * 0.125 * BÅND - 90
målinger = [[] for _ in bredder]
for i in range(len(billeder)):
    for j in range(i + 1, len(billeder)):
        dt = (billeder[j][0] - billeder[i][0]).total_seconds()
        if not 1.5 * 3600 <= dt <= 3.5 * 3600:
            continue
        for n, phi in enumerate(bredder):
            if abs(phi) > 72:
                continue
            r = slice(n * BÅND, (n + 1) * BÅND)
            a = np.nanmean(np.where(billeder[i][2][r] > 0.05, billeder[i][1][r], np.nan), axis=0)
            b = np.nanmean(np.where(billeder[j][2][r] > 0.05, billeder[j][1][r], np.nan), axis=0)
            # Fra 170 m/s mod vest til 50 m/s mod øst (skyerne kører mod vest, med drejningen)
            søjler = lambda u: math.degrees(u * dt / (R_SKY * 1000 * math.cos(math.radians(phi)))) / 0.125
            # Det glidende gennemsnit er GLAT grader ved ækvator og lige så mange km ved de andre bredder
            s = flytning(a, b, int(søjler(-170)) - 1, int(søjler(50)) + 1, int(GLAT / 0.125 / math.cos(math.radians(phi))))
            if s is None:
                continue
            målinger[n].append(math.radians(s * 0.125) * R_SKY * 1000 * math.cos(math.radians(phi)) / dt)
profil = []
with open(os.path.join(ud, 'vinde-venus.txt'), 'w') as f:
    f.write('# bredde (grader)  vind mod øst (m/s, median)  antal par  spredning (m/s, kvartilerne)\n')
    for phi, m in zip(bredder, målinger):
        if len(m) >= 8:
            q1, med, q3 = np.percentile(m, [25, 50, 75])
            # Kun bredder, hvor parrene er enige (halvdelen af målingerne inden for ±10 m/s)
            if (q3 - q1) / 2 > 10:
                continue
            f.write('%6.1f %8.1f %5d %6.1f\n' % (phi, med, len(m), (q3 - q1) / 2))
            profil.append((phi, med))
print('vindene: %d bredder' % len(profil))
for phi, u in profil:
    if abs(phi % 10 - 5) < 0.6:
        print('  %5.1f° %6.1f m/s' % (phi, u))

# Profilen til kortet: glattet (medianen over ±3°), og fra den sidste målte bredde aftager vinden jævnt (lineært) til 0
# ved polen, som Venus Express målte den (Hueso m.fl. 2015, arXiv:2401.17046). Samme profil står i js/data/vinde-venus.js.
pb = np.array([p[0] for p in profil])
pu = np.array([p[1] for p in profil])
glat = np.array([np.median(pu[np.abs(pb - b) <= 3]) for b in pb])
with open(os.path.join(ud, 'vinde-venus.txt'), 'a') as f:
    f.write('# glattet (til js/data/vinde-venus.js): ' + ', '.join('[%d, %.0f]' % (round(b), u) for b, u in zip(pb, glat) if round(b) % 2 == 0 and abs(b - round(b)) < 0.6) + '\n')
def vind(phi):
    u = np.interp(phi, pb, glat)
    kant = np.where(phi > 0, pb.max(), pb.min())
    t = np.clip((np.abs(phi) - np.abs(kant)) / (90 - np.abs(kant)), 0, 1)
    return u * (1 - t)

# ---------- Kortet ----------
rækker = (np.arange(N_B) + 0.5) * 0.125 - 90
omega = np.degrees(vind(rækker) / (R_SKY * 1000 * np.cos(np.radians(rækker))))  # grader pr. sekund mod øst
sum_A = np.zeros((N_B, N_L))
sum_W = np.zeros((N_B, N_L))
for tid, A, W in billeder:
    dt = (tid - T0).total_seconds()
    vægt = math.exp(-((dt / 86400) / TAU) ** 2)
    for r in range(N_B):
        if not W[r].any():
            continue
        s = int(round(-omega[r] * dt / 0.125))  # flyt rækken tilbage til T0
        a, w = np.roll(A[r], s), np.roll(W[r], s) * vægt
        ok = np.isfinite(a) & (w > 0)
        sum_A[r, ok] += a[ok] * w[ok]
        sum_W[r, ok] += w[ok]
kort = np.where(sum_W > 1e-4, sum_A / np.maximum(sum_W, 1e-12), np.nan)
dækket = np.isfinite(kort)
cosb = np.cos(np.radians(rækker))[:, None]
print('kortet dækker %.1f %% af skyerne (vægtet med arealet)' % (100 * (dækket * cosb).sum() / (cosb.sum() * N_L)))


# Huller fyldes med en pyramide (som i lav_venus.py), polerne tones blødt mod middelværdien for hver række
def fyld(v, w):
    if min(v.shape) <= 4:
        m = (v * w).sum() / max(w.sum(), 1e-9)
        return np.full_like(v, m)
    h, b = v.shape[0] // 2 * 2, v.shape[1] // 2 * 2
    vv, ww = v[:h, :b], w[:h, :b]
    sw = ww.reshape(h // 2, 2, b // 2, 2).sum(axis=(1, 3))
    sv = (vv * ww).reshape(h // 2, 2, b // 2, 2).sum(axis=(1, 3))
    lille = fyld(np.where(sw > 0, sv / np.maximum(sw, 1e-9), 0), np.minimum(sw, 1))
    stor = np.asarray(Image.fromarray(lille.astype(np.float32), 'F').resize((v.shape[1], v.shape[0]), Image.BILINEAR))
    return np.where(w > 0, v, stor)


# Pyramiden ved ikke, at 0° og 360° er naboer, så en fjerdedel af kortet lånes fra den anden side først
def fyldRundt(v, w):
    k = N_L // 4
    return fyld(np.concatenate([v[:, -k:], v, v[:, :k]], axis=1), np.concatenate([w[:, -k:], w, w[:, :k]], axis=1))[:, k:-k]


vægt = np.where(dækket, np.clip(sum_W / 0.02, 0, 1), 0)
kort = fyldRundt(np.where(dækket, kort, 0), vægt)
kort = vægt * kort + (1 - vægt) * fyldRundt(kort, np.where(vægt > 0.5, 1.0, 0.0))
# Over ca. 70° blev skyerne set meget skråt: tones mod rækkens middel og helt glat ved polen
pol = np.clip((np.abs(rækker) - 68) / 18, 0, 1)[:, None]
pol = pol * pol * (3 - 2 * pol)
kort = kort * (1 - pol) + kort.mean(axis=1, keepdims=True) * pol
kort[0], kort[-1] = kort[0].mean(), kort[-1].mean()

# Gråtoner: middel 128, og ±4 gange spredningen fylder skalaen (kontrasten forstærkes igen i programmet)
mid = np.median(kort[np.abs(rækker) < 50])
spred = np.std(kort[np.abs(rækker) < 50])
print('lysstyrken: middel %.3f, spredning %.3f (%.0f %%)' % (mid, spred, 100 * spred / mid))
with open(os.path.join(ud, 'vinde-venus.txt'), 'a') as f:
    f.write('# kortet: gråtone = 128 + 127 · (lysstyrke − %.4f) / (4 · %.4f)\n' % (mid, spred))
g = np.clip(128 + 127 * (kort - mid) / (4 * spred), 0, 255)
g = np.roll(g[::-1], N_L // 2, axis=1)  # nord øverst, og længde 0° i midten (søjle 0 var 0°)
billede = Image.fromarray(g.astype(np.float32), 'F')
for navn, b in (('4k', 4096), ('2k', 2048), ('1k', 1024)):
    lille = np.asarray(billede.resize((b, b // 2), Image.LANCZOS))
    Image.fromarray(np.clip(np.round(lille), 0, 255).astype(np.uint8), 'L').save(os.path.join(ud, 'venus-skyer-%s.jpg' % navn), quality=90, optimize=True)
    print('venus-skyer-%s.jpg' % navn)
