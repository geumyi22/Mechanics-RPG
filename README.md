# Mechanics RPG

Minecraft Bedrock 기반 커스텀 RPG 프로젝트 **메크닉스 RPG(Mechanics RPG)** 의 소스·문서·검증 기록을 관리하는 저장소입니다.

> 이 저장소는 `Geumyi-Minecraft-System`과 분리되어 있습니다. GSC/GSCM/GST/GDS/서버 운영 파일은 이 저장소에 포함하지 않습니다.

## 현재 기준

| 항목 | 기준 |
|---|---|
| 프로젝트 | Mechanics RPG |
| 플랫폼 | Minecraft Bedrock Edition |
| 최신 패키징 기준 | v1.4.20 `DEAD_EYE_VFX_RELOAD_FIX` |
| 상태 | GitHub 초기 정리 단계 |
| Bedrock E2E | 저장소 초기화 시점 기준 별도 재검증 필요 |

v1.4.20은 정적 검사와 패키징 검증을 거친 기준 파일이지만, **GitHub에 올렸다는 이유만으로 실제 Bedrock E2E 검증 완료로 간주하지 않습니다.**

## 핵심 원칙

- 실제 실행하지 않은 기능은 “정상 작동/완료”로 단정하지 않습니다.
- 기존 정상 기능을 요청 없이 재작성하거나 삭제하지 않습니다.
- 변경 범위와 비변경 범위를 분리하고, 버전별 변경 내역을 남깁니다.
- JSON/JavaScript/manifest/resource/archive 검증과 실제 Bedrock E2E를 구분합니다.
- 릴리스용 `.mcworld` / `.zip`은 소스 트리와 분리해 GitHub Releases에서 관리하는 방향을 사용합니다.
- 큰 변경은 되돌릴 수 있도록 작은 단위의 커밋으로 나눕니다.

## 프로젝트 구성 방향

```text
Mechanics-RPG/
├─ behavior_pack/       # Behavior Pack 소스
├─ resource_pack/       # Resource Pack 소스
├─ world/               # 월드에 필요한 추적 대상 파일
├─ docs/                # 직업/시스템/테스트 문서
├─ tools/               # 검증·패키징 도구
├─ README.md
├─ ROADMAP.md
├─ CHANGELOG.md
├─ VERSION-MATRIX.md
├─ TESTING.md
└─ SECURITY-NOTES.md
```

실제 소스 가져오기 전에는 기존 월드 구조를 억지로 이동하지 않고, 최신 패키지를 먼저 분석한 뒤 안전하게 배치합니다.

## 현재 주요 시스템

직업 시스템, 레벨 기반 스킬 해금, 퀘스트/NPC, 상점, 몬스터/스컬크 좀비, 주민 보호, 보안관, 사신 등 메크닉스 RPG의 기존 기능을 유지하면서 버전별로 확장합니다.

특히 기존 승인 기준인 **사신 대낫 1인칭 표현/텍스처**와 다른 직업의 스킬·데미지는 요청 없이 변경하지 않습니다.

## 문서

- [ROADMAP.md](ROADMAP.md) — GitHub 정리 및 다음 개발 순서
- [CHANGELOG.md](CHANGELOG.md) — 버전별 주요 변경 내역
- [VERSION-MATRIX.md](VERSION-MATRIX.md) — 현재까지의 핵심 버전 기준
- [TESTING.md](TESTING.md) — 정적 검사와 실제 Bedrock E2E 구분
- [SECURITY-NOTES.md](SECURITY-NOTES.md) — Public 저장소 업로드 기준

## 다음 단계

최신 패키징 기준(v1.4.20)의 실제 파일을 GitHub 소스 트리로 가져와 manifest·스크립트·리소스 연결을 검증하고, 이후 현상수배 마커 / 데드아이 실제 유도탄 / 탄약 보관 개선을 각각 독립 변경으로 진행합니다.
