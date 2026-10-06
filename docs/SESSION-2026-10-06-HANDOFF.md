# Mechanics RPG — Session Handoff 2026-10-06

## 가장 중요한 기준

- 정식 `main` 릴리즈 기준은 여전히 **v1.4.48 SAFE GUARD**이며 full Bedrock E2E는 NOT RUN입니다.
- 이번 채팅에서 이어진 **현재 작업 기준**은 **v1.4.62_REVOLVER_BACK2_MORE**입니다.
- 작업 스냅샷 브랜치: `handoff/2026-10-06-v1.4.62`
- exact local artifact: `Mechanics_RPG_v1.4.62_REVOLVER_BACK2_MORE.mcworld`
- exact local artifact SHA-256: `a08717a4cfe0b9790dbf979554b7e04226bcd704588c53c0fd2c5518b2f1a132`
- v1.4.62 package static result: JSON 92 PASS / ZIP CRC PASS / **Bedrock runtime E2E NOT RUN**
- 새 채팅에서 v1.4.62를 “완성/안정화 검증 완료”로 부르지 않습니다.

## v1.4.59 → v1.4.62 작업 이력

사용자가 `Mechanics_RPG_v1.4.59_REVOLVER_LOWER(1).mcworld`를 앞으로 사용할 기준으로 지정했습니다.

### v1.4.59 당시 3인칭 값
- Reaper scythe: rotation X=260°, position `[0,-4,-10]`
- Sheriff revolver: rotation X=355°, position `[0,-6,-7]`
- 두 무기 모두 custom transform은 `!variable.is_first_person` 조건으로 3인칭에만 적용
- 기존 1인칭을 건드리지 않는 것이 고정 조건

### v1.4.60
- 리볼버만 5단 뒤 + 2단 아래
- `[0,-6,-7] -> [0,-8,-2]`
- rotation X=355° 유지

### v1.4.61
- 리볼버만 2단 더 뒤
- `[0,-8,-2] -> [0,-8,0]`

### v1.4.62 (현재)
- 리볼버만 2단 더 뒤
- `[0,-8,0] -> [0,-8,2]`
- rotation X=355° 유지
- 낫 값은 v1.4.59 이후 이 연속 작업에서는 변경하지 않음

## 무기 3인칭 상태

### 사신 대낫
- 사용자는 **날이 아니라 손잡이를 손에 붙이는 것**을 핵심 기준으로 잡았습니다.
- 기존 여러 TEST/overlay 캘리브레이션은 최종 기준이 아닙니다.
- 특히 JX/JY/JZ 실험은 좌표축 확인용일 뿐 현재 기준으로 사용하지 않습니다.
- 최근 스크린샷에서 날 쪽이 손/머리에 붙고 손잡이가 멀어지는 문제가 있었으므로 위치 조정은 아직 미완료입니다.
- 대낫 1인칭은 절대 임의 수정하지 않습니다.

### 보안관 리볼버
현재 working transform:
- 3P rotation: `[355,0,0]`
- 3P position: `[0,-8,2]`
- first-person excluded
- 실제 Bedrock에서 v1.4.62 최종 위치 확인은 아직 받지 못했습니다.

## v1.4.62 GitHub handoff source snapshot

이 브랜치는 재개용 source snapshot입니다. main의 290개 비-manifest baseline 파일은 v1.4.48과 SHA-256 기준 동일함을 비교했고, weapon 작업 관련 text/source delta만 반영했습니다.

반영:
- BP/RP manifests 및 world pack references → v1.4.62 working UUID/version
- `scythe_third_person.animation.json`
- weapon 3P changelog/validation
- v1.4.60~62 incremental notes

exact local mcworld에는 추가로 실행 중 생성된 `level.dat`, `level.dat_old`, `levelname.txt` 변경과 대형 generated `ROLLBACK_SCYTHE_3P.py`가 존재하지만, 이 handoff source snapshot에는 넣지 않았습니다. 따라서 branch source와 exact mcworld를 byte-identical이라고 주장하지 않습니다.

## 해커 / 글리쳐 아이디어 상태

### 해커
**아이디어만 설계됨. 아직 코드 구현 안 됨.**

초안:
1. 시스템 분석 — 공격으로 분석 스택 축적
2. 취약점 스캔 — 주변 적 분석/방어 약화
3. 익스플로잇 — 분석된 적 공격 + 행동 봉쇄
4. 백도어 — 일반 적 일시 제어, 보스는 약화
5. 관리자 권한 탈취 — 범위 디버프 + 해커 강화 궁극기

사용자는 “짜피 없앨 거긴 한데 한번 만들어봐”라고 임시 구현을 요청한 뒤 GitHub handoff로 전환했습니다. 따라서 **해커 직업은 아직 파일에 추가하지 않았습니다.**

### 글리쳐
역할 분리 아이디어만 있음. 구현 안 됨.
- 해커 = 적/시스템/정보/권한 조작
- 글리쳐 = 공간/좌표/판정/현실 오류
- 두 직업의 효과가 겹치지 않게 유지

## 새 채팅에서 지켜야 할 고정 규칙

1. v1.4.62 working 상태와 v1.4.48 정식 main 상태를 혼동하지 않기
2. 실제 Bedrock E2E 전 “완료/안정화” 선언 금지
3. 사신/보안관 1인칭 임의 변경 금지
4. Sheriff mechanics / Reaper mechanics·skills / quest / shop / status / sunlight / Subspace 회귀 금지
5. 무기 위치 수정은 한 번에 축/각도 하나씩 명확히 변경하고 변경값 기록
6. 사용자 승인 전 과거 TEST 좌표를 정답으로 재사용하지 않기
7. 파일 수정 시 base, delta, rollback/evidence를 기록

## 다음 시작점

새 채팅에서 먼저 이 문서와 `HANDOFF.md`를 읽습니다.

- 무기 작업 계속: **v1.4.62 working snapshot**부터
- 해커 임시 구현 계속: **v1.4.62를 base로 하고 기존 시스템 무수정**
- 정식 release 승격: 별도 Bedrock E2E 이후에만
