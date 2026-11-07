# Udregningerne bag docs/fakta-tid.md (Tid og rum, Trin 0, 7. november 2026).
# Kør: python3 docs/fakta-tid/regn.py   (kun standardbiblioteket; mpmath bruges ikke, decimal klarer de mange 9-taller)
from decimal import Decimal as D, getcontext
import math

getcontext().prec = 50
c = 299_792_458.0            # m/s (eksakt, SI)
g = 9.80665                  # m/s² (standardtyngde, eksakt)
år = 365.25 * 86400          # julianske år i sekunder (lysåret er defineret med det)
ly = c * år                  # 9,4607e15 m
AU = 149_597_870_700.0       # m (eksakt, IAU 2012)
J_TNT_kt = 4.184e12          # J pr. kiloton TNT (konvention)

def gamma(beta):
    # med Decimal, så 0,99999999999… ikke bliver til 1
    b = D(beta)
    return float(1 / (1 - b * b).sqrt())

print("== 1. Gammafaktoren: 1 dag i skibet = γ dage på Jorden ==")
for n in range(1, 13):
    beta = '0.' + '9' * n
    G = gamma(beta)
    print(f"  {n:2d} ni-taller  v = {beta:<16} c   γ = {G:14.6g}   1 dag i skibet = {G:12.6g} dage = {G/365.25:10.4g} år på Jorden")
print(f"  50 %: γ = {gamma('0.5'):.4f}")
# Hvor hurtigt for 2 dage mod 2.000 år?
G = 2000 * 365.25 / 2
eps = 1 / (2 * G * G)       # 1 − β ≈ 1/(2γ²) for store γ
print(f"  2 dage mod 2.000 år: γ = {G:.0f}, 1 − v/c ≈ {eps:.3e}")
print(f"  Hvert ekstra 9-tal: γ ganges med ca. √10 = {math.sqrt(10):.3f} (for store γ)")

print("\n== 2. Afstandene (lysår) ==")
mål = {
    'Alpha Centauri A/B': 4.344,     # Wikipedia: parallakse 750,81 mas (Akeson m.fl. 2021) = 1,3319 pc = 4,344 ly. Proxima 4,2465 ly
    'Mælkevejens centrum (Sgr A*)': 26_996,  # GRAVITY 2023: 8,277 kpc = 26.996 ly (2021: 8,275 kpc)
    'Andromedagalaksen': 2.5e6,      # Wikipedia: ca. 2,5 mio. ly (765 ± 11 kpc)
}
kpc = 3.0856775814913673e19      # m
print(f"  8,275 kpc = {8.275*kpc/ly:,.0f} ly;  8,178 kpc = {8.178*kpc/ly:,.0f} ly;  765 kpc = {765*kpc/ly:,.4g} ly")

print("\n== 3. Fast fart (ingen tid til at speede op): tid ud og hjem ==")
for navn, d in mål.items():
    print(f"  {navn} ({d:,} ly)")
    for beta in ['0.9', '0.99', '0.999', '0.9999', '0.99999', '0.999999']:
        G = gamma(beta); v = float(beta)
        jord = 2 * d / v                 # år på Jorden, ud og hjem
        skib = jord / G                  # år i skibet
        print(f"    v = {beta:<9} c: Jorden {jord:14,.4g} år   skibet {skib:12.4g} år = {skib*365.25:12,.1f} dage   (afstand set fra skibet {d/G:.4g} ly)")

