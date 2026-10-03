# Weapon Third-person Experiments

기준일: 2026-10-04

이 문서는 **정식 릴리즈에 포함되지 않는 연구 기록**입니다.

## 고정 요구사항

- 사신 대낫 1인칭: 기존 정상 상태 고정
- 보안관 리볼버 1인칭: 기존 정상 상태 고정
- 수정 대상: 다른 플레이어가 보는 3인칭만

## 결과

- TEST1: attachable 기반 분리 — 1인칭/3인칭 모두 위치 붕괴
- TEST2: 1인칭 attachable 비활성 시도 — 무기 투명화
- TEST3: texture_mesh/custom bow 계열 — 표시 성공, 1인칭까지 변경됨
- TEST4: grip zero-offset — 개선됐지만 손잡이 고정 실패
- TEST5: local_pivot를 PNG 픽셀 좌표처럼 해석 — 무기가 플레이어와 크게 분리, 폐기
- TEST6: **player third-person/rightItem bone만 보정** — 기존 1인칭 유지 확인
- TEST7: TEST6 구조의 3인칭 수치 튜닝 단계 — 미완성

## 현재 결론

앞으로는 TEST6 구조를 기준으로 **1인칭/아이템/PNG/attachable을 변경하지 않고 third-person rightItem 값만 조정**합니다.

TEST1~7은 v1.4.48 stable package에 포함하지 않습니다.
