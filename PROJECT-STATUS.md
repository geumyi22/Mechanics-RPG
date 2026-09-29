# Project Status

기준일: 2026-09-29

## GitHub bootstrap

**상태: 완료 / handoff ready**

- Repository: `geumyi22/Mechanics-RPG`
- Visibility: Public
- Default branch: `main`
- Development branch: `dev`
- v1.4.20 source baseline: main import 완료
- CI: 실제 source 기준 PASS
- deterministic package / verify: 완료
- Release workflow: tag ↔ manifest version guard 포함
- Issue / PR templates: 구성 완료
- Handoff / development / rollback 문서: 구성 완료
- First GitHub Release: **v1.4.20 published**

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
Bedrock release-gate E2E: PASS
Release workflow: PASS
GitHub Release: PUBLISHED
```

Source import:
- PR #6
- main merge: `8cb172412c92033b970d5aa0ab378af33a02469d`
- Issue #1: closed

GitHub bootstrap finalization:
- PR #7
- main commit used for v1.4.20 release: `69b742384fb28a14680b087000f0b76563cb38d0`

Release:
- tag: `v1.4.20`
- Release workflow run: #1
- Release URL: https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.20
- release asset SHA-256: `a4d099cb419cdda1da68ed734406a7a2885a6c72565ba10e6d2d9741fe0ced70`

## Bedrock E2E

실제 Bedrock에서 8개 핵심 release-gate 항목을 사용자 확인으로 PASS 처리했습니다.

- import / world open
- BP/RP / startup Script error
- class/level test access
- Sheriff revolver
- Sheriff Dead Eye / purple VFX
- Reaper first-person scythe preservation
- quest/shop villager UI
- save/re-enter

Issue #5는 이 **v1.4.20 release-gate E2E** 기준으로 완료 처리했습니다.

## Development backlog

다음 항목은 **기록만 유지하고 현재 작업에서는 진행하지 않습니다.**

- #2 bounty target marker
- #3 Dead Eye homing bullets
- #4 sheriff ammo UX

## Boundary

v1.4.20은 release-gate E2E를 통과한 첫 GitHub Release입니다. 이는 모든 직업/멀티플레이/역사적 조합에 대한 exhaustive regression을 의미하지 않습니다.

다음 개발이 시작되면 한 버전 작업 안에서 source + CHANGELOG + VERSION-MATRIX + CI + package + E2E + Release를 함께 갱신합니다.
