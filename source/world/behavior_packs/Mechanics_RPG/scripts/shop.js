import { world, system, ItemStack, EnchantmentTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

const SHOP_DATA = "geumyi:shop_v1";
const NPC_KEY = "geumyi:npc_key_v1";
const NPC_ANCHOR = "geumyi:npc_anchor_v1";
const MAX_SHOP_ITEMS = 24;
const SHOP_CATEGORIES = ["weapon", "armor", "material", "misc"];
const SHOP_CATEGORY_LABEL = {
  weapon: "무기",
  armor: "방어구",
  material: "재료",
  misc: "기타"
};

function safe(fn, fallback = undefined) {
  try { const v = fn(); return v === undefined ? fallback : v; } catch { return fallback; }
}
function tick() { return system.currentTick; }
function text(v, fallback = "") {
  const s = String(v ?? "").trim();
  return s.length ? s.slice(0, 500) : fallback;
}
function clampInt(v, min, max, fallback = 0) {
  const n = Number.parseInt(String(v ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
function parseJson(raw, fallback) {
  if (typeof raw !== "string" || !raw.length) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
function msg(p, s) { safe(() => p.sendMessage(s)); }
function ensureGoldObjective() {
  safe(() => { if (!world.scoreboard.getObjective("rpg_gold")) world.scoreboard.addObjective("rpg_gold", "골드"); });
}
function gold(p) {
  ensureGoldObjective();
  const o = safe(() => world.scoreboard.getObjective("rpg_gold"));
  const id = safe(() => p.scoreboardIdentity);
  if (!o || !id) return 0;
  return safe(() => o.getScore(id), 0) ?? 0;
}
function changeGold(p, amount) {
  ensureGoldObjective();
  const o = safe(() => world.scoreboard.getObjective("rpg_gold"));
  if (!o) return false;
  return safe(() => { o.addScore(p, amount); return true; }, false);
}
function makeNpcKey() {
  return `N${tick().toString(36)}${Math.floor(Math.random() * 0xFFFFFF).toString(36)}`;
}
function ensureNpcKey(npc) {
  let key = safe(() => npc.getDynamicProperty(NPC_KEY));
  if (typeof key === "string" && key.length) return key;
  key = makeNpcKey();
  safe(() => npc.setDynamicProperty(NPC_KEY, key));
  return key;
}
function ensureNpcAnchor(npc) {
  const old = parseJson(safe(() => npc.getDynamicProperty(NPC_ANCHOR)), null);
  if (old && Number.isFinite(Number(old.x)) && Number.isFinite(Number(old.y)) && Number.isFinite(Number(old.z))) return old;
  const l = safe(() => npc.location);
  if (!l) return null;
  const r = safe(() => npc.getRotation(), { x: 0, y: 0 });
  const a = {
    x: Number(l.x), y: Number(l.y), z: Number(l.z),
    rx: Number(r?.x ?? 0), ry: Number(r?.y ?? 0),
    dimension: safe(() => npc.dimension.id, "minecraft:overworld")
  };
  safe(() => npc.setDynamicProperty(NPC_ANCHOR, JSON.stringify(a)));
  return a;
}
function defaultShop(npc) {
  const n = text(safe(() => npc.nameTag), "주민");
  return { title: `${n} 상점`, enabled: true, items: [] };
}
function inferCategory(typeId) {
  const id = String(typeId ?? "").toLowerCase();
  if (/(sword|bow|crossbow|trident|mace|spear|dagger|staff|axe|weapon)/.test(id)) return "weapon";
  if (/(helmet|chestplate|leggings|boots|shield|armor)/.test(id)) return "armor";
  if (/(ingot|nugget|raw_|diamond|emerald|coal|redstone|lapis|quartz|amethyst|copper|iron|gold|string|leather|bone|blaze|rod|shard|crystal)/.test(id)) return "material";
  return "misc";
}
function normalizeCategory(v, typeId) {
  const c = String(v ?? "").trim().toLowerCase();
  return SHOP_CATEGORIES.includes(c) ? c : inferCategory(typeId);
}
function normalizeProduct(p) {
  if (!p || typeof p !== "object") return null;
  const typeId = text(p.typeId, "").slice(0, 120);
  if (!typeId) return null;
  const lore = Array.isArray(p.lore) ? p.lore.map(v => String(v).slice(0, 50)).slice(0, 20) : [];
  const enchantments = Array.isArray(p.enchantments)
    ? p.enchantments.map(e => ({ id: text(e?.id, "").slice(0, 100), level: clampInt(e?.level, 1, 255, 1) })).filter(e => e.id).slice(0, 20)
    : [];
  const dynamic = p.dynamic && typeof p.dynamic === "object" ? p.dynamic : {};
  return {
    id: text(p.id, `S${tick().toString(36)}${Math.floor(Math.random() * 0xFFFFFF).toString(36)}`).slice(0, 48),
    typeId,
    category: normalizeCategory(p.category, typeId),
    localizationKey: text(p.localizationKey, "").slice(0, 150),
    displayName: text(p.displayName, "").slice(0, 80),
    nameTag: text(p.nameTag, "").slice(0, 255),
    lore,
    amount: clampInt(p.amount, 1, 255, 1),
    price: clampInt(p.price, 0, 100000000, 100),
    enabled: p.enabled !== false,
    durabilityDamage: clampInt(p.durabilityDamage, 0, 1000000, 0),
    enchantments,
    dynamic
  };
}
function normalizeShop(raw, npc) {
  const b = defaultShop(npc);
  const s = raw && typeof raw === "object" ? raw : b;
  const items = Array.isArray(s.items) ? s.items.map(normalizeProduct).filter(Boolean).slice(0, MAX_SHOP_ITEMS) : [];
  return {
    title: text(s.title, b.title).slice(0, 80),
    enabled: s.enabled !== false,
    items
  };
}
export function isShopConfigured(npc) {
  return typeof safe(() => npc.getDynamicProperty(SHOP_DATA)) === "string";
}
export function isShopEnabled(npc) {
  if (!isShopConfigured(npc)) return false;
  return getShop(npc).enabled;
}
export function getShop(npc) {
  return normalizeShop(parseJson(safe(() => npc.getDynamicProperty(SHOP_DATA)), null), npc);
}
function saveShop(npc, shop) {
  ensureNpcKey(npc);
  ensureNpcAnchor(npc);
  const normalized = normalizeShop(shop, npc);
  return safe(() => { npc.setDynamicProperty(SHOP_DATA, JSON.stringify(normalized)); return true; }, false);
}
function selectedItem(p) {
  const inv = safe(() => p.getComponent("minecraft:inventory"));
  const c = safe(() => inv.container);
  const slot = safe(() => p.selectedSlotIndex, 0);
  if (!c) return undefined;
  return safe(() => c.getItem(slot));
}
function captureDynamic(item) {
  const out = {};
  for (const id of safe(() => item.getDynamicPropertyIds(), [])) {
    const v = safe(() => item.getDynamicProperty(id));
    if (["string", "number", "boolean"].includes(typeof v)) out[id] = v;
    else if (v && typeof v === "object" && Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)) out[id] = { x: v.x, y: v.y, z: v.z };
  }
  return out;
}
function captureHeldProduct(p) {
  const it = selectedItem(p);
  if (!it) return null;
  const ench = safe(() => it.getComponent("minecraft:enchantable")?.getEnchantments(), []) ?? [];
  const dur = safe(() => it.getComponent("minecraft:durability"));
  return normalizeProduct({
    id: `S${tick().toString(36)}${Math.floor(Math.random() * 0xFFFFFF).toString(36)}`,
    typeId: it.typeId,
    category: inferCategory(it.typeId),
    localizationKey: safe(() => it.localizationKey, ""),
    displayName: "",
    nameTag: safe(() => it.nameTag, "") ?? "",
    lore: safe(() => it.getLore(), []) ?? [],
    amount: safe(() => it.amount, 1),
    price: 100,
    enabled: true,
    durabilityDamage: Number(safe(() => dur.damage, 0) ?? 0),
    enchantments: ench.map(e => ({ id: safe(() => e.type.id, ""), level: Number(e.level ?? 1) })).filter(e => e.id),
    dynamic: captureDynamic(it)
  });
}
function applyProductData(stack, p) {
  if (p.nameTag) safe(() => stack.nameTag = p.nameTag);
  if (p.lore?.length) safe(() => stack.setLore(p.lore));
  const d = safe(() => stack.getComponent("minecraft:durability"));
  if (d && p.durabilityDamage > 0) safe(() => d.damage = Math.min(Number(d.maxDurability ?? p.durabilityDamage), p.durabilityDamage));
  const ec = safe(() => stack.getComponent("minecraft:enchantable"));
  if (ec && p.enchantments?.length) {
    const list = [];
    for (const e of p.enchantments) {
      const t = safe(() => EnchantmentTypes.get(e.id));
      if (t) list.push({ type: t, level: Math.min(Number(t.maxLevel ?? e.level), e.level) });
    }
    if (list.length) safe(() => ec.addEnchantments(list));
  }
  for (const [id, v] of Object.entries(p.dynamic ?? {})) safe(() => stack.setDynamicProperty(id, v));
  return stack;
}
function giveProduct(p, product) {
  const inv = safe(() => p.getComponent("minecraft:inventory"));
  const c = safe(() => inv.container);
  if (!c) return false;
  let remain = Math.max(1, Number(product.amount ?? 1));
  try {
    const probe = new ItemStack(product.typeId, 1);
    const maxStack = Math.max(1, Number(probe.maxAmount ?? 64));
    while (remain > 0) {
      const stack = applyProductData(new ItemStack(product.typeId, Math.min(maxStack, remain)), product);
      const made = Number(stack.amount ?? 1);
      const leftover = c.addItem(stack);
      if (leftover) safe(() => p.dimension.spawnItem(leftover, p.location));
      remain -= made;
    }
    return true;
  } catch { return false; }
}
function productNameMessage(product) {
  if (product.displayName) return { rawtext: [{ text: product.displayName }] };
  if (product.nameTag) return { rawtext: [{ text: product.nameTag }] };
  if (product.localizationKey) return { rawtext: [{ translate: product.localizationKey }] };
  return { rawtext: [{ text: product.typeId }] };
}
function productButtonMessage(product) {
  const rawtext = [{ text: "§f" }];
  if (product.displayName) rawtext.push({ text: product.displayName });
  else if (product.nameTag) rawtext.push({ text: product.nameTag });
  else if (product.localizationKey) rawtext.push({ translate: product.localizationKey });
  else rawtext.push({ text: product.typeId });
  rawtext.push({ text: ` §7×${product.amount}\n§6${product.price} 골드` });
  return { rawtext };
}

export async function showShopMenu(p, npc) {
  const shop = getShop(npc);
  if (!shop.enabled) return msg(p, "§7현재 닫혀 있는 상점이야.");
  const visible = shop.items.filter(x => x.enabled);
  const form = new ActionFormData()
    .title("§6메크닉스")
    .body(`§e${shop.title}
§7보유 골드: §6${gold(p)}

§f상품 분류를 선택해.`);
  const actions = [];
  for (const c of SHOP_CATEGORIES) {
    const count = visible.filter(x => normalizeCategory(x.category, x.typeId) === c).length;
    if (!count) continue;
    const color = c === "weapon" ? "§c" : c === "armor" ? "§b" : c === "material" ? "§e" : "§d";
    form.button(`${color}${SHOP_CATEGORY_LABEL[c]}
§7상품 ${count}개`);
    actions.push(c);
  }
  if (!visible.length) { form.button("§8등록된 상품 없음"); actions.push("noop"); }
  form.button("§7나가기"); actions.push("close");
  const r = await form.show(p).catch(() => null);
  if (!r || r.canceled || r.selection === undefined) return;
  const a = actions[r.selection];
  if (SHOP_CATEGORIES.includes(a)) system.run(() => showShopCategory(p, npc, a));
}

async function showShopCategory(p, npc, category) {
  const shop = getShop(npc);
  const items = shop.items.filter(x => x.enabled && normalizeCategory(x.category, x.typeId) === category);
  const form = new ActionFormData()
    .title("§6메크닉스")
    .body(`§e${shop.title} §7> §f${SHOP_CATEGORY_LABEL[category]}
§7보유 골드: §6${gold(p)}

§f상품을 선택해.`);
  const actions = [];
  for (const pr of items) { form.button(productButtonMessage(pr)); actions.push(pr.id); }
  form.button("§7분류 선택으로 돌아가기"); actions.push("back");
  const r = await form.show(p).catch(() => null);
  if (!r || r.canceled || r.selection === undefined) return;
  const a = actions[r.selection];
  if (a === "back") return system.run(() => showShopMenu(p, npc));
  const product = shop.items.find(x => x.id === a && x.enabled);
  if (product) system.run(() => showPurchaseDetail(p, npc, product, category));
}

async function showPurchaseDetail(p, npc, product, category) {
  const shop = getShop(npc);
  const current = shop.items.find(x => x.id === product.id && x.enabled);
  if (!current || !shop.enabled) return system.run(() => showShopMenu(p, npc));
  const balance = gold(p);
  const maxTimes = current.price <= 0 ? 64 : Math.max(0, Math.min(64, Math.floor(balance / current.price)));
  const name = productNameMessage(current);
  const body = { rawtext: [] };
  body.rawtext.push(...name.rawtext);
  body.rawtext.push({ text: ` §7×${current.amount}

§f가격: §6${current.price} 골드
§f보유 골드: §6${balance}
§7분류: ${SHOP_CATEGORY_LABEL[normalizeCategory(current.category, current.typeId)]}` });
  const form = new ActionFormData().title("§6메크닉스").body(body);
  const actions = [];
  form.button(`§a1회 구매
§7${current.amount}개 · §6${current.price}G`); actions.push(1);
  form.button(`§e5회 구매
§7${current.amount * 5}개 · §6${current.price * 5}G`); actions.push(5);
  form.button(`§b최대 구매
§7${maxTimes}회`); actions.push("max");
  form.button("§7상품 목록으로"); actions.push("back");
  const r = await form.show(p).catch(() => null);
  if (!r || r.canceled || r.selection === undefined) return;
  const a = actions[r.selection];
  if (a === "back") return system.run(() => showShopCategory(p, npc, category));
  const times = a === "max" ? maxTimes : Number(a);
  if (!Number.isFinite(times) || times <= 0) {
    msg(p, "§c구매 가능한 수량이 없어.");
    return system.run(() => showPurchaseDetail(p, npc, current, category));
  }
  return system.run(() => purchaseProduct(p, npc, current, category, times));
}

function purchaseProduct(p, npc, product, category, times = 1) {
  const shop = getShop(npc);
  const current = shop.items.find(x => x.id === product.id && x.enabled);
  if (!current || !shop.enabled) return;
  const count = Math.max(1, Math.min(64, Math.floor(Number(times) || 1)));
  const totalPrice = current.price * count;
  const balance = gold(p);
  if (balance < totalPrice) {
    msg(p, `§c골드가 부족해. §7필요 ${totalPrice} / 보유 ${balance}`);
    return system.run(() => showPurchaseDetail(p, npc, current, category));
  }
  const batch = { ...current, amount: current.amount * count };
  try { applyProductData(new ItemStack(current.typeId, 1), current); }
  catch { msg(p, "§c이 상품 아이템을 생성할 수 없어. OP에게 알려줘."); return; }
  if (!changeGold(p, -totalPrice)) return msg(p, "§c골드 차감에 실패했어.");
  if (!giveProduct(p, batch)) {
    changeGold(p, totalPrice);
    msg(p, "§c아이템 지급에 실패해서 골드를 돌려줬어.");
    return;
  }
  msg(p, `§a[상점] 구매 완료! §f${current.amount * count}개 §7/ §6-${totalPrice}G`);
  system.run(() => showPurchaseDetail(p, npc, current, category));
}

export async function showShopAdminMenu(p, npc, onBack) {
  let shop = getShop(npc);
  const form = new ActionFormData()
    .title("§6🛒 상점 주민 설정")
    .body(`§f상점: §e${shop.title}\n§f상태: ${shop.enabled ? "§a영업 중" : "§8비활성"}\n§f상품: §e${shop.items.length}/${MAX_SHOP_ITEMS}\n\n§7상품 추가는 손에 아이템을 들고 누르면 돼.`)
    .button("§e상점 이름 변경")
    .button(shop.enabled ? "§8상점 비활성화" : "§a상점 활성화")
    .button(shop.items.length < MAX_SHOP_ITEMS ? "§a+ 손에 든 아이템 상품 등록" : "§8상품 최대치 도달")
    .button("§b플레이어 화면 미리보기");
  const actions = ["title", "toggle", shop.items.length < MAX_SHOP_ITEMS ? "add" : "noop", "preview"];
  for (let i = 0; i < shop.items.length; i++) {
    const pr = shop.items[i];
    form.button({ rawtext: [
      { text: `§f${i + 1}. ` },
      ...(productNameMessage(pr).rawtext ?? []),
      { text: `\n${pr.enabled ? "§a활성" : "§8비활성"} §7· ×${pr.amount} · §6${pr.price}G` }
    ]});
    actions.push({ type: "item", index: i });
  }
  form.button("§c상점 설정 삭제"); actions.push("deleteShop");
  form.button("§7돌아가기"); actions.push("back");
  const r = await form.show(p).catch(() => null);
  if (!r || r.canceled || r.selection === undefined) return;
  const a = actions[r.selection];
  if (a === "title") return system.run(() => editShopTitle(p, npc, onBack));
  if (a === "toggle") {
    shop.enabled = !shop.enabled; saveShop(npc, shop);
    msg(p, `§a[SHOP] 상점을 ${shop.enabled ? "활성화" : "비활성화"}했어.`);
    return system.run(() => showShopAdminMenu(p, npc, onBack));
  }
  if (a === "add") return system.run(() => addHeldProduct(p, npc, onBack));
  if (a === "preview") return system.run(() => showShopMenu(p, npc));
  if (a === "deleteShop") return system.run(() => confirmDeleteShop(p, npc, onBack));
  if (a === "back") return typeof onBack === "function" ? system.run(onBack) : undefined;
  if (a && a.type === "item") return system.run(() => showProductAdmin(p, npc, a.index, onBack));
}

async function editShopTitle(p, npc, onBack) {
  const shop = getShop(npc);
  const r = await new ModalFormData()
    .title("상점 이름")
    .textField("상점 표시 이름", "예: 대장장이", { defaultValue: shop.title })
    .submitButton("저장")
    .show(p).catch(() => null);
  if (!r || r.canceled) return;
  shop.title = text(r.formValues?.[0], shop.title).slice(0, 80);
  saveShop(npc, shop);
  system.run(() => showShopAdminMenu(p, npc, onBack));
}

async function addHeldProduct(p, npc, onBack) {
  const captured = captureHeldProduct(p);
  if (!captured) {
    msg(p, "§c손에 등록할 아이템을 들고 다시 눌러줘.");
    return system.run(() => showShopAdminMenu(p, npc, onBack));
  }
  const r = await new ModalFormData()
    .title("손 아이템 상품 등록")
    .textField("상품 표시 이름 (비우면 게임 기본 이름)", "선택 사항", { defaultValue: captured.nameTag || "" })
    .dropdown("상품 분류", ["무기", "방어구", "재료", "기타"], { defaultValueIndex: Math.max(0, SHOP_CATEGORIES.indexOf(captured.category)) })
    .textField("1회 구매 수량", "1", { defaultValue: String(captured.amount) })
    .textField("가격 (골드)", "100", { defaultValue: "100" })
    .toggle("상품 활성화", { defaultValue: true })
    .submitButton("상품 저장")
    .show(p).catch(() => null);
  if (!r || r.canceled) return;
  const v = r.formValues ?? [];
  captured.displayName = text(v[0], "").slice(0, 80);
  captured.category = SHOP_CATEGORIES[clampInt(v[1], 0, SHOP_CATEGORIES.length - 1, SHOP_CATEGORIES.indexOf(captured.category))] ?? captured.category;
  captured.amount = clampInt(v[2], 1, 255, captured.amount);
  captured.price = clampInt(v[3], 0, 100000000, 100);
  captured.enabled = !!v[4];
  const shop = getShop(npc);
  if (shop.items.length >= MAX_SHOP_ITEMS) return msg(p, "§c상품 최대치에 도달했어.");
  shop.items.push(captured);
  if (!saveShop(npc, shop)) return msg(p, "§c상점 저장에 실패했어.");
  msg(p, "§a[SHOP] 손에 든 아이템을 상품으로 등록했어.");
  system.run(() => showShopAdminMenu(p, npc, onBack));
}

async function showProductAdmin(p, npc, index, onBack) {
  const shop = getShop(npc);
  if (index < 0 || index >= shop.items.length) return showShopAdminMenu(p, npc, onBack);
  const pr = shop.items[index];
  const form = new ActionFormData()
    .title("§6상품 관리")
    .body({ rawtext: [
      { text: "§f상품: " }, ...(productNameMessage(pr).rawtext ?? []),
      { text: `\n§7ID: ${pr.typeId}\n§f수량: §e${pr.amount}\n§f가격: §6${pr.price} 골드\n§f상태: ${pr.enabled ? "§a활성" : "§8비활성"}` }
    ]})
    .button("§e가격/수량/이름 수정")
    .button(pr.enabled ? "§8상품 비활성화" : "§a상품 활성화")
    .button("§b손에 든 아이템으로 교체\n§7가격 설정은 유지")
    .button("§c상품 삭제")
    .button("§7돌아가기");
  const r = await form.show(p).catch(() => null);
  if (!r || r.canceled) return;
  if (r.selection === 0) return system.run(() => editProduct(p, npc, index, onBack));
  if (r.selection === 1) {
    pr.enabled = !pr.enabled; shop.items[index] = pr; saveShop(npc, shop);
    return system.run(() => showProductAdmin(p, npc, index, onBack));
  }
  if (r.selection === 2) {
    const replacement = captureHeldProduct(p);
    if (!replacement) { msg(p, "§c교체할 아이템을 손에 들고 다시 눌러줘."); return system.run(() => showProductAdmin(p, npc, index, onBack)); }
    replacement.id = pr.id;
    replacement.price = pr.price;
    replacement.amount = pr.amount;
    replacement.category = normalizeCategory(pr.category, pr.typeId);
    replacement.enabled = pr.enabled;
    replacement.displayName = pr.displayName;
    shop.items[index] = replacement; saveShop(npc, shop);
    msg(p, "§a[SHOP] 상품 아이템을 교체했어.");
    return system.run(() => showProductAdmin(p, npc, index, onBack));
  }
  if (r.selection === 3) return system.run(() => confirmDeleteProduct(p, npc, index, onBack));
  if (r.selection === 4) return system.run(() => showShopAdminMenu(p, npc, onBack));
}

async function editProduct(p, npc, index, onBack) {
  const shop = getShop(npc);
  if (index < 0 || index >= shop.items.length) return;
  const pr = shop.items[index];
  const r = await new ModalFormData()
    .title("상품 수정")
    .textField("상품 표시 이름 (비우면 게임 기본 이름)", "선택 사항", { defaultValue: pr.displayName || "" })
    .dropdown("상품 분류", ["무기", "방어구", "재료", "기타"], { defaultValueIndex: Math.max(0, SHOP_CATEGORIES.indexOf(normalizeCategory(pr.category, pr.typeId))) })
    .textField("1회 구매 수량", "1", { defaultValue: String(pr.amount) })
    .textField("가격 (골드)", "100", { defaultValue: String(pr.price) })
    .toggle("상품 활성화", { defaultValue: pr.enabled })
    .submitButton("저장")
    .show(p).catch(() => null);
  if (!r || r.canceled) return;
  const v = r.formValues ?? [];
  pr.displayName = text(v[0], "").slice(0, 80);
  pr.category = SHOP_CATEGORIES[clampInt(v[1], 0, SHOP_CATEGORIES.length - 1, SHOP_CATEGORIES.indexOf(normalizeCategory(pr.category, pr.typeId)))] ?? normalizeCategory(pr.category, pr.typeId);
  pr.amount = clampInt(v[2], 1, 255, pr.amount);
  pr.price = clampInt(v[3], 0, 100000000, pr.price);
  pr.enabled = !!v[4];
  shop.items[index] = pr;
  saveShop(npc, shop);
  system.run(() => showProductAdmin(p, npc, index, onBack));
}

async function confirmDeleteProduct(p, npc, index, onBack) {
  const shop = getShop(npc);
  if (index < 0 || index >= shop.items.length) return;
  const pr = shop.items[index];
  const r = await new MessageFormData()
    .title("§c상품 삭제")
    .body({ rawtext: [{ text: "§c정말 삭제할까?\n\n§f" }, ...(productNameMessage(pr).rawtext ?? [])] })
    .button1("§c삭제")
    .button2("§7취소")
    .show(p).catch(() => null);
  if (!r || r.canceled || r.selection === 1) return system.run(() => showProductAdmin(p, npc, index, onBack));
  shop.items.splice(index, 1);
  saveShop(npc, shop);
  system.run(() => showShopAdminMenu(p, npc, onBack));
}

async function confirmDeleteShop(p, npc, onBack) {
  const r = await new MessageFormData()
    .title("§c상점 설정 삭제")
    .body("§c이 주민의 상점 상품/가격 설정을 전부 삭제할까?\n§7퀘스트 설정에는 영향 없어.")
    .button1("§c전부 삭제")
    .button2("§7취소")
    .show(p).catch(() => null);
  if (!r || r.canceled || r.selection === 1) return system.run(() => showShopAdminMenu(p, npc, onBack));
  safe(() => npc.setDynamicProperty(SHOP_DATA, undefined));
  msg(p, "§c[SHOP] 상점 설정을 삭제했어.");
  if (typeof onBack === "function") system.run(onBack);
}
