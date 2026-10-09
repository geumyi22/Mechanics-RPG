# Mechanics RPG

Minecraft Bedrock 기반 커스텀 RPG 프로젝트 **메크닉스 RPG(Mechanics RPG)** 전용 저장소입니다.

> `Geumyi-Minecraft-System`과 완전히 분리합니다. GSC/GSCM/GST/GDS/실서버 운영 파일은 이 저장소에 넣지 않습니다.

## 현재 상태

| 항목 | 상태 |
|---|---|
| 저장소 | `geumyi22/Mechanics-RPG` |
| 기본 브랜치 | `main` |
| 개발 브랜치 | `dev` |
| 최신 정식 기준 Release | **v1.4.48 SAFE GUARD** (`main` 소스) |
| 최신 실험 Pre-release | **[v1.4.64 Hacker Redesign Alpha](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.64)** — 정적 검사 PASS, 실제 E2E 미실행 |
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
- 신규 기능의 정식 `main` 편입은 사용자 승인과 변경 검증 후 진행합니다. **실기기 E2E는 지후 판단에 따른 선택사항**이고, 생략 시 상태를 `UNVERIFIED`로 기록합니다.
- 별도 Alpha `Pre-release`는 정적/패키지 검사 후 E2E 없이 게시할 수 있으나 **안정성 보증 없이 실험판으로 표시**합니다.

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

## 2026-10-10 월드 작업 최신 현황 (GitHub 릴리스와 별도)
- 후지가 중세 마을을 **직접 건축**하기로 하여 AI 마을 자동 건축은 중단했습니다.
- Side Nature v1~v4는 채팅 시험 월드이며 v4는 산 높이/절단면/방향별 지형 문제가 확인돼 **미승인**입니다.
- 중세 마을·자연 지형 월드 자체는 더 수정하지 않았고, 별도로 **v1.4.64 개발 브랜치 Alpha 릴리스**만 게시했습니다.
- 최신 진행/11개 건축 결함/재개 조건: [docs/CURRENT-WORLD-WORK.md](docs/CURRENT-WORLD-WORK.md).
- 옛 설계는 [이전 인수인계](docs/HANDOFF-2026-10-10-MEDIEVAL-VILLAGE-v3.md)에 역사 기록으로 보관합니다. 채팅 v1.4.100 시험본은 main v1.4.48 Release가 아닙니다.

## 2026-10-10 — 실험 릴리스 및 브랜치 관리
- 새 [v1.4.64 Hacker Redesign Alpha](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.64) Pre-release: 5개 누락된 해커 임시 아이콘 보완 및 `SOURCE-MANIFEST` 재생성. 자동 정적 검사·패키징 PASS. 실제 게임 E2E **NOT RUN**.
- 게임 공식 `main` 소스는 **여전히 v1.4.48**. v1.4.64 Pre-release는 `release/v1.4.64-preview` 분리 브랜치/태그에서 제작.
- 기존 v1.4.20/v1.4.48 릴리스는 복구를 위해 보존. 커밋 이력의 강제 재작성과 미병합 브랜치 삭제는 하지 않음.
