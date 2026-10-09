# Version Matrix

기준일: 2026-10-04

| Version | 핵심 | 취급 |
|---|---|---|
| v1.4.7 | 사신 대낫 승인 1인칭 기준 | 역사적 보존 기준 |
| v1.4.20 | 데드아이 VFX/준비 재장전 | 첫 GitHub Release / **full release-gate E2E PASS** |
| v1.4.37 | 아공간 native item renderer | 부분 실기기 확인 |
| v1.4.42 | 9×3 상자형 결합 UI/아이템 렌더 | UI 범위 실기기 PASS |
| v1.4.43 | 스택 수량/확대/빠른 refresh | UI 범위 실기기 PASS |
| v1.4.44 | DDUI 무깜빡임 proof | DDUI 범위 실기기 PASS |
| v1.4.45 | dual UI | 미검증 실험 |
| v1.4.46 | native storage proof | 미검증 실험 / release 제외 |
| v1.4.47 | DDUI chest bridge | 실기기 실패 / 폐기 |
| **v1.4.48** | 9×3 상자형 복귀 + SAFE GUARD | **main 공식 소스·기존 정식 Release / full E2E NOT RUN** |
| **v1.4.64** | Hacker Redesign Alpha, 임시 해커 아이콘 5개 | **최신 Pre-release / 정적 PASS / E2E NOT RUN / 버그 가능** |
| Weapon 3P TEST1~28 | 사신/리볼버 3인칭 표시 연구 | **로컬 실험 종료 / 미완료 / release 미포함** |

## v1.4.48 manifest 고정값

- BP UUID: `82e0a3d5-8684-4b3b-9f69-4ae303374ac8`
- RP UUID: `824ae8eb-4b6d-486a-92d1-b687a0dac928`
- BP/RP version: `[1,4,48]`
- min engine: `[1,26,50]`
- `@minecraft/server`: `2.9.0`
- `@minecraft/server-ui`: `2.1.0`
- entry: `scripts/main.js`

## Verification status

### v1.4.48
- Static/package: PASS
- Exact-package full Bedrock release-gate E2E: **NOT RUN**
- 따라서 “안정화 검증 완료”로 표기하지 않음

### v1.4.20
- Full release-gate Bedrock E2E: **PASS**
- 현재 저장소에서 마지막 full-E2E 검증 기준

API dependency는 최신이라는 이유만으로 임의 업그레이드하지 않습니다.

## 2026-10-10 — 별도 채팅 시험 월드 (공식 Release 및 source 미포함)
| 실험 | 취급 |
|---|---|
| Nature v2.4 + RPG v1.4.100 / Spawn v0.1.2 | 지형 후속 실험 입력으로 승인되었던 로컬 테스트 기준 |
| Medieval Village v3 STAGE 1/2 | 자동 건축 시험, 최종 미승인 |
| Side Nature v1~v4 | 자연 지형 시험, v4 포함 미승인 |

위 산출물은 **v1.4.48 SOURCE-MANIFEST 기준을 대체하지 않습니다**. [현재 월드 상태](docs/CURRENT-WORLD-WORK.md).

## v1.4.64 실험 Pre-release 기준
- Tag: [`v1.4.64`](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.64), 별도 `release/v1.4.64-preview` 브랜치에서 빌드.
- BP/RP version `[1,4,64]`, 해커 기능/리볼버 위치 실험 코드 포함. 정식 `main` v1.4.48을 대체하지 않음.
- 누락된 해커 PNG 5개 추가, 누락/불일치된 소스 매니페스트 재생성 및 정적/패키지 검사 PASS.
- Bedrock E2E는 사용자 정책에 따라 선택사항으로 두어 **NOT RUN**, 알려지지 않은 버그가 존재할 수 있음.
