# Subspace Development Status

기준일: 2026-10-04

## Stable conclusion

현재 안정화 기준은 **v1.4.48 SAFE GUARD**입니다.

- active capacity: 27칸 (9×3)
- storage: player dynamic property v3 + journal/stage recovery
- historical 36-slot array 유지
- v1.4.42~43에서 실기기 확인된 상자형 UI 경로 사용
- v1.4.44~47 DDUI/native/bridge 실험은 stable 경로에서 제거

## Device history

| 버전 | 결과 | 범위 |
|---|---|---|
| v1.4.37 | 부분 PASS | native item renderer |
| v1.4.40 | FAIL | 72-button combined UI |
| v1.4.41 | 부분 PASS | layout, inventory binding 실패 |
| v1.4.42 | PASS | 9×3 Subspace + inventory/hotbar UI/item render |
| v1.4.43 | PASS | 확대 UI + stack count |
| v1.4.44 | PASS | DDUI no-flicker proof 범위 |
| v1.4.45 | 미검증 | dual UI |
| v1.4.46 | 미검증 | native storage proof |
| v1.4.47 | FAIL | DDUI chest bridge |
| v1.4.48 | stable 복귀 | v1.4.43 경로 + SAFE GUARD |

PASS는 해당 항목 범위의 실기기 확인이며 전체 RPG 회귀 E2E가 아닙니다.

## SAFE GUARD

보관 거부:
- Shulker/Bundle → `아공간이 셜커를 거부합니다.`
- custom skill/weapon, durability, enchantment, custom name/Lore, dynamic properties → `아공간이 그 힘을 버티지 못합니다.`

명시적 안전 custom stack (`sheriff_bullet`, `sheriff_bullet_bundle`)은 기존 허용 규칙을 유지합니다.

## Data safety

다음 키는 삭제/초기화 금지:
- `geumyi:subspace_v3_head`
- `geumyi:subspace_v3_stage`
- `geumyi:subspace_v3_journal`
