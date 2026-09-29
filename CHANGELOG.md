# Changelog

## 2026-09-29 — GitHub repository bootstrap

- 독립 `geumyi22/Mechanics-RPG` 저장소 생성 및 문서 체계 구성
- v1.4.20 패키지를 로컬에서 전수 분석
- 257개 파일 기준 정적 manifest 생성
- JSON 84 / JS 7 / item texture 52 / particle 3 / PNG 93 검증
- 결정적 패키징 스크립트 설계
- ZIP CRC / 재추출 해시 / .zip-.mcworld byte 일치 검증
- GitHub CI/Release/import runbook 기반 정리
- Static / Mock / Bedrock E2E 상태를 명시적으로 분리

## v1.4.20 — DEAD EYE VFX / RELOAD FIX

- 데드아이 보라색 총알/탄도 연출 유지
- 카메라 전부터 초록/노랑 확산 연출
- 준비시간 동안 6/6 자동 재장전
- 궁극기 준비 재장전은 일반 탄약 미소비
- 데드아이 30 피해/발 기준
- 실제 Bedrock E2E는 별도 확인 필요

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
