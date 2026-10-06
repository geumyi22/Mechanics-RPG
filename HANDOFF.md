# Development Handoff

기준일: 2026-10-06

## 빠른 시작

현재 정식 main baseline과 작업 baseline이 다릅니다.

- **정식 main:** v1.4.48 SAFE GUARD — full Bedrock E2E NOT RUN
- **마지막 full release-gate E2E PASS:** v1.4.20
- **현재 작업 snapshot:** v1.4.62_REVOLVER_BACK2_MORE
- **handoff branch:** `handoff/2026-10-06-v1.4.62`
- **상세 재개 문서:** `docs/SESSION-2026-10-06-HANDOFF.md`

새 채팅에서는 반드시 상세 재개 문서를 먼저 읽고 작업합니다.

## 현재 weapon working values

- Reaper scythe 3P: rotation X=260°, position `[0,-4,-10]`
- Sheriff revolver 3P: rotation X=355°, position `[0,-8,2]`
- custom weapon transform: third-person only
- first-person path: 변경 금지
- v1.4.62 exact Bedrock runtime E2E: **NOT RUN**

대낫은 아직 손잡이-손 정렬이 미완료입니다. 과거 TEST/J 캘리브레이션을 검증된 정답으로 취급하지 않습니다.

## 신규 직업 아이디어

- Hacker: 스킬 초안만 존재, **미구현**
- Glitcher: 역할 분리 아이디어만 존재, **미구현**
- Hacker 구현 요청 직후 handoff로 전환되었으므로 파일에는 Hacker 코드가 없습니다.

## 절대 보존

- 기존 사신/보안관 1인칭
- Sheriff mechanics
- Reaper mechanics / skills
- quest / shop / status / sunlight
- Subspace v3 저장 체계 및 SAFE GUARD
- E2E 없는 완료 선언 금지

## 검증 경계

v1.4.62 local artifact:
- JSON 92: PASS
- ZIP CRC: PASS
- Bedrock runtime E2E: NOT RUN
- SHA-256: `a08717a4cfe0b9790dbf979554b7e04226bcd704588c53c0fd2c5518b2f1a132`

main의 정식 release 상태를 v1.4.62로 바꾸지 않습니다. 이 branch는 다음 채팅 재개용 working snapshot입니다.
