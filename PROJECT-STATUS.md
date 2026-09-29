# Project Status

기준일: 2026-09-29

## GitHub

- Repository: `geumyi22/Mechanics-RPG`
- Visibility: Public
- Default branch: `main`
- Development branch: `dev`
- v1.4.20 source baseline: **main import 완료**
- CI workflow: **실제 source 기준 PASS**
- Release workflow: configured
- Issue / PR templates: configured

## v1.4.20 verification

```text
Files: 257
JSON: 84 PASS
JavaScript: 7 PASS (GitHub Actions Node 22)
Item texture entries: 52 PASS
Particle JSON: 3 PASS
PNG: 93 PASS
SOURCE-MANIFEST: 257 PASS
ZIP CRC: PASS
Re-extracted file hashes: 257/257 MATCH
Generated .zip/.mcworld: BYTE-IDENTICAL
GitHub CI dev push: PASS (#11)
GitHub CI PR: PASS (#12)
GitHub CI main: PASS (#13)
Bedrock E2E: NOT RUN
```

## Source state

`source/world/`에 v1.4.20 baseline 257개 파일을 보존합니다.

Merge:
- PR #6
- main merge commit: `8cb172412c92033b970d5aa0ab378af33a02469d`

Tracking:
- #1 v1.4.20 source baseline import — closed
- #2 bounty target marker
- #3 Dead Eye homing bullets
- #4 sheriff ammo UX
- #5 first full Bedrock E2E

## Important

정적/패키징/CI 검증은 완료됐지만 **실제 Minecraft Bedrock E2E는 아직 실행하지 않았습니다.**
