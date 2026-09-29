# Mechanics RPG

Minecraft Bedrock 기반 커스텀 RPG 프로젝트 **메크닉스 RPG(Mechanics RPG)** 전용 저장소입니다.

> `Geumyi-Minecraft-System`과 완전히 분리합니다. GSC/GSCM/GST/GDS/실서버 운영 파일은 이 저장소에 넣지 않습니다.

## 현재 상태

| 항목 | 상태 |
|---|---|
| 저장소 | `geumyi22/Mechanics-RPG` |
| 기본 브랜치 | `main` |
| 개발 브랜치 | `dev` |
| 최신 패키징 기준 | **v1.4.20 DEAD_EYE_VFX_RELOAD_FIX** |
| 기준 패키지 파일 수 | **257** |
| GitHub source import | **완료** |
| CI / package 자동화 | **구축 및 실제 source 기준 PASS** |
| Release 안전장치 | **tag ↔ manifest version 일치 검사** |
| GitHub 초기 구축 | **handoff ready** |
| 실제 Bedrock E2E | **미실행** |

v1.4.20 원본 월드 구조는 `source/world/` 아래에 그대로 보존되어 있고, `SOURCE-MANIFEST.json`으로 파일 목록·크기·SHA-256을 추적합니다.

## 운영 원칙

- 실제 Bedrock에서 실행하지 않은 것은 “정상 작동/완료”라고 단정하지 않습니다.
- **Static / Mock / Bedrock E2E**를 구분합니다.
- 기존 정상 직업/사신/상점/퀘스트/NPC/햇빛 로직을 요청 없이 재작성하지 않습니다.
- 큰 변경은 기능 단위 브랜치/커밋으로 나눕니다.
- 릴리스용 `.mcworld`, `.zip`은 source tree에 누적하지 않고 Actions artifact / GitHub Release로 관리합니다.
- manifest의 UUID/API dependency는 실제 baseline 파일을 기준으로 보존합니다.

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

## 현재 동결 기준

- BP/RP version: `1.4.20`
- min engine: `1.26.50`
- `@minecraft/server 2.9.0`
- `@minecraft/server-ui 2.1.0`
- Script entry: `scripts/main.js`

신규 게임 아이디어는 **아직 시작하지 않은 backlog**로 유지합니다. GitHub 초기 구축을 마감한 뒤 다음 개발 주도권으로 넘깁니다.

자세한 인수인계 기준은 [HANDOFF.md](HANDOFF.md), 새 버전 절차는 [docs/DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md)를 확인합니다.
