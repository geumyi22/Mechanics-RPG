# Project Status

기준일: 2026-10-04

## Stable baseline

- Repository: `geumyi22/Mechanics-RPG`
- Stable baseline: **v1.4.48 SAFE GUARD**
- Source root: `source/world/`
- Source files: **294**
- Static validation: **PASS**
- deterministic package / CRC / re-extracted hashes: **PASS**
- exact-package full Bedrock release-gate E2E: **NOT RUN**

## v1.4.48 scope

### Included
- 9×3 / 27-slot chest-style Subspace
- v3 head/stage/journal preservation
- historical 36-slot array + safe overflow migration
- unsafe metadata-bearing item block
- Shulker/Bundle block
- sheriff bullet/bundle safe custom-stack exception
- existing RPG systems and approved first-person weapons preserved

### Excluded
- Subspace native-storage proof from v1.4.46
- DDUI/native bridge experiments v1.4.44~47
- weapon third-person TEST1~7

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

## Development state

- v1.4.46 native-storage proof는 개발 이력으로 보존하며 stable에 포함하지 않습니다.
- 무기 3인칭은 TEST6에서 **기존 1인칭을 건드리지 않는 player third-person/rightItem 접근**까지 확인했으나, 3인칭 위치/각도는 미완성입니다.
- 다음 작업은 stable v1.4.48에서 별도 feature branch로 시작합니다.
