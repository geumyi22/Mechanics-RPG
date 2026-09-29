# Mechanics RPG

Minecraft Bedrock 기반 커스텀 RPG 프로젝트 **메크닉스 RPG(Mechanics RPG)** 전용 저장소입니다.

> `Geumyi-Minecraft-System`과 완전히 분리합니다. GSC/GSCM/GST/GDS/실서버 운영 파일은 이 저장소에 넣지 않습니다.

## 현재 상태

| 항목 | 상태 |
|---|---|
| 저장소 | `geumyi22/Mechanics-RPG` |
| 기본 브랜치 | `main` |
| 최신 패키징 기준 | **v1.4.20 DEAD_EYE_VFX_RELOAD_FIX** |
| 기준 패키지 파일 수 | **257** |
| 로컬 정적 검사 | JSON 84 / JS 7 / item texture 52 / particle 3 / PNG 93 통과 |
| 패키징 검증 | ZIP CRC + 재추출 257개 해시 일치 + .zip/.mcworld byte-identical |
| GitHub source import | **대기** |
| 실제 Bedrock E2E | **미실행** |

현재 저장소는 문서/검증/패키징 자동화 기반을 먼저 구성하는 단계입니다. v1.4.20 실제 BP/RP/world source tree는 별도 import 단계로 올립니다.

## 운영 원칙

- 실제 Bedrock에서 실행하지 않은 것은 “정상 작동/완료”라고 단정하지 않습니다.
- **Static / Mock / Bedrock E2E**를 구분합니다.
- 기존 정상 직업/사신/상점/퀘스트/NPC/햇빛 로직을 요청 없이 재작성하지 않습니다.
- 큰 변경은 기능 단위 브랜치/커밋으로 나눕니다.
- 릴리스용 `.mcworld`, `.zip`은 source tree에 누적하지 않고 Actions artifact / GitHub Release로 관리합니다.
- manifest의 UUID/API dependency는 실제 baseline 파일을 기준으로 보존합니다.

## 목표 구조

```text
Mechanics-RPG/
├─ source/
│  └─ world/                 # .mcworld 압축 해제 루트 그대로 보존
├─ tools/
│  ├─ import_baseline.py
│  ├─ validate.py
│  ├─ package.py
│  └─ verify_package.py
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ E2E-CHECKLIST.md
│  ├─ GITHUB-RUNBOOK.md
│  ├─ classes/
│  └─ systems/
├─ .github/workflows/
├─ README.md
├─ ROADMAP.md
├─ CHANGELOG.md
├─ VERSION-MATRIX.md
├─ TESTING.md
├─ RECOVERY-REPORT.md
└─ SECURITY-NOTES.md
```

## v1.4.20 기준 핵심

- BP version: `1.4.20`
- RP version: `1.4.20`
- min engine: `1.26.50`
- `@minecraft/server 2.9.0`
- `@minecraft/server-ui 2.1.0`
- Script entry: `scripts/main.js`

보안관 현재 기준:
- 6발 장전
- 일반탄 10
- 헤드샷 ×1.75
- 최소 사거리 30 / 정지 조준 최대 70
- 데드아이 30/발
- 데드아이 준비 중 궁극기 전용 6/6 재장전
- 보라색 데드아이 탄도 유지

## 다음 개발

1. v1.4.20 source tree GitHub import
2. CI 실제 실행 확인
3. 현상수배 머리 위 픽셀 마커
4. 데드아이 실제 이동형 유도탄
5. 보안관 탄약 보관/소모 UX 개선
6. 전체 Bedrock 회귀 E2E
7. 첫 정식 GitHub Release

자세한 순서는 [ROADMAP.md](ROADMAP.md)를 기준으로 합니다.
