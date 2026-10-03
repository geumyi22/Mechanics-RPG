// Mechanics RPG v1.4.45 — dual UI mode: DDUI no-flicker default + proven chest-style ActionForm fallback; v3 safety retained.
// /scriptevent geumyi:subspace_ui ddui|chest switches the per-player UI mode without changing stored items.
// v1 legacy storage and v1.4.25 native chest carts are deliberately not destroyed/migrated.
import { world, system, ItemStack } from '@minecraft/server';
import { ActionFormData, CustomForm, ObservableBoolean, ObservableUIRawMessage, ObservableString } from '@minecraft/server-ui';
import { openLegacySubspace } from './subspace_legacy.js';

const ITEM='geumyi:subspace', COUNT=36, ACTIVE_COUNT=27;
const CUSTOM_STACKS=new Set(['geumyi:sheriff_bullet','geumyi:sheriff_bullet_bundle']);
const supportedId=id=>(id.startsWith('minecraft:')||id.startsWith('geumyi:'))&&id!=='geumyi:subspace';
const HEAD='geumyi:subspace_v3_head', STAGE='geumyi:subspace_v3_stage';
const JOURNAL='geumyi:subspace_v3_journal', LEGACY_CART='geumyi:subspace_v2_entity_id';
const LEGACY_POSITION='geumyi:subspace_v2_last_location';
const locks=new Set();
const UI_MODE_PROP='geumyi:subspace_ui_mode';

