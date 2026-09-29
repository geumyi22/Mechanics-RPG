#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, shutil, sys, zipfile

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/"source"/"world"

if len(sys.argv)!=2:
    raise SystemExit("usage: python tools/import_baseline.py <baseline.zip|baseline.mcworld>")

src=Path(sys.argv[1]).expanduser().resolve()
if not src.is_file():
    raise SystemExit(f"not found: {src}")

if DEST.exists():
    shutil.rmtree(DEST)
DEST.mkdir(parents=True)

with zipfile.ZipFile(src) as zf:
    bad=zf.testzip()
    if bad:
        raise SystemExit(f"CRC failed: {bad}")
    zf.extractall(DEST)

files=[]
for p in sorted(DEST.rglob("*")):
    if p.is_file():
        b=p.read_bytes()
        files.append({
            "path":p.relative_to(DEST).as_posix(),
            "size":len(b),
            "sha256":hashlib.sha256(b).hexdigest(),
        })

bp=DEST/"behavior_packs"/"Mechanics_RPG"/"manifest.json"
version=None
if bp.exists():
    j=json.loads(bp.read_text(encoding="utf-8"))
    version=".".join(map(str,j["header"]["version"]))

manifest={
    "project":"Mechanics RPG",
    "baseline_version":version,
    "baseline_artifact":src.name,
    "source_root":"source/world",
    "file_count":len(files),
    "files":files,
}
(ROOT/"SOURCE-MANIFEST.json").write_text(
    json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8"
)
print(f"imported {len(files)} files")
print(f"version={version}")
