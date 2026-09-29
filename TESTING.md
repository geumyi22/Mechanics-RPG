# Testing Policy

## 1. Static

자동 검사 가능한 영역입니다.

- JSON parse
- JavaScript syntax
- BP/RP manifest
- world pack linkage
- UUID/version/dependency
- item texture → PNG
- particle texture → PNG
- PNG 기본 signature
- source file count / SHA-256
- ZIP CRC
- 재추출 파일 해시
- .zip / .mcworld byte 비교

## 2. Mock

Minecraft Script API를 최소 mock으로 대체해 module import, cooldown/state transition, 반복 처리 등을 확인할 수 있습니다.

Mock 결과는 실제 엔티티 물리/카메라/파티클/피격 판정을 보증하지 않습니다.

## 3. Bedrock E2E

실제 Minecraft Bedrock에서 확인해야 합니다.

- .mcworld import
- BP/RP 활성화
- script load error
- 직업 선택
- 레벨/스킬 지급
- 실제 피해/헤드샷
- 파티클/카메라/VFX
- 재장전/탄약 소비
- 퀘스트/상점/NPC
- 몬스터/햇빛
- 멀티플레이
- 저장/재접속/월드 재시작

## 상태 표기

```text
Static: PASS / FAIL / NOT RUN
Mock: PASS / FAIL / NOT RUN
Bedrock E2E: PASS / FAIL / NOT RUN
```

GitHub Actions 성공만으로 Bedrock E2E PASS라고 기록하지 않습니다.
