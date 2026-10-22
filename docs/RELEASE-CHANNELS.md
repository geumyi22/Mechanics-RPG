# Release channels / 릴리즈 구분

> **검증 상태 정정 (2026-10-22):** 사용자가 갑옷 거치대 보호 PASS 및 카드 술사 부분 실게임 검증을 보고했습니다. 이는 아래 과거 TEST/미검증 안내를 일부 보완하나, 빌드·기능별 전체 E2E 확인이나 Stable 릴리즈 게시 완료를 뜻하지 않습니다. [확인 기록](V1.4.131-USER-VERIFICATION-20261022.md).


| 채널 | 의미 | GitHub 표시 |
|---|---|---|
| Stable | 일반 사용자용으로 제공할 의도가 있는 정식 배포. 치명적인 알려진 회귀는 포함하면 안 되며 실제 패키지와 배포 소스가 일치해야 함. E2E 미실행 시 별도 명시 | GitHub Release, `prerelease: false` |
| Beta/RC | 기능 통합을 끝내고 실제 게임에서 핵심 동작을 검증 중. 본격 안정화 전 단계 | GitHub Pre-release |
| Alpha/Canary | 신규 기능, 보호 실험, 모의 검증 등 불완전한 개발 실험 | 브랜치/아티팩트/Pre-release |
| Local-only | 채팅 생성 파일이며 GitHub 소스/릴리즈와 동일하다고 검증되지 않음 | 공개 릴리즈 없음 |

## 현재 버전 (2026-10-22)

- **Stable:** v1.4.48 (기존 Published Release 유지; full exact-package Bedrock E2E NOT RUN).
- **GitHub 최신 공개 실험판:** v1.4.118 TEST (Pre-release).
- **새로운 로컬 최신 작업본:** v1.4.131 Vibrant Visuals candidate (미게시, **실험판**). GitHub 소스에는 없는 코드와 별도 세계 데이터 포함.
- **마지막 full release-gate Bedrock E2E PASS:** v1.4.20.

릴리즈의 명칭이나 숫자가 커졌다고 자동으로 Stable이 되지 않습니다. 사용자가 Stable 배포를 요청하더라도 확인된 파괴/데이터 손상 가능성을 숨기지 않고 해결 또는 범위 제외 후 게시합니다.

## GitHub 릴리즈 작성 주의

- 태그 버전과 메니페스트 버전 일치, 빌드 출처에 속한 정확한 소스 ZIP 사용.
- 기존 `.github/workflows/release.yml`의 태그/manifest 검증 단계를 무력화하지 않음.
- 사용자가 만든 월드 DB/플레이어 데이터가 포함된 개인 월드 파일은 배포 전 포함 범위·공개 여부를 다시 점검.
- 기존 릴리즈 자산을 지우거나 태그를 강제 이동하지 않음.
- 테스트 파일을 stable처럼 재분류하지 않고 이력/리스크를 기록.
