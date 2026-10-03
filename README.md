# Mechanics RPG

Minecraft Bedrock 기반 커스텀 RPG 프로젝트 **메크닉스 RPG(Mechanics RPG)** 전용 저장소입니다.

> `Geumyi-Minecraft-System`과 완전히 분리합니다. GSC/GSCM/GST/GDS/실서버 운영 파일은 이 저장소에 넣지 않습니다.

## 현재 상태

| 항목 | 상태 |
|---|---|
| 저장소 | `geumyi22/Mechanics-RPG` |
| 기본 브랜치 | `main` |
| 개발 통합 브랜치 | `dev` |
| 최신 정식 Release | **v1.4.20** |
| 정식 Release Bedrock E2E | **PASS (8개 release-gate 항목)** |
| 최신 개발 스냅샷 | **v1.4.46 SUBSPACE_NATIVE_STORAGE_PROOF_TEST** |
| v1.4.46 Static | **PASS (local source/artifact)** |
| v1.4.46 Bedrock E2E | **NOT RUN — native storage proof 대기** |
| 개발 source 파일 수 | **304** |
| source integrity | **aggregate SHA-256 manifest** |
| CI / package 자동화 | 구축 완료 |

**중요:** `main`/tag/Release는 여전히 검증된 **v1.4.20**입니다. v1.4.46은 개발 스냅샷이며, 네이티브 아공간 검증과 회귀 E2E 전에는 정식 Release로 승격하지 않습니다.

정식 Release:
- https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.20

v1.4.20 release asset SHA-256:
`a4d099cb419cdda1da68ed734406a7a2885a6c72565ba10e6d2d9741fe0ced70`

## 아공간 개발 현황

아공간 작업은 v1.4.27~v1.4.46까지 별도 이력을 보존합니다.

- v1.4.42: **9×3 아공간 + 실제 인벤토리/핫바 아이템 렌더링 실기기 확인**
- v1.4.43: **상자형 UI/스택 수량 표시 실기기 확인**, 단 ActionForm 닫힘→재오픈 깜빡임 존재
- v1.4.44: **DDUI CustomForm 무깜빡임 넣기/빼기 실기기 확인**
- v1.4.45: 상자형과 DDUI를 같은 저장 데이터로 선택하는 이중 모드
- v1.4.46: 기존 아공간을 건드리지 않은 `minecraft:storage_item` 네이티브 저장 **격리 테스트판 — 실기기 미검증**

상세 이력과 성공/실패 판정은 [docs/SUBSPACE-DEVELOPMENT.md](docs/SUBSPACE-DEVELOPMENT.md)를 확인합니다.

## 운영 원칙

- 실제 Bedrock에서 실행하지 않은 것은 “정상 작동/완료”라고 단정하지 않습니다.
- **Static / Mock / Bedrock E2E**를 분리 기록합니다.
- 기존 정상 직업/사신/상점/퀘스트/NPC/햇빛 로직을 요청 없이 재작성하지 않습니다.
- 큰 변경은 기능 브랜치 → `dev` → CI → Bedrock E2E → `main` 순서로 진행합니다.
- 릴리스용 `.mcworld`, `.zip`은 source tree에 누적하지 않고 Actions artifact / GitHub Release로 관리합니다.
- manifest UUID/API dependency는 실제 baseline을 기준으로 보존합니다.
- 아공간 v3 저장 키/저널은 임의 삭제하지 않습니다.

## 저장소 구조

```text
Mechanics-RPG/
├─ source/world/
├─ tools/
├─ docs/
├─ .github/workflows/
├─ SOURCE-MANIFEST.json
├─ HANDOFF.md
├─ PROJECT-STATUS.md
├─ ROADMAP.md
├─ CHANGELOG.md
├─ VERSION-MATRIX.md
├─ TESTING.md
└─ SECURITY-NOTES.md
```

## API 기준

현재 개발 스냅샷 v1.4.46:
- BP/RP version: `1.4.46`
- min engine: `1.26.50`
- `@minecraft/server 2.9.0`
- `@minecraft/server-ui 2.1.0`
- Script entry: `scripts/main.js`

정식 v1.4.20 release의 API 고정값과 UUID는 [VERSION-MATRIX.md](VERSION-MATRIX.md)에 별도 보존합니다.

## 검증 상태 해석

v1.4.20은 실제 Bedrock release-gate E2E를 통과했습니다. v1.4.46은 현재 로컬 정적 검사에서 다음을 통과했습니다.

- JSON 93
- JavaScript 10
- BP/RP/world linkage
- item texture entries 57
- particle JSON 3
- PNG 105
- source files 304
- ZIP CRC / re-extracted hashes
- `.zip` / `.mcworld` byte-identical

이는 **Static PASS**이며 v1.4.46 전체의 Bedrock E2E PASS를 의미하지 않습니다.

개발 절차는 [docs/DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md), 인수인계 기준은 [HANDOFF.md](HANDOFF.md)를 확인합니다.
