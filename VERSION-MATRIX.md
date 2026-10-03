# Version Matrix

기준일: 2026-10-04

| Version | 핵심 | 취급 |
|---|---|---|
| v1.4.7 | 사신 대낫 승인 1인칭 기준 | 보존 기준 |
| v1.4.20 | 데드아이 VFX/준비 재장전 | 첫 GitHub Release / full release-gate E2E PASS |
| v1.4.37 | 아공간 native item renderer | 부분 실기기 확인 |
| v1.4.42 | 9×3 상자형 결합 UI/아이템 렌더 | UI 범위 실기기 PASS |
| v1.4.43 | 스택 수량/확대/빠른 refresh | UI 범위 실기기 PASS |
| v1.4.44 | DDUI 무깜빡임 proof | DDUI 범위 실기기 PASS |
| v1.4.45 | dual UI | 미검증 실험 |
| v1.4.46 | native storage proof | 미검증 실험 / stable 제외 |
| v1.4.47 | DDUI chest bridge | 실기기 실패 / 폐기 |
| **v1.4.48** | 검증된 9×3 상자형 복귀 + SAFE GUARD | **현재 안정화 Release** |

## v1.4.48 manifest 고정값

- BP UUID: `82e0a3d5-8684-4b3b-9f69-4ae303374ac8`
- RP UUID: `824ae8eb-4b6d-486a-92d1-b687a0dac928`
- BP/RP version: `[1,4,48]`
- min engine: `[1,26,50]`
- `@minecraft/server`: `2.9.0`
- `@minecraft/server-ui`: `2.1.0`
- entry: `scripts/main.js`

## Release validation status

- Static/package: PASS
- Exact-package full Bedrock release-gate E2E: NOT RUN
- weapon 3P TEST1~7: release 제외

API dependency는 최신이라는 이유만으로 임의 업그레이드하지 않습니다.
