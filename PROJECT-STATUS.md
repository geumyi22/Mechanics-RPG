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
- deterministic package / verify: 구성 완료
- Release workflow: tag ↔ manifest version guard 포함
- Issue / PR templates: 구성 완료
- Handoff / development / rollback 문서: 구성 완료

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
Bedrock E2E: NOT RUN
```

Source import:
- PR #6
- main merge: `8cb172412c92033b970d5aa0ab378af33a02469d`
- Issue #1: closed

## Development backlog

다음 항목은 **기록만 유지하고 현재 작업에서는 진행하지 않습니다.**

- #2 bounty target marker
- #3 Dead Eye homing bullets
- #4 sheriff ammo UX
- #5 first full Bedrock E2E

## Boundary

현재 단계에서 게임 source는 v1.4.20 기준으로 동결합니다. 다음 개발이 시작되면 한 버전 작업 안에서 source + CHANGELOG + VERSION-MATRIX + CI + package를 함께 갱신합니다.
