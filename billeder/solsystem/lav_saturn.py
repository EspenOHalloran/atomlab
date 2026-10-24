# Laver billederne til prototypen med Saturn, Enceladus og Titan (js/kosmos/saturn.js) ud fra originalerne.
# Hent originalerne til en mappe (navnene til venstre), og kør:  python3 lav_saturn.py <mappe med originaler> <ud-mappe>
# Mangler en original, springes den over (så kan man lave én klode ad gangen).
# Wikimedia svarer 429, hvis forespørgslen ikke har en User-Agent (fx curl -A "AtomLab-billedvaerktoej").
#
#   Solarsystemscope_texture_8k_saturn.jpg            Saturn (Solar System Scope, CC BY 4.0), via Wikimedia Commons.
#       Trods navnet er billedet kun 4096 x 2048, så Saturn får ikke et 8k-kort:
#       https://upload.wikimedia.org/wikipedia/commons/1/1e/Solarsystemscope_texture_8k_saturn.jpg
#   Solarsystemscope_texture_8k_saturn_ring_alpha.png Saturns ringe (Solar System Scope, CC BY 4.0), via Wikimedia Commons:
#       https://upload.wikimedia.org/wikipedia/commons/2/29/Solarsystemscope_texture_8k_saturn_ring_alpha.png
#   Enceladus_Cassini_mosaic_global_110m.tif          Enceladus (NASA/JPL/Space Science Institute, Cassini, via USGS):
#       https://planetarymaps.usgs.gov/mosaic/Enceladus_Cassini_mosaic_global_110m.tif
#   Titan_ISS_P19658_Mosaic_Global_4km.tif            Titans overflade i nær-infrarødt lys (NASA/JPL/SSI, PIA19658, via USGS):
#       https://planetarymaps.usgs.gov/mosaic/Titan_ISS_P19658_Mosaic_Global_4km.tif
#   MI_170630_DLR_basemap.tif                         Mimas (NASA/JPL/SSI, lavet af DLR), pakket ud af zip-filen fra USGS:
#       https://planetarymaps.usgs.gov/mosaic/Mimas/Cassini_DLR_Mimas.zip  (Cassini_DLR/MI_170630_DLR_basemap.tif)
#   Tethys_Cassini_mosaic_global_293m.tif             Tethys (NASA/JPL/SSI, via USGS):
#       https://planetarymaps.usgs.gov/mosaic/Tethys_Cassini_mosaic_global_293m.tif
#   Dione_Cassini_Voyager_mosaic_global_154m.tif      Dione (NASA/JPL/SSI og Voyager, via USGS):
#       https://planetarymaps.usgs.gov/mosaic/Dione_Cassini_Voyager_mosaic_global_154m.tif
#   Rhea_Cassini_Voyager_mosaic_global_417m.tif       Rhea (NASA/JPL/SSI og Voyager, via USGS):
#       https://planetarymaps.usgs.gov/mosaic/Rhea_Cassini_Voyager_mosaic_global_417m.tif
#
# Kortene vendes, så længdegrad 0° (siden, der vender mod Saturn) står midt i billedet, ligesom på Jordens kort.
# Ringbilledet passer ikke helt med de rigtige afstande (Cassini-delingen er for smal). Derfor bruges kun farverne,
# og de lægges stykke for stykke på de rigtige grænser (D, C, B, Cassini-delingen, A og F) fra js/data/ringe.js.
import sys
import os
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)


def findes(fil):
    if os.path.exists(os.path.join(ind, fil)):
        return True
    print('springer over (mangler):', fil)
    return False


