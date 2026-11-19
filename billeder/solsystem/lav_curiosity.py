# Curiosity som 3D-model (M8c del 2, docs/plan-mars.md og docs/prompt-mars-ekstra.md afsnit 3): gør NASA's model
# 24584_Curiosity_static.glb (11,9 MB, fra science.nasa.gov/resource/curiosity-rover-3d-model) mindre, så den kan hentes
# ved "Hos Curiosity nu" i Stå på Mars (js/solsystem/rover.js).
#
# Brug:  python lav_curiosity.py <sti til 24584_Curiosity_static.glb>
# Hent: https://assets.science.nasa.gov/content/dam/science/psd/mars/resources/gltf_files/24584_Curiosity_static.glb
#
# Skrevet i stedet for gltf-transform (en npm-pakke), som miljøet ikke ville køre (19. november 2026). Det samme gøres
# her med numpy og Pillow:
# - Teksturerne gemmes som WebP (EXT_texture_webp), og en tekstur, der lå tre gange i filen, gemmes én gang. En lille
#   reserve (512 px, JPEG eller PNG) står som almindelig kilde, så browsere uden WebP også kan vise roveren.
# - De to ekstra UV-sæt (TEXCOORD_1 og _2) bruges ikke af materialerne og fjernes.
# - Punkterne gemmes i 16 bit (KHR_mesh_quantization, som Three.js' GLTFLoader læser uden ekstra filer): stederne
#   skaleres til -1..1 med én skala for alle tre akser (så normalerne passer), normalerne og UV'erne i 16 bit.
# Geometrien og materialerne er ellers de samme (51.305 trekanter). Modellen er i meter, y op, hjulene står på y = 0.
import io
import json
import os
import struct
import sys

import numpy as np
from PIL import Image

KVALITET = 88  # WebP (farverne)
KVALITET_N = 92  # WebP (normalkortet)
RESERVE = 512  # pixel: reserven (JPEG, eller PNG med gennemsigtighed) til browsere uden WebP


def læs_glb(sti):
    d = open(sti, 'rb').read()
    n = struct.unpack('<I', d[12:16])[0]
    j = json.loads(d[20:20 + n])
    bin_start = 20 + n + 8
    return j, d[bin_start:]


