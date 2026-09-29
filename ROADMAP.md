# Mechanics RPG — ROADMAP

기준일: 2026-09-29

| 단계 | 목표 | 상태 |
|---|---|---|
| 1 | 독립 GitHub 저장소 생성 및 기본 문서/정책 정리 | 진행 중 |
| 2 | v1.4.20 기준 소스 import 및 파일 구조 확정 | 예정 |
| 3 | JSON/JS/manifest/resource 자동 정적 검증 구축 | 예정 |
| 4 | 패키징 도구 및 `.mcworld` / `.zip` 재현성 검증 | 예정 |
| 5 | 현상수배 머리 위 픽셀 마커 정리 | 예정 |
| 6 | 데드아이 실제 추적 유도탄 구현 | 예정 |
| 7 | 보안관 탄약 보관/소모 UX 개선 | 예정 |
| 8 | 기존 직업/상점/퀘스트/몬스터 회귀 테스트 | 예정 |
| 9 | 실제 Bedrock E2E 체크리스트 기반 검증 | 예정 |
| 10 | GitHub Release 및 버전 문서 체계 마감 | 예정 |

## 1단계 — 저장소 기반

목표:
- 메크닉스 RPG를 Geumyi Minecraft System과 완전히 분리
- README / ROADMAP / CHANGELOG / VERSION-MATRIX / TESTING / SECURITY 기준 작성
- 바이너리 릴리스와 소스 트리를 분리

완료 조건:
- 기본 문서가 `main`에 존재
- 최신 기준과 E2E 상태가 명시
- 소스 import 전후를 구분할 수 있음

## 2단계 — v1.4.20 소스 import

현재 최신 패키징 기준은 `v1.4.20_DEAD_EYE_VFX_RELOAD_FIX`입니다.

import 시 우선 확인:
- Behavior Pack / Resource Pack manifest
- 월드의 BP/RP 연결
- JavaScript entrypoint 및 sheriff/core/skills/shop/sunlight 등 핵심 스크립트
- item texture 연결
- custom particle / entity / render controller
- 테스트 function
- 패키지 내부 중복/누락

**기존 파일을 GitHub 구조에 맞추기 위해 무리하게 재배치하지 않습니다.** 먼저 원형을 보존한 import를 만든 뒤 구조 개선 여부를 판단합니다.

## 3~4단계 — 자동 검증/패키징

정적 자동화 목표:
- 모든 JSON parse
- 모든 JS syntax check
- manifest dependency/version 연결
- item texture → PNG 존재 여부
- particle texture 연결
- world BP/RP UUID/version 연결
- ZIP CRC
- 재추출 후 파일 수/해시 비교
- SHA-256 기록

GitHub Actions는 실제 소스 구조가 확정된 뒤 추가합니다.

## 5단계 — 현상수배 마커

목표:
- 기존 과도한 불/반짝이 대신 대상 머리 위 픽셀 현상수배 마커
- 플레이 중 식별 가능한 크기와 위치
- 다른 파티클 연출과 충돌하지 않게 구성

사용자 승인 픽셀 이미지를 기준으로 구현합니다.

## 6단계 — 데드아이 유도탄

현재 요구:
- 보라색 데드아이 탄환 연출 유지
- 실제 탄환이 이동하며 매 틱 대상 위치를 추적
- 6발 각각 독립 추적
- 대상 이동 시 탄환 방향 보정
- 벽 관통 금지
- 대상 사망/무효화 시 안전 종료
- 기존 데드아이 준비 재장전/연출과 호환

## 7단계 — 탄약 UX

현재 문제:
- 탄약 제작은 쉬워도 인벤토리 점유가 큼
- 일반 사격/속사로 소비가 빠름

후보:
- 탄약 벨트/탄약통
- 다발 탄약 아이템
- 기존 6발 실린더 장전 구조는 유지

최종 구현은 밸런스와 인벤토리 UX를 비교한 뒤 확정합니다.

## E2E 원칙

GitHub Actions/정적 검사가 통과해도 실제 Bedrock에서 플레이 검증하지 않았다면 단계 완료로 기록하지 않습니다.