def gem_jpg(im, navn, kvalitet=88, otte_k=False):
    # 8k kun, hvor originalen har mindst 8192 pixel hele vejen rundt (se docs/plan-saturn-kvalitet.md, S1)
    størrelser = (('8k', 8192),) * otte_k + (('4k', 4096), ('2k', 2048))
    for størrelse, b in størrelser:
        im.resize((b, b // 2), Image.LANCZOS).save(os.path.join(ud, f'{navn}-{størrelse}.jpg'), quality=kvalitet, optimize=True, progressive=True)


# Saturn: midten af kortet er allerede længdegrad 0
if findes('Solarsystemscope_texture_8k_saturn.jpg'):
    gem_jpg(Image.open(os.path.join(ind, 'Solarsystemscope_texture_8k_saturn.jpg')).convert('RGB'), 'saturn')

# Enceladus: midten er 0° (kortets venstre kant er 180°). Kortet er 14401 x 7201: Den sidste søjle er den første
# igen, og den sidste række (sydpolen) er tom, så begge skæres væk.
if findes('Enceladus_Cassini_mosaic_global_110m.tif'):
    im = Image.open(os.path.join(ind, 'Enceladus_Cassini_mosaic_global_110m.tif')).convert('L')
    gem_jpg(im.crop((0, 0, im.size[0] // 2 * 2, im.size[0] // 2)), 'enceladus', otte_k=True)

# Mimas, Tethys, Dione og Rhea: midten er 0° (se GeoTIFF-felterne), og øst er til højre som på de andre.
# Mimas' kort (ca. 5.800 pixel rundt i originalen) bliver ikke skarpere af 8k.
for navn, fil, otte_k in (('mimas', 'MI_170630_DLR_basemap.tif', False), ('tethys', 'Tethys_Cassini_mosaic_global_293m.tif', True),
                          ('dione', 'Dione_Cassini_Voyager_mosaic_global_154m.tif', True), ('rhea', 'Rhea_Cassini_Voyager_mosaic_global_417m.tif', True)):
    if not findes(fil):
        continue
    im = Image.open(os.path.join(ind, fil)).convert('L')
    fak = im.size[0] // (8192 if otte_k else 4096)
    if fak > 1:
        im = im.reduce(fak)  # de store kort gøres først mindre i hele trin (sparer hukommelse og tid)
    gem_jpg(im, navn, kvalitet=85, otte_k=otte_k)

# Titan: midten er 180°, så kortet rulles en halv omgang
if findes('Titan_ISS_P19658_Mosaic_Global_4km.tif'):
    t = np.asarray(Image.open(os.path.join(ind, 'Titan_ISS_P19658_Mosaic_Global_4km.tif')).convert('L'))
    gem_jpg(Image.fromarray(np.roll(t, t.shape[1] // 2, axis=1)), 'titan')

# Ringenes farver: fra pixel i ringbilledet til km fra Saturns centrum, stykke for stykke.
# Ankerpunkterne er fundet i billedet (hvor tætheden springer): C-ringens inderkant, B-ringens inder- og yderkant,
# A-ringens inder- og yderkant og F-ringen.
if not findes('Solarsystemscope_texture_8k_saturn_ring_alpha.png'):
    sys.exit(print('ok (uden ringene)'))
ring = np.asarray(Image.open(os.path.join(ind, 'Solarsystemscope_texture_8k_saturn_ring_alpha.png')).convert('RGBA')).astype(float) / 255
farve = ring[:, :, :3].mean(axis=0)
ANKER_PX = [460, 2340, 5505, 5850, 7700, 8110]
ANKER_KM = [74490, 91975, 117570, 122170, 136775, 140200]
RING_IND, RING_UD, N = 66900, 141000, 2048
km = RING_IND + (np.arange(N) + 0.5) / N * (RING_UD - RING_IND)
px = np.interp(km, ANKER_KM, ANKER_PX)
rgb = np.stack([np.interp(px, np.arange(len(farve)), farve[:, i]) for i in range(3)], axis=1)
# Kun farvetonen og de fine striber bruges. Lysstyrken kommer fra tætheden i shaderen.
lys = rgb.mean(axis=1, keepdims=True)
glat = np.convolve(lys[:, 0], np.ones(41) / 41, mode='same')[:, None]
tone = 0.5 + 0.5 * rgb / np.maximum(lys, 1e-3)  # kun halvdelen af farvetonen, så ringene ikke bliver for farvede
striber = np.clip(lys / np.maximum(glat, 1e-3), 0.6, 1.4)
tone[km < ANKER_KM[1]] = 0.8 + 0.2 * tone[km < ANKER_KM[1]]  # C-ringen er blålig i billedet, men gråbrun i virkeligheden
ud_rgb = np.clip(tone * striber * 0.62, 0, 1)
ud_rgb[km < ANKER_KM[0]] = ud_rgb[km >= ANKER_KM[0]][0]  # D-ringen findes ikke i billedet
ud_rgb[km > ANKER_KM[4]] = 0.55  # ringbilledets yderkant er blålig, så F-ringen er grå
Image.fromarray(np.round(ud_rgb[None, :, :] * 255).astype(np.uint8), 'RGB').save(os.path.join(ud, 'saturn-ringe.png'), optimize=True)
print('ok')