def main(sti, ud):
    j, b = læs_glb(sti)
    CT = {5126: np.float32, 5123: np.uint16, 5125: np.uint32}
    N = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}

    def acc(i):
        a = j['accessors'][i]
        bv = j['bufferViews'][a['bufferView']]
        n = N[a['type']]
        dt = CT[a['componentType']]
        assert bv.get('byteStride') in (None, n * np.dtype(dt).itemsize)
        s = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(b, dt, a['count'] * n, s).reshape(a['count'], n)

    assert len(j['meshes']) == 1 and len(j['nodes']) == 1
    node = j['nodes'][0]
    flyt = np.array(node.get('translation', [0, 0, 0]), np.float64)
    assert 'rotation' not in node and 'scale' not in node

    # ---- Geometrien ----
    prims = []
    for p in j['meshes'][0]['primitives']:
        assert p.get('mode', 4) == 4
        pos = acc(p['attributes']['POSITION']).astype(np.float64) + flyt
        nor = acc(p['attributes']['NORMAL']).astype(np.float64)
        uv = acc(p['attributes']['TEXCOORD_0']).astype(np.float64)
        idx = acc(p['indices']).ravel()
        assert uv.min() >= 0 and uv.max() <= 1 and len(pos) < 65536
        prims.append((p['material'], pos, nor, uv, idx))
    alle = np.concatenate([p[1] for p in prims])
    lav, høj = alle.min(0), alle.max(0)
    midt = (lav + høj) / 2
    skala = float((høj - lav).max() / 2)  # én skala for alle akser

    data = bytearray()
    views, accessors = [], []

    def tilføj(arr, target=None, stride=None):
        while len(data) % 4:
            data.append(0)
        v = {'buffer': 0, 'byteOffset': len(data), 'byteLength': arr.nbytes}
        if target:
            v['target'] = target
        if stride:
            v['byteStride'] = stride
        data.extend(arr.tobytes())
        views.append(v)
        return len(views) - 1

    def accessor(view, ct, count, typ, normalized=False, mn=None, mx=None):
        a = {'bufferView': view, 'componentType': ct, 'count': count, 'type': typ}
        if normalized:
            a['normalized'] = True
        if mn is not None:
            a['min'], a['max'] = mn, mx
        accessors.append(a)
        return len(accessors) - 1

    nye = []
    for mat, pos, nor, uv, idx in prims:
        n = len(pos)
        q = np.round((pos - midt) / skala * 32767).clip(-32767, 32767).astype(np.int16)
        q4 = np.zeros((n, 4), np.int16)
        q4[:, :3] = q
        a_pos = accessor(tilføj(q4, 34962, 8), 5122, n, 'VEC3', True,
                         [int(x) for x in q.min(0)], [int(x) for x in q.max(0)])  # (rå heltal, som glTF kræver)
        nn = nor / np.maximum(np.linalg.norm(nor, axis=1, keepdims=True), 1e-9)
        n4 = np.zeros((n, 4), np.int16)
        n4[:, :3] = np.round(nn * 32767).clip(-32767, 32767)
        a_nor = accessor(tilføj(n4, 34962, 8), 5122, n, 'VEC3', True)
        u = np.round(uv * 65535).clip(0, 65535).astype(np.uint16)
        a_uv = accessor(tilføj(u, 34962, 4), 5123, n, 'VEC2', True)
        a_idx = accessor(tilføj(idx.astype(np.uint16), 34963), 5123, len(idx), 'SCALAR')
        nye.append({'attributes': {'POSITION': a_pos, 'NORMAL': a_nor, 'TEXCOORD_0': a_uv}, 'indices': a_idx, 'material': mat})

    # ---- Teksturerne: én gang hver, som WebP ----
    billeder, kendt, tex_kilde = [], {}, []
    normal = {m['normalTexture']['index'] for m in j['materials'] if 'normalTexture' in m}
    for ti, t in enumerate(j['textures']):
        im = j['images'][t['source']]
        bv = j['bufferViews'][im['bufferView']]
        rå = b[bv.get('byteOffset', 0): bv.get('byteOffset', 0) + bv['byteLength']]
        if rå not in kendt:
            img = Image.open(io.BytesIO(rå))
            alfa = img.mode == 'RGBA' and np.asarray(img)[..., 3].min() < 255
            img = img.convert('RGBA' if alfa else 'RGB')
            f = io.BytesIO()
            img.save(f, 'WEBP', quality=KVALITET_N if ti in normal else KVALITET, method=6)
            navn = os.path.splitext(im.get('name', f'tekstur{ti}'))[0]
            r = io.BytesIO()
            lille = img.resize((min(RESERVE, img.width), min(RESERVE, img.height)), Image.LANCZOS)
            lille.save(r, 'PNG' if alfa else 'JPEG', **({'optimize': True} if alfa else {'quality': 85}))
            kendt[rå] = (len(billeder), len(billeder) + 1)
            billeder.append({'bufferView': tilføj(np.frombuffer(f.getvalue(), np.uint8)), 'mimeType': 'image/webp', 'name': navn})
            billeder.append({'bufferView': tilføj(np.frombuffer(r.getvalue(), np.uint8)),
                             'mimeType': 'image/png' if alfa else 'image/jpeg', 'name': navn + '-reserve'})
        tex_kilde.append(kendt[rå])
    # Teksturer, der viser det samme billede, slås sammen
    tex = []
    tex_nr = {}
    for ti, kilde in enumerate(tex_kilde):
        if kilde not in tex_nr:
            tex_nr[kilde] = len(tex)
            tex.append({'source': kilde[1], 'extensions': {'EXT_texture_webp': {'source': kilde[0]}}})
    ny_tex = [tex_nr[k] for k in tex_kilde]
    materialer = json.loads(json.dumps(j['materials']))
    for m in materialer:
        for nøgle in ('normalTexture',):
            if nøgle in m:
                m[nøgle]['index'] = ny_tex[m[nøgle]['index']]
        pbr = m.get('pbrMetallicRoughness', {})
        if 'baseColorTexture' in pbr:
            pbr['baseColorTexture']['index'] = ny_tex[pbr['baseColorTexture']['index']]

    while len(data) % 4:
        data.append(0)
    gltf = {
        'asset': {'version': '2.0', 'generator': 'AtomLab lav_curiosity.py (fra NASA 24584_Curiosity_static.glb)'},
        'extensionsUsed': ['KHR_mesh_quantization', 'EXT_texture_webp'],
        'extensionsRequired': ['KHR_mesh_quantization'],
        'scene': 0,
        'scenes': [{'nodes': [0]}],
        'nodes': [{'mesh': 0, 'name': 'Curiosity', 'translation': [float(x) for x in midt], 'scale': [skala] * 3}],
        'meshes': [{'name': 'Curiosity', 'primitives': nye}],
        'materials': materialer,
        'textures': tex,
        'images': billeder,
        'accessors': accessors,
        'bufferViews': views,
        'buffers': [{'byteLength': len(data)}],
    }
    js = json.dumps(gltf, separators=(',', ':')).encode()
    js += b' ' * (-len(js) % 4)
    glb = b'glTF' + struct.pack('<II', 2, 12 + 8 + len(js) + 8 + len(data))
    glb += struct.pack('<I', len(js)) + b'JSON' + js + struct.pack('<I', len(data)) + b'BIN\0' + bytes(data)
    open(ud, 'wb').write(glb)
    print(f'{ud}: {len(glb) / 1e6:.2f} MB ({sum(len(p[4]) // 3 for p in prims)} trekanter, {len(alle)} punkter, '
          f'{len(billeder) // 2} teksturer, mål {np.round(høj - lav, 3)} m)')


if __name__ == '__main__':
    mappe = os.path.dirname(os.path.abspath(__file__))
    main(sys.argv[1], os.path.join(mappe, 'landskab', 'curiosity.glb'))
