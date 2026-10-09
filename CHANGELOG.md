# Changelog

## 2026-10-10 — v1.4.64 Hacker Redesign Alpha (Pre-release)

- 별도 개발 브랜치의 v1.4.64 실험본을 GitHub Pre-release로 배포, 공식 main v1.4.48 소스 및 기존 릴리스 보존
- 누락된 해커 아이템 아이콘 PNG 5개를 구분 가능한 임시 픽셀 디자인으로 보완
- source manifest 파일 목록/개수/SHA-256 재생성 및 정적/패키지 검사 PASS
- E2E는 지후의 정책에 따라 선택사항으로 운영; **이번 v1.4.64 실기기 E2E NOT RUN**, 버그 가능성 명시
- 과거 커밋/태그/릴리스와 미병합 실험 브랜치는 안전상 삭제하지 않음


## 2026-10-10 — GitHub documentation-only cleanup

- 월드 작업 최신 지시/실험/사용자 피드백 11건을 docs/CURRENT-WORLD-WORK.md에 통합
- README/HANDOFF/PROJECT-STATUS/ROADMAP/VERSION-MATRIX/TESTING 등 최신 경계 동기화
- 중복된 docs/GITHUB-RUNBOOK.md 및 docs/systems/RELEASE.md를 docs/DEVELOPMENT-WORKFLOW.md로 통합 후 삭제
- docs/ARCHITECTURE.md의 초기 v1.4.20 중심 표현을 현행 v1.4.48 기준으로 교정
- **source/world, manifest, 게임 코드, 빌드/릴리스 워크플로, 기존 태그/Release 일절 변경하지 않음**
- 신규 Bedrock full E2E를 실행하거나 v1.4.100 채팅 테스트 월드를 main에 반영한 것이 아님

## 2026-10-04 — Repository status cleanup

- v1.4.48 표기를 **“최신 정식 Release / full Bedrock E2E NOT RUN”**으로 통일
- v1.4.48을 “안정화 검증 완료”로 오해할 수 있는 문구 제거
- 마지막 full release-gate Bedrock E2E PASS 기준은 v1.4.20으로 명시
- 무기 3인칭 TEST1~28 실험 종료
- TEST22 계열에서 1인칭 보존은 실기기 확인했으나 3인칭 손잡이/손 정렬은 최종 해결하지 못함
- TEST1~28은 source/main/Release에 승격하지 않음

## 2026-10-04 — v1.4.48 SAFE GUARD release

- v1.4.43에서 실기기 확인된 9×3 상자형 아공간 구현으로 복귀
- 활성 아공간 27칸, 역사적 v3 36칸 저장 배열 및 overflow migration 유지
- 기존 v3 키 유지:
  - `geumyi:subspace_v3_head`
  - `geumyi:subspace_v3_stage`
  - `geumyi:subspace_v3_journal`
- 위험 아이템 저장 차단을 종류별 메시지로 명확화
  - 무기/스킬템/내구도/인챈트/이름/Lore/동적 속성 등: `아공간이 그 힘을 버티지 못합니다.`
  - 셜커/Bundle 계열: `아공간이 셜커를 거부합니다.`
- SAFE GUARD는 v1.4.48 원본 대비 `scripts/subspace.js` 1개만 변경
- 보안관/사신/직업/퀘스트/상점/햇빛 로직은 SAFE GUARD 작업 범위에서 변경하지 않음
- 사신 대낫/리볼버의 기존 1인칭 렌더는 릴리즈에서 변경하지 않음
- Static / deterministic package / ZIP CRC / re-extracted hashes PASS
- **v1.4.48 exact-package full Bedrock release-gate E2E는 NOT RUN**

## 2026-10-03 — v1.4.27 ~ v1.4.48 Subspace development

- v1.4.27~40: ActionForm/JSON UI/native renderer/36칸/결합 UI 실험
- v1.4.41~43: 9×3 아공간 + 인벤토리/핫바 상자형 UI로 수렴
- v1.4.42: 실기기에서 결합 UI와 아이템 렌더링 확인
- v1.4.43: 확대 UI/스택 수량 표시 확인, ActionForm 닫힘→재오픈 한계 유지
- v1.4.44: DDUI 무깜빡임 범위 실기기 확인
- v1.4.45~47: dual/native/bridge 계열 실험, 최종 경로로 채택하지 않음
- v1.4.48: v1.4.43 상자형 경로로 복귀

## 2026-09-29 — v1.4.20 first GitHub Release

- 실제 Bedrock release-gate E2E 8개 핵심 항목 PASS
- E2E 대상은 GitHub CI #31이 생성한 정확한 `.mcworld`
- release candidate SHA-256: `a4d099cb419cdda1da68ed734406a7a2885a6c72565ba10e6d2d9741fe0ced70`
- tag `v1.4.20` / GitHub Release 게시

## v1.4.20 — DEAD EYE VFX / RELOAD FIX

- 데드아이 보라색 총알/탄도 연출 유지
- 카메라 전부터 초록/노랑 확산 연출
- 준비시간 동안 6/6 자동 재장전
- 궁극기 준비 재장전은 일반 탄약 미소비
- 데드아이 30 피해/발
- 첫 GitHub 정식 Release
