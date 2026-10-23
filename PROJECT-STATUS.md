> **2026-10-24 현행 상태:** 로컬 개발 시험본 **v1.4.134 TEST** (Spread/Spring·J♠ 기사 변경, 정확한 Bedrock E2E 미검증). GitHub `main/source/world` 및 공개 Stable은 **v1.4.48**, 최신 공개 Pre-release는 **v1.4.118 TEST**입니다. 로컬 시험 바이너리와 본체 소스는 아직 GitHub에 게시되지 않았습니다. **[최신 상태·해시·미완료 작업](docs/CURRENT-STATUS-v1.4.134-20261024.md)** 참조. 아래 과거 날짜별 내용은 당시 기록으로 유지합니다.

# Project Status

> **2026-10-22 추가 정정:** 사용자 보고로 갑옷 거치대 보호 **실게임 확인**, 카드 술사 **일부 기능 검증**. 세부 빌드·검증 항목 미기록. 기존 P3.5 보호 실패 기록은 해당 과거 시험본의 이력으로 유지하되 현행 전 버전에 일반화하지 않음. [사용자 검증](docs/V1.4.131-USER-VERIFICATION-20261022.md). GitHub main v1.4.48 및 Stable 릴리즈는 아직 변경되지 않았음.


기준일: 2026-10-04

## Current release baseline

- Repository: `geumyi22/Mechanics-RPG`
- Current official main/source baseline: **v1.4.48 SAFE GUARD**
- Classification: **latest feature/release baseline; full Bedrock E2E NOT RUN**
- Source root: `source/world/`
- Source files: **294**
- Static validation: **PASS**
- deterministic package / CRC / re-extracted hashes: **PASS**
- exact-package full Bedrock release-gate E2E: **NOT RUN**
- Last full release-gate E2E PASS: **v1.4.20**

## v1.4.48 scope

### Included
- 9×3 / 27-slot chest-style Subspace
- v3 head/stage/journal preservation
- historical 36-slot array + safe overflow migration
- unsafe metadata-bearing item block
- Shulker/Bundle block
- sheriff bullet/bundle safe custom-stack exception
- existing RPG systems and existing first-person weapon render path

### Excluded
- Subspace native-storage proof from v1.4.46
- DDUI/native bridge experiments v1.4.44~47
- weapon third-person TEST1~28

## Verification evidence

```text
Files: 294
JSON: 90 PASS
JavaScript: 9 PASS (Node syntax)
Item texture entries: 54 PASS
RP PNG: 102 PASS
SOURCE-MANIFEST: 294 PASS
ZIP CRC: PASS
Re-extracted file set/hashes: 294/294 MATCH
Generated .zip/.mcworld: BYTE-IDENTICAL
Full v1.4.48 Bedrock release-gate E2E: NOT RUN
```

## Historical E2E

v1.4.20은 실제 Bedrock release-gate E2E 8개 핵심 항목 PASS 기록을 유지합니다.

아공간은 v1.4.42~43에서 9×3 결합 UI/아이템 렌더링/스택 표시 범위의 실기기 확인 기록이 있습니다. 이 기록은 v1.4.48 전체 회귀 E2E와 동일하지 않습니다.

## Weapon third-person experiment status

- TEST1~28: **종료**
- TEST22 계열에서 1인칭 보존 경로는 실기기에서 확인했으나 3인칭 손잡이/손 위치 정렬은 최종 해결하지 못함
- TEST23~28은 위치/회전 튜닝 실험으로 종료
- 어떤 TEST도 `source/world/`, `main`, v1.4.48 Release에 승격하지 않음
- 현재 무기 3인칭 작업 상태: **미완료 / 중단**

## Development state

- v1.4.46 native-storage proof는 개발 이력으로 보존하며 release baseline에 포함하지 않습니다.
- v1.4.48은 공식 main 기준 소스이나 full E2E 미실행 상태입니다. 기존 Alpha Pre-release는 **v1.4.64**, 최신 별도 TEST Pre-release는 **v1.4.118**입니다.
- 다음 변경은 별도 feature branch에서 시작합니다. E2E는 지후의 선택사항이며, 미실행 배포를 '안정화 검증 완료'로 선언하지 않습니다.