const ITEM_NAME_KO={
  sheriff_bullet:'리볼버 탄환', sheriff_bullet_bundle:'리볼버 탄환 6발 묶음', barrel:'통', noteblock:'소리 블록', jukebox:'주크박스',
  beehive:'벌통', dirt:'흙', grass_block:'잔디 블록', stone:'돌', cobblestone:'조약돌', andesite:'안산암', diorite:'섬록암', granite:'화강암',
  sand:'모래', red_sand:'붉은 모래', gravel:'자갈', clay:'점토', oak_log:'참나무 원목', spruce_log:'가문비나무 원목', birch_log:'자작나무 원목', jungle_log:'정글나무 원목',
  acacia_log:'아카시아나무 원목', dark_oak_log:'짙은 참나무 원목', mangrove_log:'맹그로브나무 원목', cherry_log:'벚나무 원목', oak_planks:'참나무 판자', spruce_planks:'가문비나무 판자',
  birch_planks:'자작나무 판자', jungle_planks:'정글나무 판자', acacia_planks:'아카시아나무 판자', dark_oak_planks:'짙은 참나무 판자', mangrove_planks:'맹그로브나무 판자', cherry_planks:'벚나무 판자',
  stick:'막대기', coal:'석탄', charcoal:'숯', iron_ingot:'철 주괴', gold_ingot:'금 주괴', copper_ingot:'구리 주괴', diamond:'다이아몬드', emerald:'에메랄드', redstone:'레드스톤 가루', lapis_lazuli:'청금석', quartz:'네더 석영',
  apple:'사과', bread:'빵', cooked_beef:'스테이크', beef:'생소고기', cooked_porkchop:'익힌 돼지고기', porkchop:'생돼지고기', cooked_chicken:'익힌 닭고기', chicken:'생닭고기',
  wheat:'밀', wheat_seeds:'밀 씨앗', potato:'감자', baked_potato:'구운 감자', carrot:'당근', torch:'횃불', crafting_table:'제작대', furnace:'화로', chest:'상자', hopper:'호퍼',
  arrow:'화살', bow:'활', crossbow:'쇠뇌', shield:'방패', iron_sword:'철 검', diamond_sword:'다이아몬드 검', iron_pickaxe:'철 곡괭이', diamond_pickaxe:'다이아몬드 곡괭이',
  water_bucket:'물 양동이', bucket:'양동이', honeycomb:'벌집 조각', honey_bottle:'꿀병', bookshelf:'책장', paper:'종이', book:'책', leather:'가죽'
};
const CUSTOM_ITEM_NAME={
  "archer_arrow":"§a궁수 전용 화살",
  "archer_boom":"§a[궁수] 폭발 화살",
  "archer_bow":"§a궁수 전용활",
  "archer_triple":"§a[궁수] 트리플 샷",
  "archer_ult":"§a[궁수] 백발백중",
  "archer_wire":"§a[궁수] 와이어 화살",
  "assassin_dagger":"§8암살자 전용 단검",
  "assassin_gas":"§2[암살자] 독기체 암살",
  "assassin_move":"§8[암살자] 암살 이동",
  "assassin_prep":"§8[암살자] 암살 준비",
  "assassin_ult":"§4[암살자] 단체 암살",
  "berserker_axe":"§4광전사 전용 손도끼",
  "berserker_rage":"§4[광전사] 광전사의 분노",
  "berserker_slam":"§c[광전사] 내려찍기",
  "berserker_tornado":"§4[광전사] 토네이도",
  "berserker_ult":"§4[광전사] 미쳐 날뛰기",
  "cleric_bible":"§f성직자 전용 성경책",
  "cleric_prayer":"§e[성직자] 성스러운 기도",
  "cleric_recovery":"§e[성직자] 빛의 회복",
  "cleric_shield":"§f[성직자] 빛의 방패",
  "cleric_spear":"§6[성직자] 빛의 창",
  "fighter_burst":"§6[격투가] 붕권",
  "fighter_flurry":"§6[격투가] 난타",
  "fighter_gauntlet":"§6격투가 전용 건틀릿",
  "fighter_limit":"§6[격투가] 한계돌파",
  "fighter_step":"§6[격투가] 순보",
  "hero_courage":"§6[용사] 용맹한 기사의 용기",
  "hero_heart":"§6[용사] 용맹한 전사의 마음",
  "hero_parry":"§b[용사] 패링",
  "hero_smite":"§c[용사] 강타",
  "hero_sword":"§b용사 전용검",
  "mage_fireball":"§d[마법사] 파이어볼",
  "mage_shield":"§b[마법사] 물의 방패",
  "mage_staff":"§d마법사 전용 마법 지팡이",
  "mage_thunder":"§5[마법사] 천둥번개",
  "mage_vine":"§2[마법사] 가시덩쿨",
  "reaper_absorb":"§5[사신] 영혼 흡수",
  "reaper_ambush":"§c[사신] 사신의 복병",
  "reaper_judgment":"§4§l[사신] 사신의 심판",
  "reaper_massacre":"§4[사신] 사신의 학살",
  "reaper_scythe":"§4사신의 대낫",
  "reaper_soul_100":"§8§l[테스트] 영혼 결정 §c100",
  "sheriff_bullet":"§f리볼버 탄환",
  "sheriff_bullet_bundle":"§6리볼버 묶음 탄약 §7(6발)",
  "sheriff_deadeye":"§5[보안관] 데드 아이",
  "sheriff_enhance":"§e[보안관] 리볼버 강화",
  "sheriff_quickdraw":"§6[보안관] 속사",
  "sheriff_revolver":"§6보안관 리볼버",
  "sheriff_rope":"§e[보안관] 끈",
  "subspace":"§5아공간",
  "sun_guard":"§0[INTERNAL] Sun Guard",
  "sword_dash":"§c[검사] 풍찰만리",
  "sword_draw":"§c[검사] 발도술",
  "sword_rise":"§c[검사] 풍운승천",
  "sword_ult":"§c[검사] 풍흔만리",
  "warrior_sword":"§c검사 전용검"
};
const ITEM_ICON_MAP={
  barrel:"textures/ui/geumyi_subspace_barrel",
  archer_arrow:"textures/items/archer_arrow",
  archer_boom:"textures/items/archer_boom",
  archer_bow:"textures/items/archer_bow",
  archer_triple:"textures/items/archer_triple",
  archer_ult:"textures/items/archer_ult",
  archer_wire:"textures/items/archer_wire",
  assassin_dagger:"textures/items/assassin_dagger",
  assassin_gas:"textures/items/assassin_gas",
  assassin_move:"textures/items/assassin_move",
  assassin_prep:"textures/items/assassin_prep",
  assassin_ult:"textures/items/assassin_ult",
  berserker_axe:"textures/items/berserker_axe",
  berserker_rage:"textures/items/berserker_rage",
  berserker_slam:"textures/items/berserker_slam",
  berserker_tornado:"textures/items/berserker_tornado",
  berserker_ult:"textures/items/berserker_ult",
  cleric_bible:"textures/items/cleric_bible",
  cleric_prayer:"textures/items/cleric_prayer",
  cleric_recovery:"textures/items/cleric_recovery",
  cleric_shield:"textures/items/cleric_shield",
  cleric_spear:"textures/items/cleric_spear",
  fighter_burst:"textures/items/fighter_burst",
  fighter_flurry:"textures/items/fighter_flurry",
  fighter_gauntlet:"textures/items/fighter_gauntlet",
  fighter_limit:"textures/items/fighter_limit",
  fighter_step:"textures/items/fighter_step",
  hero_courage:"textures/items/hero_courage",
  hero_heart:"textures/items/hero_heart",
  hero_parry:"textures/items/hero_parry",
  hero_smite:"textures/items/hero_smite",
  hero_sword:"textures/items/hero_sword",
  mage_fireball:"textures/items/mage_fireball",
  mage_shield:"textures/items/mage_shield",
  mage_staff:"textures/items/mage_staff",
  mage_thunder:"textures/items/mage_thunder",
  mage_vine:"textures/items/mage_vine",
  reaper_absorb:"textures/items/reaper_absorb",
  reaper_ambush:"textures/items/reaper_ambush",
  reaper_judgment:"textures/items/reaper_judgment",
  reaper_massacre:"textures/items/reaper_massacre",
  reaper_scythe:"textures/items/reaper_scythe",
  reaper_soul_100:"textures/items/reaper_absorb",
  sheriff_bullet:"textures/items/sheriff_bullet",
  sheriff_bullet_bundle:"textures/items/sheriff_bullet_bundle",
  sheriff_deadeye:"textures/items/sheriff_deadeye",
  sheriff_enhance:"textures/items/sheriff_enhance",
  sheriff_quickdraw:"textures/items/sheriff_quickdraw",
  sheriff_revolver:"textures/items/sheriff_revolver",
  sheriff_rope:"textures/items/sheriff_rope",
  subspace:"textures/items/subspace",
  // Internal sunlight guard intentionally has no in-game item icon; use a safe UI fallback only.
  sun_guard:"textures/ui/geumyi_subspace_unknown",
  sword_dash:"textures/items/sword_dash",
  sword_draw:"textures/items/sword_draw",
  sword_rise:"textures/items/sword_rise",
  sword_ult:"textures/items/sword_ult",
  warrior_sword:"textures/items/warrior_sword",
  sheriff_bullet:'textures/items/sheriff_bullet', sheriff_bullet_bundle:'textures/items/sheriff_bullet_bundle',
  beehive:'textures/blocks/beehive_side', dirt:'textures/blocks/dirt', grass_block:'textures/blocks/grass_side_carried', stone:'textures/blocks/stone', cobblestone:'textures/blocks/cobblestone', andesite:'textures/blocks/stone_andesite', diorite:'textures/blocks/stone_diorite', granite:'textures/blocks/stone_granite',
  sand:'textures/blocks/sand', red_sand:'textures/blocks/red_sand', gravel:'textures/blocks/gravel', clay:'textures/blocks/clay', oak_log:'textures/blocks/log_oak', spruce_log:'textures/blocks/log_spruce', birch_log:'textures/blocks/log_birch', jungle_log:'textures/blocks/log_jungle', acacia_log:'textures/blocks/log_acacia', dark_oak_log:'textures/blocks/log_big_oak',
  oak_planks:'textures/blocks/planks_oak', spruce_planks:'textures/blocks/planks_spruce', birch_planks:'textures/blocks/planks_birch', jungle_planks:'textures/blocks/planks_jungle', acacia_planks:'textures/blocks/planks_acacia', dark_oak_planks:'textures/blocks/planks_big_oak', cherry_planks:'textures/blocks/planks_cherry', mangrove_planks:'textures/blocks/planks_mangrove',
  stick:'textures/items/stick', coal:'textures/items/coal', charcoal:'textures/items/coal', iron_ingot:'textures/items/iron_ingot', gold_ingot:'textures/items/gold_ingot', copper_ingot:'textures/items/copper_ingot', diamond:'textures/items/diamond', emerald:'textures/items/emerald', redstone:'textures/items/redstone_dust', lapis_lazuli:'textures/items/dye_powder_blue', quartz:'textures/items/quartz',
  apple:'textures/items/apple', bread:'textures/items/bread', cooked_beef:'textures/items/beef_cooked', beef:'textures/items/beef_raw', cooked_porkchop:'textures/items/porkchop_cooked', porkchop:'textures/items/porkchop_raw', cooked_chicken:'textures/items/chicken_cooked', chicken:'textures/items/chicken_raw',
  wheat:'textures/items/wheat', wheat_seeds:'textures/items/seeds_wheat', potato:'textures/items/potato', baked_potato:'textures/items/potato_baked', carrot:'textures/items/carrot', torch:'textures/blocks/torch_on', crafting_table:'textures/blocks/crafting_table_front', furnace:'textures/blocks/furnace_front_off', chest:'textures/blocks/chest_front', hopper:'textures/blocks/hopper_outside',
  arrow:'textures/items/arrow', bow:'textures/items/bow_standby', crossbow:'textures/items/crossbow_standby', shield:'textures/items/shield', iron_sword:'textures/items/iron_sword', diamond_sword:'textures/items/diamond_sword', iron_pickaxe:'textures/items/iron_pickaxe', diamond_pickaxe:'textures/items/diamond_pickaxe', bucket:'textures/items/bucket_empty', water_bucket:'textures/items/bucket_water',
  honeycomb:'textures/items/honeycomb', honey_bottle:'textures/items/honey_bottle', bookshelf:'textures/blocks/bookshelf', paper:'textures/items/paper', book:'textures/items/book_normal', leather:'textures/items/leather',
  smithing_table:"textures/blocks/smithing_table_front",
  fletching_table:"textures/blocks/fletcher_table_top",
  cartography_table:"textures/blocks/cartography_table_top",
  loom:"textures/blocks/loom_front",
  smoker:"textures/blocks/smoker_front_off",
  blast_furnace:"textures/blocks/blast_furnace_front_off",
  grindstone:"textures/blocks/grindstone_side",
  lectern:"textures/blocks/lectern_front",
  composter:"textures/blocks/composter_side",
  stonecutter:"textures/blocks/stonecutter2_side",
  enchanting_table:"textures/blocks/enchanting_table_side",
  beacon:"textures/blocks/beacon",
  brewing_stand:"textures/items/brewing_stand",
  cauldron:"textures/items/cauldron",
  bell:"textures/items/villagebell",
  lantern:"textures/items/lantern",
  campfire:"textures/items/campfire"
};
function typeName(id){return String(id||'').split(':').pop();}
const localizationKeyCache=new Map();
function vanillaLocalizationKey(id){
 const full=String(id||'');
 if(!full.startsWith('minecraft:'))return undefined;
 if(localizationKeyCache.has(full))return localizationKeyCache.get(full);
 let key;
 try{const v=new ItemStack(full,1).localizationKey;if(typeof v==='string'&&v)key=v;}catch{}
 localizationKeyCache.set(full,key);
 return key;
}
function displayName(id){
 const k=typeName(id);
 return CUSTOM_ITEM_NAME[k] || ITEM_NAME_KO[k] || k.replace(/_/g,' ');
}
function displayNameRaw(id){
 const k=typeName(id),custom=CUSTOM_ITEM_NAME[k];
 if(custom!==undefined)return {text:custom};
 const key=vanillaLocalizationKey(id);
 if(key)return {translate:key};
 return {text:ITEM_NAME_KO[k] || k.replace(/_/g,' ')};
}
function itemLabelRaw(a,prefix='',suffix=''){
 if(!a)return {text:`${prefix}빈 칸${suffix}`};
 return {rawtext:[{text:prefix},displayNameRaw(a.id),{text:` ×${a.n}${suffix}`}]};
}
function itemTexture(id){
 const k=typeName(id);
 return ITEM_ICON_MAP[k] || 'textures/ui/geumyi_subspace_unknown';
}

