# Mechanics RPG — 저장소 전체 점검 및 안전 정리 기준 (2026-11-18)

> 이 문서는 **GitHub에 실제로 존재하는 파일·브랜치·Release·Issue**를 확인한 점검 기록입니다. 과거 로컬 시험본의 파일명과 SHA-256은 이력일 뿐, 현재 바이너리를 확보했다는 증거가 아닙니다. 새로운 Stable·실게임 E2E 성공은 선언하지 않습니다.

## 1. 확인한 기준

| 항목 | 확인 결과 |
|---|---|
| 저장소 | `geumyi22/Mechanics-RPG` (Public) |
| 점검 시작 시 `main` | `69bde07b74dbf1a784b0e9355cd02a7bb7a738d9` |
| `main/source/world` 소스 | **v1.4.48 SAFE GUARD** (294파일, `SOURCE-MANIFEST.json` 관리) |
| 공개 Stable | [v1.4.48](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.48) (해당 exact-package 전체 Bedrock E2E 미실행) |
| 공개 Pre-release (가장 최근 게시) | [v1.4.118 TEST](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.118) (E2E 미실행, 누락된 외부 팩 참조 존재) |
| 최신 기록상 별도 로컬 TEST | **v1.4.134**, 2026-10-24 인수인계 기준. 원본 바이너리/소스 GitHub 미게시 |
| 사용자 지정 차기 Stable 목표 | **v1.4.131** (요청된 목표, 미배포) |
| 마지막 기록상 full Bedrock release-gate E2E PASS | v1.4.20의 당시 테스트 범위 |
| 최신 확인된 기존 main GitHub CI | [2026-10-24 SUCCESS](https://github.com/geumyi22/Mechanics-RPG/actions/runs/40007975484) — **v1.4.131·v1.4.134 실게임 검증 아님** |

### 저장소 구성 (점검 시작 시 스냅샷)

- 추적 파일 **341개**, `source/world` **294개**, `docs/` 문서 **23개**, 브랜치 **17개**, 공개 릴리스 **4개**, 열린 일반 Issue **4개** (#2, #3, #4, #13).
- `source/world` 루트의 텍스트 파일 **58개**(패치·변경 기록, rollback, third-party notices, levelname 포함). 이 중 `levelname.txt`, `THIRD_PARTY_NOTICES.txt`, `ROLLBACK_v1.4.48_TO_v1.4.43.txt`를 제외한 **55개**는 이력·패치 노트 성격으로 검토 대상이지만, 복구 정보이므로 삭제 확정이 아닙니다.
- Git blob SHA가 일치하는 2쌍: BP/RP의 `pack_icon.png`와 `level.dat` / `level.dat_old`. **각 경로별 의미가 있으므로 중복 제거 금지**.
- 주요 문서 7개에서 상대 링크 34개를 확인한 범위에서는 **깨진 링크 미발견**. 이는 문서 전체 링크 검사 완료를 뜻하지 않습니다.

## 2. 불필요 파일 정리 판단

| 대상 | 판단 | 처리 기준 |
|---|---|---|
| `source/world`의 과거 패치·변경 기록 55개 | **보류: 정리/문서 이관 후보** | 플레이 패키지에서 뺄 필요가 있다면 보존용 아카이브/문서와 바이트 비교·매니페스트 재생성·패키징/회귀검증 후 사용자 승인으로 별도 변경 |
| `source/world/level.dat_old` | **보존** | 월드 복구 파일로 간주, 무단 삭제 금지 |
| BP/RP 각각의 `pack_icon.png` | **보존** | 경로가 달라 팩별 아이콘 참조 가능 |
| `THIRD_PARTY_NOTICES.txt` | **보존** | 저작권·외부 자산 고지 보존 |
| `SOURCE-MANIFEST.json` | **보존** | 정확한 294개 파일 정합성·해시 검증 |
| `docs/V1.4.131-*.md` | **보존** | 현재 원본 바이너리를 확보하지 못해 패키지별 파일명/해시/의존성·실게임 정정의 복구 증거 |
| 과거 브랜치 16개(`main` 외) | **삭제 보류** | 실험·QA·릴리스 재현 이력으로 사용 가능. 동일 병합 이력이라는 이유로 일괄 삭제하지 않음 |
| 기존 Stable/Alpha/TEST 릴리스·태그 | **보존** | 롤백·사용자 설치 파일 보존 |
| 오래된 README 날짜별 공지 | **정리** | 최신 상태를 맨 앞에, 역사 기록을 하단에 배치해 내용은 보존 |

**이번 문서 정리에서 실제 파일 삭제/이동, 게임 소스 변경, 팩·월드·플레이어 데이터 변경은 하지 않습니다.** 후보의 삭제/이관 여부는 별도 사용자 승인 후 진행합니다. 정확한 파일을 제거하면 `SOURCE-MANIFEST.json`과 `.mcworld` 결과가 바뀌므로 단순 쓰레기 제거가 아닙니다.

## 3. 브랜치와 개발 상태 구분

- 점검 시작 시 `dev`는 `main`보다 **21커밋 뒤**, 별도 독자 커밋 **0개**로 조회됐습니다. 안전한 fast-forward 동기화가 가능한 조건이며, 실제 수행 여부는 **각 브랜치 SHA 재확인**으로 판정합니다. force push/이력 재작성은 금지합니다.
- `release/v1.4.131-stable-preparation-20261022` 등 v1.4.131 관련 준비 브랜치에도 `source/world/behavior_packs/Mechanics_RPG/manifest.json` 버전은 **1.4.48**입니다. 이름만으로 1.4.131 코드를 가지고 있다고 간주하지 않습니다.
- [PR #19](https://github.com/geumyi22/Mechanics-RPG/pull/19), [#18](https://github.com/geumyi22/Mechanics-RPG/pull/18), [#17](https://github.com/geumyi22/Mechanics-RPG/pull/17) 등은 문서/도구 변경 이력. PR 병합이 로컬 v1.4.131 본체 배포를 뜻하지 않습니다.
- [Issue #13](https://github.com/geumyi22/Mechanics-RPG/issues/13)은 차기 Stable의 핵심 차단 항목으로 유지합니다. 이력상 과거 P3.5 보호 실패와 이후 **갑옷 거치대 보호 사용자 보고 PASS(빌드/검증 범위 불명)**가 모두 존재합니다. 카드 술사는 일부 기능만 사용자 보고 PASS입니다.

## 4. 원본 파일 없는 v1.4.131 복구·승격 방침

1. 우선 기존 [v1.4.48 Stable](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.48), [v1.4.118 TEST](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.118)의 **실제 배포 파일과 소스 버전 차이**를 명시적으로 분리하여 확보·비교합니다. v1.4.118 자동 생성 Source code ZIP은 동일 게임 월드 소스가 아닙니다.
2. 과거 [v1.4.131 VV 감사](V1.4.131-VV-INDEPENDENT-AUDIT-20261022.md)의 파일명·크기·해시를 복구 식별자로 사용합니다. 원본이 없을 때 **해시로 바이너리를 재생성할 수는 없습니다**.
3. 원본 없이 재구성한다면 별도 candidate 브랜치에서 요구 기능을 재구현하고 **새 빌드의 정체/검증 범위**를 명시합니다. 확인 없이 v1.4.131의 원본과 동일한 결과라고 주장하지 않습니다.
4. 특히 BP 4개/RP 3개 통합 및 **별도 외부 BP 1개/RP 3개** 의존성이 있던 기록을 보존합니다. 설치 상태·라이선스·Vibrant Visuals 실제 그래픽 모드는 여전히 확인 대상입니다.
5. `SOURCE-MANIFEST.json` 재생성, `tools/validate.py`, `tools/package.py`, `tools/verify_package.py`, CI 및 결과물 SHA-256 비교가 필요합니다. **GitHub CI PASS는 Bedrock E2E PASS가 아닙니다**.
6. 실게임 회귀 대상은 직업/스킬·상점·보호·NPC·아공간·저장/재접속·멀티플레이, 카드 술사, 그래픽 모드입니다. E2E 미실행 시 `NOT RUN`으로 남기고, 알고 있는 치명적 데이터 손실/회귀가 있다면 Stable 배포를 중단합니다.
7. 사용자 원본 `.mcworld`/LevelDB 및 플레이어 정보는 공개 범위 검사 전 외부 GitHub Release나 소스에 게시하지 않습니다.

## 5. 변경 후 확인과 인계

- 이 점검의 문서 수정 범위는 **README 정리 + 본 보고서 작성**입니다. 게임의 BP/RP, LevelDB, `source/world/`, `SOURCE-MANIFEST.json`, 빌드·릴리스 스크립트, 태그·Release를 수정하지 않습니다.
- 문서 브랜치/PR에 대한 CI가 성공했는지 별도 확인합니다. 검사를 수행하지 않았으면 PASS로 적지 않습니다.
- 다음 우선순위: **파일 삭제 결정보다 먼저 v1.4.131 복구 경로/배포 증거 확인** → 불필요 문서 아카이브 범위 결정 → 승인된 항목만 변경 → 정적/패키징 및 실제 필요한 E2E 검사.

참고: [GitHub README](../README.md), [현재 로컬 상태](CURRENT-STATUS-v1.4.134-20261024.md), [인수인계](../HANDOFF.md), [테스트 정책](../TESTING.md), [릴리스 채널](RELEASE-CHANNELS.md).
