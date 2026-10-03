import { world, system, EquipmentSlot, EntityDamageCause } from "@minecraft/server";

const AMMO_KEY="geumyi:sheriff_ammo_v1";
const BUNDLE_ID="geumyi:sheriff_bullet_bundle";
const MAX_AMMO=6;
const BASE_DAMAGE=10;
const BASE_HEADSHOT=1.75;
const REVOLVER_FIRE_TICKS=10; // 0.5s - 일반 사격만 감속 (속사는 별도 간격 유지)
const NORMAL_RELOAD_TICKS=48; // 2.4s
const FAST_RELOAD_TICKS=16; // 0.8s

const cooldowns=new Map();
const reloading=new Map();
const lastShot=new Map();
const stationary=new Map();
const quickReloadUntil=new Map();
const enhancedUntil=new Map();
const sheriffBusyUntil=new Map();
const sheriffClassSeen=new Map();
const ropeMode=new Map();
const ropeSneakPrev=new Map();
const revolverSneakPrev=new Map();
const bountyState=new Map();
const lassoLocks=new Map();
const deadEyeDebuffs=new Map();
const uiSeq=new Map();

function safe(fn,fallback=undefined){try{const v=fn();return v===undefined?fallback:v;}catch{return fallback;}}
function now(){return system.currentTick;}
function isSheriff(p){return !!safe(()=>p.hasTag("geumyi_class_sheriff"),false);}
function level(p){return safe(()=>p.level,0)??0;}
function msg(p,t){safe(()=>p.sendMessage(t));}
function bar(p,t,duration=45){const seq=(uiSeq.get(p.id)??0)+1;uiSeq.set(p.id,seq);safe(()=>{p.addTag("geumyi_skill_ui_lock");p.onScreenDisplay.setActionBar(t);});system.runTimeout(()=>{if(uiSeq.get(p.id)!==seq)return;safe(()=>p.removeTag("geumyi_skill_ui_lock"));},duration);}
function sound(p,id,pitch=1,volume=1){safe(()=>p.playSound(id,{pitch,volume}));}
function areaSound(p,id,pitch=1,volume=1,r=40,loc){const c=loc??p.location;for(const q of world.getAllPlayers()){try{if(q.dimension.id!==p.dimension.id)continue;const dx=q.location.x-c.x,dy=q.location.y-c.y,dz=q.location.z-c.z;if(Math.hypot(dx,dy,dz)>r)continue;q.playSound(id,{pitch,volume});}catch{}}}
function particle(dim,id,loc){safe(()=>dim.runCommand(`particle ${id} ${loc.x.toFixed(2)} ${loc.y.toFixed(2)} ${loc.z.toFixed(2)}`));}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function targetable(e){try{if(!e||e.typeId==="minecraft:player")return false;const x=["minecraft:armor_stand","minecraft:villager","minecraft:villager_v2","minecraft:wandering_trader","minecraft:npc","minecraft:item","minecraft:xp_orb","minecraft:painting","geumyi:reaper_soul","geumyi:reaper_scythe_projectile","geumyi:reaper_massacre_orbit"];if(x.includes(e.typeId)||e.typeId.includes("arrow")||e.typeId.includes("projectile"))return false;return!!e.getComponent("minecraft:health");}catch{return false;}}
function health(e){return safe(()=>e.getComponent("minecraft:health")?.currentValue,-1)??-1;}
function maxHealth(e){const h=safe(()=>e.getComponent("minecraft:health"));return Math.max(1,Number(h?.effectiveMax??h?.defaultValue??h?.currentValue??20));}
function targetPoint(e){const h=safe(()=>e.getHeadLocation());if(h)return{x:h.x,y:h.y-.32,z:h.z};return{x:e.location.x,y:e.location.y+1,z:e.location.z};}
function mainhand(p){return safe(()=>p.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand));}
function ammo(p){const n=Number(safe(()=>p.getDynamicProperty(AMMO_KEY),MAX_AMMO));return Number.isFinite(n)?clamp(Math.floor(n),0,MAX_AMMO):MAX_AMMO;}
function setAmmo(p,n,show=false){const v=clamp(Math.floor(n),0,MAX_AMMO);safe(()=>p.setDynamicProperty(AMMO_KEY,v));if(show)bar(p,`§6리볼버 §f잔탄 §e${v}/${MAX_AMMO}`,35);return v;}
function key(p,id){return `${p.id}:${id}`;}
function cdLeft(p,id){return Math.max(0,Math.ceil(((cooldowns.get(key(p,id))??0)-now())/20));}
function startCd(p,id,sec){cooldowns.set(key(p,id),now()+Math.round(sec*20));}
function isBusy(p){return (sheriffBusyUntil.get(p.id)??0)>now();}
function busyLeft(p){return Math.max(0,((sheriffBusyUntil.get(p.id)??0)-now())/20);}
function beginBusy(p,sec){sheriffBusyUntil.set(p.id,now()+Math.round(sec*20));}
function clearBusy(p){sheriffBusyUntil.delete(p.id);}
function validateSkill(p,id,lv,cd,name){if(!isSheriff(p)){bar(p,"§c보안관 전용 스킬입니다.");return false;}if(level(p)<lv){bar(p,`§c${name}: Lv.${lv}에 해금됩니다.`);return false;}if(reloading.has(p.id)){bar(p,"§c재장전 중에는 사용할 수 없습니다.");return false;}if(isBusy(p)){bar(p,`§c다른 보안관 스킬 사용 중입니다. §7(${busyLeft(p).toFixed(1)}초)`);return false;}const left=cdLeft(p,id);if(left>0){bar(p,`§c${name} 쿨타임 ${left}초`);return false;}return true;}