// Mojang bedrock-samples v1.26.50.4 / metadata/vanilladata_modules/mojang-items.json
// Source blob SHA: c2ac97e4719846758089d6a9f82c4027a3510b37
// 1,623 vanilla item raw IDs, hash-compressed. The hash set was checked collision-free for this source list.
const VANILLA_RENDER_DATA='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';
function decodeNativeRenderData(){
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
 const bytes=[];let buffer=0,bits=0;
 for(const ch of VANILLA_RENDER_DATA){
  if(ch==='=')break;
  const v=alphabet.indexOf(ch);if(v<0)continue;
  buffer=(buffer<<6)|v;bits+=6;
  if(bits>=8){bits-=8;bytes.push((buffer>>bits)&255);buffer&=bits?((1<<bits)-1):0;}
 }
 let i=0,hash=0;const out=new Map();
 const readVar=()=>{let v=0,shift=0;while(i<bytes.length){const b=bytes[i++];v|=(b&127)<<shift;if((b&128)===0)return v>>>0;shift+=7;if(shift>28)throw Error('아공간 아이템 렌더러 데이터 손상');}throw Error('아공간 아이템 렌더러 데이터 손상');};
 while(i<bytes.length){hash=(hash+readVar())>>>0;const zz=readVar();const raw=(zz>>>1)^-(zz&1);out.set(hash,raw);}
 return out;
}
const VANILLA_RENDER_ID=decodeNativeRenderData();
function vanillaRenderHash(name){
 let h=0x811c9dc5>>>0;
 for(let i=0;i<name.length;i++){h^=name.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}
 h^=h>>>16;h=Math.imul(h,0x7feb352d)>>>0;h^=h>>>15;
 return h&0xffffff;
}
function gridIcon(item){
 if(!item)return 'textures/ui/geumyi_subspace_empty';
 if(item.id.startsWith('minecraft:')){
  const nativeId=VANILLA_RENDER_ID.get(vanillaRenderHash(typeName(item.id)));
  if(Number.isInteger(nativeId))return String(nativeId*65536);
 }
 return itemTexture(item.id);
}
const tell=(p,s)=>{try{p.sendMessage(s);}catch{}};
const inv=p=>p.getComponent('minecraft:inventory')?.container;
const empty=()=>({v:3,rev:0,slots:Array(COUNT).fill(null)});
const encode=obj=>JSON.stringify(obj);
const parse=s=>{if(typeof s!=='string')return undefined;try{return JSON.parse(s);}catch{return undefined;}};
function valid(a){return a&&a.v===3&&Number.isSafeInteger(a.rev)&&a.rev>=0&&Array.isArray(a.slots)&&(a.slots.length===27||a.slots.length===COUNT)&&a.slots.every(x=>x===null||(x&&typeof x.id==='string'&&supportedId(x.id)&&Number.isInteger(x.n)&&x.n>=1&&x.n<=64));}
function current(p){const raw=p.getDynamicProperty(HEAD);if(raw===undefined)return empty();const a=parse(raw);if(!valid(a))throw Error('창고 데이터 검증 실패: 수정 금지');if(a.slots.length===27)a.slots=a.slots.concat(Array(9).fill(null));return a;}
function isPlain(it){
 if(!it||it.amount<1||it.amount>64||!supportedId(it.typeId))return false;
 if(/shulker|bundle|potion|stew|spawn_egg|banner|map|book|firework|tipped|ominous|goat_horn|suspicious|knowledge|command_block|structure|debug|trial_key|vault|music_disc|enchanted_book/.test(it.typeId))return false;
 if(it.nameTag||it.getLore?.()?.length||it.keepOnDeath)return false;
 try{if(it.getDynamicPropertyIds?.()?.length)return false;}catch{return false;}
 try{if(it.getComponent('minecraft:enchantable')?.getEnchantments?.()?.length)return false;}catch{return false;}
 try{if(it.getComponent('minecraft:durability'))return false;}catch{return false;}
 try{const lm=it.lockMode;if(lm!==undefined&&lm!=='none'&&lm!==0)return false;}catch{return false;}
 return true;
}
const rec=it=>({id:it.typeId,n:it.amount});
const same=(a,b)=>!!a&&!!b&&a.id===b.id&&a.n===b.n;
const slotRecord=(c,i)=>{const it=c?.getItem(i);return it?rec(it):null;};
const label=a=>a?`${displayName(a.id)} ×${a.n}`:'빈 칸';
const icon=a=>a?itemTexture(a.id):'textures/ui/geumyi_subspace_empty';
function transact(p,kind,from,to,expectedRev,expected){
 if(locks.has(p.id))return {ok:false,reason:'현재 다른 작업을 처리하는 중이야.'};
 locks.add(p.id);
 try{
  if(p.getDynamicProperty(JOURNAL)!==undefined)return {ok:false,reason:'미완료 입출금 기록이 있어. 재접속 후 복구 상태를 확인해 줘.'};
  const a=current(p),c=inv(p);
  if(!c||a.rev!==expectedRev)return {ok:false,reason:'화면이 오래됐어. 다시 열어 줘.'};
  const b={v:3,rev:a.rev+1,slots:a.slots.map(x=>x?{...x}:null)};
  let tx;
  if(kind==='put'){
   const it=c.getItem(from);
   if(!isPlain(it)||!same(rec(it),expected))return {ok:false,reason:'아이템이 바뀌었거나 보관할 수 없는 아이템이야.'};
   if(b.slots[to]!==null)return {ok:false,reason:'창고의 선택한 칸이 이미 사용 중이야.'};
   b.slots[to]=rec(it);
   tx={v:1,kind,from,to,old:a.rev,next:b.rev,item:rec(it)};
  } else {
   const saved=b.slots[from];
   if(!same(saved,expected)||c.getItem(to))return {ok:false,reason:'창고나 인벤토리 상태가 바뀌었어.'};
   // Decoding is checked before any inventory/storage mutation.
   const candidate=new ItemStack(saved.id,saved.n);
   if(!isPlain(candidate))return {ok:false,reason:'이 아이템은 현재 복원할 수 없어.'};
   b.slots[from]=null;
   tx={v:1,kind,from,to,old:a.rev,next:b.rev,item:{...saved}};
  }
  // Keep a durable intent + staged next revision before touching either inventory.
  p.setDynamicProperty(JOURNAL,encode(tx));
  p.setDynamicProperty(STAGE,encode(b));
  if(encode(parse(p.getDynamicProperty(STAGE)))!==encode(b))throw Error('새 저장 데이터 재검증 실패');
  // No awaits or callbacks between player inventory mutation and head update.
  if(kind==='put'){
   const now=c.getItem(from);
   if(!isPlain(now)||!same(rec(now),tx.item))throw Error('아이템 변경 감지: 안전 잠금');
   c.setItem(from,undefined);
  }else{
   if(c.getItem(to)!==undefined)throw Error('인벤토리 목적지 변경: 안전 잠금');
   c.setItem(to,new ItemStack(tx.item.id,tx.item.n));
  }
  p.setDynamicProperty(HEAD,encode(b));
  p.setDynamicProperty(JOURNAL,undefined);
  p.setDynamicProperty(STAGE,undefined);
  return {ok:true};
 }catch(e){return {ok:false,reason:`저장 처리 중 오류: ${String(e)}. 복구 확인 전 추가 작업 차단.`};}
 finally{locks.delete(p.id);}
}
function recover(p){
 const tx=parse(p.getDynamicProperty(JOURNAL));
 if(!tx)return p.getDynamicProperty(JOURNAL)===undefined?true:(tell(p,'§c아공간 작업 기록이 손상됐어. 창고 접근을 차단했어.'),false);
 try{
  const a=current(p),b=parse(p.getDynamicProperty(STAGE)),c=inv(p);
  if(!c||!valid(b)||tx.v!==1||b.rev!==tx.next||tx.next!==tx.old+1||!['put','take'].includes(tx.kind))throw Error('복구 데이터 불일치');
  const cell=slotRecord(c,tx.kind==='put'?tx.from:tx.to);
  const before=tx.kind==='put'?same(cell,tx.item):cell===null;
  const after=tx.kind==='put'?cell===null:same(cell,tx.item);
  if(a.rev===tx.next&&after){
   p.setDynamicProperty(JOURNAL,undefined);p.setDynamicProperty(STAGE,undefined);tell(p,'§a아공간의 완료된 작업 기록을 정리했어.');return true;
  }
  if(a.rev===tx.old&&before){
   p.setDynamicProperty(JOURNAL,undefined);p.setDynamicProperty(STAGE,undefined);tell(p,'§e완료되지 않은 아공간 작업을 취소했어.');return true;
  }
  if(a.rev===tx.old&&after){
   p.setDynamicProperty(HEAD,encode(b));
   p.setDynamicProperty(JOURNAL,undefined);p.setDynamicProperty(STAGE,undefined);
   tell(p,'§a중단된 아공간 작업을 저장 기록과 대조하여 완료했어.');return true;
  }
  throw Error('인벤토리와 보관 데이터가 서로 맞지 않음');
 }catch(e){tell(p,`§c아공간 보호 잠금: ${String(e)}. 월드 백업을 보존하고 관리자에게 알려 줘.`);return false;}
}
// Chest-styled icons come from the RP. An ActionForm cannot implement vanilla drag-and-drop.
// The title marker is only interpreted by our RP/ui/server_form.json override.
// If resource-pack UI overrides conflict or fail, the 72 buttons still
// function as an ordinary ActionFormData (safe visual fallback).
const CHEST_MARKER='§c§h§e§s§t§7§2§r';
function firstEmptyInventorySlot(c){
 for(let i=0;i<c.size;i++)if(!c.getItem(i))return i;
 return -1;
}
function overflowCount(a){
 let n=0;for(let i=ACTIVE_COUNT;i<COUNT;i++)if(a.slots[i])n++;return n;
}
function freeInventoryCount(c){
 let n=0;for(let i=0;i<c.size;i++)if(!c.getItem(i))n++;return n;
}
function migrate36to27(p){
 // Capacity is now 27, but v3 keeps the historical 36-slot array on disk so no old save is truncated.
 // Any old items in slots 28..36 are journaled back into empty player inventory slots before the new UI opens.
 let a=current(p),c=inv(p);if(!c)return false;
 const need=overflowCount(a);if(need===0)return true;
 const free=freeInventoryCount(c);
 if(free<need){
  tell(p,`§e아공간이 27칸으로 변경됐어. 기존 28~36번 칸의 아이템 ${need}묶음은 그대로 보존 중이야. 인벤토리 빈칸을 ${need-free}칸 더 만든 뒤 다시 열어 줘.`);
  return false;
 }
 let moved=0;
 for(let i=ACTIVE_COUNT;i<COUNT;i++){
  a=current(p);const item=a.slots[i];if(!item)continue;
  c=inv(p);if(!c)return false;
  const dest=firstEmptyInventorySlot(c);if(dest<0)return false;
  const out=transact(p,'take',i,dest,a.rev,item);
  if(!out.ok){tell(p,`§c27칸 전환 중 ${i+1}번 칸을 안전하게 옮기지 못했어: ${out.reason}`);return false;}
  moved++;
 }
 if(moved)tell(p,`§a기존 28~36번 칸의 아이템 ${moved}묶음을 인벤토리로 안전하게 옮겼어.`);
 return true;
}
async function home(p){
 if(!p.isValid||!recover(p)||!migrate36to27(p))return;
 while(p.isValid){
  const a=current(p),c=inv(p);if(!c)return;
  const invOrder=[];
  // Match the vanilla chest layout: main inventory slots 9..35, then hotbar 0..8.
  for(let i=9;i<Math.min(36,c.size);i++)invOrder.push(i);
  for(let i=0;i<Math.min(9,c.size);i++)invOrder.push(i);
  const shown=[],storable=[];
  // 72 buttons exactly: 27 Subspace + 9 hidden spacer cells + 27 main inventory + 9 hotbar.
  const f=new ActionFormData().title(CHEST_MARKER);
  for(let i=0;i<ACTIVE_COUNT;i++){
   const item=a.slots[i];
   const prefix=`stack#${String(item?.n??1).padStart(2,'0')}dur#00§r`;
   const labelText=item
    ?{rawtext:[{text:prefix},displayNameRaw(item.id),{text:` ×${item.n}`}]}
    :`${prefix}빈 칸`;
   f.button(labelText,gridIcon(item));
  }
  // The grid consumes these 9 collection entries as a visual gap row. Empty text makes their slot buttons invisible.
  for(let i=0;i<9;i++)f.button('', 'textures/ui/geumyi_subspace_empty');
  for(let b=0;b<invOrder.length;b++){
   const source=invOrder[b],it=c.getItem(source),item=it?rec(it):null;
   shown[b]=item;storable[b]=isPlain(it);
   const prefix=`stack#${String(item?.n??1).padStart(2,'0')}dur#00§r`;
   const labelText=item
    ?{rawtext:[{text:prefix},displayNameRaw(item.id),{text:` ×${item.n}${storable[b]?'':' §c(보관 불가)'}`}]}
    :`${prefix}빈 칸`;
   f.button(labelText,item?gridIcon(item):'textures/ui/geumyi_subspace_empty');
  }
  const r=await f.show(p);if(!p.isValid||r.canceled)return;
  if(!Number.isInteger(r.selection)||r.selection<0||r.selection>=ACTIVE_COUNT+9+invOrder.length)return;

  // Top 9x3: take the selected Subspace stack to the first empty inventory slot.
  if(r.selection<ACTIVE_COUNT){
   const source=r.selection,item=a.slots[source];
   if(!item){tell(p,'§7빈 아공간 칸이야.');continue;}
   const latest=current(p);
   if(latest.rev!==a.rev||!same(latest.slots[source],item)){
    tell(p,'§e아공간 상태가 바뀌었어. 화면을 새로 불러올게.');continue;
   }
   const dest=firstEmptyInventorySlot(c);
   if(dest<0){tell(p,'§c인벤토리에 빈 칸이 필요해.');continue;}
   const out=transact(p,'take',source,dest,latest.rev,item);
   if(!out.ok){
    tell(p,`§c꺼내기 실패: ${out.reason}`);
    if(p.getDynamicProperty(JOURNAL)!==undefined)return;
   }
