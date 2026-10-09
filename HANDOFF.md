# Development Handoff

> **2026-10-10 최신 지시:** [월드/자연 지형 인수인계](docs/CURRENT-WORLD-WORK.md) 참조. 기존 중세 마을 자동 건축 계획은 과거 스냅샷입니다. 후지가 직접 마을을 만들기로 했고, 자연 지형 v4는 미승인입니다. 현재는 GitHub만 정리합니다.

> **2026-10-10 신규 설계 인계:** [중세 마을 v3 계획 및 다음 대화용 체크포인트](docs/HANDOFF-2026-10-10-MEDIEVAL-VILLAGE-v3.md)  
> 이 링크는 대화에서 합의한 **미착수 설계**를 기록합니다. 아래 본문은 GitHub main의 v1.4.48 정식 소스/검증 상태를 설명하며, 채팅에서 생성한 v1.4.100 테스트 월드나 도시 바이너리가 main에 반영된 것은 아닙니다.

기준일: 2026-10-04

## 현재 고정 기준

- `main`: **v1.4.48 SAFE GUARD latest release baseline**
- 분류: **full Bedrock E2E 미검증**
- source baseline: `source/world/`
- source manifest: `SOURCE-MANIFEST.json`
- baseline file count: **294**
- CI: static/package 검증
- v1.4.48 exact-package full Bedrock E2E: **NOT RUN**
- 마지막 full release-gate E2E PASS: **v1.4.20**

## 절대 보존

- `geumyi:subspace_v3_head`
- `geumyi:subspace_v3_stage`
- `geumyi:subspace_v3_journal`
- 기존 사신 대낫 1인칭 렌더 경로
- 기존 보안관 리볼버 1인칭 렌더 경로
- 기존 정상 직업/퀘스트/상점/햇빛 로직

## Subspace release behavior

- 9×3 / 27칸
- historical 36-slot save array 유지
- unsafe metadata-bearing item 저장 차단
- Shulker/Bundle 저장 차단
- SAFE GUARD 변경 범위는 v1.4.48 원본 대비 `scripts/subspace.js` 1개

## Weapon 3P — 종료 상태

- TEST1~5: attachable/geometry/pivot 계열 실패
- TEST6~21: rightItem/mesh/attachable/bow-style 등 여러 접근 실험
- TEST22: 원본 1인칭을 유지하는 third-person/rightItem 경로 재확인
- TEST23~28: 3인칭 회전/위치 튜닝
- 최종 결과: **1인칭 보존은 확인했지만 3인칭 손잡이 끝을 손에 정확히 정렬하지 못함**
- 사용자 지시로 TEST 종료
- **TEST1~28 어느 것도 source/main/Release에 포함하지 않음**

다시 시작할 경우 과거 TEST 수치를 검증된 기준으로 취급하지 말고, 별도 feature branch에서 렌더 구조부터 다시 검증합니다.

## 다음 개발 흐름

`feature → static/package CI → 실제 Bedrock E2E → main → matching tag/Release`

CI PASS ≠ Bedrock E2E PASS입니다.