function inventory(p){return safe(()=>p.getComponent("minecraft:inventory")?.container);}
function countItem(p,typeId){const c=inventory(p);if(!c)return 0;let n=0;for(let i=0;i<c.size;i++){const it=safe(()=>c.getItem(i));if(it?.typeId===typeId)n+=Number(it.amount??0);}return n;}
function consumeItem(p,typeId,count){const c=inventory(p);if(!c||count<=0)return 0;let remain=count,used=0;for(let i=0;i<c.size&&remain>0;i++){const it=safe(()=>c.getItem(i));if(!it||it.typeId!==typeId)continue;const take=Math.min(remain,Number(it.amount??0));if(take<=0)continue;const left=Number(it.amount??0)-take;if(left<=0)safe(()=>c.setItem(i,undefined));else{it.amount=left;safe(()=>c.setItem(i,it));}remain-=take;used+=take;}return used;}
function reloadTicks(p){return (quickReloadUntil.get(p.id)??0)>now()||(enhancedUntil.get(p.id)??0)>now()?FAST_RELOAD_TICKS:NORMAL_RELOAD_TICKS;}
function beginReload(p,forced=false){
  if(!isSheriff(p)||reloading.has(p.id))return false;
  const cur=ammo(p),missing=MAX_AMMO-cur;
  if(missing<=0){if(!forced)bar(p,"§7리볼버가 이미 6/6 장전되어 있습니다.");return false;}
  const singles=countItem(p,"geumyi:sheriff_bullet"),nuggets=countItem(p,"minecraft:iron_nugget");
  const availableSingles=singles+nuggets;
  // Single rounds always have priority. A six-pack is consumed only for an empty cylinder,
  // so it cannot silently discard its unused rounds.
  const bundle=availableSingles===0&&cur===0&&countItem(p,BUNDLE_ID)>0;
  const load=bundle?6:Math.min(missing,availableSingles);
  if(load<=0){bar(p,cur>0?"§c남은 탄을 소모한 뒤 묶음 탄약을 사용해 줘.":"§c탄환이 없어 재장전할 수 없습니다.",55);return false;}
  const ticks=Math.max(1,reloadTicks(p)-(bundle?2:0)); // 0.12 sec ≈ 2.4 ticks; round to 2 ticks (0.10 s)
  const st={end:now()+ticks,planned:load,bundle,ticks};reloading.set(p.id,st);
  safe(()=>p.addEffect("slowness",ticks+5,{amplifier:1,showParticles:false}));sound(p,"random.bow",.55,.35);
  const h=system.runInterval(()=>{try{
    if(reloading.get(p.id)!==st){system.clearRun(h);return;}
    bar(p,`§7재장전 중... §f${Math.min(100,Math.round((1-(st.end-now())/ticks)*100))}% §8| §e${ammo(p)}/6`,8);
    if(now()<st.end)return;
    system.clearRun(h);let used=0;
    if(st.bundle){if(ammo(p)===0&&consumeItem(p,BUNDLE_ID,1)===1)used=6;}
    else {used=consumeItem(p,"geumyi:sheriff_bullet",st.planned);if(used<st.planned)used+=consumeItem(p,"minecraft:iron_nugget",st.planned-used);}
    setAmmo(p,ammo(p)+used,false);reloading.delete(p.id);
