import { world, system, ItemStack, EquipmentSlot } from "@minecraft/server";

// Mojang의 현재 vanilla sample에서 minecraft:burns_in_daylight를 사용하는 타입들.
// 커스텀 스컬크 좀비는 BP에서 해당 컴포넌트를 직접 제거했고, 아래 목록은 바닐라 몹 보호용이다.
const DAYLIGHT_BURNING_TYPES = new Set([
  "minecraft:phantom",
  "minecraft:magma_cube",
  "minecraft:stray",
  "minecraft:bogged",
  "minecraft:zombie",
  "minecraft:drowned",
  "minecraft:skeleton",
  "minecraft:zombie_horse",
  "minecraft:zombie_nautilus",
  "minecraft:zombie_villager",
  "minecraft:zombie_villager_v2"
]);
const SUN_GUARD = "geumyi:sun_guard";

function safe(fn, fallback = undefined) {
  try { const v = fn(); return v === undefined ? fallback : v; } catch { return fallback; }
}
function isDaytime() {
  const t = safe(() => world.getTimeOfDay(), 18000);
  return t >= 0 && t < 12000;
}
function isDirectFireBlock(typeId) {
  return typeId === "minecraft:fire" || typeId === "minecraft:soul_fire" ||
         typeId === "minecraft:lava" || typeId === "minecraft:flowing_lava";
}
function inDirectFireSource(entity) {
  const d = entity.dimension;
  const l = entity.location;
  for (const y of [0.1, 1.0]) {
    const b = safe(() => d.getBlock({ x: Math.floor(l.x), y: Math.floor(l.y + y), z: Math.floor(l.z) }));
    if (b && isDirectFireBlock(b.typeId)) return true;
  }
  return false;
}
function underBurningSun(entity) {
  if (!DAYLIGHT_BURNING_TYPES.has(entity.typeId)) return false;
  if (!isDaytime()) return false;
  const dimId = safe(() => entity.dimension.id, "");
  if (dimId !== "minecraft:overworld" && dimId !== "overworld") return false;
  if (inDirectFireSource(entity)) return false;
  const l = safe(() => entity.location);
  if (!l) return false;
  const sky = safe(() => entity.dimension.getSkyLightLevel({ x: l.x, y: l.y + 1.0, z: l.z }), 0);
  return sky >= 14;
}

// 빈 머리 슬롯에 렌더 정의가 없는 내부용 wearable을 장착한다.
// vanilla burns_in_daylight가 "머리에 장비가 있음"으로 판단하게 하여 햇빛 점화 자체를 막는 것이 목적이다.
// 이미 투구를 쓰고 있는 몹은 기존 장비를 절대 교체하지 않는다.
function ensureSunGuard(entity) {
  if (!DAYLIGHT_BURNING_TYPES.has(entity.typeId)) return false;
  const eq = safe(() => entity.getComponent("minecraft:equippable"));
  if (!eq) return false;
  const head = safe(() => eq.getEquipment(EquipmentSlot.Head));
  if (head) return true;
  const guard = safe(() => new ItemStack(SUN_GUARD, 1));
  if (!guard) return false;
  return safe(() => eq.setEquipment(EquipmentSlot.Head, guard), false) === true;
}

function protectEntity(entity) {
  if (!entity || !DAYLIGHT_BURNING_TYPES.has(entity.typeId)) return;
  ensureSunGuard(entity);
  // 이전 버전에서 이미 붙은 햇빛 화염은 한 번 제거한다. 실제 불/용암 안에서는 제거하지 않는다.
  if (underBurningSun(entity)) safe(() => entity.extinguishFire(false));
}
function protectAll() {
  const dim = safe(() => world.getDimension("overworld"));
  if (!dim) return;
  for (const type of DAYLIGHT_BURNING_TYPES) {
    for (const e of safe(() => dim.getEntities({ type }), [])) protectEntity(e);
  }
}
function cleanupGuardDrops() {
  for (const dimId of ["overworld", "nether", "the_end"]) {
    const dim = safe(() => world.getDimension(dimId));
    if (!dim) continue;
    for (const e of safe(() => dim.getEntities({ type: "minecraft:item" }), [])) {
      const stack = safe(() => e.getComponent("minecraft:item")?.itemStack);
      if (stack?.typeId === SUN_GUARD) safe(() => e.remove());
    }
  }
}

safe(() => world.afterEvents.entitySpawn.subscribe(ev => {
  const e = ev.entity;
  if (!DAYLIGHT_BURNING_TYPES.has(safe(() => e.typeId, ""))) return;
  system.run(() => protectEntity(e));
}));

// 장비 슬롯이 없는 예외 엔티티를 위한 안전망: 실제 불/용암이 아닌 햇빛 fireTick만 취소한다.
safe(() => world.beforeEvents.entityHurt.subscribe(ev => {
  const e = ev.hurtEntity;
  if (ev.damageSource?.cause !== "fireTick") return;
  if (!underBurningSun(e)) return;
  ev.cancel = true;
  system.run(() => safe(() => e.extinguishFire(false)));
}));

// 월드 로딩 전에 존재하던 몹도 즉시 처리하고, 이후 장비가 없어지는 경우를 저빈도로 보정한다.
system.runTimeout(protectAll, 1);
system.runInterval(protectAll, 20);
system.runInterval(cleanupGuardDrops, 20);
