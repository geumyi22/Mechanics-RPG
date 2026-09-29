# Recovery / Import Report

기준 artifact: `Mechanics_RPG_v1.4.20_DEAD_EYE_VFX_RELOAD_FIX`

## 확보/Import 결과

v1.4.20 패키지를 `source/world/` 아래에 원형 구조로 import했습니다.

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

## GitHub 결과

- `dev` source import: `96812da7e3ef5ab252c75c83dcabe07b502e970e`
- PR: #6
- `main` merge: `8cb172412c92033b970d5aa0ab378af33a02469d`
- CI run #11 dev: PASS
- CI run #12 PR: PASS
- CI run #13 main: PASS
- Issue #1: closed

## 보존 구조

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

이 보고서의 PASS는 **정적/패키징/CI 검사**입니다. 실제 Minecraft Bedrock E2E 실행 결과가 아닙니다.
