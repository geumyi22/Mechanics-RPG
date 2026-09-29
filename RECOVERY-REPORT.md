# Recovery / Import Report

기준 artifact: `Mechanics_RPG_v1.4.20_DEAD_EYE_VFX_RELOAD_FIX`

## 현재 확보 상태

로컬 작업 환경에서 v1.4.20 패키지를 압축 해제해 전체 구조를 점검했습니다.

- 총 파일: **257**
- JSON: **84**
- JavaScript: **7**
- item texture entries: **52**
- custom particle JSON: **3**
- PNG: **93**
- BP/RP/world version: **1.4.20**
- ZIP CRC: PASS
- 재추출 후 257개 파일 hash 일치: PASS
- 재패키징한 `.zip` / `.mcworld` byte-identical: PASS

## GitHub import 방식

원본 월드 구조를 `source/world/` 아래에 그대로 보존합니다.

```text
source/world/
├─ behavior_packs/
├─ resource_packs/
├─ level.dat
├─ level.dat_old
├─ levelname.txt
├─ world_behavior_packs.json
└─ world_resource_packs.json
```

GitHub용이라는 이유로 pack 내부 경로를 임의로 재배치하지 않습니다.

## 경계

이 보고서의 PASS는 **정적/패키징 검사**입니다. 실제 Minecraft Bedrock E2E 실행 결과가 아닙니다.
