# Testing Policy

## 1. Static

- JSON parse
- JavaScript syntax
- BP/RP manifest
- world pack linkage
- UUID/version/dependency
- item texture → PNG
- particle texture → PNG
- PNG signature
- source file count / SHA-256
- ZIP CRC
- 재추출 파일 해시
- .zip / .mcworld byte 비교

## 2. Mock

Minecraft Script API를 최소 mock으로 대체해 module import/state transition 등을 확인할 수 있습니다.

Mock 결과는 실제 엔티티 물리/카메라/파티클/피격 판정을 보증하지 않습니다.

## 3. Bedrock E2E

실제 Minecraft Bedrock에서 확인해야 합니다.

- .mcworld import
- BP/RP 활성화
- startup Script error
- 직업/상태창/스킬 지급
- Sheriff/Reaper 핵심 기능
- 퀘스트/상점/NPC
- Subspace open / put / take / recovery / rejoin
- 멀티플레이
- 저장/재접속/월드 재시작

## v1.4.48 release 기록

```text
Static: PASS
Package verify: PASS
Historical Subspace UI device evidence: v1.4.42~43 PASS (해당 UI 범위)
Full v1.4.48 exact-package Bedrock E2E: NOT RUN
```

`v1.4.43 코드와 동일한 부분` 또는 `이전 버전에서 실기기 확인됨`은 v1.4.48 전체 E2E PASS와 동일하게 취급하지 않습니다.

GitHub Actions 성공만으로 Bedrock E2E PASS라고 기록하지 않습니다.