print("\n== 4. '1 g hele vejen': speed op med 1 g til midtvejs, brems med 1 g resten ==")
cpa = c / g / år            # c/a i år
c2pa = c * c / g / ly       # c²/a i lysår
print(f"  c/a = {cpa:.4f} år,  c²/a = {c2pa:.4f} lysår")
for navn, d in mål.items():
    x = 1 + d / (2 * c2pa)            # γ midtvejs
    tau1 = 2 * cpa * math.acosh(x)    # egentid én vej
    t1 = 2 * cpa * math.sqrt(x * x - 1)   # Jordens tid én vej
    beta_max = math.sqrt(1 - 1 / (x * x))
    eta = math.acosh(x)               # største rapiditet
    masse_1vej = math.exp(2 * eta)    # perfekt foton-raket: M0/M1 = e^(Δrapiditet)
    print(f"  {navn}: én vej skib {tau1:.3f} år, Jorden {t1:,.1f} år;  ud og hjem skib {2*tau1:.2f} år, Jorden {2*t1:,.1f} år")
    print(f"     størst fart midtvejs: γ = {x:,.4g}, 1 − v/c = {1-beta_max:.3e};  foton-raket: masse ved start / ved mål = {masse_1vej:.3g} (én vej), {masse_1vej**2:.3g} (ud og hjem)")

print("\n== 5. Lysuret ==")
L = 1.5  # m mellem spejlene (eksempel)
print(f"  Spejle {L} m fra hinanden: ét tik (op og ned) = 2L/c = {2*L/c*1e9:.2f} ns")
print("  Set fra Jorden: lyset går skråt. Pythagoras: (c·t/2)² = L² + (v·t/2)²  →  t = (2L/c)/√(1 − v²/c²) = γ·(2L/c)")

print("\n== 6. Energien: E_kin = (γ − 1)·m·c² ==")
G = 2000 * 365.25 / 2
E_ton = (G - 1) * 1000 * c * c
print(f"  1 ton ved γ = {G:.0f}: {E_ton:.3e} J")
for EJ in (620, 592):
    print(f"    = {E_ton/(EJ*1e18):,.0f} års energiforbrug i hele verden ({EJ} EJ/år)")
L_sol = 3.828e26  # W (IAU 2015 nominel)
print(f"    = Solens udstråling i {E_ton/L_sol:.3f} s")
for beta in ['0.9999', '0.99']:
    print(f"  1 ton ved v = {beta} c: {(gamma(beta)-1)*1000*c*c:.3e} J = {(gamma(beta)-1)*1000*c*c/620e18:.2f} års energi for verden")
m = 1e-9  # 1 mikrogram
for navn, Gx in [('γ = 365.250', G), ('0,9999 c', gamma('0.9999')), ('0,99 c', gamma('0.99'))]:
    E = (Gx - 1) * m * c * c
    print(f"  Støvkorn 1 µg ved {navn}: {E:.3e} J = {E/J_TNT_kt:.4g} kt TNT = {E/J_TNT_kt*1000:,.3g} ton TNT")
r = (3 * (1e-6 / 3.0) / (4 * math.pi)) ** (1 / 3) * 1e4  # µm, densitet 3 g/cm³
print(f"  1 µg med densitet 3 g/cm³: diameter ca. {2*r:.0f} µm")
print(f"  En proton ved γ = {G:.0f}: {(G-1)*938.272e6:.3e} eV")

print("\n== 7. Myonerne ==")
tau = 2.1969811e-6
print(f"  c·τ = {c*tau:.1f} m")
print(f"  Overlever 15 km uden tidsforlængelse (v ≈ c): e^(−15000/{c*tau:.0f}) = {math.exp(-15000/(c*tau)):.2e}")
E_my = 4e9; m_my = 105.6584e6
Gm = E_my / m_my
print(f"  Myon med 4 GeV: γ ≈ {Gm:.1f}, middelvej γ·v·τ ≈ {Gm*c*tau/1000:.1f} km; overlever 15 km: {math.exp(-15000/(Gm*c*tau)):.2f}")

print("\n== 8. Astronauterne (ISS) ==")
GM = 3.986004418e14; R = 6.371e6; h = 420e3
v = math.sqrt(GM / (R + h))
fart = v * v / (2 * c * c)
højde = GM * (1 / R - 1 / (R + h)) / (c * c)
print(f"  Banefart {v:.0f} m/s: farten gør uret {fart:.3e} langsommere, højden {højde:.3e} hurtigere, samlet {fart-højde:.3e} langsommere")
for navn, dage in [('Padalka', 878.5), ('Kononenko', 1111)]:
    print(f"  {navn} {dage} døgn: ca. {(fart-højde)*dage*86400*1000:.0f} ms yngre")

