# Mechanics RPG — Roadmap

기준일: 2026-10-03

## 완료된 GitHub 기반

| 단계 | 목표 | 상태 |
|---|---|---|
| 1 | 독립 저장소 / main/dev | 완료 |
| 2 | 문서 / 보안 / 버전 기준 | 완료 |
| 3 | import / validate / package / verify | 완료 |
| 4 | GitHub Actions CI / Release guard | 완료 |
| 5 | v1.4.20 source import | 완료 |
| 6 | v1.4.20 Bedrock release-gate E2E | **PASS** |
| 7 | 첫 정식 GitHub Release | **v1.4.20 완료** |

## 현재 개발 — Subspace

| 단계 | 목표 | 상태 |
|---|---|---|
| A | 9×3 상자형 UI | v1.4.42~43 device 확인 |
| B | 스택 수량 / 실제 inventory/hotbar 렌더 | device 확인 |
| C | DDUI no-flicker proof | **v1.4.44 device 확인** |
| D | chest/DDUI dual mode | v1.4.45 개발판 |
| E | native storage item proof | **v1.4.46 — device test 대기** |
| F | 최종 아공간 UX 결정 | 보류 — E 결과 후 |
| G | 전체 RPG 회귀 E2E | 미실행 |
| H | dev → main / tag / Release | **E2E 전 금지** |

## v1.4.46 다음 테스트

1. `/scriptevent geumyi:subspace_native_test give`
2. 테스트 아이템 네이티브 보관 UI 확인
3. 조약돌 등 테스트 스택 넣기/빼기
4. ActionForm식 전체 화면 재오픈 깜빡임 여부
5. 27칸 표시
6. 재접속/월드 재시작 유지
7. `inspect`에서 내부 container 확인
8. 기존 `geumyi:subspace` v3 데이터 불변 확인

## 정식 개발 흐름

`feature/fix → dev → CI → Bedrock E2E → main → matching tag → Release`

세부 절차: [docs/DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md)
