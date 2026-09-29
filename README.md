# Mechanics RPG

Minecraft Bedrock 기반 커스텀 RPG 프로젝트 **메크닉스 RPG(Mechanics RPG)** 전용 저장소입니다.

> `Geumyi-Minecraft-System`과 완전히 분리합니다. GSC/GSCM/GST/GDS/실서버 운영 파일은 이 저장소에 넣지 않습니다.

## 현재 상태

| 항목 | 상태 |
|---|---|
| 저장소 | `geumyi22/Mechanics-RPG` |
| 기본 브랜치 | `main` |
| 개발 브랜치 | `dev` |
| 최신 정식 Release | **v1.4.20** |
| 최신 패키징 기준 | **v1.4.20 DEAD_EYE_VFX_RELOAD_FIX** |
| 기준 패키지 파일 수 | **257** |
| GitHub source import | **완료** |
| CI / package 자동화 | **구축 및 실제 source 기준 PASS** |
| Release 안전장치 | **tag ↔ manifest version 일치 검사** |
| Bedrock release-gate E2E | **PASS (8개 핵심 항목)** |
| GitHub 초기 구축 | **완료 / handoff ready** |

v1.4.20 원본 월드 구조는 `source/world/` 아래에 그대로 보존되어 있고, `SOURCE-MANIFEST.json`으로 파일 목록·크기·SHA-256을 추적합니다.

정식 Release:
- https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.20

Release assets:
- `Mechanics_RPG_v1.4.20.mcworld`
- `Mechanics_RPG_v1.4.20.zip`
- `SHA256SUMS.txt`

v1.4.20 release asset SHA-256:
`a4d099cb419cdda1da68ed734406a7a2885a6c72565ba10e6d2d9741fe0ced70`

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

## E2E 범위

v1.4.20은 실제 Bedrock에서 다음 release-gate 항목을 통과했습니다.

1. .mcworld import / world open
2. BP/RP 및 시작 시 Script 오류 없음
3. 직업 선택 / 레벨 테스트 접근
4. 보안관 리볼버 6발 / 사격 / 재장전
5. 보안관 데드아이 및 보라색 연출
6. 사신 승인된 1인칭 대낫 유지
7. 퀘스트 / 상점 주민 UI
8. 저장 → 종료 → 재접속

이는 **정식 Release gate E2E**이며, 모든 직업/멀티플레이/역사적 조합을 망라한 exhaustive regression을 의미하지는 않습니다.

신규 게임 아이디어는 현재 backlog 상태로 유지합니다. 다음 개발부터는 새 버전과 GitHub source/CI/CHANGELOG/Release를 같은 작업으로 동기화합니다.

자세한 인수인계 기준은 [HANDOFF.md](HANDOFF.md), 새 버전 절차는 [docs/DEVELOPMENT-WORKFLOW.md](docs/DEVELOPMENT-WORKFLOW.md)를 확인합니다.
