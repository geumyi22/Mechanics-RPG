# Version Matrix

기준일: 2026-10-03

| Version | 핵심 | 검증/취급 |
|---|---|---|
| v1.4.7 | 사신 대낫 텍스처 승인 기준 | 보존 기준 |
| v1.4.15 | 상점/NPC/햇빛, 보안관 이전 clean baseline | 중요 기준 |
| v1.4.17 | 보안관 통합 FIX | 역사 기준 |
| v1.4.18 | 보안관 FIX2 | 역사 기준 |
| v1.4.19 | 보안관 밸런스 | 역사 기준 |
| **v1.4.20** | 데드아이 VFX/준비 재장전 | **현재 정식 Release / E2E PASS** |
| v1.4.27~36 | 아공간 UI/저장/아이콘 초기 반복 | 개발 이력 |
| v1.4.37 | 전체 바닐라 native renderer 매핑 | 부분 device PASS |
| v1.4.40 | 72-button combined UI | **device FAIL / 사용 금지 이력** |
| v1.4.41 | vanilla chest-like 9×3 레이아웃 | 부분 PASS, inventory binding 실패 |
| v1.4.42 | 9×3 + 실제 inventory/hotbar grid binding | device PASS 범위 |
| v1.4.43 | 스택 수량/확대 상자 UI | device PASS 범위, 깜빡임 존재 |
| v1.4.44 | DDUI no-flicker proof | **device PASS 범위** |
| v1.4.45 | DDUI/chest dual mode | 개발판, 전체 E2E 미완료 |
| **v1.4.46** | native storage item proof | **현재 개발 스냅샷 / device NOT RUN** |

## 정식 v1.4.20 고정값

- BP UUID: `82e0a3d5-8684-4b3b-9f69-4ae303374ac8`
- RP UUID: `824ae8eb-4b6d-486a-92d1-b687a0dac928`
- BP/RP version: `[1,4,20]`
- min engine: `[1,26,50]`
- `@minecraft/server`: `2.9.0`
- `@minecraft/server-ui`: `2.1.0`

## 개발 v1.4.46

- 동일 BP/RP UUID 유지
- BP/RP version: `[1,4,46]`
- min engine: `[1,26,50]`
- `@minecraft/server`: `2.9.0`
- `@minecraft/server-ui`: `2.1.0`
- entry: `scripts/main.js`
- 신규 격리 테스트: `geumyi:subspace_native_test`

API dependency를 “최신”이라는 이유만으로 임의 업그레이드하지 않습니다. 정식 승격은 Bedrock E2E 후에만 진행합니다.
