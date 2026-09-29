# Changelog

## 2026-09-29 — v1.4.20 first GitHub Release

- 실제 Bedrock release-gate E2E 8개 핵심 항목 PASS
- E2E 대상은 GitHub CI #31이 생성한 정확한 `.mcworld`
- release candidate SHA-256: `a4d099cb419cdda1da68ed734406a7a2885a6c72565ba10e6d2d9741fe0ced70`
- main commit `69b742384fb28a14680b087000f0b76563cb38d0` 기준 release
- tag `v1.4.20` 생성
- Release workflow에서 validate / package / verify / tag-version guard / checksum / publish 전부 PASS
- GitHub Release에 `.mcworld`, `.zip`, `SHA256SUMS.txt` 게시
- Issue #5를 v1.4.20 release-gate E2E 완료로 종료
- 신규 게임 아이디어는 이번 Release에 포함하지 않음

## 2026-09-29 — v1.4.20 GitHub baseline import complete

- v1.4.20 `DEAD_EYE_VFX_RELOAD_FIX` 원본 월드 257개 파일을 `source/world/`에 import
- `SOURCE-MANIFEST.json`으로 전체 파일 SHA-256 추적
- dev push / PR #6 / main merge 전 과정에서 GitHub Actions 검증
- JSON 84 / JS 7 / item texture 52 / particle 3 / PNG 93 검증
- 결정적 `.zip` / `.mcworld` 패키징 및 CRC/재추출 hash 검증
- Issue #1 source baseline import 완료 처리

## 2026-09-29 — GitHub repository bootstrap

- 독립 `geumyi22/Mechanics-RPG` 저장소 생성 및 문서 체계 구성
- import/validate/package/verify 도구 추가
- GitHub CI/Release workflow 기반 추가
- main/dev 및 Issue/PR 운영 체계 추가
- Static / Mock / Bedrock E2E 상태 분리

## v1.4.20 — DEAD EYE VFX / RELOAD FIX

- 데드아이 보라색 총알/탄도 연출 유지
- 카메라 전부터 초록/노랑 확산 연출
- 준비시간 동안 6/6 자동 재장전
- 궁극기 준비 재장전은 일반 탄약 미소비
- 데드아이 30 피해/발 기준
- **첫 GitHub 정식 Release**

## v1.4.19 — SHERIFF BALANCE FIX

- 일반 리볼버 기본 피해 10
- 최소 사거리 30 / 정지 조준 최대 70
- 데드아이 30 피해/발
- 파티클 및 연속 명중 로직 보강

## v1.4.18 — SHERIFF FIX2

- 리볼버/헤드샷/탄약/스킬 연동 보강
- 일반 사격속도와 속사 분리
- 스킬 아이콘/파티클 개선

## v1.4.17 — SHERIFF FIX

- v1.4.15 clean baseline에서 보안관 직업 통합
- 기존 레벨/스킬/다른 직업 구조 유지 원칙 확립

## v1.4.15

- 이후 보안관 작업의 clean baseline
- 상점/NPC/햇빛 관련 작업 포함
