# Mechanics RPG Roadmap

기준일: 2026-10-04

## 완료

- 독립 GitHub 저장소/CI/Release workflow 구축
- v1.4.20 첫 정식 Release + release-gate E2E
- v1.4.27~43 Subspace UI 연구/수렴
- v1.4.48 9×3 상자형 경로 복귀
- v1.4.48 SAFE GUARD: 위험 아이템/셜커 저장 차단
- source/static/package 검증 체계 유지
- 무기 3인칭 TEST1~28 연구 종료 및 미승격 처리

## 현재 릴리즈 기준

- `main`: v1.4.48 SAFE GUARD
- 상태: **최신 정식 Release / full Bedrock E2E NOT RUN**
- source: `source/world/`
- manifest: `SOURCE-MANIFEST.json`
- 마지막 full release-gate E2E PASS: **v1.4.20**
- 무기 3인칭 실험은 source/main/Release에서 제외

## 다음 개발

1. v1.4.48 exact-package Bedrock release-gate 회귀 E2E
2. Subspace 특수 데이터 무손실 저장은 별도 proof에서만 연구
3. 신규 기능은 release baseline과 분리된 feature branch에서 진행
4. 무기 3인칭은 현재 **중단** 상태이며 재개 요청 전까지 진행하지 않음

## 금지

- E2E 없이 완료/안정화 검증 완료 선언
- v3 Subspace 키 삭제
- 기존 사신 대낫/리볼버 1인칭 임의 변경
- Subspace 작업 때문에 Sheriff/Reaper/quest/shop 전체 재작성
- 종료된 Weapon 3P TEST1~28 수치를 검증된 기준으로 재사용

## 2026-10-10 — 독립 월드 제작 흐름 (현재 중단)
- 건축: Medieval Village STAGE 1/2 미승인, 후지가 직접 마을 제작.
- 자연: Side Nature v1~v4는 실험. v4 역시 실제 베드락 화면에서 지형 품질 문제 확인.
- 새 요청이 있을 때만 던전 산세 분석 → 약 10블록 완전 분리 → 넓은 건축 평지 + 균형 잡힌 자연스러운 산 → 복제본 → 실기기 확인.
- [현행 월드 인계](docs/CURRENT-WORLD-WORK.md) 참조. 게임 릴리스 로드맵 v1.4.48과 섞지 않기.
