# Testing Policy

## 1. Static

자동 검사 영역:

- JSON parse
- JavaScript syntax
- BP/RP manifest
- world pack linkage
- UUID/version/dependency
- item texture → PNG
- particle texture → PNG
- PNG signature
- source file count / aggregate SHA-256
- ZIP CRC
- 재추출 파일 해시
- .zip / .mcworld byte 비교

`SOURCE-MANIFEST.json`은 현재 `aggregate-v1` 형식을 사용합니다. 모든 source 파일을 경로순으로 정렬한 뒤 `path + size + SHA-256`을 다시 SHA-256으로 집계합니다. 검증 스크립트는 기존 상세 file-list manifest도 계속 지원합니다.

## 2. Mock

Minecraft Script API를 최소 mock으로 대체해 module import, cooldown/state transition, 반복 처리 등을 확인할 수 있습니다.

Mock 결과는 실제 엔티티 물리/카메라/파티클/피격 판정을 보증하지 않습니다.

## 3. Bedrock E2E

실제 Minecraft Bedrock에서 확인:

- .mcworld import / world open
- BP/RP 활성화 / script load error
- 직업 선택 / 레벨 / 스킬
- 실제 피해/헤드샷
- VFX / 카메라
- 재장전 / 탄약 소비
- 퀘스트 / 상점 / NPC
- 몬스터 / 햇빛
- 멀티플레이
- 저장 / 재접속 / 월드 재시작

### 아공간 추가 gate

- 27칸 동작/표시
- 넣기/빼기 데이터 보존
- 역사적 v3 36-slot 배열의 overflow 안전 이전
- journal 복구
- DDUI 무깜빡임
- native storage proof
- 기존 v3 저장 데이터 영향 없음

## 상태 표기

```text
Static: PASS / FAIL / NOT RUN
Mock: PASS / FAIL / NOT RUN
Bedrock E2E: PASS / FAIL / NOT RUN
```

부분 device test는 반드시 범위를 붙입니다. 예: `Bedrock device: PASS (DDUI no-flicker only)`.

GitHub Actions 성공만으로 Bedrock E2E PASS라고 기록하지 않습니다.
