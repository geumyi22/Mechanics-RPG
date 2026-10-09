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

## 3. Bedrock E2E — 선택사항 (2026-10-10 지후 운영 방침)

실제 Minecraft Bedrock에서 확인할 수 있는 항목입니다. **앞으로 E2E는 필수 릴리스 게이트가 아니며**, 지후가 필요하다고 판단할 때에만 시행합니다. 미실행 버전에는 `NOT RUN/UNVERIFIED`를 명시합니다. 아래는 실제 검사 시 사용할 체크리스트입니다.

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

## 2026-10-10 — 월드의 시각적 품질 검증
- 사용자 실제 게임 화면에서 지형 절단면/산 높이 불균형/텅 빈 방향 및 중세 건축 창문·벽 텍스처 문제가 확인됐습니다.
- ZIP CRC/LevelDB/블록 상태/높이 맵의 정적 검사 PASS만으로 월드의 지형/건축 품질을 합격 처리하지 않습니다.
- 사용자가 직접 테스트한 특정 결함 스크린샷은 게임 안에서의 해당 오류 증거일 뿐 **full Bedrock E2E PASS가 아닙니다**.
- 최신 결함/재개 규칙: [docs/CURRENT-WORLD-WORK.md](docs/CURRENT-WORLD-WORK.md).

## v1.4.64 Hacker Alpha Pre-release
- 해커 아이콘 5개 누락 문제 및 source manifest 불일치 해결 후 자동 정적/패키징 검사: **PASS**.
- Minecraft Bedrock 실제 E2E: **NOT RUN (선택사항)**.
- 미실행 E2E의 결과를 추측해 PASS라고 기록하지 않으며 정상 작동을 보증하지 않습니다.
