# Mechanics RPG

Minecraft Bedrock 기반 커스텀 RPG 프로젝트 **메크닉스 RPG(Mechanics RPG)** 전용 저장소입니다.

> `Geumyi-Minecraft-System`과 완전히 분리합니다. GSC/GSCM/GST/GDS/실서버 운영 파일은 이 저장소에 넣지 않습니다.

## 현재 상태

| 항목 | 상태 |
|---|---|
| 저장소 | `geumyi22/Mechanics-RPG` |
| 기본 브랜치 | `main` |
| 개발 브랜치 | `dev` |
| 최신 정식 Release | **v1.4.48 SAFE GUARD** |
| v1.4.48 분류 | **최신 릴리즈/기능 기준 베이스 — full Bedrock E2E 미검증** |
| 마지막 full release-gate E2E PASS | **v1.4.20** |
| source file count | **294** |
| Static validation | **PASS** |
| deterministic package / CRC / re-extracted hashes | **PASS** |
| v1.4.48 exact-package full Bedrock release-gate E2E | **NOT RUN** |
| 아공간 UI 계열 실기기 근거 | v1.4.42~43에서 9×3 상자형 UI/아이템 렌더링 확인 |

`source/world/`는 v1.4.48 SAFE GUARD 기준 월드 소스를 보존하며 `SOURCE-MANIFEST.json`으로 전체 파일 크기와 SHA-256을 추적합니다.

## v1.4.48 핵심

- 아공간: **9×3 = 27칸** 상자형 UI
- 역사적 `geumyi:subspace_v3_head / stage / journal` 저장 체계 유지
- 28~36번 역사 슬롯의 안전 overflow migration 유지
- 무기/스킬템/내구도/인챈트/이름/Lore/동적 속성 등 특수 데이터 아이템은 저장 차단
  - `아공간이 그 힘을 버티지 못합니다.`
- 셜커/Bundle 계열은 저장 차단
  - `아공간이 셜커를 거부합니다.`
- 보안관 탄환/6발 묶음 등 명시적 안전 커스텀 스택은 기존 허용 규칙 유지
- 사신 대낫 및 보안관 리볼버의 기존 1인칭 외형은 릴리즈에서 변경하지 않음
- 무기 3인칭 TEST1~28은 **종료된 로컬 실험**이며 v1.4.48 source/main/Release에 포함하지 않음

## 검증 경계

v1.4.48은 **source/static/package 검증을 통과한 최신 릴리즈 베이스**입니다.  
그러나 exact-package 전체 Bedrock release-gate E2E가 실행되지 않았으므로 **안정화 검증 완료 버전이라고 부르지 않습니다.**

v1.4.20은 실제 Bedrock release-gate E2E 8개 핵심 항목을 통과한 마지막 정식 검증 기준입니다.

## 운영 원칙

- 실제 Bedrock에서 실행하지 않은 것은 “정상 작동/완료”라고 단정하지 않습니다.
- **Static / Mock / Bedrock E2E**를 구분합니다.
- 기존 정상 직업/사신/상점/퀘스트/NPC/햇빛 로직을 요청 없이 재작성하지 않습니다.
- 큰 변경은 기능 단위 브랜치/커밋으로 나눕니다.
- 릴리스용 `.mcworld`, `.zip`은 source tree에 누적하지 않고 Actions artifact / GitHub Release로 관리합니다.
- manifest UUID/API dependency는 기준 패키지를 보존합니다.
- 로컬 TEST 패키지는 사용자 승인 및 E2E 전까지 main/source/Release로 승격하지 않습니다.

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

## 현재 manifest 기준

- BP/RP version: `1.4.48`
- min engine: `1.26.50`
- `@minecraft/server 2.9.0`
- `@minecraft/server-ui 2.1.0`
- Script entry: `scripts/main.js`

자세한 검증 상태는 [TESTING.md](TESTING.md), 아공간 이력은 [docs/SUBSPACE-DEVELOPMENT.md](docs/SUBSPACE-DEVELOPMENT.md), 무기 3인칭 실험은 [docs/WEAPON-THIRD-PERSON-EXPERIMENTS.md](docs/WEAPON-THIRD-PERSON-EXPERIMENTS.md)를 확인합니다.
