# Development Handoff

기준일: 2026-10-06

## 빠른 시작

현재 정식 main baseline과 작업 baseline이 다릅니다.

- **정식 main:** v1.4.48 SAFE GUARD — full Bedrock E2E NOT RUN
- **마지막 full release-gate E2E PASS:** v1.4.20
- **현재 작업 snapshot:** v1.4.63_HACKER_ALPHA
- **working branch:** `handoff/2026-10-06-v1.4.62` (브랜치명은 유지, 내용은 v1.4.63 Hacker Alpha까지 진행)
- **상세 재개 문서:** `docs/SESSION-2026-10-06-HANDOFF.md`

새 채팅에서는 반드시 상세 재개 문서를 먼저 읽고 작업합니다.

## 현재 weapon working values

- Reaper scythe 3P: rotation X=260°, position `[0,-4,-10]`
- Sheriff revolver 3P: rotation X=355°, position `[0,-8,2]`
- custom weapon transform: third-person only
- first-person path: 변경 금지
- v1.4.63 Hacker Alpha Bedrock runtime E2E: **NOT RUN**

사용자 지시에 따라 대낫/리볼버 위치 조정은 종료했습니다. 현재 transform은 추가 수정하지 않는 보존 대상입니다. 단, 이는 Bedrock E2E 검증 완료를 의미하지 않습니다.

## 신규 직업 상태

- Hacker: **v1.4.63 Alpha 구현됨**
  - 해킹 터미널 패시브 / 분석 데이터
  - Lv.10 취약점 스캔
  - Lv.40 익스플로잇
  - Lv.70 백도어
  - Lv.100 관리자 권한 탈취
  - 일반 적 백도어 제어 시 플레이어 공격을 차단하고 주변 적을 공격하도록 구현
  - 보스급은 완전 제어 대신 약화 처리
- Glitcher: 역할 분리 아이디어만 존재, **미구현**

## 절대 보존

- 기존 사신/보안관 1인칭
- Sheriff mechanics
- Reaper mechanics / skills
- quest / shop / status / sunlight
- Subspace v3 저장 체계 및 SAFE GUARD
- E2E 없는 완료 선언 금지

## 검증 경계

v1.4.62 exact local artifact 기록은 그대로 보존:
- JSON 92: PASS
- ZIP CRC: PASS
- Bedrock runtime E2E: NOT RUN
- SHA-256: `a08717a4cfe0b9790dbf979554b7e04226bcd704588c53c0fd2c5518b2f1a132`

v1.4.63 Hacker Alpha source:
- 수정 JS 구문 검사(core.js / skills.js): PASS
- 수정·추가 JSON 10개 parse: PASS
- BP/RP/world refs: 모두 [1,4,63] 확인
- full tools/validate.py + package/ZIP 검증: **NOT RUN**
- Bedrock runtime E2E: **NOT RUN**
- rollback base commit: `fb36c90fa22ccf965ee0b7e38dfda1749a87bef2` (v1.4.62 확인)

main의 정식 release 상태는 여전히 v1.4.48 SAFE GUARD입니다. v1.4.63은 working Alpha이며 release 승격하지 않습니다.
