# Development Handoff

기준일: 2026-10-06

## 빠른 시작

현재 정식 main baseline과 작업 baseline이 다릅니다.

- **정식 main:** v1.4.48 SAFE GUARD — full Bedrock E2E NOT RUN
- **마지막 full release-gate E2E PASS:** v1.4.20
- **현재 작업 snapshot:** v1.4.62_REVOLVER_BACK2_MORE
- **working branch:** `handoff/2026-10-06-v1.4.62` (브랜치명은 유지, 내용은 v1.4.62 working까지 진행)
- **상세 재개 문서:** `docs/SESSION-2026-10-06-HANDOFF.md`

새 채팅에서는 반드시 상세 재개 문서를 먼저 읽고 작업합니다.

## 현재 weapon working values

- Reaper scythe 3P: rotation X=260°, position `[0,-4,-10]`
- Sheriff revolver 3P: rotation X=355°, position `[0,-8,2]`
- custom weapon transform: third-person only
- first-person path: 변경 금지
- v1.4.62 working Bedrock runtime E2E: **NOT RUN**

사용자 지시에 따라 대낫/리볼버 위치 조정은 종료했습니다. 현재 transform은 추가 수정하지 않는 보존 대상입니다. 단, 이는 Bedrock E2E 검증 완료를 의미하지 않습니다.

## 실험 직업 상태

- 최근 추가했던 실험 직업 프로토타입은 사용자 요청으로 폐기했습니다.
- 현재 working 기준에는 포함하지 않습니다.

## 절대 보존

- 기존 사신/보안관 1인칭
- Sheriff mechanics
- Reaper mechanics / skills
- quest / shop / status / sunlight
- Subspace v3 저장 체계 및 SAFE GUARD
- E2E 없는 완료 선언 금지

## 검증 경계

현재 working 기준은 v1.4.62_REVOLVER_BACK2_MORE입니다.
- 기존 v1.4.62 local artifact JSON 92: PASS
- ZIP CRC: PASS
- Bedrock runtime E2E: NOT RUN
- SHA-256: `a08717a4cfe0b9790dbf979554b7e04226bcd704588c53c0fd2c5518b2f1a132`
- 최근 실험 직업 프로토타입: 폐기 / release 대상 아님

main의 정식 release 상태는 여전히 v1.4.48 SAFE GUARD입니다.