## 2026-10-10 — 월드 시험/게임 릴리스 분리
- 공식 main/source/Release는 **v1.4.48 SAFE GUARD**로 변경 없음. 정확한 패키지 전체 E2E NOT RUN.
- v2.4 자연 지형 + RPG v1.4.100 및 Medieval Village STAGE 1/2, Side Nature v1~v4는 GitHub에 승격하지 않은 채팅 시험 산출물.
- 마을 자동 생성은 품질 미달로 중단되었고 사용자가 직접 마을을 건축합니다.
- Side Nature v4도 불규칙한 고도/거대한 절단면/산 부재 문제로 미승인.
- 현재 작업은 GitHub 문서 및 중복 자료 정리에 한정. [상세 인수인계](docs/CURRENT-WORLD-WORK.md).

## 2026-10-10 — v1.4.64 Alpha GitHub Release 및 정리
- **실험판:** [v1.4.64 Hacker Redesign Alpha](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.64) / Pre-release / E2E NOT RUN.
- 릴리스 브랜치: `release/v1.4.64-preview`; 누락됐던 해커 PNG 5개를 임시 아이콘으로 보완, source manifest 재생성.
- GitHub Actions의 validate/package/verify 단계 PASS. 실기기 버그/밸런스/저장/렌더링 정상 보장은 하지 않음.
- 현재 main/source는 v1.4.48 그대로이며, 채팅 Side Nature v1~v4 맵은 새 릴리스에 포함되지 않음.
- 브랜치 정리: **기존 작업이 남은 분기들 보존**, 이력/태그의 강제 삭제 없음. `dev`는 차이가 없는 구형 기준이므로 main으로 fast-forward해 동기화 예정.
- v1.4.20/v1.4.48 Release는 복구용으로 유지. 커밋은 기록 이력이므로 rebase/force push로 지우지 않음.

## 2026-10-17 — 최신 채팅 TEST와 GitHub 기준 분리

- 공식 GitHub `main`: **v1.4.48 SAFE GUARD** (이 문서의 정식 소스 검증값은 이 버전 기준).
- 최신 공개 Pre-release: **[v1.4.118 TEST](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.118)** (해시/압축 검사 PASS, 실기기 E2E 미실행). 기존 v1.4.64 Hacker Redesign Alpha도 보존.
- 이번 대화에서 마지막으로 생성된 월드 및 애드온: **v1.4.118 TEST**. 확인한 산출물의 ZIP CRC는 PASS, Bedrock 전체 실기기 E2E는 **NOT RUN**.
- 해당 채팅 월드에는 GitHub 소스의 기준과 다른 월드 DB·팩·스크립트가 있어 **자동으로 `main`의 정식 소스나 기존 릴리즈를 교체하지 않음**.
- 확인된 외부 참조: 행동팩 1개 + 리소스팩 3개 (패키지에 미포함). 사용자의 환경 외 독립 실행을 보증할 수 없음.
- 상세 해시, 분리 기준, 릴리즈 준비 조건: [v1.4.118 기록](docs/V1.4.118-CHAT-RELEASE-PREP.md).
- **v1.4.118 GitHub Pre-release 게시 완료**: .mcworld / .mcaddon 업로드 및 SHA-256 일치 확인. [릴리즈](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.118). `main/source/world`는 여전히 v1.4.48이며 태그의 자동 생성 Source code ZIP은 v1.4.118 월드 소스가 아님.



## 2026-10-22 — 최신 로컬 v1.4.131 개발본 (GitHub 공개 미승격)

- 카드 술사 v1.4.131 + 사용자 월드 + Vibrant Visuals 실험 호환성 패치는 **로컬 TEST** 상태. [세부 기록](docs/V1.4.131-LOCAL-STATUS-20261022.md).
- 정적 검사 통과는 실제 베드락 게임 작동 검증을 의미하지 않음. P3.5 상점은 UI 작동 보고가 있으나 갑옷 거치대 보호 실패.
- GitHub `main` 소스·Stable v1.4.48 및 기존 Pre-release v1.4.118은 변경 없음. 새 Stable은 아직 게시하지 않음.