print("\n== 9. Ure i forskellig højde: Δf/f = g·Δh/c² ==")
for dh in (0.33, 1.0, 1e-3, 8848):
    print(f"  Δh = {dh} m: {g*dh/c/c:.3e}  ({g*dh/c/c*86400*365.25*1e9:.3g} ns pr. år)")

print("\n== 10. GPS (tjek af tallene i rumtid.js) ==")
a_gps = 26_560e3
v_g = math.sqrt(GM / a_gps)
dag = 86400
print(f"  højden: +{GM*(1/R-1/a_gps)/c/c*dag*1e6:.1f} µs/døgn, farten: −{v_g**2/2/c/c*dag*1e6:.1f} µs/døgn, samlet +{(GM*(1/R-1/a_gps)-v_g**2/2)/c/c*dag*1e6:.1f} µs/døgn, ×c = {(GM*(1/R-1/a_gps)-v_g**2/2)/c/c*dag*c/1000:.1f} km")

print("\n== 11. Lysets forsinkelse ==")
for navn, d in [('Månen (middel 384.400 km)', 384_400e3), ('Månen nærmest 356.400 km', 356_400e3), ('Solen (1 AU)', AU),
                ('Mars nærmest (54,6 mio. km)', 54.6e9), ('Mars 2003 (55,76 mio. km)', 55.76e9), ('Mars længst (401 mio. km)', 401e9)]:
    s = d / c
    print(f"  {navn}: {s:.2f} s = {int(s//60)} min {s%60:.0f} s")
print(f"  Én lysdag = {c*86400:.4e} m = {c*86400/AU:.2f} AU")
print(f"  Cæsium: 9.192.631.770 svingninger pr. sekund → én svingning = {1/9_192_631_770*1e12:.1f} ps")

print("\n== 12. Forslag: speed op med 1 g til topfarten, flyv med den, og brems med 1 g (én vej) ==")
def rejse(d, beta_top):
    # d i lysår, beta_top = topfarten. Returnerer (skibets tid, Jordens tid, opnået γ), én vej, i år.
    eta_top = math.atanh(beta_top)
    x_acc = c2pa * (math.cosh(eta_top) - 1)          # strækning (ly) for at speede op
    if 2 * x_acc >= d:                                 # når ikke topfarten: 1 g hele vejen
        x = 1 + d / (2 * c2pa)
        return 2 * cpa * math.acosh(x), 2 * cpa * math.sqrt(x * x - 1), x
    tau_acc, t_acc = cpa * eta_top, cpa * math.sinh(eta_top)
    rest = d - 2 * x_acc
    return 2 * tau_acc + rest / beta_top / math.cosh(eta_top), 2 * t_acc + rest / beta_top, math.cosh(eta_top)
for navn, d in mål.items():
    for b in ['0.9', '0.99', '0.9999', '0.999999']:
        s, j, G = rejse(d, float(b))
        print(f"  {navn:30s} top {b:<9}: skib {s:12.4g} år ({s*365.25:12,.0f} dage), Jorden {j:12,.6g} år, γ nået {G:.4g}")

print("\n== 13. Hvor hårdt skal man speede op for '2 dage mod 2.000 år' (ud og hjem, fire faser med samme acceleration)? ==")
# Jordens tid / skibets tid = sinh(u)/u, hvor u er den største rapiditet. Løs sinh(u)/u = 365.250 med halvering.
lo, hi = 1.0, 40.0
for _ in range(200):
    u = (lo + hi) / 2
    if math.sinh(u) / u < 365_250: lo = u
    else: hi = u
tau = 2 * 86400                        # 2 døgn i skibet
a = 4 * u * c / tau                    # τ = 4 (c/a) u
print(f"  u = {u:.2f}, acceleration = {a:.3g} m/s² = {a/g:,.0f} g")
print(f"  Med 1 g tager det {cpa*math.acosh(365_250):.1f} år (skibets tid) bare at nå γ = 365.250")
