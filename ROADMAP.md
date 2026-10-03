# Mechanics RPG Roadmap

기준일: 2026-10-04

## 완료

- 독립 GitHub 저장소/CI/Release workflow 구축
- v1.4.20 첫 정식 Release + release-gate E2E
- v1.4.27~43 Subspace UI 연구/수렴
- v1.4.48 검증된 9×3 상자형 경로 복귀
- v1.4.48 SAFE GUARD: 위험 아이템/셜커 저장 차단
- source/static/package 검증 체계 유지

## 현재 안정화 기준

- `main`: v1.4.48 SAFE GUARD stable
- source: `source/world/`
- manifest: `SOURCE-MANIFEST.json`
- 3인칭 무기 실험은 stable 제외

## 다음 개발

1. v1.4.48 exact-package Bedrock release-gate 회귀 E2E
2. 무기 3인칭 — 기존 1인칭 완전 고정 + third-person/rightItem만 조정
3. Subspace 특수 데이터 무손실 저장은 별도 proof에서만 연구
4. 신규 기능은 stable과 분리된 feature branch에서 진행

## 금지

- E2E 없이 완료 선언
- v3 Subspace 키 삭제
- 승인된 사신 대낫/리볼버 1인칭 임의 변경
- Subspace 작업 때문에 Sheriff/Reaper/quest/shop 전체 재작성
