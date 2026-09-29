#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, shutil, subprocess, sys

ROOT=Path(__file__).resolve().parents[1]
WORLD=ROOT/"source"/"world"
BP=WORLD/"behavior_packs"/"Mechanics_RPG"
RP=WORLD/"resource_packs"/"Mechanics_RPG_Resources"
errors=[]

def fail(x): errors.append(x)
def load(p):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        fail(f"JSON: {p.relative_to(ROOT)}: {e}")
        return None

if not WORLD.exists():
    raise SystemExit("source/world missing: run tools/import_baseline.py first")

jsons=list(WORLD.rglob("*.json"))
for p in jsons:
    load(p)
print(f"[PASS] JSON: {len(jsons)}")

js=list(BP.rglob("*.js"))
node=shutil.which("node")
if node:
    for p in js:
        r=subprocess.run([node,"--check",str(p)],capture_output=True,text=True)
        if r.returncode:
            fail(f"JS: {p.relative_to(ROOT)}: {r.stderr.strip()}")
    print(f"[PASS] JS: {len(js)}")
else:
    print("[WARN] node missing; JS syntax skipped")

bpm=load(BP/"manifest.json")
rpm=load(RP/"manifest.json")
wbp=load(WORLD/"world_behavior_packs.json")
wrp=load(WORLD/"world_resource_packs.json")

if bpm and rpm and wbp and wrp:
    bv=bpm["header"]["version"]
    rv=rpm["header"]["version"]
    bid=bpm["header"]["uuid"]
    rid=rpm["header"]["uuid"]
    if not any(x.get("pack_id")==bid and x.get("version")==bv for x in wbp):
        fail("world BP linkage mismatch")
    if not any(x.get("pack_id")==rid and x.get("version")==rv for x in wrp):
        fail("world RP linkage mismatch")
    dep=[x for x in bpm.get("dependencies",[]) if x.get("uuid")==rid]
    if not dep or dep[0].get("version")!=rv:
        fail("BP->RP dependency mismatch")
    print("[PASS] BP/RP/world linkage")

item=load(RP/"textures"/"item_texture.json")
if item:
    missing=[]
    for key,e in item.get("texture_data",{}).items():
        t=e.get("textures") if isinstance(e,dict) else None
        vals=t if isinstance(t,list) else [t]
        for rel in vals:
            if isinstance(rel,str) and not (RP/(rel+".png")).exists():
                missing.append((key,rel))
    if missing:
        fail(f"missing item textures: {missing[:20]}")
    print(f"[PASS] item texture entries: {len(item.get('texture_data',{}))}")

pmiss=[]
particles=list((RP/"particles").glob("*.json")) if (RP/"particles").exists() else []
for p in particles:
    j=load(p) or {}
    tex=j.get("particle_effect",{}).get("description",{}).get("basic_render_parameters",{}).get("texture")
    if isinstance(tex,str) and not (RP/(tex+".png")).exists():
        pmiss.append((p.name,tex))
if pmiss:
    fail(f"missing particle textures: {pmiss}")
print(f"[PASS] particle JSON: {len(particles)}")

pngs=list(RP.rglob("*.png"))
bad=[p for p in pngs if p.read_bytes()[:8]!=b"\x89PNG\r\n\x1a\n"]
if bad:
    fail(f"bad PNG: {[str(x.relative_to(ROOT)) for x in bad[:20]]}")
print(f"[PASS] PNG: {len(pngs)}")

mf=ROOT/"SOURCE-MANIFEST.json"
if mf.exists():
    j=load(mf)
    if j:
        listed={x["path"]:x for x in j["files"]}
        actual={p.relative_to(WORLD).as_posix():p for p in WORLD.rglob("*") if p.is_file()}
        if set(listed)!=set(actual):
            fail("SOURCE-MANIFEST path set mismatch")
        else:
            for rel,p in actual.items():
                b=p.read_bytes()
                if listed[rel]["size"]!=len(b) or listed[rel]["sha256"]!=hashlib.sha256(b).hexdigest():
                    fail(f"SOURCE-MANIFEST hash mismatch: {rel}")
                    break
        print(f"[PASS] SOURCE-MANIFEST: {len(actual)}")

if errors:
    for x in errors:
        print("[FAIL]",x,file=sys.stderr)
    raise SystemExit(1)
print("[PASS] Mechanics RPG static validation")
