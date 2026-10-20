# Laver billederne til Jorden og Månen (js/kosmos/jorden.js) ud fra NASA's originaler.
# Hent originalerne til en mappe (navnene til venstre), og kør:  python3 lav_billeder.py <mappe med originaler> <ud-mappe>
#
#   dag-01.jpg ... dag-10.jpg  Blue Marble Next Generation med topografi og havdybde, 2004 (januar, april, juli og oktober)
#       https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73580/world.topo.bathy.200401.3x5400x2700.jpg
#       .../73000/73655/world.topo.bathy.200404.3x5400x2700.jpg, .../73000/73751/world.topo.bathy.200407.3x5400x2700.jpg,
#       .../73000/73826/world.topo.bathy.200410.3x5400x2700.jpg
#   nat.jpg          Black Marble 2016: https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_3km.jpg
#   skyer.tif        Blue Marble: Clouds: https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_8192.tif
#   hoejde.png       Topografi (GEBCO): https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73934/gebco_08_rev_elev_21600x10800.png
#   maane.tif        CGI Moon Kit (LRO): https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_4k.tif
#   maane-hoejde.tif CGI Moon Kit (LRO): https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_16_uint.tif
#
# Højdekortene gemmes med 16 bit fordelt på rød (den store del) og grøn (den lille del) i en PNG,
# så bjergene ikke får trapper. Shaderen læser højden som r * 65280/65535 + g * 255/65535.
import sys
import os
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ind, ud = sys.argv[1], sys.argv[2]
os.makedirs(ud, exist_ok=True)

def gem_jpg(im, navn, kvalitet):
    for størrelse, b in (('4k', 4096), ('2k', 2048)):
        lille = im.resize((b, b // 2), Image.LANCZOS)
        lille.save(os.path.join(ud, f'{navn}-{størrelse}.jpg'), quality=kvalitet, optimize=True, progressive=True)

def gem_hoejde(a, navn, bredde):
    # a: højden som tal mellem 0 og 1 (float). Gemmes som 16 bit i rød og grøn.
    im = Image.fromarray(a.astype(np.float32), 'F').resize((bredde, bredde // 2), Image.BOX)
    v = np.clip(np.round(np.asarray(im) * 65535), 0, 65535).astype(np.uint32)
    rgb = np.zeros(v.shape + (3,), np.uint8)
    rgb[..., 0] = v >> 8
    rgb[..., 1] = v & 255
    Image.fromarray(rgb, 'RGB').save(os.path.join(ud, f'{navn}.png'), optimize=True)

# Jorden om dagen i fire måneder
for m in ('01', '04', '07', '10'):
    gem_jpg(Image.open(os.path.join(ind, f'dag-{m}.jpg')).convert('RGB'), f'jorden-dag-{m}', 86)
    print('dag', m)
# Byernes lys. Black Marble viser også landet svagt blåt (i måneskin). Den blå baggrund trækkes fra, så kun lysene er tilbage.
# Bagefter tages gennemsnittet over flere pixels, så de små lys ikke forsvinder.
nat = np.asarray(Image.open(os.path.join(ind, 'nat.jpg')).convert('RGB'), np.float32)
nat = np.clip((nat - [40, 42, 75]) * 1.2, 0, 255).astype(np.uint8)
nat = Image.fromarray(nat, 'RGB')
for størrelse, b in (('4k', 4096), ('2k', 2048)):
    nat.resize((b, b // 2), Image.BOX).save(os.path.join(ud, f'jorden-nat-{størrelse}.jpg'), quality=88, optimize=True, progressive=True)
print('nat')
# Skyerne (gråtoner)
gem_jpg(Image.open(os.path.join(ind, 'skyer.tif')).convert('L'), 'jorden-skyer', 86)
print('skyer')
# Jordens højder (0 = havets overflade, 1 = det højeste)
h = np.asarray(Image.open(os.path.join(ind, 'hoejde.png')).convert('L'), np.float32) / 255
gem_hoejde(h, 'jorden-hoejde-2k', 2048)
print('jordens højder')
# Månen
gem_jpg(Image.open(os.path.join(ind, 'maane.tif')).convert('RGB'), 'maanen', 88)
mh = np.asarray(Image.open(os.path.join(ind, 'maane-hoejde.tif')), np.float32)
gem_hoejde((mh - mh.min()) / (mh.max() - mh.min()), 'maanen-hoejde-1k', 1024) # Månen er lille på skærmen
print('månen', 'højdeforskel i km:', round(float(mh.max() - mh.min()) / 2000, 2))
