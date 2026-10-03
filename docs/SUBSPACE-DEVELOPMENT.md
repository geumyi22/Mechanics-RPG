# Subspace Development Status

기준일: 2026-10-03

이 문서는 v1.4.20 정식 Release 이후 진행된 **아공간(Subspace)** 개발의 검증 상태를 정리합니다.

## 현재 개발 기준

- 개발 스냅샷: **v1.4.46 SUBSPACE_NATIVE_STORAGE_PROOF_TEST**
- 정식 Release 기준선: **v1.4.20** (변경하지 않음)
- 활성 아공간 목표 용량: **27칸 (9×3)**
- 역사적 v3 저장 배열: 36칸 구조를 유지해 기존 데이터 절단 방지
- 저장 방식: 플레이어별 dynamic property + journal/stage 복구
- 보안관/사신 및 기타 직업 시스템은 아공간 작업 범위 밖

## 실기기 검증 이력

| 버전 | 결과 | 확인 내용 |
|---|---|---|
| v1.4.37 | 부분 PASS | 9×4 본체 native item renderer는 표시 성공. 넣기 ActionForm 아이콘은 missing texture. 한국어 이름은 표시 성공. |
| v1.4.40 | FAIL | 72버튼 결합 UI가 의도한 상자 형태로 렌더링되지 않음. 사용 금지 이력. |
| v1.4.41 | 부분 PASS | 바닐라 소형 상자형 레이아웃은 표시됐으나 실제 플레이어 인벤토리 데이터 바인딩 실패. |
| v1.4.42 | PASS (UI 범위) | 9×3 아공간 + 인벤토리/핫바 결합 UI와 아이템 렌더링을 실기기에서 확인. |
| v1.4.43 | PASS (UI 범위) | 확대된 상자 UI와 스택 수량 표시 확인. 단, ActionForm 특성상 넣기/빼기 시 닫힘→재오픈 깜빡임 존재. |
| v1.4.44 | PASS (DDUI 범위) | CustomForm DDUI에서 조약돌 ×64 넣기/빼기 시 화면을 닫지 않고 상태가 갱신되는 무깜빡임 동작 확인. |
| v1.4.45 | 미검증 | 상자형/무깜빡임 DDUI를 같은 저장 데이터로 선택 가능하게 한 이중 모드. 두 UI를 하나로 합친 버전은 아님. |
| v1.4.46 | 미검증 | minecraft:storage_item + bundle_interaction 기반 격리된 네이티브 저장 테스트 아이템. 기존 v3 데이터와 연결하지 않음. |

위 PASS 표기는 **해당 항목에 한정된 실기기 확인**이며 전체 RPG 회귀 E2E PASS를 뜻하지 않습니다.

## 현재 기술 결론

### ActionForm 상자형 UI
- 9×3 아이콘 격자/상자 비주얼 구현 가능.
- 클릭 응답 시 폼이 닫히므로 같은 ActionForm을 다시 열 때 시각적 깜빡임이 발생.

### DDUI CustomForm
- 열린 상태에서 버튼 콜백/Observable 갱신 가능하며 실기기에서 무깜빡임 확인.
- @minecraft/server-ui 2.1.0 기준으로 9×3 아이콘 버튼 격자를 ActionForm 상자 UI와 동일하게 구성할 공개 API가 없음.

### Native storage proof
- v1.4.46에서 기존 아공간을 건드리지 않고 별도 `geumyi:subspace_native_test` 아이템으로 검증 중.
- 성공 여부를 확인하기 전 기존 v3 저장 데이터를 native storage로 마이그레이션하지 않음.

## 데이터 안전 원칙

- `geumyi:subspace_v3_head`
- `geumyi:subspace_v3_stage`
- `geumyi:subspace_v3_journal`

위 저장 키와 복구 저널은 임의 삭제하지 않습니다.
27칸 전환 시 역사적 28~36번 슬롯의 아이템은 충분한 인벤토리 공간이 있을 때만 안전 이전합니다.

## 다음 게이트

v1.4.46을 정식 기준으로 승격하기 전 최소 확인:

1. native test item이 실제 Bedrock에서 열리는지
2. 보관/꺼내기에 ActionForm식 전체 화면 깜빡임이 없는지
3. 27칸 표시/용량이 기대대로 동작하는지
4. 재접속/월드 재시작 후 테스트 저장 내용 유지
5. 기존 v3 아공간 데이터에 영향이 없는지
6. 보안관/사신 등 핵심 회귀 테스트

**정식 Release/tag/main 승격은 위 Bedrock E2E 이후에만 진행합니다.**
