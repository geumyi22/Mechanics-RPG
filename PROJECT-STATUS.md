# Project Status

기준일: 2026-10-04

## Current release baseline

- Repository: `geumyi22/Mechanics-RPG`
- Latest release/source baseline: **v1.4.48 SAFE GUARD**
- Classification: **latest feature/release baseline; full Bedrock E2E NOT RUN**
- Source root: `source/world/`
- Source files: **294**
- Static validation: **PASS**
- deterministic package / CRC / re-extracted hashes: **PASS**
- exact-package full Bedrock release-gate E2E: **NOT RUN**
- Last full release-gate E2E PASS: **v1.4.20**

## v1.4.48 scope

### Included
- 9×3 / 27-slot chest-style Subspace
- v3 head/stage/journal preservation
- historical 36-slot array + safe overflow migration
- unsafe metadata-bearing item block
- Shulker/Bundle block
- sheriff bullet/bundle safe custom-stack exception
- existing RPG systems and existing first-person weapon render path

### Excluded
- Subspace native-storage proof from v1.4.46
- DDUI/native bridge experiments v1.4.44~47
- weapon third-person TEST1~28

## Verification evidence

```text
Files: 294
JSON: 90 PASS
JavaScript: 9 PASS (Node syntax)
Item texture entries: 54 PASS
RP PNG: 102 PASS
SOURCE-MANIFEST: 294 PASS
ZIP CRC: PASS
Re-extracted file set/hashes: 294/294 MATCH
Generated .zip/.mcworld: BYTE-IDENTICAL
Full v1.4.48 Bedrock release-gate E2E: NOT RUN
```

## Historical E2E

v1.4.20은 실제 Bedrock release-gate E2E 8개 핵심 항목 PASS 기록을 유지합니다.

아공간은 v1.4.42~43에서 9×3 결합 UI/아이템 렌더링/스택 표시 범위의 실기기 확인 기록이 있습니다. 이 기록은 v1.4.48 전체 회귀 E2E와 동일하지 않습니다.

## Weapon third-person experiment status

- TEST1~28: **종료**
- TEST22 계열에서 1인칭 보존 경로는 실기기에서 확인했으나 3인칭 손잡이/손 위치 정렬은 최종 해결하지 못함
- TEST23~28은 위치/회전 튜닝 실험으로 종료
- 어떤 TEST도 `source/world/`, `main`, v1.4.48 Release에 승격하지 않음
- 현재 무기 3인칭 작업 상태: **미완료 / 중단**

## Development state

- v1.4.46 native-storage proof는 개발 이력으로 보존하며 release baseline에 포함하지 않습니다.
- v1.4.48은 최신 릴리즈 베이스지만 full E2E 미실행 상태입니다.
- 다음 변경은 별도 feature branch에서 시작하고, 실제 Bedrock E2E 전에는 안정화 완료로 승격하지 않습니다.

## 2026-10-10 — 월드 시험/게임 릴리스 분리
- 공식 main/source/Release는 **v1.4.48 SAFE GUARD**로 변경 없음. 정확한 패키지 전체 E2E NOT RUN.
- v2.4 자연 지형 + RPG v1.4.100 및 Medieval Village STAGE 1/2, Side Nature v1~v4는 GitHub에 승격하지 않은 채팅 시험 산출물.
- 마을 자동 생성은 품질 미달로 중단되었고 사용자가 직접 마을을 건축합니다.
- Side Nature v4도 불규칙한 고도/거대한 절단면/산 부재 문제로 미승인.
- 현재 작업은 GitHub 문서 및 중복 자료 정리에 한정. [상세 인수인계](docs/CURRENT-WORLD-WORK.md).
