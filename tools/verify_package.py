#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, tempfile, zipfile

ROOT=Path(__file__).resolve().parents[1]
WORLD=ROOT/"source"/"world"
DIST=ROOT/"dist"

bp=json.loads((WORLD/"behavior_packs"/"Mechanics_RPG"/"manifest.json").read_text(encoding="utf-8"))
ver=".".join(map(str,bp["header"]["version"]))
zp=DIST/f"Mechanics_RPG_v{ver}.zip"
mp=DIST/f"Mechanics_RPG_v{ver}.mcworld"

if not zp.exists() or not mp.exists():
    raise SystemExit("package files missing; run tools/package.py")
if zp.read_bytes()!=mp.read_bytes():
    raise SystemExit("zip/mcworld bytes differ")

actual={p.relative_to(WORLD).as_posix():p for p in WORLD.rglob("*") if p.is_file()}

with zipfile.ZipFile(zp) as z:
    bad=z.testzip()
    if bad:
        raise SystemExit(f"CRC failed: {bad}")
    names={x.filename for x in z.infolist() if not x.is_dir()}
    if names!=set(actual):
        raise SystemExit("archive file set mismatch")
    with tempfile.TemporaryDirectory() as td:
        z.extractall(td)
        for rel,p in actual.items():
            a=hashlib.sha256(p.read_bytes()).digest()
            b=hashlib.sha256((Path(td)/rel).read_bytes()).digest()
            if a!=b:
                raise SystemExit(f"hash mismatch: {rel}")

print(f"[PASS] package CRC/files/hashes: {len(actual)}")
print("[PASS] zip/mcworld byte-identical")
