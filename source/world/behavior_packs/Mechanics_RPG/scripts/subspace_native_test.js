import { system, ItemStack } from '@minecraft/server';

const TEST_ITEM = 'geumyi:subspace_native_test';
const tell = (p, s) => { try { p.sendMessage(s); } catch {} };

function playerInventory(p) {
  return p.getComponent('minecraft:inventory')?.container;
}

function firstEmpty(c) {
  if (!c) return -1;
  for (let i = 0; i < c.size; i++) if (!c.getItem(i)) return i;
  return -1;
}

function giveProofItem(p) {
  const c = playerInventory(p);
  if (!c) { tell(p, '§c인벤토리를 읽지 못했어.'); return; }
  const slot = firstEmpty(c);
  if (slot < 0) { tell(p, '§e인벤토리 빈칸 1칸이 필요해.'); return; }
  try {
    const item = new ItemStack(TEST_ITEM, 1);
    c.setItem(slot, item);
    const placed = c.getItem(slot);
    let size = '?';
    try { size = String(placed?.getComponent('minecraft:inventory')?.container?.size ?? '?'); } catch {}
    tell(p, `§a네이티브 아공간 테스트 아이템 지급 완료. 내부 컨테이너 감지 크기: ${size}`);
    tell(p, '§7기존 아공간 저장 데이터와 연결되지 않은 독립 테스트야. 조약돌 같은 테스트용 아이템만 넣어 봐.');
  } catch (e) {
    tell(p, `§c네이티브 테스트 아이템 생성 실패: ${String(e)}`);
  }
}

function inspectHeld(p) {
  const c = playerInventory(p);
  if (!c) { tell(p, '§c인벤토리를 읽지 못했어.'); return; }
  const held = c.getItem(p.selectedSlotIndex);
  if (!held || held.typeId !== TEST_ITEM) {
    tell(p, '§e네이티브 테스트 아공간을 손에 들고 다시 실행해 줘.');
    return;
  }
  try {
    const storage = held.getComponent('minecraft:inventory')?.container;
    if (!storage) { tell(p, '§cStorage Item 컨테이너 컴포넌트를 찾지 못했어.'); return; }
    let used = 0;
    for (let i = 0; i < storage.size; i++) if (storage.getItem(i)) used++;
    tell(p, `§a네이티브 컨테이너 감지 성공: size=${storage.size}, 사용 슬롯=${used}`);
  } catch (e) {
    tell(p, `§c네이티브 컨테이너 검사 실패: ${String(e)}`);
  }
}

system.afterEvents.scriptEventReceive.subscribe(ev => {
  const p = ev.sourceEntity;
  if (!p || p.typeId !== 'minecraft:player' || ev.id !== 'geumyi:subspace_native_test') return;
  const mode = String(ev.message ?? '').trim().toLowerCase();
  system.run(() => {
    if (!p.isValid) return;
    if (mode === 'inspect') inspectHeld(p);
    else if (mode === 'give' || mode === 'test') giveProofItem(p);
    else tell(p, '§e사용법: /scriptevent geumyi:subspace_native_test give 또는 inspect');
  });
});
