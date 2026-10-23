# Mechanics RPG — 현행 개발/배포 상태 (2026-10-24)

> **단일 현행 인계 페이지.** 이전 문서의 날짜별 기록은 당시 상태의 역사 자료입니다. 버전 번호가 더 높다고 Github main이나 Stable에 반영된 것은 아닙니다.

## 한눈에 보는 구분

| 분류 | 버전 / 상태 | 확인 범위 |
|---|---|---|
| 채팅에서 제작한 최신 시험본 | **v1.4.134 TEST** | 카드 술사 Spread/Spring 및 J♠ 기사 수정; 정적/모의 검사 기록 존재. 정확한 패키지의 Minecraft Bedrock E2E **NOT RUN** |
| GitHub `main/source/world` | **v1.4.48 SAFE GUARD** | 294개 소스 기준, 최신 시험본과 **상이** |
| 최신 GitHub Stable(비 Pre-release) | [v1.4.48](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.48) | 해당 빌드의 full exact-package Bedrock E2E **NOT RUN** |
| 최신 공개 Pre-release | [v1.4.118 TEST](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.118) | 월드/애드온 첨부, 별도 TEST; 기존 v1.4.64 Alpha 보존 |
| 마지막 전체 실게임 릴리즈 게이트 PASS | [v1.4.20](https://github.com/geumyi22/Mechanics-RPG/releases/tag/v1.4.20) | 당시 명시된 E2E 범위에 한함 |
| v1.4.134 GitHub 소스/릴리즈 | **미반영·미게시** | 이번 문서 정리 커밋은 게임 파일을 변경하지 않음 |

이 페이지가 가리키는 `main` 기준 커밋(문서 정리 직전)은 `bc5c68b026feee32801fbad0e4d2d2868f650deb`입니다. 이 커밋의 CI PASS는 v1.4.134의 게임 테스트 결과가 아닙니다.

## v1.4.134 — 로컬 시험본 출처 및 파일

2026-10-22 생성된 사용자 월드 기반 시험 패키지. **개인 세계 데이터/플레이어 정보가 포함될 수 있어 이 문서에는 바이너리를 첨부하지 않습니다.**

| 파일 | 크기(bytes) | SHA-256 |
|---|---:|---|
| `Mechanics_RPG_v1.4.134_Spread_Spring_Knight_Combat_VV_TEST.mcworld` | 1,783,206 | `26ba27465d197d6dae130d173ce717bced465c5119585df5aff0518edeca98ed` |
| `Mechanics_RPG_v1.4.134_Spread_Spring_Knight_Combat_VV_TEST.mcaddon` | 766,090 | `6c3aef789d52eef9aeb8bd1fca769bff8b86f15cc6af4a90ea4db3ae00bdd06f` |
| `Mechanics_RPG_v1.4.134_Spread_Spring_Knight_Combat_VV_TEST_SOURCE_NO_DB.zip` | 859,738 | `a8373b93b51765289f5bed781bd66c68062def952b06fb3cb5c31ab19feb72c7` |
| `Mechanics_RPG_v1.4.134_Spread_Spring_Knight_Combat_VV_TEST_COMPLETE_BUNDLE.zip` | 3,219,050 | `039671014e19a9609245a3f455d3739ac115d96caee7dacaac69c4713b697edf` |

ChatGPT 대화/개인 백업 자료가 파일 출처입니다. GitHub 릴리즈 자산이 아니며, GitHub 태그 자동 생성 소스 ZIP과도 다릅니다. 과거 검사 기록은 JSON/JS/PNG 파싱, ZIP CRC, 모의 테스트 PASS 및 월드 LevelDB 바이트 보존입니다. **실제 Minecraft에서 실행한 테스트가 아닙니다.**

### 카드 술사 수정 이력 및 현행 확인 항목

- **v1.4.132:** 몬스터를 조준하면 스킬 입력이 실패하는 문제와 골렘 몸통/목 판정 문제를 겨냥한 시험 수정. 실기기 재검증 필요.
- **v1.4.133:** 손 대신 다리에 표시되는 카드, J♠ 기사 미소환, K♠ 큰 3D 조약돌(2×2×2블록 크기) 투사체를 겨냥한 시험 수정. 이후 사용자가 기사 외형 및 공격 실패를 보고함.
- **v1.4.134:** **Spread** 54장(틱당 3장; 약 0.9초, 20TPS 가정), **Spring** 54장(틱당 2장; 약 1.35초) 연속 발사와 짧은 탭 후 연출 계속; **J♠ 기사** 3명, 20초 지속, J 공유 쿨타임 40초, 모델/걷기/공격·몬스터 추적 모의 테스트 보완.
- 실제 베드락에서 **카드 손 부착·발사 모습, J♠ 기사 외형·추적·타격, K♠ 조약돌 렌더링, 입력 종류(PC/모바일)**를 확인해야 함. 모의 테스트의 성공을 실제 해결로 단정하지 않음.
- 이전 확정 원칙: Spread/Spring/Thumb Fan은 하나의 덱 모드, 등급 J/Q/K/Joker는 문양 간 **동일 등급 공유 쿨타임**, 일반 30블록 및 팔라스 유도 70블록, 골렘·기사 아군 보호, 왕관 범위 **지름 16블록**, 유저에게 개발/시스템 메시지 노출 금지.

## 그래픽/외부 애드온 의존성

기존 사용자 맵의 내부 **BP 4개, RP 3개**를 보존합니다. 포함된 P3/P4 팩은 과거 후보에서 `pbr` 선언을 보완했지만 이것만으로 **Vibrant Visuals 활성화/호환이 검증된 것이 아닙니다**.

기존 세계에서 참조하던 **외부 BP 1개·RP 3개**의 실제 파일이 후보 ZIP에 없습니다. 삭제해서 기능을 우회하지 말고, 설치된 실제 팩 매니페스트/Content Log와 기기 그래픽 설정을 확인해야 합니다. 상세 감사 기록: [v1.4.131 VV 감사](V1.4.131-VV-INDEPENDENT-AUDIT-20261022.md).

## 사용자 월드/기능 불변조건

1. 사용자 구조물, LevelDB, `level.dat`, 플레이어 기록, NPC, 상점, 퀘스트, 기존 직업 및 메인 월드 원본을 보존. 최신 시험본은 **복사본에만 적용**.
2. 아공간 v3 저장키 3종(`head/stage/journal`), 역사적 overflow migration 및 위험 아이템 저장 차단을 임의 삭제하지 않음.
3. 사용자 결정상 **중세 마을은 사용자가 직접 건축**. 과거 생성 도시/Side Nature v4는 승인된 최종 결과물이 아님. [현행 월드 결정](CURRENT-WORLD-WORK.md).
4. 이전 Stable/Pre-release 태그, 브랜치, Release, 복구 근거를 강제 삭제/덮어쓰기 금지.
5. 사용자 직접 보고: 갑옷 거치대 보호는 특정 빌드에서 실기기 PASS, 카드 술사는 일부 기능 PASS. 정확한 빌드별 전체 회귀 PASS로 일반화 금지. [세부 기록](V1.4.131-USER-VERIFICATION-20261022.md).

## 릴리즈 및 GitHub 동기화 — 해야 할 일

1. **소스 불일치부터 해결:** v1.4.134 `SOURCE_NO_DB.zip`의 BP/RP와 현재 v1.4.48 `source/world`을 비교. 공개 가능한지 에셋 라이선스·월드 개인정보·팩 의존성을 검사하고, 보호된 별도 `candidate/` 브랜치에서 일치하는 게임 소스만 단계적으로 반영.
2. `SOURCE-MANIFEST.json`을 새 소스 기준으로 재생성하고 `tools/validate.py`, `tools/package.py`, `tools/verify_package.py` 검증. 성공한 GitHub CI가 실제 동일 소스에 대해 실행됐는지 확인.
3. **Bedrock E2E는 별도 기록**: Spread/Spring, J♠, K♠, 손 위치, 7팩/P3.5/P4, 인벤토리·기존 직업, 저장·재진입, Vibrant Visuals 실제 모드 전환.
4. 기존 `tools/publish-v1.4.131-test.ps1`, `tools/publish-v1.4.131-vv-rc.ps1`은 **v1.4.131 전용 파일명·태그·해시**를 전제함. v1.4.134에 그대로 실행하지 말고, 실제 검사된 산출물과 명시적 TEST 채널에 맞게 조정. 이미 있는 자동화 도구를 중복 제작하지 않음.
5. 공개 릴리즈라면 `mcworld`에 들어갈 사용자 개인정보/플레이 데이터 공개 적합성을 먼저 확인. 미검증 시험본은 **Stable로 표시 금지**. 채팅에서 개발한 코드만 GitHub에 공개했더라도 릴리즈/실게임 검증이 자동 완료되지는 않음.

**이 문서 갱신은 문서와 상태 기록만 수정합니다.** 새로운 GitHub 게임 바이너리, 태그, 릴리즈를 생성하거나 Stable 승격을 뜻하지 않습니다.
