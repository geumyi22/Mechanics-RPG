# Development Workflow / GitHub Runbook

**2026-10-10:** 예전의 GitHub 초기 구축 안내서와 간략 Release 절차 문서를 이 문서로 통합했습니다. 현재 공식 소스 기준은 v1.4.48 SAFE GUARD이며 full Bedrock E2E는 NOT RUN입니다.

## 브랜치
- main: 현재 공식 소스
- dev: 통합 개발
- feature/*, fix/*: 기능과 재현 가능한 버그 수정
- 게임 코드/월드 변경은 분리 브랜치, 정적 검증과 실제 Bedrock E2E 후에만 승격.
- 문서만 정리할 때는 source/world, SOURCE-MANIFEST.json, Actions, tag/Release를 변경하지 않기.

## 패키지 루트와 매니페스트
- source/world/가 실제 .mcworld 압축 루트. BP/RP, level.dat, level.dat_old, levelname.txt, world_behavior_packs.json, world_resource_packs.json을 보존.
- source/world 내부의 옛 PATCH/CHANGELOG .txt도 실제 패키지에 포함됩니다. 삭제/이동 시 SOURCE-MANIFEST의 294개 파일/크기/SHA가 달라집니다. 단순 정리 이유로 삭제 금지.
- BP/RP 버전·UUID·API 의존성을 독립적으로 올리지 않기.

## 현재 소스 검증 명령
    python tools/validate.py
    python tools/package.py
    python tools/verify_package.py

Node.js가 설치되어 있으면 validate가 JavaScript 문법도 검사합니다. CI는 JSON, BP/RP/world linkage, 이미지 참조, SOURCE-MANIFEST, 결정론적 ZIP/.mcworld, CRC 및 재추출 해시를 검증합니다.
**CI PASS / 정적 검사 PASS는 실제 게임 실행 및 지형 미관 검증 PASS가 아닙니다.**

## 역사적 baseline import (주의: 파괴적)
초기 v1.4.20 source를 가져올 때 사용한 예전 명령:
    python tools/import_baseline.py /path/to/approved-baseline.mcworld

이 스크립트는 기존 source/world 폴더를 **삭제하고 새로 추출**하며 SOURCE-MANIFEST를 재생성합니다. 현재 v1.4.48 기준을 보존해야 하므로, 새로운 아티팩트가 확정되지 않은 상태에서 실행하지 마세요.

## 새 게임 버전 작업/배포
1. 현재 main SHA / source manifest / 원본 SHA / BP·RP 버전 확보.
2. 대상/비대상 파일 확정 후 feature/fix 브랜치에서 수정.
3. 버전 수정 시 BP manifest, RP manifest, world linkage, VERSION-MATRIX, CHANGELOG 점검.
4. 위 3개 도구 검증, GitHub CI, 실제 Minecraft Bedrock import·직업·상점·NPC·장비·저장/재접속 회귀 검증.
5. E2E 증거 확보 후 승인/PR → main → manifest version과 일치하는 vX.Y.Z 태그 → GitHub Release.
6. Release는 GitHub Actions artifact(.mcworld/.zip/checksums)로 관리. 같은 버전 Release asset 몰래 교체 금지.
7. 오류 시 git revert 우선, 강제 push/과거 이력 재작성 금지.

자세한 검증은 [../TESTING.md](../TESTING.md), E2E는 [E2E-CHECKLIST.md](E2E-CHECKLIST.md), 복구는 [ROLLBACK.md](ROLLBACK.md).

## 2026-10-10 문서 중복 정리
- docs/GITHUB-RUNBOOK.md의 import/검사/GitHub 운용 명령과 주의사항을 이 문서에 통합 후 삭제.
- docs/systems/RELEASE.md의 Release 단계와 Bedrock E2E 경계도 이 문서에 통합 후 삭제.
- 게임용 소스/매니페스트/복구 증거와 릴리스 워크플로는 모두 유지.
