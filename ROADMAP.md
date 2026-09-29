# Mechanics RPG — GitHub Bootstrap / Handoff Roadmap

기준일: 2026-09-29

| 단계 | 목표 | 상태 |
|---|---|---|
| 1 | 독립 저장소 생성 | 완료 |
| 2 | 문서 / 보안 / 버전 기준 | 완료 |
| 3 | v1.4.20 원본 분석 및 정적 검증 | 완료 |
| 4 | import / validate / package / verify 도구 | 완료 |
| 5 | GitHub Actions CI | 완료 |
| 6 | Release workflow + version guard | 완료 |
| 7 | main/dev + Issue/PR 운영 흐름 | 완료 |
| 8 | v1.4.20 source tree import | 완료 — PR #6 |
| 9 | 개발/rollback/handoff 문서 | 완료 |
| 10 | GitHub 초기 구축 마감 | 완료 — PR #7 |
| 11 | v1.4.20 Bedrock release-gate E2E | **PASS — Issue #5** |
| 12 | 첫 정식 GitHub Release | **완료 — v1.4.20** |

## 현재 기준

- `main`: 승인된 v1.4.20 source + GitHub 인프라
- `dev`: 다음 개발 통합 브랜치
- source: `source/world/`
- manifest: `SOURCE-MANIFEST.json`
- CI: source가 없으면 fail-closed
- Release: tag와 BP manifest version이 다르면 실패
- Release URL: https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.20

## v1.4.20 E2E / Release

- 실제 Bedrock release-gate E2E 8개 항목 PASS
- tag `v1.4.20`
- Release workflow PASS
- `.mcworld`, `.zip`, `SHA256SUMS.txt` 게시
- release asset SHA-256: `a4d099cb419cdda1da68ed734406a7a2885a6c72565ba10e6d2d9741fe0ced70`

## 보류된 개발 backlog

현재 GitHub 마감 작업에서는 아래 기능을 진행하지 않습니다.

- #2 현상수배 마커
- #3 데드아이 실제 유도탄
- #4 보안관 탄약 UX

다음 개발 단계에서 요구사항 확정 후 별도 브랜치로 진행합니다.

## 새 버전 기본 흐름

`feature/fix → dev → CI → Bedrock E2E → main → matching tag → Release`

세부 절차: `docs/DEVELOPMENT-WORKFLOW.md`
