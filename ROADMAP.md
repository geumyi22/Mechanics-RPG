# Mechanics RPG — One-Day GitHub Sprint

기준일: 2026-09-29

| 단계 | 목표 | 상태 |
|---|---|---|
| 1 | 독립 저장소 생성 | 완료 |
| 2 | README / CHANGELOG / VERSION / TESTING / SECURITY 기반 | 완료 |
| 3 | 로컬 v1.4.20 원본 분석 및 정적 검증 | 완료 |
| 4 | import / validate / package / verify 도구 | 완료 |
| 5 | GitHub Actions CI / tag Release workflow | 구성 완료 |
| 6 | `dev` 브랜치 및 Issue/PR 운영 흐름 | 완료 |
| 7 | v1.4.20 실제 source tree import | **대기 — #1** |
| 8 | 현상수배 픽셀 마커 | 예정 — #2 |
| 9 | 데드아이 실제 이동형 유도탄 | 예정 — #3 |
| 10 | 탄약 UX 개선 | 예정 — #4 |
| 11 | 전체 Bedrock 회귀 E2E | 예정 — #5 |
| 12 | 첫 정식 GitHub Release | 예정 |

## 현재 GitHub 기반

구성 완료:
- `main`
- `dev`
- CI workflow
- tag Release workflow
- baseline import utility
- static validator
- deterministic packager
- package verifier
- PR template
- bug / feature issue template
- line-ending / binary asset policy

## 이미 확인한 v1.4.20 정적 기준

로컬 패키지 기준:
- 총 파일 257
- JSON 84개 parse 성공
- JavaScript 7개 `node --check` 성공
- item texture 52개 경로 확인
- custom particle 3개 경로 확인
- PNG 93개 signature 확인
- ZIP CRC 성공
- 재추출 후 257개 파일 SHA-256 일치
- 생성한 `.zip` / `.mcworld` byte-identical

이 결과는 **실제 Bedrock E2E가 아닙니다.**

## GitHub Issues

- #1 — v1.4.20 source baseline import
- #2 — 현상수배 머리 위 픽셀 마커
- #3 — 데드아이 실제 유도탄
- #4 — 보안관 탄약 UX
- #5 — 첫 GitHub Release 전 전체 Bedrock E2E

## 브랜치 계획

- `main`: 기준/검증 인프라
- `dev`: 통합 개발
- `feature/bounty-marker`
- `feature/deadeye-homing`
- `feature/sheriff-ammo`
- `fix/*`: 재현 버그 단위

## 최종 완료 조건

- 최신 source tree가 GitHub에서 browse 가능
- CI가 실제 GitHub Actions에서 source까지 검증해 통과
- 동일 source에서 `.mcworld` / `.zip` 생성 가능
- Release checksum 생성
- 실제 Bedrock에서 핵심 직업/시스템 회귀 테스트
- E2E 결과를 릴리스 노트에 분리 기록
