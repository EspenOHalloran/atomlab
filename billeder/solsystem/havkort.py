# Laver jorden-hav.png: et kort over havet (hvidt = hav) til Solens glimt i havet i js/kosmos/jorden.js.
# Bygger på global-land-mask (MIT-licens, https://github.com/toddkarin/global-land-mask), som bygger på NOAA's GLOBE-data.
# Brug: pip download global-land-mask --no-deps, pak hjulet (.whl) ud, og kør
#   python3 havkort.py <sti>/global_land_mask/globe_combined_mask_compressed.npz jorden-hav.png
import sys
import numpy as np
from PIL import Image
npz, ud = sys.argv[1], sys.argv[2]
m = np.load(npz, allow_pickle=False)['mask']  # True = hav, 21600 x 43200, første række er nord, første kolonne er -180
H, W = m.shape
lille = np.empty((H // 5, W // 5), dtype=np.float32)
for i in range(0, H, 540):
    blok = m[i:i + 540].astype(np.float32)
    lille[i // 5:(i + 540) // 5] = blok.reshape(-1, 5, W // 5, 5).mean(axis=(1, 3))
billede = Image.fromarray(np.round(lille * 255).astype(np.uint8), 'L')
billede.resize((2048, 1024), Image.BOX).save(ud, optimize=True)
print('ok', billede.size)
