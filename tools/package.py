#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, shutil, zipfile

ROOT=Path(__file__).resolve().parents[1]
WORLD=ROOT/"source"/"world"
DIST=ROOT/"dist"

if not WORLD.exists():
    raise SystemExit("source/world missing")

bp=json.loads((WORLD/"behavior_packs"/"Mechanics_RPG"/"manifest.json").read_text(encoding="utf-8"))
ver=".".join(map(str,bp["header"]["version"]))
DIST.mkdir(exist_ok=True)

zp=DIST/f"Mechanics_RPG_v{ver}.zip"
mp=DIST/f"Mechanics_RPG_v{ver}.mcworld"

def info(rel):
    z=zipfile.ZipInfo(rel)
    z.date_time=(1980,1,1,0,0,0)
    z.compress_type=zipfile.ZIP_DEFLATED
    z.external_attr=0o100644 << 16
    return z

with zipfile.ZipFile(zp,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(WORLD.rglob("*")):
        if p.is_file():
            z.writestr(info(p.relative_to(WORLD).as_posix()),p.read_bytes())

shutil.copyfile(zp,mp)
print(zp)
print(mp)
print("sha256="+hashlib.sha256(zp.read_bytes()).hexdigest())
