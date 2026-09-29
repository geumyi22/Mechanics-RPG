import { world, system, PlayerPermissionLevel, ItemStack } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { isShopConfigured, isShopEnabled, showShopMenu, showShopAdminMenu } from "./shop.js";

const NPC_QUESTS = "geumyi:quests_v1";
const NPC_KEY = "geumyi:npc_key_v1";
const NPC_ANCHOR = "geumyi:npc_anchor_v1";
const PLAYER_ACTIVE = "geumyi:active_quests_v1";
const PLAYER_DONE = "geumyi:done_quests_v1";
const MAX_NPC_QUESTS = 8;
const MAX_ACTIVE_QUESTS = 10;
const uiBusy = new Set();
const interactGate = new Map();
const tempHudUntil = new Map();

function safe(fn, fallback = undefined) {
  try { const v = fn(); return v === undefined ? fallback : v; } catch (e) { return fallback; }
}
function tick() { return system.currentTick; }
function msg(p, text) { safe(() => p.sendMessage(text)); }
function clampInt(v, min, max, fallback = 0) {
  const n = Number.parseInt(String(v ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
function clampNum(v, min, max, fallback = 0) {
  const n = Number.parseFloat(String(v ?? ""));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
function text(v, fallback = "") {
  const s = String(v ?? "").trim();
  return s.length ? s.slice(0, 500) : fallback;
}
function isVillager(e) {
  const id = safe(() => e.typeId, "");
  return id === "minecraft:villager_v2" || id === "minecraft:villager";
}
function isOperator(p) {
  return safe(() => p.playerPermissionLevel === PlayerPermissionLevel.Operator, false);
}
function parseJson(raw, fallback) {
  if (typeof raw !== "string" || !raw.length) return fallback;
  try { return JSON.parse(raw); } catch (e) { return fallback; }
}
function getNpcQuests(npc) {
  const arr = parseJson(safe(() => npc.getDynamicProperty(NPC_QUESTS)), []);
  return Array.isArray(arr) ? arr.slice(0, MAX_NPC_QUESTS) : [];
}
function setNpcQuests(npc, quests) {
  const trimmed = quests.slice(0, MAX_NPC_QUESTS);
  safe(() => npc.setDynamicProperty(NPC_QUESTS, JSON.stringify(trimmed)));
  if (trimmed.length > 0) ensureNpcAnchor(npc);
}
function makeNpcKey() {
  return `N${tick().toString(36)}${Math.floor(Math.random() * 0xFFFFFF).toString(36)}`;
}
function getNpcKey(npc, create = true) {
  let key = safe(() => npc.getDynamicProperty(NPC_KEY));
  if (typeof key === "string" && key.length) return key;
  if (!create) return "";
  key = makeNpcKey();
  safe(() => npc.setDynamicProperty(NPC_KEY, key));
  return key;
}
function captureNpcAnchor(npc) {
  const l = safe(() => npc.location);
  if (!l) return false;
  const r = safe(() => npc.getRotation(), { x: 0, y: 0 });
  const d = safe(() => npc.dimension.id, "minecraft:overworld");
  const anchor = {
    x: Number(l.x), y: Number(l.y), z: Number(l.z),
    rx: Number(r?.x ?? 0), ry: Number(r?.y ?? 0),
    dimension: d
  };
  return safe(() => { npc.setDynamicProperty(NPC_ANCHOR, JSON.stringify(anchor)); return true; }, false);
}
function getNpcAnchor(npc) {
  const a = parseJson(safe(() => npc.getDynamicProperty(NPC_ANCHOR)), null);
  if (!a || !Number.isFinite(Number(a.x)) || !Number.isFinite(Number(a.y)) || !Number.isFinite(Number(a.z))) return null;
  return {
    x: Number(a.x), y: Number(a.y), z: Number(a.z),
    rx: Number(a.rx ?? 0), ry: Number(a.ry ?? 0),
    dimension: text(a.dimension, safe(() => npc.dimension.id, "minecraft:overworld"))
  };
}
function ensureNpcAnchor(npc) {
  return getNpcAnchor(npc) ?? (captureNpcAnchor(npc) ? getNpcAnchor(npc) : null);
}
function isProtectedQuestNpc(npc) {
  // Mechanics RPG에서는 모든 주민을 고정형 RPG NPC로 취급한다.
  return isVillager(npc);
}
function keepNpcAlive(npc) {
  if (!isProtectedQuestNpc(npc)) return;
  const hc = safe(() => npc.getComponent("minecraft:health"));
  if (hc) {
    const max = Number(hc.effectiveMax ?? hc.defaultValue ?? 20);
    if (Number.isFinite(max) && (hc.currentValue ?? max) < max) safe(() => hc.setCurrentValue(max));
  }
  // AI가 걷기 시작하는 것 자체를 최대한 막고, 위치 보정은 lockNpcToAnchor가 담당한다.
  safe(() => npc.addEffect("slowness", 40, { amplifier: 255, showParticles: false }));
  safe(() => npc.extinguishFire());
}
function lockNpcToAnchor(npc) {
  const a = getNpcAnchor(npc);
  if (!a) return;
  const here = safe(() => npc.location);
  if (!here) return;
  const dimId = safe(() => npc.dimension.id, "");
  const dx = here.x - a.x, dy = here.y - a.y, dz = here.z - a.z;
  const moved = (dx * dx + dy * dy + dz * dz) > 0.0004;
  const dimensionChanged = dimId !== a.dimension;
  safe(() => npc.clearVelocity());
  if (!moved && !dimensionChanged) return;
  // 위치만 고정하고 현재 회전은 유지해서 NPC가 플레이어를 바라보는 동작은 살린다.
  const rot = safe(() => npc.getRotation(), { x: a.rx, y: a.ry });
  const destDim = safe(() => world.getDimension(a.dimension.replace(/^minecraft:/, "")), safe(() => npc.dimension));
  safe(() => npc.teleport({ x: a.x, y: a.y, z: a.z }, { dimension: destDim, rotation: { x: Number(rot?.x ?? a.rx), y: Number(rot?.y ?? a.ry) }, keepVelocity: false, checkForBlocks: false }));
}
function getActive(p) {
  const arr = parseJson(safe(() => p.getDynamicProperty(PLAYER_ACTIVE)), []);
  return Array.isArray(arr) ? arr.slice(0, MAX_ACTIVE_QUESTS) : [];
}
function setActive(p, arr) {
  safe(() => p.setDynamicProperty(PLAYER_ACTIVE, JSON.stringify(arr.slice(0, MAX_ACTIVE_QUESTS))));
}
function getDone(p) {
  const arr = parseJson(safe(() => p.getDynamicProperty(PLAYER_DONE)), []);
  return Array.isArray(arr) ? arr.slice(0, 250) : [];
}
function setDone(p, arr) {
  safe(() => p.setDynamicProperty(PLAYER_DONE, JSON.stringify([...new Set(arr)].slice(-250))));
}
function questId() {
  return `Q${tick().toString(36)}${Math.floor(Math.random() * 0xFFFFFF).toString(36)}`;
}
function defaultQuest(npc) {
  const l = safe(() => npc.location, { x: 0, y: 0, z: 0 });
  const d = safe(() => npc.dimension.id, "minecraft:overworld");
  return {
    id: questId(),
    title: "새 퀘스트",
    startText: "도움이 필요하네.",
    completeText: "수고했네. 약속한 보상일세.",
    type: "kill",
    target: "minecraft:zombie",
    amount: 5,
    x: Math.floor(l.x), y: Math.floor(l.y), z: Math.floor(l.z), radius: 4,
    dimension: d,
    consumeItems: false,
    rewardGold: 100,
    rewardCrystal: 0,
    rewardXp: 0,
    rewardItem: "",
    rewardItemCount: 0,
    repeatable: false,
    enabled: true
  };
}
function normalizeQuest(q, npc) {
  const base = defaultQuest(npc);
  const type = ["kill", "collect", "location"].includes(q?.type) ? q.type : base.type;
  return {
    ...base,
    ...q,
    id: text(q?.id, base.id).slice(0, 40),
    title: text(q?.title, base.title).slice(0, 80),
    startText: text(q?.startText, base.startText).slice(0, 500),
    completeText: text(q?.completeText, base.completeText).slice(0, 500),
    type,
    target: text(q?.target, base.target).slice(0, 100),
    amount: clampInt(q?.amount, 1, 9999, base.amount),
    x: clampNum(q?.x, -30000000, 30000000, base.x),
    y: clampNum(q?.y, -2048, 2048, base.y),
    z: clampNum(q?.z, -30000000, 30000000, base.z),
    radius: clampNum(q?.radius, 1, 64, base.radius),
    dimension: text(q?.dimension, base.dimension).slice(0, 60),
    consumeItems: !!q?.consumeItems,
    rewardGold: clampInt(q?.rewardGold, 0, 100000000, 0),
    rewardCrystal: clampInt(q?.rewardCrystal, 0, 100000000, 0),
    rewardXp: clampInt(q?.rewardXp, 0, 1000000, 0),
    rewardItem: text(q?.rewardItem, "").slice(0, 100),
    rewardItemCount: clampInt(q?.rewardItemCount, 0, 999, 0),
    repeatable: !!q?.repeatable,
    enabled: q?.enabled !== false
  };
}
function objectiveText(q) {
  if (q.type === "kill") return `${q.target === "*" ? "아무 몬스터" : q.target} ${q.amount}마리 처치`;
  if (q.type === "collect") return `${q.target} ${q.amount}개 수집${q.consumeItems ? " · 완료 시 제출" : ""}`;
  return `${Math.round(q.x)}, ${Math.round(q.y)}, ${Math.round(q.z)} 반경 ${q.radius}칸 도달`;
}
function rewardText(q) {
  const out = [];
  if (q.rewardGold > 0) out.push(`§6${q.rewardGold} 골드`);
  if (q.rewardCrystal > 0) out.push(`§b${q.rewardCrystal} 크리스탈`);
  if (q.rewardXp > 0) out.push(`§a경험치 ${q.rewardXp}`);
  if (q.rewardItem && q.rewardItemCount > 0) out.push(`§f${q.rewardItem} ×${q.rewardItemCount}`);
  return out.length ? out.join("§7 / ") : "§7없음";
}
function questBar(p, t, duration = 40) {
  safe(() => p.onScreenDisplay.setActionBar(t));
  safe(() => p.addTag("geumyi_quest_ui_lock"));
  tempHudUntil.set(p.id, tick() + duration);
}
function inventoryCount(p, typeId) {
  if (!typeId) return 0;
  const inv = safe(() => p.getComponent("minecraft:inventory"));
  const c = safe(() => inv.container);
  if (!c) return 0;
  let n = 0;
  for (let i = 0; i < c.size; i++) {
    const it = safe(() => c.getItem(i));
    if (it && it.typeId === typeId) n += it.amount;
  }
  return n;
}
function removeInventoryItems(p, typeId, amount) {
  const inv = safe(() => p.getComponent("minecraft:inventory"));
  const c = safe(() => inv.container);
  if (!c) return false;
  if (inventoryCount(p, typeId) < amount) return false;
  let remain = amount;
  for (let i = 0; i < c.size && remain > 0; i++) {
    const it = safe(() => c.getItem(i));
    if (!it || it.typeId !== typeId) continue;
    const take = Math.min(remain, it.amount);
    if (take >= it.amount) safe(() => c.setItem(i, undefined));
    else {
      it.amount -= take;
      safe(() => c.setItem(i, it));
    }
    remain -= take;
  }
  return remain <= 0;
}
function stateIndex(active, qid, npcKey) {
  return active.findIndex(s => s?.quest?.id === qid && s.npcKey === npcKey);
}
function refreshState(p, s) {
  const q = s.quest;
  if (!q) return false;
  const old = clampInt(s.progress, 0, q.amount, 0);
  if (q.type === "collect") {
    s.progress = Math.min(q.amount, inventoryCount(p, q.target));
  } else if (q.type === "location" && old < q.amount) {
    const sameDim = safe(() => p.dimension.id === q.dimension, false);
    if (sameDim) {
      const l = safe(() => p.location, { x: 0, y: 0, z: 0 });
      const dx = l.x - q.x, dy = l.y - q.y, dz = l.z - q.z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) <= q.radius) s.progress = q.amount;
    }
  }
  s.progress = clampInt(s.progress, 0, q.amount, 0);
  if (s.progress >= q.amount && !s.readyShown) {
    s.readyShown = true;
    questBar(p, `§a[퀘스트 완료 가능] §f${q.title} §7- NPC에게 돌아가자`, 60);
  }
  if (s.progress < q.amount && q.type === "collect") s.readyShown = false;
  return s.progress !== old;
}
function isCompleted(p, q) {
  return !q.repeatable && getDone(p).includes(q.id);
}
function ensureCurrencyObjectives() {
  safe(() => { if (!world.scoreboard.getObjective("rpg_gold")) world.scoreboard.addObjective("rpg_gold", "골드"); });
  safe(() => { if (!world.scoreboard.getObjective("rpg_crystal")) world.scoreboard.addObjective("rpg_crystal", "크리스탈"); });
}
function giveRewardItem(p, typeId, count) {
  if (!typeId || count <= 0) return true;
  const inv = safe(() => p.getComponent("minecraft:inventory"));
  const c = safe(() => inv.container);
  if (!c) return false;
  let remain = count;
  try {
    while (remain > 0) {
      const probe = new ItemStack(typeId, Math.min(255, remain));
      const made = probe.amount;
      const leftover = c.addItem(probe);
      if (leftover) safe(() => p.dimension.spawnItem(leftover, p.location));
      remain -= made;
    }
    return true;
  } catch (e) {
    return false;
  }
}
function grantReward(p, q) {
  ensureCurrencyObjectives();
  if (q.rewardGold > 0) {
    const o = safe(() => world.scoreboard.getObjective("rpg_gold"));
    if (o) safe(() => o.addScore(p, q.rewardGold));
  }
  if (q.rewardCrystal > 0) {
    const o = safe(() => world.scoreboard.getObjective("rpg_crystal"));
    if (o) safe(() => o.addScore(p, q.rewardCrystal));
  }
  if (q.rewardXp > 0) safe(() => p.addExperience(q.rewardXp));
  if (q.rewardItem && q.rewardItemCount > 0 && !giveRewardItem(p, q.rewardItem, q.rewardItemCount)) {
    msg(p, `§c[QUEST] 보상 아이템 ID 오류: ${q.rewardItem}`);
  }
}
function acceptQuest(p, npc, q) {
  const npcKey = getNpcKey(npc, true);
  const active = getActive(p);
  if (stateIndex(active, q.id, npcKey) >= 0) return msg(p, "§e이미 진행 중인 퀘스트야.");
  if (isCompleted(p, q)) return msg(p, "§7이미 완료한 퀘스트야.");
  if (active.length >= MAX_ACTIVE_QUESTS) return msg(p, `§c동시에 진행할 수 있는 퀘스트는 최대 ${MAX_ACTIVE_QUESTS}개야.`);
  const snap = normalizeQuest(q, npc);
  const s = { npcKey, quest: snap, progress: 0, readyShown: false };
  refreshState(p, s);
  active.push(s);
  setActive(p, active);
  questBar(p, `§6[퀘스트 수락] §f${snap.title}`, 60);
  msg(p, `§6[퀘스트] §f${snap.title} §7- ${objectiveText(snap)}`);
}
function abandonQuest(p, qid, npcKey) {
  const a = getActive(p);
  const i = stateIndex(a, qid, npcKey);
  if (i < 0) return;
  const title = a[i]?.quest?.title ?? "퀘스트";
  a.splice(i, 1);
  setActive(p, a);
  msg(p, `§c[퀘스트 포기] §f${title}`);
}
function completeQuest(p, npc, qid) {
  const npcKey = getNpcKey(npc, false);
  const a = getActive(p);
  const i = stateIndex(a, qid, npcKey);
  if (i < 0) return msg(p, "§c진행 중인 퀘스트를 찾지 못했습니다.");
  const s = a[i];
  refreshState(p, s);
  const q = s.quest;
  if (s.progress < q.amount) return msg(p, `§e아직 목표가 남았어. §f${s.progress}/${q.amount}`);
  if (q.type === "collect" && q.consumeItems) {
    if (!removeInventoryItems(p, q.target, q.amount)) {
      s.progress = Math.min(q.amount, inventoryCount(p, q.target));
      setActive(p, a);
      return msg(p, "§e제출할 아이템이 부족해.");
    }
  }
  const npcName = safe(() => npc.nameTag, "") || "퀘스트 NPC";
  msg(p, `§e[${npcName}] §f${q.completeText}`);
  grantReward(p, q);
  a.splice(i, 1);
  setActive(p, a);
  if (!q.repeatable) {
    const done = getDone(p);
    done.push(q.id);
    setDone(p, done);
  }
  safe(() => p.onScreenDisplay.setTitle("§a퀘스트 완료!", { subtitle: `§f${q.title}`, fadeInDuration: 5, stayDuration: 35, fadeOutDuration: 10 }));
  msg(p, `§a[퀘스트 완료] §f${q.title} §7| 보상: ${rewardText(q)}`);
}

async function showQuestDetail(p, npc, q, source = "configured") {
  const npcKey = getNpcKey(npc, true);
  let active = getActive(p);
  let idx = stateIndex(active, q.id, npcKey);
  if (idx >= 0) {
    if (refreshState(p, active[idx])) setActive(p, active);
  }
  active = getActive(p);
  idx = stateIndex(active, q.id, npcKey);
  const state = idx >= 0 ? active[idx] : null;
  const done = isCompleted(p, q);
  const progress = state ? `${state.progress}/${state.quest.amount}` : "-";
  const body = `${q.startText}\n\n§e목표§r\n${objectiveText(q)}\n${state ? `§7진행도: §f${progress}\n` : ""}\n§e보상§r\n${rewardText(q)}\n\n${q.repeatable ? "§b반복 가능" : "§7일회성"}`;
  const form = new ActionFormData().title(`§6${q.title}`).body(body);
  const actions = [];
  if (state) {
    if (state.progress >= state.quest.amount) { form.button("§a✓ 완료하고 보상받기"); actions.push("complete"); }
    else { form.button(`§e진행 중 ${state.progress}/${state.quest.amount}`); actions.push("noop"); }
    form.button("§c퀘스트 포기"); actions.push("abandon");
  } else if (done) {
    form.button("§7✓ 이미 완료함"); actions.push("noop");
  } else if (q.enabled || source === "orphan") {
    form.button("§a퀘스트 수락"); actions.push("accept");
  }
  form.button("§7돌아가기"); actions.push("back");
  let r;
  try { r = await form.show(p); } catch (e) { return; }
  if (r.canceled || r.selection === undefined) return;
  const act = actions[r.selection];
  if (act === "accept") acceptQuest(p, npc, q);
  if (act === "complete") completeQuest(p, npc, q.id);
  if (act === "abandon") abandonQuest(p, q.id, npcKey);
  if (act === "back") system.run(() => showNpcMenu(p, npc));
}

async function showNpcMenu(p, npc) {
  const pid = p.id;
  if (uiBusy.has(pid)) return;
  uiBusy.add(pid);
  try {
    const npcKey = getNpcKey(npc, isOperator(p));
    const configured = getNpcQuests(npc);
    const visible = configured.filter(q => q.enabled !== false || isOperator(p));
    const shopOpen = isShopEnabled(npc);
    const active = getActive(p);
    let changed = false;
    for (const s of active) if (s.npcKey === npcKey && refreshState(p, s)) changed = true;
    if (changed) setActive(p, active);
    const orphanStates = active.filter(s => s.npcKey === npcKey && !configured.some(q => q.id === s?.quest?.id));
    const name = safe(() => npc.nameTag, "") || (shopOpen ? "상점 주민" : "퀘스트 주민");
    const emptyForPlayer = !visible.length && !orphanStates.length && !shopOpen && !isOperator(p);
    const form = new ActionFormData().title(`§6${name}`).body(emptyForPlayer ? "§7이 주민에게 사용할 수 있는 기능이 없습니다." : "§f원하는 메뉴를 선택해.");
    const actions = [];
    if (shopOpen) {
      form.button("§6🛒 상점 열기\n§7상품 구매");
      actions.push({ type: "shop" });
    }
    for (const q0 of visible) {
      const q = normalizeQuest(q0, npc);
      const i = stateIndex(active, q.id, npcKey);
      const done = !q.repeatable && getDone(p).includes(q.id);
      let sub = q.enabled === false ? "§8비활성" : "§a수락 가능";
      if (i >= 0) sub = `§e진행 ${active[i].progress}/${active[i].quest.amount}`;
      else if (done) sub = "§7✓ 완료";
      form.button(`§f${q.title}\n${sub}`);
      actions.push({ type: "quest", q });
    }
    for (const s of orphanStates) {
      form.button(`§f${s.quest.title}\n§e진행 ${s.progress}/${s.quest.amount} §8(기존 퀘스트)`);
      actions.push({ type: "quest", q: s.quest, source: "orphan" });
    }
    if (isOperator(p)) {
      form.button("§6⚙ 주민 설정\n§7퀘스트 / 상점 주민 설정");
      actions.push({ type: "settings" });
    }
    if (emptyForPlayer) {
      form.button("§7닫기");
      actions.push({ type: "close" });
    }
    const r = await form.show(p);
    if (r.canceled || r.selection === undefined) return;
    const a = actions[r.selection];
    if (!a) return;
    if (a.type === "shop") system.run(() => showShopMenu(p, npc));
    else if (a.type === "quest") system.run(() => showQuestDetail(p, npc, a.q, a.source));
    else if (a.type === "settings") system.run(() => showVillagerSettings(p, npc));
  } catch (e) {
    msg(p, `§c[NPC] UI 오류: ${String(e).slice(0, 120)}`);
  } finally {
    uiBusy.delete(pid);
  }
}

async function showVillagerSettings(p, npc) {
  if (!isOperator(p)) return;
  const name = safe(() => npc.nameTag, "") || "주민";
  const quests = getNpcQuests(npc);
  const shop = isShopConfigured(npc);
  const r = await new ActionFormData()
    .title("§6⚙ 주민 설정")
    .body(`§fNPC: §e${name}\n\n§f퀘스트 주민: ${quests.length > 0 ? `§a설정됨 (${quests.length})` : "§7미설정"}\n§f상점 주민: ${shop ? "§a설정됨" : "§7미설정"}`)
    .button("§e📜 퀘스트 주민 설정\n§7퀘스트 생성/수정")
    .button("§6🛒 상점 주민 설정\n§7손 아이템으로 상품 등록")
    .button("§7닫기")
    .show(p)
    .catch(() => null);
  if (!r || r.canceled) return;
  if (r.selection === 0) return system.run(() => showAdminMenu(p, npc));
  if (r.selection === 1) return system.run(() => showShopAdminMenu(p, npc, () => showVillagerSettings(p, npc)));
}

async function showAdminMenu(p, npc) {
  if (!isOperator(p)) return msg(p, "§cOP만 퀘스트를 편집할 수 있습니다.");
  const quests = getNpcQuests(npc);
  const name = safe(() => npc.nameTag, "") || "주민";
  const form = new ActionFormData()
    .title("§6⚙ 퀘스트 주민 설정")
    .body(`§fNPC: §e${name}\n§7퀘스트 ${quests.length}/${MAX_NPC_QUESTS}\n\n§f이 메뉴의 설정은 월드에 저장돼.`)
    .button("§eNPC 이름 변경")
    .button("§b📍 NPC 위치/방향 재설정\n§7현재 자리와 바라보는 방향으로 고정")
    .button(quests.length < MAX_NPC_QUESTS ? "§a+ 새 퀘스트 만들기" : "§8퀘스트 최대치 도달")
    .button("§b플레이어 화면 미리보기");
  const actions = ["name", "anchor", quests.length < MAX_NPC_QUESTS ? "new" : "noop", "preview"];
  for (let i = 0; i < quests.length; i++) {
    const q = normalizeQuest(quests[i], npc);
    form.button(`§f${i + 1}. ${q.title}\n${q.enabled ? "§a활성" : "§8비활성"} §7· ${objectiveText(q)}`);
    actions.push({ type: "edit", index: i });
  }
  form.button("§7주민 설정으로 돌아가기"); actions.push("backSettings");
  let r;
  try { r = await form.show(p); } catch (e) { return; }
  if (r.canceled || r.selection === undefined) return;
  const a = actions[r.selection];
  if (a === "name") return system.run(() => editNpcName(p, npc));
  if (a === "anchor") {
    if (captureNpcAnchor(npc)) msg(p, "§a[QUEST] NPC의 현재 위치와 방향을 새 고정점으로 저장했어.");
    else msg(p, "§c[QUEST] NPC 위치 저장에 실패했어.");
    return system.run(() => showAdminMenu(p, npc));
  }
  if (a === "new") return system.run(() => editQuestBasic(p, npc, -1, defaultQuest(npc)));
  if (a === "preview") return system.run(() => showNpcMenu(p, npc));
  if (a === "backSettings") return system.run(() => showVillagerSettings(p, npc));
  if (a && a.type === "edit") return system.run(() => showQuestAdminDetail(p, npc, a.index));
}

async function editNpcName(p, npc) {
  const old = safe(() => npc.nameTag, "") || "퀘스트 주민";
  let r;
  try {
    r = await new ModalFormData()
      .title("NPC 이름 변경")
      .textField("NPC 표시 이름", "예: 경비대장", { defaultValue: old })
      .submitButton("저장")
      .show(p);
  } catch (e) { return; }
  if (r.canceled) return;
  const name = text(r.formValues?.[0], old).slice(0, 50);
  safe(() => npc.nameTag = name);
  msg(p, `§a[QUEST] NPC 이름을 §f${name}§a(으)로 변경했어.`);
  system.run(() => showAdminMenu(p, npc));
}

async function showQuestAdminDetail(p, npc, index) {
  const quests = getNpcQuests(npc);
  if (index < 0 || index >= quests.length) return showAdminMenu(p, npc);
  const q = normalizeQuest(quests[index], npc);
  const r = await new ActionFormData()
    .title(`§6⚙ ${q.title}`)
    .body(`§e목표§r ${objectiveText(q)}\n§e보상§r ${rewardText(q)}\n§7ID: ${q.id}`)
    .button("§e퀘스트 수정")
    .button(q.enabled ? "§8비활성화" : "§a활성화")
    .button("§c퀘스트 삭제")
    .button("§7돌아가기")
    .show(p)
    .catch(() => null);
  if (!r || r.canceled) return;
  if (r.selection === 0) return system.run(() => editQuestBasic(p, npc, index, q));
  if (r.selection === 1) {
    q.enabled = !q.enabled;
    quests[index] = q;
    setNpcQuests(npc, quests);
    msg(p, `§a[QUEST] ${q.title}: ${q.enabled ? "활성" : "비활성"}`);
    return system.run(() => showQuestAdminDetail(p, npc, index));
  }
  if (r.selection === 2) return system.run(() => confirmDeleteQuest(p, npc, index, q));
  if (r.selection === 3) return system.run(() => showAdminMenu(p, npc));
}

async function confirmDeleteQuest(p, npc, index, q) {
  const r = await new ActionFormData()
    .title("§c퀘스트 삭제")
    .body(`§f${q.title}\n\n§c정말 삭제하시겠습니까?\n§7이미 수락한 플레이어는 기존 진행본을 계속 완료할 수 있습니다.`)
    .button("§c삭제")
    .button("§7취소")
    .show(p)
    .catch(() => null);
  if (!r || r.canceled || r.selection !== 0) return system.run(() => showQuestAdminDetail(p, npc, index));
  const quests = getNpcQuests(npc);
  if (index >= 0 && index < quests.length) quests.splice(index, 1);
  setNpcQuests(npc, quests);
  msg(p, `§c[QUEST] §f${q.title}§c 삭제 완료.`);
  system.run(() => showAdminMenu(p, npc));
}

async function editQuestBasic(p, npc, index, draft0) {
  const draft = normalizeQuest(draft0, npc);
  const typeIndex = draft.type === "kill" ? 0 : draft.type === "collect" ? 1 : 2;
  let r;
  try {
    r = await new ModalFormData()
      .title(index < 0 ? "새 퀘스트 - 기본 설정" : "퀘스트 수정 - 기본 설정")
      .textField("퀘스트 이름", "예: 마을 주변 정리", { defaultValue: draft.title })
      .textField("수락 전/진행 대사", "NPC가 할 말", { defaultValue: draft.startText })
      .textField("완료 대사", "완료할 때 NPC가 할 말", { defaultValue: draft.completeText })
      .dropdown("목표 종류", ["몬스터 처치", "아이템 수집", "특정 위치 도달"], { defaultValueIndex: typeIndex })
      .toggle("반복 가능한 퀘스트", { defaultValue: draft.repeatable })
      .toggle("플레이어에게 표시/활성", { defaultValue: draft.enabled })
      .submitButton("다음: 목표 설정")
      .show(p);
  } catch (e) { return; }
  if (r.canceled) return;
  const v = r.formValues ?? [];
  draft.title = text(v[0], draft.title).slice(0, 80);
  draft.startText = text(v[1], draft.startText).slice(0, 500);
  draft.completeText = text(v[2], draft.completeText).slice(0, 500);
  draft.type = Number(v[3]) === 1 ? "collect" : Number(v[3]) === 2 ? "location" : "kill";
  draft.repeatable = !!v[4];
  draft.enabled = !!v[5];
  system.run(() => editQuestObjective(p, npc, index, draft));
}

async function editQuestObjective(p, npc, index, draft) {
  let form = new ModalFormData().title("퀘스트 - 목표 설정");
  if (draft.type === "kill") {
    form = form
      .textField("처치 대상 Entity ID", "minecraft:zombie 또는 *", { defaultValue: draft.target || "minecraft:zombie" })
      .textField("처치 수", "예: 10", { defaultValue: String(draft.amount) });
  } else if (draft.type === "collect") {
    form = form
      .textField("수집 아이템 ID", "minecraft:rotten_flesh", { defaultValue: draft.target || "minecraft:rotten_flesh" })
      .textField("필요 개수", "예: 10", { defaultValue: String(draft.amount) })
      .toggle("완료할 때 아이템을 제출(소모)", { defaultValue: draft.consumeItems });
  } else {
    form = form
      .textField("X 좌표", "0", { defaultValue: String(draft.x) })
      .textField("Y 좌표", "64", { defaultValue: String(draft.y) })
      .textField("Z 좌표", "0", { defaultValue: String(draft.z) })
      .textField("도착 판정 반경", "4", { defaultValue: String(draft.radius) });
  }
  form.submitButton("다음: 보상 설정");
  let r;
  try { r = await form.show(p); } catch (e) { return; }
  if (r.canceled) return;
  const v = r.formValues ?? [];
  if (draft.type === "kill") {
    draft.target = text(v[0], "minecraft:zombie").slice(0, 100);
    draft.amount = clampInt(v[1], 1, 9999, 5);
  } else if (draft.type === "collect") {
    draft.target = text(v[0], "minecraft:rotten_flesh").slice(0, 100);
    draft.amount = clampInt(v[1], 1, 9999, 5);
    draft.consumeItems = !!v[2];
  } else {
    draft.x = clampNum(v[0], -30000000, 30000000, draft.x);
    draft.y = clampNum(v[1], -2048, 2048, draft.y);
    draft.z = clampNum(v[2], -30000000, 30000000, draft.z);
    draft.radius = clampNum(v[3], 1, 64, 4);
    draft.amount = 1;
    draft.dimension = safe(() => npc.dimension.id, "minecraft:overworld");
  }
  system.run(() => editQuestReward(p, npc, index, draft));
}

async function editQuestReward(p, npc, index, draft) {
  let r;
  try {
    r = await new ModalFormData()
      .title("퀘스트 - 보상 설정")
      .textField("골드", "0", { defaultValue: String(draft.rewardGold) })
      .textField("크리스탈", "0", { defaultValue: String(draft.rewardCrystal) })
      .textField("경험치 포인트", "0", { defaultValue: String(draft.rewardXp) })
      .textField("추가 아이템 ID (없으면 비워두기)", "minecraft:diamond", { defaultValue: draft.rewardItem || "" })
      .textField("추가 아이템 개수", "0", { defaultValue: String(draft.rewardItemCount) })
      .submitButton("퀘스트 저장")
      .show(p);
  } catch (e) { return; }
  if (r.canceled) return;
  const v = r.formValues ?? [];
  draft.rewardGold = clampInt(v[0], 0, 100000000, 0);
  draft.rewardCrystal = clampInt(v[1], 0, 100000000, 0);
  draft.rewardXp = clampInt(v[2], 0, 1000000, 0);
  draft.rewardItem = text(v[3], "").slice(0, 100);
  draft.rewardItemCount = draft.rewardItem ? clampInt(v[4], 0, 999, 0) : 0;
  if (draft.rewardItem && draft.rewardItemCount > 0) {
    try { new ItemStack(draft.rewardItem, 1); }
    catch (e) {
      msg(p, `§c[QUEST] 존재하지 않는 아이템 ID야: ${draft.rewardItem}`);
      return system.run(() => editQuestReward(p, npc, index, draft));
    }
  }
  const quests = getNpcQuests(npc);
  const finalQuest = normalizeQuest(draft, npc);
  if (index < 0) {
    if (quests.length >= MAX_NPC_QUESTS) return msg(p, "§c이 NPC에는 더 이상 퀘스트를 추가할 수 없습니다.");
    quests.push(finalQuest);
  } else if (index < quests.length) quests[index] = finalQuest;
  else quests.push(finalQuest);
  getNpcKey(npc, true);
  setNpcQuests(npc, quests);
  msg(p, `§a[QUEST] §f${finalQuest.title}§a 저장 완료.`);
  system.run(() => showAdminMenu(p, npc));
}

async function showQuestLog(p) {
  const active = getActive(p);
  let changed = false;
  for (const s of active) if (refreshState(p, s)) changed = true;
  if (changed) setActive(p, active);
  const form = new ActionFormData().title("§6퀘스트 일지").body(active.length ? "§f진행 중인 퀘스트" : "§7진행 중인 퀘스트가 없습니다.");
  if (!active.length) form.button("§7닫기");
  else for (const s of active) form.button(`§f${s.quest.title}\n§e${s.progress}/${s.quest.amount} §7· ${objectiveText(s.quest)}`);
  const r = await form.show(p).catch(() => null);
  if (!r || r.canceled || !active.length || r.selection === undefined) return;
  const s = active[r.selection];
  if (!s) return;
  const detail = new ActionFormData()
    .title(`§6${s.quest.title}`)
    .body(`${s.quest.startText}\n\n§e목표§r\n${objectiveText(s.quest)}\n§7진행도: §f${s.progress}/${s.quest.amount}\n\n§e보상§r\n${rewardText(s.quest)}\n\n§7완료 보상은 해당 퀘스트 NPC에게 돌아가 받아.`)
    .button("§7닫기");
  await detail.show(p).catch(() => null);
}

world.beforeEvents.playerInteractWithEntity.subscribe(ev => {
  const p = ev.player;
  const npc = ev.target;
  if (!isVillager(npc)) return;
  const hasQuest = typeof safe(() => npc.getDynamicProperty(NPC_QUESTS)) === "string" && getNpcQuests(npc).length > 0;
  const hasShop = isShopEnabled(npc);
  const op = isOperator(p);
  if (!hasQuest && !hasShop && !op) return;
  const gate = interactGate.get(p.id) ?? 0;
  if (tick() < gate) { ev.cancel = true; return; }
  interactGate.set(p.id, tick() + 10);
  ev.cancel = true;
  system.run(() => showNpcMenu(p, npc));
});

world.afterEvents.entitySpawn.subscribe(ev => {
  const npc = ev.entity;
  if (!isVillager(npc)) return;
  system.run(() => {
    if (!safe(() => npc.isValid, false)) return;
    if (!getNpcAnchor(npc)) captureNpcAnchor(npc);
    keepNpcAlive(npc);
    safe(() => npc.clearVelocity());
    lockNpcToAnchor(npc);
  });
});

world.beforeEvents.entityHurt.subscribe(ev => {
  const npc = ev.hurtEntity;
  if (!isProtectedQuestNpc(npc)) return;
  ev.cancel = true;
  system.run(() => {
    if (!safe(() => npc.isValid, false)) return;
    keepNpcAlive(npc);
    safe(() => npc.clearVelocity());
    lockNpcToAnchor(npc);
  });
});

world.afterEvents.entityDie.subscribe(ev => {
  const dead = ev.deadEntity;
  const killer = safe(() => ev.damageSource.damagingEntity);
  if (!killer || safe(() => killer.typeId) !== "minecraft:player") return;
  const p = killer;
  const deadType = safe(() => dead.typeId, "");
  if (!deadType || deadType === "minecraft:player") return;
  const active = getActive(p);
  let changed = false;
  for (const s of active) {
    const q = s.quest;
    if (!q || q.type !== "kill" || s.progress >= q.amount) continue;
    if (q.target !== "*" && q.target !== deadType) continue;
    s.progress = Math.min(q.amount, (s.progress ?? 0) + 1);
    changed = true;
    if (s.progress >= q.amount) {
      s.readyShown = true;
      questBar(p, `§a[목표 달성] §f${q.title} §7- NPC에게 돌아가자`, 60);
    } else {
      questBar(p, `§6[${q.title}] §f${s.progress}/${q.amount}`, 35);
    }
  }
  if (changed) setActive(p, active);
});

system.runInterval(() => {
  for (const dimId of ["overworld", "nether", "the_end"]) {
    const dim = safe(() => world.getDimension(dimId));
    if (!dim) continue;
    for (const typeId of ["minecraft:villager_v2", "minecraft:villager"]) {
      const villagers = safe(() => dim.getEntities({ type: typeId }), []);
      for (const npc of villagers) {
        let anchor = getNpcAnchor(npc);
        if (!anchor) {
          captureNpcAnchor(npc);
          anchor = getNpcAnchor(npc);
        }
        if (!anchor) continue;
        keepNpcAlive(npc);
        lockNpcToAnchor(npc);
      }
    }
  }
}, 1);

system.runInterval(() => {
  for (const p of world.getAllPlayers()) {
    if (p.hasTag("geumyi_open_quest_log")) {
      p.removeTag("geumyi_open_quest_log");
      system.run(() => showQuestLog(p));
    }
    const active = getActive(p);
    let changed = false;
    for (const s of active) if (refreshState(p, s)) changed = true;
    if (changed) setActive(p, active);
    const until = tempHudUntil.get(p.id) ?? 0;
    if (until > 0 && tick() >= until) {
      tempHudUntil.delete(p.id);
      safe(() => p.removeTag("geumyi_quest_ui_lock"));
    }
  }
}, 20);

system.run(() => {
  ensureCurrencyObjectives();
  world.sendMessage("§6[QUEST] §fMechanics RPG v1.2.0 QUEST/NPC 시작");
});
